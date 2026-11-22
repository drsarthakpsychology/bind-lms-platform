import { createAdminClient } from "@/lib/supabase/server";
import { adminSwitches, type AdminSwitches } from "@/lib/app-api/admin-r2b";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/switches: every feature switch with its state (the website's What's live page). */
export const GET = appRoute({ auth: "admin" }, async (): Promise<AdminSwitches> => adminSwitches(createAdminClient()));
