import { z } from "zod";
import { SAVE_KINDS } from "@/lib/save/outbox";
import { learnEventsSchema, storeLearnEvents } from "@/lib/learn/events-store";
import { markLessonComplete, pingProgress } from "@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions";
import { saveLearnState } from "@/app/(dashboard)/study/actions";
import { recordMyAnswers } from "@/lib/history/actions";
import { isHistoryTool } from "@/lib/history/order";
import type { LearnState } from "@/lib/learn/engine";

/**
 * Applies a batch of queued saves for the signed-in caller. One function for
 * both doors: the website's POST /api/save (browser outbox) and the mobile
 * app's POST /api/app/v1/save. Each save answers "ok" (stored), "retry" (keep
 * it and send again) or "drop" (it can never be stored).
 */

export const MAX_SAVE_BYTES = 256 * 1024;

const uuid = z.string().uuid();
const seconds = z.number().finite().min(0).max(24 * 60 * 60);
const payloads = {
  progress: z.object({ lessonId: uuid, watched: seconds, duration: seconds }),
  complete: z.object({ lessonId: uuid }),
  learn: z.object({ state: z.record(z.string(), z.unknown()) }),
  history: z.object({ tool: z.string().min(1).max(40), answers: z.array(z.object({ item: z.string().min(1).max(200), correct: z.boolean().nullable() })).max(100) }),
  events: learnEventsSchema,
} as const;

export const saveItemsSchema = z.array(z.object({ id: z.string().min(1).max(80), kind: z.enum(SAVE_KINDS), payload: z.unknown() })).max(25);

export type SaveItemInput = z.infer<typeof saveItemsSchema>[number];
export type SaveStatus = "ok" | "retry" | "drop";
export type SaveItemResult = { id: string; status: SaveStatus; data?: Record<string, unknown> };

type Status = SaveStatus;
type Result = SaveItemResult;

const fromAction = (r: { ok: boolean; retry?: boolean }): Status => (r.ok ? "ok" : r.retry === false ? "drop" : "retry");

export async function applySaves(profile: { id: string; role: string }, items: readonly SaveItemInput[]): Promise<SaveItemResult[]> {
  const learner = profile.role === "student" || profile.role === "alumni";
  const results: Result[] = [];
  // One at a time, in the order they were made (no two writes race for one row).
  for (const item of items) {
    const parsed = payloads[item.kind].safeParse(item.payload);
    if (!parsed.success) {
      results.push({ id: item.id, status: "drop" });
      continue;
    }
    try {
      switch (item.kind) {
        case "progress": {
          const p = parsed.data as z.infer<typeof payloads.progress>;
          const r = await pingProgress(p.lessonId, p.watched, p.duration);
          results.push({ id: item.id, status: fromAction(r), data: r.completed ? { completed: true } : undefined });
          break;
        }
        case "complete": {
          const p = parsed.data as z.infer<typeof payloads.complete>;
          const r = await markLessonComplete(p.lessonId);
          results.push({ id: item.id, status: fromAction(r), data: r.completed ? { completed: true } : undefined });
          break;
        }
        case "learn": {
          const p = parsed.data as z.infer<typeof payloads.learn>;
          const r = await saveLearnState(p.state as unknown as LearnState);
          results.push({ id: item.id, status: fromAction(r), data: r.clamped ? { clamped: true } : undefined });
          break;
        }
        case "history": {
          const p = parsed.data as z.infer<typeof payloads.history>;
          if (!isHistoryTool(p.tool) || !p.answers.length) {
            results.push({ id: item.id, status: "drop" });
            break;
          }
          const r = await recordMyAnswers(p.tool, p.answers);
          results.push({ id: item.id, status: r.ok ? "ok" : "retry" });
          break;
        }
        case "events": {
          // Staff previews are not part of the student model: accepted and not stored.
          const p = parsed.data as z.infer<typeof payloads.events>;
          results.push({ id: item.id, status: learner ? await storeLearnEvents(profile.id, p) : "ok" });
          break;
        }
      }
    } catch (e) {
      console.error(`api/save: ${item.kind} failed:`, e instanceof Error ? e.message : e);
      results.push({ id: item.id, status: "retry" });
    }
  }
  return results;
}
