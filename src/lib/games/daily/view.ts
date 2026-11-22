/**
 * What the browser is allowed to see of a case. Built on the server from the
 * case and the replayed progress, so the answer never leaves the server
 * mid-game, and clues or test results the student never opened never leave
 * it at all (not even after the case ends). After the end, `restOf` gives
 * them on request, when the student taps "Show the other clues".
 */

import { CHAPTERS, diagnosisById } from "../diagnoses";
import { canOpenClue, HINT_COST, hintUsesAllowance, MAX_HINTS, pointsUsed, scoreOf, shareGrid, type Progress, type Status } from "./engine";
import type { DailyCase, GuideHints, InvestigationKind, Opening } from "./types";

export type CaseView = {
  mode: "daily" | "practice";
  caseId: string;
  /** Made by AI (src/lib/ai-cases): the board shows the "AI case" badge. */
  ai: boolean;
  difficulty: 1 | 2 | 3;
  setting: string;
  /** The free starting picture (null for a case written without one). */
  opening: Opening | null;
  /** Only the clues the student opened. */
  clues: string[];
  /** Clues open when the case ended (or now). */
  cluesOpen: number;
  /** How many clues and tests were never opened (their text stays on the server). */
  unopened: number;
  investigations: { i: number; kind: InvestigationKind; label: string; result: string | null; ordered: boolean }[];
  guesses: { dx: string; name: string; ok: boolean; sameChapter: boolean; reason: string }[];
  hints: {
    /** Older phones show these two lines; newer screens show `steps`. */
    chapter: string | null;
    pointer: string | null;
    used: number;
    /** The guided hints opened so far, in order. */
    steps: string[];
    max: number;
    /** What the next hint costs, or null when none are left. */
    next: { n: number; points: number; usesHint: boolean } | null;
  };
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

/** The three guided hints: the case's own, or built from its chapter, pointer and look-alikes. */
export function guideOf(c: DailyCase): GuideHints {
  if (c.guide) return c.guide;
  const names = c.differentials.slice(0, 2).map((x) => diagnosisById(x.dx)?.name ?? x.dx);
  return [
    `Think of the ${CHAPTERS[c.chapter].name.toLowerCase()}.`,
    c.pointer,
    names.length ? `Weigh it against ${names.join(" and ")}: one detail in the case rules each of them out.` : "Go back to the detail that has lasted longest, and count it against the rule for each choice.",
  ];
}

export function buildView(c: DailyCase, p: Progress, mode: "daily" | "practice", admin: boolean, opts: { ai?: boolean } = {}): CaseView {
  const over = p.status !== "playing";
  return {
    mode,
    caseId: c.id,
    ai: opts.ai === true,
    difficulty: c.difficulty,
    setting: c.setting,
    opening: c.opening ?? null,
    clues: c.clues.slice(0, p.clues),
    cluesOpen: p.clues,
    unopened: Math.max(0, c.clues.length - p.clues) + c.investigations.filter((_, i) => !p.invs.includes(i)).length,
    investigations: c.investigations.map((x, i) => ({ i, kind: x.kind, label: x.label, result: p.invs.includes(i) ? x.result : null, ordered: p.invs.includes(i) })),
    guesses: p.guesses.map((g) => ({ ...g, name: diagnosisById(g.dx)?.name ?? g.dx })),
    hints: hintsView(c, p, over),
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

function hintsView(c: DailyCase, p: Progress, over: boolean): CaseView["hints"] {
  const guide = guideOf(c);
  const steps = guide.slice(0, over ? MAX_HINTS : p.hints);
  const n = p.hints + 1;
  return {
    used: p.hints,
    // Older phones read only these: the opened hints as one block.
    chapter: null,
    pointer: steps.length ? steps.join(" ") : null,
    steps,
    max: MAX_HINTS,
    next: !over && p.hints < MAX_HINTS ? { n, points: HINT_COST[p.hints], usesHint: hintUsesAllowance(n) } : null,
  };
}
