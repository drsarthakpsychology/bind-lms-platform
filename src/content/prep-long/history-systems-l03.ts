import type { LongQA } from "@/lib/prep/long-types";

const S = "history-systems" as const;

export const HISTORY_SYSTEMS_L03: LongQA[] = [
  {
    id: "hsys-l03-001",
    subject: S,
    topic: "behaviourism",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Discuss neo-behaviourism with reference to the contributions of Hull, Tolman, Guthrie and Skinner.",
    plan: ["Why behaviourism changed after Watson", "Operationism and the logical positivist climate", "Hull's hypothetico-deductive theory", "Tolman's purposive behaviourism", "Guthrie's contiguity theory and Skinner's radical behaviourism", "Comparison and evaluation"],
    answer: `## Introduction
Watson's behaviourism of 1913 was a programme more than a theory. From the 1930s to the 1950s a second generation, the neo-behaviourists, tried to turn it into a rigorous science of learning. They shared Watson's commitment to observable behaviour but differed sharply on whether inner processes could be inferred and how theory should be built.

## The climate: operationism
Neo-behaviourism grew alongside logical positivism, which held that only statements that can be verified by observation are meaningful. The physicist Percy Bridgman's operationism, taken into psychology by S. S. Stevens, required every concept to be defined by the operations used to measure it. Hunger, for example, became hours of food deprivation. This allowed theorists to speak of inner states as long as they were tied to measurable inputs and outputs.

## Clark Hull
- Hull built a hypothetico-deductive theory modelled on geometry and physics: postulates, theorems derived from them, and experiments to test each theorem.
- Learning depends on drive reduction: a response that reduces a need such as hunger is reinforced.
- Habit strength grows with the number of reinforced trials.
- Reaction potential is habit strength multiplied by drive, so a well-learned response is not shown unless the animal is motivated. Later versions added incentive and inhibition.
- Hull's theory generated more research in the 1940s and 1950s than any other, but its equations became so complicated and its predictions so often wrong that it collapsed.

## Edward Tolman
- Tolman called his system purposive behaviourism. Behaviour is goal-directed and should be studied as whole, molar acts, not muscle twitches.
- He introduced intervening variables, inner processes such as expectations and demands that link stimulus and response and are defined by experimental operations.
- Latent learning: in 1930 Tolman and Honzik showed that rats that explored a maze without food for ten days, then found food, immediately ran almost as well as rats rewarded all along. Learning had occurred without reinforcement and was shown only when there was a reason.
- Cognitive maps: rats learn the layout of a space, not just a chain of turns, and take shortcuts when the usual path is blocked.
- Tolman is the bridge from behaviourism to cognitive psychology.

## Edwin Guthrie
Guthrie proposed the simplest theory: a combination of stimuli that has accompanied a movement will, on its recurrence, tend to be followed by that movement. Learning is by contiguity and happens in one trial; practice adds more stimulus links. Reward works by changing the situation so the last response is preserved. He offered practical methods for breaking habits, such as the threshold and fatigue methods, which resemble later exposure methods.

## B. F. Skinner
- Skinner rejected formal theory and intervening variables, preferring a descriptive analysis of behaviour and its consequences.
- He distinguished respondent behaviour, elicited by stimuli as in Pavlov's work, from operant behaviour, emitted by the organism and shaped by consequences.
- Using the operant chamber and the cumulative recorder, he studied reinforcement, punishment, shaping, extinction and schedules of reinforcement. Variable ratio schedules produce high, steady responding that resists extinction.
- His radical behaviourism accepted private events such as thoughts and feelings as behaviour, governed by the same laws, but denied that they cause public behaviour.
- He applied his work to teaching machines and programmed instruction, behaviour modification and a vision of society.

## Comparison
| Theorist | Key idea | Inner variables | Role of reinforcement |
| Hull | Drive reduction, habit strength | Yes, defined mathematically | Essential |
| Tolman | Purposive, cognitive maps | Yes, expectations | Affects performance, not learning |
| Guthrie | Contiguity, one-trial learning | No | Preserves the last response |
| Skinner | Operant conditioning, schedules | No, as causes | Central, as consequences |

## Evaluation
- Neo-behaviourism made learning research precise and gave clinical psychology lasting tools: token economies, shaping, applied behaviour analysis and exposure-based methods.
- Hull showed both the promise and the danger of formal theory; his collapse made psychologists wary of grand theories.
- Tolman's findings could not fit a pure stimulus response account and helped prepare the cognitive revolution.
- Skinner's account of language was attacked by Chomsky in 1959, which marked the decline of behaviourism's dominance.
- In India, behavioural methods spread through clinical psychology training at NIMHANS and other centres and remain central in work with children with developmental disabilities.

## Conclusion
The neo-behaviourists turned a slogan into a research tradition. Their debates about whether inner processes can be inferred led, through Tolman, straight to cognitive psychology, while Skinner's methods remain some of the most effective tools psychology has.`,
    keyPoints: ["Operationism and logical positivism as climate", "Hull's drive reduction and habit strength", "Tolman's intervening variables, latent learning and cognitive maps", "Guthrie's contiguity", "Skinner's operant analysis and radical behaviourism", "Comparison table", "Evaluation with link to the cognitive revolution"],
    pitfalls: ["Calling Tolman a strict stimulus response theorist", "Treating Skinner as denying private events exist", "No comparison between theorists"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "experiment",
        caption: "Edward Tolman",
        data: {
          title: "Latent learning in the maze",
          question: "Errors on day 12, after food is introduced for one group on day 11",
          unit: "errors",
          conditions: [
            { label: "Rewarded every day", value: 3, note: "Steady improvement throughout." },
            { label: "Never rewarded", value: 7, note: "Little improvement shown." },
            { label: "Rewarded from day 11", value: 3, note: "Sudden drop to the rewarded group's level." },
          ],
          why: "The late-rewarded rats had learned the maze while exploring; reward revealed learning rather than creating it. Values are illustrative of the pattern, not the exact figures.",
        },
      },
    ],
    ref: "Foundations module 2.1 clinician note; Tolman and Honzik 1930; Hilgard and Bower, Theories of Learning; Schultz and Schultz ch 10 and 11",
  },
  {
    id: "hsys-l03-002",
    subject: S,
    topic: "behaviourism",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester"],
    question: "Critically evaluate behaviourism as a school of psychology. What were its contributions and limitations, and how did its decline lead to the cognitive revolution?",
    plan: ["Define behaviourism and its varieties", "Historical rise and reasons for dominance", "Contributions to science and practice", "Limitations: theoretical, empirical, ethical", "The decline and the cognitive turn", "Present status and conclusion"],
    answer: `## Introduction
Behaviourism holds that psychology should study observable behaviour and its relation to the environment, with the aim of predicting and controlling it. From Watson's manifesto of 1913 to the late 1950s it dominated American psychology. A fair evaluation must separate its methodological insistence on public evidence, which psychology kept, from its theoretical claim that mind can be ignored, which psychology rejected.

## Varieties
- Methodological behaviourism, Watson: consciousness may exist but cannot be studied scientifically, so study behaviour.
- Neo-behaviourism, Hull and Tolman: inner processes can be inferred as intervening variables if they are tied to operations.
- Radical behaviourism, Skinner: private events are behaviour too, but explanation lies in environmental contingencies, not in mental causes.

## Why it rose
- Introspection had failed to settle disputes.
- Darwinian continuity encouraged animal research.
- Pavlov and Thorndike offered objective units of learning.
- Logical positivism and operationism defined meaningful science as observable science.
- American culture valued practical results in education, advertising and industry.

## Contributions
- Objectivity: behaviourism made public, replicable data the standard of psychological science, a standard that survives in every field.
- Experimental method: controlled laboratory designs, careful measurement of response rates and single-case designs such as the reversal design.
- Laws of learning: acquisition, extinction, generalisation, discrimination, schedules of reinforcement, shaping and punishment, many of which hold across species.
- Clinical applications: systematic desensitisation by Joseph Wolpe, token economies in psychiatric wards, applied behaviour analysis for autism and intellectual disability, contingency management for substance use, and the behavioural half of CBT.
- Education: programmed instruction, mastery learning and clear behavioural objectives.
- In India, behaviour modification is a standard part of RCI-recognised clinical training and is widely used in special schools.

## Limitations
- Neglect of mind: by excluding thinking, imagery and consciousness, behaviourism could not explain language, problem solving, memory organisation or insight.
- Empirical anomalies: Tolman's latent learning and cognitive maps, Kohler's insight in chimpanzees, and Harlow's monkeys who preferred a soft cloth mother to a wire one that gave milk, all contradicted simple reinforcement accounts.
- Biological constraints: John Garcia showed in the 1960s that rats learn taste aversion after one pairing with illness hours later, but cannot easily link taste to shock. Keller and Marian Breland found trained animals drifting back to instinctive behaviour. Not all stimulus response links are equal; evolution prepares some.
- Language: Chomsky's review of Skinner's account of verbal behaviour in 1959 argued that children produce and understand sentences they have never heard, at a pace and with a structure that reinforcement cannot explain.
- Over-generalisation from rats and pigeons to complex human life.
- Ethical concerns: Little Albert, aversive methods once used on gay men in so-called conversion treatment, and the risk of control without consent.
- Philosophical: critics argued that a science of behaviour without meaning leaves out what makes human action human, a point pressed by humanistic psychologists.

## Decline and the cognitive revolution
By the late 1950s several streams converged. Information theory and the computer offered a respectable, mechanical way to talk about inner processes: storing, coding and retrieving information. George Miller showed limits in short-term memory capacity in 1956, Newell and Simon built programs that solved problems, and Chomsky's critique made language a test case. Ulric Neisser's textbook of 1967 gave cognitive psychology its name. The revolution kept behaviourism's experimental rigour while restoring the mind as an object of study, so in one sense behaviourism was not overthrown but absorbed.

## Present status
| Behaviourist idea | Status today |
| Public, replicable data | Fully accepted |
| Laws of conditioning | Accepted, with biological constraints |
| Mind as irrelevant | Rejected |
| Language through reinforcement alone | Rejected |
| Behaviour therapy methods | Widely used, often within CBT |
| Functional analysis of behaviour | Standard in clinical and school practice |
Third-wave therapies such as ACT draw on modern behaviour analysis, showing the tradition is still productive.

## Conclusion
Behaviourism's methodological lesson won, its theoretical exclusion of mind lost. It gave psychology rigour, laws of learning and some of its most effective treatments, but its silence about inner life could not survive the evidence of latent learning, insight, biological preparedness and language. The cognitive revolution was less a defeat of behaviourism than a widening of it.`,
    keyPoints: ["Distinguishes methodological, neo and radical behaviourism", "Reasons for its rise", "Specific contributions to science, therapy and education", "Anomalies: latent learning, insight, Garcia, Breland", "Chomsky's critique", "Ethical critique", "Decline described as absorption into cognitive psychology", "Present status table"],
    pitfalls: ["One-sided praise or dismissal", "Not distinguishing the varieties", "Listing criticisms without evidence"],
    module: "foundations/2-1",
    visuals: [
      { kind: "figure", caption: "Contributions", data: { id: "skinner-box", title: "Skinner's operant chamber" } },
      {
        kind: "decide",
        caption: "Present status",
        data: {
          scene: "In a viva the examiner asks: was behaviourism good or bad for psychology?",
          ask: "Which answer scores best?",
          choices: [
            { label: "Bad: it ignored the mind and set psychology back.", verdict: "ok", outcome: "The examiner asks why behaviour therapy is still used.", why: "One-sided; its methods and therapies were major gains." },
            { label: "It made psychology objective and produced effective therapies, but by excluding mind it could not explain language or latent learning, which led to the cognitive revolution.", verdict: "best", outcome: "The examiner moves on to Chomsky.", why: "Balanced, specific and linked forward." },
            { label: "Behaviourism and psychoanalysis are the same.", verdict: "harm", outcome: "The viva goes badly.", why: "They are opposite in method and subject matter." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.1 and 2.2; Chomsky 1959; Garcia and Koelling 1966; Breland and Breland 1961; Schultz and Schultz ch 10 to 14",
  },
  {
    id: "hsys-l03-003",
    subject: S,
    topic: "behaviourism",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Distinguish between Watson's methodological behaviourism and Skinner's radical behaviourism.",
    plan: ["Define each", "Status of consciousness and private events", "Type of learning and unit of analysis", "Method and theory", "Applications and comparison table", "Conclusion"],
    answer: `## Introduction
Both Watson and Skinner are called behaviourists, but they meant different things. The difference turns on how each treated what happens inside the skin.

## Methodological behaviourism
John Watson argued in 1913 that psychology must use only publicly observable data. Consciousness might exist, but it cannot be observed by more than one person and so cannot be part of science. Psychology should therefore be the study of stimulus and response. The restriction is on method: what counts as evidence.

## Radical behaviourism
B. F. Skinner, from the 1930s onwards, called his position radical, meaning thoroughgoing. He did not exclude private events. Thinking, feeling and imagining are behaviour that happens to be observable only by the person who has them. They obey the same laws as public behaviour. What Skinner rejected was the claim that these inner events cause public behaviour. A feeling of hunger does not cause eating; both are products of deprivation and a history of reinforcement. Explanation lies in the environment.

## Key differences
| Point | Watson | Skinner |
| Private events | Outside science | Part of behaviour, not causes |
| Main learning model | Classical conditioning | Operant conditioning |
| Unit | Stimulus and response, often reflexes | Operant: behaviour defined by its consequences |
| Role of theory | Simple physiological explanation | Avoids theory and inner variables; describes functional relations |
| Thinking | Subvocal speech in the larynx | Covert verbal behaviour |
| Method | Observation, conditioned reflex, testing | Single-subject experiments, response rate, cumulative records |
| Focus | Emotions and habits in infants | Schedules, shaping, verbal behaviour, society |
| Main applications | Fear conditioning, advertising, child rearing advice | Teaching machines, token economies, applied behaviour analysis |

## Similarities
Both rejected mentalistic explanation, both stressed environment over heredity, both aimed at prediction and control, and both saw human and animal behaviour as following the same principles.

## Example
A student checks the phone during study. Watson would describe a learned habit linked to stimuli such as the notification sound. Skinner would analyse the consequences: intermittent rewards from messages on a variable ratio schedule maintain the checking, and the urge felt before checking is itself covert behaviour shaped by the same history.

## Conclusion
Watson limited psychology's evidence; Skinner widened behaviourism to cover private events but denied them causal power. Skinner's version proved more productive and survives in applied behaviour analysis and in the behavioural roots of acceptance and commitment therapy.`,
    keyPoints: ["Methodological as a restriction on evidence", "Radical as including private events but not as causes", "Classical versus operant focus", "Role of theory", "Comparison table", "Similarities", "Worked example"],
    pitfalls: ["Saying Skinner denied that thoughts exist", "Treating the two positions as identical"],
    module: "foundations/2-1",
    visuals: [
      {
        kind: "compare",
        caption: "Key differences",
        data: {
          title: "Watson or Skinner?",
          a: { label: "Methodological: Watson", points: ["Consciousness outside science", "Classical conditioning", "Thought as subvocal speech"], summary: "A rule about what counts as evidence." },
          b: { label: "Radical: Skinner", points: ["Private events are behaviour", "Operant conditioning", "Causes lie in contingencies"], summary: "A full philosophy of behaviour." },
        },
      },
    ],
    ref: "Foundations module 2.1 clinician note; Skinner, About Behaviorism 1974; Moore, Conceptual Foundations of Radical Behaviorism",
  },
  {
    id: "hsys-l03-004",
    subject: S,
    topic: "gestalt",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe the origin and main principles of Gestalt psychology.",
    plan: ["The phi phenomenon of 1912", "The founders and their roles", "Core principle: the whole differs from its parts", "Laws of organisation", "Insight and isomorphism", "Evaluation"],
    answer: `## Origin
In 1912 Max Wertheimer, working at Frankfurt, published a study of apparent movement. Two lights flashed one after the other at the right interval look like a single light moving from one place to the other. He called this the phi phenomenon. The movement is not in either light; it is in the relation between them. Structuralism, which explained experience as a sum of sensations, could not account for it. Gestalt psychology began from this observation.

## The founders
- Max Wertheimer: the phi phenomenon and later work on productive thinking.
- Wolfgang Kohler: the two observers in the 1912 experiments, he later studied insight in chimpanzees on Tenerife and developed the theory of isomorphism.
- Kurt Koffka: spread the ideas in English and applied them to development and learning.
- Kurt Lewin, a younger colleague, extended the approach to motivation and social life.

## Core principle
Gestalt is German for form or shape. The central claim is that the whole is different from the sum of its parts. A melody is still the same melody when played in another key, even though every note has changed. Perception is organised from the start; we do not first see bits and then join them.

## Laws of organisation
- Proximity: items close together are grouped.
- Similarity: similar items are grouped.
- Closure: we complete gaps to see whole figures.
- Continuity or good continuation: we follow smooth lines rather than sharp turns.
- Common fate: items moving together are grouped.
- Figure and ground: perception separates a figure from its background, and the two can reverse, as in Rubin's vase and faces.
- Pragnanz, the overarching law: we see the simplest, most stable form the stimulus allows.

## Insight and isomorphism
- Insight: problems are solved by suddenly restructuring the field, not only by trial and error.
- Isomorphism: Kohler proposed that patterns of brain activity have the same structure as the experience they produce.

## Indian example
A string of Diwali lights flashing in sequence along a balcony looks like one light running around the building, which is the phi phenomenon. Rangoli designs rely on closure and symmetry, as the eye completes the pattern even where the powder line breaks.

## Evaluation
Gestalt psychology overturned elementism, gave perception research its laws of grouping and influenced social psychology through Lewin. Its laws were more descriptive than explanatory, and isomorphism found little support in brain research. Modern predictive coding accounts of perception have revived its interest in global organisation.`,
    keyPoints: ["Phi phenomenon of 1912", "Roles of Wertheimer, Kohler and Koffka", "Whole differs from the sum of parts", "At least five laws including Pragnanz", "Figure and ground", "Insight and isomorphism", "Balanced evaluation"],
    pitfalls: ["Confusing Gestalt psychology with Perls's Gestalt therapy", "Listing laws without examples"],
    module: "foundations/2-2",
    visuals: [
      { kind: "figure", caption: "Laws of organisation", data: { id: "kanizsa-triangle", title: "Closure: the Kanizsa triangle" } },
      { kind: "illusion", caption: "Core principle", data: { kind: "figure-ground", title: "Figure and ground reverse" } },
    ],
    ref: "Foundations module 2.2; Schultz and Schultz ch 12; Wertheimer 1912",
  },
  {
    id: "hsys-l03-005",
    subject: S,
    topic: "gestalt",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on Kohler's studies of insight learning.",
    plan: ["Setting and subjects", "Classic problems", "Features of insight", "Contrast with trial and error", "Significance"],
    answer: `## Setting
Wolfgang Kohler was director of an anthropoid research station on Tenerife in the Canary Islands from 1913 and was stranded there during the First World War. He studied the problem solving of chimpanzees and published his results in 1917.

## Classic problems
- Stick problem: a banana lay outside the cage beyond reach. Sultan, the most able chimpanzee, had two short sticks, neither long enough. After failed attempts and a pause, he fitted one stick into the other and pulled in the fruit.
- Box problem: bananas hung from the roof. Chimpanzees stacked boxes to climb up.
- Detour problems: animals had to move away from the goal to reach it.

## Features of insight
- The solution appears suddenly, often after a pause, rather than gradually.
- It is complete and smooth once found.
- It is retained and transferred to similar problems.
- It depends on seeing the whole situation and restructuring it, so that a stick becomes a tool.

## Contrast with trial and error
Thorndike's cats in puzzle boxes improved gradually and by chance. Kohler argued that Thorndike's boxes hid the relation between lever and door, so insight was impossible; when all the elements are visible, animals use understanding.

## Significance
Insight learning challenged behaviourist accounts, supported the Gestalt view of learning as perceptual reorganisation, and led to modern research on problem solving and the aha experience. Critics noted that the chimpanzees' earlier experience with sticks helped, so insight builds on past learning.`,
    keyPoints: ["Tenerife station and Sultan", "Stick and box problems", "Suddenness, completeness, transfer", "Restructuring the field", "Contrast with Thorndike", "Role of prior experience"],
    pitfalls: ["Placing the study in Africa", "Ignoring the role of past experience"],
    module: "foundations/2-2",
    visuals: [
      {
        kind: "flow",
        caption: "Features of insight",
        data: {
          title: "The course of an insight",
          layout: "chain",
          nodes: [
            { id: "a", label: "Failed attempts", detail: "Reaching with one short stick." },
            { id: "p", label: "Pause", detail: "Looks over the whole situation." },
            { id: "r", label: "Restructuring", detail: "Two sticks seen as one long tool." },
            { id: "s", label: "Sudden solution", detail: "Joins sticks, pulls in the banana." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.2; Kohler, The Mentality of Apes; Schultz and Schultz ch 12",
  },
  {
    id: "hsys-l03-006",
    subject: S,
    topic: "gestalt",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Explain the Gestalt laws of perceptual organisation. Discuss the influence of Gestalt psychology beyond the study of perception.",
    plan: ["Gestalt's starting claim", "Figure and ground, then the grouping laws with examples", "Pragnanz and the brain", "Influence on learning, memory and thinking", "Influence on social psychology through Lewin, and on therapy", "Evaluation"],
    answer: `## Introduction
Gestalt psychology argued that perception is organised by the nervous system into wholes, according to lawful principles, before any learning takes place. Its laws of organisation are still the starting point for textbooks on perception, but its influence reached learning, memory, thinking, social psychology and even design.

## Figure and ground
The most basic organisation separates a figure, which looks solid and in front, from a ground, which seems to continue behind it. Edgar Rubin's vase that becomes two faces shows that the same contour can be assigned to either side, and the figure flips. We never see both at once.

## The laws of grouping
- Proximity: dots close together are seen as columns or rows. Students sitting together in a class photograph look like friends.
- Similarity: items of the same colour, shape or size group together, as players in the same jersey on a cricket field.
- Closure: we fill gaps to complete a figure; a circle with a small break still looks like a circle, and in the Kanizsa figure we see a bright triangle that is not drawn.
- Good continuation: we follow smooth paths, so two crossing lines are seen as two continuous lines rather than four meeting at a point.
- Common fate: elements moving in the same direction belong together, like a flock of birds.
- Symmetry and common region: symmetric shapes and items inside one boundary are grouped.

## Pragnanz
Pragnanz, or good form, sums up the laws: the perceptual field organises itself into the simplest, most regular and most stable form that the conditions allow. Wolfgang Kohler proposed isomorphism, that the brain's electrical fields share the structure of the experience. Experiments in the 1950s that disrupted brain currents with metal strips did not disturb perception, and the theory was largely abandoned, but the laws themselves remain robust.

## Influence on learning and thinking
- Insight learning: Kohler's chimpanzees solved problems by restructuring the field.
- Productive thinking: Wertheimer distinguished blind, rote solutions from understanding the structure of a problem, as when a child sees why the area of a parallelogram equals that of a rectangle.
- Functional fixedness: Karl Duncker, a Gestalt researcher, showed that people fail to use a box as a candle holder when it is presented full of tacks, because they see it only as a container.
- Memory: Bluma Zeigarnik, working with Lewin, found that interrupted tasks are recalled better than completed ones, since an unfinished task leaves a tension.

## Influence on social psychology
- Kurt Lewin's field theory held that behaviour is a function of the person and the environment, B equals f of P and E, as perceived in the life space.
- Lewin founded group dynamics, studied democratic, autocratic and laissez faire leadership climates with Lippitt and White, and developed action research and the three steps of change: unfreeze, change, refreeze.
- Fritz Heider's balance theory and later cognitive consistency theories, including Festinger's dissonance theory, grew from the Gestalt idea that the mind seeks good form in social relations as in perception. Festinger was Lewin's student.
- Solomon Asch, influenced by Gestalt ideas, showed that impressions of people are organised wholes in which central traits such as warm or cold change the meaning of the rest.

## Influence on therapy and design
Gestalt therapy, developed by Fritz and Laura Perls, borrowed the language of figure, ground and closure but is a separate tradition. In design, user interfaces and posters use proximity and similarity to group information.

## Evaluation
| Strength | Limitation |
| Laws are reliable and easy to show | Descriptive more than explanatory |
| Restored meaning and wholeness | Isomorphism not supported |
| Fruitful outside perception | Little attention to learning and culture in perception |
| Foundation of social psychology | Some laws conflict and lack a rule for which wins |
Modern research has quantified grouping strength and linked it to neural processing in visual cortex, and predictive coding models explain Pragnanz as the brain choosing the most probable interpretation.

## Conclusion
The Gestalt laws describe how perception builds wholes, and the movement's central idea, that organisation matters, changed how psychologists study thinking, memory and groups. Lewin's work alone makes Gestalt one of the most influential schools in the history of psychology.`,
    keyPoints: ["Figure and ground with reversible figure", "At least five grouping laws with examples", "Pragnanz", "Isomorphism and its failure", "Insight, productive thinking, functional fixedness, Zeigarnik", "Lewin's field theory and group dynamics", "Heider, Festinger and Asch", "Balanced evaluation"],
    pitfalls: ["Writing only perception and ignoring the second part", "Confusing Gestalt therapy with Gestalt psychology"],
    module: "foundations/2-2",
    visuals: [
      { kind: "illusion", caption: "Figure and ground", data: { kind: "figure-ground", title: "Rubin's reversible figure" } },
      {
        kind: "flow",
        caption: "Influence on social psychology",
        data: {
          title: "From Gestalt to social psychology",
          layout: "tree",
          nodes: [
            { id: "g", label: "Gestalt idea", detail: "Organisation and wholes." },
            { id: "l", label: "Lewin", parent: "g", detail: "Field theory, group dynamics, action research." },
            { id: "h", label: "Heider", parent: "g", detail: "Balance theory." },
            { id: "f", label: "Festinger", parent: "l", detail: "Cognitive dissonance." },
            { id: "a", label: "Asch", parent: "g", detail: "Impressions as organised wholes." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.2; Wagemans et al 2012 on a century of Gestalt; Schultz and Schultz ch 12; Lewin, Lippitt and White 1939",
  },
  {
    id: "hsys-l03-007",
    subject: S,
    topic: "gestalt",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on Kurt Lewin's field theory.",
    plan: ["Lewin and Gestalt roots", "B equals f of P and E", "Life space and its concepts", "Applications", "Evaluation"],
    answer: `## Roots
Kurt Lewin trained in Berlin with the Gestalt psychologists and moved to the United States in 1933. He applied the Gestalt idea of a dynamic field to motivation and social behaviour.

## The formula
Behaviour is a function of the person and the environment: B equals f of P and E. Neither the person nor the situation alone explains behaviour; what matters is how they combine at that moment.

## The life space
- The life space is the whole psychological field of a person at a given time: the person and the environment as the person sees it.
- It is divided into regions, such as home, work and friends, with boundaries that may be easy or hard to cross.
- Valences: regions attract with positive valence or repel with negative valence.
- Vectors: forces push the person towards or away from goals.
- Barriers block movement towards a goal.
- Tension arises from unmet needs, which explains the Zeigarnik effect of better memory for interrupted tasks.

## Conflicts
Lewin described approach approach, avoidance avoidance and approach avoidance conflicts. A student choosing between two good colleges faces approach approach conflict; choosing between a strict job and unemployment is avoidance avoidance.

## Applications and evaluation
Field theory led to group dynamics, the leadership climate studies, action research and the unfreeze, change, refreeze model of change. Its diagrams were vivid but hard to measure, and the theory made few precise predictions. Its formula remains the classic statement of the person and situation interaction.`,
    keyPoints: ["Gestalt roots", "B equals f of P and E", "Life space, regions, valences, vectors, barriers", "Tension and the Zeigarnik effect", "Three types of conflict", "Applications and limits"],
    pitfalls: ["Treating the life space as the physical environment", "Leaving out the conflict types"],
    module: "foundations/2-2",
    visuals: [
      {
        kind: "sort",
        caption: "Conflicts",
        data: {
          prompt: "Which of Lewin's conflicts is this?",
          buckets: ["Approach approach", "Avoidance avoidance", "Approach avoidance"],
          items: [
            { text: "Choosing between two good colleges", bucket: 0 },
            { text: "Studying a dull subject or failing the exam", bucket: 1 },
            { text: "A well-paid job in a city far from family", bucket: 2 },
          ],
        },
      },
    ],
    ref: "Foundations module 2.2; Lewin 1935 and 1936; Schultz and Schultz ch 12",
  },
  {
    id: "hsys-l03-008",
    subject: S,
    topic: "psychoanalytic-movement",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Discuss the origin of psychoanalysis and its place among the schools of psychology.",
    plan: ["Clinical origin in Vienna", "Influences on Freud", "Core ideas of the school", "How it differed from academic schools", "Spread and reception, including India", "Evaluation"],
    answer: `## Origin in the clinic
Sigmund Freud was a Viennese neurologist. In the 1880s he studied with Jean-Martin Charcot in Paris, who used hypnosis with patients with hysteria, now called conversion and dissociative symptoms. With Josef Breuer he treated patients such as Anna O, whose symptoms eased when she talked about painful memories, the talking cure. In 1895 they published case studies of hysteria. Freud replaced hypnosis with free association, and his book on dreams appeared in 1900.

## Influences
- Charcot and the French psychiatrists on hysteria and hypnosis.
- Earlier ideas of the unconscious in philosophy and literature.
- Fechner's ideas of mental energy and the constancy principle.
- Darwin's stress on instinct and development.
- Physiology of his teacher Ernst Brucke, who saw organisms as energy systems.

## Core ideas
- The unconscious: most mental life is outside awareness and shapes symptoms, dreams, slips and choices.
- The topographic model of conscious, preconscious and unconscious, and later the structural model of id, ego and superego.
- Psychosexual development through oral, anal, phallic, latency and genital stages, with the Oedipus complex at the centre.
- Defence mechanisms, especially repression, protect the ego from anxiety.
- Methods: free association, dream interpretation, analysis of resistance and transference.

## How it differed from the academic schools
| Point | Academic schools | Psychoanalysis |
| Setting | University laboratory | Private clinic |
| Data | Experiments, introspection, behaviour | Clinical cases, dreams, free association |
| Subject | Normal adult experience or behaviour | Abnormal behaviour, conflict, the unconscious |
| Aim | General laws | Understanding and treating individuals |

## Place among the schools
Psychoanalysis is usually called the first force in psychology. It was the only early school to come from medicine and the treatment of suffering, and it supplied the starting point for clinical psychology, psychiatry's talking treatments and many later personality theories, including those of its critics.

## Spread
Freud's lectures at Clark University in 1909 brought psychoanalysis to America, where it shaped psychiatry for decades. In India, Girindrasekhar Bose founded the Indian Psychoanalytical Society in Calcutta in 1922 and corresponded with Freud, proposing his own theory of opposite wishes.

## Evaluation
Psychoanalysis gave psychology the unconscious, defence, the importance of childhood and the profession of psychotherapy. Its theories were hard to test, its samples small and clinical, and its views of women were criticised. Modern research supports unconscious processing and some defences, and short psychodynamic therapies have evidence for depression and personality problems, but many of Freud's specific claims have not survived.`,
    keyPoints: ["Clinical origin with Charcot and Breuer", "Free association and the 1900 book on dreams", "Unconscious, structure, stages, defences", "Contrast with academic schools", "Spread through Clark 1909", "Bose in India", "Balanced evaluation"],
    pitfalls: ["Describing Freud as a laboratory psychologist", "Writing only Freud's personality theory"],
    module: "foundations/2-2",
    visuals: [
      {
        kind: "layers",
        caption: "Core ideas",
        data: {
          title: "Freud's topographic model",
          shape: "iceberg",
          layers: [
            { label: "Conscious", detail: "What you are aware of now." },
            { label: "Preconscious", detail: "Easily recalled, like a phone number." },
            { label: "Unconscious", detail: "Wishes and memories kept out of awareness that still shape behaviour." },
          ],
        },
      },
    ],
    ref: "Foundations module 2.2; Schultz and Schultz ch 13; Defences and psychodynamics modules",
  },
  {
    id: "hsys-l03-009",
    subject: S,
    topic: "psychoanalytic-movement",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Trace the development of the psychoanalytic movement after Freud. How did the neo-Freudians and later schools change psychoanalysis?",
    plan: ["The early split: Adler and Jung", "Neo-Freudians: Horney, Fromm, Sullivan, Erikson", "Ego psychology", "Object relations and self psychology", "Relational and modern developments, Indian voices", "Evaluation"],
    answer: `## Introduction
Freud founded psychoanalysis, but the movement soon split. Followers who disagreed with his emphasis on sexuality and biology left to found their own schools, and later generations shifted attention from instincts to the ego, to relationships and to culture. The history shows a theory changing from a drive psychology to a relational one.

## The early dissenters
- Alfred Adler broke with Freud in 1911 and founded individual psychology. He stressed feelings of inferiority, compensation, striving for superiority, social interest, birth order and lifestyle. Behaviour is goal-directed and social, not driven by sex.
- Carl Jung, whom Freud had seen as his successor, broke with him in 1913. His analytical psychology widened libido into general psychic energy and added the collective unconscious, made of archetypes such as the persona, shadow, anima and animus, and the self. He described introversion and extraversion and the process of individuation. Jung also studied Indian and Eastern thought.

## The neo-Freudians
- Karen Horney rejected penis envy, argued that culture shapes women's psychology, and placed basic anxiety at the root of neurosis. She described moving towards, against and away from people as neurotic trends.
- Erich Fromm linked character to society, describing escape from freedom and character types such as the marketing orientation.
- Harry Stack Sullivan defined personality as the pattern of interpersonal relations and developed an interpersonal psychiatry.
- Erik Erikson extended development across the whole life span in eight psychosocial stages, from trust versus mistrust to integrity versus despair, with identity versus role confusion in adolescence.
These writers shared a move from biology to culture and relationships.

## Ego psychology
Anna Freud described the mechanisms of defence in 1936 and worked with children. Heinz Hartmann proposed a conflict-free sphere of the ego, with functions such as perception and memory that develop independently of conflict and serve adaptation. Ego psychology dominated American psychoanalysis in the mid twentieth century.

## Object relations and self psychology
- Melanie Klein, working with young children through play, described early phantasies, splitting into good and bad objects, and the paranoid schizoid and depressive positions.
- Donald Winnicott described the good enough mother, the holding environment, transitional objects and the true and false self.
- Ronald Fairbairn argued that libido is object-seeking, not pleasure-seeking.
- John Bowlby, trained in this tradition, built attachment theory with ethological evidence, which Mary Ainsworth tested in the Strange Situation.
- Heinz Kohut's self psychology focused on narcissism and the need for mirroring and idealising relationships.
- Otto Kernberg linked object relations to borderline personality organisation.

## Relational and modern developments
Relational psychoanalysis sees therapy as a two-person process in which both participants shape what happens. Mentalisation-based treatment, developed by Peter Fonagy and Anthony Bateman, combines attachment and psychoanalytic ideas and has evidence for borderline personality disorder. Short-term psychodynamic therapies have been tested in trials for depression.

## Indian voices
Girindrasekhar Bose's theory of the opposite wish was an early independent revision of Freud. Later, Sudhir Kakar wrote psychoanalytic studies of Indian childhood and the family, arguing that close mother and child bonds and the extended family shape a relational Indian self, and Alan Roland described a familial self. These works ask whether a theory built in Vienna fits other cultures.

## Comparison
| Branch | Key figures | Central shift |
| Individual psychology | Adler | Inferiority and social interest |
| Analytical psychology | Jung | Collective unconscious, archetypes |
| Neo-Freudian | Horney, Fromm, Sullivan, Erikson | Culture and relationships |
| Ego psychology | Anna Freud, Hartmann | Adaptive ego functions |
| Object relations | Klein, Winnicott, Fairbairn | Early relationships |
| Self psychology | Kohut | The developing self and narcissism |

## Evaluation
The movement after Freud corrected his biological and gender biases, extended development across life and brought culture into the theory. It also fragmented into rival schools that were hard to test. Its most lasting scientific product, attachment theory, came from combining psychoanalytic questions with careful observation.

## Conclusion
Psychoanalysis survived Freud by changing. From drives to the ego, from the ego to relationships, and from Vienna to many cultures, it became a family of theories about how early relationships shape the self.`,
    keyPoints: ["Adler and Jung as early dissenters with key concepts", "Neo-Freudians and their shift to culture", "Ego psychology: Anna Freud and Hartmann", "Object relations: Klein, Winnicott, Fairbairn", "Bowlby and attachment as a bridge to science", "Kohut's self psychology", "Indian voices: Bose and Kakar", "Evaluation of fragmentation and testability"],
    pitfalls: ["Listing names without the central shift of each branch", "Calling Jung a neo-Freudian without comment", "No evaluation"],
    module: "foundations/2-2",
    visuals: [
      {
        kind: "flow",
        caption: "Comparison",
        data: {
          title: "Branches of psychoanalysis after Freud",
          layout: "tree",
          nodes: [
            { id: "f", label: "Freud", detail: "Drives, conflict, the unconscious." },
            { id: "a", label: "Adler", parent: "f", detail: "Individual psychology." },
            { id: "j", label: "Jung", parent: "f", detail: "Analytical psychology." },
            { id: "n", label: "Neo-Freudians", parent: "f", detail: "Horney, Fromm, Sullivan, Erikson." },
            { id: "e", label: "Ego psychology", parent: "f", detail: "Anna Freud, Hartmann." },
            { id: "o", label: "Object relations", parent: "f", detail: "Klein, Winnicott, Fairbairn." },
            { id: "s", label: "Self psychology", parent: "o", detail: "Kohut." },
          ],
        },
      },
    ],
    ref: "Schultz and Schultz ch 13 and 14; Mitchell and Black, Freud and Beyond; Foundations module 3.2 on Kakar and Bose",
  },
  {
    id: "hsys-l03-010",
    subject: S,
    topic: "humanistic-movement",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Why was humanistic psychology called the third force? Discuss its main assumptions and contributions.",
    plan: ["The two forces it opposed", "Founders and founding events", "Main assumptions", "Maslow and Rogers in brief", "Contributions", "Criticisms"],
    answer: `## The third force
By the 1950s American psychology had two dominant forces: psychoanalysis, which saw people as driven by unconscious instincts, and behaviourism, which saw them as shaped by reinforcement. Abraham Maslow and Carl Rogers argued that both left out what is most human: choice, values, growth and experience. They presented humanistic psychology as a third force. The Association for Humanistic Psychology was founded in the early 1960s, with its own journal.

## Main assumptions
- People are whole beings, more than the sum of their parts.
- People have free will and responsibility for their choices.
- There is an inborn tendency towards growth and self-actualisation.
- Subjective experience is the central data of psychology; the phenomenological method is preferred.
- Psychology should study healthy, creative people, not only the sick or animals.
- Research should be relevant to human problems and values.

## Abraham Maslow
Maslow arranged needs in a hierarchy: physiological, safety, belongingness and love, esteem, and self-actualisation. Lower deficiency needs must be met before growth needs become strong. He studied self-actualising people such as Lincoln and Einstein and found qualities such as acceptance, spontaneity, autonomy and peak experiences.

## Carl Rogers
Rogers developed client-centred, later person-centred, therapy. Psychological problems arise from incongruence between self-concept and experience, often due to conditions of worth set by others. Growth follows when a therapist offers three core conditions: unconditional positive regard, accurate empathy and congruence or genuineness. Rogers also pioneered recorded therapy sessions and outcome research.

## Contributions
- Person-centred counselling, now the base of counselling training worldwide, including in Indian counselling courses.
- Focus on the therapeutic relationship, later supported as a common factor in therapy outcome.
- Encounter groups and humanistic education.
- Positive psychology, which acknowledges humanism as a forerunner.
- Transpersonal psychology, the fourth force in Maslow's later usage, which drew on Indian and Buddhist ideas.

## Criticisms
- Concepts such as self-actualisation are vague and hard to measure.
- Maslow's hierarchy has weak evidence for a fixed order of needs and was based on a small, selected sample.
- An optimistic and individualistic view that may not fit collectivist cultures, where belonging and duty can rank above self-actualisation.
- Little interest in experiment, which limited its scientific influence.

## Conclusion
Humanism restored the person to psychology. Its research base was thin, but its ideas about relationship and growth shaped counselling and positive psychology.`,
    keyPoints: ["Explains why third force", "Founding of the association in the early 1960s", "Six assumptions", "Maslow's hierarchy and self-actualisation", "Rogers' three core conditions", "Contributions to counselling and positive psychology", "Criticisms including culture"],
    pitfalls: ["Calling humanism the second force", "No criticisms"],
    module: "foundations/2-2",
    visuals: [{ kind: "figure", caption: "Abraham Maslow", data: { id: "maslow-pyramid", title: "Maslow's hierarchy of needs" } }],
    ref: "Foundations module 2.2; Schultz and Schultz ch 14; Maslow 1943 and 1954; Rogers 1957",
  },
];
