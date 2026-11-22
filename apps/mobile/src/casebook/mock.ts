// MOCK DATA: design phase only. See docs/DESIGN.md, To connect.
/**
 * A sample of the website's Casebook (src/content/casebook/*.ts, copied on
 * 21 Nov 2026): two activities of each of the eight formats, twelve items at
 * most in each, without the educator-only source notes. The app has no API
 * for the Casebook yet: see docs/CONNECT-blab.md.
 */
import raw from "./mock-data.json";
import type { CaseActivity } from "./types";

type Shown = CaseActivity extends infer A ? (A extends unknown ? Omit<A, "bookRef" | "reviewFlags"> : never) : never;
export type Case = Shown;
export const CASEBOOK = raw as unknown as Case[];
export const caseById = (id: string) => CASEBOOK.find((c) => c.id === id);

/** The study module a case belongs to, in plain words. */
export const MODULE_NAME: Record<string, string> = {
  "interview-mse": "Interview and mental state",
  "ethics-law": "Ethics and law",
  "medicine-profiles": "Medicines",
  antipsychotics: "Antipsychotics",
  stabilisers: "Mood stabilisers",
  antidepressants: "Antidepressants",
  substance: "Substance use",
  assessment: "Assessment",
  anxiety: "Anxiety",
};
export const moduleName = (id: string) => MODULE_NAME[id] ?? id.replace(/-/g, " ").replace(/^./, (x) => x.toUpperCase());
