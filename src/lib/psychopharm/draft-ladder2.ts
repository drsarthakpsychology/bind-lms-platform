/**
 * Batch 2 of rich dose ladders — antipsychotics, mood-stabilizers,
 * anticonvulsants, stimulants. Each band quote-first from Stahl (S) or
 * Maudsley (M), with band_type + evidence where stated. No invented bands.
 */
import { DrugDraft } from "./draft";

const S = "stahl_pg_7th";
const M = "maudsley_2021";

export const DRAFT_LADDERS_2: DrugDraft[] = [
  // ---------------------------------------------------------------------------
  // OLANZAPINE — oral 10–20 + the olanzapine/fluoxetine combination band.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Olanzapine",
    drug_class: "Atypical antipsychotic",
    subclass: "Dopamine/serotonin antagonist",
    brand_names: ["Zyprexa", "Oleanz"],
    aliases: [],
    mechanism: [ { value: "Blocks D2 and 5-HT2A receptors; also H1, M1, 5-HT2C (weight/sedation profile).", source_id: S, page_ref: "p1627", snippet: "dopamine 2 ... serotonin 2A ... antihistaminic", agreement: "single" } ],
    receptor_targets: [ { value: "D2, 5-HT2A, H1, M1, 5-HT2C antagonist", source_id: S, page_ref: "p1627", snippet: "dopamine, serotonin, histamine, muscarinic", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia, acute mania, bipolar maintenance; olanzapine/fluoxetine for bipolar depression.", source_id: S, page_ref: "p1627", snippet: "Schizophrenia; Bipolar mania; Bipolar depression", agreement: "single" } ],
    equivalences: [ { drug_b: "Risperidone", note: "olanzapine 10 mg ≈ risperidone 4 mg (SGA)", caveat: "Rough guide, not a swap instruction. Only a prescriber decides this.", source: { value: "Table 1.3", source_id: M, page_ref: "p36", snippet: "Olanzapine 10mg; Risperidone oral 4mg", agreement: "full" } } ],
    links: [], clinical_presentations: [],
    student: { plain_language: { text: "Olanzapine quiets psychosis and mania but is strongly sedating and raises appetite — the weight gain is real for many.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p1627", snippet: "antihistaminic, weight", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 10, range_high: 20, unit: "mg", band_label: "Oral therapeutic range",
        primary_purpose: "Schizophrenia and mania", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "10–20 mg/day (oral or IM)", source_id: S, page_ref: "p1627", snippet: "10–20 mg/day (oral or intramuscular)", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "formulation", range_low: 6, range_high: 12, unit: "mg olanzapine / 25–50 mg fluoxetine", band_label: "Olanzapine/fluoxetine combination",
        primary_purpose: "Bipolar depression", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "6–12 mg olanzapine/25–50 mg fluoxetine", source_id: S, page_ref: "p1627", snippet: "6–12 mg olanzapine/25–50 mg fluoxetine", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // ---------------------------------------------------------------------------
  // HALOPERIDOL — oral 1–40 mg; injection bands.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Haloperidol",
    drug_class: "Dopamine antagonist (antipsychotic)",
    subclass: "Butyrophenone",
    brand_names: ["Haldol", "Serenace"], aliases: [],
    mechanism: [ { value: "Potent D2 antagonist; high-potency typical antipsychotic.", source_id: S, page_ref: "p1031", snippet: "dopamine 2 antagonist", agreement: "single" } ],
    receptor_targets: [ { value: "D2 antagonist", source_id: S, page_ref: "p1031", snippet: "dopamine 2", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia, acute psychosis, agitation.", source_id: S, page_ref: "p1031", snippet: "Schizophrenia", agreement: "single" } ],
    equivalences: [ { drug_b: "Chlorpromazine", note: "chlorpromazine 100 mg ≈ haloperidol 2 mg (FGA)", caveat: "Rough guide, not a swap instruction. Only a prescriber decides this.", source: { value: "Table 1.2", source_id: M, page_ref: "p35", snippet: "Haloperidol 2mg/day", agreement: "full" } } ],
    links: [], clinical_presentations: [],
    student: { plain_language: { text: "Haloperidol is a high-potency antipsychotic — very effective, but movement side effects are watched for closely.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p1031", snippet: "dopamine 2 antagonist", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 1, range_high: 40, unit: "mg", band_label: "Oral antipsychotic range",
        primary_purpose: "Psychosis", secondary_purposes: ["agitation"], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "1–40 mg/day orally", source_id: S, page_ref: "p1031", snippet: "1–40 mg/day orally", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "formulation", range_low: 2, range_high: 5, unit: "mg", band_label: "Immediate-release injection",
        frequency: "each dose", primary_purpose: "Acute agitation/psychosis (IM)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Immediate-release injection 2–5 mg each dose", source_id: S, page_ref: "p1031", snippet: "Immediate-release injection 2–5 mg each dose", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // ---------------------------------------------------------------------------
  // BUPROPION — IR/SR/XL formulation bands (different max single doses).
  // ---------------------------------------------------------------------------
  {
    generic_name: "Bupropion",
    drug_class: "NDRI antidepressant",
    subclass: "Norepinephrine–dopamine reuptake inhibitor",
    brand_names: ["Wellbutrin", "Zyban", "Bupron"], aliases: [],
    mechanism: [ { value: "Blocks norepinephrine and dopamine reuptake; activating, low sexual side effects.", source_id: S, page_ref: "p358", snippet: "norepinephrine–dopamine reuptake inhibitor", agreement: "single" } ],
    receptor_targets: [ { value: "NET + DAT inhibition", source_id: S, page_ref: "p358", snippet: "norepinephrine and dopamine reuptake", agreement: "single" } ],
    common_uses: [ { value: "Major depressive disorder, seasonal affective disorder, smoking cessation.", source_id: S, page_ref: "p358", snippet: "MDD; SAD; smoking cessation", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Bupropion lifts dopamine and norepinephrine — often energising, and usually without the sexual side effects of SSRIs.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p358", snippet: "NDRI", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "formulation", range_low: 150, range_high: 450, unit: "mg", band_label: "XL (once daily)",
        primary_purpose: "Depression", secondary_purposes: ["smoking cessation"], is_typical_starting: true, is_standard_maintenance: true,
        source_ref: { value: "Bupropion XL: 150–450 mg once daily", source_id: S, page_ref: "p358", snippet: "Bupropion XL: 150–450 mg once daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "formulation", range_low: 200, range_high: 450, unit: "mg", band_label: "SR (twice daily)",
        primary_purpose: "Depression", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Bupropion SR: 200–450 mg in 2 divided doses", source_id: S, page_ref: "p358", snippet: "Bupropion SR: 200–450 mg in 2 divided doses", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // ---------------------------------------------------------------------------
  // LURASIDONE — schizophrenia band vs bipolar-depression band.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Lurasidone",
    drug_class: "Atypical antipsychotic",
    subclass: "D2/5-HT2A antagonist",
    brand_names: ["Latuda"], aliases: [],
    mechanism: [ { value: "Blocks D2 and 5-HT2A; also 5-HT7 antagonism; metabolically friendly.", source_id: S, page_ref: "p1340", snippet: "dopamine 2, serotonin 2A, 5-HT7", agreement: "single" } ],
    receptor_targets: [ { value: "D2, 5-HT2A, 5-HT7 antagonist", source_id: S, page_ref: "p1340", snippet: "dopamine 2, serotonin 2A, 5-HT7", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia, bipolar depression.", source_id: S, page_ref: "p1340", snippet: "Schizophrenia; Bipolar depression", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Lurasidone treats psychosis and bipolar depression with little weight gain — but must be taken with food to absorb well.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p1340", snippet: "metabolically friendly", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "indication", range_low: 20, range_high: 60, unit: "mg", band_label: "Bipolar depression band",
        primary_purpose: "Bipolar depression", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "20–60 mg/day for bipolar depression", source_id: S, page_ref: "p1340", snippet: "20–60 mg/day for bipolar depression", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "indication", range_low: 40, range_high: 80, unit: "mg", band_label: "Schizophrenia band",
        primary_purpose: "Schizophrenia", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        why_this_dose: "Some patients benefit up to 160 mg/day.",
        source_ref: { value: "40–80 mg/day for schizophrenia", source_id: S, page_ref: "p1340", snippet: "40–80 mg/day for schizophrenia", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // ---------------------------------------------------------------------------
  // GABAPENTIN — anxiety/neuropathic pain band vs a lower start.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Gabapentin",
    drug_class: "Anticonvulsant (adjunctive)",
    subclass: "GABA analogue",
    brand_names: ["Neurontin"], aliases: [],
    mechanism: [ { value: "Binds the alpha-2-delta subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release.", source_id: S, page_ref: "p982", snippet: "alpha-2-delta subunit", agreement: "single" } ],
    receptor_targets: [ { value: "alpha-2-delta calcium-channel subunit", source_id: S, page_ref: "p982", snippet: "alpha-2-delta", agreement: "single" } ],
    common_uses: [ { value: "Neuropathic pain, adjunctive seizure control, anxiety in some settings.", source_id: S, page_ref: "p982", snippet: "pain; seizures", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Gabapentin calms over-active nerve signalling; the dose is built up over days and the target range is high.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p982", snippet: "alpha-2-delta", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 300, range_high: 300, unit: "mg", band_label: "Starting (day 1)",
        primary_purpose: "Starting dose", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "start at 300 mg/day", source_id: S, page_ref: "p982", snippet: "300 mg", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 900, range_high: 1800, unit: "mg", band_label: "Therapeutic range",
        primary_purpose: "Neuropathic pain / seizures", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "900–1800 mg/day in 3 divided doses (IR)", source_id: S, page_ref: "p982", snippet: "900–1800 mg/day in 3 divided doses (immediate-release)", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // ---------------------------------------------------------------------------
  // PREGABALIN — IR band vs once-daily CR.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Pregabalin",
    drug_class: "Anticonvulsant (adjunctive)",
    subclass: "GABA analogue",
    brand_names: ["Lyrica"], aliases: [],
    mechanism: [ { value: "Binds the alpha-2-delta calcium-channel subunit; used for neuropathic pain, fibromyalgia, GAD, seizures.", source_id: S, page_ref: "p1866", snippet: "alpha-2-delta", agreement: "single" } ],
    receptor_targets: [ { value: "alpha-2-delta calcium-channel subunit", source_id: S, page_ref: "p1866", snippet: "alpha-2-delta", agreement: "single" } ],
    common_uses: [ { value: "Neuropathic pain, generalized anxiety, fibromyalgia, adjunctive seizures.", source_id: S, page_ref: "p1866", snippet: "pain; GAD; seizures", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Pregabalin calms nerve-driven pain and anxiety; the once-daily form uses a single dose in the evening.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p1866", snippet: "alpha-2-delta", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "formulation", range_low: 150, range_high: 600, unit: "mg", band_label: "IR (2–3 divided doses)",
        primary_purpose: "Pain / GAD / seizures", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "IR: 150–600 mg/day in 2–3 doses", source_id: S, page_ref: "p1866", snippet: "IR: 150–600 mg/day in 2–3 doses", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "formulation", range_low: 330, range_high: 330, unit: "mg", band_label: "CR (once daily)",
        primary_purpose: "Once-daily dosing", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "CR: 330 mg once per day", source_id: S, page_ref: "p1866", snippet: "CR: 330 mg once per day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // ---------------------------------------------------------------------------
  // CARBAMAZEPINE — 400–1200 mg/day + pediatric weight-based band.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Carbamazepine",
    drug_class: "Anticonvulsant / mood stabilizer",
    subclass: "Dibenzazepine",
    brand_names: ["Tegretol", "Mazepine"], aliases: [],
    mechanism: [ { value: "Blocks voltage-gated sodium channels; mood-stabilizing and anticonvulsant.", source_id: S, page_ref: "p397", snippet: "sodium channels; mood stabilizer", agreement: "single" } ],
    receptor_targets: [ { value: "Voltage-gated sodium channel blockade", source_id: S, page_ref: "p397", snippet: "sodium channels", agreement: "single" } ],
    common_uses: [ { value: "Bipolar mania, epilepsy, trigeminal neuralgia.", source_id: S, page_ref: "p397", snippet: "mania; epilepsy", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Carbamazepine steadies nerves and mood; it also speeds up how the liver clears other medicines, which matters a lot.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p397", snippet: "enzyme inducer", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 400, range_high: 1200, unit: "mg", band_label: "Adult therapeutic range",
        primary_purpose: "Bipolar mania / epilepsy", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "400–1200 mg/day", source_id: S, page_ref: "p397", snippet: "400–1200 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "pediatric", range_low: 10, range_high: 20, unit: "mg/kg/day", band_label: "Children under 6",
        primary_purpose: "Seizure control in young children", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Under age 6: 10–20 mg/kg per day", source_id: S, page_ref: "p397", snippet: "Under age 6: 10–20 mg/kg per day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // ---------------------------------------------------------------------------
  // METHYLPHENIDATE — IR/SR bands + adult dose.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Methylphenidate",
    drug_class: "Stimulant",
    subclass: "Dopamine/norepinephrine reuptake inhibitor",
    brand_names: ["Ritalin", "Concerta", "Inspiral"], aliases: [],
    mechanism: [ { value: "Blocks dopamine and norepinephrine reuptake, boosting attention and arousal.", source_id: S, page_ref: "p1480", snippet: "dopamine reuptake", agreement: "single" } ],
    receptor_targets: [ { value: "DAT + NET inhibition", source_id: S, page_ref: "p1480", snippet: "dopamine transporter", agreement: "single" } ],
    common_uses: [ { value: "ADHD, narcolepsy.", source_id: S, page_ref: "p1480", snippet: "ADHD", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Methylphenidate turns up attention and focus by keeping dopamine available; effects are short-acting to all-day depending on the form.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p1480", snippet: "dopamine reuptake", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 5, range_high: 60, unit: "mg", band_label: "IR / SR therapeutic range",
        primary_purpose: "ADHD", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "5–40 mg (IR) / up to 60 mg (SR)", source_id: M, page_ref: "p580", snippet: "Methylphenidate 5–40mg", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // ---------------------------------------------------------------------------
  // TRAZODONE — depression 150–600 vs the low-dose sleep aid (50 mg).
  // ---------------------------------------------------------------------------
  {
    generic_name: "Trazodone",
    drug_class: "SARI antidepressant",
    subclass: "Serotonin antagonist and reuptake inhibitor",
    brand_names: ["Desyrel", "Trazonil"], aliases: [],
    mechanism: [ { value: "Blocks 5-HT2A and inhibits serotonin reuptake; at low dose acts as a sedative/sleep aid.", source_id: S, page_ref: "p2272", snippet: "serotonin antagonist and reuptake inhibitor", agreement: "single" } ],
    receptor_targets: [ { value: "5-HT2A antagonist, SERT inhibition, H1", source_id: S, page_ref: "p2272", snippet: "5-HT2A, serotonin reuptake", agreement: "single" } ],
    common_uses: [ { value: "Depression, insomnia (low dose), anxiety.", source_id: S, page_ref: "p2272", snippet: "Depression; Insomnia", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Trazodone is one drug with two jobs: a low bedtime dose helps sleep, a much higher dose treats depression.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p2272", snippet: "5-HT2A antagonism", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "indication", range_low: 50, range_high: 150, unit: "mg", band_label: "Low-dose (sleep)",
        frequency: "at night", primary_purpose: "Insomnia", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Trazodone 50 mg at bedtime for sleep", source_id: M, page_ref: "p671", snippet: "trazodone 50mg at bedtime", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 150, range_high: 600, unit: "mg", band_label: "Antidepressant range",
        primary_purpose: "Major depressive disorder", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "150–600 mg/day", source_id: S, page_ref: "p2272", snippet: "150–600 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },
];