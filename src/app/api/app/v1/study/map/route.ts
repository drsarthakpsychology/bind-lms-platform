import { loadMapView } from "@/lib/app-api/learn-map";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { StudyMap } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/map: what you know and what to fix, the website's /study/map (loadStudentMap). */
export const GET = appRoute({ auth: "bearer", gates: GATES.studyMap }, async ({ user }): Promise<StudyMap> => loadMapView(user.profile));
