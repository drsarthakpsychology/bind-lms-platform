import { promotionLine, safetyLine, zoneSize } from "./tiers";

/**
 * The relative league view: the top 3, then you and two either side, with a
 * gap marker where rows are skipped. Nobody else's low place is ever listed
 * on its own, so there is no public "bottom" list. Pure.
 */
export type ViewItem = { kind: "row"; index: number } | { kind: "gap"; hidden: number };

export function relativeView(length: number, meIndex: number, top = 3, around = 2): ViewItem[] {
  const keep = new Set<number>();
  for (let i = 0; i < Math.min(top, length); i++) keep.add(i);
  if (meIndex >= 0 && meIndex < length) for (let i = meIndex - around; i <= meIndex + around; i++) if (i >= 0 && i < length) keep.add(i);
  const idx = [...keep].sort((a, b) => a - b);
  const out: ViewItem[] = [];
  let prev = -1;
  for (const i of idx) {
    if (i - prev > 1) out.push({ kind: "gap", hidden: i - prev - 1 });
    out.push({ kind: "row", index: i });
    prev = i;
  }
  if (length - 1 - prev > 0) out.push({ kind: "gap", hidden: length - 1 - prev });
  return out;
}

/** Where the promotion line falls: after this many rows (0 = nobody moves up). */
export function promotionCut(length: number): number {
  return zoneSize(length);
}

export type ZoneNote = { kind: "promote" | "top" | "chase" | "drop" | "safe" | "none"; text: string };

/**
 * The private line under your league: how far you are from going up, or (only
 * for you) how far from safety. `points` is ranked high → low.
 */
export function zoneNote(points: readonly number[], meIndex: number, tier: number): ZoneNote {
  if (meIndex < 0) return { kind: "none", text: "Earn points this week to join a league." };
  const ranked = points.map((p) => ({ points: p }));
  const mine = points[meIndex];
  const up = promotionLine(ranked);
  const safe = safetyLine(ranked);
  const z = zoneSize(points.length);
  if (up === null) return { kind: "none", text: "More players join your group as the week goes on." };
  const inUp = mine > 0 && (meIndex < z || mine >= up);
  if (inUp) return tier >= 5 ? { kind: "top", text: "You're in the top 5 of Mind. Hold it." } : { kind: "promote", text: "You're in the promotion zone. Hold it till Sunday night." };
  const need = Math.max(1, up - mine);
  const chase = tier >= 5 ? `${need} ${need === 1 ? "point" : "points"} to the top ${z}` : `${need} ${need === 1 ? "point" : "points"} to promotion`;
  if (tier > 1 && (mine === 0 || (safe !== null && meIndex >= points.length - z && mine < safe))) {
    const toSafe = Math.max(1, (safe ?? 0) - mine);
    return { kind: "drop", text: `You're in the drop zone. ${toSafe} ${toSafe === 1 ? "point" : "points"} to safety.` };
  }
  return { kind: "chase", text: chase };
}
