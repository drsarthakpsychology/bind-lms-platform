import { loadWallReports } from "@/lib/app-api/wall-reports";
import { appRoute } from "@/lib/app-api/route";
import type { AdminWallReports } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/wall-reports: open reports on the class wall, oldest first (the website's /admin/wall-reports). */
export const GET = appRoute({ auth: "admin" }, async (): Promise<AdminWallReports> => loadWallReports());
