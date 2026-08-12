#!/usr/bin/env tsx
/**
 * Seed 20 AI-vs-AI self-play transcripts (A3) so Dr. Sarthak has something
 * to blind-score before students exist.
 *
 *   npm run seed-calibration
 *
 * For each of 20 runs: pick a seed case, run 6-9 turns of fixture
 * Director→Actor dialogue (deterministic, no network), then write the
 * session + turns into sim_scores with a rubric that mimics a real debrief
 * (including a couple of deliberately imperfect transcripts so calibration
 * has disagreements to find).
 *
 * All rows are attributed to the calibration user id below (a synthetic
 * user, no profile row needed — the admin service role writes them and
 * calibration is admin-only).
 *
 * Idempotent: re-running replaces the previous calibration seeds (they are
 * training data for the agreement dashboard, not student records).
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (in .env.local).
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";

function loadEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  if (existsSync(".env.local")) {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) out[m[1]] = m[2].trim();
    }
  }
  return { ...process.env, ...out } as Record<string, string>;
}

const ENV = loadEnv();
const URL = ENV.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = ENV.SUPABASE_SERVICE_ROLE_KEY;

/** Synthetic calibration user — not a real student; used for all self-play runs. */
const CALIBRATION_EMAIL = "calibration@lumen.internal";
const CALIBRATION_USER = "00000000-0000-4000-8000-0000000000c1"; // overridden by the auth user id

// The seed cases' titles AS STORED IN THE DB (upserted from the TS seeds).
const CASE_TITLES = [
  "Ravi, 34 — 'the heaviness'",
  "Meera, 28 — 'my heart is racing'",
  "Arjun, 22 — 'unclean thoughts'",
  "Ananya, 15 — brought in, not walked in",
  "Suresh, 45 — 'I can stop any time'",
];

// A few rubric shapes — mostly good, a few with the classic novice errors so
// the calibration dashboard has real disagreement to surface.
const RUBRICS = [
  { score: 3.5, open_closed_ratio: 0.8, leading_questions: 0, double_barrelled: 0, reflective_statements: 4, premature_reassurance: 0, domain_coverage: 0.9, risk_timing: "appropriate", disclosure_unlock_rate: 0.8, idiom_decoding: true },
  { score: 2.0, open_closed_ratio: 0.4, leading_questions: 2, double_barrelled: 1, reflective_statements: 1, premature_reassurance: 2, domain_coverage: 0.5, risk_timing: "late", disclosure_unlock_rate: 0.3, idiom_decoding: false },
  { score: 1.5, open_closed_ratio: 0.2, leading_questions: 3, double_barrelled: 2, reflective_statements: 0, premature_reassurance: 3, domain_coverage: 0.4, risk_timing: "absent", disclosure_unlock_rate: 0.1, idiom_decoding: false },
  { score: 4.0, open_closed_ratio: 0.9, leading_questions: 0, double_barrelled: 0, reflective_statements: 5, premature_reassurance: 0, domain_coverage: 1.0, risk_timing: "appropriate", disclosure_unlock_rate: 1.0, idiom_decoding: true },
  { score: 2.5, open_closed_ratio: 0.5, leading_questions: 1, double_barrelled: 0, reflective_statements: 2, premature_reassurance: 1, domain_coverage: 0.6, risk_timing: "early", disclosure_unlock_rate: 0.5, idiom_decoding: true },
];

