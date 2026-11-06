import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/flags", () => ({ requireFeature: async () => true }));
const redirect = vi.fn((to: string) => {
  throw new Error(`REDIRECT ${to}`);
});
vi.mock("next/navigation", () => ({ redirect: (to: string) => redirect(to) }));

const render = async (slug: string) => {
  const { default: Page } = await import("./[slug]/page");
  return renderToStaticMarkup(await Page({ params: Promise.resolve({ slug }) }));
};

describe("Quick Reference pages", () => {
  it("renders a disorder with all five quick-read parts", async () => {
    const html = await render("bipolar-ii-disorder");
    for (const t of ["How long:", "Core features", "Key criteria", "Look-alikes", "First-line treatment"]) expect(html).toContain(t);
  });
  it("renders a medicine and a word", async () => {
    expect(await render("sertraline")).toContain("Key side effects");
    expect(await render("anhedonia")).toContain("Why clinicians use this word");
  });
  it("redirects aliases to the main entry and unknown words to search", async () => {
    await expect(render("ocd")).rejects.toThrow("REDIRECT /study/reference/obsessive-compulsive-disorder");
    await expect(render("qqq-nothing")).rejects.toThrow("REDIRECT /study/reference?q=qqq%20nothing");
  });
  it("renders the A–Z list with search and letters", async () => {
    const { default: Page } = await import("./page");
    const html = renderToStaticMarkup(await Page({ searchParams: Promise.resolve({}) }));
    expect(html).toContain("Search the Quick Reference");
    expect(html).toContain('href="#letter-A"');
    expect(html).toContain("/study/reference/schizophrenia");
  });
});
