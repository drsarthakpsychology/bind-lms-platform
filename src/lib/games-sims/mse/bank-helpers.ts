/**
 * Small builders for the MSE Lab passage bank, so each passage reads like a
 * case note and not like boilerplate. Pure, no React.
 *
 *   x(id, difficulty, topic, who, place, lines, note, findings, objective?)
 *   f(quote, answer, "wrong ids", why, "close ids"?, "also domains"?)
 *
 * `lines` is one string: speaker turns split by " | ", each starting with
 * "D: " (doctor), "P: " (patient) or "R: " (relative, staff or informant).
 */
import type { PrepExam } from "@/lib/prep/types";
import type { Excerpt, Finding } from "./excerpts";
import { TERMS, type Domain, type TermId } from "./terms";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

/** Study module ("module/section") for each MSE domain: where "Learn this" goes. */
export const DOMAIN_MODULE: Record<Domain, string> = {
  appearance: "mse-deep/1-2",
  speech: "mse-deep/2-1",
  mood: "mse-deep/1-3",
  affect: "mse-deep/1-3",
  form: "mse-deep/2-1",
  content: "mse-deep/2-2",
  perception: "mse-deep/2-3",
  cognition: "mse-deep/2-4",
  insight: "mse-deep/2-5",
};

const RISK = new Set<string>(["activeSI", "passiveSI", "command", "homicidal", "selfharmthoughts"]);

/** Exam relevance by rung: basics in semester and entrance papers, fine distinctions in clinical entrances and MD. */
export function examsFor(d: Difficulty): PrepExam[] {
  if (d <= 2) return ["ma-semester", "cuet-pg", "ugc-net"];
  if (d === 3) return ["ma-semester", "ugc-net", "mcp-entrance"];
  return ["ugc-net", "mcp-entrance", "md-psychiatry"];
}

/** The MSE Lab's three play levels from the five-rung ladder. */
export function levelFor(d: Difficulty): 1 | 2 | 3 {
  return d <= 2 ? 1 : d === 3 ? 2 : 3;
}

export function moduleFor(findings: Finding[]): string {
  if (findings.some((x) => RISK.has(x.a))) return "mse-deep/3-2";
  return DOMAIN_MODULE[TERMS[findings[0].a].domain];
}

function label(id: TermId): string {
  return TERMS[id].label.replace(/\s*\(.*\)$/, "");
}

export function objectiveFor(d: Difficulty, findings: Finding[]): string {
  const a = findings.map((x) => label(x.a));
  const lead = findings[0];
  const rival = lead.close?.[0] ?? lead.o[0];
  if (d === 1) return `Recognise ${a.slice(0, 2).join(" and ")}`;
  if (d === 2) return `Name ${a.slice(0, 2).join(" and ")} with the exact term`;
  if (d === 3) return `Place ${a.slice(0, 2).join(" and ")} in the right domains`;
  if (d === 4) return `Tell ${label(lead.a)} apart from ${label(rival)}`;
  return `Write the MSE line for ${a.slice(0, 3).join(", ")}`;
}

export function parseLines(s: string): Excerpt["lines"] {
  return s.split(" | ").map((t) => {
    const who = t.slice(0, 1) as "D" | "P" | "R";
    if (!["D", "P", "R"].includes(who) || t[1] !== ":") throw new Error(`bad line: ${t}`);
    return [who, t.slice(3)] as ["D" | "P" | "R", string];
  });
}

const ids = (s?: string) => (s ? (s.split(" ").filter(Boolean) as TermId[]) : undefined);

const lower = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

/** A short "why" gets the defining contrast added: what the right word means, and what the nearest look-alike would mean instead. */
export function teach(why: string, a: TermId, rival: TermId): string {
  if (why.length >= 90) return why;
  return `${why} ${TERMS[a].label} means: ${lower(TERMS[a].def)} The look-alike, ${lower(TERMS[rival].label)}, would mean: ${lower(TERMS[rival].def)}`;
}

export function f(q: string, a: TermId, o: string, why: string, close?: string, also?: string): Finding {
  const c = ids(close);
  const opts = ids(o)!;
  const out: Finding = { q, a, o: opts, why: teach(why, a, c?.[0] ?? opts[0]) };
  if (c) out.close = c;
  const al = also ? (also.split(" ") as Domain[]) : undefined;
  if (al) out.also = al;
  return out;
}

export function x(
  id: string,
  d: Difficulty,
  topic: string,
  who: string,
  place: string,
  lines: string,
  note: string,
  findings: Finding[],
  objective?: string,
): Excerpt {
  return {
    id,
    level: levelFor(d),
    who,
    place,
    lines: parseLines(lines),
    note,
    findings,
    skill: d <= 3 ? "interview-mse:mse" : "interview-mse:differentiate",
    topic,
    difficulty: d,
    objective: objective ?? objectiveFor(d, findings),
    exams: examsFor(d),
    module: moduleFor(findings),
  };
}
