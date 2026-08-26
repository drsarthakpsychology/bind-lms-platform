#!/usr/bin/env tsx
/**
 * calibration-auto — the three automatic calibration signals (Part 2).
 *
 *   npm run calibration:auto -- --dry-run
 *
 * Runs over a sample of recent scored transcripts and computes, per rubric
 * dimension, WITHOUT any manual scoring session:
 *
 *   1. MULTI-MODEL CONSENSUS — score each transcript with two independently
 *      configured models; close agreement = high confidence.
 *   2. SELF-CONSISTENCY VARIANCE — score 3x at non-zero temperature; high
 *      variance means the rubric itself is ambiguous, not a borderline student.
 *
 * (3. PASSIVE CAPTURE is already live: faculty edits/overrides in the review
 * queue write scoring_corrections, which feed the few-shot scoring loop.)
 *
 * Results are written to rubric_dimensions (inter_model_agreement, variance,
 * last_auto_at). The debrief renderer already hides a provisional dimension's
 * number from students until it validates — this script is what graduates it.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, plus the provider
 * keys in .env.local (GROQ_API_KEY etc.). No keys → dry-run only, honest skip.
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { PROVIDERS, type Provider } from "../src/lib/ai/router";
import { buildScoringPrompt, type ScoringInput } from "../src/lib/ai/prompts/scoring";

const DRY_RUN = process.argv.includes("--dry-run");

function loadEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  if (existsSync(".env.local")) {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) out[m[1]] = m[2].trim();
    }
  }
  return { ...process.env, ...out } as Record<string, string>;
}

/* --- per-dimension numeric mapping ------------------------------------ */
const DIMS = [
  "open_closed_ratio",
  "leading_questions",
  "double_barrelled",
  "reflective_statements",
  "premature_reassurance",
  "domain_coverage",
  "risk_timing",
  "disclosure_unlock_rate",
] as const;

const RISK_MAP: Record<string, number> = { early: 0, appropriate: 1, late: 2, absent: 3 };

function dimValue(result: Record<string, unknown>, key: string): number {
  if (key === "risk_timing") {
    return RISK_MAP[String(result.risk_timing)] ?? 1;
  }
  const v = Number(result[key]);
  return Number.isFinite(v) ? v : 0;
}

interface SessionRow {
  id: string;
  sim_cases:
    | Array<{ title: string | null; difficulty: string | null; rubric_targets: string[] | null }>
    | null;
}

