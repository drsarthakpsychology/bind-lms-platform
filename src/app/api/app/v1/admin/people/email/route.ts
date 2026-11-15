import { z } from "zod";
import { emailPeople } from "@/app/(dashboard)/admin/people/actions";
import { emailFromKey } from "@/lib/crm/people";
import { PERSONAL_LIMITS } from "@/lib/email/personal-plan";
import { failFrom, reportOut } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PersonalEmailReport } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 300;

const schema = z.object({ keys: z.array(z.string().max(400)).min(1).max(PERSONAL_LIMITS.recipients), subject: z.string().max(PERSONAL_LIMITS.subject), body: z.string().max(PERSONAL_LIMITS.body) });

/** POST /api/app/v1/admin/people/email: email one person or a picked group (the website's emailPeople: only people in the pipeline; super admin only). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<PersonalEmailReport> => {
  const b = await body(schema, 256 * 1024);
  const emails = b.keys.map((k) => emailFromKey(k)).filter((e): e is string => Boolean(e));
  if (!emails.length) throw new ApiFail("bad_request", "Pick at least one person.");
  await limitWrite(`app:peopleemail:${user.profile.id}`, 10);
  const r = await emailPeople({ emails, subject: b.subject, body: b.body });
  if (r.error) failFrom(r.error);
  return reportOut(r);
});
