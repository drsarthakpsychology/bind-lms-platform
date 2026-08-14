import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { rateLimit } from "@/lib/rate-limit";
import { searchKnowledge, cite, type KnowledgeHit } from "@/lib/knowledge/retrieve";

export const runtime = "nodejs";

const schema = z.object({
  /** the student/faculty question — "explain the difference between…" */
  q: z.string().min(2).max(500),
  /** max results */
  limit: z.number().int().min(1).max(20).default(8),
  /** filter to one book by its corpus_sources name (e.g. "kaplan_sadock") */
  source: z.string().max(80).optional(),
  /** filter to one concept (knowledge_concepts.name, e.g. "Clozapine") */
  concept: z.string().max(80).optional(),
  /** true = keyword only (skip embedding/model — fast lane) */
  keywordOnly: z.boolean().optional(),
});

/**
 * GET /api/knowledge/search?q=… — hybrid retrieval over the authorized book
 * corpus. Returns source-traceable passages (book/chapter/section/page) that
 * any AI feature can feed into its context. This is the reusable knowledge
 * layer's read API — the Psychology Tutor, psychopharmacology answers, quiz
 * generation and patient-simulation context all consume it.
 *
 * Server-side: uses the service-role admin client (corpus tables are
 * admin-only by RLS); the result is a bounded, vetted surface.
 */
export async function GET(req: Request) {
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`knowledge:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const url = new URL(req.url);
  const rawQ = url.searchParams.get("q") ?? "";
  const parsed = schema.safeParse({
    q: rawQ,
    limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 8,
    source: url.searchParams.get("source") ?? undefined,
    concept: url.searchParams.get("concept") ?? undefined,
    keywordOnly: url.searchParams.get("keywordOnly") === "true",
  });
  if (!parsed.success) return NextResponse.json({ error: "invalid query" }, { status: 400 });

  const { q, limit, source, concept, keywordOnly } = parsed.data;
  const hits = await searchKnowledge(q, { limit, filterSource: source, filterConcept: concept, keywordOnly });

  return NextResponse.json({
    query: q,
    count: hits.length,
    source: source ?? null,
    concept: concept ?? null,
    keywordOnly: keywordOnly ?? false,
    hits: hits.map((h: KnowledgeHit) => ({
      id: h.id,
      text: h.text,
      chapter: h.chapter,
      section: h.section,
      pageStart: h.pageStart,
      pageEnd: h.pageEnd,
      sourceId: h.sourceId,
      sourceName: h.sourceName,
      sourceTitle: h.sourceTitle,
      score: Number(h.score.toFixed(4)),
      lane: h.lane,
      citation: cite(h),
    })),
  });
}
