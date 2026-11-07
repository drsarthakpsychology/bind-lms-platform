"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DirectoryRow = {
  id: string;
  /** Lower-cased text the search box matches (email, number). */
  search: string;
  tags: string[];
  /** Card for phones/tablets. */
  card: React.ReactNode;
  /** <TableRow> for laptops. */
  row: React.ReactNode;
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "signed-in", label: "Signed in" },
  { id: "not-signed-in", label: "Not signed in" },
  { id: "no-number", label: "No number" },
  { id: "locked", label: "Locked" },
  { id: "test", label: "Test" },
] as const;

/**
 * The student list with a search box and filter chips: the Gmail / Google
 * Admin pattern. Filtering is instant and local; the rows (and their action
 * buttons) are rendered on the server and passed in.
 */
export function StudentDirectory({ rows }: { rows: DirectoryRow[] }) {
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]["id"]>("all");
  const query = q.trim().toLowerCase();
  const shown = rows.filter(
    (r) => (filter === "all" || r.tags.includes(filter)) && (!query || r.search.includes(query)),
  );
  const counts = Object.fromEntries(
    FILTERS.map((f) => [f.id, f.id === "all" ? rows.length : rows.filter((r) => r.tags.includes(f.id)).length]),
  ) as Record<string, number>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <label className="relative block">
          <span className="sr-only">Search students</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by email or number"
            className="h-12 w-full rounded-md border-2 border-foreground bg-card pr-11 pl-11 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/60 md:text-sm"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md hover:bg-accent"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </label>
        <div role="group" aria-label="Filter" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-2 border-foreground px-3.5 text-sm font-bold transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-xs active:translate-y-px active:shadow-none",
                filter === f.id ? "bg-brand text-brand-foreground" : "bg-card",
              )}
            >
              {f.label}
              <span className="font-pix text-[0.65rem] opacity-80">{counts[f.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-caption font-semibold text-muted-foreground" aria-live="polite">
        {shown.length === rows.length ? `${rows.length} students` : `${shown.length} of ${rows.length} students`}
      </p>

      {shown.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-foreground/40 p-6 text-center text-sm font-semibold text-muted-foreground">
          No students match. Try a different search or filter.
        </p>
      ) : (
        <>
          <ul className="space-y-2 xl:hidden">
            {shown.map((r) => (
              <React.Fragment key={r.id}>{r.card}</React.Fragment>
            ))}
          </ul>
          <div className="hidden overflow-x-auto rounded-xl border-2 border-foreground xl:block">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile / WhatsApp</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Signed in</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((r) => (
                  <React.Fragment key={r.id}>{r.row}</React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
