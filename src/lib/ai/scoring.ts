/**
 * Debrief scoring — a SEPARATE model call with schema-validated JSON output
 * (Part 3.4 #4). Scores: open:closed ratio, leading/double-barrelled questions,
 * reflective statements, premature reassurance (the #1 novice error), domain
 * coverage, risk timing, disclosure unlock rate.
 *
 * Output quotes three specific moments from the transcript with a better
 * alternative, plus the missed-disclosures reveal. Never render unvalidated
 * output — parse with the Zod schema, one repair retry, else fixture.
 *
 * The feedback loop: faculty corrections (scoring_corrections) are injected as
 * few-shot examples into future scoring calls.
 */

import type { DebriefResult } from "./schemas";
import { debriefSchema } from "./schemas";
import { FIXTURE_DEBRIEF } from "./fixtures";
import { aiChat } from "./client";
import { buildScoringPrompt } from "./prompts/scoring";
import type { ScoringInput } from "./prompts/scoring";
export { buildScoringPrompt, type ScoringInput } from "./prompts/scoring";

export function scoreTranscript(input: ScoringInput): Promise<DebriefResult> {
  return aiChat(
    [
      { role: "system", content: "You are a rigorous clinical-skill scorer. Output valid JSON only." },
      { role: "user", content: buildScoringPrompt(input) },
    ],
    { workload: "debrief_scoring", schema: debriefSchema, temperature: 0.2, capability: "json" },
  ).then((res) => (res.json as DebriefResult) ?? FIXTURE_DEBRIEF);
}
