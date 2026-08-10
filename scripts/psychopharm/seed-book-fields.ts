#!/usr/bin/env tsx
/**
 * Seed book-sourced field rows into Supabase as DRAFT (never published).
 *
 * Reads:  docs/psychopharm/BOOK_FIELD_ROWS.json
 * Writes: psych_drug_fields rows with status='draft', source resolved to the
 *         psych_sources row matching the book's source_id slug. Upserts on
 *         the natural key (drug_id, field_key, source_id).
 *
 *   npm run psych:seed-book
 *
 * Used for drugs that lack an FDA label but have field content extracted
 * verbatim from local textbook passages. Fields covered: interactions,
 * monitoring, contraindications, overdose, special_populations.
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

interface BookRow {
  drug: string;
  field_key: string;
  value: string;
  source_id: string;
  page_ref: string;
  snippet: string;
}

// Map from BOOK_FIELD_ROWS source_id slugs to the canonical psych_sources title.
const SOURCE_TITLE: Record<string, string> = {
  stahl_pg_7th: "Prescriber's Guide (Stahl's Essential Psychopharmacology)",
  stahl_essential_5th: "Prescriber's Guide (Stahl's Essential Psychopharmacology)",
  stahl_pg_older: "Prescriber's Guide (Stahl's Essential Psychopharmacology)",
  stahl_pg_preview: "Essential Psychopharmacology Prescriber's Guide (preview)",
  maudsley_2021: "The Maudsley Prescribing Guidelines in Psychiatry",
  kaplan_sadock: "Kaplan and Sadock's Synopsis of Psychiatry",
  ahuja_psychiatry: "A Short Textbook of Psychiatry",
  dsm5tr: "Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision",
  fish_psychopath: "Fish's Clinical Psychopathology — Signs and Symptoms in Psychiatry",
  icd11: "ICD-11 Reference Guide",
};

async function main() {
  const rows: BookRow[] = JSON.parse(
    readFileSync(join(process.cwd(), "docs/psychopharm/BOOK_FIELD_ROWS.json"), "utf8"),
  );

  // Pre-resolve source_id by canonical title.
  const titles = Array.from(new Set(rows.map((r) => SOURCE_TITLE[r.source_id]).filter(Boolean)));
  const { data: srcRows } = await supabase
    .from("psych_sources")
    .select("id, title")
    .in("title", titles);
  const titleToId = new Map<string, string>();
  for (const s of srcRows ?? []) titleToId.set(s.title, s.id);
  if (titleToId.size !== titles.length) {
    const missing = titles.filter((t) => !titleToId.has(t));
    throw new Error(`missing psych_sources rows for: ${missing.join(", ")}`);
  }

  let drugCount = 0;
  let fieldCount = 0;
  for (const row of rows) {
    const sourceTitle = SOURCE_TITLE[row.source_id];
    const sourceId = titleToId.get(sourceTitle);
    if (!sourceId) throw new Error(`source not resolved for ${row.drug}/${row.field_key}`);

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

  console.log(`seeded ${fieldCount} book field rows (${drugCount} drugs created/updated) → status=draft`);
}

main();
