"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchMeds, type MedIndexRow } from "@/lib/meds/search";
import type { MedGroup } from "@/lib/meds/types";
import { GROUP_COLOR } from "@/lib/meds/colors";
import { MemeArt } from "@/components/reactions/graphics";
import { cn } from "@/lib/utils";

/**
 * The medicine library (new design). Search first; the groups are one row of
 * chips that scrolls sideways; then every medicine as a list: a table (name,
 * class, usual dose) on wide screens, compact rows on phones. The whole list
 * is in the page, so it filters on every key press. Enter opens the top hit.
 * Every medicine is listed; nothing is cut or folded away.
 */
export function MedicineLibrary({ rows, groups, doses }: { rows: MedIndexRow[]; groups: MedGroup[]; /** The usual dose of each medicine, by id. */ doses: Record<string, string> }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [group, setGroup] = React.useState<MedGroup | "All">("All");
  const input = React.useRef<HTMLInputElement>(null);
  // With a keyboard the box is ready to type in; on a phone the keyboard stays down until asked for.
  React.useEffect(() => {
    if (typeof window.matchMedia === "function" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) input.current?.focus();
  }, []);

  const found = React.useMemo(() => {
    const r = searchMeds(rows, q);
    return group === "All" ? r : r.filter((x) => x.group === group);
  }, [rows, q, group]);

  const cols = "md:grid md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,0.6fr)] md:gap-x-6";

  return (
    <div className="flex min-w-0 flex-col gap-4">
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
          placeholder="Name, brand, group or condition"
          className="h-14 w-full min-w-0 rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] bg-card pr-12 pl-12 type-body font-medium outline-none transition-[border-color] duration-[var(--ds-state)] ease-[var(--ds-ease)] placeholder:text-muted-foreground hover:border-foreground focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
        />
        {q ? (
          <button type="button" onClick={() => { setQ(""); input.current?.focus(); }} aria-label="Clear search" className="absolute top-1/2 right-1.5 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-[var(--ds-tint)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <X className="size-5" aria-hidden />
          </button>
        ) : null}
      </form>

      {/* One row at every width; it scrolls sideways when the chips do not fit. */}
      <div className="chip-scroller -mx-1 gap-2 px-1 py-1" role="group" aria-label="Filter by group">
        {(["All", ...groups] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            aria-pressed={group === g}
            // Each family chip carries a faint wash of its own colour (the spine's); the chosen one fills with the Library colour.
            style={g !== "All" && group !== g ? ({ "--chip": GROUP_COLOR[g] } as React.CSSProperties) : undefined}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-full border-[1.5px] px-4 type-small font-semibold whitespace-nowrap outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring",
              group === g ? "ds-chip-on border-foreground bg-foreground text-background" : g !== "All" ? "ds-chip-family hover:border-foreground" : "border-[var(--ds-card-line)] hover:border-foreground",
            )}
          >
            {/* The family's colour: the same one as the spine on its rows below. */}
            {g !== "All" ? <span aria-hidden className={cn("size-2.5 shrink-0 rounded-full", group === g && "ring-2 ring-current")} style={{ background: GROUP_COLOR[g] }} /> : null}
            {g}
          </button>
        ))}
      </div>

      <p className="type-small text-muted-foreground type-num" aria-live="polite">
        {found.length} {found.length === 1 ? "medicine" : "medicines"}
        {q ? ` for "${q}"` : ""}
      </p>

      {found.length ? (
        <div className="min-w-0">
          {/* Column names: wide screens only (on phones each row carries its own words). */}
          <div aria-hidden className={cn("hidden border-b border-[var(--ds-hairline)] pb-2 pl-3 type-pix text-muted-foreground", cols)}>
            <span>Medicine</span>
            <span>Class</span>
            <span className="text-right">Usual dose</span>
          </div>
          <ul aria-label="Medicines" className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-b border-[var(--ds-hairline)] max-md:border-t">
            {found.map((m) => (
              <li key={m.id} className="min-w-0">
                <Link
                  href={`/practice/medicines/${m.id}`}
                  style={{ "--spine": GROUP_COLOR[m.group] } as React.CSSProperties}
                  className={cn(
                    "group/med ds-spine -mx-2 flex min-h-14 min-w-0 flex-col gap-0.5 rounded-lg py-3 pr-2 pl-5 hover:before:scale-x-150 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)] md:items-baseline",
                    cols,
                  )}
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="flex min-w-0 items-baseline justify-between gap-3">
                      <span className="min-w-0 type-body font-bold [overflow-wrap:anywhere]">{m.name}</span>
                      {/* Phones: the dose sits beside the name. */}
                      {doses[m.id] ? <span className="shrink-0 type-small font-semibold type-num md:hidden">{doses[m.id]}</span> : null}
                    </span>
                    <span className="type-small font-semibold ds-accent [overflow-wrap:anywhere] md:hidden">{m.cls}</span>
                    {m.line ? <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{m.line}</span> : null}
                    {m.brands.length ? <span className="type-caption text-muted-foreground [overflow-wrap:anywhere]">{m.brands.join(" · ")}</span> : null}
                  </span>
                  <span className="hidden min-w-0 type-small font-semibold ds-accent [overflow-wrap:anywhere] md:block">{m.cls}</span>
                  <span className="hidden min-w-0 text-right type-small font-semibold type-num [overflow-wrap:anywhere] md:block">{doses[m.id] ?? ""}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex min-w-0 items-start gap-4">
          <MemeArt sticker="screaming-point-cat" size={64} />
        <p className="max-w-[60ch] type-body text-muted-foreground">
          Nothing found. Try the generic name, a brand, or a condition like &quot;OCD&quot;. Rarer medicines are in the{" "}
          <Link href="/tools/psychopharm/learn" className="font-semibold text-link underline underline-offset-4">
            full reference
          </Link>
          .
        </p>
        </div>
      )}
    </div>
  );
}
