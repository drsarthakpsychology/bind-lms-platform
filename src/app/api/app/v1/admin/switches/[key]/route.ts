import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/auth/audit";
import { isFlagKey } from "@/lib/app-api/admin-r2b";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

const schema = z.object({ state: z.enum(["off", "live", "unlocked"]) });

/** POST /api/app/v1/admin/switches/:key: hide, show locked, or open a feature for students (the website's /api/admin/flags). Super Admin only. */
export const POST = appRoute<{ key: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<{ key: string; state: string }> => {
  const key = String(params.key ?? "");
  if (!/^[a-z0-9_]{1,64}$/.test(key)) throw new ApiFail("not_found");
  const { state } = await body(schema, 512);
  await limitWrite(`app:switch:${user.profile.id}`, 30);
  const admin = createAdminClient();
  if (!(await isFlagKey(admin, key))) throw new ApiFail("not_found");
  const { error } = await admin.from("feature_flags").update({ status: state, enabled: state !== "off", updated_at: new Date().toISOString() }).eq("key", key);
  if (error) throw new ApiFail("server_error", "Could not change it. Try again.");
  await audit(admin, { action: "flag.set", targetType: "feature_flag", targetId: key, details: { status: state, via: "app" }, actor: { id: user.profile.id, email: user.profile.email ?? null } });
  return { key, state };
});
