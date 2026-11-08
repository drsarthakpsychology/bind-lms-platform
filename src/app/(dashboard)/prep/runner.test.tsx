// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { normaliseLabels } from "@/lib/prep/labels";
import { toView } from "@/lib/prep/view";
import type { PrepQuestion } from "@/lib/prep/types";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));
const { toggleSaved } = vi.hoisted(() => ({ toggleSaved: vi.fn(async (x: { id: string; saved: boolean }) => ({ ok: !!x })) }));
const { VISUALS } = vi.hoisted(() => ({ VISUALS: {} as Record<string, unknown> }));
vi.mock("./actions", () => ({
  checkAnswer: vi.fn(async ({ id, choice }: { id: string; choice: number }) => ({ id, answer: 1, explanation: "Because two.", learnHref: "/study/statistics/2-5", correct: choice === 1, ...(VISUALS[id] ? { visual: VISUALS[id] } : {}) })),
  revealAnswer: vi.fn(async (id: string) => ({ id, answer: 1, explanation: "Because two.", learnHref: "/study/statistics/2-5" })),
  toggleSaved: (x: { id: string; saved: boolean }) => toggleSaved(x),
}));

// The real widgets are heavy; this stand-in draws a label, and throws for data { boom: true }.
vi.mock("@/components/study/widgets", () => ({
  Widget: ({ kind, data }: { kind: string; data: { boom?: boolean; title?: string } }) => {
    if (data.boom) throw new Error("bad widget data");
    return <p>{`Diagram: ${kind} ${data.title ?? ""}`}</p>;
  },
}));

import { QuestionRunner } from "./runner";
import { QuestionBody } from "./question";

const match: PrepQuestion = {
  id: "m1",
  subject: "statistics",
  topic: "t-test",
  exams: ["cuet-pg"],
  difficulty: 2,
  type: "match",
  stem: "Match the tests.",
  lists: { left: ["a) Paired t", "b) Welch t", "c) ANOVA", "d) Chi-square"], right: ["1. Same people twice", "2. Unequal variances", "3. Three groups", "4. Counts"] },
  options: ["A-1, B-2, C-3, D-4", "A-2, B-1, C-3, D-4", "A-1, B-3, C-2, D-4", "A-4, B-2, C-3, D-1"],
  answer: 0,
  explanation: "A-1, B-2, C-3, D-4 fits.",
};

const statements: PrepQuestion = {
  ...match,
  id: "s1",
  type: "statement",
  lists: undefined,
  stem: "Which are true?",
  statements: ["A. One", "B. Two", "C. Three"],
  options: ["A and B only", "B and C only", "A and C only", "A, B and C"],
  explanation: "Statement C is false.",
};

describe("question labels", () => {
  it("labels List I A to D and List II I to IV, and rewrites the codes", () => {
    render(<QuestionBody q={toView(normaliseLabels(match))} />);
    for (const l of ["A.", "B.", "C.", "D.", "I.", "II.", "III.", "IV."]) expect(screen.getByText(l)).toBeInTheDocument();
    expect(screen.getByText("Paired t")).toBeInTheDocument();
    expect(screen.queryByText(/a\) Paired/)).toBeNull();
    expect(normaliseLabels(match).options[0]).toBe("A-I, B-II, C-III, D-IV");
  });
  it("numbers statements 1 to n", () => {
    const q = normaliseLabels(statements);
    render(<QuestionBody q={toView(q)} />);
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem").map((li) => li.textContent)).toEqual(["1.One", "2.Two", "3.Three"]);
    expect(q.options).toEqual(["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"]);
  });
});

describe("QuestionRunner", () => {
  const q = toView(normaliseLabels(statements));
  const props = { questions: [q], canSave: true, preview: false, label: "Test", again: "reset" as const, back: { href: "/prep", label: "Exam Prep" }, empty: null };

  it("shows right or wrong, the correct answer and the explanation", async () => {
    render(<QuestionRunner {...props} />);
    fireEvent.click(screen.getByRole("radio", { name: /1 and 2 only/ }));
    fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
    expect(await screen.findByText("Wrong")).toBeInTheDocument();
    expect(screen.getByText(/Correct answer: 2\. 2 and 3 only/)).toBeInTheDocument();
    expect(screen.getByText("Because two.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Learn this/ })).toHaveAttribute("href", "/study/statistics/2-5");
    fireEvent.click(screen.getByRole("button", { name: /See your score/ }));
    expect(screen.getByText("0 of 1 right")).toBeInTheDocument();
  });

  it("saves a question", async () => {
    render(<QuestionRunner {...props} />);
    const save = screen.getByRole("button", { name: "Save" });
    expect(save).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(save);
    expect(await screen.findByRole("button", { name: "Saved" })).toHaveAttribute("aria-pressed", "true");
    expect(toggleSaved).toHaveBeenCalledWith({ id: "s1", saved: true });
  });

  it("can show the answer without answering", async () => {
    render(<QuestionRunner {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /Show the answer/ }));
    expect(await screen.findByText("The answer")).toBeInTheDocument();
  });

  it("shows a question's diagram after answering, not before", async () => {
    VISUALS.s1 = { kind: "flow", data: { title: "Steps" }, caption: "How it flows" };
    render(<QuestionRunner {...props} />);
    expect(screen.queryByText(/Diagram:/)).toBeNull();
    fireEvent.click(screen.getByRole("radio", { name: /2 and 3 only/ }));
    fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
    expect(await screen.findByText("Diagram: flow Steps", {}, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.getByText("How it flows")).toBeInTheDocument();
    delete VISUALS.s1;
  });

  it("a broken or unknown diagram is skipped and the page still works", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    VISUALS.s1 = { kind: "flow", data: { boom: true }, caption: "Never shown" };
    const { unmount } = render(<QuestionRunner {...props} />);
    fireEvent.click(screen.getByRole("radio", { name: /2 and 3 only/ }));
    fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
    expect(await screen.findByText("Right", {}, { timeout: 8000 })).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByText("Never shown")).toBeNull();
    expect(screen.getByRole("button", { name: /See your score/ })).toBeInTheDocument();
    unmount();
    VISUALS.s1 = { kind: "not-a-widget", data: {} };
    render(<QuestionRunner {...props} />);
    fireEvent.click(screen.getByRole("radio", { name: /2 and 3 only/ }));
    fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
    expect(await screen.findByText("Right", {}, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.queryByText(/Diagram:/)).toBeNull();
    delete VISUALS.s1;
    spy.mockRestore();
  });
});
