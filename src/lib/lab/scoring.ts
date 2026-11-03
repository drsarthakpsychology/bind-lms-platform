/**
 * Psychology Lab: the maths behind each experiment. Pure functions only (no
 * DOM, no timers, no randomness unless a seeded generator is passed in), so
 * every result a student sees can be unit-tested.
 */

/** Small seeded PRNG (mulberry32). Same seed, same sequence: used for tests and replays. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], rand: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function median(xs: readonly number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function mean(xs: readonly number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

/* ------------------------------------------------------------------ */
/* Digit span                                                          */
/* ------------------------------------------------------------------ */

/** A random digit string of length n with no digit repeated back to back. */
export function digitSequence(n: number, rand: () => number = Math.random): number[] {
  const out: number[] = [];
  while (out.length < n) {
    const d = Math.floor(rand() * 10);
    if (d !== out[out.length - 1]) out.push(d);
  }
  return out;
}

/** Is the typed answer right? Backward span expects the sequence reversed. */
export function spanCorrect(shown: readonly number[], typed: string, backward: boolean): boolean {
  const want = (backward ? [...shown].reverse() : shown).join("");
  return typed.replace(/\D/g, "") === want;
}

/**
 * Span = the longest length passed. The standard clinical rule (two trials
 * per length, stop after two failures at one length) is applied by the
 * runner; this just reads the trial log.
 */
export function spanFromTrials(trials: readonly { length: number; correct: boolean }[]): number {
  return trials.filter((t) => t.correct).reduce((a, t) => Math.max(a, t.length), 0);
}

/** Stop rule: two failures at the same length ends the test. */
export function spanShouldStop(trials: readonly { length: number; correct: boolean }[], length: number): boolean {
  return trials.filter((t) => t.length === length && !t.correct).length >= 2;
}

/* ------------------------------------------------------------------ */
/* Serial position (free recall)                                       */
/* ------------------------------------------------------------------ */

export const WORD_POOL = [
  "candle", "river", "pencil", "garden", "monkey", "button", "ladder", "window",
  "carpet", "basket", "mirror", "rocket", "tunnel", "violin", "parrot", "saddle",
  "helmet", "pillow", "kettle", "anchor", "bucket", "castle", "feather", "lemon",
  "magnet", "napkin", "orange", "puzzle", "rabbit", "silver", "tiger", "wallet",
  "blanket", "camera", "dragon", "engine", "forest", "hammer", "jacket", "kitten",
] as const;

/** Normalise a typed recall list: lower-case, unique, letters only. */
export function parseRecall(text: string): string[] {
  const seen = new Set<string>();
  for (const w of text.toLowerCase().split(/[^a-z]+/)) if (w) seen.add(w);
  return [...seen];
}

/**
 * Which list positions were recalled. Accepts a near-miss spelling (one
 * letter off) so typing speed does not distort the curve.
 */
export function recalledPositions(list: readonly string[], recalled: readonly string[]): boolean[] {
  return list.map((w) => recalled.some((r) => r === w || editDistanceAtMostOne(r, w)));
}

export function editDistanceAtMostOne(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1 || Math.min(a.length, b.length) < 4) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/**
 * Proportion recalled at each position across trials. Each trial is a
 * boolean per position (same list length every trial).
 */
export function serialCurve(trials: readonly boolean[][]): number[] {
  if (!trials.length) return [];
  const n = trials[0].length;
  return Array.from({ length: n }, (_, p) => mean(trials.map((t) => (t[p] ? 1 : 0))));
}

/** Split a curve into primacy (first 3), middle and recency (last 3) averages. */
export function curveRegions(curve: readonly number[]): { primacy: number; middle: number; recency: number } {
  if (curve.length < 7) return { primacy: mean(curve), middle: mean(curve), recency: mean(curve) };
  return {
    primacy: mean(curve.slice(0, 3)),
    middle: mean(curve.slice(3, -3)),
    recency: mean(curve.slice(-3)),
  };
}

/* ------------------------------------------------------------------ */
/* Stroop                                                              */
/* ------------------------------------------------------------------ */

export const STROOP_COLOURS = [
  { name: "red", key: "r", css: "#c62828" },
  { name: "blue", key: "b", css: "#1565c0" },
  { name: "green", key: "g", css: "#2e7d32" },
  { name: "purple", key: "p", css: "#6a1b9a" },
] as const;

export type StroopTrial = { word: string; ink: string; congruent: boolean };
export type StroopResponse = StroopTrial & { answer: string; rt: number };

/** Half congruent, half incongruent, shuffled. */
export function stroopTrials(n: number, rand: () => number = Math.random): StroopTrial[] {
  const names = STROOP_COLOURS.map((c) => c.name);
  const out: StroopTrial[] = [];
  for (let i = 0; i < n; i++) {
    const ink = names[Math.floor(rand() * names.length)];
    if (i % 2 === 0) out.push({ word: ink, ink, congruent: true });
    else {
      const others = names.filter((x) => x !== ink);
      out.push({ word: others[Math.floor(rand() * others.length)], ink, congruent: false });
    }
  }
  return shuffle(out, rand);
}

/**
 * The Stroop effect: median correct-trial RT (incongruent minus congruent).
 * Medians, because one slow, distracted trial should not swing the result.
 * Responses faster than 200 ms are anticipations and dropped.
 */
