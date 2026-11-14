// @vitest-environment jsdom
/**
 * Home's Continue opens a section on the part the student was last reading
 * (kept in this browser), not on part 1. A finished section opens on its end
 * screen. Moving through the parts saves the place.
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { emptyState, finishSection } from "@/lib/learn/engine";
import { SectionReader, type TocItem } from "./reader";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock("@/lib/learn/track", () => ({ trackLearn: () => {} }));
vi.mock("./marks", () => ({ SectionMarks: () => null }));
vi.mock("@/components/learn/view-toggle", () => ({ ViewToggle: () => null }));

beforeAll(() => {
  // Phone width: one part at a time.
  window.matchMedia = ((q: string) => ({ matches: /reduce/.test(q), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })) as unknown as typeof window.matchMedia;
  Element.prototype.scrollIntoView = () => {};
});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

const toc: TocItem[] = [
  { id: "1-1", num: "1.1", title: "One", isTest: false, href: "/study/m/1-1" },
  { id: "1-2", num: "1.2", title: "Two", isTest: false, href: "/study/m/1-2" },
];
const chunks = ["Alpha", "Beta", "Gamma"].map((t) => ({ title: t, node: <p>{t} text</p> }));

function reader(owner: string, state = emptyState()) {
  return (
    <SectionReader
      moduleId="m"
      moduleNum={1}
      moduleTitle="Module"
      section={{ id: "1-1", num: "1.1", title: "One", isTest: false }}
      toc={toc}
      next={{ href: "/study/m/1-2", label: "1.2 Two" }}
      serverState={state}
      save={async () => ({ ok: true })}
      owner={owner}
      chunks={chunks}
      recall={[]}
      viva={[]}
      mcq={[]}
    />
  );
}

describe("the reader resumes on the saved part", () => {
  it("opens on part 1 with nothing saved", () => {
    render(reader("u1"));
    expect(screen.getByText("Alpha text")).toBeInTheDocument();
    expect(screen.getByText("Part 1 of 3")).toBeInTheDocument();
  });

  it("opens on the part saved in this browser", () => {
    window.localStorage.setItem("vibha-study-part:m/1-1", "2");
    render(reader("u2"));
    expect(screen.getByText("Gamma text")).toBeInTheDocument();
    expect(screen.getByText("Part 3 of 3")).toBeInTheDocument();
  });

  it("saves the place as the student moves on", () => {
    render(reader("u3"));
    fireEvent.click(screen.getByRole("button", { name: /Next/ }));
    expect(window.localStorage.getItem("vibha-study-part:m/1-1")).toBe("1");
    expect(screen.getByText("Beta text")).toBeInTheDocument();
  });

  it("a finished section opens on its end screen, whatever was saved", () => {
    window.localStorage.setItem("vibha-study-part:m/1-1", "1");
    render(reader("u4", finishSection(emptyState(), "m", "1-1", "2026-11-01")));
    expect(screen.queryByText("Beta text")).toBeNull();
    expect(screen.getByText("1.2 Two")).toBeInTheDocument();
  });
});
