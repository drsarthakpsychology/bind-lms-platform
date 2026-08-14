"use client";

import * as React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Voice-ask button for the Psychology Tutor — "talk like ChatGPT".
 *
 * Press the mic, speak, release: the recording is sent to the server-side Groq
 * Whisper STT (/api/practice/voice/stt), and the transcript is handed to the
 * caller as a finished question. The caller then asks the knowledge layer and
 * can read the answer aloud.
 *
 * Falls back to the browser Web Speech STT when it's supported (free, zero
 * network); the Groq path is the higher-accuracy upgrade.
 */
export function VoiceAskButton({
  onTranscribed,
  disabled,
  className,
}: {
  /** called with the transcribed question text */
  onTranscribed: (text: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [recording, setRecording] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const mediaRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const recogRef = React.useRef<{ start: () => void; stop: () => void; onresult: ((e: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null; onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null } | null>(null);

  /** Prefer the browser Web Speech API (free, no network, works today). */
  function webSpeechSupported(): boolean {
    return typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  }

  function startWebSpeech() {
    const SR = (window as unknown as Record<string, new () => unknown>).SpeechRecognition
      ?? (window as unknown as Record<string, new () => unknown>).webkitSpeechRecognition;
    const recog = new SR() as {
      lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
      start: () => void; stop: () => void;
      onresult: ((e: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
      onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null;
    };
    recog.lang = "en-IN";
    recog.continuous = false;
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recogRef.current = recog;
    recog.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (transcript) onTranscribed(transcript);
    };
    recog.onend = () => setRecording(false);
    recog.onerror = (e) => {
      setError(`Speech not recognised: ${e.error}. Try the mic or type instead.`);
      setRecording(false);
    };
    recog.start();
    setRecording(true);
    setError(null);
  }

  /** MediaRecorder → server Groq Whisper (higher accuracy, en-IN). */
  async function startMic() {
    setBusy(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        chunksRef.current = [];
        setBusy(true);
        try {
          const buf = await blob.arrayBuffer();
          const audioBase64 = Buffer.from(buf).toString("base64");
          const res = await fetch("/api/practice/voice/stt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioBase64, mime: blob.type || "audio/webm" }),
          });
          const body = await res.json();
          if (!res.ok) throw new Error(body.detail ?? body.error ?? "STT failed");
          if (body.transcript?.trim()) {
            onTranscribed(body.transcript.trim());
          } else {
            setError("Couldn't hear that — try again or type instead.");
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : "Transcription failed. Type instead.");
        } finally {
          setBusy(false);
          setRecording(false);
        }
      };
      rec.start();
      mediaRef.current = rec;
      setRecording(true);
    } catch {
      // getUserMedia denied/unsupported — fall back to Web Speech if available.
      if (webSpeechSupported()) {
        startWebSpeech();
      } else {
        setError("Mic unavailable — type your question instead.");
      }
    } finally {
      setBusy(false);
    }
  }

  function stopRecording() {
    if (mediaRef.current && mediaRef.current.state === "recording") {
      mediaRef.current.stop();
    } else if (recogRef.current) {
      recogRef.current.stop();
    } else {
      setRecording(false);
    }
  }

  function toggle() {
    if (recording) stopRecording();
    else if (webSpeechSupported() && !navigator.mediaDevices?.getUserMedia) startWebSpeech();
    else startMic();
  }

  React.useEffect(() => () => {
    if (mediaRef.current && mediaRef.current.state === "recording") mediaRef.current.stop();
  }, []);

  const label = recording ? "Stop and transcribe" : "Ask by voice";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled || busy}
      title={label}
      aria-label={label}
      aria-pressed={recording}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border-2 border-border px-2.5 py-2 text-sm transition-colors hover:border-link",
        recording && "border-destructive bg-destructive/10 text-destructive",
        busy && "opacity-60",
        className,
      )}
    >
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : recording ? <MicOff className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
      <span className="sr-only">{label}</span>
      {recording && <span className="text-caption">Listening…</span>}
    </button>
  );
}
