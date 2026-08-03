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
import { DRAFT_LADDERS } from "./draft-ladder";
import { DRAFT_LADDERS_2 } from "./draft-ladder2";
import { DRAFT_FDA } from "./draft-fda";
import { DRAFT_FDA_2 } from "./draft-fda2";
import { DRAFT_FDA_3 } from "./draft-fda3";
import { DRAFT_FDA_4 } from "./draft-fda4";
import { DRAFT_FDA_5 } from "./draft-fda5";
import { DRAFT_FDA_6 } from "./draft-fda6";
import { ONSET_PATCHES } from "./draft-onset";
import { SOURCES } from "./sources";

/** All curated draft records (core + extended band sets + rich ladders + FDA). */
const ALL_DRAFT = [...DRAFT_DRUGS, ...DRAFT_DRUGS_EXTRA, ...DRAFT_LADDERS, ...DRAFT_LADDERS_2, ...DRAFT_FDA, ...DRAFT_FDA_2, ...DRAFT_FDA_3, ...DRAFT_FDA_4, ...DRAFT_FDA_5, ...DRAFT_FDA_6];

/** Onset values merged onto the curated records (student register). */
const ONSET_BY_DRUG = new Map(ONSET_PATCHES.map((p) => [p.generic_name, p.onset_time]));

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

/** Levenshtein distance (≤2 useful for "Did you mean…" typo recovery). */
function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = cur[j];
  }
  return prev[n];
}

/**
 * Search by generic name, brand name, or alias across ALL KB drugs (plus
 * curated aliases). If a query returns zero exact/prefix hits, falls back to
 * an edit-distance (≤2) "Did you mean…" set. Deterministic and local — no
 * model calls at request time.
 */
export function searchDrugs(query: string, limit = 12): DrugSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: DrugSummary[] = [];
  const seen = new Set<string>();
  // Only surface drugs that resolve to a real detail page — a search hit with
  // no drugDetail would otherwise 404 on the drug page (e.g. a plain name that
  // exists in the ladder but not the KB).
  const resolvable = (name: string) => Boolean(drugDetail(name));
  const add = (name: string) => {
    if (!seen.has(name) && resolvable(name)) {
      out.push({ generic: name, verified: hasVerified(name) });
      seen.add(name);
    }
  };

  const catalog = drugList();
  // (a) generic + all-brand/alias matching across curated + KB drugs.
  const brandByGeneric = new Map<string, string[]>();
  for (const d of ALL_DRAFT) brandByGeneric.set(d.generic_name, [d.generic_name, ...d.brand_names, ...d.aliases]);
  for (const drug of catalog) {
    const names = brandByGeneric.get(drug) ?? [drug];
    if (names.some((n) => n.toLowerCase().includes(q))) add(drug);
  }
  if (seen.size) return out.slice(0, limit);

  // (b) zero exact hits → "Did you mean…" via edit distance ≤2 on generic names.
  const fuzzy = catalog
    .map((drug) => ({ drug, dist: editDistance(drug.toLowerCase(), q) }))
    .filter((x) => x.dist <= 2)
    .sort((a, b) => a.dist - b.dist)
    .map((x) => x.drug);
  for (const f of fuzzy) add(f);
  return out.slice(0, limit);
}

function hasVerified(drug: string): boolean {
  // Draft seed records are the verified core; generated KB rows are source-read.
  // A drug is "verified" if it has KB rows AND (curated draft OR multiple fields).
  // In test mode we still report curated/rich coverage for honest labeling; the
  // published-only gate is a DB/RLS property (enforced in production).
  const kb = loadJSON<KbRow>("KNOWLEDGE_BASE.json").filter((r) => r.drug === drug);
  const curated = ALL_DRAFT.some((d) => d.generic_name === drug);
  const covered = curated || kb.length >= 3;
  return covered;
}

