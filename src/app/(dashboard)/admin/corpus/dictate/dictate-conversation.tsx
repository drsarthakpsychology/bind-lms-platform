"use client";

import * as React from "react";
import { Mic, Volume2, Square } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { serverTranscribe } from "@/lib/voice/stt";

interface Turn {
  by: "sarthak" | "interviewer";
  text: string;
  at: string;
}

interface DictationResponse {
  sessionId: string;
  followUp: string | null;
  progress: string;
  complete: boolean;
  transcript: Turn[];
}

/**
 * A7 — Dictation as a conversation. Dr. Sarthak talks (or types); the
 * interviewer state machine asks the next clinical question. Works fully on
 * fixtures (AI_ENABLED=false) via deterministic follow-ups.
 * Voice recording: MediaRecorder -> server STT (Whisper via Groq/NVIDIA/Deepgram).
 */
export function DictateConversation() {
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [transcript, setTranscript] = React.useState<Turn[]>([]);
  const [progress, setProgress] = React.useState("0 fields");
  const [complete, setComplete] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");

  // Voice recording state
  const [recording, setRecording] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  async function send(line: string) {
    if (busy) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/corpus/dictate/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId ?? undefined, rawTranscript: line }),
      });
      const j = (await res.json()) as DictationResponse;
      if (!res.ok) {
        setError(j && "error" in j ? String(j.error) : "Turn failed.");
        return;
      }
      setSessionId(j.sessionId);
      setTranscript(j.transcript);
      setProgress(j.progress);
      setComplete(j.complete);
      if (j.complete) haptic("success");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  /** Start voice recording using MediaRecorder. */
  async function startRecording() {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        // Transcribe via server STT (Whisper)
        const result = await serverTranscribe(blob);
        if ("transcript" in result) {
          // Add to transcript and send to interviewer
          setTranscript((t) => [...t, { by: "sarthak", text: result.transcript, at: new Date().toISOString() }]);
          await send(result.transcript);
        } else {
          setError(result.error ?? "Transcription failed");
        }
        // Clean up
        stream.getTracks().forEach((track) => track.stop());
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100); // Collect in 100ms chunks
      setRecording(true);
      haptic("tap");
    } catch {
      setError("Microphone access denied or unavailable.");
    }
  }

  function stopRecording() {
    if (!recording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
    mediaRecorderRef.current = null;
  }

  /** Save the built draft case. */
  async function finish() {
    if (!sessionId) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/corpus/dictate/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, title: title.trim() || undefined }),
      });
      const j = (await res.json()) as { error?: string; caseId?: string; missingFields?: string[] };
      if (!res.ok) {
        setError(j.error ?? "Could not save.");
        return;
      }
      haptic("success");
      setComplete(true);
      const missing = (j.missingFields ?? []) as string[];
      setError(
        missing.length
          ? `Saved draft (${j.caseId?.slice(0, 8)}…). Still worth adding: ${missing.join(", ")}.`
          : `Saved as a draft. It lands in the review queue.`,
      );
      setSessionId(null);
      setTranscript([]);
      setInput("");
      setTitle("");
      setProgress("New case");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-caption text-muted-foreground">
        <span>{progress}</span>
        <span>{complete ? "case ready" : "keep going"}</span>
      </div>

      {/* Chat transcript */}
      <div className="space-y-3 rounded-md border-2 border-border bg-card p-4 max-h-[24rem] overflow-y-auto">
        {transcript.length === 0 ? (
          <p className="text-small text-muted-foreground">
            Say or type the first thing about the case — start with who they are.
          </p>
        ) : (
          transcript.map((t, i) => (
            <div key={i} className={t.by === "interviewer" ? "rounded-md border border-border bg-secondary/40 p-3" : "rounded-md border border-border bg-background p-3"}>
              <p className="text-caption font-semibold text-muted-foreground">
                {t.by === "interviewer" ? "Interviewer" : "You"}
              </p>
              <p className="mt-1 text-small">{t.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      {!complete ? (
        <div className="space-y-3">
          {/* Voice recorder */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              disabled={busy}
              aria-pressed={recording}
              aria-label={recording ? "Release to stop recording" : "Hold to talk"}
              className={`flex size-14 items-center justify-center rounded-full border-2 border-border transition-transform active:scale-95 ${
                recording
                  ? "bg-red-500 text-white ring-2 ring-red-300"
                  : "bg-secondary text-link"
              } disabled:opacity-40`}
            >
              {recording ? (
                <Square className="size-6 animate-pulse" aria-hidden />
              ) : (
                <Mic className="size-6" aria-hidden />
              )}
            </button>

            {/* Live waveform while recording */}
            {recording && (
              <span className="flex h-6 items-end gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-primary animate-wave"
                    style={{ height: `${20 + ((i * 17) % 60)}%`, animationDelay: `${i * 90}ms` }}
                  />
                ))}
              </span>
            )}

            <span className="text-caption text-muted-foreground flex-1 text-center">
              {recording ? "Recording… release to transcribe" : "Tap to record, or type below"}
            </span>

            <button
              type="button"
              onClick={() => {}}
              disabled={true}
              aria-label="Patient TTS (not needed for dictation)"
              className="flex size-12 items-center justify-center rounded-full border-2 border-border bg-secondary/40 text-muted-foreground/50 cursor-not-allowed"
            >
              <Volume2 className="size-5" aria-hidden />
            </button>
          </div>

          {/* Text input fallback */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                setTranscript((t) => [...t, { by: "sarthak", text: input.trim(), at: new Date().toISOString() }]);
                void send(input.trim());
                setInput("");
              }
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Or type your response…"
              className="flex-1 rounded-md border-2 border-border bg-card px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
            >
              {busy ? "…" : "Send"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-small font-medium" htmlFor="dict-title">Draft case title</label>
            <input
              id="dict-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Young man, shopkeeper, chest heaviness and debt"
              className="mt-1 w-full rounded-md border-2 border-border bg-card px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={finish}
            disabled={busy}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
          >
            {busy ? "Saving…" : "Finish & save as draft"}
          </button>
        </div>
      )}

      {error ? <p className="text-small text-muted-foreground" role="status">{error}</p> : null}
    </div>
  );
}