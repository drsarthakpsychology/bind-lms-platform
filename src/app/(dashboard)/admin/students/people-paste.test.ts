import { describe, expect, it } from "vitest";
import { matchNames, pasteCount, splitPeople } from "./people-paste";

describe("splitPeople", () => {
  it("takes emails and names in any paste shape", () => {
    const r = splitPeople("Priya Shah <Priya@Gmail.com>\nAarav Mehta, b@x.in; b@x.in\n\n  Neha   Rao ");
    expect(r.emails).toEqual(["priya@gmail.com", "b@x.in"]);
    expect(r.names).toEqual(["Aarav Mehta", "Neha Rao"]);
  });
  it("drops junk and duplicates", () => {
    expect(splitPeople("1\n--\nneha rao\nNeha Rao").names).toEqual(["neha rao"]);
  });
  it("counts what will be tried", () => {
    expect(pasteCount("a@b.co, Ravi Kumar")).toBe(2);
    expect(pasteCount("")).toBe(0);
  });
});

describe("matchNames", () => {
  const people = [
    { name: "Neha Rao", email: "neha@x.in" },
    { name: "Ravi Kumar", email: "ravi1@x.in" },
    { name: "ravi  kumar", email: "ravi2@x.in" },
  ];
  it("matches an exact name, ignoring case and spaces", () => {
    expect(matchNames(["neha  RAO"], people)).toEqual([{ name: "neha  RAO", email: "neha@x.in" }]);
  });
  it("asks for an email when two people share a name or none match", () => {
    expect(matchNames(["Ravi Kumar", "Nobody"], people)).toEqual([
      { name: "Ravi Kumar", email: null, reason: "more-than-one" },
      { name: "Nobody", email: null, reason: "not-found" },
    ]);
  });
});
