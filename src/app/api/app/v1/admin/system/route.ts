import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { systemData } from "@/lib/app-api/admin-round2";
import { appRoute } from "@/lib/app-api/route";
import type { AdminSystem } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/system: support keys (views only, never a key or its hash), the older shared key, recent uses, and how full the database is. */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<AdminSystem> => systemData(createAdminClient(), isSuperAdmin(user.profile)));
