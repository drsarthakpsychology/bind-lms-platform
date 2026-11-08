import type { LongQA } from "@/lib/prep/long-types";

const S = "developmental" as const;

export const DEVELOPMENTAL_L01: LongQA[] = [
  {
    id: "dev-l01-001",
    subject: S,
    topic: "piaget",
    marks: 20,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Describe Piaget's stages of cognitive development, with the main achievements and limitations of each stage and the experimental evidence for them.",
    plan: ["Piaget's approach and methods", "Sensorimotor stage with substages and object permanence", "Preoperational stage: symbolic thought, egocentrism, centration, animism", "Concrete operational stage: conservation, classification, seriation", "Formal operational stage: hypothetical-deductive reasoning", "Characteristics of stages and conclusion"],
    answer: `## Piaget's approach
Jean Piaget, a Swiss biologist turned psychologist, studied how children's thinking changes in quality, not just quantity, as they grow. Working first on intelligence tests with Alfred Binet's colleagues, he became interested in children's wrong answers, which showed consistent patterns of reasoning at different ages. He used careful observation of his own three children, the clinical interview method (open-ended questioning adapted to each child's answers) and ingenious tasks. He proposed that children actively construct knowledge through interaction with the environment and pass through four universal, invariant stages.

## Sensorimotor stage (birth to about 2 years)
Infants understand the world through their senses and actions. Piaget described six substages:
- Reflexes (0 to 1 month): sucking, grasping.
- Primary circular reactions (1 to 4 months): repeating pleasurable actions centred on the body, such as thumb sucking.
- Secondary circular reactions (4 to 8 months): repeating actions that produce interesting effects in the environment, such as shaking a rattle.
- Coordination of secondary schemes (8 to 12 months): intentional, goal-directed behaviour, such as pushing a cushion aside to reach a toy.
- Tertiary circular reactions (12 to 18 months): active experimentation with variations, like a "little scientist" dropping objects from different heights.
- Mental representation (18 to 24 months): the beginning of symbolic thought, deferred imitation and pretend play.
Key achievement: object permanence, the understanding that objects continue to exist when out of sight. Before about 8 months, infants stop searching when a toy is covered; at 8 to 12 months, they search but make the A-not-B error (searching where they found it before, not where they saw it hidden last); by 18 to 24 months, they can follow invisible displacements.

## Preoperational stage (about 2 to 7 years)
Children can use symbols (words, images, pretend play) but cannot yet carry out operations, mental actions that are logical and reversible.
- Symbolic function: language develops rapidly; a stick becomes a horse in play.
- Egocentrism: difficulty taking another's perspective. In the three mountains task, children aged 4 to 5 shown a model of three mountains chose a picture of their own view when asked what a doll on the other side would see.
- Centration: focusing on one feature of a situation and ignoring others.
- Lack of conservation: in the classic liquid task, when water is poured from a short, wide glass into a tall, thin one, the child says the tall glass has more, centring on height.
- Irreversibility: inability to mentally reverse an action.
- Animism: attributing life and feelings to objects ("the sun is following me").
- Artificialism and transductive reasoning (from particular to particular).
- Class inclusion problems: shown 7 brown and 3 white wooden beads and asked "Are there more brown beads or more wooden beads?", children say more brown beads.
Piaget divided this stage into the preconceptual (2 to 4) and intuitive (4 to 7) substages.

## Concrete operational stage (about 7 to 11 years)
Children can think logically about concrete, real objects and events.
- Conservation: of number (about 6 to 7), mass and length (7 to 8), weight (9 to 10) and volume (11 to 12). The staggered order is called horizontal decalage.
- Reversibility and decentration: understanding that pouring the water back would restore it, and that the tall glass is also narrower (compensation).
- Classification and class inclusion.
- Seriation: arranging objects in order of size, and transitive inference (if A is longer than B and B than C, then A is longer than C).
- Decline of egocentrism.
Limitation: difficulty with abstract and hypothetical problems.

## Formal operational stage (about 11 or 12 years onwards)
Adolescents can think abstractly, hypothetically and systematically.
- Hypothetical-deductive reasoning: generating and testing hypotheses. In Barbel Inhelder and Piaget's pendulum problem, adolescents systematically varied one factor at a time (length of string, weight, height of release, force) and discovered that only length affects the speed of swing; younger children varied several factors at once.
- Propositional thought: evaluating the logic of statements independent of real-world content.
- Abstract thinking about justice, identity, religion and the future, and idealism.
- Adolescent egocentrism (David Elkind): the imaginary audience and the personal fable.
Piaget later acknowledged that not all adults reach formal operations in all domains, and that education and expertise influence it.

## Characteristics of the stages
- Invariant sequence: all children pass through the stages in the same order, though at different rates.
- Universal across cultures.
- Qualitatively different modes of thought.
- Hierarchical integration: each stage builds on the previous one.
- Driven by maturation, experience with objects, social transmission and equilibration.

## Evidence and evaluation in brief
Cross-cultural studies, including in India, found the same order of stages but differences in timing, with conservation and formal operations depending on schooling and familiarity with materials. Later research showed that infants and young children are more competent than Piaget thought when tasks are simplified (for example Renee Baillargeon's object permanence studies and Martin Hughes's policeman task on egocentrism), and that development is more gradual and domain-specific.

## Conclusion
Piaget's stage theory describes a progression from action-based understanding in infancy, through symbolic but illogical thought, to logical reasoning about concrete objects and finally abstract thought. Despite later criticism of its timing and stage-like nature, it remains the foundation of the study of cognitive development and has shaped education, encouraging discovery learning and readiness-based teaching.`,
    keyPoints: ["Piaget's constructivist approach and methods", "Sensorimotor substages and object permanence with A-not-B", "Preoperational features: egocentrism with three mountains, centration, lack of conservation", "Class inclusion and animism", "Concrete operations with conservation order and horizontal decalage", "Formal operations with pendulum task", "Stage characteristics", "Brief evaluation and educational impact"],
    pitfalls: ["Giving stage ages as rigid", "Confusing egocentrism with selfishness"],
    module: "lifespan/2-1",
    visuals: [
      { kind: "timeline", caption: "Concrete operational stage (about 7 to 11 years)", data: { prompt: "Put Piaget's stages in order.", events: [{ label: "Sensorimotor: object permanence", when: "Birth to 2" }, { label: "Preoperational: symbols, egocentrism", when: "2 to 7" }, { label: "Concrete operational: conservation, logic about objects", when: "7 to 11" }, { label: "Formal operational: abstract, hypothetical thinking", when: "11 onwards" }] } },
      { kind: "conservation", caption: "Preoperational stage (about 2 to 7 years)", data: { kind: "liquid", caption: "Pour the water, then switch between a preoperational and a concrete operational child." } },
    ],
    ref: "Piaget 1952 and 1954; Piaget and Inhelder 1956 three mountains; Inhelder and Piaget 1958 pendulum; Santrock Life-Span Development ch 6; Berk Child Development ch 6; Dasen 1972 cross-cultural",
  },
  {
    id: "dev-l01-002",
    subject: S,
    topic: "piaget",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Explain Piaget's key concepts of schema, assimilation, accommodation and equilibration, with examples, and discuss their educational implications.",
    plan: ["Piaget's view of the child as active constructor", "Schema", "Assimilation and accommodation with examples", "Equilibration and factors in development", "Educational implications"],
    answer: `## The active child
Piaget saw children as little scientists who actively construct knowledge by acting on the world. Development is driven by two invariant functions, organisation (combining schemes into more complex systems) and adaptation (adjusting to the environment), which operates through assimilation and accommodation.

## Schema
A schema (scheme) is an organised pattern of thought or action that a person uses to understand and respond to experience. Infants' schemas are action-based, such as sucking and grasping; later schemas are mental, such as the concept of "dog" or the operation of addition.

## Assimilation
Assimilation is interpreting new experience in terms of existing schemas. A toddler who knows the schema "dog" (four legs, furry) sees a cow and calls it "doggy". A baby who grasps a rattle may grasp a spoon in the same way. Assimilation preserves existing knowledge but may distort the new experience to fit.

## Accommodation
Accommodation is changing existing schemas, or creating new ones, when the new experience does not fit. When the parent says "No, that is a cow; it says moo and is much bigger", the child modifies the "dog" schema and creates a "cow" schema. A baby learns that a ball must be grasped differently from a rattle. Accommodation produces genuine cognitive growth.

## Equilibration
Equilibration is the process of restoring balance between assimilation and accommodation. When new experiences cannot be assimilated, the child experiences disequilibrium (cognitive conflict), which motivates accommodation and the reorganisation of thought into a more advanced, stable state. Piaget saw equilibration as the main mechanism behind the transition from one stage to the next.

## Factors in development
Piaget named four factors: maturation of the nervous system, physical experience with objects, social transmission (learning from others), and equilibration, which coordinates the other three.

## Educational implications
- Discovery learning: children learn best by active exploration with concrete materials, not passive listening.
- Readiness: teaching should match the child's stage; abstract algebra before formal operations will be learned by rote.
- Cognitive conflict: teachers can present problems that challenge children's current ideas to provoke accommodation.
- Focus on the process of thinking, not just correct answers; children's errors reveal their schemas.
- Individual differences in rate of development.
- Peer interaction helps decentre thinking.
- Indian applications: activity-based learning methods, such as the Activity Based Learning programme in Tamil Nadu and the emphasis in the National Education Policy 2020 on play-based foundational learning, reflect constructivist ideas.

## Criticisms
The concepts are broad and hard to measure precisely, and Piaget underestimated the role of social and cultural guidance, which Vygotsky emphasised.

## Conclusion
Schemas, assimilation, accommodation and equilibration describe how children actively build understanding by fitting new experiences to old ideas and changing those ideas when they do not fit. These concepts underlie constructivist education.`,
    keyPoints: ["Organisation and adaptation", "Schema defined with example", "Assimilation with example", "Accommodation with example", "Equilibration and disequilibrium", "Four factors in development", "Educational implications including Indian examples"],
    module: "lifespan/2-1",
    visuals: [
      { kind: "flow", data: { title: "How a schema grows", layout: "cycle", nodes: [{ id: "s", label: "Schema", detail: "'Four-legged furry animals are dogs.'" }, { id: "a", label: "Assimilation", detail: "Sees a cow, says 'doggy'." }, { id: "d", label: "Disequilibrium", detail: "Told it is a cow; the idea does not fit." }, { id: "ac", label: "Accommodation", detail: "Creates a new 'cow' schema." }, { id: "e", label: "Equilibrium", detail: "A better organised understanding." }] } },
    ],
    ref: "Piaget 1952 and 1985 equilibration; Berk ch 6; Santrock ch 6; NEP 2020 foundational stage",
  },
  {
    id: "dev-l01-003",
    subject: S,
    topic: "piaget",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "mcp-entrance"],
    question: "Write a short note on conservation in Piaget's theory.",
    plan: ["Define conservation", "Classic tasks", "Why preoperational children fail", "Order of acquisition and criticisms"],
    answer: `## Meaning
Conservation is the understanding that certain properties of an object, such as number, mass, volume or length, stay the same despite changes in its appearance, as long as nothing is added or taken away. It marks the shift from preoperational to concrete operational thought.

## Classic tasks
- Liquid: two identical short glasses of water are agreed to be equal. One is poured into a tall, thin glass. The preoperational child says the tall glass has more water.
- Number: two equal rows of coins are lined up; one row is spread out. The child says the longer row has more.
- Mass: two equal balls of clay; one is rolled into a sausage.
- Length, area, weight and volume tasks.

## Why preoperational children fail
- Centration: focusing on one dimension (height of the water) and ignoring the other (width).
- Irreversibility: not realising the water could be poured back.
- Reliance on appearance rather than logic.
Concrete operational children give three justifications: identity ("nothing was added"), reversibility ("pour it back and it is the same") and compensation ("taller but thinner").

## Order and criticisms
Conservation appears in a typical order: number at about 6 to 7, mass and length at 7 to 8, weight at 9 to 10, and volume at 11 to 12 (horizontal decalage). James McGarrigle and Margaret Donaldson's "naughty teddy" study found that when an accidental-looking teddy bear disarranged the counters, many more 4 to 6-year-olds conserved, suggesting that asking the same question twice in the standard task misled children. Training and cultural familiarity with materials also improve performance; Patricia Greenfield found that Wolof children in Senegal conserved better when they poured the water themselves.`,
    keyPoints: ["Definition", "Liquid and number tasks", "Centration and irreversibility", "Identity, reversibility, compensation", "Horizontal decalage", "Naughty teddy critique"],
    module: "lifespan/2-1",
    visuals: [
      { kind: "conservation", caption: "Classic tasks", data: { kind: "number", caption: "Spread out one row of coins. Which reasons does the older child give?" } },
    ],
    ref: "Piaget 1952; McGarrigle and Donaldson 1974; Greenfield 1966; Berk ch 6",
  },
  {
    id: "dev-l01-004",
    subject: S,
    topic: "piaget",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Critically evaluate Piaget's theory of cognitive development in the light of later research on infant competence, task demands, culture and neo-Piagetian theories.",
    plan: ["Contributions of Piaget", "Underestimation of infants and young children", "Task demands and language", "Stage concept and domain-specificity", "Culture and social factors", "Neo-Piagetian and alternative theories; conclusion"],
    answer: `## Contributions
Piaget transformed developmental psychology. He showed that children think differently from adults, that they actively construct knowledge, and that development follows a sequence. He identified fascinating phenomena, including object permanence, egocentrism, conservation and formal reasoning, that remain central to research. His work shaped education, especially discovery learning and readiness. Yet decades of research have led to significant revisions.

## Underestimation of infants and young children
- Object permanence: Renee Baillargeon used the violation of expectation method, in which infants look longer at impossible events. Infants of 3.5 to 4.5 months looked longer when a screen appeared to rotate through the space occupied by a hidden box, suggesting they knew the box still existed. Piaget's search tasks required motor skills that young infants lack.
- Number: Karen Wynn found that 5-month-olds looked longer when one doll plus one doll appeared to result in one doll, suggesting basic arithmetic expectations.
- Deferred imitation appeared earlier than Piaget claimed; Andrew Meltzoff found 9-month-olds imitated actions after 24 hours.
- Core knowledge theorists such as Elizabeth Spelke argue that infants have innate knowledge systems for objects, number and agents.
However, some critics argue that looking-time results may reflect perceptual novelty rather than conceptual knowledge.

## Task demands and language
- Martin Hughes's policeman task: children aged 3.5 to 5 hid a boy doll from policeman dolls in a model with intersecting walls; 90 percent succeeded, suggesting that egocentrism in the three mountains task reflected an unfamiliar, difficult task rather than inability to take perspectives.
- McGarrigle and Donaldson's naughty teddy study: when a teddy "accidentally" spread out counters, many more young children conserved, showing that the standard task's repeated question suggested the answer should change.
- Margaret Donaldson argued that Piaget's tasks lacked "human sense"; when tasks make sense to children, they reason more competently.
- Class inclusion improves when the question is clearer.

## Stages and domain-specificity
- Development appears more gradual and uneven than distinct stages suggest. Horizontal decalage itself shows that children are not consistently at one stage across tasks.
- Expertise matters: child chess experts remember positions better than adult novices (Michelene Chi), showing domain-specific knowledge can outweigh general stage.
- Not all adults reach formal operations; estimates suggest perhaps only a third to a half of adults use formal reasoning consistently, and it depends heavily on education.
- Research on post-formal thought (such as dialectical and relativistic thinking) suggests development continues after adolescence.

## Culture and social factors
- Cross-cultural studies (Pierre Dasen and others) confirmed the sequence but found that timing, especially for conservation and formal operations, depends on schooling and cultural practices. In some societies without formal schooling, formal operations were rarely shown on Western tasks, though people reasoned well about familiar matters.
- Children of pottery-making families in Mexico conserved earlier.
- Indian studies with tribal and rural children, such as work on Piagetian tasks in different ecological settings, show the influence of schooling and familiarity.
- Piaget underplayed the role of social interaction, language and adult guidance, central to Vygotsky's sociocultural theory.

## Methodology
His clinical interview method was flexible but lacked standardisation; samples were small, including his own children; and he relied heavily on verbal explanations.

## Neo-Piagetian and alternative theories
- Neo-Piagetians such as Robbie Case and Juan Pascual-Leone kept the idea of stages but explained progression by increases in working memory capacity and processing efficiency.
- Kurt Fischer's dynamic skill theory describes development as uneven, context-dependent skill building.
- Information processing approaches explain development as gradual improvements in attention, memory, strategies and speed (Robert Siegler's overlapping waves model shows children use several strategies at once, with gradual shifts).
- Theory-theory and theory of mind research reveal early understanding of minds.
- Vygotsky's sociocultural theory emphasises culture and scaffolding.

## Conclusion
Piaget's broad picture of an active child moving towards more abstract, logical thought remains influential and largely accurate in sequence. But he underestimated early competence, overestimated stage consistency and the universality of formal operations, and neglected social and cultural influences. Modern theory integrates his constructivism with information processing, core knowledge and sociocultural approaches.`,
    keyPoints: ["Acknowledges Piaget's contributions", "Baillargeon's violation of expectation evidence", "Wynn or Meltzoff early competence", "Hughes's policeman task", "Naughty teddy and Donaldson's human sense", "Domain-specificity and formal operations not universal", "Cultural and social critique including Vygotsky", "Neo-Piagetian and information processing alternatives"],
    module: "lifespan/2-1",
    visuals: [
      { kind: "experiment", caption: "Task demands and language", data: { title: "Hughes's policeman task", question: "What share of 3.5 to 5-year-olds could hide the boy from the policemen?", unit: "%", conditions: [{ label: "Three mountains style task (Piaget)", value: 20 }, { label: "Policeman task (Hughes)", value: 90 }], why: "A task that makes human sense reveals perspective taking far earlier. The three mountains value is approximate." } },
      { kind: "compare", caption: "Stages and domain-specificity", data: { title: "Piaget then and now", a: { label: "Piaget's view", points: ["Object permanence near 8 to 12 months", "Preschoolers egocentric", "Clear general stages"], summary: "Late, stage-wise competence." }, b: { label: "Later research", points: ["Infants expect hidden objects by 3 to 4 months", "Preschoolers take perspectives in sensible tasks", "Gradual, domain-specific change"], summary: "Earlier, uneven competence." } } },
    ],
    ref: "Baillargeon 1987; Wynn 1992 Nature; Meltzoff 1988; Hughes 1975 cited in Donaldson 1978 Children's Minds; McGarrigle and Donaldson 1974; Dasen 1977; Case 1985; Siegler 1996; Spelke and Kinzler 2007",
  },
  {
    id: "dev-l01-005",
    subject: S,
    topic: "vygotsky",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Discuss Vygotsky's sociocultural theory of cognitive development. Explain the zone of proximal development, scaffolding, the role of language and cultural tools, and the educational applications of the theory.",
    plan: ["Vygotsky's background and core idea", "Social origins of higher mental functions", "Zone of proximal development", "Scaffolding with Wood, Bruner and Ross", "Language, private speech and cultural tools", "Educational applications, evaluation and conclusion"],
    answer: `## Core idea
Lev Vygotsky (1896 to 1934), a Russian psychologist, argued that cognitive development is fundamentally social and cultural. Children develop higher mental functions, such as voluntary attention, logical memory, planning and concept formation, through interaction with more skilled members of their culture, using tools and signs (especially language) that the culture provides. His work, suppressed in the Soviet Union for years, became influential in the West from the 1960s.

## Social origins of thinking
Vygotsky's general genetic law of cultural development states that every function in the child's development appears twice: first on the social level, between people (interpsychological), and then on the individual level, inside the child (intrapsychological). For example, a child first remembers where things are because a parent reminds her, and later uses self-reminders. Elementary functions (basic perception, attention, memory) are biological; higher functions are transformed by culture.

## The zone of proximal development
The zone of proximal development (ZPD) is the distance between what a child can do independently (the actual developmental level) and what the child can achieve with guidance from an adult or more capable peer (the potential developmental level). Two children who both score at the 8-year level on their own may differ: with help, one may reach the 12-year level and the other only the 9-year level. Their ZPDs differ. Vygotsky argued that good instruction should target the ZPD, leading development rather than waiting for it, and that assessment should include what children can do with help (dynamic assessment).

## Scaffolding
David Wood, Jerome Bruner and Gail Ross introduced the term scaffolding in 1976 to describe the support an expert provides within the ZPD, which is gradually withdrawn as the learner becomes competent. In their study, tutors helped 3 to 5-year-olds build a pyramid of interlocking blocks. Effective scaffolding involved:
- recruiting the child's interest,
- simplifying the task (reducing degrees of freedom),
- keeping the child focused on the goal,
- marking critical features,
- controlling frustration,
- demonstrating solutions.
David Wood and Heather Middleton found that the most effective mothers used contingent instruction: giving more help when the child failed and less when the child succeeded.

## Language and private speech
- Language is the most important cultural tool. It first serves social communication, then becomes a tool for thought.
- Private speech: young children talk aloud to themselves while solving problems. Piaget called this egocentric speech, a sign of immaturity that fades. Vygotsky saw it as self-guidance, the transition from social speech to inner speech, which increases when tasks are difficult. Research by Laura Berk supports Vygotsky: children use more private speech on challenging tasks, and those who do perform better.
- Inner speech: by middle childhood, private speech becomes silent thought.
- Concepts: Vygotsky distinguished spontaneous everyday concepts from scientific concepts learned at school, which become systematic through instruction.

## Cultural tools
Cultures provide tools that shape thinking: number systems, writing, maps, calendars, abacus, and today computers. Children in cultures that use the abacus develop mental calculation strategies based on imagining the beads. Barbara Rogoff extended Vygotsky's ideas to guided participation: children learn through participating in everyday cultural activities with others, such as Mayan girls learning weaving or Indian children learning to cook or tend shops.

## Educational applications
- Teaching within the ZPD and scaffolding: graded tasks, hints and prompts that fade.
- Reciprocal teaching (Annemarie Palincsar and Ann Brown): teacher and students take turns leading discussions using four strategies, questioning, summarising, clarifying and predicting, to improve reading comprehension.
- Cooperative learning and peer tutoring, where more capable peers scaffold others.
- Dynamic assessment: testing what children can learn with help, useful for children from disadvantaged backgrounds whose static test scores underestimate potential.
- Apprenticeship models and project-based learning.
- In India, multigrade classrooms and peer learning programmes such as Pratham's "Teaching at the Right Level", which groups children by learning level rather than age and uses targeted activities, reflect ZPD principles and have shown gains in reading and arithmetic in randomised evaluations.

## Evaluation
Strengths:
- Recognises the social and cultural nature of learning, explaining cultural differences in development.
- The ZPD and scaffolding are practical and supported by research.
- Influenced education worldwide.
Weaknesses:
- Concepts such as the ZPD are hard to measure precisely.
- Less detailed than Piaget on the specific stages and mechanisms of development.
- May underplay the child's independent discovery and biological maturation.
- Vygotsky died young, and his work was incomplete.

## Conclusion
Vygotsky showed that thinking develops through social interaction and cultural tools, especially language. The zone of proximal development and scaffolding provide powerful guidance for teaching, and the theory complements Piaget's focus on the individual child.`,
    keyPoints: ["Social and cultural origins of thinking", "General genetic law", "ZPD with example", "Scaffolding with Wood, Bruner and Ross and contingent instruction", "Private speech: Vygotsky versus Piaget with Berk's evidence", "Cultural tools and Rogoff's guided participation", "Applications such as reciprocal teaching and Teaching at the Right Level", "Balanced evaluation"],
    module: "lifespan/2-2",
    visuals: [
      { kind: "layers", data: { title: "The zone of proximal development", shape: "rings", layers: [{ label: "What I can do alone", detail: "Actual developmental level." }, { label: "What I can do with help", detail: "The zone of proximal development: teach here." }, { label: "What I cannot do yet, even with help", detail: "Beyond the current zone." }] } },
      { kind: "flow", data: { title: "Scaffolding a puzzle", layout: "chain", nodes: [{ id: "a", label: "Adult demonstrates", detail: "Shows how two pieces fit." }, { id: "b", label: "Shared doing", detail: "Child tries, adult hints at the next piece." }, { id: "c", label: "Prompts only", detail: "'Look at the colour on the edge.'" }, { id: "d", label: "Child alone", detail: "Support withdrawn." }] } },
    ],
    ref: "Vygotsky 1978 Mind in Society and 1986 Thought and Language; Wood, Bruner and Ross 1976; Wood and Middleton 1975; Berk 1992 private speech; Rogoff 1990 and 2003; Palincsar and Brown 1984; Banerjee et al 2016 Teaching at the Right Level",
  },
  {
    id: "dev-l01-006",
    subject: S,
    topic: "vygotsky",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Compare and contrast the theories of Piaget and Vygotsky on cognitive development.",
    plan: ["Common ground: constructivism", "Differences in source of development", "Role of language and private speech", "Learning and development, role of the teacher", "Stages, culture and universality", "Educational implications and synthesis"],
    answer: `## Common ground
Both Piaget and Vygotsky were constructivists: they saw children as active participants who construct understanding, rather than as passive recipients of knowledge or as products of maturation alone. Both studied qualitative changes in thought and influenced child-centred education.

## Key differences
| Issue | Piaget | Vygotsky |
| Source of development | Individual interaction with the physical world; child as lone scientist | Social interaction with more skilled others; child as apprentice |
| Direction | From the individual to the social | From the social to the individual |
| Role of culture | Largely universal stages; culture affects rate | Culture shapes the content and course of thought |
| Language | Reflects thought; develops from cognition | Shapes thought; becomes a tool for thinking |
| Private speech | Egocentric speech, sign of immaturity that fades | Self-guiding speech that becomes inner speech |
| Learning and development | Development precedes learning (readiness) | Learning can lead development (ZPD) |
| Stages | Four universal stages | No fixed stages; continuous, culturally variable |
| Role of the teacher | Facilitator who provides materials and cognitive conflict | Active guide who scaffolds within the ZPD |
| Peers | Peers of equal status create cognitive conflict | More capable peers provide guidance |
| Assessment | Independent performance | What the child can do with help (dynamic assessment) |

## Explanation of main differences
- Piaget emphasised equilibration within the child, driven by conflict between existing schemas and new experiences. Vygotsky emphasised the internalisation of social processes.
- For Piaget, a child's spontaneous discovery is the best route; adult teaching may lead to rote learning if the child is not ready. For Vygotsky, instruction is essential and should be slightly ahead of the child's independent level.
- On private speech, research by Laura Berk and others supports Vygotsky: private speech increases with task difficulty and predicts better performance.

## Evidence
- Studies of scaffolding (Wood, Bruner and Ross) and peer tutoring support Vygotsky.
- Studies showing that cognitive conflict between peers leads to progress on conservation (Willem Doise and Gabriel Mugny) support a social version of Piaget.
- Cross-cultural differences in cognitive development support Vygotsky's emphasis on culture, while the similar sequence of milestones supports Piaget's universality.

## Educational implications
- Piagetian classrooms: discovery learning, hands-on materials, readiness, respect for children's own reasoning.
- Vygotskian classrooms: scaffolding, cooperative learning, reciprocal teaching, assessment of potential.
- In practice, good teaching combines both: activity-based learning with sensitive guidance, as in many Indian primary education reforms.

## Synthesis
The theories are complementary: Piaget explains how the child constructs logical structures; Vygotsky explains how social and cultural contexts provide the tools and guidance for that construction. Modern sociocultural constructivism integrates both.`,
    keyPoints: ["Shared constructivism", "Comparison table with at least eight points", "Learning leads development versus readiness", "Private speech contrast with evidence", "Teacher and peer roles", "Evidence for each", "Complementary synthesis"],
    module: "lifespan/2-2",
    visuals: [
      { kind: "compare", caption: "Key differences", data: { title: "Piaget versus Vygotsky", a: { label: "Piaget", points: ["Child as lone scientist", "Development leads learning", "Private speech fades as immaturity"], summary: "Inside out." }, b: { label: "Vygotsky", points: ["Child as apprentice", "Learning leads development in the ZPD", "Private speech guides thinking"], summary: "Outside in." } } },
    ],
    ref: "Piaget 1952; Vygotsky 1978; Berk 1994; Doise and Mugny 1984; Santrock ch 6; Berk ch 6",
  },
  {
    id: "dev-l01-007",
    subject: S,
    topic: "information-processing",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Describe the information processing approach to cognitive development. What changes with age in attention, memory, speed and strategies?",
    plan: ["Core assumptions", "Processing speed and capacity", "Attention", "Memory and strategies", "Metacognition and Siegler's overlapping waves", "Evaluation and applications"],
    answer: `## Core assumptions
The information processing approach views the mind as a system that takes in, stores, transforms and retrieves information, like a computer, and explains cognitive development as gradual, continuous improvement in the components of that system, rather than as qualitative stages. Researchers study specific processes in detail, using precise tasks and computer models.

## Processing speed and capacity
- Robert Kail found that processing speed increases steadily across childhood in a similar exponential pattern across many tasks, suggesting a general change linked to brain maturation, such as myelination and synaptic pruning.
- Working memory capacity increases: digit span rises from about 2 to 3 items at age 2 to about 7 in adolescence.
- Faster processing frees capacity for more complex thinking, which neo-Piagetians such as Robbie Case used to explain stage progression.

## Attention
- Sustained attention improves through childhood.
- Selective attention: older children are better at ignoring irrelevant information.
- Planning and flexibility: children become better at shifting attention and planning searches, linked to prefrontal development.
- Executive functions (inhibition, working memory, cognitive flexibility) develop strongly from 3 to 7 years and continue through adolescence.

## Memory and strategies
- Rehearsal: John Flavell found that 5-year-olds rarely rehearsed items to remember, whereas 10-year-olds did so spontaneously. Younger children could rehearse if instructed but did not do it on their own (a production deficiency).
- Organisation: grouping items into categories develops around 9 to 10 years.
- Elaboration: creating meaningful links develops in adolescence.
- Utilisation deficiency: children may use a new strategy without benefit at first.
- Knowledge base: more knowledge makes learning and memory easier; Michelene Chi found that 10-year-old chess experts remembered chess positions better than adult novices, but not digit lists.
- Autobiographical memory develops with language and self-concept; eyewitness suggestibility is greater in young children.

## Metacognition and strategy choice
- Metacognition, knowledge about one's own thinking and memory, improves: older children better judge what they know and choose strategies.
- Robert Siegler's overlapping waves model: at any age, children use several strategies (for addition: counting all, counting on from the larger number, retrieval), and development involves gradual shifts in their frequency as more efficient strategies win out.
- Microgenetic methods track children's strategies trial by trial during learning.

## Evaluation
Strengths: precise, testable, explains gradual and domain-specific change and individual differences, and links to neuroscience. Weaknesses: the computer metaphor neglects emotion, motivation and social context; it describes components well but provides a less integrated picture of the whole child; it may underplay qualitative changes.

## Applications
- Teaching memory and study strategies explicitly.
- Reducing working memory load for young children and those with learning difficulties.
- Executive function programmes, such as Tools of the Mind.
- Understanding ADHD and specific learning disorders.

## Conclusion
The information processing approach explains cognitive development as gradual growth in speed, capacity, attention, strategies, knowledge and metacognition, offering precise explanations and practical teaching implications.`,
    keyPoints: ["Core assumptions and continuity", "Processing speed with Kail", "Working memory increases", "Attention and executive function", "Rehearsal and production deficiency with Flavell", "Knowledge base with Chi", "Metacognition and Siegler's overlapping waves", "Evaluation and applications"],
    module: "lifespan/2-2",
    visuals: [
      { kind: "compare", caption: "Memory and strategies", data: { title: "Young versus older child's memory", a: { label: "Age 5", points: ["Rarely rehearses", "Groups little", "Overestimates memory"], summary: "Production deficiency." }, b: { label: "Age 10", points: ["Rehearses spontaneously", "Organises by category", "Judges what needs more study"], summary: "Strategic memory." } } },
    ],
    ref: "Kail 1991; Flavell, Beach and Chinsky 1966; Chi 1978; Siegler 1996; Case 1985; Diamond 2013 executive functions; Berk ch 7",
  },
  {
    id: "dev-l01-008",
    subject: S,
    topic: "information-processing",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is theory of mind? Describe the false belief task and other evidence on its development, and discuss its relevance to autism.",
    plan: ["Define theory of mind", "Sally Anne and Smarties tasks", "Developmental course and earlier competence", "Influences: language, siblings, culture", "Autism and mindblindness, critique"],
    answer: `## Meaning
Theory of mind (ToM) is the ability to understand that people have mental states, such as beliefs, desires, intentions and emotions, that differ from one's own and from reality, and to use this understanding to explain and predict behaviour. David Premack and Guy Woodruff coined the term in 1978 in research on chimpanzees.

## False belief tasks
- Sally Anne task (Simon Baron-Cohen, Alan Leslie and Uta Frith, based on Heinz Wimmer and Josef Perner's work): Sally puts her marble in a basket and leaves. Anne moves the marble to a box. Where will Sally look for her marble when she returns? Children who understand false belief say "the basket", because Sally did not see the move. Most 3-year-olds say "the box", where the marble really is.
- Unexpected contents (Smarties) task: children are shown a Smarties tube and asked what is inside; they say sweets. It is opened to reveal pencils. Asked what another child will think is inside, 3-year-olds say "pencils" and often claim they themselves had thought pencils.
Most children pass standard false belief tasks at about 4 to 5 years.

## Developmental course
- Precursors in infancy: joint attention (following gaze and pointing, around 9 to 12 months), understanding intentions, and pretend play (around 18 months).
- Around 2 years: understanding of desires ("she wants an apple").
- Around 4 years: understanding of false beliefs.
- Later: second-order beliefs ("he thinks that she thinks...") by about 6 to 7, understanding of sarcasm, white lies and faux pas in middle childhood.
- Implicit understanding: Kristine Onishi and Renee Baillargeon found that 15-month-olds looked longer when an actor searched where a toy really was rather than where she falsely believed it to be, suggesting earlier implicit ToM, though replications have been mixed.

## Influences
- Language: children with better language, especially complements ("She thinks that..."), pass earlier; deaf children of hearing parents with delayed sign language are delayed in ToM.
- Siblings: children with older siblings pass earlier.
- Parents' talk about mental states.
- Culture: children in some cultures pass slightly later, and the order of ToM milestones differs between China and the West (Henry Wellman's research), though the general trajectory is similar.

## Relevance to autism
- Baron-Cohen, Leslie and Frith found that 80 percent of children with autism, with a mean verbal mental age above 4, failed the Sally Anne task, while 86 percent of children with Down syndrome of lower mental age passed. They proposed that autism involves a specific deficit in ToM ("mindblindness").
- This helps explain difficulties with social communication, pretend play and understanding deception.
- Critiques: some autistic individuals pass false belief tasks but still have social difficulties, suggesting ToM is not the only explanation; weak central coherence and executive dysfunction theories offer other accounts; and Damian Milton's "double empathy problem" argues that communication difficulties are mutual between autistic and non-autistic people.

## Conclusion
Theory of mind develops from early joint attention to explicit false belief understanding around age 4, shaped by language and social experience. Differences in ToM contribute to the social profile of autism, though they do not explain it fully.`,
    keyPoints: ["Definition and Premack origin", "Sally Anne procedure and typical results", "Smarties task", "Developmental milestones from joint attention to second-order beliefs", "Implicit ToM evidence", "Influences of language, siblings and culture", "Autism study figures and critiques"],
    module: "lifespan/2-2",
    visuals: [
      { kind: "decide", caption: "False belief tasks", data: { scene: "Sally puts her marble in the basket and leaves. Anne moves it to the box. Sally comes back.", ask: "Where will Sally look first?", choices: [{ label: "In the box", verdict: "harm", outcome: "That is where the marble is, but Sally did not see it moved.", why: "Typical answer of most 3-year-olds." }, { label: "In the basket", verdict: "best", outcome: "Correct: Sally holds a false belief.", why: "Passing shows understanding that beliefs can differ from reality." }] } },
    ],
    ref: "Premack and Woodruff 1978; Wimmer and Perner 1983; Baron-Cohen, Leslie and Frith 1985 Cognition; Perner, Leekam and Wimmer 1987; Onishi and Baillargeon 2005; Wellman, Cross and Watson 2001 meta-analysis; Milton 2012",
  },
  {
    id: "dev-l01-009",
    subject: S,
    topic: "piaget",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on object permanence.",
    plan: ["Define object permanence", "Piaget's observations and A-not-B error", "Baillargeon's findings", "Significance"],
    answer: `## Meaning
Object permanence is the understanding that objects continue to exist even when they cannot be seen, heard or touched. Piaget considered it the major achievement of the sensorimotor stage.

## Piaget's observations
- Before about 4 months, infants show no reaction when a toy disappears: "out of sight, out of mind".
- At 4 to 8 months, infants retrieve a partly hidden toy but not a completely hidden one.
- At 8 to 12 months, infants search for a hidden toy, but make the A-not-B error: after repeatedly finding a toy under cloth A, they continue to search at A even after watching it being hidden under cloth B.
- At 12 to 18 months, infants search at the last place they saw the object hidden, but not after invisible displacements.
- By 18 to 24 months, they infer where objects have gone, showing full mental representation.

## Baillargeon's findings
Renee Baillargeon used the violation of expectation method. Infants of 3.5 to 4.5 months watched a screen rotate towards a box hidden behind it. When the screen appeared to pass through the space where the box should be (an impossible event), infants looked longer than at a possible event, suggesting they expected the hidden box to still exist. Piaget may have underestimated infants because his tasks required planned reaching. Adele Diamond linked the A-not-B error to immature prefrontal inhibition of a previously rewarded response.

## Significance
Object permanence underlies mental representation, memory for absent people and objects, and attachment: separation anxiety appears around 8 months, when infants know a caregiver exists elsewhere. Games like peekaboo delight infants who are developing this understanding.`,
    keyPoints: ["Definition", "Piaget's sequence", "A-not-B error", "Baillargeon's rotating screen study", "Diamond's prefrontal explanation", "Link to attachment and representation"],
    module: "lifespan/2-1",
    visuals: [
      { kind: "timeline", caption: "Piaget's observations", data: { prompt: "Order the steps in object permanence.", events: [{ label: "No search when a toy is hidden", when: "Below 4 months" }, { label: "Retrieves a partly hidden toy", when: "4 to 8 months" }, { label: "Searches but makes the A-not-B error", when: "8 to 12 months" }, { label: "Follows visible moves", when: "12 to 18 months" }, { label: "Infers invisible moves", when: "18 to 24 months" }] } },
    ],
    ref: "Piaget 1954; Baillargeon, Spelke and Wasserman 1985; Baillargeon 1987; Diamond 1985",
  },
  {
    id: "dev-l01-010",
    subject: S,
    topic: "vygotsky",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on private speech.",
    plan: ["Define private speech", "Piaget versus Vygotsky", "Research evidence", "Implications"],
    answer: `## Meaning
Private speech is speech that children address to themselves rather than to others, often audible, as when a 4-year-old doing a puzzle says, "This piece goes here... no, the blue one first." It is common between about 3 and 7 years and gradually becomes whispered and then silent inner speech.

## Piaget versus Vygotsky
- Piaget called it egocentric speech, reflecting the preoperational child's inability to take the listener's perspective. He predicted that it would disappear as children became less egocentric and more social.
- Vygotsky argued that private speech is a tool for thinking and self-regulation. Social speech from adults ("Be careful, slow down") is taken over by the child, spoken aloud to guide behaviour, and then internalised as inner speech. It should increase when tasks are difficult.

## Research evidence
- Laura Berk and colleagues found that private speech is more frequent on challenging tasks, when children work alone, and after making errors.
- Children who use more task-relevant private speech perform better and improve faster.
- Private speech is more common in children whose parents scaffold sensitively.
- Children with ADHD use private speech later and less effectively, consistent with weak self-regulation.
These findings support Vygotsky's view.

## Implications
Teachers and parents should not discourage children from talking to themselves while working; quiet "thinking aloud" can be encouraged. Self-instruction training, developed by Donald Meichenbaum, teaches impulsive children to guide their behaviour with private speech, moving from overt to covert self-talk.`,
    keyPoints: ["Definition and age", "Piaget's egocentric speech view", "Vygotsky's self-regulation view", "Berk's evidence", "Implications including Meichenbaum's self-instruction"],
    module: "lifespan/2-2",
    visuals: [
      { kind: "flow", caption: "Piaget versus Vygotsky", data: { title: "From social speech to inner speech", layout: "chain", nodes: [{ id: "s", label: "Social speech", detail: "Parent: 'Turn the piece around.'" }, { id: "p", label: "Private speech", detail: "Child aloud: 'Turn it around.'" }, { id: "w", label: "Whispered speech" }, { id: "i", label: "Inner speech", detail: "Silent thinking." }] } },
    ],
    ref: "Vygotsky 1986; Berk 1992 and 1994; Meichenbaum and Goodman 1971",
  },
];
