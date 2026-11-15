import { listAchievements } from "@/app/(dashboard)/admin/achievements/actions";
import { isSuperAdmin } from "@/lib/auth/guards";
import { MAX_BADGE_RECIPIENTS } from "@/lib/achievements/manual-award";
import { appRoute } from "@/lib/app-api/route";
import type { AdminBadges } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/badges: the badges (the website's listAchievements, badges only), for Issue, Badge. */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<AdminBadges> => {
  const rows = await listAchievements();
  return {
    v: 1,
    badges: rows
      .filter((a) => a.type === "badge")
      .map((a) => ({
        id: a.id,
        title: a.title ?? "",
        description: a.description ?? null,
        icon: a.icon ?? null,
        tone: a.tone ?? "",
        enabled: a.enabled === true,
        issuedCount: a.issued_count ?? 0,
        automatic: Boolean(a.requirements && "kind" in a.requirements && a.requirements.kind),
      })),
    canWrite: isSuperAdmin(user.profile),
    maxRecipients: MAX_BADGE_RECIPIENTS,
  };
});
