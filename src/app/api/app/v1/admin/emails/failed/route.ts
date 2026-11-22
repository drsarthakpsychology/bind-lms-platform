import { createAdminClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/auth/guards";
import { failedEmails, type AdminFailedEmail } from "@/lib/app-api/admin-r2b";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/emails/failed: failed sends still open (the website's Mail > Failed list), with the reason in plain words. */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<{ v: 1; items: AdminFailedEmail[]; canWrite: boolean }> => ({ v: 1, items: await failedEmails(createAdminClient()), canWrite: isSuperAdmin(user.profile) }));
