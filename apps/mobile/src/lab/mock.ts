// MOCK DATA: design phase only. See docs/DESIGN.md, To connect.
/**
 * The Psychology Lab catalogue, copied from the website on 21 Nov 2026
 * (src/lib/lab/experiments.ts and experiments2.ts, without the educator-only
 * review notes). The app has no API for the Lab yet: see docs/CONNECT-blab.md.
 * What a student has run is kept on this phone only (./progress.ts).
 */
import raw from "./mock-data.json";

export type LabLevel = "Foundation" | "Intermediate" | "Advanced";
export type LabArea = "Memory" | "Attention" | "Perception" | "Learning" | "Thinking" | "Methods" | "Development" | "Social";
export type LabCheck = { q: string; options: string[]; answer: number; why: string };
export type LabExperiment = {
  id: string;
  num: number;
  title: string;
  area: LabArea;
  level: LabLevel;
  minutes: number;
  hook: string;
  question: string;
  steps: string[];
  finding: string;
  theory: string[];
  clinic: string[];
  evidence: { status: string; note: string };
  refs: string[];
  checks: LabCheck[];
  reflect: string;
  related: string[];
};
export type BiasCase = { id: string; text: string; bias: string; why: string; fixes: string[]; fix: number };
export type ConsItem = { id: string; task: string; child: string; age: number; says: string; stage: string; reason: string; why: string };
export type AttributionCase = { id: string; act: string; reveal: string };
export type CorrScenario = { id: string; kind: "third" | "reverse" | "fluke" | "restricted" | "rct"; headline: string; x: string; y: string; n: number; answer: string; why: string; behind: string; z?: string };

const D = raw as unknown as {
  experiments: LabExperiment[];
  BIASES: string[];
  BIAS_CASES: BiasCase[];
  CONS_TASK_TEXT: Record<string, { title: string; before: string; after: string; ask: string }>;
  CONS_ITEMS: ConsItem[];
  CONS_STAGES: string[];
  CONS_REASONS: string[];
  ATTRIBUTION_CASES: AttributionCase[];
  CORR_READINGS: string[];
  CORR_SCENARIOS: CorrScenario[];
};

export const EXPERIMENTS = D.experiments;
export const { BIASES, BIAS_CASES, CONS_TASK_TEXT, CONS_ITEMS, CONS_STAGES, CONS_REASONS, ATTRIBUTION_CASES, CORR_READINGS, CORR_SCENARIOS } = D;
export const experimentById = (id: string) => EXPERIMENTS.find((e) => e.id === id);
export const LAB_AREAS: LabArea[] = ["Memory", "Attention", "Perception", "Learning", "Thinking", "Methods", "Development", "Social"];
