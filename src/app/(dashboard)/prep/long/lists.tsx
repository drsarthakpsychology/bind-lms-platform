"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useIdList, type ListKind } from "@/lib/prep/long-store";
import { longCardsFor } from "./actions";

type CardRow = { id: string; question: string; marks: number; subjectTitle: string; href: string };

/** The Saved and Practise again lists, kept on this device. Hidden while both are empty. */
export function LongLists() {
  const saved = useIdList("saved");
  const again = useIdList("again");
  const key = [...new Set([...again, ...saved])].join(",");
  const [rows, setRows] = React.useState<Map<string, CardRow> | undefined>(undefined);

  React.useEffect(() => {
    const ids = key ? key.split(",").slice(0, 200) : [];
    if (!ids.length) return;
    let live = true;
    longCardsFor(ids)
      .then((list) => {
        if (live) setRows(new Map(list.map((r) => [r.id, r])));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [key]);

  if (!saved.length && !again.length) return null;
  return (
    <div className="space-y-5">
      <List kind="again" title="Practise again" ids={again} rows={rows} />
      <List kind="saved" title="Saved for later" ids={saved} rows={rows} />
    </div>
  );
}

function List({ kind, title, ids, rows }: { kind: ListKind; title: string; ids: string[]; rows: Map<string, CardRow> | undefined }) {
  if (!ids.length) return null;
  const list = rows ? ids.flatMap((id) => (rows.has(id) ? [rows.get(id)!] : [])) : [];
  return (
    <section aria-labelledby={`long-${kind}`} className="space-y-2">
      <h2 id={`long-${kind}`} className="text-h3">
        {title} <span className="font-mono text-sm text-muted-foreground">{ids.length}</span>
      </h2>
      {!rows ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <ul className="space-y-2">
          {list.map((r) => (
            <li key={r.id}>
              <Link
                href={r.href}
                className="flex min-h-14 items-center gap-3 rounded-lg border-2 border-foreground bg-card px-4 py-3 transition-transform duration-150 hover:-translate-y-0.5 hover:hard-shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug [overflow-wrap:anywhere]">{r.question}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {r.subjectTitle} · {r.marks} marks
                  </span>
                </span>
                <ChevronRight className="size-5 shrink-0" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
