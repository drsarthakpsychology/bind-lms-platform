import type { Med } from "./types";

/**
 * Where a medicine is taught in Study: the module a student should open from
 * the medicine's page ("Medicines, then the medicine, then related Study").
 * By the medicine's group, with the few groups that span topics split by
 * medicine. Pure: the page checks the module exists before linking.
 */
const BY_ID: Record<string, string> = {
  // Addiction medicines are taught with substance use.
  naltrexone: "substance",
  acamprosate: "substance",
  disulfiram: "substance",
  buprenorphine: "substance",
  // Dementia medicines with the neurocognitive disorders.
  donepezil: "neurocognitive",
  memantine: "neurocognitive",
  // ADHD medicines with child and adolescent mental health.
  methylphenidate: "child",
  atomoxetine: "child",
};

const BY_GROUP: Record<Med["group"], string> = {
  Antidepressants: "antidepressants",
  Antipsychotics: "antipsychotics",
  "Mood stabilisers": "stabilisers",
  "Anxiety and sleep": "stabilisers",
  // Taught where the side effects they treat are taught (movement side effects).
  "Side-effect medicines": "antipsychotics",
  "ADHD, dementia and addiction": "medicine-profiles",
};

/** The Study module id for a medicine, or the medicine-by-medicine module. */
export function studyModuleFor(med: Pick<Med, "id" | "group">): string {
  return BY_ID[med.id] ?? BY_GROUP[med.group] ?? "medicine-profiles";
}
