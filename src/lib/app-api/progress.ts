import "server-only";
import type { Profile } from "@/lib/auth/session";
import { loadCourseOverview } from "@/components/course/course-overview";
import { loadMyCourses } from "@/lib/course/mine";
import { readFlags } from "@/lib/flags";
import { loadMyBlocks } from "@/lib/access/blocks";
import { gateFailure } from "@/lib/auth/api-gate";
import { MODULES } from "@/lib/study";
import { moduleStatus, readingSections } from "@/lib/study/plan";
import { addDays, istToday, liveStreak, studyKey } from "@/lib/learn/engine";
import { EMPTY_STRENGTHS, getStrengthsWeaknesses } from "@/lib/progress/strengths";
import type { Progress } from "./contract";
import { myLearnState } from "./learn-state";
import { strengthsOut } from "./views/courses";

/** The progress screen: the website's own numbers (course overview, module status, learn state, strengths). */
export async function loadProgress(profile: Profile): Promise<Progress> {
  const [mine, flags, blocks] = await Promise.all([loadMyCourses(profile, profile.scope), readFlags(), profile.role === "student" ? loadMyBlocks(profile.id) : Promise.resolve([] as string[])]);
  const studyOpen = profile.role === "admin" || gateFailure(profile, { path: "/study", flag: "learn" }, blocks, flags) === null;
  const [models, state, strengths] = await Promise.all([
    Promise.all(mine.map((c) => loadCourseOverview(c.id, profile))),
    studyOpen ? myLearnState() : Promise.resolve(null),
    studyOpen ? getStrengthsWeaknesses(profile.id) : Promise.resolve(EMPTY_STRENGTHS),
  ]);
  const today = istToday();
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13)).map((day) => ({ day, xp: state?.history[day] ?? 0 }));
  return {
    lectures: models.filter((m) => m !== null).map((m) => ({ courseId: m.courseId, title: m.title, completed: m.completedCount, total: m.totalLessons })),
    study: state
      ? {
          modulesDone: MODULES.filter((m) => moduleStatus(m, state.study).complete).length,
          modulesTotal: MODULES.length,
          sectionsDone: MODULES.reduce((a, m) => a + readingSections(m).filter((s) => state.study.done[studyKey(m.id, s.id)]).length, 0),
          sectionsTotal: MODULES.reduce((a, m) => a + readingSections(m).length, 0),
          seconds: Object.values(state.study.secs).reduce((a, v) => a + (Number(v) || 0), 0),
          xp: state.xp,
          streak: liveStreak(state.streak, today),
          bestStreak: state.streak.best,
        }
      : null,
    days: state ? days : [],
    strengths: studyOpen ? strengthsOut(strengths) : null,
  };
}
