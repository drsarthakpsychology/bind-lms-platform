import type { DailyCase, GuideHints, Opening } from "./types";

/**
 * The free starting picture and the three guided hints for every written
 * Daily case (owner, 22 Nov 2026: "give a good amount of free information
 * with each case and specific hints that lead students the way we want them
 * to think").
 *
 * Opening: who, the complaint in their or the family's words, how long, and
 * 2 or 3 things anyone would notice. It never holds the deciding detail.
 * Hints: 1 the area to think in, 2 the key detail and why it matters,
 * 3 narrow the choice to two or three names. Hints 1 and 2 never name the
 * answer (checked in openings.test.ts).
 */
type Entry = [who: string, says: string, since: string, seen: string[], hints: GuideHints];

const E: Record<string, Entry> = {
  "dc-001": [
    "Meera, 34, a school teacher",
    "I have no energy for anything. I've taken leave from work.",
    "About six weeks",
    ["Speaks slowly and looks tired", "Has stopped her evening walks", "Her husband says she cries most evenings"],
    [
      "Think of the mood disorders where low mood is the main problem.",
      "How long it has lasted matters: six weeks is enough for one kind of low mood episode, but far too short for the long-lasting kind, which needs two years.",
      "Choose between major depressive disorder, persistent depressive disorder and bipolar II. Ask whether she has ever had a high spell.",
    ],
  ],
  "dc-002": [
    "Rohit, 41, an accountant",
    "My wife says I'm never happy. I've always been like this, it's just my nature.",
    "Since his early thirties",
    ["Mood 'so-so', but works every day", "Tired, sleeps a lot at weekends", "No thoughts of self-harm"],
    [
      "Stay with the low mood disorders, and think about how long each one must last.",
      "He calls it his nature: a milder low mood on most days for years, with no two good months in a row, is the key.",
      "Choose between major depressive disorder, persistent depressive disorder and cyclothymic disorder. Has he ever had five symptoms together, or a high?",
    ],
  ],
  "dc-003": [
    "Arjun, 23, a final-year student, brought by his parents at 2 a.m.",
    "He hardly sleeps and says he has never felt better.",
    "About ten days",
    ["Talks fast and is hard to interrupt", "Has spent ₹2 lakh on a business idea", "Angry when his father took his debit card"],
    [
      "Think of the mood disorders that have high spells, not only low ones.",
      "Count the days and the harm: a high that lasts a week or more, or causes serious trouble, crosses the line that matters most here.",
      "Choose between bipolar I, bipolar II and a drug-induced psychosis. Check the drug screen and how severe the high is.",
    ],
  ],
  "dc-004": [
    "Priya, 29, a designer, referred by her family doctor",
    "This is my third depression in five years. The tablets worked for a week, then made me jittery.",
    "Low spells of about two months each, over five years",
    ["Low and tearful today", "Two antidepressants made her jittery", "Kept working through every episode"],
    [
      "Repeated depressions that react badly to antidepressants: think beyond plain depression.",
      "Ask about the opposite pole. Short spells of little sleep and lots of energy change the diagnosis, and how many days they lasted decides which one.",
      "Choose between major depressive disorder, bipolar I and bipolar II. Did her 'good' spells last 4 days or 7, and did they cause serious trouble?",
    ],
  ],
  "dc-005": [
    "Sohini, 26, a journalist",
    "My friends call me moody. Some weeks I'm buzzing, some weeks I'm flat.",
    "About three years",
    ["Her ups last two or three days", "Still works and eats normally in the downs", "Calm and well today"],
    [
      "Mood goes both up and down: think of the mood disorders with two poles.",
      "Check whether any up or down ever reaches a full episode. Here none does, yet the swings have gone on for years with hardly a break.",
      "Choose between bipolar II, persistent depressive disorder and cyclothymic disorder.",
    ],
  ],
  "dc-006": [
    "Kavitha, 27, a software tester",
    "Some days I turn into another person. Then I'm fine again.",
    "About a year",
    ["Snaps at her team and cries easily on bad days", "Bloating, poor sleep and sweet cravings", "Her partner says she is fine most weeks"],
    [
      "Low mood that comes and goes on a schedule: think about what sets the schedule.",
      "Timing is the key: the symptoms start in the week before her period and are gone in the week after it.",
      "Choose between major depressive disorder, premenstrual dysphoric disorder and bipolar II.",
    ],
  ],
  "dc-007": [
    "Lakshmi, 52, a homemaker, referred from the medical OPD",
    "I feel dull and sad all the time.",
    "About four months",
    ["Tired, has left her bhajan group", "Has gained 6 kg", "Moves and speaks slowly"],
    [
      "Before calling it a primary low mood, look for a body cause.",
      "Weight gain, feeling cold, dry skin and a hoarse voice all point to one gland, and her past operation on it matters.",
      "Choose between major depressive disorder and depressive disorder due to another medical condition. What do her blood tests show?",
    ],
  ],
  "dc-008": [
    "Kabir, 9, referred by his school",
    "He has anger problems. He throws things over tiny things like losing a game.",
    "Since about age 7",
    ["Big outbursts about four times a week", "Happens at home and at school", "Scowls and gives short answers in the room"],
    [
      "A child with big outbursts: think of the mood disorders of childhood as well as behaviour problems.",
      "Look at his mood between the outbursts: cross and irritable most of the day, nearly every day, is what separates this from plain defiance or temper.",
      "Choose between oppositional defiant disorder, intermittent explosive disorder and disruptive mood dysregulation disorder.",
    ],
  ],
  "dc-009": [
    "Imran, 31, a call-centre manager",
    "My heart races and I think I'm dying.",
    "About two months",
    ["Three emergency visits; every heart test normal", "Shakes, sweats and his hands tingle in the attacks", "Checks his pulse all day"],
    [
      "Think of the anxiety disorders, where the body's alarm goes off.",
      "The attacks come out of nowhere, even while watching TV, and now he worries about the next one: unexpected attacks plus worry about them is the key.",
      "Choose between panic disorder, generalised anxiety disorder and agoraphobia.",
    ],
  ],
  "dc-010": [
    "Anita, 45, a homemaker, seen by her family doctor",
    "My mind never switches off.",
    "Most days for over a year",
    ["Worries about her children, money, her mother and the car", "Tense shoulders, tired and irritable", "Sleeps badly"],
    [
      "Think of the anxiety disorders.",
      "The worry spreads over many everyday things, on most days, for more than six months, with no sudden attacks and no rituals.",
      "Choose between generalised anxiety disorder, panic disorder and OCD.",
    ],
  ],
  "dc-011": [
    "Yash, 19, an engineering student",
    "I freeze in vivas. My written marks are fine.",
    "Since Class 9, about five years",
    ["Failing his practical exams", "Eats lunch alone in his hostel room", "Goes red and quiet when asked a question"],
    [
      "Think of the anxiety disorders tied to particular situations.",
      "Ask what he fears will happen: being judged or looking stupid in front of others is the core, and he is relaxed with close friends.",
      "Choose between social anxiety disorder, avoidant personality disorder and panic disorder.",
    ],
  ],
  "dc-012": [
    "Aisha, 8, brought by her mother",
    "She gets a stomach ache every school morning.",
    "About six weeks",
    ["The pain goes by mid-morning if she stays home", "The family moved house; her father now works in another city", "Clings to her mother at the school gate"],
    [
      "Body pain with no body cause in a child: think of the anxiety disorders.",
      "Ask what she is afraid of: her nightmares and lunch-time phone calls are about something happening to her mother.",
      "Choose between separation anxiety disorder, social anxiety disorder and somatic symptom disorder.",
    ],
  ],
  "dc-013": [
    "Claire, 38, seen at home",
    "I haven't been out on my own for months. My sister does my shopping.",
    "About eight months",
    ["Supermarkets, buses and busy streets all frighten her", "Can manage a short drive if her sister comes", "Fine inside her own home"],
    [
      "Think of the anxiety disorders where people avoid places.",
      "She fears feeling faint and not being able to get out or get help, in many kinds of places, and it eases with a companion.",
      "Choose between agoraphobia, panic disorder and specific phobia.",
    ],
  ],
  "dc-014": [
    "Nidhi, 24, a law graduate",
    "I know it's too much, but if I don't wash I feel terrible.",
    "Since her second year of college",
    ["Cracked, bleeding hands", "Washes her hands 40 to 50 times a day", "Makes the family change clothes at the door"],
    [
      "Repeated acts done to calm a fear: think of that group of disorders.",
      "She sees the thoughts as her own and unwanted, and the washing is to stop harm coming to her family.",
      "Choose between OCD, obsessive-compulsive personality disorder and illness anxiety disorder.",
    ],
  ],
  "dc-015": [
    "Rehan, 22, referred by a skin doctor",
    "My nose is crooked and huge. People stare at it.",
    "About a year",
    ["Has seen four skin doctors", "Doctors and family say his nose looks normal", "Has dropped out of college"],
    [
      "A fixed worry about looks: think of the group of disorders related to OCD.",
      "What others see matters: no one else can see the 'defect', yet he checks and compares it for hours.",
      "Choose between body dysmorphic disorder, social anxiety disorder and delusional disorder.",
    ],
  ],
  "dc-016": [
    "Thomas, 67, a retired clerk, visited after neighbours complained of a smell",
    "I might need them. Throwing them away feels like losing part of me.",
    "Many years; much worse since his wife died",
    ["Every room stacked with papers, bags and broken appliances", "He can't use his kitchen", "Very upset when his son tried to clear up"],
    [
      "Think of the group of disorders related to OCD, and make sure memory is not the problem.",
      "The core problem is letting go, not collecting: throwing things away causes real distress, and his memory and bill-paying are fine.",
      "Choose between hoarding disorder, OCD and Alzheimer's disease.",
    ],
  ],
  "dc-017": [
    "Sunil, 36, a bus conductor",
    "I see the crash every night.",
    "About four months since a highway crash",
    ["Two passengers died in the crash", "Won't board any bus", "Jumps at small sounds"],
    [
      "After a frightening event: think of the trauma and stress-related disorders.",
      "Time since the event decides it: more than a month of reliving, avoiding and being on edge.",
      "Choose between acute stress disorder, PTSD and adjustment disorder.",
    ],
  ],
  "dc-018": [
    "Anjali, 28, in a flood relief camp",
    "When I close my eyes I see the water rising.",
    "Twelve days since she was rescued from her roof",
    ["Says she feels as if she is watching herself in a film", "Jumps at the sound of rain", "Can't remember how she got to the boat"],
    [
      "After a frightening event: think of the trauma and stress-related disorders.",
      "Count the days: under a month after the event is a different diagnosis from over a month.",
      "Choose between PTSD, acute stress disorder and dissociative amnesia.",
    ],
  ],
  "dc-019": [
    "Varun, 30, an IT professional",
    "Since the layoff email I just feel hopeless.",
    "Five weeks since he lost his job",
    ["Tearful and sleeping badly", "Still eats normally and plays cricket with friends", "No thoughts of self-harm"],
    [
      "Low mood after a clear stressor: think of the stress-related disorders as well as depression.",
      "Count his symptoms: he does not reach the full depression threshold, but his distress is more than the stressor would usually cause.",
      "Choose between major depressive disorder, adjustment disorder and generalised anxiety disorder.",
    ],
  ],
  "dc-020": [
    "Savitri, 61, brought by her daughter",
    "She has stopped living since my father died.",
    "14 months since her husband's sudden death",
    ["Talks to his photo for hours", "Avoids the temple and relatives", "Still enjoys her grandson's visits"],
    [
      "After a death: think of the trauma and stress-related group, not only depression.",
      "The main feeling is longing for him, not general sadness, and it is over a year and getting worse.",
      "Choose between major depressive disorder, prolonged grief disorder and PTSD.",
    ],
  ],
  "dc-021": [
    "Ravi, 22, a college student, brought by his parents",
    "He has stopped going to college and talks to the wall.",
    "Changes began about nine months ago",
    ["Rarely leaves his room", "Smiles to himself", "Speaks little and shows almost no emotion"],
    [
      "Voices and odd beliefs: think of the psychotic disorders.",
      "Add up all the time since the first change, including the quiet early months: the total length decides the name.",
      "Choose between schizophreniform disorder, schizophrenia and schizoaffective disorder.",
    ],
  ],
  "dc-022": [
    "Harpreet, 30, brought by her husband",
    "She says people are poisoning her food. She was completely normal before her father died.",
    "Five days",
    ["Frightened and confused", "Hears her father's voice", "Speech comes in bursts that are hard to follow"],
    [
      "Sudden psychosis: think of the psychotic disorders, and rule out a body cause.",
      "Watch how long it lasts from first symptom to full recovery: under a month is a different diagnosis from one to six months.",
      "Choose between brief psychotic disorder, schizophreniform disorder and delirium.",
    ],
  ],
  "dc-023": [
    "Daniel, 35, at an outpatient follow-up",
    "The voices call me evil.",
    "Ill for about eight years, with three hospital stays",
    ["Each stay came during a severe low", "Believes his church is spying on him", "Mood normal today"],
    [
      "Psychosis and mood episodes in the same person: think of where those two meet.",
      "Ask whether the psychosis ever runs on without a mood episode. Here it does, for weeks, while mood episodes still fill most of the illness.",
      "Choose between major depressive disorder with psychotic features, schizophrenia and schizoaffective disorder.",
    ],
  ],
  "dc-024": [
    "Dinesh, 48, a jeweller, referred by the family court",
    "I know she is having an affair with the neighbour.",
    "Over a year",
    ["Checks her phone and follows her to the market", "Runs his shop well", "Clear, orderly speech"],
    [
      "One fixed false belief: think of the psychotic disorders.",
      "Apart from this one belief he works well, has no voices and no muddled speech.",
      "Choose between delusional disorder, schizophrenia and paranoid personality disorder.",
    ],
  ],
  "dc-025": [
    "Chloe, 20, an art student",
    "The TV adverts were talking to me.",
    "Ill for about three months",
    ["Heard a voice commenting on what she did", "Jumbled speech; stopped washing", "Now improving with treatment"],
    [
      "Voices and odd beliefs: think of the psychotic disorders.",
      "The total length of the illness decides it: longer than one month but shorter than six.",
      "Choose between brief psychotic disorder, schizophreniform disorder and schizophrenia.",
    ],
  ],
  "dc-026": [
    "Riya, 21, seen in emergency after self-harm",
    "I can't bear the thought of being left.",
    "Since her mid-teens",
    ["Cut her forearm when her boyfriend didn't reply for an hour", "Her mood swings within hours", "Often feels empty"],
    [
      "A long-standing pattern across relationships: think of the personality disorders.",
      "Fear of being left, relationships that swing from 'perfect' to 'worthless', an unsure sense of self, and mood shifts lasting hours, not days.",
      "Choose between borderline personality disorder, bipolar II and histrionic personality disorder.",
    ],
  ],
  "dc-027": [
    "Gurpreet, 28, assessed in jail",
    "They should have been smarter.",
    "Fourth arrest; in trouble for years",
    ["Arrested for fraud and assault", "Has used several false names", "Calm and charming, shows no remorse"],
    [
      "A lifelong pattern of harming others: think of the personality disorders.",
      "Ask what he was like before age 15: the adult pattern only gets this name if serious conduct problems began in childhood.",
      "Choose between antisocial personality disorder, narcissistic personality disorder and conduct disorder.",
    ],
  ],
  "dc-028": [
    "Karthik, 30, a lab technician",
    "I want to marry, but I've never been close to anyone.",
    "Since his teens",
    ["Turned down a promotion to avoid leading meetings", "Sees himself as boring and inferior", "Avoids eye contact"],
    [
      "A long-standing pattern of how he relates to people: think of the personality disorders as well as anxiety.",
      "He wants closeness but fears rejection, and it shows in every part of life, not only when he has to perform.",
      "Choose between avoidant personality disorder, schizoid personality disorder and social anxiety disorder.",
    ],
  ],
  "dc-029": [
    "Mahesh, 44, a bank manager, with his wife",
    "Everything has to be done his way.",
    "Since they married",
    ["Shoes in rows, spices in order", "His reports are always late from rewriting", "Hasn't taken a holiday in six years"],
    [
      "A lifelong pattern of rigid habits: ask whether it is a problem of unwanted thoughts or of personality.",
      "He thinks his rules are right and has no unwanted intrusive thoughts: that is the key difference.",
      "Choose between OCD, obsessive-compulsive personality disorder and hoarding disorder.",
    ],
  ],
  "dc-030": [
    "Babu, 46, on a surgical ward the day after a gallbladder operation",
    "Let me go home.",
    "Started today",
    ["Shaky and sweating, pulse 118", "Hasn't slept", "Says he saw insects on the wall for a few minutes"],
    [
      "New shaking and sweating on a ward: think of substances, and what happens when they stop.",
      "Ask about his habits before admission: symptoms that start a day or two after stopping, while he still knows where he is, point one way.",
      "Choose between alcohol withdrawal, delirium and a substance-induced psychosis. Is he oriented?",
    ],
  ],
  "dc-031": [
    "Jaspreet, 25, at a de-addiction centre",
    "Give me something for the pain.",
    "Since this morning",
    ["Aches all over and has diarrhoea", "Runny eyes and nose, keeps yawning", "Wide pupils and goosebumps"],
    [
      "Think of substances, and what happens when they stop.",
      "Wide pupils, a runny nose, yawning, gut upset and goosebumps together are the classic picture of one drug group stopping.",
      "Choose between opioid withdrawal, alcohol withdrawal and cannabis withdrawal. What has he been injecting?",
    ],
  ],
  "dc-032": [
    "Aman, 19, brought by friends after a festival",
    "He thinks people on the ghats are plotting to kill him.",
    "Since the last week of the festival",
    ["Agitated, hears threatening voices", "No past psychiatric history", "His friends say he used a lot that week"],
    [
      "New psychosis in a young man: think of the psychotic disorders and what can cause them.",
      "Link the timing: it began with heavy use and ended within days of stopping.",
      "Choose between brief psychotic disorder, substance-induced psychotic disorder and schizophrenia.",
    ],
  ],
  "dc-033": [
    "Nikhil, 32, a sales executive, online consultation",
    "I'll win it back tomorrow.",
    "Many months, with growing debts",
    ["Bets on cricket apps every night", "Has borrowed ₹6 lakh from colleagues", "Lies to his wife about the money"],
    [
      "Think of the addictions, including ones without a drug.",
      "Count the signs: raising stakes for the same thrill, chasing losses, failed attempts to stop, restlessness when stopping, and lying.",
      "Choose between gambling disorder, bipolar I and antisocial personality disorder. Has he had high spells?",
    ],
  ],
  "dc-034": [
    "Ian, 58, on a medical ward after a fall",
    "Yesterday I went to the races.",
    "Admitted a month ago",
    ["Has drunk heavily for 30 years", "Can't remember the nurse's name five minutes later", "Alert and polite"],
    [
      "Memory problems in a long-term heavy drinker: think of the brain disorders linked to alcohol.",
      "What happened a month ago matters (confusion, unsteadiness, odd eye movements), and he fills the gaps in new memory with made-up stories.",
      "Choose between delirium, Alzheimer's disease and Korsakoff's syndrome.",
    ],
  ],
  "dc-035": [
    "Sandeep, 40, a grape farmer, at a primary health centre",
    "My stomach hurts and I feel weak.",
    "Drinking heavily for years",
    ["Drinks every evening", "Most mornings needs a drink to steady his hands", "His wife has gone to her parents' home"],
    [
      "Think of the substance use disorders.",
      "Count the problems in the last year: needing more, failed attempts to cut down, morning drinks, missed work, and drinking despite the liver warning.",
      "Choose between alcohol use disorder, alcohol withdrawal and major depressive disorder.",
    ],
  ],
  "dc-036": [
    "Kamla, 78, on a geriatric ward",
    "She was sharp last week. She does her own accounts.",
    "Overnight",
    ["Dozes, then wakes and pulls at her drip", "Drifts off in the middle of an answer", "Fever and burning urine for two days"],
    [
      "Sudden confusion in an older person: think of the brain disorders, and which ones come on fast.",
      "How fast it started and whether it changes through the day: overnight onset, poor attention, and worse in the evening.",
      "Choose between delirium, Alzheimer's disease and Lewy body disease.",
    ],
  ],
  "dc-037": [
    "Natarajan, 74, a retired headmaster, at a memory clinic",
    "He keeps asking the same questions.",
    "About three years, slowly worse",
    ["Got lost coming back from his usual temple", "Struggles to find words and with his pension forms", "Alert, no tremor"],
    [
      "Slow memory loss in an older person: think of the major memory disorders.",
      "Recent memory went first, and the course is slow and steady, not in sudden steps.",
      "Choose between Alzheimer's disease, vascular dementia and mild neurocognitive disorder. Can he still manage daily tasks alone?",
    ],
  ],
  "dc-038": [
    "Patrick, 71, a retired engineer",
    "Some days he's sharp, other days I can't reach him.",
    "About two years",
    ["Sees small, detailed people on the sofa who aren't there", "His walking has become slow and shuffling", "More forgetful than before"],
    [
      "Memory trouble in an older man: think of the different types of dementia.",
      "Look at the nights and the medicines: he acts out his dreams, and a small antipsychotic dose made him very stiff and confused.",
      "Choose between Alzheimer's disease, Lewy body disease and delirium.",
    ],
  ],
  "dc-039": [
    "Shobha, 57, a bank officer",
    "She has become a different person.",
    "About two years",
    ["Suspended for crude jokes to customers", "Shows no embarrassment; stopped caring about her children's problems", "Eats sweets compulsively"],
    [
      "Personality change in her fifties: think of the dementias, not only mood.",
      "Behaviour and personality changed first, while memory and finding her way around are fairly good.",
      "Choose between Alzheimer's disease, frontotemporal dementia and bipolar I.",
    ],
  ],
  "dc-040": [
    "Tanya, 16, brought by her parents",
    "She barely eats.",
    "About six months",
    ["Has lost 9 kg; BMI 15", "Runs every evening and counts every calorie", "Feels cold all the time"],
    [
      "Think of the eating disorders.",
      "Very low weight, plus a fear of gaining weight and seeing her body as bigger than it is.",
      "Choose between anorexia nervosa, bulimia nervosa and ARFID.",
    ],
  ],
  "dc-041": [
    "Sneha, 20, sent by her dentist",
    "Her tooth enamel is badly worn.",
    "About a year",
    ["Weight in the normal range", "Swollen glands at the angle of the jaw", "In the bathroom for a long time after dinner"],
    [
      "Worn teeth and swollen jaw glands: think of the eating disorders.",
      "Look at what happens after she eats a large amount, and at her weight: normal weight with vomiting afterwards is the key.",
      "Choose between anorexia nervosa, bulimia nervosa and binge-eating disorder.",
    ],
  ],
  "dc-042": [
    "Aarav, 10, at a children's nutrition clinic",
    "He would eat more if it were only rice.",
    "Weight falling for two years",
    ["Dropped from the 50th to the 10th centile", "Eats only plain rice, one biscuit and milk", "Gags at mixed textures"],
    [
      "A child who eats very little: think of the eating disorders, and why he avoids food.",
      "Why he avoids food is the key: fear of choking and dislike of textures, with no worry about his shape or weight.",
      "Choose between anorexia nervosa, ARFID and autism.",
    ],
  ],
  "dc-043": [
    "Vikram, 17, a Class 12 student",
    "I fall asleep in class even after 9 hours of sleep.",
    "About a year",
    ["Sleep attacks several times a day", "A short nap refreshes him", "Fell asleep standing up at a wedding"],
    [
      "Sleepiness by day despite enough sleep at night: think of the sleep disorders.",
      "Look at what happens when he laughs: his knees buckling while he stays awake is a very specific sign.",
      "Choose between obstructive sleep apnoea, narcolepsy and insomnia.",
    ],
  ],
  "dc-044": [
    "Prakash, 50, a textile trader",
    "I'm always tired. I nearly crashed my scooter at a signal.",
    "Many months",
    ["Dozes off at his shop counter", "Overweight, thick neck, high blood pressure", "Wakes with headaches and a dry mouth"],
    [
      "Sleepiness by day: think of the sleep disorders.",
      "Ask his wife what happens at night: very loud snoring and pauses in breathing.",
      "Choose between narcolepsy, obstructive sleep apnoea and insomnia.",
    ],
  ],
  "dc-045": [
    "António, 66, a retired teacher",
    "I was fighting off an attacker in my dream, and I hit my wife.",
    "Every few weeks for two years",
    ["Happens in the second half of the night", "Alert straight away when woken", "Remembers the dream clearly"],
    [
      "Movements during sleep: think of the sleep disorders.",
      "When in the night and how alert he is on waking: late-night episodes with a clear dream to tell point to dream sleep.",
      "Choose between sleepwalking or night terrors, REM sleep behaviour disorder and Lewy body disease.",
    ],
  ],
  "dc-046": [
    "Dev, 8, referred by his school",
    "He can't sit still in class.",
    "Since about age 4",
    ["Leaves his seat and blurts out answers", "Loses things and rarely finishes homework", "The same at home, at his grandparents' and at tuition"],
    [
      "A restless child: think of the disorders of development.",
      "Many settings, since early childhood, with both poor attention and restlessness.",
      "Choose between ADHD, oppositional defiant disorder and a specific learning disorder.",
    ],
  ],
  "dc-047": [
    "Yuvan, 3, brought by his family",
    "He doesn't answer to his name.",
    "Since about 18 months, when he lost his few words",
    ["Rarely looks at faces or points to show things", "Lines up his toy cars and gets upset if they are moved", "Flaps his hands when excited"],
    [
      "A toddler with late speech: think of the disorders of development.",
      "Look for both groups of signs: trouble with social communication, and repeated behaviour or strong reactions to sounds and foods.",
      "Choose between autism, intellectual disability and selective mutism.",
    ],
  ],
  "dc-048": [
    "Ibarisha, 6, seen by the school counsellor",
    "She hasn't said a word at school.",
    "Four months, since starting Class 1",
    ["Nods and points to answer the teacher", "Freezes when visitors speak to her", "Her mother says she chats and sings at home"],
    [
      "A child who doesn't speak in some places: think of the anxiety disorders and of development.",
      "Where she speaks and where she doesn't: normal speech at home, none at school.",
      "Choose between selective mutism, autism and social anxiety disorder.",
    ],
  ],
  "dc-049": [
    "Sameer, 14, referred by the juvenile justice board",
    "He was caught breaking into a shop.",
    "Over the past year",
    ["Steals, bunks school, stays out all night", "Hurt another boy badly with a cricket bat", "Shows little guilt"],
    [
      "Rule-breaking in a teenager: think of the behaviour disorders of childhood.",
      "How serious it is (cruelty, a weapon, theft, break-ins) and his age: under 18 matters for the name.",
      "Choose between oppositional defiant disorder, conduct disorder and antisocial personality disorder.",
    ],
  ],
  "dc-050": [
    "Omar, 11, at a children's neurology clinic",
    "One month it's blinking, then it's throat clearing.",
    "Since age 7",
    ["Blinks hard and jerks his head", "Sniffs and makes little barking sounds", "Feels an urge build up before each one"],
    [
      "Sudden repeated movements and sounds: think of the tic disorders.",
      "Both movements and sounds, coming and going for more than a year.",
      "Choose between Tourette's disorder, OCD and functional neurological disorder.",
    ],
  ],
  "dc-051": [
    "Pooja, 19, at a district hospital",
    "She has had four fits this month.",
    "This month",
    ["Shakes side to side with her eyes tightly shut", "Each episode lasts 10 to 20 minutes", "Never bites her tongue or wets herself"],
    [
      "Fits with unusual features: think of the disorders where body symptoms have no medical cause.",
      "The features of the attacks and a normal EEG during one, plus their link to stress about her engagement.",
      "Choose between functional neurological disorder, factitious disorder and somatic symptom disorder. Is she producing the fits on purpose?",
    ],
  ],
  "dc-052": [
    "Wei Ming, 36, at a polyclinic",
    "I'm sure I have a brain tumour.",
    "About a year",
    ["Two normal MRI scans", "Checks his pupils in the mirror every day", "Relief after each test lasts only days"],
    [
      "Worry about health: think of the group of disorders built around body symptoms and health fears.",
      "Does he actually have symptoms? He doesn't, and that decides between the two health worry diagnoses.",
      "Choose between somatic symptom disorder, illness anxiety disorder and OCD.",
    ],
  ],
  "dc-053": [
    "Emma, 29, a healthcare assistant, on an infectious diseases ward",
    "I keep getting these fevers.",
    "Five admissions in a year",
    ["Fever only when she takes the reading herself", "Her skin abscesses grow gut bacteria", "Knows medical terms well"],
    [
      "Illness with no clear medical cause: think of the group built around body symptoms.",
      "How are the signs being made, and who gains? No money, court case or leave is at stake.",
      "Choose between factitious disorder, somatic symptom disorder and malingering.",
    ],
  ],
  "dc-054": [
    "Fatima, 23, at a college clinic",
    "It's as if I'm watching my life through glass.",
    "Most days for nine months",
    ["Her hands feel as if they aren't hers", "The world looks flat and dreamlike", "Worse when stressed"],
    [
      "Feeling unreal: think of the dissociative disorders.",
      "Does she believe it is real? She knows it isn't: her sense of what is real is intact.",
      "Choose between depersonalisation-derealisation disorder, schizophrenia and panic disorder.",
    ],
  ],
  "dc-055": [
    "A man of about 35, brought by railway police",
    "He can't tell us his name or where he lives.",
    "Found today; his train ticket was bought two days ago",
    ["Calm and well dressed", "Can read, use a phone and count money", "His ticket is from Nagpur"],
    [
      "Lost memory with everyday skills intact: think of the dissociative disorders, after ruling out a brain cause.",
      "What kind of memory is lost (who he is, not how to do things), and what happened just before he left.",
      "Choose between dissociative amnesia, delirium and dissociative identity disorder.",
    ],
  ],
};

export function openingFor(id: string): { opening: Opening; guide: GuideHints } | null {
  const e = E[id];
  if (!e) return null;
  const [who, says, since, seen, hints] = e;
  return { opening: { who, says, since, seen }, guide: hints };
}

export const OPENING_IDS = Object.keys(E);

/** Adds the opening and the three hints to a written case (leaves anything already set). */
export function withOpening(c: DailyCase): DailyCase {
  const o = openingFor(c.id);
  if (!o) return c;
  return { ...c, opening: c.opening ?? o.opening, guide: c.guide ?? o.guide };
}
