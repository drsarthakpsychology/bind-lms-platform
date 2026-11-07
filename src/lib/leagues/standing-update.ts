import { tierName } from "./tiers";
import { ordinal } from "./percentile";

/**
 * The twice-weekly standing update (owner decision 30, plan §4.3): one short
 * in-app note on Monday and Thursday evening that batches the week's news,
 * good and bad. Never one note per loss. Pure, so it is unit-tested.
 */

export type Snapshot = { rank: number; points: number; ahead: readonly string[] };

export type UpdateInput = {
  /** The last snapshot (null on the first update). */
  before: Snapshot | null;
  now: Snapshot;
  /** Points of each place in the group now, ranked high → low. */
  groupPoints: readonly number[];
  /** Display names for user ids (alias or first name + initial). */
  names: ReadonlyMap<string, string>;
  /** Monday only: how last week ended. */
  closed?: { rank: number; tier: number; result: "promoted" | "stayed" | "relegated"; nextTier: number } | null;
  /** The private percentile line, e.g. "You're in the top 7%". */
  percentile?: string | null;
  /** The zone line, e.g. "12 points to promotion". */
  zone?: string | null;
};

export type Update = { title: string; body: string };

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

/** "Ananya passed you" / "Ananya and Rohan passed you" / "Ananya and 3 others passed you". */
export function passedLine(ids: readonly string[], names: ReadonlyMap<string, string>): string | null {
  const known = ids.map((id) => names.get(id)).filter((n): n is string => Boolean(n));
  if (!known.length) return null;
  if (known.length === 1) return `${known[0]} passed you.`;
  if (known.length === 2) return `${known[0]} and ${known[1]} passed you.`;
  return `${known[0]} and ${known.length - 1} others passed you.`;
}

/** The points needed to get back to an old place (be level with whoever holds it now). */
export function pointsToPlace(groupPoints: readonly number[], place: number, mine: number): number {
  const target = groupPoints[Math.max(0, place - 1)];
  return target === undefined ? 0 : Math.max(1, target - mine);
}

export function buildStandingUpdate(input: UpdateInput): Update {
  const parts: string[] = [];
  let title = "Your standing";
  const c = input.closed;
  if (c) {
    const finish = `You finished ${ordinal(c.rank)} in ${tierName(c.tier)}.`;
    if (c.result === "promoted") {
      title = `Promoted to ${tierName(c.nextTier)}`;
      parts.push(`${finish} Promoted to ${tierName(c.nextTier)}.`);
    } else if (c.result === "relegated") {
      title = `Down to ${tierName(c.nextTier)}`;
      parts.push(`${finish} Down to ${tierName(c.nextTier)} this week. The top 5 go back up next Monday.`);
    } else {
      title = `You stayed in ${tierName(c.tier)}`;
      parts.push(`${finish} You stay in ${tierName(c.tier)}.`);
    }
  } else if (input.before) {
    const moved = input.before.rank - input.now.rank;
    if (moved < 0) {
      const back = pointsToPlace(input.groupPoints, input.before.rank, input.now.points);
      title = `You dropped ${plural(-moved, "place")}`;
      parts.push(`You dropped ${plural(-moved, "place")}. ${plural(back, "point")} gets them back.`);
    } else if (moved > 0) {
      title = `You climbed ${plural(moved, "place")}`;
      parts.push(`You climbed ${plural(moved, "place")} to ${ordinal(input.now.rank)}.`);
    } else {
      parts.push(`You're holding ${ordinal(input.now.rank)} in your league.`);
    }
    const before = new Set(input.before.ahead);
    const passed = passedLine(
      input.now.ahead.filter((id) => !before.has(id)),
      input.names,
    );
    if (passed) parts.push(passed);
  } else {
    parts.push(`You're ${ordinal(input.now.rank)} in your league this week.`);
  }
  if (input.zone) parts.push(input.zone.endsWith(".") ? input.zone : `${input.zone}.`);
  if (input.percentile) parts.push(input.percentile.endsWith(".") ? input.percentile : `${input.percentile}.`);
  return { title, body: parts.slice(0, 4).join(" ") };
}
