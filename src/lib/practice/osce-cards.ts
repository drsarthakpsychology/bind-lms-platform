import type { OsceStation } from "./osce";

/**
 * What the station list needs, and nothing more: no checklist, no model
 * points, no role brief. The full station (one at a time) comes from the
 * server when it is opened, and the score is worked out on the server.
 */
export type OsceCard = { id: string; number: number; title: string; task: string; duration_seconds: number; level: number };

export function toCards(stations: readonly OsceStation[]): OsceCard[] {
  return stations.map((s, i) => ({ id: s.id, number: i + 1, title: s.title, task: s.task, duration_seconds: s.duration_seconds, level: s.tags?.difficulty ?? 0 }));
}

/** The server's score for a self-assessed station: ticked items by weight, 60/40 with the global rating. */
export function scoreStation(station: OsceStation, ticked: readonly string[], globalRating: number) {
  const done = new Set(ticked);
  const total = station.checklist.reduce((a, c) => a + (c.weight ?? 1), 0);
  const got = station.checklist.reduce((a, c) => a + (done.has(c.item) ? (c.weight ?? 1) : 0), 0);
  const checklistFraction = total ? got / total : 0;
  const g = Math.max(0, Math.min(station.global_rating.max, Math.round(globalRating)));
  const normalizedGlobal = station.global_rating.max ? g / station.global_rating.max : 0;
  const composite = Math.round((checklistFraction * 0.6 + normalizedGlobal * 0.4) * 100) / 100;
  return { checklist_fraction: checklistFraction, global_rating: normalizedGlobal, composite, rating: g, ticked: station.checklist.filter((c) => done.has(c.item)).length };
}
