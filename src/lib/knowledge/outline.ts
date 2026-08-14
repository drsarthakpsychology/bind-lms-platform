/**
 * The per-book structural outline contract — produced by the reading agents,
 * consumed by the chunker. Gives every chunk source traceability
 * (book → chapter → section → PDF page) without fabricating page numbers:
 * page numbers are the PDF page index (from the `<<<PAGE n>>>` markers), NOT
 * printed page numbers, until a front-matter offset is calibrated.
 */

export interface OutlineSection {
  /** section heading text, verbatim-ish */
  title: string;
  /** first PDF page this section appears on (1-based) */
  page: number;
}

export interface OutlineChapter {
  /** chapter number/title */
  title: string;
  /** first PDF page of the chapter (1-based) */
  pageStart: number;
  /** last PDF page of the chapter (1-based, inclusive — the chunker iterates p <= pageEnd) */
  pageEnd: number;
  /** key subsections, in order */
  sections: OutlineSection[];
}

export interface BookOutline {
  id: string; // matches BookManifest.id
  /** book-level confidence: high | medium | low */
  confidence: "high" | "medium" | "low";
  /** extraction/OCR issues found (headers/footers, garbled tables, duplicates) */
  issues: string[];
  /** true if the extraction appears to be a partial preview/duplicate */
  isPreview?: boolean;
  /** front matter in reading order (cover, title, copyright, contents, intro…) */
  frontMatter?: OutlineChapter[];
  chapters: OutlineChapter[];
  /** back matter in reading order (appendices, references, indices, glossaries…) */
  backMatter?: OutlineChapter[];
  /** any pages that could not be attributed to a chapter (gaps) */
  unattributedPages: number[];
}
