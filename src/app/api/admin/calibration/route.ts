import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { weightedKappa } from "@/lib/practice/rubric";

export const runtime = "nodejs";

const schema = z.object({
  /** The dimension key being calibrated. */
  key: z.string().min(1),
  /** A new paired score: the AI's rubric value and Dr. Sarthak's blind score. */
  ai: z.number(),
  human: z.number(),
});

/**
 * POST /api/admin/calibration — record one paired calibration score for a
 * dimension and recompute its agreement (weighted kappa over all pairs) +
 * n_scored. When the gate passes (>= 10 pairs, kappa >= 0.6) the dimension
 * flips to validated and its number becomes visible to students.
 *
 * Admin-only (RLS + requireAdmin). Idempotent-ish: each call adds one pair.
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", detail: parsed.error.flatten() }, { status: 400 });
  }
  const { key, ai, human } = parsed.data;

  const adminClient = createAdminClient();

  // Load the dimension's existing pairs (this endpoint keeps it simple: we
  // store the running pair list in a calibration_pairs table).
  const { data: pairs } = await adminClient
    .from("calibration_pairs")
    .select("ai, human")
    .eq("dimension_key", key);

  const existing = (pairs ?? []).map((p) => ({ ai: Number(p.ai), human: Number(p.human) }));
  existing.push({ ai, human });

  const kappa = existing.length >= 2 ? weightedKappa(existing.map((p) => p.ai), existing.map((p) => p.human)) : null;
  const n = existing.length;
  const status = n >= 10 && (kappa ?? 0) >= 0.6 ? "validated" : "provisional";

  // Record the pair.
  const { error: pairErr } = await adminClient.from("calibration_pairs").insert({
    dimension_key: key,
    ai,
    human,
  });
  if (pairErr) return NextResponse.json({ error: "Failed to record pair." }, { status: 500 });

  // Update the dimension.
  const { error: dimErr } = await adminClient
    .from("rubric_dimensions")
    .update({ agreement: kappa, n_scored: n, status })
    .eq("key", key);
  if (dimErr) return NextResponse.json({ error: "Failed to update dimension." }, { status: 500 });

  return NextResponse.json({ ok: true, n, kappa, status });
}
