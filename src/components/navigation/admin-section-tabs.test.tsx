// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/admin/infra" }));
Element.prototype.scrollIntoView = () => {};

import { AdminSectionTabs } from "./admin-section-tabs";

describe("AdminSectionTabs", () => {
  it("shows the Admins tab to a Super Admin", () => {
    render(<AdminSectionTabs v2 />);
    expect(screen.getByRole("link", { name: "Admins" })).toHaveAttribute("href", "/admin/management");
  });
  it("leaves the Admins tab out for a View Admin (that page sends them back)", () => {
    render(<AdminSectionTabs v2 viewOnly />);
    expect(screen.queryByRole("link", { name: "Admins" })).toBeNull();
    expect(screen.getByRole("link", { name: /Usage/ })).toBeInTheDocument();
  });
});
