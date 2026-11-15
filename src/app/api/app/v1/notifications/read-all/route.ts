import { markAllNotificationsRead } from "@/app/(dashboard)/notifications/actions";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { ReadAllResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/notifications/read-all: the website's markAllNotificationsRead. */
export const POST = appRoute({ auth: "bearer", gates: GATES.notifications }, async ({ user, limitWrite }): Promise<ReadAllResult> => {
  await limitWrite(`app:readall:${user.profile.id}`, 30);
  await markAllNotificationsRead();
  return { unread: 0 };
});
