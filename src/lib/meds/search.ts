import type { MedGroup } from "./types";

/** What the search box needs: small, so the list can be searched in the browser instantly. */
export type MedIndexRow = { id: string; name: string; cls: string; group: MedGroup; brands: string[]; uses: string[]; line: string };
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Rank medicines for a query: name start beats brand start beats a word in the
 * class or a use; small typos in names are forgiven (one letter wrong or missing).
 */
export function searchMeds(rows: MedIndexRow[], q: string): MedIndexRow[] {
  const query = norm(q);
  if (!query) return rows;
  const scored: { r: MedIndexRow; s: number }[] = [];
  for (const r of rows) {
    const name = norm(r.name);
    const brands = r.brands.map(norm);
    const words = norm(`${r.cls} ${r.group} ${r.uses.join(" ")}`);
    let s = 0;
    if (name.startsWith(query)) s = 100;
    else if (brands.some((b) => b.startsWith(query))) s = 80;
    else if (name.includes(query)) s = 60;
    else if (brands.some((b) => b.includes(query))) s = 50;
    else if (words.includes(query)) s = 30;
    else if (query.length >= 4 && (close(name, query) || close(name.slice(0, query.length), query))) s = 20;
    if (s) scored.push({ r, s });
  }
  return scored.sort((a, b) => b.s - a.s || a.r.name.localeCompare(b.r.name)).map((x) => x.r);
}

/** One edit apart (a typo). */
function close(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

