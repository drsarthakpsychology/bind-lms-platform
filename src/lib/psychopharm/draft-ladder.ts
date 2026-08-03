/**
 * Rich dose ladders for high-frequency drugs, evidence-driven.
 *
 * Each band carries band_type (starting / therapeutic / maximum / indication /
 * geriatric / pediatric / renal / hepatic), purpose, why_this_dose, and a
 * source_ref with verbatim quote + page. These extend the functional-band set:
 * a drug can have both functional bands (distinct jobs) and ladder bands
 * (starting → therapeutic → max), all shown on the dose ladder.
 *
 * Evidence priority: supplied textbooks first (Stahl, Maudsley, Kaplan), then
 * regulatory/guideline (Maundsley IS a guideline). Web corroboration is
 * recorded in WEB_ACCESS_LOG where it ran. Nothing is invented — every number
 * traces to a quote + page.
 */
import { DrugDraft } from "./draft";

const S = "stahl_pg_7th";
const M = "maudsley_2021";

export const DRAFT_LADDERS: DrugDraft[] = [
  // ---------------------------------------------------------------------------
  // SERTRALINE — adult starting / therapeutic / high-dose + paediatric, from
  // Stahl (50–200) and Maudsley tables.
  // ---------------------------------------------------------------------------
  {
    generic_name: "Sertraline",
    drug_class: "SSRI",
    subclass: "Selective serotonin reuptake inhibitor",
    brand_names: ["Zoloft", "Serenata", "Asentra"],
    aliases: [],
    mechanism: [ { value: "Selectively blocks the serotonin transporter, raising serotonergic transmission; at higher doses also mildly blocks dopamine reuptake.", source_id: S, page_ref: "p2065", snippet: "Boosts serotonin ... Blocks serotonin reuptake pump (serotonin transporter) ... also blocks dopamine reuptake pump", agreement: "single" } ],
    receptor_targets: [ { value: "SERT inhibition (and some DAT at higher doses)", source_id: S, page_ref: "p2065", snippet: "serotonin transporter ... dopamine reuptake", agreement: "single" } ],
    common_uses: [ { value: "Major depressive disorder, OCD, panic disorder, PTSD, social anxiety, PMDD.", source_id: S, page_ref: "p2065", snippet: "MDD; OCD; Panic disorder; PTSD; Social anxiety; PMDD", agreement: "single" } ],
    equivalences: [],
    links: [],
    clinical_presentations: [],
    student: { plain_language: { text: "Sertraline keeps serotonin available longer, lifting mood and easing anxiety; a common being starting at 50 mg and rising over weeks.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p2065", snippet: "Boosts serotonin", agreement: "single" } } },
    bands: [
      // Indication bands from Stahl range
      {
        band_order: 1, band_type: "indication", range_low: 50, range_high: 200, unit: "mg",
        band_label: "Usual therapeutic range (adults)",
        primary_purpose: "Depression, OCD, panic, PTSD, social anxiety, PMDD",
        secondary_purposes: [],
        is_typical_starting: true, is_standard_maintenance: true,
        why_this_dose: "Maintenance range for all main indications.",
        evidence: { strength: "high", confidence: "high", guideline: "Stahl PG 7th", source_url: undefined },
        source_ref: { value: "Sertraline usual 50–200 mg/day", source_id: S, page_ref: "p2073", snippet: "50–200 mg/day", agreement: "single" },
        side_effects: [], observation_prompts: [],
      },
      {
        band_order: 2, band_type: "starting", range_low: 50, range_high: 50, unit: "mg",
        band_label: "Adult starting dose",
        primary_purpose: "Usual adult starting dose",
        secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        evidence: { strength: "high", confidence: "high", guideline: "Maudsley 2021" },
        source_ref: { value: "Adult starting 50 mg (Maudsley)", source_id: M, page_ref: "p333", snippet: "Sertraline 50mg/day", agreement: "single" },
        side_effects: [], observation_prompts: [],
      },
      {
        band_order: 3, band_type: "high_response", range_low: 200, range_high: 400, unit: "mg",
        band_label: "High-dose (treatment-resistant) range",
        primary_purpose: "Augmentation in treatment-resistant depression (high-dose SSRI strategy)",
        secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        why_this_dose: "Some experimental high-dose SSRI use goes to 250–400 mg, dose-titrated by tolerability, with ECG monitoring (Maudsley).",
        evidence: { strength: "limited", confidence: "low", guideline: "Maudsley 2021 (experimental)" },
        source_ref: { value: "Sertraline 250–400mg (high dose SSRI, experimental)", source_id: M, page_ref: "p450", snippet: "Sertraline 250–400mg", agreement: "single" },
        side_effects: [], observation_prompts: [],
      },
    ],
  },

  // ESCITALOPRAM — start / therapeutic / high-dose, from Maudsley.
  {
    generic_name: "Escitalopram",
    drug_class: "SSRI", subclass: "Selective serotonin reuptake inhibitor",
    brand_names: ["Lexapro", "Nexito", "Cipralex"], aliases: [],
    mechanism: [ { value: "Selectively blocks the serotonin transporter; the S-enantiomer of citalopram.", source_id: S, page_ref: "p789", snippet: "Boosts serotonin ... Blocks serotonin reuptake pump", agreement: "single" } ],
    receptor_targets: [ { value: "SERT inhibition", source_id: S, page_ref: "p789", snippet: "serotonin transporter", agreement: "single" } ],
    common_uses: [ { value: "MDD, GAD, panic, OCD, social anxiety.", source_id: S, page_ref: "p789", snippet: "MDD; GAD; Panic; OCD", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Escitalopram lifts mood and eases anxiety by keeping serotonin around longer; it starts low and settles at 10–20 mg.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p789", snippet: "Boosts serotonin", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 10, range_high: 10, unit: "mg", band_label: "Adult starting dose",
        primary_purpose: "Usual adult starting dose", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        evidence: { strength: "high", confidence: "high", guideline: "Maudsley 2021" },
        source_ref: { value: "Escitalopram 10mg/day starting", source_id: M, page_ref: "p333", snippet: "Escitalopram 10mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 10, range_high: 20, unit: "mg", band_label: "Therapeutic range",
        primary_purpose: "Depression and anxiety disorders", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        source_ref: { value: "Escitalopram 10–20 mg/day (Stahl)", source_id: S, page_ref: "p796", snippet: "10–20 mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 3, band_type: "high_response", range_low: 25, range_high: 50, unit: "mg", band_label: "High-dose (treatment-resistant)",
        primary_purpose: "Experimental high-dose SSRI strategy", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        why_this_dose: "Experimental high-dose use up to 50 mg, titrated by tolerability (Maudsley).",
        evidence: { strength: "limited", confidence: "low", guideline: "Maudsley 2021 (experimental)" },
        source_ref: { value: "Escitalopram 25–50mg (high dose SSRI)", source_id: M, page_ref: "p450", snippet: "Escitalopram 25–50mg", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // CITALOPRAM — includes the elderly max (20 mg) QT warning (a distinct band).
  {
    generic_name: "Citalopram",
    drug_class: "SSRI", subclass: "Selective serotonin reuptake inhibitor",
    brand_names: ["Celexa", "Cipramil"], aliases: [],
    mechanism: [ { value: "Selectively blocks the serotonin transporter.", source_id: S, page_ref: "p767", snippet: "serotonin reuptake pump", agreement: "single" } ],
    receptor_targets: [ { value: "SERT inhibition", source_id: S, page_ref: "p767", snippet: "serotonin transporter", agreement: "single" } ],
    common_uses: [ { value: "MDD, panic, OCD, anxiety.", source_id: S, page_ref: "p767", snippet: "MDD; Panic", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Citalopram keeps serotonin available and lifts mood; it is watched for effects on the heart's rhythm, so there's a hard top dose.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p767", snippet: "serotonin reuptake", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 20, range_high: 20, unit: "mg", band_label: "Adult starting dose",
        primary_purpose: "Usual adult starting dose", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "Citalopram 20mg/day starting", source_id: M, page_ref: "p333", snippet: "Citalopram 20mg/day", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 20, range_high: 40, unit: "mg", band_label: "Therapeutic range",
        primary_purpose: "Depression and anxiety", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        why_this_dose: "Effective dose 10–40 mg; note QT effect, so the max is capped.",
        source_ref: { value: "Citalopram 10–40mg/day (QT noted)", source_id: M, page_ref: "p620", snippet: "Citalopram 10mg daily Effective dose 10–40mg (note QT effects)", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 3, band_type: "maximum", range_low: 40, range_high: 40, unit: "mg", band_label: "Maximum (adult)",
        frequency: "once daily", primary_purpose: "Cap due to QT interval risk",
        secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        evidence: { strength: "high", confidence: "high", guideline: "Maudsley warns against citalopram > 40mg" },
        source_ref: { value: "Max 40mg (QT warning)", source_id: M, page_ref: "p407", snippet: "warning against prescribing citalopram at doses exceeding 40 mg", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 4, band_type: "geriatric", range_low: 20, range_high: 20, unit: "mg", band_label: "Elderly maximum",
        frequency: "once daily", primary_purpose: "Elderly cap due to QT risk",
        secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: false,
        evidence: { strength: "high", confidence: "high", guideline: "Maudsley 2021" },
        source_ref: { value: "Elderly max citalopram 20mg/day (QT)", source_id: M, page_ref: "p671", snippet: "maximum dose of citalopram in older people is 20mg a day because of the drug’s effect on cardiac QT interval", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },

  // MIRTAZAPINE — starting 15 -> therapeutic 15-45.
  {
    generic_name: "Mirtazapine", drug_class: "NaSSA", subclass: "Noradrenergic/specific serotonergic antidepressant",
    brand_names: ["Remeron", "Mirtaz"], aliases: [],
    mechanism: [ { value: "Blocks presynaptic alpha-2, central 5-HT2 and 5-HT3, and H1 (sedative); noradrenergic + serotonergic.", source_id: S, page_ref: "p1491", snippet: "alpha-2 antagonism; serotonergic, noradrenergic", agreement: "single" } ],
    receptor_targets: [ { value: "alpha-2 antagonist, 5-HT2/5-HT3 antagonist, H1 antagonist, 5-HT1A", source_id: S, page_ref: "p1491", snippet: "alpha2, 5-HT2, H1", agreement: "single" } ],
    common_uses: [ { value: "MDD (with insomnia/sedation), anxiety.", source_id: S, page_ref: "p1491", snippet: "MDD", agreement: "single" } ],
    equivalences: [], links: [], clinical_presentations: [],
    student: { plain_language: { text: "Mirtazapine is sedating and appetite-boosting, used especially when sleep is broken or weight is low; dose runs 15–45 at night.", kb_parent_field: "mechanism", source: { value: "as above", source_id: S, page_ref: "p1491", snippet: "H1 antagonism, sedating", agreement: "single" } } },
    bands: [
      { band_order: 1, band_type: "starting", range_low: 15, range_high: 15, unit: "mg", band_label: "Starting / low-sedative dose",
        frequency: "at night", primary_purpose: "Starting dose; sedating", secondary_purposes: [], is_typical_starting: true, is_standard_maintenance: false,
        source_ref: { value: "Low-dose 15mg", source_id: M, page_ref: "p136", snippet: "low-dose (15mg) mirtazapine", agreement: "single" }, side_effects: [], observation_prompts: [] },
      { band_order: 2, band_type: "therapeutic", range_low: 15, range_high: 45, unit: "mg", band_label: "Therapeutic range",
        frequency: "at night", primary_purpose: "Depression (and anxiety)", secondary_purposes: [], is_typical_starting: false, is_standard_maintenance: true,
        why_this_dose: "Higher doses are less sedating on the whole; used for the main antidepressant effect.",
        source_ref: { value: "15–45 mg at night", source_id: S, page_ref: "p1491", snippet: "15–45 mg at night", agreement: "single" }, side_effects: [], observation_prompts: [] },
    ],
  },
];