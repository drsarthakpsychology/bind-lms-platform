import { Suspense } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, FileText, Lock, Paperclip } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getPlaybackUrl } from "./actions";
import { VideoPlayer } from "./video-player";
import { CompleteButton } from "./complete-button";
import { AssignmentEditor } from "@/app/(dashboard)/admin/courses/[courseId]/assignment-editor";
import { SubmissionForm } from "./submission-form";
import { LessonTabs } from "./lesson-tabs";
import { LessonPicker } from "./lesson-picker";
import { MaterialsList } from "./materials-list";
import { MaterialUploader } from "@/app/(dashboard)/admin/courses/[courseId]/material-uploader";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/design-system/empty-state";

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { courseId, lessonId } = await params;
  const { tab: tabParam } = await searchParams;
  const session = await getSession();
  if (session.status !== "ok") return null;
  const { profile } = session;

  const supabase = await createClient();

  const [{ data: lesson }, { data: course }, { data: courseLessons }, { data: userData }, { data: assignment }, { data: materials }, { data: progress }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("id, title, description, requires_assignment")
        .eq("id", lessonId)
        .single(),
      supabase.from("courses").select("id, title").eq("id", courseId).single(),
      supabase
        .from("lessons")
        .select("id, title, order_index, video_storage_path")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true }),
      supabase.auth.getUser(),
      supabase
        .from("assignments")
        .select(
          "id, prompt_text, submission_type, title, instructions, due_at, allow_late, is_published, max_files, max_file_mb, accepted_formats, submissions(id)",
        )
        .eq("lesson_id", lessonId)
        .maybeSingle(),
      supabase
        .from("materials")
        .select("id, title, kind, format, size_bytes, url, sort_order")
        .eq("lesson_id", lessonId)
        .order("sort_order", { ascending: true }),
      supabase
        .from("progress")
        .select("lesson_id, is_completed")
        .eq("user_id", profile.id),
    ]);

  // Which tab to show. Invalid/absent tab falls back to watch. If a non-watch
  // tab is requested but there's no content for it, fall back to watch too.
  const hasMaterials = Boolean((materials ?? []).length);
  const hasAssignment = Boolean(assignment);
  const requestedTab = tabParam === "materials" ? "materials" : tabParam === "assignment" ? "assignment" : "watch";
  const tab =
    (requestedTab === "materials" && !hasMaterials) ||
    (requestedTab === "assignment" && !hasAssignment)
      ? "watch"
      : requestedTab;

  const existingSubmission = assignment
    ? (
        await supabase
          .from("submissions")
          .select("id, status, text_content, audio_storage_path, note, submitted_at, is_late, submission_files(id, original_name, storage_path)")
          .eq("assignment_id", assignment.id)
          .eq("user_id", profile.id)
          .maybeSingle()
      ).data
    : null;

  // The blueprint's rule: a pending assignment blocks moving on. "Blocks"
  // means a submission must exist — grading (approval) is a separate,
  // asynchronous admin workflow that shouldn't stall the student mid-course.
  const mustSubmitFirst = Boolean(assignment) && !existingSubmission;

  const playable = (courseLessons ?? []).filter((l) => l.video_storage_path);
  const currentIndex = playable.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? playable[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < playable.length - 1 ? playable[currentIndex + 1] : null;

  const continueTarget = nextLesson
    ? `/courses/${courseId}/lessons/${nextLesson.id}`
    : "/dashboard";

  const playback = await getPlaybackUrl(lessonId);

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const user = userData?.user;
  const watermarkLabel = `${user?.email ?? "unknown"} · ${user?.id.slice(0, 8) ?? "unknown"} · ${ip}`;

  const completedIds = new Set(
    (progress ?? []).filter((p) => p.is_completed).map((p) => p.lesson_id),
  );
  const lessonComplete = completedIds.has(lessonId);

  const pickerLessons = (playable ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    orderIndex: l.order_index,
    isCompleted: completedIds.has(l.id),
    hasVideo: Boolean(l.video_storage_path),
  }));

  // One forward action, labelled by where the student is:
  //   mid-course            → Next lesson →
  //   last, not complete    → Finish course →
  //   last, already complete → Back to my courses → (secondary variant)
  const lastLessonCompleted = !nextLesson && lessonComplete;
  const forwardLabel = lastLessonCompleted
    ? "Back to my courses"
    : nextLesson
      ? "Next lesson"
      : "Finish course";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Back control — labelled with where it goes + compact lesson picker.
          One navigation surface at a time (no course column). */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          {course?.title ?? "Course"}
        </Link>
        {pickerLessons.length > 1 && (
          <LessonPicker
            courseId={courseId}
            courseTitle={course?.title ?? "Course"}
            lessons={pickerLessons}
            currentId={lessonId}
          />
        )}
      </div>

      {/* Lesson header */}
      <div className="space-y-2">
        <h1 className="text-h1">{lesson?.title ?? "Lesson"}</h1>
        {lesson?.description ? (
          <p className="text-small text-muted-foreground">{lesson.description}</p>
        ) : null}
      </div>

      {/* Tab bar — Watch / Materials / Assignment. Hidden entirely on a plain
          video lesson (no materials, no assignment). */}
      <Suspense fallback={null}>
        <LessonTabs
          courseId={courseId}
          lessonId={lessonId}
          tab={tab}
          hasMaterials={hasMaterials}
          hasAssignment={hasAssignment}
        />
      </Suspense>

      {/* Watch tab — the video. */}
      {tab === "watch" && (
        <div className="rounded-lg border-2 border-foreground bg-card p-2 hard-shadow-sm sm:p-3">
          {playback.ok ? (
            <VideoPlayer
              lessonId={lessonId}
              src={playback.url}
              resumeSeconds={playback.resumeSeconds}
              watermarkLabel={watermarkLabel}
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-md bg-muted p-6 text-center">
              <Alert variant="warning" className="max-w-md">
                <FileText className="size-4" aria-hidden />
                <AlertTitle>Video unavailable</AlertTitle>
                <AlertDescription>{playback.error}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      )}

      {/* Materials tab */}
      {tab === "materials" && (
        <section aria-label="Materials" className="space-y-3">
          <h2 className="text-h2 flex items-center gap-2">
            <Paperclip className="size-4 text-primary" aria-hidden />
            Materials
          </h2>

          {profile.role === "admin" && (
            <MaterialUploader
              courseId={courseId}
              lessonId={lessonId}
              materials={(materials ?? []).map((m) => ({
                id: m.id,
                title: m.title,
                kind: m.kind,
                format: m.format,
                sizeBytes: m.size_bytes,
                url: m.url,
              }))}
            />
          )}

          {hasMaterials ? (
            <MaterialsList
              materials={(materials ?? []).map((m) => ({
                id: m.id,
                title: m.title,
                kind: m.kind,
                format: m.format,
                sizeBytes: m.size_bytes,
              }))}
              courseId={courseId}
              isAdmin={profile.role === "admin"}
            />
          ) : (
            profile.role !== "admin" && (
              <EmptyState
                row
                icon={<Paperclip className="size-4" aria-hidden />}
                title="No materials yet"
                description="Your instructor hasn't added materials for this lesson."
              />
            )
          )}
        </section>
      )}

      {/* Footer: prev + a single forward action. Exactly one forward button. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {prevLesson ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
              <ArrowLeft className="size-4" aria-hidden />
              Previous lesson
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled
            aria-disabled="true"
            title="You're on the first lesson"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Previous lesson
          </Button>
        )}

        <ContinueControl
          lessonId={lessonId}
          courseId={courseId}
          continueTarget={continueTarget}
          label={forwardLabel}
          disabled={mustSubmitFirst}
          isFinalLesson={!nextLesson}
          alreadyComplete={lastLessonCompleted}
        />
      </div>

      {/* Assignment tab */}
      {tab === "assignment" && assignment && profile.role === "admin" && (
        <section aria-label="Assignment" className="space-y-3">
          <h2 className="text-h2 flex items-center gap-2">
            <FileText className="size-4 text-primary" aria-hidden />
            Assignment
          </h2>
          <AssignmentEditor
            courseId={courseId}
            lessonId={lessonId}
            assignment={{
              id: assignment.id,
              title: assignment.title ?? "Assignment",
              instructions: assignment.instructions ?? assignment.prompt_text,
              due_at: assignment.due_at,
              allow_late: assignment.allow_late,
              is_published: assignment.is_published,
              max_files: assignment.max_files,
              max_file_mb: assignment.max_file_mb,
              accepted_formats: assignment.accepted_formats ?? ["pdf", "docx", "image"],
              submissionCount: Array.isArray(assignment.submissions)
                ? assignment.submissions.length
                : 0,
            }}
          />
        </section>
      )}

      {/* Assignment tab — student view */}
      {tab === "assignment" && assignment && profile.role !== "admin" && (
        <section aria-label="Assignment" className="space-y-3">
          <h2 className="text-h2 flex items-center gap-2">
            <FileText className="size-4 text-primary" aria-hidden />
            {assignment.title ?? "Assignment"}
          </h2>
          {assignment.is_published ? (
            <Card variant="raised">
              <CardContent className="pt-6">
                {assignment.instructions ?? assignment.prompt_text ? (
                  <div className="mb-4 whitespace-pre-wrap rounded-md border-2 border-border bg-muted/50 p-4 text-small leading-relaxed text-foreground">
                    {assignment.instructions ?? assignment.prompt_text}
                  </div>
                ) : null}
                <SubmissionForm
                  assignmentId={assignment.id}
                  dueAt={assignment.due_at}
                  allowLate={assignment.allow_late}
                  maxFiles={assignment.max_files ?? 3}
                  maxFileMb={assignment.max_file_mb ?? 25}
                  existing={
                    existingSubmission
                      ? {
                          status: existingSubmission.status === "returned"
                            ? "returned"
                            : existingSubmission.status === "approved"
                              ? "approved"
                              : "submitted",
                          submittedAt: existingSubmission.submitted_at,
                          isLate: existingSubmission.is_late,
                          note: existingSubmission.note,
                          files: Array.isArray(existingSubmission.submission_files)
                            ? existingSubmission.submission_files.map((f) => ({
                                id: f.id,
                                originalName: f.original_name,
                                storagePath: f.storage_path,
                              }))
                            : [],
                        }
                      : null
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              compact
              icon={<FileText className="size-6" aria-hidden />}
              title="Not published yet"
              description="Your instructor hasn't published this assignment."
            />
          )}
        </section>
      )}

      {/* Assignment tab, no assignment exists — admins get the editor to add one */}
      {tab === "assignment" && !assignment && (
        profile.role === "admin" ? (
          <section aria-label="Assignment" className="space-y-3">
            <h2 className="text-h2 flex items-center gap-2">
              <FileText className="size-4 text-primary" aria-hidden />
              Assignment
            </h2>
            <AssignmentEditor courseId={courseId} lessonId={lessonId} assignment={null} />
          </section>
        ) : (
          <EmptyState
            compact
            icon={<FileText className="size-6" aria-hidden />}
            title="No assignment"
            description="This lesson doesn't have an assignment."
          />
        )
      )}

      {mustSubmitFirst && (
        <Alert variant="warning">
          <Lock className="size-4" aria-hidden />
          <AlertTitle>Submit to continue</AlertTitle>
          <AlertDescription>
            Submit the assignment above to unlock the next lesson.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function ContinueControl({
  lessonId,
  courseId,
  continueTarget,
  label,
  disabled,
  isFinalLesson,
  alreadyComplete,
}: {
  lessonId: string;
  courseId: string;
  continueTarget: string;
  label: string;
  disabled: boolean;
  isFinalLesson: boolean;
  alreadyComplete?: boolean;
}) {
  return (
    <CompleteButton
      lessonId={lessonId}
      courseId={courseId}
      continueTarget={continueTarget}
      label={label}
      disabled={disabled}
      isFinalLesson={isFinalLesson}
      alreadyComplete={alreadyComplete}
    />
  );
}
