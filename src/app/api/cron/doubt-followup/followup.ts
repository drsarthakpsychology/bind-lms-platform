import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { sendNotifications } from "@/lib/notify/send";
import { logEmailSend, sendResendEmail, PREVIEW_GATE } from "@/lib/auth/roster";
import { richToEmailHtml } from "@/lib/email/rich-html";
import { isQuotaStop } from "@/lib/email/pace";
import { appUrl } from "@/lib/app-url";
import { CATCH_UP_MS, answerPreview, answersNeedingNotice, emailDecision, esc, makeThrottle, type AnswerRow, type DoubtRef, type FollowupRow } from "./rules";

/**
 * Doubt answered → notify the student, then ONE email if the notice is still
 * unopened after 48 hours. Every answer is recorded in `doubt_followups`
 * (2026_11_doubt_followups.sql) keyed by the answer id, and the email is
 * claimed with a conditional update before it is sent, so two runs at once
 * (the daily cron and an admin page load) can never email anyone twice.
 * Missing table → nothing happens and nothing breaks.
 */

export const FOLLOWUP_DB_STEP = "Run the database step 2026_11_doubt_followups.sql (Supabase → SQL Editor) to switch on doubt-answer notices.";

type Admin = ReturnType<typeof createAdminClient>;
export type SweepReport = { ready: boolean; notified: number; merged: number; emailed: number; emailFailed: number; opened: number };

async function tableReady(admin: Admin): Promise<boolean> {
  const { error } = await admin.from("doubt_followups").select("reply_id").limit(1);
  return !error;
}

async function adminIds(admin: Admin): Promise<Set<string>> {
  const { data } = await admin.from("profiles").select("id").in("role", ["admin", "view_admin"]);
  return new Set((data ?? []).map((p) => p.id as string));
}

/** Doubts with a notice still waiting to be opened (so new answers fold into it). */
async function doubtsWithOpenNotice(admin: Admin, doubtIds: string[]): Promise<Set<string>> {
  if (!doubtIds.length) return new Set();
  const { data } = await admin
    .from("doubt_followups")
    .select("doubt_id, notification_id")
    .in("doubt_id", doubtIds)
    .not("notification_id", "is", null)
    .is("emailed_at", null)
    .is("email_status", null);
  const rows = data ?? [];
  if (!rows.length) return new Set();
  const { data: notes } = await admin.from("notifications").select("id, opened_at, read_at").in("id", rows.map((r) => r.notification_id as string));
  const opened = new Set((notes ?? []).filter((n) => n.opened_at || n.read_at).map((n) => n.id as string));
  return new Set(rows.filter((r) => !opened.has(r.notification_id as string)).map((r) => r.doubt_id as string));
}

/** Create the in-app notice for one answer. Records first (claims the answer), then sends. */
async function noticeFor(admin: Admin, a: AnswerRow, doubt: { user_id: string; title: string; kind: string | null }, body: string): Promise<boolean> {
  const { data: claimed, error } = await admin
    .from("doubt_followups")
    .upsert({ reply_id: a.id, doubt_id: a.doubt_id, user_id: doubt.user_id }, { onConflict: "reply_id", ignoreDuplicates: true })
    .select("reply_id");
  if (error || !claimed?.length) return false; // already recorded by another run
  const isConcern = doubt.kind === "complaint";
  const title = isConcern ? "The VIBHA team replied to your message" : "Your doubt has an answer";
  const html =
    `<p><strong>${esc(doubt.title)}</strong></p>` +
    `<blockquote>${esc(answerPreview(body))}</blockquote>` +
    `<p><a href="/doubts/${a.doubt_id}">${isConcern ? "Read the reply" : "See the full answer"}</a></p>`;
  const res = await sendNotifications({ userIds: [doubt.user_id], title, html, type: "message", sentBy: a.user_id });
  if (res.error || !res.batchId || !res.created) {
    await admin.from("doubt_followups").delete().eq("reply_id", a.id); // try again next run
    return false;
  }
  const { data: note } = await admin.from("notifications").select("id").eq("batch_id", res.batchId).eq("user_id", doubt.user_id).maybeSingle();
  await admin.from("doubt_followups").update({ notification_id: (note?.id as string | undefined) ?? null, notified_at: new Date().toISOString() }).eq("reply_id", a.id);
  return true;
}

