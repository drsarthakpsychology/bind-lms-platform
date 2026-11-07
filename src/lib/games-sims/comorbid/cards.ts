/**
 * Comorbid: the cards. Diagnoses are simplified teaching versions of the
 * criteria (the count and the must-have card), not the full rules. Many
 * symptoms belong to more than one diagnosis, which is the point: overlap is
 * why comorbidity and differentials are hard.
 */
export type Symptom = { id: string; label: string; line: string };
export type RuleOut = { id: string; label: string; line: string; against: string[] };
/** `core`: at least one must be played. `must`: every one must be played. */
export type Diagnosis = { id: string; name: string; short: string; core: string[]; must?: string[]; symptoms: string[]; need: number; topic: string; rule: string };

export const SYMPTOMS: Symptom[] = [
  { id: "lowmood", label: "Low mood most of the day", line: "Sad, empty or hopeless, nearly every day." },
  { id: "anhedonia", label: "Loss of interest or pleasure", line: "Nothing feels enjoyable any more." },
  { id: "sleep", label: "Sleep problems", line: "Too little or too much sleep." },
  { id: "appetite", label: "Appetite or weight change", line: "Eating much less or much more than usual." },
  { id: "fatigue", label: "Tiredness, low energy", line: "Worn out without doing much." },
  { id: "guilt", label: "Worthlessness or guilt", line: "Feeling useless, or blaming yourself out of proportion." },
  { id: "concentration", label: "Poor concentration", line: "Can't focus or make decisions." },
  { id: "psychomotor", label: "Slowed down or agitated", line: "Others can see the slowing or the restlessness." },
  { id: "death", label: "Thoughts of death or suicide", line: "Recurring thoughts of dying or ending life." },
  { id: "elevated", label: "Elevated or irritable mood", line: "Unusually high, expansive or irritable, with more energy." },
  { id: "grandiose", label: "Grandiosity", line: "Inflated self-esteem: special powers, great plans." },
  { id: "lesssleep", label: "Little need for sleep", line: "Rested after three hours and not tired." },
  { id: "pressured", label: "Pressured speech", line: "Talks fast and can't be interrupted." },
  { id: "racing", label: "Racing thoughts", line: "Ideas jump faster than speech can follow." },
  { id: "distract", label: "Easily distracted", line: "Attention pulled away by small things." },
  { id: "goal", label: "Many new projects", line: "A burst of goal-directed activity." },
  { id: "risky", label: "Risky spending or sex", line: "Pleasure-seeking with painful consequences." },
  { id: "worry", label: "Hard-to-control worry about many things", line: "Worries jump from health to money to family." },
  { id: "restless", label: "Restless, on edge", line: "Keyed up, can't settle." },
  { id: "tension", label: "Muscle tension", line: "Tight shoulders, jaw, aching neck." },
  { id: "irritable", label: "Irritability", line: "Snapping at people over small things." },
  { id: "panicattack", label: "Unexpected panic attacks", line: "Sudden surges of fear, out of the blue." },
  { id: "palpitations", label: "Racing heart", line: "A pounding or fast heartbeat." },
  { id: "breathless", label: "Short of breath", line: "Feels like choking or smothering." },
  { id: "dying", label: "Fear of dying or losing control", line: "Sure something terrible is happening now." },
  { id: "worrynext", label: "Dread of the next attack", line: "Constant worry about when it will strike again." },
  { id: "delusions", label: "Delusions", line: "Fixed false beliefs, held despite evidence." },
  { id: "hallucinations", label: "Hallucinations", line: "Hearing or seeing things others don't." },
  { id: "disorganised", label: "Disorganised speech", line: "Speech that loses its links." },
  { id: "negative", label: "Negative symptoms", line: "Flat feelings, little speech, no drive." },
  { id: "decline", label: "Decline in work or self-care", line: "Can't keep up study, work or hygiene." },
  { id: "trauma", label: "Exposure to a trauma", line: "Faced death, serious injury or sexual violence." },
  { id: "flashbacks", label: "Flashbacks or nightmares", line: "The event comes back as if happening again." },
  { id: "avoid", label: "Avoiding reminders", line: "Keeps away from places, people, talk of it." },
  { id: "numb", label: "Negative beliefs and numbness", line: "'The world is dangerous', 'I'm to blame', feeling cut off." },
  { id: "startle", label: "Jumpy, always on guard", line: "Startles easily, scans for danger." },
  { id: "obsessions", label: "Obsessions", line: "Unwanted, intrusive thoughts or urges that cause distress." },
  { id: "compulsions", label: "Compulsions", line: "Repeated acts or mental rituals done to reduce the distress." },
  { id: "timeloss", label: "Rituals eat up time", line: "Takes up a lot of the day or gets in the way." },
];

