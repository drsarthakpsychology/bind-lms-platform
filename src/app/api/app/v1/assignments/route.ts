import { loadCourseOverview } from "@/components/course/course-overview";
import { loadMyCourses } from "@/lib/course/mine";
import { assignmentRows } from "@/lib/app-api/assignments";
import { appRoute, GATES } from "@/lib/app-api/route";
import { pageParams } from "@/lib/app-api/schemas";
import type { AssignmentRow, Page } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/assignments: every published assignment the student can see, by week (paged). */
export const GET = appRoute({ auth: "bearer", gates: GATES.lectures }, async ({ user, query }): Promise<Page<AssignmentRow>> => {
  const mine = await loadMyCourses(user.profile, user.profile.scope);
  const models = (await Promise.all(mine.map((c) => loadCourseOverview(c.id, user.profile)))).filter((m) => m !== null);
  const rows = await assignmentRows(models, user.profile.id);
  const { limit, cursor } = pageParams(query);
  const start = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
  const items = rows.slice(start, start + limit);
  return { items, nextCursor: start + limit < rows.length ? String(start + limit) : null };
});
