// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseLongAnswer } from "@/lib/prep/long";

vi.mock("@/components/study/widgets", () => ({
  Widget: ({ kind, data }: { kind: string; data: { boom?: boolean } }) => {
    if (data.boom) throw new Error("bad widget data");
    return <p>{`Diagram: ${kind}`}</p>;
  },
  ViewOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { LongAnswerBody } from "./long-ui";
import { LongPractice } from "./long-practice";

const ANSWER = ["## Introduction", "Depression is **common**.", "## The HPA axis", "- Cortisol rises", "- Feedback fails", "| Feature | ICD-11 |", "|---|---|", "| Duration | 2 weeks |", "## Conclusion", "Treatable."].join("\n");

describe("model answer format", () => {
  it("renders headings, bullets and table rows, with a diagram after its heading", async () => {
    const { container } = render(<LongAnswerBody blocks={parseLongAnswer(ANSWER)} visuals={[{ kind: "flow", data: {}, caption: "The HPA axis" }, { kind: "flow", data: { boom: true }, caption: "Broken one" }]} />);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Introduction", "The HPA axis", "Conclusion"]);
    expect(screen.getByText("common").tagName).toBe("STRONG");
    expect(screen.getByText("Cortisol rises").closest("ul")).not.toBeNull();
    expect(screen.getAllByText("2 weeks").length).toBeGreaterThan(0);
    expect(await screen.findByText("Diagram: flow")).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 30));
    // The diagram sits between its section and the next heading; the broken one is left out.
    const all = Array.from(container.querySelectorAll("h3, [data-visual]"));
    expect(all.map((n) => (n.tagName === "H3" ? n.textContent : "visual"))).toEqual(["Introduction", "The HPA axis", "visual", "Conclusion"]);
    expect(screen.queryByText("Broken one")).toBeNull();
    expect(screen.getByText("Treatable.")).toBeInTheDocument();
  });
});

describe("LongPractice", () => {
  beforeEach(() => window.localStorage.clear());
  const props = {
    id: "lq-test",
    plan: ["Define it", "Give features"],
    keyPoints: ["Defines depression", "Names core features", "Mentions duration"],
    pitfalls: ["Writing a list with no explanation"],
    answer: <p>The full model answer.</p>,
    study: { href: "/study/depression/8-1", label: "Open in Study: Depression" },
    prev: null,
    next: "/prep/psychopathology/long/m-depression/next",
  };

  it("hides the answer until asked, then shows the answer, pitfalls and the self-mark, with no plan box", () => {
    render(<LongPractice {...props} />);
    expect(screen.queryByText("The full model answer.")).toBeNull();
    expect(screen.queryByLabelText(/Plan your answer/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Show model answer/ }));
    expect(screen.getByText("The full model answer.")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "The plan" })).toBeNull();
    expect(screen.getByText("Writing a list with no explanation")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("You covered 0 of 3");
    fireEvent.click(screen.getByRole("checkbox", { name: "Defines depression" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Mentions duration" }));
    expect(screen.getByRole("status")).toHaveTextContent("You covered 2 of 3");
    fireEvent.click(screen.getByRole("checkbox", { name: "Mentions duration" }));
    expect(screen.getByRole("status")).toHaveTextContent("You covered 1 of 3");
  });

  it("saves to the two lists", () => {
    render(<LongPractice {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Save for later" }));
    expect(screen.getByRole("button", { name: "Saved" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Practise again" }));
    expect(JSON.parse(window.localStorage.getItem("vibha.prepLong.v1.again") ?? "[]")).toEqual(["lq-test"]);
    expect(screen.getByRole("link", { name: /Next/ })).toHaveAttribute("href", props.next);
    expect(screen.getByRole("link", { name: /Open in Study/ })).toHaveAttribute("href", "/study/depression/8-1");
  });

  it("still works when storage is blocked", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<LongPractice {...props} id="lq-blocked" />);
    fireEvent.click(screen.getByRole("button", { name: /Show model answer/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Defines depression" }));
    expect(screen.getByRole("status")).toHaveTextContent("You covered 1 of 3");
    spy.mockRestore();
  });
});
