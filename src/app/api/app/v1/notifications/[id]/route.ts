import { openNotification } from "@/lib/notify/read";
import { htmlToBlocks } from "@/lib/app-api/message-blocks";
import { notificationRow } from "@/lib/app-api/notifications";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { NotificationDetail } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/notifications/:id: one notice as blocks (never HTML). Opening it marks it read, as on the website. */
export const GET = appRoute<{ id: string }>({ auth: "bearer", gates: GATES.notifications }, async ({ user, params }): Promise<NotificationDetail> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const opened = await openNotification(user.profile, params.id);
  if (!opened) throw new ApiFail("not_found");
  const r = opened.row as unknown as Parameters<typeof notificationRow>[0];
  const { content, links } = htmlToBlocks(opened.html);
  return { ...notificationRow({ ...r, read_at: (r.read_at as string | null) ?? (opened.justRead ? new Date().toISOString() : null) }), from: opened.from, content, links };
});
