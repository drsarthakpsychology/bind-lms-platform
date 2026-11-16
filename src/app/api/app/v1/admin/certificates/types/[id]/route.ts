import { saveAchievement } from "@/app/(dashboard)/admin/achievements/actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { saveInput, typeSchema } from "../schema";

export const runtime = "nodejs";

const uuid = /^[0-9a-f-]{36}$/i;

/** PUT /api/app/v1/admin/certificates/types/:id: change a type's wording or rule (the website's saveAchievement; super admin, 30 a minute). */
export const PUT = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<{ id: string }> => {
  if (!uuid.test(params.id)) throw new ApiFail("not_found");
  const b = await body(typeSchema, 8_000);
  await limitWrite(`app:certtype:${user.profile.id}`, 30);
  const r = await saveAchievement(saveInput(b, params.id));
  if (r.error) failFrom(r.error);
  return { id: params.id };
});
