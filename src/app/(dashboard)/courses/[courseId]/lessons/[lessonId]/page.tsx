import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, FileText, Lock } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getPlaybackUrl } from "./actions";
import { VideoPlayer } from "./video-player";
import { AssignmentPanel } from "./assignment-panel";
import { CompleteButton } from "./complete-button";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const session = await getSession();
  if (session.status !== "ok") return null;
  const { profile } = session;

  const supabase = await createClient();

  const [{ data: lesson }, { data: courseLessons }, { data: userData }, { data: assignment }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("id, title, description, requires_assignment")
        .eq("id", lessonId)
        .single(),
      supabase
        .from("lessons")
        .select("id, order_index, video_storage_path")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true }),
      supabase.auth.getUser(),
      supabase
        .from("assignments")
        .select("id, prompt_text, submission_type")
        .eq("lesson_id", lessonId)
        .maybeSingle(),
    ]);

  const existingSubmission = assignment
    ? (
        await supabase
          .from("submissions")
          .select("status, text_content, audio_storage_path")
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

  const position = currentIndex >= 0 ? `${currentIndex + 1} / ${playable.length}` : null;

  // Whether THIS lesson is already marked complete — distinguishes
  // "Finish course" from "Back to my courses" on the final lesson.
  const { data: ownProgress } = await supabase
    .from("progress")
    .select("is_completed")
    .eq("user_id", profile.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();
  const lessonComplete = Boolean(ownProgress?.is_completed);

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
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          My Courses
        </Link>
        {position ? (
          <span className="text-numeric text-caption text-muted-foreground">{position}</span>
        ) : null}
      </div>

      {/* Lesson header */}
      <div className="space-y-2">
        <h1 className="text-h1">{lesson?.title ?? "Lesson"}</h1>
        {lesson?.description ? (
          <p className="text-small text-muted-foreground">{lesson.description}</p>
        ) : null}
      </div>

      {/* Video frame */}
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

      {/* Assignment */}
      {assignment && (
        <Card variant="raised">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4 text-primary" aria-hidden />
              Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AssignmentPanel
              assignmentId={assignment.id}
              promptText={assignment.prompt_text}
              submissionTypes={assignment.submission_type || "text"}
              existingSubmission={
                existingSubmission
                  ? {
                      status: existingSubmission.status === "approved" ? "approved" : "pending_review",
                      text_content: existingSubmission.text_content,
                      audio_storage_path: existingSubmission.audio_storage_path,
                    }
                  : null
              }
            />
          </CardContent>
        </Card>
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
