#!/usr/bin/env tsx
/**
 * AI-patient conversational quality evaluation (T171/T172/T123).
 *
 *   npm run sim:quality-eval
 *
 * Runs a set of representative conversations against the patient engine and
 * checks the behavioural contracts:
 *   - never_silent      every turn gets a non-empty, in-character reply
 *   - no_diagnostic_terms  the patient never uses diagnostic jargon
 *   - gate_holding      a gated fact (self-harm) stays closed until the
 *                       student clearly asks for it
 *
 * Two lanes:
 *   - FIXTURE (always)  the deterministic case-aware patient — this is the
 *                       behavioural oracle the tests pin. Expected PASS.
 *   - LIVE (when a no-train key is present)  the same conversations through
 *                       the real Director/Actor chain. This is the model
 *                       regression gate: re-run before accepting any
 *                       provider/model/prompt/behaviour change.
 *
 * With no key the live lane reports "skipped — needs a no-train key" (the
 * honest state, mirroring the knowledge eval's key-gated path).
 */
import { readFileSync } from "node:fs";
import { runFixtureTurn } from "../src/lib/sim/fixture-patient";
import { runPatientTurn } from "../src/lib/sim/engine";
import { initialState, type DepthCase, type PatientState } from "../src/lib/sim/types";
import { drawVariant, hashString } from "../src/lib/sim/variation";
import { parseGate } from "../src/lib/sim/gates";
import { CHARACTER_SKELETONS } from "../src/lib/sim/characters";
import { FIXTURE_CASE } from "../src/lib/sim/fixture-case";

const DIAGNOSTIC = /\b(schizophrenia|depression|bipolar|psychosis|ocd|ptsd|delusion|hallucination|diagnos)\b/i;
const SELF_HARM_FACT = "self_harm_plan";

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

/** Convert a CharacterSkeleton into a DepthCase (same shape as the tests). */
function toDepth(c: (typeof CHARACTER_SKELETONS)[number]): DepthCase {
  return {
    case_id: `char-${c.key}`, title: c.title, difficulty: c.difficulty,
    identity: c.identity, presentation: c.presentation,
    chief_complaint_in_own_words: c.chief_complaint_in_own_words,
    opening_idiom: c.opening_idiom, history: c.history,
    cognitive_model: { core_belief: "", intermediate_beliefs: [], coping: [] },
    disclosure_rules: c.disclosure_rules.map((r) => ({ fact: r.fact, gate: r.gate as never })) as DepthCase["disclosure_rules"],
    resistance: c.resistance, affect_rules: c.affect_rules,
    red_flags: c.red_flags as DepthCase["red_flags"],
    context_pack: { family_in_room: false, stigma: [], cost_concerns: true, legal_relevance: [] },
    style_refs: [], rubric_targets: [], few_shot: c.few_shot,
    fixture_lines: c.fixture_lines, variation: c.variation,
    traps: c.traps as DepthCase["traps"], moves: {},
  };
}

function factsFor(c: DepthCase) {
  return (c.disclosure_rules ?? []).map((r) => ({
    fact_id: r.fact,
    gate: parseGate(r.gate),
    sensitive: true,
  }));
}

interface Scenario {
  id: string;
  case_: DepthCase;
  turns: string[]; // student turns
}

const scenarios: Scenario[] = [
  { id: "fixture-ravi", case_: FIXTURE_CASE, turns: ["Hello.", "That sounds heavy. What's the heaviness about?", "Have you ever thought about hurting yourself?"] },
];

for (const c of CHARACTER_SKELETONS) {
  scenarios.push({ id: `char-${c.key}`, case_: toDepth(c), turns: ["Hello.", "What brings you here today?"] });
}

interface ContractResult {
  neverSilent: boolean;
  noDiagnostic: boolean;
  gateHeld: boolean;
}

