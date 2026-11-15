import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({ doc: vi.fn(async () => null as unknown) }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/psychopharm/published-doc", () => ({ getPublishedMedicationDocument: h.doc }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { MEDS, medById } from "@/lib/meds";
import { SECTION_ORDER } from "@/lib/meds/sections";
import { mechanismOf } from "@/lib/meds/mechanisms";
import { drugList } from "@/lib/psychopharm/store";
import { slugOf } from "@/lib/app-api/library";
import { GET as meds } from "./medicines/route";
import { GET as med } from "./medicines/[medId]/route";
import { GET as refHome } from "./reference/route";
import { GET as refSearch } from "./reference/search/route";
import { GET as refCompare } from "./reference/compare/route";
import { GET as refDrug } from "./reference/[slug]/route";

beforeEach(() => {
  resetGuard();
  clearDeviceCache();
  h.doc.mockReset();
  h.doc.mockResolvedValue(null);
});

describe("medicines", () => {
  it("lists every medicine with its usual dose, in the app's names too", async () => {
    const r = await read(await meds(appReq("/library/medicines"), noParams));
    expect(r.data.rows).toHaveLength(MEDS.length);
    expect(r.data.classes).toEqual(r.data.groups);
    const first = r.data.rows[0];
    expect(first).toMatchObject({ id: MEDS[0].id, name: MEDS[0].name, className: MEDS[0].cls, dose: expect.any(String) });
    expect(first.keyDose).toBe(first.dose);
  });

  it("filters with the website's search rule and by group", async () => {
    const m = MEDS[0];
    const r = await read(await meds(appReq(`/library/medicines?q=${encodeURIComponent(m.name)}`), noParams));
    expect(r.data.rows.map((x: { id: string }) => x.id)).toContain(m.id);
    const g = await read(await meds(appReq(`/library/medicines?group=${encodeURIComponent(m.group)}`), noParams));
    expect(g.data.rows.every((x: { group: string }) => x.group === m.group)).toBe(true);
  });

  it("a medicine page keeps the website's order: facts first, How it works last, with the pictures", async () => {
    const withMech = MEDS.find((m) => mechanismOf(m.id))!;
    const p = await read(await med(appReq(`/library/medicines/${withMech.id}`), params({ medId: withMech.id })));
    const ids: string[] = p.data.sections.map((s: { id: string }) => s.id);
    expect(ids[0]).toBe("uses");
    expect(ids.at(-1)).toBe("how-it-works");
    // Never out of the website's order.
    expect([...ids].sort((a, b) => SECTION_ORDER.indexOf(a as never) - SECTION_ORDER.indexOf(b as never))).toEqual(ids);
    const how = p.data.sections.at(-1);
    expect(how.diagrams.length).toBeGreaterThan(0);
    expect(how.diagrams.map((d: { kind: string }) => d.kind)).toContain("journey");
    const doses = p.data.sections.find((s: { id: string }) => s.id === "doses");
    expect(doses.doses).toHaveLength(medById(withMech.id)!.doses.length);
    expect(p.data.summary.student).toBe(withMech.student);
    expect(p.data.study === null || p.data.study.target.screen === "studyModule").toBe(true);
  });

  it("unknown medicine is not found; Medicines switched off or lectures-only is closed", async () => {
    expect((await read(await med(appReq("/library/medicines/nope"), params({ medId: "nope" })))).status).toBe(404);
    G.blocks = ["medicines"];
    expect((await read(await meds(appReq("/library/medicines"), noParams))).error?.code).toBe("access_block");
    expect((await read(await refHome(appReq("/library/reference"), noParams))).error?.code).toBe("access_block");
    G.blocks = [];
    G.db.tables.profiles[0] = profileRow({ scope: "lectures_only" });
    expect((await read(await meds(appReq("/library/medicines"), noParams))).error?.code).toBe("scope");
  });
});

describe("psychopharmacology reference", () => {
  const first = drugList()[0];
  const second = drugList()[1];

  it("home lists every medicine and the receptor groups", async () => {
    const r = await read(await refHome(appReq("/library/reference"), noParams));
    expect(r.data.drugs).toHaveLength(drugList().length);
    expect(r.data.notice).toMatch(/Educational/);
  });

  it("search, one medicine without sources, and compare", async () => {
    const s = await read(await refSearch(appReq(`/library/reference/search?q=${encodeURIComponent(first.slice(0, 4))}`), noParams));
    expect(Array.isArray(s.data.items)).toBe(true);
    const d = await read(await refDrug(appReq(`/library/reference/${slugOf(first)}`), params({ slug: slugOf(first) })));
    expect(d.data).toMatchObject({ name: first, document: null });
    expect(d.data.detail).not.toHaveProperty("source_id");
    expect(d.data.detail).not.toHaveProperty("source_title");
    const c = await read(await refCompare(appReq(`/library/reference/compare?drugs=${slugOf(first)},${slugOf(second)}`), noParams));
    expect(c.data.drugs.map((x: { name: string }) => x.name)).toEqual([first, second]);
    expect(c.data.fields[0]).toEqual({ key: "class", label: "Class" });
    expect((await read(await refCompare(appReq(`/library/reference/compare?drugs=${slugOf(first)}`), noParams))).status).toBe(400);
    expect((await read(await refDrug(appReq("/library/reference/nope-x"), params({ slug: "nope-x" })))).status).toBe(404);
  });

  it("a published document is sent without hidden blocks or sources", async () => {
    h.doc.mockResolvedValue({ generic_name: first, sections: [{ id: "s", title: "Uses", blocks: [{ id: "b2", type: "note", value: "two", order: 2, sources: [{ title: "Book" }] }, { id: "b1", type: "note", value: "one", order: 1, sources: [] }, { id: "b3", type: "note", value: "x", order: 3, hidden: true, sources: [] }] }] });
    const d = await read(await refDrug(appReq(`/library/reference/${slugOf(first)}`), params({ slug: slugOf(first) })));
    expect(d.data.document.sections[0].blocks).toEqual([
      { id: "b1", type: "note", value: "one", data: null },
      { id: "b2", type: "note", value: "two", data: null },
    ]);
  });
});