// Scripted self-play exchanges — the "AI vs AI" patient/student loop.
const SELF_PLAY: Array<{ student: string; patient: string }> = [
  { student: "Hello, how are you feeling today?", patient: "I don't know. Everything just feels heavy. Even getting up is hard." },
  { student: "Can you tell me more about that heaviness?", patient: "It's like a weight on my chest. It's been there for months. My wife says I should see a doctor." },
  { student: "What does a typical day look like for you right now?", patient: "I wake up, I lie there. I go to work, but I can't focus. At night I don't sleep — I just stare at the ceiling." },
  { student: "You mentioned the heaviness started months ago. What changed around then?", patient: "I got a promotion — more night shifts. I stopped eating properly. Started getting 'gas' and weakness, went to a clinic a few times." },
  { student: "Have you ever had thoughts of ending your life?", patient: "Sometimes I think it would be easier to not be here. But I wouldn't do anything. I promise." },
  { student: "That must be heavy to carry alone. What do you think is causing all this?", patient: "I don't know. My family says it's laziness. The clinic said acidity. Nobody has asked me this much before." },
  { student: "I can see this has been really difficult. Thank you for telling me.", patient: "Thank you for asking. Nobody has listened like this." },
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

async function main() {
  if (!URL || !SERVICE_KEY) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  const admin = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

  // The calibration user: an auth user whose only role is to own the
  // self-play transcripts (sim_sessions.user_id FKs to auth.users). Create
  // it if missing; re-run reuses the same id.
  const { data: existingUser } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  let calibrationUserId = CALIBRATION_USER;
  const found = (existingUser?.users ?? []).find((u) => u.email === CALIBRATION_EMAIL);
  if (found) {
    calibrationUserId = found.id;
  } else {
    const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
      email: CALIBRATION_EMAIL,
      password: "calib-seed-2026!",
      email_confirm: true,
      user_metadata: { calibration: true },
    });
    if (createErr) {
      console.error("Could not create calibration auth user:", createErr.message);
      process.exit(1);
    }
    calibrationUserId = newUser?.user?.id ?? CALIBRATION_USER;
  }
  // Ensure a profiles row exists (trigger usually handles this on signup).
  await admin.from("profiles").upsert({ id: calibrationUserId, email: CALIBRATION_EMAIL, role: "student" }, { onConflict: "id" }).then((r) => {
    if (r.error && !String(r.error.message).includes("violates")) console.warn("profile upsert:", r.error.message);
  });

  // Find the published seed cases in the DB.
  const { data: cases } = await admin
    .from("sim_cases")
    .select("id, title")
    .eq("status", "published")
    .in("title", CASE_TITLES);
  if (!cases || cases.length === 0) {
    console.error("No published seed cases found — run the app once or seed cases first.");
    process.exit(1);
  }
  const caseById = new Map(cases.map((c) => [c.title, c.id]));

  // Clean previous calibration seeds (idempotent).
  await admin.from("sim_scores").delete().eq("user_id", calibrationUserId);
  const { data: prevSessions } = await admin
    .from("sim_sessions")
    .select("id")
    .eq("user_id", calibrationUserId);
  if (prevSessions) {
    await admin.from("sim_turns").delete().in("session_id", prevSessions.map((s) => s.id));
    await admin.from("sim_sessions").delete().eq("user_id", calibrationUserId);
  }

  let written = 0;
  for (let i = 0; i < 20; i++) {
    const title = pick(CASE_TITLES, i);
    const caseId = caseById.get(title);
    if (!caseId) continue;
    const rubric = pick(RUBRICS, i * 7 + 3);
    // 6-9 turns depending on the run.
    const turnCount = 6 + (i % 4);
    const turns = SELF_PLAY.slice(0, turnCount);

    const { data: session, error: sessErr } = await admin
      .from("sim_sessions")
      .insert({
        case_id: caseId,
        user_id: calibrationUserId,
        status: "complete",
        difficulty: "cooperative",
        seed: JSON.stringify({ mood_today: "flat", recent_event: "promotion stress", most_defended_topic: "family", opening_posture: "came willingly", somatic_focus: "chest", trust_start: 3, language_mix: "Hinglish" }),
      })
      .select("id")
      .single();
    if (sessErr || !session) {
      console.error(`run ${i}: session insert failed`, sessErr?.message);
      continue;
    }
    const rows = turns.flatMap((t, ti) => [
      { session_id: session.id, user_id: calibrationUserId, role: "student" as const, content: t.student, content_type: "text" },
      { session_id: session.id, user_id: calibrationUserId, role: "patient" as const, content: t.patient, content_type: "text", state: { trust: Math.min(10, 3 + ti), turn_count: ti + 1 } },
    ]);
    const { error: turnErr } = await admin.from("sim_turns").insert(rows);
    if (turnErr) {
      console.error(`run ${i}: turn insert failed`, turnErr.message);
      continue;
    }

    const { error: scoreErr } = await admin.from("sim_scores").insert({
      session_id: session.id,
      user_id: calibrationUserId,
      case_id: caseId,
      rubric,
      overall: rubric.score,
      quotes: [
        { quote: "patient: I don't know. Everything just feels heavy.", better: "What does 'heavy' feel like, exactly — in your body or in your mood?" },
        { quote: `student: ${turns[3]?.student ?? "…"}`, better: "What changed for you around that time — sleep, work, family?" },
        { quote: "student: Have you ever had thoughts of ending your life?", better: "That was well timed — asked after rapport, in clear language." },
      ],
      missed_disclosures: rubric.disclosure_unlock_rate >= 0.8
        ? []
        : ["the patient would have told you about the debt if you'd asked openly about home"],
    });
    if (scoreErr) {
      console.error(`run ${i}: score insert failed`, scoreErr.message);
      continue;
    }
    written++;
    console.log(`  ✓ run ${i + 1}/20 — ${title} (${turnCount} turns, score ${rubric.score})`);
  }

  console.log(`\nSeeded ${written} AI-vs-AI calibration transcripts.`);
  console.log("Dr. Sarthak: open /admin/calibration to blind-score them.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
