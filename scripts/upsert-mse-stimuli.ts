/**
 * Upsert the static MSE stimuli into mse_stimuli — gives mse_attempts a real
 * FK target to write against. The /practice/mse ladder keeps reading the
 * static TS content directly (that doesn't change); this only makes the DB
 * rows exist, keyed by the stable slug ("mse-1".."mse-12", "mse4-*",
 * "obs-1".."obs-idiom-4"), so /api/practice/mse/attempt can resolve
 * stimulus_id — the osce_stations precedent.
 *
 *   npx tsx scripts/upsert-mse-stimuli.ts [--dry-run]
 *
 * Alert: writes to the LIVE database by default (.env.local project keys).
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });
import { SEED_MSE_STIMULI } from "@/lib/practice/mse";
import { OBSERVE_STIMULI } from "@/lib/practice/mse-observe-stimuli";
import { FULL_MSE_STIMULI } from "@/lib/mse/mse4-stimuli";

const DRY = process.argv.includes("--dry-run");
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

interface SeedRow {
  id: string;
  content: string;
  domain: string;
}

/** Level 2 vocabulary-tagging stimuli (mse-1 .. mse-12). */
const level2: SeedRow[] = SEED_MSE_STIMULI.map((s) => ({
  id: s.id,
  content: s.content,
  domain: s.domain,
}));

/** Level 1 observe vignettes (obs-1 .. obs-idiom-4). */
const level1: SeedRow[] = OBSERVE_STIMULI.map((s) => ({
  id: s.id,
  content: s.content,
  domain: s.domain,
}));

/** Level 4 full-MSE vignettes (mse4-*) — cover all 11 domains at once. */
const level4: SeedRow[] = FULL_MSE_STIMULI.map((s) => ({
  id: s.id,
  content: s.context,
  domain: "full",
}));

const ROWS = [...level1, ...level2, ...level4];

async function main() {
  let inserted = 0;
  let updated = 0;
  for (const s of ROWS) {
    const existing = await admin.from("mse_stimuli").select("id").eq("slug", s.id).maybeSingle();
    const payload = {
      slug: s.id,
      content: s.content,
      domain: s.domain,
      medium: "text",
      status: "published",
    };
    if (DRY) {
      console.log(`[dry] ${existing?.data ? "would-update" : "would-insert"} ${s.id} (${s.domain})`);
      continue;
    }
    if (existing?.data) {
      const { error } = await admin.from("mse_stimuli").update(payload).eq("id", existing.data.id);
      if (error) {
        console.error(`ERR ${s.id}: ${error.message}`);
        continue;
      }
      updated++;
    } else {
      const { error } = await admin.from("mse_stimuli").insert(payload);
      if (error) {
        console.error(`ERR ${s.id}: ${error.message}`);
        continue;
      }
      inserted++;
    }
  }
  console.log(`done: ${inserted} inserted, ${updated} updated${DRY ? " (dry-run)" : ""}`);
  process.exit(0);
}
void main();
