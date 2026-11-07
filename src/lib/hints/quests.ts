/**
 * Daily quests (plan section 9). Three small, varied quests a day, each
 * doable in one sitting. Each pays 5 XP; all three pay 10 XP more and 2
 * spare hints. Pure: the server gathers the signals and pays.
 */

export const QUEST_XP = 5;
export const ALL_QUESTS_XP = 10;
export const ALL_QUESTS_SPARES = 2;
export const POINTS_QUEST = 20;

export const QUESTS = {
  section: { label: "Finish a Study section", href: "/study" },
  note: { label: "Read a note", href: "/study" },
  case: { label: "Play today's Daily case", href: "/practice/daily" },
  game: { label: "Finish a practice game", href: "/practice" },
  points: { label: `Earn ${POINTS_QUEST} points`, href: "/study" },
} as const;
export type QuestId = keyof typeof QUESTS;

/** Learning first, then a game, then points: three different kinds of thing. */
const SLOTS: QuestId[][] = [["section", "note"], ["case", "game"], ["points"]];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Today's three quests for one student (the same all day). */
export function questsFor(userId: string, day: string): QuestId[] {
  return SLOTS.map((slot, i) => slot[hash(`${userId}|${day}|${i}`) % slot.length]);
}

export type QuestSignals = { sectionToday: boolean; noteToday: boolean; caseToday: boolean; gameToday: boolean; pointsToday: number };

export type QuestView = { id: QuestId; label: string; href: string; done: boolean; progress: string | null };

export function questProgress(ids: readonly QuestId[], s: QuestSignals): QuestView[] {
  return ids.map((id) => {
    const q = QUESTS[id];
    const base = { id, label: q.label, href: q.href };
    switch (id) {
      case "section":
        return { ...base, done: s.sectionToday, progress: null };
      case "note":
        return { ...base, done: s.noteToday, progress: null };
      case "case":
        return { ...base, done: s.caseToday, progress: null };
      case "game":
        return { ...base, done: s.gameToday, progress: null };
      case "points": {
        const n = Math.max(0, Math.floor(s.pointsToday));
        return { ...base, done: n >= POINTS_QUEST, progress: n >= POINTS_QUEST ? null : `${n}/${POINTS_QUEST}` };
      }
    }
  });
}

export const allDone = (q: readonly QuestView[]) => q.length > 0 && q.every((x) => x.done);

/** Ledger sources that count as a finished practice game today. */
export function isGameSource(source: string): boolean {
  return /^(games2:|sort:|daily_case:|duel:|blitz:)/.test(source);
}
