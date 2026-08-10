"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { haptic } from "@/lib/haptics";

interface Doc {
  id: string;
  title: string;
  sourceUrl: string;
  licence: string;
  snippet: string;
  fetchedAt: string;
}

export function LibraryList({
  docs,
  totalCount,
  query,
  shown,
}: {
  docs: Doc[];
  totalCount: number;
  query: string;
  shown: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = React.useState(query);
  const [openId, setOpenId] = React.useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    haptic("tap");
    const params = new URLSearchParams(sp.toString());
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    router.push(`/practice/library?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${totalCount} case reports…`}
          className="w-full rounded-md border-2 border-border bg-background py-2 pl-9 pr-3 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </form>

      {docs.length === 0 ? (
        <div className="rounded-md border-2 border-border bg-card p-6 text-center">
          <p className="text-base font-medium">No matches</p>
          <p className="mt-1 text-small text-muted-foreground">
            Try a condition, a symptom, or a drug name.
          </p>
        </div>
      ) : (
        <>
          <p className="text-caption text-muted-foreground">
            Showing {shown} of {totalCount} reports
          </p>
          <ul className="space-y-2">
            {docs.map((d) => {
              const open = openId === d.id;
              return (
                <li key={d.id} className="rounded-md border-2 border-border bg-card">
                  <button
                    type="button"
                    onClick={() => { setOpenId(open ? null : d.id); haptic("tap"); }}
                    className="w-full px-4 py-3 text-left"
                  >
                    <span className="block text-small font-medium">{d.title}</span>
                    <span className="mt-0.5 block text-caption text-muted-foreground">
                      {d.licence.toUpperCase()} · {d.fetchedAt}
                    </span>
                  </button>
                  {open ? (
                    <div className="space-y-2 border-t border-border px-4 py-3">
                      <p className="text-small text-muted-foreground">{d.snippet}…</p>
                      <a
                        href={d.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-caption font-medium text-primary hover:underline"
                      >
                        Open on PMC →
                      </a>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
