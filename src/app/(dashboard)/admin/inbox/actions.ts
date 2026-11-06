"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { replyToDoubt } from "@/app/(dashboard)/doubts/actions";
import { replyToInbound } from "@/app/(dashboard)/admin/emails/mail-actions";
import { noticeForThread } from "@/app/api/cron/doubt-followup/followup";

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
