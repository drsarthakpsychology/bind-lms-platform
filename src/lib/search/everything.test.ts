import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const state = vi.hoisted(() => ({
  blocks: [] as string[],
  flags: {} as Record<string, string>,
  courses: [] as { id: string }[],
  students: [] as Record<string, unknown>[],
  courseCalls: 0,
}));

vi.mock("@/lib/access/blocks", () => ({ loadMyBlocks: async () => state.blocks }));
vi.mock("@/lib/flags", () => ({ readFlags: async () => state.flags }));
vi.mock("@/lib/course/mine", () => ({
  loadMyCourses: async () => {
    state.courseCalls++;
    return state.courses;
  },
}));
vi.mock("@/components/course/course-overview", () => ({
  loadCourseOverview: async (id: string) => ({
    courseId: id,
    title: "Clinical psychology",
    weeks: [
      {
        num: 1,
        lessons: [
          { id: "l-open", title: "Mental state examination", number: 1, href: `/courses/${id}/lessons/l-open` },
          { id: "l-locked", title: "Mental status advanced", number: 2, href: null },
        ],
        materials: [{ id: "f1", title: "MSE checklist", meta: "PDF · reading", href: `/courses/${id}/materials/f1` }],
      },
    ],
  }),
}));
vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => ({ from: () => ({ select: () => ({ eq: () => ({ limit: async () => ({ data: state.students }) }) }) }) }),
}));
vi.mock("@/lib/corpus/library", () => ({ getLibraryDocs: async () => [], filterLibrary: () => [] }));

import { _resetSearchCaches, gatesFor, parseTypes, searchEverything, typesFor } from "./everything";
import type { Profile } from "@/lib/auth/session";

const student = { id: "u1", role: "student", scope: "full", status: "active" } as unknown as Profile;
const lecturesOnly = { ...student, id: "u2", scope: "lectures_only" } as Profile;
const admin = { id: "a1", role: "admin", scope: "full", status: "active" } as unknown as Profile;

beforeEach(() => {
  _resetSearchCaches();
  state.blocks = [];
  state.flags = { learn: "unlocked", landmark: "unlocked", osce: "unlocked", formulation: "unlocked", two_minute_clinic: "unlocked" };
  state.courses = [{ id: "c1" }];
  state.students = [{ id: "s9", email: "riya.k@example.com", name: "Riya Kapoor", roll_number: "VSP-014", mobile_number: "9800000000" }];
  state.courseCalls = 0;
});

const types = (r: { results: { type: string }[] }) => [...new Set(r.results.map((x) => x.type))];

describe("search everything", () => {
  it("finds lectures, files, modules, medicines and words in one go", async () => {
    const a = await searchEverything(student, "mental state");
    expect(a.results[0]).toMatchObject({ id: "lecture:l-open", type: "lecture", app: "/lecture/l-open", href: "/courses/c1/lessons/l-open" });
    const med = await searchEverything(student, "lithum");
    expect(med.results.find((r) => r.type === "medicine")?.title).toBe("Lithium");
    const files = await searchEverything(student, "checklist");
    expect(files.results.some((r) => r.id === "file:f1" && r.app === "/material/f1")).toBe(true);
  });

  it("never finds a lecture the student cannot open", async () => {
    const a = await searchEverything(student, "mental status advanced");
    expect(a.results.some((r) => r.id === "lecture:l-locked")).toBe(false);
  });

  it("a lecture-only account finds only lectures and files", async () => {
    const a = await searchEverything(lecturesOnly, "mental");
    expect(a.types).toEqual(["lecture", "file"]);
    expect(types(a).every((t) => t === "lecture" || t === "file")).toBe(true);
    const meds = await searchEverything(lecturesOnly, "lithium");
    expect(meds.results).toEqual([]);
  });

  it("respects sections switched off for the student and feature switches", async () => {
    state.blocks = ["medicines"];
    state.flags = { learn: "off" };
    const a = await searchEverything(student, "lithium");
    expect(a.types).not.toContain("medicine");
    expect(a.types).not.toContain("module");
    expect(a.results.some((r) => r.type === "medicine" || r.type === "module")).toBe(false);
  });

  it("students never get the student list; admins do", async () => {
    expect((await searchEverything(student, "riya")).results.some((r) => r.type === "student")).toBe(false);
    const a = await searchEverything(admin, "riya kapor");
    expect(a.results.find((r) => r.type === "student")).toMatchObject({ title: "Riya Kapoor", app: "/student/s9", href: "/admin/students/s9" });
    expect((await searchEverything(admin, "vsp-014")).results[0]?.id).toBe("student:s9");
  });

  it("cases show the title, never the answer", async () => {
    const a = await searchEverything(student, "rosenhan");
    const kase = a.results.find((r) => r.type === "case");
    expect(kase?.app).toMatch(/^\/case\/landmark\?item=/);
  });

  it("filters by type and keeps a few of each", async () => {
    const a = await searchEverything(student, "depression", { types: ["module"] });
    expect(types(a)).toEqual(["module"]);
    const b = await searchEverything(student, "a", {});
    expect(b.results).toEqual([]);
    const c = await searchEverything(student, "disorder", { perType: 2 });
    for (const t of types(c)) expect(c.results.filter((r) => r.type === t).length).toBeLessThanOrEqual(2);
  });

  it("caches a person's lectures briefly", async () => {
    await searchEverything(student, "mental", { now: 1000 });
    await searchEverything(student, "checklist", { now: 2000 });
    expect(state.courseCalls).toBe(1);
    await searchEverything(student, "mental", { now: 100_000 });
    expect(state.courseCalls).toBe(2);
  });

  it("parses the types list and gates purely", () => {
    expect(parseTypes("lecture, module,nope")).toEqual(["lecture", "module"]);
    expect(parseTypes("")).toBeUndefined();
    expect(typesFor(gatesFor(admin, [], {}))).toContain("student");
    expect(typesFor(gatesFor(student, [], {}))).toEqual(["lecture", "medicine", "file"]);
  });

  it("no result text has a dash", async () => {
    for (const q of ["depression", "lithium", "anxiety", "schizophrenia"]) {
      for (const r of (await searchEverything(student, q)).results) expect(`${r.title} ${r.meta}`, r.id).not.toMatch(/[–—]/);
    }
  });
});
