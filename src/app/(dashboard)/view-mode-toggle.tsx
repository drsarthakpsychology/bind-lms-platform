"use client";

import { useTransition } from "react";
import { setViewMode } from "./view-mode-actions";

export function ViewModeToggle({ currentMode }: { currentMode: "admin" | "student" }) {
  const [isPending, startTransition] = useTransition();

  function switchTo(mode: "admin" | "student") {
    if (mode === currentMode) return;
    startTransition(() => setViewMode(mode));
  }

  return (
    <div className="flex items-center rounded-full border border-border bg-secondary p-0.5 text-xs">
      <button
        type="button"
        onClick={() => switchTo("admin")}
        disabled={isPending}
        className={
          currentMode === "admin"
            ? "rounded-full bg-primary px-2.5 py-1 font-medium text-primary-foreground"
            : "rounded-full px-2.5 py-1 text-muted-foreground hover:text-foreground"
        }
      >
        Admin
      </button>
      <button
        type="button"
        onClick={() => switchTo("student")}
        disabled={isPending}
        className={
          currentMode === "student"
            ? "rounded-full bg-primary px-2.5 py-1 font-medium text-primary-foreground"
            : "rounded-full px-2.5 py-1 text-muted-foreground hover:text-foreground"
        }
      >
        Student view
      </button>
    </div>
  );
}
