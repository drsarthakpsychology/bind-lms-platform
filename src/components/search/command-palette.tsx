"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, CornerDownLeft, Clock, X } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { groupEntries, mergeResults, searchPalette, serverEntries, startEntries, type PaletteEntry, type PaletteGroup, type ServerHit } from "@/lib/search/palette";
import { addRecent } from "@/lib/search/engine";

const GROUP_LABEL: Record<PaletteGroup, string> = {
  Nav: "Go to",
  Lectures: "Lectures",
  Study: "Study",
  Topics: "Topics",
  Notes: "Revision notes",
  Medicines: "Medicines",
  Tools: "Tools",
  Reference: "Quick Reference",
  Cases: "Cases",
  Files: "Course files",
  Admin: "Admin",
  Students: "Students",
};

const RECENT_KEY = "vibha.search.recent";
function readRecent(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]") as unknown;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}
function writeRecent(list: string[]): void {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // A private window: recent searches are only a convenience.
  }
}

/**
 * Search: opens from the top bar's search box, ⌘K (Ctrl+K) or "/". Before
 * anything is typed it offers recent searches and the menu's places; then it
 * searches the page's own list at once (menu, tools, modules, medicines,
 * Quick Reference, typo tolerant) and, a moment after typing stops, the
 * server (/api/search: the student's own lectures and files, topics, notes,
 * cases, and students for admins). Keyboard: ↑/↓ move, Enter opens, Esc closes.
 */
