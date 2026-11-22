import { pushSetupProblem } from "@/push";
import { pushProblemLine } from "@/screens/notifications/prefs";

describe("push set-up", () => {
  it("says what is missing from the build, and nothing when it is complete", () => {
    expect(pushSetupProblem("web", true, undefined, undefined)).toBe("web");
    expect(pushSetupProblem("android", false, undefined, "p")).toBe("web");
    expect(pushSetupProblem("android", true, { projectId: false, firebase: true }, undefined)).toBe("no_project_id");
    expect(pushSetupProblem("android", true, { projectId: true, firebase: false }, "p")).toBe("no_firebase");
    expect(pushSetupProblem("ios", true, { projectId: true, firebase: false }, "p")).toBeNull();
    expect(pushSetupProblem("android", true, { projectId: true, firebase: true }, "p")).toBeNull();
    // An older build that does not say: try for a token and see.
    expect(pushSetupProblem("android", true, undefined, undefined)).toBeNull();
  });

  it("Settings says plainly when notifications cannot work", () => {
    expect(pushProblemLine(null)).toBeNull();
    expect(pushProblemLine("web")).toBeNull();
    expect(pushProblemLine("no_firebase")).toMatch(/not set up in this version/);
    expect(pushProblemLine("token_failed")).toMatch(/under the bell/);
    expect(pushProblemLine("denied")).toMatch(/phone's settings/);
    for (const p of ["no_firebase", "denied"] as const) expect(pushProblemLine(p)).not.toMatch(/[–—]/);
  });
});
