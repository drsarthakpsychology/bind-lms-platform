import { NextResponse } from "next/server";
import { z } from "zod";
import { denyUnlessGate, requireStudentApi, type ApiGate } from "@/lib/auth/api-guard";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  /** which practice tool completed. */
  tool: z.enum(["mse", "osce", "judgment", "rounds", "formulation"]),
  /** competency keys to credit, e.g. ["clinical_interviewing","risk_assessment"]. */
  keys: z.array(z.string().min(1)).min(1).max(5),
  /** score 0..1 or 0..5 — written to evidence. */
  score: z.number().min(0).max(5),
  /** free-text detail for the passport evidence line. */
  detail: z.string().max(300).default(""),
});

/** The page + feature flag behind each crediting tool. */
const TOOL_GATE: Record<z.infer<typeof schema>["tool"], ApiGate> = {
  mse: { path: "/practice/mse", flag: "mse" },
  osce: { path: "/practice/osce", flag: "osce" },
  judgment: { path: "/practice/judgment", flag: "judgment" },
  rounds: { path: "/practice/rounds", flag: "rounds" },
  formulation: { path: "/practice/formulation", flag: "formulation" },
};

/**
 * POST /api/practice/competency — a practice tool (MSE/OSCE/Judgment/Rounds/
 * Formulation) credits competencies on completion, feeding the Skills
 * Passport the same way sim debriefs do (source = the tool name).
 * Owner-scoped server-side; RLS on competency_events also enforces it.
 */
export async function POST(req: Request) {
  const access = await requireStudentApi({ path: "/practice" });
  if (!access.ok) return access.response;
  const profile = access.profile;
  const user = profile;

  const allowed = await rateLimit(`competency:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });
  const denied = await denyUnlessGate(profile, TOOL_GATE[parsed.data.tool]);
  if (denied) return denied;

  const admin = createAdminClient();
  const { data: comps } = await admin
    .from("competencies")
    .select("id, key")
    .in("key", parsed.data.keys);

  if (!comps || comps.length === 0) {
    return NextResponse.json({ error: "no matching competencies" }, { status: 404 });
  }

  const events = comps.map((c) => ({
    user_id: user.id,
    competency_id: c.id,
    source: parsed.data.tool as string,
    source_ref: null,
    evidence: {
      tool: parsed.data.tool,
      score: parsed.data.score,
      detail: parsed.data.detail,
      date: new Date().toISOString(),
    },
  }));

  const { error } = await admin.from("competency_events").insert(events);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, credited: events.length });
}
