#!/usr/bin/env tsx
/**
 * Seed medication_documents from the enriched author content (Stahl 7th ed. +
 * web research). Fills only the gaps: drugs that already have a curated
 * document (seeded via seed-documents.ts) are left untouched — the enriched
 * entries provide a starting point for the ~85 drugs that had none.
 *
 * Rows land as `draft` (the reviewer gate stays closed); an admin reviews and
 * publishes each one in the editor.
 *
 *   npm run psych:seed-enriched
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

import { ENRICHED_ANTIDEPRESSANTS } from "../../src/lib/psychopharm/enriched-antidepressants";
import { ENRICHED_ANTIPSYCHOTICS } from "../../src/lib/psychopharm/enriched-antipsychotics";
import { ENRICHED_OTHERS } from "../../src/lib/psychopharm/enriched-others";
import type { MedicationDocument } from "../../src/lib/psychopharm/document";

const ALL = [...ENRICHED_ANTIDEPRESSANTS, ...ENRICHED_ANTIPSYCHOTICS, ...ENRICHED_OTHERS].filter(
  (e, i, arr) => arr.findIndex((x) => x.generic_name === e.generic_name) === i,
);

const uid = () => crypto.randomUUID();

function buildDocument(e: (typeof ALL)[number]): MedicationDocument {
  const sections: MedicationDocument["sections"] = [];

  // Student: plain-language summary as its own callout section.
  if (e.plain_language) {
    sections.push({
      id: uid(),
      title: "In plain words",
      blocks: [{ id: uid(), type: "plain_language", value: e.plain_language, order: 1, sources: [] }],
    });
  }

  // Clinical: mechanism.
  if (e.mechanism) {
    sections.push({
      id: uid(),
      title: "Mechanism",
      blocks: [{ id: uid(), type: "mechanism", value: e.mechanism, order: 1, sources: [] }],
    });
  }

  // Clinical: common uses.
  if (e.common_uses?.length) {
    sections.push({
      id: uid(),
      title: "Commonly used in",
      blocks: e.common_uses.map((u, i) => ({
        id: uid(), type: "common_uses" as const, value: u, order: i + 1, sources: [],
      })),
    });
  }

  // Clinical: side effects (a scannable list block).
  if (e.side_effects?.length) {
    sections.push({
      id: uid(),
      title: "Side effects",
      blocks: [{
        id: uid(), type: "side_effect_list" as const, value: "Key side effects",
        data: { items: e.side_effects }, order: 1, sources: [],
      }],
    });
  }

  // Clinical: monitoring (one note per recommendation).
  if (e.monitoring?.length) {
    sections.push({
      id: uid(),
      title: "Monitoring",
      blocks: e.monitoring.map((m, i) => ({
        id: uid(), type: "note" as const, value: m, order: i + 1, sources: [],
      })),
    });
  }

  return { generic_name: e.generic_name, sections };
}

async function main() {
  const { data: drugRows } = await supabase.from("psych_drugs").select("id, generic_name");
  const byName = new Map<string, string>();
  for (const d of drugRows ?? []) byName.set(d.generic_name, d.id);

  const { data: existing } = await supabase.from("medication_documents").select("drug_id");
  const have = new Set((existing ?? []).map((x) => x.drug_id));

  let inserted = 0;
  let skipped = 0;
  for (const e of ALL) {
    const drugId = byName.get(e.generic_name);
    if (!drugId) continue;
    if (have.has(drugId)) { skipped++; continue; } // preserve curated content
    const document = buildDocument(e);
    const { error } = await supabase.from("medication_documents").insert({
      drug_id: drugId,
      document,
      status: "draft",
      version: 1,
    });
    if (error) { console.error(`doc ${e.generic_name}: ${error.message}`); continue; }
    inserted++;
  }
  console.log(`enriched seed: ${inserted} inserted, ${skipped} skipped (already have a document)`);
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
