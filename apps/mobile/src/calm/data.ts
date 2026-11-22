/**
 * The calm exercises, in the website's words (src/lib/free/calm.ts and
 * src/components/free/calm-tools.tsx). Everything runs on the phone: nothing
 * is saved and nothing is sent.
 */
export type CalmId = "breathing" | "grounding" | "muscles" | "worry";

export const CALM_TOOLS: { id: CalmId; title: string; minutes: string; text: string; why: string }[] = [
  { id: "breathing", title: "Guided breathing", minutes: "1 to 5 min", text: "Follow the pebble. Box breathing, 4-7-8, or slow breathing at about six breaths a minute.", why: "Slow breathing with a longer out-breath wakes the body's calming system and lowers arousal within a few minutes." },
  { id: "grounding", title: "5-4-3-2-1 grounding", minutes: "3 min", text: "Come back to the room using your five senses. Good for panic and spiralling thoughts.", why: "Grounding moves attention from anxious thoughts to what your senses notice right now. Therapists teach it for panic and flashbacks." },
  { id: "muscles", title: "Muscle relaxation", minutes: "4 min", text: "Tense, then release, one muscle group at a time.", why: "Progressive muscle relaxation teaches the difference between tense and relaxed muscles. It is used for anxiety, stress and sleep." },
  { id: "worry", title: "Worry sorter", minutes: "2 min", text: "Write a worry, decide if you can act on it, then plan one small step or let it go.", why: "Based on the worry tree used in cognitive behaviour therapy: separate worries you can act on from ones you cannot, then act or let go." },
];

export type Phase = { label: "Breathe in" | "Hold" | "Breathe out"; secs: number; /** Where the pebble is at the end of this phase: 1 full, 0 small. */ to: 0 | 1 };
export type PatternId = "box" | "478" | "slow";

export const PATTERNS: Record<PatternId, { label: string; note: string; phases: Phase[] }> = {
  box: { label: "Box", note: "In 4, hold 4, out 4, hold 4", phases: [{ label: "Breathe in", secs: 4, to: 1 }, { label: "Hold", secs: 4, to: 1 }, { label: "Breathe out", secs: 4, to: 0 }, { label: "Hold", secs: 4, to: 0 }] },
  "478": { label: "4-7-8", note: "In 4, hold 7, out 8", phases: [{ label: "Breathe in", secs: 4, to: 1 }, { label: "Hold", secs: 7, to: 1 }, { label: "Breathe out", secs: 8, to: 0 }] },
  slow: { label: "Slow", note: "In 4, out 6. About six breaths a minute", phases: [{ label: "Breathe in", secs: 4, to: 1 }, { label: "Breathe out", secs: 6, to: 0 }] },
};

/** Which phase a moment in the session falls in, and the whole seconds left in it. Pure, so it can be tested. */
export function phaseAt(pattern: PatternId, t: number): { index: number; left: number } {
  const phases = PATTERNS[pattern].phases;
  const cycle = phases.reduce((a, p) => a + p.secs, 0);
  let within = ((t % cycle) + cycle) % cycle;
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i]!;
    if (within < p.secs) return { index: i, left: Math.ceil(p.secs - within) };
    within -= p.secs;
  }
  return { index: 0, left: phases[0]!.secs };
}

export const SENSES = [
  { n: 5, verb: "see", prompt: "Look around. Name 5 things you can see. Small details count: a crack, a colour, a shadow." },
  { n: 4, verb: "feel", prompt: "Name 4 things you can feel. Your feet on the floor, the chair, your clothes, the air." },
  { n: 3, verb: "hear", prompt: "Listen. Name 3 things you can hear, near or far." },
  { n: 2, verb: "smell", prompt: "Name 2 things you can smell. If nothing, name 2 smells you like." },
  { n: 1, verb: "taste", prompt: "Name 1 thing you can taste, or take a sip of water and notice it." },
] as const;

export const MUSCLE_GROUPS: readonly (readonly [string, string])[] = [
  ["Hands", "Make tight fists with both hands."],
  ["Upper arms", "Bend your elbows and tighten your upper arms."],
  ["Shoulders", "Lift your shoulders up towards your ears."],
  ["Forehead", "Raise your eyebrows as high as they go."],
  ["Eyes and cheeks", "Squeeze your eyes shut tightly."],
  ["Jaw", "Clench your teeth gently and pull the corners of your mouth back."],
  ["Neck", "Gently press your head back. Do not strain."],
  ["Chest and back", "Take a deep breath, hold it, and pull your shoulder blades together."],
  ["Stomach", "Tighten your stomach muscles as if bracing."],
  ["Thighs", "Press your knees together and tighten your thighs."],
  ["Calves", "Point your toes up towards your face."],
  ["Feet", "Curl your toes downwards."],
];
export const TENSE_SECS = 5;
export const RELEASE_SECS = 15;

/** The helpline the website shows on every free page (src/components/free/free-shell.tsx). */
export const CRISIS = { name: "Tele-MANAS", number: "14416", href: "tel:14416", emergency: "112" } as const;
