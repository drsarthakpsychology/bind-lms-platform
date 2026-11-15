import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Which respondents of a form have been emailed from it, read back from the
 * email log (email_sends, template id "form:<id>").
 */
export const formTemplateId = (formId: string) => `form:${formId}`;

export type EmailedMark = { lastSentAt: string | null; sent: number; waiting: number; failed: number };

/** Fold log rows into one mark per address. Pure (tested). */
export function foldEmailed(rows: Array<{ recipient: string | null; status: string | null; sent_at: string | null; created_at: string | null }>): Record<string, EmailedMark> {
  const out: Record<string, EmailedMark> = {};
  for (const r of rows) {
    const e = String(r.recipient ?? "").trim().toLowerCase();
    if (!e) continue;
    const m = (out[e] ??= { lastSentAt: null, sent: 0, waiting: 0, failed: 0 });
    if (r.status === "pending") m.waiting++;
    else if (r.status === "failed" || r.status === "bounced") m.failed++;
    else {
      m.sent++;
      const at = r.sent_at ?? r.created_at;
      if (at && (!m.lastSentAt || at > m.lastSentAt)) m.lastSentAt = at;
    }
  }
  return out;
}

export async function loadFormEmailed(admin: SupabaseClient, formId: string): Promise<{ marks: Record<string, EmailedMark>; waiting: number }> {
  const { data, error } = await admin.from("email_sends").select("recipient, status, sent_at, created_at").eq("template_id", formTemplateId(formId)).limit(20000);
  if (error) return { marks: {}, waiting: 0 };
  const marks = foldEmailed(data ?? []);
  return { marks, waiting: Object.values(marks).reduce((n, m) => n + m.waiting, 0) };
}
