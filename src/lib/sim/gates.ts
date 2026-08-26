/**
 * Gates-as-code (Part 2.4). The v1 engine encoded disclosure conditions as
 * English sentences in the system prompt ("don't reveal the debt until asked
 * openly about home"). Models don't reliably follow conditional logic written
 * in prose — they leak everything or nothing.
 *
 * This module evaluates gates DETERMINISTICALLY. The model is never asked
 * whether a gate is met; it is only told which facts it may use this turn.
 */

import type { PatientState, StudentMove } from "./types";

export type Gate =
  | { kind: "move_used"; move: StudentMove; times: number }
  | { kind: "topic_opened"; topic: string }
  | { kind: "trust_at_least"; value: number }
  | { kind: "turn_after"; n: number }
  | { kind: "explicit_phrase"; patterns: RegExp[] }
  | { kind: "all_of"; gates: Gate[] }
  | { kind: "any_of"; gates: Gate[] };

export interface TurnContext {
  move: StudentMove;
  text: string;
  topics: string[]; // topics this turn touched (rough keyword pass)
  quality: { leading: boolean; double_barrelled: boolean; jargon: boolean };
}

/** Clear self-harm / suicide phrasing — the only way a self-harm fact may open. */
const SELF_HARM_PATTERNS = [
  /self[- ]?harm/i,
  /(hurt|harm|kill)(ing)? (yourself|your self)/i,
  /suicid/i,
  /end (your life|it all)/i,
  /want to (die|end it)/i,
  /think(ing)? about dying/i,
  /not (want|wish) to be (here|alive)/i,
];

/**
 * Translate an authored disclosure gate (a plain-English tag in the case
 * data) into a deterministic `Gate`. The case files store gates as strings
 * like "asked_about_self_harm_clearly"; the engines need Gate objects.
 *
 * Unknown/empty tags default to a conservative trust bar — better to hold
 * disclosure a turn too long than to leak a fact the student didn't earn.
 */
export function parseGate(gate: string | undefined): Gate {
  switch (gate) {
    case "asked_about_self_harm_clearly":
      return { kind: "explicit_phrase", patterns: SELF_HARM_PATTERNS };
    case "validation_given":
      return { kind: "move_used", move: "validation", times: 1 };
    case "two_or_more_reflective_statements":
      return { kind: "move_used", move: "reflection", times: 2 };
    default:
      return { kind: "trust_at_least", value: 4 };
  }
}

/** Evaluate a gate against the current state + this turn. Pure. */
function evaluateGate(gate: Gate, state: PatientState, ctx: TurnContext): boolean {
  switch (gate.kind) {
    case "move_used": {
      // Count how many times this move appears in the student's move history.
      // Student moves are tracked separately from patient moves (which occupy
      // `last_moves` for anti-repetition). `student_moves` may be absent on
      // old persisted sessions — default to [].
      const hits = (state.student_moves ?? state.last_moves ?? []).filter((m) => m === gate.move).length;
      return hits >= gate.times;
    }
    case "topic_opened":
      return state.topics_touched.includes(gate.topic) || ctx.topics.includes(gate.topic);
    case "trust_at_least":
      return state.trust >= gate.value;
    case "turn_after":
      return state.turn_count >= gate.n;
    case "explicit_phrase":
      return gate.patterns.some((p) => p.test(ctx.text));
    case "all_of":
      return gate.gates.every((g) => evaluateGate(g, state, ctx));
    case "any_of":
      return gate.gates.some((g) => evaluateGate(g, state, ctx));
  }
}

/**
 * Deterministically decide which fact ids may be disclosed this turn, given
 * the case's disclosure rules (each maps fact id → gate) and the current
 * state. A fact becomes "permitted" once its gate is met AND trust is high
 * enough for sensitive facts (the code-enforced rule from Part 2.2).
 */
export function permittedFacts(
  rules: Array<{ fact_id: string; gate: Gate; sensitive?: boolean }>,
  state: PatientState,
  ctx: TurnContext,
): string[] {
  const out: string[] = [];
  for (const r of rules) {
    const alreadyGiven = state.disclosed.includes(r.fact_id);
    if (alreadyGiven) continue;
    const gateMet = evaluateGate(r.gate, state, ctx);
    // Code-enforced: trust < 3 → sensitive facts can never leak, regardless of
    // what any model is told.
    if (r.sensitive && state.trust < 3) continue;
    if (gateMet) out.push(r.fact_id);
  }
  return out;
}

/** State rules the CODE enforces (Part 2.2), applied after each turn. */
export function applyHardRules(state: PatientState): PatientState {
  const next = { ...state };
  // trust < 3 → nothing sensitive may be out (enforced in permittedFacts too).
  // irritation > 7 → narrow the available moves (Director consults this).
  // fatigue > 7 → answers shorten (Actor consults length_hint).
  next.irritation = clamp(next.irritation);
  next.trust = clamp(next.trust);
  next.guardedness = clamp(next.guardedness);
  next.fatigue = clamp(next.fatigue);
  return next;
}

function clamp(v: number): number {
  return Math.max(0, Math.min(10, Math.round(v)));
}
