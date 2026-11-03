"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Pill, Search, X } from "lucide-react";
import { searchMeds, type MedIndexRow } from "@/lib/meds/search";
import type { MedGroup } from "@/lib/meds/types";
import { cn } from "@/lib/utils";

/**
 * Instant medicine search: the whole list is in the page, so results update
 * on every key press with no waiting. Name, brand, class or use; small typos
 * are forgiven. Enter opens the top result.
 */
export function MedicineSearch({ rows, groups }: { rows: MedIndexRow[]; groups: MedGroup[] }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [group, setGroup] = React.useState<MedGroup | "All">("All");
  const input = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => input.current?.focus(), []);

  const found = React.useMemo(() => {
    const r = searchMeds(rows, q);
    return group === "All" ? r : r.filter((x) => x.group === group);
  }, [rows, q, group]);

  return (
    <div className="space-y-5">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (found[0]) router.push(`/practice/medicines/${found[0].id}`);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="search"
          inputMode="search"
          autoComplete="off"
          aria-label="Search medicines by name, brand, group or use"
          placeholder="Sertraline, Oleanz, lithium, OCD…"
          className="h-14 w-full rounded-2xl border-2 border-foreground bg-card pr-12 pl-12 text-lg font-medium hard-shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        />
        {q ? (
          <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full hover:bg-muted">
            <X className="size-5" aria-hidden />
          </button>
        ) : null}
      </form>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by group">
        {(["All", ...groups] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            aria-pressed={group === g}
            className={cn("h-9 shrink-0 rounded-full border-2 border-foreground px-3.5 text-sm font-semibold", group === g ? "bg-foreground text-background" : "bg-card")}
          >
            {g}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {found.length} {found.length === 1 ? "medicine" : "medicines"}
        {q ? ` for "${q}"` : ""}
      </p>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {found.map((m) => (
          <li key={m.id} className="min-w-0">
            <Link href={`/practice/medicines/${m.id}`} className="group flex h-full items-start gap-3 rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-foreground bg-primary text-primary-foreground">
                <Pill className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold leading-tight">{m.name}</span>
                <span className="block text-xs font-semibold text-link">{m.cls}</span>
                <span className="mt-1 block text-sm leading-snug text-muted-foreground">{m.line}</span>
                {m.brands.length ? <span className="mt-1 block truncate text-xs text-muted-foreground">{m.brands.join(" · ")}</span> : null}
              </span>
              <ArrowRight className="mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      {!found.length ? (
        <p className="rounded-2xl border-2 border-dashed border-foreground p-5 text-sm">
          Nothing found. Try the generic name, a brand, or a condition like &quot;OCD&quot;. Rarer medicines are in the{" "}
          <Link href="/tools/psychopharm/learn" className="font-semibold text-link underline">
            full reference
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
