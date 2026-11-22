/**
 * One colour accent per game and practice tool. No new colours: each one
 * borrows one of the five area families from the theme (lime-green, blue,
 * peach, mint, lilac), so contrast is already checked in light and dark.
 * The accent is small on purpose (docs/DESIGN.md: "a small icon patch, never
 * a whole card"): the emblem on a start screen, the tile's icon patch on the
 * hub, the ring on a result.
 */
import * as React from "react";

import { useTheme, type Area, type Swatch } from "@/theme";

export type AccentName = Area;

const BY_ID: Record<string, AccentName> = {
  // games
  blitz: "home",
  quickfire: "home",
  sort: "learn",
  mse: "library",
  "mse-lab": "library",
  ward: "practise",
  rx: "me",
  duel: "practise",
  escape: "learn",
  comorbid: "library",
  // cases
  daily: "practise",
  detective: "me",
  wwyd: "practise",
  "two-minute": "home",
  "say-it": "library",
  terms: "library",
  judgment: "me",
  ethics: "learn",
  landmark: "me",
  osce: "home",
  "mse-trainer": "library",
  formulation: "learn",
  "out-of-depth": "practise",
  "weak-spots": "home",
  rich: "practise",
  // exam prep
  prep: "learn",
  long: "learn",
  mock: "learn",
};

export function accentFor(id: string | null | undefined): AccentName {
  return (id && BY_ID[id]) || "practise";
}

const Ctx = React.createContext<AccentName>("practise");

/** Sets the accent for everything a game or tool draws inside the shell. */
export const AccentProvider = Ctx.Provider;

/** The current game's accent colours for this theme. */
export function useGameAccent(name?: AccentName): Swatch {
  const c = useTheme();
  const own = React.useContext(Ctx);
  return c.areas[name ?? own];
}

/** The emblem's fill and icon colour on the blue field: a pastel patch in both themes. */
export function emblemOn(dark: boolean, a: Swatch): { bg: string; fg: string } {
  return dark ? { bg: a.deep, fg: a.onDeep } : { bg: a.wash, fg: a.deep };
}
