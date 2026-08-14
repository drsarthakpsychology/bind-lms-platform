/**
 * Deterministic chunker — turns the per-page book text + a BookOutline into
 * hierarchical corpus chunks (book → chapter → section → passage) with page
 * traceability. Pure library (no Supabase, no network), fully testable.
 *
 * Text cache format (from scripts/psychopharm/text/<id>.txt):
 *   <<<PAGE 1>>>
 *   ...text of page 1...
 *   <<<PAGE 2>>>
 *   ...
 *
 * Strategy:
 *   1. Split the cache into pages keyed by the PDF page index.
 *   2. Attribute each page to a chapter (and, where possible, a section)
 *      using the outline's page ranges.
 *   3. Within each chapter/section, split on paragraph + sentence boundaries
 *      into self-contained passages (~500–900 chars) so a retrieved chunk
 *      reads well on its own.
 *   4. Emit a chunk per passage carrying book/chapter/section/page metadata.
 *
 * Page numbers are PDF indexes (the <<<PAGE n>>> marker value), never printed
 * page numbers — the outline contract guarantees this.
 */
import type { BookOutline, OutlineChapter } from "./outline";

export interface Page {
  index: number; // 1-based PDF page index
  text: string;
}

export interface KnowledgeChunk {
  sourceId: string; // book id (matches BookManifest.id)
  documentId?: string; // set by the ingester
  chapter: string;
  section: string;
  pageStart: number;
  pageEnd: number;
  text: string;
}

/** Split a text cache into pages keyed by PDF page index. */
export function splitPages(cacheText: string): Page[] {
  const pages: Page[] = [];
  const re = /<<<PAGE (\d+)>>>\s*([\s\S]*?)(?=<<<PAGE \d+>>>|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cacheText)) !== null) {
    const index = Number(m[1]);
    const text = (m[2] ?? "").trim();
    pages.push({ index, text });
  }
  return pages.sort((a, b) => a.index - b.index);
}

/** Flatten front matter + chapters + back matter into one reading-order list. */
export function allOutlineChapters(outline: BookOutline): OutlineChapter[] {
  return [
    ...(outline.frontMatter ?? []),
    ...outline.chapters,
    ...(outline.backMatter ?? []),
  ];
}

/** Build a lookup of page index → chapter title from the outline. */
export function pageToChapter(outline: BookOutline): Map<number, string> {
  const map = new Map<number, string>();
  for (const ch of allOutlineChapters(outline)) {
    for (let p = ch.pageStart; p <= ch.pageEnd; p++) map.set(p, ch.title);
  }
  return map;
}

/** Build a lookup of page index → section title from the outline. */
export function pageToSection(outline: BookOutline): Map<number, string> {
  const map = new Map<number, string>();
  for (const ch of allOutlineChapters(outline)) {
    for (const s of ch.sections ?? []) map.set(s.page, s.title);
  }
  return map;
}

/**
 * Split a block of text into passages at sentence boundaries, each within
 * [minChars, maxChars]. Preserves as much of the original as possible — no
 * invented content.
 */
export function splitPassages(text: string, maxChars = 900, minChars = 400): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length === 0) return [];
  if (clean.length <= maxChars) return [clean];

  const passages: string[] = [];
  let rest = clean;
  while (rest.length > maxChars) {
    // Find a sentence boundary (followed by a capital letter or digit) within
    // [minChars, maxChars].
    let cut = -1;
    for (let i = maxChars; i >= minChars; i--) {
      if (i >= rest.length) continue;
      const ch = rest[i];
      if (".!?".includes(ch)) {
        // A boundary is stronger if the char after is a space + capital/digit.
        const after = rest[i + 1];
        if (after === " " || after === undefined) {
          const nextNonSpace = rest.slice(i + 1).match(/[^\s]/);
          if (nextNonSpace && /[A-Z0-9(]/.test(nextNonSpace[0])) {
            cut = i + 1;
            break;
          }
        }
      }
    }
    if (cut === -1) {
      // No good sentence boundary — fall back to the last comma/semicolon, then hard cut.
      let commaCut = -1;
      for (let i = maxChars; i >= minChars; i--) {
        if (",;:".includes(rest[i] ?? "")) { commaCut = i + 1; break; }
      }
      cut = commaCut !== -1 ? commaCut : maxChars;
    }
    passages.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest.length > 0) passages.push(rest);
  return passages;
}

/** Clean a page: strip common header/footer noise for chunk quality. */
export function cleanPageText(text: string): string {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join("\n");
}

export interface ChunkOptions {
  /** max chars per passage */
  maxChars?: number;
  /** min chars before forcing a sentence-boundary search */
  minChars?: number;
}

/**
 * Chunk a whole book cache into KnowledgeChunks using the outline. Every chunk
 * gets chapter/section/page metadata from the outline (not fabricated).
 */
export function chunkBook(
  sourceId: string,
  cacheText: string,
  outline: BookOutline,
  opts: ChunkOptions = {},
): KnowledgeChunk[] {
  const maxChars = opts.maxChars ?? 900;
  const minChars = opts.minChars ?? 400;
  const pages = splitPages(cacheText);
  const chMap = pageToChapter(outline);
  const secMap = pageToSection(outline);

  // Group pages by (chapter, section).
  const groups = new Map<string, { chapter: string; section: string; pages: Page[] }>();
  for (const p of pages) {
    const chapter = chMap.get(p.index) ?? "Unattributed";
    // Section attribution: use the nearest section boundary at or before this page.
    let section = secMap.get(p.index) ?? "Unattributed";
    if (section === "Unattributed") {
      // Fall back to the last known section within the same chapter (sections
      // persist until the next section marker).
      const ch = allOutlineChapters(outline).find(
        (c) => p.index >= c.pageStart && p.index <= c.pageEnd,
      );
      if (ch) {
        const prior = (ch.sections ?? []).filter((s) => s.page <= p.index).at(-1);
        if (prior) section = prior.title;
      }
    }
    const key = `${chapter}||${section}`;
    if (!groups.has(key)) groups.set(key, { chapter, section, pages: [] });
    groups.get(key)!.pages.push(p);
  }

  const chunks: KnowledgeChunk[] = [];
  for (const { chapter, section, pages: groupPages } of groups.values()) {
    const blockText = cleanPageText(groupPages.map((p) => p.text).join("\n"));
    const passages = splitPassages(blockText, maxChars, minChars);
    const pageStart = groupPages[0]?.index ?? 0;
    const pageEnd = groupPages.at(-1)?.index ?? pageStart;
    for (const text of passages) {
      chunks.push({ sourceId, chapter, section, pageStart, pageEnd, text });
    }
  }
  return chunks;
}
