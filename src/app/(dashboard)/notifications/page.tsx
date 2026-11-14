import { Award, Bell, MessageSquare, ShieldAlert, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/format";
import { MobilePage } from "@/components/mobile/mobile-page";
import { PageHeader } from "@/components/design-system/page-header";
import { MobileSection } from "@/components/mobile/mobile-section";
import { MobileListItem } from "@/components/mobile/mobile-list-item";
import { EmptyState } from "@/components/design-system/empty-state";
import { cn } from "@/lib/utils";
import { markAllNotificationsRead } from "./actions";

/**
 * /notifications: derived wall feed (T42) plus persisted achievement and
 * certificate notifications (unread state + mark-as-read).
 */

type ReplyItem = { id: string; post_content: string; reply_content: string; is_faculty: boolean; created_at: string };
type WallReplyRow = { id: string; content: string; is_faculty: boolean; created_at: string };

export default async function NotificationsPage() {
  const session = await getSession();
  if (session.status !== "ok") return null;

  const supabase = await createClient();
  const { id: userId, role } = session.profile;

  // Persisted achievement + certificate notifications (own, latest first).
  const { data: notes } = await supabase
    .from("notifications")
    .select("id, type, title, body, href, read_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);
  const unread = (notes ?? []).filter((n) => !n.read_at).length;

  const { data: replies } = await supabase
    .from("wall_posts")
    .select("content, wall_replies(id, content, is_faculty, created_at)")
    .eq("author_id", userId)
    .eq("is_anonymous", false)
    .not("wall_replies", "is", "null")
    .order("created_at", { ascending: false })
    .limit(20);

  const replyItems: ReplyItem[] =
    (replies ?? []).flatMap((p) =>
      ((p.wall_replies as WallReplyRow[] | null) ?? []).map((r) => ({
        id: r.id,
        post_content: p.content,
        reply_content: r.content,
        is_faculty: r.is_faculty,
        created_at: r.created_at,
      })),
    ).sort((a, b) => b.created_at.localeCompare(a.created_at));

  const isAdmin = role === "admin";
  const reportsQuery = isAdmin
    ? await supabase.from("wall_reports").select("id, post_id, reply_id, reason, created_at").eq("status", "open").order("created_at", { ascending: false }).limit(20)
    : null;
  const reports = reportsQuery?.data ?? [];

  // Messages from the VIBHA team (and nudges) vs achievements.
  const messages = (notes ?? []).filter((n) => n.type === "message" || n.type === "nudge");
  const achievements = (notes ?? []).filter((n) => n.type === "badge" || n.type === "certificate");
  const hasNotes = (notes ?? []).length > 0;
  const hasStudent = replyItems.length > 0;
  const hasAdmin = reports.length > 0;

  return (
    <MobilePage inset={false}>
      <PageHeader
        title="Notifications"
        className="flex-row items-center justify-between pb-0"
        actions={
          unread > 0 ? (
            <form action={markAllNotificationsRead}>
              <button type="submit" className="inline-flex min-h-10 items-center whitespace-nowrap rounded-md border-2 border-foreground bg-card px-3 text-sm font-semibold active:translate-y-px pointer-coarse:min-h-11">
                Mark all read
              </button>
            </form>
          ) : undefined
        }
      />
      <div className="flex flex-col gap-6 pt-4">
        {!hasNotes && !hasStudent && !hasAdmin ? (
          <EmptyState
            icon={<Bell className="size-5" aria-hidden />}
            title="Nothing needs your attention"
            description="Messages from the VIBHA team, achievements you earn and replies to your wall posts appear here."
          />
        ) : (
          <>
            {messages.length ? (
              <MobileSection title="From the VIBHA team" description={messages.some((n) => !n.read_at) ? `${messages.filter((n) => !n.read_at).length} new` : "Tap to open"}>
                {messages.map((n) => (
                  <MobileListItem
                    key={n.id}
                    href={n.href}
                    leading={<Bell className="size-4 text-foreground" aria-hidden />}
                    title={
                      n.read_at ? (
                        n.title
                      ) : (
                        <>
                          <span aria-hidden>● </span>
                          <span className="sr-only">New: </span>
                          {n.title}
                        </>
                      )
                    }
                    subtitle={n.body}
                    trailing={
                      <span className={cn("text-caption", n.read_at ? "text-muted-foreground" : "font-bold text-foreground")}>
                        {formatRelativeTime(n.created_at)}
                      </span>
                    }
                  />
                ))}
              </MobileSection>
            ) : null}

            {achievements.length ? (
              <MobileSection title="Achievements" description={unread > 0 ? `${unread} new` : "Your earned credentials"}>
                {achievements.map((n) => (
                  <MobileListItem
                    key={n.id}
                    href={n.href}
                    leading={n.type === "badge" ? <Award className="size-4 text-foreground" aria-hidden /> : <ShieldCheck className="size-4 text-foreground" aria-hidden />}
                    title={n.title}
                    subtitle={n.body}
                    trailing={
                      <span className={cn("text-caption", n.read_at ? "text-muted-foreground" : "font-bold text-foreground")}>
                        {formatRelativeTime(n.created_at)}
                      </span>
                    }
                  />
                ))}
              </MobileSection>
            ) : null}

            {hasStudent ? (
              <MobileSection title="Replies to your posts" description="Cohort members have answered on the wall.">
                {replyItems.map((r) => (
                  <MobileListItem
                    key={r.id}
                    href="/wall"
                    leading={<MessageSquare className="size-4 text-foreground" aria-hidden />}
                    title={r.reply_content}
                    subtitle={`on “${r.post_content.slice(0, 60)}${r.post_content.length > 60 ? "…" : ""}”`}
                    trailing={<span className="text-caption text-muted-foreground">{formatRelativeTime(r.created_at)}</span>}
                  />
                ))}
              </MobileSection>
            ) : null}

            {hasAdmin ? (
              <MobileSection title="Reports to review" description="Items flagged by the cohort.">
                {reports!.map((r) => (
                  <MobileListItem
                    key={r.id}
                    href="/admin/wall-reports"
                    leading={<ShieldAlert className={cn("size-4 text-foreground")} aria-hidden />}
                    title="A post was reported"
                    subtitle={r.reason ?? "No reason given"}
                    trailing={<span className="text-caption text-muted-foreground">{formatRelativeTime(r.created_at)}</span>}
                  />
                ))}
              </MobileSection>
            ) : null}
          </>
        )}
      </div>
    </MobilePage>
  );
}
