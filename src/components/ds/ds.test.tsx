// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, Hero, PageFrame, Row, RowList, Section, Stat, Tint } from "./index";
import { SheetRow } from "./sheet";
import { CountUp, PageMotion, SuccessMark } from "./motion";
import { StatItem } from "./parts";

describe("ds parts", () => {
  it("PageFrame gives the screen its one H1", () => {
    render(<PageFrame title="Learn">x</PageFrame>);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("Section is a labelled region with no border or background", () => {
    const { container } = render(
      <Section id="up" title="Up next">
        <p>body</p>
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Up next" })).toBeInTheDocument();
    const cls = container.querySelector("section")!.className;
    expect(cls).not.toMatch(/border|bg-|shadow/);
  });

  it("Row links fill the row, wrap long titles and stay 56px tall", () => {
    render(
      <RowList label="Menu">
        <Row href="/progress" title="A very long row title that must wrap rather than be cut off" meta="Quiet line" />
        <Row title="Static" trailing="3" />
      </RowList>,
    );
    const link = screen.getByRole("link", { name: /very long row title/ });
    expect(link).toHaveAttribute("href", "/progress");
    expect(link.className).toContain("min-h-14");
    expect(link.innerHTML).not.toMatch(/truncate|line-clamp/);
    expect(screen.getByRole("list", { name: "Menu" }).children).toHaveLength(2);
  });

  it("Card is a thin outline with no shadow; Tint has no border", () => {
    const { container } = render(
      <>
        <Card>c</Card>
        <Tint>t</Tint>
      </>,
    );
    const [card, tint] = [...container.children] as HTMLElement[];
    expect(card.className).toContain("border-[1.5px]");
    expect(card.className).not.toMatch(/shadow/);
    expect(tint.className).not.toMatch(/border/);
  });

  it("Hero has one action, a progress bar when given, and lime only on the button and bar", () => {
    render(<Hero title="Mood and affect" progress={40} progressLabel="Lecture watched" action={{ href: "/x", label: "Resume" }} />);
    expect(screen.getByRole("link", { name: "Resume" }).className).toContain("bg-primary");
    expect(screen.getByRole("progressbar", { name: "Lecture watched" })).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByRole("region", { name: "Continue" }).className).not.toMatch(/bg-primary|border/);
  });

  it("Hero without progress shows no bar", () => {
    render(<Hero title="Start" action={{ href: "/x", label: "Start" }} />);
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("Stat shows value and label", () => {
    render(<Stat value="12" label="day streak" />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("day streak")).toBeInTheDocument();
  });

  it("SheetRow opens its sheet", () => {
    render(
      <SheetRow label="Today's quests" title="Today" trigger={<span>Today</span>}>
        <p>Quest list</p>
      </SheetRow>,
    );
    const btn = screen.getByRole("button", { name: "Today's quests" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(btn);
    expect(screen.getByText("Quest list")).toBeInTheDocument();
  });

  it("CountUp keeps the real number in the page and counts over it", () => {
    const { container } = render(<CountUp value={42} />);
    expect(screen.getByText("42")).toHaveClass("ds-count-real");
    const n = container.querySelector("[data-ds-count]") as HTMLElement;
    expect(n.style.getPropertyValue("--ds-to")).toBe("42");
    expect(container.textContent).toBe("42");
  });

  it("CountUp counts a percentage and leaves other values alone", () => {
    const { container, rerender } = render(<CountUp value="72%" />);
    expect(container.textContent).toBe("72%");
    expect(container.querySelector("[data-ds-count]")).not.toBeNull();
    for (const v of [0, "3/5", "1.5", 12345, "07"]) {
      rerender(<CountUp value={v} />);
      expect(container.querySelector("[data-ds-count]")).toBeNull();
      expect(container.textContent).toBe(String(v));
    }
  });

  it("StatItem and Stat count their numbers up", () => {
    const { container } = render(<StatItem value={7} sub="of 9" label="Tests passed" />);
    expect(container.querySelector("dd [data-ds-count]")).not.toBeNull();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("PageMotion renders the page where View Transitions are missing", () => {
    render(<PageMotion><p>page</p></PageMotion>);
    expect(screen.getByText("page")).toBeInTheDocument();
  });

  it("rows, progress and the mark carry the motion hooks", () => {
    const { container } = render(
      <>
        <RowList label="L"><Row href="/a" title="A" /></RowList>
        <Hero title="T" progress={30} action={{ href: "/x", label: "Go" }} />
        <SuccessMark />
      </>,
    );
    expect(screen.getByRole("list", { name: "L" })).toHaveAttribute("data-ds-list");
    expect(screen.getByRole("link", { name: "A" }).className).toContain("ds-press");
    expect(container.querySelector(".ds-fill")).not.toBeNull();
    expect(container.querySelector(".ds-success-mark")).toHaveAttribute("aria-hidden", "true");
  });
});
