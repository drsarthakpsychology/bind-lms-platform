import * as React from "react";

import type { Area, Palette, Swatch } from "./tokens";

const AreaContext = React.createContext<Area | null>(null);

/** Sets the accent family for everything inside (a tab screen does this through `Screen area`). */
export function AreaProvider({ area, children }: { area: Area | null | undefined; children: React.ReactNode }) {
  return <AreaContext.Provider value={area ?? null}>{children}</AreaContext.Provider>;
}

/** The area this part sits in, or null outside a tab screen. */
export function useAreaName(): Area | null {
  return React.useContext(AreaContext);
}

/** The neutral look used outside an area: the same shapes, in greys. */
export function neutralSwatch(c: Palette): Swatch {
  return { wash: c.tint, deep: c.muted, onDeep: c.bg };
}
