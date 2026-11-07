import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { advanced } from "./antipsychotics-2";
import { examZone } from "./antipsychotics-3";

export const meta: ModuleMeta = {
  id: "antipsychotics",
  num: 11,
  title: "Antipsychotics",
  emoji: "🧠",
  tagline: "From what psychosis does to dopamine, to every class, its risks and clozapine, to receptor occupancy, muscarinic drugs and the newest injections",
  when: "Psychopharmacology",
  outcomes: [
    "Explain in plain words what psychosis is, what dopamine does, and how an antipsychotic travels from a tablet or injection to the brain",
    "Link each dopamine pathway to a benefit or side effect, and compare first and second generation antipsychotics with Indian brands and typical doses",
    "Recognise and treat dystonia, akathisia, parkinsonism, tardive dyskinesia and NMS, and tell NMS from serotonin syndrome",
    "Use clozapine, long-acting injections and rapid tranquillisation safely, with physical health, QT and metabolic monitoring",
    "Explain D2 occupancy, partial agonism, 5-HT2A and muscarinic mechanisms, CYP1A2 and smoking, treatment resistance and the newest US approvals",
  ],
  writeTask:
    "On paper, from memory: the four dopamine pathways with what blocking each does; a table of eight antipsychotics (class, receptor highlights, Indian brand, typical dose, two key side effects); the four movement side effects with timing and treatment; NMS against serotonin syndrome; the clozapine start-up and monitoring checklist with the smoking rule; and the occupancy window. Then check and correct in red.",
  activities: [
    act.lesson("ap-1", "Quiz: typical vs atypical", "Classes and side-effect profiles."),
    act.lesson("ap-2", "Quiz: clozapine and NMS", "The emergencies."),
    act.scenarios("antipsychotics", "Patient case: “I can't sit still”", "Spotting akathisia before it becomes a crisis."),
    act.detective("Clinic detective", "Guess the medicine from its clues."),
  ],
  noteId: "antipsychotics",
};

