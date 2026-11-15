// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/save/client", () => ({ subscribeSaveStatus: () => () => {}, getSaveStatus: () => "retrying", getServerSaveStatus: () => "idle" }));

import { HomeV2, HomeV2Skeleton, type HomeV2Props } from "./home-v2";

const base: HomeV2Props = {
  adminPreview: false,
  welcomeBack: true,
  dateLine: "Sun, 15 Nov",
  step: { kind: "lecture", eyebrow: "Continue watching", title: "Mood and affect", meta: "Week 1 · Lecture 2", href: "/courses/c/lessons/l", cta: "Resume" },
  progress: { pct: 40, label: "Lectures watched" },
  allDone: false,
  goal: { points: 10, goal: 40, streak: 3 },
  quests: {
    quests: [
      { id: "section", label: "Finish one section", href: "/study", done: true, progress: null },
      { id: "points", label: "Answer ten questions", href: "/prep", done: false, progress: "4/10" },
      { id: "case", label: "Play the case", href: "/practice/daily", done: false, progress: null },
    ],
    done: false,
    paid: false,
    spareBonus: 2,
    xpBonus: 30,
  } as HomeV2Props["quests"],
  upNext: [
    { kind: "study", title: "Read 0.1", meta: "The interview", href: "/study/m/s" },
    { kind: "weak", title: "Statistics", meta: "Practise a weak topic", href: "/prep/statistics" },
    { kind: "daily", title: "Case of the day", meta: "One new patient today", href: "/practice/daily" },
  ],
};

describe("Home (new design)", () => {
  it("has one hero action, one H1, the progress line and three Up next rows", () => {
    render(<HomeV2 {...base} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Resume" })).toHaveAttribute("href", "/courses/c/lessons/l");
    expect(screen.getByRole("progressbar", { name: "Lectures watched" })).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByRole("region", { name: "Up next" }).querySelectorAll("li")).toHaveLength(3);
    expect(document.querySelectorAll(".bg-primary").length).toBe(2); // the button and the progress fill only
  });

  it("shows the save line under the hero while a save is retrying", () => {
    render(<HomeV2 {...base} />);
    expect(screen.getByRole("status")).toHaveTextContent("Couldn't save, retrying");
  });

  it("keeps the quests in a sheet behind the Today line", () => {
    render(<HomeV2 {...base} />);
    expect(screen.queryByText("Answer ten questions")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Open today's quests/ }));
    expect(screen.getByText("Answer ten questions")).toBeInTheDocument();
    expect(screen.getByText(/XP each/)).toBeInTheDocument();
  });

  it("new student: the hero says to start the first lecture, no empty progress line", () => {
    render(<HomeV2 {...base} welcomeBack={false} progress={{ pct: 0, label: "Lectures watched" }} step={{ ...base.step, eyebrow: "Start here", cta: "Watch" }} quests={null} upNext={[]} />);
    expect(screen.getByText("Start your first lecture")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByRole("region", { name: "Up next" })).toBeNull();
  });

  it("all done: one calm hero that leads to Practise", () => {
    render(<HomeV2 {...base} allDone upNext={[]} />);
    expect(screen.getByRole("link", { name: "Practise" })).toHaveAttribute("href", "/practise");
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("Study locked: no Today line", () => {
    render(<HomeV2 {...base} goal={null} quests={null} />);
    expect(screen.queryByRole("region", { name: "Today" })).toBeNull();
  });

  it("skeleton is a labelled loading state", () => {
    render(<HomeV2Skeleton />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });
});
