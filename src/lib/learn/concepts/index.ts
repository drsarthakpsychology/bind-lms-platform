import { DISORDERS, PSYCHOPATHOLOGY } from "./clinical";
import { NEURO, PHARM } from "./science";
import { ASSESSMENT, COUNSELLING, ETHICS, LAW, THERAPY } from "./practice";
import type { Concept } from "./types";

export * from "./types";

export const ALL_CONCEPTS: Concept[] = [...PSYCHOPATHOLOGY, ...DISORDERS, ...NEURO, ...PHARM, ...THERAPY, ...COUNSELLING, ...ASSESSMENT, ...ETHICS, ...LAW];

const BY_ID = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));
export function conceptById(id: string): Concept | undefined {
  return BY_ID.get(id);
}
