/**
 * Ward Week campaigns, set E: a homeless man with psychosis under the Mental
 * Healthcare Act, autism in a toddler, somatic symptom disorder, postpartum
 * psychosis, clozapine for resistant schizophrenia and gaming disorder.
 * Original teaching stories; the player is a trainee psychologist on the team.
 */
import type { Campaign } from "./engine";
import { o, tags } from "./kit";

/* ------------------------------------------------------------ Varanasi */
const varanasi: Campaign = {
  id: "varanasi",
  tags: tags("Homeless person with psychosis and the law", "ethics-law", "Use the Mental Healthcare Act to care for a homeless person with psychosis, protect his rights and work towards reuniting him with family."),
  title: "Found at the ghats",
  patient: "A man of about 40, name unknown",
  place: "Emergency psychiatry, district hospital, Varanasi",
  blurb: "Police bring him from the riverbank: thin, barefoot, talking to the air, with a wound on his foot. He has been sleeping near the ghats for months.",
  start: { risk: 65, trust: 20, insight: 10, family: 10, adherence: 25 },
  chapters: [
    {
      id: "vr1",
      title: "Session 1 · The police jeep",
      beats: [
        { text: "The constable says, 'We can keep him in the lock-up overnight and bring him back tomorrow.' The man mutters in Bhojpuri and flinches when touched." },
      ],
      decisions: [
        {
          id: "vr1a",
          kind: "referral",
          skill: "ethics-law:apply",
          prompt: "What do you tell the constable?",
          options: [
            o("a", "best", "Under the Mental Healthcare Act, police should bring a wandering person who seems mentally ill and unable to care for himself to the nearest public health facility, not a lock-up. He stays here for assessment, and his treatment is free.", "The Act gives a clear route that protects the person and rules out jail for illness. Homeless people are entitled to free care.", { risk: -15, trust: 5 }, ["admitted"]),
            o("b", "harm", "Agree to the lock-up for one night.", "Holding a person with mental illness in a police lock-up breaches the law and puts him at risk.", { risk: 20, trust: -10 }),
            o("c", "poor", "Send him to a shelter home tonight without assessment.", "He may have a medical emergency and needs assessment first.", { risk: 10 }),
          ],
        },
        {
          id: "vr1b",
          kind: "assessment",
          skill: "psychosis:apply",
          prompt: "What do you check first?",
          options: [
            o("a", "best", "His physical health (the infected foot, hydration, nutrition, signs of TB, injuries), a sugar check, and then his mental state in Bhojpuri with an interpreter if needed, gently and with time.", "Homeless people with psychosis often have serious untreated physical illness. Speaking his language builds trust.", { risk: -15, trust: 15 }, ["physical"]),
            o("b", "poor", "Start antipsychotic injection right away so he settles.", "Medical problems may be missed; first find out what is wrong.", { trust: -10 }),
          ],
        },
      ],
    },
    {
      id: "vr2",
      title: "Session 2 · A name",
      beats: [
        { when: { flag: "physical" }, text: "His foot needs antibiotics and dressing; his chest X-ray is clear. After a few days he tells you his name is Ramdev and he is from a village in Bihar." },
        { text: "He believes 'the government has put a chip in my head'. He agrees to take tablets 'if they make the chip quiet'." },
      ],
      decisions: [
        {
          id: "vr2a",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "What medicine plan do you support?",
          options: [
            o("a", "best", "An antipsychotic he agrees to, starting low, with checks for side effects and for weight and sugar, explained in his words. Consider a long-acting injection later if he chooses it.", "Agreed treatment is better than forced treatment. A long-acting option, if he wants it, helps after discharge.", { adherence: 15, trust: 10 }),
            o("b", "harm", "High-dose injections twice a day to settle him fast.", "Heavy dosing causes stiffness and sedation and destroys trust.", { trust: -20, adherence: -10 }),
          ],
        },
      ],
    },
    {
      id: "vr3",
      title: "Session 3 · Looking for family",
      beats: [
        { text: "Ramdev remembers a brother and a temple near his village. He worries, 'They will be angry. I ran away.'" },
      ],
      decisions: [
        {
          id: "vr3a",
          kind: "family",
          skill: "ethics-law:apply",
          prompt: "How do you try to reunite him?",
          options: [
            o("a", "best", "With his consent, work with the hospital social worker, local police and a reunification NGO to trace his village, and let him decide whether and how to contact his brother.", "Many homeless people with mental illness have families searching for them. Consent and choice keep it his decision.", { family: 25, trust: 10 }, ["traced"]),
            o("b", "poor", "Put his photo on social media without asking him.", "Sharing his image and illness without consent breaches his privacy.", { trust: -15 }),
            o("c", "ok", "Wait until he is fully well before trying.", "Kind, but tracing can take time and gives hope during recovery.", { family: 5 }),
          ],
        },
      ],
    },
    {
      id: "vr4",
      title: "Session 4 · The brother",
      beats: [
        { when: { flag: "traced" }, text: "His brother Shyam arrives by bus, in tears. 'We searched for two years. We thought he was dead.'" },
        { when: { notFlag: "traced" }, text: "No family has been found. Ramdev asks where he will go when he leaves." },
      ],
      decisions: [
        {
          id: "vr4a",
          kind: "referral",
          skill: "psychosis:apply",
          prompt: "What discharge plan protects him?",
          options: [
            o("a", "best", "A written plan in Hindi: medicines and where to get them free near his village (the district mental health programme), early warning signs, and a follow-up date. If no family, a halfway home rather than the street.", "Continuity of care closer to home prevents a return to the streets.", { adherence: 15, risk: -15, insight: 10 }),
            o("b", "harm", "Discharge him to the hospital gate once his symptoms settle.", "Discharge to homelessness almost guarantees relapse.", { risk: 20, adherence: -15 }),
          ],
        },
        {
          id: "vr4b",
          kind: "psychoeducation",
          skill: "psychosis:apply",
          prompt: "How do you prepare the family?",
          options: [
            o("a", "best", "Explain his illness simply, without blame, that stopping medicine often leads to relapse, and the signs to come back early. Ask about their worries and the village's views.", "Prepared families support recovery and reduce stigma.", { family: 15, insight: 10 }),
            o("b", "poor", "Tell them to keep him at home and not let him out.", "Confinement at home isn't care.", { family: -5 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Home for Chhath", text: "Ramdev is home in time for the festival. He collects his tablets at the district hospital every month and helps his brother on the farm." },
    { min: 50, title: "A halfway home", text: "Ramdev lives in a halfway home and is stable, though family contact is patchy." },
    { min: 0, title: "Back on the street", text: "Ramdev is discharged without a plan and is found again at the ghats a few months later." },
  ],
};

/* ------------------------------------------------------------ Surat */
const surat: Campaign = {
  id: "surat",
  tags: tags("Autism in a toddler", "child", "Assess possible autism in a young child, share the diagnosis kindly and steer the family to evidence-based early help.", 4),
  title: "No words yet",
  patient: "Kabir, 3, only child",
  place: "Child development centre, Surat",
  blurb: "He has no words, doesn't answer to his name and spins the wheels of his toy car for hours. His grandmother says, 'Boys talk late. His father did.'",
  start: { risk: 35, trust: 40, insight: 20, family: 40, adherence: 35 },
  chapters: [
    {
      id: "sr1",
      title: "Session 1 · Watching him play",
      beats: [
        { text: "Kabir lines up blocks along the wall. He doesn't look when you call his name or point at a bird. He flaps his hands when the fan turns. His mother Riya says he once said 'mama' at 15 months, then stopped." },
      ],
      decisions: [
        {
          id: "sr1a",
          kind: "assessment",
          skill: "child:recognise",
          prompt: "What do you do?",
          options: [
            o("a", "best", "Arrange a hearing test, take a full developmental history including the lost word, and use a structured autism assessment by the team.", "Lost words, no response to name, little shared attention and repetitive play are autism red flags. Hearing must be checked.", { insight: 15, trust: 10 }, ["assessed"]),
            o("b", "poor", "Agree with the grandmother and review in a year.", "Waiting loses the years when early help works best.", { insight: -10 }),
            o("c", "ok", "Refer to speech therapy only.", "Speech therapy helps, but the wider picture needs assessment.", { insight: 5 }),
          ],
        },
      ],
    },
    {
      id: "sr2",
      title: "Session 2 · Sharing the diagnosis",
      beats: [
        { when: { flag: "assessed" }, text: "His hearing is normal. The team agrees on autism spectrum disorder with language delay." },
        { text: "Riya begins to cry. Her husband Nikhil asks, 'Will he ever be normal? Is it because of the vaccine?'" },
      ],
      decisions: [
        {
          id: "sr2a",
          kind: "psychoeducation",
          skill: "child:apply",
          prompt: "How do you share it?",
          options: [
            o("a", "best", "Give the diagnosis clearly and kindly, describe Kabir's strengths, explain that autism is a lifelong difference in development, not caused by vaccines or parenting, and that early help improves communication and daily life.", "Clear, hopeful, honest information helps parents grieve and act. The vaccine myth has been disproved.", { family: 15, insight: 15, trust: 10 }),
            o("b", "poor", "Say he will grow out of it.", "False hope delays help.", { insight: -10 }),
            o("c", "harm", "Tell them nothing can be done.", "This is untrue and removes hope.", { family: -15, adherence: -10 }),
          ],
        },
      ],
    },
    {
      id: "sr3",
      title: "Session 3 · What helps",
      beats: [
        { text: "A relative has sent a video of a clinic offering 'stem cell therapy to cure autism' for several lakhs." },
      ],
      decisions: [
        {
          id: "sr3a",
          kind: "referral",
          skill: "child:apply",
          prompt: "What do you advise?",
          options: [
            o("a", "best", "Explain that stem cell treatment for autism is unproven and not approved, and can be risky. Recommend parent-mediated early intervention, speech and occupational therapy, and a disability certificate for support.", "Evidence-based early intervention helps; unproven costly treatments drain families and can harm.", { adherence: 20, trust: 10 }, ["early"]),
            o("b", "harm", "Say it might be worth a try.", "Endorsing an unproven, invasive treatment can cause harm and financial ruin.", { risk: 15, adherence: -10 }),
          ],
        },
        {
          id: "sr3b",
          kind: "family",
          skill: "child:apply",
          prompt: "What can the parents do at home?",
          options: [
            o("a", "best", "Short daily play sessions following Kabir's lead, using his interests (the fan, the car), simple words, picture cards for routines and waiting for him to communicate.", "Parent-mediated play builds communication in everyday life.", { family: 20, insight: 10 }),
            o("b", "poor", "Hours of drilling flashcards every day.", "Rigid drilling without play rarely builds real communication.", { family: -5 }),
          ],
        },
      ],
    },
    {
      id: "sr4",
      title: "Session 4 · Six months later",
      beats: [
        { when: { flag: "early" }, text: "Kabir now points to ask for biscuits and uses five words. He still lines up blocks but lets his mother join." },
        { text: "The family worries about pre-school. 'Will they take him?'" },
      ],
      decisions: [
        {
          id: "sr4a",
          kind: "referral",
          skill: "child:apply",
          prompt: "What do you help with?",
          options: [
            o("a", "best", "Visit pre-schools with an inclusive approach, share a short profile of what helps Kabir, and plan a shadow teacher if needed. Check how the parents are coping.", "Inclusive schooling with support is his right and helps his development. Parents of autistic children have high stress.", { family: 15, adherence: 10, risk: -10 }),
            o("b", "poor", "Keep him at home until he talks properly.", "Isolation limits learning with other children.", { family: -5 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "First day at school", text: "Kabir joins an inclusive pre-school with a shadow teacher. He waves goodbye to his mother, which he has never done before." },
    { min: 50, title: "Small steps", text: "Kabir makes slow progress. Therapy is irregular because of cost and travel." },
    { min: 0, title: "Lost years", text: "The family spends their savings on unproven treatments. Kabir reaches five with no therapy and few words." },
  ],
};

/* ------------------------------------------------------------ Madurai */
const madurai: Campaign = {
  id: "madurai",
  tags: tags("Somatic symptom disorder", "depression", "Help a person with many body symptoms by limiting needless tests, treating hidden depression and building one trusted care plan.", 4),
  title: "Every doctor in town",
  patient: "Lakshmi, 42, homemaker",
  place: "Medicine OPD, government hospital, Madurai",
  blurb: "Burning feet, a heavy head, gas, chest pain and weakness for three years. Her file holds two endoscopies, four ECGs and a scan. All normal.",
  start: { risk: 45, trust: 30, insight: 15, family: 35, adherence: 30 },
  chapters: [
    {
      id: "md1",
      title: "Session 1 · The thick file",
      beats: [
        { text: "Lakshmi lays out her reports. 'Nobody finds anything. They say it's only tension. But the pain is real!'" },
      ],
      decisions: [
        {
          id: "md1a",
          kind: "assessment",
          skill: "depression:apply",
          prompt: "How do you start?",
          options: [
            o("a", "best", "Accept that her symptoms are real, ask how they affect her days, and gently screen for depression, anxiety, stress at home and her own ideas about the cause.", "Feeling believed is the start of treatment. Depression and anxiety often show as body symptoms, especially in primary care.", { trust: 20, insight: 10 }, ["believed"]),
            o("b", "harm", "Tell her it's all in her mind and she should stop wasting doctors' time.", "This shames her and sends her to the next doctor and more tests.", { trust: -25 }),
            o("c", "poor", "Order another endoscopy to reassure her.", "More tests feed the cycle of worry.", { insight: -10 }),
          ],
        },
      ],
    },
    {
      id: "md2",
      title: "Session 2 · Underneath",
      beats: [
        { when: { flag: "believed" }, text: "Lakshmi says her husband drinks and her son failed his exams. She sleeps badly, cries alone and feels 'no use to anyone'." },
        { text: "She asks for a tonic and vitamin injections." },
      ],
      decisions: [
        {
          id: "md2a",
          kind: "psychoeducation",
          skill: "depression:apply",
          prompt: "How do you explain the link?",
          options: [
            o("a", "best", "Explain that stress and low mood change how the body and nerves feel pain, like turning up the volume. The symptoms are real, and treating the mood and stress can turn the volume down.", "A body-mind explanation that doesn't blame her makes treatment acceptable.", { insight: 20, trust: 10 }),
            o("b", "poor", "Give the vitamin injections to keep her happy.", "Unneeded injections confirm a wrong idea and cost money.", { insight: -5 }),
          ],
        },
        {
          id: "md2b",
          kind: "medicines",
          skill: "antidepressants:pharm",
          prompt: "She meets criteria for depression. What do you discuss with the doctor?",
          options: [
            o("a", "best", "An antidepressant that also helps pain, such as duloxetine or a low-dose tricyclic, explained as treating both pain and mood, with side effects discussed.", "Some antidepressants ease chronic pain as well as depression.", { adherence: 15, risk: -5 }),
            o("b", "harm", "Regular tramadol for the pain.", "Opioids for long-standing unexplained pain risk dependence and don't help mood.", { risk: 15 }),
          ],
        },
      ],
    },
    {
      id: "md3",
      title: "Session 3 · One doctor",
      beats: [
        { text: "Lakshmi still visits two private clinics each month." },
      ],
      decisions: [
        {
          id: "md3a",
          kind: "referral",
          skill: "depression:apply",
          prompt: "What care plan do you suggest?",
          options: [
            o("a", "best", "One named doctor, regular short visits booked ahead (not only when symptoms flare), a brief physical check each time, tests only for new signs, and CBT focused on living well with the symptoms.", "Scheduled visits break the link between symptoms and care. One coordinator prevents duplicated tests.", { trust: 10, adherence: 15, insight: 10 }, ["plan"]),
            o("b", "poor", "Discharge her from the clinic since nothing is wrong.", "She will simply go elsewhere for more tests.", { trust: -15 }),
          ],
        },
      ],
    },
    {
      id: "md4",
      title: "Session 4 · Home",
      beats: [
        { text: "Her husband comes for the first time. 'She is always complaining. What is the real problem?'" },
      ],
      decisions: [
        {
          id: "md4a",
          kind: "family",
          skill: "depression:apply",
          prompt: "How do you involve him?",
          options: [
            o("a", "best", "With her consent, explain depression and how body symptoms come with it, ask how he can support her, and gently raise his drinking and where he can get help.", "Family stress feeds her symptoms; addressing it helps both.", { family: 20, risk: -10 }),
            o("b", "poor", "Tell him she just needs more rest.", "Misses the chance to change what is driving her distress.", { family: -5 }),
          ],
        },
        {
          id: "md4b",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "She mentions she once thought of drinking the cockroach poison at home. What do you do?",
          options: [
            o("a", "best", "Ask about current thoughts and plans, make a safety plan, and ask that household poisons be kept locked or out of the house.", "Pesticides and poisons are a common means of suicide in India; restricting access saves lives.", { risk: -20 }),
            o("b", "poor", "Note it and move on; it was in the past.", "Past thoughts are a warning that needs checking now.", { risk: 15 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Fewer visits, more life", text: "Lakshmi sees one doctor once a month. The pain is still there some days, but she has joined a self-help group and sells her pickles at the market." },
    { min: 50, title: "Still searching", text: "Her mood is better, but she still visits other clinics for tests." },
    { min: 0, title: "More tests, more pain", text: "Lakshmi goes from clinic to clinic, collecting tests and tablets. She feels nobody believes her." },
  ],
};

/* ------------------------------------------------------------ Guwahati */
const guwahati: Campaign = {
  id: "guwahati",
  tags: tags("Postpartum psychosis", "bipolar", "Recognise postpartum psychosis as an emergency, keep mother and baby safe and plan treatment with breastfeeding in mind."),
  title: "Five days after",
  patient: "Bornali, 26, first baby",
  place: "Obstetric ward, medical college, Guwahati",
  blurb: "Five days after a normal delivery she hasn't slept, talks fast, and says the baby is 'not mine, they switched him'. Her mother had a 'nervous breakdown' after her own delivery.",
  start: { risk: 80, trust: 35, insight: 10, family: 45, adherence: 35 },
  chapters: [
    {
      id: "gw1",
      title: "Session 1 · A call from the obstetric ward",
      beats: [
        { text: "Bornali paces, laughing then crying. She whispers that the nurses are agents and the baby has been replaced. The baby is with her in the bed." },
      ],
      decisions: [
        {
          id: "gw1a",
          kind: "risk",
          skill: "bipolar:risk",
          prompt: "What do you do first?",
          options: [
            o("a", "best", "Treat this as a psychiatric emergency: postpartum psychosis. Ask for urgent psychiatric review today, a staff member or family with her and the baby at all times, and check for delirium, infection and thyroid problems.", "Postpartum psychosis begins suddenly in the days after birth and carries risk to mother and baby. It needs same-day care.", { risk: -25, family: 5 }, ["emergency"]),
            o("b", "harm", "Call it baby blues and tell her to rest.", "Baby blues don't cause delusions. Missing psychosis risks suicide and harm to the baby.", { risk: 25 }),
            o("c", "poor", "Book an outpatient appointment for next month.", "Far too slow for an emergency.", { risk: 20 }),
          ],
        },
        {
          id: "gw1b",
          kind: "assessment",
          skill: "bipolar:differentiate",
          prompt: "Her history of family illness: why does it matter?",
          options: [
            o("a", "best", "A mother with postpartum illness, and the fast speech and no sleep, point to a bipolar link. This affects medicine choice and the risk in future pregnancies.", "Postpartum psychosis is closely linked to bipolar disorder and family history.", { insight: 10 }),
            o("b", "poor", "It doesn't; postpartum illness is only hormones.", "Family history is one of the strongest risk factors.", { insight: -5 }),
          ],
        },
      ],
    },
    {
      id: "gw2",
      title: "Session 2 · Treatment",
      beats: [
        { when: { flag: "emergency" }, text: "Bornali is admitted. Tests are normal. Her husband Pranjal asks, 'Can she keep feeding the baby?'" },
      ],
      decisions: [
        {
          id: "gw2a",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "What do you discuss with the psychiatrist?",
          options: [
            o("a", "best", "An antipsychotic (for example olanzapine or quetiapine), with mood-stabilising treatment considered, and a plan for feeding: weigh benefits, watch the baby for drowsiness, and support expressed milk or formula at night so she can sleep.", "Rapid treatment is vital. Several antipsychotics are used while breastfeeding with monitoring; protected sleep helps recovery.", { risk: -20, adherence: 15 }, ["treated"]),
            o("b", "harm", "Valproate, because it calms mania quickly.", "Valproate carries serious risks for any future pregnancy and is generally avoided in women who could conceive.", { risk: 10 }),
            o("c", "poor", "No medicine because she is breastfeeding.", "Untreated postpartum psychosis is far more dangerous than carefully chosen medicine.", { risk: 20 }),
          ],
        },
      ],
    },
    {
      id: "gw3",
      title: "Session 3 · Mother and baby",
      beats: [
        { text: "Bornali is calmer. She cries: 'I said terrible things about my son. Will they take him away?'" },
      ],
      decisions: [
        {
          id: "gw3a",
          kind: "family",
          skill: "bipolar:apply",
          prompt: "How do you support bonding?",
          options: [
            o("a", "best", "Explain the illness, not her character, caused the thoughts. Plan supervised time with the baby each day, growing as she recovers, with family helping and staff watching.", "Keeping mother and baby together safely supports bonding and recovery, the idea behind mother-baby units.", { family: 20, trust: 15, insight: 15 }),
            o("b", "poor", "Keep the baby away until she is fully well.", "Long separation harms bonding when safe contact is possible.", { family: -10 }),
          ],
        },
      ],
    },
    {
      id: "gw4",
      title: "Session 4 · Looking ahead",
      beats: [
        { text: "Bornali is going home. 'Could this happen again?'" },
      ],
      decisions: [
        {
          id: "gw4a",
          kind: "psychoeducation",
          skill: "bipolar:apply",
          prompt: "What do you tell her?",
          options: [
            o("a", "best", "The risk is high after a future birth, and there is also a risk of bipolar episodes at other times. A plan made before any future pregnancy, with preventive medicine discussed, sharply lowers it.", "Honest risk talk with a plan gives her control.", { insight: 15, risk: -10 }),
            o("b", "poor", "It won't happen again.", "False reassurance leaves her unprepared.", { insight: -10 }),
          ],
        },
        {
          id: "gw4b",
          kind: "referral",
          skill: "bipolar:apply",
          prompt: "What follow-up do you arrange?",
          options: [
            o("a", "best", "Close psychiatric follow-up, a home visit by the community health worker, early warning signs (no sleep, racing thoughts) with numbers to call, and a review of her mood over the coming months.", "Relapse and depression after postpartum psychosis are common; early follow-up catches them.", { adherence: 15, risk: -10 }),
            o("b", "harm", "Stop the medicine at discharge since she is better.", "Stopping early after postpartum psychosis risks quick relapse.", { risk: 20 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Bihu with the baby", text: "Bornali carries her son to the Bihu celebrations. She sleeps well, takes her medicine and knows what to do if sleep slips." },
    { min: 50, title: "Recovering slowly", text: "Bornali is well but low, and the family carries most of the baby's care." },
    { min: 0, title: "A frightening night", text: "Bornali relapses at home after stopping medicine, and is readmitted in crisis." },
  ],
};

/* ------------------------------------------------------------ Ranchi */
const ranchi: Campaign = {
  id: "ranchi",
  tags: tags("Clozapine for resistant schizophrenia", "antipsychotics", "Recognise treatment-resistant schizophrenia and start clozapine safely with blood monitoring."),
  title: "Third time lucky",
  patient: "Sunil, 31, former bank clerk",
  place: "Long-stay psychiatry ward, Ranchi",
  blurb: "Ten years of schizophrenia. Two antipsychotics at full dose, each for months, and he still hears voices most of the day. He lost his job and smokes 30 cigarettes a day.",
  start: { risk: 55, trust: 40, insight: 25, family: 35, adherence: 45 },
  chapters: [
    {
      id: "rc1",
      title: "Session 1 · Review",
      beats: [
        { text: "Sunil says the voices call him a failure. His mother confirms he took his tablets: she watched him. He has never had clozapine." },
      ],
      decisions: [
        {
          id: "rc1a",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "What do you suggest to the psychiatrist?",
          options: [
            o("a", "best", "He meets treatment resistance (two adequate trials, adherence confirmed). Suggest clozapine, the only medicine proven better in this situation.", "Clozapine helps many who fail other antipsychotics; delaying it costs years.", { insight: 10, adherence: 10 }, ["clozapine"]),
            o("b", "poor", "Try a third ordinary antipsychotic first.", "After two failed trials, clozapine is the evidence-based next step.", { adherence: -5 }),
            o("c", "harm", "Combine three antipsychotics at high doses.", "High-dose combinations add side effects without clear benefit.", { risk: 15 }),
          ],
        },
      ],
    },
    {
      id: "rc2",
      title: "Session 2 · Starting clozapine",
      beats: [
        { text: "Sunil agrees. His mother asks what to watch out for." },
      ],
      decisions: [
        {
          id: "rc2a",
          kind: "psychoeducation",
          skill: "antipsychotics:pharm",
          prompt: "What must the start plan include?",
          options: [
            o("a", "best", "Regular blood counts (most often at the start) to catch a fall in white cells, a slow dose build-up, pulse and temperature checks for heart inflammation early on, and action on constipation, drooling and sleepiness.", "Low white cells, myocarditis and severe constipation are the dangerous side effects. A slow start and monitoring keep him safe.", { risk: -20, adherence: 15 }, ["monitor"]),
            o("b", "harm", "No blood tests needed if he feels well.", "Low white cells give no early warning signs; only blood tests catch them.", { risk: 25 }),
          ],
        },
        {
          id: "rc2b",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "Sunil says, 'If this works, I'll quit smoking too.' What do you flag?",
          options: [
            o("a", "best", "Support quitting, and tell the team first: smoking lowers clozapine levels, so stopping can raise levels sharply and the dose may need lowering.", "Tobacco smoke speeds clozapine breakdown. Quitting without adjusting can cause toxicity, including fits.", { risk: -10, insight: 10 }),
            o("b", "poor", "Discourage quitting because it affects his levels.", "Quitting is good for him; it just needs planning.", { risk: 5 }),
          ],
        },
      ],
    },
    {
      id: "rc3",
      title: "Session 3 · Side effects",
      beats: [
        { text: "Sunil complains of drooling at night and has not opened his bowels for four days. His abdomen is bloated." },
      ],
      decisions: [
        {
          id: "rc3a",
          kind: "risk",
          skill: "antipsychotics:pharm",
          prompt: "What do you do?",
          options: [
            o("a", "best", "Report the constipation to the doctor today: clozapine can cause a dangerous bowel blockage. Ask about laxatives, fluids and fibre, and treat drooling with practical steps.", "Clozapine-induced bowel slowing can be fatal if ignored.", { risk: -20, trust: 10 }),
            o("b", "harm", "Tell him it's normal and to wait.", "A bloated abdomen with no stools on clozapine is a warning sign.", { risk: 20 }),
          ],
        },
      ],
    },
    {
      id: "rc4",
      title: "Session 4 · Life after voices",
      beats: [
        { when: { flag: "monitor" }, text: "The voices are much quieter. 'For the first time in years I can read the newspaper.'" },
        { text: "His mother asks about him working again." },
      ],
      decisions: [
        {
          id: "rc4a",
          kind: "referral",
          skill: "psychosis:apply",
          prompt: "What do you set up?",
          options: [
            o("a", "best", "Vocational rehabilitation with supported work, social skills groups, a plan to keep up blood tests and family sessions on recognising early relapse.", "Recovery is more than symptom control; work and routine give meaning.", { adherence: 15, family: 15, insight: 10 }),
            o("b", "poor", "Keep him on the ward until he has no voices at all.", "Waiting for perfect symptom control delays a life worth living.", { trust: -10 }),
          ],
        },
        {
          id: "rc4b",
          kind: "family",
          skill: "psychosis:apply",
          prompt: "What should the family know about missed doses?",
          options: [
            o("a", "best", "If he misses more than two days, he must not restart at his full dose: call the team, as it needs to be built up again.", "Restarting clozapine at full dose after a gap can cause collapse and fits.", { risk: -15, family: 10 }),
            o("b", "harm", "Give a double dose to catch up.", "Doubling clozapine is dangerous.", { risk: 25 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "A desk job again", text: "Sunil works part-time in a cooperative office. He gets his blood tested every month and has cut down to five cigarettes a day." },
    { min: 50, title: "Quieter voices", text: "Sunil is better but spends most days at home. Clozapine checks are sometimes missed." },
    { min: 0, title: "A dangerous stop", text: "Sunil's clozapine is stopped after a serious side effect that was caught late. His voices return." },
  ],
};

/* ------------------------------------------------------------ Noida */
const noida: Campaign = {
  id: "noida",
  tags: tags("Gaming disorder in a teenager", "child", "Assess gaming disorder and plan a family-agreed, graded change with treatment of what lies underneath.", 4),
  title: "One more match",
  patient: "Aarav, 15, class 10 student",
  place: "Adolescent clinic, Noida",
  blurb: "He plays online battle games until 4 am, has skipped school for two months and smashed the TV when his father took his phone.",
  start: { risk: 50, trust: 25, insight: 15, family: 25, adherence: 30 },
  chapters: [
    {
      id: "nd1",
      title: "Session 1 · Headphones on",
      beats: [
        { text: "Aarav keeps one earbud in. 'Gaming is the only place I'm good at something. At school I'm a nobody.' His father wants a 'strict hostel'." },
      ],
      decisions: [
        {
          id: "nd1a",
          kind: "assessment",
          skill: "child:apply",
          prompt: "How do you assess?",
          options: [
            o("a", "best", "See him alone first. Ask what gaming gives him, map loss of control and the harms, and screen for depression, social anxiety, bullying, ADHD and sleep.", "Gaming problems often sit on top of depression, anxiety, ADHD or bullying. Understanding the function guides treatment.", { trust: 20, insight: 10 }, ["assessed"]),
            o("b", "harm", "Agree to the hostel and confiscate all devices today.", "Sudden, forced removal without a plan often leads to aggression and secret use.", { trust: -20, risk: 15, family: -5 }),
            o("c", "poor", "Lecture him on how games rot the brain.", "Lectures close conversation.", { trust: -10 }),
          ],
        },
      ],
    },
    {
      id: "nd2",
      title: "Session 2 · What is underneath",
      beats: [
        { when: { flag: "assessed" }, text: "Aarav admits classmates mocked him after he failed a test. Since then he feels low, can't face school and plays to forget." },
      ],
      decisions: [
        {
          id: "nd2a",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "He says, 'Sometimes I think everyone would be fine without me.' What do you do?",
          options: [
            o("a", "best", "Ask directly about suicidal thoughts and plans, involve his parents in a safety plan, and treat his depression alongside the gaming.", "Low mood and hopelessness need risk assessment. Treating depression often reduces problem gaming.", { risk: -20, trust: 10 }, ["safety"]),
            o("b", "poor", "Say that he just needs to stop gaming and he'll feel better.", "This ignores the depression and the risk.", { risk: 15 }),
          ],
        },
      ],
    },
    {
      id: "nd3",
      title: "Session 3 · A family agreement",
      beats: [
        { text: "The family meets. His mother cries, his father shouts, Aarav stares at the floor." },
      ],
      decisions: [
        {
          id: "nd3a",
          kind: "family",
          skill: "child:apply",
          prompt: "How do you help them agree a plan?",
          options: [
            o("a", "best", "Help them agree, together, on gaming times that step down gradually, devices out of the bedroom at night, a set wake-up time, and time doing things with his father. Rewards for keeping the plan, not just punishments.", "Plans the teenager helps write work better. Sleep and shared activity are key.", { family: 25, adherence: 15 }, ["agreement"]),
            o("b", "poor", "Ban gaming completely forever.", "Total bans for teenagers rarely hold; gradual control works better.", { family: -5, adherence: -10 }),
          ],
        },
        {
          id: "nd3b",
          kind: "referral",
          skill: "child:apply",
          prompt: "What about school?",
          options: [
            o("a", "best", "Plan a graded return with the school counsellor, address the bullying, and support his exam preparation in small steps.", "Returning to school with support addresses the avoidance and the bullying behind it.", { insight: 10, risk: -10 }),
            o("b", "poor", "Let him skip class 10 this year.", "Long absence deepens avoidance.", { insight: -5 }),
          ],
        },
      ],
    },
    {
      id: "nd4",
      title: "Session 4 · Review",
      beats: [
        { when: { flag: "agreement" }, text: "Aarav plays two hours on weekdays and more on Sundays. He is back at school most days. He joined the school e-sports club, which meets in daylight." },
      ],
      decisions: [
        {
          id: "nd4a",
          kind: "psychoeducation",
          skill: "child:apply",
          prompt: "What do you work on next?",
          options: [
            o("a", "best", "CBT for his low mood and the thought 'I'm a nobody', and build strengths off-screen, with a plan for exam stress and late-night urges.", "Treating the low mood and building other sources of pride sustains change.", { insight: 15, risk: -10, trust: 10 }),
            o("b", "poor", "Discharge now that he games less.", "The low mood that drove the gaming is still there.", { risk: 5 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Board exams written", text: "Aarav sits his class 10 exams and passes. He still games, on a schedule he helped set, and goes cycling with his father on Sundays." },
    { min: 50, title: "A shaky truce", text: "Gaming is down, but fights at home continue and school attendance is patchy." },
    { min: 0, title: "Locked door", text: "After a forced hostel stay, Aarav returns more withdrawn and games in secret all night." },
  ],
};

export const CAMPAIGNS_E: Campaign[] = [varanasi, surat, madurai, guwahati, ranchi, noida];
