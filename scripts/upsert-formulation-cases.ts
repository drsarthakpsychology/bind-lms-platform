/**
 * Upsert SEED_FORMULATION into formulation_cases — gives the Formulation Forge
 * real DB content (content wiring) and a stable slug for the attempt FK. The
 * forge keeps reading the static TS content as the fallback when the DB is
 * empty; this makes the DB row exist, keyed by slug ("form-1").
 *
 *   npx tsx scripts/upsert-formulation-cases.ts [--dry-run]
 *
 * Alert: writes to the LIVE database by default (.env.local project keys).
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });
import { SEED_FORMULATION } from "@/lib/practice/formulation";

const DRY = process.argv.includes("--dry-run");
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

async function main() {
  const s = SEED_FORMULATION;
  const existing = await admin.from("formulation_cases").select("id").eq("slug", s.id).maybeSingle();
  const payload = {
    slug: s.id,
    title: s.title,
    prompt: s.prompt,
    factors: s.factors,
    distractors: [],
    model_answer: { narrative: s.modelNarrative },
    status: "published",
  };
  if (DRY) {
    console.log(`[dry] ${existing?.data ? "would-update" : "would-insert"} ${s.id}`);
    process.exit(0);
  }
  if (existing?.data) {
    const { error } = await admin.from("formulation_cases").update(payload).eq("id", existing.data.id);
    if (error) {
      console.error(`ERR ${s.id}: ${error.message}`);
      process.exit(1);
    }
    console.log(`updated ${s.id}`);
  } else {
    const { error } = await admin.from("formulation_cases").insert(payload);
    if (error) {
      console.error(`ERR ${s.id}: ${error.message}`);
      process.exit(1);
    }
    console.log(`inserted ${s.id}`);
  }
  process.exit(0);
}
void main();
