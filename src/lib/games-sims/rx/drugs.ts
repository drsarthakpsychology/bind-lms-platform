/**
 * Rx Detective's medicines, built from the shared Medicines reference
 * (src/lib/meds: names, Indian brands, class, side effects, checks, doses;
 * src/lib/meds/mechanisms.ts: how each one works and its receptor). Nothing
 * medical is written here: edit a medicine in lib/meds and Rx Detective
 * changes with it. Every medicine in the reference is playable.
 *
 * The only game-specific data is EMPHASIS: for some medicines, which of the
 * reference's own side effects is "the one to remember" and which check to
 * ask about (picked by a phrase in the reference text). Without an entry the
 * first serious side effect and the first check are used.
 *
 * Distractor safety (see game.ts) uses CONCEPTS: a wrong option is only
 * offered when none of its ideas (weight, QT, white cells, D2, SERT, ...)
 * appear anywhere in the asked medicine's own reference entry, so a "wrong"
 * option is never also true.
 */
import { MEDS, type Med } from "@/lib/meds";
import { MECHANISMS, type Mechanism } from "@/lib/meds/mechanisms";

export type Topic =
  | "antidepressants"
  | "antipsychotics"
  | "stabilisers"
  | "anxiety"
  | "child"
  | "neurocognitive"
  | "substance";
export type Action = "full" | "partial" | "antagonist" | "inverse";

export type Drug = {
  id: string;
  name: string;
  brands: string[];
  topic: Topic;
  /** Class, mechanism, the one adverse effect to remember, and what to monitor. */
  cls: string;
  mech: string;
  ae: string;
  mon: string;
  /** Dose steps from the reference, for learning only. */
  dose: string;
  /** Receptor shown in the animation. */
  target: { receptor: string; action: Action; line: string };
};

/* --------------------------------------------------------------- emphasis */

/** Phrases (case-insensitive) that pick an item from the reference's side effects (common and serious) and checks. */
export const EMPHASIS: Record<string, { ae?: string; mon?: string }> = {
  sertraline: { ae: "loose stools", mon: "suicidal" },
  escitalopram: { ae: "QT", mon: "ECG" },
  fluoxetine: { ae: "insomnia", mon: "under 25" },
  paroxetine: { ae: "discontinuation", mon: "taper" },
  venlafaxine: { ae: "high blood pressure", mon: "blood pressure" },
  mirtazapine: { ae: "appetite", mon: "weight" },
  amitriptyline: { ae: "overdose", mon: "suicide risk" },
  haloperidol: { ae: "stiffness", mon: "movements" },
  olanzapine: { ae: "weight gain", mon: "weight and waist" },
  risperidone: { ae: "prolactin", mon: "periods" },
  aripiprazole: { ae: "akathisia", mon: "restlessness" },
  quetiapine: { ae: "sleepiness", mon: "BP lying" },
  clozapine: { ae: "agranulocytosis", mon: "blood count" },
  lithium: { ae: "toxicity", mon: "kidney and thyroid" },
  valproate: { ae: "birth defects", mon: "pregnancy" },
  carbamazepine: { ae: "stevens", mon: "HLA" },
  lamotrigine: { ae: "stevens", mon: "skin" },
  lorazepam: { ae: "breathing", mon: "short course" },
  methylphenidate: { ae: "appetite", mon: "height" },
  donepezil: { ae: "slow pulse", mon: "pulse" },
  disulfiram: { ae: "reaction with alcohol", mon: "consent" },
};

/** Reference lines that say there is nothing to name ("Few"): never "the one to remember". */
const EMPTY_LINE = /^(few|none)\b/i;

function pick(list: string[], phrase: string | undefined): string | undefined {
  if (!phrase) return undefined;
  const p = phrase.toLowerCase();
  return list.find((x) => x.toLowerCase().includes(p));
}

function keyEffect(m: Med): string {
  const all = [...m.serious, ...m.common];
  return pick(all, EMPHASIS[m.id]?.ae) ?? all.find((x) => !EMPTY_LINE.test(x)) ?? m.common[0] ?? "";
}

function keyCheck(m: Med): string {
  return pick(m.checks, EMPHASIS[m.id]?.mon) ?? m.checks[0] ?? "";
}

/* ------------------------------------------------------------------ topic */

