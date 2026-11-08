// @vitest-environment jsdom
/** Every medicine page puts the practical facts first and "How it works" last, under its own anchor. */
import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { MEDS, medById } from "@/lib/meds";
import { mechanismOf } from "@/lib/meds/mechanisms";
import { HOW_IT_WORKS, SECTION_ORDER, howItWorksHref, splitTell } from "@/lib/meds/sections";
import { halfLifeOf, medVisuals } from "@/lib/meds/visuals";
import { MedicineView } from "./medicine-view";

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});

describe("medicine page order", () => {
  it("sections follow the practical order on every page, with How it works last and anchored", () => {
    for (const med of MEDS) {
      const related = med.related.map(medById).filter((m): m is NonNullable<typeof m> => Boolean(m)).map((m) => ({ id: m.id, name: m.name, cls: m.cls }));
      const { container, unmount } = render(<MedicineView med={med} related={related} mech={mechanismOf(med.id)} visuals={medVisuals(med.id)} half={halfLifeOf(med.id)} />);
      const ids = [...container.querySelectorAll("[data-section]")].map((el) => el.getAttribute("data-section"));
      // Every section that is shown appears in the agreed order.
      const pos = ids.map((id) => SECTION_ORDER.indexOf(id as (typeof SECTION_ORDER)[number]));
      expect(pos.every((p) => p >= 0), `${med.id}: ${ids.join(",")}`).toBe(true);
      expect(pos, `${med.id}: ${ids.join(",")}`).toEqual([...pos].sort((a, b) => a - b));
      // The core facts are always there.
      for (const must of ["uses", "doses", "side-effects", "monitoring", "warnings", "groups", "stopping"]) expect(ids, `${med.id} ${must}`).toContain(must);
      expect(ids[0], med.id).toBe("uses");
      expect(ids[ids.length - 1], med.id).toBe(HOW_IT_WORKS);
      // How it works is the last section on the page and carries the anchor.
      const how = container.querySelector(`#${HOW_IT_WORKS}`)!;
      expect(how, med.id).toBeTruthy();
      expect(how.tagName).toBe("SECTION");
      const sections = [...container.querySelectorAll("section")];
      expect(sections.indexOf(how as HTMLElement), med.id).toBe(sections.length - 1);
      expect(how.textContent).toContain("How it works");
      // Brands and forms sit with the doses.
      const doses = container.querySelector("#doses")!;
      expect(doses.textContent).toContain(med.forms);
      for (const b of med.brands) expect(doses.textContent).toContain(b);
      unmount();
    }
  }, 120_000);

  it("keeps every patient line, each in one place", () => {
    for (const med of MEDS) {
      const t = splitTell(med);
      expect([...t.take, ...t.warn, ...t.stopping].sort(), med.id).toEqual([...med.tell].sort());
      expect(t.stopping.some((x) => /smok/i.test(x)), med.id).toBe(false);
    }
  });

  it("links to the anchor", () => {
    expect(howItWorksHref("olanzapine")).toBe("/practice/medicines/olanzapine#how-it-works");
  });
});
