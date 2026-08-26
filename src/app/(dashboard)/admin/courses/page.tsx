import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CreateCourseForm } from "./create-course-form";
import { CourseActions } from "./course-actions";

import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const published = (courses ?? []).filter((c) => c.is_published).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Courses"
        description="Drafts are hidden from students. Open a course to add lessons and publish."
        badge={
          <Badge variant="secondary">
            {published} published / {(courses ?? []).length} total
          </Badge>
        }
      />

      <Card variant="raised">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-4 text-link" aria-hidden />
            Create a course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCourseForm />
        </CardContent>
      </Card>

      {(courses ?? []).length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-6" aria-hidden />}
          title="No courses yet"
          description="Create your first course above to get started."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(courses ?? []).map((course) => (
            <Card key={course.id} variant="flat" className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="text-h3 leading-snug hover:text-link"
                  >
                    {course.title}
                  </Link>
                  <CourseActions courseId={course.id} isPublished={course.is_published} />
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                <span className="text-caption text-muted-foreground">
                  {lessonCounts.get(course.id) ?? 0} lessons
                </span>
                {course.is_published ? (
                  <Badge variant="published">Published</Badge>
                ) : (
                  <Badge variant="draft">Draft</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