export const DIAGNOSES: Diagnosis[] = [
  { id: "mdd", name: "Major depressive episode", short: "Depression", core: ["lowmood", "anhedonia"], symptoms: ["lowmood", "anhedonia", "sleep", "appetite", "fatigue", "guilt", "concentration", "psychomotor", "death"], need: 5, topic: "depression", rule: "5 symptoms, one of them low mood or loss of interest." },
  { id: "mania", name: "Manic episode", short: "Mania", core: ["elevated"], symptoms: ["elevated", "grandiose", "lesssleep", "pressured", "racing", "distract", "goal", "risky"], need: 4, topic: "bipolar", rule: "Elevated or irritable mood plus 3 more." },
  { id: "gad", name: "Generalised anxiety disorder", short: "GAD", core: ["worry"], symptoms: ["worry", "restless", "fatigue", "concentration", "irritable", "tension", "sleep"], need: 4, topic: "anxiety", rule: "Hard-to-control worry plus 3 of the six body and mind symptoms." },
  { id: "panic", name: "Panic disorder", short: "Panic", core: ["panicattack"], symptoms: ["panicattack", "palpitations", "breathless", "dying", "worrynext"], need: 4, topic: "anxiety", rule: "Unexpected attacks plus 3 more, including the dread of the next one or its symptoms." },
  { id: "scz", name: "Schizophrenia", short: "Schizophrenia", core: ["delusions", "hallucinations", "disorganised"], symptoms: ["delusions", "hallucinations", "disorganised", "negative", "decline"], need: 3, topic: "psychosis", rule: "3 cards, at least one of delusions, hallucinations or disorganised speech." },
  { id: "ptsd", name: "Post-traumatic stress disorder", short: "PTSD", core: ["trauma"], symptoms: ["trauma", "flashbacks", "avoid", "numb", "startle", "sleep", "irritable", "concentration"], need: 5, topic: "trauma", rule: "The trauma itself plus 4 more." },
  { id: "ocd", name: "Obsessive-compulsive disorder", short: "OCD", core: ["obsessions", "compulsions"], must: ["timeloss"], symptoms: ["obsessions", "compulsions", "timeloss"], need: 2, topic: "ocd", rule: "Obsessions or compulsions, plus rituals that eat up time." },
];

export const RULEOUTS: RuleOut[] = [
  { id: "hyperthyroid", label: "Overactive thyroid", line: "Too much thyroid hormone brings anxiety, a racing heart, weight loss and poor sleep.", against: ["gad", "panic", "mania"] },
  { id: "hypothyroid", label: "Underactive thyroid", line: "Low thyroid hormone brings low mood, tiredness, weight gain and slowing.", against: ["mdd"] },
  { id: "stimulants", label: "Stimulant or cannabis use", line: "Cannabis, amphetamines and cocaine can cause psychosis, mania or panic.", against: ["scz", "mania", "panic", "gad"] },
  { id: "steroids", label: "High-dose steroid medicine", line: "Steroids like prednisolone can bring on mania, depression or psychosis.", against: ["mania", "mdd", "scz"] },
  { id: "pastmania", label: "A past manic episode", line: "Depression in someone who has had mania is bipolar depression, not major depressive disorder.", against: ["mdd"] },
  { id: "moodonly", label: "Psychosis only during mood episodes", line: "If the psychosis only ever comes with severe mood episodes, think of a mood disorder with psychotic features.", against: ["scz"] },
  { id: "delirium", label: "Clouded consciousness (delirium)", line: "Hallucinations in a confused, drowsy person point to delirium and a medical cause.", against: ["scz"] },
  { id: "headinjury", label: "A head injury explains it", line: "Concussion can cause poor concentration, irritability and sleep problems.", against: ["ptsd"] },
  { id: "tics", label: "They are tics, not compulsions", line: "Tics are sudden urges to move without an obsession behind them.", against: ["ocd"] },
  { id: "hypoglycaemia", label: "Low blood sugar spells", line: "Sweating, shaking and a pounding heart when sugar drops can look like panic.", against: ["panic"] },
  { id: "caffeine", label: "Too much caffeine", line: "Many cups of coffee or energy drinks bring jitteriness, worry and poor sleep.", against: ["gad", "panic"] },
];

export const CLEAR = { id: "normaltest", label: "Tests come back normal", line: "History, examination and tests clear the rule-out against you." } as const;

export const symptomById = (id: string) => SYMPTOMS.find((x) => x.id === id);
export const ruleById = (id: string) => RULEOUTS.find((x) => x.id === id);
export const dxById = (id: string) => DIAGNOSES.find((x) => x.id === id);
