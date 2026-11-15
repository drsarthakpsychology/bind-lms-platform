import { loadCourseOverview } from "@/components/course/course-overview";
import { loadMyCourses } from "@/lib/course/mine";
import { courseSummary } from "@/lib/app-api/views/courses";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { CourseList } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/courses: the courses this student can open (the website's Lectures page). */
export const GET = appRoute({ auth: "bearer", gates: GATES.lectures }, async ({ user }): Promise<CourseList> => {
  const mine = await loadMyCourses(user.profile, user.profile.scope);
  const models = await Promise.all(mine.map((c) => loadCourseOverview(c.id, user.profile)));
  return { courses: models.filter((m) => m !== null).map(courseSummary) };
});
