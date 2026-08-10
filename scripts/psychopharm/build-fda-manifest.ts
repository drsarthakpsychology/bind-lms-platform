#!/usr/bin/env tsx
/**
 * Build the drug → setid manifest for full-label FDA fetching.
 *
 * For each psychopharm drug not already covered by an existing label, query the
 * DailyMed v2 SPL API and pick ONE good label:
 *   1. Prefer a branded/innovator label (holder is a known innovator or the
 *      title carries a brand).
 *   2. Else prefer the highest spl_version among tablet/capsule/oral forms.
 *   3. Else the most recently published.
 *
 * The DailyMed v2 API is public and JSON; this is metadata discovery only.
 * The label HTML itself is fetched by the web-scraper MCP (web_fetch).
 *
 * Writes: scripts/psychopharm/fda/_manifest.json
 *   { "<Drug Name>": { setid, title, holder, published_date, spl_version } }
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const FDA_DIR = join(process.cwd(), "scripts/psychopharm/fda");

/** Known innovator/branded holders we'd rather cite. */
const INNOVATORS = [
  "PHARMACIA", "PFIZER", "GLAXOSMITHKLINE", "SANOFI", "JANSSEN", "LILLY",
  "NOVARTIS", "ROCHE", "ABBVIE", "ALLERGAN", "TAKEDA", "LUNDBECK",
  "ASTRAZENECA", "SUMITOMO", "ALKERMES", "INDIVIOR", "BRISTOL", "OTSUKA",
  "AKORNI", "AXSOME", "TONIX", "SAGE", "BIOGEN", "VERTEX", "VIATRIS",
  "UPSHER", "MYLAN", "TEVA", "SANDOZ", "LUPIN", "SUN PHARMA", "TORRENT",
  "ZYDUS", "DR. REDDY", "AUROBINDO", "ACTAVIS", "AMNEAL", "APOTEX",
];

/** Repackagers / repackers — never cite these (content is a copy). */
const REPACK = /REPACK|PD-RX|MEDICATION SOLUTIONS|NUCARE|DIRECT_RX|BRYANT RANCH|AMERICAN HEALTH|AVPAK|PROFICIENT|UNIT DOSE|REDPHARM|GOLDEN STATE|NORTHWIND|PREFERRED PHARMACEUTICALS|CARDINAL HEALTH|AS HEALTHCARE|ADVANCED RX|QUALITY CARE|ATLANTIC BIOLOGICAL|VANGARD|MEDSOURCE|CALVIN SCOTT|CLINICAL SOLUTIONS|ST\. MARY'S|APHENA|LAKE ERIE|MEDSOURCE/i;

interface Spl {
  spl_version: number;
  published_date: string;
  title: string;
  setid: string;
}

function score(s: Spl): number {
  const title = s.title.toUpperCase();
  const holder = title.split(/[\[(]/).pop() ?? "";
  let score = 0;
  if (REPACK.test(s.title)) score -= 1000;
  if (INNOVATORS.some((i) => holder.includes(i))) score += 500;
  if (/TABLET|CAPSULE|ORAL|SOLUTION|CONCENTRATE|KIT/.test(s.title)) score += 20;
  if (/EXTENDED RELEASE|SR\b|XR\b|ER\b/.test(s.title)) score += 2;
  if (/SUBLINGUAL|INJECTION|POWDER|INHALATION/.test(s.title)) score -= 50;
  score += Math.min(s.spl_version, 100);
  return score;
}

function pick(spls: Spl[]): Spl | undefined {
  if (!spls.length) return undefined;
  return spls.slice().sort((a, b) => score(b) - score(a))[0];
}

async function main() {
  const kb = JSON.parse(readFileSync(join(process.cwd(), "docs/psychopharm/KNOWLEDGE_BASE.json"), "utf8"));
  const allDrugs = [...new Set((kb as Array<{ drug: unknown }>).map((r) => String(r.drug)))].sort();

  // Existing labels (txt or json) already give us a setid.
  const covered = new Set<string>();
  const manifest: Record<string, { setid: string; title: string; published_date: string; spl_version: number }> = {};
  if (existsSync(join(FDA_DIR, "_manifest.json"))) {
    Object.assign(manifest, JSON.parse(readFileSync(join(FDA_DIR, "_manifest.json"), "utf8")));
  }
  for (const f of readFileSync(join(FDA_DIR, "_index.txt"), "utf8").split("\n").filter(Boolean)) {
    const base = f.replace(/\.json$/, "");
    const slug = base.replace(/-/g, " ");
    const drug = allDrugs.find((d) => d.toLowerCase() === slug.toLowerCase());
    if (drug) covered.add(drug);
  }

  const need = allDrugs.filter((d) => !covered.has(d));
  console.log(`drugs needing discovery: ${need.length}`);

  let found = 0;
  let notFound = 0;
  for (const drug of need) {
    const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(drug)}`;
    let spls: Spl[] = [];
    try {
      const res = await fetch(url);
      const j = (await res.json()) as { data?: Spl[] };
      spls = j.data ?? [];
    } catch (e) {
      console.error(`  ! ${drug}: fetch error ${(e as Error).message}`);
      notFound++;
      continue;
    }
    const best = pick(spls);
    if (best) {
      manifest[drug] = { setid: best.setid, title: best.title, published_date: best.published_date, spl_version: best.spl_version };
      found++;
    } else {
      notFound++;
    }
    await new Promise((r) => setTimeout(r, 350)); // be polite to the API
  }

  writeFileSync(join(FDA_DIR, "_manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(`done — ${found} found, ${notFound} not found → ${FDA_DIR}/_manifest.json`);
}

main();
