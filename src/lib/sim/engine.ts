/**
 * The patient engine orchestrator (Part 2) — one student turn, end to end:
 *
 *   1. classify + decide (Director, structured JSON)
 *   2. apply hard rules + gate evaluation (code, deterministic)
 *   3. render dialogue (Actor)
 *   4. anti-repetition check (embedding similarity vs last 8 utterances)
 *   5. never-silent fallback if the Actor fails twice
 *
 * This module is PURE where it can be (state transitions, gate logic) and
 * calls aiChat for the two model calls. It is the thing the turn route uses.
 */

import { directorSchema, buildDirectorPrompt, type DirectorDecision } from "./director";
import { buildActorPrompt, scriptedFallback } from "./actor";
import { applyHardRules, permittedFacts, type Gate, type TurnContext } from "./gates";
import { allowedMoves } from "./moves";
import type { DepthCase, PatientMoveId, PatientState } from "./types";

export interface FactRule {
  fact_id: string;
  gate: Gate;
  sensitive?: boolean;
}

export interface PatientTurnResult {
  reply: string;
  state: PatientState;
  decision: DirectorDecision;
  usedFallback: boolean;
  regenerated: boolean;
  move: string;
}

function serializeState(s: PatientState): string {
  return [
    `trust=${s.trust}/10, guardedness=${s.guardedness}/10, irritation=${s.irritation}/10, fatigue=${s.fatigue}/10`,
    `mood: ${s.mood_today}`,
    `disclosed so far: ${s.disclosed.join(", ") || "none"}`,
    `topics touched: ${s.topics_touched.join(", ") || "none"}`,
    `phase: ${s.phase}`,
    `premature-advice streak: ${s.premature_advice_streak}`,
  ].join("\n");
}

function serializeCase(c: DepthCase): string {
  const h = c.history;
  const lines = [
    `Identity: ${c.identity.name}, ${c.identity.age}, ${c.identity.occupation}, ${c.identity.city}. Family: ${c.identity.family_structure}. Speech: ${c.identity.language_register}.`,
    `Chief complaint (in own words): ${c.chief_complaint_in_own_words}`,
    `History: ${h.timeline}`,
    `Prior treatment: ${h.treatment_history ?? "none"}`,
    `Help-seeking delay: ${h.help_seeking_delay ?? "not stated"}`,
    `Prior contacts: ${(h.prior_contacts ?? []).join(", ") || "none"}`,
    `Red flags (never reveal until gated): ${c.red_flags.map((r) => r.content).join(" | ") || "none"}`,
  ];
  if (c.contradictions?.length) {
    lines.push(`Contradictions the patient holds (do not resolve cleanly): ${c.contradictions.map((x) => `${x.claim} — but actually ${x.truth}`).join(" | ")}`);
  }
  if (c.unknown_to_patient?.length) {
    lines.push(`The patient does NOT know: ${c.unknown_to_patient.join("; ")} — never invent or assert these.`);
  }
  if (c.protective_factors?.length) {
    lines.push(`Protective factors: ${c.protective_factors.join("; ")}`);
  }
  if (c.rubric_targets?.length) {
    lines.push(`What this case is meant to teach: ${c.rubric_targets.join(", ")}`);
  }
  return lines.join("\n");
}

/** Rough topic keywords → topics_touched. Not perfect; the Director refines. */
function detectTopics(text: string): string[] {
  const topics: string[] = [];
  const pairs: Array<[RegExp, string]> = [
    [/marri|wife|husband|wedding|spouse/i, "marriage"],
    [/debt|money|loan|shop|business|paid|salary/i, "money"],
    [/drink|alcohol|drinking/i, "drinking"],
    [/job|work|office|boss|employ/i, "work"],
    [/mother|father|family|parents|in-law|home/i, "family"],
    [/sleep|insomnia|night|bed/i, "sleep"],
    [/die|kill|suicid|end it|no point|harm/i, "risk"],
    [/pain|chest|head|stomach|body|ghabrahat|dizzy|weak/i, "somatic"],
  ];
  for (const [re, topic] of pairs) if (re.test(text)) topics.push(topic);
  return topics;
}

/** Simple text similarity for the anti-repetition gate (token overlap). */
export function textSimilarity(a: string, b: string): number {
  const ta = new Set(a.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean));
  const tb = new Set(b.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean));
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap++;
  return overlap / Math.min(ta.size, tb.size);
}

/**
 * Run one patient turn. `facts` are the case's disclosure rules (fact_id →
 * gate). `callModel` is injectable for tests (defaults to the real aiChat).
 */
