import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, ChevronLeft, FileText, Paperclip } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_ACCEPTED_FORMATS } from "@/lib/media/registry";
import { VIEW_MODE_COOKIE } from "@/app/(dashboard)/view-mode-constants";
// Lazy wrapper — the player pulls in hls.js (~500KB min / ~150KB gzip). The
// dynamic import lives in a Client Component (ssr:false is not supported in
// Server Components), which splits hls.js into a deferred chunk loaded only
// when the "Watch" tab mounts the player.
import { LazyVideoPlayer } from "./lazy-video-player";
import { CompleteButton } from "./complete-button";
import { AssignmentEditor } from "@/app/(dashboard)/admin/courses/[courseId]/assignment-editor";
import { SubmissionForm } from "./submission-form";
import { LessonTabs } from "./lesson-tabs";
import { LessonPicker } from "./lesson-picker";
import { LessonNav } from "./lesson-nav";
import { MaterialsList } from "./materials-list";
import { MaterialUploader } from "@/app/(dashboard)/admin/courses/[courseId]/material-uploader";

import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/design-system/empty-state";
import { QuizCheck } from "@/components/practice/quiz-check";
import { QUIZ_BANK } from "@/lib/quiz/quiz-bank";
import { MobileStickyAction } from "@/components/mobile/mobile-sticky-action";
import { MobileCompletionState } from "@/components/mobile/mobile-completion-state";

