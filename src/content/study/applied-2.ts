/* Module · Applied and emerging areas, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: environment, law, sport, the digital world and AI

## 3.1 Environmental psychology [core][advanced]
**Environmental psychology** studies the two-way relationship between people and their physical surroundings, built and natural: how places shape behaviour and wellbeing, and how behaviour shapes the planet.

### Behaviour settings
**Roger Barker** spent decades observing everyday life in a small Kansas town and found that behaviour is predicted better by the **setting** than by the person: everyone behaves "church-like" in church and "shop-like" in a shop. A **behaviour setting** combines a place, a time and a standing pattern of behaviour. His **staffing theory** found that **undermanned** settings (small schools, small clubs) give each person more roles and responsibility than **overmanned** ones.

### Environmental stressors
- **Noise**: unpredictable, uncontrollable noise is the most harmful. In laboratory studies by **Glass and Singer**, people exposed to random bursts of loud noise later showed **lower frustration tolerance**, even after the noise stopped; when they believed they could switch it off (even without doing so), the after-effects shrank. Children in a New York school whose classrooms faced an elevated train track lagged behind classmates on the quiet side in reading, and the gap closed after noise-reducing changes.
- **Crowding**: **density** is the number of people per space; **crowding** is the **unpleasant feeling** that there are too many people (Daniel Stokols's distinction). High density is not always felt as crowding: a packed wedding hall feels festive, a packed hospital corridor feels oppressive. Control, purpose, culture and relationships change the experience. Indian researchers (notably Uday Jain) studied crowding in Indian homes and found that household density affected wellbeing and children's development, but family cohesion and cultural expectations moderated the effect.
- **Heat and air pollution**: heat raises irritability and aggression and lowers performance; air pollution is linked with poorer cognition and higher rates of depression. Both are major issues in Indian cities, where heatwaves and winter smog are now regular events.

:::widget compare
{"title": "Glass and Singer's noise studies", "a": {"label": "Unpredictable, no control", "points": ["Loud bursts at random times", "No way to stop them", "Later: gives up sooner on unsolvable puzzles", "More errors on a proofreading task"], "summary": "The harm shows up after the noise ends, as lower frustration tolerance."}, "b": {"label": "Predictable, or with a stop button", "points": ["Same loudness, at regular times", "Or a button that could stop the noise, even if never pressed", "Later: persists much longer on puzzles", "Fewer errors"], "summary": "Predictability and perceived control protect against the after-effects. The belief that you could act is enough."}}
:::

:::widget guess
{
  "prompt": "Hall's proxemics divides space around a person into zones. In his scheme, roughly where does the 'personal' zone (for friends and family conversation) end?",
  "min": 0,
  "max": 400,
  "step": 10,
  "unit": "cm",
  "answer": [110, 130],
  "reveal": "At about 1.2 metres (4 feet). Intimate distance is up to about 45 cm, personal distance from 45 cm to 1.2 m, social distance from 1.2 to 3.6 m, and public distance beyond that. The exact distances vary a lot by culture, gender and setting.",
  "clinician": "Hall's four zones were based on middle-class Americans. Cross-cultural studies show smaller preferred distances in many Latin American, Arab and South Asian settings, and gender norms matter: in many Indian settings men stand close to men but keep more distance from unrelated women. Personal space intrusions raise arousal and compensatory behaviours (looking away, turning), as described by equilibrium theory."
}
:::

### Personal space, territory and privacy
- **Personal space**: the invisible, portable bubble around a person; intrusion causes discomfort.
- **Territoriality** (Irwin Altman): **primary** territories (your home, your bedroom), **secondary** territories (your usual seat in class, the neighbourhood tea stall) and **public** territories (a park bench). People mark and defend them.
- **Privacy** is not just being alone; Altman described it as the **regulation** of how much contact we have, opening and closing the boundary as needed.


:::widget layers
{
  "title": "Hall's zones of personal space",
  "shape": "rings",
  "layers": [
    { "label": "Intimate (up to about 45 cm)", "detail": "Comforting, loving, whispering. Strangers here cause strong discomfort." },
    { "label": "Personal (about 45 cm to 1.2 m)", "detail": "Conversations with friends and family." },
    { "label": "Social (about 1.2 to 3.6 m)", "detail": "Business, shopkeepers, acquaintances." },
    { "label": "Public (beyond about 3.6 m)", "detail": "Lectures, speeches, performances." }
  ],
  "caption": "Distances vary with culture, gender and setting; these are Hall's American figures."
}
:::

### Restorative environments
- **Roger Ulrich's** study of patients recovering from gall bladder surgery found that those whose windows looked onto **trees** had shorter hospital stays, needed fewer strong painkillers and received fewer negative nurse notes than matched patients facing a brick wall (**stress recovery theory**).
- **Attention restoration theory**, from a husband-and-wife team of American environmental psychologists: nature restores **directed attention** that tires with effort. Restorative settings have four qualities: **being away**, **extent** (a whole other world), **soft fascination** and **compatibility** with what you want to do.
- **Biophilia** (E. O. Wilson): humans have an inborn affinity for living things.

:::widget compare
{"title": "Why does nature help?", "a": {"label": "Attention restoration", "points": ["Effortful focus tires directed attention", "Nature holds attention gently ('soft fascination')", "Needs being away, extent, fascination and compatibility", "Benefit: better concentration"], "summary": "Nature rests the mental muscle used for focus."}, "b": {"label": "Stress reduction", "points": ["Ulrich's view, from his hospital window study", "Natural scenes quickly calm the body", "A fast emotional response, inherited from our past", "Benefit: lower arousal, better mood, faster recovery"], "summary": "Nature lowers stress before we even think about it. The two theories are compatible."}}
:::

:::widget sort
{
  "prompt": "Which concept from environmental psychology fits each example?",
  "buckets": ["Crowding", "Territoriality", "Restoration", "Behaviour setting"],
  "items": [
    { "text": "Feeling suffocated in a packed Mumbai local train, though a festival crowd felt joyful", "bucket": 0 },
    { "text": "A student puts his bag on the same library seat every morning", "bucket": 1 },
    { "text": "A walk in Kankaria lake garden after exams leaves you able to focus again", "bucket": 2 },
    { "text": "Everyone speaks softly in the hospital's ICU waiting room", "bucket": 3 },
    { "text": "Patients with a window view of trees recover faster", "bucket": 2 },
    { "text": "A shopkeeper marks the pavement in front of his shop with crates", "bucket": 1 }
  ]
}
:::

### Pro-environmental behaviour and climate
- **The tragedy of the commons**: when a resource is shared (groundwater, fish, clean air), each person gains from using more, but everyone loses if all do. These are **social dilemmas**.
- **Norms work**: in hotel studies, cards saying "most guests in this room reuse their towels" (a **descriptive norm**) produced more reuse than cards appealing to protecting the environment.
- **The value-belief-norm theory** says pro-environmental action flows from values, beliefs about consequences and a sense of personal obligation.
- **Attitude-behaviour gap**: people say they care but act otherwise when costs or habits get in the way.
- **Climate anxiety**: a large survey of 10,000 young people in ten countries, including India, found that well over half were very or extremely worried about climate change, and many felt governments were failing them. Climate distress is usually a rational response, not a disorder.

:::example Chipko and Swachh Bharat
In the **Chipko movement** (from 1973, in what is now Uttarakhand), village women hugged trees to stop commercial felling; in 1974 **Gaura Devi** led the women of Reni village. It is studied as collective action rooted in daily dependence on forests. Decades later, **Swachh Bharat** (from 2014) tried to change sanitation behaviour across India; evaluations found toilet construction was fast, but **use** depended on social norms, beliefs about purity and pollution, and water access: a lesson in why building infrastructure is not the same as changing behaviour.
:::

### Disasters
Psychologists study responses to disasters such as the **Bhopal gas tragedy** (December 1984), the **2001 Gujarat earthquake**, the 2004 tsunami and repeated floods in Kerala and Assam. Recommended early support is **psychological first aid**: ensure safety, meet basic needs, calm and connect people with loved ones and services, and listen without forcing them to talk. Early, compulsory debriefing of everyone is not recommended, because it can increase distress for some people.

:::clinician
Environmental psychology's distinctive methods include behaviour mapping, post-occupancy evaluation of buildings, environmental simulation and experience sampling across settings. Crowding theories include stimulus overload (Milgram), behavioural constraint, loss of control and density-intensity models; perceived control is the most robust moderator. Restoration research has moved from self-report to physiological markers (cortisol, heart-rate variability) and attention tasks; effects are reliable but modest and sensitive to expectations and the comparison condition. Climate psychology distinguishes adaptive concern from impairing distress; scales such as the Climate Change Anxiety Scale separate cognitive-emotional impairment from functional impairment. In India, extreme heat is a growing public mental health issue, with evidence linking heatwaves to increases in hospital visits for mental disorders; heat action plans, pioneered in Ahmedabad from 2013, now include advice for vulnerable groups. After disasters, the WHO and inter-agency guidelines favour layered psychosocial support: basic services and security, community and family support, focused non-specialised support and specialised services for the few who need them.
:::

:::recall
1. What is a behaviour setting? || A place and time with a standing pattern of behaviour that predicts what people do there (Barker).
2. Distinguish density from crowding. || Density: people per space. Crowding: the unpleasant feeling of too many people.
3. Name Hall's four zones. || Intimate, personal, social, public.
4. Name Altman's three kinds of territory. || Primary, secondary, public.
5. What did Ulrich's hospital-window study show? || Patients with a view of trees recovered faster and needed fewer strong painkillers.
6. Name the four qualities of restorative environments. || Being away, extent, soft fascination, compatibility.
:::

:::mcq
Q: In Glass and Singer's noise studies, after-effects of noise were smaller when people:
- Heard louder noise
- Were told nothing about the noise
- *Believed they could control the noise
- Worked in groups
> Perceived control reduced the harmful after-effects.

Q: Telling hotel guests that most previous guests reused towels is an example of using:
- *A descriptive norm
- An injunctive norm
- Cognitive dissonance
- A fear appeal
> Descriptive norms describe what most people do.
:::


:::widget layers
{
  "title": "Layered psychosocial support after a disaster",
  "shape": "pyramid",
  "layers": [
    { "label": "Specialised services", "detail": "Psychiatric and psychological treatment for the few with severe or lasting problems." },
    { "label": "Focused non-specialised support", "detail": "Trained health and community workers help individuals and families: psychological first aid, basic counselling." },
    { "label": "Community and family supports", "detail": "Reuniting families, community groups, schools reopening, rituals of mourning." },
    { "label": "Basic services and security", "detail": "Safety, food, water, shelter, health care, delivered with dignity." }
  ],
  "caption": "Most people need the wide base; only a few need the narrow top. Start at the bottom."
}
:::

## 3.2 Forensic psychology [core][advanced]
**Forensic psychology** applies psychology to the **legal system**: investigation, courts, prisons and victims. The word "forensic" comes from the Latin forum, where Roman trials were held.

### Eyewitness memory
Memory is **reconstructive**, not a recording.
- **Elizabeth Loftus and John Palmer** showed students a film of a car crash, then asked how fast the cars were going when they "**smashed**" into or "**hit**" each other. The word "smashed" produced higher speed estimates, and days later those students were more likely to "remember" broken glass that was never in the film. This is the **misinformation effect**.
- Other factors that lower accuracy: **weapon focus** (attention goes to the weapon, not the face), high stress, brief exposure, long delays, and **own-race bias** (people recognise faces of their own group better).
- **Lineups**: errors fall when lineups are run **double-blind** (the officer does not know who the suspect is), when witnesses are told the culprit **may not be present**, when fillers match the description, and when the witness's **initial confidence** is recorded at once (initial confidence is informative; later confidence inflates).


:::widget flow
{
  "title": "How an eyewitness memory can change",
  "layout": "chain",
  "nodes": [
    { "id": "enc", "label": "Encoding", "detail": "A brief, stressful view; attention goes to the weapon, not the face." },
    { "id": "sto", "label": "Storage", "detail": "Days pass; the memory fades and is open to change." },
    { "id": "mis", "label": "Post-event information", "detail": "A leading question, a news report or a co-witness adds false details." },
    { "id": "ret", "label": "Retrieval", "detail": "The witness reconstructs the event, blending the original with the added detail." },
    { "id": "conf", "label": "Confidence grows", "detail": "Feedback (“good, you picked the suspect”) inflates confidence, which juries trust." }
  ],
  "caption": "Safeguards target each link: record initial confidence, use double-blind lineups and avoid leading questions."
}
:::

### Interviewing and confessions
- The **cognitive interview** (Fisher and Geiselman) improves recall with **context reinstatement**, **report everything**, **changing the order** of recall and **changing perspective**, without increasing errors much.
- **False confessions** happen. Saul Kassin described three types: **voluntary** (offered freely, often for attention or to protect someone), **compliant** (to escape pressure, knowing one is innocent) and **internalised** (the suspect comes to believe they did it). Long, isolating, accusatory interrogations, presenting false evidence, and vulnerable suspects (young, intellectually disabled, highly suggestible) raise the risk. **Gisli Gudjonsson** developed suggestibility scales to measure how easily people yield to leading questions.
- The **Reid technique** (accusatory, confrontational) has been criticised for producing false confessions. The UK's **PEACE model** (Preparation and planning, Engage and explain, Account, Closure, Evaluate) is an information-gathering approach now used in many countries.

:::widget compare
{"title": "Two ways to question a suspect", "a": {"label": "Accusatory (Reid)", "points": ["Assumes guilt from the start", "Confronts and rejects denials", "Offers excuses to make confessing easier", "Goal: a confession"], "summary": "Raises the risk of false confessions, especially in young, tired or vulnerable suspects."}, "b": {"label": "Information-gathering (PEACE)", "points": ["Preparation and planning", "Engage and explain", "Account, then challenge inconsistencies", "Closure, then evaluate"], "summary": "Goal: accurate information. Fewer false confessions, and no loss of true ones."}}
:::

:::widget sort
{"prompt": "Which of Kassin's three types of false confession is each?", "buckets": ["Voluntary", "Compliant", "Internalised"], "items": [{"text": "After a famous murder, a man walks into a police station and confesses to get on television", "bucket": 0, "why": "Offered freely, without pressure."}, {"text": "After 20 hours of questioning, a 17-year-old signs a confession so he can go home, knowing he is innocent", "bucket": 1, "why": "Confessing to escape pressure."}, {"text": "Told falsely that his fingerprints were found, an exhausted suspect comes to believe he did it during a blackout", "bucket": 2, "why": "He now believes his own false confession."}, {"text": "A father confesses to a hit-and-run to protect his son", "bucket": 0, "why": "Voluntary, to protect someone else."}]}
:::

### Detecting deception
- People, including police officers, detect lies only a little better than chance.
- The **polygraph** measures heart rate, blood pressure, breathing and skin conductance. It detects **arousal**, not lies: anxious truth-tellers can fail and practised liars can pass. The **concealed information test** (does the person react to crime details only the culprit would know?) has better scientific support than the common control-question test.
- In India, investigators have used **narco-analysis** (questioning under a sedative), **polygraph** and **brain electrical activation profiling** (including the **BEOS** test, developed in India). In **Selvi versus State of Karnataka (2010)**, the **Supreme Court** held that administering these tests **without consent** violates the right against self-incrimination (Article 20(3)) and personal liberty (Article 21). Voluntary tests are allowed with safeguards, but their results cannot by themselves be used as evidence; information later discovered because of a voluntary test may be admissible.

:::widget decide
{
  "scene": "A police officer in a district in Uttar Pradesh asks you, a forensic psychology trainee, to “just run a brain-mapping test” on a frightened 17-year-old suspect who has not agreed to it.",
  "ask": "What should you do?",
  "choices": [
    { "label": "Run it: the officer has authority and it may solve the case", "verdict": "harm", "outcome": "The test is later ruled unlawful and the case collapses; the boy is harmed.", "why": "The Supreme Court held involuntary tests unconstitutional, and the boy is a child under the JJ Act with added protections." },
    { "label": "Decline; explain the Selvi judgment and the need for informed, voluntary consent with legal safeguards, and suggest proper procedures under the Juvenile Justice Act", "verdict": "best", "outcome": "The officer follows lawful procedures and the evidence holds up.", "why": "This respects the law, the boy's rights and the limits of the technique." },
    { "label": "Run the test but keep the results unofficial", "verdict": "ok", "outcome": "You have still conducted an unlawful test on a child.", "why": "Keeping it unofficial does not make it consensual or lawful." }
  ]
}
:::

### Mental state and criminal responsibility
- **The M'Naghten rules** (England, 1843) are the basis of the legal insanity test in India. Under the **Bharatiya Nyaya Sanhita 2023, section 22** (formerly IPC section 84, from 1 July 2024), nothing is an offence if, at the time of the act, because of **unsoundness of mind**, the person was **incapable of knowing the nature of the act** or that it was **wrong or contrary to law**.
- Courts distinguish **legal insanity** (this narrow test) from **medical insanity** (having a mental illness). Many people with serious mental illness do not meet the legal test.
- **Fitness (competence) to stand trial** is a separate question about the **present**: can the accused understand the proceedings and help in their defence?
- Psychologists contribute through careful assessment, history, collateral information and testing, but the **court decides** the legal question.

:::widget compare
{"title": "Two separate legal questions", "a": {"label": "Criminal responsibility", "points": ["About the time of the offence", "Could the person know the nature of the act, or that it was wrong or against the law, because of unsoundness of mind?", "Based on the M'Naghten rules, now BNS section 22", "A narrow legal test, not a diagnosis"], "summary": "Legal insanity looks backwards to the moment of the act."}, "b": {"label": "Fitness to stand trial", "points": ["About the present", "Can the person understand the charges and the proceedings?", "Can they instruct a lawyer and take part in their defence?", "Can change with treatment"], "summary": "Fitness looks at now. A person may be unfit today and later fit, and the court, not the psychologist, decides both questions."}}
:::

### Risk assessment
Three approaches to predicting violence or reoffending:
| Approach | How it works | Example |
|---|---|---|
| **Unstructured clinical judgement** | The clinician's overall impression | Often unreliable |
| **Actuarial** | A statistical formula from fixed risk factors | Static-99 (sexual reoffending), VRAG |
| **Structured professional judgement (SPJ)** | The clinician rates set factors, then makes a reasoned judgement | **HCR-20**: Historical, Clinical and Risk management items |

**Robert Hare's Psychopathy Checklist (PCL-R)**, a 20-item interview-based tool, measures **interpersonal-affective** traits (glibness, lack of remorse, shallow affect) and **lifestyle-antisocial** traits (impulsivity, early behaviour problems). High scores predict reoffending in many samples.

### Juveniles, victims and prisons
- **The Juvenile Justice (Care and Protection of Children) Act 2015** allows a child aged **16 to 18** accused of a **heinous offence** to be tried as an adult only after a **preliminary assessment** by the Juvenile Justice Board of the child's mental and physical capacity, ability to understand the consequences and the circumstances of the offence, with the help of experienced psychologists or other experts.
- **POCSO 2012** requires child-friendly procedures for child victims of sexual offences: statements at the child's home or a place of their choice, a support person, no repeated questioning, and in-camera trials.
- **Correctional psychology**: the **risk-need-responsivity (RNR)** model says intensity of rehabilitation should match **risk**, target **criminogenic needs** (antisocial attitudes, associates, substance use) and fit the person's learning style (**responsivity**). In India, prison programmes include education, vocational training and meditation courses such as Vipassana in Tihar.

:::widget sort
{
  "prompt": "Which forensic concept fits each case?",
  "buckets": ["Misinformation effect", "Compliant false confession", "Legal insanity question", "Fitness to stand trial"],
  "items": [
    { "text": "A witness “remembers” a knife after police kept asking about the knife", "bucket": 0 },
    { "text": "After 20 hours of questioning, a man confesses so he can go home, knowing he is innocent", "bucket": 1 },
    { "text": "Did the accused, at the time of the act, know it was wrong?", "bucket": 2 },
    { "text": "Can the accused, now, understand the charges and instruct a lawyer?", "bucket": 3 },
    { "text": "A woman recalls a red car after reading a news report that mentioned one", "bucket": 0 },
    { "text": "A man with untreated psychosis cannot follow what the court is saying today", "bucket": 3 }
  ]
}
:::

:::clinician
Key distinctions for PG and forensic placements: the evaluator's client is often the referring court or agency, so the duty of care and confidentiality differ from therapy (warn the person at the outset about the limits of confidentiality and the purpose of the assessment); avoid dual roles (treating clinician and expert evaluator). Indian practice: psychiatric and psychological evaluations are commonly requested under the criminal procedure provisions for accused persons of unsound mind (now in the Bharatiya Nagarik Suraksha Sanhita 2023) and under the Mental Healthcare Act 2017 for prisoners with mental illness; NIMHANS and other institutes run forensic psychiatry units. Psychological testing in forensic work needs validity checks for malingering (symptom validity tests, the Structured Interview of Reported Symptoms, performance validity indicators). On risk tools: actuarial and SPJ approaches outperform unstructured judgement, but their positive predictive value is modest for rare outcomes, and tools validated in Western samples need local validation. Eyewitness science has influenced lineup reforms worldwide; the best-supported procedural safeguards are double-blind administration, unbiased instructions, fair fillers and immediate confidence recording.
:::

:::recall
1. What did the "smashed" versus "hit" study show? || Leading words altered speed estimates and led to false memories of broken glass: the misinformation effect.
2. Name the four techniques of the cognitive interview. || Context reinstatement, report everything, change the order, change perspective.
3. Name Kassin's three types of false confession. || Voluntary, compliant, internalised.
4. What did the Supreme Court decide in Selvi v. State of Karnataka (2010)? || Involuntary narco-analysis, polygraph and brain-mapping tests violate Articles 20(3) and 21.
5. What is India's current insanity provision? || Bharatiya Nyaya Sanhita 2023, section 22 (formerly IPC section 84).
6. What does HCR stand for in the HCR-20? || Historical, Clinical, Risk management.
:::

:::mcq
Q: The legal insanity test in India asks mainly about the accused's:
- Diagnosis at the time of trial
- IQ score
- Remorse after the act
- *Capacity, at the time of the act, to know its nature or that it was wrong or contrary to law
> Based on the M'Naghten rules, now BNS section 22.

Q: A polygraph mainly measures:
- Truthfulness directly
- *Physiological arousal
- Brain waves
- Memory accuracy
> Arousal can come from fear, not only lying.
:::

## 3.3 Sports and performance psychology [core][advanced]
**Sports psychology** studies the psychological factors that affect performance, participation and wellbeing in sport and exercise, and helps athletes, coaches and teams. Its methods apply equally to music, surgery, the military and exams.

### Beginnings
In 1898 **Norman Triplett** noticed that cyclists rode faster when racing against others than against the clock, and found that children wound fishing reels faster in pairs: an early study of **social facilitation**. **Coleman Griffith** set up the first sports psychology laboratory at the University of Illinois in the 1920s.

### Arousal, anxiety and performance
| Model | Main claim |
|---|---|
| **Drive theory** | More arousal means more of the dominant response: good for experts, bad for novices |
| **Inverted-U** | Moderate arousal is best (Yerkes-Dodson) |
| **Individual zones of optimal functioning (IZOF)** (Yuri Hanin) | Each athlete has their own best zone, which may be high or low |
| **Multidimensional anxiety theory** | **Cognitive anxiety** (worry) harms performance steadily; **somatic anxiety** (bodily arousal) follows an inverted U; **self-confidence** helps. Measured with the CSAI-2 |
| **Catastrophe model** (Lew Hardy) | When cognitive anxiety is high, rising arousal can cause a sudden, large **collapse** in performance rather than a gentle decline; recovery needs a big drop in arousal |
| **Reversal theory** | The same arousal can be felt as excitement or as anxiety, and people can switch between them |

:::widget compare
{"title": "Inverted-U or catastrophe?", "a": {"label": "Inverted-U", "points": ["Performance rises with arousal up to a point", "Past the peak, it declines gradually", "Lowering arousal a little restores performance", "Ignores worry"], "summary": "A smooth curve: too little and too much arousal both hurt."}, "b": {"label": "Catastrophe model", "points": ["With low worry, arousal acts like an inverted U", "With high worry, past the peak performance collapses suddenly", "Recovery needs a big drop in arousal, not a small one", "Worry and arousal interact"], "summary": "Hardy's model explains the sudden collapse of a batsman or a shooter under pressure."}}
:::

:::widget figure
{"id": "yerkes-dodson", "quiz": true}
:::

### Choking under pressure
**Choking** is a drop in performance under pressure despite skill and motivation. Two explanations:
- **Explicit monitoring (self-focus)**: under pressure, experts start paying conscious attention to automatic skills ("how exactly do I swing?"), which breaks them down. This is also called **reinvestment**.
- **Distraction**: worry uses up working memory needed for the task, which hurts thinking-heavy tasks most.

Remedies include pre-performance routines, an external focus of attention (on the target, not the body), practising under pressure, and reappraising arousal as excitement.


:::widget curve
{
  "kind": "inverted-u",
  "title": "Arousal and performance in sport",
  "caption": "A shooter or archer (complex, fine motor task) peaks at lower arousal than a weightlifter (simple, strength task)."
}
:::

:::widget flow
{
  "title": "How choking happens",
  "layout": "chain",
  "nodes": [
    { "id": "pr", "label": "Pressure", "detail": "A final, a selector watching, a big crowd." },
    { "id": "sf", "label": "Self-focus", "detail": "Attention turns inward: “I must not mess this up.”" },
    { "id": "em", "label": "Explicit monitoring", "detail": "The athlete consciously controls a skill that is normally automatic." },
    { "id": "bd", "label": "Skill breaks down", "detail": "Timing and fluency are lost, and errors increase." },
    { "id": "fix", "label": "Remedies", "detail": "Pre-performance routines, an external focus, practising under pressure, reappraising arousal as excitement." }
  ],
  "caption": "For thinking-heavy tasks, worry can instead use up working memory: the distraction route."
}
:::

### Mental skills
- **Goal setting**: **outcome** goals (win the match), **performance** goals (first-serve percentage) and **process** goals (keep the elbow high). Performance and process goals are more controllable.
- **Imagery**: rehearsing skills in the mind. The **PETTLEP** model says imagery works best when it matches the real thing in **P**hysical position, **E**nvironment, **T**ask, **T**iming, **L**earning stage, **E**motion and **P**erspective.
- **Self-talk**: **instructional** ("eyes on the ball") helps precision tasks; **motivational** ("come on, you can do this") helps strength and endurance.
- **Attention**: Robert Nideffer's model crosses **broad versus narrow** with **internal versus external** focus: a captain reading the field needs broad-external; a shooter needs narrow-external; planning a strategy needs broad-internal.
- **The "quiet eye"**: elite performers hold a longer, steady final gaze on the target before acting.

:::widget sort
{
  "prompt": "Which of Nideffer's attention styles does each moment need?",
  "buckets": ["Broad-external", "Narrow-external", "Broad-internal", "Narrow-internal"],
  "items": [
    { "text": "A football midfielder scanning for open teammates", "bucket": 0 },
    { "text": "An archer focusing on the centre of the target", "bucket": 1 },
    { "text": "A coach planning a strategy at half-time", "bucket": 2 },
    { "text": "A weightlifter mentally rehearsing one cue before the lift", "bucket": 3 },
    { "text": "A batter watching the bowler's wrist at release", "bucket": 1 },
    { "text": "A hockey captain reading the opposition's formation", "bucket": 0 }
  ]
}
:::

### Teams, motivation and wellbeing
- **Cohesion** (Albert Carron): **task cohesion** (united in pursuing goals) predicts performance more than **social cohesion** (liking each other).
- **Achievement goal theory**: athletes with a **task (mastery) orientation** define success as improving; those with an **ego orientation** define it as beating others. A **mastery climate** created by coaches is linked with more enjoyment, effort and less dropout.
- **Athlete mental health**: elite athletes face depression, anxiety, eating disorders, burnout and identity crises at retirement. High-profile athletes speaking openly in recent years (for example withdrawing from major events for mental health) have reduced stigma.
- **Exercise psychology**: regular exercise reduces depressive and anxiety symptoms and is recommended as part of treatment.

:::example Mental conditioning in Indian sport
The South African coach **Paddy Upton** worked as mental conditioning coach with the Indian cricket team that won the 2011 World Cup, with the Indian men's hockey team that won bronze at the 2024 Paris Olympics, and with **D. Gukesh**, who became world chess champion in December 2024. India's **Target Olympic Podium Scheme (TOPS**, from 2014) funds support teams, including sports psychologists, for elite athletes. Sports psychology in India has moved from rare to routine at the top level, though most school and club athletes still have no access to it.
:::

:::widget decide
{
  "scene": "A 16-year-old badminton player in Hyderabad wins easily in practice but loses in tournaments. She says that in close games she starts thinking about exactly how her wrist moves, and her shots fall apart.",
  "ask": "What is the best first intervention?",
  "choices": [
    { "label": "Tell her to concentrate harder on her technique during matches", "verdict": "harm", "outcome": "Her play gets worse in the next tournament.", "why": "More conscious attention to an automatic skill is exactly what causes explicit-monitoring choking." },
    { "label": "Build a short pre-serve routine with an external focus (the shuttle, the target zone) and practise under simulated pressure", "verdict": "best", "outcome": "Over the season, her tournament results move closer to her practice level.", "why": "Routines and external focus prevent reinvestment; pressure practice builds familiarity." },
    { "label": "Tell her to stop caring about results", "verdict": "ok", "outcome": "She tries, but still cares, and still chokes.", "why": "Caring is not the problem; where her attention goes is." }
  ]
}
:::

:::clinician
Meta-analyses support imagery, self-talk (moderate effects, larger for fine motor tasks and when matched to task demands), goal setting and pre-performance routines. The catastrophe model is supported in its key prediction of hysteresis (performance drops abruptly at high cognitive anxiety and recovers along a different path), although full tests of the cusp model are rare. Choking research distinguishes skill-focus (explicit monitoring; motor skills) from distraction (working memory; cognitive tasks); analogy learning and implicit learning methods reduce reinvestment. The International Olympic Committee's consensus on mental health in elite athletes recommends screening, early intervention and integration of mental health into athlete support. In India, the absence of a licensing route for sports psychologists means quality varies; practitioners should hold relevant postgraduate training, use evidence-based methods and refer clinical problems to RCI-registered clinical psychologists or psychiatrists.
:::

:::recall
1. What did Triplett observe? || Cyclists rode faster against others and children reeled faster in pairs: social facilitation.
2. What does IZOF propose? || Each athlete has an individual zone of optimal anxiety, which may be high or low.
3. What does the catastrophe model predict? || With high cognitive anxiety, rising arousal causes a sudden collapse in performance.
4. Name the two main explanations of choking. || Explicit monitoring (self-focus) and distraction.
5. What does PETTLEP stand for? || Physical, environment, task, timing, learning, emotion, perspective.
6. Which type of cohesion best predicts team performance? || Task cohesion.
:::

:::mcq
Q: In multidimensional anxiety theory, which component is expected to have a negative straight-line relation with performance?
- Somatic anxiety
- Self-confidence
- *Cognitive anxiety
- Arousal
> Worry harms performance steadily; somatic anxiety follows an inverted U.

Q: A coach who praises effort and improvement rather than ranking players creates:
- *A mastery climate
- An ego climate
- Social facilitation
- Reversal
> Mastery climates focus on learning and improvement.
:::

## 3.4 Cyberpsychology: online behaviour and digital childhood [core][advanced]
**Cyberpsychology** studies how people think, feel and behave with digital technology: the internet, smartphones, social media, games and AI. Postgraduate syllabi list **digital learning, online behaviour and parental mediation of digital use**.

### The online disinhibition effect
**John Suler** described why people say and do things online they would not do face to face. Factors include:
- **Dissociative anonymity**: "you don't know me".
- **Invisibility**: no one sees your face or reactions.
- **Asynchronicity**: you don't see responses in real time.
- **Solipsistic introjection**: you imagine the other person's voice in your head.
- **Dissociative imagination**: "it's just a game".
- **Minimised authority**: status cues disappear.

:::widget sort
{"prompt": "Which of Suler's disinhibition factors is most at work?", "buckets": ["Dissociative anonymity", "Invisibility", "Asynchronicity", "Dissociative imagination", "Minimised authority"], "items": [{"text": "'Nobody knows this account is mine, so I can say anything.'", "bucket": 0}, {"text": "'I can't see her face when she reads it, so it doesn't feel cruel.'", "bucket": 1}, {"text": "'I'll post it and log off. I won't see the replies until tomorrow.'", "bucket": 2}, {"text": "'It's just the game world. It isn't real.'", "bucket": 3}, {"text": "'Online, a professor's comment counts no more than mine.'", "bucket": 4}]}
:::

It can be **benign** (opening up about a problem, seeking help) or **toxic** (trolling, harassment, hate speech).

### Self, comparison and social media
- People curate **idealised self-presentations**, and others compare themselves upwards, which can lower mood and body image, especially on image-based platforms.
- **Fear of missing out (FOMO)**: worry that others are having rewarding experiences without you, linked with compulsive checking.
- **Social media and adolescent mental health**: this is one of the most debated questions in psychology today. One side argues that the spread of smartphones and social media from around 2012 drove rising adolescent anxiety, depression and self-harm, especially in girls. The other side points out that large datasets show **small average associations** between screen time and wellbeing, that causation is unclear, and that **what** young people do online matters more than **how long**. Most researchers agree that heavy use, night-time use that disrupts sleep, cyberbullying and exposure to harmful content are real risks.

### Problematic use and gaming
- **Internet gaming disorder** is listed in DSM-5-TR as a **condition for further study** (Section III), with nine proposed criteria.
- **ICD-11** includes **gaming disorder** as a diagnosis: **impaired control** over gaming, **increasing priority** given to gaming over other interests and activities, and **continuation despite harm**, usually for at least 12 months, with significant impairment.
- Most heavy gamers do **not** have a disorder; the key is loss of control and harm.
- In India, the **Promotion and Regulation of Online Gaming Act 2025** banned real-money online games and their advertising; rules under the Act took effect on **1 May 2026** and set up an online gaming authority. Esports and social games are promoted separately.


:::widget flow
{
  "title": "The checking loop",
  "layout": "cycle",
  "nodes": [
    { "id": "f", "label": "FOMO or boredom", "detail": "A worry that others are doing something rewarding." },
    { "id": "c", "label": "Check the phone", "detail": "Open the app, scroll, refresh." },
    { "id": "r", "label": "Unpredictable reward", "detail": "Sometimes a like or a message, sometimes nothing: a variable-ratio schedule." },
    { "id": "b", "label": "Brief relief, then comparison", "detail": "Upward comparison can lower mood and raise FOMO again." }
  ],
  "caption": "Breaking the loop: notifications off, phone-free times and places, and active rather than passive use."
}
:::

### Cyberbullying and online harms
Cyberbullying differs from offline bullying: it can happen **anywhere, any time**, reach a **large audience**, be **anonymous** and stay **permanent**. Victims show higher depression and anxiety. Other harms include **sextortion**, non-consensual sharing of images, **deepfakes**, scams targeting older adults, and radicalisation. India's cyber crime reporting portal and helpline 1930 handle complaints.

### Digital learning
- **Cognitive load theory** (John Sweller): working memory is limited, so instruction should reduce **extraneous load** (distracting design), manage **intrinsic load** (the material's own complexity) and support **germane load** (building understanding).
- **Richard Mayer's multimedia principles**: people learn better from words plus pictures than words alone (**multimedia**), when extra material is cut (**coherence**), when key points are highlighted (**signalling**), when words and related pictures are near each other (**spatial contiguity**), when lessons are broken into learner-paced parts (**segmenting**) and when narration replaces on-screen text with graphics (**modality**).
- **India**: platforms such as DIKSHA (school content) and SWAYAM (university courses) expanded rapidly after 2020. Access gaps remain: surveys of rural youth find most households have a smartphone, but girls and poorer families are less likely to have their own device or use it for learning.

### Parental mediation
Parents shape children's digital lives through different strategies:
| Strategy | What parents do | Effect |
|---|---|---|
| **Active (enabling) mediation** | Talk about content, explain, encourage safe and creative use | Builds digital skills and critical thinking; reduces risk without cutting opportunity |
| **Restrictive mediation** | Rules on time, apps, content | Reduces risk exposure but also reduces opportunities and skills; can push use into secret |
| **Co-use** | Use media together | Builds connection; effect depends on what is done together |
| **Technical mediation** | Filters, parental controls, apps | Useful for young children; easily bypassed by teens |
| **Monitoring** | Checking history, messages | Can erode trust if done secretly |

Research generally finds that **active, enabling mediation** combined with **some age-appropriate rules** works best, adjusted as children grow.

:::widget decide
{
  "scene": "A mother in Kochi finds her 13-year-old son has been gaming until 3 am. She wants to take away his phone completely and install monitoring software he won't know about.",
  "ask": "What would you advise, based on parental mediation research?",
  "choices": [
    { "label": "Take the phone away permanently and monitor everything secretly", "verdict": "harm", "outcome": "He borrows a friend's phone, gaming moves out of sight and trust breaks down.", "why": "Purely restrictive and covert control often backfires with teenagers." },
    { "label": "Talk with him about what he enjoys, agree clear rules together (no devices in the bedroom after a set time, gaming after homework), use simple parental controls openly, and watch for signs of loss of control or harm", "verdict": "best", "outcome": "Sleep improves; he still games, within agreed limits.", "why": "Active mediation plus open, age-appropriate rules protects sleep and trust, and allows assessment for gaming disorder if harm continues." },
    { "label": "Do nothing; all teenagers game", "verdict": "ok", "outcome": "His sleep and schoolwork keep slipping.", "why": "Night-time gaming that disrupts sleep needs a response even if it is not a disorder." }
  ]
}
:::

:::example Laws on children and social media
Countries are trying different approaches. Australia's minimum age of 16 for many social media accounts took effect in **December 2025**. India's **Digital Personal Data Protection Act 2023**, with rules notified in **November 2025** and coming into force in phases, requires **verifiable parental consent** before platforms process the personal data of anyone **under 18** and bars targeted advertising and tracking of children. Psychologists are asked to advise on what such laws can and cannot achieve, as at November 2026.
:::

:::clinician
The screen-time debate turns on effect sizes and causal inference: specification-curve analyses of large adolescent datasets found average associations between digital technology use and wellbeing comparable to wearing glasses or eating potatoes, while proponents of a causal effect point to timing, dose-response in heavy users, girls' social media use, and natural experiments such as the arrival of high-speed internet. Experimental reductions of social media use in adults show small improvements in wellbeing on average, with heterogeneity. For assessment, distinguish passive from active use, content and context, displacement of sleep and exercise, and cyberbullying. Gaming disorder prevalence estimates vary widely with criteria; ICD-11 requires functional impairment, which lowers prevalence relative to symptom-count approaches. Treatment evidence for gaming disorder is limited but supports CBT approaches and family involvement for adolescents. The NIMHANS Service for Healthy Use of Technology (SHUT clinic) is an Indian specialist service. Telepsychology ethics (consent, privacy, crisis plans, jurisdiction, documentation) follow the same core principles as in-person care, with added attention to platform security.
:::

:::recall
1. Name four factors in the online disinhibition effect. || Any four: dissociative anonymity, invisibility, asynchronicity, solipsistic introjection, dissociative imagination, minimised authority.
2. What are ICD-11's core features of gaming disorder? || Impaired control, increasing priority over other activities, continuation despite harm, with significant impairment, usually for at least 12 months.
3. Name three of Mayer's multimedia principles. || Any three: multimedia, coherence, signalling, spatial contiguity, segmenting, modality.
4. What are the three types of load in cognitive load theory? || Intrinsic, extraneous, germane.
5. Which form of parental mediation tends to build skills and reduce risk together? || Active (enabling) mediation.
:::

:::mcq
Q: A student shares her depression on an anonymous online forum though she has told no one offline. This is an example of:
- Toxic disinhibition
- Cyberbullying
- Gaming disorder
- *Benign disinhibition
> Disinhibition that leads to help-seeking is benign.

Q: In DSM-5-TR, internet gaming disorder is:
- A full diagnosis in the substance chapter
- *A condition for further study in Section III
- Not mentioned at all
- Classified as a personality disorder
> ICD-11 includes gaming disorder as a diagnosis; DSM-5-TR lists it for further study.
:::

## 3.5 AI in psychology: tools, evidence and limits [core][advanced]
Artificial intelligence (AI) is changing how psychology is practised, researched and taught. This section gives the honest status **as at November 2026**. Check for newer developments before quoting dates.

### What AI is being used for
| Use | Example | Honest status |
|---|---|---|
| **Prediction from records** | Machine-learning models predicting suicide attempts or hospital readmission from health records | Better than chance and often better than clinicians' unaided guesses, but most people flagged do not go on to the outcome; useful for prioritising, not diagnosing |
| **Language and speech analysis** | Detecting disorganised speech that predicts later psychosis; depression markers in voice | Promising research; not yet a routine clinical test |
| **Digital phenotyping** | Smartphone data on sleep, movement and phone use to track mood | Research and pilot stage |
| **Rule-based chatbots** | Scripted CBT-style apps | Small to moderate short-term benefits in trials; one of the best-known apps closed its consumer service in 2025 |
| **Generative AI chatbots** | Large language models (LLMs) offering conversation and support | The first randomised trial of a purpose-built generative AI therapy chatbot (in the United States, published in 2025) found reduced depression and anxiety symptoms over about two months, with clinicians reviewing messages for safety. General-purpose chatbots are widely used for emotional support without such safeguards |
| **Support for clinicians** | Drafting notes, simulated patients for training, summarising research | Growing fast; needs human checking |
| **Testing and research** | Computerised adaptive testing; generating and screening test items; coding qualitative data | Useful with validation |

An Indian-founded company, **Wysa** (Bengaluru), offers an AI-guided support app used by health services and employers in several countries and received a US breakthrough-device designation for one use, though that designation is not an approval.

### The risks
- **Wrong or invented information** ("hallucination") delivered confidently.
- **Sycophancy**: telling users what they want to hear, including agreeing with distorted or harmful beliefs.
- **Crisis failures**: missing or mishandling signs of risk.
- **Dependence and isolation**: replacing human relationships rather than supporting them, especially for lonely young people.
- **Privacy**: sensitive conversations stored and used for training or advertising.
- **Bias**: models trained mainly on Western, English data may misread other languages, idioms of distress and cultures.
- **Accountability**: who is responsible when a chatbot gives harmful advice?

### Regulation, as at November 2026
- **United States**: the FDA's Digital Health Advisory Committee met in November 2025 to discuss generative AI mental health devices; by mid-2026 none of the many AI-enabled devices the FDA had authorised was cleared to deliver therapy for a mental disorder. Several states have acted: **Illinois** (August 2025) and others banned AI from providing therapy without a licensed professional; **California**'s law on companion chatbots, requiring disclosure and protections for minors, took effect on 1 January 2026; **Tennessee** banned AI systems from presenting themselves as qualified mental health professionals from 1 July 2026.
- **European Union**: the AI Act prohibits AI emotion-recognition systems in workplaces and schools (except for medical or safety reasons) from February 2025, with other rules phasing in.
- **India**: there is no AI-specific mental health law. Relevant rules include the **Digital Personal Data Protection Act 2023** (health and children's data), ICMR's ethical guidelines on AI in health research and care (2023), the **Mental Healthcare Act 2017** (confidentiality and rights) and professional codes. Tele-MANAS remains human-staffed.

:::widget sort
{
  "prompt": "Responsible or risky use of AI by a psychology trainee?",
  "buckets": ["Responsible", "Risky"],
  "items": [
    { "text": "Practising an intake interview with an AI-simulated patient, then reviewing it with a supervisor", "bucket": 0 },
    { "text": "Pasting a client's full name and trauma history into a free public chatbot to get a formulation", "bucket": 1 },
    { "text": "Using AI to draft a plain-language handout on sleep hygiene, then checking every line", "bucket": 0 },
    { "text": "Telling a distressed client to talk to a chatbot instead of attending sessions", "bucket": 1 },
    { "text": "Asking AI to suggest search terms for a literature review, then reading the actual studies", "bucket": 0 },
    { "text": "Copying an AI-written test interpretation into a report without checking norms", "bucket": 1 }
  ]
}
:::


:::widget flow
{
  "title": "Should this AI tool be used with clients?",
  "layout": "tree",
  "nodes": [
    { "id": "q", "label": "Proposed AI tool", "detail": "A chatbot, a prediction model or an assessment aid." },
    { "id": "e", "label": "Is there evidence for this use, in people like mine?", "parent": "q", "detail": "Look for trials with active controls, clinical samples and independent evaluation, including Indian languages." },
    { "id": "s", "label": "Is it safe?", "parent": "q", "detail": "Crisis pathways to humans, testing for harmful or sycophantic replies, monitoring after launch." },
    { "id": "p", "label": "Is data protected?", "parent": "q", "detail": "Consent, the DPDP Act, no identifiable data in public tools, clear data storage." },
    { "id": "o", "label": "Is a qualified human responsible?", "parent": "q", "detail": "Oversight of every clinical decision, clear accountability." },
    { "id": "no", "label": "Any answer is no", "parent": "s", "detail": "Do not use it with clients; at most, pilot it with safeguards and evaluation." }
  ],
  "caption": "A simple screen before any AI tool reaches a client."
}
:::

### Principles for psychologists using AI
1. **Competence**: understand what the tool does and its limits.
2. **Consent and transparency**: tell clients when AI is used in their care.
3. **Confidentiality**: never enter identifiable client information into tools without approved data protection.
4. **Human oversight**: a qualified person checks and takes responsibility for every clinical decision.
5. **Bias and fairness**: check whether the tool works for the people you serve (languages, ages, cultures).
6. **Safety**: tools used with clients need clear crisis pathways to human help.

:::widget decide
{
  "scene": "A college counselling centre in Ahmedabad, with one counsellor for 4,000 students, wants to launch a generative AI chatbot as the “first point of contact” for all students in distress.",
  "ask": "What is the most responsible advice?",
  "choices": [
    { "label": "Launch it as the only option to cut waiting lists", "verdict": "harm", "outcome": "A student in crisis gets a generic reply and no human follow-up.", "why": "Unsupervised AI as the sole route risks missed crises; evidence of safety without human oversight is lacking." },
    { "label": "If used at all, offer it only as an optional, clearly labelled self-help tool with privacy safeguards, clear routes to the counsellor and Tele-MANAS, human monitoring and evaluation, while arguing for more counsellors", "verdict": "best", "outcome": "Some students use it for skills practice; risk cases reach a human quickly.", "why": "This matches the current evidence: possible benefit as an adjunct with safeguards, not a replacement." },
    { "label": "Ban all mention of AI on campus", "verdict": "ok", "outcome": "Students use public chatbots anyway, without guidance.", "why": "Ignoring widespread use leaves students without safe guidance." }
  ]
}
:::

:::clinician
Methodological cautions when reading AI mental health studies: short follow-up, waitlist controls, self-report outcomes, highly selected volunteers, developer-run trials and undisclosed human supervision. Prediction models must report calibration, positive predictive value at the intended threshold, external validation and performance across subgroups; area-under-curve values around 0.8 can coexist with low positive predictive value for rare outcomes. Generative models raise specific risks for people with psychosis or mania (reinforcing delusional content), eating disorders (harmful advice) and adolescents (attachment to companion bots). Evaluation frameworks now proposed include red-teaming for crisis responses, measures of sycophancy and harmful advice, and post-deployment monitoring. For Indian deployment, language coverage (Hindi, Gujarati, Tamil and others), code-mixing and local idioms of distress are essential tests. Questions likely in viva and PhD interviews: Can a chatbot form a therapeutic alliance? (Users report alliance-like bonds, but whether this has the same mechanism and safety is unknown.) Who is liable for harm? How should RCI-registered psychologists document AI use?
:::

:::recall
1. Name four uses of AI in psychology. || Any four: prediction from records, speech and language analysis, digital phenotyping, chatbots, clinician support, testing and research.
2. Name four risks of generative AI chatbots in mental health. || Any four: hallucination, sycophancy, crisis failures, dependence, privacy, bias, unclear accountability.
3. As at mid-2026, had the FDA cleared any AI device to deliver therapy for a mental disorder? || No.
4. What does the EU AI Act prohibit regarding emotion recognition? || AI emotion recognition in workplaces and schools, except for medical or safety reasons.
5. Give the six principles for psychologists using AI. || Competence, consent and transparency, confidentiality, human oversight, bias and fairness, safety.
:::

:::mcq
Q: A suicide-risk prediction model has good overall accuracy but most people it flags never attempt suicide. This mainly reflects:
- *Low positive predictive value for a rare outcome
- Hallucination
- Sycophancy
- The online disinhibition effect
> Rare outcomes produce many false positives even with good models.

Q: The best current description of generative AI chatbots in mental health is:
- Proven replacements for therapy
- *Possibly helpful adjuncts in early trials, with real safety, privacy and oversight concerns
- Useless and always harmful
- Approved by the FDA for depression treatment
> Evidence is early and safeguards matter.
:::

## 3.6 Electives you will meet: school, counselling, rehabilitation, military and consumer psychology [core][advanced]
Many universities offer electives beyond the fields above. This section gives a working map of the most common ones.

### Educational and school psychology
- **Educational psychology** studies learning and teaching: motivation, assessment, instructional design, individual differences. It draws on learning theories (behavioural, cognitive, constructivist), Vygotsky's **zone of proximal development** and **scaffolding**, and research on effective study (retrieval practice, spacing).
- **School psychology** applies this to individual children: assessing **specific learning disabilities** (dyslexia, dyscalculia, dysgraphia), ADHD and emotional difficulties, advising teachers and parents, and running school-wide wellbeing and anti-bullying programmes.
- In India, the RPwD Act 2016 recognises specific learning disabilities, and school boards allow exam accommodations (extra time, a scribe, exemption from a third language) on certification. School counsellors are increasingly required by boards and state policies, though numbers remain low.

### Counselling psychology and guidance
- **Counselling psychology** helps people with normal developmental and adjustment problems: relationships, study, career, transitions, grief. It emphasises strengths, the relationship and prevention.
- **Career counselling**: **John Holland's RIASEC** model matches people and work environments as **Realistic, Investigative, Artistic, Social, Enterprising and Conventional**. **Donald Super's life-span, life-space theory** sees career as developing through stages (growth, exploration, establishment, maintenance, disengagement) and roles. In India, career choices are often family decisions, so counsellors work with parents too.

### Rehabilitation psychology
- Helps people with disability and chronic illness achieve the best possible function, participation and quality of life: after stroke, brain or spinal injury, amputation, or with intellectual and developmental disabilities.
- The **Rehabilitation Council of India** was created (1986 as a society, 1992 as a statutory body) to standardise training of rehabilitation professionals, which is why clinical psychologists in India register with it.
- **Community-based rehabilitation** brings services to villages through trained local workers and families.

### Military psychology
- Applies psychology to selection, training, leadership, morale, stress and mental health in the armed forces.
- In India, the **Defence Institute of Psychological Research (DIPR)**, a DRDO laboratory in Delhi, develops selection tests and research on stress, leadership and adaptation to extreme environments such as high altitude.
- **Services Selection Board (SSB)** officer selection is a five-day process combining: screening (an intelligence test and a **picture perception and discussion test**), **psychological tests** (**Thematic Apperception Test**, **Word Association Test**, **Situation Reaction Test** and a **self-description**), **group testing officer (GTO) tasks** (group discussion, group planning, progressive group task, command task, individual obstacles, lecturette) and a **personal interview**, followed by a conference where assessors decide together. It is a classic **assessment centre**: multiple methods and multiple assessors.

:::widget sort
{
  "prompt": "Match each elective to its typical task.",
  "buckets": ["School", "Counselling (career)", "Rehabilitation", "Military"],
  "items": [
    { "text": "Assessing a Class 4 child for dyslexia and recommending exam accommodations", "bucket": 0 },
    { "text": "Helping a Class 12 student whose RIASEC profile is Artistic-Social choose between design and teaching", "bucket": 1 },
    { "text": "Planning cognitive and vocational retraining after a road-accident head injury", "bucket": 2 },
    { "text": "Designing a Situation Reaction Test for officer selection", "bucket": 3 },
    { "text": "Running an anti-bullying programme across a school", "bucket": 0 },
    { "text": "Studying stress and sleep in soldiers posted at high altitude", "bucket": 3 }
  ]
}
:::


:::widget flow
{
  "title": "The SSB officer selection process",
  "layout": "chain",
  "nodes": [
    { "id": "d1", "label": "Screening", "detail": "Officer intelligence rating test and a picture perception and discussion test." },
    { "id": "psy", "label": "Psychological tests", "detail": "Thematic Apperception Test, Word Association Test, Situation Reaction Test, self-description." },
    { "id": "gto", "label": "Group testing officer tasks", "detail": "Group discussion, planning exercise, progressive group task, command task, obstacles, lecturette." },
    { "id": "int", "label": "Personal interview", "detail": "A long interview on background, choices and reasoning." },
    { "id": "conf", "label": "Conference", "detail": "Psychologist, GTO and interviewer decide together." }
  ],
  "caption": "A classic assessment centre: several methods, several assessors, one joint decision."
}
:::

### Consumer, media and other applied fields
- **Consumer psychology**: how people decide what to buy. Key ideas include the **elaboration likelihood model** of persuasion (the **central route** through strong arguments when people are motivated and able to think; the **peripheral route** through cues such as celebrity endorsement when they are not), brand attitudes, heuristics and nudges, and **neuromarketing** (brain and eye-tracking measures, with much hype).
- **Media psychology**: effects of news, entertainment and advertising, including the effects of media violence, portrayal of mental illness and responsible reporting.
- **Political psychology**: leadership, voting, polarisation and conflict.
- **Traffic and aviation psychology**: human error, fatigue, risk perception and the design of safer roads and cockpits. India has among the highest numbers of road deaths in the world, so traffic psychology matters.
- **Psychology of ageing**: memory, wellbeing and care in later life; successful ageing (Rowe and Kahn: low disease and disability, high cognitive and physical function, active engagement) and selective optimisation with compensation (Baltes).

:::clinician
Elective papers are often examined through short notes and application questions. For each field, prepare a one-paragraph definition, two theories, one assessment method, one Indian example and one ethical issue. Typical ethical issues: in school psychology, labelling and consent from parents versus the child's wishes; in career counselling, family pressure and gender stereotypes; in rehabilitation, autonomy versus protection and the social model; in military psychology, confidentiality versus command duties and fitness decisions; in consumer psychology, manipulation and dark patterns, especially for children. Assessment centre research shows good predictive validity when exercises are job-relevant and assessors are trained, but ratings often reflect exercises more than intended dimensions, a long-standing construct validity problem.
:::

:::recall
1. What is the zone of proximal development? || The gap between what a learner can do alone and what they can do with help (Vygotsky).
2. What does RIASEC stand for? || Realistic, Investigative, Artistic, Social, Enterprising, Conventional.
3. Name Super's five career stages. || Growth, exploration, establishment, maintenance, disengagement.
4. Name the four psychological tests used at the SSB. || Thematic Apperception Test, Word Association Test, Situation Reaction Test, self-description.
5. Contrast the central and peripheral routes of persuasion. || Central: careful thought about arguments. Peripheral: reliance on surface cues such as attractiveness or celebrity.
:::

:::mcq
Q: The SSB's use of tests, group tasks, an interview and a joint assessors' conference makes it an example of:
- A structured interview only
- A projective test
- *An assessment centre
- Unstructured clinical judgement
> Multiple methods and multiple assessors.

Q: A shopper buys a phone because a famous cricketer advertises it, without comparing features. According to the elaboration likelihood model, this is:
- The central route
- Cognitive dissonance
- A descriptive norm
- *The peripheral route
> Reliance on a surface cue rather than arguments.
:::

# Part IV · Exam zone

## 4.1 Long answers with model outlines [core]
Frame: **definition → theory or model → evidence → Indian example → critique → conclusion.**

### Q1. Discuss models of health behaviour and their use in promoting health in India. (15 marks)
:::widget reveal
{
  "prompt": "Plan in one minute, then reveal the model outline.",
  "answer": "1. Define health psychology and the biopsychosocial model (Engel). 2. Why behaviour matters: NCD burden, tobacco, diabetes in India. 3. HBM: six components, origin in TB screening, strongest predictors (barriers, benefits). 4. TPB: attitude, subjective norm, perceived behavioural control, intention; the intention-behaviour gap and implementation intentions. 5. TTM: five stages, stage-matched interventions, critique. 6. Newer models: HAPA, COM-B. 7. Indian applications: cervical screening camps with ASHAs, tobacco cessation, TB adherence (illness representations, treatment supporters, nutrition support). 8. Critique: individual focus, neglect of structural barriers and culture. 9. Conclusion: combine individual models with community and policy action."
}
:::

### Q2. Critically evaluate positive psychology, with reference to wellbeing, character strengths, resilience and post-traumatic growth. (15 marks)
:::widget reveal
{
  "prompt": "Plan, then reveal.",
  "answer": "1. Origins (Seligman 1998; three pillars). 2. Wellbeing: hedonic (Diener's subjective wellbeing) versus eudaimonic (Ryff's six dimensions; SDT); PERMA; Keyes's flourishing. 3. Character strengths: VIA's six virtues and 24 strengths; signature strengths. 4. Broaden-and-build. 5. Resilience: Kauai study, ordinary magic, protective factors, Bonanno's trajectories; hope and optimism. 6. PTG: five domains, coexistence with distress, Gujarat earthquake example. 7. Interventions and their modest effects. 8. Critique: tyranny of the positive, ignoring context, the withdrawn positivity ratio, cultural bias, perceived versus actual growth. 9. Second and third waves; Indian concepts (santosha, sukha). 10. Conclusion."
}
:::

### Q3. Describe the major theories of work motivation and leadership, with Indian examples. (15 marks)
:::widget reveal
{
  "prompt": "Plan, then reveal.",
  "answer": "1. I/O psychology and its history (Münsterberg, Taylor, Hawthorne). 2. Content theories: Maslow, Herzberg's hygiene factors and motivators, McClelland. 3. Process theories: Vroom, Adams' equity and organisational justice, goal setting, job characteristics model. 4. Leadership: trait, behavioural (Ohio State, Michigan, Managerial Grid), contingency (Fiedler, situational, path-goal), transformational versus transactional. 5. Indian work culture: power distance, personalised relationships, J. B. P. Sinha's nurturant-task leader, HRD at L&T (Pareek and Rao). 6. Critique: cultural fit of Western models, changing Indian workforce. 7. Conclusion."
}
:::

### Q4. What is forensic psychology? Discuss eyewitness testimony, deception detection and criminal responsibility in the Indian context. (15 marks)
:::widget reveal
{
  "prompt": "Plan, then reveal.",
  "answer": "1. Define and give scope (investigation, courts, corrections, victims). 2. Eyewitness memory: reconstructive memory, the misinformation effect, weapon focus, own-race bias, lineup safeguards, the cognitive interview. 3. Interrogation and false confessions: three types, risk factors, Reid versus PEACE. 4. Deception: chance-level human detection, polygraph limits, concealed information test, narco-analysis and brain mapping in India, Selvi v. State of Karnataka (2010). 5. Criminal responsibility: M'Naghten, BNS section 22, legal versus medical insanity, fitness to stand trial. 6. Risk assessment: actuarial, SPJ (HCR-20), PCL-R. 7. Juveniles and victims: JJ Act 2015 preliminary assessment, POCSO procedures. 8. Ethics: dual roles, limits of confidentiality. 9. Conclusion."
}
:::

### Q5. Discuss the psychology of digital life: online behaviour, digital learning and parental mediation. (10 marks)
:::widget reveal
{
  "prompt": "Plan, then reveal.",
  "answer": "Define cyberpsychology; online disinhibition (six factors, benign and toxic); self-presentation, social comparison and FOMO; the social media and adolescent wellbeing debate with both sides; gaming disorder in ICD-11 versus DSM-5-TR; cyberbullying features; digital learning (cognitive load theory, Mayer's principles, Indian platforms and the access gap); parental mediation table with evidence; Indian law (DPDP Act 2023 parental consent; online gaming law); conclusion on balanced, skill-building approaches."
}
:::

## 4.2 Short notes and viva [core]
Frame: **definition, three or four key points, one example, one line of significance.**

:::widget reveal
{
  "prompt": "Short note: Psychoneuroimmunology",
  "answer": "Study of links between mind, nervous system, hormones and immunity. Founded on Ader and Cohen's conditioned immunosuppression in rats (1975). Findings: exam stress lowers natural killer cell activity; caregivers' wounds heal more slowly; stress raises cold infection risk in a dose-response pattern; chronic stress and loneliness raise inflammation. Pathways: HPA, sympathetic system, behaviour; cytokines cause sickness behaviour. Significance: a biological route from stress to illness."
}
:::

:::widget reveal
{
  "prompt": "Short note: Post-traumatic growth",
  "answer": "Positive change arising from the struggle with highly challenging events (Tedeschi and Calhoun). Five domains: appreciation of life, relating to others, personal strength, new possibilities, spiritual change. Measured by the PTGI. Growth and distress coexist. Critique: perceived growth may not match measured change. Example: survivors of the 2001 Gujarat earthquake. Significance: widens trauma work beyond symptom reduction."
}
:::

:::widget reveal
{
  "prompt": "Short note: Contact hypothesis",
  "answer": "Allport (1954): intergroup contact reduces prejudice under equal status, common goals, cooperation and institutional support. Supported by a meta-analysis of over 500 studies; effects strongest when conditions are met; extended and imagined contact also help a little. Caution: contact can reduce disadvantaged groups' push for change. Example: mixed-caste sports teams and hostel projects. Significance: basis of many peace and anti-prejudice programmes."
}
:::

:::widget reveal
{
  "prompt": "Short note: Attention restoration theory",
  "answer": "Directed attention tires with effort; natural settings restore it. Four qualities: being away, extent, soft fascination, compatibility. Related: Ulrich's stress recovery theory (window-view study), biophilia. Evidence: modest, reliable benefits on attention and mood. Example: a walk in a city garden after exams. Significance: informs design of hospitals, schools and cities."
}
:::

:::widget reveal
{
  "prompt": "Short note: Selvi v. State of Karnataka (2010)",
  "answer": "Supreme Court of India judgment on narco-analysis, polygraph and brain electrical activation profiling. Held that involuntary administration violates the right against self-incrimination (Article 20(3)) and personal liberty (Article 21). Voluntary tests are allowed with safeguards, but results alone are not evidence; information discovered later because of them may be admissible. Significance: limits coercive investigative psychology in India."
}
:::

:::widget reveal
{
  "prompt": "Short note: Parental mediation",
  "answer": "Strategies parents use to shape children's media use: active or enabling (talk, explain, encourage safe use), restrictive (rules on time and content), co-use, technical controls, monitoring. Active mediation builds skills and reduces risk; restrictive mediation reduces risk and opportunity and may push use into secret; covert monitoring can harm trust. Best: active mediation plus age-appropriate rules. Significance: named in the "Emerging Areas" unit of postgraduate syllabi."
}
:::

:::viva
What did Engel propose in 1977? :: The biopsychosocial model, replacing the purely biomedical model.
Which HBM component was added in 1988? :: Self-efficacy.
What are the three predictors of intention in the TPB? :: Attitude, subjective norm, perceived behavioural control.
What does PERMA stand for? :: Positive emotion, engagement, relationships, meaning, accomplishment.
Who called resilience "ordinary magic"? :: Ann Masten.
What did the Hawthorne studies launch? :: The human relations movement.
Name Herzberg's two sets of factors. :: Hygiene factors and motivators.
What is the nurturant-task leader? :: J. B. P. Sinha's model of a task-focused, caring leader whose nurturance depends on performance.
Name Lewin's three steps of change. :: Unfreeze, change, refreeze.
What is the Bellary model? :: The 1985 Karnataka pilot that became India's District Mental Health Programme.
What did the Tamil Nadu sugarcane study show? :: Financial scarcity lowers cognitive performance in the same people.
What is Galtung's structural violence? :: Harm built into social systems.
What is the misinformation effect? :: Misleading post-event information distorts memory.
Name the three kinds of false confession. :: Voluntary, compliant, internalised.
What does PETTLEP stand for? :: Physical, environment, task, timing, learning, emotion, perspective.
What are the core features of ICD-11 gaming disorder? :: Impaired control, increasing priority, continuation despite harm.
What is the SSB an example of? :: An assessment centre.
:::

## 4.3 Q&A bank · Starting [starting]

:::qa What is the biopsychosocial model, and why did Engel argue it was needed? [starting]
### Short answer
The biopsychosocial model explains health and illness as the product of **biological, psychological and social factors acting together**. Engel argued that the biomedical model could not explain why people with the same disease differ so much in symptoms, course and recovery.

### Problems with the biomedical model
- It treats the mind and social context as irrelevant.
- It cannot explain illness without detectable disease, or disease without illness.
- It ignores the doctor-patient relationship.

### The model in practice: type 2 diabetes
| Level | Factors |
|---|---|
| Biological | Genes, insulin resistance, the thin-fat phenotype |
| Psychological | Beliefs about cause and control, diabetes distress, depression, self-efficacy |
| Social | Family cooking habits, shift work, cost of medicines, stigma, clinic access |

### Why it matters
Treatment plans that address all three levels (medicine, education and coping, family and community support) do better than medicine alone.
:::

:::qa Compare the Health Belief Model and the Theory of Planned Behaviour. [starting]
### Short answer
Both are social-cognitive models of health behaviour. The **HBM** focuses on beliefs about **threat** and the **costs and benefits** of action; the **TPB** focuses on **intention**, shaped by attitude, social norms and perceived control.

### Comparison
| Feature | HBM | TPB |
|---|---|---|
| Origin | Low TB screening uptake in the 1950s | Ajzen's general model of reasoned action |
| Key predictors | Susceptibility, severity, benefits, barriers, cues, self-efficacy | Attitude, subjective norm, perceived behavioural control |
| Role of intention | Not central | Central: the closest predictor |
| Social influence | Only through cues | Built in as subjective norm |
| Best predictors in research | Barriers and benefits | Perceived control and attitude |
| Main weakness | Weak on emotion and habit | The intention-behaviour gap |

### Example
Getting children vaccinated in a village: the HBM points to barriers (distance, lost wages) and cues (ASHA visits); the TPB adds what the mother-in-law and neighbours think (subjective norm).
:::

:::qa Explain PERMA with one practical example of each element. [starting]
### Short answer
PERMA is Seligman's model of wellbeing with five elements: **Positive emotion, Engagement, Relationships, Meaning and Accomplishment**. Each can be pursued for its own sake.

### Table
| Element | What it means | Practical example for a college student |
|---|---|---|
| Positive emotion | Joy, gratitude, hope | Ending each day by noting three things that went well |
| Engagement | Absorption and flow | Joining a theatre group where skills are stretched |
| Relationships | Warm, supportive ties | A regular call with grandparents; a study group |
| Meaning | Serving something bigger | Volunteering at a local anganwadi |
| Accomplishment | Mastery and achievement | Finishing a short course and seeing progress |

### A caution
PERMA describes wellbeing; it does not mean people should feel happy all the time. Sadness and stress are normal parts of a good life.
:::

:::qa Distinguish Herzberg's hygiene factors from motivators, and evaluate the theory. [starting]
### Short answer
Herzberg argued that **hygiene factors** (pay, policies, supervision, conditions) prevent dissatisfaction but do not motivate, while **motivators** (achievement, recognition, the work itself, responsibility, growth) create satisfaction and effort.

### Comparison
| Hygiene factors | Motivators |
|---|---|
| Salary, job security | Achievement |
| Company policy | Recognition |
| Supervision | The work itself |
| Working conditions | Responsibility |
| Relations with colleagues | Advancement and growth |

### Evaluation
- **Strength**: practical; led to job enrichment (adding responsibility and variety).
- **Weakness**: his interview method invited people to credit good events to themselves and blame bad ones on the company; later studies found pay can motivate.
- **Indian note**: in many Indian jobs, security and fair pay are major motivators, especially for workers supporting large families.
:::

:::qa What makes transformational leadership different from transactional leadership? [starting]
### Short answer
**Transactional** leaders exchange rewards for performance and correct mistakes; **transformational** leaders inspire followers to go beyond self-interest, change how they see their work and grow.

### Comparison
| Feature | Transactional | Transformational |
|---|---|---|
| Basis | Exchange: rewards for results | Inspiration and shared vision |
| Behaviours | Contingent reward, management by exception | Idealised influence, inspirational motivation, intellectual stimulation, individualised consideration |
| Follower motive | Self-interest | Commitment to the group and its purpose |
| Best for | Stable, routine work | Change, crisis, innovation |

### Evidence
Both are linked with performance; the best leaders use both. Laissez-faire (absent) leadership is consistently harmful.

### Indian example
A principal who sets clear targets and rewards (transactional), and also shares a vision of a school where every child reads, mentors young teachers and invites new ideas (transformational).
:::

:::qa What is applied psychology, and how do applied fields usually come into being? [starting]
### Short answer
Applied psychology uses psychological **theory, research and methods to solve practical problems**. New fields usually appear when a pressing social need meets a body of basic research that can address it.

### How fields were born
| Field | The need | The science it borrowed |
|---|---|---|
| Industrial-organisational | Selecting soldiers and workers in World War I | Intelligence testing |
| Health | Rising chronic, lifestyle illness | Learning, social cognition, stress research |
| Forensic | Unreliable witnesses and confessions | Memory and social influence |
| Community | Too few clinicians for the need | Ecology, prevention, social support |
| Cyberpsychology | Life moving online | Social, developmental and cognitive psychology |

### Features of applied work
- Starts from a real problem, not a theory.
- Works with other professions (doctors, lawyers, managers, teachers).
- Must be evaluated: does the intervention work here, for these people?

### Example
India's tele-mental health helpline needed ways to train counsellors quickly and assess risk over the phone, drawing on counselling research and task-sharing evidence.
:::

:::qa Compare the scientist-practitioner and practitioner-scholar models of training. [starting]
### Short answer
The **scientist-practitioner** model (Boulder, 1949) trains psychologists to both **do research and practise**; the **practitioner-scholar** model (Vail, 1973) trains mainly for **practice informed by research**, and led to the PsyD.

### Comparison
| Feature | Scientist-practitioner | Practitioner-scholar |
|---|---|---|
| Origin | Boulder conference | Vail conference |
| Degree | PhD | PsyD |
| Emphasis | Producing and using research | Applying research in practice |
| Thesis | Original research | Applied project or smaller study |
| Strength | Research skills; evidence-based culture | Strong clinical skills |
| Criticism | Few graduates actually do research | Weaker research training |

### Indian context
Clinical training in India has followed a strongly applied, hospital-based route through M.Phil and now the clinical master's degree, with research expected through a dissertation. PsyD programmes are newer.

### Why it matters
Both models agree that practice should be **evidence-based** and that practitioners should evaluate their own work.
:::

:::qa Explain the Transtheoretical Model of change and evaluate it. [starting]
### Short answer
The model says people move through **stages** (precontemplation, contemplation, preparation, action, maintenance) and that help should be **matched to the stage**. It is popular and intuitive, but its stage boundaries and the benefit of stage matching are disputed.

### Stages and matched help
| Stage | Person says | Matched help |
|---|---|---|
| Precontemplation | "I don't have a problem" | Information, raising awareness |
| Contemplation | "Maybe I should" | Weighing pros and cons |
| Preparation | "I'll start next month" | A specific plan, removing barriers |
| Action | "I've stopped" | Skills, support, rewards |
| Maintenance | "I've kept it up" | Relapse prevention |

### Other parts of the model
- **Decisional balance**: pros of change rise across stages.
- **Processes of change**: experiential early, behavioural later.
- **Relapse** is normal; people often cycle.

### Criticisms
- Stage cut-offs are arbitrary.
- Stage-matched interventions often do no better than unmatched ones.
- It underplays habits, environments and impulses.
:::

:::qa Distinguish hedonic and eudaimonic wellbeing with examples. [starting]
### Short answer
**Hedonic** wellbeing is about **feeling good**: life satisfaction and more positive than negative emotion. **Eudaimonic** wellbeing is about **living well**: purpose, growth, autonomy and good relationships.

### Comparison
| Feature | Hedonic | Eudaimonic |
|---|---|---|
| Roots | Pleasure and satisfaction | Aristotle's idea of flourishing |
| Key researcher | Diener (subjective wellbeing) | Ryff (psychological wellbeing); Ryan and Deci |
| Components | Life satisfaction, positive affect, low negative affect | Self-acceptance, positive relations, autonomy, environmental mastery, purpose, personal growth |
| Measure | Satisfaction With Life Scale | Ryff's scales |

### Example
A doctor working long rural shifts in Chhattisgarh may report less day-to-day pleasure (lower hedonic) but a strong sense of purpose and growth (higher eudaimonic).

### Indian perspective
Ideas such as santosha (contentment), duty and harmony fit eudaimonic and balance-oriented views more than high-arousal happiness.
:::

:::qa How is the VIA classification of character strengths organised, and how can strengths be used? [starting]
### Short answer
Peterson and Seligman grouped **24 character strengths under six virtues** found across cultures. People's top strengths, their **signature strengths**, can be used deliberately to raise wellbeing and engagement.

### The six virtues
| Virtue | Strengths |
|---|---|
| Wisdom and knowledge | Creativity, curiosity, judgement, love of learning, perspective |
| Courage | Bravery, perseverance, honesty, zest |
| Humanity | Love, kindness, social intelligence |
| Justice | Teamwork, fairness, leadership |
| Temperance | Forgiveness, humility, prudence, self-regulation |
| Transcendence | Appreciation of beauty, gratitude, hope, humour, spirituality |

### Using strengths
- Identify signature strengths with a strengths survey.
- Use one in a new way each day.
- In counselling, build on strengths alongside working on problems.
- In schools, strengths-based feedback improves engagement.

### Caution
Strengths can be overused (perseverance becoming stubbornness), and the classification draws on selected traditions.
:::

:::qa Explain Fredrickson's broaden-and-build theory with evidence. [starting]
### Short answer
Negative emotions **narrow** attention to deal with threats; positive emotions **broaden** attention and thinking, and over time this **builds** lasting resources such as friendships, skills and resilience.

### Two parts
1. **Broaden**: joy, interest and contentment widen the range of thoughts and actions that come to mind.
2. **Build**: broadened thinking leads to new relationships, knowledge and coping skills.

### Evidence
| Finding | What it shows |
|---|---|
| People shown amusing or calming films list more things they would like to do | Broadened action tendencies |
| Positive mood widens visual attention in lab tasks | Broadened attention |
| Positive emotions speed cardiovascular recovery after stress | An "undoing" effect on negative arousal |
| Loving-kindness practice increased positive emotions and personal resources over time | Building |

### Critique
Effects are often small, and the later "positivity ratio" claim was withdrawn because its mathematics was wrong.

### Example
A student who laughs with friends after a tough exam may come up with better ideas for revising than one stuck in worry.
:::

:::qa What are positive psychology interventions, and how strong is the evidence for them? [starting]
### Short answer
Positive psychology interventions are **brief, intentional activities** designed to raise positive feelings, thoughts and behaviours. They produce **small to moderate** improvements in wellbeing, smaller in higher-quality trials.

### Common interventions
| Intervention | What you do |
|---|---|
| Three good things | Each night, write three things that went well and why |
| Gratitude visit | Write and deliver a thank-you letter |
| Signature strengths | Use a top strength in a new way daily |
| Best possible self | Write about your future going well |
| Acts of kindness | Plan several kind acts in a day |

### Evidence
- Meta-analyses find small effects on wellbeing and depression.
- Effects shrink when only well-controlled trials are included.
- Benefits depend on fit: the person must want and enjoy the activity.

### Use wisely
- Helpful as part of a wider plan, not a cure for depression.
- Should not be used to ignore structural problems at school or work.
:::

:::qa What were the Hawthorne studies, and why do they matter? [starting]
### Short answer
The Hawthorne studies (1924 to 1932, at a Western Electric factory near Chicago) found that output often rose **whatever** was changed, which was read as workers responding to **attention, relationships and group norms**. They launched the human relations movement.

### The studies
| Phase | Finding |
|---|---|
| Illumination experiments | Output rose with brighter and dimmer lighting |
| Relay assembly room | Output rose with many changes to breaks and hours |
| Interview programme | Workers valued being listened to |
| Bank wiring room | Groups set their own output norms and pressured members |

### Why they matter
- Shifted management thinking from purely economic incentives to social needs.
- Gave the name **Hawthorne effect** to changes caused by being observed.

### Criticisms
- Small groups, weak controls and confounds (fewer hours, changes in pay and supervisors).
- Later reanalyses found the effects much less clear.
:::

:::qa Explain equity theory and the idea of organisational justice. [starting]
### Short answer
Adams' equity theory says people compare their **inputs and outcomes** with others'; perceived unfairness causes tension that they try to reduce. Organisational justice extends this to **outcomes, procedures and treatment**.

### Equity theory
- **Inputs**: effort, skill, time, loyalty.
- **Outcomes**: pay, recognition, promotion.
- If my ratio seems lower than a colleague's, I may work less, ask for more, leave, or change my comparison.

### Three kinds of justice
| Type | Question | Example |
|---|---|---|
| Distributive | Are outcomes fair? | Equal bonuses for equal work |
| Procedural | Are decisions made fairly? | Clear, consistent appraisal criteria |
| Interactional | Am I treated with respect and told why? | A manager explains a decision politely |

### Evidence
Procedural and interactional justice strongly predict commitment and trust, sometimes more than pay itself.

### Indian example
Contract workers doing the same job as permanent staff for less pay often show the effects of perceived inequity: low commitment and high turnover.
:::

:::qa Compare Fiedler's model, situational leadership and path-goal theory. [starting]
### Short answer
All three are **contingency theories**: the best leadership depends on the situation. They differ on what the leader can change and which situational factors matter.

### Comparison
| Feature | Fiedler's contingency model | Situational leadership | Path-goal theory |
|---|---|---|---|
| Leader style | Fixed: task- or relationship-oriented | Flexible: telling, selling, participating, delegating | Flexible: directive, supportive, participative, achievement-oriented |
| Key situational factor | Leader-member relations, task structure, position power | Follower readiness (ability and willingness) | Follower needs and task features |
| Advice | Match the leader to the situation, or change the situation | Change style as followers develop | Remove obstacles on the path to goals |

### Example
A new hospital ward manager with inexperienced nurses may be directive at first (situational leadership: telling) and become more participative as they gain skill.

### Evaluation
Situational leadership is popular in training but has mixed research support; path-goal theory is useful conceptually; Fiedler's model has some support but is complex.
:::

## 4.4 Q&A bank · Beginner [beginner]

:::qa How does psychoneuroimmunology explain the link between stress and illness? [beginner]
### Short answer
PNI shows that the brain, endocrine system and immune system are in constant two-way communication, so chronic stress can **weaken defences and raise inflammation**, while immune signals can change **mood and behaviour**.

### Evidence
| Study | Finding |
|---|---|
| Conditioned immunosuppression in rats | The immune system can be classically conditioned |
| Exam stress in medical students | Lower natural killer cell activity |
| Dementia caregivers | Slower wound healing |
| Cold-virus exposure | Higher stress, higher infection risk |
| Meta-analysis of hundreds of studies | Acute stress boosts some defences; chronic stress suppresses many |

### Pathways
1. **Direct**: HPA axis (cortisol) and sympathetic nerves act on immune cells.
2. **Behavioural**: poor sleep, smoking, alcohol, poor diet, missed medicines.
3. **Reverse**: cytokines act on the brain to cause sickness behaviour and possibly depression.

### Application
Stress reduction, sleep, exercise and social support improve some immune markers, which supports psychological care in chronic illness.
:::

:::qa Explain resilience and post-traumatic growth, and how they differ. [beginner]
### Short answer
**Resilience** is maintaining or regaining healthy functioning despite adversity; **post-traumatic growth** is positive change that goes **beyond** previous functioning because of the struggle. A person can be resilient without growth, or grow while still distressed.

### Comparison
| Feature | Resilience | Post-traumatic growth |
|---|---|---|
| Outcome | Stable or recovered functioning | Change beyond the previous level |
| Timing | Can be immediate | Develops over time through struggle |
| Distress | Brief | Often coexists with continuing distress |
| Key researchers | Werner, Masten, Bonanno | Tedeschi and Calhoun |
| Measure | Many scales; trajectories over time | The PTG Inventory (five domains) |

### Protective factors for resilience
Individual (hope, self-regulation, faith), family (one stable caregiver), community (schools, mentors, services).

### Critique
Retrospective reports of growth often do not match changes measured before and after the event; some reported growth may be a coping story.
:::

:::qa Describe HRD and OD, with reference to Indian contributions. [beginner]
### Short answer
**HRD** develops people's competencies and potential through systems such as appraisal, training and career planning; **OD** is planned change of the whole organisation using behavioural science. Indian psychologists, especially Udai Pareek and T. V. Rao, were early world leaders in HRD.

### HRD
- **Mechanisms**: developmental appraisal, potential appraisal, career planning, feedback and counselling, training, rewards, welfare.
- **Indian milestone**: an integrated HRD system designed for Larsen and Toubro in the mid-1970s; the National HRD Network followed.
- **Evaluation**: Kirkpatrick's four levels (reaction, learning, behaviour, results).

### OD
| Approach | Idea |
|---|---|
| Lewin's three steps | Unfreeze, change, refreeze; force-field analysis |
| Action research | Diagnose, plan, act, evaluate with members as partners |
| T-groups | Learning about self and group through unstructured group experience (in India, through ISABS) |
| Process consultation | Helping a group see and improve its own processes |
| Appreciative inquiry | Build on strengths: discover, dream, design, destiny |

### Indian context
Personalised, hierarchical relationships and family ownership shape both; the nurturant-task leader model fits many settings.
:::

:::qa What is community psychology, and how does task sharing address India's mental health treatment gap? [beginner]
### Short answer
Community psychology works **with communities** to prevent problems and promote wellbeing, using ecological, preventive and empowering approaches. **Task sharing** trains non-specialists to deliver psychological care, which is essential where specialists are few.

### Core principles
- Ecological thinking (people and settings shape each other).
- Prevention at primary, secondary and tertiary levels.
- Empowerment and participation.
- Sense of community and social support.

### The Indian gap
- Few psychiatrists and clinical psychologists per population, concentrated in cities.
- A large treatment gap for common and severe disorders.

### Task-sharing evidence
| Programme | What it showed |
|---|---|
| Lay counsellors in Goa primary care | Better recovery from common mental disorders |
| A brief behavioural activation programme | Lay counsellors effectively treat depression |
| Community volunteers in Mehsana | Identification, support and links to services |
| Grandmothers on park benches in Zimbabwe | Problem-solving therapy reduces depression |

### Limits
Needs training, supervision, referral pathways and fair pay for workers; scale-up is harder than trials.
:::

:::qa Explain stigma using Goffman and Link and Phelan, and suggest how to reduce mental illness stigma in India. [beginner]
### Short answer
Goffman described stigma as a deeply discrediting attribute that spoils identity; Link and Phelan showed it is a **process** of labelling, stereotyping, separation, status loss and discrimination that depends on **power**. Contact-based approaches reduce it best.

### Levels of stigma
| Level | Example |
|---|---|
| Public | Neighbours avoid a family after a son's psychosis |
| Self | “People like me can't marry or work” (the why-try effect) |
| Structural | Insurance exclusions, discriminatory rules |
| Courtesy (associative) | The family is shamed too |

### Reducing stigma in India
1. **Contact**: people with lived experience speak in schools and communities.
2. **Language**: avoid labels such as "pagal"; use person-first language.
3. **Media**: responsible portrayals in films and news.
4. **Law**: use the protections of the Mental Healthcare Act and the RPwD Act.
5. **Services**: integrate mental health into general clinics so seeking help is ordinary.
:::

:::qa Explain Leventhal's common-sense model and how it helps improve adherence. [beginner]
### Short answer
People build **illness representations** (identity, cause, timeline, consequences, control) that guide how they cope. When a representation is wrong, for example seeing a chronic illness as short-lived, people stop treatment. Correcting it improves adherence.

### The five dimensions
| Dimension | Patient's question | Example of a harmful belief |
|---|---|---|
| Identity | What is it, what are the symptoms? | "BP is only there when I feel tense" |
| Cause | Why did I get it? | "It's the evil eye, so tablets won't help" |
| Timeline | How long will it last? | "TB is cured once I feel well" |
| Consequences | How will it affect me? | "Diabetes is minor" |
| Control or cure | Can it be treated? | "Nothing I do changes it" |

### Using the model
1. Ask open questions about the patient's own view.
2. Correct the timeline and control beliefs gently.
3. Link actions to the patient's goals.
4. Check understanding with teach-back.

### Example
A man in Nagpur stops his hypertension tablets on calm days; explaining that blood pressure stays high without symptoms, and giving him a home BP monitor, restores adherence.
:::

:::qa Explain the gate control theory of pain and its implications for treatment. [beginner]
### Short answer
Melzack and Wall proposed that a "gate" in the **spinal cord** controls how much pain signal reaches the brain. Touch input and **messages from the brain** (attention, emotion, expectation) can close or open the gate, so psychology changes real pain.

### How the gate works
| Factor | Effect on the gate |
|---|---|
| Large-fibre input (rubbing, massage, TENS) | Closes |
| Distraction, calm, positive expectation | Closes |
| Anxiety, depression, focusing on pain | Opens |
| Catastrophising ("this will never end") | Opens |

### Treatment implications
- CBT for chronic pain targets catastrophising and avoidance.
- Relaxation and mindfulness reduce arousal.
- Graded activity breaks the fear-avoidance cycle.
- Placebo analgesia shows expectations act on real pain pathways.

### Later development
Melzack's **neuromatrix** theory: pain is produced by a brain network, which explains phantom limb pain.

### Example
A woman in Lucknow with chronic back pain reduces her pain and disability through graded walking, pacing and challenging the belief that movement will damage her spine.
:::

:::qa Why do patients not follow treatment, and how can adherence be improved? Use India's TB programme as an example. [beginner]
### Short answer
Non-adherence has many causes: **forgetting, side effects, cost, complexity, poor understanding and beliefs**. Improving it needs good communication plus practical support.

### Causes
| Type | Example |
|---|---|
| Unintentional | Forgetting, complex regimens, travel |
| Intentional | Stopping when feeling well, fear of side effects |
| Practical | Lost wages for clinic visits, cost of travel |
| Social | Stigma, lack of family support |
| Communication | Not understanding instructions |

### Ways to improve
- **Clear communication**: plain words, key points first, written instructions, teach-back.
- **Simplify**: fewer doses, fixed-dose combinations.
- **Reminders**: SMS, pill boxes, digital monitors.
- **Support**: treatment supporters, family involvement.
- **Reduce barriers**: nearby collection points, financial help.

### India's TB programme
Treatment supporters, digital adherence tools and a monthly nutrition payment address both reminders and practical barriers, reflecting adherence research.
:::

:::qa Present the main criticisms of positive psychology and the responses of later waves. [beginner]
### Short answer
Critics argue that positive psychology can **pressure people to be happy, ignore social context, rest on weak evidence in places and reflect Western values**. Second-wave and third-wave positive psychology respond by valuing negative emotions and looking beyond the individual.

### Criticisms
| Criticism | Point |
|---|---|
| Tyranny of the positive | Normal sadness becomes a failure |
| Ignoring context | Individual gratitude exercises for structural problems such as poverty or bad jobs |
| Weak science | The withdrawn positivity ratio; small intervention effects |
| Cultural bias | Measures centred on individual happiness and self-esteem |

### Responses
| Wave | Focus |
|---|---|
| Second wave | The interplay of positive and negative: meaning in suffering, value of sadness, courage with fear |
| Third wave | Systems, groups, cultures and interdisciplinary work |

### Indian angle
Concepts such as santosha, duty, harmony and equanimity offer non-hedonic models of wellbeing that fit these later waves.
:::

:::qa Describe Schein's model of organisational culture and Hofstede's cultural dimensions, with reference to India. [beginner]
### Short answer
Schein describes culture **within an organisation** at three levels; Hofstede describes **national cultures** on several dimensions. India scores high on power distance, which shapes workplace relationships.

### Schein's levels
| Level | Example in an Indian firm |
|---|---|
| Artefacts | A puja at the start of the year; senior offices on the top floor |
| Espoused values | "We value open communication" in the brochure |
| Basic assumptions | Juniors should not question seniors in meetings |

### Hofstede's dimensions
| Dimension | India's tendency |
|---|---|
| Power distance | High: hierarchy is expected |
| Individualism | Moderate: a mix of individual and collective orientations |
| Masculinity | Moderately high: achievement and success valued |
| Uncertainty avoidance | Lower: tolerance of ambiguity, flexibility |
| Long-term orientation | Moderate |
| Indulgence | Low: restraint valued |

### Critique
National averages hide huge variation across regions, sectors and generations; young IT workers in Bengaluru may differ sharply from older public-sector staff.
:::

:::qa Compare Caplan's levels of prevention with the universal, selective and indicated model, using Indian examples. [beginner]
### Short answer
Caplan classified prevention by **stage of illness** (before, early, after); the newer model classifies it by **who is targeted** (everyone, higher-risk groups, people with early signs).

### Caplan's model
| Level | Aim | Indian example |
|---|---|---|
| Primary | Stop problems starting | Life-skills education in schools |
| Secondary | Detect and treat early | Screening mothers for postnatal depression at immunisation visits |
| Tertiary | Reduce disability | Day care and vocational rehabilitation for people with schizophrenia |

### Universal, selective and indicated
| Type | Target | Indian example |
|---|---|---|
| Universal | Whole population | Mental health awareness campaigns, helpline publicity |
| Selective | Groups at higher risk | Support for children of parents with alcohol dependence |
| Indicated | People with early signs | Brief counselling for students with high anxiety scores |

### Why both are useful
The newer model fits prevention science and avoids calling treatment "prevention"; Caplan's model is still widely used in exams.
:::

:::qa Explain Berry's acculturation model and apply it to internal migration in India. [beginner]
### Short answer
Berry identified four strategies based on two choices: **keep the heritage culture?** and **join the new culture?** Integration usually brings the best adjustment. India's vast internal migration produces acculturation within one country.

### The strategies
| | Join new culture | Do not join |
|---|---|---|
| Keep heritage | Integration | Separation |
| Do not keep | Assimilation | Marginalisation |

### Internal migration in India
- Tens of crores of people live outside their birthplace, moving for work, study and marriage.
- Students from the North-East in Delhi, Bihari workers in Mumbai and Tamil families in Gujarat face language barriers, discrimination and loneliness.

### Acculturative stress
| Stressor | Example |
|---|---|
| Language | Not speaking the local language |
| Discrimination | Being labelled an outsider |
| Loss of support | Leaving joint families |
| Insecure work | Daily wage labour without protection |

### Implications
Integration needs both the migrant's choice and a welcoming receiving community; colleges and employers can help with mixed groups and anti-discrimination policies.
:::

:::qa How does poverty affect the mind? Discuss with reference to the scarcity hypothesis. [beginner]
### Short answer
Poverty is a **mental load** as well as a lack of money. The scarcity hypothesis says that financial worry captures attention and reduces cognitive "bandwidth", making good decisions harder, which can keep people poor.

### Key evidence
- Sugarcane farmers in Tamil Nadu scored worse on cognitive tests before harvest (when short of money) than after harvest (when paid).
- In lab studies, thinking about a large unexpected bill lowered poorer participants' test performance more than richer ones'.

### Effects of poverty
| Domain | Effect |
|---|---|
| Attention and self-control | Bandwidth taxed by constant juggling |
| Stress biology | Chronic stress and allostatic load |
| Mental health | Higher risk of depression and anxiety |
| Child development | Poor nutrition, less stimulation, toxic stress |

### Implications
- Poor decisions are often a **result**, not a cause, of poverty.
- Simplify services (fewer forms, reminders, timely payments).
- Cash transfers and anti-poverty programmes improve mental health.

### Indian research
Earlier work on prolonged deprivation linked poverty with lower achievement motivation but stressed environment, not deficits in people.
:::

:::qa Compare the medical, social and biopsychosocial models of disability, and link them to India's RPwD Act 2016. [beginner]
### Short answer
The **medical model** locates disability in the person's impairment; the **social model** locates it in societal barriers; the **biopsychosocial (ICF) model** combines body, activity, participation and environment. India's 2016 Act reflects a rights-based, largely social approach.

### Comparison
| Model | Disability is caused by | Solution |
|---|---|---|
| Medical | Impairment in the body or mind | Treatment, cure, rehabilitation |
| Social | Barriers: steps, attitudes, inaccessible information | Remove barriers; rights and inclusion |
| Biopsychosocial (ICF) | Interaction of health condition, personal and environmental factors | Both treatment and environmental change |

### The RPwD Act 2016
- Recognises 21 conditions, including mental illness, autism, specific learning disabilities and intellectual disability.
- Rights to non-discrimination, accessibility, education and employment.
- Reservation for people with benchmark disability (40% or more).
- Follows the UN Convention on the Rights of Persons with Disabilities.

### Example
A wheelchair user in a college without ramps is disabled by the building (social model); a ramp and lift enable her fully.
:::

:::qa Explain peace psychology using Galtung's ideas, the contact hypothesis and the 1918 Ahmedabad mill strike. [beginner]
### Short answer
Peace psychology studies how to prevent violence and build just, cooperative relationships. **Galtung** widened violence beyond physical harm; the **contact hypothesis** shows how prejudice can be reduced; **Gandhi's** handling of the 1918 strike illustrates nonviolent conflict resolution.

### Galtung
| Form | Meaning |
|---|---|
| Direct violence | Physical harm |
| Structural violence | Harm built into systems |
| Cultural violence | Ideas that justify harm |
| Negative peace | Absence of war |
| Positive peace | Justice and cooperation |

### Contact hypothesis
Contact reduces prejudice under equal status, common goals, cooperation and support from authorities; a meta-analysis of over 500 studies supports it.

### The Ahmedabad mill strike, 1918
- Textile workers demanded higher wages; Gandhi supported them but insisted on nonviolence.
- He kept a respectful relationship with the mill owners.
- When the strike weakened, he fasted to strengthen the workers' resolve.
- The dispute went to arbitration and workers received a raise.

### Lessons
Focus on interests, keep relationships, use fair procedures and refuse violence.
:::

## 4.5 Q&A bank · Advanced [advanced]

:::qa Critically evaluate the use of narco-analysis, polygraph and brain-mapping in Indian investigations. [advanced]
### Short answer
These techniques measure **arousal or brain responses, not truth**, are vulnerable to error and suggestion, and, after the Supreme Court's 2010 Selvi judgment, cannot be used **without consent**. Their scientific and legal value is limited.

### The techniques
| Technique | What it measures | Main problems |
|---|---|---|
| Polygraph | Heart rate, blood pressure, breathing, sweating | Anxious innocent people fail; practised liars pass; questions shape results |
| Narco-analysis | Talk under a sedative | Statements can be fantasy or suggestion; not reliable truth |
| Brain electrical activation profiling | Brain responses to crime details | Weak independent validation; experience-versus-knowledge confusion |

### The law
- Involuntary use violates the right against self-incrimination and personal liberty.
- Voluntary tests are allowed with safeguards; results alone are not evidence; information found as a result may be admissible.

### Better practice
The concealed information test has stronger science, and information-gathering interviews (PEACE) reduce false confessions. A psychologist should refuse involuntary testing and explain the limits.
:::

:::qa How should a sports psychologist assess and help an athlete who chokes under pressure? [advanced]
### Short answer
Assess **when, where and how** performance drops, distinguish the **explicit-monitoring** and **distraction** routes, rule out clinical anxiety or depression, then build routines, attentional skills and pressure practice.

### Assessment
1. Interview: situations, thoughts, focus of attention, bodily signs.
2. Measures: competitive anxiety (cognitive, somatic, confidence), reinvestment tendency.
3. Performance data: practice versus competition.
4. Screen for clinical problems and refer when needed.

### Intervention plan
| Problem | Intervention |
|---|---|
| Conscious control of automatic skills | External focus, analogy cues, pre-performance routine |
| Worry using working memory | Expressive writing before events, cognitive restructuring |
| High somatic arousal | Breathing, relaxation; reappraise arousal as excitement |
| Unfamiliar pressure | Practise under simulated pressure (crowds, stakes) |
| Ego-oriented climate | Work with coach on mastery climate and process goals |

### Evaluation
Track performance under pressure over a season, not only in one match.
:::

:::qa Evaluate the debate about social media and adolescent mental health. [advanced]
### Short answer
Adolescent anxiety and depression rose in many countries from the early 2010s, alongside smartphones and social media. One side argues social media is a major cause; the other finds **small average associations** and argues that **content, context and vulnerability** matter more than time.

### The two positions
| Position | Main arguments |
|---|---|
| Social media as a major cause | Timing of the rise; stronger links for girls and heavy users; disrupted sleep and exercise; some natural experiments and experiments reducing use |
| Small and context-dependent effects | Large datasets show very small average associations; direction of causation unclear; benefits for connection and support; measurement of "screen time" is crude |

### Where most researchers agree
- Night-time use that disrupts sleep, cyberbullying, harmful content and compulsive use are risks.
- Vulnerable young people may be harmed more.
- Active, social use differs from passive scrolling.

### Implications in India
- Policy now includes parental-consent rules for children's data and a ban on real-money gaming.
- Practical advice: active parental mediation, device-free sleep, digital skills in schools, and help for those who struggle.
:::

:::qa What are the main ethical issues when psychologists use AI, and how should they be managed? [advanced]
### Short answer
The core issues are **evidence, safety, privacy, bias, transparency and accountability**. They are managed by applying ordinary professional ethics with added checks for AI-specific risks.

### Issues and safeguards
| Issue | Risk | Safeguard |
|---|---|---|
| Evidence | Tools marketed without good trials | Use only tools with relevant evidence; evaluate locally |
| Safety | Missed crises, harmful or flattering replies | Human crisis routes, testing, monitoring |
| Privacy | Sensitive data stored or reused | Consent, approved platforms, no identifiable data in public tools; follow data protection law |
| Bias | Poor performance in Indian languages and cultures | Test on local populations and idioms of distress |
| Transparency | Clients unaware AI is involved | Tell clients clearly and record consent |
| Accountability | Unclear responsibility for harm | A qualified human remains responsible for decisions |
| Competence | Misunderstanding what the tool does | Training before use |

### Dated context
As at November 2026, regulators were still developing rules: several US states restrict AI therapy, the EU limits emotion recognition at work and in schools, and India relies on data protection law, research ethics guidelines and professional codes.
:::

:::qa A district wants to reduce farmer distress after repeated crop failures. Design an applied psychology programme using ideas from this module. [advanced]
### Short answer
Combine **community psychology** (prevention, task sharing, empowerment), **health psychology** (stress and illness), **positive psychology** (resilience and meaning) and **peace and poverty psychology** (structural causes), with careful evaluation.

### Programme design
| Level | Action | Theory behind it |
|---|---|---|
| Structural | Work with officials on timely insurance payouts, debt relief information and market access | Scarcity and structural violence |
| Community | Train volunteers and ASHAs to recognise distress, offer support and link to services; farmer support groups | Task sharing, sense of community, empowerment |
| Primary care | Screening and brief problem-solving or behavioural activation by trained counsellors | Stepped care evidence |
| Specialist | Clear referral to the district mental health team and Tele-MANAS | Layered support |
| Individual coping | Problem-solving, stress management, meaning-focused and religious coping where wanted | Transactional model, goodness of fit |
| Means and safety | Safer pesticide storage and community safety planning, led by health services | Primary prevention |

### Evaluation
Use a stepped rollout across villages, measure distress, help-seeking, functioning and use of services, and include farmers in deciding what counts as success.
:::

:::qa Discuss noise and crowding as environmental stressors, and the role of perceived control. [advanced]
### Short answer
Noise and crowding harm wellbeing and performance most when they are **unpredictable and uncontrollable**. Perceived control is the strongest single factor that reduces their effects.

### Noise
- Random bursts of loud noise lowered later frustration tolerance in lab studies.
- When people believed they could switch the noise off, after-effects shrank, even if they never used the switch.
- Children in classrooms facing a train line lagged in reading until noise was reduced.

### Crowding
| Concept | Meaning |
|---|---|
| Density | Number of people per space |
| Crowding | The unpleasant feeling of too many people |
| Moderators | Control, purpose, relationships, culture, duration |

### Theories of crowding
- **Overload**: too much stimulation.
- **Behavioural constraint**: freedom of movement and choice is limited.
- **Loss of control**: the most consistent explanation.

### Indian applications
Indian household crowding research found family cohesion and cultural expectations moderated the effects. Design ideas include quiet zones in schools, predictable schedules in crowded offices and privacy screens in hostels.
:::

:::qa Compare attention restoration theory and stress recovery theory. [advanced]
### Short answer
Both explain why nature is good for us. **Attention restoration theory** says nature restores tired **directed attention**; **stress recovery theory** says nature quickly reduces **physiological stress**.

### Comparison
| Feature | Attention restoration theory | Stress recovery theory |
|---|---|---|
| What is restored | Directed attention | Stress arousal and mood |
| Mechanism | Soft fascination lets effortful attention rest | Evolved, rapid positive response to safe natural scenes |
| Key features of setting | Being away, extent, soft fascination, compatibility | Water, greenery, open views, safety |
| Classic evidence | Better attention task scores after nature walks | Surgical patients with a tree view recovered faster |

### Applications
- Hospital gardens and window views.
- Green school playgrounds.
- City parks such as riverfronts and lake gardens.

### Critique
Effects are real but modest and depend on expectations and comparisons; urban green space must be safe and accessible to help.
:::

:::qa How can psychology help promote pro-environmental behaviour? Use Indian examples. [advanced]
### Short answer
Environmental problems are often **social dilemmas**: what is good for each person harms everyone. Psychology helps by changing **norms, habits, barriers and values**, not just giving information.

### Key ideas
| Idea | Use |
|---|---|
| Tragedy of the commons | Shared resources are overused without rules and trust |
| Descriptive norms | "Most guests reuse towels" works better than appeals |
| Value-belief-norm theory | Values and personal obligation drive action |
| Attitude-behaviour gap | Concern does not become action when costs are high |
| Habit and defaults | Making the green choice the default |

### Indian examples
- **Chipko movement**: collective action rooted in dependence on forests.
- **Swachh Bharat**: toilet construction was fast, but use depended on norms, purity beliefs and water access.
- **Water conservation**: community-managed water bodies succeed where trust and rules exist.

### Lessons
Combine infrastructure with norms, community ownership and feedback; information alone rarely works.
:::

:::qa Discuss the factors that affect eyewitness accuracy and the procedures that improve it. [advanced]
### Short answer
Memory is **reconstructive**. Accuracy depends on conditions at the event (estimator variables) and on how police collect evidence (system variables), which can be improved.

### Estimator variables
| Factor | Effect |
|---|---|
| Stress | High stress can impair memory for faces |
| Weapon focus | Attention goes to the weapon |
| Exposure time and distance | Brief or distant views reduce accuracy |
| Own-group bias | Better recognition of faces from one's own group |
| Delay | Memory fades and becomes open to change |

### System variables
| Procedure | Improvement |
|---|---|
| Double-blind lineups | Prevent unintended cues |
| Unbiased instructions | "The person may not be present" |
| Fair fillers | Match the description |
| Immediate confidence recording | Initial confidence is informative; later confidence inflates |
| Cognitive interview | More correct detail without many more errors |
| Avoid leading questions | Prevents the misinformation effect |

### Indian context
Courts rely heavily on witness testimony; training police in these procedures could reduce wrongful convictions.
:::

:::qa Explain the legal test of insanity in India and distinguish it from fitness to stand trial. [advanced]
### Short answer
India's test (now **section 22 of the Bharatiya Nyaya Sanhita 2023**, formerly IPC section 84) asks whether, **at the time of the act**, unsoundness of mind made the person incapable of knowing the nature of the act or that it was wrong or contrary to law. **Fitness to stand trial** concerns the person's **present** ability to take part in the trial.

### Comparison
| Feature | Legal insanity | Fitness to stand trial |
|---|---|---|
| Time | At the time of the offence | Now, during proceedings |
| Question | Could the person know the nature of the act or that it was wrong? | Can the person understand proceedings and instruct a lawyer? |
| Outcome if met | Not criminally responsible; usually detained for treatment | Trial postponed until fitness returns |
| Origin | The M'Naghten rules (1843) | Due-process principles |

### Legal versus medical insanity
Having a mental illness does not mean meeting the legal test. A person with schizophrenia who knew the act was wrong is legally responsible.

### The psychologist's role
Detailed assessment, history from several sources, testing for malingering, clear reports. The court decides.
:::

:::qa Compare approaches to violence risk assessment, including the PCL-R. [advanced]
### Short answer
Risk can be assessed by **unstructured clinical judgement, actuarial tools or structured professional judgement (SPJ)**. Structured approaches outperform unaided judgement, but none predicts individual behaviour precisely.

### Approaches
| Approach | Method | Strengths | Weaknesses |
|---|---|---|---|
| Unstructured | Clinician's overall impression | Flexible | Unreliable, biased |
| Actuarial | Statistical formula from fixed factors | Reliable, transparent | Ignores individual change; mostly static factors |
| SPJ (for example HCR-20) | Rate historical, clinical and risk-management factors, then judge | Links to management plans; includes changeable factors | Needs training |

### The PCL-R
- 20 items scored from interview and records.
- Two broad factors: interpersonal-affective (glibness, lack of remorse) and lifestyle-antisocial (impulsivity, early problems).
- High scores predict reoffending in many samples.
- Concerns: misuse as a label, rater bias, limited validation in India.

### Key point
Risk tools guide management and treatment planning; they must be validated for local populations and used ethically.
:::

:::qa Compare models of arousal and performance in sport. [advanced]
### Short answer
Models moved from simple accounts (more arousal helps, or moderate arousal is best) to **individualised and multidimensional** models that separate worry from bodily arousal and explain sudden collapses.

### Comparison
| Model | Claim | Strength | Limit |
|---|---|---|---|
| Drive theory | Arousal boosts the dominant response | Explains social facilitation | Experts also choke |
| Inverted-U | Moderate arousal is best | Simple, intuitive | One curve for all people and tasks |
| IZOF | Each athlete has a personal optimal zone | Individualised | Hard to generalise |
| Multidimensional anxiety theory | Cognitive anxiety harms; somatic anxiety follows an inverted-U; confidence helps | Separates components | Mixed support for specific predictions |
| Catastrophe model | High worry plus rising arousal causes sudden collapse | Explains choking | Complex to test |
| Reversal theory | Arousal felt as excitement or anxiety | Explains reappraisal | Less predictive |

### Application
Measure each athlete's worry and arousal before good and poor performances to find their zone; teach reappraisal and routines.
:::

:::qa Explain the online disinhibition effect and its role in cyberbullying. [advanced]
### Short answer
Suler's online disinhibition effect explains why people **say and do online what they would not do face to face**. Its toxic form helps drive trolling and cyberbullying; its benign form helps people seek support.

### Factors
| Factor | Meaning |
|---|---|
| Dissociative anonymity | "You don't know who I am" |
| Invisibility | No faces or reactions seen |
| Asynchronicity | No immediate response |
| Solipsistic introjection | The other person becomes a voice in one's head |
| Dissociative imagination | "It's just a game" |
| Minimised authority | Status cues disappear |

### Cyberbullying
- Can happen at any time, reaches large audiences, can be anonymous and stays online.
- Linked with depression, anxiety and school avoidance in victims.

### Prevention
- Digital citizenship education.
- Clear reporting systems at schools and platforms.
- Bystander training: supporting the victim and reporting.
- Parental active mediation and open communication.
:::

:::qa How would you advise parents worried about their teenager's gaming? [advanced]
### Short answer
First distinguish **heavy but healthy gaming** from **gaming disorder** (impaired control, increasing priority, continuation despite harm, with significant impairment). Then use **active mediation**, agreed rules and attention to sleep, school and mood.

### Assessment
| Question | Warning sign |
|---|---|
| Control | Repeated failed attempts to cut down |
| Priority | Dropping friends, sport and study for games |
| Harm | Falling marks, sleep loss, conflict |
| Duration | Pattern lasting many months |
| Other problems | Depression, anxiety, ADHD, bullying |

### Advice to parents
1. Talk about what the teen enjoys in games.
2. Agree clear rules together: no devices in the bedroom at night, games after homework.
3. Use parental controls openly, not secretly.
4. Encourage offline activities and friendships.
5. Watch mood and sleep.

### When to refer
If harm continues despite these steps, refer for assessment; family-based CBT approaches are used, and specialist technology-use clinics exist in India.

### Legal note
India's 2025 law banned real-money online games; esports and social games are treated separately.
:::

:::qa Discuss the uses of AI in psychological assessment and therapy, and evaluate the evidence. (15 marks) [advanced]
### Short answer
AI is used for **prediction, language analysis, digital phenotyping, chatbots, clinician support and testing**. Early evidence is promising in some areas, but most tools lack strong trials, local validation and safety safeguards.

### Answer plan
1. **Define** AI, machine learning and large language models.
2. **Assessment uses**: risk prediction, speech markers, adaptive testing.
3. **Therapy uses**: rule-based and generative chatbots, digital CBT.
4. **Clinician support**: notes, training simulations.
5. **Evidence**: one randomised trial of a purpose-built generative chatbot showed reduced depression and anxiety with human safety oversight; rule-based apps show small short-term benefits; prediction tools have low positive predictive value for rare outcomes.
6. **Risks**: hallucination, sycophancy, crisis failures, privacy, bias, dependence.
7. **Regulation** as at November 2026: no FDA-cleared AI therapy device; US state restrictions; EU limits; India relies on data protection and ethics guidelines.
8. **Indian issues**: languages, idioms of distress, digital divide.
9. **Conclusion**: adjunct with safeguards, not replacement.

### Evidence summary table
| Use | Evidence | Status |
|---|---|---|
| Risk prediction | Better than chance; low positive predictive value | Research and pilots |
| Speech and language markers | Promising | Research |
| Generative chatbots | One positive trial with oversight | Early |
| Rule-based chatbots | Small short-term effects | Available |
| Clinician support | Growing use | Needs human checking |
:::

## 4.6 Module test [core]
:::mcq
Q: Which conference endorsed the practitioner-scholar model?
- Boulder
- Swampscott
- Bethel
- *Vail
> Vail, 1973, leading to the PsyD.

Q: Engel's model was first presented as a challenge to:
- *The biomedical model
- Positive psychology
- Behaviourism
- The Health Belief Model
> He argued the biomedical model was too narrow.

Q: A woman delays a breast examination because the clinic is far and she would lose a day's wages. In the HBM, this is:
- Perceived severity
- Perceived susceptibility
- *Perceived barriers
- Cue to action
> Practical costs are barriers.

Q: Which is a criticism of the Transtheoretical Model?
- It has no stages
- *Its stage boundaries are arbitrary and stage-matching shows weak benefits
- It was developed only in India
- It ignores relapse completely
> A common critique in the literature.

Q: Ryff's model of psychological wellbeing includes:
- *Environmental mastery
- Positive affect
- Life satisfaction only
- Low negative affect
> One of Ryff's six eudaimonic dimensions.

Q: Fairness, teamwork and leadership belong to which VIA virtue?
- Humanity
- Courage
- *Justice
- Temperance
> Civic strengths under justice.

Q: Herzberg would predict that improving office air-conditioning will:
- Strongly motivate employees
- *Reduce dissatisfaction but not create motivation
- Have no effect at all
- Increase intrinsic motivation
> Working conditions are hygiene factors.

Q: Autonomy and feedback are part of:
- Equity theory
- Goal-setting theory
- The Managerial Grid
- *The job characteristics model
> Two of the five core job characteristics.

Q: A leader who pays individual attention to each follower's growth shows which transformational component?
- Idealised influence
- Intellectual stimulation
- *Individualised consideration
- Inspirational motivation
> Coaching and personal attention.

Q: In Leventhal's model, "Will this illness last forever?" concerns:
- *Timeline
- Identity
- Cause
- Consequences
> Beliefs about duration.

Q: According to gate control theory, anxiety and attention to pain tend to:
- Close the gate
- Have no effect
- Act only on the immune system
- *Open the gate, increasing pain
> Brain messages can open or close the gate.

Q: The Kauai Longitudinal Study is associated with:
- Seligman
- *Emmy Werner
- Fredrickson
- Tedeschi
> Werner followed children born in 1955.

Q: Which PTG domain is "I feel much stronger than I thought I was"?
- Appreciation of life
- New possibilities
- Relating to others
- *Personal strength
> Personal strength.

Q: The positivity ratio was criticised because:
- *Its mathematical basis was invalid
- It was too small
- It applied only to children
- It was never published
> Its mathematical claims were withdrawn.

Q: Unspoken beliefs that really guide behaviour in an organisation are, in Schein's model:
- Artefacts
- *Basic underlying assumptions
- Espoused values
- Hygiene factors
> The deepest level of culture.

Q: Evaluating training by whether employees act differently at work is Kirkpatrick's level of:
- Reaction
- Learning
- *Behaviour
- Results
> Level three.

Q: Kelly's ecological principles do NOT include:
- Interdependence
- *Unconditional positive regard
- Cycling of resources
- Succession
> That is a Rogerian concept.

Q: Training non-specialists to deliver psychological care is called:
- *Task sharing
- Indicated prevention
- Assimilation
- Process consultation
> As in the MANAS and Healthy Activity Programme trials.

Q: A migrant who drops her own language and customs to fit in completely is showing:
- Integration
- Separation
- Marginalisation
- *Assimilation
> Adopting the new culture without keeping the heritage culture.

Q: Which term describes how gender, caste and class combine to shape experience?
- Androgyny
- Gender schema
- *Intersectionality
- Gender similarities
> Crenshaw's term.

Q: The contact hypothesis works best when groups have:
- Unequal status
- *Equal status and common goals with institutional support
- Competitive goals
- No interaction
> Allport's conditions.

Q: A packed festival ground feels joyful, but a packed hospital corridor feels unbearable. This illustrates:
- *The difference between density and crowding
- That density always causes stress
- Territoriality
- Attention restoration
> Crowding is the subjective experience.

Q: Being away, extent, soft fascination and compatibility describe:
- Behaviour settings
- Personal space zones
- Social dilemmas
- *Restorative environments
> Attention restoration theory.

Q: Leading questions after an event that distort memory demonstrate:
- Weapon focus
- Own-race bias
- *The misinformation effect
- Internalised confession
> Loftus's work.

Q: The PEACE model is an approach to:
- Risk assessment
- *Investigative interviewing
- Lineup construction
- Insanity evaluation
> Information-gathering interviews.

Q: Under the JJ Act 2015, a 17-year-old accused of a heinous offence can be tried as an adult only after:
- *A preliminary assessment of mental and physical capacity by the Juvenile Justice Board
- A polygraph test
- An IQ test alone
- The consent of the victim
> With help from psychologists or other experts.

Q: An athlete whose performance suddenly collapses as worry and arousal rise together fits:
- Drive theory
- The inverted-U
- Reversal theory
- *The catastrophe model
> A sudden drop when cognitive anxiety is high.

Q: Instructional self-talk is most helpful for:
- Endurance running
- Weightlifting
- *Precision tasks such as a free throw
- Sprinting
> Instructional cues aid fine skills; motivational cues aid strength and endurance.

Q: Trolling under an anonymous username is an example of:
- Benign disinhibition
- FOMO
- Active mediation
- *Toxic disinhibition
> Harmful behaviour enabled by anonymity.

Q: Reducing distracting decorations on a slide to help learning follows Mayer's principle of:
- *Coherence
- Modality
- Segmenting
- Multimedia
> Cut extraneous material.

Q: Which is the most responsible use of AI by a clinical psychology trainee?
- Pasting identifiable client notes into a public chatbot
- Replacing supervision with a chatbot
- *Practising interviews with a simulated patient and reviewing them with a supervisor
- Copying AI-written reports without checking
> Human oversight and no identifiable data.

Q: Holland's RIASEC model is used mainly in:
- Forensic assessment
- *Career counselling
- Rehabilitation after stroke
- Sports imagery
> Matching people and work environments.
:::
`;
