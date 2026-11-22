import { appRoute, GATES } from "@/lib/app-api/route";
import { quickLibrary } from "@/lib/quick-notes/library";
import type { QuickLibrary } from "@/lib/quick-notes/view-types";

export const runtime = "nodejs";

/** GET /api/app/v1/study/quick-notes : the one Quick Notes library (every row, type chips, topics). */
export const GET = appRoute({ auth: "bearer", gates: GATES.study }, async (): Promise<QuickLibrary> => quickLibrary());
