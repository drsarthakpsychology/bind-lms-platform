/**
 * Seed the Consulting Room library (src/lib/sim/library) into sim_cases.
 * Idempotent: rows are keyed by slug ("lib-cr-001"...); an existing row is
 * updated in place, a missing row is inserted. Running it twice changes
 * nothing the second time.
 *
 *   npx tsx scripts/upsert-sim-library.ts            (dry run: prints the plan)
 *   npx tsx scripts/upsert-sim-library.ts --apply    (writes to the database in .env.local)
 *
 * Alert: --apply writes to whichever project .env.local points at. The
 * default is a dry run so nothing reaches the live database by accident.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });
import { SIM_LIBRARY } from "@/lib/sim/library";

const APPLY = process.argv.includes("--apply");

async function main() {
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  let inserted = 0;
  let updated = 0;
  for (const c of SIM_LIBRARY) {
    const { data: existing } = await admin.from("sim_cases").select("id").eq("slug", c.slug).maybeSingle();
    const payload = {
      title: c.title,
      slug: c.slug,
      difficulty: c.difficulty,
      case_data: c,
      status: "published",
      approved: true,
      source: "hand_built",
    };
    if (!APPLY) {
      console.log(`[dry] ${existing ? "would-update" : "would-insert"} ${c.slug}`);
      continue;
    }
    if (existing) {
      const { error } = await admin.from("sim_cases").update(payload).eq("id", existing.id);
      if (error) {
        console.error(`ERR ${c.slug}: ${error.message}`);
        continue;
      }
      updated++;
    } else {
      const { error } = await admin.from("sim_cases").insert(payload);
      if (error) {
        console.error(`ERR ${c.slug}: ${error.message}`);
        continue;
      }
      inserted++;
    }
  }
  console.log(`done: ${SIM_LIBRARY.length} cases, ${inserted} inserted, ${updated} updated${APPLY ? "" : " (dry run)"}`);
  process.exit(0);
}
void main();
