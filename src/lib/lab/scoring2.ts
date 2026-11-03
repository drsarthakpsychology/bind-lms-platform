/**
 * Psychology Lab, batch 2: the maths behind experiments 8 to 12. Pure
 * functions only. Randomness always comes from a generator passed in (use
 * `seeded` from ./scoring), so every result is testable and nothing random
 * runs during render.
 */

import { mean } from "./scoring";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/* ------------------------------------------------------------------ */
/* Classical conditioning (teaching model)                             */
/* ------------------------------------------------------------------ */

/**
 * The Rescorla–Wagner update: the change in associative strength is
 * proportional to the prediction error (what happened minus what was
 * expected). `lambda` is 1 when food follows the tone, 0 when it does not.
 */
export function rescorlaWagner(v: number, lambda: number, alphaBeta: number): number {
  return v + alphaBeta * (lambda - v);
}

/**
 * Extinction is modelled as new inhibitory learning laid on top of the
 * original excitatory learning (as Bouton describes), not as erasure. That
 * is what lets the response come back after a rest. A teaching model, not
 * fitted to real data.
 */
export type CondState = { excite: number; inhibit: number };
export type CondTrial = "pair" | "tone" | "rest";
export const COND_PARAMS = { pair: 0.3, ext: 0.25, restRecovery: 0.5 } as const;

export function condStart(): CondState {
  return { excite: 0, inhibit: 0 };
}

/** What the tone now predicts, 0 to 1. This is the modelled response strength. */
export function condResponse(s: CondState): number {
  return clamp01(s.excite - s.inhibit);
}

export function condStep(s: CondState, trial: CondTrial, p: { pair: number; ext: number; restRecovery: number } = COND_PARAMS): CondState {
  const v = condResponse(s);
  if (trial === "pair") {
    // Error-driven gain, plus some loss of the extinction learning: this is why relearning is fast ("savings").
    const gain = rescorlaWagner(v, 1, p.pair) - v;
    return { excite: s.excite + gain, inhibit: s.inhibit * (1 - p.pair) };
  }
  if (trial === "tone") {
    const drop = v - rescorlaWagner(v, 0, p.ext);
    return { excite: s.excite, inhibit: s.inhibit + drop };
  }
  // A rest: extinction learning partly fades, the original learning does not.
  return { excite: s.excite, inhibit: s.inhibit * (1 - p.restRecovery) };
}

/** Runs a list of trials; returns the response (0 to 1) measured on each tone trial and after each rest. */
export function runConditioning(trials: readonly CondTrial[], p = COND_PARAMS): { states: CondState[]; responses: number[] } {
  let s = condStart();
  const states: CondState[] = [];
  const responses: number[] = [];
  for (const t of trials) {
    // The response on a trial is what the tone predicted when it sounded, before learning from that trial.
    responses.push(condResponse(s));
    s = condStep(s, t, p);
    states.push(s);
  }
  return { states, responses };
}

/**
 * Stimulus generalisation: a tone that sounds similar gets part of the
 * response. `distance` is in arbitrary "steps" away from the trained tone.
 */
export function generalise(v: number, distance: number, width = 1.2): number {
  return v * Math.exp(-(distance * distance) / (2 * width * width));
}

/* ------------------------------------------------------------------ */
/* Design the study                                                    */
/* ------------------------------------------------------------------ */

export type DesignChoices = {
  sample: "volunteers" | "extreme" | "random" | null;
  size: "tiny" | "medium" | "large" | null;
  control: "none" | "waitlist" | "active" | null;
  assign: "choose" | "college" | "random" | null;
  blind: "told" | "masked" | null;
  measure: "ask" | "after" | "prepost" | null;
};

export const EMPTY_DESIGN: DesignChoices = { sample: null, size: null, control: null, assign: null, blind: null, measure: null };

export type ThreatId = "sample" | "regression" | "time" | "placebo" | "confound" | "demand" | "measure" | "chance";

