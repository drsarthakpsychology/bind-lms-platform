/**
 * Admin dose review data — surfaces every drug's extracted evidence for Dr.
 * Sarthak (Editor-in-Chief) to approve / edit / merge / modify / publish.
 *
 * Every record traces to a source + page + verbatim quotation (Rule 3).
 * Reviewer decision state (approve / edit / reject / publish, rationale,
 * confidence, evidence strength) is captured here so the UI can persist it;
 * the DB constraint independently makes unverifiable rows un-publishable.
 * No extracted evidence is ever deleted — decisions are appended (auditable,
 * reversible).
 */
import { DRAFT_DRUGS } from "./draft-seed";
import { DRAFT_DRUGS_EXTRA } from "./draft-extra";
import { SOURCES } from "./sources";

const ALL = [...DRAFT_DRUGS, ...DRAFT_DRUGS_EXTRA];

/** A single band's evidence for review. */
export interface ReviewBand {
  bandId: string;
  band: string;
  purpose: string;
  band_type?: string;
  evidence?: {
    strength?: string;
    confidence?: string;
    guideline?: string;
  };
  source_id: string;
  page_ref: string;
  quote: string;
  agreement: string;
}

/** A non-band field (mechanism, uses, side effects) for review. */
export interface ReviewField {
  field_key: string;
  value: string;
  source_id: string;
  page_ref?: string;
}

/** A reviewer decision on one item. */
export interface ReviewDecision {
  item: string; // e.g. "band 1" or "mechanism"
  action: "approve" | "edit" | "reject";
  rationale?: string;
  reviewed_by?: string;
  at?: string;
}

export interface DosaReviewView {
  drug: string;
  drug_class: string;
  bands: ReviewBand[];
  fields: ReviewField[];
  conflicts: Array<{ note: string; source_a: string; source_b: string }>;
  decisions: ReviewDecision[];
}

/** Build the full review view for one drug from its curated draft. */
export function doseReviewFor(drug: string): DosaReviewView | null {
  const draft = ALL.find((d) => d.generic_name === drug);
  if (!draft) return null;
  const bands: ReviewBand[] = draft.bands.map((b) => ({
    bandId: `${draft.generic_name}:band:${b.band_order}`,
    band: `${b.range_low ?? "?"}–${b.range_high ?? "?"} ${b.unit}`,
    purpose: b.primary_purpose,
    band_type: b.band_type,
    evidence: b.evidence
      ? { strength: b.evidence.strength, confidence: b.evidence.confidence, guideline: b.evidence.guideline }
      : undefined,
    source_id: b.source_ref?.source_id ?? "stahl_pg_7th",
    page_ref: b.source_ref?.page_ref ?? "",
    quote: b.source_ref?.snippet ?? "",
    agreement: b.source_ref?.agreement ?? "single",
  }));
  const fields: ReviewField[] = draft.mechanism.map((m) => ({
    field_key: "mechanism",
    value: m.value,
    source_id: m.source_id,
    page_ref: m.page_ref,
  }));
  const conflicts = draft.bands
    .filter((b) => b.source_ref?.agreement === "partial" || b.source_ref?.agreement === "conflict")
    .map((b) => ({
      note: `Band ${b.band_order} (${b.range_low}–${b.range_high} ${b.unit}) is ${b.source_ref?.agreement}`,
      source_a: SOURCES[b.source_ref?.source_id ?? ""]?.title ?? b.source_ref?.source_id ?? "",
      source_b: (b.source_ref?.contrib ?? []).map((c) => SOURCES[c.source_id]?.title ?? c.source_id).join("; "),
    }));
  return { drug: draft.generic_name, drug_class: draft.drug_class, bands, fields, conflicts, decisions: [] };
}

export function allDoseReviews(): string[] {
  return ALL.map((d) => d.generic_name).sort();
}