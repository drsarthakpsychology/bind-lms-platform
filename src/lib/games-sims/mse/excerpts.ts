/**
 * MSE Lab excerpts: short, original interview moments with an observation
 * note. Each finding is a quoted phrase to tag with a domain and the precise
 * word. Level 1 = Starting (clear findings), 2 = Beginner (look-alikes),
 * 3 = Advanced (the fine distinctions in Fish).
 *
 * `o` = wrong options shown with the answer; `close` = near-misses that earn
 * half the word credit; `also` = other domains that are fair to pick.
 */
import type { Domain, TermId } from "./terms";

export type Finding = { q: string; a: TermId; o: TermId[]; close?: TermId[]; also?: Domain[]; why: string };
export type Excerpt = {
  id: string;
  level: 1 | 2 | 3;
  who: string;
  place: string;
  lines: ["D" | "P" | "R", string][];
  note: string;
  findings: Finding[];
  skill: string;
};

const MSE = "interview-mse:mse";
const DIFF = "interview-mse:differentiate";

export const EXCERPTS: Excerpt[] = [
  /* ------------------------------------------------------------ Starting */
  {
    id: "m01",
    level: 1,
    who: "Ramesh, 52, bank clerk",
    place: "Medicine OPD, Nagpur",
    skill: MSE,
    lines: [
      ["D", "How have you been feeling these days?"],
      ["P", "...(long pause)... Nothing is left for me, doctor. Everything is grey."],
      ["D", "Do you ever think about death?"],
      ["P", "Sometimes I wish I would just not wake up. I have not thought how. My daughter's wedding is in March."],
    ],
    note: "Sits slumped, hardly moves his hands. Answers come after long gaps, in a quiet, flat voice.",
    findings: [
      { q: "Sits slumped, hardly moves his hands", a: "pmr", o: ["pma", "posturing", "selfcare"], why: "Slow, few movements with a slumped posture is psychomotor slowing, typical of moderate to severe depression." },
      { q: "Answers come after long gaps, in a quiet, flat voice", a: "latency", o: ["poverty", "mutism", "block"], close: ["poverty"], why: "The words do come, but slowly and quietly after long gaps. That is increased latency. Poverty of speech means very few words, not slow ones." },
      { q: "Nothing is left for me, doctor. Everything is grey.", a: "lowmood", o: ["euthymic", "anxiousmood", "nihilistic"], why: "This is his own description of how he feels, so it is mood (subjective). It is a metaphor, not a fixed belief that the world is gone." },
      { q: "Sometimes I wish I would just not wake up. I have not thought how.", a: "passiveSI", o: ["activeSI", "preoccupation", "guilt"], close: ["activeSI"], why: "A wish to be dead with no method or plan is a passive death wish. It still needs a full risk check; the wedding is a protective factor worth noting." },
    ],
  },
  {
    id: "m02",
    level: 1,
    who: "Priya, 24, fashion student",
    place: "Emergency room, Mumbai",
    skill: MSE,
    lines: [
      ["D", "What brings you here tonight?"],
      ["P", "Tonight, tonight, the night is young and so am I! I've designed forty dresses since Sunday, Milan wants me, Paris too, I don't need sleep, sleep is for people without a destiny!"],
      ["D", "How is your mood?"],
      ["P", "Fantastic! Best I've ever felt in my life!"],
    ],
    note: "Talks fast and loudly; hard to interrupt. Laughing, over-familiar, touches the doctor's arm.",
    findings: [
      { q: "Talks fast and loudly; hard to interrupt", a: "pressured", o: ["normalspeech", "latency", "echolalia"], why: "Fast, loud and hard to interrupt is pressured speech, a key sign of mania." },
      { q: "Best I've ever felt in my life!", a: "elated", o: ["euthymic", "irritable", "anxiousmood"], why: "Her own words describe feeling on top of the world: elated mood." },
      { q: "Laughing, over-familiar, touches the doctor's arm", a: "elatedaffect", o: ["labile", "incongruent", "reactive"], close: ["labile"], why: "What you see matches her elation and goes beyond the situation: elated, expansive affect. It is not incongruent, because it fits what she says." },
      { q: "Milan wants me, Paris too", a: "grandiose", o: ["overvalued", "reference", "persecutory"], close: ["overvalued"], why: "A belief of special fame with no basis, held in mania, is a grandiose delusion (confirm it is fixed and false by checking with family)." },
    ],
  },
  {
    id: "m03",
    level: 1,
    who: "Mr Hughes, 78, retired engineer",
    place: "Surgical ward, Leeds, day 2 after hip surgery",
    skill: MSE,
    lines: [
      ["D", "Do you know where you are?"],
      ["P", "At the depot, of course. It's 1979. Mind the beetles on the wall."],
      ["D", "Can you say the months of the year backwards, from December?"],
      ["P", "December, November... June? What was I doing?"],
    ],
    note: "Drowsy this morning, shouting at night. Picks at the sheets. The nurse says he was clear yesterday afternoon.",
    findings: [
      { q: "At the depot, of course. It's 1979.", a: "disoriented", o: ["oriented", "confabulation", "recentmem"], close: ["confabulation"], why: "He is wrong about place and time. That is disorientation." },
      { q: "December, November... June? What was I doing?", a: "inattention", o: ["recentmem", "perseveration", "block"], why: "Losing track of a simple backwards task is poor attention, the core cognitive sign of delirium." },
      { q: "Mind the beetles on the wall.", a: "vh", o: ["illusion", "pseudo", "tactile"], close: ["illusion"], why: "Seeing creatures that aren't there is a visual hallucination, common in delirium. If there were a real mark on the wall seen as beetles, it would be an illusion." },
      { q: "Drowsy this morning, shouting at night", a: "clouding", o: ["oriented", "pmr", "labile"], why: "Alertness that comes and goes across the day is fluctuating consciousness: think delirium, find the cause." },
    ],
  },
  {
    id: "m04",
    level: 1,
    who: "Arjun, 21, engineering student",
    place: "Psychiatry OPD, Pune",
    skill: MSE,
    lines: [
      ["D", "Do you hear things others don't?"],
      ["P", "Two men. They talk about me all day. 'Now he's brushing his teeth. Now he's pretending to study.'"],
      ["D", "Why would they do that?"],
      ["P", "My hostel warden has put a chip in my phone. They are reading everything to poison me slowly."],
    ],
    note: "Sits near the door, glances at the corners, stops mid-answer as if listening.",
    findings: [
      { q: "'Now he's brushing his teeth. Now he's pretending to study.'", a: "ah3", o: ["ah2", "pseudo", "command"], close: ["ah2"], why: "Voices talking about him in the third person, commenting on what he is doing, is a running commentary, a first-rank symptom." },
      { q: "put a chip in my phone. They are reading everything to poison me slowly", a: "persecutory", o: ["reference", "overvalued", "obsession"], why: "A fixed belief of being harmed, with no basis, is a persecutory delusion." },
      { q: "stops mid-answer as if listening", a: "responding", o: ["block", "pmr", "guarded"], close: ["block"], why: "Pausing as if listening to someone unseen is behaviour that suggests he is hearing voices right now. Thought block is a sudden empty stop, not listening." },
      { q: "Sits near the door, glances at the corners", a: "guarded", o: ["pma", "kempt", "stereotypy"], why: "Watchful, checking the room and staying near the exit is guarded, suspicious behaviour." },
    ],
  },
  {
    id: "m05",
    level: 1,
    who: "Sneha, 29, accountant",
    place: "Clinical psychology OPD, Bengaluru",
    skill: MSE,
    lines: [
      ["D", "What happens when you touch a door handle?"],
      ["P", "The thought comes that I've picked up germs and I'll kill my baby. I know it's silly. I try to push it out, but it keeps coming back."],
      ["D", "And then?"],
      ["P", "I wash. Twenty, thirty times. I know it's too much. I want to stop."],
    ],
    note: "Hands red and cracked. Neat, well dressed. Tense, wringing her hands while describing the thoughts.",
    findings: [
      { q: "I know it's silly. I try to push it out, but it keeps coming back.", a: "obsession", o: ["insertion", "persecutory", "worry"], close: ["worry"], why: "An intrusive thought she knows is her own, finds senseless and resists is an obsession. In thought insertion the thought is felt to come from outside." },
      { q: "I wash. Twenty, thirty times.", a: "compulsion", o: ["stereotypy", "mannerism", "pma"], close: ["stereotypy"], why: "A repeated act with a purpose (to reduce the anxiety of the obsession) is a compulsion. A stereotypy has no goal at all." },
      { q: "I know it's too much. I want to stop.", a: "fullinsight", o: ["partialinsight", "noinsight", "poorjudgement"], why: "She sees the thoughts and washing as excessive and wants help: full (good) insight." },
      { q: "Tense, wringing her hands while describing the thoughts", a: "anxiousaffect", o: ["tearful", "incongruent", "labile"], why: "Tension and hand-wringing that fit her fearful thoughts is anxious affect." },
    ],
  },
  {
    id: "m06",
    level: 1,
    who: "Anjali, 33, school teacher",
    place: "General practice, Kolkata",
    skill: MSE,
    lines: [
      ["D", "Tell me about the attacks."],
      ["P", "My heart races, I can't breathe, and the room goes strange, like a film set, not real. I know it is the same room."],
      ["D", "And between attacks?"],
      ["P", "I'm scared all the time that the next one will come."],
    ],
    note: "Neat and appropriately dressed. Speech normal in rate and volume. Oriented, attends well.",
    findings: [
      { q: "the room goes strange, like a film set, not real. I know it is the same room.", a: "derealisation", o: ["depersonalisation", "illusion", "nihilistic"], close: ["depersonalisation"], why: "The world (not herself) feels unreal, and she knows it isn't really changed: derealisation. Depersonalisation is feeling unreal in oneself." },
      { q: "I'm scared all the time that the next one will come.", a: "anxiousmood", o: ["lowmood", "irritable", "euthymic"], why: "In her own words she is frightened and on edge: anxious mood (anticipatory anxiety in panic disorder)." },
      { q: "Neat and appropriately dressed", a: "kempt", o: ["selfcare", "guarded", "pma"], why: "A normal finding still goes in the MSE: well kempt and appropriately dressed." },
      { q: "Oriented, attends well", a: "oriented", o: ["inattention", "clouding", "disoriented"], why: "Orientation and attention are intact. A normal cognition line." },
    ],
  },
  {
    id: "m07",
    level: 1,
    who: "Joseph, 45, driver",
    place: "Medical ward, Kochi, 48 hours after admission",
    skill: MSE,
    lines: [
      ["D", "How are you feeling?"],
      ["P", "Ants! Ants under my skin, doctor, get them off!"],
      ["D", "What is today's date?"],
      ["P", "It is... Onam? No. I don't know."],
    ],
    note: "Hands shaking, soaked in sweat, pulse 118. Last drink three days ago, says his wife.",
    findings: [
      { q: "Ants under my skin", a: "tactile", o: ["vh", "illusion", "depersonalisation"], close: ["vh"], why: "Feeling insects crawling under the skin with no stimulus is a tactile hallucination (formication), classic in alcohol withdrawal." },
      { q: "Hands shaking, soaked in sweat, pulse 118", a: "tremor", o: ["pma", "selfcare", "posturing"], close: ["pma"], why: "Tremor, sweating and a fast pulse are signs of an overactive nervous system; with his history, think delirium tremens. This is an emergency." },
      { q: "It is... Onam? No. I don't know.", a: "disoriented", o: ["oriented", "confabulation", "block"], why: "He can't give the date: disoriented to time." },
    ],
  },
  {
    id: "m08",
    level: 1,
    who: "Meera, 40, architect",
    place: "Follow-up OPD, Ahmedabad (recovered from depression)",
    skill: MSE,
    lines: [
      ["D", "How is your mood these days?"],
      ["P", "Normal, honestly. Some good days, some tired days, like anyone."],
      ["D", "And the medicines?"],
      ["P", "I know the depression was an illness. I'll keep taking them till we decide together to stop."],
    ],
    note: "Smiles when talking about her son's cricket match; serious when talking about last year. Thinking is logical and to the point.",
    findings: [
      { q: "Normal, honestly. Some good days, some tired days", a: "euthymic", o: ["lowmood", "elated", "anxiousmood"], why: "In her words her mood is in the ordinary range: euthymic." },
      { q: "Smiles when talking about her son's cricket match; serious when talking about last year", a: "reactive", o: ["labile", "restricted", "incongruent"], close: ["labile"], why: "Expression that moves sensibly with the topic is a reactive, full-range affect. Labile would be quick swings out of proportion." },
      { q: "Thinking is logical and to the point", a: "goaldirected", o: ["circumstantial", "prolixity", "slowedthought"], why: "Coherent and reaching the point: goal-directed thought, the normal finding." },
      { q: "I know the depression was an illness. I'll keep taking them", a: "fullinsight", o: ["partialinsight", "noinsight", "poorjudgement"], why: "She accepts the illness and the treatment plan: full insight." },
    ],
  },
  {
    id: "m09",
    level: 1,
    who: "Kavitha, 26, homemaker",
    place: "Emergency, Madurai",
    skill: MSE,
    lines: [
      ["D", "Kavitha, can you hear me? Can you tell me your name?"],
      ["R", "(no reply)"],
      ["D", "I'm going to lift your arm."],
      ["R", "(the arm stays up where it was placed, for two minutes)"],
    ],
    note: "Eyes open, follows the doctor with her gaze. Has stood with one hand raised to her ear for most of the morning, says her mother.",
    findings: [
      { q: "(no reply)", a: "mutism", o: ["poverty", "latency", "block"], close: ["poverty"], why: "Awake and alert, following with her eyes, but no speech at all: mutism." },
      { q: "(the arm stays up where it was placed, for two minutes)", a: "waxy", o: ["posturing", "stereotypy", "mannerism"], close: ["posturing"], why: "A limb that stays where the examiner puts it is waxy flexibility. When the person adopts the odd position on their own, it is posturing." },
      { q: "Has stood with one hand raised to her ear for most of the morning", a: "posturing", o: ["waxy", "stereotypy", "compulsion"], close: ["waxy"], why: "Holding an odd position for hours on her own is posturing. With mutism and waxy flexibility, this is catatonia: a lorazepam challenge is often the first step." },
    ],
  },
  {
    id: "m10",
    level: 1,
    who: "Fatima, 61, retired nurse",
    place: "Psychology clinic, Hyderabad, four months after her husband died",
    skill: MSE,
    lines: [
      ["D", "How have things been?"],
      ["P", "I miss him in every room. I still set two cups for chai. But when my grandson visits, I can laugh with him."],
      ["D", "Do you blame yourself?"],
      ["P", "No. We did everything. It was his time."],
    ],
    note: "Tearful when talking about her husband, then smiles warmly at a story about her grandson.",
    findings: [
      { q: "I miss him in every room. I still set two cups for chai.", a: "preoccupation", o: ["guilt", "nihilistic", "obsession"], why: "A theme she keeps coming back to, which is not a false belief, is preoccupation. Here it is ordinary grief." },
      { q: "Tearful when talking about her husband, then smiles warmly", a: "reactive", o: ["labile", "incongruent", "blunted"], close: ["labile"], why: "Sadness that lifts with a warm moment, in proportion, is a reactive affect. It helps tell grief from a depressive episode." },
      { q: "No. We did everything. It was his time.", a: "noabn", o: ["guilt", "passiveSI", "preoccupation"], why: "No guilt, no death wish, no delusion: write 'no abnormal beliefs' for these areas." },
    ],
  },
  {
    id: "m11",
    level: 1,
    who: "Daniel, 35, delivery rider",
    place: "Community mental health team, Manchester",
    skill: MSE,
    lines: [
      ["D", "How are you looking after yourself?"],
      ["P", "Don't need to wash. The water's got signals in it."],
      ["D", "Do you think anything is wrong with your health?"],
      ["P", "Nothing wrong with me. It's the council you should be treating."],
    ],
    note: "Hair matted, strong smell, the same stained jacket for weeks, says his sister.",
    findings: [
      { q: "Hair matted, strong smell, the same stained jacket", a: "selfcare", o: ["kempt", "pmr", "mannerism"], why: "Poor hygiene, out of keeping with his usual standard, is poor self-care. Ask why: here it is driven by a belief." },
      { q: "Nothing wrong with me. It's the council you should be treating.", a: "noinsight", o: ["partialinsight", "fullinsight", "poorjudgement"], close: ["partialinsight"], why: "He sees no illness at all and puts the problem outside himself: no insight." },
      { q: "The water's got signals in it.", a: "persecutory", o: ["overvalued", "obsession", "reference"], close: ["reference"], why: "A fixed, impossible belief that the water carries harmful signals, which stops him washing. Ask what the signals do: if they carry messages for him alone, think of reference too." },
    ],
  },
  /* ------------------------------------------------------------ Beginner */
  {
    id: "m12",
    level: 2,
    who: "Mr Tiwari, 67, retired school headmaster",
    place: "Memory clinic, Varanasi",
    skill: DIFF,
    lines: [
      ["D", "What did you have for breakfast?"],
      ["P", "Well, the milkman came late, as he does on Tuesdays because his cousin runs the Lanka route, and my wife, who taught Hindi for thirty-one years, by the way, boiled the milk twice, she always does, and so, to answer you, poha."],
    ],
    note: "Pleasant, detailed. Takes a long road but always arrives. Clean kurta, well groomed.",
    findings: [
      { q: "and so, to answer you, poha", a: "circumstantial", o: ["tangential", "foi", "loosening"], close: ["tangential"], why: "Lots of needless detail, but the answer arrives. That is circumstantiality. Tangential speech would never get back to breakfast." },
      { q: "Clean kurta, well groomed", a: "kempt", o: ["selfcare", "mannerism", "guarded"], why: "Well kempt: a normal finding that also helps rate his self-care in a memory assessment." },
    ],
  },
  {
    id: "m13",
    level: 2,
    who: "Leah, 19, first-year student",
    place: "University counselling service, Toronto",
    skill: DIFF,
    lines: [
      ["D", "How did your exams go?"],
      ["P", "Exams are kind of like hockey seasons, you know? My brother plays hockey. His coach is from Sweden. Sweden has amazing design, all those furniture stores..."],
      ["D", "Leah, the exams?"],
      ["P", "Oh, the furniture there is so cheap, my roommate bought a lamp..."],
    ],
    note: "Speaks at a normal speed. Each step is linked to the last, but she never returns to the question.",
    findings: [
      { q: "Oh, the furniture there is so cheap, my roommate bought a lamp", a: "tangential", o: ["circumstantial", "foi", "loosening"], close: ["foi", "circumstantial"], why: "Each step links to the last, at normal speed, but she never gets back to the exams, even when redirected. That is tangential. With fast, pressured jumps it would be flight of ideas." },
      { q: "Speaks at a normal speed", a: "normalspeech", o: ["pressured", "latency", "poverty"], why: "Rate is normal. That is one reason this is tangentiality rather than flight of ideas." },
    ],
  },
  {
    id: "m14",
    level: 2,
    who: "Rohan, 30, musician",
    place: "Psychiatry ward, Delhi",
    skill: DIFF,
    lines: [
      ["D", "Where do you live, Rohan?"],
      ["P", "Lajpat Nagar, nagar, nagara drum, drum roll, roll call, call me, Bollywood calls me, that fan above you is spinning like my career!"],
    ],
    note: "Words tumble out fast. He grins broadly and points at the ceiling fan mid-sentence.",
    findings: [
      { q: "drum roll, roll call, call me, Bollywood calls me, that fan above you is spinning", a: "foi", o: ["loosening", "tangential", "wordsalad"], close: ["loosening"], why: "Rapid jumps by sound and chance links (and the fan in the room), each one followable: flight of ideas. In loosening you cannot follow the link." },
      { q: "Lajpat Nagar, nagar, nagara drum", a: "clang", o: ["neologism", "perseveration", "echolalia"], why: "Choosing the next word because it sounds like the last ('nagar, nagara') is a clang association, common inside flight of ideas." },
      { q: "Words tumble out fast", a: "pressured", o: ["normalspeech", "latency", "echolalia"], why: "Fast, unstoppable speech: pressured." },
    ],
  },
  {
    id: "m15",
    level: 2,
    who: "Imran, 27, unemployed",
    place: "Psychiatry OPD, Lucknow",
    skill: DIFF,
    lines: [
      ["D", "What do you do during the day?"],
      ["P", "The day is long. My uncle's scooter needs paint because the moon is government. Rice has angles too, you see, and the angles decided."],
    ],
    note: "Speaks at an ordinary speed, calm face. The doctor cannot find any link between the ideas.",
    findings: [
      { q: "My uncle's scooter needs paint because the moon is government", a: "loosening", o: ["foi", "tangential", "circumstantial"], close: ["foi"], why: "Ideas slide with no link you can follow, at ordinary speed: loosening of association. Flight of ideas is fast and its links (rhymes, puns) can usually be traced." },
      { q: "calm face", a: "blunted", o: ["flat", "incongruent", "reactive"], close: ["flat"], why: "The note only says calm; ask more. Saying strange things with little emotion fits blunting, the most common affect change in schizophrenia. If there were no expression at all, you would say flat." },
    ],
  },
  {
    id: "m16",
    level: 2,
    who: "Ali, 23, call-centre worker",
    place: "Early intervention service, Birmingham",
    skill: DIFF,
    lines: [
      ["D", "And what happened after you left work?"],
      ["P", "I went to the bus stop and then I —"],
      ["R", "(silence for 15 seconds)"],
      ["P", "It's gone. Something took it. I don't know what I was saying."],
    ],
    note: "Not drowsy; he was answering normally a moment before.",
    findings: [
      { q: "It's gone. Something took it.", a: "withdrawal", o: ["block", "insertion", "broadcast"], close: ["block"], why: "He says something took the thought out: that belief is thought withdrawal, a first-rank symptom. The observed sudden stop is thought block." },
      { q: "I went to the bus stop and then I —", a: "block", o: ["latency", "perseveration", "poverty"], close: ["latency"], why: "A sudden dead stop mid-sentence, in clear consciousness, unable to pick it up again, is thought block. Slow speech still gets there." },
    ],
  },
  {
    id: "m17",
    level: 2,
    who: "Lakshmi, 44, mother of a soldier",
    place: "Psychology clinic, Thiruvananthapuram",
    skill: DIFF,
    lines: [
      ["P", "Last night the power went off. I was so scared for my son. I saw a man standing by the cupboard. When I put the torch on, it was my husband's shirt on the hook."],
      ["D", "Did you see anything else?"],
      ["P", "No. I laughed at myself."],
    ],
    note: "Anxious about her son posted at the border. No other unusual experiences.",
    findings: [
      { q: "it was my husband's shirt on the hook", a: "illusion", o: ["vh", "pareidolia", "pseudo"], close: ["pareidolia"], why: "A real object (the shirt) misperceived in fear and poor light, corrected on a closer look: an illusion (an 'affect illusion'). A hallucination has no real stimulus." },
      { q: "I was so scared for my son.", a: "anxiousmood", o: ["lowmood", "euthymic", "irritable"], why: "Her own words describe fear: anxious mood. Fear is exactly what drives affect illusions." },
    ],
  },
  {
    id: "m18",
    level: 2,
    who: "Tom, 20, nursing student",
    place: "University health centre, Edinburgh",
    skill: DIFF,
    lines: [
      ["P", "Just as I'm dropping off, I sometimes hear my name called, really clearly. It makes me jump. Then it's gone."],
      ["D", "During the day?"],
      ["P", "Never. I'm fine during the day."],
    ],
    note: "Sleeping five hours a night in exam season. Otherwise well.",
    findings: [
      { q: "Just as I'm dropping off, I sometimes hear my name called", a: "hypnagogic", o: ["ah2", "pseudo", "illusion"], close: ["pseudo"], why: "A brief voice while falling asleep is a hypnagogic hallucination. It is common, especially with too little sleep, and not a sign of psychosis on its own." },
      { q: "Never. I'm fine during the day.", a: "noperc", o: ["ah2", "derealisation", "hypnagogic"], why: "No daytime experiences: write no perceptual abnormality while awake." },
    ],
  },
  {
    id: "m19",
    level: 2,
    who: "Deepa, 32, software tester",
    place: "Psychiatry OPD, Chennai",
    skill: DIFF,
    lines: [
      ["D", "Tell me about these thoughts."],
      ["P", "They are not my thoughts. A satellite sends them into my head. I can feel them land, they're someone else's."],
    ],
    note: "Compare: her sister, who has OCD, says her own violent thoughts 'come from my own mind, I hate them'.",
    findings: [
      { q: "They are not my thoughts. A satellite sends them into my head.", a: "insertion", o: ["obsession", "passivity", "broadcast"], close: ["passivity"], why: "Thoughts felt to be put in from outside, not her own, is thought insertion. The sister's thoughts are her own and resisted: obsessions." },
      { q: "'come from my own mind, I hate them'", a: "obsession", o: ["insertion", "worry", "guilt"], why: "The sister owns the thoughts and rejects them: obsessions. Ownership is the key test." },
    ],
  },
  {
    id: "m20",
    level: 2,
    who: "Mr Banerjee, 70, retired clerk",
    place: "Geriatric psychiatry ward, Kolkata",
    skill: DIFF,
    lines: [
      ["P", "I have ruined my family. I stole from the office forty years ago. The whole city knows. I must be punished."],
      ["D", "What did you take?"],
      ["P", "A pencil. A pencil! My sin has made my intestines rot. There is nothing inside me now."],
    ],
    note: "Slow, quiet, eats little. No record of any wrongdoing.",
    findings: [
      { q: "I have ruined my family. I stole from the office forty years ago.", a: "guilt", o: ["obsession", "preoccupation", "persecutory"], close: ["preoccupation"], why: "A fixed belief of terrible wrongdoing, far beyond the real (tiny) fault, is a delusion of guilt, typical of psychotic depression." },
      { q: "My sin has made my intestines rot. There is nothing inside me now.", a: "nihilistic", o: ["guilt", "depersonalisation", "overvalued"], close: ["depersonalisation"], why: "A fixed belief that his organs are rotting or gone is nihilistic (Cotard-type). Depersonalisation is an 'as if' feeling with insight; this is believed literally." },
      { q: "Slow, quiet, eats little", a: "pmr", o: ["pma", "posturing", "selfcare"], why: "Slow and quiet movement is psychomotor slowing. With not eating, this is a physical risk." },
    ],
  },
  {
    id: "m21",
    level: 2,
    who: "Mr Pillai, 58, ex-sailor",
    place: "Neurology ward, Kochi",
    skill: DIFF,
    lines: [
      ["D", "Have we met before?"],
      ["P", "Of course! You came to my ship in Goa last week. We had fish curry."],
      ["D", "What were the three words I asked you to remember?"],
      ["P", "Words? You didn't give me any words."],
    ],
    note: "Long history of heavy drinking. Alert, attention fair, calm. They met for the first time today.",
    findings: [
      { q: "You came to my ship in Goa last week. We had fish curry.", a: "confabulation", o: ["grandiose", "disoriented", "recentmem"], close: ["recentmem"], why: "An invented memory he believes, filling a gap, without trying to deceive: confabulation, classic in Korsakoff syndrome (thiamine deficiency)." },
      { q: "You didn't give me any words.", a: "recentmem", o: ["inattention", "confabulation", "clouding"], close: ["inattention"], why: "Attention is fair, but new information is lost within minutes: impaired recent memory." },
    ],
  },
  {
    id: "m22",
    level: 2,
    who: "Sara, 38, HR manager",
    place: "Psychology OPD, Dubai",
    skill: DIFF,
    lines: [
      ["D", "How is your mood?"],
      ["P", "I'm fine. Really. Totally fine."],
    ],
    note: "Eyes fill with tears as she says it; voice cracks. Little change in her face otherwise.",
    findings: [
      { q: "I'm fine. Really. Totally fine.", a: "euthymic", o: ["lowmood", "elated", "anxiousmood"], close: ["lowmood"], why: "Mood is what she says. Record it in her words: 'fine'. The gap with what you see is the finding." },
      { q: "Eyes fill with tears as she says it; voice cracks", a: "tearful", o: ["incongruent", "labile", "reactive"], close: ["incongruent"], why: "Affect is what you see: low and tearful. Mood and affect don't match, which is worth noting, but 'incongruent affect' means affect that doesn't fit the content of thought, unknown to the person." },
      { q: "Little change in her face otherwise", a: "restricted", o: ["flat", "blunted", "reactive"], close: ["blunted"], why: "A narrowed range, still in the sad direction: restricted affect. Flat would be no expression at all." },
    ],
  },
  /* ------------------------------------------------------------ Advanced */
  {
    id: "m23",
    level: 3,
    who: "Mr Rao, 72, retired professor",
    place: "Bereavement clinic, Bengaluru",
    skill: DIFF,
    lines: [
      ["P", "I hear my wife's voice, saying 'have you eaten?' It is inside my head, not in the room. I know it is my mind missing her."],
      ["D", "Does it feel like a real voice coming through your ears?"],
      ["P", "No. Clear, but inside. It comes on its own."],
    ],
    note: "Fully alert. Grieving for six months. No other psychotic features.",
    findings: [
      { q: "It is inside my head, not in the room. I know it is my mind missing her.", a: "pseudo", o: ["ah2", "hypnagogic", "illusion"], close: ["ah2"], why: "Vivid and involuntary, but in inner space and known not to be a real perception, in clear consciousness: a pseudo-hallucination (Jaspers). Common in grief and not, by itself, a sign of psychosis." },
      { q: "Fully alert", a: "oriented", o: ["clouding", "inattention", "disoriented"], why: "Clear consciousness matters: Jaspers' pseudo-hallucinations are seen in full consciousness." },
    ],
  },
  {
    id: "m24",
    level: 3,
    who: "Nikhil, 25, gym trainer",
    place: "Emergency, Jaipur",
    skill: DIFF,
    lines: [
      ["P", "A man's voice, from the window, as clear as yours. It says 'jump, you're useless, jump'."],
      ["D", "Where do you hear it?"],
      ["P", "Out there, through my ears. I looked outside. Nobody."],
      ["D", "Do you feel you must obey?"],
      ["P", "It's getting harder not to."],
    ],
    note: "Third-floor flat. Says he feels hopeless.",
    findings: [
      { q: "It says 'jump, you're useless, jump'.", a: "command", o: ["ah3", "pseudo", "obsession"], close: ["ah3"], why: "A voice telling him to act is a command hallucination. With his distress about resisting and a third-floor flat, this is high risk: do not leave him alone." },
      { q: "Out there, through my ears. I looked outside. Nobody.", a: "ah2", o: ["pseudo", "illusion", "hypnagogic"], close: ["pseudo"], why: "Heard in outer space, through the ears, as real as speech, talking to him: a true second-person hallucination. A pseudo-hallucination is located inside." },
    ],
  },
  {
    id: "m25",
    level: 3,
    who: "Ishita, 17, Class 12 student",
    place: "Adolescent clinic, Delhi",
    skill: DIFF,
    lines: [
      ["P", "My thighs are huge. Everyone says I'm thin, but they don't see what I see. If I gain even half a kilo, I'm worthless."],
      ["D", "Could they be right?"],
      ["P", "Maybe they're being kind... but I can't risk it."],
    ],
    note: "BMI 15.2. Wears loose layers. Checks her waist with her hands repeatedly.",
    findings: [
      { q: "If I gain even half a kilo, I'm worthless.", a: "overvalued", o: ["persecutory", "obsession", "nihilistic"], close: ["obsession"], why: "An emotionally charged belief about weight and shape that dominates her life, understandable in her culture and not fully fixed ('maybe they're being kind'): an overvalued idea, the classic belief in anorexia nervosa." },
      { q: "Checks her waist with her hands repeatedly", a: "compulsion", o: ["stereotypy", "mannerism", "pma"], close: ["stereotypy"], why: "Repeated body checking with a purpose (to calm the fear of weight gain) behaves like a compulsion, not a goalless stereotypy." },
    ],
  },
  {
    id: "m26",
    level: 3,
    who: "Suresh, 22, farm worker",
    place: "Andrology and sexual health clinic, Rajkot",
    skill: DIFF,
    lines: [
      ["P", "I lose dhatu in my urine. That is why I am weak and my memory is going. My village elder said the same."],
      ["D", "If the tests are normal, what would that mean?"],
      ["P", "Then... maybe it is the stress. But I still worry."],
    ],
    note: "Tired, anxious, poor sleep. Physical tests normal.",
    findings: [
      { q: "I lose dhatu in my urine. That is why I am weak", a: "overvalued", o: ["persecutory", "nihilistic", "obsession"], close: ["nihilistic"], why: "A belief shared in his culture (Dhat syndrome), emotionally charged and dominating, but open to doubt ('maybe it is the stress'): an overvalued idea, not a delusion." },
      { q: "Tired, anxious, poor sleep", a: "anxiousaffect", o: ["flat", "elatedaffect", "incongruent"], why: "Visible tension: anxious affect. Dhat syndrome often sits alongside anxiety and depression, so screen for both." },
    ],
  },
  {
    id: "m27",
    level: 3,
    who: "Mr Kapoor, 48, businessman",
    place: "Psychiatry OPD, Chandigarh",
    skill: DIFF,
    lines: [
      ["P", "My wife is having an affair. The proof? She hung the towel on the left side. And the neighbour's car was parked facing our gate."],
      ["D", "Is there anything that could change your mind?"],
      ["P", "Nothing. I've hired a detective. I check her phone every night."],
    ],
    note: "Calm, certain. Wife denies; no evidence after six months of checking.",
    findings: [
      { q: "She hung the towel on the left side.", a: "jealousy", o: ["overvalued", "reference", "obsession"], close: ["overvalued"], why: "A fixed belief of infidelity 'proved' by trivial signs, unshakeable despite evidence: a delusion of jealousy (Othello syndrome). Ask about risk to the wife: this belief carries a real risk of violence." },
      { q: "I check her phone every night.", a: "poorjudgement", o: ["compulsion", "guarded", "partialinsight"], close: ["compulsion"], why: "Hiring a detective and nightly checking driven by a delusion show impaired judgement and growing risk." },
    ],
  },
  {
    id: "m28",
    level: 3,
    who: "Ayesha, 34, bank officer",
    place: "Trauma clinic, Srinagar",
    skill: DIFF,
    lines: [
      ["P", "And then they took my brother away and we never saw him again."],
      ["D", "I'm sorry. I noticed you smiled as you said that."],
      ["P", "(looks down) I'm sorry, I don't know why I do that. It's easier than crying here."],
    ],
    note: "Compare: Manoj, 40, on the ward, laughs loudly while describing being 'tortured by electric wires every night', and sees nothing odd about laughing.",
    findings: [
      { q: "It's easier than crying here.", a: "embarrassed", o: ["incongruent", "labile", "elatedaffect"], close: ["incongruent"], why: "An anxious, social smile while telling something painful, which she notices and explains, is not incongruity (Fish warns about this exact mix-up)." },
      { q: "laughs loudly while describing being 'tortured by electric wires every night', and sees nothing odd about laughing", a: "incongruent", o: ["embarrassed", "elatedaffect", "labile"], close: ["embarrassed"], why: "Laughter that does not fit a frightening content, and the person is unaware of it: incongruent affect, characteristic of schizophrenia." },
    ],
  },
  {
    id: "m29",
    level: 3,
    who: "Mr Singh, 55, in hospital for 20 years",
    place: "Long-stay unit, Amritsar",
    skill: DIFF,
    lines: [
      ["D", "Your brother has come all the way from Canada to see you."],
      ["P", "Okay."],
      ["D", "How do you feel about that?"],
      ["P", "Okay."],
    ],
    note: "Face still throughout, voice monotone. No sign of pleasure, sadness or irritation, even at the news.",
    findings: [
      { q: "Face still throughout, voice monotone. No sign of pleasure, sadness or irritation", a: "flat", o: ["blunted", "restricted", "pmr"], close: ["blunted"], why: "Almost no expression in any direction, even for big news: flat affect (the severe end, beyond blunting). Blunting leaves a little response in the right direction." },
      { q: "Okay.", a: "poverty", o: ["mutism", "latency", "perseveration"], close: ["perseveration"], why: "One-word replies with nothing added: poverty of speech (alogia), a negative symptom." },
    ],
  },
  {
    id: "m30",
    level: 3,
    who: "Karan, 28, IT analyst",
    place: "Early psychosis clinic, Hyderabad",
    skill: DIFF,
    lines: [
      ["P", "I was at the tea stall. The man put the glass down on the counter, upside down. That's when I knew: I've been chosen to lead the new religion."],
      ["D", "How did the glass tell you that?"],
      ["P", "It didn't tell me. I just knew. Instantly."],
    ],
    note: "The glass was real; others saw it. No link between it and the belief.",
    findings: [
      { q: "The man put the glass down on the counter, upside down. That's when I knew", a: "delperception", o: ["reference", "illusion", "vh"], close: ["reference"], why: "A real, normal perception (the glass) suddenly carries a new private meaning with no understandable link: delusional perception, a first-rank symptom. Reference would be 'the glass was a message meant for me'." },
      { q: "I've been chosen to lead the new religion.", a: "grandiose", o: ["overvalued", "guilt", "passivity"], why: "A fixed belief of a special mission: grandiose content." },
    ],
  },
  {
    id: "m31",
    level: 3,
    who: "Mrs Davies, 81, widow",
    place: "Care home visit, Cardiff",
    skill: DIFF,
    lines: [
      ["D", "Who is this lady with you?"],
      ["P", "My mother, of course. Mam, tell him."],
      ["R", "(It is her daughter. An hour later Mrs Davies recognises her and chats normally.)"],
    ],
    note: "Started three days ago. New urinary catheter; slight fever. Staff say she was 'herself' last week.",
    findings: [
      { q: "An hour later Mrs Davies recognises her and chats normally.", a: "clouding", o: ["recentmem", "confabulation", "oriented"], close: ["recentmem"], why: "Sudden onset, then fluctuation within the hour: clouded, fluctuating consciousness, which points to delirium (look at that fever and catheter), not dementia alone." },
      { q: "My mother, of course.", a: "disoriented", o: ["confabulation", "nihilistic", "illusion"], close: ["confabulation"], why: "Wrong about who a person is: disoriented to person. A transient muddle in delirium, not a fixed false story." },
    ],
  },
  {
    id: "m32",
    level: 3,
    who: "Vikram, 24, law student",
    place: "Psychology clinic, Mumbai",
    skill: DIFF,
    lines: [
      ["P", "I feel like I'm watching myself from outside, like a robot doing things. My hands don't feel like mine."],
      ["D", "Are you a robot?"],
      ["P", "No, of course not. It's just how it feels. It scares me."],
    ],
    note: "Compare m20: Mr Banerjee believed literally that his insides had rotted away.",
    findings: [
      { q: "I feel like I'm watching myself from outside, like a robot doing things.", a: "depersonalisation", o: ["nihilistic", "passivity", "derealisation"], close: ["passivity"], why: "An 'as if' feeling of being unreal or detached from self, with insight kept: depersonalisation. In made actions (passivity) the person believes an outside force really moves them." },
      { q: "No, of course not. It's just how it feels.", a: "fullinsight", o: ["noinsight", "partialinsight", "poorjudgement"], why: "He knows it is a feeling, not reality. That insight is what separates depersonalisation from a nihilistic delusion." },
    ],
  },
  {
    id: "m33",
    level: 3,
    who: "Ravi, 31, auto driver",
    place: "Follow-up OPD, Nagpur, after a manic episode",
    skill: DIFF,
    lines: [
      ["P", "Yes, I was ill. I was too high last year, that much I agree."],
      ["D", "And the lithium?"],
      ["P", "I stopped it. I don't need tablets; I'm strong now. I'll just sleep properly."],
    ],
    note: "Euthymic today. Stopped lithium two weeks ago without telling anyone; drives 12 hours a day.",
    findings: [
      { q: "I don't need tablets; I'm strong now.", a: "partialinsight", o: ["fullinsight", "noinsight", "poorjudgement"], close: ["noinsight"], why: "He accepts he was ill but rejects treatment: partial insight. Stopping lithium suddenly also raises relapse risk, so work with him on this." },
      { q: "Stopped lithium two weeks ago without telling anyone", a: "poorjudgement", o: ["fullinsight", "compulsion", "guarded"], why: "An abrupt, secret stop of a mood stabiliser puts him at risk of rebound mania: impaired judgement about his own care." },
    ],
  },
  {
    id: "m34",
    level: 3,
    who: "Ms Okafor, 36, events planner",
    place: "Mood clinic, London",
    skill: DIFF,
    lines: [
      ["D", "How was the weekend?"],
      ["P", "Busy! Three weddings, oh, and the florist was late, which reminded me, I must change my number, anyway the weddings, all went brilliantly, I'm on top form."],
    ],
    note: "Quick and lively, a bit hard to interrupt but returns to the question by herself. Sleeping five hours and not tired.",
    findings: [
      { q: "which reminded me, I must change my number, anyway the weddings, all went brilliantly", a: "prolixity", o: ["circumstantial", "foi", "tangential"], close: ["foi", "circumstantial"], why: "Lively, quick side-trips that come back to the goal within moments: prolixity (ordered flight of ideas), seen in hypomania. Circumstantiality is slow, tedious detail, not lively embellishment." },
      { q: "I'm on top form.", a: "elated", o: ["euthymic", "irritable", "anxiousmood"], close: ["euthymic"], why: "In her words she's on top form, with less need for sleep: elated mood. Explore for hypomania." },
    ],
  },
];

export function excerptById(id: string): Excerpt | undefined {
  return EXCERPTS.find((e) => e.id === id);
}
