// @vitest-environment jsdom
/** Every diagram in the long answers renders without throwing, so no student meets a broken card. */
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { Widget } from "@/components/study/widgets";
import type { WidgetData } from "@/lib/study/types";
import { LONG_QA } from "./index";

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});
afterEach(cleanup);

const subjects = [...new Set(LONG_QA.map((q) => q.subject))];

describe("every long-answer visual renders", () => {
  for (const s of subjects) {
    it(s, () => {
      const broken: string[] = [];
      for (const q of LONG_QA.filter((x) => x.subject === s)) {
        for (const v of q.visuals ?? []) {
          try {
            const { unmount } = render(<Widget kind={v.kind} data={v.data as WidgetData} />);
            unmount();
          } catch (e) {
            broken.push(`${q.id} ${v.kind}: ${(e as Error).message.slice(0, 120)}`);
          }
        }
      }
      expect(broken).toEqual([]);
    }, 120_000);
  }
});
