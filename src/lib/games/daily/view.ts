/**
 * What the browser is allowed to see of a case. Built on the server from the
 * case and the replayed progress, so the answer, the unrevealed clues and the
 * unordered investigation results never leave the server mid-game.
 */

import { CHAPTERS, diagnosisById } from "../diagnoses";
import { pointsUsed, scoreOf, shareGrid, type Progress, type Status } from "./engine";
import type { DailyCase, InvestigationKind } from "./types";

export type CaseView = {
  mode: "daily" | "practice";
  caseId: string;
  /** Made by AI (src/lib/ai-cases): the board shows the "AI case" badge. */
  ai: boolean;
  difficulty: 1 | 2 | 3;
  setting: string;
  clues: string[];
  /** Clues open when the case ended (or now). */
  cluesOpen: number;
  investigations: { i: number; kind: InvestigationKind; label: string; result: string | null; ordered: boolean }[];
  guesses: { dx: string; name: string; ok: boolean; sameChapter: boolean; reason: string }[];
  hints: { chapter: string | null; pointer: string | null; used: number };
  status: Status;
  points: number;
  score: number;
  grid: string;
  reveal: null | {
    answer: string;
    chapter: string;
    topic: string;
    overview: string;
    lookAlikes: { name: string; whyNot: string }[];
    module: string;
    refs: string[] | null;
  };
};

export function buildView(c: DailyCase, p: Progress, mode: "daily" | "practice", admin: boolean, opts: { ai?: boolean } = {}): CaseView {
  const over = p.status !== "playing";
  return {
    mode,
    caseId: c.id,
    ai: opts.ai === true,
    difficulty: c.difficulty,
    setting: c.setting,
    clues: over ? [...c.clues] : c.clues.slice(0, p.clues),
    cluesOpen: p.clues,
    investigations: c.investigations.map((x, i) => ({ i, kind: x.kind, label: x.label, result: over || p.invs.includes(i) ? x.result : null, ordered: p.invs.includes(i) })),
    guesses: p.guesses.map((g) => ({ ...g, name: diagnosisById(g.dx)?.name ?? g.dx })),
    hints: { used: p.hints, chapter: p.hints >= 1 || over ? CHAPTERS[c.chapter].name : null, pointer: p.hints >= 2 || over ? c.pointer : null },
    status: p.status,
    points: pointsUsed(p),
    score: scoreOf(p),
    grid: shareGrid(p),
    reveal: over
      ? {
          answer: diagnosisById(c.answer)?.name ?? c.answer,
          chapter: CHAPTERS[c.chapter].name,
          topic: CHAPTERS[c.chapter].topic,
          overview: c.overview,
          lookAlikes: c.differentials.map((x) => ({ name: diagnosisById(x.dx)?.name ?? x.dx, whyNot: x.whyNot })),
          module: c.module,
          refs: admin ? c.refs : null,
        }
      : null,
  };
}
