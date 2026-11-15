import "server-only";
import { GROUPS, MEDS, medById, medIndex, searchMeds, type Med } from "@/lib/meds";
import { mechanismOf } from "@/lib/meds/mechanisms";
import { halfLifeOf, medVisuals } from "@/lib/meds/visuals";
import { medicineDiagrams } from "@/lib/meds/diagrams";
import { DOSE_NOTE, SECTION_NAMES, shownSections, splitTell, washoutLine } from "@/lib/meds/sections";
import { medicineStudyLink } from "@/lib/meds/study-access";
import { compareDrugs, drugDetail, drugFromSlug, drugList, mechanismIndex, searchDrugs } from "@/lib/psychopharm/store";
import { getPublishedMedicationDocument } from "@/lib/psychopharm/published-doc";
import { STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";
import { COMPARE_FIELDS, COMPARE_MAX } from "@/lib/psychopharm/compare-fields";
import { referenceBySlug, referenceIndex } from "@/lib/reference/data";
import { LIBRARY_FILTERS, filterLibrary, filterLibraryByTag, getLibraryDocs } from "@/lib/corpus/library";
import { toAppTarget } from "./target";
import type { MedicineList, MedicinePage, MedicineRow, MedSection, ReferenceCompare, ReferenceDrug, ReferenceHome, ReferenceSearch } from "./contract-practise-admin";

/**
 * Library for the app: the website's medicine reference (src/lib/meds) and
 * the full psychopharmacology reference (src/lib/psychopharm), as data. The
 * medicine page keeps the website's order and words: practical facts first,
 * How it works last, with the same pictures (src/lib/meds/diagrams.ts).
 */

const usualDose = (m: Med | undefined) => m?.doses[m.defaultDose]?.amount ?? "";

function row(r: ReturnType<typeof medIndex>[number]): MedicineRow {
  const dose = usualDose(MEDS.find((x) => x.id === r.id));
  return { id: r.id, name: r.name, cls: r.cls, className: r.cls, group: r.group, brands: r.brands, uses: r.uses, line: r.line, dose, keyDose: dose };
}

/** The list, or the matches for `q` (the website's searchMeds) within `group`. */
export function medicineList(q?: string | null, group?: string | null): MedicineList {
  const all = medIndex();
  const query = (q ?? "").trim().slice(0, 80);
  const hits = query ? searchMeds(all, query) : all;
  const rows = (group ? hits.filter((r) => r.group === group) : hits).map(row);
  return { v: 1, groups: [...GROUPS], classes: [...GROUPS], rows };
}

/** One medicine page as data, or null for an unknown id. */
export async function medicinePage(id: string): Promise<MedicinePage | null> {
  const med = medById(id);
  if (!med) return null;
  const mech = mechanismOf(med.id) ?? null;
  const visuals = medVisuals(med.id);
  const half = halfLifeOf(med.id);
  const tell = splitTell(med);
  const order = shownSections(med, { hasMechanism: Boolean(mech), visuals: visuals.length, halfLife: Boolean(half) });
  const t = SECTION_NAMES;
  const sections: MedSection[] = order.map((sid): MedSection => {
    switch (sid) {
      case "uses":
        return { id: sid, title: t[sid], points: [...med.uses, ...med.standout], uses: med.uses, standout: med.standout };
      case "doses":
        return {
          id: sid,
          title: t[sid],
          points: med.doses.map((d) => `${d.amount} (${d.label}): ${d.use}`),
          doses: med.doses.map((d) => ({ amount: d.amount, label: d.label, use: d.use, student: d.student, clinician: d.clinician, ...(d.watch?.length ? { watch: d.watch } : {}) })),
          defaultDose: med.defaultDose,
          take: tell.take,
          forms: med.forms,
          brands: med.brands,
          note: DOSE_NOTE,
        };
      case "side-effects":
        return { id: sid, title: t[sid], points: med.common };
      case "monitoring":
        return { id: sid, title: t[sid], points: med.checks };
      case "interactions":
        return { id: sid, title: t[sid], points: med.interactions };
      case "warnings":
        return { id: sid, title: t[sid], points: [...med.serious, ...tell.warn], tone: "alert" };
      case "groups":
        return { id: sid, title: t[sid], points: med.groups.map((g) => `${g.label}: ${g.text}`), facts: med.groups };
      case "stopping":
        return { id: sid, title: t[sid], points: [...tell.stopping, ...(half ? [washoutLine(half.hl)] : [])] };
      case "how-it-works":
        return {
          id: sid,
          title: t[sid],
          points: mech ? [mech.plain] : [],
          plain: mech?.plain ?? null,
          targets: mech?.targets ?? [],
          diagrams: medicineDiagrams(med, mech, visuals),
        };
    }
  });
  const related = med.related.map(medById).filter((m): m is Med => Boolean(m)).map((m) => ({ id: m.id, name: m.name, cls: m.cls }));
  const study = await medicineStudyLink(med);
  const base = medIndex().find((r) => r.id === med.id);
  return {
    ...(base ? row(base) : { id: med.id, name: med.name, cls: med.cls, className: med.cls, group: med.group, brands: med.brands, uses: med.uses, line: "", dose: usualDose(med), keyDose: usualDose(med) }),
    v: 1,
    summary: { student: med.student, clinician: med.clinician },
    sections,
    related,
    study: study ? { moduleId: study.moduleId, title: study.title, target: toAppTarget(study.href) } : null,
    med: med as unknown as MedicinePage["med"],
    mechanism: (mech as unknown as Record<string, unknown>) ?? null,
    visuals: visuals as unknown as Record<string, unknown>[],
    halfLife: half,
  };
}

// ------------------------------------------------------------- reference

/** The reference's address name for a medicine (the reverse of drugFromSlug). */
export const slugOf = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "-");

