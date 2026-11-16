import { rotateSupportKey } from "@/app/(dashboard)/admin/tools/master-actions";
import { appRoute } from "@/lib/app-api/route";
import type { NewSupportKey } from "@/lib/app-api/contract-practise-admin";
import { newKey } from "../../../key-result";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/system/support-keys/:id/rotate: revoke the key and make a new one with the same name, shown once (rotateSupportKey; super admin, 10 a minute). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitStrict }): Promise<NewSupportKey> => {
  await limitStrict(`app:supportkey:${user.profile.id}`, 10);
  return newKey(await rotateSupportKey(params.id.slice(0, 80)));
});
