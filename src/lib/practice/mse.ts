/**
 * MSE Trainer (Part 6.4): tag stimuli across the 11 domains from a
 * controlled vocabulary. Green/amber/red vs expert coding (amber =
 * defensible alternative). Dedicated mood-vs-affect drill: students conflate
 * these constantly. "Describe, don't diagnose": AI flags diagnostic terms.
 */

import { orderByHistory, type History } from "@/lib/history/order";
import type { PrepExam } from "@/lib/prep/types";
import { MSE_STIMULUS_BANK, stimulusExams } from "./mse-stimuli-bank";

export const MSE_DOMAINS = [
  "appearance", "behavior", "speech", "mood", "affect", "thought_content",
  "thought_process", "perception", "cognition", "insight", "judgment",
] as const;
export type MseDomain = (typeof MSE_DOMAINS)[number];

/** Controlled vocabulary per domain. */
export const MSE_VOCAB: Record<MseDomain, string[]> = {
  appearance: ["well-groomed", "unkempt", "dishevelled", "casual", "age-appropriate", "looks older than stated age", "underweight", "visible self-harm scars", "bizarre dress", "flamboyant dress", "signs of intoxication", "signs of withdrawal"],
  behavior: ["cooperative", "guarded", "agitated", "withdrawn", "bizarre", "restless", "psychomotor retardation", "poor eye contact", "hostile", "overfamiliar", "tremor", "catatonic posturing", "tics", "responding to unseen stimuli", "hypervigilant", "akathisia", "stereotyped movements", "compulsive rituals"],
  speech: ["normal rate", "pressured", "slow", "soft", "monotonous", "poverty of speech", "loud", "dysarthric", "mute", "stammering", "increased latency", "echolalia"],
  mood: ["euthymic", "depressed", "anxious", "irritable", "euphoric", "dysphoric", "hopeless", "angry", "fearful", "anhedonic", "apathetic", "numb"],
  affect: ["congruent", "incongruent", "flat", "blunted", "labile", "restricted", "constricted", "reactive", "tearful", "anxious", "elevated", "shallow", "perplexed", "irritable"],
  thought_content: ["delusions", "obsessions", "phobias", "preoccupations", "suicidal ideation", "homicidal ideation", "persecutory delusion", "grandiose delusion", "delusion of reference", "nihilistic delusion", "delusion of guilt", "jealous delusion", "somatic delusion", "overvalued idea", "passive death wish", "suicidal plan", "thought insertion", "thought broadcasting", "thought withdrawal", "worries", "health anxiety", "ideas of reference", "self-harm thoughts", "no abnormal content"],
  thought_process: ["linear", "loosening of associations", "flight of ideas", "circumstantial", "tangential", "perseveration", "thought blocking", "goal-directed", "clang associations", "word salad", "neologisms", "slowed thinking", "concrete thinking", "overinclusive", "poverty of content"],
  perception: ["hallucinations", "illusions", "depersonalization", "derealization", "auditory hallucinations", "visual hallucinations", "tactile hallucinations", "olfactory hallucinations", "command hallucinations", "pseudo-hallucinations", "hypnagogic hallucinations", "third-person voices", "no perceptual abnormality"],
  cognition: ["oriented x3", "impaired attention", "impaired memory", "impaired concentration", "disoriented", "clouded consciousness", "confabulation", "impaired abstraction", "intact"],
  insight: ["full", "partial", "poor", "absent", "different explanatory model"],
  judgment: ["good", "fair", "poor", "impaired"],
};

/** Diagnostic terms the "describe, don't diagnose" mode flags. */
const DIAGNOSTIC_TERMS = [
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
  { text: "Client laughs while describing a terrible loss.", answer: "affect", why: "Observable emotional expression: incongruent affect." },
  { text: "\"I'm on top of the world these days.\"", answer: "mood", why: "Self-reported sustained feeling." },
  { text: "Client's face stays blank through the whole session.", answer: "affect", why: "Observable flat affect." },
  { text: "\"Everything is grey. Nothing matters.\"", answer: "mood", why: "Reported inner state." },
  { text: "Client's voice and face switch rapidly from anger to tears.", answer: "affect", why: "Observable labile affect." },
  { text: "\"I've been irritable all month.\"", answer: "mood", why: "Sustained reported state." },
  { text: "Client says they feel fine, but their voice is flat and they avoid eye contact.", answer: "affect", why: "Observable mismatch with reported mood." },
  { text: "\"For two weeks I have woken up dreading the day.\"", answer: "mood", why: "A sustained state, in the client's own words." },
  { text: "Client smiles and jokes while describing hearing voices that threaten to kill her.", answer: "affect", why: "What you see does not fit the content: incongruent affect." },
  { text: "Her face barely changes, whether she talks about her son's wedding or her mother's death.", answer: "affect", why: "Observed narrow range of expression: restricted or blunted affect." },
  { text: "\"I feel on edge all the time, like something bad is about to happen.\"", answer: "mood", why: "A pervasive reported feeling: anxious mood." },
  { text: "He bursts into tears at a mild question, then laughs a moment later, then is calm.", answer: "affect", why: "Rapid changes you can see, unrelated to the topic: labile affect." },
  { text: "\"Since Diwali I have been angry with everyone at home.\"", answer: "mood", why: "A sustained feeling over weeks, reported by the client." },
  { text: "She cries quietly when she speaks about her divorce, and is composed when talking about work.", answer: "affect", why: "Observable expression that fits the content: congruent affect with a normal range." },
  { text: "\"Honestly, I have never felt better. Everything is going brilliantly.\" (said by a man who has not slept for 3 nights)", answer: "mood", why: "His report of his inner state: elevated mood, whatever the evidence suggests." },
  { text: "Throughout the interview he looks perplexed, glancing around as if lost.", answer: "affect", why: "What you observe on his face and in his behaviour right now." },
  { text: "\"Nothing excites me any more, not even cricket.\"", answer: "mood", why: "Reported loss of pleasure over time (anhedonia) belongs with mood." },
  { text: "Her voice rises and her fists clench whenever her husband is mentioned.", answer: "affect", why: "Observable, moment-to-moment emotional expression: irritable affect." },
  { text: "\"I am fine.\" (from a patient who looks tearful and sits slumped with her head down)", answer: "mood", why: "\"I am fine\" is her reported mood. Record it in her words, then record the tearful affect you see separately." },
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
  /** Why the expert tags fit, and why the tempting wrong tag does not (shown after Check). */
  why?: string;
  /** Library tags (every bank item has them). */
  topic?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  objective?: string;
  exams?: PrepExam[];
  /** Study module ("module/section") for "Learn this". */
  module?: string;
}

