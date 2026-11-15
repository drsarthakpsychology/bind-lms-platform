import { loadProgress } from "@/lib/app-api/progress";
import { appRoute } from "@/lib/app-api/route";
import type { Progress } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/progress: lectures watched per course, Study totals, the last 14 days and strengths. */
export const GET = appRoute({ auth: "bearer" }, async ({ user }): Promise<Progress> => loadProgress(user.profile));
