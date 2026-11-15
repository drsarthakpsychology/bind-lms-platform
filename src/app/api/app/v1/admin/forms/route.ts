import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { formsList } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { AdminForms } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/forms: every link form with its answer count (the website's loadForms). */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<AdminForms> => formsList(createAdminClient(), isSuperAdmin(user.profile)));
