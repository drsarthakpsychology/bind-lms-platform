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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const isFacultyViewer = profile?.role === "admin";

  // The wall view (view) shows all posts but nulls author_id for anonymous posts.
  const { data: posts } = await supabase
    .from("wall_posts_visible")
    .select("id, content, is_anonymous, is_faculty, is_pinned, created_at, author_id")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  // Replies + reactions per post (reactions-not-upvotes: they signal, never rank).
  const postIds = (posts ?? []).map((p) => p.id);
  const [{ data: replies }, { data: reactions }] = await Promise.all([
    postIds.length
      ? supabase.from("wall_replies_visible").select("id, post_id, content, is_anonymous, is_faculty, created_at, author_id").in("post_id", postIds).order("created_at", { ascending: true })
      : Promise.resolve({ data: [] }),
    postIds.length
      ? supabase.from("wall_reactions").select("post_id, reaction").in("post_id", postIds)
      : Promise.resolve({ data: [] }),
  ]);

  const repliesByPost = new Map<string, Array<Record<string, unknown>>>();
  for (const r of replies ?? []) {
    const list = repliesByPost.get(r.post_id) ?? [];
    list.push(r);
    repliesByPost.set(r.post_id, list);
  }
  const reactionsByPost = new Map<string, Record<string, number>>();
  for (const r of reactions ?? []) {
    const key = String(r.post_id);
    const counts = reactionsByPost.get(key) ?? {};
    const rk = String(r.reaction);
    counts[rk] = (counts[rk] ?? 0) + 1;
    reactionsByPost.set(key, counts);
  }

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
          isFacultyViewer={isFacultyViewer}
          initialPosts={(posts ?? []).map((p) => ({
            id: p.id,
            content: String(p.content),
            isAnonymous: p.is_anonymous as boolean,
            isFaculty: p.is_faculty as boolean,
            isPinned: p.is_pinned as boolean,
            createdAt: p.created_at,
            // NOTE: author_id is deliberately NOT passed to the client for
            // anonymous posts — it stays server-side.
            replies: (repliesByPost.get(p.id) ?? []).map((r) => ({
              id: String(r.id),
              content: String(r.content),
              isAnonymous: Boolean(r.is_anonymous),
              isFaculty: Boolean(r.is_faculty),
              createdAt: r.created_at as string,
            })),
            reactions: reactionsByPost.get(p.id) ?? {},
          }))}
        />
      </div>
    </div>
  );
}
