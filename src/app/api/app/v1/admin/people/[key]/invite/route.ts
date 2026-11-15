import { z } from "zod";
import { sendInvite } from "@/app/(dashboard)/admin/people/actions";
import { emailOfKey, failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { InviteResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const schema = z.object({ name: z.string().max(160).optional().default("") });
export const maxDuration = 60;

/** POST /api/app/v1/admin/people/:key/invite { name? }: send the login link, making the account first for an enquiry (the website's sendInvite; super admin only). */
export const POST = appRoute<{ key: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<InviteResult> => {
  const email = emailOfKey(params.key);
  await limitWrite(`app:invite:${user.profile.id}`, 20);
  const { name } = await body(schema, 1024);
  const r = await sendInvite(email, name);
  if (r.error) failFrom(r.error);
  return { sent: r.sent, reason: r.reason ?? null };
});
