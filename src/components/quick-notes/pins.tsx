"use client";

import * as React from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pinned and recently opened Quick Notes, kept in this browser per student
 * (a look-up convenience, like a remembered filter). Never needed for
 * anything to work: an empty or blocked store just shows no pins.
 */
const key = (owner: string | null, what: "pins" | "recent") => `vibha-qn-${what}:${owner ?? "anon"}`;
const listeners = new Set<() => void>();

function read(k: string): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(k) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 40) : [];
  } catch {
    return [];
  }
}
function write(k: string, v: string[]) {
  try {
    window.localStorage.setItem(k, JSON.stringify(v.slice(0, 40)));
  } catch {
    /* storage blocked: pins simply do not stay */
  }
  for (const l of listeners) l();
}

export function useQuickPins(owner: string | null) {
  const [, bump] = React.useReducer((n: number) => n + 1, 0);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    listeners.add(bump);
    setReady(true);
    return () => {
      listeners.delete(bump);
    };
  }, []);
  const pinned = ready ? read(key(owner, "pins")) : [];
  const recent = ready ? read(key(owner, "recent")) : [];
  return {
    pinned,
    recent,
    toggle: (k: string) => {
      const now = read(key(owner, "pins"));
      write(key(owner, "pins"), now.includes(k) ? now.filter((x) => x !== k) : [k, ...now]);
    },
  };
}

/** Put this note at the top of "Recently opened". */
export function RecordRecent({ owner, itemKey }: { owner: string | null; itemKey: string }) {
  React.useEffect(() => {
    const k = key(owner, "recent");
    write(k, [itemKey, ...read(k).filter((x) => x !== itemKey)].slice(0, 12));
  }, [owner, itemKey]);
  return null;
}

export function PinButton({ owner, itemKey, name }: { owner: string | null; itemKey: string; name: string }) {
  const { pinned, toggle } = useQuickPins(owner);
  const on = pinned.includes(itemKey);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Unpin ${name}` : `Pin ${name} to the top of Quick Notes`}
      onClick={() => toggle(itemKey)}
      className={cn(
        "ds-press inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-[1.5px] px-4 type-small font-semibold outline-hidden transition-colors duration-[var(--ds-state)] focus-visible:ring-2 focus-visible:ring-ring",
        on ? "border-foreground bg-foreground text-background" : "border-[var(--ds-card-line)] hover:border-foreground",
      )}
    >
      <Pin className={cn("size-4", on && "fill-current")} aria-hidden />
      {on ? "Pinned" : "Pin"}
    </button>
  );
}
