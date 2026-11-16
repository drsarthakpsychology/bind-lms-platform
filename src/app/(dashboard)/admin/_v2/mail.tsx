import * as React from "react";
import Link from "next/link";
import { PenSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { AdminPage, Empty, Notice, Status, ViewTabs, btn, link, type Tone } from "./kit";

/**
 * Messages (v2). Folders are tabs across the top (no second sidebar), the
 * list is plain rows, and the open email reads beside the list on wide
 * screens or as its own screen on phones. Compose is the one primary action.
 * The compose form, notifications tab, failed list and reply box are the same
 * components as before, passed in by the page.
 */

export type MailListRow = {
  id: string;
  href: string;
  who: string;
  subject: string;
  preview?: string | null;
  when: string;
  unread?: boolean;
  status?: { label: string; tone: Tone };
};

export type OpenMail = {
  subject: string;
  /** "From" or "To" line. */
  lead: string;
  who: string;
  address: string;
  when?: string;
  peopleHref: string;
  steps?: { label: string; value: string | null }[];
  error?: string | null;
  body: string;
  backHref: string;
  backLabel: string;
  /** Reply box and archive (inbound only). */
  controls?: React.ReactNode;
};

export function MailV2({
  folder,
  folders,
  counts,
  keys,
  filter,
  list,
  emptyText,
  open,
  openId,
  panel,
  canCompose = true,
}: {
  folder: string;
  folders: readonly { id: string; label: string }[];
  counts: Record<string, number | null | undefined>;
  /** Keyboard shortcuts (client, renders nothing). */
  keys: React.ReactNode;
  filter?: React.ReactNode;
  list?: MailListRow[];
  emptyText?: string;
  open?: OpenMail | null;
  openId?: string;
  /** Compose, Notifications or the Failed list: takes the whole body. */
  panel?: React.ReactNode;
  /** False for a View Admin: sending is Super Admin only, so no Compose button. */
  canCompose?: boolean;
}) {
  const reading = Boolean(open);
  const composing = folder === "compose";
  return (
    <AdminPage
      title={composing ? "New email" : "Messages"}
      back={composing ? { href: "/admin/emails", label: "Messages" } : undefined}
      actions={
        composing || !canCompose ? undefined : (
          <Link href="/admin/emails?folder=compose" className={cn(btn.primary, "hidden md:inline-flex")}>
            <PenSquare aria-hidden /> Compose
            <kbd className="ml-1 hidden rounded border border-current px-1 type-caption lg:inline" aria-hidden>C</kbd>
          </Link>
        )
      }
    >
      {keys}
      {composing ? null : (
        <ViewTabs label="Mail folders" current={folder} tabs={folders.map((f) => ({ id: f.id, label: f.label, href: `/admin/emails?folder=${f.id}`, count: counts[f.id] ?? null }))} />
      )}

      {panel ? (
        <div className="min-w-0">{panel}</div>
      ) : (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[var(--ds-6)] xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:gap-[var(--ds-7)]">
          <section aria-label={`${folder} list`} className={cn("flex min-w-0 flex-col gap-3", reading && "hidden xl:flex")}>
            {filter}
            {list && list.length ? (
              <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
                {list.map((r) => (
                  <li key={r.id} className="min-w-0">
                    <Link
                      data-mail-row
                      href={r.href}
                      aria-current={r.id === openId ? "true" : undefined}
                      className="-mx-2 flex min-h-14 min-w-0 flex-col justify-center gap-0.5 rounded-lg px-2 py-2.5 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:bg-[color-mix(in_oklab,var(--link)_9%,transparent)]"
                    >
                      <span className="flex min-w-0 items-baseline justify-between gap-3">
                        <span className={cn("flex min-w-0 items-center gap-2 type-small [overflow-wrap:anywhere]", r.unread ? "font-bold" : "font-semibold")}>
                          {r.unread ? <span className="size-2 shrink-0 rounded-full bg-link" aria-label="Unread" role="img" /> : null}
                          {r.who}
                        </span>
                        <span className="shrink-0 type-caption font-medium text-muted-foreground type-num">{r.when}</span>
                      </span>
                      <span className="flex min-w-0 items-start justify-between gap-3">
                        <span className={cn("min-w-0 type-small [overflow-wrap:anywhere]", r.unread && "font-semibold")}>{r.subject}</span>
                        {r.status ? <Status tone={r.status.tone} className="shrink-0 type-caption">{r.status.label}</Status> : null}
                      </span>
                      {r.preview ? <span title={r.preview} className="block truncate type-small text-muted-foreground">{r.preview}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>{emptyText}</Empty>
            )}
          </section>

          <section aria-label="Email" className={cn("min-w-0", !reading && "hidden xl:block")}>
            {open ? (
              <article className="flex min-w-0 flex-col gap-4">
                <Link href={open.backHref} className="-ml-1 inline-flex min-h-11 items-center gap-1 self-start px-1 type-small font-semibold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring xl:hidden">
                  <span aria-hidden>←</span> {open.backLabel}
                </Link>
                <h2 className="type-h2 [overflow-wrap:anywhere]">{open.subject}</h2>
                <p className="type-small [overflow-wrap:anywhere]">
                  {open.lead} <span className="font-semibold">{open.who}</span>{" "}
                  <span className="text-muted-foreground">
                    &lt;{open.address}&gt;{open.when ? ` · ${open.when}` : ""}
                  </span>{" "}
                  <Link href={open.peopleHref} className={link}>Open in People</Link>
                </p>
                {open.steps ? (
                  <ol className="flex min-w-0 flex-wrap gap-x-8 gap-y-2 border-y border-[var(--ds-hairline)] py-3">
                    {open.steps.map((s) => (
                      <li key={s.label} className="flex min-w-0 flex-col">
                        <span className="type-caption text-muted-foreground">{s.label}</span>
                        <span className={cn("type-small type-num", s.value ? "font-semibold" : "text-muted-foreground")}>{s.value ?? "Not yet"}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
                {open.error ? <Notice tone="alert">{open.error}</Notice> : null}
                <div className="max-w-[72ch] type-body whitespace-pre-line [overflow-wrap:anywhere]">{open.body}</div>
                {open.controls ? <div className="max-w-[72ch] border-t border-[var(--ds-hairline)] pt-4">{open.controls}</div> : null}
              </article>
            ) : (
              <p className="py-16 text-center type-small text-muted-foreground">
                Pick an email to read it.
                <span className="mt-1 block type-caption font-medium">{canCompose ? "J / K to move · C to compose" : "J / K to move"}</span>
              </p>
            )}
          </section>
        </div>
      )}

      {canCompose && !composing && !reading ? (
        <Link
          href="/admin/emails?folder=compose"
          className="fixed right-4 bottom-[calc(var(--nav-h)+1rem)] z-30 inline-flex h-12 items-center gap-2 rounded-[var(--ds-radius)] border-2 border-foreground bg-primary px-4 type-small font-bold text-primary-foreground hard-shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          <PenSquare className="size-5" aria-hidden /> Compose
        </Link>
      ) : null}
    </AdminPage>
  );
}
