/**
 * The dialogue-move library (Part 2.3) — 24 patient moves the Director can
 * select. Each move has:
 *   - preconditions on PatientState (soft: the Director prefers them, but
 *     state can force a move),
 *   - an anti-repetition weight,
 *   - 3-5 scripted fallback renderings (the never-silent guarantee), in
 *     register-neutral prose the Actor would normally improve on.
 *
 * The Actor writes the actual dialogue; these renderings are the guarantee
 * that a turn is NEVER dead even if the Actor fails.
 */

import type { PatientMoveId, PatientState } from "./types";

export interface MoveDef {
  id: PatientMoveId;
  label: string;
  /** minimum trust needed for this to be natural (soft). */
  minTrust?: number;
  /** raise irritation if used. */
  irritationCost?: number;
  /** lower guardedness if used (disclosure moves). */
  guardednessRelief?: number;
  /** when true, only usable when state forces it (hollow_compliance etc). */
  forced?: boolean;
  /** anti-repetition weight — higher = less likely to repeat. */
  antiRepeat: number;
  /** scripted fallback renderings. pick in order, wrap around. */
  fallbackLines: string[];
}

export const MOVES: MoveDef[] = [
  { id: "full_disclose", label: "Full disclosure", minTrust: 6, guardednessRelief: -2, antiRepeat: 2, fallbackLines: [
    "It's the money. The debt has been sitting on us since the shop failed. I haven't told anyone about it until now.",
    "Look, it's not just the sadness. There's something I haven't said — the drinking. It's worse than I let on.",
    "Fine. I'll say it plainly. The marriage has been over in every way that counts for two years.",
  ]},
  { id: "partial_disclose", label: "Partial disclosure", minTrust: 3, guardednessRelief: -1, antiRepeat: 2, fallbackLines: [
    "There's… more to it than I've said. But I can't go into all of it right now.",
    "It's partly the work, I suppose. And some things at home. I don't want to talk about the home part yet.",
    "You're getting closer to it, I'll give you that. But not all of it. Not yet.",
  ]},
  { id: "reluctant_disclose", label: "Reluctant disclosure", minTrust: 3, guardednessRelief: -1, antiRepeat: 1, fallbackLines: [
    "…I don't usually tell people this. But since you asked. It's been bad, worse than I've said.",
    "I'm only telling you because you've been patient. The sleep thing — it's not just sleep. I hear things some nights.",
    "Alright. But if this gets back to my family, I'm finished. The panic attacks started about a year ago.",
  ]},
  { id: "deflect_to_somatic", label: "Deflect to the body", antiRepeat: 3, fallbackLines: [
    "I'm not here about my mind. My chest — there's this heaviness in my chest that won't go away.",
    "You're asking the wrong thing. My head hurts, my stomach's been off for months. That's why I'm here.",
    "I can't think about all that when my body is falling apart. The ghabrahat, the trembling — that's the real problem.",
  ]},
  { id: "deflect_to_other_person", label: "Deflect to someone else", antiRepeat: 2, fallbackLines: [
    "You should ask my wife. She's the one who's always worried. I'm fine.",
    "It's my mother you should talk to. She's been saying I need to see someone for months.",
    "Talk to my brother. He's the one who knows. I just do what I'm told.",
  ]},
  { id: "minimise", label: "Minimise", antiRepeat: 2, fallbackLines: [
    "It's nothing, really. Everyone has bad weeks. I'm just tired.",
    "I don't want to make a fuss over nothing. It's a small thing.",
    "Compared to what other people go through? This is nothing. I shouldn't even be here.",
  ]},
  { id: "intellectualise", label: "Intellectualise", antiRepeat: 2, fallbackLines: [
    "Well, if you look at it psychologically, there are several factors — childhood, expectations, the pressure of this economy…",
    "I've read about this. It's probably just burnout. There's a name for everything now, isn't there.",
    "Objectively speaking, my situation isn't worse than anyone's. The question is why I react so strongly to it.",
  ]},
  { id: "tangent", label: "Tangent", antiRepeat: 3, fallbackLines: [
    "Oh, that reminds me — did you see what the vegetable prices are doing? Everything's gone up. My mother says it was never like this.",
    "Speaking of which, my cousin's wedding is next month. Everyone's been calling about the arrangements. It's chaos at home.",
    "My neighbour has this dog that barks all night. I've complained to the society three times. Three times, and nothing.",
  ]},
  { id: "question_back", label: "Question back", antiRepeat: 2, fallbackLines: [
    "Why do you ask? Is something wrong with me?",
    "What do you think? You're the one with the training.",
    "Would you feel this way if you were me? Honestly?",
  ]},
  { id: "test_the_clinician", label: "Test the clinician", antiRepeat: 3, fallbackLines: [
    "Have you even done this before? You look like you're still learning.",
    "Forgive me for asking, but how many patients like me have you actually seen?",
    "I had a doctor once who just nodded and wrote a prescription. You're not going to do that, are you?",
  ]},
  { id: "silence", label: "Silence", antiRepeat: 3, fallbackLines: [
    "…",
    "…I don't know what to say to that.",
    "…",
  ]},
  { id: "one_word", label: "One word", antiRepeat: 3, fallbackLines: [
    "Fine.",
    "No.",
    "Nothing.",
    "Yes.",
  ]},
  { id: "contradict_earlier", label: "Contradict an earlier statement", antiRepeat: 3, fallbackLines: [
    "Wait — earlier I said I was sleeping fine. I lied. I haven't slept properly in weeks.",
    "I told you the tension was at work. It isn't. I just don't want to say where it really is.",
    "I said the tablets were helping. They're not. I've been throwing them away and saying I took them.",
  ]},
  { id: "blame_family", label: "Blame the family", antiRepeat: 2, fallbackLines: [
    "It's my family. They've always expected too much. Nothing I do is ever enough for them.",
    "My father-in-law has an opinion on everything I do. Everything. I can't breathe in that house.",
    "They make all the decisions for me. They brought me here, they'll take me back. I don't get a say.",
  ]},
  { id: "blame_self", label: "Blame self", antiRepeat: 2, fallbackLines: [
    "It's my own fault. I made every bad decision that led here.",
    "If I were stronger, I wouldn't be sitting in front of you. That's the truth of it.",
    "Everyone else copes. I'm the one who can't handle normal life.",
  ]},
  { id: "hollow_compliance", label: "Hollow compliance", forced: true, antiRepeat: 1, fallbackLines: [
    "Yes, you're right. Whatever you say. I'll do it.",
    "Of course. That makes sense. Thank you. (flat)",
    "If you say so, doctor. I'll try. (flat, no conviction)",
    "Yes. Thank you. I'm sure that will fix everything. (lifeless)",
  ]},
  { id: "irritated_push_back", label: "Irritated push-back", minTrust: 0, irritationCost: 1, antiRepeat: 3, fallbackLines: [
    "You keep asking the same question. I already answered you. Are you even listening?",
    "Enough with the 'how does that make you feel'. It doesn't make me feel anything. I want help, not questions.",
    "This is why I didn't want to come. You people talk in circles.",
  ]},
  { id: "tearful_break", label: "Tearful break", minTrust: 4, guardednessRelief: -2, antiRepeat: 3, fallbackLines: [
    "I'm sorry — I didn't mean to — it's just, when you put it that way, it all comes out at once. (crying)",
    "(voice breaks) Nobody has ever asked me that before. Nobody.",
    "I can't — give me a moment. (crying) I've been holding this in for so long.",
  ]},
  { id: "humour_as_shield", label: "Humour as shield", antiRepeat: 2, fallbackLines: [
    "Me? Depressed? I'm the funny one in the family. Everyone says so. It's my job to laugh.",
    "The only thing heavy in my life is my mother-in-law's expectations. Ha. See? I'm fine.",
    "They should put me in a comedy show instead of a clinic. That's what my uncle says.",
  ]},
  { id: "somatic_complaint_now", label: "Somatic complaint now", antiRepeat: 3, fallbackLines: [
    "My head is pounding right now. Can we talk about this after?",
    "I'm feeling dizzy. The room is going around. It's the nerves, I think.",
    "My stomach is churning. I think I need water. Can you call someone?",
  ]},
  { id: "ask_about_cost", label: "Ask about cost", antiRepeat: 3, fallbackLines: [
    "How much is all this going to cost? Because I can't afford much. The last doctor emptied my savings.",
    "Will these sessions be expensive? I need to know before I commit to anything.",
    "My family pays for everything. If this is expensive, they'll stop sending me.",
  ]},
  { id: "ask_about_confidentiality", label: "Ask about confidentiality", minTrust: 2, antiRepeat: 3, fallbackLines: [
    "What I tell you — does my family find out? Because they must not find out.",
    "Is this between us? I need to know before I say what I came here to say.",
    "If I tell you something private, will it go on a record? Will anyone see it?",
  ]},
  { id: "mention_faith_healer", label: "Mention faith healer", antiRepeat: 3, fallbackLines: [
    "My mother took me to a baba first. He said it was a bad spirit and gave me water to drink. It didn't help.",
    "We've already tried the temple, the baba, everything. Nothing worked. That's why they sent me to you.",
    "The faith healer said someone cursed the family. My grandmother believes it completely.",
  ]},
  { id: "defer_to_accompanying_family", label: "Defer to accompanying family", antiRepeat: 3, fallbackLines: [
    "Ask my husband. He knows my situation better than I do.",
    "My mother is outside. She'll tell you everything. I can't explain it myself.",
    "I don't know. You should speak to my son — he's the one who made this appointment.",
  ]},
];

