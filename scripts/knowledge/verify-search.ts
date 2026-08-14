#!/usr/bin/env tsx
/**
 * End-to-end retrieval quality check on the live corpus.
 *
 *   npm run knowledge:verify
 *
 * Embeds a handful of representative psychology questions with the same
 * self-hosted MiniLM model the corpus used, calls match_corpus_chunks, and
 * prints the top hits with their source traceability. A human-readable smoke
 * test that retrieval returns RELEVANT, SOURCE-TRACEABLE passages — not a
 * pass/fail assertion (relevance is judged by reading the excerpts).
 */
import { Client } from "pg";
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

const REF = "hojhzwvuccojqkvkkslw";
const DB_PASS = loadEnv("SUPABASE_DB_PASSWORD");
if (!DB_PASS) {
  console.error("Missing SUPABASE_DB_PASSWORD (.env.local).");
  process.exit(1);
}

const QUESTIONS: string[] = [
  "how do SSRIs treat depression?",
  "what is the difference between schizophrenia and bipolar disorder?",
  "extrapyramidal side effects of antipsychotics",
  "alcohol withdrawal syndrome management",
  "obsessive compulsive disorder diagnostic criteria",
];

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

  for (const q of QUESTIONS) {
    const vec = await embedLocal(q);
    const { rows } = await client.query(
      `select left(c.chunk_text, 180) as excerpt,
              s.name as source, s.title as title,
              c.chapter, c.section, c.page_start, c.page_end,
              round((1 - (c.embedding <=> $1::halfvec))::numeric, 3) as sim
       from public.corpus_chunks c
       join public.corpus_documents d on d.id = c.document_id
       join public.corpus_sources s on s.id = d.source_id
       where c.embedding is not null
       order by c.embedding <=> $1::halfvec
       limit 3`,
      [`[${vec.join(",")}]`],
    );
    console.log(`\nQ: ${q}`);
    for (const r of rows as Array<{
      excerpt: string; source: string; title: string; chapter: string; section: string;
      page_start: number; page_end: number; sim: string;
    }>) {
      const sec = r.section ? ` / ${r.section}` : "";
      const pp = r.page_end !== r.page_start ? `-${r.page_end}` : "";
      console.log(`  [${r.sim}] ${r.source} · ${r.chapter}${sec} · p${r.page_start}${pp}`);
      console.log(`      ${r.excerpt.replace(/\s+/g, " ").trim()}`);
    }
  }
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
