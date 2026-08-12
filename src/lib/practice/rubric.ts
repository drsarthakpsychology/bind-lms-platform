/**
 * A3 — rubric dimension calibration gate.
 *
 * A dimension with status 'provisional' has its NUMERIC score hidden from
 * students (qualitative feedback only) until Dr. Sarthak's calibration scores
 * validate it. This module is the single source of truth for that check so
 * the debrief renderer and tests share one implementation.
 */

export interface RubricDimension {
  key: string;
  label: string;
  status: "provisional" | "validated";
  agreement: number | null;
  n_scored: number;
}

/** True when a dimension's numeric score must be hidden from students. */
export function isProvisional(dim: string, dims: RubricDimension[] | undefined): boolean {
  if (!dims) return false; // no table yet → assume validated (behaviour unchanged)
  const found = dims.find((d) => d.key === dim);
  if (!found) return false;
  return found.status === "provisional";
}

/** The keys that are still provisional, for server-side page assembly. */
export function provisionalKeys(dims: RubricDimension[]): string[] {
  return dims.filter((d) => d.status === "provisional").map((d) => d.key);
}

/**
 * Cohen's weighted kappa for ordinal scores (quadratic weights) — the
 * agreement statistic the calibration dashboard shows per dimension.
 * Paired human-vs-AI scores in, kappa in [-1, 1] out (0 = chance).
 * Pure, deterministic, testable.
 */
export function weightedKappa(ai: number[], human: number[]): number {
  if (ai.length !== human.length || ai.length === 0) return 0;
  const n = ai.length;
  // Discrete ordinal scale 0..5 (the debrief overall).
  const scale = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  const m = scale.length;

  // Observed weighted agreement.
  let observed = 0;
  // Expected: joint distribution under independence.
  const row = new Array(m).fill(0); // human
  const col = new Array(m).fill(0); // ai
  const weights = (i: number, j: number) => {
    const d = scale[i] - scale[j];
    return 1 - (d * d) / (scale[m - 1] - scale[0]) ** 2;
  };
  for (let k = 0; k < n; k++) {
    const i = closestIndex(scale, human[k]);
    const j = closestIndex(scale, ai[k]);
    row[i] += 1 / n;
    col[j] += 1 / n;
    observed += weights(i, j) / n;
  }
  let expected = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < m; j++) {
      expected += row[i] * col[j] * weights(i, j);
    }
  }
  if (expected === 1) return observed === 1 ? 1 : 0;
  return (observed - expected) / (1 - expected);
}

function closestIndex(scale: number[], v: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < scale.length; i++) {
    const d = Math.abs(scale[i] - v);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

/**
 * Decide whether a dimension graduates from provisional to validated:
 * enough paired scores (>= MIN_SCORED) with strong agreement (kappa >= 0.6).
 * This is the A3 gate — until it passes, the student never sees the number.
 */
export const MIN_VALIDATION_SCORES = 10;
export const MIN_VALIDATION_KAPPA = 0.6;

export function shouldValidate(d: { n_scored: number; agreement: number | null }): boolean {
  return d.n_scored >= MIN_VALIDATION_SCORES && (d.agreement ?? 0) >= MIN_VALIDATION_KAPPA;
}

/** Graduate a dimension when the gate passes; otherwise keep provisional. */
export function nextStatus(d: RubricDimension): "provisional" | "validated" {
  if (d.status === "validated") return "validated";
  return shouldValidate(d) ? "validated" : "provisional";
}
