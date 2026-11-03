"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Check, RotateCcw } from "lucide-react";
import type { LearnState } from "@/lib/learn/engine";
import { CASEBOOK, caseKey } from "@/content/casebook";
import { FORMAT_LABEL, type CaseActivity } from "@/lib/casebook/types";
import { cn } from "@/lib/utils";

export function CaseCard({ c, st, today }: { c: CaseActivity; st: LearnState; today: string }) {
  const r = st.lab[caseKey(c.id)];
  const due = !!r && r.check !== null && r.recheck.due <= today;
  return (
    <Link
      href={`/games/lab/cases/${c.id}`}
      className="flex h-full flex-col gap-2 rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-y-0.5"
    >
      <span className="flex items-start gap-2">
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-xs font-bold text-link">
            {FORMAT_LABEL[c.format]} · {c.level}
          </span>
          <span className="block font-bold leading-tight">{c.title}</span>
        </span>
        {r && (
          <span
            className={cn("grid size-7 shrink-0 place-items-center rounded-full border-2 border-foreground", due ? "bg-foreground text-background" : "bg-primary text-primary-foreground")}
            aria-label={due ? "Due again" : "Done"}
          >
            {due ? <RotateCcw className="size-3.5" aria-hidden /> : <Check className="size-4" aria-hidden />}
          </span>
        )}
      </span>
      <span className="text-sm leading-snug text-muted-foreground">{c.hook}</span>
      {r && (
        <span className="mt-auto text-xs font-semibold">
          {due ? "Due again · " : ""}Last {r.result.right}/{r.result.total}
        </span>
      )}
    </Link>
  );
}

/**
 * The Casebook teaser on the Lab home: what is due first, then a few to
 * start, then a link to the full, filterable library. Keeps the Lab home short
 * however large the Casebook grows.
 */
export function CasebookShelf({ st, today, show = 4 }: { st: LearnState; today: string; show?: number }) {
  if (!CASEBOOK.length) return null;
  const due = CASEBOOK.filter((c) => {
    const r = st.lab[caseKey(c.id)];
    return !!r && r.check !== null && r.recheck.due <= today;
  });
  const fresh = CASEBOOK.filter((c) => !st.lab[caseKey(c.id)]);
  const picks = [...due, ...fresh].slice(0, show);
  const list = picks.length ? picks : CASEBOOK.slice(0, show);
  return (
    <section aria-labelledby="casebook" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="casebook" className="flex items-center gap-2 text-lg font-bold">
            <BookOpen className="size-5" aria-hidden /> Casebook
          </h2>
          <p className="text-sm text-muted-foreground">Short clinical games. Every case is fictional.</p>
        </div>
      </div>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
        {list.map((c) => (
          <li key={c.id}>
            <CaseCard c={c} st={st} today={today} />
          </li>
        ))}
      </ul>
      <Link href="/games/lab/cases" className="flex min-h-11 items-center gap-3 rounded-2xl border-2 border-dashed border-foreground p-4 font-bold">
        <span className="flex-1">
          All {CASEBOOK.length} Casebook games{due.length > 2 ? ` · ${due.length} due` : ""}
        </span>
        <ArrowRight className="size-5 shrink-0" aria-hidden />
      </Link>
    </section>
  );
}
