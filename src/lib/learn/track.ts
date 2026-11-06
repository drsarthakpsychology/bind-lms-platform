/**
 * Learning events from the browser (widget answers, games, glossary taps).
 * Queued in memory and sent in small batches to /api/learn/events, which
 * feeds the student model (strengths/weaknesses map, adaptive practice).
 * Best effort: a lost event never breaks the page.
 */
export type LearnEvent = {
  type: "widget" | "game" | "term" | "level";
  kind: string;
  ok?: boolean;
  score?: number;
  prompt?: string;
  skill?: string;
  item?: string;
  ms?: number;
};

let queue: (LearnEvent & { at: string })[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  timer = null;
  if (!queue.length || typeof window === "undefined") return;
  const batch = queue.slice(0, 50);
  queue = queue.slice(50);
  const body = JSON.stringify({ events: batch, path: window.location.pathname });
  try {
    if (!navigator.sendBeacon?.("/api/learn/events", new Blob([body], { type: "application/json" }))) {
      void fetch("/api/learn/events", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
    }
  } catch {
    /* offline — dropped */
  }
  if (queue.length) timer = setTimeout(flush, 1500);
}

export function trackLearn(e: LearnEvent) {
  if (typeof window === "undefined") return;
  queue.push({ ...e, prompt: e.prompt?.slice(0, 200), at: new Date().toISOString() });
  if (!timer) timer = setTimeout(flush, 2500);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flush);
}
