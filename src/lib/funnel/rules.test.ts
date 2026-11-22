import { describe, expect, it } from "vitest";
import { buildReport, optedOut, parseFunnel, refHostOf, type SummaryRow } from "./rules";

const ok = { visit: "abc123def456", event: "view", path: "/", detail: null, ref: "https://www.google.com/search?q=x" };

describe("parseFunnel", () => {
  it("accepts a clean step and keeps only the referrer host", () => {
    expect(parseFunnel(ok)).toEqual({ visit: "abc123def456", event: "view", path: "/", detail: null, refHost: "google.com" });
  });

  it("drops our own site and Vercel hosts as referrers", () => {
    expect(parseFunnel({ ...ok, ref: "https://vibhapsychology.com/free" })?.refHost).toBeNull();
    expect(parseFunnel({ ...ok, ref: "https://bind-lms-platform.vercel.app/" })?.refHost).toBeNull();
  });

  it("rejects unknown events, pages and bad visit ids", () => {
    expect(parseFunnel({ ...ok, event: "click" })).toBeNull();
    expect(parseFunnel({ ...ok, path: "/dashboard" })).toBeNull();
    expect(parseFunnel({ ...ok, visit: "short" })).toBeNull();
    expect(parseFunnel({ ...ok, visit: "ABC123DEF456" })).toBeNull();
    expect(parseFunnel(null)).toBeNull();
    expect(parseFunnel("view")).toBeNull();
  });

  it("never accepts personal details in the detail field", () => {
    expect(parseFunnel({ ...ok, event: "cta", detail: "someone@example.com" })).toBeNull();
    expect(parseFunnel({ ...ok, event: "cta", detail: "+91 98765 43210" })).toBeNull();
    expect(parseFunnel({ ...ok, event: "cta", detail: "home-hero" })?.detail).toBe("home-hero");
  });

  it("treats a trailing slash as the same page", () => {
    expect(parseFunnel({ ...ok, path: "/waitlist/" })?.path).toBe("/waitlist");
  });
});

describe("refHostOf", () => {
  it("handles junk", () => {
    expect(refHostOf("")).toBeNull();
    expect(refHostOf(42)).toBeNull();
    expect(refHostOf("not a url with spaces")).toBeNull();
    expect(refHostOf("https://l.instagram.com/?u=x")).toBe("l.instagram.com");
  });
});

describe("optedOut", () => {
  const h = (o: Record<string, string>) => ({ get: (n: string) => o[n] ?? null });
  it("respects Do Not Track and Global Privacy Control", () => {
    expect(optedOut(h({ dnt: "1" }))).toBe(true);
    expect(optedOut(h({ "sec-gpc": "1" }))).toBe(true);
    expect(optedOut(h({}))).toBe(false);
    expect(optedOut(h({ dnt: "0" }))).toBe(false);
  });
});

describe("buildReport", () => {
  const rows: SummaryRow[] = [
    { event: "view", path: "/", detail: "", events: 300, visits: 200 },
    { event: "view", path: "/waitlist", detail: "", events: 40, visits: 30 },
    { event: "cta", path: "/", detail: "home-hero", events: 30, visits: 25 },
    { event: "cta", path: "/", detail: "whatsapp", events: 9, visits: 8 },
    { event: "form_open", path: "/waitlist", detail: "", events: 32, visits: 30 },
    { event: "form_start", path: "/waitlist", detail: "", events: 12, visits: 12 },
    { event: "form_sent", path: "/waitlist", detail: "", events: 6, visits: 6 },
    { event: "form_failed", path: "/waitlist", detail: "refused", events: 4, visits: 3 },
  ];

  it("uses exact distinct visits from the database when given", () => {
    const r = buildReport(rows, { view: 210, cta: 25, form_open: 30, form_start: 12, form_sent: 6 });
    expect(r.steps.map((s) => s.visits)).toEqual([210, 25, 30, 12, 6]);
    expect(r.steps[0].keptPct).toBeNull();
    expect(r.steps[2].keptPct).toBe(100); // capped: some arrive at the form straight from a link
    expect(r.steps[3].keptPct).toBe(40);
  });

  it("falls back to sums and leaves Call and WhatsApp out of Request presses", () => {
    const r = buildReport(rows);
    expect(r.steps[0].visits).toBe(230);
    expect(r.steps[1].visits).toBe(25);
  });

  it("names the biggest drop", () => {
    const r = buildReport(rows, { view: 200, cta: 25, form_open: 30, form_start: 12, form_sent: 6 });
    expect(r.biggestDrop).toEqual({ from: "Saw a page", to: "Pressed Request or Register", lostPct: 87 });
  });

  it("lists buttons, pages and failures in plain words, busiest first", () => {
    const r = buildReport(rows);
    expect(r.buttons[0]).toEqual({ key: "home-hero", label: "Homepage, top button", visits: 25 });
    expect(r.buttons.map((b) => b.key)).toContain("whatsapp");
    expect(r.pages[0]).toEqual({ path: "/", visits: 200 });
    expect(r.failed).toEqual([{ reason: "refused", events: 4 }]);
  });

  it("is calm with no data", () => {
    const r = buildReport([]);
    expect(r.steps.every((s) => s.visits === 0)).toBe(true);
    expect(r.biggestDrop).toBeNull();
  });
});
