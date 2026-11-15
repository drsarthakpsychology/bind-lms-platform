import type { MedGroup } from "./types";

/**
 * One colour per medicine family (tokens in globals.css). Used only as a thin
 * spine or a dot beside the family's name, never as the colour of text, so
 * nothing depends on telling the colours apart.
 */
export const GROUP_COLOR: Record<MedGroup, string> = {
  Antidepressants: "var(--med-antidepressants)",
  Antipsychotics: "var(--med-antipsychotics)",
  "Mood stabilisers": "var(--med-mood)",
  "Anxiety and sleep": "var(--med-anxiety)",
  "ADHD, dementia and addiction": "var(--med-other)",
  "Side-effect medicines": "var(--med-side)",
};
