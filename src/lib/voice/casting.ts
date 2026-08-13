/**
 * VOICE CASTING (the brief's "Cast a distinct voice per case, matched to
 * age/gender/region. en-IN where available. Store voice_id on sim_cases.")
 *
 * Deterministic: same demographics ⇒ same voice id. Providers accept these
 * ids as the `voice` parameter (Qwen3-TTS, Chatterbox, CosyVoice2, Kokoro
 * all take a voice name). The mapping is a CONVENTION: if a provider lacks
 * the exact id, it falls back to its default — the cast still drives the
 * affect-mapped rate/pitch, which is the immersion backbone.
 */

export interface CastInput {
  gender?: "male" | "female" | "other";
  age?: number;
  region?: string;
}

const REGION_HINTS: Record<string, string> = {
  punjab: "punjabi", delhi: "hindi", mumbai: "hinglish", maharashtra: "marathi",
  karnataka: "kannada", tamilnadu: "tamil", telangana: "telugu", ap: "telugu",
  bengal: "bengali", gujarat: "gujarati", up: "hindi", bihar: "bhojpuri",
  rajasthan: "rajasthani", kerala: "malayalam", odisha: "odia",
};

/** Deterministic voice id per case: en-IN + region + gender + age band. */
export function castVoiceId(input: CastInput): string {
  const region = (input.region ?? "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  const hint = Object.entries(REGION_HINTS).find(([k]) => region.includes(k))?.[1] ?? "hinglish";
  const gender = input.gender === "male" ? "male" : input.gender === "female" ? "female" : "neutral";
  const ageBand = input.age == null ? "adult" : input.age < 20 ? "young" : input.age > 55 ? "senior" : "adult";
  return `en-IN-${hint}-${gender}-${ageBand}`;
}