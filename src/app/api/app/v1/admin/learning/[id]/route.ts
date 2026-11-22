import { adminLearner, type AdminLearner } from "@/lib/app-api/admin-r2b";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/learning/:id: one student's learning record, module by module. Read only. */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ params }): Promise<AdminLearner> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const r = await adminLearner(params.id);
  if (!r) throw new ApiFail("not_found");
  return r;
});
