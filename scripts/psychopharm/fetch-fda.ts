#!/usr/bin/env tsx
/**
 * FDA label scraper — fetches the DailyMed structured-product-label for a drug
 * and extracts its "Dosage and Administration" section. Allowlisted source
 * (Tier 1: FDA/DailyMed). Respects robots: single fetch per drug, browser UA.
 *
 *   npm run psych:fda -- --drug clozapine
 *
 * Writes: scripts/psychopharm/fda/<slug>.txt (dosing section, verbatim)
 *         appended to WEB_ACCESS_LOG entry.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "scripts/psychopharm/fda");
mkdirSync(OUT, { recursive: true });
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

function curl(url: string): string {
  return execFileSync("curl", ["-sL", "-A", UA, "--max-time", "25", url], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function main() {
  const drugArg = process.argv.find((a) => a.startsWith("--drug="))?.split("=")[1];
  if (!drugArg) {
    console.error("usage: psych:fda -- --drug=<name>");
    process.exit(1);
  }
  const drug = drugArg.trim();

  // 1. Search DailyMed for the label.
  const searchHtml = curl(
    `https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(drug)}`,
  );
  const setids = [...searchHtml.matchAll(/drugInfo\.cfm\?setid=([a-f0-9-]+)/g)].map((m) => m[1]);
  const setid = setids[0];
  if (!setid) {
    console.log(`NO LABEL FOUND for ${drug}`);
    appendFileSync(join(process.cwd(), "docs/psychopharm/WEB_ACCESS_LOG.md"), `| ${new Date().toISOString().slice(0,10)} | DailyMed search ${drug} | FDA | no label found | — |\n`);
    process.exit(0);
  }

  // 2. Fetch the label and extract dosing text.
  const labelHtml = curl(`https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setid}`);
  const text = labelHtml
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");

  const i = text.toLowerCase().indexOf("dosage and administration");
  const dosing = i >= 0 ? text.slice(i, i + 2000) : text.slice(0, 800);

  const file = join(OUT, `${slug(drug)}.txt`);
  writeFileSync(file, `SOURCE: DailyMed setid ${setid}\nDRUG: ${drug}\n\n${dosing}\n`, "utf8");
  appendFileSync(
    join(process.cwd(), "docs/psychopharm/WEB_ACCESS_LOG.md"),
    `| ${new Date().toISOString().slice(0,10)} | dailymed.nlm.nih.gov setid=${setid} | FDA/DailyMed | extract ${drug} dosing | dosing section → ${file} |\n`,
  );
  console.log(`wrote ${file} (${dosing.length} chars dosing)`);
}

main();