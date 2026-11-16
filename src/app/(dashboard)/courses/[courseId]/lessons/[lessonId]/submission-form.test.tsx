// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const unsubmit = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("./actions", () => ({ prepareSubmissionUpload: vi.fn(), submitWithFiles: vi.fn(), unsubmitAssignment: (...a: unknown[]) => unsubmit(...a) }));

import { SubmissionForm } from "./submission-form";

const submitted = {
  status: "submitted" as const,
  submittedAt: "2026-11-10T10:00:00Z",
  isLate: false,
  note: "My MSE write-up",
  files: [{ id: "f1", originalName: "mse.pdf", storagePath: "x/mse.pdf" }],
};

function renderIt() {
  render(<SubmissionForm assignmentId="a1" dueAt={null} allowLate maxFiles={3} maxFileMb={25} existing={submitted} />);
  fireEvent.click(screen.getByRole("button", { name: /Unsubmit and edit/ }));
}

describe("SubmissionForm, already submitted", () => {
  it("shows why Unsubmit was refused", async () => {
    unsubmit.mockResolvedValueOnce({ error: "This assignment is past its due date." });
    renderIt();
    expect(await screen.findByRole("alert")).toHaveTextContent("past its due date");
    expect(screen.getByRole("button", { name: /Unsubmit and edit/ })).not.toBeDisabled();
  });

  it("says so and frees the button when the connection drops", async () => {
    unsubmit.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    renderIt();
    expect(await screen.findByRole("alert")).toHaveTextContent("Check your connection");
    expect(screen.getByRole("button", { name: /Unsubmit and edit/ })).not.toBeDisabled();
  });
});
