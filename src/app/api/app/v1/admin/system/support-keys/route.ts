import { z } from "zod";
import { createSupportKey } from "@/app/(dashboard)/admin/tools/master-actions";
import { appRoute } from "@/lib/app-api/route";
import type { NewSupportKey } from "@/lib/app-api/contract-practise-admin";
import { newKey } from "../key-result";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/system/support-keys { label }: a new named key, shown once (createSupportKey; super admin, 10 a minute). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitStrict }): Promise<NewSupportKey> => {
  const { label } = await body(z.object({ label: z.string().max(200) }));
  await limitStrict(`app:supportkey:${user.profile.id}`, 10);
  return newKey(await createSupportKey(label));
});
