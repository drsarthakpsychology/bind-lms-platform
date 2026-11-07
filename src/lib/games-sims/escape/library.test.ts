import { describe, expect, it } from "vitest";
import { TOPICS } from "@/lib/learn/model/topics";
import { lengthBias, levelSpread, tagProblems } from "../item-tags";
import { ROOMS } from "./rooms";

const topics = new Set(TOPICS.map((t) => t.id));
const doors = ROOMS.flatMap((r) => r.puzzles);
const textOf = (p: (typeof doors)[number]) => [p.prompt, p.hint, p.why, p.unlock, ...(p.kind === "order" ? p.items : p.kind === "number" ? [] : p.options)].join(" ");

describe("Escape Room library", () => {
  it("every door is tagged, plain, dash-free and citation-free, with unique ids", () => {
    expect(tagProblems(doors.map((p) => ({ id: p.id, tags: p.tags, text: textOf(p) })), topics)).toEqual([]);
    const rooms = new Set(ROOMS.map((r) => r.id));
    expect(rooms.size).toBe(ROOMS.length);
    for (const r of ROOMS) expect(/[–—]/.test(`${r.title} ${r.place} ${r.patient} ${r.intro} ${r.outro}`), r.id).toBe(false);
  });
  it("spreads the right answer across positions and does not give it away by length", () => {
    const picks = doors.filter((p) => p.kind === "pick");
    const pos = [0, 0, 0, 0];
    for (const p of picks) if (p.kind === "pick") pos[p.answer] += 1;
    for (const n of pos) expect(n / picks.length).toBeGreaterThan(0.15);
    for (const n of pos) expect(n / picks.length).toBeLessThan(0.35);
    const bias = lengthBias(picks.map((p) => (p.kind === "pick" ? { right: p.options[p.answer], options: p.options } : { right: "", options: [] })));
    expect(bias.longest).toBeLessThanOrEqual(0.4);
    expect(bias.shortest).toBeLessThanOrEqual(0.4);
  });
  it("has rooms on every ward and doors on every level", () => {
    const spread = levelSpread(doors);
    for (const n of Object.values(spread)) expect(n).toBeGreaterThan(0);
  });
});
