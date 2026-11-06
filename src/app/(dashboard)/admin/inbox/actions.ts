"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { replyToDoubt } from "@/app/(dashboard)/doubts/actions";
import { replyToInbound } from "@/app/(dashboard)/admin/emails/mail-actions";
import { noticeForThread } from "@/app/api/cron/doubt-followup/followup";
import { isUuid } from "@/app/(dashboard)/doubts/visibility";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { aiChat } from "@/lib/ai/client";
import { AiGuardError, guardStudentCall } from "@/lib/ai/guards";
import { AiUnavailableError } from "@/lib/ai/router";

type R = { error: string | null };

/**
 * Reply to a doubt from the Inbox (or a student's profile). Reuses the one
 * doubt reply action, so the same rate limit, visibility rule and table write
 * apply as on the thread page. Super Admin only (View Admins read). The
 * student gets an in-app notice right away.
 */
export async function replyFromInbox(doubtId: string, body: string): Promise<R> {
  if (!(await requireSuperAdmin())) return { error: "Only the Super Admin can reply." };
  const res = await replyToDoubt(doubtId, body);
  if (res.error) return { error: res.error };
  // The student's in-app notice, straight after the reply lands (the email,
  // if it's still unopened in 48 h, comes from the daily follow-up run).
  after(() => noticeForThread(doubtId));
  revalidatePath("/admin/inbox");
  revalidatePath("/admin/doubts");
  return { error: null };
}

/** Reply to an emailed student reply from the Inbox (same sender as Messages). */
export async function replyEmailFromInbox(id: string, text: string): Promise<R> {
  const res = await replyToInbound(id, text);
  if (!res.error) revalidatePath("/admin/inbox");
  return res;
}

/**
 * "Draft with AI" (owner decision 47: AI drafts, the admin approves and
 * sends). Returns text for the reply box only; it never posts or sends. Uses
 * the platform's one AI client with the knowledge_tutor workload, so the
 * student's question only goes to a provider that doesn't train on data.
 */
export async function draftDoubtAnswer(doubtId: string): Promise<{ error: string | null; text?: string }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Only the Super Admin can draft replies." };
  if (!isUuid(doubtId)) return { error: "That doubt is gone." };
  if (!(await rateLimit(`doubtdraft:${me.id}`, 30))) return { error: "Too many drafts in a row. Wait a minute." };
  const admin = createAdminClient();
  const { data: d } = await admin.from("doubts").select("title, body, kind, topic").eq("id", doubtId).maybeSingle();
  if (!d) return { error: "That doubt is gone." };
  const { data: replies } = await admin.from("doubt_replies").select("body, user_id, hidden, created_at").eq("doubt_id", doubtId).order("created_at", { ascending: true }).limit(20);
  const thread = (replies ?? [])
    .filter((r) => !r.hidden)
    .map((r, i) => `Reply ${i + 1}: ${String(r.body ?? "").slice(0, 1500)}`)
    .join("\n\n");
  const ask = [
    `Title: ${String(d.title ?? "")}`,
    d.topic ? `Topic: ${String(d.topic)}` : "",
    `Question: ${String(d.body ?? "").slice(0, 4000)}`,
    thread ? `\nThe conversation so far:\n${thread}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    guardStudentCall("knowledge_tutor", { enabled: process.env.AI_ENABLED !== "false" });
    const res = await aiChat(
      [
        { role: "system", content: d.kind === "complaint" ? DRAFT_CONCERN : DRAFT_DOUBT },
        { role: "user", content: ask },
      ],
      { workload: "knowledge_tutor", taskTier: "normal", maxTokens: 600, temperature: 0.4 },
    );
    const text = res.text.trim();
    if (!text) return { error: "The AI gave an empty draft. Try again or write your own." };
    return { error: null, text };
  } catch (e) {
    if (e instanceof AiGuardError || e instanceof AiUnavailableError) return { error: "AI drafts aren't available right now. Write your reply yourself." };
    console.error("[doubt-draft]", e);
    return { error: "Couldn't make a draft. Try again or write your own." };
  }
}

const DRAFT_DOUBT =
  "You draft replies for a teacher at VIBHA School of Psychology (India) answering a student's doubt in clinical psychology. " +
  "Write in plain, warm English a student can follow. Answer the actual question in 80-200 words; explain hard words in brackets. " +
  "Where it matters, say what DSM-5-TR says and add a short 'ICD-11 says' note if it differs. " +
  "Never invent citations, page numbers, doses or statistics; if unsure, say what to check. No diagnosis of real people. " +
  "If the message hints at the student's own distress or risk, say gently that the team will reach out and suggest talking to someone they trust. " +
  "Write only the reply text, with no greeting line about being an AI. The teacher will edit it before sending.";

const DRAFT_CONCERN =
  "You draft replies for the VIBHA School of Psychology team answering a student's private concern. " +
  "Be kind, brief (60-150 words) and specific: acknowledge the concern, say what the team will do next, and ask one question if something is unclear. " +
  "Promise nothing you cannot know (dates, refunds, decisions). If the message hints at distress or risk, respond with care and suggest a call. " +
  "Write only the reply text. The team will edit it before sending.";
