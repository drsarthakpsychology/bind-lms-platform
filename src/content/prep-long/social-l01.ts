import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, cycle, layers, tree, vis } from "./visual";

const S = "social" as const;

export const SOCIAL_L01: LongQA[] = anchored([
  {
    id: "soc-l01-001",
    subject: S,
    topic: "attribution",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Explain Kelley's covariation model of attribution, with an example. Describe his causal schemas of discounting and augmenting, and evaluate the model.",
    plan: ["What attribution is and Heider's starting point", "Three kinds of information", "Patterns that give person, stimulus and circumstance attributions, with a worked example", "Configuration: discounting and augmenting", "Evidence and criticisms"],
    answer: `## Attribution and Heider
Attribution is the process by which people explain the causes of their own and others' behaviour. Fritz Heider, who called ordinary people naive psychologists, distinguished internal or dispositional causes, such as ability, effort or personality, from external or situational causes, such as task difficulty, other people or luck. Harold Kelley turned this idea into a systematic model of how people reach such judgements.

## The covariation principle
Kelley proposed that people act like intuitive scientists: an effect is attributed to the cause with which it covaries over time. When we have observed a person on several occasions, we use three kinds of information:
- Consensus: do other people behave the same way towards this stimulus? High consensus means most people do.
- Distinctiveness: does this person behave this way only towards this stimulus, or towards many? High distinctiveness means only this one.
- Consistency: does this person behave this way towards this stimulus on other occasions? High consistency means almost always.

## Patterns and a worked example
Suppose Arjun laughs at a comedian on a Saturday night show.
| Pattern | Consensus | Distinctiveness | Consistency | Attribution |
| Everyone laughs, Arjun laughs at no other comedian, he always laughs at this one | High | High | High | The stimulus: the comedian is funny |
| Few others laugh, Arjun laughs at every comedian, he always laughs at this one | Low | Low | High | The person: Arjun laughs easily |
| Arjun has never laughed at this comedian before | Any | Any | Low | The circumstance: something about tonight |
Leslie McArthur gave participants such information in sentence form and found that their attributions largely followed these predictions, especially for consistency and distinctiveness.

## Causal schemas: when information is limited
Often we see a behaviour only once. Kelley proposed that we then rely on causal schemas, ready made beliefs about how causes combine.
- Discounting principle: the role of a cause is discounted if other plausible causes are present. If a student praises a teacher just before marks are given, we discount liking as the cause because wanting good marks also explains it.
- Augmenting principle: the role of a cause is strengthened if the behaviour occurs despite an inhibitory cause. A doctor who speaks out against her own hospital, risking her job, is seen as strongly committed to her view.
- Multiple sufficient causes: either cause alone can produce the effect, which leads to discounting.
- Multiple necessary causes: several causes must be present together, as when we assume that winning a hard race needs both ability and effort.

## Evaluation
Strengths:
- It gives a precise, testable account of how people use information and has been widely supported in laboratory studies.
- It explains clinical and everyday judgements, for example deciding whether a patient's complaint about a ward reflects the ward or the patient.
- Discounting explains the overjustification effect, in which rewards undermine intrinsic motivation, and why ingratiation is often distrusted.

Criticisms:
- People underuse consensus information, relying instead on vivid individual cases; Richard Nisbett and Eugene Borgida showed that knowing most people failed to help in an experiment did not change predictions about an individual.
- The model is effortful; in real life we rarely have all three kinds of information or the motivation to process it, and we often use shortcuts and biases such as the fundamental attribution error.
- It assumes a rational, logical perceiver and ignores motives such as self esteem, which produce self serving attributions.
- It describes what people can do in experiments with ready made information more than what they do spontaneously.
- Culture affects which information is weighed; people in collectivist cultures such as India give more weight to context and roles.

## Conclusion
Kelley's model shows how people can reach logical attributions from patterns of consensus, distinctiveness and consistency, and his causal schemas explain judgements from single observations. It is best seen as a normative ideal that people approach when motivated and well informed, while biases describe what often happens instead.`,
    keyPoints: ["Definition of attribution and Heider's internal and external causes", "Consensus, distinctiveness and consistency defined", "High high high gives stimulus, low low high gives person, low consistency gives circumstance", "A worked example", "Discounting and augmenting with examples", "McArthur's evidence", "Criticisms including underuse of consensus and rationality assumption"],
    pitfalls: ["Mixing up distinctiveness and consistency", "Giving only the information types without the patterns", "No evaluation"],
    module: "social/1-3",
    visuals: [
      vis("worked", {
        title: "Patterns and a worked example",
        steps: [
          { q: "Everyone laughs at the comedian, Arjun laughs at no one else, and always at him. Cause?", a: "High consensus, high distinctiveness, high consistency: the comedian is funny." },
          { q: "Few laugh, Arjun laughs at every comedian, always at this one. Cause?", a: "Low consensus, low distinctiveness, high consistency: Arjun laughs easily." },
          { q: "Arjun has never laughed at this comedian before tonight. Cause?", a: "Low consistency: something about the circumstance." },
        ],
      }),
    ],
    ref: "Heider 1958; Kelley 1967 and 1972 causal schemas; McArthur 1972; Nisbett and Borgida 1975; Miller 1984; social module 1.3",
  },
  {
    id: "soc-l01-002",
    subject: S,
    topic: "attribution",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe Jones and Davis's theory of correspondent inference. What factors lead us to infer a disposition from behaviour, and what are the limits of the theory?",
    plan: ["Aim of the theory and meaning of correspondence", "Choice and intention", "Non common effects and social desirability", "Hedonic relevance and personalism", "Evidence from the Castro essay study and limitations"],
    answer: `## The question
Edward Jones and Keith Davis asked when we infer that a person's behaviour reflects a stable disposition, such as kindness or hostility. A correspondent inference is the judgement that an act corresponds to an underlying trait or intention: "she shouted because she is an aggressive person". Their theory deals with intentional acts and assumes that the perceiver first decides the actor knew the consequences and was able to produce them.

## Factors that increase correspondent inferences
- Choice: behaviour freely chosen tells us more than behaviour forced by the situation. A clerk who is polite because a supervisor is watching reveals little.
- Non common effects: when a person chooses one option over another, we look at the consequences unique to the chosen option. If a student picks a college that is near home, cheap and strong in psychology over one that is near home and cheap, the non common effect, strength in psychology, tells us what she values. The fewer the non common effects, the clearer the inference.
- Low social desirability: expected, socially approved behaviour tells us little, because almost everyone would do it. Unexpected behaviour is informative. A guest who praises the host's food reveals little; a guest who criticises it reveals a lot.
- Role inconsistent behaviour: acting against role expectations, as when a job applicant for a team role presents himself as a loner, leads to confident trait inferences.
- Hedonic relevance: when the behaviour affects us directly, we are more likely to infer a disposition.
- Personalism: when we believe the behaviour was aimed at us personally, inferences become stronger still.

## Evidence
In Jones and Victor Harris's study, students read essays supporting or opposing Fidel Castro. Even when told that the writer had been assigned the position by a debate coach, participants inferred that a pro Castro essay writer held pro Castro views. Choice should have discounted the essay, but it did not fully do so. This was the first clear evidence of what was later called the correspondence bias or fundamental attribution error.

## Limitations
- The theory covers only intentional behaviour and ignores accidental or habitual acts.
- People do not always reason carefully about choice and non common effects; the Castro study shows inference often runs ahead of logic.
- It focuses on single acts and says little about information gathered over time, which Kelley's model handles.
- It is largely about internal attributions and treats situational explanations as a residue.
- Culture matters: Indian perceivers are more likely to explain behaviour by duties and roles, so they make correspondent inferences less readily than Americans.

## Conclusion
Jones and Davis showed that freely chosen, unexpected and personally relevant behaviour leads us to infer traits, and their work uncovered our tendency to over infer dispositions even when the situation should explain the act.`,
    keyPoints: ["Definition of correspondent inference", "Choice and intention", "Non common effects with an example", "Low social desirability and role inconsistency", "Hedonic relevance and personalism", "Jones and Harris Castro essay study", "Limitations including culture"],
    pitfalls: ["Confusing this with Kelley's covariation model", "Missing the point that the Castro study revealed a bias"],
    module: "social/1-3",
    visuals: [
      chain("Factors that increase correspondent inferences", [["Act observed", "Intentional and foreseen"], ["Freely chosen", "Not forced by the situation"], ["Few non common effects", "A clear reason stands out"], ["Socially undesirable", "Not what anyone would do"], ["Relevant to me", "Hedonic relevance and personalism"], ["Trait inferred", "She is that kind of person"]]),
    ],
    ref: "Jones and Davis 1965; Jones and Harris 1967 Castro essays; Jones, Davis and Gergen 1961 role inconsistent; Miller 1984; social module 1.3",
  },
  {
    id: "soc-l01-003",
    subject: S,
    topic: "attribution",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Explain Weiner's attribution theory of achievement motivation. How do attributions for success and failure affect emotions and future behaviour? Give applications.",
    plan: ["Three dimensions", "Four classic causes placed on the dimensions", "Emotional consequences of each dimension", "Expectancy and behaviour", "Applications: education, retraining, stigma, India"],
    answer: `## Three dimensions
Bernard Weiner proposed that the causes people give for success and failure differ along three dimensions:
- Locus: internal to the person or external.
- Stability: stable over time or changeable.
- Controllability: under the person's control or not.

## Classic causes
| Cause | Locus | Stability | Controllability |
| Ability | Internal | Stable | Uncontrollable |
| Effort | Internal | Unstable | Controllable |
| Task difficulty | External | Stable | Uncontrollable |
| Luck | External | Unstable | Uncontrollable |
Other causes include mood, illness, teacher bias and help from others.

## Emotional consequences
Each dimension links to particular emotions.
- Locus affects self esteem emotions: success attributed internally produces pride; failure attributed internally lowers self esteem.
- Stability affects expectations and hope: a failure attributed to a stable cause, "I am bad at maths", produces hopelessness and an expectation of future failure; an unstable cause, "I did not study enough", leaves hope.
- Controllability affects social and moral emotions: failure due to a controllable cause such as lack of effort produces guilt in oneself and anger in others; failure due to an uncontrollable cause such as low ability or illness produces shame in oneself and pity in others.

## Expectancy and behaviour
A student who fails the board examination and says "I am not intelligent" (internal, stable, uncontrollable) is likely to feel shame and hopelessness and to give up. A student who says "I did not revise the last three chapters" (internal, unstable, controllable) is likely to feel guilt but to try harder. Persistence therefore depends on whether failure is seen as changeable.

## Applications
- Attributional retraining: teaching students to attribute failure to effort and strategy rather than ability improves persistence and grades. In one study, first year college students who were told that grades usually improve after the first year earned better grades and dropped out less than controls.
- Teacher feedback: praise for effort and strategy rather than for being clever supports persistence, a link to Carol Dweck's work on growth mindset, whose effects in large trials are real but smaller than first claimed.
- Helping and stigma: people help those whose problems seem uncontrollable and blame those whose problems seem controllable. Seeing mental illness or addiction as a matter of willpower produces anger and less help; anti stigma work addresses these attributions.
- Indian context: attributions to fate or karma, studied by Ajit Dalal in illness and recovery, are external, stable and uncontrollable; they can comfort but may also reduce effort at self care.
- Depression: the learned helplessness reformulation applies similar dimensions; internal, stable and global attributions for bad events predict depression.

## Conclusion
Weiner showed that it is not success or failure itself but the explanation given for it that shapes emotions, expectations and effort. Because attributions can be changed, the theory has direct value for teachers, counsellors and clinicians.`,
    keyPoints: ["Locus, stability and controllability defined", "Ability, effort, task difficulty and luck placed on dimensions", "Emotions linked to each dimension: pride, hopelessness, guilt, shame, anger, pity", "Effect on expectancy and persistence with an example", "Attributional retraining evidence", "Applications to stigma and Indian fate attributions"],
    pitfalls: ["Leaving out controllability, the third dimension", "Placing effort as stable", "No applications"],
    module: "social/1-3",
    visuals: [
      vis("sort", {
        prompt: "Which of Weiner's classic causes is this? Place each explanation of a failed exam.",
        buckets: ["Ability", "Effort", "Task difficulty", "Luck"],
        items: [
          { text: "I am just not a maths person", bucket: 0 },
          { text: "I did not revise the last three chapters", bucket: 1 },
          { text: "That paper was the toughest in ten years", bucket: 2 },
          { text: "The questions I prepared did not come", bucket: 3 },
        ],
      }, "Classic causes: sort the explanations"),
    ],
    ref: "Weiner 1979, 1985, 1986; Wilson and Linville 1982 attributional retraining; Weiner, Perry and Magnusson 1988 stigma; Dalal fate attributions; Abramson, Seligman and Teasdale 1978; Sisk et al 2018 mindset meta-analysis",
  },
  {
    id: "soc-l01-004",
    subject: S,
    topic: "attribution",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "cuet-pg"],
    question: "Critically discuss the major biases in attribution: the fundamental attribution error, the actor observer effect, the self serving bias and others. Why do they occur, and how does culture influence them?",
    plan: ["Attribution as a shortcut prone process", "Fundamental attribution error with evidence and explanations", "Actor observer effect and its weak support", "Self serving bias, false consensus and others", "Culture: Miller's Indian study and others", "Applications and conclusion"],
    answer: `## Introduction
Attribution theories describe how people could reason logically about causes. In practice, attributions are made quickly and under motives, and they show systematic biases. These biases matter in courts, classrooms, clinics and intergroup relations.

## The fundamental attribution error
The fundamental attribution error, named by Lee Ross, is the tendency to overestimate dispositional causes and underestimate situational causes when explaining other people's behaviour. Daniel Gilbert preferred the term correspondence bias.
Evidence:
- In Edward Jones and Victor Harris's Castro essay study, readers judged that writers believed what they wrote even when told the position had been assigned.
- In Ross's quiz master study, participants randomly assigned to ask questions from their own knowledge were judged more knowledgeable than contestants, even by observers who knew the roles were random.
Explanations:
- Perceptual salience: the actor is the moving, noticeable figure against the background of the situation. Shelley Taylor and Susan Fiske found that observers rated whichever person in a conversation they faced as more causally influential.
- Two step model: Gilbert proposed that we infer a trait automatically and then correct for the situation only if we have the time and capacity. Under cognitive load, the error grows.
- Situations are often invisible: we do not see the pressures, history or roles behind a behaviour.
- Belief in a just world and a culture of personal responsibility make dispositional explanations attractive.

## The actor observer effect
Edward Jones and Richard Nisbett proposed that actors attribute their own behaviour to the situation while observers attribute the same behaviour to the actor's dispositions. "I was late because of traffic; he was late because he is careless." Explanations included differences in information, since actors know their history, and in perspective, since actors look out at the situation. Michael Storms found that when actors watched a videotape of themselves from the observer's angle, their attributions became more dispositional. However, a large review by Bertram Malle found the overall actor observer asymmetry to be close to zero, appearing mainly for negative events and for familiar others, so it is weaker than textbooks suggest.

## Self serving bias
People attribute their successes to internal causes, such as ability and effort, and their failures to external causes, such as bad luck or unfair examiners. This protects self esteem and is seen in students, athletes, managers and drivers. It is stronger in individualist cultures and weaker or reversed in some East Asian samples, and depressed people often show it less, a pattern sometimes called depressive realism.

## Other biases
- False consensus effect: overestimating how many others share one's opinions and behaviours. In one study, students who agreed to walk around campus wearing a sandwich board estimated that most others would agree, while those who refused thought most would refuse.
- Ultimate attribution error: Thomas Pettigrew described explaining an outgroup's bad behaviour by disposition and its good behaviour by luck or special circumstance, while doing the reverse for the ingroup. It sustains prejudice between castes and religions.
- Hostile attribution bias: aggressive children, studied by Kenneth Dodge, read hostile intent into ambiguous acts such as being bumped.
- Belief in a just world: Melvin Lerner showed that people need to believe the world is fair and so blame victims, for example blaming survivors of sexual violence.
- Defensive attribution: blaming victims more when we feel similar to them and want to believe it could not happen to us.

## Culture and attribution
Joan Miller asked Hindu Indians and Americans of different ages to explain everyday good and bad acts of people they knew. American adults gave many more dispositional explanations; Indian adults gave more contextual ones, referring to roles, duties and circumstances. Children of 8 in the two cultures were similar, so the difference grows with socialisation. Michael Morris and Kaiping Peng found that American newspapers explained the same murders by the killers' personalities while Chinese newspapers stressed situations and relationships. When the situation is made salient, East Asian participants correct for it more readily than Americans, although they still show some correspondence bias. Hazel Markus and Shinobu Kitayama linked these patterns to independent and interdependent views of the self.

## Applications
- Clinical work: attributing a patient's non adherence to laziness instead of side effects or cost leads to blame instead of problem solving. Supervision encourages asking what in the situation might explain behaviour.
- Law: juries and police may overweight disposition, ignoring coercion.
- Depression: an internal, stable, global style for bad events predicts depression; cognitive therapy targets it.
- Intergroup relations: training people to consider situational explanations for outgroup behaviour can reduce prejudice.

## Evaluation
Some biases, such as the fundamental attribution error and self serving bias, are robust; others, such as the actor observer effect, are weak. Some apparent errors may be reasonable, since dispositions do predict behaviour, and situational correction requires information people often lack. Culture shows that the biases are learnt habits of explanation, not fixed features of the mind.

## Conclusion
Attribution biases show how quick, motivated and culturally shaped our explanations are. Recognising them helps clinicians, teachers and citizens make fairer judgements.`,
    keyPoints: ["FAE defined with Jones and Harris and quiz master evidence", "Salience and Gilbert's two step explanation", "Actor observer effect with Storms and Malle's weak meta-analytic support", "Self serving bias and its cultural limits", "False consensus, ultimate attribution error, hostile attribution, just world", "Miller's Indian study and Morris and Peng", "Applications in clinic, law and prejudice", "Evaluation of robustness"],
    pitfalls: ["Presenting the actor observer effect as robust", "No cultural evidence", "Listing biases without explanations of why they occur"],
    module: "social/1-3",
    visuals: [
      chain("The fundamental attribution error: Gilbert's two step model", [["See behaviour", "He snapped at the nurse"], ["Automatic trait inference", "He is rude"], ["Effortful correction", "But he had a 24 hour shift"], ["Under load", "Correction is skipped and the error grows"]]),
      compare(
        "Culture and attribution: Miller's finding",
        ["American adults", ["Self seen as separate and stable", "Explain by traits: he is selfish", "Strong fundamental attribution error"], "Look inside the person"],
        ["Hindu Indian adults", ["Self embedded in roles and duties", "Explain by context: he had just lost his job", "Weaker error; children similar in both cultures"], "Look at circumstances and roles"],
      ),
    ],
    ref: "Ross 1977; Jones and Harris 1967; Ross, Amabile and Steinmetz 1977 quiz master; Taylor and Fiske 1975; Gilbert, Pelham and Krull 1988; Jones and Nisbett 1971; Storms 1973; Malle 2006 meta-analysis; Ross, Greene and House 1977; Pettigrew 1979; Dodge 1980; Lerner 1980; Miller 1984; Morris and Peng 1994; Markus and Kitayama 1991",
  },
  {
    id: "soc-l01-005",
    subject: S,
    topic: "social-cognition",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net", "mcp-entrance"],
    question: "What are heuristics? Explain the representativeness, availability and anchoring heuristics with examples, and discuss their role in social and clinical judgement.",
    plan: ["Define heuristics as mental shortcuts", "Representativeness with base rate neglect and the conjunction fallacy", "Availability with examples", "Anchoring and adjustment", "Clinical relevance and the adaptive view"],
    answer: `## Heuristics
Heuristics are mental shortcuts that allow quick judgements under uncertainty without full analysis. Amos Tversky and Daniel Kahneman showed in the 1970s that people rely on a few general heuristics. They usually work well enough, but they produce predictable errors, called biases.

## Representativeness
We judge the probability that something belongs to a category by how much it resembles our prototype of that category, neglecting other information.
- Base rate neglect: told that a man is shy, tidy and fond of detail, people judge him more likely to be a librarian than a farmer, ignoring that farmers vastly outnumber librarians.
- Conjunction fallacy: in the Linda problem, Linda is described as a former philosophy student concerned with social justice. Most people judge "Linda is a bank teller and active in the feminist movement" more likely than "Linda is a bank teller", which is logically impossible, because the combined description sounds more representative.
- Gambler's fallacy: after five heads, people expect tails because a mixed sequence looks more random.

## Availability
We judge frequency or probability by how easily examples come to mind.
- People judge that more English words begin with K than have K as the third letter, because words beginning with a letter are easier to retrieve; in fact the reverse is true.
- After news of a plane crash or a terror attack, people overestimate these risks and underestimate common ones such as road accidents or diabetes.
- Vivid personal cases outweigh statistics.

## Anchoring and adjustment
We start from an initial value, the anchor, and adjust insufficiently. In Tversky and Kahneman's study, participants spun a wheel that landed on 10 or 65 and were asked what percentage of United Nations members were African countries. Median estimates were about 25 for those who saw 10 and about 45 for those who saw 65, although the wheel was obviously random. Anchors affect salary negotiations, prices and court sentences.

## Social and clinical judgement
- Stereotyping is a form of representativeness: judging a person by how well they fit a group prototype.
- Availability shapes diagnosis: a psychiatrist who recently saw a rare case may overdiagnose it.
- Anchoring and premature closure: a first impression in a referral letter, such as "known case of anxiety", can anchor the assessment so that a thyroid problem or substance use is missed.
- Diagnostic overshadowing: attributing physical symptoms of a person with mental illness to their psychiatric condition.
Remedies include structured interviews, checklists, considering the opposite, and attending to base rates.

## The adaptive view
Gerd Gigerenzer argues that heuristics are fast and frugal tools that are often accurate in real environments, and that many apparent errors shrink when problems are presented as natural frequencies, such as 3 out of 100, rather than probabilities. Heuristics are therefore not simply irrational but suited to limited time and information.

## Conclusion
Representativeness, availability and anchoring save effort but produce systematic biases. Knowing them helps clinicians and decision makers slow down when the stakes are high.`,
    keyPoints: ["Definition of heuristics and Tversky and Kahneman", "Representativeness with base rate neglect and Linda problem", "Availability with the letter K example", "Anchoring with the wheel study figures", "Applications to stereotyping and diagnosis", "Remedies", "Gigerenzer's adaptive view"],
    pitfalls: ["Confusing representativeness with availability", "Treating heuristics as always irrational"],
    module: "social/1-2",
    visuals: [
      vis("experiment", { title: "Anchoring and adjustment: the wheel of fortune", question: "Median estimate of the percentage of UN members that are African countries, after a random wheel showed 10 or 65", unit: "%", conditions: [{ label: "Wheel showed 10", value: 25 }, { label: "Wheel showed 65", value: 45 }], why: "An obviously random number still pulled estimates towards it." }),
    ],
    ref: "Tversky and Kahneman 1973 availability, 1974 Science heuristics, 1983 conjunction fallacy; Gigerenzer 1996 and Hoffrage natural frequencies; Croskerry diagnostic error; social module 1.2",
  },
  {
    id: "soc-l01-006",
    subject: S,
    topic: "social-cognition",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is a self fulfilling prophecy? Discuss the evidence from classroom and interpersonal studies, the size of the effect, and its implications.",
    plan: ["Define with Merton's idea", "Three steps of behavioural confirmation", "Rosenthal and Jacobson's classroom study", "Snyder's telephone study and Word, Zanna and Cooper", "Effect size debate and implications in India and clinics"],
    answer: `## Meaning
A self fulfilling prophecy is an initially false expectation that leads to behaviour that makes the expectation come true. The sociologist Robert Merton coined the term, using the example of a bank that collapses because of a rumour that it is unsafe: depositors rush to withdraw, and the rumour becomes true. In social psychology the process is called behavioural confirmation.

## Three steps
1. A perceiver forms an expectation about a target person.
2. The perceiver treats the target in line with the expectation.
3. The target responds in a way that confirms it, and the perceiver sees the expectation as proven.

## The classroom study
Robert Rosenthal and Lenore Jacobson gave pupils at a Californian elementary school a test described as predicting intellectual blooming. They then told teachers that about a fifth of the children, actually chosen at random, were likely to bloom. Eight months later, these children showed larger IQ gains than the others, especially in the first and second grades. Rosenthal proposed four routes: teachers gave expected bloomers a warmer climate, more feedback, more input and more chances to respond.

## Interpersonal studies
- Mark Snyder, Elizabeth Tanke and Ellen Berscheid had male students talk by telephone to female students after seeing a photograph supposedly of her, either attractive or unattractive. Men who thought they were speaking to an attractive woman were warmer, and independent judges who heard only the women's side rated those women as more friendly and sociable.
- Carl Word, Mark Zanna and Joel Cooper found that white interviewers sat further away from and gave shorter interviews to black applicants. When trained interviewers then treated white applicants in that cold way, these applicants performed worse, showing how stereotypes can create the differences they assume.

## How strong is the effect?
Later research is more cautious. Replications of the classroom study were mixed, and Lee Jussim's reviews found that teacher expectations are mostly accurate, reflecting real past performance, and that self fulfilling effects are typically small. However, the effects are larger for low achieving and stigmatised pupils, and they can accumulate across years. Targets who know the perceiver's expectation and are confident in themselves can resist it.

## Implications
- Education in India: labels such as "weak students", streaming into sections by marks, and caste or gender stereotypes about who is good at mathematics can lower teacher input for some children.
- Clinics: a label such as "difficult patient" or "attention seeking" can change how staff respond, provoking the behaviour it predicts. David Rosenhan's study of pseudopatients showed how a diagnosis can colour interpretation of normal behaviour.
- Positive use: high, warm expectations, as in teacher training programmes, can raise performance.

## Conclusion
Expectations can shape reality through the way we treat others. The effect is real but usually modest, strongest for vulnerable groups, and an important reason to examine labels in schools and services.`,
    keyPoints: ["Definition and Merton's bank example", "Three steps of behavioural confirmation", "Rosenthal and Jacobson design and finding", "Snyder telephone study", "Word, Zanna and Cooper interview study", "Jussim's caution about size and accuracy", "Applications in Indian schools and clinics"],
    pitfalls: ["Overstating the Pygmalion effect as large and universal", "Describing only one study"],
    module: "social/1-2",
    visuals: [
      cycle("Three steps of a self fulfilling prophecy", [["Expectation", "This boy is a weak student"], ["Treatment", "Less attention, easier questions"], ["Response", "He participates less and learns less"], ["Confirmation", "See, he is weak"]]),
    ],
    ref: "Merton 1948; Rosenthal and Jacobson 1968 Pygmalion in the Classroom; Snyder, Tanke and Berscheid 1977; Word, Zanna and Cooper 1974; Jussim and Harber 2005 review; Rosenhan 1973",
  },
  {
    id: "soc-l01-007",
    subject: S,
    topic: "social-cognition",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the role of schemas, priming and automatic versus controlled processing in social cognition. Illustrate with research, including what has failed to replicate.",
    plan: ["Social cognition and schemas", "Functions and costs of schemas: confirmation, perseverance", "Priming and accessibility with evidence", "Dual process models and automatic stereotyping", "Replication problems", "Applications"],
    answer: `## Social cognition and schemas
Social cognition is the study of how people select, interpret, remember and use social information. A central idea is the schema: an organised structure of knowledge about a concept, built from experience, that guides attention and interpretation. Types include person schemas (what a particular person is like), self schemas, role schemas (what doctors or teachers are like), and event schemas or scripts (what happens at a wedding or a hospital visit).

## What schemas do
- They save effort: we know what to expect and fill in missing details.
- They guide attention and memory: we notice and recall information that fits.
- They can distort: in a classic study, people who watched a video of a woman were more likely to recall details that fitted the occupation they were told she had, a waitress or a librarian.
- Confirmation bias: we seek information that confirms our beliefs.
- Belief perseverance: Lee Ross and colleagues gave participants false feedback about their ability to tell real from fake suicide notes; even after being told the feedback was invented, they kept believing in their ability. Explaining why a belief might be true makes it resistant to disproof.

## Priming and accessibility
Schemas that are accessible, recently or frequently activated, are more likely to be used. Priming is the activation of a schema by recent experience. Tory Higgins, William Rholes and Carl Jones had participants memorise words such as "reckless" or "adventurous" in an apparently unrelated task, then read about Donald, who went sky diving and crossed the Atlantic in a sailboat. Those primed with "reckless" rated Donald more negatively. Chronic accessibility explains individual differences: a person anxious about rejection sees rejection in neutral faces.

## Automatic versus controlled processing
Dual process models distinguish two kinds of thinking:
| Automatic | Controlled |
| Fast, effortless, unintentional | Slow, effortful, deliberate |
| Runs without awareness | Conscious and flexible |
| Uses schemas and heuristics | Can correct first impressions |
| Dominates under time pressure, fatigue or load | Needs motivation and capacity |
Daniel Kahneman popularised these as System 1 and System 2.
Patricia Devine showed that stereotypes are known by almost everyone in a culture and can be activated automatically even in low prejudiced people, but that low prejudiced people use controlled processing to replace them with their personal beliefs when they have time and motivation. Stereotyping is therefore not inevitable. Daniel Gilbert's two step model of attribution, automatic trait inference followed by effortful correction, is another dual process idea.

## What has failed to replicate
- John Bargh and colleagues reported that students primed with words related to old age walked more slowly down a corridor. Later, larger studies with automated timing did not reproduce the effect, except when experimenters expected it.
- Many behavioural priming effects, such as money priming and cleanliness primes affecting moral judgement, have shrunk or vanished in large replications.
- Semantic priming in reaction time tasks, and priming of interpretation as in the Donald study, are much more robust.
The lesson is that schemas shape judgement reliably, but claims that tiny cues control complex behaviour need strong evidence.

## Applications
- Clinical: assessment schemas such as "this is a typical somatiser" can lead to missed diagnoses; structured interviews and second opinions activate controlled processing.
- Cognitive therapy targets negative self schemas that bias attention and memory in depression.
- Reducing prejudice: increasing motivation and capacity for controlled processing, and exposure to counter stereotypic examples, weakens automatic stereotyping.

## Conclusion
Schemas and priming make social perception efficient but biased, and automatic processes run first while controlled processes can correct them. Some famous priming findings have not survived replication, which has made the field more careful about effect sizes.`,
    keyPoints: ["Definition of social cognition and schema types", "Functions and distortions of schemas", "Belief perseverance study", "Priming with the Donald study", "Automatic versus controlled processing table", "Devine's automatic and controlled stereotyping", "Failed replications of behavioural priming", "Clinical and prejudice applications"],
    pitfalls: ["Citing the elderly walking study as established", "Defining schema without examples", "No dual process comparison"],
    module: "social/1-2",
    visuals: [
      compare(
        "Automatic versus controlled processing",
        ["Automatic", ["Fast and effortless", "Unintentional", "Uses schemas and heuristics", "Wins under load or hurry"], "System 1: first impressions"],
        ["Controlled", ["Slow and effortful", "Deliberate and flexible", "Corrects first impressions", "Needs motivation and capacity"], "System 2: second thoughts"],
      ),
    ],
    ref: "Fiske and Taylor social cognition; Cohen 1981 waitress librarian; Ross, Lepper and Hubbard 1975 belief perseverance; Higgins, Rholes and Jones 1977; Devine 1989; Bargh, Chen and Burrows 1996; Doyen et al 2012 replication; Kahneman 2011",
  },
  {
    id: "soc-l01-008",
    subject: S,
    topic: "self",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Discuss the social self: how the self concept and self esteem develop through social processes, the role of social comparison and self discrepancy, self presentation, and cultural differences in the self.",
    plan: ["Self concept and self esteem defined", "Social sources: reflected appraisals, social comparison, self perception", "Self discrepancy theory", "Self presentation, self monitoring and self handicapping", "Culture: independent and interdependent selves, the Indian self", "Conclusion"],
    answer: `## Self concept and self esteem
The self concept is the set of beliefs a person holds about who they are: traits, roles, values and relationships. William James separated the "I", the self as knower, from the "me", the self as known. Hazel Markus called the organised beliefs about oneself in particular areas self schemas; a person with a self schema for independence processes information about independence quickly and remembers it well. Self esteem is the evaluative part: how positively a person regards themselves, commonly measured with Morris Rosenberg's ten item scale.

## Social sources of the self
- Reflected appraisals: Charles Cooley's looking glass self says we come to see ourselves as we think others see us. George Herbert Mead added that we internalise the attitudes of the generalised other.
- Social comparison: Leon Festinger proposed in 1954 that when objective standards are lacking, people evaluate their abilities and opinions by comparing themselves with similar others. Upward comparison with those better off can inspire but also lower self esteem; downward comparison with those worse off comforts. Social media invites constant upward comparison, which is linked to lower well being in some studies.
- Self perception: Daryl Bem argued that we infer our attitudes and traits from our own behaviour, much as an observer would.
- Roles and group memberships: social identity theory adds that part of the self comes from the groups we belong to, such as family, caste, religion, profession and nation.

## Self discrepancy theory
Tory Higgins distinguished the actual self (how I am), the ideal self (how I would like to be) and the ought self (how I feel I should be, often from parents' and society's expectations). A gap between actual and ideal produces dejection related emotions such as sadness and disappointment; a gap between actual and ought produces agitation related emotions such as anxiety and guilt. A student who wants to be a writer but feels she ought to become a doctor may experience both.

## Self presentation
Erving Goffman described social life as a performance in which people manage the impressions they give. Strategies include ingratiation, self promotion, exemplification and supplication.
- Self monitoring: Mark Snyder showed that high self monitors adjust their behaviour to fit each situation, while low self monitors act more consistently with their inner attitudes.
- Self handicapping: people create obstacles to their own success so that failure can be blamed on the obstacle and success looks even better. In Steven Berglas and Edward Jones's study, students who had succeeded on unsolvable problems, and so felt unsure of repeating the success, more often chose a drug they were told would impair performance. Not studying before an examination is an everyday example.
- Self enhancement: most people see themselves as above average on desirable traits.

## Culture and the self
Hazel Markus and Shinobu Kitayama contrasted the independent self, typical of North America and Western Europe, defined by unique inner attributes and personal goals, with the interdependent self, typical of East and South Asia, defined by relationships, roles and fitting in. Interdependent selves show less self enhancement and more self criticism aimed at improvement, and their self esteem depends more on meeting obligations.
In India, Alan Roland described a familial self, closely tied to family hierarchy and reputation, alongside a private spiritual self. Indian research by Durganand Sinha and others suggests that individualist and collectivist orientations coexist and are used in different situations. Philosophical traditions add the idea of a deeper self, the atman, beyond the social roles of the ego.

## Clinical relevance
Low self esteem and self discrepancies are linked to depression and anxiety; negative self schemas are targeted in cognitive therapy; and social comparison is central in eating disorders.

## Conclusion
The self is built socially, through how others see us, whom we compare ourselves with and which groups we belong to. It is motivated, presented strategically and strongly shaped by culture, so that an Indian self is often more relational than the self assumed in Western theories.`,
    keyPoints: ["Self concept, self schema and self esteem defined", "Looking glass self and reflected appraisals", "Festinger's social comparison with upward and downward comparison", "Higgins's self discrepancy with emotional outcomes", "Goffman, self monitoring and self handicapping with Berglas and Jones", "Independent and interdependent selves", "Indian familial self and coexistence of orientations"],
    pitfalls: ["Confusing ideal and ought selves", "No cultural discussion", "Treating self esteem as the whole self concept"],
    module: "social/1-2",
    visuals: [
      tree("Self discrepancy theory", [
        ["Actual self", "How I see myself now", -1],
        ["Gap from ideal self", "How I wish to be: sadness, disappointment", 0],
        ["Gap from ought self", "How I should be: anxiety, guilt", 0],
      ], "Self discrepancy theory: two gaps, two kinds of emotion"),
      compare(
        "Culture and the self",
        ["Independent self", ["Defined by inner traits", "Personal goals and uniqueness", "Strong self enhancement"], "I am honest and creative"],
        ["Interdependent self", ["Defined by roles and relationships", "Fitting in and duties", "Self criticism for improvement"], "I am a daughter, a student, a member of my family"],
      ),
    ],
    ref: "James 1890; Markus 1977 self schemas; Rosenberg 1965; Cooley 1902; Festinger 1954; Bem 1972; Higgins 1987; Goffman 1959; Snyder 1974; Berglas and Jones 1978; Markus and Kitayama 1991; Roland 1988 In Search of Self in India and Japan; Sinha and Tripathi 1994",
  },
  {
    id: "soc-l01-009",
    subject: S,
    topic: "attitudes",
    marks: 10,
    difficulty: 1,
    exams: ["cuet-pg", "ma-semester", "ugc-net"],
    question: "Define attitude. Describe the components and functions of attitudes and explain how attitudes are formed.",
    plan: ["Definition", "Three components", "Katz's four functions", "Formation: conditioning, exposure, observation, experience and genes", "Attitude strength"],
    answer: `## Definition
An attitude is a learnt, relatively enduring evaluation of a person, group, object or idea, expressed as a degree of favour or disfavour. Gordon Allport called it the most indispensable concept in social psychology. Attitudes have an object, a direction (positive or negative) and an intensity.

## Three components
The tripartite or ABC model describes three components:
- Affective: feelings about the object, such as "I feel uneasy around people with mental illness".
- Behavioural: tendencies to act, such as avoiding sitting next to them.
- Cognitive: beliefs, such as "they are unpredictable".
The components usually agree but can conflict, as when a person believes that exercise is good but dislikes it.

## Functions
Daniel Katz proposed that attitudes serve four functions:
1. Utilitarian or adjustive: helping us gain rewards and avoid punishments, such as a positive attitude towards a party that supports one's business.
2. Knowledge: organising the world and making it predictable.
3. Value expressive: expressing central values and identity, such as vegetarianism expressing religious values.
4. Ego defensive: protecting self esteem from threats, as when prejudice lets a person feel superior.
Knowing the function helps change an attitude: an ego defensive attitude will not yield to facts alone.

## How attitudes are formed
- Classical conditioning: Arthur and Carolyn Staats paired national names with positive or negative words, and participants came to rate the names accordingly. Advertisements pair products with attractive people and music.
- Mere exposure: Robert Zajonc showed that repeated exposure to a neutral stimulus increases liking.
- Operant conditioning: being praised for expressing views strengthens them.
- Observational learning: children absorb parents' and peers' attitudes, for example towards other castes or communities.
- Direct experience: attitudes formed from personal experience are stronger and predict behaviour better.
- Genetic influences: twin studies suggest modest heritability for some attitudes, possibly through temperament.
- Media and culture: films, news and social media shape attitudes to groups and issues.

## Attitude strength
Strong attitudes are important to the person, held with certainty, quickly accessible and linked to identity. They are stable, resist change and predict behaviour.

## Conclusion
Attitudes are learnt evaluations with feeling, belief and action components, serving needs of reward, knowledge, identity and self protection. Understanding their components and functions guides health campaigns and anti stigma programmes in India.`,
    keyPoints: ["Definition with object, direction and intensity", "Affective, behavioural and cognitive components with example", "Katz's four functions", "Classical conditioning with Staats and Staats", "Mere exposure and observational learning", "Direct experience and genes", "Attitude strength"],
    pitfalls: ["Listing functions without examples", "Leaving out how attitudes form"],
    module: "social/1-4",
    visuals: [
      tree("Three components", [
        ["Attitude to mental illness", "A learnt evaluation", -1],
        ["Affective", "I feel uneasy around them", 0],
        ["Behavioural", "I avoid sitting next to them", 0],
        ["Cognitive", "They are unpredictable", 0],
      ], "Three components of one attitude"),
    ],
    ref: "Allport 1935; Eagly and Chaiken 1993; Katz 1960 functional approach; Staats and Staats 1958; Zajonc 1968; Tesser 1993 heritability; social module 1.4",
  },
  {
    id: "soc-l01-010",
    subject: S,
    topic: "attitudes",
    marks: 20,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Describe and evaluate the major methods of measuring attitudes, including the Thurstone, Likert, Guttman, social distance and semantic differential scales, and indirect and implicit measures.",
    plan: ["Why measurement is difficult", "Thurstone and Likert scales: construction, scoring, merits", "Guttman and Bogardus scales", "Semantic differential", "Indirect, physiological and implicit measures", "Evaluation and Indian use"],
    answer: `## Why measuring attitudes is difficult
Attitudes cannot be observed directly; they are inferred from what people say and do. Self reports are affected by social desirability, acquiescence and lack of insight. Researchers therefore developed carefully constructed scales and, later, indirect measures.

## Thurstone's method of equal appearing intervals
Louis Thurstone published the first systematic attitude scale in 1928.
1. Write a large pool of statements, about 100, ranging from very unfavourable to very favourable towards the object.
2. A panel of judges sorts each statement into 11 piles from most unfavourable to most favourable.
3. The scale value of each statement is the median of the judges' ratings; statements on which judges disagree widely, measured by the interquartile range, are discarded.
4. About 20 statements with scale values spread evenly across the range are kept.
5. Respondents tick the statements they agree with; their score is the median or mean scale value of the ticked statements.
Merits: it aims at interval level measurement. Limits: it is laborious, depends on judges whose own attitudes may bias their sorting, and two people with the same score may have agreed with different statements.

## Likert's method of summated ratings
Rensis Likert introduced a simpler method in 1932.
1. Write statements clearly favourable or unfavourable.
2. Respondents rate each on a five point scale from strongly agree to strongly disagree.
3. Unfavourable items are reverse scored, and scores are summed.
4. Item analysis keeps items that correlate well with the total score or discriminate between high and low scorers.
Merits: easy to construct, high reliability, and gives intensity as well as direction. Limits: it is strictly ordinal, the neutral point is ambiguous, and acquiescence bias is possible. It is the most widely used method today, including in most Indian attitude research.

## Guttman's scalogram
Louis Guttman built cumulative scales in which items form a hierarchy, so that agreeing with a stronger item implies agreeing with all weaker ones. A respondent's score therefore tells exactly which items they endorsed. A coefficient of reproducibility of about 0.90 or more shows that the scale is unidimensional. Guttman scales are elegant but hard to achieve for complex attitudes.

## Bogardus social distance scale
Emory Bogardus asked people how close a relationship they would accept with members of various groups, from marriage into the family, through close friend, neighbour, co worker and citizen, to visitor only and exclusion from the country. It is cumulative, like a Guttman scale, and has been used widely in India to study caste, religious and regional distance; inter caste marriage consistently remains the most resisted level.

## Osgood's semantic differential
Charles Osgood had respondents rate an object on seven point scales between bipolar adjectives, such as good and bad, strong and weak, active and passive. Factor analysis showed three dimensions of meaning: evaluation, potency and activity. Attitude is measured mainly by the evaluation dimension. The method is quick, flexible and usable across cultures, but the adjective pairs must be relevant to the object.

## Indirect and implicit measures
- Bogus pipeline: Edward Jones and Harold Sigall convinced participants that a machine could detect their true attitudes; they then reported more socially undesirable attitudes, showing how self reports are edited.
- Unobtrusive behavioural measures: Stanley Milgram's lost letter technique dropped addressed, stamped letters in public places and measured how many were posted, depending on whether the addressee was a liked or disliked organisation.
- Physiological measures: skin conductance shows arousal but not direction; facial electromyography of smiling and frowning muscles can show direction.
- Implicit Association Test: Anthony Greenwald and colleagues measured how quickly people pair concepts, such as faces of two groups, with good and bad words. Faster pairing of one group with bad words suggests an implicit negative association. Test retest reliability is modest, about 0.5, and prediction of discriminatory behaviour is weak, so it is better suited to group research than to judging individuals.
- Evaluative priming: a brief image of a group member speeds or slows classification of positive and negative words.

## Evaluation
| Method | Strength | Weakness |
| Thurstone | Near interval scores | Laborious, judge bias |
| Likert | Simple, reliable | Ordinal, acquiescence |
| Guttman | Cumulative and unidimensional | Rarely achieved |
| Bogardus | Behavioural closeness | Narrow, cumulative only |
| Semantic differential | Fast, cross cultural | Choice of adjectives |
| Implicit | Less faking | Modest reliability and validity |
No single method is best. Combining explicit scales with behavioural or implicit measures gives a fuller picture, and scales must be adapted and validated in Indian languages before use.

## Conclusion
Attitude measurement developed from laborious judge based scales to simple summated ratings and then to indirect and implicit techniques that reduce faking. Each has strengths and limitations, and choice depends on the research question and context.`,
    keyPoints: ["Why attitudes are hard to measure", "Thurstone steps with 11 piles and median scale values", "Likert steps with reverse scoring and item analysis", "Guttman cumulative scaling and reproducibility", "Bogardus social distance with Indian use", "Semantic differential with evaluation, potency and activity", "Bogus pipeline, lost letter, physiological and IAT measures with IAT limits", "Comparative evaluation"],
    pitfalls: ["Confusing Thurstone with Likert scoring", "Leaving out implicit measures", "Overstating the IAT's ability to diagnose individuals"],
    module: "social/1-4",
    visuals: [
      chain("Thurstone's method of equal appearing intervals", [["About 100 statements", "From very unfavourable to very favourable"], ["Judges sort", "Into 11 piles"], ["Scale values", "Median of judges; drop high disagreement items"], ["About 20 items kept", "Spread evenly across the range"], ["Respondent ticks agreement", "Score is the median of ticked values"]]),
      layers("Bogardus social distance scale", "stack", [
        ["Close kinship by marriage", "Closest: the most resisted level in Indian caste research"],
        ["Close friend", "Personal intimacy"],
        ["Neighbour", "Living on the same street"],
        ["Co worker", "Working in the same occupation"],
        ["Citizen", "Accepted as a citizen of the country"],
        ["Visitor only", "Allowed only to visit"],
        ["Exclusion", "Would exclude from the country"],
      ]),
    ],
    ref: "Thurstone 1928; Likert 1932; Guttman 1944; Bogardus 1925; Osgood, Suci and Tannenbaum 1957; Jones and Sigall 1971; Milgram, Mann and Harter 1965 lost letter; Greenwald, McGhee and Schwartz 1998; Oswald et al 2013 IAT meta-analysis; social module 1.4",
  },
]);
