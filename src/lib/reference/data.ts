/**
 * Quick Reference A to Z: one library built from data that already exists.
 *
 *  - Disorders: ./disorders (DSM-5-TR criteria, Maudsley/Kaplan treatment)
 *  - Medicines: the psychopharm enriched records (Stahl's Prescriber's Guide,
 *    7th ed.), falling back to the psychopharm store's drugDetail for the few
 *    drugs without one
 *  - Terms: the Quick Reference glossary (src/lib/study/glossary.ts) merged
 *    with the Coach concept bank (src/lib/learn/concepts) and the "say it
 *    clinically" pairs from the Notes (src/lib/learn/notes)
 *
 * Built once per server instance. The page passes only the compact index to
 * the browser.
 */
import "server-only";
import { DISORDERS, type DisorderRef } from "./disorders";
import { referenceSlug } from "./href";
import { GLOSSARY } from "@/lib/study/glossary";
import { ALL_CONCEPTS, DOMAINS, type Concept } from "@/lib/learn/concepts";
import { ALL_TERMS, NOTES } from "@/lib/learn/notes";
import { ENRICHED_ANTIDEPRESSANTS } from "@/lib/psychopharm/enriched-antidepressants";
import { ENRICHED_ANTIPSYCHOTICS } from "@/lib/psychopharm/enriched-antipsychotics";
import { ENRICHED_OTHERS } from "@/lib/psychopharm/enriched-others";
import { drugDetail, drugList } from "@/lib/psychopharm/store";

export type RefKind = "disorder" | "medicine" | "term";

export type MedicineRef = {
  slug: string;
  name: string;
  cls: string;
  plain: string | null;
  mechanism: string | null;
  uses: string[];
  sideEffects: string[];
  monitoring: string[];
  /** Full medicine page in Tools. */
  fullHref: string;
};

export type TermRef = {
  slug: string;
  term: string;
  /** Plain meaning. */
  means: string;
  /** Clinical framing. */
  clinical: string | null;
  why: string | null;
  mixup: string | null;
  hook: string | null;
  area: string | null;
  /** How patients may say it (from the Notes). */
  sayings: string[];
  related: string[];
};

export type RefEntry =
  | { kind: "disorder"; slug: string; label: string; aliases: string[]; summary: string; data: DisorderRef }
  | { kind: "medicine"; slug: string; label: string; aliases: string[]; summary: string; data: MedicineRef }
  | { kind: "term"; slug: string; label: string; aliases: string[]; summary: string; data: TermRef };

/** What the browser gets: enough to search, filter and list. */
export type RefIndexItem = { slug: string; label: string; kind: RefKind; summary: string; aliases: string[]; letter: string };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const plainText = (s: string) => s.replace(/\*([^*]+)\*/g, "$1");
const firstSentence = (s: string) => {
  const t = plainText(s).trim();
  const m = /^(.{20,160}?[.!?])(\s|$)/.exec(t);
  return m ? m[1] : t.slice(0, 160);
};

// ── Medicines ────────────────────────────────────────────────────────────
type Enriched = { generic_name: string; drug_class: string; plain_language: string; mechanism: string; common_uses: string[]; side_effects: string[]; monitoring: string[] };
const ENRICHED: Enriched[] = [...ENRICHED_ANTIDEPRESSANTS, ...ENRICHED_ANTIPSYCHOTICS, ...ENRICHED_OTHERS];

const fullHref = (name: string) => `/tools/psychopharm/${encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, "-"))}`;

/** Turn a raw source block ("✽ A ✽ B", "(bold for FDA approved) …") into short bullets. */
function bullets(raw: string | undefined, max = 6): string[] {
  if (!raw) return [];
  if (/^\s*AND PRECAUTIONS|^\s*\d+(\.\d+)?\s/.test(raw)) return []; // verbatim label sections: too long for a quick card
  return raw
    .replace(/\(bold for FDA approved[^)]*\)/gi, "")
    .split(/✽|•|\n/)
    .map((x) => x.replace(/\s+/g, " ").trim())
    .filter((x) => x.length > 3)
    .slice(0, max)
    .map((x) => (x.length > 200 ? `${x.slice(0, 197)}…` : x));
}

