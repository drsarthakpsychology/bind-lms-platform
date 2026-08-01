import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, FileText } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

import { PageHeader } from "@/components/design-system/page-header";
import { cardVariants } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

  const [{ data: course }, { data: lessons }, { data: progress }] = await Promise.all([
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
                    <span className="min-w-0 flex-1 truncate text-small font-medium">
                      {lesson.title}
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
        <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-6 text-center">
          <BookOpen className="mx-auto size-6 text-muted-foreground" aria-hidden />
          <p className="mt-2 text-small text-muted-foreground">
            Files your instructor attaches to this course will appear here.
          </p>
        </div>
      </section>

      {/* Assignments */}
      <section aria-label="Assignments" className="space-y-3">
        <h2 className="text-h2">Assignments</h2>
        <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-6 text-center">
          <FileText className="mx-auto size-6 text-muted-foreground" aria-hidden />
          <p className="mt-2 text-small text-muted-foreground">
            Assignments attached to lessons will appear here with their status.
          </p>
        </div>
      </section>
    </div>
  );
}
