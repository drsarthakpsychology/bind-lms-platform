"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { logEvents, recordAttempt } from "@/lib/learn/model/server";
import { bankItem, gradeChoice } from "@/lib/learn/model/topics";

const choice = z.union([z.number().int().min(0).max(10), z.boolean(), z.literal("skip")]);
const answer = z.object({ item: z.string().min(1).max(20), choice, ms: z.number().int().min(0).max(3_600_000).optional() });

/** Students and alumni get saved; everyone else (admins previewing) does not. */
async function learner(): Promise<string | null> {
  const s = await getSession();
  if (s.status !== "ok") return null;
  return s.profile.role === "student" || s.profile.role === "alumni" ? s.profile.id : null;
}

/**
 * One practice answer. Graded here from the content itself (the browser's own
 * check is only for instant feedback), then fed to the student model.
 */
export async function answerPractice(input: { item: string; choice: number | boolean | "skip"; ms?: number }): Promise<{ ok: boolean; saved: boolean }> {
  const parsed = answer.safeParse(input);
  if (!parsed.success) return { ok: false, saved: false };
  const b = bankItem(parsed.data.item);
  if (!b) return { ok: false, saved: false };
  const g = gradeChoice(b.item, parsed.data.choice);
  const userId = await learner();
  if (!userId) return { ok: g.ok, saved: false };
  const mcq = b.item.kind === "mcq";
  await Promise.all([
    recordAttempt(userId, { skill: b.skill, item: b.item.id, outcome: g.ok ? 1 : 0, chosen: mcq ? g.chosen : null, correct: mcq ? g.correct : null }),
    logEvents(userId, [
      {
        type: "game",
        kind: "practice",
        ok: g.ok,
        score: g.ok ? 1 : 0,
        skill: b.skill,
        item: b.item.id,
        prompt: b.item.kind === "mcq" ? b.item.prompt : b.item.statement,
        ms: parsed.data.ms ?? null,
        path: "/study/map/practice",
      },
    ]),
  ]);
  return { ok: g.ok, saved: true };
}
