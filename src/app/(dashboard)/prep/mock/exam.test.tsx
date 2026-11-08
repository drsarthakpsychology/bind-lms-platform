// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SAMPLE_QUESTIONS } from "@/lib/prep/fixtures.test-data";
import { toView } from "@/lib/prep/view";

const views = SAMPLE_QUESTIONS.slice(0, 4).map(toView);
const start = vi.fn();
const submit = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));
vi.mock("../actions", () => ({
  startMock: (...a: unknown[]) => start(...a),
  submitMock: (...a: unknown[]) => submit(...a),
}));

import { MockExam } from "./exam";

const RESULT = {
  specId: "x",
  title: "Test mock",
  marksPerRight: 4,
  marksPerWrong: -1,
  score: 4,
  max: 16,
  right: 1,
  wrong: 0,
  blank: 3,
  accuracy: 1,
  standing: { rank: 1, of: 1, percentile: null },
  saved: true,
  late: false,
  totalMs: 1000,
  sections: [],
  subjects: [],
  rows: [],
};

function paper(deadlineIn = 60 * 60_000) {
  const now = Date.now();
  return { attemptId: "a1", specId: "x", deadline: now + deadlineIn, serverNow: now, sections: [{ title: "Paper", wanted: 10, questions: views }] };
}

afterEach(() => {
  start.mockReset();
  submit.mockReset();
});

describe("MockExam", () => {
  it("answers with keys, marks for review, shows the palette states and submits after confirming", async () => {
    start.mockResolvedValue(paper());
    submit.mockResolvedValue(RESULT);
    render(<MockExam specId="x" title="Test mock" intro={<p>Intro</p>} />);
    fireEvent.click(screen.getByRole("button", { name: /Start the mock/ }));
    await screen.findByText(/Question 1 of 4/, {}, { timeout: 5_000 });
    expect(screen.getByText(/This mock has 4 of 10 questions/)).toBeInTheDocument();

    // Under a busy machine the key handler can land a tick late, so wait for each effect.
    fireEvent.keyDown(window, { key: "2" });
    await waitFor(() => expect(screen.getAllByRole("radio")[1]).toHaveAttribute("aria-checked", "true"));
    fireEvent.keyDown(window, { key: "m" });
    await waitFor(() => expect(screen.getByRole("button", { name: /Marked/ })).toHaveAttribute("aria-pressed", "true"));
    fireEvent.keyDown(window, { key: "n" });
    await screen.findByText(/Question 2 of 4/, {}, { timeout: 5_000 });

    expect(screen.getAllByRole("button", { name: "Question 1: Answered and marked" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Question 2: Not answered" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Question 3: Not visited" }).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /^Submit$/ }));
    expect(screen.getByText("Submit your paper?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Submit now/ }));
    // The result shows; rank among students is switched off (PREP_ONBOARDING_ENABLED).
    await screen.findByRole("heading", { name: "Time" }, { timeout: 5_000 });
    expect(screen.queryByText(/VIBHA student|Rank \d/)).toBeNull();
    const sent = submit.mock.calls[0][0];
    expect(sent.answers).toEqual({ [views[0].id]: 1 });
    expect(sent.marked).toEqual([views[0].id]);
    expect(sent.attemptId).toBe("a1");
  });

  it("submits on its own when time is up, once", async () => {
    start.mockResolvedValue(paper(1_200));
    submit.mockResolvedValue(RESULT);
    render(<MockExam specId="x" title="Test mock" intro={<p>Intro</p>} />);
    fireEvent.click(screen.getByRole("button", { name: /Start the mock/ }));
    await screen.findByText(/Question 1 of 4/);
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1), { timeout: 4_000 });
    await screen.findByRole("heading", { name: "Time" });
    await new Promise((r) => setTimeout(r, 1_200));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("keeps the answers and offers a retry when submit fails", async () => {
    start.mockResolvedValue(paper());
    submit.mockResolvedValueOnce({ error: "Network down" }).mockResolvedValueOnce(RESULT);
    render(<MockExam specId="x" title="Test mock" intro={<p>Intro</p>} />);
    fireEvent.click(screen.getByRole("button", { name: /Start the mock/ }));
    await screen.findByText(/Question 1 of 4/);
    fireEvent.click(screen.getByRole("button", { name: /^Submit$/ }));
    fireEvent.click(screen.getByRole("button", { name: /Submit now/ }));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: /Try again/ }));
    await screen.findByRole("heading", { name: "Time" });
  });
});
