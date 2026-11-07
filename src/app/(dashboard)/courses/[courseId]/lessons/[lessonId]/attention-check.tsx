"use client";

import * as React from "react";
import { Hand, Play } from "lucide-react";
import { ANSWER_WINDOW_MS, isMissed, nextCheckAfter, shouldAsk } from "@/lib/attention/schedule";
import { recordAttentionCheck } from "./attention-actions";

type Phase = "idle" | "asking" | "missed";

/**
 * "Still watching?": counts real playback seconds; at a random moment every
 * 12 to 20 minutes asks the student to tap "Yes". No answer in 60 s: pause and
 * go back to where we asked (those minutes don't count). The player skips its
 * progress ping while a check is open (askingRef).
 */
export function useAttentionCheck(videoRef: React.RefObject<HTMLVideoElement | null>, lessonId: string, enabled = true) {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = React.useState(60);
  const askingRef = React.useRef(false);
  const played = React.useRef(0);
  const target = React.useRef(0);
  const ask = React.useRef<{ at: string; pos: number; t0: number } | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    played.current = 0;
    target.current = nextCheckAfter(Math.random());
    const id = setInterval(() => {
      const v = videoRef.current;
      if (!v) return;
      const open = ask.current;
      if (open) {
        const now = Date.now();
        setSecondsLeft(Math.max(0, Math.ceil((ANSWER_WINDOW_MS - (now - open.t0)) / 1000)));
        if (isMissed(open.t0, now)) {
          v.pause();
          try {
            v.currentTime = open.pos;
          } catch {
            /* seeking can fail mid-load; pausing is what matters */
          }
          void recordAttentionCheck({ lessonId, askedAt: open.at, answered: false, position: open.pos });
          ask.current = null;
          askingRef.current = false;
          setPhase("missed");
        }
        return;
      }
      if (v.paused || v.ended || !v.duration) return;
      played.current += 1;
      if (shouldAsk(played.current, target.current, v.currentTime, v.duration)) {
        ask.current = { at: new Date().toISOString(), pos: v.currentTime, t0: Date.now() };
        askingRef.current = true;
        setSecondsLeft(60);
        setPhase("asking");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [enabled, lessonId, videoRef]);

  const reset = () => {
    played.current = 0;
    target.current = nextCheckAfter(Math.random());
  };

  const answer = () => {
    const open = ask.current;
    if (open) void recordAttentionCheck({ lessonId, askedAt: open.at, answered: true, position: open.pos });
    ask.current = null;
    askingRef.current = false;
    reset();
    setPhase("idle");
  };

  const resume = () => {
    reset();
    setPhase("idle");
    void videoRef.current?.play().catch(() => {});
  };

  return { phase, secondsLeft, askingRef, answer, resume };
}

export function AttentionCheckCard({ phase, secondsLeft, onYes, onResume }: { phase: Phase; secondsLeft: number; onYes: () => void; onResume: () => void }) {
  const btn = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (phase !== "idle") btn.current?.focus();
  }, [phase]);
  if (phase === "idle") return null;
  return (
    <div className="absolute inset-x-3 bottom-20 z-40 flex justify-center sm:bottom-24" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
      <div role="alertdialog" aria-live="assertive" aria-label={phase === "asking" ? "Still watching?" : "Paused"} className="flex w-full max-w-sm items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-3 text-foreground hard-shadow-md">
        {phase === "asking" ? (
          <>
            <Hand className="size-6 shrink-0 text-link" aria-hidden />
            <p className="min-w-0 flex-1 text-sm">
              <span className="block font-bold">Still watching?</span>
              <span className="block text-caption text-muted-foreground">Tap within {secondsLeft}s or the lecture pauses.</span>
            </p>
            <button ref={btn} type="button" onClick={onYes} className="h-11 shrink-0 rounded-full border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground">
              Yes, I&apos;m here
            </button>
          </>
        ) : (
          <>
            <Play className="size-6 shrink-0 text-link" aria-hidden />
            <p className="min-w-0 flex-1 text-sm">
              <span className="block font-bold">Paused</span>
              <span className="block text-caption text-muted-foreground">We didn&apos;t hear from you, so we went back to where we asked.</span>
            </p>
            <button ref={btn} type="button" onClick={onResume} className="h-11 shrink-0 rounded-full border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground">
              Keep watching
            </button>
          </>
        )}
      </div>
    </div>
  );
}
