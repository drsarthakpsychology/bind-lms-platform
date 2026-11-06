import { describe, expect, it } from "vitest";
import { makeRng } from "./picker";
import { applyAttempts, buildMap, buildPractice, confusionKey, dueCount, practiceCandidates, priorFor, seedRows, weakSpots, type ModelRows, type SkillRow } from "./student";
import { BANK, COMPETENCY_LABEL, TOPICS, bankItem, gradeChoice, skillLabel, skillOfItem, topicSkills } from "./topics";
import { PLACEMENT_SIZE, placementItems, scorePlacement, strengths, weaknesses } from "./placement";
import { COMPETENCIES } from "./skills";

const NOW = new Date("2026-11-06T10:00:00Z");
const empty = (): ModelRows => ({ skills: new Map(), items: new Map(), cards: new Map(), confusions: new Map() });
const row = (skill: string, theta: number, n: number, extra: Partial<SkillRow> = {}): SkillRow => ({ skill, theta, n, lastAt: NOW.toISOString(), mastery: "learning", correctDays: [], ...extra });

describe("topics and the bank", () => {
  it("tags every bank question with a known topic and competency", () => {
    expect(BANK.length).toBeGreaterThan(60);
    const ids = new Set(TOPICS.map((t) => t.id));
    for (const b of BANK) {
      expect(ids.has(b.topic)).toBe(true);
      expect(COMPETENCIES as readonly string[]).toContain(b.skill.split(":")[1]);
    }
    expect(new Set(BANK.map((b) => b.item.id)).size).toBe(BANK.length);
  });
  it("gives every topic at least one question", () => {
    for (const t of TOPICS) expect(topicSkills(t.id).length).toBeGreaterThan(0);
  });
  it("labels skills in plain words", () => {
    expect(skillLabel("depression:criteria")).toBe("Depression · Criteria");
    expect(skillLabel("brain:apply")).toBe(`Brain · ${COMPETENCY_LABEL.apply}`);
    expect(skillOfItem("md5")).toBe("bipolar:differentiate");
    expect(skillOfItem("md3")).toBe("depression:recognise");
    expect(skillOfItem("nope")).toBeNull();
  });
  it("grades one-tap answers", () => {
    const m = bankItem("md1")!.item;
    expect(gradeChoice(m, 1)).toMatchObject({ ok: true });
    expect(gradeChoice(m, 0)).toMatchObject({ ok: false, chosen: "3 days", correct: "At least 2 weeks" });
    expect(gradeChoice(m, "skip")).toMatchObject({ ok: false, chosen: null });
    expect(gradeChoice(m, 99).ok).toBe(false);
    const t = bankItem("md5")!.item;
    expect(gradeChoice(t, true).ok).toBe(true);
    expect(gradeChoice(t, 1).ok).toBe(false);
  });
});

describe("applyAttempts", () => {
  it("updates ability, difficulty, review card and mix-ups", () => {
    const res = applyAttempts(
      empty(),
      [
        { skill: "bipolar:criteria", item: "md9", outcome: 0, chosen: "7 days", correct: "4 days" },
        { skill: "bipolar:criteria", item: "md8", outcome: 1 },
      ],
      NOW,
    );
    const s = res.skills.get("bipolar:criteria")!;
    expect(s.n).toBe(2);
    expect(s.correctDays).toEqual(["2026-11-06"]);
    expect(res.items.get("md9")!.b).toBeGreaterThan(0);
    expect(res.items.get("md8")!.b).toBeLessThan(0);
    expect(res.cards.get("md9")!.lapses).toBe(1);
    expect(res.confusions.get(confusionKey("7 days", "4 days"))!.n).toBe(1);
    expect([...res.changed.skills]).toEqual(["bipolar:criteria"]);
  });
  it("does not count retries towards mastery, and ignores junk", () => {
    const res = applyAttempts(empty(), [{ skill: "x:apply", outcome: 1, first: false }, { skill: "", outcome: 1 }, { skill: "y:apply", outcome: Number.NaN }], NOW);
    expect(res.skills.get("x:apply")!.correctDays).toEqual([]);
    expect(res.skills.size).toBe(1);
  });
  it("starts a new skill from its topic's other skills (placement)", () => {
    const rows = empty();
    rows.skills.set("depression:criteria", row("depression:criteria", 1.2, 0, { lastAt: null }));
    expect(priorFor("depression:apply", rows.skills, NOW)).toBeCloseTo(1.2);
    const res = applyAttempts(rows, [{ skill: "depression:apply", outcome: 1 }], NOW);
    expect(res.skills.get("depression:apply")!.theta).toBeGreaterThan(1.2);
  });
  it("reaches mastery only across two days", () => {
    let rows = empty();
    const day1 = NOW;
    const day2 = new Date(NOW.getTime() + 86_400_000);
    // From a cold start the shrinking K needs about 23 straight right answers to reach P 0.85.
    for (let i = 0; i < 30; i++) rows = applyAttempts(rows, [{ skill: "ocd:recognise", outcome: 1 }], day1);
    expect(rows.skills.get("ocd:recognise")!.mastery).toBe("learning");
    rows = applyAttempts(rows, [{ skill: "ocd:recognise", outcome: 1 }], day2);
    expect(rows.skills.get("ocd:recognise")!.mastery).toBe("mastered");
  });
});

