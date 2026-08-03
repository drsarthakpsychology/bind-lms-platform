/**
 * Medication document — the single source of truth for a drug page (KMS).
 *
 * One `medication_documents` row per drug holds the whole page as typed
 * blocks. The student page and the editor's live preview both render this.
 * The existing granular `psych_*` tables stay as the audit/trace layer.
 *
 * Every block is editable, carries provenance (sources + reviewer + version),
 * and has an order + hidden flag.
 */

export type BlockType =
  | "mechanism"
  | "common_uses"
  | "dose_band"
  | "onset"
  | "half_life"
  | "side_effect_list"
  | "observation_prompt_list"
  | "therapist_question_list"
  | "clinical_pearl_list"
  | "red_flag_list"
  | "plain_language"
  | "reference"
  | "timeline"
  | "note";

export interface SourceRef {
  source_id?: string;
  title?: string;
  edition?: string;
  year?: number;
  page?: string;
  quote?: string;
  url?: string;
}

export interface MedBlock {
  id: string;
  type: BlockType;
  /** plain display value. */
  value: string;
  /** rich/structured payload (e.g. band low/high, side-effect tiers). */
  data?: Record<string, unknown>;
  order: number;
  hidden?: boolean;
  sources: SourceRef[];
  confidence?: "high" | "moderate" | "low";
  agreement?: "full" | "partial" | "single" | "conflict";
  reviewer?: string;
  version?: number;
}

export interface MedSection {
  id: string;
  title: string;
  blocks: MedBlock[];
}

export interface MedicationDocument {
  generic_name: string;
  sections: MedSection[];
}

/** A document row as stored in Supabase (with lifecycle fields). */
export interface MedicationDocumentRow {
  id: string;
  drug_id: string;
  document: MedicationDocument;
  status: "draft" | "in_review" | "verified" | "published";
  version: number;
  published_version?: number | null;
  reviewer?: string | null;
  verified_at?: string | null;
  updated_at: string;
}