/** The Psychology Lab's shapes: the website's own (src/lib/lab/experiments.ts, experiments2.ts), as GET /lab sends them. */
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

export const LAB_AREAS: LabArea[] = ["Memory", "Attention", "Perception", "Learning", "Thinking", "Methods", "Development", "Social"];

/** What the runners need, the website's lists. */
export type LabLists = {
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
/** One stored Lab record (server: src/lib/app-api/lab.ts LabRecordOut). */
export type LabRecord = { runs: number; last: string; result: Record<string, number>; check: { right: number; total: number } | null; recheckDue: string | null; reflected: boolean };
/** GET /lab */
export type LabHome = { v: 1; today: string; experiments: LabExperiment[]; data: LabLists; records: Record<string, LabRecord> };
/** POST /lab/:id/run, /check, /reflect and /casebook/:id/done */
export type LabWrite = { v: 1; record: LabRecord };