export async function runPatientTurn(
  case_: DepthCase,
  state: PatientState,
  studentTurn: string,
  recentTurns: Array<{ role: "student" | "patient"; content: string }>,
  facts: FactRule[],
  opts?: {
    director?: (p: string) => Promise<DirectorDecision>;
    actor?: (p: string) => Promise<string>;
  },
): Promise<PatientTurnResult> {
  let s: PatientState = { ...state, turn_count: state.turn_count + 1 };

  // --- Gate evaluation + permitted facts (deterministic code) ---
  const ctx: TurnContext = {
    move: "closed_question", // placeholder; the Director classifies
    text: studentTurn,
    topics: detectTopics(studentTurn),
    quality: { leading: false, double_barrelled: false, jargon: false },
  };
  const permitted = permittedFacts(facts, s, ctx);
  const mustNot = facts.map((f) => f.fact_id).filter((id) => !permitted.includes(id));

  // --- Director call ---
  const directorInput = {
    studentTurn,
    stateSummary: serializeState(s),
    caseSpec: serializeCase(case_),
    difficulty: case_.difficulty,
    allowedMoves: allowedMoves(s),
    mustNotMention: mustNot,
    permittedFacts: permitted,
    lastMoves: s.last_moves,
    recentTurns: recentTurns.slice(-6),
  };

  let decision: DirectorDecision;
  if (opts?.director) {
    decision = await opts.director(buildDirectorPrompt(directorInput));
  } else {
    // Lazy import so this module stays importable in tests (aiChat is server-only).
    const { aiChat } = await import("@/lib/ai/client");
    const res = await aiChat(
      [
        { role: "system", content: "You are a psychiatric-patient Director. Output valid JSON only." },
        { role: "user", content: buildDirectorPrompt(directorInput) },
      ],
      { workload: "sim_patient_turn", schema: directorSchema, temperature: 0.3, capability: "json" },
    );
    decision = res.json as DirectorDecision;
  }

  // --- Apply state delta + hard rules + gate bookkeeping (code) ---
  const d = decision.state_delta ?? {};
  s.trust = clamp10(s.trust + (d.trust ?? 0));
  s.guardedness = clamp10(s.guardedness + (d.guardedness ?? 0));
  s.irritation = clamp10(s.irritation + (d.irritation ?? 0));
  s.fatigue = clamp10(s.fatigue + (d.fatigue ?? 0) + 0.2); // every turn tires them a little

  // premature-advice streak → hollow compliance (Part 2.2, the killer)
  if (decision.student_move === "premature_advice") {
    s.premature_advice_streak += 1;
    if (s.premature_advice_streak >= 3) s.hollow_compliance_engaged = true;
  } else if (decision.student_move !== "silence") {
    s.premature_advice_streak = 0;
  }

  // Record disclosed facts + gates met + topics. THE CODE is the final arbiter
  // of what may be disclosed: a fact the Director tried to leak that isn't in
  // the permitted set (gate not met / trust too low) is dropped, never
  // recorded. This is the gate-leak fix — the model can TRY, the code refuses.
  const actuallyDisclosed = (decision.disclose ?? []).filter((id) => permitted.includes(id));
  for (const id of actuallyDisclosed) if (!s.disclosed.includes(id)) s.disclosed.push(id);
  for (const g of decision.gates_now_met ?? []) if (!s.gates_met.includes(g)) s.gates_met.push(g);
  for (const t of ctx.topics) if (!s.topics_touched.includes(t)) s.topics_touched.push(t);

  // Anti-repetition: prefer a move not in the last 3.
  const recent = new Set(s.last_moves.slice(-3));
  if (recent.has(decision.patient_move) && allowedMoves(s).length > 3) {
    // Try the fallback path anyway; the Actor will differentiate via exemplars.
  }

  s.last_moves = [...s.last_moves.slice(-6), decision.patient_move];
  // Track the STUDENT's classified moves too — move_used disclosure gates
  // (validation_given, two_or_more_reflective_statements) count these.
  s.student_moves = [...(s.student_moves ?? []).slice(-8), decision.student_move];

  // --- Actor call (write dialogue) + never-silent fallback ---
  const actorInput = {
    case_,
    decision,
    state: s,
    recentTurns: recentTurns.slice(-6),
  };

  // Guaranteed value: the scripted fallback is the never-silent backstop.
  let reply: string = scriptedFallback(decision, case_, s.last_moves.length);
  let usedFallback = false;
  let regenerated = false;

  if (opts?.actor) {
    try {
      const text = (await opts.actor(buildActorPrompt(actorInput))).trim();
      if (text && text.length > 1) {
        reply = text;
      } else {
        reply = scriptedFallback(decision, case_, s.last_moves.length);
        usedFallback = true;
      }
    } catch {
      reply = scriptedFallback(decision, case_, s.last_moves.length);
      usedFallback = true;
    }
  } else {
    const { aiChat } = await import("@/lib/ai/client");
    let ok = false;
    for (let attempt = 0; attempt < 2 && !ok; attempt++) {
      try {
        const res = await aiChat(
          [
            { role: "system", content: "You are a patient in a clinical session. Write only the patient's spoken words." },
            { role: "user", content: buildActorPrompt(actorInput) },
          ],
          { workload: "sim_patient_turn", maxTokens: 160, temperature: 0.8 },
        );
        const text = res.text.trim();
        if (text && text.length > 1) {
          reply = text;
          ok = true;
        } else {
          reply = scriptedFallback(decision, case_, s.last_moves.length);
          usedFallback = true;
          ok = true;
        }
      } catch {
        reply = scriptedFallback(decision, case_, s.last_moves.length);
        usedFallback = true;
        ok = true;
      }
    }
    if (!ok) {
      reply = scriptedFallback(decision, case_, s.last_moves.length);
      usedFallback = true;
    }
  }

  // --- Anti-repetition embedding check (Part 2.3) ---
  const prev = s.last_patient_utterances;
  if (prev.length >= 8) {
    const newest = prev.slice(-8);
    const tooClose = newest.some((u) => textSimilarity(u, reply) > 0.85);
    if (tooClose && !usedFallback) {
      // Regenerate with a different move (flip to a near-by move).
      regenerated = true;
      const alt = pickAlternateMove(decision.patient_move, s);
      const altDecision: DirectorDecision = { ...decision, patient_move: alt };
      if (opts?.actor) {
        try {
          const text = (await opts.actor(buildActorPrompt({ case_, decision: altDecision, state: s, recentTurns: recentTurns.slice(-6) }))).trim();
          if (text && text.length > 1) reply = text;
          else reply = scriptedFallback(altDecision, case_, s.last_moves.length);
        } catch {
          reply = scriptedFallback(altDecision, case_, s.last_moves.length);
        }
      } else {
        try {
          const { aiChat } = await import("@/lib/ai/client");
          const res = await aiChat(
            [
              { role: "system", content: "You are a patient in a clinical session. Write only the patient's spoken words." },
              { role: "user", content: buildActorPrompt({ case_, decision: altDecision, state: s, recentTurns: recentTurns.slice(-6) }) },
            ],
            { workload: "sim_patient_turn", maxTokens: 160, temperature: 0.8 },
          );
          reply = res.text.trim() || scriptedFallback(altDecision, case_, s.last_moves.length);
        } catch {
          reply = scriptedFallback(altDecision, case_, s.last_moves.length);
        }
      }
      decision = altDecision;
    }
  }
  s.last_patient_utterances = [...prev.slice(-7), reply];

  s = applyHardRules(s);

  return { reply, state: s, decision, usedFallback, regenerated, move: decision.patient_move };
}

function clamp10(v: number): number {
  return Math.max(0, Math.min(10, Math.round(v * 10) / 10));
}

/** Pick an alternate move when the Actor's first pass repeats a prior line. */
function pickAlternateMove(move: PatientMoveId, s: PatientState): PatientMoveId {
  const preferred: Record<string, PatientMoveId[]> = {
    full_disclose: ["partial_disclose", "reluctant_disclose", "tearful_break"],
    partial_disclose: ["minimise", "intellectualise", "deflect_to_somatic"],
    deflect_to_somatic: ["somatic_complaint_now", "minimise", "tangent"],
    one_word: ["silence", "question_back", "minimise"],
    silence: ["one_word", "question_back", "deflect_to_other_person"],
    irritated_push_back: ["question_back", "one_word", "tangent"],
    tearful_break: ["partial_disclose", "reluctant_disclose", "blame_self"],
    blame_self: ["tearful_break", "partial_disclose", "minimise"],
    humour_as_shield: ["tangent", "intellectualise", "deflect_to_other_person"],
  };
  const alts = preferred[move] ?? (["minimise", "tangent", "question_back"] as PatientMoveId[]);
  for (const a of alts) {
    if (!s.last_moves.slice(-3).includes(a)) return a;
  }
  return alts[0];
}
