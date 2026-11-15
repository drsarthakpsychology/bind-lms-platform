import { loadMyAchievements } from "@/app/(dashboard)/achievements/actions";
import { credentialOut } from "@/lib/app-api/achievements";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { Achievements } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/achievements: badges and certificates earned, and badge progress (the website's loadMyAchievements). */
export const GET = appRoute({ auth: "bearer", gates: GATES.achievements }, async (): Promise<Achievements> => {
  const { earned, progress } = await loadMyAchievements();
  return { earned: earned.map(credentialOut), progress };
});
