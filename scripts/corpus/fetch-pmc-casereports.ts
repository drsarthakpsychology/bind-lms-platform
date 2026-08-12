#!/usr/bin/env tsx
/**
 * Fetch psychiatric case reports — robust version over NCBI eutils + Europe
 * PMC full-text XML (the endpoint the existing fetch-pmc.ts uses).
 *
 * Two filters make the yield usable for the casebook:
 *   1. KIND:"Case Reports" AND psychiatry-family keywords (Europe PMC) — a
 *      broad net; the extractor later filters to articles with a real
 *      "Case report"/"Case presentation" section.
 *   2. TITLE-restricted queries (psychiatry keywords in the title) — fewer,
 *      but on-topic.
 *
 * Cache: scripts/corpus/raw/pmc/ (same dir as fetch-pmc.ts; seeded from disk).
 *
 *   npm run corpus:pmc-casereports
 */
import { mkdirSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/pmc");
mkdirSync(RAW, { recursive: true });

const UA = "LumenPracticeLayerBot/1.0 (corpus; contact: dev@lumen.example)";
const MIN_MS = 350;

const QUERIES = [
  'KIND:"Case Reports" AND (psychiatry OR psychiatric OR depression OR anxiety OR psychosis OR schizophrenia OR bipolar OR PTSD OR suicide OR OCD)',
  'KIND:"Case Reports" AND (substance OR alcohol OR opioid OR cannabis OR "eating disorder" OR personality OR dementia OR delirium OR "conversion disorder" OR dissociative OR autism OR ADHD)',
  'KIND:"Case Reports" AND (psychotherapy OR counselling OR counseling OR "mental health" OR panic OR mania OR delusion OR hallucination OR self-harm OR trauma)',
  'TITLE:(psychiatry OR psychiatric OR depression OR psychosis OR schizophrenia OR bipolar OR anxiety OR panic OR PTSD OR OCD OR suicidal OR suicide OR self-harm)',
  'TITLE:(substance OR alcohol OR opioid OR cannabis OR "eating disorder" OR anorexia OR bulimia OR dementia OR delirium OR "case report") AND (psychiatr* OR depress* OR psychos* OR schizo* OR bipolar OR anxiety OR suicid* OR mental)',
];

async function search(query: string, page = 1): Promise<Array<{ id: string; source: string; title: string }>> {
  const q = `(${query}) AND (OPEN_ACCESS:y) AND (SRC:PMC)`;
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(q)}&format=json&pageSize=25&page=${page}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = (await res.json()) as { resultList?: { result?: Array<{ id: string; source: string; title: string }> } };
  return j.resultList?.result ?? [];
}

async function fetchFullText(id: string): Promise<string> {
  const bare = id.replace(/^PMC/, "");
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/PMC${bare}/fullTextXML`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const limit = Number(process.env.PMC_CASE_LIMIT ?? "240");
  const seen = new Set<string>();
  for (const f of readdirSync(RAW).filter((f) => f.endsWith(".xml"))) {
    seen.add(`PMC-${f.replace(/\.xml$/, "")}`);
  }
  let fetched = 0;
  for (const q of QUERIES) {
    for (let page = 1; page <= 4; page++) {
      let ids: Array<{ id: string; source: string; title: string }> = [];
      try {
        ids = await search(q, page);
      } catch (e) {
        console.error(`FAIL search p${page}: ${(e as Error).message}`);
        continue;
      }
      if (!ids.length) break;
      for (const r of ids) {
        if (r.source !== "PMC") continue;
        const key = `PMC-${r.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const file = join(RAW, `${r.id}.xml`);
        if (existsSync(file)) continue;
        try {
          const xml = await fetchFullText(r.id);
          if (xml.trim().length < 800) {
            console.error(`FAIL ${key}: too short (${xml.length})`);
            continue;
          }
          writeFileSync(file, xml, "utf8");
          fetched++;
          console.log(`ok ${key} "${r.title.slice(0, 60)}"`);
        } catch (e) {
          console.error(`FAIL ${key}: ${(e as Error).message}`);
        }
        await sleep(MIN_MS);
        if (fetched >= limit) {
          console.log(`reached ${limit} new downloads this run — re-run to fetch more.`);
          console.log(`done — ${fetched} fetched (${seen.size} unique ids seen)`);
          return;
        }
      }
      await sleep(MIN_MS);
    }
  }
  console.log(`done — ${fetched} fetched this run (${seen.size} unique ids seen)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
