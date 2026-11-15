import { adminHome } from "@/lib/app-api/admin";
import { appRoute } from "@/lib/app-api/route";
import type { AdminHome } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/home: counts, who needs a look, who is on now. */
export const GET = appRoute({ auth: "admin" }, async (): Promise<AdminHome> => adminHome());
