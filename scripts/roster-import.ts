#!/usr/bin/env tsx
/**
 * Roster import CLI — provision student accounts from a name,email CSV.
 *
 *   npm run roster:import -- scripts/roster/roster.csv          (real run)
 *   npm run roster:import -- scripts/roster/roster.csv --dry-run  (report only)
 *   npm run roster:import -- scripts/roster/roster.csv --scope lectures_only
 *
 * Uses the same shared logic as the admin server action (src/lib/auth/roster.ts).
 * Defaults to scope "lectures_only" (the lecture-only cohort). Emails send only
 * if RESEND_API_KEY / RESEND_FROM_EMAIL are configured; otherwise the run
 * creates accounts and logs invite links for manual distribution.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, (optional)
 *      RESEND_API_KEY, RESEND_FROM_EMAIL, NEXT_PUBLIC_APP_URL.
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { parseRosterCsv, provisionRoster } from "../src/lib/auth/roster";

const argv = process.argv.slice(2);
const path = argv.find((a) => !a.startsWith("--")) ?? "scripts/roster/roster.csv";
const dryRun = argv.includes("--dry-run");
const scopeFlag = argv.find((a) => a.startsWith("--scope="));
const scope = scopeFlag ? scopeFlag.split("=")[1] : "lectures_only";

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

async function sendResend(to: string, subject: string, body: string): Promise<boolean> {
  const env = loadEnv();
  const key = env.RESEND_API_KEY;
  const from = env.RESEND_FROM_EMAIL ?? "Welcome <welcome@plms.local>";
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text: body }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  if (!existsSync(path)) {
    console.error(`Roster CSV not found: ${path}`);
    process.exit(1);
  }

  const text = readFileSync(path, "utf8");
  const parsed = parseRosterCsv(text);
  const appUrl = env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";
  const hasResend = Boolean(env.RESEND_API_KEY);

  console.log(dryRun ? "DRY RUN — no accounts created, no emails sent" : "REAL RUN");
  console.log(`roster: ${path} · scope: ${scope} · rows: ${parsed.rows.length}`);
  if (!hasResend) console.log("note: RESEND_API_KEY not set — emails will NOT send (invite links logged instead)");

  const admin = createClient(url, key, { auth: { persistSession: false } });
  const report = await provisionRoster(parsed.rows, {
    admin,
    scope,
    appUrl,
    sendEmail: hasResend ? sendResend : undefined,
    dryRun,
  });

  console.log("\n--- REPORT ---");
  console.log(`rows read:        ${parsed.rows.length}`);
  console.log(`created:          ${report.created}`);
  console.log(`duplicates:       ${parsed.duplicates.length + report.duplicatesSkipped}`);
  console.log(`invalid emails:   ${parsed.invalid.length}`);
  console.log(`emails sent:      ${report.emailsSent}`);
  console.log(`emails failed:    ${report.emailsFailed}`);
  console.log(`empty names:      ${parsed.emptyNames.length}`);

  for (const f of [...parsed.invalid, ...parsed.duplicates, ...report.failures]) {
    console.log(`  SKIP row ${f.row || "?"}: ${f.email} — ${f.reason}`);
  }
  if (!dryRun && !hasResend) {
    console.log("\nInvite links (send these manually until Resend is configured):");
    for (const c of report.createdAccounts) {
      console.log(`  ${c.email}  ${c.inviteUrl ?? "(no link minted)"}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
