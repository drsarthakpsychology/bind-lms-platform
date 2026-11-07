import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { ADMIN_ITEMS, STUDENT_ITEMS } from "./nav-config";
import { activeNavHref, backTarget, isFocusPath, isRunPath, safeFrom, sectionOf } from "./sections";
import { studentItems } from "./nav-config";

const lit = (path: string, from?: string) => activeNavHref(STUDENT_ITEMS, path, from);

describe("which menu item lights up", () => {
  it("Practice tools light Practice, never Games", () => {
    for (const p of ["/practice", "/practice/daily", "/practice/detective", "/practice/scenarios", "/practice/terms", "/practice/mse", "/practice/formulation", "/practice/consulting-room", "/practice/judgment", "/practice/osce"]) {
      expect(lit(p), p).toBe("/practice");
    }
  });

  it("games light Games, never Practice", () => {
    for (const p of ["/games", "/games/duel", "/games/blitz", "/games/sort", "/games/mse", "/games/ward", "/games/rx", "/games/escape", "/games/comorbid", "/games/lab", "/games/lab/stroop"]) {
      expect(lit(p), p).toBe("/games");
    }
  });

  it("Medicines wins over Practice, and its old library address too", () => {
    expect(lit("/practice/medicines")).toBe("/practice/medicines");
    expect(lit("/practice/medicines/abc")).toBe("/practice/medicines");
    expect(lit("/tools/psychopharm/x")).toBe("/practice/medicines");
  });

  it("Smart practice tools on older /games addresses light Exam Prep", () => {
    for (const p of ["/prep/smart/coach", "/prep/smart/quizzes", "/prep/smart/revise", "/prep/smart/play", "/prep/smart", "/prep/saved", "/prep/mock/cuet"]) {
      expect(lit(p), p).toBe("/prep");
    }
  });

  it("the section the student came from wins", () => {
    expect(lit("/prep/smart/play", "/study/mood")).toBe("/study");
    expect(lit("/prep/smart/play", "/practice/weak-spots")).toBe("/practice");
    expect(lit("/prep/smart/play", "/prep/smart/quizzes")).toBe("/prep");
    expect(lit("/practice/daily", "/dashboard")).toBe("/dashboard");
    expect(lit("/practice/scenarios", "/study/notes/dsm-psychosis")).toBe("/study");
  });

  it("ignores unsafe from values", () => {
    expect(lit("/practice/daily", "https://evil.test")).toBe("/practice");
    expect(lit("/practice/daily", "//evil.test")).toBe("/practice");
    expect(lit("/practice/daily", "/admin/students")).toBe("/practice");
  });

  it("Home only for /dashboard itself; More items by prefix", () => {
    expect(lit("/dashboard")).toBe("/dashboard");
    expect(lit("/progress")).toBe("/progress");
    expect(lit("/practice/leaderboard")).toBe("/leaderboard");
    expect(lit("/settings")).toBeNull();
  });

  it("exactly one item is active", () => {
    const n = STUDENT_ITEMS.filter((i) => i.href === lit("/practice/daily")).length;
    expect(n).toBe(1);
  });

  it("admin places still follow their tabs (longest wins)", () => {
    expect(activeNavHref(ADMIN_ITEMS, "/admin")).toBe("/admin");
    expect(activeNavHref(ADMIN_ITEMS, "/admin/students/logins")).toBe("/admin/students");
    expect(activeNavHref(ADMIN_ITEMS, "/admin/pulse")).toBe("/admin/activity");
    expect(activeNavHref(ADMIN_ITEMS, "/admin/psychopharm/editor/x")).toBe("/admin/courses");
  });
});

describe("where Back goes", () => {
  it("Practice tools go back to Practice", () => {
    for (const p of ["/practice/daily", "/practice/detective", "/practice/scenarios", "/practice/terms"]) {
      expect(backTarget(p, null), p).toEqual({ href: "/practice", label: "Back to Practice" });
    }
  });

  it("games go back to Games", () => {
    for (const p of ["/games/duel", "/games/blitz", "/games/sort", "/games/mse", "/games/ward", "/games/rx", "/games/escape", "/games/comorbid"]) {
      expect(backTarget(p, null), p).toEqual({ href: "/games", label: "Back to Games" });
    }
  });

  it("Smart practice tools go back to Smart practice", () => {
    for (const p of ["/prep/smart/coach", "/prep/smart/play"]) expect(backTarget(p, null)).toEqual({ href: "/prep/smart", label: "Back to Smart practice" });
  });

  it("from wins: module, note, Home, quiz path, another tool", () => {
    expect(backTarget("/prep/smart/play", "/study/mood")).toEqual({ href: "/study/mood", label: "Back to the module" });
    expect(backTarget("/practice/scenarios", "/study/notes/dsm-psychosis")).toEqual({ href: "/study/notes/dsm-psychosis", label: "Back to the note" });
    expect(backTarget("/practice/daily", "/dashboard")).toEqual({ href: "/dashboard", label: "Back to Home" });
    expect(backTarget("/prep/smart/play", "/prep/smart/quizzes")).toEqual({ href: "/prep/smart/quizzes", label: "Back to the quiz path" });
    expect(backTarget("/prep/smart/play", "/practice/weak-spots")).toEqual({ href: "/practice/weak-spots", label: "Back to the practice tool" });
  });

  it("an explicit fallback is used when there is no from", () => {
    expect(backTarget("/games/duel", null, "/games")).toEqual({ href: "/games", label: "Back to Games" });
    expect(backTarget("/practice/daily", null, "/practice").href).toBe("/practice");
  });

  it("never goes off site or to itself", () => {
    expect(safeFrom("https://x.test")).toBeNull();
    expect(safeFrom("/practice/daily", "/practice/daily")).toBeNull();
    expect(safeFrom("/study/mood?x=1")).toBeNull();
    expect(backTarget("/practice/daily", "javascript:alert(1)").href).toBe("/practice");
  });

  it("section of a page", () => {
    expect(sectionOf("/practice/daily")).toBe("/practice");
    expect(sectionOf("/prep/smart/coach")).toBe("/prep");
    expect(sectionOf("/games/duel")).toBe("/games");
  });
});

