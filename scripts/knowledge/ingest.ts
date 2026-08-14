#!/usr/bin/env tsx
/**
 * Knowledge pipeline ingest — the persistent psychology knowledge layer.
 *
 *   npm run knowledge:ingest            # register + documents + chunks (no embed)
 *   npm run knowledge:ingest -- --embed # also embed chunks (needs model download ~25MB once)
 *
 * Stages (each resumable — safe to re-run; unchanged content is skipped):
 *   1. sources    — upsert one corpus_sources row per book in BOOKS (keyed by
 *                   name). Skips when the source PDF hash is unchanged.
 *   2. documents  — upsert one corpus_documents row per book with the full
 *                   extracted text + content hash. Skips when hash unchanged.
 *   3. r2         — upload original PDF + extracted text to R2 (knowledge/books/<id>/…)
 *                   when R2 creds are set; local cache is always written first.
 *   4. chunks     — read the per-book outline (scripts/knowledge/outlines/<id>.json,
 *                   produced by the reading agents) + the page-marked text cache,
 *                   chunk hierarchically, and upsert corpus_chunks keyed by
 *                   (document_id, chunk_hash) so re-runs are idempotent.
 *   5. embed      — (--embed) embed every unembedded chunk with the self-hosted
 *                   MiniLM model and update halfvec(384).
 *
 * Outputs a per-book status table. Any stage that fails for a book is reported
 * and the pipeline continues with the others — a check, not a test.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (from .env.local),
 *      optional R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME.
 */
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { BOOKS, bookMeta } from "../../src/lib/knowledge/manifest";
import { chunkBook } from "../../src/lib/knowledge/chunk";
import type { BookOutline } from "../../src/lib/knowledge/outline";

const OUTLINES_DIR = join(process.cwd(), "scripts/knowledge/outlines");
const CACHE_DIR = join(process.cwd(), "scripts/knowledge/cache");
mkdirSync(CACHE_DIR, { recursive: true });

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

const URL = loadEnv("NEXT_PUBLIC_SUPABASE_URL");
const KEY = loadEnv("SUPABASE_SERVICE_ROLE_KEY");
if (!URL || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (.env.local).");
  process.exit(1);
}
const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

// R2 client — only constructed when creds are present (degrade gracefully).
const R2_ACCOUNT = loadEnv("CLOUDFLARE_ACCOUNT_ID");
const R2_KEY = loadEnv("R2_ACCESS_KEY_ID");
const R2_SECRET = loadEnv("R2_SECRET_ACCESS_KEY");
const R2_BUCKET = loadEnv("R2_BUCKET_NAME") ?? "plms-videos";
const r2 = R2_ACCOUNT && R2_KEY && R2_SECRET
  ? new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_KEY, secretAccessKey: R2_SECRET },
    })
  : null;

const DO_EMBED = process.argv.includes("--embed");

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

function sha256Text(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

async function uploadR2(key: string, body: Buffer): Promise<boolean> {
  if (!r2) return false;
  try {
    await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body }));
    return true;
  } catch (e) {
    console.warn(`  r2 upload skipped (${key}): ${e instanceof Error ? e.message : "error"}`);
    return false;
  }
}

async function upsertSource(book: (typeof BOOKS)[number]) {
  const meta = bookMeta(book.id);
  const { data: existing } = await supabase
    .from("corpus_sources")
    .select("id, hash, title")
    .eq("name", book.id)
    .maybeSingle();

  if (existing && existing.hash === book.pdfHash) {
    return { sourceId: existing.id as string, changed: false };
  }

  const row = {
    name: book.id,
    url: book.pdfPath,
    licence: "authorized / licensed educational material",
    fetched_at: new Date().toISOString(),
    title: meta?.title ?? book.id,
    authors: meta?.authors ?? null,
    edition: meta?.edition ?? null,
    year: meta?.year && meta.year > 0 ? meta.year : null,
    publisher: meta?.publisher ?? null,
    book_type: book.bookType,
    local_path: book.pdfPath,
    page_count: book.pages,
    hash: book.pdfHash,
  };

  if (existing) {
    await supabase.from("corpus_sources").update(row).eq("id", existing.id);
    return { sourceId: existing.id as string, changed: true };
  }
  const { data: inserted, error } = await supabase
    .from("corpus_sources")
    .insert(row)
    .select("id")
    .single();
  if (error) throw new Error(`source insert ${book.id}: ${error.message}`);
  return { sourceId: inserted.id as string, changed: true };
}

async function upsertDocument(book: (typeof BOOKS)[number], sourceId: string, text: string) {
  const contentHash = sha256Text(text);
  const { data: existing } = await supabase
    .from("corpus_documents")
    .select("id, hash, status")
    .eq("source_id", sourceId)
    .maybeSingle();

  if (existing && existing.hash === contentHash) {
    return { documentId: existing.id as string, changed: false };
  }

  // Full text lives in R2 (raw_path) — per the "keep knowledge in R2" rule and
  // the corpus_docs_content_cap (2M chars). content holds a small preview so
  // the row is self-describing without duplicating the corpus into Postgres.
  const PREVIEW_CHARS = 100_000;
  const row = {
    source_id: sourceId,
    title: bookMeta(book.id)?.title ?? book.id,
    licence: "authorized / licensed educational material",
    hash: contentHash,
    raw_path: book.r2.text,
    content: text.slice(0, PREVIEW_CHARS),
    classification: {
      book_id: book.id,
      book_type: book.bookType,
      pages: book.pages,
      full_text_in: book.r2.text,
    },
    status: existing?.status ?? "normalised",
  };

  if (existing) {
    await supabase.from("corpus_documents").update(row).eq("id", existing.id);
    return { documentId: existing.id as string, changed: true };
  }
  const { data: inserted, error } = await supabase
    .from("corpus_documents")
    .insert(row)
    .select("id")
    .single();
  if (error) throw new Error(`document insert ${book.id}: ${error.message}`);
  return { documentId: inserted.id as string, changed: true };
}

