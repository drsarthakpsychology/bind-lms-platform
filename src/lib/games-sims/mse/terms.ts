/**
 * MSE Lab vocabulary: the domains of the mental state examination and the
 * precise descriptive words (after Fish's Clinical Psychopathology). Each
 * definition is written so the "why not" of a wrong pick teaches the
 * difference.
 */
export const DOMAINS = [
  { id: "appearance", label: "Appearance & behaviour", short: "Look & behave" },
  { id: "speech", label: "Speech", short: "Speech" },
  { id: "mood", label: "Mood (what they say)", short: "Mood" },
  { id: "affect", label: "Affect (what you see)", short: "Affect" },
  { id: "form", label: "Thought form", short: "Form" },
  { id: "content", label: "Thought content", short: "Content" },
  { id: "perception", label: "Perception", short: "Perception" },
  { id: "cognition", label: "Cognition", short: "Cognition" },
  { id: "insight", label: "Insight & judgement", short: "Insight" },
] as const;

export type Domain = (typeof DOMAINS)[number]["id"];

export type Term = { label: string; domain: Domain; def: string };

export const TERMS = {
  /* Appearance & behaviour */
  pmr: { label: "Psychomotor slowing", domain: "appearance", def: "Slow, few movements: slumped, little gesture, slow to start." },
  pma: { label: "Psychomotor agitation", domain: "appearance", def: "Restless, can't stay seated: pacing, wringing hands, picking." },
  selfcare: { label: "Poor self-care", domain: "appearance", def: "Unwashed, unkempt or stained clothes, out of keeping with their usual standard." },
  kempt: { label: "Well kempt, appropriate", domain: "appearance", def: "Clean and dressed for the setting. A normal finding worth writing down." },
  posturing: { label: "Posturing", domain: "appearance", def: "Holds an odd, often uncomfortable position for a long time, on their own." },
  waxy: { label: "Waxy flexibility", domain: "appearance", def: "Limbs stay where the examiner places them, with a slight even resistance, like soft wax." },
  stereotypy: { label: "Stereotypy", domain: "appearance", def: "The same movement repeated again and again, with no goal at all." },
  mannerism: { label: "Mannerism", domain: "appearance", def: "An odd, stylised way of doing a normal, goal-directed action (a strange salute before shaking hands)." },
  guarded: { label: "Guarded, suspicious", domain: "appearance", def: "Watchful, checks the room, reluctant to answer." },
  tremor: { label: "Tremor and sweating", domain: "appearance", def: "Shaky hands, sweating, fast pulse: the body in alarm, often withdrawal." },
  compulsion: { label: "Compulsive act", domain: "appearance", def: "A repeated act done to calm the anxiety of an obsession, which the person knows is excessive." },
  responding: { label: "Responding to unseen voices", domain: "appearance", def: "Pauses, glances aside, mutters or smiles as if listening to someone the examiner can't hear." },
  /* Speech */
  pressured: { label: "Pressured speech", domain: "speech", def: "Fast, loud, hard to interrupt; the words pour out." },
  latency: { label: "Slowed speech, long pauses", domain: "speech", def: "Long gaps before answers, quiet and slow, with little tone." },
  poverty: { label: "Poverty of speech", domain: "speech", def: "Very few words: brief answers, nothing added unless asked." },
  mutism: { label: "Mutism", domain: "speech", def: "No speech at all while awake and alert." },
  normalspeech: { label: "Normal rate, tone and volume", domain: "speech", def: "Nothing unusual in how the words come out." },
  neologism: { label: "Neologism", domain: "speech", def: "A made-up word, or a real word given a private meaning the listener can't share." },
  echolalia: { label: "Echolalia", domain: "speech", def: "Repeats the examiner's words back, like an echo." },
  /* Mood */
  lowmood: { label: "Low mood", domain: "mood", def: "In their own words, sad, empty or hopeless most of the time." },
  elated: { label: "Elated mood", domain: "mood", def: "In their own words, on top of the world, better than ever." },
  irritable: { label: "Irritable mood", domain: "mood", def: "In their own words, easily annoyed, short-tempered." },
  anxiousmood: { label: "Anxious mood", domain: "mood", def: "In their own words, tense, on edge, frightened." },
  euthymic: { label: "Euthymic mood", domain: "mood", def: "In their own words, their mood is in the ordinary range." },
  /* Affect */
  reactive: { label: "Reactive, full range", domain: "affect", def: "The face and voice move with the topic: smiles at a joke, sad at a loss." },
  restricted: { label: "Restricted affect", domain: "affect", def: "A narrowed range of expression, still in the right direction." },
  blunted: { label: "Blunted affect", domain: "affect", def: "Emotional response clearly reduced and dulled, with social subtlety lost; there is still a little, in the right direction." },
  flat: { label: "Flat affect", domain: "affect", def: "Almost no emotional expression in any direction: still face, monotone, even for big news." },
  incongruent: { label: "Incongruent affect", domain: "affect", def: "The emotion shown doesn't fit what is being said, and the person isn't aware of it (laughs while describing a death)." },
  labile: { label: "Labile affect", domain: "affect", def: "Swings quickly and out of proportion: tears, then laughter, within a minute." },
  tearful: { label: "Low, tearful affect", domain: "affect", def: "Sad face and tears that match what they are saying." },
  anxiousaffect: { label: "Anxious affect", domain: "affect", def: "Tense face, shaky voice, fidgeting: fear you can see." },
  embarrassed: { label: "Embarrassed smile (not incongruity)", domain: "affect", def: "A social or anxious smile while telling something painful. Understandable, the person knows it; this is not incongruity." },
  elatedaffect: { label: "Elated, expansive affect", domain: "affect", def: "Beaming, laughing, over-familiar: happiness you can see, more than the situation explains." },
  /* Thought form */
  circumstantial: { label: "Circumstantial", domain: "form", def: "Lots of needless detail and side-paths, but the point is finally reached." },
  tangential: { label: "Tangential", domain: "form", def: "Drifts off to a related topic and never comes back to the question." },
  foi: { label: "Flight of ideas", domain: "form", def: "Fast thoughts jumping by chance links (rhymes, puns, things in the room). You can usually follow each jump." },
  loosening: { label: "Loosening of association", domain: "form", def: "Ideas slide between topics with no link you can follow, at normal speed (derailment)." },
  block: { label: "Thought block", domain: "form", def: "The thought stops dead mid-sentence; the person can't pick it up and may say the thought was taken." },
  perseveration: { label: "Perseveration", domain: "form", def: "The same answer or idea comes back after the question has moved on." },
  clang: { label: "Clang association", domain: "form", def: "Words chosen by sound or rhyme instead of meaning." },
  wordsalad: { label: "Word salad", domain: "form", def: "Words strung together with no grammar or meaning." },
  slowedthought: { label: "Slowed thinking", domain: "form", def: "Few ideas, slow to come, hard to decide. Common in depression." },
  goaldirected: { label: "Goal-directed", domain: "form", def: "Logical and coherent; reaches the point. A normal finding." },
  prolixity: { label: "Prolixity (ordered flight)", domain: "form", def: "Lively, quick side-trips, but returns to the goal within moments. Seen in hypomania." },
  /* Thought content */
  persecutory: { label: "Persecutory delusion", domain: "content", def: "A fixed, false belief of being harmed or plotted against, held despite evidence and out of keeping with culture." },
  reference: { label: "Delusion of reference", domain: "content", def: "Fixed belief that ordinary events (TV, strangers, number plates) carry messages meant for them." },
  grandiose: { label: "Grandiose delusion", domain: "content", def: "Fixed belief of special powers, wealth, mission or identity." },
  guilt: { label: "Delusion of guilt", domain: "content", def: "Fixed belief of having done something terrible, far beyond any real fault." },
  nihilistic: { label: "Nihilistic delusion", domain: "content", def: "Fixed belief that they, their organs or the world are dead, rotting or gone." },
  jealousy: { label: "Delusion of jealousy", domain: "content", def: "Fixed belief that the partner is unfaithful, 'proved' by trivial signs." },
  overvalued: { label: "Overvalued idea", domain: "content", def: "An understandable, emotionally charged belief that dominates life. Less fixed and less impossible than a delusion; often shared by others in the culture." },
  obsession: { label: "Obsession", domain: "content", def: "An unwanted, intrusive thought the person knows is their own, finds senseless and tries to resist." },
  insertion: { label: "Thought insertion", domain: "content", def: "Thoughts put into the mind from outside; the person says they are not their own." },
  broadcast: { label: "Thought broadcasting", domain: "content", def: "Their thoughts spread out of their head so others know them." },
  withdrawal: { label: "Thought withdrawal", domain: "content", def: "Thoughts are taken out of the mind by an outside force." },
  passivity: { label: "Made actions (passivity)", domain: "content", def: "Actions, feelings or impulses controlled by an outside force; they feel like a puppet." },
  delperception: { label: "Delusional perception", domain: "content", def: "A normal perception suddenly given a new, private, delusional meaning with no understandable link." },
  passiveSI: { label: "Passive death wish", domain: "content", def: "Wishes to be dead or not wake up, without a plan or intent." },
  activeSI: { label: "Suicidal thoughts with a plan", domain: "content", def: "Thinks of ending life and has a method, a time or preparations." },
  preoccupation: { label: "Preoccupation", domain: "content", def: "A theme they keep returning to, which is not a false belief (grief, money worries)." },
  worry: { label: "Excessive worry", domain: "content", def: "Hard-to-control worry about many everyday things." },
  noabn: { label: "No abnormal beliefs", domain: "content", def: "No delusions, obsessions or risk thoughts found. A normal finding." },
  /* Perception */
  ah2: { label: "Second-person voice", domain: "perception", def: "A voice speaking to them ('you are...'), heard outside, through the ears, as real as speech." },
  ah3: { label: "Third-person voices (commentary)", domain: "perception", def: "Voices talk about them ('he is going out now'), often commenting on actions." },
  command: { label: "Command hallucination", domain: "perception", def: "A heard voice that tells them to do something. Always ask about it in a risk check." },
  pseudo: { label: "Pseudo-hallucination", domain: "perception", def: "Vivid and involuntary, but experienced inside the head (inner space) and known not to be a real perception." },
  illusion: { label: "Illusion", domain: "perception", def: "A real thing is misperceived (a coat on a hook seen as a person), often in fear or poor light, and it corrects on a closer look." },
  pareidolia: { label: "Pareidolia", domain: "perception", def: "Vivid images seen in vague shapes (faces in clouds or stains), without effort, known not to be real." },
  hypnagogic: { label: "Hypnagogic hallucination", domain: "perception", def: "A brief voice or image while falling asleep. Common and often normal." },
  vh: { label: "Visual hallucination", domain: "perception", def: "Sees things with no stimulus at all. Points to delirium, drugs, withdrawal or Lewy body disease more than schizophrenia." },
  tactile: { label: "Tactile hallucination", domain: "perception", def: "Feels touch with no stimulus, like insects crawling under the skin (formication)." },
  depersonalisation: { label: "Depersonalisation", domain: "perception", def: "Feels unreal or detached from self, 'as if' a robot, and knows it is only a feeling." },
  derealisation: { label: "Derealisation", domain: "perception", def: "The world feels unreal, flat, like a film set, and they know it isn't really changed." },
  noperc: { label: "No perceptual abnormality", domain: "perception", def: "No hallucinations or illusions found. A normal finding." },
  /* Cognition */
  disoriented: { label: "Disoriented", domain: "cognition", def: "Wrong about time, place or person." },
  oriented: { label: "Oriented, attention intact", domain: "cognition", def: "Knows time, place and person; holds attention. A normal finding." },
  inattention: { label: "Poor attention", domain: "cognition", def: "Can't hold or shift attention: fails months backwards or serial sevens, loses the question." },
  clouding: { label: "Clouded, fluctuating consciousness", domain: "cognition", def: "Drowsy or muddled, better and worse across the day. The heart of delirium." },
  recentmem: { label: "Impaired recent memory", domain: "cognition", def: "Can't recall new information after a few minutes." },
  confabulation: { label: "Confabulation", domain: "cognition", def: "Fills memory gaps with invented stories the person believes, without intent to deceive." },
  /* Insight & judgement */
  fullinsight: { label: "Full insight", domain: "insight", def: "Knows these are symptoms of an illness and accepts help." },
  partialinsight: { label: "Partial insight", domain: "insight", def: "Some awareness (knows something is wrong) but rejects part of it, such as the illness label or medicines." },
  noinsight: { label: "No insight", domain: "insight", def: "Sees nothing wrong with themselves; the problem is all outside." },
  poorjudgement: { label: "Impaired judgement", domain: "insight", def: "Decisions that put them or others at risk, out of character." },
} as const satisfies Record<string, Term>;

export type TermId = keyof typeof TERMS;

export function termById(id: string): Term | undefined {
  return (TERMS as Record<string, Term>)[id];
}

export function domainLabel(id: string): string {
  return DOMAINS.find((d) => d.id === id)?.label ?? id;
}
