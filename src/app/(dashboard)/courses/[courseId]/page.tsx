import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, ChevronLeft, Clock, FileText, Lock, Play } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

import { PageHeader } from "@/components/design-system/page-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/design-system/empty-state";
import { MobileListItem } from "@/components/mobile/mobile-list-item";
import { cardVariants } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  // Validate the URL id before interpolating it into PostgREST filter syntax —
  // a malformed id with a comma/paren would produce a PostgREST 400 instead of
  // a clean 404 (same guard as the lesson page).
  if (!/^[0-9a-f-]{36}$/i.test(courseId)) {
    notFound();
  }
  const session = await getSession();
  if (session.status !== "ok") return null;
  const { profile } = session;

  const supabase = await createClient();

  const [{ data: course }, { data: lessons }, { data: progress }, { data: courseMaterials }, { data: assignments }, { data: submissions }] =
    await Promise.all([
      supabase.from("courses").select("id, title, is_published, weeks").eq("id", courseId).single(),
      supabase
        .from("lessons")
        .select("id, title, order_index, video_storage_path, description, week")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true }),
      supabase
        .from("progress")
        .select("lesson_id, is_completed")
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

  const { data: enrollment } =
    profile.role === "admin"
      ? { data: true }
      : await supabase
          .from("course_enrollments")
          .select("course_id")
          .eq("user_id", profile.id)
          .eq("course_id", courseId)
          .maybeSingle();

  if (
    !course ||
    (!course.is_published && profile.role !== "admin") ||
    (profile.role !== "admin" && !enrollment)
  ) {
    notFound();
  }

  const playable = (lessons ?? []).filter((l) => l.video_storage_path || l.description);
  const completedIds = new Set(
    (progress ?? []).filter((p) => p.is_completed).map((p) => p.lesson_id),
  );
  const completedCount = playable.filter((l) => completedIds.has(l.id)).length;
  const percent = playable.length
    ? Math.round((completedCount / playable.length) * 100)
    : 0;
  const remaining = playable.length - completedCount;

  const resumeTarget = playable.find((l) => !completedIds.has(l.id)) ?? playable[0];

  const lessonsById = new Map((lessons ?? []).map((l) => [l.id, l]));
  const submissionByAssignment = new Map(
    (submissions ?? []).map((s) => [s.assignment_id, s]),
  );
  const courseAssignments = (assignments ?? []).map((a) => {
    const lesson = lessonsById.get(a.lesson_id);
    const sub = submissionByAssignment.get(a.id);
    const lessonData = a.lessons as { week?: number } | null;
    return {
      ...a,
      lessonTitle: lesson?.title ?? "Lesson",
      lessonId: a.lesson_id,
      week: lessonData?.week ?? lesson?.week ?? 1,
      status: !a.is_published
        ? ("draft" as const)
        : sub?.status === "returned"
          ? ("graded" as const)
          : sub
            ? ("submitted" as const)
            : ("not_started" as const),
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

  const lessonWeeks = playable.map((l) => (l as { week?: number }).week ?? 1);
  const materialWeeks = Array.from(courseMaterialsByWeek.keys());
  const assignmentWeeks = Array.from(assignmentsByWeek.keys());
  const allWeeks = [...lessonWeeks, ...materialWeeks, ...assignmentWeeks];
  const maxWeek = allWeeks.length > 0 ? Math.max(...allWeeks) : 1;
  const totalWeeks = Math.max(maxWeek, (course as { weeks?: number }).weeks ?? maxWeek);

  const currentWeek = resumeTarget
    ? (resumeTarget as { week?: number }).week ?? 1
    : 1;

  let nextAction:
    | { type: "lesson" | "assignment" | "material"; id: string; week: number; title: string; href: string }
    | null = null;

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
      if (a.is_published && a.status === "not_started") {
        nextAction = { type: "assignment", id: a.id, week: w, title: a.title ?? "Assignment", href: `/courses/${courseId}/lessons/${a.lessonId}?tab=assignment` };
        break;
      }
    }
    if (nextAction) break;
  }

  const nextActionLessonIndex =
    nextAction?.type === "lesson"
      ? playable.findIndex((l) => l.id === nextAction.id)
      : -1;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-small font-medium text-muted-foreground transition-colors hover:text-foreground active:translate-y-px"
      >
        <ChevronLeft className="size-4" aria-hidden />
        My Courses
      </Link>

      <PageHeader
        title={course.title}
        description={
          course.is_published
            ? "Work through the weeks and lessons at your own pace."
            : "Draft — only you can see this."
        }
      />

      {/* Dominant continue — the single next action deep-linking to the exact
          resume target (the same target the dashboard points at), not a buried
          list row. */}
      {nextAction ? (
        <Link
          href={nextAction.href}
          className={cn(cardVariants({ variant: "interactive" }), "flex items-center gap-4 p-5")}
        >
          <span
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-primary text-primary-foreground"
          >
            <Play className="size-5 fill-current" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-eyebrow text-muted-foreground">Continue learning</span>
            <span className="block text-h3 leading-snug text-foreground [overflow-wrap:anywhere] line-clamp-2">{nextAction.title}</span>
            <span className="block text-caption text-muted-foreground">
              {nextAction.type === "lesson" && nextActionLessonIndex >= 0
                ? `Lesson ${nextActionLessonIndex + 1} of ${playable.length}`
                : nextAction.type === "assignment"
                  ? `Assignment · Week ${nextAction.week}`
                  : `Material · Week ${nextAction.week}`}
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-link" aria-hidden />
        </Link>
      ) : null}

      {/* Progress — a compact readout, not a second CTA. The next lesson row
          below is the single primary action. At 0% the bar would be an empty
          outline, so show a plain line instead. */}
      {playable.length > 0 && (
        <div className="rounded-lg border-2 border-foreground bg-card p-4 hard-shadow-sm">
          {percent === 0 ? (
            <p className="text-small text-muted-foreground">
              Not started · {playable.length} {playable.length === 1 ? "lesson" : "lessons"}
            </p>
          ) : (
            <>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-small font-medium text-foreground">
                  {remaining === 0
                    ? "Complete"
                    : `${remaining} ${remaining === 1 ? "lesson" : "lessons"} left`}
                </p>
                <p className="text-caption text-muted-foreground">{percent}%</p>
              </div>
              <Progress value={percent} aria-label="Course progress" className="mt-2" />
            </>
          )}
        </div>
      )}

      {/* Course path — a flat list of week sections. Each week is a quiet text
          header (not a card) and every lesson is one strong tappable row. No
          nested cards, no per-lesson boxes. */}
      <section aria-label="Course path" className="space-y-6">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((weekNum) => {
          const weekLessons = playable.filter((l) => ((l as { week?: number }).week ?? 1) === weekNum);
          const weekMaterials = courseMaterialsByWeek.get(weekNum) ?? [];
          const weekAssignments = assignmentsByWeek.get(weekNum) ?? [];
          const hasContent = weekLessons.length > 0 || weekMaterials.length > 0 || weekAssignments.length > 0;
          if (!hasContent) return null;

          const isCurrentWeek = weekNum === currentWeek;
          const isPastWeek = weekNum < currentWeek;
          const isFutureWeek = weekNum > currentWeek;
          const weekComplete = weekLessons.length > 0 && weekLessons.every((l) => completedIds.has(l.id));

          const statusLabel = isCurrentWeek
            ? "In progress"
            : isPastWeek
              ? weekComplete
                ? "Complete"
                : "Incomplete"
              : "Opens later";

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
                  const isNextAction = nextAction?.type === "lesson" && nextAction.id === lesson.id;

                  return (
                    <MobileListItem
                      key={lesson.id}
                      href={isFutureWeek ? undefined : `/courses/${courseId}/lessons/${lesson.id}`}
                      disabled={isFutureWeek}
                      emphasis={isNextAction}
                      leading={
                        done ? (
                          <CheckCircle2 className="size-5 text-primary" aria-hidden />
                        ) : (
                          <span className="text-numeric text-small font-semibold text-muted-foreground">
                            {i + 1}
                          </span>
                        )
                      }
                      title={lesson.title}
                      subtitle={
                        isFutureWeek
                          ? undefined
                          : isNextAction
                            ? <span className="font-medium text-link">← Start here</span>
                            : done
                              ? "Completed"
                              : "Not started"
                      }
                      trailing={
                        isFutureWeek ? (
                          <Lock className="size-4 text-muted-foreground" aria-hidden />
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
                    subtitle={m.format?.toUpperCase() ?? m.kind}
                    trailing={
                      isFutureWeek ? (
                        <Lock className="size-4 text-muted-foreground" aria-hidden />
                      ) : undefined
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
                      emphasis={isNextAction}
                      leading={<FileText className="size-5 text-muted-foreground" aria-hidden />}
                      title={a.title ?? "Assignment"}
                      subtitle={
                        isFutureWeek ? undefined : (
                          <>
                            {isNextAction && <span className="font-medium text-link">← Next · </span>}
                            {a.lessonTitle}
                            {a.due_at ? ` · due ${new Date(a.due_at).toLocaleDateString()}` : ""}
                          </>
                        )
                      }
                      trailing={
                        isFutureWeek ? (
                          <Lock className="size-4 text-muted-foreground" aria-hidden />
                        ) : a.status === "draft" ? (
                          <Badge variant="draft">Draft</Badge>
                        ) : a.status === "not_started" ? (
                          <Badge variant="outline">Not started</Badge>
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

      {playable.length === 0 && (
        <EmptyState
          icon={<BookOpen className="size-8" aria-hidden />}
          title="No lessons published yet"
          description="Ask your faculty to add lessons to this course."
        />
      )}
    </div>
  );
}