describe("old addresses keep working", () => {
  it("Practice tools moved out of /games redirect to /practice", async () => {
    const rules = await nextConfig.redirects!();
    for (const tool of ["daily", "detective", "scenarios", "terms"]) {
      const hit = rules.find((r) => r.source === "/games/:tool(daily|detective|scenarios|terms)");
      expect(hit?.destination).toBe("/practice/:tool");
      expect(new RegExp("^(daily|detective|scenarios|terms)$").test(tool)).toBe(true);
    }
    // Older /study and /practice/learn links go straight to Practice too (one hop).
    expect(rules.find((r) => r.source === "/study/:tool(detective|scenarios|terms)")?.destination).toBe("/practice/:tool");
    expect(rules.find((r) => r.source === "/practice/learn/:tool(detective|scenarios|terms)")?.destination).toBe("/practice/:tool");
    expect(rules.find((r) => r.source === "/games/:tool(coach|play|quizzes|revise)")?.destination).toBe("/prep/smart/:tool");
    // No rule sends a Practice tool to /games any more.
    for (const r of rules) expect(`${r.source} -> ${r.destination}`).not.toMatch(/(detective|scenarios|terms|daily).*-> \/games/);
  });
});

describe("focus pages fold the sidebar to icons", () => {
  it("questions, reading and games are focus pages", () => {
    for (const p of [
      "/prep/psychopathology",
      "/prep/psychopathology/anxiety",
      "/prep/practice/psychopathology",
      "/prep/smart",
      "/prep/saved",
      "/prep/wrong",
      "/prep/review",
      "/prep/mock/cuet-pg",
      "/study/mood/1-2",
      "/study/mood/checkpoint/1",
      "/study/notes",
      "/study/notes/dsm-psychosis",
      "/study/reference",
      "/study/reference/lithium",
      "/games/duel",
      "/games/blitz",
      "/prep/smart/coach",
      "/prep/smart/play",
      "/games/lab/stroop",
      "/practice/daily",
      "/practice/detective",
    ]) {
      expect(isFocusPath(p), p).toBe(true);
    }
  });

  it("hubs and lists keep the full sidebar", () => {
    for (const p of ["/dashboard", "/prep", "/prep/goal", "/prep/mock", "/prep/mock/result/abc", "/study", "/study/mood", "/study/map", "/study/placement", "/games", "/games/leaderboard", "/games/lab", "/games/lab/cases", "/practice", "/practice/medicines", "/courses", "/admin/students"]) {
      expect(isFocusPath(p), p).toBe(false);
    }
  });
});

describe("runs hide the phone bottom bar", () => {
  it("answering, reading one text, playing", () => {
    for (const p of ["/prep/psychopathology/anxiety", "/prep/smart", "/prep/smart/coach", "/prep/smart/play", "/prep/saved", "/prep/wrong", "/prep/mock/cuet-pg", "/prep/interview", "/study/mood/1-2", "/study/mood/checkpoint/1", "/study/notes/dsm-psychosis", "/study/reference/lithium", "/study/map/practice", "/games/duel", "/games/rx", "/games/lab/stroop", "/practice/daily", "/practice/terms", "/practice/mse", "/practice/consulting-room"]) {
      expect(isRunPath(p), p).toBe(true);
    }
  });

  it("hubs, lists and tools without their own Back keep it", () => {
    for (const p of ["/dashboard", "/prep", "/prep/psychopathology", "/prep/mock", "/prep/mock/result/x", "/prep/smart/quizzes", "/prep/smart/revise", "/study", "/study/mood", "/study/notes", "/study/reference", "/games", "/games/lab", "/practice", "/practice/medicines", "/practice/osce", "/practice/library"]) {
      expect(isRunPath(p), p).toBe(false);
    }
  });

  it("every run is also a focus page", () => {
    for (const p of ["/prep/smart", "/study/mood/1-2", "/games/duel", "/practice/daily"]) expect(isFocusPath(p)).toBe(true);
    expect(isFocusPath("/practice/osce")).toBe(true);
  });
});

describe("menu hides switched-off places", () => {
  it("Journal only when its switch is on", () => {
    const hrefs = (flags: Record<string, string>) => studentItems({ showStudy: true, flags }).map((i) => i.href);
    expect(hrefs({})).not.toContain("/reflect");
    expect(hrefs({ journal: "live" })).not.toContain("/reflect");
    expect(hrefs({ journal: "unlocked" })).toContain("/reflect");
    expect(hrefs({})).toContain("/practice");
  });
});
