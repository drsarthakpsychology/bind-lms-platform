// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NextStepLink, PersonHeader, type PersonHeaderProps } from "./person-header";

const base: PersonHeaderProps = {
  name: "Priya Shah",
  roll: "VIBHA-000042",
  email: "priya@gmail.com",
  mobile: null,
  status: { label: "Active", tone: "published" },
  scopeLabel: "Full platform",
  cohorts: [{ id: "c1", name: "Cohort 1" }],
  lastSeen: "2 h ago",
  onNow: false,
  lecturesDone: 3,
  lecturesAvailable: 10,
  progressPct: 30,
  flags: ["Behind on lectures"],
  isTest: false,
  next: { label: "Send a nudge", why: "They're behind on lectures." },
};

describe("PersonHeader", () => {
  it("shows status, cohorts, last seen, progress, flags and one next step", () => {
    render(<PersonHeader {...base} nextAction={<NextStepLink href="/x">Send a nudge</NextStepLink>} />);
    expect(screen.getByRole("heading", { level: 1, name: "Priya Shah" })).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cohort 1" })).toHaveAttribute("href", "/admin/cohorts/c1");
    expect(screen.getByText("2 h ago")).toBeInTheDocument();
    expect(screen.getByText("3 of 10 lectures (30%)")).toBeInTheDocument();
    expect(screen.getByText("Behind on lectures")).toBeInTheDocument();
    expect(screen.getByText(/Next step: Send a nudge\./)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Send a nudge/ })).toHaveLength(1);
  });

  it("says when there is no cohort and nothing is needed", () => {
    render(<PersonHeader {...base} cohorts={[]} flags={[]} next={{ label: "Nothing needed", why: "They're on track." }} />);
    expect(screen.getByText("No cohort")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
    expect(screen.getByText(/Next step: Nothing needed\./)).toBeInTheDocument();
  });
});
