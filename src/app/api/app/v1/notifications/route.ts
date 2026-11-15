import { listNotifications } from "@/lib/app-api/notifications";
import { appRoute, GATES } from "@/lib/app-api/route";
import { pageParams } from "@/lib/app-api/schemas";
import type { NotificationList } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/notifications: the bell, newest first (paged). */
export const GET = appRoute({ auth: "bearer", gates: GATES.notifications }, async ({ user, query }): Promise<NotificationList> => {
  const { limit, cursor } = pageParams(query);
  return listNotifications(user.profile.id, limit, cursor);
});