const BY_GROUP: Partial<Record<Med["group"], Topic>> = {
  Antidepressants: "antidepressants",
  Antipsychotics: "antipsychotics",
  "Mood stabilisers": "stabilisers",
  "Anxiety and sleep": "anxiety",
  // Side-effect medicines (trihexyphenidyl) treat antipsychotic movement effects.
  "Side-effect medicines": "antipsychotics",
};
/** The mixed group splits by what the medicine treats. */
const MIXED: Record<string, Topic> = {
  methylphenidate: "child",
  atomoxetine: "child",
  donepezil: "neurocognitive",
  memantine: "neurocognitive",
};

export function topicOf(m: Med): Topic {
  return BY_GROUP[m.group] ?? MIXED[m.id] ?? "substance";
}

/* ----------------------------------------------------------------- family */

/** Look-alike families, from the reference's class: same-family medicines never supply each other's wrong options. */
export function familyOf(m: Med): string {
  const c = m.cls.toLowerCase();
  const rules: [RegExp, string][] = [
    [/^ssri/, "ssri"],
    [/^snri/, "snri"],
    [/tricyclic/, "tca"],
    [/benzodiazepine/, "benzo"],
    [/first-generation/, "fga"],
    [/second-generation/, "sga"],
    [/mood stabiliser|anticonvulsant/, "ms"],
    [/melatonin/, "melatonin"],
    [/opioid/, "opioid"],
  ];
  return rules.find(([re]) => re.test(c))?.[1] ?? c;
}

/* --------------------------------------------------------------- concepts */

/** Ideas a line can carry. Two lines sharing one are treated as possibly both true. */
const CONCEPTS: [string, RegExp][] = [
  ["weight", /weight|appetite|hunger|waist/],
  ["sedation", /sleepi|drows|sedat|tired|calm/],
  ["sleep", /insomnia|sleep|dreams/],
  ["qt", /\bqt\b|heart rhythm|arrhythm|ecg|cardiac|heart disease/],
  ["heart", /myocard|cardiomyo|troponin|heart block/],
  ["sodium", /sodium/],
  ["prolactin", /prolactin|periods|breast/],
  [
    "movement",
    /stiff|tremor|parkinson|restless|akathisia|dystonia|\beps\b|movement|spasm|unsteady|coordination/,
  ],
  ["tardive", /tardive|aims/],
  ["nms", /\bnms\b|neuroleptic malignant/],
  ["blood", /white cell|agranulocyt|neutro|blood count|aplastic|platelet|bleed|anaemia/],
  ["skin", /rash|stevens|skin|epidermal|itch|acne|psoriasis|sun sensitiv/],
  ["liver", /liver|jaundice|hepat|enzyme rise/],
  ["kidney", /kidney|renal|urine/],
  ["thyroid", /thyroid/],
  ["calcium", /calcium/],
  ["sexual", /sexual|libido|ejaculat|priapism/],
  ["gut", /nausea|vomit|diarr|loose stool|stomach|ulcer|pancrea|taste/],
  ["anticholinergic", /dry mouth|constipat|blurred|urinary retention|glaucoma|drool|bowel|ileus/],
  ["bp", /blood pressure|\bbp\b|on standing|falls?\b|faint|dizz/],
  ["pulse", /pulse|heart rate|palpitat|racing heart/],
  ["seizure", /seizure|fits\b/],
  ["serotonin", /serotonin syndrome|serotonergic/],
  [
    "dependence",
    /dependen|misuse|withdrawal|taper|stopping|discontinu|long-term|short course|review need|rebound/,
  ],
  ["breathing", /breathing|respirat|wheeze|asthma/],
  ["metabolic", /glucose|sugar|diabet|lipid|cholesterol|metabolic|hba1c/],
  ["pregnancy", /pregnan|birth defect|unborn|bab(y|ies)|ebstein|contracept|ovar/],
  ["suicide", /suicid|overdose|small (supplies|quantities|amounts)|under 25/],
  ["levels", /\blevels?\b/],
  ["mania", /mania|bipolar/],
  ["growth", /growth|height/],
  [
    "cognition",
    /confus|delirium|memory|concentrat|hallucinat|psychosis|dementia|stroke|cataract|neuropath|meningitis|ammonia/,
  ],
  ["alcohol", /alcohol/],
  ["opioid", /opioid/],
  ["interactions", /cyp|other medicines|medicine list|toxic levels|clozapine level/],
  ["impulse", /gambl|impulsiv|compulsive/],
  ["headache", /headache/],
  ["sweat", /sweat/],
  ["hla", /hla/],
  ["consent", /consent|understanding/],
  ["sleephygiene", /sleep routine|cbt-i|cause of insomnia/],
  ["bone", /bone/],
  ["hair", /hair/],
  ["vision", /double vision|blurred/],
  ["injection", /inject/],
  ["withdrawalscore", /withdrawal score|ciwa/],
  // Receptors, pumps, channels and enzymes (for class and mechanism options).
  [
    "sert",
    /serotonin pump|serotonin recycling|\bsert\b|serotonin reuptake|\bssri\b|\bsnri\b|tricyclic|sari|serotonin modulator|serotonin and noradrenaline/,
  ],
  [
    "net",
    /noradrenaline pump|\bnet\b|noradrenaline reuptake|\bsnri\b|ndri|tricyclic|serotonin and noradrenaline/,
  ],
  ["dat", /dopamine pump|\bdat\b|ndri|stimulant|dopamine and noradrenaline/],
  [
    "d2",
    /\bd2\b|dopamine d|antipsychotic|first-generation|second-generation|benzamide|thioxanthene/,
  ],
  [
    "5ht2",
    /5-ht2|serotonin 2|serotonin modulator|serotonin antagonist|several serotonin receptors/,
  ],
  ["5ht1a", /5-ht1a|serotonin 1a|serotonin modulator|several serotonin receptors/],
  ["5ht7", /5-ht7|serotonin 7/],
  ["h1", /histamine/],
  ["m1", /muscarinic|acetylcholine receptor|anticholinergic/],
  ["a1", /alpha-1/],
  ["a2", /alpha-2|brake receptors|nassa/],
  ["beta", /beta/],
  ["gaba", /gaba|benzodiazepine|z-drug/],
  ["nachannel", /sodium channel/],
  ["cachannel", /calcium channel|gabapentinoid/],
  ["glutamate", /glutamate|nmda/],
  ["mu", /opioid/],
  ["melatonin", /melatonin|body clock/],
  ["ache", /acetylcholinesterase|cholinesterase|breaks down acetylcholine/],
  ["aldh", /aldehyde|breaks down alcohol/],
  ["lithium", /lithium|simple salt|inositol/],
  ["moodstab", /mood stabiliser|anticonvulsant|seizures/],
];