const p1 = String.raw`

# Part 0 · Starting: psychosis, dopamine and how the medicine gets there

## 0.1 What psychosis is, in plain words [core][starting]
**Psychosis** means losing touch with shared reality. The person is not "mad" or "possessed". Their brain is giving them experiences and beliefs that feel completely real to them but that others cannot share.

The two headline experiences are:
- **Hallucinations**: hearing, seeing or feeling things that are not there. Hearing voices is the commonest.
- **Delusions**: fixed, false beliefs held with total certainty, which do not fit the person's culture, and do not change with evidence. "The neighbours have put a camera in my wall." "I have been chosen to save India."

Alongside these, many people lose drive, warmth and pleasure, talk less and withdraw. These quieter changes are called **negative symptoms**. Many also have trouble concentrating and remembering: **cognitive symptoms**.

:::sounds How it can sound in a clinic
"Didi, they talk about me on the TV news, they know what I'm thinking." "The voice tells me I'm useless, all day." "I don't feel like doing anything. Sab bekaar lagta hai."
:::

| Group of symptoms | What you notice | How well antipsychotics help |
|---|---|---|
| Positive | Voices, delusions, disorganised speech | Usually well |
| Negative | Low drive, flat emotion, withdrawal | Only a little |
| Cognitive | Poor attention, memory, planning | Little |
| Mood and anxiety | Fear, low mood | Partly |

:::widget sort
{"prompt": "Positive, negative or cognitive symptom? Place each card.", "buckets": ["Positive", "Negative", "Cognitive"], "items": [{"text": "Hears a voice commenting on everything she does", "bucket": 0}, {"text": "Sits for hours without starting anything", "bucket": 1, "why": "Loss of drive (avolition) is a negative symptom: something normal is missing."}, {"text": "Believes the electricity board is reading his thoughts", "bucket": 0}, {"text": "Cannot keep a phone number in mind long enough to dial it", "bucket": 2, "why": "Working memory problems are cognitive symptoms."}, {"text": "Face shows little emotion, voice is flat", "bucket": 1}, {"text": "Speech jumps between unrelated topics", "bucket": 0, "why": "Disorganised speech is grouped with the positive symptoms."}, {"text": "Struggles to plan a simple bus journey", "bucket": 2}]}
:::

:::recall
1. What does psychosis mean in plain words? || Losing touch with shared reality: hallucinations and delusions that feel completely real.
2. Define a delusion. || A fixed, false belief held with certainty, not explained by culture, and not changed by evidence.
3. Name the three main groups of symptoms in schizophrenia. || Positive, negative, cognitive.
4. Which group do antipsychotics help most? || Positive symptoms.
:::

:::mcq
Q: A young man has stopped bathing, no longer meets friends and shows little emotion, but has no voices or unusual beliefs now. These are mainly:
- Positive symptoms
- *Negative symptoms
- Side effects only
- Mania
> Something normal is missing: drive, emotion, social contact.
:::

## 0.2 Dopamine: the brain's "this matters" signal [core][starting]
**Dopamine** is a messenger made by small groups of cells deep in the midbrain. It does several jobs, depending on where its fibres go: movement, motivation, reward, and a job called **salience**: marking things as important and worth attention.


:::widget release
{
 "transmitter": "dopamine",
 "title": "Too much dopamine, then a blocker",
 "caption": "Pick Amphetamine and play: the pump runs backwards and floods the gap with dopamine even without a signal. Repeated high doses can produce psychosis in healthy people, one of the clues behind the dopamine idea. Now pick Antagonist: dopamine is still released, but it cannot reach the receptor. That is, in one picture, what every older antipsychotic does."
}
:::

### The dopamine idea of psychosis
When dopamine is released in the wrong amounts in the wrong place, ordinary things can feel strangely important. A stranger's cough, a car number plate, a news headline all seem to carry a message. The mind then builds an explanation to make sense of this odd feeling of importance. That explanation becomes a delusion. Inner thoughts that feel strangely loud and foreign may be experienced as voices.

:::analogy A faulty highlighter
Normally dopamine is a highlighter pen that marks only what truly matters. In psychosis the highlighter leaks: everything gets marked. The person then tries to understand why all these random things feel so meaningful.
:::

:::widget flow
{"title": "How too much dopamine can turn into a delusion", "layout": "chain", "nodes": [{"id": "d1", "label": "Stress, genes, cannabis, early life", "detail": "Many risk factors together make the dopamine system over-sensitive. No single cause."}, {"id": "d2", "label": "Too much dopamine released", "detail": "Brain scans show more dopamine is made and released in the striatum of people with psychosis, especially before a first episode."}, {"id": "d3", "label": "Random things feel important", "detail": "A look, a sound or a coincidence is tagged as deeply significant. This is aberrant salience."}, {"id": "d4", "label": "The mind seeks an explanation", "detail": "Feeling that something is going on, the person looks for a reason. Culture, fears and past experiences shape the story."}, {"id": "d5", "label": "A delusion forms", "detail": "'The neighbours are watching me' explains the strange feeling. Once formed, it bends new evidence to fit."}], "caption": "Press Play. Antipsychotics act at step 2 to 3: they quieten the dopamine signal, so new things stop feeling so charged. Old beliefs then fade slowly, often with help from therapy."}
:::

:::widget figure
{"id": "antipsychotic-d2"}
:::

### What an antipsychotic does, in one sentence
Almost every antipsychotic **blocks dopamine D2 receptors**, the locks that dopamine fits into. With the locks partly blocked, the over-loud dopamine signal is turned down.

:::widget receptor
{"receptor": "D2", "title": "Dopamine's D2 lock: three ways a medicine can sit in it", "caption": "Dopamine is the full agonist. Haloperidol, risperidone and olanzapine act as antagonists: they block the lock. Aripiprazole is a partial agonist: it turns the lock about a third of the way on. Notice how a partial agonist lowers the signal when dopamine is high, but keeps some signal when dopamine is low."}
:::

:::recall
1. Name three jobs dopamine does. || Movement, motivation and reward, salience (marking what matters).
2. What is aberrant salience? || Ordinary things feeling strangely important because of excess dopamine signalling.
3. What does almost every antipsychotic do? || Blocks dopamine D2 receptors (some are partial agonists).
:::

:::mcq
Q: Which statement about dopamine and psychosis is most accurate?
- Psychosis is caused only by too little dopamine
- *Excess dopamine release in the striatum can make random things feel meaningful, feeding delusions
- Dopamine controls only movement
- Antipsychotics raise dopamine
> The salience idea links the biology to the experience.
:::

## 0.3 How an antipsychotic reaches the brain: tablet, injection or depot [core][starting]
An antipsychotic can be given in several ways. Each way changes how fast it works, how steady the level is, and what can go wrong.

:::widget journey
{"drug": "olanzapine", "target": "dopamine D2 and serotonin 2A receptors in the striatum and cortex", "routes": ["oral", "depot"], "notes": {"mouth": "An olanzapine tablet (or a melt-in-the-mouth version that dissolves on the tongue) is swallowed.", "gut": "It is absorbed well; food makes little difference. Levels peak about five to eight hours later.", "liver": "On its first pass about 40% is broken down, mostly by the enzyme CYP1A2. Tobacco smoke speeds this enzyme up, so smokers need higher doses.", "muscle": "The monthly olanzapine depot is injected deep into the buttock muscle. A newer once-a-month version is injected under the skin of the belly or arm.", "slow": "The medicine leaks out of the muscle reservoir over weeks. Rarely, a little escapes into the blood too fast after the muscle injection and causes heavy sleepiness and confusion, so patients are watched for some hours afterwards.", "blood": "Most of the drug is carried on blood proteins. Only the free part crosses into the brain.", "bbb": "Olanzapine is fat-soluble and crosses easily.", "out": "The liver changes it into inactive products removed by kidneys and gut. Half is gone in about one and a half days, so once a day is enough."}, "caption": "Switch between Tablet and Depot injection. The tablet gives a daily peak and trough; the depot gives a steady level that keeps going even if the person forgets."}
:::

| Way given | How fast it works | Good for | Watch for |
|---|---|---|---|
| Tablet or melt | Hours; full benefit takes longer | Most people | Missed doses |
| Liquid | Hours | Swallowing problems, checking that it is taken | Measuring the dose |
| Injection into muscle (short-acting) | Minutes to an hour | Severe agitation | Dystonia, low blood pressure, breathing (with benzodiazepines) |
| Long-acting depot | Builds over days to weeks, lasts weeks to months | Relapses after stopping tablets; personal choice | Injection-site pain; cannot be removed quickly if side effects |

:::widget guess
{"prompt": "A long-acting antipsychotic injection is often given once every how many weeks? (Pick the most common interval.)", "min": 1, "max": 26, "unit": "weeks", "answer": [2, 4], "reveal": "Most depots are given every 2 to 4 weeks. Some newer ones last longer: paliperidone has versions given every 3 months and every 6 months, and aripiprazole has a version given every 2 months.", "clinician": "Haloperidol decanoate every 4 weeks; fluphenazine decanoate every 2 to 5 weeks; flupentixol decanoate every 2 to 4 weeks; zuclopenthixol decanoate every 1 to 4 weeks; paliperidone palmitate monthly, 3-monthly or 6-monthly; aripiprazole monthly or 2-monthly."}
:::

:::recall
1. Name four ways an antipsychotic can be given. || Tablet or melt, liquid, short-acting injection, long-acting depot.
2. Why does smoking change olanzapine and clozapine levels? || Tobacco smoke speeds up the liver enzyme CYP1A2, so levels fall.
3. Who might prefer a depot? || People who relapse after stopping tablets, or who find daily tablets hard and choose an injection.
:::

:::mcq
Q: Which statement about long-acting injections is TRUE?
- They work within minutes
- *They give steady levels for weeks, but cannot be removed quickly if side effects occur
- They have no side effects
- They are only for violent patients
> Steady levels help adherence; the trade-off is that the dose cannot be taken back.
:::

## 0.4 What antipsychotics do and don't do, and the side effects people notice [core][starting]
### What they do
- Reduce voices, delusions and disorganisation, often within days to weeks.
- Calm fear and agitation that come with psychosis.
- Prevent relapse when continued.
- Treat mania, and some help bipolar depression, severe agitation, delirium and Tourette's.

### What they don't do
- They do not "knock people out" when used well, and they do not change personality.
- They are not addictive.
- They help negative and cognitive symptoms only a little. Rehabilitation, family work and therapy matter a lot for these.

:::widget guess
{"prompt": "After stopping antipsychotics following a first episode of psychosis, roughly what percentage of people relapse within a few years?", "min": 0, "max": 100, "unit": "%", "answer": [70, 90], "reveal": "Around 4 in 5 in older studies, over about five years. Continuing medicine roughly halves the risk of relapse. People still have the right to make an informed choice, and some do stay well off medicine.", "clinician": "In a well-known five-year follow-up of first-episode patients, cumulative relapse was about 80%, and stopping medicine raised the risk of relapse about fivefold. Trials of guided dose reduction after a first episode show more early relapses but mixed long-term functional results, so this remains an informed, shared decision."}
:::


:::widget receptor
{
 "receptor": "alpha-1",
 "title": "Dizziness on standing: an alpha-1 story",
 "caption": "Noradrenaline at alpha-1 receptors tightens blood vessels so blood pressure holds when you stand up. Pick Antagonist: that is chlorpromazine, clozapine, quetiapine or risperidone early on. The vessels cannot tighten in time, so the person feels faint on rising. Start low, rise slowly, and teach the person to sit up before standing."
}
:::

### The side effects people notice
| What the person notices | Plain explanation |
|---|---|
| Stiffness, shaking, slowness | Dopamine blocked in the movement circuit |
| Restless legs, can't sit still | A movement side effect called akathisia |
| Weight gain, hunger | Histamine and serotonin 2C receptors blocked, plus effects on sugar and fat |
| Sleepiness | Histamine receptors blocked |
| Missed periods, breast milk, low sex drive | Prolactin rises when dopamine is blocked at the pituitary |
| Dizziness on standing | Alpha-1 receptors blocked: blood pressure drops |
| Dry mouth, constipation | Acetylcholine (muscarinic) receptors blocked |

:::widget decide
{"scene": "Rahul, 23, from a village near Nashik, started risperidone two months ago for his first episode of psychosis. The voices have stopped. His mother calls: 'He says the tablets make him feel like a zombie and his body is stiff. He has stopped taking them since four days. The baba at the temple says he needs a ritual, not medicine.' You are the team's psychology trainee.", "ask": "What do you do?", "choices": [{"label": "Tell her the baba is wrong and Rahul must take the tablets or he will be admitted", "verdict": "harm", "outcome": "The family feels judged and stops coming to the clinic.", "why": "Confrontation ignores the real side effects and the family's beliefs. It loses the relationship that keeps him safe."}, {"label": "Take his side effects seriously, explain kindly that stopping suddenly raises relapse risk, and arrange an early review with the psychiatrist to adjust the dose or change the medicine; respect that the family may also use prayer", "verdict": "best", "outcome": "The psychiatrist lowers the dose and later switches to aripiprazole. The stiffness goes. Rahul keeps visiting the temple with his mother and stays well.", "why": "Side effects are the commonest reason people stop. Listening, quick action and respect for culture protect both the relationship and his recovery."}, {"label": "Say nothing; it is his choice", "verdict": "ok", "outcome": "His choice is respected, but no one tells the team. Two months later the voices return.", "why": "Autonomy matters, but he deserved accurate information and a chance to fix the side effects first."}]}
:::

:::note This is a place to learn
This platform teaches pharmacology. It is not a prescribing service. Doses shown are for learning; always check current guidelines and the prescriber's advice.
:::

:::recall
1. Name three things antipsychotics do well. || Reduce positive symptoms, calm agitation, prevent relapse (also treat mania).
2. Which symptoms do they help only a little? || Negative and cognitive symptoms.
3. Which hormone rises when dopamine is blocked at the pituitary? || Prolactin.
4. What is the commonest reason people stop antipsychotics? || Side effects (also poor insight, stigma, cost).
:::

:::mcq
Q: A woman on an antipsychotic notices milk from her breasts and missed periods. The likely cause is:
- Pregnancy only
- *Raised prolactin from dopamine block at the pituitary
- Weight gain
- Too little medicine
> Check pregnancy too, but think prolactin first.
:::

## 0.5 Level check · Starting [starting]
Twelve or more right out of fifteen (80%) opens the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: Hearing a voice that no one else hears is a:
- Delusion
- *Hallucination
- Negative symptom
- Side effect
> A perception without a stimulus.

Q: A fixed false belief held with total certainty is a:
- Hallucination
- *Delusion
- Obsession
- Phobia
> It is not explained by culture and does not change with evidence.

Q: Loss of drive, flat emotion and social withdrawal are:
- Positive symptoms
- *Negative symptoms
- Cognitive symptoms
- Akathisia
> Something normal is missing.

Q: The receptor blocked by almost all antipsychotics is:
- Serotonin 5-HT3
- Histamine H1
- *Dopamine D2
- GABA-A
> D2 block is the common thread.

Q: Aripiprazole at the D2 receptor is a:
- Full agonist
- *Partial agonist
- Pure antagonist
- Enzyme blocker
> It turns the receptor partly on.

Q: Aberrant salience means:
- Hearing voices
- *Ordinary things feeling strangely important
- Feeling sleepy
- Being unable to move
> Excess dopamine marks random things as meaningful.

Q: Which group of symptoms do antipsychotics help most?
- Negative
- Cognitive
- *Positive
- All equally
> Voices and delusions respond best.

Q: Smoking tobacco lowers the level of which antipsychotic most?
- Aripiprazole
- *Clozapine
- Amisulpride
- Paliperidone
> Smoke speeds up CYP1A2, which clears clozapine and olanzapine.

Q: A long-acting injection is most useful when:
- The person takes tablets reliably and prefers them
- *The person relapses after stopping tablets, or chooses an injection
- The person has never been ill
- Rapid calming is needed in minutes
> It covers missed doses for weeks.

Q: Stiffness and shaking on an antipsychotic come from dopamine block in the:
- Pituitary
- *Movement circuit
- Gut
- Heart
> The nigrostriatal pathway controls movement.

Q: Weight gain and sleepiness on many antipsychotics come mainly from blocking:
- Dopamine
- *Histamine H1 (with serotonin 2C for appetite)
- GABA
- Sodium channels
> H1 block: sleepy and hungry.

Q: A restless inner feeling with an urge to keep moving is called:
- Dystonia
- *Akathisia
- Tardive dyskinesia
- Catatonia
> It can be mistaken for agitation.

Q: Which is TRUE about antipsychotics?
- They are addictive
- They change personality
- *Continuing them lowers the risk of relapse
- They cure negative symptoms
> About half the relapse risk when continued.

Q: Which pituitary hormone rises with dopamine block?
- Insulin
- *Prolactin
- Thyroid hormone
- Growth hormone
> Dopamine normally holds prolactin down.

Q: The best first response when a client says side effects made them stop their antipsychotic is:
- Tell them they must restart today
- *Listen, explain the relapse risk, and link them back to the prescriber quickly
- Suggest a different dose yourself
- Ignore it
> Side effects can usually be fixed.
:::

# Part I · How they work

## 1.1 Dopamine pathways [core][beginner]
Dopamine travels along four main pathways. An antipsychotic blocks D2 receptors in all of them at once, but we only want the effect in one. That single fact explains most of the benefit and many of the side effects.

| Pathway | Runs from and to | Normal role | Effect of D2 blockade |
|---|---|---|---|
| **Mesolimbic** | Ventral tegmental area (VTA) to the nucleus accumbens and limbic areas | Reward, salience | **Reduces positive symptoms** (intended); may dull pleasure and motivation |
| **Mesocortical** | VTA to the prefrontal cortex | Cognition, motivation | May **worsen negative and cognitive symptoms** |
| **Nigrostriatal** | Substantia nigra to the striatum | Movement | **Extrapyramidal side effects** (dystonia, parkinsonism, akathisia, tardive dyskinesia) |
| **Tuberoinfundibular** | Hypothalamus to the pituitary | Dopamine inhibits prolactin | **Raised prolactin** (galactorrhoea, amenorrhoea, sexual dysfunction, bone loss) |

:::widget pathways
{"system": "dopamine", "title": "Block D2 and watch all four pathways change", "caption": "First pick each pathway with nothing added. Then press 'Add a D2 blocker' (a first-generation drug such as haloperidol) and tap each pathway again. Finally add serotonin 2A block (a second-generation drug) and see which pathways are rescued."}
:::

:::widget figure
{"id": "d2-occupancy"}
:::

### Why second-generation drugs differ
- Most second-generation (atypical) drugs block **serotonin 5-HT2A** as well as D2. Serotonin acting at 5-HT2A normally brakes dopamine release in the striatum and cortex. Block that brake and a little more dopamine is released in exactly the places we did not want to block: **fewer movement side effects** and less prolactin rise (except risperidone, paliperidone and amisulpride).
- Many also block H1 (sedation, weight gain), muscarinic (anticholinergic effects) and alpha-1 receptors (dizziness on standing), and affect insulin and lipids: hence **metabolic side effects**.

:::widget brainmap
{"title": "Where the four pathways start and finish", "focus": ["brainstem", "basal-ganglia", "prefrontal", "hypothalamus", "amygdala", "hippocampus"], "notes": {"brainstem": "The midbrain holds the two dopamine sources: the VTA (for the mesolimbic and mesocortical pathways) and the substantia nigra (for movement).", "basal-ganglia": "The striatum. Its lower front part (nucleus accumbens) is the mesolimbic target, where excess dopamine fuels psychosis; its upper part is the nigrostriatal target that controls movement.", "prefrontal": "The mesocortical target. Too little dopamine here may underlie negative and cognitive symptoms, so blocking it further can worsen them.", "hypothalamus": "Start of the tuberoinfundibular pathway, whose dopamine flows to the pituitary to hold prolactin down.", "amygdala": "A limbic target of mesolimbic fibres, tagging things with emotional weight.", "hippocampus": "Overactive in early psychosis; its output drives the VTA to release more dopamine."}, "caption": "Tap each region. The same drug reaches all of them, which is why one tablet can calm voices and stiffen the hands."}
:::

:::define The therapeutic window
About **65 to 80% D2 occupancy** gives an antipsychotic effect; prolactin rises from about 70%; above about **80%** movement side effects become common. More dose is not more benefit.
:::

:::recall
1. Name the four dopamine pathways and the effect of D2 blockade in each. || Mesolimbic: fewer positive symptoms; mesocortical: negative and cognitive worsening; nigrostriatal: EPS; tuberoinfundibular: raised prolactin.
2. What D2 occupancy is therapeutic, and above what do EPS rise? || About 65 to 80%; above about 80%.
3. Why do most second-generation drugs cause fewer EPS? || 5-HT2A blockade releases dopamine in the striatum, partly offsetting D2 block there.
4. Which three second-generation drugs still raise prolactin a lot? || Risperidone, paliperidone, amisulpride.
:::

:::mcq
Q: A young woman on risperidone stops having periods and notices milk from her breasts. The pathway responsible is:
- Mesolimbic
- Mesocortical
- Nigrostriatal
- *Tuberoinfundibular
> Dopamine normally holds prolactin down; blocking it raises prolactin.

Q: Amisulpride raises prolactin strongly despite being "second generation" mainly because:
- It blocks 5-HT2A strongly
- *It has little 5-HT2A action and crosses poorly into the brain, so the pituitary (outside the barrier) sees much more drug than the brain
- It is a partial agonist
- It is a histamine blocker
> The pituitary sits outside the blood-brain barrier.
:::

## 1.2 The drugs [core][beginner]
### First generation (typical)
| Drug (Indian brands) | Potency | Notes |
|---|---|---|
| Haloperidol (Serenace, Senorm) | High | Many movement side effects, little sedation; tablets, short-acting injection and decanoate depot; used in delirium and acute agitation |
| Trifluoperazine (Espazine; Trinicalm with trihexyphenidyl) | High | Movement side effects; cheap, widely used in India |
| Fluphenazine (Prolinate depot) | High | Depot form |
| Chlorpromazine (Largactil, Megatil) | Low | Sedation, dizziness on standing, anticholinergic effects, sun sensitivity, weight gain; fewer movement side effects |
| Flupentixol, zuclopenthixol (Fluanxol, Clopixol) | Medium | Depots |

:::mnemonic High versus low potency
High potency (haloperidol): **H**igh EPS, low sedation. Low potency (chlorpromazine): low EPS, **high sedation and anticholinergic** effects.
:::

### Second generation (atypical)
| Drug (Indian brands) | Strengths | Main concerns |
|---|---|---|
| Risperidone (Risdone, Sizodon), paliperidone (Invega) | Effective; tablets, liquid and depots | **Prolactin rise**, EPS at higher doses |
| Olanzapine (Oleanz, Olace, Olimelt) | Effective; sedating; melt and injection | **Weight gain, diabetes, lipids** (high) |
| Quetiapine (Qutipin, Seroquin) | Sedating; bipolar depression | Weight, sedation, dizziness; little EPS or prolactin |
| Aripiprazole (Arip MT, Aripra) | Partial agonist; weight-friendly; lowers prolactin | **Akathisia**, insomnia, nausea |
| Amisulpride (Amipride, Sulpitac) | Effective; low doses help negative symptoms | Prolactin rise; cleared by the kidneys |
| Lurasidone (Lurasid, Latuda) | Low metabolic risk; bipolar depression | Take with a meal; akathisia |
| Ziprasidone | Low metabolic risk | QT prolongation; take with food |
| Cariprazine, brexpiprazole | Partial agonists | Akathisia (cariprazine); weight (brexpiprazole, mild) |
| **Clozapine** (Sizopin, Skizoril, Lozapin) | Most effective; treatment resistance; lowers suicidal behaviour | Low neutrophils, myocarditis, seizures, constipation (see 3.1) |

:::widget sort
{"prompt": "Which side effect is each antipsychotic best known for?", "buckets": ["Movement side effects", "Weight and diabetes", "Raised prolactin", "Akathisia with little weight gain"], "items": [{"text": "Haloperidol", "bucket": 0}, {"text": "Olanzapine", "bucket": 1}, {"text": "Risperidone at 6 mg", "bucket": 2, "why": "Risperidone and its metabolite paliperidone raise prolactin most among the atypicals."}, {"text": "Aripiprazole", "bucket": 3}, {"text": "Clozapine", "bucket": 1, "why": "Clozapine shares olanzapine's high metabolic risk, plus many other risks."}, {"text": "Amisulpride", "bucket": 2}, {"text": "Trifluoperazine", "bucket": 0}, {"text": "Cariprazine", "bucket": 3}]}
:::

:::student
### Typical adult daily doses for schizophrenia (for learning; check current guidelines)
These ranges help you understand prescriptions. They are not advice for anyone to take or change a medicine.

| Medicine | Typical adult daily range |
|---|---|
| Haloperidol | 2 to 10 mg |
| Risperidone | 2 to 6 mg |
| Olanzapine | 10 to 20 mg |
| Quetiapine | 300 to 750 mg |
| Aripiprazole | 10 to 30 mg |
| Amisulpride | 400 to 800 mg (lower doses for negative symptoms) |
| Lurasidone | 37 to 148 mg with food |
| Clozapine | 200 to 450 mg (up to 900 mg) |
:::

:::clinician
### Oral antipsychotic dosing (for learning; check current guidelines)
| Medicine | Indian brands | Start | Usual | Maximum | Receptor highlights | Titration and notes |
|---|---|---|---|---|---|---|
| Haloperidol | Serenace, Senorm | 1.5 to 2 mg | 2 to 10 mg | 20 mg | D2 antagonist, little else | Minimum effective about 2 mg (first episode), 4 mg (multi-episode); EPS above about 10 mg; ECG with IV use |
| Chlorpromazine | Largactil, Megatil | 25 to 75 mg | 300 to 600 mg | 1000 mg | D2, H1, M1, alpha-1 | Postural drop, photosensitivity, cholestatic jaundice; raise slowly |
| Trifluoperazine | Espazine | 5 mg twice | 10 to 20 mg | 20 mg | D2 high potency | Fixed combinations with trihexyphenidyl are common: avoid routine anticholinergics |
| Risperidone | Risdone, Sizodon, Respidon | 1 to 2 mg | 2 to 6 mg | 16 mg (rarely above 8) | D2 and 5-HT2A, alpha-1 | Raise by 1 mg steps; 2 to 4 mg often enough in a first episode; prolactin dose-related |
| Paliperidone | Invega, Palido | 3 mg | 3 to 12 mg | 12 mg | As risperidone | Renal dosing; no CYP metabolism of note |
| Olanzapine | Oleanz, Olace, Olimelt | 5 to 10 mg | 10 to 20 mg | 20 mg | D2, 5-HT2A, H1, M1, 5-HT2C | Night dosing; smokers need more; metabolic monitoring essential |
| Quetiapine | Qutipin, Seroquin, Qutan | 25 to 50 mg twice | 300 to 750 mg | 750 mg (800 mg bipolar, XR) | Low D2, H1, alpha-1, 5-HT2A; norquetiapine blocks NET | Raise over about four days to 300 mg; XR once at night |
| Aripiprazole | Arip MT, Aripra | 10 mg (5 mg if anxious) | 10 to 15 mg | 30 mg | D2 and 5-HT1A partial agonist, 5-HT2A antagonist | Halve dose with strong CYP2D6 or 3A4 inhibitors; long half-life |
| Amisulpride | Amipride, Sulpitac | 100 to 400 mg | 400 to 800 mg | 1200 mg | D2 and D3 selective | 50 to 300 mg for negative symptoms; reduce in renal impairment |
| Lurasidone | Lurasid, Latuda, Lurafic | 37 mg | 37 to 148 mg | 148 mg | D2, 5-HT2A, 5-HT7 antagonist, 5-HT1A partial | With at least a 350 kcal meal; avoid strong CYP3A4 inhibitors and inducers |
| Clozapine | Sizopin, Skizoril, Lozapin | 12.5 mg | 200 to 450 mg | 900 mg | Weak D2, strong 5-HT2A, H1, M1, alpha-1 | See 3.4 for titration and monitoring |
| Cariprazine | | 1.5 mg | 1.5 to 6 mg | 6 mg | D3-preferring D2 and D3 partial agonist | Very long-lived metabolite: effects and side effects change over weeks |
:::


:::widget compare
{"title": "Haloperidol and clozapine: two ends of the spectrum", "a": {"label": "Haloperidol", "points": ["Tight, long-lasting D2 block", "High risk of dystonia, parkinsonism, akathisia and tardive dyskinesia", "Raises prolactin", "Little weight gain or sedation", "No blood tests needed; cheap; injections available"], "summary": "Effective for positive symptoms and useful in emergencies, at the cost of movement side effects."}, "b": {"label": "Clozapine", "points": ["Loose, fast-off D2 binding plus many other receptors", "Almost no movement side effects; treats tardive dyskinesia", "Little prolactin rise", "Marked weight gain, sedation, drooling, constipation", "Regular blood counts; risk of low neutrophils and myocarditis"], "summary": "The most effective antipsychotic for treatment resistance and suicidal behaviour, with its own serious risks."}, "caption": "Slide between them. Notice how the side effects almost swap places."}
:::
:::trap "Atypical" does not mean "safe"
Second-generation drugs swap movement side effects for **metabolic harm**. Olanzapine and clozapine carry the highest weight and diabetes risk. Monitor everyone.
:::

:::recall
1. Compare high- and low-potency first-generation drugs. || High potency: more EPS, less sedation; low potency: sedation, anticholinergic, fewer EPS.
2. Which atypicals raise prolactin most? || Risperidone, paliperidone, amisulpride.
3. Which atypicals carry the highest metabolic risk? || Olanzapine and clozapine.
4. What is aripiprazole's typical side effect? || Akathisia.
5. Give two Indian brands for olanzapine and for risperidone. || Oleanz, Olace; Risdone, Sizodon.
:::

:::mcq
Q: Which antipsychotic is most likely to cause marked weight gain and diabetes?
- Aripiprazole
- Haloperidol
- *Olanzapine
- Amisulpride
> Olanzapine and clozapine carry the highest metabolic risk.

Q: A prescription from a Pune clinic reads "Tab Sizodon 2 mg BD". The medicine is:
- Olanzapine
- *Risperidone
- Clozapine
- Haloperidol
> Sizodon is a common Indian brand of risperidone.
:::

## 1.3 Choosing, dosing and how long to treat [core][beginner]
### First episode
- **Start low**, increase slowly: first-episode patients respond to **lower doses** and are more sensitive to side effects.
- Choose with the patient, by **side-effect profile**: weight (avoid olanzapine in someone already overweight), prolactin (avoid risperidone and amisulpride in a young woman worried about periods), sedation, movement, heart.
- Give an adequate trial at a therapeutic dose before judging.

:::widget guess
{"prompt": "If a person shows no improvement at all on an antipsychotic at a good dose, after how many weeks is a change worth considering?", "min": 0, "max": 12, "unit": "weeks", "answer": [2, 3], "reveal": "Around 2 to 3 weeks. Early improvement is a strong predictor of later response, and a complete lack of change by then means this drug at this dose is unlikely to work. If there is partial improvement, it is worth continuing longer, because response keeps building.", "clinician": "Lack of any improvement (under 20% PANSS reduction) by 2 weeks predicts non-response well; with partial response continue to 4 to 6 weeks. A full adequate trial for treatment-resistance purposes is at least 6 weeks at a therapeutic dose, with adherence confirmed."}
:::

### Dose equivalents (approximate, to chlorpromazine 100 mg)
| Medicine | Equivalent dose |
|---|---|
| Haloperidol | 2 mg |
| Risperidone | 1 to 2 mg |
| Olanzapine | 5 mg |
| Quetiapine | 100 to 150 mg |
| Aripiprazole | 7.5 mg |
| Trifluoperazine | 5 mg |

- Equivalents help when switching or judging if a dose is high. **Combining two antipsychotics** is usually avoided (except clozapine augmentation in specialist hands, or adding low-dose aripiprazole for prolactin); it raises side effects without clear benefit.

:::widget curve
{"kind": "dose-response", "title": "More dose, more side effects, not more benefit", "caption": "Move the sliders. Antipsychotic benefit levels off once D2 occupancy reaches about 65 to 80%, but movement side effects keep climbing above 80%. A drug with high potency reaches that zone at a few milligrams; a low-potency one needs hundreds."}
:::

### Switching
- **Cross-taper**: slowly reduce the old medicine while increasing the new one, to avoid rebound (cholinergic rebound with clozapine or olanzapine, rebound insomnia, relapse).

### How long to continue
| Situation | Typical approach |
|---|---|
| First episode, full recovery | At least 1 to 2 years after remission, then a slow, monitored taper if the person wishes |
| Second episode or more | Long term (often years), as relapse risk on stopping is high |
| Dangerous relapses (violence, suicide) | Long term, often a depot |

### Adherence
- Up to half of patients do not take medicines as prescribed. Ask without judging: "Many people miss doses. How often does that happen for you?"
- Reasons: side effects, poor insight, stigma, cost, complicated regimens, substance use. Solutions: simplify (once daily), fix side effects, involve family, **depots**, motivational approaches.

:::widget flow
{"title": "The relapse cycle that adherence work tries to break", "layout": "cycle", "nodes": [{"id": "c1", "label": "Well on medicine", "detail": "Voices quiet, back at work or college. Side effects are now the most noticeable thing."}, {"id": "c2", "label": "Side effects and doubt", "detail": "Weight, stiffness, low libido, stigma, the feeling 'I'm fine now'."}, {"id": "c3", "label": "Stops or misses doses", "detail": "Often without telling anyone. Nothing happens at first, which seems to confirm the medicine was not needed."}, {"id": "c4", "label": "Early warning signs", "detail": "Poor sleep, suspicion, irritability, withdrawal over weeks."}, {"id": "c5", "label": "Relapse", "detail": "Admission, lost job or studies, family strain; each relapse may leave more lasting difficulty."}, {"id": "c6", "label": "Restarted, often at a higher dose", "detail": "More side effects, and the cycle begins again unless something changes."}], "caption": "Press Play. Where can you break the circle? Fix side effects early, agree a relapse signature with the family, offer a depot, and keep the relationship strong."}
:::

:::recall
1. What predicts later response to an antipsychotic? || Early improvement in the first couple of weeks.
2. What is 100 mg chlorpromazine equal to in haloperidol and olanzapine? || About 2 mg and 5 mg.
3. How long to continue after a first episode with full recovery? || At least 1 to 2 years after remission.
4. What is a cross-taper? || Slowly reducing the old drug while increasing the new one.
:::

:::mcq
Q: A man recovered fully from a first psychotic episode 4 months ago and wants to stop his medicine now. The best advice is:
- Stop today
- *Continue for at least 1 to 2 years after remission, then a slow, watched taper if he wishes
- Continue lifelong without discussion
- Switch to a benzodiazepine
> Relapse is very common after stopping early; share the facts and respect his choice.
:::

## 1.4 Antipsychotics in special groups [core][beginner]
| Group | Key points |
|---|---|
| **Older people with dementia** | **Increased risk of stroke and death**. Use only for severe distress or danger after non-drug approaches, lowest dose, shortest time, review often. Avoid in Lewy body dementia |
| **Pregnancy** | Untreated psychosis is dangerous; most antipsychotics are not major causes of birth defects. Monitor glucose (gestational diabetes) and weight; avoid stopping suddenly; plan around delivery |
| **Breastfeeding** | Many are compatible with monitoring of the baby (sedation, feeding); clozapine is avoided |
| **Children and adolescents** | More sensitive to weight gain, prolactin and EPS; monitor growth |
| **Heart disease** | Avoid QT-prolonging drugs; ECG at baseline; aripiprazole or lurasidone often preferred |
| **Epilepsy** | Clozapine and chlorpromazine lower seizure threshold most; haloperidol and aripiprazole lower risk |
| **Parkinson's disease** | Avoid typical antipsychotics and risperidone; use **quetiapine or clozapine** at low doses; pimavanserin where available |
| **Diabetes, obesity** | Aripiprazole, lurasidone, ziprasidone; avoid olanzapine and clozapine where possible |

:::widget decide
{"scene": "Shabnam, 27, in Srinagar, has schizophrenia that has been stable for two years on olanzapine 15 mg. She is two months pregnant, unplanned, and her mother-in-law says all medicines will harm the baby. She asks whether to stop today.", "ask": "What is the best plan?", "choices": [{"label": "Stop olanzapine at once to protect the baby", "verdict": "harm", "outcome": "By the second trimester she is hearing voices again, stops eating and is admitted. She misses antenatal care.", "why": "Relapse in pregnancy is dangerous for both mother and baby, and sudden stopping raises that risk."}, {"label": "Explain that the main risks of olanzapine in pregnancy are weight gain and gestational diabetes, not birth defects; continue at the lowest effective dose, screen glucose early, involve the obstetrician and family, and plan care around delivery", "verdict": "best", "outcome": "She stays well, her glucose is watched closely, and she delivers a healthy baby. The baby is checked for sleepiness in the first days.", "why": "Continuing a working antipsychotic is usually safer than relapse. The real risks are metabolic and around delivery, and both can be monitored."}, {"label": "Switch to haloperidol because older drugs are 'more studied'", "verdict": "ok", "outcome": "She becomes stiff and restless. The switch itself risks relapse.", "why": "Haloperidol has a long record in pregnancy, but switching a stable patient adds relapse and side-effect risk without a clear gain."}]}
:::

:::widget decide
{"scene": "Mr Pillai, 84, in Kochi, has Alzheimer's dementia. At night he shouts and pushes the carer. His GP has started risperidone 0.5 mg. Two weeks later he is stiffer, more confused, and the family notice his speech is slurred and his right hand weak this morning.", "ask": "What do you do?", "choices": [{"label": "Raise risperidone to 1 mg to settle him", "verdict": "harm", "outcome": "He is admitted the next day with a stroke.", "why": "Sudden weakness and slurred speech need emergency assessment. Antipsychotics raise stroke and death risk in dementia."}, {"label": "Treat as a possible stroke now (emergency referral); afterwards stop risperidone, look for causes of agitation (pain, constipation, infection, retention, sleep, environment), and use non-drug approaches first", "verdict": "best", "outcome": "A small stroke is confirmed. Later, treating his constipation and pain and changing his evening routine settle the night-time distress without antipsychotics.", "why": "Medical emergencies first; then the antipsychotic is reviewed against its known risks, and reversible causes of agitation are treated."}, {"label": "Add trihexyphenidyl for the stiffness", "verdict": "harm", "outcome": "He becomes delirious and retains urine.", "why": "An anticholinergic in an 84-year-old with dementia adds confusion and misses the emergency."}]}
:::

:::recall
1. What risk do antipsychotics carry in older people with dementia? || Increased stroke and death.
2. Which antipsychotics are used in Parkinson's disease psychosis? || Low-dose quetiapine or clozapine (pimavanserin where available).
3. Which antipsychotics lower the seizure threshold most? || Clozapine and chlorpromazine.
4. What is the main concern with olanzapine in pregnancy? || Weight gain and gestational diabetes.
:::

:::mcq
Q: An 82-year-old with Lewy body dementia is distressed by visual hallucinations. Which is the most dangerous choice?
- Explaining and reassuring
- A cholinesterase inhibitor
- *Haloperidol
- Low-dose quetiapine with care
> Severe sensitivity to antipsychotics, especially typicals, can be fatal.
:::

# Part II · Side effects

## 2.1 Extrapyramidal side effects [core][beginner]
| Effect | When it appears | What you see | Treatment |
|---|---|---|---|
| **Acute dystonia** | Hours to days after starting or raising the dose | Painful sustained spasms: neck twisting (torticollis), eyes rolling up (**oculogyric crisis**), jaw, tongue; frightening; young men most at risk | **Anticholinergic IM or IV** (procyclidine, benztropine, or promethazine); relief within minutes; then oral cover for a few days |
| **Akathisia** | Days to weeks | Inner restlessness, can't sit still, pacing, rocking from foot to foot; distressing; linked to agitation and **suicidality** | Reduce dose or switch; **propranolol**; benzodiazepine; low-dose mirtazapine. Anticholinergics help little |
| **Parkinsonism** | Weeks | Tremor, cogwheel rigidity, slowness, mask-like face, shuffling gait, drooling | Reduce dose or switch; anticholinergic (trihexyphenidyl) if needed |
| **Tardive dyskinesia** | Months to years | Involuntary repetitive movements: lip smacking, tongue writhing, chewing, grimacing, limb or trunk movements; may be permanent | Review need; reduce or switch (clozapine lowest risk); **VMAT2 inhibitors** (tetrabenazine, valbenazine, deutetrabenazine). **Anticholinergics can worsen it** |

:::mnemonic Rough timing order
**Hours, days, weeks, months**: dystonia, akathisia, parkinsonism, tardive dyskinesia. A rough guide, but easy to remember.
:::

:::widget flow
{"title": "A patient on an antipsychotic is moving abnormally: which one is it?", "layout": "tree", "nodes": [{"id": "m0", "label": "Abnormal movement on an antipsychotic", "detail": "Ask when it started, what it looks like, and whether the person feels it from inside."}, {"id": "m1", "label": "Sudden painful spasm, eyes or neck", "parent": "m0", "detail": "Hours to days after a new drug or dose rise, often in a young man."}, {"id": "m2", "label": "Inner restlessness, cannot stay still", "parent": "m0", "detail": "The person says 'I have to move'. Legs shuffle, pacing, crossing and uncrossing."}, {"id": "m3", "label": "Slow, stiff, tremor at rest", "parent": "m0", "detail": "Weeks in; looks like Parkinson's disease."}, {"id": "m4", "label": "Writhing mouth and tongue, months or years in", "parent": "m0", "detail": "The person may not notice it; the family does. Worse when anxious, gone in sleep."}, {"id": "a1", "label": "Acute dystonia: IM anticholinergic now", "parent": "m1"}, {"id": "a2", "label": "Akathisia: lower dose, propranolol", "parent": "m2"}, {"id": "a3", "label": "Parkinsonism: lower dose, switch, anticholinergic if needed", "parent": "m3"}, {"id": "a4", "label": "Tardive dyskinesia: review, switch, VMAT2 inhibitor, stop anticholinergics", "parent": "m4"}], "caption": "Tap each branch. Timing plus what the person feels inside sorts almost every case."}
:::


:::widget timeline
{"prompt": "Put the movement side effects in the order they usually appear after starting an antipsychotic.", "events": [{"label": "Acute dystonia", "when": "hours to days"}, {"label": "Akathisia", "when": "days onward"}, {"label": "Parkinsonism", "when": "later"}, {"label": "Tardive dyskinesia", "when": "months to years"}], "why": "Dystonia is a sudden reaction to new blockade; akathisia and parkinsonism build as blockade continues; tardive dyskinesia reflects long-term adaptation (supersensitivity). The rough rule is hours, days, weeks, months."}
:::
:::sounds How akathisia sounds
"Andar se bechaini hai, baith hi nahi paata, pair hilte rehte hain." (A restlessness inside; I can't sit; my legs keep moving.) Staff may misread it as worsening psychosis and raise the dose, making it worse.
:::

- Monitor movement with the **AIMS** (Abnormal Involuntary Movement Scale) at baseline and regularly; rate akathisia with the Barnes scale.

:::widget decide
{"scene": "Arjun, 20, an engineering student in Hyderabad, was started on aripiprazole 15 mg a week ago. On the ward round he paces, crosses and uncrosses his legs, and says 'I feel like jumping out of my skin'. The nurse says he is 'more agitated, needs more medicine'.", "ask": "What do you do?", "choices": [{"label": "Increase aripiprazole to 30 mg for agitation", "verdict": "harm", "outcome": "His restlessness becomes unbearable and that night he says he wants to die.", "why": "This is akathisia, which is dose-related. Raising the dose worsens it, and akathisia is linked to impulsive self-harm."}, {"label": "Recognise akathisia: reduce the dose, add propranolol, ask about suicidal thoughts, and explain to Arjun what is happening", "verdict": "best", "outcome": "On aripiprazole 10 mg with propranolol his restlessness settles within days, and his trust in the team grows.", "why": "Naming it relieves fear; lowering the dose and a beta-blocker treat it; asking about suicide is part of safe care."}, {"label": "Add trihexyphenidyl", "verdict": "ok", "outcome": "It helps a little, but he becomes forgetful and constipated.", "why": "Anticholinergics work poorly for akathisia and add their own burden."}]}
:::

:::recall
1. Name the four extrapyramidal side effects in the order they usually appear. || Acute dystonia, akathisia, parkinsonism, tardive dyskinesia.
2. What is the emergency treatment for acute dystonia? || An IM or IV anticholinergic (procyclidine, benztropine) or promethazine.
3. Which medicine helps akathisia most? || Propranolol (with dose reduction).
4. Which movement side effect can anticholinergics worsen? || Tardive dyskinesia.
:::

:::mcq
Q: Two days after starting haloperidol, a 19-year-old has painful neck twisting and his eyes roll upward. Treatment:
- Increase haloperidol
- *An anticholinergic such as procyclidine or benztropine injection
- Propranolol
- Stop all fluids
> Acute dystonia responds quickly to anticholinergics.

Q: A patient on aripiprazole paces, cannot sit still and feels restless inside. This is most likely:
- Anxiety
- *Akathisia
- Tardive dyskinesia
- Mania
> Akathisia can be mistaken for agitation; it raises suicide risk. Propranolol helps.
:::

## 2.2 Neuroleptic malignant syndrome [core][beginner]
:::safety NMS: a medical emergency
A rare, potentially fatal reaction to dopamine blockade, usually in the first days to weeks or after a dose increase. Risk is higher with high-potency drugs, rapid dose rises, injections, dehydration, exhaustion, catatonia and lithium co-prescription.
:::

| Feature | Detail |
|---|---|
| Fever | High temperature |
| **Lead-pipe rigidity** | Generalised, severe |
| Altered consciousness | Confusion, stupor, mutism |
| Autonomic instability | Swinging blood pressure, fast heart rate, sweating |
| Tests | **Very raised CK** (muscle breakdown), raised white count, low serum iron, kidney injury (myoglobin) |

:::mnemonic FEVER
**F**ever · **E**ncephalopathy · **V**ital signs unstable · **E**levated CK (and white cells) · **R**igidity.
:::

### Management
1. **Stop the antipsychotic** (and other dopamine blockers such as metoclopramide).
2. Transfer to medical care; IV fluids, cooling, watch kidneys and electrolytes.
3. Benzodiazepines; **dantrolene** (muscle relaxant) and **bromocriptine** (dopamine agonist) in severe cases; ECT if it persists or with catatonia.
4. After recovery, wait before cautiously restarting a low-potency or different antipsychotic at a low dose, rising slowly.

:::widget guess
{"prompt": "After recovery from NMS, how many weeks should usually pass before an antipsychotic is cautiously restarted?", "min": 0, "max": 12, "unit": "weeks", "answer": [2, 2], "reveal": "At least about 2 weeks after full recovery, then a different, lower-potency drug at a low dose, rising slowly, with temperature, pulse, blood pressure and CK watched. Many people can take antipsychotics again safely.", "clinician": "Wait at least 2 weeks (longer after a depot); choose a structurally different, low-potency agent or clozapine; titrate slowly; avoid dehydration and lithium co-prescription during re-challenge; monitor CK and vital signs."}
:::

:::widget decide
{"scene": "Mr Okafor, 35, a Nigerian student in Delhi, was admitted with mania and given haloperidol injections several times over two days, plus lithium. He is now mute, rigid 'like a board', sweating, with a temperature of 39.2 °C and blood pressure swinging. His CK is very high. He also takes sertraline from home.", "ask": "What is the most likely diagnosis and the first action?", "choices": [{"label": "Serotonin syndrome from sertraline: give cyproheptadine and continue haloperidol", "verdict": "harm", "outcome": "His rigidity and kidney function worsen.", "why": "Slow onset over days after repeated dopamine block, lead-pipe rigidity, mutism and very high CK point to NMS. Clonus and hyperreflexia would point to serotonin syndrome."}, {"label": "Neuroleptic malignant syndrome: stop haloperidol and lithium, transfer to medical care with fluids and cooling, benzodiazepines, and consider dantrolene or bromocriptine", "verdict": "best", "outcome": "He recovers over ten days. His mania is later treated with valproate and, cautiously, quetiapine.", "why": "Rapid high-potency dosing, injections, dehydration and lithium all raise NMS risk; stopping the cause and supportive care save lives."}, {"label": "Catatonia only: give more haloperidol", "verdict": "harm", "outcome": "He deteriorates and needs intensive care.", "why": "Catatonia and NMS overlap, but antipsychotics worsen both here. Lorazepam, not haloperidol, treats catatonia."}]}
:::

:::recall
1. Expand FEVER for NMS. || Fever, encephalopathy, vital signs unstable, elevated CK, rigidity.
2. What is the first step in NMS? || Stop the antipsychotic.
3. Name four risk factors for NMS. || High-potency drugs, rapid dose rises, injections, dehydration (also exhaustion, catatonia, lithium).
4. Which two medicines are used in severe NMS? || Dantrolene and bromocriptine.
:::

:::mcq
Q: Five days after a haloperidol increase, a man has high fever, rigid limbs, confusion, swinging blood pressure and a very high CK. First step:
- Increase the dose
- *Stop the antipsychotic and transfer for urgent medical care
- Give an anticholinergic and continue
- Start lithium
> Neuroleptic malignant syndrome is an emergency.
:::

## 2.3 Metabolic, cardiac and other effects [core][beginner]
| Effect | High-risk drugs | What to do |
|---|---|---|
| Weight gain, diabetes, raised lipids | Olanzapine, clozapine, quetiapine, chlorpromazine | Diet and exercise advice from day one; metformin may help; switch to aripiprazole, lurasidone or ziprasidone |
| Raised prolactin | Risperidone, paliperidone, amisulpride, haloperidol | Ask about periods, breast discharge, libido; switch or add aripiprazole |
| QT prolongation | Ziprasidone, IV haloperidol, thioridazine, sertindole, pimozide | ECG; correct potassium and magnesium |
| Sedation | Clozapine, olanzapine, quetiapine, chlorpromazine | Night-time dosing |
| Dizziness on standing | Clozapine, quetiapine, chlorpromazine, risperidone early | Slow titration; caution in older adults |
| Anticholinergic effects | Clozapine, olanzapine, chlorpromazine | Watch constipation and confusion |
| Seizure threshold lowered | Clozapine, chlorpromazine | Caution in epilepsy |
| Older adults with dementia | All antipsychotics | **Increased risk of stroke and death** |

:::widget guess
{"prompt": "On average, how many years earlier do people with severe mental illness die than the general population?", "min": 0, "max": 30, "unit": "years", "answer": [10, 20], "reveal": "About 10 to 20 years earlier, mostly from heart disease, diabetes, lung disease and smoking, not from suicide alone. Antipsychotic metabolic effects are one part of this; poverty, smoking, inactivity and poor access to physical care are others.", "clinician": "Excess mortality is largely cardiovascular and respiratory. Metabolic syndrome affects about a third of people with schizophrenia. Annual physical checks and active treatment of risk factors (statins, antihypertensives, smoking cessation, metformin) are part of antipsychotic prescribing."}
:::


:::widget compare
{
 "title": "Olanzapine and aripiprazole: the metabolic gap",
 "a": {
  "label": "Olanzapine",
  "points": [
   "Strong H1 and 5-HT2C block: hunger and sleepiness",
   "Large weight gain is common, often in the first months",
   "Raises glucose and fats, sometimes before weight changes",
   "Highly effective; little restlessness",
   "Needs weight, waist, sugar and lipids checked from the start"
  ],
  "summary": "Powerful, but metabolically expensive."
 },
 "b": {
  "label": "Aripiprazole",
  "points": [
   "D2 partial agonist; weak H1 and 5-HT2C effects",
   "Weight and sugar change much less",
   "Prolactin usually falls rather than rises",
   "Restlessness (akathisia) and insomnia are the common costs",
   "Still needs metabolic monitoring"
  ],
  "summary": "Kinder to the body, harder on restlessness."
 },
 "caption": "Slide between the two. Both treat psychosis; the choice is often about which side effects this person can least afford."
}
:::

### QT risk
The QT interval is the time the heart takes to recharge between beats. A long QT can lead to a dangerous rhythm (torsades de pointes) and sudden death. Risks add up: the drug, its dose, a second QT drug, low potassium or magnesium, heart disease, slow pulse, female sex and older age.

:::widget decide
{"scene": "Ms Kaur, 58, in Ludhiana, has schizophrenia and takes haloperidol 10 mg. She is admitted with vomiting and diarrhoea, and the medical team give ondansetron and start azithromycin. Her potassium is 3.0 mmol/L. The nurse reports she fainted in the bathroom.", "ask": "What do you do first?", "choices": [{"label": "Give her usual haloperidol and an extra IV haloperidol dose because she seems confused", "verdict": "harm", "outcome": "On the monitor she develops torsades de pointes and needs resuscitation.", "why": "Haloperidol, especially IV, plus ondansetron and azithromycin, plus low potassium and vomiting: stacked QT risk with a faint is an emergency."}, {"label": "ECG now; cardiac monitoring; correct potassium and magnesium; stop or replace the other QT drugs; hold haloperidol until the QTc is known, then choose a lower-QT option such as aripiprazole if needed", "verdict": "best", "outcome": "Her QTc is 540 ms. After electrolytes are corrected and ondansetron and azithromycin are changed, it returns to normal. She is later moved to aripiprazole.", "why": "Faint plus stacked QT risk means measure the QT, fix the reversible causes and remove what you can."}, {"label": "Reassure: fainting is just from dehydration", "verdict": "harm", "outcome": "She collapses again that night.", "why": "Fainting in a person with several QT risks must be assumed cardiac until an ECG says otherwise."}]}
:::

### Physical health monitoring
| When | What |
|---|---|
| Baseline | Weight, BMI, waist, BP, pulse, fasting glucose or HbA1c, lipids, ECG (if risk or inpatient), prolactin (if relevant), movement (AIMS), smoking and alcohol |
| Early | Weight often (weekly at first), and blood pressure |
| After about three months | Weight, BP, glucose, lipids |
| Then at least yearly | All of the above |

:::recall
1. Which antipsychotics cause the most weight gain and diabetes? || Olanzapine and clozapine (then quetiapine, chlorpromazine).
2. Name five things that add up to QT risk. || The drug and dose, a second QT drug, low potassium or magnesium, heart disease, slow pulse (also female sex, older age).
3. List the baseline physical checks before an antipsychotic. || Weight, BMI, waist, BP, pulse, glucose or HbA1c, lipids, ECG if risk, prolactin if relevant, AIMS, smoking.
:::

:::mcq
Q: Which check is essential at baseline and regularly for someone starting olanzapine?
- EEG
- *Weight, waist, blood pressure, fasting glucose or HbA1c and lipids
- Lithium level
- Thyroid scan
> Physical health monitoring is part of every antipsychotic plan.
:::

## 2.4 Managing side effects in practice [core][beginner]
| Problem | Options |
|---|---|
| **Weight gain** | Lifestyle advice from the start, switch to a weight-friendly drug, **metformin** (evidence in antipsychotic-induced weight gain), add aripiprazole; GLP-1 medicines are being studied |
| **Raised prolactin** | Reduce dose, switch (aripiprazole, quetiapine), or **add low-dose aripiprazole**; check bone health with long-term high levels |
| **Sexual dysfunction** | Ask (patients rarely volunteer it); reduce dose, switch to a prolactin-sparing drug |
| **Hypersalivation** (clozapine) | Towel on the pillow, chewing gum; hyoscine or glycopyrrolate |
| **Sedation** | Night dosing, lower dose, switch |
| **Dizziness on standing** | Slow titration, stand up slowly, fluids |
| **Akathisia** | Reduce dose, **propranolol**, benzodiazepine, low-dose mirtazapine |
| **Tardive dyskinesia** | Review need; switch to clozapine or quetiapine; **VMAT2 inhibitors**; **stop anticholinergics** |

:::trap Don't give anticholinergics routinely
Trihexyphenidyl and benztropine help dystonia and parkinsonism, but given "just in case" they cause memory problems, constipation, misuse (they can give a "high") and may worsen tardive dyskinesia. In India they are often prescribed by default with every antipsychotic. Use them when needed, and review.
:::

:::widget decide
{"scene": "Mrs Rao, 72, in Bengaluru, has had schizophrenia for 40 years. She takes trifluoperazine with trihexyphenidyl (a fixed combination), amitriptyline 25 mg at night for sleep, and an oxybutynin tablet for her bladder. Her daughter says she has become forgetful, constipated and 'not herself' over the past months. Her movements are slow.", "ask": "What is the best next step?", "choices": [{"label": "Start donepezil for dementia", "verdict": "harm", "outcome": "Her confusion continues; donepezil's effect is cancelled out by her anticholinergic medicines.", "why": "The anticholinergic burden has not been looked at, and it is a likely reversible cause."}, {"label": "Count her anticholinergic burden; taper trihexyphenidyl, replace amitriptyline and oxybutynin with safer options, consider moving to a single antipsychotic with less need for anticholinergic cover, and recheck memory", "verdict": "best", "outcome": "Over two months her memory and bowels improve. Her parkinsonism is managed by moving to a lower-EPS antipsychotic rather than adding cover.", "why": "Three or four anticholinergic drugs together are a common, fixable cause of confusion in older people."}, {"label": "Increase trihexyphenidyl for her slowness", "verdict": "harm", "outcome": "She becomes delirious and goes into urinary retention.", "why": "More anticholinergic load in an older person makes confusion worse."}]}
:::

:::recall
1. Which medicine helps antipsychotic-induced weight gain? || Metformin.
2. How can you lower prolactin without stopping risperidone? || Add low-dose aripiprazole.
3. Why avoid routine anticholinergics? || Memory problems, constipation, misuse, worsening tardive dyskinesia.
4. What helps clozapine hypersalivation? || Hyoscine or glycopyrrolate; a towel on the pillow.
:::

:::mcq
Q: A man on risperidone has put on 10 kg in 6 months. He is well and wants to stay on it. A reasonable addition is:
- A second sedating antipsychotic
- *Lifestyle support and metformin, or adding low-dose aripiprazole
- A benzodiazepine
- Stopping all medicines
> Metformin has evidence for antipsychotic weight gain.
:::

# Part III · Special uses

## 3.1 Clozapine [core][beginner]
:::define Indications
**Treatment-resistant schizophrenia** (failure of at least two antipsychotics at adequate dose and duration), persistent **suicidal behaviour** in schizophrenia, intolerable EPS or tardive dyskinesia, and psychosis in Parkinson's disease (low doses).
:::

| Risk | What to know |
|---|---|
| **Severe neutropenia (agranulocytosis)** | Under 1%, mostly in the first months. Blood counts weekly at first, then less often. Any fever or sore throat: urgent blood count |
| **Myocarditis**, cardiomyopathy | Mostly in the first two months: fever, chest pain, breathlessness, fast pulse. Check troponin, CRP, ECG |
| **Seizures** | Dose and level related |
| **Constipation** | Can lead to fatal bowel obstruction. Ask at every visit; prescribe laxatives |
| Hypersalivation | Especially at night |
| Weight gain, diabetes | High |
| Sedation, dizziness, fast pulse, fever early on | Titrate slowly |

:::widget receptor
{"receptor": "D2", "title": "Why clozapine causes so few movement problems", "caption": "Pick Antagonist, then imagine it letting go every few seconds. Clozapine binds D2 loosely and comes off quickly, so natural dopamine bursts can still get through. At usual doses it occupies only about 40 to 60% of D2 receptors, below the zone where stiffness begins. Its benefit probably comes from many other receptors too."}
:::

:::note Smoking and clozapine
Tobacco smoke speeds up the liver enzyme CYP1A2 and can halve clozapine levels. **When a patient stops smoking (for example on admission to a no-smoking ward), clozapine levels can rise sharply within days**: watch for toxicity and reduce the dose. Nicotine patches do not have this effect; it is the smoke. Fluvoxamine and ciprofloxacin also raise levels.
:::

:::widget decide
{"scene": "Mr Thomas, 38, in Thrissur, has done very well on clozapine 400 mg for a year. He smoked 20 bidis a day. He is admitted for a hernia operation to a ward where smoking is forbidden. A week later he is very drowsy, drooling heavily, has myoclonic jerks and has a seizure.", "ask": "What happened, and what should have been done?", "choices": [{"label": "Infection: start antibiotics and continue clozapine at 400 mg", "verdict": "harm", "outcome": "He has another seizure.", "why": "The timing points to clozapine toxicity after stopping smoking, not infection."}, {"label": "Stopping smoking removed CYP1A2 induction, so his clozapine level rose sharply. Check the level, hold or reduce the dose and treat the seizure. Before admission the dose should have been reduced in steps over a week with a level checked", "verdict": "best", "outcome": "His level is very high. After a pause and a lower dose, the jerks stop. A plan is written for the next time he stops or restarts smoking.", "why": "Stopping smoking can raise clozapine levels by up to half. Planning, levels and dose changes prevent this."}, {"label": "Stop clozapine for good", "verdict": "harm", "outcome": "He relapses badly within weeks.", "why": "The problem was the dose after a change in smoking, not clozapine itself."}]}
:::

:::recall
1. Give three indications for clozapine. || Treatment resistance, suicidal behaviour, intolerable EPS or TD (also Parkinson's psychosis).
2. Which clozapine side effect can kill quietly and must be asked about every visit? || Constipation leading to bowel obstruction.
3. What happens to clozapine levels when a patient stops smoking? || They rise, sometimes sharply.
4. Why does clozapine cause few movement side effects? || Low, loose and quickly released D2 binding; occupancy below the EPS zone.
:::

:::mcq
Q: A man who started clozapine recently has fever, a sore throat and mouth ulcers. The first test is:
- Clozapine level
- *Full blood count (neutrophils), urgently
- Chest X-ray only
- Liver tests
> Possible neutropenia or agranulocytosis.

Q: A clozapine patient admitted to a non-smoking ward becomes very drowsy and has a seizure a week later. The likely reason is:
- Infection
- *Clozapine levels rose because he stopped smoking
- Lower adherence
- NMS
> Smoking induces CYP1A2; stopping can sharply raise levels.
:::

## 3.2 Long-acting injections (depots) [core][beginner]
- For poor adherence, patient preference, or relapse after stopping oral medicine. Some services offer them early, even in a first episode.
- Older oily depots: haloperidol decanoate, fluphenazine decanoate, flupentixol decanoate, zuclopenthixol decanoate. Give a small test dose first.
- Newer ones: **paliperidone palmitate** (monthly, 3-monthly, 6-monthly), **aripiprazole** (monthly; a 2-monthly form approved in the US in April 2023), **risperidone** long-acting (two-weekly; under-the-skin forms), **olanzapine pamoate** (needs 3 hours of observation after each injection for post-injection delirium sedation syndrome). In October 2026 the US approved a once-monthly olanzapine injection given under the skin that does not need this observation.
- Establish tolerability on the oral form first.

:::widget journey
{"drug": "paliperidone palmitate", "target": "D2 and 5-HT2A receptors, kept steadily blocked for a month", "routes": ["depot", "oral"], "notes": {"muscle": "The first two injections go into the shoulder (deltoid) muscle a week apart, which brings levels up faster. Later monthly doses can go into the shoulder or buttock.", "slow": "Tiny crystals of paliperidone dissolve slowly in the muscle and seep into the blood over weeks. There is no daily peak and no daily trough.", "blood": "Levels stay within a narrow band. Missing a tablet is impossible; a missed injection is noticed by the clinic, which gives an early warning.", "mouth": "The tablet form (Invega) is taken once a day. It is a slow-release tablet: do not crush it.", "liver": "Paliperidone is barely touched by the liver. It is mostly removed unchanged by the kidneys, so liver interactions are few but kidney function matters.", "out": "The kidneys remove it. After the last injection, levels fall only slowly over months, so side effects also fade slowly."}, "caption": "Compare Depot injection with Tablet. Which would suit a man who forgets tablets but never misses his monthly clinic chai with the nurse?"}
:::

:::widget curve
{"kind": "half-life", "title": "Why depots take months to settle, and months to leave", "caption": "Set a long half-life. A depot's apparent half-life (set by its slow release) is weeks, so steady state takes months. That is why oral cover or loading injections are needed at the start, and why side effects linger after stopping."}
:::

:::clinician
### Long-acting injections (for learning; check current guidelines)
| Depot | Indian brands | Usual dose and interval | Notes |
|---|---|---|---|
| Haloperidol decanoate | Senorm LA | 50 to 200 mg every 4 weeks (max 300 mg) | Test dose 25 mg; EPS |
| Fluphenazine decanoate | Prolinate | 12.5 to 50 mg every 2 to 5 weeks (max 100 mg) | Test dose 12.5 mg; EPS; very cheap |
| Flupentixol decanoate | Fluanxol Depot | 20 to 40 mg every 2 to 4 weeks (higher in some) | Test dose 20 mg |
| Zuclopenthixol decanoate | | 200 to 500 mg every 1 to 4 weeks | Do not confuse with zuclopenthixol acetate (short-acting) |
| Paliperidone palmitate monthly | Invega Sustenna | 150 mg day 1, 100 mg day 8 (deltoid), then 50 to 150 mg monthly | No oral cover needed; 3-monthly and 6-monthly forms after stabilisation |
| Aripiprazole monthly | | 400 mg monthly (300 mg with interactions or poor tolerance) | Continue oral aripiprazole for 14 days at the start, or use a two-injection start |
| Risperidone long-acting | | 25 to 50 mg every 2 weeks (microsphere form) | Oral cover for about 3 weeks |
| Olanzapine pamoate | | 150 to 300 mg every 2 weeks or 300 to 405 mg every 4 weeks | 3 hours observation for post-injection delirium sedation syndrome |
:::

:::recall
1. Name three reasons to offer a long-acting injection. || Poor adherence, relapse after stopping tablets, patient choice.
2. Which depot needs 3 hours of observation, and why? || Olanzapine pamoate: post-injection delirium sedation syndrome.
3. Why are the first two paliperidone injections given into the deltoid a week apart? || To bring levels up quickly without oral cover.
:::

:::mcq
Q: Which patient is the best candidate for a long-acting injection?
- A woman with first-episode psychosis who takes tablets reliably and prefers them
- *A man with repeated relapses after stopping tablets, who agrees to a monthly injection
- A man allergic to all antipsychotics
- A patient with NMS last week
> Depots help when adherence is the problem and the person agrees.
:::

## 3.3 Rapid tranquillisation [core][beginner]
For severe agitation when calming talk, a quieter space and oral medicine have failed:
- Oral first if possible: lorazepam, or an antipsychotic (olanzapine melt, risperidone liquid).
- IM options: **lorazepam**; **haloperidol with promethazine** (promethazine sedates and protects against dystonia; a common Indian combination); olanzapine IM (not within an hour of an IM benzodiazepine).
- Avoid haloperidol without an ECG in people with heart disease or unknown history where possible; never use IV haloperidol without cardiac monitoring.
- Monitor pulse, BP, breathing, temperature and consciousness afterwards; have flumazenil available after benzodiazepines.

:::widget flow
{"title": "Rapid tranquillisation: step by step", "layout": "chain", "nodes": [{"id": "r1", "label": "De-escalate", "detail": "Calm voice, space, fewer people, find out what the person needs (pain, hunger, fear, a phone call). Most situations settle here."}, {"id": "r2", "label": "Offer oral medicine", "detail": "Lorazepam, or olanzapine melt or risperidone liquid; promethazine if benzodiazepines are unsuitable."}, {"id": "r3", "label": "IM if oral refused or failed and risk is high", "detail": "Lorazepam IM, or haloperidol with promethazine IM, or olanzapine IM. Check allergies, ECG history and what was given already."}, {"id": "r4", "label": "Monitor closely", "detail": "Pulse, blood pressure, breathing rate, oxygen, temperature and level of consciousness, often every 15 minutes for the first hour."}, {"id": "r5", "label": "Review and debrief", "detail": "Was it needed? Was it legal under the Mental Healthcare Act? What could prevent it next time? Talk with the patient afterwards."}], "caption": "Press Play. Each step is used only if the one before has not worked."}
:::


:::widget compare
{
 "title": "Two common injections in an emergency",
 "a": {
  "label": "Lorazepam IM",
  "points": [
   "Works through GABA-A: calming and sleep",
   "No movement side effects, no ECG needed first",
   "Main risk: slowed breathing, more with alcohol or other sedatives",
   "Reversible with flumazenil",
   "Good when the cause is unclear or alcohol withdrawal is possible"
  ],
  "summary": "Safe for the heart and muscles; watch the breathing."
 },
 "b": {
  "label": "Haloperidol with promethazine IM",
  "points": [
   "Haloperidol blocks D2; promethazine adds sedation",
   "Promethazine also lowers the risk of acute dystonia",
   "Haloperidol can lengthen QT: ECG history matters",
   "Widely used and well tested in large trials in India and Brazil",
   "Watch for stiffness, low blood pressure and over-sedation"
  ],
  "summary": "Effective and familiar; check the heart first."
 },
 "caption": "Neither is better for everyone. The choice depends on the heart, breathing, alcohol, earlier reactions and what has been given already."
}
:::

:::recall
1. Name two IM options for rapid tranquillisation. || Lorazepam; haloperidol with promethazine (also olanzapine IM).
2. Why add promethazine to haloperidol? || It sedates and protects against acute dystonia.
3. What must be monitored afterwards? || Pulse, BP, breathing, oxygen, temperature, consciousness.
:::

:::mcq
Q: After calm talk and oral medicine fail, a man is about to hit staff. Which IM option is commonly used in India?
- Haloperidol alone at high dose
- *Haloperidol with promethazine, or lorazepam, then monitoring
- Diazepam by IM injection
- Chlorpromazine IV push
> Promethazine lowers dystonia risk and sedates; monitor vital signs afterwards.
:::

## 3.4 Starting clozapine step by step [core][beginner]
### Before
1. Confirm **treatment resistance**: two antipsychotics, each at an adequate dose for long enough, with good adherence (consider levels or a depot trial).
2. Consent: explain benefits (often dramatic), blood tests and side effects.
3. Baseline: **blood count** (neutrophils), weight, BP, pulse, temperature, ECG, glucose, lipids, **troponin and CRP**, bowel habit, smoking status.

### Titration
- Start low (12.5 mg) and increase slowly as tolerated towards a usual range of 200 to 450 mg.
- Check pulse, BP and temperature regularly during titration (fast pulse, low blood pressure and fever are common early).
- **Restart from 12.5 mg** if more than **48 hours** of doses are missed.

:::clinician
### Clozapine titration and monitoring (for learning; check current guidelines)
| Day or stage | Typical dose | Checks |
|---|---|---|
| Day 1 | 12.5 mg once or twice | Pulse, BP lying and standing, temperature before and after doses |
| Days 2 to 14 | Increase by 25 to 50 mg a day as tolerated | Same, at least daily; troponin and CRP weekly for the first 4 weeks |
| By about week 2 to 3 | 200 to 300 mg in divided doses (larger dose at night) | Weight, bowel habit, saliva, sedation |
| Then | Increase by up to 50 to 100 mg a week; usual 200 to 450 mg, maximum 900 mg | Plasma level once at a stable dose (aim at least 350 ng/mL, that is 0.35 mg/L) |
| Blood counts (UK-style schedule) | Weekly for 18 weeks, every 2 weeks to one year, then every 4 weeks | Stop if neutrophils fall below 1.5 x 10^9/L (lower limits in benign ethnic neutropenia, under specialist advice) |

- **Indian brands:** Sizopin, Skizoril, Lozapin.
- **Smokers** often need about 1.5 times the dose of non-smokers; plan for changes in smoking.
- **Interactions:** fluvoxamine and ciprofloxacin (raise levels several-fold); carbamazepine (avoid: marrow suppression and lower levels); omeprazole (lowers slightly).
- **Seizure prophylaxis** with valproate is considered at high doses or levels; constipation prophylaxis with stimulant or osmotic laxatives for everyone.
- In the US the formal clozapine registry programme was ended in 2025; blood count monitoring is still advised in the label.
:::

:::widget guess
{"prompt": "When clozapine helps, about what proportion of people who did not respond to two other antipsychotics improve on it?", "min": 0, "max": 100, "unit": "%", "answer": [30, 60], "reveal": "Somewhere between about a third and a half or more, depending on the study and how long it is given. That is far more than any other medicine achieves in this group, which is why it should be offered early once treatment resistance is clear.", "clinician": "Response rates of about 30% at 6 weeks and up to 60% by one year in early landmark trials; clozapine also reduces suicidal behaviour and all-cause mortality in cohort studies. In India and worldwide it is often started years later than it should be."}
:::

### Red flags to teach the patient and family
- **Fever, sore throat, mouth ulcers**: check blood count urgently.
- **Chest pain, breathlessness, fast pulse** in the first two months: myocarditis.
- **No bowel movement for 2 to 3 days, belly pain, vomiting**: bowel obstruction, an emergency.
- **Fits**.

:::widget decide
{"scene": "Ms Bhattacharya, 29, in Kolkata, started clozapine recently and is now on 225 mg. Today she has a temperature of 38.4 °C, a pulse of 128 at rest, feels breathless walking to the bathroom, and has a mild chest ache. Her neutrophils are normal. The junior doctor says 'Clozapine fever is common early, keep going.'", "ask": "What do you do?", "choices": [{"label": "Continue the titration; benign fever is common", "verdict": "harm", "outcome": "Two days later she collapses with heart failure.", "why": "Fever is common early, but fever plus fast pulse, breathlessness and chest pain in the first weeks is myocarditis until proved otherwise."}, {"label": "Hold clozapine, check troponin, CRP, ECG and an echocardiogram urgently, and involve the cardiology team", "verdict": "best", "outcome": "Her troponin and CRP are high: clozapine myocarditis. Clozapine is stopped and she recovers. A careful re-challenge is discussed much later with specialists.", "why": "Early myocarditis is treatable if caught. Troponin and CRP monitoring in the first month exists for exactly this."}, {"label": "Stop clozapine and never use it again, without any tests", "verdict": "ok", "outcome": "She is safe, but no one knows whether it was myocarditis or a harmless fever, and she loses the one medicine that worked.", "why": "Stopping is right, but testing tells you what happened and guides the future."}]}
:::

:::analogy The most powerful tool needs the most careful hands
Clozapine helps many people for whom nothing else worked. It is like a powerful machine with clear safety rules: follow the checklist and it is very safe; skip it and it can cause harm.
:::

:::recall
1. Define treatment resistance before clozapine. || Two adequate trials of different antipsychotics with good adherence.
2. What is the starting dose, and when must titration restart? || 12.5 mg; after missing 48 hours.
3. What plasma level is usually needed? || At least 350 ng/mL.
4. Name four red flags for patients to report. || Fever or sore throat, chest pain or breathlessness, constipation or belly pain, fits.
:::

:::mcq
Q: A man missed 3 days of clozapine. The safe way to restart is:
- His usual full dose
- *Restart titration from 12.5 mg
- Half his usual dose
- Double dose to catch up
> After missing more than 48 hours, re-titrate to avoid collapse and seizures.
:::

## 3.5 Level check · Beginner [beginner]
Twelve or more right out of fifteen (80%) opens the Advanced level.

:::mcq
Q: Raised prolactin from antipsychotics is due to blockade in the:
- Mesolimbic pathway
- Nigrostriatal pathway
- *Tuberoinfundibular pathway
- Mesocortical pathway
> Dopamine from the hypothalamus normally holds prolactin down.

Q: The D2 occupancy above which movement side effects become common is about:
- 20%
- 50%
- *80%
- 100%
> The therapeutic window is about 65 to 80%.

Q: Which second-generation antipsychotic raises prolactin most?
- Quetiapine
- Aripiprazole
- *Risperidone
- Clozapine
> Risperidone, paliperidone and amisulpride.

Q: Which antipsychotic is weight-friendly and can lower prolactin?
- Olanzapine
- *Aripiprazole
- Clozapine
- Chlorpromazine
> A D2 partial agonist.

Q: Acute dystonia is treated with:
- Propranolol
- *An IM anticholinergic
- Valbenazine
- More haloperidol
> Relief in minutes.

Q: A man paces and says he cannot sit still a week after starting an antipsychotic. Best treatment:
- Increase the dose
- *Reduce the dose and add propranolol
- Add trihexyphenidyl only
- Start a second antipsychotic
> Akathisia.

Q: Tardive dyskinesia is best treated with:
- Anticholinergics
- *A VMAT2 inhibitor, after reviewing the antipsychotic
- Haloperidol at higher dose
- Lithium
> Anticholinergics can worsen it.

Q: The laboratory test that is very high in NMS is:
- Prolactin
- *Creatine kinase
- Sodium
- Lithium
> Muscle breakdown.

Q: Which feature favours NMS over serotonin syndrome?
- Clonus
- Hyperreflexia
- *Lead-pipe rigidity developing over days
- Onset within hours of a new drug
> Clonus and fast onset point to serotonin syndrome.

Q: On clozapine, the most important urgent test for fever and sore throat is:
- ECG
- *Neutrophil count
- Clozapine level
- Liver tests
> Severe neutropenia must be ruled out.

Q: A smoker on clozapine stops smoking. His clozapine level will:
- Fall
- Stay the same
- *Rise
- Become zero
> CYP1A2 induction is removed.

Q: Which depot needs 3 hours of observation after each injection?
- Haloperidol decanoate
- Paliperidone palmitate
- *Olanzapine pamoate
- Aripiprazole monthly
> Post-injection delirium sedation syndrome.

Q: Rapid tranquillisation with IM haloperidol is commonly combined in India with:
- Diazepam IM
- *Promethazine
- Chlorpromazine
- Ondansetron
> Sedation and protection against dystonia.

Q: In an older person with dementia, antipsychotics increase the risk of:
- Hair loss
- *Stroke and death
- Mania
- Hypoglycaemia
> Use only for severe, dangerous symptoms.

Q: The main risk of olanzapine in pregnancy is:
- Major birth defects
- *Weight gain and gestational diabetes
- Neural tube defects
- Lithium-like toxicity
> Screen glucose early.
:::
`;

export const text = p1 + advanced + examZone;
