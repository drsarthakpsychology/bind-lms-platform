import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/**
 * Course layout — full width, no persistent course column (Round 5 drill-down).
 * The course and lesson pages own their back header + lesson picker, so the
 * content is the whole width of the screen. One navigation surface at a time.
 */
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

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, is_published")
    .eq("id", courseId)
    .single();

  // A student must be enrolled AND the course published to see any of it.
  // Admins (and the admin previewing as student) bypass the enrollment gate.
  const { data: enrollment } =
    profile.role === "admin"
      ? { data: true }
      : await supabase
          .from("course_enrollments")
          .select("course_id")
          .eq("user_id", profile.id)
          .eq("course_id", courseId)
          .maybeSingle();

  if (
    !course ||
    (!course.is_published && profile.role !== "admin") ||
    (profile.role !== "admin" && !enrollment)
  ) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="w-full overflow-x-hidden">{children}</div>
    </div>
  );
}
