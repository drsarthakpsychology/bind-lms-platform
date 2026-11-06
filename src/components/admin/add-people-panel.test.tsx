// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const params = { value: new URLSearchParams() };
const add = vi.fn(async () => ({ error: null, rows: [{ email: "a@b.co", outcome: "created", mailed: true }], invalid: [], unmatched: [{ name: "Nobody Here", email: null, reason: "not-found" }] }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/admin/students",
  useSearchParams: () => params.value,
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/app/(dashboard)/admin/cohorts/actions", () => ({
  addPeopleFromPaste: (...a: unknown[]) => add(...(a as [])),
  createCohort: vi.fn(),
  reopenDetails: vi.fn(),
  removeFromCohort: vi.fn(),
  sendLoginLink: vi.fn(),
  setCohortLessons: vi.fn(),
  setPersonCohorts: vi.fn(),
  setPersonLesson: vi.fn(),
  setPersonScope: vi.fn(),
  updateCohort: vi.fn(),
}));

import { AddPeoplePanel, openAddPeople } from "./add-people-panel";

const cohorts = [
  { id: "c1", name: "Cohort 1" },
  { id: "c2", name: "Cohort 2" },
];

describe("AddPeoplePanel", () => {
  it("opens from anywhere with the page's cohort preselected, and adds names or emails", async () => {
    render(<AddPeoplePanel cohorts={cohorts} canWrite />);
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => openAddPeople("c1"));
    expect(await screen.findByRole("dialog", { name: /Add people/ })).toBeInTheDocument();
    expect(screen.getByLabelText("Cohort")).toHaveValue("c1");
    expect(screen.getByLabelText("Send login email now")).toBeChecked();
    fireEvent.change(screen.getByLabelText("Names or emails"), { target: { value: "a@b.co\nNobody Here" } });
    fireEvent.click(screen.getByRole("button", { name: "Add 2 people" }));
    await waitFor(() => expect(add).toHaveBeenCalledWith("c1", "a@b.co\nNobody Here", { sendEmail: true, scope: "full" }));
    expect(await screen.findByText(/no one on VIBHA has this name/)).toBeInTheDocument();
  });

  it("opens from the palette link (?add=people)", async () => {
    params.value = new URLSearchParams("add=people&addCohort=c2");
    render(<AddPeoplePanel cohorts={cohorts} canWrite />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Cohort")).toHaveValue("c2");
    params.value = new URLSearchParams();
  });

  it("tells a view-only admin they can't add", async () => {
    params.value = new URLSearchParams("add=people");
    render(<AddPeoplePanel cohorts={cohorts} canWrite={false} />);
    expect(await screen.findByText("Only the Super Admin can add people.")).toBeInTheDocument();
    params.value = new URLSearchParams();
  });
});
