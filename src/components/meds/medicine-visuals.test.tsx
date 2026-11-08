// @vitest-environment jsdom
/**
 * Every hand-drawn picture on every medicine page renders, and in every state
 * (each button under a picture) no two labels overlap and none runs off the
 * drawing. Label boxes are measured with the Kalam font's own widths
 * (sketch/metrics.ts); the screenshot check measures the same in a browser.
 */
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MEDS } from "@/lib/meds";
import { mechanismOf } from "@/lib/meds/mechanisms";
import { medVisuals } from "@/lib/meds/visuals";
import { MedicineSketches } from "./medicine-visuals";
import { kalamWidth } from "./sketch/metrics";

vi.mock("@/lib/tips/store", () => ({ useTip: () => ({ seen: true, dismiss: () => {} }), dismissTip: () => {} }));

type Box = { t: string; left: number; right: number; top: number; bottom: number };

function labelBoxes(svg: SVGSVGElement): Box[] {
  return [...svg.querySelectorAll("text")]
    .filter((t) => t.textContent?.trim())
    .map((t) => {
      const size = Number(t.getAttribute("font-size"));
      const x = Number(t.getAttribute("x"));
      const y = Number(t.getAttribute("y"));
      const w = kalamWidth(t.textContent ?? "", t.getAttribute("font-weight") === "700") * size;
      const anchor = t.getAttribute("text-anchor");
      const left = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
      return { t: t.textContent!.trim(), left, right: left + w, top: y - 0.78 * size, bottom: y + 0.26 * size };
    });
}

/** Problems with the labels of one drawing: overlaps, labels cut off, labels inside a moved group (which this check could not measure). */
function labelProblems(svg: SVGSVGElement): string[] {
  const name = svg.getAttribute("data-sketch");
  const [, , vw, vh] = (svg.getAttribute("viewBox") ?? "0 0 0 0").split(" ").map(Number);
  const out: string[] = [];
  for (const t of svg.querySelectorAll("text")) if (t.closest("[transform]")) out.push(`${name}: "${t.textContent}" sits in a moved group`);
  const boxes = labelBoxes(svg);
  for (const b of boxes) if (b.left < -0.5 || b.top < -0.5 || b.right > vw + 0.5 || b.bottom > vh + 0.5) out.push(`${name}: "${b.t}" is cut off`);
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ix > 0.5 && iy > 0.5) out.push(`${name}: "${a.t}" overlaps "${b.t}"`);
    }
  return out;
}

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
