import { z } from "zod";
import { awardBadge } from "@/app/(dashboard)/admin/credentials/actions";
import { MAX_BADGE_RECIPIENTS } from "@/lib/achievements/manual-award";
import { failFrom } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { AwardBadgeResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 120;

const uuid = z.string().uuid();
const schema = z.object({ userIds: z.array(uuid).min(1).max(MAX_BADGE_RECIPIENTS) });

/** POST /api/app/v1/admin/badges/:id/award { userIds }: give a badge by hand (the website's awardBadge; already-holders skipped; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<AwardBadgeResult> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const { userIds } = await body(schema, 32 * 1024);
  await limitWrite(`app:badgeaward:${user.profile.id}`, 20);
  const r = await awardBadge(params.id, userIds);
  if (r.error) failFrom(r.error === "Pick a badge." ? "Badge not found." : r.error);
  return { awarded: r.awarded, skipped: r.skipped };
});
