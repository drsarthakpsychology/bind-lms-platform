import { describe, expect, it } from "vitest";
import { emptyState, recordTest } from "@/lib/learn/engine";
import { MODULES } from "@/lib/study";
import { certificateFromStudy, certificateModules, passesTest } from "./certificate";
import { evaluate } from "./engine";
import { moduleFacets } from "./rules";
import { keepBestTests } from "@/lib/study/progress";

const ctxOf = (study: ReturnType<typeof emptyState>["study"]) => ({ study, xp: 0, watchSeconds: 0, modules: moduleFacets(), courseLessons: new Map(), completedLessons: new Set<string>() });

describe("course certificate rule", () => {
  it("needs every module test", () => {
    expect(certificateModules().length).toBe(MODULES.length);
    const s = certificateFromStudy(emptyState().study);
    expect(s.eligible).toBe(false);
    expect(s.passed).toHaveLength(0);
    expect(s.remaining).toHaveLength(MODULES.length);
  });

  it("passes at exactly 80 percent, not below", () => {
    expect(passesTest({ best: 8, total: 10, day: "2026-11-01", tries: 1 })).toBe(true);
    expect(passesTest({ best: 79, total: 100, day: "2026-11-01", tries: 1 })).toBe(false);
    expect(passesTest({ best: 0, total: 0, day: "2026-11-01", tries: 1 })).toBe(false);
    expect(passesTest(undefined)).toBe(false);
  });

  it("counts any order and the best of retakes", () => {
    let s = emptyState();
    // Reverse order, with a failed first try on one module.
    for (const m of [...MODULES].reverse()) s = recordTest(s, m.id, 20, 25, "2026-11-01");
    s = recordTest(s, MODULES[0].id, 5, 25, "2026-11-02");
    const st = certificateFromStudy(s.study);
    expect(st.eligible).toBe(true);
    expect(st.remaining).toHaveLength(0);
    expect(evaluate({ kind: "module_tests_passed" }, ctxOf(s.study)).ok).toBe(true);
  });

  it("is not eligible with one test short or below 80", () => {
    let s = emptyState();
    for (const m of MODULES.slice(1)) s = recordTest(s, m.id, 25, 25, "2026-11-01");
    expect(certificateFromStudy(s.study).eligible).toBe(false);
    s = recordTest(s, MODULES[0].id, 19, 25, "2026-11-01");
    const st = certificateFromStudy(s.study);
    expect(st.eligible).toBe(false);
    expect(st.remaining.map((r) => r.id)).toEqual([MODULES[0].id]);
    expect(st.remaining[0].pct).toBe(76);
    const r = evaluate({ kind: "module_tests_passed" }, ctxOf(s.study));
    expect(r.ok).toBe(false);
    expect(r.reason).toContain(`${MODULES.length - 1} of ${MODULES.length}`);
  });

  it("keeps the best score when an older copy is saved", () => {
    const prev = { a: { best: 9, total: 10, day: "2026-11-01", tries: 2 } };
    const next = { a: { best: 4, total: 10, day: "2026-11-03", tries: 1 } };
    expect(keepBestTests(prev, next).a).toMatchObject({ best: 9, total: 10, tries: 2 });
    expect(keepBestTests(prev, {}).a.best).toBe(9);
    expect(keepBestTests(undefined, next)).toBe(next);
  });
});

describe("progress percent", () => {
  it("counts sections read, level checks tried and the test tried", async () => {
    const { moduleProgress, courseProgress } = await import("@/lib/study/progress");
    const { finishSection } = await import("@/lib/learn/engine");
    const { readingSections } = await import("@/lib/study/plan");
    const m = MODULES[0];
    let s = emptyState();
    expect(moduleProgress(m, s.study).pct).toBe(0);
    for (const sec of readingSections(m).filter((x) => !x.levelCheck)) s = finishSection(s, m.id, sec.id, "2026-11-01");
    for (const sec of readingSections(m).filter((x) => x.levelCheck)) s = recordTest(s, `${m.id}@${sec.levelCheck}`, 1, 5, "2026-11-01");
    expect(moduleProgress(m, s.study).pct).toBeLessThan(100);
    s = recordTest(s, m.id, 1, 25, "2026-11-01");
    expect(moduleProgress(m, s.study).pct).toBe(100);
    const c = courseProgress(MODULES, s.study);
    expect(c.pct).toBeGreaterThan(0);
    expect(c.pct).toBeLessThan(100);
  });
});
