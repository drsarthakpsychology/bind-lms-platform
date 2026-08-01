"use client";

import { useTransition } from "react";
import { setViewMode } from "./view-mode-actions";
import { SegmentedControl } from "@/components/ui/segmented-control";

const MODES = [
  { value: "admin", label: "Admin" },
  { value: "student", label: "Student view" },
] as const;

/**
 * Segmented control for switching an admin's preview mode between the admin
 * and student sides of the app. Shares the rectangular geometry of the rest
 * of the sidebar footer (Button, ThemeToggle, Log out) — no pill.
 *
 * - `aria-pressed` on each segment + `role="group"` with an `aria-label` —
 *   a segmented control is a group of toggle buttons, not tabs.
 * - Disabled while the mode change is in flight.
 */
export function ViewModeToggle({ currentMode }: { currentMode: "admin" | "student" }) {
  const [isPending, startTransition] = useTransition();

  function switchTo(mode: "admin" | "student") {
    if (mode === currentMode) return;
    startTransition(() => setViewMode(mode));
  }

  return (
    <div className={isPending ? "pointer-events-none opacity-60" : undefined}>
      <SegmentedControl
        value={currentMode}
        onValueChange={switchTo}
        options={MODES}
        label="Preview mode"
        className="w-full [&>button]:flex-1"
      />
    </div>
  );
}
