import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { advanced } from "./stabilisers-2";
import { examZone } from "./stabilisers-3";

export const meta: ModuleMeta = {
  id: "stabilisers",
  num: 12,
  title: "Mood stabilisers, anxiolytics and sleep medicines",
  emoji: "⚖️",
  tagline: "From what keeps mood steady and what calms the brain, to lithium, valproate, lamotrigine, benzodiazepines and safer sleep, to ions, channels, genes and pregnancy",
  when: "Psychopharmacology",
  outcomes: [
    "Explain in plain words what a mood stabiliser is, what GABA does, and how lithium and a benzodiazepine travel through and leave the body",
    "Use lithium safely: levels, monitoring, side effects, toxicity and interactions, with Indian brands and typical doses",
    "Know the key risks of valproate, carbamazepine and lamotrigine, including HLA testing, titration and the rules for women and girls",
    "Explain how benzodiazepines, Z-drugs and newer sleep medicines work, when to use them, and how to stop them safely; treat insomnia with CBT-I first",
    "Explain lithium's renal handling and mechanisms, anticonvulsant channel pharmacology, GABA-A receptor subtypes, kinetic interactions and reproductive safety at postgraduate depth",
  ],
  writeTask:
    "On paper, from memory: lithium levels, the monitoring schedule, five side effects, the signs of toxicity by severity and five things that raise levels; one key danger and one key test each for valproate, carbamazepine and lamotrigine, with the lamotrigine titration and its two big interactions; the GABA-A receptor and where benzodiazepines, Z-drugs, alcohol and flumazenil act; a benzodiazepine taper using diazepam equivalents; and the five parts of CBT-I. Then check and correct in red.",
  activities: [
    act.lesson("ms-1", "Quiz: lithium", "Levels, toxicity and monitoring."),
    act.lesson("ms-2", "Quiz: valproate, lamotrigine and benzos", "The other mood stabilisers and sedatives."),
    act.scenarios("stabilisers", "Patient case: the summer of lithium", "A patient on lithium with a stomach bug."),
    act.detective("Clinic detective", "Guess the medicine from its clues."),
  ],
  noteId: "stabilisers",
};

