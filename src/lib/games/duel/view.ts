/**
 * What one player may see of a duel at a moment. Pure: the server builds it
 * from the stored match, and the offline practice match builds it in the
 * browser. The right answer for a round only appears once that round closes.
 */

import { diagnosisById } from "../diagnoses";
import { DX_POINTS, matchState, roundOrder, scoreAnswer, type AnswerRec, type MatchRec, type Side } from "./engine";
import type { DuelItem } from "./items";

export type DuelRoundView = {
  round: number;
  topic: string;
  correctDx: string;
  correctFeature: string;
  why: string;
  you: { dx: string | null; feature: string | null; points: number; ms: number | null; dxOk: boolean; featureOk: boolean };
  opp: { points: number; ms: number | null; dxOk: boolean; featureOk: boolean };
};

export type DuelView = {
  matchId: string;
  ranked: boolean;
  bot: boolean;
  serverNow: number;
  phase: "countdown" | "round" | "reveal" | "over";
  /** When the current phase ends (server clock). */
  until: number | null;
  round: number;
  totalRounds: number;
  question: null | { vignette: string; options: string[]; features: string[] };
  youAnswered: boolean;
  oppAnswered: boolean;
  closed: DuelRoundView[];
  score: { you: number; opp: number };
  ms: { you: number; opp: number };
  you: { name: string; rating: number | null };
  opp: { name: string; rating: number | null };
  result: null | { outcome: "win" | "loss" | "draw"; reason: "points" | "speed" | "draw" | "forfeit"; youForfeited: boolean; delta: number | null; rating: number | null };
};

export type ViewExtras = {
  names: { you: string; opp: string };
  ratings: { you: number | null; opp: number | null };
  /** Rating change once settled (null for unranked / not yet settled). */
  delta?: number | null;
  newRating?: number | null;
};

function dxName(id: string) {
  return diagnosisById(id)?.name ?? id;
}

export function buildDuelView(m: MatchRec, answers: AnswerRec[], now: number, me: string, items: (id: string) => DuelItem | undefined, extras: ViewExtras): DuelView {
  const s = matchState(m, answers, now);
  const side: Side = m.p1 === me ? "p1" : "p2";
  const other: Side = side === "p1" ? "p2" : "p1";
  const ph = s.phase;
  const round = ph.kind === "round" || ph.kind === "reveal" ? ph.round : ph.kind === "over" ? Math.max(0, s.rounds.filter((r) => r.end !== null).length - 1) : 0;

  const optionsFor = (r: number) => {
    const it = items(m.items[r]);
    if (!it) return null;
    const o = roundOrder(m.seed, r);
    return { it, options: o.options.map((k) => it.options[k]), features: o.features.map((k) => it.features[k]) };
  };

  let question: DuelView["question"] = null;
  if (ph.kind === "round" || ph.kind === "reveal") {
    const q = optionsFor(ph.round);
    if (q) question = { vignette: q.it.vignette, options: q.options.map(dxName), features: q.features };
  }

  const closed: DuelRoundView[] = [];
  s.rounds.forEach((t, r) => {
    if (t.end === null) return;
    const q = optionsFor(r);
    if (!q) return;
    const mine = s.answers[side][r];
    const theirs = s.answers[other][r];
    const ms = mine ? scoreAnswer(m.seed, r, mine.dx, mine.feature) : null;
    const ts = theirs ? scoreAnswer(m.seed, r, theirs.dx, theirs.feature) : null;
    closed.push({
      round: r,
      topic: q.it.topic,
      correctDx: dxName(q.it.options[0]),
      correctFeature: q.it.features[0],
      why: q.it.why,
      you: {
        dx: mine ? dxName(q.options[mine.dx]) : null,
        feature: mine ? q.features[mine.feature] : null,
        points: ms?.points ?? 0,
        ms: mine ? mine.at - t.start : null,
        dxOk: !!ms?.dxOk,
        featureOk: !!ms?.featureOk,
      },
      opp: { points: ts?.points ?? 0, ms: theirs ? theirs.at - t.start : null, dxOk: !!ts?.dxOk, featureOk: !!ts?.featureOk },
    });
  });

  const curRound = ph.kind === "round" ? ph.round : -1;
  // During an open round, the answer rows exist but stay hidden from totals; "locked in" is all we show.
  const youAnswered = curRound >= 0 && !!s.answers[side][curRound];
  const oppAnswered = curRound >= 0 && !!s.answers[other][curRound];

  let result: DuelView["result"] = null;
  if (s.outcome) {
    const o = s.outcome;
    result = {
      outcome: o.winner === null ? "draw" : o.winner === side ? "win" : "loss",
      reason: o.reason,
      youForfeited: o.forfeitSide === side,
      delta: extras.delta ?? null,
      rating: extras.newRating ?? null,
    };
  }

  return {
    matchId: m.id,
    ranked: m.ranked,
    bot: m.bot,
    serverNow: now,
    phase: result ? "over" : ph.kind === "waiting" ? "countdown" : ph.kind,
    until: ph.kind === "countdown" || ph.kind === "round" || ph.kind === "reveal" ? ph.until : null,
    round,
    totalRounds: m.items.length,
    question: result ? null : question,
    youAnswered,
    oppAnswered,
    closed,
    score: { you: s.totals[side].points, opp: s.totals[other].points },
    ms: { you: s.totals[side].ms, opp: s.totals[other].ms },
    you: { name: extras.names.you, rating: extras.ratings.you },
    opp: { name: extras.names.opp, rating: extras.ratings.opp },
    result,
  };
}

export const MAX_ROUND_POINTS = DX_POINTS + 50;
