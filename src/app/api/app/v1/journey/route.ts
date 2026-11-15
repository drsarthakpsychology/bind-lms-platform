import { loadJourney } from "@/lib/journey/model";
import { appRoute } from "@/lib/app-api/route";
import type { Journey } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/journey: My journey, the same numbers as the website's /journey (loadJourney). */
export const GET = appRoute({ auth: "bearer", gates: { path: "/journey" } }, async ({ user }): Promise<Journey> => loadJourney(user.profile.id));
