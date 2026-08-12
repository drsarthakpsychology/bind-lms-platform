/**
 * Upsert the authored character bank into sim_cases — the live route serves
 * them immediately: published + approved, difficulty, case_data carrying the
 * full authored voice (fixture_lines, variation, few_shot, story, rules).
 *
 *   npx tsx scripts/upsert-characters.ts [--dry-run]
 *
 * Alert: creates/updates rows on the LIVE database. Runs by default against
 * the project keys in .env.local. Use the local Supabase instance for dry
 * practice runs; --dry-run prints what WOULD change without writing.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });
import { CHARACTER_SKELETONS } from "@/lib/sim/characters";
import type { DepthCase } from "@/lib/sim/types";

const DRY = process.argv.includes("--dry-run");
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

function toDepthCase(c: (typeof CHARACTER_SKELETONS)[number]): DepthCase {
  return {
    case_id: `char-${c.key}`,
    title: c.title,
    difficulty: c.difficulty,
    identity: c.identity,
    presentation: c.presentation,
    chief_complaint_in_own_words: c.chief_complaint_in_own_words,
    opening_idiom: c.opening_idiom,
    history: c.history,
    cognitive_model: {
      core_belief: "I must handle this alone.",
      intermediate_beliefs: ["Talking about it makes it real", "People will judge me"],
      coping: ["avoidance", "somatising", "self-medicating"],
    },
    disclosure_rules: c.disclosure_rules.map((r) => ({ fact: r.fact, gate: r.gate, disclose_via: r.disclose_via })) as DepthCase["disclosure_rules"],
    resistance: c.resistance,
    affect_rules: c.affect_rules,
    red_flags: c.red_flags as DepthCase["red_flags"],
    context_pack: { family_in_room: false, stigma: [], cost_concerns: true, legal_relevance: [] },
    style_refs: ["deflection", "topic_shift"],
    rubric_targets: ["rapport", "validation", "risk assessment"],
    few_shot: c.few_shot,
    fixture_lines: c.fixture_lines,
    variation: c.variation,
    traps: c.traps as DepthCase["traps"],
    moves: {},
  };
}

async function main() {
  let inserted = 0, updated = 0;
  for (const c of CHARACTER_SKELETONS) {
    const existing = await admin.from("sim_cases").select("id").eq("slug", `char-${c.key}`).maybeSingle();
    const payload = {
      title: c.title,
      slug: `char-${c.key}`,
      difficulty: c.difficulty,
      case_data: toDepthCase(c),
      status: "published",
      approved: true,
      source: "hand_built", // sim_cases_source_check allows hand_built/ai_generated/faculty_dictated/corpus
    };
    if (DRY) { console.log(`[dry] ${existing ? "would-update" : "would-insert"} ${c.key}`); continue; }
    if (existing?.data) {
      const { error } = await admin.from("sim_cases").update(payload).eq("id", existing.data.id);
      if (error) { console.error(`ERR ${c.key}: ${error.message}`); continue; }
      updated++;
    } else {
      const { error } = await admin.from("sim_cases").insert(payload);
      if (error) { console.error(`ERR ${c.key}: ${error.message}`); continue; }
      inserted++;
    }
  }
  console.log(`done: ${inserted} inserted, ${updated} updated${DRY ? " (dry-run)" : ""}`);
  process.exit(0);
}
void main();
