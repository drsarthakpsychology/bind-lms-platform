#!/usr/bin/env tsx
/**
 * Live check: concept-filtered retrieval works end to end. For a few
 * (query, concept) pairs, embed the query, call match_corpus_chunks with the
 * concept filter, and confirm every hit is actually tagged with that concept.
 */
import { Client } from "pg";
import { readFileSync } from "node:fs";
import { embedLocal } from "../../src/lib/knowledge/embed-local";

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

const CASES: Array<{ q: string; concept: string }> = [
  { q: "clozapine side effects and monitoring", concept: "Clozapine" },
  { q: "lithium therapeutic range and toxicity", concept: "Lithium" },
  { q: "symptoms and treatment of schizophrenia", concept: "Schizophrenia" },
];

async function main() {
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

  for (const { q, concept } of CASES) {
    const vec = await embedLocal(q);
    const { rows } = await client.query(
      `select s.name as source, c.chapter, c.page_start,
              left(c.chunk_text, 110) as excerpt
       from match_corpus_chunks($1::halfvec, 5, null, $2) mc
       join public.corpus_chunks c on c.id = mc.id
       join public.corpus_documents d on d.id = c.document_id
       join public.corpus_sources s on s.id = d.source_id`,
      [`[${vec.join(",")}]`, concept],
    );
    // Verify every hit is actually tagged with the concept.
    const tagCheck = await client.query(
      `select count(*)::int as n from match_corpus_chunks($1::halfvec, 5, null, $2) mc
       where not exists (
         select 1 from knowledge_chunk_concepts kcc
         join knowledge_concepts kc on kc.id = kcc.concept_id
         where kcc.chunk_id = mc.id and kc.name = $2
       )`,
      [`[${vec.join(",")}]`, concept],
    );
    console.log(`\nQ: "${q}" filtered to concept "${concept}"`);
    for (const r of rows as Array<{ source: string; chapter: string; page_start: number; excerpt: string }>) {
      console.log(`  [${r.source}] ${r.chapter} · p${r.page_start} · ${r.excerpt.replace(/\s+/g, " ").trim()}`);
    }
    const tagRow = tagCheck.rows[0] as { n: number };
    console.log(`  untagged hits: ${tagRow.n} (must be 0)`);
  }
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
