/**
 * The rich case shape the player is built for (the practice audit, section
 * 5.2). Today's banks are thinner: `fromPick` in ./adapt.ts turns an old
 * "pick one" step into this shape with the fields it has, and the player
 * simply leaves out the parts that are missing. When the content is
 * rewritten, the richer fields (context blocks, a grade and a reason on
 * every option, three hints, concept, common errors) show without changing
 * the player.
 *
 * What the student gets before answering has no keys in it: `Option` here is
 * the text only; grades and reasons arrive in `StepKey` after the answer
 * (from the server, or from the tool engine that checks on the phone today).
 */
export type Level = 1 | 2 | 3 | 4 | 5;
export type Grade = "best" | "acceptable" | "poor" | "harmful";

export type ContextBlock =
  | { kind: "setting"; text: string }
  | { kind: "demographics"; text: string }
  | { kind: "presenting"; text: string }
  | { kind: "history"; text: string }
  | { kind: "family-social"; text: string }
  | { kind: "observation"; text: string }
  | { kind: "investigation"; label: string; text: string; /** The student chooses to open it. */ onRequest?: boolean }
  | { kind: "collateral"; text: string }
  /** C clinician, P patient, R relative. */
  | { kind: "dialogue"; lines: ["C" | "P" | "R", string][] };

export type Option = { id: string; text: string };

/** Which common reasoning error an option stands for. */
export type ErrorTag =
  | "anchoring" | "premature-closure" | "missed-organic" | "missed-risk" | "over-diagnosis" | "under-diagnosis" | "over-referral" | "under-referral"
  | "scope-overreach" | "false-reassurance" | "breach" | "criteria-miscount" | "duration-miss" | "medicine-effect-missed" | "culture-misread";

export type StepKind = "single" | "multi" | "order" | "diagnosis-search" | "sort-5p" | "free-text";

/** One question of a case, as shown before answering. */
export type Step = {
  id: string;
  kind: StepKind;
  /** New information that arrives before this step (tests back, a week later). */
  reveal?: ContextBlock[];
  prompt: string;
  /** 4 to 6 for single and multi. Fewer still draws (old content, true two-way calls). */
  options: Option[];
  /** 0 to 3 written hints: 1 a direction, 2 what to weigh, 3 narrows without naming the answer. */
  hints: string[];
};

/** What comes back once a step is answered. */
export type OptionKey = { grade: Grade; /** Why right, or why wrong here. */ feedback?: string | null; /** Level 4: what happens next. */ consequence?: string | null; error?: ErrorTag };
export type StepKey = {
  /** Per option id. */
  options: Record<string, OptionKey>;
  explanation: {
    /** The principle, by name. */
    concept?: string | null;
    whyCorrect: string;
    /** The model or criteria behind it. */
    theory?: string | null;
    /** The clinical point: what this changes for the patient. */
    implication?: string | null;
    /** 0 to 3 plain sentences. */
    commonErrors?: string[];
    /** An extra note the old banks carry (the law behind an ethics call). */
    more?: { label: string; text: string } | null;
  };
};

export type RichCase = {
  id: string;
  title: string;
  level: Level;
  topic: string;
  competency: "recognise" | "differentiate" | "formulate" | "risk" | "decide" | "communicate" | "law-ethics" | "refer";
  /** One line, shown after. */
  objective: string;
  role: "trainee-psychologist" | "psychologist" | "team-member";
  context: ContextBlock[];
  steps: Step[];
  links?: { module: string; quickNote?: string };
};

/** A case with its keys, for a bank that is checked on the phone (the sample, and today's tool engine). */
export type KeyedCase = RichCase & { keys: Record<string, StepKey> };

export const GRADE_WORD: Record<Grade, string> = { best: "Best choice", acceptable: "Acceptable, not best", poor: "A weak choice", harmful: "This could harm" };
export const GRADE_SCORE: Record<Grade, number> = { best: 1, acceptable: 0.6, poor: 0.2, harmful: 0 };
/** The most a step can score after 0, 1, 2 or 3 hints. */
export const HINT_CAP = [1, 0.85, 0.7, 0.5] as const;

export const BLOCK_LABEL: Record<ContextBlock["kind"], string> = {
  setting: "Where you are",
  demographics: "The person",
  presenting: "Why they came",
  history: "The story so far",
  "family-social": "Family and home",
  observation: "What you see",
  investigation: "Tests",
  collateral: "From the family",
  dialogue: "In the room",
};

/** The best option ids of a step. */
export function bestOf(key: StepKey): string[] {
  return Object.keys(key.options).filter((id) => key.options[id]!.grade === "best");
}

/** 0 to 1 for one answer: the picked option's grade (for multi: the share of right calls), capped by hints, halved on a second try. */
export function scoreStep(key: StepKey, picked: string[], optionIds: string[], hints: number, tries: number): number {
  const best = new Set(bestOf(key));
  let raw: number;
  if (picked.length === 1 && best.size <= 1) raw = GRADE_SCORE[key.options[picked[0]!]?.grade ?? "poor"];
  else raw = optionIds.length ? optionIds.filter((id) => best.has(id) === picked.includes(id)).length / optionIds.length : 0;
  const cap = HINT_CAP[Math.min(hints, 3)]!;
  return Math.round(Math.min(raw, cap) * (tries > 1 ? 0.5 : 1) * 100) / 100;
}
