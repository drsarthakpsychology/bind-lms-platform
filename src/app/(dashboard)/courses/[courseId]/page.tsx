import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, ChevronLeft, ChevronDown, Clock, FileText } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

import { PageHeader } from "@/components/design-system/page-header";
import { Badge } from "@/components/ui/badge";
import { cardVariants } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/design-system/empty-state";
import { cn } from "@/lib/utils";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
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

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        My Courses
     </Link>

      <PageHeader
        eyebrow={course.is_published ? "Published course" : "Draft course"}
        title={course.title}
        description={
          course.is_published
            ? "Your linear path through this course. One next action, highlighted."
            : "Draft — not yet visible to students."
        }
      />

      <div className="flex items-center gap-4 rounded-lg border-2 border-foreground bg-card p-5 hard-shadow-sm">
        <div className="flex-1">
          <p className="text-caption text-muted-foreground">
            {completedCount} of {playable.length} lessons complete
         </p>
          <Progress value={percent} aria-label="Course progress" className="mt-2" />
       </div>
        {resumeTarget && (
          <Button asChild>
            <Link href={`/courses/${courseId}/lessons/${resumeTarget.id}`}>
              {completedCount > 0 ? "Resume" : "Start course"}
              <ArrowRight className="size-4" aria-hidden />
           </Link>
         </Button>
        )}
     </div>

      <section aria-label="Course path" className="space-y-4">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((weekNum) => {
          const weekLessons = playable.filter((l) => ((l as { week?: number }).week ?? 1) === weekNum);
          const weekMaterials = courseMaterialsByWeek.get(weekNum) ?? [];
          const weekAssignments = assignmentsByWeek.get(weekNum) ?? [];
          const hasContent = weekLessons.length > 0 || weekMaterials.length > 0 || weekAssignments.length > 0;
          if (!hasContent) return null;

          const isCurrentWeek = weekNum === currentWeek;
          const isPastWeek = weekNum < currentWeek;
          const isFutureWeek = weekNum > currentWeek;
          const isNextWeek = weekNum === currentWeek + 1 && !isCurrentWeek;
          const weekComplete = weekLessons.length > 0 && weekLessons.every((l) => completedIds.has(l.id));
          const weekOpen = isCurrentWeek || isNextWeek || weekComplete;

          return (
            <details
              key={weekNum}
              open={weekOpen}
              className={cn(
                "group rounded-lg border-2 p-4 transition-colors",
                isCurrentWeek && "border-primary bg-primary/5",
                isPastWeek && weekComplete && "border-foreground/20 bg-background",
                isFutureWeek && "border-border/50 bg-background/50",
              )}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-md border-2 text-small font-bold",
                      isCurrentWeek && "border-primary bg-primary text-primary-foreground",
                      isPastWeek && weekComplete && "border-foreground bg-primary text-primary-foreground",
                      isFutureWeek && "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {isPastWeek && weekComplete ? <CheckCircle2 className="size-4" /> : <span>Week {weekNum}</span>}
                 </span>
                  <div>
                    <h3 className={cn("text-h3", isFutureWeek && "text-muted-foreground")}>
                      Week {weekNum}
                   </h3>
                    <p className="text-caption text-muted-foreground">
                      {isCurrentWeek
                        ? "In progress"
                        : isPastWeek
                          ? weekComplete
                            ? "Complete"
                            : "Incomplete"
                          : `Opens ${isNextWeek ? "next" : "later"}`}
                   </p>
                 </div>
               </div>
                <div className="flex items-center gap-2">
                  {isFutureWeek && (
                    <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-caption font-medium text-muted-foreground">
                      Locked
                   </span>
                  )}
                  <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
               </div>
             </summary>

              <div className="mt-4 space-y-3">
                {weekLessons.map((lesson, i) => {
                  const done = completedIds.has(lesson.id);
                  const isNextAction = nextAction?.type === "lesson" && nextAction.id === lesson.id;

                  const rowClass = cn(
                    cardVariants({ variant: isFutureWeek ? "flat" : "interactive" }),
                    "flex flex-row items-center gap-3 p-4",
                    done && "opacity-70",
                    isNextAction && "ring-2 ring-primary bg-primary/5",
                    isFutureWeek && "opacity-50",
                  );

                  const rowContent = (
                    <>
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-md border-2",
                          done && "border-foreground bg-primary text-primary-foreground",
                          isNextAction && !done && "ring-2 ring-primary",
                          !done && !isNextAction && "border-border bg-accent text-foreground",
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="size-4" />
                        ) : isNextAction ? (
                          <span className="text-xs font-bold text-link" role="status">NEXT</span>
                        ) : (
                          <span className="text-xs font-bold">{i + 1}</span>
                        )}
                     </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-small font-medium text-foreground">{lesson.title}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-caption text-muted-foreground">
                          {!done && !isNextAction && <span>Not watched yet</span>}
                          {isNextAction && <span className="font-medium text-link">← Start here</span>}
                       </span>
                     </span>

                      {!isFutureWeek && <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
                    </>
                  );

                  // Locked weeks are NOT navigable — a plain div instead of an
                  // anchor, so clicking can't scroll to top (href="#").
                  return isFutureWeek ? (
                    <div key={lesson.id} className={rowClass}>
                      {rowContent}
                    </div>
                  ) : (
                    <Link
                      key={lesson.id}
                      href={`/courses/${courseId}/lessons/${lesson.id}`}
                      className={rowClass}
                    >
                      {rowContent}
                    </Link>
                  );
                })}

                {weekMaterials.map((m) => {
                  const mWeek = (m as { week?: number }).week ?? 1;
                  const materialRowClass = cn(
                    cardVariants({ variant: isFutureWeek ? "flat" : "interactive" }),
                    "flex flex-row items-center gap-3 p-3",
                    nextAction?.type === "material" && nextAction.id === m.id && "ring-2 ring-primary bg-primary/5",
                    isFutureWeek && "opacity-50",
                  );
                  const materialContent = (
                    <>
                      <BookOpen className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-small font-medium">{m.title}</span>
                      <span className="text-caption text-muted-foreground">
                        {m.format?.toUpperCase() ?? m.kind}
                     </span>
                      {!isFutureWeek && <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
                    </>
                  );
                  return isFutureWeek ? (
                    <div key={m.id} className={materialRowClass}>
                      {materialContent}
                    </div>
                  ) : (
                    <Link key={m.id} href={`/courses/${courseId}/materials/${m.id}`} className={materialRowClass}>
                      {materialContent}
                    </Link>
                  );
                  void mWeek;
                })}

                {weekAssignments.map((a) => {
                  const isNextAction = nextAction?.type === "assignment" && nextAction.id === a.id;
                  const assignmentRowClass = cn(
                    cardVariants({ variant: isFutureWeek ? "flat" : "interactive" }),
                    "flex flex-row items-center gap-3 p-4",
                    isNextAction && "ring-2 ring-primary bg-primary/5",
                    isFutureWeek && "opacity-50",
                  );
                  const assignmentContent = (
                    <>
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border-2 border-border bg-accent text-foreground">
                        <FileText className="size-4" aria-hidden />
                     </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-small font-medium">{a.title ?? "Assignment"}</p>
                        <p className="truncate text-caption text-muted-foreground">
                          {a.lessonTitle}
                          {a.due_at ? ` · due ${new Date(a.due_at).toLocaleDateString()}` : ""}
                       </p>
                     </div>
                      {a.status === "draft" && <Badge variant="draft">Draft</Badge>}
                      {a.status === "not_started" && <Badge variant="outline">Not started</Badge>}
                      {a.status === "submitted" && (
                        <Badge variant="pending">
                          <Clock className="size-3" aria-hidden />
                          Submitted
                       </Badge>
                      )}
                      {a.status === "graded" && (
                        <Badge variant="graded">
                          <CheckCircle2 className="size-3" aria-hidden />
                          Graded
                       </Badge>
                      )}
                      {isNextAction && <span className="font-medium text-link text-caption">← Next</span>}
                      {!isFutureWeek && <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
                    </>
                  );
                  return isFutureWeek ? (
                    <div key={a.id} className={assignmentRowClass}>
                      {assignmentContent}
                    </div>
                  ) : (
                    <Link
                      key={a.id}
                      href={`/courses/${courseId}/lessons/${a.lessonId}?tab=assignment`}
                      className={assignmentRowClass}
                    >
                      {assignmentContent}
                    </Link>
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