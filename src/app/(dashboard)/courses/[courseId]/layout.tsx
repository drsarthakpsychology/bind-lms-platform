import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { CourseSidebar } from "./course-sidebar";

export default async function CourseLayout({
  params,
  children,
}: {
  params: Promise<{ courseId: string }>;
  children: React.ReactNode;
}) {
  const { courseId } = await params;
  const session = await getSession();
  if (session.status !== "ok") return null;
  const { profile } = session;

  const supabase = await createClient();

  const [{ data: course }, { data: lessons }, { data: progress }] = await Promise.all([
    supabase.from("courses").select("id, title, is_published").eq("id", courseId).single(),
    supabase
      .from("lessons")
      .select("id, title, order_index, video_storage_path")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true }),
    supabase
      .from("progress")
      .select("lesson_id, is_completed")
      .eq("user_id", profile.id),
  ]);

  if (!course || (!course.is_published && profile.role !== "admin")) {
    notFound();
  }

  const completedIds = new Set(
    (progress ?? []).filter((p) => p.is_completed).map((p) => p.lesson_id),
  );

  const sidebarLessons = (lessons ?? []).map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    order_index: lesson.order_index,
    is_completed: completedIds.has(lesson.id),
    has_video: Boolean(lesson.video_storage_path),
  }));

  const progressPercent = sidebarLessons.length
    ? Math.round((sidebarLessons.filter((l) => l.is_completed).length / sidebarLessons.length) * 100)
    : 0;

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col lg:flex-row">
      <CourseSidebar
        courseId={courseId}
        courseTitle={course.title}
        lessons={sidebarLessons}
        progressPercent={progressPercent}
      />
      <div className="flex-1 overflow-x-hidden">
        <div className="border-b border-border px-4 py-2 lg:hidden">
          <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground">
            ← My Courses
          </Link>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
