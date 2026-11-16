import { sendWaitingCertificateEmails } from "@/app/(dashboard)/admin/credentials/studio/actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { SendWaitingResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 300;

/** POST /api/app/v1/admin/certificates/send-waiting: the waiting certificate emails, up to today's allowance (super admin only). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, limitWrite }): Promise<SendWaitingResult> => {
  await limitWrite(`app:sendwaiting:${user.profile.id}`, 5);
  const r = await sendWaitingCertificateEmails();
  if (r.error) failFrom(r.error);
  return { sent: r.sent, failed: 0, left: r.left };
});
