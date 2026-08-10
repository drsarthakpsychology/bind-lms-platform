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
  patientVoicePrefs,
  disabled,
}: {
  onSend: (text: string) => void;
  onPatientSpeak: () => string;
  patientVoicePrefs: { rate: number; pitch: number; lang?: string; gender?: "male" | "female" };
  disabled?: boolean;
}) {
  const voice = useVoiceSession();
  const [draft, setDraft] = React.useState("");
  const [pressed, setPressed] = React.useState(false);
  const [safetyWarned, setSafetyWarned] = React.useState(false);

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
            pressed ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
          } disabled:opacity-40`}
        >
          {pressed ? <Square className="size-5" aria-hidden /> : <Mic className="size-5" aria-hidden />}
        </button>

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
          className="flex size-12 items-center justify-center rounded-full border-2 border-border bg-secondary text-primary transition-transform active:scale-95 disabled:opacity-40"
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
