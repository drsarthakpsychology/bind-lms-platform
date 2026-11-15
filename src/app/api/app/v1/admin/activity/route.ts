import { loadActivity } from "@/lib/analytics/activity";
import { loadLive } from "@/lib/analytics/live";
import { loadHiddenIds } from "@/lib/people/hidden-ids";
import { appRoute } from "@/lib/app-api/route";
import type { PlayResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/**
 * GET /api/app/v1/admin/activity: the website's Activity data (loadActivity:
 * per student minutes, places and lectures over 30 days; loadLive: on now),
 * test accounts left out. `kind` "admin.activity", the data shape is
 * `Awaited<ReturnType<typeof loadActivity>>` (src/lib/analytics/activity.ts).
 */
export const GET = appRoute({ auth: "admin" }, async (): Promise<PlayResult> => {
  const [activity, live, hidden] = await Promise.all([loadActivity(), loadLive(), loadHiddenIds()]);
  const rows = activity.rows.filter((r) => !hidden.has(r.id));
  return { kind: "admin.activity", v: 1, data: { ...activity, rows, live: live.filter((l) => !hidden.has(l.userId)) } };
});
