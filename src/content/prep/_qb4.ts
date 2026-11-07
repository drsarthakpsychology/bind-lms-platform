import type { PrepExam, PrepQuestion, Subject } from "@/lib/prep/types";

/**
 * Small helpers shared by the psychopathology, clinical-therapies, counselling,
 * health, positive and organisational question files. Keeps each part file
 * focused on content.
 */

/** Exam tag sets. Tag honestly: CUET-PG is BA-level; MCP entrances are heavily clinical. */
export const ALL: PrepExam[] = ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"];
export const NET_MCP_MA: PrepExam[] = ["ugc-net", "mcp-entrance", "ma-semester"];
export const NET_MCP: PrepExam[] = ["ugc-net", "mcp-entrance"];
export const NET_MA: PrepExam[] = ["ugc-net", "ma-semester"];
export const MCP_MA: PrepExam[] = ["mcp-entrance", "ma-semester"];
export const MCP: PrepExam[] = ["mcp-entrance"];
export const CUET_NET_MA: PrepExam[] = ["cuet-pg", "ugc-net", "ma-semester"];
export const CUET_NET: PrepExam[] = ["cuet-pg", "ugc-net"];
export const CUET_MA: PrepExam[] = ["cuet-pg", "ma-semester"];
export const NET: PrepExam[] = ["ugc-net"];
export const MA: PrepExam[] = ["ma-semester"];

/** The standard UGC NET assertion-reason options. */
export const AR: [string, string, string, string] = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is NOT the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];

type Draft = Omit<PrepQuestion, "subject" | "module" | "options"> & {
  module?: string;
  options?: [string, string, string, string];
};

/**
 * Returns a builder that fills in the subject (and a default module).
 * Assertion-reason items get the standard four options automatically.
 */
export function builder(subject: Subject, defaultModule?: string) {
  return (d: Draft): PrepQuestion => {
    const options = d.options ?? (d.type === "assertion-reason" ? AR : undefined);
    if (!options) throw new Error(`${d.id}: options missing`);
    return { ...d, subject, module: d.module ?? defaultModule, options };
  };
}
