#!/usr/bin/env tsx
/**
 * Deterministic concept extraction — tags every corpus chunk with concepts
 * from the lexicon (drugs, disorders, clinical terms). $0, offline, resumable.
 *
 *   npm run knowledge:concepts
 *
 *  1. Upserts a knowledge_concepts row per lexicon entry (keyed name+type).
 *  2. Scans each corpus_chunk's text for concept search terms (case-insensitive,
 *     word-boundary match) and inserts knowledge_chunk_concepts links.
 *  3. Idempotent: existing links are skipped (unique chunk_id+concept_id).
 *
 * This is the knowledge-graph floor that always works. An optional V4-Flash
 * enrichment lane (scripts/knowledge/enrich-concepts.ts) can deepen extraction
 * when a no-train provider key is set.
 *
 * Env: SUPABASE_DB_PASSWORD (pg pooler, same as the embed script).
 */
import { Client } from "pg";
import { readFileSync } from "node:fs";
import { CONCEPT_LEXICON, conceptSearchTerms } from "../../src/lib/knowledge/lexicon";

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

const BATCH = 500;

/** Word-boundary match: the term appears as a standalone word/phrase. */
function matches(text: string, term: string): boolean {
  const lower = text.toLowerCase();
  if (term.length <= 2) return lower.includes(term);
  // Escape regex specials in the term.
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(lower);
}

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

  // 1. Upsert all concepts.
  console.log(`Upserting ${CONCEPT_LEXICON.length} concepts…`);
  const conceptIdByName = new Map<string, string>();
  for (const c of CONCEPT_LEXICON) {
    const { rows } = await client.query(
      `insert into public.knowledge_concepts (name, concept_type, aliases)
       values ($1, $2, $3::jsonb)
       on conflict (name, concept_type) do update set aliases = excluded.aliases
       returning id`,
      [c.name, c.type, JSON.stringify(c.aliases ?? [])],
    );
    const row = rows[0] as { id: string } | undefined;
    if (row) conceptIdByName.set(`${c.name}|${c.type}`, row.id);
  }
  console.log(`  concepts ready.`);

  // 2. Scan chunks in batches, tag with concepts.
  let totalChunks = 0;
  let totalLinks = 0;
  let offset = 0;
  for (;;) {
    const { rows } = await client.query(
      `select c.id, c.chunk_text, s.name as source
       from public.corpus_chunks c
       join public.corpus_documents d on d.id = c.document_id
       join public.corpus_sources s on s.id = d.source_id
       order by c.created_at asc
       limit ${BATCH} offset ${offset}`,
    );
    if (rows.length === 0) break;
    offset += rows.length;

    for (const r of rows as Array<{ id: string; chunk_text: string; source: string }>) {
      totalChunks++;
      const matched: Array<{ conceptId: string; name: string; type: string }> = [];
      for (const c of CONCEPT_LEXICON) {
        const terms = conceptSearchTerms(c);
        if (terms.some((t) => matches(r.chunk_text, t))) {
          const id = conceptIdByName.get(`${c.name}|${c.type}`);
          if (id) matched.push({ conceptId: id, name: c.name, type: c.type });
        }
      }
      if (matched.length === 0) continue;

      for (const m of matched) {
        const ins = await client.query(
          `insert into public.knowledge_chunk_concepts (chunk_id, concept_id)
           values ($1, $2)
           on conflict (chunk_id, concept_id) do nothing`,
          [r.id, m.conceptId],
        );
        totalLinks += (ins as unknown as { rowCount?: number }).rowCount ?? 0;
      }
    }
    if (rows.length < BATCH) break;
  }

  await client.end();
  console.log(`done — ${totalChunks} chunks scanned, ${totalLinks} concept links added.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