/**
 * Give every recent admin answer its notice. `doubtId` narrows it to one
 * thread (used right after an Inbox reply, so the notice is instant).
 */
async function catchUpNotices(admin: Admin, opts: { now: number; doubtId?: string; limit: number }): Promise<{ notified: number; merged: number }> {
  let q = admin
    .from("doubt_replies")
    .select("id, doubt_id, user_id, hidden, body, created_at")
    .gte("created_at", new Date(opts.now - CATCH_UP_MS).toISOString())
    .order("created_at", { ascending: true })
    .limit(500);
  if (opts.doubtId) q = q.eq("doubt_id", opts.doubtId);
  const { data: replies } = await q;
  const answers = (replies ?? []) as (AnswerRow & { body: string })[];
  if (!answers.length) return { notified: 0, merged: 0 };

  const doubtIds = [...new Set(answers.map((r) => r.doubt_id))];
  const [{ data: doubts }, admins, { data: rec }, open] = await Promise.all([
    admin.from("doubts").select("id, user_id, status, title, kind").in("id", doubtIds),
    adminIds(admin),
    admin.from("doubt_followups").select("reply_id").in("reply_id", answers.map((r) => r.id)),
    doubtsWithOpenNotice(admin, doubtIds),
  ]);
  const byId = new Map((doubts ?? []).map((d) => [d.id as string, d]));
  const refs = new Map<string, DoubtRef>([...byId].map(([id, d]) => [id, { id, user_id: d.user_id as string, status: (d.status as string | null) ?? "open" }]));
  const { notify, merge } = answersNeedingNotice(answers, refs, admins, new Set((rec ?? []).map((r) => r.reply_id as string)), open);

  let notified = 0;
  for (const a of notify.slice(0, opts.limit)) {
    const d = byId.get(a.doubt_id)!;
    const body = answers.find((x) => x.id === a.id)?.body ?? "";
    if (await noticeFor(admin, a, { user_id: d.user_id as string, title: String(d.title ?? "Your doubt"), kind: (d.kind as string | null) ?? null }, body)) notified++;
  }
  // Folded answers are recorded with no notice of their own (and never emailed).
  if (merge.length) {
    await admin
      .from("doubt_followups")
      .upsert(merge.map((m) => ({ reply_id: m.id, doubt_id: m.doubt_id, user_id: refs.get(m.doubt_id)!.user_id, email_status: "merged" })), { onConflict: "reply_id", ignoreDuplicates: true });
  }
  return { notified, merged: merge.length };
}