export const THREATS: { id: ThreatId; name: string; open: string; fix: string }[] = [
  {
    id: "sample",
    name: "Selection bias",
    open: "Volunteers who already like the idea, or only the most anxious, are not typical students. The result may not apply to everyone.",
    fix: "Invite a random sample from several colleges.",
  },
  {
    id: "regression",
    name: "Regression to the mean",
    open: "People picked because they scored very high this week will usually score lower next time anyway. That drop looks like the app working.",
    fix: "Avoid picking only extreme scorers, or randomise them into two groups so both drift the same way.",
  },
  {
    id: "time",
    name: "Change over time",
    open: "Without a comparison group, any change could be due to time passing, the exam getting closer or further, or the term changing.",
    fix: "Add a comparison group measured at the same times.",
  },
  {
    id: "placebo",
    name: "Placebo and expectation",
    open: "People who get any new app and attention may feel better because they expect to. A group that gets nothing cannot rule this out.",
    fix: "Compare with a look-alike app (for example, relaxing sounds) that lacks the mindfulness part.",
  },
  {
    id: "confound",
    name: "Groups differ at the start (confounds)",
    open: "If students choose, or whole colleges are assigned, the groups may differ in motivation, stress or teaching before the study starts.",
    fix: "Use random assignment so the groups are alike on average, including on things you did not measure.",
  },
  {
    id: "demand",
    name: "Demand characteristics",
    open: "When students know what you hope to find, or are asked a leading question, they may give the answer they think you want.",
    fix: "Do not tell them which app you expect to work, and use a standard questionnaire rather than \"did it help?\".",
  },
  {
    id: "measure",
    name: "Weak measurement",
    open: "A single question, or measuring only at the end, cannot show change. You need a reliable scale and a starting point.",
    fix: "Use the same validated anxiety questionnaire before and after.",
  },
  {
    id: "chance",
    name: "Chance (too few people)",
    open: "With small groups, a difference can appear or vanish by luck alone.",
    fix: "Use enough people per group (often 100 or more for a small effect; a power calculation decides).",
  },
];

/** Which threats are still open for these choices. Unanswered choices count as open. */
export function openThreats(c: DesignChoices): Set<ThreatId> {
  const open = new Set<ThreatId>();
  const hasControl = c.control === "waitlist" || c.control === "active";
  const randomised = hasControl && c.assign === "random";
  if (c.sample !== "random") open.add("sample");
  if (c.sample === null || (c.sample === "extreme" && !randomised)) open.add("regression");
  if (!hasControl) open.add("time");
  if (c.control !== "active") open.add("placebo");
  if (!randomised) open.add("confound");
  if (c.blind !== "masked" || c.measure === "ask" || c.measure === null) open.add("demand");
  if (c.measure !== "prepost") open.add("measure");
  if (c.size !== "large") open.add("chance");
  return open;
}

export function designScore(c: DesignChoices): { closed: number; of: number; percent: number } {
  const of = THREATS.length;
  const closed = of - openThreats(c).size;
  return { closed, of, percent: Math.round((closed / of) * 100) };
}

/** Every choice made (assignment only matters when there is a comparison group). */
export function designComplete(c: DesignChoices): boolean {
  const needAssign = c.control === "waitlist" || c.control === "active";
  return !!(c.sample && c.size && c.control && c.blind && c.measure && (!needAssign || c.assign));
}

/* ------------------------------------------------------------------ */
/* Correlation or cause                                                */
/* ------------------------------------------------------------------ */

/** A standard normal draw (Box–Muller) from a uniform generator. */
export function normal(rand: () => number): number {
  let u = 0;
  while (u === 0) u = rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Pearson's r. Returns 0 when either variable does not vary. */
export function pearson(xs: readonly number[], ys: readonly number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  const mx = mean(xs.slice(0, n));
  const my = mean(ys.slice(0, n));
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }
  if (sxx === 0 || syy === 0) return 0;
  return sxy / Math.sqrt(sxx * syy);
}

