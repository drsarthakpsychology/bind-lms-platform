import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowRight, BookOpen, CircleCheck, GraduationCap, Play, Sparkles } from "lucide-react";

import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { VIEW_MODE_COOKIE } from "../view-mode-constants";

import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import CourseOverview from "@/components/course/course-overview";
import { PracticeToolsSection } from "./practice-tools-section";
import { cardVariants } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type LessonRow = {
  id: string;
  course_id: string;
  order_index: number;
  video_storage_path: string | null;
  description: string | null;
  title: string | null;
  status: string | null;
};

export default async function DashboardPage() {
  const session = await getSession();

  if (session.status !== "ok") {
    return null;
  }

  const { profile } = session;

  const cookieStore = await cookies();
  const viewingAsStudent = cookieStore.get(VIEW_MODE_COOKIE)?.value === "student";

  if (profile.role === "admin" && !viewingAsStudent) {
    redirect("/admin");
  }

  // The go-live roster is lectures_only. An admin previewing the student side
  // must see exactly what those students see. A roster student has no
  // enrollment rows, so "their course" is every published course — the single
  // canonical structured view below, never a separate flat lecture list.
  const effectiveScope =
    profile.role === "admin" && viewingAsStudent ? "lectures_only" : profile.scope;

  const supabase = await createClient();

  // Truthful student view: a student sees only published courses they're
  // enrolled in. A lectures_only roster student sees every published course
  // (no enrollment rows, by design). When an admin previews as a student the
  // same rule applies.
  const [{ data: courses }, { data: enrollments }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, title, is_published")
      .eq("is_published", true)
      .order("title", { ascending: true }),
    supabase.from("course_enrollments").select("course_id").eq("user_id", profile.id),
  ]);

  const enrolledIds = new Set((enrollments ?? []).map((e) => e.course_id));
  const myCourses =
    effectiveScope === "lectures_only"
      ? (courses ?? [])
      : (courses ?? []).filter((c) => enrolledIds.has(c.id));

  // Exactly one course: the dashboard IS that course's week/lesson list — the
  // same header, "0 of N lessons complete" line and highlighted Continue row as
  // /courses/[courseId], with no "Your courses" card to click through. Roster
  // students also get the practice strip up top so their home isn't lecture-only.
  if (myCourses.length === 1) {
    return (
      <div className="space-y-8">
        {viewingAsStudent && profile.role === "admin" && (
          <Reveal>
            <Alert variant="warning" className="border-foreground hard-shadow-sm">
              <Sparkles className="size-4" aria-hidden />
              <AlertTitle>Previewing as a student</AlertTitle>
              <AlertDescription>
                This is the student experience — only published courses are shown.
              </AlertDescription>
            </Alert>
          </Reveal>
        )}
        {effectiveScope === "lectures_only" && <PracticeToolsSection />}
        <CourseOverview courseId={myCourses[0].id} profile={profile} />
      </div>
    );
  }

  const [{ data: lessons }, { data: progress }] = await Promise.all([
    supabase.from("lessons").select("id, course_id, order_index, video_storage_path, description, title, status"),
    supabase.from("progress").select("lesson_id, is_completed, watched_seconds").eq("user_id", profile.id),
  ]);

  const progressByLessonId = new Map((progress ?? []).map((p) => [p.lesson_id, p]));

  const lessonsByCourse = new Map<string, LessonRow[]>();
  for (const lesson of (lessons ?? []) as LessonRow[]) {
    const list = lessonsByCourse.get(lesson.course_id) ?? [];
    list.push(lesson);
    lessonsByCourse.set(lesson.course_id, list);
  }

  const courseSummaries = myCourses.map((course) => {
    const courseLessons = (lessonsByCourse.get(course.id) ?? [])
      .slice()
      .sort((a, b) => a.order_index - b.order_index);
    // A lesson is playable with a video OR a reading (authored text lessons),
    // but only once it's been unlocked for the student.
    const playable = courseLessons.filter(
      (l) => l.status === "unlocked" && (l.video_storage_path || l.description),
    );
    const completedCount = playable.filter((l) => progressByLessonId.get(l.id)?.is_completed).length;
    const startedCount = playable.filter((l) => {
      const p = progressByLessonId.get(l.id);
      return p && (p.is_completed || (p.watched_seconds ?? 0) > 0);
    }).length;

    const inProgress = startedCount > 0 && completedCount < playable.length;
    const status: "in-progress" | "not-started" | "completed" =
      playable.length > 0 && completedCount === playable.length
        ? "completed"
        : inProgress
          ? "in-progress"
          : "not-started";

    return {
      course,
      totalLessons: playable.length,
      completedCount,
      inProgress,
      status,
    };
  });

  // Sort the full list top-to-bottom: in-progress first, then not-started, then
  // completed — never a flat, unscannable grid.
  const statusRank = { "in-progress": 0, "not-started": 1, "completed": 2 } as const;

  const orderedSummaries = courseSummaries
    .slice()
    .sort((a, b) => {
      const rank = statusRank[a.status] - statusRank[b.status];
      if (rank !== 0) return rank;
      return a.course.title.localeCompare(b.course.title);
    });

  // "Continue learning" targets the first course with some progress but not
  // finished, so returning students land on their actual next step rather
  // than a flat list they have to scan.
  const continueCourse = courseSummaries.find((c) => c.status === "in-progress");
  const firstNotStartedCourse = orderedSummaries.find((c) => c.status === "not-started");

  // The precise next lesson for the in-progress course — "Resume" should land on
  // the actual next meaningful action (the first incomplete playable lesson),
  // not drop the student on the course map to hunt for "Start here".
  const resumeLesson = continueCourse
    ? (lessonsByCourse.get(continueCourse.course.id) ?? [])
        .slice()
        .sort((a, b) => a.order_index - b.order_index)
        .find(
          (l) =>
            l.status === "unlocked" &&
            (l.video_storage_path || l.description) &&
            !progressByLessonId.get(l.id)?.is_completed,
        )
    : undefined;
  const resumeHref = continueCourse
    ? resumeLesson
      ? `/courses/${continueCourse.course.id}/lessons/${resumeLesson.id}`
      : `/courses/${continueCourse.course.id}`
    : undefined;

  const completedCourses = courseSummaries.filter(
    (c) => c.totalLessons > 0 && c.completedCount === c.totalLessons
  );
  const startedSomething = completedCourses.length > 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Courses"
        description="A clear path: resume where you left off, then browse your courses."
        badge={
          completedCourses.length > 0 ? (
            <Badge variant="graded">
              <CircleCheck className="size-3" aria-hidden />
              {completedCourses.length} completed
            </Badge>
          ) : undefined
        }
      />

      <Reveal delay={0.05}>
        {viewingAsStudent && profile.role === "admin" && (
          <Alert variant="warning" className="border-foreground hard-shadow-sm">
            <Sparkles className="size-4" aria-hidden />
            <AlertTitle>Previewing as a student</AlertTitle>
            <AlertDescription>
              This is the student experience — only courses you&apos;re enrolled in are shown.
            </AlertDescription>
          </Alert>
        )}
      </Reveal>

      {/* The single next step: resume, or start for the first time. */}
      <Reveal delay={0.1}>
        {continueCourse ? (
          <Link
            href={resumeHref ?? `/courses/${continueCourse.course.id}`}
            className={cn(cardVariants({ variant: "interactive" }), "p-6")}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-primary text-primary-foreground"
                >
                  <Play className="size-5 fill-current" />
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-eyebrow text-muted-foreground">Continue learning</p>
                  <h2 className="text-h2">{continueCourse.course.title}</h2>
                  <p className="text-caption text-muted-foreground">
                    {continueCourse.completedCount} of {continueCourse.totalLessons} lessons complete
                  </p>
                  {resumeLesson?.title ? (
                    <p className="truncate text-caption font-medium text-link">
                      Next: {resumeLesson.title}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-full sm:w-56">
                  <Progress
                    value={
                      continueCourse.totalLessons
                        ? Math.round((continueCourse.completedCount / continueCourse.totalLessons) * 100)
                        : 0
                    }
                    aria-label="Course progress"
                  />
                  <p className="text-numeric mt-1.5 text-right text-caption text-muted-foreground">
                    {continueCourse.totalLessons
                      ? Math.round((continueCourse.completedCount / continueCourse.totalLessons) * 100)
                      : 0}
                    %
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-small font-medium text-link">
                  Resume
                  <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </div>
            </div>
          </Link>
        ) : firstNotStartedCourse ? (
          <Link
            href={`/courses/${firstNotStartedCourse.course.id}`}
            className={cn(cardVariants({ variant: "accent" }), "p-6")}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-card text-foreground"
                >
                  <GraduationCap className="size-5" />
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-eyebrow">
                    {startedSomething ? "Start your next course" : "Start your first course"}
                  </p>
                  <h2 className="text-h2">{firstNotStartedCourse.course.title}</h2>
                  <p className="text-caption opacity-80">
                    {firstNotStartedCourse.totalLessons > 0
                      ? `${firstNotStartedCourse.totalLessons} lessons · begin at lesson one`
                      : "Begin at lesson one"}
                  </p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 text-small font-semibold">
                Start
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </div>
          </Link>
        ) : null}
      </Reveal>

      {/* The full course list, in-progress first, completed last. */}
      <section aria-label="Your courses" className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-h2">Your courses</h2>
          <p className="text-caption text-muted-foreground">
            In-progress first, then not started, then completed.
          </p>
        </div>

        {courseSummaries.length === 0 && (
          <Reveal>
            <EmptyState
              icon={<GraduationCap className="size-6" aria-hidden />}
              title="No courses yet"
              description="Your courses will appear here when they're available. Check back soon."
            />
          </Reveal>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderedSummaries.map(({ course, totalLessons, completedCount, status }, i) => {
            const isComplete = status === "completed";
            return (
              <Reveal key={course.id} delay={0.15 + Math.min(i, 3) * 0.05} className="h-full">
                <Link
                  href={`/courses/${course.id}`}
                  className={cn(
                    cardVariants({ variant: "interactive" }),
                    "h-full p-5",
                    isComplete && "opacity-70"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-md border-2",
                        isComplete
                          ? "border-foreground bg-primary text-primary-foreground"
                          : "border-border bg-accent text-foreground"
                      )}
                    >
                      {isComplete ? <CircleCheck className="size-5" /> : <BookOpen className="size-5" />}
                    </span>
                    <Badge
                      variant={
                        status === "in-progress"
                          ? "published"
                          : status === "not-started"
                            ? "draft"
                            : "graded"
                      }
                    >
                      {status === "completed" ? <CircleCheck className="size-3" aria-hidden /> : null}
                      {status === "in-progress"
                        ? "In progress"
                        : status === "not-started"
                          ? "Not started"
                          : "Completed"}
                    </Badge>
                  </div>

                  <div className="min-w-0 flex-1 py-3">
                    <h3 className="text-h3 leading-snug">{course.title}</h3>
                  </div>

                  <div className="pt-3">
                    <span className="text-numeric text-caption text-muted-foreground">
                      {completedCount} of {totalLessons} lessons
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 pt-2 text-small font-medium text-link">
                    {status === "completed"
                      ? "Review course"
                      : status === "in-progress"
                        ? "Continue"
                        : "Start course"}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
