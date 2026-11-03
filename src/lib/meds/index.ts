import { ANTIDEPRESSANTS } from "./antidepressants";
import { ANTIPSYCHOTICS } from "./antipsychotics";
import { OTHERS, SLEEP_ANXIETY, STABILISERS } from "./others";
import type { Med, MedGroup } from "./types";

export const MEDS: Med[] = [...ANTIDEPRESSANTS, ...ANTIPSYCHOTICS, ...STABILISERS, ...SLEEP_ANXIETY, ...OTHERS];
export const GROUPS: MedGroup[] = ["Antidepressants", "Antipsychotics", "Mood stabilisers", "Anxiety and sleep", "ADHD, dementia and addiction", "Side-effect medicines"];

export function medById(id: string): Med | undefined {
  return MEDS.find((m) => m.id === id);
}

export { searchMeds, type MedIndexRow } from "./search";
import type { MedIndexRow } from "./search";

export function medIndex(): MedIndexRow[] {
  return MEDS.map((m) => ({ id: m.id, name: m.name, cls: m.cls, group: m.group, brands: m.brands, uses: m.uses, line: m.standout[0] ?? "" }));
}

export type { Med, MedGroup, Dose } from "./types";
