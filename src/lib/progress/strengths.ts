import "server-only";
/**
 * getStrengthsWeaknesses(userId): a student's three strongest and three
 * weakest topics, each with a link to study it and a link to practise it.
 * Used by Home and Progress. Reads with the service role (the caller has
 * already checked who is signed in) and never throws: a missing table, a
 * failed query or a brand new student all give EMPTY_STRENGTHS, so the page
 * simply shows nothing.
 *
 * The scoring lives in ./strengths-core.ts (pure and tested).
 */
import { createAdminClient } from "@/lib/supabase/server";
import { normalise } from "@/lib/learn/engine";
import { SKILLS_WITH_ITEMS, splitSkill, topicById } from "@/lib/learn/model/topics";
import { computeLearningProfile } from "@/lib/practice/learning-profile";
import { SUBJECT_MODULE, SUBJECT_TITLE, isSubject, studyHref } from "@/lib/prep/catalog";
import { MODULES } from "@/lib/study";
import { EMPTY_STRENGTHS, rankStrengths, scoreTopics, type Lookups, type SkillRowLite, type StrengthsWeaknesses, type TestScore } from "./strengths-core";

export type { StrengthsWeaknesses, TopicScore } from "./strengths-core";
export { EMPTY_STRENGTHS, pct } from "./strengths-core";

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : 0);

const MODULE_TITLE = new Map(MODULES.map((m) => [m.id, m.title]));
const BANK_TOPICS = new Set([...SKILLS_WITH_ITEMS].map((s) => splitSkill(s).topic));
const moduleExists = (id: string, section?: string) => {
  const m = MODULES.find((x) => x.id === id);
  return Boolean(m && (!section || m.sections.some((s) => s.id === section)));
};

const LOOKUPS: Lookups = {
  topicTitle: (id) => topicById(id)?.title ?? MODULE_TITLE.get(id) ?? null,
  moduleExists: (id) => MODULE_TITLE.has(id),
  hasBank: (id) => BANK_TOPICS.has(id),
  subjectTitle: (s) => (isSubject(s) ? SUBJECT_TITLE[s] : null),
  subjectStudyHref: (s) => (isSubject(s) ? studyHref(SUBJECT_MODULE[s], moduleExists) : null),
};

export async function getStrengthsWeaknesses(userId: string, now = new Date()): Promise<StrengthsWeaknesses> {
  if (!userId) return EMPTY_STRENGTHS;
  let db: ReturnType<typeof createAdminClient>;
  try {
    db = createAdminClient();
  } catch {
    return EMPTY_STRENGTHS;
  }
  try {
    const [skillsRes, learnRes, profile] = await Promise.all([
      db.from("skill_state").select("skill, theta, n, last_at").eq("user_id", userId).limit(2000),
      db.from("learn_progress").select("state").eq("user_id", userId).maybeSingle(),
      computeLearningProfile(db, userId).catch(() => ({ sessions: 0, dimensions: [] })),
    ]);
    const skills: SkillRowLite[] = (Array.isArray(skillsRes.data) ? skillsRes.data : []).map((r: Record<string, unknown>) => ({
      skill: String(r.skill ?? ""),
      theta: num(r.theta),
      n: num(r.n),
      lastAt: typeof r.last_at === "string" ? r.last_at : null,
    }));
    const tests: Record<string, TestScore> = {};
    if (!learnRes.error && learnRes.data) {
      for (const [m, t] of Object.entries(normalise(learnRes.data.state).study.tests)) tests[m] = { best: t.best, total: t.total };
    }
    const scores = scoreTopics(
      { skills, tests, profile: { sessions: profile.sessions, dims: profile.dimensions.map((d) => ({ key: d.key, label: d.label, score: d.score })) } },
      LOOKUPS,
      now,
    );
    return rankStrengths(scores, 3);
  } catch {
    return EMPTY_STRENGTHS;
  }
}
