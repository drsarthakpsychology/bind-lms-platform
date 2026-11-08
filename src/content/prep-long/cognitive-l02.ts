import type { LongQA } from "@/lib/prep/long-types";

const S = "cognitive" as const;

export const COGNITIVE_L02: LongQA[] = [
  {
    id: "cog-l02-011",
    subject: S,
    topic: "forgetting",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Critically discuss the major theories of forgetting.",
    plan: ["Define forgetting and its measurement", "Trace decay theory and evidence", "Interference theory: proactive and retroactive", "Retrieval failure and cue-dependent forgetting", "Motivated forgetting and consolidation failure", "Comparison and conclusion"],
    answer: `## Introduction
Forgetting is the loss of the ability to retrieve information that was once stored. Hermann Ebbinghaus, testing himself with nonsense syllables, showed that forgetting is rapid at first and then levels off. Theories of forgetting differ on whether the memory trace is lost (availability) or present but inaccessible (accessibility).

## Trace decay theory
Memory traces fade with the passage of time if they are not used, perhaps through the gradual breakdown of the neural changes underlying them.
- Support: the Brown Peterson finding of rapid loss from short-term memory without rehearsal.
- Problems: time is always confounded with intervening events. John Jenkins and Karl Dallenbach found that participants who slept after learning nonsense syllables forgot less than those who stayed awake for the same period, suggesting that events, not time, cause forgetting. Keppel and Underwood showed that short-term forgetting depends on interference from earlier trials. Very old memories can be recovered with the right cues, and some skills are retained for decades. Decay is hard to test directly and plays at most a limited role, possibly in sensory memory.

## Interference theory
Forgetting occurs because other learning disrupts the memory.
- Proactive interference: old learning disrupts recall of new learning, such as writing last year's date in January or calling a new partner by an old partner's name.
- Retroactive interference: new learning disrupts recall of old learning, such as forgetting an old phone number after learning a new one.
- Experimental design: groups learn list A, then list B (or rest), and are tested on A (retroactive) or B (proactive). Interference is greatest when the two lists are similar, such as A-B, A-C paired associates with the same stimulus and different responses.
- Benton Underwood showed that much forgetting of a list over 24 hours depends on how many earlier lists the person had learned, a strong case for proactive interference.
- Release from proactive interference, shown by Delos Wickens, occurs when the category of items changes.
- Critique: most evidence comes from artificial lists of similar items learned close together; interference shows that forgetting happens rather than explaining it; it struggles to explain forgetting of distinctive, unrelated material in daily life. However, interference among similar memories, such as repeated similar events, is a major cause of everyday forgetting.

## Retrieval failure (cue-dependent forgetting)
The memory is available but cannot be accessed because the right cues are missing.
- Endel Tulving and Zena Pearlstone found that participants who were given category headings at recall remembered far more words than those without cues, showing that the "forgotten" words were still stored.
- The encoding specificity principle: cues work best when they match the encoding context.
- Context-dependent forgetting (Godden and Baddeley's divers) and state-dependent forgetting.
- The tip-of-the-tongue state, studied by Roger Brown and David McNeill, in which a person knows a word, can recall its first letter or number of syllables, but cannot produce it.
- Critique: hard to prove that a memory is truly unavailable; context effects are often small with meaningful material and recognition tests.

## Motivated forgetting
- Freud's repression: anxiety-provoking memories are pushed out of consciousness. Experimental support is weak, and the idea of recovered memories of abuse is controversial, because suggestive therapy can create false memories.
- Directed forgetting and the think/no-think paradigm of Michael Anderson show that people can intentionally suppress retrieval, with reduced recall and lower hippocampal activity, giving a laboratory basis for motivated forgetting.
- Retrieval-induced forgetting: practising some items from a category makes related, unpractised items harder to recall.

## Consolidation failure
New memories need time to be stabilised (consolidated). Disruption shortly after learning, as by head injury, electroconvulsive therapy or alcohol blackouts, causes retrograde amnesia for recent events, while older memories are spared (Ribot's law). Sleep aids consolidation, which partly explains the Jenkins and Dallenbach finding.

## Comparison
| Theory | Is the memory still stored? | Key evidence | Main weakness |
| Decay | No | Brown Peterson | Time confounded with interference |
| Interference | Weakened or blocked | Paired associate list studies | Artificial materials |
| Retrieval failure | Yes | Tulving and Pearlstone cueing | Hard to test unavailability |
| Motivated | Yes, but suppressed | Think/no-think studies | Repression evidence weak |
| Consolidation | Never fully formed | Retrograde amnesia, sleep | Applies to recent memories |

## Conclusion
No single theory explains all forgetting. Interference and retrieval failure are the best supported for long-term memory in daily life; consolidation explains loss of recent memories after injury; decay may operate in sensory and short-term memory; motivated forgetting is real but limited. Forgetting is also adaptive: it clears outdated information, as Michael Anderson and Robert Bjork have argued.`,
    keyPoints: ["Availability versus accessibility", "Decay with Jenkins and Dallenbach critique", "Proactive and retroactive interference with examples", "Underwood's proactive interference finding", "Retrieval failure with Tulving and Pearlstone", "Motivated forgetting including think/no-think", "Consolidation and Ribot's law", "Balanced comparative conclusion"],
    pitfalls: ["Mixing up proactive and retroactive interference", "Presenting repression as well established"],
    module: "learning-memory/3-4",
    visuals: [
      { kind: "compare", caption: "Interference theory", data: { title: "Two kinds of interference", a: { label: "Proactive", points: ["Old learning blocks new", "Writing last year's date in January", "Grows with number of earlier lists"], summary: "Forward in time." }, b: { label: "Retroactive", points: ["New learning blocks old", "Forgetting an old password after setting a new one", "Worse when new material is similar"], summary: "Backward in time." } } },
      { kind: "curve", caption: "Motivated forgetting", data: { kind: "forgetting", title: "Ebbinghaus forgetting curve", caption: "Add a review a day later and see how the curve flattens." } },
    ],
    ref: "Ebbinghaus 1885; Jenkins and Dallenbach 1924; Underwood 1957; Tulving and Pearlstone 1966; Brown and McNeill 1966; Anderson and Green 2001 think/no-think; Atkinson and Hilgard ch 8",
  },
  {
    id: "cog-l02-012",
    subject: S,
    topic: "forgetting",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Describe Ebbinghaus's work on memory and the forgetting curve. What do the spacing effect and the testing effect add, and how can students apply these findings?",
    plan: ["Ebbinghaus's method: nonsense syllables and savings", "The forgetting curve with figures", "Overlearning and the spacing effect", "The testing effect", "Applications for students", "Critique and conclusion"],
    answer: `## Ebbinghaus's method
Hermann Ebbinghaus published "On Memory" in 1885, the first systematic experimental study of memory. To exclude prior associations, he invented nonsense syllables (consonant vowel consonant, such as DAX or BUP) and learned lists of them by heart, reading at a fixed pace until he could recite a list twice without error. He measured retention using the savings method: the reduction in time or trials needed to relearn a list compared with the original learning. If learning took 10 minutes and relearning 4 minutes, savings were 60 percent.

## The forgetting curve
Ebbinghaus relearned lists after intervals from 20 minutes to 31 days.
| Interval | Approximate savings |
| 20 minutes | 58 percent |
| 1 hour | 44 percent |
| 1 day | 34 percent |
| 6 days | 25 percent |
| 31 days | 21 percent |
Forgetting was rapid at first and then slowed, a negatively accelerated curve. Some savings remained even after a month, showing that memory not available for recall is not entirely lost. The curve has been replicated many times, including by Jaap Murre and Joeri Dros in 2015.

## Other findings
- Longer lists needed disproportionately more repetitions.
- Overlearning: continuing to practise after mastery increased retention.
- Spacing: distributing repetitions over days produced better retention than massing them in one session.

## The spacing effect
Spaced (distributed) practice leads to better long-term retention than massed practice (cramming), even when total study time is equal. It is one of the most robust findings in psychology. Expanding intervals (reviewing after one day, then three days, then a week) are often recommended. Explanations include encoding variability (different contexts provide more retrieval cues) and study-phase retrieval (each spaced review requires retrieving the earlier memory, which strengthens it).

## The testing effect
Retrieving information from memory, as in a practice test, strengthens memory more than re-reading the same material. Henry Roediger and Jeffrey Karpicke found that students who studied a passage once and then took three recall tests remembered far more a week later than students who studied it four times, though the re-study group felt more confident. Retrieval practice works even without feedback, but feedback improves it further.

## Applications for students
- Space study sessions across days and weeks rather than cramming before exams.
- Use self-testing: flashcards, practice questions, writing out answers from memory, explaining topics aloud.
- Interleave different topics or problem types instead of practising one type in a block.
- Review soon after a lecture, when forgetting is steepest, then at increasing intervals.
- Combine with deep, meaning-based processing and sleep, which aids consolidation.
- Do not mistake familiarity from re-reading for learning.

## Critique of Ebbinghaus
His work used one participant (himself) and meaningless material, which limits generalisation. Frederic Bartlett argued that studying meaningless syllables ignores how memory works for meaningful material, where schemas shape recall. Yet his methods and curves have stood the test of time.

## Conclusion
Ebbinghaus founded the experimental study of memory and described the forgetting curve. Modern research on spacing and testing shows how to flatten that curve, offering students practical, evidence-based study strategies.`,
    keyPoints: ["Nonsense syllables and savings method", "Forgetting curve with approximate figures", "Negatively accelerated shape and residual savings", "Spacing effect and explanations", "Testing effect with Roediger and Karpicke", "Practical study strategies", "Critique including Bartlett"],
    module: "learning-memory/3-4",
    visuals: [
      { kind: "curve", caption: "The forgetting curve", data: { kind: "forgetting", title: "Flatten the curve with spaced reviews", caption: "Add reviews at 1, 3 and 7 days. Compare with one long session." } },
      { kind: "experiment", caption: "The testing effect", data: { title: "Roediger and Karpicke: testing versus restudy", question: "What share of a passage was recalled one week later?", unit: "%", conditions: [{ label: "Study four times", value: 40 }, { label: "Study once, test three times", value: 61 }], why: "Retrieval practice strengthens memory more than rereading, though rereading feels more effective. Values approximate." } },
    ],
    ref: "Ebbinghaus 1885/1913 translation; Murre and Dros 2015 PLoS One; Roediger and Karpicke 2006 Psychological Science; Cepeda et al 2006 spacing meta-analysis",
  },
  {
    id: "cog-l02-013",
    subject: S,
    topic: "false-memory",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the research on eyewitness testimony and false memories. What are the implications for the legal system?",
    plan: ["Memory as reconstructive", "Loftus and Palmer and the misinformation effect", "Implanted false memories and the DRM paradigm", "Factors affecting eyewitness accuracy: weapon focus, stress, cross-race, confidence", "Lineups and the cognitive interview", "Legal implications including India and conclusion"],
    answer: `## Memory as reconstruction
Memory does not work like a video recording. Each time we recall an event, we rebuild it from stored fragments, general knowledge and later information. Frederic Bartlett demonstrated this in 1932 with the "War of the Ghosts" study. Eyewitness testimony is therefore vulnerable to distortion, which matters because in the United States mistaken eyewitness identification contributed to about 70 percent of convictions later overturned by DNA evidence.

## Leading questions and the misinformation effect
- Elizabeth Loftus and John Palmer in 1974 showed students films of car accidents and asked "About how fast were the cars going when they ___ each other?", varying the verb. With "smashed", estimates averaged about 41 miles per hour; with "contacted", about 32. A week later, 32 percent of the "smashed" group said they had seen broken glass, compared with 14 percent of the "hit" group and 12 percent of controls, although there was no broken glass. The verb did not just bias the answer; it changed the memory.
- The misinformation effect: information presented after an event, such as a question implying a stop sign was a yield sign, becomes incorporated into memory.
- Explanations include source monitoring errors (confusing where information came from), trace alteration and the coexistence of original and misleading traces.

## Implanted false memories
- Loftus and Jacqueline Pickrell's "lost in the mall" study: participants were given three true childhood events from relatives and one false event of being lost in a shopping mall. About 25 percent came to remember the false event, some in detail.
- Other studies implanted memories of a hot air balloon ride using doctored photographs, or of committing a crime as a teenager.
- The Deese Roediger McDermott (DRM) paradigm: after hearing words such as bed, rest, tired, dream, snore and pillow, people often confidently recall the unpresented word "sleep". False recall can be as frequent as true recall of list words.

## Factors affecting eyewitness accuracy
- Weapon focus: attention is drawn to a weapon, reducing memory for the face.
- Stress: very high stress usually impairs accuracy for faces and details, although central details of emotional events may be well remembered.
- Exposure time, distance, lighting and delay.
- Own-race (cross-race) bias: people are poorer at recognising faces of other ethnic groups.
- Confidence: confidence expressed at the first, fair identification has some relation to accuracy, but confidence grows with feedback ("Good, you identified the suspect") and rehearsal, so courtroom confidence is a poor guide.
- Post-event discussion with other witnesses (memory conformity).
- Children and older adults are more suggestible, especially to repeated leading questions.

## Lineups and interviewing
- Lineup procedures: double-blind administration, instructions that the culprit may not be present, fillers who match the description, sequential presentation in some systems, and recording the witness's confidence immediately.
- The cognitive interview, developed by Ronald Fisher and Edward Geiselman, uses memory principles: mentally reinstate the context, report everything however trivial, recall in different orders, and change perspective. It increases correct details by roughly 25 to 50 percent without a large increase in errors.
- Avoid leading and repeated questions, especially with children.

## Recovered memories
In the 1990s, some therapies using hypnosis, guided imagery and suggestion led clients to "recover" memories of childhood abuse, some of which were later shown to be false. This debate, sometimes called the memory wars, led professional bodies to caution against suggestive techniques. Genuine abuse is common and often remembered, so the issue is not disbelief but avoiding suggestion.

## Legal implications
- Eyewitness identification should not be the sole basis for conviction without corroboration.
- Courts should be educated about memory, through expert testimony or jury instructions.
- Police procedures should follow scientific guidelines on lineups and interviews.
- In India, the Indian Evidence Act, now the Bharatiya Sakshya Adhiniyam 2023, treats test identification parades as corroborative evidence, and the Supreme Court has repeatedly cautioned that identification by a witness who saw the accused only briefly needs careful scrutiny. Delays in identification parades and showing photographs of the accused beforehand weaken their value. Child witnesses under the POCSO Act are to be interviewed in child-friendly settings with minimal repetition, consistent with research on suggestibility.

## Conclusion
Research by Loftus and others shows that memory is malleable and that confident witnesses can be wrong. Applying memory science to interviewing, lineups and the evaluation of testimony can reduce wrongful convictions while still allowing reliable witnesses to be heard.`,
    keyPoints: ["Reconstructive memory with Bartlett", "Loftus and Palmer figures", "Misinformation effect and source monitoring", "Lost in the mall and DRM paradigm", "At least four factors affecting accuracy", "Confidence and accuracy relation", "Cognitive interview and lineup reforms", "Legal implications including Indian context"],
    pitfalls: ["Concluding that all eyewitnesses are unreliable", "Misreporting the Loftus and Palmer numbers"],
    module: "learning-memory/3-4",
    visuals: [
      { kind: "experiment", caption: "Leading questions and the misinformation effect", data: { title: "Loftus and Palmer: one word changes the memory", question: "A week later, what share said they saw broken glass (there was none)?", unit: "%", conditions: [{ label: "Asked with 'smashed'", value: 32 }, { label: "Asked with 'hit'", value: 14 }, { label: "No speed question", value: 12 }], why: "The leading verb changed how the accident was reconstructed in memory." } },
      { kind: "reveal", caption: "Implanted false memories", data: { prompt: "Listen: bed, rest, awake, tired, dream, snooze, blanket, doze, slumber, snore, nap, yawn. Without looking back, was 'sleep' on the list?", answer: "No. Most people confidently remember it because every word activates the idea of sleep. This is the DRM false memory effect." } },
    ],
    ref: "Loftus and Palmer 1974; Loftus and Pickrell 1995; Roediger and McDermott 1995; Fisher and Geiselman 1992; Innocence Project data; Wells et al 2020 lineup recommendations; Atkinson and Hilgard ch 8",
  },
  {
    id: "cog-l02-014",
    subject: S,
    topic: "long-term-memory",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Explain Bartlett's theory of reconstructive memory and the role of schemas in remembering, with experimental evidence.",
    plan: ["Bartlett's approach versus Ebbinghaus", "War of the Ghosts method and findings", "Schema theory", "Later evidence: Bransford and Johnson, Brewer and Treyens", "Evaluation and applications"],
    answer: `## Bartlett's approach
Frederic Bartlett, in his 1932 book "Remembering", rejected Ebbinghaus's use of meaningless material. He argued that memory is an active "effort after meaning": people reconstruct the past using their existing knowledge, attitudes and culture, rather than reproducing it like a copy.

## The War of the Ghosts
Bartlett asked English students to read a North American folk tale, "The War of the Ghosts", which contained supernatural elements and an unfamiliar logic. Participants recalled it repeatedly over time (repeated reproduction) or passed it from person to person (serial reproduction, like the game of Chinese whispers).
He found systematic changes:
- Omission: unfamiliar or puzzling details, such as the ghosts, dropped out.
- Rationalisation: odd events were explained in familiar terms, such as the "something black came out of his mouth" becoming foaming at the mouth.
- Transformation to the familiar: "canoes" became "boats", "hunting seals" became "fishing".
- Shortening: the story became shorter and more coherent.
- Importance: the central theme was preserved, while details changed.
- Order changes and the addition of morals.

## Schema theory
Bartlett explained these changes using the concept of a schema: an organised mental framework of knowledge about a type of object, event or situation, built from experience. Schemas guide what we notice at encoding, fill gaps at retrieval and distort information that does not fit. Scripts are schemas for routine events, such as visiting a restaurant or attending a wedding.

## Later evidence
- John Bransford and Marcia Johnson gave participants a vague passage about washing clothes. Those given the title before reading recalled far more than those given it after or not at all, because the title activated a schema that organised encoding.
- William Brewer and James Treyens had participants wait in an "office" and later recall its contents. They often remembered schema-consistent objects that were not present, such as books, and forgot unusual ones, though highly unusual items (a skull) were sometimes remembered better.
- Gordon Bower and colleagues showed that people recall script-typical actions that were not in a story.
- Cross-cultural research shows that culture shapes schemas and memory; for example, stories told in one's own cultural style are recalled more accurately.

## Evaluation
Strengths:
- Showed that memory is meaningful, active and culturally shaped.
- Explains everyday errors and eyewitness distortions.
- Schema theory remains central to cognitive and clinical psychology.
Weaknesses:
- Bartlett's methods were informal: vague instructions, no statistics, and participants may have deliberately guessed. Later controlled replications, such as by Gauld and Stephenson, found fewer distortions when participants were told to be accurate.
- Schemas are a loosely defined concept.
- Memory is not always distorted; people recall many details accurately, especially distinctive ones.

## Applications
- In clinical psychology, Aaron Beck's cognitive therapy treats depressive schemas, such as "I am unlovable", as frameworks that bias memory and interpretation.
- In education, advance organisers activate schemas that aid learning.
- In law, schemas explain why witnesses fill gaps with expected details.

## Conclusion
Bartlett showed that remembering is reconstruction guided by schemas. His insight, supported by later experiments, laid the foundation for modern research on false memory and on the cognitive basis of psychopathology.`,
    keyPoints: ["Effort after meaning versus Ebbinghaus", "War of the Ghosts method", "At least four types of change", "Schema and script defined", "Bransford and Johnson or Brewer and Treyens", "Methodological critique", "Clinical and educational applications"],
    module: "learning-memory/3-4",
    visuals: [
      { kind: "flow", caption: "The War of the Ghosts", data: { title: "How a schema reshapes a story", layout: "chain", nodes: [{ id: "a", label: "Unfamiliar story", detail: "Ghosts, canoes, seal hunting." }, { id: "b", label: "Encoding through schema", detail: "Familiar parts fit; odd parts do not." }, { id: "c", label: "Gaps and puzzles", detail: "Unfamiliar details fade." }, { id: "d", label: "Reconstruction at recall", detail: "Canoes become boats; events are rationalised." }, { id: "e", label: "Shorter, more familiar story" }] } },
    ],
    ref: "Bartlett 1932; Bransford and Johnson 1972; Brewer and Treyens 1981; Bower, Black and Turner 1979; Gauld and Stephenson 1967",
  },
  {
    id: "cog-l02-015",
    subject: S,
    topic: "amnesia",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "md-psychiatry"],
    question: "Discuss the types and causes of amnesia. What have studies of amnesic patients taught us about the organisation of human memory?",
    plan: ["Define amnesia, anterograde and retrograde", "Organic causes: medial temporal, diencephalic, other", "Case of H.M. in detail", "Korsakoff's syndrome, other cases and functional amnesia", "Lessons for theories of memory", "Clinical implications and conclusion"],
    answer: `## Meaning
Amnesia is a severe impairment of memory out of proportion to other cognitive deficits. Patients with the pure amnesic syndrome usually have normal intelligence, attention, language and immediate memory span, but cannot remember new events and facts. Two forms are distinguished:
- Anterograde amnesia: inability to form new long-term memories after the onset of the condition.
- Retrograde amnesia: loss of memories from before the onset, often temporally graded, with recent memories lost more than remote ones (Ribot's law).

## Causes
Organic amnesia:
- Medial temporal lobe damage: bilateral surgical removal (as in H.M.), herpes simplex encephalitis, hypoxia after cardiac arrest (which damages the CA1 field of the hippocampus), and early Alzheimer's disease.
- Diencephalic damage: Korsakoff's syndrome from thiamine deficiency, usually in chronic alcohol use, damaging the mammillary bodies and medial thalamus; also thalamic strokes and tumours.
- Basal forebrain damage, such as after rupture of an anterior communicating artery aneurysm, often with confabulation.
- Traumatic brain injury, with post-traumatic amnesia.
- Transient global amnesia: a sudden episode lasting hours, with dense anterograde amnesia and repeated questioning, followed by full recovery.
- Electroconvulsive therapy: temporary anterograde and patchy retrograde amnesia, greater with bilateral electrode placement.
Functional (psychogenic) amnesia:
- Dissociative amnesia, often after trauma, with loss of autobiographical memory and sometimes identity, but preserved ability to learn new information, the reverse of the organic pattern.

## The case of H.M.
Henry Molaison had intractable epilepsy, and in 1953 the surgeon William Scoville removed most of the hippocampus, amygdala and nearby cortex on both sides. His seizures improved, but he developed profound anterograde amnesia. Brenda Milner studied him for decades.
- He could not remember people he met, what he had eaten or that his uncle had died, though he grieved anew each time he heard.
- His intelligence was above average and his digit span normal; he could hold a number by constant rehearsal but lost it once distracted.
- He had retrograde amnesia for about 11 years before surgery, but remembered his childhood.
- He learned mirror drawing, improving over three days, without remembering ever having done the task.
- He showed normal priming and could learn some motor and perceptual skills.
- Late in life he acquired a few fragments of new semantic knowledge, such as the name of a famous person who became famous after 1953.

## Korsakoff's syndrome
Caused by thiamine deficiency, often following Wernicke's encephalopathy (confusion, ataxia, eye movement problems). Patients show severe anterograde amnesia, extensive retrograde amnesia spanning decades, confabulation (producing false memories without intent to deceive), poor insight and executive deficits from frontal involvement. Unlike pure medial temporal amnesia, they show heightened sensitivity to proactive interference, and they lose temporal order and source information. Release from proactive interference occurs poorly.

## Other informative cases
- Clive Wearing, a musician whose herpes encephalitis destroyed his hippocampi, lives in a perpetual present, repeatedly writing in his diary that he has "just woken up", yet can still play the piano and conduct.
- Patient K.F., with left parietal damage, had a very poor auditory verbal span but normal long-term learning, the opposite of H.M.
- Patient K.C., studied by Endel Tulving, lost almost all episodic memory but retained semantic knowledge and could not imagine his future, linking episodic memory with future thinking.
- Children with developmental amnesia acquire semantic knowledge despite poor episodic memory.

## Lessons for the organisation of memory
- Memory is a separable function: amnesia can occur with intact intelligence, perception and language.
- Short-term and long-term memory are distinct: H.M. had normal span but no new long-term learning; K.F. showed the opposite, a double dissociation.
- The hippocampus and related structures are needed to form new declarative memories but not to store remote ones, since old memories survive. This supports consolidation theory: memories initially depend on the hippocampus and gradually become independent through cortical reorganisation, although multiple trace theory argues that vivid episodic memories always need the hippocampus.
- Declarative and non-declarative memory are distinct: skill learning, priming and conditioning are preserved, supporting Squire's taxonomy.
- Episodic and semantic memory can dissociate, as in K.C. and developmental amnesia.
- Memory and imagining the future share mechanisms.
- Functional amnesia shows that memory retrieval can also be blocked by psychological factors.

## Clinical implications
- Assessment: tests such as the Wechsler Memory Scale and the Rey Auditory Verbal Learning Test distinguish encoding, storage and retrieval deficits.
- Rehabilitation: errorless learning, spaced retrieval and external aids such as diaries and smartphones exploit preserved implicit memory.
- Prevention: thiamine for people with alcohol dependence prevents Korsakoff's syndrome.
- Right unilateral ECT reduces memory side effects.

## Conclusion
Amnesic patients have been natural experiments that revealed the architecture of memory: separate short-term and long-term systems, distinct declarative and non-declarative memory, the role of the hippocampus in consolidation, and the separability of episodic and semantic memory.`,
    keyPoints: ["Anterograde and retrograde defined with Ribot's law", "Organic causes including medial temporal and diencephalic", "H.M. in detail with preserved abilities", "Korsakoff's syndrome features including confabulation", "Other cases such as Clive Wearing, K.F. or K.C.", "At least four lessons for memory theory", "Consolidation theory", "Clinical applications"],
    pitfalls: ["Describing H.M. as having no memory at all", "Confusing dissociative and organic amnesia patterns"],
    module: "learning-memory/3-4",
    visuals: [
      { kind: "brainexplorer", caption: "Lessons for the organisation of memory", data: { title: "Where amnesia comes from", focus: ["hippocampus", "thalamus", "amygdala", "frontal"], caption: "Switch on damage for the hippocampus. Which kinds of memory are lost, and which stay?" } },
      { kind: "compare", caption: "The case of H.M.", data: { title: "What H.M. lost and kept", a: { label: "Lost", points: ["New facts and events", "About 11 years before surgery", "Recognising people met after 1953"], summary: "New declarative memory." }, b: { label: "Kept", points: ["Normal digit span", "Childhood memories", "Mirror drawing skill and priming"], summary: "Short-term memory and implicit learning." } } },
    ],
    ref: "Scoville and Milner 1957; Corkin 2002; Kopelman 2002 on Korsakoff; Wilson and Wearing 1995; Tulving 1985 on K.C.; Bear, Connors and Paradiso ch 24; Kaplan and Sadock ch on neurocognitive disorders",
  },
  {
    id: "cog-l02-016",
    subject: S,
    topic: "consolidation",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "md-psychiatry"],
    question: "Write a short note on memory consolidation and reconsolidation.",
    plan: ["Define consolidation, synaptic and systems", "Evidence: retrograde amnesia, LTP, sleep", "Reconsolidation", "Clinical relevance"],
    answer: `## Consolidation
Consolidation is the process by which a newly formed memory, initially fragile, becomes stable over time.
- Synaptic consolidation occurs over minutes to hours and involves protein synthesis and structural changes at synapses, linked to long-term potentiation (LTP), first described by Timothy Bliss and Terje Lomo in the hippocampus.
- Systems consolidation occurs over weeks to years, as memories that first depend on the hippocampus become stored in neocortical networks.

## Evidence
- Retrograde amnesia after head injury or ECT is temporally graded: recent memories are lost and old ones spared (Ribot's law).
- Protein synthesis inhibitors given soon after learning block long-term memory in animals.
- Sleep aids consolidation: hippocampal replay of daytime activity patterns occurs during slow-wave sleep, and sleep after learning improves retention, which partly explains the Jenkins and Dallenbach finding.
- Stress hormones and the amygdala strengthen consolidation of emotional events, as James McGaugh showed.

## Reconsolidation
When a consolidated memory is retrieved, it can become unstable again and must be restabilised, a process called reconsolidation. Karim Nader and colleagues showed in 2000 that blocking protein synthesis in the amygdala just after rats recalled a fear memory erased the memory. Retrieval therefore opens a window in which memories can be updated or weakened.

## Clinical relevance
Reconsolidation research suggests ways to weaken traumatic memories in PTSD and phobias, such as giving propranolol around reactivation, or doing exposure shortly after recall, though human results are mixed. It also explains how memories change each time they are recalled, contributing to false memories.`,
    keyPoints: ["Synaptic versus systems consolidation", "LTP", "Ribot's law and sleep evidence", "Reconsolidation with Nader's study", "Clinical uses and caution"],
    module: "learning-memory/3-3",
    visuals: [
      { kind: "flow", caption: "Reconsolidation", data: { title: "Memory over time", layout: "cycle", nodes: [{ id: "e", label: "Encoding", detail: "A fragile new trace." }, { id: "c", label: "Consolidation", detail: "Protein synthesis, sleep replay, transfer to cortex." }, { id: "r", label: "Retrieval", detail: "The memory becomes unstable again." }, { id: "rc", label: "Reconsolidation", detail: "Restabilised, possibly updated." }] } },
    ],
    ref: "Bliss and Lomo 1973; McGaugh 2000; Nader, Schafe and LeDoux 2000 Nature; Bear, Connors and Paradiso ch 25",
  },
  {
    id: "cog-l02-017",
    subject: S,
    topic: "autobiographical-memory",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "What is autobiographical memory? Discuss childhood amnesia, the reminiscence bump and the self-memory system.",
    plan: ["Define autobiographical memory", "Methods of study", "Childhood amnesia and explanations", "The reminiscence bump and explanations", "Conway's self-memory system", "Cultural and clinical aspects"],
    answer: `## Meaning
Autobiographical memory is memory for the events and facts of one's own life. It combines episodic memories of specific events (my first day at school) with personal semantic knowledge (the school I attended) and life periods (when I lived in Pune). It supports identity, social bonds and planning for the future.

## Methods of study
- The Galton Crovitz cue word technique: participants recall a personal memory for each cue word (such as "river" or "festival"), and the age at the time of the memory is recorded.
- Diary studies, such as Marigold Linton and Willem Wagenaar recording events daily for years and testing themselves later.
- Life narratives and interviews.

## Childhood amnesia
Adults recall very few memories from before about age three to four, and sparse memories until about seven.
Explanations:
- Neurological: the hippocampus, prefrontal cortex and their connections are immature; rapid neurogenesis in infancy may disrupt stored memories.
- Cognitive self: Mark Howe and Mary Courage argued that autobiographical memory needs a sense of self, which appears around 18 to 24 months (mirror self-recognition).
- Language: memories encoded before language may not be retrievable in verbal form.
- Social and cultural: children learn to narrate memories through conversations with parents. Mothers who use elaborative styles have children with earlier and richer memories. Qi Wang found that Euro-American adults report earlier first memories than Chinese adults, linked to cultural emphasis on the individual self.

## The reminiscence bump
When older adults (over about 40) recall memories across their life, they recall disproportionately many from adolescence and early adulthood, roughly ages 10 to 30, compared with other periods. Recent memories are also frequent (recency), and very early ones rare.
Explanations:
- Cognitive: this is a period of novel, first-time experiences (first job, marriage, moving away), which are distinctive and well encoded, and of peak memory function.
- Identity: the bump coincides with forming adult identity, so these memories become central to the life story.
- Life script: David Berntsen and David Rubin found that culturally expected events (falling in love, graduation, marriage) cluster in this period, and the bump appears for positive but not negative events.

## The self-memory system
Martin Conway and Christopher Pleydell-Pearce proposed that autobiographical memory has a hierarchy of knowledge: life periods, general events and event-specific knowledge. Memories are constructed by a working self, the current goals and self-images, which guides retrieval. This explains why memories change with current goals and mood, and why people retrieve memories consistent with their present self.

## Clinical aspects
- Overgeneral autobiographical memory: people with depression and PTSD tend to recall general summaries ("I always fail") rather than specific events, which predicts poor problem-solving and a worse course. Memory specificity training is used as an intervention.
- Intrusive traumatic memories in PTSD are vivid, sensory and poorly integrated into the life story.
- Reminiscence therapy for older adults and people with dementia uses autobiographical cues to improve mood and identity.

## Conclusion
Autobiographical memory is the memory of the self. Its patterns across the lifespan, early amnesia and a bump in young adulthood, reflect the development of the brain, the self, language and culture, and its distortions have important clinical consequences.`,
    keyPoints: ["Definition with episodic and personal semantic components", "Methods such as cue word technique", "Childhood amnesia with at least three explanations", "Reminiscence bump with explanations", "Self-memory system", "Overgeneral memory in depression", "Cultural differences"],
    module: "learning-memory/3-4",
    visuals: [
      { kind: "timeline", caption: "The reminiscence bump", data: { prompt: "Order these features of lifetime memory from earliest to latest.", events: [{ label: "Childhood amnesia", when: "Birth to about 3 or 4" }, { label: "Sparse childhood memories", when: "About 4 to 10" }, { label: "Reminiscence bump", when: "About 10 to 30" }, { label: "Gradual forgetting of middle years", when: "About 30 to the recent past" }, { label: "Recency: many recent memories", when: "Last few years" }] } },
    ],
    ref: "Rubin, Wetzler and Nebes 1986; Howe and Courage 1993; Wang 2001; Conway and Pleydell-Pearce 2000; Williams et al 2007 overgeneral memory",
  },
  {
    id: "cog-l02-018",
    subject: S,
    topic: "semantic-memory",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Describe the hierarchical network model and the spreading activation model of semantic memory. How does the evidence support or challenge each?",
    plan: ["Semantic memory and the question of organisation", "Collins and Quillian hierarchical model and cognitive economy", "Supporting and challenging evidence", "Collins and Loftus spreading activation model", "Semantic priming and connectionist alternatives", "Conclusion"],
    answer: `## Semantic memory
Semantic memory is our store of general knowledge about the world: concepts, facts and word meanings. Researchers ask how this knowledge is organised so that we can answer questions such as "Is a canary a bird?" in under a second.

## The hierarchical network model
Allan Collins and Ross Quillian in 1969 proposed that concepts are stored as nodes in a hierarchy linked by "is a" relations, with properties stored at the highest level to which they apply.
- Animal (has skin, can move, eats) at the top; bird (has wings, can fly) and fish (has fins, can swim) below; canary (can sing, is yellow) and ostrich (has long legs, cannot fly) at the bottom.
- Cognitive economy: "has skin" is stored once at "animal", not repeated for every animal. Exceptions, such as "an ostrich cannot fly", are stored with the specific concept.
- Prediction: verifying a statement takes time to move through the hierarchy, so "A canary can sing" (same level) should be faster than "A canary can fly" (one level up), which should be faster than "A canary has skin" (two levels up).

## Evidence
Support:
- Collins and Quillian's reaction times rose with the number of levels: about 1,000 to 1,300 milliseconds and more as levels increased.
Challenges:
- Typicality effect: "A robin is a bird" is verified faster than "A penguin is a bird", although both are one link apart. Eleanor Rosch's work on prototypes showed that category membership is graded.
- Familiarity confound: Carol Conrad found that properties frequently associated with a concept were verified quickly regardless of level, so reaction times may reflect association strength, not hierarchy.
- Reverse distance effects: "A chicken is an animal" can be verified faster than "A chicken is a bird".
- False statements: "A bat is a bird" takes longer to reject than "A stone is a bird", which the model does not predict.

## The spreading activation model
Collins and Elizabeth Loftus in 1975 revised the theory. Concepts are nodes in a network, linked by associations of different strengths and lengths, not a strict hierarchy. Closely related concepts (fire engine, red, truck) are connected by short links.
- When a concept is activated, activation spreads along links to related concepts, decreasing with distance and over time.
- Typical members are closer to their category node, explaining the typicality effect.
- The network is organised by semantic relatedness and individual experience.

## Supporting evidence for spreading activation
- Semantic priming: David Meyer and Roger Schvaneveldt found that people decided faster that "nurse" was a word if it followed "doctor" than if it followed "bread", as activation from "doctor" had spread to "nurse".
- Explains the DRM false memory effect and tip-of-the-tongue states.

## Criticisms of spreading activation
It is very flexible: almost any result can be explained by adjusting link strengths, making it hard to falsify. It does not specify the nature of the links in detail.

## Later approaches
- Feature comparison models (Edward Smith, Edward Shoben and Lance Rips) represent concepts as lists of defining and characteristic features.
- Connectionist (parallel distributed processing) models, such as those of David Rumelhart and James McClelland, represent concepts as patterns of activation across many units, learned from experience, with graceful degradation that mirrors semantic dementia.
- Embodied views link concepts to sensory and motor systems.

## Conclusion
The hierarchical model was elegant and testable but failed to explain typicality and familiarity effects. Spreading activation provides a more flexible network that accounts for priming and typicality, at the cost of precision. Modern connectionist and embodied models continue this line.`,
    keyPoints: ["Hierarchical structure and cognitive economy", "Prediction about verification times", "Supporting evidence", "Typicality and familiarity challenges", "Spreading activation principles", "Semantic priming evidence", "Weakness of flexibility", "Later connectionist models"],
    module: "thinking-language/2-1",
    visuals: [
      { kind: "flow", caption: "The hierarchical network model", data: { title: "Collins and Quillian's hierarchy", layout: "tree", nodes: [{ id: "a", label: "Animal", detail: "Has skin, can move, eats." }, { id: "b", label: "Bird", parent: "a", detail: "Has wings, can fly, has feathers." }, { id: "f", label: "Fish", parent: "a", detail: "Has fins, can swim." }, { id: "c", label: "Canary", parent: "b", detail: "Can sing, is yellow." }, { id: "o", label: "Ostrich", parent: "b", detail: "Has long legs, cannot fly." }, { id: "s", label: "Shark", parent: "f", detail: "Can bite, is dangerous." }] } },
    ],
    ref: "Collins and Quillian 1969; Collins and Loftus 1975; Meyer and Schvaneveldt 1971; Conrad 1972; Rosch 1975; Smith, Shoben and Rips 1974",
  },
  {
    id: "cog-l02-019",
    subject: S,
    topic: "encoding-retrieval",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on mnemonic devices.",
    plan: ["Define mnemonics and their principle", "Imagery-based methods", "Verbal methods", "Why they work and limits"],
    answer: `## Meaning
Mnemonics are techniques that improve memory by organising information and linking it to existing knowledge, often through vivid imagery. They work by providing structure at encoding and reliable cues at retrieval.

## Imagery-based methods
- Method of loci: associate each item with a location along a familiar route, such as rooms in your house, then mentally walk the route at recall. Used by Greek and Roman orators; memory champions still use it.
- Pegword method: memorise rhyming pegs (one is a bun, two is a shoe, three is a tree) and form an image linking each item to its peg.
- Keyword method for foreign vocabulary: link the foreign word to a similar-sounding English word and form an image. For the Spanish "caballo" (horse), imagine a horse eating a cab.
- Visual imagery for names and faces: link a distinctive feature to a name.

## Verbal methods
- Acronyms: OCEAN for the Big Five traits.
- Acrostics: "Every Good Boy Deserves Fruit" for musical notes.
- Rhymes and songs: "Thirty days hath September".
- Chunking and the story method, linking items in a narrative.

## Why they work
They use deep and elaborative processing, dual coding (verbal plus imagery, as Allan Paivio proposed), organisation and distinctive retrieval cues.

## Limits
Mnemonics suit lists and arbitrary associations better than understanding of concepts; they need practice; and they do not improve general memory ability. Training in the method of loci, however, can produce large and lasting gains in list memory.`,
    keyPoints: ["Definition and principle", "Method of loci and pegword", "Keyword method", "Verbal mnemonics", "Why they work", "Limits"],
    module: "learning-memory/3-3",
    visuals: [
      { kind: "reveal", caption: "Imagery-based methods", data: { prompt: "Use the method of loci to remember: milk, stamps, battery, book.", answer: "Picture milk spilling at your front door, stamps stuck on the sofa, a battery fizzing in the kitchen sink and a book open on your bed. Walk the route to recall them." } },
    ],
    ref: "Paivio 1971; Bower 1970; Atkinson 1975 keyword method; Dresler et al 2017 Neuron memory athletes",
  },
  {
    id: "cog-l02-020",
    subject: S,
    topic: "encoding-retrieval",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "A first-year student tells you: \"I read my notes again and again before the exam, I feel I know everything, but in the exam hall my mind goes blank.\" Using principles of memory, explain what is happening and advise the student.",
    plan: ["Identify the illusion of knowing from rereading", "Explain encoding problems", "Explain retrieval problems including context and stress", "Give evidence-based study advice", "Address anxiety and sleep"],
    answer: `## What is happening
Several well-established memory principles explain the student's experience.

## The illusion of knowing
Rereading makes material feel familiar. Familiarity is a cue the brain uses to judge "I know this", but recognising text on a page is very different from recalling it unaided in an exam. This is a metacognitive error: the student's judgements of learning are inflated. Roediger and Karpicke found that students who reread felt more confident yet remembered less a week later than students who tested themselves.

## Encoding problems
- Rereading is shallow, maintenance-type processing. Craik and Lockhart's levels of processing framework predicts weak long-term memory from it.
- Massed study the night before produces rapid forgetting; Ebbinghaus's curve shows most loss in the first day.
- Without organisation, links between ideas are weak, so one forgotten point does not cue the next.

## Retrieval problems
- Encoding specificity: in the exam the cues are different. Notes provide strong cues; an exam question provides few. The student practised recognition, not recall.
- Exam anxiety: high arousal and worry consume working memory capacity, especially the central executive, as attentional control theory explains. Worry about failing competes with retrieval, producing the "blank". This fits the Yerkes Dodson principle that very high arousal impairs complex tasks.
- Lack of sleep before the exam impairs both consolidation and retrieval.

## Advice
- Use retrieval practice: close the notes and write or say what you remember, then check. Use past papers, flashcards and self-made questions. Practise writing full answers under timed conditions.
- Space study across weeks, reviewing each topic after one day, three days and a week.
- Interleave topics instead of studying one chapter for hours.
- Process deeply: explain concepts in your own words, connect them to examples from life, draw diagrams and concept maps, teach a friend.
- Organise each topic into a framework (definition, theory, evidence, critique, conclusion) that gives retrieval cues during the exam.
- Recreate exam conditions sometimes, so that cues at study and test match.
- Sleep seven to eight hours, especially the night before, rather than all-night cramming.
- Manage anxiety: slow breathing before starting, brief expressive writing about worries before the exam (shown by Gerardo Ramirez and Sian Beilock to improve performance in anxious students), and reappraising arousal as readiness. If blanking happens, move to another question and return; the first answer often cues others.
- If anxiety is severe or persistent, consult the college counsellor.

## Conclusion
The student's problem is not a poor memory but a mismatch between how they study (rereading, cramming, recognition) and what the exam requires (unaided recall under stress). Retrieval practice, spacing, deep processing, sleep and anxiety management address the problem directly.`,
    keyPoints: ["Illusion of knowing from familiarity", "Shallow encoding and massed study", "Encoding specificity and recall versus recognition", "Anxiety and working memory", "Retrieval practice and spacing advice", "Deep processing and organisation", "Sleep and anxiety management including referral"],
    module: "learning-memory/3-3",
    visuals: [
      { kind: "decide", caption: "Retrieval problems", data: { scene: "Two weeks before exams, a student has four chapters to learn.", ask: "Which plan follows memory research best?", choices: [{ label: "Reread all four chapters on the last two nights", verdict: "harm", outcome: "Feels fluent, forgets fast, little recall practice.", why: "Massed rereading gives an illusion of knowing." }, { label: "One chapter at a time, highlighting key lines", verdict: "ok", outcome: "Some benefit, but still mostly recognition.", why: "Highlighting is shallow and not retrieval." }, { label: "Spread sessions over two weeks, test yourself on each chapter and revisit it after one and three days", verdict: "best", outcome: "Strong, durable recall in the exam.", why: "Spacing plus retrieval practice is the best supported strategy." }] } },
    ],
    ref: "Roediger and Karpicke 2006; Dunlosky et al 2013 study techniques review; Eysenck et al 2007 attentional control theory; Ramirez and Beilock 2011 Science",
  },
];
