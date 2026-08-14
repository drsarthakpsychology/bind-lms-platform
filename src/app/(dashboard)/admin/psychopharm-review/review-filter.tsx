"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

/** Narrow the review list by name. Client-controlled URL param. */
function ReviewFilterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = React.useState(searchParams?.get("q") ?? "");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce the router.replace so a keystroke isn't a full navigation storm
  // on a slow phone (audit: T37 filter finding).
  React.useEffect(() => {
    if (!searchParams) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (q.trim()) params.set("q", q.trim());
      else params.delete("q");
      router.replace(`/admin/psychopharm-review?${params.toString()}`);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchParams is the source of truth snapshot at mount
  }, [q]);

  return (
    <input
      ref={inputRef}
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder="Filter by medication name…"
      aria-label="Filter medications"
      className="min-h-11 w-full max-w-xl rounded-md border-2 border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
    />
  );
}

export function ReviewFilter() {
  return (
    <Suspense fallback={<div className="h-9 w-full max-w-xl rounded-md border-2 border-border" />}>
      <ReviewFilterInner />
    </Suspense>
  );
}