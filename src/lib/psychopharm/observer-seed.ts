/**
 * Observer-layer seed — Phase 2 (Parts 1–11).
 *
 * Two separate annotated SHOULD-be-generated sets. Provides the durable schema
 * for the observer tables.
 *
 * Every observation nonetheless obeys the "may contribute to" rule, keeps its
 * source + page, and is reviewer-gated. This is the educational observational
 * layer for psychology students: observations, therapist questions, checklist,
 * timeline, formulation, red flags, pearls. Nothing here is a prescription.
 *
 * The content below is deliberately small and is EXPLICITLY a scaffold to pin
 * the schema and the language discipline. Full per-drug content is authored in
 * the drug-scoped drafts, not this file — this file holds the CROSS-DRUG
 * (class-level) observations that apply to many bands and drugs at once.
 */

import { sourceTitle } from "./sources";

/** Class-level session observations (F1). "may contribute to" phrasing only. */
export const CLASS_OBSERVATIONS = [
  {
    class: "Benzodiazepine",
    observations: [
      {
        observation:
          "A client may appear drowsier, or calmer than their symptoms alone might predict.",
        confidence: "possible" as const,
        dose_dependence: "more likely at initiation or when the dose is raised",
        rationale:
          "Benzodiazepines enhance GABA; sedation is a shared class finding especially early in use or on dose increase.",
        source_id: "stahl_pg_7th",
      },
      {
        observation:
          "A client may speak or react slightly more slowly as sedation settles.",
        confidence: "possible" as const,
        dose_dependence: "low-dose effect; usually eases with continued use",
        rationale: "Sedation slows reaction time and speech; acuity of affect may look flatter.",
        source_id: "stahl_pg_7th",
      },
    ],
  },
  {
    class: "SSRI",
    observations: [
      {
        observation:
          "A client may feel a little more activated or restless early in treatment.",
        confidence: "possible" as const,
        dose_dependence: "usually early in treatment / at initiation",
        rationale:
          "SSRIs can transiently increase activation and anxiety before the therapeutic effect builds.",
        source_id: "stahl_pg_7th",
      },
      {
        observation:
          "A client may be reluctant to talk about sexual side effects unless asked directly.",
        confidence: "reported" as const,
        dose_dependence: "dose-dependent in some",
        rationale: "SSRIs frequently affect desire/erection/ejaculation; rarely volunteered.",
        source_id: "stahl_pg_7th",
      },
    ],
  },
];

/** Class-level therapist-question catalog (Part 2), cross-psych class. */
export const TherapistQuestions = [
  {
    category: "sleep" as const,
    question:
      "Has your sleep changed since you started the medicine — falling asleep, staying asleep, vivid dreams?",
    explores: "Whether sleep effects began with, or shifted with, the medication.",
    source_id: "stahl_pg_7th",
  },
  {
    category: "energy" as const,
    question: "Do you feel more tired during the day since the dose, or is the energy the same?",
    explores: "sedation vs a baseline energy problem.",
    source_id: "stahl_pg_7th",
  },
  {
    category: "movement" as const,
    question:
      "Any stiffness in your arms or legs, or a feeling you can’t sit still?",
    explores: "extrapyramidal / akathisia; often misred as anxiety.",
    source_id: "stahl_pg_7th",
  },
  {
    category: "anxiety" as const,
    question:
      "Has the worry eased, or is there a new restlessness you didn’t have before?",
    explores: "differentiating benefit from akathisia-driven anxiety.",
    source_id: "stahl_pg_7th",
  },
  {
    category: "attention" as const,
    question: "How has your concentration been in sessions or at work?",
    explores: "attention / sedation; passes the 'obanal' bar.",
    source_id: "stahl_pg_7th",
  },
  {
    category: "mood" as const,
    question: "Compared with last week, how is your mood overall?",
    explores: "mood tracking separate from sedation.",
    source_id: "stahl_pg_7th",
  },
  {
    category: "memory" as const,
    question: "Any trouble remembering words or recent things since the change?",
    explores: "BZ-associated memory effect / consolidation.",
    source_id: "stahl_pg_7th",
  },
  {
    category: "sexual_functioning" as const,
    question: "Has this medicine changed anything for you, sexually?",
    explores: "common SSRI/SNRI sexual side effects; rarely volunteered.",
    source_id: "stahl_pg_7th",
  },
  {
    category: "appetite" as const,
    question: "How has your appetite and weight been since starting?",
    explores: "metabolic or appetite shifts.",
    source_id: "stahl_pg_7th",
  },
  {
    category: "motivation" as const,
    question: "Has motivation or interest in things stayed the same?",
    explores: "apathy / motivation, important for therapy engagement.",
    source_id: "stahl_pg_7th",
  },
  {
    category: "social_functioning" as const,
    question: "How comfortable have you felt in social situations this week?",
    explores: "social (dis)inhibition or withdrawal; active awareness of side-effect risk.",
    source_id: "stahl_pg_7th",
  },
];

/** Therapist Q / obs-observation author — a light mapping this script pours into the observer tables. */
export function observerChipsSeeder() {
  return { TherapistQuestions: TherapistQuestions.map((q) => ({ ...q })) };
}

// Standardise the shared caveat.
export const OBSERVER_NOTE =
  "Noticing is in scope. Interpreting or changing the medication is not — that is the prescriber's job.";

export function citesFor(source: string) {
  return `${sourceTitle(source)} (see psych_sources)`;
}