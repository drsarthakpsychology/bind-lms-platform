import type { LongQA } from "@/lib/prep/long-types";

const S = "learning-motivation-emotion" as const;

export const LEARNING_MOTIVATION_EMOTION_L03: LongQA[] = [
  {
    id: "lme-l03-021",
    subject: S,
    topic: "motivation-theories",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Critically evaluate the major theories of motivation: instinct theory, drive reduction theory, arousal theory, incentive theory and Maslow's need hierarchy.",
    plan: ["Define motivation and its features", "Instinct theory and critique", "Drive reduction theory: Hull, homeostasis, critique", "Arousal theory and Yerkes Dodson", "Incentive theory and expectancy", "Maslow's hierarchy, comparison and conclusion"],
    answer: `## Meaning
Motivation refers to the processes that energise, direct and sustain behaviour towards goals. It explains why people act, why they choose particular goals, and how hard and how long they persist. Motives may be biological (hunger, thirst, sex), social (achievement, affiliation, power) or cognitive (curiosity, competence). Each theory of motivation emphasises a different source.

## Instinct theory
William McDougall in 1908 proposed that behaviour is driven by innate instincts, such as flight (fear), pugnacity (anger), curiosity and parental care, each linked to an emotion. Freud's life and death instincts were also instinct theories. Ethologists such as Konrad Lorenz and Niko Tinbergen studied fixed action patterns in animals.
Critique:
- The list of instincts grew to thousands, and naming behaviour ("people fight because of a fighting instinct") is circular: it describes rather than explains.
- Human behaviour is highly variable across cultures and shaped by learning.
- The idea survives in evolutionary psychology, which studies evolved predispositions rather than fixed instincts.

## Drive reduction theory
Clark Hull in 1943 proposed that biological needs (deprivation of food or water) create drives, states of psychological tension that push the organism to act. Behaviour that reduces the drive is reinforced, and the organism returns to homeostasis, a balanced internal state (a concept from Walter Cannon). Primary drives arise from biological needs; secondary drives, such as the desire for money, are learned through association with primary drive reduction. Hull expressed this in an equation: reaction potential = habit strength x drive.
Strengths: links motivation to learning and physiology; explains basic biological motives well.
Critique:
- People and animals often seek stimulation that increases tension: curiosity, exploration, play, thrill seeking. Harry Harlow's monkeys solved puzzles repeatedly without any reward.
- Eating continues when we are full if food is tasty, and people fast or diet despite hunger.
- Secondary reinforcers such as saccharin, which has no nutritive value, are reinforcing.
- It cannot easily explain long-term goals such as building a career.

## Arousal theory
Arousal theory proposes that people are motivated to maintain an optimal level of arousal, not to reduce arousal to zero. When under-aroused (bored), we seek stimulation; when over-aroused (stressed), we seek calm.
- The Yerkes Dodson law: performance increases with arousal up to an optimal point and then declines (an inverted U); the optimal level is lower for complex tasks and higher for simple ones.
- Sensory deprivation studies by Woodburn Heron and colleagues found that students paid to lie in featureless cubicles soon became restless and disoriented, showing a need for stimulation.
- Marvin Zuckerman's sensation seeking trait describes individual differences in optimal arousal.
Strengths: explains curiosity and thrill seeking. Critique: arousal is hard to measure as a single variable, and the theory says little about which goals people choose.

## Incentive theory
Incentive theories emphasise external goals that pull behaviour, rather than internal drives that push it. Incentives can be positive (rewards) or negative (things to avoid). Their value depends on the person and context: the smell of food attracts even when one is not hungry.
- Expectancy value theory (Victor Vroom, John Atkinson): motivation equals the expectancy of reaching a goal multiplied by the value of the goal.
- Kent Berridge distinguished "wanting" (incentive salience, dopamine-driven) from "liking" (pleasure, opioid-driven), important in addiction.
Critique: incentives alone do not explain biological drives or intrinsic motivation, and rewards can undermine intrinsic interest.

## Maslow's need hierarchy
Abraham Maslow in 1943 proposed that human needs are arranged in a hierarchy:
- Physiological needs (food, water, sleep).
- Safety needs (security, stability, freedom from fear).
- Belongingness and love needs (relationships, acceptance).
- Esteem needs (achievement, recognition, respect).
- Self-actualisation (realising one's potential).
Lower needs (deficiency needs) must be largely satisfied before higher needs (growth needs) become dominant. Later Maslow added cognitive and aesthetic needs and self-transcendence.
Strengths: integrates biological and psychological motives; emphasises growth and positive potential; widely used in education, management and nursing.
Critique:
- Little empirical support for a strict order: people pursue higher needs while lower needs are unmet (starving artists, hunger strikers, freedom fighters).
- Self-actualisation is vaguely defined, based on Maslow's selection of admired figures.
- Culturally biased: individualist cultures value self-actualisation, while collectivist cultures, including India, may place belonging and social harmony higher. Louis Tay and Ed Diener's study across 123 countries found that the needs were broadly universal and linked to wellbeing, but people could gain wellbeing from higher needs before lower ones were met.

## Comparison
| Theory | Source of motivation | Best explains | Main weakness |
| Instinct | Innate tendencies | Species-typical behaviour | Circular naming |
| Drive reduction | Internal tension from needs | Hunger, thirst | Stimulation seeking |
| Arousal | Optimal arousal level | Curiosity, boredom, thrill seeking | Vague measurement |
| Incentive | External goals | Choices, consumer behaviour | Ignores internal states |
| Maslow | Hierarchy of needs | Broad human strivings | Weak evidence for order |

## Conclusion
No single theory explains all motivation. Biological drives and homeostasis explain basic needs, arousal theory explains stimulation seeking, incentive and expectancy theories explain goal choice, and Maslow's model draws attention to higher human needs. Modern approaches, such as self-determination theory, integrate biological, cognitive and social factors.`,
    keyPoints: ["Definition of motivation", "Instinct theory and circularity", "Hull's drive reduction and homeostasis", "Critique with curiosity and Harlow", "Arousal theory with Yerkes Dodson and sensory deprivation", "Incentive and expectancy value", "Maslow's hierarchy with cultural critique and Tay and Diener", "Comparison table"],
    module: "motivation-emotion/1-1",
    visuals: [
      { kind: "layers", caption: "Maslow's need hierarchy", data: { title: "Maslow's hierarchy of needs", shape: "pyramid", layers: [{ label: "Self-actualisation", detail: "Realising one's potential." }, { label: "Esteem", detail: "Achievement, respect, recognition." }, { label: "Belongingness and love", detail: "Friendship, family, acceptance." }, { label: "Safety", detail: "Security, stability, freedom from fear." }, { label: "Physiological", detail: "Food, water, sleep, warmth." }] } },
      { kind: "curve", caption: "Arousal theory", data: { kind: "inverted-u", title: "Arousal and performance", caption: "Raise arousal for an easy and a hard task. Where does each peak?" } },
    ],
    ref: "McDougall 1908; Hull 1943; Yerkes and Dodson 1908; Heron 1957; Zuckerman 1979; Berridge and Robinson 1998; Maslow 1943 and 1954; Tay and Diener 2011 JPSP; Atkinson and Hilgard ch 10",
  },
  {
    id: "lme-l03-022",
    subject: S,
    topic: "arousal",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Explain the Yerkes Dodson law and the concept of optimal arousal. Discuss sensation seeking and the applications of arousal theory.",
    plan: ["Arousal and its physiology", "Yerkes Dodson law with task difficulty", "Evidence and explanations", "Sensation seeking", "Applications and criticisms"],
    answer: `## Arousal
Arousal is the general level of physiological and psychological activation, ranging from deep sleep to intense excitement. It involves the reticular activating system in the brainstem, the sympathetic nervous system and hormones such as adrenaline and cortisol. Arousal theory holds that people seek an optimal level of arousal, neither too low nor too high.

## The Yerkes Dodson law
In 1908 Robert Yerkes and John Dodson found that mice learned to choose between a white and a black box fastest with moderate electric shocks for errors; very weak and very strong shocks slowed learning. Moreover, the optimal shock was lower when the discrimination was harder. The law is stated as:
- Performance improves with arousal up to an optimal point, beyond which it declines, forming an inverted U.
- The optimal level of arousal is higher for simple or well-learned tasks and lower for complex or new tasks.
Examples: a little anxiety before an exam sharpens focus, but panic causes one's mind to go blank; a sprinter performs well at high arousal, while a surgeon or a chess player needs calm.

## Explanations
- J. A. Easterbrook's cue utilisation hypothesis: rising arousal narrows attention. At first, irrelevant cues are excluded, improving performance; at high arousal, relevant cues are also excluded.
- Attentional control theory: anxiety consumes working memory resources needed for complex tasks.
- Hans Eysenck's personality theory: introverts have higher baseline cortical arousal and so avoid stimulation, while extraverts seek it.

## Sensation seeking
Marvin Zuckerman described sensation seeking as a trait involving the need for varied, novel, complex and intense experiences and the willingness to take risks for them. His Sensation Seeking Scale has four subscales:
- Thrill and adventure seeking (bungee jumping, fast driving).
- Experience seeking (travel, unusual art, music).
- Disinhibition (parties, drinking).
- Boredom susceptibility.
High sensation seekers are more likely to engage in extreme sports, risky driving, substance use and varied sexual behaviour; the trait peaks in adolescence and early adulthood and is higher in males on average. It has been linked to dopamine and to low levels of the enzyme MAO.

## Applications
- Education and exams: helping students reach moderate arousal through preparation, reappraisal of nerves as excitement (which Alison Wood Brooks found improved performance) and relaxation if anxious.
- Sports psychology: arousal regulation through relaxation, psyching-up routines and the individual zones of optimal functioning model of Yuri Hanin.
- Workplace design: avoiding both monotony and overload; vigilance tasks suffer from low arousal.
- Clinical: anxiety disorders involve excessive arousal; ADHD may involve seeking stimulation to raise low arousal; boredom proneness relates to depression and risk-taking.
- Prevention: targeting high sensation seekers with exciting, novel anti-drug messages.

## Criticisms
- The inverted U is a general description; real data are often noisy, and "arousal" combines different physiological systems that do not always move together.
- It is hard to specify the optimal level in advance, making the law difficult to falsify.
- The original study concerned mice and shock intensity, not human arousal as such; later extrapolation went beyond the data.

## Conclusion
The Yerkes Dodson law captures a widely observed principle: moderate arousal is best, especially for complex tasks. Sensation seeking shows that people differ in their optimal levels. Together they explain why some people seek challenges and others avoid them.`,
    keyPoints: ["Definition and physiology of arousal", "Yerkes Dodson original study", "Inverted U and task difficulty", "Easterbrook's cue utilisation", "Zuckerman's sensation seeking with subscales", "Applications in exams, sport and clinical work", "Criticisms"],
    module: "motivation-emotion/1-1",
    visuals: [
      { kind: "curve", caption: "The Yerkes Dodson law", data: { kind: "inverted-u", caption: "Try a simple task and a complex task: the complex task peaks at a lower arousal." } },
    ],
    ref: "Yerkes and Dodson 1908; Easterbrook 1959; Zuckerman 1979 and 1994; Brooks 2014 reappraisal; Hanin 2000; Teigen 1994 on the history of the law",
  },
  {
    id: "lme-l03-023",
    subject: S,
    topic: "hunger-thirst",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "md-psychiatry"],
    question: "Discuss the physiological and psychological factors that regulate hunger and eating. How do they help explain obesity and eating disorders?",
    plan: ["Hunger as a homeostatic and hedonic system", "Peripheral signals: stomach, glucose, hormones", "Brain mechanisms: hypothalamus and beyond", "Psychological, social and cultural factors", "Obesity and set point", "Eating disorders and conclusion"],
    answer: `## Hunger as a regulated system
Eating is controlled by two interacting systems: a homeostatic system that maintains energy balance, and a hedonic system that responds to the pleasure and availability of food. Biological signals tell the brain when energy is needed, while learning, emotion and culture shape what, when and how much we eat.

## Peripheral signals
- Stomach contractions: Walter Cannon and A. L. Washburn had Washburn swallow a balloon to record stomach contractions, which coincided with reports of hunger. But people whose stomachs have been removed still feel hunger, so contractions are not essential.
- Stomach distension and stretch receptors signal fullness through the vagus nerve.
- Blood glucose: falling glucose and its use by cells (glucostatic theory of Jean Mayer) contribute to hunger; insulin from the pancreas helps cells take up glucose.
- Ghrelin, secreted by the empty stomach, rises before meals and stimulates hunger.
- Cholecystokinin (CCK) and peptide YY, released by the intestine after eating, signal satiety and end meals.
- Leptin, secreted by fat cells in proportion to fat stores, signals long-term energy status to the hypothalamus and reduces appetite (lipostatic theory). Mice lacking the gene for leptin (ob/ob mice) become very obese, and leptin injections reduce their weight.

## Brain mechanisms
- The dual centre theory of the 1950s held that the lateral hypothalamus is a hunger centre (lesions caused rats to stop eating, stimulation caused eating) and the ventromedial hypothalamus is a satiety centre (lesions produced overeating and obesity, demonstrated by Albert Hetherington and Stephen Ranson). This view was too simple: lesions affected nearby fibre tracts and metabolism, and VMH-lesioned rats became fussy eaters.
- The modern view centres on the arcuate nucleus of the hypothalamus, which contains two groups of neurons: NPY and AgRP neurons that stimulate hunger (activated by ghrelin, inhibited by leptin), and POMC neurons that suppress hunger (activated by leptin). They project to the paraventricular nucleus and lateral hypothalamus (orexin neurons).
- The brainstem (nucleus of the solitary tract) integrates signals from the gut.
- Reward circuits, especially dopamine in the nucleus accumbens and opioids, mediate the pleasure and wanting of palatable food; the orbitofrontal cortex codes the changing value of foods.

## Psychological, social and cultural factors
- Sensory-specific satiety: we tire of one food but still want another, which is why there is "room for dessert". Barbara Rolls showed people ate more from a buffet with varied foods.
- Learned cues: the time of day, the sight and smell of food, and plate size. Brian Wansink's studies of portion size and plate size became influential, though several of his papers were later retracted for poor research practice; the general finding that larger portions increase intake has been replicated by others.
- Conditioned hunger and taste aversions.
- Social facilitation: people eat more in groups, as John de Castro found.
- Emotional eating: some people eat more under stress or low mood; others eat less.
- Restrained eating: Peter Herman and Janet Polivy found that chronic dieters, after a forced "preload" milkshake, ate more ice cream than non-dieters (the "what-the-hell" effect), because their dietary rules were broken.
- Culture: what counts as food, meal timing, fasting practices (such as during Navratri or Ramadan), vegetarianism and body ideals vary across cultures.
- Externality hypothesis: Stanley Schachter proposed that obese people respond more to external food cues than to internal hunger signals; this was later found to apply to many people, not only the obese.

## Obesity
- Obesity results from a long-term imbalance between energy intake and expenditure, influenced by genes (heritability of BMI about 40 to 70 percent in twin studies), environment and behaviour.
- Set point theory: the body defends a particular weight through changes in appetite and metabolism, which explains why dieting often leads to weight regain. Settling point theory suggests the "set point" shifts with the environment.
- The obesogenic environment: cheap, energy-dense, highly palatable food, large portions, sedentary work and screen time.
- In India, rising obesity and type 2 diabetes in urban areas coexist with undernutrition, the "double burden of malnutrition". Indians tend to develop diabetes at lower BMI and have more abdominal fat, so lower BMI cut-offs are used.
- Weight stigma harms mental health and may increase overeating.

## Eating disorders
- Anorexia nervosa involves restriction leading to significantly low body weight, intense fear of weight gain and disturbed body image. Hunger signals are overridden by cognitive control and fear; starvation itself causes preoccupation with food, as Ancel Keys's Minnesota starvation study showed in healthy men. Dopamine and serotonin abnormalities, perfectionism and cultural ideals contribute.
- Bulimia nervosa and binge eating disorder involve episodes of loss of control over eating. Restraint, negative affect and the "what-the-hell" pattern help explain the binge-diet cycle; in bulimia, compensatory behaviours such as vomiting follow.
- Cultural factors: once thought rare in India, eating disorders are increasingly reported in urban adolescents, linked to media ideals and academic pressure.

## Conclusion
Hunger is regulated by peripheral signals such as ghrelin, CCK and leptin acting on hypothalamic circuits, while reward systems, learning, emotion and culture strongly influence eating. Obesity and eating disorders arise when these systems are overridden or dysregulated in particular environments.`,
    keyPoints: ["Homeostatic and hedonic systems", "Stomach, glucose, ghrelin, CCK and leptin", "Dual centre theory and its revision", "Arcuate nucleus neurons", "Psychological factors: sensory-specific satiety, restraint, social facilitation", "Cultural influences including fasting", "Obesity, set point and Indian double burden", "Eating disorders with Minnesota study"],
    module: "motivation-emotion/1-2",
    visuals: [
      { kind: "flow", caption: "Peripheral signals", data: { title: "Signals that start and stop eating", layout: "tree", nodes: [{ id: "h", label: "Hypothalamus (arcuate nucleus)" }, { id: "g", label: "Ghrelin from the empty stomach", parent: "h", detail: "Starts hunger." }, { id: "c", label: "CCK and stretch from the gut", parent: "h", detail: "Ends a meal." }, { id: "l", label: "Leptin from fat cells", parent: "h", detail: "Long-term brake on appetite." }, { id: "r", label: "Reward circuits", parent: "h", detail: "Tasty food can override fullness." }] } },
      { kind: "brainmap", caption: "Brain mechanisms", data: { title: "Brain areas in eating", focus: ["hypothalamus", "brainstem", "prefrontal"], notes: { hypothalamus: "Energy balance: arcuate, lateral and ventromedial regions.", brainstem: "Nucleus of the solitary tract receives gut signals.", prefrontal: "Orbitofrontal cortex codes how rewarding a food is now." } } },
    ],
    ref: "Cannon and Washburn 1912; Hetherington and Ranson 1940; Zhang et al 1994 leptin; Cummings et al 2001 ghrelin; Rolls et al 1981; Herman and Polivy 1975; Keys et al 1950; Bear, Connors and Paradiso ch 16; Atkinson and Hilgard ch 10; ICMR-INDIAB obesity data",
  },
  {
    id: "lme-l03-024",
    subject: S,
    topic: "hunger-thirst",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on the regulation of thirst.",
    plan: ["Two fluid compartments", "Osmotic thirst", "Hypovolaemic thirst", "Satiety and psychological factors"],
    answer: `## Two kinds of thirst
The body regulates water in two compartments: inside cells (intracellular) and outside cells (extracellular, including blood plasma). Thirst arises from loss of water in either, giving two types.

## Osmotic thirst
When we eat salty food or lose water through sweating, the concentration of salt in the extracellular fluid rises. Water moves out of cells by osmosis, and cells shrink. Osmoreceptors in the hypothalamus, especially in the organum vasculosum of the lamina terminalis (OVLT), detect this. They trigger thirst and the release of antidiuretic hormone (vasopressin) from the posterior pituitary, which makes the kidneys conserve water.

## Hypovolaemic thirst
Loss of blood volume, as through bleeding, vomiting or diarrhoea, reduces extracellular fluid without changing its concentration. Baroreceptors in the heart and blood vessels detect the drop in pressure. The kidneys release renin, which leads to the formation of angiotensin II, a hormone that acts on the subfornical organ in the brain to trigger thirst and also constricts blood vessels. People with hypovolaemic thirst prefer slightly salty water, which helps restore volume, which is why oral rehydration solution contains salt.

## Ending drinking
Drinking stops before the water is absorbed, because of signals from the mouth, throat and stomach that anticipate rehydration; otherwise we would overdrink.

## Psychological factors
Habit, taste, social drinking, temperature and culture affect drinking. Older adults have weaker thirst signals and risk dehydration. Excessive drinking (psychogenic polydipsia) occurs in some people with chronic schizophrenia, and lithium can cause excessive thirst.`,
    keyPoints: ["Two compartments", "Osmotic thirst with osmoreceptors and ADH", "Hypovolaemic thirst with renin and angiotensin", "Anticipatory satiety", "Psychological and clinical factors"],
    module: "motivation-emotion/1-2",
    visuals: [
      { kind: "compare", data: { title: "Two kinds of thirst", a: { label: "Osmotic", points: ["After salty food or sweating", "Cells shrink", "Hypothalamic osmoreceptors and vasopressin"], summary: "Too salty." }, b: { label: "Hypovolaemic", points: ["After bleeding or diarrhoea", "Blood volume falls", "Renin and angiotensin II"], summary: "Too little volume." } } },
    ],
    ref: "Bear, Connors and Paradiso ch 16; Fitzsimons 1998; Atkinson and Hilgard ch 10",
  },
  {
    id: "lme-l03-025",
    subject: S,
    topic: "motivation-theories",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Critically evaluate Maslow's hierarchy of needs, including evidence from cross-cultural research and its applications in India.",
    plan: ["Describe the hierarchy briefly", "Characteristics of self-actualisers", "Supporting evidence and uses", "Criticisms: order, method, culture", "Alderfer's ERG alternative and modern evidence", "Indian perspective and conclusion"],
    answer: `## The hierarchy
Abraham Maslow, a founder of humanistic psychology, proposed in 1943 and in "Motivation and Personality" in 1954 that human needs form a hierarchy: physiological, safety, belongingness and love, esteem, and self-actualisation. The first four are deficiency needs (D-needs): their lack creates tension. Self-actualisation is a growth need (B-need, for "being"): the desire to become everything one is capable of becoming. Higher needs emerge as lower needs are reasonably satisfied, not necessarily fully.

## Self-actualisers
Maslow studied people he considered self-actualised, such as Abraham Lincoln, Albert Einstein and Eleanor Roosevelt. He described them as realistic, accepting of self and others, spontaneous, problem-centred, independent, creative, with deep relationships, a democratic character, a philosophical sense of humour, and frequent peak experiences of awe and unity.

## Strengths
- Integrates biological and higher human needs in one framework.
- Positive view of human nature, influencing humanistic and positive psychology.
- Practical appeal: used in management (meeting workers' needs), nursing (prioritising care), education (a hungry or frightened child cannot learn) and marketing.
- Some support: when basic needs are threatened, as in famine, war or disaster, they dominate behaviour.

## Criticisms
- Order is not fixed: people pursue esteem or self-actualisation despite unmet lower needs, such as freedom fighters on hunger strike, artists in poverty or parents sacrificing safety for children. Mahmoud Wahba and Lawrence Bridwell's review found little evidence for a strict hierarchy.
- Methodology: self-actualisation was defined from Maslow's subjective selection of admired people, mostly educated Western men, so the concept is circular and value-laden.
- Vague concepts that are hard to measure.
- Cultural bias: the hierarchy reflects American individualism. Geert Hofstede and others argued that in collectivist cultures belonging, security and social harmony may be valued above individual self-actualisation, and that self-actualisation may take a social form.

## Alternatives and modern evidence
- Clayton Alderfer's ERG theory reduced the needs to three (existence, relatedness, growth), allowed several to operate at once, and proposed frustration regression: if growth is blocked, people fall back on lower needs.
- Louis Tay and Ed Diener analysed Gallup World Poll data from 123 countries and found that the needs were universal and that fulfilment of each was associated with wellbeing, but the order was not strict.
- Douglas Kenrick and colleagues proposed an evolutionary renovation, replacing self-actualisation with mate acquisition, retention and parenting.

## Indian perspective
- In India, Jai B. P. Sinha's nurturant task leadership and studies of Indian workers suggested that security and belonging, including family and caste or community ties, are strong motivators.
- Indian philosophy describes a progression of goals (purusharthas: artha, kama, dharma, moksha), sometimes compared with Maslow, with moksha resembling self-transcendence, which Maslow added late in life.
- Maslow's ideas are applied in Indian human resource management and school programmes such as the midday meal scheme, which meets physiological needs to support learning.

## Conclusion
Maslow's hierarchy is an influential, intuitively appealing model that drew attention to higher human needs. Research supports the universality of the needs but not their strict ordering, and cultural context shapes their priority.`,
    keyPoints: ["Hierarchy with deficiency and growth needs", "Characteristics of self-actualisers", "Strengths and applications", "Lack of evidence for strict order", "Methodological circularity", "Cultural bias", "ERG and Tay and Diener evidence", "Indian perspective such as purusharthas"],
    module: "motivation-emotion/1-1",
    visuals: [
      { kind: "compare", caption: "Alternatives and modern evidence", data: { title: "Maslow versus Alderfer", a: { label: "Maslow", points: ["Five levels", "Mostly one level dominant at a time", "Satisfaction leads upward"], summary: "A ladder." }, b: { label: "Alderfer ERG", points: ["Three needs: existence, relatedness, growth", "Several active at once", "Frustration can lead back down"], summary: "A flexible web." } } },
    ],
    ref: "Maslow 1943 and 1954; Wahba and Bridwell 1976; Alderfer 1969; Tay and Diener 2011; Kenrick et al 2010; Sinha 1980 The Nurturant Task Leader",
  },
  {
    id: "lme-l03-026",
    subject: S,
    topic: "motivational-conflict",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe the types of motivational conflict proposed by Kurt Lewin, and explain Miller's approach-avoidance gradients with examples.",
    plan: ["Define motivational conflict", "Lewin's four types with examples", "Miller's gradients of approach and avoidance", "Predictions and evidence", "Applications"],
    answer: `## Meaning
A motivational conflict arises when a person faces two or more incompatible goals or courses of action. Kurt Lewin, in his field theory, described goals as having valence: positive valence attracts (approach), negative valence repels (avoidance).

## Lewin's types of conflict
- Approach-approach: choosing between two attractive goals, such as two good job offers, or whether to watch a film or go to a friend's wedding. Usually the easiest to resolve, because moving towards one goal increases its attraction.
- Avoidance-avoidance: choosing between two unpleasant options, such as studying for a dull exam or failing it, or undergoing painful surgery or suffering continued illness. Often leads to vacillation, delay or attempts to escape the situation entirely ("leaving the field").
- Approach-avoidance: a single goal has both attractive and unattractive features, such as wanting to eat a rich dessert but fearing weight gain, or wanting to propose marriage but fearing rejection. The person approaches, then retreats, often staying at a point of ambivalence.
- Double (multiple) approach-avoidance: choosing between two or more options, each with positive and negative features, such as a well-paid job in a distant city versus a lower-paid job near family. Most real-life decisions are of this type.

## Miller's gradients
Neal Miller, working with rats in the 1940s, measured how strongly animals pulled towards food (approach) or away from shock (avoidance) at different distances from the goal, using a harness attached to a spring.
- Approach gradient: the tendency to approach increases as the goal gets closer.
- Avoidance gradient: the tendency to avoid also increases with closeness, but more steeply.
- Far from the goal, approach is stronger than avoidance, so the person moves towards it; near the goal, avoidance becomes stronger, so the person retreats. They oscillate around the point where the two gradients cross.
- Increasing the strength of the drive (more hunger) raises the whole approach gradient, moving the crossing point closer to the goal.

## Examples and evidence
- A person accepts a marriage proposal months ahead, but as the wedding approaches, cold feet set in.
- Seymour Epstein found that novice parachutists' fear rose as the jump approached, peaking just before jumping.
- Students sign up eagerly for a public speaking event and then want to withdraw on the day.

## Applications
- Therapy: in approach-avoidance conflicts, reducing fear (lowering the avoidance gradient) is more effective than pushing the person towards the goal, which raises both approach and avoidance. This logic underlies exposure and anxiety reduction.
- Motivational interviewing explores ambivalence about change, an approach-avoidance conflict about stopping drinking or smoking.
- Decision-making aids, such as listing pros and cons, help with double approach-avoidance conflicts.
- Prolonged unresolved conflict is a source of stress and was linked by Miller and John Dollard to psychological symptoms.

## Conclusion
Lewin's classification and Miller's gradients explain why some decisions are easy and others produce hesitation, oscillation and stress, and suggest that reducing avoidance is often the key to resolving conflict.`,
    keyPoints: ["Definition and valence", "Four types with examples", "Typical outcomes such as vacillation and leaving the field", "Miller's approach and avoidance gradients", "Steeper avoidance gradient and oscillation", "Effect of drive strength", "Applications including motivational interviewing"],
    module: "motivation-emotion/1-1",
    visuals: [
      { kind: "sort", caption: "Lewin's types of conflict", data: { prompt: "Which kind of conflict?", buckets: ["Approach-approach", "Avoidance-avoidance", "Approach-avoidance", "Double approach-avoidance"], items: [{ text: "Two good colleges have offered you a seat", bucket: 0 }, { text: "Take a bitter medicine or stay ill", bucket: 1 }, { text: "You want to ask for a raise but fear the boss's reaction", bucket: 2 }, { text: "A high-paying job far away or a lower-paying job near family", bucket: 3 }] } },
    ],
    ref: "Lewin 1935; Miller 1944 and 1959; Dollard and Miller 1950; Epstein 1962",
  },
  {
    id: "lme-l03-027",
    subject: S,
    topic: "achievement-motivation",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the concept of achievement motivation, with reference to the work of McClelland and Atkinson. How is it measured, and what does research, including the Kakinada experiment in India, show about developing it?",
    plan: ["Define need for achievement and its roots in Murray", "Measurement: TAT and alternatives", "McClelland's work: characteristics, society and economy", "Atkinson's expectancy value model and risk preference", "Development and training: Kakinada experiment", "Critique, cultural perspectives and conclusion"],
    answer: `## Meaning
Achievement motivation, or need for achievement (nAch), is the desire to accomplish difficult tasks, to meet standards of excellence and to succeed in competition with oneself or others. Henry Murray listed it among his psychogenic needs in 1938. David McClelland and John Atkinson made it one of the most studied social motives.

## Measurement
- Thematic Apperception Test (TAT): participants write imaginative stories about ambiguous pictures (such as a boy sitting with a violin). Stories are scored for achievement imagery: concern with excellence, long-term goals, obstacles, striving and anticipated feelings of success or failure. McClelland argued that fantasy reveals implicit motives better than self-report.
- Picture Story Exercise, a modern version.
- Self-report questionnaires, such as the achievement scale of the Personality Research Form, measure explicit (self-attributed) motives. Implicit and explicit measures correlate weakly and predict different behaviours: implicit motives predict spontaneous long-term behaviour, explicit motives predict choices in structured situations.
- In India, Indian adaptations of the TAT and scales such as Deo and Mohan's achievement motivation scale have been used.

## McClelland's findings
- People high in nAch prefer tasks of moderate difficulty with a realistic chance of success, take personal responsibility for outcomes, want concrete feedback, are persistent, and plan for the future. They are attracted to entrepreneurship rather than to roles determined by chance or seniority.
- In "The Achieving Society", published in 1961, McClelland argued that the level of achievement imagery in a society's children's books and folk tales predicted its later economic growth, linking motivation to national development. He traced this to child rearing that encouraged independence and mastery, and to Max Weber's ideas on the Protestant ethic.
- McClelland also studied need for power (nPow) and need for affiliation (nAff); the "leadership motive pattern" (high power, low affiliation, high self-control) predicted managerial success.

## Atkinson's expectancy value model
John Atkinson in 1957 proposed that the tendency to approach an achievement task depends on two opposing motives:
- The motive to achieve success (Ms), multiplied by the probability of success (Ps) and the incentive value of success (Is), where Is = 1 minus Ps (easier tasks give less satisfaction).
- The motive to avoid failure (Maf), multiplied by the probability of failure and the negative incentive of failure.
Predictions:
- People high in Ms relative to Maf prefer tasks of moderate difficulty (Ps about 0.5), where the product Ps x (1 minus Ps) is greatest.
- People high in fear of failure prefer very easy tasks (sure success) or very hard tasks (failure is no disgrace).
The ring toss game: high achievers stood at intermediate distances from the peg; anxious participants stood very close or very far.
Matina Horner later proposed a "fear of success" in women, reflecting social expectations, though this was not consistently supported.

## Developing achievement motivation: the Kakinada experiment
McClelland and David Winter, with Indian collaborators, conducted achievement motivation training for small business owners in Kakinada, Andhra Pradesh, in 1964, under the Small Industries Extension Training Institute in Hyderabad. The ten-day course taught participants to think and talk in achievement terms (scoring their own TAT stories), set moderate and realistic goals, analyse their behaviour and plan, supported by group discussion and case studies.
- Follow-up after about two years found that trained participants had started more new businesses, invested more capital, employed more workers and worked longer hours than untrained comparison groups in the same and another town.
- Udai Pareek and T. Venkateswara Rao extended achievement motivation training in Indian entrepreneurship development programmes, schools and organisations.
- Critics noted that participants were selected, that the comparison group was not randomly assigned, and that effects depended on access to resources and a favourable environment.

## Critique
- The TAT has modest reliability, and scoring is time-consuming.
- Western, individualistic bias: achievement may be understood differently in collectivist cultures. Indian and East Asian research suggests achievement is often socially oriented, motivated by family honour and obligations (socially oriented achievement motivation, described by An-Bang Yu and Kuo-Shu Yang), rather than purely individual excellence.
- The link between national achievement imagery and economic growth is correlational, and many other factors drive growth.
- Modern theories emphasise cognitive factors: Bernard Weiner's attributions, Carol Dweck's mindsets and achievement goals (mastery versus performance goals).

## Conclusion
Achievement motivation, measured through fantasy and self-report, predicts preference for moderate risk, persistence and entrepreneurial behaviour. Atkinson's expectancy value model explains risk preference, and the Kakinada experiment suggested that the motive can be developed through training, though cultural context shapes how achievement is defined and pursued.`,
    keyPoints: ["Definition and Murray's origin", "TAT measurement and implicit versus explicit motives", "Characteristics of high nAch people", "The Achieving Society", "Atkinson's model with moderate difficulty prediction", "Ring toss evidence", "Kakinada experiment with design and findings", "Critique including cultural perspectives"],
    pitfalls: ["Getting Atkinson's Is = 1 minus Ps wrong", "Presenting Kakinada as a randomised trial"],
    module: "motivation-emotion/2-1",
    visuals: [
      { kind: "compare", caption: "Atkinson's expectancy value model", data: { title: "Who chooses which task?", a: { label: "High need for achievement", points: ["Picks moderate difficulty", "Wants feedback", "Takes responsibility"], summary: "Stands at a middle distance in ring toss." }, b: { label: "High fear of failure", points: ["Picks very easy or very hard tasks", "Avoids evaluation", "Explains failure away"], summary: "Stands very close or very far." } } },
      { kind: "worked", caption: "McClelland's findings", data: { title: "Atkinson's model", steps: [{ q: "Incentive value of success if Ps = 0.9?", a: "Is = 1 minus 0.9 = 0.1" }, { q: "Ps x Is for Ps = 0.9, 0.5 and 0.1?", a: "0.09, 0.25 and 0.09" }, { q: "Which task does a success-oriented person prefer?", a: "The moderate one, Ps = 0.5, where the product is largest." }] } },
    ],
    ref: "Murray 1938; McClelland et al 1953; McClelland 1961 The Achieving Society; Atkinson 1957 Psychological Review; McClelland and Winter 1969 Motivating Economic Achievement; Pareek 1968; Yu and Yang 1994; McClelland, Koestner and Weinberger 1989",
  },
  {
    id: "lme-l03-028",
    subject: S,
    topic: "self-determination",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss self-determination theory. Explain intrinsic and extrinsic motivation, the continuum of internalisation, the three basic psychological needs and the overjustification effect, and evaluate the theory's applications in education, work and health.",
    plan: ["Introduce SDT and its view of human nature", "Intrinsic versus extrinsic motivation and the continuum", "Three basic needs", "Overjustification and cognitive evaluation theory with evidence", "Applications in education, work, health and therapy", "Cross-cultural evidence, critique and conclusion"],
    answer: `## Self-determination theory
Self-determination theory (SDT), developed by Edward Deci and Richard Ryan from the 1970s, is a broad theory of human motivation and personality. It assumes that people are naturally active, curious and oriented towards growth, but that these tendencies depend on supportive social conditions. It focuses not only on how much motivation people have but on the quality, or type, of motivation.

## Intrinsic and extrinsic motivation
- Intrinsic motivation is doing an activity for its own sake, because it is interesting, enjoyable or satisfying, as when a child plays or a person reads a novel for pleasure.
- Extrinsic motivation is doing an activity for a separable outcome: rewards, grades, approval, avoiding punishment.

## The continuum of internalisation
SDT holds that extrinsic motivation varies in how autonomous it is. Organismic integration theory describes a continuum:
| Type | Regulation | Example: studying psychology |
| Amotivation | No intention, no value | "I don't see the point; I just attend" |
| External regulation | Rewards and punishments | "To avoid my parents' anger" |
| Introjected regulation | Guilt, pride, ego | "I'd feel ashamed if I failed" |
| Identified regulation | Personal value | "It is important for my career as a counsellor" |
| Integrated regulation | Fully part of one's self | "Helping people is who I am" |
| Intrinsic motivation | Inherent enjoyment | "I find the mind fascinating" |
External and introjected regulation are controlled motivation; identified, integrated and intrinsic motivation are autonomous motivation. Autonomous motivation predicts greater persistence, deeper learning, better performance on complex tasks and higher wellbeing.

## Three basic psychological needs
Basic psychological needs theory proposes three universal needs whose satisfaction supports autonomous motivation and wellbeing:
- Autonomy: the experience of choice and of acting in line with one's own values (not independence from others).
- Competence: feeling effective and able to master challenges.
- Relatedness: feeling connected to and cared for by others.
Environments that satisfy these needs foster intrinsic motivation and internalisation; environments that thwart them produce controlled motivation, amotivation and ill-being.

## Overjustification and cognitive evaluation theory
- Deci in 1971 had university students solve interesting puzzles (the Soma cube). In the second session, one group was paid a dollar for each puzzle solved. In a later free-choice period, after payment stopped, the paid group spent less time on the puzzles than the unpaid group: the reward reduced intrinsic motivation.
- Mark Lepper, David Greene and Richard Nisbett gave nursery children who liked drawing an expected "Good Player Award" for drawing. Two weeks later, these children spent about half as much free time drawing as children who received no reward or an unexpected reward.
- This is the overjustification effect: an external reward provides a sufficient explanation for one's behaviour, so the activity seems less intrinsically interesting.
- Cognitive evaluation theory explains that rewards have two aspects: a controlling aspect (which reduces autonomy and intrinsic motivation) and an informational aspect (which conveys competence and can increase it). Expected, tangible, task-contingent rewards are usually controlling; positive verbal feedback is usually informational. Threats, deadlines, surveillance and competition imposed by others also reduce intrinsic motivation; choice and acknowledgement of feelings increase it.
- A meta-analysis of 128 studies by Deci, Richard Koestner and Ryan confirmed that tangible expected rewards undermined intrinsic motivation, while positive feedback enhanced it. Robert Eisenberger and Judy Cameron disputed the size of the effect, arguing that rewards for meeting high standards can increase interest.

## Applications
Education:
- Autonomy-supportive teaching (offering choices, explaining reasons, acknowledging students' perspectives, minimising controlling language) increases engagement, learning and wellbeing, as Johnmarshall Reeve's research shows.
- High-stakes testing and controlling pressure, common in Indian coaching culture, can foster introjected motivation, anxiety and burnout.
Work:
- Autonomy support from managers predicts job satisfaction, performance and wellbeing; heavy reliance on contingent pay for interesting work can crowd out intrinsic motivation.
Health:
- Autonomous motivation predicts adherence to medication, weight loss maintenance, smoking cessation and exercise. Interventions use autonomy-supportive counselling.
- Motivational interviewing is consistent with SDT: it evokes the client's own reasons for change.
Sport and parenting: autonomy-supportive coaching and parenting predict persistence and wellbeing.
Technology: games satisfy competence and autonomy; social media may thwart relatedness while seeming to meet it.

## Cross-cultural evidence
Critics argued that autonomy is a Western value irrelevant in collectivist cultures. SDT replies that autonomy means volition, not independence: one can autonomously endorse interdependent values. Valery Chirkov and colleagues found that autonomy satisfaction predicted wellbeing in Russia, Turkey, South Korea and the United States. Research with Indian students has also linked autonomy-supportive parenting and teaching to better adjustment, though family-centred decisions can be experienced as autonomous when values are shared.

## Critique
- The distinction between types of regulation can be hard to measure, and self-report scales may overlap.
- The universality of the three needs, and whether others (such as meaning or security) should be added, is debated.
- The reward debate shows that conditions matter; rewards are not always harmful.
- It can be difficult to apply in contexts where many tasks are not interesting and extrinsic regulation is unavoidable.

## Conclusion
Self-determination theory distinguishes types of motivation by their autonomy, identifies autonomy, competence and relatedness as basic needs, and explains why controlling rewards can undermine intrinsic motivation. It is one of the best-supported and most applied theories of motivation, with clear guidance for teachers, managers, clinicians and parents.`,
    keyPoints: ["SDT's view of human nature", "Intrinsic versus extrinsic motivation", "Continuum of regulation with examples", "Autonomous versus controlled motivation", "Three basic needs correctly defined", "Deci and Lepper overjustification studies", "Cognitive evaluation theory: controlling versus informational", "Applications and cross-cultural evidence with critique"],
    pitfalls: ["Equating autonomy with independence", "Claiming all rewards always reduce motivation"],
    module: "motivation-emotion/2-2",
    visuals: [
      { kind: "layers", caption: "The continuum of internalisation", data: { title: "From controlled to autonomous", shape: "stack", layers: [{ label: "Intrinsic", detail: "For the joy of it." }, { label: "Integrated", detail: "Part of who I am." }, { label: "Identified", detail: "I value it." }, { label: "Introjected", detail: "Guilt and pride push me." }, { label: "External", detail: "Rewards and punishments." }, { label: "Amotivation", detail: "No reason at all." }] } },
      { kind: "experiment", caption: "Overjustification and cognitive evaluation theory", data: { title: "Lepper, Greene and Nisbett's drawing study", question: "Percentage of free time later spent drawing (approximate)?", unit: "%", conditions: [{ label: "Expected reward", value: 9 }, { label: "Unexpected reward", value: 18 }, { label: "No reward", value: 17 }], why: "An expected reward made drawing seem like work, so children chose it less once the reward stopped." } },
    ],
    ref: "Deci 1971; Lepper, Greene and Nisbett 1973; Deci, Koestner and Ryan 1999 Psychological Bulletin; Eisenberger and Cameron 1996; Ryan and Deci 2000 and 2017; Reeve 2009; Chirkov et al 2003",
  },
  {
    id: "lme-l03-029",
    subject: S,
    topic: "goal-setting",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Explain Locke and Latham's goal-setting theory. What mechanisms and moderators explain how goals improve performance?",
    plan: ["Core propositions", "Evidence", "Mechanisms", "Moderators", "Limits and applications"],
    answer: `## Core propositions
Edwin Locke and Gary Latham developed goal-setting theory from the 1960s, based on hundreds of studies. Its central findings:
- Specific, difficult goals lead to higher performance than easy goals, no goals, or vague "do your best" goals.
- Performance increases with goal difficulty, as long as the person is committed and has the ability.
For example, loggers in a study by Latham and Kinne cut more timber when given a specific, challenging target than when told to do their best.

## Evidence
Across more than 1,000 studies with over 40,000 participants, in laboratory and field settings, specific difficult goals produced better performance in about 90 percent of studies, with typical effect sizes of about d = 0.4 to 0.8. The finding has been replicated in many countries, including India, and in tasks from data entry to sales and weight loss.

## Mechanisms
Goals improve performance through four mechanisms:
- Direction: goals focus attention and effort on goal-relevant activities and away from irrelevant ones.
- Effort: harder goals lead to greater effort.
- Persistence: goals prolong effort, especially when time is flexible.
- Strategy: goals motivate people to discover and use task-relevant knowledge and strategies.

## Moderators
- Goal commitment: goals work only if people are committed. Commitment increases when goals are important to the person, when they participate in setting them or understand the reasons, when the goal is public, and when self-efficacy is high.
- Feedback: people need feedback on progress relative to the goal; goals plus feedback are more effective than either alone.
- Task complexity: effects are smaller for complex tasks, where strategy matters. For new, complex tasks, learning goals ("find six strategies") work better than performance goals ("score 90 percent").
- Ability and self-efficacy: goals beyond ability lead to failure and lowered motivation.
- Situational constraints: lack of resources limits goal attainment.

## Limits and criticisms
- Narrow focus: goals can lead people to neglect important but unmeasured aspects of work, such as quality or helping colleagues.
- Unethical behaviour: Lisa Ordonez and colleagues ("Goals gone wild") argued that difficult targets can encourage cheating and risk-taking, as in sales fraud.
- Goals can reduce intrinsic motivation if experienced as controlling.
- Too many goals compete for attention.

## Applications
- SMART goals (specific, measurable, achievable, relevant, time-bound) in organisations and education.
- Management by objectives and key performance indicators.
- Health behaviour: goals for daily steps or medication adherence, often combined with implementation intentions ("When I wake up, I will walk for 20 minutes").
- Therapy: collaborative goal-setting in CBT and rehabilitation.
- Students preparing for entrance examinations can set specific weekly goals with feedback from practice tests.

## Conclusion
Goal-setting theory shows that specific, challenging goals, supported by commitment, feedback and adequate ability, improve performance by directing attention, increasing effort and persistence, and promoting strategies. Goals must be set carefully to avoid narrow focus and unethical shortcuts.`,
    keyPoints: ["Core propositions", "Strength of evidence", "Four mechanisms", "Commitment and feedback as moderators", "Learning versus performance goals for complex tasks", "Criticisms such as goals gone wild", "Applications including SMART goals"],
    module: "motivation-emotion/2-2",
    visuals: [
      { kind: "flow", caption: "Mechanisms", data: { title: "How goals raise performance", layout: "tree", nodes: [{ id: "g", label: "Specific, difficult goal" }, { id: "d", label: "Direction", parent: "g", detail: "Attention on what matters." }, { id: "e", label: "Effort", parent: "g", detail: "Harder goals, more effort." }, { id: "p", label: "Persistence", parent: "g", detail: "Keep going longer." }, { id: "s", label: "Strategy", parent: "g", detail: "Find better ways." }] } },
    ],
    ref: "Locke and Latham 1990 and 2002 American Psychologist; Latham and Kinne 1974; Ordonez et al 2009; Gollwitzer 1999",
  },
  {
    id: "lme-l03-030",
    subject: S,
    topic: "affiliation",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on the need for affiliation.",
    plan: ["Define need for affiliation", "Schachter's anxiety and affiliation studies", "Measurement and correlates", "Belongingness hypothesis and culture"],
    answer: `## Meaning
The need for affiliation (nAff) is the desire to establish, maintain and restore close, positive relationships with others. Henry Murray listed it as a psychogenic need, and David McClelland studied it with achievement and power.

## Schachter's studies
Stanley Schachter in 1959 told female students they would receive electric shocks. In the high-anxiety condition, the shocks were described as painful; in the low-anxiety condition, as mild tickles. While waiting, participants could choose to wait alone or with others. About 63 percent of the high-anxiety group chose to wait with others, compared with about 33 percent of the low-anxiety group. They preferred to wait with others in the same situation rather than with unrelated students, leading Schachter to conclude that "misery loves miserable company". He suggested that affiliation under stress allows social comparison of feelings and reduces anxiety. Firstborns showed a stronger tendency to affiliate under stress.

## Measurement and correlates
Need for affiliation is measured with the TAT (stories about friendship and concern about relationships) or questionnaires. People high in nAff spend more time with others, make more phone calls and write more letters, seek approval, avoid conflict and may prefer cooperative work. In managers, very high nAff can make it hard to take unpopular decisions.

## Belongingness and culture
Roy Baumeister and Mark Leary's belongingness hypothesis proposes that the need to belong is a fundamental human motive: people form bonds easily, resist losing them, and suffer psychologically and physically when excluded. Social rejection activates brain regions linked to physical pain. In collectivist cultures such as India, family and community bonds strongly shape identity, and affiliation goals may be expressed through obligation and interdependence.`,
    keyPoints: ["Definition and Murray", "Schachter's design and percentages", "Misery loves miserable company", "Measurement and correlates", "Belongingness hypothesis and culture"],
    module: "motivation-emotion/2-1",
    visuals: [
      { kind: "experiment", caption: "Schachter's studies", data: { title: "Schachter: anxiety and affiliation", question: "What share chose to wait with others?", unit: "%", conditions: [{ label: "Expecting painful shocks", value: 63 }, { label: "Expecting mild shocks", value: 33 }], why: "Anxiety increased the wish to be with others in the same situation." } },
    ],
    ref: "Schachter 1959 The Psychology of Affiliation; Baumeister and Leary 1995 Psychological Bulletin; McClelland 1985",
  },
];
