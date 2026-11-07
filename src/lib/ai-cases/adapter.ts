/**
 * AiCase → the Daily Case game's case shape. The one place to change if the
 * games' `DailyCase` type moves at merge time.
 */
import { DX_NAMES } from "./criteria";
import { AI_CASE_NOTE, type AiCase, type DailyCaseShape } from "./types";

export function toDailyCase(c: AiCase): DailyCaseShape {
  return {
    id: c.id,
    difficulty: c.difficulty,
    chapter: c.chapter,
    answer: c.answer,
    synonyms: [],
    setting: c.place,
    clues: [...c.clues] as DailyCaseShape["clues"],
    investigations: c.investigations.map((x) => ({ ...x })),
    differentials: c.differentials.map((x) => ({ ...x })),
    pointer: c.pointer,
    overview: c.overview,
    module: c.module,
    // No book page: say plainly how it was checked (admin-only field).
    refs: [`AI case · ${AI_CASE_NOTE} (${c.checkedBy})`],
  };
}

/** Display name for a diagnosis id used in AI cases. */
export function dxName(id: string): string {
  return DX_NAMES[id] ?? id;
}
