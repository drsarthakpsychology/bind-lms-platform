/**
 * PHASE 1 — THE STORY ARCHITECTURE (every case is a STORY, not a vignette).
 *
 * The Tier-2/3/4 banks give each patient a history block and 6 spoken lines.
 * This module raises the contract: every case carries a full STORY SPINE and
 * a DRAMA map, so the Director can pace a session like fiction instead of
 * an interview, and the debrief can grade whether the student found the
 * story's engine room.
 *
 * Story beats (the nine-beat spine):
 *   before → the_turn → the_slide → attempts → the_cost → why_today →
 *   what_they_want → what_they_need (want/need on StoryCase) → if_nobody_helps
 *
 * Drama map (what happens IN the room):
 *   objective / obstacle / tactics / stakes / secret — the actor's side of
 *   the scene, exactly as a fiction writer would prepare it.
 *
 * IMPORTANT authoring rules (the quality bar):
 *   - Specific over general: "he stopped going to the barber" beats
 *     "reduced self-care". Every beat must name a particular, ordinary thing.
 *   - No sentence in the patient's voice may contain a diagnostic term.
 *   - The reader should want to know what happens to this person.
 */

import type { CharacterSkeleton } from "@/lib/sim/characters";

/** The nine-beat story spine. Every field is authored prose, in the case's world. */
export interface CaseStory {
  /** who they were 2 years ago — specific and mundane */
  before: string;
  /** what changed — often not what the patient thinks */
  the_turn: string;
  /** how it got worse in specific detail — what stopped FIRST */
  the_slide: string;
  /** what they tried: baba, GP, chemist tonic, uncle's advice, YouTube... */
  attempts: string[];
  /** what it has already taken — job, marriage, savings */
  the_cost: string;
  /** the specific trigger that made them walk in TODAY */
  why_today: string;
  /** what they want — often not what they need */
  what_they_want: string;
  /** the 6-month trajectory — debrief-only, never told to the student */
  if_nobody_helps: string;
}

/** What happens IN the session — the actor's side of the scene. */
export interface CaseDrama {
  /** what they want FROM THIS SESSION */
  objective: string;
  /** what stops them saying it */
  obstacle: string;
  /** how they pursue the objective when blocked */
  tactics: string[];
  /** what happens to them if they don't get it (session-level stakes) */
  stakes: string;
  /** the one thing they hope you don't ask about */
  secret: string;
}

/** The Phase-1 case: a full authored character + a story spine + a drama map. */
export interface StoryCase extends Omit<CharacterSkeleton, "difficulty"> {
  /** The Phase-1 difficulty tier (the brief's three tiers, not the v1
   *  cooperative/guarded/resistant/crisis stance). */
  difficulty: "clear" | "blurred" | "holmes";
  story: CaseStory;
  drama: CaseDrama;
  /** what they say they want — captured in their own words, wants-oriented */
  want: string;
  /** what they actually need — the debrief lesson, never told to the student */
  need: string;
  /** 3+ contradictions the patient shows, each with its cause — design
   *  tool, never a trick (the brief B7). */
  contradictions: Array<{ claim: string; truth: string; cause: string }>;
  /** how this specific person talks — the brief B6. At minimum the most
   *  powerful field (what_they_never_say); the rest filled as authored. */
  voice_profile: {
    sentence_length?: string;
    vocabulary?: string;
    hesitation?: string;
    self_reference?: string;
    metaphors?: string;
    verbal_tic?: string;
    what_they_never_say: string;
  };
}