export function referenceHome(): ReferenceHome {
  return {
    v: 1,
    drugs: drugList().map((d) => ({ slug: slugOf(d), name: d })),
    byMechanism: mechanismIndex().map((g) => ({ tag: g.tag, drugs: g.drugs.map((d) => ({ slug: slugOf(d.name), name: d.name, qualifier: d.qualifier ?? null })) })),
    notice: STANDING_NOTICE,
  };
}

export function referenceSearch(q: string): ReferenceSearch {
  return { items: searchDrugs(q.slice(0, 80), 20).map((d) => ({ slug: slugOf(d.generic), name: d.generic, cls: d.class ?? null, line: d.one_line ?? null, verified: d.verified })) };
}

/** Source and review fields stay on the website's editor (students never see citations). */
const SOURCE_KEYS = new Set(["source_id", "source_title", "onset_kb_page", "half_life_page"]);

function withoutSources(detail: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(detail)) {
    if (SOURCE_KEYS.has(k)) continue;
    if (k === "onset_time" && v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      out[k] = { value: o.value, agreement: o.agreement };
      continue;
    }
    out[k] = v;
  }
  return out;
}

export async function referenceDrug(slug: string): Promise<ReferenceDrug | null> {
  const generic = drugFromSlug(slug.slice(0, 120));
  if (!generic) return null;
  const detail = drugDetail(generic);
  if (!detail) return null;
  const doc = await getPublishedMedicationDocument(generic).catch(() => null);
  return {
    v: 1,
    slug: slugOf(generic),
    name: detail.generic,
    cls: detail.class ?? null,
    verified: detail.verified,
    // The website's document view drops hidden blocks and shows no sources to students.
    document: doc
      ? { sections: doc.sections.map((s) => ({ id: s.id, title: s.title, blocks: [...s.blocks].filter((b) => !b.hidden).sort((a, b) => a.order - b.order).map((b) => ({ id: b.id, type: b.type, value: b.value, data: b.data ?? null })) })) }
      : null,
    detail: withoutSources(detail as unknown as Record<string, unknown>),
    notice: STANDING_NOTICE,
  };
}

export function referenceCompare(slugs: string[]): ReferenceCompare {
  const generic = [...new Set(slugs.slice(0, COMPARE_MAX).map((s) => drugFromSlug(s.slice(0, 120))).filter((g): g is string => Boolean(g)))];
  const rows = compareDrugs(generic);
  return {
    v: 1,
    fields: COMPARE_FIELDS.map((f) => ({ key: String(f.key), label: f.label })),
    drugs: rows.map((r) => ({ slug: slugOf(r.drug), name: r.drug, values: Object.fromEntries(COMPARE_FIELDS.map((f) => [String(f.key), (r[f.key] as string | undefined) ?? null])) })),
    notice: STANDING_NOTICE,
  };
}

// ------------------------------------------------- quick reference and cases

/** The Quick reference (disorders, medicines, terms): the glossary the website keeps under Study. */
export function termIndex(q?: string | null) {
  const query = (q ?? "").trim().toLowerCase().slice(0, 80);
  const all = referenceIndex();
  const items = query ? all.filter((r) => r.label.toLowerCase().includes(query) || r.aliases.some((a) => a.toLowerCase().includes(query))) : all;
  return { v: 1 as const, items };
}

export function termPage(slug: string) {
  const entry = referenceBySlug(slug.slice(0, 120));
  return entry ? { v: 1 as const, entry: entry as unknown as Record<string, unknown> } : null;
}

const snippet = (s: string) => (s.length > 240 ? `${s.slice(0, 237).trimEnd()}...` : s);

/** The case library (when it is switched on): the website's search and tag filters, paged. */
export async function caseDocs(q: string, tag: string, start: number, limit: number) {
  const all = await getLibraryDocs();
  const searched = filterLibrary(all, q.slice(0, 120));
  const rows = tag ? filterLibraryByTag(searched, tag) : searched;
  return {
    v: 1 as const,
    filters: LIBRARY_FILTERS.map((f) => ({ key: f.key, label: f.label })),
    items: rows.slice(start, start + limit).map((d) => ({ id: d.hash, title: d.title, source: d.source, licence: d.licence, snippet: snippet(d.content) })),
    nextCursor: start + limit < rows.length ? String(start + limit) : null,
    total: rows.length,
  };
}

export async function caseDoc(id: string) {
  const d = (await getLibraryDocs()).find((x) => x.hash === id);
  return d ? { v: 1 as const, id: d.hash, title: d.title, source: d.source, sourceUrl: d.source_url, licence: d.licence, content: d.content } : null;
}
