/**
 * Casebook extraction pipeline (Part 2.3 — "flip a row to licensed, the
 * ingester picks it up"). Quality order:
 *
 *   1. native ePub / HTML   — extractFromEpub / extractFromHtml
 *   2. PDF text layer       — extractFromPdf (system `pdftotext` first — the
 *                              corpus scripts' established tool — else the
 *                              built-in tolerant content-stream extractor)
 *   3. OCR last resort      — extractWithOcr (pdftoppm + tesseract), reported
 *                              with ocr:true so downstream code treats it as
 *                              lower-confidence
 *
 * The built-in PDF extractor is a real parser over content-stream operators
 * (q/Q BT/ET Td/TD/T* Tj/TJ + string literals), NOT a regex over raw streams:
 * multi-byte hex strings, balanced quotes, kerning arrays and UTF-16BE hex
 * strings are handled; image/colour operators never leak into output.
 * `pdf-parse` is not in package.json, so per spec the tolerant stream
 * extractor is implemented here.
 *
 * Pure library: no server-only deps, no Supabase. Node 20+.
 */
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inflateSync } from "node:zlib";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ExtractedText {
  title?: string;
  text: string;
  /** "epub" | "html" | "pdf" | "ocr" */
  format: string;
  ocr: boolean;
  /** extraction notes, e.g. "pdftotext", "tolerant stream extractor" */
  method: string;
}

/**
 * Extract text from a PDF buffer. Prefers the system `pdftotext` (the tool
 * the corpus scripts already use); falls back to the built-in tolerant
 * content-stream extractor; OCR (pdftoppm + tesseract) is the last resort
 * and only runs when opts.ocr is true.
 */
