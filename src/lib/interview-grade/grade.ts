/**
 * Graded interview: rule checklist + one grader model call, combined into a
 * rubric with specific feedback. The model call is injected (tests mock it;
 * the route passes the platform's aiChat on the student-data lane). If the
 * model is off or fails, the checklist parts are still graded and the MSE and
 * formulation say plainly that they weren't checked.
 */
import { cleanDeep, cleanStudentText } from "@/lib/ai/student-text";
import type { Attempt } from "@/lib/learn/model/student";
import { rapportFromCounts, riskScore, runChecklist } from "./checklist";
import { buildGraderPrompt, GRADER_SYSTEM, type CaseFacts } from "./prompt";
import { MSE_DOMAINS, modelGradeSchema, type InterviewGrade, type ModelGrade, type RiskLevel, type Submission, type Verdict } from "./types";

export type GraderChat = (messages: { role: "system" | "user"; content: string }[]) => Promise<{ json?: unknown; text: string; provider: string }>;

const VERDICT_SCORE: Record<Verdict, number> = { accurate: 1, partly: 0.5, inaccurate: 0, missing: 0, not_checked: 0 };
const LEVEL_RANK: Record<Exclude<RiskLevel, "unsure">, number> = { low: 0, moderate: 1, high: 2 };

/** Weights of the overall score (sum 1). */
export const WEIGHTS = { history: 0.25, rapport: 0.15, risk: 0.25, mse: 0.2, formulation: 0.15 };

const round = (x: number) => Math.round(x * 100) / 100;

async function askModel(chat: GraderChat, prompt: string): Promise<{ grade: ModelGrade; provider: string } | null> {
  try {
    const res = await chat([
      { role: "system", content: GRADER_SYSTEM },
      { role: "user", content: prompt },
    ]);
    if (res.provider === "fixture") return null;
    const parsed = modelGradeSchema.safeParse(res.json ?? safeJson(res.text));
    return parsed.success ? { grade: cleanDeep(parsed.data), provider: res.provider } : null;
  } catch {
    return null;
  }
}

function safeJson(text: string): unknown {
  const a = text.indexOf("{");
  const b = text.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try {
    return JSON.parse(text.slice(a, b + 1));
  } catch {
    return null;
  }
}

