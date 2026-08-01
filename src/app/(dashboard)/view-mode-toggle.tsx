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
    <div className="flex items-center gap-1 rounded-md border-2 border-border bg-muted p-0.5 text-xs font-medium">
      <button
        type="button"
        onClick={() => switchTo("admin")}
        disabled={isPending}
        className={
          currentMode === "admin"
            ? "rounded-sm border-2 border-foreground bg-background px-2 py-1 font-semibold text-foreground hard-shadow-flat"
            : "rounded-sm px-2 py-1 text-muted-foreground hover:text-foreground"
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
            ? "rounded-sm border-2 border-foreground bg-background px-2 py-1 font-semibold text-foreground hard-shadow-flat"
            : "rounded-sm px-2 py-1 text-muted-foreground hover:text-foreground"
        }
      >
        Student view
      </button>
    </div>
  );
}
