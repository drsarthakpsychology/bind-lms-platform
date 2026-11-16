import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { idOrNull, isUuid } from "@/lib/clinic/schemas";
import { studentDetail } from "@/lib/clinic/admin";
import type { ClinicStudentDetail } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/students/:id?cohort=: one student's attendance history, leave and OPD days. */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ params, query }): Promise<ClinicStudentDetail> => {
  if (!isUuid(params.id)) throw new ApiFail("not_found");
  return studentDetail(clinicDb(), params.id, idOrNull(query.get("cohort")), Date.now());
});
