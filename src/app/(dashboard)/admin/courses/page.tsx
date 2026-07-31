import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreateCourseForm } from "./create-course-form";
import { CourseActions } from "./course-actions";

export default async function CoursesPage() {
  const supabase = await createClient();

  const [{ data: courses }, { data: allLessons }] = await Promise.all([
    supabase.from("courses").select("id, title, is_published").order("title", { ascending: true }),
    supabase.from("lessons").select("course_id"),
  ]);

  const lessonCounts = new Map<string, number>();
  for (const lesson of allLessons ?? []) {
    lessonCounts.set(lesson.course_id, (lessonCounts.get(lesson.course_id) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Courses
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Unpublished courses are invisible to students regardless of enrollment. Preview a
          draft&apos;s videos from its detail page before publishing.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-sm font-medium text-foreground">Create a course</h2>
        <div className="mt-3">
          <CreateCourseForm />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(courses ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">No courses yet.</p>
        )}
        {(courses ?? []).map((course) => (
          <div key={course.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/admin/courses/${course.id}`}
                className="font-medium text-foreground hover:underline"
              >
                {course.title}
              </Link>
              <CourseActions courseId={course.id} isPublished={course.is_published} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {lessonCounts.get(course.id) ?? 0} lessons
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