export function stroopEffect(rs: readonly StroopResponse[]) {
  const ok = rs.filter((r) => r.answer === r.ink && r.rt >= 200 && r.rt <= 5000);
  const con = ok.filter((r) => r.congruent).map((r) => r.rt);
  const inc = ok.filter((r) => !r.congruent).map((r) => r.rt);
  const errors = (c: boolean) => rs.filter((r) => r.congruent === c && r.answer !== r.ink).length;
  return {
    congruentMs: Math.round(median(con)),
    incongruentMs: Math.round(median(inc)),
    effectMs: Math.round(median(inc) - median(con)),
    congruentErrors: errors(true),
    incongruentErrors: errors(false),
    usable: con.length >= 4 && inc.length >= 4,
  };
}

/* ------------------------------------------------------------------ */
/* Change detection (visual working memory)                            */
/* ------------------------------------------------------------------ */

export type ChangeTrial = { setSize: number; changed: boolean; saidChanged: boolean };

/**
 * Cowan's K = N × (hit rate − false-alarm rate), per set size. A rough
 * estimate of how many items were held in mind; it can be negative with
 * guessing, so it is floored at 0 for display.
 */
export function cowanK(trials: readonly ChangeTrial[]): { setSize: number; k: number; hits: number; falseAlarms: number }[] {
  const sizes = [...new Set(trials.map((t) => t.setSize))].sort((a, b) => a - b);
  return sizes.map((n) => {
    const at = trials.filter((t) => t.setSize === n);
    const change = at.filter((t) => t.changed);
    const same = at.filter((t) => !t.changed);
    const h = change.length ? change.filter((t) => t.saidChanged).length / change.length : 0;
    const fa = same.length ? same.filter((t) => t.saidChanged).length / same.length : 0;
    return { setSize: n, k: Math.max(0, Math.round(n * (h - fa) * 10) / 10), hits: h, falseAlarms: fa };
  });
}

/* ------------------------------------------------------------------ */
/* Müller-Lyer (method of adjustment)                                  */
/* ------------------------------------------------------------------ */

/**
 * The student adjusts the plain line until it looks as long as the line with
 * fins. Bias % = (matched − true) / true × 100. Positive means the finned
 * line looked longer than it is.
 */
export function illusionBias(trueLen: number, matched: number): number {
  return Math.round(((matched - trueLen) / trueLen) * 1000) / 10;
}

/* ------------------------------------------------------------------ */
/* Reinforcement schedules (simulation)                                */
/* ------------------------------------------------------------------ */

export type Schedule = "FR" | "VR" | "FI" | "VI" | "EXT";

/**
 * A deliberately simple simulated learner so students can see the classic
 * shapes. It is a teaching model, not a model of any real organism:
 * - Ratio schedules pay per response, so the learner responds fast and steady.
 * - Fixed interval pays only after time passes, so responding drops after
 *   each reward and climbs as the next one nears (the "scallop").
 * - Variable schedules are unpredictable, so responding stays steady.
 * - Extinction: no rewards. Responding fades, and fades more slowly after a
 *   variable (intermittent) history.
 * Returns the cumulative response count per second and the reward times.
 */
export function simulateSchedule(opts: { schedule: Schedule; value: number; seconds: number; history?: "continuous" | "intermittent"; seed?: number }) {
  const rand = seeded(opts.seed ?? 7);
  const { schedule, value, seconds } = opts;
  const cumulative: number[] = [];
  const rewards: number[] = [];
  let total = 0;
  let sinceReward = 0; // responses since last reward
  let lastReward = 0; // time of last reward
  let nextVar = Math.max(1, Math.round(value * (0.5 + rand())));
  let strength = 1; // extinction decays this
  const decay = opts.history === "intermittent" ? 0.985 : 0.94;

  for (let t = 1; t <= seconds; t++) {
    let rate: number; // responses per second
    if (schedule === "FR" || schedule === "VR") rate = 2.2;
    else if (schedule === "VI") rate = 1.1;
    else if (schedule === "FI") {
      const phase = Math.min(1, (t - lastReward) / value);
      rate = 0.1 + 2 * phase * phase;
    } else {
      strength *= decay;
      rate = 2 * strength;
    }
    // Ratio schedules have a short pause after reward on FR only.
    if (schedule === "FR" && t - lastReward <= 1 && rewards.length) rate *= 0.3;
    const n = Math.max(0, Math.round(rate + (rand() - 0.5) * 0.8 * Math.min(1, rate)));
    for (let k = 0; k < n; k++) {
      total++;
      sinceReward++;
      let paid = false;
      if (schedule === "FR") paid = sinceReward >= value;
      else if (schedule === "VR") paid = sinceReward >= nextVar;
      else if (schedule === "FI") paid = t - lastReward >= value;
      else if (schedule === "VI") paid = t - lastReward >= nextVar;
      if (paid) {
        rewards.push(t);
        sinceReward = 0;
        lastReward = t;
        nextVar = Math.max(1, Math.round(value * (0.5 + rand())));
      }
    }
    cumulative.push(total);
  }
  return { cumulative, rewards, total };
}

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

/** Score a short check quiz. */
export function checkScore(answers: readonly number[], key: readonly number[]): number {
  return key.reduce((a, k, i) => a + (answers[i] === k ? 1 : 0), 0);
}
