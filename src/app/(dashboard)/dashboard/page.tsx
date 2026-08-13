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
import { DashboardPracticeSection } from "@/components/practice/dashboard-practice-section";
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

  const supabase = await createClient();

  // Truthful student view: when previewing as a student, show only published
  // courses — the same visibility a real student has. Drafts stay visible in
  // the admin area (course page lets you watch draft videos).
  let coursesQuery = supabase
    .from("courses")
    .select("id, title, is_published")
    .order("title", { ascending: true });
  coursesQuery = coursesQuery.eq("is_published", true);

  const [{ data: courses }, { data: lessons }, { data: progress }] = await Promise.all([
    coursesQuery,
    supabase.from("lessons").select("id, course_id, order_index, video_storage_path, description"),
    supabase.from("progress").select("lesson_id, is_completed, watched_seconds").eq("user_id", profile.id),
  ]);

  const progressByLessonId = new Map((progress ?? []).map((p) => [p.lesson_id, p]));

  const lessonsByCourse = new Map<string, LessonRow[]>();
  for (const lesson of (lessons ?? []) as LessonRow[]) {
    const list = lessonsByCourse.get(lesson.course_id) ?? [];
    list.push(lesson);
    lessonsByCourse.set(lesson.course_id, list);
  }

  const courseSummaries = (courses ?? []).map((course) => {
    const courseLessons = (lessonsByCourse.get(course.id) ?? [])
      .slice()
      .sort((a, b) => a.order_index - b.order_index);
    // A lesson is playable with a video OR a reading (authored text lessons).
    const playable = courseLessons.filter((l) => l.video_storage_path || l.description);
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

  // Order of operations for the page: (1) next step, (2) practice, (3) courses.
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

  const completedCourses = courseSummaries.filter(
    (c) => c.totalLessons > 0 && c.completedCount === c.totalLessons
  );
  const startedSomething = completedCourses.length > 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Courses"
        description="A clear path: resume where you left off, practise daily, then browse your courses."
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
        {viewingAsStudent && (
          <Alert variant="warning" className="border-foreground hard-shadow-sm">
            <Sparkles className="size-4" aria-hidden />
            <AlertTitle>Previewing as a student</AlertTitle>
            <AlertDescription>
              This is the student experience — only published courses are shown.
            </AlertDescription>
          </Alert>
        )}
      </Reveal>

      {/* Step 1 — the single next step: resume, or start for the first time. */}
      <Reveal delay={0.1}>
        {continueCourse ? (
          <Link
            href={`/courses/${continueCourse.course.id}`}
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
                  <p className="text-eyebrow text-muted-foreground">Step 1 · Continue learning</p>
                  <h2 className="text-h2">{continueCourse.course.title}</h2>
                  <p className="text-caption text-muted-foreground">
                    {continueCourse.completedCount} of {continueCourse.totalLessons} lessons complete
                  </p>
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
                    Step 1 · {startedSomething ? "Start your next course" : "Start your first course"}
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

      {/* Step 2 — the daily habit. */}
      <Reveal delay={0.15}>
        <div className="space-y-3">
          <p className="text-eyebrow text-muted-foreground">Step 2 · Daily habit</p>
          <DashboardPracticeSection />
        </div>
      </Reveal>

      {/* Step 3 — the full list, in-progress first, completed last. */}
      <section aria-label="Your courses" className="space-y-4">
        <div className="space-y-1">
          <p className="text-eyebrow text-muted-foreground">Step 3 · The full list</p>
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
              description="Courses published to your account will appear here. Check back soon."
            />
          </Reveal>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderedSummaries.map(({ course, totalLessons, completedCount, status }, i) => {
            const percent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
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

                  <div className="space-y-2">
                    <Progress value={percent} aria-label={`${course.title} progress`} />
                    <div className="flex items-center justify-between">
                      <span className="text-numeric text-caption text-muted-foreground">
                        {completedCount} of {totalLessons} lessons · {percent}%
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 pt-3 text-small font-medium text-link">
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
