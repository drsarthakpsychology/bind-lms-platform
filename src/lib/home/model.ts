import "server-only";
import type { Profile } from "@/lib/auth/session";
import { loadLearnState } from "@/app/(dashboard)/study/actions";
import { pickContinue, pickUpNext, type ContinueInput } from "@/app/(dashboard)/dashboard/next-step";
import { loadCourseOverview } from "@/components/course/course-overview";
import { loadMyCourses } from "@/lib/course/mine";
import { readFlags } from "@/lib/flags";
import { loadMyBlocks } from "@/lib/access/blocks";
import { blockedBy } from "@/lib/access/features";
import { MODULES } from "@/lib/study";
import { courseNext, moduleStatus } from "@/lib/study/plan";
import { istToday, liveStreak } from "@/lib/learn/engine";
import { EMPTY_STRENGTHS, getStrengthsWeaknesses } from "@/lib/progress/strengths";
import { loadQuests } from "@/lib/hints/server";

/**
 * Everything Home shows, worked out once for both the website's Home page
 * (src/app/(dashboard)/dashboard/page.tsx) and the mobile app (GET
 * /api/app/v1/home): the one Continue step, today's goal, up next, and the
 * strongest and weakest topics.
 *
 * `preview`: an admin looking at the student side sees a full student's Home
 * and every published course.
 */
export async function loadHomeModel(profile: Profile, opts: { preview: boolean }) {
  const { preview } = opts;
  const effectiveScope = preview ? "full" : profile.scope;
  const courseScope = preview ? "lectures_only" : profile.scope;

  const [myCourses, flags, blocked] = await Promise.all([
    loadMyCourses(profile, courseScope),
    readFlags(),
    profile.role === "student" ? loadMyBlocks(profile.id) : Promise.resolve([] as string[]),
  ]);

  const studyOpen = flags.learn === "unlocked" && effectiveScope !== "lectures_only" && !blockedBy("/study", blocked);

  const questsOn = studyOpen && (profile.role === "student" || profile.role === "alumni");
  const [models, learn, strengths, quests] = await Promise.all([
    Promise.all(myCourses.map((c) => loadCourseOverview(c.id, profile))).then((list) => list.filter((m): m is NonNullable<typeof m> => m !== null)),
    studyOpen ? loadLearnState() : Promise.resolve(null),
    studyOpen ? getStrengthsWeaknesses(profile.id) : Promise.resolve(EMPTY_STRENGTHS),
    questsOn ? loadQuests(profile.id).catch(() => null) : Promise.resolve(null),
  ]);

  // The course in progress, else the first with lectures left, else the first.
  const main =
    models.find((m) => m.started && m.completedCount < m.totalLessons) ?? models.find((m) => m.completedCount < m.totalLessons) ?? models[0];

  const today = istToday();
  const studyNext = learn ? courseNext(MODULES, learn.study, today) : null;
  const weakest = strengths.weakest[0];

  const input: ContinueInput = {
    lecture: main?.next ? { ...main.next, started: main.started } : null,
    study: studyNext
      ? { kind: studyNext.kind, label: studyNext.label, href: studyNext.href, module: studyNext.kind === "done" ? null : studyNext.module.title, resumed: Boolean(learn?.study.last) }
      : null,
    weakest: weakest ? { title: weakest.title, href: weakest.practiceHref } : null,
    dailyCase: flags.learn === "unlocked" && effectiveScope !== "lectures_only" && !blockedBy("/practice/daily", blocked),
  };
  const step = pickContinue(input);
  const goal = learn ? { points: learn.daily.day === today ? learn.daily.xp : 0, goal: learn.dailyGoal, streak: liveStreak(learn.streak, today) } : null;

  // The hero's thin line: lectures watched in the course, or how far the module is.
  const progress =
    step.kind === "lecture" || step.kind === "assignment"
      ? main && main.totalLessons > 0
        ? { pct: Math.round((main.completedCount / main.totalLessons) * 100), label: "Lectures watched" }
        : null
      : (step.kind === "study" || step.kind === "retest") && learn && studyNext && studyNext.kind !== "done"
        ? { pct: moduleStatus(studyNext.module, learn.study).pct, label: "Module done" }
        : null;
  const dateLine = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(new Date(`${today}T12:00:00+05:30`));

  return {
    models,
    main,
    learn,
    strengths,
    quests,
    studyOpen,
    studyNext,
    input,
    step,
    goal,
    progress,
    dateLine,
    welcomeBack: Boolean(main?.started || learn?.study.last),
    allDone: step.kind === "lectures" && studyNext?.kind === "done",
    upNext: pickUpNext(input, step),
  };
}

export type HomeModel = Awaited<ReturnType<typeof loadHomeModel>>;
