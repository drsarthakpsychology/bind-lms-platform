// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { SIDEBAR_BOOT_SCRIPT } from "./sidebar-boot";
import { setFocusPref, toggleSidebar } from "./sidebar-state";

const html = () => document.documentElement;

afterEach(() => {
  html().removeAttribute("data-sidebar");
  html().removeAttribute("data-sidebar-focus");
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
  vi.restoreAllMocks();
});

describe("remembered sidebar size", () => {
  it("the boot script copies the stored choice onto <html>", () => {
    localStorage.setItem("vibha-sidebar", "mini");
    localStorage.setItem("vibha-sidebar-focus", "full");
    new Function(SIDEBAR_BOOT_SCRIPT)();
    expect(html().getAttribute("data-sidebar")).toBe("mini");
    expect(html().getAttribute("data-sidebar-focus")).toBe("full");
  });

  it("the boot script ignores junk and survives blocked storage", () => {
    localStorage.setItem("vibha-sidebar", "huge");
    new Function(SIDEBAR_BOOT_SCRIPT)();
    expect(html().hasAttribute("data-sidebar")).toBe(false);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => new Function(SIDEBAR_BOOT_SCRIPT)()).not.toThrow();
  });

  it("opening the folded sidebar is remembered; folding forgets it", () => {
    setFocusPref("full");
    expect(html().getAttribute("data-sidebar-focus")).toBe("full");
    expect(localStorage.getItem("vibha-sidebar-focus")).toBe("full");
    setFocusPref("icons");
    expect(html().hasAttribute("data-sidebar-focus")).toBe(false);
    expect(localStorage.getItem("vibha-sidebar-focus")).toBeNull();
  });

  it("still works for the page view when storage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    setFocusPref("full");
    expect(html().getAttribute("data-sidebar-focus")).toBe("full");
  });

  it("the menu button flips the focus choice on focus pages, the everyday one elsewhere", () => {
    vi.stubGlobal("innerWidth", 1440);
    toggleSidebar(true);
    expect(html().getAttribute("data-sidebar-focus")).toBe("full");
    toggleSidebar(true);
    expect(html().hasAttribute("data-sidebar-focus")).toBe(false);
    toggleSidebar(false);
    expect(html().getAttribute("data-sidebar")).toBe("mini");
    expect(html().hasAttribute("data-sidebar-focus")).toBe(false);
    vi.unstubAllGlobals();
  });
});
