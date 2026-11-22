import { createAdminClient } from "@/lib/supabase/server";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import { declineDeletionRequest, type RemovalDb } from "@/lib/people/removal";
import { answer } from "../../../outcome";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/removal/requests/:id/decline: keep the account and close the request (Super Admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitWrite }) => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  await limitWrite(`app:remove:${user.profile.id}`, 30);
  return answer(await declineDeletionRequest(createAdminClient() as unknown as RemovalDb, user.profile, params.id), { declined: true });
});
