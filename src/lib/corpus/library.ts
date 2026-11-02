/**
 * Case Library index — read-only browse of the normalised PMC corpus.
 * Server-side only (reads the local normalised JSON); pure read, no AI.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface LibraryDoc {
  source: string;
  source_url: string;
  licence: string;
  title: string;
  content: string;
  hash: string;
  fetched_at: string;
}

/**
 * Read the normalised PMC docs. The file ships with the deployment and never
 * changes at runtime, so it is parsed once per server instance and kept in
 * memory. (It used to go through `unstable_cache`, but the corpus is ~37 MB
 * and the data cache refuses items over 2 MB — so the cache write failed and
 * the file was re-read and re-parsed on every page that rendered the search
 * palette.)
 */
let docsMemo: Promise<LibraryDoc[]> | null = null;
export function getLibraryDocs(): Promise<LibraryDoc[]> {
  if (!docsMemo) {
    docsMemo = (async () => {
      const path = join(process.cwd(), "scripts/corpus/normalised/pmc.json");
      try {
        const raw = readFileSync(path, "utf8");
        return JSON.parse(raw) as LibraryDoc[];
      } catch {
        return [];
      }
    })();
  }
  return docsMemo;
}

/** Cheap text search: case-insensitive substring across title + first 600 chars. */
export function filterLibrary(docs: LibraryDoc[], query: string): LibraryDoc[] {
  const q = query.trim().toLowerCase();
  if (!q) return docs;
  return docs.filter((d) => {
    const head = d.content.slice(0, 600).toLowerCase();
    return d.title.toLowerCase().includes(q) || head.includes(q);
  });
}

/**
 * Keyword-category filters (B5 filter row) — the corpus docs carry no
 * structured tags, so each filter is a keyword group matched against the
 * title + first 600 chars. Honest about being substring filters.
 */
export const LIBRARY_FILTERS: Array<{ key: string; label: string; keywords: string[] }> = [
  { key: "depression", label: "Depression", keywords: ["depress", "mood", "anhedonia"] },
  { key: "anxiety", label: "Anxiety & panic", keywords: ["anxiety", "panic", "phobia"] },
  { key: "psychosis", label: "Psychosis", keywords: ["psychosis", "schizophren", "delusion", "hallucinat"] },
  { key: "bipolar", label: "Bipolar", keywords: ["bipolar", "mania", "hypomania"] },
  { key: "substance", label: "Substance", keywords: ["alcohol", "substance", "cannabis", "opioid", "benzodiazepine"] },
  { key: "trauma", label: "Trauma", keywords: ["ptsd", "trauma", "dissociat", "grief"] },
  { key: "adolescent", label: "Child & adolescent", keywords: ["adolescen", "child", "teen", "paediatric", "pediatric"] },
  { key: "somatic", label: "Somatic & cultural", keywords: ["somatic", "somati", "cultural", "possession", "idiom"] },
  { key: "geriatric", label: "Older adults", keywords: ["elderly", "geriatric", "older", "dementia", "delirium"] },
  { key: "medical", label: "Medical mimics", keywords: ["thyroid", "b12", "anaemia", "hypothyroid", "epilepsy", "delirium"] },
];

export function filterLibraryByTag(docs: LibraryDoc[], tagKey: string): LibraryDoc[] {
  const f = LIBRARY_FILTERS.find((x) => x.key === tagKey);
  if (!f) return docs;
  return docs.filter((d) => {
    const head = `${d.title} ${d.content.slice(0, 600)}`.toLowerCase();
    return f.keywords.some((k) => head.includes(k));
  });
}
