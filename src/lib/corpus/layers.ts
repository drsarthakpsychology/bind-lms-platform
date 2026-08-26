/**
 * Casebook layer firewall + licence gate — enforced in code, tested.
 *
 * Four separated layers. The separation is the whole design:
 *   - A STYLE chunk can never be returned for a clinical query or supply a
 *     fact (style is dialogue texture only, never clinical authority).
 *   - A CLINICAL chunk can never be used to VOICE a patient — that is what
 *     makes simulated patients sound like textbooks.
 *   - PHENOMENOLOGICAL feeds how symptoms are experienced and described.
 *   - CULTURAL feeds opening lines, attributions, family dynamics — never
 *     overrides clinical truth.
 */

export type CorpusLayer = "clinical" | "phenomenological" | "style" | "cultural";

export type QueryKind = "clinical" | "phenomenological" | "cultural" | "dialogue_craft";

export type ContentUse =
  | "ground_truth"
  | "scoring"
  | "quiz_rationale"
  | "patient_voice"
  | "opening_line"
  | "family_dynamics"
  | "hesitation_pattern";

/** STYLE can never serve a clinical query — it supplies no facts. */
export function canServeLayerForQuery(layer: CorpusLayer, queryKind: QueryKind): boolean {
  if (queryKind === "clinical") return layer !== "style";
  if (queryKind === "dialogue_craft") return layer === "style" || layer === "phenomenological" || layer === "cultural";
  // phenomenological / cultural queries: any layer except style-as-authority.
  return layer !== "style";
}

/**
 * The layer/use firewall. Throws when a layer is asked to do what it must
 * never do:
 *   - clinical → patient_voice (textbook-voiced patients) — BLOCKED
 *   - style → ground_truth / scoring / quiz_rationale (style as fact) — BLOCKED
 */
export function assertLayerAllowsSource(layer: CorpusLayer, usedFor: ContentUse): void {
  if (layer === "clinical" && usedFor === "patient_voice") {
    throw new Error(
      "layer firewall: CLINICAL content can never voice a patient — that is what makes simulated patients sound like textbooks",
    );
  }
  if (layer === "style" && (usedFor === "ground_truth" || usedFor === "scoring" || usedFor === "quiz_rationale")) {
    throw new Error(
      "layer firewall: STYLE content can never supply a clinical fact (ground truth / scoring / quiz rationale)",
    );
  }
}