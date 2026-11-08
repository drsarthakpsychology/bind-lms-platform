import type { LongQA } from "@/lib/prep/long-types";

const S = "learning-motivation-emotion" as const;

export const LEARNING_MOTIVATION_EMOTION_L02: LongQA[] = [
  {
    id: "lme-l02-011",
    subject: S,
    topic: "matching-law",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on Herrnstein's matching law.",
    plan: ["State the law", "Experimental basis", "Worked example", "Applications and deviations"],
    answer: `## The law
Richard Herrnstein in 1961 found that when animals can choose between two responses, each reinforced on its own variable interval schedule (concurrent schedules), they distribute their responses in proportion to the reinforcement each provides. The matching law states: the proportion of responses made to option A equals the proportion of reinforcers obtained from A.
B1 / (B1 + B2) = R1 / (R1 + R2), where B is the rate of behaviour and R the rate of reinforcement.

## Experimental basis
Pigeons pecked two keys, each delivering food on a different VI schedule. When the left key provided 40 reinforcers an hour and the right key 20, the pigeons made about two thirds of their pecks on the left key.

## Worked example
A student gets about 30 likes an hour from Instagram and 10 an hour from studying (in the form of praise and progress). The matching law predicts that about 30 / 40 = 75 percent of their activity will go to Instagram. To shift behaviour, the relative reinforcement for studying must increase, or that for the alternative must decrease.

## Applications
- Explains why reinforcing an alternative behaviour reduces problem behaviour: a child who gets attention only by misbehaving will misbehave less if appropriate behaviour earns more attention.
- Basketball players' choice of two-point and three-point shots matched the relative success rates, as found in studies of college players.
- Helps explain addiction as choice: drug use rises when alternative reinforcers (work, relationships) are scarce, as in Bruce Alexander's "Rat Park" studies.

## Deviations
Real behaviour shows undermatching (less extreme preference than predicted) and bias (preferring one side for other reasons), captured by William Baum's generalised matching law.`,
    keyPoints: ["Statement and formula", "Concurrent VI schedules", "Pigeon example", "Worked everyday example", "Applications including alternative reinforcement", "Undermatching and bias"],
    module: "learning-memory/2-3",
    visuals: [
      { kind: "worked", caption: "Experimental basis", data: { title: "Matching law", steps: [{ q: "Total reinforcers an hour?", a: "40 + 20 = 60" }, { q: "Left key 40 reinforcers an hour, right key 20. Share of pecks on the left?", a: "40 / 60 = about 67 percent" }], yourTurn: [{ q: "A child gets attention 5 times an hour for shouting and 15 times for asking politely. Share of attention-seeking by shouting?", a: "5 / 20 = 25 percent" }] } },
    ],
    ref: "Herrnstein 1961 and 1970; Baum 1974; Vollmer and Bourret 2000 basketball; Alexander et al 1981",
  },
  {
    id: "lme-l02-012",
    subject: S,
    topic: "punishment",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is punishment in operant conditioning? Discuss the conditions under which it is effective, its side effects, and alternatives, with reference to corporal punishment of children in India.",
    plan: ["Define positive and negative punishment", "Conditions for effectiveness", "Side effects and problems", "Alternatives", "Indian context and law", "Conclusion"],
    answer: `## Meaning
Punishment is a consequence that decreases the likelihood of the behaviour it follows.
- Positive punishment adds an aversive stimulus: a scolding, a slap, a fine.
- Negative punishment removes a pleasant stimulus: time-out, loss of phone use, a deduction of tokens (response cost).
Like reinforcement, punishment is defined by its effect: if the behaviour does not decrease, the consequence was not a punisher.

## Conditions for effectiveness
Research by Nathan Azrin, Richard Solomon and others showed that punishment suppresses behaviour most effectively when:
- it is immediate, following the behaviour closely;
- it is consistent, following every occurrence;
- it is of sufficient intensity from the start (gradually increasing mild punishment leads to adaptation), though not harmful;
- the person knows exactly which behaviour is being punished and why;
- an alternative, acceptable behaviour is available and reinforced;
- the punished behaviour is not also being reinforced.

## Side effects and problems
- Suppression rather than elimination: behaviour often returns when the punisher is absent; the child learns not to misbehave when the parent is watching.
- Fear and anxiety, which can generalise to the punisher, the setting (school phobia) or learning itself.
- Avoidance and escape: lying, hiding, truancy.
- Aggression: physical punishment models aggression, as Bandura's research suggests; children who are hit are more likely to hit others.
- Damaged relationships between child and parent or teacher.
- Elizabeth Gershoff's meta-analyses found that corporal punishment was associated with more aggression, antisocial behaviour, mental health problems and poorer relationships, and with no long-term improvement in compliance.
- Punishment teaches what not to do, but not what to do.
- It can negatively reinforce the punisher (the misbehaviour stops at once), so punishment tends to escalate.

## Alternatives
- Reinforcement of desirable behaviour, especially alternative or incompatible behaviour (differential reinforcement).
- Extinction: ignoring attention-seeking misbehaviour, with consistency.
- Time-out from positive reinforcement and response cost as milder negative punishment.
- Clear rules, modelling, explanation and natural or logical consequences.
- Positive behaviour support and parent management training.

## Indian context
Corporal punishment in schools has been common in India and is often seen as discipline. The Right of Children to Free and Compulsory Education Act 2009 (Section 17) prohibits physical punishment and mental harassment of children in schools, and the National Commission for Protection of Child Rights has issued guidelines on eliminating corporal punishment. Surveys have found that a large majority of children report being physically punished at school, and serious injuries and suicides have followed severe punishment. Training teachers in positive discipline and behaviour management is a public mental health priority.

## Conclusion
Punishment can suppress behaviour when it is immediate, consistent and paired with reinforcement of alternatives, but it has serious side effects, especially when physical. Reinforcement-based approaches are more effective and ethical, and Indian law now prohibits corporal punishment in schools.`,
    keyPoints: ["Positive and negative punishment defined", "Conditions for effectiveness", "Suppression versus elimination", "Side effects including aggression and fear", "Gershoff's evidence", "Alternatives such as differential reinforcement", "RTE Act Section 17 and Indian context"],
    module: "learning-memory/2-3",
    visuals: [
      { kind: "decide", caption: "Side effects and problems", data: { scene: "A Class 3 child keeps talking during lessons.", ask: "What should the teacher do?", choices: [{ label: "Hit the child's hand with a ruler", verdict: "harm", outcome: "Talking stops briefly; fear and resentment grow.", why: "Physical punishment has side effects and is illegal in Indian schools." }, { label: "Praise the child each time they raise a hand, and briefly ignore calling out", verdict: "best", outcome: "Hand-raising increases and calling out falls.", why: "Differential reinforcement teaches what to do." }, { label: "Shout at the whole class each time", verdict: "ok", outcome: "Short-term quiet, little learning.", why: "Inconsistent and not linked to a better behaviour." }] } },
    ],
    ref: "Azrin and Holz 1966; Gershoff 2002 and Gershoff and Grogan-Kaylor 2016; RTE Act 2009 s.17; NCPCR 2014 guidelines; Atkinson and Hilgard ch 7",
  },
  {
    id: "lme-l02-013",
    subject: S,
    topic: "avoidance-learning",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Explain escape and avoidance learning. Why is avoidance behaviour so resistant to extinction, and what are the clinical implications?",
    plan: ["Define escape and avoidance", "Classic experiments: shuttle box, Solomon", "The avoidance paradox and two-factor theory", "Cognitive and safety-signal accounts", "Clinical implications"],
    answer: `## Escape and avoidance
- Escape learning: a response terminates an aversive stimulus that is already present. A rat in a shuttle box jumps over a barrier to escape a shock to the floor. Escape is negatively reinforced.
- Avoidance learning: a response prevents the aversive stimulus from occurring at all, usually after a warning signal. The rat learns to jump when a light comes on, before the shock begins.

## Classic experiments
- Richard Solomon and Lyman Wynne trained dogs in a shuttle box: a light dimmed, and a few seconds later a strong shock was delivered unless the dog jumped to the other side. Dogs quickly learned to jump at the signal and, once they did, never received another shock. Yet they continued jumping for hundreds of trials after the shock was disconnected, showing extreme resistance to extinction.
- Murray Sidman's free-operant avoidance: shocks came at regular intervals unless the rat pressed a lever, which postponed them; rats learned to press steadily with no warning signal.

## The avoidance paradox
How can a non-event (no shock) reinforce behaviour? Mowrer's two-factor theory answers:
- Classical conditioning: the warning signal is paired with shock and comes to elicit fear.
- Operant conditioning: jumping removes the signal and reduces fear, so jumping is negatively reinforced by fear reduction.
Because the animal always avoids, it never experiences the signal without shock long enough for fear to extinguish; extinction is prevented by the avoidance itself. Solomon also proposed that very rapid avoidance responses leave too little exposure for extinction (anxiety conservation).

## Other accounts
- Cognitive (expectancy) theory: the animal learns that "if I jump, no shock; if I do not jump, shock". Since it always jumps, it never tests the second expectation.
- Safety signal theory: stimuli that follow avoidance responses become signals of safety and are positively reinforcing.
- Species-specific defence reactions (Robert Bolles): avoidance is learned easily only if it uses natural defensive behaviours such as running or freezing.
- Fear often declines over training while avoidance persists, a problem for pure fear-reduction accounts.

## Clinical implications
- Anxiety disorders are maintained by avoidance and safety behaviours: a person with agoraphobia avoids crowded markets; a person with panic carries water and sits near exits; a person with social anxiety avoids eye contact. Each prevents disconfirmation of the feared outcome.
- OCD compulsions, such as hand-washing or checking, act as avoidance responses that relieve anxiety and are negatively reinforced, strengthening them.
- Substance use can be an avoidance of withdrawal or negative emotions (negative reinforcement model of addiction).
- Treatment requires blocking avoidance: exposure with response prevention in OCD, gradual exposure in phobias, and dropping safety behaviours in CBT for panic and social anxiety. In Solomon's dogs, physically preventing jumping (flooding) eventually extinguished the response.
- Experiential avoidance, avoiding unwanted thoughts and feelings, is targeted in acceptance and commitment therapy.

## Conclusion
Avoidance learning is reinforced by the reduction of fear and the prevention of feared outcomes, and it resists extinction because it stops the person from learning that the danger has passed. This explains why avoidance maintains anxiety disorders and why exposure with response prevention is essential in treatment.`,
    keyPoints: ["Escape versus avoidance", "Solomon and Wynne findings", "Sidman avoidance", "Avoidance paradox and two-factor solution", "Cognitive and safety signal accounts", "Clinical examples of avoidance and safety behaviours", "Exposure and response prevention"],
    module: "learning-memory/2-3",
    visuals: [
      { kind: "flow", caption: "The avoidance paradox", data: { title: "Why avoidance keeps fear alive", layout: "cycle", nodes: [{ id: "w", label: "Warning signal or feared situation" }, { id: "f", label: "Fear" }, { id: "a", label: "Avoidance or safety behaviour" }, { id: "r", label: "Relief", detail: "Negative reinforcement." }, { id: "n", label: "No disconfirmation", detail: "Never learns the danger has passed." }] } },
    ],
    ref: "Solomon and Wynne 1953; Sidman 1953; Mowrer 1947; Bolles 1970; Salkovskis 1991 safety behaviours; Atkinson and Hilgard ch 7",
  },
  {
    id: "lme-l02-014",
    subject: S,
    topic: "learned-helplessness",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "md-psychiatry"],
    question: "Describe the original learned helplessness experiments and the reformulated attributional theory of helplessness. Discuss their relevance to depression and recent neuroscientific revisions.",
    plan: ["Original experiments with dogs: triadic design", "Three deficits and the human studies", "Problems and the reformulated model: internal, stable, global", "Hopelessness theory and explanatory style", "Neuroscience revision of 2016", "Applications and conclusion"],
    answer: `## The original experiments
In the 1960s Martin Seligman, Steven Maier and Bruce Overmier studied dogs in a triadic design:
- Group 1 (escapable shock): dogs received shocks they could stop by pressing a panel.
- Group 2 (inescapable shock, yoked): each dog received exactly the same shocks as its partner in group 1, but nothing it did could stop them.
- Group 3: no shock.
All dogs were then placed in a shuttle box where they could escape shock by jumping over a low barrier. Dogs in groups 1 and 3 quickly learned to escape. About two thirds of the dogs from group 2 failed to learn; they lay down and whimpered, passively accepting the shocks. Since groups 1 and 2 received identical shocks, the difference lay in controllability. Seligman concluded that the dogs had learned that outcomes were independent of their responses: learned helplessness.

## Three deficits
- Motivational: reduced attempts to initiate responses.
- Cognitive: difficulty learning that responses can work, even when they do.
- Emotional: passivity, fear and later signs resembling depression.
Donald Hiroto showed similar effects in humans: students exposed to an inescapable loud noise later failed to learn an easy way of stopping noise; students given unsolvable problems performed worse on later solvable anagrams.

## The helplessness model of depression
Seligman proposed that reactive depression in humans resembles learned helplessness: people who experience uncontrollable negative events come to expect that nothing they do matters, leading to passivity, low mood and poor problem-solving.

## Problems with the original model
- Not everyone exposed to uncontrollable events becomes helpless or depressed.
- It did not explain the loss of self-esteem in depression, or why helplessness sometimes generalises widely and sometimes stays specific, or is brief or lasting.
- Depressed people blame themselves for events they cannot control, which is puzzling if they believe outcomes are uncontrollable.

## The reformulated attributional model
Lyn Abramson, Seligman and John Teasdale in 1978 proposed that what matters is how people explain uncontrollable negative events. Attributions vary on three dimensions:
| Dimension | Pessimistic | Optimistic |
| Internal versus external | "It's my fault" | "The exam was unfairly hard" |
| Stable versus unstable | "I'll always fail" | "I didn't prepare enough this time" |
| Global versus specific | "I'm stupid at everything" | "I'm weak at this subject" |
- Internal attributions lower self-esteem.
- Stable attributions make helplessness long-lasting.
- Global attributions make it spread across situations.
A consistent tendency to explain bad events in internal, stable, global terms is a pessimistic explanatory style, measured by the Attributional Style Questionnaire. Christopher Peterson and Seligman found it predicted later depression, poorer health and lower achievement.

## Hopelessness theory
Abramson, Gerald Metalsky and Lauren Alloy revised the model again in 1989: a pessimistic attributional style is a diathesis that, in combination with negative life events (stress), produces hopelessness: the expectation that desired outcomes will not occur and that one cannot change this. Hopelessness depression is a subtype linked to suicidal thinking; Aaron Beck found hopelessness a stronger predictor of suicide than depression itself.

## The neuroscientific revision
In 2016 Maier and Seligman revised the theory in light of decades of neuroscience. They concluded that passivity in response to prolonged aversive events is the default, unlearned reaction, mediated by activation of serotonin neurons in the dorsal raphe nucleus. What is learned is control: when an animal detects that it can control the aversive event, the ventromedial prefrontal cortex inhibits the dorsal raphe, preventing passivity and even protecting against later uncontrollable stress (immunisation). So it is not helplessness that is learned, but the expectation of control that is learned, and its absence leaves the default response.

## Applications
- Cognitive therapy for depression targets pessimistic attributions and hopelessness.
- The Penn Resiliency Program, developed by Seligman's group, teaches children to challenge pessimistic explanations and has shown modest prevention effects for depressive symptoms.
- Learned optimism and attributional retraining in education improve persistence after failure.
- Institutional settings, such as nursing homes or prisons, that remove residents' control can produce helplessness; Ellen Langer and Judith Rodin found that giving nursing home residents more control and responsibility improved wellbeing and even survival.
- Learned helplessness has been used to understand domestic violence victims, chronic poverty and students who give up after repeated failure, though structural causes must not be overlooked.

## Evaluation
The theory linked animal learning with human depression and generated influential cognitive models and interventions. Criticisms include ethical concerns about the animal studies, the modest effect sizes of attributional style, and the recognition that depression has many causes, including biology and social circumstances.

## Conclusion
Learned helplessness began as the finding that uncontrollable shock produces passivity, was reformulated as a cognitive theory of attributions and hopelessness, and has recently been revised to show that passivity is the default and control is what is learned. It remains central to understanding depression and building resilience.`,
    keyPoints: ["Triadic design and results", "Controllability as the key factor", "Three deficits and Hiroto's human studies", "Problems with the original model", "Reformulated model with internal, stable, global", "Explanatory style and hopelessness theory", "Maier and Seligman 2016 revision with dorsal raphe and vmPFC", "Applications such as Penn Resiliency and Langer and Rodin"],
    pitfalls: ["Omitting the yoked control logic", "Ignoring the 2016 revision in a modern answer"],
    module: "learning-memory/2-3",
    visuals: [
      { kind: "experiment", caption: "The original experiments", data: { title: "Seligman and Maier's dogs in the shuttle box", question: "What share of dogs failed to learn to escape shock?", unit: "%", conditions: [{ label: "Earlier escapable shock", value: 10 }, { label: "No earlier shock", value: 10 }, { label: "Earlier inescapable shock", value: 65 }], why: "The same shocks, but without control, led to passivity. Values approximate." } },
      { kind: "sort", caption: "The reformulated attributional model", data: { prompt: "A student fails an exam. Which explanation is internal, stable and global?", buckets: ["Pessimistic style", "Optimistic style"], items: [{ text: "I am stupid and always will be", bucket: 0 }, { text: "I did not revise enough for this paper", bucket: 1 }, { text: "The paper was set badly this year", bucket: 1 }, { text: "I fail at everything I try", bucket: 0 }] } },
    ],
    ref: "Overmier and Seligman 1967; Seligman and Maier 1967; Hiroto 1974; Abramson, Seligman and Teasdale 1978; Abramson, Metalsky and Alloy 1989; Maier and Seligman 2016 Psychological Review; Langer and Rodin 1976; Gillham et al Penn Resiliency",
  },
  {
    id: "lme-l02-015",
    subject: S,
    topic: "behaviour-therapy",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "What is a token economy? Describe its components, its applications in psychiatric and educational settings, and its limitations.",
    plan: ["Define token economy and origins", "Components", "Applications with evidence", "Limitations and ethical issues", "Conclusion"],
    answer: `## Meaning
A token economy is a behaviour modification system in which people earn tokens (secondary reinforcers such as points, stars or plastic coins) for specified target behaviours and exchange them later for backup reinforcers such as privileges, activities or goods. It applies operant conditioning to groups. Teodoro Ayllon and Nathan Azrin set up one of the first token economies in 1965 on a ward for long-stay patients with chronic psychosis at Anna State Hospital in Illinois.

## Components
- Clearly defined target behaviours: for example, making one's bed, attending activities, taking medication, completing homework, speaking politely.
- Tokens: easy to give immediately, hard to counterfeit, and given consistently.
- Backup reinforcers: a menu of items or privileges, such as snacks, outings, television time or free play, with a "price" in tokens.
- Exchange rules and times.
- Response cost: losing tokens for specified undesirable behaviours.
- Recording and monitoring of behaviour.
- A plan to fade tokens and replace them with natural reinforcers such as praise and satisfaction.

## Why it works
Tokens bridge the delay between behaviour and reinforcement, can be given immediately and without disrupting activities, and are generalised reinforcers that do not lose their effect through satiation, since they can be exchanged for many things.

## Applications
- Psychiatric hospitals: Ayllon and Azrin found that patients' participation in ward jobs rose dramatically when tokens were contingent on work and fell when tokens were given non-contingently. Gordon Paul and Robert Lentz's large study found that a social learning programme with a token economy produced more improvement and more discharges of long-stay patients than milieu therapy or routine care.
- Classrooms: increasing on-task behaviour, homework completion and attendance; class-wide systems such as the Good Behaviour Game reduce disruptive behaviour and have long-term benefits.
- Children with ADHD and conduct problems at home and in school, often as part of parent training.
- Intellectual disability and autism services.
- Juvenile homes, prisons and residential programmes.
- Substance use: contingency management with vouchers.

## Limitations
- Generalisation: gains may not transfer to settings without tokens, such as after discharge, unless natural reinforcers are built in.
- Dependence: behaviour may drop when tokens are withdrawn; fading is needed.
- Overjustification: rewarding activities that people already enjoy may reduce intrinsic motivation.
- Staff training and consistency are demanding; inconsistent delivery undermines the system.
- Ethical concerns: making basic needs (food, privacy, visits) contingent on tokens violates rights; modern programmes reinforce with extras only. The Mental Healthcare Act 2017 in India protects patients' rights to basic amenities and dignity.
- Token economies fell out of favour in psychiatry as deinstitutionalisation and rights-based care grew, though their principles survive in rehabilitation and schools.

## Conclusion
The token economy is an effective, well-researched application of operant conditioning for groups, especially in rehabilitation and education. Its success depends on clear targets, consistency, ethical backup reinforcers and planned transfer to natural rewards.`,
    keyPoints: ["Definition and Ayllon and Azrin origin", "Components including backup reinforcers and response cost", "Why tokens work", "Psychiatric evidence including Paul and Lentz", "School applications such as Good Behaviour Game", "Limitations: generalisation, overjustification", "Ethical issues and MHCA"],
    module: "learning-memory/4-1",
    visuals: [
      { kind: "flow", caption: "Components", data: { title: "How a token economy works", layout: "cycle", nodes: [{ id: "b", label: "Target behaviour", detail: "Completes homework." }, { id: "t", label: "Token given at once", detail: "A star on the chart." }, { id: "e", label: "Exchange", detail: "Ten stars buy extra play time." }, { id: "f", label: "Fading", detail: "Praise and pride gradually replace tokens." }] } },
    ],
    ref: "Ayllon and Azrin 1965 and 1968; Paul and Lentz 1977; Kazdin 1982; Embry 2002 Good Behaviour Game; MHCA 2017 ch V",
  },
  {
    id: "lme-l02-016",
    subject: S,
    topic: "observational-learning",
    marks: 20,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Discuss Bandura's social learning theory of observational learning. Describe the Bobo doll experiments, the four processes of modelling, the learning-performance distinction and the concept of self-efficacy, and evaluate the theory's applications.",
    plan: ["Background and the challenge to strict behaviourism", "Bobo doll studies with findings", "Learning versus performance and vicarious reinforcement", "Four processes: attention, retention, reproduction, motivation", "Reciprocal determinism and self-efficacy", "Applications, critique and conclusion"],
    answer: `## Background
Albert Bandura argued that strict behaviourism could not explain how people learn most of their behaviour. If we learned only through our own trial and error and reinforcement, learning to drive or to perform surgery would be dangerous and slow. Most human learning is observational: watching others (models) and the consequences of their behaviour. His social learning theory, later called social cognitive theory, combined learning principles with cognition.

## The Bobo doll experiments
- In 1961, Bandura, Dorothea Ross and Sheila Ross had 72 children aged about 3 to 6 years watch an adult in a playroom. In the aggressive condition, the adult hit, kicked and threw an inflatable Bobo doll and hit it with a mallet, saying things like "Sock him in the nose!" In the non-aggressive condition, the adult played quietly with toys. A control group saw no model.
- The children were then mildly frustrated (shown attractive toys and told they could not play with them) and left in a room with toys including a Bobo doll.
- Children who had seen the aggressive model imitated many of the specific aggressive acts and words, and showed more aggression overall. Boys were more physically aggressive than girls, and children imitated same-sex models more for physical aggression.
- In 1963, filmed and cartoon models (an adult dressed as a cat) also produced imitation, which raised concern about violence on television.

## Learning versus performance
In 1965, Bandura showed children a film in which the model was rewarded, punished or received no consequence for aggression towards Bobo.
- Children who saw the model punished imitated less aggression.
- But when all children were then offered rewards (stickers and juice) for reproducing the model's actions, all groups reproduced the aggression equally.
This showed the learning-performance distinction: children in all groups had learned the behaviour; the consequences seen by the model (vicarious reinforcement or vicarious punishment) affected whether they performed it, not whether they learned it. Learning can occur without reinforcement.

## The four processes of observational learning
- Attention: the observer must notice the model's behaviour. Attention is influenced by the model's status, attractiveness, similarity to the observer, and the distinctiveness of the behaviour.
- Retention: the behaviour must be remembered, through imagery and verbal coding, and rehearsal.
- Motor reproduction: the observer must have the physical and cognitive ability to perform the behaviour; watching a cricketer bat does not make one a cricketer.
- Motivation: the observer must have a reason to perform it, through external reinforcement, vicarious reinforcement or self-reinforcement (personal standards).

## Reciprocal determinism
Bandura proposed that behaviour, personal factors (cognitions, expectations, emotions) and the environment influence each other continually. People are not passive recipients of environmental forces; they choose and shape environments, which in turn shape them.

## Self-efficacy
Self-efficacy is a person's belief in their capability to organise and carry out the actions needed to achieve a goal. It differs from self-esteem; one may have high self-efficacy for cooking and low self-efficacy for public speaking. People with high self-efficacy choose challenging tasks, try harder, persist after setbacks and experience less anxiety. Sources of self-efficacy:
- Mastery experiences (past successes), the strongest source.
- Vicarious experiences (seeing similar others succeed).
- Verbal persuasion (encouragement).
- Physiological and emotional states (interpreting arousal as readiness rather than fear).
Bandura's studies of snake phobia showed that guided participant modelling (watching a model, then gradually doing it with help) produced the greatest improvement in behaviour and in self-efficacy, which predicted later approach behaviour.

## Applications
- Media violence: meta-analyses link exposure to violent media with small increases in aggressive thoughts, feelings and behaviour, though the size and real-world importance are debated.
- Therapy: modelling and participant modelling for phobias; social skills training; behaviour rehearsal; video modelling for children with autism.
- Health: self-efficacy is central to health behaviour models (smoking cessation, exercise, diabetes self-management).
- Education: teachers as models; peer tutoring; self-efficacy in mathematics and science.
- Social change: entertainment-education programmes. The serial "Hum Log" in India in 1984, the first Indian television soap opera, modelled family planning and women's rights, inspired by Miguel Sabido's work and Bandura's theory. Radio dramas in many countries have improved health behaviours.
- Organisations: behavioural modelling training for managers.

## Critique
- The Bobo doll studies used a doll designed to be hit, so the behaviour may have reflected play or demand characteristics rather than real aggression; there was no measure of long-term effects.
- Ethical concerns about exposing children to aggressive models.
- The theory underplays biological factors, such as temperament and hormones in aggression.
- It describes processes but is less precise about cognitive mechanisms.
- Self-efficacy may be partly a consequence rather than a cause of performance.
- Mirror neurons have been suggested as a neural basis for imitation, though their role in humans is debated.

## Conclusion
Bandura showed that people learn by observing others, that learning and performance are distinct, and that cognitive factors such as attention, memory, expectations and self-efficacy are central. His theory bridged behaviourism and cognitive psychology and has had wide applications in therapy, health, education and media.`,
    keyPoints: ["Challenge to strict behaviourism", "1961 Bobo doll design and findings including gender", "1965 study showing learning-performance distinction", "Vicarious reinforcement", "Four processes of modelling", "Reciprocal determinism", "Self-efficacy with four sources", "Applications including Hum Log, and critique"],
    pitfalls: ["Listing the four processes without explaining them", "Omitting the 1965 learning-performance study"],
    module: "learning-memory/2-4",
    visuals: [
      { kind: "experiment", data: { title: "Bandura 1965: learning versus performance", question: "Average number of aggressive acts children imitated (illustrative of the pattern)?", unit: " acts", max: 4, conditions: [{ label: "Model rewarded", value: 2.4 }, { label: "Model punished", value: 1.1 }, { label: "Model punished, child then offered a reward to imitate", value: 3.1 }], why: "Seeing punishment reduced performance, not learning: when rewarded, all children showed they had learned." } },
      { kind: "flow", data: { title: "Four processes of observational learning", layout: "chain", nodes: [{ id: "a", label: "Attention", detail: "Notice the model." }, { id: "r", label: "Retention", detail: "Remember through images and words." }, { id: "p", label: "Reproduction", detail: "Have the ability to do it." }, { id: "m", label: "Motivation", detail: "Expect reward, directly, vicariously or from oneself." }] } },
    ],
    ref: "Bandura, Ross and Ross 1961 and 1963; Bandura 1965 and 1977 (self-efficacy); Bandura 1986 Social Foundations; Bandura, Blanchard and Ritter 1969; Singhal and Rogers 1999 on Hum Log; Anderson et al 2010 media violence meta-analysis",
  },
  {
    id: "lme-l02-017",
    subject: S,
    topic: "cognitive-learning",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe Tolman's experiments on latent learning and cognitive maps. How did they challenge stimulus-response theories of learning?",
    plan: ["Tolman's purposive behaviourism", "Latent learning experiment with results", "Place learning and cognitive maps", "Challenge to S-R theory", "Modern support and applications"],
    answer: `## Purposive behaviourism
Edward Tolman (1886 to 1959) was a behaviourist who studied observable behaviour in rats, but argued that behaviour is purposive (goal-directed) and that learning involves forming expectations and mental representations. He called his approach purposive behaviourism and introduced intervening variables, inferred internal states between stimulus and response.

## Latent learning
Tolman and Charles Honzik in 1930 ran three groups of hungry rats through a complex maze with many blind alleys, once a day.
- Group 1 always found food in the goal box.
- Group 2 never found food.
- Group 3 found no food for the first 10 days, then food from day 11.
Results:
- Group 1 steadily reduced its errors.
- Group 2 improved only slightly.
- Group 3 made many errors for 10 days, like group 2. But as soon as food was introduced, its errors dropped sharply, within a day or two, to the level of group 1, or even below.
Tolman concluded that group 3 had been learning the layout of the maze all along without reinforcement, but did not show it until there was a reason to. This is latent learning: learning that is not evident in behaviour until it is needed. Reinforcement affects performance, not learning.

## Place learning and cognitive maps
- Tolman proposed that rats form a cognitive map, a mental representation of the spatial layout, rather than a chain of turning responses.
- Place learning experiments: rats trained to find food at a particular location from one starting point would, when started from the opposite side, go to the place where food had been (place learning) rather than repeating the same turn (response learning). Place learning was often easier.
- Detour studies: when a familiar path was blocked, rats chose the shortest alternative route they had never taken before, suggesting they understood the spatial relationships.
- Tolman's 1948 paper "Cognitive maps in rats and men" extended the idea to human thinking and prejudice: narrow, strip-like maps produced by frustration, versus broad, comprehensive maps.

## Challenge to S-R theory
- Stimulus-response (S-R) theorists such as Clark Hull held that learning consists of strengthening connections between stimuli and responses through reinforcement. Latent learning showed learning without reinforcement.
- Rats learned what led to what (stimulus-stimulus or expectancy learning), not just which movements to make.
- Flexible detour behaviour cannot be explained by fixed response chains.
- This prefigured the cognitive revolution and Bandura's learning-performance distinction.
- Hull and Kenneth Spence replied by adding mechanisms such as incentive motivation, and some results were difficult to replicate, but the core findings stood.

## Modern support and applications
- John O'Keefe and Lynn Nadel's book "The Hippocampus as a Cognitive Map", published in 1978, followed O'Keefe's discovery of place cells, and the Mosers found grid cells, providing a neural basis for cognitive maps; they shared the Nobel Prize in 2014.
- London taxi drivers have a larger posterior hippocampus.
- Humans use cognitive maps in navigation; GPS reliance may reduce their development.
- In education, learners may acquire knowledge that only appears when there is an incentive to use it.

## Conclusion
Tolman's latent learning and cognitive map studies showed that animals learn mental representations of their environment without reinforcement, and that reinforcement governs performance. They challenged S-R theory and laid the foundations of cognitive learning theory, now supported by neuroscience.`,
    keyPoints: ["Purposive behaviourism and intervening variables", "Tolman and Honzik three-group design", "Sharp drop in errors in group 3", "Latent learning definition", "Place learning and detour studies", "Challenge to Hull's S-R theory", "Place cells and grid cells support"],
    module: "learning-memory/2-4",
    visuals: [
      { kind: "experiment", data: { title: "Tolman and Honzik: latent learning", question: "Average errors on day 12 in each group (illustrative)?", unit: " errors", max: 10, conditions: [{ label: "Always rewarded", value: 3 }, { label: "Never rewarded", value: 7 }, { label: "Rewarded from day 11", value: 2.5 }], why: "Once food appeared, the third group used what it had learned without reward." } },
    ],
    ref: "Tolman and Honzik 1930; Tolman 1948 Psychological Review; Tolman, Ritchie and Kalish 1946; O'Keefe and Nadel 1978; Atkinson and Hilgard ch 7",
  },
  {
    id: "lme-l02-018",
    subject: S,
    topic: "cognitive-learning",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on insight learning.",
    plan: ["Kohler's work with chimpanzees", "Characteristics of insight", "Contrast with trial and error", "Criticisms and later evidence"],
    answer: `## Kohler's studies
Wolfgang Kohler, a Gestalt psychologist, studied chimpanzees on the island of Tenerife between 1913 and 1920, published as "The Mentality of Apes". He set problems in which a banana was out of reach:
- Hanging from the ceiling, with boxes in the cage: the chimpanzee Sultan, after unsuccessful jumping and a pause, stacked boxes and climbed up.
- Outside the cage, with two short sticks that could be fitted together: after failing with each stick alone and sitting idly, Sultan suddenly joined the sticks and pulled the banana in.
Kohler called this sudden solution insight: grasping the relationship between the parts of a problem.

## Characteristics of insight
- A period of apparent inactivity or impasse, followed by a sudden solution (the "aha" experience).
- The solution is performed smoothly and completely once found.
- It is retained and readily repeated.
- It transfers to similar problems.
- It depends on perceiving the whole situation and restructuring it, so all elements must be visible.

## Contrast with trial and error
Thorndike's cats learned gradually by trial and error in puzzle boxes where the mechanism was hidden; Kohler argued that when the whole problem is visible, animals can solve it by understanding. Insight produces an abrupt drop in errors rather than a gradual learning curve.

## Criticisms and later evidence
- Herbert Birch found that chimpanzees without previous experience of playing with sticks did not show insight, suggesting insight builds on past learning.
- Kohler's observations were not controlled experiments.
- Modern research confirms insight in humans, with distinctive brain activity in the right anterior temporal lobe just before the solution, and in some animals such as crows and great apes.`,
    keyPoints: ["Kohler and Sultan studies", "Features of insight", "Contrast with Thorndike", "Birch's prior experience critique", "Modern evidence"],
    module: "learning-memory/2-4",
    visuals: [
      { kind: "compare", caption: "Contrast with trial and error", data: { title: "Two ways to solve a problem", a: { label: "Trial and error (Thorndike)", points: ["Mechanism hidden", "Random attempts", "Gradual improvement"], summary: "Learning bit by bit." }, b: { label: "Insight (Kohler)", points: ["Whole problem visible", "Pause, then sudden solution", "Kept and transferred"], summary: "Learning by seeing relations." } } },
    ],
    ref: "Kohler 1925; Birch 1945; Kounios and Beeman 2009",
  },
  {
    id: "lme-l02-019",
    subject: S,
    topic: "operant-conditioning",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Compare and contrast classical and operant conditioning. Show how both operate together in real-life behaviour.",
    plan: ["Define each", "Similarities", "Differences in a table with explanation", "Interaction: two-factor theory, autoshaping, everyday examples", "Clinical and educational implications", "Conclusion"],
    answer: `## Definitions
- Classical conditioning (Pavlov) is learning an association between two stimuli: a neutral stimulus comes to elicit a response because it predicts an unconditioned stimulus. The learner is relatively passive; the response is elicited.
- Operant conditioning (Thorndike, Skinner) is learning an association between a behaviour and its consequence: behaviour that is reinforced increases, behaviour that is punished decreases. The learner is active; the response is emitted.

## Similarities
- Both are forms of associative learning studied with objective methods in animals and humans.
- Both show acquisition, extinction, spontaneous recovery, generalisation and discrimination.
- Both depend on contingency and prediction rather than mere contiguity.
- Both are shaped by biological constraints: taste aversion in classical, instinctive drift in operant.
- Both have produced effective therapies.

## Differences
| Feature | Classical | Operant |
| What is associated | Stimulus with stimulus (CS with UCS) | Response with consequence |
| Type of behaviour | Involuntary, reflexive (salivation, fear, nausea) | Voluntary, goal-directed (pressing, studying) |
| Role of learner | Passive | Active, operates on the environment |
| Timing | CS comes before the response and UCS | Consequence comes after the response |
| Response | Elicited by the stimulus | Emitted by the organism |
| Key figures | Pavlov, Watson | Thorndike, Skinner |
| Main processes | Pairing, extinction, higher-order conditioning | Reinforcement, punishment, shaping, schedules |
| Typical example | Feeling anxious at the sound of a dentist's drill | Studying more after praise |
| Therapies | Exposure, systematic desensitisation, aversion therapy | Token economy, contingency management, behavioural activation |

## How they work together
- Two-factor theory of avoidance (Mowrer): fear is classically conditioned to a stimulus, and avoidance is operantly reinforced by fear reduction. This explains the persistence of phobias and OCD compulsions.
- Secondary reinforcers: money and praise become reinforcers through classical association with primary reinforcers, then strengthen operant behaviour.
- Discriminative stimuli: in operant conditioning, cues signalling reinforcement (a light that signals food is available) also acquire classically conditioned emotional value.
- Autoshaping: Paul Brown and Herbert Jenkins found that pigeons began pecking a lit key that simply predicted food, even though pecking was not required, showing that classical pairing can produce apparently operant behaviour. In negative automaintenance, pigeons kept pecking even when pecking cancelled the food.
- Addiction: drug cues trigger classically conditioned craving and withdrawal-like responses, and drug taking is operantly reinforced by euphoria (positive reinforcement) and relief from withdrawal (negative reinforcement). Pavlovian-instrumental transfer shows that drug cues energise drug-seeking.
- Everyday example: a child stung by a bee feels fear on seeing bees (classical) and runs away whenever a bee approaches (operant, reinforced by relief).
- In school, a teacher who humiliates students can classically condition anxiety to the subject, while students' avoidance of the class is operantly reinforced.

## A worked illustration
Consider Ravi, a college student who freezes during class presentations. Years ago a teacher mocked him in front of the class (UCS), producing shame and fear (UCR). Standing before an audience became a conditioned stimulus for anxiety (classical). Now, whenever a presentation is due, he reports sick and feels immediate relief, so absence is negatively reinforced (operant). His friends sympathise and help him with notes, adding positive reinforcement. Treatment would combine graded exposure to speaking (extinguishing the conditioned fear) with removing the reinforcement for avoidance and reinforcing small speaking attempts.

## Theoretical debate
Some theorists (such as Rescorla and Richard Solomon) argued that the two are distinct processes; others proposed a single learning mechanism. Neural evidence shows partly separate systems: the amygdala and cerebellum for many classical responses, and the striatum and dopamine for operant learning, but with overlap in prediction error signals.

## Implications
Effective interventions often combine both: exposure therapy weakens conditioned fear while preventing reinforced avoidance; in addiction, cue exposure and contingency management are combined; in classrooms, a warm atmosphere builds positive conditioned emotions while reinforcement shapes behaviour.

## Conclusion
Classical conditioning explains how stimuli come to trigger emotional and reflexive responses; operant conditioning explains how consequences shape voluntary behaviour. In real life they interact constantly, as in avoidance, addiction and secondary reinforcement.`,
    keyPoints: ["Clear definitions", "At least four similarities", "Comparison table with at least six differences", "Two-factor theory as interaction", "Secondary reinforcers and autoshaping", "Addiction example", "Implications for therapy and teaching"],
    module: "learning-memory/2-2",
    visuals: [
      { kind: "compare", caption: "Differences", data: { title: "Classical versus operant", a: { label: "Classical", points: ["Stimulus predicts stimulus", "Involuntary responses", "Fear of a dentist's drill"], summary: "Learning what goes with what." }, b: { label: "Operant", points: ["Behaviour produces consequences", "Voluntary responses", "Studying more after praise"], summary: "Learning what to do." } } },
      { kind: "sort", caption: "How they work together", data: { prompt: "Classical or operant?", buckets: ["Classical", "Operant"], items: [{ text: "Feeling nauseous at the smell of a food that once made you ill", bucket: 0 }, { text: "Working overtime for a bonus", bucket: 1 }, { text: "Heart racing when your phone shows the boss's number", bucket: 0 }, { text: "A child cleaning up to earn screen time", bucket: 1 }] } },
    ],
    ref: "Atkinson and Hilgard ch 7; Mowrer 1947; Brown and Jenkins 1968 autoshaping; Williams and Williams 1969; Everitt and Robbins 2005 addiction",
  },
  {
    id: "lme-l02-020",
    subject: S,
    topic: "operant-conditioning",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Write a short note on the Premack principle.",
    plan: ["State the principle", "Evidence", "Examples", "Response deprivation refinement and uses"],
    answer: `## The principle
David Premack proposed in 1959 that a more probable (preferred) behaviour can be used to reinforce a less probable behaviour. Reinforcers are therefore activities, not just stimuli, and what counts as a reinforcer depends on the person's preferences at the time. It is often called "Grandma's rule": first eat your vegetables, then you can have dessert.

## Evidence
Premack observed children's free choice between playing a pinball machine and eating sweets. For children who preferred pinball, the opportunity to play pinball reinforced eating sweets; for those who preferred sweets, eating sweets reinforced playing pinball. With rats, running in a wheel reinforced drinking when the rats were deprived of running, and drinking reinforced running when they were deprived of water: reinforcement is relative.

## Examples
- Homework before television or cricket.
- A patient in rehabilitation earns time for a favourite activity after completing exercises.
- At work, doing an unpleasant task first and following it with a preferred one.
- In behavioural activation for depression, scheduling a valued activity after a necessary chore.

## Refinement
William Timberlake and James Allison's response deprivation theory showed that any activity can become a reinforcer if access to it is restricted below its normal (baseline) level, even a less preferred one.

## Uses
The principle is easy to apply in homes, classrooms and clinics because it uses activities already available rather than material rewards, and it individualises reinforcement by observing what people choose to do.`,
    keyPoints: ["Statement", "Premack's evidence and relativity of reinforcement", "Everyday examples", "Response deprivation refinement", "Practical uses"],
    module: "learning-memory/2-2",
    visuals: [
      { kind: "reveal", caption: "Examples", data: { prompt: "A teenager spends 4 hours a day gaming and 10 minutes on homework. Using the Premack principle, what plan would you suggest?", answer: "Make gaming contingent on homework: for example, 30 minutes of homework earns 30 minutes of gaming. The high-probability activity reinforces the low-probability one." } },
    ],
    ref: "Premack 1959 and 1965; Timberlake and Allison 1974",
  },
];
