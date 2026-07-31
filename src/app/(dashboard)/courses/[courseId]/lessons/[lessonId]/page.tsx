import { headers } from "next/headers";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getPlaybackUrl, completeAndAdvance } from "./actions";
import { VideoPlayer } from "./video-player";
import { AssignmentPanel } from "./assignment-panel";

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
          .select("status, text_content")
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

  const continueButton = (
    <ContinueButton
      lessonId={lessonId}
      continueTarget={continueTarget}
      hasNext={Boolean(nextLesson)}
      disabled={mustSubmitFirst}
    />
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          {prevLesson ? (
            <Link
              href={`/courses/${courseId}/lessons/${prevLesson.id}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Previous Lesson
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground/50">← Previous Lesson</span>
          )}
        </div>
        {continueButton}
      </div>

      <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {lesson?.title ?? "Lesson"}
      </h1>

      <div className="mt-4">
        {playback.ok ? (
          <VideoPlayer
            lessonId={lessonId}
            src={playback.url}
            resumeSeconds={playback.resumeSeconds}
            watermarkLabel={watermarkLabel}
          />
        ) : (
          <p className="rounded-lg bg-status-alert-bg px-3 py-2 text-sm text-status-alert-fg">
            {playback.error}
          </p>
        )}
      </div>

      {lesson?.description && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-medium text-foreground">About this lesson</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {lesson.description}
          </p>
        </div>
      )}

      {assignment && (
        <AssignmentPanel
          assignmentId={assignment.id}
          promptText={assignment.prompt_text}
          submissionType={assignment.submission_type === "audio" ? "audio" : "text"}
          existingSubmission={
            existingSubmission
              ? {
                  status: existingSubmission.status === "approved" ? "approved" : "pending_review",
                  text_content: existingSubmission.text_content,
                }
              : null
          }
        />
      )}

      {mustSubmitFirst && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Submit the assignment above to continue to the next lesson.
        </p>
      )}

      <div className="mt-6 flex justify-end">{continueButton}</div>
    </div>
  );
}

function ContinueButton({
  lessonId,
  continueTarget,
  hasNext,
  disabled,
}: {
  lessonId: string;
  continueTarget: string;
  hasNext: boolean;
  disabled: boolean;
}) {
  if (disabled) {
    return (
      <button
        type="button"
        disabled
        title="Submit the assignment below to continue"
        className="cursor-not-allowed rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-50"
      >
        {hasNext ? "Complete and Continue →" : "Complete Course →"}
      </button>
    );
  }

  return (
    <form action={completeAndAdvance.bind(null, lessonId, continueTarget)}>
      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {hasNext ? "Complete and Continue →" : "Complete Course →"}
      </button>
    </form>
  );
}
