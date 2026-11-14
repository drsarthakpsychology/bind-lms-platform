import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, layers, timeline, tree, vis } from "./visual";

const S = "social" as const;

export const SOCIAL_L04: LongQA[] = anchored([
  {
    id: "soc-l04-001",
    subject: S,
    topic: "aggression",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Does media violence cause aggression? Evaluate the evidence and discuss ways of reducing aggression in society.",
    plan: ["The debate", "Types of evidence", "Mechanisms", "Criticisms", "Reducing aggression"],
    answer: `## The debate
Children in India now watch violent films, web series and online games for many hours a week. The question whether this raises aggression has divided researchers and policy makers for decades.

## Types of evidence
1. Laboratory experiments: after brief exposure to violent films or games, participants show more aggressive thoughts, feelings and behaviour, such as giving louder noise blasts to an opponent.
2. Field experiments: in some studies, boys in residential institutions who watched violent films for a week were more aggressive in daily life than those who watched neutral films.
3. Longitudinal studies: Leonard Eron and Rowell Huesmann followed children in New York from age 8 and found that heavy viewing of violent television at 8 predicted aggression and criminal acts at 19 and 30, even controlling for initial aggression.
4. Meta analyses: Craig Anderson and colleagues in 2010 combined about 130 studies of violent video games from the West and Japan and found small but reliable effects on aggressive behaviour, cognition and affect, and lower empathy.

## Mechanisms
- Observational learning of aggressive scripts.
- Priming of aggressive thoughts.
- Arousal.
- Desensitisation: repeated exposure dulls emotional and physiological responses to violence.
- Hostile attribution bias: seeing others' ambiguous acts as hostile.

## Criticisms
- Effect sizes are small, and some researchers, such as Christopher Ferguson, argue they shrink further with better controls and may reflect publication bias.
- Laboratory measures of aggression, such as noise blasts, are far from real violence.
- Youth violence fell in several countries while violent game sales rose.
- Effects may be larger in children with other risk factors, such as family violence.
The balanced view is that media violence is one of many risk factors, with a small effect that matters at population level.

## Reducing aggression
- Punishment works only when it is prompt, certain and seen as fair; harsh punishment models aggression.
- Catharsis does not work; venting anger by hitting things increases aggression.
- Teaching social skills, anger management and problem solving, as in school programmes.
- Cognitive interventions to reduce hostile attribution bias.
- Parenting programmes that reduce harsh discipline.
- Reducing triggers: alcohol control, gun control, cooling in hot cities.
- Media literacy and age ratings, such as the certification of films in India.
- Exposure to prosocial models and media.

## Conclusion
Media violence has a small but real effect on aggression. It is best addressed with other risk factors through skills, parenting and environmental changes rather than by catharsis.`,
    keyPoints: ["Laboratory, field, longitudinal and meta analytic evidence", "Eron and Huesmann longitudinal findings", "Anderson 2010 meta analysis: small reliable effects", "Mechanisms: learning, priming, arousal, desensitisation", "Critique: small effects, measures, trends", "Catharsis does not work", "Skills, parenting, environment, media literacy"],
    pitfalls: ["Claiming media is the main cause of violence", "Recommending venting"],
    module: "social/3-4",
    visuals: [layers("Mechanisms", "stack", [["Learning", "Copying aggressive scripts"], ["Priming", "Aggressive thoughts become accessible"], ["Arousal", "Excitement spills over"], ["Desensitisation", "Less distress at violence"]])],
    ref: "Huesmann and Eron 1984, Huesmann et al 2003; Anderson et al 2010 meta-analysis; Ferguson 2015; Bushman 2002 catharsis; social module 3.4",
  },
  {
    id: "soc-l04-002",
    subject: S,
    topic: "interpersonal-attraction",
    marks: 15,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "What factors determine interpersonal attraction? Discuss proximity, familiarity, similarity, physical attractiveness and reciprocity with research evidence, and comment on attraction in the Indian context.",
    plan: ["Definition", "Proximity and mere exposure", "Similarity", "Physical attractiveness and matching", "Reciprocity and arousal", "Indian context and theories"],
    answer: `## Definition
Interpersonal attraction is a positive attitude towards another person, leading to a wish to be near them. It ranges from liking a neighbour to romantic love. Several factors predict who we come to like.

## Proximity
Leon Festinger, Stanley Schachter and Kurt Back studied married students in the Westgate West housing at MIT in 1950. Residents were most likely to become friends with neighbours next door, and people living near stairways and mailboxes had more friends. Proximity works because it increases chances of contact and familiarity, and because we expect to keep interacting with nearby people. Online contact now creates a form of virtual proximity.

## Familiarity and mere exposure
Robert Zajonc showed in 1968 that repeated exposure to neutral stimuli, such as Chinese characters or faces, increases liking, even when people do not consciously recognise them. Theodore Mita found people preferred mirror images of their own faces, the view they see daily, while friends preferred the true image. Familiarity breeds liking unless the first impression is negative.

## Similarity
- Donn Byrne's bogus stranger studies found that liking rose with the proportion of a stranger's attitudes that matched one's own.
- Theodore Newcomb's study of students in a boarding house found that students who were similar in attitudes became friends.
- Similarity in age, education, religion and values predicts friendship and marriage. Complementarity of needs, the idea that opposites attract, has little support.
- Similarity is rewarding because it validates our views and predicts smooth interaction.

## Physical attractiveness
- Elaine Walster and colleagues' computer dance study of 1966 at the University of Minnesota randomly paired students. The only predictor of wanting to date the partner again was the partner's physical attractiveness, not intelligence or personality.
- The halo effect, "what is beautiful is good", leads people to assume attractive people are also kind and capable.
- Faces that are symmetrical and average looking are rated attractive across cultures.
- The matching hypothesis: in real choices, people tend to pair with partners of similar attractiveness, partly from fear of rejection.

## Reciprocity and arousal
- We like people who like us, especially if they are discriminating.
- Arousal can be misattributed to attraction. Donald Dutton and Arthur Aron in 1974 had an attractive woman approach men on a high, swaying suspension bridge or a low stable bridge. More men on the fear arousing bridge called her later and wrote sexual imagery in stories.

## Theories
- Reward theory: we like those who reward us, directly or by association.
- Social exchange and equity: relationships last when rewards exceed costs and contributions feel fair.
- Evolutionary theory: preferences reflect cues to health and fertility.

## Online attraction
Dating and matrimonial apps change the order of these factors. Photographs make physical attractiveness the first filter, profile details allow quick checks of similarity, and repeated messaging creates familiarity before any meeting. Research suggests that people overrate how much they value listed traits compared with how they actually choose after meeting.

## Indian context
- In India many marriages are arranged, with families weighing caste, religion, education, family background and horoscopes, which reflect similarity at a social level.
- Skin colour bias, seen in matrimonial advertisements and the popularity of fairness creams, shows how cultural norms shape judgements of attractiveness.
- Research by Usha Gupta and Pushpa Singh in Jaipur in 1982 suggested that love tended to grow over the years in arranged marriages and decline in love marriages, though the sample was small.
- Matrimonial apps add online proximity and filters for similarity.

## Conclusion
We are attracted to those who are near, familiar, similar, physically attractive and who like us back. Culture shapes how these factors operate, especially in Indian marriage choices.`,
    keyPoints: ["Definition of attraction", "Westgate study on proximity", "Mere exposure and mirror image study", "Similarity: Byrne and Newcomb; complementarity weak", "Computer dance study and halo effect", "Matching hypothesis", "Reciprocity and the bridge study", "Indian context: arranged marriage, colour bias"],
    pitfalls: ["Saying opposites attract", "No research evidence"],
    module: "social",
    visuals: [
      tree("Factors in attraction", [["Interpersonal attraction", "Who we like", -1], ["Proximity", "Westgate housing study", 0], ["Familiarity", "Mere exposure", 0], ["Similarity", "Attitudes, values, background", 0], ["Physical attractiveness", "Computer dance study", 0], ["Reciprocity", "We like those who like us", 0]], "Theories: the main factors"),
      compare("Reciprocity and arousal", ["Low stable bridge", ["Little fear", "Fewer calls to the interviewer", "Little sexual imagery"], "No arousal to misattribute"], ["High swaying bridge", ["Fear arousal", "More men called her", "More sexual imagery"], "Arousal misread as attraction"]),
    ],
    ref: "Festinger, Schachter and Back 1950; Zajonc 1968; Mita, Dermer and Knight 1977; Byrne 1971; Newcomb 1961; Walster et al 1966; Dion, Berscheid and Walster 1972; Dutton and Aron 1974; Gupta and Singh 1982; social module",
  },
  {
    id: "soc-l04-003",
    subject: S,
    topic: "interpersonal-attraction",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Describe Sternberg's triangular theory of love and adult attachment styles in close relationships. How do relationships last or end?",
    plan: ["Love as a psychological topic", "Sternberg's three components and types", "Adult attachment styles", "Investment and maintenance", "Endings"],
    answer: `## Studying love
Love was once thought too mysterious to study, but research since the 1970s has measured it, described its forms and predicted how long relationships last.

## Sternberg's triangular theory
Robert Sternberg in 1986 proposed that love has three components:
1. Intimacy: closeness, warmth and sharing.
2. Passion: physical attraction and arousal.
3. Commitment: the decision to maintain the relationship.
Combinations give different kinds of love:
| Intimacy | Passion | Commitment | Kind of love |
| Yes | No | No | Liking |
| No | Yes | No | Infatuation |
| No | No | Yes | Empty love |
| Yes | Yes | No | Romantic love |
| Yes | No | Yes | Companionate love |
| No | Yes | Yes | Fatuous love |
| Yes | Yes | Yes | Consummate love |
Passion usually rises fast and fades, intimacy grows slowly and commitment builds over time. Many arranged marriages in India begin with commitment, from which intimacy and passion may develop.

## Adult attachment styles
Cindy Hazan and Phillip Shaver in 1987 applied John Bowlby's attachment theory to adult love. In a newspaper survey, adults described themselves as:
- Secure, about 56 per cent: comfortable with closeness and trusting.
- Avoidant, about 25 per cent: uncomfortable with closeness.
- Anxious ambivalent, about 19 per cent: wanting closeness but fearing abandonment.
Later work described two dimensions, anxiety and avoidance, yielding secure, preoccupied, dismissing and fearful styles. Secure adults have longer, more satisfying relationships.

## How relationships last
- Caryl Rusbult's investment model says commitment depends on satisfaction, the quality of alternatives and investments such as time, children and shared property.
- Equity: relationships feel better when rewards and contributions are fair to both.
- Self disclosure increases intimacy, gradually.
- John Gottman found that couples who stay together have at least about five positive interactions for each negative one, and that contempt, criticism, defensiveness and stonewalling predict divorce.

## Endings
Rusbult described four responses to dissatisfaction: exit, voice, loyalty and neglect. Voice and loyalty are constructive. Steve Duck described stages of breakdown from private dissatisfaction to telling others and grave dressing, the story one tells afterwards.

## Conclusion
Love combines intimacy, passion and commitment, shaped by attachment history. Relationships last when partners are satisfied, invested and handle conflict constructively.`,
    keyPoints: ["Three components of love", "Seven kinds including consummate and companionate", "Different time courses", "Hazan and Shaver 1987 styles", "Two dimension model", "Rusbult's investment model", "Gottman's predictors", "Responses to dissatisfaction and breakdown stages"],
    pitfalls: ["Listing types without components", "Ignoring attachment"],
    module: "social",
    visuals: [layers("Sternberg's triangular theory", "pyramid", [["Commitment", "The decision to stay"], ["Passion", "Attraction and arousal"], ["Intimacy", "Closeness and sharing, the base"]])],
    ref: "Sternberg 1986; Hazan and Shaver 1987; Bartholomew and Horowitz 1991; Rusbult 1983; Gottman 1994; Duck 1982; social module",
  },
  {
    id: "soc-l04-004",
    subject: S,
    topic: "indian-social-psychology",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Trace the development of social psychology in India. Discuss the contributions of Indian social psychologists and the move towards indigenisation and social relevance.",
    plan: ["Beginnings under Western influence", "Early work: rumour and social tension", "Growth after independence", "Indigenisation and relevance", "Key Indian contributions", "Critique and future"],
    answer: `## Beginnings
Psychology in India began with the department at Calcutta University in 1915, under N N Sengupta, who had trained in experimental psychology. Early social psychology largely copied Western topics and methods, testing American findings on Indian students. Girishwar Misra and others later described this as an imitative phase.

## Early landmarks
- Jamuna Prasad studied rumours that spread after the great Bihar earthquake of 1934, such as predictions of further disasters. Leon Festinger later noted that people spread rumours that justified their anxiety, an observation that helped lead to cognitive dissonance theory.
- In the 1950s UNESCO supported Gardner Murphy's project on social tensions in India, which brought attention to communal and caste relations.
- Research on caste attitudes, stereotypes and social distance became common, using adapted Western scales.

## Growth after independence
- Departments expanded, and the Indian Council of Social Science Research, set up in 1969, funded surveys of research.
- Durganand Sinha surveyed the field and argued that psychology must address India's problems: poverty, deprivation, rural development, population and social change.
- Research on deprivation by Durganand Sinha, Ajit Mohanty, Girishwar Misra and others studied how poverty and social disadvantage affect cognition, motivation and personality.
- Udai Pareek worked on organisational and rural development, including motivating entrepreneurs.

## Indigenisation
By the 1970s and 1980s, scholars criticised the borrowed nature of Indian psychology. Durganand Sinha described indigenisation in stages:
1. Exogenous indigenisation: adapting Western concepts and tools to India.
2. Endogenous indigenisation: building theories from Indian culture, philosophy and life.
J B P Sinha and others developed concepts rooted in Indian social life, and later writers such as Ashis Nandy and Sudhir Kakar examined Indian identity, family and colonial experience.

## Key contributions
| Researcher | Contribution |
| Jamuna Prasad | Rumour study after the 1934 earthquake |
| Durganand Sinha | Indigenisation, social relevance, rural development |
| J B P Sinha | Nurturant task leader, work culture |
| Udai Pareek | Organisational roles, achievement motivation training |
| Ajit Dalal | Health beliefs, attribution of illness, disability |
| Girishwar Misra | Deprivation, cultural psychology, Indian concepts of self |
Indian research has also examined collectivism and individualism, showing that Indians hold both orientations depending on context, the idea that the Indian self is relational, and attributions of illness to karma, fate and God, studied by Ajit Dalal.

## Indian concepts studied
- The relational self: Indians describe themselves through family, caste, region and roles more than through private traits, and the same person may act independently at work and interdependently at home. Writers describe this as context sensitivity rather than a fixed collectivism.
- Karma and fate in attribution: Ajit Dalal found that patients and families often explain illness and recovery through karma, God and fate alongside medical causes, and that such beliefs can help acceptance but may delay treatment.
- Family and hierarchy: Sudhir Kakar's work on the Indian family and childhood describes close mother child bonds and respect for elders, which shape later relationships and the way authority is seen.
- Dharma and duty: studies of moral reasoning, such as Joan Miller's, found that Indians treat helping family and friends as a moral duty rather than a personal choice.
- Guru shishya and nurturant leadership: personalised, respectful relationships with those in authority are linked to J B P Sinha's leadership model.

## Social relevance
- Studies of caste and religious prejudice, and of intergroup contact.
- Work on gender, dowry and violence against women.
- Health promotion, such as sanitation and family planning campaigns.
- Disaster studies after cyclones and the 2004 tsunami.
- Research on communal riots and peace.

## Critique and future
- Much research still uses student samples and Western scales.
- Indigenous concepts are often philosophical and need empirical testing.
- Funding and publication pressures push researchers towards Western journals' topics.
- Future directions include combining indigenous concepts with rigorous methods, open science and large Indian samples.

## Conclusion
Indian social psychology has moved from imitation, through a search for relevance, to building culturally grounded theory. Its challenge is to combine indigenous insight with strong evidence.`,
    keyPoints: ["Calcutta 1915 and the imitative phase", "Jamuna Prasad's rumour study and its link to dissonance", "UNESCO social tensions project", "Durganand Sinha and relevance", "Exogenous and endogenous indigenisation", "J B P Sinha, Pareek, Dalal, Misra", "Socially relevant topics", "Critique and future"],
    pitfalls: ["Only listing names", "No critique"],
    module: "social/3-5",
    visuals: [
      timeline("Put the milestones in order", [["Calcutta University department", "1915"], ["Bihar earthquake rumour study", "1934"], ["UNESCO social tensions project", "1950s"], ["ICSSR set up", "1969"], ["Call for indigenisation", "1970s to 1980s"]], "From imitation to relevance to indigenous theory."),
      chain("Indigenisation", [["Imitation", "Western topics and scales"], ["Exogenous indigenisation", "Adapt Western tools"], ["Endogenous indigenisation", "Theories from Indian life"], ["Integration", "Indian concepts tested rigorously"]]),
    ],
    ref: "Sinha D 1986 Psychology in a Third World Country; Prasad J 1935, 1950; Festinger 1957 on Prasad; Murphy 1953 In the Minds of Men; Sinha JBP 1980; Pareek; Dalal; Misra; social module 3.5",
  },
  {
    id: "soc-l04-005",
    subject: S,
    topic: "indian-social-psychology",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "cuet-pg"],
    question: "Discuss caste as a social psychological phenomenon. What has research shown about caste prejudice, identity and its effects in India?",
    plan: ["Caste in social psychological terms", "Stereotypes and social distance", "Discrimination evidence", "Stereotype threat and identity", "Change and reduction"],
    answer: `## Caste as a social psychological phenomenon
Caste is a system of hereditary groups ranked by ideas of purity and pollution. Although untouchability was abolished by Article 17 of the Constitution and discrimination is outlawed, caste continues to shape identity, marriage, work and politics. Social psychology studies it through stereotypes, prejudice, identity and intergroup relations.

## Stereotypes and social distance
Early Indian studies using adapted social distance scales found that people preferred closer relations with members of their own and higher castes, and accepted lower castes less readily for intimate relations such as marriage or sharing food. Stereotypes linked castes to traits like intelligence or cleanliness.

## Evidence of discrimination
- Field experiments sending identical job applications with upper caste, Dalit and Muslim names to private firms found that Dalit and Muslim applicants received fewer interview calls.
- National surveys show that a substantial share of households admit to practising untouchability in some form, such as not allowing Dalits into kitchens.
- Inter caste marriages remain a small minority, around 5 per cent in national surveys.
- Crimes against Scheduled Castes are recorded in thousands each year by the National Crime Records Bureau.

## Stereotype threat and identity
- Karla Hoff and Priyanka Pandey found that low caste boys in Uttar Pradesh solved mazes as well as high caste boys when caste was not revealed, but worse when caste was announced in public. Making caste salient reduced performance, a form of stereotype threat.
- Social identity theory explains both pride and mobilisation among lower castes, such as the movement led by B R Ambedkar, and attempts at upward mobility through sanskritisation, a term coined by M N Srinivas for adopting upper caste customs.
- Hidden caste identities in cities may reduce some discrimination but not marriage preferences.

## Change and reduction
- Reservation in education and jobs increased representation and contact.
- Urbanisation and education weaken some practices.
- Contact under equal status, such as mixed teams, reduces bias.
- Laws such as the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act 1989 deter open violence.

## Conclusion
Caste is a living system of identity and prejudice in India, measurable in attitudes, behaviour and performance. Social psychology helps explain its persistence and points to contact, identity and structural change as remedies.`,
    keyPoints: ["Purity and pollution; Article 17", "Social distance studies", "Job callback field experiments", "Persistence of untouchability practices and low inter caste marriage", "Hoff and Pandey stereotype threat study", "Social identity, Ambedkar, sanskritisation", "Reservation, contact and law"],
    pitfalls: ["Treating caste as only history", "No research evidence"],
    module: "social/3-5",
    visuals: [compare("Stereotype threat and identity", ["Caste not announced", ["Low caste boys solve mazes as well as high caste boys", "No threat"], "Equal performance"], ["Caste announced publicly", ["Low caste boys' performance falls", "Threat of confirming a stereotype"], "Caste salience hurts performance"])],
    ref: "Constitution Art 17; Thorat and Attewell 2007; IHDS 2011-12 untouchability practice; Hoff and Pandey 2006; Srinivas 1952 sanskritisation; SC/ST (PoA) Act 1989; NCRB Crime in India; social module 3.5",
  },
  {
    id: "soc-l04-006",
    subject: S,
    topic: "social-methods",
    marks: 15,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "What is the replication crisis in social psychology? Discuss its causes, the major findings that failed or survived, and the reforms it has prompted.",
    plan: ["What replication is and the crisis", "Large scale replication projects", "Which findings failed and which held", "Causes: questionable practices and incentives", "Reforms", "Implications"],
    answer: `## Replication and the crisis
Replication means repeating a study to see whether its findings hold. Around 2011, a series of events shook confidence in social psychology: a prominent Dutch researcher, Diederik Stapel, was found to have fabricated data in dozens of papers; a widely publicised study claimed evidence for precognition using standard methods; and researchers showed how flexible analysis could make almost any result significant. This led to systematic attempts to replicate key findings.

## Large scale replication projects
- In 2015 the Open Science Collaboration attempted to replicate 100 studies from leading psychology journals. While 97 per cent of originals reported significant results, only about 36 per cent of replications did, and effect sizes were on average about half the original size. Social psychology studies replicated less often than cognitive ones.
- The Many Labs projects ran the same studies in dozens of laboratories across countries.
- Registered replication reports pooled many labs to test single effects with large samples.

## Failed or weakened
- Ego depletion, the idea that self control draws on a limited resource, failed in a 23 laboratory test in 2016.
- Power posing: expansive postures were claimed to raise testosterone and risk taking; the hormone effects did not replicate.
- Behavioural priming, such as walking more slowly after reading words about old age, has largely failed.
- The facial feedback effect of holding a pen in the teeth failed in a 17 lab test, though later work suggests small effects under some conditions.
- The Stanford prison experiment was criticised as poorly controlled rather than failed in replication.

## Survived
- Anchoring effects.
- Conformity and obedience findings in broad terms.
- The bystander effect in non dangerous situations.
- Cognitive dissonance in many paradigms.
- Ingroup favouritism and minimal group effects.

## Causes
1. Questionable research practices: p hacking, such as trying many analyses and reporting only the significant one, stopping data collection when p falls below 0.05, and excluding inconvenient participants.
2. HARKing: hypothesising after results are known.
3. Publication bias: journals preferred novel, significant results, leaving null findings in file drawers.
4. Small samples and low statistical power, which give unstable and inflated effects.
5. Incentives: careers rewarded many striking publications.
6. Hidden moderators and differences in samples and culture, which can also explain some failures.

## Reforms
- Preregistration of hypotheses, methods and analyses before data collection.
- Registered reports, where journals accept papers before results are known.
- Open data, materials and code.
- Larger samples and power analysis.
- Reporting effect sizes and confidence intervals, not just p values.
- Multi site collaborations across countries, such as the Psychological Science Accelerator, which includes Indian laboratories.
- Teaching replication in research methods courses.

## A worked example of p hacking
Suppose a student tests whether listening to music improves memory, measuring three memory tasks, with and without excluding slow responders, separately for men and women. That gives twelve possible tests. Even if music has no effect, the chance that at least one is significant at 0.05 can approach one in two. Reporting only that one result, as if it were the plan, produces a false finding that will not replicate. Preregistration prevents this by fixing the test in advance.

## Implications for India
Most influential findings came from Western student samples. Replications in India test whether effects generalise, and Indian researchers can contribute through multi site projects and open data.

## Conclusion
The replication crisis exposed weak practices, but it has made psychology more transparent and rigorous. Students should read findings critically, prefer replicated effects and adopt open science.`,
    keyPoints: ["Definition and the events around 2011", "Open Science Collaboration 2015: 36 per cent and half effect sizes", "Many Labs and registered replication reports", "Failed: ego depletion, power posing hormones, behavioural priming", "Survived: anchoring, conformity, ingroup bias", "Causes: p hacking, HARKing, publication bias, low power, incentives", "Reforms: preregistration, registered reports, open data, large samples", "Relevance to Indian samples"],
    pitfalls: ["Saying all social psychology is invalid", "No reforms"],
    module: "social/3-6",
    visuals: [
      vis("experiment", { title: "Large scale replication projects", question: "Percentage of studies with a significant result", unit: "%", conditions: [{ label: "Original studies", value: 97 }, { label: "Replications", value: 36 }], why: "Most original findings were weaker or absent on repetition." }),
      vis("sort", { prompt: "Did it replicate well?", buckets: ["Held up", "Failed or weakened"], items: [{ text: "Anchoring", bucket: 0 }, { text: "Ego depletion", bucket: 1 }, { text: "Ingroup favouritism in minimal groups", bucket: 0 }, { text: "Hormone effects of power posing", bucket: 1 }, { text: "Elderly priming slowing walking", bucket: 1 }] }, "Survived"),
    ],
    ref: "Open Science Collaboration 2015; Hagger et al 2016 ego depletion RRR; Wagenmakers et al 2016 facial feedback; Ranehill et al 2015 power posing; Simmons, Nelson and Simonsohn 2011; Bem 2011; Stapel 2011; Klein et al Many Labs; social module 3.6",
  },
  {
    id: "soc-l04-007",
    subject: S,
    topic: "applied-social",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "cuet-pg"],
    question: "Discuss personal space, density and crowding as topics in applied social psychology, with reference to Indian cities.",
    plan: ["Personal space", "Density versus crowding", "Effects of crowding", "Theories", "Indian research and applications"],
    answer: `## Personal space
Personal space is the invisible area around a person that others should not enter without permission. Edward Hall in 1966 described four zones in American culture:
| Zone | Distance | Used for |
| Intimate | Up to about 45 cm | Partners, close family |
| Personal | About 45 cm to 1.2 m | Friends |
| Social | About 1.2 to 3.6 m | Business and acquaintances |
| Public | Beyond about 3.6 m | Speeches, formal events |
Personal space varies by culture, gender, status and relationship. Contact cultures, such as those in South Asia and the Arab world, tolerate closer distances than northern Europeans. Invasion of personal space causes discomfort, arousal and moving away.

## Density and crowding
Daniel Stokols distinguished density, the physical number of people per unit area, from crowding, the subjective feeling that there are too many people. High density does not always feel crowded: a festival crowd at a cricket match may feel exciting, while a crowded office feels stressful.

## Effects of crowding
- John Calhoun's rat colonies in the 1960s, with abundant food but rising density, showed a "behavioural sink" of aggression, abnormal sexual behaviour and neglect of young.
- In humans, effects are less dramatic but crowding in homes is linked to stress, withdrawal, poorer child behaviour and family conflict, especially when people lack control or privacy.
- Prison studies link crowding to illness and violence.

## Theories
1. Stimulus overload: too much input leads people to filter, appearing unfriendly, as in Stanley Milgram's account of city life.
2. Loss of control: crowding is stressful when it limits choice and privacy.
3. Arousal and misattribution.
4. Ecological models: too many people for available roles.

## Indian research and applications
- India's cities, such as Mumbai's chawls and slums like Dharavi, have some of the world's highest densities. Indian researchers have found that crowding in the home predicts stress and lower wellbeing, but that strong family ties and coping strategies, such as time sharing of space, buffer the effects.
- Studies suggest that Indians may tolerate higher density, yet still experience crowding stress when control is lost, such as in packed local trains.
- Crowd crushes at religious gatherings and railway stations show the dangers of very high density. Understanding crowd flow and shared identity informs safer design and management of events like the Kumbh Mela.
- Architects and planners use personal space and privacy needs in designing housing, hospitals and offices.

## Conclusion
Personal space and crowding show how the physical environment shapes social behaviour. In dense Indian cities, giving people control, privacy and safe crowd management reduces harm.`,
    keyPoints: ["Definition of personal space", "Hall's four zones", "Cultural variation", "Density versus crowding", "Calhoun's rats and human effects", "Overload, control, arousal theories", "Indian housing and crowd safety"],
    pitfalls: ["Confusing density and crowding", "No Indian application"],
    module: "social/3-5",
    visuals: [layers("Personal space", "rings", [["Intimate zone", "Up to about 45 cm"], ["Personal zone", "About 45 cm to 1.2 m"], ["Social zone", "About 1.2 to 3.6 m"], ["Public zone", "Beyond about 3.6 m"]])],
    ref: "Hall 1966 The Hidden Dimension; Stokols 1972; Calhoun 1962; Milgram 1970 city life; Evans on household crowding; Indian crowding studies (Jain U); social module 3.5",
  },
  {
    id: "soc-l04-008",
    subject: S,
    topic: "social-cognition",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "How do we form impressions of other people? Discuss Asch's research on central traits and primacy, and later models of impression formation.",
    plan: ["What impression formation is", "Asch's central traits", "Primacy and recency", "Algebraic and other models", "Halo effect and thin slices"],
    answer: `## Impression formation
Impression formation is the process of combining information about a person into an overall judgement. We form impressions quickly and they shape how we treat people, from job interviews to marriage meetings.

## Asch's central traits
Solomon Asch in 1946 gave students a list of traits describing a person: intelligent, skilful, industrious, warm, determined, practical, cautious. Another group got the same list with cold instead of warm. Those who heard warm described the person as generous, happy and good natured far more often. Changing polite to blunt made little difference. Asch concluded that some traits are central, organising the whole impression, while others are peripheral. He argued for a Gestalt view: impressions are a whole, not a sum.

Harold Kelley in 1950 tested this in a real class. Students were told a guest lecturer was either rather warm or rather cold. After the same lecture, those told warm rated him more favourably and more of them took part in discussion.

## Primacy and recency
Asch also gave two lists: intelligent, industrious, impulsive, critical, stubborn, envious, and the same words in reverse. People who heard the positive words first formed a more positive impression. This primacy effect occurs because early information shapes the meaning of later information and because attention falls later. Recency effects occur when people are warned against snap judgements or when there is a delay.

## Later models
- Norman Anderson's information integration theory treats impressions as a weighted average of traits, with central traits and first information weighted more. Averaging fits data better than simple adding.
- Implicit personality theories: we assume certain traits go together, for example that a warm person is also generous.
- Warmth and competence, in Susan Fiske's stereotype content model, are the two basic dimensions of social judgement.

## Halo effect and thin slices
- Edward Thorndike described the halo effect in 1920: one good trait, such as attractiveness, leads to assuming other good traits.
- Nalini Ambady and Robert Rosenthal found that people's ratings of teachers from silent video clips of only a few seconds predicted end of term student ratings, showing that thin slices of behaviour carry information.

## Applications
Interviewers in India often decide in the first few minutes; structured interviews reduce the effect of first impressions and halo.

## Conclusion
Impressions form fast, are organised around central traits like warmth, and are biased by order and halo effects, which structured methods can reduce.`,
    keyPoints: ["Definition", "Asch's warm cold study and central traits", "Kelley's guest lecturer study", "Primacy and its reasons; recency conditions", "Anderson's averaging model", "Implicit personality theory and warmth and competence", "Halo effect and thin slices", "Application to interviews"],
    pitfalls: ["Mixing up central traits and primacy", "No studies described"],
    module: "social/1-2",
    visuals: [compare("Asch's central traits", ["Warm in the list", ["Seen as generous", "Seen as happy", "Seen as good natured"], "A positive whole"], ["Cold in the list", ["Seen as ungenerous", "Seen as unhappy", "Seen as irritable"], "A negative whole"])],
    ref: "Asch 1946; Kelley 1950; Anderson 1965; Fiske et al 2002; Thorndike 1920; Ambady and Rosenthal 1993; social module 1.2",
  },
  {
    id: "soc-l04-009",
    subject: S,
    topic: "attribution",
    marks: 5,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Write a short note on cultural differences in attribution, with reference to Indian research.",
    plan: ["The fundamental attribution error", "Miller's study in India", "Other cross cultural evidence", "Explanation"],
    answer: `## The fundamental attribution error
Western research found that observers tend to explain others' behaviour by their personality rather than the situation, the fundamental attribution error. Cross cultural research asked whether this is universal.

## Miller's study
Joan Miller in 1984 asked Hindu Indians in Mysore and Americans in Chicago, at ages 8, 11, 15 and adulthood, to explain everyday good and bad behaviours of people they knew. Children in both cultures gave similar explanations. With age, Americans made more dispositional attributions, such as "he is selfish", while Indians made more situational and contextual attributions, such as "he had just lost his job" or "it was his duty to his family". This suggested that attribution styles are learned from culture.

## Other evidence
- Michael Morris and Kaiping Peng found that Chinese newspapers explained mass murders by situational factors, while American newspapers stressed the killer's personality. Chinese students also saw a fish moving ahead of a group as being influenced by the group more than Americans did.
- Collectivist cultures still show the error, but it is weaker and more easily corrected when situational information is clear.

## Explanation
In cultures where the self is defined through relationships and roles, people pay more attention to context and see behaviour as responsive to social duties. In individualist cultures, the self is seen as independent, so behaviour is read as an expression of inner traits.

## Conclusion
Attribution is shaped by culture: Indians tend to give more weight to context and roles.`,
    keyPoints: ["Fundamental attribution error", "Miller 1984 in Mysore and Chicago", "Developmental divergence with age", "Morris and Peng newspaper and fish studies", "Error weaker, not absent, in collectivist cultures", "Interdependent self explanation"],
    pitfalls: ["Saying Indians never make the error", "Leaving out the developmental finding"],
    module: "social/1-3",
    visuals: [compare("Miller's study", ["Americans with age", ["More dispositional explanations", "He is selfish", "Behaviour shows traits"], "Independent self"], ["Indians with age", ["More situational explanations", "He had lost his job", "Behaviour fits roles and duties"], "Interdependent self"])],
    ref: "Miller 1984; Morris and Peng 1994; Choi, Nisbett and Norenzayan 1999; social module 1.3",
  },
  {
    id: "soc-l04-010",
    subject: S,
    topic: "conformity-obedience",
    marks: 10,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "What is compliance? Explain the main compliance techniques with experimental evidence, and relate them to Cialdini's principles of influence.",
    plan: ["Compliance defined", "Commitment techniques", "Reciprocity techniques", "Other techniques", "Cialdini's principles and ethics"],
    answer: `## Compliance
Compliance is changing behaviour in response to a direct request, without necessarily changing private attitudes. It differs from conformity, which follows group norms without a request, and obedience, which follows commands from authority. Salespeople, charities and political campaigns use compliance techniques constantly.

## Commitment techniques
1. Foot in the door: a small request first increases agreement to a larger one. Jonathan Freedman and Scott Fraser in 1966 asked Californian homeowners to put a large, ugly "Drive Carefully" sign on their lawn. Only about 17 per cent agreed when asked directly, but about 76 per cent agreed if two weeks earlier they had agreed to display a small sign. Self perception explains it: people see themselves as helpful and act consistently.
2. Low ball: a person agrees to a deal, then the terms are made worse. Robert Cialdini and colleagues asked students to join a study; when told first and then informed it started at 7 in the morning, more turned up than when told the time first. Commitment persists after the conditions change. Car dealers who add charges after agreement use this.

## Reciprocity techniques
3. Door in the face: a large request that is refused is followed by a smaller one, which is more likely to be accepted. Cialdini's team asked students to counsel delinquents for two years; all refused. When then asked to take delinquents to the zoo for one afternoon, about 50 per cent agreed, compared with about 17 per cent asked directly. The second request seems like a concession, which the target feels obliged to return.
4. That's not all: before the person replies, the offer is improved, such as adding a free item, as in television sales.

## Other techniques
- Scarcity: "only today" or "last few seats" make things seem more valuable.
- Ingratiation: flattery and agreeing with the target increase liking and compliance.
- Social proof: "most of your neighbours have paid their tax" increases compliance, used in nudge campaigns.

## Cialdini's principles
Robert Cialdini summarised influence in six principles: reciprocity, commitment and consistency, social proof, authority, liking and scarcity, later adding unity, a sense of shared identity. Each technique draws on one or more of these.

## Ethics
These techniques can be used to sell harmful products or exploit people, for example in fraud calls. Understanding them helps consumers resist and helps health campaigns, such as vaccination drives, use them responsibly.

## Conclusion
Compliance techniques work through commitment, reciprocity, scarcity and social proof, as Cialdini's principles describe.`,
    keyPoints: ["Compliance versus conformity and obedience", "Foot in the door: 17 versus 76 per cent", "Low ball and the 7 am study", "Door in the face: 17 versus 50 per cent", "That's not all", "Scarcity, ingratiation, social proof", "Cialdini's six principles plus unity", "Ethical use"],
    pitfalls: ["Mixing up foot in the door and door in the face", "No experiments"],
    module: "social/2-3",
    visuals: [vis("experiment", { title: "Commitment techniques", question: "Percentage agreeing to the large request", unit: "%", conditions: [{ label: "Large sign, asked directly", value: 17 }, { label: "Large sign, after small sign", value: 76 }], why: "Agreeing to a small request first commits people to a helpful self image." })],
    ref: "Freedman and Fraser 1966; Cialdini et al 1975 door-in-the-face; Cialdini et al 1978 low-ball; Burger 1986; Cialdini 1984, 2016; social module 2.3",
  },
]);
