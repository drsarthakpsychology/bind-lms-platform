import { revokeLegacyKey } from "@/app/(dashboard)/admin/tools/master-actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/system/legacy-key/revoke: turn the older single shared key off (revokeLegacyKey; super admin, 10 a minute). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, limitStrict }): Promise<{ revoked: true }> => {
  await limitStrict(`app:supportkey:${user.profile.id}`, 10);
  const r = await revokeLegacyKey();
  if (r.error) failFrom(r.error);
  return { revoked: true };
});