export function CommandPalette({ entries }: { entries: PaletteEntry[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [idx, setIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  // The server's answer for what was typed (lectures, notes, cases...), and the words it answers.
  const [server, setServer] = React.useState<{ q: string; hits: PaletteEntry[] }>({ q: "", hits: [] });
  const [recent, setRecent] = React.useState<string[]>([]);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflight = React.useRef<AbortController | null>(null);

  // Ask the server a moment after typing stops (never per key), cancelling an older question.
  function askServer(q: string) {
    if (timer.current) clearTimeout(timer.current);
    inflight.current?.abort();
    const term = q.trim();
    if (term.length < 2) return;
    timer.current = setTimeout(() => {
      const ctrl = new AbortController();
      inflight.current = ctrl;
      fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal, credentials: "same-origin" })
        .then((r) => (r.ok ? (r.json() as Promise<{ results?: ServerHit[] }>) : { results: [] }))
        .then((a) => setServer({ q: term, hits: serverEntries(a.results ?? []) }))
        .catch(() => undefined); // offline or cancelled: the page's own results stay
    }, 180);
  }
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      inflight.current?.abort();
    },
    [],
  );

  function remember(term: string) {
    const next = addRecent(readRecent(), term);
    writeRecent(next);
    setRecent(next);
  }
  // Focus the input whenever the palette opens, and hand focus back to where
  // it was (the search box in the top bar) when it closes. DOM side effects,
  // not state updates: safe inside the effect.
  React.useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => {
      if (before && before.isConnected) before.focus();
    };
  }, [open]);

  // Tab stays inside the open search (aria-modal says the page behind is not there).
  function trapTab(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = [...panelRef.current.querySelectorAll<HTMLElement>("input, button, a[href]")].filter((el) => !el.hasAttribute("disabled"));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Global triggers: ⌘K / Ctrl+K and the sidebar's custom event. The handlers
  // run on user input (never synchronously inside this effect), so calling
  // setState from them is fine.
  React.useEffect(() => {
    function openPalette() {
      setOpen(true);
      setQuery("");
      setIdx(0);
      setRecent(readRecent());
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setIdx(0);
        setRecent(readRecent());
      }
      // "/" opens search like YouTube/GitHub, but never while typing.
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const el = e.target as HTMLElement | null;
        const typing =
          !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
        if (!typing) {
          e.preventDefault();
          openPalette();
        }
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("plms:open-search", openPalette);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("plms:open-search", openPalette);
    };
  }, []);

  const term = query.trim();
  const local = term ? searchPalette(entries, query) : startEntries(entries);
  // Server rows only for the words on screen (an older answer never shows under newer words).
  const results = term ? mergeResults(local, server.q === term ? server.hits : []) : local;

  function onQuery(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setIdx(0); // selection resets alongside the query, not from an effect.
    askServer(e.target.value);
  }
  function pickRecent(r: string) {
    setQuery(r);
    setIdx(0);
    askServer(r);
    inputRef.current?.focus();
  }
  function forget(r: string) {
    const next = readRecent().filter((x) => x !== r);
    writeRecent(next);
    setRecent(next);
  }
  const grouped = groupEntries(results);
  const flat = grouped.flatMap((g) => g.items);

  function choose(e: PaletteEntry) {
    haptic("tap");
    if (term.length >= 2) remember(term);
    setOpen(false);
    router.push(e.href);
  }

  // Arrow keys move past the bottom of the visible list: bring the picked row into view.
  // (A DOM side effect in an event handler, not state.)
  function reveal(i: number) {
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>(`[data-row="${i}"]`)?.scrollIntoView({ block: "nearest" }));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(flat.length - 1, idx + 1);
      setIdx(next);
      reveal(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.max(0, idx - 1);
      setIdx(next);
      reveal(next);
    } else if (e.key === "Enter" && flat[idx]) {
      e.preventDefault();
      choose(flat[idx]);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/40 lg:items-start lg:justify-center lg:p-4 lg:pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={() => setOpen(false)}
    >
      <div
        ref={panelRef}
        className="flex w-full flex-1 flex-col overflow-hidden bg-card lg:max-w-xl lg:flex-none lg:rounded-lg lg:border-2 lg:border-border lg:shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={trapTab}
      >
        {/* input */}
        <div className="flex items-center gap-2 border-b-2 border-border px-3 py-1.5 pt-[max(0.375rem,env(safe-area-inset-top))] lg:pt-1.5">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={onQuery}
            onKeyDown={onKeyDown}
            placeholder="Search lectures, notes, medicines, cases…"
            enterKeyHint="search"
            className="min-h-11 w-full bg-transparent text-base focus:outline-none lg:text-small"
            aria-label="Search"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="-mr-2 grid size-11 shrink-0 place-items-center rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {/* results */}
        <div className="flex-1 overflow-y-auto p-1 lg:max-h-[50vh]">
          {!term && recent.length ? (
            <div className="mb-1">
              <p className="px-3 py-1.5 text-caption font-semibold uppercase tracking-wide text-muted-foreground">Recent searches</p>
              {recent.map((r) => (
                <div key={r} className="flex items-center">
                  <button type="button" onClick={() => pickRecent(r)} className="flex min-h-11 flex-1 items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-secondary">
                    <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="truncate text-small">{r}</span>
                  </button>
                  <button type="button" onClick={() => forget(r)} aria-label={`Remove ${r} from recent searches`} className="grid size-11 shrink-0 place-items-center rounded-md text-muted-foreground hover:text-foreground">
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          {flat.length === 0 ? (
            <p className="px-3 py-6 text-center text-small text-muted-foreground">
              {term ? "Nothing matches. Try another word." : "Type a lecture, a topic, a medicine or a case."}
            </p>
          ) : (
            grouped.map((g) => (
              <div key={g.group} className="mb-1">
                <p className="px-3 py-1.5 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  {GROUP_LABEL[g.group]}
                </p>
                {g.items.map((item) => {
                  const row = flat.indexOf(item);
                  const active = row === idx;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      data-row={row}
                      aria-current={active ? "true" : undefined}
                      title={item.hint ? `${item.label}: ${item.hint}` : item.label}
                      onClick={(e) => {
                        // A plain click: navigate once (the link alone would push a second
                        // history entry, so Back seemed to do nothing). Cmd/Ctrl-click still opens a new tab.
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                        e.preventDefault();
                        choose(item);
                      }}
                      onMouseEnter={() => setIdx(row)}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-left",
                        active && "bg-secondary",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-small font-medium">{item.label}</span>
                        {item.hint ? (
                          <span className="block truncate text-caption text-muted-foreground">{item.hint}</span>
                        ) : null}
                      </span>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    </Link>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* footer: keyboard keys, so not on touch screens */}
        <div className="hidden items-center gap-3 border-t-2 border-border px-3 py-1.5 text-caption text-muted-foreground pointer-fine:flex">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="size-3" aria-hidden /> select
          </span>
          <span>↑↓ navigate</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
