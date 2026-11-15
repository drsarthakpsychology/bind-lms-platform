import { z } from "zod";
import { sendWaitingFormEmails } from "@/app/(dashboard)/admin/forms/email-actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { FormSendWaitingResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 300;

/** POST /api/app/v1/admin/forms/:id/email/send-waiting: this form's waiting emails, up to today's allowance (super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitWrite }): Promise<FormSendWaitingResult> => {
  if (!z.string().uuid().safeParse(params.id).success) throw new ApiFail("not_found");
  await limitWrite(`app:sendwaiting:${user.profile.id}`, 5);
  const r = await sendWaitingFormEmails(params.id);
  if (r.error) failFrom(r.error);
  return { sent: r.sent, failed: r.failed, left: r.left };
});
