"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBand } from "@/lib/psychopharm/format";
import { MobileErrorLine } from "@/components/mobile/mobile-error-line";

/**
 * Dr. Sarthak reviewed the data; this component only navigates to static,
 * pre-approved records. Never generates text at request time (Rule 1).
 *
 * Step 1 of the three-tap flow: name → dose chips → band view.
 * Autofocuses on load; type → arrow → enter. No submit button.
 */
interface BandChip {
  low?: number | null;
  high?: number | null;
  unit?: string;
  band_label?: string;
  band_type?: string;
}

export function PsychSearch({
  className,
  compareTo,
}: {
  className?: string;
  /** When set, this search adds a picked drug to a comparison instead of
      opening its drug page (T32 compare picker). */
  compareTo?: string[];
}) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [list, setList] = React.useState<string[]>([]);
  const [fuzzy, setFuzzy] = React.useState(false);
  const [highlight, setHighlight] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [bands, setBands] = React.useState<BandChip[]>([]);
  const [searchError, setSearchError] = React.useState(false);
  const [bandError, setBandError] = React.useState(false);
  const [searchRetry, setSearchRetry] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const current = q.trim();
    if (!current) return; // empty handled in onChange
    let cancelled = false;
    // Deterministic prefix search over static data (no model).
    fetch(`/api/psychopharm/search?q=${encodeURIComponent(current)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          // Backwards-compatible: the API now returns { matches, fuzzy }.
          const matches = Array.isArray(d) ? d : d?.matches ?? [];
          setList(matches);
          setFuzzy(Array.isArray(d) ? false : Boolean(d?.fuzzy));
          setHighlight(0);
          setSearchError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setList([]);
          setSearchError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [q, searchRetry]);

  function loadBands(name: string) {
    setBandError(false);
    setBands([]);
    // Fetch that drug's dose bands for the chip step; navigation happens
    // AFTER the user taps a dose chip (show → act → reveal next), not here.
    fetch(`/api/psychopharm/bands?drug=${encodeURIComponent(name)}`)
      .then((r) => r.json())
      .then((d) => setBands(Array.isArray(d) ? d : []))
      .catch(() => setBandError(true));
  }

  function pick(name: string) {
    if (compareTo) {
      // Compare picker: add this drug to the comparison and land on it.
      const parts = [...compareTo, slugFor(name)].slice(0, 5);
      const qs = parts
        .map((p, i) => `${String.fromCharCode(97 + i)}=${encodeURIComponent(p)}`)
        .join("&");
      router.push(`/tools/psychopharm/compare?${qs}`);
      return;
    }
    setSelected(name);
    setList([]);
    setQ(name);
    setSearchError(false);
    loadBands(name);
  }

  function go(slug: string, band?: number) {
    const base = `/tools/psychopharm/${slug}`;
    router.push(band != null ? `${base}?band=${band}` : base);
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = list[highlight] ?? list[0];
      if (target) pick(target);
    } else if (e.key === "Escape") {
      setList([]);
      setQ("");
      setSelected(null);
      setBands([]);
      setSearchError(false);
      setBandError(false);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            const v = e.target.value;
            setQ(v);
            setSearchError(false);
            if (!v.trim()) {
              setList([]);
              setHighlight(0);
            }
          }}
          onKeyDown={onKey}
          type="text"
          role="combobox"
          aria-expanded={list.length > 0}
          aria-controls={list.length ? "psych-suggestions" : undefined}
          aria-label="Search medications"
          placeholder="Try clonazepam, risperidone, sertraline…"
          className="h-12 w-full rounded-md border-2 border-border bg-background pl-10 pr-4 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        />
      </div>

      {list.length > 0 ? (
        <>
          {fuzzy ? (
            <p className="mt-1 text-caption text-muted-foreground">Did you mean…</p>
          ) : null}
          <ul
            id="psych-suggestions"
            role="listbox"
            aria-label="Search suggestions"
            className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border-2 border-border bg-card hard-shadow-sm"
          >
          {list.map((item, i) => (
            <li
              key={item}
              role="option"
              aria-selected={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(item);
              }}
              className={cn(
                "flex flex-col px-3 py-2.5 text-sm",
                i === highlight ? "bg-primary/10" : "",
              )}
            >
              {item}
            </li>
          ))}
          </ul>
        </>
      ) : null}

      {searchError && !list.length && q.trim() ? (
        <div className="mt-2">
          <MobileErrorLine>
            Couldn&apos;t search medications.{" "}
            <button
              type="button"
              onClick={() => setSearchRetry((n) => n + 1)}
              className="underline underline-offset-2"
            >
              Try again
            </button>
          </MobileErrorLine>
        </div>
      ) : null}

      {/* Dose chips (D2 step 2): after a drug is picked, offer its bands. */}
      {selected ? (
        <div className="mt-2 space-y-1.5">
          {bands.length > 0 ? (
            <>
              <p className="text-caption text-muted-foreground">Pick a dose for {selected}:</p>
              <div className="flex flex-wrap gap-2">
                {bands.map((b, i) => {
                  const range = b.band_label || formatBand(b);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => go(slugFor(selected), i + 1)}
                      className="min-h-11 rounded-full border-2 border-border px-3 py-1.5 text-sm hover:bg-accent active:translate-y-px"
                    >
                      {range}
                      {b.band_type ? <span className="ml-1 text-caption text-muted-foreground">({b.band_type})</span> : null}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => go(slugFor(selected))}
                  className="min-h-11 rounded-full border-2 border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent active:translate-y-px"
                >
                  Show all doses
                </button>
              </div>
            </>
          ) : bandError ? (
            <>
              <MobileErrorLine>
                Couldn&apos;t load doses for {selected}.{" "}
                <button
                  type="button"
                  onClick={() => loadBands(selected)}
                  className="underline underline-offset-2"
                >
                  Try again
                </button>
              </MobileErrorLine>
              <button
                type="button"
                onClick={() => go(slugFor(selected))}
                className="min-h-11 rounded-full border-2 border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent active:translate-y-px"
              >
                Open {selected} without a dose
              </button>
            </>
          ) : (
            <p className="text-caption text-muted-foreground">Loading doses…</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function slugFor(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}