export function conceptsOf(text: string): Set<string> {
  const t = text.toLowerCase();
  return new Set(CONCEPTS.filter(([, re]) => re.test(t)).map(([k]) => k));
}

/** Everything the reference says a medicine does or needs (for side-effect and check options). */
export function clinicalText(m: Med): string {
  return [...m.common, ...m.serious, ...m.checks, ...m.standout].join(" | ");
}

/** Everything the reference says about how it works (for class and mechanism options). */
export function pharmText(m: Med, mech: Mechanism | undefined): string {
  return [
    m.cls,
    mech?.plain ?? "",
    ...(mech?.targets ?? []).map((t) => `${t.target} ${t.action}`),
  ].join(" | ");
}

/* ------------------------------------------------------------------ build */

const ACTION: Record<Mechanism["receptor"]["pick"], Action> = {
  "Full agonist": "full",
  "Partial agonist": "partial",
  Antagonist: "antagonist",
  "Inverse agonist": "inverse",
};

function toDrug(m: Med): Drug | null {
  const mech = MECHANISMS[m.id];
  if (!mech) return null;
  return {
    id: m.id,
    name: m.name,
    brands: m.brands,
    topic: topicOf(m),
    cls: m.cls,
    mech: mech.plain,
    ae: keyEffect(m),
    mon: keyCheck(m),
    dose: m.doses.map((d) => d.amount).join(", "),
    target: {
      receptor: mech.receptor.name,
      action: ACTION[mech.receptor.pick],
      line: `Press ${mech.receptor.pick}. ${mech.receptor.note}`,
    },
  };
}

export const DRUGS: Drug[] = MEDS.flatMap((m) => toDrug(m) ?? []);

const BY_ID = new Map(DRUGS.map((d) => [d.id, d]));
export const drugById = (id: string) => BY_ID.get(id);

const MED_BY_ID = new Map(MEDS.map((m) => [m.id, m]));
export const FAMILY: Record<string, string> = Object.fromEntries(
  DRUGS.map((d) => [d.id, familyOf(MED_BY_ID.get(d.id)!)]),
);

/** Concepts in each medicine's own reference entry, per kind of question. */
export const PROFILE: Record<string, { clinical: Set<string>; pharm: Set<string> }> =
  Object.fromEntries(
    DRUGS.map((d) => {
      const m = MED_BY_ID.get(d.id)!;
      return [
        d.id,
        {
          clinical: conceptsOf(clinicalText(m)),
          pharm: conceptsOf(pharmText(m, MECHANISMS[d.id])),
        },
      ];
    }),
  );
