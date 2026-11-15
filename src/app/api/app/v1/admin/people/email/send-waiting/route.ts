import { sendWaitingPeopleEmails } from "@/app/(dashboard)/admin/people/actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { PeopleSendWaitingResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 300;

/** POST /api/app/v1/admin/people/email/send-waiting: the waiting pipeline emails, up to today's allowance (super admin only). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, limitWrite }): Promise<PeopleSendWaitingResult> => {
  await limitWrite(`app:sendwaiting:${user.profile.id}`, 5);
  const r = await sendWaitingPeopleEmails();
  if (r.error) failFrom(r.error);
  return { sent: r.sent, failed: r.failed, left: r.left };
});
