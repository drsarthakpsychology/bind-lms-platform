#!/usr/bin/env tsx
/**
 * Roster import CLI — IMPORT and SEND are separate steps.
 *
 *   npm run roster:import -- scripts/roster/roster.csv            (import only)
 *   npm run roster:import -- scripts/roster/roster.csv --dry-run   (report only)
 *   npm run roster:import -- scripts/roster/roster.csv --scope lectures_only
 *   npm run roster:import -- --send                              (send all pending)
 *   npm run roster:import -- --send a@x.com b@y.com              (send specific)
 *
 * Import creates accounts (scope=lectures_only by default) and records them as
 * PENDING credential emails — it never emails. Sending is a separate explicit
 * step. Emails go through the real Resend path (RESEND_API_KEY / RESEND_FROM_EMAIL).
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, (optional)
 *      RESEND_API_KEY, RESEND_FROM_EMAIL, NEXT_PUBLIC_APP_URL.
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import {
  parseRosterCsv,
  importRoster,
  sendCredentialEmails,
  sendResendEmail,
} from "../src/lib/auth/roster";

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const sendMode = argv.includes("--send");
const scopeFlag = argv.find((a) => a.startsWith("--scope="));
const scope = scopeFlag ? scopeFlag.split("=")[1] : "lectures_only";
const positional = argv.filter((a) => !a.startsWith("--"));
const path = sendMode ? "" : positional[0] ?? "scripts/roster/roster.csv";

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

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  const admin = createClient(url, key, { auth: { persistSession: false } });
  const appUrl = env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";

  if (sendMode) {
    // SEND mode — explicit, separate from import.
    const emails = positional.length ? positional : [];
    if (!emails.length) {
      const { data: pending } = await admin
        .from("credential_invites")
        .select("email")
        .eq("status", "pending");
      emails.push(...(pending ?? []).map((p) => p.email));
    }
    if (!emails.length) {
      console.log("No pending credential emails to send.");
      process.exit(0);
    }
    console.log(`Sending credential emails to ${emails.length} address(es)…`);
    if (env.RESEND_API_KEY) {
      const r = await sendCredentialEmails(emails, { admin, appUrl, sendEmail: sendResendEmail });
      console.log(`sent ${r.sent}, failed ${r.failed}`);
      for (const x of r.results) console.log(`  ${x.ok ? "✓" : "✗"} ${x.email}${x.reason ? ` — ${x.reason}` : ""}`);
    } else {
      console.log("RESEND_API_KEY not set — emails will NOT send.");
    }
    process.exit(0);
  }

  // IMPORT mode.
  if (!existsSync(path)) {
    console.error(`Roster CSV not found: ${path}`);
    process.exit(1);
  }
  const text = readFileSync(path, "utf8");
  const parsed = parseRosterCsv(text);

  console.log(dryRun ? "DRY RUN — no accounts created" : "IMPORT (no email)");
  console.log(`roster: ${path} · scope: ${scope} · rows: ${parsed.rows.length}`);

  const report = await importRoster(parsed.rows, { admin, scope, dryRun });

  console.log("\n--- REPORT ---");
  console.log(`rows read:        ${parsed.rows.length}`);
  console.log(`created (pending): ${report.created}`);
  console.log(`duplicates:       ${parsed.duplicates.length + report.duplicatesSkipped}`);
  console.log(`invalid emails:   ${parsed.invalid.length}`);
  console.log(`empty names:      ${parsed.emptyNames.length}`);
  console.log("\nNext: review the batch, then run `npm run roster:import -- --send`.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
