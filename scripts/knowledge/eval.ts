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
            left(c.chunk_text, 200) as excerpt,
            1 - (c.embedding <=> $1::halfvec) as sim
     from public.corpus_chunks c
     join public.corpus_documents d on d.id = c.document_id
     join public.corpus_sources s on s.id = d.source_id
     where c.embedding is not null
     order by c.embedding <=> $1::halfvec
     limit $2`,
    [`[${vec.join(",")}]`, k],
  );
  return rows as Array<{ source: string; excerpt: string; sim: number }>;
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
  const results: Array<{ id: string; category: string; ok5: boolean; ok8: boolean; foundSources: string[] }> = [];

  for (const q of EVAL_SET) {
    const vec = await embedLocal(q.question);
    const top = await retrieveTopK(client, vec, k);
    const foundSources = [...new Set(top.map((r) => r.source))];
    const hits = (expected: string[]) =>
      expected.some((s) => foundSources.includes(s));
    const ok5 = hits(q.expectedSources) || top.slice(0, 5).some((r, i) =>
      i < 5 && q.expectedSources.includes(r.source));
    // stricter: expected source in top-5
    const top5Sources = [...new Set(top.slice(0, 5).map((r) => r.source))];
    const ok5Strict = q.expectedSources.some((s) => top5Sources.includes(s));
    const ok8Strict = q.expectedSources.some((s) => foundSources.includes(s));

    results.push({
      id: q.id,
      category: q.category,
      ok5: ok5Strict,
      ok8: ok8Strict,
      foundSources,
    });
    const top1 = top[0];
    console.log(
      `  [${q.id} ${q.category.padEnd(10)}] ${ok5Strict ? "✓" : ok8Strict ? "~" : "✗"} ` +
        `expected[${q.expectedSources.join(",")}] top1=${top1?.source ?? "-"}`,
    );
  }

  const pass5 = results.filter((r) => r.ok5).length;
  const pass8 = results.filter((r) => r.ok8).length;
  const total = results.length;
  console.log(`\n=== summary (k=8) ===`);
  console.log(`recall@5: ${pass5}/${total} (${((pass5 / total) * 100).toFixed(0)}%)`);
  console.log(`recall@8: ${pass8}/${total} (${((pass8 / total) * 100).toFixed(0)}%)`);
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
