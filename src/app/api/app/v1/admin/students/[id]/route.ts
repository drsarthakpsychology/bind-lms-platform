import { isSuperAdmin } from "@/lib/auth/guards";
import { loadStudentDetail } from "@/lib/analytics/activity";
import { realRoster, studentRow } from "@/lib/app-api/admin";
import { studentDeviceState } from "@/lib/app-api/devices";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { AdminStudent } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/students/:id: the roster row, the app phone, and 30 days of activity (the website's loadStudentDetail). */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ user, params }): Promise<AdminStudent> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const [rows, detail, phone] = await Promise.all([realRoster(), loadStudentDetail(params.id), studentDeviceState(params.id, "student")]);
  const row = rows.find((r) => r.id === params.id);
  if (!row) throw new ApiFail("not_found");
  const d = detail as { recent?: { at: string; what: string }[] } | null;
  const base = studentRow(row);
  return {
    ...base,
    row: base,
    phone: phone.current ? { name: phone.current.name, platform: phone.current.platform, changesUsed: phone.changesUsed, limit: phone.limit ?? 0, nextChangeAt: phone.nextChangeAt } : null,
    lectures: { done: row.lecturesDone, total: row.lecturesAvailable },
    detail: (detail as unknown as Record<string, unknown>) ?? null,
    recent: (d?.recent ?? []).map((x) => ({ at: x.at, what: x.what })),
    canWrite: isSuperAdmin(user.profile),
  };
});
