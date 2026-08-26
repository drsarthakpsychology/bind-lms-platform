import { notFound } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import CourseOverview from "@/components/course/course-overview";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  // Malformed id → notFound before any DB hit (the layout repeats this guard at
  // the entry point; keeping it here is cheap defense-in-depth).
  if (!/^[0-9a-f-]{36}$/i.test(courseId)) {
    notFound();
  }

  const session = await getSession();
  if (session.status !== "ok") return null;

  // Enrollment / published / existence gating lives in the course layout, which
  // 404s before this page renders. The shared component owns fetch + render so
  // the dashboard's single-course view and this direct URL stay identical.
  return <CourseOverview courseId={courseId} profile={session.profile} backHref="/dashboard" />;
}
