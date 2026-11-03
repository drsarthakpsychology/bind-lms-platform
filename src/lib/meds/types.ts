/**
 * The medicine reference (Practice → Medicines). Hand-written, one profile per
 * medicine, so every medicine reads differently. Doses are typical adult oral
 * doses for learning; the prescriber decides for each patient.
 */
export type MedGroup = "Antidepressants" | "Antipsychotics" | "Mood stabilisers" | "Anxiety and sleep" | "ADHD, dementia and addiction" | "Side-effect medicines";

export type Dose = {
  /** What the chip says, for example "50 mg" or "0.6 to 1.0 mmol/L". */
  amount: string;
  /** Start, usual, higher, maximum, low dose, and so on. */
  label: string;
  /** What this dose is used for. */
  use: string;
  /** Plain words for students. */
  student: string;
  /** Detail for clinicians. */
  clinician: string;
  /** What to look out for at this dose. */
  watch?: string[];
};

export type Med = {
  id: string;
  name: string;
  /** Common Indian brand names (examples). */
  brands: string[];
  group: MedGroup;
  cls: string;
  /** Strengths it comes in. */
  forms: string;
  student: string;
  clinician: string;
  /** What sets this one apart from the others in its class. */
  standout: string[];
  uses: string[];
  doses: Dose[];
  /** Index of the dose chip selected first. */
  defaultDose: number;
  common: string[];
  serious: string[];
  checks: string[];
  interactions: string[];
  groups: { label: string; text: string }[];
  tell: string[];
  related: string[];
};
