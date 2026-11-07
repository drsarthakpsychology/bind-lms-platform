import { describe, expect, it, vi } from "vitest";
import { DIAGNOSES, diagnosisById } from "@/lib/games/diagnoses";
import { apply, replay, start } from "@/lib/games/daily/engine";
import { buildView } from "@/lib/games/daily/view";
import { toDailyCase } from "./adapter";
import { CRITERIA, DX_NAMES, RULES } from "./criteria";
import { generateAiCase, parseJsonLoose, resolveInput, type ChatFn } from "./generate";
import { buildGeneratorPrompt } from "./prompt";
import { AI_CASE_LABEL, AI_CASE_NOTE } from "./types";
import { findEvidence, isNegated, parseDurations, validateDraft } from "./validate";
import { GOOD_MDD } from "./fixtures.test-data";

const MDD = { dx: "mdd", difficulty: 2 as const, setting: "indian" as const };
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

describe("criteria list", () => {
  it("uses only diagnosis ids the games know", () => {
    for (const id of Object.keys(DX_NAMES)) expect(diagnosisById(id), id).toBeTruthy();
    expect(DIAGNOSES.length).toBeGreaterThan(Object.keys(DX_NAMES).length);
  });
  it("every rule it names exists", () => {
    for (const c of CRITERIA) {
      for (const id of [...(c.core ?? []), ...c.all, ...(c.minOf?.ids ?? [])]) expect(RULES[id], `${c.dx}:${id}`).toBeTruthy();
      for (const la of c.lookAlikes) {
        expect(DX_NAMES[la.dx], `${c.dx} look-alike ${la.dx}`).toBeTruthy();
        if (la.rule !== "@duration") expect(RULES[la.rule], `${c.dx}:${la.rule}`).toBeTruthy();
      }
    }
  });
});

describe("validateDraft", () => {
  it("accepts a case that shows the criteria and rules out the look-alikes", () => {
    const v = validateDraft(clone(GOOD_MDD), MDD);
    expect(v.ok, v.ok ? "" : v.problems.join("\n")).toBe(true);
    if (v.ok) {
      expect(v.case.ai).toBe(true);
      expect(v.case.answer).toBe("mdd");
      expect(v.case.evidence.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("rejects the wrong JSON shape (5 clues, extra keys)", () => {
    const d = clone(GOOD_MDD) as Record<string, unknown>;
    (d.clues as string[]).pop();
    d.extra = 1;
    const v = validateDraft(d, MDD);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.problems.join(" ")).toMatch(/JSON shape/);
  });

  it("rejects a case that names the answer", () => {
    const d = clone(GOOD_MDD);
    d.pointer = "Think of major depression.";
    const v = validateDraft(d, MDD);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.problems.join(" ")).toMatch(/gives the answer away/);
  });

  it("rejects too few symptoms", () => {
    const d = clone(GOOD_MDD);
    d.clues[2] = "She keeps to herself at the staff room these days.";
    d.clues[3] = "Her husband says she is quieter than before.";
    d.clues[4] = "She has taken a few days of leave.";
    const v = validateDraft(d, MDD);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.problems.join(" ")).toMatch(/at least 5/);
  });

  it("rejects a duration that doesn't fit", () => {
    const d = clone(GOOD_MDD);
    d.duration = { value: 5, unit: "days" };
    const v = validateDraft(d, MDD);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.problems.join(" ")).toMatch(/doesn't fit/);
  });

  it("rejects a missing look-alike", () => {
    const d = clone(GOOD_MDD);
    d.differentials = d.differentials.filter((x) => x.dx !== "bipolar-2");
    const v = validateDraft(d, MDD);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.problems.join(" ")).toMatch(/bipolar-2/);
  });

  it("rejects the wrong setting", () => {
    const v = validateDraft(clone(GOOD_MDD), { ...MDD, setting: "global" });
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.problems.join(" ")).toMatch(/outside India/);
  });

  it("rejects book or journal references and long dashes", () => {
    const d = clone(GOOD_MDD);
    d.overview = d.overview + " As Kaplan and Sadock put it, this is common — very common.";
    const v = validateDraft(d, MDD);
    expect(v.ok).toBe(false);
    if (!v.ok) {
      expect(v.problems.join(" ")).toMatch(/cites a source/);
      expect(v.problems.join(" ")).toMatch(/long dash/);
    }
  });
});

describe("text rules", () => {
  it("negation: 'no sleep problems' does not count, 'no energy' does", () => {
    expect(isNegated("She has no ", " problems", "sleep")).toBe(true);
    expect(isNegated("She has no ", " at all", "energy")).toBe(false);
    expect(findEvidence(RULES["sleep"], [{ source: "clue", index: 0, text: "Her sleep is normal." }])).toBeNull();
  });
  it("reads written durations", () => {
    expect(parseDurations("for six weeks")).toEqual([42]);
    expect(parseDurations("about 2 years")).toEqual([730]);
  });
});

