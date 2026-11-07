// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const updateForm = vi.fn();
vi.mock("./actions", () => ({ updateForm: (...a: unknown[]) => updateForm(...a), createForm: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), back: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { FormBuilder } from "./form-builder";

beforeEach(() => {
  updateForm.mockReset();
  updateForm.mockResolvedValue({ error: null, id: "f1" });
});

describe("FormBuilder", () => {
  it("keeps saved keys when renamed or moved, and gives new questions unused keys", async () => {
    render(
      <FormBuilder
        formId="f1"
        initial={{ title: "T", description: "", isActive: true, fields: [{ key: "full_name", type: "text", label: "Full Name", required: true }, { key: "year_of_study", type: "text", label: "Year", required: true }] }}
        reservedKeys={["full_name", "year_of_study", "course_department"]}
        responses={259}
      />,
    );
    fireEvent.change(screen.getAllByLabelText("Question")[0], { target: { value: "Your name" } });
    fireEvent.click(screen.getByRole("button", { name: "Move question 2 up" }));
    fireEvent.click(screen.getByRole("button", { name: /Add question/ }));
    fireEvent.change(screen.getAllByLabelText("Question")[2], { target: { value: "Course Department" } });
    fireEvent.change(screen.getAllByLabelText("Answer type")[2], { target: { value: "dropdown" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(updateForm).toHaveBeenCalled());
    const fields = updateForm.mock.calls[0][1].fields;
    expect(fields.map((f: { key: string }) => f.key)).toEqual(["year_of_study", "full_name", "course_department_2"]);
    expect(fields[1].label).toBe("Your name");
    expect(fields[2]).toMatchObject({ type: "dropdown", options: ["Option 1", "Option 2"] });
  });

  it("previews the questions", () => {
    render(<FormBuilder initial={{ title: "Hello", description: "", isActive: true, fields: [{ key: "a", type: "email", label: "Email", required: true }] }} reservedKeys={[]} responses={0} />);
    fireEvent.click(screen.getByRole("tab", { name: /Preview/ }));
    expect(screen.getByRole("heading", { name: "Hello" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toHaveAttribute("type", "email");
  });
});
