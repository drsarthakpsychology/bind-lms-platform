import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronLeft, FileVideo2, ListPlus, Paperclip, UserRoundPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "./lesson-form";
import { VideoUpload } from "./video-upload";
import { DeleteLessonButton } from "./delete-lesson-button";
import { LessonStatusToggle, type LessonStatus } from "./lesson-status-toggle";
import { CourseActions } from "../course-actions";
import { EnrollStudents } from "./enroll-students";
import { MaterialUploader } from "./material-uploader";
import { RenameCourse } from "./rename-course";

import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_BADGES: Record<LessonStatus, { label: string; variant: "published" | "pending" | "draft" }> = {
  hidden: { label: "Hidden", variant: "draft" },
  live: { label: "Yet to be live", variant: "pending" },
  unlocked: { label: "Unlocked", variant: "published" },
};

/** Map a raw lesson.status to a plain-word badge (falls back to "live"). */
function statusBadge(status: unknown) {
  if (status === "unlocked" || status === "hidden") return STATUS_BADGES[status];
  return STATUS_BADGES.live;
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();

  const [{ data: course }, { data: lessons }, { data: students }, { data: enrollments }, { data: courseMaterials }] =
    await Promise.all([
      supabase.from("courses").select("id, title, is_published").eq("id", courseId).single(),
      supabase
        .from("lessons")
        .select("id, title, order_index, requires_assignment, video_storage_path, status")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true }),
      supabase
        .from("profiles")
        .select("id, email")
        .eq("role", "student")
        .eq("is_test", false)
        .order("email", { ascending: true }),
      supabase
        .from("course_enrollments")
        .select("user_id")
        .eq("course_id", courseId),
      supabase
        .from("materials")
        .select("id, title, kind, format, size_bytes, url, storage_path")
        .eq("course_id", courseId)
        .is("lesson_id", null)
        .order("sort_order", { ascending: true }),
    ]);

  if (!course) {
    notFound();
  }

  const nextOrderIndex = (lessons ?? []).length
    ? Math.max(...(lessons ?? []).map((l) => l.order_index)) + 1
    : 1;

  const enrolledIds = (enrollments ?? []).map((e) => e.user_id);

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
        eyebrow="Course builder"
        title={<RenameCourse courseId={course.id} title={course.title} />}
        badge={
          course.is_published ? (
            <Badge variant="published">Published</Badge>
          ) : (
            <Badge variant="draft">Draft</Badge>
          )
        }
        description={
          course.is_published
            ? "Students can see this course. Changes show up right away."
            : "Students can't see this course until you publish it."
        }
        actions={<CourseActions courseId={course.id} isPublished={course.is_published} showOpenBuilder={false} />}
      />

      {/* De-densified admin surface (T44): each management task is an accordion
          section, open-by-default for the primary create action and collapsed
          for the secondary sections, so mobile isn't one long scroll of
          competing forms. */}
      <details open className="group rounded-lg border-2 border-border bg-card hard-shadow-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-body-strong [&::-webkit-details-marker]:hidden">
          <ListPlus className="size-4 text-link" aria-hidden />
          Add a lesson
          <ChevronDown
            className="ml-auto size-4 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="border-t-2 border-border px-4 py-4">
          <LessonForm courseId={courseId} nextOrderIndex={nextOrderIndex} />
        </div>
      </details>

      <section aria-labelledby="lessons-heading" className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 id="lessons-heading" className="text-h2">
            Lessons
          </h2>
          <Badge variant="secondary">{(lessons ?? []).length}</Badge>
        </div>

        {(lessons ?? []).length === 0 ? (
          <EmptyState
            icon={<FileVideo2 className="size-6" aria-hidden />}
            title="No lessons yet"
            description="Add your first lesson above. It starts with a video."
          />
        ) : (
          (lessons ?? []).map((lesson) => {
            const badge = statusBadge(lesson.status);
            return (
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
                    <Badge variant={badge.variant}>{badge.label}</Badge>
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
                  <LessonStatusToggle
                    lessonId={lesson.id}
                    courseId={courseId}
                    status={(lesson.status ?? "live") as LessonStatus}
                  />
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
            );
          })
        )}
      </section>

      <details className="group rounded-lg border-2 border-border bg-card hard-shadow-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-body-strong [&::-webkit-details-marker]:hidden">
          <Paperclip className="size-4 text-link" aria-hidden />
          Course materials
          <Badge variant="secondary" className="ml-1">
            {(courseMaterials ?? []).length}
          </Badge>
          <ChevronDown
            className="ml-auto size-4 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="border-t-2 border-border px-4 py-4">
          <MaterialUploader
            courseId={courseId}
            lessonId={null}
            materials={(courseMaterials ?? []).map((m) => ({
              id: m.id,
              title: m.title,
              kind: m.kind,
              format: m.format,
              sizeBytes: m.size_bytes,
              url: m.url,
              storagePath: m.storage_path,
            }))}
          />
        </div>
      </details>

      <details className="group rounded-lg border-2 border-border bg-card hard-shadow-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-body-strong [&::-webkit-details-marker]:hidden">
          <UserRoundPlus className="size-4 text-link" aria-hidden />
          Enrolled students
          <Badge variant="secondary" className="ml-1">
            {enrolledIds.length}
          </Badge>
          <ChevronDown
            className="ml-auto size-4 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="border-t-2 border-border px-4 py-4">
          <EnrollStudents
            courseId={courseId}
            students={(students ?? []).map((s) => ({ id: s.id, email: s.email }))}
            enrolledIds={enrolledIds}
          />
        </div>
      </details>
    </div>
  );
}
