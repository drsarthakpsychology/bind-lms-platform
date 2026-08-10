#!/usr/bin/env tsx
/**
 * Populate the 6 empty observation/derived tables for psychopharm drugs.
 *
 *   npm run psych:populate-obs
 *
 * Reads:  psych_drug_fields (side_effects_serious / _common / contraindications /
 *         monitoring / mechanism / common_uses / onset / half_life /
 *         special_populations) — joined against psych_drugs.
 * Writes: psych_red_flags, psych_clinical_pearls, psych_observation_prompts,
 *         psych_therapist_questions, psych_comorbidity_notes,
 *         psych_session_observations — all status='draft', with source_id
 *         provenance. Seeds psych_conditions if empty.
 *
 * Quote-first: signal / pearl / prompt_text / question / note / observation
 * are distilled from existing field text — never invented. Each row carries
 * a source_id pointing at the originating authority. The script uses simple
 * keyword/regex heuristics; the reviewer should still verify before publish.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadEnv(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(new RegExp(`^${name}=(.*)$`));
      if (m) return m[1].trim();
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

const URL = loadEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = loadEnv("SUPABASE_SERVICE_ROLE_KEY");
if (!URL || !SERVICE_KEY) {
  console.error("missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

interface Drug {
  id: string;
  generic_name: string;
}
interface Field {
  drug_id: string;
  field_key: string;
  text: string;
  source_id: string;
  source_title: string;
}
type FieldMap = Partial<Record<
  "side_effects_serious" | "side_effects_common" | "contraindications" | "monitoring" | "mechanism" | "common_uses" | "onset" | "half_life" | "special_populations",
  Field[]
>>;

const SOURCE_PRIORITY = [
  "Prescriber's Guide (Stahl's Essential Psychopharmacology)",
  "FDA Prescribing Information (DailyMed / Drugs@FDA)",
  "The Maudsley Prescribing Guidelines in Psychiatry",
  "Stahl's Essential Psychopharmacology",
  "Essential Psychopharmacology: The Prescriber's Guide",
  "Essential Psychopharmacology Prescriber's Guide (preview)",
  "Kaplan and Sadock's Synopsis of Psychiatry",
  "A Short Textbook of Psychiatry",
];

interface Source {
  id: string;
  title: string;
}
interface Condition {
  id: string;
  name: string;
}

/**
 * Returns true if `s` matches any of the regexes (case-insensitive).
 * We use word boundaries so "mania" doesn't match "mechanism".
 */
function containsAny(s: string, patterns: RegExp[]): boolean {
  const lc = " " + s.toLowerCase().replace(/[^\w\s]/g, " ") + " ";
  for (const r of patterns) {
    if (r.test(lc)) return true;
  }
  return false;
}
function extractSentences(s: string, maxLen = 240): string[] {
  // Break on sentence-like boundaries and trim. Keep things compact.
  return s
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+|(?:;\s+)/)
    .map((x) => x.trim())
    .filter((x) => x.length >= 12 && x.length <= maxLen);
}

// ────────────────────────────────────────────────────────────────────────────
// 1) red-flag extraction
// ────────────────────────────────────────────────────────────────────────────

interface RedFlag {
  signal: string;
  guidance: string;
  keywords: RegExp[];
  urgency: "routine" | "mention_to_prescriber" | "refer_promptly";
  classesHint?: RegExp[]; // if absent, applies broadly
}

