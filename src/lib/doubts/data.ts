import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/learn/leaderboard";

export type DoubtListItem = {
  id: string;
  title: string;
  topic: string | null;
  kind: "doubt" | "complaint";
  status: "open" | "solved" | "hidden";
  cohortId: string | null;
  author: string;
  mine: boolean;
  replies: number;
  createdAt: string;
};

export type DoubtReply = {
  id: string;
  author: string;
  mine: boolean;
  body: string;
  votes: number;
  youVoted: boolean;
  isSolution: boolean;
  createdAt: string;
};

export type DoubtThread = {
  id: string;
  title: string;
  body: string;
  topic: string | null;
  kind: "doubt" | "complaint";
  status: "open" | "solved" | "hidden";
  cohortId: string | null;
  author: string;
  mine: boolean;
  createdAt: string;
  replies: DoubtReply[];
};

const nameOf = (p: { name?: string | null; email?: string | null } | undefined) => (p ? displayName(p.name ?? null, String(p.email ?? "")) : "A student");

/** True when the doubts tables exist yet. */
export async function doubtsReady(): Promise<boolean> {
  const { error } = await createAdminClient().from("doubts").select("id").limit(1);
  return !error;
}

/**
 * The board a student sees: open doubts from their cohort(s) (and the shared
 * ones with no cohort), plus their own complaints. Complaints from other
 * people are never shown. Admins see everything for the chosen cohort.
 */
export async function loadDoubts(opts: { userId: string; isAdmin: boolean; cohortIds: string[]; cohortFilter?: string | null }): Promise<DoubtListItem[]> {
  const admin = createAdminClient();
  let q = admin.from("doubts").select("id, title, topic, kind, status, cohort_id, user_id, created_at").order("created_at", { ascending: false }).limit(300);
  if (opts.isAdmin && opts.cohortFilter) q = q.eq("cohort_id", opts.cohortFilter);
  const { data: doubts, error } = await q;
  if (error) return [];
  const rows = (doubts ?? []).filter((d) => {
    if (opts.isAdmin) return true;
    if (d.status === "hidden") return false;
    const mine = d.user_id === opts.userId;
    if (d.kind === "complaint") return mine; // complaints stay private
    const inCohort = d.cohort_id === null || opts.cohortIds.includes(d.cohort_id as string);
    return mine || inCohort;
  });
  const ids = rows.map((d) => d.id as string);
  const authorIds = [...new Set(rows.map((d) => d.user_id as string))];
  const [{ data: profiles }, { data: replies }] = await Promise.all([
    authorIds.length ? admin.from("profiles").select("id, name, email").in("id", authorIds) : Promise.resolve({ data: [] as { id: string; name: string | null; email: string | null }[] }),
    ids.length ? admin.from("doubt_replies").select("doubt_id").in("doubt_id", ids) : Promise.resolve({ data: [] as { doubt_id: string }[] }),
  ]);
  const prof = new Map((profiles ?? []).map((p) => [p.id, p]));
  const replyCount = new Map<string, number>();
  for (const r of replies ?? []) replyCount.set(r.doubt_id as string, (replyCount.get(r.doubt_id as string) ?? 0) + 1);
  return rows.map((d) => ({
    id: d.id as string,
    title: d.title as string,
    topic: (d.topic as string | null) ?? null,
    kind: (d.kind as "doubt" | "complaint") ?? "doubt",
    status: (d.status as "open" | "solved" | "hidden") ?? "open",
    cohortId: (d.cohort_id as string | null) ?? null,
    author: nameOf(prof.get(d.user_id as string)),
    mine: d.user_id === opts.userId,
    replies: replyCount.get(d.id as string) ?? 0,
    createdAt: d.created_at as string,
  }));
}

/** One thread, with its answers. Returns null if the viewer may not see it. */
export async function loadDoubt(id: string, opts: { userId: string; isAdmin: boolean; cohortIds: string[] }): Promise<DoubtThread | null> {
  const admin = createAdminClient();
  const { data: d } = await admin.from("doubts").select("id, title, body, topic, kind, status, cohort_id, user_id, solved_reply_id, created_at").eq("id", id).maybeSingle();
  if (!d) return null;
  const mine = d.user_id === opts.userId;
  if (!opts.isAdmin) {
    if (d.status === "hidden" && !mine) return null;
    if (d.kind === "complaint" && !mine) return null;
    if (d.kind === "doubt" && !mine && d.cohort_id !== null && !opts.cohortIds.includes(d.cohort_id as string)) return null;
  }
  const { data: replies } = await admin.from("doubt_replies").select("id, user_id, body, hidden, created_at").eq("doubt_id", id).order("created_at", { ascending: true });
  const replyIds = (replies ?? []).map((r) => r.id as string);
  const authorIds = [...new Set([d.user_id as string, ...(replies ?? []).map((r) => r.user_id as string)])];
  const [{ data: profiles }, { data: votes }] = await Promise.all([
    admin.from("profiles").select("id, name, email").in("id", authorIds),
    replyIds.length ? admin.from("doubt_votes").select("reply_id, user_id").in("reply_id", replyIds) : Promise.resolve({ data: [] as { reply_id: string; user_id: string }[] }),
  ]);
  const prof = new Map((profiles ?? []).map((p) => [p.id, p]));
  const voteCount = new Map<string, number>();
  const mineVote = new Set<string>();
  for (const v of votes ?? []) {
    voteCount.set(v.reply_id as string, (voteCount.get(v.reply_id as string) ?? 0) + 1);
    if (v.user_id === opts.userId) mineVote.add(v.reply_id as string);
  }
  return {
    id: d.id as string,
    title: d.title as string,
    body: (d.body as string) ?? "",
    topic: (d.topic as string | null) ?? null,
    kind: (d.kind as "doubt" | "complaint") ?? "doubt",
    status: (d.status as "open" | "solved" | "hidden") ?? "open",
    cohortId: (d.cohort_id as string | null) ?? null,
    author: nameOf(prof.get(d.user_id as string)),
    mine,
    createdAt: d.created_at as string,
    replies: (replies ?? [])
      .filter((r) => !r.hidden || opts.isAdmin)
      .map((r) => ({
        id: r.id as string,
        author: nameOf(prof.get(r.user_id as string)),
        mine: r.user_id === opts.userId,
        body: r.body as string,
        votes: voteCount.get(r.id as string) ?? 0,
        youVoted: mineVote.has(r.id as string),
        isSolution: d.solved_reply_id === r.id,
        createdAt: r.created_at as string,
      })),
  };
}

/** How many complaints are waiting for the admin. */
export async function openComplaintCount(): Promise<number> {
  const { count, error } = await createAdminClient().from("doubts").select("id", { count: "exact", head: true }).eq("kind", "complaint").eq("status", "open");
  return error ? 0 : count ?? 0;
}
