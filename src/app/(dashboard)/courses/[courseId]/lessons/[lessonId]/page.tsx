import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, FileText, Lock } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getPlaybackUrl, completeAndAdvance } from "./actions";
import { VideoPlayer } from "./video-player";
import { AssignmentPanel } from "./assignment-panel";

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
  const continueLabel = nextLesson ? "Complete and Continue" : "Complete Course";

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

      {/* Bottom actions: prev + continue */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {prevLesson ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
              <ArrowLeft className="size-4" aria-hidden />
              Previous lesson
            </Link>
          </Button>
        ) : (
          <span className="inline-flex h-8 items-center gap-2 rounded-md border-2 border-border px-3 text-small text-muted-foreground opacity-60">
            <ArrowLeft className="size-4" aria-hidden />
            Previous lesson
          </span>
        )}

        <ContinueControl
          lessonId={lessonId}
          courseId={courseId}
          continueTarget={continueTarget}
          label={continueLabel}
          disabled={mustSubmitFirst}
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
              submissionType={assignment.submission_type === "audio" ? "audio" : "text"}
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

      {/* Bottom continue */}
      <div className="flex justify-end">
        <ContinueControl
          lessonId={lessonId}
          courseId={courseId}
          continueTarget={continueTarget}
          label={continueLabel}
          disabled={mustSubmitFirst}
          size="lg"
        />
      </div>
    </div>
  );
}

function ContinueControl({
  lessonId,
  courseId,
  continueTarget,
  label,
  disabled,
  size = "default",
}: {
  lessonId: string;
  courseId: string;
  continueTarget: string;
  label: string;
  disabled: boolean;
  size?: "default" | "lg";
}) {
  if (disabled) {
    return (
      <Button type="button" disabled size={size} title="Submit the assignment below to continue">
        {label}
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    );
  }

  return (
    <form action={completeAndAdvance.bind(null, lessonId, courseId, continueTarget)}>
      <Button type="submit" size={size}>
        {label}
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </form>
  );
}
