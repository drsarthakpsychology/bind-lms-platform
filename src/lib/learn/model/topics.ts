/**
 * Topics and the question bank for the student model.
 *
 * A topic is a study module id (so "Fix it" can link to /study/<topic>), and
 * a skill is "topic:competency". Every question in src/lib/learn/content is
 * tagged with one skill: each lesson has a default, and single questions that
 * test something else are overridden below.
 * Look-alike topics share a `family`, so practice can interleave them
 * (mixing depression with bipolar teaches the difference far better than
 * blocks of one topic).
 */
import { ALL_LESSONS } from "../content";
import type { Item, McqItem, TfItem } from "../types";
import { COMPETENCIES, skillKey, type Competency } from "./skills";

export type Topic = { id: string; title: string; family: string };

export const TOPICS: Topic[] = [
  { id: "interview-mse", title: "Interview & MSE", family: "signs" },
  { id: "depression", title: "Depression", family: "mood" },
  { id: "bipolar", title: "Bipolar", family: "mood" },
  { id: "anxiety", title: "Anxiety", family: "fear" },
  { id: "ocd", title: "OCD", family: "fear" },
  { id: "trauma", title: "Trauma & stress", family: "fear" },
  { id: "psychosis", title: "Psychosis", family: "signs" },
  { id: "antidepressants", title: "Antidepressants", family: "meds" },
  { id: "antipsychotics", title: "Antipsychotics", family: "meds" },
  { id: "stabilisers", title: "Mood stabilisers", family: "meds" },
  { id: "defences", title: "Defences", family: "self" },
  { id: "personality", title: "Personality", family: "self" },
  { id: "child", title: "Children", family: "body" },
  { id: "neurocognitive", title: "Delirium & dementia", family: "body" },
  { id: "substance", title: "Alcohol & drugs", family: "body" },
  { id: "suicide", title: "Suicide & risk", family: "risk" },
  { id: "ethics-law", title: "Ethics & law", family: "risk" },
];

export const COMPETENCY_LABEL: Record<Competency, string> = {
  recognise: "Spot it",
  criteria: "Criteria",
  differentiate: "Tell apart",
  apply: "Use it",
  mse: "MSE",
  risk: "Risk",
  pharm: "Medicines",
};

const LESSON_SKILL: Record<string, string> = {
  "signs-1": "interview-mse:recognise",
  "signs-2": "interview-mse:recognise",
  "signs-3": "interview-mse:recognise",
  "mse-1": "interview-mse:mse",
  "mse-2": "interview-mse:mse",
  "mood-1": "depression:criteria",
  "mood-2": "bipolar:criteria",
  "anx-1": "anxiety:criteria",
  "anx-2": "ocd:recognise",
  "psy-1": "psychosis:criteria",
  "psy-2": "psychosis:recognise",
  "ad-1": "antidepressants:pharm",
  "ad-2": "antidepressants:pharm",
  "ap-1": "antipsychotics:pharm",
  "ap-2": "antipsychotics:pharm",
  "ms-1": "stabilisers:pharm",
  "ms-2": "stabilisers:pharm",
  "df-1": "defences:recognise",
  "df-2": "personality:recognise",
  "ls-1": "child:criteria",
  "ls-2": "neurocognitive:differentiate",
  "ls-3": "substance:recognise",
  "rk-1": "suicide:risk",
  "rk-2": "ethics-law:apply",
  "cs-1": "depression:apply",
  "cs-2": "neurocognitive:apply",
};

