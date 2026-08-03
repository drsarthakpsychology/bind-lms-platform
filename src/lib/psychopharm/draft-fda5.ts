/**
 * Dose ladders (batch 5) — naltrexone, prazosin, diazepam. Quote-first from
 * Maudsley (authoritative guideline, Tier 1) where FDA labels were thin.
 */
import { DrugDraft } from "./draft";

const M = "maudsley_2021";

export const DRAFT_FDA_5: DrugDraft[] = [
  // NALTREXONE — 25 start → 50 maintenance; 100–200 in some trials.
  {
    generic_name: "Naltrexone",
    drug_class: "Opioid antagonist",
    subclass: "Opioid receptor antagonist",
    brand_names: ["Revia"], aliases: [],
    mechanism: [ { value: "Blocks opioid receptors; reduces alcohol craving and blocks opioid effects.", source_id: M, page_ref: "p485", snippet: "opioid antagonist", agreement: "single" } ],
    receptor_targets: [ { value: "Mu-opioid receptor antagonist", source_id: M, page_ref: "p485", snippet: "opioid antagonist", agreement: "single" } ],
    common_uses: [ { value: "Alcohol dependence relapse prevention; opioid dependence.", source_id: M, page_ref: "p485", snippet: "relapse prevention in alcohol dependence", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Naltrexone lowers the pull of alcohol (and blocks opioids); it's a daily 50 mg tablet once a stable dose is reached.", kb_parent_field: "mechanism", source: { value: "as above", source_id: M, page_ref: "p485", snippet: "opioid antagonist", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 25, range_high: 25, unit: "mg", band_label: "Initial dose",
        primary_purpose: "Initiation (after opioid-free interval)", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "initial 25 mg after opioid-free interval, then 50 mg daily", source_id: M, page_ref: "p518", snippet: "initial dose of 25mg naltrexone ... subsequent doses can be increased to 50mg daily as a maintenance dose", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "maintenance", range_low: 50, range_high: 50, unit: "mg", band_label: "Maintenance dose",
        frequency: "once daily", primary_purpose: "Alcohol relapse prevention", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "50 mg/day maintenance (NICE CG115)", source_id: M, page_ref: "p485", snippet: "Naltrexone [50mg/day] should be offered for relapse prevention", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 3, band_type: "high_response", range_low: 100, range_high: 200, unit: "mg", band_label: "Higher-dose range (some trials)",
        primary_purpose: "Adjunctive uses / augmentation", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        why_this_dose: "Some trials used 100–200 mg/day for augmentation/co-morbidity.",
        evidence: { strength: "limited", confidence: "low", guideline: "Maudsley (trial evidence)" },
        source_ref: { value: "100–200 mg/day in some trials", source_id: M, page_ref: "p344", snippet: "Naltrexone 100mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // PRAZOSIN — start 1 mg nocte, 2–15 mg for nightmares.
  {
    generic_name: "Prazosin",
    drug_class: "Alpha-1 blocker",
    subclass: "Alpha-1 adrenergic antagonist",
    brand_names: ["Minipress"], aliases: [],
    mechanism: [ { value: "Blocks alpha-1 adrenergic receptors; reduces noradrenergic arousal, used for nightmares in PTSD.", source_id: M, page_ref: "p449", snippet: "alpha blocker", agreement: "single" } ],
    receptor_targets: [ { value: "Alpha-1 adrenergic antagonist", source_id: M, page_ref: "p449", snippet: "alpha", agreement: "single" } ],
    common_uses: [ { value: "Nightmares / sleep disturbance in PTSD; hypertension.", source_id: M, page_ref: "p449", snippet: "nightmares and sleep disturbances", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Prazosin lowers the body's 'alarm' chemistry, which helps PTSD nightmares; it starts low and is raised slowly.", kb_parent_field: "mechanism", source: { value: "as above", source_id: M, page_ref: "p449", snippet: "alpha blocker", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 1, range_high: 1, unit: "mg", band_label: "Initial dose",
        frequency: "at night", primary_purpose: "Initiation", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "initiate 1 mg at night, titrate", source_id: M, page_ref: "p449", snippet: "Initiate at 1mg nocte and titrate", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 2, range_high: 15, unit: "mg", band_label: "Therapeutic range",
        frequency: "at night", primary_purpose: "Nightmares / sleep in PTSD", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "2–15 mg at night for nightmares", source_id: M, page_ref: "p449", snippet: "Prazosin 2–15mg nocte", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // DIAZEPAM — anxiety up to 15 mg/day; 6–25 mg/day range.
  {
    generic_name: "Diazepam",
    drug_class: "Benzodiazepine",
    subclass: "GABA-A PAM (long-acting)",
    brand_names: ["Valium", "Calmpose"], aliases: [],
    mechanism: [ { value: "Enhances GABA-mediated inhibition at the benzodiazepine site; anxiolytic, sedative, muscle-relaxant, anticonvulsant.", source_id: M, page_ref: "p136", snippet: "benzodiazepine", agreement: "single" } ],
    receptor_targets: [ { value: "GABAA benzodiazepine site (positive allosteric modulator)", source_id: M, page_ref: "p136", snippet: "benzodiazepine", agreement: "single" } ],
    common_uses: [ { value: "Anxiety, alcohol withdrawal, seizures, muscle spasm.", source_id: M, page_ref: "p136", snippet: "anxiety", agreement: "single" } ],
    equivalences: [ { drug_b: "Clonazepam", note: "diazepam 10 mg ≈ clonazepam 0.5 mg (diazepam-equivalent)", caveat: "Rough guide, not a swap instruction. Only a prescriber decides this.", source: { value: "Table 3.29", source_id: M, page_ref: "p463", snippet: "Diazepam 10mg; Clonazepam 0.5mg", agreement: "full" } } ],
    links: [], clinical_presentations: [],
    student: { plain_language: { text: "Diazepam is a long-acting benzodiazepine brake for anxiety; dependence needs watching, and stopping is slow, prescriber-guided work.", kb_parent_field: "mechanism", source: { value: "as above", source_id: M, page_ref: "p136", snippet: "benzodiazepine", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 6, range_high: 25, unit: "mg", band_label: "Anxiolytic range",
        primary_purpose: "Anxiety", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "diazepam 6–25 mg/day (anxiolytic)", source_id: M, page_ref: "p139", snippet: "diazepam 6–25mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "indication", range_low: 15, range_high: 15, unit: "mg", band_label: "Upper anxiety band",
        primary_purpose: "Anxiety (up to 15 mg/day)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "diazepam up to 15 mg/day", source_id: M, page_ref: "p136", snippet: "diazepam up to 15mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 3, band_type: "indication", range_low: 20, range_high: 80, unit: "mg", band_label: "Alcohol-withdrawal regimen",
        frequency: "hourly as needed", primary_purpose: "Alcohol withdrawal (oral loading)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        why_this_dose: "20 mg orally hourly until light sedation, max 80 mg (fixed regimen).",
        source_ref: { value: "20 mg diazepam hourly until light sedation, max 80 mg", source_id: M, page_ref: "p494", snippet: "20mg diazepam orally hourly until light sedation achieved, Max 80mg", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },
];