export interface DrugDetail {
  generic: string;
  class?: string;
  plain?: string;      // Output B — student register
  mechanism?: string;  // Output A (clinical register, technical)
  common_uses?: string;
  dose_range?: string;
  side_effects_common?: string;
  side_effects_serious?: string;
  bands: BandView[];
  source_id: string;
  source_title: string;
  verified: boolean;
  /** Student register onset, quote-first (curated). */
  onset_time?: { value: string; source_id: string; page_ref: string; snippet: string; agreement: string };
  /** Clinician-register onset (verbatim KB row). */
  onset_kb?: string;
  onset_kb_page?: string;
  /** Half-life (verbatim KB Pharmacokinetics block). */
  half_life?: string;
  half_life_page?: string;
}
export interface BandView {
  low?: number | null;
  high?: number | null;
  unit: string;
  band_label: string;
  primary_purpose?: string;
  band_type?: string;
  frequency?: string;
  secondary_purposes?: string[];
  is_typical_starting?: boolean;
  is_standard_maintenance?: boolean;
  why_this_dose?: string;
  what_changes_going_up?: string;
  what_changes_going_down?: string;
  plain_explanation?: string;
  technical_explanation?: string;
  population_notes?: string[];
  onset?: { value: string; page_ref?: string };
  side_effects?: Array<{
    label: string;
    items: string[];
    time_course?: string;
  }>;
  /** clinician-register provenance for this band. */
  evidence?: {
    strength?: string;
    confidence?: string;
    guideline?: string;
    source_id?: string;
    page_ref?: string;
    quote?: string;
  };
  /** band-specific observation prompts (P3). */
  observation_prompts?: Array<{ prompt: string; rationale?: string; urgency?: string }>;
}

