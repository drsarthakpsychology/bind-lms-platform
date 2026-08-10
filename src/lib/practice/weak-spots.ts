/**
 * Weak-spots analysis — surface which clinical skills a student consistently
 * misses across their sim debriefs, so practice targets the actual gaps.
 *
 * Input: the rubric JSONB from each sim_score. Output: a ranked list of
 * "weak spots" with a severity 0..1, plus the count of sessions it showed in.
 */

export interface Rubric {
  open_closed_ratio?: number; // 0..5
  leading_questions?: number;
  double_barrelled?: number;
  reflective_statements?: number;
  premature_reassurance?: number; // count — the #1 novice error
  domain_coverage?: number; // 0..1
  risk_timing?: "early" | "appropriate" | "late" | "absent";
}

export interface WeakSpot {
  key: string;
  label: string;
  /** 0..1 severity — higher = more consistently missed. */
  severity: number;
  sessions: number;
  /** Concrete next step (which tool to use). */
  remedyHref: string;
  remedyLabel: string;
}

/** Interpret one rubric field as a 0..1 "miss" score. */
function missScore(key: keyof Rubric, r: Rubric): number | null {
  switch (key) {
    case "open_closed_ratio": {
      const v = r.open_closed_ratio;
      if (v == null) return null;
      return Math.max(0, Math.min(1, 1 - v / 5)); // low ratio = asking closed questions
    }
    case "reflective_statements": {
      const v = r.reflective_statements;
      if (v == null) return null;
      return Math.max(0, Math.min(1, 1 - Math.min(v, 5) / 5));
    }
    case "premature_reassurance": {
      const v = r.premature_reassurance;
      if (v == null) return null;
      return Math.max(0, Math.min(1, v / 3)); // ≥3 in one session = severe
    }
    case "domain_coverage": {
      const v = r.domain_coverage;
      if (v == null) return null;
      return Math.max(0, Math.min(1, 1 - v));
    }
    case "risk_timing": {
      const v = r.risk_timing;
      if (!v) return null;
      return v === "appropriate" ? 0 : v === "late" ? 0.7 : v === "early" ? 0.4 : 1;
    }
    default:
      return null;
  }
}

const DEFINITIONS: Array<{ key: keyof Rubric; label: string; remedyHref: string; remedyLabel: string }> = [
  { key: "open_closed_ratio", label: "Closed questions", remedyHref: "/practice/consulting-room", remedyLabel: "Consulting Room — aim for open questions" },
  { key: "reflective_statements", label: "Reflective listening", remedyHref: "/practice/two-minute-clinic", remedyLabel: "Two-Minute Clinic — practise reflections" },
  { key: "premature_reassurance", label: "Premature reassurance", remedyHref: "/practice/consulting-room", remedyLabel: "Consulting Room — explore before reassuring" },
  { key: "domain_coverage", label: "Domain coverage", remedyHref: "/practice/mse", remedyLabel: "MSE Trainer — cover the full picture" },
  { key: "risk_timing", label: "Risk assessment timing", remedyHref: "/practice/osce", remedyLabel: "OSCE — run the risk station" },
];

/**
 * Rank the student's weak spots across their scored sessions. Returns an
 * array sorted most-severe first. A dimension is a weak spot if it appears in
 * at least one session with a miss score above 0.5, OR the average is > 0.35.
 */
export function analyzeWeakSpots(rubrics: Rubric[]): WeakSpot[] {
  if (rubrics.length === 0) return [];

  const out: WeakSpot[] = [];
  for (const def of DEFINITIONS) {
    const scores = rubrics.map((r) => missScore(def.key, r)).filter((s): s is number => s !== null);
    if (scores.length === 0) continue;
    const avg = scores.reduce((a, s) => a + s, 0) / scores.length;
    const severe = scores.some((s) => s > 0.5);
    if (severe || avg > 0.35) {
      out.push({
        key: def.key,
        label: def.label,
        severity: avg,
        sessions: scores.length,
        remedyHref: def.remedyHref,
        remedyLabel: def.remedyLabel,
      });
    }
  }
  return out.sort((a, b) => b.severity - a.severity);
}
