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

let CACHE: { at: number; docs: LibraryDoc[] } | null = null;

/** Read the normalised PMC docs (cached for the process lifetime). */
export function getLibraryDocs(): LibraryDoc[] {
  if (CACHE && Date.now() - CACHE.at < 60_000) return CACHE.docs;
  const path = join(process.cwd(), "scripts/corpus/normalised/pmc.json");
  try {
    const raw = readFileSync(path, "utf8");
    const docs = JSON.parse(raw) as LibraryDoc[];
    CACHE = { at: Date.now(), docs };
    return docs;
  } catch {
    return [];
  }
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
