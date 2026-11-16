import { revokeSupportKey } from "@/app/(dashboard)/admin/tools/master-actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/system/support-keys/:id/revoke: the key stops working at once (revokeSupportKey; super admin, 10 a minute). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitStrict }): Promise<{ revoked: true }> => {
  await limitStrict(`app:supportkey:${user.profile.id}`, 10);
  const r = await revokeSupportKey(params.id.slice(0, 80));
  if (r.error) failFrom(r.error);
  return { revoked: true };
});
