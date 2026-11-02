/**
 * Detective: guess the medicine or disorder from clues revealed one at a
 * time. Fewer clues used = more points. Answers are concept ids, so options
 * come from the same family (drugs vs drugs, disorders vs disorders).
 */
export type Case = { answer: string; family: "drug" | "disorder"; clues: [string, string, string, string] };

export const CASES: Case[] = [
  { answer: "lithium", family: "drug", clues: ["A naturally occurring element used as a medicine", "Blood levels are checked regularly; the safe window is narrow", "Ibuprofen and dehydration push its level up", "Coarse tremor, vomiting and confusion signal toxicity"] },
  { answer: "clozapine", family: "drug", clues: ["An antipsychotic kept for when others have failed", "Reduces suicidal behaviour in schizophrenia", "Weekly blood counts at the start", "Can drop neutrophils; a sore throat or fever needs a same-day check"] },
  { answer: "valproate", family: "drug", clues: ["A mood stabiliser also used for epilepsy", "Weight gain and hair thinning are common complaints", "Liver function and pancreatitis need watching", "Avoided in women who could become pregnant: major birth-defect risk"] },
  { answer: "lamotrigine", family: "drug", clues: ["A mood stabiliser better at preventing lows than highs", "The dose is increased very slowly over weeks", "Valproate doubles its level", "A spreading rash must be reported immediately (SJS)"] },
  { answer: "carbamazepine", family: "drug", clues: ["An anticonvulsant mood stabiliser", "It speeds up its own breakdown", "It can make the contraceptive pill fail", "Low sodium, low white cells and a gene test (HLA-B*1502) in some Asian patients"] },
  { answer: "olanzapine", family: "drug", clues: ["A second-generation antipsychotic", "Very sedating, often taken at night", "Appetite rises sharply", "Among the highest risks for weight gain and diabetes"] },
  { answer: "risperidone", family: "drug", clues: ["A second-generation antipsychotic, also available as a long-acting injection", "Movement side effects rise with dose", "Periods may stop", "Raised prolactin is its signature side effect"] },
  { answer: "aripiprazole", family: "drug", clues: ["A second-generation antipsychotic", "Low risk of weight gain and prolactin rise", "Restlessness (akathisia) is common", "A dopamine partial agonist: a 'dimmer switch'"] },
  { answer: "haloperidol", family: "drug", clues: ["An older, first-generation antipsychotic", "Often given by injection for acute agitation", "Young men may get sudden neck or eye spasms", "High-potency D2 blocker with strong EPS risk"] },
  { answer: "fluoxetine", family: "drug", clues: ["An SSRI antidepressant", "Can feel activating; often taken in the morning", "Its active metabolite lingers for weeks", "Least likely SSRI to cause withdrawal when stopped"] },
  { answer: "paroxetine", family: "drug", clues: ["An SSRI antidepressant", "More sedating and anticholinergic than other SSRIs", "Short half-life", "Most likely SSRI to cause discontinuation symptoms"] },
  { answer: "mirtazapine", family: "drug", clues: ["An antidepressant that isn't an SSRI", "Usually taken at bedtime", "Helps with poor sleep and poor appetite", "Weight gain and sleepiness are typical"] },
  { answer: "bupropion", family: "drug", clues: ["An antidepressant also used to quit smoking", "Rarely causes sexual side effects", "Acts on dopamine and noradrenaline", "Avoided with seizures or eating disorders"] },
  { answer: "methylphenidate", family: "drug", clues: ["Used most often in children and adults with attention problems", "Appetite drops at lunchtime", "Heart rate and blood pressure are checked", "A stimulant for ADHD"] },
  { answer: "donepezil", family: "drug", clues: ["Used in older adults", "Can slow the heart rate", "Nausea and vivid dreams are common early", "Boosts acetylcholine in Alzheimer's disease"] },
  { answer: "disulfiram", family: "drug", clues: ["Used in addiction treatment", "Works only if taken daily and willingly", "Flushing, vomiting and a racing heart if the person drinks", "Blocks the breakdown of acetaldehyde"] },
  { answer: "naloxone", family: "drug", clues: ["An emergency medicine", "Given by injection or nasal spray", "Pinpoint pupils and slowed breathing are what it treats", "Reverses opioid overdose"] },
  { answer: "benzodiazepine", family: "drug", clues: ["A class of calming medicines", "Very effective quickly, but only for short-term use", "Dangerous with alcohol or opioids", "Stopping suddenly after long use can cause seizures"] },
  { answer: "buprenorphine", family: "drug", clues: ["Used in addiction treatment", "Placed under the tongue", "Safer in overdose than full opioids (ceiling effect)", "A partial opioid agonist for opioid substitution"] },
  { answer: "thiamine", family: "drug", clues: ["A vitamin", "Given before glucose in at-risk patients", "Heavy drinkers are often low in it", "Prevents Wernicke's encephalopathy"] },
  { answer: "delirium", family: "disorder", clues: ["Starts suddenly, over hours to days", "Worse in the evening and at night", "Attention is poor and it fluctuates", "Usually a medical cause: infection, drugs, low sodium"] },
  { answer: "schizophrenia", family: "disorder", clues: ["Usually starts in late teens or twenties", "Negative symptoms often affect daily life most", "Hallucinations and delusions may be present", "Signs last at least 6 months"] },
  { answer: "bipolar1", family: "disorder", clues: ["Mood swings run in the family", "Depression may be the first episode", "Sleep need falls, plans and spending grow", "At least one full manic episode"] },
  { answer: "ocd", family: "disorder", clues: ["Often hidden out of embarrassment", "Takes more than an hour a day", "The person knows the thoughts come from their own mind", "Unwanted thoughts plus rituals to ease the anxiety"] },
  { answer: "ptsd", family: "disorder", clues: ["Follows a frightening event", "Avoids reminders", "Nightmares and flashbacks", "Symptoms last more than a month"] },
  { answer: "anorexia", family: "disorder", clues: ["Commonest in adolescent girls, but not only them", "Periods may stop, heart rate may fall", "Intense fear of gaining weight", "Restriction to a significantly low body weight"] },
  { answer: "panic", family: "disorder", clues: ["Often first seen in the emergency room", "Heart pounding, breathlessness, fear of dying", "Peaks within minutes", "Repeated unexpected attacks plus worry about the next one"] },
  { answer: "bpd", family: "disorder", clues: ["Relationships swing between idealising and devaluing", "Self-harm may occur", "Chronic emptiness", "DBT has the strongest evidence"] },
  { answer: "adhd", family: "disorder", clues: ["Present since childhood", "Shows up at home and at school", "Losing things, interrupting, restless", "Several symptoms before age 12"] },
  { answer: "lewy", family: "disorder", clues: ["A dementia", "Cognition fluctuates from day to day", "Vivid visual hallucinations", "Very sensitive to antipsychotics; Parkinson-like stiffness"] },
  { answer: "wernicke", family: "disorder", clues: ["An emergency in heavy drinkers", "Unsteady walking", "Abnormal eye movements", "Confusion from thiamine deficiency"] },
  { answer: "dhat", family: "disorder", clues: ["Described in South Asia", "Young men with weakness and fatigue", "Often comes with anxiety or low mood", "Worry about losing semen"] },
];

export const POINTS = [40, 30, 20, 10] as const;
export const WRONG_PENALTY = 5;
