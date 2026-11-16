import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * What was sent to one student and what came back: emails to them, their
 * email replies, and bell notifications. The student page's Messages tab and
 * the app's GET /admin/students/:id/messages both read this.
 */
export type StudentMail = { id: string; subject: string; status: string; createdAt: string; openedAt: string | null };
export type StudentReply = { id: string; subject: string; receivedAt: string };
export type StudentNote = { id: string; title: string; type: string | null; createdAt: string; readAt: string | null };
export type StudentMessages = { mails: StudentMail[]; replies: StudentReply[]; notes: StudentNote[] };

export async function loadStudentMessages(admin: SupabaseClient, id: string, email: string): Promise<StudentMessages> {
  const [mails, notes, inbound] = await Promise.all([
    email ? admin.from("email_sends").select("id, subject, status, template_id, created_at, opened_at").ilike("recipient", email).order("created_at", { ascending: false }).limit(50) : Promise.resolve({ data: [] }),
    admin.from("notifications").select("id, title, type, created_at, read_at").eq("user_id", id).order("created_at", { ascending: false }).limit(50),
    email ? admin.from("email_inbound").select("id, subject, received_at").ilike("from_email", email).order("received_at", { ascending: false }).limit(20) : Promise.resolve({ data: [] }),
  ]);
  const rows = (r: { data: unknown }) => ((r.data ?? []) as Record<string, unknown>[]);
  return {
    mails: rows(mails).map((m) => ({ id: String(m.id), subject: String(m.subject ?? ""), status: String(m.status ?? ""), createdAt: String(m.created_at), openedAt: (m.opened_at as string | null) ?? null })),
    replies: rows(inbound).map((m) => ({ id: String(m.id), subject: String(m.subject ?? "(no subject)"), receivedAt: String(m.received_at) })),
    notes: rows(notes).map((n) => ({ id: String(n.id), title: String(n.title ?? ""), type: (n.type as string | null) ?? null, createdAt: String(n.created_at), readAt: (n.read_at as string | null) ?? null })),
  };
}
