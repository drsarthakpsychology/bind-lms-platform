/**
 * Affect → voice mapping (v5 §6). The Director's `affect` output and the
 * patient's fatigue/mood are mapped onto concrete speech parameters:
 * rate, pitch, and an emotion tag for downstream TTS (CosyVoice inline
 * tags when available; browser speechSynthesis rate/pitch otherwise).
 *
 * The brief's core demand: "A patient at fatigue:8, mood:flat speaks slow,
 * flat, quiet. That mapping does more for immersion than anything else."
 * This module is pure and unit-tested; the browser path applies rate/pitch
 * live, the server path passes the tags to the synthesis provider.
 */

export type Affect =
  | "flat" | "flat_with_effort" | "sad" | "anxious" | "irritated"
  | "brittle_cheerful" | "numb" | "agitated" | "resigned";

export interface VoiceParams {
  /** speechSynthesis rate (0.5–1.4) */
  rate: number;
  /** speechSynthesis pitch (0.5–1.4) */
  pitch: number;
  /** Inline emotion tag for CosyVoice-style TTS ("" for browser). */
  emotionTag: "" | "happy" | "sad" | "angry" | "surprised" | "neutral";
  /** A hint string for a scripted/canned synth when available. */
  styleHint: string;
  /** volume/quietness hint (0-1) — flat + exhausted patients speak quietly. */
  loudness: number;
}

/**
 * Map the Director's affect + state onto voice parameters.
 * Pure: same inputs ⇒ same outputs.
 */
export function affectToVoice(
  affect: Affect,
  opts: { fatigue?: number; irritation?: number; mood?: string; baseRate?: number; basePitch?: number } = {},
): VoiceParams {
  const fatigue = Math.max(0, Math.min(10, opts.fatigue ?? 0));
  const irritation = Math.max(0, Math.min(10, opts.irritation ?? 0));
  const baseRate = opts.baseRate ?? 1;
  const basePitch = opts.basePitch ?? 1;

  // The mood line (case-authored, e.g. "flat", "agitated") is a coarse
  // override for the affect-based default.
  const mood = (opts.mood ?? "").toLowerCase();

  let rate = baseRate;
  let pitch = basePitch;
  let emotionTag: VoiceParams["emotionTag"] = "neutral";
  let styleHint = "Neutral, ordinary delivery";
  let loudness = 0.85;

  switch (affect) {
    case "flat":
    case "flat_with_effort":
    case "numb":
      // Flat, quiet, slow. The exhaustion multiplier compounds it.
      rate = Math.max(0.55, baseRate * 0.88);
      pitch = Math.max(0.6, basePitch * 0.92);
      loudness = Math.max(0.35, 0.7 - fatigue * 0.04);
      emotionTag = "sad";
      styleHint = "Slow, flat, quiet — little prosody, pauses between phrases";
      break;
    case "sad":
    case "resigned":
      rate = Math.max(0.6, baseRate * 0.92);
      pitch = Math.max(0.65, basePitch * 0.95);
      loudness = Math.max(0.45, 0.78 - fatigue * 0.03);
      emotionTag = "sad";
      styleHint = "Sombre, unhurried, sighs between thoughts";
      break;
    case "anxious":
      rate = Math.min(1.3, baseRate * 1.1);
      pitch = Math.min(1.3, basePitch * 1.12);
      loudness = 0.9;
      emotionTag = "surprised";
      styleHint = "Slightly faster, higher, breathy at phrase ends";
      break;
    case "irritated":
      rate = Math.min(1.25, baseRate * 1.06);
      pitch = Math.min(1.2, basePitch * 1.05);
      loudness = Math.min(1, 0.92 + irritation * 0.01);
      emotionTag = "angry";
      styleHint = "Terse, clipped, firmer volume";
      break;
    case "agitated":
      rate = Math.min(1.35, baseRate * 1.18);
      pitch = Math.min(1.3, basePitch * 1.1);
      loudness = 0.95;
      emotionTag = "angry";
      styleHint = "Fast, pressured, overlapping phrase boundaries";
      break;
    case "brittle_cheerful":
      rate = baseRate * 1.02;
      pitch = Math.min(1.25, basePitch * 1.08);
      loudness = 0.9;
      emotionTag = "happy";
      styleHint = "Bright on the surface, wavering underneath";
      break;
  }

  // The mood line can override the coarse direction (case-authored truth).
  if (mood.includes("flat") || mood.includes("numb")) {
    rate = Math.max(0.55, rate * 0.95);
    loudness = Math.max(0.35, loudness * 0.9);
  }
  if (mood.includes("agitated") || mood.includes("irrit")) {
    rate = Math.min(1.3, rate * 1.05);
  }

  // THE line from the brief: fatigue 8 + flat mood must sound slow, flat, quiet.
  const fatigued = fatigue >= 8;
  if (fatigued && (affect === "flat" || affect === "flat_with_effort" || affect === "numb")) {
    rate = 0.62;
    pitch = 0.7;
    loudness = 0.4;
    emotionTag = "sad";
    styleHint = "Exhausted and flat — very slow, very quiet, long gaps";
  }

  return { rate, pitch, emotionTag, styleHint, loudness };
}