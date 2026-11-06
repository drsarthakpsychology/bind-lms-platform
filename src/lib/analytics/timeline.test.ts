import { describe, expect, it } from "vitest";
import { buildTimeline } from "./timeline";

const L = "11111111-1111-1111-1111-111111111111";
const title = (id: string) => (id === L ? "MSE basics" : "Lecture");

describe("buildTimeline", () => {
  it("groups visits into sessions with a 30-minute gap", () => {
    const ev = buildTimeline({
      visits: [
        { path: "/dashboard", entered_at: "2026-11-05T10:00:00Z", duration_seconds: 120 },
        { path: `/courses/c/lessons/${L}`, entered_at: "2026-11-05T10:03:00Z", duration_seconds: 600 },
        { path: "/dashboard", entered_at: "2026-11-05T12:00:00Z", duration_seconds: 60 },
      ],
      progress: [],
      lessonTitle: title,
    });
    expect(ev.filter((e) => e.kind === "session").length).toBe(2);
    expect(ev.find((e) => e.kind === "lecture-start")?.text).toBe("Opened lecture: MSE basics");
  });
  it("lecture progress, completion, checks, newest first", () => {
    const ev = buildTimeline({
      visits: [],
      progress: [{ lesson_id: L, watched_seconds: 1500, is_completed: true, updated_at: "2026-11-05T11:00:00Z" }],
      lessonTitle: title,
      checks: [
        { asked_at: "2026-11-05T10:40:00Z", answered_at: null, missed: true, lesson_id: L },
        { asked_at: "2026-11-05T10:20:00Z", answered_at: "2026-11-05T10:20:05Z", missed: false, lesson_id: L },
      ],
    });
    expect(ev.map((e) => e.kind)).toEqual(["lecture-done", "check-missed", "check-ok"]);
    expect(ev[0].detail).toBe("25 min watched");
  });
});
