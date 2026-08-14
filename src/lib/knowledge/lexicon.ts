/**
 * Concept lexicon for deterministic knowledge extraction. Every concept has a
 * canonical name + aliases + a type. The extractor matches these against each
 * chunk's text (case-insensitive, word-boundary) and tags the chunk.
 *
 * Sources of truth:
 *   - drugs:   DRUG_CATALOG (74 generic + brand aliases) — reused verbatim
 *   - disorders: DSM-5-TR diagnostic chapter names + key disorder terms
 *   - terms:   a curated set of core clinical constructs that recur in the
 *              corpus (symptoms, mechanisms, therapies, assessment constructs)
 *
 * This is deterministic and $0. A V4-Flash enrichment lane can add deeper /
 * softer concepts later; the lexicon is the offline floor that always works.
 */
import { DRUG_CATALOG } from "../../../scripts/psychopharm/drug-catalog";

export type ConceptType = "drug" | "disorder" | "term";

export interface ConceptEntry {
  name: string;
  type: ConceptType;
  aliases?: string[];
}

/** DSM-5-TR diagnostic chapter titles → disorder concepts. */
const DSM_DISORDERS: ConceptEntry[] = [
  "Autism Spectrum Disorder",
  "Attention-Deficit/Hyperactivity Disorder",
  "Intellectual Disability",
  "Schizophrenia",
  "Schizoaffective Disorder",
  "Delusional Disorder",
  "Bipolar I Disorder",
  "Bipolar II Disorder",
  "Major Depressive Disorder",
  "Persistent Depressive Disorder",
  "Premenstrual Dysphoric Disorder",
  "Panic Disorder",
  "Agoraphobia",
  "Social Anxiety Disorder",
  "Generalized Anxiety Disorder",
  "Separation Anxiety Disorder",
  "Obsessive-Compulsive Disorder",
  "Body Dysmorphic Disorder",
  "Hoarding Disorder",
  "Posttraumatic Stress Disorder",
  "Acute Stress Disorder",
  "Adjustment Disorder",
  "Dissociative Identity Disorder",
  "Dissociative Amnesia",
  "Depersonalization/Derealization Disorder",
  "Somatic Symptom Disorder",
  "Illness Anxiety Disorder",
  "Conversion Disorder",
  "Anorexia Nervosa",
  "Bulimia Nervosa",
  "Binge-Eating Disorder",
  "Insomnia Disorder",
  "Narcolepsy",
  "Obstructive Sleep Apnea",
  "Restless Legs Syndrome",
  "Delirium",
  "Major Neurocognitive Disorder",
  "Alzheimer's Disease",
  "Parkinson's Disease",
  "Huntington's Disease",
  "Vascular Neurocognitive Disorder",
  "Paranoid Personality Disorder",
  "Schizoid Personality Disorder",
  "Borderline Personality Disorder",
  "Antisocial Personality Disorder",
  "Narcissistic Personality Disorder",
  "Avoidant Personality Disorder",
  "Dependent Personality Disorder",
  "Obsessive-Compulsive Personality Disorder",
  "Exhibitionistic Disorder",
  "Fetishistic Disorder",
  "Pedophilic Disorder",
  "Alcohol Use Disorder",
  "Cannabis Use Disorder",
  "Opioid Use Disorder",
  "Stimulant Use Disorder",
  "Sedative Use Disorder",
  "Tobacco Use Disorder",
  "Gambling Disorder",
  "Intermittent Explosive Disorder",
  "Kleptomania",
  "Pyromania",
  "Catatonia",
].map((name) => ({ name, type: "disorder" as ConceptType }));

/** Core clinical constructs — symptoms, mechanisms, therapies, assessments. */
const TERMS: ConceptEntry[] = (
  [
    // Symptoms / signs
    { name: "Delusion", aliases: ["delusions", "delusional"] },
    { name: "Hallucination", aliases: ["hallucinations", "hallucinatory"] },
    { name: "Anhedonia" },
    { name: "Insight", aliases: ["poor insight", "lack of insight"] },
    { name: "Thought disorder", aliases: ["formal thought disorder", "loosening of associations"] },
    { name: "Flight of ideas" },
    { name: "Psychomotor retardation", aliases: ["psychomotor slowing"] },
    { name: "Catatonia", aliases: ["catatonic"] },
    { name: "Akathisia" },
    { name: "Dystonia", aliases: ["dystonic"] },
    { name: "Tardive dyskinesia" },
    { name: "Neuroleptic malignant syndrome", aliases: ["NMS"] },
    { name: "Serotonin syndrome" },
    { name: "Extrapyramidal symptoms", aliases: ["EPS", "extrapyramidal side effects"] },
    // Mechanisms
    { name: "Dopamine hypothesis", aliases: ["dopamine hypothesis of schizophrenia"] },
    { name: "Serotonin reuptake inhibition", aliases: ["SSRI", "selective serotonin reuptake"] },
    { name: "Noradrenergic", aliases: ["norepinephrine reuptake"] },
    { name: "GABA", aliases: ["gamma-aminobutyric acid"] },
    { name: "Glutamatergic", aliases: ["glutamate"] },
    { name: "Cholinergic", aliases: ["acetylcholine"] },
    { name: "Hypothalamic-pituitary-adrenal axis", aliases: ["HPA axis"] },
    // Therapies
    { name: "Cognitive behavioral therapy", aliases: ["CBT", "cognitive behaviour therapy"] },
    { name: "Psychoeducation" },
    { name: "Electroconvulsive therapy", aliases: ["ECT"] },
    { name: "Transcranial magnetic stimulation", aliases: ["TMS"] },
    { name: "Interpersonal therapy", aliases: ["IPT"] },
    { name: "Exposure therapy", aliases: ["exposure and response prevention", "ERP"] },
    { name: "Motivational interviewing" },
    // Assessment
    { name: "Mental status examination", aliases: ["MSE"] },
    { name: "Mini-Mental State Examination", aliases: ["MMSE"] },
    { name: "Montreal Cognitive Assessment", aliases: ["MoCA"] },
    { name: "Hamilton Depression Rating Scale", aliases: ["HAM-D", "Hamilton scale"] },
    { name: "Positive and Negative Syndrome Scale", aliases: ["PANSS"] },
    { name: "Yale-Brown Obsessive Compulsive Scale", aliases: ["Y-BOCS"] },
    { name: "Clinical Global Impression", aliases: ["CGI"] },
    { name: "Structured Clinical Interview", aliases: ["SCID"] },
    { name: "Diagnostic and Statistical Manual", aliases: ["DSM-5", "DSM-5-TR", "DSM-IV"] },
    { name: "International Classification of Diseases", aliases: ["ICD-10", "ICD-11"] },
  ] as Array<{ name: string; aliases?: string[] }>
).map((e) => ({ ...e, type: "term" as ConceptType }));

/** Flatten the drug catalog into concept entries. */
function drugConcepts(): ConceptEntry[] {
  return DRUG_CATALOG.map((d) => ({
    name: d.generic,
    type: "drug" as ConceptType,
    aliases: d.aliases ?? [],
  }));
}

export const CONCEPT_LEXICON: ConceptEntry[] = [
  ...drugConcepts(),
  ...DSM_DISORDERS,
  ...TERMS,
];

/** All search terms for a concept (canonical + aliases), lowercased. */
export function conceptSearchTerms(c: ConceptEntry): string[] {
  return [c.name, ...(c.aliases ?? [])].map((s) => s.toLowerCase());
}
