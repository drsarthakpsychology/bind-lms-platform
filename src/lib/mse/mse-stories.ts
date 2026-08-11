/**
 * MSE expert codes (v5 Part 2, Levels 4 & 5) — what each patient ACTUALLY
 * presents, authored once per sim case keyed by title. This is the ground
 * truth a full-MSE or MSE-from-live-interview is scored against.
 *
 * These map onto the real authored sim patients (src/lib/sim/cases/). The
 * coding is hand-authored per case (never derived from a model) so a student
 * who writes the MSE from their own Consulting Room transcript is scored
 * against what the patient really presented — the Level 5 loop that matters.
 *
 * The `title` field matches the authored case title. getExpertMseForCase()
 * falls back to a null code when a case isn't coded yet, so the feature works
 * before every case has a code.
 */

import type { MseCode } from "./ladder";

/** An expert MSE code, plus the authored sim-case title it keys to. */
export interface MseCodeWithTitle extends MseCode {
  title: string;
}

/** Hand-authored expert MSE codings for the authored sim patients. */
export const MSE_EXPERT_CODES: MseCodeWithTitle[] = [
  {
    caseKey: "dep-ravi",
    title: "Ravi, 34 — the heaviness in his chest",
    appearance: ["casual shop-clothes", "groomed but tired", "dark rings"],
    behavior: ["cooperative", "guarded on money", "restless hands"],
    speech: ["slow", "soft", "few words"],
    mood: ["depressed", "dysphoric", "anxious underneath"],
    affect: ["flat_with_effort", "congruent", "constricted"],
    thought_process: ["linear", "blocking at mention of money"],
    thought_content: ["preoccupation with the shop", "debt", "passive thoughts of not waking up"],
    perception: [],
    cognition: ["impaired concentration", "oriented x3"],
    insight: ["partial", "sees the sleep problem, not the mood"],
    judgment: ["fair"],
    small_things: [
      "leg stopped moving when you brought up the marriage",
      "used the past tense about himself once ('I was a good father')",
      "long pause before answering the money question",
    ],
  },
  {
    caseKey: "dep-meera",
    title: "Meera, 22 — 'I can't focus, it's the exams'",
    appearance: ["hostel-casual", "clean but hastily dressed"],
    behavior: ["cooperative", "brittle-cheerful exterior", "avoids eye contact at 'parents'"],
    speech: ["normal rate", "educated English", "full sentences"],
    mood: ["flat", "sad internally, denied"],
    affect: ["brittle_cheerful", "incongruent", "tight smile"],
    thought_process: ["linear", "intellectualises"],
    thought_content: ["preoccupation with exams", "guilt about fees", "planned method of ending her life"],
    perception: [],
    cognition: ["impaired concentration", "oriented x3"],
    insight: ["poor for the mood", "full for the exams"],
    judgment: ["fair"],
    small_things: [
      "said 'we' about a decision that was hers alone ('we decided to drop the course')",
      "looked at the door when her mother was mentioned",
      "laughed at something not funny when asked about friends",
    ],
  },
  {
    caseKey: "psy-vikram",
    title: "Vikram, 27 — the Lonazep case (four traps at once)",
    appearance: ["unkempt", "same clothes as described last visit", "avoiding eye contact"],
    behavior: ["guarded", "suspicious", "resistant", "slow to engage"],
    speech: ["monotone", "marathi-accented English", "clipped"],
    mood: ["dysphoric", "flat"],
    affect: ["flat", "withdrawn", "suspicious flashes"],
    thought_process: ["linear but guarded", "pauses"],
    thought_content: ["ideas of reference (relative whispered about him)", "voice telling him to 'be careful'", "conviction the medicine is keeping him sane"],
    perception: ["auditory hallucination (voice)"],
    cognition: ["oriented x3", "impaired concentration"],
    insight: ["poor", "attributes everything to the medicine"],
    judgment: ["fair"],
    small_things: [
      "did not make eye contact when the medicine was mentioned",
      "asked 'why are you asking so many questions?' early",
      "tightened when the pharmacy student was mentioned",
    ],
  },
  {
    caseKey: "bip-neha",
    title: "Neha, 26 — the 'best three months ever' that ended badly",
    appearance: ["designer clothes, dishevelled", "no makeup today"],
    behavior: ["cooperative", "rapid at first, then collapsed", "tearful in the crash"],
    speech: ["rapid", "vivid", "pressured during high recall", "then slow and flat when describing the drop"],
    mood: ["currently severely depressed", "shame"],
    affect: ["labile", "brittle_cheerful when recalling high", "incongruent"],
    thought_process: ["flight of ideas when recalling the high phase", "linear when flat"],
    thought_content: ["guilt about spending", "grandiose memories ('I was a genius')", "wish the high had never ended"],
    perception: [],
    cognition: ["oriented x3", "impaired concentration"],
    insight: ["poor into the bipolar pattern", "full into the immediate crash"],
    judgment: ["poor during the high (sold bike, maxed cards)", "fair now"],
    small_things: [
      "voice speed changed dramatically when recounting the high phase",
      "laughed describing selling her bike, then cried",
      "said 'the tablet made me fly' — past-tense about herself",
    ],
  },
  {
    caseKey: "som-rohit",
    title: "Rohit, 24 — 'not feeling fresh' every single morning",
    appearance: ["well-groomed", "office casual", "healthy complexion"],
    behavior: ["cooperative", "slightly frustrated", "wants a 'test'"],
    speech: ["normal rate", "clear", "frustrated edge"],
    mood: ["frustrated", "slightly anxious", "not low"],
    affect: ["congruent", "animated when describing the morning"],
    thought_process: ["linear", "preoccupied with the symptom"],
    thought_content: ["preoccupation with 'not feeling fresh'", "has googled his own diagnosis"],
    perception: [],
    cognition: ["oriented x3", "intact"],
    insight: ["full into the symptom, partial into the cause"],
    judgment: ["good"],
    small_things: [
      "perked up when you asked about his morning routine",
      "used biomedical words ('digestion, metabolism') — borrowed register",
      "relieved when asked about 'motion' — that was the thing",
    ],
  },
  {
    caseKey: "som-mrsdesai",
    title: "Mrs. Desai, 58 — 'the gas, the acidity, the heat'",
    appearance: ["sari, neat", "worn but tidy"],
    behavior: ["cooperative", "long catalogue of symptoms", "hopeful"],
    speech: ["rambling", "soft", "lists symptoms"],
    mood: ["anxious", "mildly sad", "exhausted"],
    affect: ["congruent", "anxious"],
    thought_process: ["circumstantial", "returns to the symptoms"],
    thought_content: ["preoccupation with body symptoms", "fear of a serious illness (cancer, heart)"],
    perception: [],
    cognition: ["oriented x3", "impaired attention during lists"],
    insight: ["partial", "attributes to 'gas' not mood"],
    judgment: ["good"],
    small_things: [
      "listed symptoms in the same order each time — a rehearsed list",
      "looked at her son before answering about the pain",
      "said 'the heat' with a wave of the hand — idiom for turmoil",
    ],
  },
];
/** Look up the expert MSE code for an authored sim case by its title.
 *  Returns null when the case isn't coded yet (feature works regardless). */
export function getExpertMseForCase(title: string): MseCodeWithTitle | null {
  return MSE_EXPERT_CODES.find((c) => c.title === title) ?? null;
}

/** Level 5 practice: reference MSE-by-case for the students to re-score after
 *  the first attempt. */
export const MSE_CASE_TITLES = MSE_EXPERT_CODES.map((c) => c.title);
