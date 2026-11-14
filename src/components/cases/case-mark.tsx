import * as React from "react";
import { Check, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { RECYCLE_LINE, type CaseMark } from "@/lib/cases/fresh";

const LOOK: Record<CaseMark, { label: string; cls: string; Icon: typeof Check | null }> = {
  started: { label: "Half done", cls: "bg-status-info-bg text-status-info-fg", Icon: RotateCcw },
  week: { label: "New this week", cls: "bg-status-success-bg text-status-success-fg", Icon: Sparkles },
  new: { label: "New", cls: "bg-card text-foreground", Icon: null },
  done: { label: "Done", cls: "border-foreground/40 bg-muted text-muted-foreground", Icon: Check },
};

/** The small status tag on a case: Half done, New this week, New or Done (a pill: it says what a case is). */
export function CaseMarkTag({ mark, className }: { mark: CaseMark; className?: string }) {
  const l = LOOK[mark];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-foreground px-2 py-0.5 text-caption font-semibold leading-none", l.cls, className)}>
      {l.Icon ? <l.Icon className="size-3" aria-hidden /> : null}
      {l.label}
    </span>
  );
}

/** Shown once every case in a library is done and the cases come round again. */
export function RecycleNote({ className }: { className?: string }) {
  return (
    <p role="status" className={cn("flex items-center gap-2 rounded-md border-2 border-dashed border-foreground/50 bg-card px-3 py-2 text-small font-semibold", className)}>
      <RotateCcw className="size-4 shrink-0" aria-hidden /> {RECYCLE_LINE}
    </p>
  );
}

/** The quiet hub line, only when the number is large (see hubNewLabel). */
export function NewCasesLine({ label, className }: { label: string | null; className?: string }) {
  if (!label) return null;
  return (
    <p className={cn("inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-status-success-bg px-3 py-1 text-sm font-semibold text-status-success-fg", className)}>
      <Sparkles className="size-4" aria-hidden /> {label}
    </p>
  );
}