const ITEM_SKILL: Record<string, string> = {
  sg13: "interview-mse:differentiate",
  sg15: "psychosis:recognise",
  sg19: "depression:recognise",
  sg21: "antipsychotics:pharm",
  ms12: "neurocognitive:differentiate",
  md3: "depression:recognise",
  md5: "bipolar:differentiate",
  md6: "bipolar:apply",
  md7: "suicide:risk",
  md10: "bipolar:differentiate",
  md11: "bipolar:recognise",
  md12: "bipolar:differentiate",
  md13: "bipolar:recognise",
  ax3: "anxiety:differentiate",
  ax4: "anxiety:differentiate",
  ax5: "anxiety:apply",
  ax6: "anxiety:apply",
  ax10: "ocd:apply",
  ax11: "trauma:criteria",
  ax12: "trauma:recognise",
  ax13: "trauma:differentiate",
  ps3: "psychosis:recognise",
  ps4: "psychosis:differentiate",
  ps6: "psychosis:apply",
  ps8: "psychosis:apply",
  ps9: "neurocognitive:differentiate",
  ps10: "psychosis:differentiate",
  ad4: "antidepressants:risk",
  ad11: "antidepressants:risk",
  ap3: "antipsychotics:recognise",
  ap9: "antipsychotics:recognise",
  ap10: "antipsychotics:differentiate",
  li2: "stabilisers:recognise",
  vp5: "stabilisers:risk",
  pd1: "personality:differentiate",
  pd3: "personality:criteria",
  pd4: "personality:differentiate",
  ls2: "child:recognise",
  ls3: "child:differentiate",
  ls5: "neurocognitive:apply",
  ls6: "neurocognitive:recognise",
  ls10: "substance:apply",
  cs2: "anxiety:apply",
  cs3: "psychosis:apply",
  cs4: "antidepressants:apply",
  cs6: "stabilisers:apply",
  cs7: "bipolar:apply",
  cs8: "antipsychotics:apply",
};

export function topicById(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}

export function splitSkill(skill: string): { topic: string; competency: string } {
  const i = skill.indexOf(":");
  return i < 0 ? { topic: skill, competency: "apply" } : { topic: skill.slice(0, i), competency: skill.slice(i + 1) };
}

export function isCompetency(c: string): c is Competency {
  return (COMPETENCIES as readonly string[]).includes(c);
}

/** "depression:criteria" → "Depression · Criteria" */
export function skillLabel(skill: string): string {
  const { topic, competency } = splitSkill(skill);
  const t = topicById(topic)?.title ?? topic.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  return `${t} · ${isCompetency(competency) ? COMPETENCY_LABEL[competency] : competency}`;
}

/* ------------------------------------------------------------ the bank */

/** Questions the engine can serve and grade with one tap. */
export type GradedItem = McqItem | TfItem;
export type BankItem = { item: GradedItem; skill: string; topic: string; family: string };

function tagged(): BankItem[] {
  const out: BankItem[] = [];
  for (const l of ALL_LESSONS) {
    for (const item of l.items) {
      if (item.kind !== "mcq" && item.kind !== "tf") continue;
      const skill = ITEM_SKILL[item.id] ?? LESSON_SKILL[l.id];
      if (!skill) continue;
      const topic = splitSkill(skill).topic;
      const family = topicById(topic)?.family ?? topic;
      out.push({ item, skill, topic, family });
    }
  }
  return out;
}

export const BANK: BankItem[] = tagged();
const BY_ID = new Map(BANK.map((b) => [b.item.id, b]));

export function bankItem(id: string): BankItem | undefined {
  return BY_ID.get(id);
}

/** Skill for any content question id (also match/sort/order), if tagged. */
export function skillOfItem(id: string): string | null {
  if (ITEM_SKILL[id]) return ITEM_SKILL[id];
  const l = ALL_LESSONS.find((x) => x.items.some((i: Item) => i.id === id));
  return l ? (LESSON_SKILL[l.id] ?? null) : null;
}

/** Skills that have at least one question, per topic. */
export const SKILLS_WITH_ITEMS: Set<string> = new Set(BANK.map((b) => b.skill));

export function topicSkills(topic: string): string[] {
  return COMPETENCIES.map((c) => skillKey(topic, c)).filter((s) => SKILLS_WITH_ITEMS.has(s));
}

/* ------------------------------------------------------------- grading */

/** A one-tap answer: mcq option index, or true/false. "skip" = "I don't know". */
export type Choice = number | boolean | "skip";

export function gradeChoice(item: GradedItem, choice: Choice): { ok: boolean; chosen: string | null; correct: string } {
  if (item.kind === "mcq") {
    const correct = item.options[item.answer];
    if (choice === "skip" || typeof choice !== "number" || !Number.isInteger(choice) || choice < 0 || choice >= item.options.length) return { ok: false, chosen: null, correct };
    return { ok: choice === item.answer, chosen: item.options[choice], correct };
  }
  const correct = item.answer ? "True" : "False";
  if (typeof choice !== "boolean") return { ok: false, chosen: null, correct };
  return { ok: choice === item.answer, chosen: choice ? "True" : "False", correct };
}
