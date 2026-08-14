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
  documentId?: string;
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
  /**
   * Expand each top hit with its adjacent same-document passages (within
   * ±adjacentPages of the hit's page range, same chapter). Management-heavy
   * sections spread a syndrome's description and its treatment across several
   * pages; this brings those pages together so the grounding window actually
   * contains the full answer. Deduped; expands the result set beyond `limit`.
   */
  expandContext?: boolean;
  /** how many pages on each side of a hit to pull into context */
  adjacentPages?: number;
}

const DEFAULT_LIMIT = 8;

function parseChunk(row: Record<string, unknown>): Omit<KnowledgeHit, "score" | "lane"> {
  return {
    id: String(row.id),
    documentId: row.document_id != null ? String(row.document_id) : undefined,
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

  // DB-side pg_trgm search across the WHOLE corpus (the old in-process lane
  // only scanned the first limit rows by table order — a real bug). The RPC
  // ranks by word_similarity(query, chunk_text), catching exact syndrome /
  // drug names that semantic embedding can miss.
  const { data, error } = await admin.rpc("search_corpus_keyword", {
    query_text: query,
    match_count: (opts.limit ?? DEFAULT_LIMIT) * 2,
    filter_source_name: opts.filterSource ?? null,
  });
  if (error) {
    console.warn(`knowledge keyword lane error: ${error.message}`);
    return [];
  }
  return ((data ?? []) as unknown as Array<Record<string, unknown>>).map((r) => ({
    ...parseChunk(r),
    score: Number(r.similarity_score ?? 0),
    lane: "keyword" as const,
  }));
}

/**
 * Expand each top hit with adjacent same-document passages so a multi-page
 * management section is retrieved as a coherent block. For each hit, fetch
 * chunks in the SAME document whose page range falls within ±adjacentPages of
 * the hit's page range (and the same chapter when both have one). Returns the
 * original hits (in order) plus the neighbors, deduped by chunk id.
 */
async function expandContext(
  admin: ReturnType<typeof createAdminClient>,
  hits: KnowledgeHit[],
  adjacentPages: number,
): Promise<KnowledgeHit[]> {
  if (hits.length === 0) return hits;
  const candidates = new Map<string, KnowledgeHit>();

  // Group hits by document so one query per document covers all its hits.
  const byDoc = new Map<string, KnowledgeHit[]>();
  for (const h of hits) {
    if (!h.documentId) continue;
    const list = byDoc.get(h.documentId) ?? [];
    list.push(h);
    byDoc.set(h.documentId, list);
  }

  for (const [docId, docHits] of byDoc) {
    // Page window covering all this document's hits (±adjacentPages).
    let lo = Infinity;
    let hi = -Infinity;
    for (const h of docHits) {
      if (h.pageStart != null) lo = Math.min(lo, h.pageStart);
      if (h.pageEnd != null) hi = Math.max(hi, h.pageEnd);
    }
    lo -= adjacentPages;
    hi += adjacentPages;

    const { data, error } = await admin
      .from("corpus_chunks")
      .select("id, document_id, chunk_text, chapter, section, page_start, page_end")
      .eq("document_id", docId)
      .gte("page_end", lo)
      .lte("page_start", hi)
      .limit(40);
    if (error || !data) continue;

    for (const row of (data ?? []) as unknown as Array<Record<string, unknown>>) {
      const id = String(row.id);
      if (candidates.has(id)) continue;
      // Preserve the hit's chapter/section (neighbors in the same chapter keep it).
      const chapter = String(row.chapter ?? "Unattributed");
      const section = String(row.section ?? "");
      // Keep lane/score from the original hit if this is one; else mark as context.
      const orig = docHits.find((h) => h.id === id);
      candidates.set(id, {
        id,
        documentId: docId,
        text: String(row.chunk_text ?? ""),
        sourceId: docHits[0].sourceId,
        sourceName: docHits[0].sourceName,
        sourceTitle: docHits[0].sourceTitle,
        chapter,
        section,
        pageStart: row.page_start != null ? Number(row.page_start) : null,
        pageEnd: row.page_end != null ? Number(row.page_end) : null,
        score: orig?.score ?? docHits[0].score * 0.9,
        lane: orig?.lane ?? docHits[0].lane,
      });
    }
  }

  // Order: original hits first (in their fused order), then neighbors.
  const seen = new Set<string>();
  const out: KnowledgeHit[] = [];
  for (const h of hits) {
    if (seen.has(h.id)) continue;
    seen.add(h.id);
    out.push(candidates.get(h.id) ?? h);
  }
  for (const h of candidates.values()) {
    if (seen.has(h.id)) continue;
    seen.add(h.id);
    out.push(h);
  }
  return out;
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
  const top = fused.slice(0, opts.limit ?? DEFAULT_LIMIT);

  if (opts.expandContext) {
    const admin = createAdminClient();
    const adjacent = opts.adjacentPages ?? 1;
    return expandContext(admin, top, adjacent);
  }
  return top;
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
