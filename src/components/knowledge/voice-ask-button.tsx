"use client";

import * as React from "react";
import { Mic, Square, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Voice-ask button for the Psychology Tutor — "talk like Claude".
 *
 * Press once → the AI "appears" and starts listening. You talk naturally
 * (continuous recognition, live interim transcript shown). A pause auto-stops,
 * the final transcript is sent to the knowledge layer as your question, and
 * the grounded answer comes back (optionally spoken aloud).
 *
 * Recording path: browser Web Speech (free, live interim) when available;
 * otherwise MediaRecorder → server Groq Whisper (/api/practice/voice/stt) for
 * higher en-IN accuracy. Both hand the finished question to onTranscribed.
 */
export function VoiceAskButton({
  onTranscribed,
  disabled,
  className,
}: {
  /** called with the transcribed question text when a spoken turn completes */
  onTranscribed: (text: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [recording, setRecording] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [interim, setInterim] = React.useState("");
  const [finalText, setFinalText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const mediaRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const recogRef = React.useRef<{
    start: () => void; stop: () => void;
    onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
    onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null;
  } | null>(null);
  const finalRef = React.useRef("");
  const pauseTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  function webSpeechSupported(): boolean {
    return typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  }

  /** Browser Web Speech — live interim, continuous, auto-stops on pause. */
  function startWebSpeech() {
    const SR = (window as unknown as Record<string, new () => unknown>).SpeechRecognition
      ?? (window as unknown as Record<string, new () => unknown>).webkitSpeechRecognition;
    const recog = new SR() as {
      lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
      start: () => void; stop: () => void;
      onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
      onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null;
    };
    recog.lang = "en-IN";
    recog.continuous = true;
    recog.interimResults = true;
    recog.maxAlternatives = 1;
    recogRef.current = recog;

    recog.onresult = (e) => {
      let interimText = "";
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const t = r[0]?.transcript ?? "";
        if (r.isFinal) finalText += t;
        else interimText += t;
      }
      if (finalText) {
        finalRef.current = (finalRef.current + " " + finalText).trim();
        setFinalText(finalRef.current);
      }
      setInterim(interimText);

      // Auto-stop on a pause (no new speech for ~2.5s after a final result).
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (finalRef.current) {
        pauseTimerRef.current = setTimeout(() => {
          recog.stop();
        }, 2500);
      }
    };
    recog.onend = () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      setRecording(false);
      setInterim("");
      const text = finalRef.current.trim();
      finalRef.current = "";
      setFinalText("");
      if (text) onTranscribed(text);
    };
    recog.onerror = (ev) => {
      // "no-speech" is a normal end; anything else is a real error.
      if (ev.error !== "no-speech") setError(`Couldn't hear clearly (${ev.error}). Press the mic and try again.`);
      if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
        setError("Microphone permission denied — allow mic access, or type instead.");
      }
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
          setInterim("");
        }
      };
      rec.start();
      mediaRef.current = rec;
      setRecording(true);
    } catch {
      if (webSpeechSupported()) startWebSpeech();
      else setError("Mic unavailable — type your question instead.");
    } finally {
      setBusy(false);
    }
  }

  function startListening() {
    if (webSpeechSupported()) startWebSpeech();
    else startMic();
  }

  function stopListening() {
    if (mediaRef.current && mediaRef.current.state === "recording") mediaRef.current.stop();
    else if (recogRef.current) recogRef.current.stop();
  }

  function toggle() {
    if (recording) stopListening();
    else startListening();
  }

  React.useEffect(() => () => {
    if (mediaRef.current && mediaRef.current.state === "recording") mediaRef.current.stop();
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
  }, []);

  const liveText = (finalText + " " + interim).trim();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled || busy}
        title={recording ? "Stop listening" : "Press once and talk"}
        aria-label={recording ? "Stop listening" : "Ask by voice — press once and talk"}
        aria-pressed={recording}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border-2 px-2.5 py-2 text-sm transition-colors",
          recording ? "border-destructive bg-destructive/10 text-destructive" : "border-border hover:border-link",
          busy && "opacity-60",
          className,
        )}
      >
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : recording ? <Square className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
        {recording && <span className="text-caption font-medium">Listening…</span>}
      </button>

      {recording && (
        <div className="flex min-w-0 items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-1">
          <Volume2 className="size-3 shrink-0 animate-pulse text-destructive" aria-hidden />
          <span className="truncate text-caption italic text-muted-foreground">
            {liveText || "Speak now — your words appear here live"}
          </span>
        </div>
      )}
    </div>
  );
}
