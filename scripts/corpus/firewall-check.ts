#!/usr/bin/env tsx
/**
 * Casebook firewall smoke check — asserts the layer separation + licence gate
 * hold over the CURRENT corpus state (no DB needed).
 *
 *   npm run corpus:firewall
 *
 * Rules checked:
 *   1. style_patterns rows are dialogue texture only — none may contain
 *      clinical diagnostic markers.
 *   2. The pure functions in src/lib/corpus/layers.ts enforce both
 *      directions (style→clinical BLOCKED, clinical→patient-voice BLOCKED).
 *
 * Prints PASS/FAIL per rule; exit 1 on any failure.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { canServeLayerForQuery, assertLayerAllowsSource } from "../../src/lib/corpus/layers";

// Clinical markers that must NEVER appear in a style-pattern row (content-
// stripped dialogue texture uses none of these).
const CLINICAL_MARKERS = [
  "depression", "depressive", "anxiety", "panic", "psychosis", "psychotic",
  "schizophren", "bipolar", "mania", "delusion", "hallucinat", "diagnos",
  "medication", "antidepressant", "antipsychotic", "suicid", "self-harm",
  "trauma", "ptsd", "obsessive", "compulsive", "prescri", "dose",
];

function main() {
  let failed = 0;
  const check = (name: string, ok: boolean) => {
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
    if (!ok) failed++;
  };

  // 1) style_patterns are texture only.
  const stylePath = join(process.cwd(), "scripts/corpus/style-bank.json");
  let styleOk = true;
  if (existsSync(stylePath)) {
    const bank = JSON.parse(readFileSync(stylePath, "utf8")) as Array<{ pattern?: string; pattern_text?: string; text?: string }>;
    for (const row of bank) {
      const text = `${row.pattern ?? ""} ${row.pattern_text ?? ""} ${row.text ?? ""}`.toLowerCase();
      const hit = CLINICAL_MARKERS.find((m) => text.includes(m));
      if (hit) {
        console.log(`  style leak: "${hit}" in a style pattern`);
        styleOk = false;
        break;
      }
    }
  } else {
    console.log("  (style-bank.json absent — nothing to scan)");
  }
  check("style patterns contain no clinical markers", styleOk);

  // 2) the pure firewall functions enforce both directions.
  check("style → clinical query BLOCKED", canServeLayerForQuery("style", "clinical") === false);
  let clinicalVoiceBlocked = false;
  try {
    assertLayerAllowsSource("clinical", "patient_voice");
  } catch {
    clinicalVoiceBlocked = true;
  }
  check("clinical → patient voice BLOCKED", clinicalVoiceBlocked);

  if (failed > 0) {
    console.error(`\n${failed} firewall check(s) FAILED`);
    process.exit(1);
  }
  console.log("\nAll firewall checks passed — the layers are separated.");
}

main();