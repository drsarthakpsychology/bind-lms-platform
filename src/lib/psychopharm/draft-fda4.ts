/**
 * FDA-label dose ladders (batch 4) — acamprosate, disulfiram, cyproheptadine,
 * chlorpromazine. Quote-first from fetched labels.
 */
import { DrugDraft } from "./draft";

const FDA = "fda_label";

export const DRAFT_FDA_4: DrugDraft[] = [
  // ACAMPROSATE — 666 mg TID, 333 mg TID if renal/under 60kg.
  {
    generic_name: "Acamprosate",
    drug_class: "Alcohol-aversion / relapse-prevention agent",
    subclass: "Glutamate modulator",
    brand_names: ["Campral"], aliases: [],
    mechanism: [ { value: "Modulates glutamatergic transmission (NMDA), reducing alcohol craving and withdrawal distress.", source_id: FDA, page_ref: "FDA label", snippet: "reduction in alcohol consumption", agreement: "single" } ],
    receptor_targets: [ { value: "Glutamate (NMDA) modulation", source_id: FDA, page_ref: "FDA label", snippet: "glutamate", agreement: "single" } ],
    common_uses: [ { value: "Maintenance of alcohol abstinence.", source_id: FDA, page_ref: "FDA label", snippet: "alcohol abstinence", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Acamprosate helps steady the brain after stopping alcohol, reducing the pull back to drinking; it's taken three times a day.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "alcohol abstinence", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 666, range_high: 666, unit: "mg", band_label: "Usual dose",
        frequency: "three times daily", primary_purpose: "Alcohol abstinence", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        source_ref: { value: "666 mg three times daily", source_id: FDA, page_ref: "FDA label", snippet: "666 mg (two 333 mg tablets) taken three times daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "renal", range_low: 333, range_high: 333, unit: "mg", band_label: "Renal-adjusted dose",
        frequency: "three times daily", primary_purpose: "Moderate renal impairment or body weight <60 kg", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "333 mg three times daily (renal/low weight)", source_id: FDA, page_ref: "FDA label", snippet: "Dose reduction to one 333 mg tablet taken three times daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // DISULFIRAM — 500 loading 1–2 weeks → 250 maintenance.
  {
    generic_name: "Disulfiram",
    drug_class: "Alcohol-aversion agent",
    subclass: "Aldehyde dehydrogenase inhibitor",
    brand_names: ["Antabuse"], aliases: [],
    mechanism: [ { value: "Inhibits aldehyde dehydrogenase, causing acetaldehyde accumulation if alcohol is taken (aversive reaction).", source_id: FDA, page_ref: "FDA label", snippet: "aldehyde dehydrogenase inhibitor", agreement: "single" } ],
    receptor_targets: [ { value: "Aldehyde dehydrogenase inhibition", source_id: FDA, page_ref: "FDA label", snippet: "aldehyde dehydrogenase", agreement: "single" } ],
    common_uses: [ { value: "Aversion therapy in chronic alcoholism (with informed consent).", source_id: FDA, page_ref: "FDA label", snippet: "chronic alcoholism", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Disulfiram makes drinking unpleasant by blocking how the body clears alcohol; the dose starts higher and settles lower.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "aldehyde dehydrogenase", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 500, range_high: 500, unit: "mg", band_label: "Initial dose",
        frequency: "once daily for 1–2 weeks", primary_purpose: "Initiation", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "500 mg daily for one to two weeks", source_id: FDA, page_ref: "FDA label", snippet: "500 mg daily is given in a single dose for one to two weeks", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "maintenance", range_low: 125, range_high: 500, unit: "mg", band_label: "Maintenance range",
        frequency: "once daily", primary_purpose: "Ongoing aversion", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        why_this_dose: "Usual maintenance 250 mg; max 500 mg.",
        source_ref: { value: "maintenance 250 mg (125–500 mg range), not exceeding 500 mg", source_id: FDA, page_ref: "FDA label", snippet: "250 mg daily (range, 125 mg to 500 mg), it should not exceed 500 mg daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // CYPROHEPTADINE — weight/pediatric bands.
  {
    generic_name: "Cyproheptadine",
    drug_class: "Antihistamine",
    subclass: "H1 antagonist (serotonergic)",
    brand_names: ["Periactin"], aliases: [],
    mechanism: [ { value: "Blocks H1 histamine receptors (and 5-HT2); used for allergy and sometimes to stimulate appetite.", source_id: FDA, page_ref: "FDA label", snippet: "antihistamine", agreement: "single" } ],
    receptor_targets: [ { value: "H1 antagonist", source_id: FDA, page_ref: "FDA label", snippet: "histamine", agreement: "single" } ],
    common_uses: [ { value: "Allergic conditions; off-label appetite stimulation.", source_id: FDA, page_ref: "FDA label", snippet: "allergic", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Cyproheptadine is an antihistamine whose dose is worked out by body weight, especially in children.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "antihistamine", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "pediatric", range_low: 2, range_high: 8, unit: "mg", band_label: "Children 2–6 years",
        frequency: "2–3×/day", primary_purpose: "Allergy", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "2 mg 2–3×/day in children 2–6, max 12 mg/day", source_id: FDA, page_ref: "FDA label", snippet: "Age 2 to 6 years: The usual dose is 2 mg two or three times a day ... should not exceed 12 mg a day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "adult", range_low: 4, range_high: 20, unit: "mg", band_label: "Adults",
        frequency: "as needed", primary_purpose: "Allergy / appetite", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        why_this_dose: "Total adult daily dose should not exceed 0.5 mg/kg/day.",
        source_ref: { value: "adult therapeutic range; not to exceed 0.5 mg/kg/day", source_id: FDA, page_ref: "FDA label", snippet: "total daily dose for adults should not exceed 0.5 mg/kg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // CHLORPROMAZINE — 200–800; IM agitation bands.
  {
    generic_name: "Chlorpromazine",
    drug_class: "Dopamine antagonist (antipsychotic)",
    subclass: "Phenothiazine (aliphatic)",
    brand_names: ["Largactil", "Thorazine"], aliases: [],
    mechanism: [ { value: "Blocks dopamine D2 (and many other receptors); low-potency typical antipsychotic, sedating.", source_id: FDA, page_ref: "FDA label", snippet: "phenothiazine", agreement: "single" } ],
    receptor_targets: [ { value: "D2, H1, M1, alpha-1 antagonist", source_id: FDA, page_ref: "FDA label", snippet: "dopamine ... antihistaminic", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia, psychosis, intractable hiccups, agitation.", source_id: FDA, page_ref: "FDA label", snippet: "schizophrenia", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Chlorpromazine is an older, sedating antipsychotic; oral doses of 200–800 mg are common for psychosis.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "phenothiazine", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 200, range_high: 800, unit: "mg", band_label: "Oral therapeutic range",
        primary_purpose: "Psychosis", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "200 mg usual, up to 800 mg in some patients", source_id: FDA, page_ref: "FDA label", snippet: "200 mg is not unusual ... 800 mg daily is not uncommon", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "formulation", range_low: 25, range_high: 50, unit: "mg", band_label: "IM agitation dose",
        frequency: "repeat after 1 h if needed", primary_purpose: "Acute agitation (IM)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "IM 25 mg, additional 25–50 mg in 1 hour", source_id: FDA, page_ref: "FDA label", snippet: "25 mg ... If necessary, give additional 25 to 50 mg injection in 1 hour", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },
];