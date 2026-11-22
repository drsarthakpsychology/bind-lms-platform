import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { appRoute } from "@/lib/app-api/route";
import { loadRemovalData, type RemovalData, type RemovalDb } from "@/lib/people/removal";

export const runtime = "nodejs";

export type RemovalAnswer = RemovalData & { canWrite: boolean };

/** GET /api/app/v1/admin/removal: everyone who can be removed (students and staff), and the app's deletion requests. Any admin reads; only a Super Admin acts. */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<RemovalAnswer> => {
  const data = await loadRemovalData(createAdminClient() as unknown as RemovalDb, user.profile);
  return { ...data, canWrite: isSuperAdmin(user.profile) };
});
