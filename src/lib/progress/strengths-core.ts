/**
 * Strongest and weakest topics: the pure half (no database, easy to test).
 * The server half is ./strengths.ts (getStrengthsWeaknesses).
 *
 * Evidence comes from three places that already exist:
 *  - skill_state rows of the student model (module quizzes, Study checks,
 *    Smart practice) keyed "topic:competency", plus Exam Prep subjects keyed
 *    "prep-<subject>:apply";
 *  - Study module test scores (best score per module);
 *  - the Consulting Room learning profile (rubric signals across sessions).
 * Every source becomes a TopicScore with a chance of being right (p, 0 to 1)
 * and how many answers that rests on (n). A topic needs MIN_ANSWERS before it
 * is shown, so one lucky answer never makes a "strength".
 */
import { decayedTheta, prob } from "@/lib/learn/model/elo";

export type TopicKind = "topic" | "subject" | "skill";

export type TopicScore = {
  /** Stable id: a study module id, "prep-<subject>", or "clinical-<key>". */
  id: string;
  title: string;
  kind: TopicKind;
  /** Chance of a right answer on a medium question, 0 to 1. */
  p: number;
  /** Answers (or sessions) behind p. */
  n: number;
  /** Where to read about it, when there is a page for it. */
  studyHref: string | null;
  /** Where to practise it. */
  practiceHref: string;
};

export type StrengthsWeaknesses = {
  strongest: TopicScore[];
  weakest: TopicScore[];
  /** Every topic with enough evidence, strongest first. */
  all: TopicScore[];
  /** True once there is enough evidence to show anything. */
  hasData: boolean;
};

export const MIN_ANSWERS = 3;
/** At or above this a topic can count as a strength. */
export const STRONG_FROM = 0.6;
/** Below this a topic can count as a weak spot. */
export const WEAK_BELOW = 0.8;

export const EMPTY_STRENGTHS: StrengthsWeaknesses = { strongest: [], weakest: [], all: [], hasData: false };

export type SkillRowLite = { skill: string; theta: number; n: number; lastAt: string | null };
export type TestScore = { best: number; total: number };
export type ProfileDim = { key: string; label: string; score: number };

export type Lookups = {
  /** Display name for a study module or learn topic id. */
  topicTitle: (id: string) => string | null;
  /** True when /study/<id> exists. */
  moduleExists: (id: string) => boolean;
  /** True when the module quiz bank has questions for this topic (so /study/map/practice works). */
  hasBank: (id: string) => boolean;
  /** Display name for an Exam Prep subject. */
  subjectTitle: (subject: string) => string | null;
  /** Study link for an Exam Prep subject. */
  subjectStudyHref: (subject: string) => string | null;
};

type Acc = { id: string; kind: TopicKind; sumP: number; n: number };

function add(map: Map<string, Acc>, id: string, kind: TopicKind, p: number, n: number) {
  if (!(n > 0) || !Number.isFinite(p)) return;
  const a = map.get(id) ?? { id, kind, sumP: 0, n: 0 };
  a.sumP += Math.min(1, Math.max(0, p)) * n;
  a.n += n;
  map.set(id, a);
}

const PREP = /^prep-([a-z0-9-]+):/;

/**
 * Turn raw evidence into scored topics (no ranking yet).
 * Skills of the same topic are pooled, weighted by how many answers each has.
 */
export function scoreTopics(
  input: { skills: SkillRowLite[]; tests: Record<string, TestScore>; profile: { sessions: number; dims: ProfileDim[] } },
  look: Lookups,
  now: Date,
): TopicScore[] {
  const acc = new Map<string, Acc>();
  for (const r of input.skills) {
    if (!(r.n > 0)) continue;
    const p = prob(decayedTheta(r.theta, r.lastAt, now), 0);
    const prep = r.skill.match(PREP);
    if (prep) add(acc, `prep-${prep[1]}`, "subject", p, r.n);
    else if (!r.skill.startsWith("prep:")) add(acc, r.skill.split(":")[0], "topic", p, r.n);
  }
  for (const [module, t] of Object.entries(input.tests)) {
    if (t && t.total > 0) add(acc, module, "topic", t.best / t.total, t.total);
  }
  // Consulting Room signals: each session is one piece of evidence.
  if (input.profile.sessions >= 2) {
    for (const d of input.profile.dims) add(acc, `clinical-${d.key}`, "skill", d.score, input.profile.sessions);
  }

  const dimLabel = new Map(input.profile.dims.map((d) => [`clinical-${d.key}`, d.label]));
  const out: TopicScore[] = [];
  for (const a of acc.values()) {
    const minN = a.kind === "skill" ? 2 : MIN_ANSWERS;
    if (a.n < minN) continue;
    const p = a.sumP / a.n;
    if (a.kind === "subject") {
      const subject = a.id.slice(5);
      const title = look.subjectTitle(subject);
      if (!title) continue;
      out.push({ id: a.id, title, kind: a.kind, p, n: a.n, studyHref: look.subjectStudyHref(subject), practiceHref: `/prep/practice/${subject}` });
    } else if (a.kind === "skill") {
      out.push({ id: a.id, title: dimLabel.get(a.id) ?? a.id, kind: a.kind, p, n: a.n, studyHref: null, practiceHref: "/practice/consulting-room" });
    } else {
      const title = look.topicTitle(a.id);
      if (!title) continue;
      const studyHref = look.moduleExists(a.id) ? `/study/${a.id}` : null;
      const practiceHref = look.hasBank(a.id) ? `/study/map/practice?topic=${encodeURIComponent(a.id)}` : "/prep/smart";
      out.push({ id: a.id, title, kind: a.kind, p, n: a.n, studyHref, practiceHref });
    }
  }
  return out;
}

/**
 * Pick up to `k` strongest and `k` weakest. A topic is never in both lists.
 * Strengths need p ≥ STRONG_FROM; weak spots need p < WEAK_BELOW, so a
 * student doing well everywhere is not told a 95% topic is "weak".
 * Ties: more evidence first.
 */
export function rankStrengths(scores: TopicScore[], k = 3): StrengthsWeaknesses {
  const all = [...scores].sort((a, b) => b.p - a.p || b.n - a.n || a.title.localeCompare(b.title));
  if (!all.length) return EMPTY_STRENGTHS;
  const strongest = all.filter((t) => t.p >= STRONG_FROM).slice(0, k);
  const taken = new Set(strongest.map((t) => t.id));
  const weakest = [...all]
    .sort((a, b) => a.p - b.p || b.n - a.n || a.title.localeCompare(b.title))
    .filter((t) => !taken.has(t.id) && t.p < WEAK_BELOW)
    .slice(0, k);
  return { strongest, weakest, all, hasData: true };
}

/** Rounded percentage for display ("72%"). */
export function pct(p: number): number {
  return Math.round(Math.min(1, Math.max(0, p)) * 100);
}
