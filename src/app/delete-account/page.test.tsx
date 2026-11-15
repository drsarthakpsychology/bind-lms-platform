// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }), usePathname: () => "/delete-account", useSearchParams: () => new URLSearchParams() }));

import DeleteAccountPage, { metadata } from "./page";
import { LEGAL } from "@/lib/legal-constants";

describe("/delete-account (Google Play account deletion page)", () => {
  it("names the app, both ways to ask, and what is deleted and kept", () => {
    const { container } = render(<DeleteAccountPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Delete your account" })).toBeTruthy();
    expect(container.textContent).toContain("Vibha Psychology app");
    expect(container.textContent).toContain("Ask to delete my account");
    const mail = screen.getByRole("link", { name: LEGAL.contactEmail });
    expect(mail.getAttribute("href")).toBe(`mailto:${LEGAL.contactEmail}?subject=Delete%20my%20account`);
    expect(screen.getByRole("heading", { name: "What we delete" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "What we keep, and for how long" })).toBeTruthy();
    expect(metadata.robots).toMatchObject({ index: true });
  });

  it("has no em or en dashes", () => {
    const { container } = render(<DeleteAccountPage />);
    expect(container.textContent).not.toMatch(/[–—]/);
  });
});
