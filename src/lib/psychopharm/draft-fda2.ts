/**
 * FDA-label dose ladders (batch 2) — sleep agents, anticonvulsants, and the
 * dementia agents. Quote-first from the fetched DailyMed labels.
 */
import { DrugDraft } from "./draft";

const FDA = "fda_label";

export const DRAFT_FDA_2: DrugDraft[] = [
  // ZOLPIDEM — 10 mg adult, 5 mg elderly/hepatic.
  {
    generic_name: "Zolpidem",
    drug_class: "Sedative-hypnotic (non-benzodiazepine Z-drug)",
    subclass: "GABA-A positive modulator (imidazopyridine)",
    brand_names: ["Ambien", "Zolt"], aliases: [],
    mechanism: [ { value: "Binds the benzodiazepine site on GABA-A, enhancing GABA (selective alpha-1 effect); short-acting hypnotic.", source_id: FDA, page_ref: "FDA label", snippet: "GABA-A receptor ... hypnotic", agreement: "single" } ],
    receptor_targets: [ { value: "GABAA (alpha-1 subunit) positive modulator", source_id: FDA, page_ref: "FDA label", snippet: "GABA-A", agreement: "single" } ],
    common_uses: [ { value: "Short-term insomnia.", source_id: FDA, page_ref: "FDA label", snippet: "insomnia", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Zolpidem helps sleep onset; the standard dose is 10 mg, and older adults are started at half that because of fall risk.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "insomnia", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 10, range_high: 10, unit: "mg", band_label: "Adult dose",
        frequency: "at bedtime", primary_purpose: "Insomnia (adults)", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        source_ref: { value: "10 mg once daily immediately before bedtime", source_id: FDA, page_ref: "FDA label", snippet: "Adult dose: 10 mg once daily immediately before bedtime", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "geriatric", range_low: 5, range_high: 5, unit: "mg", band_label: "Elderly / hepatic dose",
        frequency: "at bedtime", primary_purpose: "Insomnia in older adults or hepatic impairment", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "5 mg in elderly/debilitated/hepatic impairment", source_id: FDA, page_ref: "FDA label", snippet: "Elderly/debilitated patients/hepatically impaired: 5 mg once daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // ESZOPICLONE — start 1 mg, up to 3 mg.
  {
    generic_name: "Eszopiclone",
    drug_class: "Sedative-hypnotic (non-benzodiazepine Z-drug)",
    subclass: "Cyclopyrrolone",
    brand_names: ["Lunesta"], aliases: [],
    mechanism: [ { value: "Enhances GABA-A-mediated inhibition; non-benzodiazepine hypnotic.", source_id: FDA, page_ref: "FDA label", snippet: "GABA-A ... hypnotic", agreement: "single" } ],
    receptor_targets: [ { value: "GABAA positive modulator", source_id: FDA, page_ref: "FDA label", snippet: "GABA-A", agreement: "single" } ],
    common_uses: [ { value: "Insomnia (sleep-onset and sleep-maintenance).", source_id: FDA, page_ref: "FDA label", snippet: "insomnia", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Eszopiclone is a sleep aid started at 1 mg and raised only as needed, up to 3 mg.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "insomnia", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 1, range_high: 1, unit: "mg", band_label: "Initial dose",
        frequency: "at bedtime", primary_purpose: "Insomnia", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "initial 1 mg at bedtime; up to 3 mg", source_id: FDA, page_ref: "FDA label", snippet: "Recommended initial dose is 1 mg, immediately before bedtime", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 1, range_high: 3, unit: "mg", band_label: "Dose range",
        frequency: "at bedtime", primary_purpose: "Insomnia", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "1–3 mg; use lowest effective dose", source_id: FDA, page_ref: "FDA label", snippet: "Use the lowest dose effective for the patient", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // LEVETIRACETAM — 1000 → 3000.
  {
    generic_name: "Levetiracetam",
    drug_class: "Anticonvulsant",
    subclass: "SV2A-binding racetam",
    brand_names: ["Keppra"], aliases: [],
    mechanism: [ { value: "Binds synaptic vesicle protein SV2A, modulating neurotransmitter release; anticonvulsant.", source_id: FDA, page_ref: "FDA label", snippet: "SV2A", agreement: "single" } ],
    receptor_targets: [ { value: "SV2A binding", source_id: FDA, page_ref: "FDA label", snippet: "SV2A", agreement: "single" } ],
    common_uses: [ { value: "Partial-onset seizures (adjunctive), myoclonic seizures, generalized tonic-clonic.", source_id: FDA, page_ref: "FDA label", snippet: "seizures", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Levetiracetam steadies nerve firing; the dose starts at 1000 mg once daily and can rise to 3000 mg.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "SV2A", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 1000, range_high: 1000, unit: "mg", band_label: "Starting dose",
        frequency: "once daily", primary_purpose: "Initiation", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "initiate 1000 mg once daily", source_id: FDA, page_ref: "FDA label", snippet: "Initiate treatment with a dose of 1,000 mg once daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 1000, range_high: 3000, unit: "mg", band_label: "Titration / maximum",
        frequency: "increase by 1000 mg every 2 weeks", primary_purpose: "Seizure control", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "increase by 1000 mg every 2 weeks to max 3000 mg once daily", source_id: FDA, page_ref: "FDA label", snippet: "increase by 1,000 mg every 2 weeks to a maximum recommended dose of 3,000 mg once daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // MEMANTINE — 5–28 mg (NMDA antagonist for dementia).
  {
    generic_name: "Memantine",
    drug_class: "NMDA receptor antagonist",
    subclass: "Anti-dementia agent",
    brand_names: ["Namenda"], aliases: [],
    mechanism: [ { value: "Blocks NMDA-type glutamate receptors (low-to-moderate affinity), reducing excitotoxicity; cognitive enhancer.", source_id: FDA, page_ref: "FDA label", snippet: "NMDA receptor antagonist", agreement: "single" } ],
    receptor_targets: [ { value: "NMDA glutamate receptor antagonist", source_id: FDA, page_ref: "FDA label", snippet: "NMDA", agreement: "single" } ],
    common_uses: [ { value: "Moderate-to-severe Alzheimer's dementia.", source_id: FDA, page_ref: "FDA label", snippet: "Alzheimer", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Memantine dampens glutamate 'noise' that can damage brain cells, helping in moderate-to-severe Alzheimer's.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "NMDA antagonist", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 5, range_high: 5, unit: "mg", band_label: "Starting dose",
        primary_purpose: "Initiation", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "start 5 mg once daily, titrate to 10 mg twice daily", source_id: FDA, page_ref: "FDA label", snippet: "5 mg once daily, increase to maintenance 10 mg twice daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "maintenance", range_low: 20, range_high: 28, unit: "mg", band_label: "Maintenance dose",
        primary_purpose: "Alzheimer's dementia", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "maintenance 20 mg/day (10 mg bd) or 28 mg ER once daily", source_id: FDA, page_ref: "FDA label", snippet: "maintenance dose of 28 mg/10 mg extended-release once daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },
];