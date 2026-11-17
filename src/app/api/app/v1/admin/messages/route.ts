import { z } from "zod";
import { loadNotifyBatches } from "@/lib/notify/send";
import { textToHtml } from "@/lib/email/rich-html";
import { loadRecipientData } from "@/app/(dashboard)/admin/emails/actions";
import { sendNotificationAction } from "@/app/(dashboard)/admin/emails/notify-actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { AdminMessages, AdminSendResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/messages: recent sends (how many opened them), and the cohorts and courses that can be messaged. */
export const GET = appRoute({ auth: "admin" }, async (): Promise<AdminMessages> => {
  const [{ batches, ready }, rec] = await Promise.all([loadNotifyBatches(30), loadRecipientData()]);
  return {
    v: 1,
    batches,
    ready,
    items: batches.map((b) => ({ id: b.batchId, to: b.total === 1 ? "1 student" : `${b.total} students`, title: b.title, preview: `${b.opened} of ${b.total} opened`, at: b.sentAt, unread: false })),
    cohorts: rec.cohorts.map((c) => ({ ...c, members: rec.membersByCohort[c.id]?.length ?? 0 })),
    courses: rec.courses.map((c) => ({ ...c, members: rec.enrolledByCourse[c.id]?.length ?? 0 })),
    students: rec.students.length,
  };
});

// The first version's body: { userIds, title, text, alsoEmail? }.
const legacy = z.object({ userIds: z.array(uuid).min(1).max(5000), title: z.string().trim().min(1).max(140), text: z.string().trim().min(1).max(10_000), alsoEmail: z.boolean().optional() });

const current = z
  .object({
    to: z.enum(["everyone", "cohort", "course", "student", "students"]),
    toId: uuid.optional(),
    userIds: z.array(uuid).max(5000).optional(),
    title: z.string().trim().min(1).max(140),
    body: z.string().trim().min(1).max(10_000),
    alsoEmail: z.boolean().optional(),
  })
  .refine((b) => (b.to === "students" ? Boolean(b.userIds?.length) : b.to === "everyone" || Boolean(b.toId)), { path: ["toId"] });

const schema = z.union([current, legacy.transform((b) => ({ to: "students" as const, toId: undefined, userIds: b.userIds, title: b.title, body: b.text, alsoEmail: b.alsoEmail }))]);

/**
 * POST /api/app/v1/admin/messages: a bell notice (and phone push, optional
 * email) to one student, picked students, a cohort, a course, or everyone.
 * The recipients are worked out the website's way (loadRecipientData, as the
 * compose tab) and sent with the website's sendNotificationAction (super admin only).
 */
export const POST = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }): Promise<AdminSendResult> => {
  const input = await body(schema, 256_000);
  await limitWrite(`app:message:${user.profile.id}`, 10);
  let ids: string[] = [];
  if (input.to === "student") ids = [input.toId!];
  else if (input.to === "students") ids = input.userIds ?? [];
  else {
    const rec = await loadRecipientData();
    ids = input.to === "everyone" ? rec.students.map((s) => s.id) : input.to === "cohort" ? (rec.membersByCohort[input.toId!] ?? []) : (rec.enrolledByCourse[input.toId!] ?? []);
  }
  if (!ids.length) throw new ApiFail("bad_request", "Nobody to send this to.");
  const r = await sendNotificationAction({ userIds: ids, title: input.title, html: textToHtml(input.body), alsoEmail: Boolean(input.alsoEmail) });
  if (r.error) throw new ApiFail(/Super Admin/.test(r.error) ? "forbidden" : (r as { needsDbStep?: boolean }).needsDbStep ? "unavailable" : "bad_request", r.error);
  return { sent: r.created, created: r.created, emailed: r.emailed, emailFailed: r.emailFailed, batchId: r.batchId };
});
