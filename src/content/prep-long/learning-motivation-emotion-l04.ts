import type { LongQA } from "@/lib/prep/long-types";

const S = "learning-motivation-emotion" as const;

export const LEARNING_MOTIVATION_EMOTION_L04: LongQA[] = [
  {
    id: "lme-l04-031",
    subject: S,
    topic: "attribution",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Explain Weiner's attribution theory of achievement motivation. How do causal attributions for success and failure affect emotion, expectancy and future effort?",
    plan: ["Attribution and achievement", "Three causal dimensions with examples", "Links to expectancy and emotion", "Evidence and attributional retraining", "Indian applications and critique"],
    answer: `## Attribution and achievement
Bernard Weiner proposed in the 1970s that the way people explain their successes and failures affects their emotions, expectations and future motivation. After an exam, a student asks "Why did I do well or badly?" The answer shapes whether they try harder next time. Typical causes are ability, effort, task difficulty and luck, along with mood, fatigue, help from others and teacher bias.

## Three dimensions
| Dimension | Meaning | Example |
| Locus | Internal (in the person) or external (in the situation) | Ability and effort are internal; task difficulty and luck are external |
| Stability | Stable over time or unstable | Ability and task difficulty are stable; effort and luck are unstable |
| Controllability | Under the person's control or not | Effort is controllable; ability, luck and difficulty are usually not |
- Ability: internal, stable, uncontrollable.
- Effort: internal, unstable, controllable.
- Task difficulty: external, stable, uncontrollable.
- Luck: external, unstable, uncontrollable.

## Effects on expectancy
The stability dimension mainly affects expectations for the future. Attributing failure to a stable cause ("I lack ability") predicts continued failure and lowers expectancy; attributing failure to an unstable cause ("I didn't study enough", "bad luck") leaves hope for improvement.

## Effects on emotion
- Locus affects self-esteem related emotions: success attributed to internal causes produces pride; failure attributed to internal causes produces lowered self-esteem.
- Controllability affects social emotions: failure due to one's own lack of effort produces guilt; failure due to uncontrollable lack of ability produces shame and humiliation. When others' failure is seen as controllable, observers feel anger; when uncontrollable, they feel pity and offer help.
- Teachers who express pity after a student's failure may inadvertently signal low ability, while mild anger signals that effort could have changed the outcome.

## Effects on effort
Attributing failure to lack of effort (internal, unstable, controllable) is the most adaptive, because it maintains expectancy and motivates greater effort. Attributing failure to lack of ability leads to helplessness and withdrawal. This links to the reformulated learned helplessness model.

## Evidence and attributional retraining
- High achievers tend to attribute success to ability and effort, and failure to lack of effort or bad luck; low achievers tend to attribute failure to low ability.
- Carol Dweck's early work showed that helpless children attributed failure to ability, and that training them to attribute failure to insufficient effort increased persistence on difficult problems.
- Raymond Perry's attributional retraining for first-year university students improved grades and reduced dropout.

## Applications in India
Indian students under heavy exam pressure may attribute failure to fate (kismat) or to stable lack of ability. Teachers and counsellors can help students focus on controllable causes such as study strategies and effort, while acknowledging structural barriers such as poor schooling or language, which are real external causes.

## Critique
- People may not think about causes as systematically as the model implies; attributions are often brief.
- Cultural variation: East Asian and Indian students often emphasise effort more than ability, whereas American students emphasise ability, as Harold Stevenson and James Stigler found.
- Overemphasising effort can lead to self-blame when failure has external causes.

## Conclusion
Weiner's theory shows that the explanations people give for success and failure, especially their stability and controllability, shape pride, shame, guilt, hope and persistence. Encouraging controllable, unstable attributions for failure is a practical way to sustain motivation.`,
    keyPoints: ["Four common causes", "Three dimensions with classification of causes", "Stability affects expectancy", "Locus and controllability affect emotions", "Effort attributions are most adaptive", "Dweck's and Perry's retraining evidence", "Indian context and cultural critique"],
    module: "motivation-emotion/2-1",
    visuals: [
      { kind: "sort", caption: "Three dimensions", data: { prompt: "Classify each cause of failing an exam.", buckets: ["Internal and stable", "Internal and unstable", "External and stable", "External and unstable"], items: [{ text: "I am not clever enough", bucket: 0 }, { text: "I did not revise", bucket: 1 }, { text: "This paper is always very hard", bucket: 2 }, { text: "The questions I prepared did not come", bucket: 3 }] } },
    ],
    ref: "Weiner 1979 and 1985 Psychological Review; Dweck 1975; Perry et al 2014; Stevenson and Stigler 1992 The Learning Gap",
  },
  {
    id: "lme-l04-032",
    subject: S,
    topic: "self-regulation",
    marks: 15,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "What is self-regulation? Discuss the marshmallow studies of delay of gratification, the ego depletion model and the controversy over its replication.",
    plan: ["Define self-regulation and self-control", "Mischel's delay of gratification studies and strategies", "Longitudinal findings and reanalysis", "Baumeister's ego depletion model", "Replication crisis and alternative models", "Applications"],
    answer: `## Meaning
Self-regulation is the process by which people monitor and control their thoughts, emotions and behaviour to pursue long-term goals. Self-control refers to overriding an immediate impulse in favour of a more valued goal, such as studying instead of watching a film. Self-regulation involves setting standards, monitoring progress and the capacity to change behaviour, as described in Charles Carver and Michael Scheier's feedback loop model.

## Delay of gratification
Walter Mischel's studies at Stanford's Bing Nursery School from the late 1960s offered children aged 4 to 5 a choice: one small treat (such as a marshmallow) now, or two treats if they waited, usually up to 15 minutes, while the experimenter left the room.
- Children used strategies to wait: covering their eyes, singing, turning away, or thinking about the marshmallow as a "puffy cloud" (cool, abstract focus) rather than its sweet, chewy taste (hot, consummatory focus). Mischel described "hot" emotional and "cool" cognitive systems.
- Waiting was easier when the treats were covered and when children were given distracting thoughts.
- Follow-ups found that children who waited longer had, as adolescents, higher SAT scores, better coping with stress and frustration, and, in middle age, lower BMI; brain imaging in adulthood showed differences in prefrontal and striatal activity.
- A large reanalysis by Tyler Watts, Greg Duncan and Haonan Quan in 2018, with a more diverse sample, found that the link between delay time and later achievement was much smaller and largely explained by family background and early cognitive ability. Children from poorer or unreliable environments may rationally choose the immediate reward. Celeste Kidd showed that children waited longer when the experimenter had previously been reliable.

## The ego depletion model
Roy Baumeister proposed that self-control draws on a limited resource, like a muscle that tires. In his 1998 "radish study", participants who had resisted freshly baked cookies and eaten radishes instead gave up sooner on an unsolvable puzzle (about 8 minutes) than those allowed to eat cookies or given no food (about 19 to 21 minutes). Hundreds of studies reported that one act of self-control impaired the next. Matthew Gailliot proposed that glucose was the resource, and that a sugary drink restored self-control.

## The replication controversy
- A large preregistered multisite replication led by Martin Hagger in 2016, involving 23 labs and over 2,000 participants, found an ego depletion effect close to zero.
- Meta-analyses correcting for publication bias found the effect much smaller than claimed, possibly absent.
- The glucose account was challenged: the brain's glucose use does not change measurably with self-control, and rinsing the mouth with sugar water without swallowing seemed to work equally well, suggesting a motivational effect.
- Alternative explanations: Michael Inzlicht's process model proposes that after effortful control, motivation shifts from "have to" goals to "want to" goals, rather than a resource running out. Veronika Job found that depletion effects appeared mainly in people who believed willpower is limited.

## Effective self-regulation
- Situation selection and modification: avoiding temptations is more effective than resisting them; people high in self-control use fewer effortful acts of resistance and more habits, as Wilhelm Hofmann found in experience sampling studies.
- Implementation intentions: "if-then" plans automate goal-directed responses.
- Construal level: thinking abstractly about long-term goals.
- Self-monitoring and feedback.

## Applications
Self-regulation is linked to academic success, health behaviours, savings and lower rates of substance use and crime; Terrie Moffitt's Dunedin study found childhood self-control predicted adult health, wealth and criminal convictions. Interventions such as the Tools of the Mind preschool curriculum, mindfulness and executive function training aim to strengthen it.

## Conclusion
Self-regulation is central to long-term goal pursuit. Mischel's studies showed that strategies and situations shape delay of gratification, though its predictive power is smaller than once believed. The ego depletion model has largely failed large replications, and current views emphasise motivation, beliefs, habits and situational strategies.`,
    keyPoints: ["Definition of self-regulation", "Marshmallow procedure and strategies", "Hot and cool systems", "Follow-up findings and 2018 reanalysis", "Ego depletion radish study", "Hagger multisite replication failure", "Alternative process model and beliefs", "Effective strategies and applications"],
    module: "motivation-emotion/2-2",
    visuals: [
      { kind: "experiment", caption: "The ego depletion model", data: { title: "Baumeister's radish study", question: "Minutes spent on an unsolvable puzzle (approximate)?", unit: " minutes", max: 25, conditions: [{ label: "Ate cookies", value: 19 }, { label: "No food", value: 21 }, { label: "Resisted cookies, ate radishes", value: 8 }], why: "This classic result inspired ego depletion research, but large replications later found little or no effect." } },
    ],
    ref: "Mischel, Shoda and Rodriguez 1989 Science; Mischel 2014; Watts, Duncan and Quan 2018 Psychological Science; Kidd, Palmeri and Aslin 2013; Baumeister et al 1998; Hagger et al 2016; Inzlicht and Schmeichel 2012; Job et al 2010; Hofmann et al 2012; Moffitt et al 2011 PNAS",
  },
  {
    id: "lme-l04-033",
    subject: S,
    topic: "sexual-motivation",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on sexual motivation.",
    plan: ["Biological factors", "Masters and Johnson's response cycle", "Psychological and cultural factors", "Sexual orientation and Indian context"],
    answer: `## Biological factors
Sexual motivation is influenced by hormones: testosterone in both sexes increases sexual desire, and oestrogen influences female sexual receptivity in many mammals. In humans, the link between hormones and behaviour is weaker than in other animals; sexual behaviour depends heavily on learning and context. The hypothalamus (especially the medial preoptic area) and dopamine reward pathways are involved.

## The sexual response cycle
William Masters and Virginia Johnson, observing about 700 volunteers in the laboratory in the 1960s, described four phases: excitement, plateau, orgasm and resolution, with men showing a refractory period. Later sex therapists added desire as a first phase. Rosemary Basson later proposed a circular model for women, in which desire can arise in response to arousal and intimacy, not only before it.

## Psychological and cultural factors
- External stimuli, fantasy, attraction, emotional intimacy and relationship quality.
- Learning and cultural scripts define what is acceptable, who initiates and the meaning of sex.
- Stress, depression, anxiety and some medications (such as SSRIs) reduce desire.
- Alfred Kinsey's surveys in the 1940s and 1950s showed far greater diversity of sexual behaviour than social norms suggested.

## Sexual orientation and Indian context
Sexual orientation reflects interacting genetic, prenatal hormonal and environmental influences and is not a disorder. The Supreme Court of India decriminalised consensual same-sex relations in Navtej Singh Johar v. Union of India in 2018. Indian culture combines a tradition of frank discussion (such as the Kamasutra) with present-day silence and stigma about sexuality, and conditions such as dhat syndrome reflect cultural beliefs about semen loss.`,
    keyPoints: ["Hormonal and neural factors", "Masters and Johnson cycle and later models", "Psychological and cultural influences", "Kinsey's contribution", "Sexual orientation and Indian legal context"],
    module: "motivation-emotion/1-2",
    visuals: [
      { kind: "flow", caption: "The sexual response cycle", data: { title: "Masters and Johnson's response cycle", layout: "chain", nodes: [{ id: "e", label: "Excitement" }, { id: "p", label: "Plateau" }, { id: "o", label: "Orgasm" }, { id: "r", label: "Resolution", detail: "Men show a refractory period." }] } },
    ],
    ref: "Masters and Johnson 1966; Kaplan 1979; Basson 2000; Kinsey 1948 and 1953; Navtej Singh Johar v Union of India 2018",
  },
  {
    id: "lme-l04-034",
    subject: S,
    topic: "emotion-theories",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Critically evaluate the major theories of emotion: James Lange, Cannon Bard, Schachter Singer two-factor theory and cognitive appraisal theories. Use experimental evidence to support your answer.",
    plan: ["Define emotion and its components", "James Lange theory and evidence", "Cannon's critique and the Cannon Bard theory", "Schachter Singer experiment and evaluation", "Appraisal theories: Lazarus and others", "Modern constructionist and neuroscience views; conclusion"],
    answer: `## Emotion
An emotion is a complex reaction to a significant event, involving several components: subjective feeling, physiological arousal (heart rate, sweating, hormones), cognitive appraisal of the situation, expressive behaviour (facial expressions, voice, posture) and action tendencies (to flee, attack or approach). Theories of emotion differ mainly on the order and causal relations among bodily changes, appraisal and feeling.

## James Lange theory
William James in 1884, and independently Carl Lange, proposed that emotional feelings result from the perception of bodily changes. The common-sense view says "I see a bear, feel afraid and run". James argued instead: "we feel sorry because we cry, angry because we strike, afraid because we tremble". The sequence is stimulus, then bodily response, then feeling.
Supporting evidence:
- Different emotions are associated with some differences in physiological patterns. Paul Ekman, Robert Levenson and Wallace Friesen found that when participants posed facial expressions muscle by muscle, heart rate rose more for anger and fear than for happiness, and skin temperature rose more for anger than for fear.
- Facial feedback studies suggest that facial expressions can influence feelings.
- George Hohmann found that men with spinal cord injuries, especially high on the spine, reported less intense emotions, though later studies did not confirm this consistently.
- Antonio Damasio's somatic marker hypothesis revived the idea that bodily states guide emotion and decision-making.

## Cannon's critique and the Cannon Bard theory
Walter Cannon in 1927 raised five objections:
- Separating the viscera from the brain (in animals) did not abolish emotional behaviour.
- Visceral changes are similar across very different emotions (fear, anger, even fever), so they cannot distinguish emotions.
- The viscera are relatively insensitive.
- Visceral changes are too slow (1 to 2 seconds or more) to account for the speed of emotional experience.
- Artificially inducing visceral changes (injecting adrenaline) does not produce genuine emotion; Gregorio Maranon found people reported feeling "as if" afraid.
Cannon and Philip Bard proposed that an emotional stimulus is processed by the thalamus, which simultaneously sends signals to the cortex (producing the feeling) and to the hypothalamus and autonomic nervous system (producing bodily arousal). Feeling and arousal occur at the same time and independently.
Evaluation: Cannon was right that undifferentiated arousal cannot explain all emotions and that the brain is central, but the thalamus is not the key emotion centre; the hypothalamus, amygdala and limbic system are more important. Also, bodily feedback does influence emotion, so the two are not fully independent.

## Schachter Singer two-factor theory
Stanley Schachter and Jerome Singer in 1962 proposed that emotion requires two factors: physiological arousal and a cognitive label. Arousal is general; we interpret it by looking at the situation. If there is no obvious explanation for arousal, we search the environment and label our state accordingly.
Experiment:
- Male students were told they were receiving a vitamin injection ("Suproxin") to test vision. Most actually received adrenaline, which causes arousal (racing heart, trembling); a control group received a placebo.
- Some were correctly informed about the side effects, some misinformed (told of numbness and itching), and some given no information.
- Each then waited with a confederate who acted either euphoric (flying paper aeroplanes, playing with a hula hoop) or angry (complaining about an insulting questionnaire).
- Results: uninformed and misinformed participants who received adrenaline tended to report and show more of the confederate's emotion than informed participants, who could attribute their arousal to the injection.
Support: Donald Dutton and Arthur Aron's Capilano bridge study found that men approached by an attractive woman on a high, wobbly suspension bridge were more likely to call her later and wrote more sexual imagery in TAT stories than men on a low, stable bridge, suggesting they misattributed fear arousal to attraction (misattribution of arousal).
Criticisms:
- The original effects were weak and inconsistent; the placebo group often showed similar emotions, and the anger condition results were weak.
- Replications by Gary Marshall and Philip Zimbardo and by Christina Maslach failed, and unexplained arousal tended to be experienced as negative.
- Arousal is not completely undifferentiated, contrary to the theory.
- Emotions can occur without prior arousal.
Nonetheless, it established the role of cognitive interpretation in emotion.

## Cognitive appraisal theories
Richard Lazarus argued that emotion depends on how we appraise (evaluate) events in relation to our wellbeing.
- Primary appraisal: is this relevant to me, and is it harmful, threatening, challenging or beneficial?
- Secondary appraisal: what can I do about it; what resources and options do I have?
- Reappraisal as the situation changes.
Different appraisal patterns produce different emotions: anger arises when a demeaning offence is blamed on another; guilt when one has transgressed a moral rule; fear when there is uncertain, existential threat.
Evidence: Lazarus showed participants a film of a painful subincision ritual among an Australian Aboriginal group. Participants who heard a soundtrack that denied the pain or described the ritual intellectually showed less physiological stress than those who heard a soundtrack emphasising pain and danger.
Klaus Scherer's component process model and Nico Frijda's work specify appraisal dimensions such as novelty, pleasantness, goal relevance, coping potential and norm compatibility, and show cross-cultural similarities in appraisal-emotion links.
Criticism: Robert Zajonc argued that "preferences need no inferences": emotional reactions can occur before and without conscious cognition, as in the mere exposure effect and fast amygdala responses. Lazarus replied that appraisal can be fast, automatic and unconscious.

## Modern views
- Neuroscience: Joseph LeDoux showed a fast "low road" from thalamus to amygdala producing rapid fear responses, and a slower "high road" through the cortex for detailed appraisal, partly reconciling Cannon, Zajonc and Lazarus.
- Constructionist theories: Lisa Feldman Barrett's theory of constructed emotion proposes that the brain constructs emotions by combining core affect (pleasure and arousal) with concepts learned from culture, predicting what bodily sensations mean, similar in spirit to Schachter and Singer.
- Basic emotion theories (Ekman) argue for innate, universal emotions with distinct expressions.

## Comparison
| Theory | Sequence | Key evidence | Main criticism |
| James Lange | Stimulus, body, feeling | Specific physiological patterns, facial feedback | Arousal too similar and slow |
| Cannon Bard | Stimulus, thalamus, feeling and body together | Emotion without visceral feedback | Wrong brain structure; ignores bodily feedback |
| Schachter Singer | Arousal plus label, feeling | Adrenaline study, bridge study | Weak replications |
| Lazarus | Appraisal, emotion and arousal | Subincision film study | Emotion without cognition (Zajonc) |

## Conclusion
Each theory captures part of the truth. Bodily changes contribute to emotional experience (James Lange); the brain coordinates feeling and arousal (Cannon Bard); interpretation of arousal shapes which emotion is felt (Schachter Singer); and appraisal of personal meaning is central (Lazarus). Modern neuroscience and constructionist views integrate these, showing emotion as the brain's rapid, partly automatic interpretation of bodily states in context.`,
    keyPoints: ["Components of emotion", "James Lange sequence and evidence", "Cannon's five objections", "Cannon Bard simultaneity and thalamus", "Schachter Singer design and results", "Dutton and Aron bridge study", "Criticisms including failed replications", "Lazarus appraisal with subincision study, Zajonc debate and modern views"],
    pitfalls: ["Describing theories without evidence", "Misreporting the conditions in Schachter and Singer"],
    module: "motivation-emotion/1-3",
    visuals: [
      { kind: "compare", caption: "Cannon's critique and the Cannon Bard theory", data: { title: "James Lange versus Cannon Bard", a: { label: "James Lange", points: ["See the bear", "Body trembles and heart races", "Then you feel afraid"], summary: "Feeling follows the body." }, b: { label: "Cannon Bard", points: ["See the bear", "Brain sends two signals at once", "Feeling and trembling together"], summary: "Feeling and body in parallel." } } },
      { kind: "flow", caption: "Schachter Singer two-factor theory", data: { title: "Schachter Singer: two factors", layout: "chain", nodes: [{ id: "s", label: "Situation", detail: "An injection, a euphoric companion." }, { id: "a", label: "Arousal", detail: "Heart racing from adrenaline." }, { id: "c", label: "Search for an explanation", detail: "No better reason available." }, { id: "l", label: "Label", detail: "'I must be happy, like him.'" }, { id: "e", label: "Emotion felt" }] } },
    ],
    ref: "James 1884; Cannon 1927; Schachter and Singer 1962 Psychological Review; Dutton and Aron 1974; Marshall and Zimbardo 1979; Lazarus 1966 and 1991; Speisman et al 1964; Zajonc 1980 and 1984; LeDoux 1996; Barrett 2017; Ekman, Levenson and Friesen 1983 Science; Atkinson and Hilgard ch 11",
  },
  {
    id: "lme-l04-035",
    subject: S,
    topic: "appraisal",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Discuss the Lazarus Zajonc debate on the primacy of cognition or affect in emotion. How has neuroscience helped resolve it?",
    plan: ["The question at issue", "Zajonc's position and evidence", "Lazarus's position and evidence", "What each meant by cognition", "Neuroscience: LeDoux's two routes", "Resolution and conclusion"],
    answer: `## The question
In the early 1980s a famous debate in the journal "American Psychologist" asked whether emotion can occur without cognition. Robert Zajonc argued for the primacy of affect; Richard Lazarus argued that cognitive appraisal is necessary for emotion.

## Zajonc's position
Zajonc's 1980 paper "Feeling and thinking: preferences need no inferences" argued that affective reactions are often the first reactions to stimuli, occur automatically and can be independent of cognition.
Evidence:
- Mere exposure effect: people come to like stimuli (Chinese ideographs, Turkish words, polygons) simply through repeated exposure, even when they cannot recognise them as having been seen. William Kunst-Wilson and Zajonc found people preferred previously flashed shapes at above chance levels while recognising them only at chance.
- Affective priming: briefly flashed happy or angry faces influence liking of neutral ideographs without awareness (Sheila Murphy and Zajonc).
- Emotional reactions can be faster than recognition.
- Affect and cognition involve partly separate neural systems.
- Animals and infants show emotions with limited cognition.
- It is often hard to change emotions by reasoning (phobias persist despite knowing the spider is harmless).

## Lazarus's position
Lazarus argued that emotion always depends on appraisal, the evaluation of the significance of an event for one's wellbeing. Without appraisal, there is no basis for an emotional reaction: we must at least register that something is good or bad for us.
Evidence:
- His film studies showed that changing the appraisal of a disturbing film (through the soundtrack) changed physiological stress responses.
- Different appraisals of the same situation produce different emotions.
- He argued that appraisal can be very fast, automatic and unconscious, so mere exposure and priming effects still involve primitive evaluations.

## What each meant by cognition
Much of the debate was about definitions. Zajonc used "cognition" to mean conscious, deliberate processing of information; Lazarus used it broadly to include any evaluation of meaning, including automatic, unconscious processing. On Lazarus's definition, affect always involves some cognition; on Zajonc's, affect can precede it.

## Neuroscience and resolution
Joseph LeDoux's research on fear conditioning in rats showed two pathways from the senses to the amygdala:
- The low road: a fast, direct route from the thalamus to the amygdala (about 12 milliseconds in the rat), giving a crude, rapid signal that can trigger defensive responses before the stimulus is fully recognised, such as jumping back from a stick that looks like a snake.
- The high road: a slower route through the sensory cortex to the amygdala, providing detailed analysis that can confirm or cancel the fear response.
This supports Zajonc's point that emotional reactions can begin before full conscious recognition, and Lazarus's point that some evaluation of significance is involved, even if crude and automatic. Studies of affective blindsight and amygdala responses to masked fearful faces in humans support fast, unconscious emotional processing.
Most researchers today accept that emotions involve evaluation of significance, which can be rapid and automatic or slow and deliberate, and that emotion and cognition interact continuously rather than one always coming first.

## Conclusion
The Lazarus Zajonc debate clarified that the answer depends on how cognition is defined. Neuroscience shows both fast, crude emotional evaluation and slower, cortical appraisal, so affect can precede conscious thought, but not all evaluation of meaning.`,
    keyPoints: ["The question at issue", "Zajonc's mere exposure and priming evidence", "Lazarus's appraisal and film study evidence", "Definitional disagreement about cognition", "LeDoux's low and high roads", "Human evidence from masked faces", "Integrated resolution"],
    module: "motivation-emotion/2-5",
    visuals: [
      { kind: "flow", caption: "Neuroscience and resolution", data: { title: "LeDoux's two roads to fear", layout: "tree", nodes: [{ id: "t", label: "Thalamus", detail: "Receives the sight of a shape on the path." }, { id: "l", label: "Low road to amygdala", parent: "t", detail: "Fast and crude: jump back now." }, { id: "c", label: "High road through cortex", parent: "t", detail: "Slower and detailed: it is only a stick." }] } },
    ],
    ref: "Zajonc 1980 and 1984 American Psychologist; Lazarus 1982 and 1984 American Psychologist; Kunst-Wilson and Zajonc 1980; Murphy and Zajonc 1993; LeDoux 1996; Whalen et al 1998",
  },
  {
    id: "lme-l04-036",
    subject: S,
    topic: "emotional-expression",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Are emotional expressions universal? Discuss Ekman's research on basic emotions, cultural display rules and the constructionist critique, with reference to Indian perspectives such as the rasa theory.",
    plan: ["Darwin's view and basic emotion theory", "Ekman's cross-cultural studies", "Display rules and in-group advantage", "Facial action coding and evidence", "Constructionist and methodological critiques", "Indian perspectives and conclusion"],
    answer: `## Darwin and basic emotions
Charles Darwin, in "The Expression of the Emotions in Man and Animals" published in 1872, argued that facial expressions evolved because they were once useful (narrowing the eyes in disgust, baring teeth in anger) and became signals to others. If so, expressions should be universal. Basic emotion theory holds that a small number of emotions are biologically based, universal, with distinctive expressions, physiology and antecedent events.

## Ekman's cross-cultural studies
- Paul Ekman and Wallace Friesen, with Carroll Izard working separately, showed photographs of posed facial expressions to people in many literate countries (the United States, Brazil, Japan and others), who matched them with emotion words at high agreement for six emotions: happiness, sadness, anger, fear, surprise and disgust.
- To rule out learning from media, Ekman and Friesen in 1971 studied the Fore people of Papua New Guinea, who had little contact with outsiders. Participants heard a short story ("her child has died and she feels very sad") and chose the matching face from photographs of Americans. They chose correctly well above chance for most emotions, though they confused fear and surprise. Fore people's own posed expressions were also recognised by Americans.
- Later, contempt was added, and research suggested pride, embarrassment and shame may have recognisable displays.
- Congenitally blind children show similar spontaneous facial expressions to sighted children, suggesting an innate basis.
- Duchenne smiles, involving the muscles around the eyes, distinguish genuine from posed smiles.

## Display rules and cultural variation
Ekman proposed that the expressions are universal but cultures differ in display rules: norms about when, where and how strongly emotions may be shown. Wallace Friesen showed American and Japanese students a stressful film. Alone, both groups showed similar expressions of disgust and fear. When an experimenter was present, Japanese students more often masked negative expressions with smiles. Display rules include intensifying, de-intensifying, masking and neutralising emotions.
- Hillary Elfenbein and Nalini Ambady's meta-analysis found that emotions were recognised across cultures above chance but more accurately within one's own culture (the in-group advantage), suggesting "dialects" of emotional expression.
- Cultures also differ in which emotions are valued (ideal affect): Jeanne Tsai found that Americans value excited happiness, while East Asians value calm happiness.

## Facial Action Coding System
Ekman and Friesen developed the Facial Action Coding System (FACS), which describes facial movements as action units based on muscles. It is used in research, animation, lie detection and clinical work (for example, reduced facial expressivity in schizophrenia and Parkinson's disease).

## Critiques
- Methodology: forced-choice tasks with a list of emotion words inflate agreement. When participants describe faces freely, agreement is lower.
- Posed, exaggerated expressions are not typical of everyday expressions, which are often subtle and ambiguous.
- Lisa Feldman Barrett and James Russell argue for a constructionist view: faces mainly signal pleasure or displeasure and arousal, and specific emotion categories are learned concepts applied in context. In studies with the Himba of Namibia and the Hadza of Tanzania, when emotion words were not provided, participants sorted faces more by valence than by Western categories.
- Context strongly affects interpretation: Hillel Aviezer showed that the same face can be read as disgust or anger depending on body posture.
- Alan Fridlund's behavioural ecology view sees expressions as social signals of intentions rather than readouts of inner feelings.
The current position in many reviews is that there is some universality, especially for recognising smiles and some negative expressions, but much less than early studies suggested, with substantial cultural and contextual variation.

## Indian perspectives
- The Natyashastra, attributed to Bharata (around the second century BCE to second century CE), describes eight (later nine) rasas, aesthetic emotional experiences evoked in the audience, and corresponding bhavas, emotional states depicted by the actor: shringara (love), hasya (humour), karuna (compassion), raudra (fury), vira (heroism), bhayanaka (fear), bibhatsa (disgust), adbhuta (wonder), and later shanta (peace). Classical dance forms such as Bharatanatyam and Kathakali codify facial expressions (abhinaya) for each, a rich culturally elaborated system of emotional display.
- Usha Menon and Richard Shweder studied lajja (shame and modesty) among Hindu women in Odisha, expressed by the gesture of biting the tongue; it is a positive, valued emotion of self-restraint, unlike Western shame, illustrating culturally specific emotion concepts.
- Indian research has found both recognition of basic expressions and culture-specific emotions, consistent with an interactionist view.

## Conclusion
Ekman's research showed considerable cross-cultural recognition of several facial expressions, supporting a biological basis, while display rules explain cultural differences in their use. Constructionist critiques and studies of remote cultures suggest that universality has been overstated and that context and culture shape emotional meaning. Indian traditions, from rasa theory to lajja, offer culturally elaborated models of emotion and its expression.`,
    keyPoints: ["Darwin's evolutionary view", "Ekman's literate culture and Fore studies", "Blind children evidence", "Display rules with Friesen's Japanese study", "In-group advantage", "Methodological and constructionist critiques with Barrett and Himba", "Rasa theory from the Natyashastra", "Lajja and cultural specificity"],
    pitfalls: ["Presenting universality as settled", "Listing rasas without linking to emotion theory"],
    module: "motivation-emotion/2-6",
    visuals: [
      { kind: "compare", caption: "Critiques", data: { title: "Universal or constructed?", a: { label: "Basic emotion view (Ekman)", points: ["Six or seven universal expressions", "Recognised even by the isolated Fore", "Display rules explain differences"], summary: "Biology with cultural rules." }, b: { label: "Constructionist view (Barrett)", points: ["Faces mainly show pleasure and arousal", "Categories learned from culture", "Context changes the reading"], summary: "Concepts built by culture." } } },
      { kind: "sort", caption: "Indian perspectives", data: { prompt: "Match each rasa to its emotion.", buckets: ["Love", "Compassion", "Fury", "Wonder"], items: [{ text: "Shringara", bucket: 0 }, { text: "Karuna", bucket: 1 }, { text: "Raudra", bucket: 2 }, { text: "Adbhuta", bucket: 3 }] } },
    ],
    ref: "Darwin 1872; Ekman and Friesen 1971 JPSP; Ekman 1992; Friesen 1972 display rules; Elfenbein and Ambady 2002; Gendron et al 2014 Himba; Barrett et al 2019 Psychological Science in the Public Interest; Aviezer et al 2008; Menon and Shweder 1994 on lajja; Natyashastra ch 6 and 7",
  },
  {
    id: "lme-l04-037",
    subject: S,
    topic: "emotion-structure",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Compare discrete (categorical) and dimensional models of emotion. Describe Russell's circumplex model and Plutchik's wheel, and their uses.",
    plan: ["Two ways to describe emotion", "Discrete models: basic emotions and Plutchik", "Dimensional models: Wundt, Russell's circumplex", "Positive and negative affect (PANAS)", "Comparison and applications"],
    answer: `## Two approaches
Emotions can be described either as distinct categories, such as fear, anger and joy, or as positions along a few underlying dimensions, such as pleasantness and arousal. The two approaches are complementary but rest on different assumptions.

## Discrete models
- Basic emotion theorists such as Paul Ekman and Carroll Izard propose a small set of distinct emotions, each with its own expression, physiology and evolutionary function.
- Robert Plutchik's wheel of emotions, proposed in 1980, sets out eight primary emotions arranged in four opposing pairs: joy and sadness, trust and disgust, fear and anger, surprise and anticipation. Emotions vary in intensity (annoyance, anger, rage) and combine to form secondary emotions: joy plus trust gives love; fear plus surprise gives awe; anger plus disgust gives contempt. Each emotion serves an adaptive function, such as protection (fear) or rejection (disgust).
Strengths: matches everyday language; links to distinct action tendencies and some distinct brain circuits; useful for diagnosis (fear in phobias, sadness in depression).
Weaknesses: disagreement over how many basic emotions exist; physiological and neural evidence for distinct "fingerprints" is limited.

## Dimensional models
- Wilhelm Wundt in the 1890s described feelings along three dimensions: pleasant and unpleasant, excitement and calm, tension and relaxation.
- James Russell's circumplex model, also from 1980, arranges emotions in a circle defined by two independent dimensions: valence (pleasant to unpleasant, horizontal) and arousal (activated to deactivated, vertical).
| Quadrant | Example emotions |
| Pleasant, high arousal | Excited, elated, happy |
| Pleasant, low arousal | Calm, relaxed, content |
| Unpleasant, high arousal | Afraid, angry, tense, distressed |
| Unpleasant, low arousal | Sad, bored, depressed, fatigued |
Russell's concept of core affect is the constant, simple feeling of pleasure or displeasure and arousal that underlies all moods and emotions.
- David Watson and Auke Tellegen proposed positive affect and negative affect as two largely independent dimensions, measured by the Positive and Negative Affect Schedule (PANAS). High negative affect is common to anxiety and depression; low positive affect is specific to depression (Lee Anna Clark and Watson's tripartite model), while physiological hyperarousal is specific to anxiety.

## Comparison
| Feature | Discrete | Dimensional |
| Unit | Categories (fear, anger) | Positions on dimensions |
| Assumption | Distinct, often innate systems | Continuous variation, few underlying factors |
| Best for | Expression, specific action tendencies | Mood, self-report, overlap between emotions |
| Problem | How many categories? | Fear and anger look alike (both unpleasant, high arousal) |

## Uses
- Mood measurement in research and clinical practice, such as PANAS and the Self-Assessment Manikin, a pictorial scale of valence and arousal useful with children and low-literacy populations.
- Understanding comorbidity between anxiety and depression through shared negative affect.
- Affective computing and emotion recognition by machines often use valence and arousal.
- Emotion education in schools (such as RULER's "mood meter", based on the circumplex) teaches students to label emotions precisely.

## Conclusion
Discrete models capture distinct emotional experiences and functions, while dimensional models capture the continuous structure and overlap of feelings. Many researchers use both: core affect along dimensions, interpreted as specific emotions through context and concepts.`,
    keyPoints: ["Distinction between approaches", "Basic emotions and Plutchik's wheel with combinations", "Russell's circumplex with quadrants", "Core affect", "PANAS and tripartite model", "Comparison table", "Applications"],
    module: "motivation-emotion/1-3",
    visuals: [
      { kind: "sort", caption: "Dimensional models", data: { prompt: "Place each feeling in the circumplex.", buckets: ["Pleasant, high arousal", "Pleasant, low arousal", "Unpleasant, high arousal", "Unpleasant, low arousal"], items: [{ text: "Excited before a trip", bucket: 0 }, { text: "Calm after meditation", bucket: 1 }, { text: "Panicky before an interview", bucket: 2 }, { text: "Bored and low on a Sunday", bucket: 3 }] } },
    ],
    ref: "Russell 1980 and 2003; Plutchik 1980; Watson, Clark and Tellegen 1988 PANAS; Clark and Watson 1991 tripartite model; Bradley and Lang 1994 SAM; Brackett RULER",
  },
  {
    id: "lme-l04-038",
    subject: S,
    topic: "emotion-regulation",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "md-psychiatry"],
    question: "What is emotion regulation? Describe Gross's process model, compare reappraisal and suppression, and discuss the role of emotion regulation difficulties in psychological disorders and their treatment.",
    plan: ["Define emotion regulation", "Gross's process model: five families of strategies", "Reappraisal versus suppression: evidence", "Individual and cultural differences", "Emotion dysregulation in disorders", "Treatments and conclusion"],
    answer: `## Meaning
Emotion regulation refers to the processes by which people influence which emotions they have, when they have them, and how they experience and express them. It can be conscious or automatic, and can increase or decrease positive or negative emotions. It differs from coping, which focuses on stress, though they overlap.

## Gross's process model
James Gross proposed that emotion unfolds over time: a situation is attended to, appraised and then produces a response. Strategies can intervene at five points:
- Situation selection: choosing whether to enter a situation, such as avoiding a party where an ex-partner will be present, or choosing to meet a supportive friend.
- Situation modification: changing the situation, such as asking a noisy neighbour to lower the music.
- Attentional deployment: directing attention, through distraction or concentration; rumination is a maladaptive form.
- Cognitive change: changing the meaning of the situation (reappraisal), such as seeing an interview as a chance to learn rather than a test of worth.
- Response modulation: changing the response after it arises, such as suppressing the expression of emotion, deep breathing, exercise, or using alcohol.
The first four are antecedent-focused strategies (before the emotion fully develops); the last is response-focused.

## Reappraisal versus suppression
| Feature | Cognitive reappraisal | Expressive suppression |
| Timing | Early, antecedent-focused | Late, response-focused |
| Effect on feeling | Reduces negative emotion | Little change in feeling |
| Effect on physiology | Reduces or does not raise arousal | Increases sympathetic arousal |
| Effect on memory | Little cost | Impairs memory for the event |
| Social effects | Neutral or positive | Others feel less connected; raises partner's blood pressure |
| Long-term correlates | Higher wellbeing, fewer depressive symptoms | Lower wellbeing, less closeness |
Evidence: Gross had participants watch a disgusting surgical film. Those told to reappraise it ("view it as a medical student would") reported less disgust; those told to suppress expressions looked less disgusted but felt the same and showed increased sympathetic activation. Jane Richards and Gross found that suppression impaired memory for information presented during the emotional event. Gross and Oliver John's Emotion Regulation Questionnaire measures habitual reappraisal and suppression; habitual suppression correlated with more depressive symptoms and poorer relationships.
Brain imaging by Kevin Ochsner shows reappraisal engages prefrontal and cingulate control regions and reduces amygdala activity.

## Flexibility and culture
- Regulatory flexibility, choosing strategies to fit the situation, may matter more than any single strategy. Reappraisal is less helpful when a situation can and should be changed.
- Culture: suppression's harmful effects are weaker in cultures that value emotional restraint and interdependence. Iris Mauss and others found that among Asian Americans suppression was less linked to depression than among European Americans. In India, restraint of emotional expression before elders is valued, and suppression may serve social harmony.
- Development: children learn regulation from caregivers through co-regulation, and adolescence brings changes in prefrontal control.

## Emotion dysregulation in disorders
- Depression: rumination, reduced reappraisal, difficulty sustaining positive emotions.
- Anxiety disorders: avoidance (situation selection) and worry as a regulation strategy; intolerance of uncertainty.
- Borderline personality disorder: Marsha Linehan's biosocial theory describes high emotional sensitivity, intense reactions and slow return to baseline, combined with an invalidating environment, leading to impulsive regulation such as self-harm.
- Substance use and eating disorders: using drinking, drugs or bingeing to regulate negative feelings.
- PTSD: experiential avoidance and emotional numbing.
- Emotion dysregulation is now seen as a transdiagnostic process across many disorders.

## Treatments
- CBT teaches cognitive restructuring, a form of reappraisal, and reduces avoidance.
- Dialectical behaviour therapy (Linehan) teaches emotion regulation skills: identifying emotions, reducing vulnerability (sleep, food, exercise), opposite action, distress tolerance and mindfulness.
- Acceptance and commitment therapy emphasises accepting emotions rather than controlling them.
- Mindfulness-based approaches develop non-reactive awareness.
- Emotion-focused therapy and the Unified Protocol of David Barlow target emotion regulation across disorders.
- School programmes teach emotional literacy and regulation, such as social-emotional learning curricula and the Happiness Curriculum in Delhi government schools.

## Conclusion
Emotion regulation shapes emotional life at every stage from choosing situations to modifying responses. Reappraisal generally produces better outcomes than suppression, though flexibility and culture matter. Difficulties in regulation are a core transdiagnostic feature of many disorders and a central target of modern therapies.`,
    keyPoints: ["Definition", "Five families in Gross's model", "Antecedent versus response-focused", "Reappraisal versus suppression table with evidence", "Neural basis of reappraisal", "Flexibility and cultural moderation", "Dysregulation in depression, BPD and others", "Treatments such as DBT and CBT"],
    module: "motivation-emotion/3-1",
    visuals: [
      { kind: "flow", data: { title: "Gross's process model", layout: "chain", nodes: [{ id: "s", label: "Situation selection", detail: "Choose where to go." }, { id: "m", label: "Situation modification", detail: "Change what happens." }, { id: "a", label: "Attentional deployment", detail: "Change where you look." }, { id: "c", label: "Cognitive change", detail: "Change what it means: reappraisal." }, { id: "r", label: "Response modulation", detail: "Change the reaction: suppression, breathing." }] } },
      { kind: "compare", data: { title: "Reappraisal versus suppression", a: { label: "Reappraisal", points: ["Changes the meaning early", "Feels less negative", "No memory cost"], summary: "Usually healthier." }, b: { label: "Suppression", points: ["Hides the expression later", "Feeling unchanged, arousal up", "Worse memory and closeness"], summary: "Costly when habitual." } } },
    ],
    ref: "Gross 1998 and 2015; Gross and John 2003; Richards and Gross 2000; Ochsner and Gross 2005; Butler et al 2007 culture and suppression; Linehan 1993; Barlow et al Unified Protocol; Aldao, Nolen-Hoeksema and Schweizer 2010",
  },
  {
    id: "lme-l04-039",
    subject: S,
    topic: "emotion-neuroscience",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "md-psychiatry"],
    question: "Describe the neural basis of emotion, with reference to the limbic system, the amygdala, the prefrontal cortex and the autonomic nervous system.",
    plan: ["From Papez circuit to limbic system", "Amygdala and fear: evidence from animals and patients", "Prefrontal cortex: regulation and decision", "Other structures: insula, anterior cingulate, hypothalamus", "Autonomic and endocrine responses", "Clinical links"],
    answer: `## The limbic system
James Papez in 1937 proposed a circuit for emotion linking the hypothalamus, anterior thalamus, cingulate gyrus and hippocampus. Paul MacLean expanded it into the "limbic system", adding the amygdala and prefrontal regions. Heinrich Kluver and Paul Bucy found that removing the temporal lobes (including the amygdala) in monkeys made them tame, fearless, hypersexual and prone to put objects in their mouths (Kluver Bucy syndrome). The limbic system concept is still used, though emotion is now seen as distributed across networks, and the hippocampus is mainly a memory structure.

## The amygdala
The amygdala, an almond-shaped group of nuclei in the medial temporal lobe, is central to detecting threat and learning fear.
- Joseph LeDoux showed that the amygdala is essential for fear conditioning: lesions prevent rats from learning to fear a tone paired with shock. Sensory information reaches it by a fast route from the thalamus and a slower route via the cortex. The central nucleus triggers fear responses through the hypothalamus and brainstem: freezing, increased heart rate and stress hormones.
- Patient S.M., with bilateral amygdala damage from Urbach Wiethe disease, shows almost no fear, approaches snakes and spiders, cannot recognise fear in faces, and does not keep normal personal space, as Justin Feinstein and Ralph Adolphs described.
- In humans, the amygdala responds to fearful and angry faces, even when presented subliminally, and is involved in enhancing memory for emotional events.
- It also responds to rewards and novelty, signalling relevance more generally.

## The prefrontal cortex
- The ventromedial and orbitofrontal prefrontal cortex link emotion to decision-making and social behaviour. Phineas Gage and Antonio Damasio's patient Elliot, after ventromedial damage, retained intelligence but made poor personal and social decisions; Damasio's somatic marker hypothesis proposes that bodily emotional signals guide choices. In the Iowa gambling task, such patients continued to choose risky decks and lacked anticipatory skin conductance responses.
- The dorsolateral and ventrolateral prefrontal cortex support deliberate emotion regulation, such as reappraisal, which reduces amygdala activity.
- Richard Davidson found that greater left than right frontal activity is associated with approach-related positive emotions, and greater right activity with withdrawal-related negative emotions.

## Other structures
- Insula: interoception and the feeling of bodily states; disgust (patients with insula damage may fail to recognise disgust).
- Anterior cingulate cortex: conflict, pain unpleasantness and social pain of rejection.
- Hypothalamus: coordinates autonomic and endocrine responses; stimulation can produce rage-like behaviour in cats ("sham rage").
- Ventral striatum and nucleus accumbens with dopamine: reward, wanting and positive emotion.
- Periaqueductal grey: defensive behaviours and pain modulation.

## Autonomic and endocrine responses
- The sympathetic nervous system prepares for fight or flight: increased heart rate and blood pressure, dilated pupils, sweating, redirected blood flow, and adrenaline from the adrenal medulla.
- The parasympathetic system calms and restores (rest and digest).
- The hypothalamic pituitary adrenal axis releases cortisol during stress.
- Polygraphs measure these autonomic changes, though they detect arousal, not lies.

## Clinical links
- Anxiety disorders and PTSD: amygdala hyperactivity and weaker prefrontal control; reduced hippocampal volume in chronic PTSD.
- Depression: altered amygdala responses, reduced prefrontal activity and changes in reward circuitry; deep brain stimulation of the subgenual cingulate has been tried for resistant depression.
- Psychopathy: reduced amygdala responses to fear and distress cues.
- Frontotemporal dementia: loss of empathy and social emotions.

## Conclusion
Emotion depends on a network: the amygdala detects significance and threat, the prefrontal cortex evaluates and regulates, the insula and cingulate generate felt experience, and the hypothalamus and autonomic nervous system produce bodily responses. Disturbances in this network underlie many psychiatric disorders.`,
    keyPoints: ["Papez circuit and limbic system", "Kluver Bucy syndrome", "Amygdala in fear conditioning with LeDoux", "Patient S.M.", "Ventromedial PFC and somatic markers with Iowa gambling task", "Insula, cingulate, hypothalamus and striatum roles", "Sympathetic, parasympathetic and HPA responses", "Clinical links"],
    module: "motivation-emotion/3-1",
    visuals: [
      { kind: "brainexplorer", caption: "The prefrontal cortex", data: { title: "The emotional brain", focus: ["amygdala", "prefrontal", "hypothalamus", "hippocampus"], caption: "How do the amygdala and the prefrontal cortex each change emotional life?" } },
      { kind: "stress", caption: "The amygdala", data: {} },
    ],
    ref: "Papez 1937; Kluver and Bucy 1939; LeDoux 1996 and 2000; Feinstein et al 2011 Current Biology; Damasio 1994; Bechara et al 1997; Davidson 1992; Bear, Connors and Paradiso ch 18",
  },
  {
    id: "lme-l04-040",
    subject: S,
    topic: "emotion-theories",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on the facial feedback hypothesis.",
    plan: ["State the hypothesis", "Classic pen study", "Replication controversy", "Other evidence and applications"],
    answer: `## The hypothesis
The facial feedback hypothesis proposes that facial expressions do not just express emotions but also influence them: feedback from facial muscles contributes to emotional experience. It follows from William James's idea that bodily changes produce feelings, and from Silvan Tomkins.

## The classic pen study
Fritz Strack, Leonard Martin and Sabine Stepper in 1988 asked participants to hold a pen in their mouth while rating cartoons, under the cover story of studying how people with disabilities write. Holding the pen between the teeth (which activates smiling muscles) led to higher funniness ratings than holding it between the lips (which prevents smiling). Because participants did not know the purpose, the effect could not be due to demand characteristics.

## Replication controversy
A registered replication in 2016 involving 17 laboratories found no effect of the pen procedure on cartoon ratings. Strack argued that video recording of participants in the replications may have changed the result. A later large multinational study, the Many Smiles Collaboration, found that posed smiles produced small increases in reported happiness, though the pen-in-mouth version was weaker.

## Other evidence
- Participants who had botulinum toxin (Botox) injections that paralysed frown muscles were slower to understand angry or sad sentences, and some trials suggest Botox in the frown area reduces depressive symptoms.
- Ekman's directed facial action studies found some emotion-specific physiological changes from posing expressions.

## Conclusion
Facial feedback appears to have a small, real influence on emotion, but early claims were overstated. It supports the role of bodily signals in emotion and is used in some therapies, such as encouraging smiling or posture change, with modest effects.`,
    keyPoints: ["Statement and roots in James", "Strack pen study with cover story", "2016 registered replication failure", "Many Smiles finding", "Botox evidence", "Balanced conclusion"],
    module: "motivation-emotion/1-3",
    visuals: [
      { kind: "compare", caption: "The classic pen study", data: { title: "The pen study", a: { label: "Pen between teeth", points: ["Smiling muscles active", "Cartoons rated funnier in 1988"], summary: "Forced smile." }, b: { label: "Pen between lips", points: ["Smiling blocked", "Cartoons rated less funny"], summary: "No smile." } } },
    ],
    ref: "Strack, Martin and Stepper 1988; Wagenmakers et al 2016 RRR; Coles et al 2022 Many Smiles Collaboration Nature Human Behaviour; Havas et al 2010; Finzi and Rosenthal 2014",
  },
];
