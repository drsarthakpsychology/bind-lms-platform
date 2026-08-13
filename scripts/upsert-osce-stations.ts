/**
 * Upsert SEED_OSCE_STATIONS into osce_stations — gives osce_attempts a real
 * FK target to write against. The /practice/osce tool keeps reading the
 * static TS content directly (that doesn't change); this only makes the
 * DB row exist, keyed by the stable slug ("osce-1".."osce-12"), so
 * /api/practice/osce/attempt can resolve station_id.
 *
 *   npx tsx scripts/upsert-osce-stations.ts [--dry-run]
 *
 * Alert: writes to the LIVE database by default (.env.local project keys).
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });
import { SEED_OSCE_STATIONS } from "@/lib/practice/osce";

const DRY = process.argv.includes("--dry-run");
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

async function main() {
  let inserted = 0;
  let updated = 0;
  for (const s of SEED_OSCE_STATIONS) {
    const existing = await admin.from("osce_stations").select("id").eq("slug", s.id).maybeSingle();
    const payload = {
      slug: s.id,
      title: s.title,
      task: s.task,
      duration_seconds: s.duration_seconds,
      checklist: s.checklist,
      global_rating: s.global_rating,
      status: "published",
    };
    if (DRY) {
      console.log(`[dry] ${existing?.data ? "would-update" : "would-insert"} ${s.id}`);
      continue;
    }
    if (existing?.data) {
      const { error } = await admin.from("osce_stations").update(payload).eq("id", existing.data.id);
      if (error) {
        console.error(`ERR ${s.id}: ${error.message}`);
        continue;
      }
      updated++;
    } else {
      const { error } = await admin.from("osce_stations").insert(payload);
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
