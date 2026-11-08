/**
 * Seed every Formulation Forge case (src/lib/practice/formulation-cases.ts,
 * including the library) into formulation_cases. Idempotent: rows are keyed
 * by slug ("form-1"...); existing rows are updated, missing rows inserted.
 *
 *   npx tsx scripts/upsert-formulation-library.ts            (dry run: prints the plan)
 *   npx tsx scripts/upsert-formulation-library.ts --apply    (writes to the database in .env.local)
 *
 * The forge reads the static cases directly, so the page works without this;
 * the rows give attempts a stable target. Default is a dry run.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });
import { FORMULATION_CASES } from "@/lib/practice/formulation-cases";

const APPLY = process.argv.includes("--apply");

async function main() {
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  let inserted = 0;
  let updated = 0;
  for (const c of FORMULATION_CASES) {
    const { data: existing } = await admin.from("formulation_cases").select("id").eq("slug", c.id).maybeSingle();
    const payload = {
      slug: c.id,
      title: c.title,
      prompt: c.prompt,
      factors: c.factors,
      distractors: [],
      model_answer: { narrative: c.modelNarrative, hint: c.hint, tags: c.tags ?? null },
      status: "published",
    };
    if (!APPLY) {
      console.log(`[dry] ${existing ? "would-update" : "would-insert"} ${c.id}`);
      continue;
    }
    const { error } = existing
      ? await admin.from("formulation_cases").update(payload).eq("id", existing.id)
      : await admin.from("formulation_cases").insert(payload);
    if (error) {
      console.error(`ERR ${c.id}: ${error.message}`);
      continue;
    }
    if (existing) updated++;
    else inserted++;
  }
  console.log(`done: ${FORMULATION_CASES.length} cases, ${inserted} inserted, ${updated} updated${APPLY ? "" : " (dry run)"}`);
  process.exit(0);
}
void main();