/** r between x and y once z is held constant (first-order partial correlation). */
export function partialR(xs: readonly number[], ys: readonly number[], zs: readonly number[]): number {
  const rxy = pearson(xs, ys);
  const rxz = pearson(xs, zs);
  const ryz = pearson(ys, zs);
  const d = Math.sqrt((1 - rxz * rxz) * (1 - ryz * ryz));
  return d === 0 ? 0 : (rxy - rxz * ryz) / d;
}

export type Point = { x: number; y: number; z?: number; hidden?: boolean };

/** n points whose true correlation is `r`, on standard scales. */
export function correlatedPoints(n: number, r: number, rand: () => number): Point[] {
  const out: Point[] = [];
  const k = Math.sqrt(1 - r * r);
  for (let i = 0; i < n; i++) {
    const x = normal(rand);
    out.push({ x, y: r * x + k * normal(rand) });
  }
  return out;
}

/**
 * x and y both driven by a hidden two-level z (z = -1 or 1, e.g. younger and
 * older children); x does nothing to y. Within each level there is no link.
 */
export function thirdVariablePoints(n: number, rand: () => number, strength = 0.85): Point[] {
  const k = Math.sqrt(1 - strength * strength);
  const out: Point[] = [];
  for (let i = 0; i < n; i++) {
    const z = i % 2 === 0 ? 1 : -1;
    out.push({ x: strength * z + k * normal(rand), y: strength * z + k * normal(rand), z });
  }
  return out;
}

/**
 * A population with a real link, then only the top slice on x is kept (like
 * a selective admission). Points outside the slice are marked `hidden`.
 */
export function restrictedRangePoints(n: number, r: number, keepTop: number, rand: () => number): Point[] {
  const pts = correlatedPoints(n, r, rand);
  const cut = [...pts].map((p) => p.x).sort((a, b) => b - a)[Math.max(0, Math.floor(n * keepTop) - 1)];
  return pts.map((p) => ({ ...p, hidden: p.x < cut }));
}

/**
 * A tiny sample drawn from a population with NO link, re-drawn until it
 * happens to look striking. This is what reporting only the eye-catching
 * small study does.
 */
export function flukePoints(n: number, minAbsR: number, rand: () => number, maxTries = 5000): Point[] {
  let best: Point[] = correlatedPoints(n, 0, rand);
  for (let t = 0; t < maxTries && rOf(best) < minAbsR; t++) {
    const pts = correlatedPoints(n, 0, rand);
    if (rOf(pts) > rOf(best)) best = pts;
  }
  return best;
}

/** r of the visible points. */
export function rOf(pts: readonly Point[]): number {
  const v = pts.filter((p) => !p.hidden);
  return pearson(
    v.map((p) => p.x),
    v.map((p) => p.y),
  );
}

/** Round r for display, e.g. 0.42. */
export function roundR(r: number): number {
  return Math.round(r * 100) / 100;
}

/** Rough words for the size of a correlation (absolute value). */
export function rWords(r: number): string {
  const a = Math.abs(r);
  if (a < 0.1) return "almost none";
  if (a < 0.3) return "weak";
  if (a < 0.5) return "moderate";
  return "strong";
}

/* ------------------------------------------------------------------ */
/* Attribution                                                         */
/* ------------------------------------------------------------------ */

/**
 * Ratings run 0 (all the situation) to 100 (all the person). Lean is the
 * average distance above the midpoint: positive means a pull towards
 * explaining behaviour by character. Shift is how far ratings moved once the
 * situation was known.
 */
export function attributionSummary(rows: readonly { before: number; after: number }[]): { before: number; after: number; lean: number; shift: number } {
  if (!rows.length) return { before: 50, after: 50, lean: 0, shift: 0 };
  const before = Math.round(mean(rows.map((r) => r.before)));
  const after = Math.round(mean(rows.map((r) => r.after)));
  return { before, after, lean: before - 50, shift: before - after };
}

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

/** Count of answers that match the key. */
export function countRight<T>(answers: readonly (T | null)[], key: readonly T[]): number {
  return answers.reduce<number>((n, a, i) => n + (a !== null && a === key[i] ? 1 : 0), 0);
}
