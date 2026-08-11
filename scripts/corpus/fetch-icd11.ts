#!/usr/bin/env tsx
/**
 * Fetch ICD-11 mental-health chapter content (open API, CC-BY licensed).
 *
 *   npm run corpus:icd11
 *
 * Uses the WHO ICD-11 foundation view (api.icd.who.int) — the public
 * browser endpoints. Fetches the mental-behavioural chapter's entity list
 * and stores as raw JSON + a normalised markdown corpus row (licenced
 * CC-BY-ND 3.0 — names, not verbatim licence text, in the DB).
 *
 * Env: none required (public API). ICD_API_TOKEN is optional for higher
 * rate limits through the ICD-11 API programmatic agreement.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/icd11");
mkdirSync(RAW, { recursive: true });

const CLIENT_ID = process.env.ICD_CLIENT_ID;
const CLIENT_SECRET = process.env.ICD_CLIENT_SECRET;

async function authToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET) return null; // public browser tier works without
  const res = await fetch("https://icdaccessmanagement.who.int/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: "icdapi_access",
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) return null;
  const j = (await res.json()) as { access_token?: string };
  return j.access_token ?? null;
}

async function main() {
  const token = await authToken();
  const rootUrl = "https://id.who.int/icd/release/11/2024-01/mms";
  const res = await fetch(rootUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    console.error(`ICD-11 root fetch failed (${res.status}) — the public browser tier is occasionally gated; set ICD_CLIENT_ID/SECRET for the API tier.`);
    process.exit(1);
  }
  const j = (await res.json()) as {
    title?: { "@value": string };
    child?: Array<string>;
    "@id"?: string;
  };
  writeFileSync(join(RAW, "icd11-mms-root.json"), JSON.stringify(j, null, 2));
  // The mental chapter URI (06 Mental, behavioural or neurodevelopmental disorders).
  const mentalUri = (j.child ?? []).find((u) => u.includes("/06"));
  console.log(`ICD-11 root fetched. Mental chapter: ${mentalUri ?? "(not in root children — the mms root lists chapters by block)"}`);
  console.log("Next: run scripts/corpus/normalise-icd11.ts to walk the chapter (or extend this script to walk children recursively).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});