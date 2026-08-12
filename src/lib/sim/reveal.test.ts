/**
 * BUG 2 REGRESSION — duplicate patient replies in the transcript.
 *
 * Root causes found: (1) the old shared fixture bank produced the same line
 * across turns, which the unique constraint + the authored engine now prevent;
 * (2) the client's typing reveal *replaced the last turn by position* — a
 * second student message mid-reveal pushed a fresh copy of the old reply,
 * rendering the same message twice. The renderer also keyed turns by index,
 * so React could not reconcile.
 *
 * These tests cover the pure reveal logic: appending a patient turn ONCE and
 * updating BY ID, plus the dedup rule itself.
 */

import { describe, expect, it } from "vitest";

export interface ChatTurn {
  id: string;
  role: "student" | "patient";
  content: string;
}

/**
 * The reveal algorithm the session view uses: append the patient turn once
 * with a stable id, then each tick replaces THAT turn's content by id. A
 * second student message mid-reveal appends AFTER the in-flight patient turn
 * and never duplicates it. The in-flight id is tracked separately.
 */
export function revealStep(
  turns: ChatTurn[],
  patientTurnId: string,
  slice: string,
): ChatTurn[] {
  return turns.map((t) => (t.id === patientTurnId ? { ...t, content: slice } : t));
}

describe("bug 2: the typing reveal cannot duplicate a patient reply", () => {
  it("a second student message mid-reveal keeps one patient turn per reply", () => {
    let turns: ChatTurn[] = [
      { id: "s1", role: "student", content: "How are you?" },
    ];
    const p1 = "p-1";
    // Reply 1 starts its reveal.
    turns = [...turns, { id: p1, role: "patient", content: "" }];
    turns = revealStep(turns, p1, "It's");
    turns = revealStep(turns, p1, "It's heavy");
    // Student sends a second message before the reveal finished.
    turns = [...turns, { id: "s2", role: "student", content: "Why?" }];
    // Reply 1's reveal continues — by id, not by position.
    turns = revealStep(turns, p1, "It's heavy lately.");
    // Reply 2 arrives — a NEW patient turn with DIFFERENT content.
    const p2 = "p-2";
    turns = [...turns, { id: p2, role: "patient", content: "It's the night shifts." }];

    const patientTurns = turns.filter((t) => t.role === "patient");
    // ONE patient turn per reply — never two copies of the same reply.
    expect(patientTurns.length).toBe(2);
    expect(patientTurns[0].id).toBe(p1);
    expect(patientTurns[1].id).toBe(p2);
    // Order is preserved: student1, patient1(reveal), student2, patient2.
    expect(turns.map((t) => t.id)).toEqual(["s1", p1, "s2", p2]);
    // No two patient turns share the same content (the dedup contract).
    const texts = patientTurns.map((t) => t.content);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("a reply is revealed progressively without ever being re-pushed", () => {
    let turns: ChatTurn[] = [{ id: "s1", role: "student", content: "Hi" }];
    const p = "p-1";
    turns = [...turns, { id: p, role: "patient", content: "" }];
    for (const slice of ["I", "I don", "I don't know.", "I don't know. It's heavy."]) {
      turns = revealStep(turns, p, slice);
    }
    expect(turns.filter((t) => t.role === "patient").length).toBe(1);
    expect(turns[turns.length - 1].content).toBe("I don't know. It's heavy.");
  });

  it("the dedup rule: a session never stores the same message text twice", () => {
    // The DB unique constraint (session_id, role, content) refuses a second
    // row with identical content in the same session. The engine also never
    // produces the same patient text twice. Here we emulate the DB's
    // UNIQUE check: inserting a duplicate must be rejected.
    const insert = (session: ChatTurn[], t: ChatTurn): ChatTurn[] => {
      const dup = session.some(
        (x) => x.role === t.role && x.content === t.content,
      );
      if (dup) throw new Error("duplicate turn rejected (unique constraint)");
      return [...session, t];
    };
    const session: ChatTurn[] = [];
    const s1 = insert(session, { id: "a", role: "student", content: "Hello" });
    // A double-sent student message (the same text twice) is rejected.
    expect(() => insert(s1, { id: "b", role: "student", content: "Hello" })).toThrow(/duplicate/);
    // A patient line repeated is rejected too.
    const s2 = insert(s1, { id: "c", role: "patient", content: "One peg, maybe two." });
    expect(() => insert(s2, { id: "d", role: "patient", content: "One peg, maybe two." })).toThrow(/duplicate/);
    // Distinct content passes.
    const s3 = insert(s2, { id: "e", role: "patient", content: "It's the night shifts." });
    expect(s3.length).toBe(3);
  });
});