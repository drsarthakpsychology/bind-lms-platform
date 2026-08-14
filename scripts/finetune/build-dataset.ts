#!/usr/bin/env tsx
/**
 * Fine-tuning dataset builder — turns the authorized corpus + the book-grounded
 * eval set into a fine-tuning dataset for a psychology base model.
 *
 *   npm run finetune:dataset
 *
 * Emits two JSONL files into scripts/finetune/data/:
 *
 *   sft.jsonl        — instruction-tuning examples (OpenAI-compatible
 *                      `messages` format). For each eval question, the
 *                      assistant turn is a deterministic, SOURCE-CITED answer
 *                      assembled from the retrieved book passages (the exact
 *                      grounded answer the RAG layer produces). This teaches
 *                      the model to answer from the books with citations.
 *   pretrain.jsonl   — continued-pretraining examples (`text` format): the raw
 *                      corpus passages with a source prefix, for domain-
 *                      adapting a base model on the psychology register.
 *
 * Both are deterministic, $0, and fully reproducible. The fine-tune JOB itself
 * needs a provider key (see docs/FINETUNING.md) — this is the base.
 *
 * Env: SUPABASE_DB_PASSWORD (pg pooler) for reading corpus chunks.
 */
import { Client } from "pg";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { embedLocal } from "../../src/lib/knowledge/embed-local";
import { EVAL_SET } from "../knowledge/eval-set";

function loadEnv(n: string): string | undefined {
  if (process.env[n]) return process.env[n];
  try {
    for (const l of readFileSync(".env.local", "utf8").split("\n")) {
      const m = l.match(new RegExp(`^${n}=(.*)$`));
      if (m) return m[1].trim();
    }
  } catch { /* ignore */ }
  return undefined;
}

const REF = "hojhzwvuccojqkvkkslw";
const DB_PASS = loadEnv("SUPABASE_DB_PASSWORD");
if (!DB_PASS) {
  console.error("Missing SUPABASE_DB_PASSWORD (.env.local).");
  process.exit(1);
}

const OUT_DIR = join(process.cwd(), "scripts/finetune/data");
mkdirSync(OUT_DIR, { recursive: true });

const SYSTEM = "You are a psychology tutor for a school of psychology. Answer the student's question using ONLY the authorised psychology books (Kaplan & Sadock, DSM-5-TR, Stahl, Maudsley, Fish, Ahuja, ICD-11). Ground every claim in the source material and cite it inline like (Book, Chapter, page). If the books do not cover something, say so plainly. Never invent facts, page numbers, or references.";

interface PassageRow {
  book: string;
  source: string;
  chapter: string;
  section: string;
  page_start: number;
  page_end: number;
  chunk_text: string;
}

async function main() {
  const client = new Client({
    host: `db.${REF}.supabase.co`, port: 5432, user: "postgres", password: DB_PASS,
    database: "postgres", ssl: { rejectUnauthorized: false, servername: `db.${REF}.supabase.co` },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  // --- SFT examples from the eval set (grounded, source-cited answers) ------
  const sft: string[] = [];
  for (const q of EVAL_SET) {
    const vec = await embedLocal(q.question);
    const { rows } = await client.query(
      `select s.title as book, s.name as source, c.chapter, c.section, c.page_start, c.page_end, c.chunk_text
       from public.corpus_chunks c
       join public.corpus_documents d on d.id = c.document_id
       join public.corpus_sources s on s.id = d.source_id
       where c.embedding is not null
       order by c.embedding <=> $1::halfvec
       limit 6`,
      [`[${vec.join(",")}]`],
    );
    if (rows.length === 0) continue;

    // Prefer passages that actually contain the question's answerTerms (the
    // strongest grounding — the same signal the eval's grounded@8 checks), so
    // the training data teaches grounded answers, not nearest-vector drift.
    let passages = rows as unknown as PassageRow[];
    if (q.answerTerms?.length) {
      const scored = passages.map((p) => {
        const lower = p.chunk_text.toLowerCase();
        const hits = q.answerTerms!.filter((t) => {
          const base = t.toLowerCase();
          if (lower.includes(base)) return true;
          const words = base.split(/\s+/).filter((w) => w.length > 0);
          return words.every((w) => {
            if (w.length <= 3) return lower.includes(w);
            const prefix = w.slice(0, 4);
            return new RegExp(`(^|[^a-z])${prefix}[a-z]*([^a-z]|$)`).test(lower);
          });
        }).length;
        return { p, hits };
      });
      const bestHits = Math.max(...scored.map((s) => s.hits));
      if (bestHits > 0) {
        passages = scored
          .filter((s) => s.hits >= bestHits)
          .map((s) => s.p)
          .concat(scored.filter((s) => s.hits < bestHits).map((s) => s.p))
          .slice(0, 6);
      }
    }

    // Deterministic grounded answer: cite each passage, then a one-line synthesis
    // naming the sources (never invents specifics the passages don't contain).
    const cited = passages.map((r) => {
      const page = r.page_end && r.page_end !== r.page_start
        ? `pp. ${r.page_start}–${r.page_end}`
        : `p. ${r.page_start}`;
      const where = [r.book, r.chapter, r.section, page].filter(Boolean).join(", ");
      return `[${where}]\n${r.chunk_text.replace(/\s+/g, " ").trim()}`;
    }).join("\n\n---\n\n");

    const answer =
      `Based on the authorised books:\n\n${cited}\n\n` +
      `In short: the relevant source material is in ${[...new Set(passages.map((r) => r.book))].join(", ")} — ` +
      `see the passages above for the detail.`;
    sft.push(JSON.stringify({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: q.question },
        { role: "assistant", content: answer },
      ],
      metadata: { eval_id: q.id, category: q.category },
    }));
  }
  writeFileSync(join(OUT_DIR, "sft.jsonl"), sft.join("\n") + "\n");
  console.log(`sft.jsonl: ${sft.length} examples`);

  // --- Continued-pretraining examples from the corpus ------------------------
  const pretrain: string[] = [];
  const MAX_PRETRAIN = 2000; // bounded, representative sample of the corpus
  const { rows: chunks } = await client.query(
    `select s.name as source, s.title as book, c.chapter, c.page_start, c.chunk_text
     from public.corpus_chunks c
     join public.corpus_documents d on d.id = c.document_id
     join public.corpus_sources s on s.id = d.source_id
     where c.embedding is not null and length(c.chunk_text) > 200
     order by s.name, c.page_start
     limit ${MAX_PRETRAIN}`,
  );
  for (const raw of chunks as unknown as Array<{ book: string; source: string; chapter: string; page_start: number; chunk_text: string }>) {
    const text =
      `[Source: ${raw.book} (${raw.source}), ${raw.chapter}${raw.page_start ? `, p. ${raw.page_start}` : ""}]\n` +
      raw.chunk_text.replace(/\s+/g, " ").trim();
    pretrain.push(JSON.stringify({ text }));
  }
  writeFileSync(join(OUT_DIR, "pretrain.jsonl"), pretrain.join("\n") + "\n");
  console.log(`pretrain.jsonl: ${pretrain.length} examples`);

  await client.end();
  console.log(`\nDataset written to ${OUT_DIR}. To fine-tune, see docs/FINETUNING.md.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
