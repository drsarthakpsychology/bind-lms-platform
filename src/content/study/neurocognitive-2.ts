/* Module · Delirium and dementia, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: testing, treatment and the frontier

## 3.1 Cognitive testing in depth: MMSE, MoCA and ACE-III [core][advanced]
Cognitive tests help you **detect**, **describe** and **track** cognitive problems. They do not diagnose on their own. A score must always be read alongside the history, daily function, education, language, culture, hearing, vision and mood.

### The three tests you will use most
| Test | Total | Time | What it covers | Strengths and weaknesses |
|---|---|---|---|---|
| **MMSE** (Mini-Mental State Examination) | 30 | About 10 minutes | Orientation, registration, attention and calculation, recall, language, copying | Widely known; weak at detecting mild impairment and executive problems; strongly affected by education; copyrighted |
| **MoCA** (Montreal Cognitive Assessment) | 30 | About 10 to 15 minutes | Visuospatial and executive (trail, cube, clock), naming, attention, language, abstraction, delayed recall, orientation | More sensitive for mild impairment and executive problems; harder for people with little schooling; one point added for limited education |
| **ACE-III** (Addenbrooke's Cognitive Examination) | 100 | About 15 to 20 minutes | Attention, memory, verbal fluency, language, visuospatial | Detailed domain profile; helps tell Alzheimer's from frontotemporal patterns; validated in several Indian languages |

:::widget curve
{"kind": "normal", "title": "Test scores, norms and cut-offs", "caption": "Move the slider along the curve. A score's meaning depends on the reference group: the same raw score can be normal for someone with little schooling and low for a graduate. Cut-offs trade sensitivity against specificity, so a score near the cut-off needs clinical judgement and an informant history."}
:::

:::widget figure
{"id": "copy-and-clock", "quiz": true}
:::

### Rough interpretation
- **MMSE**: 25 to 30 usually normal (education-dependent), about 18 to 24 mild impairment, 10 to 17 moderate, below 10 severe.
- **MoCA**: 26 or more is usually taken as normal; lower scores need careful interpretation, especially in people with little schooling, where cut-offs are lower.
- **ACE-III**: below 88 suggests possible impairment; below 82 is highly specific for dementia in validation studies.

### Pitfalls
- **Education and literacy**: tasks such as reading, writing, serial sevens, copying pentagons or drawing a cube penalise people who never went to school. Use tests and cut-offs validated for low literacy, such as the **Hindi Mental State Examination (HMSE)**.
- **Language**: translate carefully; some items do not translate (sentence repetition, naming of animals unfamiliar in the region).
- **Hearing and vision**: check first.
- **Mood and effort**: depression lowers scores.
- **Ceiling effects**: highly educated people may score "normal" while declining; compare with their own past level.
- **Delirium**: scores in delirium do not measure dementia. Re-test after recovery.

:::widget worked
{"title": "Reading an ACE-III profile", "steps": [{"q": "Mr Bose, 63, retired professor in Kolkata, scores 79 out of 100 on ACE-III. Attention 17 out of 18, memory 23 out of 26, fluency 4 out of 14, language 17 out of 26, visuospatial 16 out of 16. What stands out?", "a": "A total below 82 suggests significant impairment, but the profile matters more: very poor fluency and language with good attention, visuospatial skills and relatively preserved memory."}, {"q": "His wife says he has become apathetic, eats sweets constantly, and makes tactless remarks. What pattern does this suggest?", "a": "A frontotemporal pattern: poor verbal fluency (executive and language) with behavioural change, and relatively preserved memory and visuospatial skills, which are often impaired early in Alzheimer's disease."}, {"q": "How would an Alzheimer's profile typically look?", "a": "Low memory (especially delayed recall) and orientation, with relatively better fluency and language early on; visuospatial skills often decline as the disease advances."}, {"q": "What next?", "a": "MRI looking for frontal and anterior temporal atrophy, a careful behavioural history, and specialist assessment for behavioural variant frontotemporal dementia; avoid cholinesterase inhibitors, which do not help FTD."}], "yourTurn": [{"q": "Mrs Begum, 70, with four years of schooling, scores 20 on MMSE. She lost points on serial sevens, writing a sentence and copying pentagons, but recalled all three words and was fully oriented. She runs her household. What do you conclude?", "a": "Her errors are on education-dependent items, and memory, orientation and function are intact. This score probably does not indicate dementia. Use an education-appropriate test (for example HMSE) and an informant history before concluding anything."}]}
:::

:::widget sort
{"prompt": "Which test would you choose? Place each situation.", "buckets": ["MMSE or HMSE", "MoCA", "ACE-III"], "items": [{"text": "A quick screen for an 80-year-old farmer who never went to school, using a version for low literacy", "bucket": 0, "why": "HMSE was designed for low literacy; standard MMSE and MoCA penalise unschooled people."}, {"text": "A graduate executive with subtle complaints of planning problems", "bucket": 1, "why": "MoCA picks up executive and mild deficits better than MMSE."}, {"text": "A memory clinic wanting a domain profile to tell Alzheimer's from frontotemporal dementia", "bucket": 2}, {"text": "Tracking a patient with known moderate Alzheimer's every six months in a busy clinic", "bucket": 0}, {"text": "A detailed baseline before starting anti-amyloid treatment in a specialist clinic", "bucket": 2}, {"text": "Screening someone with suspected mild cognitive impairment in an urban general clinic", "bucket": 1}]}
:::

:::clinician
### Scoring detail
- **MMSE** items: orientation to time (5) and place (5); registration of three words (3); attention (serial sevens or spelling WORLD backwards, 5); recall of three words (3); naming two objects (2); repetition ("no ifs, ands or buts", 1); three-stage command (3); reading and obeying "close your eyes" (1); writing a sentence (1); copying intersecting pentagons (1). Cut-offs are education-dependent; in people with no schooling, cut-offs around 17 to 19 have been proposed in Indian studies. Annual decline in untreated Alzheimer's is about 2 to 4 points.
- **MoCA**: visuospatial and executive 5 (trail B, cube, clock contour, numbers, hands), naming 3, attention 6 (digits forward and backward, tapping, serial sevens), language 3 (sentence repetition and fluency), abstraction 2, delayed recall 5, orientation 6. Add 1 point if 12 years or less of education. Hindi and other Indian language versions exist; a MoCA basic version for illiterate and low-educated people (MoCA-B) has been validated.
- **ACE-III**: attention 18, memory 26, verbal fluency 14, language 26, visuospatial 16. Cut-off 88 (sensitivity about 1.0, specificity about 0.96 for dementia in the original study) and 82 (specificity about 1.0). Mini-ACE (30 points) for quick use. Validated in Malayalam, Kannada, Hindi, Telugu, Tamil, Bengali and others (for example Mathuranath and colleagues in Kerala).
- **HMSE** (1995): developed for a largely illiterate rural population in Ballabgarh; 30 points; does not require reading or writing.
- **Other tools**: Mini-Cog (3-word recall plus clock, total 5; a score below 3 is a positive screen), clock drawing test, Community Screening Instrument for Dementia (CSI-D) and the 10/66 battery for low-literacy community studies, Vellore Screening Instruments, IQCODE and the Everyday Abilities Scale for India (informant measures), CDR for staging, and neuropsychological batteries (for example the NIMHANS neuropsychology battery) in specialist settings.
- **Sensitivity and specificity depend on prevalence**: in low-prevalence community settings, positive screens have low positive predictive value; always confirm clinically.
:::

:::recall
1. What is the total score of MMSE, MoCA and ACE-III? || 30, 30 and 100.
2. Which test is better at detecting mild and executive deficits than MMSE? || MoCA.
3. Which ACE-III scores suggest impairment and dementia? || Below 88 suggests impairment; below 82 is highly specific for dementia.
4. Why is the HMSE useful in India? || It does not require reading or writing, so it suits people with little schooling.
5. Name five pitfalls in interpreting cognitive scores. || Education and literacy, language and translation, hearing and vision, mood and effort, ceiling effects, delirium.
:::

:::mcq
Q: A highly educated 66-year-old scores 29 on MMSE but her family describes clear decline in planning and finances. The best next step is:
- Reassure; MMSE is normal
- *Use a more sensitive test (MoCA or ACE-III), take a detailed informant history and compare with her previous level
- Diagnose dementia
- Repeat MMSE in ten years
> Ceiling effects hide decline in highly educated people.

Q: On ACE-III, low verbal fluency and language with preserved memory and visuospatial scores, plus behavioural change, suggest:
- Alzheimer's disease
- *Frontotemporal dementia
- Delirium
- Normal ageing
> A frontotemporal profile.
:::

## 3.2 Medicines for dementia [core][advanced]
No medicine yet cures dementia. Current medicines fall into three groups: those that **ease symptoms** for a time, those that **slow** early Alzheimer's disease modestly by removing amyloid, and those used for **distressing behavioural symptoms**.

:::widget journey
{"drug": "donepezil", "target": "acetylcholinesterase at cholinergic synapses in the cortex and hippocampus", "routes": ["oral"], "notes": {"liver": "Broken down by CYP2D6 and CYP3A4; strong inhibitors can raise levels and side effects.", "target": "By blocking the enzyme that breaks down acetylcholine, donepezil boosts the signal from the surviving cholinergic neurons. It does not stop the disease.", "out": "A very long half-life (about three days) allows once-daily dosing; it takes a couple of weeks to reach a steady level."}, "caption": "Follow donepezil to its target. The same extra acetylcholine in the gut and heart explains nausea, diarrhoea and a slow pulse."}
:::

### Symptomatic medicines for Alzheimer's disease
- **Cholinesterase inhibitors**: **donepezil**, **rivastigmine** and **galantamine**. They slow the breakdown of acetylcholine. On average they give a **modest** benefit in thinking and daily function, equivalent to a delay of several months in decline, in mild to moderate Alzheimer's disease. Some people benefit clearly; others not at all. They are also used in **Lewy body dementia** and **Parkinson's disease dementia**, where they can reduce hallucinations.
- **Memantine**: blocks excessive glutamate activity at NMDA receptors. Used in **moderate to severe** Alzheimer's disease, alone or with a cholinesterase inhibitor.

Common side effects of cholinesterase inhibitors: nausea, vomiting, diarrhoea, loss of appetite, vivid dreams, muscle cramps, and a **slow heart rate** with fainting. They need care in people with heart rhythm problems, asthma and stomach ulcers.

:::widget receptor
{"receptor": "NMDA", "title": "Memantine at the NMDA receptor", "caption": "In Alzheimer's disease, a constant low-level leak of glutamate may add noise and damage. Memantine is a low-affinity antagonist: it blocks the channel during this background leak but lets go quickly when a strong, meaningful signal arrives. Compare the antagonist setting with the full agonist (glutamate itself)."}
:::

### Anti-amyloid antibodies
**Lecanemab** and **donanemab** are antibodies given by drip that **remove amyloid** from the brain. In large trials they **slowed decline by about a quarter to a third** over 18 months in people with **mild cognitive impairment or mild dementia due to Alzheimer's disease** with confirmed amyloid. The benefit is modest and its meaning for daily life is debated.

They carry a risk of **ARIA** (amyloid-related imaging abnormalities): brain swelling or small bleeds, usually silent but sometimes serious, and more common in people with **two copies of APOE e4**. They require MRI monitoring, amyloid confirmation, careful selection and specialist centres, and are very expensive.

:::widget timeline
{"prompt": "Order the steps before and during anti-amyloid antibody treatment.", "events": [{"label": "Specialist confirms mild cognitive impairment or mild dementia"}, {"label": "Amyloid is confirmed by PET scan, spinal fluid or a validated blood test"}, {"label": "APOE e4 testing and a baseline MRI to judge ARIA risk"}, {"label": "Regular infusions begin"}, {"label": "Scheduled MRI scans check for brain swelling or small bleeds"}, {"label": "Review of benefit, side effects and whether to continue"}], "why": "These antibodies help only people at an early stage with proven amyloid, and they carry a real risk of ARIA. That is why so much checking comes before the first drip, and safety scans continue during treatment."}
:::

:::widget sort
{"prompt": "Which medicine fits each situation best?", "buckets": ["Cholinesterase inhibitor", "Memantine", "Neither; think again"], "items": [{"text": "Mild Alzheimer's dementia, normal heart rate and ECG", "bucket": 0}, {"text": "Severe Alzheimer's disease, bedbound but agitated, already on donepezil", "bucket": 1, "why": "Memantine is licensed for moderate to severe disease and can be added."}, {"text": "Dementia with Lewy bodies with distressing visual hallucinations", "bucket": 0, "why": "Rivastigmine or donepezil are first choice."}, {"text": "Behavioural variant frontotemporal dementia", "bucket": 2, "why": "Cholinesterase inhibitors do not help FTD and may worsen behaviour."}, {"text": "Mild Alzheimer's with a heart rate of 46 and fainting spells", "bucket": 2, "why": "Cholinesterase inhibitors slow the heart; investigate first and seek cardiology advice."}, {"text": "Moderate Alzheimer's who could not tolerate any cholinesterase inhibitor", "bucket": 1}]}
:::

:::widget decide
{"scene": "Mr Rao, 68, a retired bank officer in Bengaluru, has mild cognitive impairment. His son has read about the new 'Alzheimer's injection' launched in India and wants him to start it at once, whatever the cost.", "ask": "What is the most responsible advice?", "choices": [{"label": "Arrange the infusion immediately without further tests", "verdict": "harm", "outcome": "After the third infusion he has a seizure and an MRI shows brain swelling. He turns out to carry two copies of APOE e4.", "why": "Anti-amyloid treatment needs confirmed amyloid, APOE testing, a baseline MRI, careful selection and MRI monitoring for ARIA."}, {"label": "Explain that these drugs are for early Alzheimer's with confirmed amyloid; discuss the modest benefit, the ARIA risk, the cost and monitoring; and refer to a specialist memory centre for assessment, amyloid testing, APOE status and MRI before any decision", "verdict": "best", "outcome": "Testing shows his amyloid is positive and he carries one copy of APOE e4. After a detailed discussion, the family decides to proceed with MRI monitoring at a specialist centre, with realistic expectations.", "why": "Shared decision-making with full information on benefit, risk, eligibility and monitoring is essential for anti-amyloid therapy."}, {"label": "Tell them it is useless and should never be used", "verdict": "ok", "outcome": "They seek it elsewhere without proper monitoring.", "why": "The benefit is modest but real in selected patients; a balanced explanation keeps the family in safe care."}]}
:::

:::clinician
### Dosing (Indian brands are examples)
| Medicine | Start | Titration | Target | Notes |
|---|---|---|---|---|
| **Donepezil** (Donep, Dopezil) | 5 mg at night | After 4 to 6 weeks | 10 mg at night (23 mg in some countries for moderate to severe) | Give in the morning if vivid dreams; long half-life (about 70 hours) |
| **Rivastigmine** capsules (Exelon, Rivamer) | 1.5 mg twice daily with food | Increase by 1.5 mg twice daily every 2 to 4 weeks | 3 to 6 mg twice daily | More GI effects; licensed for Parkinson's disease dementia |
| **Rivastigmine patch** | 4.6 mg/24 h | After 4 weeks | 9.5 mg/24 h (13.3 mg in some) | Fewer GI effects; rotate sites; skin reactions |
| **Galantamine** (Galamer) | 4 mg twice daily or 8 mg extended-release daily | Every 4 weeks | 8 to 12 mg twice daily or 16 to 24 mg extended-release | Also nicotinic modulation |
| **Memantine** (Admenta, Mentadem) | 5 mg daily | Increase by 5 mg weekly | 20 mg daily (10 mg if creatinine clearance below 30) | Dizziness, headache, constipation; generally well tolerated |

**Before cholinesterase inhibitors**: pulse; ECG if pulse below about 60, conduction disease, syncope, or on rate-slowing drugs (beta-blockers, verapamil, digoxin). Interactions: anticholinergic drugs oppose the effect; succinylcholine prolonged in anaesthesia.

**Evidence**: Systematic reviews show cholinesterase inhibitors improve ADAS-Cog by about 2 to 3 points and MMSE by about 1 to 1.5 points over 6 months versus placebo, with small benefits in function and global impression; memantine gives small benefits in moderate to severe disease. DOMINO-AD (2012): continuing donepezil in moderate to severe disease gave benefit over stopping; stopping was associated with higher risk of nursing home placement in the first year.

### Anti-amyloid monoclonal antibodies
- **Lecanemab** (Leqembi): 10 mg/kg IV every 2 weeks; CLARITY-AD (1, 795 participants): 27% slowing on CDR-Sum of Boxes at 18 months (difference 0.45 points on an 18-point scale). ARIA-E (oedema) about 12.6% overall, about 33% in APOE e4 homozygotes; ARIA-H (microhaemorrhage, siderosis) about 17%. Subcutaneous maintenance formulation approved in the US in 2025.
- **Donanemab** (Kisunla; in India, Lormalzi): IV monthly (700 mg for three doses, then 1,400 mg; a slower titration schedule approved in 2025 lowers ARIA); TRAILBLAZER-ALZ 2 (1, 736 participants): about 35% slowing on iADRS in those with low to medium tau; ARIA-E about 24%; treatment can stop when amyloid clears on PET. Three treatment-related deaths in the trial.
- **Eligibility**: MCI or mild dementia due to Alzheimer's disease, confirmed amyloid (PET or CSF; blood tests increasingly used for triage), APOE genotyping, baseline MRI (exclude more than four microhaemorrhages, superficial siderosis, major infarcts), no anticoagulation (bleeding risk with ARIA-H), MRI before specified doses and with new symptoms.
- **Regulatory status, as of Nov 2026**: both approved in the US; lecanemab approved in the EU (2025) for APOE e4 non-carriers and heterozygotes, and donanemab subsequently with similar restrictions; NICE in England did not recommend either for NHS use on cost-effectiveness grounds. In India, CDSCO approved donanemab and Eli Lilly launched it as Lormalzi in May 2026 for MCI or mild dementia due to Alzheimer's; cost, access to amyloid confirmation and MRI monitoring limit use to a few specialist centres.
- **Aducanumab**, the first such antibody, was withdrawn by its maker in 2024.
:::

:::recall
1. Name the three cholinesterase inhibitors. || Donepezil, rivastigmine, galantamine.
2. Which medicine is used for moderate to severe Alzheimer's disease and how does it work? || Memantine; it blocks excessive NMDA glutamate activity.
3. What is the main cardiac side effect of cholinesterase inhibitors? || Slow heart rate (bradycardia) and fainting.
4. Which patients are eligible for anti-amyloid antibodies? || People with MCI or mild dementia due to Alzheimer's disease with confirmed amyloid, after APOE testing and MRI.
5. What is ARIA and who is at highest risk? || Amyloid-related imaging abnormalities (brain swelling or microbleeds); APOE e4 homozygotes.
:::

:::mcq
Q: Which dementia does NOT respond to cholinesterase inhibitors?
- Alzheimer's disease
- Dementia with Lewy bodies
- Parkinson's disease dementia
- *Behavioural variant frontotemporal dementia
> They may worsen FTD behaviour.

Q: In CLARITY-AD, lecanemab slowed decline on CDR-Sum of Boxes by about:
- 90%
- *27% over 18 months
- 5%
- None
> A modest slowing.
:::

## 3.3 Behaviour, carers, capacity and the end of life [core][advanced]
Most people with dementia develop **behavioural and psychological symptoms** at some point: agitation, aggression, wandering, apathy, depression, anxiety, suspicion, hallucinations, delusions (often of theft), disinhibition, sleep disturbance and calling out. These symptoms are often more distressing for families than memory loss, and are the main reason for moving to residential care.

:::widget flow
{"title": "The DICE approach to behaviour in dementia", "layout": "cycle", "nodes": [{"id": "d", "label": "Describe", "detail": "What happens, when, where, with whom, what came before and after."}, {"id": "i", "label": "Investigate", "detail": "Pain, infection, constipation, medicines, hunger, toileting, boredom, noise, fear, carer approach."}, {"id": "c", "label": "Create", "detail": "A plan with the family: remove triggers, add meaningful activity, change approach, treat causes."}, {"id": "e", "label": "Evaluate", "detail": "Did it work? Keep a simple diary; adjust and repeat."}], "caption": "Press Play. Go round the cycle before reaching for an antipsychotic."}
:::

### Understanding behaviour as communication
Behaviour in dementia often has a **reason**: pain, hunger, thirst, needing the toilet, constipation, infection, being too hot or cold, boredom, noise, fear, a change of carer, or a misunderstanding. The **DICE** approach structures a response:
- **D**escribe the behaviour: what, when, where, with whom, what happened before and after.
- **I**nvestigate causes: physical (pain, infection, medicines), the person (fears, past habits), the carer (approach, stress), the environment.
- **C**reate a plan with the family: remove triggers, add meaningful activity, change approach.
- **E**valuate whether it worked.

### Antipsychotics: use rarely and carefully
Antipsychotics are often given for agitation in dementia, but they **increase the risk of stroke and death** and cause falls, sedation and stiffness. They are justified only when symptoms are severe, causing serious distress or danger, and non-drug approaches have failed, at the lowest dose, for the shortest time, with regular review and plans to stop.

:::widget decide
{"scene": "Mrs Kapoor, 84, with moderate Alzheimer's disease, lives in a care home in Delhi. Lately she has screamed and hit out during morning bathing. The staff request 'something to calm her'. She has had little to drink, is constipated, and winces when her right knee is moved.", "ask": "What do you do first?", "choices": [{"label": "Start risperidone 1 mg twice daily", "verdict": "harm", "outcome": "She becomes drowsy, falls and fractures her hip.", "why": "Antipsychotics before looking for causes expose her to stroke, falls and death risks, and the pain remains untreated."}, {"label": "Use the DICE approach: examine and treat her knee pain and constipation, encourage fluids, change the bathing routine (warmer room, one familiar carer, sponge bath if she prefers, explaining each step), and review", "verdict": "best", "outcome": "Regular paracetamol for her arthritic knee, a laxative and a gentler bathing routine stop the screaming within days.", "why": "Pain and discomfort are common, treatable causes of agitation in dementia. Regular paracetamol alone has reduced agitation in trials."}, {"label": "Stop bathing her altogether", "verdict": "ok", "outcome": "The screaming stops, but she develops skin infections.", "why": "Avoidance removes one trigger but ignores her pain and her care needs."}]}
:::

:::widget compare
{"title": "Before and after a behaviour plan", "a": {"label": "Before", "points": ["Shouts and pushes carers at bath time every evening", "Given haloperidol 'as needed', now sleepy and unsteady", "Has had two falls", "Daughter exhausted and thinking of a care home"], "summary": "The behaviour was treated as a problem to sedate."}, "b": {"label": "After DICE", "points": ["Constipation and knee pain found and treated", "Bath moved to late morning, with a female carer and warm room", "Antipsychotic stopped; no more falls", "Shouting much less; daughter coping with respite help"], "summary": "The behaviour was treated as communication: of pain, fear and an unsuitable routine."}, "caption": "Describe, Investigate, Create, Evaluate. Most behaviour in dementia has a cause that can be found."}
:::

### Capacity and decisions
Dementia affects decision-making gradually and unevenly. A person may be able to decide what to eat but not how to invest money. **Capacity is decision-specific**: can the person understand the information, retain it long enough, weigh it up, and communicate a choice? Assess each important decision, support the person to decide where possible, and involve families. Planning ahead **while capacity is present** protects the person's wishes.

### The end of life
In late dementia, people lose speech, mobility and the ability to swallow. Common issues: recurrent infections, weight loss, pressure sores. **Feeding tubes do not prolong life or prevent pneumonia** in advanced dementia; careful hand feeding is preferred. Good palliative care focuses on comfort, pain relief, dignity and supporting the family, with decisions based on what the person would have wanted.

:::widget sort
{"prompt": "Good practice or poor practice in managing behavioural symptoms? Place each.", "buckets": ["Good practice", "Poor practice"], "items": [{"text": "Checking for pain and constipation before any sedative", "bucket": 0}, {"text": "Long-term antipsychotic with no review date", "bucket": 1}, {"text": "Using familiar music during care tasks", "bucket": 0}, {"text": "Benzodiazepines nightly for wandering", "bucket": 1, "why": "Increase falls, confusion and dependence."}, {"text": "Treating depression in a withdrawn, tearful person with dementia", "bucket": 0}, {"text": "Arguing with a person who believes her jewellery was stolen", "bucket": 1, "why": "Reassure, help search, keep a spare set; arguing increases distress."}, {"text": "A trial of reducing an antipsychotic after three months of stability", "bucket": 0}]}
:::

:::clinician
### Pharmacology of BPSD
- **Mortality warning**: FDA boxed warning (2005, extended to typicals in 2008): antipsychotics in older people with dementia increase mortality about 1.6 to 1.7 times (about 1 extra death per 100 treated over 10 to 12 weeks) and stroke about 3 times.
- **Risperidone**: licensed in the UK for up to 6 weeks for persistent aggression in Alzheimer's disease causing risk; 0.25 mg twice daily, increase by 0.25 mg twice daily every 2 days, usual 0.5 mg twice daily, maximum 1 mg twice daily (Risdone, Sizodon).
- **Aripiprazole** (2 to 10 mg) and **quetiapine** (12.5 to 50 mg; weak evidence for agitation, used in Parkinson's and Lewy body disease) are alternatives. **Brexpiprazole** was approved by the FDA in 2023 for agitation associated with Alzheimer's dementia (0.5 mg to 2 to 3 mg); not marketed in India as of Nov 2026.
- **Citalopram** 10 to 30 mg reduced agitation in CitAD at the cost of QT prolongation and cognitive worsening at 30 mg; sertraline and trazodone are used. **Mirtazapine** was not effective for agitation in the HTA-SYMBAD trial and was associated with higher mortality.
- **Pain**: stepped analgesia (paracetamol up to 3 g daily, then low-dose opioids) reduced agitation in nursing home residents.
- **Depression in dementia**: antidepressants show little benefit over placebo in trials (HTA-SADD); psychosocial approaches first; treat severe depression.
- **Sleep**: sleep hygiene, daytime light and activity; melatonin evidence weak; avoid benzodiazepines and Z-drugs; trazodone 50 mg has modest evidence.
- **Deprescribing**: review antipsychotics at 6 to 12 weeks; the DART-AD trial showed higher long-term mortality in those continuing antipsychotics.
- **Non-drug evidence**: person-centred care training (for example WHELD), music therapy, structured activities and carer interventions reduce agitation and antipsychotic use.

### Capacity, law and planning in India
- **MHCA 2017**: capacity under Section 4 (understand information, appreciate consequences, communicate a decision); advance directives (Section 5) and nominated representatives (Section 14) for mental health care. Dementia with severe behavioural disturbance may meet the Act's definition of mental illness for admission.
- **Finances and property**: power of attorney while capacity remains; otherwise guardianship through civil courts. Senior citizens' tribunals under the Maintenance and Welfare of Parents and Senior Citizens Act 2007.
- **End of life**: the Supreme Court (Common Cause, 2018; procedure simplified in 2023) recognised advance medical directives ("living wills") and withdrawal of life support in terminal illness; palliative care services remain limited outside some states (Kerala is a notable exception).
- **Feeding tubes**: systematic reviews show no benefit for survival, aspiration pneumonia, pressure sores or comfort in advanced dementia; the American Geriatrics Society recommends careful hand feeding.
:::

:::recall
1. What does DICE stand for? || Describe, Investigate, Create, Evaluate.
2. Name four common causes of agitation in dementia. || Pain, constipation, infection, hunger or thirst, needing the toilet, boredom, noise, fear, change of carer.
3. What risks do antipsychotics carry in dementia? || Stroke, death, falls, sedation and stiffness.
4. Why is capacity "decision-specific"? || A person may be able to make some decisions but not others; each important decision is assessed separately.
5. Do feeding tubes help in advanced dementia? || No; they do not prolong life or prevent pneumonia; careful hand feeding is preferred.
:::

:::mcq
Q: A man with dementia becomes agitated every afternoon. The first step is:
- Start haloperidol
- *Describe the pattern and look for causes such as pain, hunger, toileting or boredom
- Lock his room
- Start a benzodiazepine
> DICE: describe and investigate before any drug.

Q: Antipsychotics in older people with dementia are associated with:
- Improved survival
- *Increased risk of stroke and death
- Prevention of Alzheimer's progression
- Better memory
> Use only for severe risk or distress, briefly.
:::

## 3.4 Delirium in depth [core][advanced]
### Why does delirium happen?
No single mechanism explains all delirium. Leading ideas:
- **Neurotransmitter imbalance**: too little **acetylcholine** and too much **dopamine**. This is why anticholinergic medicines so often cause delirium, and why dopamine-blocking drugs can calm agitation.
- **Inflammation**: infections and surgery release inflammatory signals that reach the brain, especially a vulnerable, ageing brain.
- **Stress hormones**: high cortisol during illness affects the brain.
- **Network breakdown**: brain networks that keep attention steady fail to coordinate.
- **Low brain reserve**: an older, damaged or dementing brain has less capacity to cope with these stresses.

:::widget brainmap
{"title": "Brain systems disturbed in delirium", "focus": ["prefrontal", "thalamus", "brainstem", "hippocampus"], "notes": {"prefrontal": "Sustained attention and executive control fail first, the core of delirium.", "thalamus": "The relay that filters sensory information; disruption contributes to misperceptions and hallucinations.", "brainstem": "Arousal systems (including cholinergic and noradrenergic nuclei) set alertness; disturbance causes drowsiness or hyperalertness and sleep-wake reversal.", "hippocampus": "Memory formation is disrupted, so people often remember little of the episode."}, "caption": "Tap each area. Delirium is a whole-brain network failure rather than damage in one spot."}
:::

:::widget guess
{"prompt": "In an intensive care unit, out of 100 older patients on a breathing machine, about how many develop delirium?", "min": 0, "max": 100, "unit": "patients", "answer": [50, 80], "reveal": "Between about 50 and 80. Delirium is common because many causes stack up at once: severe illness, sedatives, sleep loss, pain, infection and an unfamiliar, noisy room. Much of it is hypoactive, quiet and easily missed, which is why ICUs screen every patient routinely."}
:::

### Special settings
- **Intensive care**: delirium is very common in ventilated patients, often hypoactive. Lighter sedation, avoiding benzodiazepines, early mobility and family involvement reduce it.
- **After surgery**: especially hip fracture and heart surgery in older people. Good pain control without excessive opioids, avoiding anticholinergic premedication, early mobilisation and orientation help.
- **Delirium superimposed on dementia**: very common, easily missed, and linked to faster decline. The key is to know the person's usual baseline; families are vital.
- **End of life**: delirium is common in the final days. Here the focus is on comfort, not investigation; reversible causes are treated only if it fits the goals of care.
- **Children**: delirium also occurs in sick children, often missed; parents notice the child is "not themselves".

:::widget decide
{"scene": "Mr Ahmed, 79, has advanced lung cancer and is in his last days at home in Lucknow. He has become restless, picking at the sheets and calling out for his late mother. His family is frightened. He has made it clear he wants to die at home and does not want further hospital tests.", "ask": "What is the best approach?", "choices": [{"label": "Admit him to hospital for a full delirium work-up including scans", "verdict": "harm", "outcome": "He dies in an emergency ward, frightened and away from his family.", "why": "At the end of life, investigation must fit the person's goals. Aggressive work-up here goes against his clear wishes."}, {"label": "Focus on comfort: check for simple reversible causes such as pain, a full bladder or constipation, keep the room calm with family present, explain to the family what is happening, and use medicine for distress if needed in line with palliative care practice", "verdict": "best", "outcome": "His bladder is relieved and pain controlled. With low-dose medicine for distress and his family beside him, he settles and dies peacefully at home.", "why": "Terminal delirium is managed for comfort and dignity, guided by the person's wishes, with family support."}, {"label": "Tell the family nothing can be done", "verdict": "harm", "outcome": "The family is distressed and he remains agitated for two days.", "why": "Much can be done to ease distress and support the family."}]}
:::

### After delirium
Delirium is not always fully reversible. Some people take weeks or months to recover, and some never return to their previous level. Delirium can **unmask** an unrecognised dementia or **speed up** an existing one. Everyone who has had delirium should have their thinking checked again a few months later, and families should be told that the person may be at risk again.

:::widget sort
{"prompt": "Supported by evidence or not? Place each claim about delirium.", "buckets": ["Supported", "Not supported"], "items": [{"text": "Multicomponent non-drug programmes reduce the number of people who develop delirium", "bucket": 0}, {"text": "Haloperidol reduces the duration of delirium in intensive care", "bucket": 1, "why": "Trials (for example MIND-USA) found no effect on duration or survival."}, {"text": "Delirium is associated with later cognitive decline", "bucket": 0}, {"text": "Benzodiazepines are the best treatment for delirium from infection", "bucket": 1}, {"text": "Anticholinergic medicines increase delirium risk", "bucket": 0}, {"text": "Delirium always clears completely within a day or two of treating the cause", "bucket": 1}]}
:::

:::clinician
### Deeper notes
- **Neurobiology**: cholinergic deficiency (serum anticholinergic activity correlates with delirium), dopamine excess, neuroinflammation (IL-6, IL-8, CRP elevations; microglial priming in ageing and neurodegeneration), aberrant stress responses, and disrupted functional connectivity (reduced default mode and attention network coordination on fMRI; diffuse EEG slowing). Biomarker studies show raised neurofilament light during delirium, suggesting neuronal injury.
- **Long-term outcomes**: in older people, delirium is associated with about a 2 to 3-fold increase in incident dementia and accelerated decline in those with dementia; in ICU survivors, long-term cognitive impairment comparable to moderate traumatic brain injury in some (BRAIN-ICU).
- **ICU bundle (ABCDEF)**: Assess and manage pain; Both spontaneous awakening and breathing trials; Choice of sedation (avoid benzodiazepines, consider dexmedetomidine); Delirium assessment and management; Early mobility and exercise; Family engagement.
- **Post-operative delirium prevention**: proactive geriatric consultation (1998: about one third reduction after hip fracture), depth-of-anaesthesia monitoring (mixed evidence), avoid anticholinergics and benzodiazepine premedication, multimodal analgesia.
- **Terminal delirium**: haloperidol or levomepromazine (where available) and midazolam for distressing agitation; palliative sedation is a last resort with clear documentation and family agreement.
- **Paediatric delirium**: Cornell Assessment of Pediatric Delirium (CAPD) for screening; risk with benzodiazepines, deep sedation and young age.
:::

:::recall
1. Name two neurotransmitter changes thought to underlie delirium. || Reduced acetylcholine and increased dopamine.
2. Why does an ageing or dementing brain get delirium more easily? || It has less reserve, and primed inflammatory responses.
3. Why are families vital in delirium superimposed on dementia? || They know the person's usual baseline and can notice acute change.
4. What should follow an episode of delirium? || A later cognitive review, because delirium can unmask or speed up dementia.
:::

:::mcq
Q: Which medicine type most often contributes to delirium in older people?
- Vitamin supplements
- *Anticholinergic medicines
- Paracetamol
- Iron tablets
> Cholinergic deficiency is central.

Q: In terminal delirium at home, the main goal is:
- Full investigation in hospital
- *Comfort and dignity in line with the person's wishes
- Restraints
- No treatment at all
> Palliative goals guide management.
:::

## 3.5 Biomarkers, prevention and the frontier [core][advanced]
### Can dementia be prevented?
Not all dementia can be prevented, but a large share of risk is linked to things we can change. A major international commission estimated that roughly **45 in 100 cases** worldwide are linked to **fourteen modifiable risk factors** across the life course:
- **Early life**: less education.
- **Mid-life**: hearing loss, high LDL cholesterol, depression, traumatic brain injury, physical inactivity, diabetes, smoking, high blood pressure, obesity, excessive alcohol.
- **Later life**: social isolation, air pollution, untreated vision loss.

In India, low education, high blood pressure, diabetes, hearing loss and air pollution are especially relevant. Prevention means good education, blood pressure and diabetes control, hearing aids, quitting smoking, cutting alcohol, staying active and connected, protecting the head, and cleaner air.

:::widget sort
{"prompt": "Modifiable risk factor for dementia, or not? Place each.", "buckets": ["Modifiable risk factor", "Not modifiable"], "items": [{"text": "Untreated hearing loss in mid-life", "bucket": 0}, {"text": "Age", "bucket": 1}, {"text": "High blood pressure in mid-life", "bucket": 0}, {"text": "Carrying APOE e4", "bucket": 1}, {"text": "Living with heavy air pollution", "bucket": 0}, {"text": "Social isolation in later life", "bucket": 0}, {"text": "Having Down syndrome", "bucket": 1}, {"text": "Physical inactivity", "bucket": 0}]}
:::

:::widget layers
{"title": "Dementia risk across the life course", "shape": "stack", "layers": [{"label": "Later life", "detail": "Social isolation, air pollution, untreated vision loss."}, {"label": "Mid-life", "detail": "Hearing loss, high LDL cholesterol, depression, head injury, inactivity, diabetes, smoking, high blood pressure, obesity, excess alcohol."}, {"label": "Early life", "detail": "Less education, the foundation of cognitive reserve."}], "caption": "Tap each stage. About 45 in 100 cases worldwide are linked to these fourteen factors, so prevention starts in childhood and continues for life."}
:::

### Biomarkers: seeing the disease before symptoms
- **Amyloid and tau PET scans** show the proteins in the living brain.
- **Spinal fluid tests** measure amyloid and tau.
- **Blood tests**, especially **p-tau217**, can now detect Alzheimer's changes with good accuracy, and some have been cleared for clinical use in some countries. They are best used in people with symptoms, to help decide who needs further tests, not to screen healthy people.

:::widget timeline
{"prompt": "In Alzheimer's disease, changes appear in a typical order, beginning years before symptoms. Put them in order.", "events": [{"label": "Amyloid builds up in the brain"}, {"label": "Tau tangles spread from the memory regions"}, {"label": "Brain cells are lost and the hippocampus shrinks"}, {"label": "Subtle memory problems: mild cognitive impairment"}, {"label": "Dementia: loss of independence"}], "why": "Amyloid can be detected 15 to 20 years before dementia. Tau and neurodegeneration track symptoms more closely. This is why trials now aim to treat people earlier, and why a positive amyloid test in a person without symptoms does not mean they will develop dementia soon."}
:::

### The frontier, as of Nov 2026
- **Anti-amyloid antibodies** have arrived, including in India, with modest benefit, real risks and high costs (section 3.2).
- **GLP-1 medicines** (semaglutide) were tested in two large trials in early Alzheimer's disease and **did not slow decline** (reported late 2025), despite earlier hopes from observational data.
- **Tau-targeting** treatments, combination therapies and treatments given before symptoms are being tested.
- **Blood tests** are moving into memory clinics, raising questions about who should be tested and what to tell people.
- **Prevention trials** of combined lifestyle programmes (such as FINGER-style trials) show small cognitive benefits.

:::widget decide
{"scene": "Ravi, 45, a software engineer in Hyderabad with no symptoms, wants a blood test for Alzheimer's because his father had it. He has read that the test is 'available now' and wants to know 'whether he will get it'.", "ask": "What is the most responsible advice?", "choices": [{"label": "Order the blood test and the APOE gene test immediately and tell him the result by message", "verdict": "harm", "outcome": "He is told he is amyloid-positive with one APOE e4 copy. He becomes severely anxious, though he may never develop dementia; no treatment is approved for people without symptoms.", "why": "Testing healthy people has uncertain meaning and no proven action. Results without counselling can cause harm."}, {"label": "Explain that these tests are designed for people with symptoms, that a positive result in a healthy person does not mean certain dementia and has no approved treatment, and focus on what he can do now: blood pressure, diabetes, hearing, exercise, sleep, alcohol and smoking; offer genetic counselling or a research study if he still wishes", "verdict": "best", "outcome": "He decides not to test now, starts regular exercise, and checks his blood pressure, which is high and is treated.", "why": "Balanced counselling avoids harm from uncertain predictive testing and channels concern into proven risk reduction."}, {"label": "Tell him dementia is entirely genetic so there is nothing he can do", "verdict": "harm", "outcome": "He feels hopeless and neglects his health.", "why": "Late-onset Alzheimer's is not entirely genetic, and much risk is modifiable."}]}
:::

:::clinician
### Evidence and status, as of Nov 2026
- **A major international commission** (2024): 14 modifiable risk factors account for about 45% of dementia worldwide; added high LDL cholesterol and untreated vision loss to the 2020 list of 12. Hearing loss and high LDL had the largest population attributable fractions (about 7% each). Indian estimates suggest an even higher potentially modifiable share because of low education and high hypertension prevalence.
- **Hearing**: the ACHIEVE trial found hearing intervention slowed cognitive decline over 3 years by about 48% in a subgroup of older adults at higher risk, but not overall.
- **Blood pressure**: SPRINT MIND (2019) intensive blood pressure control reduced MCI risk.
- **Multidomain**: FINGER improved cognition modestly; US POINTER (2025) structured lifestyle intervention modestly improved global cognition compared with self-guided.
- **Blood biomarkers**: in May 2025 the FDA cleared the first blood test (Fujirebio Lumipulse plasma p-tau217 to beta-amyloid 1-42 ratio) to aid diagnosis in symptomatic adults 55 and over; other assays followed. Alzheimer's Association clinical practice guidelines (2025) recommend blood biomarker tests with high sensitivity and specificity as triage or confirmatory tests in specialist care for people with cognitive symptoms, not in asymptomatic people or primary care screening.
- **GLP-1 agonists**: Novo Nordisk's EVOKE and EVOKE+ phase 3 trials (about 3,800 people with MCI or mild dementia due to Alzheimer's) reported in November 2025 that oral semaglutide did not slow progression on CDR-SB over 2 years, despite some biomarker changes; full data presented at AAN 2026.
- **Pipeline**: anti-tau antibodies and antisense oligonucleotides (for example BIIB080), subcutaneous anti-amyloid maintenance, presymptomatic trials (AHEAD 3-45 with lecanemab), and combination approaches; lithium microdose and other repurposed drugs are under study.
- **India**: LASI-DAD estimated about 8.8 million people with dementia aged 60 and over; the National Programme for Health Care of the Elderly (NPHCE) and ARDSI memory clinics provide services, but diagnosis rates remain low. As of Nov 2026, India has no national dementia plan, though the WHO global action plan (2017 to 2025) urged one; advocacy continues.
:::

:::recall
1. About what share of dementia worldwide is linked to modifiable risk factors? || About 45 in 100.
2. Name six of the fourteen modifiable risk factors. || Less education, hearing loss, high LDL, depression, head injury, inactivity, diabetes, smoking, hypertension, obesity, excess alcohol, isolation, air pollution, vision loss.
3. Which blood biomarker is most accurate for Alzheimer's changes? || Plasma p-tau217.
4. What did the EVOKE trials show? || Semaglutide did not slow progression of early Alzheimer's disease.
5. Who should have Alzheimer's blood biomarker tests? || People with cognitive symptoms in specialist care, not healthy people for screening.
:::

:::mcq
Q: As of Nov 2026, Alzheimer's blood biomarker tests are best used for:
- Screening healthy 40-year-olds
- *Helping assess people with cognitive symptoms in specialist settings
- Diagnosing delirium
- Choosing antipsychotics
> Not for asymptomatic screening.

Q: Which risk factor had one of the largest population attributable fractions in the 2024 international commission on dementia prevention?
- Left-handedness
- *Hearing loss
- Vegetarian diet
- Coffee drinking
> Hearing loss and high LDL cholesterol.
:::

# Part IV · Exam zone

## 4.1 Long answers, short notes and viva [core]
### Long answer plans
**1. Delirium: definition, aetiology, clinical features and management.**
Definition (DSM-5-TR criteria) → epidemiology by setting → predisposing and precipitating factors → causes (PINCH ME, I WATCH DEATH) → pathophysiology (acetylcholine, dopamine, inflammation, reserve) → clinical features and subtypes → assessment (4AT, CAM, work-up) → differential (dementia, depression, psychosis, non-convulsive status) → management (treat causes, non-drug care, cautious medicines, benzodiazepines only for withdrawal) → prevention (HELP) → outcome and follow-up.

**2. Compare delirium and dementia.**
Onset (hours to days versus months to years) → course (fluctuating versus progressive) → attention (impaired early versus preserved until late) → consciousness (altered versus clear) → hallucinations (common, often visual, versus late, except Lewy body) → reversibility (usually versus rarely) → causes → management → their overlap (delirium superimposed on dementia).

**3. Describe the types of dementia and their management.**
Definition of major and mild NCD → Alzheimer's (pathology, genetics, course) → vascular → Lewy body and Parkinson's disease dementia (core features, neuroleptic sensitivity, one-year rule) → frontotemporal (behavioural and language variants) → others (NPH, CJD, HIV, Huntington's, alcohol) → reversible causes and work-up → cognitive testing (MMSE, MoCA, ACE-III) → treatment (cholinesterase inhibitors, memantine, anti-amyloid antibodies) → BPSD and carers → capacity and planning → prevention.

### Short notes to practise
CAM · 4AT · Delirium superimposed on dementia · Lewy body dementia · Frontotemporal dementia · Normal pressure hydrocephalus · Pseudodementia · ACE-III · Cholinesterase inhibitors · Anti-amyloid antibodies and ARIA · Antipsychotics in dementia · Modifiable risk factors for dementia.

:::viva
Core feature of delirium? :: Disturbance of attention and awareness, with acute onset and fluctuation.
CAM required features? :: Acute onset with fluctuation, and inattention, plus disorganised thinking or altered consciousness.
4AT positive score? :: Four or more.
Most often missed delirium subtype? :: Hypoactive.
Benzodiazepines indicated in delirium? :: Only for alcohol or sedative withdrawal.
Avoid haloperidol in? :: Parkinson's disease and Lewy body dementia.
Commonest dementia? :: Alzheimer's disease.
Alzheimer's hallmark pathology? :: Amyloid plaques and tau neurofibrillary tangles.
Late-onset Alzheimer's risk gene? :: APOE e4.
DLB core features? :: Fluctuating cognition, visual hallucinations, REM sleep behaviour disorder, parkinsonism.
One-year rule? :: Parkinsonism at least a year before dementia means Parkinson's disease dementia.
bvFTD features? :: Disinhibition, apathy, loss of empathy, compulsions, hyperorality, executive deficits.
NPH triad? :: Gait disturbance, urinary incontinence, cognitive decline.
Rapid dementia with myoclonus? :: Creutzfeldt-Jakob disease.
MMSE total? :: 30.
MoCA normal cut-off? :: 26 or more (add 1 point for 12 years or less of education).
ACE-III cut-offs? :: 88 and 82 out of 100.
Donepezil dose? :: 5 mg at night, increasing to 10 mg after 4 to 6 weeks.
Memantine target dose? :: 20 mg daily.
Main cardiac side effect of cholinesterase inhibitors? :: Bradycardia.
ARIA highest risk? :: APOE e4 homozygotes.
Antipsychotic mortality risk in dementia? :: About 1.6 to 1.7 times higher.
Approach to BPSD? :: DICE: describe, investigate, create, evaluate.
Modifiable dementia risk share? :: About 45% (14 factors).
Dementia prevalence in older Indians? :: About 7.4% of people aged 60 and over (LASI-DAD).
:::

:::recall
1. Outline the long answer on delirium in eight headings. || Definition, epidemiology, risk factors, causes, pathophysiology, features and assessment, differential, management and prevention.
2. Give five differences between delirium and dementia. || Onset, course, attention, consciousness, reversibility (also hallucinations and causes).
:::

`;

export const test = String.raw`
## 4.5 Module test [core]
:::mcq
Q: Which cognitive domain includes planning and judgement?
- Language
- *Executive function
- Perceptual-motor
- Memory
> Executive function.

Q: Normal ageing typically includes:
- Getting lost at home
- *Slower thinking speed
- Inability to manage money
- Visual hallucinations
> Slowing without loss of independence.

Q: The key distinguishing feature of delirium is:
- Gradual decline over years
- *Acute disturbance of attention and awareness that fluctuates
- Personality change
- Normal attention
> Inattention and fluctuation.

Q: Which delirium subtype has the worst outlook and is most often missed?
- Hyperactive
- *Hypoactive
- Mixed
- Withdrawal
> Quiet delirium.

Q: Which is a precipitating (not predisposing) factor for delirium?
- Dementia
- Age over 80
- *A new anticholinergic medicine
- Poor vision
> Triggers versus vulnerabilities.

Q: The first step in managing delirium is to:
- Sedate
- Restrain
- *Identify and treat the underlying causes
- Start a cholinesterase inhibitor
> Causes first.

Q: Which is NOT a recommended non-drug measure in delirium?
- Glasses and hearing aids
- Family presence
- Early mobility
- *Physical restraints
> Restraints increase harm.

Q: In delirium from infection, benzodiazepines:
- Are first-line
- *Usually worsen confusion and should be avoided
- Shorten the illness
- Prevent falls
> Use only for withdrawal delirium.

Q: Major neurocognitive disorder requires:
- Memory loss only
- *Significant decline interfering with independence
- Onset before 65
- Abnormal brain scan
> Function decides.

Q: Plaques and tangles are made of:
- Alpha-synuclein and prion
- *Amyloid and tau
- Huntingtin and TDP-43
- Fat and calcium
> Alzheimer's pathology.

Q: Which statement about APOE e4 is correct?
- It causes all Alzheimer's
- *It increases risk, more so with two copies
- It protects against Alzheimer's
- It is tested in all healthy adults
> A risk variant.

Q: A step-like decline after strokes with focal signs suggests:
- Alzheimer's disease
- *Vascular dementia
- Frontotemporal dementia
- Lewy body dementia
> Stepwise vascular course.

Q: Severe stiffness and confusion after a small dose of haloperidol in a man with hallucinations and parkinsonism suggests:
- Alzheimer's disease
- *Dementia with Lewy bodies
- Delirium tremens
- Vascular dementia
> Neuroleptic sensitivity.

Q: A 56-year-old with apathy, loss of empathy and sweet craving but good memory most likely has:
- Alzheimer's disease
- *Behavioural variant frontotemporal dementia
- Normal pressure hydrocephalus
- Depression only
> bvFTD.

Q: Which is potentially reversible?
- Alzheimer's disease
- Huntington's disease
- *Chronic subdural haematoma
- Frontotemporal dementia
> Surgical drainage can restore function.

Q: Which test result should be checked in every person with new cognitive decline?
- Cardiac enzymes
- *Vitamin B12
- Serum amylase
- Uric acid
> Part of the basic work-up.

Q: An older woman answering 'I don't know' to many questions after her husband's death most likely has:
- Alzheimer's disease
- *Depression with cognitive symptoms
- Creutzfeldt-Jakob disease
- Delirium
> Treat and reassess.

Q: Which test is most affected by little schooling?
- An informant history
- *Standard MMSE or MoCA items such as writing and serial sevens
- The HMSE
- Observation of daily function
> Use literacy-appropriate tools.

Q: ACE-III gives a total out of:
- 30
- 50
- *100
- 18
> Five domains.

Q: Cholinesterase inhibitors are useful in all EXCEPT:
- Alzheimer's disease
- Dementia with Lewy bodies
- Parkinson's disease dementia
- *Frontotemporal dementia
> No benefit in FTD.

Q: Before starting donepezil, which check is most important?
- Liver biopsy
- *Pulse and, if slow or with heart disease, an ECG
- Chest X-ray
- Urine drug screen
> Bradycardia risk.

Q: Memantine is mainly used for:
- Mild cognitive impairment
- *Moderate to severe Alzheimer's disease
- Delirium
- Frontotemporal dementia
> NMDA antagonist.

Q: Anti-amyloid antibodies are suitable for:
- Severe dementia
- *MCI or mild dementia due to Alzheimer's disease with confirmed amyloid
- Vascular dementia
- Any older person with forgetfulness
> Careful selection and monitoring.

Q: The best first response to agitation in a care home resident with dementia is:
- Antipsychotic
- Benzodiazepine
- *Look for pain, constipation and other causes using DICE
- Restraint
> Behaviour as communication.

Q: Feeding tubes in advanced dementia:
- Prevent pneumonia
- Prolong life
- *Do not improve survival or prevent aspiration; careful hand feeding is preferred
- Are always required
> Evidence shows no benefit.

Q: Which is a modifiable risk factor for dementia?
- APOE e4
- Age
- *Untreated hearing loss
- Female sex
> Hearing aids may reduce risk.

Q: As of Nov 2026, oral semaglutide in early Alzheimer's disease:
- Was approved
- *Did not slow decline in large phase 3 trials
- Reversed amyloid
- Is first-line in India
> EVOKE and EVOKE+ were negative.
:::
`;
