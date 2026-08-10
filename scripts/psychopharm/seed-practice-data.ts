#!/usr/bin/env tsx
/**
 * Seed practice-layer content into the DB:
 *   - 8 hand-built sim_cases (published, approved, source=hand_built)
 *   - 62 SCT items (published, approved)
 *   - a few Rounds cards (published, approved)
 *   - 11 competencies (the Skills Passport taxonomy)
 *
 * Idempotent — upserts on natural keys. Uses service role (script-only).
 *
 *   npm run psych:seed-practice
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SEED_CASES } from "../../src/lib/psychopharm/sim/cases";
import { ALL_SEED_SCT_ITEMS } from "../../src/lib/practice/sct";

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

const CARDS = [
  { front: "What are the two components of the Mental Healthcare Act 2017 that most affect your duty as a counsellor?", back: "Advance directives + nominated representative. Document consent and respect expressed wishes." },
  { front: "When is confidentiality absolute, and when breached?", back: "Absolute unless imminent risk to self/others, child abuse (POCSO), or court order. Say the limits up front." },
  { front: "Mood vs affect — what's the difference?", back: "Mood is the sustained inner feeling reported; affect is the observable expression." },
  { front: "Why is premature reassurance the #1 novice error?", back: "It closes exploration — the client stops testing whether you can hold their distress." },
];

const COMPETENCIES = [
  { key: "clinical_interviewing", name: "Clinical interviewing", description: "Open questions, reflective listening, silence tolerance", display_order: 1 },
  { key: "risk_assessment", name: "Risk assessment", description: "Direct, clear, non-judgemental suicide/safety screening", display_order: 2 },
  { key: "formulation", name: "Case formulation", description: "5P and biopsychosocial formulation", display_order: 3 },
  { key: "mse", name: "Mental status exam", description: "Accurate observation + description across 11 domains", display_order: 4 },
  { key: "differential", name: "Differential reasoning", description: "Generating + testing diagnostic hypotheses", display_order: 5 },
  { key: "psychoeducation", name: "Psychoeducation", description: "Plain-language explanation, shared decision-making", display_order: 6 },
  { key: "cultural_attunement", name: "Cultural attunement", description: "Somatic-first presentations, stigma, family context", display_order: 7 },
  { key: "ethics", name: "Ethics & law", description: "MHA 2017, confidentiality limits, POCSO", display_order: 8 },
  { key: "crisis_management", name: "Crisis management", description: "De-escalation, safety planning, referral", display_order: 9 },
  { key: "therapeutic_alliance", name: "Therapeutic alliance", description: "Validation, non-judgement, rupture repair", display_order: 10 },
  { key: "self_reflection", name: "Self-reflection", description: "Noticing own reactions, using supervision", display_order: 11 },
];

async function main() {
  let sim = 0, sct = 0, cards = 0, comps = 0;

  // 1. sim_cases — upsert on slug (unique).
  for (const c of SEED_CASES) {
    const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { error } = await supabase.from("sim_cases").upsert(
      {
        title: c.title,
        slug,
        difficulty: c.difficulty,
        case_data: c,
        status: "published",
        approved: true,
        source: "hand_built",
      },
      { onConflict: "slug" },
    );
    if (error) { console.error(`sim ${c.title}: ${error.message}`); continue; }
    sim++;
  }

  // 2. sct_items — id is a uuid column; let the DB generate ids.
  //    Upsert on a deterministic fingerprint isn't possible without a unique
  //    key, so we insert if the vignette doesn't already exist.
  for (const it of ALL_SEED_SCT_ITEMS) {
    const { data: existing } = await supabase
      .from("sct_items")
      .select("id")
      .eq("vignette", it.vignette)
      .eq("hypothesis", it.hypothesis)
      .eq("new_information", it.new_information)
      .maybeSingle();
    if (existing) { sct++; continue; }
    const { error } = await supabase.from("sct_items").insert(
      {
        vignette: it.vignette,
        hypothesis: it.hypothesis,
        new_information: it.new_information,
        response_scale: it.response_scale ?? "5",
        topic: it.topic,
        status: "published",
        approved: true,
      },
    );
    if (error) { console.error(`sct ${it.id}: ${error.message}`); continue; }
    sct++;
  }

  // 3. cards — skip if the front already exists.
  for (const c of CARDS) {
    const { data: existing } = await supabase
      .from("cards")
      .select("id")
      .eq("front", c.front)
      .maybeSingle();
    if (existing) { cards++; continue; }
    const { error } = await supabase.from("cards").insert(
      {
        front: c.front,
        back: c.back,
        source: "manual",
        status: "published",
        approved: true,
      },
    );
    if (error) { console.error(`card: ${error.message}`); continue; }
    cards++;
  }

  // 4. competencies
  for (const c of COMPETENCIES) {
    const { error } = await supabase.from("competencies").upsert(
      {
        key: c.key,
        name: c.name,
        description: c.description,
        display_order: c.display_order,
      },
      { onConflict: "key" },
    );
    if (error) { console.error(`comp ${c.key}: ${error.message}`); continue; }
    comps++;
  }

  console.log(`seeded: ${sim} sim cases, ${sct} SCT items, ${cards} cards, ${comps} competencies`);
}

main();
