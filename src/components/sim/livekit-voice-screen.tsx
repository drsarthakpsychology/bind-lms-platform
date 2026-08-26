"use client";

import * as React from "react";
import { Keyboard, Square } from "lucide-react";
import { useLiveKitSession, type LkPhase } from "@/lib/voice/use-livekit-session";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PHASE_LABEL: Record<LkPhase, string> = {
  connecting: "Connecting…",
  listening: "Listening… speak naturally",
  error: "Couldn't start the voice session — switch to text",
  disconnected: "Connection dropped — reconnecting…",
};

/**
 * The realtime voice screen over LiveKit. One orb, one primary action. The
 * microphone is live for the whole session (no push-to-talk); LiveKit's turn
 * detection + the agent's adaptive interruption handling give natural
 * turn-taking and barge-in. The transcript is the SAME conversation as text.
 */
export function LiveKitVoiceScreen({
  sessionId,
  patientName,
  onExitVoice,
  onEnd,
  busy,
}: {
  sessionId: string;
  patientName: string;
  onExitVoice: () => void;
  onEnd: () => void;
  busy?: boolean;
}) {
  const { phase, transcript } = useLiveKitSession({ sessionId });
  const reduced = useReducedMotion();

  return (
    <div className="flex h-dvh flex-col items-center justify-between bg-background px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="flex w-full items-center justify-between">
        <span className="text-small font-semibold text-foreground">{patientName}</span>
        <button
          type="button"
          onClick={onExitVoice}
          className="inline-flex items-center gap-1.5 rounded-md border-2 border-border bg-card px-3 py-1.5 text-caption font-medium transition-transform active:translate-y-px"
        >
          <Keyboard className="size-3.5" aria-hidden />
          Switch to text
        </button>
      </div>

      <div className="flex flex-col items-center gap-5">
        <div
          className={cn(
            "relative flex size-36 items-center justify-center rounded-full border-2 border-foreground",
            phase === "error" && "border-status-alert-fg",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full border-2 border-primary/40",
              !reduced && phase === "listening" && "animate-pulse",
            )}
          />
          <span
            aria-hidden
            className={cn(
              "flex size-24 items-center justify-center rounded-full border-2 border-foreground",
              phase === "listening" ? "bg-primary" : "bg-card",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-3 rounded-full",
                phase === "listening" ? "bg-foreground" : "bg-muted-foreground",
                !reduced && phase === "connecting" && "animate-ping",
              )}
            />
          </span>
        </div>
        <p className="text-small font-medium text-foreground" aria-live="polite">
          {PHASE_LABEL[phase]}
        </p>
        {phase === "error" ? (
          <button type="button" onClick={onExitVoice} className="text-caption font-medium text-link underline underline-offset-2">
            Switch to text and keep going
          </button>
        ) : null}
      </div>

      <div className="w-full max-w-md">
        <div className="max-h-44 overflow-y-auto rounded-md border-2 border-border bg-card p-3 text-small leading-relaxed">
          {transcript ? (
            <div className="space-y-1.5 whitespace-pre-wrap">{transcript}</div>
          ) : (
            <p className="text-muted-foreground">The conversation will appear here — it stays in sync with text mode.</p>
          )}
        </div>

        <button
          type="button"
          onClick={onEnd}
          disabled={busy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 py-3 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
        >
          <Square className="size-4" aria-hidden />
          End conversation
        </button>
      </div>
    </div>
  );
}