export function extractFromPdf(buf: Buffer, opts?: { ocr?: boolean }): ExtractedText {
  if (buf.length < 4 || !buf.subarray(0, 4).equals(Buffer.from("%PDF"))) {
    throw new Error("not a PDF (missing %PDF magic)");
  }
  if (programOnPath("pdftotext")) {
    const dir = mkdtempSync(join(tmpdir(), "plms-extract-"));
    try {
      const file = join(dir, "src.pdf");
      writeFileSync(file, buf);
      const r = spawnSync("pdftotext", [file, "-"], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
      const text = (r.stdout ?? "").trim();
      if (text) return { text, format: "pdf", ocr: false, method: "pdftotext" };
    } catch {
      // fall through to the built-in extractor
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  const builtin = extractPdfStreams(buf);
  if (builtin.trim().length > 0) return { text: builtin, format: "pdf", ocr: false, method: "tolerant stream extractor" };
  if (opts?.ocr) {
    const ocrText = extractWithOcr(buf);
    if (ocrText) return { text: ocrText, format: "ocr", ocr: true, method: "tesseract OCR (last resort)" };
  }
  return { text: "", format: "pdf", ocr: false, method: "no text layer; scanned PDFs need ocr:true" };
}

/**
 * Extract text from an ePub (zip) buffer via adm-zip: parse the OPF manifest
 * (container.xml → rootfile → spine → item hrefs), decode each XHTML spine
 * item, and concatenate the visible text. HTML entities + tags are stripped.
 */
export function extractFromEpub(buf: Buffer): ExtractedText {
  const zip = openZip(buf);
  const container = zip.readText("META-INF/container.xml") ?? "";
  const rootfile = /<rootfile[^>]*full-path=["']([^"']+)/i.exec(container)?.[1];
  if (!rootfile) throw new Error("ePub has no OPF rootfile");
  const opfName = rootfile.replace(/^\/+/, "");
  const opf = zip.readText(opfName) ?? "";
  const baseDir = opfName.includes("/") ? opfName.slice(0, opfName.lastIndexOf("/") + 1) : "";

  const title = /<dc:title[^>]*>([\s\S]*?)<\/dc:title>/i.exec(opf)?.[1]?.trim();
  const spineIds = [...opf.matchAll(/<itemref[^>]*idref=["']([^"']+)/gi)].map((m) => m[1]);
  const items = new Map<string, { href?: string; mediaType?: string }>();
  for (const m of opf.matchAll(/<item[^>]*>/gi)) {
    const id = /id=["']([^"']+)/i.exec(m[0])?.[1];
    if (!id) continue;
    items.set(id, {
      href: /href=["']([^"']+)/i.exec(m[0])?.[1],
      mediaType: /media-type=["']([^"']+)/i.exec(m[0])?.[1],
    });
  }

  const parts: string[] = [];
  const seen = new Set<string>();
  const MAX_CHARS = 2_500_000;
  let total = 0;
  for (const id of spineIds) {
    const item = items.get(id);
    if (!item?.href) continue;
    if (item.mediaType && !/xhtml|html/i.test(item.mediaType)) continue;
    const name = baseDir + item.href.replace(/^\.\//, "");
    const raw = zip.readText(name);
    if (raw === null) continue;
    seen.add(name.toLowerCase());
    const part = htmlToText(raw);
    parts.push(part);
    total += part.length;
    if (total > MAX_CHARS) break; // be nice to memory on giant ebooks
  }
  // Fallback: any XHTML left in the zip that the spine missed.
  if (parts.length === 0) {
    for (const n of zip.entries) {
      if (!/\.x?html?$/i.test(n)) continue;
      const key = n.toLowerCase();
      if (seen.has(key)) continue;
      const raw = zip.readText(n);
      if (raw === null) continue;
      parts.push(htmlToText(raw));
      seen.add(key);
    }
  }
  const text = parts.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!text) throw new Error("ePub yielded no text");
  return { title, text, format: "epub", ocr: false, method: "adm-zip + OPF spine" };
}

/**
 * Extract text from an HTML buffer (native web publication).
 * The <title> becomes the doc title; <script>/<style> are dropped entirely.
 */
export function extractFromHtml(buf: Buffer, opts?: { title?: string }): ExtractedText {
  const html = buf.toString("utf8");
  const title = opts?.title ?? /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim();
  return { title, text: htmlToText(html), format: "html", ocr: false, method: "html text layer" };
}

/**
 * Dispatch by magic bytes: %PDF → PDF, zip (PK) → ePub, else HTML.
 * Pure-library entry point for the CLI.
 */
export function extractBuffer(buf: Buffer, hint?: { title?: string; ext?: string; ocrForPdf?: boolean }): ExtractedText {
  if (buf.subarray(0, 4).equals(Buffer.from("%PDF"))) return extractFromPdf(buf, { ocr: hint?.ocrForPdf });
  if (buf.subarray(0, 2).equals(Buffer.from("PK"))) return extractFromEpub(buf);
  return extractFromHtml(buf, { title: hint?.title });
}

// ---------------------------------------------------------------------------
// OCR (last resort)
// ---------------------------------------------------------------------------

/**
 * Render the PDF pages to images (pdftoppm) and read them with tesseract.
 * Only useful when the PDF has no text layer (scanned books). Both binaries
 * must be on PATH or this returns null.
 */
export function extractWithOcr(buf: Buffer): string | null {
  if (!programOnPath("pdftoppm") || !programOnPath("tesseract")) return null;
  const dir = mkdtempSync(join(tmpdir(), "plms-ocr-"));
  try {
    const pdf = join(dir, "src.pdf");
    writeFileSync(pdf, buf);
    const base = join(dir, "page");
    const r = spawnSync("pdftoppm", ["-r", "200", "-png", pdf, base], { stdio: "ignore" });
    if (r.status !== 0) return null;
    const pages = readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
    if (pages.length === 0) return null;
    const out: string[] = [];
    for (const p of pages) {
      const tr = spawnSync("tesseract", [join(dir, p), "-", "--psm", "3"], {
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      });
      if (tr.stdout?.trim()) out.push(tr.stdout.trim());
    }
    return out.length ? out.join("\n\n") : null;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// The tolerant PDF content-stream extractor
// ---------------------------------------------------------------------------

/**
 * Extract text from every /Type /Page object's content stream(s). Returns
 * pages joined with "\n<<<PAGE>>>\n" so downstream chunking can respect page
 * boundaries. Never touches image XObjects or colour operators.
 */
export function extractPdfStreams(buf: Buffer): string {
  const src = new Uint8Array(buf);
  const pages: Uint8Array[] = [];
  const objects = objectMap(src);
  const pageRefs = pageObjectRefs(src);
  for (const ref of pageRefs) {
    const m = /(\d+)\s+(\d+)\s+R/.exec(ref);
    if (!m) continue;
    const data = objects.get(`${m[1]} ${m[2]}`);
    if (data) pushPageContents(data, objects, pageRefs, pages);
  }
  return pages
    .filter((p) => p.length > 0)
    .map((p) => renderContentStream(p))
    .filter((t) => t.trim().length > 0)
    .join("\n<<<PAGE>>>\n")
    .trim();
}

/** Every /Contents reference from a /Type /Page object (direct or array). */
function pageObjectRefs(src: Uint8Array): Set<string> {
  const refs = new Set<string>();
  const text = bufString(src);
  const re = /\/Type\s*\/Page\b([\s\S]*?)\/Contents\s*(\[\s*[\s\S]*?\]|\d+\s+\d+\s+R)/g;
  for (const m of text.matchAll(re)) {
    const ref = m[2].trim();
    if (ref.startsWith("[")) {
      for (const inner of ref.matchAll(/(\d+)\s+\d+\s+R/g)) refs.add(inner[0]);
    } else {
      refs.add(ref);
    }
  }
  return refs;
}

function objectMap(src: Uint8Array): Map<string, string> {
  const out = new Map<string, string>();
  const text = bufString(src);
  for (const m of text.matchAll(/(\d+)\s+(\d+)\s+obj\b([\s\S]*?)endobj/g)) {
    out.set(`${m[1]} ${m[2]}`, m[3]);
  }
  return out;
}

/**
 * Gather a page's content streams. The /Contents reference points at one or
 * more stream objects; the page itself may also carry a direct inline stream
 * (rare) — used only when no referenced stream resolved.
 */
function pushPageContents(body: string, objects: Map<string, string>, pageRefs: Set<string>, pages: Uint8Array[]) {
  let found = false;
  for (const m of body.matchAll(/(\d+)\s+(\d+)\s+R/g)) {
    const key = `${m[1]} ${m[2]}`;
    const data = objects.get(key);
    if (!data) continue;
    // Skip refs that are themselves page objects (page trees / kids arrays).
    if (pageRefs.has(`${key} R`)) continue;
    if (/stream\b/.test(data)) {
      pages.push(decodeStream(data));
      found = true;
    }
  }
  if (!found && /stream\b/.test(body)) {
    pages.push(decodeStream(body));
  }
}

/** Pull the raw stream bytes out of an object body; inflate if FlateDecode. */
function decodeStream(body: string): Uint8Array {
  const m = /stream\s*([\s\S]*?)\s*endstream/.exec(body)?.[1] ?? "";
  const s = m.replace(/^\s*[\r\n]+/, "").replace(/[\r\n]+\s*$/, "");
  if (/\/FlateDecode/.test(body)) {
    try {
      return inflateSync(Buffer.from(s, "latin1"));
    } catch {
      // Not zlib-flate (or corrupt) — treat the bytes as literal text.
    }
  }
  return new TextEncoder().encode(s);
}

/**
 * Text-showing operator interpreter for one content stream:
 * BT/ET brackets, Td/TD/T* position (new line when y drops), Tj show-string,
 * TJ kerning array (large negative kerning → space), ' and " line endings.
 * Non-text operators (q/Q graphics state, image data) are ignored by design.
 */
function renderContentStream(stream: Uint8Array): string {
  const text = decodeTextBytes(stream);
  const tokens = tokeniseContent(text);
  const lines: string[] = [];
  let line = "";
  let inText = false;
  let lastY: number | null = null;

  const flushLine = () => {
    if (line.trim()) lines.push(line.trimEnd());
    line = "";
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "BT") { inText = true; continue; }
    if (t === "ET") { inText = false; continue; }
    if (!inText) continue;
    if (t === "T*") { flushLine(); continue; }
    if (t === "Td" || t === "TD") {
      const y = Number(tokens[i - 1]); // args are: tx ty Td
      if (!Number.isNaN(y)) {
        if (lastY !== null && y < lastY - 1) flushLine();
        lastY = y;
      }
      continue;
    }
    if (t === "Tj") {
      const s = tokens[i - 1];
      if (s?.startsWith("(")) line += unescapePdfString(s);
      else if (s?.startsWith("<")) line += hexToText(s);
      else flushLine(); // mis-parse guard: operator with no string arg
      continue;
    }
    if (t === "TJ") {
      const arr = tokens[i - 1];
      if (arr?.startsWith("[")) {
        for (const part of splitTJArray(arr)) {
          if (part.startsWith("(")) line += unescapePdfString(part);
          else if (part.startsWith("<")) line += hexToText(part);
          else {
            const k = Number(part);
            if (!Number.isNaN(k) && k < -150) line += " "; // large negative kerning
          }
        }
      }
      continue;
    }
    if (t === "'" || t === "\"") { flushLine(); continue; }
  }
  flushLine();
  return lines.join("\n");
}

/**
 * Decode content-stream bytes: UTF-8 first; if the result is dominated by
 * replacement chars (WinAnsi PDFs are not UTF-8), fall back to raw
 * byte-preserving latin1. NOTE: uses Buffer.toString("latin1") — Node 26's
 * TextDecoder("latin1") is broken (aliases iso-8859-1, which mangles bytes
 * like 0x9C). Binary PDF bytes must never round-trip through a TextDecoder.
 */
function decodeTextBytes(bytes: Uint8Array): string {
  let s = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  const replacement = (s.match(/�/g) ?? []).length;
  if (replacement > 0 && replacement / Math.max(s.length, 1) > 0.005) {
    s = Buffer.from(bytes).toString("latin1");
  }
  return s.replace(/\0/g, "");
}

/**
 * Tokenise a PDF content stream into operators and operands, keeping
 * parenthesised strings, <<dicts>>, [arrays] and <hex> literals intact.
 */
function tokeniseContent(text: string): string[] {
  const out: string[] = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (c === "(") {
      let depth = 1;
      let j = i + 1;
      let esc = false;
      while (j < n && depth > 0) {
        const ch = text[j];
        if (esc) esc = false;
        else if (ch === "\\") esc = true;
        else if (ch === "(") depth++;
        else if (ch === ")") depth--;
        j++;
      }
      out.push(text.slice(i, j));
      i = j;
    } else if (c === "<" && text[i + 1] === "<") {
      const j = text.indexOf(">>", i + 2);
      if (j === -1) { i++; continue; }
      out.push(text.slice(i, j + 2));
      i = j + 2;
    } else if (c === "<") {
      // Single hex string <...>.
      const j = text.indexOf(">", i + 1);
      if (j === -1) { i++; continue; }
      out.push(text.slice(i, j + 1));
      i = j + 1;
    } else if (c === "[") {
      // Kerning array — scan with balanced strings inside.
      let j = i + 1;
      while (j < n) {
        const ch = text[j];
        if (ch === "\\") { j += 2; continue; }
        if (ch === "(") {
          let depth = 1;
          j++;
          while (j < n && depth > 0) {
            if (text[j] === "\\") j += 2;
            else if (text[j] === "(") depth++;
            else if (text[j] === ")") depth--;
            j++;
          }
          continue;
        }
        if (ch === "]") break;
        j++;
      }
      out.push(text.slice(i, Math.min(j + 1, n)));
      i = j + 1;
    } else if (/\s/.test(c)) {
      i++;
    } else if (/[A-Za-z0-9+\-./]/.test(c)) {
      let j = i;
      while (j < n && /[A-Za-z0-9+\-./]/.test(text[j])) j++;
      out.push(text.slice(i, j));
      i = j;
    } else {
      i++; // unknown punctuation: not an operator we interpret
    }
  }
  return out;
}

/** Decode a PDF literal string, honouring backslash escapes. */
function unescapePdfString(s: string): string {
  const body = s.slice(1, s.length - 1);
  let out = "";
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c !== "\\") { out += c; continue; }
    const nxt = body[++i];
    if (nxt === "n") out += "\n";
    else if (nxt === "r") out += "\r";
    else if (nxt === "t") out += "\t";
    else if (nxt === "b") out += "\b";
    else if (nxt === "f") out += "\f";
    else if (nxt === "(" || nxt === ")" || nxt === "\\") out += nxt;
    else if (nxt >= "0" && nxt <= "7") {
      let oct = nxt;
      while (oct.length < 3 && i + 1 < body.length && /[0-7]/.test(body[i + 1])) oct += body[++i];
      out += String.fromCharCode(parseInt(oct, 8));
    } else if (nxt === "\r") {
      if (body[i + 1] === "\n") i++; // \r\n line continuation
    } else if (nxt === "\n") { /* line continuation */ }
    else out += nxt;
  }
  return out;
}

/** Decode a PDF hex string <...>, incl. UTF-16BE (FEFF-prefixed) strings. */
function hexToText(s: string): string {
  const h = s.slice(1, s.length - 1).replace(/\s+/g, "");
  if (/^feff/i.test(h) && h.length >= 8) {
    const bytes: number[] = [];
    for (let i = 4; i + 1 < h.length; i += 2) bytes.push(parseInt(h.slice(i, i + 2), 16));
    if (bytes.length) {
      return Buffer.from(bytes).swap16().toString("utf16le").replace(/\0/g, "");
    }
  }
  let out = "";
  for (let i = 0; i + 1 < h.length; i += 2) {
    const code = parseInt(h.slice(i, i + 2), 16);
    if (Number.isFinite(code) && code > 0) out += String.fromCharCode(code);
  }
  return out;
}

/** Split a TJ kerning array into its string / number elements. */
function splitTJArray(s: string): string[] {
  const re = /\((?:\\.|[^\\()])*\)|<[0-9A-Fa-f\s]*>|-?\d+(?:\.\d+)?/g;
  return [...s.matchAll(re)].map((m) => m[0]);
}

/** Byte-preserving latin1 (see decodeTextBytes for why not TextDecoder). */
function bufString(src: Uint8Array): string {
  return Buffer.from(src).toString("latin1");
}

// ---------------------------------------------------------------------------
// ePubs (adm-zip)
// ---------------------------------------------------------------------------

interface ZipHandle {
  entries: string[];
  readText: (name: string) => string | null;
}

/** Open a zip buffer with adm-zip; entry lookups are case-insensitive. */
function openZip(buf: Buffer): ZipHandle {
  // adm-zip is CommonJS; require keeps the smoke-tested import path stable
  // under tsx. 0.6.0 ships its own types, so no @types package is needed.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const AdmZip = require("adm-zip") as new (b: Buffer) => {
    getEntries(): Array<{ entryName: string }>;
    readAsText(entry: string | { entryName: string }): string;
  };
  const zip = new AdmZip(buf);
  const names = zip.getEntries().map((e) => e.entryName);
  const norm = (name: string): string | null => {
    const want = name.replace(/^\.\//, "").toLowerCase();
    const direct = names.find((n) => n.toLowerCase() === want);
    if (direct) return direct;
    const base = want.split("/").pop() ?? want;
    return names.find((n) => n.toLowerCase().split("/").pop() === base) ?? null;
  };
  return {
    entries: names,
    readText: (name) => {
      const found = norm(name);
      if (!found) return null;
      try {
        return zip.readAsText(found) ?? null;
      } catch {
        return null; // binary / non-text entries are skipped
      }
    },
  };
}

// ---------------------------------------------------------------------------
// HTML → text
// ---------------------------------------------------------------------------

/** Strip tags + decode entities from XHTML/HTML. */
export function htmlToText(html: string): string {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/p[^>]*>/gi, "\n\n");
  s = s.replace(/<\/(div|section|article|h[1-6]|li|tr|blockquote)[^>]*>/gi, "\n");
  s = s.replace(/\s+<[^>]+>\s+/g, " ");
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/[  ]/g, " ");
  s = s.replace(/&nbsp;/gi, " ");
  s = s.replace(/&amp;/gi, "&");
  s = s.replace(/&lt;/gi, "<");
  s = s.replace(/&gt;/gi, ">");
  s = s.replace(/&quot;/gi, '"');
  s = s.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
  s = s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  s = s.replace(/\r\n?/g, "\n");
  return s
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

// ---------------------------------------------------------------------------
// Post-extraction text processing
// ---------------------------------------------------------------------------

/**
 * Strip page furniture: running headers/footers, page numbers, TOC dotted
 * leaders, Gutenberg headers, isolated bullets, and hyphenated line-breaks.
 * Conservative by design — it never touches quoted dialogue.
 */
export function stripPageFurniture(text: string): string {
  let t = text.replace(/[ \t]+/g, " ").replace(/\f/g, "\n").replace(/\n{3,}/g, "\n\n");
  // De-hyphenate mid-word line breaks ("some-\nthing" → "something") — but
  // never em-dashes or dialogue.
  t = t.replace(/([a-z])-\n([a-z])/g, "$1$2");

  const lines = t.split("\n").map((l) => l.trim());
  const counts = new Map<string, number>();
  for (const l of lines) if (l) counts.set(l, (counts.get(l) ?? 0) + 1);

  const out: string[] = [];
  for (const line of lines) {
    if (!line) { out.push(""); continue; }
    const stripped = line.replace(/^[▪•·‣◦\s]+/, "").trim();
    if (!stripped) continue;
    // Page numbers: "12", "p. 12", "12 of 340", "12/340", "- 12 -", "· 12 ·"
    if (/^(?:p(?:age)?\.?\s*)?\d{1,4}(?:\s*(?:of|\/)\s*\d{1,4})?$/i.test(stripped)) continue;
    // Gutenberg headers/footers.
    if (/^(?:\*{3}.*GUTENBERG.*\*{3}|END OF THE PROJECT GUTENBERG|START OF THE PROJECT GUTENBERG)/i.test(stripped)) continue;
    // TOC dotted leaders: "Chapter 3 .......... 45"
    if (/^.{2,80}?\.{3,}\s*\d+$/.test(stripped)) continue;
    // Running heads: short, no sentence punctuation, no quotes, 4+ repeats.
    if (
      (counts.get(line) ?? 0) >= 4 &&
      stripped.length < 80 &&
      !/[“"«]/.test(stripped) &&
      !/[.!?]$/.test(stripped)
    ) continue;
    out.push(line);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export interface DialogueTurn {
  text: string;
  /** "clinician" | "client" | "unknown" — from explicit speaker labels only. */
  role: "clinician" | "client" | "unknown";
}

/**
 * Quote-aware dialogue splitter. Recognises, in order:
 *   - "Speaker: text" / "Speaker. text" (transcripts; role from the label)
 *   - "(Speaker) text" (APA-style transcripts)
 *   - quoted lines — the quote body becomes a turn (fiction/plays)
 *   - "C: text" / "P: text" style timestamped transcripts
 * Returns one entry per spoken turn, quote content only.
 */
export function detectDialogue(text: string): DialogueTurn[] {
  const out: DialogueTurn[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const clean = line.replace(/^\d+[.)]\s*/, ""); // turn numbers

    // "Speaker: ..." or "Speaker. ..." (2+ chars, no sentence bleeding)
    const labeled = /^([A-Za-z][A-Za-z' -]{1,40})\s*[:.]\s+(.+)$/.exec(clean);
    if (labeled && !/^(the|a|an)\b/i.test(labeled[1])) {
      out.push({ text: labeled[2].trim(), role: speakerRole(labeled[1]) });
      continue;
    }
    // "(Client) ..."
    const paren = /^\(([^)]{1,40})\)\s*(.+)$/.exec(clean);
    if (paren) {
      out.push({ text: paren[2].trim(), role: speakerRole(paren[1]) });
      continue;
    }
    // Quote-aware: quoted lines become turns (fiction / plays).
    if (/[“"]/.test(line)) {
      const inner = line.replace(/^[“"]|[”"]$/g, "").trim();
      if (inner.length >= 2) out.push({ text: inner, role: "unknown" });
      continue;
    }
    // "C: ..." / "P: ..." timestamped transcripts.
    const code = /^([CPTDIFU]{1,3})\s*[:.]\s+(.+)$/i.exec(clean);
    if (code) {
      out.push({ text: code[2].trim(), role: speakerRole(code[1]) });
    }
  }
  return out;
}

function speakerRole(speaker: string): "clinician" | "client" | "unknown" {
  const s = speaker.toLowerCase().replace(/[^a-z]/g, "");
  if (/^(c|cl|clin|clinician|t|th|therapist|d|dr|doc|i|interviewer|facilitator)$/.test(s)) return "clinician";
  if (/^(p|pt|patient|client|student|counsellee|member|respondent|interviewee|s)$/.test(s)) return "client";
  return "unknown";
}

export interface Chunk {
  text: string;
  start: number;
  end: number;
}

/**
 * Semantic chunking: splits on speaker-turn / paragraph boundaries first
 * (dialogue stays intact), then falls back to sentence boundaries for long
 * runs. Chunks never exceed maxLen (oversized turns are split at the nearest
 * sentence end ≥50% through).
 */
export function chunkSemantic(text: string, maxLen = 1800): Chunk[] {
  if (maxLen < 40) maxLen = 40;
  const units = splitUnits(text);
  const chunks: Chunk[] = [];
  let cur = "";
  let curStart = 0;
  const push = () => {
    if (cur.trim()) {
      chunks.push({ text: cur.trim(), start: curStart, end: curStart + cur.length });
    }
  };
  for (const [unitText, unitStart] of units) {
    if (cur && cur.length + unitText.length + 2 > maxLen) {
      push();
      cur = "";
      curStart = unitStart;
    }
    if (unitText.length > maxLen) {
      push();
      for (const piece of splitLong(unitText, maxLen)) {
        chunks.push({ text: piece.trim(), start: unitStart, end: unitStart + piece.length });
      }
      cur = "";
      curStart = unitStart + unitText.length;
    } else {
      cur += (cur ? "\n\n" : "") + unitText;
    }
  }
  push();
  return chunks;
}

/**
 * Unit boundaries: blank-line paragraphs, plus lines that begin a new
 * speaker turn ("Speaker: ...", "(Client) ...", "P: ..."). A turn that spans
 * several lines stays one unit — dialogue is never split mid-turn by this.
 */
function splitUnits(text: string): Array<[string, number]> {
  const re = /\n\n+|(?=\n(?:[A-Za-z][A-Za-z' -]{1,40}|\([^)]{1,40}\)|[A-Z]{1,3})\s*[:.])/g;
  const out: Array<[string, number]> = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const seg = text.slice(last, m.index).trim();
    if (seg) out.push([seg, last]);
    last = m.index;
  }
  const tail = text.slice(last).trim();
  if (tail) out.push([tail, last]);
  return out;
}

/** Split an oversized unit at the nearest sentence boundary ≥50% through. */
function splitLong(text: string, maxLen: number): string[] {
  const pieces: string[] = [];
  let rest = text;
  while (rest.length > maxLen) {
    const slice = rest.slice(0, maxLen);
    const cut = Math.max(
      slice.lastIndexOf(". "),
      slice.lastIndexOf("! "),
      slice.lastIndexOf("? "),
      slice.lastIndexOf("\n"),
    );
    const at = cut >= maxLen * 0.5 ? cut + 2 : maxLen;
    pieces.push(rest.slice(0, at).trim());
    rest = rest.slice(at).trim();
  }
  if (rest) pieces.push(rest);
  return pieces.filter(Boolean);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function programOnPath(prog: string): boolean {
  const r = spawnSync(prog, ["-v"], { stdio: "ignore" });
  return !r.error;
}
