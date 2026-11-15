"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { control } from "../../_v2/kit";

/**
 * Small parts shared by the Certificates screens (Issue, Issued, Types,
 * Settings). Built on the admin v2 kit; nothing here is used elsewhere.
 */

/** A text field, full width. */
export const field = cn(control, "w-full");
/** A multi-line field. */
export const area = cn(control, "h-auto min-h-24 w-full py-2 leading-normal lg:h-auto");
/** Field label. */
export const label = "mb-1.5 block type-small font-semibold";

/** Choices that are links (so each has its own address): the chosen one is ink on a soft fill. */
export function ChoiceLinks({ label: name, options, current }: { label: string; options: { id: string; label: string; href: string }[]; current: string }) {
  return (
    <nav aria-label={name} className="flex min-w-0 flex-wrap gap-1">
      {options.map((o) => (
        <Link
          key={o.id}
          href={o.href}
          aria-current={o.id === current ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 items-center rounded-md px-3 type-small outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring lg:min-h-9",
            o.id === current ? "bg-[var(--ds-tint)] font-bold text-foreground" : "font-semibold text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </Link>
      ))}
    </nav>
  );
}

export type PickStudent = { id: string; name: string; email: string; roll: string | null; cohortIds: string[] };
export type PickCohort = { id: string; name: string; count: number };

/**
 * Find students by name, email or roll number, or add a whole cohort. The
 * list of who is picked is the caller's (it may hold extra per-person data,
 * like the printed name on a certificate).
 */
export function StudentFinder({
  students,
  cohorts,
  pickedIds,
  onAdd,
  onAddCohort,
  idPrefix = "pick",
}: {
  students: PickStudent[];
  cohorts: PickCohort[];
  pickedIds: Set<string>;
  onAdd: (s: PickStudent) => void;
  onAddCohort: (cohortId: string, members: PickStudent[]) => void;
  idPrefix?: string;
}) {
  const [query, setQuery] = React.useState("");
  const matches = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return students.filter((s) => !pickedIds.has(s.id) && `${s.name} ${s.email} ${s.roll ?? ""}`.toLowerCase().includes(q)).slice(0, 6);
  }, [query, students, pickedIds]);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="relative">
        <label htmlFor={`${idPrefix}-search`} className="sr-only">Search by name, email or roll number</label>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input id={`${idPrefix}-search`} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, email or roll number" className={cn(field, "pl-9")} autoComplete="off" />
      </div>
      {query.trim() ? (
        matches.length ? (
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {matches.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    onAdd(s);
                    setQuery("");
                  }}
                  className="-mx-2 flex min-h-12 w-[calc(100%+1rem)] min-w-0 items-center gap-3 rounded-md px-2 py-2 text-left outline-none transition-colors duration-[var(--ds-state)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block type-small font-semibold [overflow-wrap:anywhere]">{s.name}</span>
                    <span className="block type-caption text-muted-foreground [overflow-wrap:anywhere]">{s.roll ?? "No roll number"} · {s.email}</span>
                  </span>
                  <Plus className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="sr-only">Add</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="type-small text-muted-foreground">No student matches.</p>
        )
      ) : null}
      {cohorts.length ? (
        <div>
          <label htmlFor={`${idPrefix}-cohort`} className={label}>Or add a whole cohort</label>
          <select id={`${idPrefix}-cohort`} className={field} value="" onChange={(e) => e.target.value && onAddCohort(e.target.value, students.filter((s) => s.cohortIds.includes(e.target.value)))}>
            <option value="">Choose a cohort</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}

/** A removable person in a picked list. */
export function RemoveButton({ name, onClick, disabled }: { name: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" aria-label={`Remove ${name}`} disabled={disabled} onClick={onClick} className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-[var(--ds-tint)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 lg:size-9">
      <X className="size-4" aria-hidden />
    </button>
  );
}

/** A numbered step heading (01, 02): the steps of a form run in order. */
export function Step({ n, id, children, hint }: { n: number; id: string; children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="mb-4 flex min-w-0 items-baseline justify-between gap-3">
      <h2 id={id} className="flex min-w-0 items-baseline gap-2 type-h3">
        <span aria-hidden className="type-pix text-link">{String(n).padStart(2, "0")}</span>
        <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
      </h2>
      {hint ? <span className="shrink-0 type-caption text-muted-foreground type-num">{hint}</span> : null}
    </div>
  );
}

/** A result list: label with its count, then the names. */
export function ResultList({ rows }: { rows: Array<{ label: string; names: string[]; note?: string }> }) {
  if (!rows.length) return null;
  return (
    <dl className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
      {rows.map((r) => (
        <div key={r.label} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
          <dt className="type-small font-semibold">
            {r.label} <span className="type-num text-muted-foreground">{r.names.length}</span>
          </dt>
          <dd className="min-w-0 type-small">
            <span className="[overflow-wrap:anywhere]">{r.names.join(", ")}</span>
            {r.note ? <span className="mt-1 block text-muted-foreground">{r.note}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
