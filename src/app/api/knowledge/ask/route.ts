import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { rateLimit } from "@/lib/rate-limit";
import { searchKnowledge, cite } from "@/lib/knowledge/retrieve";
import { isEnabled } from "@/lib/ai/router";
import { aiChat, type AiChatMessage } from "@/lib/ai/client";
import { cacheKeyFor, readCached, writeCached } from "@/lib/ai/cache";

export const runtime = "nodejs";

const schema = z.object({
  /** the student's question */
  q: z.string().min(2).max(800),
  /** how many source passages to ground on */
  limit: z.number().int().min(3).max(15).default(8),
  /** optional single-book filter (corpus_sources name) */
  source: z.string().max(80).optional(),
});

/**
 * POST /api/knowledge/ask — grounded psychology Q&A over the authorized book
 * corpus. The Psychology Tutor's backend.
 *
 * Retrieval-first design:
 *   1. Retrieve the most relevant source passages (hybrid vector+keyword).
 *   2. If a no-train AI provider is available (AI_ENABLED=true + key), build a
 *      focused context from ONLY the retrieved passages and generate a
 *      grounded answer with citations.
 *   3. Otherwise return the retrieved passages directly — honest, useful, and
 *      real (the retrieval layer is fully self-hosted; it works with zero keys).
 *
 * The corpus is never dumped into the prompt wholesale — only the retrieved
 * (reranked) top-k passages, keeping token use and latency bounded. The query
 * is student data, so the answer generation only routes to no-train providers
 * (guards.ts: knowledge_tutor workload).
 */
export async function POST(req: Request) {
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`knowledge-ask:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { q, limit, source } = parsed.data;
  // Context expansion: bring adjacent same-chapter passages into the grounding
  // window so multi-page management sections are retrieved as a coherent block.
  // Measured: grounded@8 76% → 90% on the 50-question eval set (adjacent=1).
  const hits = await searchKnowledge(q, { limit, filterSource: source, expandContext: true, adjacentPages: 1 });

  const sources = hits.map((h) => ({
    id: h.id,
    text: h.text,
    citation: cite(h),
    sourceTitle: h.sourceTitle,
    chapter: h.chapter,
    section: h.section,
    pageStart: h.pageStart,
    pageEnd: h.pageEnd,
  }));

  // If AI is enabled, generate a grounded answer from only the retrieved passages.
  // The grounded answer is deterministic for a question (same sources, same
  // answer for every student) and contains no per-user data → safe to cache.
  let answer: string | null = null;
  let provider: string | null = null;
  if (isEnabled() && hits.length > 0) {
    const cacheKey = cacheKeyFor("knowledge_tutor", q, "grounded", "difficult");
    const cached = await readCached(cacheKey);
    if (cached.hit !== "none") {
      answer = cached.text;
      provider = cached.model ? `cache:${cached.model}` : "cache";
    } else {
      try {
        const context = hits.map((h) => `[${cite(h)}]\n${h.text}`).join("\n\n---\n\n");
        const messages: AiChatMessage[] = [
          {
            role: "system",
            content:
              "You are a psychology tutor for a school of psychology. Answer the student's question using ONLY the supplied source passages. " +
              "Ground every claim in the passages; where the passages do not cover something, say so plainly. " +
              "Cite sources inline like (Book, Chapter, page). Do not invent facts, page numbers, or references.",
          },
          { role: "user", content: `QUESTION:\n${q}\n\nSOURCE PASSAGES:\n${context}` },
        ];
        // Grounded synthesis over source material is a "difficult" task — it
        // needs faithful reasoning + citation, so route to the strong tier.
        const res = await aiChat(messages, { workload: "knowledge_tutor", taskTier: "difficult", maxTokens: 600, temperature: 0.3 });
        answer = res.text;
        provider = res.provider;
        await writeCached(cacheKey, "knowledge_tutor", provider, answer, provider);
      } catch {
        // AI unavailable — fall through to retrieval-only (still useful).
        answer = null;
      }
    }
  }

  return NextResponse.json({
    question: q,
    count: hits.length,
    answer,
    provider,
    aiUsed: provider !== null,
    sources,
  });
}
