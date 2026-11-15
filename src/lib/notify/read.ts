import "server-only";
import type { Profile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { sanitizeRich, textToHtml } from "@/lib/email/rich-html";

/**
 * Open one bell notification: only its owner (or the super admin) may, and
 * opening it as the owner marks it read and opened. Shared by the website's
 * /notifications/[id] page and the app's GET /api/app/v1/notifications/:id.
 */
export type OpenedNotification = {
  row: Record<string, unknown> & { id: string; user_id: string; title: string; created_at: string };
  justRead: boolean;
  /** "From the VIBHA team", or the batchmate who answered a doubt. */
  from: string;
  /** The message, cleaned to the small set of allowed tags. */
  html: string;
};

export async function openNotification(profile: Pick<Profile, "id" | "role">, id: string): Promise<OpenedNotification | null> {
  const admin = createAdminClient();
  const { data: n } = await admin.from("notifications").select("*").eq("id", id).maybeSingle();
  if (!n || (n.user_id !== profile.id && profile.role !== "admin")) return null;

  const justRead = n.user_id === profile.id && !n.read_at;
  if (justRead) {
    const now = new Date().toISOString();
    const r = await admin.from("notifications").update({ read_at: now, opened_at: now }).eq("id", id);
    if (r.error) await admin.from("notifications").update({ read_at: now }).eq("id", id);
  }
  // Doubt answers come from batchmates, not the team: say who it is from.
  let from = "From the VIBHA team";
  if (n.sent_by && n.sent_by !== n.user_id) {
    const { data: who } = await admin.from("profiles").select("role, name").eq("id", n.sent_by).maybeSingle();
    if (who && who.role !== "admin" && who.role !== "view_admin") from = typeof who.name === "string" && who.name.trim() ? `From ${who.name.trim()}` : "From your batch";
  }
  const html = sanitizeRich((n.body_html as string | null) ?? textToHtml(String(n.body ?? "")));
  return { row: n as OpenedNotification["row"], justRead, from, html };
}
