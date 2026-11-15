"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Download, Loader2, Mail, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { EmailedMark } from "@/lib/forms/emailed";
import { AdminPage, btn, control, Empty, Facts, Notice, Status, table } from "../../_v2/kit";
import { canEmail, EmailCompose, type Allowance } from "../email-compose";
import { emailFormRespondents, sendWaitingFormEmails } from "../email-actions";
import { CopyButton } from "../forms-v2";
import { FormRowActions } from "../form-row-actions";
import type { ResponseRow, TableColumn } from "./responses-table";

const PAGE = 50;
type SortKey = "at" | "name" | "email" | `a:${string}`;
type EmailedFilter = "" | "not" | "yes";

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
const valueOf = (r: ResponseRow, k: SortKey) => (k === "at" ? r.at : k === "name" ? r.name : k === "email" ? r.email : (r.answers[k.slice(2)] ?? ""));
function sortRows(rows: ResponseRow[], key: SortKey, dir: 1 | -1): ResponseRow[] {
  return [...rows].sort((a, b) => {
    const x = valueOf(a, key);
    const y = valueOf(b, key);
    if (!x && y) return 1;
    if (x && !y) return -1;
    const c = key === "at" ? (x < y ? -1 : x > y ? 1 : 0) : collator.compare(x, y);
    return c * dir || (a.id < b.id ? -1 : 1);
  });
}
const waLink = (phone: string) => {
  const d = phone.replace(/\D/g, "").replace(/^0+/, "");
  return d.length === 10 ? `https://wa.me/91${d}` : d.length >= 11 ? `https://wa.me/${d}` : null;
};
const day = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" });

/** Pure: which answers the search and the Emailed filter keep. Exported for tests. */
export function filterResponses(rows: ResponseRow[], q: string, emailed: EmailedFilter, marks: Record<string, EmailedMark>): ResponseRow[] {
  const needle = q.trim().toLowerCase();
  return rows.filter((r) => {
    const m = marks[r.email.trim().toLowerCase()];
    if (emailed === "yes" && !(m && (m.sent || m.waiting))) return false;
    if (emailed === "not" && m && (m.sent || m.waiting)) return false;
    if (needle && ![r.name, r.email, r.phone, r.when, ...Object.values(r.answers)].some((v) => v.toLowerCase().includes(needle))) return false;
    return true;
  });
}

function EmailedCell({ mark }: { mark: EmailedMark | undefined }) {
  if (!mark) return <span className="text-muted-foreground">Not yet</span>;
  if (mark.waiting) return <Status tone="warn">Waiting</Status>;
  if (mark.lastSentAt) return <Status tone="ok">{`${day(mark.lastSentAt)}${mark.sent > 1 ? ` · ${mark.sent}` : ""}`}</Status>;
  if (mark.failed) return <Status tone="alert">Failed</Status>;
  return <span className="text-muted-foreground">Not yet</span>;
}

/**
 * One form's answers (v2). Pick one, several or all respondents and email
 * them; every row also has its own Email. Search covers every answer; the
 * Emailed column and filter show who has been written to from here.
 */
