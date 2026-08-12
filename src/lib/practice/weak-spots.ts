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
  /** The Rounds card that teaches this skill (the heatmap → lesson link). */
  teachCard: string;
  /** trend over sessions: -1 declining (worse), 0 flat, +1 improving. */
  trend: -1 | 0 | 1;
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

const DEFINITIONS: Array<{ key: keyof Rubric; label: string; remedyHref: string; remedyLabel: string; teachCard: string }> = [
  { key: "open_closed_ratio", label: "Closed questions", remedyHref: "/practice/consulting-room", remedyLabel: "Consulting Room — aim for open questions", teachCard: "The single best open question ('What does a bad night look like for you?')" },
  { key: "reflective_statements", label: "Reflective listening", remedyHref: "/practice/two-minute-clinic", remedyLabel: "Two-Minute Clinic — practise reflections", teachCard: "Reflection vs reassurance — the card that names the difference" },
  { key: "premature_reassurance", label: "Premature reassurance", remedyHref: "/practice/consulting-room", remedyLabel: "Consulting Room — explore before reassuring", teachCard: "Why premature reassurance is the #1 novice error" },
  { key: "domain_coverage", label: "Domain coverage", remedyHref: "/practice/mse", remedyLabel: "MSE Trainer — cover the full picture", teachCard: "The 11-domain MSE structure card" },
  { key: "risk_timing", label: "Risk assessment timing", remedyHref: "/practice/osce", remedyLabel: "OSCE — run the risk station", teachCard: "When confidentiality is absolute, and when it is breached" },
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
      const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
      const secondHalf = scores.slice(Math.ceil(scores.length / 2));
      const fhAvg = firstHalf.length ? firstHalf.reduce((a, s) => a + s, 0) / firstHalf.length : avg;
      const shAvg = secondHalf.length ? secondHalf.reduce((a, s) => a + s, 0) / secondHalf.length : avg;
      const trend: -1 | 0 | 1 = scores.length < 4 ? 0 : shAvg < fhAvg - 0.08 ? 1 : shAvg > fhAvg + 0.08 ? -1 : 0;
      out.push({
        key: def.key,
        label: def.label,
        severity: avg,
        sessions: scores.length,
        remedyHref: def.remedyHref,
        remedyLabel: def.remedyLabel,
        teachCard: def.teachCard,
        trend,
      });
    }
  }
  return out.sort((a, b) => b.severity - a.severity);
}

/**
 * Weak-spot drill generation (v5 §4 — "Weak Spots must GENERATE a drill,
 * not just report").
 *
 * Given the ranked weak spots, produce a 10-item micro-drill: a concrete
 * scenario per weak skill with a better/worse response pair the student
 * must pick. Deterministic, authored, no AI needed — the drill is generated
 * on the spot from the student's actual gaps.
 */

export interface DrillItem {
  id: string;
  skill: string;
  /** The moment the student faced. */
  scenario: string;
  /** The novice move that produced the miss. */
  weakLine: string;
  /** The stronger alternative. */
  strongLine: string;
  /** One-line why — the teaching. */
  why: string;
}

