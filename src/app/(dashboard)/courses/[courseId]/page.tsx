import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Clock, FileText, Inbox, Paperclip } from "lucide-react";

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

  const [{ data: course }, { data: lessons }, { data: progress }, { data: courseMaterials }, { data: assignments }, { data: submissions }, { data: lessonMaterials }] =
    await Promise.all([
      supabase.from("courses").select("id, title, is_published").eq("id", courseId).single(),
      supabase
        .from("lessons")
        .select("id, title, order_index, video_storage_path")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true }),
      supabase
        .from("progress")
        .select("lesson_id, is_completed")
        .eq("user_id", profile.id),
      supabase
        .from("materials")
        .select("id, title, kind, format, size_bytes")
        .eq("course_id", courseId)
        .is("lesson_id", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("assignments")
        .select("id, lesson_id, title, instructions, due_at, is_published, lessons!inner(course_id)")
        .eq("lessons.course_id", courseId)
        .order("due_at", { ascending: true }),
      supabase
        .from("submissions")
        .select("assignment_id, status, submitted_at, score")
        .eq("user_id", profile.id),
      supabase
        .from("materials")
        .select("lesson_id")
        .eq("course_id", courseId)
        .not("lesson_id", "is", null),
    ]);

  if (!course || (!course.is_published && profile.role !== "admin")) {
    notFound();
  }

  const playable = (lessons ?? []).filter((l) => l.video_storage_path);
  const completedIds = new Set(
    (progress ?? []).filter((p) => p.is_completed).map((p) => p.lesson_id),
  );
  const completedCount = playable.filter((l) => completedIds.has(l.id)).length;
  const percent = playable.length
    ? Math.round((completedCount / playable.length) * 100)
    : 0;

  // Resume target: first not-yet-completed lesson (or first if nothing started).
  const resumeTarget = playable.find((l) => !completedIds.has(l.id)) ?? playable[0];

  // Assignments for THIS course's lessons + the student's submission per one.
  const lessonsById = new Map((lessons ?? []).map((l) => [l.id, l]));
  const submissionByAssignment = new Map(
    (submissions ?? []).map((s) => [s.assignment_id, s]),
  );
  const courseAssignments = (assignments ?? []).map((a) => {
    const lesson = lessonsById.get(a.lesson_id);
    const sub = submissionByAssignment.get(a.id);
    return {
      ...a,
      lessonTitle: lesson?.title ?? "Lesson",
      lessonId: a.lesson_id,
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

  // Per-lesson counts: how many materials and assignments each lesson carries.
  const materialsByLesson = new Map<string, number>();
  for (const m of lessonMaterials ?? []) {
    materialsByLesson.set(m.lesson_id, (materialsByLesson.get(m.lesson_id) ?? 0) + 1);
  }
  const assignmentsByLesson = new Map<string, typeof assignments>();
  for (const a of assignments ?? []) {
    const list = assignmentsByLesson.get(a.lesson_id) ?? [];
    list.push(a);
    assignmentsByLesson.set(a.lesson_id, list);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={course.is_published ? "Published course" : "Draft course"}
        title={course.title}
        description="Pick a lesson below, or review the materials and assignments for this course."
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

      {/* Lessons — primary navigation */}
      <section aria-label="Lessons" className="space-y-2">
        <h2 className="text-h2">Lessons</h2>
        {playable.length === 0 ? (
          <p className="text-small text-muted-foreground">No lessons published yet.</p>
        ) : (
          <ul className="space-y-2">
            {playable.map((lesson, i) => {
              const done = completedIds.has(lesson.id);
              const materialCount = materialsByLesson.get(lesson.id) ?? 0;
              const lessonAssignments = assignmentsByLesson.get(lesson.id) ?? [];
              const assignmentCount = lessonAssignments.length;
              const hasOutstandingAssignment = lessonAssignments.some((a) => {
                if (!a.is_published) return false;
                const sub = submissionByAssignment.get(a.id);
                return !sub || sub.status === "pending_review";
              });
              const assignmentDue = lessonAssignments.find((a) => a.is_published && a.due_at);
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/courses/${courseId}/lessons/${lesson.id}`}
                    className={cn(
                      cardVariants({ variant: "interactive" }),
                      "flex items-center gap-3 p-4"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md border-2",
                        done
                          ? "border-foreground bg-primary text-primary-foreground"
                          : "border-border bg-accent text-foreground"
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <span className="text-xs font-bold">{i + 1}</span>
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-small font-medium text-foreground">
                        {lesson.title}
                      </span>
                      {/* Per-lesson outstanding summary */}
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-caption text-muted-foreground">
                        {materialCount > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Paperclip className="size-3" aria-hidden />
                            {materialCount} material{materialCount === 1 ? "" : "s"}
                          </span>
                        )}
                        {assignmentCount > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <FileText className="size-3" aria-hidden />
                            {assignmentCount} assignment{assignmentCount === 1 ? "" : "s"}
                            {hasOutstandingAssignment ? " · to submit" : ""}
                          </span>
                        )}
                        {assignmentDue?.due_at && !done && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" aria-hidden />
                            due {new Date(assignmentDue.due_at).toLocaleDateString()}
                          </span>
                        )}
                        {!done && materialCount === 0 && assignmentCount === 0 && (
                          <span>Not watched yet</span>
                        )}
                      </span>
                    </span>

                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Course materials */}
      <section aria-label="Course materials" className="space-y-3">
        <h2 className="text-h2">Course materials</h2>
        {courseMaterials && courseMaterials.length > 0 ? (
          <ul className="space-y-2">
            {courseMaterials.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/courses/${courseId}/materials/${m.id}`}
                  className={cn(
                    cardVariants({ variant: "interactive" }),
                    "flex items-center gap-3 p-3"
                  )}
                >
                  <BookOpen className="size-4 shrink-0 text-primary" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-small font-medium">
                    {m.title}
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {m.format?.toUpperCase() ?? m.kind}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            row
            icon={<BookOpen className="size-4" aria-hidden />}
            title="No course materials yet"
            description="Files attached to the course as a whole will appear here."
          />
        )}
      </section>

      {/* Assignments */}
      <section aria-label="Assignments" className="space-y-3">
        <h2 className="text-h2">Assignments</h2>
        {courseAssignments.length === 0 ? (
          <EmptyState
            row
            icon={<Inbox className="size-4" aria-hidden />}
            title="No assignments yet"
            description="Assignments attached to lessons will appear here."
          />
        ) : (
          <ul className="space-y-2">
            {courseAssignments.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/courses/${courseId}/lessons/${a.lessonId}?tab=assignment`}
                  className={cn(
                    cardVariants({ variant: "interactive" }),
                    "flex items-center gap-3 p-4"
                  )}
                >
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
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
