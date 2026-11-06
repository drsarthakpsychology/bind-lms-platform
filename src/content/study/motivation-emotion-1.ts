/* Module · Motivation, emotion and stress, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: why we act and what we feel

## 1.1 What motivation is: push, pull and the body's balance [core][starting]
**Motivation** is whatever starts behaviour, gives it a direction, keeps it going and decides how hard we try. Psychologists usually split it into three measurable parts:
- **Activation**: whether you start at all.
- **Direction**: which goal you choose among many.
- **Intensity and persistence**: how much effort you put in, and for how long.

A motive is never seen directly. We **infer** it from behaviour, the way a doctor infers fever from a thermometer. That is why every theory of motivation is really a theory about what explains the pattern of behaviour we can see.

### Push and pull
The oldest split in the field is between forces that **push** from inside (needs, drives, instincts) and forces that **pull** from outside (incentives, rewards, goals). A hungry student is pushed by hunger and pulled by the smell of vada pav at the college gate. Most real behaviour is both.

### Instinct theory: the first answer
Early psychologists such as **William McDougall** (1908) and William James explained behaviour by listing **instincts**: inborn, unlearned, goal-directed patterns found in every member of a species. McDougall listed instincts like flight, curiosity, pugnacity and parental care, each tied to an emotion.

The theory collapsed for two reasons. First, the lists grew to thousands of "instincts", one for each behaviour. Second, it was **circular**: "Why does he fight? Because of a fighting instinct. How do we know he has one? Because he fights." Naming a behaviour is not explaining it. The idea of inborn, species-wide patterns survived in ethology (fixed action patterns) and later in evolutionary psychology.

### Drive-reduction theory and homeostasis
**Walter Cannon** (1932) coined **homeostasis**: the body keeps internal states such as temperature, blood sugar and water within a narrow range. **Clark Hull** (1943) built a theory on it:
1. A biological **need** (lack of water) creates a **drive**, an unpleasant state of tension (thirst).
2. The drive energises behaviour.
3. Any behaviour that **reduces the drive** is reinforced, so it is learned.

Hull separated **primary drives** (hunger, thirst, pain avoidance, sex) from **secondary (acquired) drives** learned by association, such as the drive for money, which reduces many primary drives. He even wrote it as a formula: the strength of a response depends on habit strength multiplied by drive, so with zero drive, no habit, however strong, produces behaviour.

:::analogy The thermostat
Drive reduction works like an air-conditioner thermostat. When the room drifts away from the set temperature, the machine switches on; once it is back, it switches off. Hunger, thirst and the need for warmth behave a lot like this.
:::

:::widget sort
{
  "prompt": "Push or pull? Sort each force behind the behaviour.",
  "buckets": ["Push from inside (need or drive)", "Pull from outside (incentive)"],
  "items": [
    { "text": "A labourer in Surat drinks two glasses of water after a shift in the sun", "bucket": 0 },
    { "text": "A student studies late because the topper gets a scholarship", "bucket": 1 },
    { "text": "A baby cries when its blood sugar drops", "bucket": 0 },
    { "text": "You order dessert though you are full, because it looks delicious", "bucket": 1, "why": "No need is being reduced; the food's appeal pulls you. Drive theory cannot explain eating when full." },
    { "text": "A runner in Nairobi trains for a medal and a sponsorship deal", "bucket": 1 },
    { "text": "A person in a cold room shivers and looks for a blanket", "bucket": 0 }
  ]
}
:::

### Where drive theory fails
Drive reduction explains eating and drinking well. It cannot explain why people **seek tension**: climbing mountains, watching horror films, solving puzzles for fun, or eating dessert when full. Monkeys will work for nothing more than the chance to look out of a window (Butler, 1953) or open a latch puzzle (Harlow). Those findings pushed the field towards **arousal** and **incentive** theories, which come next.

:::student
Keep a simple picture: **instinct** says "born that way", **drive** says "the body wants balance", and the theories in the next section say "we also want the right amount of stimulation, and we chase rewards".
:::

:::clinician
Hull's hypothetico-deductive system (Principles of Behavior, 1943) was the most formal learning theory of its time: reaction potential as a multiplicative function of habit strength and drive, later extended with incentive motivation (K) after Crespi's (1942) contrast effects showed that rats' running speed tracked reward size immediately, which a pure habit account could not explain. Woodworth (1918) had introduced "drive" earlier. The decline of drive theory came from three directions: stimulus-seeking behaviour (Harlow, Butler, Berlyne), incentive effects independent of need, and the physiological discovery that "drive centres" were circuits for reward and salience rather than for tension reduction. The homeostatic idea remains central for hunger, thirst and thermoregulation, now refined as **allostasis** (anticipatory regulation), which you meet in Part III.
:::

:::recall
1. What three parts of behaviour does motivation explain? || Activation (starting), direction (which goal) and intensity or persistence (how hard and how long).
2. Why did instinct theory fail? || Lists grew without limit, and it was circular: it named behaviours instead of explaining them.
3. State drive-reduction theory in three steps. || A need creates a drive (unpleasant tension); the drive energises behaviour; behaviour that reduces the drive is reinforced and learned.
4. Who coined homeostasis? || Walter Cannon.
:::

:::mcq
Q: A student explains a classmate's habit of helping others by saying, "He has a helping instinct, which we know because he helps." The main weakness of this explanation is that it is:
- Too biological
- *Circular: the behaviour is used to prove the cause that is meant to explain it
- Untestable because instincts are unconscious
- Based on drive reduction
> Circularity was the central criticism of instinct theory.

Q: According to Hull, a secondary (acquired) drive is best illustrated by:
- Thirst after exercise
- Pain avoidance
- *The drive for money, learned because money reduces many primary drives
- Shivering in the cold
> Secondary drives are learned through association with primary drive reduction.
:::

## 1.2 Arousal, incentives and Maslow's ladder [core][starting]
### Arousal theory: not too little, not too much
**Arousal** is the general level of alertness and activation of the body and brain, from deep sleep to panic. Arousal theory says we are motivated to keep arousal at an **optimal level**. When bored, we seek stimulation; when overwhelmed, we seek calm.

The **Yerkes-Dodson law** (Yerkes and Dodson, 1908, from experiments with mice learning to avoid a shock) describes the link between arousal and performance as an **inverted U**: performance is poor at very low arousal, best at moderate arousal, and poor again at very high arousal. The key refinement is about **task difficulty**:
- For **simple or well-practised tasks**, the best level of arousal is **fairly high**.
- For **complex or new tasks**, the best level is **lower**.

:::example Two people on exam morning
Deepa has revised thoroughly and the paper is mostly recall; a bit of nervous energy sharpens her. Arjun faces a new kind of problem-solving section; the same level of arousal floods his working memory and he freezes. Same arousal, different tasks, different results.
:::

:::widget guess
{
  "prompt": "On a scale of 0 (asleep) to 10 (panic), where does the Yerkes-Dodson law place the best arousal for a hard, unfamiliar task?",
  "min": 0,
  "max": 10,
  "unit": "out of 10",
  "answer": [3, 5],
  "reveal": "Low to moderate. Hard, new tasks need a calmer state than simple, practised ones. That is why surgeons and pilots train until complex steps become simple ones.",
  "clinician": "The inverted U with a task-difficulty interaction is the textbook reading. Note that Yerkes and Dodson's original data (discrimination learning in dancing mice) were sparse, and the term 'law' was applied decades later. Modern accounts separate arousal into components (cognitive anxiety versus physiological arousal) and use models such as Hardy's catastrophe model and Hanin's individual zones of optimal functioning, both covered in the applied module."
}
:::

### Incentive theory: the pull of the goal
Incentive theory says behaviour is pulled by **expected rewards** in the environment: money, praise, grades, food that looks good. An incentive's power depends on its **value** to the person and how **likely** they think it is. A cash prize means more to a struggling student than to a rich one.

### Opponent-process theory
**Solomon and Corbit** (1974) proposed that every strong emotional state is followed by an **opposite after-reaction**. First-time skydivers feel terror, then relief and elation after landing. With repetition, the first reaction weakens and the after-reaction grows. The theory explains why thrill-seeking becomes pleasant and why drug use moves from pleasure to taking the drug simply to escape withdrawal.

### Maslow's hierarchy of needs
**Abraham Maslow** ("A Theory of Human Motivation", 1943; Motivation and Personality, 1954), a founder of humanistic psychology, arranged needs in a hierarchy:
1. **Physiological**: food, water, sleep, warmth.
2. **Safety**: security, stability, freedom from fear.
3. **Love and belonging**: friendship, family, intimacy.
4. **Esteem**: respect from others, self-respect, achievement.
5. **Self-actualisation**: becoming what one is capable of becoming.

Maslow called the lower four **deficiency needs (D-needs)**: their lack creates tension. **Growth needs (B-needs, "being" needs)** such as truth, beauty and meaning drive self-actualisation. Late in life he added **self-transcendence** above self-actualisation. He described self-actualising people (Lincoln, Einstein, Eleanor Roosevelt) as accepting, spontaneous, problem-centred and prone to **peak experiences**.

:::trap The pyramid is not Maslow's drawing, and the order is not rigid
Maslow never drew the pyramid; it was popularised later by management writers. He also said the order is flexible: a need need not be fully met before the next appears, and some people (an artist, a freedom fighter) put higher needs first. Exams like statements such as "a lower need must be completely satisfied before a higher need emerges". That statement is **false**.
:::

:::widget decide
{
  "scene": "A school counsellor in a government school in Bihar notices that Class 8 students from the poorest homes are inattentive in the first period. The headmaster wants a motivational talk on dreams and ambition.",
  "ask": "Using Maslow, what should the counsellor suggest first?",
  "choices": [
    { "label": "A talk on self-actualisation and career dreams", "verdict": "ok", "outcome": "Students enjoy the talk, but attention in first period stays poor.", "why": "Inspiring, but it aims at higher needs while a basic need may be unmet." },
    { "label": "Check whether students are coming to school hungry, and make sure breakfast or the midday meal reaches them", "verdict": "best", "outcome": "Many children had skipped breakfast. Once food arrives early, attention improves.", "why": "Physiological needs come first in Maslow's model, and research on school meals supports this." },
    { "label": "Punish late or inattentive students to build discipline", "verdict": "harm", "outcome": "Children feel unsafe and some stop coming.", "why": "Threat undermines safety needs, the next rung up. It makes learning harder, not easier." }
  ]
}
:::

:::clinician
Empirical tests of a strict hierarchy (Wahba and Bridwell, 1976) found little support for ordered prepotency. A large survey across 123 countries (Tay and Diener, Journal of Personality and Social Psychology, 2011) found the needs broadly universal and linked to wellbeing, but people reported satisfying higher needs even when basic ones were unmet: the hierarchy describes tendencies, not stages. **Alderfer's ERG theory** (1969) collapsed the levels into Existence, Relatedness and Growth, allowed several to operate at once, and added **frustration-regression**: when a higher need is blocked, people fall back on a lower one (a worker denied growth demands more pay). Kenrick and colleagues (2010) proposed an evolutionary "renovated pyramid" with mate acquisition, retention and parenting at the top. For exam answers: state the model, the D/B distinction, the empirical critique, ERG, and the cross-cultural critique that the hierarchy reflects an individualist ideal; in many Indian families belonging and duty may be weighed above individual self-actualisation.
:::

:::recall
1. State the Yerkes-Dodson law with its task-difficulty refinement. || Performance follows an inverted U with arousal; the optimal level is higher for simple tasks and lower for complex ones.
2. What does opponent-process theory predict with repeated exposure? || The first reaction weakens and the opposite after-reaction strengthens.
3. List Maslow's five levels from the bottom. || Physiological, safety, love and belonging, esteem, self-actualisation.
4. What are D-needs and B-needs? || Deficiency needs (lower four, lack creates tension) and being or growth needs (drive self-actualisation).
5. What does ERG theory add? || Three needs (existence, relatedness, growth) active together, and frustration-regression.
:::

:::mcq
Q: Which statement about Maslow's hierarchy is most accurate?
- A lower need must be completely satisfied before a higher need emerges
- Esteem needs are growth needs
- Self-actualisation is a deficiency need
- *Maslow described the order as a general tendency that individuals can reverse
> Maslow himself allowed flexibility; strict prepotency is a textbook myth.

Q: A worker who is repeatedly denied promotion starts demanding much higher pay. Which concept explains this best?
- *Frustration-regression in ERG theory
- Opponent process
- Drive reduction
- Optimal arousal
> Blocked growth needs lead to renewed focus on existence needs.
:::

## 1.3 What an emotion is, and the first two theories [core][starting]
An **emotion** is a short-lived, organised response to something that matters to us. It has several parts that usually move together:
| Component | What it is | Example (sudden dog bark) |
|---|---|---|
| **Appraisal** | Judging what the event means for you | "That could bite me" |
| **Body changes** | Heart rate, breathing, sweating, hormones | Pounding heart |
| **Expression** | Face, voice, posture | Wide eyes, a gasp |
| **Feeling** | The inner experience | Fear |
| **Action tendency** | The urge to act | Step back, run |

Three related words are often confused. An **emotion** is brief and about something. A **mood** is longer, weaker and often without a clear object ("I've been low all day"). **Affect** is the umbrella term for both, and in clinical work it means the emotion you observe in a person.

### James-Lange theory: the body comes first
**William James** (1884, "What is an emotion?") and the Danish physician **Carl Lange** (1885) independently argued that emotion is **the perception of bodily changes**. The order is:

**event → bodily response → feeling.**

James's famous line: we do not cry because we are sorry; "we feel sorry because we cry, afraid because we tremble". Each emotion should therefore have its own bodily signature.

### Cannon-Bard theory: brain first, body and feeling together
**Walter Cannon** (1927), with **Philip Bard**, attacked James-Lange with five arguments:
1. Animals whose viscera were cut off from the brain still showed emotional behaviour.
2. Very different emotions (fear, anger, excitement) share similar bodily changes.
3. The viscera are relatively insensitive.
4. Visceral changes are too slow to produce instant feelings.
5. Producing the body changes artificially (an adrenaline injection) does not produce a real emotion; people say they feel "as if" afraid.

Cannon and Bard proposed that the **thalamus** sends signals **at the same time** to the cortex (producing the feeling) and to the body (producing the arousal):

**event → thalamus → feeling and bodily response together.**

:::mnemonic The order of the old theories
**J**ames-Lange: **J**ust the body first. **C**annon-Bard: **C**oncurrent, at the same time. The two-factor theory (next level): **S**chachter-**S**inger needs **S**ome thinking: arousal plus a label.
:::

:::widget sort
{
  "prompt": "Which theory is speaking?",
  "buckets": ["James-Lange", "Cannon-Bard"],
  "items": [
    { "text": "“I noticed my heart racing, and that is when I knew I was scared.”", "bucket": 0 },
    { "text": "“The fear and the racing heart hit me at the very same moment.”", "bucket": 1 },
    { "text": "Different emotions should have different bodily patterns.", "bucket": 0 },
    { "text": "Fear and anger share almost the same arousal, so arousal cannot tell them apart.", "bucket": 1 },
    { "text": "If you cut the feedback from the body, emotion should weaken.", "bucket": 0, "why": "This is the prediction Cannon tested and argued against with his animal studies." },
    { "text": "The thalamus sends signals to the cortex and to the body together.", "bucket": 1 }
  ]
}
:::

:::student
Neither old theory "won". Modern research shows some truth in both: bodily signals do shape feelings (James was partly right), and the brain can produce feelings quickly without waiting for the body (Cannon was partly right). The theories in the Beginner level add the missing piece: **how we interpret** what is happening.
:::

:::clinician
Cannon's critique was strong but not final. Later work found some autonomic differentiation between emotions (Levenson, Ekman and Friesen, 1990, using directed facial actions: anger raised heart rate and finger temperature more than fear did), though meta-analyses show patterns are inconsistent across studies and contexts (Siegel and colleagues, Psychological Bulletin, 2018). Hohmann's (1966) report that people with higher spinal cord injuries felt less intense emotion supported James, but better-controlled studies (Chwalisz, Diener and Gallagher, 1988) did not replicate it. The thalamus is no longer seen as the emotion centre; it is a relay, and the amygdala, insula, hypothalamus and prefrontal cortex carry most of the weight. James's core intuition returned in **Damasio's somatic marker hypothesis** and in interoception research (Craig; Critchley), where awareness of internal bodily states, mapped in the insula, contributes to feeling.
:::

:::recall
1. Name the five components of an emotion. || Appraisal, bodily changes, expression, feeling and action tendency.
2. How do emotion, mood and affect differ? || Emotion: brief, about something. Mood: longer, weaker, often without object. Affect: umbrella term; clinically the observed emotional state.
3. Give the James-Lange sequence. || Event, bodily response, then feeling (the feeling is the perception of the body change).
4. Give two of Cannon's criticisms of James-Lange. || Any two: emotion without visceral feedback; similar arousal across emotions; viscera insensitive; too slow; artificial arousal produces only "as if" feelings.
:::

:::mcq
Q: Which statement would Cannon and Bard accept?
- We feel afraid because we tremble
- Emotion is the label we give to unexplained arousal
- Each emotion has a unique visceral pattern
- *Feeling and bodily arousal are triggered at the same time by the brain
> Cannon-Bard holds that the thalamus triggers feeling and arousal simultaneously.

Q: A person injected with adrenaline says, "I feel as if I were afraid, but I'm not really afraid." Which theory does this observation challenge?
- *James-Lange
- Cannon-Bard
- Opponent-process
- Drive reduction
> If bodily change were enough for emotion, the injection should produce real fear (Marañón's observation, used by Cannon).
:::

## 1.4 Stress: the starting picture [core][starting]
In everyday speech "stress" means both the cause and the effect. Psychologists separate them:
- A **stressor** is the demand: an exam, a debt, a noisy neighbour, a flood.
- The **stress response** is what happens in body and mind: arousal, worry, tension.
- **Stress** in the modern sense is the **mismatch** a person feels between demands and their resources.

Stress is not always harmful. **Hans Selye** called helpful, motivating stress **eustress** (a wedding, a promotion, a challenging project) and harmful stress **distress**.

### Cannon's fight-or-flight response
Cannon described how threat triggers the **sympathetic nervous system** and the adrenal medulla to release **adrenaline (epinephrine) and noradrenaline**. Heart rate and blood pressure rise, breathing quickens, glucose floods the blood, digestion slows and pupils widen: the body is ready to fight or flee.

### Selye's General Adaptation Syndrome (GAS)
**Hans Selye**, an endocrinologist in Montreal, noticed in the 1930s that rats exposed to very different harmful agents (cold, injections, injury, forced exercise) showed the **same triad** of damage: enlarged adrenal glands, shrunken thymus and lymph glands, and stomach ulcers. He concluded that the body has a **non-specific** response to any demand, which unfolds in three stages:
1. **Alarm**: the first shock (resistance briefly drops), then a counter-shock as the body mobilises.
2. **Resistance**: the body adapts and copes, at a cost. Resistance to this stressor is high, but resistance to other stressors falls.
3. **Exhaustion**: if the stressor goes on, reserves run out; illness, "diseases of adaptation" and even death follow.

:::mnemonic GAS = "A R E you stressed?"
**A**larm, **R**esistance, **E**xhaustion.
:::

:::widget guess
{
  "prompt": "In Selye's model, during the resistance stage the person copes well with the original stressor. What happens to their ability to cope with a NEW, different stressor? (0 = collapses, 10 = much better than usual)",
  "min": 0,
  "max": 10,
  "unit": "out of 10",
  "answer": [2, 4],
  "reveal": "It drops. The body is spending its resources on the first stressor, so a second one hits harder. A student who has been nursing a sick parent for months often falls ill during exams.",
  "clinician": "Selye described heightened specific resistance with lowered cross-resistance during the resistance stage. The original account rested on glucocorticoid and adrenal changes, and Mason (1971) later showed that the 'non-specific' response depends heavily on the psychological meaning of the stressor, which opened the door to appraisal models."
}
:::

### Measuring stress through life events
**Thomas Holmes and Richard Rahe** (1967) built the **Social Readjustment Rating Scale (SRRS)**: 43 life events, each given **life change units (LCU)** based on how much readjustment it demands. Death of a spouse scored 100, divorce 73, marriage 50 (the anchor event), and even holidays and minor law violations scored a little. A total above about 300 LCU in a year was linked with a higher risk of illness. The key idea: **change itself**, good or bad, demands adjustment.

In India, **Gurmeet Singh and colleagues** (1984) developed the **Presumptive Stressful Life Events Scale (PSLES)**, with events that fit Indian life, such as a family conflict, a daughter's marriage, a change in a joint family or a crop failure.

### Daily hassles
**Kanner, Coyne, Schaefer and Lazarus** (1981) argued that the small, repeated irritations of daily life (crowded trains, misplaced keys, a nagging relative, slow internet) predict health and mood **better than major life events** do. They balanced the **Hassles Scale** with an **Uplifts Scale** for small pleasures.

:::widget decide
{
  "scene": "Ravi, 41, an auto driver in Pune, has no major life events this year, but he reports daily traffic fights, rising fuel costs, a leaking roof and constant worry about his son's fees. His SRRS score is low, yet he has headaches and poor sleep.",
  "ask": "What is the best interpretation?",
  "choices": [
    { "label": "His stress is low because his life-event score is low", "verdict": "harm", "outcome": "His distress is dismissed and he stops seeking help.", "why": "A low life-event score does not mean low stress. Chronic hassles can be more damaging than single events." },
    { "label": "His accumulation of daily hassles and chronic strain is likely driving his symptoms", "verdict": "best", "outcome": "Naming the daily strain lets him and the counsellor target the most changeable hassles first.", "why": "Hassles research shows small, repeated stressors predict symptoms well, often better than major events." },
    { "label": "His headaches must be purely medical", "verdict": "ok", "outcome": "A medical check is sensible, but the stress picture is ignored.", "why": "Rule out medical causes, yes, but stress and somatic symptoms often travel together." }
  ]
}
:::

:::clinician
Critiques of the life-events approach are standard exam material: (1) it treats positive and negative events as equivalent, though undesirable events predict illness far better; (2) it ignores appraisal: a divorce can be relief or catastrophe; (3) retrospective recall is biased, especially in people who are already ill (effort after meaning); (4) several items (changes in sleep or eating habits) overlap with symptoms, inflating correlations; and (5) correlations with illness are modest. Brown and Harris's Life Events and Difficulties Schedule (LEDS), a semi-structured interview rated for contextual threat, addresses many of these flaws and remains the research standard. The PSLES (Singh, Kaur and Kaur, Indian Journal of Psychiatry, 1984) has 51 items rated for presumptive stress and is still used in Indian clinical research.
:::

:::recall
1. Distinguish stressor, stress response and stress. || Stressor: the demand. Stress response: the reaction. Stress: the felt mismatch between demand and resources.
2. What is eustress? || Positive, motivating stress (Selye).
3. Name the three stages of Selye's GAS. || Alarm, resistance, exhaustion.
4. Which life event anchors the SRRS at 50 LCU? || Marriage.
5. Who showed that daily hassles predict symptoms better than major events? || Kanner, Coyne, Schaefer and Lazarus (1981).
:::

:::mcq
Q: Selye's original observation was that rats exposed to different harmful agents showed:
- Different responses to each agent
- *The same triad: enlarged adrenals, shrunken thymus and lymph glands, and stomach ulcers
- Only behavioural changes
- Improved immunity
> The sameness of the response led to the idea of a non-specific stress syndrome.

Q: Which is a major criticism of the Social Readjustment Rating Scale?
- It contains too few events
- It was developed only in India
- *It treats positive and negative changes as equally stressful and ignores the person's appraisal
- It measures daily hassles instead of life events
> Undesirable events and their meaning matter far more than change per se.
:::

## 1.5 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: Motivation is said to explain three features of behaviour. Which set is correct?
- Memory, attention and perception
- Stimulus, response and reinforcement
- Id, ego and superego
- *Activation, direction and intensity or persistence
> These three are the standard dimensions of motivated behaviour.

Q: The term homeostasis was introduced by:
- *Walter Cannon
- Clark Hull
- William McDougall
- Hans Selye
> Cannon, The Wisdom of the Body (1932).

Q: Which behaviour is hardest for drive-reduction theory to explain?
- Drinking when thirsty
- Eating when hungry
- *Riding a roller-coaster for fun
- Putting on a sweater in the cold
> Seeking stimulation and tension is a problem for a theory based on reducing tension.

Q: The Yerkes-Dodson law predicts that, for a very complex task, the best performance comes with:
- Very high arousal
- *Lower-moderate arousal
- No arousal at all
- Arousal that keeps rising
> The optimum shifts lower as task difficulty rises.

Q: A first-time bungee jumper feels terror, but after many jumps feels mainly exhilaration afterwards. This fits:
- *Opponent-process theory
- Drive reduction
- James-Lange theory
- Maslow's hierarchy
> The after-reaction strengthens with repetition.

Q: In Maslow's hierarchy, the need directly above safety is:
- Esteem
- Self-actualisation
- *Love and belonging
- Physiological
> Physiological, safety, belonging, esteem, self-actualisation.

Q: Maslow's growth needs are also called:
- D-needs
- Primary drives
- Secondary drives
- *B-needs (being needs)
> Being needs drive self-actualisation.

Q: "We feel afraid because we tremble" summarises:
- Cannon-Bard theory
- *James-Lange theory
- Schachter-Singer theory
- Lazarus's appraisal theory
> Bodily change first, then feeling.

Q: According to Cannon-Bard theory, which structure sends signals to both cortex and body at the same time?
- *Thalamus
- Amygdala
- Hippocampus
- Cerebellum
> Cannon and Bard gave the thalamus this role.

Q: Which of these is a MOOD rather than an emotion?
- A jolt of fear when a car swerves
- A flash of anger at an insult
- Surprise at a sudden noise
- *Feeling irritable all day without a clear reason
> Moods are longer, weaker and often objectless.

Q: Selye's term for positive, motivating stress is:
- Distress
- Allostasis
- *Eustress
- Hardiness
> Eustress: helpful stress.

Q: The correct order of Selye's General Adaptation Syndrome is:
- Resistance, alarm, exhaustion
- *Alarm, resistance, exhaustion
- Alarm, exhaustion, resistance
- Exhaustion, alarm, resistance
> A-R-E.

Q: The fight-or-flight response is driven mainly by:
- *The sympathetic nervous system and adrenal medulla
- The parasympathetic nervous system
- The cerebellum
- Growth hormone
> Sympathetic activation with adrenaline and noradrenaline release.

Q: The Hassles Scale was developed because:
- Life events had no link with health at all
- Selye asked for a measure of exhaustion
- Maslow needed a measure of esteem
- *Daily irritations were found to predict health better than major life events
> Kanner and colleagues (1981) showed hassles are strong predictors.
:::

# Part II · Beginner: the theories in depth

## 2.1 Thinking about goals: self-determination, expectancy and attribution [core][beginner]
The biological theories treat people like thermostats. **Cognitive theories** add what people think: their beliefs about why things happen, what they expect, and what they value.

### Self-determination theory (SDT)
**Edward Deci and Richard Ryan** (from 1985) proposed that people have three **basic psychological needs**, and that wellbeing and high-quality motivation depend on meeting them:
1. **Autonomy**: feeling that you choose and endorse what you do.
2. **Competence**: feeling effective and able to grow.
3. **Relatedness**: feeling connected and cared for.

SDT separates **intrinsic motivation** (doing something because it is interesting or enjoyable in itself) from **extrinsic motivation** (doing it for an outcome separate from the activity). It does not treat extrinsic motivation as one thing. On a continuum from least to most self-determined:
| Type | Why the person acts | Student example |
|---|---|---|
| **Amotivation** | No intention, no value | "I don't know why I'm in this course" |
| **External regulation** | Rewards and punishments | "I study so my father won't shout" |
| **Introjected regulation** | Guilt, pride, ego | "I'd feel ashamed if I failed" |
| **Identified regulation** | Valuing the outcome | "Statistics matters for my research career" |
| **Integrated regulation** | Fits who I am | "Being a careful scientist is part of me" |
| **Intrinsic motivation** | Interest and enjoyment | "I love solving these problems" |

### The overjustification effect
Can rewards kill interest? **Deci** (1971) paid students to solve interesting puzzles; in a later free period, paid students spent **less** time on the puzzles than unpaid ones. **Lepper, Greene and Nisbett** (1973) gave nursery children who already loved drawing an **expected** "good player" certificate for drawing; later, those children drew less in free play than children who got no reward or an unexpected one. The explanation: an external reward can shift the reason in the person's mind from "I enjoy this" to "I do this for the reward" (**cognitive evaluation theory**, part of SDT).

:::widget sort
{
  "prompt": "Place each reason on the self-determination continuum.",
  "buckets": ["External", "Introjected", "Identified", "Intrinsic"],
  "items": [
    { "text": "“I go to the gym because my company pays a bonus for attendance.”", "bucket": 0 },
    { "text": "“I'd feel guilty if I skipped the gym after telling everyone.”", "bucket": 1 },
    { "text": "“My blood sugar matters to me, so I exercise.”", "bucket": 2 },
    { "text": "“I just love the feeling of a good run in the morning at Sabarmati riverfront.”", "bucket": 3 },
    { "text": "“I learn Sanskrit because it will help me read primary texts for my thesis.”", "bucket": 2 },
    { "text": "“I practise sitar to avoid being scolded by my guru.”", "bucket": 0, "why": "Avoiding punishment is external regulation, even in a respected relationship." }
  ]
}
:::

### Expectancy-value theories
These theories say motivation is a **product** of how likely you think success is (expectancy) and how much you value it.
- **Atkinson's achievement theory** (1957): the tendency to approach success equals the motive for success × the probability of success × the incentive value of success. Since a hard task is worth more (incentive value equals 1 minus probability), people high in achievement motivation prefer **moderately difficult** tasks; people high in **fear of failure** choose very easy or very hard ones (failing a near-impossible task is no disgrace).
- **Vroom's expectancy theory** (1964, work settings): motivation equals **expectancy** (effort leads to performance) × **instrumentality** (performance leads to reward) × **valence** (value of the reward). If any one is zero, motivation is zero.

### Attribution and explanatory style
**Bernard Weiner** analysed how people explain success and failure along three dimensions: **locus** (internal or external), **stability** (stable or unstable) and **controllability**. Attributing failure to lack of effort (internal, unstable, controllable) keeps motivation up; attributing it to low ability (internal, stable, uncontrollable) lowers it.

**Martin Seligman** found that dogs exposed to inescapable shock later failed to escape when escape was possible: **learned helplessness** (Seligman and Maier, 1967). The **reformulated** model (Abramson, Seligman and Teasdale, 1978) said what matters in humans is **explanatory style**: people who explain bad events as **internal, stable and global** ("It's me, it will always be like this, it ruins everything") are more prone to depression.

:::widget decide
{
  "scene": "Sana, a BSc student in Lucknow, fails her first statistics test. She tells you: “I'm just not a maths person. I'll never get it.”",
  "ask": "As her mentor, which response best protects her motivation?",
  "choices": [
    { "label": "“Don't worry, the test was unfair anyway.”", "verdict": "ok", "outcome": "She feels better today but has no plan, and the next test goes the same way.", "why": "An external attribution soothes, but it removes any sense of control over the next result." },
    { "label": "“Let's look at which questions went wrong and what study method you used. Those are things we can change.”", "verdict": "best", "outcome": "She finds she only reread notes and never practised problems. With practice her next score rises.", "why": "This shifts the attribution from stable ability to unstable, controllable strategy and effort." },
    { "label": "“Maybe statistics isn't for you. Some people just can't do it.”", "verdict": "harm", "outcome": "She drops the subject she needed for her MA entrance.", "why": "Confirming a stable, uncontrollable cause produces helplessness." }
  ]
}
:::

### Goal-setting and self-efficacy
**Edwin Locke and Gary Latham** showed across hundreds of studies that **specific, difficult goals** produce better performance than vague "do your best" goals, provided there is **feedback**, **commitment** and the needed skill. **Albert Bandura's self-efficacy** (1977), the belief that you can perform a specific task, predicts effort and persistence. It grows from four sources: **mastery experiences** (the strongest), **vicarious experience** (seeing similar others succeed), **verbal persuasion** and **physiological and emotional states**.

:::clinician
SDT now contains six mini-theories: cognitive evaluation theory (effects of rewards and feedback on intrinsic motivation), organismic integration theory (the internalisation continuum above), causality orientations theory (autonomy, controlled and impersonal orientations), basic psychological needs theory, goal contents theory (intrinsic goals such as growth and community versus extrinsic goals such as wealth and image) and relationship motivation theory. The meta-analysis by Deci, Koestner and Ryan (Psychological Bulletin, 1999; 128 studies) found that **expected, tangible, performance-contingent** rewards undermine free-choice intrinsic motivation, while **verbal praise** tends to enhance it; Cameron and Pierce argued the effect is narrower than claimed. Practical summary: rewards that feel controlling undermine; rewards that convey competence and preserve choice do not. Cross-culturally, Iyengar and Lepper (1999) found Asian-American children were more motivated when trusted others (mothers) made choices for them, which some read as a challenge to autonomy; SDT replies that autonomy means volition (endorsing an action), not independence, and that choosing to follow a respected elder can be autonomous (Chirkov and colleagues, 2003). That reply is useful in Indian classrooms and families.
:::

:::recall
1. Name SDT's three basic needs. || Autonomy, competence and relatedness.
2. Order the SDT regulation types from least to most self-determined. || Amotivation, external, introjected, identified, integrated, intrinsic.
3. What is the overjustification effect? || An expected external reward for an already enjoyable task reduces later intrinsic interest.
4. Give Vroom's three terms. || Expectancy, instrumentality and valence (multiplied).
5. What explanatory style predicts depression in the reformulated helplessness model? || Explaining bad events as internal, stable and global.
6. Name Bandura's four sources of self-efficacy. || Mastery experiences, vicarious experience, verbal persuasion, physiological and emotional states.
:::

:::mcq
Q: According to Atkinson, a person high in achievement motivation is most likely to choose a task with a probability of success of about:
- 0.05
- *0.5
- 0.95
- It makes no difference
> Moderate difficulty maximises the product of probability and incentive value.

Q: Under Vroom's theory, an employee who believes hard work will raise performance and that performance will be rewarded, but who does not value the reward at all, will have motivation that is:
- High
- Moderate
- *Close to zero
- Unaffected
> The terms multiply; a zero valence makes motivation zero.

Q: In Lepper, Greene and Nisbett's study, which group drew least in later free play?
- Children who got no reward
- Children who got an unexpected reward
- All groups drew the same
- *Children who expected and received a reward
> Expected reward undermined intrinsic interest.
:::

## 2.2 Social motives: achievement, affiliation and power [core][beginner]
**Henry Murray** (Explorations in Personality, 1938) listed about twenty **psychogenic needs** (achievement, affiliation, dominance, autonomy, nurturance and others) and paired them with environmental **press**, the forces that help or block a need. To measure needs that people might not report, Murray and **Christiana Morgan** created the **Thematic Apperception Test (TAT)**: people tell stories about ambiguous pictures, and the themes reveal their needs.

**David McClelland** and colleagues developed TAT scoring systems for three needs that dominate much research:
| Need | What the person wants | Typical behaviour |
|---|---|---|
| **Need for achievement (nAch)** | To meet a standard of excellence | Prefers moderate risks, wants feedback, takes personal responsibility |
| **Need for affiliation (nAff)** | Warm, close relationships | Seeks approval, avoids conflict, works well in teams |
| **Need for power (nPow)** | To have impact, influence or control others | Seeks status and leadership; can be personalised (for self) or socialised (for the group) |

### Achievement and nations
In The Achieving Society (1961), McClelland argued that the achievement imagery in a nation's children's stories predicted its later economic growth. He then tested whether achievement motivation could be **trained**.

:::example The Kakinada experiment
In the 1960s McClelland and David Winter ran achievement-motivation training for small businessmen in **Kakinada**, a town in Andhra Pradesh, comparing them with businessmen in a similar town. Trainees practised thinking in achievement terms, set concrete goals and studied models. In the following years trained men started more new businesses, invested more and created more jobs than the comparison group (Motivating Economic Achievement, 1969). It is one of the earliest attempts anywhere to change a motive deliberately, and it was done in India.
:::

### The leadership motive pattern
McClelland found that successful managers in large organisations typically show **moderate to high nPow, lower nAff and high self-control (activity inhibition)**, the **leadership motive pattern**. High nAch suits entrepreneurs and individual contributors; it can backfire in managers who want to do everything themselves.

### Fear of failure and fear of success
Atkinson added **fear of failure**, which leads to avoidance of moderate challenges. **Matina Horner** (1968) proposed **fear of success** in women (worry that success brings social rejection); the idea drew attention to gender roles but did not hold up well in later studies.

:::widget sort
{
  "prompt": "Which need is strongest in each person?",
  "buckets": ["Achievement", "Affiliation", "Power"],
  "items": [
    { "text": "A tailor in Ahmedabad who keeps refining her stitching and asks clients for detailed feedback", "bucket": 0 },
    { "text": "A team member who agrees with everyone to keep the peace", "bucket": 1 },
    { "text": "A student union leader who enjoys persuading the principal and shaping rules", "bucket": 2 },
    { "text": "An engineer who prefers projects with a real chance of failure but a real chance of success", "bucket": 0 },
    { "text": "A nurse who most enjoys the friendships on her ward", "bucket": 1 },
    { "text": "A manager who wants a bigger office and a title, mainly for his own image", "bucket": 2, "why": "That is personalised power; socialised power is used for the group's benefit." }
  ]
}
:::

### Achievement in Indian contexts
Indian researchers questioned whether a purely individual achievement motive fits collectivist settings. **Agarwal and Misra** (1986) described **socially oriented achievement motivation**: striving for excellence to meet the expectations of family and community, with goals and standards set by significant others. A student who chooses engineering to fulfil a parent's wish may show high striving without the self-chosen standards that McClelland's model assumes. Both individual and social forms coexist in most Indian students.

:::clinician
Implicit motives (measured with picture story exercises, the modern TAT) and explicit, self-reported motives correlate weakly (meta-analytic r around 0.1; Köllner and Schultheiss, 2014), and they predict different things: implicit motives predict spontaneous, long-term behavioural trends (operant behaviour), explicit motives predict choices in structured situations (respondent behaviour) (McClelland, Koestner and Weinberger, 1989). Reliability of TAT scoring is acceptable with trained coders, but test-retest reliability is modest, partly because people deliberately vary stories. In Indian work on achievement, Mehta (1969) adapted achievement measures for Indian students, and Agarwal and Misra's distinction parallels Markus and Kitayama's independent and interdependent self-construals. A good exam answer contrasts the McClelland framework with the socially oriented model and adds the Kakinada evidence.
:::

:::recall
1. What did Murray mean by "press"? || Environmental forces that help or block a need.
2. Who created the TAT? || Henry Murray and Christiana Morgan.
3. Describe a person high in nAch. || Prefers moderate risks, wants concrete feedback, takes personal responsibility for outcomes.
4. What is the leadership motive pattern? || Moderate to high need for power, lower need for affiliation, high self-control.
5. What is socially oriented achievement motivation? || Striving for excellence to meet family and community expectations (Agarwal and Misra, 1986).
:::

:::mcq
Q: The Kakinada study is best known for showing that:
- Achievement motivation is purely inherited
- *Achievement motivation training could increase entrepreneurial activity
- Affiliation is the strongest motive in India
- The TAT is invalid in India
> McClelland and Winter trained businessmen and found more business activity afterwards.

Q: A manager uses influence to help her team succeed rather than to boost her own status. McClelland would call this:
- *Socialised power
- High affiliation
- Fear of success
- Personalised power
> Power used for the group is socialised power.
:::

## 2.3 Curiosity, sensation seeking, flow and self-control [core][beginner]
These topics appear by name in the UGC NET syllabus. Each answers a question drive theory could not.

### Curiosity
**Daniel Berlyne** (1960) described two pairs of curiosity:
- **Perceptual** curiosity (towards novel sights and sounds) versus **epistemic** curiosity (the desire for knowledge).
- **Specific** curiosity (wanting a particular piece of information) versus **diversive** curiosity (seeking any stimulation to relieve boredom).

Berlyne said novelty, complexity, surprise and uncertainty (**collative variables**) raise arousal, and we prefer moderate levels. **George Loewenstein's information-gap theory** (1994) says curiosity arises when we notice a gap between what we know and what we want to know, which is why a cliffhanger in a web series or a puzzle question at the start of a lecture works so well.

### Sensation seeking
**Marvin Zuckerman** defined **sensation seeking** as the need for varied, novel, complex and intense experiences, and the willingness to take risks for them. His Sensation Seeking Scale (form V) has **four subscales**:
1. **Thrill and adventure seeking**: risky sports such as skydiving.
2. **Experience seeking**: new experiences through the mind and senses, travel, unusual art, unconventional lifestyles.
3. **Disinhibition**: social and sexual disinhibition, parties, drinking.
4. **Boredom susceptibility**: dislike of repetition and dull people.

High sensation seekers are more likely to drive fast, try drugs and choose exciting jobs (firefighters, journalists), but also to be creative and tolerant of new ideas. The trait is partly heritable, peaks in late adolescence and falls with age.

:::widget guess
{
  "prompt": "At what age does sensation seeking usually peak?",
  "min": 8,
  "max": 50,
  "unit": "years",
  "answer": [16, 22],
  "reveal": "In late adolescence and the early twenties, then it falls steadily. That is one reason road accidents and first drug use cluster in this age band.",
  "clinician": "Cross-sectional and longitudinal data show sensation seeking peaking around ages 16 to 19 and declining across adulthood, with consistently higher scores in males, especially on thrill and adventure seeking and disinhibition. The dual-systems model (Steinberg) links the adolescent peak to early maturation of reward circuits relative to later-maturing prefrontal control."
}
:::

### Flow
**Mihaly Csikszentmihalyi** studied artists, climbers, surgeons and chess players and described **flow**: a state of complete absorption in a task that is intrinsically rewarding. Flow occurs when **challenge and skill are both high and well matched**:
| | Low skill | High skill |
|---|---|---|
| **High challenge** | Anxiety | **Flow** |
| **Low challenge** | Apathy | Boredom or relaxation |

Features of flow include clear goals, immediate feedback, a merging of action and awareness, deep concentration, a sense of control, loss of self-consciousness, a distorted sense of time and an **autotelic** experience (the activity is its own reward). He gathered data with the **experience sampling method**: people carried pagers and wrote down what they were doing and feeling when signalled at random moments.

:::example Flow in Chennai and Chicago
A Carnatic violinist during a long improvisation, a software developer debugging late at night, a farmer in Punjab ploughing at a steady pace, a surgeon in the middle of a complex operation: Csikszentmihalyi found flow across cultures and in very ordinary work, and he found people reported it more often at work than in leisure.
:::

### Self-regulation and self-control
**Self-regulation** is steering your own behaviour towards goals. **Carver and Scheier's control theory** models it as a **feedback loop**: compare where you are with a reference goal; if there is a gap, act to reduce it; check again (like the TOTE unit: Test, Operate, Test, Exit, from Miller, Galanter and Pribram, 1960).

**Walter Mischel's** "marshmallow" studies at Stanford (from the late 1960s) offered preschoolers one treat now or two if they waited. Children who used strategies (looking away, singing, thinking of the marshmallow as a cloud) waited longer, and longer waiting predicted later academic and social outcomes in follow-ups.

:::trap Two famous findings that shrank
**Ego depletion**, Baumeister's idea that self-control is a limited resource that runs down with use (1998, the radish and cookie study), failed in a large pre-registered replication across 23 labs (Hagger and colleagues, 2016), which found an effect close to zero. A larger, more diverse marshmallow replication (Watts, Duncan and Quan, 2018) found the link with later achievement was about half as large and largely explained by family background. Exams may still teach both; you should know both the original claim and the replication.
:::

:::widget build
{
  "vignette": "Meera, a classical dancer in Bengaluru, is rehearsing a new, difficult varnam for a performance. She has trained for fifteen years. She knows exactly what each passage should look like and feels each step land or slip. For two hours she forgets to check her phone, loses track of time and stops worrying how she looks. She calls the rehearsal its own reward.",
  "rule": "Tick the features of flow present in the story. Flow needs a high, matched challenge and skill, plus several of the experiential features.",
  "symptoms": [
    { "label": "High challenge matched by high skill", "present": true, "core": true },
    { "label": "Clear goals", "present": true },
    { "label": "Immediate feedback", "present": true, "why": "She feels each step land or slip." },
    { "label": "Loss of self-consciousness", "present": true },
    { "label": "Distorted sense of time", "present": true },
    { "label": "Autotelic experience", "present": true },
    { "label": "Anxiety about failing", "present": false, "why": "Anxiety is what happens when challenge exceeds skill, not flow." },
    { "label": "Low challenge and boredom", "present": false }
  ],
  "need": 4,
  "needCore": true,
  "verdict": "Meera is in flow: a hard, new piece matched to fifteen years of skill, with clear goals, feedback, absorption and time distortion."
}
:::

:::clinician
Ego depletion: Hagger and colleagues' Registered Replication Report (Perspectives on Psychological Science, 2016; 23 labs, over 2,000 participants) found d close to 0.04; a second multisite study (Vohs and colleagues, 2021) also found a very small effect. Alternative accounts treat fatigue after effort as a motivational shift (Inzlicht and Schmeichel's process model) rather than a depleted resource; the glucose hypothesis did not hold. **Implementation intentions** ("If situation X, then I will do Y"; Gollwitzer, 1999) are one of the better-supported self-regulation tools (meta-analysis of 94 studies, d about 0.65; Gollwitzer and Sheeran, 2006). For sensation seeking, Zuckerman later linked the trait to low monoamine oxidase activity and dopaminergic reward sensitivity, and to his **impulsive sensation seeking** factor in the Alternative Five model. Flow has been operationalised with the Flow State Scale (Jackson and Marsh) and is central to positive psychology and sports psychology.
:::

:::recall
1. Name Berlyne's two pairs of curiosity. || Perceptual versus epistemic; specific versus diversive.
2. What is the information-gap theory of curiosity? || Curiosity arises when we notice a gap between what we know and what we want to know (Loewenstein).
3. Give Zuckerman's four sensation-seeking subscales. || Thrill and adventure seeking, experience seeking, disinhibition, boredom susceptibility.
4. When does flow occur? || When challenge and skill are both high and well matched.
5. What happened to ego depletion when it was tested across 23 labs? || The effect was close to zero.
:::

:::mcq
Q: A student with very high skill is given a very easy task. According to Csikszentmihalyi's model, she is most likely to feel:
- Flow
- Anxiety
- *Boredom or relaxation
- Apathy
> High skill with low challenge gives boredom or relaxation.

Q: Which subscale of Zuckerman's scale is tapped by "I like to travel to unusual places and try unfamiliar food"?
- Thrill and adventure seeking
- Disinhibition
- Boredom susceptibility
- *Experience seeking
> New experiences through the mind and senses are experience seeking.
:::

## 2.4 The biology of wanting: hunger, thirst, sex and reward [core][beginner]
Biological motives are where homeostasis works best, but even here learning, culture and reward matter.

### Hunger
The older **dual-centre model** came from lesion studies in rats:
- Damage to the **lateral hypothalamus (LH)** made rats stop eating: it was called the "start eating" or hunger centre.
- Damage to the **ventromedial hypothalamus (VMH)** made rats overeat and become obese: the "stop eating" or satiety centre.

Today hunger is understood as a network centred on the **arcuate nucleus** and **paraventricular nucleus** of the hypothalamus, which read many signals:
| Signal | Source | Effect |
|---|---|---|
| **Ghrelin** | Stomach | Rises before meals, **increases** hunger |
| **Leptin** | Fat cells | Long-term signal of fat stores, **reduces** hunger |
| **Insulin** | Pancreas | Reduces hunger; signals blood glucose |
| **CCK, PYY, GLP-1** | Gut | Short-term fullness signals after a meal |
| **Stomach stretch** | Stomach | Fullness via the vagus nerve |

**Set-point theory** says the body defends a weight range by adjusting hunger and metabolism, which is why diets often fail. **Settling-point** models add that weight settles where genes, food environment and habits balance out. External cues matter: portion size, plate size, smell, time of day and company all change how much we eat (Schachter's work on externality).

:::example The thin-fat Indian baby
Researchers in Pune (Yajnik and colleagues) showed that Indian newborns are often small and thin but carry relatively more body fat than European babies, the "thin-fat" phenotype. Combined with a modern, calorie-rich diet, this helps explain India's high rates of type 2 diabetes at lower body weights. Hunger, metabolism and culture all meet here.
:::

### Thirst
Thirst has two triggers. **Osmotic thirst** comes from salty, concentrated body fluid detected by brain osmoreceptors (after eating salty bhujia). **Hypovolaemic thirst** comes from loss of fluid volume, as in bleeding, vomiting or diarrhoea, detected by the kidneys (via renin and angiotensin) and blood-volume receptors. The hormone **vasopressin (ADH)** makes the kidneys keep water.

### Sexual motivation
**Masters and Johnson** (1966) observed the human sexual response directly and described four phases: **excitement, plateau, orgasm and resolution**. Later sex therapists added a **desire** phase at the start, giving a triphasic model of desire, excitement and orgasm. Hormones (testosterone in both sexes) affect desire, but human sexuality is shaped heavily by learning, culture, relationship and meaning. Clinical sexual dysfunctions map onto these phases.

### Reward: wanting is not liking
**Kent Berridge and Terry Robinson** showed that two different systems are often confused:
- **Wanting** (incentive salience): the pull towards a reward, driven by **dopamine** in the mesolimbic pathway (ventral tegmental area to nucleus accumbens).
- **Liking**: the actual pleasure, driven by small **opioid and endocannabinoid "hotspots"**.

Rats with dopamine blocked still show pleasure faces to sugar but will not work for it. In addiction, wanting grows (sensitisation) even as liking falls: people crave what they no longer enjoy.

:::widget sort
{
  "prompt": "Does each signal raise or lower hunger?",
  "buckets": ["Raises hunger", "Lowers hunger"],
  "items": [
    { "text": "Ghrelin rising before lunch", "bucket": 0 },
    { "text": "Leptin from fat stores", "bucket": 1 },
    { "text": "Stomach stretch after a full thali", "bucket": 1 },
    { "text": "CCK released from the gut after a meal", "bucket": 1 },
    { "text": "The smell of fresh jalebis at a sweet shop", "bucket": 0, "why": "External cues can trigger hunger even when the body has enough energy." },
    { "text": "Damage to the ventromedial hypothalamus (in the old rat studies)", "bucket": 0, "why": "VMH lesions led to overeating, so the VMH was called the satiety centre." }
  ]
}
:::

:::clinician
The dual-centre model was simplified: LH lesions also damage dopaminergic fibres of passage (the nigrostriatal bundle), producing general akinesia, and VMH lesions alter insulin secretion and vagal tone, raising fat storage. Leptin was cloned by Friedman's group in 1994 (the ob gene); leptin-deficient humans are rare, and most obesity involves leptin resistance rather than deficiency, which is why leptin treatment failed for common obesity. GLP-1 receptor agonists such as semaglutide act on these satiety pathways and on reward circuits; their psychiatric relevance is covered in the frontiers module. The wanting-liking distinction (incentive sensitisation theory, Robinson and Berridge, 1993) is now standard in addiction teaching and helps explain anhedonia in depression as involving motivational (anticipatory) deficits more than consummatory ones.
:::

:::recall
1. In the dual-centre model, which hypothalamic area was the satiety centre? || The ventromedial hypothalamus (VMH).
2. What does ghrelin do and where is it made? || It rises before meals and increases hunger; made in the stomach.
3. What is the difference between osmotic and hypovolaemic thirst? || Osmotic: concentrated body fluid. Hypovolaemic: loss of fluid volume.
4. Name Masters and Johnson's four phases. || Excitement, plateau, orgasm, resolution.
5. Which neurotransmitter is linked to "wanting", and which systems to "liking"? || Dopamine for wanting; opioid and endocannabinoid hotspots for liking.
:::

:::mcq
Q: A person with long-term heavy alcohol use says, "I don't even enjoy it any more, but I can't stop wanting it." This best fits:
- Drive reduction
- *Incentive sensitisation: wanting grows while liking falls
- Set-point theory
- The Yerkes-Dodson law
> Wanting and liking are separable; in addiction wanting is sensitised.

Q: Leptin is best described as:
- A stomach hormone that increases hunger before meals
- A brain area that starts eating
- *A hormone from fat cells that signals long-term energy stores and reduces hunger
- A thirst hormone
> Leptin reflects fat stores; ghrelin is the stomach hunger hormone.
:::

## 2.5 Cognition and emotion: Schachter-Singer, Lazarus and the debate [core][beginner]
### Schachter and Singer's two-factor theory (1962)
**Stanley Schachter and Jerome Singer** argued that emotion needs **two factors**: **physiological arousal** and a **cognitive label** that explains it. Arousal tells you how strongly you feel; the label, taken from the situation, tells you which emotion it is.

**The experiment.** Participants were told they were getting a vitamin ("Suproxin") to test vision. In fact most got **adrenaline**, which produces arousal. Some were **informed** about the real side effects (racing heart, trembling); others were **misinformed** or told nothing. Each then waited with a **stooge** who acted either **euphoric** (playing with paper planes and hula hoops) or **angry** (complaining about an insulting questionnaire). Participants who were aroused **and had no explanation** for their arousal tended to catch the stooge's emotion; informed participants, who could put their arousal down to the injection, did so less.

### Misattribution of arousal
If arousal is labelled from context, it can be **mislabelled**. In **Dutton and Aron's** (1974) study on the **Capilano Suspension Bridge** in Vancouver, an attractive female interviewer approached men either on a swaying, frightening bridge or on a low, stable one. Men on the scary bridge wrote more sexual imagery into stories and were more likely to phone her later. Their fear arousal had been partly read as attraction.

:::widget decide
{
  "scene": "Karan, 23, drinks three strong coffees before a group presentation in Mumbai. His heart races and his hands shake. He concludes, “I'm terrible at public speaking; I'm panicking.”",
  "ask": "Using the two-factor theory, what would you help him notice?",
  "choices": [
    { "label": "That he is right: the arousal proves he has social anxiety disorder", "verdict": "harm", "outcome": "He starts avoiding presentations.", "why": "A diagnosis cannot be made from one episode, and the theory points to another cause of the arousal." },
    { "label": "That some of his arousal has an obvious source, the caffeine, so it does not have to mean panic", "verdict": "best", "outcome": "Relabelling part of the arousal lowers his fear, and next time he skips the extra coffee.", "why": "When arousal has a clear non-emotional explanation, people label it less as emotion. This is the informed condition of Schachter and Singer." },
    { "label": "Tell him to ignore his body completely", "verdict": "ok", "outcome": "He tries, but the sensations keep drawing his attention.", "why": "Ignoring sensations rarely works; reinterpreting them does better." }
  ]
}
:::

### Lazarus: appraisal comes first
**Richard Lazarus** (1966, 1991) argued that emotion depends on **cognitive appraisal**: our evaluation of what an event means for our wellbeing. The same event can produce different emotions in different people because they appraise it differently. In his **cognitive-motivational-relational theory**, each emotion has a **core relational theme**: anger is "a demeaning offence against me and mine", anxiety is "facing an uncertain, existential threat", guilt is "having transgressed a moral imperative", pride is "enhancing one's ego-identity by taking credit for a valued achievement".

In early experiments Lazarus showed people a disturbing film of a tribal circumcision ritual. Those told beforehand that the procedure was not painful (denial) or who were encouraged to watch it like an anthropologist (intellectualisation) showed **less** physiological stress than those told it was harmful.

### Zajonc: feeling can come first
**Robert Zajonc** (1980, "Feeling and thinking: preferences need no inferences") argued that **affect can arise without cognition**. His evidence was the **mere exposure effect**: people come to like shapes or symbols shown to them so briefly that they cannot say they saw them. The **Lazarus-Zajonc debate** (American Psychologist, 1984) was partly about definitions: Lazarus counted fast, automatic, unconscious evaluations as appraisal; Zajonc meant deliberate thought.

:::analogy Two routes to fear
Seeing something shaped like a snake on a forest path near Mahabaleshwar, you jump before you think. A second later you see it is a stick and calm down. The jump looks like Zajonc's fast affect; the "it's a stick" moment looks like Lazarus's appraisal. LeDoux's brain research (Part III) shows both routes are real.
:::

:::widget sort
{
  "prompt": "Which theory is each statement closest to?",
  "buckets": ["Schachter-Singer", "Lazarus", "Zajonc"],
  "items": [
    { "text": "Unexplained arousal takes its label from the situation.", "bucket": 0 },
    { "text": "What the event means to you decides which emotion you feel.", "bucket": 1 },
    { "text": "People prefer symbols they were shown too fast to recognise.", "bucket": 2 },
    { "text": "Men on a frightening bridge mistook fear for attraction.", "bucket": 0 },
    { "text": "Anger means appraising a demeaning offence against me and mine.", "bucket": 1 },
    { "text": "Preferences need no inferences.", "bucket": 2 }
  ]
}
:::

:::clinician
The Schachter-Singer findings were weaker than textbooks suggest: the predicted effects appeared mainly on behavioural and self-report measures in some conditions, the euphoria-anger contrast was not symmetrical, and attempts to replicate (Marshall and Zimbardo, 1979; Maslach, 1979) found that unexplained arousal tends to be labelled **negatively**, not neutrally, whatever the context. Valins (1966) showed that **false heart-rate feedback** alone shifted ratings of attractiveness, suggesting that perceived rather than actual arousal matters. The lasting contributions are misattribution, the role of context in labelling, and the general cognitive turn. Appraisal theories were later formalised as multidimensional models (Scherer's component process model, with sequential stimulus evaluation checks; Smith and Ellsworth's dimensions such as pleasantness, certainty, control and agency) and are the basis of cognitive therapy's emphasis on interpretation. The constructionist **theory of constructed emotion** (Lisa Feldman Barrett, 2017) is a modern descendant of the two-factor view: the brain predicts and categorises interoceptive changes using learned emotion concepts.
:::

:::recall
1. What two factors did Schachter and Singer propose? || Physiological arousal and a cognitive label.
2. Which group in their study was most influenced by the stooge? || Aroused participants who had no explanation for their arousal (misinformed or uninformed).
3. What did Dutton and Aron show? || Fear arousal on a frightening bridge was partly misattributed to attraction.
4. What is a core relational theme? Give one. || The central meaning of an emotion in Lazarus's theory, e.g. anger: a demeaning offence against me and mine.
5. What was Zajonc's main evidence that affect can come before cognition? || The mere exposure effect with stimuli too brief to recognise.
:::

:::mcq
Q: In Schachter and Singer's experiment, participants who were correctly informed about the effects of the injection:
- *Were less likely to take on the stooge's emotion
- Showed the strongest emotional contagion
- Felt no arousal at all
- Became angry in every condition
> They could attribute their arousal to the injection.

Q: Zajonc's "preferences need no inferences" means that:
- All emotion depends on conscious appraisal
- *Affective reactions can occur without prior cognitive processing
- Emotion needs both arousal and a label
- Feelings follow bodily changes
> Mere exposure shows liking without recognition.
:::

## 2.6 Faces, feedback and culture: is emotion universal? [core][beginner]
### Basic emotions
Darwin (The Expression of the Emotions in Man and Animals, 1872) argued that facial expressions evolved and are shared across humans and other animals. **Paul Ekman** tested this. With Wallace Friesen he travelled to the **Fore** people of Papua New Guinea, who had little contact with outsiders, and found that they matched faces to emotion stories much as Westerners did. Ekman proposed **six basic emotions**: happiness, sadness, fear, anger, disgust and surprise (he later added **contempt**). Ekman and Friesen also created the **Facial Action Coding System (FACS)**, which codes any expression as a set of numbered muscle movements (action units).

### Display rules
Cultures have **display rules**: norms about which emotions may be shown, by whom and when. In a classic study, Japanese and American students watched a stressful film. Alone, both showed similar disgust. With an older experimenter present, Japanese students masked negative expressions with polite smiles more than Americans did.

:::example Lajja in Bhubaneswar
In Odisha, the image of the goddess **Kali with her tongue out**, standing on Shiva, is read locally as **lajja**: a sudden, proper shame and restraint when she realises she has stepped on her husband. Many Western viewers read the same face as anger or aggression. Menon and Shweder (1994) used this to show that the meaning of an expression depends on cultural knowledge, and that lajja (a positive, socially valued restraint) has no neat English equivalent.
:::

### Rasa: an Indian theory of emotion
The **Natyashastra**, attributed to **Bharata** (roughly 200 BCE to 200 CE), is one of the oldest systematic accounts of emotion. It distinguishes:
- **Bhava**: the emotional state. Eight (later nine) **sthayi bhavas** are lasting, dominant emotions, such as love (rati), laughter (hasa), sorrow (shoka), anger (krodha), energy (utsaha), fear (bhaya), disgust (jugupsa) and wonder (vismaya).
- **Rasa**: the aesthetic "taste" of an emotion that the audience savours when a performance combines causes (vibhava), expressions (anubhava) and passing states (vyabhichari bhava). The eight rasas are **shringara** (erotic love), **hasya** (comic), **karuna** (pathos), **raudra** (fury), **vira** (heroic), **bhayanaka** (terror), **bibhatsa** (disgust) and **adbhuta** (wonder). **Abhinavagupta** (about the 10th to 11th century CE) defended a ninth, **shanta** (peace), giving the familiar **navarasa**.

Rasa theory is strikingly modern: it separates the felt emotion from its expression and context, describes transient states layered on stable ones, and studies how emotions are communicated and shared.

:::widget sort
{
  "prompt": "Match each rasa to the emotion it savours.",
  "buckets": ["Karuna", "Raudra", "Bhayanaka", "Adbhuta"],
  "items": [
    { "text": "A mother weeping for a lost son in a Kathakali scene", "bucket": 0 },
    { "text": "Bhima's fury as he vows revenge", "bucket": 1 },
    { "text": "A demon's sudden appearance making the audience shrink back", "bucket": 2 },
    { "text": "Krishna revealing the universe in his mouth", "bucket": 3 },
    { "text": "An audience moved by a widow's grief", "bucket": 0 },
    { "text": "Astonishment at a magical transformation", "bucket": 3 }
  ]
}
:::

### Facial feedback
The **facial feedback hypothesis** (from Darwin, James, Tomkins and Izard) says expressions do not only show emotion; they also **feed back** and intensify it. In **Strack, Martin and Stepper's** (1988) study, people holding a pen in their **teeth** (which forces a smile) rated cartoons as funnier than people holding a pen in their **lips** (which blocks a smile).

:::trap Facial feedback: small, not zero
A 17-lab replication of the pen study (Wagenmakers and colleagues, 2016) found no effect. Later work suggested the replication's video cameras may have made people self-conscious (Noah and colleagues, 2018), and a meta-analysis (Coles, Larsen and Lench, 2019) found a **small but real** effect overall. Answer exam questions on facial feedback with "small effects, contested methods", not "proven" or "debunked".
:::

### Dimensions and wheels
Not everyone thinks in discrete emotions:
- **Robert Plutchik's wheel** has eight primary emotions in four opposing pairs (joy and sadness, trust and disgust, fear and anger, surprise and anticipation), with blends such as love (joy plus trust).
- **James Russell's circumplex** (1980) places all feelings on two dimensions: **valence** (pleasant to unpleasant) and **arousal** (calm to excited). Excitement is pleasant and high-arousal; contentment is pleasant and low-arousal; anxiety is unpleasant and high; sadness is unpleasant and low.
- **Watson and Tellegen** found that **positive affect** and **negative affect** are relatively independent dimensions (measured by the **PANAS**).

:::clinician
The universality debate continues. Russell (Psychological Bulletin, 1994) argued that Ekman's forced-choice method inflated agreement; free-labelling studies show lower consensus. Gendron and colleagues (2014) found that the Himba of Namibia sorted faces mainly by valence and arousal rather than into Western categories, and Jack and colleagues (PNAS, 2012) showed that East Asian observers rely more on the eyes and do not represent the six categories as distinctly. The current consensus is **minimal universality**: some facial movements reliably signal broad states such as positive versus negative and high versus low arousal across cultures, while specific categories, intensity and meaning are culturally shaped. The **Many Smiles Collaboration** (Coles and colleagues, Nature Human Behaviour, 2022; 19 countries) found that voluntary smiling and facial mimicry produced small increases in happiness, while the pen-in-mouth task did not. Rasa theory has been used in contemporary research on emotion in music and dance (Hejmadi, Davidson and Rozin, 2000, showed that Americans and Indians could recognise rasa-based bhavas performed by an Indian dancer above chance), and it is a common NET short-note topic under Indian psychology.
:::

:::recall
1. Name Ekman's six basic emotions. || Happiness, sadness, fear, anger, disgust, surprise (contempt added later).
2. What are display rules? || Cultural norms about which emotions may be shown, by whom and when.
3. What is lajja and why is it important? || A socially valued restraint or shame, shown by Kali's protruding tongue in Odisha; it shows expressions are read through cultural knowledge (Menon and Shweder).
4. List the eight rasas of the Natyashastra and the ninth added later. || Shringara, hasya, karuna, raudra, vira, bhayanaka, bibhatsa, adbhuta; shanta (Abhinavagupta).
5. What two dimensions define Russell's circumplex? || Valence and arousal.
:::

:::mcq
Q: In Russell's circumplex model, "calm contentment" lies in which region?
- Unpleasant, high arousal
- *Pleasant, low arousal
- Unpleasant, low arousal
- Pleasant, high arousal
> Contentment is pleasant and low in arousal.

Q: Which statement about the facial feedback hypothesis best reflects current evidence?
- It has been completely disproved
- It shows that facial expressions are the only cause of emotion
- *Expressions can slightly intensify feelings, but effects are small and method-dependent
- It works only in Western cultures
> Meta-analysis and the Many Smiles study point to small effects.

Q: In rasa theory, the aesthetic emotion savoured by the audience is called:
- *Rasa
- Sthayi bhava
- Vibhava
- Anubhava
> Bhava is the emotion; rasa is its aesthetic savouring.
:::

## 2.7 Stress in depth: appraisal, coping and personality types [core][beginner]
### Lazarus and Folkman's transactional model (1984)
Selye looked at the body. **Richard Lazarus and Susan Folkman** said stress is a **transaction** between person and environment: it exists when a person appraises demands as **taxing or exceeding their resources** and endangering their wellbeing.

1. **Primary appraisal**: "Is this relevant to me, and how?" The event may be **irrelevant**, **benign-positive**, or **stressful**. Stressful appraisals come in three kinds: **harm or loss** (damage already done), **threat** (damage expected) and **challenge** (a chance for growth).
2. **Secondary appraisal**: "What can I do about it?" The person weighs coping options and resources: skills, money, social support, time.
3. **Reappraisal**: as things change, the person re-evaluates.

The same viva exam can be a threat for one student and a challenge for another. Challenge appraisals go with better performance and healthier cardiovascular responses.

### Coping
**Coping** is the effort, thought or action used to manage demands appraised as stressful. Lazarus and Folkman separated:
- **Problem-focused coping**: changing the situation (making a study plan, negotiating a deadline, getting a loan restructured).
- **Emotion-focused coping**: changing how you feel about it (venting, reappraising, distracting yourself, praying, accepting).

Other useful splits:
- **Approach versus avoidance** coping (Roth and Cohen, 1986): facing the stressor or turning away from it. Avoidance helps briefly but usually harms in the long run.
- **Meaning-focused coping** (Folkman, 1997): drawing on values and beliefs to find meaning, such as finding purpose while caring for a dying partner.
- **Religious coping** (Pargament): **positive** (seeking spiritual support, benevolent reappraisal) or **negative** ("God is punishing me"). Negative religious coping predicts worse outcomes.

No style is always best. The **goodness-of-fit** idea says problem-focused coping suits **controllable** stressors and emotion-focused coping suits **uncontrollable** ones. Measures include the **Ways of Coping Questionnaire** and Carver's **COPE** and **Brief COPE** (14 subscales such as active coping, planning, denial, substance use, humour, religion and acceptance).

:::widget decide
{
  "scene": "Mrs Kulkarni, 52, in Nagpur, cares for her husband after a severe stroke. Doctors say his disability is likely to be permanent. She spends nights reading about miracle cures and getting angry at every new specialist.",
  "ask": "Which coping suggestion fits the goodness-of-fit idea best?",
  "choices": [
    { "label": "Keep searching for a cure: problem-focused coping is always best", "verdict": "harm", "outcome": "She exhausts herself and her savings on unproven treatments.", "why": "For an uncontrollable stressor, relentless problem-solving aimed at the unchangeable increases distress." },
    { "label": "Accept what cannot change, find meaning and support, and use problem-solving for the parts she can control, like respite care and his physiotherapy routine", "verdict": "best", "outcome": "She joins a carers' group, arranges two afternoons of help, and sleeps better.", "why": "Emotion- and meaning-focused coping for the uncontrollable, problem-focused coping for the controllable parts." },
    { "label": "Avoid thinking about it and keep busy all the time", "verdict": "ok", "outcome": "It helps for a while, then she breaks down.", "why": "Avoidance can give short relief but tends to fail with long-term stressors." }
  ]
}
:::

### Personality and stress: Types A to D
**Meyer Friedman and Ray Rosenman**, two San Francisco cardiologists, noticed in the 1950s that their heart patients seemed driven and impatient (an upholsterer reportedly pointed out that the front edges of their waiting-room chairs were worn). They described the **Type A behaviour pattern**:
- **Competitive achievement striving**
- **Time urgency** and impatience
- **Hostility** and aggressiveness

**Type B** people are relaxed, patient and easy-going. In the **Western Collaborative Group Study** (over 3,000 men followed for about eight and a half years), Type A men had about **twice** the rate of coronary heart disease. Later, larger studies were less consistent, and researchers found that the "toxic" part is **hostility**, especially **cynical hostility** (a mistrustful, angry view of others).

Two later types are often examined:
- **Type C** (Lydia Temoshok, 1980s): cooperative, unassertive, patient, suppressing negative emotions; proposed as cancer-prone. Evidence is **weak**.
- **Type D** ("distressed"; Johan Denollet, 1996): **negative affectivity** plus **social inhibition** (high worry and gloom, combined with not sharing it). Linked with worse outcomes in heart patients, though later studies were mixed. Measured with the 14-item **DS14**.

:::mnemonic Types in one line
**A**: Aggressive, in A hurry. **B**: Be calm. **C**: Cooperative, Conceals feelings (Cancer, weak evidence). **D**: Distressed: gloomy and keeps it in.
:::

### Protective personality factors
- **Hardiness** (Suzanne Kobasa, 1979), from a study of executives at Illinois Bell during a stressful company break-up: the **three Cs** of **commitment** (involvement rather than alienation), **control** (believing you can influence events) and **challenge** (seeing change as an opportunity).
- **Sense of coherence** (Aaron Antonovsky): seeing life as **comprehensible**, **manageable** and **meaningful**. Antonovsky founded **salutogenesis**, the study of what keeps people healthy rather than what makes them ill.
- **Optimism**, internal **locus of control** and **social support** also buffer stress.

:::widget sort
{
  "prompt": "Which personality pattern is each description?",
  "buckets": ["Type A", "Type C", "Type D", "Hardiness"],
  "items": [
    { "text": "Honks at every red light, interrupts others, works through lunch", "bucket": 0 },
    { "text": "Always agreeable, never complains, hides anger even when wronged", "bucket": 1 },
    { "text": "Worries constantly and feels low, but tells nobody", "bucket": 2 },
    { "text": "Sees a forced job transfer as a chance to learn and stays fully involved", "bucket": 3 },
    { "text": "Cynical about colleagues' motives, quick to irritation", "bucket": 0, "why": "Cynical hostility is the component of Type A most linked with heart disease." },
    { "text": "Commitment, control and challenge", "bucket": 3 }
  ]
}
:::

:::clinician
Meta-analyses (Booth-Kewley and Friedman, 1987; Miller and colleagues, 1996) confirm that hostility and anger predict coronary heart disease more consistently than global Type A, partly through cardiovascular reactivity, health behaviours and social isolation. The Multiple Risk Factor Intervention Trial (MRFIT) found no global Type A effect, although its hostility measures did predict outcome. Global Type A was measured by the Structured Interview (scored on speech style as much as content) and the Jenkins Activity Survey. Type D's predictive value fell in later, larger cohorts once depression and disease severity were controlled (Grande and colleagues, 2012). Antonovsky's Sense of Coherence scale (SOC-29 and SOC-13) has strong links with perceived health. In India, research on stress and coping often finds family support and religious or spiritual coping as prominent resources; a good answer notes that "emotion-focused" coping such as acceptance or prayer is not automatically maladaptive, a point the goodness-of-fit model makes explicit.
:::

:::recall
1. Define stress in the transactional model. || A relationship in which the person appraises demands as taxing or exceeding their resources and endangering wellbeing.
2. Name the three kinds of stressful primary appraisal. || Harm or loss, threat, challenge.
3. What is the goodness-of-fit hypothesis of coping? || Problem-focused coping suits controllable stressors; emotion-focused coping suits uncontrollable ones.
4. Which component of Type A best predicts heart disease? || Hostility, especially cynical hostility.
5. What two traits define Type D? || Negative affectivity and social inhibition.
6. What are Kobasa's three Cs of hardiness? || Commitment, control and challenge.
:::

:::mcq
Q: A student says, "My chances in the viva are poor and I can't do anything about it." In Lazarus's terms, this mainly reflects:
- A positive primary appraisal
- Reappraisal as a challenge
- Problem-focused coping
- *A secondary appraisal of few coping resources
> Secondary appraisal asks what can be done and with what resources.

Q: Antonovsky's three components of a sense of coherence are:
- Commitment, control and challenge
- *Comprehensibility, manageability and meaningfulness
- Autonomy, competence and relatedness
- Alarm, resistance and exhaustion
> The SOC components; the three Cs belong to hardiness.
:::

## 2.8 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: In self-determination theory, "I study because I'd feel ashamed if I failed" is:
- External regulation
- Identified regulation
- *Introjected regulation
- Intrinsic motivation
> Guilt and ego involvement mark introjection.

Q: Which kind of reward is most likely to undermine intrinsic motivation?
- *An expected, tangible reward given for doing an enjoyable task
- Unexpected verbal praise
- Informational feedback
- No reward at all
> Expected, tangible, contingent rewards undermine; praise tends not to.

Q: Weiner would predict the LEAST future motivation after a failure attributed to:
- Lack of effort
- Bad luck
- A noisy exam hall
- *Low ability
> Low ability is internal, stable and uncontrollable.

Q: The reformulated learned helplessness model links depression to explaining bad events as:
- External, unstable and specific
- Internal, unstable and specific
- *Internal, stable and global
- External, stable and global
> This explanatory style predicts depression.

Q: The strongest source of self-efficacy according to Bandura is:
- Verbal persuasion
- Watching others
- Physiological states
- *Mastery experiences
> Personal success is the most powerful source.

Q: The TAT was created by:
- *Murray and Morgan
- McClelland and Atkinson
- Rorschach and Binet
- Deci and Ryan
> Henry Murray and Christiana Morgan, 1935.

Q: Socially oriented achievement motivation was described by:
- McClelland and Winter
- *Agarwal and Misra
- Zuckerman
- Kobasa
> Indian research, 1986.

Q: Which is NOT one of Zuckerman's sensation-seeking subscales?
- Thrill and adventure seeking
- *Achievement striving
- Disinhibition
- Boredom susceptibility
> The four are thrill and adventure seeking, experience seeking, disinhibition, boredom susceptibility.

Q: Csikszentmihalyi collected data on flow mainly with:
- *The experience sampling method
- Lesion studies
- The TAT
- Brain scans
> Participants recorded experience when signalled at random times.

Q: In "wanting versus liking", dopamine is most closely tied to:
- The pleasure of a sweet taste
- Satiety after a meal
- *Incentive salience, the pull towards a reward
- Pain relief
> Dopamine mediates wanting; opioid hotspots mediate liking.

Q: In the Capilano bridge study, men on the scary bridge:
- Rated the interviewer as less attractive
- Showed no difference from the control group
- Refused to take part
- *Were more likely to call the interviewer later, suggesting misattributed arousal
> Fear arousal was partly read as attraction.

Q: The Lazarus-Zajonc debate was about whether:
- Emotions are inherited
- *Emotion requires prior cognitive appraisal
- Stress causes illness
- Facial expressions are universal
> Zajonc argued affect can precede cognition.

Q: Ekman's research among the Fore of Papua New Guinea supported:
- The two-factor theory
- The overjustification effect
- Type A behaviour
- *The universality of some basic facial expressions
> They matched expressions to stories much as Westerners did.

Q: Abhinavagupta is credited with defending which rasa as the ninth?
- Vira
- Adbhuta
- *Shanta
- Hasya
> Shanta (peace) completed the navarasa.

Q: A person who sees a sudden job loss as "a chance to retrain" is making which primary appraisal?
- *Challenge
- Harm or loss
- Threat
- Irrelevant
> Challenge appraisals focus on potential gain or growth.
:::
`;
