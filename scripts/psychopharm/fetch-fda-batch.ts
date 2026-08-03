#!/usr/bin/env tsx
/**
 * Batch FDA label fetch for drugs lacking curated bands. Sequential with a
 * ~1.5s delay to respect DailyMed rate limits. Idempotent — skips drugs whose
 * label file already exists.
 *
 *   npm run psych:fda-batch
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "scripts/psychopharm/fda");
mkdirSync(OUT, { recursive: true });
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

const DRUGS = [
  "fluvoxamine","desvenlafaxine","amitriptyline","nortriptyline","imipramine",
  "clomipramine","agomelatine","vortioxetine","diazepam","nitrazepam","temazepam",
  "buspirone","etizolam","clozapine","paliperidone","fluphenazine","trifluoperazine",
  "chlorpromazine","pimozide","oxcarbazepine","levetiracetam","atomoxetine","modafinil",
  "zolpidem","zopiclone","eszopiclone","melatonin","phenelzine","tranylcypromine",
  "moclobemide","naltrexone","acamprosate","disulfiram","donepezil","rivastigmine",
  "memantine","levodopa","propranolol","prazosin","cyproheptadine",
];

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

for (const drug of DRUGS) {
  const file = join(OUT, `${slug(drug)}.txt`);
  if (existsSync(file)) {
    console.log(`skip ${drug} (cached)`);
    continue;
  }
  try {
    const r = spawnSync("npx", ["tsx", "scripts/psychopharm/fetch-fda.ts", `--drug=${drug}`], {
      encoding: "utf8",
      timeout: 60000,
    });
    console.log(`${r.stdout?.trim() || r.stderr?.trim() || drug}`);
  } catch (e) {
    console.log(`${drug}: fetch error`);
  }
  // rate-limit: be polite to DailyMed
  const { execFileSync: sleep } = require("node:child_process");
  try { execFileSync("sleep", ["2"]); } catch { /* ignore */ }
}
console.log("BATCH DONE");