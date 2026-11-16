import Link from "next/link";
import { MemeArt } from "@/components/reactions/graphics";
import { PageFrame, BackLink, EmptyLine, quietButton } from "@/components/ds";
import { cn } from "@/lib/utils";

export type NoteRow = {
  key: string;
  href: string;
  /** Who or what it is from, in two or three words. */
  from: string;
  title: string;
  body?: string | null;
  /** Already formatted ("2 h ago"). */
  when: string;
  unread: boolean;
};

/** The first lines of a message, cut at a word, so every row stays about the same height. */
function preview(body: string): string {
  const flat = body.replace(/\s+/g, " ").trim();
  if (flat.length <= 120) return flat;
  const cut = flat.slice(0, 120);
  return `${cut.slice(0, Math.max(60, cut.lastIndexOf(" "))).trimEnd()}…`;
}

/**
 * Notifications (new design). One list, newest first. An unread row has a
 * blue dot and a bold title; a read row is quiet. One tap opens it.
 */
export function NotificationsV2({ rows, unread, markAll }: { rows: NoteRow[]; unread: number; markAll: () => Promise<void> }) {
  return (
    <PageFrame
      title="Notifications"
      lead={unread > 0 ? `${unread} unread` : undefined}
      actions={
        unread > 0 ? (
          <form action={markAll}>
            <button type="submit" className={quietButton}>
              Mark all read
            </button>
          </form>
        ) : undefined
      }
    >
      {rows.length === 0 ? (
        <EmptyLine art={<MemeArt sticker="sunlit-dog" size={72} />} title="Nothing new">Messages from the VIBHA team, badges and certificates you earn, and replies to your posts show here.</EmptyLine>
      ) : (
        <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
          {rows.map((n) => (
            <li key={n.key} className="min-w-0">
              <Link
                href={n.href}
                className="group/row -mx-2 flex min-h-16 min-w-0 items-start gap-3 rounded-lg px-2 py-3 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]"
              >
                <span aria-hidden className={cn("mt-2 size-2 shrink-0 rounded-full", n.unread ? "bg-brand dark:bg-primary" : "bg-transparent")} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex min-w-0 items-baseline justify-between gap-3">
                    <span className="min-w-0 type-caption text-muted-foreground [overflow-wrap:anywhere]">{n.from}</span>
                    <span className={cn("shrink-0 type-caption type-num", n.unread ? "text-foreground" : "text-muted-foreground")}>{n.when}</span>
                  </span>
                  <span className={cn("type-body [overflow-wrap:anywhere]", n.unread ? "font-bold" : "font-medium")}>
                    {n.unread ? <span className="sr-only">Unread: </span> : null}
                    {n.title}
                  </span>
                  {n.body ? <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{preview(n.body)}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageFrame>
  );
}

/** One notification, opened: who it is from, when, its title and the message as plain reading text. */
export function NotificationDetailV2({ from, when, title, html }: { from: string; when: string; title: string; html: string }) {
  return (
    <PageFrame width="reading" className="gap-4">
      <BackLink href="/notifications">Notifications</BackLink>
      <article className="flex min-w-0 flex-col gap-4">
        <header className="flex min-w-0 flex-col gap-2">
          <p className="type-small text-muted-foreground">
            {from} · <span className="type-num">{when}</span>
          </p>
          <h1 className="type-h1 [overflow-wrap:anywhere]">{title}</h1>
        </header>
        <div
          className="type-reading [overflow-wrap:anywhere] [&_a]:font-semibold [&_a]:text-link [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--ds-card-line)] [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:type-h3 [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:font-semibold [&_hr]:my-6 [&_hr]:border-t [&_hr]:border-[var(--ds-hairline)] [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </PageFrame>
  );
}
