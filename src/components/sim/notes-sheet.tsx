"use client";

import * as React from "react";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { Textarea } from "@/components/ui/textarea";

/**
 * The student's working notes — MSE scratchpad + hypotheses — in a mobile
 * bottom sheet (built on MobileBottomSheet). Kept deliberately informal: this
 * is the student's own record, not something the debrief scores.
 */
export const NotesSheet = React.memo(function NotesSheet({
  open,
  onOpenChange,
  mseNotes,
  onMseNotesChange,
  hypotheses,
  onHypothesesChange,
  hasContent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mseNotes: string;
  onMseNotesChange: (v: string) => void;
  hypotheses: string;
  onHypothesesChange: (v: string) => void;
  /** True once the student has written anything — drives the saved signal. */
  hasContent?: boolean;
}) {
  return (
    <MobileBottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Notes"
      footer={
        <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
          <span
            aria-hidden
            className={`size-1.5 shrink-0 rounded-full ${hasContent ? "bg-status-success-fg" : "bg-muted-foreground"}`}
          />
          {hasContent ? "Saved on this device" : "Nothing written yet"}
        </p>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="mse-scratchpad" className="text-eyebrow text-muted-foreground">
            MSE scratchpad
          </label>
          <Textarea
            id="mse-scratchpad"
            value={mseNotes}
            onChange={(e) => onMseNotesChange(e.target.value)}
            rows={6}
            placeholder="Appearance, speech, mood, affect, thought…"
            className="mt-1.5 resize-none"
          />
        </div>
        <div>
          <label htmlFor="hypotheses" className="text-eyebrow text-muted-foreground">
            Hypotheses
          </label>
          <Textarea
            id="hypotheses"
            value={hypotheses}
            onChange={(e) => onHypothesesChange(e.target.value)}
            rows={4}
            placeholder="What do you think is going on?"
            className="mt-1.5 resize-none"
          />
        </div>
        <p className="text-caption text-muted-foreground">
          This is your working record — the debrief doesn&apos;t read it. What you wrote is half the assessment.
        </p>
      </div>
    </MobileBottomSheet>
  );
});
