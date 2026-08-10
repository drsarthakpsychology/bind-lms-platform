/**
 * Seeded variation (Part 2.5) — controlled, reproducible per-session variety.
 *
 * A case ships a VariationSchema; each session draws a seed deterministically
 * from (case_id + session seed). The SAME seed always yields the SAME variant,
 * so a debrief is reproducible and faculty can re-run the exact same run.
 *
 * Variation is in mood, phrasing, and what the patient defends. The clinical
 * FACTS never vary. Diagnosis, history, and risk are fixed data.
 */

import type { SessionVariant, VariationSchema } from "./types";

/** A tiny deterministic PRNG (mulberry32) from a numeric seed. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Derive a 32-bit seed from a string (FNV-1a). */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Draw a SessionVariant deterministically from (caseId, sessionSeed). */
export function drawVariant(schema: VariationSchema, caseId: string, sessionSeed: number): SessionVariant {
  const rng = mulberry32(hashString(caseId) ^ (sessionSeed >>> 0));
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  return {
    mood_today: pick(schema.mood_today),
    recent_event: pick(schema.recent_event),
    most_defended_topic: pick(schema.most_defended_topic),
    opening_posture: pick(schema.opening_posture),
    somatic_focus: pick(schema.somatic_focus),
    trust_start: pick(schema.trust_start),
    language_mix: pick(schema.language_mix),
  };
}

/** Same seed ⇒ same variant (determinism contract). */
export function variantFingerprint(v: SessionVariant): string {
  return [
    v.mood_today, v.recent_event, v.most_defended_topic,
    v.opening_posture, v.somatic_focus, v.trust_start, v.language_mix,
  ].join("|");
}
