/**
 * Compact authoring for Escape Room doors. Each helper returns a door maker;
 * room() numbers the doors, tags them and opens the exit on the last one.
 * Only types come from rooms.ts, so there is no import loop at runtime.
 */
import { hashString, makeRng, shuffle } from "../common";
import { CLINIC_EXAMS, DX_EXAMS, PHARM_EXAMS, type Level } from "../item-tags";
import type { Puzzle, Room, Stage, Ward } from "./rooms";

type Maker = (id: string, last: boolean, title: string) => Puzzle;

const LEVEL: Record<Stage, Level> = { mse: 1, criteria: 2, diagnosis: 2, course: 2, differential: 4, risk: 3, plan: 3, medicine: 3 };
const LABEL: Record<Stage, string> = { mse: "mental state", diagnosis: "diagnosis", differential: "differential", risk: "risk", course: "course", plan: "plan", medicine: "medicine", criteria: "criteria" };

function base(stage: Stage, skill: string, prompt: string, hint: string, why: string, unlock: string, objective: string, lvl: Level | undefined, id: string, last: boolean, title: string) {
  const exams = stage === "medicine" ? PHARM_EXAMS : stage === "risk" || stage === "plan" ? CLINIC_EXAMS : DX_EXAMS;
  return {
    id,
    stage,
    prompt,
    hint,
    why,
    unlock: last ? "The doors open." : unlock,
    skill,
    tags: { topic: `${title}: ${LABEL[stage]}`, level: lvl ?? (last ? 5 : LEVEL[stage]), objective, exams, learn: skill.split(":")[0] },
  };
}

/**
 * Options are written right-answer-first for easy checking, then placed in a
 * fixed order seeded by the door id, so right answers spread across positions.
 * Explanations name options by content, never by letter.
 */
function place(id: string, options: string[], right: number[]): { options: string[]; answer: number[] } {
  const order = shuffle(
    options.map((_, i) => i),
    makeRng(hashString(`door:${id}`)),
  );
  return { options: order.map((i) => options[i]), answer: right.map((r) => order.indexOf(r)).sort((a, b) => a - b) };
}

/** One right option (index `answer` as written). */
export const pk = (stage: Stage, skill: string, prompt: string, options: string[], answer: number, hint: string, why: string, unlock: string, objective: string, lvl?: Level): Maker => (id, last, title) => {
  const p = place(id, options, [answer]);
  return { ...base(stage, skill, prompt, hint, why, unlock, objective, lvl, id, last, title), kind: "pick", options: p.options, answer: p.answer[0] };
};

/** Tick every right option (indexes as written). */
export const mu = (stage: Stage, skill: string, prompt: string, options: string[], answer: number[], hint: string, why: string, unlock: string, objective: string, lvl?: Level): Maker => (id, last, title) => {
  const p = place(id, options, answer);
  return { ...base(stage, skill, prompt, hint, why, unlock, objective, lvl, id, last, title), kind: "multi", options: p.options, answer: p.answer };
};

/** Put the items in order (written here in the right order; shown shuffled). */
export const od = (stage: Stage, skill: string, prompt: string, items: string[], hint: string, why: string, unlock: string, objective: string, lvl?: Level): Maker => (id, last, title) => ({ ...base(stage, skill, prompt, hint, why, unlock, objective, lvl, id, last, title), kind: "order", items });

/** Type a number in [min, max]; any of `answer` is right. */
export const nu = (stage: Stage, skill: string, prompt: string, range: [number, number], answer: number[], unit: string, hint: string, why: string, unlock: string, objective: string, lvl?: Level): Maker => (id, last, title) => ({ ...base(stage, skill, prompt, hint, why, unlock, objective, lvl, id, last, title), kind: "number", min: range[0], max: range[1], answer, unit });

export function room(id: string, code: string, ward: Ward, title: string, place: string, patient: string, intro: string, outro: string, doors: Maker[]): Room {
  return { id, ward, title, place, patient, intro, outro, puzzles: doors.map((d, i) => d(`${code}${i + 1}`, i === doors.length - 1, title)) };
}
