import { serveMaterial } from "@/lib/media/material-serve";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/**
 * GET /api/app/v1/materials/:materialId/file: the file bytes (Range works),
 * through the same proxy and checks as the website's /api/media/materials/:id.
 */
export const GET = appRoute<{ materialId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params, req, ip, limitFast }) => {
  if (!uuid.safeParse(params.materialId).success) throw new ApiFail("not_found");
  limitFast(`material:${user.profile.id}`, 300);
  limitFast(`material:ip:${ip}`, 600);
  const served = await serveMaterial(user.profile, params.materialId, req.headers.get("range"));
  if (!served.ok) throw new ApiFail(served.status === 404 ? "not_found" : "forbidden", served.error);
  return new Response(served.file.stream, { status: served.file.status, headers: served.file.headers });
});
