import { exams } from "@/lib/library/exams";
import type { ClinicDifficulty, ClinicPrompt } from "../clinic";

/**
 * Compact authoring helper for the Clinic detective bank (which also feeds the
 * Two-minute clinic). Each case carries:
 * - line: the one-liner shown in two-minute mode;
 * - clues: the clue trail, vague first, decisive last, for detective mode;
 * - diagnosis: the answer;
 * - expertDifferential: the answer plus its look-alikes;
 * - expertNext: the key question to ask;
 * - lesson: the teaching point.
 *
 * Exams are written as letters: C cuet-pg, U ugc-net, M mcp-entrance,
 * D md-psychiatry, S ma-semester.
 */
type Extra = { trap?: string; idiom?: boolean };

export function k(
  id: string,
  moduleId: string,
  topic: string,
  difficulty: ClinicDifficulty,
  examCode: string,
  objective: string,
  line: string,
  clues: string[],
  diagnosis: string,
  expertDifferential: string[],
  expertNext: string,
  lesson: string,
  extra: Extra = {},
): ClinicPrompt {
  return { id, moduleId, topic, difficulty, exams: exams(examCode), objective, line, clues, diagnosis, expertDifferential, expertNext, lesson, ...extra };
}
