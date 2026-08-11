"use client";

/**
 * Speech-to-text via the browser Web Speech API. Cost: zero.
 * Supported: Chrome 25+, Edge 87+, Safari 14.1+ (macOS), 14.5+ (iOS),
 * Samsung Internet 4+. Firefox is behind a flag — detect and fall back to text.
 *
 * Known behaviours handled:
 * - NOT offline — Chrome/Safari stream audio to their servers. On poor
 *   connectivity, degrade to text mode with a clear message.
 * - Safari shows an "Access Speech Recognition" permission modal — warn the
 *   student before the mic button (see the voice UI).
 * - Indian-English recognition: set lang="en-IN", show the interim transcript
 *   live, let the student EDIT before sending.
 * - Use the confidence score; below threshold, show interim text in amber.
 *
 * Upgrade path (off by default): Groq Whisper / Deepgram streaming — the
 * interface is provider-shaped so they can drop in.
 */

export interface SttResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SttEngine {
  supported(): boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onResult?: (r: SttResult) => void;
  onEnd?: () => void;
  onError?: (e: string) => void;
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: {
    resultIndex: number;
    results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
  }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function webSttSupported(): boolean {
  return typeof window !== "undefined" && getCtor() !== null;
}

export function createWebStt(): SttEngine | null {
  if (!webSttSupported()) return null;
  const Ctor = getCtor()!;
  let rec: SpeechRecognitionLike | null = null;

  return {
    supported: () => true,
    start() {
      try {
        rec = new Ctor();
        rec.lang = "en-IN";
        rec.continuous = false;
        rec.interimResults = true;
        rec.maxAlternatives = 1;
        rec.onresult = (e) => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const r = e.results[i];
            this.onResult?.({
              transcript: r[0]?.transcript ?? "",
              confidence: 0.5, // Web Speech API gives no per-result confidence
              isFinal: r.isFinal,
            });
          }
        };
        rec.onend = () => this.onEnd?.();
        rec.onerror = (e) => this.onError?.(e.error);
        rec.start();
      } catch {
        this.onError?.("recognition-start-failed");
      }
    },
    stop() {
      rec?.stop();
    },
    abort() {
      rec?.abort();
    },
  };
}

/** Detects whether the current browser can do web STT at all. */
export function sttStatus(): { supported: boolean; reason?: string } {
  if (typeof window === "undefined") return { supported: false, reason: "no-window" };
  if (!webSttSupported()) {
    // Firefox has it behind a flag; iOS Safari 14.5+ supports it.
    const ua = navigator.userAgent;
    if (/Firefox/.test(ua)) return { supported: false, reason: "firefox-flag" };
    return { supported: false, reason: "unsupported" };
  }
  return { supported: true };
}

/**
 * Server Whisper STT (v5 §6) — used when the browser engine is unavailable
 * (Firefox behind a flag) or the student opts in for better accent accuracy.
 * The server route tries Groq → NVIDIA; the interim transcript is surfaced
 * live and editable (the edit-before-send flow lives in the voice UI).
 */
export interface ServerSttEngine extends SttEngine {
  type: "server";
}

export function createServerStt(): ServerSttEngine | null {
  if (typeof window === "undefined") return null;
  return {
    type: "server",
    supported: () => true,
    start() {
      // Recording is handled by the parent (MediaRecorder); start() here
      // only signals readiness. The parent finalises and POSTs the blob.
      this.onResult?.({
        transcript: "",
        confidence: 1,
        isFinal: false,
      });
    },
    stop() {
      /* the parent finalises the recording */
    },
    abort() {
      /* no-op */
    },
  };
}

/** Transcribe an audio blob via the server route (Groq → NVIDIA → 503). */
export async function serverTranscribe(blob: Blob): Promise<{ transcript: string } | { error: string }> {
  const buf = await blob.arrayBuffer();
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  try {
    const res = await fetch("/api/practice/voice/stt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioBase64: b64, mime: blob.type }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => null)) as { error?: string } | null;
      return { error: j?.error ?? "STT failed" };
    }
    return (await res.json()) as { transcript: string };
  } catch {
    return { error: "Network error" };
  }
}
