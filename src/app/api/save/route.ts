import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { ownerTag } from "@/lib/save/owner";
import { SAVE_KINDS } from "@/lib/save/outbox";
import { learnEventsSchema, storeLearnEvents } from "@/lib/learn/events-store";
import { markLessonComplete, pingProgress } from "@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions";
import { saveLearnState } from "@/app/(dashboard)/study/actions";
import { recordMyAnswers } from "@/lib/history/actions";
import { isHistoryTool } from "@/lib/history/order";
import type { LearnState } from "@/lib/learn/engine";

export const runtime = "nodejs";

/**
 * POST /api/save: the browser outbox (src/lib/save/client.ts) sends queued
 * student work here. A plain route, not a Server Action, on purpose: a Server
 * Action's id changes with every deployment, so a tab opened before a deploy
 * could no longer save anything (Vercel logged hundreds of "Failed to find
 * Server Action" errors from lecture pages). This address never changes.
 *
 * Each save answers "ok" (stored), "retry" (keep it and send again) or "drop"
 * (it can never be stored). The whole request answers 401 when signed out (the
 * browser keeps everything) and 409 when the saves belong to another account.
 */

const MAX_BYTES = 256 * 1024;

const uuid = z.string().uuid();
const seconds = z.number().finite().min(0).max(24 * 60 * 60);
const payloads = {
  progress: z.object({ lessonId: uuid, watched: seconds, duration: seconds }),
  complete: z.object({ lessonId: uuid }),
  learn: z.object({ state: z.record(z.string(), z.unknown()) }),
  history: z.object({ tool: z.string().min(1).max(40), answers: z.array(z.object({ item: z.string().min(1).max(200), correct: z.boolean().nullable() })).max(100) }),
  events: learnEventsSchema,
} as const;

const bodySchema = z.object({
  owner: z.string().min(1).max(20),
  items: z.array(z.object({ id: z.string().min(1).max(80), kind: z.enum(SAVE_KINDS), payload: z.unknown() })).max(25),
});

type Status = "ok" | "retry" | "drop";
type Result = { id: string; status: Status; data?: Record<string, unknown> };

const fromAction = (r: { ok: boolean; retry?: boolean }): Status => (r.ok ? "ok" : r.retry === false ? "drop" : "retry");

export async function POST(req: Request) {
  const text = await req.text().catch(() => "");
  if (text.length > MAX_BYTES) return NextResponse.json({ error: "too large" }, { status: 413 });
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* handled below */
  }
  const body = bodySchema.safeParse(json);
  if (!body.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const session = await getSession();
  // A paused account can never save: the browser drops what it holds.
  if (session.status === "blocked") return NextResponse.json({ error: "paused" }, { status: 403 });
  if (session.status !== "ok") return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const profile = session.profile;
  if (ownerTag(profile.id) !== body.data.owner) return NextResponse.json({ error: "other account" }, { status: 409 });
  // Generous: a lecture pings every 10 s and a busy study page saves often.
  if (!rateLimitFast(`save:${profile.id}`, 240)) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const learner = profile.role === "student" || profile.role === "alumni";
  const results: Result[] = [];
  // One at a time, in the order they were made (no two writes race for one row).
  for (const item of body.data.items) {
    const parsed = payloads[item.kind].safeParse(item.payload);
    if (!parsed.success) {
      results.push({ id: item.id, status: "drop" });
      continue;
    }
    try {
      switch (item.kind) {
        case "progress": {
          const p = parsed.data as z.infer<typeof payloads.progress>;
          results.push({ id: item.id, status: fromAction(await pingProgress(p.lessonId, p.watched, p.duration)) });
          break;
        }
        case "complete": {
          const p = parsed.data as z.infer<typeof payloads.complete>;
          results.push({ id: item.id, status: fromAction(await markLessonComplete(p.lessonId)) });
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
  return NextResponse.json({ results });
}
