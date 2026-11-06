// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const replace = vi.fn();
const params = { value: new URLSearchParams("folder=sent&status=opened&id=9") };
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/admin/emails",
  useSearchParams: () => params.value,
}));

import { FilterBar, activeCount, nextQuery } from "./filter-bar";

describe("nextQuery / activeCount", () => {
  it("sets, clears and resets params, keeping the rest", () => {
    expect(nextQuery("folder=sent&q=a&id=3", { q: "priya", status: "opened" }, ["id"])).toBe("folder=sent&q=priya&status=opened");
    expect(nextQuery("folder=sent&q=a", { q: null })).toBe("folder=sent");
    expect(nextQuery("q=a", { q: "" })).toBe("");
  });
  it("counts switched-on filters", () => {
    expect(activeCount("q=&status=x&folder=sent", ["q", "status"])).toBe(1);
  });
});

describe("FilterBar", () => {
  afterEach(() => {
    replace.mockClear();
    vi.useRealTimers();
  });
  const selects = [{ param: "status", label: "Status", allLabel: "Any status", options: [{ value: "opened", label: "Opened" }, { value: "bounced", label: "Bounced" }] }];

  it("shows the URL's values and changes a select straight away", () => {
    window.history.replaceState(null, "", "/admin/emails?folder=sent&status=opened&id=9");
    render(<FilterBar search={{ label: "Search sent" }} selects={selects} />);
    const sel = screen.getByLabelText("Status");
    expect(sel).toHaveValue("opened");
    fireEvent.change(sel, { target: { value: "bounced" } });
    expect(replace).toHaveBeenCalledWith("/admin/emails?folder=sent&status=bounced", { scroll: false });
  });

  it("debounces search and clears everything with Clear", () => {
    vi.useFakeTimers();
    window.history.replaceState(null, "", "/admin/emails?folder=sent&status=opened");
    render(<FilterBar search={{ label: "Search sent" }} selects={selects} />);
    fireEvent.change(screen.getByLabelText("Search sent"), { target: { value: "priya" } });
    expect(replace).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(300));
    expect(replace).toHaveBeenCalledWith("/admin/emails?folder=sent&status=opened&q=priya", { scroll: false });
    fireEvent.click(screen.getByRole("button", { name: /Clear/ }));
    expect(replace).toHaveBeenLastCalledWith("/admin/emails?folder=sent", { scroll: false });
  });

  it("folds the dropdowns behind a Filters button on phones", () => {
    render(<FilterBar selects={selects} />);
    const btn = screen.getByRole("button", { name: /Filters \(1\)/ });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });
});
