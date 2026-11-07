/** The free relaxation exercises on /free/calm/[id]. */
export const CALM_TOOLS = [
  {
    id: "breathing",
    title: "Guided breathing",
    icon: "◯",
    minutes: "1 to 5 min",
    text: "Follow the circle. Box breathing, 4-7-8, or slow breathing at about six breaths a minute.",
    why: "Slow breathing with a longer out-breath activates the body's calming (parasympathetic) system and lowers arousal within a few minutes.",
  },
  {
    id: "grounding",
    title: "5-4-3-2-1 grounding",
    icon: "✋",
    minutes: "3 min",
    text: "Bring yourself back to the room using your five senses. Good for panic and spiralling thoughts.",
    why: "Grounding moves attention from anxious thoughts to what your senses notice right now. Therapists teach it for panic and flashbacks.",
  },
  {
    id: "muscles",
    title: "Muscle relaxation",
    icon: "⇵",
    minutes: "5 min",
    text: "Tense, then release, one muscle group at a time. A guided version of progressive muscle relaxation.",
    why: "Progressive muscle relaxation (Jacobson) teaches the difference between tense and relaxed muscles. It is used for anxiety, stress and sleep.",
  },
  {
    id: "worry",
    title: "Worry sorter",
    icon: "⇄",
    minutes: "2 min",
    text: "Write a worry, decide if you can act on it, then plan one small step or let it float away.",
    why: "Based on the CBT 'worry tree' (Butler & Hope): separate worries you can act on from ones you can't, then act or let go.",
  },
  {
    id: "bubbles",
    title: "Calm bubbles",
    icon: "∘",
    minutes: "Any time",
    text: "Slow bubbles drift up. Pop them, or just watch. No score, no timer.",
    why: "A gentle, low-effort focus task can interrupt rumination and give your mind a short break.",
  },
] as const;

export type CalmId = (typeof CALM_TOOLS)[number]["id"];

export function getCalmTool(id: string) {
  return CALM_TOOLS.find((t) => t.id === id);
}
