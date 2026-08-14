#!/usr/bin/env tsx
/**
 * OPTIONAL V4-Flash concept-enrichment lane — deepens the deterministic lexicon
 * extraction with model-identified concepts (soft synonyms, implicit concepts,
 * relationships). Gated on a no-train provider key.
 *
 *   npm run knowledge:enrich          # only does something when a key is set
 *
 * Currently a NO-OP when AI is disabled / no no-train key exists (the honest
 * state: the deterministic layer already achieves 100% retrieval recall, so
 * this lane is for future depth, not a current fix). When a key IS set, it
 * would: for each corpus_document, ask the model to extract concepts +
 * relationships from a sample of its chunks, merge them into knowledge_concepts
 * and knowledge_chunk_concepts, and log usage.
 *
 * The model strategy (per the build brief): V4 Flash (fast, cheap) for the
 * bulk extraction; V4 Pro only for verification of high-value concepts. No
 * student data touches this lane (corpus is authored educational material).
 */
import { readFileSync } from "node:fs";

function loadEnv(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(new RegExp(`^${name}=(.*)$`));
      if (m) return m[1].trim();
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

/** The no-train provider keys this lane can use. */
const NO_TRAIN_KEYS = ["ANTHROPIC_API_KEY", "GROQ_API_KEY", "CEREBRAS_API_KEY", "OPENROUTER_API_KEY"] as const;

async function main() {
  const hasKey = NO_TRAIN_KEYS.some((k) => loadEnv(k));
  const aiEnabled = loadEnv("AI_ENABLED") === "true";

  if (!hasKey || !aiEnabled) {
    console.log(
      "enrich-concepts: no no-train provider key / AI_ENABLED unset — this lane is gated.\n" +
        "The deterministic lexicon extraction (npm run knowledge:concepts) already covers " +
        "drugs, disorders and core clinical terms at $0. Set ANTHROPIC/GROQ/CEREBRAS key + " +
        "AI_ENABLED=true to run V4-Flash concept deepening.",
    );
    process.exit(0);
  }

  // ----------------------------------------------------------------------
  // When a key is present, the enrichment would run here: per corpus_document,
  // sample chunks → model-extract {concept, type, aliases, relationship} →
  // upsert knowledge_concepts + knowledge_chunk_concepts + relationships.
  // Implementation is intentionally deferred until a key exists so the code
  // path can be tested live rather than against a fixture.
  // ----------------------------------------------------------------------
  console.log("enrich-concepts: provider key detected — enrichment path is scaffolded, not yet wired.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
