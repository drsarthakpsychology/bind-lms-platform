// @vitest-environment jsdom
import * as React from "react";
import { act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";

// next-themes reads the saved theme in the browser only: the server sees no theme, the client sees "dark".
let theme: string | undefined;
vi.mock("next-themes", () => ({ useTheme: () => ({ resolvedTheme: theme, setTheme: vi.fn() }) }));
vi.mock("@/lib/auth/actions", () => ({ logout: vi.fn() }));
vi.mock("../view-mode-actions", () => ({ setViewMode: vi.fn() }));

import { MeDisplayRows } from "./me-controls";

describe("MeDisplayRows", () => {
  it("hydrates without a mismatch in dark mode, then shows the switch on", async () => {
    theme = undefined;
    const html = renderToString(<MeDisplayRows student={false} />);
    const box = document.createElement("div");
    box.innerHTML = html;
    document.body.appendChild(box);
    theme = "dark";
    const errors: unknown[] = [];
    await act(async () => {
      hydrateRoot(box, <MeDisplayRows student={false} />, { onRecoverableError: (e) => errors.push(e) });
    });
    expect(errors).toEqual([]);
    expect(box.querySelector('[role="switch"]')).toHaveAttribute("aria-checked", "true");
    expect(box.textContent).toContain("On");
  });
});
