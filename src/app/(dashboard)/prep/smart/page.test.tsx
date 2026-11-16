// @vitest-environment jsdom
/**
 * /prep/smart pulls the whole question bank into one page, which is too big for
 * a local dev server (it runs out of memory compiling). This renders the real page.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BANK } from "@/lib/prep/bank";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/flags", () => ({ requireFeature: async () => undefined }));
let v2 = true;
vi.mock("@/lib/ui/v2-server", () => ({ uiV2: async () => v2 }));
vi.mock("../viewer", () => ({ prepViewer: async () => ({ id: "u1", learner: true }) }));
let smart = { ids: [] as string[], reviews: 0, saved: [] as string[], canSave: true };
vi.mock("@/lib/prep/path", () => ({ loadSmart: async () => smart }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
  usePathname: () => "/prep/smart",
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("../actions", () => ({ checkAnswer: vi.fn(), revealAnswer: vi.fn(), toggleSaved: vi.fn(async () => ({ ok: true })) }));

import SmartPage from "./page";

describe("/prep/smart", () => {
  for (const flag of [true, false]) {
    it(`renders a set with no counts in the lead (v2 ${flag})`, async () => {
      v2 = flag;
      smart = { ids: BANK.slice(0, 10).map((q) => q.id), reviews: 3, saved: [], canSave: true };
      const { unmount } = render(await SmartPage());
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Smart practice");
      expect(screen.getByText("From your weak topics and questions you missed before.")).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(/undefined|NaN|including \d/);
      expect(screen.getAllByText("More ways to practise").length).toBeGreaterThan(0);
      unmount();
    });
  }

  it("empty set says so plainly", async () => {
    v2 = true;
    smart = { ids: [], reviews: 0, saved: [], canSave: true };
    render(await SmartPage());
    expect(screen.getByText("From your weak topics.")).toBeInTheDocument();
  });
});
