/**
 * A7 — Dictation as a conversation (v5.1 A7).
 *
 * The interviewer is a deterministic state machine: given what a case already
 * has, it asks for the single most important missing piece. The AI (when
 * enabled) rephrases that into a warm, clinical follow-up; the state machine
 * itself is pure code so the whole flow works on fixtures with zero keys.
 *
 * A faculty member talks; the app collects the transcript field-by-field; the
 * interviewer keeps asking until the sim_case spec is complete enough to
 * build. Every answer lands in `state`, and buildCaseFromState assembles the
 * exact SimCase-shaped case_data (mirrors src/lib/sim/case-builder.ts).
 */

/** The clinical fields a dictated case can hold. Order = ask order. */
export const DICTATION_FIELDS = [
  "name", "age", "gender", "occupation", "city", "family", "register",
  "chief_complaint", "timeline", "treatment_history", "help_seeking_delay",
  "prior_contacts", "core_belief", "intermediate_beliefs", "coping",
  "opening_idiom", "red_flags", "resistance", "affect_rules",
] as const;
export type DictationField = (typeof DICTATION_FIELDS)[number];

/** A human-readable question per field, in the warm clinical register. */
export const FIELD_QUESTION: Record<DictationField, string> = {
  name: "What's a good invented first name and age? (Anonymise — never the real one.)",
  age: "And how old — even approximately?",
  gender: "Are they a man or a woman?",
  occupation: "What do they do for a living?",
  city: "Which city or town? (True to how they'd actually speak.)",
  family: "What's the family setup — who do they live with?",
  register: "How do they speak? (e.g. Hinglish, Gujarati-heavy, educated English.)",
  chief_complaint: "What would they say brought them in — in their OWN words, roughly?",
  timeline: "When did this start, and what's been the course since?",
  treatment_history: "Have they seen anyone before — a GP, a chemist, a faith healer? What happened?",
  help_seeking_delay: "How long did they wait before coming to care?",
  prior_contacts: "Who did they talk to first — a GP, a baba, a family remedy?",
  core_belief: "Deep down, what do they believe about themselves? One line.",
  intermediate_beliefs: "What are the 'if… then…' rules they live by? Comma-separated.",
  coping: "What do they DO to cope? Comma-separated.",
  opening_idiom: "What's the opening phrase they'd say first — an idiom from the bank?",
  red_flags: "Any risk content — self-harm, suicide, harm to others? One line each.",
  resistance: "What do they deflect about? What shuts them down?",
  affect_rules: "How do they respond to interruption, premature advice, validation?",
};

export interface DictationState {
  [field: string]: unknown;
}

/** Pick the next missing field in priority order. Deterministic. */
export function nextMissingField(state: DictationState): DictationField | null {
  for (const f of DICTATION_FIELDS) {
    if (hasField(state, f)) continue;
    return f;
  }
  return null;
}

