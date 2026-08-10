"use client";

import { Search as SearchIcon } from "lucide-react";

/**
 * The ⌘K trigger. Dispatches a custom event the CommandPalette listens for —
 * a small client island so the server-rendered sidebar can open the palette.
 */
export function PaletteTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("plms:open-search"))}
      className="ml-auto flex items-center gap-1 rounded-md border border-border px-1.5 py-1 text-caption text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      aria-label="Search (⌘K)"
      title="Ask the Syllabus (⌘K)"
    >
      <SearchIcon className="size-3" aria-hidden />
      <span className="hidden sm:inline">⌘K</span>
    </button>
  );
}
