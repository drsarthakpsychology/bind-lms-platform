import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FileVideo2, ListPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "./lesson-form";
import { VideoUpload } from "./video-upload";
import { DeleteLessonButton } from "./delete-lesson-button";
import { CourseActions } from "../course-actions";

import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-8">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Courses
      </Link>

      <PageHeader
        eyebrow={course.is_published ? "Published course" : "Draft course"}
        title={course.title}
        badge={
          course.is_published ? (
            <Badge variant="published">Published</Badge>
          ) : (
            <Badge variant="draft">Draft</Badge>
          )
        }
        description={
          course.is_published
            ? "This course is live to students."
            : "Draft — you can watch any uploaded videos below before publishing."
        }
        actions={<CourseActions courseId={course.id} isPublished={course.is_published} />}
      />

      <Card variant="raised">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListPlus className="size-4 text-primary" aria-hidden />
            Add a lesson
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LessonForm courseId={courseId} nextOrderIndex={nextOrderIndex} />
        </CardContent>
      </Card>

      <section aria-label="Lessons" className="space-y-3">
        {(lessons ?? []).length === 0 ? (
          <EmptyState
            icon={<FileVideo2 className="size-6" aria-hidden />}
            title="No lessons yet"
            description="Add your first lesson above — it starts with a video upload."
          />
        ) : (
          (lessons ?? []).map((lesson) => (
            <div
              key={lesson.id}
              className="flex flex-col gap-3 rounded-lg border-2 border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">
                  <span className="text-numeric mr-2 text-muted-foreground">
                    {lesson.order_index}.
                  </span>
                  {lesson.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {lesson.requires_assignment && (
                    <Badge variant="draft">Requires assignment</Badge>
                  )}
                  {lesson.video_storage_path ? (
                    <Badge variant="published">Video attached</Badge>
                  ) : (
                    <Badge variant="outline">No video</Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {lesson.video_storage_path && (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>Watch</Link>
                  </Button>
                )}
                <VideoUpload
                  lessonId={lesson.id}
                  courseId={courseId}
                  hasVideo={Boolean(lesson.video_storage_path)}
                />
                <DeleteLessonButton lessonId={lesson.id} courseId={courseId} />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
