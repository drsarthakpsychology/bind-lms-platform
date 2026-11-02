"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { logEmailSend, sendResendEmail } from "@/lib/auth/roster";

/** Reply to an inbound email (plain text), log it, and mark the thread read. */
export async function replyToInbound(id: string, text: string): Promise<{ error: string | null }> {
  const me = await requireAdmin();
  if (!me) return { error: "Not authorized." };
  const body = text.trim();
  if (!body) return { error: "Write a reply first." };
  const admin = createAdminClient();
  const { data: msg } = await admin.from("email_inbound").select("from_email, from_name, subject").eq("id", id).maybeSingle();
  if (!msg) return { error: "That email is gone." };
  const subject = String(msg.subject ?? "").startsWith("Re:") ? String(msg.subject) : `Re: ${msg.subject ?? ""}`.trim();
  const res = await sendResendEmail(msg.from_email as string, subject, body);
  await logEmailSend(admin, {
    recipient: msg.from_email as string,
    name: (msg.from_name as string) ?? null,
    subject,
    templateId: "reply",
    status: res.ok ? "sent" : "failed",
    errorReason: res.ok ? null : (res.error ?? "Send failed."),
    sentAt: res.ok ? new Date().toISOString() : null,
    sentBy: me.id,
    providerId: res.id ?? null,
    bodyText: body,
  });
  if (!res.ok) return { error: res.error ?? "Send failed." };
  await admin.from("email_inbound").update({ read_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/emails");
  return { error: null };
}

/** Archive (E) or move back to the inbox. */
export async function setArchived(id: string, archived: boolean): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };
  const admin = createAdminClient();
  await admin.from("email_inbound").update({ archived_at: archived ? new Date().toISOString() : null }).eq("id", id);
  revalidatePath("/admin/emails");
  return { error: null };
}

/** Mark an inbound email read (when it's opened in the reading pane). */
export async function markRead(id: string): Promise<void> {
  if (!(await requireAdmin())) return;
  const admin = createAdminClient();
  await admin.from("email_inbound").update({ read_at: new Date().toISOString() }).eq("id", id).is("read_at", null);
}
