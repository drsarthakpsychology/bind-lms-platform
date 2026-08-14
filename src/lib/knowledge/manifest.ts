/**
 * The authorized psychology book corpus — the single registry the knowledge
 * pipeline reads from. Every entry is a real, verified PDF in the provided
 * books folder; metadata mirrors the psychopharm SOURCES registry where the
 * id overlaps (one source of truth for titles/authors/editions).
 *
 * Text caches (scripts/psychopharm/text/<id>.txt) carry per-page extraction
 * with `<<<PAGE n>>>` markers — this pipeline's document layer. Page numbers
 * are PDF-relative until a front-matter offset is calibrated per book; the
 * system stores PDF page indexes and labels them as such (never fabricates
 * printed page numbers).
 */
import { SOURCES } from "@/lib/psychopharm/sources";

export interface BookManifest {
  /** stable source id (matches psychopharm SOURCES where they overlap) */
  id: string;
  /** on-disk PDF path in the authorized books folder */
  pdfPath: string;
  /** extracted per-page text cache (<<<PAGE n>>> markers) */
  textCache: string;
  /** PDF page count (from pdftotext) */
  pages: number;
  /** sha256 of the source PDF (resumability / change detection) */
  pdfHash: string;
  /** R2 keys for original + extracted text (knowledge/… prefix) */
  r2: { original: string; text: string };
  /** book_type for corpus_sources */
  bookType: "pharmacology" | "clinical_psychology" | "reference";
}

const BOOKS_DIR = "/Users/kavyabothra/Desktop/psy-books";

/**
 * Each entry: real PDF filename, its extracted text cache, the PDF page count
 * verified from scripts/psychopharm/text/manifest.json, and R2 destination
 * keys. pdfHash is filled at ingest time by hashing the actual file.
 */
export const BOOKS: BookManifest[] = [
  {
    id: "dsm5tr",
    pdfPath: `${BOOKS_DIR}/DSM 5 TR-APA (2022).pdf`,
    textCache: "scripts/psychopharm/text/dsm5tr.txt",
    pages: 1377,
    pdfHash: "", // computed at ingest
    r2: { original: "knowledge/books/dsm5tr/original.pdf", text: "knowledge/books/dsm5tr/text.txt" },
    bookType: "reference",
  },
  {
    id: "kaplan_sadock",
    pdfPath: `${BOOKS_DIR}/Kaplan _ Sadock’s Synopsis of Psychiatry (2021).pdf`,
    textCache: "scripts/psychopharm/text/kaplan_sadock.txt",
    pages: 3768,
    pdfHash: "",
    r2: { original: "knowledge/books/kaplan_sadock/original.pdf", text: "knowledge/books/kaplan_sadock/text.txt" },
    bookType: "reference",
  },
  {
    id: "maudsley_2021",
    pdfPath: `${BOOKS_DIR}/Prescribing Guidelines in Psychiatry, David M. Taylor (2021).pdf`,
    textCache: "scripts/psychopharm/text/maudsley_2021.txt",
    pages: 978,
    pdfHash: "",
    r2: { original: "knowledge/books/maudsley_2021/original.pdf", text: "knowledge/books/maudsley_2021/text.txt" },
    bookType: "pharmacology",
  },
  {
    id: "stahl_pg_7th",
    pdfPath: `${BOOKS_DIR}/prescribers-guide-stahls-essential-psychopharmacology-7nbsped-1108926010-9781108926010_compress.pdf`,
    textCache: "scripts/psychopharm/text/stahl_pg_7th.txt",
    pages: 2697,
    pdfHash: "",
    r2: { original: "knowledge/books/stahl_pg_7th/original.pdf", text: "knowledge/books/stahl_pg_7th/text.txt" },
    bookType: "pharmacology",
  },
  {
    id: "stahl_essential_5th",
    pdfPath: `${BOOKS_DIR}/stahlx27s-essential-psychopharmacology-5th-edition_compress.pdf`,
    textCache: "scripts/psychopharm/text/stahl_essential_5th.txt",
    pages: 640,
    pdfHash: "",
    r2: { original: "knowledge/books/stahl_essential_5th/original.pdf", text: "knowledge/books/stahl_essential_5th/text.txt" },
    bookType: "pharmacology",
  },
  {
    id: "stahl_pg_older",
    pdfPath: `${BOOKS_DIR}/Essential Psychopharmacology Prescribers Guide - Stephen M Stahl.pdf`,
    textCache: "scripts/psychopharm/text/stahl_pg_older.txt",
    pages: 588,
    pdfHash: "",
    r2: { original: "knowledge/books/stahl_pg_older/original.pdf", text: "knowledge/books/stahl_pg_older/text.txt" },
    bookType: "pharmacology",
  },
  {
    id: "stahl_pg_preview",
    pdfPath: `${BOOKS_DIR}/preview-9781009464765_A49238956.pdf`,
    textCache: "scripts/psychopharm/text/stahl_pg_preview.txt",
    pages: 98,
    pdfHash: "",
    r2: { original: "knowledge/books/stahl_pg_preview/original.pdf", text: "knowledge/books/stahl_pg_preview/text.txt" },
    bookType: "pharmacology",
  },
  {
    id: "fish_psychopath",
    pdfPath: `${BOOKS_DIR}/Fish's Clinical Psychopathology, 3rd Edition_230806_023436.pdf`,
    textCache: "scripts/psychopharm/text/fish_psychopath.txt",
    pages: 137,
    pdfHash: "",
    r2: { original: "knowledge/books/fish_psychopath/original.pdf", text: "knowledge/books/fish_psychopath/text.txt" },
    bookType: "clinical_psychology",
  },
  {
    id: "ahuja_psychiatry",
    pdfPath: `${BOOKS_DIR}/Niraj Ahuja-A Short Textbook of Psychiatry_ 20th Year Edition-Jaypee Brothers Med. Pub. (2010).pdf`,
    textCache: "scripts/psychopharm/text/ahuja_psychiatry.txt",
    pages: 273,
    pdfHash: "",
    r2: { original: "knowledge/books/ahuja_psychiatry/original.pdf", text: "knowledge/books/ahuja_psychiatry/text.txt" },
    bookType: "clinical_psychology",
  },
  {
    id: "icd11",
    pdfPath: `${BOOKS_DIR}/refguide.pdf`,
    textCache: "scripts/psychopharm/text/icd11.txt",
    pages: 473,
    pdfHash: "",
    r2: { original: "knowledge/books/icd11/original.pdf", text: "knowledge/books/icd11/text.txt" },
    bookType: "reference",
  },
];

/** Metadata lookup re-exported from the psychopharm source registry. */
export function bookMeta(id: string) {
  return SOURCES[id];
}
