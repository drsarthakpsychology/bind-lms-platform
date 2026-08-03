#!/usr/bin/env node
/**
 * anon-replay.mjs — unauthenticated anon-key replay (CVE-2025-48757 class).
 *
 * Usage:
 *   node anon-replay.mjs <supabase-url> <anon-key> [table ...]
 *
 * Replays the public anon key against each table via PostgREST. HTTP 200 with
 * a populated array = RLS is off (P0). Start every Supabase audit with this.
 * Works with plain Node — no deps, degrades to a manual-step message if fetch
 * is unavailable (Node <18).
 */
const url = process.argv[2];
const anonKey = process.argv[3];
const tables = process.argv.slice(4);

if (!url || !anonKey) {
  console.error("usage: node anon-replay.mjs <supabase-url> <anon-key> [table ...]");
  console.error("  (omit tables to list the OpenAPI schema first)");
  process.exit(1);
}
if (typeof fetch !== "function") {
  console.error("fetch unavailable (Node <18). Manually run:");
  console.error(`  curl -s '${url}/rest/v1/<table>?select=*' -H 'apikey: ${anonKey}' -H 'Authorization: Bearer ${anonKey}'`);
  process.exit(0);
}

const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` };

async function checkTable(table) {
  const r = await fetch(`${url}/rest/v1/${table}?select=*&limit=5`, { headers });
  const body = await r.text();
  let rows = 0;
  let array = false;
  try { const j = JSON.parse(body); array = Array.isArray(j); rows = array ? j.length : 0; } catch {}
  if (r.status === 200 && array && rows > 0) {
    console.log(`  ✗ P0  ${table}: anon can read ${rows}+ rows (RLS likely off).`);
  } else if (r.status === 200 && array && rows === 0) {
    console.log(`  ✓    ${table}: anon gets [] (gated or empty).`);
  } else {
    console.log(`  ✓    ${table}: HTTP ${r.status} (blocked).`);
  }
}

(async () => {
  if (tables.length === 0) {
    console.log("Listing tables via PostgREST OpenAPI…");
    try {
      const r = await fetch(`${url}/rest/v1/`, { headers });
      const body = await r.text();
      const defs = JSON.parse(body);
      const names = Object.keys(defs.paths || defs.definitions || {}).filter((k) => !k.startsWith("/rpc"));
      console.log(`  found ${names.length} resource paths. Re-run with table names:`);
      console.log(`  node anon-replay.mjs '${url}' '${anonKey}' ${names.slice(0, 30).join(" ")}`);
    } catch (e) {
      console.error("  could not read schema — pass table names explicitly.");
    }
    return;
  }
  console.log("== anon-key replay ==");
  for (const t of tables) await checkTable(t);
})();