import { notFound } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import CourseOverview, { loadCourseOverview } from "@/components/course/course-overview";
import { uiV2 } from "@/lib/ui/v2-server";
import { CourseV2 } from "@/components/learn-v2/course";
import { RefreshOnSave } from "@/components/save/refresh-on-save";
import { leaveWithoutSession } from "@/lib/auth/session-redirect";

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
  if (session.status !== "ok") return leaveWithoutSession(session);

  // Enrollment / published / existence gating lives in the course layout, which
  // 404s before this page renders. The shared component owns fetch + render so
  // the dashboard's single-course view and this direct URL stay identical.
  // New design (ui_v2): the same model, drawn as an editorial list by week.
  if (await uiV2()) {
    const model = await loadCourseOverview(courseId, session.profile);
    if (!model) return null;
    return (
      <>
        <RefreshOnSave kinds={["complete", "progress"]} />
        <CourseV2 model={model} />
      </>
    );
  }

  return (
    <>
      <RefreshOnSave kinds={["complete", "progress"]} />
      <CourseOverview courseId={courseId} profile={session.profile} />
    </>
  );
}
