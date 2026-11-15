import * as React from "react";
import Link from "next/link";

import { AdminPage, Block, Empty, Notice, RowItem, Rows, Tag, btn, link, nameLink } from "./kit";

export type InboxThreadV2 = {
  id: string;
  title: string;
  body: string;
  concern: boolean;
  reason: string;
  author: string;
  authorHref: string;
  where: string;
  when: string;
  followUp: string | null;
  /** Reply box, thread link and login shortcut (the same components as before). */
  reply: React.ReactNode;
  login?: React.ReactNode;
};
export type InboxEmailV2 = { id: string; subject: string; from: string; when: string; body: string; reply: React.ReactNode; login?: React.ReactNode };

/**
 * Inbox (v2). One purpose: answer what is waiting. Doubts and concerns first,
 * oldest first, then unread email replies. Each item is plain text with its
 * reply box under it; the login finder sits last because it is a side errand.
 */
export function InboxV2({
  ready,
  threads,
  emails,
  finder,
}: {
  ready: boolean;
  threads: InboxThreadV2[];
  emails: InboxEmailV2[];
  finder?: React.ReactNode;
}) {
  const total = threads.length + emails.length;
  return (
    <AdminPage
      width="default"
      title="Inbox"
      lead={total ? `${total} waiting for a reply. Oldest first.` : "Nothing is waiting for a reply."}
      actions={
        <Link href="/admin/doubts?view=all" className={btn.quiet}>
          All doubts
        </Link>
      }
    >
      {!ready ? <Notice>The doubts board is not switched on yet (database step 2026_11_access_doubts.sql). Email replies still show below.</Notice> : null}

      <Block title="Doubts and concerns" count={threads.length || undefined}>
        {threads.length ? (
          <Rows>
            {threads.map((t) => (
              <RowItem key={t.id}>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                  <Link href={`/doubts/${t.id}`} className={`${nameLink} inline-flex min-h-11 items-center type-body lg:min-h-0`}>
                    {t.title}
                  </Link>
                  <Tag tone={t.concern ? "alert" : "warn"}>{t.reason}</Tag>
                </div>
                <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">
                  <Link href={t.authorHref} className={link}>
                    {t.author}
                  </Link>
                  {" · "}
                  {t.where}
                  {" · "}
                  {t.when}
                </p>
                {t.body ? <p className="max-w-[70ch] type-small whitespace-pre-line [overflow-wrap:anywhere]">{t.body}</p> : null}
                {t.followUp ? (
                  <blockquote className="max-w-[70ch] border-l-2 border-link pl-3 type-small [overflow-wrap:anywhere]">
                    <span className="block type-caption text-muted-foreground">Their latest message</span>
                    <span className="whitespace-pre-line">{t.followUp}</span>
                  </blockquote>
                ) : null}
                <div className="flex min-w-0 flex-wrap items-start gap-2 pt-1">
                  <div className="min-w-0 flex-1 basis-56">{t.reply}</div>
                  <Link href={`/doubts/${t.id}`} className={btn.ghost}>
                    Open thread
                  </Link>
                  {t.login}
                </div>
              </RowItem>
            ))}
          </Rows>
        ) : (
          <Empty>No doubts waiting. Every doubt has an answer.</Empty>
        )}
      </Block>

      <Block title="Email replies" count={emails.length || undefined}>
        {emails.length ? (
          <Rows>
            {emails.map((m) => (
              <RowItem key={m.id}>
                <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="min-w-0 type-body font-semibold [overflow-wrap:anywhere]">{m.subject}</p>
                  <p className="shrink-0 type-small text-muted-foreground">{m.when}</p>
                </div>
                <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">{m.from}</p>
                {m.body ? <p className="max-w-[70ch] type-small whitespace-pre-line [overflow-wrap:anywhere]">{m.body}</p> : null}
                <div className="flex min-w-0 flex-wrap items-start gap-2 pt-1">
                  <div className="min-w-0 flex-1 basis-56">{m.reply}</div>
                  <Link href={`/admin/emails?folder=inbox&id=${m.id}`} className={btn.ghost}>
                    Open in Messages
                  </Link>
                  {m.login}
                </div>
              </RowItem>
            ))}
          </Rows>
        ) : (
          <Empty>No unread email replies.</Empty>
        )}
      </Block>

      {finder}
    </AdminPage>
  );
}
