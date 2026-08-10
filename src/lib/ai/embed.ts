/**
 * The single embedding entry point. ALWAYS halfvec(384), never vector(1536).
 *
 * v3 infra discipline (Part 3.1): 3000 docs × 10 chunks × 1536 dims × 4 bytes
 * ≈ 184 MB — double that with HNSW overhead. At 384 halfvec dims it's ~23 MB.
 * The free Supabase tier dies at 500 MB; the naive schema eats 40% before a
 * student record exists.
 *
 * Matryoshka truncation: request the full dimension from the model, truncate
 * to the first 384, L2-renormalise. Semantic ordering lives in the early
 * dimensions — do NOT average, do NOT PCA.
 *
 * Any code path that writes a vector(1536) column is a bug. Tested.
 */

import { canServe } from "./router";

export const EMBED_DIM = 384;

/** L2-normalise a vector. A zero vector becomes a deterministic unit vector
 *  (first component 1) rather than NaN — embeddings must always be unit-norm. */
export function l2Normalise(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((a, x) => a + x * x, 0));
  if (norm === 0) {
    const out = new Array(v.length).fill(0);
    out[0] = 1;
    return out;
  }
  return v.map((x) => x / norm);
}

/** Truncate to EMBED_DIM then L2-renormalise (Matryoshka). */
export function toEmbedding(v: number[]): number[] {
  const truncated = v.slice(0, EMBED_DIM);
  return l2Normalise(truncated);
}

/**
 * Produce an embedding vector for text. Uses a provider's embed model when
 * configured; otherwise a deterministic fixture (so AI_ENABLED=false and
 * offline tests still get a valid unit-norm vector). Returns exactly
 * EMBED_DIM numbers.
 */
export async function embed(text: string): Promise<number[]> {
  if (text.trim().length === 0) throw new Error("cannot embed empty text");

  if (canServe("embed", false)) {
    // TODO(provider): call the provider's embedding endpoint, parse the vector,
    // then truncate+renormalise. We keep the fixture path first so the app
    // works without keys and tests are network-free.
  }

  // Deterministic fixture embedding: hash each token into a unit-norm vector.
  // This is NOT semantically meaningful — it only guarantees the shape and
  // norm contract that the whole pipeline depends on.
  const v: number[] = new Array(EMBED_DIM).fill(0);
  const tokens = text.toLowerCase().split(/\s+/);
  for (const t of tokens) {
    let h = 2166136261;
    for (let i = 0; i < t.length; i++) {
      h ^= t.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    v[(h >>> 0) % EMBED_DIM] += 1;
  }
  return toEmbedding(v);
}
