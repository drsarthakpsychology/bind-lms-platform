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

  /* ---- Added for the 500-passage bank. Existing ids above are unchanged. ---- */
  /* Appearance & behaviour */
  akathisia: { label: "Akathisia", domain: "appearance", def: "A driven inner restlessness, mostly in the legs, usually after an antipsychotic is started or raised: shifts weight, crosses and uncrosses legs, gets up and sits down, and says the legs will not keep still." },
  dystonia: { label: "Acute dystonia", domain: "appearance", def: "A sudden, sustained, often painful muscle spasm (neck twisted, eyes rolled up, jaw or tongue locked), usually in the first days of an antipsychotic." },
  parkinsonism: { label: "Drug-induced parkinsonism", domain: "appearance", def: "Stiff, slow and shuffling, with a mask-like face and a resting tremor, after antipsychotic treatment." },
  tic: { label: "Tic", domain: "appearance", def: "A sudden, quick, repeated, non-rhythmic movement or sound (blink, shrug, sniff, grunt), often preceded by an urge and held back for a while with effort." },
  negativism: { label: "Negativism", domain: "appearance", def: "Motiveless resistance to every instruction or attempt to move them, or doing the exact opposite." },
  echopraxia: { label: "Echopraxia", domain: "appearance", def: "Copies the examiner's movements automatically, without being asked." },
  obedience: { label: "Automatic obedience", domain: "appearance", def: "Carries out every instruction at once and literally, even ones that are odd or that they were told to refuse." },
  ambitendency: { label: "Ambitendency", domain: "appearance", def: "Starts a movement, stops, starts again, unable to complete it (holds out a hand, pulls it back, holds it out again)." },
  stupor: { label: "Stupor", domain: "appearance", def: "Awake but almost no movement, speech or response to the surroundings, with eyes that may still follow you." },
  hypervigilant: { label: "Hypervigilance, startle", domain: "appearance", def: "Keeps scanning the room and jumps at small sounds: a body on guard, often after trauma." },
  disinhibited: { label: "Disinhibited, overfamiliar", domain: "appearance", def: "Loses ordinary social restraint: crude jokes, over-friendly with strangers, touching, out of keeping with the setting." },
  hostile: { label: "Hostile, uncooperative", domain: "appearance", def: "Angry, argumentative or threatening towards the examiner, refuses to engage." },
  withdrawn: { label: "Withdrawn, poor eye contact", domain: "appearance", def: "Avoids eye contact, turns away, engages very little, without the watchfulness of suspicion." },
  selfharm: { label: "Signs of self-harm", domain: "appearance", def: "Visible cuts, scars or burns, often on the forearms or thighs, sometimes at different stages of healing." },
  emaciated: { label: "Emaciated, very low weight", domain: "appearance", def: "Visibly wasted face and limbs, loose clothes, sunken cheeks: an urgent physical finding to act on." },
  intox: { label: "Signs of intoxication", domain: "appearance", def: "Smell of alcohol, slurred speech, unsteady gait, flushed face, or very small or very wide pupils." },
  bizarredress: { label: "Odd, out-of-place dress", domain: "appearance", def: "Clothing strikingly unusual for the setting and season (three sweaters in May, foil in a cap) with no cultural or practical reason." },
  cooperative: { label: "Cooperative, good rapport", domain: "appearance", def: "Engages easily, answers openly and warms to the examiner. A normal finding worth writing down." },
  /* Speech */
  dysarthria: { label: "Dysarthria", domain: "speech", def: "Words are badly formed (slurred, thick, explosive) because of a motor problem; the language itself is intact." },
  dysphasia: { label: "Nominal dysphasia", domain: "speech", def: "Cannot find the names of things and talks around them ('the thing you tell time with'): a brain-based language problem." },
  stammer: { label: "Stammer", domain: "speech", def: "Repeats, stretches or blocks on sounds with visible effort, while what they mean to say is normal." },
  verbigeration: { label: "Verbigeration", domain: "speech", def: "The same words or sentence repeated over and over without meaning, often in a monotone, not in answer to anything." },
  palilalia: { label: "Palilalia", domain: "speech", def: "Repeats their own last word or phrase again and again, often faster each time." },
  monotone: { label: "Monotonous tone", domain: "speech", def: "Little rise and fall in the voice, while the amount and speed of speech are ordinary." },
  /* Mood */
  dysphoric: { label: "Dysphoric mood", domain: "mood", def: "In their own words, an unpleasant mix of misery, tension and irritability." },
  anhedonia: { label: "Anhedonia", domain: "mood", def: "In their own words, no pleasure or interest in things they used to enjoy." },
  apathy: { label: "Apathy", domain: "mood", def: "Says they have no drive and care little either way, without the sadness of low mood." },
  numbness: { label: "Emotional numbness", domain: "mood", def: "Says they cannot feel love, grief or joy, as if cut off from their own emotions, and suffers from it." },
  /* Affect */
  perplexed: { label: "Perplexed affect", domain: "affect", def: "A bewildered, puzzled face and manner, as if the world has suddenly changed and nothing makes sense." },
  shallow: { label: "Shallow affect", domain: "affect", def: "Emotions shown are thin, brief and empty (a silly, fatuous cheerfulness) rather than reduced." },
  irritableaffect: { label: "Irritable affect", domain: "affect", def: "Tight jaw, sharp tone, quick to snap: annoyance you can see in the room." },
  /* Thought form */
  overinclusion: { label: "Overinclusion", domain: "form", def: "Cannot keep the edges of an idea or category: pulls in loosely related things that do not belong." },
  concrete: { label: "Concrete thinking", domain: "form", def: "Takes words, proverbs and metaphors literally and cannot move to the abstract meaning." },
  metonym: { label: "Metonym", domain: "form", def: "An odd, approximate phrase used in place of the exact word, built from ordinary words ('I ate the three-times-a-day')." },
  povertycontent: { label: "Poverty of content", domain: "form", def: "Talks a normal amount but conveys almost nothing: vague, empty, repetitive." },
  vorbeireden: { label: "Approximate answers", domain: "form", def: "Wrong answers that show the question was understood (a cow has five legs, two plus two is five), as in Ganser states." },
  /* Thought content */
  hypochondriacal: { label: "Health preoccupation", domain: "content", def: "Persistent fear of having a serious illness despite normal tests and reassurance, which the person can still doubt a little. Not a fixed delusion." },
  somaticdel: { label: "Somatic delusion", domain: "content", def: "A fixed, false belief about the body: infested, giving off a smell, misshapen, a part not working." },
  erotomanic: { label: "Erotomanic delusion", domain: "content", def: "A fixed belief that someone, often of higher status, is secretly in love with them." },
  capgras: { label: "Delusional misidentification", domain: "content", def: "A fixed belief that a familiar person has been replaced by an identical impostor (Capgras), or that a stranger is someone known in disguise." },
  povertydel: { label: "Delusion of poverty", domain: "content", def: "A fixed belief of being ruined and penniless despite clear evidence otherwise, typical of severe depression." },
  primary: { label: "Autochthonous delusion", domain: "content", def: "A delusion that arrives suddenly and fully formed, out of the blue, with no perception or mood that leads to it." },
  ideasref: { label: "Ideas of reference", domain: "content", def: "A feeling that others notice or talk about them, which the person can still question ('maybe I am imagining it'). Not fixed." },
  phobia: { label: "Phobia", domain: "content", def: "A marked fear of a specific object or situation, out of proportion, which the person recognises and avoids." },
  rumination: { label: "Depressive rumination", domain: "content", def: "Turning the same sad or self-blaming thoughts over and over, felt as true and not resisted as senseless." },
  homicidal: { label: "Thoughts of harming others", domain: "content", def: "Thoughts, urges or plans to hurt someone else. Always ask about the target, plan, intent and access." },
  dysmorphic: { label: "Appearance preoccupation", domain: "content", def: "Hours of focus on a defect in looks that others see as slight or absent, with checking and hiding." },
  selfharmthoughts: { label: "Self-harm thoughts", domain: "content", def: "Urges or thoughts to injure themselves (cutting, burning) to cope with feelings, without wanting to die." },
  /* Perception */
  olfactory: { label: "Olfactory hallucination", domain: "perception", def: "Smells something with no source (burning, rotting, gas)." },
  gustatory: { label: "Gustatory hallucination", domain: "perception", def: "Tastes something with no source (metal, bitter poison in food)." },
  somatichall: { label: "Somatic hallucination", domain: "perception", def: "Feels bodily sensations with no cause: organs moving, electric currents, being touched inside." },
  echo: { label: "Thought echo", domain: "perception", def: "Hears their own thoughts spoken aloud, as or just after they think them." },
  functional: { label: "Functional hallucination", domain: "perception", def: "A real sound brings on a hallucination in the same sense, heard alongside it (voices only while the tap runs)." },
  reflex: { label: "Reflex hallucination", domain: "perception", def: "A stimulus in one sense causes a hallucination in another (feels a stab in the chest whenever a door bangs)." },
  extracampine: { label: "Extracampine hallucination", domain: "perception", def: "Perceived outside the possible sensory field (sees a man standing behind their head, hears voices from another city)." },
  hypnopompic: { label: "Hypnopompic hallucination", domain: "perception", def: "A brief image or voice on waking up. Often normal." },
  autoscopy: { label: "Autoscopy", domain: "perception", def: "Sees a double of themselves, their own body, outside them." },
  distortion: { label: "Sensory distortion", domain: "perception", def: "Real things look or sound changed in size, colour, intensity or quality (sounds deafening, colours too bright, objects too small)." },
  /* Cognition */
  amnesia: { label: "Dissociative amnesia", domain: "cognition", def: "A gap in personal memory, usually for a stressful period, too large for ordinary forgetting and with no brain cause found." },
  executive: { label: "Poor executive function", domain: "cognition", def: "Cannot plan, switch tasks or stop a response: fails sequences and gets stuck on the last rule." },
  dontknow: { label: "Poor effort, 'don't know' answers", domain: "cognition", def: "Gives up quickly with 'I don't know', yet does better with encouragement. Typical of depression, not dementia." },
  /* Insight & judgement */
  goodjudgement: { label: "Intact judgement", domain: "insight", def: "Makes sensible, safe decisions for their situation. A normal finding." },
  explanatory: { label: "Different explanatory model", domain: "insight", def: "Explains the problem in a cultural frame (nazar, a spell, weakness of nerves) while still accepting help: a different model, not absent insight." },
} as const satisfies Record<string, Term>;

export type TermId = keyof typeof TERMS;

export function termById(id: string): Term | undefined {
  return (TERMS as Record<string, Term>)[id];
}

export function domainLabel(id: string): string {
  return DOMAINS.find((d) => d.id === id)?.label ?? id;
}
