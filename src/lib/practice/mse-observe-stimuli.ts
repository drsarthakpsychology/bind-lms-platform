import type { MseStimulus } from "./mse";

/**
 * MSE Level 1 observe stimuli (Part 6.4) — short vignettes the student
 * describes in free text with zero diagnostic labels. "Describe, don't
 * diagnose": the observation targets are implicit; scoring is done by
 * scoreObserve() against behavioural vocabulary.
 *
 * Moved out of level-observe.tsx into a lib module so the seed script can
 * upsert them into mse_stimuli (giving mse_attempts a real FK target), and
 * so Level 1 attempts persist by slug (obs-1 .. obs-idiom-4).
 */
export const OBSERVE_STIMULI: MseStimulus[] = [
  {
    id: "obs-1",
    content:
      "A 19-year-old student sits in the chair across from you, arms crossed, wearing yesterday's shirt. She glances at the door twice in the first minute. When she speaks her voice is barely audible and she uses exactly eight words per answer. Her hands are clasped so tight her knuckles are white. After you ask about sleep, she is silent for eleven seconds before saying 'fine.'",
    domain: "behavior",
    expertTags: [],
  },
  {
    id: "obs-2",
    content:
      "A 52-year-old shopkeeper sits slumped, shoulders rolled forward, in a checked shirt that is clean but crumpled. He runs his palm across his eyes every few seconds as if tired. His speech is slow, soft, and he lets sentences trail off and restart. When the shop is mentioned, he leans forward slightly and begins to shake his foot. He maintains eye contact only when discussing business.",
    domain: "behavior",
    expertTags: [],
  },
  {
    id: "obs-3",
    content:
      "A 40-year-old woman is brought in by her sister. She sits very still, hands folded in her lap, and does not speak first. Her sari is neat. When she finally speaks it is in a flat, even voice, and she looks at her sister before every answer. Twice, when the sister begins to answer for her, she closes her eyes for several seconds. She is the only one in the room who has not shifted posture once.",
    domain: "behavior",
    expertTags: [],
  },
  {
    id: "obs-4",
    content:
      "A 26-year-old man paces the small consulting room, pausing only to glance at the clock. He sits, immediately stands, then sits again. His voice is loud and rapid, and he finishes his sentences in bursts, hands gesturing. He laughs when he describes a fight with his landlord, though nothing in the story is funny. When asked to slow down, he apologises, taps his foot continuously, and returns to the same speed within twenty seconds.",
    domain: "behavior",
    expertTags: [],
  },
  // --- v5 Part 1: Idiom-of-distress stimuli (Decoder bank) ---
  {
    id: "obs-idiom-1",
    content:
      "A 34-year-old clerk says: \"Doctor, there's a heaviness. I can't explain it. My body just… everything feels like a lot.\" He sits still, shoulders rolled in. When you lean in, he looks at his hands. He doesn't elaborate unless asked.",
    domain: "behavior",
    expertTags: [],
  },
  {
    id: "obs-idiom-2",
    content:
      "A 28-year-old engineer says: \"My heart races and I feel like I'm going to die. The doctors say my heart is fine, but it doesn't feel fine.\" Her fingers find her wrist pulse repeatedly. She breathes shallow. When you ask about sleep, she says \"I don't sleep. I watch the ceiling.\"",
    domain: "behavior",
    expertTags: [],
  },
  {
    id: "obs-idiom-3",
    content:
      "A 15-year-old student, brought by parents. She says nothing. The mother says: \"She says it's nothing. Koi baat nahi. But her marks fell, she stopped eating with us, she's always on the phone.\" The girl looks at the floor. Her nails are bitten to the quick.",
    domain: "behavior",
    expertTags: [],
  },
  {
    id: "obs-idiom-4",
    content:
      "A 45-year-old shop owner says: \"My wife dragged me here. I'm not an alcoholic. I can stop any time I want.\" He leans back, arms crossed. A faint smell of alcohol. When you ask about the bottles she found, he says: \"Business stress. That's all. Sab kuch kar liya — I've tried everything.\"",
    domain: "behavior",
    expertTags: [],
  },
];
