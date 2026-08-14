#!/usr/bin/env tsx
/**
 * Embed-only pass for the knowledge corpus. Skips chunking entirely — reads
 * every corpus_chunk with a NULL embedding and fills halfvec(384) using the
 * self-hosted MiniLM model (src/lib/knowledge/embed-local.ts).
 *
 *   npm run knowledge:embed
 *
 * Resumable: only unembedded chunks are selected, so re-runs continue where
 * the last run stopped. Writes go through the `pg` pooler connection with a
 * single parameterized multi-row UPDATE per batch — the embedding is
 * CPU-bound, the write is not network-bound (no per-chunk HTTP).
 *
 * Optional --book <id> restricts to one book (useful for testing).
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

const BOOK_IDX = process.argv.indexOf("--book");
const BOOK_ONLY = BOOK_IDX !== -1 ? process.argv[BOOK_IDX + 1] : null;
const BATCH = 200;

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

  const bookFilter = BOOK_ONLY
    ? `join public.corpus_documents d on d.id = c.document_id
       join public.corpus_sources s on s.id = d.source_id
       and s.name = $1`
    : "";
  const params = BOOK_ONLY ? [BOOK_ONLY] : [];

  let total = 0;
  let rounds = 0;

  for (;;) {
    const { rows } = await client.query(
      `select c.id, c.chunk_text
       from public.corpus_chunks c
       ${bookFilter}
       where c.embedding is null
       order by c.created_at asc
       limit ${BATCH}`,
      params,
    );
    if (rows.length === 0) break;

    const updates: Array<{ id: string; vec: number[] }> = [];
    for (const r of rows as Array<{ id: string; chunk_text: string }>) {
      try {
        const vec = await embedLocal(r.chunk_text);
        updates.push({ id: r.id, vec });
      } catch (e) {
        console.warn(`  embed ${r.id.slice(0, 8)}: ${e instanceof Error ? e.message : "error"}`);
        console.log(`stopped after ${total} embedded (${rounds} rounds) — re-run to resume.`);
        await client.end();
        process.exit(0);
      }
    }

    // One parameterized UPDATE ... FROM unnest for the whole batch. halfvec
    // parses its text literal form "[0.1,0.2,...]" — pass each vector as a
    // string and cast the array to halfvec[].
    await client.query(
      `update public.corpus_chunks c
       set embedding = u.vec::halfvec
       from unnest($1::uuid[], $2::text[]) as u(id, vec)
       where c.id = u.id`,
      [
        updates.map((u) => u.id),
        updates.map((u) => `[${u.vec.join(",")}]`),
      ],
    );

    total += updates.length;
    rounds++;
    if (rounds % 10 === 0) console.log(`  ${total} embedded (${rounds} rounds)`);
    if (rows.length < BATCH) break;
  }

  await client.end();
  console.log(`done — ${total} chunks embedded${BOOK_ONLY ? ` (${BOOK_ONLY})` : ""}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
