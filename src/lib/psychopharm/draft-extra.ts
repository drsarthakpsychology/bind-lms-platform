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
];