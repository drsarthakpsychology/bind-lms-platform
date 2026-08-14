#!/usr/bin/env tsx
/**
 * Knowledge retrieval evaluation (brief §24). Measures whether hybrid
 * retrieval surfaces the RIGHT source material for a hand-written,
 * book-grounded question set.
 *
 *   npm run knowledge:eval
 *
 * For each question in EVAL_SET:
 *   - embed it with the same self-hosted MiniLM the corpus used
 *   - retrieve top-k via match_corpus_chunks (the exact path the app uses)
 *   - score source-attribution recall: did any of the expected source books
 *     appear in the top-k? (a loose "relevance gate")
 *
 * Output: per-question hit/miss + a summary (recall@5 / @8, per-category).
 * This is the regression baseline — re-run after any knowledge-layer change.
 */
import { Client } from "pg";
import { readFileSync } from "node:fs";
import { EVAL_SET } from "./eval-set";

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

const REF = "hojhzwvuccojqkvkkslw";
const DB_PASS = loadEnv("SUPABASE_DB_PASSWORD");
if (!DB_PASS) {
  console.error("Missing SUPABASE_DB_PASSWORD (.env.local).");
  process.exit(1);
}

async function retrieveTopK(client: Client, vec: number[], k: number) {
  const { rows } = await client.query(
    `select s.name as source,
            c.chunk_text as text,
            1 - (c.embedding <=> $1::halfvec) as sim
     from public.corpus_chunks c
     join public.corpus_documents d on d.id = c.document_id
     join public.corpus_sources s on s.id = d.source_id
     where c.embedding is not null
     order by c.embedding <=> $1::halfvec
     limit $2`,
    [`[${vec.join(",")}]`, k],
  );
  return rows as Array<{ source: string; text: string; sim: number }>;
}

/**
 * Grounding check (hallucination resistance): do the top-N retrieved passages
 * contain ALL of the question's answerTerms? If a model synthesizes from
 * passages lacking the key answer terms, its answer is not grounded — this
 * catches retrieval that surfaces the right book but the wrong passage.
 *
 * Matching is STEM-TOLERANT: a term matches if the passage contains a word that
 * shares its 4-char prefix (so "obsession" matches "obsessions", "delirium
 * tremens" matches its plural, "reuptake" matches "reuptake"). This avoids
 * false misses from plural/tense inflections while still rejecting passages
 * that genuinely lack the concept.
 */
function isGrounded(top: Array<{ text: string }>, terms: string[], n: number): boolean {
  const window = top.slice(0, n).map((r) => r.text.toLowerCase()).join("\n");
  return terms.every((t) => {
    const base = t.toLowerCase();
    // Whole phrase present?
    if (window.includes(base)) return true;
    // Every word of the phrase present (stem-tolerant, prefix>=4).
    const words = base.split(/\s+/).filter((w) => w.length > 0);
    return words.every((w) => {
      if (w.length <= 3) return window.includes(w);
      const prefix = w.slice(0, 4);
      return new RegExp(`(^|[^a-z])${prefix}[a-z]*([^a-z]|$)`).test(window);
    });
  });
}

async function main() {
  const { embedLocal } = await import("../../src/lib/knowledge/embed-local");
  const client = new Client({
    host: `db.${REF}.supabase.co`,
    port: 5432,
    user: "postgres",
    password: DB_PASS,
    database: "postgres",
    ssl: { rejectUnauthorized: false, servername: `db.${REF}.supabase.co` },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  const k = 8;
  const results: Array<{
    id: string; category: string; ok5: boolean; ok8: boolean;
    grounded: boolean | null; foundSources: string[];
  }> = [];

  for (const q of EVAL_SET) {
    const vec = await embedLocal(q.question);
    const top = await retrieveTopK(client, vec, k);
    const foundSources = [...new Set(top.map((r) => r.source))];
    // expected source in top-5 vs top-8
    const top5Sources = [...new Set(top.slice(0, 5).map((r) => r.source))];
    const ok5Strict = q.expectedSources.some((s) => top5Sources.includes(s));
    const ok8Strict = q.expectedSources.some((s) => foundSources.includes(s));
    // grounding: answerTerms present in the top-8 passages (null if no terms
    // set). 8 is the app's default context window for /api/knowledge/ask — the
    // exact passages a model would synthesise from. A stricter window (e.g. 5)
    // tests chunk-boundary luck, not grounding, because multi-term answers
    // naturally span 2-3 adjacent passages in the same chapter.
    const grounded = q.answerTerms?.length ? isGrounded(top, q.answerTerms, 8) : null;

    results.push({
      id: q.id,
      category: q.category,
      ok5: ok5Strict,
      ok8: ok8Strict,
      grounded,
      foundSources,
    });
    const top1 = top[0];
    const g = grounded === null ? "" : grounded ? "G" : "g";
    console.log(
      `  [${q.id} ${q.category.padEnd(10)}] ${ok5Strict ? "✓" : ok8Strict ? "~" : "✗"}${g} ` +
        `expected[${q.expectedSources.join(",")}] top1=${top1?.source ?? "-"}` +
        (grounded === false ? ` !missing terms: ${q.answerTerms?.join(",")}` : ""),
    );
  }

  const pass5 = results.filter((r) => r.ok5).length;
  const pass8 = results.filter((r) => r.ok8).length;
  const total = results.length;
  const groundedTotal = results.filter((r) => r.grounded !== null).length;
  const groundedPass = results.filter((r) => r.grounded === true).length;
  console.log(`\n=== summary (k=8) ===`);
  console.log(`recall@5: ${pass5}/${total} (${((pass5 / total) * 100).toFixed(0)}%)`);
  console.log(`recall@8: ${pass8}/${total} (${((pass8 / total) * 100).toFixed(0)}%)`);
  if (groundedTotal > 0) {
    console.log(`grounded@8: ${groundedPass}/${groundedTotal} (${((groundedPass / groundedTotal) * 100).toFixed(0)}%)  [answer terms present in top-8 = app context window]`);
  }
  for (const cat of [...new Set(results.map((r) => r.category))]) {
    const inCat = results.filter((r) => r.category === cat);
    const ok = inCat.filter((r) => r.ok5).length;
    console.log(`  ${cat.padEnd(10)} ${ok}/${inCat.length}`);
  }

  await client.end();
  if (pass8 < total) {
    console.log(`\nNote: ${total - pass8} question(s) did not surface an expected source in top-8 — inspect those queries (retrieval tuning or expected-source update).`);
    process.exit(0); // eval is a report, not a hard gate
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
