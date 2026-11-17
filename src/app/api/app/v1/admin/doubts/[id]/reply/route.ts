import { z } from "zod";
import { replyFromInbox } from "@/app/(dashboard)/admin/inbox/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { AdminReplyResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const schema = z.object({ text: z.string().trim().min(1).max(10_000) });

/**
 * POST /api/app/v1/admin/doubts/:id/reply: answer a doubt or concern as the
 * team (the website's replyFromInbox: the doubt reply action's own rate limit
 * and visibility, then the student's notice; super admin only).
 */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin", sandbox: true }, async ({ params, body }): Promise<AdminReplyResult> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const { text } = await body(schema, 64_000);
  const r = await replyFromInbox(params.id, text);
  if (r.error) throw new ApiFail(/Super Admin/.test(r.error) ? "forbidden" : /too many|slow/i.test(r.error) ? "rate_limited" : /gone|not found/i.test(r.error) ? "not_found" : "bad_request", r.error);
  return { sent: true };
});
