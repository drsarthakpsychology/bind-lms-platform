"use server";

import { revalidatePath } from "next/cache";
import { requireSession, requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { kindFor } from "@/lib/doubts/classify";
import { rateLimitWrite } from "@/lib/rate-limit";
import { notifyAdminsOfDoubt, notifyAskerOfReply } from "@/lib/notify/doubts";
import { canMarkSolved, canParticipate, isUuid, type DoubtRow } from "./visibility";

type R = { error: string | null; id?: string };
const clean = (s: string, max: number) => s.replace(/\s+/g, " ").trim().slice(0, max);

type Me = NonNullable<Awaited<ReturnType<typeof requireSession>>>;

/** Load a doubt and check the caller may see it (same rule as the thread page). */
async function loadVisibleDoubt(doubtId: string, me: Me): Promise<DoubtRow | null> {
  if (!isUuid(doubtId)) return null;
  const { data } = await createAdminClient().from("doubts").select("user_id, kind, status, cohort_id").eq("id", doubtId).maybeSingle();
  if (!data) return null;
  const d = data as DoubtRow;
  const isAdmin = me.role === "admin";
  const cohortIds = isAdmin ? [] : (await loadMyCohorts(me.id)).map((c) => c.id);
  return canParticipate(d, { id: me.id, isAdmin, cohortIds }) ? d : null;
}

/** A reply that belongs to this doubt and is not hidden. */
async function replyOnDoubt(replyId: string, doubtId: string): Promise<boolean> {
  if (!isUuid(replyId)) return false;
  const { data } = await createAdminClient().from("doubt_replies").select("doubt_id, hidden").eq("id", replyId).maybeSingle();
  return Boolean(data && data.doubt_id === doubtId && !data.hidden);
}

function refresh(id?: string) {
  revalidatePath("/doubts");
  if (id) revalidatePath(`/doubts/${id}`);
  revalidatePath("/admin");
}

/** Post a new doubt. If it reads like a complaint it's filed privately for the admin. */
export async function askDoubt(input: { title: string; body: string; topic?: string; cohortId?: string | null; markAs?: "doubt" | "complaint" }): Promise<R> {
  const me = await requireSession();
  if (!me) return { error: "Please sign in again." };
  if (!(await rateLimitWrite(`doubt:${me.id}`, 20))) return { error: "Slow down a moment and try again." };
  const title = clean(input.title, 200);
  const body = clean(input.body, 5000);
  if (title.length < 3) return { error: "Write a short title for your doubt." };

  // The student picks their cohort implicitly: a doubt goes to the cohort they
  // belong to (the first one). Complaints carry no cohort. They go to the admin.
  const cohorts = await loadMyCohorts(me.id);
  const kind = kindFor(title, body, input.markAs);
  const cohortId = kind === "complaint" ? null : (input.cohortId && cohorts.some((c) => c.id === input.cohortId) ? input.cohortId : cohorts[0]?.id ?? null);

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("doubts")
    .insert({ user_id: me.id, title, body, topic: input.topic ? clean(input.topic, 60) : null, kind, cohort_id: cohortId, status: "open" })
    .select("id")
    .single();
  if (error || !data) return { error: error?.code === "42P01" ? "The doubts board isn't set up yet. Ask your admin to run the new database step." : "Couldn't post it. Try again." };
  await notifyAdminsOfDoubt({ doubtId: data.id as string, title, body, kind, askerId: me.id });
  refresh();
  return { error: null, id: data.id as string };
}

/** Answer someone's doubt. */
export async function replyToDoubt(doubtId: string, body: string): Promise<R> {
  const me = await requireSession();
  if (!me) return { error: "Please sign in again." };
  if (!(await rateLimitWrite(`doubtreply:${me.id}`, 40))) return { error: "Slow down a moment and try again." };
  const text = clean(body, 5000);
  if (text.length < 1) return { error: "Write your answer first." };
  if (!(await loadVisibleDoubt(doubtId, me))) return { error: "That doubt isn't open to you." };
  const { error } = await createAdminClient().from("doubt_replies").insert({ doubt_id: doubtId, user_id: me.id, body: text });
  if (error) return { error: "Couldn't post your answer. Try again." };
  await notifyAskerOfReply({ doubtId, replierId: me.id, body: text });
  refresh(doubtId);
  return { error: null };
}

/** "This helped" on an answer (toggles). */
export async function voteReply(doubtId: string, replyId: string, on: boolean): Promise<R> {
  const me = await requireSession();
  if (!me) return { error: "Please sign in again." };
  if (!(await rateLimitWrite(`doubtvote:${me.id}`, 60))) return { error: "Slow down a moment and try again." };
  if (!(await loadVisibleDoubt(doubtId, me)) || !(await replyOnDoubt(replyId, doubtId))) return { error: "That answer isn't open to you." };
  const admin = createAdminClient();
  if (on) await admin.from("doubt_votes").upsert({ reply_id: replyId, user_id: me.id }, { onConflict: "reply_id,user_id", ignoreDuplicates: true });
  else await admin.from("doubt_votes").delete().eq("reply_id", replyId).eq("user_id", me.id);
  refresh(doubtId);
  return { error: null };
}

/** The asker (or admin) marks an answer as the one that solved it. */
export async function markSolved(doubtId: string, replyId: string | null): Promise<R> {
  const me = await requireSession();
  if (!me) return { error: "Please sign in again." };
  if (!isUuid(doubtId)) return { error: "That doubt is gone." };
  const admin = createAdminClient();
  const { data: d } = await admin.from("doubts").select("user_id, status").eq("id", doubtId).maybeSingle();
  if (!d) return { error: "That doubt is gone." };
  if (!canMarkSolved(d, { id: me.id, isAdmin: me.role === "admin" })) {
    return { error: d.status === "hidden" ? "That doubt is gone." : "Only the person who asked can mark it solved." };
  }
  if (replyId !== null && !(await replyOnDoubt(replyId, doubtId))) return { error: "That answer isn't on this doubt." };
  await admin.from("doubts").update({ solved_reply_id: replyId, status: replyId ? "solved" : "open", updated_at: new Date().toISOString() }).eq("id", doubtId);
  refresh(doubtId);
  return { error: null };
}

/** The asker turns their own post into a complaint for the admin (or back). */
export async function reclassifyMine(doubtId: string, kind: "doubt" | "complaint", cohortId: string | null): Promise<R> {
  const me = await requireSession();
  if (!me) return { error: "Please sign in again." };
  if (!isUuid(doubtId) || (kind !== "doubt" && kind !== "complaint")) return { error: "You can only change your own post." };
  const admin = createAdminClient();
  const { data: d } = await admin.from("doubts").select("user_id").eq("id", doubtId).maybeSingle();
  if (!d || (d.user_id !== me.id && me.role !== "admin")) return { error: "You can only change your own post." };
  // Only a cohort the caller belongs to (admins: any); otherwise their first
  // cohort, like askDoubt.
  let cohort: string | null = null;
  if (kind === "doubt") {
    if (me.role === "admin") cohort = cohortId && isUuid(cohortId) ? cohortId : null;
    else {
      const mine = await loadMyCohorts(me.id);
      cohort = cohortId && mine.some((c) => c.id === cohortId) ? cohortId : (mine[0]?.id ?? null);
    }
  }
  await admin.from("doubts").update({ kind, cohort_id: cohort }).eq("id", doubtId);
  refresh(doubtId);
  return { error: null };
}

/** Admin: hide a post, or an answer, from the board. */
export async function adminHideDoubt(doubtId: string, hidden: boolean): Promise<R> {
  if (!(await requireSuperAdmin())) return { error: "Not authorized." };
  await createAdminClient().from("doubts").update({ status: hidden ? "hidden" : "open" }).eq("id", doubtId);
  refresh(doubtId);
  return { error: null };
}
export async function adminHideReply(doubtId: string, replyId: string, hidden: boolean): Promise<R> {
  if (!(await requireSuperAdmin())) return { error: "Not authorized." };
  await createAdminClient().from("doubt_replies").update({ hidden }).eq("id", replyId);
  refresh(doubtId);
  return { error: null };
}
