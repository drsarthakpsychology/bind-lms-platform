import { z } from "zod";
import { addPeopleToCohort, type AddRow } from "@/app/(dashboard)/admin/cohorts/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

const schema = z.object({
  emails: z.array(z.string().trim().toLowerCase().max(254)).min(1).max(300),
  cohortId: z.string().uuid(),
  scope: z.enum(["full", "lectures_only"]),
  sendEmail: z.boolean(),
});

/**
 * POST /api/app/v1/admin/students/add: add one or many students to a cohort
 * by email (the website's addPeopleToCohort): new emails get an account,
 * existing ones join the cohort, and the login link goes out when asked.
 * Super Admin only.
 */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<{ rows: AddRow[]; invalid: string[] }> => {
  const b = await body(schema, 64 * 1024);
  await limitWrite(`app:add-student:${user.profile.id}`, 10);
  const r = await addPeopleToCohort(b.cohortId, b.emails.join("\n"), { sendEmail: b.sendEmail, scope: b.scope });
  if (r.error) throw new ApiFail(r.error === "Not authorized." ? "forbidden" : "bad_request", r.error);
  return { rows: r.rows, invalid: r.invalid };
});
