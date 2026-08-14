"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Returns `true` once the component has hydrated on the client. Uses
 * `useSyncExternalStore` with a snapshot that is `false` during SSR and
 * `true` after mount — avoids a setState-in-effect render cascade.
 */
function useHydrated() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * Cycle light → dark. Renders a fixed default (moon) until hydrated, so the
 * icon never flashes the wrong theme (next-themes reads localStorage on mount).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const hydrated = useHydrated();

  const cycle = () => {
    if (resolvedTheme === "dark") setTheme("light");
    else setTheme("dark");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={hydrated && isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md border-2 border-border bg-card text-foreground transition-transform",
        "hover:bg-accent active:translate-y-0.5",
        className
      )}
    >
      {hydrated && isDark ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
