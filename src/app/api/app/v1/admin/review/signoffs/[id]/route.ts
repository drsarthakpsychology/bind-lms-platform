import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { decideSignOff } from "@/lib/admin/signoffs";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { SignOffResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/review/signoffs/:id { decision }: sign or reject a requested entry (decideSignOff, as /api/admin/supervision-signoff; super admin, 120 a minute). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<SignOffResult> => {
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) throw new ApiFail("not_found");
  const { decision } = await body(z.object({ decision: z.enum(["signed", "rejected"]) }));
  await limitWrite(`app:signoff:${user.profile.id}`, 120);
  const r = await decideSignOff(createAdminClient(), params.id, decision);
  if (!r.ok) throw new ApiFail(r.why === "not_found" ? "not_found" : r.why === "not_requested" ? "conflict" : "server_error", r.why === "not_requested" ? "This entry is not waiting for a sign-off any more." : undefined);
  return { id: params.id, status: r.status };
});
