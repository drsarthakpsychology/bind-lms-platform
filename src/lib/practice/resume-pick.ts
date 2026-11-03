/** Pure part of "Resume where you left off" (see resume.ts). */
export type ResumeTarget = { href: string; title: string };

/** Pure part: pick the newest visit that belongs to an open tool. */
export function pickResume(visits: { path: string }[], tools: { href: string; title: string }[]): ResumeTarget | null {
  for (const v of visits) {
    const path = v.path.split("?")[0];
    // Longest matching tool first, so /practice/mse-x never matches /practice/mse wrongly.
    const tool = [...tools]
      .sort((a, b) => b.href.length - a.href.length)
      .find((t) => path === t.href || path.startsWith(`${t.href}/`));
    if (tool) return { href: path, title: tool.title };
  }
  return null;
}

