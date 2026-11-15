// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MedicineEditorV2 } from "./medicine-editor";
import type { MedicationDocument } from "@/lib/psychopharm/document";

const doc = {
  generic_name: "sertraline",
  sections: [
    {
      id: "s1",
      title: "What it does",
      blocks: [{ id: "b1", type: "mechanism", value: "Blocks the serotonin transporter.", order: 1, sources: [{ title: "A book", page: "12" }] }],
    },
  ],
} as MedicationDocument;

describe("medicine editor v2", () => {
  it("shows the page with its status, one publish action and plain controls under each block", () => {
    render(<MedicineEditorV2 drug="sertraline" drugId="d1" initialDocument={doc} initialStatus="draft" />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("sertraline");
    expect(screen.getByText("Draft, not shown to students")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish to students" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Mechanism" })).toBeInTheDocument();
    expect(screen.queryByText(/Click any text/)).toBeNull();
  });

  it("opens the source panel for a block with its saved source", () => {
    render(<MedicineEditorV2 drug="sertraline" drugId="d1" initialDocument={doc} initialStatus="published" />);
    expect(screen.getByRole("button", { name: "Publish changes" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sources for Mechanism" }));
    expect((screen.getByLabelText("Book or guideline") as HTMLInputElement).value).toBe("A book");
    expect((screen.getByLabelText("Page") as HTMLInputElement).value).toBe("12");
  });

  it("edits a block in place", () => {
    render(<MedicineEditorV2 drug="sertraline" drugId="d1" initialDocument={doc} initialStatus="draft" />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Mechanism" }));
    fireEvent.change(screen.getByLabelText("Edit Mechanism"), { target: { value: "New text." } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("New text.")).toBeInTheDocument();
  });
});
