import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { VIEW_MODE_COOKIE } from "../view-mode-constants";

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

  let coursesQuery = supabase
    .from("courses")
    .select("id, title, is_published")
    .order("title", { ascending: true });
  if (profile.role !== "admin") {
    coursesQuery = coursesQuery.eq("is_published", true);
  }

  const [{ data: courses }, { data: lessons }, { data: progress }] = await Promise.all([
    coursesQuery,
    supabase.from("lessons").select("id, course_id, order_index, video_storage_path"),
    supabase.from("progress").select("lesson_id, is_completed, watched_seconds").eq("user_id", profile.id),
  ]);

  const progressByLessonId = new Map((progress ?? []).map((p) => [p.lesson_id, p]));

  type LessonRow = { id: string; course_id: string; order_index: number; video_storage_path: string | null };
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
    const playable = courseLessons.filter((l) => l.video_storage_path);
    const completedCount = playable.filter((l) => progressByLessonId.get(l.id)?.is_completed).length;
    const startedCount = playable.filter((l) => {
      const p = progressByLessonId.get(l.id);
      return p && (p.is_completed || (p.watched_seconds ?? 0) > 0);
    }).length;

    return {
      course,
      totalLessons: playable.length,
      completedCount,
      inProgress: startedCount > 0 && completedCount < playable.length,
    };
  });

  // "Continue learning" targets the first course with some progress but not
  // finished, so returning students land on their actual next step rather
  // than a flat list they have to scan.
  const continueCourse = courseSummaries.find((c) => c.inProgress);

  return (
    <div className="mx-auto max-w-2xl">
      {viewingAsStudent && (
        <p className="mb-4 rounded-lg bg-status-info-bg px-3 py-2 text-sm text-status-info-fg">
          Previewing as a student. Drafts are shown here only for you — a real student would not see them.
        </p>
      )}

      <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        My Courses
      </h1>

      {continueCourse && (
        <Link
          href={`/courses/${continueCourse.course.id}`}
          className="mt-5 block rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary sm:p-6"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Continue learning
          </p>
          <h2 className="mt-1 font-serif text-lg font-semibold text-foreground sm:text-xl">
            {continueCourse.course.title}
          </h2>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${Math.round((continueCourse.completedCount / continueCourse.totalLessons) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-1.5 font-mono text-xs text-muted-foreground">
            {continueCourse.completedCount}/{continueCourse.totalLessons} lessons complete
          </p>
        </Link>
      )}

      <div className="mt-6 space-y-3">
        {courseSummaries.length === 0 && (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            No courses have been published yet.
          </p>
        )}
        {courseSummaries.map(({ course, totalLessons, completedCount }) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary sm:p-6"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">{course.title}</h3>
              {!course.is_published && (
                <span className="rounded-full bg-status-pending-bg px-2 py-0.5 text-xs text-status-pending-fg">
                  Draft
                </span>
              )}
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: totalLessons ? `${Math.round((completedCount / totalLessons) * 100)}%` : "0%",
                }}
              />
            </div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {completedCount}/{totalLessons} lessons complete
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
