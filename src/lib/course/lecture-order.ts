/**
 * The order lectures play in, and the one before and after a lecture. Pure.
 * Shared by the website's lecture page and the mobile app's lecture detail.
 *
 * Course order = (week, order_index), so Previous/Next cross week boundaries:
 * the last lecture of Week 1 flows into the first lecture of Week 2. Only
 * lectures with a video take part.
 */
export type OrderableLesson = { id: string; order_index: number; video_storage_path?: string | null; week?: number | null };

export function playableInOrder<L extends OrderableLesson>(lessons: readonly L[]): L[] {
  return lessons
    .filter((l) => l.video_storage_path)
    .sort((a, b) => {
      const wa = a.week ?? 1;
      const wb = b.week ?? 1;
      if (wa !== wb) return wa - wb;
      return a.order_index - b.order_index;
    });
}

export function lectureNeighbours<L extends OrderableLesson>(
  lessons: readonly L[],
  lessonId: string,
): { playable: L[]; index: number; prev: L | null; next: L | null } {
  const playable = playableInOrder(lessons);
  const index = playable.findIndex((l) => l.id === lessonId);
  const prev = index > 0 ? playable[index - 1] : null;
  const next = index >= 0 && index < playable.length - 1 ? playable[index + 1] : null;
  return { playable, index, prev, next };
}
