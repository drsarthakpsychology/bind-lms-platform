/**
 * Draft extraction types — the schema the extraction pipeline emits and the
 * reviewer approves. Mirrors the DB tables (psych_drug_fields, psych_dose_ranges,
 * psych_dose_bands, psych_drug_links, psych_comorbidity_notes,
 * psych_observation_prompts, psych_session_observations, ...) but as plain
 * data the reviewer signs off before these become `verified`/`published` rows.
 *
 * Safety invariants (enforced elsewhere by tests over this data):
 *   - Every field that publishes carries source + page + reviewer signature.
 *   - No value without a verbatim `snippet` in a source (quote-first).
 *   - Bands come only from sources; never averaged, never invented.
 *   - Equivalences are quoted from a source, never computed.
 */

export type Agreement = "full" | "partial" | "single" | "conflict";

/** A single sourced, quote-first value with provenance. */
export interface Sourced<T> {
  value: T;
  source_id: string;
  page_ref: string; // printed page + pdf page if different
  snippet: string; // reviewer-only verbatim
  agreement: Agreement;
  /** sources contributing, for partial/single */
  contrib?: Array<{ source_id: string; page_ref: string; snippet: string }>;
  status?: "draft" | "in_review";
}

export interface ObsPrompt {
  prompt_text: string; // client-facing
  rationale: string;
  urgency: "routine" | "mention_to_prescriber" | "refer_promptly";
  source: Sourced;
}

export interface SideEffectBand {
  label: string; // common | less_common | serious_rare
  items: string[];
  time_course?: string; // "often fades by week 2", "may persist", ...
  source: Sourced;
}

export interface DoseBand {
  band_order: number;
  range_low?: number | null;
  range_high?: number | null;
  unit: string;
  frequency?: string;
  band_label: string;
  primary_purpose: string; // sourced
  secondary_purposes: string[];
  is_typical_starting: boolean;
  is_standard_maintenance: boolean;
  why_this_dose?: Sourced<string>;
  what_changes_going_up?: string;
  what_changes_going_down?: string;
  onset?: Sourced<string>;
  plain_explanation?: string;          // transformed from knowledge base (Output B)
  technical_explanation?: string;
  side_effects: SideEffectBand[];
  observation_prompts: DoseBandPrompt[];
  population_notes?: string[];
  source_ref: Sourced; // primary band source
  /** NOTE: any band producing a numeric range must carry its provenance. */
}

export interface DoseBandPrompt {
  prompt: string;
  rationale: string;
  urgency: "routine" | "mention_to_prescriber" | "refer_promptly";
  source: Sourced;
}

/** A drug's full draft record, grouped by field with provenance. */
export interface DrugDraft {
  generic_name: string;
  drug_class: string;
  subclass?: string;
  brand_names: string[];
  aliases: string[];
  /** mechanism per source (independent, not merged) */
  mechanism: Sourced[];
  receptor_targets: Sourced[];
  common_uses: Sourced[];
  onset_time?: Sourced;
  half_life?: Sourced;
  side_effects_common?: Sourced;
  side_effects_serious?: Sourced;
  discontinuation?: Sourced;
  interactions?: Sourced[];
  monitoring?: Sourced[];
  /** dose bands (drug-at-a-dose is the unit) */
  bands: DoseBand[];
  /** published-only equivalences quoted from sources */
  equivalences: Array<{
    drug_b: string;
    note: string; // "X mg A ≈ Y mg B"
    caveat: string;
    source: Sourced;
  }>;
  /** similarity links (same job / mechanism / class) */
  links: Array<{
    drug_b: string;
    link_type: "same_job" | "same_mechanism" | "same_class" | "published_equivalence";
    match_tier: "strong" | "moderate" | "related";
    match_reason: string;
    differences: string[];
    source: Sourced;
  }>;
  /** clinical psychology sourced presentation / therapist-role facts */
  clinical_presentations?: Sourced[];
  /**
   * Output B students: plain-language / observed-therapy-channel content,
   * each with a knowledge-base parent link (kb_ref).
   */
  student: StudentLayer;
}

export interface StudentLayer {
  plain_language?: { text: string; kb_parent_field: string; source: Sourced };
  session_observations?: Array<{
    observation: string; // "may contribute to..."
    confidence: "possible" | "probable" | "reported" | "anecdotal";
    dose_dependence?: string;
    rationale?: string;
    source: Sourced;
  }>;
  therapist_questions?: Array<{
    category: string;
    question: string;   // client-facing, open, non-assuming
    explores: string;
    source: Sourced;
  }>;
  clinical_pearls?: Array<{ pearl: string; source: Sourced }>;
  red_flags?: Array<{ signal: string; guidance: string; source: Sourced }>;
}

export interface DoseBandPromptAdapted extends DoseBandPrompt {}
export type TopLevel = {
  drugs: DrugDraft[];
};