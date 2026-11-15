import { checkMaterial } from "@/lib/media/material-serve";
import { materialView } from "@/lib/app-api/views/courses";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { Material } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/materials/:materialId: what it is, and where to fetch the file. */
export const GET = appRoute<{ materialId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params }): Promise<Material> => {
  if (!uuid.safeParse(params.materialId).success) throw new ApiFail("not_found");
  const r = await checkMaterial(user.profile, params.materialId);
  if (!r.ok) throw new ApiFail(r.status === 404 ? "not_found" : "forbidden", r.reason);
  return materialView(r.material);
});
