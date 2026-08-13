#!/usr/bin/env tsx
/**
 * Seed a test student account for local/staging checks.
 *
 *   npm run seed-test -- <courseId>
 *
 * Creates (idempotently) a student with username-style email `Test@vibha.test`
 * and password `K#test`, marks the profile as a test account (`is_test = true`),
 * and enrolls them in the given course.
 *
 * ⚠ REMOVE BEFORE COHORT LAUNCH — the password is weak and the account exists
 * only for local/staging checks. See docs/TEST_ACCOUNT.md.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (in .env.local).
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";

const TEST_EMAIL = "Test@vibha.test";
const TEST_PASSWORD = "K#test";

function loadEnv(): Record<string, string | undefined> {
  const out: Record<string, string> = {};
  if (existsSync(".env.local")) {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) out[m[1]] = m[2].trim();
    }
  }
  return { ...process.env, ...out };
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const courseId = process.argv[2];
  if (!courseId) {
    console.error("Usage: npm run seed-test -- <courseId>");
    process.exit(1);
  }

  const admin = createClient(url, key, { auth: { persistSession: false } });

  // Find or create the user.
  const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  let userId = existing?.users.find((u) => u.email?.toLowerCase() === TEST_EMAIL.toLowerCase())?.id;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    });
    if (error) {
      console.error("Could not create user:", error.message);
      process.exit(1);
    }
    userId = data.user.id;
    console.log("Created test user:", userId);
  } else {
    console.log("Test user already exists:", userId);
  }

  // Mark the profile as a test account (column added by migration).
  const { error: profileErr } = await admin
    .from("profiles")
    .update({ is_test: true })
    .eq("id", userId);
  if (profileErr) console.error("Profile mark warning:", profileErr.message);

  // Enroll in the course.
  const { error: enrollErr } = await admin
    .from("course_enrollments")
    .upsert({ user_id: userId, course_id: courseId }, { onConflict: "user_id,course_id" });
  if (enrollErr) console.error("Enroll warning:", enrollErr.message);

  console.log("Done. Sign in with:", TEST_EMAIL, "/", TEST_PASSWORD);
}

main();
