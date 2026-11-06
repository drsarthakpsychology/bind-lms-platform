import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/learn/leaderboard";
import { groupReplies, threadNeedsReply, type NeedsReply, type ReplyRow, type ThreadRow } from "./logic";

export type InboxThread = {
  id: string;
  title: string;
  body: string;
  kind: "doubt" | "complaint";
  cohortId: string | null;
  cohortName: string | null;
  authorId: string;
  author: string;
  createdAt: string;
  need: NeedsReply;
  /** The student's latest message when they wrote back after an answer. */
  followUp: string | null;
  replies: number;
};

export type InboxEmail = { id: string; fromEmail: string; fromName: string | null; subject: string; body: string; receivedAt: string };

const LIMIT = 400;

/** Admin ids (Super Admin + View Admin): their replies count as "answered". */
async function adminIds(): Promise<Set<string>> {
  const { data } = await createAdminClient().from("profiles").select("id").in("role", ["admin", "view_admin"]);
  return new Set((data ?? []).map((p) => p.id as string));
}

/** Open threads + their replies, filtered to the ones waiting on an admin. */
async function waitingThreads(opts: { userId?: string } = {}) {
  const admin = createAdminClient();
  let q = admin.from("doubts").select("id, user_id, kind, status, created_at").eq("status", "open").order("created_at", { ascending: false }).limit(LIMIT);
  if (opts.userId) q = q.eq("user_id", opts.userId);
  const { data: doubts, error } = await q;
  if (error) return { ready: false as const, waiting: [] as { row: ThreadRow; need: NeedsReply; replies: ReplyRow[] }[] };
  const rows = (doubts ?? []) as ThreadRow[];
  if (!rows.length) return { ready: true as const, waiting: [] };
  const [{ data: replies }, ids] = await Promise.all([
    admin.from("doubt_replies").select("doubt_id, user_id, hidden, created_at").in("doubt_id", rows.map((r) => r.id)),
    adminIds(),
  ]);
  const by = groupReplies((replies ?? []) as ReplyRow[]);
  const waiting = rows
    .map((row) => ({ row, replies: by.get(row.id) ?? [], need: threadNeedsReply(row, by.get(row.id) ?? [], ids) }))
    .filter((x): x is { row: ThreadRow; replies: ReplyRow[]; need: NeedsReply } => x.need !== null);
  return { ready: true as const, waiting };
}

/**
 * The top-bar count: threads waiting on an admin + unread email replies.
 * Cheap (four small reads) and cached per request; never throws.
 */
export const loadInboxCounts = cache(async (): Promise<{ doubts: number; emails: number; total: number }> => {
  try {
    const [{ waiting }, { count }] = await Promise.all([
      waitingThreads(),
      createAdminClient().from("email_inbound").select("id", { count: "exact", head: true }).is("read_at", null).is("archived_at", null),
    ]);
    const emails = count ?? 0;
    return { doubts: waiting.length, emails, total: waiting.length + emails };
  } catch {
    return { doubts: 0, emails: 0, total: 0 };
  }
});

/** Everything for /admin/inbox (and a student's profile, with `userId`). */
export async function loadInbox(opts: { userId?: string; withEmails?: boolean } = {}): Promise<{ ready: boolean; threads: InboxThread[]; emails: InboxEmail[] }> {
  const admin = createAdminClient();
  const { ready, waiting } = await waitingThreads({ userId: opts.userId });
  let threads: InboxThread[] = [];
  if (waiting.length) {
    const ids = waiting.map((w) => w.row.id);
    const people = [...new Set(waiting.map((w) => w.row.user_id))];
    const [{ data: full }, { data: profiles }, { data: cohorts }, { data: lastReplies }] = await Promise.all([
      admin.from("doubts").select("id, title, body, cohort_id").in("id", ids),
      admin.from("profiles").select("id, name, email").in("id", people),
      admin.from("cohorts").select("id, name"),
      admin.from("doubt_replies").select("doubt_id, user_id, body, hidden, created_at").in("doubt_id", ids).order("created_at", { ascending: false }).limit(2000),
    ]);
    const byId = new Map((full ?? []).map((d) => [d.id as string, d]));
    const prof = new Map((profiles ?? []).map((p) => [p.id as string, p]));
    const cohortName = new Map((cohorts ?? []).map((c) => [c.id as string, c.name as string]));
    const askerOf = new Map(waiting.map((w) => [w.row.id, w.row.user_id]));
    const latestByAsker = new Map<string, string>();
    for (const r of lastReplies ?? []) {
      const id = r.doubt_id as string;
      if (r.hidden || latestByAsker.has(id)) continue;
      if (r.user_id === askerOf.get(id)) latestByAsker.set(id, String(r.body ?? ""));
    }
    threads = waiting.map(({ row, need, replies }) => {
      const d = byId.get(row.id);
      const p = prof.get(row.user_id);
      const cohortId = (d?.cohort_id as string | null) ?? null;
      return {
        id: row.id,
        title: String(d?.title ?? "Doubt"),
        body: String(d?.body ?? ""),
        kind: row.kind === "complaint" ? "complaint" : "doubt",
        cohortId,
        cohortName: cohortId ? (cohortName.get(cohortId) ?? null) : null,
        authorId: row.user_id,
        author: p ? displayName((p.name as string | null) ?? null, String(p.email ?? "")) : "A student",
        createdAt: row.created_at,
        need,
        followUp: need.reason === "student-replied" ? (latestByAsker.get(row.id) ?? null) : null,
        replies: replies.filter((r) => !r.hidden).length,
      };
    });
    // Private concerns first, then oldest wait first (fair queue).
    threads.sort((a, b) => (a.kind === b.kind ? a.need.lastAt.localeCompare(b.need.lastAt) : a.kind === "complaint" ? -1 : 1));
  }

  let emails: InboxEmail[] = [];
  if (opts.withEmails !== false && !opts.userId) {
    const { data } = await admin
      .from("email_inbound")
      .select("id, from_email, from_name, subject, body_text, received_at")
      .is("read_at", null)
      .is("archived_at", null)
      .order("received_at", { ascending: true })
      .limit(100);
    emails = (data ?? []).map((m) => ({
      id: m.id as string,
      fromEmail: String(m.from_email ?? ""),
      fromName: (m.from_name as string | null) ?? null,
      subject: String(m.subject ?? "(no subject)"),
      body: String(m.body_text ?? ""),
      receivedAt: String(m.received_at ?? ""),
    }));
  }
  return { ready, threads, emails };
}
