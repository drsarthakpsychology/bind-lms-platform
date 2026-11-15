import { z } from "zod";
import { adminHideDoubt } from "@/app/(dashboard)/doubts/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

const schema = z.object({ hidden: z.boolean() });

/** POST /api/app/v1/admin/doubts/:id/hide: hide or show a post (the website's adminHideDoubt; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ params, body }) => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const { hidden } = await body(schema, 512);
  const r = await adminHideDoubt(params.id, hidden);
  if (r.error) throw new ApiFail(r.error === "Not authorized." ? "forbidden" : "server_error", r.error);
  return { hidden };
});