/* --- a single OpenAI-compatible scoring call -------------------------- */
async function scoreWithProvider(
  provider: Provider,
  input: ScoringInput,
  env: Record<string, string>,
  temperature: number,
): Promise<Record<string, unknown> | null> {
  const key = env[provider.apiKeyEnv];
  if (!key) return null;
  const model = provider.models.smart ?? provider.models.fast;
  const url = `${provider.baseUrl.replace(/\/$/, "")}/chat/completions`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a rigorous clinical-skill scorer. Output valid JSON only." },
          { role: "user", content: buildScoringPrompt(input) },
        ],
      }),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = j.choices?.[0]?.message?.content;
    if (!content) return null;
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/* --- aggregation helpers ---------------------------------------------- */
function stddev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const variance = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length;
  return Math.sqrt(variance);
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const admin = createClient(url, key, { auth: { persistSession: false } });

  // The two JSON-capable providers with keys, in priority order.
  const providers = PROVIDERS.filter(
    (p) => p.supports.includes("json") && env[p.apiKeyEnv] && !p.trainsOnData,
  ).slice(0, 2);
  if (providers.length < 2) {
    console.log("Needs two configured no-train JSON providers for multi-model consensus.");
    console.log("Providers with keys:", PROVIDERS.filter((p) => env[p.apiKeyEnv]).map((p) => p.id).join(", ") || "none");
  }

  // Sample recent scored sessions + their turns.
  const { data: scores } = await admin
    .from("sim_scores")
    .select("session_id, rubric")
    .order("created_at", { ascending: false })
    .limit(5);
  if (!scores?.length) {
    console.log("No scored sessions to calibrate on yet.");
    process.exit(0);
  }

  const sessionIds = scores.map((s) => s.session_id);
  const { data: turns } = await admin
    .from("sim_turns")
    .select("session_id, role, content")
    .in("session_id", sessionIds)
    .order("created_at", { ascending: true });
  const { data: sessions } = await admin
    .from("sim_sessions")
    .select("id, case_id, sim_cases(title, difficulty, rubric_targets)")
    .in("id", sessionIds);

  const turnsBySession = new Map<string, ScoringInput["transcript"]>();
  for (const t of turns ?? []) {
    const list = turnsBySession.get(t.session_id) ?? [];
    list.push({ role: t.role === "student" ? "student" : "patient", content: String(t.content) });
    turnsBySession.set(t.session_id, list);
  }
  const caseBySession = new Map<string, SessionRow>((sessions ?? []).map((s) => [s.id, s as SessionRow]));

  // Per dimension, accumulate the 3 self-consistency runs + the 2 model runs.
  const varianceAcc = new Map<string, number[]>();
  const agreementAcc = new Map<string, number[]>();

  for (const score of scores) {
    const transcript = turnsBySession.get(score.session_id) ?? [];
    if (transcript.length < 2) continue;
    const session = caseBySession.get(score.session_id);
    const c = Array.isArray(session?.sim_cases) ? session.sim_cases[0] : session?.sim_cases ?? null;
    const input: ScoringInput = {
      caseTitle: String(c?.title ?? "case"),
      caseDifficulty: String(c?.difficulty ?? "cooperative"),
      rubricTargets: Array.isArray(c?.rubric_targets) ? c.rubric_targets.map(String) : [],
      transcript,
    };

    // Self-consistency: 3 runs at temperature 0.7 on the first provider.
    const runs: Array<Record<string, unknown> | null> = [];
    if (providers[0]) {
      for (let i = 0; i < 3; i++) runs.push(await scoreWithProvider(providers[0], input, env, 0.7));
    }
    for (const dim of DIMS) {
      const vals = runs.filter(Boolean).map((r) => dimValue(r!, dim));
      if (vals.length >= 2) varianceAcc.set(dim, [...(varianceAcc.get(dim) ?? []), stddev(vals)]);
    }

    // Multi-model consensus: the two providers at temperature 0.2.
    const [a, b] = await Promise.all(
      providers.slice(0, 2).map((p) => scoreWithProvider(p, input, env, 0.2)),
    );
    if (a && b) {
      for (const dim of DIMS) {
        const va = dimValue(a, dim);
        const vb = dimValue(b, dim);
        const range = dim === "risk_timing" ? 3 : 5;
        const agreement = Math.max(0, 1 - Math.abs(va - vb) / range);
        agreementAcc.set(dim, [...(agreementAcc.get(dim) ?? []), agreement]);
      }
    }
  }

  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

  console.log(DRY_RUN ? "DRY RUN — no DB writes" : "WRITING rubric_dimensions");
  for (const dim of DIMS) {
    const variance = mean(varianceAcc.get(dim) ?? []);
    const agreement = mean(agreementAcc.get(dim) ?? []);
    console.log(`  ${dim.padEnd(24)} variance=${variance?.toFixed(3) ?? "—"}  interModelAgreement=${agreement?.toFixed(3) ?? "—"}`);
    if (!DRY_RUN) {
      await admin
        .from("rubric_dimensions")
        .update({
          variance,
          inter_model_agreement: agreement,
          last_auto_at: new Date().toISOString(),
        })
        .eq("key", dim);
    }
  }
  console.log(DRY_RUN ? "\n(dry-run — no writes)" : "\nDone. Automatic signals written.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
