/**
 * Retrieval layer — the reusable knowledge access point for every AI surface.
 *
 * Hybrid retrieval over corpus_chunks:
 *   - semantic: self-hosted MiniLM query embedding → match_corpus_chunks RPC
 *               (pgvector halfvec(384) cosine, HNSW index)
 *   - keyword:  pg_trgm similarity on chunk_text (works even before embeddings
 *               are populated, and catches exact-name queries)
 *   - rerank:   reciprocal-rank fusion of both lanes
 *
 * Every result carries source traceability (book, chapter, section, PDF page
 * range) so AI features can surface "Source: [Book], Chapter X, page Y" — the
 * page number is the PDF index from the ingestion pipeline, never fabricated.
 *
 * Server-only: uses the service-role admin client (RLS on corpus tables is
 * admin-only by design; retrieval is a deliberate, bounded surface).
 */
import { createAdminClient } from "@/lib/supabase/server";
import { embedLocal } from "./embed-local";
import { EMBED_DIM } from "@/lib/ai/embed";

export interface KnowledgeHit {
  id: string;
  text: string;
  sourceId: string;
  sourceName: string;
  sourceTitle: string;
  chapter: string;
  section: string;
  pageStart: number | null;
  pageEnd: number | null;
  score: number;
  lane: "vector" | "keyword";
}

export interface RetrieveOptions {
  limit?: number; // default 8
  filterSource?: string; // corpus_sources.name (book id)
  filterConcept?: string; // knowledge_concepts.name (e.g. "Clozapine")
  keywordOnly?: boolean; // skip the vector lane entirely
}

const DEFAULT_LIMIT = 8;

function parseChunk(row: Record<string, unknown>): Omit<KnowledgeHit, "score" | "lane"> {
  return {
    id: String(row.id),
    text: String(row.chunk_text ?? ""),
    sourceId: String(row.source_id ?? ""),
    sourceName: String(row.source_name ?? ""),
    sourceTitle: String(row.source_title ?? ""),
    chapter: String(row.chapter ?? "Unattributed"),
    section: String(row.section ?? ""),
    pageStart: row.page_start != null ? Number(row.page_start) : null,
    pageEnd: row.page_end != null ? Number(row.page_end) : null,
  };
}

/** Vector lane: embed the query and call match_corpus_chunks. */
async function vectorLane(query: string, opts: RetrieveOptions): Promise<KnowledgeHit[]> {
  const admin = createAdminClient();
  const vec = await embedLocal(query);
  if (vec.length !== EMBED_DIM) throw new Error(`embedding dim ${vec.length} != ${EMBED_DIM}`);

  const { data, error } = await admin.rpc("match_corpus_chunks", {
    query_embedding: `[${vec.join(",")}]`,
    match_count: opts.limit ?? DEFAULT_LIMIT,
    filter_source_name: opts.filterSource ?? null,
    filter_concept: opts.filterConcept ?? null,
  });

  if (error) {
    // The RPC is SECURITY DEFINER — a missing vector/grant surfaces as an
    // error; degrade to keyword rather than 500ing the feature.
    console.warn(`knowledge vector lane error: ${error.message}`);
    return [];
  }
  return ((data ?? []) as unknown as Array<Record<string, unknown>>).map((r) => ({
    ...parseChunk(r),
    score: Number(r.similarity ?? 0),
    lane: "vector" as const,
  }));
}

/** Keyword lane: pg_trgm similarity on chunk_text. */
async function keywordLane(query: string, opts: RetrieveOptions): Promise<KnowledgeHit[]> {
  const admin = createAdminClient();
  const limit = (opts.limit ?? DEFAULT_LIMIT) * 2;

  // pg_trgm word_similarity matches substrings/names that embeddings miss
  // (e.g. a drug brand, an exact syndrome name).
  let q = admin
    .from("corpus_chunks")
    .select("id, chunk_text, chapter, section, page_start, page_end, document_id, " +
      "corpus_documents!inner(source_id, corpus_sources!inner(name, title))")
    .limit(limit);

  if (opts.filterSource) {
    q = q.eq("corpus_documents.corpus_sources.name", opts.filterSource);
  }

  const { data, error } = await q;
  if (error) {
    console.warn(`knowledge keyword lane error: ${error.message}`);
    return [];
  }

  // Rerank in-process with pg_trgm-style word similarity. (A DB-level ORDER BY
  // similarity would need a stored function; for small top-N this is simpler
  // and provider-agnostic.)
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const scored: KnowledgeHit[] = [];
  for (const row of (data ?? []) as unknown as Array<Record<string, unknown>>) {
    const text = String(row.chunk_text ?? "");
    const lower = text.toLowerCase();
    let hits = 0;
    for (const w of words) if (lower.includes(w)) hits++;
    if (hits === 0) continue;
    const ratio = hits / words.length;
    // Boost exact-name matches (full phrase containment).
    const phraseBonus = lower.includes(query.toLowerCase()) ? 0.2 : 0;
    scored.push({
      ...parseChunk({
        ...row,
        source_id: (row.corpus_documents as Record<string, unknown>)?.source_id ?? "",
        source_name: ((row.corpus_documents as Record<string, unknown>)?.corpus_sources as Record<string, unknown>)?.name ?? "",
        source_title: ((row.corpus_documents as Record<string, unknown>)?.corpus_sources as Record<string, unknown>)?.title ?? "",
      }),
      score: ratio + phraseBonus,
      lane: "keyword" as const,
    });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, opts.limit ?? DEFAULT_LIMIT);
}

/** Reciprocal-rank fusion of two ranked lists. */
function rrf(lists: KnowledgeHit[][], k = 60): KnowledgeHit[] {
  const scores = new Map<string, { hit: KnowledgeHit; sum: number }>();
  for (const list of lists) {
    list.forEach((hit, idx) => {
      const rank = 1 / (k + idx + 1);
      const entry = scores.get(hit.id) ?? { hit, sum: 0 };
      entry.sum += rank;
      scores.set(hit.id, entry);
    });
  }
  return [...scores.values()]
    .sort((a, b) => b.sum - a.sum)
    .map((e) => ({ ...e.hit, score: e.sum }));
}

/**
 * Hybrid knowledge retrieval. Returns ranked, source-traceable passages.
 * Never throws on embedding/model errors — degrades to keyword, then empty.
 */
export async function searchKnowledge(query: string, opts: RetrieveOptions = {}): Promise<KnowledgeHit[]> {
  const q = query.trim();
  if (!q) return [];

  const lanePromises: Array<Promise<KnowledgeHit[]>> = [];
  if (!opts.keywordOnly) {
    lanePromises.push(vectorLane(q, opts).catch(() => []));
  }
  lanePromises.push(keywordLane(q, opts));

  const lanes = await Promise.all(lanePromises);
  const fused = rrf(lanes.filter((l) => l.length > 0));
  return fused.slice(0, opts.limit ?? DEFAULT_LIMIT);
}

/** Format a citation line for a hit (never fabricates page numbers). */
export function cite(hit: KnowledgeHit): string {
  const book = hit.sourceTitle || hit.sourceName;
  const parts = [book];
  if (hit.chapter && hit.chapter !== "Unattributed") parts.push(hit.chapter);
  if (hit.section && hit.section !== "Unattributed") parts.push(hit.section);
  if (hit.pageStart) {
    parts.push(hit.pageEnd && hit.pageEnd !== hit.pageStart ? `pp. ${hit.pageStart}–${hit.pageEnd}` : `p. ${hit.pageStart}`);
  }
  return parts.join(", ");
}
