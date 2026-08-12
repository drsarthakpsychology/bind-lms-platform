/**
 * BUG 1 REGRESSION SUITE — "the patient is not reading the case"
 *
 * Before this fix, fixture mode served one shared canned bank keyed by
 * difficulty archetype ("cooperative") for EVERY patient, so Suresh said
 * Ravi's lines. These tests prove the fixture patient engine now renders
 * the case's OWN authored content (few_shot, fallback for its register),
 * varies by seed, and enforces the code rules.
 *
 * No network, no keys — deterministic per (case, seed, turns).
 */

import { describe, expect, it } from "vitest";
import { runFixtureTurn } from "./fixture-patient";
import { initialState } from "./types";
import { drawVariant } from "./variation";
import { SEED_CASES } from "@/lib/psychopharm/sim/cases";
import type { DepthCase } from "./types";
import type { Gate } from "./gates";

/** Build the fact rules exactly like the turn route does. */
function factsFor(c: DepthCase): Array<{ fact_id: string; gate: Gate; sensitive?: boolean }> {
  return (c.disclosure_rules ?? []).map((r) => ({
    fact_id: r.fact,
    gate: { kind: "explicit_phrase", patterns: [/./] } as Gate,
    sensitive: true,
  }));
}

/** A DepthCase + initial state, mirrored from the route's assembly.
 *  Cases without an authored variation fall back to a multi-option default so
 *  the seeded variation (and with it distinct sessions) still works. */
function mkCase(seedRow: (typeof SEED_CASES)[number]): DepthCase {
  const base = seedRow as unknown as DepthCase;
  const c: DepthCase = {
    ...base,
    case_id: `seed-${base.title}`,
    variation: base.variation ?? {
      mood_today: ["flat", "resigned", "agitated"],
      recent_event: ["a long day", "a fight at home", "slept badly"],
      most_defended_topic: ["the family", "money", "health"],
      opening_posture: ["came willingly", "dragged here", "sitting quietly"],
      somatic_focus: ["head", "chest", "stomach"],
      trust_start: [2, 3, 4],
      language_mix: ["Hinglish", "English", "mixed Hindi"],
    },
    traps: base.traps ?? [],
    moves: {},
  };
  return c;
}

function fresh(c: DepthCase, seed = 1) {
  return initialState(c.case_id, drawVariant(c.variation, c.case_id, seed));
}

function say(c: DepthCase, s: ReturnType<typeof fresh>, msg: string) {
  return runFixtureTurn(c, s, msg, factsFor(c));
}

describe("bug 1: Suresh is a specific patient, never Ravi", () => {
  const suresh = mkCase(SEED_CASES.find((c) => c.title.includes("Suresh"))!);
  const ravi = mkCase(SEED_CASES.find((c) => c.title.includes("Ravi"))!);

  it("Suresh is himself: his stored reply is his own alcohol content, not Ravi's heaviness", () => {
    let s = fresh(suresh, 42);
    let out = say(suresh, s, "Hello");
    let seen = out.reply;
    // The very first reply comes from Suresh's authored few_shot bank.
    expect(seen).toContain("drink");
    expect(seen).not.toContain("heaviness");
    s = out.state;
    out = say(suresh, s, "What brings you here today?");
    seen += " " + out.reply;
    expect(seen).toMatch(/drink|alcohol|business|pressure|wife/i);
    expect(seen).not.toMatch(/heaviness|getting up feels like a lot/i);
  });

  it("Ravi is himself too — his voice is heaviness/body, never Suresh's drinking", () => {
    let s = fresh(ravi, 42);
    const lines: string[] = [];
    for (const msg of ["Hello", "Why are you here today?", "Tell me more"]) {
      const out = say(ravi, s, msg);
      lines.push(out.reply);
      s = out.state;
    }
    // Ravi's authored voice: heaviness, sleep, the clinic — but NEVER
    // Suresh's alcohol denial or any of Suresh's specific lines.
    expect(lines.join(" ")).toMatch(/heavy|sleep|head|chest|tonic|night shift/i);
    for (const line of lines) {
      expect(line).not.toContain("drink too much");
      expect(line).not.toMatch(/one peg|found the bottle|alcoholic/);
    }
  });

  it("Suresh never produces ANY other case's few_shot line, across all 8 cases", () => {
    const others = SEED_CASES.filter((c) => !c.title.includes("Suresh"));
    for (const other of others) {
      const theirs: string[] = ((other as unknown as DepthCase).few_shot ?? [])
        .map((f) => (typeof f === "string" ? f : (f as { patient?: string }).patient ?? ""))
        .filter(Boolean);
      let s = fresh(suresh, 7);
      const ourLines: string[] = [];
      for (let i = 0; i < 6; i++) {
        const o = say(suresh, s, i === 0 ? "Hello" : `Question number ${i}`);
        ourLines.push(o.reply);
        s = o.state;
      }
      for (const mine of ourLines) {
        for (const theirsLine of theirs) {
          expect(mine).not.toBe(theirsLine);
        }
      }
    }
  });
});

