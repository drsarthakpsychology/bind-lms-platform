import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  /** concept type filter: drug | disorder | term */
  type: z.enum(["drug", "disorder", "term"]).optional(),
  /** prefix search on the concept name */
  q: z.string().max(80).optional(),
  /** max concepts to return */
  limit: z.number().int().min(1).max(200).default(100),
});

/**
 * GET /api/knowledge/concepts — browse the knowledge-graph concept index.
 * Returns concepts (with link counts) so AI features can offer a topic picker
 * (e.g. adaptive learning weak-concept remediation, quiz-by-topic).
 *
 * Each concept carries how many corpus chunks reference it — a signal for
 * "how well-covered / how learnable" a topic is.
 */
export async function GET(req: Request) {
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`knowledge-concepts:${user.id}`, 120);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const url = new URL(req.url);
  const parsed = schema.safeParse({
    type: url.searchParams.get("type") ?? undefined,
    q: url.searchParams.get("q") ?? undefined,
    limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 100,
  });
  if (!parsed.success) return NextResponse.json({ error: "invalid query" }, { status: 400 });

  const { type, q, limit } = parsed.data;
  const admin = createAdminClient();

  let query = admin
    .from("knowledge_concepts")
    .select("id, name, concept_type, aliases, corpus_chunk_links:knowledge_chunk_concepts(count)")
    .order("name")
    .limit(limit);

  if (type) query = query.eq("concept_type", type);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    count: (data ?? []).length,
    concepts: (data ?? []).map((c: Record<string, unknown>) => ({
      id: String(c.id),
      name: String(c.name),
      type: String(c.concept_type),
      aliases: Array.isArray(c.aliases) ? c.aliases : [],
      chunkCount: Number((c.corpus_chunk_links as Record<string, unknown>)?.count ?? 0),
    })),
  });
}
