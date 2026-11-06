"use client";

import * as React from "react";
import Link from "next/link";
import { BookA, Check, Pill, Search, Stethoscope, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type RefKind = "disorder" | "medicine" | "term";
export type RefListItem = { slug: string; label: string; kind: RefKind; summary: string; aliases: string[]; letter: string };

export const KIND_META: Record<RefKind, { label: string; plural: string; Icon: typeof Pill; tag: string }> = {
  disorder: { label: "Disorder", plural: "Disorders", Icon: Stethoscope, tag: "bg-status-info-bg text-status-info-fg" },
  medicine: { label: "Medicine", plural: "Medicines", Icon: Pill, tag: "bg-status-success-bg text-status-success-fg" },
  term: { label: "Word", plural: "Words", Icon: BookA, tag: "bg-status-pending-bg text-status-pending-fg" },
};

const LETTERS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "#"];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function score(item: RefListItem, q: string): number {
  const label = norm(item.label);
  if (label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (item.aliases.some((a) => norm(a) === q)) return 75;
  if (label.split(" ").some((w) => w.startsWith(q))) return 60;
  if (label.includes(q)) return 50;
  if (item.aliases.some((a) => norm(a).includes(q))) return 40;
  if (norm(item.summary).includes(q)) return 20;
  return 0;
}

export function KindTag({ kind, className }: { kind: RefKind; className?: string }) {
  const m = KIND_META[kind];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-foreground/20 px-2 py-0.5 text-caption font-bold", m.tag, className)}>
      <m.Icon className="size-3.5" aria-hidden />
      {m.label}
    </span>
  );
}

function Row({ item }: { item: RefListItem }) {
  return (
    <li>
      <Link
        href={`/study/reference/${item.slug}`}
        className="flex min-h-14 items-start gap-3 rounded-md border-2 border-transparent px-3 py-2.5 transition-[transform,background-color,border-color] duration-fast ease-snappy hover:border-foreground hover:bg-accent focus-visible:border-foreground"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-bold leading-snug">{item.label}</span>
          <span className="line-clamp-2 text-small text-muted-foreground">{item.summary}</span>
        </span>
        <KindTag kind={item.kind} className="mt-0.5" />
      </Link>
    </li>
  );
}

/**
 * Quick Reference A–Z: search, filter by kind, jump by letter. Every row opens
 * its own page. A separate library (owner rule: never inside lessons).
 */
export function ReferenceLibrary({ items, initialQuery = "", initialKind = "all" }: { items: RefListItem[]; initialQuery?: string; initialKind?: RefKind | "all" }) {
  const [query, setQuery] = React.useState(initialQuery);
  const [kind, setKind] = React.useState<RefKind | "all">(initialKind);
  const deferred = React.useDeferredValue(query);
  const q = norm(deferred);

  const counts = React.useMemo(() => {
    const c = { all: items.length, disorder: 0, medicine: 0, term: 0 };
    for (const i of items) c[i.kind]++;
    return c;
  }, [items]);

  const shown = React.useMemo(() => {
    const pool = kind === "all" ? items : items.filter((i) => i.kind === kind);
    if (!q) return pool;
    return pool
      .map((i) => ({ i, s: score(i, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.i.label.localeCompare(b.i.label))
      .map((x) => x.i);
  }, [items, kind, q]);

  const byLetter = React.useMemo(() => {
    const m = new Map<string, RefListItem[]>();
    for (const i of shown) m.set(i.letter, [...(m.get(i.letter) ?? []), i]);
    return m;
  }, [shown]);

  const syncUrl = (nextQ: string, nextKind: RefKind | "all") => {
    try {
      const u = new URL(window.location.href);
      if (nextQ.trim()) u.searchParams.set("q", nextQ.trim());
      else u.searchParams.delete("q");
      if (nextKind !== "all") u.searchParams.set("kind", nextKind);
      else u.searchParams.delete("kind");
      window.history.replaceState(window.history.state, "", u.toString());
    } catch {
      /* URL sync is a convenience only */
    }
  };

  const filters: { id: RefKind | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "disorder", label: KIND_META.disorder.plural },
    { id: "medicine", label: KIND_META.medicine.plural },
    { id: "term", label: KIND_META.term.plural },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="ref-q" className="sr-only">Search the Quick Reference</label>
          <input
            id="ref-q"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              syncUrl(e.target.value, kind);
            }}
            placeholder="Search: e.g. bipolar, sertraline, anhedonia"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full rounded-md border-2 border-foreground bg-background pr-12 pl-12 text-base outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                syncUrl("", kind);
              }}
              className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-md hover:bg-accent"
              aria-label="Clear search"
            >
              <X className="size-5" aria-hidden />
            </button>
          ) : null}
        </div>
        <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const on = kind === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setKind(f.id);
                  syncUrl(query, f.id);
                }}
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-foreground px-4 text-sm font-bold transition-colors duration-fast",
                  on ? "bg-primary text-primary-foreground hard-shadow-sm" : "bg-card hover:bg-accent",
                )}
              >
                {on ? <Check className="size-4" aria-hidden /> : null}
                {f.label}
                <span className="font-mono text-caption opacity-80">{counts[f.id]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!q ? (
        <nav aria-label="Jump to letter" className="sticky top-0 z-10 -mx-4 border-y-2 border-foreground bg-background/95 px-4 py-1.5 backdrop-blur sm:mx-0 sm:rounded-md sm:border-2 lg:top-16">
          <ul className="flex gap-1 overflow-x-auto [scrollbar-width:thin]">
            {LETTERS.map((l) => {
              const has = byLetter.has(l);
              return (
                <li key={l} className="shrink-0">
                  {has ? (
                    <a href={`#letter-${l === "#" ? "num" : l}`} className="grid size-11 place-items-center rounded-md font-mono text-sm font-bold hover:bg-accent focus-visible:bg-accent">
                      {l}
                    </a>
                  ) : (
                    <span className="grid size-11 place-items-center font-mono text-sm text-muted-foreground/50" aria-hidden>
                      {l}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}

      <p className="text-small text-muted-foreground" aria-live="polite">
        {q ? `${shown.length} ${shown.length === 1 ? "match" : "matches"} for “${deferred.trim()}”` : `${shown.length} entries, A to Z`}
      </p>

      {shown.length === 0 ? (
        <div className="rounded-md border-2 border-dashed border-foreground/30 p-6 text-center text-sm text-muted-foreground">
          Nothing matches. Try a shorter word, or another spelling.
        </div>
      ) : q ? (
        <ul className="space-y-1 rounded-md border-2 border-foreground bg-card p-1.5">
          {shown.slice(0, 80).map((i) => <Row key={i.slug} item={i} />)}
        </ul>
      ) : (
        <div className="space-y-5">
          {LETTERS.filter((l) => byLetter.has(l)).map((l) => (
            <section key={l} id={`letter-${l === "#" ? "num" : l}`} aria-labelledby={`h-${l === "#" ? "num" : l}`} className="scroll-mt-32 lg:scroll-mt-48">
              <h2 id={`h-${l === "#" ? "num" : l}`} className="mb-1.5 flex items-center gap-2 font-mono text-h3 font-bold text-link">
                <span className="inline-block size-2 rounded-[2px] bg-primary" aria-hidden />
                {l}
              </h2>
              <ul className="space-y-1 rounded-md border-2 border-foreground bg-card p-1.5">
                {byLetter.get(l)!.map((i) => <Row key={i.slug} item={i} />)}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
