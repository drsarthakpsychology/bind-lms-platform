import type { LongQA } from "@/lib/prep/long-types";

const S = "learning-motivation-emotion" as const;

export const LEARNING_MOTIVATION_EMOTION_L05: LongQA[] = [
  {
    id: "lme-l05-041",
    subject: S,
    topic: "emotional-intelligence",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is emotional intelligence? Compare the ability and mixed models, discuss how it is measured, and evaluate the evidence on whether it predicts important outcomes.",
    plan: ["Origins and definition", "Mayer and Salovey's ability model", "Mixed models: Goleman, Bar-On", "Measurement", "Predictive validity and critiques", "Indian research and conclusion"],
    answer: `## Origins and definition
Peter Salovey and John Mayer introduced the term emotional intelligence (EI) in 1990, defining it as the ability to perceive, understand, use and manage emotions in oneself and others. Daniel Goleman's popular book "Emotional Intelligence" in 1995 made the idea widely known, claiming it could matter more than IQ for success, a claim that went far beyond the evidence.

## The ability model
Mayer and Salovey's four-branch model treats EI as a set of mental abilities, related to but distinct from general intelligence:
- Perceiving emotions: recognising emotions in faces, voices, pictures and oneself.
- Using emotions to facilitate thought: harnessing moods to aid creativity or problem-solving.
- Understanding emotions: knowing how emotions combine, change and arise (for example, that irritation can grow into rage).
- Managing emotions: regulating one's own and others' emotions to achieve goals.
The branches are hierarchical, from basic perception to complex management.

## Mixed models
- Goleman's model includes self-awareness, self-regulation, motivation, empathy and social skills, mixing abilities with personality traits and competencies.
- Reuven Bar-On's model of emotional-social intelligence includes intrapersonal and interpersonal skills, stress management, adaptability and general mood.
- Trait EI (K. V. Petrides) treats EI as a constellation of self-perceptions at the lower levels of personality.

## Measurement
- Ability tests: the Mayer Salovey Caruso Emotional Intelligence Test (MSCEIT) presents tasks such as identifying emotions in faces or choosing the most effective way to handle a situation, scored against expert or consensus norms.
- Self-report: the Bar-On Emotional Quotient Inventory, the Trait Emotional Intelligence Questionnaire, the Schutte scale.
- In India, scales such as the one by Anukool Hyde, Sanjyot Pethe and Upinder Dhar are widely used.
Ability and self-report measures correlate only weakly, suggesting they measure different things.

## Predictive validity
- Ability EI predicts some aspects of social functioning, relationship quality and leadership, and adds a small amount of prediction of job performance beyond IQ and personality, especially in jobs with high emotional labour (Dana Joseph and Daniel Newman's meta-analysis).
- Trait EI correlates with wellbeing, mental health and lower stress, partly because it overlaps with neuroticism and extraversion.
- EI training programmes in schools and workplaces (social-emotional learning) show modest improvements in emotional skills, behaviour and academic achievement, as Joseph Durlak's meta-analysis of school programmes found.

## Critiques
- Edwin Locke argued EI is not a true intelligence but a set of skills, and that its definition is too broad.
- Mixed models overlap heavily with personality traits, especially the Big Five.
- Scoring "correct" emotional answers by consensus is debatable.
- Claims that EI matters more than IQ are not supported.
- Self-reports are open to faking in selection.

## Conclusion
Emotional intelligence is best supported as a set of abilities to perceive, use, understand and manage emotions, distinct from but modestly related to IQ. Its practical value is real but smaller than popular claims, and mixed models are better seen as personality and competency frameworks.`,
    keyPoints: ["Salovey and Mayer origin and definition", "Four-branch ability model", "Goleman and Bar-On mixed models", "MSCEIT versus self-report measures", "Predictive validity evidence with meta-analyses", "Critiques including overlap with personality", "Indian measures"],
    module: "motivation-emotion/3-1",
    visuals: [
      { kind: "layers", caption: "The ability model", data: { title: "Mayer and Salovey's four branches", shape: "stack", layers: [{ label: "Managing emotions", detail: "Regulating one's own and others' feelings." }, { label: "Understanding emotions", detail: "How emotions blend and change." }, { label: "Using emotions", detail: "Moods that help thinking." }, { label: "Perceiving emotions", detail: "Reading faces, voices and oneself." }] } },
    ],
    ref: "Salovey and Mayer 1990; Mayer, Salovey and Caruso 2004; Goleman 1995; Bar-On 1997; Petrides and Furnham 2001; Joseph and Newman 2010; Durlak et al 2011; Locke 2005; Hyde, Pethe and Dhar 2002",
  },
  {
    id: "lme-l05-042",
    subject: S,
    topic: "emotion-physiology",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on the polygraph and lie detection.",
    plan: ["What a polygraph measures", "Question techniques", "Accuracy and problems", "Legal position in India"],
    answer: `## What it measures
The polygraph records several physiological indicators of autonomic arousal at the same time: heart rate and blood pressure, breathing rate, and skin conductance (sweating). It does not detect lies directly; it detects arousal, on the assumption that lying produces more arousal than telling the truth.

## Techniques
- The control question test compares responses to relevant questions ("Did you take the money?") with responses to control questions designed to cause mild anxiety in everyone ("Before age 25, did you ever steal anything?"). Larger responses to relevant questions are interpreted as deception.
- The guilty knowledge (concealed information) test, developed by David Lykken, asks about details only the culprit would know ("Was the weapon a knife, a gun or a rope?"). A guilty person shows greater arousal to the correct option. It has a stronger scientific basis.

## Accuracy and problems
- Innocent people may be highly anxious, producing false positives; a National Academy of Sciences review in 2003 concluded that polygraph accuracy is well above chance but far from perfect and inadequate for security screening.
- Countermeasures, such as pressing the toes or biting the tongue during control questions, or using sedatives, can defeat the test.
- Examiner expectations influence interpretation.
- Newer methods, such as fMRI lie detection and brain fingerprinting with ERPs, face similar problems.

## Legal position in India
In Selvi v. State of Karnataka in 2010, the Supreme Court held that involuntary administration of polygraph, narco-analysis and brain mapping tests violates the right against self-incrimination and personal liberty. Such tests may be conducted only with consent, and their results are not admissible as evidence by themselves.`,
    keyPoints: ["Measures arousal, not lies", "Control question versus guilty knowledge test", "False positives and countermeasures", "Scientific review conclusion", "Selvi judgment in India"],
    module: "motivation-emotion/3-1",
    visuals: [
      { kind: "compare", caption: "Techniques", data: { title: "Two polygraph methods", a: { label: "Control question test", points: ["Compares relevant and control questions", "Anxious innocent people may fail", "Weak scientific basis"], summary: "Widely used, error-prone." }, b: { label: "Concealed information test", points: ["Asks about details only the culprit knows", "Innocent people react equally to all options", "Stronger basis"], summary: "More defensible." } } },
    ],
    ref: "Lykken 1959 and 1998; National Research Council 2003 The Polygraph and Lie Detection; Selvi v State of Karnataka 2010 7 SCC 263",
  },
  {
    id: "lme-l05-043",
    subject: S,
    topic: "emotion-cognition",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the effects of emotion on cognition, including attention, memory, judgement and decision-making. Illustrate with research and clinical examples.",
    plan: ["Emotion and cognition as interacting systems", "Attention: capture and narrowing", "Memory: enhancement, mood congruence, state dependence", "Judgement: mood as information, affect heuristic", "Decision-making: somatic markers, risk", "Positive emotion and broaden-and-build; clinical relevance"],
    answer: `## Interacting systems
Older views treated emotion as interfering with rational thought. Modern research shows that emotion and cognition are deeply integrated: emotions guide attention, enhance memory for important events, inform judgements and are necessary for good decisions, though they can also bias them.

## Attention
- Emotional stimuli capture attention: threatening faces or words are detected faster in visual search, and emotional words are less affected by the attentional blink. The amygdala enhances processing of emotional stimuli in sensory cortex.
- Arousal narrows attention: Easterbrook's hypothesis and weapon focus in eyewitnesses, where attention to a weapon reduces memory for the face.
- Anxiety produces attentional bias to threat, shown in dot probe and emotional Stroop tasks, maintaining anxiety disorders.

## Memory
- Emotional enhancement: emotional events are remembered better and longer, partly through amygdala modulation of hippocampal consolidation via stress hormones. Larry Cahill found that propranolol, a beta-blocker, removed the memory advantage for the emotional part of a story.
- Central versus peripheral details: emotion enhances memory for central details and sometimes impairs peripheral ones.
- Flashbulb memories are vivid and confident but not necessarily accurate.
- Mood-congruent memory: Gordon Bower found that people in a happy mood recall more happy memories and those in a sad mood more sad ones; depressed patients selectively recall negative events, which maintains low mood.
- Mood-dependent memory: information learned in one mood is recalled better in the same mood, though effects are inconsistent.
- Trauma: extreme stress can produce fragmented, intrusive memories in PTSD.

## Judgement
- Mood as information: Norbert Schwarz and Gerald Clore found that people called on sunny days reported higher life satisfaction than on rainy days, but the effect disappeared when the interviewer first asked about the weather, because people could attribute their mood to the weather. People use their current feelings as information about unrelated judgements.
- Affect heuristic: Paul Slovic showed that people judge risks and benefits by their feelings: if something feels good (natural foods), it is judged low in risk and high in benefit.
- Mood and processing style: happy moods promote heuristic, top-down, creative processing; sad moods promote more systematic, detailed processing, sometimes reducing biases such as the fundamental attribution error (Joseph Forgas's affect infusion model).
- Specific emotions matter: Jennifer Lerner found that fear increases risk perception, while anger reduces it and increases certainty.

## Decision-making
- Antonio Damasio's somatic marker hypothesis: bodily emotional signals mark options as good or bad and guide decisions. Patients with ventromedial prefrontal damage, such as Elliot, reason normally but make poor real-life decisions. In the Iowa gambling task, normal participants develop anticipatory skin conductance responses to risky decks before they consciously know which decks are bad.
- Emotions such as regret and disappointment are anticipated and influence choices.
- Hot versus cold states: George Loewenstein's empathy gap shows that people in a calm state underestimate how emotions such as craving, sexual arousal or anger will affect their behaviour.
- In ultimatum games, unfair offers activate the insula and are rejected despite financial loss.

## Positive emotions
Barbara Fredrickson's broaden-and-build theory proposes that positive emotions broaden attention and thought-action repertoires, encouraging exploration and creativity, and build lasting resources such as skills, relationships and resilience. Alice Isen found that a small gift or a funny film improved creative problem solving, such as the Duncker candle problem.

## Clinical relevance
- Depression: negative biases in attention, interpretation and memory, overgeneral memory and rumination, targeted by cognitive therapy.
- Anxiety: threat bias and catastrophic interpretation of ambiguous events.
- Bipolar disorder: elevated mood increases risky decisions.
- Addiction: craving states distort decisions.
- Borderline personality disorder: intense emotion impairs executive control.
- Therapies such as CBT, cognitive bias modification and mindfulness work at this interface.

## Conclusion
Emotion shapes what we attend to, remember, judge and choose. These effects are often adaptive, focusing cognition on what matters, but can create biases that maintain psychological disorders. Understanding the emotion-cognition interaction is central to both basic psychology and therapy.`,
    keyPoints: ["Integration of emotion and cognition", "Attentional capture and weapon focus", "Emotional memory enhancement with Cahill", "Mood-congruent memory with Bower", "Mood as information with Schwarz and Clore", "Affect heuristic and specific emotions", "Somatic markers and Iowa gambling task", "Broaden-and-build and clinical relevance"],
    module: "motivation-emotion/3-1",
    visuals: [
      { kind: "experiment", caption: "Judgement", data: { title: "Mood as information", question: "Life satisfaction ratings on sunny and rainy days (out of 10, approximate)?", unit: "", max: 10, conditions: [{ label: "Sunny day", value: 7.4 }, { label: "Rainy day", value: 5.0 }, { label: "Rainy day, asked about the weather first", value: 7.0 }], why: "People used their mood as information unless they could attribute it to the weather." } },
    ],
    ref: "Schwarz and Clore 1983; Bower 1981; Cahill et al 1994; Slovic et al 2002; Lerner and Keltner 2001; Forgas 1995; Damasio 1994; Bechara et al 1997; Fredrickson 2001; Isen, Daubman and Nowicki 1987; Loewenstein 2005",
  },
  {
    id: "lme-l05-044",
    subject: S,
    topic: "emotion-culture",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "How does culture shape emotional experience and expression? Discuss with reference to research on Indian and other cultures.",
    plan: ["Universal and cultural aspects", "Display rules and expression norms", "Emotion concepts and words across languages", "Ideal affect and self-construal", "Indian research", "Clinical implications"],
    answer: `## Universal and cultural aspects
Emotions have biological foundations, but culture shapes which situations elicit them, how they are appraised, which emotions are valued, how they are expressed and how they are understood and named. Batja Mesquita describes emotions as cultural practices as well as biological responses.

## Display rules
Cultures have norms about expressing emotion. David Matsumoto found that Japanese participants endorsed displaying negative emotions to in-group members less than Americans did, while Americans were more likely to show negative emotion freely. In many Indian families, open expression of anger towards elders is discouraged, while displays of affection between spouses in public may be restrained.

## Emotion concepts across languages
- Languages divide emotional experience differently. German "Schadenfreude" (pleasure at another's misfortune), Japanese "amae" (pleasure of depending on another's kindness), Portuguese "saudade" (longing) and Tahitian lack of a word for sadness, as Robert Levy reported, illustrate culturally elaborated or underemphasised emotions.
- A large study of emotion words in nearly 2,500 languages by Joshua Jackson and colleagues found that emotion concepts vary widely in meaning, though valence and arousal organise them in all languages.

## Ideal affect and self-construal
- Jeanne Tsai's ideal affect research found that Americans tend to value high-arousal positive states (excitement), while East Asians value low-arousal positive states (calm). This affects choices of leisure, consumer products and even what makes a doctor seem trustworthy.
- Hazel Markus and Shinobu Kitayama's self-construal theory: in independent cultures, ego-focused emotions such as pride and anger are emphasised; in interdependent cultures, other-focused emotions such as shame, sympathy and feelings of closeness are emphasised and serve social harmony.

## Indian research
- Lajja: Usha Menon and Richard Shweder studied lajja among Hindu women in Bhubaneswar, an emotion combining shame, modesty and restraint, expressed by biting the tongue, regarded positively as a sign of civilised self-control and associated with the goddess Kali's gesture in iconography.
- Rasa theory in the Natyashastra describes aesthetic emotions such as shringara and karuna, and abhinaya codifies expression in dance and drama.
- Bhakti traditions value intense devotional emotions.
- Somatic expression: Indian patients often express distress through bodily idioms such as "tension", "sinking heart" (described among Punjabis by Krause), "gas" or weakness, rather than psychological terms.
- Collectivism: emotions are often experienced in relation to family honour (izzat) and social roles. Studies with Indian students show that shame and guilt are tied to family expectations around exam results.

## Clinical implications
- Depression in India commonly presents with somatic symptoms, which can lead to underdiagnosis in primary care.
- Assessment tools developed in Western contexts may miss local idioms of distress; the DSM-5 Cultural Formulation Interview helps clinicians explore them.
- Therapies may need to work with family emotion norms, such as expressed emotion in families of people with schizophrenia, which tends to be lower in India and has been linked to better outcomes in WHO studies.
- Emotion regulation strategies such as suppression may be less harmful where restraint is valued.

## Conclusion
Culture shapes emotional experience at every level, from words and appraisals to display rules and ideal states. Indian research on lajja, rasa and somatic idioms of distress illustrates both the universality and the cultural specificity of emotion, with important implications for clinical practice.`,
    keyPoints: ["Biological base with cultural shaping", "Display rules evidence", "Emotion words across languages", "Ideal affect and self-construal", "Lajja research", "Somatic idioms of distress in India", "Clinical implications including expressed emotion"],
    module: "motivation-emotion/2-6",
    visuals: [
      { kind: "compare", caption: "Ideal affect and self-construal", data: { title: "Independent versus interdependent emotion", a: { label: "Independent cultures", points: ["Value excitement", "Pride and anger emphasised", "Open expression"], summary: "Emotions about me." }, b: { label: "Interdependent cultures", points: ["Value calm", "Shame, sympathy, closeness emphasised", "Restraint before elders"], summary: "Emotions about us." } } },
    ],
    ref: "Mesquita 2022 Between Us; Matsumoto 1990; Tsai 2007; Markus and Kitayama 1991; Menon and Shweder 1994; Krause 1989 sinking heart; Jackson et al 2019 Science; Jenkins and Karno 1992 expressed emotion across cultures",
  },
  {
    id: "lme-l05-045",
    subject: S,
    topic: "intrinsic-motivation",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "A Class 9 teacher in a government school says most of her students are disengaged and do not complete homework. She plans to give chocolates for every completed assignment. As a psychologist, how would you advise her, using theories of motivation?",
    plan: ["Assess before intervening", "Evaluate the reward plan using operant theory and SDT", "Build intrinsic motivation through autonomy, competence and relatedness", "Use goals, attributions and self-efficacy", "Address barriers and evaluate"],
    answer: `## Assess first
Disengagement has many causes. Before advising rewards, find out why students are not doing homework: tasks too difficult or too easy, unclear instructions, no place or time to study at home (many students in government schools do housework or paid work), lack of support from parents, poor relationships with the teacher, fear of failure, or learning difficulties. A brief survey, talks with students and checking reading levels would guide the plan.

## Evaluating the chocolate plan
- Operant conditioning suggests that immediate, tangible rewards can increase homework completion in the short term, especially for students with little initial interest, and token systems have worked in classrooms.
- But self-determination theory and the overjustification effect warn that expected, tangible rewards given for doing a task can undermine intrinsic motivation, especially for tasks that are interesting. Students may do the minimum, focus on quantity over quality, and stop when rewards stop.
- Chocolates also raise health and fairness issues, and students may compare and feel excluded.
- Advice: rewards may help briefly to establish a routine, but should be small, linked to effort and progress rather than mere completion, include praise and feedback (informational rather than controlling), and be faded over time.

## Building intrinsic motivation
Using self-determination theory:
- Autonomy: give choices (which problems to attempt, topics for projects), explain why the homework matters, use non-controlling language ("you might try" rather than "you must").
- Competence: set tasks at the right level of difficulty, break them into steps, give specific feedback, show progress (for example a class chart of improvement).
- Relatedness: show warmth and interest in students, use peer study groups, and involve parents positively.
Make homework meaningful: link to students' lives, such as calculating costs at the local market or writing about their village.

## Goals, attributions and self-efficacy
- Goal-setting: help students set specific, achievable weekly goals and review them.
- Attributions (Weiner): when students fail, encourage controllable explanations ("you need a better strategy") rather than ability ("you are weak").
- Growth mindset (Dweck): praise effort and strategies rather than intelligence.
- Self-efficacy (Bandura): provide early successes, peer models who succeed, and encouragement.
- Achievement motivation: moderate challenges suit success-oriented students; anxious students need reassurance.

## Addressing barriers
- Offer time and space for homework in school (a supervised study period) for students without study space at home.
- Identify students with learning difficulties for assessment and support, as provided under the Rights of Persons with Disabilities Act 2016.
- Reduce excessive homework load.

## Evaluate
Track homework completion and quality, engagement and test scores over a term, and ask students for feedback. Adjust the plan.

## Conclusion
A purely reward-based plan may produce short-term compliance but weaken intrinsic motivation. A better approach combines careful assessment, small informational rewards that are faded, and a classroom that supports autonomy, competence and relatedness, with meaningful tasks and adaptive attributions.`,
    keyPoints: ["Assesses causes first including socioeconomic barriers", "Applies operant principles to the reward plan", "Overjustification and SDT critique", "Autonomy, competence and relatedness strategies", "Goal-setting, attributions and self-efficacy", "Practical barriers and learning difficulties", "Evaluation plan"],
    module: "motivation-emotion/2-2",
    visuals: [
      { kind: "decide", caption: "Evaluating the chocolate plan", data: { scene: "Homework completion in Class 9 is low. The teacher has three options.", ask: "Which plan is most likely to build lasting motivation?", choices: [{ label: "A chocolate for every completed assignment, all year", verdict: "harm", outcome: "Quick rise, then dependence and minimal effort; drop when rewards stop.", why: "Expected tangible rewards can undermine intrinsic motivation." }, { label: "Shame students who do not submit", verdict: "harm", outcome: "Fear, avoidance and lying.", why: "Punishment and humiliation damage relatedness and motivation." }, { label: "Tasks at the right level, choices, specific feedback, a progress chart and a study period in school", verdict: "best", outcome: "Gradual, lasting improvement.", why: "Supports autonomy, competence and relatedness, and removes barriers." }] } },
    ],
    ref: "Deci, Koestner and Ryan 1999; Reeve 2009 autonomy-supportive teaching; Weiner 1985; Dweck 2006; Bandura 1997; RPwD Act 2016",
  },
  {
    id: "lme-l05-046",
    subject: S,
    topic: "incentive",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "md-psychiatry"],
    question: "Write a short note on the incentive salience theory of addiction.",
    plan: ["Wanting versus liking", "Evidence", "Sensitisation and addiction", "Implications"],
    answer: `## Wanting versus liking
Kent Berridge and Terry Robinson proposed that reward has separable components:
- Liking: the pleasurable impact of a reward, mediated by opioid and endocannabinoid "hotspots" in the nucleus accumbens and ventral pallidum.
- Wanting (incentive salience): the motivational pull that makes a reward and its cues attractive and attention-grabbing, mediated mainly by dopamine.
Normally they go together, but they can be dissociated.

## Evidence
- Rats with almost all dopamine destroyed still show normal facial "liking" reactions to sugar (licking lips) but no longer work to obtain it.
- Increasing dopamine in the nucleus accumbens increases how hard animals work for a reward without increasing liking reactions.
- In humans, dopamine-boosting drugs increase wanting for rewards more than pleasure.

## Sensitisation and addiction
Repeated use of addictive drugs sensitises dopamine systems, so drug cues become hyper-salient and trigger intense craving ("wanting"), even as the pleasure from the drug ("liking") stays the same or declines through tolerance. This explains why people with addiction may compulsively seek drugs they no longer enjoy, and why cues such as places, people or paraphernalia trigger relapse years after stopping. Sensitisation can be long-lasting.

## Implications
Treatment should target cue-triggered craving, through cue exposure, avoiding triggers, mindfulness of urges and medications that reduce craving. Similar processes may underlie behavioural addictions such as gambling disorder, where reward-predicting cues gain salience.`,
    keyPoints: ["Wanting versus liking defined", "Neurochemical basis", "Dopamine depletion evidence", "Sensitisation of wanting with tolerance of liking", "Cue-triggered relapse and treatment implications"],
    module: "motivation-emotion/1-1",
    visuals: [
      { kind: "compare", data: { title: "Wanting versus liking in addiction", a: { label: "Wanting", points: ["Dopamine driven", "Grows with repeated use (sensitisation)", "Triggered by cues"], summary: "The craving rises." }, b: { label: "Liking", points: ["Opioid hotspots", "Stays the same or falls (tolerance)", "The pleasure itself"], summary: "The enjoyment fades." } } },
    ],
    ref: "Robinson and Berridge 1993 and 2008; Berridge and Kringelbach 2015",
  },
  {
    id: "lme-l05-047",
    subject: S,
    topic: "operant-conditioning",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Interview question: \"A 15-year-old boy in a residential home repeatedly hits his head when asked to do school work. How would you use learning principles to understand and reduce this behaviour?\"",
    plan: ["Ensure safety and rule out medical causes", "Functional behaviour assessment: ABC recording", "Possible functions and hypothesis", "Intervention based on function", "Ethics, monitoring and closing"],
    answer: `## Start with safety and assessment
"First I would ensure his safety, check for injuries and rule out medical causes, such as pain, ear infection or seizures, and assess his developmental level, communication, any intellectual disability, autism or mood problems. Self-injury is behaviour that communicates something."

## Functional behaviour assessment
Using operant principles, I would ask what the behaviour achieves for him. I would interview staff and teachers, and record ABC data for one or two weeks:
- Antecedents: what happens just before (being given a worksheet, a particular subject, noise, a particular staff member, time of day).
- Behaviour: what exactly he does, how often and how intensely.
- Consequences: what happens after (the task is removed, staff comfort him, he is sent to his room).
Brian Iwata's functional analysis identifies four main functions of self-injury:
- Escape or avoidance: the demand is removed, negative reinforcement.
- Attention: staff come and talk to him, positive social reinforcement.
- Tangible: he gets an item or activity.
- Automatic: the behaviour itself produces sensation or relief.

## Hypothesis
Since the behaviour occurs when school work is presented, a likely hypothesis is escape: hitting his head ends or delays the demand, which negatively reinforces the behaviour. Perhaps the work is too hard, he cannot read well, or he has had repeated failure. If staff also give a lot of attention, attention may be a second function.

## Intervention based on function
- Change antecedents: assess his academic level and give work matched to it; break tasks into small steps; offer choices of order or materials; give advance warning; mix easy and hard tasks (behavioural momentum); create a calm setting.
- Teach a replacement behaviour that serves the same function: functional communication training, teaching him to ask for a break or for help, using words, a card or a gesture, and honour these requests at first.
- Change consequences: avoid removing the task immediately after head-hitting (escape extinction), while ensuring safety, perhaps with protective equipment if needed and guidance through the task; give breaks contingent on effort or appropriate requests instead.
- Differential reinforcement of alternative behaviour: praise and reward work attempts and appropriate requests; gradually increase the work required before a break.
- If attention is also a function, give attention on a regular, non-contingent schedule and for appropriate behaviour, while minimising reactions to head-hitting.
- Address underlying factors: reading support, assessment for learning disability, mood and trauma history, and involve him in the plan as far as possible.

## Ethics and monitoring
- Use the least restrictive, positive methods; avoid punishment, seclusion or restraint except in emergencies, consistent with the Mental Healthcare Act 2017 and child protection guidelines.
- Obtain consent from his guardian and his own assent.
- Train all staff to respond consistently; expect an extinction burst at first and plan for it.
- Monitor frequency and severity weekly on a graph and review the plan.

## Closing
"In short, I would treat head-hitting as learned behaviour that probably helps him escape difficult work. By making the work manageable, teaching him a safer way to ask for help or a break, and stopping reinforcement of self-injury, the behaviour should reduce, while I look after his wider needs."`,
    keyPoints: ["Safety and medical causes first", "ABC recording", "Four functions of self-injury", "Escape hypothesis with negative reinforcement", "Antecedent changes", "Functional communication training", "Escape extinction and differential reinforcement", "Ethics, consistency and monitoring"],
    module: "learning-memory/2-2",
    visuals: [
      { kind: "flow", caption: "Hypothesis", data: { title: "ABC of the head-hitting", layout: "chain", nodes: [{ id: "a", label: "Antecedent", detail: "Worksheet he cannot read is handed out." }, { id: "b", label: "Behaviour", detail: "Hits his head on the desk." }, { id: "c", label: "Consequence", detail: "Work is taken away: escape." }, { id: "r", label: "Result", detail: "Head-hitting is negatively reinforced and repeats." }] } },
    ],
    ref: "Iwata et al 1982/1994 functional analysis; Carr and Durand 1985 functional communication training; Cooper, Heron and Heward Applied Behavior Analysis; MHCA 2017 s.97",
  },
  {
    id: "lme-l05-048",
    subject: S,
    topic: "emotion-fear",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "md-psychiatry"],
    question: "Distinguish fear from anxiety. Discuss the learning, cognitive and neurobiological processes involved in fear and anxiety, and how they explain anxiety disorders.",
    plan: ["Define fear and anxiety and their differences", "Functions and the defence cascade", "Learning: conditioning, avoidance, observational and informational pathways", "Cognitive processes", "Neurobiology", "Integration into models of anxiety disorders, conclusion"],
    answer: `## Definitions
- Fear is an immediate emotional response to a present, identifiable threat, with a surge of sympathetic arousal and a strong urge to escape or fight, such as fear on seeing a snake on the path.
- Anxiety is a future-oriented state of apprehension about possible threat, often vague or uncertain, with worry, muscle tension, vigilance and preparation, such as anxiety the night before an exam.
DSM-5 describes fear as the emotional response to real or perceived imminent threat and anxiety as anticipation of future threat.

## Comparison
| Feature | Fear | Anxiety |
| Threat | Present, specific | Future, uncertain |
| Time course | Rapid onset, short | Gradual, sustained |
| Physiology | Fight or flight surge | Tension, vigilance, worry |
| Behaviour | Escape, freeze, fight | Avoidance, caution, checking |
| Neural core | Central amygdala | Bed nucleus of the stria terminalis (extended amygdala) |
| Clinical example | Specific phobia, panic attack | Generalised anxiety disorder |

## Functions and the defence cascade
Both are adaptive. They mobilise the body and focus attention on danger. Defensive responses vary with threat distance (predatory imminence theory of Michael Fanselow): at a distance, vigilance and freezing; closer, flight or fight; at contact, tonic immobility. Anxiety becomes a disorder when it is excessive, persistent, out of proportion and interferes with life.

## Learning processes
- Classical conditioning: neutral stimuli associated with danger become conditioned fear stimuli (Little Albert, interoceptive conditioning in panic).
- Avoidance learning: Mowrer's two-factor theory explains how avoidance is negatively reinforced and prevents extinction.
- Observational learning: Susan Mineka's monkeys acquired fear of snakes by watching another monkey's fear.
- Informational learning: being told that something is dangerous; Andy Field found that children given threatening information about an unfamiliar animal showed increased fear and avoidance.
- Preparedness: fears of evolutionarily relevant threats are learned more readily.
- Extinction failure and return of fear: spontaneous recovery, renewal and reinstatement explain relapse.
- Overgeneralisation: anxious people generalise fear to stimuli only loosely resembling the threat.

## Cognitive processes
- Threat appraisal: Aaron Beck proposed that anxiety arises from overestimating danger and underestimating coping resources.
- Attentional bias to threat and interpretive bias (reading ambiguous situations as dangerous).
- Catastrophic misinterpretation: David Clark's model of panic, in which bodily sensations such as palpitations are misread as signs of a heart attack, which increases anxiety and sensations in a vicious cycle.
- Intolerance of uncertainty and worry as avoidance of emotional processing in GAD (Michel Dugas, Thomas Borkovec).
- Safety behaviours prevent disconfirmation.
- Low perceived control: David Barlow's model emphasises uncontrollability and unpredictability.

## Neurobiology
- The amygdala detects threat and triggers fear via the hypothalamus and brainstem; the bed nucleus of the stria terminalis mediates sustained anxiety to uncertain threat.
- The ventromedial prefrontal cortex supports extinction recall and inhibits fear; its weaker function is linked to anxiety disorders and PTSD.
- The hippocampus encodes context, helping decide whether a situation is safe; deficits contribute to overgeneralisation.
- The insula supports interoception and is overactive in anxiety.
- Neurotransmitters: GABA (benzodiazepines enhance it), serotonin (SSRIs are first-line treatments), noradrenaline from the locus coeruleus, and corticotropin-releasing hormone in the stress response.
- Genetics: anxiety disorders are moderately heritable (around 30 to 50 percent); behavioural inhibition in infancy (Jerome Kagan) predicts later anxiety.

## Integration in anxiety disorders
- Specific phobia: conditioning or vicarious learning of a prepared fear, maintained by avoidance.
- Panic disorder: interoceptive conditioning plus catastrophic misinterpretation of bodily sensations.
- Social anxiety disorder: fear of negative evaluation, self-focused attention and safety behaviours (Clark and Wells).
- GAD: worry, intolerance of uncertainty and sustained BNST-related anxiety.
- PTSD: fear conditioning to trauma cues, impaired extinction, overgeneralisation and hippocampal and prefrontal changes.
Diathesis-stress models combine biological vulnerability (temperament, genes), psychological vulnerability (low sense of control from early experience) and specific learning experiences, as in Barlow's triple vulnerability theory.

## Treatment links
Exposure therapy uses extinction and inhibitory learning; cognitive therapy targets threat appraisals; SSRIs and, briefly, benzodiazepines act on neurochemistry; mindfulness and acceptance approaches change the relationship with anxious thoughts.

## Conclusion
Fear is a response to present danger and anxiety to possible future danger. Both are adaptive but can become disorders through conditioning, avoidance, cognitive biases and neural vulnerabilities. Integrated models of learning, cognition and neurobiology explain anxiety disorders and guide effective treatments.`,
    keyPoints: ["Clear distinction with comparison table", "Defence cascade or adaptive function", "Conditioning, avoidance, observational and informational learning", "Return of fear and overgeneralisation", "Cognitive models including Clark's panic model", "Amygdala, BNST, vmPFC and hippocampus roles", "Disorder-by-disorder integration", "Triple vulnerability and treatment links"],
    module: "motivation-emotion/3-1",
    visuals: [
      { kind: "flow", caption: "Cognitive processes", data: { title: "Clark's vicious circle of panic", layout: "cycle", nodes: [{ id: "t", label: "Trigger", detail: "Climbing stairs, a warm room." }, { id: "s", label: "Bodily sensations", detail: "Racing heart, breathlessness." }, { id: "m", label: "Catastrophic thought", detail: "'I'm having a heart attack.'" }, { id: "a", label: "Anxiety rises", detail: "More sensations follow." }] } },
      { kind: "compare", caption: "Comparison", data: { title: "Fear versus anxiety", a: { label: "Fear", points: ["Snake on the path now", "Sudden surge, short", "Central amygdala"], summary: "Present danger." }, b: { label: "Anxiety", points: ["What if the exam goes badly?", "Slow, sustained worry and tension", "Bed nucleus of the stria terminalis"], summary: "Possible danger." } } },
    ],
    ref: "APA DSM-5-TR; Fanselow 1994; Mineka et al 1984; Field 2006; Beck, Emery and Greenberg 1985; Clark 1986; Clark and Wells 1995; Barlow 2002; Davis et al 2010 BNST; Kagan 1994; Craske et al 2014",
  },
  {
    id: "lme-l05-049",
    subject: S,
    topic: "learning-theories",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "\"All learning is the formation of stimulus-response connections.\" Critically evaluate this statement in the light of behaviourist, cognitive, social cognitive and biological approaches to learning.",
    plan: ["Unpack the S-R claim and its origins", "Evidence supporting S-R accounts", "Cognitive challenges: Tolman, insight, contingency, prediction", "Social cognitive challenges: Bandura", "Biological and neural perspectives", "Modern integrative view and conclusion"],
    answer: `## The claim
The statement expresses the stimulus-response (S-R) view of learning associated with Edward Thorndike's connectionism, John Watson's behaviourism and Clark Hull's drive theory. On this view, learning is the strengthening of bonds between specific stimuli and specific responses through practice and reinforcement, without any need for mental representations. Evaluating it requires asking whether all forms of learning can be reduced to such connections.

## Evidence supporting S-R accounts
- Thorndike's cats gradually stamped in the response of pulling the string, and his law of effect described the strengthening of connections by satisfying consequences.
- Pavlov's dogs formed conditioned reflexes, which Pavlov interpreted as new stimulus-response links in the brain.
- Hull's theory predicted learning curves mathematically from habit strength built by reinforced repetitions.
- Many habits seem to be S-R links: after overtraining, rats press a lever even when the food reward has been devalued (made unpleasant), showing habitual, stimulus-driven behaviour, as Anthony Dickinson showed. Habits in humans, such as reaching for a phone, are triggered by cues regardless of current goals.
- The striatum supports S-R habit learning, and addiction may involve a shift from goal-directed to habitual drug seeking.

## Cognitive challenges
- Latent learning: Tolman and Honzik's rats learned a maze without reward, revealing knowledge only when food was introduced. What was learned was a cognitive map, not specific responses.
- Place learning and detours: rats took new, shortest routes they had never practised, which a chain of S-R links cannot explain.
- Insight: Kohler's chimpanzees solved problems suddenly by restructuring the situation, not by gradual strengthening.
- Contingency and prediction: Rescorla showed that pairing alone is not enough; conditioning depends on whether the CS predicts the US. Kamin's blocking showed that redundant stimuli are not learned. Learning is about information and expectation (stimulus-stimulus associations), not connection by contiguity.
- Sensory preconditioning: animals learn associations between two neutral stimuli with no response involved.
- Outcome devaluation: in moderately trained animals, devaluing the reward reduces responding immediately, showing that the animal represents the outcome (a response-outcome association), not just S-R links.
- Human learning involves language, rules, concepts, understanding and reasoning; much of school learning is meaningful learning (David Ausubel) linked to existing knowledge.
- Chomsky's critique showed that language acquisition cannot be explained by S-R learning.

## Social cognitive challenges
- Bandura's Bobo doll studies showed that children learn complex behaviour by observation, without performing it or being reinforced (no-trial learning).
- The learning-performance distinction: reinforcement influences whether learned behaviour is shown, not whether it is learned.
- Self-efficacy, expectations and self-regulation guide behaviour.
- Reciprocal determinism: people actively choose and shape their environments.

## Biological challenges
- Biological constraints: taste aversion after a single trial with long delays, preparedness for certain fears and instinctive drift show that learning is not a neutral process of forming any connection; evolution prepares specific associations.
- Imprinting and critical periods: Konrad Lorenz's goslings followed the first moving object they saw within a sensitive period.
- Neural evidence: the hippocampus supports relational, flexible memory (cognitive maps), the striatum supports habits, and dopamine prediction error signals (Wolfram Schultz) implement learning from expectation. Multiple learning systems exist.

## Modern integrative view
- Dual systems: research on goal-directed and habitual control shows both are real. Early in learning, behaviour is goal-directed (response-outcome, with representations of goals); with extensive practice, it can become habitual (S-R). The S-R view is therefore correct for habits but not for all learning.
- Reinforcement learning theory distinguishes model-based learning (using a cognitive model of the environment) and model-free learning (caching values of actions, similar to S-R), and humans use both.
- Learning includes non-associative learning (habituation), associative learning (classical and operant), observational learning, cognitive learning (concepts, maps, insight), and verbal and rule learning.
- Indian educational thought has long emphasised understanding and reflection, such as the Upanishadic sequence of shravana (listening), manana (reflection) and nididhyasana (contemplation), rather than mechanical repetition.

## Evaluation of the statement
The statement is too strong. S-R connections describe some learning, especially habits and simple conditioned reflexes, and the S-R tradition gave psychology precise methods and powerful applications. But much learning involves representations of stimuli, outcomes, spaces, rules and other people's actions; it can occur without reinforcement or overt responses; and it is shaped by biology.

## Conclusion
Learning is not one process. Stimulus-response connections are one important form, central to habits, but cognitive, social and biological research shows that organisms learn expectations, maps, concepts and observed behaviour. Modern theories integrate these into multiple, interacting learning systems.`,
    keyPoints: ["Explains the S-R claim and its theorists", "Evidence for S-R including habits and outcome devaluation after overtraining", "Latent learning and cognitive maps", "Insight and contingency or blocking", "Bandura's no-trial learning and learning-performance distinction", "Biological constraints and imprinting", "Goal-directed versus habitual dual systems", "Balanced judgement on the statement"],
    pitfalls: ["Only listing theories without judging the statement", "Ignoring evidence that habits are genuinely S-R"],
    module: "learning-memory/2-4",
    visuals: [
      { kind: "compare", caption: "Evidence supporting S-R accounts", data: { title: "Goal-directed action versus habit", a: { label: "Goal-directed", points: ["Represents the outcome", "Stops when the reward is devalued", "Hippocampus and prefrontal cortex"], summary: "Response to outcome." }, b: { label: "Habit", points: ["Triggered by cues", "Continues even after devaluation", "Dorsal striatum"], summary: "Stimulus to response." } } },
      { kind: "timeline", caption: "Cognitive challenges", data: { prompt: "Order these challenges to stimulus-response theory.", events: [{ label: "Kohler's insight in chimpanzees", when: "1917 to 1925" }, { label: "Tolman and Honzik's latent learning", when: "1930" }, { label: "Bandura's Bobo doll studies", when: "1961 to 1965" }, { label: "Garcia's taste aversion", when: "1966" }, { label: "Rescorla's contingency and Kamin's blocking", when: "1968 to 1969" }] } },
    ],
    ref: "Thorndike 1898; Hull 1943; Tolman 1948; Kohler 1925; Rescorla 1968; Kamin 1969; Bandura 1965; Garcia and Koelling 1966; Dickinson 1985 outcome devaluation; Daw, Niv and Dayan 2005; Schultz 1997; Ausubel 1968",
  },
  {
    id: "lme-l05-050",
    subject: S,
    topic: "operant-conditioning",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on shaping.",
    plan: ["Define shaping", "Steps", "Examples", "Uses and cautions"],
    answer: `## Meaning
Shaping is an operant technique for teaching a new behaviour by reinforcing successive approximations: responses that come closer and closer to the target behaviour. It is used when the target behaviour is unlikely to occur spontaneously, so it cannot be reinforced directly. B. F. Skinner used it to teach animals complex behaviours.

## Steps
- Define the target behaviour clearly.
- Identify a starting behaviour that the learner already shows and that resembles the target.
- Reinforce that starting behaviour.
- Raise the criterion gradually: reinforce only responses that come closer to the target, and stop reinforcing earlier approximations (differential reinforcement).
- Move in small steps; if the learner struggles, return to the previous step.
- Reinforce immediately and consistently.

## Examples
- Teaching a rat to press a lever: reinforce turning towards the lever, then approaching it, then touching it, then pressing it.
- Teaching speech to a non-verbal child with autism: reinforce any vocal sound, then sounds close to "ma", then "ma", then "mama", as in Ivar Lovaas's applied behaviour analysis.
- Rehabilitation after stroke: reinforcing gradually longer walking distances.
- Increasing a withdrawn patient's social interaction, from eye contact to greeting to conversation.
- Sports coaching and teaching handwriting.
- Animal training for circuses, sniffer dogs and assistance dogs.

## Uses and cautions
Shaping is powerful, flexible and positive. It requires careful observation and patience. Problem behaviours can also be shaped accidentally, for example when parents give in only to louder and longer tantrums, gradually reinforcing more severe tantrums.`,
    keyPoints: ["Definition with successive approximations", "Ordered steps", "Rat lever example", "Clinical examples such as autism or rehabilitation", "Accidental shaping of problem behaviour"],
    module: "learning-memory/2-2",
    visuals: [
      { kind: "timeline", caption: "Examples", data: { prompt: "Put the shaping steps for teaching a child to say 'mama' in order.", events: [{ label: "Reinforce any vocal sound" }, { label: "Reinforce sounds starting with 'm'" }, { label: "Reinforce 'ma'" }, { label: "Reinforce 'mama'" }] } },
    ],
    ref: "Skinner 1953; Lovaas 1987; Atkinson and Hilgard ch 7",
  },
];
