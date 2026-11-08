"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { emptyState, istToday, type LearnState } from "@/lib/learn/engine";
import { initLearnStore, useLearnState } from "@/lib/learn/store";
import { CASEBOOK, caseKey } from "@/content/casebook";
import { FORMAT_LABEL, LEVEL_ORDER, type CaseFormat } from "@/lib/casebook/types";
import { cn } from "@/lib/utils";
import { CaseCard } from "./casebook-shelf";

const EMPTY = emptyState();
const PAGE = 12;
type Show = "all" | "new" | "due" | "done";

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn("min-h-10 shrink-0 rounded-full border-2 border-foreground px-3 py-1 text-sm font-bold", on ? "bg-foreground text-background" : "bg-card")}>
      {children}
    </button>
  );
}

/**
 * /games/lab/cases: the whole Casebook, filterable by topic, format and
 * status, searchable, shown a page at a time so the library can grow without
 * a cap and the screen stays calm.
 */
export function CasebookIndex({ moduleTitles, serverState, save }: { moduleTitles: Record<string, string>; serverState: LearnState | null; save: (s: LearnState) => Promise<unknown> }) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const today = istToday();
  const [q, setQ] = React.useState("");
  const [mod, setMod] = React.useState<string>("all");
  const [fmt, setFmt] = React.useState<CaseFormat | "all">("all");
  const [show, setShow] = React.useState<Show>("all");
  const [n, setN] = React.useState(PAGE);

  const modules = [...new Set(CASEBOOK.map((c) => c.module))].sort((a, b) => (moduleTitles[a] ?? a).localeCompare(moduleTitles[b] ?? b));
  const formats = [...new Set(CASEBOOK.map((c) => c.format))];
  const needle = q.trim().toLowerCase();
  const list = CASEBOOK.filter((c) => {
    const r = st.lab[caseKey(c.id)];
    const due = !!r && r.check !== null && r.recheck.due <= today;
    if (mod !== "all" && c.module !== mod) return false;
    if (fmt !== "all" && c.format !== fmt) return false;
    if (show === "new" && r) return false;
    if (show === "done" && !r) return false;
    if (show === "due" && !due) return false;
    return !needle || `${c.title} ${c.hook} ${c.objective} ${moduleTitles[c.module] ?? ""}`.toLowerCase().includes(needle);
  }).sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.title.localeCompare(b.title));
  const startHereId = CASEBOOK.filter((c) => c.level === "Foundation" && !st.lab[caseKey(c.id)]).sort((a, b) => a.title.localeCompare(b.title))[0]?.id;
  const reset = () => setN(PAGE);

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl space-y-6">
      <Link href="/games/lab" className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-bold">
        <ArrowLeft className="size-4" aria-hidden /> Lab
      </Link>
      <header>
        <p className="text-eyebrow text-link">Casebook</p>
        <h1 className="text-h1">Clinical games</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every case is fictional.</p>
      </header>

      <div className="space-y-3">
        <label className="flex items-center gap-2 rounded-md border-2 border-foreground bg-background px-3">
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="sr-only">Search the Casebook</span>
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              reset();
            }}
            placeholder="Search, e.g. lithium, grief, delirium"
            className="min-h-11 w-full bg-transparent outline-none"
          />
        </label>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="group" aria-label="Show">
          {(["all", "new", "due", "done"] as const).map((s) => (
            <Chip key={s} on={show === s} onClick={() => (setShow(s), reset())}>
              {{ all: "All", new: "Not played", due: "Due again", done: "Played" }[s]}
            </Chip>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Topic
            <select value={mod} onChange={(e) => (setMod(e.target.value), reset())} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2">
              <option value="all">All topics</option>
              {modules.map((m) => (
                <option key={m} value={m}>
                  {moduleTitles[m] ?? m}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Game type
            <select value={fmt} onChange={(e) => (setFmt(e.target.value as CaseFormat | "all"), reset())} className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2">
              <option value="all">All types</option>
              {formats.map((f) => (
                <option key={f} value={f}>
                  {FORMAT_LABEL[f]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="text-sm font-semibold" aria-live="polite">
        {list.length} game{list.length === 1 ? "" : "s"}
      </p>

      {list.length ? (
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
          {list.slice(0, n).map((c) => (
            <li key={c.id}>
              <CaseCard c={c} st={st} today={today} startHere={c.id === startHereId} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-foreground/50 p-6 text-center">
          <p className="font-bold">Nothing matches.</p>
          <button type="button" className="mt-2 font-bold text-link underline" onClick={() => (setQ(""), setMod("all"), setFmt("all"), setShow("all"), reset())}>
            Clear filters
          </button>
        </div>
      )}

      {list.length > n && (
        <button type="button" onClick={() => setN(n + PAGE)} className="min-h-11 w-full rounded-full border-2 border-foreground bg-card px-5 py-2 text-sm font-bold">
          Show more ({list.length - n} left)
        </button>
      )}
    </div>
  );
}
