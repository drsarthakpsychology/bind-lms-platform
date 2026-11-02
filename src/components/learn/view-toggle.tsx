"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Student / Clinician reading mode, shared by Learn and the medicines pages.
 * Student = plain words. Clinician = the clinical, medical framing.
 * Remembered on this device.
 */
export type ExplainView = "student" | "clinician";
const KEY = "vibha-explain-view";
const listeners = new Set<() => void>();

function read(): ExplainView {
  try {
    return window.localStorage.getItem(KEY) === "clinician" ? "clinician" : "student";
  } catch {
    return "student";
  }
}

export function setExplainView(v: ExplainView) {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* private mode */
  }
  listeners.forEach((l) => l());
}

export function useExplainView(): ExplainView {
  return React.useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "student",
  );
}

export function ViewToggle({ className }: { className?: string }) {
  const view = useExplainView();
  return (
    <div role="radiogroup" aria-label="Explanation style" className={cn("inline-flex rounded-full border-2 border-foreground bg-card p-0.5", className)}>
      {(["student", "clinician"] as const).map((v) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={view === v}
          onClick={() => setExplainView(v)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold transition-colors",
            view === v ? (v === "student" ? "bg-primary text-primary-foreground" : "bg-foreground text-background") : "text-foreground",
          )}
        >
          {v === "student" ? "Student" : "Clinician"}
          <span className="hidden sm:inline"> view</span>
        </button>
      ))}
    </div>
  );
}
