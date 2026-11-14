/**
 * Reported by a student: "I'm on the MSE module but I'm getting the same quiz
 * at every checkpoint." Two causes, both fixed:
 *
 * 1. The level check of a level ("Check yourself", 15 questions on the whole
 *    level) was copied into the checkpoint that holds it, so that checkpoint
 *    repeated a quiz the student had just taken, about other blocks.
 * 2. After every finished section the reader (and Continue) sent the student
 *    to the FIRST open checkpoint not yet taken. One skipped checkpoint was
 *    then served again after every later section: the same quiz each time.
 */
import { describe, expect, it } from "vitest";
import { emptyState, finishSection, recordTest, studyKey } from "@/lib/learn/engine";
import { nextRow, type HistoryRow } from "@/lib/history/order";
import { MODULES, moduleById } from "./index";
import { splitSection } from "./chunk";
import { readingSections } from "./plan";
import { moduleNext } from "./plan";
import { checkpointHref, checkpointKnown, checkpointQuestions, checkpointRound, checkpoints, dueCheckpoint, laterSectionIds, openedCheckpoint } from "./checkpoints";
import type { Mcq, StudyModule } from "./types";

const DAY = "2026-11-14";
const qid = (q: Mcq) => `${q.q}|${q.options.join("|")}`;
const links = (m: StudyModule) => checkpoints(m).map((cp) => ({ key: cp.key, href: checkpointHref(m, cp), sectionIds: cp.sectionIds, later: laterSectionIds(m, cp) }));

describe("every checkpoint asks about its own sections", () => {
  it("MSE: different checkpoints ask different questions, none from a level check", () => {
    for (const id of ["interview-mse", "mse-deep"]) {
      const m = moduleById(id)!;
      const sets = checkpoints(m).map((cp) => new Set(checkpointQuestions(m, cp).mcq.map(qid)));
      const levelCheck = new Set(m.sections.filter((s) => s.levelCheck).flatMap((s) => splitSection(s).mcq.map(qid)));
      sets.forEach((set, i) => expect([...set].filter((x) => levelCheck.has(x)), `${id} cp${i + 1} repeats the level check`).toEqual([]));
      for (let a = 0; a < sets.length; a++)
        for (let b = a + 1; b < sets.length; b++) {
          const shared = [...sets[a]].filter((x) => sets[b].has(x));
          expect(shared, `${id} cp${a + 1} and cp${b + 1}`).toEqual([]);
        }
    }
  });

  it("in every module: questions come only from the checkpoint's own teaching sections, never from a level check, never twice", () => {
    for (const m of MODULES) {
      const seen = new Map<string, number>();
      const levelCheckQs = new Set(m.sections.filter((s) => s.levelCheck).flatMap((s) => splitSection(s).mcq.map(qid)));
      for (const cp of checkpoints(m)) {
        const own = new Set(cp.sectionIds.flatMap((sid) => splitSection(m.sections.find((s) => s.id === sid)!).mcq.map(qid)));
        const q = checkpointQuestions(m, cp);
        expect(q.mcq.length + q.recall.length, `${m.id} cp${cp.n} is empty`).toBeGreaterThan(0);
        for (const x of q.mcq.map(qid)) {
          expect(own.has(x), `${m.id} cp${cp.n} asks about another block: ${x.slice(0, 50)}`).toBe(true);
          expect(levelCheckQs.has(x), `${m.id} cp${cp.n} repeats its level check: ${x.slice(0, 50)}`).toBe(false);
          expect(seen.get(x), `${m.id} cp${cp.n} repeats a question from cp${seen.get(x)}`).toBeUndefined();
          seen.set(x, cp.n);
        }
      }
    }
  });
});

