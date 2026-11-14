"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, CornerDownLeft, X } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { searchPalette, startEntries, type PaletteEntry } from "@/lib/search/palette";

const GROUP_LABEL: Record<PaletteEntry["group"], string> = {
  Nav: "Go to",
  Study: "Study",
  Medicines: "Medicines",
  Tools: "Tools",
  Reference: "Quick Reference",
  Admin: "Admin",
};

/**
 * Search: opens from the top bar's search box, ⌘K (Ctrl+K) or "/". Before
 * anything is typed it offers the menu's places; then it searches the
 * menu, tools, Study modules, medicines and the Quick Reference, and opens
 * the pick. Keyboard: ↑/↓ move, Enter opens, Esc closes.
 */
export function CommandPalette({ entries }: { entries: PaletteEntry[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [idx, setIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

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
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setIdx(0);
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

  const results = query.trim() ? searchPalette(entries, query) : startEntries(entries);

  function onQuery(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setIdx(0); // selection resets alongside the query, not from an effect.
  }
  const grouped = React.useMemo(() => {
    const out: Array<{ group: PaletteEntry["group"]; items: PaletteEntry[] }> = [];
    for (const r of results) {
      const g = out.find((o) => o.group === r.group);
      if (g) g.items.push(r);
      else out.push({ group: r.group, items: [r] });
    }
    return out;
  }, [results]);

  const flat = results;

  function choose(e: PaletteEntry) {
    haptic("tap");
    setOpen(false);
    router.push(e.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(flat.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
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
            placeholder="Search lectures, topics, medicines…"
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
          {flat.length === 0 ? (
            <p className="px-3 py-6 text-center text-small text-muted-foreground">
              {query.trim() ? "Nothing matches. Try another word." : "Type a topic, a medicine or a tool."}
            </p>
          ) : (
            grouped.map((g) => (
              <div key={g.group} className="mb-1">
                <p className="px-3 py-1.5 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                  {GROUP_LABEL[g.group]}
                </p>
                {g.items.map((item) => {
                  const active = flat.indexOf(item) === idx;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={(e) => {
                        // A plain click: navigate once (the link alone would push a second
                        // history entry, so Back seemed to do nothing). Cmd/Ctrl-click still opens a new tab.
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                        e.preventDefault();
                        choose(item);
                      }}
                      onMouseEnter={() => setIdx(flat.indexOf(item))}
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
