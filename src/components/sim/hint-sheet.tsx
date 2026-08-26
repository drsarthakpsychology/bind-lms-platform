"use client";

import * as React from "react";
import { Lightbulb } from "lucide-react";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";

/**
 * The opt-in interview hint, revealed in a mobile bottom sheet (built on
 * MobileBottomSheet). Using the hint is flagged for the debrief — the parent
 * owns that bookkeeping; this surface just presents the hint quietly.
 */
export const HintSheet = React.memo(function HintSheet({
  open,
  onOpenChange,
  hint,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hint: string;
}) {
  return (
    <MobileBottomSheet open={open} onOpenChange={onOpenChange} title="A hint">
      <div className="flex items-start gap-3 rounded-lg bg-accent px-4 py-3">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-link" aria-hidden />
        <p className="text-small text-foreground">{hint}</p>
      </div>
    </MobileBottomSheet>
  );
});
