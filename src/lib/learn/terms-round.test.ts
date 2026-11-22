import { describe, expect, it } from "vitest";
import { buildTermsRound, checkPick, optionsFor, questionOf, seeded } from "./terms-round";

describe("Say it clinically on the server", () => {
  const ids = buildTermsRound(new Map(), Date.parse("2026-11-22T06:00:00Z"), seeded(7));

  it("builds a round of 12 known questions", () => {
    expect(ids).toHaveLength(12);
    expect(ids.filter((id) => id.startsWith("words-"))).toHaveLength(4);
    for (const id of ids) expect(optionsFor(id, 1).length).toBeGreaterThanOrEqual(2);
  });

  it("the options are the same every time for the same seed", () => {
    expect(optionsFor(ids[0], 42)).toEqual(optionsFor(ids[0], 42));
  });

  it("the question sent to the browser has no answer in it", () => {
    const q = questionOf({ id: ids[0], options: optionsFor(ids[0], 3) })!;
    expect(Object.keys(q).sort()).toEqual(["id", "kind", "options", "prompt", ...(q.language ? ["language"] : [])].sort());
    expect(JSON.stringify(q)).not.toMatch(/"(answer|why|meaning)"/);
  });

  it("checks a pick on the server, and refuses one that was not offered", () => {
    const options = optionsFor(ids[0], 3);
    const results = options.map((o) => checkPick({ id: ids[0], options }, o)!);
    expect(results.filter((r) => r.correct)).toHaveLength(1);
    expect(options).toContain(results[0].answer);
    expect(checkPick({ id: ids[0], options }, "something else")).toBeNull();
    expect(checkPick({ id: "nope", options }, options[0])).toBeNull();
  });
});
