import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { signOffList } from "@/lib/app-api/admin-round2";
import { appRoute } from "@/lib/app-api/route";
import type { SignOffList } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/review/signoffs: supervision entries students asked to be signed (the website's Sign-offs page, loadSignOffRequests). */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<SignOffList> => signOffList(createAdminClient(), isSuperAdmin(user.profile)));
