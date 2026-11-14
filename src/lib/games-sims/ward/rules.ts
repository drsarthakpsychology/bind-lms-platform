/**
 * Ward Week's names, labels and the shapes the browser holds, with no
 * campaign data in this file, so the game screen can import it without
 * carrying the answers. The campaigns are read on the server only
 * (campaigns*.ts, engine.ts, deal.ts).
 */
export type Vars = { risk: number; trust: number; insight: number; family: number; adherence: number };
export type VarKey = keyof Vars;
export type Quality = "best" | "ok" | "poor" | "harm";
export type DecisionKind = "assessment" | "risk" | "referral" | "psychoeducation" | "family" | "medicines";

export const KIND_LABEL: Record<DecisionKind, string> = {
  assessment: "Assessment",
  risk: "Risk",
  referral: "Referral",
  psychoeducation: "Explaining it",
  family: "Family meeting",
  medicines: "Medicines, with the psychiatrist",
};

export const VAR_LABEL: Record<VarKey, string> = { risk: "Risk", trust: "Trust", insight: "Insight", family: "Family support", adherence: "Sticking with care" };

export const QUALITY_LABEL: Record<Quality, string> = { best: "Strong choice", ok: "Reasonable", poor: "Weak choice", harm: "Harmful choice" };

/** Dials where a lower number is the better one. */
export const LOWER_IS_BETTER: ReadonlySet<VarKey> = new Set<VarKey>(["risk"]);

/** Did this change help? (+1 better, -1 worse, 0 no change.) */
export function deltaSign(k: VarKey, delta: number): -1 | 0 | 1 {
  if (!delta) return 0;
  const up = delta > 0 ? 1 : -1;
  return (LOWER_IS_BETTER.has(k) ? -up : up) as -1 | 1;
}

/** A campaign on the pick screen. */
export type CampaignCard = { id: string; title: string; patient: string; place: string; blurb: string; sessions: number; level: number };

/** The story as the browser sees it now: the session, its beats, the decision in play (options without their quality or effect) and the dials. */
export type Scene = {
  title: string;
  patient: string;
  note: string | null;
  sessions: number;
  chapter: number;
  chapterTitle: string;
  beats: string[];
  decision: { kind: DecisionKind; prompt: string; options: { id: string; text: string }[] } | null;
  vars: Vars;
  step: number;
  done: boolean;
};

/** What a decision shows once it is made: the session it was made in, the choice, why, and the strongest call. */
export type WardReveal = {
  chapter: number;
  chapterTitle: string;
  beats: string[];
  kind: DecisionKind;
  skill: string;
  letter: string;
  text: string;
  q: Quality;
  why: string;
  best: { text: string; why: string } | null;
  before: Vars;
  after: Vars;
  voters: number | null;
};

/** The ending and every call, looking back. */
export type WardEnd = {
  title: string;
  text: string;
  score: number;
  vars: Vars;
  log: { chapter: number; kind: DecisionKind; prompt: string; text: string; q: Quality; best: string | null }[];
};
