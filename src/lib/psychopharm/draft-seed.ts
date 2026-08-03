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
          value: "0.25 mg is an available clonazepam dose and the panic start dose in Stahl 7th dosing instructions (dose forms: wafer 0.125/0.25 mg; panic starts at 0.25 mg, raise to 1 mg).",
          source_id: S,
          page_ref: "p77 (PDF 514)",
          snippet: "Disintegrating (wafer) 0.125 mg, 0.25 mg, 0.5 mg, 1 mg, 2 mg. Panic -1 mg/day; start at 0.25 mg divided into 2 doses, raise to 1 mg after 3 days",
          agreement: "single",
        },
        side_effects: [
          {
            label: "common",
            items: ["Lighter sedation at 0.25–0.5 mg than a mild maintenance band"],
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

  // ---------------------------------------------------------------------------
  // RISPERIDONE — the source separates oral adult dosing (2–8 mg) from the
  // children/elderly range (0.5–2 mg) and from the long-acting injectables.
  // G2 note: the sources do NOT describe a distinct 0.25 mg band; tablets from
  // 0.25 mg exist but the clinical bands are adult vs child/elderly, not a
  // functional low-dose band. We record what the source actually says.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Risperidone",
    drug_class: "Atypical antipsychotic",
    subclass: "Dopamine/serotonin antagonist",
    brand_names: ["Risperdal", "Sizodon", "Rispolept"],
    aliases: [],
    mechanism: [
      {
        value: "Blocks dopamine D2 receptors (reducing positive symptoms) and serotonin 5-HT2A receptors; 5-HT2A antagonism reduces motor side effects.",
        source_id: S,
        page_ref: "p1976",
        snippet: "Blocks dopamine 2 receptors, reducing positive symptoms of psychosis ... Blocks serotonin 2A receptors ... reducing motor side effects",
        agreement: "single",
      },
    ],
    receptor_targets: [
      {
        value: "D2 antagonist, 5-HT2A antagonist, D3 antagonist",
        source_id: S,
        page_ref: "p1976",
        snippet: "Blocks dopamine 2 receptors ... Blocks serotonin 2A receptors ... Actions at dopamine 3 receptors",
        agreement: "single",
      },
    ],
    common_uses: [
      {
        value: "Schizophrenia (adults and ages 13–17), other psychotic disorders, acute mania, bipolar maintenance; also agitation, tic disorders in some settings.",
        source_id: S,
        page_ref: "p1976",
        snippet: "Schizophrenia; Other psychotic disorders; Acute mania/mixed mania; Bipolar maintenance",
        agreement: "single",
      },
    ],
    equivalences: [
      {
        drug_b: "Olanzapine",
        note: "risperidone 4 mg ≈ olanzapine 10 mg (SGA equivalence)",
        caveat: "A rough guide from Maudsley, not a swap instruction. Only a prescriber decides this.",
        source: {
          value: "risperidone 4 mg ≈ olanzapine 10 mg (Table 1.3)",
          source_id: M,
          page_ref: "p36",
          snippet: "Olanzapine 10mg; Risperidone oral 4mg",
          agreement: "full",
        },
      },
    ],
    bands: [
      {
        band_order: 1,
        range_low: 2,
        range_high: 8,
        unit: "mg",
        frequency: "once daily (or divided)",
        band_label: "Adult antipsychotic band",
        primary_purpose: "Acute psychosis and bipolar disorder (adults)",
        secondary_purposes: ["maintenance", "agitation"],
        is_typical_starting: false,
        is_standard_maintenance: true,
        why_this_dose: "The source gives 2–8 mg/day for acute psychosis and bipolar disorder in adults.",
        what_changes_going_up: "Above 8 mg/day some sources see little added benefit but more side effects.",
        source_ref: {
          value: "Oral: 2–8 mg/day for acute psychosis and bipolar disorder (Stahl).",
          source_id: S,
          page_ref: "p1986",
          snippet: "Oral: 2–8 mg/day for acute psychosis and bipolar disorder",
          agreement: "full",
          contrib: [
            { source_id: S, page_ref: "p1986", snippet: "Oral: 2–8 mg/day for acute psychosis and bipolar disorder" },
            { source_id: M, page_ref: "p72", snippet: "the usual doses of 2–6mg" },
          ],
        },
        side_effects: [
          { label: "common", items: ["Dose-dependent parkinsonism", "Prolactin-related (breast tenderness, menstrual changes)", "Sedation", "Dizziness"], source: { value: "as above", source_id: S, page_ref: "p1983", snippet: "Dose-dependent drug-induced parkinsonism; Dose-related hyperprolactinemia; Dose-dependent dizziness, insomnia, anxiety, sedation", agreement: "single" } },
          { label: "serious_rare", items: ["Diabetes/dyslipidemia risk", "Tardive dyskinesia (long-term)"], source: { value: "as above", source_id: S, page_ref: "p1983", snippet: "May increase risk for diabetes and dyslipidemia", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any stiffness in arms or legs, or moving slower? Any restlessness?", rationale: "Extrapyramidal and akathisia risk rises with dose.", urgency: "mention_to_prescriber", source: { value: "as above", source_id: S, page_ref: "p1983", snippet: "Dose-dependent drug-induced parkinsonism", agreement: "single" } },
          { prompt: "Any changes in periods, or breast tenderness?", rationale: "Prolactin effects; rarely volunteered.", urgency: "mention_to_prescriber", source: { value: "as above", source_id: S, page_ref: "p1983", snippet: "Dose-related hyperprolactinemia", agreement: "single" } },
        ],
      },
      {
        band_order: 2,
        range_low: 0.5,
        range_high: 2,
        unit: "mg",
        band_label: "Lower range (children / elderly)",
        primary_purpose: "Same antipsychotic work at lower dose in children and the elderly",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: false,
        why_this_dose: "The source gives 0.5–2.0 mg/day for children and the elderly.",
        source_ref: {
          value: "Oral: 0.5–2.0 mg/day for children and elderly (Stahl).",
          source_id: S,
          page_ref: "p1986",
          snippet: "Oral: 0.5–2.0 mg/day for children and elderly",
          agreement: "single",
        },
        side_effects: [
          { label: "common", items: ["Similar class effects, often less intense at lower dose"], source: { value: "as above", source_id: S, page_ref: "p1983", snippet: "Dose-dependent side effects", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any stiffness or restlessness at this lower dose?", rationale: "Extrapyramidal effects can still appear, especially in the elderly.", urgency: "mention_to_prescriber", source: { value: "as above", source_id: S, page_ref: "p1983", snippet: "Dose-dependent drug-induced parkinsonism", agreement: "single" } },
        ],
      },
    ],
    links: [],
    clinical_presentations: [],
    student: {
      plain_language: {
        text:
          "Risperidone quiets a noisy brain: it calms racing thoughts and, at higher doses, treats psychosis. It also slows movement as a trade-off, and it can raise prolactin, which may change periods or cause breast tenderness.",
        kb_parent_field: "mechanism",
        source: { value: "D2 block + side effects", source_id: S, page_ref: "p1976", snippet: "Blocks dopamine 2 receptors ... Dose-dependent parkinsonism; hyperprolactinemia", agreement: "single" },
      },
      session_observations: [
        {
          observation: "A client may move or speak more slowly, especially as the dose rises.",
          confidence: "possible",
          dose_dependence: "more likely at higher doses",
          rationale: "Parkinsonism and slowed movement are dose-dependent.",
          source: { value: "as above", source_id: S, page_ref: "p1983", snippet: "Dose-dependent drug-induced parkinsonism", agreement: "single" },
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // FLUOXETINE — source separates 20–80 mg (depression/anxiety) from 60–80 mg
  // (bulimia). Note bulimia overlaps; the functional job differs.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Fluoxetine",
    drug_class: "SSRI",
    subclass: "Selective serotonin reuptake inhibitor",
    brand_names: ["Prozac", "Fludac"],
    aliases: [],
    mechanism: [
      {
        value: "Selectively blocks the serotonin transporter, boosting serotonergic transmission; slow accumulation with a long half-life.",
        source_id: S,
        page_ref: "p892",
        snippet: "Boosts neurotransmitter serotonin; Blocks serotonin reuptake pump (serotonin transporter)",
        agreement: "single",
      },
    ],
    receptor_targets: [
      { value: "Serotonin transporter (SERT) inhibition", source_id: S, page_ref: "p892", snippet: "Blocks serotonin reuptake pump (serotonin transporter)", agreement: "single" },
    ],
    common_uses: [
      {
        value: "Major depressive disorder, obsessive-compulsive disorder, panic disorder, bulimia nervosa, premenstrual dysphoric disorder.",
        source_id: S,
        page_ref: "p892",
        snippet: "Major depressive disorder; Bulimia nervosa; OCD; Panic disorder; PMDD",
        agreement: "single",
      },
    ],
    bands: [
      {
        band_order: 1,
        range_low: 20,
        range_high: 80,
        unit: "mg",
        band_label: "Depression / anxiety band",
        primary_purpose: "Major depressive disorder and anxiety disorders",
        secondary_purposes: ["OCD", "panic", "PMDD"],
        is_typical_starting: true,
        is_standard_maintenance: true,
        why_this_dose: "The source gives 20–80 mg for depression and anxiety disorders.",
        source_ref: {
          value: "20–80 mg for depression and anxiety disorders (Stahl).",
          source_id: S,
          page_ref: "p892",
          snippet: "20–80 mg for depression and anxiety disorders",
          agreement: "single",
        },
        side_effects: [
          { label: "common", items: ["Sexual dysfunction", "gastrointestinal (nausea)", "sleep changes"], source: { value: "as above", source_id: S, page_ref: "p890", snippet: "Sexual dysfunction ... decreased appetite, nausea", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any sexual changes, or sleep/appetite shifts?", rationale: "SSRI side effects are common and often unvolunteered.", urgency: "routine", source: { value: "as above", source_id: S, page_ref: "p890", snippet: "Sexual dysfunction", agreement: "single" } },
        ],
      },
      {
        band_order: 2,
        range_low: 60,
        range_high: 80,
        unit: "mg",
        band_label: "Bulimia band",
        primary_purpose: "Bulimia nervosa",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: false,
        why_this_dose: "The source gives 60–80 mg specifically for bulimia.",
        source_ref: {
          value: "60–80 mg for bulimia (Stahl).",
          source_id: S,
          page_ref: "p892",
          snippet: "60–80 mg for bulimia",
          agreement: "single",
        },
        side_effects: [
          { label: "common", items: ["Same SSRI class side effects"], source: { value: "as above", source_id: S, page_ref: "p890", snippet: "Sexual dysfunction ... nausea", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any new changes in appetite or weight talk?", rationale: "Higher fluoxetine doses are watched in eating-disorder contexts.", urgency: "routine", source: { value: "as above", source_id: S, page_ref: "p892", snippet: "60–80 mg for bulimia", agreement: "single" } },
        ],
      },
    ],
    equivalences: [],
    links: [],
    clinical_presentations: [],
    student: {
      plain_language: {
        text:
          "Fluoxetine keeps the brain's serotonin available longer, often lifting mood. It is a long-acting SSRI, so changes build slowly and, if stopped, wash out slowly too.",
        kb_parent_field: "mechanism",
        source: { value: "SERT inhibition", source_id: S, page_ref: "p892", snippet: "Boosts serotonin ... long half-life", agreement: "single" },
      },
    },
  },

  // ---------------------------------------------------------------------------
  // VENLAFAXINE — source gives depression 75–225 and GAD 150–225. Both are
  // SNRIs; the bands overlap but sit at different floors.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Venlafaxine",
    drug_class: "SNRI",
    subclass: "Serotonin–norepinephrine reuptake inhibitor",
    brand_names: ["Effexor", "Veniz"],
    aliases: [],
    mechanism: [
      {
        value: "Blocks both serotonin and norepinephrine reuptake, raising both neurotransmitter levels.",
        source_id: S,
        page_ref: "p2406",
        snippet: "Blocks serotonin reuptake pump ... and norepinephrine reuptake pump",
        agreement: "single",
      },
    ],
    receptor_targets: [
      { value: "SERT and NET (serotonin and norepinephrine transporters)", source_id: S, page_ref: "p2406", snippet: "Blocks serotonin and norepinephrine reuptake pumps", agreement: "single" },
    ],
    common_uses: [
      {
        value: "Major depressive disorder, generalized anxiety disorder, panic disorder, social anxiety.",
        source_id: S,
        page_ref: "p2406",
        snippet: "Major depressive disorder; Generalized anxiety disorder; Panic disorder",
        agreement: "single",
      },
    ],
    bands: [
      {
        band_order: 1,
        range_low: 75,
        range_high: 225,
        unit: "mg",
        band_label: "Depression band",
        primary_purpose: "Major depressive disorder",
        secondary_purposes: ["panic", "social anxiety"],
        is_typical_starting: true,
        is_standard_maintenance: true,
        why_this_dose: "The source gives 75–225 mg/day (once daily ER or divided IR) for depression.",
        source_ref: {
          value: "Depression: 75–225 mg/day (Stahl).",
          source_id: S,
          page_ref: "p2406",
          snippet: "Depression: 75–225 mg/day, once daily (extended-release) or divided into 2–3 doses (immediate-release)",
          agreement: "full",
        },
        side_effects: [
          { label: "common", items: ["Nausea", "sleep change", "day-night: insomnia, sweating", "blood-pressure raise at higher doses"], source: { value: "as above", source_id: S, page_ref: "p2404", snippet: "Nausea, sweating, insomnia", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any rise in your usual anxiety early on?", rationale: "SNRIs can briefly worsen anxiety before benefit.", urgency: "routine", source: { value: "as above", source_id: S, page_ref: "p2404", snippet: "activation", agreement: "single" } },
        ],
      },
      {
        band_order: 2,
        range_low: 150,
        range_high: 225,
        unit: "mg",
        band_label: "GAD band (higher floor)",
        primary_purpose: "Generalized anxiety disorder",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: false,
        why_this_dose: "The source gives 150–225 mg/day for GAD, a higher floor than the depression range.",
        source_ref: {
          value: "GAD: 150–225 mg/day (Stahl).",
          source_id: S,
          page_ref: "p2406",
          snippet: "GAD: 150–225 mg/day",
          agreement: "single",
        },
        side_effects: [
          { label: "common", items: ["Nausea", "sweating", "blood pressure changes"], source: { value: "as above", source_id: S, page_ref: "p2404", snippet: "Nausea, sweating", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any unusually heavy sweating or palpitations?", rationale: "Higher SNRI doses can raise blood pressure/heart rate.", urgency: "mention_to_prescriber", source: { value: "as above", source_id: S, page_ref: "p2404", snippet: "sweating, increased heart rate", agreement: "single" } },
        ],
      },
    ],
    // No published dose equivalence is given in our sources for venlafaxine
    // vs another drug. Per C2, the absence means the tool says so rather than
    // estimating — handled by the empty equivalences array.
    equivalences: [],
    links: [],
    clinical_presentations: [],
    student: {
      plain_language: {
        text:
          "Venlafaxine lifts both serotonin and norepinephrine, so it can help mood and energy, and sometimes blood pressure too (which is why it is watched).",
        kb_parent_field: "mechanism",
        source: { value: "as above", source_id: S, page_ref: "p2406", snippet: "Blocks serotonin and norepinephrine reuptake", agreement: "single" },
      },
    },
  },

  // ---------------------------------------------------------------------------
  // LITHIUM — the source's bands are defined by serum level (target range) and
  // job: mania vs depression vs maintenance. These are genuinely distinct.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Lithium",
    drug_class: "Mood stabilizer",
    subclass: "Alkali-metal cation",
    brand_names: ["Lithosun", "Lithobid"],
    aliases: [],
    mechanism: [
      {
        value: "Complex mood-stabilising actions: dampens excitatory signalling and protects against mood recurrence; toxicity is dose/level related.",
        source_id: S,
        page_ref: "p1216",
        snippet: "mood-stabilizing",
        agreement: "single",
      },
    ],
    receptor_targets: [
      { value: "Not a single receptor; affects several signalling pathways", source_id: S, page_ref: "p1216", snippet: "mood-stabilizing agent", agreement: "single" },
    ],
    common_uses: [
      {
        value: "Bipolar mania, bipolar depression, maintenance of bipolar disorder.",
        source_id: S,
        page_ref: "p1216",
        snippet: "Mania; Depression; Maintenance (bipolar)",
        agreement: "single",
      },
    ],
    bands: [
      {
        band_order: 1,
        range_low: 1.0,
        range_high: 1.5,
        unit: "mEq/L",
        band_label: "Acute mania (serum target)",
        primary_purpose: "Treatment of acute mania",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: false,
        why_this_dose: "The source recommends a serum level of 1.0–1.5 mEq/L for mania.",
        source_ref: {
          value: "Mania: recommended 1.0–1.5 mEq/L (Stahl).",
          source_id: S,
          page_ref: "p1216",
          snippet: "Mania: recommended 1.0–1.5 mEq/L",
          agreement: "single",
        },
        side_effects: [
          { label: "common", items: ["hand tremor", "thirst", "weight gain", "at high level: nausea"], source: { value: "as above", source_id: S, page_ref: "p1216", snippet: "tremor, polyuria, thirst, weight gain", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any tremor, nausea, or abnormal tiredness?", rationale: "Higher serum levels risk more side effects; contact the prescriber if there's a new tremor/nausea.", urgency: "mention_to_prescriber", source: { value: "as above", source_id: S, page_ref: "p1216", snippet: "tremor ... nausea", agreement: "single" } },
        ],
      },
      {
        band_order: 2,
        range_low: 0.6,
        range_high: 1.0,
        unit: "mEq/L",
        frequency: "maintenance",
        band_label: "Depression / maintenance serum",
        primary_purpose: "Bipolar depression (acute) and maintenance",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: true,
        why_this_dose: "The source gives 0.6–1.0 for depression and 0.7–1.0 for maintenance.",
        source_ref: {
          value: "Depression: 0.6–1.0 mEq/L; Maintenance 0.7–1.0 mEq/L (Stahl).",
          source_id: S,
          page_ref: "p1216",
          snippet: "Depression: recommended 0.6–1.0 mEq/L; Maintenance: recommended 0.7–1.0 mEq/L",
          agreement: "full",
        },
        side_effects: [
          { label: "common", items: ["Nausea", "tremor", "thirst", "weight gain"], source: { value: "as above", source_id: S, page_ref: "p1216", snippet: "nausea, tremor, thirst", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any tremor or confusion, or excessive thirst?", rationale: "Long-term lithium needs monitoring; any new sign of toxicity should reach the prescriber.", urgency: "mention_to_prescriber", source: { value: "as above", source_id: S, page_ref: "p1216", snippet: "tremor, confusion", agreement: "single" } },
        ],
      },
    ],
    equivalences: [],
    links: [],
    clinical_presentations: [],
    student: {
      plain_language: {
        text:
          "Lithium steadies the highs and lows of bipolar disorder. It is measured in the blood, and the target range differs whether the job is treating a high or holding mood steady. The prescriber checks the level.",
        kb_parent_field: "common_uses",
        source: { value: "as above", source_id: S, page_ref: "p1216", snippet: "Mania; Depression; Maintenance; recommended serum levels", agreement: "single" },
      },
    },
  },

  // ---------------------------------------------------------------------------
  // PAROXETINE — the source gives three distinct bands: depression, a very low
  // vasomotor dose, and the anxiety/OCD range.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Paroxetine",
    drug_class: "SSRI",
    subclass: "Selective serotonin reuptake inhibitor",
    brand_names: ["Paxil", "Seroxat", "Xet"],
    aliases: [],
    mechanism: [
      {
        value: "Selectively blocks the serotonin transporter, raising serotonergic transmission.",
        source_id: S,
        page_ref: "p1715",
        snippet: "Boosts serotonin ... Blocks serotonin reuptake pump (serotonin transporter)",
        agreement: "single",
      },
    ],
    receptor_targets: [
      { value: "Serotonin transporter (SERT) inhibition", source_id: S, page_ref: "p1715", snippet: "Blocks serotonin reuptake pump (serotonin transporter)", agreement: "single" },
    ],
    common_uses: [
      {
        value: "Major depressive disorder, obsessive-compulsive disorder, panic disorder, generalized anxiety, social anxiety, vasomotor symptoms of menopause.",
        source_id: S,
        page_ref: "p1715",
        snippet: "Major depressive disorder; Obsessive-compulsive disorder; Panic disorder; Social anxiety; Vasomotor symptoms",
        agreement: "single",
      },
    ],
    bands: [
      {
        band_order: 1,
        range_low: 20,
        range_high: 50,
        unit: "mg",
        band_label: "Depression band",
        primary_purpose: "Major depressive disorder",
        secondary_purposes: [],
        is_typical_starting: true,
        is_standard_maintenance: true,
        why_this_dose: "The source gives 20–50 mg (25–62.5 mg CR) for depression.",
        side_effects: [
          { label: "common", items: ["Sexual dysfunction", "sleep disturbances", "weight change"], source: { value: "as above", source_id: S, page_ref: "p1713", snippet: "Sexual dysfunction ... sleep", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any sexual changes, or sleep shifts?", rationale: "SSRI sexual/weight effects are common and often unvolunteered.", urgency: "routine", source: { value: "as above", source_id: S, page_ref: "p1713", snippet: "Sexual dysfunction", agreement: "single" } },
        ],
        source_ref: {
          value: "Depression: 20–50 mg (Stahl).",
          source_id: S,
          page_ref: "p1715",
          snippet: "Depression: 20–50 mg (25–62.5 mg CR)",
          agreement: "single",
        },
      },
      {
        band_order: 2,
        range_low: 10,
        range_high: 60,
        unit: "mg",
        band_label: "Anxiety / OCD band",
        primary_purpose: "Anxiety disorders and OCD",
        secondary_purposes: ["panic", "generalized anxiety", "social anxiety"],
        is_typical_starting: false,
        is_standard_maintenance: false,
        why_this_dose: "The source gives 10–60 mg/day (12.5–75 mg CR) for anxiety disorders and OCD.",
        side_effects: [
          { label: "common", items: ["Sexual dysfunction", "activation early"], source: { value: "as above", source_id: S, page_ref: "p1713", snippet: "Sexual dysfunction", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any increased anxiety in the first days?", rationale: "SSRIs can transiently worsen anxiety before benefit.", urgency: "routine", source: { value: "as above", source_id: S, page_ref: "p1713", snippet: "activation", agreement: "single" } },
        ],
        source_ref: {
          value: "Anxiety disorders and OCD: 10–60 mg/day (Stahl).",
          source_id: S,
          page_ref: "p1715",
          snippet: "Anxiety disorders and OCD: 10–60 mg/day (12.5–75 mg CR)",
          agreement: "single",
        },
      },
      {
        band_order: 3,
        range_low: 7.5,
        range_high: 7.5,
        unit: "mg",
        frequency: "at bedtime",
        band_label: "Vasomotor-symptom low dose",
        primary_purpose: "Vasomotor symptoms of menopause (hot flashes)",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: false,
        why_this_dose: "The source gives 7.5 mg at bedtime specifically for vasomotor symptoms.",
        side_effects: [],
        observation_prompts: [],
        source_ref: {
          value: "Vasomotor symptoms: 7.5 mg at bedtime (Stahl).",
          source_id: S,
          page_ref: "p1715",
          snippet: "Vasomotor symptoms: 7.5 mg at bedtime",
          agreement: "single",
        },
      },
    ],
    equivalences: [],
    links: [],
    clinical_presentations: [],
    student: {
      plain_language: {
        text:
          "Paroxetine is an SSRI; it keeps serotonin around longer. The dose depends entirely on the job: a low bedtime dose for hot flashes, a middle dose for depression, a higher one for anxiety and OCD.",
        kb_parent_field: "common_uses",
        source: { value: "as above", source_id: S, page_ref: "p1715", snippet: "Depression; Vasomotor; Anxiety disorders", agreement: "single" },
      },
    },
  },
];

export const KNOWLEDGE_BASE_NOTES =
  "The knowledge base is the clinical/academic register derived from these draft records (Output A), the student layer is the transformed Output B. Full transform in knowledge-base.ts.";