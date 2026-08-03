#!/usr/bin/env tsx
/**
 * Seed medication_documents from the curated draft data. One row per curated
 * drug, with the page built as typed blocks. This gives the KMS editor content
 * to start with. Rows land as `draft` (reviewer gate stays closed).
 *
 *   npm run psych:seed-docs
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
import { ONSET_PATCHES } from "../../src/lib/psychopharm/draft-onset";
import { SOURCES } from "../../src/lib/psychopharm/sources";
import type { MedicationDocument } from "../../src/lib/psychopharm/document";

const ALL = [
  ...DRAFT_DRUGS, ...DRAFT_DRUGS_EXTRA, ...DRAFT_LADDERS, ...DRAFT_LADDERS_2,
  ...DRAFT_FDA, ...DRAFT_FDA_2, ...DRAFT_FDA_3, ...DRAFT_FDA_4, ...DRAFT_FDA_5, ...DRAFT_FDA_6,
];

function sourceRef(sourceId?: string, page?: string, snippet?: string) {
  const s = sourceId ? SOURCES[sourceId] : undefined;
  return {
    source_id: sourceId,
    title: s?.title,
    edition: s?.edition,
    page,
    quote: snippet,
  };
}

function buildDocument(rec: (typeof ALL)[number]): MedicationDocument {
  const onsetPatch = ONSET_PATCHES.find((o) => o.generic_name === rec.generic_name)?.onset_time;
  const sections: MedicationDocument["sections"] = [];

  // Overview / mechanism
  const mechBlocks = [];
  for (const m of rec.mechanism ?? []) {
    mechBlocks.push({
      id: crypto.randomUUID(),
      type: "mechanism" as const,
      value: m.value,
      order: 1,
      sources: [sourceRef(m.source_id, m.page_ref, m.snippet)],
    });
  }
  if (mechBlocks.length) sections.push({ id: crypto.randomUUID(), title: "Mechanism", blocks: mechBlocks });

  // Dose bands
  const bandBlocks = (rec.bands ?? []).map((b, i) => ({
    id: crypto.randomUUID(),
    type: "dose_band" as const,
    value: b.primary_purpose ?? b.band_label,
    data: {
      low: b.range_low ?? null,
      high: b.range_high ?? null,
      unit: b.unit ?? "mg",
      frequency: b.frequency ?? null,
      band_label: b.band_label,
      primary_purpose: b.primary_purpose,
    },
    order: i + 1,
    sources: b.source_ref ? [sourceRef(b.source_ref.source_id, b.source_ref.page_ref, b.source_ref.snippet)] : [],
  }));
  if (bandBlocks.length) sections.push({ id: crypto.randomUUID(), title: "Dose bands", blocks: bandBlocks });

  // Onset + half-life
  const onsetBlocks = [];
  if (onsetPatch) {
    onsetBlocks.push({
      id: crypto.randomUUID(),
      type: "onset" as const,
      value: onsetPatch.value,
      order: 1,
      sources: [sourceRef(onsetPatch.source_id, onsetPatch.page_ref, onsetPatch.snippet)],
    });
  } else if (rec.onset_time) {
    onsetBlocks.push({
      id: crypto.randomUUID(),
      type: "onset" as const,
      value: rec.onset_time.value,
      order: 1,
      sources: [sourceRef(rec.onset_time.source_id, rec.onset_time.page_ref, rec.onset_time.snippet)],
    });
  }
  if (onsetBlocks.length) sections.push({ id: crypto.randomUUID(), title: "When it starts working", blocks: onsetBlocks });

  // Common uses
  const usesBlocks = (rec.common_uses ?? []).map((u, i) => ({
    id: crypto.randomUUID(),
    type: "common_uses" as const,
    value: u.value,
    order: i + 1,
    sources: [sourceRef(u.source_id, u.page_ref, u.snippet)],
  }));
  if (usesBlocks.length) sections.push({ id: crypto.randomUUID(), title: "Commonly used in", blocks: usesBlocks });

  // Plain-language overview (student layer)
  const plain = rec.student?.plain_language;
  if (plain?.text) {
    sections.push({
      id: crypto.randomUUID(),
      title: "In plain words",
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "plain_language" as const,
          value: plain.text,
          order: 1,
          sources: plain.source ? [sourceRef(plain.source.source_id, plain.source.page_ref, plain.source.snippet)] : [],
        },
      ],
    });
  }

  // Side effects (common / serious from the draft record)
  const seBlocks = [];
  if (rec.side_effects_common) {
    seBlocks.push({
      id: crypto.randomUUID(),
      type: "side_effect_list" as const,
      value: "Common",
      data: { items: rec.side_effects_common.value.split(";").map((s) => s.trim()) },
      order: 1,
      sources: [sourceRef(rec.side_effects_common.source_id, rec.side_effects_common.page_ref, rec.side_effects_common.snippet)],
    });
  }
  if (rec.side_effects_serious) {
    seBlocks.push({
      id: crypto.randomUUID(),
      type: "side_effect_list" as const,
      value: "Serious (rare)",
      data: { items: rec.side_effects_serious.value.split(";").map((s) => s.trim()) },
      order: 2,
      sources: [sourceRef(rec.side_effects_serious.source_id, rec.side_effects_serious.page_ref, rec.side_effects_serious.snippet)],
    });
  }
  if (seBlocks.length) sections.push({ id: crypto.randomUUID(), title: "Side effects", blocks: seBlocks });

  // Observation layer — therapist questions, pearls, red flags, session observations
  const obsBlocks: Record<string, MedicationDocument["sections"][number]["blocks"]> = {};
  for (const q of rec.student?.therapist_questions ?? []) {
    (obsBlocks["therapist_question_list"] ??= []).push({
      id: crypto.randomUUID(),
      type: "therapist_question_list" as const,
      value: q.question,
      order: (obsBlocks["therapist_question_list"] ?? []).length + 1,
      sources: q.source ? [sourceRef(q.source.source_id, q.source.page_ref, q.source.snippet)] : [],
    });
  }
  for (const p of rec.student?.clinical_pearls ?? []) {
    (obsBlocks["clinical_pearl_list"] ??= []).push({
      id: crypto.randomUUID(),
      type: "clinical_pearl_list" as const,
      value: p.pearl,
      order: (obsBlocks["clinical_pearl_list"] ?? []).length + 1,
      sources: p.source ? [sourceRef(p.source.source_id, p.source.page_ref, p.source.snippet)] : [],
    });
  }
  for (const r of rec.student?.red_flags ?? []) {
    (obsBlocks["red_flag_list"] ??= []).push({
      id: crypto.randomUUID(),
      type: "red_flag_list" as const,
      value: r.signal,
      order: (obsBlocks["red_flag_list"] ?? []).length + 1,
      sources: r.source ? [sourceRef(r.source.source_id, r.source.page_ref, r.source.snippet)] : [],
    });
  }
  for (const s of rec.student?.session_observations ?? []) {
    (obsBlocks["observation_prompt_list"] ??= []).push({
      id: crypto.randomUUID(),
      type: "observation_prompt_list" as const,
      value: s.observation,
      order: (obsBlocks["observation_prompt_list"] ?? []).length + 1,
      sources: s.source ? [sourceRef(s.source.source_id, s.source.page_ref, s.source.snippet)] : [],
    });
  }
  const obsSections: Array<[string, string]> = [
    ["therapist_question_list", "Questions to ask"],
    ["clinical_pearl_list", "Clinical pearls"],
    ["red_flag_list", "When to contact the prescriber"],
    ["observation_prompt_list", "Observations to notice"],
  ];
  for (const [type, title] of obsSections) {
    if (obsBlocks[type]?.length) sections.push({ id: crypto.randomUUID(), title, blocks: obsBlocks[type] });
  }

  return { generic_name: rec.generic_name, sections };
}

async function main() {
  const { data: drugRows } = await supabase.from("psych_drugs").select("id, generic_name");
  const byName = new Map<string, string>();
  for (const d of drugRows ?? []) byName.set(d.generic_name, d.id);

  let count = 0;
  for (const rec of ALL) {
    const drugId = byName.get(rec.generic_name);
    if (!drugId) continue;
    const document = buildDocument(rec);
    const { error } = await supabase.from("medication_documents").upsert(
      {
        drug_id: drugId,
        document,
        status: "draft",
        version: 1,
      },
      { onConflict: "drug_id" },
    );
    if (error) { console.error(`doc ${rec.generic_name}: ${error.message}`); continue; }
    count++;
  }
  console.log(`seeded ${count} medication documents`);
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });