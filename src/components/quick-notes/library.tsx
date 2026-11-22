"use client";

import Link from "next/link";
import * as React from "react";
import { Pin, Search, X } from "lucide-react";
import { chipClass, chipRow, EmptyLine, Row, RowList, Section } from "@/components/ds";
import type { QuickItem, QuickLibrary, QuickSearch, QuickType } from "@/lib/quick-notes/view-types";
import { useQuickPins } from "./pins";

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Instant match on names while the search inside the notes is on its way. */
function quickScore(i: QuickItem, q: string): number {
  const t = norm(i.title);
  if (t === q) return 100;
  if (t.startsWith(q)) return 60;
  if (` ${t}`.includes(` ${q}`)) return 40;
  if (i.aka.some((a) => norm(a) === q)) return 80;
  if (i.aka.some((a) => ` ${norm(a)}`.includes(` ${q}`))) return 30;
  if (` ${norm(i.line)}`.includes(` ${q}`)) return 10;
  return 0;
}

const TYPE_TAG: Record<QuickType, string> = { criteria: "Criteria", summary: "Summary", differential: "Differential", distinction: "Compare", theory: "Theory", therapy: "Therapy", pharm: "Medicine", assessment: "Assessment", term: "Word", exam: "Exam points" };

/** Inside a topic: the typed Quick Notes first, then one-page summaries, older cards and medicines, words last. */
const rank = (i: QuickItem) => (i.type === "term" ? 3 : !i.key.includes(":") ? 0 : i.key.startsWith("note:") ? 1 : 2);

function Tag({ type }: { type: QuickType }) {
  return <span className="shrink-0 rounded-full bg-[var(--ds-tint)] px-2 py-0.5 type-caption font-semibold text-muted-foreground">{TYPE_TAG[type]}</span>;
}

function ItemRow({ i, snippet }: { i: QuickItem; snippet?: string | null }) {
  return <Row href={i.href} title={i.title} meta={snippet ? <span className="italic">{snippet}</span> : i.line} trailing={<Tag type={i.type} />} />;
}

/**
 * Quick Notes: one library. Search reads the text inside every note; one row
 * of type chips; pinned and recently opened; then every note by topic, A to Z.
 */
