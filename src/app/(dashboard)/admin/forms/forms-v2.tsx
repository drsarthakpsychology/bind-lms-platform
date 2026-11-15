"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminPage, btn, Empty, nameLink, RowItem, Rows, Status, table } from "../_v2/kit";
import { FormRowActions } from "./form-row-actions";

export type FormListItem = { id: string; title: string; url: string; isActive: boolean; responses: number; lastAnswer: string | null };

/** Copy a link, with the word changing to Copied for a moment. */
export function CopyButton({ url, label = "Copy link", className }: { url: string; label?: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      className={cn(btn.quiet, className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          window.prompt("Copy the link", url);
        }
      }}
    >
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/** Forms (v2): every link form as a table on desktop, rows on phones. One action: New form. */
export function FormsListV2({ forms, canEdit }: { forms: FormListItem[]; canEdit: boolean }) {
  const total = forms.reduce((n, f) => n + f.responses, 0);
  const open = forms.filter((f) => f.isActive).length;
  return (
    <AdminPage
      title="Forms"
      lead={`${forms.length} form${forms.length === 1 ? "" : "s"} · ${open} open · ${total} answer${total === 1 ? "" : "s"}`}
      actions={
        canEdit ? (
          <Link href="/admin/forms/new" className={btn.primary}>
            <Plus aria-hidden /> New form
          </Link>
        ) : null
      }
    >
      {forms.length === 0 ? (
        <Empty>{canEdit ? "No forms yet. Make one and share its link." : "No forms yet. A Super Admin can make one."}</Empty>
      ) : (
        <>
          <table className={cn(table.root, "hidden md:table")}>
            <thead>
              <tr>
                <th scope="col" className={cn(table.th, "w-[38%]")}>Form</th>
                <th scope="col" className={table.th}>Status</th>
                <th scope="col" className={cn(table.th, "text-right")}>Answers</th>
                <th scope="col" className={table.th}>Last answer</th>
                <th scope="col" className={table.th}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {forms.map((f) => (
                <tr key={f.id} className={table.tr}>
                  <td className={table.td}>
                    <Link href={`/admin/forms/${f.id}`} className={nameLink}>{f.title}</Link>
                    <span className="block font-mono type-caption text-muted-foreground [overflow-wrap:anywhere]">{f.url.replace(/^https?:\/\//, "")}</span>
                  </td>
                  <td className={cn(table.td, "whitespace-nowrap")}>
                    <Status tone={f.isActive ? "ok" : "quiet"}>{f.isActive ? "Open" : "Closed"}</Status>
                  </td>
                  <td className={cn(table.td, table.num)}>{f.responses}</td>
                  <td className={cn(table.td, "whitespace-nowrap text-muted-foreground")}>{f.lastAnswer ?? "None yet"}</td>
                  <td className={cn(table.td, "w-px")}>
                    <span className="flex items-center justify-end gap-1">
                      <CopyButton url={f.url} />
                      {canEdit ? <FormRowActions v2 id={f.id} title={f.title} active={f.isActive} responses={f.responses} /> : null}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Rows className="md:hidden" label="Forms">
            {forms.map((f) => (
              <RowItem key={f.id}>
                <Link href={`/admin/forms/${f.id}`} className={cn(nameLink, "inline-flex min-h-11 items-center type-body")}>{f.title}</Link>
                <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 type-small text-muted-foreground">
                  <Status tone={f.isActive ? "ok" : "quiet"}>{f.isActive ? "Open" : "Closed"}</Status>
                  <span className="type-num">{f.responses} answers</span>
                  {f.lastAnswer ? <span>Last {f.lastAnswer}</span> : null}
                </span>
                <span className="flex items-center gap-1">
                  <CopyButton url={f.url} />
                  {canEdit ? <FormRowActions v2 id={f.id} title={f.title} active={f.isActive} responses={f.responses} /> : null}
                </span>
              </RowItem>
            ))}
          </Rows>
        </>
      )}
    </AdminPage>
  );
}
