import "server-only";
import type { Profile } from "@/lib/auth/session";
import { MODULES } from "@/lib/study";
import { loadPracticeSession, loadStudentMap, type StudentMap } from "@/lib/learn/model/server";
import { answersToCalibrate } from "@/lib/learn/model/elo";
import { MASTERY_LABEL, MASTERY_STATES } from "@/lib/learn/model/mastery";
import { bankItem, COMPETENCY_LABEL, skillLabel, topicById } from "@/lib/learn/model/topics";
import { COMPETENCIES } from "@/lib/learn/model/skills";
import type { MapPractice, MapQuestion, StudyMap } from "./contract";
import { toAppTarget } from "./target";

/**
 * The learning map and its practice rounds for the app, built from the same
 * functions as the website's /study/map and /study/map/practice. Staff
 * accounts (admins previewing) get an empty map and rounds that are not
 * saved, as on the website.
 */

export function isLearner(profile: Pick<Profile, "role">): boolean {
  return profile.role === "student" || profile.role === "alumni";
}

const titles = (): Record<string, string> => Object.fromEntries(MODULES.map((m) => [m.id, m.title]));

/** Pure: the website's map data in the contract's shape. */
export function mapView(data: StudentMap, learner: boolean, t: Record<string, string> = titles()): StudyMap {
  return {
    learner,
    due: data.due,
    calibrated: data.calibrated,
    answersToCalibrate: data.calibrated ? 0 : answersToCalibrate(data.graded),
    states: MASTERY_STATES.map((key) => ({ key, label: MASTERY_LABEL[key] })),
    skills: COMPETENCIES.map((c) => COMPETENCY_LABEL[c]),
    weak: data.weak.map((w) => ({
      skill: w.skill,
      topic: w.topic,
      label: w.label,
      state: w.state,
      // The website shows "Read the module" only for a topic it knows.
      studyTarget: topicById(w.topic) || t[w.topic] ? toAppTarget(w.href) : null,
    })),
    mixUps: data.confusions.map((c) => {
      const topic = c.skill ? (c.skill.split(":")[0] ?? null) : null;
      const known = topic ? topicById(topic) : undefined;
      return { a: c.a, b: c.b, n: c.n, topic: known ? topic : null, topicTitle: known?.title ?? null };
    }),
    topics: data.topics.map((tp) => ({
      id: tp.id,
      title: tp.title,
      studyTarget: toAppTarget(tp.href),
      cells: tp.cells.map((c) => ({ skill: c.skill, label: c.label, state: c.state, hasItems: c.hasItems, p: c.p })),
    })),
  };
}

export async function loadMapView(profile: Profile): Promise<StudyMap> {
  const learner = isLearner(profile);
  const t = titles();
  return mapView(await loadStudentMap(learner ? profile.id : "", t), learner, t);
}

/** A round of practice: the website's loadPracticeSession, each question with its answer and the two explanations (the website sends the same to the browser). */
export async function loadMapPractice(profile: Profile, rawTopic: string | null): Promise<MapPractice> {
  const topic = rawTopic && topicById(rawTopic) ? rawTopic : null;
  const learner = isLearner(profile);
  const { picked, round } = await loadPracticeSession(learner ? profile.id : "", topic);
  const questions = picked.flatMap((p): MapQuestion[] => {
    const b = bankItem(p.id);
    if (!b) return [];
    const it = b.item;
    const base = { id: it.id, topic: b.topic, label: skillLabel(b.skill), student: it.student, clinician: it.clinician };
    return it.kind === "mcq"
      ? [{ ...base, kind: "mcq", text: it.prompt, options: [...it.options], answer: it.answer, ...(it.vignette ? { vignette: it.vignette } : {}) }]
      : [{ ...base, kind: "tf", text: it.statement, answer: it.answer }];
  });
  return { title: topic ? `Fix it: ${topicById(topic)!.title}` : "Mixed practice", topic, round, saving: learner, questions };
}
