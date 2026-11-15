import { z } from "zod";
import { replyEmailFromInbox } from "@/app/(dashboard)/admin/inbox/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { AdminReplyResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const schema = z.object({ text: z.string().trim().min(1).max(10_000) });

/** POST /api/app/v1/admin/inbox/emails/:id/reply: answer an emailed reply (the website's replyEmailFromInbox; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<AdminReplyResult> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const { text } = await body(schema, 64_000);
  await limitWrite(`app:inboxreply:${user.profile.id}`, 30);
  const r = await replyEmailFromInbox(params.id, text);
  if (r.error) throw new ApiFail(r.error === "Not authorized." ? "forbidden" : "bad_request", r.error);
  return { sent: true };
});
