"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ListFilter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };
export type FilterSelect = {
  /** URL parameter, e.g. "cohort". */
  param: string;
  /** Visible label ("Cohort"). */
  label: string;
  options: FilterOption[];
  /** The "no filter" option text, e.g. "All cohorts". */
  allLabel: string;
};

/** Build the next query string: set/clear values, drop `reset` params (e.g. an open item, a page number). */
export function nextQuery(current: string, changes: Record<string, string | null>, reset: string[] = []): string {
  const p = new URLSearchParams(current);
  for (const [k, v] of Object.entries(changes)) {
    if (v === null || v === "") p.delete(k);
    else p.set(k, v);
  }
  for (const k of reset) p.delete(k);
  return p.toString();
}

/** How many filters are switched on (search counts as one). */
export function activeCount(current: string, params: string[]): number {
  const p = new URLSearchParams(current);
  return params.filter((k) => (p.get(k) ?? "").trim() !== "").length;
}

const control =
  "h-10 w-full min-w-0 rounded-md border-2 border-foreground bg-card px-3 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 pointer-coarse:h-11";

/**
 * The shared FilterBar (DI §C-9): a search box, up to three dropdowns and
 * Clear, all kept in the URL so a filtered list can be shared, bookmarked
 * and survives Back. Other URL parameters (folder, view, tab) are kept.
 * Phones: search stays visible, the dropdowns fold behind "Filters (n)".
 */
type FilterBarProps = {
  search?: { param?: string; label: string; placeholder?: string };
  selects?: FilterSelect[];
  /** Params dropped whenever a filter changes. */
  reset?: string[];
  /** Extra params dropped only when the search text changes (e.g. the opened student). */
  searchReset?: string[];
  className?: string;
};

export function FilterBar(props: FilterBarProps) {
  // useSearchParams needs a Suspense boundary on statically rendered pages.
  return (
    <React.Suspense fallback={<div className={cn("h-10", props.className)} aria-hidden />}>
      <FilterBarInner {...props} />
    </React.Suspense>
  );
}

function FilterBarInner({ search, selects = [], reset = ["id", "page"], searchReset = [], className }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const current = sp.toString();
  const qParam = search?.param ?? "q";
  const [q, setQ] = React.useState(sp.get(qParam) ?? "");
  const [showMore, setShowMore] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const shown = selects.slice(0, 3);
  const all = [...(search ? [qParam] : []), ...shown.map((s) => s.param)];
  const active = activeCount(current, all);
  const activeSelects = activeCount(current, shown.map((s) => s.param));
  const id = React.useId();

  function go(changes: Record<string, string | null>, extraReset: string[] = []) {
    const next = nextQuery(window.location.search.slice(1), changes, [...reset, ...extraReset]);
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function onSearch(v: string) {
    setQ(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => go({ [qParam]: v.trim() || null }, searchReset), 300);
  }

  function clear() {
    if (timer.current) clearTimeout(timer.current);
    setQ("");
    go(Object.fromEntries(all.map((k) => [k, null])), searchReset);
  }

  return (
    <div role="search" aria-label="Filter the list" className={cn("flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center", className)}>
      {search ? (
        <div className="relative min-w-0 sm:min-w-56 sm:flex-1">
          <label htmlFor={`${id}-q`} className="sr-only">
            {search.label}
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id={`${id}-q`}
            type="search"
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (timer.current) clearTimeout(timer.current);
                go({ [qParam]: q.trim() || null }, searchReset);
              }
            }}
            placeholder={search.placeholder ?? search.label}
            className={cn(control, "pl-9 text-base sm:text-sm")}
          />
        </div>
      ) : null}

      {shown.length ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 self-start sm:hidden pointer-coarse:h-11"
          aria-expanded={showMore}
          aria-controls={`${id}-selects`}
          onClick={() => setShowMore((v) => !v)}
        >
          <ListFilter aria-hidden /> Filters{activeSelects ? ` (${activeSelects})` : ""}
        </Button>
      ) : null}

      <div id={`${id}-selects`} className={cn("grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center", showMore ? "grid" : "hidden")}>
        {shown.map((s) => {
          const value = sp.get(s.param) ?? "";
          return (
            <div key={s.param} className="min-w-0 sm:w-auto">
              <label htmlFor={`${id}-${s.param}`} className="sr-only">
                {s.label}
              </label>
              <select
                id={`${id}-${s.param}`}
                value={value}
                onChange={(e) => go({ [s.param]: e.target.value || null })}
                className={cn(control, "sm:w-auto sm:max-w-60", value && "bg-secondary")}
              >
                <option value="">{s.allLabel}</option>
                {s.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {active ? (
        <Button type="button" variant="ghost" size="sm" className="h-10 self-start pointer-coarse:h-11" onClick={clear}>
          <X aria-hidden /> Clear{active > 1 ? ` (${active})` : ""}
        </Button>
      ) : null}
    </div>
  );
}
