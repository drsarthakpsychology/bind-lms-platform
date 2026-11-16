import { isSuperAdmin } from "@/lib/auth/guards";
import { saveAchievement } from "@/app/(dashboard)/admin/achievements/actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { AdminCertTypes } from "@/lib/app-api/contract-practise-admin";
import { loadTypes } from "./load";
import { saveInput, typeSchema } from "./schema";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/certificates/types: every badge and certificate type with its rule in words (any admin reads). */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<AdminCertTypes> => loadTypes(isSuperAdmin(user.profile)));

/** POST /api/app/v1/admin/certificates/types: a new type (the website's saveAchievement; super admin, 30 a minute). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<{ id: string }> => {
  const b = await body(typeSchema, 8_000);
  await limitWrite(`app:certtype:${user.profile.id}`, 30);
  const r = await saveAchievement(saveInput(b, null));
  if (r.error || !r.id) failFrom(r.error ?? "Couldn't save it.");
  return { id: r.id };
});
