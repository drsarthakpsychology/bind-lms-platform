import type { LongQA } from "@/lib/prep/long-types";
import type { PrepVisual } from "@/lib/prep/types";
import type { FigureData } from "@/lib/study/types";
import { anchored, chain, compare, layers, tree, vis } from "./visual";

const S = "social" as const;
const fig = (id: string, caption: string): PrepVisual => ({ kind: "figure", data: { id } satisfies FigureData, caption });

export const SOCIAL_L03: LongQA[] = anchored([
  {
    id: "soc-l03-001",
    subject: S,
    topic: "obedience",
    marks: 20,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Describe Milgram's studies of obedience to authority. What factors increased or reduced obedience, how did Milgram explain his findings, and how have the studies been criticised and replicated?",
    plan: ["Background and question", "The basic procedure and result", "Variations", "Explanations: agentic state and others", "Ethical and methodological criticism", "Replications and relevance"],
    answer: `## Background
Stanley Milgram, a psychologist at Yale, began his studies in 1961, the year of the trial of Adolf Eichmann, an organiser of the Holocaust who claimed he was only following orders. Milgram asked whether ordinary people would harm an innocent person if an authority told them to.

## The basic procedure
- Forty men aged 20 to 50 from New Haven, of varied jobs, answered an advertisement for a study of memory and learning, paid four dollars and fifty cents.
- A rigged draw made each participant the teacher; a mild mannered confederate, Mr Wallace, became the learner and was strapped into a chair in the next room.
- The teacher sat before a shock generator with 30 switches from 15 to 450 volts, labelled from slight shock to danger: severe shock, and finally XXX. He received a real 45 volt sample shock.
- For each wrong answer in a word pair task, the teacher had to give a shock one level higher. No real shocks were given; the learner's protests were tape recorded: complaints at 75 volts, demands to be released at 150, agonised screams, mention of his heart, and silence after 330.
- When the teacher hesitated, the experimenter, in a grey lab coat, used four prods in order, from "please continue" to "you have no other choice, you must go on".

## The result
Before the study, psychiatrists predicted that only about one in a thousand would go to the end. In fact 26 of 40, or 65 per cent, went all the way to 450 volts, and every participant went to at least 300 volts. Many sweated, trembled, laughed nervously or begged to stop, yet continued.

## Variations
| Variation | Full obedience |
| Baseline, learner in another room | 65 per cent |
| Learner in the same room | 40 per cent |
| Teacher must press the learner's hand onto a shock plate | 30 per cent |
| Experimenter gives orders by telephone | About 20 per cent |
| Run in a run down office in Bridgeport, not Yale | About 48 per cent |
| Two peers rebel and refuse | 10 per cent |
| Teacher only reads the words while another gives shocks | About 92 per cent |
| Ordinary man gives the orders | 20 per cent |
Obedience fell with closeness to the victim, distance from authority, loss of legitimacy and disobedient models, and rose when responsibility was spread.

## Explanations
1. The agentic state: Milgram proposed that in a hierarchy people shift from an autonomous state, acting on their own conscience, to an agentic state, seeing themselves as agents carrying out another's wishes, so they feel less responsible.
2. Legitimate authority: the setting of Yale, the coat and the scientific purpose gave the experimenter credibility.
3. Gradual commitment: each step was only 15 volts more, like a foot in the door; stopping at 300 meant admitting that 285 was wrong.
4. Binding factors: politeness, the promise made, and the awkwardness of defying someone face to face.
5. A later explanation, engaged followership, argues that people continued not out of blind obedience but because they identified with the scientific goal; obedience fell sharply when the experimenter gave a direct order, the fourth prod.

## Criticism
Ethical:
- Deception about the purpose and about the shocks.
- Severe stress: three participants had uncontrollable seizures.
- The prods made withdrawal difficult, conflicting with the right to withdraw.
- Milgram replied that participants were debriefed, and in a follow up 84 per cent said they were glad to have taken part.
Methodological:
- Some participants may have suspected the shocks were fake; analysis of archives by Gina Perry suggested many had doubts.
- The sample was male and American, though later versions included women, who obeyed at the same rate.
- Whether a laboratory task captures real world atrocities is debated.

## Replications
- Similar studies across many countries found broadly high obedience.
- Jerry Burger in 2009 ran an ethical partial replication stopping at 150 volts, the point at which most people who pass go on to the end, and found 70 per cent willing to continue, close to Milgram's rate at that point.
- In 2017 a Polish team found 90 per cent willing to reach the highest of ten levels in a shortened version.

## Relevance
The studies help explain obedience in institutions: hospital staff following an unsafe order, police in custodial violence, or soldiers in massacres. In clinical settings they warn against unquestioning compliance with seniors and support training that encourages speaking up for patient safety.

## Conclusion
Milgram showed that situational forces can lead ordinary people to harm others. The studies remain powerful, ethically controversial and, in their core finding, repeatable.`,
    keyPoints: ["Eichmann background and research question", "Procedure: teacher, learner, 15 to 450 volts, four prods", "65 per cent full obedience against predicted 0.1 per cent", "Variations: proximity, authority distance, setting, peers", "Agentic state and legitimate authority", "Gradual commitment and engaged followership", "Ethical and methodological critique", "Burger 2009 and other replications"],
    pitfalls: ["Getting the figure of 65 per cent wrong", "Listing results without explanations", "Ignoring the ethics debate"],
    module: "social/2-3",
    visuals: [
      fig("milgram-setup", "The basic procedure: the teacher, the learner and the experimenter"),
      vis("experiment", { title: "Variations", question: "What percentage went to 450 volts?", unit: "%", conditions: [{ label: "Baseline", value: 65 }, { label: "Same room", value: 40 }, { label: "Touch proximity", value: 30 }, { label: "Orders by phone", value: 20 }, { label: "Peers rebel", value: 10 }], why: "Obedience falls as the victim gets closer and the authority gets further away." }),
    ],
    ref: "Milgram 1963 Behavioral study of obedience; Milgram 1974 Obedience to Authority; Burger 2009; Doliński et al 2017; Haslam and Reicher engaged followership; Perry 2012; social module 2.3",
  },
  {
    id: "soc-l03-002",
    subject: S,
    topic: "roles-deindividuation",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "What is deindividuation? Discuss the Stanford prison experiment and later research on roles, anonymity and crowd behaviour.",
    plan: ["Definition", "Stanford prison experiment", "Criticisms and the BBC prison study", "Deindividuation research", "Social identity view of crowds"],
    answer: `## Deindividuation
Deindividuation is a state in which people lose their sense of individual identity and self awareness in a group, and become less restrained by personal norms. Leon Festinger and colleagues introduced the term, and Philip Zimbardo argued that anonymity, arousal and diffusion of responsibility lead to impulsive, antisocial behaviour.

## The Stanford prison experiment
In August 1971, Zimbardo turned the basement of the Stanford psychology department into a mock prison. Twenty four male students, screened as healthy, were randomly assigned to be guards or prisoners. Prisoners were arrested at home, given numbers and smocks; guards wore uniforms and mirrored sunglasses. Within days some guards became cruel, using humiliation and sleepless counts, and some prisoners became passive or distressed. The study, planned for two weeks, was stopped after six days. Zimbardo concluded that roles and the situation, not personality, produced the abuse.

## Criticisms
- Zimbardo acted as prison superintendent, so he was not neutral.
- Recordings released later suggest guards were told how to behave, so it showed demand and instruction rather than spontaneous role taking.
- Only about a third of guards were cruel; others were fair or kind, which shows individual differences.
- Ethical concerns over harm and the right to leave.
- In the BBC prison study of 2002, Stephen Reicher and Alexander Haslam found that guards did not automatically become tyrannical; behaviour depended on whether people identified with their group, and prisoners who formed a shared identity resisted.

## Research on anonymity
- Zimbardo found that women wearing hoods gave longer shocks than those with name tags.
- Edward Diener's study of Halloween trick or treaters found that anonymous children in groups took more sweets than allowed.
- Robert Watson found that warrior cultures that changed their appearance before battle were more likely to torture enemies.
- Anonymity can also increase prosocial behaviour when group norms are positive, as with anonymous donors.

## Social identity view of crowds
Reicher's work on crowds argues that people in crowds do not lose identity but shift to a social identity, following the norms of the group. Crowd behaviour is therefore shaped, not mindless, as in peaceful mass gatherings like the Kumbh Mela, where shared identity supports cooperation.

## Conclusion
Roles and anonymity can promote harm, but people follow group norms and identities rather than simply losing control.`,
    keyPoints: ["Definition and Zimbardo's model", "Stanford 1971: 24 students, stopped after 6 days", "Critique: instructions, superintendent role, individual differences, ethics", "BBC prison study and social identity", "Hooded participants and Halloween study", "Anonymity can also help", "Crowds follow group norms"],
    pitfalls: ["Presenting the Stanford study as unquestioned", "Ignoring social identity explanations"],
    module: "social/2-4",
    visuals: [compare("Criticisms", ["Zimbardo's account", ["Roles alone made guards cruel", "Situation beats personality", "Loss of identity"], "Deindividuation"], ["Later critique", ["Guards were coached", "Only some guards were cruel", "Identification with a group shapes behaviour"], "Social identity"])],
    ref: "Haney, Banks and Zimbardo 1973; Le Texier 2019 on archives; Reicher and Haslam BBC prison study 2006; Diener et al 1976; Watson 1973; Zimbardo 1969 hooded study; social module 2.2 to 2.4",
  },
  {
    id: "soc-l03-003",
    subject: S,
    topic: "group-processes",
    marks: 15,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Explain social facilitation and social loafing. Describe the classic experiments and theories, and discuss how loafing can be reduced, with examples from Indian workplaces and classrooms.",
    plan: ["Definitions", "Social facilitation: Triplett and Zajonc", "Explanations of facilitation", "Social loafing: Ringelmann and Latane", "The collective effort model and reducing loafing", "Integration"],
    answer: `## Two effects of others
The mere presence of other people changes how well we perform. Social facilitation is the improvement in performance on simple or well learned tasks, and impairment on complex or new tasks, in the presence of others. Social loafing is the tendency to put in less effort when working in a group on a shared task where individual effort is not identified.

## Social facilitation
- Norman Triplett in 1898 noticed that cyclists rode faster when racing others than alone, and found children wound fishing reels faster in pairs. This is often called one of the first social psychology experiments.
- Later studies found that presence sometimes worsened performance, which seemed contradictory.
- Robert Zajonc in 1965 resolved this with drive theory: the presence of others raises arousal, and arousal strengthens the dominant response, the one most likely in that situation. On easy or well practised tasks the dominant response is correct, so performance improves; on hard or new tasks it is often wrong, so performance worsens. He showed the effect even in cockroaches running a simple or complex maze in front of other cockroaches.

## Why presence arouses
1. Mere presence: an innate alertness to others, as Zajonc held.
2. Evaluation apprehension: Nickolas Cottrell found that the effect occurred when the audience could judge, but not when the audience was blindfolded.
3. Distraction conflict: attention is divided between the task and the audience.
Example: an experienced bank cashier counts notes faster when customers watch; a trainee makes more mistakes.

## Social loafing
- Max Ringelmann, a French agricultural engineer, found in the 1880s that people pulling a rope in groups pulled with less force per person as the group grew. Part was poor coordination, but later studies showed lower effort too.
- Bibb Latane, Kipling Williams and Stephen Harkins in 1979 asked students to clap and shout as loudly as possible. When blindfolded and wearing headphones, people who believed they were shouting with others shouted less than when alone, showing reduced effort, not just coordination loss.
- A meta analysis by Steven Karau and Kipling Williams in 1993 of 78 studies confirmed loafing across tasks and cultures, smaller in women and in collectivist cultures.

## The collective effort model
Karau and Williams proposed that people work hard when they expect their effort to make a difference to an outcome they value. Loafing increases when individual contributions cannot be identified, the task is meaningless, the group is unimportant to them, or others are expected to do the work.

## Reducing loafing
- Make each person's contribution identifiable, for example individual roles in a group project.
- Make the task important and meaningful.
- Keep groups small.
- Increase group cohesiveness and identification.
- Set clear group and individual goals.
- Example: in an Indian college group assignment, assigning named sections and peer evaluation reduces free riding. In a government office committee, giving each member a named deliverable reduces delay.

## Facilitation or loafing?
| | Evaluation possible | Evaluation not possible |
| Simple task | Facilitation: better | Loafing: worse |
| Complex task | Impairment | Loafing may reduce anxiety, so slightly better |
Whether others help or hurt depends on whether individual effort is evaluated and on task difficulty.

## Culture
Studies in China, Japan and India have found less loafing in groups of friends or in collectivist settings, and sometimes social striving, where people work harder in groups that matter to them. J B P Sinha's work on Indian organisations suggests that strong relationships with leaders can increase effort.

## Conclusion
The presence of others can help or hinder. Arousal and evaluation explain facilitation; reduced identifiability and value explain loafing. Good group design makes individual effort visible and meaningful.`,
    keyPoints: ["Definitions of facilitation and loafing", "Triplett 1898", "Zajonc's drive theory and dominant response", "Evaluation apprehension and distraction conflict", "Ringelmann and the clapping study of 1979", "Karau and Williams meta analysis and collective effort model", "Ways to reduce loafing", "Culture and social striving"],
    pitfalls: ["Saying presence always improves performance", "Confusing loafing with coordination loss only"],
    module: "social/2-4",
    visuals: [
      chain("Social facilitation", [["Others present", "Mere presence or evaluation"], ["Arousal rises", "Drive"], ["Dominant response strengthened", "Most likely response"], ["Easy task: better", "Hard task: worse"]]),
      vis("sort", { prompt: "Facilitation or loafing?", buckets: ["Social facilitation", "Social loafing"], items: [{ text: "A practised cyclist rides faster in a race", bucket: 0 }, { text: "One student in a group project of six does no work", bucket: 1 }, { text: "A tug of war team pulls less per person as it grows", bucket: 1 }, { text: "A seasoned singer performs better before an audience", bucket: 0 }] }, "Social loafing"),
    ],
    ref: "Triplett 1898; Zajonc 1965 and Zajonc, Heingartner and Herman 1969; Cottrell et al 1968; Baron distraction conflict; Ringelmann 1913; Latane, Williams and Harkins 1979; Karau and Williams 1993; social module 2.4",
  },
  {
    id: "soc-l03-004",
    subject: S,
    topic: "group-decisions",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Discuss group decision making with reference to group polarisation and groupthink. Explain their causes, symptoms and prevention.",
    plan: ["Groups and decisions", "From risky shift to group polarisation", "Explanations of polarisation", "Groupthink: antecedents, symptoms, outcomes", "Prevention and critique"],
    answer: `## Do groups decide better?
Groups bring more knowledge than individuals, but they can also make poorer, more extreme or more careless decisions. Two well studied processes explain how.

## Group polarisation
- In 1961 James Stoner found that groups discussing dilemmas recommended riskier options than individuals, a risky shift.
- Later studies found that groups sometimes became more cautious. Serge Moscovici and Marisa Zavalloni showed in 1969 that discussion made French students' existing positive attitudes towards de Gaulle more positive and negative attitudes towards Americans more negative.
- Group polarisation is the tendency for group discussion to strengthen the initial leaning of members, making the group's position more extreme in the same direction.
- Examples: jury deliberations become harsher or more lenient depending on initial leanings; like minded online groups become more extreme, which helps explain echo chambers and communal polarisation on social media.

## Explanations
1. Persuasive arguments: discussion exposes members to new arguments mostly supporting the dominant view.
2. Social comparison: people want to appear at least as committed to valued positions as others, so they shift further.
3. Social identity: members conform to a group prototype that is more extreme than the average, to distinguish their group from others.

## Groupthink
Irving Janis, studying American foreign policy disasters such as the Bay of Pigs invasion of 1961 and the failure to anticipate Pearl Harbor, described groupthink as a mode of thinking in a cohesive group where the desire for agreement overrides realistic appraisal of alternatives.
Antecedents:
- High cohesiveness.
- Insulation from outside opinion.
- A directive leader who states a preference.
- No procedures for weighing alternatives.
- High stress and low hope of a better solution.
Symptoms:
1. Illusion of invulnerability.
2. Belief in the group's inherent morality.
3. Collective rationalisation of warnings.
4. Stereotyped views of opponents.
5. Pressure on dissenters.
6. Self censorship.
7. Illusion of unanimity.
8. Self appointed mind guards who shield the group from adverse information.
Outcomes: incomplete survey of alternatives, failure to examine risks, poor information search and no contingency plans.

## An Indian example
A college management committee, led by a dominant principal who wants a new expensive programme, ignores staff warnings about low demand, assumes success because of the college's reputation and silences doubters. The programme fails in its first year. These are the features of groupthink.

## Prevention
- The leader should stay impartial and speak last.
- Invite outside experts and critics.
- Assign a devil's advocate, or better, encourage genuine dissent.
- Split into subgroups to discuss separately.
- Hold a second chance meeting before final decisions.
- Use structured methods such as the nominal group technique or the Delphi method.

## Polarisation and groupthink compared
| | Group polarisation | Groupthink |
| What happens | Views become more extreme in the starting direction | Agreement is sought at the cost of critical thinking |
| Key condition | Members already lean one way | High cohesion with a directive leader and insulation |
| Main process | Arguments, comparison, identity | Pressure to conform and self censorship |
| Typical setting | Juries, online groups, committees | Cabinets, boards, closed teams |
Both can occur together: a cohesive, like minded group may both polarise and stop questioning itself.

## Critique
- Evidence for groupthink comes largely from case studies, judged in hindsight.
- Laboratory tests show cohesiveness alone does not cause poor decisions; directive leadership and closed procedures matter more.
- Polarisation research is robust, but its size depends on the group and topic.

## Conclusion
Groups can sharpen their members' views and, under strong cohesion and directive leadership, suppress critical thinking. Simple structural safeguards make group decisions better.`,
    keyPoints: ["Risky shift 1961 and group polarisation", "Moscovici and Zavalloni 1969", "Persuasive arguments, social comparison, social identity", "Janis's definition and cases", "Antecedents of groupthink", "Eight symptoms", "Prevention techniques", "Critique: case study evidence"],
    pitfalls: ["Saying groups always become riskier", "Listing symptoms without antecedents"],
    module: "social/2-4",
    visuals: [
      layers("Groupthink", "stack", [["Antecedents", "Cohesion, insulation, directive leader, stress"], ["Concurrence seeking", "Desire for agreement"], ["Symptoms", "Invulnerability, rationalisation, self censorship, mind guards"], ["Defective decisions", "Few alternatives, no risk check"], ["Poor outcome", "Bay of Pigs"]]),
      chain("Group polarisation", [["Members lean one way", "Initial average"], ["Discussion", "More arguments for that side"], ["Comparison and identity", "Wish to be a good member"], ["More extreme group view", "Same direction"]]),
    ],
    ref: "Stoner 1961; Moscovici and Zavalloni 1969; Myers and Lamm 1976; Janis 1972, 1982; Esser 1998 review; social module 2.4",
  },
  {
    id: "soc-l03-005",
    subject: S,
    topic: "leadership",
    marks: 15,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Critically discuss the major theories of leadership: trait, behavioural, contingency and transformational. Add a note on the nurturant task leader model from India.",
    plan: ["What leadership is", "Trait theories", "Behavioural theories", "Contingency theories", "Transformational leadership", "Indian model and conclusion"],
    answer: `## What leadership is
Leadership is the process by which one person influences a group towards shared goals. Theories have moved from looking at who leaders are, to what they do, to how they fit the situation, to how they transform followers.

## Trait theories
The great man view held that leaders are born with special qualities. Early reviews, such as Ralph Stogdill's in 1948, found few traits that consistently predicted leadership. Later meta analyses found modest links: extraversion, conscientiousness and openness from the Big Five, intelligence, self confidence and emotional intelligence predict leader emergence and, less strongly, effectiveness. Traits matter but do not explain everything.

## Behavioural theories
- Kurt Lewin, Ronald Lippitt and Ralph White in 1939 compared authoritarian, democratic and laissez faire leaders of boys' clubs. Democratic groups were more satisfied and worked steadily; authoritarian groups worked well only when the leader was present; laissez faire groups did least.
- The Ohio State studies identified two independent dimensions: initiating structure, organising tasks, and consideration, showing care for followers. The Michigan studies made a similar distinction between production centred and employee centred leaders.
- Robert Blake and Jane Mouton's managerial grid plotted concern for people against concern for production, with the 9,9 team manager seen as ideal.
Behavioural theories ignored the situation.

## Contingency theories
- Fred Fiedler's model held that leader effectiveness depends on the match between style and situation. Style is measured by the least preferred co worker scale. Task oriented leaders do best in very favourable or very unfavourable situations; relationship oriented leaders in moderate ones. Situational favourability depends on leader member relations, task structure and position power.
- Paul Hersey and Kenneth Blanchard's situational leadership says leaders should adjust from telling to selling, participating and delegating as followers' readiness grows.
- Robert House's path goal theory says leaders motivate by clarifying paths to goals and removing obstacles, choosing directive, supportive, participative or achievement oriented behaviour.
- Victor Vroom and Philip Yetton's normative model prescribes how much to involve followers in decisions.

## Transformational leadership
James MacGregor Burns in 1978 distinguished transactional leaders, who exchange rewards for performance, from transformational leaders, who raise followers' motivation and values. Bernard Bass described four components:
1. Idealised influence: acting as a role model.
2. Inspirational motivation: a compelling vision.
3. Intellectual stimulation: encouraging new thinking.
4. Individualised consideration: attention to each follower.
Research shows transformational leadership is linked to follower satisfaction, commitment and performance. Mahatma Gandhi is often given as an example of a transformational leader who inspired through moral example.

## The nurturant task leader
J B P Sinha, studying Indian organisations from the 1970s, proposed the nurturant task leader. Indian employees, he argued, value dependence and personalised relationships with superiors. A leader who is both task oriented, setting high standards and hard work, and nurturant, caring for subordinates like a father figure and guiding them, is most effective in this culture. As subordinates mature, the leader gradually shifts towards participation. The model is an early example of indigenous Indian social psychology.

## Evaluation
| Theory | Strength | Weakness |
| Trait | Some traits predict emergence | Weak for effectiveness, ignores situation |
| Behavioural | Identified two key dimensions | Ignores context |
| Contingency | Brings in the situation | Complex, mixed evidence for Fiedler |
| Transformational | Strong evidence for outcomes | Risk of idealising charisma |
| Nurturant task | Culturally fitted to India | Risk of encouraging dependence |

## Conclusion
No single theory explains leadership. Effective leaders combine traits, task and relationship behaviours, sensitivity to the situation and an inspiring vision, adapted to their culture.`,
    keyPoints: ["Definition of leadership", "Trait theories and Big Five evidence", "Lewin's three styles and Ohio State dimensions", "Fiedler's contingency model and LPC", "Situational and path goal theories", "Transformational versus transactional, four components", "J B P Sinha's nurturant task leader", "Evaluation of each theory"],
    pitfalls: ["Missing the Indian model", "No evaluation"],
    module: "social/2-5",
    visuals: [tree("Theories of leadership", [["Leadership theories", "From traits to transformation", -1], ["Trait", "Who leaders are", 0], ["Behavioural", "Lewin, Ohio State, grid", 0], ["Contingency", "Fiedler, situational, path goal", 0], ["Transformational", "Vision and inspiration", 0], ["Nurturant task", "J B P Sinha, India", 4]], "Evaluation: the theories at a glance")],
    ref: "Stogdill 1948; Judge et al 2002 meta-analysis; Lewin, Lippitt and White 1939; Fiedler 1967; Hersey and Blanchard 1969; House 1971; Burns 1978; Bass 1985; Sinha 1980 The Nurturant Task Leader; social module 2.5",
  },
  {
    id: "soc-l03-006",
    subject: S,
    topic: "prejudice",
    marks: 20,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Define prejudice, stereotypes and discrimination. Critically evaluate the personality, cognitive, intergroup and social identity explanations of prejudice, with Indian examples.",
    plan: ["Definitions and the ABC of prejudice", "Personality explanations", "Cognitive explanations", "Realistic conflict and Robbers Cave", "Social identity theory and minimal groups", "Modern and implicit prejudice; integration"],
    answer: `## Definitions
- Prejudice is a negative attitude towards members of a group simply because of their membership. Gordon Allport in 1954 called it an antipathy based on faulty and inflexible generalisation.
- A stereotype is the cognitive part: a belief about the characteristics of a group, such as that a community is miserly or that women are poor at mathematics.
- Discrimination is the behavioural part: unfair treatment, such as refusing to rent a flat to a Muslim family or to a Dalit tenant.
In India, prejudice is linked to caste, religion, region, language, skin colour, gender and sexuality.

## Personality explanations
- Theodor Adorno and colleagues in 1950 proposed the authoritarian personality: people raised by harsh, status conscious parents displace hostility onto weaker outgroups. The F scale measured traits such as conventionalism, submission to authority and aggression towards deviants.
- Bob Altemeyer later refined this as right wing authoritarianism, and social dominance orientation, the preference for group hierarchy, also predicts prejudice.
- Criticism: personality cannot explain why whole societies become prejudiced, or why prejudice changes quickly with social norms, as Thomas Pettigrew showed in comparisons of South Africa and the American south.

## Cognitive explanations
- Categorisation simplifies a complex world, but leads to outgroup homogeneity, seeing them as all alike, and accentuation of differences.
- Illusory correlation: rare groups and rare negative behaviours are both distinctive, so people overestimate their link.
- Confirmation bias and subtyping preserve stereotypes despite contrary evidence.
- Stereotypes can be activated automatically; Patricia Devine showed that even low prejudice people know cultural stereotypes, but they control them when motivated and able.

## Realistic conflict theory
Muzafer Sherif's Robbers Cave study of 1954 placed 22 eleven year old boys at a camp in two groups, the Rattlers and the Eagles. Competition for prizes led to name calling, raids and flag burning. Contact alone did not reduce hostility, but superordinate goals, such as repairing a water supply and pulling a broken down truck together, did. Prejudice follows competition for scarce resources, as when communal tensions rise with competition for jobs or land.

## Social identity theory
- Henri Tajfel's minimal group studies in 1971 divided Bristol schoolboys into groups on trivial grounds, such as preference for Klee or Kandinsky paintings. Boys favoured their own group in allocating points, even choosing to maximise the difference between groups over maximising their own group's gain.
- Tajfel and John Turner's social identity theory holds that part of our self concept comes from groups. We gain self esteem by seeing our group as better than others: categorisation, identification, comparison.
- When status differences seem legitimate and stable, low status groups may accept them; when they seem illegitimate, collective action follows. This helps explain caste mobilisation movements in India.

## Modern and implicit prejudice
- Open prejudice has declined in many societies, replaced by subtle, symbolic or aversive forms.
- The Implicit Association Test measures automatic associations, though its prediction of behaviour is weak.
- In India, field experiments sending identical job applications with upper caste, Dalit and Muslim names found that Dalit and Muslim applicants received fewer interview calls.
- Karla Hoff and Priyanka Pandey found that low caste boys in Uttar Pradesh solved maze puzzles as well as high caste boys when caste was not mentioned, but worse when caste was publicly announced, a form of stereotype threat.

## Evaluation
| Explanation | Strength | Limit |
| Authoritarian personality | Explains individual differences | Ignores norms and history |
| Cognitive | Universal processes | Does not explain which groups are targeted |
| Realistic conflict | Strong field evidence | Prejudice occurs without competition |
| Social identity | Explains minimal groups | Ingroup love is not always outgroup hate |

## Conclusion
Prejudice arises from the interplay of personality, ordinary thinking, competition and the need for positive group identity, set within historical structures such as caste. Each theory points to a different remedy, from education to cooperation to changing norms.`,
    keyPoints: ["Prejudice, stereotype and discrimination as attitude components", "Authoritarian personality, RWA and SDO", "Categorisation, outgroup homogeneity, illusory correlation, automatic activation", "Robbers Cave and superordinate goals", "Minimal group paradigm and social identity theory", "Modern and implicit prejudice", "Indian evidence on caste and religion", "Comparative evaluation"],
    pitfalls: ["Defining prejudice only as behaviour", "No Indian evidence", "Not evaluating"],
    module: "social/3-1",
    visuals: [
      layers("Definitions", "stack", [["Prejudice", "Affect: negative feeling towards a group"], ["Stereotype", "Cognition: beliefs about the group"], ["Discrimination", "Behaviour: unfair treatment"]]),
      chain("Social identity theory", [["Categorisation", "Us and them"], ["Identification", "Group becomes part of the self"], ["Comparison", "Our group against theirs"], ["Positive distinctiveness", "Ingroup favouritism"]]),
    ],
    ref: "Allport 1954; Adorno et al 1950; Altemeyer 1981; Pratto et al 1994; Devine 1989; Sherif et al 1961 Robbers Cave; Tajfel 1970, Tajfel and Turner 1979; Thorat and Attewell 2007; Hoff and Pandey 2006; social module 3.1",
  },
  {
    id: "soc-l03-007",
    subject: S,
    topic: "prejudice",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "How can prejudice be reduced? Discuss the contact hypothesis, cooperative learning and other interventions, with evidence and Indian applications.",
    plan: ["Why reduction matters", "Contact hypothesis and its conditions", "Evidence and extended contact", "Cooperative learning: jigsaw", "Recategorisation and other methods", "Indian applications"],
    answer: `## Why it matters
Prejudice harms through discrimination, segregation and violence. Psychology offers tested ways to reduce it, based on the theories of its causes.

## The contact hypothesis
Gordon Allport proposed in 1954 that contact between groups reduces prejudice, but only under four conditions:
1. Equal status within the situation.
2. Common goals.
3. Intergroup cooperation, not competition.
4. Support of authorities, law or custom.
Later work added that the contact should allow friendship to develop.

## Evidence
- Thomas Pettigrew and Linda Tropp's meta analysis of 515 studies in 2006 found that contact reduced prejudice in the great majority, with a modest average effect. Contact helped even when Allport's conditions were not all met, though effects were larger when they were.
- Contact works mainly by reducing anxiety about the outgroup and increasing empathy, more than by increasing knowledge.
- Extended contact: knowing that a member of one's group has an outgroup friend also reduces prejudice. Imagined contact, picturing a positive interaction, has small effects.
- Negative contact can increase prejudice, so quality matters.

## Cooperative learning: the jigsaw classroom
Elliot Aronson developed the jigsaw classroom in 1971 in Austin, Texas, after schools were desegregated and conflict rose. Each child in a mixed group learns one part of a lesson and teaches it to the others; everyone depends on everyone. Children in jigsaw classes liked each other more, had higher self esteem and, for minority children, better results.

## Recategorisation and other methods
- Common ingroup identity model: Samuel Gaertner and John Dovidio showed that recategorising "us" and "them" into a larger "we", for example as Indians rather than Hindus and Muslims, reduces bias. A dual identity, keeping both, often works best.
- Superordinate goals, as in Robbers Cave.
- Education and perspective taking, such as reading stories from an outgroup member's view.
- Changing norms: people adjust prejudice to what they think others approve; leaders and media can shift norms.
- Laws against discrimination change behaviour, and attitudes often follow, as dissonance theory predicts.
- Self regulation: people who become aware of their bias and are motivated can control it.
- Implicit bias trainings show small, short lived effects on associations and little effect on behaviour, so they should not be relied on alone.

## Why some interventions fail
- Contact that is forced, unequal or competitive can confirm stereotypes, as when groups meet only in conflict.
- When a friendly outgroup member is seen as an exception, the stereotype of the group stays intact, so the person should be seen as typical of the group for change to spread.
- Interventions in one setting, such as a classroom, may not carry over to the neighbourhood unless norms there also change.
- Strong threats, such as riots or economic crises, can undo gains quickly.

## Indian applications
- Mixed schools and hostels with equal status and shared tasks can reduce caste and religious prejudice.
- A field experiment in Uttar Pradesh cricket leagues by Matt Lowe found that playing on mixed caste teams increased cross caste friendships and reduced discrimination in choosing teammates, while merely playing against other castes did not.
- Ashutosh Varshney found that Indian cities with strong Hindu Muslim civic associations, such as business and trade groups, had fewer riots than cities without them.
- Mohalla committees in Mumbai after the 1992 to 1993 riots brought police and residents of both communities together.

## Conclusion
Prejudice can be reduced by the right kind of contact: equal, cooperative, supported and personal. Cooperative learning, shared identities and changing norms add to this, and Indian field evidence supports these methods.`,
    keyPoints: ["Allport's four conditions", "Pettigrew and Tropp 2006: 515 studies", "Anxiety reduction and empathy as mechanisms", "Extended and imagined contact; negative contact", "Jigsaw classroom", "Common ingroup identity and dual identity", "Norms, law and limits of bias training", "Indian evidence: mixed caste cricket, civic associations"],
    pitfalls: ["Saying any contact reduces prejudice", "No evidence or Indian applications"],
    module: "social/3-2",
    visuals: [
      layers("The contact hypothesis", "stack", [["Equal status", "Within the contact situation"], ["Common goals", "Shared purpose"], ["Cooperation", "Not competition"], ["Institutional support", "Authorities, law, custom"], ["Friendship potential", "Personal acquaintance"]]),
      compare("Indian applications", ["Played against other castes", ["Contact as opponents", "Competition, not cooperation", "No gain in cross caste friendship"], "Mere contact"], ["Played on mixed caste teams", ["Shared goal of winning", "Equal status as teammates", "More cross caste friendships, less discrimination"], "Cooperative contact"]),
    ],
    ref: "Allport 1954; Pettigrew and Tropp 2006; Turner et al 2007 extended contact; Aronson et al 1978 jigsaw; Gaertner and Dovidio 2000; Lowe 2021 caste cricket leagues; Varshney 2002 Ethnic Conflict and Civic Life; social module 3.2",
  },
  {
    id: "soc-l03-008",
    subject: S,
    topic: "prosocial-bystander",
    marks: 15,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "What is the bystander effect? Describe Latane and Darley's decision model with supporting experiments, and discuss when bystanders do help.",
    plan: ["The Kitty Genovese case", "The five step model", "Experiments", "Other models: arousal cost reward", "When bystanders help; Indian examples"],
    answer: `## The case that started it
In March 1964, Kitty Genovese was stabbed to death outside her apartment in New York. A newspaper reported that 38 neighbours watched and did nothing. Later investigation showed the number was exaggerated and some did call for help, but the story led Bibb Latane and John Darley to ask why people fail to help in emergencies when others are present.

## The bystander effect
The bystander effect is the finding that the presence of other people reduces the likelihood that any one person will help in an emergency, and slows helping.

## The five step decision model
1. Notice the event.
2. Interpret it as an emergency.
3. Assume responsibility for helping.
4. Know how to help.
5. Decide to help.
Failure at any step means no help.

## Experiments
- Smoke filled room, 1968: students filling in questionnaires saw smoke pour into the room. Alone, 75 per cent reported it within six minutes; with two passive confederates, only 10 per cent did. This shows pluralistic ignorance at step 2: each looks at others' calm faces and concludes there is no emergency.
- Seizure study, 1968: students talking over an intercom heard another participant have an apparent epileptic seizure. When they believed they were the only listener, 85 per cent sought help before the seizure ended; when they believed four others could hear, only 31 per cent did. This shows diffusion of responsibility at step 3.
- Good Samaritan study, 1973: John Darley and Daniel Batson asked seminary students to give a talk, some on the parable of the Good Samaritan. On the way they passed a slumped man. Of those not in a hurry, 63 per cent helped; of those in a great hurry, 10 per cent. Time pressure mattered more than the topic.

## Arousal cost reward model
Jane Piliavin and colleagues, after a subway study in which a man collapsed in a train carriage, proposed that seeing an emergency creates unpleasant arousal, which people reduce by the cheapest route. They weigh the costs of helping, such as danger or effort, against the costs of not helping, such as guilt or blame. In the subway, a man with a cane was helped quickly and often, even by many bystanders, because the situation was clear and costs low.

## When bystanders help
- A meta analysis by Peter Fischer and colleagues in 2011 found that the bystander effect is weaker in clearly dangerous emergencies, because they are recognised quickly and others may be needed to help.
- Analysis of real public conflicts captured on CCTV in three countries by Richard Philpot and colleagues found that in about 90 per cent of incidents at least one bystander intervened, and more bystanders made intervention more likely.
- Helping rises when the victim is similar or from one's ingroup, when bystanders know each other, when someone is directly asked, and when people have training.

## Indian examples
Road accident victims in India have often been left untreated because bystanders feared police harassment and court visits. The Supreme Court in 2016 gave force to guidelines protecting good Samaritans who help accident victims, and the Motor Vehicles Amendment Act 2019 added protection in law. This reduces the costs of helping, as the arousal cost reward model would predict.

## Reducing the effect
- Teach the five steps, as in bystander training programmes.
- If you need help, point to a specific person and ask them directly.
- Remove legal and social costs of helping.

## Conclusion
Bystanders fail to help mainly because of pluralistic ignorance and diffusion of responsibility, but in clear, dangerous situations groups often do help. Understanding the steps allows us to design interventions.`,
    keyPoints: ["Genovese case and its exaggeration", "Definition of the bystander effect", "Five step model", "Smoke filled room: 75 versus 10 per cent", "Seizure study: 85 versus 31 per cent", "Good Samaritan: hurry matters", "Arousal cost reward model", "Fischer 2011 and CCTV evidence; Indian good Samaritan law"],
    pitfalls: ["Presenting the 38 witnesses as fact", "Mixing up pluralistic ignorance and diffusion of responsibility"],
    module: "social/3-3",
    visuals: [
      chain("The five step decision model", [["Notice", "Hurry and distraction block it"], ["Interpret as emergency", "Pluralistic ignorance"], ["Take responsibility", "Diffusion of responsibility"], ["Know how to help", "Skills and training"], ["Decide to help", "Costs and rewards"]]),
      vis("experiment", { title: "Experiments", question: "Percentage who helped or reported", unit: "%", conditions: [{ label: "Smoke, alone", value: 75 }, { label: "Smoke, two passive others", value: 10 }, { label: "Seizure, sole listener", value: 85 }, { label: "Seizure, four others", value: 31 }], why: "Others make each person less likely to act." }),
    ],
    ref: "Latane and Darley 1968, 1970; Darley and Latane 1968; Darley and Batson 1973; Piliavin, Rodin and Piliavin 1969; Fischer et al 2011; Philpot et al 2020; Savelife Foundation v Union of India 2016; MV Amendment Act 2019 s 134A; social module 3.3",
  },
  {
    id: "soc-l03-009",
    subject: S,
    topic: "prosocial-bystander",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Why do people help? Compare evolutionary, social exchange, empathy altruism and norm based explanations of prosocial behaviour.",
    plan: ["Definitions", "Evolutionary explanations", "Social exchange and negative state relief", "Empathy altruism", "Norms and culture", "Conclusion"],
    answer: `## Definitions
Prosocial behaviour is any action intended to benefit another. Altruism is helping motivated by concern for the other's welfare, without expectation of reward. The central debate is whether true altruism exists.

## Evolutionary explanations
- Kin selection: William Hamilton in 1964 argued that helping relatives spreads shared genes. Hamilton's rule says helping is favoured when the genetic relatedness times the benefit exceeds the cost. People help close kin more, especially in life or death situations.
- Reciprocal altruism: Robert Trivers in 1971 proposed that helping non relatives pays when the favour will be returned, which requires repeated contact and memory for cheaters.
- Group selection and cultural evolution: cooperative groups may outcompete selfish ones.

## Social exchange and egoism
- Social exchange theory says people help when the rewards, such as praise, self esteem or reciprocity, outweigh the costs.
- The negative state relief model, by Robert Cialdini, says people help to relieve their own sadness or guilt. Sad people help more unless their mood is lifted another way first.
Both imply that helping is ultimately selfish.

## Empathy altruism
Daniel Batson proposed that when we feel empathic concern for someone, we help for their sake, even when escape is easy. In a famous study, students watched "Elaine" receive shocks and could take her place. Those low in empathy left when escape was easy; those high in empathy took her place whether escape was easy or hard. Batson argued this shows true altruism. Critics, such as Cialdini, suggest that empathy produces a sense of oneness with the other, so helping them is partly helping oneself.

## Norms and culture
- Reciprocity norm: we should help those who helped us.
- Social responsibility norm: we should help those who depend on us.
- In India, dharma, seva and daan encourage giving and service, such as langar at gurudwaras, where free food is served to all.
- Joan Miller found that Indians, more than Americans, saw helping friends and strangers in moderate need as a moral duty, not a personal choice.

## Comparison
| Explanation | Motive | Best evidence |
| Kin selection | Gene survival | More help to close relatives |
| Reciprocal altruism | Future return | Cooperation in repeated games |
| Social exchange | Rewards outweigh costs | Helping falls as costs rise |
| Negative state relief | Relieve own distress | Mood effects on helping |
| Empathy altruism | Other's welfare | High empathy helps even when escape is easy |
| Norms | Duty | Cultural differences |

## Conclusion
People help for many reasons. Evolution prepares us, rewards and costs shape choices, norms guide us, and empathy can produce genuine concern for others.`,
    keyPoints: ["Prosocial behaviour versus altruism", "Kin selection and Hamilton's rule", "Reciprocal altruism", "Social exchange and negative state relief", "Batson's empathy altruism and the Elaine study", "Oneness critique", "Norms and Indian ideas of seva and dharma", "Miller's cross cultural findings"],
    pitfalls: ["Only one theory", "No evaluation of whether altruism exists"],
    module: "social/3-3",
    visuals: [compare("Empathy altruism", ["Egoistic view", ["Help to get rewards", "Help to relieve own distress", "Leave if escape is easy"], "Helping serves the self"], ["Empathy altruism", ["Empathic concern for the other", "Help even when escape is easy", "Goal is the other's welfare"], "True altruism exists"])],
    ref: "Hamilton 1964; Trivers 1971; Cialdini et al 1973, 1997; Batson et al 1981; Miller, Bersoff and Harwood 1990; social module 3.3",
  },
  {
    id: "soc-l03-010",
    subject: S,
    topic: "aggression",
    marks: 20,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Define aggression and distinguish its types. Critically evaluate biological, frustration aggression, social learning and the general aggression model as explanations of human aggression.",
    plan: ["Definition and types", "Instinct and biological theories", "Frustration aggression and Berkowitz", "Social learning: Bandura", "General aggression model and situational factors", "Evaluation"],
    answer: `## Definition and types
Aggression is behaviour intended to harm another person who wishes to avoid that harm. Accidental harm is not aggression; intent is the key.
- Hostile or reactive aggression is driven by anger and aims at harm, such as hitting someone in a road rage incident.
- Instrumental or proactive aggression is a means to another goal, such as a robber injuring a shopkeeper to get money.
- Direct aggression is face to face; indirect or relational aggression harms through spreading rumours or social exclusion, more common among girls.
Violence is extreme physical aggression.

## Instinct theories
- Sigmund Freud proposed a death instinct, thanatos, whose energy is turned outward as aggression.
- Konrad Lorenz, from animal studies, held that aggressive energy builds up and must be released, a hydraulic model.
- Both predict that release, or catharsis, reduces aggression. Evidence contradicts this: Brad Bushman found that people who hit a punching bag while thinking of someone who insulted them later behaved more aggressively.

## Biological factors
- Brain: the amygdala detects threat; the prefrontal cortex restrains impulses. Reduced prefrontal activity has been found in some violent offenders.
- Hormones: testosterone is modestly linked to aggression and dominance; low cortisol is linked to some antisocial behaviour.
- Neurotransmitters: low serotonin activity is associated with impulsive aggression.
- Genes: twin studies suggest moderate heritability of antisocial behaviour. Avshalom Caspi and colleagues found that a low activity variant of the MAOA gene increased antisocial behaviour mainly in boys who had been maltreated, a gene environment interaction.
- Alcohol lowers inhibition and narrows attention, and is involved in a large share of violent crimes, including domestic violence in India.

## Frustration aggression
- John Dollard and colleagues in 1939 proposed that frustration, the blocking of a goal, always leads to aggression, and aggression always comes from frustration. Aggression may be displaced onto safer targets, such as scapegoats.
- This was too strong. Leonard Berkowitz revised it: frustration produces negative affect and a readiness to aggress, which is more likely to become aggression when aggressive cues are present. In the weapons effect study of 1967, angered men gave more shocks when a gun lay nearby than when badminton racquets did.

## Social learning
Albert Bandura's Bobo doll studies of 1961 and 1963 showed that children who watched an adult punch and kick an inflatable doll copied the exact acts. Imitation was greater when the model was rewarded, less when punished, but all children could reproduce the acts when offered rewards, showing that learning and performance differ. Aggression is learned through observation, reinforcement and self efficacy, from family, peers and media. Children growing up amid violence, such as domestic abuse or armed conflict, show more aggression.

## The general aggression model
Craig Anderson and Brad Bushman's general aggression model integrates these ideas:
1. Inputs: person factors, such as hostile traits, beliefs and alcohol, and situational factors, such as provocation, heat, pain, crowding, weapons and violent media.
2. Present internal state: hostile thoughts, angry feelings and arousal.
3. Appraisal: automatic interpretation of the situation, followed, if resources allow, by more careful reappraisal.
4. Outcome: thoughtful or impulsive action, which then feeds back into future inputs.
Repeated exposure to violence builds aggressive knowledge structures and desensitisation.

## Situational factors
- Heat: violent crime rises in hotter months and cities.
- Provocation is the strongest single trigger.
- Excitation transfer: Dolf Zillmann showed arousal from exercise can be misattributed and intensify anger.
- Deindividuation and group norms.

## Evaluation
| Theory | Strength | Weakness |
| Instinct | Recognises biological roots | Catharsis prediction fails |
| Biological | Brain and gene evidence | Effects small, depend on environment |
| Frustration aggression | Explains displacement | Frustration does not always lead to aggression |
| Social learning | Strong experimental support | Bobo doll is not a person; short term |
| General aggression model | Integrates all levels | Broad, hard to test as a whole |

## Indian perspective
Research on aggression in India has looked at domestic violence, communal riots, ragging and road rage. Patriarchal norms that justify wife beating, measured in national family health surveys, show the role of learned beliefs.

## Conclusion
Aggression arises from interacting biological dispositions, learned beliefs and situational triggers. The general aggression model is the most complete account and points to prevention at each level.`,
    keyPoints: ["Definition stressing intent", "Hostile versus instrumental, direct versus relational", "Freud, Lorenz and the failure of catharsis", "Brain, hormones, serotonin, MAOA and maltreatment", "Frustration aggression and Berkowitz's revision, weapons effect", "Bandura's Bobo doll studies", "General aggression model: inputs, state, appraisal, outcome", "Comparative evaluation"],
    pitfalls: ["Saying catharsis reduces aggression", "Describing Bobo doll without learning versus performance"],
    module: "social/3-4",
    visuals: [
      fig("bobo-doll", "Social learning: Bandura's Bobo doll set up"),
      chain("The general aggression model", [["Inputs", "Person and situation"], ["Internal state", "Thoughts, feelings, arousal"], ["Appraisal", "Automatic, then reappraisal"], ["Action", "Thoughtful or impulsive"], ["Feedback", "Shapes future inputs"]]),
    ],
    ref: "Freud 1920; Lorenz 1966; Bushman 2002 catharsis; Caspi et al 2002 MAOA; Dollard et al 1939; Berkowitz 1989, Berkowitz and LePage 1967; Bandura, Ross and Ross 1961, 1963; Anderson and Bushman 2002; Zillmann 1971; NFHS-5; social module 3.4",
  },
]);
