import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { NotificationList, NotificationRow } from "./contract";
import { toAppTarget } from "./target";

/**
 * The bell list for the app: the same rows as the website's /notifications
 * page (the student's own, newest first, read with their own client so row
 * level security applies), paged by offset.
 */
type Row = { id: string; type: string | null; title: string | null; body: string | null; href: string | null; read_at: string | null; created_at: string };

export function notificationRow(r: Row): NotificationRow {
  return {
    id: r.id,
    type: r.type ?? "message",
    title: r.title ?? "",
    body: String(r.body ?? "").slice(0, 500),
    createdAt: r.created_at,
    readAt: r.read_at,
    // A bell row opens its own page unless it points somewhere else (achievements, a certificate).
    target: toAppTarget(r.href && !r.href.startsWith("/notifications") ? r.href : `/notifications/${r.id}`),
  };
}

export async function listNotifications(userId: string, limit: number, cursor: string | null): Promise<NotificationList> {
  const supabase = await createClient();
  const start = cursor && /^\d{1,6}$/.test(cursor) ? Number(cursor) : 0;
  const [{ data }, { count }] = await Promise.all([
    supabase
      .from("notifications")
      .select("id, type, title, body, href, read_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(start, start + limit),
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).is("read_at", null),
  ]);
  const rows = (data ?? []) as Row[];
  return { items: rows.slice(0, limit).map(notificationRow), nextCursor: rows.length > limit ? String(start + limit) : null, unread: count ?? 0 };
}
