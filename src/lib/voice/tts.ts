"use client";

/**
 * Text-to-speech via the browser speechSynthesis API. Cost: zero.
 *
 * iOS gotcha: speak() only fires inside a user-gesture handler (a tap or
 * click) or WebKit silently drops it. So the voice session MUST start with an
 * explicit "Start session" tap, and we keep the utterance queue alive from
 * within gesture context. This is handled by the voice UI (session starts on a
 * button press).
 *
 * Pick voices by patient demographic where the OS provides them (en-IN voices
 * where available). Vary rate and pitch by the case's affect_rules — a
 * depressed patient speaks slower and flatter.
 */

export interface TtsVoicePrefs {
  rate: number; // 0.6–1.4 (affect-driven)
  pitch: number; // 0.6–1.4
  lang?: string; // "en-IN"
  gender?: "male" | "female" | "other";
}

export interface TtsEngine {
  supported(): boolean;
  speak(text: string, prefs: TtsVoicePrefs): void;
  cancel(): void;
  speaking(): boolean;
  onBoundary?: (charIndex: number) => void;
}

function pickVoice(prefs: TtsVoicePrefs): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const lang = prefs.lang ?? "en-IN";
  const gender = prefs.gender;

  // Prefer the requested lang (default en-IN), then gender match within it.
  const enIn = voices.filter((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
  if (enIn.length) {
    if (gender) {
      const g = enIn.find((v) => v.name.toLowerCase().includes(gender === "male" ? "male" : "female"));
      if (g) return g;
    }
    return enIn[0];
  }
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  return en[0] ?? voices[0] ?? null;
}

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function createTts(): TtsEngine | null {
  if (!ttsSupported()) return null;

  return {
    supported: () => true,
    speak(text, prefs) {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel(); // clear queue — we speak one at a time
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(prefs);
      if (v) u.voice = v;
      u.lang = prefs.lang ?? "en-IN";
      u.rate = prefs.rate;
      u.pitch = prefs.pitch;
      u.onboundary = (e) => this.onBoundary?.(e.charIndex);
      window.speechSynthesis.speak(u);
    },
    cancel() {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    },
    speaking() {
      return typeof window !== "undefined" && window.speechSynthesis ? window.speechSynthesis.speaking : false;
    },
  };
}
