/**
 * Ward Week campaigns, set F: a farmer after pesticide poisoning, school
 * refusal, benzodiazepine dependence, bipolar depression, a migrant worker
 * abroad and neuroleptic malignant syndrome. Original teaching stories; the
 * player is a trainee psychologist on the team.
 */
import type { Campaign } from "./engine";
import { o, tags } from "./kit";

/* ------------------------------------------------------------ Yavatmal */
const yavatmal: Campaign = {
  id: "yavatmal",
  tags: tags("Suicide attempt by pesticide in a farmer", "suicide", "Assess a man after a pesticide attempt, use the law's protection, restrict means and address debt and depression."),
  title: "After the poison",
  patient: "Shankar, 48, cotton farmer",
  place: "Medical ICU, district hospital, Yavatmal",
  blurb: "He drank an insecticide in his field after the second crop failure. A neighbour found him. He is off the ventilator now and won't meet anyone's eyes.",
  start: { risk: 75, trust: 25, insight: 20, family: 40, adherence: 35 },
  chapters: [
    {
      id: "yv1",
      title: "Session 1 · The ICU bed",
      beats: [
        { text: "Shankar whispers: 'The bank loan, the moneylender, the seeds. I failed my family. Will the police take me now?'" },
      ],
      decisions: [
        {
          id: "yv1a",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "How do you begin?",
          options: [
            o("a", "best", "Reassure him that under the Mental Healthcare Act a suicide attempt is treated as a sign of severe stress and is not prosecuted. Then ask gently about the attempt, whether he still wants to die and what has changed.", "Removing the fear of police makes honest talk possible. Current intent after an attempt is the key question.", { trust: 20, risk: -15 }, ["asked"]),
            o("b", "harm", "Tell him attempting suicide is a crime and he should be ashamed.", "This is wrong in law and adds shame, raising risk.", { trust: -25, risk: 15 }),
            o("c", "poor", "Wait to talk until he is home and calmer.", "The days after an attempt carry high risk; assessment can't wait.", { risk: 10 }),
          ],
        },
        {
          id: "yv1b",
          kind: "assessment",
          skill: "depression:criteria",
          when: { flag: "asked" },
          prompt: "He says he hasn't slept or eaten properly for months and feels worthless. What else do you check?",
          options: [
            o("a", "best", "A full depression assessment, alcohol use, past attempts, and family history of suicide, alongside his debts and supports.", "Depression and drinking often sit behind attempts; they are treatable even when the debt isn't solved at once.", { insight: 10, risk: -10 }),
            o("b", "poor", "Only his debts, as that is the real problem.", "Debt is a trigger; untreated depression keeps the risk high.", { risk: 5 }),
          ],
        },
      ],
    },
    {
      id: "yv2",
      title: "Session 2 · The family",
      beats: [
        { text: "His wife Kamal and his son come in. Kamal says, 'There is more of that bottle in the shed.'" },
      ],
      decisions: [
        {
          id: "yv2a",
          kind: "family",
          skill: "suicide:risk",
          prompt: "What do you plan with the family?",
          options: [
            o("a", "best", "Agree means safety: pesticides kept locked in a box away from the house, the key with Kamal, no stocks of tablets, and someone with Shankar for now. Talk about warning signs and who to call.", "Restricting access to pesticides is one of the most effective ways to prevent suicide in farming communities.", { risk: -20, family: 15 }, ["locked"]),
            o("b", "harm", "Say nothing about the shed; it's their property.", "Access to the same lethal means after an attempt is a major risk.", { risk: 20 }),
            o("c", "ok", "Tell them to watch him closely.", "Watching helps, but removing the means matters more.", { risk: -5, family: 5 }),
          ],
        },
      ],
    },
    {
      id: "yv3",
      title: "Session 3 · Help that exists",
      beats: [
        { text: "Shankar asks, 'What is the use of tablets if the loan is still there?'" },
      ],
      decisions: [
        {
          id: "yv3a",
          kind: "referral",
          skill: "suicide:apply",
          prompt: "What do you set up?",
          options: [
            o("a", "best", "Link the family with the hospital social worker for debt counselling and government farmer relief schemes, and with the district mental health programme for follow-up near home.", "Practical help with the trigger plus ongoing mental health care works better than either alone.", { trust: 15, adherence: 15, risk: -10 }, ["linked"]),
            o("b", "poor", "Tell him money problems are not a health matter.", "Ignoring the stressor makes treatment feel irrelevant to him.", { trust: -10 }),
          ],
        },
        {
          id: "yv3b",
          kind: "medicines",
          skill: "antidepressants:pharm",
          prompt: "He has moderate depression. What do you discuss with the psychiatrist?",
          options: [
            o("a", "best", "An antidepressant such as an SSRI, a small supply at a time held by Kamal, early review, and simple problem-solving sessions.", "SSRIs are safer in overdose than older antidepressants; limited supplies reduce risk.", { adherence: 10, risk: -10 }),
            o("b", "harm", "A tricyclic, three months' supply, to save trips to town.", "Tricyclics are dangerous in overdose and a large supply is a means of harm.", { risk: 25 }),
          ],
        },
      ],
    },
    {
      id: "yv4",
      title: "Session 4 · Before the next season",
      beats: [
        { when: { flag: "linked" }, text: "The relief scheme has paid part of the loan. Shankar has joined a farmers' group that shares seeds." },
        { text: "Sowing season is coming, the hardest time last year." },
      ],
      decisions: [
        {
          id: "yv4a",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "What do you put in his safety plan?",
          options: [
            o("a", "best", "His warning signs (not sleeping, drinking, staying in the field alone), reasons for living, people to call, Tele-MANAS (14416), and a follow-up visit booked before sowing.", "A plan tied to his own high-risk times keeps help close when it matters.", { risk: -15, insight: 15, adherence: 10 }),
            o("b", "poor", "Ask him to promise he won't try again.", "No-harm promises don't prevent suicide.", { risk: 5 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Green shoots", text: "The rains come on time. Shankar keeps the pesticide box locked and the key with Kamal. He visits the clinic each month and talks at the farmers' group." },
    { min: 50, title: "Getting through", text: "Shankar is safe but low; the debt still weighs on him. He comes to clinic when Kamal insists." },
    { min: 0, title: "A second attempt", text: "With the pesticide still in the shed, Shankar makes another attempt. He survives with lung damage." },
  ],
};

/* ------------------------------------------------------------ Mysuru */
const mysuru: Campaign = {
  id: "mysuru",
  tags: tags("School refusal with separation anxiety", "anxiety", "Assess school refusal and plan a graded return with parents and school.", 4),
  title: "The tummy ache",
  patient: "Meera, 10, class 5 student",
  place: "Child and adolescent clinic, Mysuru",
  blurb: "She has missed most of this term. Every morning she cries, gets a tummy ache and begs to stay home. Her grandmother died last year; her father travels for work.",
  start: { risk: 40, trust: 40, insight: 25, family: 35, adherence: 35 },
  chapters: [
    {
      id: "my1",
      title: "Session 1 · Clinging",
      beats: [
        { text: "Meera holds her mother's sari. 'What if something happens to Amma while I'm at school? Like Ajji.' Her paediatric check is normal." },
      ],
      decisions: [
        {
          id: "my1a",
          kind: "assessment",
          skill: "anxiety:criteria",
          prompt: "What do you assess?",
          options: [
            o("a", "best", "Her fears about separation, sleep away from her mother, grief for her grandmother, bullying or learning problems at school, and how the family responds on school mornings.", "School refusal has several drivers: separation fears, grief, social or learning problems. The morning routine at home often keeps it going.", { insight: 15, trust: 10 }, ["mapped"]),
            o("b", "poor", "Tell her mother she is just being lazy.", "Distress and body symptoms point to anxiety, not laziness.", { trust: -15, family: -5 }),
            o("c", "ok", "Order more stomach tests.", "Her check is normal; more tests reinforce the idea of illness.", { insight: -5 }),
          ],
        },
      ],
    },
    {
      id: "my2",
      title: "Session 2 · A plan for the mornings",
      beats: [
        { when: { flag: "mapped" }, text: "Meera fears her mother will die, like Ajji. School itself is fine; she likes her teacher." },
        { text: "Her mother says, 'When she cries I can't bear it. I let her stay, and we watch TV together.'" },
      ],
      decisions: [
        {
          id: "my2a",
          kind: "family",
          skill: "anxiety:apply",
          prompt: "What do you advise the parents?",
          options: [
            o("a", "best", "Explain how staying home brings relief now but makes the fear bigger. Plan a calm, brief goodbye, praise for bravery, and keep home on school days dull: no TV until school time is over.", "Accommodation keeps anxiety going. Warm but firm routines help children face fears.", { family: 20, insight: 10 }, ["routine"]),
            o("b", "harm", "Keep her home until she feels ready.", "Waiting usually makes return much harder.", { risk: 10, adherence: -10 }),
            o("c", "poor", "Drag her to school however much she screams.", "Forcing without a plan or support can deepen fear and break trust.", { trust: -15 }),
          ],
        },
        {
          id: "my2b",
          kind: "psychoeducation",
          skill: "anxiety:apply",
          prompt: "How do you explain anxiety to Meera?",
          options: [
            o("a", "best", "Use a story: 'Your worry is like a guard dog that barks too loudly. We'll teach it that school is safe.' Teach belly breathing and a brave-steps chart.", "Simple metaphors and concrete skills make CBT work for children.", { insight: 15, trust: 15 }),
            o("b", "poor", "Tell her there is nothing to be scared of.", "Dismissing the fear doesn't help her manage it.", { trust: -5 }),
          ],
        },
      ],
    },
    {
      id: "my3",
      title: "Session 3 · The school",
      beats: [
        { text: "Her class teacher, Mrs Rao, wants to help but has forty children." },
      ],
      decisions: [
        {
          id: "my3a",
          kind: "referral",
          skill: "anxiety:apply",
          prompt: "What return plan do you agree with the school?",
          options: [
            o("a", "best", "A graded return: first an hour in the library with a friendly teacher, then her own class for the morning, then the full day. A named adult to go to, and no punishment for the missed days.", "Graded exposure with school support works well for school refusal.", { adherence: 15, risk: -10 }, ["graded"]),
            o("b", "poor", "Full days from tomorrow, no special help.", "Too big a step often fails and confirms the fear.", { adherence: -10 }),
          ],
        },
        {
          id: "my3b",
          kind: "assessment",
          skill: "depression:apply",
          prompt: "Meera still often talks about her grandmother. What do you check?",
          options: [
            o("a", "best", "How she grieved: whether anyone talked with her about Ajji's death, and signs of low mood. Help the family share memories together.", "Unspoken grief can feed fears of losing other loved ones.", { insight: 10, family: 10 }),
            o("b", "poor", "Avoid the topic so she doesn't get upset.", "Silence leaves her alone with fears.", { insight: -5 }),
          ],
        },
      ],
    },
    {
      id: "my4",
      title: "Session 4 · Back in class",
      beats: [
        { when: { flag: "graded" }, text: "Meera has been at school every day lately, though she still checks her mother is at the gate at three." },
      ],
      decisions: [
        {
          id: "my4a",
          kind: "psychoeducation",
          skill: "anxiety:apply",
          prompt: "Her father asks about medicine 'to make it go away'. What do you say?",
          options: [
            o("a", "best", "CBT and the parent plan are the first treatment and are working. Medicine such as an SSRI is kept for severe anxiety that doesn't respond. Plan for setbacks after holidays.", "For most children with anxiety, psychological treatment comes first; holidays and illness often bring a dip.", { insight: 10, adherence: 10, risk: -5 }),
            o("b", "harm", "Suggest a sedative each morning to calm her.", "Sedatives for children's school anxiety are inappropriate and harmful.", { risk: 15 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "The school play", text: "Meera plays a tree in the school play and waves to both parents in the front row. After the holidays she has a wobble, and her mother sticks to the plan." },
    { min: 50, title: "Most days", text: "Meera goes to school most days, but mornings are still a battle." },
    { min: 0, title: "Home again", text: "Meera stays home for the rest of the year. Her fears grow, and now she won't visit friends either." },
  ],
};

/* ------------------------------------------------------------ Indore */
const indore: Campaign = {
  id: "indore",
  tags: tags("Benzodiazepine dependence and insomnia", "substance", "Plan a slow benzodiazepine taper and treat insomnia with CBT-I."),
  title: "Just one more tablet",
  patient: "Mrs Jain, 58, retired bank officer",
  place: "Psychiatry OPD, Indore",
  blurb: "Started alprazolam for sleep after her husband's heart surgery eight years ago. Now she takes four a day from different chemists and fell in the bathroom last month.",
  start: { risk: 55, trust: 40, insight: 25, family: 40, adherence: 35 },
  chapters: [
    {
      id: "in1",
      title: "Session 1 · The tablet strip",
      beats: [
        { text: "Mrs Jain shows you a strip. 'Without it I shake, my heart races and I can't sleep at all. But my memory is going, and I fell.'" },
      ],
      decisions: [
        {
          id: "in1a",
          kind: "assessment",
          skill: "substance:criteria",
          prompt: "What do you assess?",
          options: [
            o("a", "best", "The real daily dose and sources, withdrawal symptoms, any past fits, alcohol, falls and memory, and the anxiety or low mood behind the sleep problem.", "Benzodiazepine dependence in older adults brings falls and memory problems; knowing the dose and fit risk guides a safe taper.", { insight: 15, trust: 10 }, ["mapped"]),
            o("b", "poor", "Tell her she is an addict and must stop.", "Labels and blame stop honest talk.", { trust: -20 }),
            o("c", "harm", "Advise her to stop all tablets from tonight.", "Sudden stopping after years can cause fits and severe withdrawal.", { risk: 25 }),
          ],
        },
      ],
    },
    {
      id: "in2",
      title: "Session 2 · The taper",
      beats: [
        { text: "She agrees to cut down, but is frightened: 'Last time I tried, I didn't sleep for three nights.'" },
      ],
      decisions: [
        {
          id: "in2a",
          kind: "medicines",
          skill: "substance:pharm",
          prompt: "What taper do you discuss with the psychiatrist?",
          options: [
            o("a", "best", "A slow, planned taper, often by switching to a longer-acting benzodiazepine such as diazepam, with small cuts spread over months, one prescriber and one pharmacy, and the pace led by her symptoms.", "Gradual tapers lower withdrawal and fit risk and have the best success. A single source prevents extra supplies.", { risk: -20, adherence: 15, trust: 10 }, ["taper"]),
            o("b", "poor", "Halve the dose every few days.", "Too fast a taper after years of use brings rebound and failure.", { risk: 10, adherence: -10 }),
            o("c", "harm", "Swap alprazolam for zolpidem for sleep.", "Z-drugs carry similar dependence and fall risks.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "in3",
      title: "Session 3 · Sleep without tablets",
      beats: [
        { text: "She lies in bed from 9 pm, watches TV in bed when she can't sleep and naps after lunch." },
      ],
      decisions: [
        {
          id: "in3a",
          kind: "psychoeducation",
          skill: "anxiety:apply",
          prompt: "What do you offer for sleep?",
          options: [
            o("a", "best", "CBT for insomnia: a fixed wake time, bed only for sleep, get up if awake for long, no daytime naps, limit time in bed at first, and a worry time earlier in the evening.", "CBT-I is the first-line treatment for chronic insomnia and helps people come off sleeping tablets.", { insight: 20, adherence: 10 }, ["cbti"]),
            o("b", "poor", "Tell her to lie in bed longer to catch up.", "More time awake in bed weakens the bed-sleep link.", { insight: -5 }),
          ],
        },
        {
          id: "in3b",
          kind: "risk",
          skill: "substance:apply",
          prompt: "She mentions taking a peg of whisky some nights 'to help the tablet work'. What do you do?",
          options: [
            o("a", "best", "Explain clearly that alcohol with benzodiazepines can slow breathing and cause falls, and agree to stop the mix.", "Combining sedatives is a common cause of dangerous sedation in older adults.", { risk: -15, insight: 10 }),
            o("b", "poor", "Ignore it; it's only one peg.", "Even small amounts add to sedation and fall risk.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "in4",
      title: "Session 4 · Her husband",
      beats: [
        { text: "Her husband says, 'If she can't sleep, just give her back the old tablets. I can't see her suffer.'" },
      ],
      decisions: [
        {
          id: "in4a",
          kind: "family",
          skill: "substance:apply",
          prompt: "How do you involve him?",
          options: [
            o("a", "best", "Explain that some bad nights are expected and pass, how the taper protects her memory and stops falls, and ask him to support the sleep plan, such as morning walks together.", "A supportive partner makes a taper much more likely to succeed.", { family: 20, adherence: 10 }),
            o("b", "harm", "Agree to restart the full dose to settle things.", "Going back undoes progress and keeps the risks.", { risk: 15, adherence: -15 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Morning walks", text: "Mrs Jain is off alprazolam after several months. She sleeps six hours, walks with her husband at dawn and says her memory is 'coming back'." },
    { min: 50, title: "Halfway there", text: "She has cut down to one tablet a night. Bad nights still tempt her back." },
    { min: 0, title: "Another fall", text: "After stopping suddenly and then restarting more, Mrs Jain falls and breaks her wrist." },
  ],
};

/* ------------------------------------------------------------ Dehradun */
const dehradun: Campaign = {
  id: "dehradun",
  tags: tags("Bipolar depression", "bipolar", "Spot past hypomania in a depressed patient and avoid antidepressant monotherapy in bipolar depression."),
  title: "Not just depression",
  patient: "Kamal, 32, school teacher",
  place: "Psychiatry OPD, Dehradun",
  blurb: "His third episode of depression. An antidepressant last year 'worked too well': his wife says he became a different man for a while.",
  start: { risk: 55, trust: 40, insight: 25, family: 40, adherence: 40 },
  chapters: [
    {
      id: "dd1",
      title: "Session 1 · The history",
      beats: [
        { text: "Kamal is slowed and tearful. His wife Neha adds: 'Last year on the tablets he slept three hours, started painting the whole school, bought a motorbike on loan. It lasted several days.'" },
      ],
      decisions: [
        {
          id: "dd1a",
          kind: "assessment",
          skill: "bipolar:differentiate",
          prompt: "What does this history suggest?",
          options: [
            o("a", "best", "Past hypomania or mania (on an antidepressant, but with a clear change others saw), so this is likely bipolar depression. Ask about family history and screen for other highs.", "A history of highs changes the diagnosis and the treatment. Antidepressant-triggered highs often point to bipolar disorder.", { insight: 20, risk: -10 }, ["bipolar"]),
            o("b", "harm", "Recurrent depression: restart the same antidepressant at a higher dose.", "Antidepressant alone in bipolar depression risks another switch and mood cycling.", { risk: 20 }, ["switchRisk"]),
            o("c", "poor", "Ignore the high: he was just happy to feel better.", "Sleeping three hours and impulsive spending are not just feeling better.", { risk: 10 }),
          ],
        },
        {
          id: "dd1b",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "Before he leaves, what must you ask?",
          options: [
            o("a", "best", "Suicidal thoughts, plans and means. Bipolar depression carries a high suicide risk, and mixed features (agitation with low mood) raise it further.", "Risk in bipolar depression is higher than many expect.", { risk: -15 }),
            o("b", "poor", "Leave risk for the next session.", "Unasked questions are unmanaged risks.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "dd2",
      title: "Session 2 · Medicine",
      beats: [
        { when: { flag: "switchRisk" }, text: "Within days of the higher antidepressant dose, Kamal is irritable, sleepless and agitated, yet still low and hopeless." },
        { text: "The psychiatrist asks for your view." },
      ],
      decisions: [
        {
          id: "dd2a",
          kind: "medicines",
          skill: "stabilisers:pharm",
          prompt: "What do you raise?",
          options: [
            o("a", "best", "Treatments with evidence in bipolar depression, such as quetiapine, lurasidone, lithium or lamotrigine, avoiding an antidepressant on its own. Plan blood tests where needed.", "Mood stabilisers and some antipsychotics treat bipolar depression without the same switch risk.", { adherence: 15, risk: -15 }, ["stabiliser"]),
            o("b", "poor", "Add a second antidepressant.", "More antidepressant raises switch and cycling risk.", { risk: 15 }),
          ],
        },
      ],
    },
    {
      id: "dd3",
      title: "Session 3 · Understanding the pattern",
      beats: [
        { text: "Kamal says, 'So I have two illnesses?'" },
      ],
      decisions: [
        {
          id: "dd3a",
          kind: "psychoeducation",
          skill: "bipolar:apply",
          prompt: "How do you explain?",
          options: [
            o("a", "best", "One condition with lows and highs. Draw his mood timeline with him and Neha, mark the triggers (sleep loss, stress, the antidepressant), and agree early warning signs for both directions.", "A shared mood chart builds insight and helps catch episodes early.", { insight: 20, family: 10 }, ["chart"]),
            o("b", "poor", "Tell him to avoid thinking about labels.", "Understanding the illness is part of managing it.", { insight: -5 }),
          ],
        },
        {
          id: "dd3b",
          kind: "family",
          skill: "bipolar:apply",
          prompt: "Neha worries about the loan from last year. What do you suggest?",
          options: [
            o("a", "best", "A plan agreed while he is well: what to do with cards and big purchases if early signs of a high appear, and how she can raise it without a fight.", "Plans made in calm times protect the family during highs.", { family: 20, risk: -10 }),
            o("b", "poor", "Neha should take over all his money permanently.", "Taking control without his agreement damages trust and dignity.", { family: -5, trust: -10 }),
          ],
        },
      ],
    },
    {
      id: "dd4",
      title: "Session 4 · Exams and sleep",
      beats: [
        { text: "Board exam duty is coming: late nights correcting papers." },
      ],
      decisions: [
        {
          id: "dd4a",
          kind: "referral",
          skill: "bipolar:apply",
          prompt: "What do you plan?",
          options: [
            o("a", "best", "Protect sleep with a set bedtime and limits on late work, keep a daily mood and sleep record, regular reviews, and a crisis number if warning signs appear.", "Sleep loss is a strong trigger for highs. Regular routines help keep bipolar disorder steady.", { risk: -15, adherence: 15 }),
            o("b", "poor", "Push through the exam season; sleep can wait.", "Sleep loss can tip him into a high.", { risk: 15 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Steady year", text: "Kamal's mood is steady through the exam season. When he slept badly one night, Neha and he followed the plan, and it passed." },
    { min: 50, title: "Ups and downs", text: "Kamal is better, but mild highs and lows still come, and he sometimes misses blood tests." },
    { min: 0, title: "Mixed and unsafe", text: "On antidepressants alone, Kamal cycles into a mixed state with suicidal thoughts and needs admission." },
  ],
};

/* ------------------------------------------------------------ Dubai */
const dubai: Campaign = {
  id: "dubai",
  tags: tags("Depression and drinking in a migrant worker", "depression", "Assess depression and alcohol use in a migrant worker by video and connect care across two countries."),
  title: "A call from far away",
  patient: "Shaji, 41, construction supervisor from Kerala",
  place: "Telepsychiatry service, Kochi, with Shaji in Dubai",
  blurb: "His sister booked a video call. He works twelve-hour shifts, sends most of his pay home, has not seen his children for two years and drinks every night after work.",
  start: { risk: 60, trust: 30, insight: 20, family: 35, adherence: 30 },
  chapters: [
    {
      id: "db1",
      title: "Session 1 · On a phone screen",
      beats: [
        { text: "Shaji is in a shared room, speaking quietly. 'I am a money machine for them. If I die there is insurance, at least that.'" },
      ],
      decisions: [
        {
          id: "db1a",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "What do you do first?",
          options: [
            o("a", "best", "Ask directly about suicidal thoughts and plans, confirm where he is and a local emergency number, and agree a safety plan with someone he trusts nearby.", "Remote care still needs a full risk assessment and a local safety net; 'insurance if I die' is a warning sign.", { risk: -20, trust: 10 }, ["safe"]),
            o("b", "poor", "Talk about his drinking first and leave risk for later.", "His words suggest suicidal thinking that needs asking now.", { risk: 15 }),
            o("c", "harm", "End the call because he is outside the country.", "Abandoning him at a risky moment is unsafe; help him find local support.", { risk: 25, trust: -20 }),
          ],
        },
        {
          id: "db1b",
          kind: "assessment",
          skill: "depression:criteria",
          prompt: "What else do you assess?",
          options: [
            o("a", "best", "Depression symptoms, how much he drinks and for how long, sleep with shift work, debts, isolation and his visa or work stress.", "Migrant workers face isolation, debt and long hours, all linked with depression and heavy drinking.", { insight: 15 }),
            o("b", "poor", "Only whether he is homesick.", "Homesickness may be part, but there is more to assess.", { insight: 3 }),
          ],
        },
      ],
    },
    {
      id: "db2",
      title: "Session 2 · Care across borders",
      beats: [
        { when: { flag: "safe" }, text: "Shaji's roommate Anwar has agreed to be his contact. Shaji has the number of a local clinic." },
        { text: "He asks, 'Can you send tablets from India?'" },
      ],
      decisions: [
        {
          id: "db2a",
          kind: "referral",
          skill: "depression:apply",
          prompt: "How do you organise his treatment?",
          options: [
            o("a", "best", "Help him book a doctor in Dubai who can prescribe and follow him in person, share a summary with his consent, and continue video therapy sessions from Kochi.", "Prescribing and physical checks belong with a local doctor; therapy can continue remotely. Rules on medicines differ by country.", { adherence: 20, trust: 10 }, ["local"]),
            o("b", "harm", "Tell his family to courier antidepressants and sleeping tablets to him.", "Sending medicines across borders without a local prescriber can break the law there and is unsafe.", { risk: 15, trust: -10 }),
          ],
        },
        {
          id: "db2b",
          kind: "psychoeducation",
          skill: "substance:apply",
          prompt: "How do you talk about the drinking?",
          options: [
            o("a", "best", "Explore what the drinking does for him (sleep, numbing loneliness) and what it costs, and agree a goal he chooses, linking it to his low mood.", "Alcohol worsens depression and sleep. His own reasons drive change.", { insight: 15, risk: -10 }),
            o("b", "poor", "Tell him drinking is forbidden there anyway.", "Rules don't address why he drinks.", { trust: -5 }),
          ],
        },
      ],
    },
    {
      id: "db3",
      title: "Session 3 · The family call",
      beats: [
        { text: "With his consent, his wife Bindu joins from Kerala. 'We didn't know. He always says everything is fine.'" },
      ],
      decisions: [
        {
          id: "db3a",
          kind: "family",
          skill: "depression:apply",
          prompt: "How do you help the family?",
          options: [
            o("a", "best", "Help Shaji share how he really feels, explain depression simply, and plan regular calls that are about more than money: the children's school, shared memories, plans for his next visit.", "Feeling valued as a person, not only as a provider, protects him.", { family: 25, risk: -10 }),
            o("b", "poor", "Keep the family out to protect his privacy.", "With his consent, family connection is a powerful support.", { family: -5 }),
          ],
        },
      ],
    },
    {
      id: "db4",
      title: "Session 4 · Looking ahead",
      beats: [
        { text: "Shaji is sleeping better and drinks only at weekends. He wonders about coming home for good." },
      ],
      decisions: [
        {
          id: "db4a",
          kind: "referral",
          skill: "depression:apply",
          prompt: "What do you plan?",
          options: [
            o("a", "best", "Keep up local treatment and video therapy, help him weigh options about returning without pressure, and plan care in Kerala if he comes back.", "Continuity of care during a big life change prevents relapse.", { adherence: 15, insight: 10 }),
            o("b", "poor", "Stop sessions now he is better.", "Stopping early, while stresses remain, risks relapse.", { risk: 10 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Onam at home", text: "Shaji flies home for Onam. He has a job lined up in Kochi and his medicine with him. His son has made a banner at the airport." },
    { min: 50, title: "Still far away", text: "Shaji is safer and drinks less, but loneliness weighs on him between calls." },
    { min: 0, title: "Silence", text: "Shaji stops answering calls. His sister hears much later that he was taken to hospital after drinking heavily." },
  ],
};

/* ------------------------------------------------------------ Nashik */
const nashik: Campaign = {
  id: "nashik",
  tags: tags("Neuroleptic malignant syndrome", "antipsychotics", "Recognise neuroleptic malignant syndrome early, act as an emergency and plan safe antipsychotic use afterwards."),
  title: "Fever and stiffness",
  patient: "Vishal, 30, auto-rickshaw driver with schizophrenia",
  place: "General hospital emergency, Nashik",
  blurb: "Two days after a haloperidol injection and a dose increase, he is stiff, sweating, confused, with a fever. His mother thinks it's 'just viral'.",
  start: { risk: 80, trust: 40, insight: 25, family: 40, adherence: 40 },
  chapters: [
    {
      id: "nk1",
      title: "Session 1 · Emergency",
      beats: [
        { text: "Vishal's temperature is 39.5, his pulse is fast, blood pressure swings, and his arms are rigid like lead pipes. He answers slowly and is drenched in sweat." },
      ],
      decisions: [
        {
          id: "nk1a",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "What do you tell the emergency team?",
          options: [
            o("a", "best", "Suspect neuroleptic malignant syndrome: stop the antipsychotic, check CK, kidneys and salts, start cooling and fluids, and move him to intensive care.", "Fever, lead-pipe rigidity, confusion and unstable blood pressure after an antipsychotic increase are classic NMS, a life-threatening emergency.", { risk: -25, trust: 5 }, ["nms"]),
            o("b", "harm", "Give another injection of haloperidol because he is confused.", "More antipsychotic in NMS can be fatal.", { risk: 25 }),
            o("c", "poor", "Treat as a viral fever with paracetamol and send him home.", "Missing NMS risks kidney failure and death.", { risk: 20 }),
          ],
        },
      ],
    },
    {
      id: "nk2",
      title: "Session 2 · In intensive care",
      beats: [
        { when: { flag: "nms" }, text: "His CK is very high. With fluids, cooling and treatment from the physicians, his fever is falling." },
        { text: "His mother asks, 'Will he have to stop all his medicine forever? Then the voices will come back.'" },
      ],
      decisions: [
        {
          id: "nk2a",
          kind: "psychoeducation",
          skill: "antipsychotics:pharm",
          prompt: "How do you answer?",
          options: [
            o("a", "best", "Explain that NMS is rare and treatable, that he will need a break from antipsychotics now, and that later the team can carefully restart a different, lower-risk one at a low dose, with close checks.", "Most people can restart an antipsychotic safely after a gap, with a different drug, low doses and slow increases.", { family: 15, trust: 15, insight: 10 }),
            o("b", "poor", "Say he can never take any antipsychotic again.", "This is not usually true, and without treatment his psychosis may return.", { adherence: -10 }),
          ],
        },
        {
          id: "nk2b",
          kind: "risk",
          skill: "psychosis:risk",
          prompt: "Off medicine, what do you watch for?",
          options: [
            o("a", "best", "Return of psychotic symptoms and agitation; use non-drug calming and, if needed, the team may use a benzodiazepine short-term while the antipsychotic is paused.", "Psychosis can return while medicine is stopped; benzodiazepines can help calm without adding NMS risk.", { risk: -10 }),
            o("b", "poor", "Nothing until he goes home.", "Relapse can begin on the ward.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "nk3",
      title: "Session 3 · Restarting",
      beats: [
        { text: "After a long, safe gap, Vishal's voices are coming back. The team plans to restart treatment." },
      ],
      decisions: [
        {
          id: "nk3a",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "What do you support?",
          options: [
            o("a", "best", "A different antipsychotic with lower NMS risk, started low and increased slowly, avoiding long-acting injections for now, with temperature, stiffness and CK checks, and good hydration.", "Slow restarts with a different drug, no depot at first, and monitoring reduce the chance of NMS returning.", { risk: -15, adherence: 15 }, ["restart"]),
            o("b", "harm", "Restart the same high-dose haloperidol injection.", "Repeating the trigger risks another episode.", { risk: 25 }),
          ],
        },
      ],
    },
    {
      id: "nk4",
      title: "Session 4 · Discharge",
      beats: [
        { text: "Vishal wants to drive his auto again." },
      ],
      decisions: [
        {
          id: "nk4a",
          kind: "family",
          skill: "antipsychotics:pharm",
          prompt: "What do you make sure the family knows?",
          options: [
            o("a", "best", "The warning signs (fever with stiffness, confusion, sweating) mean go to the emergency room and say he had NMS. Carry a card with this history, drink enough water in the heat, and return to driving when the doctor agrees.", "A clear card and family knowledge help any future doctor act fast.", { family: 20, risk: -10, insight: 10 }),
            o("b", "poor", "Nothing special; the episode is over.", "Past NMS raises future risk, and others need to know.", { risk: 10 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Back on the road", text: "Vishal drives his auto again, takes his new medicine and carries a card in his wallet. His mother keeps a copy on the fridge." },
    { min: 50, title: "Recovered, cautious", text: "Vishal recovered, but the family is afraid of medicine and he takes it on and off." },
    { min: 0, title: "Kidney failure", text: "The late diagnosis led to kidney failure needing dialysis. Vishal survives, but recovery is long." },
  ],
};

export const CAMPAIGNS_F: Campaign[] = [yavatmal, mysuru, indore, dehradun, dubai, nashik];