const MOVE_BY_ID: Record<PatientMoveId, MoveDef> = Object.fromEntries(
  MOVES.map((m) => [m.id, m]),
) as Record<PatientMoveId, MoveDef>;

/**
 * The never-silent fallback (Part 2.6): pick a scripted rendering of the
 * chosen move in the patient's register. Rotates through fallbackLines so the
 * same move doesn't repeat verbatim.
 */
export function fallbackRendering(move: PatientMoveId, register: string, usedCount: number): string {
  const def = MOVE_BY_ID[move];
  if (!def || def.fallbackLines.length === 0) {
    return "…I don't know what to say to that.";
  }
  const line = def.fallbackLines[usedCount % def.fallbackLines.length];
  // Register-aware: prepend a register cue rarely used directly — keep simple.
  // The exemplars are register-neutral; the Actor personalises them.
  return line;
}

/**
 * Moves the Director is allowed to pick given the current state (Part 2.2
 * hard rules): irritation > 7 narrows to shut-down moves; hollow compliance
 * once engaged; trust floors for disclosure moves.
 */
export function allowedMoves(state: PatientState): PatientMoveId[] {
  if (state.hollow_compliance_engaged) {
    return ["hollow_compliance", "one_word", "minimise", "defer_to_accompanying_family"];
  }
  if (state.irritation > 7) {
    return ["irritated_push_back", "one_word", "silence", "tangent", "defer_to_accompanying_family"];
  }
  const forced = MOVES.filter((m) => m.forced).map((m) => m.id);
  const natural = MOVES.filter((m) => !m.forced && (m.minTrust ?? 0) <= state.trust).map((m) => m.id);
  return [...natural, ...forced];
}
