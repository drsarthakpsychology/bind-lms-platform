/**
 * Self-hosted embedding — all-MiniLM-L6-v2 (Apache-2.0, 384-dim) via
 * transformers.js. Matches the schema's halfvec(384) exactly and costs zero
 * API money: the model is downloaded once (~25 MB) to a local cache and then
 * runs on-device.
 *
 * This is the knowledge pipeline's embedding path (corpus chunks + query
 * vectors at retrieval time). It is deliberately separate from the provider
 * router (src/lib/ai/embed.ts): the router stays the general AI path, this is
 * the knowledge-layer-specific self-hosted embedder. Both produce
 * unit-norm 384-dim vectors.
 *
 * The pipeline is lazy and cached: the first call loads the model, subsequent
 * calls reuse it. In the Next.js server the heavy import is dynamic, so a
 * route that never embeds never pays the load cost.
 */
import { EMBED_DIM, l2Normalise } from "@/lib/ai/embed";

type FeatureExtractor = {
  (text: string, opts: { pooling: "mean"; normalize: boolean }): Promise<{ data: Float32Array }>;
};

let extractorPromise: Promise<FeatureExtractor> | null = null;

async function loadExtractor(): Promise<FeatureExtractor> {
  // Dynamic import keeps transformers.js out of bundles until first use.
  const mod = await import("@huggingface/transformers");
  const pipeline = (mod as { pipeline?: unknown }).pipeline ?? (mod as unknown as { default: { pipeline: unknown } }).default.pipeline;
  if (typeof pipeline !== "function") {
    throw new Error("transformers.js pipeline is unavailable");
  }
  const feature = await (pipeline as (task: string, model: string, opts: object) => Promise<FeatureExtractor>)(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    { quantized: true },
  );
  return feature;
}

/** Get (and memoize) the feature-extraction pipeline. */
export function getEmbedder(): Promise<FeatureExtractor> {
  if (!extractorPromise) {
    extractorPromise = loadExtractor();
  }
  return extractorPromise;
}

/** True once the model has been loaded (or failed) this process. */
export function isEmbedderLoaded(): boolean {
  return extractorPromise !== null;
}

/**
 * Embed text → unit-norm halfvec(384). Throws if the self-hosted model cannot
 * be loaded (callers decide fallback behaviour). Used for corpus chunks and
 * for query vectors at retrieval time.
 */
export async function embedLocal(text: string): Promise<number[]> {
  const extractor = await getEmbedder();
  const out = await extractor(text.slice(0, 6000), { pooling: "mean", normalize: true });
  const vec = Array.from(out.data);
  if (vec.length !== EMBED_DIM) {
    // Matryoshka-truncate then renormalise (same contract as the router path).
    return l2Normalise(vec.slice(0, EMBED_DIM));
  }
  return vec;
}
