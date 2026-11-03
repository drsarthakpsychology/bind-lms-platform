"use server";

import { revalidatePath } from "next/cache";
import { requireSession, requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { kindFor } from "@/lib/doubts/classify";
import { rateLimit } from "@/lib/rate-limit";

type R = { error: string | null; id?: string };
const clean = (s: string, max: number) => s.replace(/\s+/g, " ").trim().slice(0, max);

function refresh(id?: string) {
  revalidatePath("/doubts");
  if (id) revalidatePath(`/doubts/${id}`);
  revalidatePath("/admin");
}

/** Post a new doubt. If it reads like a complaint it's filed privately for the admin. */
export async function askDoubt(input: { title: string; body: string; topic?: string; cohortId?: string | null; markAs?: "doubt" | "complaint" }): Promise<R> {
  const me = await requireSession();
  if (!me) return { error: "Please sign in again." };
  if (!(await rateLimit(`doubt:${me.id}`, 20))) return { error: "Slow down a moment and try again." };
  const title = clean(input.title, 200);
  const body = clean(input.body, 5000);
  if (title.length < 3) return { error: "Write a short title for your doubt." };

  // The student picks their cohort implicitly: a doubt goes to the cohort they
  // belong to (the first one). Complaints carry no cohort — they go to the admin.
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
  refresh();
  return { error: null, id: data.id as string };
}

/** Answer someone's doubt. */
export async function replyToDoubt(doubtId: string, body: string): Promise<R> {
  const me = await requireSession();
  if (!me) return { error: "Please sign in again." };
  if (!(await rateLimit(`doubtreply:${me.id}`, 40))) return { error: "Slow down a moment and try again." };
  const text = clean(body, 5000);
  if (text.length < 1) return { error: "Write your answer first." };
  const { error } = await createAdminClient().from("doubt_replies").insert({ doubt_id: doubtId, user_id: me.id, body: text });
  if (error) return { error: "Couldn't post your answer. Try again." };
  refresh(doubtId);
  return { error: null };
}

/** "This helped" on an answer (toggles). */
export async function voteReply(doubtId: string, replyId: string, on: boolean): Promise<R> {
  const me = await requireSession();
  if (!me) return { error: "Please sign in again." };
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
  const admin = createAdminClient();
  const { data: d } = await admin.from("doubts").select("user_id").eq("id", doubtId).maybeSingle();
  if (!d) return { error: "That doubt is gone." };
  if (d.user_id !== me.id && me.role !== "admin") return { error: "Only the person who asked can mark it solved." };
  await admin.from("doubts").update({ solved_reply_id: replyId, status: replyId ? "solved" : "open", updated_at: new Date().toISOString() }).eq("id", doubtId);
  refresh(doubtId);
  return { error: null };
}

/** The asker turns their own post into a complaint for the admin (or back). */
export async function reclassifyMine(doubtId: string, kind: "doubt" | "complaint", cohortId: string | null): Promise<R> {
  const me = await requireSession();
  if (!me) return { error: "Please sign in again." };
  const admin = createAdminClient();
  const { data: d } = await admin.from("doubts").select("user_id").eq("id", doubtId).maybeSingle();
  if (!d || (d.user_id !== me.id && me.role !== "admin")) return { error: "You can only change your own post." };
  await admin.from("doubts").update({ kind, cohort_id: kind === "complaint" ? null : cohortId }).eq("id", doubtId);
  refresh(doubtId);
  return { error: null };
}

/** Admin: hide a post, or an answer, from the board. */
export async function adminHideDoubt(doubtId: string, hidden: boolean): Promise<R> {
  if (!(await requireAdmin())) return { error: "Not authorized." };
  await createAdminClient().from("doubts").update({ status: hidden ? "hidden" : "open" }).eq("id", doubtId);
  refresh(doubtId);
  return { error: null };
}
export async function adminHideReply(doubtId: string, replyId: string, hidden: boolean): Promise<R> {
  if (!(await requireAdmin())) return { error: "Not authorized." };
  await createAdminClient().from("doubt_replies").update({ hidden }).eq("id", replyId);
  refresh(doubtId);
  return { error: null };
}
