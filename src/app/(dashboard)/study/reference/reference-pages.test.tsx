import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/flags", () => ({ requireFeature: async () => true }));
vi.mock("@/lib/ui/v2-server", () => ({ uiV2: async () => false }));
const redirect = vi.fn((to: string) => {
  throw new Error(`REDIRECT ${to}`);
});
vi.mock("next/navigation", () => ({ redirect: (to: string) => redirect(to) }));

const render = async (slug: string) => {
  const { default: Page } = await import("./[slug]/page");
  return renderToStaticMarkup(await Page({ params: Promise.resolve({ slug }) }));
};

describe("Quick Reference pages", () => {
  it("renders a disorder card that has no typed note yet with all five quick-read parts", async () => {
    const html = await render("cyclothymic-disorder");
    for (const t of ["How long:", "Core features", "Key criteria", "Look-alikes", "First-line treatment"]) expect(html).toContain(t);
  });
  it("renders a medicine and a word", async () => {
    expect(await render("sertraline")).toContain("Key side effects");
    expect(await render("anhedonia")).toContain("Why clinicians use this word");
  });
  it("redirects aliases to the main entry and unknown words to search", async () => {
    await expect(render("hoarding")).rejects.toThrow("REDIRECT /study/reference/hoarding-disorder");
    // Cards that became typed Quick Notes open the note, by name or alias.
    await expect(render("ocd")).rejects.toThrow("REDIRECT /study/notes/criteria-ocd");
    await expect(render("bipolar-ii-disorder")).rejects.toThrow("REDIRECT /study/notes/criteria-bipolar");
    await expect(render("qqq-nothing")).rejects.toThrow("REDIRECT /study/reference?q=qqq%20nothing");
  });
  it("the old A to Z sends people to Quick Notes, keeping the search and kind", async () => {
    const { default: Page } = await import("./page");
    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrow("REDIRECT /study/notes");
    await expect(Page({ searchParams: Promise.resolve({ q: "lithium", kind: "medicine" }) })).rejects.toThrow("REDIRECT /study/notes?q=lithium&type=pharm");
  });
});
