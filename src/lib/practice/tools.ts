import type { FeatureKey } from "@/lib/flags";

/**
 * The practice tool catalogue — one source of truth for the hub (`/practice`)
 * and the student dashboard's practice section, so a tool's title/link/flag
 * can never drift between the two surfaces.
 *
 * Every card is gated by a three-state feature flag: `off` tools are hidden
 * entirely, `live` tools show a locked "yet to be live" card, `unlocked`
 * tools are fully open.
 */
export type PracticeTool = {
  href: string;
  title: string;
  verb: string;
  description: string;
  icon: string; // key into PRACTICE_ICONS (serializable over the boundary)
  time: string;
  flag: FeatureKey;
  group: "quick" | "mid" | "deep" | "browse";
};

export const PRACTICE_TOOLS: PracticeTool[] = [
  // Quick — under 5 minutes
  { href: "/practice/judgment", title: "Judgment", verb: "SLIDE", description: "New information changes the probability.", icon: "gauge", time: "2 min", flag: "judgment", group: "quick" },
  { href: "/practice/two-minute-clinic", title: "Clinic", verb: "TYPE", description: "One-liner, differential, next question.", icon: "circleCheck", time: "2 min", flag: "two_minute_clinic", group: "quick" },
  { href: "/practice/rounds", title: "Rounds", verb: "RATE", description: "Spaced-repetition cards, capped at 25/day.", icon: "repeat", time: "3 min", flag: "rounds", group: "quick" },
  { href: "/practice/decode", title: "Decoder", verb: "DECODE", description: "“Not feeling fresh” — six things could be true.", icon: "search", time: "4 min", flag: "decoder", group: "quick" },
  { href: "/practice/modules", title: "Modules", verb: "BROWSE", description: "Your course's modules, in order — locked ones state why.", icon: "layers", time: "1 min", flag: "modules", group: "quick" },

  // Mid — 5-10 minutes
  { href: "/practice/mse", title: "MSE", verb: "TAG", description: "Describe before you label. 11 domains.", icon: "brain", time: "10 min", flag: "mse", group: "mid" },
  { href: "/practice/osce", title: "OSCE Stations", verb: "PERFORM", description: "Seven minutes, one task, voice-first.", icon: "timer", time: "7 min", flag: "osce", group: "mid" },
  { href: "/practice/formulation", title: "Formulation", verb: "SORT", description: "5P factors, narrative, diff against the model.", icon: "wand2", time: "8 min", flag: "formulation", group: "mid" },
  { href: "/practice/ethics", title: "Ethics & Law", verb: "CHOOSE", description: "Consequence first, then the statute.", icon: "scale", time: "5 min", flag: "ethics", group: "mid" },
  { href: "/practice/landmark", title: "Landmark Cases", verb: "READ", description: "What was believed, what held up.", icon: "graduationCap", time: "5 min", flag: "landmark", group: "mid" },
  { href: "/practice/out-of-depth", title: "Out of Depth", verb: "REFER", description: "Know when to refer, escalate, or stop.", icon: "siren", time: "5 min", flag: "ethics", group: "mid" },

  // Deep — a proper sitting
  { href: "/practice/consulting-room", title: "Consulting Room", verb: "TALK", description: "Interview a simulated patient; the debrief shows what you missed.", icon: "stethoscope", time: "12 min", flag: "consulting_room", group: "deep" },
  { href: "/practice/role-play", title: "Peer Role-Play", verb: "PAIR", description: "One of you the patient, one the clinician.", icon: "users", time: "15 min", flag: "peer_roleplay", group: "deep" },

  // Browse — whenever
  { href: "/practice/library", title: "Case Library", verb: "ANNOTATE", description: "Highlight + note; peers' notes unlock after yours.", icon: "bookOpen", time: "varies", flag: "case_library", group: "browse" },
  { href: "/practice/tutor", title: "Psychology Tutor", verb: "ASK", description: "Grounded answers from the authorised books, with sources.", icon: "bookMarked", time: "varies", flag: "knowledge_tutor", group: "browse" },
];

export const GROUP_META: Record<PracticeTool["group"], { label: string; hint: string }> = {
  quick: { label: "Under 5 minutes", hint: "when you have a minute" },
  mid: { label: "5–10 minutes", hint: "a focused block" },
  deep: { label: "A proper sitting", hint: "the deep loop" },
  browse: { label: "Whenever", hint: "browse and annotate" },
};
