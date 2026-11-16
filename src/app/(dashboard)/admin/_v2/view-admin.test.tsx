// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { MedicationDocument } from "@/lib/psychopharm/document";
import { MedicineEditorV2 } from "./medicine-editor";
import { CourseDetailV2, CoursesListV2 } from "./courses";
import { MailV2 } from "./mail";

const doc = { generic_name: "lithium", sections: [] } as unknown as MedicationDocument;

describe("View Admin sees no controls that only fail", () => {
  it("medicine editor: no Add section or Publish, one plain note", () => {
    render(<MedicineEditorV2 drug="lithium" drugId="d1" initialDocument={doc} initialStatus="published" canWrite={false} />);
    expect(screen.queryByRole("button", { name: /Add section/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /Publish/ })).toBeNull();
    expect(screen.getByText(/Only the Super Admin can change or publish/)).toBeInTheDocument();
  });

  it("medicine editor: a Super Admin still gets Add section and Publish", () => {
    render(<MedicineEditorV2 drug="lithium" drugId="d1" initialDocument={doc} initialStatus="draft" />);
    expect(screen.getByRole("button", { name: /Add section/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Publish to students/ })).toBeInTheDocument();
  });

  it("courses: no New course fold without a create form", () => {
    render(<CoursesListV2 courses={[{ id: "c1", title: "Internship", published: true, lessons: 14 }]} />);
    expect(screen.getByRole("link", { name: "Internship" })).toBeInTheDocument();
    expect(screen.queryByText("New course")).toBeNull();
  });

  it("mail: no Compose button for a View Admin, still there for a Super Admin", () => {
    const base = { folder: "inbox", folders: [{ id: "inbox", label: "Inbox" }], counts: {}, keys: null, list: [] };
    const { unmount } = render(<MailV2 {...base} canCompose={false} />);
    expect(screen.queryByRole("link", { name: /Compose/ })).toBeNull();
    unmount();
    render(<MailV2 {...base} />);
    expect(screen.getAllByRole("link", { name: /Compose/ }).length).toBeGreaterThan(0);
  });

  it("course page: no Add a lecture fold without an add form", () => {
    render(<CourseDetailV2 title="Internship" published count="0" weeks={[]} emptyText="No lectures yet." addOpen={false} people={null} materials={null} materialCount={0} />);
    expect(screen.queryByText("Add a lecture")).toBeNull();
    expect(screen.getByText("No lectures yet.")).toBeInTheDocument();
  });
});
