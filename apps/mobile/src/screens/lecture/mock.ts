// MOCK DATA: design phase only. See docs/DESIGN.md, To connect.
// Chapters and time-stamped notes for a lecture. The server has neither yet
// (GET /lectures/:id sends no chapters; notes exist only for study sections).

export type LectureChapter = { at: number; title: string };
export type LectureNote = { id: string; at: number; text: string; sample?: boolean };

/** Chapters spread over the lecture's length (or 40 minutes when the length is not known). */
export function mockChapters(durationSeconds: number | null): LectureChapter[] {
  const d = durationSeconds && durationSeconds > 120 ? durationSeconds : 40 * 60;
  const parts: [number, string][] = [
    [0, "Where we are and why it matters"],
    [0.12, "The core idea, in plain words"],
    [0.34, "How it shows up in the clinic"],
    [0.58, "A worked case"],
    [0.8, "Common mix-ups"],
    [0.93, "Recap and what to read next"],
  ];
  return parts.map(([f, title]) => ({ at: Math.round((d * f) / 5) * 5, title }));
}

export const MOCK_NOTES: LectureNote[] = [
  { id: "sample-1", at: 185, text: "Two weeks is the line for the low mood to count. Ask about duration first.", sample: true },
  { id: "sample-2", at: 760, text: "Loss of interest can show up without sadness. Do not skip it.", sample: true },
];