function buildMedicines(withStore: boolean): MedicineRef[] {
  const seen = new Set<string>();
  const out: MedicineRef[] = [];
  for (const e of ENRICHED) {
    const key = e.generic_name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      slug: referenceSlug(e.generic_name),
      name: e.generic_name,
      cls: e.drug_class,
      plain: e.plain_language || null,
      mechanism: e.mechanism || null,
      uses: e.common_uses,
      sideEffects: e.side_effects,
      monitoring: e.monitoring,
      fullHref: fullHref(e.generic_name),
    });
  }
  let names: string[] = [];
  try {
    // The store reads a 10 MB JSON file: only the library pages need it.
    names = withStore ? drugList() : [];
  } catch {
    names = [];
  }
  for (const n of names) {
    if (seen.has(n.toLowerCase())) continue;
    const det = drugDetail(n);
    if (!det) continue;
    seen.add(n.toLowerCase());
    out.push({
      slug: referenceSlug(n),
      name: n.charAt(0).toUpperCase() + n.slice(1),
      cls: det.class ?? "Medicine",
      plain: det.plain ?? null,
      mechanism: bullets(det.mechanism, 3).join("; ") || null,
      uses: bullets(det.common_uses),
      sideEffects: [...bullets(det.side_effects_common, 4), ...bullets(det.side_effects_serious, 3)],
      monitoring: bullets(det.monitoring),
      fullHref: fullHref(n),
    });
  }
  return out;
}

// ── Terms ────────────────────────────────────────────────────────────────
const AREA = new Map(DOMAINS.map((x) => [x.id, x.title]));

function buildTerms(disorderNames: Set<string>): TermRef[] {
  const bySlug = new Map<string, TermRef>();
  const conceptSlug = new Map<string, string>();

  for (const g of Object.values(GLOSSARY)) {
    const slug = referenceSlug(g.term);
    bySlug.set(slug, { slug, term: g.term, means: g.means, clinical: null, why: g.why, mixup: g.mixup ?? null, hook: null, area: null, sayings: [], related: [] });
  }
  const concepts: Concept[] = ALL_CONCEPTS.filter((c) => !(c.domain === "disorders" && disorderNames.has(norm(c.term))));
  for (const c of concepts) {
    const slug = referenceSlug(c.term);
    conceptSlug.set(c.id, slug);
    const have = bySlug.get(slug);
    if (have) {
      have.clinical ??= c.clinician;
      have.hook ??= c.hook ?? null;
      have.area ??= AREA.get(c.domain) ?? null;
      continue;
    }
    bySlug.set(slug, { slug, term: c.term, means: c.student, clinical: c.clinician, why: null, mixup: null, hook: c.hook ?? null, area: AREA.get(c.domain) ?? null, sayings: [], related: [] });
  }
  // Related: concepts sharing the most tags (same area first).
  for (const c of concepts) {
    const slug = conceptSlug.get(c.id)!;
    const t = bySlug.get(slug)!;
    if (t.related.length) continue;
    const scored = concepts
      .filter((o) => o.id !== c.id)
      .map((o) => ({ o, n: o.tags.filter((x) => c.tags.includes(x)).length + (o.domain === c.domain ? 0.5 : 0) }))
      .filter((x) => x.n >= 1)
      .sort((a, b) => b.n - a.n)
      .slice(0, 5);
    t.related = [...new Set(scored.map((x) => conceptSlug.get(x.o.id)!).filter((s) => s !== slug))];
  }
  // "How patients may say it" from the Notes.
  const byNorm = new Map([...bySlug.values()].map((t) => [norm(t.term), t]));
  for (const p of ALL_TERMS) {
    const heads = p.term.split("/").map((x) => norm(x));
    for (const h of heads) {
      const t = byNorm.get(h);
      if (t && !t.sayings.includes(p.lay)) t.sayings.push(p.lay);
    }
  }
  return [...bySlug.values()];
}

