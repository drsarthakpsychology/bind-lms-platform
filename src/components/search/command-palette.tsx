"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, CornerDownLeft, X } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { searchPalette, type PaletteEntry } from "@/lib/search/palette";

const GROUP_LABEL: Record<PaletteEntry["group"], string> = {
  Tools: "Practice tools",
  Courses: "Courses",
  Cases: "Case library",
  Competencies: "Competencies",
  Admin: "Admin",
  Nav: "Go to",
};

/**
 * Ask the Syllabus — ⌘K command palette.
 * Opens with ⌘K (mac) / Ctrl+K (elsewhere) or from the sidebar. Searches the
 * real content available in this install (tools, courses, case docs) and
 * navigates. Keyboard: ↑/↓ move, Enter selects, Esc closes.
 */
export function CommandPalette({ entries }: { entries: PaletteEntry[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [idx, setIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus the input whenever the palette opens. The focus call is a DOM side
  // effect, not a state update — safe inside the effect.
  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("plms:open-search", openPalette);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("plms:open-search", openPalette);
    };
  }, []);

  const results = searchPalette(entries, query);

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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Ask the Syllabus"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-lg border-2 border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* input */}
        <div className="flex items-center gap-2 border-b-2 border-border px-3 py-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={onQuery}
            onKeyDown={onKeyDown}
            placeholder="Ask the syllabus… e.g. 'sim patient', 'ethics', 'MSE'"
            className="w-full bg-transparent text-small focus:outline-none"
            aria-label="Search"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        {/* results */}
        <div className="max-h-[50vh] overflow-y-auto p-1">
          {flat.length === 0 ? (
            <p className="px-3 py-6 text-center text-small text-muted-foreground">
              {query.trim()
                ? "Nothing matches that yet — try a tool name, a condition, or 'ethics'."
                : "Type to search the syllabus, tools, and case library."}
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
                      onClick={() => choose(item)}
                      onMouseEnter={() => setIdx(flat.indexOf(item))}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-left",
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

        {/* footer */}
        <div className="flex items-center gap-3 border-t-2 border-border px-3 py-1.5 text-caption text-muted-foreground">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="size-3" aria-hidden /> select
          </span>
          <span>↑↓ navigate</span>
          <span>esc close</span>
          <span className="ml-auto">Searches your courses, tools, and case library</span>
        </div>
      </div>
    </div>
  );
}