export function ResponsesV2({
  form,
  rows,
  columns,
  marks,
  waiting,
  allowance,
  canEdit,
}: {
  form: { id: string; title: string; url: string; isActive: boolean };
  rows: ResponseRow[];
  columns: TableColumn[];
  marks: Record<string, EmailedMark>;
  waiting: number;
  allowance: Allowance;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [emailed, setEmailed] = React.useState<EmailedFilter>("");
  const [sort, setSort] = React.useState<{ key: SortKey; dir: 1 | -1 }>({ key: "at", dir: -1 });
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set());
  const [compose, setCompose] = React.useState<{ ids: string[] | "all" } | null>(null);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [draining, setDraining] = React.useState(false);
  const [drainNote, setDrainNote] = React.useState<string | null>(null);

  const tableCols = columns.filter((c) => c.inTable);
  const shown = React.useMemo(() => sortRows(filterResponses(rows, q, emailed, marks), sort.key, sort.dir), [rows, q, emailed, marks, sort]);
  const pages = Math.max(1, Math.ceil(shown.length / PAGE));
  const current = Math.min(page, pages - 1);
  const slice = shown.slice(current * PAGE, current * PAGE + PAGE);
  const open = openId ? (rows.find((r) => r.id === openId) ?? null) : null;
  const allShownPicked = shown.length > 0 && shown.every((r) => selected.has(r.id));
  const pageAllPicked = slice.length > 0 && slice.every((r) => selected.has(r.id));
  const byId = React.useMemo(() => new Map(rows.map((r) => [r.id, r])), [rows]);

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const pickPage = () =>
    setSelected((s) => {
      const n = new Set(s);
      if (pageAllPicked) slice.forEach((r) => n.delete(r.id));
      else slice.forEach((r) => n.add(r.id));
      return n;
    });

  const composeRows = compose ? (compose.ids === "all" ? rows : compose.ids.map((id) => byId.get(id)).filter((r): r is ResponseRow => Boolean(r))) : [];
  const head = (key: SortKey, label: string) => {
    const on = sort.key === key;
    return (
      <th scope="col" aria-sort={on ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className={cn(table.th, "p-0")}>
        <button
          type="button"
          onClick={() => {
            setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "at" ? -1 : 1 }));
            setPage(0);
          }}
          className="inline-flex min-h-9 items-center gap-1 px-3 text-left whitespace-nowrap outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          {label}
          {on ? sort.dir === 1 ? <ArrowUp className="size-3.5" aria-hidden /> : <ArrowDown className="size-3.5" aria-hidden /> : null}
        </button>
      </th>
    );
  };

  return (
    <AdminPage
      title={form.title}
      lead={`${rows.length} answer${rows.length === 1 ? "" : "s"} · ${form.isActive ? "open" : "closed"}`}
      back={{ href: "/admin/forms", label: "Forms" }}
      actions={
        <>
          {rows.length ? (
            <a href={`/api/admin/forms/${form.id}/csv`} className={btn.quiet}>
              <Download aria-hidden /> Export CSV
            </a>
          ) : null}
          <CopyButton url={form.url} />
          {canEdit ? <FormRowActions v2 id={form.id} title={form.title} active={form.isActive} responses={rows.length} afterDelete="/admin/forms" /> : null}
        </>
      }
    >
      {waiting > 0 ? (
        <Notice className="flex-wrap items-center justify-between">
          <span className="min-w-0">
            <span className="font-semibold type-num">{waiting}</span> email{waiting === 1 ? " is" : "s are"} waiting for today&apos;s allowance.
            {drainNote ? <span className="ml-2" role="status">{drainNote}</span> : null}
          </span>
          {canEdit ? (
            <button
              type="button"
              className={btn.quiet}
              disabled={draining || !allowance.configured}
              onClick={async () => {
                setDraining(true);
                const r = await sendWaitingFormEmails(form.id).catch(() => ({ error: "Couldn't reach the server.", sent: 0, failed: 0, left: waiting }));
                setDraining(false);
                setDrainNote(r.error ? r.error : r.sent ? `${r.sent} sent${r.left ? `, ${r.left} still waiting` : ""}.` : "Today's allowance is used up. Try tomorrow.");
                router.refresh();
              }}
            >
              {draining ? <Loader2 className="animate-spin" aria-hidden /> : null} Send waiting emails
            </button>
          ) : null}
        </Notice>
      ) : null}

      {rows.length === 0 ? (
        <Empty>{form.isActive ? "No answers yet. Share the link; answers show up here." : "No answers. This form is closed; open it to take answers."}</Empty>
      ) : (
        <div className={cn("flex min-w-0 flex-col gap-4", selected.size > 0 && "pb-24 md:pb-0")}>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <label className="relative block min-w-0 flex-1 basis-56">
              <span className="sr-only">Search answers</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(0);
                }}
                placeholder="Search name, email, phone or any answer"
                className={cn(control, "w-full pr-11 pl-9")}
              />
              {q ? (
                <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-md outline-none hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring lg:size-9">
                  <X className="size-4" aria-hidden />
                </button>
              ) : null}
            </label>
            <label className="min-w-0 flex-1 basis-40 sm:flex-none">
              <span className="sr-only">Emailed</span>
              <select
                value={emailed}
                onChange={(e) => {
                  setEmailed(e.target.value as EmailedFilter);
                  setPage(0);
                }}
                className={cn(control, "w-full")}
              >
                <option value="">Everyone</option>
                <option value="not">Not emailed yet</option>
                <option value="yes">Emailed from here</option>
              </select>
            </label>
            <label className="min-w-0 flex-1 basis-40 md:hidden">
              <span className="sr-only">Sort</span>
              <select
                value={`${sort.key}|${sort.dir}`}
                onChange={(e) => {
                  const [key, dir] = e.target.value.split("|");
                  setSort({ key: key as SortKey, dir: Number(dir) as 1 | -1 });
                }}
                className={cn(control, "w-full")}
              >
                <option value="at|-1">Newest first</option>
                <option value="at|1">Oldest first</option>
                <option value="name|1">Name, A to Z</option>
              </select>
            </label>
            {canEdit ? (
              <button type="button" className={btn.primary} onClick={() => setCompose({ ids: "all" })}>
                <Mail aria-hidden /> Email everyone
              </button>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <p className="type-small text-muted-foreground type-num" aria-live="polite">
              {shown.length === 0 ? "No answers match." : `Showing ${current * PAGE + 1} to ${current * PAGE + slice.length} of ${shown.length}`}
            </p>
            {canEdit && shown.length > 0 && !allShownPicked && (q || emailed) ? (
              <button type="button" className={btn.ghost} onClick={() => setSelected(new Set(shown.map((r) => r.id)))}>
                Select all {shown.length} that match
              </button>
            ) : null}
          </div>

          {/* Desktop: a table that scrolls inside its own frame when a form has many questions. */}
          <div className="hidden max-w-full min-w-0 overflow-x-auto md:block" role="region" aria-label="Answers" tabIndex={0}>
            <table className={cn(table.root, "min-w-full")}>
              <thead>
                <tr>
                  {canEdit ? (
                    <th scope="col" className={cn(table.th, "w-10")}>
                      <input type="checkbox" className="size-4 accent-[var(--link)]" aria-label="Pick everyone on this page" checked={pageAllPicked} onChange={pickPage} />
                    </th>
                  ) : null}
                  {head("name", "Name")}
                  {head("email", "Email")}
                  {tableCols.map((c) => (
                    <React.Fragment key={c.key}>{head(`a:${c.key}`, c.removed ? `${c.label} (removed)` : c.label)}</React.Fragment>
                  ))}
                  {head("at", "Sent")}
                  <th scope="col" className={cn(table.th, "whitespace-nowrap")}>Emailed</th>
                  {canEdit ? <th scope="col" className={table.th}><span className="sr-only">Email</span></th> : null}
                </tr>
              </thead>
              <tbody>
                {slice.map((r) => (
                  <tr key={r.id} className={table.tr} aria-selected={selected.has(r.id) || undefined}>
                    {canEdit ? (
                      <td className={table.td}>
                        <input type="checkbox" className="size-4 accent-[var(--link)]" aria-label={`Pick ${r.name || r.email || "this answer"}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                      </td>
                    ) : null}
                    <td className={cn(table.td, "min-w-40")}>
                      <button type="button" onClick={() => setOpenId(r.id)} className="text-left font-semibold underline-offset-4 outline-none [overflow-wrap:anywhere] hover:underline focus-visible:underline">
                        {r.name || "No name"}
                      </button>
                      {r.phone ? <span className="block text-muted-foreground type-num">{r.phone}</span> : null}
                    </td>
                    <td className={cn(table.td, "min-w-44 [overflow-wrap:anywhere]")}>{r.email || <span className="text-muted-foreground">No email</span>}</td>
                    {tableCols.map((c) => (
                      <td key={c.key} className={cn(table.td, "max-w-64 min-w-36")}>
                        <span className="line-clamp-2 [overflow-wrap:anywhere]" title={r.answers[c.key] || undefined}>{r.answers[c.key]}</span>
                      </td>
                    ))}
                    <td className={cn(table.td, "whitespace-nowrap text-muted-foreground")}>{r.when}</td>
                    <td className={cn(table.td, "whitespace-nowrap")}>
                      <EmailedCell mark={marks[r.email.trim().toLowerCase()]} />
                    </td>
                    {canEdit ? (
                      <td className={cn(table.td, "w-px")}>
                        <button type="button" className={btn.ghost} disabled={!canEmail(r.email)} onClick={() => setCompose({ ids: [r.id] })} aria-label={`Email ${r.name || r.email}`}>
                          Email
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phones: one row per answer. */}
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)] md:hidden" aria-label="Answers">
            {slice.map((r) => (
              <li key={r.id} className={cn("flex min-w-0 items-start gap-3 py-3", selected.has(r.id) && "bg-[color-mix(in_oklab,var(--link)_9%,transparent)]")}>
                {canEdit ? (
                  <label className="-ml-1 flex size-11 shrink-0 items-center justify-center">
                    <input type="checkbox" className="size-5 accent-[var(--link)]" aria-label={`Pick ${r.name || r.email || "this answer"}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                  </label>
                ) : null}
                <button type="button" onClick={() => setOpenId(r.id)} className="flex min-h-11 min-w-0 flex-1 flex-col gap-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="type-body font-semibold [overflow-wrap:anywhere]">{r.name || "No name"}</span>
                  <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{r.email || "No email"}</span>
                  <span className="flex flex-wrap items-center gap-x-3 type-small text-muted-foreground">
                    <span>{r.when}</span>
                    <EmailedCell mark={marks[r.email.trim().toLowerCase()]} />
                  </span>
                </button>
                {canEdit ? (
                  <button type="button" className={cn(btn.quiet, "w-11 px-0")} disabled={!canEmail(r.email)} onClick={() => setCompose({ ids: [r.id] })} aria-label={`Email ${r.name || r.email}`}>
                    <Mail aria-hidden />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>

          {pages > 1 ? (
            <nav aria-label="Pages" className="flex items-center justify-between gap-3">
              <button type="button" className={btn.quiet} disabled={current === 0} onClick={() => setPage(current - 1)}>
                Back
              </button>
              <span className="type-small font-semibold type-num">
                Page {current + 1} of {pages}
              </span>
              <button type="button" className={btn.quiet} disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
                Next
              </button>
            </nav>
          ) : null}
        </div>
      )}

      {/* The action bar: only while someone is picked, in thumb reach on phones. */}
      {canEdit && selected.size > 0 ? (
        <div role="region" aria-label="Picked" className="fixed inset-x-0 bottom-[var(--nav-h,0px)] z-30 border-t border-[var(--ds-hairline)] bg-background px-5 py-3 md:sticky md:bottom-0 md:-mx-0 md:px-0">
          <div className="mx-auto flex max-w-7xl min-w-0 flex-wrap items-center gap-3">
            <p className="min-w-0 flex-1 type-small font-semibold type-num">{selected.size} picked</p>
            <button type="button" className={btn.ghost} onClick={() => setSelected(new Set())}>
              Clear
            </button>
            <button type="button" className={btn.primary} onClick={() => setCompose({ ids: [...selected] })}>
              <Mail aria-hidden /> Email {selected.size}
            </button>
          </div>
        </div>
      ) : null}

      {compose ? (
        <EmailCompose
          open
          onOpenChange={(o) => {
            if (!o) {
              setCompose(null);
              router.refresh();
            }
          }}
          recipients={composeRows.map((r) => ({ key: r.id, name: r.name, email: r.email }))}
          allowance={allowance}
          extraFields={[{ key: "form", label: "Form name" }]}
          extraVars={{ form: form.title }}
          onSend={async (subject, body) => {
            const r = await emailFormRespondents({ formId: form.id, submissionIds: compose.ids, subject, body });
            if (!r.error) setSelected(new Set());
            return r;
          }}
        />
      ) : null}

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          {open ? (
            <>
              <DialogHeader>
                <DialogTitle className="[overflow-wrap:anywhere]">{open.name || "No name"}</DialogTitle>
                <DialogDescription>Sent {open.when}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-2">
                {canEdit && canEmail(open.email) ? (
                  <button
                    type="button"
                    className={btn.primary}
                    onClick={() => {
                      setOpenId(null);
                      setCompose({ ids: [open.id] });
                    }}
                  >
                    <Mail aria-hidden /> Email
                  </button>
                ) : null}
                {open.phone && waLink(open.phone) ? (
                  <a href={waLink(open.phone) ?? undefined} target="_blank" rel="noopener noreferrer" className={btn.quiet}>
                    WhatsApp
                  </a>
                ) : null}
                {open.contactId ? (
                  <Link href={`/admin/forms/contacts/${open.contactId}`} className={btn.quiet}>
                    Contact
                  </Link>
                ) : null}
              </div>
              <Facts
                items={[
                  { label: "Name", value: open.name || "No answer" },
                  { label: "Email", value: open.email || "No answer" },
                  { label: "Phone", value: open.phone || "No answer" },
                  ...columns.filter((c) => c.inTable).map((c) => ({ label: c.removed ? `${c.label} (removed question)` : c.label, value: <span className="whitespace-pre-wrap">{open.answers[c.key] || "No answer"}</span> })),
                ]}
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
