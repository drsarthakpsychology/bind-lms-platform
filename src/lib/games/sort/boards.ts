/**
 * Criteria Sort boards: 16 criteria, 4 look-alike disorders. Each tile belongs
 * to exactly one disorder on its board. `threshold` is the duration or count
 * the advanced tier asks for. Checked against DSM-5-TR (refs).
 * Server code only: the answers are here.
 */

export type SortItem = { id: string; text: string; why: string };
export type SortGroup = { dx: string; items: [SortItem, SortItem, SortItem, SortItem]; threshold: string | null };
export type SortBoard = {
  id: string;
  title: string;
  topic: string;
  difficulty: 1 | 2 | 3;
  groups: [SortGroup, SortGroup, SortGroup, SortGroup];
  /** Chips offered in the advanced tier (all correct thresholds plus decoys). */
  thresholds: string[] | null;
  module: string;
  refs: string[];
};

let n = 0;
const it = (text: string, why: string): SortItem => ({ id: `t${(++n).toString(36)}`, text, why });

export const BOARDS: SortBoard[] = [
  {
    id: "sb-01",
    title: "Highs and lows",
    topic: "depression",
    difficulty: 1,
    module: "depression",
    groups: [
      { dx: "mdd", threshold: "At least 2 weeks", items: [it("Loss of interest or pleasure in almost everything", "Anhedonia is a core MDD symptom; it isn't on the PDD list."), it("Slowing of movement others can see", "Psychomotor change is an MDD criterion, not a PDD one."), it("Recurrent thoughts of death or suicide", "In the MDD list; PDD's list has hopelessness but not suicidal thoughts."), it("Five or more symptoms in the same period", "MDD's count. PDD needs only two extra symptoms.")] },
      { dx: "pdd", threshold: "At least 2 years", items: [it("Depressed mood on more days than not", "PDD's wording; MDD says most of the day, nearly every day."), it("Never symptom-free for more than 2 months", "PDD Criterion C."), it("In children, 1 year is enough", "PDD shortens to 1 year in children and adolescents."), it("Low self-esteem and hopelessness for years", "Two of PDD's six symptoms, over the long haul.")] },
      { dx: "bipolar-1", threshold: "At least 1 week (any length if admitted)", items: [it("A high that needs hospital admission", "Admission makes it mania, whatever the length."), it("Psychotic features during the high", "Psychosis in a high means mania, never hypomania."), it("Marked trouble at work from raised mood", "Marked impairment separates mania from hypomania."), it("One such episode is enough for the diagnosis", "One manic episode = bipolar I.")] },
      { dx: "cyclothymic", threshold: "At least 2 years (1 in young people)", items: [it("Many hypomanic-type spells below full criteria", "Cyclothymia's highs never reach a hypomanic episode."), it("Many low spells that never reach a depressive episode", "Its lows stay below MDE criteria."), it("Symptoms present at least half the time", "Cyclothymia Criterion B."), it("Never had a full mood episode", "Any full episode changes the diagnosis.")] },
    ],
    thresholds: ["At least 2 weeks", "At least 2 years", "At least 1 week (any length if admitted)", "At least 2 years (1 in young people)", "At least 4 days", "At least 6 months"],
    refs: ["DSM-5-TR p.183 (MDD)", "DSM-5-TR p.193 (PDD)", "DSM-5-TR pdf p.256 (mania)", "DSM-5-TR p.160 (cyclothymia)"],
  },
  {
    id: "sb-02",
    title: "Anxious minds",
    topic: "anxiety",
    difficulty: 1,
    module: "anxiety",
    groups: [
      { dx: "gad", threshold: "6 months", items: [it("Worry about many different things", "GAD worry spreads across many topics."), it("Finds the worry hard to control", "GAD Criterion B."), it("Muscle tension and tiring easily", "Two of GAD's six body symptoms."), it("In children, one body symptom is enough", "GAD needs three in adults, one in children.")] },
      { dx: "panic", threshold: "1 month", items: [it("Attacks come out of the blue", "Panic disorder needs unexpected attacks."), it("Fear peaks within minutes", "The definition of a panic attack."), it("Worry about having more attacks", "Panic Criterion B."), it("Changes routine to avoid another attack", "The behavioural part of Criterion B.")] },
      { dx: "social-anxiety", threshold: "6 months", items: [it("Fear of being judged by others", "The core of social anxiety."), it("Fear of showing anxiety and being humiliated", "Social anxiety Criterion B."), it("Can be limited to speaking or performing", "The 'performance only' specifier."), it("In children, must happen with peers, not only adults", "A child-specific note in the criteria.")] },
      { dx: "specific-phobia", threshold: "6 months", items: [it("Fear of one object or situation", "Specific phobia is about one trigger."), it("The trigger almost always provokes fear at once", "Specific phobia Criterion B."), it("Blood-injection type can cause fainting", "The vasovagal response is typical of this subtype."), it("Subtypes: animal, natural environment, situational", "Specific phobia's specifiers.")] },
    ],
    thresholds: ["6 months", "1 month", "2 weeks", "3 months"],
    refs: ["DSM-5-TR pdf p.393 (GAD)", "DSM-5-TR p.235 to 236 (panic)", "DSM-5-TR p.230 to 231 (social anxiety)", "DSM-5-TR pdf p.361 (specific phobia)"],
  },
  {
    id: "sb-03",
    title: "Psychosis by the clock",
    topic: "psychosis",
    difficulty: 2,
    module: "psychosis",
    groups: [
      { dx: "brief-psychotic", threshold: "1 day to under 1 month", items: [it("Full return to how they were before", "Brief psychotic disorder needs full recovery."), it("Can follow a major stressor", "The 'with marked stressor(s)' specifier."), it("Can begin in pregnancy or within 4 weeks of birth", "The 'with peripartum onset' specifier."), it("The shortest psychotic disorder in the chapter", "Under a month.")] },
      { dx: "schizophreniform", threshold: "1 month to under 6 months", items: [it("Called 'provisional' if diagnosed before recovery", "Used when you can't yet wait out 6 months."), it("About a third recover within 6 months", "The rest mostly go on to schizophrenia or schizoaffective."), it("A fall in functioning is not required", "Unlike schizophrenia, no impairment criterion."), it("Has a 'good prognostic features' specifier", "Quick onset, confusion, good premorbid function, no flat affect.")] },
      { dx: "schizophrenia", threshold: "At least 6 months", items: [it("Quiet early and late phases count toward the total", "Prodromal and residual periods are included."), it("Work, relationships or self-care clearly below before", "Schizophrenia Criterion B."), it("Needs at least 1 month of active symptoms", "Inside the longer period."), it("Diagnosed only after the full time has passed", "Until then it may be schizophreniform.")] },
      { dx: "delusional", threshold: "At least 1 month", items: [it("Hallucinations, if any, fit the delusion's theme", "Delusional disorder note to Criterion B."), it("Behaviour not obviously odd apart from the delusion", "Delusional disorder Criterion C."), it("Jealous, erotomanic or grandiose types", "Its subtypes."), it("Schizophrenia Criterion A never met", "Delusional disorder Criterion B.")] },
    ],
    thresholds: ["1 day to under 1 month", "1 month to under 6 months", "At least 6 months", "At least 1 month", "At least 2 weeks", "At least 1 year"],
    refs: ["DSM-5-TR pdf p.217 (brief psychotic)", "DSM-5-TR pdf p.220 to 222 (schizophreniform)", "DSM-5-TR pdf p.223 to 224 (schizophrenia)", "DSM-5-TR pdf p.212 (delusional)"],
  },
  {
    id: "sb-04",
    title: "After something bad happens",
    topic: "trauma",
    difficulty: 2,
    module: "trauma",
    groups: [
      { dx: "ptsd", threshold: "More than 1 month", items: [it("Flashbacks and nightmares of the event", "Intrusion symptoms."), it("Lasting negative beliefs about self or the world", "PTSD's Criterion D."), it("Can have delayed expression", "Full criteria may be met 6+ months after the event."), it("Has a dissociative subtype", "PTSD 'with dissociative symptoms'.")] },
      { dx: "acute-stress", threshold: "3 days to 1 month", items: [it("Needs 9 or more of 14 listed symptoms", "Acute stress disorder's count."), it("Becomes PTSD if it lasts and meets criteria", "The diagnosis changes after a month."), it("Diagnosed only in the first month", "By definition."), it("Symptoms usually begin straight after the event", "Note to Criterion C.")] },
      { dx: "adjustment", threshold: "Starts within 3 months", items: [it("Any stressor, not only trauma", "A job loss or breakup counts."), it("Distress out of proportion to the stressor", "Adjustment Criterion B."), it("Doesn't meet criteria for another disorder", "Adjustment Criterion C."), it("Settles once the stressor ends", "Within 6 more months.")] },
      { dx: "prolonged-grief", threshold: "Death at least 12 months ago", items: [it("Intense yearning for the person who died", "Core feature."), it("Feels part of themselves has died", "Identity disruption."), it("Marked disbelief about the death", "One of the listed symptoms."), it("Goes beyond cultural and religious norms", "Prolonged grief Criterion E.")] },
    ],
    thresholds: ["More than 1 month", "3 days to 1 month", "Starts within 3 months", "Death at least 12 months ago", "At least 6 months", "At least 2 weeks"],
    refs: ["DSM-5-TR pdf p.457 (PTSD)", "DSM-5-TR pdf p.470 to 472 (acute stress)", "DSM-5-TR p.321 (adjustment)", "DSM-5-TR pdf p.481 (prolonged grief)"],
  },
  {
    id: "sb-05",
    title: "Personality patterns",
    topic: "personality",
    difficulty: 2,
    module: "personality",
    groups: [
      { dx: "borderline-pd", threshold: "5 of 9 features", items: [it("Frantic efforts to avoid abandonment", "Borderline criterion 1."), it("Chronic feelings of emptiness", "Borderline criterion 7."), it("Recurrent self-harm or suicidal behaviour", "Borderline criterion 5."), it("Unstable sense of self", "Identity disturbance, criterion 3.")] },
      { dx: "antisocial-pd", threshold: "3 of 7, age 18+", items: [it("Conduct disorder before age 15", "Antisocial Criterion C."), it("Lies or cons others for profit or pleasure", "Deceitfulness."), it("No remorse after hurting others", "Lack of remorse."), it("Reckless disregard for others' safety", "One of the seven features.")] },
      { dx: "avoidant-pd", threshold: "4 of 7 features", items: [it("Wants relationships but fears rejection", "The key difference from schizoid."), it("Sees self as socially inept or inferior", "Avoidant criterion 6."), it("Avoids jobs with a lot of contact", "Avoidant criterion 1."), it("Holds back in close relationships for fear of shame", "Avoidant criterion 3.")] },
      { dx: "schizotypal-pd", threshold: "5 of 9 features", items: [it("Odd beliefs or magical thinking", "Schizotypal criterion 2."), it("Unusual perceptual experiences", "Schizotypal criterion 3."), it("Odd, eccentric behaviour or appearance", "Schizotypal criterion 7."), it("Social anxiety that doesn't ease with familiarity", "Schizotypal criterion 9.")] },
    ],
    thresholds: ["5 of 9 features", "3 of 7, age 18+", "4 of 7 features", "4 of 8 features", "2 of 9 features"],
    refs: ["DSM-5-TR pdf p.1003 (borderline)", "DSM-5-TR pdf p.998 (antisocial)", "DSM-5-TR p.765 (avoidant)", "DSM-5-TR pdf p.994 (schizotypal)"],
  },
  {
    id: "sb-06",
    title: "Food and body",
    topic: "eating",
    difficulty: 2,
    module: "more-disorders",
    groups: [
      { dx: "anorexia", threshold: "No set duration", items: [it("Significantly low body weight", "Anorexia Criterion A."), it("Intense fear of gaining weight", "Anorexia Criterion B."), it("Doesn't see how serious the low weight is", "Part of Criterion C."), it("Restricting or binge-purge type", "Anorexia's subtypes.")] },
      { dx: "bulimia", threshold: "Weekly for 3 months", items: [it("Vomiting, laxatives or fasting after binges", "Compensation is required for bulimia."), it("Weight usually normal or above", "If significantly low, it's anorexia instead."), it("Doesn't happen only during anorexia", "Bulimia Criterion E."), it("Calluses on the back of the hand", "From inducing vomiting.")] },
      { dx: "binge-eating", threshold: "Weekly for 3 months", items: [it("No regular vomiting or laxatives", "The key difference from bulimia."), it("Eats until uncomfortably full", "One of binge-eating's listed features."), it("Eats alone out of embarrassment", "Another listed feature."), it("Marked distress about the binges", "Binge-eating Criterion C.")] },
      { dx: "arfid", threshold: "No set duration", items: [it("No fear of weight gain or body-image worry", "This rules out anorexia."), it("Avoids food for its texture or smell", "Sensory-based avoidance."), it("Fear of choking or vomiting", "Concern about aversive consequences."), it("Depends on nutrition drinks", "One of ARFID's harm criteria.")] },
    ],
    thresholds: ["No set duration", "Weekly for 3 months", "Daily for 1 month", "Twice a week for 6 months"],
    refs: ["DSM-5-TR pdf p.554 (anorexia)", "DSM-5-TR pdf p.564 to 568 (bulimia)", "DSM-5-TR pdf p.570 (binge-eating)", "DSM-5-TR p.376 (ARFID)"],
  },
  {
    id: "sb-07",
    title: "Night and day",
    topic: "sleep",
    difficulty: 2,
    module: "more-disorders",
    groups: [
      { dx: "insomnia", threshold: "3 nights a week for 3 months", items: [it("Trouble falling or staying asleep", "Insomnia Criterion A."), it("Happens despite enough chance to sleep", "Insomnia Criterion E."), it("Wakes early and can't get back to sleep", "Early-morning awakening."), it("Not explained by another sleep disorder", "Insomnia Criterion F.")] },
      { dx: "narcolepsy", threshold: "3 times a week for 3 months", items: [it("Collapse of muscle tone when laughing", "Cataplexy."), it("Low hypocretin in spinal fluid", "Narcolepsy type 1 marker."), it("REM sleep within minutes of falling asleep", "Short REM latency on testing."), it("Irresistible sleep attacks in the day", "Narcolepsy Criterion A.")] },
      { dx: "osa", threshold: "5+ events an hour on a sleep study", items: [it("Loud snoring and gasping", "Nocturnal breathing disturbance."), it("Breathing pauses seen by a partner", "Witnessed apnoeas."), it("Risk rises with obesity and a thick neck", "Main risk factors."), it("Needs a sleep study to confirm", "Diagnosed by polysomnography.")] },
      { dx: "rls", threshold: "3 times a week for 3 months", items: [it("Urge to move the legs at rest", "RLS Criterion A."), it("Worse in the evening or at night", "RLS Criterion A3."), it("Eased by walking or stretching", "RLS Criterion A2."), it("Linked with low iron", "Iron deficiency is a known cause.")] },
    ],
    thresholds: ["3 nights a week for 3 months", "3 times a week for 3 months", "5+ events an hour on a sleep study", "Every night for 1 month", "2 weeks"],
    refs: ["DSM-5-TR p.410 (insomnia)", "DSM-5-TR p.422 (narcolepsy)", "DSM-5-TR p.429 (OSA)", "DSM-5-TR p.465 to 467 (RLS)"],
  },
  {
    id: "sb-08",
    title: "Hooked",
    topic: "substance",
    difficulty: 2,
    module: "substance",
    groups: [
      { dx: "alcohol-use", threshold: "2 of 11 within 12 months", items: [it("Strong craving to drink", "A use-disorder criterion."), it("Needs more to get the same effect", "Tolerance."), it("Gave up hobbies to drink", "A use-disorder criterion."), it("Keeps drinking despite liver damage", "Use despite physical harm.")] },
      { dx: "alcohol-withdrawal", threshold: "Hours to a few days after stopping", items: [it("Pulse over 100 and sweating", "Autonomic hyperactivity."), it("Hand tremor", "A withdrawal sign."), it("Seizures may occur", "Generalised seizures are listed."), it("Brief visual or touch hallucinations", "Transient hallucinations.")] },
      { dx: "gambling", threshold: "4 of 9 within 12 months", items: [it("Chases losses the next day", "A gambling criterion."), it("Lies to hide how much is lost", "A gambling criterion."), it("Needs bigger bets for the same thrill", "Gambling's version of tolerance."), it("Relies on others to pay the debts", "A gambling criterion.")] },
      { dx: "opioid-withdrawal", threshold: "Minutes to several days after stopping", items: [it("Yawning and a runny nose", "Opioid withdrawal signs."), it("Wide pupils and goosebumps", "Opioid withdrawal signs."), it("Diarrhoea and muscle aches", "Opioid withdrawal signs."), it("Can be set off by an antagonist", "Naloxone or naltrexone can trigger it.")] },
    ],
    thresholds: ["2 of 11 within 12 months", "Hours to a few days after stopping", "4 of 9 within 12 months", "Minutes to several days after stopping", "3 of 7 within 6 months"],
    refs: ["DSM-5-TR p.553 (alcohol use)", "DSM-5-TR p.565 (alcohol withdrawal)", "DSM-5-TR p.661 (gambling)", "DSM-5-TR p.618 (opioid withdrawal)"],
  },
  {
    id: "sb-09",
    title: "In the classroom",
    topic: "child",
    difficulty: 1,
    module: "child",
    groups: [
      { dx: "adhd", threshold: "6 symptoms for 6 months", items: [it("Loses things and is easily distracted", "Inattention symptoms."), it("Can't wait their turn", "Impulsivity."), it("Several symptoms before age 12", "ADHD Criterion B."), it("Five symptoms are enough from age 17", "The adult threshold.")] },
      { dx: "autism", threshold: "From early development", items: [it("Little back-and-forth conversation", "Social reciprocity deficit."), it("Lines up toys and insists on sameness", "Restricted, repetitive behaviour."), it("Unusual reactions to sounds or textures", "Sensory reactivity."), it("Few gestures and little eye contact", "Nonverbal communication deficit.")] },
      { dx: "odd", threshold: "4 symptoms for 6 months", items: [it("Often loses temper", "Angry/irritable mood."), it("Argues with adults and defies rules", "Argumentative/defiant behaviour."), it("Deliberately annoys others", "Argumentative/defiant behaviour."), it("Spiteful twice in the last 6 months", "Vindictiveness.")] },
      { dx: "conduct", threshold: "3 of 15 within 12 months", items: [it("Cruel to animals", "Aggression to people and animals."), it("Breaks into a house or car", "Deceitfulness or theft."), it("Sets fires to cause damage", "Destruction of property."), it("Stays out at night before age 13", "Serious violation of rules.")] },
    ],
    thresholds: ["6 symptoms for 6 months", "From early development", "4 symptoms for 6 months", "3 of 15 within 12 months", "2 weeks", "1 year"],
    refs: ["DSM-5-TR pdf p.168 to 169 (ADHD)", "DSM-5-TR p.37 (autism)", "DSM-5-TR pdf p.728 (ODD)", "DSM-5-TR pdf p.739 (conduct)"],
  },
  {
    id: "sb-10",
    title: "Body, mind and doctors",
    topic: "somatic",
    difficulty: 3,
    module: "more-disorders",
    groups: [
      { dx: "somatic-symptom", threshold: "Typically more than 6 months", items: [it("Distressing body symptoms", "Somatic symptom Criterion A."), it("Excessive time and energy on the symptoms", "Criterion B."), it("Lasting worry about how serious they are", "Criterion B."), it("Can be 'with predominant pain'", "Its specifier.")] },
      { dx: "illness-anxiety", threshold: "At least 6 months", items: [it("Few or no body symptoms", "Illness anxiety Criterion B."), it("Checks the body for signs of illness", "Excessive health behaviour."), it("Care-seeking or care-avoidant type", "Its subtypes."), it("The feared illness may change over time", "Note to Criterion E.")] },
      { dx: "fnd", threshold: "No set duration (acute if under 6 months)", items: [it("Weakness or fits that don't fit known disease", "FND Criterion B."), it("Hoover's sign in a weak leg", "A positive sign of functional weakness."), it("Can be with or without a stressor", "The 'with psychological stressor' specifier."), it("Not produced on purpose", "No deception, unlike factitious disorder.")] },
      { dx: "factitious", threshold: "No set duration", items: [it("Fakes or induces illness", "Factitious Criterion A."), it("Deception is identified", "Required for the diagnosis."), it("No obvious outside reward", "Otherwise it's malingering."), it("Can be imposed on another person", "Factitious disorder imposed on another.")] },
    ],
    thresholds: ["Typically more than 6 months", "At least 6 months", "No set duration (acute if under 6 months)", "No set duration", "At least 1 month"],
    refs: ["DSM-5-TR pdf p.518 (somatic symptom)", "DSM-5-TR pdf p.525 (illness anxiety)", "DSM-5-TR pdf p.529 to 531 (FND)", "DSM-5-TR pdf p.538 (factitious)"],
  },
  {
    id: "sb-11",
    title: "Memory and thinking",
    topic: "neurocognitive",
    difficulty: 3,
    module: "neurocognitive",
    groups: [
      { dx: "delirium", threshold: null, items: [it("Attention and awareness are disturbed", "Delirium Criterion A."), it("Fluctuates through the day", "Delirium Criterion B."), it("Caused by an illness, drug or withdrawal", "Delirium Criterion E."), it("Comes on over hours to days", "Delirium Criterion B.")] },
      { dx: "alzheimers", threshold: null, items: [it("Memory and learning decline first", "Alzheimer's core."), it("Steady decline without long plateaus", "Alzheimer's criterion."), it("A causative gene in the family confirms it", "Probable when a mutation is shown."), it("Shrinking hippocampus on MRI", "Medial temporal atrophy.")] },
      { dx: "lewy-ncd", threshold: null, items: [it("Detailed visual hallucinations", "Core feature."), it("Parkinsonism after the memory trouble", "Core feature."), it("Acts out dreams in sleep", "Suggestive feature (RBD)."), it("Severe reaction to antipsychotics", "Suggestive feature.")] },
      { dx: "ftd", threshold: null, items: [it("Disinhibition early on", "Behavioural variant."), it("Loss of empathy", "Behavioural variant."), it("Overeats sweets", "Hyperorality."), it("Memory relatively spared", "FTD Criterion D.")] },
    ],
    thresholds: null,
    refs: ["DSM-5-TR p.672 (delirium)", "DSM-5-TR p.690 (Alzheimer's)", "DSM-5-TR pdf p.939 to 940 (Lewy)", "DSM-5-TR pdf p.935 (frontotemporal)"],
  },
];

const BY_ID = new Map(BOARDS.map((b) => [b.id, b]));
export function boardById(id: string): SortBoard | undefined {
  return BY_ID.get(id);
}