describe("a skipped checkpoint does not come back after every later section", () => {
  it("reading straight through, each finish opens a different checkpoint (or none)", () => {
    for (const m of MODULES) {
      const checks = links(m);
      if (checks.length < 3) continue;
      let s = emptyState();
      const offered: string[] = [];
      for (const sec of readingSections(m)) {
        const before = s;
        s = finishSection(s, m.id, sec.id, DAY);
        const cp = openedCheckpoint(checks, m.id, before.study, s.study);
        if (cp) offered.push(cp.key);
      }
      // The student never takes one, yet no checkpoint is offered twice.
      expect(new Set(offered).size, `${m.id}: ${offered.join(" ")}`).toBe(offered.length);
      // And they are different quizzes.
      const quizzes = offered.map((k) => checkpointQuestions(m, checkpoints(m).find((c) => c.key === k)!).mcq.map(qid).join("\n"));
      expect(new Set(quizzes).size, m.id).toBe(quizzes.length);
    }
  });

  it("finishing an already finished section again does not send the student back to an old checkpoint", () => {
    const m = moduleById("interview-mse")!;
    const checks = links(m);
    let s = emptyState();
    for (const sec of readingSections(m).slice(0, 6)) s = finishSection(s, m.id, sec.id, DAY);
    const again = finishSection(s, m.id, readingSections(m)[5].id, DAY);
    expect(openedCheckpoint(checks, m.id, s.study, again.study)).toBeNull();
  });

  it("Continue suggests the checkpoint just behind the student, not the one they left behind", () => {
    const m = moduleById("interview-mse")!;
    const [cp1, cp2, cp3] = checkpoints(m);
    let s = emptyState();
    // Read through cp1, cp2 and cp3's sections plus one more; take none.
    const upTo = readingSections(m).findIndex((x) => x.id === cp3.sectionIds[cp3.sectionIds.length - 1]) + 1;
    for (const sec of readingSections(m).slice(0, upTo + 1)) s = finishSection(s, m.id, sec.id, DAY);
    expect(dueCheckpoint(m, s.study)?.key).toBe(cp3.key);
    expect(moduleNext(m, s.study)?.href).toBe(checkpointHref(m, cp3));
    s = recordTest(s, cp3.key, 3, 4, DAY);
    // cp1 and cp2 stay open on the module page, but are not pushed again.
    expect(dueCheckpoint(m, s.study)).toBeNull();
    expect(moduleNext(m, s.study)?.kind).toBe("read");
    expect([cp1.key, cp2.key].some((k) => s.study.tests[k])).toBe(false);
  });
});

describe("a checkpoint retake never repeats what is already right", () => {
  const m = moduleById("interview-mse")!;
  const cp = checkpoints(m)[1];
  const { mcq } = checkpointQuestions(m, cp);
  const id = (q: Mcq) => `${cp.key}:${q.q}`;

  it("drops right answers, puts never-seen ones first, and is empty when all are right", () => {
    const now = Date.UTC(2026, 10, 14, 6);
    const h = new Map<string, HistoryRow>();
    h.set(id(mcq[0]), nextRow(undefined, id(mcq[0]), true, now - 3600_000));
    h.set(id(mcq[1]), nextRow(undefined, id(mcq[1]), false, now - 3600_000));
    const round = checkpointRound(mcq, id, h, now, () => 0.5);
    expect(round.map(id)).not.toContain(id(mcq[0]));
    expect(round.map(id)).toContain(id(mcq[1]));
    expect(round.length).toBe(mcq.length - 1);
    expect(id(round[round.length - 1])).toBe(id(mcq[1]));
    for (const q of mcq) h.set(id(q), nextRow(undefined, id(q), true, now));
    expect(checkpointRound(mcq, id, h, now, () => 0.5)).toEqual([]);
    expect(checkpointKnown(mcq, id, h)).toEqual({ right: mcq.length, total: mcq.length });
  });
});

describe("test scores", () => {
  it("best and total stay together when a test changes size (never over 100%)", () => {
    const a = recordTest(emptyState(), "m", 18, 20, DAY);
    const b = recordTest(a, "m", 5, 15, DAY);
    expect(b.study.tests.m).toMatchObject({ best: 18, total: 20, tries: 2 });
    const c = recordTest(b, "m", 15, 15, DAY);
    expect(c.study.tests.m).toMatchObject({ best: 15, total: 15, tries: 3 });
    // A right count above the total is clamped.
    expect(recordTest(emptyState(), "x", 9, 4, DAY).study.tests.x).toMatchObject({ best: 4, total: 4 });
    expect(studyKey("a", "b")).toBe("a/b");
  });
});

describe("re-tests count days, not attempts", () => {
  it("three tries on the first day still leave the 3-day re-test next", async () => {
    const { retestDue } = await import("./plan");
    const m = moduleById("interview-mse")!;
    let s = recordTest(emptyState(), m.id, 10, 25, "2026-11-01");
    s = recordTest(s, m.id, 15, 25, "2026-11-01");
    s = recordTest(s, m.id, 21, 25, "2026-11-01");
    expect(retestDue(m, s.study)).toBe("2026-11-04");
    s = recordTest(s, m.id, 22, 25, "2026-11-04");
    expect(retestDue(m, s.study)).toBe("2026-11-11");
    // An old record without the day count falls back to its tries.
    const old = { ...s.study, tests: { [m.id]: { best: 20, total: 25, day: "2026-11-01", tries: 2 } } };
    expect(retestDue(m, old)).toBe("2026-11-08");
  });
});
