import type { LongQA } from "@/lib/prep/long-types";
import { anchored, brain, chain, compare, layers, tree, vis } from "./visual";

const S = "personality-theories" as const;

export const PERSONALITY_THEORIES_L03: LongQA[] = anchored([
  {
    id: "pers-l03-001",
    subject: S,
    topic: "existential",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Discuss the existential approach to personality with reference to Rollo May, Viktor Frankl and Irvin Yalom. How does it differ from the humanistic approach?",
    plan: ["Roots in existential philosophy", "Basic concepts: being in the world and modes", "Rollo May", "Viktor Frankl", "Yalom's four givens", "Comparison and evaluation"],
    answer: `## Roots
Existential psychology grew from the philosophy of Soren Kierkegaard, Friedrich Nietzsche, Martin Heidegger and Jean Paul Sartre, who argued that human beings are not fixed things but beings who must create themselves through choice, facing anxiety, freedom and death. European psychiatrists such as Ludwig Binswanger and Medard Boss applied these ideas to therapy, and Rollo May brought them to America.

## Basic concepts
- Being in the world, Dasein: a person cannot be understood apart from the world they live in; self and world form a unity.
- Three modes of being in the world:
1. Umwelt: the biological and physical world.
2. Mitwelt: the world of relationships with others.
3. Eigenwelt: the world of one's relation to oneself.
- Non being: awareness of death, which gives life its urgency.
- Authenticity: living according to one's own choices rather than conforming to others, which Heidegger called fallenness.

## Rollo May
- Anxiety is the experience of the threat of non being. Normal anxiety is proportionate to the threat, does not involve repression and can be used constructively. Neurotic anxiety is out of proportion, repressed and destructive.
- Guilt arises from failing to fulfil one's potential, from separation from others and from separation from nature.
- The daimonic: any natural function, such as sex, anger or the urge for power, that can either create or destroy depending on whether it is integrated.
- Love and will: modern people have lost the capacity for both; healthy living unites them.
- Courage is needed to face anxiety and to create, as described in his work on the courage to create.

## Viktor Frankl
Frankl, a Viennese psychiatrist, survived Auschwitz and other camps, where he observed that those who found meaning, such as hope of seeing a loved one or finishing a book, were more likely to survive.
- The will to meaning is the primary human motive, more basic than Freud's will to pleasure or Adler's will to power.
- Meaning can be found in three ways: through creating a work or doing a deed, through experiencing something or loving someone, and through the attitude we take towards unavoidable suffering.
- The existential vacuum: a sense of emptiness and boredom common in modern life, which may lead to depression, addiction and aggression.
- Logotherapy uses techniques such as paradoxical intention, asking a person to wish for the feared outcome, for example a man who fears sweating is asked to try to sweat as much as possible, and dereflection, turning attention away from oneself.

## Irvin Yalom
Yalom, an American psychiatrist, described four ultimate concerns, or givens, of existence:
| Given | Conflict | Typical defence |
| Death | Awareness of death against the wish to live | Belief in personal specialness or an ultimate rescuer |
| Freedom | Responsibility for one's life against the wish for structure | Avoiding decisions, blaming others |
| Existential isolation | Being alone in the universe against the wish for connection | Fusion with others, compulsive relationships |
| Meaninglessness | The need for meaning in a universe without given meaning | Compulsive activity, nihilism |
Therapy helps people face these concerns and live more fully. Yalom's work on group therapy is also widely used.

## Comparison with humanistic psychology
| Humanistic | Existential |
| Human nature is basically good and growth oriented | No fixed human nature; we create ourselves |
| Emphasis on self actualisation | Emphasis on choice, responsibility and authenticity |
| Optimistic | More tragic: anxiety, death and isolation are central |
| Rooted in American psychology | Rooted in European philosophy |
Both share a focus on the whole person, subjective experience, freedom and the here and now.

## Indian parallels
The Bhagavad Gita begins with Arjuna's existential crisis on the battlefield, and Buddhist teaching starts from suffering and impermanence, showing that these concerns are universal.

## Evaluation
The existential approach addresses the deepest human concerns and has influenced therapies for terminal illness, grief and meaning centred care. Research on meaning in life, by Michael Steger and others, finds that presence of meaning predicts wellbeing. However, concepts are philosophical and hard to measure, and the approach offers few testable predictions.

## Conclusion
Existential psychology sees personality as shaped by how we face death, freedom, isolation and meaninglessness. May, Frankl and Yalom turned philosophy into a psychology of courage and meaning.`,
    keyPoints: ["Philosophical roots and Dasein", "Umwelt, Mitwelt, Eigenwelt", "May: normal versus neurotic anxiety, daimonic, love and will", "Frankl: will to meaning, three sources, existential vacuum", "Paradoxical intention and dereflection", "Yalom's four givens with defences", "Comparison with humanistic psychology", "Evaluation and Indian parallels"],
    pitfalls: ["Treating existential and humanistic as the same", "Listing names without concepts"],
    module: "personality-theories/2-4",
    visuals: [
      tree("Irvin Yalom", [["Ultimate concerns", "Four givens", -1], ["Death", "Life is finite", 0], ["Freedom", "We are responsible", 0], ["Isolation", "We are alone", 0], ["Meaninglessness", "No given meaning", 0]]),
      compare("Comparison with humanistic psychology", ["Humanistic", ["Basically good nature", "Self actualisation", "Optimistic"], "Growth"], ["Existential", ["No fixed nature", "Choice and authenticity", "Faces death and anxiety"], "Courage and meaning"]),
    ],
    ref: "May 1953, 1969 Love and Will, 1975 The Courage to Create; May, Angel and Ellenberger 1958; Frankl 1946 Man's Search for Meaning; Yalom 1980 Existential Psychotherapy; Steger et al 2006 MLQ; personality-theories module 2.4",
  },
  {
    id: "pers-l03-002",
    subject: S,
    topic: "kelly",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Explain George Kelly's personal construct theory. Describe the fundamental postulate, constructs, the Role Construct Repertory Test and Kelly's view of anxiety and therapy.",
    plan: ["The person as scientist", "Constructive alternativism and the fundamental postulate", "Constructs and corollaries", "The Rep test", "Emotions, disorder and therapy"],
    answer: `## The person as scientist
George Kelly, an American psychologist, proposed in 1955 that every person behaves like a scientist: forming theories about the world, testing them and revising them. Personality is the system of personal constructs a person uses to make sense of experience.

## Constructive alternativism
The world can be interpreted in many ways; no one is a victim of their history, because events can always be reconstrued. The fundamental postulate states that a person's processes are psychologically channelised by the ways in which he anticipates events. We act on what we expect.

## Constructs
- A construct is a bipolar dimension of meaning, such as friendly versus hostile, or ambitious versus lazy. The contrast is whatever the person sees as its opposite, which may be unusual, such as friendly versus intelligent.
- Constructs have a range of convenience, the events they apply to.
- Kelly set out eleven corollaries. Examples:
1. Construction: we anticipate events by noticing repeated themes.
2. Individuality: people differ in their constructions of events.
3. Organisation: constructs are arranged in a hierarchy.
4. Dichotomy: constructs are bipolar.
5. Experience: constructs change as we meet new events.
6. Commonality: people who construe similarly are psychologically similar.
7. Sociality: to relate to someone, we must construe their constructions.

## The Role Construct Repertory Test
In the Rep test, people list important figures in their lives, such as mother, a liked teacher, a disliked person and themselves. They are shown three at a time and asked how two are alike and different from the third. The answers reveal the person's constructs, which can be arranged in a repertory grid and analysed statistically. The grid is used in clinical work, career counselling and organisational research.

## Emotions and disorder
Kelly redefined emotions in terms of constructs:
- Anxiety: awareness that events lie outside the range of convenience of one's constructs.
- Threat: awareness of an impending comprehensive change in core constructs.
- Guilt: awareness of having acted against one's core role.
- Hostility: trying to force evidence to fit a construct that has already failed.
Disorder is any construction used repeatedly despite consistent invalidation.

## Therapy
In fixed role therapy, the therapist writes a sketch of a new character, and the client acts this role for about two weeks, experimenting with new ways of construing. Therapy is a collaborative experiment, anticipating cognitive therapy.

## Evaluation
Kelly's theory is original, respects individual meaning and gave a useful tool in the repertory grid. It neglects emotion as a direct force and says little about development and motivation.

## Conclusion
Kelly pictured people as scientists of their own lives, and personality as their system of constructs.`,
    keyPoints: ["Person as scientist", "Constructive alternativism and fundamental postulate", "Bipolar constructs and range of convenience", "Key corollaries", "Rep test and repertory grid", "Anxiety, threat, guilt, hostility redefined", "Fixed role therapy", "Evaluation"],
    pitfalls: ["Calling constructs traits", "No Rep test description"],
    module: "personality-theories/2-6",
    visuals: [chain("The Role Construct Repertory Test", [["List key people", "Mother, teacher, self"], ["Take three at a time", "Triads"], ["How are two alike", "Construct pole"], ["How is the third different", "Contrast pole"], ["Repertory grid", "Map of constructs"]])],
    ref: "Kelly 1955 The Psychology of Personal Constructs; Fransella and Bannister 1977 repertory grid; personality-theories module 2.6",
  },
  {
    id: "pers-l03-003",
    subject: S,
    topic: "social-cognitive",
    marks: 20,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Critically discuss Bandura's social cognitive theory of personality, with reference to reciprocal determinism, observational learning, self efficacy, self regulation and moral disengagement.",
    plan: ["From behaviourism to social cognition", "Reciprocal determinism", "Observational learning", "Self efficacy and its sources", "Self regulation and moral disengagement", "Applications and evaluation"],
    answer: `## From behaviourism to social cognition
Albert Bandura, a Canadian psychologist at Stanford, began within learning theory but argued that people are not passive products of reinforcement. They think, anticipate, observe others and regulate themselves. He called his approach social learning theory, later social cognitive theory, and described humans as agents who influence their own lives.

## Reciprocal determinism
Bandura proposed triadic reciprocal determinism: personal factors, such as beliefs, expectations and emotions; behaviour; and the environment all influence one another.
- A student who believes she is good at mathematics, a personal factor, studies more, behaviour, and is placed in an advanced class, environment, which strengthens her belief.
- A shy boy avoids parties, so he gets fewer chances to practise social skills, which keeps him anxious.
This differs from both trait theories, which see behaviour as caused by the person, and behaviourism, which sees it as caused by the environment.

## Observational learning
People learn by watching models, without doing anything themselves or receiving reinforcement. The Bobo doll studies showed children copying aggressive acts. Four processes are needed:
1. Attention: the model must be noticed; attractive, powerful and similar models draw more attention.
2. Retention: the behaviour is stored in memory as images and words.
3. Reproduction: the learner must be able to perform it.
4. Motivation: reinforcement, direct, vicarious or self administered, decides whether it is performed.
Learning and performance are separate: the children who saw the model punished still learned the acts and performed them when offered rewards.

## Self efficacy
Self efficacy is the belief in one's ability to organise and carry out the actions needed to achieve a goal. It is task specific, not general self esteem. High self efficacy leads people to set higher goals, try harder, persist after failure and feel less anxious.
Four sources, in order of strength:
| Source | Example |
| Mastery experiences | Successfully giving a short presentation in class |
| Vicarious experiences | Seeing a classmate like oneself succeed |
| Verbal persuasion | A teacher saying "You can do this" |
| Physiological and emotional states | Interpreting a racing heart as excitement rather than fear |
Self efficacy predicts success in quitting smoking, recovering from heart attack, academic performance and job performance. Collective efficacy is the shared belief of a group, such as a village panchayat, that it can achieve change.

## Self regulation
People regulate their behaviour through three subfunctions:
1. Self observation: monitoring one's behaviour.
2. Judgement: comparing it with personal standards and those of others.
3. Self reaction: rewarding or criticising oneself.
Standards are learned from models. People feel pride when they meet them and self censure when they fall short.

## Moral disengagement
Bandura explained how ordinary people do harmful things without guilt by disengaging self sanctions through:
- Moral justification: "We are fighting for our religion."
- Euphemistic labelling: "collateral damage".
- Advantageous comparison: "Others do much worse."
- Displacement and diffusion of responsibility: "I was ordered to", "Everyone did it."
- Distorting consequences: "No one was really hurt."
- Dehumanising and blaming victims: "They are animals", "They asked for it."
This helps explain corruption, communal violence and cruelty in institutions.

## Applications
- Modelling therapies for phobias: participant modelling, in which the therapist models approaching a feared object, such as a snake, and guides the client step by step, was highly effective in Bandura's studies.
- Health promotion: entertainment education, such as television serials modelling family planning or HIV prevention, used in India and Africa.
- Education: teachers as models and building students' efficacy.
- Workplace training through behavioural modelling.

## Evaluation
Strengths:
- Based on careful experiments and highly testable.
- Explains learning without direct reinforcement.
- Self efficacy is one of the most researched and useful constructs in psychology.
- Broad applications in therapy, health and education.
Weaknesses:
- Gives less attention to biological factors, emotions and unconscious processes.
- The theory is less a unified system than a set of related principles.
- Reciprocal determinism is hard to test as a whole.
- Laboratory studies, such as the Bobo doll, may not reflect real aggression.

## Conclusion
Bandura replaced the passive learner with an active agent who observes, believes and regulates. Social cognitive theory explains how personality develops through interaction with others and how it can be changed.`,
    keyPoints: ["Agentic view moving beyond behaviourism", "Triadic reciprocal determinism with examples", "Four processes of observational learning", "Learning versus performance", "Self efficacy and its four sources", "Self regulation subfunctions", "Mechanisms of moral disengagement", "Applications and evaluation"],
    pitfalls: ["Confusing self efficacy and self esteem", "Missing the four sources"],
    module: "personality-theories/2-5",
    visuals: [
      layers("Reciprocal determinism", "rings", [["Personal factors", "Beliefs, expectations, emotions"], ["Behaviour", "What the person does"], ["Environment", "People, places, rewards"]]),
      chain("Observational learning", [["Attention", "Notice the model"], ["Retention", "Store images and words"], ["Reproduction", "Be able to do it"], ["Motivation", "Reinforcement decides performance"]]),
      vis("sort", { prompt: "Which source of self efficacy is it?", buckets: ["Mastery", "Vicarious", "Persuasion", "Physiological"], items: [{ text: "Passing a mock interview", bucket: 0 }, { text: "Watching a friend from the same village crack an interview", bucket: 1 }, { text: "A mentor saying you are ready", bucket: 2 }, { text: "Reading a racing heart as excitement", bucket: 3 }] }, "Self efficacy"),
    ],
    ref: "Bandura 1977 self-efficacy, 1986 Social Foundations of Thought and Action, 1997 Self-Efficacy; Bandura, Ross and Ross 1961, 1963; Bandura 1999 moral disengagement; Bandura, Blanchard and Ritter 1969 participant modelling; personality-theories module 2.5",
  },
  {
    id: "pers-l03-004",
    subject: S,
    topic: "rotter",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Explain Rotter's social learning theory and the concept of locus of control. What has research shown about locus of control?",
    plan: ["Rotter's theory", "Behaviour potential formula", "Locus of control", "Measurement", "Research and evaluation"],
    answer: `## Rotter's theory
Julian Rotter, an American psychologist, combined learning theory with cognition in the 1950s. He held that behaviour depends not only on reinforcement but on what people expect will happen and how much they value the outcome.

## The basic formula
Behaviour potential = f (expectancy and reinforcement value)
- Behaviour potential: the likelihood of a behaviour in a situation.
- Expectancy: the person's subjective belief that the behaviour will lead to the reinforcement.
- Reinforcement value: how much the person values that outcome.
- The psychological situation: the situation as the person sees it.
Example: a student studies late at night if she expects it to improve her marks and if she values marks highly.

## Locus of control
Rotter proposed a generalised expectancy about whether outcomes depend on one's own actions:
- Internal locus of control: belief that outcomes depend on one's own effort and ability.
- External locus of control: belief that outcomes depend on luck, fate, chance or powerful others.
It is a continuum, not a type.

## Measurement
Rotter's Internal External scale of 1966 has 29 forced choice items, 23 scored and 6 fillers, such as choosing between "People's misfortunes result from the mistakes they make" and "Many of the unhappy things in people's lives are partly due to bad luck". Hanna Levenson separated external control into chance and powerful others. Health specific scales measure beliefs about health. Indian versions have been developed.

## Research findings
- Internals tend to seek information, achieve more at school and work, resist social pressure and engage in healthier behaviours such as exercise and quitting smoking.
- Externals report more anxiety and depression and are more vulnerable to stress.
- Belief in control helps in controllable situations, but in uncontrollable ones, such as terminal illness, an excessively internal belief can lead to self blame.
- Research in India finds that belief in karma and fate can coexist with internal control: people may attribute outcomes to both effort and destiny, and fate beliefs can help acceptance of illness.
- Locus of control became more external among American young people over decades, according to studies by Jean Twenge.

## Evaluation
The theory is testable and practical, and locus of control is widely used. However, the scale mixes different domains, and the idea of a single generalised expectancy may be too broad.

## Conclusion
Rotter showed that expectancies and values guide behaviour. Locus of control remains one of the most studied personality variables.`,
    keyPoints: ["Expectancy and reinforcement value", "Behaviour potential formula with example", "Psychological situation", "Internal versus external locus of control", "I E scale 1966 and Levenson's scale", "Research findings on achievement and health", "Indian views of karma and control", "Evaluation"],
    pitfalls: ["Calling locus of control a type", "Confusing it with self efficacy"],
    module: "personality-theories/2-5",
    visuals: [compare("Locus of control", ["Internal", ["My effort decides my marks", "Seeks information", "Healthier behaviour"], "I control outcomes"], ["External", ["Luck or teachers decide", "More anxiety", "More vulnerable to stress"], "Others or fate control outcomes"])],
    ref: "Rotter 1954, 1966; Levenson 1974 IPC; Wallston et al MHLC; Twenge, Zhang and Im 2004; personality-theories module 2.5",
  },
  {
    id: "pers-l03-005",
    subject: S,
    topic: "learning-approaches",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Describe the behavioural approach to personality with reference to Skinner and to Dollard and Miller. Evaluate the approach.",
    plan: ["Behavioural view of personality", "Skinner", "Dollard and Miller's four concepts", "Conflict", "Evaluation"],
    answer: `## The behavioural view
Behaviourists argue that personality is not an inner structure but the sum of learned behaviours. To understand a person, we study their learning history and the current conditions that control their behaviour.

## Skinner
B F Skinner rejected inner causes as explanatory fictions. Personality is a repertoire of behaviours shaped by consequences through operant conditioning:
- Positive and negative reinforcement strengthen behaviour; punishment and extinction weaken it.
- Schedules of reinforcement explain persistence: behaviour rewarded intermittently, like gambling, is hard to extinguish.
- Shaping explains how complex behaviours develop step by step.
- Generalisation and discrimination explain consistency and difference across situations.
A child who gets attention only when throwing tantrums becomes a demanding person; one praised for sharing becomes generous. Skinner's ideas led to behaviour modification, token economies and applied behaviour analysis.

## Dollard and Miller
John Dollard and Neal Miller at Yale combined Clark Hull's learning theory with psychoanalysis in the 1940s. They translated Freud's ideas into learning terms. Four concepts explain learning:
1. Drive: a strong stimulus that impels action, primary, like hunger, or secondary, learned, like fear or the need for money.
2. Cue: a stimulus that guides when and where to respond.
3. Response: the behaviour.
4. Reinforcement: drive reduction, which strengthens the link between cue and response.
Habits are learned cue response links. Fear is a learned drive, and reducing fear reinforces avoidance, explaining phobias and repression as learned not thinking.

## Conflict
They described three kinds of conflict:
| Type | Example | Result |
| Approach approach | Two good job offers | Easy to resolve |
| Avoidance avoidance | Study for a hard test or fail it | Escape or vacillation |
| Approach avoidance | Wanting to marry a person the family dislikes | Vacillation near the goal |
The avoidance gradient is steeper than the approach gradient, so as the goal nears, fear rises faster than desire, causing hesitation. They also formulated the frustration aggression hypothesis.

## Evaluation
Strengths: scientific, experimental and highly practical, leading to effective therapies such as exposure and contingency management. Weaknesses: neglects thought, biology and inner experience, reduces personality to behaviour, and relies heavily on animal research. Social cognitive theories later added cognition.

## Conclusion
The behavioural approach explains personality as learned behaviour and gave psychology powerful methods of change.`,
    keyPoints: ["Personality as learned behaviour", "Skinner: operant conditioning, schedules, shaping", "Behaviour modification", "Dollard and Miller: drive, cue, response, reinforcement", "Fear as learned drive and avoidance", "Three conflicts and gradients", "Evaluation"],
    pitfalls: ["Leaving out Dollard and Miller", "No evaluation"],
    module: "personality-theories/2-5",
    visuals: [chain("Dollard and Miller", [["Drive", "Hunger or learned fear"], ["Cue", "When and where"], ["Response", "Behaviour"], ["Reinforcement", "Drive reduction strengthens the habit"]])],
    ref: "Skinner 1953 Science and Human Behavior; Dollard and Miller 1950 Personality and Psychotherapy; Dollard et al 1939; personality-theories module 2.5",
  },
  {
    id: "pers-l03-006",
    subject: S,
    topic: "biological-approaches",
    marks: 15,
    difficulty: 4,
    exams: ["ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"],
    question: "Describe the major biological theories of personality: Gray's reinforcement sensitivity theory, Cloninger's psychobiological model and Zuckerman's sensation seeking. Discuss their evidence and clinical relevance.",
    plan: ["Biological approach", "Gray's reinforcement sensitivity theory", "Cloninger's model", "Zuckerman's sensation seeking", "Brain imaging and evidence", "Clinical relevance and evaluation"],
    answer: `## The biological approach
Biological theories explain personality traits by differences in brain systems, neurotransmitters, hormones and genes. Eysenck began this tradition with arousal; later theorists proposed different systems.

## Gray's reinforcement sensitivity theory
Jeffrey Gray, Eysenck's student, argued that the basic dimensions are sensitivity to reward and to punishment, rotated about 30 degrees from E and N.
- Behavioural activation system, BAS: responds to signals of reward, producing approach and positive emotion. High BAS sensitivity is linked to impulsivity and extraversion.
- Behavioural inhibition system, BIS: in the revised theory of 2000, it resolves conflict between approach and avoidance, producing anxiety, caution and risk assessment. It involves the septo hippocampal system. High BIS sensitivity is linked to anxiety and neuroticism.
- Fight flight freeze system, FFFS: responds to aversive stimuli, producing fear and escape, involving the amygdala and periaqueductal grey.
Charles Carver and Teri White's BIS BAS scales measure these. Anti anxiety drugs reduce BIS activity in animals, supporting the theory.

## Cloninger's psychobiological model
Robert Cloninger proposed four temperament dimensions, each linked to a neurotransmitter system and heritable:
| Temperament | Description | Proposed system |
| Novelty seeking | Exploratory, impulsive, quick tempered | Dopamine |
| Harm avoidance | Worrying, shy, easily tired | Serotonin |
| Reward dependence | Sentimental, attached, dependent on approval | Noradrenaline |
| Persistence | Industrious, determined | Later separated from reward dependence |
And three character dimensions that develop through learning and maturity: self directedness, cooperativeness and self transcendence. The Temperament and Character Inventory measures all seven. Personality disorders are described as combinations of temperament with low character maturity. Early genetic studies linking novelty seeking to the dopamine D4 receptor gene were not consistently replicated.

## Zuckerman's sensation seeking
Marvin Zuckerman defined sensation seeking as the seeking of varied, novel, complex and intense experiences, and the willingness to take risks for them. His scale has four subscales:
1. Thrill and adventure seeking, such as skydiving.
2. Experience seeking, through travel, music and unusual lifestyles.
3. Disinhibition, through parties, drinking and sex.
4. Boredom susceptibility.
High sensation seekers show low platelet monoamine oxidase, strong orienting responses to novel stimuli and higher testosterone. Sensation seeking predicts risky driving, drug use and certain careers, such as emergency work. Zuckerman later proposed an alternative five factor model with impulsive sensation seeking as a factor.

## Brain evidence
- Extraversion is associated with greater reward related activity in the ventral striatum and medial orbitofrontal cortex.
- Neuroticism is associated with stronger amygdala responses to negative stimuli and reduced prefrontal regulation.
- Conscientiousness is linked to the lateral prefrontal cortex, involved in planning.
- Effects in imaging studies are often small and need replication.

## The three theories compared
| Theory | Basic dimensions | Key brain idea |
| Gray | Reward sensitivity, conflict and threat sensitivity | BAS, BIS and FFFS circuits |
| Cloninger | Four temperaments and three character traits | Dopamine, serotonin, noradrenaline |
| Zuckerman | Sensation seeking | Low monoamine oxidase, strong orienting |
All three agree that people differ in how strongly they respond to reward, punishment and novelty, and that these differences appear early as temperament.

## Clinical relevance
- High harm avoidance and BIS sensitivity predict anxiety and depression.
- High novelty seeking and BAS sensitivity predict substance use and impulsive disorders.
- These models help explain why some people respond to reward based treatments and others need anxiety reduction.

## Evaluation
Strengths: they link personality to brain, drugs and genes, and generate testable predictions. Weaknesses: the mapping of single traits to single neurotransmitters is too simple, since each system affects many traits; genetic associations have often failed to replicate; and environment and learning shape these systems.

## Conclusion
Biological theories show that personality is rooted in systems for reward, threat and novelty. They are best seen as part of a biopsychosocial account.`,
    keyPoints: ["Biological approach and Eysenck as origin", "Gray: BAS, BIS and FFFS with brain systems", "BIS BAS scales and drug evidence", "Cloninger's four temperaments and three character dimensions", "TCI and personality disorders", "Zuckerman's four subscales and low MAO", "Imaging findings", "Clinical relevance and evaluation"],
    pitfalls: ["Saying traits are caused by single neurotransmitters", "No evaluation"],
    module: "personality-theories/3-1",
    visuals: [
      compare("Gray's reinforcement sensitivity theory", ["Behavioural activation system", ["Signals of reward", "Approach and hope", "Impulsivity, extraversion"], "Go"], ["Behavioural inhibition system", ["Conflict and threat signals", "Caution and anxiety", "Neuroticism"], "Stop and check"]),
      brain("Brain evidence", { prefrontal: "Planning and regulation; conscientiousness", amygdala: "Strong responses in high neuroticism", "basal-ganglia": "Ventral striatum reward responses in extraversion", hippocampus: "Septo hippocampal system in BIS" }),
    ],
    ref: "Gray 1970, 1987; Gray and McNaughton 2000; Carver and White 1994; Cloninger 1987, Cloninger, Svrakic and Przybeck 1993 TCI; Zuckerman 1979, 1994; DeYoung et al 2010 personality neuroscience; personality-theories module 3.1",
  },
  {
    id: "pers-l03-007",
    subject: S,
    topic: "biological-approaches",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "What do behaviour genetic studies tell us about personality? Discuss twin and adoption studies, the role of shared and non shared environment, gene environment interplay and molecular genetics.",
    plan: ["Methods of behaviour genetics", "Twin and adoption findings", "Shared and non shared environment", "Gene environment correlation and interaction", "Molecular genetics", "Implications"],
    answer: `## Methods
Behaviour genetics estimates how much of the variation in a trait in a population is due to genetic differences. Heritability is the proportion of variance in a trait explained by genetic variance. It applies to populations, not individuals, and can change with environment.
- Twin studies compare identical twins, who share about 100 per cent of their genes, with fraternal twins, who share about 50 per cent on average. If identical twins are more alike, genes are implicated.
- Adoption studies compare adopted children with their biological and adoptive parents.
- Twins reared apart give a natural experiment.

## Findings
- John Loehlin and Robert Nichols studied about 850 twin pairs in 1976 and found identical twin correlations around 0.5 and fraternal around 0.25 on many traits.
- The Minnesota Study of Twins Reared Apart, led by Thomas Bouchard from 1979, found that identical twins raised in different homes were about as similar in personality as those raised together, with heritability around 50 per cent. Striking cases, such as the "Jim twins" who shared hobbies and names of pets, attracted attention, but such anecdotes are less important than the correlations.
- A meta analysis by Marija Vukasovic and Denis Bratko in 2015 of over 100,000 people estimated the heritability of personality at about 40 per cent.
- Each Big Five trait shows heritability of about 40 to 60 per cent.

## Shared and non shared environment
- Shared environment, what makes siblings in the same family similar, such as parenting style, income or religion, contributes very little to adult personality, often near zero. Adoptive siblings raised together are hardly more alike than strangers.
- Non shared environment, experiences unique to each child, such as different friends, illnesses, teachers, birth order and differential treatment, together with measurement error, accounts for most of the remaining variance.
Robert Plomin and Denise Daniels asked why children in the same family are so different, and this question shaped later research.

## Gene environment interplay
- Gene environment correlation:
1. Passive: parents give children both genes and environments, such as a musical parent providing music at home.
2. Evocative: children's traits evoke responses, such as a cheerful baby receiving more smiles.
3. Active: people choose environments that fit their traits, such as an extraverted teenager joining a drama club.
- Gene environment interaction: the effect of genes depends on environment. For example, a variant of the MAOA gene raised the risk of antisocial behaviour mainly in maltreated boys, though some such findings have not replicated consistently.

## Molecular genetics
- Early candidate gene studies, such as linking novelty seeking to the DRD4 gene and neuroticism to the serotonin transporter gene, mostly failed to replicate.
- Genome wide association studies with hundreds of thousands of people show that personality is highly polygenic: thousands of variants each have tiny effects. Polygenic scores currently explain only a few per cent of variance, leaving a gap called the missing heritability.
- Epigenetic mechanisms, changes in gene expression caused by experience, may link early stress to later personality.

## Implications
- Personality has a substantial genetic basis, but genes are not destiny.
- Parenting matters in ways that are child specific and interact with temperament rather than through a uniform family effect.
- In India, where joint families and strong family influence are common, twin research is limited, and more studies are needed to test whether shared environment matters more in such settings.

## Conclusion
Behaviour genetics shows that about 40 to 50 per cent of personality variation is genetic, that shared family environment has surprisingly little lasting effect, and that genes and environments are intertwined.`,
    keyPoints: ["Definition and limits of heritability", "Twin, adoption and reared apart designs", "Loehlin and Nichols; Minnesota study", "Heritability about 40 to 60 per cent; meta analysis about 40 per cent", "Little shared environment; large non shared", "Passive, evocative and active gene environment correlation", "Gene environment interaction", "Polygenic GWAS findings and missing heritability"],
    pitfalls: ["Saying heritability applies to individuals", "Saying parents have no influence at all"],
    module: "personality-theories/3-1",
    visuals: [
      layers("Shared and non shared environment", "stack", [["Genes", "About 40 to 60 per cent of variance"], ["Non shared environment", "Most of the rest, plus error"], ["Shared environment", "Little or none for adult personality"]]),
      vis("sort", { prompt: "Which kind of gene environment correlation?", buckets: ["Passive", "Evocative", "Active"], items: [{ text: "A bookish parent fills the home with books", bucket: 0 }, { text: "A cheerful baby gets more smiles from strangers", bucket: 1 }, { text: "An adventurous teenager joins a trekking club", bucket: 2 }] }, "Gene environment interplay"),
    ],
    ref: "Loehlin and Nichols 1976; Bouchard et al 1990; Plomin and Daniels 1987; Vukasovic and Bratko 2015 meta-analysis; Polderman et al 2015; Caspi et al 2002; Scarr and McCartney 1983; Lo et al 2017 GWAS; personality-theories module 3.1",
  },
  {
    id: "pers-l03-008",
    subject: S,
    topic: "biological-approaches",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "How does evolutionary psychology explain personality and individual differences?",
    plan: ["Why individual differences are a puzzle", "Universal mechanisms", "Explanations for variation", "Sex differences and animal personality", "Evaluation"],
    answer: `## The puzzle
Natural selection tends to remove less useful variants, so why do people differ so much in personality? Evolutionary psychology, led by David Buss and others, offers two kinds of explanation: shared adaptations that all humans have, and reasons why variation persists.

## Universal mechanisms
- All humans evolved to solve problems of survival and reproduction in social groups: getting along, getting ahead and finding mates.
- The Big Five dimensions may reflect the most important differences people need to notice in others: who will be a good ally, leader or mate. Extraversion signals social potency, agreeableness cooperativeness, conscientiousness reliability, emotional stability resilience and openness creativity.

## Why variation persists
1. Balancing selection: each trait has costs and benefits that vary with environment. Daniel Nettle showed that extraverts have more sexual partners and social allies but also more accidents and hospitalisations; neurotic people are more vigilant to danger but suffer more anxiety. No single level is always best.
2. Frequency dependent selection: a strategy pays when it is rare. If most people are cooperative, a few cheaters can do well, which may help explain why a small proportion of people are psychopathic.
3. Life history strategies: harsh, unpredictable environments may favour fast strategies, early reproduction and risk taking; stable environments favour slow strategies, with long investment in learning and children.
4. Mutation selection balance: many tiny harmful mutations accumulate, contributing to variation in traits linked to fitness, such as intelligence.
5. Conditional adaptation: people may calibrate their traits to their own qualities, for example attractive or strong men being more extraverted.

## Sex differences
Evolutionary theorists predict that women, who invest more in offspring, will show more caution and agreeableness, and men more risk taking. Across cultures, women score somewhat higher on neuroticism and agreeableness, and men on assertiveness, with small to moderate differences that are surprisingly larger in more gender equal countries.

## Animal personality
Samuel Gosling and others have shown that animals from octopuses to chimpanzees have consistent personality dimensions, such as boldness and sociability, suggesting deep evolutionary roots.

## Evaluation
Strengths: places personality in a broader biological frame and explains why variation exists. Weaknesses: many explanations are hard to test and can be just so stories; culture strongly shapes trait expression, and evolutionary accounts can be misused to justify social inequality.

## Conclusion
Evolution explains both the shared structure of personality and why individual differences persist: different traits pay in different environments.`,
    keyPoints: ["Puzzle of variation", "Big Five as socially important differences", "Balancing selection with Nettle's costs and benefits", "Frequency dependent selection", "Life history strategies", "Mutation selection balance", "Sex differences and gender equal paradox", "Animal personality and evaluation"],
    pitfalls: ["Presenting speculation as proven"],
    module: "personality-theories/3-2",
    visuals: [compare("Why variation persists", ["Benefits of high extraversion", ["More allies and partners", "Leadership", "Positive mood"], "Rewards"], ["Costs of high extraversion", ["More accidents", "More risk taking", "Less stable relationships"], "Risks"])],
    ref: "Buss 1991, 2009; Nettle 2006; Penke, Denissen and Miller 2007; Figueredo life history; Costa, Terracciano and McCrae 2001 sex differences; Gosling 2001 animal personality; personality-theories module 3.2",
  },
  {
    id: "pers-l03-009",
    subject: S,
    topic: "indian-personality",
    marks: 20,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "cuet-pg"],
    question: "Discuss Indian views of personality, with reference to the triguna theory, the Ayurvedic concept of prakriti and the Indian concept of the self. Compare them with Western theories and review attempts to measure them.",
    plan: ["Indian sources", "Triguna theory", "Prakriti and doshas", "The self: atman, ahamkara and antahkarana", "Measurement and research", "Comparison and evaluation"],
    answer: `## Sources
Indian thought about personality comes from the Upanishads, the Samkhya and Yoga systems, the Bhagavad Gita and Ayurveda. These traditions aim less at describing differences than at guiding people towards a good life and liberation, moksha. Still, they contain detailed accounts of temperament and self.

## The triguna theory
In Samkhya philosophy, prakriti, the material and psychological nature of the world, is made up of three gunas, or qualities, present in everything in different proportions:
| Guna | Nature | Personality features |
| Sattva | Light, purity, balance | Calm, wise, truthful, content, compassionate, self controlled |
| Rajas | Activity, passion, movement | Ambitious, restless, desiring, proud, competitive, easily angered |
| Tamas | Inertia, darkness, heaviness | Lazy, confused, ignorant, careless, depressed, deluded |
The Bhagavad Gita, especially in its fourteenth, seventeenth and eighteenth chapters, describes how the gunas shape food preferences, worship, work, charity and knowledge. All three are present in every person; one usually dominates, and the balance can be changed through diet, conduct and spiritual practice, moving towards sattva and eventually beyond all gunas.

## Prakriti in Ayurveda
Ayurveda, in texts such as the Charaka Samhita, describes three doshas, vata, pitta and kapha, whose balance at conception determines a person's constitution, prakriti:
- Vata, air and space: thin build, quick, creative, restless, anxious under stress.
- Pitta, fire and water: medium build, sharp intellect, ambitious, irritable, prone to anger.
- Kapha, earth and water: heavy build, calm, steady, affectionate, slow, possessive.
Ayurveda also describes manas prakriti, mental constitution, based on the gunas. Treatment and lifestyle are tailored to the person's prakriti, an early form of individualised medicine.

## The self
- Atman: the true self, pure consciousness, identical with Brahman in Advaita Vedanta, unchanging and beyond personality.
- Jiva: the individual embodied self that experiences and acts.
- Antahkarana, the inner instrument, has four parts: manas, the mind that receives and doubts; buddhi, the intellect that decides; ahamkara, the ego or I maker that creates the sense of a separate self; and chitta, the store of memories and impressions.
- The panchakosha model describes five sheaths, from the physical body to the bliss sheath, covering the atman.
- Personality, in this view, is the conditioned, changing part, shaped by samskaras, impressions from past actions, and karma.

## Indian concepts of the social self
Alan Roland, an American psychoanalyst who worked in India, described a familial self, or we self, in which identity is embedded in family and hierarchical relationships, contrasted with the Western individualised I self. Sudhir Kakar wrote about the Indian inner world shaped by close mother child bonds and the joint family. Indian psychologists describe the self as relational and context sensitive.

## Measurement and research
- The Vedic Personality Inventory by David Wolf measures sattva, rajas and tamas with acceptable reliability.
- The Mysore Triguna Scale, developed at an Indian yoga research university, and other Indian triguna scales have been used to study yoga, stress and wellbeing.
- Sattva scores correlate positively with wellbeing, conscientiousness and emotional stability, while tamas scores correlate with neuroticism and depression.
- Ayurvedic prakriti assessment questionnaires have been developed, and a few genetic studies have reported links between prakriti types and gene expression, though this work is preliminary.
- Studies have found that yoga practice can increase sattva scores over weeks.

## Comparison with Western theories
| Indian views | Western theories |
| Aim: liberation and right living | Aim: description and prediction |
| Self beyond personality, pure consciousness | Self as part of personality |
| Qualities can be changed through practice and diet | Traits relatively stable |
| Body and mind linked through doshas | Mostly psychological, some biological |
| Moral and spiritual ideals built in | Value neutral description |
There are parallels: sattva resembles emotional stability and conscientiousness, rajas resembles extraversion and achievement striving, and tamas resembles neuroticism and low conscientiousness. The three doshas recall Greek humoral temperaments and Sheldon's body types.

## Evaluation
Strengths: a holistic view linking body, mind, morality and spirituality; a hopeful view of change; culturally meaningful for Indian clients; growing measurement research. Weaknesses: concepts come from philosophical and religious texts and are hard to define operationally; measures are still being validated; some claims, such as genetic bases of doshas, need much more evidence.

## Conclusion
Indian views see personality as a changing balance of qualities around a deeper, unchanging self, with the aim of growth towards sattva and liberation. They complement Western trait theories and are increasingly being tested empirically.`,
    keyPoints: ["Sources in Samkhya, Gita and Ayurveda", "Three gunas with features", "Gita on gunas in daily life; balance can change", "Vata, pitta and kapha prakriti", "Atman, jiva, antahkarana with four parts, panchakosha", "Roland's familial self and Kakar", "Measurement: Vedic Personality Inventory, Mysore Triguna Scale, research findings", "Comparison with Western theories and evaluation"],
    pitfalls: ["Only describing the gunas", "No measurement or comparison"],
    module: "personality-theories/3-3",
    visuals: [
      tree("The triguna theory", [["Prakriti", "Made of three gunas", -1], ["Sattva", "Calm, wise, balanced", 0], ["Rajas", "Active, ambitious, restless", 0], ["Tamas", "Inert, confused, lazy", 0]]),
      layers("The self", "rings", [["Atman", "Pure consciousness at the centre"], ["Buddhi", "Intellect that decides"], ["Ahamkara", "The I maker"], ["Manas", "Mind that receives and doubts"], ["Chitta", "Store of impressions"]]),
    ],
    ref: "Samkhya Karika; Bhagavad Gita ch 14, 17, 18; Charaka Samhita; Wolf 1998 Vedic Personality Inventory; Mysore Triguna Scale (SVYASA); Roland 1988 In Search of Self in India and Japan; Kakar 1978 The Inner World; Prasher et al 2008 prakriti genomics; personality-theories module 3.3",
  },
  {
    id: "pers-l03-010",
    subject: S,
    topic: "indian-personality",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Is the Indian self different from the Western self? Discuss with reference to independent and interdependent self construals and Indian research.",
    plan: ["The question", "Independent and interdependent self construals", "Indian ideas of the self", "Research evidence", "Implications for personality"],
    answer: `## The question
Most personality theories come from Western, especially American, settings, where the self is assumed to be a bounded, autonomous individual. Cultural psychologists ask whether this is universal.

## Self construals
Hazel Markus and Shinobu Kitayama in 1991 distinguished:
| Independent self | Interdependent self |
| Self is separate and unique | Self is connected to others |
| Defined by inner traits and abilities | Defined by roles and relationships |
| Goals: express oneself, be unique | Goals: fit in, maintain harmony |
| Behaviour consistent across situations | Behaviour changes with context |
| Common in North America and Western Europe | Common in East and South Asia, Africa, Latin America |

## Indian ideas
- Alan Roland described the Indian familial self, a we self with strong emotional ties, heightened sensitivity to others and respect for hierarchy, alongside a private inner self and a spiritual self.
- A K Ramanujan argued that Indian thinking is context sensitive: rules depend on time, place and person, in contrast to universal, context free Western norms.
- Durganand Sinha and Rama Charan Tripathi suggested that Indians hold both individualist and collectivist orientations together, a coexistence of opposites, depending on the situation, rather than being simply collectivist.

## Research evidence
- When asked to complete "I am..." statements, people from India give more social and role based answers, such as "I am a daughter", "I am a Gujarati", than Americans, who give more trait answers, such as "I am friendly", though urban educated Indians also give many trait answers.
- Joan Miller found that Indians saw helping family and friends as a moral duty, not a personal choice.
- Indian adolescents describe autonomy in decision making as compatible with respect for parents.
- Big Five structure replicates in India, showing that trait descriptions are meaningful, though social desirability and family roles influence responses.
- Globalisation, urbanisation and nuclear families are increasing individualist values among young Indians, producing hybrid selves.

## Implications for personality
- Trait measures may underestimate how much Indians vary across roles.
- Self esteem may be based more on family honour and relationships.
- Therapy goals such as individuation from family may need to be reframed as balanced interdependence.

## Conclusion
The Indian self tends to be more relational and context sensitive, while combining independent and interdependent elements, so personality theory must allow for cultural variation.`,
    keyPoints: ["Markus and Kitayama's two self construals", "Comparison table", "Roland's familial self", "Ramanujan's context sensitivity", "Coexistence of individualism and collectivism", "I am statement and moral duty research", "Change with globalisation", "Implications for assessment and therapy"],
    pitfalls: ["Saying all Indians are collectivist", "No research evidence"],
    module: "personality-theories/3-4",
    visuals: [compare("Self construals", ["Independent self", ["Inner traits define me", "Be unique", "Consistent across situations"], "Common in the West"], ["Interdependent self", ["Roles and relationships define me", "Fit in and keep harmony", "Varies with context"], "Common in India and East Asia"])],
    ref: "Markus and Kitayama 1991; Roland 1988; Ramanujan 1989 Is there an Indian way of thinking; Sinha and Tripathi 1994; Miller 1994; Kuhn and McPartland 1954 Twenty Statements Test; personality-theories module 3.3 and 3.4",
  },
]);