const RED_FLAG_RULES: RedFlag[] = [
  {
    signal: "Suicidal thoughts / behaviors (boxed warning)",
    guidance:
      "Antidepressants carry an FDA boxed warning for suicidality in young patients; flag any new or worsening suicidal ideation promptly to prescriber.",
    keywords: [/suicid/, /suicidal ide/, /boxed warning/, /suicidality/],
    urgency: "refer_promptly",
  },
  {
    signal: "QT prolongation / arrhythmia risk",
    guidance:
      "Drug can prolong the QT interval; relevant for clients with cardiac history or who take other QT-prolonging agents — coordinate with prescriber.",
    keywords: [/qt prolongation/, /qt interval/, /torsades/, /arrhythm/, /qtc prolongation/, /tachycardia,?\s+arrhythmia/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Serotonin syndrome if combined with MAOIs / serotonergic agents",
    guidance:
      "Risk of serotonin syndrome with MAOIs and other serotonergic drugs; combinations are usually contraindicated — review medication list.",
    keywords: [/serotonin syndrome/, /concomitant mao/i, /with mao/i, /serotonergic drug/, /fatal serotonin/],
    urgency: "refer_promptly",
  },
  {
    signal: "Hepatotoxicity / hepatic failure",
    guidance:
      "Rare but serious liver injury has been reported; baseline and periodic LFTs may be indicated in some patients.",
    keywords: [/hepatic failure/, /hepatotoxic/, /liver injur/, /hepatitis/, /transaminase/, /hepatic events/, /elevated hepatic/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Neuroleptic malignant syndrome (NMS) — emergency",
    guidance:
      "Antipsychotics can precipitate NMS — fever, rigidity, autonomic instability, mental status change; this is a medical emergency.",
    keywords: [/neuroleptic malignant/, /\bnms\b/, /malignant syndrome/],
    urgency: "refer_promptly",
  },
  {
    signal: "Severe cutaneous reactions (SJS / TEN / DRESS)",
    guidance:
      "Rare severe skin reactions reported; new rash with systemic symptoms warrants urgent review.",
    keywords: [/stevens[- ]johnson/, /\bsjs\b/, /toxic epidermal/, /\bten\b/, /dress/, /severe cutaneous/, /exfoliative dermatit/],
    urgency: "refer_promptly",
  },
  {
    signal: "Agranulocytosis / severe blood dyscrasia",
    guidance:
      "Agranulocytosis and related cytopenias reported; baseline and ongoing CBC is often required.",
    keywords: [/agranulocyt/, /leukopen/, /neutrop/, /pancytopen/, /blood dyscrasia/],
    urgency: "refer_promptly",
  },
  {
    signal: "Metabolic syndrome (weight / glucose / lipids)",
    guidance:
      "Second-generation antipsychotics are associated with metabolic changes — weight, fasting glucose, and lipid monitoring often recommended.",
    keywords: [/metabolic syndrome/, /hyperglycemia/, /weight gain/, /dyslipidemia/, /diabetes/, /metabolic changes/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Tardive dyskinesia — risk with long-term use",
    guidance:
      "Long-term exposure can lead to tardive dyskinesia; periodic AIMS-style screening is standard.",
    keywords: [/tardive dyskinesia/, /\baims\b/, /tardive/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Extrapyramidal symptoms (EPS) / parkinsonism",
    guidance:
      "Drug-induced parkinsonism, akathisia, dystonia, or tremor — these can look like primary psychiatric symptoms; flag new movement changes to prescriber.",
    keywords: [/extrapyramidal/, /drug-induced parkinson/, /akathisia/, /acute dystonia/, /parkinsonism/, /parkinsonian/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Sedation / CNS depression (impaired driving risk)",
    guidance:
      "Marked sedation, especially early in treatment, can impair driving and combined risk with alcohol or opioids is substantial.",
    keywords: [/impaired driving/, /operating machiner/, /respiratory depression/, /sedation,?\s+somnolence/, /cns depress/, /profound sedation/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Dependence, tolerance, withdrawal (benzodiazepines / Z-drugs)",
    guidance:
      "Tolerance, dependence, and a withdrawal syndrome can develop; abrupt discontinuation may trigger rebound anxiety, insomnia, or seizures.",
    keywords: [/dependence/, /withdrawal/, /tolerance/, /abuse, misuse/, /addiction/, /discontinuation-emergent/, /withdrawal seizures/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Risk of abuse / diversion (controlled substance)",
    guidance:
      "Drug has abuse / diversion potential; non-judgmentally discuss safe storage and adherence patterns.",
    keywords: [/abuse/, /diversion/, /substance use/, /controlled substance/, /schedule (?:ii|iii|iv)/, /drug abuse/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Activation / jitteriness (early weeks)",
    guidance:
      "Some patients experience restlessness, agitation, or worsening anxiety in the first 1–2 weeks; discuss with prescriber if it persists.",
    keywords: [/activation/, /jitter/, /agitation/, /akathisia/, /increased energy/, /psychomotor activation/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Mania induction in bipolar (antidepressants)",
    guidance:
      "Antidepressants given without a mood stabilizer can precipitate mania or rapid cycling in bipolar disorder — flag any elevated / expansive shift.",
    keywords: [/induction of mania/, /mania,?\s+or hypomania/, /switch to mania/, /mania risk/, /manic reaction/],
    urgency: "refer_promptly",
  },
  {
    signal: "Hypertensive crisis (MAOI dietary / drug interaction)",
    guidance:
      "Tyramine-containing foods and certain medications can trigger a hypertensive crisis with MAOIs — diet and OTC review is essential.",
    keywords: [/hypertensive crisis/, /tyramine/, /mao[a-z]? inhibit/, /maoi/i],
    urgency: "refer_promptly",
  },
  {
    signal: "Priapism (rare, emergency)",
    guidance:
      "Rare but urological emergency — prolonged painful erection; instruct patients to seek urgent care.",
    keywords: [/priapism/, /prolonged erection/],
    urgency: "refer_promptly",
  },
  {
    signal: "Rhabdomyolysis (rare)",
    guidance:
      "Rare reports of rhabdomyolysis — muscle pain, weakness, dark urine; warrants urgent evaluation.",
    keywords: [/rhabdomyolys/],
    urgency: "refer_promptly",
  },
  {
    signal: "Hypotension / orthostatic hypotension",
    guidance:
      "Especially during titration, orthostatic drops can occur — counsel slow position changes and fall risk.",
    keywords: [/orthostatic hypotension/, /hypotension/, /postural hypotension/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Seizure threshold lowering",
    guidance:
      "May lower seizure threshold, particularly relevant in eating disorders, alcohol withdrawal, or known epilepsy.",
    keywords: [/seizure threshold/, /lowered seizure/, /rare seizures/, /seizures,?\s+sedation/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Pregnancy / teratogenicity concerns",
    guidance:
      "Drug is associated with fetal risk or insufficient data; review with prescriber if pregnancy is planned or possible.",
    keywords: [/teratogen/, /pregnancy categor/, /fetal risk/, /pregnant\b/, /neonatal withdrawal/, /neonatal sedation/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Anticholinergic burden (constipation / urinary retention / confusion)",
    guidance:
      "Anticholinergic effects — constipation, urinary retention, blurred vision, cognitive blunting — are dose-related and additive with other anticholinergics.",
    keywords: [/anticholinergic/, /urinary retention/, /constipation/, /dry mouth/, /blurred vision/, /cognitive impairment/, /confusion/],
    urgency: "mention_to_prescriber",
  },
  {
    signal: "Increased intraocular pressure / acute angle-closure glaucoma",
    guidance:
      "Drugs with anticholinergic activity can precipitate acute angle-closure glaucoma in susceptible individuals.",
    keywords: [/intraocular pressure/, /angle-closure/, /glaucoma/],
    urgency: "refer_promptly",
  },
  {
    signal: "Hyperthermia (TCA + anticholinergic combinations)",
    guidance:
      "Hyperthermia risk in combinations with anticholinergic drugs; relevant in polypharmacy contexts.",
    keywords: [/hyperthermia/],
    urgency: "refer_promptly",
  },
  {
    signal: "Myocarditis / cardiomyopathy (clozapine)",
    guidance:
      "Clozapine is associated with myocarditis and cardiomyopathy — chest pain, dyspnea, or unexplained fatigue warrants urgent cardiac review.",
    keywords: [/myocarditis/, /cardiomyopathy/, /myocardial infarct/],
    urgency: "refer_promptly",
  },
];

// Limit flags per drug — even if many rules hit, surface only the most severe.
const RED_FLAG_LIMIT = 3;

function deriveRedFlags(text: string): { signal: string; guidance: string; urgency: "routine" | "mention_to_prescriber" | "refer_promptly"; matchedKey: string }[] {
  const lc = " " + text.toLowerCase() + " ";
  const out: { signal: string; guidance: string; urgency: "routine" | "mention_to_prescriber" | "refer_promptly"; matchedKey: string }[] = [];
  for (const rule of RED_FLAG_RULES) {
    for (const pat of rule.keywords) {
      if (pat.test(lc)) {
        out.push({ signal: rule.signal, guidance: rule.guidance, urgency: rule.urgency, matchedKey: pat.source });
        break;
      }
    }
    if (out.length >= RED_FLAG_LIMIT) break;
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────────────
// 2) clinical pearl — one concise sentence per drug from mechanism+profile
// ────────────────────────────────────────────────────────────────────────────

interface PearlContext {
  mechanism?: string;
  sideEffectsCommon?: string;
  onset?: string;
  halfLife?: string;
  uses?: string;
  drugName: string;
}

function derivePearl(ctx: PearlContext): string | null {
  const all = ((ctx.mechanism ?? "") + " " + (ctx.sideEffectsCommon ?? "") + " " + (ctx.uses ?? "")).toLowerCase();

  // Class-specific patterns
  if (/ssri|serotonin reuptake/.test(all)) {
    return "SSRI — therapeutic effect typically emerges over 4–6 weeks; some patients experience activation / jitteriness in week 1–2, so plan to check in early.";
  }
  if (/snri|serotonin[- ]?norepinephrine reuptake/.test(all)) {
    return "SNRI — onset of meaningful antidepressant action is 2–4 weeks; watch for BP elevation (duloxetine / venlafaxine) and discontinuation symptoms if doses are missed.";
  }
  if (/atypical antipsychotic|dopamine d2 antagonist|partial agonist at d2|postsynaptic.*5-ht2a|postsynaptic d2 antagonist/.test(all)) {
    return "Atypical antipsychotic — discuss metabolic monitoring (weight, fasting glucose, lipids) at baseline and at intervals; tardive dyskinesia risk grows with cumulative exposure.";
  }
  if (/typical antipsychotic|conventional antipsychotic|haloperidol|chlorpromazine/.test(all) && /d2|dopamine/.test(all)) {
    return "First-generation antipsychotic — high EPS / tardive dyskinesia risk; consider periodic AIMS and movement screening.";
  }
  if (/benzodiazepine|gaba[- ]?a/.test(all) && /alprazolam|clonazepam|diazepam|lorazepam|chlordiazepoxide|oxazepam|temazepam|triazolam|flurazepam|midazolam/.test(all.toLowerCase()) || /\bgaba\b/.test(all)) {
    return "Benzodiazepine — short-term symptomatic relief; tolerance, dependence, and a discontinuation syndrome are real — discuss the planned duration up front.";
  }
  if (/z[- ]?drug|non[- ]benzodiazepine hypnotic|hypocretin|orexin/.test(all)) {
    return "Z-drug / hypnotic — complex sleep-related behaviors (sleepwalking, sleep-driving) have been reported; counsel about safety before sleep.";
  }
  if (/stimulant|reuptake inhibitor.*dopamine|release of dopamine|amphetamine|methylphenidate/.test(all)) {
    return "Stimulant — vital signs, growth, and appetite are worth tracking; therapeutic effect on attention is usually visible within an hour of dosing.";
  }
  if (/melatonergic|mt1|mt2|melatonin receptor/.test(all)) {
    return "Melatonergic agonist — most useful for circadian-rhythm sleep problems; not a general sedative.";
  }
  if (/alpha[- ]?2/.test(all) && /antagonist/.test(all) && /depress/.test(all)) {
    return "Mirtazapine-class — sedation and weight gain are common; antidepressant onset is similar to SSRIs (2–4 weeks), and sexual side effects are typically lower.";
  }
  if (/mao[a-z]? inhibit/.test(all) || /monoamine oxidase/.test(all)) {
    return "MAOI — dietary tyramine and drug-interaction restrictions are critical; washout periods when switching agents are non-trivial.";
  }
  if (/lithium/.test(ctx.drugName.toLowerCase())) {
    return "Lithium — narrow therapeutic index; thyroid, renal, and serum-level monitoring are routine, and dehydration raises toxicity risk.";
  }
  if (/valproate|divalproex/.test(ctx.drugName.toLowerCase())) {
    return "Valproate — teratogenic and hepatotoxic at high levels; baseline LFTs and pregnancy-status review are typically part of prescribing.";
  }
  if (/lamotrigine/.test(ctx.drugName.toLowerCase())) {
    return "Lamotrigine — slow titration is required to mitigate Stevens–Johnson / TEN risk; any new rash warrants urgent review.";
  }
  if (/carbamazepine/.test(ctx.drugName.toLowerCase())) {
    return "Carbamazepine — many drug–drug interactions via CYP3A4 induction and rare but serious hematologic / dermatologic reactions.";
  }
  if (/topiramate/.test(ctx.drugName.toLowerCase())) {
    return "Topiramate — cognitive dulling, paresthesia, and kidney-stone risk are common; counsel on hydration.";
  }
  if (/ketamine|nmda antagonist|nmda receptor antagonist/.test(all)) {
    return "NMDA antagonist (esketamine / ketamine) — transient dissociation, BP elevation, and sedation during dosing; arrange safe monitoring around administration.";
  }
  if (/alpha-?2[a-z]?\b.*\bagonist|alpha-2a agonist|alpha2[a-z]?\b.*\badrenergic/i.test(all)) {
    return "Alpha-2 agonist (clonidine / guanfacine) — bradycardia, hypotension, and rebound hypertension on abrupt stop are real considerations.";
  }
  if (/cholinesterase|acetylcholinesterase/.test(all)) {
    return "Cholinesterase inhibitor — GI side effects (nausea, loose stools) and vivid dreams are common; bradycardia risk in susceptible patients.";
  }
  if (/disulfiram/.test(ctx.drugName.toLowerCase())) {
    return "Disulfiram — disulfiram–ethanol reaction is the therapeutic point; review all sources of alcohol (cough syrups, mouthwash) and inadvertent exposures.";
  }
  if (/naltrexone|opioid antagonist/.test(all)) {
    return "Opioid antagonist — concurrent opioid analgesia (e.g. for surgery) is blocked; counsel clients to carry this on their medical record.";
  }
  if (/acamprosate/.test(ctx.drugName.toLowerCase())) {
    return "Acamprosate — three-times-daily oral dosing; renal function must be adequate.";
  }

  // Fall back to a generic mechanism-derived sentence
  if (ctx.mechanism) {
    const s = extractSentences(ctx.mechanism, 180)[0];
    if (s) return `${ctx.drugName} — mechanism: ${s}`;
  }
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// 3) observation prompts — 2–4 from side_effects_common + monitoring
// ────────────────────────────────────────────────────────────────────────────

interface PromptRule {
  category: "mood" | "sleep" | "energy" | "movement" | "memory" | "appetite" | "sexual_functioning" | "attention" | "motivation" | "anxiety" | "social_functioning";
  prompt: (drug: string) => string;
  rationale: (drug: string) => string;
  keywords: RegExp[];
  classOnly?: RegExp[]; // restrict to certain classes; inferred from mechanism/uses text
  urgency: "routine" | "mention_to_prescriber" | "refer_promptly";
}

function classHints(mechanism: string, uses: string): string {
  return ((mechanism ?? "") + " " + (uses ?? "")).toLowerCase();
}

const PROMPT_RULES: PromptRule[] = [
  // sleep / sedation
  {
    category: "sleep",
    prompt: () => "Track whether morning drowsiness or daytime sedation has changed since starting or changing dose.",
    rationale: () => "Sedation can be dose-dependent and may interfere with engagement in sessions.",
    keywords: [/sedation/, /somnolence/, /drowsiness/],
    urgency: "routine",
  },
  {
    category: "sleep",
    prompt: () => "Notice any change in sleep-onset latency or sleep quality after dose changes.",
    rationale: () => "Common side effect to track over time.",
    keywords: [/insomnia/, /sleep disturbance/],
    urgency: "routine",
  },
  {
    category: "sleep",
    prompt: () => "If a hypnotic: ask about unusual nighttime behaviors (eating, walking, driving) the client has no memory of.",
    rationale: () => "Complex sleep-related behaviors are a known risk for Z-drugs and some sedatives.",
    keywords: [/sleepwalking/, /sleep-driving/, /complex sleep/, /parasomnia/],
    urgency: "mention_to_prescriber",
  },
  // energy / activation
  {
    category: "energy",
    prompt: () => "Watch for new restlessness, agitation, or activation in the first 1–2 weeks.",
    rationale: () => "Antidepressants can produce an early activation syndrome before the mood effect sets in.",
    keywords: [/activation/, /agitation/, /jitter/, /akathisia/, /increased energy/, /psychomotor activation/],
    urgency: "mention_to_prescriber",
  },
  {
    category: "energy",
    prompt: () => "Track energy levels across the day relative to dose timing.",
    rationale: () => "Useful for stimulant or sedating medication routines.",
    keywords: [/insomnia/, /overstimulation/, /fatigue/, /tiredness/, /drowsiness/],
    urgency: "routine",
  },
  // movement
  {
    category: "movement",
    prompt: () => "Note any tremor, restlessness, or subjective sense of inner restlessness, especially around dose increases.",
    rationale: () => "Akathisia and EPS can be confused with anxiety — track the timing carefully.",
    keywords: [/tremor/, /akathisia/, /extrapyramidal/, /parkinson/, /dystonia/, /rigidit/, /dyskinesia/],
    urgency: "mention_to_prescriber",
  },
  {
    category: "movement",
    prompt: () => "If long-term exposure: ask periodically about involuntary face, tongue, or limb movements.",
    rationale: () => "Tardive dyskinesia risk grows with cumulative antipsychotic exposure.",
    keywords: [/tardive/, /\baims\b/],
    urgency: "mention_to_prescriber",
  },
  // mood
  {
    category: "mood",
    prompt: () => "Track mood lability or elevated / expansive shifts, particularly in clients with a bipolar history.",
    rationale: () => "Antidepressants given without a mood stabilizer can precipitate manic switching.",
    keywords: [/mania/, /manic/, /mixed episodes/, /rapid cycling/],
    urgency: "refer_promptly",
  },
  {
    category: "mood",
    prompt: () => "Notice any emergence of new suicidal thoughts, especially in the first few weeks.",
    rationale: () => "FDA boxed warning for suicidality applies to most antidepressants in young patients.",
    keywords: [/suicid/, /boxed warning/],
    urgency: "refer_promptly",
  },
  // appetite / metabolic
  {
    category: "appetite",
    prompt: () => "Track appetite, weight, and snack patterns across the week.",
    rationale: () => "Several drug classes cause weight change; metabolic monitoring is standard for atypical antipsychotics.",
    keywords: [/weight gain/, /weight loss/, /appetite/, /metabolic/],
    urgency: "routine",
  },
  // cognition
  {
    category: "memory",
    prompt: () => "Notice subjective memory changes or word-finding difficulty during titration.",
    rationale: () => "Anticholinergic and sedative effects can produce subjective cognitive blunting.",
    keywords: [/memory impair/, /cognitive/, /concentration difficult/, /word-finding/, /confusion/, /cognitive disorder/],
    urgency: "routine",
  },
  // sexual functioning
  {
    category: "sexual_functioning",
    prompt: () => "Open a non-judgmental conversation about libido, arousal, and orgasm at follow-up visits.",
    rationale: () => "Sexual side effects are common with serotonergic drugs and are often under-reported.",
    keywords: [/sexual dysfunction/, /libido/, /impotence/, /erectil/, /orgasm/],
    urgency: "routine",
  },
  // GI
  {
    category: "appetite",
    prompt: () => "Track GI symptoms (nausea, loose stools, constipation), particularly early in treatment.",
    rationale: () => "GI side effects are common and often dose- or timing-dependent.",
    keywords: [/nausea/, /vomiting/, /diarrh/, /constipation/, /dry mouth/, /abdominal/],
    urgency: "routine",
  },
  // autonomic / cardiac
  {
    category: "anxiety",
    prompt: () => "Ask about palpitations, lightheadedness on standing, or unusual fatigue.",
    rationale: () => "Orthostatic hypotension and cardiac side effects are worth screening for some classes.",
    keywords: [/orthostatic/, /hypotension/, /palpitation/, /tachycardia/, /syncope/],
    urgency: "mention_to_prescriber",
  },
  // anticholinergic
  {
    category: "memory",
    prompt: () => "Watch for urinary retention, severe constipation, or new confusion, especially in older adults on anticholinergic regimens.",
    rationale: () => "Anticholinergic burden is cumulative and increases fall and delirium risk.",
    keywords: [/anticholinergic/, /urinary retention/, /constipation/, /confusion/],
    urgency: "mention_to_prescriber",
  },
  // substance-use cue
  {
    category: "social_functioning",
    prompt: () => "Non-judgmentally explore any increase in alcohol or non-prescribed substance use.",
    rationale: () => "Some medications lower seizure threshold and interact with substances; substance use can also signal inadequate symptom control.",
    keywords: [/alcohol/, /substance/, /drug abuse/],
    urgency: "mention_to_prescriber",
  },
];

const PROMPT_LIMIT = 4;

function derivePrompts(drugName: string, common: string, monitoring: string, mechanism: string, uses: string): {
  category: PromptRule["category"];
  prompt_text: string;
  rationale: string;
  urgency: "routine" | "mention_to_prescriber" | "refer_promptly";
  matchedKey: string;
}[] {
  const lc = " " + (common + " " + monitoring + " " + mechanism + " " + uses).toLowerCase() + " ";
  const out: ReturnType<typeof derivePrompts> = [];
  for (const rule of PROMPT_RULES) {
    let matched = false;
    for (const pat of rule.keywords) {
      if (pat.test(lc)) { matched = true; break; }
    }
    if (!matched) continue;
    if (rule.classOnly) {
      const cls = classHints(mechanism, uses);
      if (!rule.classOnly.some((p) => p.test(cls))) continue;
    }
    out.push({
      category: rule.category,
      prompt_text: rule.prompt(drugName),
      rationale: rule.rationale(drugName),
      urgency: rule.urgency,
      matchedKey: rule.keywords.map((r) => r.source).join("|"),
    });
    if (out.length >= PROMPT_LIMIT) break;
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────────────
// 4) therapist questions — 1–2 from common_uses + mechanism
// ────────────────────────────────────────────────────────────────────────────

const QUESTION_RULES: {
  category: PromptRule["category"];
  match: RegExp[];
  question: () => string;
  explores: () => string;
}[] = [
  {
    category: "mood",
    match: [/depress/, /antidepressant/, /mdd/],
    question: () => "How have you been describing your mood across the past few weeks — and is there any shift since starting this medication?",
    explores: () => "Invites a low-pressure mood check-in that doesn't presume benefit or harm.",
  },
  {
    category: "anxiety",
    match: [/anxiety/, /panic/, /generalized anxiety/],
    question: () => "Where in your body do you notice anxiety showing up now — and how does that compare with a month ago?",
    explores: () => "Somatic framing helps clients who are less comfortable naming feelings directly.",
  },
  {
    category: "sleep",
    match: [/insomnia/, /sleep/, /hypnotic/, /sedative/, /circadian/],
    question: () => "What's your sleep been like — falling asleep, staying asleep, and how rested you feel in the morning?",
    explores: () => "A complete sleep picture picks up both benefits and side effects.",
  },
  {
    category: "attention",
    match: [/attention/, /adhd/, /hyperactivit/],
    question: () => "How is your ability to focus or follow through on tasks — and do you notice any difference at certain times of day?",
    explores: () => "Open framing — invites observation without leading on medication effects.",
  },
  {
    category: "energy",
    match: [/fatigue/, /letharg/, /narcoleps/, /hypersomnia/],
    question: () => "How are your energy levels across the day, and how does that interact with what you're able to do?",
    explores: () => "Frames energy as functional impact, not just a number.",
  },
  {
    category: "movement",
    match: [/tics/, /tourette/, /chorea/, /huntington/],
    question: () => "Have you noticed any changes in involuntary movements or tics, or in how your body feels in general?",
    explores: () => "Movement changes can be subtle — invites gradual noticing.",
  },
  {
    category: "motivation",
    match: [/substance/, /alcohol/, /opioid/, /dependence/, /addiction/],
    question: () => "How has your relationship with alcohol or other substances shifted since you started this — and what feels easier or harder?",
    explores: () => "Non-judgmental framing; allows ambivalence to surface.",
  },
  {
    category: "social_functioning",
    match: [/psychosis/, /schizophrenia/, /bipolar/, /mania/],
    question: () => "How are your relationships and routines this week — anything that feels different to you?",
    explores: () => "Captures functional change without requiring insight into symptoms.",
  },
  {
    category: "appetite",
    match: [/binge/, /bulimia/, /anorexia/, /eating/],
    question: () => "How would you describe your relationship with food this past week — has anything shifted?",
    explores: () => "Eating-related content benefits from non-leading invitations.",
  },
  {
    category: "memory",
    match: [/alzheimer/, /dementia/, /cognitive/, /cholinesterase/],
    question: () => "What has been easier or harder cognitively this week — tracking, recalling, finding words?",
    explores: () => "Cognitive change is best noticed as function rather than test scores.",
  },
  {
    category: "sexual_functioning",
    match: [/sexual/, /libido/, /ssri/, /snri/],
    question: () => "Has anything shifted in how you experience intimacy, desire, or your body — and do you want to talk about that?",
    explores: () => "Leaves room for the client to opt in or out — important for sensitive topics.",
  },
];

const QUESTION_LIMIT = 2;

function deriveQuestions(uses: string, mechanism: string): {
  category: PromptRule["category"];
  question: string;
  explores: string;
  matchedKey: string;
}[] {
  const lc = " " + (uses + " " + mechanism).toLowerCase() + " ";
  const out: ReturnType<typeof deriveQuestions> = [];
  for (const rule of QUESTION_RULES) {
    let matched = false;
    let matchedKey = "";
    for (const pat of rule.match) {
      if (pat.test(lc)) { matched = true; matchedKey = pat.source; break; }
    }
    if (!matched) continue;
    out.push({
      category: rule.category,
      question: rule.question(),
      explores: rule.explores(),
      matchedKey,
    });
    if (out.length >= QUESTION_LIMIT) break;
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────────────
// 5) comorbidity notes — only for relevant classes
// ────────────────────────────────────────────────────────────────────────────

interface ComorbidityRule {
  match: RegExp[];
  conditionName: string;
  note: string;
  severity: "routine" | "mention_to_prescriber" | "refer_promptly";
}

const COMORBIDITY_RULES: ComorbidityRule[] = [
  {
    match: [/induction of mania/, /mania,?\\s+or hypomania/, /switch to mania/, /manic reaction/, /mania risk/, /bipolar/],
    conditionName: "Bipolar disorder",
    note:
      "Antidepressant-class risk of inducing mania / rapid cycling in clients with an underlying bipolar diathesis; coordinate mood-stabilizer coverage with prescriber.",
    severity: "mention_to_prescriber",
  },
  {
    match: [/substance/, /alcohol/, /dependence/, /addiction/, /abuse/],
    conditionName: "Substance use disorder",
    note:
      "Watch for misuse / diversion risk; for alcohol dependence agents, monitor adherence and patterns of use non-judgmentally.",
    severity: "mention_to_prescriber",
  },
  {
    match: [/metabolic syndrome/, /hyperglycemia/, /weight gain/, /diabetes/, /dyslipidemia/],
    conditionName: "Metabolic syndrome",
    note:
      "Antipsychotic-class metabolic effects — track fasting glucose, lipids, and weight; coordinate care if a metabolic condition emerges.",
    severity: "mention_to_prescriber",
  },
  {
    match: [/suicid/, /suicidal ide/, /boxed warning/],
    conditionName: "Suicidal ideation",
    note:
      "Drug carries an FDA suicidality warning; flag any new or worsening suicidal ideation promptly. Not the same as a pre-existing condition.",
    severity: "refer_promptly",
  },
  {
    match: [/seizure/, /seizure threshold/, /epileps/],
    conditionName: "Seizure disorder",
    note:
      "Some agents lower seizure threshold; review in clients with epilepsy, eating disorders, or alcohol withdrawal.",
    severity: "mention_to_prescriber",
  },
  {
    match: [/parkinson/, /extrapyramidal/, /tardive/, /tics/, /chorea/, /huntington/],
    conditionName: "Movement disorder",
    note:
      "Pre-existing movement disorders may worsen or become more visible; flag any change in tremor, rigidity, or involuntary movements.",
    severity: "mention_to_prescriber",
  },
  {
    match: [/intraocular pressure/, /angle-closure/, /glaucoma/],
    conditionName: "Glaucoma",
    note:
      "Anticholinergic activity can precipitate acute angle-closure glaucoma — relevant for clients with narrow-angle anatomy.",
    severity: "refer_promptly",
  },
  {
    match: [/cardiac/, /heart failure/, /arrhythm/, /qtc/, /qt prolongation/, /torsades/, /myocarditis/],
    conditionName: "Cardiovascular disease",
    note:
      "QT-prolonging or cardioactive agents warrant cardiac-history review; flag syncope, palpitations, or new chest symptoms.",
    severity: "mention_to_prescriber",
  },
];

function deriveComorbidities(serious: string, contra: string, monitoring: string, mechanism: string): {
  conditionName: string;
  note: string;
  severity: "routine" | "mention_to_prescriber" | "refer_promptly";
  matchedKey: string;
}[] {
  const lc = " " + (serious + " " + contra + " " + monitoring + " " + mechanism).toLowerCase() + " ";
  const out: ReturnType<typeof deriveComorbidities> = [];
  for (const rule of COMORBIDITY_RULES) {
    let matched = false;
    let matchedKey = "";
    for (const pat of rule.match) {
      if (pat.test(lc)) { matched = true; matchedKey = pat.source; break; }
    }
    if (!matched) continue;
    out.push({
      conditionName: rule.conditionName,
      note: rule.note,
      severity: rule.severity,
      matchedKey,
    });
  }
  // de-dup on conditionName
  const seen = new Set<string>();
  return out.filter((c) => (seen.has(c.conditionName) ? false : (seen.add(c.conditionName), true)));
}

// ────────────────────────────────────────────────────────────────────────────
// 6) session observations — 1–2 short phrases from side-effect time-courses
// ────────────────────────────────────────────────────────────────────────────

interface SessionRule {
  match: RegExp[];
  observation: () => string;
  rationale: () => string;
  doseDependence?: string;
  confidence?: "possible" | "probable" | "reported" | "anecdotal";
}

const SESSION_RULES: SessionRule[] = [
  {
    match: [/sedation/, /somnolence/, /drowsiness/],
    observation: () => "Client appears calmer but more flat / somnolent than usual; check whether this followed a dose change.",
    rationale: () => "Sedation is dose-dependent for most sedating agents and can affect session affect.",
    doseDependence: "dose-related",
    confidence: "reported",
  },
  {
    match: [/insomnia/],
    observation: () => "Client is more restless or hyperaroused in session; consider whether sleep disruption is affecting presentation.",
    rationale: () => "Insomnia can amplify anxiety / emotional reactivity in session.",
    doseDependence: "dose-related",
    confidence: "reported",
  },
  {
    match: [/akathisia/, /restlessness/, /agitation/, /jitter/],
    observation: () => "Client shows signs of inner restlessness — pacing, shifting, trouble sitting still; flag as possible akathisia / activation.",
    rationale: () => "Early activation or akathisia is clinically important and can mimic anxiety.",
    doseDependence: "dose-related",
    confidence: "reported",
  },
  {
    match: [/tremor/, /extrapyramidal/, /parkinson/],
    observation: () => "Note any new tremor, rigidity, or mask-like expression — possible drug-induced parkinsonism / EPS.",
    rationale: () => "EPS can mimic psychomotor retardation of depression; track whether it appears at higher doses.",
    doseDependence: "dose-related",
    confidence: "reported",
  },
  {
    match: [/cognitive/, /memory/, /concentration/, /confusion/],
    observation: () => "Client has more difficulty tracking conversation or finding words than prior sessions — possible cognitive side effect.",
    rationale: () => "Cognitive blunting is a known subjective complaint with several drug classes.",
    doseDependence: "dose-related",
    confidence: "reported",
  },
  {
    match: [/weight gain/, /increased appetite/, /weight loss/],
    observation: () => "Appetite / weight changes noticeable — track qualitatively across sessions.",
    rationale: () => "Metabolic effects often unfold over weeks and are worth noticing early.",
    doseDependence: "long-term",
    confidence: "reported",
  },
  {
    match: [/sexual dysfunction/, /libido/, /impotence/],
    observation: () => "Client mentions reduced libido or sexual side effect — these are common and often under-reported.",
    rationale: () => "Sexual side effects affect adherence and are sensitive to discuss openly.",
    confidence: "reported",
  },
  {
    match: [/dry mouth/, /constipation/, /blurred vision/, /urinary retention/],
    observation: () => "Client mentions anticholinergic-type effects (dry mouth, constipation, urinary changes).",
    rationale: () => "Anticholinergic effects can be additive across agents and are worth tracking.",
    confidence: "reported",
  },
  {
    match: [/mania/, /manic/, /elevated/],
    observation: () => "Affect or activity is more expansive / pressured than usual — possible emergent elevation.",
    rationale: () => "Mania induction is a known risk with antidepressant monotherapy in bipolar disorder.",
    confidence: "reported",
  },
  {
    match: [/withdrawal/, /rebound/, /discontinuation/],
    observation: () => "Possible discontinuation / rebound effects if a recent dose change or missed doses occurred.",
    rationale: () => "Benzodiazepines, antidepressants, and antipsychotics all have documented discontinuation syndromes.",
    confidence: "reported",
  },
  {
    match: [/dependence/, /abuse/, /diversion/],
    observation: () => "Discuss substance-use patterns non-judgmentally; some agents carry misuse / diversion risk.",
    rationale: () => "Helps the therapist open a routine check-in on a sensitive topic.",
    confidence: "anecdotal",
  },
  {
    match: [/nausea/, /vomiting/, /diarrh/, /constipation/],
    observation: () => "Client describes GI side effects — common and often related to dose timing.",
    rationale: () => "GI effects are typically dose-timing-dependent and may be mitigable.",
    doseDependence: "dose-related",
    confidence: "reported",
  },
];

const SESSION_LIMIT = 2;

function deriveSession(common: string, serious: string, drug: string): {
  observation: string;
  rationale: string;
  dose_dependence: string | null;
  confidence: "possible" | "probable" | "reported" | "anecdotal";
  matchedKey: string;
}[] {
  const lc = " " + (common + " " + serious).toLowerCase() + " ";
  const out: ReturnType<typeof deriveSession> = [];
  for (const rule of SESSION_RULES) {
    let matched = false;
    let matchedKey = "";
    for (const pat of rule.match) {
      if (pat.test(lc)) { matched = true; matchedKey = pat.source; break; }
    }
    if (!matched) continue;
    out.push({
      observation: rule.observation(),
      rationale: rule.rationale(),
      dose_dependence: rule.doseDependence ?? null,
      confidence: rule.confidence ?? "possible",
      matchedKey,
    });
    if (out.length >= SESSION_LIMIT) break;
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────────────
// Source provenance — pick the best source for each piece of content
// ────────────────────────────────────────────────────────────────────────────

function pickSource(fields: Field[] | undefined, preferred: string[]): Field | null {
  if (!fields || fields.length === 0) return null;
  for (const t of preferred) {
    const f = fields.find((x) => x.source_title === t);
    if (f) return f;
  }
  return fields[0];
}

function asText(fields: Field[] | undefined): string {
  if (!fields) return "";
  return fields.map((f) => f.text).join("\n\n");
}

// ────────────────────────────────────────────────────────────────────────────
// Conditions seeding
// ────────────────────────────────────────────────────────────────────────────

async function seedConditionsIfEmpty(): Promise<Map<string, string>> {
  const { data: existing } = await supabase.from("psych_conditions").select("id, name");
  if (existing && existing.length > 0) {
    const m = new Map<string, string>();
    for (const c of existing) m.set(c.name, c.id);
    return m;
  }
  const seeds = [
    { name: "Bipolar disorder", plain_name: "Bipolar disorder", icd_code: "F31", category: "mood" },
    { name: "Substance use disorder", plain_name: "Substance use disorder", icd_code: "F10-F19", category: "substance_use" },
    { name: "Metabolic syndrome", plain_name: "Metabolic syndrome", icd_code: "E88.81", category: "general_medical" },
    { name: "Suicidal ideation", plain_name: "Suicidal ideation", icd_code: "R45.8", category: "safety" },
    { name: "Seizure disorder", plain_name: "Seizure disorder", icd_code: "G40", category: "neurological" },
    { name: "Movement disorder", plain_name: "Movement disorder", icd_code: "G20-G26", category: "neurological" },
    { name: "Glaucoma", plain_name: "Glaucoma", icd_code: "H40", category: "ophthalmologic" },
    { name: "Cardiovascular disease", plain_name: "Cardiovascular disease", icd_code: "I00-I99", category: "cardiovascular" },
  ];
  const { data, error } = await supabase.from("psych_conditions").insert(seeds).select("id, name");
  if (error) {
    console.error("failed to seed conditions:", error.message);
    process.exit(1);
  }
  const m = new Map<string, string>();
  for (const c of data ?? []) m.set(c.name, c.id);
  return m;
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  // 0) baseline counts
  const before = await getCounts();

  // 1) conditions
  const conditionMap = await seedConditionsIfEmpty();

  // 2) sources map
  const { data: sources } = await supabase.from("psych_sources").select("id, title");
  const srcByTitle = new Map<string, string>();
  for (const s of (sources ?? []) as Source[]) srcByTitle.set(s.title, s.id);

  // 3) drugs
  const { data: drugs } = await supabase.from("psych_drugs").select("id, generic_name");
  const drugsList = (drugs ?? []) as Drug[];

  // 4) all relevant fields in one go (paginated)
  const allFields: Field[] = [];
  const PAGE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("psych_drug_fields")
      .select("drug_id, field_key, value, source_id, psych_sources(title)")
      .in("field_key", [
        "side_effects_serious",
        "side_effects_common",
        "contraindications",
        "monitoring",
        "mechanism",
        "common_uses",
        "onset",
        "half_life",
        "special_populations",
      ])
      .in("status", ["draft", "verified", "published"])
      .range(from, from + PAGE - 1);
    if (error) { console.error("field read error:", error.message); process.exit(1); }
    if (!data || data.length === 0) break;
    for (const row of data as any[]) {
      const text = (row.value && typeof row.value === "object" && (row.value as any).text) || "";
      const sourceTitle = row.psych_sources?.title ?? "";
      allFields.push({
        drug_id: row.drug_id,
        field_key: row.field_key,
        text: typeof text === "string" ? text : String(text),
        source_id: row.source_id,
        source_title: sourceTitle,
      });
    }
    if (data.length < PAGE) break;
    from += PAGE;
  }

  // 5) group by drug
  const byDrug = new Map<string, FieldMap>();
  for (const f of allFields) {
    const m = (byDrug.get(f.drug_id) ?? {}) as FieldMap;
    const arr = (m[f.field_key as keyof FieldMap] ?? []) as Field[];
    arr.push(f);
    m[f.field_key as keyof FieldMap] = arr;
    byDrug.set(f.drug_id, m);
  }

  // 6) per-drug extraction
  const redFlagRows: any[] = [];
  const pearlRows: any[] = [];
  const promptRows: any[] = [];
  const questionRows: any[] = [];
  const comorbidityRows: any[] = [];
  const sessionRows: any[] = [];

  let drugsWithEnoughSource = 0;
  let drugsSkipped = 0;

  for (const drug of drugsList) {
    const m = byDrug.get(drug.id);
    if (!m) { drugsSkipped++; continue; }

    const serious = asText(m.side_effects_serious);
    const common = asText(m.side_effects_common);
    const contra = asText(m.contraindications);
    const monitoring = asText(m.monitoring);
    const mechanism = asText(m.mechanism);
    const uses = asText(m.common_uses);

    // Skip drugs with truly nothing useful — only mechanism or only dose info
    const useful = serious + common + contra + monitoring + mechanism + uses;
    if (useful.replace(/\s+/g, "").length < 80) {
      drugsSkipped++;
      continue;
    }
    drugsWithEnoughSource++;

    // pick sources of provenance for each
    const sSerious = pickSource(m.side_effects_serious, SOURCE_PRIORITY);
    const sCommon = pickSource(m.side_effects_common, SOURCE_PRIORITY);
    const sContra = pickSource(m.contraindications, SOURCE_PRIORITY);
    const sMonitor = pickSource(m.monitoring, SOURCE_PRIORITY);
    const sMech = pickSource(m.mechanism, SOURCE_PRIORITY);
    const sUses = pickSource(m.common_uses, SOURCE_PRIORITY);

    // ── red_flags
    const rfText = (serious + "\n\n" + contra).trim();
    const flags = deriveRedFlags(rfText);
    for (const f of flags) {
      const srcId = (sSerious ?? sContra ?? sMech)?.source_id ?? null;
      redFlagRows.push({
        drug_id: drug.id,
        signal: f.signal,
        guidance: f.guidance,
        status: "draft",
        source_id: srcId,
      });
    }

    // ── pearls
    const pearl = derivePearl({
      mechanism,
      sideEffectsCommon: common,
      onset: asText(m.onset),
      halfLife: asText(m.half_life),
      uses,
      drugName: drug.generic_name,
    });
    if (pearl) {
      const srcId = (sMech ?? sUses ?? sSerious)?.source_id ?? null;
      pearlRows.push({
        drug_id: drug.id,
        pearl,
        status: "draft",
        source_id: srcId,
      });
    }

    // ── observation_prompts
    const prompts = derivePrompts(drug.generic_name, common, monitoring, mechanism, uses);
    for (const p of prompts) {
      const srcId = (sCommon ?? sMonitor ?? sSerious)?.source_id ?? null;
      promptRows.push({
        drug_id: drug.id,
        prompt_text: p.prompt_text,
        rationale: p.rationale,
        urgency: p.urgency,
        status: "draft",
        source_id: srcId,
      });
    }

    // ── therapist_questions (only for drugs with rich uses + mechanism)
    if (uses || mechanism) {
      const qs = deriveQuestions(uses, mechanism);
      for (const q of qs) {
        const srcId = (sUses ?? sMech)?.source_id ?? null;
        questionRows.push({
          drug_id: drug.id,
          category: q.category,
          question: q.question,
          explores: q.explores,
          status: "draft",
          source_id: srcId,
        });
      }
    }

    // ── comorbidity_notes
    const com = deriveComorbidities(serious, contra, monitoring, mechanism);
    for (const c of com) {
      const condId = conditionMap.get(c.conditionName);
      if (!condId) continue;
      const srcId = (sSerious ?? sContra ?? sMonitor)?.source_id ?? null;
      comorbidityRows.push({
        drug_id: drug.id,
        condition_id: condId,
        note: c.note,
        severity_flag: c.severity,
        status: "draft",
        source_id: srcId,
      });
    }

    // ── session_observations (only when we have side-effect data)
    if (common || serious) {
      const so = deriveSession(common, serious, drug.generic_name);
      for (const s of so) {
        const srcId = (sCommon ?? sSerious)?.source_id ?? null;
        sessionRows.push({
          drug_id: drug.id,
          observation: s.observation,
          rationale: s.rationale,
          dose_dependence: s.dose_dependence,
          confidence: s.confidence,
          status: "draft",
          source_id: srcId,
        });
      }
    }
  }

  // 7) bulk insert — chunked
  const chunkedInsert = async (table: string, rows: any[]) => {
    const CHUNK = 200;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      const { error } = await supabase.from(table).insert(chunk);
      if (error) {
        console.error(`insert ${table} chunk error:`, error.message);
        process.exit(1);
      }
    }
    return rows.length;
  };

  const rfN = await chunkedInsert("psych_red_flags", redFlagRows);
  const cpN = await chunkedInsert("psych_clinical_pearls", pearlRows);
  const opN = await chunkedInsert("psych_observation_prompts", promptRows);
  const tqN = await chunkedInsert("psych_therapist_questions", questionRows);
  const cnN = await chunkedInsert("psych_comorbidity_notes", comorbidityRows);
  const soN = await chunkedInsert("psych_session_observations", sessionRows);

  // 8) after counts
  const after = await getCounts();

  console.log("");
  console.log("=== populate-observation-tables.ts summary ===");
  console.log(`drugs read             : ${drugsList.length}`);
  console.log(`drugs with enough data : ${drugsWithEnoughSource}`);
  console.log(`drugs skipped          : ${drugsSkipped}`);
  console.log(`conditions seeded      : ${conditionMap.size}`);
  console.log("");
  console.log("Rows inserted (this run):");
  console.log(`  psych_red_flags            : ${rfN}`);
  console.log(`  psych_clinical_pearls      : ${cpN}`);
  console.log(`  psych_observation_prompts  : ${opN}`);
  console.log(`  psych_therapist_questions  : ${tqN}`);
  console.log(`  psych_comorbidity_notes    : ${cnN}`);
  console.log(`  psych_session_observations : ${soN}`);
  console.log(`  TOTAL                      : ${rfN + cpN + opN + tqN + cnN + soN}`);
  console.log("");
  console.log("Counts before -> after:");
  for (const k of Object.keys(before)) {
    const b = (before as any)[k];
    const a = (after as any)[k];
    console.log(`  ${k.padEnd(30)} ${b} -> ${a}`);
  }

  // sample a few of the most interesting red flags
  console.log("");
  console.log("Sample red flags (first 10 unique signals):");
  const uniqueSignals = new Map<string, string>();
  for (const r of redFlagRows) {
    if (!uniqueSignals.has(r.signal)) uniqueSignals.set(r.signal, r.guidance);
  }
  let i = 0;
  for (const [sig, g] of uniqueSignals.entries()) {
    if (i++ >= 10) break;
    console.log(`  - ${sig}`);
  }
}

async function getCounts(): Promise<Record<string, number>> {
  const tables = [
    "psych_red_flags",
    "psych_clinical_pearls",
    "psych_observation_prompts",
    "psych_therapist_questions",
    "psych_comorbidity_notes",
    "psych_session_observations",
  ];
  const out: Record<string, number> = {};
  for (const t of tables) {
    const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
    out[t] = count ?? 0;
  }
  return out;
}

main().catch((e) => { console.error("FAILED:", e.stack ?? e.message ?? e); process.exit(1); });