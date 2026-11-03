import { describe, expect, it } from "vitest";
import { emptyState, finishSection, markActivity, markWritten, recordTest, normalise } from "@/lib/learn/engine";
import { MODULES } from "./index";
import { parseBlocks, parseModule } from "./parse";
import { splitSection } from "./chunk";
import { courseNext, moduleNext, moduleStatus, readingSections, retestDue, testSection } from "./plan";

describe("course content", () => {
  it("every module parses into sections, has a test, and no maths symbols or book names", () => {
    expect(MODULES.length).toBeGreaterThan(0);
    const ids = new Set<string>();
    for (const m of MODULES) {
      expect(ids.has(m.id), m.id).toBe(false);
      ids.add(m.id);
      expect(readingSections(m).length, m.id).toBeGreaterThan(3);
      const t = testSection(m);
      expect(t, m.id).toBeTruthy();
      const secIds = new Set(m.sections.map((s) => s.id));
      expect(secIds.size, `${m.id} duplicate section ids`).toBe(m.sections.length);
      for (const s of m.sections) {
        const text = JSON.stringify(s.blocks);
        expect(/[≥≤≠↑↓]|<\d|>\d|~\d/.test(text), `${m.id} ${s.num} symbols`).toBe(false);
        expect(/stahl|kaplan|sadock|ahuja|fish's|page \d/i.test(text), `${m.id} ${s.num} book name`).toBe(false);
        for (const b of s.blocks) if (b.t === "mcq") for (const q of b.items) {
          expect(q.answer, `${m.id} ${q.q.slice(0, 40)}`).toBeGreaterThanOrEqual(0);
          expect(q.options.length).toBeGreaterThanOrEqual(3);
        }
      }
      expect(m.outcomes.length).toBeGreaterThan(2);
      expect(m.activities.length).toBeGreaterThan(1);
    }
  });
});

describe("parser", () => {
  it("handles boxes, tables, lists, recall, viva and mcq", () => {
    const b = parseBlocks([":::trap Title", "- a", "  - b", ":::", "| x | y |", "|---|---|", "| 1 | 2 |", ":::recall", "1. Q? || A", ":::", ":::viva", "Q :: A", ":::", ":::mcq", "Q: Pick", "- no", "- *yes", "> because", ":::"]);
    expect(b.map((x) => x.t)).toEqual(["box", "table", "recall", "viva", "mcq"]);
    const box = b[0];
    expect(box.t === "box" && box.kind === "trap" && box.title === "Title").toBe(true);
    const mcq = b[4];
    expect(mcq.t === "mcq" && mcq.items[0].answer === 1 && mcq.items[0].why === "because").toBe(true);
    const secs = parseModule("# Part A\n## 1.1 One [core]\nText\n## 1.2 Two [extra]\nMore");
    expect(secs.map((s) => [s.id, s.tag, s.part])).toEqual([["1-1", "core", "Part A"], ["1-2", "extra", "Part A"]]);
  });
});

describe("the guided flow", () => {
  it("goes read → checkpoints → write → practise → test → re-test", async () => {
    const m = MODULES[0];
    let s = emptyState();
    expect(courseNext(MODULES, s.study, "2026-11-01").kind).toBe("read");
    for (const sec of readingSections(m)) s = finishSection(s, m.id, sec.id, "2026-11-01");
    // Checkpoints come next, then writing it out.
    expect(moduleNext(m, s.study)?.kind).toBe("checkpoint");
    const { checkpoints } = await import("./checkpoints");
    for (const cp of checkpoints(m)) s = recordTest(s, cp.key, 3, 4, "2026-11-01");
    expect(moduleNext(m, s.study)?.kind).toBe("write");
    s = markWritten(s, m.id, "2026-11-01");
    expect(moduleNext(m, s.study)?.kind).toBe("practise");
    for (const a of m.activities) s = markActivity(s, m.id, a.id, "2026-11-01");
    expect(moduleNext(m, s.study)?.kind).toBe("test");
    s = recordTest(s, m.id, 20, 28, "2026-11-01");
    expect(moduleNext(m, s.study)).toBeNull();
    expect(moduleStatus(m, s.study).complete).toBe(true);
    expect(retestDue(m, s.study)).toBe("2026-11-04");
    expect(courseNext(MODULES, s.study, "2026-11-04").kind).toBe("retest");
    expect(s.xp).toBeGreaterThan(0);
    // survives a save/load round trip
    expect(normalise(JSON.parse(JSON.stringify(s))).study.tests[m.id].best).toBe(20);
  });
  it("pays test XP only for improvement", () => {
    const m = MODULES[0];
    const a = recordTest(emptyState(), m.id, 10, 28, "2026-11-01");
    const b = recordTest(a, m.id, 8, 28, "2026-11-04");
    expect(b.xp).toBe(a.xp);
    expect(b.study.tests[m.id].best).toBe(10);
    expect(b.study.tests[m.id].tries).toBe(2);
  });
});

describe("chunking", () => {
  it("keeps self-tests out of the reading and never leaves a one-line first part", () => {
    const [sec] = parseModule("# Part A\n## 1.1 One [core]\nShort intro.\n### Sub\nBody text here.\n:::recall\n1. Q? || A\n:::");
    const out = splitSection(sec);
    expect(out.recall.length).toBe(1);
    expect(out.chunks.length).toBe(1);
    expect(out.chunks[0].blocks.some((b) => b.t === "h3")).toBe(true);
    for (const m of MODULES) for (const s of m.sections) for (const c of splitSection(s).chunks) expect(c.blocks.some((b) => b.t === "recall" || b.t === "mcq" || b.t === "viva")).toBe(false);
  });
});

describe("checkpoints", () => {
  it("cover every teaching section once, in blocks inside one Part", async () => {
    const { checkpoints, teachingSections } = await import("./checkpoints");
    for (const m of MODULES) {
      const cps = checkpoints(m);
      const ids = cps.flatMap((c) => c.sectionIds);
      expect(ids, m.id).toEqual(teachingSections(m).map((s) => s.id));
      for (const c of cps) {
        const parts = new Set(c.sectionIds.map((id) => m.sections.find((s) => s.id === id)?.part));
        expect(parts.size, `${m.id} cp${c.n}`).toBe(1);
        expect(c.sectionIds.length).toBeLessThanOrEqual(4);
      }
    }
  });
  it("every checkpoint has questions, and every module has case questions", async () => {
    const { checkpoints, checkpointQuestions } = await import("./checkpoints");
    for (const m of MODULES) {
      let cases = 0;
      for (const cp of checkpoints(m)) {
        const q = checkpointQuestions(m, cp);
        expect(q.mcq.length + q.recall.length, `${m.id} cp${cp.n}`).toBeGreaterThan(0);
        cases += q.mcq.length;
      }
      expect(cases, m.id).toBeGreaterThanOrEqual(8);
    }
  });
  it("open only after the student has moved on, and come before more reading", async () => {
    const { checkpoints, checkpointStatus } = await import("./checkpoints");
    const m = MODULES.find((x) => checkpoints(x).length > 1)!;
    const [cp, cp2] = checkpoints(m);
    let s = emptyState();
    expect(checkpointStatus(m, cp, s.study)).toBe("locked");
    for (const id of cp.sectionIds) s = finishSection(s, m.id, id, "2026-11-01");
    expect(checkpointStatus(m, cp, s.study)).toBe("waiting");
    expect(moduleNext(m, s.study)?.kind).toBe("read");
    s = finishSection(s, m.id, cp2.sectionIds[0], "2026-11-01");
    expect(checkpointStatus(m, cp, s.study)).toBe("ready");
    expect(moduleNext(m, s.study)?.kind).toBe("checkpoint");
    s = recordTest(s, cp.key, 3, 4, "2026-11-01");
    expect(checkpointStatus(m, cp, s.study)).toBe("done");
    expect(moduleNext(m, s.study)?.kind).toBe("read");
  });
});
