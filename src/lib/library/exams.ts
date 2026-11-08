import type { PrepExam } from "@/lib/prep/types";

/** Exam tags written as letters: C cuet-pg, U ugc-net, M mcp-entrance, D md-psychiatry, S ma-semester. */
const EXAM: Record<string, PrepExam> = { C: "cuet-pg", U: "ugc-net", M: "mcp-entrance", D: "md-psychiatry", S: "ma-semester" };

export function exams(code: string): PrepExam[] {
  return [...code].map((ch) => {
    const e = EXAM[ch];
    if (!e) throw new Error(`unknown exam code ${ch}`);
    return e;
  });
}
