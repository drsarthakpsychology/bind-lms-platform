/**
 * FDA-label dose ladders (batch 3) — MAOIs, stimulants, antipsychotics,
 * dementia patches, alpha-blockers. Quote-first from fetched labels.
 */
import { DrugDraft } from "./draft";

const FDA = "fda_label";

export const DRAFT_FDA_3: DrugDraft[] = [
  // PHENELZINE — 15 mg TID → ≥60 → 90, maintenance 15 mg.
  {
    generic_name: "Phenelzine",
    drug_class: "MAOI antidepressant",
    subclass: "Monoamine oxidase inhibitor (non-selective, irreversible)",
    brand_names: ["Nardil"], aliases: [],
    mechanism: [ { value: "Irreversibly inhibits MAO-A and MAO-B, raising monoamines; dietary tyramine restriction needed.", source_id: FDA, page_ref: "FDA label", snippet: "MAO inhibitor", agreement: "single" } ],
    receptor_targets: [ { value: "MAO-A and MAO-B inhibition", source_id: FDA, page_ref: "FDA label", snippet: "monoamine oxidase inhibitor", agreement: "single" } ],
    common_uses: [ { value: "Atypical depression (a MAOI, third-line given dietary restrictions).", source_id: FDA, page_ref: "FDA label", snippet: "depression", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Phenelzine is an older, powerful antidepressant that needs strict food rules (no aged cheese, etc.).", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "MAO inhibitor", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 45, range_high: 45, unit: "mg", band_label: "Starting dose",
        frequency: "15 mg three times a day", primary_purpose: "Initiation", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "15 mg three times a day, increase to ≥60 mg/day", source_id: FDA, page_ref: "FDA label", snippet: "one tablet (15 mg) three times a day ... increased to at least 60 mg per day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 60, range_high: 90, unit: "mg", band_label: "Therapeutic range",
        primary_purpose: "Depression", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        why_this_dose: "Many need 60 mg for ≥4 weeks before response.",
        source_ref: { value: "60–90 mg/day; many need 60 mg for 4 weeks", source_id: FDA, page_ref: "FDA label", snippet: "at least 60 mg per day ... up to 90 mg per day to obtain sufficient MAO inhibition ... continued for at least 4 weeks", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 3, band_type: "maintenance", range_low: 15, range_high: 15, unit: "mg", band_label: "Maintenance",
        primary_purpose: "Long-term maintenance", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "maintenance 15 mg daily or every other day", source_id: FDA, page_ref: "FDA label", snippet: "maintenance dose ... 15 mg, a day or every other day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // TRANYLCYPROMINE — 30 → 60.
  {
    generic_name: "Tranylcypromine",
    drug_class: "MAOI antidepressant",
    subclass: "Monoamine oxidase inhibitor (non-selective, irreversible)",
    brand_names: ["Parnate"], aliases: [],
    mechanism: [ { value: "Irreversibly inhibits MAO, raising monoamines; dietary tyramine restriction needed.", source_id: FDA, page_ref: "FDA label", snippet: "MAO inhibitor", agreement: "single" } ],
    receptor_targets: [ { value: "MAO-A and MAO-B inhibition", source_id: FDA, page_ref: "FDA label", snippet: "monoamine oxidase", agreement: "single" } ],
    common_uses: [ { value: "Depression (MAOI, third-line).", source_id: FDA, page_ref: "FDA label", snippet: "depression", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Tranylcypromine is an older MAOI antidepressant with food restrictions and blood-pressure monitoring.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "MAO inhibitor", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 30, range_high: 30, unit: "mg", band_label: "Starting dose",
        frequency: "divided", primary_purpose: "Initiation", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "30 mg in divided doses; increase by 10 mg/day every 1–3 weeks", source_id: FDA, page_ref: "FDA label", snippet: "30 mg in divided doses. If no adequate response, increase dosage in increments of 10 mg per day every 1 to 3 weeks", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 30, range_high: 60, unit: "mg", band_label: "Therapeutic / maximum",
        primary_purpose: "Depression", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "up to 30 mg twice daily (60 mg/day)", source_id: FDA, page_ref: "FDA label", snippet: "30 mg twice daily (60 mg per day)", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // MODAFINIL — 200 mg once daily (narcolepsy / SWD / OSA).
  {
    generic_name: "Modafinil",
    drug_class: "Wakefulness-promoting agent",
    subclass: "Non-amphetamine (dopamine-related)",
    brand_names: ["Provigil"], aliases: [],
    mechanism: [ { value: "Promotes wakefulness via dopamine-related mechanisms (DAT inhibition); not a classic stimulant.", source_id: FDA, page_ref: "FDA label", snippet: "wakefulness-promoting", agreement: "single" } ],
    receptor_targets: [ { value: "DAT inhibition (dopamine transporter)", source_id: FDA, page_ref: "FDA label", snippet: "dopamine transporter", agreement: "single" } ],
    common_uses: [ { value: "Narcolepsy, shift-work sleep disorder, obstructive sleep apnoea (adjunct).", source_id: FDA, page_ref: "FDA label", snippet: "narcolepsy ... SWD", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Modafinil keeps people awake without the jolt of classic stimulants; most take 200 mg once a day.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "wakefulness", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 200, range_high: 200, unit: "mg", band_label: "Recommended dose",
        frequency: "once daily in the morning", primary_purpose: "Narcolepsy / SWD / OSA", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        source_ref: { value: "200 mg once a day in the morning", source_id: FDA, page_ref: "FDA label", snippet: "200 mg once a day in the morning", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // FLUPHENAZINE — 5–60 mg (20 effective).
  {
    generic_name: "Fluphenazine",
    drug_class: "Dopamine antagonist (antipsychotic)",
    subclass: "Phenothiazine (piperazine)",
    brand_names: ["Prolixin"], aliases: [],
    mechanism: [ { value: "Blocks dopamine D2 receptors; high-potency typical antipsychotic.", source_id: FDA, page_ref: "FDA label", snippet: "dopamine antagonist", agreement: "single" } ],
    receptor_targets: [ { value: "D2 antagonist", source_id: FDA, page_ref: "FDA label", snippet: "dopamine", agreement: "single" } ],
    common_uses: [ { value: "Schizophrenia, psychosis.", source_id: FDA, page_ref: "FDA label", snippet: "schizophrenia", agreement: "single" } ],
    equivalences: [ { drug_b: "Chlorpromazine", note: "chlorpromazine 100 mg ≈ fluphenazine 2 mg (FGA)", caveat: "Rough guide, not a swap instruction. Only a prescriber decides this.", source: { value: "Table 1.2", source_id: "maudsley_2021", page_ref: "p35", snippet: "Fluphenazine 2mg/day", agreement: "full" } } ],
    links: [], clinical_presentations: [],
    student: { plain_language: { text: "Fluphenazine is a high-potency antipsychotic; the effective dose is often around 20 mg but ranges widely.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "dopamine antagonist", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 5, range_high: 60, unit: "mg", band_label: "Oral dose range",
        primary_purpose: "Psychosis", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        why_this_dose: "20 mg/day was equivalent to higher doses in the source trials.",
        source_ref: { value: "5–60 mg/day; 20 mg effective", source_id: FDA, page_ref: "FDA label", snippet: "doses from 5 to 60 mg ... 20 mg fluphenazine hydrochloride daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // RIVASTIGMINE — oral 6–12 mg; transdermal 4.6–13.3 mg/24h.
  {
    generic_name: "Rivastigmine",
    drug_class: "Cholinesterase inhibitor",
    subclass: "Carbamate acetylcholinesterase inhibitor",
    brand_names: ["Exelon"], aliases: [],
    mechanism: [ { value: "Inhibits acetylcholinesterase (and butyrylcholinesterase), raising acetylcholine.", source_id: FDA, page_ref: "FDA label", snippet: "acetylcholinesterase inhibitor", agreement: "single" } ],
    receptor_targets: [ { value: "Acetylcholinesterase (and BuChE) inhibition", source_id: FDA, page_ref: "FDA label", snippet: "cholinesterase", agreement: "single" } ],
    common_uses: [ { value: "Mild-to-moderate Alzheimer's, Parkinson's disease dementia.", source_id: FDA, page_ref: "FDA label", snippet: "Alzheimer ... Parkinson's disease dementia", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Rivastigmine supports memory; it comes as a pill or a skin patch, and the patch has its own dose bands.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "cholinesterase inhibitor", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "formulation", range_low: 6, range_high: 12, unit: "mg", band_label: "Oral dose",
        frequency: "twice daily", primary_purpose: "Dementia", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "oral 6–12 mg/day in 2 doses", source_id: "stahl_pg_7th", page_ref: "p2011", snippet: "Oral: 6–12 mg/day in 2 doses", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "formulation", range_low: 4.6, range_high: 13.3, unit: "mg/24h", band_label: "Transdermal patch",
        frequency: "once daily", primary_purpose: "Dementia (patch)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        why_this_dose: "Start 4.6 mg/24h, may increase to 9.5 then 13.3 mg/24h after ≥4 weeks.",
        source_ref: { value: "patch 4.6–13.3 mg/24h; titrate up after ≥4 weeks", source_id: FDA, page_ref: "FDA label", snippet: "increase dosage to 13.3 mg/24 hours ... after a minimum of 4 weeks", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },
];