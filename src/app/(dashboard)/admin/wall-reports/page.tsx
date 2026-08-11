import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { WallReportsList } from "./wall-reports-list";

export const dynamic = "force-dynamic";

/**
 * /admin/wall-reports — the reported-content queue. Students report a post
 * or reply (wall_reports, open status); faculty resolves each. The queue
 * shows the reported content + reason; resolving sets status → resolved.
 */
export default async function AdminWallReportsPage() {
  const admin = createAdminClient();

  const { data: reports } = await admin
    .from("wall_reports")
    .select("id, post_id, reply_id, reason, status, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: true })
    .limit(20);

  // Load the reported content (posts + replies by id).
  const postIds = [...new Set((reports ?? []).map((r) => r.post_id).filter(Boolean))];
  const replyIds = [...new Set((reports ?? []).map((r) => r.reply_id).filter(Boolean))];

  const [{ data: posts }, { data: replies }] = await Promise.all([
    postIds.length
      ? admin.from("wall_posts").select("id, content").in("id", postIds)
      : Promise.resolve({ data: [] }),
    replyIds.length
      ? admin.from("wall_replies").select("id, content").in("id", replyIds)
      : Promise.resolve({ data: [] }),
  ]);

  const contentByPost = new Map((posts ?? []).map((p) => [p.id, String(p.content)]));
  const contentByReply = new Map((replies ?? []).map((r) => [r.id, String(r.content)]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Reported wall content"
        description="Students flagged these. Resolve each — or dismiss the report if the content stands."
      />
      <div className="mt-6">
        <WallReportsList
          reports={(reports ?? []).map((r) => ({
            id: r.id,
            content: r.reply_id
              ? contentByReply.get(r.reply_id) ?? "(reply removed)"
              : contentByPost.get(r.post_id) ?? "(post removed)",
            reason: (r.reason as string | null) ?? "No reason given",
            createdAt: r.created_at,
          }))}
        />
      </div>
    </div>
  );
}