import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, ChevronDown, ChevronLeft, FileText, Paperclip, Play } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { loadStudentAccess } from "@/lib/cohorts/access";
import { canWatch, filterLessons } from "@/lib/cohorts/rules";
import { DEFAULT_ACCEPTED_FORMATS } from "@/lib/media/registry";
import { VIEW_MODE_COOKIE } from "@/app/(dashboard)/view-mode-constants";
// Lazy wrapper — the player pulls in hls.js (~500KB min / ~150KB gzip). The
// dynamic import lives in a Client Component (ssr:false is not supported in
// Server Components), which splits hls.js into a deferred chunk loaded only
// when the "Watch" tab mounts the player.
import { LazyVideoPlayer } from "./lazy-video-player";
import { CompleteButton } from "./complete-button";
import { LazyAssignmentEditor as AssignmentEditor } from "@/components/course/admin-tools-lazy";
import { SubmissionForm } from "./submission-form";
import { LessonTabs } from "./lesson-tabs";
import { LessonPicker } from "./lesson-picker";
import { LessonNav } from "./lesson-nav";
import { MaterialsList } from "./materials-list";
import { LazyMaterialUploader as MaterialUploader } from "@/components/course/admin-tools-lazy";

import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/design-system/empty-state";
import { QuizCheck } from "@/components/practice/quiz-check";
import { QUIZ_BANK } from "@/lib/quiz/quiz-bank";
import { MobileStickyAction } from "@/components/mobile/mobile-sticky-action";

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

  const [{ data: lesson }, { data: course }, { data: courseLessonsAll }, { data: userData }, { data: assignment }, { data: materials }, { data: progress }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("id, title, description, requires_assignment, course_id, video_storage_path, status")
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

  // Per-lesson go-live control: a student who knows the direct URL must not
  // get content for a `hidden` (doesn't exist for them) or `live` (locked,
  // "yet to be live") lesson. Admins can still preview either from the
  // builder, whose Watch link resolves here.
  if (profile.role !== "admin") {
    if (lesson.status === "hidden") {
      notFound();
    }
    // Cohorts: a lecture not shared with this person's cohort (or given to
    // them) does not exist for them.
    const access = await loadStudentAccess(profile.id);
    if (!canWatch(access, lessonId, true)) {
      notFound();
    }
    if (lesson.status === "live") {
      redirect(`/courses/${courseId}`);
    }
  }

  // The picker and Next/Previous only list lectures this person can watch.
  const courseLessons = filterLessons(await loadStudentAccess(profile.id), courseLessonsAll ?? [], true, profile.role === "admin");

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

  const nextUp = pickerLessons;

  return (
    <div className="pb-32 lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-8 lg:pb-0 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0 space-y-5">
      {/* Back + (phones) the lesson list. The sidebar steps aside on this page
          so the video gets the width — like a video app's watch page. */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex min-h-10 min-w-0 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-4 text-sm font-bold transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-xs active:translate-y-px active:shadow-none"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{course?.title ?? "Course"}</span>
        </Link>
        {pickerLessons.length > 1 && (
          <div className="lg:hidden">
            <LessonPicker
              courseId={courseId}
              courseTitle={course?.title ?? "Course"}
              lessons={pickerLessons}
              currentId={lessonId}
            />
          </div>
        )}
      </div>

      {/* Watch tab — the video first (where every video app puts it); a
          reading lesson shows its text in the same frame. */}
      {tab === "watch" && (
        <div className="overflow-hidden rounded-2xl border-2 border-foreground bg-card hard-shadow-md">
          {hasVideo ? (
            <LazyVideoPlayer
              lessonId={lessonId}
              watermarkLabel={watermarkLabel}
              nextHref={nextLesson ? `/courses/${courseId}/lessons/${nextLesson.id}` : null}
              nextTitle={nextLesson?.title ?? null}
            />
          ) : (
            <div className="p-5 sm:p-7">
              <p className="text-eyebrow text-link">Reading</p>
              <h2 className="mt-1 text-h2">{lesson?.title ?? "Lesson"}</h2>
              <p className="mt-3 whitespace-pre-line break-words text-body text-foreground/85">
                {lesson?.description ?? "This lesson's video is being prepared. The reading is below."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Title + the one primary action */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          {lessonPosition ? <p className="text-eyebrow text-link">{lessonPosition}</p> : null}
          <h1 className="text-h1 break-words">{lesson?.title ?? "Lesson"}</h1>
        </div>
        {tab === "watch" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ContinueControl
              lessonId={lessonId}
              courseId={courseId}
              continueTarget={continueTarget}
              label={forwardLabel}
              isFinalLesson={!nextLesson}
              alreadyComplete={lastLessonCompleted}
            />
            {lessonComplete ? (
              <span className="inline-flex h-9 w-fit items-center gap-1.5 rounded-full border-2 border-foreground bg-primary px-3 text-sm font-bold text-primary-foreground">
                <CheckCircle2 className="size-4" aria-hidden /> Watched
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Watch / Materials / Assignment. Hidden on a plain video lesson. */}
      <Suspense fallback={null}>
        <LessonTabs
          courseId={courseId}
          lessonId={lessonId}
          tab={tab}
          hasMaterials={hasMaterials}
          hasAssignment={hasAssignment}
        />
      </Suspense>

      {/* About this lecture — the description box under the video. */}
      {tab === "watch" && hasVideo && lesson?.description ? (
        <section aria-label="About this lecture" className="rounded-2xl border-2 border-foreground/15 bg-card p-4 sm:p-5">
          <h2 className="text-eyebrow text-muted-foreground">About this lecture</h2>
          <p className="mt-2 whitespace-pre-line break-words text-small text-foreground/85">{lesson.description}</p>
        </section>
      ) : null}

      {/* Check what stuck — a quick retention check, folded so it never sits
          between the video and the next step. */}
      {tab === "watch" && (
        <section aria-label="Check what stuck">
          <details className="group rounded-2xl border-2 border-foreground bg-card">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-accent [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">
                <span className="block text-h3">Check what stuck</span>
                <span className="mt-0.5 block text-small text-muted-foreground">
                  Four quick questions. Not a test.
                </span>
              </span>
              <ChevronDown
                className="size-5 shrink-0 transition-transform duration-fast ease-snappy group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="border-t-2 border-foreground/10 p-4">
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
                  <div className="mb-4 whitespace-pre-wrap break-words rounded-md border-2 border-border bg-muted/50 p-4 text-small leading-relaxed text-foreground">
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

      {/* Up next — the course playlist beside the video (laptops and up). */}
      {nextUp.length > 0 ? (
        <aside aria-label="Lectures in this course" className="hidden lg:block">
          <div className="sticky top-20 flex max-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-2xl border-2 border-foreground bg-card hard-shadow-sm">
            <div className="border-b-2 border-foreground bg-brand px-4 py-3 text-brand-foreground">
              <p className="truncate text-sm font-bold">{course?.title ?? "Course"}</p>
              <p className="text-caption opacity-90">
                {completedIds.size > 0 ? `${pickerLessons.filter((l) => l.isCompleted).length} of ${pickerLessons.length} watched` : `${pickerLessons.length} lectures`}
              </p>
            </div>
            <ol className="flex-1 space-y-1 overflow-y-auto overscroll-contain p-2">
              {nextUp.map((l, i) => {
                const current = l.id === lessonId;
                return (
                  <li key={l.id}>
                    <Link
                      href={`/courses/${courseId}/lessons/${l.id}`}
                      aria-current={current ? "page" : undefined}
                      className={
                        "group/up flex items-center gap-3 rounded-xl border-2 p-2 transition-[background-color,border-color] duration-fast ease-snappy " +
                        (current
                          ? "border-foreground bg-primary text-primary-foreground"
                          : "border-transparent hover:border-foreground hover:bg-accent")
                      }
                    >
                      <span
                        aria-hidden
                        className={
                          "flex aspect-video w-20 shrink-0 items-center justify-center rounded-lg border-2 border-foreground font-pix text-sm " +
                          (current ? "bg-[#111111] text-primary" : "bg-[#111111] text-primary")
                        }
                      >
                        {current ? <Play className="size-4 fill-current" /> : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm font-bold leading-snug">{l.title}</span>
                        <span className="mt-0.5 flex items-center gap-1 text-caption font-semibold opacity-80">
                          {current ? "Playing now" : l.isCompleted ? (
                            <>
                              <CheckCircle2 className="size-3.5" aria-hidden /> Watched
                            </>
                          ) : `Lecture ${i + 1}`}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      ) : null}
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
