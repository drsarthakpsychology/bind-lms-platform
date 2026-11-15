import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { AdminPage, Block, Empty, Facts, RowItem, Rows, Status, Tag, btn, nameLink, table } from "./kit";

export type FormRowV2 = { id: string; title: string; open: boolean; answers: number; last: string | null; link: React.ReactNode; actions?: React.ReactNode };

const openStatus = (open: boolean) => <Status tone={open ? "ok" : "quiet"}>{open ? "Open" : "Closed"}</Status>;

/** Forms (v2). One purpose: see answers. A table on wide screens, rows below; New form is the one primary action. */
export function FormsListV2({ forms, lead, canEdit }: { forms: FormRowV2[]; lead: string; canEdit: boolean }) {
  return (
    <AdminPage
      title="Forms"
      lead={lead}
      actions={
        canEdit ? (
          <Link href="/admin/forms/new" className={btn.primary}>
            New form
          </Link>
        ) : undefined
      }
    >
      {forms.length ? (
        <>
          <table className={cn(table.root, "hidden xl:table")}>
            <thead>
              <tr>
                <th scope="col" className={cn(table.th, "w-[24%]")}>Form</th>
                <th scope="col" className={table.th}>Status</th>
                <th scope="col" className={cn(table.th, "text-right")}>Answers</th>
                <th scope="col" className={table.th}>Last answer</th>
                <th scope="col" className={cn(table.th, "w-[26%]")}>Link</th>
                <th scope="col" className={table.th}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {forms.map((f) => (
                <tr key={f.id} className={table.tr}>
                  <td className={table.td}><Link href={`/admin/forms/${f.id}`} className={nameLink}>{f.title}</Link></td>
                  <td className={cn(table.td, "whitespace-nowrap")}>{openStatus(f.open)}</td>
                  <td className={cn(table.td, table.num)}>{f.answers}</td>
                  <td className={cn(table.td, "whitespace-nowrap text-muted-foreground")}>{f.last ?? "None yet"}</td>
                  <td className={table.td}>{f.link}</td>
                  <td className={table.td}><span className="flex flex-wrap justify-end gap-2">{f.actions}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Rows className="xl:hidden">
            {forms.map((f) => (
              <RowItem key={f.id}>
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <Link href={`/admin/forms/${f.id}`} className={cn(nameLink, "inline-flex min-h-11 items-center type-body")}>{f.title}</Link>
                  {openStatus(f.open)}
                </div>
                <p className="type-small text-muted-foreground type-num">
                  {f.answers} answer{f.answers === 1 ? "" : "s"} · {f.last ? `last ${f.last}` : "none yet"}
                </p>
                {f.link}
                <span className="flex flex-wrap gap-2">
                  <Link href={`/admin/forms/${f.id}`} className={btn.quiet}>See answers</Link>
                  {f.actions}
                </span>
              </RowItem>
            ))}
          </Rows>
        </>
      ) : (
        <Empty>{canEdit ? "No forms yet. Make one and share its link." : "No forms yet. A Super Admin can make one."}</Empty>
      )}
    </AdminPage>
  );
}

/** One form's answers (v2): the table is the page; link and form actions sit in one line above it. */
export function FormAnswersV2({
  title,
  open,
  count,
  csvHref,
  link,
  actions,
  emptyText,
  children,
}: {
  title: string;
  open: boolean;
  count: number;
  csvHref: string | null;
  link: React.ReactNode;
  actions?: React.ReactNode;
  emptyText: string;
  children?: React.ReactNode;
}) {
  return (
    <AdminPage
      title={title}
      back={{ href: "/admin/forms", label: "Forms" }}
      lead={
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          {openStatus(open)}
          <span className="type-num">· {count} answer{count === 1 ? "" : "s"}</span>
        </span>
      }
      actions={
        csvHref ? (
          <a href={csvHref} className={btn.quiet}>
            Export CSV
          </a>
        ) : undefined
      }
    >
      <div className="flex min-w-0 flex-col gap-3">
        <div className="max-w-2xl min-w-0">{link}</div>
        {actions ? <div className="flex min-w-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      {count ? <div className="min-w-0">{children}</div> : <Empty>{emptyText}</Empty>}
    </AdminPage>
  );
}

/** New form and Edit form (v2): the builder under a plain title. */
export function FormEditV2({ title, back, children }: { title: string; back: { href: string; label: string }; children: React.ReactNode }) {
  return (
    <AdminPage width="default" title={title} back={back}>
      {children}
    </AdminPage>
  );
}

export type ContactAnswerV2 = { id: string; formHref: string; formTitle: string; when: string; items: { label: string; value: string }[] };

/** A contact made by a form (v2): their details as facts, then every answer they sent. */
export function FormContactV2({
  name,
  facts,
  tags,
  contact,
  answers,
}: {
  name: string;
  facts: { label: string; value: string }[];
  tags: string[];
  contact: { label: string; href: string; external?: boolean }[];
  answers: ContactAnswerV2[];
}) {
  return (
    <AdminPage
      width="default"
      title={name}
      back={{ href: "/admin/forms", label: "Forms" }}
      actions={contact.map((c) => (
        <a key={c.label} href={c.href} className={btn.quiet} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {c.label}
        </a>
      ))}
    >
      <div className="flex min-w-0 flex-col gap-3">
        <Facts items={facts} className="max-w-xl" />
        {tags.length ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
            {tags.map((t) => (
              <li key={t}><Tag>{t}</Tag></li>
            ))}
          </ul>
        ) : null}
      </div>
      <Block title="Form answers" count={answers.length || undefined}>
        {answers.length ? (
          <Rows>
            {answers.map((a) => (
              <RowItem key={a.id}>
                <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <Link href={a.formHref} className={cn(nameLink, "inline-flex min-h-11 items-center type-body lg:min-h-0")}>{a.formTitle}</Link>
                  <span className="type-small text-muted-foreground">{a.when}</span>
                </div>
                <dl className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-2 sm:grid-cols-2">
                  {a.items.map((it, i) => (
                    <div key={i} className="min-w-0">
                      <dt className="type-caption text-muted-foreground [overflow-wrap:anywhere]">{it.label}</dt>
                      <dd className="type-small whitespace-pre-line [overflow-wrap:anywhere]">{it.value}</dd>
                    </div>
                  ))}
                </dl>
              </RowItem>
            ))}
          </Rows>
        ) : (
          <Empty>No form answers linked to this contact.</Empty>
        )}
      </Block>
    </AdminPage>
  );
}
