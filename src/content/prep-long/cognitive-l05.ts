import type { LongQA } from "@/lib/prep/long-types";

const S = "cognitive" as const;

export const COGNITIVE_L05: LongQA[] = [
  {
    id: "cog-l05-041",
    subject: S,
    topic: "metacognition",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on the tip-of-the-tongue phenomenon.",
    plan: ["Define the state", "Brown and McNeill's study", "Explanations", "Age and clinical aspects"],
    answer: `## Meaning
The tip-of-the-tongue (TOT) state is the feeling of being sure that one knows a word or name, and that recall is imminent, while being unable to retrieve it. William James described it vividly as a gap that is "intensely active". It happens to most adults about once a week, most often with proper names.

## Brown and McNeill's study
Roger Brown and David McNeill in 1966 read definitions of uncommon words, such as "a small boat used in the harbours of China and Japan" (sampan), to students. When students were in a TOT state, they could often report:
- the first letter, at well above chance,
- the number of syllables,
- the stress pattern,
- similar-sounding words (Saipan, Siam) and similar-meaning words (junk, barge).
This shows that partial information about a word's form is available even when the whole word is not.

## Explanations
- Transmission deficit (Deborah Burke): the meaning of the word is activated, but the connections to its sound (phonological form) are too weak to fully activate it, especially for rarely used words and with age.
- Blocking: a similar but wrong word comes to mind and blocks the target.
- The TOT state reflects a two-stage model of word production: selecting the lemma (meaning and grammar) and then retrieving the phonological form.

## Age and clinical aspects
TOT states increase with normal ageing, particularly for names, and are not a sign of dementia. Bilinguals experience more TOTs. Patients with anomic aphasia show an exaggerated form. Hearing the first syllable or a rhyming word often resolves the state.`,
    keyPoints: ["Definition", "Brown and McNeill method", "Partial information such as first letter and syllables", "Transmission deficit and blocking explanations", "Age and bilingual effects"],
    module: "thinking-language/2-5",
    visuals: [
      { kind: "reveal", caption: "Brown and McNeill's study", data: { prompt: "Name the instrument used to measure earthquakes. If it is on the tip of your tongue, what can you say about it?", answer: "Seismograph. Many people in a tip-of-the-tongue state can say it starts with 's' and has three syllables before the word itself arrives." } },
    ],
    ref: "Brown and McNeill 1966; Burke et al 1991 transmission deficit; Schwartz 2002",
  },
  {
    id: "cog-l05-042",
    subject: S,
    topic: "cognitive-neuroscience",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "md-psychiatry"],
    question: "Describe the main methods used in cognitive neuroscience, comparing their spatial and temporal resolution, strengths and limitations.",
    plan: ["Define cognitive neuroscience and its aim", "Lesion and neuropsychological methods", "EEG and ERPs, MEG", "PET and fMRI", "TMS and other stimulation methods", "Comparison table and converging methods"],
    answer: `## Cognitive neuroscience
Cognitive neuroscience studies how mental processes such as perception, attention, memory and language are produced by the brain. Michael Gazzaniga and George Miller coined the term in the late 1970s. It combines the experimental tasks of cognitive psychology with methods that measure or alter brain activity.

## Neuropsychological (lesion) methods
Studying patients with brain damage from stroke, injury or surgery shows which functions depend on which regions. A double dissociation, where patient A is impaired on task X but not Y and patient B shows the reverse, suggests that the tasks rely on separate systems. Examples include Broca's and Wernicke's patients, H.M. and K.F. Lesion symptom mapping now relates damage in many patients to their deficits. Limitations: lesions are rarely confined to one region, the brain reorganises after damage, and rare cases may not generalise. Animal lesion studies give precise control but raise ethical issues.

## EEG and ERPs
Electroencephalography records the brain's electrical activity through electrodes on the scalp. Averaging the EEG across many trials time-locked to a stimulus produces event-related potentials (ERPs), such as the P300 (attention and updating), the N400 (semantic anomaly) and mismatch negativity (auditory change detection). Strengths: excellent temporal resolution (milliseconds), cheap, safe, portable. Limitations: poor spatial resolution, because signals blur through the skull; mainly reflects cortical activity near the surface.

## MEG
Magnetoencephalography measures the tiny magnetic fields produced by neural currents. It has millisecond temporal resolution and better spatial localisation than EEG, but is very expensive and needs shielded rooms.

## PET
Positron emission tomography uses radioactive tracers to measure blood flow, glucose metabolism or neurotransmitter receptor binding. It is useful for studying dopamine receptors in schizophrenia or amyloid in Alzheimer's disease. Limitations: radiation exposure, poor temporal resolution (tens of seconds to minutes), cost.

## fMRI
Functional magnetic resonance imaging measures the blood oxygen level dependent (BOLD) signal, changes in oxygenated blood that follow neural activity. It has good spatial resolution (a few millimetres), no radiation and can be repeated. Designs include subtraction (task versus control), event-related and resting-state connectivity. Limitations: the BOLD response lags neural activity by several seconds; it is correlational; scanners are noisy and expensive; small samples and flexible analysis have produced false positives; activation does not show that a region is necessary. Diffusion tensor imaging maps white matter tracts.

## Brain stimulation
Transcranial magnetic stimulation (TMS) uses a magnetic coil over the scalp to induce currents in the cortex, temporarily disrupting or enhancing activity, a "virtual lesion". It can show that a region is necessary for a task, for example that TMS over visual area V5 disrupts motion perception. Transcranial direct current stimulation alters cortical excitability more gently. Repetitive TMS over the left dorsolateral prefrontal cortex is also a treatment for depression. Limitations: reaches only surface cortex, effects can spread, and there is a small risk of seizures.

## Comparison
| Method | Spatial resolution | Temporal resolution | Measures or alters? | Invasive? |
| Lesion studies | Variable | Not applicable | Infers function from loss | Damage already present |
| EEG and ERP | Poor (centimetres) | Excellent (milliseconds) | Measures | No |
| MEG | Moderate | Excellent | Measures | No |
| PET | Moderate | Poor (minutes) | Measures | Radioactive tracer |
| fMRI | Good (millimetres) | Moderate (seconds) | Measures | No |
| TMS | Moderate | Good | Alters | No, mild risk |

## Conclusion
No single method is enough. Measurement methods show what the brain does during a task; lesion and stimulation methods show what is necessary. Combining them, for example fMRI to locate a region and TMS to test its necessity, gives the strongest evidence.`,
    keyPoints: ["Definition of cognitive neuroscience", "Lesion method and double dissociation", "EEG and ERPs with examples", "PET uses and limits", "fMRI and BOLD with limitations", "TMS as virtual lesion", "Comparison of spatial and temporal resolution", "Converging methods"],
    module: "brain/3-4",
    visuals: [
      { kind: "sort", caption: "Brain stimulation", data: { prompt: "Which method fits each question?", buckets: ["EEG or ERP", "fMRI", "TMS"], items: [{ text: "How many milliseconds after a word does the brain detect it is anomalous?", bucket: 0 }, { text: "Which region is most active when people recall faces?", bucket: 1 }, { text: "Is the left prefrontal cortex necessary for this memory task?", bucket: 2 }, { text: "Which networks are connected at rest in depression?", bucket: 1 }] } },
      { kind: "brainslicer", caption: "fMRI", data: { title: "Imaging and stimulating the brain", start: "tms", caption: "Fire the coil over the left prefrontal cortex. Which deeper circuits does it reach?" } },
    ],
    ref: "Gazzaniga, Ivry and Mangun Cognitive Neuroscience ch 3; Bear, Connors and Paradiso ch 7; Walsh and Cowey 2000 TMS",
  },
  {
    id: "cog-l05-043",
    subject: S,
    topic: "cognitive-neuroscience",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "md-psychiatry", "mcp-entrance"],
    question: "Discuss the neural basis of memory, with reference to the hippocampus, prefrontal cortex, amygdala, basal ganglia and cerebellum, and the cellular mechanism of long-term potentiation.",
    plan: ["Overview of distributed memory systems", "Hippocampus and medial temporal lobe", "Prefrontal cortex and working memory", "Amygdala and emotional memory", "Basal ganglia and cerebellum", "LTP, consolidation and clinical links, conclusion"],
    answer: `## Overview
Memory is not stored in a single place. Different memory systems depend on different brain structures, and memories themselves are distributed across networks of neurons. Karl Lashley's search for a single memory trace (the engram) in rats failed, leading to his principle of mass action, but later work identified specific structures for specific kinds of memory.

## Hippocampus and the medial temporal lobe
- The hippocampus, together with the entorhinal, perirhinal and parahippocampal cortices, is essential for forming new declarative memories (episodic and semantic), as the case of H.M. showed.
- It binds together the elements of an experience (who, what, where, when) into a coherent memory, and acts as an index that later reactivates the cortical patterns of the event.
- It is not the permanent store of remote memories in the standard consolidation model; memories gradually become independent of it. Multiple trace theory argues that detailed episodic memories always need the hippocampus.
- Spatial memory: John O'Keefe discovered place cells in the rat hippocampus that fire when the animal is in a specific location, and May-Britt and Edvard Moser found grid cells in the entorhinal cortex; they shared the 2014 Nobel Prize. London taxi drivers studied by Eleanor Maguire had a larger posterior hippocampus, related to years of navigation.
- The hippocampus is vulnerable to hypoxia, prolonged stress (high cortisol) and early Alzheimer's disease, and is smaller in recurrent depression and PTSD.
- Damage to the diencephalon (mammillary bodies and medial thalamus) in Korsakoff's syndrome produces similar amnesia, because these structures are part of the Papez circuit linking the hippocampus via the fornix.

## Prefrontal cortex
- The dorsolateral prefrontal cortex supports working memory, especially the central executive functions of manipulation, updating and maintaining goals. Patricia Goldman-Rakic found neurons in the monkey prefrontal cortex that kept firing during the delay of a delayed response task, holding information in mind.
- The prefrontal cortex organises encoding (semantic elaboration), retrieval strategies, source memory (where and when something was learned) and temporal order. Damage leads to source amnesia, poor free recall with better recognition, and confabulation.
- Encoding activity in the left inferior prefrontal cortex predicts later memory (the subsequent memory effect).

## Amygdala and emotional memory
- The amygdala is essential for fear conditioning, studied extensively by Joseph LeDoux.
- It enhances consolidation of emotionally arousing events through stress hormones (adrenaline and cortisol) acting on noradrenergic receptors, as James McGaugh showed. Emotional events are therefore remembered better.
- Larry Cahill found that beta-blockers such as propranolol reduce the memory advantage for emotional stories.
- Patient S.M., with bilateral amygdala damage, shows almost no fear and impaired recognition of fearful faces.
- Overactive amygdala responses are linked to PTSD and anxiety disorders.

## Basal ganglia
The striatum (caudate and putamen) supports procedural memory and habit learning, gradual stimulus response learning guided by dopamine reward prediction signals. Patients with Parkinson's or Huntington's disease show impaired skill and habit learning with relatively preserved declarative memory. Habit systems are implicated in addiction and OCD.

## Cerebellum
The cerebellum is essential for motor learning, timing and classical conditioning of discrete motor responses such as the eyeblink. Richard Thompson showed that lesions of the interpositus nucleus abolish conditioned eyeblinks in rabbits. It also contributes to some cognitive functions.

## Neocortex
Sensory association areas store perceptual knowledge and support priming; the anterior temporal lobes act as a semantic hub, damaged in semantic dementia.

## Long-term potentiation
Donald Hebb proposed in 1949 that "cells that fire together wire together": when one neuron repeatedly helps fire another, the connection between them strengthens. Timothy Bliss and Terje Lomo in 1973 found such a mechanism in the rabbit hippocampus.
- Long-term potentiation (LTP) is a lasting increase in synaptic strength after brief high-frequency stimulation.
- In the CA1 region, LTP depends on NMDA glutamate receptors, which act as coincidence detectors: they open only when glutamate is bound and the postsynaptic cell is already depolarised, removing a magnesium block. Calcium then enters and triggers changes, including insertion of more AMPA receptors.
- Late LTP requires gene expression and protein synthesis, and produces structural changes such as new dendritic spines, linking it to consolidation.
- Blocking NMDA receptors in rats (Richard Morris's water maze studies) impairs spatial learning; genetically enhancing NMDA receptors improved learning in "Doogie" mice.
- Long-term depression (LTD) weakens synapses, allowing fine-tuning and forgetting.
- Eric Kandel's work on the sea slug Aplysia showed the molecular basis of sensitisation and habituation, earning a Nobel Prize in 2000.

## Clinical links
- Alzheimer's disease begins in the entorhinal cortex and hippocampus, explaining early episodic memory loss; cholinesterase inhibitors target the cholinergic input from the basal forebrain.
- ECT and benzodiazepines interfere with consolidation.
- Chronic stress damages hippocampal neurons and reduces neurogenesis, which antidepressants may partly reverse.

## Conclusion
Memory depends on interacting systems: the hippocampus binds new declarative memories, the prefrontal cortex organises and controls them, the amygdala tags them with emotion, the basal ganglia and cerebellum support skills and conditioning, and the neocortex stores knowledge. At the cellular level, LTP provides a plausible mechanism by which experience changes synapses.`,
    keyPoints: ["Distributed memory systems and Lashley", "Hippocampus in binding and consolidation", "Place and grid cells or taxi driver study", "Prefrontal cortex in working memory and source memory", "Amygdala and emotional enhancement with McGaugh or Cahill", "Basal ganglia and cerebellum roles", "LTP mechanism with NMDA receptors", "Clinical links"],
    module: "brain/3-4",
    visuals: [
      { kind: "brainexplorer", caption: "Prefrontal cortex", data: { title: "Memory systems in the brain", focus: ["hippocampus", "prefrontal", "amygdala", "basal-ganglia", "cerebellum"], caption: "Tap the hippocampus, then the amygdala. How does each help an exam-day memory last?" } },
      { kind: "flow", caption: "Long-term potentiation", data: { title: "How LTP strengthens a synapse", layout: "chain", nodes: [{ id: "a", label: "Strong, repeated input", detail: "Glutamate released many times." }, { id: "b", label: "Postsynaptic cell depolarised", detail: "AMPA receptors open first." }, { id: "c", label: "NMDA receptor unblocked", detail: "Magnesium leaves; calcium enters." }, { id: "d", label: "More AMPA receptors inserted", detail: "The synapse responds more strongly." }, { id: "e", label: "Protein synthesis and new spines", detail: "Late LTP: lasting change." }] } },
    ],
    ref: "Bear, Connors and Paradiso ch 24 and 25; Bliss and Lomo 1973; Hebb 1949; Morris et al 1986; Goldman-Rakic 1995; McGaugh 2004; Cahill et al 1994; Maguire et al 2000; Thompson 1986; Kandel 2001",
  },
  {
    id: "cog-l05-044",
    subject: S,
    topic: "knowledge-representation",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "How is knowledge represented in the mind? Discuss schemas, scripts, propositions and mental models.",
    plan: ["The problem of representation", "Propositions and evidence", "Schemas and scripts with evidence", "Mental models", "Embodied and connectionist alternatives", "Conclusion"],
    answer: `## The problem
Cognitive psychology assumes that the mind uses internal representations, structures that stand for things in the world. The question is what form these representations take: words, images, abstract propositions, structured frameworks or patterns of activation.

## Propositions
A proposition is the smallest unit of knowledge that can be true or false, an abstract representation of meaning independent of particular words. "The cat chased the rat" and "The rat was chased by the cat" express the same proposition, CHASE (cat, rat).
- Evidence: Jacqueline Sachs found that after a short delay people remembered the meaning of a sentence but not its exact wording or whether it was active or passive.
- Walter Kintsch showed that reading time and recall depended on the number of propositions in a text, not the number of words.
- Propositional networks, as in John Anderson's ACT theories, link concepts and relations.

## Schemas
A schema is an organised knowledge structure representing a general type of object, event or situation, with slots and default values. A schema for "classroom" includes desks, a board and a teacher. Schemas guide attention, help us interpret ambiguous information, fill gaps and create expectations.
- Bartlett's War of the Ghosts study and Bransford and Johnson's laundry passage show schemas shaping comprehension and memory.
- Richard Anderson and James Pichert had people read a description of a house from the perspective of a burglar or a home buyer; changing perspective at recall allowed them to remember new details, showing schemas also guide retrieval.

## Scripts
A script is a schema for a routine sequence of events, described by Roger Schank and Robert Abelson. The restaurant script has entering, ordering, eating, paying and leaving, with roles (customer, waiter) and props (menu, bill). A wedding script in an Indian context would include the baraat, rituals and feast.
- Gordon Bower, John Black and Terrence Turner found that people agreed on the typical actions of scripts, recalled stories in script order even when told out of order, and falsely recalled script-typical actions not mentioned.

## Mental models
A mental model is a representation of a specific situation, analogous to its structure, that people build from descriptions, perception or knowledge. Philip Johnson-Laird proposed that people reason by constructing models of what premises describe. Mental models of devices (how a thermostat works) and of situations in a text (situation models) guide understanding and prediction. Mistaken mental models, such as believing that turning a thermostat higher heats a room faster, lead to errors.

## Alternatives
- Connectionist models represent knowledge as patterns of activation across many simple units with weighted connections, without explicit symbols.
- Embodied or grounded cognition argues that concepts are partly represented by simulations in sensory and motor systems: understanding "kick" activates leg motor areas.

## Clinical relevance
Beck's cognitive theory of depression uses schemas (core beliefs such as "I am worthless") to explain biased processing, and schema therapy targets early maladaptive schemas.

## Conclusion
Knowledge is represented at several levels: propositions capture meaning, schemas and scripts organise general knowledge, and mental models represent particular situations. These structures make understanding efficient but also produce systematic errors.`,
    keyPoints: ["The representation question", "Propositions with Sachs or Kintsch evidence", "Schemas with Anderson and Pichert", "Scripts with Bower, Black and Turner", "Mental models", "Connectionist and embodied alternatives", "Clinical application"],
    module: "thinking-language/2-1",
    visuals: [
      { kind: "timeline", caption: "Scripts", data: { prompt: "Put the restaurant script in its usual order.", events: [{ label: "Enter and be seated" }, { label: "Read the menu and order" }, { label: "Eat the food" }, { label: "Ask for the bill and pay" }, { label: "Leave" }], why: "Scripts store the typical order of routine events, so people recall stories in script order." } },
    ],
    ref: "Sachs 1967; Kintsch 1974; Anderson and Pichert 1978; Schank and Abelson 1977; Bower, Black and Turner 1979; Johnson-Laird 1983; Barsalou 2008",
  },
  {
    id: "cog-l05-045",
    subject: S,
    topic: "knowledge-representation",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on connectionism (parallel distributed processing).",
    plan: ["Basic idea and founders", "Units, weights and learning", "Key properties with examples", "Criticisms"],
    answer: `## Basic idea
Connectionism, or parallel distributed processing (PDP), models cognition as the activity of networks of simple, neuron-like processing units. David Rumelhart, James McClelland and the PDP Research Group set out the approach in 1986. Knowledge is not stored as symbols or rules in one place but distributed across the strengths (weights) of connections between many units.

## Units, weights and learning
- Units are arranged in layers: input, hidden and output.
- Each unit sums weighted inputs from others and passes on activation.
- Learning changes the weights, for example by the back-propagation rule, which adjusts weights to reduce the difference between the network's output and the correct output.

## Key properties
- Parallel processing: many units work at once.
- Distributed representation: a concept is a pattern of activity across many units.
- Graceful degradation: damage to some units reduces performance gradually rather than abolishing it, like brain damage in semantic dementia.
- Content-addressable memory: a partial cue can retrieve the whole pattern.
- Generalisation: networks respond sensibly to new inputs.
- Emergent rule-like behaviour: Rumelhart and McClelland's past tense model learned English verbs and produced overregularisation errors ("goed") like children, without explicit rules.

## Criticisms
- Steven Pinker and Alan Prince argued the past tense model did not capture the full pattern of children's errors.
- Back-propagation is not biologically realistic.
- Networks can suffer catastrophic interference, forgetting old learning when new material is learned.
- They struggle with systematic, rule-based structure such as complex syntax, though modern deep learning has greatly extended their power.`,
    keyPoints: ["Founders and core idea", "Units, layers and weights", "Learning by weight change", "Graceful degradation and content addressability", "Past tense model", "Criticisms"],
    module: "thinking-language/2-1",
    visuals: [
      { kind: "flow", caption: "Units, weights and learning", data: { title: "A simple network", layout: "chain", nodes: [{ id: "i", label: "Input units", detail: "Features of a word or picture." }, { id: "h", label: "Hidden units", detail: "Learned internal patterns." }, { id: "o", label: "Output units", detail: "Name, meaning or response." }], caption: "Learning changes the connection weights, not stored rules." } },
    ],
    ref: "Rumelhart, McClelland and PDP Group 1986; Pinker and Prince 1988; McCloskey and Cohen 1989",
  },
  {
    id: "cog-l05-046",
    subject: S,
    topic: "working-memory",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "What is working memory capacity? How is it measured, what does it predict, and what is the evidence on working memory training?",
    plan: ["Define working memory capacity", "Measurement: simple versus complex span", "What it predicts", "The executive attention view", "Working memory training debate", "Conclusion"],
    answer: `## Meaning
Working memory capacity (WMC) refers to individual differences in how much information a person can hold and manipulate in mind while resisting distraction. It is a stable trait that varies widely between people and is closely linked to fluid intelligence.

## Measurement
- Simple span tasks, such as forward digit span, measure storage alone.
- Complex span tasks combine storage with processing. In the reading span task of Meredyth Daneman and Patricia Carpenter, people read sentences aloud and remember the final word of each. In the operation span task, they solve simple equations while remembering words or letters. The score is the number of items recalled in correct order.
- The n-back task requires updating: indicating whether each item matches the one presented n steps earlier.
- Backward digit span and letter number sequencing in the Wechsler scales.
Complex span tasks predict higher cognition better than simple span.

## What WMC predicts
- Reading comprehension, as Daneman and Carpenter found.
- Fluid intelligence and reasoning: correlations of about 0.5 to 0.7 at the latent level.
- Following instructions, note-taking and learning in school; Susan Gathercole found that children with low WMC struggle in class.
- Mathematics, especially multi-step problems.
- Resistance to distraction: in Andrew Conway's dichotic listening study, about 65 percent of low-span participants noticed their own name in the unattended ear, compared with about 20 percent of high-span participants, who could better ignore the irrelevant channel.
- Performance under pressure: people with high WMC can choke under stress because worry consumes their capacity, as Sian Beilock showed.
- Mind-wandering: low WMC is linked to more task-unrelated thought.
- Clinical groups: low WMC in ADHD, schizophrenia and depression.

## The executive attention view
Randall Engle and Michael Kane argued that WMC reflects mainly domain-general executive attention: the ability to keep goals active and control attention in the face of interference, rather than storage capacity. People with low WMC show more errors on the antisaccade task (looking away from a sudden cue) and the Stroop task when congruent trials are frequent.

## Working memory training
Programmes such as Cogmed claimed that practising working memory tasks would improve attention, intelligence and school performance.
- Training reliably improves performance on the trained tasks and similar tasks (near transfer).
- Evidence for far transfer, to untrained abilities like fluid intelligence, reading or classroom attention in ADHD, is weak. Meta-analyses by Monica Melby-Lervag and Charles Hulme found that apparent gains largely disappeared with active control groups and were not sustained.
- Better approaches reduce working memory load in teaching (short instructions, written reminders, chunked tasks) and teach strategies.

## Conclusion
Working memory capacity is a key individual difference that predicts learning, reasoning and attentional control. It is best measured with complex span tasks. Training improves trained tasks but does not reliably boost general cognition, so adapting environments to people's capacity is more useful.`,
    keyPoints: ["Definition as individual difference", "Simple versus complex span tasks with reading span", "Predictions including intelligence and comprehension", "Conway's cocktail party finding", "Executive attention view", "Near versus far transfer in training", "Practical recommendations"],
    module: "learning-memory/3-2",
    visuals: [
      { kind: "experiment", caption: "What WMC predicts", data: { title: "Hearing your name in the ignored ear", question: "What share of people noticed their own name in the unattended message?", unit: "%", conditions: [{ label: "Low working memory capacity", value: 65 }, { label: "High working memory capacity", value: 20 }], why: "High-capacity people were better at blocking out the irrelevant channel." } },
    ],
    ref: "Daneman and Carpenter 1980; Engle 2002; Conway, Cowan and Bunting 2001; Kane and Engle 2003; Melby-Lervag and Hulme 2013 and 2016; Gathercole and Alloway 2008",
  },
  {
    id: "cog-l05-047",
    subject: S,
    topic: "false-memory",
    marks: 15,
    difficulty: 4,
    exams: ["mcp-entrance", "ugc-net", "md-psychiatry"],
    question: "\"Memories of childhood abuse that emerge during therapy should always be believed.\" Critically evaluate this statement in the light of research on memory, and discuss the implications for clinical practice.",
    plan: ["Context: the recovered memory debate", "How memory for trauma works", "Evidence that false memories can be implanted", "Evidence for genuine forgetting and later recall", "Factors that raise risk of false memories in therapy", "Balanced position and guidelines, conclusion"],
    answer: `## Context
In the late 1980s and 1990s, some adults in therapy came to "recover" memories of childhood sexual abuse they had previously not remembered, sometimes leading to accusations and court cases. Some memories were corroborated; others were later retracted, with clients and families describing devastating harm. This became known as the recovered memory debate, or "memory wars". The statement asks clinicians to accept all such memories as true, which research on memory does not support; but the opposite, dismissing them all, is equally unsupported.

## How memory for trauma works
- Most people who experienced trauma remember it; the problem is usually intrusive memories, not amnesia. Abuse is common, and survivors are often not believed, so disbelief also causes harm.
- Emotional arousal usually strengthens memory for the central features of an event, through the amygdala and stress hormones, but peripheral details may be poorly encoded.
- Memories of childhood are reconstructive, especially from before age three or four (childhood amnesia).

## Evidence that false memories can be created
- Elizabeth Loftus's "lost in the mall" study: about a quarter of adults came to remember a fictitious childhood event suggested by a family member.
- Ira Hyman and colleagues implanted memories of spilling punch on the bride's parents at a wedding.
- Using doctored photographs, Kimberley Wade and colleagues led about half of participants to report memories of a hot air balloon ride that never happened.
- Imagination inflation: repeatedly imagining an event increases confidence that it happened.
- Julia Shaw reported that, with suggestive interviewing, a majority of participants came to believe they had committed a crime as teenagers, though the exact rate is debated.
- The DRM paradigm shows confident false recall of related words.
- False memories can feel as vivid and emotional as true ones, and confidence does not distinguish them.

## Evidence for genuine forgetting and later recall
- Linda Meyer Williams followed up women whose abuse was documented in hospital records in the 1970s; about 38 percent did not report the documented abuse when interviewed 17 years later, and some who did had previously forgotten it.
- Jonathan Schooler documented cases where people recalled abuse after long periods without thinking about it, with independent corroboration. Many such memories returned spontaneously, triggered by reminders, rather than in therapy.
- Elke Geraerts found that memories recovered spontaneously outside therapy were corroborated about as often as continuous memories, while memories recovered through suggestive therapy were rarely corroborated.
- Explanations for genuine forgetting include not thinking about the event (lack of rehearsal), not understanding it as abuse at the time, motivated suppression and dissociation.

## Factors raising risk of false memories in therapy
- Therapist beliefs that unexplained symptoms (depression, eating problems, relationship difficulties) indicate hidden abuse, and checklists of supposed signs.
- Suggestive techniques: hypnosis (which increases confidence more than accuracy), guided imagery, dream interpretation, "body memories", age regression, sodium amytal interviews and repeated questioning.
- Authority and trust in the therapist, group pressure in survivor groups, and reading material suggesting abuse.
- Vulnerable clients with high suggestibility, dissociation or a wish for an explanation of their distress.

## Evaluation of the statement
The statement is too strong. Memories that emerge in therapy may be true, partly true or false, and there is no reliable way to tell from vividness, emotion or confidence alone. Equally, abuse is real and common, and genuine memories can return after long periods. The appropriate stance is neither automatic belief nor automatic disbelief, but respectful neutrality and awareness of how memory works.

## Implications for clinical practice
- Avoid suggestive techniques; do not use hypnosis or imagery to "uncover" memories.
- Do not tell clients that their symptoms prove abuse.
- Listen respectfully and validate the client's distress without confirming or disputing events the therapist cannot know.
- Focus therapy on current functioning, coping and symptoms; trauma-focused therapies such as trauma-focused CBT and EMDR work with memories the client already has.
- Document carefully how memories emerged, especially if legal action is possible.
- Seek supervision, follow professional guidelines (such as those of the British Psychological Society and the American Psychological Association on recovered memories), and refer when beyond competence.
- In India, where family honour and stigma may silence disclosure, and the POCSO Act mandates reporting of child abuse, clinicians must balance belief, safety and accuracy, especially with children, who should be interviewed with open, non-leading questions by trained professionals.

## Conclusion
Memory research shows that false memories of childhood events can be created through suggestion and that genuine memories can be forgotten and later recalled. Clinicians should neither always believe nor routinely doubt recovered memories, but should avoid suggestion, support clients and recognise the limits of what therapy can establish about the past.`,
    keyPoints: ["Context of the recovered memory debate", "Trauma usually remembered; abuse is common", "Evidence for implanted false memories with at least two studies", "Williams and Geraerts evidence for genuine recovered memories", "Suggestive techniques that raise risk", "Confidence and vividness do not show accuracy", "Balanced evaluation of the statement", "Practice guidelines including Indian context"],
    pitfalls: ["Taking an extreme position either way", "Ignoring evidence that genuine abuse memories can return"],
    module: "learning-memory/3-4",
    visuals: [
      { kind: "compare", caption: "Evidence for genuine forgetting and later recall", data: { title: "Two routes to a recovered memory", a: { label: "Spontaneous recall outside therapy", points: ["Triggered by a reminder", "Often surprising to the person", "Corroborated about as often as continuous memories"], summary: "More likely to be accurate." }, b: { label: "Recovered through suggestive therapy", points: ["Hypnosis, imagery, repeated probing", "Therapist expects abuse", "Rarely corroborated"], summary: "Higher risk of false memory." } } },
      { kind: "decide", caption: "Implications for clinical practice", data: { scene: "A client with depression asks whether her symptoms mean she must have been abused as a child, although she has no memory of it.", ask: "What is the best response?", choices: [{ label: "Yes, your symptoms fit; let us use hypnosis to uncover the memories", verdict: "harm", outcome: "Raises the risk of creating false memories.", why: "Symptoms do not prove abuse, and hypnosis increases confidence more than accuracy." }, { label: "Many things can cause depression; we cannot know about the past from symptoms, but we can work on how you feel now, and talk about anything you do remember", verdict: "best", outcome: "Respectful, honest and non-suggestive.", why: "Neutral stance, focus on present functioning." }, { label: "That is impossible, you would remember", verdict: "harm", outcome: "Dismissive and inaccurate.", why: "Some genuine memories are forgotten and later recalled." }] } },
    ],
    ref: "Loftus and Pickrell 1995; Hyman, Husband and Billings 1995; Wade et al 2002; Shaw and Porter 2015 (and critiques); Williams 1994; Schooler 2001; Geraerts et al 2007 Psychological Science; BPS 2010 Guidelines on Memory and the Law",
  },
  {
    id: "cog-l05-048",
    subject: S,
    topic: "decision-making",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Interview question: \"How can cognitive biases affect clinical diagnosis, and what would you do to reduce them in your own practice?\"",
    plan: ["Frame the answer: clinicians are subject to the same heuristics", "Name four to six biases with clinical examples", "Dual process view of clinical reasoning", "Concrete debiasing strategies", "Close with a personal commitment"],
    answer: `## Opening
"Clinicians use the same mental shortcuts as everyone else. In busy outpatient departments, with 50 or more patients a day, fast intuitive judgement is necessary, but it also produces predictable errors. Studies of diagnostic error in medicine suggest that cognitive factors contribute to a large share of misdiagnoses."

## Biases with clinical examples
- Anchoring: fixing on the first impression. A young man brought by his family for "anger" is labelled as having a conduct problem, and later evidence of manic symptoms is underweighted.
- Premature closure: stopping the search once a diagnosis seems to fit. A woman with low mood is diagnosed with depression without checking thyroid function or past hypomanic episodes.
- Confirmation bias: asking only questions that support the working diagnosis.
- Availability: overdiagnosing a condition seen recently or discussed at a recent case conference.
- Representativeness: missing atypical presentations, such as depression presenting with bodily pain in older Indian patients, or psychosis in a well-dressed, articulate professional.
- Diagnostic overshadowing: attributing physical symptoms to a known mental illness or intellectual disability. A patient with schizophrenia complaining of headache may have a medical cause.
- Base rate neglect: forgetting how common or rare a condition is in the setting.
- Affective and attribution biases: negative feelings towards patients with self-harm or substance use, or attributing their problems to character.
- Framing: a referral letter that says "known case of personality disorder" shapes how symptoms are read.
- Overconfidence: experienced clinicians can be more confident without being more accurate.

## The dual process view
Pat Croskerry applied dual process theory to medicine: Type 1 pattern recognition is fast and usually accurate for typical cases; Type 2 analytic reasoning is slower and needed for atypical, high-risk or uncertain cases. Errors occur when Type 1 is used where Type 2 is needed, or when fatigue and workload prevent switching.

## What I would do
- Use structured assessment for key decisions: a full history including medical and substance history, standard mental status examination, and validated rating scales or structured interviews for diagnosis.
- Always ask: what else could this be? Keep a short differential list, including medical causes.
- Use a "diagnostic time-out" for complex cases before finalising.
- Seek collateral history from family and records.
- Review base rates and guidelines.
- Notice my emotional reactions to a patient and ask whether they are shaping my judgement.
- Discuss cases in supervision and peer review; welcome a second opinion.
- Follow up: reassess the diagnosis when the patient does not respond as expected.
- Get adequate rest; fatigue increases reliance on shortcuts.
- Learn from errors through morbidity reviews without blame.

## Closing
"I cannot remove bias completely, but I can build habits that catch it: slowing down when it matters, considering alternatives, using structured tools and staying open to being wrong."`,
    keyPoints: ["Recognises clinicians use heuristics", "At least five named biases with clinical examples", "Diagnostic overshadowing", "Dual process model of clinical reasoning", "Concrete, personal debiasing strategies", "Supervision and follow-up", "Clear closing"],
    module: "thinking-language/2-4",
    visuals: [
      { kind: "sort", caption: "Biases with clinical examples", data: { prompt: "Name the bias.", buckets: ["Anchoring", "Diagnostic overshadowing", "Availability"], items: [{ text: "Chest pain in a man with panic disorder is assumed to be anxiety", bucket: 1 }, { text: "After a striking case of NMS, every fever on antipsychotics is called NMS", bucket: 2 }, { text: "The first label in the referral letter sticks despite new findings", bucket: 0 }] } },
    ],
    ref: "Croskerry 2003 and 2009; Graber, Franklin and Gordon 2005 diagnostic error; Jones et al 2008 diagnostic overshadowing; Kahneman 2011",
  },
  {
    id: "cog-l05-049",
    subject: S,
    topic: "knowledge-representation",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Critically evaluate the information-processing approach in cognitive psychology. Discuss the cognitive revolution, the computer metaphor, and the challenges posed by connectionism, embodied cognition and ecological approaches.",
    plan: ["The cognitive revolution and its causes", "Core assumptions of information processing", "Contributions with examples", "Criticisms: serial processing, computer metaphor, ecological validity, emotion and culture", "Alternatives: connectionism, embodied and situated cognition, ecological psychology, predictive processing", "Evaluation and conclusion"],
    answer: `## The cognitive revolution
By the 1950s behaviourism dominated psychology, studying observable stimuli and responses and rejecting talk of mental states. Several developments led to the cognitive revolution, usually dated to the mid-1950s:
- Chomsky's critique of Skinner showed that language could not be explained by reinforcement.
- Information theory (Claude Shannon) and George Miller's work on the limits of short-term memory.
- Donald Broadbent's filter model of attention described the mind as a channel of limited capacity.
- The development of computers and Allen Newell and Herbert Simon's Logic Theorist, a program that proved theorems, suggested that thinking could be modelled as symbol manipulation.
- A 1956 symposium at the Massachusetts Institute of Technology, where Miller, Chomsky, Newell and Simon presented, is often seen as its birth. Ulric Neisser's 1967 book "Cognitive Psychology" named and defined the new field.

## Core assumptions of information processing
- The mind is an information-processing system that receives, transforms, stores and retrieves information.
- Processing occurs in stages (encoding, storage, retrieval) through structures with limited capacity, such as sensory memory, short-term memory and long-term memory.
- Mental processes operate on internal representations, symbols that stand for things in the world.
- Processes take time, so reaction times can reveal their organisation (mental chronometry), building on Franciscus Donders's subtraction method and Saul Sternberg's memory scanning studies.
- Cognition can be modelled by flow charts and computer programs: the computer metaphor.
- David Marr's three levels of analysis: the computational level (what problem is solved), the algorithmic level (how, with what representations) and the implementational level (the physical hardware).

## Contributions
- Models of memory (Atkinson and Shiffrin, Baddeley), attention (Broadbent, Treisman), perception, language and problem solving (Newell and Simon) that generated precise, testable predictions.
- Rigorous experimental methods and computational modelling.
- Applications: human factors and ergonomics, user interface design, education, cognitive therapy (Beck's model of information-processing biases in depression and anxiety), and artificial intelligence.
- It reintroduced the mind to scientific psychology and later merged with neuroscience into cognitive neuroscience.

## Criticisms
- Serial stage models: the brain processes information massively in parallel, and stages interact rather than proceeding one after another.
- The computer metaphor is limited: brains have slow, noisy, highly interconnected neurons, learn from experience, degrade gracefully and are not programmed. Computers of the 1960s were a poor model of the brain.
- Disembodied and decontextualised: early models treated cognition as abstract computation in the head, separated from the body, emotion, motivation and social context.
- Ecological validity: Ulric Neisser himself, in "Cognition and Reality" in 1976, criticised laboratory studies of artificial tasks for saying little about cognition in natural settings.
- Neglect of emotion and consciousness: emotion was treated as noise; consciousness and subjective experience were sidestepped.
- Culture: cognition was assumed universal, but research by Richard Nisbett, Shinobu Kitayama and others shows cultural differences in attention and reasoning, such as East Asians attending more to context.
- John Searle's Chinese room argument claimed that symbol manipulation alone cannot produce understanding.
- Homunculus problem: models such as the central executive risk explaining behaviour by an unexplained inner agent.

## Alternatives and extensions
- Connectionism: networks of simple units with distributed representations and learning, inspired by neurons, explained graceful degradation, generalisation and learning without explicit rules. Modern deep learning networks continue this tradition.
- Embodied cognition: cognition depends on the body and its interactions with the world. Concepts are grounded in sensory and motor simulations; understanding action verbs activates motor cortex; holding a warm cup was reported to make people judge others as warmer, though some such effects have not replicated well.
- Situated and distributed cognition: thinking extends into tools and social groups, as Edwin Hutchins showed in studying ship navigation teams; the extended mind thesis of Andy Clark and David Chalmers argues that notebooks and phones can be part of cognition.
- Ecological psychology: James Gibson argued that perception is direct pick-up of information (affordances) from the environment rather than inference from impoverished input.
- Predictive processing: the brain as a prediction machine that constantly generates hypotheses and updates them with prediction errors, integrating perception, action and learning.
- Dynamical systems approaches model cognition as continuously evolving patterns rather than discrete symbols.
- Indian thought, such as Samkhya and Vedantic accounts of the antahkarana (inner instrument of mind, intellect and ego), offers a non-computational model of mind relevant to consciousness and self.

## Evaluation
The information-processing approach succeeded in making the mind a legitimate object of science and produced much of what we know about memory, attention and reasoning. Its early, strict form, serial stages, symbolic computation and a disembodied mind, has been substantially revised. Many criticisms have been absorbed: modern cognitive science uses parallel and neural network models, studies emotion and embodiment, and relies heavily on neuroscience. The computer metaphor survives in a weaker sense: cognition as computation over representations, implemented in the brain.

## Conclusion
The information-processing approach launched cognitive psychology and remains its dominant framework, but it is no longer the narrow serial computer model of the 1960s. Connectionist, embodied, ecological and predictive approaches have corrected its limitations, and the field is now an integrated cognitive science that links computation, the brain, the body and culture.`,
    keyPoints: ["Causes of the cognitive revolution", "Core assumptions of information processing", "Marr's three levels", "Major contributions and applications", "At least five criticisms including computer metaphor and ecological validity", "Connectionism and embodied cognition as alternatives", "Ecological and predictive processing approaches", "Balanced evaluation"],
    pitfalls: ["Describing the approach without evaluating it", "Ignoring how the approach has evolved"],
    module: "thinking-language/2-1",
    visuals: [
      { kind: "timeline", caption: "The cognitive revolution", data: { prompt: "Put these milestones of cognitive psychology in order.", events: [{ label: "Donders's subtraction method", when: "1868" }, { label: "MIT symposium on information theory", when: "1956" }, { label: "Chomsky reviews Skinner", when: "1959" }, { label: "Neisser's 'Cognitive Psychology'", when: "1967" }, { label: "Neisser's 'Cognition and Reality' critique", when: "1976" }, { label: "Parallel distributed processing volumes", when: "1986" }], why: "The field moved from early reaction time methods to information processing, then to its own critique and to network models." } },
      { kind: "compare", caption: "Alternatives and extensions", data: { title: "Classic versus embodied cognition", a: { label: "Information processing", points: ["Mind as symbol processor", "Serial stages and stores", "Cognition in the head"], summary: "Brain as computer." }, b: { label: "Embodied and situated", points: ["Concepts grounded in action and senses", "Cognition spreads into body, tools and others", "Context shapes thinking"], summary: "Mind in a body in a world." } } },
    ],
    ref: "Neisser 1967 and 1976; Miller 2003 cognitive revolution retrospective; Marr 1982; Searle 1980; Gibson 1979; Clark and Chalmers 1998; Hutchins 1995; Clark 2013 predictive processing; Nisbett et al 2001",
  },
  {
    id: "cog-l05-050",
    subject: S,
    topic: "autobiographical-memory",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Write a short note on flashbulb memories.",
    plan: ["Define flashbulb memory", "Brown and Kulik's proposal", "Evidence on accuracy", "Explanation"],
    answer: `## Meaning
Flashbulb memories are vivid, detailed and confidently held memories of the circumstances in which a person learned of a shocking, emotionally significant event, such as where they were when they heard of the 26/11 Mumbai attacks or the COVID-19 lockdown announcement.

## Brown and Kulik's proposal
Roger Brown and James Kulik in 1977 coined the term after asking people about the assassination of President John F. Kennedy. People recalled the place, the activity, the informant, their own feelings and the aftermath. Brown and Kulik proposed a special "Now Print!" mechanism that preserved such memories like a photograph, triggered by surprise and personal significance.

## Evidence on accuracy
- Ulric Neisser and Nicole Harsch asked students the morning after the Challenger space shuttle explosion in 1986 how they had heard the news, then asked them again two and a half years later. Many accounts changed substantially, yet confidence remained high; some students insisted their later version was right when shown their own earlier notes.
- Jennifer Talarico and David Rubin compared memories of the September 11, 2001 attacks with memories of an ordinary event from the same time. Both declined in consistency at similar rates over months, but flashbulb memories retained much higher vividness and confidence.
- A large multi-year study of September 11 memories by William Hirst and colleagues found the same pattern: details changed, confidence stayed high.

## Explanation
Flashbulb memories are not special, permanent recordings. Emotion increases attention, rehearsal and confidence, and repeated retelling in the media and with others shapes the memory. They show that confidence and vividness are poor guides to accuracy, which is important for eyewitness testimony.`,
    keyPoints: ["Definition", "Brown and Kulik's Now Print mechanism", "Neisser and Harsch findings", "Talarico and Rubin comparison", "Confidence versus accuracy conclusion"],
    module: "learning-memory/3-4",
    visuals: [
      { kind: "compare", caption: "Evidence on accuracy", data: { title: "Flashbulb versus everyday memories over a year", a: { label: "Flashbulb memory", points: ["Details change over time", "Vividness stays high", "Confidence stays high"], summary: "Feels like a photograph." }, b: { label: "Everyday memory", points: ["Details change at a similar rate", "Vividness fades", "Confidence fades"], summary: "Feels ordinary." } } },
    ],
    ref: "Brown and Kulik 1977; Neisser and Harsch 1992; Talarico and Rubin 2003 Psychological Science; Hirst et al 2009 and 2015",
  },
];
