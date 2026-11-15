import { isSuperAdmin } from "@/lib/auth/guards";
import { adminHome } from "@/lib/app-api/admin";
import { appRoute } from "@/lib/app-api/route";
import type { AdminHomeData } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/home: the website's admin Home (things to do, needs a look, on now, cohorts, numbers). */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<AdminHomeData> => adminHome(isSuperAdmin(user.profile)));
