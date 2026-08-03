"use client";

import * as React from "react";
import type { MedBlock, SourceRef } from "@/lib/psychopharm/document";

/**
 * Per-block source panel. Shows the book/edition/page/quote behind a block and
 * lets an editor attach or edit them. Appears for the selected block in the
 * editor's right rail.
 */
export function SourcePanel({
  block,
  onChange,
}: {
  block: MedBlock;
  onChange: (sources: SourceRef[]) => void;
}) {
  const [title, setTitle] = React.useState(block.sources[0]?.title ?? "");
  const [page, setPage] = React.useState(block.sources[0]?.page ?? "");
  const [quote, setQuote] = React.useState(block.sources[0]?.quote ?? "");

  function commit() {
    const src: SourceRef = {
      title: title || block.sources[0]?.title,
      edition: block.sources[0]?.edition,
      page: page || block.sources[0]?.page,
      quote: quote || block.sources[0]?.quote,
    };
    onChange([src]);
  }

  return (
    <div className="rounded-md border-2 border-dashed border-border p-3">
      <p className="text-caption font-semibold uppercase text-muted-foreground">
        Source · {block.type}
      </p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Book / guideline title"
        className="mb-1 w-full rounded-md border-2 border-border px-2 py-1 text-sm"
      />
      <input
        value={page}
        onChange={(e) => setPage(e.target.value)}
        placeholder="Page"
        className="mb-1 w-full rounded-md border-2 border-border px-2 py-1 text-sm"
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