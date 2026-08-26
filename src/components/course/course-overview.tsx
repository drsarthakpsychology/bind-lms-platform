import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronDown, ChevronLeft, Clock, FileText, Lock, Play } from "lucide-react";

import type { Profile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { deriveWeekStatus } from "@/lib/course/status";

import { PageHeader } from "@/components/design-system/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/design-system/empty-state";
import { MobileListItem } from "@/components/mobile/mobile-list-item";
import { cn } from "@/lib/utils";

type LessonStatus = "hidden" | "live" | "unlocked";

/**
 * A lesson's go-live status. Missing/unexpected values fall back to
 * `unlocked` so pre-status rows keep their old playable behavior.
 */
function lessonStatus(l: { status?: string | null } | null | undefined): LessonStatus {
  return l?.status === "hidden" || l?.status === "live" ? l.status : "unlocked";
}

/**
 * The course path — one shared server component for the course page
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
  const supabase = await createClient();

  const [{ data: course }, { data: lessons }, { data: progress }, { data: courseMaterials }, { data: assignments }, { data: submissions }] =
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

  // `playable` is the unlocked set students can actually complete — `live`
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
  // `started` is the single source of truth for whether the course has begun —
  // completed OR watched anything. It gates "in progress" everywhere.
  const started = completedIds.size > 0 || watchedIds.size > 0;
  const completedCount = playable.filter((l) => completedIds.has(l.id)).length;
  const totalLessons = playable.length;

  const resumeTarget = playable.find((l) => !completedIds.has(l.id)) ?? playable[0];

  const lessonsById = new Map((lessons ?? []).map((l) => [l.id, l]));
  const submissionByAssignment = new Map((submissions ?? []).map((s) => [s.assignment_id, s]));
  // Students only ever see PUBLISHED assignments — a draft (unpublished) row is
  // the "Draft chip with no explanation" the audit called out, so it's dropped
  // here rather than shown with a confusing label.
  const visibleAssignments = (assignments ?? []).filter((a) => a.is_published);
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

  // The single next action — the one highlighted row. First incomplete lesson,
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

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-small font-medium text-muted-foreground transition-colors hover:text-foreground active:translate-y-px"
        >
          <ChevronLeft className="size-4" aria-hidden />
          My Courses
        </Link>
      ) : null}

      {/* One header, one honest progress line. Nowhere else on the page repeats
          a count. */}
      <PageHeader
        title={course.title}
        description={
          course.is_published
            ? totalLessons > 0
              ? `${completedCount} of ${totalLessons} lessons complete`
              : "No lessons yet"
            : "Draft — only you can see this."
        }
      />

      <section aria-label="Course path" className="space-y-6">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((weekNum) => {
          const weekLessons = visibleLessons.filter((l) => ((l as { week?: number }).week ?? 1) === weekNum);
          const weekPlayable = playable.filter((l) => ((l as { week?: number }).week ?? 1) === weekNum);
          const weekMaterials = courseMaterialsByWeek.get(weekNum) ?? [];
          const weekAssignments = assignmentsByWeek.get(weekNum) ?? [];
          const hasContent = weekLessons.length > 0 || weekMaterials.length > 0 || weekAssignments.length > 0;
          if (!hasContent) return null;

          const isCurrentWeek = weekNum === currentWeek;
          const isPastWeek = weekNum < currentWeek;
          const isFutureWeek = weekNum > currentWeek;
          // Only unlocked lessons count toward a week being complete — `live`
          // rows are locked and can never be completed by a student.
          const weekComplete = weekPlayable.length > 0 && weekPlayable.every((l) => completedIds.has(l.id));

          // Week status derives from the SAME `started` flag as the header, so
          // the page can never say "not started" up top and "in progress" here.
          const weekStatus = deriveWeekStatus({
            weekComplete,
            isNextWeek: isCurrentWeek,
            courseStarted: started,
            isFutureWeek,
          });
          const statusLabel =
            weekStatus === "complete"
              ? "Complete"
              : weekStatus === "in-progress"
                ? "In progress"
                : weekStatus === "upcoming"
                  ? "Opens later"
                  : "Not started";

          return (
            <details key={weekNum} open={isCurrentWeek} className="group space-y-2">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 px-1 [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-md border-2 text-numeric text-small font-bold",
                    isFutureWeek
                      ? "border-border bg-muted text-muted-foreground"
                      : isCurrentWeek || (isPastWeek && weekComplete)
                        ? "border-foreground bg-primary text-primary-foreground"
                        : "border-border bg-accent text-foreground",
                  )}
                >
                  {isPastWeek && weekComplete ? <CheckCircle2 className="size-4" /> : weekNum}
                </span>
                <h2 className="text-h3 text-foreground">Week {weekNum}</h2>
                <span className="text-caption text-muted-foreground">{statusLabel}</span>
                {isFutureWeek && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-caption font-medium text-muted-foreground">
                    <Lock className="size-3" aria-hidden />
                    Locked
                  </span>
                )}
                <ChevronDown
                  className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
                  aria-hidden
                />
              </summary>

              <div className="space-y-1">
                {weekLessons.map((lesson, i) => {
                  const done = completedIds.has(lesson.id);
                  const isLive = lessonStatus(lesson) === "live";
                  // A `live` lesson is locked on its own ("yet to be live"), the
                  // same way a future week is locked as a whole.
                  const locked = isFutureWeek || isLive;
                  const isNextAction = !locked && nextAction?.type === "lesson" && nextAction.id === lesson.id;

                  return (
                    <MobileListItem
                      key={lesson.id}
                      href={locked ? undefined : `/courses/${courseId}/lessons/${lesson.id}`}
                      disabled={locked}
                      highlight={isNextAction}
                      leading={
                        isNextAction ? (
                          <Play className="size-5 text-primary-foreground" aria-hidden />
                        ) : done ? (
                          <CheckCircle2 className="size-5 text-primary" aria-hidden />
                        ) : (
                          <span className="text-numeric text-small font-semibold text-muted-foreground">
                            {i + 1}
                          </span>
                        )
                      }
                      title={lesson.title}
                      subtitle={
                        isLive
                          ? "Yet to be live"
                          : isFutureWeek
                            ? undefined
                            : isNextAction
                              ? started ? "Continue" : "Start"
                              : done
                                ? "Completed"
                                : undefined
                      }
                      trailing={
                        isLive || isFutureWeek ? (
                          <Lock className="size-4 text-muted-foreground" aria-hidden />
                        ) : done ? (
                          <span className="text-caption text-muted-foreground">Done</span>
                        ) : undefined
                      }
                    />
                  );
                })}

                {weekMaterials.map((m) => (
                  <MobileListItem
                    key={m.id}
                    href={isFutureWeek ? undefined : `/courses/${courseId}/materials/${m.id}`}
                    disabled={isFutureWeek}
                    leading={<BookOpen className="size-5 text-muted-foreground" aria-hidden />}
                    title={m.title}
                    subtitle={m.format ? `${m.format.toUpperCase()} · ${m.kind}` : m.kind}
                    trailing={
                      isFutureWeek ? <Lock className="size-4 text-muted-foreground" aria-hidden /> : undefined
                    }
                  />
                ))}

                {weekAssignments.map((a) => {
                  const isNextAction = nextAction?.type === "assignment" && nextAction.id === a.id;

                  return (
                    <MobileListItem
                      key={a.id}
                      href={isFutureWeek ? undefined : `/courses/${courseId}/lessons/${a.lessonId}?tab=assignment`}
                      disabled={isFutureWeek}
                      highlight={isNextAction}
                      leading={<FileText className="size-5 text-muted-foreground" aria-hidden />}
                      title={a.title ?? "Assignment"}
                      subtitle={
                        isFutureWeek
                          ? undefined
                          : isNextAction
                            ? started ? "Continue" : "Start"
                            : a.lessonTitle
                      }
                      trailing={
                        isFutureWeek ? (
                          <Lock className="size-4 text-muted-foreground" aria-hidden />
                        ) : a.status === "not_started" ? (
                          <Badge variant="outline">Not submitted yet</Badge>
                        ) : a.status === "submitted" ? (
                          <Badge variant="pending">
                            <Clock className="size-3" aria-hidden />
                            Submitted
                          </Badge>
                        ) : a.status === "graded" ? (
                          <Badge variant="graded">
                            <CheckCircle2 className="size-3" aria-hidden />
                            Graded
                          </Badge>
                        ) : undefined
                      }
                    />
                  );
                })}
              </div>
            </details>
          );
        })}
      </section>

      {visibleLessons.length === 0 && (
        <EmptyState
          icon={<BookOpen className="size-8" aria-hidden />}
          title="No lessons published yet"
          description="Ask your faculty to add lessons to this course."
        />
      )}
    </div>
  );
}