describe("generateAiCase (AI mocked)", () => {
  it("feeds the checker's problems back and accepts the retry", async () => {
    const bad = clone(GOOD_MDD);
    bad.differentials = bad.differentials.slice(1);
    const chat = vi.fn<ChatFn>().mockResolvedValueOnce({ text: JSON.stringify(bad), provider: "groq" }).mockResolvedValueOnce({ text: "```json\n" + JSON.stringify(GOOD_MDD) + "\n```", provider: "groq" });
    const res = await generateAiCase(MDD, chat, { now: new Date("2026-11-06T00:00:00Z") });
    expect(res.ok).toBe(true);
    expect(chat).toHaveBeenCalledTimes(2);
    const retryPrompt = chat.mock.calls[1][0][1].content;
    expect(retryPrompt).toMatch(/rejected by the checker/);
    expect(retryPrompt).toMatch(/bipolar-2/);
    if (res.ok) {
      expect(res.case.id).toMatch(/^ai-mdd-/);
      expect(res.case.createdAt).toBe("2026-11-06T00:00:00.000Z");
    }
  });

  it("cleans dashes and AI phrases out of the model's text before checking", async () => {
    const dashed = clone(GOOD_MDD);
    dashed.clues[0] = "Meena, 41, a school teacher — comes with her husband. She feels low and empty most of the day.";
    dashed.overview = "It's important to note that " + dashed.overview.replace("at least two weeks", "at least 2–3 weeks");
    const chat: ChatFn = async () => ({ text: "", json: dashed, provider: "groq" });
    const res = await generateAiCase(MDD, chat);
    expect(res.ok, res.ok ? "" : res.problems.join("\n")).toBe(true);
    if (res.ok) {
      const all = JSON.stringify(res.case);
      expect(all).not.toMatch(/[—–]/);
      expect(all).not.toMatch(/important to note/i);
    }
  });

  it("gives up after the attempts and reports why", async () => {
    const chat: ChatFn = async () => ({ text: "not json", provider: "groq" });
    const res = await generateAiCase(MDD, chat, { attempts: 2 });
    expect(res).toMatchObject({ ok: false, reason: "rejected", tries: 2 });
  });

  it("stops at once when AI is switched off (fixture) or unavailable", async () => {
    expect(await generateAiCase(MDD, async () => ({ text: "x", provider: "fixture" }))).toMatchObject({ ok: false, reason: "unavailable", tries: 1 });
    expect(
      await generateAiCase(MDD, async () => {
        throw new Error("down");
      }),
    ).toMatchObject({ ok: false, reason: "unavailable" });
  });
});

describe("prompt", () => {
  it("asks for no dashes, no references and the right look-alikes", () => {
    const p = buildGeneratorPrompt(MDD, ["Fix this"]);
    expect(p.user).toMatch(/Never use em dashes or en dashes/);
    expect(p.user).toMatch(/No book titles/);
    expect(p.user).toMatch(/bipolar-2/);
    expect(p.user).toMatch(/Fix this/);
    expect(p.system).toMatch(/educational/);
    expect(p.user + p.system).not.toMatch(/[—–]/);
  });
});

describe("resolveInput", () => {
  it("draws from the topic and keeps the asked difficulty and setting", () => {
    const i = resolveInput({ topic: "anxiety", difficulty: 3, setting: "global" }, () => 0);
    expect(["gad", "panic"]).toContain(i.dx);
    expect(i).toMatchObject({ difficulty: 3, setting: "global" });
  });
  it("mixes Indian and global settings when not asked", () => {
    expect(resolveInput({}, () => 0).setting).toBe("indian");
    expect(resolveInput({}, (n) => n - 1).setting).toBe("global");
  });
  it("parseJsonLoose copes with prose around JSON", () => {
    expect(parseJsonLoose('Here: {"a": 1} done')).toEqual({ a: 1 });
    expect(parseJsonLoose("nope")).toBeNull();
  });
});

describe("toDailyCase", () => {
  it("plays through the Daily Case engine", async () => {
    const v = validateDraft(clone(GOOD_MDD), MDD);
    if (!v.ok) throw new Error(v.problems.join("\n"));
    const c = toDailyCase({ ...v.case, id: "ai-mdd-test", createdAt: "2026-11-06T00:00:00Z" });
    let p = start();
    p = apply(c, p, { t: "guess", dx: "bipolar-2" });
    expect(p.guesses[0].reason).toMatch(/hypomania/);
    p = apply(c, p, { t: "guess", dx: "mdd" });
    expect(p.status).toBe("solved");
    expect(replay(c, [{ t: "clue" }]).progress.clues).toBe(2);
    const view = buildView(c, p, "practice", false);
    expect(view.reveal?.answer).toBe(DX_NAMES.mdd);
    expect(view.reveal?.refs).toBeNull();
    // Admins don't get a "sources" block on AI cases either.
    expect(buildView(c, p, "practice", true, { ai: true }).reveal?.refs).toBeNull();
    expect(c.refs[0]).toContain(AI_CASE_LABEL);
  });
  it("carries the exact student note", () => {
    expect(AI_CASE_NOTE).toBe("Made by AI, not yet checked by a clinician");
  });
});
