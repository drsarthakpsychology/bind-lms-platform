import type { LongQA } from "@/lib/prep/long-types";

const S = "cognitive" as const;

export const COGNITIVE_L01: LongQA[] = [
  {
    id: "cog-l01-001",
    subject: S,
    topic: "memory-models",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Describe and critically evaluate the multi-store model of memory proposed by Atkinson and Shiffrin.",
    plan: ["State the model and its place in the information-processing approach", "Describe the three stores with capacity, duration and coding", "Control processes: attention, rehearsal, retrieval", "Evidence: serial position, Brown Peterson, coding studies, amnesia", "Criticisms and later models", "Conclusion"],
    answer: `## The model
In 1968 Richard Atkinson and Richard Shiffrin proposed that memory consists of three separate stores through which information flows in sequence: a sensory register, a short-term store and a long-term store. It is often called the modal model because many theorists of the time shared its main features. It treated the mind like a computer that takes in, holds and retrieves information, and it distinguished structural features (the stores) from control processes (strategies such as rehearsal that the person chooses).

## The three stores
| Store | Capacity | Duration | Main coding | Loss of information |
| Sensory register | Large, all that strikes the senses | Iconic about 0.25 to 0.5 seconds; echoic about 2 to 4 seconds | Modality-specific, a raw copy | Decay, or masking by new input |
| Short-term store | About 7 plus or minus 2 items (Miller), or about 4 chunks | About 15 to 30 seconds without rehearsal | Mainly acoustic | Displacement and decay |
| Long-term store | Practically unlimited | Minutes to a lifetime | Mainly semantic | Interference, retrieval failure |

## Control processes
- Attention transfers information from the sensory register to the short-term store; unattended information is lost.
- Maintenance rehearsal keeps information in the short-term store, and the more an item is rehearsed, the more likely it is to be transferred to long-term memory.
- Retrieval brings information from long-term memory back into the short-term store for use.
- Chunking, coding and decisions about what to rehearse are also control processes.

## Supporting evidence
- Sperling's partial report studies showed a brief, large-capacity visual store.
- John Brown and Lloyd and Margaret Peterson found that when rehearsal was prevented by counting backwards, recall of a consonant trigram fell to about 10 percent after 18 seconds, suggesting rapid loss from short-term memory.
- The serial position curve: in free recall of a list, the first items (primacy effect) and last items (recency effect) are recalled best. Primacy is thought to reflect extra rehearsal and transfer to the long-term store; recency reflects items still in the short-term store. Murray Glanzer and Anita Cunitz showed that a 30-second distracting delay removed the recency effect but left primacy, while slower presentation improved primacy but not recency, a double dissociation.
- Coding differences: Alan Baddeley found that short-term recall was confused by acoustically similar words (cat, cap, can), whereas long-term recall was confused by semantically similar words (big, large, huge).
- Neuropsychology: H.M., after removal of his medial temporal lobes, had normal digit span but could not form new long-term memories; patient K.F., studied by Tim Shallice and Elizabeth Warrington, had a very poor short-term span but normal long-term learning. This double dissociation suggests separate stores.

## Criticisms
- The short-term store is too simple. K.F.'s poor verbal span alongside normal visual short-term memory and normal long-term learning implies that short-term memory has several components and is not a necessary gateway to long-term memory. Baddeley and Hitch replaced it with a multi-component working memory.
- Rehearsal is not sufficient for long-term storage. Fergus Craik and Robert Lockhart showed that the type of processing (deep, meaningful processing) matters more than the amount of maintenance rehearsal.
- The model is too linear and passive. Information in long-term memory influences what we attend to and how we code it, so flow is two-way.
- Long-term memory is not one store: Endel Tulving and others distinguished episodic, semantic and procedural memory, and implicit memory can be preserved in amnesia.
- Much learning happens without rehearsal, such as remembering a dramatic event.
- The evidence relied heavily on artificial laboratory tasks with word lists and letters, raising questions of ecological validity.
- Coding is not exclusively acoustic or semantic: short-term memory can hold visual information and long-term memory holds sounds and images.

## Contribution
Despite these criticisms, the model was enormously influential. It established the distinction between short-term and long-term memory, generated testable predictions, explained the serial position curve and organised decades of research. Later models refined rather than discarded it.

## Conclusion
The multi-store model offers a clear, testable framework with strong support for the distinction between brief and lasting memory. Its weaknesses are its oversimplified view of short-term memory as a single store, its emphasis on rehearsal and its linear flow. Working memory, levels of processing and multiple memory systems theories built on its foundation.`,
    keyPoints: ["Three stores with capacity, duration and coding", "Control processes including rehearsal and attention", "Serial position curve with Glanzer and Cunitz", "Brown Peterson findings", "Baddeley's acoustic versus semantic coding", "H.M. and K.F. double dissociation", "At least four criticisms including working memory and levels of processing", "Balanced conclusion"],
    pitfalls: ["Describing without evaluating", "Getting the durations wrong", "Using K.F. as support without noting it also challenges the model"],
    module: "learning-memory/3-1",
    visuals: [
      { kind: "memoryflow", caption: "Criticisms", data: { caption: "Follow an item from the senses to long-term memory. What happens if you stop rehearsing it?" } },
      { kind: "experiment", caption: "Supporting evidence", data: { title: "Glanzer and Cunitz: delay and the recency effect", question: "How well are the last few words of a list recalled with and without a 30-second distracting delay?", unit: "%", conditions: [{ label: "Last items, immediate recall", value: 70 }, { label: "Last items, after 30 s delay", value: 25 }], why: "The delay empties the short-term store, so recency disappears while primacy remains. Values are approximate." } },
    ],
    ref: "Atkinson and Shiffrin 1968; Atkinson and Hilgard ch 8; Peterson and Peterson 1959; Glanzer and Cunitz 1966; Baddeley 1966; Shallice and Warrington 1970",
  },
  {
    id: "cog-l01-002",
    subject: S,
    topic: "sensory-memory",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "What is sensory memory? Describe Sperling's experiments on iconic memory and the evidence for echoic memory.",
    plan: ["Define sensory memory and its function", "Sperling's whole report and partial report procedures", "Results and what they show about capacity and duration", "Echoic memory evidence", "Significance and criticisms"],
    answer: `## Meaning
Sensory memory is the very brief storage of sensory information in a relatively unprocessed form, just long enough for attention to select some of it for further processing. Each sense is thought to have its own store; the best studied are iconic (visual) and echoic (auditory) memory, terms introduced by Ulric Neisser.

## Sperling's experiments
George Sperling in 1960 flashed an array of 12 letters in three rows of four for 50 milliseconds.
- Whole report: participants reported as many letters as they could. They recalled about 4 or 5, but insisted they had seen more, which faded as they reported.
- Partial report: immediately after the display, a high, medium or low tone signalled which row to report. Since participants did not know which row would be cued, the number they reported from the cued row, multiplied by three, estimates how many letters were available in total. With an immediate tone, participants reported about 3 of the 4 letters in a row, implying about 9 of the 12 letters (75 percent) were available.
- Delaying the tone: as the delay increased to about one second, partial report fell to the level of whole report.
- Interpretation: there is a large-capacity visual store that holds a fleeting image, but it fades within about a second, faster than items can be reported. The whole report limit reflects decay during reporting, not the capacity of the store.
- A bright visual mask after the display wiped out the advantage, showing the store can be overwritten.
- Partial report cued by category (letters versus digits) gave no advantage, suggesting the icon is pre-categorical: it holds physical features, not meaning.

## Echoic memory
- Neville Moray and colleagues and later Christopher Darwin, Michael Turvey and Robert Crowder used an auditory version of partial report, the "three-eared man" procedure, with letters presented from left, right and centre. Partial report showed an advantage lasting up to about 2 to 4 seconds, longer than iconic memory.
- The modality effect and suffix effect: in serial recall of spoken lists, the last item is recalled better than for written lists, because it remains in echoic memory; an irrelevant spoken word at the end (a suffix such as "go") removes this advantage.
- Mismatch negativity, an ERP response to a deviant sound in a sequence, shows the brain keeps a few seconds of auditory trace.

## Significance
Sensory memory explains how we perceive a continuous visual world across eye movements and blinks, and how we understand speech, which unfolds over time and needs a few seconds of sound to be held for analysis.

## Criticisms
Some researchers argued that iconic memory is an artefact of laboratory conditions with brief flashes and no eye movements. Others distinguish visible persistence (the image seems to linger) from informational persistence (information about the display remains available). Still, the core findings have been widely replicated.

## Conclusion
Sperling's partial report method showed that visual sensory memory is large but fades within a second, while echoic memory lasts a few seconds. These stores form the first stage of the information-processing models of memory.`,
    keyPoints: ["Definition and function of sensory memory", "Whole versus partial report procedures", "Correct results: about 4 to 5 versus about 9 of 12", "Decay within about one second with delayed cue", "Pre-categorical nature and masking", "Echoic memory duration and evidence", "Significance and criticism"],
    module: "learning-memory/3-1",
    visuals: [
      { kind: "experiment", caption: "Sperling's experiments", data: { title: "Sperling's partial report", question: "Of 12 letters flashed for 50 ms, how many were available to the participant?", unit: " letters", max: 12, conditions: [{ label: "Whole report", value: 4.5 }, { label: "Partial report, immediate tone", value: 9 }, { label: "Partial report, tone after 1 s", value: 4.5 }], why: "The image holds most letters but fades within a second, faster than they can be named." } },
    ],
    ref: "Sperling 1960 Psychological Monographs; Atkinson and Hilgard ch 8 (partial-report experiment); Darwin, Turvey and Crowder 1972; Neisser 1967",
  },
  {
    id: "cog-l01-003",
    subject: S,
    topic: "short-term-memory",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Write a short note on the capacity and duration of short-term memory.",
    plan: ["Capacity: Miller, chunking, Cowan", "Duration: Brown Peterson", "Decay versus interference", "Practical relevance"],
    answer: `## Capacity
George Miller's 1956 paper "The magical number seven, plus or minus two" argued that short-term memory can hold about 5 to 9 items, as shown in digit span tasks. The key unit is the chunk, a meaningful unit of information. Chunking groups items into larger units: the letters F B I C I A B B C are hard as nine letters but easy as three chunks (FBI, CIA, BBC). An Indian mobile number of ten digits is usually remembered as two or three chunks. Later research by Nelson Cowan suggests the true capacity, when chunking and rehearsal are prevented, is closer to 4 chunks. Span is also affected by word length: people recall fewer long words than short ones, because span depends on how much can be rehearsed in about two seconds (the word length effect).

## Duration
John Brown and Lloyd and Margaret Peterson presented a trigram of consonants (such as KBF) and then had participants count backwards by threes to prevent rehearsal. Recall fell to about 10 percent after 18 seconds. Without rehearsal, information in short-term memory is lost within about 15 to 30 seconds.

## Decay or interference?
Geoffrey Keppel and Benton Underwood showed that on the first trial there was little forgetting even after 18 seconds; forgetting built up over trials as earlier trigrams interfered with later ones (proactive interference). Changing the category of items produced release from proactive interference, as Delos Wickens showed. So interference, not only decay, explains short-term forgetting.

## Relevance
Instructions, phone numbers and complex sentences that exceed this capacity are forgotten, which matters for teaching, design of instructions and patient communication.`,
    keyPoints: ["Miller's seven plus or minus two", "Chunking with example", "Cowan's about four", "Brown Peterson finding", "Interference explanation and release from PI"],
    module: "learning-memory/3-1",
    visuals: [
      { kind: "reveal", caption: "Capacity", data: { prompt: "Try to hold this string: 1 9 4 7 2 0 2 6 1 5 0 8. How could chunking help?", answer: "Group it as meaningful dates: 1947 (Independence), 2026, 1508. Twelve digits become three chunks, within the limit of short-term memory." } },
    ],
    ref: "Miller 1956; Cowan 2001; Peterson and Peterson 1959; Keppel and Underwood 1962; Wickens 1972",
  },
  {
    id: "cog-l01-004",
    subject: S,
    topic: "working-memory",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "cuet-pg"],
    question: "Discuss Baddeley and Hitch's working memory model. Describe each component, the evidence for it and its clinical and educational applications, and evaluate the model.",
    plan: ["Why a working memory model was needed", "Phonological loop with evidence", "Visuospatial sketchpad with evidence", "Central executive with evidence", "Episodic buffer", "Neural basis, applications, evaluation and conclusion"],
    answer: `## Why a new model?
Alan Baddeley and Graham Hitch in 1974 questioned the idea of a single short-term store. If short-term memory were a single gateway with about seven slots, filling it with a digit load should cripple reasoning and learning. Yet in their dual-task studies, participants holding up to six digits could still carry out reasoning and comprehension tasks with only modest slowing. Patients such as K.F. had very poor verbal span but normal long-term learning. Baddeley and Hitch proposed that short-term memory is a working memory: a limited-capacity system for temporarily holding and manipulating information during complex tasks such as reasoning, comprehension and learning. It is made up of several components.

## The phonological loop
The phonological loop holds speech-based information. It has two parts:
- A phonological store (the inner ear) that holds sounds for about 1.5 to 2 seconds before they fade.
- An articulatory control process (the inner voice) that refreshes the store by subvocal rehearsal and converts written material into speech code.
Evidence:
- Phonological similarity effect: lists of similar-sounding letters (B, G, V, P, T) are harder to recall in order than dissimilar ones (F, W, K, S, Y).
- Word length effect: people recall more short words (wit, sum, harm) than long words (university, opportunity), because span equals roughly what can be said in about two seconds. Speakers of languages with shorter number words, such as Chinese, have longer digit spans than speakers of languages with longer ones, such as Welsh.
- Articulatory suppression: repeating "the, the, the" aloud blocks the articulatory process, removing the word length effect and, for visual presentation, the phonological similarity effect.
- Irrelevant speech effect: background speech, even in an unknown language, disrupts serial recall.
- Function: the loop is critical for learning new vocabulary and foreign words. Patient P.V., with a phonological store deficit, could not learn Russian words but could learn word pairs in her own language.

## The visuospatial sketchpad
The sketchpad (the inner eye) holds and manipulates visual and spatial information, such as the layout of a room or a route. Robert Logie divided it into a visual cache (form and colour) and an inner scribe (spatial and movement information).
Evidence:
- Lee Brooks found that participants judging corners of an imagined letter F were slower when they responded by pointing (a spatial task) than by saying yes or no, while for verbal sentences the reverse was true.
- A spatial tracking task disrupts imagery-based mnemonics but not verbal rehearsal.
- Visual and spatial tasks interfere with each other more than with verbal tasks, supporting separate subsystems.

## The central executive
The central executive is an attentional control system with no storage of its own. It directs attention, coordinates the subsystems, switches between tasks and retrieval strategies, and inhibits irrelevant information. Baddeley linked it to Donald Norman and Tim Shallice's supervisory attentional system.
Evidence:
- Random number generation, which requires suppressing habitual sequences, interferes strongly with tasks such as chess and reasoning.
- Patients with frontal lobe damage show dysexecutive syndrome: poor planning, perseveration and difficulty switching tasks, with normal span.
- Dual-task deficits in Alzheimer's disease: patients are disproportionately impaired when combining two simple tasks.

## The episodic buffer
In 2000 Baddeley added the episodic buffer, a limited-capacity store of about four chunks that integrates information from the loop, the sketchpad and long-term memory into multimodal episodes, and links working memory with conscious awareness. It was added because the original model could not explain how people recall prose of around 15 to 20 words, far beyond phonological span, or how densely amnesic patients could recall a short story immediately while having no long-term memory of it.

## Neural basis
Neuroimaging links the phonological store to the left inferior parietal region, articulatory rehearsal to Broca's area and premotor cortex, the sketchpad to right hemisphere occipital and parietal regions, and the central executive to the dorsolateral prefrontal cortex.

## Applications
- Education: Susan Gathercole showed that children with poor working memory struggle to follow multi-step instructions and fall behind in reading and mathematics, often being mislabelled as inattentive. Teachers can reduce load by giving short instructions, visual supports and repetition.
- Developmental disorders: weak phonological loop function in developmental language disorder and dyslexia; executive and working memory deficits in ADHD.
- Clinical: working memory impairment is a core cognitive feature of schizophrenia and predicts functional outcome. In depression and anxiety, worry and rumination consume executive resources, which attentional control theory uses to explain poor concentration.
- Ageing: executive decline contributes to difficulty with multitasking.
- Assessment: the Wechsler working memory index (digit span forwards, backwards and sequencing, arithmetic) draws on the loop and executive.

## Evaluation
Strengths:
- Explains dual-task findings, neuropsychological dissociations and many everyday cognitive tasks.
- Has generated decades of research and practical applications.
- Supported by converging evidence from experiments, patients and imaging.
Weaknesses:
- The central executive was long vague, a "homunculus" that does whatever is needed. Later work by Akira Miyake and colleagues separated executive functions into inhibition, shifting and updating, which only partly fit a single executive.
- The episodic buffer is still loosely specified.
- Rival models challenge the idea of separate stores. Cowan's embedded processes model sees working memory as the activated part of long-term memory with a focus of attention of about four items. Randall Engle's approach emphasises domain-general attentional control as the basis of individual differences in working memory capacity.
- The model says little about how information is coded in long-term memory or how meaning is used.

## Conclusion
Baddeley and Hitch transformed short-term memory from a passive store into an active workspace with separate verbal, visuospatial and executive components. The model is well supported, useful in education and clinical work, and still evolving, with debate centred on the nature of the executive and the buffer.`,
    keyPoints: ["Dual-task logic behind the model", "Phonological loop structure", "Phonological similarity, word length, articulatory suppression evidence", "Sketchpad with Brooks or Logie evidence", "Central executive and dysexecutive syndrome", "Episodic buffer and why it was added", "Neural correlates and applications in education and clinical settings", "Critique including vague executive and rival models"],
    pitfalls: ["Listing components without evidence", "Forgetting the episodic buffer", "Calling the central executive a store"],
    module: "learning-memory/3-2",
    visuals: [
      { kind: "flow", caption: "The episodic buffer", data: { title: "Working memory components", layout: "tree", nodes: [{ id: "ce", label: "Central executive", detail: "Attention control, no storage of its own." }, { id: "pl", label: "Phonological loop", parent: "ce", detail: "Inner voice and inner ear for speech sounds." }, { id: "vs", label: "Visuospatial sketchpad", parent: "ce", detail: "Inner eye for shapes, colours and locations." }, { id: "eb", label: "Episodic buffer", parent: "ce", detail: "Binds information into episodes, links to long-term memory." }] } },
      { kind: "compare", caption: "The phonological loop", data: { title: "Word length effect", a: { label: "Short words", points: ["wit, sum, harm, bond", "Can be rehearsed quickly", "About 5 to 6 recalled"], summary: "Larger span." }, b: { label: "Long words", points: ["university, opportunity, aluminium", "Take longer to rehearse", "About 3 to 4 recalled"], summary: "Smaller span, unless articulation is suppressed for both." } } },
      { kind: "brainmap", caption: "Neural basis", data: { title: "Where working memory lives", focus: ["prefrontal", "broca", "parietal"], notes: { prefrontal: "Central executive: dorsolateral prefrontal cortex.", broca: "Articulatory rehearsal.", parietal: "Phonological store (left) and spatial storage (right)." } } },
    ],
    ref: "Baddeley and Hitch 1974; Baddeley 2000 episodic buffer; Baddeley, Thomson and Buchanan 1975 word length; Brooks 1968; Gathercole and Alloway 2008; Miyake et al 2000; Cowan 1999",
  },
  {
    id: "cog-l01-005",
    subject: S,
    topic: "levels-of-processing",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Explain the levels of processing framework of memory. Discuss the supporting evidence and its main criticisms.",
    plan: ["State the framework and its contrast with stores", "Shallow versus deep processing", "Craik and Tulving's evidence", "Elaboration, distinctiveness and the self-reference effect", "Criticisms: circularity, transfer-appropriate processing", "Conclusion"],
    answer: `## The framework
Fergus Craik and Robert Lockhart in 1972 proposed that memory depends not on which store information is in, but on how deeply it is processed at encoding. Processing runs from shallow (physical or structural features, such as how a word looks) through intermediate (phonemic, how it sounds) to deep (semantic, what it means). Deeper processing produces a more elaborate, longer-lasting memory trace. Memory is therefore a by-product of the processing performed on information, not the result of deliberate transfer between stores.

## Two kinds of rehearsal
- Maintenance rehearsal: repeating information at the same level, which keeps it available but does little for long-term memory.
- Elaborative rehearsal: relating the information to meaning and existing knowledge, which improves long-term retention.

## Evidence
- Fergus Craik and Endel Tulving in 1975 asked participants questions about words, followed by a surprise recognition test.
| Question type | Example | Level | Recognition (approximate) |
| Structural | Is the word in capital letters? | Shallow | Lowest, about 15 to 20 percent |
| Phonemic | Does the word rhyme with "weight"? | Intermediate | About 50 percent |
| Semantic | Does the word fit "He met a ___ in the street"? | Deep | About 80 percent |
- Thomas Hyde and James Jenkins found that incidental learning with semantic tasks (rating pleasantness) produced recall as good as intentional learning, while shallow tasks (checking for the letter e) produced poor recall. The intention to learn mattered less than the type of processing.
- Self-reference effect: Timothy Rogers found that asking "Does this word describe you?" produced even better recall than semantic questions, because the self is a rich organising structure.
- Elaboration and distinctiveness: within the deep level, richer and more distinctive encoding helps further; complex sentence frames produce better recall than simple ones.

## Criticisms
- Circularity: depth is defined by better memory, and better memory is explained by depth. There is no independent measure of depth.
- Transfer-appropriate processing: Donald Morris, John Bransford and Jeffery Franks showed that when the test was a rhyming recognition test, words processed phonemically were remembered better than those processed semantically. Memory depends on the match between encoding and retrieval, not on depth alone.
- Effort and time are confounded with depth: deeper tasks often take longer.
- It describes rather than explains why deep processing helps.
- It neglects the structural evidence for separate stores, such as amnesic patients.
- Implicit memory tasks often show little effect of depth.

## Applications
Study methods that require meaning-based processing, such as explaining material in one's own words, generating examples, self-testing and relating content to personal experience, use the framework's insight.

## Conclusion
The levels of processing framework shifted attention from memory structures to encoding processes and showed that meaning-based processing produces durable memories. Its limits, especially circularity and the importance of the match between encoding and retrieval, led to the concept of transfer-appropriate processing.`,
    keyPoints: ["Statement of the framework", "Three levels with examples", "Maintenance versus elaborative rehearsal", "Craik and Tulving findings", "Hyde and Jenkins incidental learning", "Self-reference effect", "Circularity criticism", "Transfer-appropriate processing"],
    module: "learning-memory/3-2",
    visuals: [
      { kind: "experiment", caption: "Evidence", data: { title: "Craik and Tulving", question: "What share of words were later recognised after each type of question?", unit: "%", conditions: [{ label: "Structural: capitals?", value: 18 }, { label: "Phonemic: rhymes with?", value: 50 }, { label: "Semantic: fits the sentence?", value: 80 }], why: "Deeper, meaning-based processing produced better memory. Values are approximate." } },
    ],
    ref: "Craik and Lockhart 1972; Craik and Tulving 1975; Hyde and Jenkins 1973; Rogers, Kuiper and Kirker 1977; Morris, Bransford and Franks 1977",
  },
  {
    id: "cog-l01-006",
    subject: S,
    topic: "short-term-memory",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "What is the serial position effect? Explain the primacy and recency effects and the experimental evidence that they arise from different memory processes.",
    plan: ["Describe the free recall task and the curve", "Explain primacy", "Explain recency", "Evidence for separate mechanisms: delay, rate, amnesia", "Alternative accounts and applications"],
    answer: `## The effect
In a free recall task, participants hear or see a list of about 15 to 20 words, one at a time, and then recall as many as they can in any order. When recall is plotted against the position of each word in the list, a U-shaped serial position curve appears: the first few items and the last few items are recalled better than items in the middle. Hermann Ebbinghaus first noted the effect, and Bennet Murdock described it systematically.

## Primacy effect
The early items are recalled well because they receive more rehearsal. When the first word is presented, it is rehearsed alone; the second is rehearsed with the first, and so on. As the list grows, each new word shares rehearsal time with more items. Dewey Rundus asked participants to rehearse aloud and found that the number of rehearsals for each word closely predicted its recall for the early positions. The extra rehearsal transfers early items to long-term memory.

## Recency effect
The last few items are recalled well because they are still in short-term memory at the moment of recall. Participants often recall them first, "dumping" them before they fade.

## Evidence for separate mechanisms
- Delay: Murray Glanzer and Anita Cunitz had participants count backwards for 30 seconds before recall. This removed the recency effect but left the primacy effect intact, as expected if recency depends on the short-term store.
- Presentation rate: slower presentation (more time to rehearse) improved recall of early and middle items but did not affect recency.
- Other variables that affect long-term memory, such as word frequency, list length and age, affect primacy and the middle of the list but not recency.
- Amnesia: patients with Korsakoff's syndrome or medial temporal lobe damage show reduced primacy but normal recency, consistent with impaired transfer to long-term memory and preserved short-term memory. Patients like K.F. with short-term deficits show the reverse.
- Drugs: benzodiazepines, which impair long-term encoding, reduce primacy more than recency.
This double dissociation supported the multi-store model.

## Alternative accounts
Recency is also found over long time scales, such as remembering the last few rugby matches of a season, or long-term recency when distraction is placed between every item (continuous distractor paradigm). This suggests recency may partly reflect the distinctiveness of recent items at retrieval (a ratio of time between items to time since presentation), not only short-term storage.

## Applications
- In interviews and presentations, the first and last points are remembered best, so key messages should be placed at the start and end.
- In juries and advertising, early information can bias judgements (primacy in impression formation) and the most recent information can dominate when decisions are immediate.
- Students can improve recall of middle material by taking breaks that create more "beginnings and ends".

## Conclusion
The serial position curve shows two separable effects: primacy from rehearsal and long-term storage, and recency from items still active in short-term memory. Experimental dissociations made it a key source of evidence for distinguishing memory systems, though recency also has a long-term component.`,
    keyPoints: ["Free recall task and U-shaped curve", "Primacy explained by rehearsal with Rundus", "Recency explained by short-term memory", "Glanzer and Cunitz delay finding", "Presentation rate dissociation", "Amnesia evidence", "Long-term recency as an alternative account", "Applications"],
    module: "learning-memory/3-1",
    visuals: [
      { kind: "experiment", caption: "Evidence for separate mechanisms", data: { title: "The serial position curve", question: "Roughly what share of words are recalled at each part of a 20-word list?", unit: "%", conditions: [{ label: "First words", value: 65 }, { label: "Middle words", value: 25 }, { label: "Last words, immediate recall", value: 75 }, { label: "Last words, after 30 s counting", value: 25 }], why: "Counting backwards empties short-term memory, removing recency but not primacy. Values are approximate." } },
    ],
    ref: "Murdock 1962; Rundus 1971; Glanzer and Cunitz 1966; Baddeley and Hitch 1977 on long-term recency; Atkinson and Hilgard ch 8",
  },
  {
    id: "cog-l01-007",
    subject: S,
    topic: "encoding-retrieval",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Write a short note on the encoding specificity principle and context-dependent memory.",
    plan: ["State Tulving's principle", "Godden and Baddeley divers study", "State-dependent and mood-congruent memory", "Applications"],
    answer: `## Encoding specificity
Endel Tulving and Donald Thomson's encoding specificity principle states that memory is best when the cues present at retrieval match those present at encoding. What is stored is not just the item but the item together with its context, so a cue helps only if it was part of the original encoding. In one study, participants learned "train" paired with "black"; later, "black" was a better cue for recalling "train" than a strong associate such as "engine" that had not been present at encoding.

## Context-dependent memory
- Duncan Godden and Alan Baddeley had scuba divers learn word lists either on the shore or 20 feet under water, then recall them in the same or the other environment. Recall was about 40 percent higher when the learning and recall environments matched. A later study found no context effect for recognition, which provides its own strong cue.
- Steven Smith found students recalled more when tested in the same room in which they learned, and that simply imagining the learning room helped.

## State-dependent memory
Internal physiological states act as cues. Information learned after drinking alcohol or caffeine may be recalled better in the same state. Mood-dependent memory and mood-congruent memory (depressed people more readily retrieve negative memories, which can maintain low mood, as Gordon Bower showed) are related effects.

## Applications
- Cognitive interviews for eyewitnesses ask witnesses to mentally reinstate the context of the event.
- Students can study in varied settings, or recall the study setting during exams.
- Therapists note that depressed clients' negative recall bias is partly a mood-congruence effect.`,
    keyPoints: ["Statement of encoding specificity", "Tulving and Thomson example", "Godden and Baddeley findings", "State and mood-dependent memory", "Applications such as cognitive interview"],
    module: "learning-memory/3-3",
    visuals: [
      { kind: "experiment", caption: "Context-dependent memory", data: { title: "Godden and Baddeley's divers", question: "How many of 36 words did divers recall in each condition?", unit: " words", max: 15, conditions: [{ label: "Learn on land, recall on land", value: 13.5 }, { label: "Learn on land, recall under water", value: 8.6 }, { label: "Learn under water, recall under water", value: 11.4 }, { label: "Learn under water, recall on land", value: 8.4 }], why: "Recall was best when the environment at recall matched the environment at learning. Values approximate." } },
    ],
    ref: "Tulving and Thomson 1973; Godden and Baddeley 1975 British Journal of Psychology (values approx from original Table 1); Smith 1979; Bower 1981",
  },
  {
    id: "cog-l01-008",
    subject: S,
    topic: "long-term-memory",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Discuss the different types of long-term memory. What evidence supports the distinction between multiple memory systems?",
    plan: ["Squire's taxonomy: declarative and non-declarative", "Episodic and semantic memory (Tulving)", "Procedural memory, priming, conditioning", "Neural bases", "Evidence from amnesia, imaging and development", "Debates and conclusion"],
    answer: `## Overview
Long-term memory is not a single store. Larry Squire's taxonomy, widely used today, divides it into declarative (explicit) memory, which can be consciously recalled and described, and non-declarative (implicit) memory, which is expressed through performance without conscious recollection.

## Declarative memory
Endel Tulving in 1972 divided declarative memory into two types.
- Episodic memory: memory for personally experienced events located in time and place, such as one's first day at college or what one ate at last night's dinner. It involves mental time travel and a sense of re-experiencing, which Tulving called autonoetic consciousness.
- Semantic memory: general knowledge of facts, concepts, words and meanings, independent of when and where they were learned, such as knowing that Delhi is the capital of India or that a sparrow is a bird.
The two interact: episodic memories become semantic over time as details fade (semanticisation), and semantic knowledge shapes how episodes are encoded.

## Non-declarative memory
- Procedural memory: skills and habits, such as riding a bicycle, typing or tying shoelaces, learned gradually and hard to describe in words.
- Priming: improved processing of a stimulus because of earlier exposure, without awareness, such as completing "tab__" as "table" after seeing the word earlier.
- Classical conditioning: learned associations such as fear of a dentist's drill.
- Non-associative learning: habituation and sensitisation.

## Neural bases
| Memory type | Key brain structures |
| Episodic and semantic (declarative) | Hippocampus and medial temporal lobe for formation; neocortex for storage; prefrontal cortex for strategic encoding and retrieval |
| Semantic in particular | Anterior temporal lobes |
| Procedural | Basal ganglia (striatum), cerebellum, motor cortex |
| Priming | Neocortex, especially sensory association areas |
| Emotional conditioning | Amygdala |
| Motor conditioning | Cerebellum |

## Evidence for multiple systems
- Amnesia: H.M., after bilateral medial temporal lobe removal in 1953, could not form new declarative memories, yet he learned the mirror-drawing task over three days, improving each day while denying he had done it before. His priming was also intact. This dissociation between declarative and procedural memory is the strongest evidence for separate systems.
- Patients with Parkinson's or Huntington's disease, who have basal ganglia damage, show the reverse: impaired skill and habit learning with relatively preserved declarative memory. Barbara Knowlton's weather prediction task showed this double dissociation with amnesic patients.
- Semantic dementia: progressive loss of semantic knowledge (word meanings, object knowledge) with relatively preserved episodic memory for recent events, linked to anterior temporal atrophy. In contrast, early Alzheimer's disease impairs episodic memory first.
- Developmental amnesia: Faraneh Vargha-Khadem described children with early hippocampal damage who had severely impaired episodic memory but attended mainstream school and acquired near-normal semantic knowledge and language, suggesting semantic memory can form with limited hippocampal function.
- Neuroimaging: episodic retrieval activates the hippocampus and prefrontal regions, whereas skill learning activates the striatum and cerebellum.
- Ageing: episodic memory declines more with age than semantic memory or priming.
- Emotional memory: patients with amygdala damage can explicitly remember a conditioning procedure without showing a conditioned skin conductance response, while hippocampal patients show the response without remembering the procedure.

## Debates
- Some argue that episodic and semantic memory lie on a continuum rather than being separate systems.
- Processing accounts, such as transfer-appropriate processing, argue that dissociations between explicit and implicit tasks reflect differences in task demands rather than distinct systems.
- The hippocampus may support some forms of implicit relational learning and short-term binding, blurring the explicit and implicit distinction.

## Conclusion
Long-term memory comprises several systems that differ in what they store, whether they are conscious and which brain structures support them. Dissociations in patients such as H.M., in Parkinson's disease and in semantic dementia provide the strongest evidence. The taxonomy is useful clinically: assessing which systems are spared helps rehabilitation, for example teaching amnesic patients new routines through procedural learning and errorless learning.`,
    keyPoints: ["Declarative versus non-declarative", "Episodic versus semantic with Tulving", "Procedural memory and priming", "Neural bases table", "H.M. mirror drawing evidence", "Basal ganglia double dissociation", "Semantic dementia and developmental amnesia", "Debates and clinical application"],
    module: "learning-memory/3-3",
    visuals: [
      { kind: "flow", caption: "Neural bases", data: { title: "Squire's taxonomy of long-term memory", layout: "tree", nodes: [{ id: "l", label: "Long-term memory" }, { id: "d", label: "Declarative (explicit)", parent: "l" }, { id: "n", label: "Non-declarative (implicit)", parent: "l" }, { id: "e", label: "Episodic: events", parent: "d", detail: "Hippocampus and prefrontal cortex." }, { id: "s", label: "Semantic: facts", parent: "d", detail: "Anterior temporal lobes and neocortex." }, { id: "p", label: "Procedural: skills", parent: "n", detail: "Basal ganglia and cerebellum." }, { id: "pr", label: "Priming", parent: "n", detail: "Neocortex." }, { id: "c", label: "Conditioning", parent: "n", detail: "Amygdala and cerebellum." }] } },
      { kind: "brainmap", caption: "Evidence for multiple systems", data: { title: "Different systems, different structures", focus: ["hippocampus", "basal-ganglia", "cerebellum", "amygdala"], notes: { hippocampus: "Forming new declarative memories.", "basal-ganglia": "Habits and skills.", cerebellum: "Motor skills and eyeblink conditioning.", amygdala: "Emotional conditioning." } } },
    ],
    ref: "Squire 2004; Tulving 1972 and 1985; Milner 1962 on H.M.; Knowlton, Mangels and Squire 1996; Vargha-Khadem et al 1997; Bear, Connors and Paradiso ch 24",
  },
  {
    id: "cog-l01-009",
    subject: S,
    topic: "implicit-memory",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "What is implicit memory? Describe the methods used to study priming and the evidence that implicit and explicit memory are dissociable.",
    plan: ["Define implicit memory and contrast with explicit", "Types of priming and tasks", "Evidence from amnesia", "Evidence from normal participants", "Theories and applications"],
    answer: `## Meaning
Implicit memory is memory shown by a change in performance due to prior experience, without conscious recollection of that experience. Explicit memory requires intentional, conscious recollection, as in recall and recognition. Daniel Schacter defined the distinction in 1987. A person who has forgotten reading a word may still read it faster or complete it more readily; that facilitation is implicit memory.

## Priming and its measurement
Priming is the most studied form of implicit memory: prior exposure to a stimulus makes later processing of the same or a related stimulus faster or more likely.
- Repetition (perceptual) priming: word stem completion ("com___" completed as "complete" after earlier seeing it), word fragment completion ("_o_k_y" as "donkey"), perceptual identification of briefly flashed words, picture naming.
- Conceptual priming: depends on meaning, as in generating category examples ("name a fruit") after earlier seeing "mango".
- Semantic priming: faster lexical decisions for "nurse" after "doctor", lasting only a second or two.
In implicit tests, instructions do not refer to the earlier study phase; participants simply complete a task.

## Evidence from amnesia
- Elizabeth Warrington and Lawrence Weiskrantz found that amnesic patients who could not recall or recognise studied words performed normally when given word fragments or stems, showing intact priming.
- Peter Graf, Larry Squire and George Mandler showed that the instructions mattered: when amnesic patients were told to use the stems to recall studied words (explicit), they did poorly; when told to complete stems with the first word that came to mind (implicit), they performed like controls.
- Claparede's early observation: a patient with Korsakoff's syndrome, pricked by a pin hidden in his hand, later refused to shake hands but could not say why.

## Evidence from normal participants
- Levels of processing strongly affects explicit memory but has little effect on perceptual priming.
- Changing the modality (hearing at study, seeing at test) reduces priming but has less effect on recall.
- Priming can last for days or even years, while recognition declines.
- Ageing impairs explicit memory more than priming.
- Divided attention at study harms explicit memory more than perceptual priming.
- Neuroimaging shows reduced activity in sensory cortex for primed items (repetition suppression), whereas explicit memory engages the hippocampus and prefrontal cortex.

## Theories
- Multiple systems view: separate brain systems, such as a perceptual representation system in the neocortex.
- Processing view (Henry Roediger): implicit tests rely on data-driven (perceptual) processing and explicit tests on conceptually driven processing, so dissociations reflect transfer-appropriate processing rather than separate systems.

## Applications
- Advertising and the mere exposure effect: familiarity created by repeated exposure increases liking without awareness.
- Implicit attitudes measured by reaction time tasks.
- Rehabilitation: amnesic patients can learn routines and computer skills using errorless learning, which exploits intact implicit memory.

## Conclusion
Implicit memory shows that the past influences behaviour without awareness. Dissociations in amnesia and in normal participants suggest it depends on processes or systems distinct from conscious recollection.`,
    keyPoints: ["Definition and contrast with explicit memory", "Types of priming and tasks", "Warrington and Weiskrantz findings", "Graf, Squire and Mandler instruction effect", "Dissociations in normal participants", "Systems versus processing accounts", "Applications"],
    module: "learning-memory/3-3",
    visuals: [
      { kind: "compare", caption: "Evidence from amnesia", data: { title: "Explicit versus implicit memory in amnesia", a: { label: "Explicit test", points: ["Recall the words you studied", "Amnesic patients perform very poorly", "Depends on the hippocampus"], summary: "Impaired." }, b: { label: "Implicit test", points: ["Complete 'com___' with the first word", "Amnesic patients show normal priming", "Depends on neocortex"], summary: "Spared." } } },
    ],
    ref: "Schacter 1987; Warrington and Weiskrantz 1970; Graf, Squire and Mandler 1984; Roediger 1990; Atkinson and Hilgard ch 8",
  },
  {
    id: "cog-l01-010",
    subject: S,
    topic: "prospective-memory",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on prospective memory.",
    plan: ["Define prospective versus retrospective memory", "Event-based and time-based", "Processes and theory", "Clinical and everyday relevance"],
    answer: `## Meaning
Prospective memory is remembering to carry out an intended action in the future, such as taking medicine after dinner, posting a letter on the way to college or calling a friend at 6 pm. It contrasts with retrospective memory, which is remembering past information. Prospective memory failures are among the most common everyday memory complaints.

## Types
- Event-based: the action is triggered by an external cue, such as passing a medical store reminding one to buy medicine. Usually easier.
- Time-based: the action must be done at a certain time or after a certain interval, with no external cue, such as taking a cake out of the oven after 40 minutes. Harder, because it relies on self-initiated monitoring of time.
- Activity-based: done after finishing an activity, such as after brushing teeth.

## Processes
Successful prospective memory needs forming the intention, retaining it, noticing the cue at the right moment, recalling what to do, and carrying it out. Mark McDaniel and Gilles Einstein's multiprocess framework proposes two routes: strategic monitoring (actively watching for the cue, which uses working memory) and spontaneous retrieval (the cue automatically brings the intention to mind, especially when the cue is distinctive and strongly linked to the action).

## Relevance
- Prospective memory is impaired by frontal lobe damage, ageing (especially time-based tasks in the laboratory, though older adults often do well in daily life using reminders), ADHD, schizophrenia and depression.
- Medication adherence depends heavily on it.
- Implementation intentions ("When I finish dinner, I will take my tablet") and external aids such as phone alarms and pill boxes improve performance.`,
    keyPoints: ["Definition contrasted with retrospective memory", "Event versus time-based", "Multiprocess framework", "Clinical groups affected", "Implementation intentions and aids"],
    module: "learning-memory/3-4",
    visuals: [
      { kind: "sort", caption: "Types", data: { prompt: "Event-based or time-based?", buckets: ["Event-based", "Time-based"], items: [{ text: "Give a message to Priya when you see her", bucket: 0 }, { text: "Join the online class at 4 pm", bucket: 1 }, { text: "Switch off the gas after 15 minutes", bucket: 1 }, { text: "Buy milk when you pass the dairy", bucket: 0 }] } },
    ],
    ref: "Einstein and McDaniel 1990 and 2005 multiprocess; Gollwitzer 1999",
  },
];
