// Upsert SEED_CASES (with variation + fixture_lines) into sim_cases.
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });
import { SEED_CASES } from "@/lib/psychopharm/sim/cases";

async function main() {
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  for (const c of SEED_CASES) {
    const { data: existing } = await admin.from("sim_cases").select("id, case_data").eq("title", c.title).maybeSingle();
    const row = existing as { id: string; case_data: Record<string, unknown> | null } | null;
    const variation = (c as unknown as { variation?: unknown }).variation;
    if (row && !row.case_data?.variation && variation) {
      const { error } = await admin.from("sim_cases").update({ case_data: c }).eq("id", row.id);
      console.log(error ? `ERR ${c.title}: ${error.message}` : `UPDATED ${c.title}`);
    } else if (!row) {
      const { error } = await admin.from("sim_cases").insert({ title: c.title, slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""), difficulty: c.difficulty, case_data: c, status: "published", approved: true, source: "hand_built" });
      console.log(error ? `ERR insert ${c.title}: ${error.message}` : `INSERTED ${c.title}`);
    } else {
      console.log(`SKIP ${c.title} (already has variation or unchanged)`);
    }
  }
  process.exit(0);
}
void main();
