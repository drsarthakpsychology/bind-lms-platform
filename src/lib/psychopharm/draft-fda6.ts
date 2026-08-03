/**
 * Dose ladders (batch 6) — paliperidone, propranolol, trifluoperazine,
 * temazepam, melatonin. Quote-first from Stahl/Maudsley/FDA. The tricyclic
 * antidepressants and buspirone stay as honest single ranges (their sources
 * give one continuous band, so they are not split).
 */
import { DrugDraft } from "./draft";

const S = "stahl_pg_7th";
const M = "maudsley_2021";
const FDA = "fda_label";

export const DRAFT_FDA_6: DrugDraft[] = [
  // PALIPERIDONE — oral 6 mg + LAI bands.
  {
    generic_name: "Paliperidone",
    drug_class: "Atypical antipsychotic",
    subclass: "D2/5-HT2A antagonist (9-hydroxy-risperidone)",
    brand_names: ["Invega"], aliases: [],
    mechanism: [ { value: "Blocks D2 and 5-HT2A; the active metabolite of risperidone.", source_id: S, page_ref: "p1687", snippet: "9-hydroxyrisperidone", agreement: "single" } ],
    receptor_targets: [ { value: "D2, 5-HT2A antagonist", source_id: S, page_ref: "p1687", snippet: "dopamine 2, serotonin 2A", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia (oral + long-acting injectable).", source_id: S, page_ref: "p1687", snippet: "Schizophrenia", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Paliperidone is risperidone's active form; it's a daily pill or a once-monthly long-acting injection.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p1687", snippet: "9-hydroxyrisperidone", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 6, range_high: 6, unit: "mg", band_label: "Oral dose",
        frequency: "once daily", primary_purpose: "Schizophrenia (oral)", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        source_ref: { value: "6 mg/day oral", source_id: S, page_ref: "p1687", snippet: "6 mg/day (oral)", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "formulation", range_low: 39, range_high: 234, unit: "mg/month", band_label: "Long-acting injectable (Sustenna)",
        frequency: "monthly", primary_purpose: "Schizophrenia (LAI)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "39–234 mg/month (Sustenna)", source_id: S, page_ref: "p1687", snippet: "39–234 mg/month (Sustenna)", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // PROPRANOLOL — 40–400 mg/day (anxiety/performance + medical).
  {
    generic_name: "Propranolol",
    drug_class: "Beta-blocker",
    subclass: "Non-selective beta-adrenergic antagonist",
    brand_names: ["Inderal"], aliases: [],
    mechanism: [ { value: "Blocks beta-adrenergic receptors; dampens the physical symptoms of anxiety (heart, tremor).", source_id: S, page_ref: "p1890", snippet: "beta blocker", agreement: "single" } ],
    receptor_targets: [ { value: "Beta-1 and beta-2 adrenergic antagonist", source_id: S, page_ref: "p1890", snippet: "beta", agreement: "single" } ],
    common_uses: [ { value: "Performance/situational anxiety, tremor, hypertension, migraine prophylaxis.", source_id: S, page_ref: "p1890", snippet: "performance anxiety", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Propranolol calms the body's stress response (racing heart, shaking), which is why it helps performance anxiety.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p1890", snippet: "beta blocker", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 40, range_high: 400, unit: "mg", band_label: "Oral dose range",
        frequency: "divided", primary_purpose: "Anxiety / tremor / hypertension", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "40–400 mg/day", source_id: S, page_ref: "p1890", snippet: "40–400 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // TRIFLUOPERAZINE — psychosis 15–20 mg.
  {
    generic_name: "Trifluoperazine",
    drug_class: "Dopamine antagonist (antipsychotic)",
    subclass: "Phenothiazine (piperazine)",
    brand_names: ["Stelazine", "Neocalm"], aliases: [],
    mechanism: [ { value: "Blocks dopamine D2 receptors; high-potency typical antipsychotic.", source_id: S, page_ref: "p2290", snippet: "dopamine antagonist", agreement: "single" } ],
    receptor_targets: [ { value: "D2 antagonist", source_id: S, page_ref: "p2290", snippet: "dopamine", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia, psychosis.", source_id: S, page_ref: "p2290", snippet: "psychosis", agreement: "single" } ],
    equivalences: [ { drug_b: "Chlorpromazine", note: "chlorpromazine 100 mg ≈ trifluoperazine 5 mg (FGA)", caveat: "Rough guide, not a swap instruction. Only a prescriber decides this.", source: { value: "Table 1.2", source_id: M, page_ref: "p35", snippet: "Trifluoperazine 5mg/day", agreement: "full" } } ],
    links: [], clinical_presentations: [],
    student: { plain_language: { text: "Trifluoperazine is a high-potency antipsychotic; oral psychosis dosing sits around 15–20 mg.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p2290", snippet: "dopamine antagonist", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 15, range_high: 20, unit: "mg", band_label: "Psychosis dose",
        frequency: "oral", primary_purpose: "Psychosis", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "15–20 mg/day oral for psychosis", source_id: S, page_ref: "p2290", snippet: "psychosis: 15–20 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // TEMAZEPAM — 15 mg at bedtime.
  {
    generic_name: "Temazepam",
    drug_class: "Benzodiazepine",
    subclass: "GABA-A PAM (intermediate-acting)",
    brand_names: ["Restoril"], aliases: [],
    mechanism: [ { value: "Enhances GABA-mediated inhibition; intermediate-acting hypnotic benzodiazepine.", source_id: S, page_ref: "p2260", snippet: "benzodiazepine hypnotic", agreement: "single" } ],
    receptor_targets: [ { value: "GABAA benzodiazepine site", source_id: S, page_ref: "p2260", snippet: "benzodiazepine", agreement: "single" } ],
    common_uses: [ { value: "Short-term insomnia.", source_id: S, page_ref: "p2260", snippet: "insomnia", agreement: "single" } ],
    equivalences: [ { drug_b: "Diazepam", note: "temazepam 20 mg ≈ diazepam 10 mg (diazepam-equivalent)", caveat: "Rough guide, not a swap instruction. Only a prescriber decides this.", source: { value: "Table 3.29", source_id: M, page_ref: "p463", snippet: "Temazepam 20mg", agreement: "full" } } ],
    links: [], clinical_presentations: [],
    student: { plain_language: { text: "Temazepam is a sleep benzodiazepine; the usual bedtime dose is 15 mg.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p2260", snippet: "insomnia", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 15, range_high: 15, unit: "mg", band_label: "Usual dose",
        frequency: "at bedtime", primary_purpose: "Insomnia", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        source_ref: { value: "15 mg/day at bedtime", source_id: S, page_ref: "p2260", snippet: "15 mg/day at bedtime", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // MELATONIN — 2–5 mg at night.
  {
    generic_name: "Melatonin",
    drug_class: "Circadian-regulating hormone",
    subclass: "Endogenous hormone supplement",
    brand_names: [], aliases: [],
    mechanism: [ { value: "Signals the brain's circadian clock to promote sleep onset; used for sleep phase disorders.", source_id: FDA, page_ref: "FDA label", snippet: "circadian", agreement: "single" } ],
    receptor_targets: [ { value: "MT1/MT2 melatonin receptors", source_id: FDA, page_ref: "FDA label", snippet: "melatonin receptor", agreement: "single" } ],
    common_uses: [ { value: "Sleep-onset difficulty, jet lag, circadian rhythm disorders.", source_id: FDA, page_ref: "FDA label", snippet: "sleep", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Melatonin tells the brain's clock it's night; small bedtime doses help falling asleep.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "circadian", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 2, range_high: 5, unit: "mg", band_label: "Usual dose",
        frequency: "at night", primary_purpose: "Sleep-onset difficulty", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        source_ref: { value: "2–5 mg at night (typical OTC)", source_id: FDA, page_ref: "FDA label", snippet: "2–5 mg", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },
];