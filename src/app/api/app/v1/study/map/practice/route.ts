import { loadMapPractice } from "@/lib/app-api/learn-map";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { MapPractice } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/map/practice?topic= : a round picked for you (the website's /study/map/practice). An unknown topic gives mixed practice. */
export const GET = appRoute({ auth: "bearer", gates: GATES.studyMap }, async ({ user, query, limitFast }): Promise<MapPractice> => {
  limitFast(`app:mapround:${user.profile.id}`, 30);
  const topic = (query.get("topic") ?? "").slice(0, 80) || null;
  return loadMapPractice(user.profile, topic);
});
