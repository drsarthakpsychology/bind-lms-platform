import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { AdminWallReports } from "./contract-practise-admin";

/**
 * The class wall's open reports for the app, read as the website's
 * /admin/wall-reports page reads them: oldest first, at most 50, each with the
 * reported post or reply text. A missing table reads as no reports.
 */
export async function loadWallReports(): Promise<AdminWallReports> {
  const admin = createAdminClient();
  const { data: reports, error } = await admin.from("wall_reports").select("id, post_id, reply_id, reason, status, created_at").eq("status", "open").order("created_at", { ascending: true }).limit(50);
  if (error || !reports?.length) return { v: 1, items: [] };
  const postIds = [...new Set(reports.map((r) => r.post_id).filter(Boolean))] as string[];
  const replyIds = [...new Set(reports.map((r) => r.reply_id).filter(Boolean))] as string[];
  const [posts, replies] = await Promise.all([
    postIds.length ? admin.from("wall_posts").select("id, content").in("id", postIds) : Promise.resolve({ data: [] as { id: string; content: string }[] }),
    replyIds.length ? admin.from("wall_replies").select("id, content").in("id", replyIds) : Promise.resolve({ data: [] as { id: string; content: string }[] }),
  ]);
  const post = new Map((posts.data ?? []).map((p) => [String(p.id), String(p.content)]));
  const reply = new Map((replies.data ?? []).map((p) => [String(p.id), String(p.content)]));
  return {
    v: 1,
    items: reports.map((r) => ({
      id: String(r.id),
      kind: r.reply_id ? ("reply" as const) : ("post" as const),
      content: r.reply_id ? (reply.get(String(r.reply_id)) ?? "(reply removed)") : (post.get(String(r.post_id)) ?? "(post removed)"),
      reason: (r.reason as string | null) || "No reason given",
      createdAt: String(r.created_at),
    })),
  };
}

/** Close one report (the post stays on the wall), as POST /api/admin/wall-reports. */
export async function resolveWallReport(id: string): Promise<boolean> {
  const { error } = await createAdminClient().from("wall_reports").update({ status: "resolved" }).eq("id", id);
  return !error;
}
