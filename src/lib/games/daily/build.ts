import { CHAPTERS, diagnosisById } from "../diagnoses";
import { exams, type ExamSet } from "../tags";
import type { DailyCase, InvestigationKind } from "./types";

type Clues = DailyCase["clues"];
type Inv = [InvestigationKind, string, string];

/**
 * Compact builder for the newer case files: positional so a case reads top to
 * bottom like a case sheet. The chapter comes from the answer, the Study
 * module from the chapter unless `module` overrides it.
 */
export function k(
  id: string,
  difficulty: 1 | 2 | 3,
  answer: string,
  setting: string,
  clues: Clues,
  investigations: Inv[],
  differentials: [string, string][],
  pointer: string,
  overview: string,
  objective: string,
  examSet: ExamSet,
  refs: string[],
  opts: { module?: string; synonyms?: string[] } = {},
): DailyCase {
  const dx = diagnosisById(answer);
  if (!dx) throw new Error(`${id}: unknown answer ${answer}`);
  return {
    id,
    difficulty,
    chapter: dx.chapter,
    answer,
    synonyms: opts.synonyms ?? [],
    setting,
    clues,
    investigations: investigations.map(([kind, label, result]) => ({ kind, label, result })),
    differentials: differentials.map(([d, whyNot]) => ({ dx: d, whyNot })),
    pointer,
    overview,
    module: opts.module ?? CHAPTERS[dx.chapter].module,
    refs,
    objective,
    exams: exams(examSet),
  };
}
