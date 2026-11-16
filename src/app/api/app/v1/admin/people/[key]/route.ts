import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { personDetail } from "@/lib/app-api/admin-round2";
import { appRoute } from "@/lib/app-api/route";
import type { AdminPersonDetail } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/people/:key: one person's record with the whole history (the website's person page: loadPipeline, loadTimeline, personFacts). */
export const GET = appRoute<{ key: string }>({ auth: "admin" }, async ({ user, params }): Promise<AdminPersonDetail> => personDetail(createAdminClient(), params.key, isSuperAdmin(user.profile)));
