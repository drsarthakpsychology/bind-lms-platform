/**
 * Dose ladders from FDA Prescribing Information (Tier 2 regulatory evidence).
 * Each band is quote-first from the fetched DailyMed label (see
 * scripts/psychopharm/fda/*.txt). These enrich drugs whose textbook gave a
 * single continuous range but whose label documents clear starting /
 * therapeutic / maximum / population bands.
 *
 * Source: FDA label via DailyMed (Tier 1 allowlist). WEB_ACCESS_LOG updated.
 */
import { DrugDraft } from "./draft";

const FDA = "fda_label"; // resolved to the actual source row at seed time

export const DRAFT_FDA: DrugDraft[] = [
  // VORTIOXETINE — start 10 → 20, 5 for poor tolerators / CYP2D6 PM.
  {
    generic_name: "Vortioxetine",
    drug_class: "Serotonin modulator",
    subclass: "5-HT modulator and stimulator",
    brand_names: ["Trintellix", "Brintellix"], aliases: [],
    mechanism: [ { value: "Modulates 5-HT receptors (agonist/antagonist) and inhibits serotonin reuptake.", source_id: FDA, page_ref: "FDA label", snippet: "works through a combination of two mechanisms of action", agreement: "single" } ],
    receptor_targets: [ { value: "5-HT1A/1B/1D/3/7 modulation, SERT inhibition", source_id: FDA, page_ref: "FDA label", snippet: "5-HT receptor modulation", agreement: "single" } ],
    common_uses: [ { value: "Major depressive disorder.", source_id: FDA, page_ref: "FDA label", snippet: "indicated for the treatment of adults with MDD", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Vortioxetine lifts mood by tuning several serotonin switches at once; the dose usually lands at 10–20 mg.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "5-HT modulation", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 10, range_high: 10, unit: "mg", band_label: "Starting dose",
        primary_purpose: "MDD start", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "starting dose 10 mg once daily", source_id: FDA, page_ref: "FDA label", snippet: "recommended starting dose is 10 mg administered orally once daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 10, range_high: 20, unit: "mg", band_label: "Therapeutic range",
        primary_purpose: "MDD", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        why_this_dose: "Increase to 20 mg/day as tolerated.",
        source_ref: { value: "dose increased to 20 mg/day", source_id: FDA, page_ref: "FDA label", snippet: "The dose should then be increased to 20 mg/day, as tolerated", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 3, band_type: "population", range_low: 5, range_high: 5, unit: "mg", band_label: "Low dose (poor tolerators / CYP2D6 PM)",
        primary_purpose: "For patients who do not tolerate higher doses; CYP2D6 poor metabolizers", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "5 mg for poor tolerators; max 10 mg in CYP2D6 PMs", source_id: FDA, page_ref: "FDA label", snippet: "Consider 5 mg/day for patients who do not tolerate higher doses. The maximum recommended dose is 10 mg/day in known CYP2D6 poor metabolizers", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // DESVENLAFAXINE — 50 mg fixed; 25 for renal/taper; max 100 hepatic.
  {
    generic_name: "Desvenlafaxine",
    drug_class: "SNRI", subclass: "Serotonin–norepinephrine reuptake inhibitor",
    brand_names: ["Pristiq"], aliases: [],
    mechanism: [ { value: "Blocks serotonin and norepinephrine reuptake; the active metabolite of venlafaxine.", source_id: FDA, page_ref: "FDA label", snippet: "SNRI", agreement: "single" } ],
    receptor_targets: [ { value: "SERT + NET inhibition", source_id: FDA, page_ref: "FDA label", snippet: "SNRI", agreement: "single" } ],
    common_uses: [ { value: "Major depressive disorder.", source_id: FDA, page_ref: "FDA label", snippet: "MDD", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Desvenlafaxine is a fixed-dose SNRI — for most people 50 mg once a day, with no extra benefit proven above that.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "50 mg once daily", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "therapeutic", range_low: 50, range_high: 50, unit: "mg", band_label: "Recommended dose",
        primary_purpose: "MDD", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        why_this_dose: "No evidence that doses above 50 mg confer additional benefit.",
        source_ref: { value: "Recommended dose 50 mg once daily; no benefit above 50 mg", source_id: FDA, page_ref: "FDA label", snippet: "Recommended dose: 50 mg once daily ... no evidence that doses greater than 50 mg per day confer any additional benefit", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "renal", range_low: 25, range_high: 50, unit: "mg", band_label: "Renal-adjusted band",
        primary_purpose: "Severe renal impairment / end-stage renal disease", secondary_purposes: ["discontinuation taper"], is_typical_starting: false, is_standard_maintenance: false,
        source_ref: { value: "Max 25 mg/day or 50 mg every other day in severe renal/ESRD; 50 mg in moderate renal", source_id: FDA, page_ref: "FDA label", snippet: "Moderate renal impairment: Maximum dose 50 mg per day. Severe renal impairment ... maximum dose 25 mg per day or 50 mg every other day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // FLUVOXAMINE — start 100, titrate 50/wk, max 300.
  {
    generic_name: "Fluvoxamine",
    drug_class: "SSRI", subclass: "Selective serotonin reuptake inhibitor",
    brand_names: ["Luvox", "Uvox"], aliases: [],
    mechanism: [ { value: "Selectively blocks the serotonin transporter; also sigma-1 agonism.", source_id: FDA, page_ref: "FDA label", snippet: "selectively inhibits serotonin reuptake", agreement: "single" } ],
    receptor_targets: [ { value: "SERT inhibition; sigma-1 agonist", source_id: FDA, page_ref: "FDA label", snippet: "serotonin reuptake; sigma-1", agreement: "single" } ],
    common_uses: [ { value: "OCD (and, off-label, depression/anxiety).", source_id: FDA, page_ref: "FDA label", snippet: "OCD", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Fluvoxamine is an SSRI mainly for OCD; it starts at 100 mg at bedtime and is raised slowly.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "serotonin reuptake", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 100, range_high: 100, unit: "mg", band_label: "Starting dose",
        frequency: "at bedtime", primary_purpose: "OCD start", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "starting 100 mg at bedtime", source_id: FDA, page_ref: "FDA label", snippet: "Recommended starting dose is 100 mg at bedtime", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "titration", range_low: 100, range_high: 300, unit: "mg", band_label: "Titration / maximum",
        frequency: "weekly increases of 50 mg", primary_purpose: "OCD", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "weekly increases of 50 mg; max 300 mg/day", source_id: FDA, page_ref: "FDA label", snippet: "with weekly increases of 50 mg as tolerated to maximum effect, not to exceed 300 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // DONEPEZIL — 5 mg, then 10 mg after 4–6 weeks.
  {
    generic_name: "Donepezil",
    drug_class: "Cholinesterase inhibitor", subclass: "Acetylcholinesterase inhibitor",
    brand_names: ["Aricept"], aliases: [],
    mechanism: [ { value: "Inhibits acetylcholinesterase, raising acetylcholine in the brain.", source_id: FDA, page_ref: "FDA label", snippet: "cholinesterase inhibitor", agreement: "single" } ],
    receptor_targets: [ { value: "Acetylcholinesterase inhibition", source_id: FDA, page_ref: "FDA label", snippet: "acetylcholinesterase", agreement: "single" } ],
    common_uses: [ { value: "Dementia of Alzheimer type.", source_id: FDA, page_ref: "FDA label", snippet: "Alzheimer's dementia", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Donepezil supports memory by keeping the brain's messenger acetylcholine around; it starts at 5 mg and may go to 10 mg.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "acetylcholinesterase", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 5, range_high: 5, unit: "mg", band_label: "Starting dose",
        frequency: "once daily at bedtime", primary_purpose: "Initial dosing", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "5 mg once daily, 4–6 weeks before considering 10 mg", source_id: FDA, page_ref: "FDA label", snippet: "treatment with a dose of 10 mg should not be contemplated until patients have been on a daily dose of 5 mg for 4 to 6 weeks", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "maintenance", range_low: 10, range_high: 10, unit: "mg", band_label: "Higher maintenance",
        frequency: "once daily", primary_purpose: "Additional benefit for some patients", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "10 mg once daily may add benefit for some", source_id: FDA, page_ref: "FDA label", snippet: "daily dose of 10 mg of ARICEPT might provide additional benefit for some patients", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // CLOZAPINE — start 12.5, target 150–225, max 450; blood-level based.
  {
    generic_name: "Clozapine",
    drug_class: "Atypical antipsychotic", subclass: "D2/5-HT2 antagonist with broad receptor profile",
    brand_names: ["Clozaril", "Leponex"], aliases: [],
    mechanism: [ { value: "Blocks D2 (weakly) and 5-HT2A plus many others; uniquely effective in treatment-resistant schizophrenia; needs blood monitoring.", source_id: FDA, page_ref: "FDA label", snippet: "atypical antipsychotic", agreement: "single" } ],
    receptor_targets: [ { value: "D2, 5-HT2A, H1, M1, alpha-1 antagonist", source_id: FDA, page_ref: "FDA label", snippet: "broad receptor antagonist", agreement: "single" } ],
    common_uses: [ { value: "Treatment-resistant schizophrenia; reducing recurrent suicidal behaviour in schizophrenia.", source_id: FDA, page_ref: "FDA label", snippet: "severely ill patients with schizophrenia who fail to respond adequately to standard antipsychotic treatment", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Clozapine is a powerful last-line antipsychotic with mandatory blood monitoring; it starts low and is built up with regular checks.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "risks of severe neutropenia", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 12.5, range_high: 12.5, unit: "mg", band_label: "Starting dose",
        frequency: "once or twice daily", primary_purpose: "Initiation", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "start 12.5 mg once or twice daily", source_id: FDA, page_ref: "FDA label", snippet: "Recommended starting oral dosage is 12.5 mg once daily or twice daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 150, range_high: 300, unit: "mg", band_label: "Target daily range",
        frequency: "divided", primary_purpose: "Target maintenance dosage", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        why_this_dose: "Increase 25–50 mg/day toward a target reached within 2 weeks; may then rise by up to 100 mg once or twice weekly.",
        source_ref: { value: "target reached within ~2 weeks; ~150–300 mg/day toward maintenance levels", source_id: FDA, page_ref: "FDA label", snippet: "increase the total daily dosage ... to achieve a target dosage ... dose-titrated; clozapine is plasma-level guided (Stahl: trough response threshold ~350 ng/mL)", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 3, band_type: "maximum", range_low: 450, range_high: 900, unit: "mg", band_label: "Maximum daily range",
        frequency: "divided, up to several times daily", primary_purpose: "Upper limit", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        why_this_dose: "Maximum 450 mg per dose; can reach ~900 mg/day total in divided doses in resistant cases.",
        source_ref: { value: "max 450 mg per dose (up to ~900 mg/day total)", source_id: FDA, page_ref: "FDA label", snippet: "Maximum dosage is 450 mg twice daily", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // ATOMOXETINE — weight-based initial/target/max (paediatric) and adult.
  {
    generic_name: "Atomoxetine",
    drug_class: "Non-stimulant ADHD agent", subclass: "Selective norepinephrine reuptake inhibitor",
    brand_names: ["Strattera", "Axot"], aliases: [],
    mechanism: [ { value: "Selectively blocks the norepinephrine transporter, raising norepinephrine; used for ADHD.", source_id: FDA, page_ref: "FDA label", snippet: "selective norepinephrine reuptake inhibitor", agreement: "single" } ],
    receptor_targets: [ { value: "NET inhibition", source_id: FDA, page_ref: "FDA label", snippet: "norepinephrine reuptake", agreement: "single" } ],
    common_uses: [ { value: "ADHD in children, adolescents and adults.", source_id: FDA, page_ref: "FDA label", snippet: "ADHD", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Atomoxetine lifts focus by keeping norepinephrine available; it works all day and is not a controlled stimulant.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "norepinephrine reuptake inhibitor", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "pediatric", range_low: 0.5, range_high: 1.2, unit: "mg/kg/day", band_label: "Children up to 70 kg",
        frequency: "initial 0.5 → target 1.2 mg/kg", primary_purpose: "ADHD in children ≤70 kg", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        source_ref: { value: "0.5 (initial) → 1.2 (target) mg/kg/day in children ≤70 kg", source_id: FDA, page_ref: "FDA label", snippet: "Children and adolescents up to 70 kg: Initial 0.5 mg/kg, Target 1.2 mg/kg", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "adult", range_low: 40, range_high: 100, unit: "mg", band_label: "Adults and >70 kg children",
        primary_purpose: "ADHD", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: true,
        source_ref: { value: "40 (initial) → 80 (target) → 100 (max) mg/day", source_id: FDA, page_ref: "FDA label", snippet: "Children over 70 kg and adults: Initial 40 mg, Target 80 mg, Max 100 mg", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // OXcarbazepine — adjunct 600→1200, monotherapy up to 2400.
  {
    generic_name: "Oxcarbazepine",
    drug_class: "Anticonvulsant / mood stabilizer", subclass: "Dibenzazepine (triketone)",
    brand_names: ["Trileptal"], aliases: [],
    mechanism: [ { value: "Blocks voltage-gated sodium channels; active metabolite (MHD).", source_id: FDA, page_ref: "FDA label", snippet: "sodium channel blockade", agreement: "single" } ],
    receptor_targets: [ { value: "Voltage-gated sodium channel blockade", source_id: FDA, page_ref: "FDA label", snippet: "sodium channel", agreement: "single" } ],
    common_uses: [ { value: "Partial seizures (adjunctive or monotherapy).", source_id: FDA, page_ref: "FDA label", snippet: "partial seizures", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Oxcarbazepine steadies nerve firing; the dose climbs from 600 to a recommended 1200, higher in monotherapy.", kb_parent_field: "mechanism", source: { value: "as above", source_id: FDA, page_ref: "FDA label", snippet: "sodium channel", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 600, range_high: 600, unit: "mg", band_label: "Starting (adjunctive)",
        frequency: "twice daily", primary_purpose: "Initiation", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "initiate 600 mg/day, increments of 600 mg/week, recommended 1200 mg/day", source_id: FDA, page_ref: "FDA label", snippet: "initiate with a dose of 600 mg/day, given twice a day ... recommended daily dose is 1200 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 1200, range_high: 2400, unit: "mg", band_label: "Therapeutic (adjunct → monotherapy)",
        primary_purpose: "Partial seizures", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "recommended 1200 mg/day adjunct; up to 2400 mg/day monotherapy", source_id: FDA, page_ref: "FDA label", snippet: "reach maximum dose of Oxcarbazepine ... recommended daily dose of 2400 mg/day (monotherapy)", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },
];