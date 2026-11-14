/**
 * What the browser is allowed to see of a case. Built on the server from the
 * case and the replayed progress, so the answer never leaves the server
 * mid-game, and clues or test results the student never opened never leave
 * it at all (not even after the case ends). After the end, `restOf` gives
 * them on request, when the student taps "Show the other clues".
 */

import { CHAPTERS, diagnosisById } from "../diagnoses";
import { canOpenClue, pointsUsed, scoreOf, shareGrid, type Progress, type Status } from "./engine";
import type { DailyCase, InvestigationKind } from "./types";

export type CaseView = {
  mode: "daily" | "practice";
  caseId: string;
  /** Made by AI (src/lib/ai-cases): the board shows the "AI case" badge. */
  ai: boolean;
  difficulty: 1 | 2 | 3;
  setting: string;
  /** Only the clues the student opened. */
  clues: string[];
  /** Clues open when the case ended (or now). */
  cluesOpen: number;
  /** How many clues and tests were never opened (their text stays on the server). */
  unopened: number;
  investigations: { i: number; kind: InvestigationKind; label: string; result: string | null; ordered: boolean }[];
  guesses: { dx: string; name: string; ok: boolean; sameChapter: boolean; reason: string }[];
  hints: { chapter: string | null; pointer: string | null; used: number };
  /** False from clue 4 on: a guess opens the next clue, "Next clue" doesn't. */
  canClue: boolean;
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
    clues: c.clues.slice(0, p.clues),
    cluesOpen: p.clues,
    unopened: Math.max(0, c.clues.length - p.clues) + c.investigations.filter((_, i) => !p.invs.includes(i)).length,
    investigations: c.investigations.map((x, i) => ({ i, kind: x.kind, label: x.label, result: p.invs.includes(i) ? x.result : null, ordered: p.invs.includes(i) })),
    guesses: p.guesses.map((g) => ({ ...g, name: diagnosisById(g.dx)?.name ?? g.dx })),
    hints: { used: p.hints, chapter: p.hints >= 1 || over ? CHAPTERS[c.chapter].name : null, pointer: p.hints >= 2 || over ? c.pointer : null },
    canClue: canOpenClue(p),
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
          // Sources are for admins only, and AI cases have none worth showing.
          refs: admin && opts.ai !== true ? c.refs : null,
        }
      : null,
  };
}

/** The clues and tests the student never opened. Only once the case is over; null before. */
export type CaseRest = { clues: { n: number; text: string }[]; tests: { kind: InvestigationKind; label: string; result: string }[] };

export function restOf(c: DailyCase, p: Progress): CaseRest | null {
  if (p.status === "playing") return null;
  return {
    clues: c.clues.slice(p.clues).map((text, i) => ({ n: p.clues + i + 1, text })),
    tests: c.investigations.filter((_, i) => !p.invs.includes(i)).map((x) => ({ kind: x.kind, label: x.label, result: x.result })),
  };
}
