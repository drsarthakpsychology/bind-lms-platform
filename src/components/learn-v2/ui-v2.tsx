"use client";

import * as React from "react";

/**
 * Tells shared learning parts (the test runner, the card deck, the note
 * toolbar) to draw themselves in the new design. The page decides (ui_v2,
 * lib/ui/v2.ts) and wraps its screen; the parts keep one set of logic and
 * only switch their markup.
 */
const Ctx = React.createContext(false);

export function UiV2({ on, children }: { on: boolean; children: React.ReactNode }) {
  return <Ctx.Provider value={on}>{children}</Ctx.Provider>;
}

export function useUiV2(): boolean {
  return React.useContext(Ctx);
}
