import { z } from "zod";
import { loadNotifyBatches, sendNotifications } from "@/lib/notify/send";
import { textToHtml } from "@/lib/email/rich-html";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { MessageBatches, SendMessageResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/messages: recent sends and how many opened them. */
export const GET = appRoute({ auth: "admin" }, async (): Promise<MessageBatches> => loadNotifyBatches(30));

const schema = z.object({ userIds: z.array(z.string().uuid()).min(1).max(5000), title: z.string().trim().min(1).max(140), text: z.string().trim().min(1).max(10_000), alsoEmail: z.boolean().optional() });

/** POST /api/app/v1/admin/messages: the website's sendNotifications (bell, push, optional email). Super admin only. */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<SendMessageResult> => {
  const input = await body(schema, 256_000);
  await limitWrite(`app:message:${user.profile.id}`, 10);
  const r = await sendNotifications({ userIds: input.userIds, title: input.title, html: textToHtml(input.text), type: "message", sentBy: user.profile.id, alsoEmail: Boolean(input.alsoEmail) });
  if (r.error) throw new ApiFail(r.needsDbStep ? "unavailable" : "bad_request", r.error);
  return { created: r.created, emailed: r.emailed, emailFailed: r.emailFailed, batchId: r.batchId };
});
