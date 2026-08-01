"use client";

import { useTransition } from "react";
import { setViewMode } from "./view-mode-actions";

const MODES = [
  { id: "admin", label: "Admin" },
  { id: "student", label: "Student view" },
] as const;

/**
 * Pill-shaped segmented control for switching an admin's preview mode between
 * the admin and student sides of the app.
 *
 * - A sliding indicator under the active segment (a positioned element, not a
 *   transform animation of a full-width thumb, so it stays robust at any width).
 * - `aria-pressed` on each button + `role="group"` with an `aria-label` —
 *   a segmented control is a group of toggle buttons, not tabs.
 * - Disabled while the mode change is in flight; reduced-motion respects the
 *   transition off.
 */
export function ViewModeToggle({ currentMode }: { currentMode: "admin" | "student" }) {
  const [isPending, startTransition] = useTransition();

  function switchTo(mode: "admin" | "student") {
    if (mode === currentMode) return;
    startTransition(() => setViewMode(mode));
  }

  const activeIndex = MODES.findIndex((m) => m.id === currentMode);

  return (
    <div
      role="group"
      aria-label="Preview mode"
      className="relative grid grid-cols-2 items-center rounded-full border-2 border-foreground bg-background p-0.5"
    >
      {/* Sliding active indicator */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full border-2 border-foreground bg-primary transition-transform motion-reduce:transition-none"
        style={{
          left: "0.25rem",
          transform: activeIndex === 1 ? "translateX(100%)" : "translateX(0)",
        }}
      />

      {MODES.map((mode) => {
        const isActive = mode.id === currentMode;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => switchTo(mode.id)}
            disabled={isPending}
            aria-pressed={isActive}
            className={
              "relative z-10 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
              (isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
