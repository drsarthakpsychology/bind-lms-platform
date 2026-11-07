"use client";

import * as React from "react";
import { Check, EyeOff, LoaderCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiCaseStatus } from "@/lib/ai-cases/types";
import { setAiCaseStatusAction } from "./actions";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-3 py-2 text-sm font-bold transition-[transform,box-shadow] hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-y-px disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Keep live / Remove / Restore. Read-only admins see why they can't. */
export function CaseActions({ id, status, canEdit }: { id: string; status: AiCaseStatus; canEdit: boolean }) {
  const [pending, start] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  if (!canEdit) return <p className="text-caption text-muted-foreground">Only the Super Admin can change this case.</p>;

  function go(next: AiCaseStatus) {
    setError(null);
    start(async () => {
      const r = await setAiCaseStatusAction(id, next);
      if (r.error) setError(r.error);
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {status !== "live" && (
          <button type="button" className={cn(base, "bg-primary text-primary-foreground")} disabled={pending} onClick={() => go("live")}>
            {status === "removed" ? <RotateCcw className="size-4" aria-hidden /> : <Check className="size-4" aria-hidden />}
            {status === "removed" ? "Put back live" : "Looks right, keep live"}
          </button>
        )}
        {status !== "removed" && (
          <button type="button" className={cn(base, "bg-card text-foreground")} disabled={pending} onClick={() => go("removed")}>
            <EyeOff className="size-4" aria-hidden /> Remove
          </button>
        )}
        {pending && <LoaderCircle className="size-5 animate-spin self-center" aria-label="Saving" />}
      </div>
      {error && (
        <p role="alert" className="text-small font-semibold text-status-alert-fg">
          {error}
        </p>
      )}
    </div>
  );
}
