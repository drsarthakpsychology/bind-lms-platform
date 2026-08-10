"use client";

import * as React from "react";
import { createWebStt, sttStatus, type SttEngine } from "./stt";
import { createTts, ttsSupported, type TtsEngine, type TtsVoicePrefs } from "./tts";

/**
 * The voice-session hook — push-to-talk + patient TTS + silence meter.
 *
 * - push-to-talk: the student holds the mic button to speak, or taps to
 *   start/stop. We default to push-to-talk per Part 5.3.
 * - interim transcript is surfaced live so the student can edit before send.
 * - silence meter: a quiet visual showing how long the patient has been silent.
 * - iOS: the session must start from a user gesture (the "Start session" tap),
 *   which also unlocks speechSynthesis.
 */

export type VoiceStatus = "idle" | "listening" | "processing" | "speaking";

export function useVoiceSession() {
  // Availability is a pure function of the browser — compute lazily, once.
  const [status, setStatus] = React.useState<VoiceStatus>("idle");
  const [sttAvailable] = React.useState(() => sttStatus().supported);
  const [ttsAvailable] = React.useState(() => ttsSupported());
  const [sttReason, setSttReason] = React.useState<string | null>(() => sttStatus().reason ?? null);
  const [interim, setInterim] = React.useState("");
  const [interimConfident, setInterimConfident] = React.useState(true);
  const [silenceSeconds, setSilenceSeconds] = React.useState(0);

  const sttRef = React.useRef<SttEngine | null>(null);
  const ttsRef = React.useRef<TtsEngine | null>(null);
  const interimRef = React.useRef("");
  const silenceRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const clearSilence = React.useCallback(() => {
    if (silenceRef.current) clearInterval(silenceRef.current);
    silenceRef.current = null;
    setSilenceSeconds(0);
  }, []);

  React.useEffect(() => {
    const eng = createWebStt();
    if (eng) {
      eng.onResult = (r) => {
        interimRef.current = r.transcript;
        setInterim(r.transcript);
        // Web Speech API gives no confidence; if we had one, threshold here.
        setInterimConfident(r.confidence > 0.4);
        if (r.isFinal) {
          setStatus("processing");
        }
      };
      eng.onEnd = () => {
        setStatus((s) => (s === "listening" ? "idle" : s));
        clearSilence();
      };
      eng.onError = (e) => {
        setStatus("idle");
        setSttReason(e);
        clearSilence();
      };
      sttRef.current = eng;
    }
    ttsRef.current = createTts();
    return () => {
      sttRef.current?.abort();
      ttsRef.current?.cancel();
      clearSilence();
    };
  }, [clearSilence]);

  /** Start listening (push-to-talk press). */
  const startListening = React.useCallback(() => {
    if (!sttRef.current) {
      setSttReason("stt-unavailable");
      return;
    }
    setInterim("");
    interimRef.current = "";
    setStatus("listening");
    sttRef.current.start();
  }, []);

  /** Stop listening and return the captured transcript. */
  const stopListening = React.useCallback((): string => {
    sttRef.current?.stop();
    setStatus("idle");
    clearSilence();
    return interimRef.current.trim();
  }, [clearSilence]);

  /** Patient speaks. Must be called from within a user gesture on iOS. */
  const speak = React.useCallback((text: string, prefs: TtsVoicePrefs) => {
    if (!ttsRef.current) return;
    setStatus("speaking");
    ttsRef.current.speak(text, prefs);
    // Start the silence meter AFTER the patient finishes a stretch.
    if (silenceRef.current) clearInterval(silenceRef.current);
    silenceRef.current = setInterval(() => {
      if (!ttsRef.current?.speaking()) {
        setSilenceSeconds((s) => s + 1);
      } else {
        setSilenceSeconds(0);
      }
    }, 1000);
  }, []);

  const stopSpeaking = React.useCallback(() => {
    ttsRef.current?.cancel();
    setStatus("idle");
    clearSilence();
  }, [clearSilence]);

  return {
    status,
    sttAvailable,
    ttsAvailable,
    sttReason,
    interim,
    interimConfident,
    silenceSeconds,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