/** Send the ONE follow-up email for notices unopened after 48 hours. */
async function sendDueEmails(admin: Admin, opts: { now: number; limit: number }): Promise<{ emailed: number; emailFailed: number; opened: number }> {
  const before = new Date(opts.now - 48 * 3600_000).toISOString();
  const { data } = await admin
    .from("doubt_followups")
    .select("reply_id, doubt_id, user_id, notification_id, notified_at, email_claimed_at, emailed_at, email_status")
    .lte("notified_at", before)
    .is("emailed_at", null)
    .is("email_claimed_at", null)
    .is("email_status", null)
    .not("notification_id", "is", null)
    .order("notified_at", { ascending: true })
    .limit(opts.limit);
  const rows = (data ?? []) as FollowupRow[];
  if (!rows.length) return { emailed: 0, emailFailed: 0, opened: 0 };

  const [{ data: notes }, { data: people }, { data: doubts }] = await Promise.all([
    admin.from("notifications").select("id, title, body, opened_at, read_at").in("id", rows.map((r) => r.notification_id!)),
    admin.from("profiles").select("id, email, name, status").in("id", [...new Set(rows.map((r) => r.user_id))]),
    admin.from("doubts").select("id, title, status").in("id", [...new Set(rows.map((r) => r.doubt_id))]),
  ]);
  const note = new Map((notes ?? []).map((n) => [n.id as string, n]));
  const person = new Map((people ?? []).map((p) => [p.id as string, p]));
  const doubt = new Map((doubts ?? []).map((d) => [d.id as string, d]));
  const site = appUrl();

  let emailed = 0;
  let emailFailed = 0;
  let opened = 0;
  for (const f of rows) {
    const n = note.get(f.notification_id!);
    const decision = emailDecision(f, (n?.opened_at as string | null) ?? (n?.read_at as string | null) ?? null, opts.now);
    if (decision === "opened") {
      await admin.from("doubt_followups").update({ email_status: "opened" }).eq("reply_id", f.reply_id).is("email_status", null);
      opened++;
      continue;
    }
    if (decision !== "email") continue;
    const p = person.get(f.user_id);
    const d = doubt.get(f.doubt_id);
    if (!n || !p?.email || p.status === "blocked" || !d || d.status === "hidden") {
      await admin.from("doubt_followups").update({ email_status: "skipped" }).eq("reply_id", f.reply_id).is("email_status", null);
      continue;
    }
    // Claim it: only the run whose update lands sends the email.
    const { data: claim } = await admin
      .from("doubt_followups")
      .update({ email_claimed_at: new Date().toISOString() })
      .eq("reply_id", f.reply_id)
      .is("email_claimed_at", null)
      .is("emailed_at", null)
      .select("reply_id");
    if (!claim?.length) continue;

    const link = `${site}/notifications/${f.notification_id}`;
    const subject = String(n.title ?? "Your doubt has an answer");
    const text = `${subject}\n\n"${String(d.title ?? "")}"\n\n${String(n.body ?? "")}\n\nRead it on VIBHA: ${link}`;
    const html = richToEmailHtml(
      `<h2>${esc(subject)}</h2><p><strong>${esc(String(d.title ?? ""))}</strong></p><p><a href="${link}">Read it on VIBHA</a></p>`,
      { preheader: `${subject}: ${String(d.title ?? "")}`.slice(0, 120) },
    );
    const res = await sendResendEmail(String(p.email), subject, text, html);
    await logEmailSend(admin, {
      recipient: String(p.email),
      name: (p.name as string | null) ?? null,
      subject,
      templateId: "doubt-answered",
      status: res.ok ? "sent" : "failed",
      errorReason: res.ok ? null : (res.error ?? "Send failed."),
      sentAt: res.ok ? new Date().toISOString() : null,
      sentBy: null,
      providerId: res.id ?? null,
      bodyText: text,
      html,
    });
    if (res.error === PREVIEW_GATE) {
      // A preview site may share the live database: hand the claim back so the
      // real site still sends this one email later.
      await admin.from("doubt_followups").update({ email_claimed_at: null }).eq("reply_id", f.reply_id).is("emailed_at", null);
      continue;
    }
    await admin
      .from("doubt_followups")
      .update({ emailed_at: res.ok ? new Date().toISOString() : null, email_status: res.ok ? "sent" : "failed" })
      .eq("reply_id", f.reply_id);
    if (res.ok) emailed++;
    else {
      emailFailed++;
      if (isQuotaStop(res.error)) break;
    }
  }
  return { emailed, emailFailed, opened };
}

/** One full pass: notices for recent answers, then due emails. Never throws. */
export async function runDoubtFollowups(opts: { now?: number; noticeLimit?: number; emailLimit?: number } = {}): Promise<SweepReport> {
  const now = opts.now ?? Date.now();
  const empty: SweepReport = { ready: false, notified: 0, merged: 0, emailed: 0, emailFailed: 0, opened: 0 };
  try {
    const admin = createAdminClient();
    if (!(await tableReady(admin))) return empty;
    const n = await catchUpNotices(admin, { now, limit: opts.noticeLimit ?? 50 });
    const e = await sendDueEmails(admin, { now, limit: opts.emailLimit ?? 100 });
    return { ready: true, ...n, ...e };
  } catch (err) {
    console.error("[doubt-followup]", err);
    return empty;
  }
}

/** Right after an admin answers in the Inbox: the notice for that thread, now. */
export async function noticeForThread(doubtId: string): Promise<void> {
  try {
    const admin = createAdminClient();
    if (!(await tableReady(admin))) return;
    await catchUpNotices(admin, { now: Date.now(), doubtId, limit: 3 });
  } catch (err) {
    console.error("[doubt-followup]", err);
  }
}

const due = makeThrottle(15 * 60_000);

/**
 * The cheap check on admin page loads (scheduled with `after`, so the page
 * never waits): at most once per 15 minutes per server instance, and small
 * batches. The daily cron does the rest.
 */
export async function opportunisticDoubtFollowups(): Promise<void> {
  if (!due(Date.now())) return;
  await runDoubtFollowups({ noticeLimit: 10, emailLimit: 10 });
}
