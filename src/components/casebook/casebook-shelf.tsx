"use client";

import Link from "next/link";
import { BookOpen, Check, RotateCcw } from "lucide-react";
import type { LearnState } from "@/lib/learn/engine";
import { CASEBOOK, caseKey } from "@/content/casebook";
import { FORMAT_LABEL } from "@/lib/casebook/types";
import { cn } from "@/lib/utils";

/**
 * The Casebook on the Lab home: textbook-based clinical games, grouped by
 * level, each showing its last score and whether a re-play is due.
 */
export function CasebookShelf({ st, today }: { st: LearnState; today: string }) {
  if (!CASEBOOK.length) return null;
  const levels = ["Foundation", "Intermediate", "Advanced"] as const;
  return (
    <section aria-labelledby="casebook" className="space-y-4">
      <div>
        <h2 id="casebook" className="flex items-center gap-2 text-lg font-bold">
          <BookOpen className="size-5" aria-hidden /> Casebook
        </h2>
        <p className="text-sm text-muted-foreground">Short clinical games built from the course textbooks. Every case is fictional.</p>
      </div>
      {levels.map((lvl) => {
        const items = CASEBOOK.filter((c) => c.level === lvl);
        if (!items.length) return null;
        return (
          <div key={lvl} className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <span className="size-2 rounded-full bg-primary ring-2 ring-foreground" aria-hidden /> {lvl}
            </h3>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
              {items.map((c) => {
                const r = st.lab[caseKey(c.id)];
                const due = !!r && r.check !== null && r.recheck.due <= today;
                return (
                  <li key={c.id}>
                    <Link
                      href={`/games/lab/cases/${c.id}`}
                      className="flex h-full flex-col gap-2 rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-y-0.5"
                    >
                      <span className="flex items-start gap-2">
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-xs font-bold text-link">{FORMAT_LABEL[c.format]}</span>
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
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
