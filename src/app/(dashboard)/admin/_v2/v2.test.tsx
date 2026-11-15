// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }), usePathname: () => "/admin/students", useSearchParams: () => new URLSearchParams() }));
vi.mock("../students/actions", () => ({ setAccountStatus: vi.fn(async () => ({})) }));
vi.mock("../cohorts/actions", () => ({ sendLoginLink: vi.fn(async () => ({})) }));
vi.mock("../students/bulk-import", () => ({ resetCredentialAction: vi.fn(async () => ({})) }));

import { AdminHomeV2 } from "./home";
import { StudentsTableV2 } from "./students-table";
import type { StudentRowLite } from "../students/student-table";

const row = (i: number, over: Partial<StudentRowLite> = {}): StudentRowLite => ({
  id: `id-${i}`,
  name: `Student ${i}`,
  email: `s${i}@example.com`,
  roll: `VIBHA-00000${i}`,
  mobile: null,
  account: "active",
  presence: "today",
  lastSeen: null,
  cohorts: [{ id: "c1", name: "Cohort 1" }],
  min7: 10,
  lecturesDone: 2,
  lecturesAvailable: 10,
  scope: "full",
  expiresAt: null,
  flags: [],
  ...over,
});

describe("AdminHomeV2", () => {
  it("puts the needs-a-look list first, then who is on now", () => {
    render(<AdminHomeV2 todo={[{ label: "Fix logins", count: 3, detail: "Link expired.", href: "/admin/students/logins" }]} live={[{ id: "a", name: "Asha", meta: "Cohort 1" }]} cohorts={[]} students={4} activeThisWeek={2} neverIn={1} dbPct={10} actions={null} />);
    const heads = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(heads[0]).toContain("Needs a look");
    expect(heads[1]).toContain("On VIBHA now");
    expect(screen.getByRole("link", { name: /Fix logins/ })).toHaveAttribute("href", "/admin/students/logins");
    expect(screen.queryByText(/Storage is at/)).toBeNull();
  });
  it("says all clear when nothing is waiting, and warns when storage is nearly full", () => {
    render(<AdminHomeV2 todo={[]} live={[]} cohorts={[]} students={0} activeThisWeek={0} neverIn={0} dbPct={82} actions={null} />);
    expect(screen.getByText("All clear. Nothing needs you right now.")).toBeInTheDocument();
    expect(screen.getByText("Nobody is on right now.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("82%");
  });
});

describe("StudentsTableV2", () => {
  const rows = [row(1), row(2, { name: "Meera Iyer", flags: ["login"], account: "invited" }), row(3, { cohorts: [] })];
  it("filters by search and by needs attention, same rules as the old list", () => {
    render(<StudentsTableV2 rows={rows} cohorts={[{ id: "c1", name: "Cohort 1" }]} canWrite />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(4);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "meera" } });
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Needs attention" }));
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    expect(within(table).getByRole("link", { name: "Meera Iyer" })).toHaveAttribute("href", "/admin/students/id-2");
  });
  it("shows the action bar only while students are selected", () => {
    render(<StudentsTableV2 rows={rows} cohorts={[]} canWrite />);
    expect(screen.queryByRole("region", { name: "Actions for selected students" })).toBeNull();
    fireEvent.click(screen.getAllByRole("checkbox", { name: "Select Student 1" })[0]);
    const bar = screen.getByRole("region", { name: "Actions for selected students" });
    expect(within(bar).getByText("1 selected")).toBeInTheDocument();
    expect(within(bar).getByRole("button", { name: /Lock/ })).toBeInTheDocument();
    expect(within(bar).getByRole("link", { name: /Message/ })).toHaveAttribute("href", expect.stringContaining("s1%40example.com"));
  });
  it("gives a view-only admin no lock, unlock, login or message actions", () => {
    render(<StudentsTableV2 rows={rows} cohorts={[]} canWrite={false} />);
    fireEvent.click(screen.getAllByRole("checkbox", { name: "Select Student 1" })[0]);
    const bar = screen.getByRole("region", { name: "Actions for selected students" });
    expect(within(bar).queryByRole("button", { name: /Lock/ })).toBeNull();
    expect(within(bar).queryByRole("button", { name: /Send login link/ })).toBeNull();
    expect(within(bar).queryByRole("link", { name: /Message/ })).toBeNull();
    expect(within(bar).getByRole("button", { name: /Download/ })).toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: "Login" })).toBeNull();
  });
});
