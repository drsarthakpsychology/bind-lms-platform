import type { StudyProgress } from "@/lib/learn/engine";
import { MODULES, type StudyModule } from "@/lib/study";
import { sectionHref, testSection } from "@/lib/study/plan";

/**
 * The course certificate rule (owner decision, 7 Nov 2026):
 * a student earns the certificate by passing EVERY module test with
 * CERTIFICATE_PASS_PCT or more, in any order, with retakes allowed (the best
 * score counts). Access to content and certificate eligibility are separate:
 * nothing here opens or closes any module.
 *
 * Module test results are the best scores kept in the student's stored Learn
 * state (learn_progress.state.study.tests, keyed by module id). The server
 * keeps the best score from going down (keepBestTests in saveLearnState).
 */
export const CERTIFICATE_PASS_PCT = 80;

export type CertModule = { id: string; num: number; title: string; testHref: string };
export type CertModuleResult = CertModule & {
  /** Best score so far, or null when the test has not been tried. */
  best: number | null;
  total: number | null;
  /** Best score as a whole percent, or null. */
  pct: number | null;
  passed: boolean;
};
export type CertificateStatus = {
  passed: CertModuleResult[];
  remaining: CertModuleResult[];
  /** Number of module tests the rule needs. */
  total: number;
  eligible: boolean;
};

type TestResult = StudyProgress["tests"][string] | undefined;

export function testPct(t: TestResult): number | null {
  if (!t || !(t.total > 0)) return null;
  return Math.round((Math.min(t.best, t.total) * 100) / t.total);
}

/** Exact check (no rounding up): best / total of at least 80 percent. */
export function passesTest(t: TestResult): boolean {
  return Boolean(t && t.total > 0 && t.best * 100 >= CERTIFICATE_PASS_PCT * t.total);
}

/** Every module that has a module test, in course order. */
export function certificateModules(mods: StudyModule[] = MODULES): CertModule[] {
  return mods.flatMap((m) => {
    const t = testSection(m);
    return t ? [{ id: m.id, num: m.num, title: m.title, testHref: sectionHref(m, t) }] : [];
  });
}

/** The certificate status from a student's study record. Pure. */
export function certificateFromStudy(study: Pick<StudyProgress, "tests"> | null | undefined, mods: CertModule[] = certificateModules()): CertificateStatus {
  const tests = study?.tests ?? {};
  const rows: CertModuleResult[] = mods.map((m) => {
    const t = tests[m.id];
    return { ...m, best: t ? t.best : null, total: t ? t.total : null, pct: testPct(t), passed: passesTest(t) };
  });
  const passed = rows.filter((r) => r.passed);
  const remaining = rows.filter((r) => !r.passed);
  return { passed, remaining, total: rows.length, eligible: rows.length > 0 && remaining.length === 0 };
}