describe("map and weak spots", () => {
  it("builds a topic × competency grid and hides ratings until calibrated", () => {
    const m = buildMap([row("depression:criteria", -1, 5)], NOW);
    expect(m.topics.length).toBe(TOPICS.length);
    const dep = m.topics.find((t) => t.id === "depression")!;
    expect(dep.cells).toHaveLength(COMPETENCIES.length);
    expect(dep.href).toBe("/study/depression");
    const c = dep.cells.find((x) => x.competency === "criteria")!;
    expect(c.state).toBe("shaky");
    expect(c.p).toBeNull();
    expect(m.calibrated).toBe(false);
    const cal = buildMap([row("depression:criteria", -1, 30)], NOW);
    expect(cal.calibrated).toBe(true);
    expect(cal.topics.find((t) => t.id === "depression")!.cells.find((x) => x.competency === "criteria")!.p).toBeCloseTo(0.269, 2);
  });
  it("adds topics seen only in events, with a given title", () => {
    const m = buildMap([row("brain:apply", 0, 2)], NOW, { brain: "The brain" });
    expect(m.topics.at(-1)).toMatchObject({ id: "brain", title: "The brain" });
  });
  it("lists the weakest first and leaves out mastered skills", () => {
    const w = weakSpots(
      [row("a:apply", 0.3, 2), row("b:apply", -1, 5), row("c:apply", 3, 9, { correctDays: ["2026-11-05", "2026-11-06", "2026-11-06"] }), row("d:apply", 0, 0)],
      NOW,
    );
    expect(w.map((x) => x.skill)).toEqual(["b:apply", "a:apply"]);
    expect(w[0]).toMatchObject({ state: "shaky", href: "/study/b", practiceHref: "/study/map/practice?topic=b" });
  });
});

describe("practice", () => {
  it("offers every bank question, or one topic with its look-alikes", () => {
    expect(practiceCandidates(empty(), NOW)).toHaveLength(BANK.length);
    const dep = practiceCandidates(empty(), NOW, "depression");
    expect(new Set(dep.map((c) => c.topic))).toEqual(new Set(["depression", "bipolar"]));
    expect(dep.every((c) => c.p === 0.5)).toBe(true);
  });
  it("focuses a Fix-it session on the topic", () => {
    const s = buildPractice(empty(), NOW, makeRng(2), 10, "bipolar");
    expect(s).toHaveLength(10);
    expect(s.filter((x) => x.topic === "bipolar").length).toBeGreaterThanOrEqual(7);
    expect(buildPractice(empty(), NOW, makeRng(2), 10, "not-a-topic")).toHaveLength(10);
  });
});

describe("placement", () => {
  it("has 18 one-tap questions covering every topic, mostly multiple choice", () => {
    const items = placementItems();
    expect(items).toHaveLength(PLACEMENT_SIZE);
    expect(items.filter((b) => b.item.kind === "mcq").length).toBeGreaterThanOrEqual(PLACEMENT_SIZE - 1);
    expect(new Set(items.map((b) => b.topic))).toEqual(new Set(TOPICS.map((t) => t.id)));
    expect(new Set(items.map((b) => b.item.id)).size).toBe(items.length);
  });
  it("scores on the server and finds strengths and weaknesses", () => {
    const items = placementItems();
    const answers = items.map((b) => ({ item: b.item.id, choice: b.topic === "bipolar" ? ("skip" as const) : b.item.answer }));
    answers.push({ item: "md1", choice: 0 }, { item: "not-real", choice: 1 });
    const r = scorePlacement(answers);
    expect(r.answered).toBe(PLACEMENT_SIZE);
    expect(r.right).toBe(PLACEMENT_SIZE - items.filter((b) => b.topic === "bipolar").length);
    expect(weaknesses(r).map((t) => t.topic)).toEqual(["bipolar"]);
    expect(strengths(r).length).toBe(TOPICS.length - 1);
  });
  it("seeds only skills not practised yet", () => {
    const r = scorePlacement(placementItems().filter((b) => b.topic === "ocd").map((b) => ({ item: b.item.id, choice: (b.item as { answer: number }).answer })));
    const existing = new Map([["ocd:recognise", row("ocd:recognise", -2, 4)]]);
    const seeds = seedRows(r, existing);
    expect(seeds.map((s) => s.skill)).toEqual(topicSkills("ocd").filter((s) => s !== "ocd:recognise"));
    expect(seeds.every((s) => s.n === 0 && s.theta > 0)).toBe(true);
  });
});

describe("prep skills stay off the module map", () => {
  it("leaves prep- skills and prep: cards out of the map, weak spots and due count", () => {
    const list = [row("prep-statistics:apply", -2, 5), row("depression:criteria", -1, 3)];
    expect(buildMap(list, NOW).topics.some((t) => t.id.startsWith("prep-"))).toBe(false);
    expect(weakSpots(list, NOW).map((w) => w.skill)).toEqual(["depression:criteria"]);
    const card = { stability: 1, difficulty: 5, dueAt: "2026-11-01T00:00:00Z", lastAt: null, reps: 1, lapses: 1 };
    expect(dueCount([{ ...card, item: "prep:st-1" }, { ...card, item: "dep-1" }], NOW)).toBe(1);
  });
});
