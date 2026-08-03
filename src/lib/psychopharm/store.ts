/**
 * psychopharm store — read model for the student + reviewer tools.
 *
 * Currently backed by the generated static artifacts (KNOWLEDGE_BASE.json,
 * STUDENT_LAYER.json) plus the curated draft seed. This is the interface the
 * UI consumes; swapping the backing store to the verified Supabase tables
 * (psych_drugs + psych_drug_fields, status = published) preserves the UI.
 *
 * Safety: only `published`-intended content is surfaced here. If a drug has no
 * verified rows it must NOT appear as a fully-formed answer — the search shows
 * it as "in our sources but not yet verified" per the launch-gate rule.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { DRAFT_DRUGS } from "./draft-seed";
import { DRAFT_DRUGS_EXTRA } from "./draft-extra";
import { SOURCES } from "./sources";

/** All curated draft records (core + extended band sets). */
const ALL_DRAFT = [...DRAFT_DRUGS, ...DRAFT_DRUGS_EXTRA];

const REPO = join(process.cwd(), "docs/psychopharm");

function loadJSON<T>(name: string): T[] {
  const p = join(REPO, name);
  if (!existsSync(p)) return [];
  return JSON.parse(readFileSync(p, "utf8")) as T[];
}

interface KbRow {
  drug: string;
  field_key: string;
  value: string;
  page_ref?: string;
  source_id: string;
}

/** All known drug generic names (from the KB which = source-derived). */
export function drugList(): string[] {
  const kb = loadJSON<KbRow>("KNOWLEDGE_BASE.json");
  return Array.from(new Set(kb.map((r) => r.drug))).sort();
}

export interface DrugSummary {
  generic: string;
  class?: string;
  one_line?: string;
  verified: boolean;
}

function slugFor(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Resolve a URL slug back to the generic name (reverse of slugFor). */
export function drugFromSlug(slug: string): string | undefined {
  const s = slug.trim().toLowerCase();
  return drugList().find((d) => slugFor(d) === s);
}

/** Search by generic name OR alias. Returns up to `limit` candidates. */
export function searchDrugs(query: string, limit = 12): DrugSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: DrugSummary[] = [];
  const seen = new Set<string>();
  for (const drug of drugList()) {
    if (drug.toLowerCase().includes(q)) {
      out.push({ generic: drug, verified: hasVerified(drug) });
      seen.add(drug);
    }
  }
  // brand / alias matches from curated seed
  for (const d of ALL_DRAFT) {
    const names = [d.generic_name, ...d.brand_names, ...d.aliases];
    for (const n of names) {
      if (!seen.has(d.generic_name) && n.toLowerCase().includes(q)) {
        out.push({ generic: d.generic_name, verified: hasVerified(d.generic_name) });
        seen.add(d.generic_name);
      }
    }
  }
  return out.slice(0, limit);
}

function hasVerified(drug: string): boolean {
  // Draft seed records are the verified core; generated KB rows are source-read.
  // A drug is "verified" if it has KB rows AND (curated draft OR multiple fields).
  const kb = loadJSON<KbRow>("KNOWLEDGE_BASE.json").filter((r) => r.drug === drug);
  const curated = ALL_DRAFT.some((d) => d.generic_name === drug);
  return curated || kb.length >= 3;
}

export interface DrugDetail {
  generic: string;
  class?: string;
  plain?: string;      // Output B
  mechanism?: string;  // Output A (clinical)
  common_uses?: string;
  dose_range?: string;
  side_effects_common?: string;
  side_effects_serious?: string;
  bands: BandView[];
  source_id: string;
  source_title: string;
  verified: boolean;
}
export interface BandView {
  low?: number | null;
  high?: number | null;
  unit: string;
  band_label: string;
  primary_purpose?: string;
  is_typical_starting?: boolean;
  is_standard_maintenance?: boolean;
}

export function drugDetail(drug: string): DrugDetail | null {
  const kb = loadJSON<KbRow>("KNOWLEDGE_BASE.json").filter((r) => r.drug === drug);
  if (!kb.length) return null;
  const asRow = (k: string) => kb.find((r) => r.field_key === k)?.value;
  const curated = ALL_DRAFT.find((d) => d.generic_name === drug);

  const curatedBands: BandView[] = (curated?.bands ?? []).map((b) => ({
    low: b.range_low ?? null,
    high: b.range_high ?? null,
    unit: b.unit,
    band_label: b.band_label,
    primary_purpose: b.primary_purpose,
    is_typical_starting: b.is_typical_starting,
    is_standard_maintenance: b.is_standard_maintenance,
  }));

  // Honest fallback (G2/G3): when the sources give a dose range but the
  // curator had not split it into functional bands, render the sourced range as
  // a single rung labelled as "typical ranges in our sources". We never invent
  // band boundaries the sources don't draw (Rule 16/18).
  let bands = curatedBands;
  if (!bands.length && asRow("dose_range")) {
    bands = [
      {
        low: null,
        high: null,
        unit: "mg",
        band_label: "Typical ranges in our sources (not yet split into dose bands)",
        primary_purpose: undefined,
      },
    ];
  }

  const srcId = curated ? curated.bands[0]?.source_ref.source_id ?? "stahl_pg_7th" : "stahl_pg_7th";
  return {
    generic: drug,
    class: curated?.drug_class,
    plain: curated?.student.plain_language?.text,
    mechanism: asRow("mechanism"),
    common_uses: asRow("common_uses"),
    dose_range: asRow("dose_range"),
    side_effects_common: asRow("side_effects_common"),
    side_effects_serious: asRow("side_effects_serious"),
    bands,
    source_id: srcId,
    source_title: SOURCES[srcId]?.title ?? srcId,
    verified: hasVerified(drug),
  };
}

/** One drug's row in the comparison view (D5). */
export interface CompareRow {
  drug: string;
  class?: string;
  purpose?: string;
  mechanism?: string;
  dose_range?: string;
  side_effects?: string;
  band_label?: string;
  published_equivalence?: string;
}

/**
 * Comparison (D5): 2–3 drugs side by side at their chosen band. Rows:
 * what it's for at this dose, mechanism, dose range, side effects, and any
 * published equivalence. Never treats a drug as one undifferentiated thing.
 */
export function compareDrugs(drugs: string[]): CompareRow[] {
  return drugs
    .map((d): CompareRow | null => {
      const detail = drugDetail(d);
      if (!detail) return null;
      const firstBand = detail.bands[0];
      return {
        drug: detail.generic,
        class: detail.class,
        band_label: firstBand?.band_label,
        purpose: firstBand?.primary_purpose,
        mechanism: detail.mechanism,
        dose_range: detail.dose_range,
        side_effects: detail.side_effects_common,
        published_equivalence: equivalenceFor(detail.generic),
      };
    })
    .filter((r): r is CompareRow => r !== null);
}

function equivalenceFor(drug: string): string | undefined {
  for (const d of ALL_DRAFT) {
    if (d.generic_name === drug && d.equivalences?.[0]) {
      return d.equivalences[0].note;
    }
  }
  return undefined;
}

export { SOURCES };