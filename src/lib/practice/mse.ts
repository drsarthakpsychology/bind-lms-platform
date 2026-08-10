/**
 * MSE Trainer (Part 6.4) — tag stimuli across the 11 domains from a
 * controlled vocabulary. Green/amber/red vs expert coding (amber =
 * defensible alternative). Dedicated mood-vs-affect drill — students conflate
 * these constantly. "Describe, don't diagnose": AI flags diagnostic terms.
 */

export const MSE_DOMAINS = [
  "appearance", "behavior", "speech", "mood", "affect", "thought_content",
  "thought_process", "perception", "cognition", "insight", "judgment",
] as const;
export type MseDomain = (typeof MSE_DOMAINS)[number];

/** Controlled vocabulary per domain. */
export const MSE_VOCAB: Record<MseDomain, string[]> = {
  appearance: ["well-groomed", "unkempt", "dishevelled", "casual", "age-appropriate"],
  behavior: ["cooperative", "guarded", "agitated", "withdrawn", "bizarre", "restless"],
  speech: ["normal rate", "pressured", "slow", "soft", "monotonous", "poverty of speech"],
  mood: ["euthymic", "depressed", "anxious", "irritable", "euphoric", "dysphoric"],
  affect: ["congruent", "incongruent", "flat", "blunted", "labile", "restricted", "constricted"],
  thought_content: ["delusions", "obsessions", "phobias", "preoccupations", "suicidal ideation", "homicidal ideation"],
  thought_process: ["linear", "loosening of associations", "flight of ideas", "circumstantial", "tangential", "perseveration", "thought blocking"],
  perception: ["hallucinations", "illusions", "depersonalization", "derealization"],
  cognition: ["oriented x3", "impaired attention", "impaired memory", "impaired concentration"],
  insight: ["full", "partial", "poor", "absent"],
  judgment: ["good", "fair", "poor", "impaired"],
};

/** Diagnostic terms the "describe, don't diagnose" mode flags. */
export const DIAGNOSTIC_TERMS = [
  "schizophren", "bipolar", "depress", "anxiety", "disorder",
  "psychosis", "psychotic", "manic", "mania", "dementia", "delirium", "ptsd",
  "ocd", "borderline", "antisocial", "narcissistic",
];

/** Mood vs affect drill: a statement, is it mood or affect? */
export interface MoodAffectItem {
  text: string;
  answer: "mood" | "affect";
  why: string;
}

export const MOOD_AFFECT_ITEMS: MoodAffectItem[] = [
  { text: "\"I've felt empty inside for weeks.\"", answer: "mood", why: "A sustained inner feeling the client reports." },
  { text: "Client laughs while describing a terrible loss.", answer: "affect", why: "Observable emotional expression — incongruent affect." },
  { text: "\"I'm on top of the world these days.\"", answer: "mood", why: "Self-reported sustained feeling." },
  { text: "Client's face stays blank through the whole session.", answer: "affect", why: "Observable flat affect." },
  { text: "\"Everything is grey. Nothing matters.\"", answer: "mood", why: "Reported inner state." },
  { text: "Client's voice and face switch rapidly from anger to tears.", answer: "affect", why: "Observable labile affect." },
  { text: "\"I've been irritable all month.\"", answer: "mood", why: "Sustained reported state." },
  { text: "Client says they feel fine, but their voice is flat and they avoid eye contact.", answer: "affect", why: "Observable mismatch with reported mood." },
];

export function isDiagnosticTerm(text: string): string[] {
  const lower = text.toLowerCase();
  return DIAGNOSTIC_TERMS.filter((t) => lower.includes(t));
}

/** Seed MSE stimuli with expert codings. */
export interface MseStimulus {
  id: string;
  content: string;
  domain: MseDomain;
  expertTags: string[]; // green = exact; amber = defensible alternatives
  amberTags?: string[];
}

export const SEED_MSE_STIMULI: MseStimulus[] = [
  { id: "mse-1", content: "\"I hear a voice telling me I'm worthless. It's not mine.\"", domain: "perception", expertTags: ["hallucinations"], amberTags: ["auditory hallucination"] },
  { id: "mse-2", content: "Client speaks quickly, jumps between topics, never finishes a sentence.", domain: "speech", expertTags: ["pressured"], amberTags: ["flight of ideas"] },
  { id: "mse-3", content: "\"I haven't showered in a week. What's the point?\"", domain: "appearance", expertTags: ["unkempt"], amberTags: ["dishevelled"] },
  { id: "mse-4", content: "Client describes feeling 'empty' but smiles and laughs throughout.", domain: "affect", expertTags: ["incongruent"], amberTags: ["blunted"] },
  { id: "mse-5", content: "\"I'm the reincarnation of the king. I must be.\"", domain: "thought_content", expertTags: ["delusions"], amberTags: ["grandiose delusion"] },
  { id: "mse-6", content: "Client answers every question with a long tangent before returning to the point.", domain: "thought_process", expertTags: ["circumstantial"], amberTags: ["tangential"] },
  { id: "mse-7", content: "\"I know there's a plan to poison me. The neighbours are in on it.\"", domain: "thought_content", expertTags: ["delusions"], amberTags: ["paranoid delusion"] },
  { id: "mse-8", content: "Client reports sleeping 3 hours, racing thoughts, and plans to start three businesses.", domain: "mood", expertTags: ["euphoric"], amberTags: ["manic"] },
  { id: "mse-9", content: "Client is oriented to person but not date or place.", domain: "cognition", expertTags: ["impaired memory"], amberTags: ["disoriented"] },
  { id: "mse-10", content: "\"I know I'm ill, but I don't think I need medicine.\"", domain: "insight", expertTags: ["partial"], amberTags: ["poor"] },
  { id: "mse-11", content: "Client paces the room, can't sit still, voice is loud and rapid.", domain: "behavior", expertTags: ["agitated"], amberTags: ["restless"] },
  { id: "mse-12", content: "Client starts a sentence, stops mid-way, and says 'never mind' twice in a row.", domain: "thought_process", expertTags: ["thought blocking"], amberTags: ["poverty of speech"] },
];
