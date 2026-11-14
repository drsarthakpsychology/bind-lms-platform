import { describe, expect, it } from "vitest";
import { LINES } from "./lines";
import { MOODS } from "./stickers";

/**
 * The reaction lines follow the owner's house rules: enough of them, no
 * dashes, short enough for a bubble, and nothing on the banned topics.
 */

const OWNER_LINE = "This is exactly why she left you.";

/** Word stems that must never appear (matched at a word start, any case). */
const BANNED = [
  // mental illness, diagnoses, patients, treatment
  "suicid", "self harm", "selfharm", "self-harm", "kill", "die", "dying", "dead", "death", "hang", "cutting",
  "crazy", "insane", "psycho", "lunatic", "mental", "mad", "nuts", "schizo", "bipolar", "ocd", "adhd", "autis",
  "depress", "anxi", "panic", "trauma", "trigger", "delusion", "hallucinat", "paranoi", "manic", "retard",
  "therap", "meds", "medic", "pill", "patient", "disorder", "diagnos", "symptom", "sick", "ill", "disease",
  // bodies
  "fat", "ugly", "skinny", "thin", "weight", "body", "bodies", "face", "looks", "bald", "short", "tall",
  // caste, religion
  "caste", "dalit", "brahmin", "religio", "god", "pray", "temple", "church", "mosque", "allah", "bhagwan", "jesus",
  // gender, sexuality
  "gay", "lesbian", "trans", "girl", "boy", "woman", "women", "man", "men", "sexy", "sex", "virgin",
  // money, family
  "money", "rupee", "rich", "poor", "broke", "salary", "loan", "fees", "family", "mummy", "papa", "mother", "father",
  "parent", "divorce", "marri", "shaadi", "dowry", "sharma ji",
  // the person's worth
  "stupid", "idiot", "dumb", "loser", "worthless", "failure", "useless", "pathetic",
  // violence
  "abuse", "beat", "slap", "hit you",
];

function hits(line: string): string[] {
  const l = line.toLowerCase();
  return BANNED.filter((w) => new RegExp(`(^|[^a-z])${w.replace(/[-\s]/g, "[-\\s]?")}`, "i").test(l));
}

describe("reaction lines", () => {
  it("has at least 40 lines for every mood", () => {
    for (const mood of MOODS) expect(LINES[mood].length, mood).toBeGreaterThanOrEqual(40);
  });

  it("includes the owner's example as written", () => {
    expect(LINES.wrong).toContain(OWNER_LINE);
  });

  it("has no em or en dashes", () => {
    for (const mood of MOODS) for (const line of LINES[mood]) expect(/[–—]/.test(line), line).toBe(false);
  });

  it("stays clear of the banned topics", () => {
    const bad = MOODS.flatMap((mood) => LINES[mood].map((line) => ({ line, words: hits(line) }))).filter((x) => x.words.length);
    expect(bad).toEqual([]);
  });

  it("fits a speech bubble and has no repeats", () => {
    const all = MOODS.flatMap((m) => LINES[m]);
    for (const line of all) {
      expect(line.length, line).toBeLessThanOrEqual(48);
      expect(line.trim(), line).toBe(line);
      expect(/[.!?]$/.test(line), line).toBe(true);
    }
    expect(new Set(all).size).toBe(all.length);
  });

  it("the banned-word check catches what it should", () => {
    expect(hits("You are so dumb")).toContain("dumb");
    expect(hits("That answer needs therapy")).toContain("therap");
    expect(hits("Main character answer")).toEqual([]);
  });
});
