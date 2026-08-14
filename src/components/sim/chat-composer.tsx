"use client";

import * as React from "react";
import { Mic, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The single-row conversation composer — the modern chat input the brief asks
 * for: one obvious voice toggle, one growing multiline textarea, one send.
 * No second row of keyboard hints, no inline "finish" button (that lives in
 * the header's "more" menu). Sits at the bottom, respects safe-area, expands
 * with the keyboard.
 */
export function ChatComposer({
  value,
  onChange,
  onSend,
  voiceMode,
  onToggleVoice,
  busy,
  voiceAvailable,
  patientName,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  voiceMode: boolean;
  onToggleVoice: () => void;
  busy: boolean;
  voiceAvailable: boolean;
  patientName: string;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !busy;

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  return (
    <div
      className="border-t border-border bg-card px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5"
    >
      <div className="flex items-end gap-2">
        {/* Voice toggle — one obvious button. */}
        <button
          type="button"
          onClick={onToggleVoice}
          aria-pressed={voiceMode}
          aria-label={voiceMode ? "Switch to typing" : "Use voice"}
          disabled={!voiceAvailable}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border transition-colors duration-fast ease-snappy active:scale-95",
            voiceMode ? "bg-primary text-primary-foreground" : "bg-background text-foreground",
            !voiceAvailable && "opacity-40",
          )}
        >
          <Mic className="size-5" aria-hidden />
        </button>

        {/* Multiline input — grows with the keyboard. */}
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder={`Ask ${patientName} something…`}
          aria-label={`Your message to ${patientName}`}
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-border bg-background px-3.5 py-2.5 text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {/* Send. */}
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-border bg-primary text-primary-foreground transition-transform duration-fast ease-snappy active:translate-y-px disabled:opacity-40"
        >
          <ArrowUp className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
