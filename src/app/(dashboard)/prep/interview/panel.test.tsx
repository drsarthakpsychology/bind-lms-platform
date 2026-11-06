// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const reveal = vi.fn(async () => ({ modelAnswer: "A strong model answer.", mustCover: ["Point one", "Point two"], redFlags: ["Red flag one"] }));
const feedback = vi.fn(async () => ({ error: "AI feedback isn't available right now. Use the checklist above." }));
const save = vi.fn(async () => ({ saved: true, score: 50 }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("../actions", () => ({
  revealInterview: (...a: unknown[]) => reveal(...(a as [])),
  interviewFeedback: (...a: unknown[]) => feedback(...(a as [])),
  saveInterviewSession: (...a: unknown[]) => save(...(a as [])),
}));

import { InterviewPanel } from "./panel";

describe("InterviewPanel", () => {
  it("asks, follows up, then shows the rubric and model answer only after answering", async () => {
    render(<InterviewPanel questions={[{ id: "q1", category: "About you", question: "Why clinical psychology?", followUp: "Why now?" }]} saving />);
    fireEvent.click(screen.getByRole("button", { name: /Start/ }));
    // No speech recognition in this browser: no mic button, typing still works.
    expect(screen.queryByRole("button", { name: /Speak instead/ })).toBeNull();
    expect(screen.queryByText("A strong model answer.")).toBeNull();
    fireEvent.change(screen.getByLabelText("Your answer"), { target: { value: "Because I want to help people recover well" } });
    fireEvent.click(screen.getByRole("button", { name: /I've answered/ }));
    expect(screen.getByText("Why now?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Skip the follow-up/ }));
    await screen.findByText("A strong model answer.");

    fireEvent.click(screen.getByLabelText("Point one"));
    expect(screen.getByText(/Your score for this one: 50%/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Red flag one"));
    expect(screen.getByText(/Your score for this one: 35%/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Get AI feedback/ }));
    await screen.findByText(/AI feedback isn't available right now/);

    fireEvent.click(screen.getByRole("button", { name: /Finish/ }));
    await screen.findByText(/Saved\./);
    expect(save).toHaveBeenCalledWith({ items: [{ id: "q1", answer: "Because I want to help people recover well", covered: ["Point one"], flags: ["Red flag one"], feedback: null }] });
  });
});
