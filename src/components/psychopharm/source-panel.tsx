"use client";

import * as React from "react";
import { Search, Loader2, BookMarked } from "lucide-react";
import type { MedBlock, SourceRef } from "@/lib/psychopharm/document";
import { BLOCK_TYPE_LABEL } from "./document-view";
import { cn } from "@/lib/utils";

/** A knowledge-search hit (subset of the /api/knowledge/search payload). */
interface KnowledgeHit {
  id: string;
  text: string;
  sourceName: string;
  sourceTitle: string;
  chapter: string;
  section: string;
  pageStart: number | null;
  pageEnd: number | null;
  citation: string;
}

/**
 * Per-block source panel. Shows the book/edition/page/quote behind a block and
 * lets an editor attach or edit them. Appears for the selected block in the
 * editor's right rail.
 *
 * The "Search books" row queries the knowledge layer (/api/knowledge/search):
 * the authorised corpus, and one click fills the title/page/quote from a real,
 * traceable passage. This is how the psychopharmacology editor consumes the
 * knowledge system (brief §24): source attribution from the corpus, never
 * hand-fabricated.
 */
export function SourcePanel({
  block,
  onChange,
  look,
}: {
  block: MedBlock;
  onChange: (sources: SourceRef[]) => void;
  /** "v2": the new admin design (no box, labelled fields, 44px on touch). */
  look?: "v2";
}) {
  const [title, setTitle] = React.useState(block.sources[0]?.title ?? "");
  const [page, setPage] = React.useState(block.sources[0]?.page ?? "");
  const [quote, setQuote] = React.useState(block.sources[0]?.quote ?? "");
  const [sourceId, setSourceId] = React.useState(block.sources[0]?.source_id ?? "");

  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<KnowledgeHit[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  async function runSearch() {
    const q = search.trim();
    if (!q) return;
    setSearching(true);
    setSearched(false);
    try {
      const res = await fetch(`/api/knowledge/search?q=${encodeURIComponent(q)}&limit=5`);
      const body = await res.json();
      setResults(Array.isArray(body.hits) ? body.hits : []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
      setSearched(true);
    }
  }

  function applyHit(hit: KnowledgeHit) {
    setTitle(hit.sourceTitle || hit.sourceName);
    setSourceId(hit.sourceName);
    setPage(
      hit.pageStart != null
        ? hit.pageEnd != null && hit.pageEnd !== hit.pageStart
          ? `${hit.pageStart}-${hit.pageEnd}`
          : String(hit.pageStart)
        : "",
    );
    setQuote(hit.text.slice(0, 500));
    setResults([]);
    setSearch("");
    setSearched(false);
    // Save immediately with the picked passage.
    onChange([
      {
        source_id: hit.sourceName,
        title: hit.sourceTitle || hit.sourceName,
        edition: undefined,
        page:
          hit.pageStart != null
            ? hit.pageEnd != null && hit.pageEnd !== hit.pageStart
              ? `${hit.pageStart}-${hit.pageEnd}`
              : String(hit.pageStart)
            : "",
        quote: hit.text.slice(0, 500),
      },
    ]);
  }

  function commit() {
    const src: SourceRef = {
      source_id: sourceId || undefined,
      title: title || block.sources[0]?.title,
      edition: block.sources[0]?.edition,
      page: page || block.sources[0]?.page,
      quote: quote || block.sources[0]?.quote,
    };
    onChange([src]);
  }

  if (look === "v2") {
    const field =
      "h-11 w-full min-w-0 rounded-md border border-[var(--ds-card-line)] bg-background px-3 type-small text-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:border-foreground/50 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring lg:h-9";
    const label = "flex min-w-0 flex-col gap-1.5 type-small font-semibold";
    return (
      <div className="flex min-w-0 flex-col gap-3">
        <p className="type-small text-muted-foreground">{BLOCK_TYPE_LABEL[block.type] ?? "Note"}</p>
        <div className="flex min-w-0 items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Search the books"
            aria-label="Search the books for this block's source"
            className={cn(field, "flex-1")}
          />
          <button
            type="button"
            onClick={runSearch}
            disabled={searching || !search.trim()}
            aria-label="Search books"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-[var(--ds-card-line)] outline-none transition-colors duration-[var(--ds-state)] hover:border-foreground/60 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-45 lg:size-9"
          >
            {searching ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : <Search className="size-4" aria-hidden />}
          </button>
        </div>
        {searched && !searching && results.length === 0 ? <p className="type-small text-muted-foreground">Nothing found. Try other words.</p> : null}
        {results.length > 0 ? (
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {results.map((h) => (
              <li key={h.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => applyHit(h)}
                  className="-mx-2 flex w-[calc(100%+1rem)] min-w-0 flex-col gap-0.5 rounded-lg px-2 py-2.5 text-left outline-none transition-colors duration-[var(--ds-state)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="type-small font-semibold [overflow-wrap:anywhere]">{h.citation}</span>
                  <span className="line-clamp-2 type-caption text-muted-foreground">{h.text}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <label className={label}>
          Book or guideline
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={cn(field, "font-normal")} />
        </label>
        <label className={label}>
          Page
          <input value={page} onChange={(e) => setPage(e.target.value)} inputMode="numeric" className={cn(field, "font-normal")} />
        </label>
        <label className={label}>
          Quote
          <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} className={cn(field, "h-auto py-2 font-normal lg:h-auto")} />
        </label>
        <button
          type="button"
          onClick={commit}
          className="inline-flex h-11 w-fit items-center justify-center rounded-md border border-foreground bg-foreground px-3 type-small font-semibold text-background outline-none transition-opacity duration-[var(--ds-state)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring lg:h-9"
        >
          Save source
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-md border-2 border-dashed border-border p-3">
      <p className="text-caption font-semibold uppercase text-muted-foreground">
        Source · {BLOCK_TYPE_LABEL[block.type] ?? "Note"}
      </p>

      {/* Search the authorised book corpus */}
      <div className="mt-2 flex items-center gap-1">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
          placeholder="Search the books (e.g. 'clozapine agranulocytosis')"
          aria-label="Search the authorised book corpus for this block's source"
          className="min-h-11 min-w-0 flex-1 rounded-md border-2 border-border px-3 text-base outline-none focus:border-link"
        />
        <button
          type="button"
          onClick={runSearch}
          disabled={searching || !search.trim()}
          aria-label="Search books"
          className="rounded-md border-2 border-border px-2 py-1 text-sm hover:border-link disabled:opacity-50"
        >
          {searching ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Search className="size-3.5" aria-hidden />}
        </button>
      </div>

      {searching && <p className="mt-1 text-caption text-muted-foreground">Searching the corpus…</p>}
      {searched && !searching && results.length === 0 && (
        <p className="mt-1 text-caption text-muted-foreground">No source passages found: try different words.</p>
      )}
      {results.length > 0 && (
        <ul className="mt-2 space-y-1">
          {results.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => applyHit(h)}
                className="w-full rounded-md border border-border px-2 py-1 text-left text-caption hover:border-link hover:text-link"
              >
                <span className="flex items-center gap-1 font-medium">
                  <BookMarked className="size-3" aria-hidden /> {h.citation}
                </span>
                <span className="line-clamp-2 text-muted-foreground">{h.text}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Manual fields */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Book / guideline title"
        className="mt-2 w-full rounded-md border-2 border-border px-2 py-1 text-sm"
      />
      <input
        value={page}
        onChange={(e) => setPage(e.target.value)}
        placeholder="Page"
        className="mb-1 mt-1 w-full rounded-md border-2 border-border px-2 py-1 text-sm"
      />
      <textarea
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        placeholder="Verbatim quote"
        rows={3}
        className="w-full rounded-md border-2 border-border px-2 py-1 text-sm"
      />
      <button
        type="button"
        onClick={commit}
        className="mt-1 rounded-md border-2 border-foreground bg-primary px-2 py-1 text-sm text-primary-foreground"
      >
        Save source
      </button>
    </div>
  );
}
