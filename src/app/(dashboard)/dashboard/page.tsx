import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { VIEW_MODE_COOKIE } from "../view-mode-constants";
import { loadLearnState } from "../study/actions";

import { loadCourseOverview } from "@/components/course/course-overview";
import { visibleCourseIds } from "@/lib/cohorts/access";
import { readFlags } from "@/lib/flags";
import { loadMyBlocks } from "@/lib/access/blocks";
import { blockedBy } from "@/lib/access/features";
import { MODULES } from "@/lib/study";
import { courseNext } from "@/lib/study/plan";
import { istToday, liveStreak } from "@/lib/learn/engine";
import { EMPTY_STRENGTHS, getStrengthsWeaknesses } from "@/lib/progress/strengths";
import { LEGAL } from "@/lib/legal-constants";
import { pickContinue } from "./next-step";
import { HomeBody } from "./home-view";

/**
 * Home (plan section 8): one Continue card, today's goal, and the three
 * strongest and three weakest topics. Nothing else competes. Everything that
 * used to live here is one tap away in the menu: this week's lectures and
 * assignments in Lectures, practice tools in Practice, level and rank in
 * Leaderboard, help in Doubts.
 */
export default async function DashboardPage() {
  const session = await getSession();
  if (session.status !== "ok") return null;
  const { profile } = session;

  const cookieStore = await cookies();
  const viewingAsStudent = cookieStore.get(VIEW_MODE_COOKIE)?.value === "student";
  if (profile.role === "admin" && !viewingAsStudent) redirect("/admin");

  // An admin previewing the student side sees what the lectures_only roster sees.
  const effectiveScope = profile.role === "admin" && viewingAsStudent ? "lectures_only" : profile.scope;

  const supabase = await createClient();
  const [{ data: courses }, { data: enrollments }, flags, blocked] = await Promise.all([
    supabase.from("courses").select("id, title, is_published").eq("is_published", true).order("title", { ascending: true }),
    supabase.from("course_enrollments").select("course_id").eq("user_id", profile.id),
    readFlags(),
    profile.role === "student" ? loadMyBlocks(profile.id) : Promise.resolve([] as string[]),
  ]);

  // A student sees published courses they are enrolled in (a lectures_only
  // roster student sees every published course), plus their cohort's courses.
  const enrolledIds = new Set((enrollments ?? []).map((e) => e.course_id));
  const legacy = effectiveScope === "lectures_only" ? (courses ?? []) : (courses ?? []).filter((c) => enrolledIds.has(c.id));
  const visible = new Set(
    await visibleCourseIds(profile.id, profile.role === "admin", (courses ?? []).map((c) => c.id), legacy.map((c) => c.id)),
  );
  const myCourses = (courses ?? []).filter((c) => visible.has(c.id));

  const studyOpen = flags.learn === "unlocked" && effectiveScope !== "lectures_only" && !blockedBy("/study", blocked);

  const [models, learn, strengths] = await Promise.all([
    Promise.all(myCourses.map((c) => loadCourseOverview(c.id, profile))).then((list) => list.filter((m): m is NonNullable<typeof m> => m !== null)),
    studyOpen ? loadLearnState() : Promise.resolve(null),
    studyOpen ? getStrengthsWeaknesses(profile.id) : Promise.resolve(EMPTY_STRENGTHS),
  ]);

  // The course in progress, else the first with lectures left, else the first.
  const main =
    models.find((m) => m.started && m.completedCount < m.totalLessons) ?? models.find((m) => m.completedCount < m.totalLessons) ?? models[0];

  const today = istToday();
  const studyNext = learn ? courseNext(MODULES, learn.study, today) : null;
  const weakest = strengths.weakest[0];

  const step = pickContinue({
    lecture: main?.next ? { ...main.next, started: main.started } : null,
    study: studyNext
      ? { kind: studyNext.kind, label: studyNext.label, href: studyNext.href, module: studyNext.kind === "done" ? null : studyNext.module.title, resumed: Boolean(learn?.study.last) }
      : null,
    weakest: weakest ? { title: weakest.title, href: weakest.practiceHref } : null,
    dailyCase: flags.learn === "unlocked" && effectiveScope !== "lectures_only" && !blockedBy("/games/daily", blocked),
  });

  return (
    <HomeBody
      adminPreview={viewingAsStudent && profile.role === "admin"}
      welcomeBack={Boolean(main?.started || learn?.study.last)}
      step={step}
      goal={learn ? { points: learn.daily.day === today ? learn.daily.xp : 0, goal: learn.dailyGoal, streak: liveStreak(learn.streak, today) } : null}
      strengths={studyOpen ? strengths : null}
      whatsappHref={`https://wa.me/${LEGAL.phone.replace(/[^\d]/g, "")}`}
    />
  );
}
