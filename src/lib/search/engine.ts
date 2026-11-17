/**
 * The search engine shared by the website and the phone app (the app keeps a
 * byte-for-byte copy in apps/mobile/src/lib/search-engine.ts; a test checks
 * they match). Pure, no imports, fast enough to run on every key press over a
 * few thousand items.
 *
 * Every word typed must be found in an item (in its title, its keywords or
 * its meta line). A word is found when it is the same word, the start of a
 * word, inside a long word, or one or two letters off ("skizophrenia",
 * "lithum", "sertaline"). Title hits count most.
 */

export type SearchDoc = {
  /** Unique across every type. */
  id: string;
  /** The group it shows under (lecture, module, medicine...). */
  type: string;
  title: string;
  /** The line under the title. Searched, weakly. */
  meta?: string;
  /** Other names: brands, aliases, section titles, email, roll number. */
  keywords?: readonly string[];
  /** A small push up for the items people open most (0 to 5). */
  boost?: number;
};

export type Prepared<D extends SearchDoc = SearchDoc> = {
  doc: D;
  title: string;
  titleWords: string[];
  keyWords: string[];
  keyPhrases: string[];
  metaWords: string[];
};

export type Hit<D extends SearchDoc = SearchDoc> = { doc: D; score: number };

/** Lower case, no accents, letters and digits only, single spaces. */
export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function words(s: string): string[] {
  const n = normalize(s);
  return n ? n.split(" ") : [];
}

/** How many letters a typed word may be off by: none under 4 letters, one up to 6, then two. */
export function allowedEdits(len: number): number {
  return len < 4 ? 0 : len < 7 ? 1 : 2;
}

/**
 * Edit distance with swapped neighbours counting as one (optimal string
 * alignment), giving up as soon as it passes `max` (returns max + 1).
 */
export function editDistance(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const n = b.length;
  let prev2: number[] = [];
  let prev: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2]! + 1);
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[n]!;
}

export function prepare<D extends SearchDoc>(doc: D): Prepared<D> {
  const keys = (doc.keywords ?? []).map(normalize).filter(Boolean);
  return {
    doc,
    title: normalize(doc.title),
    titleWords: words(doc.title),
    keyWords: [...new Set(keys.flatMap((k) => k.split(" ")))],
    keyPhrases: keys,
    metaWords: words(doc.meta ?? ""),
  };
}

/** How well one typed word matches a list of words: 0 when it does not. */
function wordScore(w: string, list: readonly string[], weight: number): number {
  const edits = allowedEdits(w.length);
  let best = 0;
  for (const t of list) {
    let s = 0;
    if (t === w) s = 10;
    else if (t.startsWith(w)) s = w.length >= 2 ? 8 : 5;
    else if (w.length >= 3 && t.length > w.length && t.includes(w)) s = 5;
    else if (edits) {
      const d = editDistance(w, t, edits);
      if (d <= edits) s = 7 - 2 * d;
      else if (t.length > w.length) {
        // Typing the start of a long word with a slip: "shizo" for "schizophrenia".
        let p = edits + 1;
        for (let n = w.length - 1; n <= w.length + 1 && p > 0; n++) if (n >= 3 && n < t.length) p = Math.min(p, editDistance(w, t.slice(0, n), edits));
        if (p <= edits) s = 5 - 2 * p;
      }
    }
    if (s > best) best = s;
    if (best === 10) break;
  }
  return best * weight;
}

/** The score of one item for an already split query; 0 when any typed word is missing. */
export function scorePrepared(p: Prepared, qWords: readonly string[], qText: string): number {
  if (!qWords.length) return 0;
  let total = 0;
  for (const w of qWords) {
    const s = Math.max(wordScore(w, p.titleWords, 1.6), wordScore(w, p.keyWords, 1), wordScore(w, p.metaWords, 0.5));
    if (s <= 0) return 0;
    total += s;
  }
  if (p.title === qText) total += 40;
  else if (p.title.startsWith(qText)) total += 20;
  else if (qText.length >= 3 && p.title.includes(qText)) total += 10;
  if (p.keyPhrases.includes(qText)) total += 15;
  return total + (p.doc.boost ?? 0);
}

export function scoreDoc(doc: SearchDoc, query: string): number {
  return scorePrepared(prepare(doc), words(query), normalize(query));
}

export type SearchOptions = {
  /** At most this many results in all. */
  limit?: number;
  /** At most this many results of one type. */
  perType?: number;
  /** Only these types. */
  types?: readonly string[];
};

/** A prepared list of items, searched many times (keep one per data set). */
export function createIndex<D extends SearchDoc>(docs: readonly D[]) {
  const prepared = docs.map(prepare);
  return {
    size: prepared.length,
    search(query: string, opts: SearchOptions = {}): Hit<D>[] {
      return rank(prepared, query, opts);
    },
  };
}

/** Search a list of items once. */
export function searchDocs<D extends SearchDoc>(docs: readonly D[], query: string, opts: SearchOptions = {}): Hit<D>[] {
  return rank(docs.map(prepare), query, opts);
}

function rank<D extends SearchDoc>(prepared: readonly Prepared<D>[], query: string, { limit = 60, perType = 8, types }: SearchOptions): Hit<D>[] {
  const qText = normalize(query).slice(0, 80);
  const qWords = qText ? qText.split(" ").slice(0, 8) : [];
  if (!qWords.length) return [];
  const only = types?.length ? new Set(types) : null;
  const hits: Hit<D>[] = [];
  for (const p of prepared) {
    if (only && !only.has(p.doc.type)) continue;
    const score = scorePrepared(p, qWords, qText);
    if (score > 0) hits.push({ doc: p.doc, score });
  }
  hits.sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title));
  const count = new Map<string, number>();
  const out: Hit<D>[] = [];
  for (const h of hits) {
    const n = count.get(h.doc.type) ?? 0;
    if (n >= perType) continue;
    count.set(h.doc.type, n + 1);
    out.push(h);
    if (out.length >= limit) break;
  }
  return out;
}

/** Results in groups, in the order given (types not listed come last, best first). */
export function groupHits<D extends SearchDoc>(hits: readonly Hit<D>[], order: readonly string[] = []): { type: string; hits: Hit<D>[] }[] {
  const groups = new Map<string, Hit<D>[]>();
  for (const h of hits) {
    const g = groups.get(h.doc.type);
    if (g) g.push(h);
    else groups.set(h.doc.type, [h]);
  }
  const pos = (t: string) => {
    const i = order.indexOf(t);
    return i === -1 ? order.length : i;
  };
  return [...groups.entries()].map(([type, list]) => ({ type, hits: list })).sort((a, b) => pos(a.type) - pos(b.type) || b.hits[0]!.score - a.hits[0]!.score);
}

/** Recent searches: newest first, no repeats (any case), at most `max`. */
export function addRecent(list: readonly string[], term: string, max = 8): string[] {
  const t = term.trim().slice(0, 80);
  if (t.length < 2) return [...list];
  return [t, ...list.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, max);
}
