#!/usr/bin/env tsx
/**
 * Seed the P3 observer sub-tables (checklist, case-format, therapy-planning,
 * vignettes) into Supabase, linking each class-level row to a representative
 * drug from that class so Dr. Sarthak can review them.
 *
 *   npm run psych:seed-p3
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
  } catch {
    /* ignore */
  }
  return undefined;
}
const URL = loadEnv("NEXT_PUBLIC_SUPABASE_URL");
const KEY = loadEnv("SUPABASE_SERVICE_ROLE_KEY");
if (!URL || !KEY) {
  console.error("missing env");
  process.exit(1);
}
const supabase = createClient(URL, KEY, { auth: { persistSession: false } });

import { OBSERVATION_CHECKLIST, CASE_FORMULATION, THERAPY_PLANNING, VIGNETTES } from "../../src/lib/psychopharm/p3-seed";

// representative drug per class/content group (must exist in psych_drugs)
const REP: Record<string, string> = {
  SSRI: "Sertraline",
  Antipsychotic: "Risperidone",
  Benzodiazepine: "Clonazepam",
  Antidepressant: "Sertraline",
};

async function drugId(name: string): Promise<string | null> {
  const { data } = await supabase.from("psych_drugs").select("id").eq("generic_name", name).maybeSingle();
  return data?.id ?? null;
}

async function main() {
  const { data: src } = await supabase.from("psych_sources").select("id").eq("title", "Stahl").maybeSingle();
  const sourceId = src?.id;
  let c = 0;

  // Checklist (class-agnostic) — link to Sertraline as representative.
  const sid = (await drugId("Sertraline"))!;
  for (const it of OBSERVATION_CHECKLIST) {
    const { error } = await supabase.from("psych_observation_checklist").insert({
      drug_id: sid, item: it.item, item_category: it.item_category, explanation: it.explanation,
      status: "in_review", source_id: sourceId ?? null,
    });
    if (error) console.error("checklist:", error.message); else c++;
  }

  // Case formulation — link per class
  for (const f of CASE_FORMULATION) {
    const rep = REP[f.class as keyof typeof REP];
    if (!rep) continue;
    const did = await drugId(rep);
    if (!did) continue;
    const { error } = await supabase.from("psych_case_format_notes").insert({
      drug_id: did, note: f.note, example: f.example, status: "in_review", source_id: sourceId ?? null,
    });
    if (error) console.error("formulation:", error.message); else c++;
  }

  // Therapy planning — link to generic TZ representative (sertraline)
  for (const t of THERAPY_PLANNING) {
    const { error } = await supabase.from("psych_therapy_planning").insert({
      therapy_type: t.therapy_type, drug_id: sid, consideration: t.consideration,
      status: "in_review", source_id: sourceId ?? null,
    });
    if (error) console.error("planning:", error.message); else c++;
  }

  // Vignettes — per class
  for (const v of VIGNETTES) {
    const rep = REP[v.drug_class as keyof typeof REP];
    if (!rep) continue;
    const did = await drugId(rep);
    if (!did) continue;
    const { error } = await supabase.from("psych_case_vignettes").insert({
      drug_id: did, scenario: v.scenario, expected_observations: v.expected,
      explanation: v.explanation, is_illustrative: true, status: "in_review", source_id: sourceId ?? null,
    });
    if (error) console.error("vignette:", error.message); else c++;
  }

  console.log(`P3 rows inserted: ${c}`);
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});