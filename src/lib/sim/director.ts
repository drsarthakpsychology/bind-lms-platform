/**
 * The DIRECTOR (Part 2.1, Call 1) — a fast, cheap model that receives the
 * student's turn + the current PatientState + the case spec and returns a
 * structured DECISION. It never writes dialogue. The Actor does that.
 *
 * Separating "what the patient does" from "what the patient says" fixes:
 *   - gate leaks (gates are code, not prose — evaluated in gates.ts),
 *   - repetition (the Director can't pick the same move twice without reason),
 *   - dead turns (the Director always returns a move, even for nonsense input).
 */

import { z } from "zod";

export const directorSchema = z.object({
  student_move: z.enum([
    "closed_question", "open_question", "reflection", "validation",
    "premature_advice", "interruption", "risk_probe", "silence",
    "confrontation", "rapport_bid", "off_topic",
  ]),
  quality: z.object({
    leading: z.boolean(),
    double_barrelled: z.boolean(),
    jargon: z.boolean(),
  }),
  gates_now_met: z.array(z.string()),
  state_delta: z.object({
    trust: z.number().min(-3).max(3),
    guardedness: z.number().min(-3).max(3),
    irritation: z.number().min(-3).max(3),
    fatigue: z.number().min(0).max(3),
  }),
  patient_move: z.enum([
    "full_disclose", "partial_disclose", "reluctant_disclose",
    "deflect_to_somatic", "deflect_to_other_person", "minimise",
    "intellectualise", "tangent", "question_back", "test_the_clinician",
    "silence", "one_word", "contradict_earlier", "blame_family", "blame_self",
    "hollow_compliance", "irritated_push_back", "tearful_break",
    "humour_as_shield", "somatic_complaint_now", "ask_about_cost",
    "ask_about_confidentiality", "mention_faith_healer",
    "defer_to_accompanying_family",
  ]),
  disclose: z.array(z.string()),
  affect: z.enum([
    "flat", "flat_with_effort", "sad", "anxious", "irritated",
    "brittle_cheerful", "numb", "agitated", "resigned",
  ]),
  length_hint: z.enum(["one_word", "short", "medium", "long"]),
  must_not_mention: z.array(z.string()),
});
export type DirectorDecision = z.infer<typeof directorSchema>;

export interface DirectorInput {
  studentTurn: string;
  stateSummary: string; // the PatientState, serialised
  caseSpec: string; // the clinical facts + variation
  difficulty?: string; // cooperative | guarded | resistant | crisis | clear
  allowedMoves: string[];
  mustNotMention: string[];
  permittedFacts: string[];
  lastMoves: string[]; // anti-repetition
  recentTurns: Array<{ role: "student" | "patient"; content: string }>; // conversation history
}

/** Difficulty drives BEHAVIOUR, not a number (T122). */
const DIFFICULTY_NOTES: Record<string, string> = {
  cooperative: "Open and willing to talk — discloses when trust allows.",
  guarded: "Wary and watchful. Answers in fragments, deflects, and holds back until the student genuinely earns trust.",
  resistant: "Resistant. Volunteers little and resists direct questioning — disclosure is hard-won.",
  crisis: "In acute distress. The session is about safety — short, blunt answers, high tension.",
  clear: "Open and willing to talk — discloses when trust allows.",
};

export function buildDirectorPrompt(input: DirectorInput): string {
  return `You are the DIRECTOR of a simulated psychiatric patient. You do NOT write dialogue. You receive the student's turn and the patient's current state, and you decide what the patient DOES this turn. Return ONLY a JSON object.

# THE PATIENT'S CURRENT STATE
${input.stateSummary}

# THE CASE (clinical facts — never invent new ones)
${input.caseSpec}

# THE PATIENT'S DISPOSITION
${DIFFICULTY_NOTES[input.difficulty ?? "cooperative"] ?? "Open and willing to talk — discloses when trust allows."}

# THE RECENT CONVERSATION (last turns, oldest first)
${input.recentTurns?.length ? input.recentTurns.map((t) => `${t.role.toUpperCase()}: ${t.content}`).join("\n") : "(opening — nothing yet)"}

# THIS TURN
Student said: "${input.studentTurn}"

# YOUR RULES
- Classify the student's move honestly. A "closed question" is one answerable yes/no. An "open question" invites elaboration. "premature_advice" is the student rushing to reassure or fix before exploring. "interruption" is the student talking over.
- Set gates_now_met based ONLY on what this turn demonstrates (an open question about a topic, an explicit risk phrase, trust now high enough). Do NOT declare a gate met on weak evidence.
- Choose the patient_move from: ${input.allowedMoves.join(", ")}. Prefer a move NOT used in the last 3 turns (recent moves: ${input.lastMoves.join(", ") || "none"}).
- disclose: list fact ids the patient is willing to say THIS turn. If none, return []. Never list a fact in must_not_mention: ${input.mustNotMention.join(", ") || "none"}.
- permittedFacts the student has earned: ${input.permittedFacts.join(", ") || "none"}. You may disclose from these, but the patient may still be reluctant — pick moves that feel right for the state.
- affect: the patient's emotional delivery this turn, consistent with state (irritation > 5 → irritated; fatigue > 6 → flat; trust high + moving topic → sad/tearful).
- length_hint: one_word / short / medium / long based on fatigue and irritation.
- state_delta: how this turn changes trust, guardedness, irritation, fatigue (all small: -2..+2 typically).
- DANGLING-THREAD RULE: if the patient's last line trailed off (ended with "…" or "—") and the student now asks directly about THAT topic, the patient MUST NOT deflect — picking up a dangling thread is an EARNED disclosure. Choose a disclose/partial_disclose move unless irritation > 6 or guardedness > 7 genuinely justifies deflection.

Return JSON only.`;
}
