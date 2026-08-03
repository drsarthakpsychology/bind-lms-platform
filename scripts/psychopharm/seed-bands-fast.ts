#!/usr/bin/env tsx
/**
 * Fast band seeder — bulk-inserts ALL curated dose bands + fields into
 * Supabase in a few batch calls (not one round-trip per row). This lands the
 * 67 curated/laddered drugs' bands quickly. Idempotent on the natural keys.
 *
 *   npm run psych:seed-bands
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

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
const KEY = loadEnv("SUPABASE_SERVICE_ROLE_KEY");
if (!URL || !KEY) { console.error("missing env"); process.exit(1); }
const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

import { DRAFT_DRUGS } from "../../src/lib/psychopharm/draft-seed";
import { DRAFT_DRUGS_EXTRA } from "../../src/lib/psychopharm/draft-extra";
import { DRAFT_LADDERS } from "../../src/lib/psychopharm/draft-ladder";
import { DRAFT_LADDERS_2 } from "../../src/lib/psychopharm/draft-ladder2";
import { DRAFT_FDA } from "../../src/lib/psychopharm/draft-fda";
import { DRAFT_FDA_2 } from "../../src/lib/psychopharm/draft-fda2";
import { DRAFT_FDA_3 } from "../../src/lib/psychopharm/draft-fda3";
import { DRAFT_FDA_4 } from "../../src/lib/psychopharm/draft-fda4";
import { DRAFT_FDA_5 } from "../../src/lib/psychopharm/draft-fda5";
import { DRAFT_FDA_6 } from "../../src/lib/psychopharm/draft-fda6";

const ALL = [
  ...DRAFT_DRUGS, ...DRAFT_DRUGS_EXTRA, ...DRAFT_LADDERS, ...DRAFT_LADDERS_2,
  ...DRAFT_FDA, ...DRAFT_FDA_2, ...DRAFT_FDA_3, ...DRAFT_FDA_4, ...DRAFT_FDA_5, ...DRAFT_FDA_6,
];

async function main() {
  // source id map
  const { data: srcRows } = await supabase.from("psych_sources").select("id, title");
  const srcByTitle = new Map<string, string>();
  for (const s of srcRows ?? []) srcByTitle.set(s.title, s.id);

  // drug id map
  const { data: drugRows } = await supabase.from("psych_drugs").select("id, generic_name");
  const drugIdByName = new Map<string, string>();
  for (const d of drugRows ?? []) drugIdByName.set(d.generic_name, d.id);

  // Gather all bands into one batch
  const bandRows: any[] = [];
  const fieldRows: any[] = [];
  let orphan = 0;
  for (const rec of ALL) {
    const drugId = drugIdByName.get(rec.generic_name);
    if (!drugId) { orphan++; continue; }
    const bandSrcTitle = rec.bands[0]?.source_ref?.source_id === "fda_label"
      ? "FDA Prescribing Information (DailyMed / Drugs@FDA)"
      : rec.bands[0]?.source_ref?.source_id === "maudsley_2021"
        ? "The Maudsley Prescribing Guidelines in Psychiatry"
        : "Prescriber's Guide (Stahl's Essential Psychopharmacology)";
    const srcId = srcByTitle.get(bandSrcTitle) ?? null;
    for (const b of rec.bands) {
      bandRows.push({
        drug_id: drugId,
        band_order: b.band_order,
        range_low: b.range_low ?? null,
        range_high: b.range_high ?? null,
        unit: b.unit ?? "mg",
        frequency: b.frequency ?? null,
        band_label: b.band_label,
        primary_purpose: b.primary_purpose ?? null,
        secondary_purposes: b.secondary_purposes ?? [],
        is_typical_starting: b.is_typical_starting ?? false,
        is_standard_maintenance: b.is_standard_maintenance ?? false,
        what_changes_going_up: b.what_changes_going_up ?? null,
        what_changes_going_down: b.what_changes_going_down ?? null,
        onset: b.onset?.value ?? null,
        source_refs: srcId ? [srcId] : [],
        status: "draft",
      });
    }
    for (const m of rec.mechanism ?? []) {
      fieldRows.push({
        drug_id: drugId,
        field_key: "mechanism",
        value: { text: m.value },
        source_id: srcId ?? null,
        page_ref: m.page_ref ?? null,
        status: "draft",
      });
    }
  }

  // Batch upsert bands (chunked to avoid payload limits).
  const CHUNK = 200;
  for (let i = 0; i < bandRows.length; i += CHUNK) {
    const chunk = bandRows.slice(i, i + CHUNK);
    const { error } = await supabase.from("psych_dose_bands").upsert(chunk, { onConflict: "drug_id,band_order" });
    if (error) { console.error("band chunk error:", error.message); process.exit(1); }
  }
  for (let i = 0; i < fieldRows.length; i += CHUNK) {
    const chunk = fieldRows.slice(i, i + CHUNK);
    const { error } = await supabase.from("psych_drug_fields").upsert(chunk, { onConflict: "drug_id,field_key,source_id" });
    if (error) { console.error("field chunk error:", error.message); process.exit(1); }
  }

  console.log(`bands upserted: ${bandRows.length}; fields upserted: ${fieldRows.length}; orphan drugs (no DB row): ${orphan}`);
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });