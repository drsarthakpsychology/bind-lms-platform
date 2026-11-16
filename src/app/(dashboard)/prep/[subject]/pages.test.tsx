// @vitest-environment jsdom
/**
 * /prep/<subject> and /prep/<subject>/<topic> pull the whole question bank,
 * every long answer and every Study module into one page, which is too big for
 * a local dev server. This renders the real pages for every subject instead.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/flags", () => ({ requireFeature: async () => undefined }));
let v2 = true;
vi.mock("@/lib/ui/v2-server", () => ({ uiV2: async () => v2 }));
vi.mock("../viewer", () => ({ prepViewer: async () => ({ id: "u1", learner: true }) }));
vi.mock("@/lib/prep/answers", () => ({ loadAnswers: async () => ({ ready: true, map: new Map() }) }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
  usePathname: () => "/prep",
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("../actions", () => ({ checkAnswer: vi.fn(), revealAnswer: vi.fn(), toggleSaved: vi.fn(async () => ({ ok: true })) }));

import SubjectPage from "./page";
import TopicPage from "./[topic]/page";
import { BANK_SUBJECTS, SUBJECT_TITLE } from "@/lib/prep/catalog";
import { bankTopics } from "@/lib/prep/bank";

const subjects = BANK_SUBJECTS.filter((s) => bankTopics(s).length > 0);

describe("prep subject pages render for every subject", () => {
  for (const flag of [true, false]) {
    it(`subject list, both tabs (v2 ${flag})`, async () => {
      v2 = flag;
      for (const subject of subjects) {
        for (const tab of [undefined, "long"]) {
          const ui = await SubjectPage({ params: Promise.resolve({ subject }), searchParams: Promise.resolve({ tab }) });
          const { unmount } = render(ui);
          const h1 = screen.getByRole("heading", { level: 1 });
          if (subject !== "ugc-paper1") expect(h1).toHaveTextContent(SUBJECT_TITLE[subject]);
          expect(document.body.textContent).not.toMatch(/undefined|NaN/);
          unmount();
        }
      }
    });
  }

  it("unknown subject is a 404", async () => {
    await expect(SubjectPage({ params: Promise.resolve({ subject: "nope" }), searchParams: Promise.resolve({}) })).rejects.toThrow("NOT_FOUND");
  });

  for (const flag of [true, false]) {
    it(`first topic set opens for every subject (v2 ${flag})`, async () => {
      v2 = flag;
      for (const subject of subjects) {
        const topic = bankTopics(subject)[0];
        const ui = await TopicPage({ params: Promise.resolve({ subject, topic: topic.id }), searchParams: Promise.resolve({}) });
        const { unmount } = render(ui);
        expect(screen.getAllByText(topic.title).length).toBeGreaterThan(0);
        expect(document.body.textContent).not.toMatch(/undefined|NaN/);
        unmount();
      }
    });
  }
});
