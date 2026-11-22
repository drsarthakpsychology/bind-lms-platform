import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { NOTES } from "@/lib/learn/notes";
import { MEDS } from "@/lib/meds";
import { DISORDERS } from "@/lib/reference/disorders";
import { MODULES } from "@/lib/study";
import { QUICK_ID, QUICK_NOTES, CRITERIA_SOURCE_LINE, quickNoteById, quickNotesForModule, REPLACED_SLUGS } from "./index";
import { quickNoteText, quickNoteView } from "./view";

const views = QUICK_NOTES.map((n) => ({ n, v: quickNoteView(n) }));

describe("Quick Notes data", () => {
  it("has the first 40 notes, ADHD first, with unique typed ids", () => {
    expect(QUICK_NOTES).toHaveLength(40);
    expect(QUICK_NOTES[0].id).toBe("criteria-adhd");
    expect(new Set(QUICK_NOTES.map((n) => n.id)).size).toBe(40);
    for (const n of QUICK_NOTES) {
      expect(QUICK_ID.test(n.id), n.id).toBe(true);
      expect(n.id.startsWith(n.type === "distinction" ? "compare-" : n.type === "differential" ? "diff-" : n.type === "assessment" ? "assess-" : `${n.type}-`), n.id).toBe(true);
    }
    // Old summary ids never look like typed ids, so one address can open either.
    for (const n of NOTES) expect(QUICK_ID.test(n.id), n.id).toBe(false);
  });

  it("every note names its sources and who checked it", () => {
    for (const n of QUICK_NOTES) {
      expect(n.source.basis.length, n.id).toBeGreaterThan(0);
      expect(n.source.checkedBy.trim(), n.id).not.toBe("");
      expect(n.source.checkedOn, n.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("keeps lines short, blocks small and tables compact", () => {
    for (const { n, v } of views) {
      for (const t of quickNoteText(v)) expect(t.length, `${n.id}: ${t}`).toBeLessThanOrEqual(140);
      for (const s of v.sections) {
        expect((s.bullets ?? []).length, `${n.id} ${s.title}`).toBeLessThanOrEqual(7);
        expect((s.steps ?? []).length, `${n.id} ${s.title}`).toBeLessThanOrEqual(7);
        expect((s.pairs ?? []).length, `${n.id} ${s.title}`).toBeLessThanOrEqual(8);
        if (s.table) {
          expect(s.table.rows.length, `${n.id} ${s.title}`).toBeLessThanOrEqual(8);
          for (const r of s.table.rows) expect(r.length, `${n.id} ${s.title}`).toBe(s.table.head.length);
        }
      }
      if (v.alert) expect(v.alert.points.length, n.id).toBeLessThanOrEqual(7);
    }
  });

  it("follows the text rules: no dashes, maths symbols, book names, exam names or copied manual phrases", () => {
    const banned = [
      /[–—]/, // en and em dash
      /[≥≤≠↑↓→]|<\s?\d|>\s?\d|~\d/,
      /stahl|kaplan|sadock|maudsley|ahuja|page \d/i,
      /\b(neet|ugc|net exam|mrcpsych|cuet|usmle|plab)\b/i,
      /clinically significant distress or impairment in social, occupational/i,
      /not attributable to the physiological effects/i,
      /criterion [a-e]\b/i,
    ];
    for (const { n, v } of views) {
      const text = quickNoteText(v).join("\n");
      for (const re of banned) expect(re.test(text), `${n.id} ${re}`).toBe(false);
    }
  });

  it("criteria notes end with the fixed source line and say treatment is for learning", () => {
    for (const { n, v } of views) {
      if (n.type === "criteria") {
        expect(v.sourceLine, n.id).toBe(CRITERIA_SOURCE_LINE);
        expect(v.facts.length, n.id).toBeGreaterThanOrEqual(2);
      } else expect(v.sourceLine, n.id).toBeNull();
      if (n.type === "criteria" || n.type === "pharm" || n.type === "therapy") expect(v.careLine, n.id).toBeTruthy();
    }
  });

  it("the ADHD template has every slot the owner asked for", () => {
    const v = quickNoteView(quickNoteById("criteria-adhd")!);
    expect(v.facts.map((f) => f.label)).toEqual(["Threshold", "Duration", "Onset", "Settings", "Impairment"]);
    expect(v.sections.map((s) => s.title)).toEqual(expect.arrayContaining(["Core picture", "Inattention (9 possible signs)", "Hyperactivity and impulsivity (9 possible signs)", "Presentations", "Rule out", "Look-alikes", "First-line care"]));
    expect(v.deeper.some((l) => l.target.screen === "studyModule")).toBe(true);
    expect(v.practise.some((l) => l.label.includes("quiz"))).toBe(true);
  });

  it("every link points at something real", () => {
    const quickIds = new Set(QUICK_NOTES.map((n) => n.id));
    const slugs = new Set(DISORDERS.map((d) => d.slug));
    for (const n of QUICK_NOTES) {
      if (n.links.moduleId) expect(MODULES.some((m) => m.id === n.links.moduleId), `${n.id} module`).toBe(true);
      if (n.links.summaryId) expect(NOTES.some((x) => x.id === n.links.summaryId), `${n.id} summary`).toBe(true);
      for (const r of n.links.related ?? []) expect(quickIds.has(r), `${n.id} related ${r}`).toBe(true);
      for (const m of n.links.medicines ?? []) expect(MEDS.some((x) => x.id === m), `${n.id} medicine ${m}`).toBe(true);
      for (const s of n.replaces ?? []) expect(slugs.has(s), `${n.id} replaces ${s}`).toBe(true);
      const ids = n.type === "criteria" ? n.differentials.map((d) => d.noteId) : n.type === "differential" ? n.rows.map((r) => r.noteId) : [];
      for (const id of ids) if (id) expect(quickIds.has(id), `${n.id} look-alike ${id}`).toBe(true);
      expect(n.links.moduleId || n.links.summaryId, `${n.id} has a lesson link`).toBeTruthy();
    }
    expect(new Set(REPLACED_SLUGS.keys()).size).toBe([...REPLACED_SLUGS.keys()].length);
  });

  it("links both ways: each module lists the notes that point at it", () => {
    for (const n of QUICK_NOTES) if (n.links.moduleId) expect(quickNotesForModule(n.links.moduleId).some((x) => x.id === n.id)).toBe(true);
    expect(quickNotesForModule("child").map((x) => x.id)).toEqual(expect.arrayContaining(["criteria-adhd", "criteria-autism"]));
  });

  it("the phone keeps an exact copy of the view types", () => {
    const root = join(__dirname, "../../..");
    const web = readFileSync(join(root, "src/lib/quick-notes/view-types.ts"), "utf8");
    const app = readFileSync(join(root, "apps/mobile/src/library/quick-notes-types.ts"), "utf8");
    expect(app.split("\n").slice(1).join("\n")).toBe(web);
  });
});

describe("Quick Notes library and search", () => {
  it("one list with typed notes, summaries, disorder cards, words and medicines", async () => {
    const { quickLibrary } = await import("./library");
    const lib = quickLibrary();
    const keys = lib.items.map((i) => i.key);
    expect(new Set(keys).size).toBe(keys.length);
    const types = new Set(lib.items.map((i) => i.type));
    for (const t of ["criteria", "summary", "distinction", "differential", "pharm", "therapy", "theory", "assessment", "term"]) expect(types.has(t as never), t).toBe(true);
    // Replaced cards are not listed twice.
    expect(keys).not.toContain("ref:adhd");
    expect(keys).toContain("criteria-adhd");
    expect(lib.items.find((i) => i.key === "criteria-adhd")?.app).toBe("/notes/criteria-adhd");
  });

  it("finds words inside a note, not only in titles", async () => {
    const { searchQuick } = await import("./library");
    const top = (q: string) => searchQuick(q).hits.map((h) => h.key);
    expect(top("lithium level")).toContain("pharm-lithium");
    expect(top("hoover")).toContain("compare-somatic");
    expect(top("ADHD")[0]).toBe("criteria-adhd");
    expect(top("before age 12")).toContain("criteria-adhd");
    expect(top("serial sevens")).toContain("assess-mse");
    expect(top("catatonia").length).toBeGreaterThan(0);
    const hit = searchQuick("refeeding").hits.find((h) => h.key === "criteria-eating");
    expect(hit?.snippet).toMatch(/refeeding/i);
    expect(searchQuick("   ").hits).toEqual([]);
    expect(searchQuick("zzzqqq").hits).toEqual([]);
  });
});
