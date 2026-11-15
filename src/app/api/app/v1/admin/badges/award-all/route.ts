import { awardAllBadges } from "@/app/(dashboard)/admin/achievements/actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { AwardAllResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 300;

/** POST /api/app/v1/admin/badges/award-all: every badge earned so far, given now (the website's awardAllBadges; super admin only). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, limitWrite }): Promise<AwardAllResult> => {
  await limitWrite(`app:badgeall:${user.profile.id}`, 2);
  const r = await awardAllBadges();
  if (r.error) failFrom(r.error);
  return { awarded: r.awarded, skipped: r.skipped };
});
