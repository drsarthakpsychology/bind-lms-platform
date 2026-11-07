// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ResponsesTable, type ResponseRow, type TableColumn } from "./responses-table";

const columns: TableColumn[] = [
  { key: "full_name", label: "Full Name", removed: false, inTable: false },
  { key: "year_of_study", label: "Year of Study", removed: false, inTable: true },
  { key: "old_q", label: "Old q", removed: true, inTable: true },
];

const rows: ResponseRow[] = Array.from({ length: 259 }, (_, i) => ({
  id: String(i).padStart(4, "0"),
  at: new Date(Date.UTC(2026, 9, 8, 0, i)).toISOString(),
  when: `row ${i}`,
  name: i === 7 ? "Zara Special" : `Person ${i}`,
  email: `p${i}@x.co`,
  phone: "9876543210",
  contactId: i === 7 ? "c7" : null,
  answers: { full_name: `Person ${i}`, year_of_study: i % 2 ? "2nd" : "3rd", old_q: i === 7 ? "kept answer" : "" },
}));

describe("ResponsesTable", () => {
  it("shows 50 per page, newest first, with removed questions labelled", () => {
    render(<ResponsesTable rows={rows} columns={columns} />);
    expect(screen.getByText("Showing 1 to 50 of 259")).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(51);
    expect(within(table).getByText("Old q (removed)")).toBeInTheDocument();
    expect(within(table).getAllByRole("row")[1]).toHaveTextContent("Person 258");
    fireEvent.click(screen.getByRole("button", { name: /Next/ }));
    expect(screen.getByText("Page 2 of 6")).toBeInTheDocument();
  });

  it("searches any answer and opens the detail with a contact link", () => {
    render(<ResponsesTable rows={rows} columns={columns} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "kept answer" } });
    expect(screen.getByText("Showing 1 to 1 of 1")).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("table")).getByRole("button", { name: "Zara Special" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("link", { name: /Contact/ })).toHaveAttribute("href", "/admin/forms/contacts/c7");
    expect(within(dialog).getByText("Old q (removed question)")).toBeInTheDocument();
  });

  it("sorts by name when the header is tapped", () => {
    render(<ResponsesTable rows={rows} columns={columns} />);
    fireEvent.click(within(screen.getByRole("table")).getByRole("button", { name: "Name" }));
    expect(within(screen.getByRole("table")).getAllByRole("row")[1]).toHaveTextContent("Person 0");
  });
});