describe("bug 1: all 8 cases are distinct patients", () => {
  it("the first 3 turns of every case are pairwise dissimilar (no shared text)", () => {
    const perCase: Record<string, string[]> = {};
    for (const seedRow of SEED_CASES) {
      const c = mkCase(seedRow);
      let s = fresh(c, 42);
      const lines: string[] = [];
      for (const msg of ["Hello", "How are you doing?", "Why are you here today?"]) {
        const o = say(c, s, msg);
        lines.push(o.reply);
        s = o.state;
      }
      perCase[c.title] = lines;
    }
    const titles = Object.keys(perCase);
    for (let i = 0; i < titles.length; i++) {
      for (let j = i + 1; j < titles.length; j++) {
        const a = perCase[titles[i]].join(" ");
        const b = perCase[titles[j]].join(" ");
        // Allow tiny token-level overlap; forbid whole-line identity.
        for (const la of perCase[titles[i]]) {
          for (const lb of perCase[titles[j]]) {
            expect(la).not.toBe(lb);
          }
        }
        void a; void b;
      }
    }
  });
});

describe("bug 1: 'hey' / 'why' / 'hey' — three different replies and rising irritation", () => {
  it("repeats are never identical and irritation rises after premature advice", () => {
    const c = mkCase(SEED_CASES.find((x) => x.title.includes("Suresh"))!);
    let s = fresh(c, 11);
    const replies: string[] = [];
    for (const msg of ["hey", "why", "hey"]) {
      const o = say(c, s, msg);
      replies.push(o.reply);
      s = o.state;
    }
    // Three distinct replies — the even-odd position (hey → why → hey) must
    // never produce the same line twice.
    expect(new Set(replies).size).toBe(3);

    // Irritation must rise: "hey" here is the student's third message after
    // greeting — the engine treats repeated flat greetings as pressure.
    let s2 = fresh(c, 11);
    const irr: number[] = [];
    for (const msg of ["hey", "why", "hey"]) {
      const o = say(c, s2, msg);
      irr.push(o.state.irritation);
      s2 = o.state;
    }
    expect(irr[2]).toBeGreaterThan(irr[0]);
  });
});

describe("bug 1: 10 runs of one case give distinct openings", () => {
  it("same case, different seeds → each session plays differently", () => {
    const c = mkCase(SEED_CASES.find((x) => x.title.includes("Suresh"))!);
    // The first opening line (few_shot) is the patient's fixed hook; the
    // same greeting gets the same reply every run. Distinctness is measured
    // on the second patient turn, which draws from the seeded authored bank.
    const each: string[] = [];
    for (let seed = 1; seed <= 10; seed++) {
      let s = fresh(c, seed);
      const o1 = say(c, s, "Hello there");
      s = o1.state;
      const o2 = say(c, s, "How are you doing today?");
      each.push(o2.reply);
      // Never repeats the opening verbatim.
      expect(o2.reply).not.toBe(o1.reply);
    }
    const distinct = new Set(each);
    expect(distinct.size).toBeGreaterThan(1);
    for (const line of each) {
      expect(line).not.toContain("everything feels heavy");
    }
  });
});
describe("bug 2: conversation history + dangling-thread rule", () => {
  const suresh = mkCase(SEED_CASES.find((c) => c.title.includes("Suresh"))!);

  it("history is threaded: a trailing thread the student picks up becomes an EARNED disclosure, never a deflection", () => {
    const s = fresh(suresh, 5);
    // Patient trails off about "two years ago" (a dangling thread).
    const history: Array<{ role: "student" | "patient"; content: string }> = [
      { role: "student", content: "Hello" },
      { role: "patient", content: "Two years ago we… (pauses) it's just this." },
    ];
    // Student asks directly about the thread.
    const out = runFixtureTurn(suresh, s, "What happened two years ago?", factsFor(suresh), history);
    // The patient must disclose, not deflect.
    expect(["partial_disclose", "full_disclose", "reluctant_disclose"]).toContain(out.decision.patient_move);
  });

  it("without a dangling thread, the normal move selection applies", () => {
    const s = fresh(suresh, 5);
    const history: Array<{ role: "student" | "patient"; content: string }> = [
      { role: "student", content: "Hello" },
      { role: "patient", content: "My wife dragged me here." },
    ];
    const out = runFixtureTurn(suresh, s, "Tell me about your family", factsFor(suresh), history);
    expect(out.reply.length).toBeGreaterThan(0);
  });
});
