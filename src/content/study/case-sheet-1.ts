/* Module · Writing the case sheet and formulation, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: what a case record is for

## 1.1 What a case sheet does [core][starting]
A **case sheet** (case record) is the written account of everything you learned about a patient: their story, your observations, your understanding and your plan. It is not a form to fill. It is the patient's story told so clearly that a stranger could pick it up at 2 am and know what to do.

### Five jobs of a good case sheet
1. **Clinical care**: it guides the next decision, by you or by someone else.
2. **Communication**: it lets the psychiatrist, the psychologist, the nurse and the social worker work from the same picture.
3. **Continuity**: it lets the next clinician see what has been tried, what worked and what harmed.
4. **Legal record**: under Indian law (including the Mental Healthcare Act 2017), records show what consent was taken, what capacity was judged, why someone was admitted, and what the patient was told. If it is not written, in court it did not happen.
5. **Teaching and research**: good records train students and make audits possible.

:::analogy A relay race
Clinical care is a relay race. The case sheet is the baton. A smooth handover (clear, complete, readable) keeps the patient moving forward. A dropped baton (a missing allergy, an unrecorded suicide threat) can lose the race.
:::


:::widget flow
{
 "title": "The record in the cycle of care",
 "layout": "cycle",
 "nodes": [
  {
   "id": "a",
   "label": "Assess",
   "detail": "Interview, informants, examination, tests."
  },
  {
   "id": "r",
   "label": "Record",
   "detail": "Write it clearly, attributed, dated and signed."
  },
  {
   "id": "p",
   "label": "Plan",
   "detail": "The plan follows from what is written: formulation, diagnosis, risk."
  },
  {
   "id": "t",
   "label": "Treat",
   "detail": "Others act on the record when you are not there."
  },
  {
   "id": "v",
   "label": "Review",
   "detail": "Progress notes compare today with what was recorded before."
  }
 ],
 "caption": "If one turn of the cycle is missing from the record, the next clinician starts blind."
}
:::

### Ten principles that never change
- **Accurate**: write what was said and seen, not what you assumed.
- **Attributed**: say **who** said it ("per sister", "patient reports").
- **Patient's own words** for key complaints, in quotation marks, with a translation if needed.
- **Chronological**: tell the story in time order.
- **Specific**: numbers, dates, durations, frequencies ("wakes at 3 am most nights" not "poor sleep").
- **Descriptive, not just labels**: "talks rapidly, hard to interrupt, jumps from topic to topic" before "pressure of speech and flight of ideas".
- **Relevant negatives**: important things that are absent ("no history of head injury, seizures or substance use").
- **Respectful**: no judgemental words ("attention-seeking", "difficult", "drama").
- **Dated, timed and signed**, with your name and designation.
- **Legible and confidential**: stored securely; shared only as the law allows.

:::widget decide
{
  "scene": "You are a trainee in a Pune OPD. A patient's father says his son is 'always lying in bed doing drama, mad like his uncle'. The patient says, 'I feel tired all the time and nothing matters.' You have one line to write.",
  "ask": "Which entry is best?",
  "choices": [
    { "label": "“Patient doing drama, lazy, family history of madness.”", "verdict": "harm", "outcome": "The next clinician reads the father's judgement as fact, and the patient later reads his own record and feels humiliated.", "why": "Unattributed, judgemental words become 'facts' in the record and harm care and trust." },
    { "label": "“Pt: ‘I feel tired all the time and nothing matters.’ Per father: stays in bed most of the day; father describes this as ‘drama’. Father reports a paternal uncle had a mental illness (details to be clarified).”", "verdict": "best", "outcome": "The record is accurate, attributed and useful. The uncle's illness is later found to be bipolar disorder, an important clue.", "why": "Patient's words in quotes, informant's account attributed, opinion separated from observation, and a lead to follow up." },
    { "label": "“Depression.”", "verdict": "ok", "outcome": "Short, but it skips the evidence, the informant and the family clue.", "why": "A label without evidence cannot be checked or revised." }
  ]
}
:::


:::widget compare
{
 "title": "A weak and a strong entry",
 "a": {
  "label": "Weak",
  "points": [
   "\"Pt attention-seeking, drama\"",
   "No source given",
   "No patient's words",
   "Undated, unsigned"
  ],
  "summary": "Judgement dressed as fact."
 },
 "b": {
  "label": "Strong",
  "points": [
   "Behaviour described: cut forearm after an argument",
   "Per mother, and the patient quoted",
   "Relevant negatives recorded",
   "Dated, timed, signed"
  ],
  "summary": "Accurate, attributed, defensible."
 }
}
:::

:::student
This module is about **writing**. How to **ask** questions in the interview is taught in **The psychiatric interview and MSE** module, and how to observe and describe each part of the mental state in depth is in **The MSE in depth**. Here you learn to turn all of that into a clear, defensible record.
:::

:::clinician
Under the Mental Healthcare Act 2017, documentation duties include: the capacity assessment for treatment decisions (section 4 principles), records of advance directives and nominated representatives where they exist, the basis and type of admission (for example section 86 independent admission or section 89 supported admission), restraint and seclusion with reasons and monitoring, and the patient's right to access their records (section 25) and to confidentiality (section 23). The Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations 2002, now administered under the National Medical Commission framework, require retention of indoor patient records for three years and provision of records on request within 72 hours; check current NMC regulations, which have been revised in recent years. For psychologists, RCI and professional codes require record-keeping that supports continuity and protects confidentiality. Records are also a quality-improvement tool: audits of risk documentation and consent recording are among the simplest ways a unit can show safe practice.
:::

:::recall
1. Name the five jobs of a case sheet. || Clinical care, communication, continuity, legal record, teaching and research.
2. Why must you attribute information? || So readers know who said it and can judge its reliability; it separates fact from opinion.
3. What is a relevant negative? Give an example. || An important feature that is absent, such as "no history of head injury, seizures or substance use".
4. Which MHCA section gives a patient the right to access their records? || Section 25.
:::

:::mcq
Q: Which entry follows good practice?
- "Patient is attention-seeking."
- *"Patient cut her forearm superficially after an argument; says, 'I wanted the pain inside to stop.'"
- "Typical borderline."
- "Drama queen."
> Describe, quote and avoid judgemental labels.

Q: "If it is not written, it did not happen" mainly reflects the case sheet's role as a:
- Teaching tool
- *Legal record
- Research database
- Billing document
> Documentation is the evidence of care.
:::

## 1.2 The headings at a glance [core][starting]
Most Indian training centres follow a similar order. Learn it until you can write it in your sleep.

| Section | What goes in it |
|---|---|
| **1. Identification data** | Name (or initials), age, sex, marital status, religion, education, occupation, socioeconomic status, address area, language, date, source of referral |
| **2. Informants** | Who gave information, their relationship, how long and how closely they know the patient, and how reliable and adequate they are |
| **3. Chief complaints** | Main problems in the patient's (and informant's) words, each with its duration, in time order |
| **4. History of present illness (HPI)** | The story of this illness from the last time the person was well to today |
| **5. Past history** | Past psychiatric episodes and treatment; past medical and surgical illness |
| **6. Treatment history** | Medicines with doses, duration, response, side effects, adherence; ECT; psychotherapy; traditional and faith healing; allergies |
| **7. Substance use history** | Each substance: age started, pattern, amount, dependence features, last use, consequences |
| **8. Family history** | Family tree (genogram), illnesses in relatives, family relationships and atmosphere |
| **9. Personal history** | Birth, development, schooling, work, marriage and sexual life, menstrual and obstetric history, forensic history |
| **10. Premorbid personality** | How the person was before the illness |
| **11. Physical examination** | General and systemic examination, with relevant findings |
| **12. Mental status examination** | What you observed and elicited today |
| **13. Summary** | A short paragraph pulling it all together |
| **14. Formulation** | Why this person, why this problem, why now, what keeps it going, what helps |
| **15. Differential and provisional diagnosis** | Possible diagnoses in order, with reasons for and against |
| **16. Investigations** | What tests and why |
| **17. Management plan** | Biological, psychological and social; short and long term |
| **18. Risk assessment** | To self, to others, from others, with a safety plan |


:::widget layers
{
 "title": "The case sheet in five layers",
 "shape": "stack",
 "layers": [
  {
   "label": "1. Who and why",
   "detail": "Identification data, informants, chief complaints."
  },
  {
   "label": "2. The story",
   "detail": "History of present illness."
  },
  {
   "label": "3. The background",
   "detail": "Past, treatment, substance, family, personal history, premorbid personality."
  },
  {
   "label": "4. What you found today",
   "detail": "Physical examination and MSE."
  },
  {
   "label": "5. What it means and what to do",
   "detail": "Summary, formulation, differential and provisional diagnosis, investigations, management, risk."
  }
 ],
 "caption": "Eighteen headings collapse into five questions. If you forget a heading in an exam, ask which layer it belongs to."
}
:::

:::mnemonic The order of the history: "I Can Hear Past Family Personal Problems"
**I**dentification and informants, **C**hief complaints, **H**istory of present illness, **P**ast (and treatment and substance), **F**amily, **P**ersonal, **P**remorbid personality.
:::

:::widget sort
{
  "prompt": "Where does each piece of information belong in the case sheet?",
  "buckets": ["History of present illness", "Family history", "Personal history", "Premorbid personality", "Mental status examination"],
  "items": [
    { "text": "“Sleeps about 4 hours a night since the illness began”", "bucket": 0 },
    { "text": "Maternal aunt treated for schizophrenia", "bucket": 1 },
    { "text": "Walked late; repeated Class 3", "bucket": 2 },
    { "text": "Before the illness: sociable, disciplined, loved cricket", "bucket": 3 },
    { "text": "Today: talks rapidly, hard to interrupt", "bucket": 4, "why": "The MSE records only what you see and hear now." },
    { "text": "Started hearing voices after his father's death five months ago", "bucket": 0 },
    { "text": "Married at 22, arranged marriage, two children", "bucket": 2 }
  ]
}
:::


:::widget sort
{
 "prompt": "Which layer of the case sheet does each item belong to?",
 "buckets": [
  "Who and why",
  "The story (HPI)",
  "Background",
  "Found today",
  "Meaning and plan"
 ],
 "items": [
  {
   "text": "Informants and their reliability",
   "bucket": 0
  },
  {
   "text": "Sleep reduced for two months",
   "bucket": 1
  },
  {
   "text": "Paternal uncle treated for depression",
   "bucket": 2
  },
  {
   "text": "Flight of ideas during the interview",
   "bucket": 3
  },
  {
   "text": "5P formulation",
   "bucket": 4
  },
  {
   "text": "Chief complaints with durations",
   "bucket": 0
  },
  {
   "text": "Repeated Class 7",
   "bucket": 2
  },
  {
   "text": "Provisional diagnosis with ICD-11 code",
   "bucket": 4
  }
 ]
}
:::

:::trap History versus MSE
The commonest error in student case sheets is putting history into the MSE ("has been sad for 3 months" written under mood). The MSE is a **snapshot of now**. What the patient tells you about the past goes in the history; what you observe and elicit today goes in the MSE.
:::

:::clinician
Structure varies by setting. Many Indian postgraduate centres add headings for "treatment history" and "substance history" as separate sections, "socio-cultural and religious factors" or "explanatory model of illness", "life chart" for recurrent illnesses, and "legal status" (type of admission under the MHCA). Child case sheets add birth and developmental history in detail, school reports and parenting; old age records add functional status (ADLs and IADLs), falls and medication review. The core logic is constant: identification, story, background, observation, synthesis, plan. Electronic records (with drop-down menus) speed entry but risk "copy-forward" errors and loss of narrative; insist on a free-text HPI and formulation.
:::

:::recall
1. List the 18 sections of the case sheet in order. || Identification; informants; chief complaints; HPI; past; treatment; substance; family; personal; premorbid personality; physical exam; MSE; summary; formulation; differential and provisional diagnosis; investigations; management; risk.
2. What separates the history from the MSE? || History is what was reported about the past; the MSE is what you observe and elicit now.
:::

:::mcq
Q: A patient's statement that he has felt hopeless for four months belongs in:
- The MSE under mood
- *The history of present illness
- Premorbid personality
- Family history
> Past experience reported by the patient is history.

Q: Information about a patient's school performance belongs in:
- HPI
- *Personal history
- MSE
- Formulation
> Schooling is part of personal history.
:::

## 1.3 From patient's words to clinical language [core][starting]
Patients describe their experiences in everyday language: "my mind is not working", "gas going up to my head", "I feel someone is doing jaadu-tona on me". Your job is to **keep their words** and **add precise clinical terms** that other clinicians understand. Never replace one with the other.

### The three-step method
1. **Quote**: write the patient's words, with translation.
2. **Clarify**: describe what it actually means for them, from your questions.
3. **Name**: add the clinical term, only if it fits.

| Patient says | You clarify | Clinical description |
|---|---|---|
| "Dimaag kaam nahi karta" (my mind doesn't work) | Cannot concentrate to read, forgets what he came into the room for | Poor concentration and attention, subjective memory complaints |
| "I can't sleep" | Falls asleep at 11 pm, wakes at 3 am, cannot sleep again | Early morning awakening (terminal insomnia) |
| "Voices talk about me" | Hears two men discussing her in the third person through the wall when alone | Third-person auditory hallucinations |
| "My thoughts are not my own" | Feels her neighbour puts thoughts into her head | Thought insertion |
| "I keep checking" | Checks the gas knob 20 times before leaving, knows it is silly, cannot stop | Checking compulsions with preserved insight |
| "Ghabrahat hoti hai" (I get panicky) | Sudden racing heart, breathlessness, fear of dying, peaking within minutes, unexpected | Panic attacks |
| "Kamzori, dhaat jaata hai" (weakness, semen passes) | Worried about loss of semen in urine, feels weak and tired | Dhat syndrome: preoccupation with semen loss with fatigue |

:::widget sort
{
  "prompt": "Which clinical term fits each clarified description?",
  "buckets": ["Thought broadcasting", "Initial insomnia", "Anhedonia", "Delusion of persecution", "Visual hallucination"],
  "items": [
    { "text": "“Everyone on the bus can hear my thoughts as I think them.”", "bucket": 0 },
    { "text": "Lies awake for two hours every night before falling asleep", "bucket": 1 },
    { "text": "No longer enjoys music, food or meeting friends, though she used to", "bucket": 2 },
    { "text": "Firmly believes the neighbours are poisoning his water, despite tests showing it is clean", "bucket": 3 },
    { "text": "Sees small men running along the ward wall at night when no one is there", "bucket": 4 }
  ]
}
:::


:::widget flow
{
 "title": "Quote, clarify, name",
 "layout": "chain",
 "nodes": [
  {
   "id": "q",
   "label": "Quote",
   "detail": "\"Koi mere kaan mein kuch keh raha hai\" (someone is saying something in my ear)."
  },
  {
   "id": "c",
   "label": "Clarify",
   "detail": "Voice or sound? Inside or outside the head? When? What does it say? How real?"
  },
  {
   "id": "n",
   "label": "Name",
   "detail": "Only now add the term that fits: here, tinnitus, not a hallucination."
  }
 ],
 "edgeLabels": {
  "q>c": "ask",
  "c>n": "only if it fits"
 },
 "caption": "Skipping the middle box is how a ringing ear becomes a schizophrenia diagnosis."
}
:::

:::trap Labels without evidence
"Patient is delusional" tells the reader nothing they can check. Write **what** the belief is, **how firmly** it is held, **what evidence** the patient gives, and **how it affects** behaviour. Then the reader can agree or disagree with the label.
:::

:::widget decide
{
  "scene": "Mrs Kaur, 50, in Ludhiana, says: 'Mere sir pe bhaar rehta hai, aur kabhi kabhi lagta hai koi mere kaan mein kuch keh raha hai' (there is a weight on my head, and sometimes I feel someone is saying something in my ear). You have not yet asked anything further.",
  "ask": "What should you write at this stage?",
  "choices": [
    { "label": "“Auditory hallucinations, likely schizophrenia.”", "verdict": "harm", "outcome": "On clarifying later, she meant ringing in her ears (tinnitus) and a feeling of tension. The early label follows her for years.", "why": "Never label before clarifying. A misheard symptom becomes a misdiagnosis." },
    { "label": "Quote her words with translation, then clarify: is it a voice or a sound, inside or outside the head, when, what it says, how real it seems; record what you find", "verdict": "best", "outcome": "She describes a buzzing sound in both ears, worse at night, with heaviness of the head when worried. The record reads: 'Tinnitus and tension-type headache; no hallucinations'.", "why": "Quote, clarify, then name is the safe method." },
    { "label": "Leave it out as unclear", "verdict": "ok", "outcome": "A possibly important symptom is lost.", "why": "Record it with your uncertainty and plan to clarify." }
  ]
}
:::

:::clinician
Use phenomenological precision as taught in the MSE modules (primary versus secondary delusion, true versus pseudo-hallucination, obsession versus rumination), but remember that idioms of distress carry meaning beyond symptom identification. Record the patient's explanatory model (Kleinman's questions: what do you call the problem, what caused it, why now, what does it do to you, how severe, what treatment do you hope for, what do you fear most) under a separate heading or within HPI; the DSM-5-TR Cultural Formulation Interview offers a structured version, and several Indian adaptations exist. In multilingual India, record which language the interview was conducted in and whether an interpreter was used, since both affect the reliability of reported phenomena.
:::

:::recall
1. What are the three steps for writing symptoms? || Quote the patient's words, clarify what they mean, then name the clinical term if it fits.
2. Why should you never write only a label like "delusional"? || The reader cannot check it; describe the belief, conviction, evidence and impact.
3. What does "explanatory model" mean? || The patient's own understanding of what the problem is, its cause, and what treatment they expect.
:::

:::mcq
Q: A patient says "my mind is blank". The best next step before writing a clinical term is to:
- Write "thought block"
- Write "dementia"
- *Clarify what he means: sudden stopping of thoughts, poor concentration, or emptiness of feeling
- Ignore it
> Clarify before naming.
:::

## 1.4 Identification, informants and chief complaints [core][starting]
### Identification data
Write it as one compact paragraph. Each item has a reason:
- **Age and sex**: shape the likely diagnoses (first psychosis at 20 versus 65).
- **Marital status, religion, education, occupation**: social context and resources.
- **Socioeconomic status**: access to care and stresses (many centres use the modified **Kuppuswamy scale** for Indian families).
- **Area** (urban, rural, semi-urban) and **language**: support and communication.
- **Referral source**: why now, and who is worried.

:::example A compact identification paragraph
Ms P, 26, female, unmarried, Hindu, BCom graduate, works as an accounts assistant, lower-middle socioeconomic status (modified Kuppuswamy), from an urban area of Surat, Gujarati and Hindi speaking; brought by her parents to the psychiatry emergency on referral from a general practitioner.
:::


:::widget reveal
{
 "prompt": "Why does the case sheet record who referred the patient?",
 "answer": "The referral source tells you who is worried and why now. A patient brought by police, sent by an employer, referred by a GP or self-referred will have different concerns, expectations and levels of insight, and it often hints at risk (for example police involvement)."
}
:::

### Informants: who, and how reliable?
For each informant write: **name or relationship, age, how long and how closely they know the patient, and your judgement of reliability and adequacy**.
- **Reliable** means you have no reason to doubt honesty: consistent, not hostile, no obvious motive to distort.
- **Adequate** means they had enough contact to know: lives with the patient, sees them daily.


:::widget sort
{
 "prompt": "Judge each informant.",
 "buckets": [
  "Reliable and adequate",
  "Reliable, not adequate",
  "Reliability in doubt"
 ],
 "items": [
  {
   "text": "Mother who lives with the patient and gives a consistent account",
   "bucket": 0
  },
  {
   "text": "A sister in another country who phones monthly",
   "bucket": 1
  },
  {
   "text": "A brother in a property dispute with the patient who says she is 'mad'",
   "bucket": 2,
   "why": "A conflict of interest is a reason to weigh the account carefully and seek others."
  },
  {
   "text": "A close friend who shares a room at the hostel",
   "bucket": 0
  },
  {
   "text": "A neighbour who met the patient twice",
   "bucket": 1
  }
 ]
}
:::

:::example Writing an informant line
"Informants: (1) the patient: reliable but inadequate, as she lacks insight into recent behaviour; (2) mother, 52, homemaker, lives with the patient: reliable and adequate; (3) elder brother, 30, lives in Mumbai, visits monthly: reliable but inadequate for recent events."
:::


:::widget flow
{
 "title": "Judging an informant",
 "layout": "tree",
 "nodes": [
  {
   "id": "r",
   "label": "Each informant"
  },
  {
   "id": "rel",
   "label": "Reliable?",
   "parent": "r",
   "detail": "Consistent, no obvious motive to distort, not hostile, not unwell themselves."
  },
  {
   "id": "ad",
   "label": "Adequate?",
   "parent": "r",
   "detail": "Enough contact to know: lives with the patient, sees them often, knows them over years."
  },
  {
   "id": "rel1",
   "label": "Yes: weigh their account highly",
   "parent": "rel"
  },
  {
   "id": "rel2",
   "label": "Doubtful: record why and seek others",
   "parent": "rel",
   "detail": "For example a property dispute or a hostile relationship."
  },
  {
   "id": "ad1",
   "label": "Yes: use for recent events",
   "parent": "ad"
  },
  {
   "id": "ad2",
   "label": "No: use for distant history only",
   "parent": "ad",
   "detail": "A brother in another city may know childhood well but not last week."
  }
 ],
 "caption": "Write both judgements, with the reason, for every informant."
}
:::

### Chief complaints
- Write each main complaint as a short phrase, **with its duration**, in **chronological order** of onset.
- Use the **patient's words** (with translation), and separately the **informant's** complaints if different.
- Keep them few (usually three to six). The detail goes in the HPI.

:::widget worked
{
  "title": "Writing chief complaints from a messy interview",
  "steps": [
    { "q": "Mr R's wife says: 'For about 6 months he hasn't slept properly. For 2 months he says people at the office are plotting against him. For the last 10 days he hasn't gone to work and keeps the windows shut.' Mr R says, 'Nothing is wrong with me, they are trying to finish me.' How do you order the informant's complaints?", "a": "By onset: (1) decreased sleep, 6 months; (2) suspiciousness that colleagues are plotting against him, 2 months; (3) not going to work and keeping windows shut, 10 days." },
    { "q": "How do you record the patient's complaint?", "a": "Patient: “Nothing is wrong with me, they are trying to finish me.” (Denies illness; reports that colleagues are trying to harm him.)" },
    { "q": "What will you NOT put in chief complaints?", "a": "Interpretation (“paranoid schizophrenia”), lengthy detail, or MSE findings. Those belong elsewhere." }
  ],
  "yourTurn": [
    { "q": "Mrs D, 35, says: 'Bahut ghabrahat hoti hai' (I feel very panicky) for 1 year; 'Dil ki dhadkan tez' (heart races) episodes for 4 months; and since 1 month she 'cannot go to the market alone'. Write the chief complaints.", "a": "(1) “Bahut ghabrahat hoti hai” (feels very anxious and panicky), 1 year. (2) Episodes of racing heart, 4 months. (3) Unable to go to the market alone, 1 month." }
  ]
}
:::

:::clinician
The modified Kuppuswamy scale combines head-of-family education, occupation and monthly family income; the income bands must be updated using the current Consumer Price Index for industrial workers, and published annual revisions are available. Some centres prefer the BG Prasad scale (per capita income) in rural settings. Informant reliability is not a moral judgement; record the reasons (relationship conflict, inheritance dispute, the informant's own illness), especially when accounts conflict, and record both versions. Where the patient is the only informant (for example a homeless person), record this and plan collateral history as part of investigations. For involuntary admissions, record who brought the patient and the information they provided, since this forms part of the legal basis for admission.
:::

:::recall
1. What does each item of identification data tell you? || Age and sex shape likely diagnoses; social items give context and resources; SES affects access; area and language affect support and communication; referral source tells you who is worried and why now.
2. Define reliable and adequate informants. || Reliable: no reason to doubt honesty or accuracy. Adequate: enough contact to know the facts.
3. How should chief complaints be ordered? || Chronologically by onset, each with its duration.
:::

:::mcq
Q: A brother who lives in another city and phones once a month is best described as an informant who is:
- Reliable and adequate
- *Possibly reliable but inadequate for recent events
- Unreliable and inadequate
- Not worth recording
> Distance limits adequacy.

Q: Chief complaints should be written:
- In alphabetical order
- In order of severity only
- *In chronological order of onset, with durations
- As diagnoses
> Time order tells the story.
:::

## 1.5 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: The main purpose of the case sheet is to:
- Fill hospital forms
- *Record the patient's story, findings, understanding and plan clearly for care, communication and legal purposes
- Impress examiners
- Replace the interview
> Clinical, communicative and legal roles.

Q: Writing "per mother" after a statement is an example of:
- A relevant negative
- *Attribution
- Formulation
- Chief complaint
> Saying who provided the information.

Q: Which is a relevant negative?
- "Patient is sad"
- *"No history of head injury or seizures"
- "Mother is supportive"
- "Sleeps 4 hours"
> An important absent feature.

Q: "Has been hearing voices for two months" belongs in the:
- MSE
- *History of present illness
- Premorbid personality
- Identification data
> Reported past experience.

Q: "Talks rapidly and is difficult to interrupt during the interview" belongs in the:
- HPI
- Personal history
- *MSE
- Family history
> Observed now.

Q: The best way to record a key complaint is:
- Only the clinical term
- *The patient's own words in quotes, with translation and clarification
- The informant's opinion only
- Leave it out if unclear
> Keep the voice, add precision.

Q: Which section contains birth, milestones and schooling?
- Past history
- *Personal history
- Family history
- Premorbid personality
> Development is personal history.

Q: The modified Kuppuswamy scale measures:
- Intelligence
- *Socioeconomic status
- Depression
- Informant reliability
> An Indian SES scale.

Q: An informant who lives with the patient and sees them daily is:
- Reliable by definition
- *Adequate
- Inadequate
- Irrelevant
> Adequacy reflects enough contact.

Q: A judgemental entry such as "attention-seeking" is harmful mainly because:
- It is too long
- *It becomes a 'fact' that biases future care and damages trust
- It is in English
- It is a relevant negative
> Describe behaviour instead.

Q: The order of the history after identification is:
- Family, personal, chief complaints
- *Chief complaints, HPI, past, family, personal, premorbid
- MSE, HPI, family
- Formulation, diagnosis, history
> The standard sequence.

Q: A patient says "people are against me". Before writing "persecutory delusion", you should:
- Write it immediately
- *Clarify the belief, its conviction, evidence and effect
- Ask the family to decide
- Start medicine
> Clarify, then name.

Q: The explanatory model is:
- The doctor's diagnosis
- *The patient's own understanding of the illness and its cause
- A statistical model
- The MSE
> Kleinman's concept.

Q: Every entry in the record should be:
- Unsigned to protect the clinician
- *Dated, timed and signed with name and designation
- Written in pencil
- Kept on a personal phone
> Accountability.

Q: Which law gives patients the right to confidentiality of their mental health information?
- RPwD Act 2016
- *Mental Healthcare Act 2017
- NDPS Act 1985
- POCSO Act 2012
> Section 23 of the MHCA.
:::

# Part II · Beginner: writing each part well

## 2.1 The history of present illness [core][beginner]
The HPI is the heart of the case sheet. It answers: **what happened, in what order, and how did it change the person's life?**

### What the HPI must cover
1. **Last time well**: "The patient was apparently well until about six months ago."
2. **Onset**: abrupt (hours to days), acute, subacute or insidious (gradual over months).
3. **Precipitating events**: any stress just before, with timing. Write the link carefully: "temporally associated with", not "caused by".
4. **Course**: continuous, episodic, fluctuating; progressive, static or improving.
5. **Each symptom in time order**, with frequency, severity, and how it has changed.
6. **Biological functions**: sleep (pattern and hours), appetite and weight, energy, libido, menstrual changes, bowel and bladder.
7. **Negative history**: symptoms of other relevant conditions that are absent (for example, in depression: no past high moods, no psychotic symptoms, no substance use, no medical illness).
8. **Risk**: thoughts or acts of harm to self or others, and from others.
9. **Impact**: work, study, family roles, self-care, relationships.
10. **Help sought so far**: doctors, medicines, traditional healers, temples or dargahs, and the effect.


:::widget flow
{
 "title": "The shape of an HPI",
 "layout": "chain",
 "nodes": [
  {
   "id": "w",
   "label": "Last well",
   "detail": "\"Apparently well until about six months ago.\""
  },
  {
   "id": "o",
   "label": "Onset and precipitant",
   "detail": "Abrupt, acute, subacute or insidious; temporally associated with an event."
  },
  {
   "id": "s",
   "label": "Symptoms in order",
   "detail": "Each with frequency, severity and how it changed."
  },
  {
   "id": "b",
   "label": "Biological functions",
   "detail": "Sleep, appetite, weight, energy, libido, menstruation."
  },
  {
   "id": "n",
   "label": "Relevant negatives",
   "detail": "Past highs, psychosis, substances, medical illness: asked, not assumed."
  },
  {
   "id": "r",
   "label": "Risk and impact",
   "detail": "Harm to self or others; work, family, self-care."
  },
  {
   "id": "h",
   "label": "Help sought",
   "detail": "Doctors, medicines, healers, temples, and their effect."
  }
 ]
}
:::

:::analogy A film, not a photograph
The MSE is a photograph of today. The HPI is the film that led to it: scene by scene, in order, with what each scene did to the character.
:::

:::widget worked
{
  "title": "Building an HPI from interview notes",
  "steps": [
    { "q": "Notes: Mr S, 34, Kanpur. Wife says he was fine until Diwali (about five months ago). His shop was robbed in October. Since then he's been 'tense', sleeping badly. For about two months he wakes at 4 am, has lost interest, eats little, lost 6 kg. For about one month he says 'I am a burden', and 10 days ago he said 'maybe the family is better off without me'. No high moods ever. Drinks occasionally at weddings. Took a tonic from a local doctor, no benefit. Missed the shop for 15 days. Write the opening and onset.", "a": "The patient was apparently well until about five months ago. The illness began insidiously, temporally associated with a robbery at his shop." },
    { "q": "Write the course and the symptoms in order.", "a": "Initially he felt tense and slept poorly. Over the last two months he developed early morning awakening (about 4 am), loss of interest in his work and family, reduced appetite with a weight loss of about 6 kg. For about a month he has expressed ideas of being a burden. The course has been gradually progressive." },
    { "q": "Write the risk, impact, negatives and help-seeking.", "a": "Ten days ago he told his wife the family would be 'better off without me' (passive death wish; details of plan and intent in the risk section). He has not opened his shop for 15 days. No history of elevated mood, psychotic symptoms, or regular substance use (drinks only socially). No medical illness reported. He took a tonic from a local practitioner without benefit." }
  ],
  "yourTurn": [
    { "q": "Notes for Ms T, 19, Kolkata: fine until her first-year exams four months ago; since then washes hands for 2 hours a day 'to remove germs', knows it is excessive; avoids touching doorknobs; marks have fallen; no low mood till last month, now feels sad and hopeless about 'never being normal'; sleep and appetite normal; no voices; mother took her to a priest, no benefit. Write a short HPI.", "a": "The patient was apparently well until about four months ago, when, temporally associated with first-year examinations, she developed insidious-onset, progressive excessive handwashing (about two hours a day) driven by fears of contamination, recognised by her as excessive, with avoidance of touching doorknobs. Academic performance has declined. For about a month she has felt sad and hopeless about recovery. Sleep and appetite are unchanged. No psychotic symptoms. Help sought from a priest without benefit." }
  ]
}
:::

:::widget decide
{
  "scene": "Ms G, 28, in Bengaluru, is brought with three months of low mood. In your HPI you have written every depressive symptom carefully. You have not asked about past periods of high mood, and her mother is waiting outside.",
  "ask": "What is the most important missing step before closing the HPI?",
  "choices": [
    { "label": "Nothing; the depression is well documented", "verdict": "harm", "outcome": "She is started on an antidepressant and becomes manic within a month. A past hypomanic episode had been missed.", "why": "In any depression, a history of past elevated mood must be asked of the patient and an informant, because bipolar depression is treated differently." },
    { "label": "Ask her and her mother about any past periods of unusually high mood, energy, reduced need for sleep or overspending, and record the answer as a positive finding or a relevant negative", "verdict": "best", "outcome": "Her mother describes a week last year when she slept two hours a night and spent her savings. The diagnosis becomes bipolar II disorder and the plan changes.", "why": "Relevant negatives are only negative after you have asked. Informants catch hypomania that patients often recall as 'feeling good'." },
    { "label": "Ask about her childhood instead", "verdict": "ok", "outcome": "Useful later, but the bipolar question was more urgent.", "why": "Personal history matters, but differential-shaping negatives come first." }
  ]
}
:::


:::widget moodline
{
 "prompt": "Ms G's mother helped you draw a life chart of her mood over five years (0 is her usual self). What does it show?",
 "series": [
  0,
  -0.5,
  -2.4,
  -2.6,
  -1.2,
  0,
  1.8,
  2.1,
  0.5,
  0,
  -0.3,
  -2.5,
  -2.7
 ],
 "labels": [
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5"
 ],
 "options": [
  "Recurrent depression only",
  "Depressions with a hypomanic period in between",
  "Steady low mood throughout",
  "Ordinary ups and downs"
 ],
 "answer": 1,
 "why": "Two depressive episodes reach the major depression zone, with a period in the hypomania band between them that Ms G recalled only as 'feeling good'. A life chart from an informant can change the diagnosis to bipolar II and change treatment."
}
:::


:::widget timeline
{
 "prompt": "Put Mr S's story in the order you would write his HPI.",
 "events": [
  {
   "label": "Apparently well until about five months ago"
  },
  {
   "label": "Robbery at his shop"
  },
  {
   "label": "Tense, sleeping poorly"
  },
  {
   "label": "Early morning waking, loss of interest, weight loss"
  },
  {
   "label": "Ideas of being a burden"
  },
  {
   "label": "Says the family would be better off without him"
  },
  {
   "label": "Stops opening the shop; brought for help"
  }
 ],
 "why": "An HPI is a story in time order, from the last well point to today."
}
:::

:::trap Do not write a list
An HPI that reads "1. Low mood. 2. Poor sleep. 3. Poor appetite." is a list, not a history. Write connected prose that shows the sequence, the links, and how the illness developed.
:::

:::clinician
For recurrent or long-standing illness, add a life chart (Kraepelin's original idea, formalised in the NIMH Life Chart Method): episodes plotted against time with treatments, life events and functioning, which makes patterns (seasonality, postpartum onset, antidepressant-induced switches, rapid cycling) visible at a glance. In first-episode psychosis, record the duration of untreated psychosis (DUP) and the prodrome, since both carry prognostic weight. In India, record the pathway to care: many patients see general practitioners, AYUSH practitioners and faith healers before psychiatry (the WHO pathways study and Indian replications), and this explains delays without implying blame. Write precipitants as temporal associations and keep causal hypotheses for the formulation.
:::

:::recall
1. List ten elements of a complete HPI. || Last well, onset, precipitants, course, symptoms in order, biological functions, negatives, risk, impact, help sought.
2. How should precipitating events be written? || As temporal associations, not definite causes.
3. Which relevant negative must always be checked in depression? || Past periods of elevated mood (hypomania or mania), asked of the patient and an informant.
4. What is a life chart? || A timeline of episodes with treatments, events and functioning, for recurrent illness.
:::

:::mcq
Q: "The patient was apparently well until eight months ago" establishes:
- The precipitant
- *The last time well, the starting point of the HPI
- The diagnosis
- The premorbid personality
> The HPI starts from the last well period.

Q: Onset that develops gradually over months is called:
- Abrupt
- Acute
- *Insidious
- Episodic
> Insidious onset.
:::

## 2.2 Past, treatment and substance history [core][beginner]
### Past psychiatric history
For each past episode: when, what symptoms, what diagnosis was given, what treatment, how long, response, whether there was admission, and how well the person recovered in between (**inter-episode functioning**).

### Past medical history
Record illnesses that can cause or mimic psychiatric symptoms or affect treatment: thyroid disease, diabetes, hypertension, epilepsy, head injury, HIV, tuberculosis (and its medicines), heart disease (affects drug choice), kidney or liver disease (affects dosing), pregnancy and breastfeeding.

### Treatment history: the most neglected section
For each medicine, write:
| Item | Why it matters |
|---|---|
| **Name and dose** | Was it an adequate dose? |
| **Duration** | Was it an adequate trial? |
| **Response** | Full, partial, none |
| **Side effects** | What to avoid next time |
| **Adherence** | Was it actually taken? |
| **Reason stopped** | Side effects, cost, felt better, advice |

Also: **ECT** (number, response, cognitive effects), **psychotherapy** (type, sessions), **traditional, AYUSH and faith healing**, and **allergies** (written prominently, often in red ink, and repeated on the front page).

:::widget decide
{
  "scene": "Mr K, 40, in Indore, says he 'tried three antidepressants and none worked'. You are about to write 'treatment-resistant depression'.",
  "ask": "What must you check and record first?",
  "choices": [
    { "label": "Nothing more; three failures define resistance", "verdict": "harm", "outcome": "He is offered intensive treatment, but the previous trials had been very short and low-dose. An adequate trial of the first medicine later works.", "why": "Treatment resistance requires adequate dose, duration and adherence for each trial." },
    { "label": "For each medicine: name, dose, how long at that dose, whether taken regularly, side effects, and why it was stopped", "verdict": "best", "outcome": "Two medicines were taken for less than a month at starting doses; one was stopped because of nausea. He does not meet criteria for treatment resistance.", "why": "An adequate trial is defined by dose, duration and adherence. The record must show them." },
    { "label": "Ask only which medicine he liked best", "verdict": "ok", "outcome": "Some useful information, but adequacy is not established.", "why": "Preference matters, but you need the full treatment details." }
  ]
}
:::


:::widget flow
{
 "title": "Was that a real trial of the medicine?",
 "layout": "tree",
 "nodes": [
  {
   "id": "t",
   "label": "A past medicine 'did not work'"
  },
  {
   "id": "d",
   "label": "Adequate dose?",
   "parent": "t",
   "detail": "Was it raised to a therapeutic dose, not left at the starting dose?"
  },
  {
   "id": "u",
   "label": "Adequate duration?",
   "parent": "t",
   "detail": "Long enough at that dose to judge."
  },
  {
   "id": "a",
   "label": "Taken regularly?",
   "parent": "t",
   "detail": "Ask, check pill counts, ask family, consider levels."
  },
  {
   "id": "x",
   "label": "All three yes: a true non-response",
   "parent": "a",
   "detail": "Counts towards treatment resistance."
  },
  {
   "id": "y",
   "label": "Any no: not an adequate trial",
   "parent": "u",
   "detail": "Record it as an inadequate trial, not a failure."
  }
 ],
 "caption": "Treatment resistance is a claim about adequate trials. The record must show dose, duration and adherence."
}
:::

### Substance use history
For **each** substance (alcohol, tobacco in all forms including gutkha and bidi, cannabis including bhang and ganja, opioids including doda post and heroin, sedative tablets, inhalants, stimulants):
- Age at first use and at regular use.
- Current **pattern**: how much, how often, route.
- **Dependence features**: craving, loss of control, tolerance, withdrawal, giving up activities, continued use despite harm.
- **Last use** (important for withdrawal planning).
- **Complications**: medical, legal, family, work.
- **Past attempts to stop**, treatment, longest period of abstinence and what helped.
- **Motivation** to change now.

:::example A precise substance entry
"Alcohol: started at 18 with friends; regular use from 25; for the last two years drinks about 360 ml of whisky (about 12 standard drinks) daily, starting at 11 am; morning tremor relieved by drinking; two episodes of withdrawal seizures last year; has tried to stop three times, longest abstinence two months after inpatient detoxification in 2025; last drink 8 pm yesterday. Tobacco: chews gutkha about 10 sachets daily for 15 years. No other substances."
:::

:::widget guess
{
  "prompt": "In India, a standard drink is often taken as about 10 grams of pure alcohol. Roughly how many standard drinks are in a 750 ml bottle of 42.8 per cent whisky (a common strength in India)?",
  "min": 5,
  "max": 50,
  "unit": "standard drinks",
  "answer": [24, 34],
  "reveal": "About 25 to 32. 750 ml times 0.428 is about 320 ml of pure alcohol, which weighs about 250 grams; at 10 grams per drink that is about 25. So 'half a bottle' a day is about a dozen standard drinks, well into heavy, harmful drinking.",
  "clinician": "Pure alcohol (ml) equals volume (ml) multiplied by ABV; grams equals ml multiplied by 0.789. Definitions of a standard drink vary (8 g in the UK unit, 10 g in WHO and many Indian studies, 14 g in the US). Record actual volumes and beverage type, then convert; patients often report 'pegs' (a large peg in India is commonly 60 ml and a small peg 30 ml) or 'quarters' (180 ml)."
}
:::

:::clinician
Treatment adequacy: for antidepressants, an adequate trial is usually a therapeutic dose for at least four weeks (many definitions use four to six weeks) with confirmed adherence; for antipsychotics, at least six weeks at a therapeutic dose; the TRRIP consensus defines treatment-resistant schizophrenia as non-response to at least two adequate trials of different antipsychotics with adherence checked (ideally including a plasma level or a long-acting injectable). Record past ECT with the number of treatments, electrode placement, response and cognitive side effects. Substance use: in Indian practice, ask specifically about doda post (poppy husk) in Punjab and Rajasthan, bhang in festivals, cough syrups containing codeine, and over-the-counter sedative use, which patients may not count as "drugs". Use AUDIT or the WHO ASSIST to quantify, and record readiness to change in motivational interviewing terms.
:::

:::recall
1. What six items should be recorded for each past medicine? || Name and dose, duration, response, side effects, adherence, reason stopped.
2. Where and how should allergies be recorded? || Prominently, often in red, in the treatment history and on the front page.
3. List the elements of a substance history for each substance. || Age at onset, current pattern and amount, dependence features, last use, complications, past attempts to stop and treatment, motivation now.
4. Why record last use of alcohol? || To anticipate and plan for withdrawal.
:::

:::mcq
Q: Before labelling depression as treatment-resistant, the record must show:
- That the patient dislikes medicines
- *Adequate dose, duration and adherence for each previous trial
- That three doctors have been seen
- A brain scan
> Adequacy of trials defines resistance.

Q: Which is the most important reason to record a patient's last drink?
- To calculate the bill
- *To predict when withdrawal may begin
- To judge morality
- To decide the diagnosis of schizophrenia
> Timing guides withdrawal management.
:::

## 2.3 Family history and the genogram [core][beginner]
Family history gives three kinds of information:
1. **Genetic loading**: mental illness, suicide, substance use, epilepsy, intellectual disability in relatives.
2. **Family environment**: relationships, conflict, support, expressed emotion, who makes decisions.
3. **Resources**: who can help, who lives with whom, finances.

### Drawing a genogram (family tree)
Use **shapes and lines**, never colour alone, so that the tree is readable when photocopied or for colour-blind readers:
- **Square** for a male, **circle** for a female, a **diamond** if sex is unknown or for a pregnancy.
- The **patient** (index case) is marked with an **arrow** and a double outline.
- A **cross (X)** inside the shape, or a diagonal line through it, shows the person has died, with age and cause written beside.
- A **horizontal line** joins partners; children hang below in birth order from left (oldest) to right.
- **Two short slashes** across the partner line show divorce; **one slash**, separation.
- A **double horizontal line** between partners shows **consanguinity** (blood relationship), common in some Indian communities and relevant for genetic conditions.
- **Shading half or all** of a shape (with a key) shows an illness; also **write the diagnosis** beside it, so the meaning does not depend on shading alone.
- Draw a **dotted line** around those who live in the same household.

:::widget sort
{
  "prompt": "Which genogram symbol shows each of these?",
  "buckets": ["Square", "Circle", "Cross or diagonal line through shape", "Double partner line", "Arrow with double outline"],
  "items": [
    { "text": "The patient's father", "bucket": 0 },
    { "text": "The patient's grandmother", "bucket": 1 },
    { "text": "A maternal uncle who died by suicide at 40", "bucket": 2 },
    { "text": "Parents who are first cousins", "bucket": 3 },
    { "text": "The patient herself", "bucket": 4 }
  ]
}
:::


:::widget genogram
{"title":"Draw and read Ms N's family","condition":"a psychotic illness","caption":"Explore Ms N's family and run the pattern finder."}
:::

:::widget figure
{"id": "genogram-symbols"}
:::

### What to write beside the tree
- For each relative with illness: relationship, illness (as described and, if known, diagnosis), treatment, outcome.
- **Family atmosphere**: warmth, conflict, criticism, over-involvement, violence, who the patient is closest to.
- **Family type**: nuclear, joint or extended; who lives in the home.
- **Family attitude to the illness**: supportive, critical, blaming, frightened, believing in supernatural causes.

:::widget decide
{
  "scene": "Ms N, 23, from Coimbatore, has a first episode of psychosis. Her mother says, 'Nobody in our family had any mental problem.' Later, her aunt mentions that the patient's grandfather 'went to Kilpauk hospital for a year' and a cousin 'took his own life'.",
  "ask": "How should the family history be recorded?",
  "choices": [
    { "label": "Write 'no family history of mental illness' as the mother said", "verdict": "harm", "outcome": "Important genetic loading and suicide risk are lost from the record.", "why": "Families often hide or forget illness because of stigma. Asking specific questions and several relatives matters." },
    { "label": "Record both accounts with attribution: mother denies; aunt reports grandfather's year-long psychiatric admission and a cousin's suicide; draw both in the genogram and plan to clarify diagnoses", "verdict": "best", "outcome": "Old records show the grandfather had schizophrenia. The team notes genetic loading and adds family psychoeducation.", "why": "Attributed, specific, with a plan to verify." },
    { "label": "Ask the mother why she lied", "verdict": "harm", "outcome": "She feels shamed; the alliance with the family breaks.", "why": "Hidden family illness is usually about stigma, not dishonesty. Respond with understanding." }
  ]
}
:::

:::clinician
Ask specifically rather than generally: "Has anyone in the family ever been treated for nerves, sadness, fits, mental illness, drinking, been admitted to a mental hospital, or died by suicide or in unclear circumstances?" Psychiatric family history is underreported in India because of stigma and marriage prospects; repeat the question at follow-up. Expressed emotion (criticism, hostility, emotional over-involvement), measured with the Camberwell Family Interview, predicts relapse in schizophrenia and has been replicated in Indian samples, though Indian families on average showed lower EE in early studies. Consanguinity is relevant for autosomal recessive conditions (some metabolic and neurodevelopmental disorders), and in some states (parts of Tamil Nadu, Karnataka, Andhra Pradesh and among some communities elsewhere) is common enough to ask routinely. McGoldrick's genogram conventions are the standard reference; add emotional relationship lines (close, conflicted, cut-off) when family dynamics are central to formulation.
:::

:::recall
1. What three kinds of information does family history provide? || Genetic loading, family environment, and resources.
2. What symbols show male, female, deceased and the patient in a genogram? || Square, circle, a cross or diagonal line through the shape, an arrow with a double outline.
3. What does a double partner line mean? || Consanguinity (a blood relationship between partners).
4. Why write the diagnosis beside shaded shapes? || So the meaning never depends on shading or colour alone.
:::

:::mcq
Q: In a genogram, two short slashes across the line joining a couple indicate:
- Consanguinity
- *Divorce
- Death
- Twins
> One slash for separation, two for divorce.

Q: High expressed emotion in a family is linked most consistently with:
- Better outcome in schizophrenia
- *Higher relapse rates in schizophrenia
- Higher IQ
- Lower medication need
> Criticism, hostility and over-involvement predict relapse.
:::

## 2.4 Personal history and premorbid personality [core][beginner]
### Personal history: the life story
| Area | What to record |
|---|---|
| **Birth** | Planned or unplanned; mother's health in pregnancy; full term or premature; home or hospital; delayed cry, jaundice, seizures, NICU |
| **Development** | Milestones (motor, speech, social, toilet training); delays |
| **Childhood** | Temperament, fears, bedwetting, tantrums, separation from parents, abuse or neglect (asked sensitively) |
| **Schooling** | Age at entry, medium, performance, failures, change of schools, relationships with teachers and peers, reason for stopping |
| **Work** | Jobs in order, durations, reasons for change, current job and satisfaction |
| **Menstrual and obstetric** | Age at menarche, cycle, premenstrual changes; pregnancies, deliveries, miscarriages, postpartum illness; menopause |
| **Sexual and marital** | Sexual development and orientation (asked respectfully and only as relevant), marriage (arranged or own choice, age, duration), relationship quality, children |
| **Social circumstances** | Living situation, income, debts, support network |
| **Religion and culture** | Beliefs and practices that matter to the person |
| **Forensic** | Arrests, cases, violence |
| **Leisure** | Interests and how they have changed |

:::widget decide
{
  "scene": "You are taking a personal history from Mr V, 45, a farmer from Wardha district, in front of his wife and adult son in a busy OPD. You need to ask about his sexual functioning because he has been on paroxetine for a year.",
  "ask": "How should you handle this?",
  "choices": [
    { "label": "Skip it; it is culturally inappropriate", "verdict": "harm", "outcome": "He stops his medicine because of sexual side effects nobody asked about; depression returns.", "why": "Sexual side effects are common and a leading cause of quiet non-adherence. Avoidance is not respect." },
    { "label": "Ask the family to step out briefly, explain that you ask everyone on this medicine, and ask in plain, respectful words; record findings factually", "verdict": "best", "outcome": "He admits to delayed ejaculation and low desire, relieved to be asked. A medicine change is planned.", "why": "Privacy, normalising and plain language make sensitive questions possible and clinically useful." },
    { "label": "Ask in front of the family", "verdict": "harm", "outcome": "He denies all problems out of embarrassment.", "why": "Without privacy the answer is unreliable and the patient is humiliated." }
  ]
}
:::


:::widget flow
{
 "title": "The personal history as a life line",
 "layout": "chain",
 "nodes": [
  {
   "id": "b",
   "label": "Birth",
   "detail": "Pregnancy, delivery, cry, NICU."
  },
  {
   "id": "d",
   "label": "Development",
   "detail": "Milestones and delays."
  },
  {
   "id": "c",
   "label": "Childhood",
   "detail": "Temperament, fears, separations, adversity."
  },
  {
   "id": "s",
   "label": "School",
   "detail": "Medium, performance, failures, peers."
  },
  {
   "id": "w",
   "label": "Work",
   "detail": "Jobs, durations, reasons for change."
  },
  {
   "id": "m",
   "label": "Relationships and marriage",
   "detail": "Sexual and marital history, children; menstrual and obstetric history for women."
  },
  {
   "id": "n",
   "label": "Now",
   "detail": "Living situation, finances, supports, religion, forensic history, leisure."
  }
 ],
 "caption": "Tell it as a life, in order. Gaps (\"not known\") are written, not left blank."
}
:::

### Premorbid personality: who were they before?
Ask the patient **and** someone who has known them for years. Describe:
- **Social relations**: friends, family, colleagues; close or distant; leader or follower.
- **Use of leisure**: hobbies, interests.
- **Predominant mood**: cheerful, anxious, moody, irritable, stable.
- **Attitudes to self and others**: confident, self-critical, trusting, suspicious.
- **Attitudes to work and responsibility**: conscientious, perfectionist, careless.
- **Moral and religious standards**.
- **Fantasy life**: daydreams, ambitions.
- **Reaction to stress**: how they coped before (talking to friends, prayer, withdrawing, drinking).
- **Habits**: food, sleep, substances.

:::trap Premorbid personality is not current behaviour
A man in a depressive episode may seem withdrawn and indecisive. If before the illness he was sociable and confident, write that. Premorbid personality tells you the **baseline** to aim for, and whether there is an underlying personality pattern that shapes the illness.
:::

:::widget worked
{
  "title": "Writing premorbid personality from an informant",
  "steps": [
    { "q": "Sister's account of Ms A, 30, now admitted with a depressive episode: 'She was always the organised one, made lists for everything, got upset if anything went wrong, had two close friends from school, sang in a bhajan group, never drank. When stressed she would pray and clean the house.' Write the social and leisure part.", "a": "Social relations: a small, stable circle (two close childhood friends); well integrated in family. Leisure: active in a devotional singing group." },
    { "q": "Write mood, attitudes and work.", "a": "Predominant mood: generally stable, prone to worry when plans changed. Attitudes to self: high standards, self-critical. Work and responsibility: conscientious, orderly, list-making." },
    { "q": "Write stress response and habits.", "a": "Reaction to stress: prayer and household activity (adaptive coping). Habits: no substance use. Impression: anankastic (obsessional) traits without evidence of a personality disorder." }
  ],
  "yourTurn": [
    { "q": "Mother's account of Mr B, 22: 'Always the life of the party, many friends, changed jobs often because he got bored, spent money as soon as he got it, but never in trouble. When stressed, he went out with friends.' Write a brief premorbid personality.", "a": "Social: outgoing, wide circle of friends. Mood: generally cheerful, energetic. Work: restless, frequent job changes from boredom. Money: impulsive spending. Stress: seeks company. No forensic history. Impression: extraverted, hyperthymic traits; note in formulation as possibly relevant if a mood disorder is suspected." }
  ]
}
:::

:::clinician
Personality assessment during an acute episode is unreliable (state contamination); use long-standing informants and examples from well periods, and defer a personality disorder diagnosis unless the pattern is clearly long-standing. For trauma history, ask in a graded, consent-based way and only to the depth clinically needed; record what was disclosed factually, and if there is a current risk to a child, follow POCSO reporting duties (see the Ethics and law module). Developmental history in adult patients is often unknown; write "not known" rather than leaving it blank. For women, record perinatal history in detail: postpartum onset is a specifier with treatment and prevention implications, and the risk of postpartum psychosis after a previous episode or with bipolar disorder is high enough to plan future pregnancies.
:::

:::recall
1. List the main areas of personal history. || Birth, development, childhood, schooling, work, menstrual and obstetric, sexual and marital, social circumstances, religion and culture, forensic, leisure.
2. Name the headings of premorbid personality. || Social relations, leisure, predominant mood, attitudes to self and others, work and responsibility, moral and religious standards, fantasy life, reaction to stress, habits.
3. Why get premorbid personality from an informant? || The patient's current illness colours their self-description; a long-standing informant gives the baseline.
:::

:::mcq
Q: Which belongs in personal history?
- Mother treated for depression
- *Repeated Class 7 after frequent absences
- Hearing voices for one month
- Today speaks slowly
> Schooling is personal history.

Q: A patient's usual way of coping with stress before the illness belongs under:
- HPI
- MSE
- *Premorbid personality
- Investigations
> Reaction to stress is a premorbid personality heading.
:::

## 2.5 Physical examination, the MSE write-up and investigations [core][beginner]
### Physical examination
Psychiatric patients have higher rates of physical illness, and many physical illnesses cause psychiatric symptoms. Record at least:
- **Vital signs**: pulse, blood pressure, temperature, respiratory rate.
- **Weight, height, BMI, waist** (important before and during antipsychotics).
- **General**: pallor, jaundice, thyroid swelling, signs of self-harm (scars, fresh cuts), injection marks, signs of alcohol use, nutritional state.
- **Systemic**: cardiovascular, respiratory, abdominal and a **neurological** screen (pupils, tone, reflexes, gait, tremor, abnormal movements, cerebellar signs).


:::widget reveal
{
 "prompt": "Why should waist circumference, not just weight, be recorded before starting an antipsychotic?",
 "answer": "Waist size reflects abdominal fat, which predicts diabetes and heart disease better than weight alone. South Asians carry higher metabolic risk at lower BMI, so waist and fasting glucose or HbA1c and lipids give an earlier warning."
}
:::

:::example A relevant physical finding
"Fine tremor of outstretched hands, tachycardia 112 per minute, sweating, smell of alcohol; no jaundice; no flapping tremor; tandem gait unsteady." This one line changes the plan: it suggests alcohol withdrawal and possible cerebellar involvement.
:::


:::widget build
{
 "vignette": "Ms P, 26, is about to start lithium for bipolar disorder. You must record the baseline investigations in her case sheet.",
 "rule": "Tick the investigations that are essential before starting lithium. At least four, including kidney function and pregnancy status.",
 "symptoms": [
  {
   "label": "Kidney function and electrolytes",
   "present": true,
   "core": true,
   "why": "Lithium is cleared only by the kidneys."
  },
  {
   "label": "Thyroid function",
   "present": true,
   "why": "Lithium can cause hypothyroidism."
  },
  {
   "label": "Calcium",
   "present": true,
   "why": "Lithium can raise calcium through the parathyroid glands."
  },
  {
   "label": "Pregnancy test",
   "present": true,
   "core": true,
   "why": "Plan carefully if pregnant or planning pregnancy."
  },
  {
   "label": "ECG where indicated",
   "present": true,
   "why": "Baseline in older adults or with heart disease."
  },
  {
   "label": "Routine brain MRI",
   "present": false,
   "why": "Not needed without neurological or atypical features."
  }
 ],
 "need": 4,
 "needCore": true,
 "verdict": "Kidney function, thyroid, calcium and pregnancy status (with ECG where indicated) are the core baseline. Write each with its reason, then plan the first lithium level after about five days at a steady dose."
}
:::

### Writing the MSE
The MSE is written under eight headings, describing what you saw and heard **today**. The detailed technique, the confusable pairs and model write-ups are in **The MSE in depth** module. In the case sheet, keep each heading short, descriptive, and with the patient's words where useful:
1. **General appearance and behaviour**
2. **Speech**
3. **Mood** (subjective, in the patient's words) and **affect** (objective)
4. **Thought** (stream, form, content, possession)
5. **Perception**
6. **Cognitive functions** (consciousness, orientation, attention, memory, intelligence, abstraction)
7. **Insight** (with grade)
8. **Judgement** (personal, social, test)


:::widget flow
{
 "title": "The eight MSE headings, in order",
 "layout": "chain",
 "nodes": [
  {
   "id": "1",
   "label": "Appearance and behaviour"
  },
  {
   "id": "2",
   "label": "Speech"
  },
  {
   "id": "3",
   "label": "Mood and affect",
   "detail": "Mood in the patient's words; affect as you observe it."
  },
  {
   "id": "4",
   "label": "Thought",
   "detail": "Stream, form, content, possession."
  },
  {
   "id": "5",
   "label": "Perception"
  },
  {
   "id": "6",
   "label": "Cognition"
  },
  {
   "id": "7",
   "label": "Insight",
   "detail": "Describe and grade."
  },
  {
   "id": "8",
   "label": "Judgement",
   "detail": "Personal, social, test."
  }
 ],
 "caption": "A snapshot of now. Anything the patient tells you about the past belongs in the history instead."
}
:::

### Investigations: say why
Do not write a list of tests. Write each with its **reason**:
| Investigation | Typical reason |
|---|---|
| Complete blood count | Anaemia, infection; baseline before clozapine or carbamazepine |
| Thyroid function | Depression, anxiety, mania, lithium baseline |
| Liver and kidney function | Alcohol, before lithium or valproate, dosing |
| Blood sugar and lipids | Before and during antipsychotics |
| Vitamin B12, folate | Depression, cognitive decline, vegetarian diets |
| Electrolytes, especially sodium | Confusion, older adults on SSRIs |
| Urine drug screen | Suspected substance-induced psychosis |
| ECG | Before medicines that prolong QT, older adults, cardiac history |
| Pregnancy test | Women of child-bearing age before medicines like valproate |
| HIV, syphilis serology | Risk factors, atypical presentations |
| EEG | Episodic disturbances, suspected seizures or delirium |
| CT or MRI | Late onset, neurological signs, cognitive decline (see Brain and behaviour, Section 3.4) |
| Psychological testing | IQ, personality, neuropsychological assessment, with the question to be answered |

:::widget sort
{
  "prompt": "Which investigation is most important for each case?",
  "buckets": ["Thyroid function", "Pregnancy test", "Sodium level", "Urine drug screen", "ECG"],
  "items": [
    { "text": "Woman, 24, with bipolar disorder before starting valproate", "bucket": 1 },
    { "text": "Man, 20, with sudden paranoia after a party weekend", "bucket": 3 },
    { "text": "Woman, 78, newly confused after starting escitalopram", "bucket": 2 },
    { "text": "Man, 55, with heart disease, before starting a high dose of citalopram", "bucket": 4 },
    { "text": "Woman, 40, slow, cold, low and gaining weight", "bucket": 0 }
  ]
}
:::

:::clinician
Physical health monitoring in severe mental illness is a major gap: people with schizophrenia and bipolar disorder die 15 to 20 years earlier, mostly from cardiovascular and metabolic disease. Record baseline and follow-up weight, waist, blood pressure, fasting glucose or HbA1c and lipids for antipsychotics (at baseline, about three months and then yearly, more often for clozapine and olanzapine). Clozapine requires neutrophil monitoring (weekly at first) and awareness of myocarditis early in treatment (troponin and CRP in the first month in many protocols). Lithium requires renal, thyroid and calcium monitoring. Valproate in women and girls of child-bearing potential requires documented counselling and a pregnancy prevention plan (UK MHRA and EMA rules; increasingly adopted as good practice in India). Write the clinical question for every psychological test referral, as covered in the Assessment module.
:::

:::recall
1. Which physical measurements are essential before antipsychotics? || Weight, height, BMI, waist, blood pressure, plus fasting glucose and lipids.
2. Name the eight MSE headings. || Appearance and behaviour; speech; mood and affect; thought; perception; cognition; insight; judgement.
3. Why write a reason beside each investigation? || To show clinical reasoning and avoid unnecessary tests.
:::

:::mcq
Q: The most important baseline test in a 26-year-old woman before starting valproate is:
- EEG
- *A pregnancy test, with counselling about contraception
- Urine drug screen
- Vitamin D
> Valproate is highly teratogenic.

Q: In the case sheet, the MSE should describe:
- The whole illness history
- *What is observed and elicited in today's interview
- The family's opinion
- The diagnosis only
> A snapshot of now.
:::

## 2.6 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: The HPI should begin with:
- The diagnosis
- *The last time the patient was well
- Family history
- The MSE
> Start the story at the last well point.

Q: Precipitating events should be written as:
- Definite causes
- *Temporal associations
- Irrelevant
- Part of the MSE
> Avoid claiming causation in history.

Q: Sleep, appetite, weight, energy and libido are grouped as:
- Premorbid personality
- *Biological functions
- Family history
- Cognitive functions
> They belong in the HPI.

Q: The record of a past antidepressant trial must include:
- Only its name
- *Name, dose, duration, response, side effects, adherence and reason stopped
- Only its price
- Only the prescriber's name
> These establish adequacy.

Q: Where should a drug allergy be written?
- Only in the nursing notes
- *Prominently in treatment history and on the front of the record
- In the family history
- Nowhere
> Visible and repeated.

Q: Which is a dependence feature to record in substance history?
- Age of father
- *Withdrawal symptoms relieved by drinking
- School marks
- Religion
> Withdrawal is a dependence feature.

Q: In a genogram, a circle represents:
- A male
- *A female
- A deceased person
- The patient
> Circle for female.

Q: Consanguinity is shown by:
- A dotted line
- *A double line between partners
- A cross
- Shading
> Double partner line.

Q: Why should a genogram never rely on colour alone?
- Colours are expensive
- *Copies and colour-blind readers lose the meaning; shapes and written labels must carry it
- It is illegal
- Colour is too bright
> Use shapes, lines and labels.

Q: Menarche and postpartum illness are recorded in:
- Family history
- *Personal history (menstrual and obstetric)
- MSE
- Formulation
> Part of the life story.

Q: Premorbid personality should ideally be obtained from:
- The patient alone during the acute illness
- *The patient and a long-standing informant
- Hospital records only
- A personality test only
> Informants give the baseline.

Q: A tremor, tachycardia and sweating in a heavy drinker belong in the:
- *Physical examination
- Premorbid personality
- Chief complaints only
- Family history
> Examination findings.

Q: Which investigation is especially important in an older adult newly confused on an SSRI?
- Lipids
- *Serum sodium
- HIV test
- EEG first
> SSRI-related hyponatraemia.

Q: Insight in the MSE should be recorded:
- As present or absent only
- *With a description and grade
- Only in the formulation
- Not at all
> Grade and describe.

Q: "Before the illness she was sociable and confident" belongs in:
- *Premorbid personality
- MSE
- HPI
- Investigations
> Baseline personality.
:::
`;
