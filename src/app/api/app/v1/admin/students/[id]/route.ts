import { loadStudentDetail } from "@/lib/analytics/activity";
import { realRoster, studentRow } from "@/lib/app-api/admin";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { AdminStudentProfile } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/students/:id: the roster row plus 30 days of activity (the website's loadStudentDetail). */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ params }): Promise<AdminStudentProfile> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const [rows, detail] = await Promise.all([realRoster(), loadStudentDetail(params.id)]);
  const row = rows.find((r) => r.id === params.id);
  if (!row && !detail) throw new ApiFail("not_found");
  return { row: row ? studentRow(row) : null, detail: (detail as unknown as Record<string, unknown>) ?? null };
});
