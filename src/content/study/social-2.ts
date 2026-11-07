/* Module · Social psychology, Part III (Advanced) and the exam zone. Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: us and them, help and harm

## 3.1 Prejudice, stereotypes and discrimination [core][advanced]
These three words map onto the ABC of attitudes:
- A **stereotype** is a belief about the characteristics of a group (cognitive).
- **Prejudice** is a negative attitude or feeling towards a group and its members (affective).
- **Discrimination** is unjustified negative behaviour towards people because of their group (behavioural).
They often go together but need not: a landlord may hold no strong feelings yet refuse tenants of one religion because "the neighbours will object".

### How stereotypes form and stick
- **Categorisation** is automatic and useful, but it brings **outgroup homogeneity** ("they are all alike; we are all different").
- **Illusory correlation**, shown by David Hamilton and Robert Gifford: when two rare things occur together (a minority group and an unusual behaviour), the pairing is especially memorable, so people overestimate how often it happens. In their study, both groups had the same ratio of good to bad behaviours, yet people judged the smaller group as worse.
- **Subtyping**: someone who doesn't fit the stereotype is filed as an "exception", so the stereotype survives.
- **Self-fulfilling prophecies and confirmation bias** keep stereotypes alive.

### The stereotype content model
Susan Fiske and her team (2002) found that across many cultures, stereotypes sit on two dimensions: **warmth** (are they friend or foe?) and **competence** (can they act on their intentions?). Each combination brings its own emotion and its own form of discrimination:
| | Low competence | High competence |
|---|---|---|
| **High warmth** | **Pity** (paternalistic prejudice): for example, older people and people with disabilities | **Admiration**: the ingroup and close allies |
| **Low warmth** | **Contempt and disgust**: for example, homeless people and people who use drugs | **Envy** (envious prejudice): for example, rich groups or successful minorities |

:::widget sort
{
  "prompt": "Using the stereotype content model, which emotion is the typical stereotype most likely to bring?",
  "buckets": ["Pity", "Admiration", "Envy", "Contempt"],
  "items": [
    { "text": "“They're sweet but can't really manage on their own.” (about older relatives)", "bucket": 0 },
    { "text": "“They're clever with money but only look after their own.”", "bucket": 2, "why": "Low warmth with high competence: the stereotype behind envious prejudice, which can turn into violence against prosperous minorities in times of crisis." },
    { "text": "“People like us: hard-working and decent.”", "bucket": 1 },
    { "text": "“Beggars at the signal are lazy and dirty.”", "bucket": 3 },
    { "text": "“People with intellectual disability are innocent like children.”", "bucket": 0, "why": "High warmth, low competence: kindly but disempowering." },
    { "text": "“Drug users have only themselves to blame.”", "bucket": 3 }
  ]
}
:::

:::widget flow
{
 "title": "From a categorisation to discrimination",
 "layout": "chain",
 "nodes": [
  {
   "id": "a",
   "label": "Categorise",
   "detail": "We automatically sort people into groups (caste, religion, region, gender)."
  },
  {
   "id": "b",
   "label": "Stereotype (cognitive)",
   "detail": "Beliefs about the group's traits, kept alive by illusory correlation, subtyping and confirmation bias."
  },
  {
   "id": "c",
   "label": "Prejudice (affective)",
   "detail": "Feelings: pity, envy, contempt or fear, as the stereotype content model predicts."
  },
  {
   "id": "d",
   "label": "Discrimination (behavioural)",
   "detail": "Unequal treatment: refusing a tenant, a job, a marriage proposal."
  }
 ],
 "caption": "Each link can be weakened: individuating information breaks stereotypes, contact reduces anxiety and prejudice, and laws and norms limit discrimination."
}
:::

### Prejudice in the person
- **The authoritarian personality**, described by Theodor Adorno's group in 1950: harsh, status-conscious parenting produces people who are submissive to authority, hostile to outgroups and rigid in thinking, measured by the **F (fascism) scale**. Criticised for its psychoanalytic assumptions and because all items were worded in one direction (agreeing raised the score, so acquiescence inflated it).
- **Right-wing authoritarianism** (Altemeyer): submission to authority, aggression towards those authority condemns, and conventionalism.
- **Social dominance orientation**, from Felicia Pratto and Jim Sidanius: a preference for group hierarchy and inequality.
Duckitt's **dual-process model** links RWA to seeing the world as **dangerous** and SDO to seeing it as a **competitive jungle**.

### Prejudice that hides
In many societies, open prejudice has fallen while subtler forms remain:
- **Modern or symbolic prejudice**: denying discrimination still exists and resenting a group's "special treatment".
- **Aversive racism** (Gaertner and Dovidio): people who sincerely hold egalitarian values still discriminate when the situation is ambiguous and a non-prejudiced excuse is available.
- **Benevolent sexism** (Glick and Fiske's ambivalent sexism): "women are pure and must be protected", which sounds kind but restricts.

### Stereotype threat
When people fear confirming a negative stereotype about their group, the worry itself can lower their performance. **Steele and Aronson (1995)** found Black American students did worse on a hard verbal test when it was described as a test of ability, but not when it was described as a lab puzzle.

:::widget flow
{"title": "How stereotype threat lowers a score", "layout": "chain", "nodes": [{"id": "c", "label": "A cue makes the stereotype relevant", "detail": "The test is called a measure of ability, or the student must tick their group on the form first."}, {"id": "w", "label": "Worry about confirming it", "detail": "'If I do badly, I prove them right.'"}, {"id": "m", "label": "Working memory is used up", "detail": "Monitoring, worry and arousal take capacity that the hard items need."}, {"id": "p", "label": "Performance drops", "detail": "The same students do as well as others when the test is described as non-diagnostic."}], "edgeLabels": {"c>w": "triggers", "w>m": "consumes", "m>p": "lowers"}, "caption": "The effect is clearest on hard tests and in people who care about the domain. Replications suggest it is smaller than early studies found."}
:::

:::widget decide
{
  "scene": "In the early 2000s, the economists Karla Hoff and Priyanka Pandey gave maze puzzles, with small cash rewards, to 11- and 12-year-old boys from high and low castes in villages in Uttar Pradesh. In one condition caste was not mentioned. In another, each boy's name, village and caste were announced to the mixed group before they began.",
  "ask": "Predict what happened.",
  "choices": [
    { "label": "Caste made no difference in either condition", "verdict": "ok", "outcome": "That was true only in the first condition.", "why": "When caste was not mentioned, low-caste and high-caste boys performed equally well." },
    { "label": "Low-caste boys' performance dropped by about a quarter when caste was announced", "verdict": "best", "outcome": "Correct. With no mention of caste, the groups were equal. Once caste was made public, low-caste boys' scores fell sharply; high-caste boys' scores barely changed.", "why": "Making a stigmatised identity salient changed performance, and also, the authors argued, the boys' expectations of being treated fairly. It is a vivid Indian demonstration of how social identity can create inequality in the moment." },
    { "label": "High-caste boys did much better once caste was announced", "verdict": "ok", "outcome": "High-caste boys' performance changed little.", "why": "The effect was a loss for the stigmatised group, not a boost for the dominant one." }
  ]
}
:::

:::trap Stereotype threat: a replication note
The core idea is plausible and widely taught, but the effect is **smaller and less reliable** than early studies suggested. Meta-analyses find signs of publication bias, and a large preregistered study in Dutch high schools found no effect on girls' maths scores. In exams, describe it, give the classic study, and add that its size and generality are debated.
:::

### Prejudice in India
India's main lines of prejudice include **caste**, **religion**, **region and language** (including discrimination against people from the North-East, documented by the Bezbaruah Committee in 2014), **gender**, **skin colour** (colourism, sustained by decades of "fairness" advertising) and **disability**. Bogardus-type social distance scales remain widely used in Indian research, and inter-caste marriage remains the most resisted form of contact.

:::clinician
Prejudice is a mental-health issue as well as a social one. Meyer's **minority stress model** describes distal stressors (discrimination, violence) and proximal ones (expectation of rejection, concealment, internalised stigma) that raise rates of depression, anxiety and substance use in sexual minorities; similar models are applied to caste and religious minorities. In the clinic, prejudice appears as diagnostic bias (for example, over-diagnosis of psychosis in some minority groups in the UK, and under-recognition of distress in groups whose idioms of distress clinicians do not share) and as stigma towards mental illness itself. The stereotype content model's prediction of pity for "warm but incompetent" groups explains paternalism towards people with severe mental illness, which the Mental Healthcare Act 2017's emphasis on capacity, advance directives and nominated representatives is meant to counter. On measurement, remember the IAT caveats in section 1.4.
:::

:::recall
1. Distinguish stereotype, prejudice and discrimination. || Belief about a group; negative attitude or feeling; unjustified negative behaviour.
2. What is illusory correlation? || Overestimating the link between two distinctive things, such as a minority group and an unusual behaviour.
3. What are the two dimensions of the stereotype content model? || Warmth and competence.
4. Which emotion goes with low warmth and high competence? || Envy.
5. What is aversive racism? || Discrimination by people with egalitarian values, shown when the situation is ambiguous and offers a non-prejudiced excuse.
6. What did Hoff and Pandey find? || Announcing caste lowered low-caste boys' puzzle performance by about a quarter.
:::

:::mcq
Q: Members of a majority community say "those people all think the same way" but describe their own community as very varied. This is:
- Illusory correlation between groups
- Subtyping
- *The outgroup homogeneity effect
- The ultimate attribution error
> Seeing the outgroup as more alike than the ingroup.

Q: A senior doctor insists that women residents should not take night duty "for their own safety", though they want to. In Glick and Fiske's terms this is:
- Hostile sexism
- Aversive racism
- Social dominance orientation
- *Benevolent sexism
> Apparently protective attitudes that restrict.
:::

## 3.2 Intergroup conflict, and what reduces it [core][advanced]
Why do groups come into conflict, and what makes the conflict ease? Four big ideas dominate exams: **realistic conflict**, **relative deprivation**, **social identity** and **contact**.

### Realistic conflict theory: Sherif's Robbers Cave
In 1954, Muzafer Sherif and colleagues took 22 boys of about 11 or 12, all similar in background, to a summer camp in Robbers Cave State Park, Oklahoma. The boys were divided into two groups, housed apart, and did not know about each other at first. The study had three stages:
1. **Group formation**: each group bonded and named itself (the Rattlers and the Eagles).
2. **Friction**: a tournament with prizes for the winners only (tug-of-war, baseball, treasure hunts).
3. **Reducing conflict**: first by simple contact (shared meals, films), then by **superordinate goals**: problems neither group could solve alone, such as a "broken" water supply and a supply truck that "would not start" and had to be pulled by both groups.

:::widget decide
{
  "scene": "In the third stage, Sherif first tried putting the Rattlers and Eagles together for pleasant activities such as meals and films, with no competition.",
  "ask": "Predict what happened during these pleasant contact sessions.",
  "choices": [
    { "label": "Hostility faded quickly once the boys spent time together", "verdict": "ok", "outcome": "That is not what happened.", "why": "Mere contact without a shared goal did not help." },
    { "label": "The sessions turned into fights, such as food battles in the dining hall", "verdict": "best", "outcome": "Correct. Contact alone gave the boys more chances to fight. Hostility fell only after a series of superordinate goals that required both groups to cooperate.", "why": "Competition for scarce resources (the prizes) created the conflict; shared goals that need both groups reduced it. This is the core of realistic conflict theory and of Allport's conditions for contact." },
    { "label": "The boys ignored each other politely", "verdict": "ok", "outcome": "Hostility actually continued openly.", "why": "Without a reason to cooperate, the group boundary stayed sharp." }
  ]
}
:::

:::trap The Robbers Cave critique
Gina Perry's archival research (2018) and earlier work showed that an **earlier attempt** by Sherif, at Middle Grove, New York, in 1953, **failed**: the boys refused to turn on each other and partly suspected they were being manipulated, and the researchers may have tried to provoke them. Staff at Robbers Cave also shaped events. The study remains a powerful illustration, but it was not a neutral, controlled experiment.
:::

:::widget flow
{
 "title": "The three stages of Robbers Cave",
 "layout": "chain",
 "nodes": [
  {
   "id": "a",
   "label": "Group formation",
   "detail": "Two groups bond separately and name themselves: the Rattlers and the Eagles."
  },
  {
   "id": "b",
   "label": "Competition",
   "detail": "A tournament with prizes for winners only. Name-calling, raids and flag burning follow."
  },
  {
   "id": "c",
   "label": "Mere contact",
   "detail": "Pleasant shared meals and films. Hostility continues: food fights."
  },
  {
   "id": "d",
   "label": "Superordinate goals",
   "detail": "A broken water supply, a stuck truck, money for a film: problems needing both groups. Hostility falls and cross-group friendships grow."
  }
 ],
 "caption": "Competition for scarce resources creates conflict; shared goals that need both groups reduce it."
}
:::

### Relative deprivation
People feel deprived not by what they have, but by what they have **compared with what they expect** or compared with others. Runciman (1966) separated **egoistic** deprivation (I am worse off than others) from **fraternalistic** deprivation (my group is worse off than other groups). Fraternalistic deprivation predicts collective action and intergroup hostility far better. **Tripathi and Srivastava (1981)** applied this in India, finding that Muslims who felt more fraternalistic deprivation showed more ingroup favouritism and hostility towards the outgroup.

:::widget compare
{"title": "Two kinds of relative deprivation", "a": {"label": "Egoistic", "points": ["'I am worse off than others like me'", "Compare yourself with other individuals", "Leads to personal stress and envy", "Rarely leads to collective action"], "summary": "A personal grievance."}, "b": {"label": "Fraternalistic", "points": ["'My group is worse off than other groups'", "Compare your group with other groups", "Leads to group anger", "Predicts protest and intergroup hostility"], "summary": "A group grievance. This is the kind that fuels social movements and conflict."}}
:::

### Social identity theory: Tajfel's minimal groups
Henri Tajfel asked a startling question: what is the **least** you need to make people favour their own group? In his **minimal group** experiments (1970, 1971), Bristol schoolboys were split into groups on a trivial basis (supposedly preferring paintings by Klee or by Kandinsky; in fact the split was random). They never met their group, had no history and no competition. Then each boy divided money between two other boys, one from his group and one from the other, using reward matrices.

:::widget decide
{
  "scene": "In Tajfel's matrices, boys could choose a pair of rewards that gave the most money to both boys together (maximum joint profit), the most to the ingroup boy, or the **largest difference** between the ingroup boy and the outgroup boy, even if that meant the ingroup boy got less money.",
  "ask": "Predict which strategy the boys tended to choose.",
  "choices": [
    { "label": "Maximum joint profit, since nobody was in real competition", "verdict": "ok", "outcome": "That is the 'rational' choice, but it was not the main one.", "why": "If groups mean nothing, there is no reason to favour one, yet they did." },
    { "label": "Fairness: equal amounts to both", "verdict": "ok", "outcome": "Fairness did pull choices, but not the whole way.", "why": "Choices were a compromise between fairness and favouring the ingroup." },
    { "label": "Maximising the difference in favour of the ingroup, even at a cost to the ingroup", "verdict": "best", "outcome": "Correct. Boys often chose options that made their group come out ahead relative to the other group, even when another option would have given their own group member more money.", "why": "Merely being categorised was enough to produce ingroup favouritism. Tajfel and Turner explained this through social identity: we gain self-esteem from our groups, so we want them to be positively distinct." }
  ]
}
:::

Tajfel and Turner's **social identity theory** has three steps: **social categorisation** (sorting people into groups), **social identification** (taking on the group as part of who you are), and **social comparison** (comparing your group with others to maintain **positive distinctiveness**).

:::widget flow
{
 "title": "Social identity theory in three steps",
 "layout": "chain",
 "nodes": [
  {
   "id": "a",
   "label": "Social categorisation",
   "detail": "Sorting people, including yourself, into groups."
  },
  {
   "id": "b",
   "label": "Social identification",
   "detail": "Taking the group into your sense of who you are; its successes feel like yours."
  },
  {
   "id": "c",
   "label": "Social comparison",
   "detail": "Comparing your group with others to keep it positively distinct, which produces ingroup favouritism."
  }
 ],
 "caption": "Self-esteem is the motor: we favour our groups because their standing becomes part of our own."
}
:::

When a group has low status, its members have three strategies:
| Strategy | When | Example |
|---|---|---|
| **Individual mobility** | Group boundaries seem permeable | Leaving the group: changing surname, migrating, "passing" |
| **Social creativity** | Boundaries closed and the status system seems stable | Comparing on a new dimension, revaluing the trait ("Black is beautiful", "Dark is beautiful"), or comparing with a different group |
| **Social competition** | The status difference seems illegitimate and unstable | Collective action, protest, political movements |

John Turner's **self-categorisation theory** extends this: which identity is active depends on the context, and when a group identity is salient we see ourselves as interchangeable members of it (depersonalisation).

### The contact hypothesis
Gordon Allport (1954) proposed that contact between groups reduces prejudice under four conditions:
1. **Equal status** within the situation
2. **Common goals**
3. **Cooperation**, not competition, between groups
4. **Support of authorities**, law or custom

:::widget layers
{"title": "Allport's four conditions for contact to work", "shape": "stack", "layers": [{"label": "Equal status", "detail": "Within the situation, both groups have equal standing. A cricket team where everyone plays, not one where one group only carries kit."}, {"label": "Common goals", "detail": "Both groups want the same outcome, such as winning the league."}, {"label": "Cooperation", "detail": "They must work together to reach it, not compete with each other."}, {"label": "Support of authorities", "detail": "Teachers, managers, law or custom clearly back the contact."}], "caption": "Contact reduces prejudice even without all four, but works best when they are present. Mere exposure under hostile conditions can make things worse."}
:::

Pettigrew and Tropp's meta-analysis (2006) of **515 studies** with more than 250,000 participants found that contact reliably reduces prejudice (average r of about minus 0.21), more strongly when Allport's conditions are met, but even when they are not. Its main mechanisms are **reducing anxiety** and **increasing empathy**, more than increasing knowledge. Variants include **extended contact** (knowing that an ingroup friend has an outgroup friend) and **imagined contact**.

:::widget decide
{
  "scene": "In a 2021 field experiment, the economist Matt Lowe organised cricket leagues for about 800 young men in rural Uttar Pradesh. Players were randomly assigned to teams that were either all one caste or mixed-caste, and so also randomly faced opponents of the same or other castes.",
  "ask": "Predict the effect on friendships across caste lines.",
  "choices": [
    { "label": "Any contact with other castes, as teammates or opponents, increased cross-caste friendships", "verdict": "ok", "outcome": "Not quite. The type of contact mattered.", "why": "Contact is not one thing." },
    { "label": "Playing with other-caste teammates increased cross-caste friendships, while playing against other-caste opponents reduced them", "verdict": "best", "outcome": "Correct. Collaborative contact increased other-caste friendships and cooperation; adversarial contact had the opposite effect.", "why": "This is Allport's cooperation condition, tested in a real Indian field experiment. Interestingly, the benefit held for both upper and lower castes even though the players were not equal in cricket skill." },
    { "label": "Contact had no measurable effect on caste attitudes", "verdict": "ok", "outcome": "Effects were clear and in opposite directions for teammates and opponents.", "why": "A short sporting league produced real changes in social ties." }
  ]
}
:::

### Other ways to reduce conflict
- **Superordinate goals** (Sherif).
- **The jigsaw classroom** (Elliot Aronson's method, first used in 1971 in newly desegregated schools in Austin, Texas): each pupil learns one part of a lesson and must teach it to the group, so everyone depends on everyone.
- **Recategorisation**: the **common ingroup identity model** (Gaertner and Dovidio): help "us" and "them" become a larger "we" (for example, "Indians" rather than Hindus and Muslims), while dual identities ("Indian Muslim") often work better than asking people to drop a subgroup identity.
- **Civic engagement**: Ashutosh Varshney's study of Hindu-Muslim relations (2002) compared pairs of Indian cities with similar populations, such as Aligarh and Calicut (Kozhikode). Cities where Hindus and Muslims were linked through **everyday associations** (business groups, trade unions, professional bodies, clubs) had far fewer riots. Associational ties gave leaders on both sides a way to stop rumours and contain violence.
- **GRIT** (graduated and reciprocated initiatives in tension reduction, proposed by Charles Osgood): one side announces and makes a small conciliatory move, inviting the other side to reciprocate, then repeats.

:::clinician
A 2019 review of randomised contact studies found real but smaller effects than correlational work, few studies with adults or long follow-ups, and weaker effects for racial and ethnic prejudice than for other targets. A 2020 field experiment found that Iraqi Christians assigned Muslim teammates in a football league were more likely to train with Muslims and vote for a Muslim player, but general attitudes changed little: behaviour towards specific outgroup members shifts more readily than abstract attitudes. Two further cautions: the "sedative" effect of contact (positive contact can reduce disadvantaged groups' support for collective action against inequality), and negative contact, which has a stronger per-encounter effect than positive contact. In clinical training, the same logic underlies contact-based anti-stigma programmes (for example, people with lived experience of mental illness speaking to students), which outperform education alone in the short term.
:::

:::recall
1. Name the three stages of the Robbers Cave study. || Group formation, friction (competition), reducing conflict with superordinate goals.
2. What is fraternalistic deprivation? || Feeling that one's group is worse off than other groups.
3. What did the minimal group studies show? || Trivial, random categorisation is enough to produce ingroup favouritism, even maximising difference at a cost.
4. Name the three strategies for a low-status group in social identity theory. || Individual mobility, social creativity, social competition.
5. State Allport's four conditions for contact. || Equal status, common goals, cooperation, support of authorities.
6. What did Varshney find about Indian cities? || Cities with everyday Hindu-Muslim associational ties had far fewer riots.
:::

:::mcq
Q: Two rival student unions stop fighting after their college is threatened with closure and both must work together to save it. This illustrates:
- *A superordinate goal
- The minimal group effect
- Fraternalistic deprivation
- Social creativity
> A goal that neither group can achieve alone.

Q: A low-status group that cannot leave its group, and sees the hierarchy as stable, starts comparing itself on its rich musical traditions instead of income. This is:
- Individual mobility
- Social competition
- *Social creativity
- Recategorisation
> Changing the dimension of comparison.
:::

## 3.3 Helping: prosocial behaviour and the bystander [core][advanced]
**Prosocial behaviour** is any action meant to benefit another. **Altruism** is the narrower case of helping **without expecting reward**, even at a cost to oneself. Whether pure altruism exists is one of the field's oldest debates.

### Why we help
| Explanation | Core idea |
|---|---|
| **Kin selection** (Hamilton) | Helping relatives passes on shared genes. We help close kin more, especially in life-or-death situations |
| **Reciprocal altruism** (Trivers) | Helping non-kin pays when they are likely to return the favour |
| **Social norms** | The **reciprocity norm** (help those who helped you) and the **social responsibility norm** (help those who depend on you) |
| **Arousal: cost-reward model** (Piliavin) | Seeing someone in trouble arouses us unpleasantly; we act to reduce it in whatever way has the best rewards and lowest costs |
| **Negative-state relief** (Cialdini) | We help to lift our own sadness |
| **Empathy-altruism hypothesis** (Batson) | Empathic concern produces a genuinely altruistic motive |

:::widget sort
{"prompt": "Which explanation of helping fits each case best?", "buckets": ["Kin selection", "Reciprocal altruism", "Cost-reward", "Negative-state relief", "Empathy-altruism"], "items": [{"text": "A woman runs into a burning house to save her nephew but not a neighbour's child", "bucket": 0, "why": "Helping relatives passes on shared genes."}, {"text": "You lend notes to a classmate who lent you hers last term", "bucket": 1, "why": "Help repaid and expected to be repaid."}, {"text": "A man sees an accident, feels sick with tension, and calls an ambulance because stopping to help himself would make him late", "bucket": 2, "why": "He reduces his arousal in the cheapest way."}, {"text": "Feeling low after a bad day, a student donates to a charity box and feels better", "bucket": 3, "why": "Helping to lift her own mood."}, {"text": "Moved by an old man's distress, you help him even though you could easily walk away unseen", "bucket": 4, "why": "Empathic concern, with an easy escape available, still leads to help."}]}
:::

:::widget decide
{
  "scene": "Batson and colleagues (1981): students watched 'Elaine' receive electric shocks and look very distressed. Some were led to feel high empathy for her (she seemed similar to them); others low empathy. Some were told they could leave after two trials anyway (easy escape); others that they had to watch all ten (hard escape). Then they were offered the chance to take her remaining shocks.",
  "ask": "Predict: among students with high empathy, did easy escape reduce helping?",
  "choices": [
    { "label": "Yes; when they could just leave, they left", "verdict": "ok", "outcome": "That happened in the low-empathy group, not the high-empathy group.", "why": "If helping were only about reducing our own distress, leaving would be the cheapest way out." },
    { "label": "No; high-empathy students mostly offered to take her place, even when they could easily leave", "verdict": "best", "outcome": "Correct. Empathic concern led to helping whether escape was easy or hard. Low-empathy students helped mainly when escape was hard.", "why": "Batson argued this shows a truly altruistic motive. Critics, including Robert Cialdini, argued that empathy also creates a sense of 'oneness' with the victim, so helping may still serve the self. The debate continues." },
    { "label": "No one offered to help in any condition", "verdict": "ok", "outcome": "Many students offered to take the shocks.", "why": "Helping varied in a clear pattern by empathy and escape." }
  ]
}
:::

### The bystander effect
On a night in March 1964, **Kitty Genovese** was murdered outside her apartment in New York. The *New York Times* reported that 38 neighbours watched and did nothing. The story became the most famous example of bystander apathy.

:::trap The Kitty Genovese story was exaggerated
A 2007 re-examination of the case found that few witnesses saw the attack clearly, most heard only part of it, and at least one or two called the police. The parable of "38 silent witnesses" is largely a myth, but it inspired research that is real.
:::

Bibb Latané and John Darley wondered whether the presence of others, rather than coldness, explained the inaction. In their **seizure study** (1968), students talked over an intercom about college life, each alone in a booth. One "participant" (a recording) mentioned he had seizures, then later seemed to have one, choking and calling for help.

:::widget guess
{
  "prompt": "When students believed they were the **only** other person who could hear the seizure, 85% went for help before it ended. What percentage did so when they believed **four other people** could also hear it?",
  "min": 0,
  "max": 100,
  "unit": "%",
  "answer": [25, 38],
  "reveal": "**31%**. The more people a student thought were listening, the less likely and the slower they were to help. Nobody was cold: those who didn't act were often trembling and anxious. They were stuck, each assuming someone else would act.",
  "clinician": "Darley and Latané's figures: helping before the end of the seizure was 85% in two-person groups, 62% in three-person groups and 31% in six-person groups. In the 'smoke-filled room' study, 75% of people alone reported smoke pouring into the room; with two passive confederates, only 10% did."
}
:::

:::widget experiment
{"title": "Darley and Latané's seizure study", "question": "A student over the intercom seems to have a seizure. What share of participants went for help before it ended?", "unit": "%", "conditions": [{"label": "Believed they were alone with him", "value": 85}, {"label": "Believed one other person could hear", "value": 62}, {"label": "Believed four others could hear", "value": 31}], "why": "Responsibility is spread across everyone who might act, so each person feels less of it. Those who did not help were not cold: many were trembling and anxious, unsure whether someone else had already gone."}
:::

:::widget flow
{
 "title": "Latané and Darley's decision model of helping",
 "layout": "chain",
 "nodes": [
  {
   "id": "a",
   "label": "Notice the event",
   "detail": "Blocked by distraction, hurry and urban overload."
  },
  {
   "id": "b",
   "label": "Interpret it as an emergency",
   "detail": "Blocked by pluralistic ignorance: everyone looks calm."
  },
  {
   "id": "c",
   "label": "Assume responsibility",
   "detail": "Blocked by diffusion of responsibility: someone else will act."
  },
  {
   "id": "d",
   "label": "Know how to help",
   "detail": "Blocked by lack of skills; first-aid training helps."
  },
  {
   "id": "e",
   "label": "Decide and act",
   "detail": "Blocked by audience inhibition and costs, such as fear of police and court hassles before India's Good Samaritan protections."
  }
 ],
 "caption": "Press Play: the presence of other people can block help at steps 1, 2, 3 and 5."
}
:::

### Latané and Darley's five steps
Helping requires a person to pass all five; the presence of others can block several:
1. **Notice** the event (others distract us; busy cities overload us).
2. **Interpret it as an emergency** (others' calm faces lead to **pluralistic ignorance**: everyone looks calm, so everyone decides it isn't serious).
3. **Assume responsibility** (others lead to **diffusion of responsibility**).
4. **Know how to help** (skills, such as first aid, make it more likely).
5. **Decide to help** and act (**audience inhibition**: fear of looking foolish, and the costs of helping).

:::mnemonic Notice, Interpret, Responsibility, Know, Act
"**N**ever **I**gnore **R**eal **K**nown **A**larms".
:::

### Being in a hurry
:::widget guess
{
  "prompt": "Darley and Batson (1973) asked trainee priests to walk to another building to give a talk, some on the Good Samaritan parable. On the way, they passed a man slumped in a doorway, coughing and groaning. Of those told they had plenty of time, 63% stopped to help. What percentage helped among those told they were already late?",
  "min": 0,
  "max": 100,
  "unit": "%",
  "answer": [5, 15],
  "reveal": "Only about **10%**. Some even stepped over the man. The topic of their talk made little difference; time pressure did. Situations shape helping more than we expect, even in people preparing to speak about helping.",
  "clinician": "Helping rates were 63% (low hurry), 45% (intermediate) and 10% (high hurry). The sample was small (40 seminarians), so the estimates are imprecise, but the direction fits wider evidence that situational factors such as time pressure, noise and mood strongly affect helping."
}
:::

### Who helps, and whom
- **Mood**: good moods increase helping ("feel good, do good"); guilt does too.
- **Similarity** and perceived **deservingness**: we help people like us and those whose need seems uncontrollable (Weiner).
- **Rural versus urban**: helping is lower in big, dense cities (Milgram's urban overload idea, and Levine's cross-city field studies).
- **Competence**: trained people (nurses, first-aiders) help more in medical emergencies.
- **Being one of a group** that shares an identity with the victim increases helping (in one UK study, football fans helped an injured stranger more if he wore their team's shirt).

### Applying it in India: the Good Samaritan law
India loses well over a lakh and a half of lives on its roads each year. For decades, bystanders hesitated to help accident victims partly from **fear of police questioning, court visits and hospital demands**: audience inhibition and high costs in Piliavin's model. In **SaveLIFE Foundation v. Union of India (2016)**, the Supreme Court gave legal force to guidelines protecting Good Samaritans, and the **Motor Vehicles (Amendment) Act, 2019** (Section 134A) protects anyone who helps an accident victim in good faith from civil or criminal liability, and from being forced to give their identity. This is social psychology turned into law: lowering the costs of helping.

:::clinician
A 2011 meta-analysis (105 effect sizes, over 7,700 participants) confirmed the bystander effect but found it **weaker in dangerous emergencies**, when the perpetrator is present, and when the other bystanders are friends rather than strangers: dangerous situations are recognised faster as emergencies, and others can provide physical support. A 2020 study analysed CCTV footage of 219 real public conflicts in Lancaster, Amsterdam and Cape Town: at least one bystander intervened in about **9 of 10** incidents, and the chance that **someone** intervened rose with the number of bystanders. The individual-level bystander effect and group-level helping can coexist. The Piliavin "subway" field experiment (1969) found a man with a cane who collapsed was helped very quickly in almost every trial, and a man who seemed drunk about half the time, with no diffusion of responsibility, because subway passengers could not leave. For clinicians: bystander intervention training (notice, interpret, take responsibility, know how) is the basis of gatekeeper suicide-prevention programmes and of ward safety cultures.
:::

:::recall
1. What is the difference between prosocial behaviour and altruism? || Prosocial is any helping; altruism is helping without expecting reward, even at cost.
2. What does the empathy-altruism hypothesis say? || Empathic concern produces a genuinely altruistic motive to help.
3. Give the helping rates in the seizure study. || 85% alone, 31% when they believed four others could hear.
4. Name the five steps of Latané and Darley's model. || Notice, interpret as emergency, assume responsibility, know how, decide and act.
5. What is pluralistic ignorance? || Everyone looks calm, so each person concludes the situation is not serious.
6. What does Section 134A of the Motor Vehicles Act protect? || Good Samaritans helping road accident victims from civil and criminal liability.
:::

:::mcq
Q: In a crowded college corridor, a student faints. Each onlooker glances at others, sees no one reacting, and decides she is probably fine. Which step of the bystander model failed first?
- Noticing that something has happened
- Knowing how to help
- Deciding to act
- *Interpreting it as an emergency
> Pluralistic ignorance blocks the interpretation step.

Q: Which finding most challenges the idea that bystanders rarely help in real conflicts?
- The seizure study
- *CCTV analyses of real public conflicts
- The smoke-filled room study
- The Good Samaritan study with trainee priests
> CCTV studies found intervention in about 9 of 10 incidents.
:::

## 3.4 Aggression: theories and reduction [core][advanced]
**Aggression** is behaviour intended to harm another person who wants to avoid the harm. Accidentally hurting someone is not aggression; assertiveness is not aggression either.
- **Hostile (reactive) aggression**: driven by anger; harm is the goal. A man hits someone who insulted him.
- **Instrumental (proactive) aggression**: harm is a means to another goal. A robber hits a shopkeeper to take the cash.
- **Direct versus indirect**: physical or verbal attack versus **relational aggression** (spreading rumours, exclusion), which is common among both girls and boys.

:::widget sort
{"prompt": "Which kind of aggression is each?", "buckets": ["Hostile", "Instrumental", "Relational", "Not aggression"], "items": [{"text": "A man punches someone who insulted his sister", "bucket": 0, "why": "Driven by anger; the harm is the goal."}, {"text": "A robber hits a shopkeeper to grab the cash", "bucket": 1, "why": "Harm is a means to money."}, {"text": "A group of girls stop inviting one classmate and spread a rumour about her", "bucket": 2, "why": "Harm through social exclusion and reputation."}, {"text": "A dentist causes pain while filling a tooth", "bucket": 3, "why": "No intent to harm; the patient agreed."}, {"text": "A boy deletes a rival from the class group chat to make him feel left out", "bucket": 2, "why": "Relational aggression online."}, {"text": "A bowler deliberately aims a bouncer at a batsman's head to scare him out", "bucket": 1, "why": "Harm or threat used to win."}]}
:::

### Theories
| Theory | Key idea | Key names |
|---|---|---|
| **Instinct** | Aggression is an inborn drive that builds up and must be released | Freud (the death instinct), Konrad Lorenz (a "hydraulic" fighting instinct) |
| **Biological** | Genes, hormones and brain systems raise or lower the risk | Testosterone (weak links), low serotonin with impulsive aggression, prefrontal control of the amygdala |
| **Frustration-aggression** | Frustration always leads to some form of aggression | Dollard, Doob, Miller, Mowrer and Sears (1939) |
| **Revised frustration-aggression / cognitive neo-association** | Any aversive event (pain, heat, frustration) creates negative feelings that prime both fight and flight; cues in the setting tip it towards aggression | Leonard Berkowitz (1989) |
| **Social learning** | Aggression is learnt by watching models and by its consequences | Albert Bandura |
| **Excitation transfer** | Leftover arousal from one source (exercise, a thriller film) intensifies anger at a later provocation | Dolf Zillmann |
| **General aggression model** | Person and situation inputs act through thoughts, feelings and arousal, then an appraisal leads to impulsive or thoughtful action | Anderson and Bushman (2002) |

:::widget flow
{
 "title": "The general aggression model",
 "layout": "chain",
 "nodes": [
  {
   "id": "a",
   "label": "Inputs",
   "detail": "Person (hostile attribution style, beliefs about aggression, alcohol) and situation (provocation, heat, pain, weapons, violent media)."
  },
  {
   "id": "b",
   "label": "Present internal state",
   "detail": "Hostile thoughts, angry feelings and physiological arousal, each feeding the others."
  },
  {
   "id": "c",
   "label": "Appraisal",
   "detail": "A quick, automatic reading of the situation, then, if there is time and capacity, a reappraisal."
  },
  {
   "id": "d",
   "label": "Action",
   "detail": "Impulsive aggression, or a thoughtful response (which may or may not be aggressive)."
  },
  {
   "id": "e",
   "label": "Social encounter",
   "detail": "The outcome feeds back into future inputs: aggression learnt, rewarded or punished."
  }
 ],
 "caption": "Anger management targets the appraisal step: slowing down so reappraisal can happen."
}
:::

The original frustration-aggression hypothesis was too strong: frustration doesn't always lead to aggression, and aggression has other causes. Neal Miller revised it in 1941 (frustration produces several responses, one of which is aggression), and **displacement** explains why aggression is often aimed at a safer target (the man shouted at by his boss shouts at his wife).

### Bandura's Bobo doll
In 1961, Bandura, Ross and Ross showed nursery-school children an adult who either punched, kicked and hit a large inflatable Bobo doll with a mallet, saying things like "Sock him in the nose!", or played quietly. Children who had seen the aggressive model copied many of the exact actions and words; boys showed more physical aggression than girls.

:::widget decide
{
  "scene": "In a 1965 follow-up, Bandura showed children a film of an adult attacking Bobo. In one version the adult was rewarded afterwards; in another, scolded and punished; in a third, nothing happened. Children were then left with Bobo. Later, the experimenter offered all children a reward for showing what the model had done.",
  "ask": "Predict the pattern.",
  "choices": [
    { "label": "Children who saw the model punished never learnt the aggressive acts", "verdict": "ok", "outcome": "They learnt them; they just didn't show them at first.", "why": "Learning and performance are not the same thing." },
    { "label": "Children who saw the model punished imitated less at first, but when offered a reward they reproduced the aggression as well as the others", "verdict": "best", "outcome": "Correct. Punishing the model suppressed performance, not learning.", "why": "This is the learning-performance distinction at the heart of social learning theory: we learn by watching, and consequences decide whether we act. It matters for media debates: a 'bad guy punished at the end' still models the behaviour." },
    { "label": "All three groups imitated equally from the start", "verdict": "ok", "outcome": "The punished-model group imitated less until rewarded.", "why": "Vicarious punishment reduced performance." }
  ]
}
:::

### Situational triggers
- **Heat**: hotter days, summers and regions see more violent crime (Craig Anderson's work); rising temperatures are now studied as a climate-change risk for violence.
- **Alcohol**: narrows attention to the most salient cues (Steele and Josephs's **alcohol myopia**), so provocation looms larger than restraint.
- **Provocation and insult**, crowding, pain and noise.
- **Weapons as cues**: Berkowitz and LePage (1967) found angered men gave more shocks when a gun was lying nearby than a badminton racket (the **weapons effect**). Later meta-analysis finds weapons reliably prime aggressive thoughts; the evidence for aggressive behaviour is weaker.
- **Culture of honour**: Cohen and Nisbett (1996) had a confederate bump into men and mutter an insult. Men raised in the southern United States (a "culture of honour") showed bigger rises in cortisol and testosterone and behaved more aggressively afterwards than northern men.

### Media violence and rumour
Many studies link violent media with short-term increases in aggressive thoughts, feelings and minor aggression. The **American Psychological Association** (2015, reaffirmed 2020) concluded that violent video games are associated with increased aggression, but that there is **not enough evidence** to link them to criminal violence. Ferguson and others argue even the aggression effects are small and inflated by poor measures. In India, a cluster of **mob lynchings in 2017 and 2018**, fuelled by forwarded rumours of child kidnappers, showed rumour, deindividuation and group polarisation working together; WhatsApp responded by limiting message forwarding in India.

### Reducing aggression
- **Catharsis does not work**: venting anger on a punching bag **increases** later aggression. Thinking about something else works better.
- **Punishment** works only when it is quick, certain and seen as fair, and it models aggression.
- **Modelling non-aggressive responses**, teaching social and emotional skills, anger-management (cognitive restructuring, relaxation, problem solving) and reducing exposure to aggressive cues.
- **Apology** and **empathy training** reduce retaliation.

:::widget sort
{
  "prompt": "Which theory best explains each example?",
  "buckets": ["Frustration-aggression", "Social learning", "Excitation transfer", "Cognitive neo-association"],
  "items": [
    { "text": "A child who watches his father slap his mother starts hitting his younger sister.", "bucket": 1 },
    { "text": "After a punishing gym session, Rohit explodes at a driver who cuts in front of him.", "bucket": 2, "why": "Arousal from exercise is carried over and labelled as anger." },
    { "text": "A man who has waited four hours in a government office queue shouts at the clerk.", "bucket": 0 },
    { "text": "On a sweltering day, a man with a toothache snaps at a stranger, especially after seeing a gun in a film poster.", "bucket": 3, "why": "Aversive events (heat, pain) create negative feeling; an aggressive cue tips it towards aggression." },
    { "text": "A teenager copies the fighting moves of a film hero he admires.", "bucket": 1 },
    { "text": "A worker blocked from a promotion kicks the office printer.", "bucket": 0 }
  ]
}
:::

:::clinician
Biological findings need careful framing. The meta-analytic correlation between testosterone and aggression in humans is small (around r of 0.08 in a 2006 meta-analysis), and the relationship is bidirectional (competition and status challenges raise testosterone). The MAOA-by-maltreatment interaction (first reported in 2002) has partial meta-analytic support but small effects and is not usable for individual prediction or in court. Clinically, reactive aggression is associated with threat hypersensitivity and poor prefrontal regulation (for example in PTSD, intermittent explosive disorder and some brain injuries), whereas proactive aggression with callous-unemotional traits is associated with reduced amygdala response to others' distress. The general aggression model informs violence-risk interventions, and structured professional judgment tools (such as the HCR-20) combine historical, clinical and risk-management factors that map loosely onto person and situation inputs.
:::

:::recall
1. Distinguish hostile from instrumental aggression. || Hostile: anger-driven, harm is the goal. Instrumental: harm is a means to another goal.
2. Who proposed the frustration-aggression hypothesis, and when? || Dollard, Doob, Miller, Mowrer and Sears, 1939.
3. What is Berkowitz's revision? || Aversive events create negative affect that primes fight or flight; aggressive cues push towards aggression.
4. What did Bandura's 1965 study show? || Seeing a model punished reduced performance, not learning; rewards brought out the learnt aggression.
5. What does research say about catharsis? || Venting increases rather than reduces later aggression.
6. What did the APA conclude about violent video games? || Linked to increased aggression, but not enough evidence for criminal violence.
:::

:::mcq
Q: A student says, "Let him hit the punching bag in the counselling room; it'll get the anger out of his system." Research suggests:
- *This is likely to increase later aggression
- This reduces aggression by releasing pent-up energy
- This has no effect at all
- This works only for children
> Bushman's studies: venting keeps anger active and rehearses aggression.
:::

## 3.5 Applied social psychology: space, crowds, law and peace [core][advanced]
### Density and crowding
Daniel Stokols (1972) made a key distinction:
- **Density** is a physical measure: the number of people per unit of space.
- **Crowding** is a psychological experience: the feeling that there are too many people, or too little space or control.
The same density can feel cosy at a family wedding and unbearable in a hospital queue.

**Calhoun's rats (1962)**: rats given plenty of food but allowed to breed in a confined space developed a "behavioural sink": aggression, poor maternal care, withdrawal and high infant mortality. Human findings are far less dramatic. In people, the effects of density depend on **control**, **predictability**, **social relationships** and **culture**.

Three explanations of crowding stress:
| Model | Idea |
|---|---|
| **Stimulus overload** (Milgram's urban overload idea) | Too much input; people cope by filtering out, including filtering out other people's needs |
| **Behavioural constraint / loss of control** | Others restrict what we can do |
| **Density-intensity** (Freedman) | Density intensifies whatever we already feel: pleasant situations feel more pleasant, unpleasant ones more unpleasant |

Baum and Valins found that students in **long-corridor** dormitories (many people sharing one corridor and bathroom) felt more crowded and withdrew socially more than students in **suite** dormitories of the same density, where small groups shared space. Design changed experience. Indian research on household crowding, including studies by Uday Jain in the 1980s, similarly found that high density was linked to stress mainly when people felt little control, and that cultural norms about togetherness and good family relationships softened its effects. Mumbai's chawls and Dharavi show both the costs of extreme density and the strong community ties that help people cope.

:::widget flow
{
 "title": "Three explanations of crowding stress",
 "layout": "tree",
 "nodes": [
  {
   "id": "r",
   "label": "High density"
  },
  {
   "id": "o",
   "label": "Too much input",
   "parent": "r",
   "detail": "Stimulus overload: we filter, including filtering out others' needs."
  },
  {
   "id": "c",
   "label": "Loss of control",
   "parent": "r",
   "detail": "Others restrict what we can do; perceived control is the key protective factor."
  },
  {
   "id": "i",
   "label": "Intensified feelings",
   "parent": "r",
   "detail": "Density-intensity: a crowded wedding feels more joyful, a crowded queue more irritating."
  }
 ],
 "caption": "Which branch applies depends on the setting and how much control people feel they have."
}
:::

### Personal space and territory
Edward Hall (1966) described four **distance zones** in **proxemics**:
| Zone | Rough distance | Used for |
|---|---|---|
| **Intimate** | Touching to about half a metre | Lovers, comforting, close family |
| **Personal** | About half a metre to just over a metre | Friends, ordinary conversation |
| **Social** | About 1 to 3.5 metres | Business, formal meetings, a doctor across a desk |
| **Public** | More than about 3.5 metres | Lectures, speeches |
Distances vary by culture (Hall's **contact** cultures, such as Arab and southern European, stand closer), by gender, by relationship and by status. When personal space is invaded, people show stress, avoid eye contact or leave (in a classic 1966 study, researchers sat uncomfortably close to people in a library and on a hospital ground; most moved away within minutes).

:::widget guess
{
  "prompt": "In Hall's scheme, up to about how many metres does the **social** distance zone (for formal business) extend?",
  "min": 0,
  "max": 8,
  "step": 0.5,
  "unit": "metres",
  "answer": [3, 4],
  "reveal": "About **3.5 metres** (roughly 12 feet). Beyond that is public distance. Hall's figures were based on middle-class Americans; actual comfortable distances differ across cultures and settings, which matters for where you place chairs in a counselling room.",
  "clinician": "Hall's zones in feet: intimate 0 to 1.5, personal 1.5 to 4, social 4 to 12, public 12 and beyond. In clinical settings, seating at an angle of about 90 to 120 degrees, at personal-to-social distance, with a clear exit for both people, is standard practice for safety and comfort."
}
:::

:::widget layers
{
 "title": "Hall's distance zones",
 "shape": "rings",
 "layers": [
  {
   "label": "Intimate (touching to about half a metre)",
   "detail": "Lovers, comforting, close family. Strangers here cause discomfort."
  },
  {
   "label": "Personal (about half a metre to just over a metre)",
   "detail": "Friends and ordinary conversation."
  },
  {
   "label": "Social (about 1 to 3.5 metres)",
   "detail": "Formal meetings, a doctor across a desk, most counselling rooms."
  },
  {
   "label": "Public (more than about 3.5 metres)",
   "detail": "Lectures, speeches, stage performances."
  }
 ],
 "caption": "The centre is you. Comfortable distances vary with culture, gender, status and relationship."
}
:::

**Territoriality** is claiming and defending a space. Irwin Altman (1975) described three types:
- **Primary**: owned and used exclusively, central to life (your home, your bedroom). Intrusion is serious.
- **Secondary**: used regularly but not owned (your usual seat in class, the neighbourhood tea stall's bench, a society's parking spot).
- **Public**: open to anyone for a short time (a seat on a train, a park bench, a library table).
People mark territories with **markers** (a bag on a seat, a towel on a sun lounger). Oscar Newman's **defensible space** (1972) argued that housing designed with clear territories, visibility and a sense of ownership has less crime.

:::widget sort
{
  "prompt": "Primary, secondary or public territory?",
  "buckets": ["Primary", "Secondary", "Public"],
  "items": [
    { "text": "Your family's flat", "bucket": 0 },
    { "text": "The bench in the hostel common room your group always sits on", "bucket": 1 },
    { "text": "A seat on a Chennai suburban train", "bucket": 2 },
    { "text": "Your desk in the hospital doctors' room, used by you every day", "bucket": 1, "why": "Used regularly and personalised, but not owned." },
    { "text": "Your bedroom", "bucket": 0 },
    { "text": "A table in a public library", "bucket": 2 }
  ]
}
:::

### Noise
Glass and Singer (1972) found that people coped with loud noise during a task, but **unpredictable and uncontrollable** noise left after-effects: less persistence on puzzles and lower frustration tolerance afterwards. Simply giving people a button to stop the noise (which they almost never pressed) removed most of the after-effects. **Perceived control** is the active ingredient, a theme that runs through environmental psychology. Children in classrooms facing an elevated train line in New York read less well than those on the quiet side, until noise-reducing measures were installed (Bronzaft).

### Social psychology and the law
**Eyewitness memory** is reconstructive, not a recording.
:::widget guess
{
  "prompt": "Loftus and Palmer (1974) showed students a film of a car crash, then asked, 'About how fast were the cars going when they **contacted** each other?' The average estimate was about 32 miles per hour. What was the average when the verb was **smashed**?",
  "min": 20,
  "max": 70,
  "unit": "mph",
  "answer": [38, 44],
  "reveal": "About **41 mph**. A week later, people who heard 'smashed' were also more likely to report seeing **broken glass** (about a third, versus about one in seven for 'hit'). There was no broken glass in the film. One word changed both the estimate and the memory.",
  "clinician": "Mean estimates: smashed 40.8, collided 39.3, bumped 38.1, hit 34.0, contacted 31.8 mph. Broken glass reported: smashed 32%, hit 14%, control 12%. Note that the sample was student participants watching films; real eyewitnesses are often more confident and more emotionally aroused, which can either strengthen or distort memory."
}
:::

Key eyewitness findings and reforms:
- **Weapon focus**: attention goes to a weapon, not the face.
- **Own-race (cross-race) bias**: we recognise faces of our own group better.
- **Misinformation effect**: post-event information is absorbed into memory.
- **Confidence**: confidence at the **first, fair identification** is fairly diagnostic; confidence inflated later (after feedback, repeated questioning or seeing the accused on TV) is not.
- **Line-up reforms**: double-blind administration (the officer doesn't know who the suspect is), fair fillers, a warning that the culprit may not be present, and recording confidence immediately.

**False confessions**: Kassin and Kiechel (1996) falsely accused students of crashing a computer by pressing a forbidden key. Most signed a written confession, and some even "remembered" details, especially when a confederate claimed to have seen them do it. **Indian law** has engaged directly with interrogation psychology: in **Selvi v. State of Karnataka (2010)**, the Supreme Court held that **narco-analysis, polygraph and brain-mapping tests** cannot be done without consent, as they violate the right against self-incrimination (Article 20(3)). India stopped using jury trials after the 1960s; judges decide facts, so research on jury decision-making applies mainly to judicial bias and to other countries.

### Peace psychology
- **Negative peace** is the absence of direct violence; **positive peace** (Johan Galtung) is the presence of justice and well-being, and the absence of **structural violence** (harm built into social systems, such as preventable deaths from poverty or caste exclusion).
- Christie, Wagner and Winter (2001) describe peace psychology as reducing both direct and structural violence, through **peacemaking** (stopping violence) and **peacebuilding** (changing the conditions that cause it).
- **Gandhian satyagraha** is psychologically sophisticated influence: consistent, principled minority influence (Moscovici), refusal to dehumanise the opponent, and costly signals of commitment that make the other side's violence look illegitimate. Chenoweth and Stephan's study of campaigns from 1900 to 2006 found that major **nonviolent** resistance campaigns succeeded about **twice as often** as violent ones.
- The **Seville Statement on Violence** (1986), signed by scientists from many countries, argued that biology does not make war inevitable.

:::clinician
Environmental psychology also covers pro-environmental behaviour. Descriptive-norm messages outperform appeals to the environment: in a 2008 hotel study, "most guests who stayed in this room reused their towels" raised reuse to about 49% versus about 37% for the standard environmental message. Social norms can backfire when the norm is bad ("so many people litter here"). In India, the Chipko movement of the 1970s is a classic case study of community-based environmental collective action. For law: Indian courts' reliance on "expert opinion" under the Bharatiya Sakshya Adhiniyam 2023 (which replaced the Indian Evidence Act) raises the same issues of eyewitness reliability and suggestibility that Gudjonsson's suggestibility scales address. Peace psychology in India includes research on youth in conflict-affected Kashmir and the North-East, showing high rates of trauma exposure and the protective roles of community and religious coping.
:::

:::recall
1. Distinguish density from crowding. || Density is physical people-per-space; crowding is the subjective feeling of too many people or too little control.
2. Name Hall's four distance zones in order. || Intimate, personal, social, public.
3. Name Altman's three types of territory with one example each. || Primary (home), secondary (usual classroom seat), public (train seat).
4. What removed the after-effects of noise in Glass and Singer's study? || Perceived control: a button to stop the noise.
5. What did Loftus and Palmer find? || The verb in the question changed speed estimates and created false memories of broken glass.
6. What did Selvi v. State of Karnataka decide? || Narco-analysis, polygraph and brain-mapping without consent violate Article 20(3).
:::

:::mcq
Q: Two hostels have the same number of students per square metre. Students in the one with long shared corridors report feeling more crowded than those in the one with small suites. This shows that:
- Density and crowding are the same thing
- *Crowding depends on design, not only density
- Suites always have higher density
- Long corridors reduce personal space violations
> Baum and Valins: design shapes the experience of crowding.

Q: Which line-up procedure is most recommended by eyewitness research?
- The investigating officer who knows the suspect runs the line-up
- Showing the witness a single photo of the suspect
- *Double-blind administration with confidence recorded at once
- Telling the witness the culprit is definitely present
> Prevents unintended cues and preserves the diagnostic value of first confidence.
:::

## 3.6 The replication crisis: what held up and what did not [core][advanced]
From about 2011, social psychology faced a crisis of confidence. Three events triggered it: a respected journal published apparent evidence for **precognition** (by Daryl Bem, in 2011) using standard methods, which made people ask whether the standard methods were the problem; a prominent Dutch researcher, **Diederik Stapel**, was found to have **fabricated** data in dozens of papers; and Simmons, Nelson and Simonsohn showed how ordinary flexible practices could make almost anything look significant (they called it "false-positive psychology").

### Why findings failed
- **Small samples** (low statistical power) make chance findings and inflated effects common.
- **Questionable research practices**: running many analyses and reporting the one that "works" (p-hacking), collecting more data until the result is significant, dropping conditions, and presenting an unexpected result as if it had been predicted (HARKing: hypothesising after results are known).
- **Publication bias**: journals publish positive results; null results sit in file drawers.
- **Hidden flexibility** in materials and procedures that cannot be checked.

### What failed or shrank
:::widget sort
{
  "prompt": "Sort each famous finding by how it has fared in large, careful replications.",
  "buckets": ["Held up well", "Real but smaller or contested", "Largely failed"],
  "items": [
    { "text": "Anchoring: arbitrary numbers bias estimates", "bucket": 0 },
    { "text": "Ego depletion: self-control is a resource that one task 'uses up'", "bucket": 2, "why": "Multi-lab replications (23 labs in 2016; 36 labs in 2021) found effects close to zero." },
    { "text": "Power posing raises testosterone and risk-taking", "bucket": 2, "why": "Hormone and behaviour effects failed to replicate (in a 2015 study of 200 people); the first author of the original study later said she no longer believed the effects were real. Small effects on self-reported feelings of power are still debated." },
    { "text": "The bystander effect", "bucket": 1, "why": "Confirmed by meta-analysis, but weaker in dangerous emergencies; and in real conflicts someone usually intervenes." },
    { "text": "Behavioural priming: reading words about old age makes you walk slowly", "bucket": 2 },
    { "text": "Gain versus loss framing changes choices", "bucket": 0 },
    { "text": "Stereotype threat", "bucket": 1 },
    { "text": "Mortality reminders make people defend their worldview more strongly", "bucket": 2, "why": "Many Labs 4 (21 labs, more than 2,200 participants) did not replicate the mortality salience effect." },
    { "text": "Facial feedback: holding a pen in your teeth makes cartoons funnier", "bucket": 1, "why": "A 17-lab replication of the pen study found nothing (2016); a later large study with other methods (Many Smiles, 2022) found small effects for some. Contested." },
    { "text": "Intergroup contact reduces prejudice", "bucket": 1, "why": "Robust in correlational and many experimental studies; randomised studies show smaller effects than once thought." }
  ]
}
:::

### The Stanford prison experiment
In 1971, Philip Zimbardo turned a basement at Stanford University into a mock prison. Student volunteers were randomly assigned as "guards" or "prisoners". The study was stopped after six days instead of two weeks because some guards became abusive and some prisoners broke down. For decades it was taught as proof that roles and situations alone can turn ordinary people cruel.

:::trap Why the Stanford prison experiment is now treated as a demonstration, not evidence
- **Guards were coached**. Recordings and archives, analysed by the historian Thibault Le Texier, show the guards were briefed and encouraged to be "tough", and the researchers themselves ran the prison.
- **Demand characteristics**: participants may have acted out what they thought the researchers wanted.
- **One study, small sample, no control group, never properly published** as a peer-reviewed experiment.
- **The BBC Prison Study** (run by Alex Haslam and Steve Reicher in 2002) did not find guards spontaneously becoming tyrannical. Tyranny emerged only when a group shared an identity and a leader legitimised it.
- **Self-selection**: a 2007 study found that an advert for a "study of prison life" attracted people higher in aggressiveness and authoritarianism than an advert for a "psychological study".
In an exam: describe it, then critically evaluate with these points and give the social identity reinterpretation.
:::

:::widget flow
{
 "title": "How a false finding gets published",
 "layout": "chain",
 "nodes": [
  {
   "id": "a",
   "label": "Small sample",
   "detail": "Low statistical power: real effects are often missed, and chance effects look big."
  },
  {
   "id": "b",
   "label": "Flexible analysis",
   "detail": "Try several outcomes, drop a condition, add participants until p dips below 0.05."
  },
  {
   "id": "c",
   "label": "A 'significant' result",
   "detail": "Often a false positive or an inflated effect."
  },
  {
   "id": "d",
   "label": "Publication bias",
   "detail": "Journals accept it; null results stay in the file drawer."
  },
  {
   "id": "e",
   "label": "Failed replication",
   "detail": "A large, preregistered study finds a much smaller effect, or none."
  }
 ],
 "caption": "Preregistration blocks step 2, registered reports block step 4, and large multi-lab studies fix step 1."
}
:::

### What changed
- **Preregistration**: stating hypotheses and analyses before collecting data.
- **Registered reports**: journals accept a study **before** results are known, based on its question and method.
- **Large multi-lab replications** (Many Labs, registered replication reports, the Psychological Science Accelerator, a network of labs in dozens of countries).
- **Open data and materials**, and reporting **effect sizes and confidence intervals**, not only p-values.
- **Larger samples** chosen by power analysis.

:::widget decide
{
  "scene": "A viral post says: “Harvard study: 2 minutes of a power pose before your viva will raise your confidence hormones and get you better marks!” Your classmate wants to teach it to your whole batch.",
  "ask": "What is the most scientifically sound response?",
  "choices": [
    { "label": "Teach it; a famous university did the study", "verdict": "harm", "outcome": "The batch spends time on a ritual whose hormone claims failed to replicate, and some feel worse when it doesn't work.", "why": "A prestigious source is a peripheral cue, not evidence." },
    { "label": "Ask: was it replicated in large, preregistered studies? What was the sample size and effect size? Then explain that the hormone claims failed replication, and suggest practice under viva-like conditions instead", "verdict": "best", "outcome": "Your classmate checks and changes the plan to mock vivas.", "why": "This applies the replication checklist. Practice until skills are automatic is supported by social facilitation research." },
    { "label": "Dismiss all social psychology as unreliable", "verdict": "ok", "outcome": "You throw out robust findings such as anchoring, conformity and contact along with the weak ones.", "why": "The replication crisis sorted findings; it did not erase the field." }
  ]
}
:::

:::clinician
Quantitatively: the 2015 Open Science Collaboration found 36% of 97 significant original effects replicated at p below 0.05, with replication effect sizes on average half the originals; a 2018 project replicated 13 of 21 social science studies from two of the most prestigious general science journals, again at about half the original effect size; and prediction markets of researchers forecast which studies would replicate surprisingly well, suggesting the field "knew" which findings were fragile. Ego depletion: Roy Baumeister's 1998 radish-and-cookie study and a 2010 meta-analysis (d of about 0.6) contrast with the 2016 registered replication (23 labs, about 2,100 participants, d of about 0.04) and a 2021 multisite test (36 labs, about 3,500 participants, d of about 0.06), with the earlier meta-analytic estimate attributed largely to publication bias. Implications for clinicians: interventions built on fragile findings (for example, "glucose restores willpower") should not be taught to patients as established. Apply the same scepticism to small, unreplicated clinical trials and to effects reported without confidence intervals.
:::

:::recall
1. Name three events that triggered the replication crisis. || Bem's precognition paper, Stapel's fraud, and Simmons, Nelson and Simonsohn's false-positive psychology paper (all around 2011).
2. What is HARKing? || Hypothesising after the results are known: presenting an unexpected finding as if predicted.
3. What did multi-lab replications find for ego depletion? || Effects close to zero.
4. Give three critiques of the Stanford prison experiment. || Guards were coached; demand characteristics; no control group and small sample; self-selection; not replicated in the BBC Prison Study.
5. What is a registered report? || A journal accepts the study on its question and method before the results are known.
:::

:::mcq
Q: Which reform most directly prevents publication bias?
- Larger samples
- Open data
- Effect sizes in abstracts
- *Registered reports
> Acceptance before results means null results get published too.
:::
`;

export const exam = String.raw`
## 4.4 Long answers, short notes and viva [core]
### Long answer skeletons
**Q1. Explain attribution theories. Discuss the biases in attribution with cross-cultural evidence. (15 marks)**
1. Define attribution; internal versus external (Heider's naive psychologist).
2. Jones and Davis: correspondent inference (choice, non-common effects, social desirability, hedonic relevance, personalism).
3. Kelley: covariation table (consensus, distinctiveness, consistency) with an example; causal schemas (discounting, augmenting).
4. Weiner: locus, stability, controllability; emotions and expectations; a NEET failure example.
5. Biases: FAE (Jones and Harris), actor-observer (with Malle's meta-analysis), self-serving, just world, ultimate attribution error.
6. Culture: Miller (1984) India-US, Morris and Peng (1994); conclusion on the FAE as partly cultural.

**Q2. Critically evaluate Milgram's research on obedience. (15 marks)**
Procedure; the 65% result and psychiatrists' predictions; table of variations; agentic state and graded commitment; ethics (Baumrind); Perry's archival critique; engaged followership (Haslam and Reicher); replications (Burger, Doliński); Hofling in hospitals; applications to medical hierarchies and patient safety; conclusion.

**Q3. What causes intergroup conflict and how can it be reduced? (15 marks)**
Realistic conflict (Robbers Cave, with Perry's critique); relative deprivation (Runciman; Tripathi and Srivastava); social identity theory (minimal groups, three strategies); prejudice in the person (authoritarianism, SDO); reduction: contact (Allport's four conditions, Pettigrew and Tropp, Lowe's cricket experiment), superordinate goals, jigsaw, recategorisation, Varshney's civic engagement, GRIT; conclusion.

**Q4. Describe the bystander effect and the factors that influence helping. (10 marks)**
Kitty Genovese and the myth; seizure and smoke studies with figures; five-step model; diffusion, pluralistic ignorance, audience inhibition; Fischer's meta-analysis and Philpot's CCTV study; mood, similarity, hurry (Darley and Batson); India's Good Samaritan law.

**Q5. Discuss the measurement of attitudes. (10 marks)**
Define attitude (ABC); Thurstone, Likert, Guttman, semantic differential, Bogardus (construction, strengths, weaknesses in a table); implicit measures and their limits; attitude-behaviour link (LaPiere, compatibility, theory of planned behaviour).

### Short notes (5 marks each)
Cognitive dissonance · Elaboration likelihood model · Groupthink · Social loafing · Social facilitation · Minority influence · Nurturant-task leader · Stereotype content model · Social identity theory · Contact hypothesis · Frustration-aggression hypothesis · Personal space and territoriality · Crowding versus density · Eyewitness testimony · Stanford prison experiment: a critique · Ego depletion and the replication crisis.

:::viva
What is the difference between conformity, compliance and obedience? :: Conformity follows group pressure; compliance answers a direct request; obedience follows a command from an authority.
Why did conformity fall with one ally in Asch's study? :: Unanimity was broken, giving social support and showing dissent was possible.
What explains door-in-the-face? :: Reciprocal concessions.
What did Milgram's psychiatrists predict? :: About one in a thousand would go to 450 volts.
Name the three explanations for social facilitation. :: Mere presence (drive), evaluation apprehension, distraction-conflict.
What is the collective effort model? :: People work hard in groups when they believe their effort matters and the outcome is valued.
Which theory explains the $1 versus $20 result without arousal? :: Bem's self-perception theory.
What is the principle of compatibility? :: Attitudes predict behaviour best when both are measured at the same level of specificity.
What does SDO measure? :: A preference for group hierarchy and inequality.
What did Tajfel's minimal group studies show? :: Random categorisation alone produces ingroup favouritism.
Name Allport's four contact conditions. :: Equal status, common goals, cooperation, authority support.
What is the empathy-altruism hypothesis? :: Empathic concern produces a genuinely altruistic motive to help (Batson).
What is the weapons effect? :: Weapons in view prime aggressive thoughts and, in the original study, more aggression.
What is defensible space? :: Newman's idea that design creating clear territory and visibility reduces crime.
What is structural violence? :: Harm built into social systems, such as preventable deaths from poverty or exclusion (Galtung).
Name two Indian social psychologists and their contributions. :: J. B. P. Sinha (nurturant-task leader); Durganand Sinha (indigenisation); also R. C. Tripathi (intergroup relations) and Ajit Dalal (health attributions).
:::

## 4.5 Module test [core]
:::mcq
Q: The definition of social psychology as the study of how the real, imagined or implied presence of others affects us was given by:
- *Gordon Allport
- Kurt Lewin
- Muzafer Sherif
- Floyd Allport
> Gordon Allport, 1954.

Q: Which of these is a field experiment?
- Surveying 2,000 students about loneliness and their daily phone use
- Analysing riot records against rainfall
- *Varying a parcel-dropper's clothes in a metro station and counting helpers
- Randomly assigning students in a laboratory to read one of two kinds of story
> A manipulation in a natural setting with unaware participants.

Q: A person who laughs at all comedians (low distinctiveness), whom others don't join (low consensus), and who laughs every time (high consistency) is seen as laughing because of:
- The comedian's material
- *His own disposition
- The occasion
- The audience
> Kelley's pattern for an internal attribution.

Q: Statement I: The actor-observer bias is very large in meta-analyses. Statement II: The self-serving bias is found across cultures, though smaller in East Asian samples.
- Both statements are true
- Statement I is true, II is false
- *Statement I is false, II is true
- Both statements are false
> Malle's meta-analysis found the actor-observer effect near zero; the self-serving bias is robust.

Q: Match the attitude scale with its method: (a) Thurstone (b) Likert (c) Guttman (d) Osgood. (1) cumulative scalogram (2) bipolar adjectives (3) equal-appearing intervals (4) summated ratings.
- a-4, b-3, c-1, d-2
- a-3, b-4, c-2, d-1
- a-1, b-4, c-3, d-2
- *a-3, b-4, c-1, d-2
> Thurstone: equal-appearing intervals; Likert: summated; Guttman: scalogram; Osgood: semantic differential.

Q: In the theory of planned behaviour, the component that can also predict behaviour directly is:
- Attitude towards the behaviour
- Subjective norms
- Behavioural beliefs about others
- *Perceived behavioural control
> Ajzen added perceived control, which can predict behaviour directly.

Q: A tired viewer is persuaded by a celebrity's endorsement of a health drink without thinking about the claims. This is:
- The central route
- *The peripheral route
- Systematic processing
- The sleeper effect
> Low ability (tiredness) leads to reliance on cues.

Q: Assertion (A): In Festinger and Carlsmith's study, the $1 group rated the boring task more favourably. Reason (R): A small reward provided insufficient external justification for lying.
- *Both A and R are true, and R explains A
- Both A and R are true, but R does not explain A
- A is true, R is false
- A is false, R is true
> Insufficient justification created dissonance, reduced by attitude change.

Q: Inoculation theory was developed by:
- *William McGuire
- Leon Festinger
- Carl Hovland's Yale group
- Daryl Bem
> McGuire, 1961.

Q: The percentage of Asch's participants who conformed at least once was about:
- 5%
- 37%
- *75%
- 100%
> About three-quarters conformed at least once; about 37% of critical answers conformed.

Q: A consistent minority changing majority views over time was demonstrated by:
- Solomon Asch
- Stanley Milgram
- *Serge Moscovici
- Morton Deutsch
> The blue-green slides study.

Q: Arrange these Milgram conditions from highest to lowest obedience: (1) touch-proximity (2) remote victim (3) victim in same room (4) peers rebel.
- 3, 2, 1, 4
- *2, 3, 1, 4
- 2, 1, 3, 4
- 1, 2, 3, 4
> Remote 65%, same room 40%, touch 30%, peers rebel 10%.

Q: Haslam and Reicher's "engaged followership" account says Milgram's participants continued mainly because they:
- Were sadistic or cruel by nature
- Were in an agentic state with no thought
- Believed the shocks were fake
- *Identified with the scientific goals
> Identification with the cause, not mindless obedience.

Q: Hofling's study is important because it showed obedience:
- *In a real hospital, with nurses
- Only in laboratories
- Only among university students
- Disappears when rules are clear
> 21 of 22 nurses were about to give an overdose on a phone order.

Q: Expert pool players play better and novices worse when watched. The best explanation is:
- Social loafing by the novice players
- Deindividuation
- *Arousal strengthening the dominant response
- Experts' evaluation of the novices' technique
> Zajonc's drive theory of social facilitation.

Q: Which condition makes social loafing most likely?
- Individual outputs are identifiable
- *Work is pooled into one group score
- The team is made of close friends
- The task is personally important
> Pooled, unidentifiable contributions invite loafing.

Q: According to Janis, which is an antecedent (not a symptom) of groupthink?
- Self-censorship
- Illusion of unanimity
- Mindguards
- *A directive leader
> Directive leadership is an antecedent condition.

Q: In Fiedler's model, relationship-oriented (high-LPC) leaders do best when situational control is:
- *Moderate
- Very low
- Very high
- Irrelevant
> Moderate control favours relationship-oriented leaders.

Q: Stereotypes about a group seen as warm but incompetent typically bring:
- Envy
- *Pity
- Contempt
- Admiration
> Paternalistic prejudice.

Q: Which statement about stereotype threat is most accurate?
- It has never been demonstrated
- It explains all group differences in test scores
- *Its effects are smaller than first reported
- It affects only high-status groups
> Meta-analyses show publication bias and smaller effects.

Q: In social identity theory, collective protest is most likely when a low-status group sees the status difference as:
- Stable and legitimate
- Permeable to individuals
- Irrelevant to its identity
- *Illegitimate and unstable
> These conditions lead to social competition.

Q: Pettigrew and Tropp's meta-analysis of 515 studies found that intergroup contact:
- *Reduces prejudice, most when conditions are met
- Increases prejudice unless all four conditions are met
- Has no effect on prejudice
- Works only through increasing knowledge
> Contact helps even without ideal conditions, mostly by reducing anxiety and increasing empathy.

Q: In Darley and Batson's Good Samaritan study, the main factor that predicted helping was:
- The topic of the talk
- *Being in a hurry
- Religious belief
- The victim's appearance
> 63% helped with no hurry versus about 10% in high hurry.

Q: Which step of Latané and Darley's model is blocked by diffusion of responsibility?
- Noticing the event
- Interpreting it as an emergency
- Knowing how to help
- *Taking responsibility
> Each person assumes someone else will act.

Q: Bandura's 1965 study showed that children who saw a model punished:
- Never learnt the aggressive acts
- Became more aggressive than the children in the other groups
- *Learnt the acts but showed them only when rewarded
- Imitated only verbal aggression
> The learning-performance distinction.

Q: A man exercises hard, then reacts with unusual fury to a minor insult. The best explanation is:
- *Excitation transfer
- Catharsis
- Instinct theory
- Relative deprivation
> Residual arousal intensifies anger.

Q: The subjective feeling that there are too many people around is called:
- Density
- *Crowding
- Territoriality
- Personal space
> Stokols' distinction: density is physical; crowding is psychological.

Q: Your usual seat in the college canteen, which others recognise as "yours", is Altman's:
- Primary territory
- Public territory
- Intimate distance zone
- *Secondary territory
> Used regularly but not owned.

Q: In Loftus and Palmer's study, the verb that produced the highest speed estimates was:
- Contacted
- Hit
- *Smashed
- Bumped
> Leading questions shape memory.

Q: Which Indian judgment held that narco-analysis without consent violates the right against self-incrimination?
- K. M. Nanavati v. State of Maharashtra
- *Selvi v. State of Karnataka
- SaveLIFE Foundation v. Union of India
- Common Cause v. Union of India
> Selvi, 2010, Article 20(3).

Q: Which finding has largely FAILED in large multi-lab replications?
- *Ego depletion
- Anchoring
- Gain-loss framing
- Conformity to a unanimous majority
> Multi-lab replications found effects near zero.

Q: The BBC Prison Study challenged the Stanford prison experiment by finding that:
- Guards became tyrannical even faster than at Stanford
- Prisoners always rebelled at once
- Roles had no effect on any behaviour
- *Tyranny depended on shared identity and leadership
> Haslam and Reicher's social identity reinterpretation.
:::
`;