// ── Library ──────────────────────────────────────────────────────────────
type Lib = { entries: RefEntry[]; bySlug: Map<string, RefEntry>; byAlias: Map<string, string> };
const LIBS: { full?: Lib; core?: Lib } = {};

/** full: includes the few medicines only the psychopharm store knows (reads its JSON). */
function library(full = true): Lib {
  const hit = full ? LIBS.full : LIBS.core;
  if (hit) return hit;
  const entries: RefEntry[] = [];
  const disorderNames = new Set(DISORDERS.flatMap((x) => [x.name, ...(x.aka ?? [])].map(norm)));
  for (const x of DISORDERS) entries.push({ kind: "disorder", slug: x.slug, label: x.name, aliases: x.aka ?? [], summary: x.core, data: x });
  for (const m of buildMedicines(full)) entries.push({ kind: "medicine", slug: m.slug, label: m.name, aliases: [m.cls], summary: m.plain ? firstSentence(m.plain) : m.cls, data: m });
  for (const t of buildTerms(disorderNames)) entries.push({ kind: "term", slug: t.slug, label: t.term, aliases: t.sayings, summary: firstSentence(t.means), data: t });

  const bySlug = new Map<string, RefEntry>();
  for (const e of entries) if (!bySlug.has(e.slug)) bySlug.set(e.slug, e); // disorders win, then medicines, then terms
  const unique = [...bySlug.values()].sort((a, b) => a.label.localeCompare(b.label, "en", { sensitivity: "base" }));

  const byAlias = new Map<string, string>();
  for (const e of unique) {
    for (const a of [e.label, ...(e.kind === "disorder" ? e.aliases : [])]) {
      const k = referenceSlug(a);
      if (k && !byAlias.has(k)) byAlias.set(k, e.slug);
    }
  }
  // Notes topics (e.g. "depression") point at their main disorder when there is one.
  for (const n of NOTES) {
    const k = referenceSlug(n.id);
    const main = DISORDERS.find((x) => x.noteId === n.id);
    if (main && !byAlias.has(k)) byAlias.set(k, main.slug);
  }
  const lib: Lib = { entries: unique, bySlug, byAlias };
  if (full) LIBS.full = lib;
  else LIBS.core = lib;
  return lib;
}

export function allReference(): RefEntry[] {
  return library().entries;
}

/** Compact index. `full: false` skips the psychopharm store file (used by the ⌘K search on every page). */
export function referenceIndex({ full = true }: { full?: boolean } = {}): RefIndexItem[] {
  return library(full).entries.map((e) => ({
    slug: e.slug,
    label: e.label,
    kind: e.kind,
    summary: e.summary,
    aliases: e.aliases.slice(0, 4),
    letter: /^[a-z]/i.test(e.label) ? e.label[0].toUpperCase() : "#",
  }));
}

export function referenceBySlug(slug: string): RefEntry | undefined {
  return library().bySlug.get(slug);
}

/**
 * Resolve any slug or text (as made by referenceHref) to an entry: exact
 * slug, then a name/alias, then a loose prefix match. Undefined when nothing
 * fits (the page then shows a search).
 */
export function resolveReference(slugOrText: string): RefEntry | undefined {
  const lib = library();
  const s = referenceSlug(slugOrText);
  if (!s) return undefined;
  const hit = lib.bySlug.get(s) ?? lib.bySlug.get(lib.byAlias.get(s) ?? "");
  if (hit) return hit;
  const loose = lib.entries.find((e) => e.slug.startsWith(`${s}-`) || referenceSlug(e.label).startsWith(`${s}-`));
  return loose;
}

/** Labels of entries, for related-term links. */
export function referenceLabel(slug: string): string | undefined {
  return library().bySlug.get(slug)?.label;
}
