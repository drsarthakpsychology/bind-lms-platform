import type { Profile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { loadMyCohorts, loadStudentAccess } from "@/lib/cohorts/access";
import { filterLessons, myCohortsFor } from "@/lib/cohorts/rules";
import { deriveWeekStatus } from "@/lib/course/status";

import { type OverviewModel, type OverviewWeek } from "@/components/course/course-overview-view";
import { CourseLibrary } from "@/components/course/course-library";

type LessonStatus = "hidden" | "live" | "unlocked";

/**
 * A lesson's go-live status. Missing/unexpected values fall back to
 * `unlocked` so pre-status rows keep their old playable behavior.
 */
function lessonStatus(l: { status?: string | null } | null | undefined): LessonStatus {
  return l?.status === "hidden" || l?.status === "live" ? l.status : "unlocked";
}

/**
 * The course path: one shared server component for the course page
 * (`/courses/[courseId]`) and the single-course dashboard. It owns the data
 * fetch, the week/lesson computation, and the rendering, so the two surfaces
 * can never drift apart: same header, same "0 of N lessons complete" line,
 * same week rows, same highlighted "Continue" row.
 *
 * Access gating lives in the callers (the course layout 404s unenrolled /
 * unpublished / missing courses; the dashboard only renders this for a course
 * the user is enrolled in). If the course row is somehow missing here, render
 * nothing rather than throw.
 *
 * `backHref`, when set, renders the "My Courses" back link; the dashboard omits
 * it (it is already the My Courses surface).
 */
export default async function CourseOverview({
  courseId,
  profile,
  backHref,
}: {
  courseId: string;
  profile: Profile;
  backHref?: string;
}) {
  const model = await loadCourseOverview(courseId, profile, backHref);
  if (!model) return null;
  return <CourseLibrary model={model} />;
}

/** All the data for one course, shaped for the student screens (Home and
 *  Lectures). Returns null when the course row is missing. */
export async function loadCourseOverview(
  courseId: string,
  profile: Profile,
  backHref?: string,
): Promise<OverviewModel | null> {
  const supabase = await createClient();

  const [{ data: course }, { data: lessonsAll }, { data: progress }, { data: courseMaterials }, { data: assignments }, { data: submissions }] =
    await Promise.all([
      supabase.from("courses").select("id, title, is_published, weeks").eq("id", courseId).single(),
      supabase
        .from("lessons")
        .select("id, title, order_index, video_storage_path, description, week, status")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true }),
      supabase
        .from("progress")
        .select("lesson_id, is_completed, watched_seconds")
        .eq("user_id", profile.id),
      supabase
        .from("materials")
        .select("id, title, kind, format, size_bytes, lesson_id, week")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true }),
      supabase
        .from("assignments")
        .select("id, lesson_id, title, instructions, due_at, is_published, lessons!inner(course_id, week)")
        .eq("lessons.course_id", courseId)
        .order("due_at", { ascending: true }),
      supabase
        .from("submissions")
        .select("assignment_id, status, submitted_at, score")
        .eq("user_id", profile.id),
    ]);

  if (!course) return null;

  // Cohorts: keep only the lectures this person may watch. (The course
  // layout already applied the old enrolment rule, so "legacy" is true here.)
  const isAdmin = profile.role === "admin";
  const [access, myCohortsAll] = await Promise.all([loadStudentAccess(profile.id), isAdmin ? Promise.resolve([]) : loadMyCohorts(profile.id)]);
  const lessons = filterLessons(access, lessonsAll ?? [], true, isAdmin);
  // Only the student's own cohorts are ever named on their screens.
  const myCohorts = myCohortsAll.filter((c) => access.cohortIds.includes(c.id));
  const visibleLessonIds = new Set(lessons.map((l) => l.id));

  // `playable` is the unlocked set students can actually complete: `live`
  // lessons are visible but locked (not counted), `hidden` lessons never show.
  const playable = (lessons ?? []).filter(
    (l) => lessonStatus(l) === "unlocked" && (l.video_storage_path || l.description),
  );
  // Everything the student can see at all: playable (unlocked) lessons plus
  // `live` lessons rendered as locked rows, in source (order_index) order.
  const visibleLessons = (lessons ?? []).filter((l) => {
    const s = lessonStatus(l);
    if (s === "hidden") return false;
    if (s === "live") return true;
    return Boolean(l.video_storage_path || l.description);
  });
  const completedIds = new Set(
    (progress ?? []).filter((p) => p.is_completed).map((p) => p.lesson_id),
  );
  const watchedIds = new Set(
    (progress ?? []).filter((p) => (p.watched_seconds ?? 0) > 0).map((p) => p.lesson_id),
  );
  // `started` is the single source of truth for whether the course has begun:
  // completed OR watched anything. It gates "in progress" everywhere.
  const started = completedIds.size > 0 || watchedIds.size > 0;
  const completedCount = playable.filter((l) => completedIds.has(l.id)).length;
  const totalLessons = playable.length;

  const resumeTarget = playable.find((l) => !completedIds.has(l.id)) ?? playable[0];

  const lessonsById = new Map((lessons ?? []).map((l) => [l.id, l]));
  const submissionByAssignment = new Map((submissions ?? []).map((s) => [s.assignment_id, s]));
  // Students only ever see PUBLISHED assignments: a draft (unpublished) row is
  // the "Draft chip with no explanation" the audit called out, so it's dropped
  // here rather than shown with a confusing label.
  // A lecture this person can't watch takes its assignment with it.
  const visibleAssignments = (assignments ?? []).filter((a) => a.is_published && visibleLessonIds.has(a.lesson_id));
  const courseAssignments = visibleAssignments.map((a) => {
    const lesson = lessonsById.get(a.lesson_id);
    const sub = submissionByAssignment.get(a.id);
    const lessonData = a.lessons as { week?: number } | null;
    return {
      ...a,
      lessonTitle: lesson?.title ?? "Lesson",
      lessonId: a.lesson_id,
      lessonStatus: lessonStatus(lesson),
      week: lessonData?.week ?? lesson?.week ?? 1,
      status: sub?.status === "returned" ? ("graded" as const) : sub ? ("submitted" as const) : ("not_started" as const),
      submittedAt: sub?.submitted_at ?? null,
      score: sub?.score ?? null,
    };
  });

  const courseMaterialsByWeek = new Map<number, typeof courseMaterials>();
  for (const m of courseMaterials ?? []) {
    // Materials on a lecture this person can't watch stay hidden too.
    if (m.lesson_id && !visibleLessonIds.has(m.lesson_id)) continue;
    const mWeek = (m as { week?: number }).week ?? 1;
    const list = courseMaterialsByWeek.get(mWeek) ?? [];
    list.push(m);
    courseMaterialsByWeek.set(mWeek, list);
  }

  const assignmentsByWeek = new Map<number, typeof courseAssignments>();
  for (const a of courseAssignments) {
    const list = assignmentsByWeek.get(a.week) ?? [];
    list.push(a);
    assignmentsByWeek.set(a.week, list);
  }

  const lessonWeeks = visibleLessons.map((l) => (l as { week?: number }).week ?? 1);
  const materialWeeks = Array.from(courseMaterialsByWeek.keys());
  const assignmentWeeks = Array.from(assignmentsByWeek.keys());
  const allWeeks = [...lessonWeeks, ...materialWeeks, ...assignmentWeeks];
  const maxWeek = allWeeks.length > 0 ? Math.max(...allWeeks) : 1;
  const totalWeeks = Math.max(maxWeek, (course as { weeks?: number }).weeks ?? maxWeek);

  const currentWeek = resumeTarget ? (resumeTarget as { week?: number }).week ?? 1 : 1;

  // The single next action: the one highlighted row. First incomplete lesson,
  // else first unsubmitted published assignment.
  let nextAction: { type: "lesson" | "assignment"; id: string; week: number; title: string; href: string } | null = null;

  for (let w = 1; w <= totalWeeks; w++) {
    const weekLessons = playable.filter((l) => ((l as { week?: number }).week ?? 1) === w);
    for (const lesson of weekLessons) {
      if (!completedIds.has(lesson.id)) {
        nextAction = { type: "lesson", id: lesson.id, week: w, title: lesson.title, href: `/courses/${courseId}/lessons/${lesson.id}` };
        break;
      }
    }
    if (nextAction) break;

    const weekAssignments = assignmentsByWeek.get(w) ?? [];
    for (const a of weekAssignments) {
      if (a.status === "not_started" && a.lessonStatus === "unlocked") {
        nextAction = { type: "assignment", id: a.id, week: w, title: a.title ?? "Assignment", href: `/courses/${courseId}/lessons/${a.lessonId}?tab=assignment` };
        break;
      }
    }
    if (nextAction) break;
  }

  // Build a plain view model (the page layout lives in CourseOverviewView, so
  // the same screen renders from real data here and from sample data in tests).
  const lectureNumber = new Map(visibleLessons.map((l, i) => [l.id, i + 1]));
  const weeks: OverviewWeek[] = [];
  for (let weekNum = 1; weekNum <= totalWeeks; weekNum++) {
    const weekLessons = visibleLessons.filter((l) => ((l as { week?: number }).week ?? 1) === weekNum);
    const weekPlayable = playable.filter((l) => ((l as { week?: number }).week ?? 1) === weekNum);
    const weekMaterials = courseMaterialsByWeek.get(weekNum) ?? [];
    const weekAssignments = assignmentsByWeek.get(weekNum) ?? [];
    if (weekLessons.length === 0 && weekMaterials.length === 0 && weekAssignments.length === 0) continue;

    const isCurrentWeek = weekNum === currentWeek;
    const isFutureWeek = weekNum > currentWeek;
    // Only unlocked lessons count toward a week being complete: `live` rows
    // are locked and can never be completed by a student.
    const weekComplete = weekPlayable.length > 0 && weekPlayable.every((l) => completedIds.has(l.id));
    // Week status derives from the SAME `started` flag as the header.
    const weekStatus = deriveWeekStatus({
      weekComplete,
      isNextWeek: isCurrentWeek,
      courseStarted: started,
      isFutureWeek,
    });

    weeks.push({
      num: weekNum,
      status: weekStatus,
      isCurrent: isCurrentWeek,
      isFuture: isFutureWeek,
      done: weekPlayable.filter((l) => completedIds.has(l.id)).length,
      total: weekPlayable.length,
      lessons: weekLessons.map((lesson) => {
        const isLive = lessonStatus(lesson) === "live";
        const locked = isFutureWeek || isLive;
        const done = completedIds.has(lesson.id);
        const isNext = !locked && nextAction?.type === "lesson" && nextAction.id === lesson.id;
        return {
          id: lesson.id,
          title: lesson.title,
          number: lectureNumber.get(lesson.id) ?? 0,
          href: locked ? null : `/courses/${courseId}/lessons/${lesson.id}`,
          state: isLive
            ? "live"
            : isFutureWeek
              ? "later"
              : isNext
                ? "next"
                : done
                  ? "done"
                  : watchedIds.has(lesson.id)
                    ? "started"
                    : "open",
          hasVideo: Boolean(lesson.video_storage_path),
          cohorts: myCohorts.length > 1 ? myCohortsFor(lesson.id, access.cohortsByLesson, myCohorts) : undefined,
        };
      }),
      materials: weekMaterials.map((m) => ({
        id: m.id,
        title: m.title,
        meta: m.format ? `${m.format.toUpperCase()} · ${m.kind}` : String(m.kind ?? ""),
        href: isFutureWeek ? null : `/courses/${courseId}/materials/${m.id}`,
      })),
      assignments: weekAssignments.map((a) => ({
        id: a.id,
        title: a.title ?? "Assignment",
        lessonTitle: a.lessonTitle,
        status: a.status,
        isNext: nextAction?.type === "assignment" && nextAction.id === a.id,
        href: isFutureWeek ? null : `/courses/${courseId}/lessons/${a.lessonId}?tab=assignment`,
      })),
    });
  }

  const model: OverviewModel = {
    courseId,
    title: course.title,
    published: Boolean(course.is_published),
    completedCount,
    totalLessons,
    started,
    backHref: backHref ?? null,
    next: nextAction
      ? {
          title: nextAction.title,
          href: nextAction.href,
          week: nextAction.week,
          kind: nextAction.type,
          number: nextAction.type === "lesson" ? (lectureNumber.get(nextAction.id) ?? null) : null,
        }
      : null,
    weeks,
    empty: visibleLessons.length === 0,
    myCohorts,
  };

  return model;
}
