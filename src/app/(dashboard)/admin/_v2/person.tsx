import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { AdminPage, Block, Empty, Facts, RowItem, Rows, Status, Tag, btn, nameLink, table, type Tone } from "./kit";

export type TimelineV2 = { title: string; body?: string | null; when: string; at: string; tone: Tone };

/**
 * One person's pipeline record (v2). The timeline is the page; stage,
 * follow-up and the log box sit in a narrow column beside it (under it on
 * phones), with their facts.
 */
export function PersonV2({
  name,
  lead,
  links,
  contact,
  facts,
  actions,
  timeline,
}: {
  name: string;
  lead: string;
  links: React.ReactNode;
  contact: { label: string; href: string | null; external?: boolean }[];
  facts: { label: string; value: string }[];
  actions: React.ReactNode;
  timeline: TimelineV2[];
}) {
  return (
    <AdminPage
      title={name}
      lead={lead}
      back={{ href: "/admin/people", label: "Pipeline" }}
      actions={contact.map((c) =>
        c.href ? (
          <a key={c.label} href={c.href} className={btn.quiet} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {c.label}
          </a>
        ) : (
          <span key={c.label} aria-disabled className={cn(btn.quiet, "opacity-45")}>
            {c.label}
          </span>
        ),
      )}
    >
      {links}
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[var(--ds-6)] lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-[var(--ds-7)]">
        <Block title="Timeline">
          {timeline.length ? (
            <ol className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
              {timeline.map((t, i) => (
                <li key={`${t.at}-${i}`} className="flex min-w-0 flex-col gap-1 py-3">
                  <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <Status tone={t.tone} className="font-semibold">{t.title}</Status>
                    <time className="shrink-0 type-small text-muted-foreground" dateTime={t.at}>{t.when}</time>
                  </div>
                  {t.body ? <p className="max-w-[70ch] pl-3.5 type-small whitespace-pre-line text-muted-foreground [overflow-wrap:anywhere]">{t.body}</p> : null}
                </li>
              ))}
            </ol>
          ) : (
            <Empty>Nothing yet. Log a call or WhatsApp, or send an email.</Empty>
          )}
        </Block>
        <div className="flex min-w-0 flex-col gap-[var(--ds-6)]">
          <Block title="Stage and follow-up">{actions}</Block>
          <Block title="Details">
            <Facts items={facts} />
          </Block>
        </div>
      </div>
    </AdminPage>
  );
}

/* ---------------------------------------------------------------- */
/* Enquiries                                                         */
/* ---------------------------------------------------------------- */

export type EnquiryV2 = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  isStudent: boolean;
  message: string | null;
  when: string;
  source: string;
  wa: string | null;
  tel: string | null;
  recordHref: string;
  emailHref: string;
  makeHref: string | null;
};

/** Enquiries (v2). One purpose: reply to people who filled the public form. Newest first. */
export function EnquiriesV2({ rows, lead }: { rows: EnquiryV2[]; lead: string }) {
  const acts = (r: EnquiryV2) => (
    <span className="flex min-w-0 flex-wrap gap-2">
      {r.wa ? <a href={r.wa} target="_blank" rel="noopener noreferrer" className={btn.quiet}>WhatsApp</a> : null}
      {r.tel ? <a href={r.tel} className={btn.quiet}>Call</a> : null}
      <Link href={r.emailHref} className={btn.quiet}>Email</Link>
      {r.makeHref ? <Link href={r.makeHref} className={btn.quiet}>Make a student</Link> : null}
    </span>
  );
  return (
    <AdminPage title="Enquiries" lead={lead}>
      {rows.length ? (
        <>
          <table className={cn(table.root, "hidden lg:table")}>
            <thead>
              <tr>
                <th scope="col" className={cn(table.th, "w-[22%]")}>Name</th>
                <th scope="col" className={table.th}>They are</th>
                <th scope="col" className={cn(table.th, "w-[34%]")}>Message</th>
                <th scope="col" className={table.th}>Received</th>
                <th scope="col" className={table.th}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={table.tr}>
                  <td className={cn(table.td, "align-top")}>
                    <Link href={r.recordHref} className={nameLink}>{r.name}</Link>
                    <span className="block text-muted-foreground [overflow-wrap:anywhere]">{r.email}</span>
                    {r.phone ? <span className="block text-muted-foreground type-num">{r.phone}</span> : null}
                  </td>
                  <td className={cn(table.td, "align-top")}>
                    <span className="flex flex-col items-start gap-1">
                      {r.status}
                      {r.isStudent ? <Tag>Now a student</Tag> : null}
                    </span>
                  </td>
                  <td className={cn(table.td, "align-top whitespace-pre-wrap [overflow-wrap:anywhere]", !r.message && "text-muted-foreground")}>{r.message || "No message"}</td>
                  <td className={cn(table.td, "align-top text-muted-foreground")}>
                    <span className="block whitespace-nowrap">{r.when}</span>
                    <span className="block [overflow-wrap:anywhere]">{r.source}</span>
                  </td>
                  <td className={cn(table.td, "align-top")}>{acts(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Rows className="lg:hidden">
            {rows.map((r) => (
              <RowItem key={r.id}>
                <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <Link href={r.recordHref} className={cn(nameLink, "inline-flex min-h-11 items-center type-body")}>{r.name}</Link>
                  <span className="type-small text-muted-foreground">{r.when} · {r.source}</span>
                </div>
                <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">
                  {r.email}
                  {r.phone ? ` · ${r.phone}` : ""} · {r.status}
                  {r.isStudent ? " · Now a student" : ""}
                </p>
                <p className={cn("max-w-[70ch] type-small whitespace-pre-line [overflow-wrap:anywhere]", !r.message && "text-muted-foreground")}>{r.message || "No message"}</p>
                {acts(r)}
              </RowItem>
            ))}
          </Rows>
        </>
      ) : (
        <Empty>No enquiries yet. They land here the moment someone submits the form.</Empty>
      )}
    </AdminPage>
  );
}
