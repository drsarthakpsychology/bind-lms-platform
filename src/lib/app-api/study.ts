import "server-only";
import { MODULES, moduleById, sectionById, COURSE_MINUTES } from "@/lib/study";
import type { Block as WebBlock, Mcq as WebMcq, Section, StudyModule } from "@/lib/study/types";
import { courseNext, moduleNext, moduleStatus, readingSections, retestDue, sectionTitle, testSection, type Next } from "@/lib/study/plan";
import { splitSection } from "@/lib/study/chunk";
import { checkpointKnown, checkpointQuestions, checkpointRound, checkpointStatus, checkpoints, laterSectionIds, type Checkpoint } from "@/lib/study/checkpoints";
import { mcqKey } from "@/lib/study/test-grade";
import { istToday, liveStreak, recordTest, studyKey, type LearnState as WebLearnState } from "@/lib/learn/engine";
import { loadHistory, recordHistory } from "@/lib/history/server";
import type {
  Block,
  CheckpointContent,
  CheckpointResult,
  CheckpointSummary,
  LearnState,
  ModuleDetail,
  ModuleSummary,
  ModuleTestResult,
  QuestionReview,
  SectionContent,
  SectionToc,
  StudyHome,
  StudyNext,
  TestQuestion,
} from "./contract";
import { CONTENT_SCHEMA_VERSION } from "./contract";
import { toAppTarget } from "./target";

/**
 * Study for the app: the website's own course (MODULES), plan (moduleStatus,
 * moduleNext, courseNext), reader split (splitSection) and checkpoint rules,
 * shaped as contract JSON. Content goes out as structured blocks, never HTML.
 * Questions of graded tests go out without their answers.
 */

/** Website blocks -> app blocks: the same data, plus the widget data version `v`. */
export function toAppBlocks(blocks: readonly WebBlock[]): Block[] {
  return blocks.map((b): Block => {
    switch (b.t) {
      case "box":
        return { ...b, blocks: toAppBlocks(b.blocks) };
      case "view":
        return { ...b, blocks: toAppBlocks(b.blocks) };
      case "qa":
        return { ...b, blocks: toAppBlocks(b.blocks) };
      case "widget":
        return { t: "widget", kind: b.kind, v: 1, data: b.data } as Block;
      default:
        return b as Block;
    }
  });
}

export function nextOut(n: Next): StudyNext {
  const target = toAppTarget(n.href);
  switch (n.kind) {
    case "read":
    case "test":
      return { kind: n.kind, moduleId: n.module.id, sectionId: n.section.id, label: n.label, target };
    case "retest":
      return { kind: "retest", moduleId: n.module.id, sectionId: n.section.id, label: n.label, due: n.due, target };
    case "checkpoint":
    case "write":
      return { kind: n.kind, moduleId: n.module.id, label: n.label, target };
    case "practise":
      return { kind: "practise", moduleId: n.module.id, activityId: n.activityId, label: n.label, target };
    default:
      return { kind: "done", label: n.label, target };
  }
}

export function moduleSummary(m: StudyModule, s: WebLearnState): ModuleSummary {
  return { id: m.id, num: m.num, title: m.title, emoji: m.emoji, tagline: m.tagline, when: m.when, minutes: m.minutes, status: moduleStatus(m, s.study) };
}

export function studyHome(s: WebLearnState, today = istToday()): StudyHome {
  return {
    modules: MODULES.map((m) => moduleSummary(m, s)),
    next: nextOut(courseNext(MODULES, s.study, today)),
    goal: { points: s.daily.day === today ? s.daily.xp : 0, goal: s.dailyGoal, streak: liveStreak(s.streak, today) },
    courseMinutes: COURSE_MINUTES,
  };
}

export function sectionToc(m: StudyModule, x: Section, s: WebLearnState): SectionToc {
  return {
    id: x.id,
    num: x.num,
    title: sectionTitle(x),
    part: x.part ?? null,
    tag: x.tag ?? null,
    level: x.level ?? null,
    levelCheck: x.levelCheck ?? null,
    isTest: x.isTest,
    words: x.words,
    doneOn: s.study.done[studyKey(m.id, x.id)] ?? null,
  };
}

function checkpointSummary(m: StudyModule, cp: Checkpoint, s: WebLearnState): CheckpointSummary {
  const t = s.study.tests[cp.key];
  return { n: cp.n, key: cp.key, title: cp.title, sectionIds: cp.sectionIds, status: checkpointStatus(m, cp, s.study), best: t?.best ?? null, total: t?.total ?? null };
}

export function moduleDetail(m: StudyModule, s: WebLearnState): ModuleDetail {
  const i = MODULES.indexOf(m);
  const nm = MODULES[i + 1];
  const n = moduleNext(m, s.study);
  return {
    ...moduleSummary(m, s),
    outcomes: m.outcomes,
    writeTask: m.writeTask,
    noteId: m.noteId ?? null,
    activities: m.activities.map((a) => ({ id: a.id, title: a.title, why: a.why, kind: a.kind, target: toAppTarget(a.href), doneOn: s.study.acts[m.id]?.[a.id] ?? null })),
    sections: m.sections.map((x) => sectionToc(m, x, s)),
    checkpoints: checkpoints(m).map((cp) => checkpointSummary(m, cp, s)),
    next: n ? nextOut(n) : { kind: "done", label: "Module complete", target: toAppTarget(`/study/${m.id}`) },
    nextModule: nm ? { id: nm.id, num: nm.num, title: nm.title } : null,
    retestDue: retestDue(m, s.study),
  };
}