const DRILL_TEMPLATES: Record<string, DrillItem[]> = {
  open_closed_ratio: [
    { id: "ws-o1", skill: "Closed questions", scenario: "A patient says 'I'm not feeling fresh.'", weakLine: "'Are you feeling tired?'", strongLine: "'When you say fresh — what does that look like for you?'", why: "Closed questions close exploration; the open version finds the meaning (constipation, sleep, mood)." },
    { id: "ws-o2", skill: "Closed questions", scenario: "A patient mentions 'family problems'.", weakLine: "'Is it your wife?'", strongLine: "'What's that been like at home lately?'", why: "Guessing the referent wastes the question; open invites the actual story." },
    { id: "ws-o3", skill: "Closed questions", scenario: "A patient reports poor sleep.", weakLine: "'So you sleep badly, right?'", strongLine: "'Walk me through yesterday night — from getting into bed to waking up.'", why: "Instantiate, don't verify: the description carries the diagnosis." },
  ],
  reflective_statements: [
    { id: "ws-r1", skill: "Reflective listening", scenario: "A patient says 'Everyone at home just treats me like a machine.'", weakLine: "'That must be stressful.'", strongLine: "'Treated like a machine — like your feelings aren't part of the arrangement?'", why: "A generic 'stressful' reflects nothing; echoing the exact phrase shows you heard the person." },
    { id: "ws-r2", skill: "Reflective listening", scenario: "A patient says 'I don't even know why I came.'", weakLine: "'Well, you came because your family brought you.'", strongLine: "'You're not sure this is the right place — what would make it worth being here?'", why: "Correcting the patient closes the door; reflecting the uncertainty keeps it open." },
    { id: "ws-r3", skill: "Reflective listening", scenario: "A patient pauses a long time, then says '…It's nothing.'", weakLine: "'Okay, so moving on — any other symptoms?'", strongLine: "'That pause said something before the words did. I'm in no hurry.'", why: "The pause is the content; a reflection that names it earns the disclosure." },
  ],
  premature_reassurance: [
    { id: "ws-p1", skill: "Premature reassurance", scenario: "A patient says 'I'm scared I'm losing my mind.'", weakLine: "'Don't worry, you're definitely not losing your mind!'", strongLine: "'That's a frightening fear to carry. What makes you feel you're losing your mind?'", why: "Reassurance before exploration tells the patient you can't hold their distress — exploring first is the reassurance that works." },
    { id: "ws-p2", skill: "Premature reassurance", scenario: "A patient says 'I think about dying a lot.'", weakLine: "'You'll be fine, these thoughts are normal.'", strongLine: "'That's important — thank you for telling me. When you say dying, what exactly have you been thinking?'", why: "Rushing to normalise a risk disclosure teaches the patient not to share; taking it seriously keeps them safe and talking." },
    { id: "ws-p3", skill: "Premature reassurance", scenario: "A patient says 'I can't cope with anything anymore.'", weakLine: "'Everyone feels that way sometimes, you're doing great!'", strongLine: "'It sounds like things feel like too much right now. What's the heaviest part?'", why: "Cheerleading invalidates; sitting with the heaviness is the therapeutic act." },
  ],
  domain_coverage: [
    { id: "ws-d1", skill: "Domain coverage", scenario: "You have the patient's mood story but haven't asked about sleep, appetite or energy.", weakLine: "'Okay, so about the mood — anything else?'", strongLine: "'You've told me about the low mood. How are sleep, appetite and energy in the same weeks?'", why: "Coverage is systematic, not accidental — the physical triad is part of every mood history." },
    { id: "ws-d2", skill: "Domain coverage", scenario: "The patient described hearing a voice, and you haven't asked about beliefs.", weakLine: "'So that's the hearing — good, next question.'", strongLine: "'You mentioned the voice — what do you make of it? What do you think it is?'", why: "Perception without belief assessment misses the delusional elaboration that changes the picture." },
  ],
  risk_timing: [
    { id: "ws-k1", skill: "Risk assessment timing", scenario: "The patient has been opening up well for ten minutes. You haven't asked about self-harm.", weakLine: "'Let's wait — maybe next session if it feels right.'", strongLine: "'After everything you've shared — have you had thoughts of ending your life?'", why: "Risk asked in clear language at rapport height earns a true answer; delayed risk assessment is the classic miss." },
    { id: "ws-k2", skill: "Risk assessment timing", scenario: "The patient mentions 'not wanting to be here' in passing.", weakLine: "'You mentioned not wanting to be here — do you mean this session?'", strongLine: "'When you say not wanting to be here — do you mean here in the room, or here in life?'", why: "The ambiguous 'here' is a risk moment; asking it clearly costs nothing and can find everything." },
  ],
};

/** Generate a 10-item drill from the ranked weak spots (round-robin across
 *  the top skills so the drill is targeted but varied). Deterministic.
 *  If the authored pool for the top skills is shorter than the target, the
 *  drill falls back to the next weak skills' templates until the count is
 *  met — a 10-item drill is the DONE MEANS, not a best-effort. */
export function generateDrill(spots: WeakSpot[], count = 10): DrillItem[] {
  if (spots.length === 0) return [];
  const out: DrillItem[] = [];
  const keys = spots.map((s) => s.key as string); // all weak skills, in rank order
  // Round-robin over the top-3 skills' templates first; then any remaining
  // weak skills fill the rest.
  const tier = (ks: string[]) =>
    ks.flatMap((k) => DRILL_TEMPLATES[k] ?? []);
  const pool = tier(keys.slice(0, 3));
  const fillers = tier(keys.slice(3));
  const all = [...pool, ...fillers];
  let i = 0;
  while (out.length < count && all.length > 0) {
    const item = all[i % all.length];
    if (!out.some((x) => x.id === item.id)) out.push(item);
    i++;
    if (i > all.length * 3) break; // safety — all distinct items consumed
  }
  return out.slice(0, count);
}
