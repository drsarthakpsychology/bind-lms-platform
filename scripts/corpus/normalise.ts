#!/usr/bin/env tsx
/**
 * Normalise raw corpus sources → canonical JSON documents.
 * Reads scripts/corpus/raw/** and writes scripts/corpus/normalised/*.json
 * with a consistent shape + provenance (source, url, licence, hash).
 *
 *   npm run corpus:normalise
 *
 * Sources handled:
 *   - pmc/          JATS XML case reports (published open-access articles)
 *   - mhgap/        WHO mhGAP Intervention Guide 2.0 (PDF)
 *   - nmhs/         National Mental Health Survey of India main report (PDF)
 *   - statutes/     Government of India legislation: MHA 2017, RCI 1992,
 *                   POCSO 2012 when present (PDFs, full-text)
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { extractFromPdf, stripPageFurniture } from "./lib/extract";

const RAW = join(process.cwd(), "scripts/corpus/raw");
const OUT = join(process.cwd(), "scripts/corpus/normalised");
mkdirSync(OUT, { recursive: true });

interface NormalisedDoc {
  source: string;
  source_url: string;
  licence: string;
  title: string;
  content: string;
  hash: string;
  fetched_at: string;
}

const TODAY = new Date().toISOString().slice(0, 10);

function doc(source: string, source_url: string, licence: string, title: string, content: string): NormalisedDoc {
  const hash = createHash("sha256").update(content).digest("hex").slice(0, 16);
  return { source, source_url, licence, title, content, hash, fetched_at: TODAY };
}

/** Extract article title + body text from JATS XML (PMC). */
function parsePMC(xml: string): { title: string; body: string } {
  const title = /<article-title[^>]*>([\s\S]*?)<\/article-title>/.exec(xml)?.[1]
    ?.replace(/<[^>]+>/g, "")
    .trim() ?? "untitled";
  // Body: gather all <p> paragraphs.
  const ps = [...xml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  ).filter((p) => p.length > 60);
  return { title, body: ps.join("\n\n") };
}

/**
 * Normalise one reference PDF into a single canonical doc. Rejects low-signal
 * extractions (<2KB after furniture stripping) — a PDF that yields nothing is
 * reported, not silently dropped. Keeps pdftotext page order intact.
 */
function normalisePdf(
  file: string,
  source: string,
  source_url: string,
  licence: string,
  title: string,
): NormalisedDoc | null {
  if (!existsSync(file)) {
    console.warn(`  skip ${source}: not present (${file})`);
    return null;
  }
  const buf = readFileSync(file);
  const extracted = extractFromPdf(buf);
  const content = stripPageFurniture(extracted.text);
  if (content.length < 2_000) {
    console.warn(`  skip ${source}: low-signal extraction (${content.length} chars, method=${extracted.method})`);
    return null;
  }
  console.log(`  ${source}: ${content.length.toLocaleString()} chars (${extracted.method})`);
  return doc(source, source_url, licence, title, content);
}

function normalisePMC(docs: NormalisedDoc[]) {
  const pmcDir = join(RAW, "pmc");
  if (!readdirSync(RAW, { withFileTypes: true }).some((d) => d.name === "pmc")) return;
  for (const f of readdirSync(pmcDir).filter((f) => f.endsWith(".xml"))) {
    const xml = readFileSync(join(pmcDir, f), "utf8");
    const { title, body } = parsePMC(xml);
    if (body.length < 300) continue; // reject low-signal
    docs.push(doc(
      "pmc",
      `https://www.ncbi.nlm.nih.gov/pmc/articles/${f.replace(/\.xml$/, "")}/`,
      "oa",
      title,
      body,
    ));
  }
}

function main() {
  const pmc: NormalisedDoc[] = [];
  normalisePMC(pmc);
  writeFileSync(join(OUT, "pmc.json"), JSON.stringify(pmc, null, 2), "utf8");
  console.log(`normalised ${pmc.length} PMC docs → ${join(OUT, "pmc.json")}`);

  // WHO mhGAP Intervention Guide 2.0 (open WHO publication).
  const mhgap = normalisePdf(
    join(RAW, "mhgap/mhgap-ig-2.0-eng.pdf"),
    "mhgap",
    "https://iris.who.int/handle/10665/250239",
    "cc-by-nc-sa-3.0-igo",
    "mhGAP Intervention Guide for mental, neurological and substance use disorders in non-specialized health settings (2.0) — WHO",
  );
  if (mhgap) {
    writeFileSync(join(OUT, "mhgap.json"), JSON.stringify([mhgap], null, 2), "utf8");
    console.log(`  → ${join(OUT, "mhgap.json")}`);
  }

  // NIMHANS National Mental Health Survey of India (2015-16) main report.
  const nmhs = normalisePdf(
    join(RAW, "nmhs/nmhs-main-report.pdf"),
    "nmhs",
    "https://www.nimhans.ac.in/",
    "public_gov",
    "National Mental Health Survey of India, 2015-16: Prevalence, patterns and outcomes — NIMHANS",
  );
  if (nmhs) {
    writeFileSync(join(OUT, "nmhs.json"), JSON.stringify([nmhs], null, 2), "utf8");
    console.log(`  → ${join(OUT, "nmhs.json")}`);
  }

  // Government of India legislation cited by the ethics layer. Each act is one
  // canonical doc; POCSO is skipped when its PDF has not been downloaded yet.
  const statutes: NormalisedDoc[] = [];
  const mha = normalisePdf(
    join(RAW, "statutes/mha2017.pdf"),
    "mha2017",
    "https://www.indiacode.nic.in/",
    "public_gov",
    "Mental Healthcare Act, 2017 (Act 10 of 2017) — Government of India",
  );
  const rci = normalisePdf(
    join(RAW, "statutes/rci1992.pdf"),
    "rci1992",
    "https://www.indiacode.nic.in/",
    "public_gov",
    "Rehabilitation Council of India Act, 1992 (Act 34 of 1992) — Government of India",
  );
  const pocso = normalisePdf(
    join(RAW, "statutes/pocso2012.pdf"),
    "pocso2012",
    "https://www.indiacode.nic.in/",
    "public_gov",
    "Protection of Children from Sexual Offences Act, 2012 (Act 32 of 2012) — Government of India",
  );
  for (const s of [mha, rci, pocso]) if (s) statutes.push(s);
  writeFileSync(join(OUT, "statutes.json"), JSON.stringify(statutes, null, 2), "utf8");
  console.log(`normalised ${statutes.length} statute docs → ${join(OUT, "statutes.json")}`);
}

main();
