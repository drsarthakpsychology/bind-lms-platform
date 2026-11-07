"use server";

import { z } from "zod";
import { excerptById } from "@/lib/games-sims/mse/excerpts";
import { gradeExcerpt } from "@/lib/games-sims/mse/grade";
import { TERMS } from "@/lib/games-sims/mse/terms";
import { currentUser, gradeAnswers, saveResult } from "@/lib/games-sims/server/results";

const schema = z.object({
  id: z.string().max(10),
  tags: z.array(z.object({ domain: z.string().max(20).nullable(), term: z.string().max(30).nullable() })).max(8),
  streak: z.number().int().min(0).max(500),
  level: z.number().int().min(1).max(3),
});

/**
 * One finished excerpt: graded again on the server (the browser's score is
 * never trusted), sent to the student model finding by finding, and stored
 * for the cohort accuracy board.
 */
export async function submitMseExcerpt(input: z.infer<typeof schema>): Promise<{ ok: boolean }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const user = await currentUser();
  const e = excerptById(parsed.data.id);
  if (!user || !e) return { ok: false };
  const tags = parsed.data.tags.map((t) => ({ domain: t.domain as never, term: t.term }));
  const { score, results } = gradeExcerpt(e, tags);
  await gradeAnswers(
    user,
    e.findings.map((f, i) => ({
      skill: e.skill,
      item: `mse:${e.id}:${i}`,
      outcome: results[i].score,
      chosen: tags[i]?.term ? (TERMS as Record<string, { label: string }>)[tags[i].term!]?.label ?? null : null,
      correct: TERMS[f.a].label,
    })),
  );
  const right = results.reduce((a, r) => a + r.score, 0);
  const ok = await saveResult(user.id, { game: "mse", item: e.id, score, right, total: e.findings.length, meta: { streak: parsed.data.streak, level: parsed.data.level } });
  return { ok };
}