export const testQuestion = (keyBase: string, q: WebMcq): TestQuestion => ({ key: mcqKey(keyBase, q), q: q.q, options: q.options });

export function sectionContent(m: StudyModule, x: Section, s: WebLearnState): SectionContent {
  const parts = splitSection(x);
  const reading = readingSections(m);
  const i = m.sections.indexOf(x);
  const prev = m.sections[i - 1];
  const nextReading = reading[reading.indexOf(x) + 1];
  return {
    contentSchemaVersion: CONTENT_SCHEMA_VERSION,
    moduleId: m.id,
    moduleNum: m.num,
    moduleTitle: m.title,
    section: sectionToc(m, x, s),
    chunks: parts.chunks.map((c) => ({ title: c.title, words: c.words, blocks: toAppBlocks(c.blocks) })),
    recall: parts.recall,
    viva: parts.viva,
    // The module test is graded on the server: its questions go out without answers.
    mcq: x.isTest ? [] : parts.mcq,
    test: x.isTest ? { questions: parts.mcq.map((q) => testQuestion(m.id, q)) } : null,
    prev: prev ? { sectionId: prev.id, title: sectionTitle(prev) } : null,
    next: nextReading ? { sectionId: nextReading.id, title: sectionTitle(nextReading) } : null,
    checkpoints: checkpoints(m).map((cp) => ({ n: cp.n, key: cp.key, sectionIds: cp.sectionIds, later: laterSectionIds(m, cp) })),
  };
}

export function findModule(moduleId: string): StudyModule | null {
  return moduleById(moduleId) ?? null;
}
export function findSection(m: StudyModule, sectionId: string): Section | null {
  return sectionById(m, sectionId) ?? null;
}
export function findCheckpoint(m: StudyModule, n: string | number): Checkpoint | null {
  return checkpoints(m).find((c) => String(c.n) === String(n)) ?? null;
}

/** One sitting of a checkpoint: never-seen questions first, then missed ones, none already right (the website's rule). */
export async function checkpointContent(userId: string, m: StudyModule, cp: Checkpoint, s: WebLearnState, now = Date.now()): Promise<CheckpointContent> {
  const q = checkpointQuestions(m, cp);
  const idOf = (x: WebMcq) => mcqKey(cp.key, x);
  const history = (await loadHistory(userId, "study-check")).map;
  const round = checkpointRound(q.mcq, idOf, history, now, Math.random);
  return {
    n: cp.n,
    key: cp.key,
    title: cp.title,
    status: checkpointStatus(m, cp, s.study),
    questions: round.map((x) => testQuestion(cp.key, x)),
    recall: q.recall,
    known: checkpointKnown(q.mcq, idOf, history),
  };
}

function review(keyBase: string, mcqs: readonly WebMcq[], picks: Readonly<Record<string, number>>, only?: ReadonlySet<string>): QuestionReview[] {
  return mcqs
    .filter((q) => !only || only.has(mcqKey(keyBase, q)))
    .map((q) => {
      const key = mcqKey(keyBase, q);
      const picked = typeof picks[key] === "number" ? picks[key] : null;
      return { key, picked, answer: q.answer, correct: picked === q.answer, why: q.why ?? null };
    });
}

/**
 * Grade a checkpoint sitting on the server. Only questions of this checkpoint
 * count; each answer goes into the answer history ("study-check", as on the
 * website); the score saved is how many of ALL its questions are right now,
 * through the same recordTest the website uses.
 */
export async function gradeCheckpoint(
  userId: string,
  m: StudyModule,
  cp: Checkpoint,
  picks: Readonly<Record<string, number>>,
  state: WebLearnState,
  save: (s: WebLearnState) => Promise<{ ok: boolean }>,
  today = istToday(),
): Promise<Omit<CheckpointResult, "state"> & { saved: boolean }> {
  const q = checkpointQuestions(m, cp);
  const idOf = (x: WebMcq) => mcqKey(cp.key, x);
  const asked = new Set(Object.keys(picks).filter((k) => q.mcq.some((x) => idOf(x) === k)));
  const rev = review(cp.key, q.mcq, picks, asked);
  if (rev.length) await recordHistory(userId, "study-check", rev.map((r) => ({ item: r.key, correct: r.correct })));
  const history = (await loadHistory(userId, "study-check")).map;
  const known = checkpointKnown(q.mcq, idOf, history);
  // A checkpoint with no case questions is scored on its cards (by the app), never here.
  let saved = true;
  if (known.total > 0 && rev.length) saved = (await save(recordTest(state, cp.key, known.right, known.total, today))).ok;
  return { right: rev.filter((r) => r.correct).length, asked: rev.length, known, review: rev, saved };
}

/** The module test's questions and the review after grading (the grading itself is submitModuleTest). */
export function moduleTestReview(m: StudyModule, picks: Readonly<Record<string, number>>): { review: QuestionReview[]; section: Section | null } {
  const sec = testSection(m) ?? null;
  return { section: sec, review: sec ? review(m.id, splitSection(sec).mcq, picks) : [] };
}

export function testResult(m: StudyModule, right: number, total: number, rev: QuestionReview[], s: WebLearnState): ModuleTestResult {
  const t = s.study.tests[m.id];
  return { right, total, best: t?.best ?? right, tries: t?.tries ?? 1, review: rev, state: s as unknown as LearnState };
}
