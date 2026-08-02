/**
 * Curated draft seed — highest-frequency drugs first.
 *
 * Each record is quote-first: every value carries source_id + page_ref + a
 * verbatim snippet read from the source. Bands come ONLY from what the sources
 * describe as functionally distinct ranges (by condition/population) —
 * never invented boundaries (Rule 16/18). Where a source gives one continuous
 * range with no functional split, the drug is left to the honest-gap fallback
 * in store.ts, not force-split here.
 *
 * Source ids: S = stahl_pg_7th (Prescriber's Guide, 7th ed), M = maudsley_2021.
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
        side_effects: [
          {
            label: "common",
            items: ["Lighter sedation at 0.25–0.5 mg than at the maintenance band"],
            time_course: "Same class sedation; gentler at the low end.",
            source: {
              value: "as band 1",
              source_id: S,
              page_ref: "p77",
              snippet: "Sedation ... Especially at initiation or when dose increases.",
              agreement: "single",
            },
          },
        ],
        observation_prompts: [
          {
            prompt: "Have you felt unusually sleepy or slowed since the low dose?",
            rationale: "Low-dose sedation still possible, but usually light.",
            urgency: "routine",
            source: { value: "as above", source_id: S, page_ref: "p77", snippet: "Sedation ... Especially at initiation or when dose increases.", agreement: "single" },
          },
        ],
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

  // ---------------------------------------------------------------------------
  // ARIPIPRAZOLE — the source gives two clearly different functional bands by
  // job: low-dose SSRI/SNRI adjunct vs the full antipsychotic/mood-stabilising
  // dose. Both quoted from the same "Usual Dosage Range" block.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Aripiprazole",
    drug_class: "Atypical antipsychotic",
    subclass: "Dopamine-serotonin partial agonist",
    brand_names: ["Abilify", "Arip MT"],
    aliases: [],
    mechanism: [
      {
        value: "Partial agonism at dopamine 2 receptors (reduces dopamine output when high, boosts it when low); blocks 5-HT2A; partial agonist at 5-HT1A.",
        source_id: S,
        page_ref: "p184",
        snippet: "Partial agonism at dopamine 2 receptors Theoretically reduces dopamine output when dopamine concentrations are high ... Blocks serotonin 2A receptors ... Partial agonism at 5HT1A receptors may be relevant at clinical doses.",
        agreement: "single",
      },
    ],
    receptor_targets: [
      {
        value: "D2 partial agonist, 5-HT2A antagonist, 5-HT1A partial agonist",
        source_id: S,
        page_ref: "p184",
        snippet: "Dopamine partial agonist (dopamine-serotonin partial agonist)",
        agreement: "single",
      },
    ],
    common_uses: [
      {
        value: "Schizophrenia (adults and adolescents), acute mania, bipolar maintenance, depression (adjunct to an antidepressant), autism-related irritability, Tourette's disorder in children.",
        source_id: S,
        page_ref: "p184",
        snippet: "Schizophrenia; Acute mania/mixed mania; Bipolar maintenance; Depression (adjunct); Autism-related irritability in children ages 6 to 17; Tourette's disorder in children ages 6 to 18.",
        agreement: "single",
      },
    ],
    bands: [
      {
        band_order: 1,
        range_low: 2,
        range_high: 10,
        unit: "mg",
        band_label: "Low / adjunct band",
        primary_purpose: "Augmentation of SSRIs/SNRIs in depression",
        secondary_purposes: ["autism-related irritability (5–15 mg)", "Tourette's (5–20 mg)"],
        is_typical_starting: true,
        is_standard_maintenance: false,
        why_this_dose: "The source gives 2–10 mg/day specifically for augmenting SSRIs/SNRIs in depression.",
        what_changes_going_up: "Above ~15 mg the drug is treating psychosis/mania, not depression augmentation.",
        source_ref: {
          value: "2–10 mg/day for augmenting SSRIs/SNRIs in depression (Stahl).",
          source_id: S,
          page_ref: "p184",
          snippet: "2–10 mg/day for augmenting SSRIs/SNRIs in depression",
          agreement: "partial",
          contrib: [
            { source_id: S, page_ref: "p184", snippet: "2–10 mg/day for augmenting SSRIs/SNRIs in depression" },
            { source_id: S, page_ref: "p184", snippet: "Depression (adjunct) (Abilify)" },
          ],
        },
        side_effects: [
          {
            label: "common",
            items: ["Nausea", "Insomnia", "Akathisia", "Sedation"],
            source: { value: "as above", source_id: S, page_ref: "p184", snippet: "Dizziness, insomnia, akathisia, activation. Nausea, vomiting.", agreement: "single" },
          },
        ],
        observation_prompts: [
          {
            prompt: "Any restlessness, like a need to keep moving?",
            rationale: "Akathisia often appears with aripiprazole, especially as dose rises; it can read like anxiety.",
            urgency: "mention_to_prescriber",
            source: { value: "as above", source_id: S, page_ref: "p184", snippet: "Akathisia, activation", agreement: "single" },
          },
        ],
      },
      {
        band_order: 2,
        range_low: 15,
        range_high: 30,
        unit: "mg",
        band_label: "Full antipsychotic / mood-stabilizer dose",
        primary_purpose: "Schizophrenia and mania",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: true,
        why_this_dose: "15–30 mg/day for schizophrenia and mania.",
        side_effects: [
          {
            label: "common",
            items: ["Sedation", "weight gain", "akathisia"],
            source: { value: "as above", source_id: S, page_ref: "p184", snippet: "Akathisia, activation", agreement: "single" },
          },
        ],
        observation_prompts: [
          {
            prompt: "Any restlessness, stiffness, or involuntary movements?",
            rationale: "At antipsychotic doses, akathisia and parkinsonian effects are watched for.",
            urgency: "mention_to_prescriber",
            source: { value: "as above", source_id: S, page_ref: "p184", snippet: "Akathisia, activation", agreement: "single" },
          },
        ],
        source_ref: {
          value: "15–30 mg/day for schizophrenia and mania (Stahl).",
          source_id: S,
          page_ref: "p184",
          snippet: "15–30 mg/day for schizophrenia and mania",
          agreement: "single",
        },
      },
    ],
    equivalences: [
      {
        drug_b: "Olanzapine",
        note: "aripiprazole 15 mg ≈ olanzapine 10 mg (SGA equivalence)",
        caveat: "A rough guide from Maudsley, not a swap instruction. Only a prescriber decides this.",
        source: {
          value: "aripiprazole 15 mg ≈ olanzapine 10 mg (Table 1.3 SGA equivalents)",
          source_id: M,
          page_ref: "p36",
          snippet: "Aripiprazole 15mg; Olanzapine 10mg",
          agreement: "full",
        },
      },
    ],
    links: [],
    clinical_presentations: [],
    student: {
      plain_language: {
        text:
          "Aripiprazole works partly as a volume knob on dopamine: when dopamine is loud it turns it down, and when it is quiet it turns it up. That is why the low dose is used to help depression alongside another medicine, while the higher dose treats psychosis.",
        kb_parent_field: "mechanism",
        source: { value: "D2 partial agonism", source_id: S, page_ref: "p184", snippet: "Partial agonism at dopamine 2 receptors Theoretically reduces dopamine output when high ... increases dopamine output when low", agreement: "single" },
      },
      session_observations: [
        {
          observation: "A client may be fidgety or restless, especially as the dose is raised.",
          confidence: "possible",
          dose_dependence: "more likely at higher doses",
          rationale: "Akathisia is common with aripiprazole and can be mistaken for anxiety.",
          source: { value: "as above", source_id: S, page_ref: "p184", snippet: "Akathisia, activation", agreement: "single" },
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // QUETIAPINE — the source gives two clearly different bands: a lower
  // treatment of bipolar depression (300 mg) vs the higher schizophrenia /
  // mania range (400–800 mg).
  // ---------------------------------------------------------------------------
  {
    generic_name: "Quetiapine",
    drug_class: "Atypical antipsychotic",
    subclass: "Dopamine/serotonin antagonist",
    brand_names: ["Seroquel", "Seroquel XR", "Oleanz"],
    aliases: [],
    mechanism: [
      {
        value: "Blocks dopamine D2 and serotonin 5-HT2A receptors; at higher doses full antipsychotic activity, at low doses strong histamine (H1) blockade underlying sedation.",
        source_id: S,
        page_ref: "p1934",
        snippet: "antagonism at serotonin 2A ... and dopamine receptors ... high degree of antihistaminic activity at lower doses",
        agreement: "single",
      },
    ],
    receptor_targets: [
      {
        value: "D2 antagonist, 5-HT2A antagonist, H1 antagonist (H1 prominent at low dose), alpha-1 antagonist",
        source_id: S,
        page_ref: "p1934",
        snippet: "antagonism at ... receptors, antihistaminic activity",
        agreement: "single",
      },
    ],
    common_uses: [
      {
        value: "Schizophrenia, acute mania/mixed mania, bipolar depression, and as an adjunct in major depressive disorder.",
        source_id: S,
        page_ref: "p1934",
        snippet: "Schizophrenia; Bipolar mania; Bipolar depression (300 mg once daily); Major depressive disorder (adjunct)",
        agreement: "single",
      },
    ],
    bands: [
      {
        band_order: 1,
        range_low: 300,
        range_high: 300,
        unit: "mg",
        band_label: "Bipolar depression band",
        primary_purpose: "Acute bipolar depression",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: false,
        why_this_dose: "The source gives 300 mg once daily specifically for bipolar depression.",
        source_ref: {
          value: "300 mg once daily for bipolar depression (Stahl).",
          source_id: S,
          page_ref: "p1934",
          snippet: "300 mg once daily for bipolar depression",
          agreement: "single",
        },
        side_effects: [
          { label: "common", items: ["Sedation", "Dizziness", "dry mouth"], source: { value: "as above", source_id: S, page_ref: "p1934", snippet: "Sedation, dizziness, dry mouth", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "How sleepy has this dose made you during the day?", rationale: "Sedation is prominent, especially at initiation.", urgency: "routine", source: { value: "as above", source_id: S, page_ref: "p1934", snippet: "Sedation", agreement: "single" } },
        ],
      },
      {
        band_order: 2,
        range_low: 400,
        range_high: 800,
        unit: "mg",
        frequency: "once (XR) or twice (IR) daily",
        band_label: "Schizophrenia / mania band",
        primary_purpose: "Schizophrenia and bipolar mania",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: true,
        why_this_dose: "The source gives 400–800 mg/day for schizophrenia and for bipolar mania.",
        source_ref: {
          value: "400–800 mg/day ... for schizophrenia ... for bipolar mania (Stahl).",
          source_id: S,
          page_ref: "p1934",
          snippet: "400–800 mg/day in 1 (quetiapine XR) or 2 (quetiapine) doses for schizophrenia 400–800 mg/day ... for bipolar mania",
          agreement: "full",
        },
        side_effects: [
          { label: "common", items: ["Sedation", "weight gain", "metabolic changes"], source: { value: "as above", source_id: S, page_ref: "p1934", snippet: "Sleepiness, weight gain, metabolic", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any increased fatigue or weight change?", rationale: "Sedation and metabolic effects are common at antipsychotic doses.", urgency: "routine", source: { value: "as above", source_id: S, page_ref: "p1934", snippet: "Sleepiness, weight gain", agreement: "single" } },
        ],
      },
    ],
    equivalences: [],
    links: [],
    clinical_presentations: [],
    student: {
      plain_language: {
        text:
          "Quetiapine is a different medicine depending on the dose. At higher doses it treats psychosis and mania. At its once-daily lower use it is licensed for bipolar depression — and it is sedating either way.",
        kb_parent_field: "common_uses",
        source: { value: "as above", source_id: S, page_ref: "p1934", snippet: "300 mg once daily for bipolar depression; 400–800 mg/day for schizophrenia", agreement: "single" },
      },
    },
  },
];

export const KNOWLEDGE_BASE_NOTES =
  "The knowledge base is the clinical/academic register derived from these draft records (Output A), the student layer is the transformed Output B. Full transform in knowledge-base.ts.";