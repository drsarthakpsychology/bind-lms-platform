import "server-only";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { skillFromPath } from "@/lib/learn/model/skills";
import { recordAttempts } from "@/lib/learn/model/server";
import { attemptsFromEvents } from "@/lib/learn/model/events";
import { withRetry } from "@/lib/save/retry";

const event = z.object({
  type: z.enum(["widget", "game", "term", "level"]),
  kind: z.string().max(40),
  ok: z.boolean().optional(),
  score: z.number().min(0).max(1).optional(),
  prompt: z.string().max(200).optional(),
  skill: z.string().max(80).optional(),
  item: z.string().max(120).optional(),
  ms: z.number().int().min(0).max(3_600_000).optional(),
  /** Multiple choice only: what was picked and the right answer (feeds mix-ups; not stored in learn_events). */
  chosen: z.string().max(200).optional(),
  correct: z.string().max(200).optional(),
  at: z.string().datetime(),
});
export const learnEventsSchema = z.object({ events: z.array(event).max(50), path: z.string().max(300) });
export type LearnEventsBody = z.infer<typeof learnEventsSchema>;

/**
 * Store a batch of learning events for one student and feed the ones with a
 * result into the student model. Shared by /api/learn/events and /api/save.
 * Returns "ok", "retry" (the database did not take them) or "drop".
 */
export async function storeLearnEvents(userId: string, body: LearnEventsBody): Promise<"ok" | "retry" | "drop"> {
  if (!body.events.length) return "ok";
  const fallbackSkill = skillFromPath(body.path);
  const rows = body.events.map((e) => ({
    user_id: userId,
    type: e.type,
    kind: e.kind,
    ok: e.ok ?? null,
    score: e.score ?? (e.ok === undefined ? null : e.ok ? 1 : 0),
    skill: e.skill ?? fallbackSkill,
    item: e.item ?? null,
    prompt: e.prompt ?? null,
    ms: e.ms ?? null,
    path: body.path.split("?")[0],
    created_at: e.at,
  }));
  let db: ReturnType<typeof createAdminClient>;
  try {
    db = createAdminClient();
  } catch {
    return "drop";
  }
  const { error } = await withRetry(() => db.from("learn_events").insert(rows));
  if (error) {
    console.error("storeLearnEvents: learn_events write failed:", error.code, error.message);
    return "retry";
  }
  const attempts = attemptsFromEvents(rows, body.events);
  if (attempts.length) await recordAttempts(userId, attempts);
  return "ok";
}
