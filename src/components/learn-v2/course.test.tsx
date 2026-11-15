import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { OverviewModel } from "@/components/course/course-overview-view";
import { CourseV2, LecturesListV2 } from "./course";

const model: OverviewModel = {
  courseId: "c1",
  title: "Clinical psychology foundations",
  published: true,
  completedCount: 1,
  totalLessons: 2,
  started: true,
  backHref: null,
  next: { title: "Mood and affect", href: "/courses/c1/lessons/l2", week: 1, kind: "lesson", number: 2, midway: true },
  empty: false,
  weeks: [
    {
      num: 1,
      status: "in-progress",
      isCurrent: true,
      isFuture: false,
      done: 1,
      total: 2,
      lessons: [
        { id: "l1", title: "Appearance and behaviour", number: 1, href: "/courses/c1/lessons/l1", state: "done", hasVideo: true },
        { id: "l2", title: "Mood and affect", number: 2, href: "/courses/c1/lessons/l2", state: "next", hasVideo: true },
      ],
      materials: [{ id: "m1", title: "MSE checklist", meta: "PDF · document", href: "/courses/c1/materials/m1" }],
      assignments: [],
    },
    {
      num: 2,
      status: "upcoming",
      isCurrent: false,
      isFuture: true,
      done: 0,
      total: 1,
      lessons: [{ id: "l3", title: "Thought", number: 3, href: null, state: "later", hasVideo: true }],
      materials: [],
      assignments: [],
    },
  ],
};

describe("CourseV2", () => {
  it("shows one Continue, the lectures by week, and locked lectures as plain rows", () => {
    render(<CourseV2 model={model} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Clinical psychology foundations");
    expect(screen.getByRole("link", { name: /Resume/ })).toHaveAttribute("href", "/courses/c1/lessons/l2");
    expect(screen.getByRole("link", { name: /Lecture 1: Appearance and behaviour/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Thought/ })).toBeNull();
    expect(screen.getByText("Thought")).toBeInTheDocument();
    // No Assignments tab when there are none.
    expect(screen.queryByRole("tab", { name: "Assignments" })).toBeNull();
  });

  it("filters to what is left and switches to materials", () => {
    render(<CourseV2 model={model} />);
    fireEvent.click(screen.getByRole("button", { name: "To watch" }));
    expect(screen.queryByRole("link", { name: /Lecture 1:/ })).toBeNull();
    expect(screen.getByRole("link", { name: /Lecture 2:/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Materials" }));
    expect(screen.getByRole("link", { name: /MSE checklist/ })).toHaveAttribute("href", "/courses/c1/materials/m1");
  });

  it("says so when there is nothing to watch", () => {
    render(<CourseV2 model={{ ...model, weeks: [], empty: true, next: null, totalLessons: 0, completedCount: 0, started: false }} />);
    expect(screen.getByText("No lectures yet")).toBeInTheDocument();
    expect(screen.getByText("Nothing to watch yet.")).toBeInTheDocument();
  });
});

describe("LecturesListV2", () => {
  it("lists courses as rows with one Continue", () => {
    render(<LecturesListV2 models={[model, { ...model, courseId: "c2", title: "Second course", next: null }]} />);
    expect(screen.getAllByRole("link", { name: /Resume/ })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Second course/ })).toHaveAttribute("href", "/courses/c2");
  });
  it("has an empty state", () => {
    render(<LecturesListV2 models={[]} />);
    expect(screen.getByText("No courses yet")).toBeInTheDocument();
  });
});
