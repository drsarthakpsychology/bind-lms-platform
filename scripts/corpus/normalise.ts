#!/usr/bin/env tsx
/**
 * Normalise raw corpus sources → canonical JSON documents.
 * Reads scripts/corpus/raw/** and writes scripts/corpus/normalised/*.json
 * with a consistent shape + provenance (source, url, licence, hash).
 *
 *   npm run corpus:normalise
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

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

function main() {
  const docs: NormalisedDoc[] = [];
  const pmcDir = join(RAW, "pmc");
  if (readdirSync(RAW, { withFileTypes: true }).some((d) => d.name === "pmc")) {
    for (const f of readdirSync(pmcDir).filter((f) => f.endsWith(".xml"))) {
      const xml = readFileSync(join(pmcDir, f), "utf8");
      const { title, body } = parsePMC(xml);
      if (body.length < 300) continue; // reject low-signal
      const hash = createHash("sha256").update(body).digest("hex").slice(0, 16);
      docs.push({
        source: "pmc",
        source_url: `https://www.ncbi.nlm.nih.gov/pmc/articles/${f.replace(/\.xml$/, "")}/`,
        licence: "oa",
        title,
        content: body,
        hash,
        fetched_at: new Date().toISOString().slice(0, 10),
      });
    }
  }
  writeFileSync(join(OUT, "pmc.json"), JSON.stringify(docs, null, 2), "utf8");
  console.log(`normalised ${docs.length} PMC docs → ${join(OUT, "pmc.json")}`);
}

main();