function list(xs: string[]): string {
  if (xs.length <= 1) return xs.join("");
  return `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}

export async function gradeInterview(input: {
  facts: CaseFacts;
  transcript: { role: "student" | "patient"; content: string }[];
  submission: Submission;
  chat: GraderChat | null;
}): Promise<InterviewGrade> {
  const checklist = runChecklist(input.transcript);
  const model = input.chat ? await askModel(input.chat, buildGraderPrompt({ ...input, checklist })) : null;
  const m = model?.grade ?? null;

  const hAsked = checklist.history.filter((x) => x.asked);
  const hMissed = checklist.history.filter((x) => !x.asked);
  const historyScore = checklist.history.length ? hAsked.length / checklist.history.length : 0;
  const historyFeedback = hMissed.length
    ? `You covered ${hAsked.length} of ${checklist.history.length} key areas. Next time also ask about ${list(hMissed.slice(0, 4).map((x) => x.label.toLowerCase()))}.`
    : `You covered all ${checklist.history.length} key history areas.`;

  const rAsked = checklist.risk.filter((x) => x.asked);
  const rMissed = checklist.risk.filter((x) => !x.asked);
  const coreAsked = checklist.risk.find((x) => x.id === "death-thoughts")?.asked ?? false;
  const yourLevel = input.submission.risk.level;
  const expectedLevel: RiskLevel | null = m ? m.risk.expected_level : null;
  const levelOk = expectedLevel && yourLevel !== "unsure" ? Math.abs(LEVEL_RANK[yourLevel] - LEVEL_RANK[expectedLevel as keyof typeof LEVEL_RANK]) === 0 : expectedLevel ? false : null;
  const riskBase = riskScore(checklist.risk);
  const riskTotal = levelOk === null ? riskBase : riskBase * 0.8 + (levelOk ? 0.2 : 0);
  const riskFeedback =
    m?.risk.feedback ??
    (coreAsked
      ? `You asked about thoughts of death. ${rMissed.length ? `Follow up next time with ${list(rMissed.slice(0, 3).map((x) => x.label.toLowerCase()))}.` : "Your follow-up questions were complete."}`
      : "You didn't ask about thoughts of death or suicide. Ask it plainly and kindly in every interview, for example: \"Sometimes when people feel this low they think about ending their life. Has that happened to you?\"");

  const rapportScore = m ? m.rapport.score : rapportFromCounts(checklist.rapport);
  const rapportFeedback =
    m?.rapport.feedback ??
    `${checklist.rapport.reflections} reflection${checklist.rapport.reflections === 1 ? "" : "s"} and ${checklist.rapport.openQuestions} open question${checklist.rapport.openQuestions === 1 ? "" : "s"} out of ${checklist.rapport.questions}.${checklist.rapport.reassurance.length ? " Watch early reassurance: explore before you comfort." : ""}`;

  const domains = MSE_DOMAINS.map((d) => {
    const got = m?.mse.find((x) => x.domain === d.id);
    const blank = !input.submission.mse[d.id];
    const verdict: Verdict = got ? got.verdict : blank ? "missing" : "not_checked";
    const feedback = got ? got.feedback : blank ? "Left blank." : "Not checked: the AI marker wasn't available.";
    return { domain: d.id, label: d.label, verdict, feedback };
  });
  const mseScore = m ? domains.reduce((a, d) => a + VERDICT_SCORE[d.verdict], 0) / domains.length : null;
  const formulationScore = m ? m.formulation.score / 4 : null;

  // Overall: parts the AI couldn't check are left out and the rest re-weighted.
  const parts: [number | null, number][] = [
    [historyScore, WEIGHTS.history],
    [rapportScore / 4, WEIGHTS.rapport],
    [riskTotal, WEIGHTS.risk],
    [mseScore, WEIGHTS.mse],
    [formulationScore, WEIGHTS.formulation],
  ];
  const used = parts.filter((p): p is [number, number] => p[0] !== null);
  const wsum = used.reduce((a, [, w]) => a + w, 0);
  const overall = Math.round((100 * used.reduce((a, [s, w]) => a + s * w, 0)) / (wsum || 1));

  const summary =
    m?.summary ??
    (coreAsked
      ? `Your history covered ${hAsked.length} of ${checklist.history.length} key areas and you asked about risk. The MSE and formulation weren't checked this time.`
      : `Your history covered ${hAsked.length} of ${checklist.history.length} key areas. The most important next step: always ask about thoughts of suicide.`);

  return {
    overall,
    parts: {
      history: { score: round(historyScore), asked: hAsked, missed: hMissed, feedback: cleanStudentText(historyFeedback) },
      rapport: { score: rapportScore, ...checklist.rapport, feedback: cleanStudentText(rapportFeedback) },
      risk: { score: round(riskTotal), asked: rAsked, missed: rMissed, yourLevel, expectedLevel, levelOk, feedback: cleanStudentText(riskFeedback) },
      mse: { score: mseScore === null ? null : round(mseScore), domains },
      formulation: { score: formulationScore === null ? null : round(formulationScore), feedback: m?.formulation.feedback ?? (input.submission.formulation ? "Not checked: the AI marker wasn't available." : "Left blank.") },
    },
    betterQuestions: m?.better_questions ?? rMissed.concat(hMissed).slice(0, 3).map((x) => x.label),
    summary: cleanStudentText(summary),
    aiChecked: !!m,
    provider: model?.provider ?? "rules",
  };
}

/**
 * Student-model attempts for a graded interview: "<topic>:apply" (history,
 * rapport, formulation) and "<topic>:risk" (the risk questions), plus the
 * MSE skill when the MSE was checked.
 */
export function gradeAttempts(g: InterviewGrade, topic: string, caseId: string): Attempt[] {
  const p = g.parts;
  const applyParts = [p.history.score, p.rapport.score / 4, ...(p.formulation.score === null ? [] : [p.formulation.score])];
  const out: Attempt[] = [
    { skill: `${topic}:apply`, item: `sim-interview:${caseId}`, outcome: round(applyParts.reduce((a, x) => a + x, 0) / applyParts.length) },
    { skill: `${topic}:risk`, item: `sim-interview-risk:${caseId}`, outcome: p.risk.score },
  ];
  if (p.mse.score !== null) out.push({ skill: "interview-mse:mse", item: `sim-interview-mse:${caseId}`, outcome: p.mse.score });
  return out;
}
