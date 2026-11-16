import { z } from "zod";
import { setAchievementEnabled } from "@/app/(dashboard)/admin/achievements/actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/certificates/types/:id/enabled { enabled }: switch a type on or off (setAchievementEnabled; super admin, 60 a minute). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<{ enabled: boolean }> => {
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) throw new ApiFail("not_found");
  const { enabled } = await body(z.object({ enabled: z.boolean() }));
  await limitWrite(`app:certtype:${user.profile.id}`, 60);
  const r = await setAchievementEnabled(params.id, enabled);
  if (r.error) failFrom(r.error);
  return { enabled };
});
