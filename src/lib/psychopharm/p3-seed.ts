/**
 * P3 seed data — observer sub-tables: observation checklist (Part 4),
 * case-formulation notes (Part 6), therapy-planning (Part 8), vignettes
 * (Part 10). All "may"/educational, source-anchored, reviewer-gated.
 */
import { sourceTitle } from "./sources";

/** Part 4 — a psychologist's in-session observation checklist. */
export const OBSERVATION_CHECKLIST = [
  { item: "Eye contact", item_category: "engagement", explanation: "Changes can accompany sedation, activation, or social-discomfort effects of medication." },
  { item: "Speech speed", item_category: "psychomotor", explanation: "Slowing may reflect sedation or a psychomotor effect; speeding may be activation." },
  { item: "Affect", item_category: "mood", explanation: "Flattening or lability can shift with some medicines; note the baseline." },
  { item: "Psychomotor slowing", item_category: "psychomotor", explanation: "Look for slow movement or delayed replies; relevant to antipsychotics/benzodiazepines." },
  { item: "Restlessness (can't sit still)", item_category: "psychomotor", explanation: "May be akathisia — distinct from anxiety; tell the prescriber." },
  { item: "Tremor / stiffness", item_category: "motor", explanation: "Extrapyramidal signs with antipsychotics; mention to the prescriber." },
  { item: "Weight change (reported)", item_category: "metabolic", explanation: "Many psychotropics can change weight/appetite; track over time." },
  { item: "Sleep quality", item_category: "sleep", explanation: "Sedating vs activating medicines change sleep timing and depth." },
  { item: "Appetite", item_category: "appetite", explanation: "Some medicines raise appetite markedly; others cut it." },
  { item: "Concentration", item_category: "cognitive", explanation: "Sedation or cognitive effects can reduce focus mid-session." },
  { item: "Motivation", item_category: "motivation", explanation: "Low motivation can be a symptom, but also a medication effect." },
];

/** Part 6 — case-formulation friendly framing. */
export const CASE_FORMULATION = [
  {
    note: "When building a case formulation, consider whether an observation could also be influenced by medication — not as the cause, but as a contributor.",
    example: "A client appears emotionally flat. That may be the presentation of depression, or it may be a medication effect, or both. Frame it as a question, not a conclusion.",
    class: "Antipsychotic",
  },
  {
    note: "Consider whether reduced energy in a formulation reflects the drug's sedation rather than a separate symptom.",
    example: "A drowsy, slow client on a sedating medicine may not have 'lost motivation' — the dose may be doing it.",
    class: "Benzodiazepine",
  },
  {
    note: "Consider whether sleep or appetite change lines up with a dose change, as that is a medication signal, not necessarily a relapse.",
    example: "Weight gain that began with a new prescription is worth naming in formulation as a possible medication effect.",
    class: "Antidepressant (SSRI/SNRI)",
  },
];

/** Part 8 — therapy-planning considerations (always "may", never "will"). */
export const THERAPY_PLANNING = [
  { therapy_type: "exposure", consideration: "Sedation may reduce participation, so plan shorter or lower-arousal exposure steps." },
  { therapy_type: "cbt", consideration: "Reduced concentration may require shorter, more concrete exercises and more breaks." },
  { therapy_type: "dbt", consideration: "Memory difficulties may make written/mindfulness homework more concrete and repeated." },
  { therapy_type: "trauma", consideration: "Fatigue during trauma work may force a slower pacing and more stabilisation." },
  { therapy_type: "counselling", consideration: "Early sedation/activation may affect engagement; offer a lower-intensity opening." },
];

/** Part 10 — illustrative vignettes (flagged as illustrative, never new claims). */
export const VIGNETTES = [
  {
    drug_class: "SSRI",
    scenario: "A client on an SSRI says they feel 'more on edge' since starting, and sex has changed.",
    expected: ["Possible early activation before the therapeutic effect builds", "Possible sexual side effect — ask directly"],
    explanation: "Early activation and sexual effects are common SSRIs; they are distinct from the client's original complaint.",
  },
  {
    drug_class: "Antipsychotic",
    scenario: "A client on an antipsychotic appears restless and can't sit through a long session.",
    expected: ["Possible akathisia — can look like anxiety or agitation"],
    explanation: "Akathisia is a movement-effect worth naming; the prescriber decides any change.",
  },
  {
    drug_class: "Benzodiazepine",
    scenario: "A client reports feeling 'slow-brained' and drowsy since a dose increase.",
    expected: ["Sedation effects on speed and memory"],
    explanation: "Benzodiazepines are brakes; the dose change may explain the sedation.",
  },
];

export function p3CitesFor(source: string) {
  return sourceTitle(source);
}