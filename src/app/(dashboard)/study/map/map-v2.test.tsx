// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { StudentMap } from "@/lib/learn/model/server";
import { MapV2 } from "./map-v2";

const cell = (skill: string, label: string, state: StudentMap["topics"][number]["cells"][number]["state"], p: number | null = null, hasItems = true) => ({ skill, competency: "recognise" as never, label, hasItems, state, n: 0, p });

const base: StudentMap = {
  topics: [
    { id: "depression", title: "Depression", href: "/study/depression", practised: 3, cells: [cell("depression:spot", "Spot it", "mastered", 0.82), cell("depression:criteria", "Criteria", "shaky", 0.4), cell("depression:risk", "Risk", "new", null, false)] },
    { id: "ocd", title: "OCD", href: "/study/ocd", practised: 0, cells: [cell("ocd:spot", "Spot it", "new"), cell("ocd:use", "Use it", "new")] },
  ],
  graded: 30,
  calibrated: true,
  weak: [],
  confusions: [],
  due: 0,
  placement: null,
} as unknown as StudentMap;

const props = { titles: {}, isLearner: true, fresh: false, left: 0, placed: new Map<string, string>() };

describe("Study map (v2)", () => {
  it("has one main action and no thin zero counts or empty boxes", () => {
    render(<MapV2 data={base} {...props} />);
    expect(screen.getByRole("link", { name: /Mixed practice/ })).toHaveAttribute("href", "/study/map/practice");
    expect(document.body.textContent).not.toMatch(/0 reviews|Top 3|No mix-ups|Nothing to fix yet/);
    expect(screen.queryByRole("heading", { name: "Fix it" })).toBeNull();
    expect(screen.getByText("Nothing to fix right now.")).toBeInTheDocument();
  });

  it("shows due reviews, weak skills and mix-ups when there are some", () => {
    const data = {
      ...base,
      due: 3,
      weak: [{ skill: "depression:criteria", topic: "depression", label: "Depression: criteria", state: "shaky", practiceHref: "/study/map/practice?skill=depression:criteria", href: "/study/depression" }],
      confusions: [{ a: "Anhedonia", b: "Avolition", n: 2, skill: "depression:spot" }],
    } as unknown as StudentMap;
    render(<MapV2 data={data} {...props} />);
    expect(screen.getByText(/3 reviews are due/)).toBeInTheDocument();
    const fix = screen.getByRole("list", { name: "Fix it" });
    expect(within(fix).getByRole("link", { name: /Quick quiz/ })).toHaveAttribute("href", "/study/map/practice?skill=depression:criteria");
    expect(screen.getByRole("list", { name: "Words you mix up" })).toHaveTextContent("Anhedonia and Avolition");
  });

  it("a topic not started is one quiet line; a started one lists only skills with questions", () => {
    render(<MapV2 data={base} {...props} />);
    const topics = screen.getByRole("list", { name: "Topics" });
    const [dep, ocd] = within(topics).getAllByRole("listitem");
    expect(dep).toHaveTextContent("Spot it");
    expect(dep).toHaveTextContent("82%");
    expect(dep).not.toHaveTextContent("Risk");
    expect(ocd).not.toHaveTextContent("Spot it");
    expect(ocd).toHaveTextContent("Not started");
  });

  it("before calibration says how many answers are left", () => {
    render(<MapV2 data={{ ...base, calibrated: false }} {...props} left={12} />);
    expect(screen.getByText(/12 to go/)).toBeInTheDocument();
  });
});
