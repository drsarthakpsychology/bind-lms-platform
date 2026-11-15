import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { loadForm, loadSubmissions } from "@/lib/forms/load";
import { composeFor } from "@/lib/email/personal";
import { MERGE_FIELDS, PERSONAL_LIMITS, unknownFields } from "@/lib/email/personal-plan";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { EmailPreview } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const uuid = z.string().uuid();
const schema = z.object({ submissionId: uuid, subject: z.string().max(PERSONAL_LIMITS.subject), body: z.string().max(PERSONAL_LIMITS.body) });

/** POST /api/app/v1/admin/forms/:id/email/preview: the email one respondent will get, merged (the sender's own composeFor). Sends nothing. */
export const POST = appRoute<{ id: string }>({ auth: "admin" }, async ({ user, params, body, limitFast }): Promise<EmailPreview> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const input = await body(schema, 64 * 1024);
  limitFast(`app:formpreview:${user.profile.id}`, 120);
  const admin = createAdminClient();
  const form = await loadForm(admin, params.id);
  if (!form) throw new ApiFail("not_found");
  const sub = (await loadSubmissions(admin, form.id)).find((s) => s.id === input.submissionId);
  if (!sub) throw new ApiFail("not_found");
  const m = composeFor({ email: sub.email, name: sub.name, vars: { form: form.title } }, input.subject, input.body);
  const known = [...MERGE_FIELDS.map((f) => f.key), "form"];
  return { to: sub.email ?? "", subject: m.subject, text: m.text, unknownFields: [...new Set([...unknownFields(input.subject, known), ...unknownFields(input.body, known)])] };
});
