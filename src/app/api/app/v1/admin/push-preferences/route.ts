import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { loadAdminPushPrefs, saveAdminPushPrefs } from "@/lib/app-api/admin-push";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { AdminPushPrefs } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/push-preferences: this admin's own phone notices. */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<AdminPushPrefs> => loadAdminPushPrefs(createAdminClient(), user.profile.id));

const schema = z.object({ newDoubt: z.boolean().optional(), newEnquiry: z.boolean().optional(), fallingBehind: z.boolean().optional() }).strict();

/** PUT /api/app/v1/admin/push-preferences: any admin changes their own (view-only admins too: it is their phone), 60 a minute. */
export const PUT = appRoute({ auth: "admin" }, async ({ user, body, limitWrite }): Promise<AdminPushPrefs> => {
  const change = await body(schema);
  await limitWrite(`app:adminpush:${user.profile.id}`, 60);
  const r = await saveAdminPushPrefs(createAdminClient(), user.profile.id, change);
  if (r.error) throw new ApiFail("unavailable", "Couldn't save. Try again.");
  return r.prefs;
});
