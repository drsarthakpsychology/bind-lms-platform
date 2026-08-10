import { createClient } from "@/lib/supabase/server";
import { WallView } from "./wall-view";

export const dynamic = "force-dynamic";

/**
 * /wall — Cohort Wall (Part 6.11). Threaded, anonymous-post toggle.
 * Anonymous posts never expose author_id to non-admins (RLS hides it).
 */
export default async function WallPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // The wall SELECT policy hides author_id for anonymous posts to non-admins.
  const { data: posts } = await supabase
    .from("wall_posts")
    .select("id, content, is_anonymous, is_faculty, is_pinned, created_at, author_id")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Cohort wall</p>
      <h1 className="mt-1 text-h1">The wall</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Threaded discussion. Post anonymously if you&apos;d rather — peers never see who wrote
        it.
      </p>

      <div className="mt-6">
        <WallView
          initialPosts={(posts ?? []).map((p) => ({
            id: p.id,
            content: String(p.content),
            isAnonymous: p.is_anonymous as boolean,
            isFaculty: p.is_faculty as boolean,
            isPinned: p.is_pinned as boolean,
            createdAt: p.created_at,
            // NOTE: author_id is deliberately NOT passed to the client for
            // anonymous posts — it stays server-side.
          }))}
        />
      </div>
    </div>
  );
}
