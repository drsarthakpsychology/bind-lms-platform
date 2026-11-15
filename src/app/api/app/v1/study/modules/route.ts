import { myLearnState } from "@/lib/app-api/learn-state";
import { studyHome } from "@/lib/app-api/study";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { StudyHome } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/modules: every module with its status, and the one next step. */
export const GET = appRoute({ auth: "bearer", gates: GATES.study }, async (): Promise<StudyHome> => studyHome(await myLearnState()));
