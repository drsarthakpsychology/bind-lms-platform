#!/usr/bin/env tsx
/**
 * Seed FDA full-label field rows into Supabase as DRAFT (never published).
 *
 * Reads:  docs/psychopharm/FDA_FIELD_ROWS.json
 * Writes: psych_drug_fields rows with status='draft', source = fda_label,
 *         page_ref + snippet provenance. Upserts on the natural key
 *         (drug_id, field_key, source_id).
 *
 *   npm run psych:seed-fda
 *
 * Quote-first: value is the verbatim label section; snippet is the first 600
 * chars for the reviewer. Nothing auto-publishes — reviewer must flip
 * status → 'in_review'/'published'.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function loadEnv(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(new RegExp(`^${name}=(.*)$`));
      if (m) return m[1].trim();
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

const URL = loadEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = loadEnv("SUPABASE_SERVICE_ROLE_KEY");
if (!URL || !SERVICE_KEY) {
  console.error("missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

interface FdaRow {
  drug: string;
  field_key: string;
  value: string;
  page_ref: string;
  snippet: string;
}

async function main() {
  const rows: FdaRow[] = JSON.parse(
    readFileSync(join(process.cwd(), "docs/psychopharm/FDA_FIELD_ROWS.json"), "utf8"),
  );

  // Resolve the fda_label source row.
  const { data: src } = await supabase
    .from("psych_sources")
    .select("id")
    .eq("title", "FDA Prescribing Information (DailyMed / Drugs@FDA)")
    .maybeSingle();
  const sourceId = src?.id;
  if (!sourceId) throw new Error("fda_label source not found in psych_sources");

  let drugCount = 0;
  let fieldCount = 0;
  for (const row of rows) {
    // Resolve the drug row case-insensitively, preferring the canonical
    // title-case spelling (e.g. "Bupropion" over "bupropion") so we never
    // create a duplicate drug row. Tiebreak: exact title-case match first,
    // then shortest name, then lexicographically smallest.
    const { data: matches } = await supabase
      .from("psych_drugs")
      .select("id, generic_name")
      .ilike("generic_name", row.drug);
    const existing = matches ?? [];
    const canonical = row.drug.replace(/\b\w/g, (c) => c.toUpperCase());
    const pick = existing
      .slice()
      .sort((a: any, b: any) => {
        const aExact = a.generic_name === canonical ? 0 : 1;
        const bExact = b.generic_name === canonical ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        const lenDiff = a.generic_name.length - b.generic_name.length;
        if (lenDiff !== 0) return lenDiff;
        return a.generic_name.localeCompare(b.generic_name);
      })[0];
    let drugId = pick?.id;
    if (!drugId) {
      const { data, error } = await supabase
        .from("psych_drugs")
        .upsert(
          {
            generic_name: row.drug,
            brand_names: [],
            aliases: [],
            status: "in_review",
          },
          { onConflict: "generic_name" },
        )
        .select("id")
        .single();
      if (error) throw new Error(`drug ${row.drug}: ${error.message}`);
      drugId = data.id;
      drugCount++;
    }

    const { error } = await supabase.from("psych_drug_fields").upsert(
      {
        drug_id: drugId,
        field_key: row.field_key,
        value: { text: row.value },
        source_id: sourceId,
        page_ref: row.page_ref,
        snippet: row.snippet,
        agreement: "single",
        status: "draft",
      },
      { onConflict: "drug_id,field_key,source_id" },
    );
    if (error) throw new Error(`field ${row.drug}/${row.field_key}: ${error.message}`);
    fieldCount++;
  }

  console.log(`seeded ${fieldCount} FDA field rows (${drugCount} drugs created/updated) → status=draft`);
}

main();
