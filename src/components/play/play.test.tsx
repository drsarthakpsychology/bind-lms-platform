// @vitest-environment jsdom
/** The new design keeps every medicine, every section and its order; the frame keeps one header row. */
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { GROUPS, MEDS, medById, medIndex } from "@/lib/meds";
import { mechanismOf } from "@/lib/meds/mechanisms";
import { HOW_IT_WORKS, SECTION_ORDER } from "@/lib/meds/sections";
import { halfLifeOf, medVisuals } from "@/lib/meds/visuals";
import { MedicinePage } from "./medicine-page";
import { MedicineLibrary } from "./medicine-library";
import { GameFrame } from "./game-frame";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push() {}, replace() {}, refresh() {} }),
  usePathname: () => "/games/blitz",
  useSearchParams: () => new URLSearchParams(),
}));

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});

describe("medicine library (new design)", () => {
  it("lists every medicine with its class and usual dose", () => {
    const doses = Object.fromEntries(MEDS.map((m) => [m.id, m.doses[m.defaultDose]?.amount ?? ""]));
    const { container } = render(<MedicineLibrary rows={medIndex()} groups={GROUPS} doses={doses} />);
    const links = [...container.querySelectorAll('a[href^="/practice/medicines/"]')].map((a) => a.getAttribute("href"));
    expect(links).toEqual(MEDS.map((m) => `/practice/medicines/${m.id}`));
    for (const m of MEDS) {
      const row = container.querySelector(`a[href="/practice/medicines/${m.id}"]`)!;
      expect(row.textContent).toContain(m.name);
      expect(row.textContent).toContain(m.cls);
      expect(row.textContent).toContain(doses[m.id]);
      for (const b of m.brands) expect(row.textContent).toContain(b);
    }
  });
});

describe("medicine page (new design)", () => {
  it("keeps every section in the agreed order, How it works last, and every line of content", () => {
    for (const med of MEDS) {
      const related = med.related.map(medById).filter((m): m is NonNullable<typeof m> => Boolean(m)).map((m) => ({ id: m.id, name: m.name, cls: m.cls }));
      const { container, unmount } = render(<MedicinePage med={med} related={related} mech={mechanismOf(med.id)} visuals={medVisuals(med.id)} half={halfLifeOf(med.id)} />);
      const ids = [...container.querySelectorAll("[data-section]")].map((el) => el.getAttribute("data-section"));
      const pos = ids.map((id) => SECTION_ORDER.indexOf(id as (typeof SECTION_ORDER)[number]));
      expect(pos.every((p) => p >= 0), med.id).toBe(true);
      expect(pos, med.id).toEqual([...pos].sort((a, b) => a - b));
      for (const must of ["uses", "doses", "side-effects", "monitoring", "warnings", "groups", "stopping"]) expect(ids, `${med.id} ${must}`).toContain(must);
      expect(ids[0]).toBe("uses");
      expect(ids[ids.length - 1]).toBe(HOW_IT_WORKS);
      const how = container.querySelector(`#${HOW_IT_WORKS}`)!;
      expect(how.tagName).toBe("SECTION");
      const sections = [...container.querySelectorAll("section")];
      expect(sections.indexOf(how as HTMLElement)).toBe(sections.length - 1);
      const doses = container.querySelector("#doses")!;
      expect(doses.textContent).toContain(med.forms);
      for (const b of med.brands) expect(doses.textContent).toContain(b);
      // Nothing dropped: every list line of the medicine is on the page.
      const text = container.textContent ?? "";
      for (const line of [...med.uses, ...med.standout, ...med.common, ...med.checks, ...med.interactions, ...med.serious, ...med.tell, ...med.groups.map((g) => g.text), med.student]) expect(text, `${med.id}: ${line}`).toContain(line);
      // The index names every section shown.
      const index = [...container.querySelectorAll('nav[aria-label="On this page"] a')].map((a) => a.getAttribute("href"));
      expect(index).toEqual(ids.map((id) => `#${id}`));
      unmount();
    }
  }, 120_000);
});

describe("GameFrame", () => {
  it("puts Back, the name and How to play on one row, with the game below", () => {
    const { container } = render(
      <GameFrame title="Blitz" fallback="/games" tip={{ id: "frame-test", steps: ["Answer fast."] }}>
        <p>the game</p>
      </GameFrame>,
    );
    const head = container.querySelector("header")!;
    expect(head.querySelector("a")?.getAttribute("href")).toBe("/games");
    expect(head.querySelector("h1")?.textContent).toBe("Blitz");
    expect(screen.getByText("the game")).toBeTruthy();
    // The how-to is on the screen either as its panel (first visit) or its button.
    expect(container.querySelector('[data-tip="frame-test"]')).toBeTruthy();
  });
});
