import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { emailShell, EMAIL_TEMPLATES, welcomeTemplate, announcementTemplate } from "./templates";
import { credentialsEmailHtml } from "../auth/roster";

describe("emailShell", () => {
  it("wraps content in an email-safe document (no <style> blocks, no scripts)", () => {
    const doc = emailShell("Hi", "<p>Hello</p>");
    expect(doc).toContain("<html>");
    expect(doc).toContain("Hello");
    expect(doc).not.toContain("<style");
    expect(doc).not.toContain("<script");
  });
});

describe("compose templates", () => {
  it("every template returns subject + html + text", () => {
    for (const t of EMAIL_TEMPLATES) {
      const built = t.build({ name: "Jane", detail: "Important note.", appUrl: "https://vibhapsychology.com" });
      expect(built.subject.length).toBeGreaterThan(0);
      expect(built.html).toContain("<html>");
      expect(built.text.length).toBeGreaterThan(0);
    }
  });

  it("welcome template contains the sign-in CTA and the app url", () => {
    const { html, text } = welcomeTemplate.build({ appUrl: "https://vibhapsychology.com" });
    expect(html).toContain("vibhapsychology.com/login");
    expect(text).toContain("vibhapsychology.com/login");
  });

  it("announcement template carries the detail into both html and text", () => {
    const { html, text } = announcementTemplate.build({ detail: "Cohort meeting Thursday" });
    expect(html).toContain("Cohort meeting Thursday");
    expect(text).toContain("Cohort meeting Thursday");
  });
});

describe("credentialsEmailHtml", () => {
  it("carries the password + sign-in link and escapes unsafe characters", () => {
    const html = credentialsEmailHtml("A&B <Name>", "jane@x.com", 'p@ss"<x>', "https://vibhapsychology.com");
    expect(html).toContain("jane@x.com");
    expect(html).toContain("p@ss&quot;&lt;x&gt;");
    expect(html).toContain("A&amp;B &lt;Name&gt;");
    expect(html).toContain("vibhapsychology.com/login");
    expect(html).toContain("<html>");
    expect(html).not.toContain("<style");
  });
});
