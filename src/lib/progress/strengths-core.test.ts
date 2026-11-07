import { describe, expect, it } from "vitest";
import { rankStrengths, scoreTopics, type Lookups, type TopicScore } from "./strengths-core";

const now = new Date("2026-11-07T10:00:00Z");
const look: Lookups = {
  topicTitle: (id) => ({ depression: "Depression", bipolar: "Bipolar", anxiety: "Anxiety", brain: "Brain" })[id] ?? null,
  moduleExists: (id) => id !== "bipolar",
  hasBank: (id) => id === "depression",
  subjectTitle: (s) => (s === "statistics" ? "Statistics" : null),
  subjectStudyHref: () => "/study/statistics",
};
const t = (id: string, p: number, n = 10): TopicScore => ({ id, title: id, kind: "topic", p, n, studyHref: null, practiceHref: "/x" });

describe("scoreTopics", () => {
  it("returns nothing for a new student", () => {
    expect(scoreTopics({ skills: [], tests: {}, profile: { sessions: 0, dims: [] } }, look, now)).toEqual([]);
  });

  it("pools skills of one topic, adds module tests, and skips thin evidence", () => {
    const out = scoreTopics(
      {
        skills: [
          { skill: "depression:criteria", theta: 2, n: 4, lastAt: now.toISOString() },
          { skill: "depression:apply", theta: 2, n: 2, lastAt: now.toISOString() },
          { skill: "anxiety:criteria", theta: 0, n: 1, lastAt: now.toISOString() },
          { skill: "prep-statistics:apply", theta: -1, n: 5, lastAt: now.toISOString() },
          { skill: "prep-unknown:apply", theta: 0, n: 9, lastAt: now.toISOString() },
        ],
        tests: { brain: { best: 4, total: 10 } },
        profile: { sessions: 1, dims: [{ key: "risk_timing", label: "Risk assessment", score: 0.2 }] },
      },
      look,
      now,
    );
    const ids = out.map((o) => o.id).sort();
    expect(ids).toEqual(["brain", "depression", "prep-statistics"]);
    const dep = out.find((o) => o.id === "depression")!;
    expect(dep.n).toBe(6);
    expect(dep.studyHref).toBe("/study/depression");
    expect(dep.practiceHref).toContain("/study/map/practice?topic=depression");
    const stats = out.find((o) => o.id === "prep-statistics")!;
    expect(stats.title).toBe("Statistics");
    expect(stats.practiceHref).toBe("/prep/practice/statistics");
    expect(out.find((o) => o.id === "brain")!.p).toBeCloseTo(0.4);
  });

  it("uses Consulting Room signals once there are two sessions", () => {
    const out = scoreTopics({ skills: [], tests: {}, profile: { sessions: 3, dims: [{ key: "risk_timing", label: "Risk assessment", score: 0.3 }] } }, look, now);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ title: "Risk assessment", practiceHref: "/practice/consulting-room", studyHref: null });
  });
});

describe("rankStrengths", () => {
  it("is empty without data", () => {
    expect(rankStrengths([]).hasData).toBe(false);
  });

  it("never lists a topic twice and caps each list at three", () => {
    const r = rankStrengths([t("a", 0.95), t("b", 0.9), t("c", 0.85), t("d", 0.7), t("e", 0.4), t("f", 0.3), t("g", 0.2), t("h", 0.1)]);
    expect(r.strongest.map((x) => x.id)).toEqual(["a", "b", "c"]);
    expect(r.weakest.map((x) => x.id)).toEqual(["h", "g", "f"]);
  });

  it("does not call a high score weak, nor a low score strong", () => {
    const high = rankStrengths([t("a", 0.95), t("b", 0.92), t("c", 0.9), t("d", 0.88)]);
    expect(high.weakest).toEqual([]);
    const low = rankStrengths([t("a", 0.3), t("b", 0.2)]);
    expect(low.strongest).toEqual([]);
    expect(low.weakest.map((x) => x.id)).toEqual(["b", "a"]);
  });
});
