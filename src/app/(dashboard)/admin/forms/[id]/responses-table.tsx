"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Mail, MessageCircle, Search, UserRound, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ResponseRow = {
  id: string;
  /** ISO time, for sorting. */
  at: string;
  /** Display time (India), made on the server. */
  when: string;
  name: string;
  email: string;
  phone: string;
  contactId: string | null;
  answers: Record<string, string>;
};

export type TableColumn = { key: string; label: string; removed: boolean; inTable: boolean };

const PAGE = 50;
type SortKey = "at" | "name" | "email" | "phone" | `a:${string}`;

const valueOf = (r: ResponseRow, k: SortKey) => (k === "at" ? r.at : k === "name" ? r.name : k === "email" ? r.email : k === "phone" ? r.phone : (r.answers[k.slice(2)] ?? ""));

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

/** Sort with blanks always last. */
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

/**
 * Answers to one form. Wide screens: a table (it scrolls inside its own box
 * when a form has many questions, never the page). Phones: one card per
 * answer. Search covers every answer; tap an answer to see all of it.
 */
export function ResponsesTable({ rows, columns }: { rows: ResponseRow[]; columns: TableColumn[] }) {
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<{ key: SortKey; dir: 1 | -1 }>({ key: "at", dir: -1 });
  const [page, setPage] = React.useState(0);
  const [openId, setOpenId] = React.useState<string | null>(null);

  const tableCols = columns.filter((c) => c.inTable);
  const needle = q.trim().toLowerCase();
  const shown = React.useMemo(() => {
    const hit = needle
      ? rows.filter((r) => [r.name, r.email, r.phone, r.when, ...Object.values(r.answers)].some((v) => v.toLowerCase().includes(needle)))
      : rows;
    return sortRows(hit, sort.key, sort.dir);
  }, [rows, needle, sort]);

  const pages = Math.max(1, Math.ceil(shown.length / PAGE));
  const current = Math.min(page, pages - 1);
  const slice = shown.slice(current * PAGE, current * PAGE + PAGE);
  const open = openId ? rows.find((r) => r.id === openId) ?? null : null;

  function sortBy(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "at" ? -1 : 1 }));
    setPage(0);
  }

  const head = (key: SortKey, label: string, extra?: string) => {
    const on = sort.key === key;
    return (
      <th scope="col" aria-sort={on ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className={cn("border-b-2 border-foreground p-0 text-left align-bottom", extra)}>
        <button type="button" onClick={() => sortBy(key)} className="flex min-h-11 w-full items-center gap-1 px-3 text-xs font-bold whitespace-nowrap hover:bg-accent">
          {label}
          {on ? sort.dir === 1 ? <ArrowUp className="size-3.5" aria-hidden /> : <ArrowDown className="size-3.5" aria-hidden /> : null}
        </button>
      </th>
    );
  };

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "at", label: "Date" },
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    ...tableCols.map((c) => ({ value: `a:${c.key}` as SortKey, label: c.label })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
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
            className="h-11 w-full min-w-0 rounded-md border-2 border-foreground bg-card pr-10 pl-9 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 md:text-sm"
          />
          {q ? (
            <button type="button" onClick={() => { setQ(""); setPage(0); }} className="absolute top-0 right-0 flex size-11 items-center justify-center" aria-label="Clear search">
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </label>
        <div className="flex items-center gap-2 sm:hidden">
          <label htmlFor="sort" className="text-sm font-bold">Sort</label>
          <select
            id="sort"
            value={sort.key}
            onChange={(e) => {
              const key = e.target.value as SortKey;
              setSort({ key, dir: key === "at" ? -1 : 1 });
              setPage(0);
            }}
            className="h-11 min-w-0 flex-1 rounded-md border-2 border-foreground bg-card px-3 text-base"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button type="button" onClick={() => setSort((s) => ({ ...s, dir: s.dir === 1 ? -1 : 1 }))} className="flex size-11 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-card" aria-label={sort.dir === 1 ? "Order: A to Z or oldest first. Tap to flip." : "Order: Z to A or newest first. Tap to flip."}>
            {sort.dir === 1 ? <ArrowUp className="size-4" aria-hidden /> : <ArrowDown className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      <p className="text-caption text-muted-foreground" aria-live="polite">
        {shown.length === 0 ? "No answers match." : `Showing ${current * PAGE + 1} to ${current * PAGE + slice.length} of ${shown.length}`}
      </p>

      {/* Wide screens: the table. */}
      <div className="hidden overflow-x-auto rounded-[10px] border-2 border-foreground bg-card sm:block">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-background">
            <tr>
              {head("name", "Name", "sticky left-0 z-10 bg-background")}
              {head("email", "Email")}
              {head("phone", "Phone")}
              {tableCols.map((c) => head(`a:${c.key}`, c.removed ? `${c.label} (removed)` : c.label))}
              {head("at", "Date")}
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.id} className="border-b border-foreground/15 last:border-0 hover:bg-accent/40">
                <td className="sticky left-0 z-10 bg-card p-0">
                  <button type="button" onClick={() => setOpenId(r.id)} className="flex min-h-11 w-full max-w-[14rem] items-center px-3 text-left font-bold break-words underline-offset-4 hover:underline">
                    {r.name || "No name"}
                  </button>
                </td>
                <td className="max-w-[16rem] px-3 py-2 break-all">{r.email}</td>
                <td className="px-3 py-2 whitespace-nowrap">{r.phone}</td>
                {tableCols.map((c) => (
                  <td key={c.key} className="max-w-[16rem] px-3 py-2">
                    <span className="line-clamp-2 break-words">{r.answers[c.key]}</span>
                  </td>
                ))}
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{r.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones: one card per answer. */}
      <ul className="space-y-3 sm:hidden">
        {slice.map((r) => (
          <li key={r.id}>
            <button type="button" onClick={() => setOpenId(r.id)} className="w-full rounded-[10px] border-2 border-foreground bg-card p-4 text-left hard-shadow-xs">
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0 font-bold break-words">{r.name || "No name"}</span>
                <span className="shrink-0 text-caption text-muted-foreground">{r.when}</span>
              </span>
              {r.email ? <span className="mt-1 block text-sm break-all">{r.email}</span> : null}
              {r.phone ? <span className="block text-sm">{r.phone}</span> : null}
              <span className="mt-3 block space-y-1">
                {tableCols.slice(0, 3).map((c) =>
                  r.answers[c.key] ? (
                    <span key={c.key} className="block text-sm">
                      <span className="text-muted-foreground">{c.label}: </span>
                      <span className="break-words">{r.answers[c.key]}</span>
                    </span>
                  ) : null,
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {pages > 1 ? (
        <nav aria-label="Pages" className="flex items-center justify-between gap-3">
          <button type="button" disabled={current === 0} onClick={() => setPage(current - 1)} className="inline-flex min-h-11 items-center gap-1 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold disabled:opacity-40">
            <ChevronLeft className="size-4" aria-hidden /> Back
          </button>
          <span className="text-sm font-semibold">Page {current + 1} of {pages}</span>
          <button type="button" disabled={current >= pages - 1} onClick={() => setPage(current + 1)} className="inline-flex min-h-11 items-center gap-1 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold disabled:opacity-40">
            Next <ChevronRight className="size-4" aria-hidden />
          </button>
        </nav>
      ) : null}

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          {open ? (
            <>
              <DialogHeader>
                <DialogTitle className="break-words">{open.name || "No name"}</DialogTitle>
                <DialogDescription>Sent {open.when}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-2">
                {open.contactId ? (
                  <Link href={`/admin/forms/contacts/${open.contactId}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground">
                    <UserRound className="size-4" aria-hidden /> Contact
                  </Link>
                ) : null}
                {open.email ? (
                  <Link href={`/admin/emails?folder=compose&to=${encodeURIComponent(open.email)}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold">
                    <Mail className="size-4" aria-hidden /> Email
                  </Link>
                ) : null}
                {open.phone && waLink(open.phone) ? (
                  <a href={waLink(open.phone) ?? undefined} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold">
                    <MessageCircle className="size-4" aria-hidden /> WhatsApp
                  </a>
                ) : null}
              </div>
              <dl className="divide-y-2 divide-foreground/10 rounded-md border-2 border-foreground/15">
                {[
                  { key: "_name", label: "Name", value: open.name },
                  { key: "_email", label: "Email", value: open.email },
                  { key: "_phone", label: "Phone", value: open.phone },
                  ...columns.filter((c) => c.inTable).map((c) => ({ key: c.key, label: c.removed ? `${c.label} (removed question)` : c.label, value: open.answers[c.key] })),
                ].map((item) => (
                  <div key={item.key} className="p-3">
                    <dt className="text-caption font-semibold text-muted-foreground">{item.label}</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap break-words">{item.value || <span className="text-muted-foreground">No answer</span>}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
