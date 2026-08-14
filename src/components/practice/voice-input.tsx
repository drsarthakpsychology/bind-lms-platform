"use client";

import * as React from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { useVoiceSession } from "@/lib/voice/use-voice";
import { haptic } from "@/lib/haptics";

/**
 * Voice input panel for the Consulting Room.
 * - Push-to-talk: hold the mic to speak; release to send.
 * - Interim transcript shown live, EDITABLE before send.
 * - Patient speech via TTS (rate/pitch from the case's affect_rules).
 * - Silence meter: shows how long the patient has been silent (teaches the
 *   student to sit with it).
 */
export function VoiceInput({
  onSend,
  onPatientSpeak,
  onExitVoice,
  patientReply,
  patientVoicePrefs,
  disabled,
}: {
  onSend: (text: string) => void;
  onPatientSpeak: () => string;
  /** Leave voice mode and go back to the compact typing composer. */
  onExitVoice?: () => void;
  /** The patient's latest reply — auto-spoken when it changes (T129 loop). */
  patientReply?: string;
  patientVoicePrefs: { rate: number; pitch: number; lang?: string; gender?: "male" | "female" };
  disabled?: boolean;
}) {
  const voice = useVoiceSession();
  const [draft, setDraft] = React.useState("");
  const [pressed, setPressed] = React.useState(false);
  const [safetyWarned, setSafetyWarned] = React.useState(false);

  // Auto-speak the patient's reply once it arrives, closing the hands-free
  // loop (speak → transcribed → answered → heard back). Guarded so a re-render
  // never re-speaks the same reply.
  const lastAutoSpoken = React.useRef("");
  React.useEffect(() => {
    if (!patientReply || patientReply === lastAutoSpoken.current) return;
    lastAutoSpoken.current = patientReply;
    if (voice.ttsAvailable) {
      voice.speak(patientReply, patientVoicePrefs);
    }
  }, [patientReply, voice, patientVoicePrefs]);

  // Show the interim transcript as it arrives, editable.
  // (setDraft is a state setter; the eslint immutability rule is fine with
  // assigning to it inside an effect as long as it's not derived — we guard.)
  const lastInterim = React.useRef("");
  React.useEffect(() => {
    if (voice.interim && voice.interim !== lastInterim.current) {
      lastInterim.current = voice.interim;
      setDraft(voice.interim);
    }
  }, [voice.interim]);

  const handlePointerDown = () => {
    if (disabled || !voice.sttAvailable) return;
    setPressed(true);
    haptic("tap");
    voice.startListening();
  };

  const handlePointerUp = () => {
    if (!pressed) return;
    setPressed(false);
    const text = voice.stopListening();
    if (text) setDraft(text);
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || disabled) return;
    onSend(text);
    setDraft("");
    haptic("success");
  };

  const handlePatientSpeak = () => {
    if (!voice.ttsAvailable) return;
    const text = onPatientSpeak();
    if (!text) return;
    voice.speak(text, patientVoicePrefs);
    haptic("tap");
  };

  return (
    <div className="space-y-2">
      {/* Mic permission denied — explain and point at the always-available
          text box (§40: never trap the user in a broken voice state). */}
      {voice.sttReason === "not-allowed" || voice.sttReason === "service-not-allowed" ? (
        <p className="rounded-md border border-status-alert-fg/40 bg-status-alert-bg px-3 py-2 text-caption text-status-alert-fg" role="alert">
          Microphone access was blocked, so voice won&apos;t work. You can still type
          your question below — tap Allow in the browser to try voice again.
        </p>
      ) : null}

      {/* Safety notice (Safari permission) — shown once before first mic use */}
      {!safetyWarned && voice.sttAvailable ? (
        <p className="text-caption text-muted-foreground">
          Your browser will ask to use the microphone. On Safari this shows an
          &quot;Access Speech Recognition&quot; prompt — audio goes to the browser&apos;s
          provider for transcription. You can always type instead.
          <button
            type="button"
            className="ml-1 underline"
            onClick={() => setSafetyWarned(true)}
          >
            Got it
          </button>
        </p>
      ) : null}

      {/* Voice header — the state + the one obvious way back to typing. */}
      <div className="flex items-center justify-between">
        <p className="text-caption font-semibold text-muted-foreground">
          {voice.status === "listening"
            ? "Listening… speak now."
            : voice.status === "processing"
              ? "Heard you — thinking…"
              : voice.status === "speaking"
                ? "Patient speaking…"
                : "Voice"}
        </p>
        {onExitVoice ? (
          <button
            type="button"
            onClick={onExitVoice}
            className="rounded-md border-2 border-border bg-background px-2.5 py-1 text-caption font-medium hover:bg-accent"
          >
            Type instead
          </button>
        ) : null}
      </div>

      {/* Mic controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            if (pressed) {
              setPressed(false);
              voice.stopListening();
            }
          }}
          disabled={disabled || !voice.sttAvailable}
          aria-pressed={pressed}
          aria-label={pressed ? "Release to stop recording" : "Hold to talk"}
          className={`flex size-12 items-center justify-center rounded-full border-2 border-border transition-transform active:scale-95 ${
            pressed
              ? "bg-red-500 text-white ring-2 ring-red-300"
              : "bg-secondary text-link"
          } disabled:opacity-40`}
        >
          {pressed ? (
            <Square className="size-5 animate-pulse" aria-hidden />
          ) : (
            <Mic className="size-5" aria-hidden />
          )}
        </button>

        {/* live waveform while listening */}
        {pressed ? (
          <span className="flex h-5 items-end gap-0.5" aria-hidden>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-primary animate-wave"
                style={{ height: `${20 + ((i * 17) % 60)}%`, animationDelay: `${i * 90}ms` }}
              />
            ))}
          </span>
        ) : null}

        {voice.silenceSeconds >= 3 ? (
          <span className="text-caption text-muted-foreground" aria-live="polite">
            {voice.silenceSeconds}s of silence — the patient is waiting.
          </span>
        ) : null}

        {!voice.sttAvailable ? (
          <span className="text-caption text-muted-foreground">
            Voice not supported in this browser — you can type instead.
            {voice.sttReason === "firefox-flag" ? " (Firefox needs the speech-recognition flag.)" : ""}
          </span>
        ) : null}

        <button
          type="button"
          onClick={handlePatientSpeak}
          disabled={disabled || !voice.ttsAvailable}
          aria-label="Play patient's last line"
          className="flex size-12 items-center justify-center rounded-full border-2 border-border bg-secondary text-link transition-transform active:scale-95 disabled:opacity-40"
        >
          <Volume2 className="size-5" aria-hidden />
        </button>
      </div>

      {/* Editable interim/draft transcript */}
      <div className="flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={voice.status === "listening" ? "Listening… speak now." : "Or type your question…"}
          rows={2}
          className="flex-1 resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Your message (editable)"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !draft.trim()}
          className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
