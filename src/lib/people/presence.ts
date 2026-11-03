/**
 * Where a student is right now, from their last moment on the platform.
 * "now" = seen in the last 5 minutes (the visit tracker reports every 2).
 */
export const ACTIVE_NOW_MS = 5 * 60 * 1000;
const DAY = 86400000;

export type Presence = "now" | "today" | "week" | "quiet" | "never";

export function presenceOf(lastSeen: string | null | undefined, now: number): Presence {
  if (!lastSeen) return "never";
  const ago = now - new Date(lastSeen).getTime();
  if (ago < ACTIVE_NOW_MS) return "now";
  if (ago < DAY) return "today";
  if (ago < 7 * DAY) return "week";
  return "quiet";
}

export const PRESENCE_LABEL: Record<Presence, string> = {
  now: "Active now",
  today: "Active today",
  week: "Active this week",
  quiet: "Quiet",
  never: "Not started",
};

/** The end of a visit: left_at, else entered_at + duration, else entered_at. */
export function visitEnd(v: { entered_at: string; left_at?: string | null; duration_seconds?: number | null }): string {
  if (v.left_at) return v.left_at;
  const t = new Date(v.entered_at).getTime() + Math.max(0, v.duration_seconds ?? 0) * 1000;
  return new Date(t).toISOString();
}

/** Latest of several ISO times (nulls ignored). */
export function latest(...xs: (string | null | undefined)[]): string | null {
  let best: string | null = null;
  for (const x of xs) if (x && (!best || new Date(x).getTime() > new Date(best).getTime())) best = x;
  return best;
}
