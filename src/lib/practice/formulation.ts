/**
 * Formulation Forge (Part 6.2) — 5P grid.
 * Presenting / Predisposing / Precipitating / Perpetuating / Protective.
 * Stage 1: sort factor cards (with distractors that belong nowhere).
 * Stage 2: write the narrative. Stage 3: diff against the model — a diff, not
 * a grade. Stage 4: extract factors from a raw transcript (their own CR turn).
 *
 * Mobile: tap-to-select-then-tap-to-place fallback for drag-and-drop.
 */

export const FIVE_P = ["presenting", "predisposing", "precipitating", "perpetuating", "protective"] as const;
export type FiveP = (typeof FIVE_P)[number];

export interface FormulationFactor {
  id: string;
  text: string;
  bucket: FiveP | "distractor";
}

/** A seed case with model answer (Dr. Sarthak's formulation). */
export const SEED_FORMULATION = {
  id: "form-1",
  title: "Ravi — 'the heaviness' (somatic depression)",
  prompt: "Sort the factors into the 5P grid. Leave distractors out.",
  factors: [
    { id: "f1", text: "Body ache, heaviness, poor sleep, 6kg weight loss", bucket: "presenting" as const },
    { id: "f2", text: "Promotion added night shifts 8 months ago", bucket: "precipitating" as const },
    { id: "f3", text: "Father had a 'nervous breakdown' in his 40s", bucket: "predisposing" as const },
    { id: "f4", text: "Avoids talking about feelings; keeps working while exhausted", bucket: "perpetuating" as const },
    { id: "f5", text: "Supportive wife who 'keeps asking'", bucket: "protective" as const },
    { id: "f6", text: "GP visits for 'gas' and 'weakness' without improvement", bucket: "perpetuating" as const },
    { id: "f7", text: "Core belief: 'I am failing my family'", bucket: "predisposing" as const },
    { id: "f8", text: "The weather is unusually hot this summer", bucket: "distractor" as const },
    { id: "f9", text: "Employee has a steady job and a roof", bucket: "protective" as const },
    { id: "f10", text: "Two-year help-seeking delay before any mental-health contact", bucket: "perpetuating" as const },
  ],
  modelNarrative:
    "Ravi presents with somatic depression: 8 months of body ache, broken sleep and weight loss following a promotion that added night shifts (precipitant). A family history of paternal 'nervous breakdown' and a core belief of failing his family (predisposing) shape his coping: he avoids disclosing distress and keeps working through exhaustion (perpetuating), and a two-year help-seeking delay reinforced it. Protective factors include a supportive wife and stable employment. The formulation explains why he presents somatically — the heaviness is the only acceptable language his belief system permits for distress.",
};

export interface SortAttempt {
  factorId: string;
  bucket: FiveP | "distractor" | null;
}

/** Score a sort attempt against the model. Returns fraction correct. */
export function scoreSort(attempt: SortAttempt[], factors: FormulationFactor[]): number {
  if (!attempt.length) return 0;
  let correct = 0;
  for (const a of attempt) {
    const f = factors.find((x) => x.id === a.factorId);
    if (f && a.bucket === f.bucket) correct++;
  }
  return correct / attempt.length;
}

/** Extract a simple factor-word diff between student and model narrative. */
export function diffNarratives(student: string, model: string): { missing: string[]; present: string[] } {
  const words = (s: string) => new Set(s.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 4));
  const sw = words(student);
  const mw = words(model);
  const missing = [...mw].filter((w) => !sw.has(w)).slice(0, 12);
  const present = [...mw].filter((w) => sw.has(w)).slice(0, 12);
  return { missing, present };
}
