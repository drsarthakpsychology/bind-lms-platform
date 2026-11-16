import { z } from "zod";
import { emailFormRespondents } from "@/app/(dashboard)/admin/forms/email-actions";
import { PERSONAL_LIMITS } from "@/lib/email/personal-plan";
import { failFrom, reportOut } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PersonalEmailReport } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 300;

const uuid = z.string().uuid();
const schema = z.object({
  submissionIds: z.union([z.literal("all"), z.array(uuid).min(1).max(PERSONAL_LIMITS.recipients)]),
  subject: z.string().max(PERSONAL_LIMITS.subject),
  body: z.string().max(PERSONAL_LIMITS.body),
});

/** POST /api/app/v1/admin/forms/:id/email: email everyone, a few, or one who answered (the website's emailFormRespondents; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<PersonalEmailReport> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const input = await body(schema, 64 * 1024);
  await limitWrite(`app:formemail:${user.profile.id}`, 10);
  const r = await emailFormRespondents({ formId: params.id, ...input });
  if (r.error) failFrom(r.error);
  return reportOut(r);
});
