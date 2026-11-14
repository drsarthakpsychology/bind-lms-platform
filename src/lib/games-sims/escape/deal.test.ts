import { describe, expect, it } from "vitest";
import { canonical, practiceAnswer, practiceStart, practiceState, publicDoor, roomCards, roomView } from "./deal";
import { shownOrder, startEscape, type EscState } from "./engine";
import { ROOMS, type Puzzle } from "./rooms";

const SEED = "secret-123";

/** The right answer as the browser sends it (an order door: shown positions). */
function browserAnswer(p: Puzzle, seed: string): string {
  if (p.kind === "pick") return String(p.answer);
  if (p.kind === "multi") return p.answer.join(",");
  if (p.kind === "number") return String(p.answer[0]);
  const shown = shownOrder(p, seed);
  return p.items.map((_, i) => shown.indexOf(i)).join(",");
}

const secretsOf = (p: Puzzle) => [p.why, p.hint, p.unlock].filter((t) => t !== "The doors open.");

describe("Escape Room deal", () => {
  it("room cards carry no doors", () => {
    const text = JSON.stringify(roomCards());
    for (const r of ROOMS) for (const p of r.puzzles) expect(text.includes(p.prompt)).toBe(false);
  });

  it("a fresh room shows the first door only, with no answer, hint, explanation or later page", () => {
    for (const r of ROOMS) {
      const v = roomView(r, startEscape(r), SEED);
      const text = JSON.stringify(v);
      expect(v.door?.id).toBe(r.puzzles[0].id);
      expect(v.hint).toBeNull();
      expect(v.opened).toEqual([]);
      expect(v.outro).toBeNull();
      expect(text).not.toMatch(/"answer"|"why"|"hint":"/);
      for (const p of r.puzzles) for (const s of secretsOf(p)) expect(text.includes(s), s).toBe(false);
      for (const p of r.puzzles.slice(1)) expect(text.includes(p.prompt)).toBe(false);
      expect(text.includes(r.outro)).toBe(false);
    }
  });

  it("an order door arrives shuffled and is checked by shown positions", () => {
    for (const r of ROOMS)
      for (const p of r.puzzles) {
        if (p.kind !== "order") continue;
        const d = publicDoor(p, SEED);
        expect(d.kind === "order" && d.items.join("|") !== p.items.join("|")).toBe(true);
        expect(canonical(p, browserAnswer(p, SEED), SEED)).toBe(p.items.map((_, i) => i).join(","));
        expect(canonical(p, "0,1,2,3,4,5,6,7".slice(0, p.items.length * 2 - 1), SEED)).not.toBe(p.items.map((_, i) => i).join(","));
        expect(canonical(p, "9,x", SEED)).toBe("-1,-1");
      }
  });

  it("plays a practice run on the server: counts wrong tries, opens the hint after two, reveals each door only once open", () => {
    for (const r of ROOMS) {
      let t = practiceStart("u1", "run1", r, 1000);
      let cur = practiceState(t, "u1")!;
      expect(practiceState(t, "someone else")).toBeNull();
      // Answering a later door does nothing.
      expect(practiceAnswer(t, cur.room, cur.st, 2, browserAnswer(r.puzzles[2], SEED), SEED)).toBeNull();
      for (const miss of ["99", "98"]) {
        const res = practiceAnswer(t, cur.room, cur.st, 0, miss, SEED)!;
        expect(res.ok).toBe(false);
        t = res.next;
        cur = practiceState(t, "u1")!;
      }
      expect(cur.st.wrong).toBe(2);
      expect(roomView(r, cur.st, SEED).hint).toBe(r.puzzles[0].hint);
      let st: EscState = cur.st;
      for (let i = 0; i < r.puzzles.length; i++) {
        const res = practiceAnswer(t, cur.room, st, i, browserAnswer(r.puzzles[i], SEED), SEED)!;
        expect(res.ok, `${r.id} door ${i + 1}`).toBe(true);
        t = res.next;
        st = practiceState(t, "u1")!.st;
        const v = roomView(r, st, SEED);
        expect(v.opened.length).toBe(i + 1);
        expect(v.opened[i].why).toBe(r.puzzles[i].why);
      }
      expect(st.done).toBe(true);
      expect(st.wrong).toBe(2);
      expect(roomView(r, st, SEED).outro).toBe(r.outro);
      expect(roomView(r, st, SEED).door).toBeNull();
    }
  });

  it("refuses a token for a room that doesn't fit it", () => {
    const t = practiceStart("u1", "run1", ROOMS[0], 0);
    expect(practiceState({ ...t, room: "nope" }, "u1")).toBeNull();
    expect(practiceState({ ...t, tr: [0] }, "u1")).toBeNull();
    expect(practiceState({ ...t, s: 99 }, "u1")).toBeNull();
    expect(practiceState(null, "u1")).toBeNull();
  });
});
