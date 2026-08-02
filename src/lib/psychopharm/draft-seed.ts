/**
 * Curated draft seed — highest-frequency drugs first.
 *
 * Task bookkeeping:
 *   - clonazepam: passes 8 (002), 9 (b, mono), must reach page "(first dose)"
 *   - Psych 신간 must NOT include a different "schizophrenia dose" per band: the sources
 *     describe a single banded successor range. Spring dependence table C.
 */

import { DrugDraft } from "./draft";

const S = "stahl_pg_7th";
const M = "maudsley_2021";

export const DRAFT_DRUGS: DrugDraft[] = [
  // ---------------------------------------------------------------------------
  // CLONAZEPAM — G1 acceptance target.
  //
  // Band evidence (quote-first):
  //   Stahl 7th p77: panic band 0.5–2 mg/day, max 4 mg/day, start 0.25 mg.
  //   Stahl 7th p77: seizure use, dose dependent, some require >20 mg/day.
  //   Maudsley p136: anxiety band 0.5–3 mg/day — a PARTIAL overlap (rule 2).
  //   Maudsley p463: published equivalence clonazepam 0.5 mg ≈ diazepam 10 mg.
  // The 0.5–2 (Stahl) vs 0.5–3 (Maudsley) is a partial overlap → store union,
  // never average. Dependence/discontinuation risk rises with dose & duration.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Clonazepam",
    drug_class: "Benzodiazepine",
    subclass: "GABA-A positive allosteric modulator (GABA-PAM)",
    brand_names: ["Klonopin", "Rivotril", "Clonotril", "Epitril"],
    aliases: [],
    mechanism: [
      {
        value:
          "Binds to benzodiazepine receptors at the GABA-A ligand-gated chloride channel complex and enhances the inhibitory effects of GABA, boosting chloride conductance and inhibiting neuronal activity in fear circuits.",
        source_id: S,
        page_ref: "p77 (PDF 508)",
        snippet:
          "Binds to benzodiazepine receptors at the GABA-A ligand-gated chloride channel complex. Enhances the inhibitory effects of GABA. Boosts chloride conductance through GABA-regulated channels. Inhibits neuronal activity presumably in amygdala-centered fear circuits.",
        agreement: "single",
      },
    ],
    receptor_targets: [
      {
        value: "GABAA benzodiazepine site (positive allosteric modulator)",
        source_id: S,
        page_ref: "p77 (PDF 508)",
        snippet:
          "Neuroscience-based Nomenclature: GABA positive allosteric modulator (GABA-PAM). Benzodiazepine (anxiolytic, anticonvulsant).",
        agreement: "single",
      },
    ],
    common_uses: [
      {
        value:
          "Panic disorder (with or without agoraphobia); certain seizure types (absence, akinetic, myoclonic; Lennox–Gastaut); adjunctive agent in psychotic and bipolar disorders, and in anxiety disorders alongside SSRIs/SNRIs.",
        source_id: S,
        page_ref: "p77 (PDF 508)",
        snippet:
          "Panic disorder, with or without agoraphobia. Lennox-Gastaut syndrome (petit mal variant). Akinetic seizure. Myoclonic seizure. Absence seizure (petit mal). ... Benzodiazepines are frequently used as augmenting agents for antipsychotics and mood stabilizers... and for SSRIs and SNRIs...",
        agreement: "single",
      },
    ],
    half_life: {
      value: "Long half-life; duration of biological activity is often shorter than the pharmacokinetic terminal half-life.",
      source_id: S,
      page_ref: "p77",
      snippet:
        "Frequency of dosing in practice is often greater than predicted from half-life, as duration of biological activity is often shorter than pharmacokinetic terminal half-life. ... Easier to taper than some other benzodiazepines because of long half-life.",
      agreement: "single",
    },
    onset_time: {
      value: "Some immediate relief with a first dose is common (anxiety); several weeks of daily dosing for maximal therapeutic benefit.",
      source_id: S,
      page_ref: "p77",
      snippet:
        "Some immediate relief with first dosing is common; can take several weeks with daily dosing for maximal therapeutic benefit.",
      agreement: "single",
    },
    side_effects_common: {
      value: "Sedation, fatigue, depression; dizziness, ataxia, slurred speech, weakness; forgetfulness, confusion. Sedation seen at initiation or dose increase and tolerance often develops over time.",
      source_id: S,
      page_ref: "p77",
      snippet:
        "Sedation, fatigue, depression. Dizziness, ataxia, slurred speech, weakness. Forgetfulness, confusion. ... Sedation. Occurs in significant minority. Especially at initiation of treatment or when dose increases. Tolerance often develops over time.",
      agreement: "single",
    },
    side_effects_serious: {
      value:
        "Respiratory depression (especially with CNS depressants / in overdose), rare hepatic or renal dysfunction, blood dyscrasias, hypotension.",
      source_id: S,
      page_ref: "p77",
      snippet:
        "Respiratory depression, especially when taken with CNS depressants in overdose. Rare hepatic dysfunction, renal dysfunction, blood dyscrasias. Grand mal seizures.",
      agreement: "single",
    },
    discontinuation: {
      value:
        "Risk of dependence, especially beyond ~12 weeks and in polysubstance abusers; tapering by 0.25 mg every 3 days (slower above 1.5 mg/day) reduces withdrawal risk; seizure patients may seize on abrupt withdrawal.",
      source_id: S,
      page_ref: "p77",
      snippet:
        "Patients with history of seizures may seize upon withdrawal, especially if abrupt ... Taper by 0.25 mg every 3 days ... after reaching 1.5 mg/day ... by as little as 0.125 mg per week or less.",
      agreement: "single",
    },
    interactions: [
      {
        value:
          "CYP3A4 inhibitors may change clearance (usually no dose change); flumazenil may precipitate seizures in clonazepam-treated seizure patients; combination with valproate may cause absence status; opioids + benzodiazepines raise risk of CNS-depressant/breathing problems.",
        source_id: S,
        page_ref: "p77",
        snippet:
          "Inhibitors of CYP450 3A4 may affect the clearance of clonazepam, but dosage adjustment usually not necessary. Flumazenil ... may precipitate seizures and should not be used in patients treated for seizure disorders... Use of clonazepam with valproate may cause absence status. ... benzodiazepines and opioid medications ... risk of slowed or difficulty breathing.",
        agreement: "single",
      },
    ],
    monitoring: [
      {
        value:
          "Periodic liver tests and blood counts may be prudent in patients with seizure disorders, concomitant medical illness, or multiple chronic medications.",
        source_id: S,
        page_ref: "p77",
        snippet: "In patients with seizure disorders ... periodic liver tests and blood counts may be prudent.",
        agreement: "single",
      },
    ],
    bands: [
      {
        band_order: 1,
        range_low: 0.5,
        range_high: 3,
        unit: "mg",
        frequency: "once daily at bed-time or in divided doses",
        band_label: "Low–typical anxiolytic / panic band",
        primary_purpose: "Panic disorder (with or without agoraphobia)",
        secondary_purposes: ["anxiety reduction", "as need in panic / intermittent anxiety"],
        is_typical_starting: true,
        is_standard_maintenance: true,
        why_this_dose: "Sources give the main panic maintenance range: Stahl 0.5–2 mg/day; Maudsley 0.5–3 mg/day (anxiety). Book-marked as the band most people settle on for panic.",
        what_changes_going_up: "Rates of dependence and withdrawal risk rise as dose and duration rise; above ~2 mg usually for more severe panic or for seizure control.",
        what_changes_going_down: "At 0.25–0.5 mg the calming effect is gentler with less sedation (see band 0 below).",
        onset: {
          value: "Some immediate relief with a first dose; several weeks of daily dosing for maximal benefit.",
          source_id: S,
          page_ref: "p77",
          snippet: "Some immediate relief with first dosing is common; can take several weeks ... for maximal therapeutic benefit.",
          agreement: "single",
        },
        plain_explanation:
          "At this level clonazepam mostly turns the volume down on the brain's alarm system, easing anxiety and panic without (at the low end) heavy sedation.",
        technical_explanation:
          "Positive allosteric modulation at GABAA benzodiazepine sites enhances inhibitory conductance; anxiolytic at 0.5–2 mg/day (Stahl), up to 3 mg/day (Maudsley).",
        side_effects: [
          {
            label: "common",
            items: ["Sedation", "Fatigue", "Dizziness", "Coordination / speech", "Memory fuzziness"],
            time_course: "Sedation more noticeable on first use or dose increase; tolerance to sedation often develops.",
            source: {
              value: "as above",
              source_id: S,
              page_ref: "p77",
              snippet: "Sedation. Occurs in significant minority. Especially at initiation or when dose increases. Tolerance often develops over time.",
              agreement: "single",
            },
          },
          {
            label: "less_common",
            items: ["Dependence liability is dose-and-duration related", "Depression in some"],
            source: {
              value: "as above",
              source_id: S,
              page_ref: "p77",
              snippet: "Risk of dependence may increase with dose and duration of treatment.",
              agreement: "single",
            },
          },
          {
            label: "serious_rare",
            items: ["Respiratory depression (esp. with CNS depressants / overdose)", "Withdrawal seizures if abrupt"],
            source: {
              value: "as above",
              source_id: S,
              page_ref: "p77",
              snippet: "Respiratory depression, especially when taken with CNS depressants in overdose. ... Seizures may rarely occur on withdrawal, especially if abrupt.",
              agreement: "single",
            },
          },
        ],
        observation_prompts: [
          {
            prompt: "After starting (or when the dose changed), have you felt more sleepy or slow please?",
            rationale: "Sedation is a very frequent first-use / dose-increase finding; it usually eases with time.",
            urgency: "routine",
            source: { value: "" as never, source_id: S, page_ref: "p77", snippet: "Sedation ... Occurs in a significant minority. Especially at initiation or when dose increases.", agreement: "single" },
          },
        ],
        population_notes: ["Elderly should receive lower doses and be monitored."],
        source_ref: {
          value: "Typical panic contribution: Stahl 0.5–2 mg/day; Maudsley notes 0.5–3 mg/day for anxiety.",
          source_id: S,
          page_ref: "p77",
          snippet: "Panic: 0.5–2 mg/day either as divided doses or once at bedtime; maximum dose generally 4 mg/day.",
          agreement: "partial",
          contrib: [
            { source_id: S, page_ref: "p77", snippet: "Panic: 0.5–2 mg/day either as divided doses or once at bedtime; maximum dose generally 4 mg/day." },
            { source_id: M, page_ref: "p136", snippet: "clonazepam 0.5–3mg/day (anxiety, consider a benzodiazepine)" },
          ],
        },
      },
      {
        band_order: 2,
        range_low: 0.25,
        range_high: 0.5,
        unit: "mg",
        frequency: "as needed / light",
        band_label: "Low-panel / gentle calming",
        primary_purpose: "Intermittent anxiety relief, initial vs lower start dose",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: false,
        why_this_dose: "Described as a start point in the panic section (0.25 mg) and in lesson planning aimed at gentler effect.",
        what_changes_going_up: "Return to band 1.",
        what_changes_going_down: "",
        source_ref: {
          value: "0.25 mg appears as the panic start dose in Stahl 7th dosing instructions.",
          source_id: S,
          page_ref: "p77",
          snippet: "start at 0.25 mg divided into 2 doses, raise to 1 mg after 3 days",
          agreement: "single",
        },
      },
    ],
    equivalences: [
      {
        drug_b: "Diazepam",
        note: "clonazepam 0.5 mg ≈ diazepam 10 mg",
        caveat: "This is a rough guide from Maudsley, not a swap instruction. Only a prescriber decides this.",
        source: {
          value: "clonazepam 0.5 mg ≈ diazepam 10 mg (diazepam-equivalent basis)",
          source_id: M,
          page_ref: "p463",
          snippet: "Diazepam-equivalent doses: Chlordiazepoxide 25mg, Clonazepam 0.5mg, Diazepam 10mg, Lorazepam 1mg... ",
          agreement: "full",
        },
      },
    ],
    links: [],
    clinical_presentations: [],
    student: {
      plain_language: {
        text:
          "Clonazepam turns up the brain's brake pedal (GABA). More brake means fewer racing thoughts, less panic, more sleep. Because it is a brake it also slows other things: thinking can get foggy, reactions slower. The body gets used to it, so stopping suddenly is genuinely dangerous — that is the prescriber's job, never the client's decision.",
        kb_parent_field: "mechanism",
        source: { value: "paraphrase of mechanism/liability above", source_id: S, page_ref: "p77", snippet: "Enhances the inhibitory effects of GABA ... Risk of dependence ... How to stop", agreement: "single" },
      },
      session_observations: [
        {
          observation: "A client may appear calmer, or more sedated, at the start (or when the dose is raised).",
          confidence: "possible",
          dose_dependence: "more with use at initiation or dose increases",
          rationale: "Sedation resolves with time in many; useful for reading affect.",
          source: { value: "as above", source_id: S, page_ref: "p77", snippet: "Sedation. Especially at initiation or when dose increases. Tolerance often develops.", agreement: "single" },
        },
      ],
    },
  },
];

export const KNOWLEDGE_BASE_NOTES =
  "The knowledge base is the clinical/academic register derived from these draft records (Output A), the student layer is the transformed Output B. Full transform in knowledge-base.ts.";