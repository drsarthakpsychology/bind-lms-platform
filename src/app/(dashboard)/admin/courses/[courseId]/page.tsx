import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronLeft, FileVideo2, ListPlus, Paperclip } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "./lesson-form";
import { VideoUpload } from "./video-upload";
import { DeleteLessonButton } from "./delete-lesson-button";
import { LessonStatusToggle, type LessonStatus } from "./lesson-status-toggle";
import { EditLesson, type EditLessonInitial } from "./edit-lesson";
import { MoveLessonButton } from "./move-lesson-button";
import { AssignmentToggle } from "./assignment-toggle";
import { CourseActions } from "../course-actions";
import { LazyEnrolledStudents } from "./enrolled-students-lazy";
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

/**
 * Map a raw lesson.status to a plain-word badge. Missing/null values mean the
 * lesson predates the three-state model — students see those as playable
 * (unlocked), so the builder says the same thing instead of "Yet to be live".
 */
function statusBadge(status: unknown): { label: string; variant: "published" | "pending" | "draft" } {
  if (status === "live") return STATUS_BADGES.live;
  if (status === "hidden") return STATUS_BADGES.hidden;
  return STATUS_BADGES.unlocked;
}

type LessonRow = {
  id: string;
  title: string;
  order_index: number;
  week: number | null;
  requires_assignment: boolean;
  video_storage_path: string | null;
  video_status: string | null;
  description: string | null;
  status: string | null;
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();

  const [{ data: course }, { data: lessons }, { data: enrollments }, { data: courseMaterials }, { data: assignments }] =
    await Promise.all([
      supabase.from("courses").select("id, title, is_published, weeks").eq("id", courseId).single(),
      supabase
        .from("lessons")
        .select("id, title, order_index, week, requires_assignment, video_storage_path, video_status, description, status")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true })
        .order("id", { ascending: true }),
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
      supabase
        .from("assignments")
        .select("id, lesson_id, is_published, instructions, prompt_text, lessons!inner(course_id)")
        .eq("lessons.course_id", courseId),
    ]);

  if (!course) {
    notFound();
  }

  const rows = (lessons ?? []) as LessonRow[];
  const nextOrderIndex = rows.length ? Math.max(...rows.map((l) => l.order_index)) + 1 : 1;
  const defaultWeek = rows.length ? Math.max(1, ...rows.map((l) => l.week ?? 1)) : 1;
  const enrolledIds = (enrollments ?? []).map((e) => e.user_id);

  // Week-aware listing — mirror the student's Week N groups so the admin
  // reasons in the same units the cohort does. Lessons with a null week
  // (pre-week model) land in week 1, matching the student page.
  const weeks = new Map<number, LessonRow[]>();
  for (const l of rows) {
    const w = l.week ?? 1;
    const list = weeks.get(w) ?? [];
    list.push(l);
    weeks.set(w, list);
  }
  const orderedWeeks = Array.from(weeks.entries()).sort((a, b) => a[0] - b[0]);

  const assignmentByLesson = new Map<string, { id: string; is_published: boolean; instructions: string | null; prompt_text: string | null }>();
  for (const a of assignments ?? []) {
    assignmentByLesson.set(a.lesson_id, a);
  }

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
          <LessonForm courseId={courseId} nextOrderIndex={nextOrderIndex} defaultWeek={defaultWeek} />
        </div>
      </details>

      <section aria-labelledby="lessons-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 id="lessons-heading" className="text-h2">
            Lessons
          </h2>
          <Badge variant="secondary">{rows.length}</Badge>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={<FileVideo2 className="size-6" aria-hidden />}
            title="No lessons yet"
            description="Add your first lesson above. It starts with a video."
          />
        ) : (
          orderedWeeks.map(([weekNum, weekLessons]) => (
            <div key={weekNum} className="space-y-2">
              <h3 className="flex items-center gap-2 px-1 text-h3">
                Week {weekNum}
                <Badge variant="secondary">{weekLessons.length}</Badge>
              </h3>
              <div className="space-y-3">
                {weekLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    courseId={courseId}
                    assignment={assignmentByLesson.get(lesson.id)}
                    isFirstInCourse={lesson.order_index === rows[0]?.order_index}
                    isLastInCourse={lesson.order_index === rows[rows.length - 1]?.order_index}
                  />
                ))}
              </div>
            </div>
          ))
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

      <LazyEnrolledStudents courseId={courseId} enrolledCount={enrolledIds.length} />
    </div>
  );
}

function LessonCard({
  lesson,
  courseId,
  assignment,
  isFirstInCourse,
  isLastInCourse,
}: {
  lesson: LessonRow;
  courseId: string;
  assignment: { id: string; is_published: boolean; instructions: string | null; prompt_text: string | null } | undefined;
  isFirstInCourse: boolean;
  isLastInCourse: boolean;
}) {
  const badge = statusBadge(lesson.status);

  // Video state: no path → none; path + failed → upload didn't land; path +
  // pending → uploaded but not yet verified; path + ready → playable.
  const videoBadge = !lesson.video_storage_path
    ? { label: "No video", variant: "outline" as const }
    : lesson.video_status === "failed"
      ? { label: "Video upload failed", variant: "destructive" as const }
      : lesson.video_status === "ready" || lesson.video_status === null
        ? { label: "Video attached", variant: "published" as const }
        : { label: "Processing video…", variant: "pending" as const };

  const editInitial: EditLessonInitial = {
    title: lesson.title,
    description: lesson.description ?? "",
    week: lesson.week ?? 1,
    requiresAssignment: lesson.requires_assignment,
    assignmentPrompt: assignment?.instructions ?? assignment?.prompt_text ?? "",
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border-2 border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-medium text-foreground">
            <span className="text-numeric mr-2 text-muted-foreground">
              {lesson.order_index}.
            </span>
            {lesson.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant={badge.variant}>{badge.label}</Badge>
            <Badge variant={videoBadge.variant}>{videoBadge.label}</Badge>
            {assignment ? (
              <AssignmentToggle
                lessonId={lesson.id}
                courseId={courseId}
                published={assignment.is_published}
              />
            ) : lesson.requires_assignment ? (
              <Badge variant="draft">Assignment needs setup</Badge>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <MoveLessonButton
              lessonId={lesson.id}
              courseId={courseId}
              direction="up"
              disabled={isFirstInCourse}
              label="Move lesson up"
            />
            <MoveLessonButton
              lessonId={lesson.id}
              courseId={courseId}
              direction="down"
              disabled={isLastInCourse}
              label="Move lesson down"
            />
          </div>
          <EditLesson lessonId={lesson.id} courseId={courseId} initial={editInitial} />
          <LessonStatusToggle
            lessonId={lesson.id}
            courseId={courseId}
            status={(lesson.status ?? "unlocked") as LessonStatus}
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
    </div>
  );
}
