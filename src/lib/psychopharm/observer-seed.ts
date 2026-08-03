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

/**
 * Red flags (Part 9) — "encourage the client to discuss with their prescribing
 * clinician". NOT emergency advice. Source-anchored per class.
 */
export const RED_FLAGS = [
  {
    class: "All classes",
    flags: [
      { signal: "Sudden severe restlessness (unable to sit still)", guidance: "Encourage the client to discuss with their prescriber — akathisia can be mistaken for agitation." },
      { signal: "New involuntary movements (facial, tongue, limbs)", guidance: "Encourage discussion with the prescriber; longer-term movement effects are watched for." },
      { signal: "Rapid or unusual mood change", guidance: "Encourage discussion; mood shifts with a new or changed medication should be reviewed." },
      { signal: "Confusion or marked disorientation", guidance: "Encourage the client to raise it promptly with the prescriber." },
      { signal: "New falls or unsteadiness", guidance: "Sedation/coordination effects can raise fall risk, especially in older adults — discuss." },
    ],
    source: "stahl_pg_7th",
  },
  {
    class: "Benzodiazepine",
    flags: [
      { signal: "Persistent excessive sedation or slowed breathing", guidance: "This combination warrants prompt discussion with the prescriber." },
    ],
    source: "stahl_pg_7th",
  },
];

/** Clinical pearls (Part 11) — from the sources. */
export const CLINICAL_PEARLS = [
  {
    class: "SSRI",
    pearls: [
      "Patients may describe sexual side effects in everyday language rather than medical terms — ask directly.",
      "The benefits of an antidepressant are often not obvious to the client early on; several weeks is normal.",
      "Clients sometimes confuse the medicine's effects (early activation, drowsiness) with worsening of their symptoms.",
    ],
    source: "stahl_pg_7th",
  },
  {
    class: "Antipsychotic",
    pearls: [
      "Restlessness (akathisia) from antipsychotics is frequently mistaken for anxiety — the distinction matters.",
      "Prolactin-related changes, e.g. menstrual or breast changes, are rarely volunteered unless asked.",
    ],
    source: "stahl_pg_7th",
  },
];

/**
 * Medication timeline (Part 3) — educational stages, no treatment instructions.
 */
export const TIMELINE_STAGES = [
  { stage_type: "start", label: "Medication started", note: "The onset of effect and of early side effects varies by drug and dose." },
  { stage_type: "early", label: "Possible early changes", note: "Early sedation or activation can appear in the first days; some effects take weeks." },
  { stage_type: "adaptation", label: "Expected adaptation period", note: "The body typically adapts over the first weeks; early side effects often ease." },
  { stage_type: "long_term", label: "Long-term observations", note: "Stable effects, and any watch-items, are observed over months." },
  { stage_type: "common_observations", label: "Things psychology students commonly notice", note: "Affect, energy, sleep, restlessness, and reported appetite." },
];