import { describe, expect, it } from "vitest";
import { pickResume } from "./resume-pick";

const tools = [
  { href: "/practice/mse", title: "MSE" },
  { href: "/practice/consulting-room", title: "Consulting Room" },
];

describe("resume where you left off", () => {
  it("returns the newest visit to an open tool, keeping the exact page", () => {
    const r = pickResume([{ path: "/practice/leaderboard" }, { path: "/practice/consulting-room/session/9?x=1" }, { path: "/practice/mse" }], tools);
    expect(r).toEqual({ href: "/practice/consulting-room/session/9", title: "Consulting Room" });
  });
  it("never points at a tool that is not open", () => {
    expect(pickResume([{ path: "/practice/osce" }], tools)).toBeNull();
    expect(pickResume([{ path: "/practice/mse-other" }], tools)).toBeNull();
  });
});