// "Check what stuck" — the risk-assessment + reporting items are the most
// universally relevant after any lesson (the order-steps spine).
const LESSON_QUIZ_ITEMS = QUIZ_BANK.filter((i) => i.type === "order_steps").slice(0, 4);

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { courseId, lessonId } = await params;
  const { tab: tabParam } = await searchParams;
  // Validate the URL IDs look like UUIDs before interpolating them into
  // PostgREST filter syntax — a malformed id with a comma/paren would produce
  // a PostgREST 400 (availability issue).
  if (!/^[0-9a-f-]{36}$/i.test(courseId) || !/^[0-9a-f-]{36}$/i.test(lessonId)) {
    notFound();
  }
  const session = await getSession();
  if (session.status !== "ok") return null;
  const { profile } = session;

  // View mode: an admin previewing as student (via the view-mode switch) is
  // still `role === "admin"` but should see the STUDENT experience — the
  // assignment brief + submit form, not the authoring editor.
  const cookieStore = await cookies();
  const viewingAsStudent = cookieStore.get(VIEW_MODE_COOKIE)?.value === "student";
  const showAdminAssignment = profile.role === "admin" && !viewingAsStudent;

  const supabase = await createClient();

  const [{ data: lesson }, { data: course }, { data: courseLessons }, { data: userData }, { data: assignment }, { data: materials }, { data: progress }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("id, title, description, requires_assignment, course_id, video_storage_path")
        .eq("id", lessonId)
        .single(),
      supabase.from("courses").select("id, title").eq("id", courseId).single(),
      supabase
        .from("lessons")
        .select("id, title, order_index, video_storage_path, week")
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
        .select("id, title, kind, format, size_bytes, url, storage_path, sort_order")
        .or(`lesson_id.eq.${lessonId},course_id.eq.${courseId}`)
        .order("sort_order", { ascending: true }),
      supabase
        .from("progress")
        .select("lesson_id, is_completed")
        .eq("user_id", profile.id),
    ]);

  // Guard: the lesson must belong to the requested course. Without this, a
  // student enrolled in course A could open a lesson from course B through a
  // crafted URL (the layout only gates on the URL's courseId).
  if (!lesson || lesson.course_id !== courseId) {
    notFound();
  }

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

  // A pending assignment does NOT block advancing. Grading (approval) is a
  // separate, asynchronous admin workflow that shouldn't stall a student
  // mid-course — they can always move on to the next lesson.

  // Course order = (week, order_index), so Previous/Next cross week boundaries:
  // the last lesson of Week 1 flows into the first lesson of Week 2.
  const playable = (courseLessons ?? [])
    .filter((l) => l.video_storage_path)
    .sort((a, b) => {
      const wa = (a as { week?: number }).week ?? 1;
      const wb = (b as { week?: number }).week ?? 1;
      if (wa !== wb) return wa - wb;
      return a.order_index - b.order_index;
    });
  const hasVideo = Boolean((lesson as { video_storage_path?: string | null } | null)?.video_storage_path);
  const currentIndex = playable.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? playable[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < playable.length - 1 ? playable[currentIndex + 1] : null;

  const continueTarget = nextLesson
    ? `/courses/${courseId}/lessons/${nextLesson.id}`
    : "/dashboard";

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const user = userData?.user;
  const watermarkLabel = `${user?.email ?? "unknown"} · ${user?.id.slice(0, 8) ?? "unknown"} · ${ip}`;

  const completedIds = new Set(
    (progress ?? []).filter((p) => p.is_completed).map((p) => p.lesson_id),
  );
  const lessonComplete = completedIds.has(lessonId);
  const lessonPosition =
    currentIndex >= 0 && playable.length > 0
      ? `Lesson ${currentIndex + 1} of ${playable.length}`
      : null;

  const pickerLessons = (playable ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    orderIndex: l.order_index,
    isCompleted: completedIds.has(l.id),
    hasVideo: Boolean(l.video_storage_path),
  }));

  // One forward action, labelled by where the student is:
  //   not complete          → Mark complete
  //   complete, mid-course  → Next lesson
  //   complete, last        → Finish course
  const lastLessonCompleted = !nextLesson && lessonComplete;
  const forwardLabel = lessonComplete
    ? nextLesson
      ? "Next lesson"
      : "Finish course"
    : "Mark complete";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-32 lg:pb-0">
      {/* Back control — labelled with where it goes + compact lesson picker.
          One navigation surface at a time (no course column). */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-small font-medium text-muted-foreground transition-colors hover:text-foreground active:translate-y-px"
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
        {lessonPosition ? (
          <p className="text-eyebrow text-muted-foreground">{lessonPosition}</p>
        ) : null}
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

      {/* Watch tab — the video when one exists; otherwise the lesson's
          reading (an honest text-lesson surface for authored content). */}
      {tab === "watch" && (
        <>
          {lessonComplete ? (
            <MobileCompletionState
              title="Lesson complete"
              description="You've finished this lesson — move on when you're ready."
            />
          ) : null}
          <div className="rounded-lg border-2 border-foreground bg-card p-0 hard-shadow-sm sm:p-2">
            {hasVideo ? (
              <LazyVideoPlayer lessonId={lessonId} watermarkLabel={watermarkLabel} />
            ) : (
              <div className="p-5">
                <h2 className="text-h2">{lesson?.title ?? "Lesson"}</h2>
                <p className="mt-2 whitespace-pre-line text-small text-muted-foreground">
                  {lesson?.description ?? "This lesson's video is being prepared. The reading is below."}
                </p>
              </div>
            )}
          </div>

          {/* ONE primary action, directly below the video — the thing to do
              next. Everything else collapses below it. */}
          <div className="mt-4">
            <ContinueControl
              lessonId={lessonId}
              courseId={courseId}
              continueTarget={continueTarget}
              label={forwardLabel}
              isFinalLesson={!nextLesson}
              alreadyComplete={lastLessonCompleted}
            />
          </div>
        </>
      )}

      {/* Check what stuck — a quick retention check after the lesson, not a
          test. Every item carries its source (the same pattern as MSE/OSCE).
          Collapsed by default so it never sits between the video and the
          forward action — tap to reveal (progressive disclosure, T87). */}
      {tab === "watch" && (
        <section aria-label="Check what stuck">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-md px-1 py-2">
              <span className="min-w-0">
                <h2 className="text-h2">Check what stuck</h2>
                <p className="mt-0.5 text-small text-muted-foreground">
                  A quick check, not a test — every item carries its source.
                </p>
              </span>
              <ChevronDown
                className="size-5 shrink-0 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="mt-2">
              <QuizCheck items={LESSON_QUIZ_ITEMS} />
            </div>
          </details>
        </section>
      )}

      {/* Materials tab */}
      {tab === "materials" && (
        <section aria-label="Materials" className="space-y-3">
          <h2 className="text-h2 flex items-center gap-2">
            <Paperclip className="size-4 text-link" aria-hidden />
            Materials
          </h2>

          {showAdminAssignment && (
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
                storagePath: m.storage_path,
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
            />
          ) : (
            !showAdminAssignment && (
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

      {/* Persistent Previous / Next, with arrow-key navigation. Desktop
          in-flow; mobile pinned above the bottom nav, thumb-reachable. */}
      <div className="hidden lg:block">
        <LessonNav
          prevHref={prevLesson ? `/courses/${courseId}/lessons/${prevLesson.id}` : null}
          nextHref={continueTarget}
          nextLabel={nextLesson ? "Next" : "Finish course"}
        />
      </div>

      <MobileStickyAction offsetForNav className="lg:hidden" meta={lessonPosition ?? undefined}>
        <LessonNav
          prevHref={prevLesson ? `/courses/${courseId}/lessons/${prevLesson.id}` : null}
          nextHref={continueTarget}
          nextLabel={nextLesson ? "Next" : "Finish course"}
        />
      </MobileStickyAction>

      {/* Assignment tab */}
      {tab === "assignment" && assignment && showAdminAssignment && (
        <section aria-label="Assignment" className="space-y-3">
          <h2 className="text-h2 flex items-center gap-2">
            <FileText className="size-4 text-link" aria-hidden />
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
              accepted_formats: assignment.accepted_formats ?? DEFAULT_ACCEPTED_FORMATS,
              submissionCount: Array.isArray(assignment.submissions)
                ? assignment.submissions.length
                : 0,
            }}
          />
        </section>
      )}

      {/* Assignment tab — student view */}
      {tab === "assignment" && assignment && !showAdminAssignment && (
        <section aria-label="Assignment" className="space-y-3">
          <h2 className="text-h2 flex items-center gap-2">
            <FileText className="size-4 text-link" aria-hidden />
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
        showAdminAssignment ? (
          <section aria-label="Assignment" className="space-y-3">
            <h2 className="text-h2 flex items-center gap-2">
              <FileText className="size-4 text-link" aria-hidden />
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
    </div>
  );
}

function ContinueControl({
  lessonId,
  courseId,
  continueTarget,
  label,
  isFinalLesson,
  alreadyComplete,
}: {
  lessonId: string;
  courseId: string;
  continueTarget: string;
  label: string;
  isFinalLesson: boolean;
  alreadyComplete?: boolean;
}) {
  return (
    <CompleteButton
      lessonId={lessonId}
      courseId={courseId}
      continueTarget={continueTarget}
      label={label}
      isFinalLesson={isFinalLesson}
      alreadyComplete={alreadyComplete}
    />
  );
}
