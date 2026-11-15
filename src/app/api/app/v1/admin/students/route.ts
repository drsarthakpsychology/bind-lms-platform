import { loadRoster } from "@/lib/people/roster-data";
import { filterStudents, realRoster, studentRow } from "@/lib/app-api/admin";
import { appRoute } from "@/lib/app-api/route";
import { pageParams } from "@/lib/app-api/schemas";
import type { AdminStudentList } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/students?search=(or q=)&cohort=&flag=: the Students table (the website's loadRoster), paged. */
export const GET = appRoute({ auth: "admin" }, async ({ query }): Promise<AdminStudentList> => {
  const [rows, roster] = await Promise.all([realRoster(), loadRoster()]);
  const all = filterStudents(rows.map(studentRow), { search: query.get("search") ?? query.get("q"), cohort: query.get("cohort"), flag: query.get("flag") });
  const { limit, cursor } = pageParams(query, 50, 200);
  const start = cursor && /^\d{1,6}$/.test(cursor) ? Number(cursor) : 0;
  return { items: all.slice(start, start + limit), nextCursor: start + limit < all.length ? String(start + limit) : null, total: all.length, cohorts: roster.cohorts.map((c) => ({ id: c.id, name: c.name })) };
});
