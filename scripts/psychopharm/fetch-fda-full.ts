#!/usr/bin/env tsx
/**
 * Full-label FDA extractor — P0 upgrade.
 *
 * Reads a fetched DailyMed label HTML (or fetches it via the web-scraper MCP
 * output convention) and splits the ENTIRE label into its numbered sections,
 * instead of the old 2,000-char "Dosage and Administration" slice.
 *
 * USAGE
 *   npm run psych:fda-full -- --html scripts/psychopharm/fda/bupropion.html
 *     --drug bupropion --setid cbc8c074-f080-4489-a5ae-207b5fadeba3
 *
 * WRITES
 *   scripts/psychopharm/fda/<slug>.json — { meta, sections: { key: text } }
 *   Appends one WEB_ACCESS_LOG entry per label parsed.
 *
 * Section keys (FDA label order):
 *   boxed_warning, indications_usage, dosage_admin, dosage_forms_strengths,
 *   contraindications, warnings_precautions, drug_interactions, adverse_reactions,
 *   abuse_dependence, overdosage, description, clinical_pharmacology,
 *   nonclinical_toxicology, specific_populations, patient_counseling
 *
 * Quote-first: every section's text is verbatim from the label; the source is
 * the FDA label itself (source_id fda_label, provenance = setid + URL).
 */
import { mkdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "scripts/psychopharm/fda");
mkdirSync(OUT, { recursive: true });

/**
 * Numbered section boundaries in the standard FDA label.
 *
 * Headers are matched as plain keywords (the HTML→text pass collapses
 * whitespace, so a header is never on its own line). The highlights/TOC block
 * at the top repeats the headings, so we take the LAST occurrence of each —
 * that is the body section (which follows the highlights in label order).
 */
const SECTIONS: Array<{ key: string; header: string; alt?: string[] }> = [
  { key: "boxed_warning", header: "BOXED WARNING" },
  { key: "indications_usage", header: "INDICATIONS AND USAGE" },
  { key: "dosage_admin", header: "DOSAGE AND ADMINISTRATION" },
  { key: "dosage_forms_strengths", header: "DOSAGE FORMS AND STRENGTHS" },
  { key: "contraindications", header: "CONTRAINDICATIONS" },
  // Older-format labels use "WARNINGS" alone instead of "WARNINGS AND PRECAUTIONS".
  { key: "warnings_precautions", header: "WARNINGS AND PRECAUTIONS", alt: ["WARNINGS"] },
  { key: "drug_interactions", header: "DRUG INTERACTIONS" },
  { key: "adverse_reactions", header: "ADVERSE REACTIONS" },
  { key: "abuse_dependence", header: "DRUG ABUSE AND DEPENDENCE" },
  { key: "overdosage", header: "OVERDOSAGE" },
  { key: "description", header: "DESCRIPTION" },
  { key: "clinical_pharmacology", header: "CLINICAL PHARMACOLOGY" },
  { key: "nonclinical_toxicology", header: "NONCLINICAL TOXICOLOGY" },
  { key: "specific_populations", header: "USE IN SPECIFIC POPULATIONS" },
  { key: "patient_counseling", header: "PATIENT COUNSELING INFORMATION" },
];

/** Strip tags/scripts and collapse whitespace — label HTML → readable text. */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ");
}

function extractSections(text: string): Record<string, string> {
  // Modern labels repeat every heading twice: once in the highlights/TOC block
  // near the top, once in the body. Older-format labels do not. Heuristic:
  //   - For each section, collect ALL occurrences of its header (+ alt forms).
  //   - If a section appears 2+ times, the body one is the LAST occurrence
  //     (modern format) — except WARNINGS, where "WARNINGS" is a prefix of
  //     "WARNINGS AND PRECAUTIONS", so prefer the longest header match.
  //   - If a section appears once, that single occurrence is the body (old
  //     format, or a short label).
  const matches: Array<{ key: string; idx: number; headerLen: number }> = [];
  for (const s of SECTIONS) {
    const headers = [s.header, ...(s.alt ?? [])].sort((a, b) => b.length - a.length);
    const found: Array<{ idx: number; len: number }> = [];
    for (const h of headers) {
      let from = 0;
      while (true) {
        const at = text.indexOf(h, from);
        if (at < 0) break;
        found.push({ idx: at, len: h.length });
        from = at + h.length;
      }
    }
    if (!found.length) continue;
    // For warnings, drop the short "WARNINGS" hits that sit inside a longer
    // "WARNINGS AND PRECAUTIONS" header (they overlap).
    let pick = found[found.length - 1]; // last occurrence = body in modern format
    if (s.alt && found.length > 1 && s.header.includes("PRECAUTIONS")) {
      const long = found.find((f) => f.len === s.header.length);
      if (long && long.idx >= found[found.length - 1].idx - 2) pick = long;
    }
    matches.push({ key: s.key, idx: pick.idx, headerLen: pick.len });
  }
  matches.sort((a, b) => a.idx - b.idx);

  const out: Record<string, string> = {};
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].idx;
    const end = i + 1 < matches.length ? matches[i + 1].idx : text.length;
    let body = text.slice(start, end).trim();
    // Strip the header text itself off the body.
    body = body.slice(matches[i].headerLen).trim();
    if (body.length) out[matches[i].key] = body;
  }
  return out;
}

function main() {
  const argv = process.argv;
  const get = (name: string) => argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
  const htmlPath = get("html");
  const drug = get("drug") ?? "drug";
  const setid = get("setid") ?? "unknown";
  if (!htmlPath) {
    console.error("usage: psych:fda-full -- --html=<path> --drug=<name> [--setid=<uuid>]");
    process.exit(1);
  }
  const html = readFileSync(htmlPath, "utf8");
  const text = htmlToText(html);
  const sections = extractSections(text);
  const slug = drug.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const file = join(OUT, `${slug}.json`);
  const payload = {
    meta: {
      drug,
      source: "fda_label",
      setid,
      url: setid !== "unknown" ? `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setid}` : "",
      label_chars: text.length,
      sections_present: Object.keys(sections),
      parsed_at: new Date().toISOString().slice(0, 10),
    },
    sections,
  };
  writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
  appendFileSync(
    join(process.cwd(), "docs/psychopharm/WEB_ACCESS_LOG.md"),
    `| ${new Date().toISOString().slice(0, 10)} | dailymed.nlm.nih.gov setid=${setid} | FDA/DailyMed | full-label extract ${drug} (${Object.keys(sections).length} sections, ${text.length} chars) | ${file} |\n`,
  );
  console.log(`wrote ${file}`);
  console.log(`  sections extracted (${Object.keys(sections).length}): ${Object.keys(sections).join(", ")}`);
  for (const [k, v] of Object.entries(sections)) {
    console.log(`  - ${k}: ${v.length} chars`);
  }
}

main();
