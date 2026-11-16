import { createClient } from "@/lib/supabase/server";
import { loadWall } from "@/lib/wall/data";
import { Reveal } from "@/components/motion/reveal";
import { WallView } from "./wall-view";
import { PageFrame, BackLink } from "@/components/ds";
import { requireSession } from "@/lib/auth/guards";
import { uiV2Role } from "@/lib/ui/v2-server";

export const dynamic = "force-dynamic";

/**
 * /wall: Cohort Wall (Part 6.11). Threaded, anonymous-post toggle.
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

  // Posts, replies and reaction counts (src/lib/wall/data.ts, shared with the app).
  // author_id is deliberately NOT passed to the client: it stays server-side.
  const posts = await loadWall();

  if (await uiV2Role((await requireSession())?.role)) {
    return (
      <PageFrame className="gap-4 md:gap-6">
        <BackLink href="/doubts">Doubts</BackLink>
        <header className="flex min-w-0 flex-col gap-1 pb-2">
          <h1 className="type-h1">Wall</h1>
          <p className="type-small text-muted-foreground">Posts from your batch. You can post without your name.</p>
        </header>
        <WallView
          v2
          isFacultyViewer={isFacultyViewer}
          initialPosts={posts}
        />
      </PageFrame>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Reveal delay={0.05}>
        <p className="text-eyebrow text-muted-foreground">Cohort wall</p>
        <h1 className="mt-1 text-h1">The wall</h1>
        <p className="mt-1 text-small text-muted-foreground">
          Threaded discussion. Post anonymously if you&apos;d rather: peers never see who wrote
          it.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-6">
        <WallView
          isFacultyViewer={isFacultyViewer}
          initialPosts={posts}
        />
      </Reveal>
    </div>
  );
}
