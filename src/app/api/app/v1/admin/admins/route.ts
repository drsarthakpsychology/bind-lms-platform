import { createAdminClient } from "@/lib/supabase/server";
import { listAdminPeople, type AdminPerson } from "@/lib/app-api/admin-r2b";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/admins: every Super Admin and view-only admin. Super Admin only (as the website's Admins page). */
export const GET = appRoute({ auth: "superAdmin" }, async ({ user }): Promise<{ v: 1; me: string; items: AdminPerson[] }> => ({ v: 1, me: user.profile.id, items: await listAdminPeople(createAdminClient()) }));