/** Study module section for each trainer domain. */
export const MSE_DOMAIN_MODULE: Record<MseDomain, string> = {
  appearance: "mse-deep/1-2", behavior: "mse-deep/1-2", speech: "mse-deep/2-1", mood: "mse-deep/1-3", affect: "mse-deep/1-3",
  thought_content: "mse-deep/2-2", thought_process: "mse-deep/2-1", perception: "mse-deep/2-3", cognition: "mse-deep/2-4",
  insight: "mse-deep/2-5", judgment: "mse-deep/2-5",
};

/** Up to `n` stimuli for one domain, in a stable shuffled order for this seed (a Level 2 round is a few per domain, not the whole bank). */
/**
 * With an answer history (src/lib/history): stimuli never seen first, then
 * missed ones, right ones last (oldest first).
 */
export function domainRound(stimuli: MseStimulus[], domain: MseDomain, n: number, seed: number, history?: History, now = 0): MseStimulus[] {
  const pool = stimuli.filter((s) => s.domain === domain);
  let h = seed >>> 0;
  const rnd = () => ((h = (Math.imul(h ^ (h >>> 15), 2246822507) + 0x9e3779b9) >>> 0) / 4294967296);
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return (history ? orderByHistory(a, (x) => x.id, history, now, rnd) : a).slice(0, n);
}

const BASE_MSE_STIMULI: MseStimulus[] = [
  { id: "mse-1", content: "\"I hear a voice telling me I'm worthless. It's not mine.\"", domain: "perception", expertTags: ["hallucinations"], amberTags: ["auditory hallucination"] },
  { id: "mse-2", content: "Client speaks quickly, jumps between topics, never finishes a sentence.", domain: "speech", expertTags: ["pressured"], amberTags: ["flight of ideas"] },
  { id: "mse-3", content: "\"I haven't showered in a week. What's the point?\"", domain: "appearance", expertTags: ["unkempt"], amberTags: ["dishevelled"] },
  { id: "mse-4", content: "Client describes feeling 'empty' but smiles and laughs throughout.", domain: "affect", expertTags: ["incongruent"], amberTags: ["blunted"] },
  { id: "mse-5", content: "\"I'm the reincarnation of the king. I must be.\"", domain: "thought_content", expertTags: ["delusions"], amberTags: ["grandiose delusion"] },
  { id: "mse-6", content: "Client answers every question with a long tangent before returning to the point.", domain: "thought_process", expertTags: ["circumstantial"], amberTags: ["tangential"] },
  { id: "mse-7", content: "\"I know there's a plan to poison me. The neighbours are in on it.\"", domain: "thought_content", expertTags: ["delusions"], amberTags: ["paranoid delusion"] },
  { id: "mse-8", content: "Client reports sleeping 3 hours, racing thoughts, and plans to start three businesses.", domain: "mood", expertTags: ["euphoric"], amberTags: ["manic"] },
  { id: "mse-9", content: "Client is oriented to person but not date or place.", domain: "cognition", expertTags: ["disoriented"], amberTags: ["impaired memory"] },
  { id: "mse-10", content: "\"I know I'm ill, but I don't think I need medicine.\"", domain: "insight", expertTags: ["partial"], amberTags: ["poor"] },
  { id: "mse-11", content: "Client paces the room, can't sit still, voice is loud and rapid.", domain: "behavior", expertTags: ["agitated"], amberTags: ["restless"] },
  { id: "mse-12", content: "Client starts a sentence, stops mid-way, and says 'never mind' twice in a row.", domain: "thought_process", expertTags: ["thought blocking"], amberTags: ["poverty of speech"] },
];

/** Topic and rung for the first 12 stimuli (ids and text unchanged). */
const BASE_TAGS: Record<string, [string, 1 | 2 | 3 | 4 | 5]> = {
  "mse-1": ["Psychosis", 1], "mse-2": ["Mania", 2], "mse-3": ["Depression", 1], "mse-4": ["Affect", 3], "mse-5": ["Mania", 1], "mse-6": ["Thought form", 4],
  "mse-7": ["Psychosis", 1], "mse-8": ["Mania", 3], "mse-9": ["Delirium", 2], "mse-10": ["Insight", 2], "mse-11": ["Agitation", 1], "mse-12": ["Thought form", 4],
};

/** All Level 2 tagging stimuli: the first 12 plus the library bank. */
export const SEED_MSE_STIMULI: MseStimulus[] = [
  ...BASE_MSE_STIMULI.map((s) => {
    const [topic, d] = BASE_TAGS[s.id];
    return { ...s, topic, difficulty: d, objective: `Tag ${s.domain.replace("_", " ")} with the controlled words`, exams: stimulusExams(d), module: MSE_DOMAIN_MODULE[s.domain] };
  }),
  ...MSE_STIMULUS_BANK,
];
