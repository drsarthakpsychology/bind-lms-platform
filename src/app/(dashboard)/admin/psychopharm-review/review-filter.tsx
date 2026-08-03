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

  function update(v: string) {
    setQ(v);
    const params = new URLSearchParams(searchParams ?? new URLSearchParams());
    if (v.trim()) params.set("q", v.trim());
    else params.delete("q");
    router.replace(`/admin/psychopharm-review?${params.toString()}`);
  }

  return (
    <input
      ref={inputRef}
      value={q}
      onChange={(e) => update(e.target.value)}
      placeholder="Filter by medication name…"
      aria-label="Filter medications"
      className="w-full max-w-xl rounded-md border-2 border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
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