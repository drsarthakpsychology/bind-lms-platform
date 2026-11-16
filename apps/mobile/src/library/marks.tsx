import * as React from "react";
import { View } from "react-native";

import { useTheme } from "@/theme";

/**
 * The class colour mark: a small square beside every medicine, one look per
 * group, so a list or a compare reads at a glance. Shape (filled or outlined)
 * as well as colour, so it never relies on colour alone; the group name is
 * always written next to it.
 */
const LOOK: Record<string, { fill: "brand" | "ink" | "primary" | "wash" | "soft" | "none"; ring?: boolean }> = {
  Antidepressants: { fill: "brand" },
  Antipsychotics: { fill: "ink" },
  "Mood stabilisers": { fill: "primary", ring: true },
  "Anxiety and sleep": { fill: "wash", ring: true },
  "ADHD, dementia and addiction": { fill: "soft" },
  "Side-effect medicines": { fill: "none", ring: true },
};

/**
 * `spine`: the website's family spine, a short upright bar at the row's left
 * edge. Used in lists, where a small square read as a checkbox (in dark
 * above all). The square stays for inline marks next to a word.
 */
export function ClassMark({ group, size = 12, spine }: { group: string; size?: number; spine?: boolean }) {
  const c = useTheme();
  const l = LOOK[group] ?? { fill: "none", ring: true };
  const bg = l.fill === "brand" ? c.brand : l.fill === "ink" ? c.ink : l.fill === "primary" ? c.primary : l.fill === "wash" ? c.sk.wash : l.fill === "soft" ? c.sk.soft : "transparent";
  if (spine) return <View accessible={false} importantForAccessibility="no" style={{ width: 6, height: 32, borderRadius: 3, backgroundColor: bg, borderWidth: l.ring ? 1.5 : 0, borderColor: c.dark ? c.muted : c.ink }} />;
  return <View accessible={false} importantForAccessibility="no" style={{ width: size, height: size, borderRadius: 3, backgroundColor: bg, borderWidth: l.ring ? 1.5 : 0, borderColor: c.ink }} />;
}