export function QuickNotesLibrary({ lib, owner, initialQuery = "", initialType = "all" }: { lib: QuickLibrary; owner: string | null; initialQuery?: string; initialType?: QuickType | "all" }) {
  const [query, setQuery] = React.useState(initialQuery);
  const [type, setType] = React.useState<QuickType | "all">(initialType);
  const [found, setFound] = React.useState<QuickSearch | null>(null);
  const { pinned, recent } = useQuickPins(owner);
  const q = norm(React.useDeferredValue(query));
  const byKey = React.useMemo(() => new Map(lib.items.map((i) => [i.key, i])), [lib.items]);

  // The search inside the notes: debounced, last answer wins. "Searching" is derived: a query whose answer has not come yet.
  React.useEffect(() => {
    if (!q) return;
    const ctl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/quick-notes/search?q=${encodeURIComponent(q)}`, { signal: ctl.signal })
        .then((r) => (r.ok ? (r.json() as Promise<QuickSearch>) : { q, hits: [] }))
        .then((d) => setFound({ ...d, q }))
        .catch(() => {
          if (!ctl.signal.aborted) setFound({ q, hits: [] });
        });
    }, 160);
    return () => {
      clearTimeout(t);
      ctl.abort();
    };
  }, [q]);
  const searching = !!q && (!found || norm(found.q) !== q);

  const syncUrl = (nextQ: string, nextType: QuickType | "all") => {
    try {
      const u = new URL(window.location.href);
      if (nextQ.trim()) u.searchParams.set("q", nextQ.trim());
      else u.searchParams.delete("q");
      if (nextType !== "all") u.searchParams.set("type", nextType);
      else u.searchParams.delete("type");
      window.history.replaceState(window.history.state, "", u.toString());
    } catch {
      /* the address is a convenience only */
    }
  };

  const ofType = (i: QuickItem) => type === "all" || i.type === type;

  const results = React.useMemo(() => {
    if (!q) return null;
    const out: { i: QuickItem; snippet: string | null }[] = [];
    const seen = new Set<string>();
    if (found && norm(found.q) === q) {
      for (const h of found.hits) {
        const i = byKey.get(h.key);
        if (i && ofType(i) && !seen.has(i.key)) {
          seen.add(i.key);
          out.push({ i, snippet: h.snippet });
        }
      }
    }
    // Name matches show at once, and stay if the full search did not return them.
    const quick = lib.items
      .filter((i) => ofType(i) && !seen.has(i.key))
      .map((i) => ({ i, s: quickScore(i, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.i.title.localeCompare(b.i.title))
      .slice(0, 40)
      .map((x) => ({ i: x.i, snippet: null }));
    return found && norm(found.q) === q ? [...out, ...quick] : [...quick, ...out];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, found, type, lib.items, byKey]);

  const groups = React.useMemo(() => {
    const m = new Map<string, QuickItem[]>();
    for (const i of lib.items) if (ofType(i)) m.set(i.topic, [...(m.get(i.topic) ?? []), i]);
    for (const list of m.values()) list.sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
    return lib.topics.filter((t) => m.has(t.id)).map((t) => ({ ...t, items: m.get(t.id)! }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lib, type]);

  const pinItems = pinned.map((k) => byKey.get(k)).filter((i): i is QuickItem => !!i);
  const recentItems = recent.filter((k) => !pinned.includes(k)).map((k) => byKey.get(k)).filter((i): i is QuickItem => !!i).slice(0, 5);

  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-section)]">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="qn-q" className="sr-only">
            Search every Quick Note
          </label>
          <input
            id="qn-q"
            type="search"
            value={query}
            onChange={(ev) => {
              setQuery(ev.target.value);
              syncUrl(ev.target.value, type);
            }}
            placeholder="Search: ADHD, lithium level"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full rounded-full border-[1.5px] border-[var(--ds-card-line)] bg-card pr-12 pl-12 type-body outline-hidden focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                syncUrl("", type);
              }}
              className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-full hover:bg-[var(--ds-tint)]"
              aria-label="Clear the search"
            >
              <X className="size-5" aria-hidden />
            </button>
          ) : null}
        </div>
        <div role="group" aria-label="Show" className={chipRow}>
          {[{ id: "all" as const, label: "All" }, ...lib.types].map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={type === t.id}
              className={chipClass(type === t.id)}
              onClick={() => {
                setType(t.id);
                syncUrl(query, t.id);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {results ? (
        <Section title={searching && !results.length ? "Searching" : "Results"}>
          <p className="sr-only" aria-live="polite">
            {searching ? "Searching" : `${results.length} found`}
          </p>
          {results.length ? (
            <RowList>
              {results.slice(0, 60).map(({ i, snippet }) => (
                <ItemRow key={i.key} i={i} snippet={snippet} />
              ))}
            </RowList>
          ) : searching ? null : (
            <EmptyLine title="Nothing matches">Try a shorter word or another spelling, or show All.</EmptyLine>
          )}
        </Section>
      ) : (
        <>
          {pinItems.length ? (
            <Section title="Pinned">
              <RowList>
                {pinItems.map((i) => (
                  <ItemRow key={i.key} i={i} />
                ))}
              </RowList>
            </Section>
          ) : null}
          {recentItems.length ? (
            <Section title="Recently opened">
              <RowList>
                {recentItems.map((i) => (
                  <ItemRow key={i.key} i={i} />
                ))}
              </RowList>
            </Section>
          ) : null}
          {!pinItems.length ? (
            <p className="flex items-center gap-2 type-small text-muted-foreground">
              <Pin className="size-4 shrink-0" aria-hidden /> Pin a note from its page to keep it at the top here.
            </p>
          ) : null}
          <nav aria-label="Jump to a topic" className="-mt-4 flex min-w-0 flex-wrap gap-x-4 type-small">
            {groups.map((g) => (
              <Link key={g.id} href={`#topic-${g.id}`} className="inline-flex min-h-11 items-center font-semibold underline decoration-[var(--ds-card-line)] underline-offset-4 hover:decoration-foreground">
                {g.label}
              </Link>
            ))}
          </nav>
          {groups.map((g) => (
            <Section key={g.id} id={`topic-${g.id}`} title={g.label} className="scroll-mt-24 [contain-intrinsic-size:auto_900px] [content-visibility:auto]">
              <RowList>
                {g.items.map((i) => (
                  <ItemRow key={i.key} i={i} />
                ))}
              </RowList>
            </Section>
          ))}
        </>
      )}
    </div>
  );
}
