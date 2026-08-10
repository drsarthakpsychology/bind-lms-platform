"use client";

import * as React from "react";

/**
 * Voice delivery metrics (Part 5.4). Tracked client-side during a voice
 * session, surfaced in the debrief as a small "delivery" panel.
 *
 * Metrics: mean silence tolerance, interruption count, questions per minute,
 * filler-word rate, longest uninterrupted patient stretch. Compare against the
 * student's OWN previous sessions, not other students.
 */

export interface VoiceMetrics {
  mean_silence_tolerance_s: number;
  interruption_count: number;
  questions_per_minute: number;
  filler_word_rate: number;
  longest_patient_stretch_s: number;
  session_duration_s: number;
}

const FILLERS = /\b(um|uh|like|so|you know|i mean|actually|basically|right)\b/gi;

export function useVoiceMetrics() {
  // Timestamp is captured lazily on first report() (a user action), never
  // during render — keeps the hook render-pure for the react-hooks rule.
  const startRef = React.useRef<number | null>(null);
  const [patientSpeechMs, setPatientSpeechMs] = React.useState(0);
  const [silences, setSilences] = React.useState<number[]>([]);
  const [interruptions, setInterruptions] = React.useState(0);
  const [questions, setQuestions] = React.useState(0);
  const [fillers, setFillers] = React.useState(0);
  const [words, setWords] = React.useState(0);

  /** Call when the student starts speaking (a patient-turn interruption). */
  const markInterruption = React.useCallback((patientWasSpeaking: boolean) => {
    if (patientWasSpeaking) setInterruptions((i) => i + 1);
  }, []);

  /** Call with the student's spoken text once finalized. */
  const recordStudentSpeech = React.useCallback((text: string) => {
    const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWords((w) => w + wc);
    const f = text.match(FILLERS)?.length ?? 0;
    setFillers((x) => x + f);
    // crude question count: ends with ? or starts with a wh- word
    if (/\?\s*$/.test(text) || /^(what|when|where|who|why|how|did|do|is|are|can|could)\b/i.test(text)) {
      setQuestions((q) => q + 1);
    }
  }, []);

  /** Call when a silence gap ends (length in seconds). */
  const recordSilence = React.useCallback((seconds: number) => {
    if (seconds > 0) setSilences((s) => [...s, seconds]);
  }, []);

  const report = React.useCallback(
    (): VoiceMetrics => {
      if (startRef.current === null) startRef.current = Date.now();
      const elapsedMs = Date.now() - startRef.current;
      const sessionDurationS = Math.max(1, Math.round(elapsedMs / 1000));
      return {
        mean_silence_tolerance_s: silences.length
          ? Math.round((silences.reduce((a, b) => a + b, 0) / silences.length) * 10) / 10
          : 0,
        interruption_count: interruptions,
        questions_per_minute: Math.round((questions / (sessionDurationS / 60)) * 10) / 10,
        filler_word_rate: words ? Math.round((fillers / words) * 100) / 100 : 0,
        longest_patient_stretch_s: Math.round(patientSpeechMs / 1000),
        session_duration_s: sessionDurationS,
      };
    },
    [patientSpeechMs, silences, interruptions, questions, fillers, words],
  );

  return {
    markInterruption,
    recordStudentSpeech,
    recordSilence,
    report,
    setPatientSpeechMs,
  };
}
