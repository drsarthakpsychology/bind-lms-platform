/**
 * Small pure helpers for the timed exam screen: palette states, the clock,
 * and moving between questions across sections.
 */

export type CellState = "answered" | "answered-marked" | "marked" | "not-answered" | "not-visited";

export const CELL_LABEL: Record<CellState, string> = {
  answered: "Answered",
  "answered-marked": "Answered and marked",
  marked: "Marked for review",
  "not-answered": "Not answered",
  "not-visited": "Not visited",
};

export function cellState(answered: boolean, marked: boolean, visited: boolean): CellState {
  if (answered) return marked ? "answered-marked" : "answered";
  if (marked) return "marked";
  return visited ? "not-answered" : "not-visited";
}

/** "1:05:09" or "4:07". Never negative. */
export function clock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (x: number) => String(x).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

/** The clock in words for screen readers, e.g. "1 hour 5 minutes left". */
export function clockWords(ms: number): string {
  const min = Math.max(0, Math.ceil(ms / 60000));
  const h = Math.floor(min / 60);
  const m = min % 60;
  const parts = [h ? `${h} ${h === 1 ? "hour" : "hours"}` : "", m || !h ? `${m} ${m === 1 ? "minute" : "minutes"}` : ""].filter(Boolean);
  return `${parts.join(" ")} left`;
}

/** Next position across sections (wraps from the last question to the first). */
export function step(sizes: number[], sec: number, pos: number, dir: 1 | -1): [number, number] {
  const total = sizes.reduce((a, b) => a + b, 0);
  if (!total) return [0, 0];
  let s = sec;
  let p = pos + dir;
  for (let guard = 0; guard < sizes.length + 2; guard++) {
    if (p >= 0 && p < sizes[s]) return [s, p];
    s = (s + dir + sizes.length) % sizes.length;
    p = dir === 1 ? 0 : sizes[s] - 1;
  }
  return [sec, pos];
}

/** Warn when this little time is left. */
export const WARN_MS = 5 * 60_000;
