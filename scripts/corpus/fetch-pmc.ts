#!/usr/bin/env tsx
/**
 * Fetch open-access psychiatric case reports — via Europe PMC (robust REST,
 * returns full-text XML directly, no ftp mirror needed).
 *
 * Europe PMC REST API:
 *   search:   https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=...&format=json
 *   fullText: https://www.ebi.ac.uk/europepmc/webservices/rest/{source}/{id}/fullTextXML
 *
 * Only articles with inPMC==Y and isOpenAccess==Y have full text. We filter
 * the search to those. Explicitly licensed OA content.
 *
 *   npm run corpus:pmc
 */
import { mkdirSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/pmc");
mkdirSync(RAW, { recursive: true });

const UA = "LumenPracticeLayerBot/1.0 (corpus; contact: dev@lumen.example)";

const QUERIES = [
  'KIND:"Case Reports" AND (psychiatry OR psychiatric OR "mental health")',
  'KIND:"Case Reports" AND (depression OR depressive)',
  'KIND:"Case Reports" AND (anxiety OR panic)',
  'KIND:"Case Reports" AND (schizophrenia OR psychosis)',
  'KIND:"Case Reports" AND (bipolar)',
  'KIND:"Case Reports" AND (PTSD OR "post-traumatic")',
  'KIND:"Case Reports" AND (OCD OR obsessive)',
  'KIND:"Case Reports" AND ("alcohol use disorder" OR alcoholism)',
  'KIND:"Case Reports" AND ("postpartum depression")',
  'KIND:"Case Reports" AND (geriatric psychiatry)',
];

async function search(query: string): Promise<Array<{ id: string; source: string; title: string }>> {
  const q = `(${query}) AND (OPEN_ACCESS:y) AND (SRC:PMC)`;
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(q)}&format=json&pageSize=25`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = (await res.json()) as { resultList?: { result?: Array<{ id: string; source: string; title: string }> } };
  return j.resultList?.result ?? [];
}

async function fetchFullText(id: string, source: string): Promise<string> {
  // The fullTextXML endpoint takes the bare id (e.g. "PMC11932177" →
  // /rest/PMC11932177/fullTextXML). Only PMC source has full text.
  const bare = source === "PMC" ? `PMC${id.replace(/^PMC/, "")}` : id;
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/${bare}/fullTextXML`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function main() {
  const seen = new Set<string>();
  let fetched = 0;
  for (const q of QUERIES) {
    let ids: Array<{ id: string; source: string; title: string }> = [];
    try {
      ids = await search(q);
    } catch (e) {
      console.error(`✗ search ${q}: ${(e as Error).message}`);
      continue;
    }
    console.log(`query "${q}" → ${ids.length} OA full-text results`);
    for (const r of ids) {
      if (r.source !== "PMC") continue; // only PMC has fullTextXML
      const key = `${r.source}-${r.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const file = join(RAW, `${r.id}.xml`);
      if (existsSync(file)) continue;
      try {
        const xml = await fetchFullText(r.id, r.source);
        if (xml.trim().length < 800) {
          console.error(`✗ ${key}: too short (${xml.length})`);
          continue;
        }
        writeFileSync(file, xml, "utf8");
        appendFileSync(
          join(process.cwd(), "docs/psychopharm/WEB_ACCESS_LOG.md"),
          `| ${new Date().toISOString().slice(0, 10)} | europepmc.org ${r.source}/${r.id} | Europe PMC OA | fetch case report "${r.title.slice(0, 60)}" | ${file} |\n`,
        );
        fetched++;
      } catch (e) {
        console.error(`✗ ${key}: ${(e as Error).message}`);
      }
      await new Promise((res) => setTimeout(res, 350));
      if (fetched >= 60) {
        console.log(`reached 60 downloads this run; re-run to fetch more.`);
        return;
      }
    }
  }
  console.log(`done — ${fetched} fetched this run (${seen.size} unique ids seen)`);
}

main();
