import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "./lesson-form";
import { VideoUpload } from "./video-upload";
import { DeleteLessonButton } from "./delete-lesson-button";
import { CourseActions } from "../course-actions";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();

  const [{ data: course }, { data: lessons }] = await Promise.all([
    supabase.from("courses").select("id, title, is_published").eq("id", courseId).single(),
    supabase
      .from("lessons")
      .select("id, title, order_index, requires_assignment, video_storage_path")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true }),
  ]);

  if (!course) {
    notFound();
  }

  const nextOrderIndex = (lessons ?? []).length
    ? Math.max(...(lessons ?? []).map((l) => l.order_index)) + 1
    : 1;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/courses" className="text-sm text-muted-foreground hover:text-foreground">
          ← Courses
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            {course.title}
          </h1>
          <CourseActions courseId={course.id} isPublished={course.is_published} />
        </div>
        {!course.is_published && (
          <p className="mt-1 text-xs text-muted-foreground">
            Draft — you can watch any uploaded videos below before publishing.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-sm font-medium text-foreground">Add a lesson</h2>
        <div className="mt-3">
          <LessonForm courseId={courseId} nextOrderIndex={nextOrderIndex} />
        </div>
      </div>

      <div className="space-y-2">
        {(lessons ?? []).length === 0 && (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            No lessons yet.
          </p>
        )}
        {(lessons ?? []).map((lesson) => (
          <div
            key={lesson.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-foreground">
                <span className="font-mono text-muted-foreground">{lesson.order_index}.</span>{" "}
                {lesson.title}
              </p>
              {lesson.requires_assignment && (
                <p className="mt-0.5 text-xs text-muted-foreground">Requires assignment</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {lesson.video_storage_path && (
                <Link
                  href={`/courses/${courseId}/lessons/${lesson.id}`}
                  className="rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  Watch
                </Link>
              )}
              <VideoUpload
                lessonId={lesson.id}
                courseId={courseId}
                hasVideo={Boolean(lesson.video_storage_path)}
              />
              <DeleteLessonButton lessonId={lesson.id} courseId={courseId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