async function ingestChunks(book: (typeof BOOKS)[number], documentId: string, cacheText: string) {
  const outlinePath = join(OUTLINES_DIR, `${book.id}.json`);
  if (!existsSync(outlinePath)) {
    console.warn(`  no outline ${book.id}.json — skipping chunks (run the reading agents first)`);
    return { chunks: 0, inserted: 0 };
  }
  const outline: BookOutline = JSON.parse(readFileSync(outlinePath, "utf8"));
  const chunks = chunkBook(book.id, cacheText, outline);

  // Upsert by (document_id, chunk_hash): unchanged chunks are skipped.
  const { data: existing } = await supabase
    .from("corpus_chunks")
    .select("chunk_hash")
    .eq("document_id", documentId);
  const existingHashes = new Set((existing ?? []).map((r) => r.chunk_hash as string));

  let inserted = 0;
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    const hash = sha256Text(c.text);
    if (existingHashes.has(hash)) continue;
    const { error } = await supabase.from("corpus_chunks").insert({
      document_id: documentId,
      chunk_text: c.text,
      style_pattern: "clinical",
      chapter: c.chapter,
      section: c.section,
      page_start: c.pageStart,
      page_end: c.pageEnd,
      chunk_index: i,
      chunk_hash: hash,
    });
    if (error) {
      console.warn(`  chunk ${book.id}[${i}] insert: ${error.message}`);
      continue;
    }
    inserted++;
  }
  return { chunks: chunks.length, inserted };
}

async function embedChunks(book: (typeof BOOKS)[number], documentId: string) {
  const { embedLocal } = await import("../../src/lib/knowledge/embed-local");
  const { data: rows, error } = await supabase
    .from("corpus_chunks")
    .select("id, chunk_text")
    .eq("document_id", documentId)
    .is("embedding", null)
    .limit(1000);
  if (error) throw new Error(`embed select ${book.id}: ${error.message}`);
  const unembedded = (rows ?? []) as Array<{ id: string; chunk_text: string }>;
  if (unembedded.length === 0) return 0;

  let done = 0;
  for (const r of unembedded) {
    try {
      const vec = await embedLocal(r.chunk_text);
      const { error: upErr } = await supabase
        .from("corpus_chunks")
        .update({ embedding: `[${vec.join(",")}]` })
        .eq("id", r.id);
      if (!upErr) done++;
    } catch (e) {
      console.warn(`  embed chunk ${book.id}:${r.id.slice(0, 8)}: ${e instanceof Error ? e.message : "error"}`);
      break; // model error — stop this book's embed, resume on next run
    }
  }
  return done;
}

async function processBook(book: (typeof BOOKS)[number]) {
  console.log(`\n▶ ${book.id} (${book.pages} pages)`);

  // PDF hash (resumability + change detection).
  if (!existsSync(book.pdfPath)) {
    console.warn(`  PDF missing: ${book.pdfPath}`);
    return { id: book.id, error: "pdf_missing" };
  }
  book.pdfHash = sha256(readFileSync(book.pdfPath));

  // Stage 1 + 2: sources + documents.
  const { sourceId, changed: sourceChanged } = await upsertSource(book);
  const cachePath = join(process.cwd(), book.textCache);
  const cacheText = existsSync(cachePath) ? readFileSync(cachePath, "utf8") : "";
  if (!cacheText) {
    console.warn(`  text cache missing: ${book.textCache}`);
    return { id: book.id, error: "text_cache_missing" };
  }
  const { documentId, changed: docChanged } = await upsertDocument(book, sourceId, cacheText);

  // Stage 3: R2 upload (always write local cache; R2 when creds present).
  const pdfBuf = readFileSync(book.pdfPath);
  writeFileSync(join(CACHE_DIR, `${book.id}.pdf`), pdfBuf);
  writeFileSync(join(CACHE_DIR, `${book.id}.txt`), cacheText);
  const r2Original = await uploadR2(book.r2.original, pdfBuf);
  const r2Text = await uploadR2(book.r2.text, Buffer.from(cacheText, "utf8"));
  console.log(`  r2: original=${r2Original ? "ok" : "local-only"} text=${r2Text ? "ok" : "local-only"}`);

  // Stage 4: chunks.
  const { chunks, inserted } = await ingestChunks(book, documentId, cacheText);

  // Stage 5: embed (--embed).
  let embedded = 0;
  if (DO_EMBED) {
    embedded = await embedChunks(book, documentId);
  }

  console.log(
    `  ok: source${sourceChanged ? " (updated)" : ""} doc${docChanged ? " (updated)" : ""} ` +
      `chunks=${chunks} inserted=${inserted}${DO_EMBED ? ` embedded=${embedded}` : ""}`,
  );
  return { id: book.id, chunks, inserted, embedded, error: null };
}

async function main() {
  console.log(`Knowledge ingest — ${BOOKS.length} books, embed=${DO_EMBED}`);
  const results = [];
  for (const book of BOOKS) {
    try {
      results.push(await processBook(book));
    } catch (e) {
      results.push({ id: book.id, error: e instanceof Error ? e.message : "error" });
      console.warn(`  FAILED ${book.id}: ${e instanceof Error ? e.message : e}`);
    }
  }
  console.log("\n=== summary ===");
  for (const r of results) {
    const err = (r as { error?: string }).error;
    if (err) console.log(`  ✗ ${r.id}: ${err}`);
    else console.log(`  ✓ ${r.id}: chunks=${(r as { chunks: number }).chunks} inserted=${(r as { inserted: number }).inserted}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
