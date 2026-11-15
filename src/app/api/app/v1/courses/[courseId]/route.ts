import { loadCourseOverview } from "@/components/course/course-overview";
import { loadMyCourses } from "@/lib/course/mine";
import { courseDetail } from "@/lib/app-api/views/courses";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { CourseDetail } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/courses/:courseId: weeks, lectures, materials, assignments (the website's course page). */
export const GET = appRoute<{ courseId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params }): Promise<CourseDetail> => {
  if (!uuid.safeParse(params.courseId).success) throw new ApiFail("not_found");
  // The same course rule as the website's course layout: published, and
  // enrolled / lectures-only / shared with one of the student's cohorts.
  const mine = await loadMyCourses(user.profile, user.profile.scope);
  if (!mine.some((c) => c.id === params.courseId)) throw new ApiFail("not_found");
  const model = await loadCourseOverview(params.courseId, user.profile);
  if (!model) throw new ApiFail("not_found");
  return courseDetail(model);
});
