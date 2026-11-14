// @vitest-environment jsdom
/** Every medicine shows at least one extra "how it works" picture, and each one renders. */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { MedicineVisual } from "@/components/meds/medicine-visuals";
import { MEDS } from "./index";
import { MED_VISUALS } from "./visuals";

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});
afterEach(cleanup);

describe("medicine pictures", () => {
  it("every medicine has one, only for real medicines, with plain student text", () => {
    for (const m of MEDS) expect(MED_VISUALS[m.id]?.length ?? 0, m.id).toBeGreaterThan(0);
    for (const id of Object.keys(MED_VISUALS)) expect(MEDS.some((m) => m.id === id), id).toBe(true);
    const text = JSON.stringify(MED_VISUALS);
    expect(/[–—]/.test(text)).toBe(false);
    expect(/stahl|kaplan|sadock|maudsley|et al|page \d/i.test(text)).toBe(false);
  });
  it("each one renders", () => {
    const broken: string[] = [];
    for (const [id, list] of Object.entries(MED_VISUALS)) {
      for (const v of list) {
        try {
          render(<MedicineVisual v={v} med={MEDS.find((m) => m.id === id)!} />).unmount();
        } catch (e) {
          broken.push(`${id} ${v.kind}: ${(e as Error).message.slice(0, 120)}`);
        }
      }
    }
    expect(broken).toEqual([]);
  }, 60_000);
});
