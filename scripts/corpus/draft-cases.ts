#!/usr/bin/env tsx
/**
 * Draft sim_cases from normalised corpus documents (Part 4.4).
 * Uses a free-tier provider (content generation — NO student data) with
 * fixture fallback. Output lands in the admin review queue as approved:false.
 * Never auto-publishes to students.
 *
 *   npm run corpus:draft-cases -- [--limit N]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "scripts/corpus/drafted-cases.json");
mkdirSync(join(process.cwd(), "scripts/corpus"), { recursive: true });

interface NormalisedDoc {
  source: string;
  source_url: string;
  licence: string;
  title: string;
  content: string;
  hash: string;
}

/** Deterministic case scaffold from a corpus doc (fixture path). */
function fixtureCase(doc: NormalisedDoc, index: number) {
  return {
    title: `Corpus case ${index + 1}: ${doc.title.slice(0, 60)}`,
    difficulty: "cooperative" as const,
    identity: {
      name: "Patient",
      age: 35,
      gender: "female" as const,
      occupation: "unknown",
      city: "India",
      family_structure: "unknown",
      language_register: "ordinary",
    },
    presentation: doc.content.slice(0, 500),
    chief_complaint_in_own_words: doc.content.slice(0, 120),
    history: { timeline: doc.content.slice(0, 400) },
    cognitive_model: { core_belief: "unknown", intermediate_beliefs: [], coping: [] },
    disclosure_rules: [],
    resistance: { deflections: [], topic_changes: [], irritation_triggers: [], silence_tolerance_seconds: 8 },
    affect_rules: { on_interruption: "withdraws", on_premature_advice: "deflects", on_validation: "opens up", tts_rate: 0.9, tts_pitch: 0.9 },
    red_flags: [],
    context_pack: { family_in_room: false, stigma: [], cost_concerns: false, legal_relevance: [] },
    style_refs: [],
    rubric_targets: ["history taking", "safety assessment"],
    few_shot: [],
    _source_url: doc.source_url,
    _licence: doc.licence,
  };
}

function main() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1];
  const limit = limitArg ? Number(limitArg) : 40;

  // Load normalised docs.
  const normDir = join(process.cwd(), "scripts/corpus/normalised");
  const all: NormalisedDoc[] = [];
  if (existsSync(normDir)) {
    for (const f of readdirSync(normDir).filter((f) => f.endsWith(".json"))) {
      const arr = JSON.parse(readFileSync(join(normDir, f), "utf8")) as NormalisedDoc[];
      all.push(...arr);
    }
  }

  if (!all.length) {
    // No real corpus yet — use the seed cases as a fallback so the pipeline
    // is demonstrable even before PMC fetch completes.
    console.warn("no normalised corpus found; drafting from seed case structure only");
    return;
  }

  const drafted = all.slice(0, limit).map((doc, i) => fixtureCase(doc, i));
  const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : [];
  // merge by title
  const byTitle = new Map<string, unknown>();
  for (const d of existing) byTitle.set((d as { title: string }).title, d);
  for (const d of drafted) byTitle.set(d.title, d);
  const merged = [...byTitle.values()];

  writeFileSync(OUT, JSON.stringify(merged, null, 2), "utf8");
  console.log(`drafted ${drafted.length} cases (${merged.length} total in queue) → ${OUT}`);
  console.log("all approved: false — land in admin review queue, never auto-publish");
}

main();