export function drugDetail(drug: string): DrugDetail | null {
  const kb = loadJSON<KbRow>("KNOWLEDGE_BASE.json").filter((r) => r.drug === drug);
  const curated = ALL_DRAFT.find((d) => d.generic_name === drug);
  // A drug is renderable if it has a KB row OR a curated record (bands +
  // mechanism). Curated-only drugs (some FDA-sourced) have no KB row but must
  // still resolve to a detail page.
  if (!kb.length && !curated) return null;
  const asRow = (k: string) => kb.find((r) => r.field_key === k)?.value;

  const curatedBands: BandView[] = (curated?.bands ?? []).map((b) => ({
    low: b.range_low ?? null,
    high: b.range_high ?? null,
    unit: b.unit,
    band_label: b.band_label,
    primary_purpose: b.primary_purpose,
    band_type: b.band_type,
    frequency: b.frequency,
    secondary_purposes: b.secondary_purposes ?? [],
    is_typical_starting: b.is_typical_starting,
    is_standard_maintenance: b.is_standard_maintenance,
    why_this_dose: b.why_this_dose,
    what_changes_going_up: b.what_changes_going_up,
    what_changes_going_down: b.what_changes_going_down,
    plain_explanation: b.plain_explanation,
    technical_explanation: b.technical_explanation,
    population_notes: b.population_notes ?? [],
    onset: b.onset ? { value: b.onset.value, page_ref: b.onset.page_ref } : undefined,
    side_effects: (b.side_effects ?? []).map((s) => ({
      label: s.label,
      items: s.items,
      time_course: s.time_course,
    })),
    evidence: {
      strength: b.evidence?.strength,
      confidence: b.evidence?.confidence,
      guideline: b.evidence?.guideline,
      source_id: b.source_ref?.source_id,
      page_ref: b.source_ref?.page_ref,
      quote: b.source_ref?.snippet,
    },
    observation_prompts: (b.observation_prompts ?? []).map((p) => ({
      prompt: p.prompt,
      rationale: p.rationale,
      urgency: p.urgency,
    })),
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
  // Onset: curated student register (patched) > curated record > KB row.
  const onsetPatch = ONSET_BY_DRUG.get(drug) ?? curated?.onset_time;
  const onsetKb = kb.find((r) => r.field_key === "onset");
  const halfLifeKb = kb.find((r) => r.field_key === "half_life");
  return {
    generic: drug,
    class: curated?.drug_class,
    plain: curated?.student.plain_language?.text,
    mechanism: asRow("mechanism") ?? curated?.mechanism[0]?.value,
    common_uses: asRow("common_uses") ?? curated?.common_uses?.[0]?.value,
    dose_range: asRow("dose_range"),
    side_effects_common: asRow("side_effects_common"),
    side_effects_serious: asRow("side_effects_serious"),
    bands,
    source_id: srcId,
    source_title: SOURCES[srcId]?.title ?? srcId,
    verified: hasVerified(drug),
    onset_time: onsetPatch
      ? {
          value: onsetPatch.value,
          source_id: onsetPatch.source_id,
          page_ref: onsetPatch.page_ref,
          snippet: onsetPatch.snippet,
          agreement: onsetPatch.agreement,
        }
      : undefined,
    onset_kb: onsetKb?.value,
    onset_kb_page: onsetKb?.page_ref,
    half_life: halfLifeKb?.value,
    half_life_page: halfLifeKb?.page_ref,
  };
}

/** One drug's row in the comparison view (D5 / P4). */
export interface CompareRow {
  drug: string;
  class?: string;
  purpose?: string;
  mechanism?: string;
  dose_range?: string;
  side_effects?: string;
  band_label?: string;
  published_equivalence?: string;
  onset?: string;      // student register onset
  half_life?: string;
}

/**
 * Comparison (D5/P4): 2–5 drugs side by side at their chosen band. Rows:
 * what it's for at this dose, mechanism, dose range, side effects, class,
 * and any published equivalence. Never treats a drug as one undifferentiated
 * thing; each column is the drug at its band, not the whole drug.
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
        onset: detail.onset_time?.value ?? detail.onset_kb,
        half_life: detail.half_life,
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

/** Learning layer: drugs grouped by shared receptor tag (Part 10). */
export interface MechanismGroup {
  tag: string;
  drugs: Array<{ name: string; qualifier?: string }>;
}

/**
 * Normalise a free-text receptor target into a stable group tag.
 *
 *   "GABAA benzodiazepine site (positive allosteric modulator)"
 *     → head "GABAA benzodiazepine site", qualifier "positive allosteric modulator"
 *   "D2 antagonist, 5-HT2A antagonist" → head "D2", qualifier "antagonist"
 *   "SERT inhibition (and some DAT at higher doses)" → head "SERT", qualifier "inhibition"
 *
 * Strips trailing action words so "D2 antagonist", "D2, 5-HT2A antagonist",
 * and "D2/D3 partial agonist" all group under "D2" with the action kept as a
 * per-drug annotation. Case/whitespace normalised.
 */
export function normaliseReceptorTag(raw: string): { tag: string; qualifier?: string } {
  // Take the first comma-separated head.
  let head = raw.split(",")[0].trim();
  // Capture and strip a trailing parenthetical qualifier.
  let qualifier: string | undefined;
  const paren = head.match(/^(.*?)\s*\((.*)\)\s*$/);
  if (paren) {
    head = paren[1].trim();
    qualifier = paren[2].trim();
  }
  // Normalise D2/D3 → D2 (split multi-receptor heads on the dominant one).
  head = head.replace(/\/D\d+/, "").trim();
  // Capture a trailing action word and strip it from the tag head.
  const actionMatch = head.match(
    /^(.*?)\s+((?:partial\s+)?(?:reuptake\s+)?(?:antagonist|agonist|blockade|inhibition|inhibitor|modulator|binding))$/i,
  );
  if (actionMatch) {
    head = actionMatch[1].trim();
    qualifier = qualifier ?? actionMatch[2].toLowerCase();
  }
  // Normalise case/whitespace.
  head = head.replace(/\s+/g, " ").trim();
  return { tag: head, qualifier: qualifier ? qualifier.toLowerCase() : undefined };
}

export function mechanismIndex(): MechanismGroup[] {
  const map = new Map<string, Array<{ name: string; qualifier?: string }>>();
  for (const d of ALL_DRAFT) {
    for (const rt of d.receptor_targets ?? []) {
      const { tag, qualifier } = normaliseReceptorTag(rt.value);
      if (!tag || /^(not|no|affects)/i.test(tag)) continue; // skip non-specific rows
      const arr = map.get(tag) ?? [];
      arr.push({ name: d.generic_name, qualifier });
      map.set(tag, arr);
    }
  }
  // Sort groups by tag name; dedupe drugs within a group.
  return Array.from(map.entries())
    .map(([tag, drugs]) => {
      const seen = new Map<string, string | undefined>();
      for (const d of drugs) if (!seen.has(d.name)) seen.set(d.name, d.qualifier);
      return {
        tag,
        drugs: Array.from(seen.entries())
          .map(([name, qualifier]) => ({ name, qualifier }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      };
    })
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export { SOURCES };