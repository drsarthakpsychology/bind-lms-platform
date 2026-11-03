#!/usr/bin/env tsx
/**
 * Controlled production demo: mark one module complete for ONE student and let
 * the achievement engine award the badge.
 *
 *   npx tsx scripts/demo-complete-module.ts
 *
 * SAFETY
 * - Identifies the student by EXACT immutable id (never a broad email update).
 * - Only ever touches the `interview-mse` module for that one student.
 * - Merges with existing progress (does NOT reset or overwrite; better test
 *   scores and any other module's progress are preserved).
 * - Uses the SAME engine functions the app uses (finishSection / markWritten /
 *   markActivity / recordTest) and `awardEligibleBadges` for the badge — no
 *   direct badge insert.
 * - Idempotent: if the module is already complete it prints "already complete"
 *   and changes nothing. Safe to re-run.
 * - Prints a rollback snippet (the prior learn_progress.state JSON and the
 *   credential_ids it created) so the change can be undone exactly.
 *
 * ROLLBACK (documented): restore the printed `state` snapshot to
 *   learn_progress for the student, then delete the listed `credentials` rows
 *   and their `notifications` rows.
 *
 * Prerequisites (run once, BEFORE this script, in this order):
 *   1. Seed the achievements templates (at least `badge-interview-mse`) via
 *      Admin → Achievements, or the seed migration.
 *   2. Apply the roll-number migration (2026_11_roll_numbers.sql) if it has
 *      not been applied to production yet.
 *   3. Set SUPABASE_SERVICE_ROLE_KEY for the production project.
 */
import { createAdminClient } from "@/lib/supabase/server";
import { moduleById } from "@/lib/study";
import { readingSections, testSection } from "@/lib/study/plan";
import { emptyState, finishSection, markWritten, markActivity, recordTest, normalise, studyKey } from "@/lib/learn/engine";
import { awardEligibleBadges } from "@/lib/achievements/server";
import { istToday } from "@/lib/practice/streaks";

const STUDENT_ID = "cd5ad53d-809a-44cd-baeb-c229074c7b57";
const STUDENT_EMAIL = "kavyabothra123@gmail.com";
const MODULE_ID = "interview-mse";
// Synthetic demo score — the badge only requires the test be TAKEN, not a
// specific mark, so this is a placeholder that still exercises recordTest.
const TEST_RIGHT = 8;
const TEST_TOTAL = 10;

async function main() {
  const admin = createAdminClient();

  // 1. Exact account identification.
  const { data: profile } = await admin
    .from("profiles")
    .select("id, email, name, role")
    .eq("id", STUDENT_ID)
    .maybeSingle();
  if (!profile) throw new Error(`No profile for id ${STUDENT_ID}`);
  if (profile.role !== "student") throw new Error(`Account ${profile.email} is role=${profile.role}, not student`);
  if (String(profile.email).toLowerCase() !== STUDENT_EMAIL) throw new Error(`id ${STUDENT_ID} maps to ${profile.email}, expected ${STUDENT_EMAIL}`);

  const m = moduleById(MODULE_ID);
  if (!m) throw new Error(`Module "${MODULE_ID}" not found in content`);
  if (!testSection(m)) throw new Error(`Module "${MODULE_ID}" has no test section`);

  // 2. Load current state (merge target).
  const { data: row } = await admin.from("learn_progress").select("state, updated_at").eq("user_id", STUDENT_ID).maybeSingle();
  const prev = normalise(row?.state ?? null);
  const prevJson = row?.state ? JSON.stringify(prev) : null;

  // 3. Idempotency: skip if already complete.
  const reading = readingSections(m);
  const readDone = reading.filter((s) => prev.study.done[studyKey(m.id, s.id)]).length;
  const actsDone = Object.keys(prev.study.acts[m.id] ?? {}).length;
  const alreadyComplete =
    readDone === reading.length &&
    Boolean(prev.study.written[m.id]) &&
    actsDone === m.activities.length &&
    Boolean(prev.study.tests[m.id]);
  if (alreadyComplete) {
    console.log(`Already complete (${readDone}/${reading.length} sections, ${actsDone}/${m.activities.length} activities, test taken). Nothing changed.`);
    return;
  }

  // 4. Merge a completed module via the engine (preserves existing + better scores).
  const today = istToday();
  let s = emptyState();
  s = { ...s, study: prev.study, xp: prev.xp };
  for (const sec of reading) s = finishSection(s, m.id, sec.id, today);
  s = markWritten(s, m.id, today);
  for (const a of m.activities) s = markActivity(s, m.id, a.id, today);
  s = recordTest(s, m.id, TEST_RIGHT, TEST_TOTAL, today);

  // 5. Persist.
  const { error } = await admin
    .from("learn_progress")
    .upsert({ user_id: STUDENT_ID, state: s, xp: s.xp, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw new Error(`learn_progress write failed: ${error.message}`);

  // 6. Award the badge through the engine (not a direct insert).
  const { awarded, skipped } = await awardEligibleBadges(admin, STUDENT_ID, null);
  console.log(`Completed ${MODULE_ID} for ${profile.email}. Badges: awarded=${awarded} skipped=${skipped}.`);

  // 7. Emit rollback info.
  const { data: newCreds } = await admin.from("credentials").select("credential_id").eq("user_id", STUDENT_ID);
  console.log("\n--- ROLLBACK ---");
  console.log(`# restore learn_progress.state for ${STUDENT_ID} to:`);
  console.log(prevJson ?? "(none — was empty)");
  console.log(`# then delete these credential_ids and their notifications:`);
  console.log((newCreds ?? []).map((c) => c.credential_id).join("\n") || "(none)");
}

void main().catch((e) => {
  console.error("demo-complete-module failed:", e instanceof Error ? e.message : e);
  process.exit(1);
});
