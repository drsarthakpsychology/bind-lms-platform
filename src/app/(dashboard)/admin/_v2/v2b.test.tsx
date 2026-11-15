// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InboxV2 } from "./inbox";
import { CohortsListV2, CohortMembersV2 } from "./cohorts";
import { EnquiriesV2, PersonV2 } from "./person";
import { DoubtsV2, SubmissionsV2, TriageV2 } from "./review";
import { CoursesListV2, CourseDetailV2 } from "./courses";
import { FlagsV2, MedicinesV2 } from "./content";
import { FormsListV2, FormAnswersV2 } from "./forms";
import { CheckinsV2, InfraV2 } from "./system";
import { uiV2For } from "@/lib/ui/v2";

describe("admin v2, second batch", () => {
  it("Inbox: doubts first, then emails, empty states in words", () => {
    render(<InboxV2 ready threads={[]} emails={[]} />);
    const heads = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(heads[0]).toContain("Doubts and concerns");
    expect(heads[1]).toContain("Email replies");
    expect(screen.getByText(/No doubts waiting/)).toBeInTheDocument();
    expect(screen.getByText("Nothing is waiting for a reply.")).toBeInTheDocument();
  });

  it("Inbox: a concern is tagged in words and keeps its reply slot", () => {
    render(
      <InboxV2
        ready={false}
        emails={[]}
        threads={[{ id: "d1", title: "Fees", body: "Body", concern: true, reason: "Private concern", author: "Asha", authorHref: "/admin/students/1", where: "Only you and the student see this", when: "2 days ago", followUp: null, reply: <button>Reply to Asha</button> }]}
      />,
    );
    expect(screen.getByText("Private concern")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Fees" })).toHaveAttribute("href", "/doubts/d1");
    expect(screen.getByRole("button", { name: "Reply to Asha" })).toBeInTheDocument();
    expect(screen.getByText(/not switched on yet/)).toBeInTheDocument();
  });

  it("Cohorts: a table with the cohort as a link, and the missing-tables notice", () => {
    const { rerender } = render(<CohortsListV2 unassigned={2} cohorts={[{ id: "c1", name: "Cohort 2", status: "active", course: null, members: 3, lectures: 4, detailsPct: 50, starts: null }]} newForm={<form aria-label="new" />} />);
    const table = screen.getByRole("table");
    expect(within(table).getByRole("link", { name: "Cohort 2" })).toHaveAttribute("href", "/admin/cohorts/c1");
    expect(within(table).getByText("Running")).toBeInTheDocument();
    expect(screen.getByText(/2 students are not in any cohort yet/)).toBeInTheDocument();
    rerender(<CohortsListV2 unassigned={0} cohorts={[]} tablesMissing />);
    expect(screen.getByText(/cohort tables are not in the database yet/)).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("Cohort members: actions only when passed (view-only admins get none)", () => {
    const m = { id: "u1", name: "Asha", email: "a@example.com", roll: null, account: { label: "Signed in", tone: "ok" as const }, scope: "Full platform", detailsPending: true };
    const { rerender } = render(<CohortMembersV2 members={[m]} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getAllByText("Details pending").length).toBeGreaterThan(0);
    rerender(<CohortMembersV2 members={[{ ...m, actions: <button>Remove</button> }]} addForm={<form aria-label="add" />} />);
    expect(screen.getAllByRole("button", { name: "Remove" }).length).toBeGreaterThan(0);
  });

  it("Person record: disabled contact buttons are not links; empty timeline says what to do", () => {
    render(<PersonV2 name="Asha" lead="Enquiry · New" links={null} contact={[{ label: "Email", href: "/x" }, { label: "Call", href: null }]} facts={[{ label: "Email", value: "a@example.com" }]} actions={null} timeline={[]} />);
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "/x");
    expect(screen.queryByRole("link", { name: "Call" })).toBeNull();
    expect(screen.getByText(/Nothing yet/)).toBeInTheDocument();
  });

  it("Enquiries: Make a student only for people who are not students yet", () => {
    const base = { email: "a@example.com", phone: null, status: "Student", message: null, when: "1 Nov 2026", source: "website", wa: null, tel: null, recordHref: "/r", emailHref: "/e" };
    render(<EnquiriesV2 lead="2" rows={[{ ...base, id: "1", name: "Asha", isStudent: true, makeHref: null }, { ...base, id: "2", name: "Bela", isStudent: false, makeHref: "/make" }]} />);
    // table and phone rows both render; each shows the action once
    expect(screen.getAllByRole("link", { name: "Make a student" })).toHaveLength(2);
    expect(screen.getAllByText(/Now a student/).length).toBeGreaterThan(0);
  });

  it("Review: triage, submissions and doubts show their empty states", () => {
    const { unmount } = render(<TriageV2 needs={[]} autoReleased={0} weakQuizItems={[]} />);
    expect(screen.getByText(/queue is clear/)).toBeInTheDocument();
    unmount();
    const s = render(<SubmissionsV2 pending={0} status="graded" course="" assignment="" courses={[]} assignments={[]} count={0}>{null}</SubmissionsV2>);
    expect(screen.getByText(/all caught up/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Graded" })).toHaveAttribute("aria-current", "page");
    s.unmount();
    render(<DoubtsV2 ready={false} view="concerns" views={[]} list={[]} emptyText="" />);
    expect(screen.getByText(/not switched on yet/)).toBeInTheDocument();
  });

  it("Courses: the list links to each course; a course shows lectures by week before the closed sections", () => {
    const { unmount } = render(<CoursesListV2 courses={[{ id: "k1", title: "Foundations", published: false, lessons: 3 }]} createForm={<form aria-label="create" />} />);
    expect(screen.getAllByRole("link", { name: /Foundations/ })[0]).toHaveAttribute("href", "/admin/courses/k1");
    expect(screen.getAllByText("Draft").length).toBeGreaterThan(0);
    unmount();
    render(
      <CourseDetailV2
        title="Foundations"
        published
        actions={null}
        count="1"
        emptyText={null}
        weeks={[{ week: 2, lessons: [{ id: "l1", number: 4, title: "History taking", status: { label: "Unlocked", tone: "ok" }, video: { label: "No video", tone: "quiet" }, actions: <button>Edit</button> }] }]}
        addOpen={false}
        addForm={<form aria-label="add" />}
        people={<div>people</div>}
        materials={<div>files</div>}
        materialCount={2}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Foundations" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Week 2" })).toBeInTheDocument();
    expect(screen.getAllByText("History taking").length).toBeGreaterThan(0);
    expect(screen.getByText("Course files (2)")).toBeInTheDocument();
  });

  it("What's live and Medicines: numbers in words, the view-only notice, an empty filter result", () => {
    const { unmount } = render(<FlagsV2 counts={{ unlocked: 2, live: 1, off: 0 }} canWrite={false} groups={[{ title: "Learning", items: [<li key="a">Notes</li>] }, { title: "Other", items: [] }]} />);
    expect(screen.getByText("open to students")).toBeInTheDocument();
    expect(screen.getByText(/View Admins can see these switches/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Other" })).toBeNull();
    unmount();
    render(<MedicinesV2 total={8} filtering rows={[]} filter={null} />);
    expect(screen.getByText(/0 of 8 shown/)).toBeInTheDocument();
    expect(screen.getByText(/No medicines match/)).toBeInTheDocument();
  });

  it("Forms: New form only for Super Admin; answers page offers the CSV only when there are answers", () => {
    const { rerender, unmount } = render(<FormsListV2 forms={[]} lead="0 forms" canEdit={false} />);
    expect(screen.queryByRole("link", { name: "New form" })).toBeNull();
    rerender(<FormsListV2 forms={[]} lead="0 forms" canEdit />);
    expect(screen.getByRole("link", { name: "New form" })).toHaveAttribute("href", "/admin/forms/new");
    unmount();
    render(<FormAnswersV2 title="Interest" open={false} count={0} csvHref={null} link={null} emptyText="No answers yet." />);
    expect(screen.queryByRole("link", { name: "Export CSV" })).toBeNull();
    expect(screen.getByText("Closed")).toBeInTheDocument();
    expect(screen.getByText("No answers yet.")).toBeInTheDocument();
  });

  it("Infra and check-ins: the storage warning from 70%, and the empty check-in state", () => {
    const { rerender, unmount } = render(<InfraV2 dbBytes={100 * 1024 * 1024} tables={[]} aiOn providers={[]} />);
    expect(screen.queryByRole("alert")).toBeNull();
    rerender(<InfraV2 dbBytes={360 * 1024 * 1024} tables={[]} aiOn={false} providers={[]} />);
    expect(screen.getByRole("alert")).toHaveTextContent("72%");
    expect(screen.getByText(/switched off/)).toBeInTheDocument();
    unmount();
    render(<CheckinsV2 figures={[]} chart={null} weeks={[]} />);
    expect(screen.getByText(/No check-ins yet/)).toBeInTheDocument();
  });

  it("the switch: on for admins by default, off for everyone when set to off", () => {
    expect(uiV2For({}, "admin")).toBe(true);
    expect(uiV2For({}, "view_admin")).toBe(true);
    expect(uiV2For({ ui_v2: "off" }, "admin")).toBe(false);
    expect(uiV2For({}, "student")).toBe(false);
  });
});
