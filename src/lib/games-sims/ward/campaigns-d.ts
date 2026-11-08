/**
 * Ward Week campaigns, set D: opioid use disorder, lithium toxicity,
 * catatonia, borderline personality with self-harm and late-life psychotic
 * depression. Original teaching stories; the player is a trainee psychologist.
 */
import type { Campaign } from "./engine";
import { o, tags } from "./kit";

/* ------------------------------------------------------------ Chandigarh */
const chandigarh: Campaign = {
  id: "chandigarh",
  tags: tags("Opioid use disorder", "substance", "Treat opioid withdrawal and dependence with agonist treatment, harm reduction and family work."),
  title: "Chitta",
  patient: "Gurpreet, 24, unemployed graduate",
  place: "Drug de-addiction centre, Chandigarh",
  blurb: "He has smoked and then injected heroin for three years. His mother found him blue in the bathroom last month; a neighbour knew to call the ambulance.",
  start: { risk: 70, trust: 30, insight: 30, family: 40, adherence: 30 },
  chapters: [
    {
      id: "cg1",
      title: "Session 1 · Day one without it",
      beats: [
        { text: "Gurpreet yawns, his nose runs, he has goosebumps and stomach cramps. 'My legs are full of ants. Give me something or I'm leaving.' His pupils are wide." },
      ],
      decisions: [
        {
          id: "cg1a",
          kind: "medicines",
          skill: "substance:pharm",
          prompt: "What do you suggest to the doctor?",
          options: [
            o("a", "best", "Score the withdrawal, then start buprenorphine (or buprenorphine with naloxone) once withdrawal is clear, and discuss staying on it as maintenance.", "Buprenorphine relieves withdrawal and, as long-term treatment, cuts overdose deaths and relapse. Starting it only once withdrawal has begun avoids a sudden, worse withdrawal.", { risk: -20, adherence: 15, trust: 10 }, ["bup"]),
            o("b", "poor", "Painkillers and sleeping pills only; he must suffer it out to learn.", "Untreated withdrawal drives people out of care and back to the drug.", { trust: -10, adherence: -10 }),
            o("c", "harm", "Start buprenorphine right away, an hour after his last heroin.", "Given too soon after a full opioid, buprenorphine can push him into sudden, severe withdrawal.", { trust: -15, risk: 10 }),
          ],
        },
        {
          id: "cg1b",
          kind: "risk",
          skill: "substance:apply",
          prompt: "What safety step matters most before he leaves the ward one day?",
          options: [
            o("a", "best", "Teach him and his family about overdose: tolerance falls fast after a break, never use alone, and how naloxone works and where to get it.", "The days after detox carry a high overdose risk because tolerance drops.", { risk: -15, family: 5 }, ["naloxone"]),
            o("b", "poor", "Warn him that if he uses again he will be thrown out of treatment.", "Threats don't prevent overdose; knowledge does.", { trust: -10 }),
          ],
        },
      ],
    },
    {
      id: "cg2",
      title: "Session 2 · Why he uses",
      beats: [
        { text: "Gurpreet talks about failing the army entrance twice, friends who sell, and how 'chitta made me feel like a man for an hour'. He tests positive for hepatitis C." },
      ],
      decisions: [
        {
          id: "cg2a",
          kind: "psychoeducation",
          skill: "substance:apply",
          prompt: "How do you work with him?",
          options: [
            o("a", "best", "Motivational interviewing: explore his goals (a job, his mother's health), what heroin costs him, and his own reasons to stay on treatment.", "Change is more likely when the reasons are his own.", { insight: 20, trust: 10 }),
            o("b", "poor", "Lecture him about how he has shamed his family.", "Shame worsens use and stops honest talk.", { trust: -15 }),
          ],
        },
        {
          id: "cg2b",
          kind: "referral",
          skill: "substance:apply",
          prompt: "What about the hepatitis C?",
          options: [
            o("a", "best", "Refer him for hepatitis C treatment, which now cures most people, and test for HIV and hepatitis B. Explain clean needles and not sharing.", "Treating infections and harm reduction are part of addiction care.", { risk: -10, adherence: 10 }),
            o("b", "poor", "Wait until he has been clean for a year.", "Treatment doesn't need to wait for abstinence.", { risk: 5 }),
          ],
        },
      ],
    },
    {
      id: "cg3",
      title: "Session 3 · The family",
      beats: [
        { text: "His father is ashamed and angry: 'Buprenorphine is just another drug. He must stop everything, like a man.'" },
      ],
      decisions: [
        {
          id: "cg3a",
          kind: "family",
          skill: "substance:apply",
          prompt: "How do you answer?",
          options: [
            o("a", "best", "Explain that maintenance treatment is a medicine for a brain condition, like insulin for diabetes. It lets him work and reduces deaths. Invite the parents to a family support group.", "Families who understand agonist treatment help people stay on it, and staying on it saves lives.", { family: 20, adherence: 15 }, ["familyOn"]),
            o("b", "harm", "Agree to stop buprenorphine quickly to please the father.", "Rapid stopping is the riskiest moment for relapse and overdose.", { risk: 25, adherence: -15 }),
            o("c", "poor", "Tell the father he is old-fashioned.", "Dismissing him loses an ally.", { family: -10 }),
          ],
        },
      ],
    },
    {
      id: "cg4",
      title: "Session 4 · A slip",
      beats: [
        { text: "Gurpreet admits he used once at a friend's wedding. 'I've ruined everything.'" },
        { when: { notFlag: "naloxone" }, text: "He says he used alone in a car, afraid of being seen." },
      ],
      decisions: [
        {
          id: "cg4a",
          kind: "risk",
          skill: "substance:apply",
          prompt: "How do you respond to the lapse?",
          options: [
            o("a", "best", "Thank him for telling you, review what led to it, adjust the dose if needed, and update the relapse and overdose plan.", "A lapse handled openly is a learning step. Punishment pushes it into secret, where overdoses happen.", { trust: 15, risk: -15, insight: 10 }),
            o("b", "harm", "Discharge him from the programme for breaking the rules.", "Discharge after a lapse sharply raises the risk of death.", { risk: 25, trust: -20 }),
          ],
        },
        {
          id: "cg4b",
          kind: "referral",
          skill: "substance:apply",
          prompt: "What longer-term support do you set up?",
          options: [
            o("a", "best", "Keep him on maintenance at a nearby clinic, link him with a skills course or job scheme, and a peer support group.", "Work, routine and peers who have recovered support long-term recovery.", { adherence: 10, insight: 10, risk: -5 }),
            o("b", "poor", "Send him to a private 'rehab' that locks people up for months.", "Forced confinement without medical treatment is unsafe and often abusive.", { trust: -15, risk: 10 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "A job at the dhaba", text: "Gurpreet works at his uncle's dhaba and collects his medicine on the way. His mother keeps naloxone in her cupboard and hasn't needed it." },
    { min: 50, title: "Mostly on track", text: "Gurpreet stays on treatment but uses now and then with old friends. The family is wary." },
    { min: 0, title: "An overdose", text: "Out of treatment, Gurpreet overdoses alone. He survives with a brain injury." },
  ],
};

/* ------------------------------------------------------------ Nagpur */
const nagpur: Campaign = {
  id: "nagpur",
  tags: tags("Lithium toxicity", "stabilisers", "Recognise lithium toxicity, its triggers, and plan safe lithium use."),
  title: "A hot summer",
  patient: "Sunita, 38, primary school teacher with bipolar disorder",
  place: "Medicine emergency, Nagpur",
  blurb: "Stable on lithium for years. In the May heat she had diarrhoea for three days and took ibuprofen for back pain. Now she is vomiting, unsteady and confused.",
  start: { risk: 70, trust: 45, insight: 40, family: 45, adherence: 50 },
  chapters: [
    {
      id: "ng1",
      title: "Session 1 · Emergency",
      beats: [
        { text: "Sunita slurs her words, her hands shake coarsely and she can't walk straight. Her husband says she drank little water because of the vomiting." },
      ],
      decisions: [
        {
          id: "ng1a",
          kind: "medicines",
          skill: "stabilisers:pharm",
          prompt: "What do you tell the emergency doctor?",
          options: [
            o("a", "best", "This looks like lithium toxicity: coarse tremor, unsteadiness, slurred speech and confusion after dehydration and an anti-inflammatory painkiller. Stop lithium, check a lithium level, kidney function and salts, and give fluids.", "Dehydration and NSAIDs raise lithium levels. Toxicity can damage the kidneys and brain; severe cases need dialysis.", { risk: -25, trust: 5 }, ["spotted"]),
            o("b", "harm", "Give her lithium dose now; she needs to stay stable.", "More lithium during toxicity can be fatal.", { risk: 25 }),
            o("c", "poor", "Treat it as gastroenteritis and send her home with oral fluids.", "Missing lithium toxicity risks permanent harm.", { risk: 20 }),
          ],
        },
      ],
    },
    {
      id: "ng2",
      title: "Session 2 · On the ward",
      beats: [
        { when: { flag: "spotted" }, text: "Her level was very high. With fluids and close monitoring she is clearer by the next morning. Kidney tests are recovering." },
        { text: "Sunita is frightened: 'I never want lithium again. It nearly killed me.'" },
      ],
      decisions: [
        {
          id: "ng2a",
          kind: "psychoeducation",
          skill: "stabilisers:pharm",
          prompt: "How do you talk about it?",
          options: [
            o("a", "best", "Acknowledge the fear. Explain what raised the level (heat, diarrhoea, ibuprofen) and that with simple rules lithium can be used safely. Ask what she wants and discuss options with her and the psychiatrist.", "Lithium works well for her bipolar disorder and lowers suicide risk. Understanding the cause lets her decide, rather than fear deciding for her.", { insight: 20, trust: 15 }),
            o("b", "poor", "Tell her she must restart lithium, no discussion.", "Pressure without understanding leads to stopping secretly.", { trust: -15, adherence: -10 }),
          ],
        },
        {
          id: "ng2b",
          kind: "medicines",
          skill: "stabilisers:pharm",
          prompt: "Which medicines raise lithium levels, for her card?",
          options: [
            o("a", "best", "Anti-inflammatory painkillers like ibuprofen and diclofenac, some blood pressure pills (ACE inhibitors and water pills like thiazides), and dehydration from heat, vomiting or diarrhoea.", "These are the common causes of toxicity. Paracetamol is the safer painkiller.", { risk: -15, insight: 10 }, ["card"]),
            o("b", "poor", "Only alcohol; other medicines are fine.", "This misses the real culprits.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "ng3",
      title: "Session 3 · The plan",
      beats: [
        { text: "Sunita decides to restart lithium at a lower dose, with her doctor's guidance." },
      ],
      decisions: [
        {
          id: "ng3a",
          kind: "medicines",
          skill: "stabilisers:pharm",
          prompt: "What monitoring do you make sure is in her plan?",
          options: [
            o("a", "best", "Lithium levels about 12 hours after the last dose, checked often after restarting and then every few months, with kidney and thyroid tests, and a sick-day rule: stop and call if vomiting or diarrhoea.", "Correctly timed levels and a sick-day plan prevent another toxic episode; lithium can affect kidneys and thyroid over years.", { risk: -15, adherence: 15 }),
            o("b", "poor", "A level only if she feels unwell.", "Toxicity can build quietly; regular checks are needed.", { risk: 10 }),
          ],
        },
        {
          id: "ng3b",
          kind: "family",
          skill: "stabilisers:apply",
          prompt: "Her husband asks what he should watch for.",
          options: [
            o("a", "best", "Teach him the early signs: a worse tremor, vomiting, diarrhoea, unsteadiness or muddled speech mean stop lithium and get a level today.", "Families often notice toxicity first.", { family: 20, risk: -10 }),
            o("b", "poor", "Tell him to give her extra salt every day.", "Unplanned salt changes swing levels; steady habits matter.", { risk: 5 }),
          ],
        },
      ],
    },
    {
      id: "ng4",
      title: "Session 4 · Back at school",
      beats: [
        { text: "Months later, Sunita is well. She asks about a pregnancy in the future." },
      ],
      decisions: [
        {
          id: "ng4a",
          kind: "referral",
          skill: "stabilisers:pharm",
          prompt: "What do you advise?",
          options: [
            o("a", "best", "Plan ahead with her psychiatrist and obstetrician before trying: weigh relapse risk against lithium's small risk to the baby's heart, extra scans, and closer level checks as fluid changes in pregnancy and after birth.", "Planned pregnancy on or off lithium is a shared decision; levels shift in pregnancy and fall sharply after delivery.", { insight: 15, trust: 10 }),
            o("b", "harm", "Tell her to stop lithium the day she finds out she is pregnant.", "Sudden stopping carries a high risk of relapse, especially after birth.", { risk: 20 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Safe summers", text: "Sunita keeps a water bottle on her desk and a card in her purse listing medicines to avoid. Her levels are steady and she has had no episodes." },
    { min: 50, title: "Off lithium", text: "Sunita stops lithium out of fear and switches medicines. She is well for now, but her mood is less steady." },
    { min: 0, title: "Lasting damage", text: "A second toxic episode leaves her with kidney damage and a lasting tremor." },
  ],
};

/* ------------------------------------------------------------ Patna */
const patna: Campaign = {
  id: "patna",
  tags: tags("Catatonia", "psychosis", "Recognise catatonia, treat it with lorazepam or ECT and avoid its medical dangers."),
  title: "The still man",
  patient: "Ravi, 26, farm labourer",
  place: "Psychiatry ward, medical college, Patna",
  blurb: "For four days he hasn't spoken, eaten or drunk. He stands by the wall holding one arm in the air. His family thinks a spirit has caught him.",
  start: { risk: 75, trust: 35, insight: 20, family: 40, adherence: 40 },
  chapters: [
    {
      id: "pt1",
      title: "Session 1 · Admission",
      beats: [
        { text: "Ravi stares ahead without blinking. When you lift his arm, it stays where you leave it. He resists when you try to move him. His lips are dry and cracked." },
      ],
      decisions: [
        {
          id: "pt1a",
          kind: "assessment",
          skill: "psychosis:recognise",
          prompt: "What do you recognise and record?",
          options: [
            o("a", "best", "Catatonia: mutism, staring, posturing, waxy flexibility and negativism. Rate it on a scale such as the Bush-Francis, and flag dehydration and no eating as urgent.", "Naming catatonia matters because it is very treatable and its complications (dehydration, clots, infection) can kill.", { risk: -15, insight: 10 }, ["named"]),
            o("b", "poor", "Record him as 'uncooperative' and wait for him to talk.", "Catatonia isn't refusal; waiting risks dehydration.", { risk: 15 }),
            o("c", "harm", "Agree with the family that it is a spirit and suggest they take him to a healer.", "Delaying treatment of catatonia can be fatal.", { risk: 25 }),
          ],
        },
      ],
    },
    {
      id: "pt2",
      title: "Session 2 · The lorazepam test",
      beats: [
        { text: "The team plans a lorazepam challenge. Blood tests show he is dehydrated with raised CK. His temperature is normal." },
      ],
      decisions: [
        {
          id: "pt2a",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "A junior doctor suggests haloperidol injection 'to break the psychosis'. What do you raise?",
          options: [
            o("a", "best", "Hold antipsychotics for now: in catatonia they can tip into neuroleptic malignant syndrome. Lorazepam first, with fluids, blood clot prevention and nutrition.", "Lorazepam is first-line and many respond within hours to days. Antipsychotics in catatonia raise NMS risk.", { risk: -20, adherence: 10 }, ["lorazepam"]),
            o("b", "harm", "Agree to a high-dose haloperidol injection.", "High-potency antipsychotics in catatonia risk NMS.", { risk: 25 }, ["nms"]),
            o("c", "poor", "Give only fluids and watch.", "Supportive care is needed, but so is treatment.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "pt3",
      title: "Session 3 · Waking up",
      beats: [
        { when: { flag: "nms" }, text: "Ravi develops a high fever, rigid muscles and a soaring CK. He is moved to intensive care with neuroleptic malignant syndrome." },
        { when: { flag: "lorazepam" }, text: "An hour after lorazepam, Ravi asks for water. Over days he begins to eat. He says he felt 'frozen with fear' and heard voices threatening his family." },
      ],
      decisions: [
        {
          id: "pt3a",
          kind: "medicines",
          skill: "psychosis:apply",
          prompt: "The response to lorazepam is partial after several days. What is the next step?",
          options: [
            o("a", "best", "Discuss ECT, which works well in catatonia, with his family, explaining it is done under anaesthesia with a muscle relaxant, and seek informed consent.", "ECT is highly effective in catatonia not fully responding to lorazepam. Modern ECT is given under anaesthesia.", { risk: -15, trust: 10 }, ["ect"]),
            o("b", "poor", "Keep raising lorazepam with no end point.", "Benzodiazepines have limits; ECT should not be delayed when response stalls.", { risk: 5 }),
          ],
        },
        {
          id: "pt3b",
          kind: "assessment",
          skill: "psychosis:apply",
          prompt: "What underlying cause do you look for?",
          options: [
            o("a", "best", "Catatonia comes with mood disorders, psychosis and medical illnesses (infections, autoimmune encephalitis, metabolic problems). Check for these alongside a mental state exam now he can talk.", "Treating the underlying condition prevents return.", { insight: 10, risk: -5 }),
            o("b", "poor", "None; catatonia is always schizophrenia.", "Catatonia most often comes with mood disorders, and medical causes must be ruled out.", { insight: -5 }),
          ],
        },
      ],
    },
    {
      id: "pt4",
      title: "Session 4 · The family and the healer",
      beats: [
        { text: "Ravi is better. His mother says she will still take him to the dargah to thank God." },
      ],
      decisions: [
        {
          id: "pt4a",
          kind: "family",
          skill: "psychosis:apply",
          prompt: "How do you respond?",
          options: [
            o("a", "best", "Respect the visit as part of their faith, and agree a plan: keep his treatment going, come back quickly if he stops eating or talking, and where to get help nearby.", "Working with faith, not against it, keeps the family engaged.", { family: 20, adherence: 10 }),
            o("b", "poor", "Tell her the dargah had nothing to do with it.", "Dismissing beliefs pushes families away from care.", { family: -15 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Back in the fields", text: "Ravi is working again and takes his medicine. His mother knows the warning signs and brought him in early once." },
    { min: 50, title: "Better, uncertain", text: "Ravi recovered but stopped follow-up. He is well for now." },
    { min: 0, title: "Intensive care", text: "Ravi survives a long ICU stay after complications. Recovery is slow." },
  ],
};

/* ------------------------------------------------------------ Bhopal */
const bhopal: Campaign = {
  id: "bhopal",
  tags: tags("Borderline personality and self-harm", "personality", "Respond to repeated self-harm with validation, DBT skills and a clear crisis plan, not rejection."),
  title: "Cuts and calls",
  patient: "Nidhi, 23, fashion design student",
  place: "Psychiatry OPD and crisis clinic, Bhopal",
  blurb: "Her fifth visit this year after cutting her forearm. Staff in casualty call her 'attention seeking'. Her boyfriend has just left.",
  start: { risk: 65, trust: 25, insight: 25, family: 35, adherence: 30 },
  chapters: [
    {
      id: "bh1",
      title: "Session 1 · Casualty",
      beats: [
        { text: "Nidhi's cuts are stitched. She looks at you coldly. 'Go on, tell me I'm wasting your time like the others.'" },
      ],
      decisions: [
        {
          id: "bh1a",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "How do you start?",
          options: [
            o("a", "best", "Take her seriously: ask what happened today, what the cutting does for her, and whether she has had thoughts of ending her life, now or before.", "Repeated self-harm raises suicide risk. Curiosity about its function opens the door to change.", { trust: 20, risk: -15 }, ["heard"]),
            o("b", "harm", "Tell her she should stop seeking attention.", "Stigmatising words increase shame and risk, and she may not return when it matters.", { trust: -25, risk: 15 }),
            o("c", "poor", "Give her a leaflet and the next OPD date.", "She leaves without her risk understood.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "bh2",
      title: "Session 2 · Understanding the pattern",
      beats: [
        { when: { flag: "heard" }, text: "Nidhi describes swinging from loving people to hating them, terror when anyone leaves, and feeling empty. 'Cutting is the only thing that calms me.'" },
        { text: "Her mother says Nidhi's father left when she was eight and 'she has never been the same'." },
      ],
      decisions: [
        {
          id: "bh2a",
          kind: "psychoeducation",
          skill: "personality:apply",
          prompt: "How do you share your understanding?",
          options: [
            o("a", "best", "Describe the pattern in her words: very intense emotions, fear of being left and self-harm to cope. Explain that it has a name, borderline personality disorder, and that most people improve a lot with the right therapy.", "Naming it with hope, in her own language, reduces shame. Outcomes are much better than many think.", { insight: 20, trust: 10 }, ["named"]),
            o("b", "poor", "Avoid mentioning a diagnosis because 'personality disorders can't be treated'.", "This myth denies her effective help.", { insight: -10 }),
          ],
        },
        {
          id: "bh2b",
          kind: "medicines",
          skill: "personality:apply",
          prompt: "She has been given four different medicines by different doctors. What do you raise?",
          options: [
            o("a", "best", "Ask the psychiatrist to review and simplify: no medicine treats the disorder itself, and stockpiles of tablets are a risk. Treat any depression or other condition separately.", "Polypharmacy in borderline personality adds side effects and overdose means without clear benefit.", { risk: -15, adherence: 10 }),
            o("b", "harm", "Add a sleeping pill for her distress, with a month's supply.", "A large supply of sedatives in a person who self-harms is dangerous.", { risk: 20 }),
          ],
        },
      ],
    },
    {
      id: "bh3",
      title: "Session 3 · Skills",
      beats: [
        { text: "Nidhi joins a skills group based on dialectical behaviour therapy (DBT). She is wary: 'Groups are fake.'" },
      ],
      decisions: [
        {
          id: "bh3a",
          kind: "assessment",
          skill: "personality:apply",
          prompt: "What do you teach first for the moments before cutting?",
          options: [
            o("a", "best", "Distress tolerance: holding ice, intense brief exercise or paced breathing to ride out the peak, and a diary card to track urges and what helped.", "DBT skills give her other ways through the peak of emotion. Tracking builds awareness.", { insight: 15, risk: -10, adherence: 10 }, ["skills"]),
            o("b", "poor", "Ask her to promise never to self-harm again.", "No-harm contracts don't prevent self-harm.", { trust: -5 }),
          ],
        },
      ],
    },
    {
      id: "bh4",
      title: "Session 4 · A crisis",
      beats: [
        { text: "At 11 pm Nidhi messages: 'He blocked me. I can't do this.'" },
      ],
      decisions: [
        {
          id: "bh4a",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "What should her crisis plan already say, and what do you do now?",
          options: [
            o("a", "best", "Follow the plan she helped write: her skills, people she can call, Tele-MANAS (14416) or casualty if she can't stay safe. Check she is safe tonight and offer an early session tomorrow.", "A written crisis plan with clear steps keeps responses consistent and helps her use her own skills.", { risk: -20, trust: 10 }),
            o("b", "harm", "Ignore the message; replying rewards the behaviour.", "Ignoring a possible suicide risk is dangerous.", { risk: 25, trust: -15 }),
            o("c", "poor", "Admit her to the ward for a long stay whenever she messages.", "Long admissions can worsen borderline patterns; brief, planned crisis care is better.", { adherence: -5 }),
          ],
        },
        {
          id: "bh4b",
          kind: "family",
          skill: "personality:apply",
          prompt: "Her mother wants to help. What do you suggest?",
          options: [
            o("a", "best", "With Nidhi's consent, teach her mother to validate feelings before problem-solving ('I can see how hurt you are'), keep calm, steady limits, and know the crisis plan.", "Validation lowers emotional intensity; family learning is part of DBT.", { family: 20, risk: -5 }),
            o("b", "poor", "Tell her mother to watch Nidhi all the time.", "Constant watching strains both and isn't sustainable.", { family: -5 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Graduation show", text: "Nidhi has not cut for months. She still feels storms of emotion, and she uses her skills. Her collection is in the graduation show." },
    { min: 50, title: "Fewer visits", text: "Self-harm is less often but still there. She comes to group most of the time." },
    { min: 0, title: "Turned away", text: "After another hostile visit to casualty, Nidhi stops seeking help. Her self-harm becomes more dangerous." },
  ],
};

/* ------------------------------------------------------------ Shimla */
const shimla: Campaign = {
  id: "shimla",
  tags: tags("Late-life psychotic depression", "depression", "Recognise psychotic depression in an older man, assess risk and capacity, and weigh ECT."),
  title: "A sinner's winter",
  patient: "Mr Thakur, 68, retired headmaster",
  place: "Psychiatry ward, Shimla",
  blurb: "Since his wife died last spring he has stopped eating, says he has 'committed great sins' and that his bank account is empty. His pension is untouched.",
  start: { risk: 70, trust: 35, insight: 15, family: 45, adherence: 35 },
  chapters: [
    {
      id: "sm1",
      title: "Session 1 · Admission",
      beats: [
        { text: "Mr Thakur is thin and slow. 'I ruined my family. The police will come. I don't deserve food.' He has lost 9 kg." },
      ],
      decisions: [
        {
          id: "sm1a",
          kind: "assessment",
          skill: "depression:recognise",
          prompt: "What do you identify?",
          options: [
            o("a", "best", "Severe depression with psychotic features: mood-congruent delusions of guilt and poverty, plus poor eating. Assess suicide risk, physical health (hydration, sodium, kidneys) and whether he has thoughts of death.", "Psychotic depression in older men carries high suicide risk and physical danger from not eating.", { risk: -15, insight: 10 }, ["psychotic"]),
            o("b", "poor", "Normal grief for his wife.", "Delusions and starving himself are not normal grief.", { risk: 15 }),
            o("c", "harm", "Early dementia; nothing much can be done.", "Missing a treatable depression is a serious error.", { risk: 20, insight: -10 }),
          ],
        },
        {
          id: "sm1b",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "He says, 'It would be better if I was gone.' What do you check?",
          options: [
            o("a", "best", "Ask about plans and means, including his old service revolver and his tablets, and arrange close observation on the ward.", "Older men with depression use lethal means; ask about firearms and medicines.", { risk: -15, family: 5 }),
            o("b", "poor", "Reassure him he has lots to live for.", "Reassurance without assessment misses the risk.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "sm2",
      title: "Session 2 · Treatment choices",
      beats: [
        { text: "He drinks little water and eats a few spoons a day. His sodium is low." },
      ],
      decisions: [
        {
          id: "sm2a",
          kind: "medicines",
          skill: "depression:apply",
          prompt: "What do you discuss with the psychiatrist?",
          options: [
            o("a", "best", "ECT, which works fast in psychotic depression and when someone is not eating, alongside an antidepressant with an antipsychotic. Watch sodium closely, as some antidepressants lower it in older people.", "ECT is often the treatment of choice in severe psychotic depression with poor intake, and is safe under anaesthesia in older adults.", { risk: -20, adherence: 10 }, ["ect"]),
            o("b", "poor", "An antidepressant alone and wait.", "Antidepressants alone work less well in psychotic depression, and waiting is risky when he isn't eating.", { risk: 10 }),
            o("c", "harm", "Sleeping tablets to help him rest.", "This treats nothing and adds fall and confusion risk.", { risk: 15 }),
          ],
        },
        {
          id: "sm2b",
          kind: "referral",
          skill: "ethics-law:apply",
          prompt: "He refuses treatment: 'I deserve to suffer.' What is your view on consent?",
          options: [
            o("a", "best", "Assess his capacity for this decision: his guilt delusion may stop him weighing the information. Involve his nominated representative and follow the Mental Healthcare Act, including any advance directive.", "Capacity is decision-specific. When a delusion drives refusal, the law gives a route that protects his rights and his life.", { trust: 10, family: 10 }),
            o("b", "harm", "Give ECT anyway without any process.", "Treatment without consent or legal process breaches his rights.", { trust: -25 }),
          ],
        },
      ],
    },
    {
      id: "sm3",
      title: "Session 3 · After six treatments",
      beats: [
        { when: { flag: "ect" }, text: "Mr Thakur eats a full plate of rajma chawal and asks about his grandson. He forgets the names of two nurses; his memory of the past is fine." },
        { when: { notFlag: "ect" }, text: "He is a little better but still says the police are coming." },
      ],
      decisions: [
        {
          id: "sm3a",
          kind: "psychoeducation",
          skill: "depression:apply",
          prompt: "His son worries about the memory lapses. What do you explain?",
          options: [
            o("a", "best", "Short-term memory problems around the ECT period are common and usually improve over the following months. Track memory and adjust treatment if needed.", "Honest information about ECT side effects keeps trust.", { family: 15, trust: 10 }),
            o("b", "poor", "Say ECT never affects memory.", "False reassurance breaks trust when lapses happen.", { trust: -10 }),
          ],
        },
      ],
    },
    {
      id: "sm4",
      title: "Session 4 · Living alone",
      beats: [
        { text: "Mr Thakur wants to return to his house in the hills. His son lives in Chandigarh." },
      ],
      decisions: [
        {
          id: "sm4a",
          kind: "family",
          skill: "depression:apply",
          prompt: "What do you plan for discharge?",
          options: [
            o("a", "best", "Continue antidepressant treatment for a long time, store the revolver with the son, arrange regular calls and a neighbour's check, link him to a senior citizens' group, and talk about his grief for his wife.", "Late-life depression often returns. Social contact, means safety and ongoing treatment protect him.", { risk: -15, adherence: 15, family: 10 }),
            o("b", "poor", "Discharge with no follow-up now that he is eating.", "Relapse risk is high, especially after ECT.", { risk: 15 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Morning walks on the Ridge", text: "Mr Thakur walks with retired friends every morning and tutors a neighbour's child. He talks about his wife with tears and with smiles." },
    { min: 50, title: "Getting by", text: "He is eating and safe, but lonely in the big house." },
    { min: 0, title: "Found in time", text: "Soon after discharge, a neighbour finds him not eating again. He is readmitted, very weak." },
  ],
};

export const CAMPAIGNS_D: Campaign[] = [chandigarh, nagpur, patna, bhopal, shimla];
