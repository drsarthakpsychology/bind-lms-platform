#!/usr/bin/env tsx
/**
 * Seed the psychopharm DB with the full knowledge base — every drug, field,
 * dose band, and equivalence from the curated store, so Dr. Sarthak's review
 * queue has real rows to work on.
 *
 * Idempotent: upserts on the natural key (drug generic_name; field
 * drug+field_key+source; band drug+band_order). Rows land as `draft` /
 * `in_review` — nothing publishes without a reviewer signature (DB-enforced).
 *
 *   npm run psych:seed
 *
 * Uses the service-role key (bypasses RLS) — script-only, never in the app.
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

// Load the curated store (drugs, bands, equivalences).
import { DRAFT_DRUGS } from "../../src/lib/psychopharm/draft-seed";
import { DRAFT_DRUGS_EXTRA } from "../../src/lib/psychopharm/draft-extra";
import { DRAFT_LADDERS } from "../../src/lib/psychopharm/draft-ladder";
import { SOURCES } from "../../src/lib/psychopharm/sources";
const kb: Array<{ drug: string; field_key: string; value: string; page_ref?: string; source_id: string }> = JSON.parse(
  readFileSync(join(process.cwd(), "docs/psychopharm/KNOWLEDGE_BASE.json"), "utf8"),
);

const ALL = [...DRAFT_DRUGS, ...DRAFT_DRUGS_EXTRA, ...DRAFT_LADDERS];

let sourceCount = 0;
let drugCount = 0;
let fieldCount = 0;
let bandCount = 0;
let eqCount = 0;

async function upsertSource(s: (typeof SOURCES)[string]): Promise<string> {
  const { data, error } = await supabase
    .from("psych_sources")
    .upsert(
      {
        title: s.title,
        authors: s.authors,
        edition: s.edition,
        year: s.year || null,
        publisher: s.publisher,
        type: s.type,
        local_path: s.local_path ?? null,
        authority_scope: s.authority_scope,
        is_preview: s.is_preview ?? false,
      },
      { onConflict: "title" },
    )
    .select("id")
    .single();
  if (error) throw new Error(`source ${s.id}: ${error.message}`);
  sourceCount++;
  return data.id;
}

async function upsertDrug(rec: (typeof ALL)[number], sourceId: string): Promise<string> {
  const { data, error } = await supabase
    .from("psych_drugs")
    .upsert(
      {
        generic_name: rec.generic_name,
        brand_names: rec.brand_names ?? [],
        drug_class: rec.drug_class ?? null,
        subclass: rec.subclass ?? null,
        aliases: rec.aliases ?? [],
        status: "in_review",
      },
      { onConflict: "generic_name" },
    )
    .select("id")
    .single();
  if (error) throw new Error(`drug ${rec.generic_name}: ${error.message}`);
  drugCount++;
  return data.id;
}

async function upsertField(
  drugId: string,
  fieldKey: string,
  value: string,
  sourceId: string,
  pageRef: string | undefined,
) {
  const { error } = await supabase.from("psych_drug_fields").upsert(
    {
      drug_id: drugId,
      field_key: fieldKey,
      value: { text: value },
      source_id: sourceId,
      page_ref: pageRef ?? null,
      status: "draft",
    },
    { onConflict: "drug_id,field_key,source_id" },
  );
  if (error) throw new Error(`field ${drugId}/${fieldKey}: ${error.message}`);
  fieldCount++;
}

async function upsertBand(
  drugId: string,
  band: (typeof ALL)[number]["bands"][number],
  sourceId: string,
) {
  const { error } = await supabase.from("psych_dose_bands").upsert(
    {
      drug_id: drugId,
      band_order: band.band_order,
      range_low: band.range_low ?? null,
      range_high: band.range_high ?? null,
      unit: band.unit ?? "mg",
      frequency: band.frequency ?? null,
      band_label: band.band_label,
      primary_purpose: band.primary_purpose ?? null,
      secondary_purposes: band.secondary_purposes ?? [],
      is_typical_starting: band.is_typical_starting ?? false,
      is_standard_maintenance: band.is_standard_maintenance ?? false,
      what_changes_going_up: band.what_changes_going_up ?? null,
      what_changes_going_down: band.what_changes_going_down ?? null,
      onset: band.onset?.value ?? null,
      source_refs: [sourceId],
      status: "draft",
    },
    { onConflict: "drug_id,band_order" },
  );
  if (error) throw new Error(`band ${drugId}/${band.band_order}: ${error.message}`);
  bandCount++;
}

async function upsertEquivalence(
  drugId: string,
  eq: (typeof ALL)[number]["equivalences"][number],
  sourceUuid: string,
) {
  // No direct equivalence table; store into drug_links as published_equivalence.
  const { data: b } = await supabase.from("psych_drugs").select("id").eq("generic_name", eq.drug_b).maybeSingle();
  if (!b) return;
  const { error } = await supabase.from("psych_drug_links").upsert(
    {
      drug_a: drugId,
      drug_b: b.id,
      link_type: "published_equivalence",
      match_tier: "moderate",
      match_reason: eq.note,
      differences: [],
      equivalence_note: eq.caveat,
      source_id: sourceUuid,
      status: "draft",
    },
    { onConflict: "drug_a,drug_b,link_type" },
  );
  if (error) throw new Error(`equivalence ${drugId}: ${error.message}`);
  eqCount++;
}

async function main() {
  // Sources
  const sourceIdMap = new Map<string, string>();
  for (const s of Object.values(SOURCES)) {
    const id = await upsertSource(s);
    sourceIdMap.set(s.id, id);
  }
  console.log(`sources: ${sourceCount}`);

  // Curated drugs + bands + equivalences
  for (const rec of ALL) {
    const srcId = sourceIdMap.get(rec.bands[0]?.source_ref?.source_id ?? "stahl_pg_7th") ?? sourceIdMap.get("stahl_pg_7th")!;
    const drugId = await upsertDrug(rec, srcId);
    for (const m of rec.mechanism ?? []) {
      await upsertField(drugId, "mechanism", m.value, sourceIdMap.get(m.source_id)!, m.page_ref);
    }
    for (const b of rec.bands) await upsertBand(drugId, b, srcId);
  }
  console.log(`curated drugs: ${drugCount}, fields: ${fieldCount}, bands: ${bandCount}`);

  // Equivalences LAST — after every drug row exists (drug_b must resolve).
  for (const rec of ALL) {
    const { data: drugRow } = await supabase.from("psych_drugs").select("id").eq("generic_name", rec.generic_name).maybeSingle();
    if (!drugRow) continue;
    for (const eq of rec.equivalences ?? []) {
      const srcUuid = sourceIdMap.get(eq.source.source_id) ?? sourceIdMap.get("stahl_pg_7th")!;
      await upsertEquivalence(drugRow.id, eq, srcUuid);
    }
  }
  console.log(`equivalences: ${eqCount}`);

  // KB-derived drugs not in curated set (single-range → fields only)
  const curatedNames = new Set(ALL.map((d) => d.generic_name));
  const kbDrugs = Array.from(new Set(kb.map((r: any) => String(r.drug))));
  let kbOnly = 0;
  for (const name of kbDrugs) {
    if (curatedNames.has(name)) continue;
    const rows = kb.filter((r: any) => r.drug === name);
    const srcId = sourceIdMap.get("stahl_pg_7th")!;
    const drugId = await upsertDrug(
      {
        generic_name: name,
        brand_names: [],
        aliases: [],
        bands: [],
        mechanism: [],
        equivalences: [],
        links: [],
        clinical_presentations: [],
        student: {},
        common_uses: [],
        receptor_targets: [],
      } as any,
      srcId,
    );
    for (const row of rows) {
      await upsertField(drugId, row.field_key, row.value, sourceIdMap.get(row.source_id) ?? srcId, row.page_ref);
    }
    kbOnly++;
  }
  console.log(`KB-only drugs seeded: ${kbOnly}`);
  console.log("SEED COMPLETE");
}

main().catch((e) => {
  console.error("SEED FAILED:", e.message);
  process.exit(1);
});