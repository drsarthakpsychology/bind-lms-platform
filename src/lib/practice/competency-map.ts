/**
 * Map a sim case's free-text rubric targets to the competency framework keys.
 * Each completed Consulting Room debrief credits these competencies in the
 * Skills Passport (competency_events, source 'sim').
 */

const MAP: Array<{ match: string; key: string }> = [
  { match: "risk", key: "risk_assessment" },
  { match: "safety", key: "risk_assessment" },
  { match: "suicid", key: "risk_assessment" },
  { match: "differential", key: "differential" },
  { match: "somatic", key: "differential" },
  { match: "psychoeducat", key: "psychoeducation" },
  { match: "validat", key: "therapeutic_alliance" },
  { match: "rapport", key: "therapeutic_alliance" },
  { match: "non-judgemental", key: "therapeutic_alliance" },
  { match: "stigma", key: "cultural_attunement" },
  { match: "cultural", key: "cultural_attunement" },
  { match: "religious", key: "cultural_attunement" },
  { match: "confidentiality", key: "ethics" },
  { match: "consent", key: "ethics" },
  { match: "engaging", key: "clinical_interviewing" },
  { match: "eliciting", key: "clinical_interviewing" },
  { match: "explor", key: "clinical_interviewing" },
  { match: "roll", key: "clinical_interviewing" },
  { match: "motivational", key: "clinical_interviewing" },
  { match: "avoidance", key: "clinical_interviewing" },
  { match: "crisis", key: "crisis_management" },
  { match: "managing the parent", key: "cultural_attunement" },
];

/** Map rubric targets to competency keys (deduped, order preserved). */
export function rubricToCompetencyKeys(targets: string[]): string[] {
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const t of targets) {
    const tl = t.toLowerCase();
    for (const m of MAP) {
      if (tl.includes(m.match) && !seen.has(m.key)) {
        seen.add(m.key);
        keys.push(m.key);
      }
    }
  }
  return keys;
}
