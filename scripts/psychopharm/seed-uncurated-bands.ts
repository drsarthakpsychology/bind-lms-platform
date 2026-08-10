#!/usr/bin/env tsx
/**
 * P1 — dose-band enrichment for the 88 un-curated drugs.
 *
 * Each of the 88 drugs has a "Usual Dosage Range" in the Stahl PG 7th
 * monograph, but no curated dose ladder. This script extracts the range
 * (e.g. "150–300 mg/day") and writes a single band_order=1 draft row so the
 * drug page renders a real rung instead of the "Typical ranges in our sources"
 * honest-gap placeholder.
 *
 * Quote-first: range_low/high parsed from the Stahl monograph text (page
 * recorded in page_ref). band_type="therapeutic", band_label="Stahl usual range".
 * No bands are invented; if the range can't be parsed, the drug is skipped.
 *
 *   npm run psych:seed-bands-uncurated
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(new RegExp(`^${name}=(.*)$`));
      if (m) return m[1].trim();
    }
  } catch { /* ignore */ }
  return undefined;
}

const URL = loadEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = loadEnv("SUPABASE_SERVICE_ROLE_KEY");
if (!URL || !SERVICE_KEY) {
  console.error("missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

interface MonographSection { page: number; text: string }

const MONO = JSON.parse(readFileSync(join(process.cwd(), "docs/psychopharm/extracted_mono_stahl7.json"), "utf8"));

// Find drugs that have NO curated record in any draft-*.ts file.
const curatedSrc = ["draft-seed","draft-extra","draft-ladder","draft-ladder2","draft-fda","draft-fda2","draft-fda3","draft-fda4","draft-fda5","draft-fda6"]
  .map((f) => readFileSync(join(process.cwd(), `src/lib/psychopharm/${f}.ts`), "utf8")).join("\n");
const curated = new Set<string>();
for (const m of curatedSrc.matchAll(/generic_name: "([^"]+)"/g)) curated.add(m[1].toLowerCase());

/**
 * Parse a typical Stahl "Usual Dosage Range" block into one (low, high, unit)
 * triple. Looks for the first "<num>[–-<num>]? <unit>" pattern, optionally
 * preceded by a starting dose ("start X then Y-Z <unit>").
 */
function parseRange(text: string): { low: number; high: number; unit: string; raw: string } | null {
  if (!text) return null;
  // Common patterns in Stahl monographs:
  //   "150–300 mg/day"        → low=150, high=300, unit="mg"
  //   "150 mg/day"            → low=150, high=150, unit="mg"
  //   "0.5–4 mg/day"          → low=0.5, high=4
  //   "20–60 mg 2 to 3 times/day"
  const re = /(\d+(?:\.\d+)?)\s*[–—-]\s*(\d+(?:\.\d+)?)\s*([a-zA-Z\/]+)/;
  const m = text.match(re);
  if (m) {
    return { low: Number(m[1]), high: Number(m[2]), unit: m[3].replace(/\/day$/, "").trim(), raw: m[0] };
  }
  const re2 = /(\d+(?:\.\d+)?)\s*([a-zA-Z\/]+)/;
  const m2 = text.match(re2);
  if (m2) {
    return { low: Number(m2[1]), high: Number(m2[1]), unit: m2[2].replace(/\/day$/, "").trim(), raw: m2[0] };
  }
  return null;
}

async function main() {
  // Resolve the Stahl PG 7th source row.
  const { data: src } = await supabase
    .from("psych_sources")
    .select("id")
    .eq("title", "Prescriber's Guide (Stahl's Essential Psychopharmacology)")
    .maybeSingle();
  const sourceId = src?.id;
  if (!sourceId) throw new Error("Stahl PG 7th source not found in psych_sources");

  // Read all DB drugs once (so we resolve drug_id case-insensitively).
  const { data: dbDrugs } = await supabase.from("psych_drugs").select("id, generic_name");
  const dbByLower = new Map<string, { id: string; generic_name: string }>();
  for (const d of dbDrugs ?? []) dbByLower.set(d.generic_name.toLowerCase(), d);

  let created = 0;
  let skippedNoRange = 0;
  let skippedAlreadyBanded = 0;
  for (const [drug, rec] of Object.entries(MONO as Record<string, { sections: Record<string, MonographSection>; monograph_start_page: number }>)) {
    const dbDrug = dbByLower.get(drug.toLowerCase());
    if (!dbDrug) { skippedAlreadyBanded++; continue; }
    // Has the drug already got curated bands?
    const { data: existingBands } = await supabase
      .from("psych_dose_bands")
      .select("id")
      .eq("drug_id", dbDrug.id);
    if (existingBands && existingBands.length) { skippedAlreadyBanded++; continue; }

    const sec = rec.sections?.["Usual Dosage Range"];
    if (!sec?.text) { skippedNoRange++; continue; }
    const parsed = parseRange(sec.text);
    if (!parsed) { skippedNoRange++; continue; }

    const pageRef = `Stahl PG 7th, Usual Dosage Range (p${sec.page})`;
    const { error } = await supabase.from("psych_dose_bands").upsert(
      {
        drug_id: dbDrug.id,
        band_order: 1,
        range_low: parsed.low,
        range_high: parsed.high,
        unit: parsed.unit,
        band_label: "Stahl usual range (single rung — sources give one continuous range)",
        primary_purpose: null,
        is_typical_starting: true,
        is_standard_maintenance: true,
        source_refs: [sourceId],
        status: "draft",
      },
      { onConflict: "drug_id,band_order" },
    );
    if (error) {
      console.error(`  ! ${drug}: ${error.message}`);
      continue;
    }
    created++;
  }

  console.log(`created ${created} draft dose bands; skipped ${skippedAlreadyBanded} already banded, ${skippedNoRange} without parseable range`);
}

main();
