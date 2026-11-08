import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, layers, tree, vis } from "./visual";

const S = "social" as const;

export const SOCIAL_L02: LongQA[] = anchored([
  {
    id: "soc-l02-011",
    subject: S,
    topic: "attitudes",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Do attitudes predict behaviour? Discuss the evidence from LaPiere onwards, the conditions under which attitudes predict behaviour, and the theories of reasoned action and planned behaviour.",
    plan: ["LaPiere's study and Wicker's review", "Principle of compatibility with the contraception study", "Moderators: strength, accessibility, experience, self monitoring", "Fazio's MODE model", "Theory of reasoned action and planned behaviour with evidence", "Limits and Indian applications"],
    answer: `## The early challenge
In the early 1930s, Richard LaPiere travelled across the United States with a young Chinese couple at a time of strong anti Chinese prejudice. They were refused service at only one of 251 hotels and restaurants. When he later wrote to the same places asking whether they would accept Chinese guests, about nine in ten of those that replied said no. Critics noted that different staff may have answered the letters and that the couple's presence changed the situation, but the study opened a long debate. In 1969 Allan Wicker reviewed many studies and concluded that attitudes rarely correlated with behaviour above about 0.30, and often near 0.15, leading some to doubt the usefulness of the concept.

## The principle of compatibility
Icek Ajzen and Martin Fishbein argued that the weak correlations were partly a measurement problem. Attitudes predict behaviour when both are measured at the same level of specificity in target, action, context and time. In a study of women's use of the contraceptive pill, a general attitude towards birth control barely predicted pill use over the next two years, an attitude towards the pill predicted it moderately, and an attitude towards using the pill during the next two years predicted it strongly. General attitudes predict general patterns of behaviour aggregated over many acts.

## When attitudes predict behaviour
- Strong attitudes: those held with certainty, important to the person and linked to identity or vested interest.
- Accessible attitudes: those that come to mind quickly; reminding people of their attitude before they act increases consistency.
- Direct experience: students who had personally suffered a housing shortage acted more in line with their attitudes than those who had only heard about it.
- Low self monitoring: people who act on inner states rather than adjusting to situations show more consistency.
- Weak situational pressure: strong norms, as in LaPiere's face to face encounters, can override attitudes.
- Self awareness: being made self aware, for example in front of a mirror, increases consistency.

## The MODE model
Russell Fazio's motivation and opportunity as determinants model holds that behaviour follows attitudes in two ways. When motivation and opportunity to think are low, accessible attitudes guide behaviour automatically through their effect on perception. When both are high, people deliberate, and the theory of planned behaviour applies.

## Reasoned action and planned behaviour
Fishbein and Ajzen's theory of reasoned action proposed that the best predictor of behaviour is intention, which depends on:
1. Attitude towards the behaviour, from beliefs about its consequences and their value.
2. Subjective norms, from beliefs about what important others want and motivation to comply.
Ajzen's theory of planned behaviour added:
3. Perceived behavioural control, the belief that one can carry out the behaviour, which affects intention and can predict behaviour directly.
Meta analyses find that the model explains a substantial part of intention and a smaller but useful part of behaviour, with perceived control adding to prediction. It is widely used in health psychology.

## Limits
- The intention behaviour gap: many people intend to exercise or take medicines but do not. Implementation intentions, "if it is 7 am, I will walk to the park", help close it.
- Habit predicts frequent behaviours better than intention.
- Emotions, impulsive behaviour and addiction are poorly captured.
- Most studies rely on self reported behaviour.

## Indian applications
Under the Swachh Bharat Mission, many households with new toilets continued open defecation; studies of rural North India suggested that beliefs about purity and social norms, not just attitudes or access, were key, which fits the subjective norms component. Campaigns for institutional delivery, vaccination and tobacco quitting similarly target norms and perceived control, for example by providing transport, quitlines and community health workers.

## Conclusion
Attitudes do predict behaviour, but only when they are strong, accessible and measured compatibly, and when situations allow them to operate. The theory of planned behaviour gives a practical framework that combines attitudes with norms and perceived control.`,
    keyPoints: ["LaPiere's study with figures and critique", "Wicker's pessimistic review", "Principle of compatibility with the contraceptive example", "Moderators: strength, accessibility, direct experience, self monitoring, situation", "Fazio's MODE model", "TRA and TPB components with perceived control", "Intention behaviour gap and habit", "Indian application such as Swachh Bharat"],
    pitfalls: ["Concluding that attitudes do not predict behaviour", "Leaving out perceived behavioural control", "No moderators"],
    module: "social/1-4",
    visuals: [
      chain("Reasoned action and planned behaviour", [["Attitude to the behaviour", "Good or bad for me?"], ["Subjective norms", "What do important others want?"], ["Perceived control", "Can I do it?"], ["Intention", "I will get vaccinated this week"], ["Behaviour", "Control can also act directly"]], "Reasoned action and planned behaviour: Ajzen's model"),
    ],
    ref: "LaPiere 1934; Wicker 1969; Ajzen and Fishbein 1977 compatibility; Davidson and Jaccard 1979 contraception; Regan and Fazio 1977; Fazio 1990 MODE; Ajzen 1991; Armitage and Conner 2001 meta-analysis; Gollwitzer 1999; Coffey and Spears rural sanitation research; social module 1.4",
  },
  {
    id: "soc-l02-012",
    subject: S,
    topic: "cognitive-dissonance",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Critically evaluate Festinger's theory of cognitive dissonance. Describe the main experimental paradigms, the conditions that produce dissonance, rival explanations and applications.",
    plan: ["Theory and ways of reducing dissonance", "Insufficient justification: Festinger and Carlsmith", "Effort justification, free choice and hypocrisy paradigms", "Conditions and the arousal evidence", "Rivals: self perception, impression management, self affirmation, new look", "Culture, applications and evaluation"],
    answer: `## The theory
Leon Festinger proposed in 1957 that people strive for consistency among their cognitions, which include beliefs, attitudes and knowledge of their own behaviour. When two cognitions are inconsistent, people experience cognitive dissonance, an unpleasant state of tension that motivates them to reduce it. The magnitude depends on the importance of the cognitions and the ratio of dissonant to consonant ones. Dissonance can be reduced by:
- Changing behaviour: a smoker quits.
- Changing a cognition: "the evidence about smoking is exaggerated".
- Adding consonant cognitions: "smoking keeps my weight down".
- Reducing importance: "we all die of something".

## Insufficient justification
Leon Festinger and James Carlsmith had students perform a very boring task, turning pegs and filling spools for an hour. They were then paid either 1 dollar or 20 dollars to tell the next participant, a confederate, that the task was interesting. Controls told no lie. Later, the 1 dollar group rated the task as more enjoyable than both the 20 dollar group and the controls. Twenty dollars was sufficient justification for lying, so no attitude change was needed; one dollar was not, so participants reduced dissonance by deciding that the task was not so bad. Rewards and threats that are just barely sufficient produce the most internal change; children told not to play with a toy under a mild threat later valued it less than those given a severe threat.

## Other paradigms
- Effort justification: Elliot Aronson and Judson Mills had women undergo a severe or mild embarrassing initiation to join a discussion group, then hear a dull discussion. Those with the severe initiation rated the group as more interesting. We value what we suffer for, which may explain loyalty after harsh hostel ragging or tough professional training.
- Free choice or post decision dissonance: Jack Brehm had women rate household appliances, choose between two equally rated ones and rate them again. The chosen item rose and the rejected one fell, a spreading of alternatives.
- Belief disconfirmation: Festinger and colleagues joined a group expecting the world to end on a set date; when the prophecy failed, committed members proselytised more.
- Hypocrisy induction: Elliot Aronson and colleagues had students make a public speech promoting condom use and then recall times they had not used condoms. These students later bought more condoms, because the hypocrisy was dissonant.

## Conditions and evidence for arousal
Later research showed that dissonance is strongest when:
- the behaviour is freely chosen,
- the person feels committed and responsible,
- the behaviour has foreseeable negative consequences, and
- it threatens the self concept.
Dissonance involves real arousal. Mark Zanna and Joel Cooper gave participants a placebo pill described as making them tense, relaxed or having no effect, and then had them write a counter attitudinal essay. Those who could blame their tension on the pill showed no attitude change, while those told it would relax them showed even more change. Physiological studies also find increased arousal.

## Rival explanations
- Self perception theory: Daryl Bem argued that no tension is needed. People infer their attitudes from their behaviour as an observer would: "I said it was fun for only a dollar, so I must have liked it." Observers given descriptions of the study predicted the participants' attitudes. Later work suggests self perception explains change when attitudes are weak or vague, and dissonance when behaviour clearly contradicts strong attitudes and arousal is present.
- Impression management: participants may report consistent attitudes to look consistent to the experimenter; but effects also appear with private measures.
- Self affirmation: Claude Steele showed that affirming an important value, such as writing about one's family, reduces dissonance effects, suggesting the threat is to self integrity rather than to consistency as such.
- The new look: Joel Cooper and Russell Fazio argued that dissonance arises from feeling responsible for aversive consequences, not from inconsistency itself.
- The action based model: Eddie Harmon Jones proposed that dissonance helps people act effectively by removing conflict that would block action.

## Culture
Post decision spreading of alternatives is weaker in some East Asian samples when choices are made privately, but appears strongly when people choose for friends or think about others' views. Dissonance in interdependent cultures may centre on social rather than personal consistency, a point relevant to Indian family decisions.

## Applications
- Health: hypocrisy induction for safe sex, water saving and helmet use.
- Therapy: clients who invest effort in therapy value it more; motivational interviewing develops discrepancy between behaviour and values.
- Eating disorder prevention: the Body Project has girls argue against the thin ideal, and it reduces body dissatisfaction.
- Prejudice reduction and the jigsaw classroom draw on related ideas.
- Everyday life: buyers praising expensive purchases, voters defending a chosen leader, smokers' rationalisations.

## Evaluation
Strengths: a simple, general theory with surprising predictions supported across many paradigms and decades, and broad applications. Weaknesses: the original theory was vague about what counts as inconsistency and how much dissonance a situation causes; competing explanations account for some findings; and some effects depend on culture. Recent replications of the induced compliance effect have been weaker than the classic results, so effect sizes may be smaller than once believed.

## Conclusion
Dissonance theory shows that behaviour can change attitudes, especially when people feel responsible for freely chosen acts with no adequate external justification. Its mechanisms are debated, but its applications in health and therapy remain valuable.`,
    keyPoints: ["Definition and four ways of reduction", "Festinger and Carlsmith with the 1 and 20 dollar result", "Effort justification, free choice, disconfirmation and hypocrisy paradigms", "Conditions: choice, commitment, consequences, self threat", "Misattribution pill study showing arousal", "Bem's self perception and its reconciliation", "Self affirmation and new look revisions", "Culture, applications and evaluation"],
    pitfalls: ["Saying the 20 dollar group changed more", "No rival explanations", "Describing only one paradigm"],
    module: "social/2-1",
    visuals: [
      { kind: "dissonance", data: { belief: "I am an honest student, and marks should reflect real learning.", behaviour: "I copied two answers from a friend in the internal test.", caption: "Raise the tension, then pick a way to reduce it." }, caption: "The theory: feel dissonance, then reduce it" },
      compare(
        "Rival explanations: dissonance or self perception?",
        ["Cognitive dissonance", ["Two clashing cognitions create tension", "Arousal is present and needed", "Attitude changes to reduce tension", "Fits strong attitudes and clear inconsistency"], "Motivated change"],
        ["Self perception", ["No tension needed", "I infer my attitude from my act", "Observers predict the same result", "Fits weak or vague attitudes"], "Cool inference"],
      ),
    ],
    ref: "Festinger 1957; Festinger and Carlsmith 1959; Aronson and Carlsmith 1963 forbidden toy; Aronson and Mills 1959; Brehm 1956; Festinger, Riecken and Schachter 1956; Stone, Aronson et al 1994 hypocrisy; Zanna and Cooper 1974; Bem 1967; Steele 1988; Cooper and Fazio 1984; Harmon-Jones action based model; Kitayama et al 2004 culture; Stice Body Project; Vaidis et al 2024 multi-lab replication",
  },
  {
    id: "soc-l02-013",
    subject: S,
    topic: "attitudes",
    marks: 5,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Write a short note on the Implicit Association Test.",
    plan: ["Purpose and origin", "Procedure and scoring", "Findings", "Reliability and validity criticisms"],
    answer: `## Purpose
The Implicit Association Test, introduced by Anthony Greenwald, Debbie McGhee and Jordan Schwartz in 1998, measures the strength of automatic associations between concepts, such as social groups, and attributes, such as good and bad. It was designed to capture attitudes people may be unwilling or unable to report, avoiding social desirability bias.

## Procedure
Words or pictures appear one at a time in the centre of a screen, and the person sorts them as fast as possible using two keys.
1. Practice sorting the target concepts, for example faces of group A and group B.
2. Practice sorting attributes, such as pleasant and unpleasant words.
3. Combined block: group A and pleasant share one key, group B and unpleasant the other.
4. The target keys are switched and practised.
5. Reversed combined block: group B and pleasant share a key.
If a person is faster when group A shares a key with pleasant words than when group B does, this is taken as a stronger implicit preference for group A. The difference in average reaction times is converted into a D score.

## Findings
Millions of people have taken versions online. Many show implicit preferences for their own group and for socially advantaged groups, sometimes even when their explicit attitudes are egalitarian, and implicit and explicit measures correlate only modestly.

## Criticisms
- Test retest reliability is modest, around 0.5, below what is needed to judge an individual.
- Meta analyses find that it predicts discriminatory behaviour only weakly, roughly as well as explicit measures.
- A 2019 analysis pooling 492 studies found that procedures that changed implicit scores produced little change in behaviour.
- Scores may reflect familiarity with cultural stereotypes rather than personal attitudes.
It is therefore useful for research on groups and for raising awareness, but it should not be used to label or select individuals.`,
    keyPoints: ["Greenwald and colleagues, 1998", "Measures automatic associations, avoids self report bias", "Five block procedure with switched pairings", "Reaction time difference and D score", "Findings of ingroup and advantaged group preference", "Reliability of about 0.5 and weak behavioural prediction", "Not for individual diagnosis"],
    pitfalls: ["Calling it a measure of hidden racism in individuals", "Leaving out the procedure"],
    module: "social/1-4",
    visuals: [
      chain("Procedure: the IAT blocks", [["Sort targets", "Group A or group B"], ["Sort attributes", "Pleasant or unpleasant"], ["Combined block", "A with pleasant, B with unpleasant"], ["Switch targets", "Practise the new sides"], ["Reversed block", "B with pleasant, A with unpleasant"], ["Compare speed", "Faster pairing shows a stronger association"]]),
    ],
    ref: "Greenwald, McGhee and Schwartz 1998; Greenwald et al 2009 and Oswald et al 2013 predictive validity meta-analyses; Forscher et al 2019 meta-analysis of 492 studies; social module 1.4",
  },
  {
    id: "soc-l02-014",
    subject: S,
    topic: "persuasion",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net", "mcp-entrance"],
    question: "Describe the Yale approach to persuasion. Explain how characteristics of the communicator, the message and the audience influence attitude change, and discuss the sleeper effect.",
    plan: ["Hovland's programme: who says what to whom", "Communicator: credibility, attractiveness, similarity", "Message: sidedness, order, discrepancy, fear, repetition", "Audience: involvement, age, mood, forewarning, distraction", "Sleeper effect", "Evaluation and McGuire's chain"],
    answer: `## The Yale programme
During and after the Second World War, Carl Hovland and his colleagues at Yale University studied persuasion systematically. Their framework asked who says what to whom, by what means and with what effect. They treated persuasion as learning: a message changes attitudes if it is attended to, understood, accepted and remembered.

## The communicator
- Credibility: a source perceived as expert and trustworthy persuades more. Hovland and Walter Weiss gave students the same article on nuclear powered submarines attributed either to the physicist J. Robert Oppenheimer or to the Soviet newspaper Pravda; the Oppenheimer version produced more immediate attitude change.
- Trustworthiness rises when the source does not seem to be trying to persuade, or argues against their own interest. A convicted criminal arguing for stronger police powers was more persuasive than one arguing for weaker powers.
- Attractiveness and likeability: attractive and liked sources persuade, especially on matters of taste.
- Similarity: people are persuaded by those like themselves on matters of personal preference, and by experts on matters of fact.
- In India, the polio eradication campaign used the film star Amitabh Bachchan as its face, combining likeability and trust.

## The message
- One sided versus two sided: in army studies, a one sided message worked better for those who already agreed and were less educated, while a two sided message, acknowledging and refuting the other side, worked better for those initially opposed and more educated, and it gave more resistance to later counter arguments.
- Order: when two messages are heard one after the other and judgement is made later, the first has an advantage, the primacy effect; when there is a delay between the messages and judgement follows immediately, the second wins, the recency effect.
- Discrepancy: a moderately discrepant message produces most change; a highly credible source can afford a larger discrepancy.
- Fear: moderate fear combined with a clear, doable recommendation works best.
- Repetition: repeated exposure increases liking up to a point, after which boredom and resistance set in.
- Drawing conclusions explicitly helps less intelligent or less involved audiences.

## The audience
- Involvement and prior knowledge reduce the impact of weak arguments.
- Age: the impressionable years hypothesis holds that attitudes are most open to change in late adolescence and early adulthood.
- Mood: a good mood makes people more receptive and less critical.
- Forewarning that someone will try to persuade them increases resistance, especially on important issues.
- Distraction: mild distraction can increase persuasion by preventing counter arguing.
- Self esteem and intelligence: William McGuire proposed that moderate levels are most persuadable, because low levels reduce comprehension and high levels reduce yielding.

## The sleeper effect
Hovland and Weiss found that, three to four weeks later, the low credibility source's message had gained in persuasiveness and the high credibility message had lost, so the two converged. A message from a low credibility source can become more persuasive over time because people remember the message but forget or dissociate the discounting cue, the source. Later research shows the effect appears reliably only when the message is strong, the discounting cue comes after the message, and people process the message carefully. It helps explain why forwarded rumours on social media gain belief long after their dubious source is forgotten.

## Evaluation
Strengths: the programme produced many reliable findings, introduced experimental rigour and is still used in campaign design. Weaknesses: it produced a list of variables rather than a theory, and findings often conflicted, for example on whether fear or distraction helps. McGuire organised the process into a chain of steps, attention, comprehension, yielding, retention and action, and the elaboration likelihood model later explained when each variable matters by asking how much the audience is thinking.

## Conclusion
The Yale approach showed that persuasion depends on the communicator, the message and the audience, and that effects can change over time. Its findings remain practical guides for health communication in India.`,
    keyPoints: ["Who says what to whom framework and learning view", "Credibility with the Oppenheimer and Pravda study", "Trustworthiness from arguing against one's interest", "One sided versus two sided messages", "Primacy and recency conditions", "Audience factors: age, mood, forewarning, distraction", "Sleeper effect with its conditions", "Evaluation leading to McGuire and the ELM"],
    pitfalls: ["Defining the sleeper effect as delayed persuasion by any source", "Listing factors with no evidence", "No evaluation"],
    module: "social/2-1",
    visuals: [
      compare(
        "The sleeper effect",
        ["Just after hearing it", ["Message: this herbal tea cures diabetes", "Source: an anonymous forward", "You remember the dubious source", "Little persuasion"], "The source acts as a discounting cue"],
        ["A month later", ["You remember the claim", "You forget where it came from", "The discounting cue is gone", "The claim feels more believable"], "The message outlives its source"],
      ),
      tree("The communicator, the message and the audience", [
        ["Persuasion", "Who says what to whom", -1],
        ["Communicator", "Expertise, trustworthiness, attractiveness, similarity", 0],
        ["Message", "Sidedness, order, discrepancy, fear, repetition", 0],
        ["Audience", "Involvement, age, mood, forewarning, distraction", 0],
      ], "The communicator: the three parts of the Yale approach"),
    ],
    ref: "Hovland, Janis and Kelley 1953; Hovland and Weiss 1951; Walster, Aronson and Abrahams 1966; Hovland, Lumsdaine and Sheffield 1949; Miller and Campbell 1959; McGuire 1968 and 1985; Festinger and Maccoby 1964; Kumkale and Albarracin 2004 sleeper meta-analysis; Krosnick and Alwin 1989; social module 2.1",
  },
  {
    id: "soc-l02-015",
    subject: S,
    topic: "persuasion",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Explain the elaboration likelihood model of persuasion. Describe the evidence for central and peripheral routes, the multiple roles a variable can play, and compare it with the heuristic systematic model.",
    plan: ["Core idea: elaboration as a continuum", "Motivation and ability", "Central and peripheral routes with consequences", "Petty, Cacioppo and Goldman's experiment", "Multiple roles of variables and HSM comparison", "Applications and criticisms"],
    answer: `## Core idea
Richard Petty and John Cacioppo proposed the elaboration likelihood model to explain why the same variables sometimes increase and sometimes decrease persuasion. Elaboration is the extent to which a person thinks about the issue relevant arguments in a message. It varies on a continuum from low to high, and the amount of elaboration determines how persuasion works.

## Motivation and ability
Elaboration is high when people are both motivated and able to think.
- Motivation: personal relevance of the issue, personal responsibility, and need for cognition, a stable tendency to enjoy effortful thinking.
- Ability: time, freedom from distraction, prior knowledge, a clear message and not being fatigued.

## Two routes
- Central route: when elaboration is high, people scrutinise the arguments. Strong arguments produce favourable thoughts and persuasion; weak arguments produce counter arguments and may backfire. Attitudes formed this way are persistent, resist counter persuasion and predict behaviour.
- Peripheral route: when elaboration is low, people rely on cues that require little thought, such as the source's attractiveness or expertise, the number of arguments, mood, music or a celebrity endorsement. Change is weaker, shorter lived and less predictive of behaviour.

## The key experiment
Petty, Cacioppo and Rachel Goldman told university students that their university was considering a comprehensive examination that seniors would have to pass to graduate. Some heard it would start next year, so it would affect them; others heard it would start in ten years. Messages had strong or weak arguments and came from either a Princeton professor of education or a high school student.
- For highly involved students, argument strength determined persuasion, whatever the source.
- For low involvement students, source expertise mattered more than argument strength.
This crossover pattern is the signature of the two routes.

## Multiple roles of variables
A single variable can play different roles depending on elaboration:
- Under low elaboration, it acts as a peripheral cue: an attractive model makes a shampoo seem good.
- Under high elaboration, it can be an argument: for a beauty product, the model's shining hair is evidence.
- Under moderate elaboration, it can change the amount of thinking: a surprising expert source makes people read more carefully.
- It can bias the direction of thinking: a good mood makes thoughts more positive.
- It can affect confidence in one's own thoughts, called self validation.

## Comparison with the heuristic systematic model
| Issue | Elaboration likelihood model | Heuristic systematic model |
| Authors | Petty and Cacioppo | Shelly Chaiken |
| Two modes | Central and peripheral routes | Systematic and heuristic processing |
| Low effort processing | Many kinds of peripheral cue | Simple rules such as experts are right |
| Co occurrence | Trade off along a continuum | Both can run at once |
| Sufficiency | Not emphasised | People process until confident enough |
Both models agree that motivation and ability decide how much people think, and that thoughtful change lasts longer.

## Applications
- Health campaigns: for involved audiences, such as parents deciding about vaccines, provide strong evidence and time to discuss with a doctor; for uninvolved audiences, use credible, likeable sources and simple cues, then build involvement.
- Advertising often relies on celebrities, jingles and repetition, peripheral cues for low involvement products.
- Clinical communication: explaining medication with clear reasons to an engaged patient produces more lasting adherence.

## Criticisms
- Strong and weak arguments are defined by pilot testing, not independently, which makes argument quality partly circular.
- The model is descriptive about when routes operate but not always predictive about which variable will play which role.
- Some argue a single process model, in which cues and arguments are both just evidence, explains the data equally well.

## Conclusion
The ELM shows that persuasion depends on how much people think. When motivation and ability are high, arguments matter and change lasts; when they are low, cues matter and change is fragile.`,
    keyPoints: ["Elaboration defined as a continuum", "Motivation and ability factors including need for cognition", "Central and peripheral routes with consequences for persistence", "Petty, Cacioppo and Goldman design and crossover result", "Multiple roles of a variable", "Comparison table with the HSM", "Applications and criticisms such as circular argument quality"],
    pitfalls: ["Saying the central route always produces more change", "No experimental evidence", "Treating the two routes as rigid categories rather than a continuum"],
    module: "social/2-1",
    visuals: [
      tree("Two routes of the elaboration likelihood model", [
        ["A persuasive message", "Arrives", -1],
        ["Motivated and able?", "Relevance, need for cognition, time, knowledge", 0],
        ["Yes: central route", "Arguments judged; strong persuade, weak backfire; lasting change", 1],
        ["No: peripheral route", "Cues such as source, number of arguments, mood; fragile change", 1],
      ], "Two routes: how the ELM decides"),
      vis("sort", {
        prompt: "Central or peripheral route? Decide which route is mostly at work.",
        buckets: ["Central route", "Peripheral route"],
        items: [
          { text: "A diabetic patient reads two studies comparing medicine options before choosing", bucket: 0 },
          { text: "A shopper buys a pressure cooker because a cricketer advertises it", bucket: 1 },
          { text: "A voter thinks a policy must be good because the leaflet lists twelve reasons, unread", bucket: 1 },
          { text: "Parents weigh the evidence on the HPV vaccine after discussing it with a doctor", bucket: 0 },
        ],
      }, "Applications: sort the examples"),
    ],
    ref: "Petty and Cacioppo 1986; Petty, Cacioppo and Goldman 1981; Cacioppo and Petty 1982 need for cognition; Petty and Wegener 1999 multiple roles; Chaiken 1980 HSM; Kruglanski and Thompson 1999 unimodel; social module 2.1",
  },
  {
    id: "soc-l02-016",
    subject: S,
    topic: "persuasion",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "When do fear appeals work? Discuss the major models of fear appeals and their application to health campaigns in India.",
    plan: ["Early studies with mixed results", "Drive and parallel process models", "Protection motivation theory", "Extended parallel process model", "Evidence and Indian tobacco warnings"],
    answer: `## Early findings
Fear appeals try to persuade by showing the dangers of not acting. The first study, by Irving Janis and Seymour Feshbach, gave schoolchildren strong, moderate or mild fear lectures about dental hygiene. The mild version produced the most reported change in brushing, suggesting that strong fear can backfire. But Howard Leventhal found that high fear messages about tetanus increased vaccinations when combined with specific instructions, such as a map to the health centre and the times it was open. The question became when, not whether, fear works.

## Early models
- Drive reduction model: fear is an unpleasant drive; any recommendation that reduces it is learnt. It could not explain why high fear sometimes leads to rejection.
- Curvilinear model: persuasion rises with fear to a point and then falls, an inverted U.
- Parallel process model: Leventhal separated danger control, thinking about how to avoid the danger, from fear control, managing the unpleasant emotion, which can lead to denial.

## Protection motivation theory
Ronald Rogers proposed that people form an intention to protect themselves from four appraisals:
- Perceived severity of the threat.
- Perceived vulnerability, that it could happen to me.
- Response efficacy, that the recommended action works.
- Self efficacy, that I can do it.
Threat appraisal must be weighed against the costs of the response.

## Extended parallel process model
Kim Witte combined these ideas:
| Perceived threat | Perceived efficacy | Result |
| Low | Any | Little response; message ignored |
| High | High | Danger control: protective action |
| High | Low | Fear control: denial, avoidance, reactance |
The model predicts that a frightening message without a clear, doable action makes things worse by pushing people into fear control.

## Evidence
A large meta analysis found that fear appeals are generally effective in changing attitudes, intentions and behaviours, that stronger fear tends to produce more change, and that effects are larger when the message includes efficacy statements, recommends one time behaviours such as screening, and is aimed at audiences who can act.

## Indian applications
- Tobacco: since 2016, Indian cigarette and tobacco packs have carried pictorial health warnings covering 85 percent of the main surfaces, with images of mouth cancer to raise threat. A national quitline number was added later to raise efficacy, exactly as the EPPM recommends.
- Road safety: images of crash victims work best alongside helmet distribution and enforcement.
- Tuberculosis and HIV messages pair risk with free testing and treatment.
- Caution: overly graphic messages can cause reactance or stigmatise patients, and fear is less effective for long term behaviours such as quitting without support.

## Conclusion
Fear works when people feel both threatened and able to act. Campaigns should pair threat with a specific, easy and effective response.`,
    keyPoints: ["Janis and Feshbach and Leventhal's contrasting findings", "Drive, curvilinear and parallel process models", "Protection motivation theory's four appraisals", "EPPM table with danger and fear control", "Meta analytic support with efficacy statements", "Indian pictorial warnings with quitline"],
    pitfalls: ["Saying fear appeals never work", "Leaving out efficacy", "No real campaign example"],
    module: "social/2-1",
    visuals: [
      tree("Extended parallel process model", [
        ["Fear message", "Threat plus a recommended action", -1],
        ["Low threat", "Message ignored", 0],
        ["High threat, high efficacy", "Danger control: protective action", 0],
        ["High threat, low efficacy", "Fear control: denial, avoidance, reactance", 0],
      ], "Extended parallel process model: threat and efficacy"),
    ],
    ref: "Janis and Feshbach 1953; Leventhal, Singer and Jones 1965; Leventhal 1970 parallel process; Rogers 1975 and 1983 PMT; Witte 1992 EPPM; Tannenbaum et al 2015 meta-analysis; COTPA packaging and labelling amendment rules 2014 effective 2016, quitline added 2018",
  },
  {
    id: "soc-l02-017",
    subject: S,
    topic: "persuasion",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Discuss resistance to persuasion, with reference to inoculation theory, reactance and forewarning. How can these ideas help counter misinformation in India?",
    plan: ["Why resistance matters", "McGuire's inoculation theory and evidence", "Reactance", "Forewarning and attitude strength", "Prebunking and Indian misinformation"],
    answer: `## Why resistance matters
Most persuasion research asks how to change minds, but people are often exposed to propaganda, advertising and misinformation that they would prefer to resist. Several processes explain resistance.

## Inoculation theory
William McGuire proposed that attitudes can be protected in the way vaccines protect the body. Exposure to a weakened form of an attacking argument, together with a refutation, stimulates the person to build counter arguments, which protect against the full strength attack later.
- McGuire and Demetrios Papageorgis used cultural truisms, beliefs such as "brushing your teeth after every meal is good for you" that are rarely attacked and therefore defenceless. A refutational defence, presenting a weak attack and refuting it, gave more resistance to later strong attacks than a supportive defence that only offered arguments in favour.
- Inoculation has two components: threat, warning that an attack is coming, which motivates defence; and refutational pre emption, practice in answering the attack.
- Programmes that inoculated schoolchildren against peer pressure to smoke, by role playing replies such as "I would be a real chicken if I smoked to impress you", reduced later smoking.

## Reactance
Jack Brehm proposed that when people feel their freedom of choice is threatened, they experience reactance, a motivation to restore the freedom, and may adopt the opposite position or value the forbidden option more. Forceful messages ("you must"), bans and overt pressure can backfire, especially among adolescents. Censorship can make a book more attractive.

## Forewarning and attitude strength
- Forewarning of persuasive intent, telling people that someone will try to change their mind, increases resistance on issues they care about, because they prepare counter arguments.
- Strong attitudes, those held with certainty and linked to identity, are more resistant.
- Commitment, especially public commitment, also increases resistance.

## Prebunking misinformation
Modern prebunking applies inoculation to misinformation. Instead of debunking each false claim after it spreads, it teaches the techniques used to mislead: emotional manipulation, false dichotomies, fake experts, scapegoating and conspiracy framing. Online games such as Bad News, in which players act as a fake news producer, and short videos shown as advertisements improve people's ability to spot manipulative content, though effects fade over weeks unless boosted.

## The Indian context
In 2017 and 2018, rumours about child kidnappers spread through WhatsApp and led to mob lynchings in several states. Responses included limits on forwarding messages, labels for forwarded messages, police awareness drives and fact checking organisations. Inoculation style approaches in regional languages, warning people that such rumours will come and showing the tricks they use, fit the theory. However, a field experiment in Bihar found that a single in person media literacy session did not improve people's overall ability to tell true from false stories, suggesting that partisanship and trust in the source can outweigh training. Effective programmes therefore need repetition, trusted local messengers and attention to group identities.

## Conclusion
Inoculation, reactance and forewarning show that people are not passive targets of persuasion. Prebunking turns these insights into practical defences against misinformation, but in India it must work with strong group loyalties and closed messaging networks.`,
    keyPoints: ["McGuire's vaccine analogy", "Cultural truisms and refutational versus supportive defence", "Threat and refutational pre emption", "Brehm's reactance with examples", "Forewarning and attitude strength", "Prebunking techniques and evidence", "Indian WhatsApp rumours and Bihar field experiment caution"],
    pitfalls: ["Confusing inoculation with simply giving more supporting arguments", "Leaving out reactance", "Claiming prebunking solves misinformation"],
    module: "social/2-1",
    visuals: [
      chain("Inoculation theory", [["Threat", "Warn that people will try to mislead you"], ["Weakened attack", "Show a mild example of the trick"], ["Refutation", "Explain why it is misleading"], ["Counter arguments built", "The person practises defending"], ["Full attack later", "Resisted, like a vaccinated body resists disease"]]),
    ],
    ref: "McGuire and Papageorgis 1961; McGuire 1964; McAlister et al 1980 smoking inoculation; Brehm 1966 reactance; Roozenbeek and van der Linden 2019 Bad News; Roozenbeek et al 2022 prebunking videos; Badrinathan 2021 Bihar field experiment; WhatsApp forward limit 2018; social-qa inoculation",
  },
  {
    id: "soc-l02-018",
    subject: S,
    topic: "conformity-obedience",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net", "mcp-entrance"],
    question: "Describe Asch's experiments on conformity. What factors influence the amount of conformity, why do people conform, and how well have the findings held up across time and cultures?",
    plan: ["Asch's question and procedure", "Results with figures and individual differences", "Variations and other factors", "Reasons: normative and informational influence, Asch's interviews", "Replications, culture and ethics", "Evaluation"],
    answer: `## The question
Muzafer Sherif had shown that people converge on a group norm when the situation is ambiguous. Solomon Asch asked whether people would conform when the correct answer was obvious, expecting that they would not.

## Procedure
Male college students took part in what they were told was a study of visual perception. Each sat with about seven others, all confederates, around a table. On each trial they saw a standard line and three comparison lines and said aloud, in turn, which comparison matched the standard. The real participant answered last or second to last. On 12 of 18 trials, the critical trials, the confederates unanimously gave the same wrong answer. In a control condition where people judged alone, errors were under 1 percent.

## Results
- About 37 percent of answers on the critical trials went along with the wrong majority.
- About three in four participants conformed at least once.
- About one in four never conformed.
- Averages hide large individual differences, from complete independence to yielding on most trials.
In interviews, Asch found three kinds of yielding: distortion of perception, rare, in which people said they actually saw the lines as the group did; distortion of judgement, in which they concluded that their own perception must be wrong; and distortion of action, the most common, in which they knew the group was wrong but went along to avoid standing out.

## Factors influencing conformity
- Group size: conformity rose sharply up to three or four confederates and then levelled off.
- Unanimity: when one confederate gave the correct answer, conformity dropped to about 5 percent, a quarter of its usual level. Even a dissenter giving a different wrong answer reduced conformity, because unanimity was broken.
- Withdrawal of the ally: when the supporting partner switched to the majority midway, conformity rose again.
- Private answers: when the participant wrote answers privately, conformity fell sharply, showing that most yielding was public compliance.
- Task difficulty: when the lines were made more similar, conformity rose.
- Status and attraction of the group, and the person's commitment to it, increase conformity.
- Personality: low self esteem and high need for approval are associated with more conformity.

## Why people conform
Morton Deutsch and Harold Gerard distinguished:
- Normative influence: conforming to be liked and to avoid rejection, leading to public compliance without private acceptance. Asch's results are mainly normative.
- Informational influence: conforming because others are seen as a source of correct information, leading to private acceptance. This dominates in ambiguous tasks such as Sherif's.

## Across time and cultures
- In Britain in the late 1970s, Stephen Perrin and Christopher Spencer found almost no conformity among engineering and medical students, leading them to call the Asch effect a child of its time. However, with participants who felt marginal, such as young offenders with probation officers as confederates, conformity was high.
- A meta analysis by Rod Bond and Peter Smith of 133 Asch type studies from 17 countries found that conformity in the United States had declined since the 1950s and that it was higher in collectivist cultures than in individualist ones. In collectivist cultures such as India, conforming may be seen as tact and sensitivity rather than weakness.

## Ethics and evaluation
Participants were deceived and some were visibly distressed, but the harm was mild and they were debriefed. Strengths: a simple, controlled and replicable paradigm. Limitations: an artificial task with strangers and no consequences; mostly male American students; and an emphasis on conformity, although most answers were actually independent. Asch himself stressed that most participants resisted most of the time.

## Conclusion
Asch showed that even when the answer is clear, a unanimous group can make many people deny the evidence of their senses in public. Breaking unanimity, answering privately and valuing independence all reduce conformity, which is why a single dissenting voice in a committee or ward round matters.`,
    keyPoints: ["Procedure with confederates, 12 of 18 critical trials and control", "37 percent, three quarters at least once, one quarter never", "Distortion of perception, judgement and action", "Group size, unanimity, private answers, difficulty", "Normative and informational influence", "Perrin and Spencer and Bond and Smith meta analysis", "Ethics and evaluation including mostly independent answers"],
    pitfalls: ["Saying 75 percent of answers conformed", "Missing the effect of a single ally", "No cultural findings"],
    module: "social/2-2",
    visuals: [
      { kind: "figure", data: { id: "asch-cards" }, caption: "Procedure: Asch's cards and seating" },
      vis("experiment", { title: "Factors influencing conformity in Asch's studies", question: "On critical trials, what share of answers went along with the wrong majority?", unit: "%", conditions: [{ label: "Alone, no group", value: 0.7 }, { label: "Unanimous wrong majority", value: 37 }, { label: "One ally gives the right answer", value: 5.5 }], why: "A single dissenter breaks unanimity and cuts conformity sharply." }),
    ],
    ref: "Asch 1951, 1955, 1956; Deutsch and Gerard 1955; Perrin and Spencer 1980 and 1981; Bond and Smith 1996 meta-analysis; social module 2.2",
  },
  {
    id: "soc-l02-019",
    subject: S,
    topic: "conformity-obedience",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Distinguish informational and normative social influence. Discuss Sherif's autokinetic studies, Kelman's levels of influence and the role of social norms in everyday behaviour.",
    plan: ["Define conformity and the two kinds of influence", "Sherif's autokinetic studies and norm transmission", "Evidence separating the two influences", "Kelman's three levels", "Descriptive and injunctive norms and applications"],
    answer: `## Two kinds of influence
Conformity is a change in behaviour or belief to match others, in response to real or imagined group pressure. Morton Deutsch and Harold Gerard distinguished two motives:
- Informational social influence: accepting others' views as evidence about reality, because we want to be right. It is strongest when the situation is ambiguous, a crisis, or when others are experts, and it produces private acceptance.
- Normative social influence: going along with others to be liked, accepted or to avoid rejection. It is strongest when the group is valued and responses are public, and it often produces public compliance without private belief.

## Sherif's autokinetic studies
Muzafer Sherif used the autokinetic effect: in a completely dark room, a stationary point of light appears to move. Participants first estimating alone gave widely varying estimates of how far it moved. When they then estimated aloud in small groups, their estimates converged on a common group norm over a few sessions. When later tested alone, they kept the group norm, showing private acceptance. Robert Jacobs and Donald Campbell later showed that an exaggerated norm introduced by confederates was passed on through several generations of a laboratory group, as old members were replaced one by one by new ones, before fading. Norms can outlive the people who created them.

## Separating the two influences
Robert Baron and colleagues gave participants an eyewitness identification task that was either easy or difficult, with low or high importance. When the task was difficult and important, conformity to confederates rose, as informational influence predicts. When the task was easy and important, conformity fell, because the motive to be accurate outweighed the wish to fit in. Asch's study, with an obvious answer and public responding, is mainly normative.

## Kelman's three levels
Herbert Kelman described three processes of influence:
1. Compliance: public conformity to gain reward or avoid punishment; it lasts only while the influencing agent is watching.
2. Identification: adopting a view because one wants to be like a valued person or group; it lasts while the relationship matters.
3. Internalisation: accepting a view because it fits one's own values; it lasts without surveillance.
Normative influence tends to produce compliance; informational influence tends to produce internalisation.

## Social norms in everyday life
Robert Cialdini distinguished descriptive norms, what most people do, from injunctive norms, what people approve. Hotel guests reused towels more when told that most guests in their room had done so than when given an environmental appeal. Messages that say "many people litter" can backfire by communicating a descriptive norm of littering. In India, social norms explain behaviours such as open defecation persisting after toilets were built, queue jumping or helmet use, and campaigns that show the growing number of people adopting a behaviour use descriptive norms deliberately.

## Conclusion
People conform both to be right and to be liked. Informational influence changes private beliefs, especially under uncertainty; normative influence changes public behaviour. Designing norm based messages carefully can harness both for social good.`,
    keyPoints: ["Definitions of informational and normative influence", "Sherif's procedure and persistence of norms", "Jacobs and Campbell generational transmission", "Baron's difficulty and importance study", "Kelman's compliance, identification and internalisation", "Descriptive and injunctive norms with towel study", "Indian applications"],
    pitfalls: ["Calling Sherif's study normative influence", "Leaving out private versus public change"],
    module: "social/2-2",
    visuals: [
      compare(
        "Two kinds of influence: Sherif and Asch",
        ["Informational: Sherif", ["Ambiguous task: moving light", "Others used as evidence", "Estimates converge on a norm", "Norm persists when alone"], "Private acceptance"],
        ["Normative: Asch", ["Obvious task: matching lines", "Wish to fit in", "Wrong answers given aloud", "Falls with private answers"], "Public compliance"],
      ),
      layers("Kelman's three levels", "stack", [
        ["Internalisation", "Accepted because it fits one's values; lasts without surveillance"],
        ["Identification", "Adopted to be like a valued person or group"],
        ["Compliance", "Public only, for reward or to avoid punishment"],
      ]),
    ],
    ref: "Deutsch and Gerard 1955; Sherif 1935 and 1936; Jacobs and Campbell 1961; Baron, Vandello and Brunsman 1996; Kelman 1958; Cialdini, Reno and Kallgren 1990; Goldstein, Cialdini and Griskevicius 2008 towels; social module 2.2",
  },
  {
    id: "soc-l02-020",
    subject: S,
    topic: "conformity-obedience",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "How can a minority influence a majority? Discuss Moscovici's research and conversion theory, and the conditions under which minority influence is effective.",
    plan: ["Challenge to majority focused research", "Moscovici's blue green study with results", "Conversion theory and latent change", "Conditions: consistency, flexibility, commitment, ingroup status", "Divergent thinking, examples and evaluation"],
    answer: `## From majority to minority
Early research such as Asch's focused on how majorities pressure individuals. Serge Moscovici argued that this could not explain social change, which often begins with a small minority, such as early campaigners for women's votes, environmental movements like Chipko, or the activists who pressed for India's Right to Information Act. He studied how minorities win converts.

## The blue green study
In Moscovici's study, groups of six women judged the colour of 36 slides, all blue but varying in brightness. Two were confederates.
- When the confederates consistently called every slide green, about 8 percent of the real participants' answers were green, and about a third of participants said green at least once.
- When the confederates were inconsistent, calling 24 slides green and 12 blue, only about 1 percent of answers were green.
- In a control group with no confederates, green answers were almost absent.
Consistency was the key. In a later part, participants exposed to the consistent minority were more likely to judge ambiguous blue green discs as green privately, suggesting a change in perception, not just in public statements.

## Conversion theory
Moscovici proposed that majorities and minorities influence through different processes:
- Majority influence works through social comparison: people focus on what others think, comply publicly to fit in, and change little privately.
- Minority influence works through validation: a consistent minority creates conflict and makes people examine the issue itself. Change is slower, often private and delayed, and may appear on related issues rather than the one discussed. Moscovici called this conversion.
A meta analysis by Wendy Wood and colleagues supported the pattern: minorities had more effect on private and indirect measures than on public, direct ones.

## Conditions for effective minority influence
- Consistency over time and among minority members signals confidence and certainty.
- Flexibility: Gabriel Mugny showed that rigid, dogmatic minorities are dismissed; consistent but reasonable minorities, willing to compromise on details, persuade more.
- Commitment and sacrifice: minorities who pay a personal price, such as Gandhi's followers during the salt satyagraha, appear sincere.
- Ingroup minorities, who share the majority's wider identity, are more influential than outgroup ones, who can be dismissed as different.
- The snowball effect: as some majority members convert, others follow, until the minority becomes the majority.

## Minority dissent and thinking
Charlan Nemeth found that exposure to a dissenting minority stimulates divergent thinking: people consider more alternatives and find more original solutions, even when they do not adopt the minority view. Majorities tend to produce convergent thinking. This is why devil's advocates and dissenting voices improve group decisions and reduce groupthink.

## Evaluation
Strengths: the research explains social innovation and shows that influence is not one way. Limitations: laboratory minorities are artificial; effects are often small; and real minorities face hostility, stigma and power differences that experiments do not capture.

## Conclusion
A minority can change a majority if it is consistent, flexible, committed and seen as part of the ingroup. Its influence is usually private and delayed, producing genuine conversion rather than mere compliance.`,
    keyPoints: ["Why minority influence matters for social change", "Moscovici's procedure and consistent versus inconsistent results", "Private perceptual change", "Conversion theory: comparison versus validation", "Wood's meta analysis", "Consistency, flexibility, commitment, ingroup status, snowball", "Nemeth's divergent thinking and evaluation"],
    pitfalls: ["Leaving out the inconsistent condition", "Not distinguishing public and private change"],
    module: "social/2-2",
    visuals: [
      vis("experiment", { title: "The blue green study", question: "What percentage of real participants' answers called the blue slides green?", unit: "%", conditions: [{ label: "Consistent minority", value: 8.4 }, { label: "Inconsistent minority", value: 1.3 }, { label: "No minority", value: 0.3 }], why: "Only a consistent minority moved the majority." }),
      compare(
        "Conversion theory",
        ["Majority influence", ["Social comparison", "Focus on what others think", "Public compliance", "Quick but shallow"], "Compliance"],
        ["Minority influence", ["Validation", "Focus on the issue itself", "Private, delayed change", "Spreads to related issues"], "Conversion"],
      ),
    ],
    ref: "Moscovici, Lage and Naffrechoux 1969; Moscovici 1980 conversion theory; Moscovici and Personnaz 1980; Mugny 1982; Wood et al 1994 meta-analysis; Nemeth 1986; social module 2.2",
  },
]);
