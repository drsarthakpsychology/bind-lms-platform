import type { LongQA } from "@/lib/prep/long-types";

const S = "perception-attention" as const;

export const PERCEPTION_ATTENTION_L03: LongQA[] = [
  {
    id: "pa-l03-021",
    subject: S,
    topic: "selective-attention",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Critically evaluate the theories of selective attention: Broadbent's filter theory, Treisman's attenuation theory, the late selection theory of Deutsch and Deutsch, and Lavie's load theory.",
    plan: ["Define selective attention and the early versus late debate", "Cherry's shadowing studies", "Broadbent's filter theory and evidence", "Problems and Treisman's attenuation theory", "Late selection theory and evidence", "Load theory as resolution, neural evidence and conclusion"],
    answer: `## Selective attention
Selective attention is the ability to focus on some information while ignoring the rest. The classic question is where in the flow of processing the selection happens. Early selection theories hold that unattended information is filtered out on the basis of physical features before its meaning is analysed. Late selection theories hold that all information is analysed for meaning, and selection happens only before responding or entering awareness.

## Cherry's shadowing studies
Colin Cherry in 1953 studied the "cocktail party problem": how we follow one conversation among many. In dichotic listening, different messages were played to each ear and participants shadowed (repeated aloud) one of them. They could report almost nothing about the unattended message: they did not notice a change of language or speech played backwards, but did notice a change from a male to a female voice or a pure tone. Physical features were processed; meaning apparently was not.

## Broadbent's filter theory
Donald Broadbent in 1958 proposed the first formal information-processing model of attention.
- All inputs enter a sensory buffer briefly.
- A selective filter chooses one channel on the basis of physical characteristics (ear, voice, location, pitch).
- Only the selected channel passes to a limited-capacity channel for analysis of meaning and then to memory.
- Unattended information is lost from the buffer within a few seconds.
Evidence: in the split-span procedure, three pairs of digits were presented simultaneously, one of each pair to each ear (for example 7, 2, 6 to the left and 4, 9, 1 to the right). Participants preferred to recall ear by ear (726, 491) rather than pair by pair, suggesting that they switched the filter between ears.

## Problems with early selection
- Neville Moray found that about one third of participants noticed their own name in the unattended message, which requires analysis of meaning.
- Anne Treisman found that when the shadowed story switched ears mid-sentence, participants sometimes followed the meaning into the wrong ear for a word or two before returning.
- Jeffrey Gray and Alexander Wedderburn found that when "Dear 7 Jane" was played to one ear and "9 Aunt 6" to the other, participants reported "Dear Aunt Jane", grouping by meaning across ears.
- Noel Corteen and Barry Wood conditioned participants to expect a mild shock with city names; later, city names in the unattended ear produced galvanic skin responses, even for unconditioned city names, showing semantic processing without awareness.
- Practised participants can attend to two messages if they differ enough.

## Treisman's attenuation theory
Treisman in 1964 modified Broadbent's model. The filter does not block the unattended channel entirely but attenuates it, turning down its volume. All inputs then pass through a hierarchy of analysis: physical features, syllables, words, meaning. Each word in the mental dictionary has a threshold for recognition. Important words, such as one's own name or "fire", have permanently low thresholds, and words expected in context have temporarily lowered thresholds, so they can be recognised even from an attenuated signal.
Strengths: explains own-name effects, breakthrough of meaning and the switching of ears.
Weaknesses: the precise nature of attenuation is unclear, and it is hard to test.

## Late selection theory
Anthony and Diana Deutsch in 1963, and Donald Norman in 1968, proposed that all inputs are fully analysed for meaning; the bottleneck lies after recognition, at the stage of response selection and memory. The most important or relevant input is selected for response.
Evidence: semantic processing in the unattended channel (Corteen and Wood, Moray), and studies by Donald MacKay in which an ambiguous shadowed sentence ("They threw stones at the bank") was interpreted according to a disambiguating word in the unattended ear ("river" or "money").
Criticisms: it seems uneconomical for the brain to analyse everything fully. Treisman and Geffen found that participants detected target words much better in the attended than the unattended ear, suggesting that unattended information is not processed as fully. Neural evidence shows that attention modulates very early sensory responses: Steven Hillyard found that the N1 ERP component, about 100 milliseconds after a sound, is larger for attended stimuli, supporting early selection.

## Load theory
Nilli Lavie's perceptual load theory, proposed in 1995, resolved the debate by proposing that the locus of selection is flexible. Perception has limited capacity, but processes everything it can automatically.
- Under high perceptual load (a demanding task), all capacity is used by relevant items, so irrelevant distractors are not perceived: early selection.
- Under low perceptual load, spare capacity spills over to process distractors: late selection.
- High working memory or cognitive control load, however, increases distractor interference, because the control needed to keep priorities is used up.
Evidence: in flanker tasks, irrelevant distractors interfered with responses under low load but not high load; inattentional blindness increases under high load. Imaging shows reduced visual cortex responses to distractors under high load.

## Evaluation
| Theory | Locus of selection | Explains own name effect? | Main weakness |
| Broadbent | Early, all or none | No | Too rigid |
| Treisman | Early, attenuation | Yes | Vague mechanism |
| Deutsch and Deutsch | Late | Yes | Uneconomical, ignores early neural effects |
| Lavie | Flexible, depends on load | Yes | Defining load independently |
The theories moved from a fixed bottleneck to a flexible system in which the extent of processing depends on task demands, motivation and the importance of stimuli. Most evidence came from auditory dichotic listening; visual attention research and neuroscience have since enriched the picture.

## Applications
Understanding selective attention helps design cockpit warnings, explains why a parent hears their baby cry through noise, and informs clinical work on attentional biases in anxiety, where threat words capture attention, and in schizophrenia, where filtering of irrelevant input may be weak.

## Conclusion
Broadbent's filter theory began the scientific study of attention but was too rigid. Treisman showed that unattended information is weakened, not blocked; Deutsch and Deutsch argued for late selection; and Lavie's load theory shows that selection can be early or late depending on perceptual load.`,
    keyPoints: ["Early versus late selection question", "Cherry's shadowing findings", "Broadbent's filter model with split-span evidence", "Moray, Gray and Wedderburn, Corteen and Wood challenges", "Treisman's attenuation and thresholds", "Deutsch and Deutsch late selection with MacKay evidence", "Neural evidence for early effects", "Lavie's load theory as resolution"],
    pitfalls: ["Describing theories without evidence", "Saying Treisman's filter blocks the unattended channel"],
    module: "sensation-perception/2-5",
    visuals: [
      { kind: "attention", caption: "Broadbent's filter theory", data: { caption: "Attend to one voice. Which theory explains hearing your own name in the other ear?" } },
      { kind: "compare", caption: "Late selection theory", data: { title: "Early versus late selection", a: { label: "Early (Broadbent, Treisman)", points: ["Filter acts on physical features", "Meaning of ignored input weak or absent", "Supported by early ERP effects"], summary: "Select before meaning." }, b: { label: "Late (Deutsch and Deutsch)", points: ["All input analysed for meaning", "Selection at response or memory", "Supported by unattended semantic effects"], summary: "Select after meaning." } } },
    ],
    ref: "Cherry 1953; Broadbent 1958; Moray 1959; Treisman 1960 and 1964; Deutsch and Deutsch 1963; Gray and Wedderburn 1960; Corteen and Wood 1972; MacKay 1973; Hillyard et al 1973; Lavie 1995; Atkinson and Hilgard ch 6",
  },
  {
    id: "pa-l03-022",
    subject: S,
    topic: "selective-attention",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe the dichotic listening technique and the cocktail party effect. What have these studies revealed about attention?",
    plan: ["Describe the technique and shadowing", "Cherry's findings", "Cocktail party effect and own name", "What is processed in the unattended ear", "Individual differences and applications"],
    answer: `## The technique
In dichotic listening, a person wears headphones and hears two different messages at the same time, one in each ear. To make sure attention is on one message, the person is asked to shadow it, repeating it aloud word for word as it is heard. Afterwards, they are asked what they noticed in the other, unattended ear. Variants include asking participants to detect target words in either ear, or measuring physiological responses to unattended words.

## Cherry's findings
Colin Cherry in 1953 found that:
- participants could shadow one message accurately but remembered almost nothing of the other;
- they did not notice when the unattended message changed from English to German, or was played backwards;
- they did notice physical changes, such as a switch from a male to a female voice or a tone.
This suggested that unattended messages are processed for physical features but not meaning.

## The cocktail party effect
At a noisy party we can follow one conversation and ignore others, yet if someone across the room says our name, we often notice it. Neville Moray in 1959 found that about a third of participants detected their own name in the unattended ear, though they did not notice words repeated many times in that ear. Andrew Conway and colleagues later found that people with low working memory capacity were more likely to notice their name (about 65 percent) than those with high capacity (about 20 percent), suggesting that high-capacity people block distractors more effectively.

## What is processed in the unattended ear
- Physical features: almost always.
- Meaning: sometimes. Treisman found that participants followed a story when it switched ears; Corteen and Wood found galvanic skin responses to shock-associated words in the unattended ear; MacKay found that unattended words influenced the interpretation of ambiguous attended sentences.
- Memory: little lasting memory for unattended content.

## What the studies reveal
- Attention is selective, with limited capacity.
- Selection is not all or none: meaningful and important information can break through.
- The degree of processing of unattended information depends on its importance, on the load of the main task and on individual differences.
- These findings drove the theories of Broadbent, Treisman, Deutsch and Deutsch, and later Lavie.

## Applications
- Designing warning signals in aircraft and hospitals that break through attention.
- Hearing aid design, which struggles with noisy environments.
- Clinical research: dichotic listening shows a right ear advantage for verbal material, reflecting left hemisphere language dominance, used in studies of laterality and schizophrenia.

## Conclusion
Dichotic listening showed that we filter much of what reaches our ears, but the cocktail party effect shows that the filter is leaky: personally significant information can be detected without conscious attention.`,
    keyPoints: ["Description of dichotic listening and shadowing", "Cherry's findings on physical versus semantic features", "Moray's own name finding", "Conway's working memory link", "Evidence of semantic processing", "What the studies reveal about attention", "Applications including right ear advantage"],
    module: "sensation-perception/2-5",
    visuals: [
      { kind: "experiment", caption: "Cherry's findings", data: { title: "What do people notice in the ignored ear?", question: "What share noticed each change in the unattended message?", unit: "%", conditions: [{ label: "Switch to a female voice", value: 90 }, { label: "Own name", value: 33 }, { label: "Switch from English to German", value: 5 }], why: "Physical changes are noticed; meaning is mostly missed, except for highly significant words. Values approximate." } },
    ],
    ref: "Cherry 1953; Moray 1959; Conway, Cowan and Bunting 2001; Treisman 1960; Kimura 1961 right ear advantage",
  },
  {
    id: "pa-l03-023",
    subject: S,
    topic: "spatial-attention",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Explain spatial attention with reference to Posner's cueing paradigm, the spotlight and zoom lens models, and inhibition of return.",
    plan: ["Overt and covert attention", "Posner's cueing paradigm with results", "Endogenous versus exogenous cues", "Spotlight and zoom lens models, object-based attention", "Inhibition of return", "Neural basis and clinical links"],
    answer: `## Overt and covert attention
Overt attention means moving the eyes to look at something. Covert attention means shifting attention to a location without moving the eyes, as when we watch someone out of the corner of our eye. Michael Posner showed that covert attention can be measured precisely.

## Posner's cueing paradigm
Participants fixate a central point. A cue indicates where a target is likely to appear (left or right box), and then the target appears and participants press a key as fast as possible.
- Valid trials (about 80 percent): the target appears at the cued location.
- Invalid trials (about 20 percent): it appears at the other location.
- Neutral trials: the cue gives no information.
Results: responses are faster on valid trials and slower on invalid trials than on neutral trials, by roughly 20 to 50 milliseconds. Attention moves to the cued location before the eyes move, giving a benefit there and a cost elsewhere.

## Endogenous and exogenous cues
- Endogenous (central, voluntary) cues: an arrow at fixation pointing to one side. Attention shifts by choice, takes about 300 milliseconds to develop and is sustained. Benefits depend on the cue being informative.
- Exogenous (peripheral, reflexive) cues: a sudden flash at one location. Attention is captured automatically within about 100 milliseconds, even when the cue is uninformative.

## Spotlight and zoom lens
- Posner described attention as a spotlight that illuminates a region of space, enhancing processing within it. It moves from place to place.
- Charles Eriksen and James St James proposed the zoom lens model: the area of attention can be widened or narrowed, with a trade-off between breadth and resolution. A wide focus covers more space with less detail.
- Attention can sometimes be split between two non-adjacent locations, which challenges a single spotlight.
- Object-based attention: Robert Egly, Jon Driver and Robert Rafal showed that attention spreads more easily within an attended object than to an equally distant location on another object, so attention selects objects as well as locations.

## Inhibition of return
Posner and Yoav Cohen found that with exogenous cues, the benefit at the cued location lasts only about 200 to 300 milliseconds. After that, responses at the cued location become slower than at uncued locations. This inhibition of return discourages attention from returning to places already inspected, making visual search more efficient, like a foraging strategy.

## Neural basis and clinical links
- The dorsal attention network (intraparietal sulcus and frontal eye fields) controls voluntary shifts.
- The ventral network (temporo-parietal junction and ventral frontal cortex, mainly right hemisphere) reorients attention to unexpected stimuli.
- Damage to the right parietal lobe causes hemispatial neglect: patients ignore the left side of space. In Posner's task they show a marked deficit in disengaging attention from the right to respond to invalidly cued left targets.
- Anxiety: in dot probe tasks, a variant of cueing, anxious people respond faster to probes replacing threatening words or faces, showing attentional bias to threat.

## Conclusion
Posner's paradigm shows that covert attention enhances processing at attended locations and objects, can be guided voluntarily or captured reflexively, and is followed by inhibition of return. These findings link attention to brain networks and clinical disorders.`,
    keyPoints: ["Overt versus covert attention", "Posner's valid, invalid and neutral trials", "Benefits and costs in reaction time", "Endogenous versus exogenous cues", "Spotlight and zoom lens", "Object-based attention", "Inhibition of return", "Neglect and dot probe links"],
    module: "sensation-perception/2-5",
    visuals: [
      { kind: "experiment", caption: "Posner's cueing paradigm", data: { title: "Posner cueing", question: "Typical reaction times on each trial type (milliseconds)?", unit: " ms", max: 400, conditions: [{ label: "Valid cue", value: 250 }, { label: "Neutral cue", value: 280 }, { label: "Invalid cue", value: 320 }], why: "Attention moved to the cued place, speeding responses there and slowing them elsewhere. Values illustrative." } },
    ],
    ref: "Posner 1980; Posner and Cohen 1984; Eriksen and St James 1986; Egly, Driver and Rafal 1994; Corbetta and Shulman 2002; MacLeod, Mathews and Tata 1986",
  },
  {
    id: "pa-l03-024",
    subject: S,
    topic: "visual-search",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe Treisman's feature integration theory. What evidence from visual search, illusory conjunctions and neuropsychology supports it, and how has it been revised?",
    plan: ["The binding problem", "Two stages of feature integration theory", "Visual search: feature versus conjunction search", "Illusory conjunctions and Balint's syndrome", "Criticisms and guided search", "Applications and conclusion"],
    answer: `## The binding problem
The visual system analyses features such as colour, orientation and motion in partly separate brain areas. Yet we perceive unified objects: a red car moving left. How are features bound together into objects? Anne Treisman's feature integration theory (FIT), proposed with Garry Gelade in 1980, offered an answer.

## The theory
- Preattentive stage: basic features (colour, orientation, size, curvature, motion) are registered automatically, in parallel, across the whole visual field, in separate feature maps. This stage needs no attention.
- Focused attention stage: to perceive an object with a combination of features, attention must be directed serially to its location. Attention acts as the "glue" that binds the features at that location into an object file.
- Without focused attention, features may float free and be combined wrongly.

## Visual search evidence
In a visual search task, participants look for a target among distractors, and reaction time is measured as the number of distractors (set size) increases.
- Feature search: finding a red X among green Xs, or a vertical line among horizontals. The target "pops out", and reaction time hardly increases with set size (a flat slope), indicating parallel preattentive processing.
- Conjunction search: finding a red X among red Os and green Xs. No single feature defines the target; it differs only in its combination. Reaction time increases roughly linearly with set size, about 20 to 30 milliseconds per item for target-present trials and about twice that for target-absent trials, as if items were checked one by one until the target is found (self-terminating serial search).
- Search asymmetries: finding a Q among Os (the target has an extra feature, the tail) is fast, but finding an O among Qs (the target lacks a feature) is slow.

## Illusory conjunctions
When attention is diverted or displays are very brief, people combine features from different objects. Treisman and Hilton Schmidt briefly showed coloured letters flanked by digits that participants had to report first. Participants often reported illusory conjunctions, such as a red X when the display contained a red O and a blue X. This shows that features are registered separately and can be wrongly combined without attention.

## Neuropsychological evidence
- Balint's syndrome, after bilateral parietal damage, impairs spatial attention. Patient R.M., studied by Lynn Robertson and Treisman, made many illusory conjunctions even with long viewing times, consistent with the parietal lobe's role in binding features through location.
- Patients with unilateral neglect show more difficulty with conjunction than with feature search on the neglected side.
- Single-cell and imaging studies show specialised feature areas (V4 for colour, V5 for motion), supporting separate feature maps.

## Criticisms and revisions
- Not all conjunction searches are slow. Ken Nakayama and Gerald Silverman found that conjunctions of depth with colour or motion could be searched in parallel.
- Search difficulty is better described as a continuum of efficiency than as a strict split between parallel and serial.
- John Duncan and Glyn Humphreys's similarity theory: search difficulty depends on target-distractor similarity and distractor-distractor similarity, not just on features versus conjunctions.
- Jeremy Wolfe's guided search model: parallel preattentive processing produces an activation map that guides serial attention to the most likely candidates, combining bottom-up salience and top-down knowledge of the target. Guided search explains why some conjunction searches are fairly efficient.
- Treisman herself revised FIT to allow top-down inhibition of feature maps and to account for these findings.
- Real-world search uses scene context and expectations: we look for a mug on tables, not on the ceiling.

## Applications
- Airport baggage screening, radiology and lifeguarding are visual search tasks. Rare targets are missed more often (the prevalence effect, shown by Wolfe), which is important for screening design.
- Interface and road sign design: making critical information differ by a single feature, such as a red warning light, ensures pop-out.
- Research on autism suggests superior performance on some search tasks.

## Conclusion
Feature integration theory explained how attention binds features into objects, supported by the contrast between feature and conjunction search, illusory conjunctions and parietal patients. Later research showed that search efficiency varies more continuously, and guided search now integrates parallel guidance with serial attention.`,
    keyPoints: ["Binding problem", "Preattentive and focused attention stages", "Feature search pop-out with flat slope", "Conjunction search with linear slope", "Illusory conjunctions with Treisman and Schmidt", "Balint's syndrome patient R.M.", "Criticisms including Nakayama and Duncan and Humphreys", "Wolfe's guided search and applications"],
    module: "sensation-perception/2-6",
    visuals: [
      { kind: "compare", caption: "Visual search evidence", data: { title: "Two kinds of visual search", a: { label: "Feature search", points: ["Red X among green Xs", "Target pops out", "Time does not grow with set size"], summary: "Parallel and preattentive." }, b: { label: "Conjunction search", points: ["Red X among red Os and green Xs", "Must check items one by one", "Time grows with each extra item"], summary: "Serial, needs attention." } } },
      { kind: "flow", caption: "The theory", data: { title: "Feature integration theory", layout: "chain", nodes: [{ id: "f", label: "Feature maps", detail: "Colour, orientation, size, registered in parallel." }, { id: "a", label: "Focused attention", detail: "Spotlight on one location binds its features." }, { id: "o", label: "Object file", detail: "A red, tilted, moving object." }, { id: "r", label: "Recognition", detail: "Matched with stored knowledge." }] } },
    ],
    ref: "Treisman and Gelade 1980; Treisman and Schmidt 1982; Friedman-Hill, Robertson and Treisman 1995; Nakayama and Silverman 1986; Duncan and Humphreys 1989; Wolfe 1994 guided search; Wolfe, Horowitz and Kenner 2005",
  },
  {
    id: "pa-l03-025",
    subject: S,
    topic: "attention-capacity",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net"],
    question: "Explain Kahneman's capacity model of attention and Wickens's multiple resource theory. How do they account for dual-task performance?",
    plan: ["From bottlenecks to resources", "Kahneman's model: capacity, arousal, allocation policy", "Evidence from dual-task studies", "Wickens's multiple resources", "Evaluation and applications"],
    answer: `## From bottlenecks to resources
Filter theories located a single bottleneck. Capacity theories instead proposed that attention is a limited pool of mental effort or resources that can be shared among tasks. Performance suffers when the combined demands exceed the available capacity.

## Kahneman's capacity model
Daniel Kahneman's 1973 book "Attention and Effort" proposed:
- A single, general pool of attentional capacity, which can be divided flexibly among activities.
- The amount of capacity available varies with arousal: more effort is mobilised for demanding tasks, but very low or very high arousal reduces efficiency (consistent with the Yerkes Dodson law).
- An allocation policy decides how capacity is distributed, influenced by enduring dispositions (involuntary attention to sudden movement or one's own name), momentary intentions (the current goal), and evaluation of demands (whether there is enough capacity).
- Effort can be measured physiologically: pupil dilation increases with mental load, as Kahneman showed using mental arithmetic tasks.
- Two tasks can be done together if their combined demands do not exceed capacity; practice reduces a task's demands.

## Dual-task evidence
- Performance on a secondary task (such as reaction time to a tone) slows as the primary task becomes harder, used as a measure of spare capacity.
- Elizabeth Spelke, William Hirst and Ulric Neisser trained two students for many weeks to read stories while writing words to dictation. Eventually they could do both with good comprehension, and even categorise the dictated words, showing that practice greatly increases what can be done simultaneously.
- Pianists can shadow speech while sight-reading music after practice.

## Problems for a single resource
- Allan Allport, Barbara Antonis and Patricia Reynolds found that people could shadow speech and learn pictures at the same time with little interference, but shadowing interfered strongly with learning spoken words. Similar tasks interfere more than dissimilar ones, which a single general pool cannot explain.
- Difficulty and similarity have separate effects.

## Wickens's multiple resource theory
Christopher Wickens proposed that there are several pools of resources, differing along dimensions:
- Stages of processing: perceptual and cognitive versus response.
- Modalities: visual versus auditory input.
- Codes: spatial versus verbal.
- Visual channels: focal versus ambient vision.
Two tasks interfere more when they draw on the same resources. Listening to a radio talk while driving (auditory verbal plus visual spatial) is easier than reading a text message while driving (both visual).

## Evaluation
Strengths: explains effects of task difficulty, practice and similarity, and guides design. Weaknesses: resource concepts can become circular (tasks interfere because they share resources, and they share resources because they interfere); the number of resources is unclear. Bottleneck findings such as the psychological refractory period suggest a central limit on response selection as well. Baddeley's central executive is sometimes described as a general resource coordinating specific ones.

## Applications
Cockpit and car dashboard design, rules on mobile phone use while driving, multitasking at work, and the study of attention in ageing and ADHD.

## Conclusion
Kahneman's model reframed attention as flexible mental effort controlled by arousal and allocation policy. Wickens's multiple resources explain why some task combinations interfere much more than others.`,
    keyPoints: ["Shift from bottleneck to resources", "Single pool, arousal and allocation policy", "Pupil dilation as effort measure", "Spelke, Hirst and Neisser practice study", "Allport's similarity finding", "Wickens's resource dimensions", "Evaluation including circularity", "Applications such as driving"],
    module: "sensation-perception/2-6",
    visuals: [
      { kind: "curve", caption: "Kahneman's capacity model", data: { kind: "inverted-u", title: "Arousal and capacity", caption: "Kahneman: available effort rises with arousal, but extreme arousal makes allocation inefficient." } },
      { kind: "sort", caption: "Wickens's multiple resource theory", data: { prompt: "Which pair interferes more while driving (a visual spatial task)?", buckets: ["Less interference", "More interference"], items: [{ text: "Listening to a news programme", bucket: 0 }, { text: "Reading a text message", bucket: 1 }, { text: "Looking at a map on the screen", bucket: 1 }, { text: "Humming a song", bucket: 0 }] } },
    ],
    ref: "Kahneman 1973; Spelke, Hirst and Neisser 1976; Allport, Antonis and Reynolds 1972; Wickens 1984 and 2002",
  },
  {
    id: "pa-l03-026",
    subject: S,
    topic: "divided-attention",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on the psychological refractory period.",
    plan: ["Define PRP and the procedure", "Results", "Bottleneck explanation", "Significance"],
    answer: `## Meaning
The psychological refractory period (PRP) is the delay in responding to a second stimulus when it follows a first stimulus very closely in time, so that the two responses overlap. Alan Welford studied it in the 1950s, and Harold Pashler developed the modern account.

## Procedure and results
Participants make two speeded responses to two stimuli presented in quick succession, for example pressing a key to a tone (task 1) and naming a letter (task 2). The interval between the stimuli (stimulus onset asynchrony, SOA) is varied.
- At long SOAs (about one second), both responses are fast.
- As SOA shortens, reaction time to the second stimulus increases sharply, roughly by the amount of overlap, while the first response is little affected.
- The effect occurs even when the two tasks use different senses and different response modalities, and is reduced but not removed by extensive practice.

## Explanation
Pashler's central bottleneck model proposes that perception and response execution can occur in parallel, but the central stage of response selection (deciding what to do) can handle only one task at a time. Task 2 must wait until task 1 has cleared the bottleneck. Alternative accounts attribute the delay to strategic choices about sharing capacity.

## Significance
The PRP shows a central limit on doing two things at once that capacity theories alone do not explain. It helps explain the dangers of using a phone while driving: a driver deciding how to answer a message may be slower to decide to brake.`,
    keyPoints: ["Definition", "Procedure with SOA", "Second response slows at short SOA", "Central bottleneck at response selection", "Practical significance"],
    module: "sensation-perception/2-6",
    visuals: [
      { kind: "flow", caption: "Explanation", data: { title: "The central bottleneck", layout: "chain", nodes: [{ id: "p", label: "Perceive both stimuli", detail: "Can happen in parallel." }, { id: "s", label: "Select a response", detail: "One task at a time: task 2 waits here." }, { id: "e", label: "Execute the response", detail: "Can overlap." }] } },
    ],
    ref: "Welford 1952; Pashler 1994 Psychological Bulletin; Levy, Pashler and Boer 2006 driving",
  },
  {
    id: "pa-l03-027",
    subject: S,
    topic: "automaticity",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Distinguish between automatic and controlled processing. Discuss Schneider and Shiffrin's experiments and the development of automaticity through practice.",
    plan: ["Define the two types of processing", "Schneider and Shiffrin's search studies", "Consistent versus varied mapping", "Criteria and theories of automaticity", "Costs, clinical links and conclusion"],
    answer: `## Two kinds of processing
- Automatic processing is fast, effortless, parallel, not limited by capacity, difficult to stop once started and often unconscious. Examples: reading a familiar word, recognising a friend's face, an experienced driver changing gears.
- Controlled processing is slow, effortful, serial, limited by capacity, flexible and under conscious control. Examples: learning to drive, solving a new problem, reading in an unfamiliar script.

## Schneider and Shiffrin's experiments
Walter Schneider and Richard Shiffrin in 1977 asked participants to memorise a set of one to four target characters (the memory set), then search rapidly presented displays of one to four characters for any of the targets.
- Varied mapping: targets and distractors changed roles across trials (a letter could be a target on one trial and a distractor on another). Detection time and accuracy worsened as memory set size and display size increased, indicating serial controlled search.
- Consistent mapping: targets were always from one category (for example digits) and distractors always from another (letters), or the same letters were always targets. Performance was hardly affected by memory set or display size: the targets popped out, indicating automatic detection.
- In later studies with extensive practice (thousands of trials) under consistent mapping, letters that had always been targets became automatic and continued to attract attention even when they were later made distractors, impairing performance. Automatic processes are hard to unlearn.

## Criteria of automaticity
- Speed and parallel processing.
- No reduction in performance with increased load.
- Little interference with other tasks.
- Unavailability to consciousness.
- Obligatory: occurs even when not wanted, as in the Stroop effect.
Few processes meet all criteria fully, so automaticity is better seen as a matter of degree.

## Theories
- Practice changes controlled processes into automatic ones, especially when the mapping between stimuli and responses is consistent.
- Gordon Logan's instance theory: with practice, people store many specific instances of a task and eventually retrieve the answer directly from memory instead of computing it (for example, knowing that 7 x 8 = 56 rather than calculating it).
- Paul Fitts's stages of skill learning: cognitive, associative and autonomous stages.
- Norman and Shallice's model: routine actions are controlled by schemas selected automatically by contention scheduling; a supervisory attentional system intervenes for new or difficult situations.

## Costs and clinical links
- Action slips: James Reason found that errors such as putting salt in tea instead of sugar happen when automatic routines are triggered in the wrong context.
- Automatic processing underlies habits and addictions, where drug cues capture attention automatically.
- In anxiety and depression, automatic negative thoughts and attentional biases operate with little awareness, which CBT and attention bias modification target.
- Skill expertise depends on automaticity, freeing controlled resources for strategy.

## Conclusion
Automatic and controlled processes lie at two ends of a continuum. Schneider and Shiffrin showed that consistent practice turns effortful search into automatic detection, which is efficient but inflexible.`,
    keyPoints: ["Characteristics of automatic versus controlled processing", "Schneider and Shiffrin procedure", "Varied versus consistent mapping results", "Hard to unlearn automatic detection", "Criteria of automaticity as a continuum", "Logan's instance theory or Norman and Shallice", "Costs such as action slips and clinical links"],
    module: "sensation-perception/2-6",
    visuals: [
      { kind: "compare", caption: "Two kinds of processing", data: { title: "Automatic versus controlled", a: { label: "Automatic", points: ["Fast and parallel", "Effortless, unaffected by load", "Hard to stop"], summary: "Experienced driver." }, b: { label: "Controlled", points: ["Slow and serial", "Effortful, limited capacity", "Flexible and conscious"], summary: "Learner driver." } } },
    ],
    ref: "Schneider and Shiffrin 1977; Shiffrin and Schneider 1977; Logan 1988; Fitts and Posner 1967; Norman and Shallice 1986; Reason 1979",
  },
  {
    id: "pa-l03-028",
    subject: S,
    topic: "automaticity",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "mcp-entrance"],
    question: "Write a short note on the Stroop effect and its uses.",
    plan: ["Describe the task", "Result and explanation", "Variants", "Clinical and research uses"],
    answer: `## The task
John Ridley Stroop in 1935 asked participants to name the ink colour of words. In the incongruent condition, the words are colour names printed in a different colour, such as the word RED printed in blue ink. Naming the ink colour (blue) is much slower and more error-prone than naming the colour of neutral stimuli (such as XXXX printed in blue) or congruent stimuli (RED in red).

## Explanation
Reading is highly practised and automatic in literate adults, so the word's meaning is processed whether we want it or not and competes with the colour-naming response.
- Speed of processing account: reading is faster than colour naming, so the word reaches the response stage first.
- Automaticity account: reading is obligatory and cannot be suppressed.
- Parallel distributed processing models: the stronger reading pathway interferes with the weaker colour pathway, and top-down attention from the prefrontal cortex supports the task-relevant pathway.
- The anterior cingulate cortex detects conflict and the dorsolateral prefrontal cortex exerts control.
The reverse effect (ink colour interfering with word reading) is small.

## Variants
- Emotional Stroop: participants name the colour of emotional words. People with anxiety disorders are slower to colour-name threat words related to their concerns (spider words in spider phobia, trauma words in PTSD), showing attentional bias.
- Numerical Stroop and spatial Stroop.

## Uses
The Stroop test is a standard neuropsychological measure of response inhibition and executive function, impaired in frontal lobe damage, ADHD, schizophrenia and dementia. Versions in Indian languages are used in clinical assessment; the effect depends on fluency in the script.`,
    keyPoints: ["Description of task and incongruent condition", "Result", "Automatic reading explanation", "Neural basis of conflict and control", "Emotional Stroop", "Clinical uses"],
    module: "sensation-perception/2-6",
    visuals: [
      { kind: "reveal", caption: "The task", data: { prompt: "Name the ink colour aloud as fast as you can: the word GREEN printed in red, then the word BLUE printed in yellow. Why is it hard?", answer: "Reading is automatic, so the words 'green' and 'blue' come to mind and compete with the colours you must name (red, yellow). This is the Stroop effect." } },
    ],
    ref: "Stroop 1935; MacLeod 1991 Psychological Bulletin review; Williams, Mathews and MacLeod 1996 emotional Stroop; Cohen, Dunbar and McClelland 1990",
  },
  {
    id: "pa-l03-029",
    subject: S,
    topic: "vigilance",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "What is vigilance? Describe the vigilance decrement, its explanations and the factors that affect sustained attention.",
    plan: ["Define vigilance and its importance", "Mackworth's clock test", "Vigilance decrement and SDT analysis", "Theories", "Factors affecting vigilance", "Applications"],
    answer: `## Meaning
Vigilance, or sustained attention, is the ability to remain alert and detect infrequent, unpredictable signals over long periods. It matters in jobs such as radar and CCTV monitoring, airport baggage screening, air traffic control, long-distance driving, quality control in factories, anaesthesia and intensive care monitoring.

## Mackworth's clock test
Norman Mackworth, studying why Royal Air Force radar operators missed submarines during the Second World War, built a clock-like display whose pointer moved in regular steps. Occasionally, the pointer made a double jump, the signal to be detected. Participants watched for two hours.
- Detection rates fell by about 10 to 15 percent within the first 30 minutes and then declined more slowly.
- A short rest, a phone call or an amphetamine restored performance.
This decline over time is the vigilance decrement.

## Signal detection analysis
Analyses using signal detection theory show that the decrement often reflects a shift towards a more conservative criterion (participants say "yes" less often), especially when signals are rare, rather than only a loss of sensitivity. In tasks with high event rates or demanding discriminations, sensitivity (d prime) itself declines.

## Theories
- Arousal theory: monotonous tasks reduce physiological arousal, lowering performance, consistent with the Yerkes Dodson law.
- Expectancy theory: people adjust their readiness according to how often they expect signals; rare signals lead to low expectancy and more misses.
- Resource depletion (overload) theory: Joel Warm and colleagues showed that vigilance tasks are mentally demanding and stressful, not merely boring, and that sustained attention uses up limited resources, measured by falling cerebral blood flow velocity in the right hemisphere.
- Mindlessness (underload) theory: monotony leads to mind-wandering and disengagement from the task.

## Factors affecting vigilance
- Signal characteristics: weak, brief and rare signals are missed more; the prevalence effect in baggage screening shows that very rare targets are often missed.
- Event rate: a high rate of non-signal events increases the decrement.
- Time on task and time of day: performance is poorer in the early morning hours and after lunch, and circadian rhythms and sleep deprivation strongly impair vigilance.
- Environment: noise, heat, and monotony.
- Individual differences: introverts often perform better than extraverts, consistent with Eysenck's arousal theory; ADHD involves marked sustained attention deficits.
- Drugs: caffeine and stimulants improve vigilance; alcohol and sedatives impair it.
- Feedback, knowledge of results and rest breaks improve performance.

## Measurement
Continuous performance tests (CPT), such as responding to the letter X only when it follows A, are used clinically to measure sustained attention in ADHD and schizophrenia.

## Applications
Rotating shifts, scheduled breaks, inserting artificial signals with feedback (for example adding fake threat images in baggage x-rays), automation with human oversight, and attention to sleep for drivers and night-shift health workers.

## Conclusion
Sustained attention declines with time on task, partly because criteria shift and partly because resources are depleted. Designing tasks, schedules and environments with these limits in mind reduces dangerous errors.`,
    keyPoints: ["Definition and real-world importance", "Mackworth clock procedure and findings", "SDT analysis of criterion shift", "At least three theories", "Factors including signal rarity and sleep", "CPT measurement", "Applications"],
    module: "sensation-perception/2-6",
    visuals: [
      { kind: "experiment", caption: "Mackworth's clock test", data: { title: "The vigilance decrement", question: "Percentage of signals detected over a two-hour watch (illustrative)?", unit: "%", conditions: [{ label: "First 30 minutes", value: 85 }, { label: "Second 30 minutes", value: 73 }, { label: "Fourth 30 minutes", value: 70 }], why: "The steepest fall comes early in the watch; breaks restore performance." } },
    ],
    ref: "Mackworth 1948; Warm, Parasuraman and Matthews 2008; See et al 1995 SDT meta-analysis; Wolfe et al 2005 prevalence",
  },
  {
    id: "pa-l03-030",
    subject: S,
    topic: "awareness",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss inattentional blindness and change blindness. What do they reveal about the relationship between attention and awareness, and what are their practical implications?",
    plan: ["Define both phenomena", "Classic inattentional blindness studies and factors", "Change blindness studies", "Explanations", "What they reveal about awareness", "Practical implications and conclusion"],
    answer: `## Definitions
- Inattentional blindness is the failure to notice a fully visible but unexpected object or event when attention is engaged elsewhere.
- Change blindness is the failure to notice a large change in a scene, typically when the change occurs during a brief disruption such as an eye movement, a blink, a flicker or a cut in a film.
Both show that seeing requires attention, and that we perceive far less of the world in detail than we feel we do.

## Inattentional blindness
- Arien Mack and Irvin Rock asked participants to judge which arm of a briefly presented cross was longer. On a critical trial, an unexpected shape appeared near the cross. Many participants failed to see it, especially when it appeared away from fixation.
- Daniel Simons and Christopher Chabris's "invisible gorilla" study: participants watched a video of two teams passing basketballs and counted the passes of the team in white. Midway, a person in a gorilla suit walked through the scene, stopped, thumped its chest and walked off over about nine seconds. About half the participants did not notice it. When the counting task was harder, more missed it.
- Trafton Drew and colleagues found that about 83 percent of expert radiologists searching lung scans for nodules failed to notice a gorilla image about 48 times the size of a typical nodule inserted into the scans, although eye tracking showed many had looked directly at it.
- Factors that increase it: high attentional load, the unexpected object being dissimilar to what is attended (in the gorilla study, a black gorilla was missed more by those attending to white shirts), lower working memory capacity, and expectation.
- Using a mobile phone while walking increased inattentional blindness: Ira Hyman found that few phone users noticed a unicycling clown nearby.

## Change blindness
- Flicker paradigm: Ronald Rensink, Kevin O'Regan and James Clark alternated an original and a modified photograph with a brief blank between them. Large changes, such as a jet engine appearing and disappearing, took many seconds to detect, though once noticed they were obvious.
- Real-world studies: Simons and Daniel Levin had an experimenter ask a pedestrian for directions. During the conversation, two men carrying a door passed between them, and the experimenter was swapped for a different person. About half the pedestrians did not notice they were now talking to someone else.
- Continuity errors in films, such as a drink changing level between shots, often go unnoticed.
- Change blindness blindness: people greatly overestimate their ability to detect changes.

## Explanations
- Attention is needed for conscious perception: unattended objects may be processed partly but not reach awareness. Mack and Rock argued "there is no conscious perception without attention".
- Inattentional amnesia (Jeremy Wolfe): the object may be seen briefly but not encoded in memory.
- Sparse representation: the brain does not build a detailed internal model of the whole scene; it uses the world as an "outside memory", looking again when information is needed (O'Regan). We perceive the gist of a scene and the details of what we attend to.
- Comparison failure: even when both versions are encoded, they may not be compared.
- Expectation and attentional set: we see what we are tuned to look for.

## What they reveal about attention and awareness
- Attention acts as a gateway to awareness; looking is not the same as seeing.
- Our subjective impression of a rich, detailed visual world is partly an illusion created by being able to look anywhere at will.
- Some unattended information is still processed (it can prime later responses), so awareness and processing are not the same.

## Practical implications
- Driving: drivers, especially those using phones, can "look but fail to see" motorcyclists and pedestrians. Studies show phone conversations, even hands-free, increase missed signals.
- Eyewitness testimony: witnesses may not notice important events or changes in perpetrators.
- Medicine: radiologists and surgeons can miss unexpected findings; checklists and second readers help.
- Aviation: pilots using head-up displays have missed aircraft on the runway in simulations.
- Magic and pickpocketing exploit misdirection of attention.
- Security and safety design: important warnings should be salient and expected.

## Conclusion
Inattentional blindness and change blindness show that awareness depends on attention, that the brain represents scenes sparsely, and that people overestimate how much they see. These limits have serious consequences in driving, medicine and law, and inform the design of safer systems.`,
    keyPoints: ["Definitions of both phenomena", "Mack and Rock procedure", "Invisible gorilla with about 50 percent missing", "Radiologist gorilla study", "Flicker and door studies of change blindness", "Explanations: attention for awareness, sparse representation, amnesia", "What they reveal about awareness", "Practical implications"],
    module: "sensation-perception/3-3",
    visuals: [
      { kind: "experiment", caption: "Inattentional blindness", data: { title: "Missing the unexpected", question: "What share of people failed to notice the unexpected event?", unit: "%", conditions: [{ label: "Gorilla while counting passes", value: 50 }, { label: "Experimenter swapped behind a door", value: 50 }, { label: "Radiologists and a gorilla in a lung scan", value: 83 }], why: "When attention is busy, even large, visible events can fail to reach awareness." } },
      { kind: "compare", caption: "Definitions", data: { title: "Two kinds of blindness", a: { label: "Inattentional blindness", points: ["An unexpected object appears", "Attention is on another task", "The gorilla walks through unseen"], summary: "Missing something new." }, b: { label: "Change blindness", points: ["Something in the scene changes", "Change hidden by a flicker or cut", "A different person gives directions"], summary: "Missing a difference." } } },
    ],
    ref: "Mack and Rock 1998; Simons and Chabris 1999 Perception; Simons and Levin 1998; Rensink, O'Regan and Clark 1997; Drew, Vo and Wolfe 2013 Psychological Science; Hyman et al 2010; Strayer and Johnston 2001",
  },
];
