"use client";

import * as React from "react";

/**
 * Whether the new design (ui_v2, lib/ui/v2.ts) is on, for client parts that
 * cannot ask the server: shared runners and forms that keep one set of logic
 * and switch only their markup, and the loading, error and not-found states.
 * Set once by the dashboard layout. A page may set it again around its own
 * screen (`<UiV2 on>`), which is what tests and fixture pages do.
 */
const UiV2Context = React.createContext(false);

export function UiV2Provider({ value, children }: { value: boolean; children: React.ReactNode }) {
  return <UiV2Context.Provider value={value}>{children}</UiV2Context.Provider>;
}

/** The same provider, written the way a page reads: `<UiV2 on={v2}>`. */
export function UiV2({ on, children }: { on: boolean; children: React.ReactNode }) {
  return <UiV2Context.Provider value={on}>{children}</UiV2Context.Provider>;
}

export function useUiV2(): boolean {
  return React.useContext(UiV2Context);
}

/** Shows `next` when the new design is on, else `old`. */
export function V2Switch({ next, old }: { next: React.ReactNode; old: React.ReactNode }) {
  return <>{useUiV2() ? next : old}</>;
}
