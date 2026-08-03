/**
 * Auto-curated bands for drugs whose Stahl PG 7th monograph source draws clear
 * functional dose bands (multi-condition ranges in the "Usual Dosage Range"
 * block). Each band is quote-first: the snippet is the exact source range text,
 * and the band boundaries come ONLY from what the source states (Rule 16/18).
 *
 * This file is generated-style but hand-verified against the extracted
 * monographs in docs/psychopharm/extracted_mono_stahl7.json. Where the source
 * gives a single continuous range for a drug, that drug is NOT here — it uses
 * the honest-gap fallback in store.ts instead.
 */
import { DrugDraft } from "./draft";

const S = "stahl_pg_7th";

export const DRAFT_DRUGS_EXTRA: DrugDraft[] = [
  // ---------------------------------------------------------------------------
  // ALPRAZOLAM — source splits anxiety from panic dose.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Alprazolam",
    drug_class: "Benzodiazepine",
    subclass: "GABA-A positive allosteric modulator (GABA-PAM)",
    brand_names: ["Xanax", "Alprax"],
    aliases: [],
    mechanism: [
      {
        value: "Binds benzodiazepine receptors at the GABA-A complex and enhances the inhibitory effects of GABA, calming anxiety circuits.",
        source_id: S,
        page_ref: "p49",
        snippet: "Binds to benzodiazepine receptors at the GABA-A ligand-gated chloride channel complex. Enhances the inhibitory effects of GABA.",
        agreement: "single",
      },
    ],
    receptor_targets: [
      { value: "GABAA benzodiazepine site (positive allosteric modulator)", source_id: S, page_ref: "p49", snippet: "Benzodiazepine (anxiolytic)", agreement: "single" },
    ],
    common_uses: [
      { value: "Anxiety disorders, and panic disorder (with or without agoraphobia).", source_id: S, page_ref: "p49", snippet: "Anxiety; Panic disorder", agreement: "single" },
    ],
    bands: [
      {
        band_order: 1,
        range_low: 1,
        range_high: 4,
        unit: "mg",
        frequency: "divided",
        band_label: "Anxiety band",
        primary_purpose: "Generalized anxiety",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: false,
        why_this_dose: "The source gives 1–4 mg/day (IR) for anxiety.",
        source_ref: { value: "Anxiety: alprazolam IR: 1–4 mg/day", source_id: S, page_ref: "p49", snippet: "Anxiety: alprazolam IR: 1–4 mg/day", agreement: "single" },
        side_effects: [
          { label: "common", items: ["Sedation", "drowsiness", "coordination"], source: { value: "as above", source_id: S, page_ref: "p49", snippet: "Sedation, drowsiness", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "How drowsy does this feel during the day?", rationale: "Sedation is common early or as the dose rises.", urgency: "routine", source: { value: "as above", source_id: S, page_ref: "p49", snippet: "Sedation", agreement: "single" } },
        ],
      },
      {
        band_order: 2,
        range_low: 5,
        range_high: 6,
        unit: "mg",
        band_label: "Panic",
        primary_purpose: "Panic disorder",
        secondary_purposes: [],
        is_typical_starting: false,
        is_standard_maintenance: false,
        why_this_dose: "The source gives 5–6 mg/day (IR) for panic.",
        source_ref: { value: "Panic: alprazolam IR: 5–6 mg/day", source_id: S, page_ref: "p49", snippet: "Panic: alprazolam IR: 5–6 mg/day", agreement: "single" },
        side_effects: [
          { label: "common", items: ["Sedation", "coordination", "dependence risk higher"], source: { value: "as above", source_id: S, page_ref: "p49", snippet: "Sedation ... dependence", agreement: "single" } },
        ],
        observation_prompts: [
          { prompt: "Any memory gaps or coordination trouble?", rationale: "Higher benzodiazepine doses can impair memory and coordination.", urgency: "mention_to_prescriber", source: { value: "as above", source_id: S, page_ref: "p49", snippet: "impaired memory, coordination", agreement: "single" } },
        ],
      },
    ],
    equivalences: [
      {
        drug_b: "Diazepam",
        note: "alprazolam 1 mg ≈ diazepam 10 mg",
        caveat: "Rough guide, not a swap instruction. Only a prescriber decides this.",
        source: { value: "diazepam-equivalent basis", source_id: "maudsley_2021", page_ref: "p463", snippet: "Diazepam-equivalent doses: ... Lorazepam 1mg; Alprazolam (see table)", agreement: "single" },
      },
    ],
    links: [],
    clinical_presentations: [],
    student: { plain_language: { text: "Alprazolam is a quick-acting brake on anxiety — relief can come within hours, and dependence needs watching.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p49", snippet: "Enhances the inhibitory effects of GABA", agreement: "single" } } },
  },

  // ---------------------------------------------------------------------------
  // AMISULPRIDE — source separates schizophrenia dose from negative-symptom and
  // dysthymia doses.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Amisulpride",
    drug_class: "Atypical antipsychotic",
    subclass: "Benzamide antipsychotic",
    brand_names: ["Solian"],
    aliases: [],
    mechanism: [ { value: "Prefers dopamine D2/D3 blockade; at low doses acts presynaptically (raises dopamine), at high doses blocks postsynaptic D2.", source_id: S, page_ref: "p76", snippet: "blocks presynaptic dopamine 2 receptors at low doses ... blocks postsynaptic dopamine", agreement: "single" } ],
    receptor_targets: [ { value: "D2/D3 antagonist", source_id: S, page_ref: "p76", snippet: "dopamine 2 receptors", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia (positive + negative), dysthymia.", source_id: S, page_ref: "p76", snippet: "Schizophrenia; Dysthymia", agreement: "single" } ],
    bands: [
      {
        band_order: 1, range_low: 50, range_high: 300, unit: "mg", band_label: "Negative-symptom / dysthymia band",
        primary_purpose: "Predominant negative symptoms and dysthymia",
        secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Negative symptoms only: 50–300 mg/day; Dysthymia: 50 mg/day", source_id: S, page_ref: "p76", snippet: "Negative symptoms only: 50–300 mg/day", agreement: "single" },
        side_effects: [], observation_prompts: [],
      },
      { band_order: 2, range_low: 400, range_high: 800, unit: "mg", band_label: "Schizophrenia (positive) band",
        primary_purpose: "Positive symptoms of schizophrenia", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "Schizophrenia: 400–800 mg/day in 2 doses", source_id: S, page_ref: "p76", snippet: "Schizophrenia: 400–800 mg/day in 2 doses", agreement: "single" },
        side_effects: [], observation_prompts: [],
      },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Amisulpride is a dose-dependent antipsychotic: lower doses nudge dopamine up (helping a low, motivation-numbing symptom), higher doses turn it down to treat psychosis.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p76", snippet: "blocks presynaptic dopamine 2 at low doses", agreement: "single" } } },
  },

  // SULPIRIDE — same shape as amisulpride: negative-symptom/depression band vs schizophrenia band.
  {
    generic_name: "Sulpiride", drug_class: "Atypical antipsychotic", subclass: "Benzamide antipsychotic",
    brand_names: ["Dogmatil"], aliases: [],
    mechanism: [ { value: "Selective D2/D3 antagonist; dose-dependent effect on positive vs negative symptoms.", source_id: S, page_ref: "p2128", snippet: "dopamine 2 receptor antagonist", agreement: "single" } ],
    receptor_targets: [ { value: "D2/D3 antagonist", source_id: S, page_ref: "p2128", snippet: "dopamine 2 receptors", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia (positive + negative symptoms), depression.", source_id: S, page_ref: "p2128", snippet: "Schizophrenia; Depression", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 50, range_high: 300, unit: "mg", band_label: "Negative-symptom band",
        primary_purpose: "Predominantly negative symptoms", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Predominantly negative symptoms: 50–300 mg/day (oral)", source_id: S, page_ref: "p2128", snippet: "Predominantly negative symptoms: 50–300 mg/day (oral)", agreement: "single" },
        side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 150, range_high: 300, unit: "mg", band_label: "Depression band",
        primary_purpose: "Depression", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Depression: 150–300 mg/day (oral)", source_id: S, page_ref: "p2128", snippet: "Depression: 150–300 mg/day (oral)", agreement: "single" },
        side_effects: [], observation_prompts: [] },
      { band_order: 3, range_low: 400, range_high: 800, unit: "mg", band_label: "Schizophrenia (positive) band",
        primary_purpose: "Positive symptoms of schizophrenia", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "Schizophrenia: 400–800 mg/day in 2 doses (oral)", source_id: S, page_ref: "p2128", snippet: "Schizophrenia: 400–800 mg/day in 2 doses (oral)", agreement: "single" },
        side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Sulpiride's job changes with the dose: lower for depression or negative symptoms, much higher to treat active psychosis.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p2128", snippet: "Schizophrenia; Depression", agreement: "single" } } },
  },

  // ZIPRASIDONE — schizophrenia band vs bipolar band, distinct ranges.
  {
    generic_name: "Ziprasidone", drug_class: "Atypical antipsychotic", subclass: "Dopamine/serotonin antagonist",
    brand_names: ["Geodon"], aliases: [],
    mechanism: [ { value: "Blocks D2 and 5-HT2A receptors; also has serotonin/norepinephrine reuptake inhibition properties.", source_id: S, page_ref: "p2478", snippet: "dopamine 2 ... serotonin 2A ... reuptake inhibition", agreement: "single" } ],
    receptor_targets: [ { value: "D2 antagonist, 5-HT2A antagonist, SERT/NET reuptake inhibition", source_id: S, page_ref: "p2478", snippet: "dopamine 2, serotonin 2A, reuptake", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia, bipolar mania/mixed states.", source_id: S, page_ref: "p2478", snippet: "Schizophrenia; Bipolar disorder", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 80, range_high: 160, unit: "mg", band_label: "Bipolar disorder band",
        primary_purpose: "Bipolar mania/mixed states", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Bipolar disorder: 80–160 mg/day (in divided doses) orally", source_id: S, page_ref: "p2478", snippet: "Bipolar disorder: 80–160 mg/day (in divided doses) orally", agreement: "single" },
        side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 40, range_high: 200, unit: "mg", band_label: "Schizophrenia band",
        primary_purpose: "Schizophrenia", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "Schizophrenia: 40–200 mg/day (in divided doses) orally", source_id: S, page_ref: "p2478", snippet: "Schizophrenia: 40–200 mg/day (in divided doses) orally", agreement: "single" },
        side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Ziprasidone's dose range shifts with the job: narrower and lower for bipolar mania, wider and can go higher for schizophrenia.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p2478", snippet: "Schizophrenia; Bipolar disorder", agreement: "single" } } },
  },

  // VALPROATE — mania vs migraine vs epilepsy, distinct clinical bands (epilepsy is weight-based).
  {
    generic_name: "Valproate", drug_class: "Anticonvulsant / mood stabilizer", subclass: "Fatty-acid derivative",
    brand_names: ["Depakote", "Valparin", "Divalproex"], aliases: ["Valproic acid"],
    mechanism: [ { value: "Multiple actions including GABA enhancement and sodium-channel effects; used as a mood stabilizer and anticonvulsant.", source_id: S, page_ref: "p2374", snippet: "mood-stabilizing", agreement: "single" } ],
    receptor_targets: [ { value: "Not receptor-specific; broad CNS excitability dampening", source_id: S, page_ref: "p2374", snippet: "anticonvulsant", agreement: "single" } ],
    common_uses: [ { value: "Bipolar mania, migraine prophylaxis, epilepsy.", source_id: S, page_ref: "p2374", snippet: "Mania; Migraine; Epilepsy", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 500, range_high: 1000, unit: "mg", band_label: "Migraine prophylaxis band",
        primary_purpose: "Migraine prevention", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Migraine: 500–1000 mg/day", source_id: S, page_ref: "p2374", snippet: "Migraine: 500–1000 mg/day", agreement: "single" },
        side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 1200, range_high: 1500, unit: "mg", band_label: "Mania band",
        primary_purpose: "Acute mania", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "Mania: 1200–1500 mg/day", source_id: S, page_ref: "p2374", snippet: "Mania: 1200–1500 mg/day", agreement: "single" },
        side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Valproate is prescribed differently by job: a lower dose to head off migraines, a higher one to bring down mania. Epilepsy dosing is worked out by body weight instead.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p2374", snippet: "Mania; Migraine; Epilepsy", agreement: "single" } } },
  },

  // CHLORDIAZEPOXIDE — mild vs severe anxiety bands.
  {
    generic_name: "Chlordiazepoxide", drug_class: "Benzodiazepine", subclass: "GABA-A PAM",
    brand_names: ["Librium"], aliases: [],
    mechanism: [ { value: "Enhances GABA-mediated inhibition at the benzodiazepine/GABA-A receptor complex.", source_id: S, page_ref: "p440", snippet: "enhances the inhibitory effects of GABA", agreement: "single" } ],
    receptor_targets: [ { value: "GABAA benzodiazepine site", source_id: S, page_ref: "p440", snippet: "benzodiazepine", agreement: "single" } ],
    common_uses: [ { value: "Anxiety (mild-to-moderate and severe), alcohol withdrawal in some settings.", source_id: S, page_ref: "p440", snippet: "Anxiety", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 15, range_high: 40, unit: "mg", frequency: "3–4 doses", band_label: "Mild/moderate anxiety band",
        primary_purpose: "Mild to moderate anxiety", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Mild to moderate anxiety: 15–40 mg/day in 3–4 doses", source_id: S, page_ref: "p440", snippet: "Mild to moderate anxiety: 15–40 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 60, range_high: 100, unit: "mg", frequency: "3–4 doses", band_label: "Severe anxiety band",
        primary_purpose: "Severe anxiety", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Severe anxiety: 60–100 mg/day in 3–4 doses", source_id: S, page_ref: "p440", snippet: "Severe anxiety: 60–100 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Chlordiazepoxide's dose rises with how severe the anxiety is — a lighter dose for milder worry, a higher one for severe anxiety.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p440", snippet: "Anxiety", agreement: "single" } } },
  },

  // OXAZEPAM — mild vs severe anxiety band.
  {
    generic_name: "Oxazepam", drug_class: "Benzodiazepine", subclass: "GABA-A PAM",
    brand_names: ["Serax"], aliases: [],
    mechanism: [ { value: "Enhances GABA-mediated inhibition at the benzodiazepine receptor.", source_id: S, page_ref: "p1651", snippet: "enhances the inhibitory effects of GABA", agreement: "single" } ],
    receptor_targets: [ { value: "GABAA benzodiazepine site", source_id: S, page_ref: "p1651", snippet: "benzodiazepine", agreement: "single" } ],
    common_uses: [ { value: "Anxiety (mild-to-moderate and severe), alcohol-withdrawal anxiety.", source_id: S, page_ref: "p1651", snippet: "Anxiety", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 30, range_high: 60, unit: "mg", frequency: "3–4 divided doses", band_label: "Mild/moderate anxiety band",
        primary_purpose: "Mild to moderate anxiety", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Mild to moderate anxiety: 30–60 mg/day in 3–4 divided doses", source_id: S, page_ref: "p1651", snippet: "Mild to moderate anxiety: 30–60 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 45, range_high: 120, unit: "mg", frequency: "3–4 divided doses", band_label: "Severe anxiety / withdrawal band",
        primary_purpose: "Severe anxiety and alcohol-withdrawal anxiety", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Severe anxiety, anxiety associated with alcohol withdrawal: 45–120 mg/day", source_id: S, page_ref: "p1651", snippet: "Severe anxiety ... 45–120 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Oxazepam lifts the anxiety brake further the more severe the anxiety; the higher band is also used around alcohol detox.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p1651", snippet: "Anxiety", agreement: "single" } } },
  },

  // LORAZEPAM — oral vs injection vs catatonia. Catatonia is the distinctive job.
  {
    generic_name: "Lorazepam", drug_class: "Benzodiazepine", subclass: "GABA-A PAM",
    brand_names: ["Ativan", "Lorax"], aliases: [],
    mechanism: [ { value: "Enhances GABA-mediated inhibition at the benzodiazepine receptor; also a sedative-hypnotic and anxiolytic.", source_id: S, page_ref: "p1278", snippet: "enhances the inhibitory effects of GABA", agreement: "single" } ],
    receptor_targets: [ { value: "GABAA benzodiazepine site", source_id: S, page_ref: "p1278", snippet: "benzodiazepine", agreement: "single" } ],
    common_uses: [ { value: "Anxiety, insomnia, catatonia, and as an injection in acute settings.", source_id: S, page_ref: "p1278", snippet: "Anxiety; Catatonia", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 2, range_high: 6, unit: "mg", frequency: "divided, largest at bedtime", band_label: "Oral anxiety band",
        primary_purpose: "Anxiety (oral)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Oral: 2–6 mg/day in divided doses, largest dose at bedtime", source_id: S, page_ref: "p1278", snippet: "Oral: 2–6 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 1, range_high: 2, unit: "mg", frequency: "per dose", band_label: "Catatonia band",
        primary_purpose: "Catatonia", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Catatonia: 1–2 mg per dose", source_id: S, page_ref: "p1278", snippet: "Catatonia: 1–2 mg per dose", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [
      { drug_b: "Diazepam", note: "lorazepam 1 mg ≈ diazepam 10 mg", caveat: "Rough guide, not a swap instruction. Only a prescriber decides this.",
        source: { value: "diazepam-equivalent basis", source_id: "maudsley_2021", page_ref: "p463", snippet: "Diazepam-equivalent doses: ... Lorazepam 1mg", agreement: "single" } },
    ],
    links: [], clinical_presentations: [],
    student: { plain_language: { text: "Lorazepam is a versatile brake — low oral doses for anxiety, single doses of 1–2 mg for catatonia. It's also used as an injection in emergencies.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p1278", snippet: "Anxiety; Catatonia", agreement: "single" } } },
  },

  // LAMOTRIGINE — bipolar monotherapy vs adjunctive band.
  {
    generic_name: "Lamotrigine", drug_class: "Anticonvulsant / mood stabilizer", subclass: "Phenyltriazine",
    brand_names: ["Lamictal", "Lametec"], aliases: [],
    mechanism: [ { value: "Blocks voltage-sensitive sodium channels, stabilizing excitable membranes; used in bipolar maintenance.", source_id: S, page_ref: "p1132", snippet: "anticonvulsant", agreement: "single" } ],
    receptor_targets: [ { value: "Voltage-gated sodium channel blockade", source_id: S, page_ref: "p1132", snippet: "sodium channels", agreement: "single" } ],
    common_uses: [ { value: "Maintenance of bipolar disorder (monotherapy or adjunctive).", source_id: S, page_ref: "p1132", snippet: "Bipolar disorder", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 100, range_high: 200, unit: "mg", band_label: "Bipolar monotherapy band",
        primary_purpose: "Bipolar maintenance (monotherapy)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Monotherapy for bipolar disorder: 100–200 mg/day", source_id: S, page_ref: "p1132", snippet: "Monotherapy for bipolar disorder: 100–200 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 100, range_high: 400, unit: "mg", band_label: "Adjunctive band (drug-dependent)",
        primary_purpose: "Adjunctive bipolar treatment", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        why_this_dose: "Adjunctive dose depends on the co-medication: 100 mg/day with valproate; 400 mg/day with enzyme-inducing antiepileptics.",
        source_ref: { value: "Adjunctive: 100 mg/day with valproate; 400 mg/day with enzyme-inducers", source_id: S, page_ref: "p1132", snippet: "Adjunctive treatment for bipolar disorder: 100 mg/day in combination with valproate; 400 mg/day in combination with enzyme-inducing antiepileptic drugs", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Lamotrigine holds bipolar mood steady. The maintenance dose is lower on its own and depends heavily on what other medicines a person takes, because those change the level.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p1132", snippet: "Bipolar disorder", agreement: "single" } } },
  },

  // DULOXETINE — depression (40–60) vs a fixed 60 mg for neuropathic pain / GAD.
  {
    generic_name: "Duloxetine", drug_class: "SNRI", subclass: "Serotonin–norepinephrine reuptake inhibitor",
    brand_names: ["Cymbalta", "Duzela"], aliases: [],
    mechanism: [ { value: "Blocks both serotonin and norepinephrine reuptake; also used for chronic pain.", source_id: S, page_ref: "p776", snippet: "blocks serotonin and norepinephrine reuptake pumps", agreement: "single" } ],
    receptor_targets: [ { value: "SERT and NET inhibition", source_id: S, page_ref: "p776", snippet: "serotonin and norepinephrine reuptake", agreement: "single" } ],
    common_uses: [ { value: "Major depressive disorder, generalized anxiety, diabetic neuropathic pain, fibromyalgia.", source_id: S, page_ref: "p776", snippet: "Depression; GAD; pain", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 40, range_high: 60, unit: "mg", band_label: "Depression band",
        primary_purpose: "Major depressive disorder", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        source_ref: { value: "40–60 mg/day in 1–2 doses for depression", source_id: S, page_ref: "p776", snippet: "40–60 mg/day in 1–2 doses for depression", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 60, range_high: 60, unit: "mg", band_label: "Pain / GAD band",
        primary_purpose: "Diabetic neuropathic pain, fibromyalgia, and generalized anxiety", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "60 mg once daily for neuropathic pain, fibromyalgia, and GAD", source_id: S, page_ref: "p776", snippet: "60 mg once daily for diabetic peripheral neuropathic pain and fibromyalgia ... 60 mg once daily for generalized anxiety disorder", agreement: "full" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Duloxetine lifts serotonin and norepinephrine, helping mood, anxiety, and some chronic pain — the fixed 60 mg is its pain/anxiety dose.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p776", snippet: "Depression; GAD; pain", agreement: "single" } } },
  },

  // TOPIRAMATE — epilepsy (200-400) vs bipolar adjunct (50-300).
  {
    generic_name: "Topiramate", drug_class: "Anticonvulsant / mood stabilizer", subclass: "Sulfamate-substituted monosaccharide",
    brand_names: ["Topamax"], aliases: [],
    mechanism: [ { value: "Blocks voltage-sensitive sodium channels and enhances GABA-A activity; also carbonic-anhydrase inhibition.", source_id: S, page_ref: "p2235", snippet: "anticonvulsant", agreement: "single" } ],
    receptor_targets: [ { value: "Voltage-gated sodium channels, GABA-A, AMPA/kainate", source_id: S, page_ref: "p2235", snippet: "sodium channels, GABA", agreement: "single" } ],
    common_uses: [ { value: "Epilepsy (partial-onset, primary generalized), adjunct in bipolar disorder, migraine prophylaxis.", source_id: S, page_ref: "p2235", snippet: "epilepsy; bipolar", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 200, range_high: 400, unit: "mg", frequency: "divided", band_label: "Epilepsy band",
        primary_purpose: "Epilepsy (adjunct or monotherapy)", secondary_purposes: ["migraine prophylaxis"], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "200–400 mg/day in 2 divided doses for epilepsy", source_id: S, page_ref: "p2235", snippet: "200–400 mg/day in 2 divided doses for epilepsy", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 50, range_high: 300, unit: "mg", band_label: "Bipolar adjunct band",
        primary_purpose: "Adjunctive treatment of bipolar disorder", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "50–300 mg/day for adjunctive treatment of bipolar disorder", source_id: S, page_ref: "p2235", snippet: "50–300 mg/day for adjunctive treatment of bipolar disorder", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Topiramate's dose depends on the job: higher for epilepsy, lower as an add-on in bipolar disorder.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p2235", snippet: "epilepsy; bipolar", agreement: "single" } } },
  },

  // HYDROXYZINE — anxiety vs pruritus (antihistamine anxiolytic).
  {
    generic_name: "Hydroxyzine", drug_class: "Sedative antihistamine (anxiolytic)", subclass: "H1 antagonist",
    brand_names: ["Atarax", "Vistaril"], aliases: [],
    mechanism: [ { value: "Blocks H1 histamine receptors; sedative and anxiolytic, no GABA potentiation of benzodiazepine type.", source_id: S, page_ref: "p1052", snippet: "antihistamine", agreement: "single" } ],
    receptor_targets: [ { value: "H1 histamine antagonist", source_id: S, page_ref: "p1052", snippet: "histamine", agreement: "single" } ],
    common_uses: [ { value: "Anxiety, sedation, and pruritus (itching).", source_id: S, page_ref: "p1052", snippet: "Anxiety; Sedative; Pruritus", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 50, range_high: 100, unit: "mg", frequency: "4×/day", band_label: "Anxiety band",
        primary_purpose: "Anxiety", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Anxiety: 50–100 mg 4 times a day", source_id: S, page_ref: "p1052", snippet: "Anxiety: 50–100 mg 4 times a day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 75, range_high: 75, unit: "mg", frequency: "3–4 divided doses", band_label: "Pruritus band",
        primary_purpose: "Pruritus (itching)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Pruritus: 75 mg/day divided into 3–4 doses", source_id: S, page_ref: "p1052", snippet: "Pruritus: 75 mg/day divided into 3–4 doses", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Hydroxyzine is an antihistamine used as a gentle sedative for anxiety and for itching.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p1052", snippet: "Anxiety; Pruritus", agreement: "single" } } },
  },

  // CARIPRAZINE — schizophrenia, bipolar mania, bipolar depression, each its own band.
  {
    generic_name: "Cariprazine", drug_class: "Atypical antipsychotic", subclass: "D2/D3 partial agonist",
    brand_names: ["Vraylar"], aliases: [],
    mechanism: [ { value: "Partial agonist at D2 and D3 receptors (D3-preferring), with antipsychotic and mood-stabilising actions.", source_id: S, page_ref: "p420", snippet: "partial agonist at dopamine 2 and 3 receptors", agreement: "single" } ],
    receptor_targets: [ { value: "D2/D3 partial agonist", source_id: S, page_ref: "p420", snippet: "dopamine 2 and 3 receptors", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia, bipolar mania, bipolar depression.", source_id: S, page_ref: "p420", snippet: "Schizophrenia; Bipolar mania; Bipolar depression", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 1.5, range_high: 3, unit: "mg", band_label: "Bipolar depression band",
        primary_purpose: "Bipolar depression", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Bipolar depression: 1.5–3 mg once daily", source_id: S, page_ref: "p420", snippet: "Bipolar depression: 1.5–3 mg once daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 3, range_high: 6, unit: "mg", band_label: "Mania / schizophrenia band",
        primary_purpose: "Schizophrenia and bipolar mania", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "Schizophrenia: 1.5–6 mg once daily; Bipolar mania: 3–6 mg", source_id: S, page_ref: "p420", snippet: "Schizophrenia: 1.5–6 mg once daily; Bipolar mania: 3–6 mg", agreement: "full" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Cariprazine's dose sits lower for bipolar depression and goes higher for mania and psychosis.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p420", snippet: "Schizophrenia; Bipolar mania; Bipolar depression", agreement: "single" } } },
  },

  // BREXPIPRAZOLE — schizophrenia 2-4 vs depression 2.
  {
    generic_name: "Brexpiprazole", drug_class: "Atypical antipsychotic", subclass: "D2 partial agonist / 5-HT modulator",
    brand_names: ["Rexulti"], aliases: [],
    mechanism: [ { value: "Partial agonist at D2 and 5-HT1A, antagonist at 5-HT2A; used in schizophrenia and as an adjunct in depression.", source_id: S, page_ref: "p321", snippet: "partial agonist; adjunct antidepressant", agreement: "single" } ],
    receptor_targets: [ { value: "D2 partial agonist, 5-HT1A partial agonist, 5-HT2A antagonist", source_id: S, page_ref: "p321", snippet: "D2, 5-HT1A partial agonist; 5-HT2A antagonist", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia, and major depressive disorder (adjunct to an antidepressant).", source_id: S, page_ref: "p321", snippet: "Schizophrenia; Depression (adjunct)", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 2, range_high: 2, unit: "mg", band_label: "Depression adjunct band",
        primary_purpose: "Major depressive disorder (adjunct)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Depression: 2 mg once daily", source_id: S, page_ref: "p321", snippet: "Depression: 2 mg once daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 2, range_high: 4, unit: "mg", band_label: "Schizophrenia band",
        primary_purpose: "Schizophrenia", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "Schizophrenia: 2–4 mg once daily", source_id: S, page_ref: "p321", snippet: "Schizophrenia: 2–4 mg once daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Brexpiprazole is a partial-dopamine drug: a small 2 mg dose as an add-on for depression, up to 4 mg treating schizophrenia.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p321", snippet: "Schizophrenia; Depression adjunct", agreement: "single" } } },
  },

  // PERPHENAZINE — psychosis vs nausea/vomiting, distinct bands.
  {
    generic_name: "Perphenazine", drug_class: "Dopamine antagonist (antipsychotic)", subclass: "Phenothiazine (piperazine)",
    brand_names: ["Trilafon"], aliases: [],
    mechanism: [ { value: "Blocks dopamine D2 receptors; antipsychotic and antiemetic.", source_id: S, page_ref: "p1753", snippet: "dopamine antagonism", agreement: "single" } ],
    receptor_targets: [ { value: "D2 antagonist", source_id: S, page_ref: "p1753", snippet: "dopamine receptor antagonist", agreement: "single" } ],
    common_uses: [ { value: "Psychosis, and nausea/vomiting.", source_id: S, page_ref: "p1753", snippet: "Psychosis; Nausea/vomiting", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 8, range_high: 16, unit: "mg", band_label: "Antiemetic band",
        primary_purpose: "Nausea and vomiting", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Nausea/vomiting: 8–16 mg/day oral, 5 mg intramuscular", source_id: S, page_ref: "p1753", snippet: "Nausea/vomiting: 8–16 mg/day oral, 5 mg intramuscular", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 12, range_high: 64, unit: "mg", band_label: "Psychosis band",
        primary_purpose: "Psychosis", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "Psychosis: 12–24 mg/day oral; 16–64 mg/day hospitalized", source_id: S, page_ref: "p1753", snippet: "Psychosis: oral: 12–24 mg/day; 16–64 mg/day in hospitalized patients", agreement: "full" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Perphenazine is used at very different doses: low doses calm nausea, higher doses treat psychosis.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p1753", snippet: "Psychosis; Nausea", agreement: "single" } } },
  },

  // BENZTROPINE — drug-induced parkinsonism vs parkinsonism.
  {
    generic_name: "Benztropine", drug_class: "Anticholinergic", subclass: "Antimuscarinic",
    brand_names: ["Cogentin"], aliases: [],
    mechanism: [ { value: "Antimuscarinic anticholinergic; used to treat drug-induced parkinsonism and dystonia.", source_id: S, page_ref: "p265", snippet: "anticholinergic", agreement: "single" } ],
    receptor_targets: [ { value: "Muscarinic (M1) antagonist", source_id: S, page_ref: "p265", snippet: "antimuscarinic", agreement: "single" } ],
    common_uses: [ { value: "Drug-induced parkinsonism (from antipsychotics), and parkinsonism.", source_id: S, page_ref: "p265", snippet: "Drug-induced parkinsonism; Parkinsonism", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 0.5, range_high: 6, unit: "mg", band_label: "Parkinsonism band",
        primary_purpose: "Parkinsonism", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Parkinsonism: 0.5–6 mg/day", source_id: S, page_ref: "p265", snippet: "Parkinsonism: 0.5–6 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 2, range_high: 8, unit: "mg", band_label: "Drug-induced parkinsonism band",
        primary_purpose: "Drug-induced parkinsonism", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Drug-induced parkinsonism: 2–8 mg/day", source_id: S, page_ref: "p265", snippet: "Drug-induced parkinsonism: 2–8 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Benztropine is an anticholinergic that eases the stiffness some antipsychotics cause.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p265", snippet: "Drug-induced parkinsonism", agreement: "single" } } },
  },

  // CLORAZEPATE — anxiety vs alcohol withdrawal.
  {
    generic_name: "Clorazepate", drug_class: "Benzodiazepine", subclass: "GABA-A PAM (long-acting)",
    brand_names: ["Tranxene"], aliases: [],
    mechanism: [ { value: "Enhances GABA-mediated inhibition; prodrug to the active nordiazepam.", source_id: S, page_ref: "p548", snippet: "benzodiazepine ... GABA", agreement: "single" } ],
    receptor_targets: [ { value: "GABAA benzodiazepine site", source_id: S, page_ref: "p548", snippet: "benzodiazepine", agreement: "single" } ],
    common_uses: [ { value: "Anxiety, alcohol withdrawal.", source_id: S, page_ref: "p548", snippet: "Anxiety; Alcohol withdrawal", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 15, range_high: 60, unit: "mg", frequency: "divided", band_label: "Anxiety band",
        primary_purpose: "Anxiety", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Anxiety: 15–60 mg/day in divided doses", source_id: S, page_ref: "p548", snippet: "Anxiety: 15–60 mg/day in divided doses", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 30, range_high: 60, unit: "mg", frequency: "divided", band_label: "Alcohol-withdrawal band",
        primary_purpose: "Alcohol withdrawal", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Alcohol withdrawal: 30–60 mg/day in divided doses", source_id: S, page_ref: "p548", snippet: "Alcohol withdrawal: 30–60 mg/day in divided doses", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Clorazepate is a long-acting benzodiazepine for anxiety, and is used to help alcohol withdrawal.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p548", snippet: "Anxiety; Alcohol withdrawal", agreement: "single" } } },
  },

  // LISDEXAMFETAMINE — ADHD vs binge-eating disorder.
  {
    generic_name: "Lisdexamfetamine", drug_class: "Stimulant", subclass: "Prodrug amphetamine",
    brand_names: ["Vyvanse"], aliases: [],
    mechanism: [ { value: "Prodrug converted to dextroamphetamine; increases dopamine and norepinephrine in synaptic space.", source_id: S, page_ref: "p1194", snippet: "amphetamine prodrug; dopamine and norepinephrine", agreement: "single" } ],
    receptor_targets: [ { value: "DA/NE release (via VMAT/TAAR), not direct receptor agonism", source_id: S, page_ref: "p1194", snippet: "dopamine and norepinephrine", agreement: "single" } ],
    common_uses: [ { value: "ADHD, moderate-to-severe binge-eating disorder.", source_id: S, page_ref: "p1194", snippet: "ADHD; Binge eating disorder", agreement: "single" } ],
    bands: [
      { band_order: 1, range_low: 30, range_high: 70, unit: "mg", band_label: "ADHD band",
        primary_purpose: "Attention-deficit/hyperactivity disorder", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "ADHD: 30–70 mg/day", source_id: S, page_ref: "p1194", snippet: "ADHD: 30–70 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, range_low: 50, range_high: 70, unit: "mg", band_label: "Binge-eating disorder band",
        primary_purpose: "Moderate-to-severe binge-eating disorder", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Binge eating disorder: 50–70 mg/day", source_id: S, page_ref: "p1194", snippet: "Binge eating disorder: 50–70 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Lisdexamfetamine is a long-acting amphetamine: one range for ADHD, a slightly higher one for binge-eating disorder.", kb_parent_field: "common_uses", source: { value: "as above", source_id: S, page_ref: "p1194", snippet: "ADHD; Binge eating disorder", agreement: "single" } } },
  },
];