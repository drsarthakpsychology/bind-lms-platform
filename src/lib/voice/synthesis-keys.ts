/**
 * Synthesis identifiers shared between the server synthesizer and the
 * pre-generation script — NO server-only deps so local scripts can import
 * it. The cache key is sha256(text|voice|emotion|speed): the R2 object key
 * for every synthesis (cache-once, replay-forever).
 */
import { createHash } from "node:crypto";

export interface SynthesisRequest {
  text: string;
  voice: string;
  emotionTag?: "" | "happy" | "sad" | "angry" | "surprised" | "neutral";
  speed?: number;
  /** Provider-specific model override (defaults per provider). */
  model?: string;
}

export function synthesisCacheKey(req: SynthesisRequest): string {
  return createHash("sha256")
    .update(`${req.text}|${req.voice}|${req.emotionTag ?? ""}|${req.speed ?? 1}`)
    .digest("hex");
}