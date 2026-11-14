"use client";

import * as React from "react";

/**
 * Whether the new design (ui_v2) is on for this account, for client parts
 * that cannot ask the server: the shared loading, error and not-found states
 * and the first-login overlays. Set once by the dashboard layout.
 */
const UiV2Context = React.createContext(false);

export function UiV2Provider({ value, children }: { value: boolean; children: React.ReactNode }) {
  return <UiV2Context.Provider value={value}>{children}</UiV2Context.Provider>;
}

export function useUiV2(): boolean {
  return React.useContext(UiV2Context);
}

/** Shows `next` when the new design is on, else `old`. */
export function V2Switch({ next, old }: { next: React.ReactNode; old: React.ReactNode }) {
  return <>{useUiV2() ? next : old}</>;
}
