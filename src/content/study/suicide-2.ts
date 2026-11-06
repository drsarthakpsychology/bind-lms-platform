/* Module · Suicide, self-harm and risk, Parts II and III (assessment, helping, Beginner level check). Original text written for VIBHA School of Psychology. Educational content: no method details by design. */
export const part2 = String.raw`
# Part II · Assessment

## 2.1 How to ask [core][beginner]
### Principles
- **Ask everyone** in a mental health assessment, not only those who look depressed.
- **Ask directly**, using the words "suicide" or "ending your life". Euphemisms ("You wouldn't do anything silly?") invite a "no".
- **Normalise** first: "Many people who feel this low have thoughts of death."
- **Move step by step** from general to specific, and from less to more sensitive.
- **Be calm and unhurried.** Your steadiness tells the person that their answer can be heard.
- **Ask in private**, and separately from family where possible.

### A sequence that works
1. "How have things been for you lately? How do you see the future?" (hopelessness)
2. "Have you felt that life isn't worth living?" (passive ideation)
3. "Have you had thoughts of ending your life?" (active ideation)
4. "When did these thoughts start? How often? How strong? Can you push them away?"
5. "Have you thought about how you might do it? Have you made any preparations?" (plan and preparation; you record whether a plan exists and how far it has gone, not the details of a method)
6. "How likely do you think you are to act on these thoughts?" (intent)
7. "Have you ever tried to end your life before?" (past attempts)
8. "What has stopped you so far? What keeps you going?" (protective factors, reasons for living)

### The CASE approach (Shea)
To reduce missed information, cover four time frames in order: **presenting** suicidal events, **recent** events (past couple of months), **past** events (lifetime), and **immediate** thoughts and plans (now and the coming days), using behavioural, specific questions.

:::widget decide
{"scene": "Mr Pillai, 58, a retired bank manager in Thiruvananthapuram, is seen for 'sleep problems' after his wife's death last year. He says he is 'just tired'. He has stopped meeting friends and has written letters to his children 'just in case'. A junior colleague asks, 'You're not suicidal, are you, sir?' He laughs: 'No, no.'", "ask": "What should happen next?", "choices": [{"label": "Accept his answer and treat his sleep", "verdict": "harm", "outcome": "The letters, withdrawal and recent bereavement are never explored.", "why": "A leading question invited a socially easy 'no'. Warning signs were present."}, {"label": "Ask again, gently and directly: 'Since your wife died, have you had thoughts of ending your life? You mentioned letters for your children. Can you tell me about them?'", "verdict": "best", "outcome": "He admits he has been thinking about suicide for months and has made preparations. A safety plan, treatment and family involvement follow.", "why": "Direct, specific, non-judgemental questions, linked to what he has already said, uncover hidden risk."}, {"label": "Ask his son whether he is suicidal, without telling him", "verdict": "ok", "outcome": "The son is unsure; the key information remains with Mr Pillai.", "why": "Collateral is valuable, ideally with consent, but the person himself must be asked first and directly."}]}
:::

:::widget flow
{"title": "The asking sequence", "layout": "chain", "nodes": [{"id": "future", "label": "The future", "detail": "How do you see the future? (hopelessness)"}, {"id": "passive", "label": "Passive thoughts", "detail": "Have you felt life isn't worth living?"}, {"id": "active", "label": "Active thoughts", "detail": "Have you had thoughts of ending your life?"}, {"id": "detail", "label": "Frequency and control", "detail": "How often? How strong? Can you push them away?"}, {"id": "plan", "label": "Plan and preparation", "detail": "Is there a plan, and have any steps been taken?"}, {"id": "intent", "label": "Intent", "detail": "How likely are you to act?"}, {"id": "past", "label": "Past attempts", "detail": "Have you tried before?"}, {"id": "reasons", "label": "Reasons for living", "detail": "What keeps you going?"}]}
:::

:::recall
1. Why avoid "You wouldn't do anything silly, would you?" || It is euphemistic and leading; it invites "no".
2. Give the step-by-step sequence of questions. || Future and hopelessness; passive ideation; active ideation; frequency and control; plan and preparation; intent; past attempts; reasons for living.
3. What are the four time frames of the CASE approach? || Presenting, recent, past, immediate.
:::

:::mcq
Q: Which question is best?
- "You're not thinking of suicide, are you?"
- "Do you sometimes feel a bit down?"
- *"Have you had thoughts of ending your life?"
- "Why would you want to die?"
> Direct and neutral.
:::

## 2.2 What to establish [core][beginner]
### The suicidal thinking itself
| Area | What to understand |
|---|---|
| Ideation | Passive or active; onset, frequency, duration, intensity; how controllable; what triggers it |
| Plan | Whether there is one, how specific and detailed it is, and whether it has been thought through to timing and place |
| Access to means | Whether the person has access to the means they have considered (asked so that it can be made safer) |
| Preparation and rehearsal | Steps taken: obtaining means, notes, putting affairs in order, giving things away, rehearsing in the mind or in action |
| Intent | How strongly they intend to act; what they expect would happen |
| Past attempts | Number, circumstances, expected lethality, chance of rescue, reaction afterwards (regret or regret at surviving) |
| Reasons for living | Children, family, faith, goals, fear of dying, hope |

### The context
- **Current mental state**: depression, hopelessness, agitation, anxiety, insomnia, psychosis (especially command hallucinations or nihilistic and guilt delusions), intoxication, impulsivity.
- **Current stressors and why now**: losses, conflict, debt, shame, abuse, legal trouble.
- **Supports**: who is around, who knows, who can help.
- **Collateral**: with consent where possible; without it when safety requires.

### From assessment to formulation
Instead of labelling a person "low", "medium" or "high" risk, write a **risk formulation**: why this person is suicidal now (predisposing, precipitating, perpetuating factors), what protects them, what would make things worse, and what the plan is.

:::widget worked
{"title": "A risk formulation", "steps": [{"q": "Who and what?", "a": "Anil, 34, a construction supervisor in Surat, with a two-month depressive episode and daily alcohol use, presents with active suicidal thoughts after losing his job and being shamed by his creditors."}, {"q": "Predisposing factors?", "a": "Father died by suicide; previous attempt at 22 after a break-up; impulsive when drinking."}, {"q": "Precipitating and perpetuating factors?", "a": "Job loss and public humiliation (precipitating); debt, heavy drinking, insomnia, hopelessness and isolation from his wife, who has moved to her parents' (perpetuating)."}, {"q": "Protective factors?", "a": "Loves his daughter, aged 6; some religious belief that suicide is wrong; brother supportive; willing to accept help."}, {"q": "What would raise risk further, and what is the plan?", "a": "Intoxication, contact with creditors, being alone at night. Plan: safety plan with his brother; means made safer at home with family; treat depression and alcohol use; help with debt and work; daily contact this week; review in two days; admission if he cannot stay safe."}]}
:::

:::clinician
### Tools that help, and their limits
- The **Columbia Suicide Severity Rating Scale (C-SSRS)** structures enquiry about ideation (wish to be dead through active ideation with plan and intent) and behaviour (actual, interrupted and aborted attempts, preparatory acts). It is useful for **structured enquiry and communication**, not as a prediction score.
- Beck's Scale for Suicide Ideation and the Beck Hopelessness Scale measure severity.
- Guidelines (for example NICE 2022 on self-harm) advise **against** using risk tools or global risk categories (low, medium, high) to predict future suicide or to decide who gets treatment. Use them to structure assessment; base decisions on a needs-focused formulation.
- Document what was asked, what was said (in the person's words), collateral, the formulation and the plan.
:::

:::widget layers
{"title": "Building a risk formulation", "shape": "stack", "layers": [{"label": "Plan", "detail": "What we will do together, who does what, and when we review."}, {"label": "What would make it worse", "detail": "Intoxication, contact with creditors, being alone at night."}, {"label": "Protective factors", "detail": "Reasons for living, supports, engagement."}, {"label": "Perpetuating factors", "detail": "What keeps the crisis going."}, {"label": "Precipitating factors", "detail": "Why now?"}, {"label": "Predisposing factors", "detail": "History, temperament, family, past attempts."}], "caption": "Read from the bottom up: the formulation explains why this person is suicidal now and leads to a plan, instead of a risk label."}
:::

:::recall
1. Name six areas to establish about suicidal thinking. || Ideation, plan, access to means, preparation, intent, past attempts (plus reasons for living).
2. What is a risk formulation? || An account of why the person is suicidal now, what protects them, what would worsen things, and the plan, rather than a risk label.
3. What does NICE advise about risk scales? || Do not use them, or low-medium-high categories, to predict suicide or allocate treatment.
:::

:::mcq
Q: Which finding most raises immediate concern?
- Passive thoughts of death a year ago, none now
- *Active ideation with a specific plan, access to means and preparatory acts
- Feeling sad after an argument
- Worry about exams
> Plan, means and preparation signal urgency.
:::

## 2.3 Self-harm in the emergency department [core][beginner]
Every person who presents after self-harm deserves **respectful, prompt care** and a **psychosocial assessment**.

### The sequence
1. **Medical care first**: treat injuries and poisoning; assess consciousness and capacity.
2. **Respect and dignity**: staff attitudes matter. People who feel judged or punished are less likely to seek help next time.
3. **Psychosocial assessment** (by a trained clinician once the person is medically fit and not intoxicated): the episode (intent, planning, expected outcome, circumstances), current suicidal thoughts, mental state, stressors, supports, safety at home, and the person's own goals.
4. **Plan** with the person: safety plan, treatment, help with problems, follow-up arranged before they leave.
5. **Inform the GP or community team** and arrange early follow-up (many services aim for contact within about three days).

### In India
- Self-poisoning presentations are often registered as **medicolegal cases**. Under section 115 of the Mental Healthcare Act 2017, the person is presumed to be under severe stress and is not to be tried or punished; the government must provide care, treatment and rehabilitation.
- Families often wish to take the person home quickly to avoid stigma; explain gently why assessment and follow-up matter.

:::widget decide
{"scene": "Priya, 19, an engineering student in Hyderabad, is medically stable after an episode of self-harm. A ward staff member says loudly, 'She just wanted attention; she'll do it again.' Priya asks to leave without seeing anyone else.", "ask": "What do you do?", "choices": [{"label": "Let her leave since she is medically fine", "verdict": "harm", "outcome": "She goes home without any assessment, plan or follow-up.", "why": "Medical stability is not the end of care. Every self-harm presentation needs psychosocial assessment."}, {"label": "Apologise for the comment, speak with her privately and respectfully, explain why a short conversation matters, check her capacity and current safety, and complete a psychosocial assessment and plan with her", "verdict": "best", "outcome": "She discloses months of ragging and exam failure. A plan with her parents, the college counsellor and follow-up is agreed.", "why": "Respect repairs the harm of judgemental care; assessment uncovers what needs to change."}, {"label": "Agree with the staff member and discharge her with advice to 'stop doing this'", "verdict": "harm", "outcome": "She feels humiliated and does not seek help when the next crisis comes.", "why": "Judgemental responses increase future risk."}]}
:::

:::widget flow
{"title": "The self-harm care pathway", "layout": "chain", "nodes": [{"id": "medical", "label": "Medical care", "detail": "Treat injury or poisoning; check consciousness."}, {"id": "respect", "label": "Respect", "detail": "Calm, non-judgemental staff attitudes."}, {"id": "capacity", "label": "Capacity and sobriety", "detail": "Wait until the person can take part."}, {"id": "assess", "label": "Psychosocial assessment", "detail": "Episode, current state, context, supports, safety."}, {"id": "plan", "label": "Plan together", "detail": "Safety plan, treatment, practical help."}, {"id": "follow", "label": "Follow-up", "detail": "Early contact after discharge; inform other services."}]}
:::

:::recall
1. What must every person presenting after self-harm receive? || Respectful care and a psychosocial assessment, with a plan and follow-up.
2. Why do staff attitudes matter? || Judgement and hostility reduce future help-seeking.
3. What does section 115 of the Mental Healthcare Act require? || A presumption of severe stress, no trial or punishment, and government provision of care, treatment and rehabilitation.
:::

:::mcq
Q: When is the best time for psychosocial assessment after self-poisoning?
- While the person is still intoxicated
- *Once medically fit, with capacity, and not intoxicated
- Only after a week
- Never; medical care is enough
> Assessment requires a clear mind.
:::

# Part III · Helping

## 3.1 Safety planning and level of care [core][beginner]
### The safety plan (Stanley and Brown)
A safety plan is written **with** the person, in their words, and kept where they can reach it (paper, phone).
1. **Warning signs**: thoughts, feelings, situations that come before a crisis.
2. **Internal coping strategies**: things I can do on my own to take my mind off it (walk, music, prayer, a shower).
3. **People and social settings that provide distraction**.
4. **People I can ask for help**, with phone numbers.
5. **Professionals and services** to contact, including emergency numbers.
6. **Making the environment safer**: reducing access to means, agreed with the person and, with consent, family.
Adding **reasons for living** at the top is common.

:::widget worked
{"title": "Building Anil's safety plan", "steps": [{"q": "Step 1: warning signs?", "a": "Lying awake at night; drinking alone; a creditor's phone call; thinking 'I'm a failure, my daughter is better off without me.'"}, {"q": "Step 2: things he can do alone?", "a": "Walk to the temple; listen to old Kishore Kumar songs; take a cold shower; look at his daughter's photos."}, {"q": "Step 3: people and places for distraction?", "a": "His friend Ramesh's tea stall; cricket with neighbours on Sunday."}, {"q": "Step 4: people to ask for help?", "a": "His brother Suresh (phone number written in); his wife, once they agree to talk."}, {"q": "Step 5: professionals?", "a": "His psychiatrist's clinic number; the hospital emergency department."}, {"q": "Step 6: making the environment safer?", "a": "With Anil's agreement, Suresh keeps his medicines and dispenses a week at a time; alcohol is removed from the house; agreed steps for anything else at home that Anil has thought of using."}]}
:::

:::trap No-suicide contracts
Asking a person to sign a promise not to harm themselves is **not** recommended. It has no evidence of benefit, can make people hide their thoughts, and gives clinicians false reassurance. Safety plans are different: they are practical, collaborative tools for what to do when a crisis comes.
:::

### Means safety
Reducing access to lethal means is one of the most effective suicide prevention strategies at both individual and population levels, because many suicidal crises are brief and the method available often decides whether a person survives. Discuss it openly and collaboratively, involve family with consent, and arrange safe storage or removal. At population level, examples include regulating highly hazardous pesticides and making public places safer.

### Level of care
| Option | When |
|---|---|
| Outpatient care with close follow-up | Ideation without intent or plan, good supports, able to use a safety plan |
| Crisis or home treatment, daily contact | More severe distress, willing to engage, supports present |
| Inpatient admission | High intent, recent serious attempt, cannot stay safe, psychosis or severe agitation, no safe environment |

Under the Mental Healthcare Act 2017, admission may be **independent** (the person consents) or **supported** (when strict criteria are met, including recent threats or attempts of self-harm, with safeguards and review by the Mental Health Review Board). Admission does not remove risk; the weeks after discharge need especially close follow-up.

:::widget flow
{"title": "The six steps of a safety plan", "layout": "chain", "nodes": [{"id": "signs", "label": "1. Warning signs", "detail": "Thoughts, feelings and situations that come before a crisis."}, {"id": "cope", "label": "2. Coping on my own", "detail": "Walks, music, prayer, a shower."}, {"id": "distract", "label": "3. People and places for distraction", "detail": "A friend's shop, a temple, a park."}, {"id": "help", "label": "4. People I can ask for help", "detail": "Names and numbers."}, {"id": "prof", "label": "5. Professionals and services", "detail": "Clinic, emergency department."}, {"id": "safe", "label": "6. Making my surroundings safer", "detail": "Reducing access to means, agreed with family."}], "caption": "Written with the person, in their words, and kept where they can reach it."}
:::

:::widget flow
{"title": "Choosing the level of care", "layout": "tree", "nodes": [{"id": "root", "label": "After assessment", "detail": "Match care to need, not to a score."}, {"id": "out", "label": "Outpatient with close follow-up", "detail": "Ideation without intent or plan; good supports; can use a safety plan.", "parent": "root"}, {"id": "crisis", "label": "Crisis or home treatment", "detail": "More severe distress, willing to engage, supports present; daily contact.", "parent": "root"}, {"id": "admit", "label": "Inpatient admission", "detail": "High intent, recent serious attempt, psychosis or agitation, no safe place.", "parent": "root"}, {"id": "indep", "label": "Independent admission", "detail": "The person consents.", "parent": "admit"}, {"id": "supp", "label": "Supported admission", "detail": "Strict MHCA criteria with safeguards and Board review.", "parent": "admit"}]}
:::

:::recall
1. List the six steps of a safety plan. || Warning signs; internal coping; people and places for distraction; people to ask for help; professionals and services; making the environment safer.
2. Why are no-suicide contracts not recommended? || No evidence of benefit; they may make people hide thoughts and give false reassurance.
3. Why does means safety work? || Many crises are brief; reducing access to lethal means increases the chance of survival.
:::

:::mcq
Q: Which is part of a Stanley-Brown safety plan?
- A signed promise not to self-harm
- *A list of people and professionals to contact when warning signs appear
- A risk score
- A diagnosis
> Collaborative and practical.
:::

## 3.2 India: law and safe messaging [core][beginner]
### The law
- **Mental Healthcare Act 2017, section 115**: notwithstanding section 309 of the old Indian Penal Code, any person who attempts suicide shall be presumed, unless proved otherwise, to have **severe stress** and shall **not be tried and punished**. The appropriate government has a **duty to provide care, treatment and rehabilitation** to reduce the risk of recurrence.
- **Bharatiya Nyaya Sanhita 2023** (in force from July 2024), which replaced the IPC, does not retain the general offence of attempting suicide. It does make it an offence to attempt suicide in order to compel or restrain a public servant from performing their duty (section 226).
- **Abetment of suicide** remains an offence.
- **National Suicide Prevention Strategy (2022)**: India's first national strategy, aiming to reduce suicide mortality by 10% by 2030 through surveillance, crisis support, school-based programmes, media guidelines and means restriction.

### Safe messaging
How suicide is discussed in the media and online affects risk. Sensational reporting can lead to imitation (the **Werther effect**). Stories of people coping with suicidal crises can protect (the **Papageno effect**).

| Do | Avoid |
|---|---|
| Include where to get help | Describing methods or locations |
| Share stories of hope and recovery | Sensational or glamorised headlines |
| Use non-judgemental language ("died by suicide") | "Committed suicide" (implies crime) |
| Explain that suicide is complex and preventable | Simplistic single-cause explanations |
| Respect the bereaved's privacy | Photos of the person, family or scene; suicide notes |

The Press Council of India adopted guidelines based on WHO's media recommendations. On social media, report worrying posts to the platform and reach out to the person; do not share images or details.

:::widget sort
{"prompt": "Safe or unsafe messaging about suicide?", "buckets": ["Safe", "Unsafe"], "items": [{"text": "\"Student died by suicide; experts say exam stress is one of many factors; help is available\"", "bucket": 0}, {"text": "\"Heartbroken lover ends life: shocking photos inside\"", "bucket": 1}, {"text": "A first-person story of someone who got through a suicidal crisis", "bucket": 0}, {"text": "Reporting the exact method and place in the headline", "bucket": 1}, {"text": "\"He committed suicide because he failed\"", "bucket": 1, "why": "'Committed' implies a crime, and a single cause is simplistic."}]}
:::

:::recall
1. What does section 115 of the Mental Healthcare Act say? || A person who attempts suicide is presumed under severe stress, is not tried or punished, and must be given care, treatment and rehabilitation.
2. What does the Bharatiya Nyaya Sanhita say about attempted suicide? || The general offence is not retained; attempting suicide to compel or restrain a public servant is an offence (section 226).
3. Distinguish the Werther and Papageno effects. || Werther: imitation after sensational reporting. Papageno: protection from stories of coping.
:::

:::mcq
Q: Which phrase follows safe messaging guidance?
- "Committed suicide"
- "Successful suicide"
- *"Died by suicide"
- "Failed attempt"
> Neutral, non-criminal language.
:::

## 3.3 Risk to others [extra][beginner]
Violence risk assessment shares principles with suicide risk assessment: careful history, current state, formulation and a management plan, not prediction.

### Factors associated with violence
- **Historical (static)**: past violence (strongest predictor), early behavioural problems, substance misuse, personality disorder (especially antisocial), victimisation.
- **Clinical (dynamic)**: current substance use, active psychosis with threat-related delusions or command hallucinations, poor insight, hostility, impulsivity, non-adherence.
- **Situational**: access to weapons, specific target, stressors, lack of support, discharge without a plan.

### Structured professional judgement
Tools such as the **HCR-20** (historical, clinical and risk management items) guide a structured review leading to a formulation and plan, rather than a score. Mental illness alone accounts for only a small share of violence in society; substance use is a stronger factor.

### Confidentiality
Under section 23 of the Mental Healthcare Act 2017, information may be released to protect another person from harm or violence, limited to what is necessary. Discuss with senior colleagues and document the reasoning.

:::recall
1. What is the strongest predictor of future violence? || Past violence.
2. What does HCR-20 stand for? || Historical, clinical and risk management items.
:::

:::mcq
Q: Which factor most increases violence risk in a person with psychosis?
- Having a diagnosis alone
- *Co-occurring substance misuse with threat-related delusions
- Being female
- Taking medicine regularly
> Substance use is a strong driver.
:::

## 3.4 Treatments that lower suicide [core][beginner]
| Intervention | Evidence |
|---|---|
| Lithium in mood disorders | Strong observational and meta-analytic evidence of lower suicide rates, though one large US trial in veterans (2022) did not show reduced suicidal behaviour |
| Clozapine in schizophrenia | Reduced suicidal behaviour versus olanzapine in a large randomised trial |
| Dialectical behaviour therapy (DBT) | Reduces self-harm in people with borderline personality disorder and recurrent self-harm |
| Cognitive therapy for suicide prevention (CT-SP) | Halved repeat attempts in a landmark trial after an attempt |
| Collaborative Assessment and Management of Suicidality (CAMS) | Reduces suicidal ideation; collaborative, suicide-focused |
| Brief contact interventions | Caring letters, postcards, phone calls after discharge; some reduce repeat attempts |
| Safety planning with follow-up calls | Reduced suicidal behaviour by nearly half in a large emergency department study |
| Attempted Suicide Short Intervention Program (ASSIP) | Three sessions plus letters; reduced repeat attempts in a Swiss trial |
| ECT | Rapidly reduces suicidal ideation in severe depression |
| Esketamine and ketamine | Rapid, short-term reduction in suicidal thoughts; esketamine is US-approved for depression with acute suicidal ideation or behaviour (with an oral antidepressant) |
| Treating depression and alcohol use | Essential, though antidepressants carry a warning about suicidal thinking in under-25s, so monitor closely early on |
| Means restriction | Strong population-level evidence |

:::widget decide
{"scene": "Ms Thomas, 42, from Kochi, has bipolar disorder with two past suicide attempts during depressive episodes. She stopped lithium a year ago because of weight gain and is now depressed again. She asks for 'just an antidepressant'.", "ask": "What is the best plan?", "choices": [{"label": "Start an antidepressant alone", "verdict": "harm", "outcome": "She becomes agitated and has a mixed episode within weeks, with more suicidal thoughts.", "why": "Antidepressant monotherapy in bipolar disorder risks switching and mixed states; lithium's antisuicidal benefit is lost."}, {"label": "Discuss restarting lithium (addressing the weight concerns), with close monitoring, a safety plan, means safety, and psychological support", "verdict": "best", "outcome": "She agrees to restart lithium with dietary support. Her mood lifts over weeks and she has no further attempts.", "why": "Lithium has the best evidence for lowering suicide in mood disorders; collaborative attention to side effects improves adherence."}, {"label": "Admit her immediately without discussion", "verdict": "ok", "outcome": "She feels unheard; the core treatment question is unaddressed.", "why": "Admission may be needed if she cannot stay safe, but it is not a substitute for effective treatment and collaboration."}]}
:::

:::widget layers
{"title": "Levels of prevention", "shape": "stack", "layers": [{"label": "Indicated", "detail": "People who have attempted or are suicidal now: assessment, safety planning, CT-SP, DBT, follow-up, lithium or clozapine where indicated."}, {"label": "Selective", "detail": "Groups at higher risk: gatekeeper training in colleges, support after bereavement, screening in primary care."}, {"label": "Universal", "detail": "Everyone: means restriction, alcohol policy, safe media reporting, school well-being programmes, reducing stigma."}], "caption": "Population measures at the base often prevent the most deaths."}
:::

:::widget journey
{"drug": "lithium", "target": "intracellular signalling in mood and impulse-control circuits", "routes": ["oral"], "notes": {"liver": "Lithium is not broken down by the liver at all.", "out": "It leaves through the kidneys, so dehydration, kidney disease and some medicines (NSAIDs, ACE inhibitors, thiazides) raise levels; levels are monitored."}, "caption": "Why lithium needs blood levels, and why supply is managed carefully for people at risk."}
:::

:::recall
1. Which two medicines have the strongest evidence for reducing suicide in specific disorders? || Lithium (mood disorders) and clozapine (schizophrenia).
2. Name three psychological interventions that reduce suicidal behaviour. || DBT, CT-SP, CAMS (also ASSIP, safety planning with follow-up).
3. What are brief contact interventions? || Caring letters, postcards or calls after discharge.
:::

:::mcq
Q: Which statement about antidepressants and suicide is correct?
- They always increase suicide risk
- They have no relation to suicidal thinking
- *Treating depression lowers risk overall, but young people need close monitoring early in treatment
- They are contraindicated in suicidal patients
> The under-25 warning means monitor, not withhold.
:::

## 3.5 After a suicide: postvention [core][beginner]
**Postvention** is support for people affected by a suicide. It is also prevention, because people bereaved by suicide are themselves at raised risk.

### For families and friends
- Grief after suicide often includes shock, guilt ("I should have seen it"), anger, shame, stigma, searching for reasons, and sometimes relief after long distress.
- Offer support without judgement; allow talk about the person and how they died.
- Watch for prolonged grief, depression, PTSD and suicidal thoughts.
- Peer support groups for people bereaved by suicide can help.

### For schools, colleges and workplaces
- A planned response: inform people sensitively, avoid glorifying memorials, offer support to close friends and those at risk, and follow safe messaging.
- Watch for clusters, especially among young people.

### For clinicians
Losing a patient to suicide is common in a mental health career and deeply affects clinicians: grief, guilt, fear of blame, and doubts about their work. Supervision, peer support and a non-blaming review process help. Reviews should seek learning, not scapegoats.

:::widget decide
{"scene": "A Class 11 student in Kota has died by suicide. The coaching centre wants to hold a large assembly with her photo, and some students are sharing details of how she died on WhatsApp.", "ask": "What would you advise the centre?", "choices": [{"label": "Hold the assembly with her photo and a detailed account so students understand", "verdict": "harm", "outcome": "Several vulnerable students become more distressed; one discloses new suicidal thoughts.", "why": "Glorifying memorials and detailed accounts increase the risk of contagion."}, {"label": "Inform students simply and sensitively; offer small-group and individual support, especially to close friends and vulnerable students; ask students not to share details or images; give clear information about where to get help; contact the family respectfully", "verdict": "best", "outcome": "Students feel supported; those at risk are identified and linked to counselling.", "why": "Planned postvention follows safe messaging, supports the bereaved and reduces contagion."}, {"label": "Say nothing and carry on with classes", "verdict": "harm", "outcome": "Rumours spread; distressed students receive no support.", "why": "Silence leaves the bereaved unsupported and lets unsafe messaging spread."}]}
:::

:::widget flow
{"title": "Postvention in a college", "layout": "chain", "nodes": [{"id": "inform", "label": "Inform sensitively", "detail": "Simple facts, no method details, no glorifying."}, {"id": "support", "label": "Support those closest", "detail": "Friends, roommates, classmates, staff."}, {"id": "identify", "label": "Identify those at risk", "detail": "Watch for clusters and vulnerable students."}, {"id": "message", "label": "Safe messaging", "detail": "Ask students not to share images or details online."}, {"id": "family", "label": "Contact the family", "detail": "Respectfully, offering support."}, {"id": "review", "label": "Review and learn", "detail": "Non-blaming review of what can improve."}]}
:::

:::recall
1. What is postvention? || Support for people affected by a suicide, which also prevents further suicides.
2. Name three features of grief after suicide. || Guilt, anger, shame and stigma, searching for reasons, shock.
3. Give two rules for schools after a suicide. || Inform sensitively; avoid glorifying memorials and details; support those at risk; follow safe messaging.
:::

:::mcq
Q: After a suicide in a college, the main reason to avoid sharing details and images is:
- Legal liability only
- *To reduce the risk of imitation among vulnerable students
- To hide what happened
- To save time
> Contagion is a real risk.
:::

## 3.6 Level check · Beginner [beginner]
Twelve or more right out of fifteen opens the Advanced level.

:::mcq
Q: Self-injury without any intent to die is called:
- Aborted attempt
- *Non-suicidal self-injury
- Interrupted attempt
- Passive ideation
> Intent defines the term.

Q: After hospital-treated self-harm, suicide within 5 years occurs in roughly:
- Under 0.1%
- *About 4%
- About 25%
- About 50%
> Risk is highest in the first year.

Q: The strongest single risk factor for suicide is:
- Unemployment
- *A previous attempt
- Living alone
- Young age
> Past behaviour.

Q: In Joiner's interpersonal theory, suicidal desire arises from:
- Anomie and fatalism
- *Thwarted belongingness and perceived burdensomeness
- Psychache alone
- Low serotonin
> Capability enables action.

Q: In the IMV model, the key link to ideation is:
- Impulsivity
- *Entrapment after defeat or humiliation
- Access to means
- Genetics
> Volitional factors govern action.

Q: Durkheim's suicide from sudden loss of social regulation is:
- Egoistic
- Altruistic
- *Anomic
- Fatalistic
> For example economic collapse.

Q: The CASE approach covers:
- Only current thoughts
- *Presenting, recent, past and immediate suicidal events
- Family history only
- Medication history only
> Reduces missed information.

Q: NICE advises that risk scales should:
- Decide who gets treatment
- *Not be used to predict suicide or allocate care
- Replace clinical assessment
- Be used only in children
> Use a needs-based formulation.

Q: Which is NOT a step of the Stanley-Brown safety plan?
- Warning signs
- Internal coping strategies
- People and professionals to contact
- *A signed no-suicide contract
> Contracts are not recommended.

Q: Means safety works because:
- People always find another way
- *Many crises are brief, and the method available affects survival
- It replaces treatment
- It is required by law
> Strong population evidence.

Q: Under section 115 of the Mental Healthcare Act 2017, a person who attempts suicide:
- Is prosecuted under IPC 309
- *Is presumed under severe stress, not tried or punished, and must receive care
- Must be admitted for 6 months
- Loses the right to vote
> Care, not punishment.

Q: Sensational media reporting of suicide can cause:
- The Papageno effect
- *The Werther effect
- No effect
- Lower suicide rates
> Imitation.

Q: Which medicine has the best evidence for lowering suicide in mood disorders?
- Benzodiazepines
- *Lithium
- Antipsychotics in general
- Stimulants
> Clozapine in schizophrenia.

Q: The strongest predictor of future violence is:
- Diagnosis of schizophrenia
- *Past violence
- Being young
- Low income
> Static historical factor.

Q: People bereaved by suicide:
- Are at lower risk themselves
- *Are at raised risk and need postvention support
- Need no special support
- Should not talk about it
> Postvention is prevention.
:::
`;
