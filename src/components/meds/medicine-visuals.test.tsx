// @vitest-environment jsdom
/**
 * Every hand-drawn picture on every medicine page renders, and in every state
 * (each button under a picture) no two labels overlap and none runs off the
 * drawing. Label boxes are measured with the Kalam font's own widths
 * (src/components/sketch/check.ts); the screenshot check measures the same in a browser.
 */
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MEDS } from "@/lib/meds";
import { mechanismOf } from "@/lib/meds/mechanisms";
import { medVisuals } from "@/lib/meds/visuals";
import { MedicineSketches } from "./medicine-visuals";
import { labelProblems } from "@/components/sketch/check";

vi.mock("@/lib/tips/store", () => ({ useTip: () => ({ seen: true, dismiss: () => {} }), dismissTip: () => {} }));

describe("medicine pictures", () => {
  it("every medicine shows its receptor (when it has one), its journey and each of its own pictures, all hand-drawn", () => {
    for (const med of MEDS) {
      const mech = mechanismOf(med.id);
      const visuals = medVisuals(med.id);
      const { container, unmount } = render(<MedicineSketches med={med} mech={mech} visuals={visuals} />);
      const figures = container.querySelectorAll("figure");
      const receptor = mech && mech.receptor.name !== "a receptor" ? 1 : 0;
      expect(figures.length, med.id).toBe(receptor + (mech ? 1 : 0) + visuals.length);
      for (const f of figures) expect(f.querySelector("svg[data-sketch]"), `${med.id}: ${f.querySelector("figcaption")?.textContent}`).toBeTruthy();
      unmount();
    }
  });

  it("no label overlaps another or runs off the drawing, in any state", () => {
    const problems = new Set<string>();
    for (const med of MEDS) {
      const { container, unmount } = render(<MedicineSketches med={med} mech={mechanismOf(med.id)} visuals={medVisuals(med.id)} />);
      for (const f of container.querySelectorAll("figure")) {
        const check = () => {
          for (const svg of f.querySelectorAll<SVGSVGElement>("svg[data-sketch]")) for (const p of labelProblems(svg)) problems.add(`${med.id} ${p}`);
        };
        check();
        for (const b of f.querySelectorAll<HTMLButtonElement>("button[aria-pressed]")) {
          fireEvent.click(b);
          check();
        }
      }
      unmount();
    }
    expect([...problems]).toEqual([]);
  }, 180_000);

  it("has no instruction lines in the pictures; the one how-to line is shown once for all medicines", () => {
    const med = MEDS.find((m) => m.id === "olanzapine")!;
    const { container } = render(<MedicineSketches med={med} mech={mechanismOf(med.id)} visuals={medVisuals(med.id)} />);
    expect(container.textContent).not.toMatch(/\b(Press|Tap|Click|Switch on)\b/);
  });
});