export function hasField(state: DictationState, field: DictationField): boolean {
  const v = state[field];
  if (v === undefined || v === null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

/** Field count collected so far. */
export function collectedCount(state: DictationState): number {
  return DICTATION_FIELDS.filter((f) => hasField(state, f)).length;
}

/**
 * Parse a free-text answer into the typed shape a field expects. Pure. When
 * the number cannot be parsed, stores the raw string so nothing is lost.
 */
export function parseAnswer(field: DictationField, raw: string): unknown {
  const s = raw.trim();
  switch (field) {
    case "age": {
      const n = Number(s.replace(/[^0-9]/g, ""));
      return Number.isFinite(n) && n > 0 ? n : s;
    }
    case "gender": {
      const low = s.toLowerCase();
      // "woman" contains "man", so check the female clues FIRST.
      if (low.includes("woman") || low.includes("female") || low.includes("girl") || low.includes("ladies") || low.includes("she")) return "female";
      if (low.includes("man") || low.includes("male") || low.includes("boy") || low.includes("gentlemen") || low.includes("he")) return "male";
      return "other";
    }
    case "intermediate_beliefs":
    case "coping":
    case "prior_contacts":
    case "red_flags":
      // Comma / newline / "and" separated lists → string[].
      return s
        .split(/[\n,;]+|\band\b/i)
        .map((x) => x.trim())
        .filter(Boolean);
    default:
      return s;
  }
}

/** Apply one answer. Non-destructive: never overwrite an existing field. */
export function applyAnswer(state: DictationState, field: DictationField, rawText: string): DictationState {
  if (hasField(state, field)) return state;
  return { ...state, [field]: parseAnswer(field, rawText) };
}

/** Extract every field the raw transcript answers, best-effort. */
export function applyTranscript(state: DictationState, rawTranscript: string): DictationState {
  // Try each unanswered field against the transcript; where the question was
  // answered as its own line, capture it. This is heuristic — we grab the
  // first line that looks like an answer (not a question).
  let next = { ...state };
  const lines = rawTranscript
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.endsWith("?"));
  for (const line of lines) {
    const field = nextMissingField(next);
    if (!field) break;
    next = applyAnswer(next, field, line);
  }
  return next;
}

/** Missing fields still needed for a buildable case. */
export function missingFields(state: DictationState): DictationField[] {
  const required: DictationField[] = [
    "name", "age", "occupation", "register", "chief_complaint", "timeline", "core_belief",
  ];
  return required.filter((f) => !hasField(state, f));
}

/** The assembled dictation, typed close to SimCase so callers get useful
 *  fields (see case-builder.ts for the authored shape). */
export interface DictatedCase {
  identity: { name: string; age: number; gender: string; occupation: string; city: string; family_structure: string; language_register: string };
  presentation: string;
  chief_complaint_in_own_words: string;
  history: { timeline: string; treatment_history?: string; help_seeking_delay?: string; prior_contacts?: string[] };
  cognitive_model: { core_belief: string; intermediate_beliefs: string[]; coping: string[] };
  disclosure_rules: Array<{ content: string; gate: string }>;
  resistance: { deflections: string[]; topic_changes: string[]; irritation_triggers: string[]; silence_tolerance_seconds: number };
  affect_rules: { on_interruption: string; on_premature_advice: string; on_validation: string; tts_rate: number; tts_pitch: number };
  red_flags: Array<{ content: string; gate: string }>;
  context_pack: { family_in_room: boolean; stigma: string[]; cost_concerns: boolean; legal_relevance: string[] };
  style_refs: string[];
  rubric_targets: string[];
  few_shot: unknown[];
  opening_idiom?: string;
}

/** Assemble the case_data in the SimCase-shape (see case-builder.ts). */
export function buildCaseFromState(state: DictationState): {
  case_data: DictatedCase;
  missing: DictationField[];
} {
  const missing = missingFields(state);
  const str = (f: DictationField): string => (typeof state[f] === "string" ? (state[f] as string) : String(state[f] ?? ""));
  const list = (f: DictationField): string[] => (Array.isArray(state[f]) ? (state[f] as string[]) : []);

  const case_data = {
    identity: {
      name: str("name") || "Faculty composite",
      age: typeof state.age === "number" ? state.age : 0,
      gender: (str("gender") as "male" | "female" | "other") || "other",
      occupation: str("occupation"),
      city: str("city"),
      family_structure: str("family"),
      language_register: str("register"),
    },
    presentation: str("chief_complaint"),
    chief_complaint_in_own_words: str("chief_complaint"),
    history: {
      timeline: str("timeline"),
      treatment_history: str("treatment_history"),
      help_seeking_delay: str("help_seeking_delay"),
      prior_contacts: list("prior_contacts"),
    },
    cognitive_model: {
      core_belief: str("core_belief"),
      intermediate_beliefs: list("intermediate_beliefs"),
      coping: list("coping"),
    },
    disclosure_rules: list("red_flags").map((content) => ({ content, gate: "asked_about_self_harm_clearly" })),
    resistance: {
      deflections: [],
      topic_changes: str("resistance") ? [str("resistance")] : [],
      irritation_triggers: [],
      silence_tolerance_seconds: 8,
    },
    affect_rules: {
      on_interruption: "withdraws",
      on_premature_advice: "deflects",
      on_validation: "opens up",
      tts_rate: 0.9,
      tts_pitch: 0.9,
    },
    red_flags: list("red_flags").map((content) => ({ content, gate: "asked_about_self_harm_clearly" })),
    context_pack: {
      family_in_room: false,
      stigma: [],
      cost_concerns: false,
      legal_relevance: [],
    },
    style_refs: [],
    rubric_targets: ["history taking", "safety assessment", "cultural attunement"],
    few_shot: [],
    opening_idiom: str("opening_idiom") || undefined,
  };
  return { case_data, missing };
}

/** A prompt that turns the state machine's question into warm clinical prose.
 *  Content-authoring workload → allowed on free-tier models. */
export function interviewerPrompt(state: DictationState, question: string): string {
  const got = DICTATION_FIELDS.filter((f) => hasField(state, f)).join(", ");
  return [
    "You are a warm, unhurried clinical supervisor interviewing a seasoned Indian psychiatrist who is dictating an anonymised composite case from practice.",
    "Your job is ONLY to ask the next follow-up question in natural language. Never write the case yourself, never summarise, never diagnose.",
    `You still need to learn about: ${question}`,
    got ? `Already covered: ${got}.` : "Nothing collected yet — start with the basics.",
    "Ask ONE short, specific, warm question. No politeness padding, no list of questions.",
  ].join("\n");
}