/* Module · Learning and memory, Part III (Beginner level: memory). Original text written for VIBHA School of Psychology. */
export const part3 = String.raw`
# Part III · Beginner: how memory works

## 3.1 The multi-store model and its evidence [core][beginner]
Richard Atkinson and Richard Shiffrin (1968) described memory as a flow through three stores, steered by **control processes** such as attention, rehearsal and coding. Each store has its own **duration**, **capacity** and **coding**.

:::widget flow
{
 "title": "The multi-store model",
 "layout": "chain",
 "nodes": [
  {
   "id": "in",
   "label": "Environmental input",
   "detail": "Sights, sounds, touches arriving at the senses."
  },
  {
   "id": "sm",
   "label": "Sensory memory",
   "detail": "Large capacity; iconic memory lasts under a second, echoic memory a few seconds. Unattended information fades."
  },
  {
   "id": "stm",
   "label": "Short-term memory",
   "detail": "About seven items, or about four chunks; 15 to 30 seconds without rehearsal; mostly acoustic coding."
  },
  {
   "id": "ltm",
   "label": "Long-term memory",
   "detail": "Effectively unlimited; minutes to a lifetime; mostly semantic coding. Information is retrieved back into short-term memory when used."
  }
 ],
 "edgeLabels": {
  "sm>stm": "attention",
  "stm>ltm": "rehearsal"
 },
 "caption": "Tap each store for its duration, capacity and coding. The evidence and the critiques follow."
}
:::

### Sensory memory
George Sperling (1960) flashed a grid of 12 letters (three rows of four) for 50 milliseconds.
- In **whole report** ("say all you saw"), people reported only about 4 or 5 letters, yet insisted they had seen more that faded as they spoke.
- In **partial report**, a tone after the flash (high, middle or low) told them which row to report. They could report about 3 of the 4 letters in **any** row, so about 9 of the 12 letters must have been available for a moment.

:::widget guess
{
  "prompt": "In Sperling's partial-report task, how long could the tone be delayed before the advantage of partial report disappeared and performance fell to whole-report levels?",
  "min": 0,
  "max": 3000,
  "step": 100,
  "unit": "ms",
  "answer": [500, 1100],
  "reveal": "About one second. The visual sensory store, the **icon**, holds a large amount but fades within roughly a quarter to half a second, and is effectively gone by about one second. Auditory sensory memory, the **echo**, lasts longer, about 2 to 4 seconds, which is why you can 'replay' what someone just said when you were not listening."
}
:::

### Short-term memory
- **Capacity**: George Miller's "magical number **seven, plus or minus two**" (1956) items. More recent estimates put the true limit at about **four chunks** when rehearsal and chunking are prevented (Nelson Cowan, 2001).
- **Chunking**: grouping items into meaningful units. 9-8-2-5-0-1-4-3-7-6 is hard; 98250 14376 is easier; a mobile number in the familiar 5-5 pattern is easier still. With practice, one student (S. F.) raised his digit span from 7 to about 80 by coding digits as running times (Chase and Ericsson).
- **Duration**: Lloyd and Margaret Peterson (1959) showed people a consonant trigram (such as KBF), then had them count backwards in threes from a number to stop rehearsal.

:::widget guess
{
  "prompt": "In the Petersons' study, after 18 seconds of counting backwards, what percentage of the trigrams could people still recall?",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%",
  "answer": [5, 15],
  "reveal": "About 10 percent, compared with about 80 percent after 3 seconds. The Petersons took this as decay. Later work showed that on the very first trial almost nothing was forgotten (Keppel and Underwood, 1962): earlier trigrams were interfering with later ones. Much short-term 'forgetting' is proactive interference, not just decay."
}
:::

- **Coding**: R. Conrad (1964) found that errors in recalling briefly seen letters were **acoustic** (B for V, not F for E). Alan Baddeley (1966) found acoustically similar words (cat, mat, cap) hard to hold in short-term memory, but semantically similar words (big, large, huge) hard to learn in long-term memory. Short-term memory leans on sound; long-term memory on meaning.

### The serial position curve
Read a list of 20 words once and recall them in any order. Recall is best for the first few words (**primacy effect**) and the last few (**recency effect**), and worst in the middle.
- **Primacy** reflects long-term memory: the first items got the most rehearsal. Slower presentation strengthens it.
- **Recency** reflects short-term memory: the last items are still "in mind". Glanzer and Cunitz (1966) found that 30 seconds of counting before recall **wiped out recency** but left primacy intact.

:::widget sort
{
  "prompt": "Which part of the serial position curve does each change affect?",
  "buckets": ["Mainly primacy", "Mainly recency"],
  "items": [
    { "text": "A 30-second distractor task before recall", "bucket": 1 },
    { "text": "Slower presentation, allowing more rehearsal", "bucket": 0 },
    { "text": "Testing a patient with dense amnesia (like H. M.)", "bucket": 0, "why": "Amnesic patients show near-normal recency (intact short-term memory) but poor primacy (impaired long-term transfer)." },
    { "text": "Asking people to recall the last items first", "bucket": 1 }
  ]
}
:::

### Evidence for separate stores from patients
- **H. M.** (Henry Molaison), after removal of much of both medial temporal lobes in 1953, had a normal digit span but could not form new long-term memories.
- **K. F.** (Shallice and Warrington, 1970), after a left parietal injury, had a digit span of only one or two items for spoken material, yet learned new long-term information normally.
This **double dissociation** strongly suggests separate short-term and long-term systems.

:::widget compare
{"title": "A double dissociation: two patients, opposite patterns", "a": {"label": "H. M.", "points": ["Both medial temporal lobes removed", "Normal digit span: short-term memory works", "Cannot lay down new long-term memories", "Meets the same tester as a stranger each time"], "summary": "Short-term memory intact, long-term learning lost."}, "b": {"label": "K. F.", "points": ["Left parietal brain injury", "Digit span of only one or two spoken items", "Learns new long-term information normally", "Weakness mostly for spoken, not visual, material"], "summary": "Short-term memory damaged, long-term learning intact."}, "caption": "When damage to one place spares A but harms B, and damage elsewhere does the opposite, A and B are likely separate systems."}
:::

### Critiques of the multi-store model
- It is **too simple**: short-term memory is not one store (K. F.'s deficit was for spoken, not visual, material), and long-term memory has several kinds.
- **Rehearsal is not the key to long-term memory**: we remember many things we never rehearsed, and rote repetition (maintenance rehearsal) transfers little.
- K. F.'s good long-term learning despite a poor short-term store sits awkwardly with a model in which information must pass through short-term memory to reach long-term memory.

:::recall
1. What did Sperling's partial report show? || Sensory memory holds far more than can be reported, but fades within about a second.
2. Give Miller's and Cowan's estimates of short-term capacity. || Seven, plus or minus two items; about four chunks.
3. What did the Petersons find, and what is the alternative explanation? || Rapid forgetting over 18 seconds; proactive interference rather than decay.
4. Explain primacy and recency. || Primacy: early items rehearsed into long-term memory. Recency: last items still in short-term memory.
5. What double dissociation supports separate stores? || H. M. (normal short-term, impaired new long-term) and K. F. (impaired short-term, normal long-term).
:::

:::mcq
Q: Participants recall a word list after 30 seconds of counting backwards. Compared with immediate recall, the most likely change is:
- Loss of the primacy effect, with recency intact
- Loss of both the primacy and recency effects
- *Loss of the recency effect, with primacy intact
- Better recall of the items in the middle of the list
> The distractor empties short-term memory, abolishing recency.

Q: Errors in short-term recall of letters such as "B" for "V" suggest that short-term memory codes mainly:
- Semantically
- Visually
- Procedurally
- *Acoustically
> Sound-based confusions point to acoustic coding (Conrad, 1964).
:::

## 3.2 Levels of processing and working memory [core][beginner]
### Levels of processing (Craik and Lockhart, 1972)
Instead of stores, Fergus Craik and Robert Lockhart proposed that memory depends on **how deeply** information is processed:
- **Shallow (structural)**: what the word looks like ("Is it in capital letters?").
- **Intermediate (phonemic)**: what it sounds like ("Does it rhyme with *weight*?").
- **Deep (semantic)**: what it means ("Does it fit the sentence 'He met a ___ in the street'?").

:::widget layers
{
 "title": "Levels of processing",
 "shape": "stack",
 "layers": [
  {
   "label": "Semantic (deep)",
   "detail": "What does it mean? Does it fit the sentence? Best remembered, especially when elaborated or linked to yourself."
  },
  {
   "label": "Phonemic (intermediate)",
   "detail": "What does it sound like? Does it rhyme with 'weight'? Remembered moderately."
  },
  {
   "label": "Structural (shallow)",
   "detail": "What does it look like? Is it in capital letters? Remembered least."
  }
 ],
 "caption": "Deeper processing at encoding gives a more durable trace, unless the test itself asks about sound or appearance."
}
:::

Craik and Tulving (1975) asked such questions about words, then gave a surprise recognition test.

:::widget reveal
{
  "prompt": "Predict the order of recognition for words processed structurally, phonemically and semantically. Then predict: was recognition better for 'yes' or 'no' answers to the semantic questions?",
  "answer": "Semantic best, phonemic next, structural worst: words judged for meaning were recognised several times more often than words judged for typeface. And 'yes' words did better than 'no' words, especially in the sentence task: a word that fits a sentence builds a richer, more elaborate trace. This pointed to elaboration and distinctiveness, not just depth."
}
:::

**Maintenance rehearsal** (repeating something as it is) keeps it active but adds little to long-term memory; **elaborative rehearsal** (linking it to meaning, images and what you know) builds durable memories.

**Critiques**: "depth" is defined by how well things are remembered, which is circular; and the best processing depends on the test. Morris, Bransford and Franks (1977) found that rhyme processing beat semantic processing when the test was a **rhyme test**: **transfer-appropriate processing**. Memory is best when the processing at learning matches the processing at test.

### Working memory (Baddeley and Hitch, 1974)
Alan Baddeley and Graham Hitch replaced the single short-term store with a **working memory**: a set of components that hold and manipulate information while we think, read or calculate.
| Component | Job | Evidence |
|---|---|---|
| **Central executive** | Directs attention, switches tasks, coordinates the other parts; has no storage of its own | Dual tasks that both need control interfere; damaged in dysexecutive syndrome |
| **Phonological loop** | Holds speech-based information: a **phonological store** (inner ear) and an **articulatory rehearsal process** (inner voice) | **Word length effect**: short words are recalled better than long ones; **phonological similarity effect**; **articulatory suppression** (saying "the, the, the") abolishes both for visually presented words |
| **Visuospatial sketchpad** | Holds visual and spatial information: a **visual cache** and an **inner scribe** (Logie) | Spatial tasks interfere with each other, but not with verbal tasks |
| **Episodic buffer** (added 2000) | A limited store that binds information from the other parts and from long-term memory into integrated episodes | Explains recall of prose far beyond the loop's capacity, and links to conscious awareness |

:::widget flow
{
 "title": "Baddeley's working memory",
 "layout": "tree",
 "nodes": [
  {
   "id": "ce",
   "label": "Central executive",
   "detail": "Directs attention, switches tasks and coordinates the other parts. It stores nothing itself."
  },
  {
   "id": "pl",
   "label": "Phonological loop",
   "parent": "ce",
   "detail": "A sound store (inner ear) plus an articulatory rehearsal process (inner voice), holding about two seconds of speech."
  },
  {
   "id": "vs",
   "label": "Visuospatial sketchpad",
   "parent": "ce",
   "detail": "A visual cache for what things look like and an inner scribe for where they are and how they move."
  },
  {
   "id": "eb",
   "label": "Episodic buffer",
   "parent": "ce",
   "detail": "Added in 2000. Binds information from the other parts and from long-term memory into single episodes."
  }
 ],
 "caption": "Tap each part, then try the guess below."
}
:::

:::widget guess
{
  "prompt": "Baddeley and colleagues (1975) found that people can hold about as many words as they can say aloud in a certain amount of time. Roughly how many seconds of speech does the phonological loop hold?",
  "min": 0.5,
  "max": 10,
  "step": 0.5,
  "unit": "seconds",
  "answer": [1.5, 2.5],
  "reveal": "About 2 seconds. That is why span is larger for short words (Wit, sum, harm) than long ones (university, opportunity), and why digit span is larger in languages with short digit names. Children with speech-sound difficulties often have a smaller loop span."
}
:::

:::widget decide
{
  "scene": "Ananya, a Class 7 student in Bhopal, reads well aloud but cannot follow multi-step oral instructions (“Take out your blue notebook, open to exercise 4, and copy the second table”) and loses her place in mental arithmetic. Her teacher thinks she is careless.",
  "ask": "What is the most useful working-memory reading of this?",
  "choices": [
    { "label": "She may have low verbal working memory capacity: instructions overflow her phonological loop and central executive before she can act on them", "verdict": "best", "outcome": "An assessment confirms a weak verbal span. Teachers give one step at a time, write instructions on the board, and use visual checklists. Her 'carelessness' drops.", "why": "Difficulty holding and using information over seconds, with normal reading, is a typical working-memory profile. Reducing the load is the evidence-based support; 'brain training' games do not reliably transfer to school tasks." },
    { "label": "She is lazy and needs to be punished for not listening", "verdict": "harm", "outcome": "She becomes anxious in class, which further reduces her working memory.", "why": "Anxiety uses up working-memory resources. Punishing a capacity problem makes it worse." },
    { "label": "Enrol her in a commercial computerised 'working memory training' programme", "verdict": "ok", "outcome": "Her scores on the training games improve, but classroom performance does not change.", "why": "Meta-analyses show near-transfer to similar tasks but little far-transfer to reading, arithmetic or attention in class (a 2013 meta-analysis)." }
  ]
}
:::

:::recall
1. State the main idea of levels of processing. || Deeper (semantic) processing produces more durable memory than shallow (structural or phonemic) processing.
2. Distinguish maintenance and elaborative rehearsal. || Maintenance repeats information; elaborative links it to meaning and knowledge.
3. What is transfer-appropriate processing? || Memory is best when the processing at encoding matches the processing required at test.
4. Name the four components of Baddeley's working memory. || Central executive, phonological loop, visuospatial sketchpad, episodic buffer.
5. What is the word length effect? || Short words are recalled better than long words because the loop holds about two seconds of speech.
:::

:::mcq
Q: Saying "the, the, the" aloud while reading a list removes the word length effect. This is because articulatory suppression:
- *Blocks rehearsal in the phonological loop
- Damages the visuospatial sketchpad
- Overloads the capacity of the episodic buffer
- Stops all semantic processing of the words
> Suppression occupies the inner voice, preventing rehearsal.

Q: Which finding most directly challenges a strict levels-of-processing account?
- Semantic processing beats structural processing on recognition
- *Rhyme processing beats semantic processing when the test is a rhyme test
- Elaborative rehearsal helps more than maintenance rehearsal
- Deep processing takes longer
> Transfer-appropriate processing shows the match between study and test matters.
:::

## 3.3 Long-term memory: kinds, encoding and retrieval [core][beginner]
### Kinds of long-term memory
| Kind | What it holds | Example | Brain areas (broadly) |
|---|---|---|---|
| **Explicit (declarative)**: episodic | Personal events in time and place | Your first day at college in Chennai | Hippocampus, medial temporal lobe, prefrontal cortex |
| **Explicit (declarative)**: semantic | Facts and general knowledge | Delhi is India's capital; the meaning of "anhedonia" | Lateral and anterior temporal cortex |
| **Implicit (non-declarative)**: procedural | Skills and habits | Riding a scooter, typing, tying a dhoti | Basal ganglia, cerebellum, motor cortex |
| **Implicit**: priming | Easier processing of something met before | Completing "ele___" as "elephant" after seeing it | Neocortex |
| **Implicit**: classical conditioning | Learned emotional and reflex responses | Anxiety at the dentist's drill | Amygdala (emotion), cerebellum (reflexes) |
| **Implicit**: non-associative | Habituation and sensitisation | Ignoring the ceiling fan | Reflex pathways |

:::widget flow
{
 "title": "Kinds of long-term memory",
 "layout": "tree",
 "nodes": [
  {
   "id": "ltm",
   "label": "Long-term memory"
  },
  {
   "id": "ex",
   "label": "Explicit (declarative)",
   "parent": "ltm",
   "detail": "Consciously recalled. Depends on the medial temporal lobe."
  },
  {
   "id": "im",
   "label": "Implicit (non-declarative)",
   "parent": "ltm",
   "detail": "Shown in performance, without awareness of remembering."
  },
  {
   "id": "ep",
   "label": "Episodic",
   "parent": "ex",
   "detail": "Events in time and place."
  },
  {
   "id": "se",
   "label": "Semantic",
   "parent": "ex",
   "detail": "Facts and general knowledge."
  },
  {
   "id": "pr",
   "label": "Procedural",
   "parent": "im",
   "detail": "Skills and habits: basal ganglia and cerebellum."
  },
  {
   "id": "pm",
   "label": "Priming",
   "parent": "im",
   "detail": "Easier processing of something met before: neocortex."
  },
  {
   "id": "cc",
   "label": "Conditioning",
   "parent": "im",
   "detail": "Emotional responses (amygdala) and reflexes (cerebellum)."
  }
 ],
 "caption": "Squire's map of memory systems. H. M. lost the left branch for new learning but kept the right."
}
:::

Endel Tulving (1972) drew the **episodic-semantic** distinction; Larry Squire's taxonomy (declarative versus non-declarative) is the standard map. **Explicit memory** involves conscious recollection; **implicit memory** shows itself in performance without awareness of remembering.

:::widget sort
{
  "prompt": "Which kind of memory?",
  "buckets": ["Episodic", "Semantic", "Procedural", "Priming"],
  "items": [
    { "text": "Knowing that lithium is a mood stabiliser", "bucket": 1 },
    { "text": "Remembering where you sat for your Class 12 board exam", "bucket": 0 },
    { "text": "Playing a familiar raga on the harmonium without thinking", "bucket": 2 },
    { "text": "Recognising a blurred word faster because you read it this morning", "bucket": 3 },
    { "text": "Recalling what you ate at your cousin's wedding", "bucket": 0 },
    { "text": "Knowing that a sitar has sympathetic strings", "bucket": 1 },
    { "text": "Touch-typing a message on your phone", "bucket": 2 }
  ]
}
:::

:::widget brainmap
{
 "title": "Memory systems in the brain",
 "focus": [
  "hippocampus",
  "prefrontal",
  "basal-ganglia",
  "cerebellum",
  "amygdala",
  "temporal"
 ],
 "notes": {
  "hippocampus": "Forms new episodic and semantic memories and binds their parts together.",
  "prefrontal": "Working memory, strategic encoding and searching memory at retrieval.",
  "basal-ganglia": "Habits and procedural skills.",
  "cerebellum": "Timing of skilled movements and conditioned reflexes such as the eyeblink.",
  "amygdala": "Emotional learning and the boost that emotion gives to memory.",
  "temporal": "Long-term storage of facts and meanings in the lateral and front parts of the lobe."
 },
 "caption": "Tap each region to see its role."
}
:::

### Encoding that lasts
- **Elaboration**: connecting new material to existing knowledge.
- **The self-reference effect**: words judged for "does this describe me?" are remembered better still (Rogers, Kuiper and Kirker, 1977).
- **The generation effect**: information you produce yourself (completing "hot: c___") is remembered better than information you only read.
- **Imagery and dual coding** (Allan Paivio): concrete words are remembered better because they can be stored as both words and images.
- **Mnemonics**: the **method of loci** (place items along a familiar route, such as your walk from home to the bus stand), the **peg-word** system, acronyms.
- **Spacing and interleaving**, as you saw at the Starting level.

:::widget worked
{"title": "Use the method of loci for Baddeley's four components", "steps": [{"q": "Pick a route you know without thinking.", "a": "Your walk from home to the bus stand: front door, the gate, the tea stall, the bus stand."}, {"q": "Turn each item into a vivid, odd image.", "a": "Central executive: a boss in a suit giving orders. Phonological loop: a parrot repeating words. Visuospatial sketchpad: an artist drawing a map. Episodic buffer: a film reel stitching scenes together."}, {"q": "Place one image at each spot on the route.", "a": "The boss stands at your front door. The parrot sits on the gate. The artist sketches at the tea stall. The film reel spins at the bus stand."}, {"q": "To recall, walk the route in your mind.", "a": "Each place cues its image, and each image cues the term. You get them back in order, because the route has an order."}], "yourTurn": [{"q": "Why does this work better than repeating the four names?", "a": "It uses imagery and dual coding, links new items to a well-learned structure (elaboration), and provides built-in retrieval cues. Rote repetition gives none of these."}]}
:::

### Retrieval: cues are everything
- **Availability versus accessibility** (Tulving and Pearlstone, 1966): people given category cues ("animals", "fruits") recalled many more words than those given none. The memories were **available** (stored) but not **accessible** without cues.
- **Encoding specificity** (Tulving and Thomson, 1973): a cue helps retrieval to the extent that it was present at encoding.
- **Context-dependent memory**: Godden and Baddeley (1975) had divers learn words on land or 6 metres under water and recall them in the same or the other setting.
- **State-dependent memory**: material learned in a drug state (such as after alcohol) is recalled better in the same state (Goodwin and colleagues, 1969).
- **Mood-congruent memory**: in a sad mood, people recall more sad memories (Gordon Bower, 1981); this helps keep depression going.
- **Tip-of-the-tongue state**: Brown and McNeill (1966) gave definitions of rare words ("an instrument used by sailors to measure angles"); people in a TOT state often knew the first letter and number of syllables of "sextant" before the word came.

:::widget guess
{
  "prompt": "In Godden and Baddeley's diving study, recall was better when the learning and test settings matched (land-land, water-water). Roughly how much better, compared with mismatched settings?",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "% better",
  "answer": [30, 50],
  "reveal": "About 40 percent better. Interestingly, in a later study (1980) context made no difference to recognition: the context acts as a retrieval cue, which matters for recall but much less when the item itself is shown. Practical upshot: revise in conditions like the exam hall, or vary where you revise so no single context becomes necessary."
}
:::

:::recall
1. Distinguish episodic and semantic memory. || Episodic: personal events tied to time and place. Semantic: general facts and knowledge.
2. Give three kinds of implicit memory. || Procedural skills, priming, classical conditioning (also habituation and sensitisation).
3. State the encoding specificity principle. || Retrieval cues work best when they match information present at encoding.
4. What did Tulving and Pearlstone's cued-recall study show? || Many memories are available but not accessible without cues.
5. What is mood-congruent memory? || Recalling memories that match the current mood more readily.
:::

:::mcq
Q: A patient with amnesia cannot remember practising a mirror-drawing task, yet gets better at it every day. This shows intact:
- Episodic memory
- Semantic memory
- *Procedural memory
- Short-term memory only
> Skill learning without recollection is implicit procedural memory.

Q: Students who learn in a classroom recall more when tested in the same classroom. This is best explained by:
- Craik and Lockhart's levels of processing
- *Context-dependent memory
- The serial position effect in free recall
- Proactive interference from earlier lessons
> The environment acts as a retrieval cue that matches encoding.
:::

## 3.4 Why we forget [core][beginner]
Forgetting is not one process. Psychologists have proposed five main explanations.

:::widget flow
{
 "title": "Five explanations of forgetting",
 "layout": "tree",
 "nodes": [
  {
   "id": "f",
   "label": "Why do we forget?"
  },
  {
   "id": "d",
   "label": "Trace decay",
   "parent": "f",
   "detail": "Traces fade with disuse. Hard to test because time is never empty."
  },
  {
   "id": "i",
   "label": "Interference",
   "parent": "f",
   "detail": "Proactive (old disrupts new) and retroactive (new disrupts old); worst for similar material."
  },
  {
   "id": "r",
   "label": "Retrieval failure",
   "parent": "f",
   "detail": "The memory is stored but the right cue is missing."
  },
  {
   "id": "m",
   "label": "Motivated forgetting",
   "parent": "f",
   "detail": "Repression, suppression, directed forgetting."
  },
  {
   "id": "c",
   "label": "Consolidation failure",
   "parent": "f",
   "detail": "New traces disrupted before they stabilise: head injury, seizures, ECT, alcohol."
  }
 ],
 "caption": "Tap each branch, then read the evidence for each below."
}
:::

### 1. Trace decay
Memory traces fade with time if not used. It is hard to test, because time is always filled with other events. **Jenkins and Dallenbach (1924)** found that two students who slept after learning nonsense syllables remembered more than when they stayed awake for the same interval: what happens during the time matters, not just time itself. Sleep also helps **consolidation**, as we now know.

### 2. Interference
Other learning gets in the way.
- **Proactive interference**: **old** learning disrupts **new** ("pro" = forwards). After changing your phone number, you keep giving the old one.
- **Retroactive interference**: **new** learning disrupts **old** ("retro" = backwards). After learning Spanish in college, you struggle to recall the French you learned in school.
- **Underwood (1957)** showed that the more lists people had learned before, the more they forgot a new list over 24 hours: proactive interference explains much "forgetting".
- Interference is greatest when the materials are **similar**: learning two similar drug names is harder than learning two unrelated words.

:::widget sort
{
  "prompt": "Proactive or retroactive interference?",
  "buckets": ["Proactive (old disrupts new)", "Retroactive (new disrupts old)"],
  "items": [
    { "text": "You keep writing last year's date in January", "bucket": 0 },
    { "text": "After memorising ICD-11 codes, you cannot remember the ICD-10 ones you knew", "bucket": 1 },
    { "text": "A teacher who taught last year's batch calls new students by old students' names", "bucket": 0 },
    { "text": "After moving to a new flat in Noida, you forget your old flat's address", "bucket": 1 },
    { "text": "Typing the old password into a new account", "bucket": 0 }
  ]
}
:::

### 3. Retrieval failure (cue-dependent forgetting)
The memory is there, but the right cue is missing. Tulving (1974) called this **cue-dependent forgetting**. Tip-of-the-tongue states, context and state effects all point to it. Much everyday forgetting is probably of this kind.

### 4. Motivated forgetting
- **Repression** (Freud): threatening memories are pushed out of awareness. It is hard to test, and the idea that people commonly repress and later accurately "recover" memories of trauma is disputed (see the Advanced level).
- **Directed forgetting**: told to forget a list, people recall less of it, showing some voluntary control.
- **Suppression**: in the **think/no-think** task (Anderson and Green, 2001), people repeatedly told not to think of a word recalled it less later, with prefrontal activity that reduced hippocampal activity.
- **Retrieval-induced forgetting**: practising some items in a category makes related, unpractised items harder to recall (Anderson, Bjork and Bjork, 1994).

### 5. Failure of consolidation
New memories are fragile for a time. A blow to the head, an epileptic seizure, ECT or alcohol can disrupt consolidation, producing a gap for events just before (**retrograde amnesia**). Recent memories are more vulnerable than old ones: **Ribot's law** (1882).

:::widget decide
{
  "scene": "Rahul, preparing for the NIMHANS entrance, studies cognitive psychology from 8 to 10 pm, then statistics until 1 am, then sleeps four hours. He keeps confusing similar terms and forgetting the evening's psychology.",
  "ask": "Which change would help most, based on forgetting research?",
  "choices": [
    { "label": "Study even longer at night so the material is fresh for the morning", "verdict": "harm", "outcome": "He is more tired and remembers less.", "why": "Sleep loss impairs consolidation and attention. Longer, later sessions add interference and fatigue." },
    { "label": "Sleep a full night after study, space sessions across days, test himself with retrieval practice, and put clearly different subjects next to each other rather than look-alike topics back to back", "verdict": "best", "outcome": "Over a few weeks, his recall and his ability to tell similar terms apart improve.", "why": "Sleep supports consolidation; spacing and retrieval practice slow forgetting; separating similar material in time reduces interference, while mixing look-alikes in practice tests trains discrimination." },
    { "label": "Reread the notes several times each morning", "verdict": "ok", "outcome": "The notes feel familiar, but recall in mock tests barely improves.", "why": "Rereading builds familiarity, not retrievable memory. Testing yourself works better." }
  ]
}
:::

:::recall
1. What did Jenkins and Dallenbach find, and what does it suggest? || Sleeping after learning gave better recall than staying awake, so interference during the interval, not mere time, drives much forgetting.
2. Define proactive and retroactive interference. || Proactive: old learning disrupts new. Retroactive: new learning disrupts old.
3. What is cue-dependent forgetting? || Failure to retrieve because the right cue is absent, though the memory is stored.
4. Name two forms of motivated forgetting that can be studied in the lab. || Directed forgetting; think/no-think suppression (also retrieval-induced forgetting).
5. State Ribot's law. || Recent memories are more vulnerable to disruption than older ones.
:::

:::mcq
Q: After learning the new metro map, a commuter cannot recall the old bus routes she used for years. This is:
- Proactive interference
- Trace decay
- Repression
- *Retroactive interference
> New learning disrupts recall of older learning.
:::

## 3.5 Level check · Beginner [core][beginner]
Score 80 percent or more to open the Advanced level.

:::mcq
Q: Conditioning is usually strongest when the CS:
- Follows the UCS
- Starts at exactly the same moment as the UCS
- *Starts just before and overlaps the UCS
- Ends long before the UCS
> Delay (forward) conditioning works best.

Q: An extinguished fear returns when the person is in a new context. This is called:
- *Renewal
- Spontaneous recovery
- Higher-order conditioning
- Reinstatement
> Extinction is context-bound; changing context brings the fear back.

Q: Mowrer's two-factor theory explains:
- How insight learning happens in apes
- How children learn by watching models
- How latent learning happens in rats
- *Why avoidance behaviour persists
> Fear is classically conditioned; avoidance is negatively reinforced.

Q: In the learned helplessness experiments, the "yoked" dogs:
- Could end the shock by pressing a panel
- Received no shock at any point in the study
- *Got the same shocks but could not control them
- Learned to escape by watching other dogs
> Yoking equates shock while removing control.

Q: Which schedule produces a pause after each reinforcement?
- Variable ratio
- *Fixed ratio
- Variable interval
- Continuous
> FR shows a post-reinforcement pause.

Q: Partial reinforcement makes behaviour:
- *Slower to learn but more resistant to extinction
- Faster to learn and faster to extinguish
- Impossible to extinguish
- Less frequent overall
> The partial reinforcement extinction effect.

Q: Köhler's chimpanzee Sultan joined two sticks after a pause. This illustrates:
- Trial and error
- Latent learning
- A learning set
- *Insight
> A sudden, complete solution after restructuring the problem.

Q: Which is NOT one of Bandura's four processes of observational learning?
- Attention
- *Extinction
- Retention
- Motivation
> The four are attention, retention, reproduction and motivation.

Q: Token economies apply mainly:
- Classical conditioning
- Insight learning
- *Operant conditioning
- Sensory preconditioning
> Tokens are generalised secondary reinforcers.

Q: Sperling's partial report technique showed that sensory memory:
- *Holds a lot, but fades within about a second
- Lasts about 18 seconds without any rehearsal
- Holds about four items and lasts for minutes
- Codes information mainly by meaning, not form
> Partial report revealed a large, fast-fading icon.

Q: The recency effect disappears after 30 seconds of counting because:
- Long-term memory is disrupted
- Of retroactive interference in long-term memory
- The first items were rehearsed more
- *Short-term memory is displaced by the distractor
> Recency depends on items still in short-term memory.

Q: In Baddeley's model, which component binds information into integrated episodes?
- Phonological loop
- Visuospatial sketchpad
- *Episodic buffer
- Central executive
> Added in 2000 to bind information across systems and long-term memory.

Q: Riding a bicycle after years without practice relies on:
- Episodic memory
- *Procedural memory
- Semantic memory
- Sensory memory
> Skills are procedural, implicit memories.

Q: Divers recalled more when tested in the same environment where they learned. This supports:
- *Encoding specificity
- Trace decay
- Levels of processing
- Retroactive interference
> Matching context provides effective retrieval cues.

Q: Keeping to your old email password when typing into a new account is an example of:
- Retroactive interference
- Cue-dependent forgetting
- Repression
- *Proactive interference
> Old learning disrupts new.
:::
`;
