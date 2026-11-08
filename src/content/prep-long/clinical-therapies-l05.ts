import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, timeline, tree } from "./visual";

export const CLINICAL_THERAPIES_L05: LongQA[] = anchored([
  {
    id: "ther-l05-001",
    subject: "clinical-therapies",
    topic: "yalom-factors",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Discuss Yalom's therapeutic factors in group psychotherapy.",
    plan: ["Introduce group therapy and Yalom", "Describe all eleven factors with examples", "Which factors matter most and when", "The here and now and the therapist's role", "Indian relevance and conclusion"],
    answer: `## Introduction
Group psychotherapy treats several people together with one or two therapists. Irvin Yalom, from his research and clinical work, described eleven therapeutic factors that explain how groups help, in "The Theory and Practice of Group Psychotherapy".

## The eleven factors
- Instillation of hope: seeing others improve gives hope ("If she can get better, so can I").
- Universality: discovering that others share similar problems, reducing isolation and shame; often the first relief people feel.
- Imparting information: teaching and advice from therapists and members (psychoeducation about illness, coping tips).
- Altruism: helping others raises self esteem and gives meaning.
- Corrective recapitulation of the primary family group: the group recreates family patterns (rivalry, seeking approval from the leader), which can be understood and changed.
- Development of socialising techniques: learning social skills through feedback and practice.
- Imitative behaviour: learning by observing the therapist and other members (modelling).
- Interpersonal learning: members see how they affect others and try new ways of relating; Yalom saw the group as a "social microcosm".
- Group cohesiveness: a sense of belonging and acceptance, the group equivalent of the therapeutic alliance; associated with better outcomes.
- Catharsis: expression of strong feelings, helpful when combined with learning.
- Existential factors: recognising life's unfairness, mortality, responsibility for one's own life and ultimate aloneness.

## Which factors matter most
In Yalom's studies of long term outpatient groups, members rated interpersonal learning, catharsis, cohesiveness and self understanding highest. In short term inpatient groups, instillation of hope, universality and existential factors were often valued more. Support groups (such as Alcoholics Anonymous) rely heavily on hope, universality, altruism and information.

## The here and now and the therapist's role
Yalom emphasised working in the "here and now": attention to interactions happening in the group, followed by reflection on them (process illumination). The therapist creates and maintains the group, builds a culture of openness, acceptance and feedback, and models honest, non judgemental behaviour.

## Indian relevance
Group formats suit India's shortage of therapists and collectivist culture: family groups for schizophrenia, de addiction groups, support groups for carers of people with dementia, and groups for students. Cultural factors (hierarchy, reluctance to disclose family matters in front of strangers, language and gender) need attention.

## Conclusion
Yalom's therapeutic factors describe the mechanisms through which groups help: hope, universality, learning from others, cohesiveness and interpersonal learning. They guide group design and leadership.`,
    keyPoints: ["Yalom and the book", "All eleven factors", "Examples for each", "Universality as early relief", "Cohesiveness as the group alliance", "Interpersonal learning and social microcosm", "Which factors are valued in different groups", "Here and now and Indian relevance"],
    visuals: [tree("The eleven factors", [["Therapeutic factors", "", -1], ["Hope and universality", "I am not alone", 0], ["Information and altruism", "Learning and helping", 0], ["Family recapitulation", "Old patterns replayed", 0], ["Socialising and imitation", "New skills", 0], ["Interpersonal learning and cohesiveness", "The group as a social microcosm", 0], ["Catharsis and existential factors", "Feelings and meaning", 0]])],
    module: "therapies",
    ref: "Yalom and Leszcz 2020 The Theory and Practice of Group Psychotherapy; Burlingame group cohesion meta-analysis",
  },
  {
    id: "ther-l05-002",
    subject: "clinical-therapies",
    topic: "group-stages",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on the stages of group development and the selection of patients for group therapy.",
    plan: ["Stages of development", "Group types", "Selection and preparation", "Common problems"],
    answer: `## Stages of group development
Bruce Tuckman's model is widely used:
- Forming: members are polite, dependent on the leader, uncertain about goals and rules.
- Storming: conflict, competition and challenges to the leader as members assert themselves.
- Norming: cohesion develops, shared norms and trust emerge.
- Performing: the group works productively on its tasks with openness and feedback.
- Adjourning (added later): ending, with feelings of loss and review of progress.
Yalom described similar phases of orientation, conflict and cohesiveness.

## Group types
Open groups (members join and leave) and closed groups (fixed membership and duration); homogeneous (same problem, such as depression or alcohol) and heterogeneous; psychoeducational, CBT, interpersonal, psychodynamic and support groups.

## Selection and preparation
- Good candidates: motivation, some capacity for relationships and self reflection, ability to tolerate the group setting, problems that fit the group's focus.
- Exclusions (relative): acute psychosis or mania, severe suicide risk, severe paranoia, intoxication, people who will be very deviant from the group, and those unable to attend regularly.
- Pre group preparation: explaining aims, rules (confidentiality, attendance, no contact outside or with clear rules), and what to expect, reduces dropout.
- Size of about 6 to 10 members.

## Common problems
Early dropout, scapegoating, monopolising members, silent members, subgrouping, and breaches of confidentiality; the therapist addresses these openly as group process.

## Conclusion
Groups go through predictable stages, and careful selection and preparation improve their effectiveness.`,
    keyPoints: ["Tuckman's five stages", "Yalom's similar phases", "Open and closed, homogeneous and heterogeneous", "Selection criteria and exclusions", "Pre group preparation and size", "Common problems"],
    visuals: [timeline("Stages of group development", [["Forming", "Polite, dependent"], ["Storming", "Conflict"], ["Norming", "Cohesion"], ["Performing", "Productive work"], ["Adjourning", "Ending"]])],
    module: "therapies",
    ref: "Tuckman 1965, Tuckman and Jensen 1977; Yalom 2020",
  },
  {
    id: "ther-l05-003",
    subject: "clinical-therapies",
    topic: "psychodrama",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on psychodrama.",
    plan: ["Origin and concepts", "Elements", "Techniques", "Uses and limits"],
    answer: `## Origin and concepts
Jacob Levy Moreno, a Viennese psychiatrist who later worked in the USA, developed psychodrama in the 1920s and 1930s. He believed that spontaneity and creativity are central to health and that acting out life situations allows emotional release (catharsis) and new learning. He also developed sociometry and coined the term "group psychotherapy".

## Elements
- Protagonist: the person whose story is enacted.
- Director: the therapist who guides the session.
- Auxiliary egos: group members who play significant others in the protagonist's life.
- Audience: other group members who watch and later share.
- Stage: the space for action.
A session has three phases: warm up, enactment (action) and sharing (members share their own related experiences, not advice).

## Techniques
- Role reversal: the protagonist plays the other person, seeing the situation from their side.
- Doubling: another member stands behind the protagonist and voices unspoken thoughts and feelings.
- Mirroring: the protagonist watches someone else play them.
- Soliloquy: speaking thoughts aloud.
- Empty chair: speaking to an absent person.
- Future projection: rehearsing a future situation.

## Uses and limits
Used in groups for trauma, grief, relationship problems, addiction, and in training and drama therapy. It can be powerful but can also overwhelm vulnerable people; it needs trained directors, careful selection and containment. Research evidence is limited. Role play methods in other therapies (social skills training, Gestalt empty chair) owe much to psychodrama.

## Conclusion
Psychodrama uses dramatic enactment within a group to explore and rehearse life situations, with role reversal and doubling as signature techniques.`,
    keyPoints: ["Moreno and spontaneity", "Protagonist, director, auxiliary egos, audience, stage", "Warm up, enactment, sharing", "Role reversal and doubling", "Other techniques", "Uses, risks and limited evidence"],
    module: "therapies",
    ref: "Moreno Psychodrama vol 1 1946; Kipper and Ritchie 2003 meta-analysis",
  },
  {
    id: "ther-l05-004",
    subject: "clinical-therapies",
    topic: "gestalt-therapy",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Describe Gestalt therapy: its key concepts and techniques.",
    plan: ["Origins", "Key concepts", "Contact boundary disturbances", "Techniques", "Evaluation and conclusion"],
    answer: `## Origins
Fritz Perls, with Laura Perls and Paul Goodman, developed Gestalt therapy in the 1940s and 1950s. It drew on Gestalt psychology of perception (the whole is more than the sum of its parts), psychoanalysis (Perls trained as an analyst), existentialism, phenomenology and Eastern ideas. It became popular through workshops at Esalen in the 1960s.

## Key concepts
- Holism: the person is a unified whole of body, emotion and thought, in a field with the environment.
- Awareness: the central goal; becoming aware of what one is feeling, thinking and doing now is itself curative.
- Here and now: focus on present experience rather than explanations about the past ("what" and "how", not "why").
- Figure and ground: needs emerge as "figures" from the background; healthy functioning completes the cycle so the need recedes. Unmet needs and unexpressed feelings become "unfinished business" that keeps intruding.
- Responsibility: owning one's feelings and choices ("I" statements rather than "it").
- The paradoxical theory of change (Beisser): change occurs when one becomes fully what one is, not by trying to be what one is not.

## Contact boundary disturbances
Ways of interrupting contact with self and environment:
- Introjection: swallowing others' rules whole ("I must always obey").
- Projection: attributing one's own feelings to others.
- Retroflection: doing to oneself what one wants to do to others (holding back anger and turning it inward).
- Deflection: avoiding direct contact through jokes or vagueness.
- Confluence: blurring the boundary between self and others.

## Techniques
- Empty chair work: talking to an imagined person (or part of oneself) in an empty chair, then switching chairs, to address unfinished business.
- Two chair dialogue: between conflicting parts of the self, such as the "top dog" (demanding) and the "underdog" (resisting).
- Exaggeration: exaggerating a gesture or tone to increase awareness.
- Staying with the feeling rather than escaping it.
- Dream work: each part of a dream is seen as part of the self and is spoken as "I".
- Language changes: "I won't" instead of "I can't"; present tense.
- Experiments designed with the client in the session.

## Evaluation
Strengths: experiential, emotionally vivid, focus on awareness and responsibility; its chair techniques are used in emotion focused therapy and schema therapy, which have trial evidence. Limits: few controlled trials of Gestalt therapy itself; early confrontational styles could be harsh; less suitable for people with psychosis or very fragile self structure.

## Conclusion
Gestalt therapy aims to increase awareness in the here and now, complete unfinished business and take responsibility, using experiential techniques such as the empty chair.`,
    keyPoints: ["Perls and influences", "Holism and awareness", "Here and now with what and how", "Figure and ground and unfinished business", "Paradoxical theory of change", "Contact boundary disturbances", "Empty chair and two chair techniques", "Evaluation and influence on EFT"],
    visuals: [compare("Two chair dialogue", ["Top dog", ["Demanding", "Should and must", "Critical"], "The inner critic"], ["Underdog", ["Resisting", "Excuses and delays", "Hurt"], "The criticised self"], "Techniques")],
    module: "therapies",
    ref: "Perls, Hefferline and Goodman 1951; Beisser 1970 paradoxical theory; Greenberg emotion focused therapy chair work",
  },
  {
    id: "ther-l05-005",
    subject: "clinical-therapies",
    topic: "existential-therapy",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Discuss existential psychotherapy and Frankl's logotherapy.",
    plan: ["Philosophical roots", "Yalom's four ultimate concerns", "Existential therapy approach", "Frankl's logotherapy and techniques", "Evaluation and Indian relevance"],
    answer: `## Philosophical roots
Existential psychotherapy draws on philosophers such as Kierkegaard, Nietzsche, Heidegger and Sartre, and on therapists such as Ludwig Binswanger, Medard Boss, Rollo May, Viktor Frankl and Irvin Yalom. It focuses on the human condition: freedom, choice, responsibility, meaning and mortality, rather than symptoms or techniques.

## Yalom's four ultimate concerns
- Death: awareness of mortality causes anxiety, but facing it can make life more vivid and meaningful.
- Freedom and responsibility: we are free to choose and responsible for our choices; this freedom can be frightening, leading people to avoid decisions.
- Existential isolation: however close we are to others, an unbridgeable gap remains; trying to escape it can lead to fusion or using others.
- Meaninglessness: life has no given meaning, so we must create meaning.
Anxiety, depression and avoidance are seen as responses to these concerns.

## The existential approach
- The therapeutic relationship is a genuine encounter between two people, with authenticity and presence.
- Phenomenological exploration of the person's lived experience.
- Helping people recognise choices, take responsibility, face limits (death, loss) and live authentically.
- Few fixed techniques; often integrated with other therapies.

## Frankl's logotherapy
Viktor Frankl, a Viennese psychiatrist who survived Nazi concentration camps, described in "Man's Search for Meaning" how finding meaning helped people survive. Logotherapy holds:
- The will to meaning is the primary human motive (not pleasure, as in Freud, or power, as in Adler).
- Meaning can be found through creative work and deeds, through experiencing love, nature or beauty, and through the attitude taken towards unavoidable suffering.
- Lack of meaning produces an "existential vacuum" and "noogenic neurosis".
Techniques:
- Paradoxical intention: asking the person to wish for or exaggerate what they fear (for example, trying to sweat as much as possible when afraid of sweating), which breaks anticipatory anxiety.
- Dereflection: shifting attention away from excessive self observation (for example, in sexual dysfunction or insomnia) towards other people or tasks.
- Socratic dialogue to discover meaning.

## Evaluation
Strengths: addresses meaning, loss and mortality, which are central in serious illness, bereavement and ageing; meaning centred psychotherapy (Breitbart), based on Frankl, has trial evidence in advanced cancer. Limits: few controlled trials of existential therapy in general, abstract concepts, and less structure for severe mental illness.

## Indian relevance
Indian philosophical traditions (the Bhagavad Gita's teaching on action without attachment to results, ideas of dharma and karma) also address meaning and suffering, and can be used respectfully in existential work.

## Conclusion
Existential therapy and logotherapy help people face death, freedom, isolation and meaninglessness and find meaning even in suffering. Their ideas are especially useful in palliative care and grief.`,
    keyPoints: ["Philosophical roots and key therapists", "Yalom's four ultimate concerns", "Therapy as authentic encounter", "Frankl and will to meaning", "Three sources of meaning", "Paradoxical intention and dereflection", "Meaning centred psychotherapy evidence", "Indian philosophical links"],
    visuals: [tree("Yalom's four ultimate concerns", [["Existential concerns", "", -1], ["Death", "Mortality", 0], ["Freedom", "Choice and responsibility", 0], ["Isolation", "Ultimate aloneness", 0], ["Meaninglessness", "Creating meaning", 0]])],
    module: "therapies",
    ref: "Yalom 1980 Existential Psychotherapy; Frankl 1946 Man's Search for Meaning; Breitbart 2015 meaning-centred group psychotherapy",
  },
  {
    id: "ther-l05-006",
    subject: "clinical-therapies",
    topic: "reality-therapy",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on reality therapy.",
    plan: ["Origin and choice theory", "Basic needs", "The WDEP system", "Uses and critique"],
    answer: `## Origin and choice theory
William Glasser, an American psychiatrist, developed reality therapy in the 1960s, first in a school for delinquent girls and a psychiatric hospital. It is based on choice theory: people choose their behaviour, which includes acting, thinking, feeling and physiology ("total behaviour"), in an attempt to meet their needs. We cannot control others, only ourselves.

## Basic needs
Five basic needs: survival, love and belonging, power (achievement, recognition), freedom and fun. Each person has a "quality world" of pictures of what would satisfy these needs. Problems arise when people try to meet needs in ineffective ways, most often in unsatisfying relationships.

## The WDEP system
Robert Wubbolding summarised the method:
- W: wants: what do you really want? What do you want from this relationship or situation?
- D: doing and direction: what are you doing now? Where is it taking you?
- E: evaluation: is what you are doing helping you get what you want? (the core step)
- P: planning: a simple, specific, realistic plan of action that the person commits to.
The therapist is warm, involved and present focused, avoids criticism, blame and excuses, and does not give up on the client.

## Uses and critique
Used in schools, correctional settings, addiction services and counselling. It is practical, present focused and emphasises responsibility. Critics note limited research evidence, a downplaying of mental illness and biological factors (Glasser rejected many psychiatric diagnoses), and a risk of blaming people for problems outside their control.

## Conclusion
Reality therapy helps people evaluate whether their current behaviour meets their needs and plan more effective choices, using the WDEP framework.`,
    keyPoints: ["Glasser and choice theory", "Total behaviour", "Five basic needs and quality world", "WDEP steps", "Therapist stance", "Uses and critique"],
    module: "therapies",
    ref: "Glasser 1965 Reality Therapy, 1998 Choice Theory; Wubbolding 2011",
  },
  {
    id: "ther-l05-007",
    subject: "clinical-therapies",
    topic: "emdr",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe eye movement desensitisation and reprocessing. Critically evaluate its mechanism and evidence.",
    plan: ["Origin", "Adaptive information processing model", "The eight phases", "Evidence", "Mechanism debate and critique", "Conclusion"],
    answer: `## Origin
Francine Shapiro reported in 1987 that her distressing thoughts faded while her eyes moved quickly from side to side during a walk. She developed eye movement desensitisation and reprocessing (EMDR) as a treatment for traumatic memories.

## Adaptive information processing model
Shapiro proposed that traumatic experiences are stored in an unprocessed, isolated form, with their original images, emotions, beliefs and body sensations. Recalling the memory while attending to bilateral stimulation is thought to help the brain process and integrate it with adaptive information, so that it loses its emotional charge.

## The eight phases
- History taking and treatment planning, identifying target memories.
- Preparation: explaining the method, building trust and teaching stabilisation skills (safe place imagery).
- Assessment: identifying the target image, the negative belief ("I am powerless"), the desired positive belief ("I survived; I am safe now"), emotions, body sensations, and ratings on the subjective units of distress (SUD) and validity of cognition (VOC, 1 to 7) scales.
- Desensitisation: the person holds the memory in mind while following the therapist's fingers moving side to side (or using taps or tones) in sets, noticing what comes up, until distress falls close to zero.
- Installation: strengthening the positive belief.
- Body scan: checking for residual tension.
- Closure: returning to calm.
- Re-evaluation at the next session.

## Evidence
Meta analyses show EMDR is effective for PTSD, comparable to trauma focused CBT, and it is recommended by WHO and many guidelines for PTSD in adults and children. It may need less homework. It has been used after disasters, including in India. Evidence for other conditions (depression, anxiety, psychosis related trauma) is emerging but weaker.

## Mechanism debate and critique
- Dismantling studies show that eye movements add little or only a small effect beyond imaginal exposure and cognitive work, leading critics (such as Richard McNally) to describe EMDR's effective parts as "what is effective is not new, and what is new is not effective".
- Supporters cite the working memory theory: holding a memory in mind while doing a demanding dual task (eye movements) taxes working memory, making the memory less vivid and emotional when stored again. Laboratory studies support this effect.
- Other proposed mechanisms include orienting responses and changes similar to REM sleep.
- Early claims of very rapid cures and commercial training practices drew criticism.

## Conclusion
EMDR is an effective, well accepted treatment for PTSD. Its distinctive eye movements may contribute through working memory taxation, but much of its effect probably comes from exposure and cognitive processing shared with trauma focused CBT.`,
    keyPoints: ["Shapiro 1987", "Adaptive information processing model", "Eight phases with SUD and VOC", "Bilateral stimulation", "Evidence comparable to TF-CBT and WHO recommendation", "Dismantling studies", "Working memory theory", "Balanced conclusion"],
    visuals: [chain("The eight phases", [["History and planning", ""], ["Preparation", "Safe place"], ["Assessment", "Image, beliefs, SUD, VOC"], ["Desensitisation", "Sets of eye movements"], ["Installation", "Positive belief"], ["Body scan", ""], ["Closure", ""], ["Re-evaluation", ""]])],
    module: "trauma",
    ref: "Shapiro 1989; Cusack 2016 meta-analysis; WHO 2013 guidelines stress; Lee and Cuijpers 2013 eye movement component; van den Hout working memory",
  },
  {
    id: "ther-l05-008",
    subject: "clinical-therapies",
    topic: "hypnosis",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on hypnosis in psychotherapy.",
    plan: ["Definition and history", "Theories", "Clinical uses and evidence", "Cautions"],
    answer: `## Definition and history
Hypnosis is a state of focused attention and reduced peripheral awareness, with increased responsiveness to suggestion. Franz Mesmer's "animal magnetism" in the eighteenth century was an early form; James Braid coined the word "hypnosis"; Charcot used it to study hysteria, and Freud used it before developing free association. Milton Erickson developed indirect, conversational hypnotherapy.

## Theories
- State theories: hypnosis is an altered state of consciousness, involving dissociation (Hilgard's neodissociation theory and the "hidden observer").
- Socio-cognitive theories: hypnotic behaviour reflects expectations, motivation and role enactment rather than a special state (Spanos, Barber).
- Imaging shows changes in attention and self monitoring networks during hypnosis.
- Hypnotisability is a stable trait measured by scales such as the Stanford Hypnotic Susceptibility Scale; about 10 to 15 percent of people are highly hypnotisable.

## Clinical uses and evidence
- Pain: procedural pain, burns, labour and chronic pain, with good evidence.
- Irritable bowel syndrome: gut directed hypnotherapy has strong evidence.
- Smoking cessation and weight loss: modest effects.
- Anxiety, especially before procedures; as an adjunct to CBT.
- Functional neurological disorder: some evidence.
- Habit disorders and sleep problems.

## Cautions
- Memory recovered or "refreshed" under hypnosis is unreliable and can create false memories with high confidence; it should not be used to recover memories of abuse or for legal testimony.
- Risk of exploitation; must be practised by trained professionals within ethical limits.
- Caution in psychosis, severe dissociation and personality disorders.
- Stage hypnosis can cause distress.

## Conclusion
Hypnosis is a useful adjunct for pain, irritable bowel syndrome and anxiety, but it is not a truth serum and must not be used to recover memories.`,
    keyPoints: ["Definition", "History from Mesmer to Erickson", "State versus socio-cognitive theories", "Hypnotisability trait", "Uses with evidence including IBS and pain", "False memory caution and ethics"],
    module: "therapies",
    ref: "Hilgard 1977; Lynn and Kirsch; Elkins 2015 definition APA Division 30; Loftus false memory",
  },
  {
    id: "ther-l05-009",
    subject: "clinical-therapies",
    topic: "play-therapy",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on play therapy.",
    plan: ["Rationale", "Approaches", "Materials and process", "Uses and evidence"],
    answer: `## Rationale
Children often cannot express complex feelings in words. Play is their natural language: through play they communicate, master experiences and practise solutions. Play therapy uses play within a therapeutic relationship to help children with emotional and behavioural problems.

## Approaches
- Psychoanalytic play therapy: Anna Freud used play to build the relationship and understand the child; Melanie Klein interpreted play as directly equivalent to free association.
- Child centred (non directive) play therapy: Virginia Axline applied Rogers' principles; the therapist accepts the child fully, reflects feelings, lets the child lead and sets only necessary limits. Garry Landreth developed it further.
- Filial therapy: parents are trained to conduct child centred play sessions at home.
- Directive and cognitive behavioural play therapy: structured activities to teach coping skills, problem solving and emotional understanding.
- Sand tray therapy and art based approaches.
- Theraplay: structured play to strengthen attachment.

## Materials and process
A playroom with toys for real life (dolls, houses, kitchens), aggressive release (soft weapons, punching bags) and creative expression (paints, clay, sand). Sessions are usually weekly for 30 to 50 minutes. The therapist observes themes, reflects feelings ("You're really angry at that dinosaur"), and helps the child experience safety and control.

## Uses and evidence
Anxiety, trauma, grief, behaviour problems, adjustment to divorce or illness, and social difficulties. Meta analyses show moderate effects, larger when parents are involved (filial therapy). Many studies are of limited quality.

## Conclusion
Play therapy helps children express and work through difficulties in their own language of play, with better results when parents are involved.`,
    keyPoints: ["Play as children's language", "Anna Freud and Klein", "Axline's child centred approach", "Filial therapy", "Directive and CBT play", "Materials, process and evidence"],
    module: "child",
    ref: "Axline 1947 Play Therapy; Landreth 2012; Bratton 2005 meta-analysis",
  },
  {
    id: "ther-l05-010",
    subject: "clinical-therapies",
    topic: "cognitive-remediation",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Write short notes on cognitive remediation in schizophrenia.",
    plan: ["Rationale", "Methods", "Evidence", "Indian context"],
    answer: `## Rationale
Cognitive deficits in attention, memory, processing speed, executive function and social cognition are present in most people with schizophrenia, often before onset. They predict functional outcome (work, independent living) more strongly than positive symptoms, and antipsychotics do little to improve them.

## Methods
Cognitive remediation is a behavioural training intervention that aims to improve cognitive processes, with the goal of durability and generalisation to everyday functioning.
- Drill and practice exercises, often computerised, that gradually increase in difficulty (errorless learning, massed practice).
- Strategy coaching: teaching ways to approach tasks (chunking, verbalising steps, planning).
- Bridging groups that link skills to real life goals.
- Social cognition training: emotion recognition, theory of mind and attribution (for example, social cognition and interaction training).
- Examples: Cognitive Remediation Therapy (Wykes), Cognitive Enhancement Therapy (Hogarty), Neuropsychological Educational Approach to Remediation (NEAR).
Typically 20 to 40 hours over a few months.

## Evidence
Meta analyses show small to moderate improvements in cognition and in psychosocial functioning, especially when combined with psychiatric rehabilitation such as supported employment, and when strategy coaching and a trained therapist are included. Effects on symptoms are small.

## Indian context
NIMHANS and other centres have developed and tested cognitive retraining, including culturally adapted, paper and pencil and computer based modules in Indian languages, and social cognition training. Cost, access to computers and therapist time are barriers.

## Conclusion
Cognitive remediation improves cognition and functioning in schizophrenia, particularly when linked to rehabilitation goals.`,
    keyPoints: ["Cognitive deficits predict function", "Antipsychotics do little", "Drill and practice and strategy coaching", "Social cognition training", "Named programmes", "Evidence and combination with rehabilitation", "Indian modules"],
    module: "psychosis",
    ref: "Wykes 2011 Am J Psychiatry meta-analysis; Vita 2021 JAMA Psychiatry; Hogarty CET; NIMHANS cognitive retraining",
  },
]);