async function runLane(c: DepthCase, turns: string[], useLive: boolean): Promise<{ perTurn: ContractResult[]; selfHarmRevealedAt: number | null }> {
  const facts = factsFor(c);
  const seed = drawVariant(c.variation ?? {}, c.case_id, hashString(c.case_id) ^ 7);
  let state: PatientState = initialState(c.case_id, seed);
  const recent: Array<{ role: "student" | "patient"; content: string }> = [];
  const perTurn: ContractResult[] = [];
  let selfHarmRevealedAt: number | null = null;

  for (let i = 0; i < turns.length; i++) {
    const studentTurn = turns[i];
    if (useLive) {
      const r = await runPatientTurn(c, state, studentTurn, recent, facts);
      state = r.state;
      recent.push({ role: "student", content: studentTurn }, { role: "patient", content: r.reply });
      const selfHarmTurn = /hurt yourself|harm yourself|suicid|kill yourself/i.test(studentTurn);
      perTurn.push({
        neverSilent: r.reply.trim().length > 0,
        noDiagnostic: !DIAGNOSTIC.test(r.reply),
        gateHeld: !selfHarmTurn || !state.disclosed.includes(SELF_HARM_FACT),
      });
      if (state.disclosed.includes(SELF_HARM_FACT) && selfHarmRevealedAt === null) selfHarmRevealedAt = i;
    } else {
      const fx = runFixtureTurn(c, state, studentTurn, facts, recent);
      state = fx.state;
      recent.push({ role: "student", content: studentTurn }, { role: "patient", content: fx.reply });
      const selfHarmTurn = /hurt yourself|harm yourself|suicid|kill yourself/i.test(studentTurn);
      perTurn.push({
        neverSilent: fx.reply.trim().length > 0,
        noDiagnostic: !DIAGNOSTIC.test(fx.reply),
        gateHeld: !selfHarmTurn || !state.disclosed.includes(SELF_HARM_FACT),
      });
      if (state.disclosed.includes(SELF_HARM_FACT) && selfHarmRevealedAt === null) selfHarmRevealedAt = i;
    }
  }
  return { perTurn, selfHarmRevealedAt };
}

async function main() {
  const liveKey = loadEnv("GROQ_API_KEY") || loadEnv("CEREBRAS_API_KEY");
  // Live lane is opt-in: aiChat is server-only, so it only works inside a
  // server runtime (Next route), not a plain tsx script. Set SIM_EVAL_LIVE=1
  // only where the runtime allows it; the fixture lane always runs.
  const useLive = process.env.SIM_EVAL_LIVE === "1" && Boolean(liveKey);

  console.log("AI-patient quality eval —", useLive ? "fixture + LIVE lanes" : "fixture lane only (no no-train key → live skipped)");
  console.log("");
  console.log("scenario                     turns  never-silent  no-jargon  gate-held");
  let total = 0, passed = 0;
  for (const s of scenarios) {
    const fx = await runLane(s.case_, s.turns, false);
    const fxOk = fx.perTurn.every((t) => t.neverSilent && t.noDiagnostic) && fx.selfHarmRevealedAt !== 0;
    total++;
    if (fxOk) passed++;
    console.log(
      `${s.id.padEnd(26)} ${String(s.turns.length).padEnd(6)} ${fx.perTurn.every((t) => t.neverSilent) ? "ok" : "FAIL"}         ${fx.perTurn.every((t) => t.noDiagnostic) ? "ok" : "FAIL"}        ${fxOk ? "ok" : "FAIL"}`,
    );
    if (useLive) {
      try {
        const live = await runLane(s.case_, s.turns, true);
        const liveOk = live.perTurn.every((t) => t.neverSilent && t.noDiagnostic) && live.selfHarmRevealedAt !== 0;
        console.log(
          `${"  └ live".padEnd(26)} ${String(s.turns.length).padEnd(6)} ${live.perTurn.every((t) => t.neverSilent) ? "ok" : "FAIL"}         ${live.perTurn.every((t) => t.noDiagnostic) ? "ok" : "FAIL"}        ${liveOk ? "ok" : "FAIL"}`,
        );
      } catch (e) {
        console.log(`${"  └ live".padEnd(26)} skipped — server-only runtime (${(e as Error).message.slice(0, 40)})`);
      }
    }
  }
  console.log("");
  console.log(`Fixture baseline: ${passed}/${total} scenarios pass (the deterministic oracle).`);
  if (useLive) console.log("Live lane: re-run this before accepting any provider/model/prompt/behaviour change.");
  else console.log("Live lane skipped — set GROQ_API_KEY or CEREBRAS_API_KEY to activate the model regression gate.");
  process.exit(passed === total ? 0 : 1);
}

void main();
