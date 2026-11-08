"use server";

import { z } from "zod";
import { excerptById } from "@/lib/games-sims/mse/excerpts";
import { EXCERPT_RIGHT, gradeExcerpt } from "@/lib/games-sims/mse/grade";
import { record } from "@/lib/history/server";
import { TERMS } from "@/lib/games-sims/mse/terms";
import { currentUser, gradeAnswers, saveResult } from "@/lib/games-sims/server/results";
import { hintedItems } from "@/lib/hints/server";
import { cappedOutcome, itemKey, POINTS_KEPT } from "@/lib/hints/rules";

const schema = z.object({
  id: z.string().max(10),
  tags: z.array(z.object({ domain: z.string().max(20).nullable(), term: z.string().max(30).nullable() })).max(8),
  streak: z.number().int().min(0).max(500),
  level: z.number().int().min(1).max(3),
  run: z.string().min(4).max(40).optional(),
});

/**
 * One finished excerpt: graded again on the server (the browser's score is
 * never trusted), sent to the student model finding by finding, and stored
 * for the cohort accuracy board. A finding with a hint counts for less.
 */
export async function submitMseExcerpt(input: z.infer<typeof schema>): Promise<{ ok: boolean }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const user = await currentUser();
  const e = excerptById(parsed.data.id);
  if (!user || !e) return { ok: false };
  const tags = parsed.data.tags.map((t) => ({ domain: t.domain as never, term: t.term }));
  const { results } = gradeExcerpt(e, tags);
  const run = parsed.data.run;
  const hinted = run ? await hintedItems(user.id, itemKey("mse", run, e.id, "")).catch(() => new Map<string, number>()) : new Map<string, number>();
  const used = (i: number) => (run && hinted.has(itemKey("mse", run, e.id, i)) ? 1 : 0);
  await gradeAnswers(
    user,
    e.findings.map((f, i) => ({
      skill: e.skill,
      item: `mse:${e.id}:${i}`,
      outcome: cappedOutcome(results[i].score, used(i)),
      options: 1 + f.o.filter((o) => o !== f.a).length,
      chosen: tags[i]?.term ? (TERMS as Record<string, { label: string }>)[tags[i].term!]?.label ?? null : null,
      correct: TERMS[f.a].label,
    })),
  );
  const right = results.reduce((a, r, i) => a + (used(i) ? r.score * POINTS_KEPT[1] : r.score), 0);
  const score = right / Math.max(1, e.findings.length);
  const [ok] = await Promise.all([
    saveResult(user.id, { game: "mse", item: e.id, score, right, total: e.findings.length, meta: { streak: parsed.data.streak, level: parsed.data.level } }),
    // Answer history: the excerpt, right at EXCERPT_RIGHT or above.
    record(user.id, "mse-lab", e.id, score >= EXCERPT_RIGHT),
  ]);
  return { ok };
}
