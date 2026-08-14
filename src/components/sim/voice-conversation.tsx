"use client";

import * as React from "react";
import { Keyboard, Square } from "lucide-react";
import { createWebStt, sttStatus, type SttEngine } from "@/lib/voice/stt";
import { createTts, ttsSupported, type TtsEngine, type TtsVoicePrefs } from "@/lib/voice/tts";
import { useReducedMotion } from "@/lib/motion";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

type Phase = "connecting" | "listening" | "thinking" | "speaking" | "error";

const PHASE_LABEL: Record<Phase, string> = {
  connecting: "Connecting…",
  listening: "Listening… speak naturally",
  thinking: "Thinking…",
  speaking: "is speaking",
  error: "Couldn't start voice — switch to text",
};

/**
 * The focused voice conversation. One action (the orb), no mic/speaker/
 * push-to-talk clutter. The loop:
 *
 *   listen → student speaks → send to the AI patient → patient reply spoken
 *   → hand the mic back → listen again.
 *
 * Interruption: tapping the orb while the patient is speaking stops them and
 * hands the mic back (browser STT can't reliably detect speech-over-audio
 * without echo cancellation, so the tap is the deterministic interrupt).
 *
 * The transcript + session are the SAME ones as text mode — this screen is a
 * view over the same conversation, never a separate one.
 */
export function VoiceConversation({
  patientName,
  onSend,
  patientReply,
  patientVoicePrefs,
  onExitVoice,
  onEnd,
  busy,
}: {
  patientName: string;
  onSend: (text: string) => void;
  patientReply: string;
  patientVoicePrefs: TtsVoicePrefs;
  onExitVoice: () => void;
  onEnd: () => void;
  busy?: boolean;
}) {
  const [phase, setPhase] = React.useState<Phase>(() =>
    typeof window !== "undefined" && sttStatus().supported && ttsSupported() ? "listening" : "error",
  );
  const [transcript, setTranscript] = React.useState("");
  const [interim, setInterim] = React.useState("");

  const sttRef = React.useRef<SttEngine | null>(null);
  const ttsRef = React.useRef<TtsEngine | null>(null);
  const patientSpeakingRef = React.useRef(false);
  const lastReplyRef = React.useRef("");
  const phaseRef = React.useRef<Phase>(phase);
  const cbRef = React.useRef({ onSend, onEnd });

  // Keep the latest callbacks + phase for the engine callbacks without
  // re-wiring the engines (refs written in effects only — never in render).
  React.useEffect(() => {
    cbRef.current = { onSend, onEnd };
  });
  React.useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Wire the engines once and start the conversational loop.
  React.useEffect(() => {
    const stt = createWebStt();
    const tts = createTts();
    sttRef.current = stt;
    ttsRef.current = tts;

    if (stt) {
      stt.onResult = (r) => {
        if (r.isFinal) {
          const text = r.transcript.trim();
          setInterim("");
          if (text) {
            // Interruption: if the patient was speaking, stop them.
            if (patientSpeakingRef.current) {
              ttsRef.current?.cancel();
              patientSpeakingRef.current = false;
            }
            setTranscript((t) => `${t}${t ? "\n" : ""}You: ${text}`);
            setPhase("thinking");
            haptic("tap");
            cbRef.current.onSend(text);
          } else if (phaseRef.current === "listening") {
            stt.start();
          }
        } else {
          setInterim(r.transcript);
        }
      };
      stt.onEnd = () => {
        // Recognition ended on its own. Hand the mic back if we're idle.
        if (phaseRef.current === "listening") stt.start();
      };
      stt.onError = () => setPhase("error");
      stt.start();
    }

    if (tts) {
      tts.onEnd = () => {
        patientSpeakingRef.current = false;
        setPhase("listening");
        sttRef.current?.start();
      };
    }

    return () => {
      sttRef.current?.abort();
      ttsRef.current?.cancel();
    };
  }, []);

  // Speak the patient's reply when it arrives, then hand the mic back.
  React.useEffect(() => {
    if (!patientReply || patientReply === lastReplyRef.current) return;
    lastReplyRef.current = patientReply;
    setTranscript((t) => `${t}${t ? "\n" : ""}${patientName}: ${patientReply}`);
    setPhase("speaking");
    patientSpeakingRef.current = true;
    haptic("success");
    ttsRef.current?.speak(patientReply, patientVoicePrefs);
  }, [patientReply, patientName, patientVoicePrefs]);

  function tapOrb() {
    if (patientSpeakingRef.current) {
      ttsRef.current?.cancel();
      patientSpeakingRef.current = false;
      setPhase("listening");
      sttRef.current?.start();
      haptic("tap");
    }
  }

  const reduced = useReducedMotion();
  const speaking = phase === "speaking";

  return (
    <div className="flex h-dvh flex-col items-center justify-between bg-background px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      {/* Top row: patient context + switch to text */}
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

      {/* The orb + status */}
      <div className="flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={tapOrb}
          aria-label={speaking ? "Interrupt and speak" : "Voice is on"}
          className={cn(
            "relative flex size-36 items-center justify-center rounded-full border-2 border-foreground transition-transform duration-fast ease-snappy active:scale-95",
            speaking && "cursor-pointer",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full border-2 border-primary/40",
              !reduced && (phase === "listening" || speaking) && "animate-pulse",
            )}
          />
          <span
            aria-hidden
            className={cn(
              "flex size-24 items-center justify-center rounded-full border-2 border-foreground",
              phase === "thinking" ? "bg-secondary" : speaking ? "bg-primary" : "bg-card",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-3 rounded-full",
                phase === "listening" ? "bg-primary" : speaking ? "bg-foreground" : "bg-muted-foreground",
                !reduced && phase === "thinking" && "animate-ping",
              )}
            />
          </span>
        </button>
        <p className="text-small font-medium text-foreground" aria-live="polite">
          {speaking ? `${patientName} ${PHASE_LABEL.speaking}` : PHASE_LABEL[phase]}
        </p>
        {phase === "error" ? (
          <button type="button" onClick={onExitVoice} className="text-caption font-medium text-link underline underline-offset-2">
            Switch to text and keep going
          </button>
        ) : null}
      </div>

      {/* Live transcript — the same conversation as text mode. */}
      <div className="w-full max-w-md">
        <div className="max-h-44 overflow-y-auto rounded-md border-2 border-border bg-card p-3 text-small leading-relaxed">
          {transcript ? (
            <div className="space-y-1.5 whitespace-pre-wrap">{transcript}</div>
          ) : (
            <p className="text-muted-foreground">The conversation will appear here — it stays in sync with text mode.</p>
          )}
          {interim && !speaking ? <p className="mt-1 text-muted-foreground italic">{interim}</p> : null}
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