const p1 = String.raw`

# Part 0 · Starting: steady moods, a calm brain and how these medicines travel

## 0.1 What a mood stabiliser is [core][starting]
In **bipolar disorder**, mood does not just dip and recover. It swings into episodes: **mania** (or its milder form, hypomania) and **depression**, often with well periods in between. A manic episode can bring days of little sleep, racing thoughts, spending, risky plans and sometimes psychosis. A depressive episode can be deep and dangerous.

A **mood stabiliser** is a medicine that treats one or both poles and, most importantly, **prevents new episodes**. The main ones are:
- **Lithium**, a simple salt, the oldest and best proven.
- Medicines first used for epilepsy: **valproate**, **carbamazepine**, **lamotrigine**.
- Several **antipsychotics** (quetiapine, olanzapine, aripiprazole, lurasidone and others), which also prevent or treat episodes.

:::analogy Shock absorbers
Life sends bumps: stress, lost sleep, a festival season of late nights, a fight at home. A healthy mood rides over them. In bipolar disorder the shock absorbers are worn, so a bump can throw the car into a ditch. A mood stabiliser is a new set of shock absorbers. It does not choose the road; it keeps the ride steady.
:::

:::widget moodline
{"prompt": "Here is one person's mood over two years, rated monthly (0 is their usual self). Which pattern is it?", "series": [0, 2.4, 2.8, 1.2, 0, -0.5, -2.2, -2.6, -2.4, -1, 0, 0.2, 0, 2.5, 2.9, 1, 0, -2, -2.5, -1.5, 0, 0, 0.2, 0], "labels": ["Jan", "Apr", "Jul", "Oct", "Jan", "Apr", "Jul", "Oct"], "options": ["Ordinary ups and downs", "Recurrent depression only", "Episodes of mania and depression with well periods: bipolar disorder", "A single long depression"], "answer": 2, "why": "The line rises well above the high line, falls well below the low line, and returns to normal in between. That is the classic bipolar pattern that mood stabilisers aim to flatten."}
:::

### What they are not
- Not sleeping pills or tranquillisers, though some are sedating.
- Not quick fixes: prevention is judged over months and years.
- Not interchangeable: each has its own strengths and dangers.

:::recall
1. What is the main job of a mood stabiliser? || To treat episodes and, above all, prevent new ones.
2. Name the oldest and best-proven mood stabiliser. || Lithium.
3. Name three anticonvulsants used as mood stabilisers. || Valproate, carbamazepine, lamotrigine.
:::

:::mcq
Q: Which statement about mood stabilisers is TRUE?
- They work in one dose
- *They are judged mainly by how well they prevent new episodes over months and years
- They are all the same
- They are tranquillisers
> Prevention is the main aim.
:::

## 0.2 GABA: the brain's brake, and medicines that press it [core][starting]
The brain balances an accelerator and a brake. **Glutamate** is the main accelerator. **GABA** is the main brake. When GABA binds its receptor (the **GABA-A receptor**), a channel opens and lets chloride into the neuron, making it less likely to fire.

:::widget receptor
{"receptor": "GABA-A (benzodiazepine site)", "title": "Four kinds of key at the benzodiazepine site", "caption": "The benzodiazepine site is a second lock on the GABA-A receptor. Diazepam acts like a full agonist there: it makes GABA work much harder. Flumazenil is an antagonist: it sits in the site and blocks benzodiazepines, which is why it reverses an overdose. Some experimental compounds are inverse agonists: they make GABA work less and cause anxiety and seizures. Partial agonists were tried as calming drugs with less dependence."}
:::

### Medicines that strengthen the brake
| Medicine group | Examples | Main use |
|---|---|---|
| Benzodiazepines | Lorazepam, clonazepam, diazepam, alprazolam, chlordiazepoxide | Short-term anxiety, alcohol withdrawal, seizures, catatonia, agitation |
| Z-drugs | Zolpidem, zopiclone | Short-term insomnia |
| Neurosteroids | Zuranolone, brexanolone | Postpartum depression |
| Others acting nearby | Alcohol, barbiturates | Not medicines of choice; dangerous together |

### Why "strengthening the brake" has a cost
The brain adapts. After weeks of help, the receptors become less responsive (**tolerance**) and the brain expects the medicine (**dependence**). Stop suddenly and the brake suddenly fails: anxiety, sleeplessness, shaking, and after long or heavy use, seizures.

:::widget brainmap
{"title": "Where calming medicines act", "focus": ["amygdala", "prefrontal", "thalamus", "hypothalamus", "cerebellum", "hippocampus"], "notes": {"amygdala": "The alarm centre. Benzodiazepines quieten it quickly, easing fear.", "prefrontal": "Judgement and planning. Sedatives dull it, so reaction time and decisions suffer, which is why driving is unsafe.", "thalamus": "The relay that keeps the cortex awake; GABA here helps switch on sleep.", "hypothalamus": "The sleep and wake switch, and the orexin cells that newer sleep medicines block.", "cerebellum": "Balance. Sedatives and lithium toxicity both make people unsteady, which is why falls rise.", "hippocampus": "Memory. Benzodiazepines can blank out memories formed while the drug is acting."}, "caption": "Tap each region. The same calming effect that relieves panic also slows reactions, dulls memory and causes falls."}
:::

:::recall
1. Name the brain's main accelerator and brake. || Glutamate; GABA.
2. What does a benzodiazepine do at the GABA-A receptor? || Makes GABA work more strongly (more chloride channel opening).
3. What reverses a benzodiazepine, and how? || Flumazenil, an antagonist at the benzodiazepine site.
4. Define tolerance and dependence. || Less effect with time; the body comes to need the drug, with withdrawal on stopping.
:::

:::mcq
Q: Why are alcohol and benzodiazepines dangerous together?
- They cancel each other out
- *Both strengthen the brain's GABA brake, and together they can stop breathing
- Alcohol blocks benzodiazepines
- They cause serotonin syndrome
> Combined sedation and breathing suppression.
:::

## 0.3 How these medicines travel, and how they leave [core][starting]
Lithium is unusual. It is not a complex molecule but a simple charged particle, like sodium. The liver does not break it down at all. It is removed almost entirely by the **kidneys**, which handle it much as they handle sodium and water. That one fact explains most of lithium's dangers.

:::widget journey
{"drug": "lithium", "target": "enzymes inside neurons (inositol monophosphatase and GSK-3) that tune signalling and body-clock genes", "routes": ["oral"], "notes": {"mouth": "A lithium carbonate tablet, often a slow-release one such as Lithosun SR or Intalith CR, is swallowed, usually once at night.", "gut": "Lithium is absorbed almost completely. Slow-release tablets spread this over hours, which lowers the peak and some side effects.", "liver": "Nothing happens here. Lithium is not metabolised at all, so liver disease and liver enzyme interactions do not matter.", "blood": "Lithium is not bound to proteins. It spreads through body water, so dehydration concentrates it.", "bbb": "It crosses into the brain slowly. Brain levels lag behind blood levels, which is why toxicity can persist after the blood level falls.", "out": "The kidneys filter lithium and take most of it back, just as they take back sodium. When the body is short of salt or water (heat, vomiting, diarrhoea, fever, water tablets, ibuprofen), the kidneys hold on to more lithium, and the level climbs."}, "caption": "Press Play. At the last stop, imagine a hot Chennai afternoon, two days of loose motions, and a strip of ibuprofen: three things that all make the kidney keep more lithium."}
:::

:::widget journey
{"drug": "a benzodiazepine (diazepam, lorazepam or midazolam)", "target": "the benzodiazepine site on GABA-A receptors throughout the brain", "routes": ["oral", "iv", "nasal"], "notes": {"mouth": "Diazepam tablets are absorbed fast; calm can begin within half an hour.", "liver": "Diazepam is changed by the liver into long-lasting active products, so its effect can linger for days, especially in older people. Lorazepam is simply joined to a sugar and removed, so it is preferred in liver disease.", "vein": "In a prolonged seizure, lorazepam or diazepam into a vein reaches the brain within minutes.", "nose": "Midazolam sprayed into the nose or placed inside the cheek stops seizures at home or in an ambulance when there is no vein access.", "blood": "Most benzodiazepines are highly bound to blood proteins and are very fat-soluble.", "bbb": "Fat-soluble molecules cross quickly: this is why diazepam acts fast. It then spreads into body fat, which is why a single dose wears off sooner than its long half-life suggests.", "out": "Removed by the liver and kidneys. Half-lives range from a few hours (alprazolam, midazolam) to days (diazepam with its active metabolites)."}, "caption": "Switch between Tablet, Into a vein and Nasal spray. The route chosen depends on how fast calm is needed and whether a vein can be found."}
:::

:::widget curve
{"kind": "half-life", "title": "Short or long half-life: rebound or build-up", "caption": "Set a short half-life (like alprazolam): levels rise and fall sharply each day, so anxiety can rebound between doses and withdrawal starts fast. Set a long one (like diazepam): smooth levels, gentler withdrawal, but build-up over days, which matters in older people."}
:::

:::recall
1. How is lithium removed from the body? || Almost entirely by the kidneys, handled like sodium.
2. Why does dehydration raise lithium levels? || The kidneys hold on to more sodium and lithium when the body is short of salt and water.
3. Which benzodiazepine is preferred in liver disease, and why? || Lorazepam: no active metabolites, simple removal.
4. Which route of midazolam is used for seizures at home? || Nasal or inside the cheek (buccal).
:::

:::mcq
Q: A man on lithium has liver cirrhosis. Which statement is TRUE?
- Lithium is dangerous because the liver breaks it down
- *Lithium is not metabolised by the liver; kidney function and fluid balance matter more
- Lithium levels fall in liver disease
- Lithium cannot be used at all
> Lithium is handled by the kidneys.
:::

## 0.4 Level check · Starting [starting]
Twelve or more right out of fifteen (80%) opens the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: The main purpose of a mood stabiliser is to:
- Cause sleep
- *Treat episodes and prevent new ones
- Cure anxiety
- Replace therapy
> Prevention is central.

Q: The oldest and best-proven mood stabiliser is:
- Valproate
- *Lithium
- Clonazepam
- Zolpidem
> A simple salt.

Q: Lithium is removed from the body mainly by the:
- Liver
- *Kidneys
- Lungs
- Skin
> Handled like sodium.

Q: Which of these is most likely to raise a lithium level?
- Drinking more water
- *Two days of vomiting and diarrhoea
- Eating more salt
- Taking paracetamol
> Dehydration.

Q: The brain's main calming messenger is:
- Glutamate
- Dopamine
- *GABA
- Serotonin
> The brake.

Q: Benzodiazepines act at:
- Dopamine receptors
- *A site on the GABA-A receptor
- Serotonin pumps
- NMDA receptors
> They make GABA work harder.

Q: Flumazenil reverses benzodiazepines because it is:
- A full agonist
- *An antagonist at the benzodiazepine site
- A stimulant
- A GABA blocker
> It blocks the site.

Q: Taking a benzodiazepine every night for months often leads to:
- Better sleep forever
- *Tolerance and dependence
- Weight loss
- Mania
> The brain adapts.

Q: Stopping a long-used benzodiazepine suddenly can cause:
- Nothing
- *Rebound anxiety, insomnia and sometimes seizures
- Mania only
- Low blood pressure only
> Withdrawal.

Q: Which benzodiazepine is preferred in liver disease?
- Diazepam
- *Lorazepam
- Chlordiazepoxide
- Clonazepam
> No active metabolites.

Q: A benzodiazepine with a short half-life tends to cause:
- Build-up over days
- *Rebound symptoms between doses and faster withdrawal
- No dependence
- Longer sleep the next day
> Sharp rises and falls.

Q: Which medicine is NOT a mood stabiliser?
- Lithium
- Lamotrigine
- *Alprazolam
- Valproate
> Alprazolam is a benzodiazepine.

Q: Bipolar disorder is best described as:
- Ordinary mood ups and downs
- *Episodes of mania or hypomania and depression, often with well periods between
- Depression only
- A personality type
> The poles.

Q: Why does driving become unsafe on sedatives?
- They cause blindness
- *They slow reactions and dull judgement
- They raise blood pressure
- They cause hunger
> Prefrontal and cerebellar effects.

Q: Which route of midazolam can stop a seizure at home?
- Into a vein
- *Into the nose or inside the cheek
- Skin patch
- Eye drops
> Fast absorption without a vein.
:::

# Part I · Mood stabilisers

## 1.1 Lithium [core][beginner]
The oldest and best-proven mood stabiliser. It prevents mania and depression, treats mania, augments antidepressants, and **reduces suicide**.

:::define Levels
Take blood **12 hours after the last dose**, about **5 to 7 days** after starting or changing the dose. Usual maintenance is about **0.6 to 0.8 mmol/L**, rising to 0.8 to 1.0 if relapses continue; acute mania often needs about 0.8 to 1.0 with close monitoring; older adults usually lower (about 0.4 to 0.7). Lithium has a **narrow therapeutic range**: the toxic level is close to the useful one.
:::

### Before starting and monitoring
| When | What |
|---|---|
| Baseline | Kidney function (creatinine, eGFR), thyroid (TSH), calcium, weight, ECG if heart disease or risk factors, pregnancy test |
| Early | Level after 5 to 7 days and after every dose change, until stable |
| Ongoing | Level every 3 months for the first year, then every 6 months if stable (every 3 months in older adults, those on interacting drugs or with kidney concerns); kidney and thyroid every 6 months; calcium and weight yearly |

:::widget guess
{"prompt": "After starting lithium or changing the dose, about how many days should pass before a level is checked?", "min": 0, "max": 21, "unit": "days", "answer": [5, 7], "reveal": "About 5 to 7 days. Lithium's half-life is about a day, so it takes about five days to settle at a new steady level. A level checked sooner underestimates where it will end up. The sample is taken about 12 hours after the last dose.", "clinician": "Half-life about 18 to 36 hours (longer in older adults and with kidney impairment); steady state at about 5 days. Draw a 12-hour trough; once-daily night dosing gives levels about 10 to 25% higher at 12 hours than divided dosing."}
:::

### Side effects
| Common | Longer term |
|---|---|
| Thirst, passing lots of urine | **Hypothyroidism** (common; treat with thyroxine and usually continue lithium) |
| Fine tremor | **Kidney**: nephrogenic diabetes insipidus; slow decline in kidney function in some |
| Nausea, loose stools (early) | Hyperparathyroidism (raised calcium) |
| Weight gain, acne, worsening psoriasis | Heart conduction changes |
| Metallic taste | In pregnancy: a small rise in heart malformation risk |

:::safety Lithium toxicity
Often above 1.5 mmol/L, but it can occur within range in older adults.
- **Mild to moderate**: coarse tremor, vomiting, diarrhoea, unsteadiness (ataxia), slurred speech, muscle twitching.
- **Severe**: confusion, drowsiness, fits, arrhythmias, coma, kidney failure.
- **Management**: stop lithium, check level, kidney function and electrolytes, IV fluids (saline), monitor ECG; **haemodialysis** for severe toxicity or kidney failure.
:::

### What raises lithium levels
- **Dehydration**: heat, fever, vomiting, diarrhoea, low fluid intake, fasting.
- **NSAIDs** (ibuprofen, diclofenac), **ACE inhibitors** and ARBs, **thiazide diuretics**.
- Low-salt diets; kidney impairment; older age.

:::mnemonic Lithium's enemies: DANT
**D**ehydration · **A**CE inhibitors and ARBs · **N**SAIDs · **T**hiazides.
:::

:::widget flow
{"title": "Lithium toxicity: from the first sign to the right response", "layout": "tree", "nodes": [{"id": "l0", "label": "A person on lithium is unwell", "detail": "Ask: vomiting, diarrhoea, fever, heat, new tablets, less to drink? Then check the level, kidney function, sodium and an ECG."}, {"id": "l1", "label": "Fine tremor, thirst, level in range", "parent": "l0", "detail": "Usual side effects. Review dose timing, fluids and caffeine; propranolol can help tremor."}, {"id": "l2", "label": "Coarse tremor, vomiting, diarrhoea, unsteady, slurred", "parent": "l0", "detail": "Moderate toxicity, even if the level looks only a little high."}, {"id": "l3", "label": "Confusion, drowsy, jerks, fits, arrhythmia", "parent": "l0", "detail": "Severe toxicity: an emergency at any level."}, {"id": "a1", "label": "Continue with adjustments", "parent": "l1"}, {"id": "a2", "label": "Stop lithium, IV saline, recheck level and kidney function, find the cause", "parent": "l2"}, {"id": "a3", "label": "Emergency care: stop lithium, fluids, cardiac monitoring, haemodialysis", "parent": "l3"}], "caption": "Tap each branch. Symptoms count more than the number: an older person can be toxic within the usual range."}
:::

:::widget decide
{"scene": "Mr Patel, 62, a shopkeeper in Ahmedabad, has taken lithium for bipolar disorder for 15 years. In May the temperature is 44 °C. He has had loose motions for two days and has been taking diclofenac for knee pain from a local pharmacy. His son brings him in: he is shaky, vomiting, slurring his words and walking unsteadily. His lithium level is 1.9 mmol/L.", "ask": "What do you do?", "choices": [{"label": "Tell him to skip tonight's dose and drink more water at home", "verdict": "harm", "outcome": "By morning he is drowsy and has a seizure. His kidneys are failing.", "why": "These are signs of moderate to severe toxicity with dehydration and an NSAID. Home care is not safe."}, {"label": "Stop lithium and diclofenac, admit for IV saline, check kidney function, electrolytes and ECG, repeat the level, and involve the medical team about dialysis if he worsens or kidneys fail", "verdict": "best", "outcome": "With fluids his level falls over two days and he recovers fully. He leaves with written sick-day rules and paracetamol for his knee.", "why": "Stop the drug, rehydrate, monitor heart and kidneys, and remove the causes: heat, diarrhoea and an NSAID."}, {"label": "Give activated charcoal and send him home", "verdict": "harm", "outcome": "His level stays high because charcoal does not bind lithium.", "why": "Charcoal is useless for lithium. He needs fluids and monitoring."}]}
:::

:::word Patient advice line
"Take it at the same time daily. Drink enough water, more in summer or if you have fever, vomiting or loose motions. Don't take painkillers like ibuprofen or diclofenac without asking. If you get shaky hands, vomiting, diarrhoea or feel unsteady, stop it and come in that day. Never stop it suddenly on your own: that can bring back mania."
:::

:::student
### Typical adult doses (for learning; check current guidelines)
| Medicine | Typical adult daily range |
|---|---|
| Lithium carbonate | 400 to 1200 mg, adjusted to the blood level |
:::

:::clinician
### Lithium dosing (for learning; check current guidelines)
| Point | Detail |
|---|---|
| Indian brands | Licab, Lithosun SR, Intalith CR |
| Start | 300 to 400 mg at night (200 mg or less in older adults or reduced kidney function) |
| Titrate | Adjust by 200 to 300 mg steps to the target level, checking a 12-hour trough 5 to 7 days after each change |
| Usual | 600 to 1200 mg a day; doses vary widely between people |
| Targets | 0.6 to 0.8 mmol/L maintenance (0.8 to 1.0 if relapses continue); 0.8 to 1.0 in acute mania; 0.4 to 0.8 in older adults and for antidepressant augmentation |
| Brands | Not interchangeable without rechecking levels: release patterns differ |
| Receptor and target profile | No receptor binding: inhibits inositol monophosphatase and GSK-3 beta, modulates second messengers and circadian genes |
| Stopping | Taper over at least 4 weeks, ideally longer, to reduce rebound mania |
:::

:::recall
1. When do you take a lithium level, and what is the maintenance range? || 12 hours after the last dose, 5 to 7 days after a change; about 0.6 to 0.8 mmol/L.
2. List the baseline tests before lithium. || Kidney, thyroid, calcium, weight, ECG if indicated, pregnancy test.
3. Name the signs of mild and severe lithium toxicity. || Coarse tremor, vomiting, diarrhoea, ataxia, slurred speech; confusion, fits, arrhythmia, coma.
4. What raises lithium levels? || Dehydration, ACE inhibitors and ARBs, NSAIDs, thiazides, low salt.
:::

:::mcq
Q: A woman on lithium has a level of 0.8 mmol/L taken 4 hours after her morning dose. What do you conclude?
- Her level is right in range
- *The sample was taken at the wrong time; repeat it 12 hours after the last dose
- She is toxic
- She is not taking it
> Lithium levels are valid only at trough, about 12 hours after the dose.

Q: A man stable on lithium is started on ibuprofen for back pain by his GP. The main risk is:
- Lithium level falls
- *Lithium level rises toward toxicity
- No interaction
- Kidney stones only
> NSAIDs, ACE inhibitors and thiazides raise lithium levels.
:::

## 1.2 Valproate [core][beginner]
- Effective for mania, mixed states and rapid cycling; also epilepsy and migraine prevention.
- Acts on sodium channels, raises GABA, and changes gene expression (it inhibits histone deacetylase).
- Side effects: nausea, **weight gain**, tremor, **hair loss**, sedation, raised ammonia, **polycystic ovaries** and menstrual problems.
- Serious: **liver toxicity** (highest risk in young children), **pancreatitis**, low platelets.
- Monitor: liver function and blood count at baseline and in the first months; weight; periods.

:::trap Valproate in women and girls
Valproate is highly teratogenic: **neural tube defects** (spina bifida) and other malformations in about 1 in 10 exposed babies, and **lower IQ, autism and ADHD** in up to 3 or 4 in 10 children exposed in the womb. It must not be used in girls and women who could become pregnant unless there is no alternative and a pregnancy prevention plan is in place.
:::

:::widget decide
{"scene": "Pooja, 19, a college student in Jaipur, has had two manic episodes. In the emergency department she was started on valproate (Encorate Chrono) by a junior doctor. She has a boyfriend, does not use contraception, and her family wants her married soon. She comes for follow-up.", "ask": "What is the best plan?", "choices": [{"label": "Continue valproate; she is not planning a pregnancy now", "verdict": "harm", "outcome": "Eight months later she is pregnant at 10 weeks. The baby is born with spina bifida and later has learning difficulties.", "why": "Half of pregnancies are unplanned. Valproate's harm happens in the first weeks, often before a woman knows she is pregnant."}, {"label": "Explain the risks clearly and kindly; switch to an alternative such as an antipsychotic with evidence in mania (for example aripiprazole or quetiapine), or lithium with contraception advice, and plan long-term prevention with her", "verdict": "best", "outcome": "She chooses aripiprazole, stays well, and knows to talk to the team before trying for a baby.", "why": "Valproate should be avoided in girls and women who could become pregnant when other effective options exist. Shared decisions respect her future."}, {"label": "Continue valproate and tell her to take folic acid", "verdict": "harm", "outcome": "Folic acid does not prevent valproate's effects on brain development.", "why": "Folic acid lowers neural tube risk a little but does not make valproate safe."}]}
:::

:::student
### Typical adult doses (for learning; check current guidelines)
| Medicine | Typical adult daily range |
|---|---|
| Sodium valproate or divalproex | 750 to 2000 mg |
:::

:::clinician
### Valproate dosing (for learning; check current guidelines)
| Point | Detail |
|---|---|
| Indian brands | Valparin, Encorate (Chrono), Dicorate ER |
| Start | 500 to 750 mg a day in divided doses, or a loading dose of about 20 mg/kg in acute mania (inpatients) |
| Titrate | Increase every few days to response and tolerability |
| Usual | 1000 to 2000 mg a day; levels 50 to 100 mg/L as a rough guide (some need up to 125 in mania) |
| Receptor and target profile | Sodium channel block, raised GABA turnover, T-type calcium, histone deacetylase inhibition |
| Interactions | Inhibits glucuronidation: doubles lamotrigine levels; raises free phenytoin; carbapenem antibiotics drop valproate levels sharply |
| Women | Avoid in girls and women of childbearing potential; if no alternative, a formal pregnancy prevention programme |
| Men | UK regulators advise effective contraception for men taking valproate and their partners (since September 2024) and two-specialist agreement before starting it in men under 55 |
:::

:::recall
1. Name four common side effects of valproate. || Weight gain, hair loss, tremor, nausea (also sedation, polycystic ovaries).
2. Name two serious organ toxicities of valproate. || Liver toxicity and pancreatitis.
3. Why avoid valproate in women who could become pregnant? || Neural tube defects and lower IQ, autism and ADHD in exposed children.
:::

:::mcq
Q: A 22-year-old woman with bipolar disorder who may want children asks for valproate because a friend takes it. The key advice is:
- It is the safest in pregnancy
- *Valproate carries a high risk of birth defects and of lower IQ and autism in the child; choose another medicine
- It is fine with any contraception
- Only the dose matters
> Avoid valproate in women and girls who could become pregnant.
:::

## 1.3 Carbamazepine and oxcarbazepine [core][beginner]
- Used for mania (second-line), epilepsy and trigeminal neuralgia. Level about 4 to 12 mg/L.
- **Enzyme inducer** (CYP3A4 and others): lowers levels of many drugs, including the contraceptive pill, antipsychotics, antidepressants and itself (**auto-induction** over the first weeks).
- Side effects: dizziness, double vision, unsteadiness, rash, **hyponatraemia**.
- Serious: **Stevens-Johnson syndrome and toxic epidermal necrolysis**, especially with the **HLA-B*1502** gene variant, common in South and East Asian populations (test before starting where available); **aplastic anaemia and agranulocytosis** (rare); liver toxicity; teratogenic.
- Oxcarbazepine: similar, fewer interactions, more hyponatraemia.

:::widget sort
{"prompt": "Carbamazepine is a strong enzyme inducer. Which medicines will it lower?", "buckets": ["Level falls with carbamazepine", "Not much affected"], "items": [{"text": "The combined contraceptive pill", "bucket": 0, "why": "Contraceptive failure is a real risk; use another method."}, {"text": "Quetiapine", "bucket": 0}, {"text": "Lithium", "bucket": 1, "why": "Lithium is not metabolised by liver enzymes, though the two together can add neurotoxicity."}, {"text": "Haloperidol", "bucket": 0}, {"text": "Carbamazepine itself, after a few weeks", "bucket": 0, "why": "Auto-induction: the dose often needs raising after the first weeks."}, {"text": "Paliperidone", "bucket": 1, "why": "Mostly removed unchanged by the kidneys, but some drug transport effects can still lower it a little."}, {"text": "Warfarin", "bucket": 0}]}
:::

:::clinician
### Carbamazepine and oxcarbazepine (for learning; check current guidelines)
| Medicine | Indian brands | Start | Usual | Notes |
|---|---|---|---|---|
| Carbamazepine | Tegretol, Mazetol, Zen Retard | 200 mg twice daily | 400 to 1200 mg (up to 1600 mg) | Levels 4 to 12 mg/L; HLA-B*1502 before starting in people of South or East Asian ancestry; blood count, sodium, liver tests; auto-induction over 2 to 4 weeks |
| Oxcarbazepine | Oxetol, Trileptal | 300 mg twice daily | 600 to 1800 mg | Weaker inducer; more hyponatraemia; HLA-B*1502 also relevant |

Receptor and target profile: block of voltage-gated sodium channels in their inactivated state, reducing repetitive firing.
:::

:::recall
1. What does carbamazepine do to other drugs' levels? || Lowers many of them by inducing liver enzymes, including its own (auto-induction).
2. Which gene test matters before carbamazepine in Indian patients? || HLA-B*1502 (risk of SJS and TEN).
3. Which electrolyte falls on carbamazepine and oxcarbazepine? || Sodium.
:::

:::mcq
Q: Before starting carbamazepine in a patient of Indian origin, which test lowers the risk of a life-threatening rash?
- HLA-B*5801
- *HLA-B*1502
- TPMT
- G6PD
> HLA-B*1502 is linked to Stevens-Johnson syndrome with carbamazepine.
:::

## 1.4 Lamotrigine [core][beginner]
- Mainly **prevents bipolar depression**; little effect on mania.
- Main risk: **serious rash** (including SJS), reduced by **very slow dose titration** over weeks. Stop if a rash appears and seek advice.
- **Valproate doubles lamotrigine levels**: halve the lamotrigine dose and titrate even more slowly. Carbamazepine and the combined pill lower it.
- Relatively safer in pregnancy than valproate; weight-neutral; little sedation.

:::widget guess
{"prompt": "Lamotrigine is built up slowly to avoid rash. Starting at 25 mg a day, about how many weeks does it take to reach the usual 200 mg target?", "min": 1, "max": 12, "unit": "weeks", "answer": [5, 6], "reveal": "About 5 to 6 weeks: 25 mg for two weeks, 50 mg for two weeks, then 100 mg, then 200 mg. With valproate it is slower still, and the target is lower. If lamotrigine is stopped for more than about five days, the build-up starts again from the beginning.", "clinician": "Monotherapy: 25 mg daily for weeks 1 to 2, 50 mg for weeks 3 to 4, 100 mg in week 5, 200 mg from week 6. With valproate: 25 mg on alternate days for weeks 1 to 2, 25 mg daily for weeks 3 to 4, 50 mg in week 5, 100 mg from week 6. With carbamazepine (without valproate): 50 mg for weeks 1 to 2, 100 mg for weeks 3 to 4, then 200, 300 and 400 mg."}
:::

| Medicine | Best for | Biggest danger | Key monitoring |
|---|---|---|---|
| Lithium | Mania, maintenance, suicide prevention | Toxicity (narrow range) | Levels, kidney, thyroid, calcium |
| Valproate | Mania, mixed, rapid cycling | Teratogenicity, liver, pancreas | Liver, blood count, weight |
| Carbamazepine | Second-line mania | SJS (HLA-B*1502), aplastic anaemia, interactions | Blood count, sodium, liver |
| Lamotrigine | Preventing bipolar depression | Rash and SJS | Slow titration; watch skin |

:::clinician
### Lamotrigine (for learning; check current guidelines)
- Indian brands: Lametec, Lamitor, Lamictal.
- Usual maintenance 200 mg (100 mg with valproate; up to 400 mg with inducers).
- Combined oestrogen pill can halve levels; levels rise again in the pill-free week. Pregnancy lowers levels progressively; they rise quickly after delivery, so the dose must be reduced.
- Receptor and target profile: voltage-gated sodium channel block, reduced glutamate release.
:::

:::recall
1. Which pole does lamotrigine mainly prevent? || Depression.
2. What does valproate do to lamotrigine levels? || Doubles them.
3. What must happen if lamotrigine is stopped for more than about five days? || Restart the slow titration from the beginning.
4. What lowers lamotrigine levels? || Carbamazepine, the combined oestrogen pill, pregnancy.
:::

:::mcq
Q: A patient on valproate is started on lamotrigine. The correct approach is:
- Usual lamotrigine dose
- *Halve the lamotrigine dose and titrate more slowly
- Double the lamotrigine dose
- Stop valproate first always
> Valproate roughly doubles lamotrigine levels, raising rash risk.
:::

## 1.5 Lithium in practice: who responds, starting, stopping, kidney and thyroid [core][beginner]
### Who responds best
| Better response | Poorer response |
|---|---|
| Classic **euphoric mania** | Mixed features, rapid cycling |
| **Mania, then depression, then a well interval** (M-D-I pattern) | Depression-mania-interval pattern |
| Full recovery between episodes | Residual symptoms between episodes |
| **Family history of bipolar disorder**, especially of lithium response | Comorbid substance use |
| Few previous episodes | Many episodes before starting |

### Starting and stopping
- Usual start 300 to 400 mg at night, adjusting by level. Older people and those with kidney problems need lower doses.
- Once-daily dosing at night is common and may be kinder to the kidneys.
- **Do not stop suddenly**: abrupt stopping raises the risk of **rebound mania** and suicide. Taper over at least 4 weeks, ideally longer.
- **Lithium and suicide**: lithium lowers suicide and self-harm in mood disorders more than other mood stabilisers; this is one reason it remains first choice for maintenance.

### Kidney and thyroid in practice
- **Polyuria and polydipsia** (nephrogenic diabetes insipidus) are common and usually not dangerous; check fluid intake and sodium. Amiloride can help under specialist advice.
- A **steady fall in eGFR** needs discussion with the patient and a physician: options include a lower target level, once-daily dosing, or switching. Do not stop lithium in a panic over one result.
- **Hypothyroidism**: add thyroxine, continue lithium.

:::widget flow
{"title": "How the kidney handles lithium, and why sick days matter", "layout": "chain", "nodes": [{"id": "k1", "label": "Filtered", "detail": "Lithium in the blood is freely filtered into the kidney tubules, like sodium."}, {"id": "k2", "label": "Taken back with sodium", "detail": "About three quarters is reabsorbed in the first part of the tubule, through the same routes as sodium and water."}, {"id": "k3", "label": "Short of salt or water", "detail": "Heat, sweating, vomiting, diarrhoea, fasting, a low-salt diet or a thiazide make the kidney grab more sodium, and lithium comes back with it."}, {"id": "k4", "label": "Less blood flow to the kidney", "detail": "NSAIDs and ACE inhibitors reduce filtering pressure, so less lithium is cleared."}, {"id": "k5", "label": "Level rises", "detail": "A stable level can climb into the toxic range within days, without any change in dose."}], "caption": "Press Play. Every step is a chance for a sick-day rule: pause lithium during vomiting or diarrhoea, drink enough, and avoid NSAIDs."}
:::

:::analogy A narrow mountain path
Lithium works on a narrow path: a little too low and it does nothing, a little too high and it is toxic. Anything that pushes the patient sideways (fever, vomiting, a painkiller, a new blood pressure tablet) can tip them off. That is why levels and patient education matter so much.
:::

:::recall
1. Give three predictors of good lithium response. || Euphoric mania, M-D-I pattern, full inter-episode recovery (also family history of response).
2. What is the risk of stopping lithium abruptly? || Rebound mania and suicide.
3. What do you do if lithium causes hypothyroidism? || Add thyroxine and usually continue lithium.
4. Why do thiazides raise lithium levels? || The kidney reabsorbs more sodium, and lithium with it.
:::

:::mcq
Q: Which patient is most likely to respond well to lithium?
- Rapid cycling with cannabis use
- *Classic euphoric mania, full recovery between episodes, a parent who did well on lithium
- Mixed episodes with residual symptoms
- First episode at 60 after a stroke
> Classic course and family history of lithium response predict benefit.
:::

## 1.6 Choosing a mood stabiliser [core][beginner]
### Antipsychotics as mood stabilisers
| Medicine | Mania | Bipolar depression | Maintenance |
|---|---|---|---|
| Quetiapine | Yes | **Yes** | Yes |
| Olanzapine | Yes | With fluoxetine | Yes (metabolic cost) |
| Aripiprazole | Yes | No | Prevents mania (also a monthly injection) |
| Risperidone | Yes | No | Long-acting injection prevents mania |
| **Lurasidone** | No | **Yes** | Limited |
| Cariprazine | Yes | Yes | Some evidence |
| Lumateperone | No | Yes (US) | Limited |
| Haloperidol | Yes (short term) | No | No |

### Matching the medicine to the person
| Situation | Reasonable first choice | Avoid |
|---|---|---|
| Classic euphoric mania, family history of lithium response | **Lithium** | |
| Mixed features or rapid cycling | Valproate (not in women who could become pregnant) or an antipsychotic | Antidepressants |
| Recurrent bipolar depression | Lamotrigine, quetiapine, lurasidone, or lithium | Antidepressant alone |
| Woman who could become pregnant | Lithium, lamotrigine or an antipsychotic, with contraception advice | **Valproate**, carbamazepine |
| Kidney disease | Lamotrigine or an antipsychotic | Lithium |
| Obesity, diabetes | Lithium, lamotrigine, aripiprazole, lurasidone | Olanzapine, clozapine, valproate |
| Poor adherence | Long-acting injectable antipsychotic | |
| Severe mania with danger | Antipsychotic plus lithium or valproate; ECT if needed | |

:::widget flow
{"title": "Choosing for long-term prevention", "layout": "tree", "nodes": [{"id": "p0", "label": "Bipolar disorder needing prevention", "detail": "Start from the person's history: which pole dominates, past response, health, plans for pregnancy, preference."}, {"id": "p1", "label": "Mostly manic relapses", "parent": "p0", "detail": "Lithium first; or aripiprazole, quetiapine, olanzapine, a long-acting injection."}, {"id": "p2", "label": "Mostly depressive relapses", "parent": "p0", "detail": "Lamotrigine, quetiapine, lithium; lurasidone for acute episodes."}, {"id": "p3", "label": "Could become pregnant", "parent": "p0", "detail": "Avoid valproate and carbamazepine; plan with her."}, {"id": "p4", "label": "Kidney disease or unable to have blood tests", "parent": "p0", "detail": "Avoid lithium; antipsychotic or lamotrigine."}, {"id": "p5", "label": "Weight, diabetes", "parent": "p0", "detail": "Avoid olanzapine, clozapine and valproate where possible."}], "caption": "Tap each branch. Most people fit more than one branch, and the choice is a balance agreed with them."}
:::

### Mood stabilisers in pregnancy and breastfeeding
| Medicine | Pregnancy | Breastfeeding |
|---|---|---|
| Lithium | Small rise in heart malformation risk; levels fall in pregnancy and **rise sharply after delivery**; detailed fetal heart scan; frequent levels | Generally avoided, or used with close infant monitoring |
| Valproate | **Avoid**: neural tube defects, lower IQ, autism | Low levels in milk, but avoid if a future pregnancy is possible without contraception |
| Carbamazepine | Neural tube defects, facial anomalies | Usually compatible |
| Lamotrigine | **Relatively safer**; levels fall in pregnancy | Usually compatible; watch the infant for rash |
| Antipsychotics (quetiapine, olanzapine, aripiprazole) | Relatively safer; watch gestational diabetes | Usually compatible |

- Women on anticonvulsants planning pregnancy are offered folic acid (often at a higher dose of 5 mg).
- The **postpartum period** carries a very high relapse risk in bipolar disorder, including **postpartum psychosis**: plan ahead.

:::widget decide
{"scene": "Meenal, 30, an IT engineer in Bengaluru, has bipolar disorder kept well on lithium for six years after two severe manic episodes. She and her husband want a baby. Her mother-in-law has told her to 'stop all tablets before trying'.", "ask": "What is the best plan?", "choices": [{"label": "Stop lithium now and try for a baby", "verdict": "harm", "outcome": "She relapses into mania in the first trimester, is admitted, and needs high-dose antipsychotics in pregnancy.", "why": "Stopping lithium, especially suddenly, carries a high relapse risk; relapse in pregnancy and after birth is dangerous."}, {"label": "Plan together: discuss the small heart risk with lithium against the high relapse risk without it; options include continuing lithium with folic acid, early fetal heart scanning and frequent levels, or a planned switch; arrange perinatal care and a written plan for delivery and the weeks after", "verdict": "best", "outcome": "She chooses to continue lithium. Levels are checked monthly, then weekly late in pregnancy. The dose is reduced at delivery and she is seen often after birth. She and the baby are well.", "why": "A planned, shared decision weighing both sets of risks, with close monitoring around delivery when lithium levels can surge, protects mother and baby."}, {"label": "Switch to valproate because it is 'easier to monitor'", "verdict": "harm", "outcome": "The pregnancy is exposed to the most teratogenic mood stabiliser.", "why": "Valproate is the option to avoid most in pregnancy."}]}
:::

:::recall
1. Which antipsychotics treat bipolar depression? || Quetiapine, lurasidone, cariprazine, lumateperone (and olanzapine with fluoxetine).
2. Which mood stabiliser is avoided in women who could become pregnant? || Valproate.
3. What happens to lithium levels after delivery? || They rise sharply.
4. Which mood stabiliser is avoided in kidney disease? || Lithium.
:::

:::mcq
Q: A man with bipolar disorder has obesity and diabetes. For maintenance, which is the least suitable?
- Lithium
- Lamotrigine
- Aripiprazole
- *Olanzapine
> Olanzapine worsens weight and glucose.
:::

# Part II · Anxiolytics and hypnotics

## 2.1 Benzodiazepines [core][beginner]
:::define How they work
Benzodiazepines are **positive allosteric modulators of the GABA-A receptor**: they bind a site between the alpha and gamma subunits and make GABA, the brain's main calming transmitter, more effective (more frequent opening of the chloride channel). On their own, without GABA, they do nothing, which is part of why they are safer than barbiturates.
:::

| Effect | Clinical use |
|---|---|
| Anxiolytic | Short-term severe anxiety, panic (as a bridge) |
| Hypnotic | Short-term insomnia |
| Anticonvulsant | Status epilepticus, febrile seizures |
| Muscle relaxant | Spasm |
| Amnesic, sedative | Procedures |
| Others | **Alcohol withdrawal** (chlordiazepoxide, diazepam, lorazepam), **catatonia** (lorazepam), acute agitation, akathisia |

| Drug (Indian brands) | Duration | Notes |
|---|---|---|
| Alprazolam (Alprax, Restyl, Trika) | Short | Strong dependence and rebound anxiety; commonly misused |
| Lorazepam (Ativan, Larpose) | Short to intermediate | No active metabolites; safer in liver disease; catatonia |
| Clonazepam (Rivotril, Lonazep, Petril) | Long | Panic, akathisia; widely prescribed in India |
| Diazepam (Valium, Calmpose) | Long (active metabolites) | Withdrawal regimens, seizures |
| Chlordiazepoxide (Librium) | Long | Alcohol withdrawal |

### Risks
- **Tolerance and dependence** (can develop within weeks), misuse.
- **Withdrawal**: anxiety, insomnia, irritability, tremor, sweating, perceptual changes, and **seizures** if stopped suddenly after long use.
- Sedation, poor memory and concentration, **falls and fractures** in older adults, road accidents.
- **Respiratory depression** with alcohol, opioids or in lung disease (sleep apnoea, COPD).
- Paradoxical agitation (children, older adults, learning disability).

:::define Prescribing rules
Use the lowest dose for the **shortest time: about 2 to 4 weeks**. Explain dependence risk at the start. Stop long-term use **gradually**, often after switching to a long-acting drug such as diazepam.
:::

:::safety Overdose
Benzodiazepines alone are rarely fatal, but with alcohol or opioids they can stop breathing. **Flumazenil** reverses them but can provoke seizures in dependent patients or mixed overdoses (especially with tricyclics); support breathing first.
:::

:::clinician
### Benzodiazepine dosing (for learning; check current guidelines)
| Medicine | Indian brands | Typical adult dose | Half-life (approximate) | Notes |
|---|---|---|---|---|
| Lorazepam | Ativan, Larpose, Trapex | 0.5 to 2 mg up to three times daily; catatonia 1 to 2 mg, repeated | 10 to 20 hours | Glucuronidated; IM and IV forms |
| Clonazepam | Rivotril, Lonazep, Petril | 0.25 to 2 mg a day | 20 to 50 hours | Panic; akathisia; often continued too long |
| Diazepam | Valium, Calmpose | 2 to 10 mg up to three times daily | 20 to 100 hours (metabolite longer) | Taper vehicle; alcohol withdrawal |
| Alprazolam | Alprax, Restyl, Trika | 0.25 to 0.5 mg up to three times daily | 6 to 12 hours | Avoid starting where possible; strong rebound |
| Chlordiazepoxide | Librium | Alcohol withdrawal: 10 to 30 mg four times daily, reducing over 5 to 7 days (higher in severe withdrawal) | 5 to 30 hours (metabolites longer) | Libotryp is a combination with amitriptyline: avoid |

Receptor profile: positive allosteric modulators at alpha1, 2, 3 and 5 containing GABA-A receptors (alpha1: sedation and amnesia; alpha2 and 3: anxiolysis and muscle relaxation; alpha5: memory).
:::

:::widget decide
{"scene": "Mrs Gupta, 79, in Lucknow, cannot sleep since her husband died. Her family doctor has given her promethazine at night, and a neighbour shared some alprazolam. She also takes oxybutynin for her bladder. Over two weeks she has become muddled, fell in the bathroom at night, and her daughter found her talking to people who are not there.", "ask": "What is your approach?", "choices": [{"label": "Add haloperidol for the hallucinations", "verdict": "harm", "outcome": "She becomes stiffer and falls again, fracturing her wrist.", "why": "This is delirium driven by sedative and anticholinergic burden. Another sedating drug adds to it."}, {"label": "Recognise delirium from stacked anticholinergic and sedative medicines: stop promethazine and oxybutynin, taper the alprazolam carefully rather than stopping it abruptly, check for infection, retention and sodium, and support her grief and sleep without tablets", "verdict": "best", "outcome": "Within a week her confusion clears. Grief counselling and a regular daily routine help her sleep.", "why": "Older people are very sensitive to anticholinergic drugs (promethazine, oxybutynin) and benzodiazepines; together they cause confusion, falls and delirium."}, {"label": "Switch her to zolpidem at night", "verdict": "harm", "outcome": "She sleepwalks, falls and is admitted.", "why": "Z-drugs carry similar risks of falls and confusion in older adults."}]}
:::

:::recall
1. How do benzodiazepines work? || Positive allosteric modulation of GABA-A, increasing chloride channel opening frequency.
2. Give five uses of benzodiazepines. || Short-term anxiety, insomnia, seizures, alcohol withdrawal, catatonia (also agitation, akathisia).
3. What is the usual maximum duration, and why? || About 2 to 4 weeks, because of tolerance and dependence.
4. What is the antidote, and its risk? || Flumazenil; it can trigger seizures in dependence or mixed overdose.
:::

:::mcq
Q: A 70-year-old on clonazepam for years has had two falls and is confused at night. Most likely contribution:
- None, benzodiazepines are safe
- *Benzodiazepine sedation and poor balance
- Clonazepam improves memory
- Dementia only
> Benzodiazepines raise falls and confusion in older people.
:::

## 2.2 Other anxiolytics and hypnotics [core][beginner]
| Medicine | Notes |
|---|---|
| Z-drugs (zolpidem, zopiclone) | Act on GABA-A (mainly alpha1); short-term insomnia; similar dependence risks; complex sleep behaviours (sleepwalking, sleep-driving, sleep-eating) |
| Melatonin and agonists | Sleep onset, jet lag, older adults, children with neurodevelopmental disorders |
| Orexin receptor antagonists (suvorexant, lemborexant, daridorexant) | Block the brain's wake signal; less dependence; next-day drowsiness; approved in the US (daridorexant in January 2022) |
| Sedating antihistamines (promethazine, hydroxyzine) | Short-term; anticholinergic; hangover; avoid in older adults |
| Low-dose sedating antidepressants (mirtazapine, trazodone, doxepin) | Insomnia with depression |
| Buspirone (Buspin) | GAD; 5-HT1A partial agonist; slow onset; no dependence |
| Pregabalin (Pregeb, Lyrica) | GAD; misuse potential, especially with opioids |
| Propranolol (Ciplar, Inderal) | Performance anxiety; dangerous in overdose |
| SSRIs and SNRIs | First-line for long-term anxiety disorders |

:::widget receptor
{"receptor": "5-HT1A", "title": "Buspirone: a partial key at the serotonin brake", "caption": "Pick Partial agonist. Buspirone acts at 5-HT1A receptors, not at GABA. It does not sedate or cause dependence, but it takes weeks to help and does nothing for a sudden panic attack, so people switching from a benzodiazepine often feel it is 'not working' at first."}
:::

:::recall
1. Name a complex sleep behaviour linked to Z-drugs. || Sleepwalking or sleep-driving (also sleep-eating).
2. How do orexin antagonists work? || They block the brain's wake-promoting orexin signal.
3. Why does buspirone not help an acute panic attack? || It acts slowly at 5-HT1A, not at GABA-A.
4. Which anxiolytic has misuse potential with opioids? || Pregabalin.
:::

:::mcq
Q: A man with GAD wants something without dependence risk that he can take long-term. A reasonable option is:
- Alprazolam
- Zolpidem
- *Buspirone or an SSRI
- Diazepam
> Buspirone and SSRIs carry no dependence risk.
:::

## 2.3 Treating insomnia properly [core][beginner]
:::define Insomnia disorder
Difficulty starting or keeping sleep, or waking early, on at least **3 nights a week for at least 3 months**, despite adequate opportunity, with daytime impairment.
:::

**CBT for insomnia (CBT-I) is first-line**, ahead of medicines:
1. **Stimulus control**: bed only for sleep (and sex); leave the bed if awake for more than about 20 minutes; same wake time daily.
2. **Sleep restriction**: limit time in bed to actual sleep time, then widen it as sleep improves.
3. **Sleep hygiene**: no caffeine after midday, limit alcohol and screens at night, regular routine, dark quiet room, daytime light and exercise.
4. **Cognitive work** on worry about sleep ("If I don't sleep 8 hours I'll fail").
5. **Relaxation**.

:::widget flow
{"title": "How short-term insomnia becomes long-term: the 3P model", "layout": "cycle", "nodes": [{"id": "i1", "label": "Predisposed", "detail": "A worrier, a light sleeper, a family history of insomnia."}, {"id": "i2", "label": "Precipitated", "detail": "An exam, a bereavement, a new baby, a night shift job: sleep breaks down."}, {"id": "i3", "label": "Perpetuated: more time in bed", "detail": "Going to bed early and lying in late to 'catch up' makes sleep shallow and broken."}, {"id": "i4", "label": "Perpetuated: worry and clock-watching", "detail": "'I'll never sleep' raises arousal; the bed becomes a place of struggle."}, {"id": "i5", "label": "Perpetuated: naps, caffeine, tablets", "detail": "Daytime naps and evening tablets or alcohol keep the cycle going."}, {"id": "i6", "label": "Insomnia keeps itself going", "detail": "The original cause has gone, but the habits and fears remain."}], "caption": "Press Play. CBT-I targets the perpetuating loop, which is why it works long after the course ends, while tablets work only while taken."}
:::

Look for causes: depression, anxiety, pain, sleep apnoea (snoring, daytime sleepiness), restless legs, shift work, caffeine, alcohol, medicines.

:::recall
1. Define insomnia disorder. || At least 3 nights a week for at least 3 months, with daytime impairment.
2. Name the five parts of CBT-I. || Stimulus control, sleep restriction, sleep hygiene, cognitive work, relaxation.
3. What keeps insomnia going in the 3P model? || Perpetuating factors: extra time in bed, worry, naps, caffeine, tablets.
:::

:::mcq
Q: A woman sleeps badly for 6 months, lies in bed for 10 hours awake, and naps in the afternoon. The first-line treatment is:
- Zolpidem nightly
- *CBT for insomnia: fixed wake time, sleep restriction, stimulus control
- A sedating antihistamine
- Alcohol at bedtime
> CBT-I works better long-term than tablets.
:::

## 2.4 Stopping benzodiazepines safely [core][beginner]
### Diazepam equivalents (approximate)
| Medicine | Dose roughly equal to 10 mg diazepam |
|---|---|
| Alprazolam | 0.5 mg |
| Clonazepam | 0.5 mg |
| Lorazepam | 1 mg |
| Chlordiazepoxide | 25 mg |
| Zolpidem | 20 mg |

### A taper plan
1. **Engage**: explain why, agree a pace the person can manage, and that symptoms during taper are expected and pass.
2. **Switch** a short-acting benzodiazepine (alprazolam) to an equivalent dose of a **long-acting** one (diazepam or clonazepam), in steps.
3. **Reduce slowly**: about **5 to 10% every 1 to 2 weeks**, slower towards the end. Total taper often takes **months**.
4. **Support**: CBT for anxiety and insomnia, sleep hygiene, relaxation.
5. **Do not rush the last steps**; pause rather than go back up if withdrawal is hard.

:::widget worked
{"title": "Converting alprazolam to diazepam", "steps": [{"q": "Ravi takes alprazolam 0.5 mg three times a day (1.5 mg a day). Using the table, what is his diazepam-equivalent dose?", "a": "0.5 mg alprazolam is about 10 mg diazepam, so 1.5 mg is about **30 mg diazepam** a day."}, {"q": "Do you switch all at once?", "a": "No. Swap one dose at a time over about a week, for example the night dose first (0.5 mg alprazolam to 10 mg diazepam), then the morning, then the afternoon."}, {"q": "How do you then reduce 30 mg diazepam?", "a": "By about 2 to 3 mg every 1 to 2 weeks at first, then 1 mg steps below about 10 mg, pausing if withdrawal is hard."}, {"q": "Roughly how long might this take?", "a": "Several months. A slow, steady taper the person controls is more successful than a fast one."}], "yourTurn": [{"q": "A woman takes clonazepam 1 mg at night. What is the diazepam equivalent?", "a": "About 20 mg diazepam (0.5 mg clonazepam is about 10 mg). Clonazepam is already long-acting, so many people simply taper the clonazepam itself in small steps."}]}
:::

### Benzodiazepine misuse in India
- Benzodiazepines (alprazolam, clonazepam, nitrazepam) are widely available and commonly misused, sometimes with opioids or codeine cough syrups.
- Long-term prescriptions often start in general practice for "tension" or sleep and are never reviewed.
- Good prescribing: clear diagnosis, short course, written plan, avoid alprazolam, review and document.

:::trap Do not stop high doses suddenly
A person taking large doses (for example many alprazolam tablets a day) who stops suddenly can have **seizures, delirium and psychosis**. Admit for supervised detoxification if doses are high, there is a seizure history, or alcohol is also used.
:::

:::recall
1. How much clonazepam roughly equals 10 mg diazepam? || 0.5 mg.
2. Why switch alprazolam to diazepam before tapering? || A long half-life gives smoother withdrawal.
3. How fast should a long-term benzodiazepine be reduced? || About 5 to 10% every 1 to 2 weeks, slower at the end.
4. When is inpatient detoxification needed? || High doses, seizure history, alcohol or other drug use.
:::

:::mcq
Q: A man on alprazolam 3 mg a day for 4 years wants to stop. Which plan is safest?
- Stop today
- *Switch gradually to an equal dose of diazepam, then reduce by about a tenth every 1 to 2 weeks
- Halve every week
- Swap to zolpidem
> Long-acting switch, slow taper, support; stopping suddenly can cause seizures.
:::

## 2.5 Level check · Beginner [beginner]
Twelve or more right out of fifteen (80%) opens the Advanced level.

:::mcq
Q: The usual maintenance lithium level is about:
- 0.1 to 0.3 mmol/L
- *0.6 to 0.8 mmol/L
- 1.5 to 2.0 mmol/L
- 3 to 4 mmol/L
> Higher if relapses continue; lower in older adults.

Q: A lithium level is taken:
- Two hours after the dose
- *About 12 hours after the last dose
- At any time
- Only when toxic
> A trough level.

Q: Which is NOT a cause of a rising lithium level?
- Thiazide diuretic
- Diarrhoea
- Ibuprofen
- *Drinking more water in summer
> Fluids protect.

Q: Coarse tremor, vomiting and slurred speech on lithium suggest:
- Usual side effects
- *Toxicity
- Hypothyroidism
- Mania
> Stop and check the level.

Q: Lithium-induced hypothyroidism is usually managed by:
- Stopping lithium
- *Adding thyroxine
- Adding carbimazole
- Raising lithium
> Continue lithium.

Q: Valproate is avoided in women who could become pregnant mainly because of:
- Weight gain
- *Birth defects and lower IQ and autism in the child
- Hair loss
- Low sodium
> Highly teratogenic.

Q: Carbamazepine lowers the level of the combined pill because it:
- Blocks absorption
- *Induces liver enzymes
- Is a diuretic
- Binds the hormone
> Contraceptive failure risk.

Q: HLA-B*1502 testing before carbamazepine reduces the risk of:
- Agranulocytosis
- *Stevens-Johnson syndrome
- Liver failure
- Weight gain
> Common in South and East Asians.

Q: Lamotrigine's dose must be built up slowly to reduce:
- Weight gain
- *Serious rash
- Tremor
- Thirst
> Rash risk rises with fast titration.

Q: Adding valproate to lamotrigine:
- Lowers lamotrigine levels
- *Roughly doubles lamotrigine levels
- Has no effect
- Causes serotonin syndrome
> Halve the lamotrigine dose.

Q: Which antipsychotic treats bipolar depression but not mania?
- Haloperidol
- Risperidone
- *Lurasidone
- Aripiprazole
> Lurasidone is used for bipolar depression.

Q: The usual maximum length of a benzodiazepine course for anxiety or insomnia is about:
- 2 days
- *2 to 4 weeks
- 6 months
- Lifelong
> Dependence develops quickly.

Q: Which benzodiazepine is most associated with rebound anxiety and misuse?
- Diazepam
- Chlordiazepoxide
- *Alprazolam
- Clonazepam
> Short-acting and high potency.

Q: First-line treatment for chronic insomnia is:
- Zolpidem
- *CBT for insomnia
- Promethazine
- Alcohol
> It treats the perpetuating factors.

Q: About how much diazepam equals alprazolam 0.5 mg?
- 1 mg
- 5 mg
- *10 mg
- 50 mg
> Use equivalents to switch before tapering.
:::
`;

export const text = p1 + advanced + examZone;
