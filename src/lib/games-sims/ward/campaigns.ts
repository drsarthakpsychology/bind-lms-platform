/**
 * Ward Week campaigns. Original teaching stories; the player is a trainee
 * psychologist on the team, so medicine decisions are what you raise and
 * agree with the psychiatrist. Risk content is for learning.
 */
import type { Campaign, Quality, Vars, WardOption } from "./engine";

const o = (id: string, q: Quality, text: string, why: string, fx: Partial<Vars> = {}, set: string[] = []): WardOption => ({ id, q, text, why, fx, set });

/* ------------------------------------------------------------ Pune */
const pune: Campaign = {
  id: "pune",
  title: "First voices",
  patient: "Aditya, 22, engineering student",
  place: "Psychiatry OPD, Pune",
  blurb: "His parents bring him in: he has stopped attending class, barely eats the hostel food and talks to someone who isn't there.",
  start: { risk: 50, trust: 35, insight: 20, family: 45, adherence: 40 },
  chapters: [
    {
      id: "p1",
      title: "Session 1 · The first meeting",
      beats: [
        { text: "Aditya sits with his hood up, eyes on the door. His father does the talking: 'He was a topper. For months now he locks his room and says his roommates are against him.'" },
        { text: "His mother adds quietly that he smokes ganja with friends, 'but only sometimes'." },
      ],
      decisions: [
        {
          id: "p1a",
          kind: "assessment",
          skill: "psychosis:apply",
          prompt: "How do you begin?",
          options: [
            o("a", "best", "See Aditya alone first, then the parents. Open questions about what has been happening, in his words.", "Seeing him alone protects trust and lets him say things he can't say in front of his father. You still hear the family afterwards.", { trust: 15, insight: 5 }),
            o("b", "ok", "Keep the parents in the room the whole time so nothing is missed.", "Collateral history matters, but a suspicious young man may say nothing in front of his parents.", { trust: -5, family: 5 }),
            o("c", "harm", "Tell him early that this sounds like schizophrenia so he knows what he's dealing with.", "A label in the first minutes, before a full assessment, frightens and alienates. It is also often premature: first-episode psychosis has many causes.", { trust: -20, insight: -5 }),
            o("d", "poor", "Start with a urine drug test before talking, so you know what you're dealing with.", "Testing is useful, but leading with it feels like an accusation and costs trust.", { trust: -10 }),
          ],
        },
        {
          id: "p1b",
          kind: "risk",
          skill: "psychosis:risk",
          prompt: "Before he leaves today, what must you cover?",
          options: [
            o("a", "best", "A risk check: thoughts of harming himself or anyone else, voices that give orders, and whether he feels safe at the hostel. Plus a physical check and drug screen.", "Psychosis risk lives in the content: who he fears, what the voices say, what he might do to protect himself. Medical causes and substances must be ruled out early.", { risk: -15 }, ["riskChecked", "medicalCheck"]),
            o("b", "poor", "His full childhood and developmental history; risk can wait till next time.", "A thorough history is good, but risk can't wait. Unasked questions are unmanaged risks.", { risk: 10 }, ["noRiskCheck"]),
            o("c", "ok", "Request a brain scan and blood tests, and book a longer session for the rest.", "Ruling out medical causes is right, but you have left today without asking about danger.", { risk: 5 }, ["medicalCheck", "noRiskCheck"]),
          ],
        },
      ],
    },
    {
      id: "p2",
      title: "Session 2 · Making sense together",
      beats: [
        { when: { v: "trust", gte: 45 }, text: "This time Aditya talks. The voices are two men who comment on everything he does. He believes his roommates are adding poison to the mess food, so he eats only biscuits." },
        { when: { v: "trust", lte: 44 }, text: "Aditya says almost nothing. His mother tells you he has lost weight and eats only sealed biscuit packets." },
        { when: { flag: "medicalCheck" }, text: "His blood tests and scan are normal. The drug screen is positive for cannabis." },
      ],
      decisions: [
        {
          id: "p2a",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "The psychiatrist asks your view on medicine. What do you suggest?",
          options: [
            o("a", "best", "A low dose of a second-generation antipsychotic, increased slowly, with weight, sugar and lipids checked from the start.", "First-episode patients respond to lower doses and are more sensitive to side effects. Planning metabolic checks early protects his long-term health and his willingness to continue.", { adherence: 15, risk: -10 }, ["metabolicPlan"]),
            o("b", "harm", "A high dose so the voices stop fast and he can return to class.", "High doses in a first episode bring stiffness, restlessness and sedation without faster recovery. Side effects are the top reason young people stop.", { adherence: -15, risk: 5 }, ["eps"]),
            o("c", "poor", "No medicine for now; talking therapy only.", "Psychological work matters, but untreated psychosis with poor eating and fear of poisoning carries real risk. Therapy works best alongside medicine here.", { risk: 10 }),
            o("d", "harm", "Mix it into his food at home so he doesn't refuse.", "Covert medication without legal process breaks trust and his rights. If he finds out, he may never engage again.", { trust: -25, adherence: -10 }),
          ],
        },
        {
          id: "p2b",
          kind: "psychoeducation",
          skill: "psychosis:apply",
          prompt: "How do you explain what is happening?",
          options: [
            o("a", "best", "Use his own words: 'Your brain is under great stress and is making real-sounding voices. Many people recover well.' Ask what he makes of it.", "Starting from his experience, using stress and vulnerability, and holding hope builds insight without a fight.", { insight: 15, trust: 5 }),
            o("b", "poor", "Give him a printed leaflet about schizophrenia to read later.", "Leaflets help as a follow-up, not as the explanation. He may not read it, or may read the label and panic.", { insight: 3 }),
            o("c", "poor", "Tell him firmly the voices aren't real and he must stop believing them.", "Arguing with a delusion hardens it and costs trust. Curiosity works better than confrontation.", { trust: -10, insight: -5 }),
          ],
        },
      ],
    },
    {
      id: "p3",
      title: "Session 3 · Ganja and a phone call",
      beats: [
        { when: { flag: "noRiskCheck" }, text: "Before the session, the hostel warden calls: last night Aditya held a knife at his door, shouting at his roommate to 'stop the poison'. No one was hurt." },
        { when: { notFlag: "noRiskCheck" }, text: "Because you asked about his fears early, a safety plan is already in place: he moved to a cousin's flat and texts his mother each night." },
        { text: "He admits he smokes ganja most nights 'to calm the voices'. It helps for an hour, then they get louder." },
      ],
      decisions: [
        {
          id: "p3x",
          kind: "risk",
          skill: "psychosis:risk",
          when: { flag: "noRiskCheck" },
          prompt: "The knife incident. What now?",
          options: [
            o("a", "best", "Same-day review with the psychiatrist. Talk with Aditya and his family about a short admission to keep everyone safe, and a plan for the knife.", "Acting on a fear-driven threat with a weapon is urgent. A brief admission can be the safest, kindest step, done with him wherever possible.", { risk: -20, family: 5 }, ["riskChecked"]),
            o("b", "harm", "Keep the routine appointment next month; nobody was hurt.", "'Nobody was hurt' is luck. Risk rises when fear and a weapon meet.", { risk: 20 }),
            o("c", "poor", "Call the police to arrest him.", "Police may be needed in danger, but this moment needs a health response first.", { trust: -20, risk: -5 }),
          ],
        },
        {
          id: "p3a",
          kind: "psychoeducation",
          skill: "substance:apply",
          prompt: "How do you handle the cannabis?",
          options: [
            o("a", "best", "Explore it with him: what he gets from it, what it costs, how it links to the voices. Agree a goal he chooses, like cutting down first.", "A motivational approach respects his choice and links cannabis to his own goals. Continued use raises relapse risk in psychosis.", { risk: -10, insight: 5, adherence: 5 }, ["cannabisWork"]),
            o("b", "poor", "Warn him you'll tell his parents unless he stops today.", "Threats push use underground and wreck trust.", { trust: -15 }),
            o("c", "poor", "Leave it; one problem at a time.", "Cannabis is driving his voices. Ignoring it leaves a known risk running.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "p4",
      title: "Session 4 · The family meeting",
      beats: [
        { text: "His father: 'He's just become lazy and spoilt. In my time we didn't have depression and all.' His mother: 'We took him to a healer at the temple. Is this black magic?'" },
        { when: { v: "family", lte: 40 }, text: "His father keeps checking his phone and talks over Aditya. Aditya stares at the floor." },
      ],
      decisions: [
        {
          id: "p4a",
          kind: "family",
          skill: "psychosis:apply",
          prompt: "How do you run the meeting?",
          options: [
            o("a", "best", "Explain psychosis plainly, ask about their beliefs without mocking them, and show how calm, low-criticism support helps recovery. Agree early warning signs together.", "Family work cuts relapse. High criticism at home (high 'expressed emotion') predicts relapse. Respecting their beliefs keeps them on side.", { family: 20, risk: -10 }, ["familyPlan"]),
            o("b", "harm", "Tell the parents their strictness caused this.", "Blame is false and destroys the alliance. Families don't cause psychosis.", { family: -25, trust: -5 }),
            o("c", "poor", "Tell them black magic is superstition and they must stop visiting the healer.", "Dismissing their framework makes them choose between you and their faith. Many families use both; work alongside it.", { family: -10 }),
            o("d", "poor", "Skip the meeting: he's an adult and can manage alone.", "Adults keep their right to privacy, but with his consent family support is one of the strongest protective factors.", { family: -5 }),
          ],
        },
        {
          id: "p4b",
          kind: "referral",
          skill: "psychosis:apply",
          prompt: "He wants to go back to college. What do you set up?",
          options: [
            o("a", "best", "With his consent, refer to an early-intervention team and occupational therapy, and write to the college for a lighter, step-by-step return.", "Specialist early-intervention care improves outcomes. A graded return protects his future and his self-belief.", { insight: 5, adherence: 10, trust: 5 }, ["referred"]),
            o("b", "poor", "Advise him to drop out for a year to rest.", "Long inactivity and loss of role worsen outcomes. Most can return with support.", { trust: -5 }),
            o("c", "harm", "Tell the college his diagnosis so they keep an eye on him.", "Sharing without consent breaches confidentiality and can lead to stigma.", { trust: -25 }),
          ],
        },
      ],
    },
    {
      id: "p5",
      title: "Session 5 · Review",
      beats: [
        { when: { flag: "eps" }, text: "Aditya shuffles in, stiff, his hands trembling. 'These tablets make me a robot. I stopped them three days ago.'" },
        { when: { v: "adherence", gte: 55 }, text: "The voices are quieter, he eats in the mess again, and he has gained some weight." },
        { when: { v: "adherence", lte: 54 }, text: "He has missed many doses. 'I feel fine, why take them?'" },
      ],
      decisions: [
        {
          id: "p5a",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "What do you raise with the psychiatrist?",
          options: [
            o("a", "best", "Ask about every side effect, share them with the psychiatrist to adjust the dose or switch, and keep the weight and sugar checks going.", "Side effects named and acted on keep people on treatment. Weight gain is common with several antipsychotics and needs watching.", { adherence: 15, trust: 10 }),
            o("b", "poor", "Tell him to keep taking it exactly as before.", "Ignoring side effects is the fastest route to stopping.", { adherence: -10 }),
            o("c", "harm", "He feels fine, so suggest stopping medicine now.", "Stopping soon after a first episode carries a high relapse risk. Any stop should be planned and slow.", { risk: 20, adherence: -10 }),
          ],
        },
        {
          id: "p5b",
          kind: "risk",
          skill: "psychosis:risk",
          prompt: "Last task: what does he leave with?",
          options: [
            o("a", "best", "A written relapse plan with him and his family: his early signs (poor sleep, suspicion), who to call, and his cannabis goal.", "A relapse plan made together turns warning signs into action before a crisis.", { risk: -10, insight: 10 }),
            o("b", "poor", "'See you in six months.'", "Early psychosis needs close follow-up; relapse is common in the first years.", { risk: 10 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Back in class", text: "Aditya returns to college on a lighter timetable. He knows his early signs and texts his team when sleep slips. His father now drives him to appointments." },
    { min: 50, title: "Steady, but fragile", text: "The voices are quieter, but he takes medicine on and off, and home is tense. One bad month could tip him back." },
    { min: 0, title: "Readmitted", text: "Within the year Aditya is admitted after a frightening relapse. The trust you needed was never built; the next team has to start again." },
  ],
};

/* ------------------------------------------------------------ Chennai */
const chennai: Campaign = {
  id: "chennai",
  title: "The quiet house",
  patient: "Divya, 29, first-time mother",
  place: "Child health clinic, Chennai",
  blurb: "At her daughter's vaccination visit the nurse notices Divya hasn't smiled once. Her husband works in Bengaluru on weekdays.",
  start: { risk: 50, trust: 40, insight: 30, family: 40, adherence: 40 },
  chapters: [
    {
      id: "c1",
      title: "Session 1 · The vaccination visit",
      beats: [
        { text: "Divya holds the baby stiffly. 'I don't feel anything for her. I cry when everyone sleeps. My mother-in-law says it's the baby blues.' Her daughter is a month old." },
      ],
      decisions: [
        {
          id: "c1a",
          kind: "assessment",
          skill: "depression:apply",
          prompt: "What do you do?",
          options: [
            o("a", "best", "Find a private room. Use a postnatal depression screen, then ask her directly, kindly, about thoughts of harming herself or the baby.", "Baby blues are brief and settle on their own soon after birth; this has lasted too long. Direct questions about harm, asked kindly, don't plant ideas and often bring relief.", { trust: 10, risk: -10 }, ["asked"]),
            o("b", "poor", "Agree that it's baby blues and say it will pass.", "Baby blues are short and mild. Persistent low mood and no feeling for the baby suggest postnatal depression.", { risk: 15, insight: -5 }, ["missed"]),
            o("c", "ok", "Book her in with a psychologist for next month.", "A referral is reasonable, but you haven't checked her safety today.", { risk: 5 }, ["missed"]),
          ],
        },
        {
          id: "c1b",
          kind: "risk",
          skill: "ocd:differentiate",
          when: { flag: "asked" },
          prompt: "She whispers: 'I keep seeing myself dropping her from the balcony. I would never! I've stopped bathing her in case I do something.' How do you read this?",
          options: [
            o("a", "best", "These sound like unwanted, horrifying intrusive thoughts she resists. Such thoughts rarely lead to harm, but you still check for confusion, voices or strange beliefs, and her own suicide risk.", "Ego-dystonic intrusive thoughts (she hates them, avoids the baby to be safe) are common after birth and differ from psychotic ideas. Postpartum psychosis is rarer, comes on fast and is an emergency.", { trust: 15, insight: 10, risk: -5 }, ["intrusive"]),
            o("b", "harm", "Call child protection now and arrange for the baby to be taken from her.", "This misreads OCD-type thoughts as intent, punishes her for being honest and makes it less likely she'll ever disclose again.", { trust: -30, risk: 15, family: -10 }),
            o("c", "poor", "'Everyone has thoughts like that. Ignore them.' Move on.", "Normalising helps, but stopping there skips the checks for psychosis and her own risk, and leaves her alone with the fear.", { risk: 5 }),
          ],
        },
      ],
    },
    {
      id: "c2",
      title: "Session 2 · Medicines and milk",
      beats: [
        { when: { flag: "intrusive" }, text: "Divya looks lighter: 'You told me I'm not a monster. I bathed her yesterday with my mother-in-law beside me.'" },
        { when: { flag: "missed" }, text: "Divya has lost weight. She sleeps two hours a night even when the baby sleeps." },
        { text: "She asks: 'If I take tablets, can I still feed her?'" },
      ],
      decisions: [
        {
          id: "c2a",
          kind: "medicines",
          skill: "antidepressants:pharm",
          prompt: "What do you discuss with the psychiatrist?",
          options: [
            o("a", "best", "An antidepressant with good breastfeeding data (sertraline is a common choice), weighing benefits and risks with her, alongside psychological therapy.", "Some antidepressants pass into milk in only tiny amounts; sertraline has some of the most reassuring data. Untreated depression also harms mother and baby.", { adherence: 15, risk: -10 }, ["ssri"]),
            o("b", "poor", "Tell her she must stop breastfeeding to take any medicine.", "Usually unnecessary, and stopping feeding against her wishes can deepen guilt.", { trust: -10, adherence: 5 }),
            o("c", "poor", "Avoid all medicine because she is breastfeeding.", "With moderate to severe symptoms, avoiding treatment carries its own risk.", { risk: 10 }),
            o("d", "harm", "Suggest valproate to steady her mood.", "Valproate is not a treatment for postnatal depression and is avoided in women who could become pregnant because of serious risks to a baby.", { risk: 10, adherence: -5 }),
          ],
        },
        {
          id: "c2b",
          kind: "psychoeducation",
          skill: "depression:apply",
          prompt: "How do you explain postnatal depression?",
          options: [
            o("a", "best", "'This is a common, treatable illness after birth, not weakness or bad mothering. Most women recover fully.' Explain the intrusive thoughts too.", "Removing shame is half the treatment. Naming it as common and treatable builds hope and insight.", { insight: 15, trust: 5 }),
            o("b", "poor", "Tell her to count her blessings: she has a healthy baby.", "Minimising adds guilt to depression.", { trust: -10, insight: -5 }),
          ],
        },
      ],
    },
    {
      id: "c3",
      title: "Session 3 · Forty days",
      beats: [
        { text: "Her mother-in-law comes: 'She's weak. In our time we managed. And she must stay inside, eat what I give, no visitors.' Divya says nothing." },
      ],
      decisions: [
        {
          id: "c3a",
          kind: "family",
          skill: "depression:apply",
          prompt: "How do you work with the family?",
          options: [
            o("a", "best", "Honour the confinement customs that help (rest, food, help with the baby), and ask that someone takes one night feed with expressed milk so Divya gets a stretch of sleep.", "Working with tradition, not against it, gets the family on board. Protected sleep is one of the most powerful levers in postnatal depression.", { family: 20, risk: -10 }, ["sleepPlan"]),
            o("b", "poor", "Tell them the customs are harmful and Divya needs freedom.", "Attacking customs alienates the people doing the caring.", { family: -15 }),
            o("c", "ok", "Speak only to the husband by phone and leave the mother-in-law out.", "He matters, but the mother-in-law is at home every day. Leaving her out wastes the main source of support.", { family: 5 }),
          ],
        },
      ],
    },
    {
      id: "c4",
      title: "Session 4 · A message at night",
      beats: [
        { when: { v: "risk", gte: 55 }, text: "Her husband calls at 11 pm: Divya said 'the baby would be better off without me' and searched online for tablet overdoses." },
        { when: { v: "risk", lte: 54 }, text: "Divya is sleeping better. She took the baby to the temple and smiled at a neighbour's joke." },
      ],
      decisions: [
        {
          id: "c4x",
          kind: "risk",
          skill: "suicide:risk",
          when: { v: "risk", gte: 55 },
          prompt: "What do you do tonight?",
          options: [
            o("a", "best", "Same-day assessment with the psychiatrist. With the family, lock away medicines at home, agree who stays with her, and write a safety plan. If risk is high, discuss a mother-and-baby unit.", "Thoughts that the baby is better off without her are a serious sign. Removing means and never leaving her alone are life-saving steps; a mother-baby unit keeps them together.", { risk: -25, family: 10 }),
            o("b", "harm", "Tell him to bring her to the next routine appointment.", "A new, specific suicide plan needs action today.", { risk: 25 }),
          ],
        },
        {
          id: "c4a",
          kind: "referral",
          skill: "depression:apply",
          prompt: "Where should her ongoing care sit?",
          options: [
            o("a", "best", "A perinatal mental health service for therapy (CBT for depression and the intrusive thoughts), plus a local new-mothers group.", "Specialist perinatal care and peer support cut isolation and treat the thoughts directly.", { insight: 10, adherence: 10 }),
            o("b", "poor", "Refer only to a faith healer, as the family prefers.", "Faith can sit beside care, but not replace it when risk is present.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "c5",
      title: "Session 5 · Looking ahead",
      beats: [
        { when: { flag: "ssri" }, text: "Divya is feeding the baby, laughing more. 'I feel like myself. Can I stop the tablets now?'" },
        { when: { notFlag: "ssri" }, text: "Divya is coping, just. 'I still wake at 3 am with my heart racing.'" },
      ],
      decisions: [
        {
          id: "c5a",
          kind: "medicines",
          skill: "antidepressants:pharm",
          prompt: "What do you advise she discusses with the psychiatrist?",
          options: [
            o("a", "best", "Keep going for a good while after feeling well, then plan a slow taper together.", "Stopping soon after recovery raises relapse risk; a planned, gradual stop avoids discontinuation symptoms.", { adherence: 15 }),
            o("b", "poor", "Stop now since she feels well.", "Early stopping is the commonest cause of relapse.", { risk: 10, adherence: -10 }),
          ],
        },
        {
          id: "c5b",
          kind: "psychoeducation",
          skill: "depression:apply",
          prompt: "She asks about a second baby someday.",
          options: [
            o("a", "best", "Explain that postnatal depression can return, and plan early support for any future pregnancy: tell the team early, line up sleep help.", "Risk of recurrence is real, and a plan made when well is far easier to follow.", { insight: 10, risk: -5 }),
            o("b", "poor", "Advise her never to have another child.", "That's not your decision to make, and with planning most women do well.", { trust: -10 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Two cups of filter coffee", text: "Divya and her mother-in-law share the early feed. Divya bathes her daughter every morning and is back to sketching. She knows the plan if the darkness returns." },
    { min: 50, title: "Getting there", text: "Divya is better but tired and alone on weekdays. Some days the thoughts creep back. Support at home is patchy." },
    { min: 0, title: "A hard year", text: "Divya's depression drags on for most of the year, with a crisis admission. The family feels blamed and stops coming." },
  ],
};

/* ------------------------------------------------------------ London */
const london: Campaign = {
  id: "london",
  title: "Second year",
  patient: "Maya, 20, history student",
  place: "University wellbeing service, London",
  blurb: "Maya hasn't left her room for days and has missed every deadline. Last year she was 'unstoppable' for a month, she says.",
  note: "This campaign covers suicide risk for learning. If you are struggling yourself: Tele-MANAS 14416 (India) or Samaritans 116 123 (UK).",
  start: { risk: 55, trust: 40, insight: 30, family: 30, adherence: 40 },
  chapters: [
    {
      id: "l1",
      title: "Session 1 · The wellbeing room",
      beats: [{ text: "Maya speaks slowly. 'I sleep fourteen hours and still feel dead. Everyone's better off without me.' Her GP started sertraline recently." }],
      decisions: [
        {
          id: "l1a",
          kind: "assessment",
          skill: "bipolar:differentiate",
          prompt: "What do you ask about?",
          options: [
            o("a", "best", "A full mood history, including any spells of very high energy, little sleep and racing ideas in the past.", "Every depressed person needs to be asked about past highs. Missing bipolar disorder changes the treatment and the risk.", { insight: 10 }, ["pastMania"]),
            o("b", "poor", "Score a depression questionnaire and stop there.", "Questionnaires measure severity; they don't find past mania. This is how bipolar depression is missed.", {}, ["missedBipolar"]),
          ],
        },
        {
          id: "l1b",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "She said everyone's better off without her. What next?",
          options: [
            o("a", "best", "Ask directly and calmly: 'Have you thought about ending your life?' Then ask about plans, preparations and what keeps her going.", "Asking directly does not increase risk. It opens the door to help and tells you what you're dealing with.", { trust: 10, risk: -5 }, ["askedSI"]),
            o("b", "harm", "Avoid the topic so you don't put the idea in her head.", "This is a myth. Avoiding the question leaves risk unknown and her alone with it.", { risk: 20 }),
            o("c", "poor", "Hand her a form with a suicide question to fill in later.", "A form can't respond. Ask in person, now.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "l2",
      title: "Session 1, continued · The plan",
      beats: [
        { when: { flag: "askedSI" }, text: "Maya nods. She has been saving paracetamol in a drawer. 'I was going to do it after my last exam.' Her flatmate, Zoe, is the one person she trusts." },
        { when: { notFlag: "askedSI" }, text: "As she leaves, Maya drops a pharmacy bag. It's full of paracetamol packets." },
      ],
      decisions: [
        {
          id: "l2a",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "What do you do before she leaves?",
          options: [
            o("a", "best", "Write a safety plan with her (warning signs, coping steps, people, crisis numbers), agree she hands in the tablets, and arrange a same-day review with the crisis team, sharing what's needed.", "A collaborative safety plan, removing the means and a warm handover are the core of good suicide care. Confidentiality has limits when life is at risk; tell her that honestly.", { risk: -25, trust: 5 }, ["safetyPlan"]),
            o("b", "harm", "Promise to keep it all secret so she keeps trusting you.", "You can't promise secrecy when a life is at risk. Keeping it would leave a plan and the means in place.", { risk: 25 }),
            o("c", "poor", "Tell her to go to A&E on her own if it gets worse.", "With a plan and the means, 'if it gets worse' may be too late. Handover needs to be active.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "l3",
      title: "Session 2 · The tablets",
      beats: [
        { when: { flag: "missedBipolar" }, text: "Maya is different: talking fast, sleeping three hours, ideas everywhere, still tearful. 'I feel wired and awful at once.'" },
        { when: { flag: "pastMania" }, text: "You told the psychiatrist about last year's 'unstoppable' month. They want to talk about the sertraline." },
      ],
      decisions: [
        {
          id: "l3a",
          kind: "medicines",
          skill: "stabilisers:pharm",
          prompt: "What do you raise with the psychiatrist?",
          options: [
            o("a", "best", "That an antidepressant alone can tip bipolar depression into a high or mixed state. Ask about options with evidence in bipolar depression (quetiapine, lurasidone, lamotrigine, lithium).", "Antidepressant monotherapy is avoided in bipolar disorder. Lithium also has good evidence for lowering suicide risk.", { risk: -15, adherence: 10 }, ["lithium"]),
            o("b", "harm", "A higher sertraline dose, since she's still depressed.", "More antidepressant alone in bipolar depression risks a switch or mixed state, which raises suicide risk.", { risk: 20 }),
            o("c", "poor", "Add sleeping tablets and continue as is.", "It doesn't address the switch risk and adds a means of overdose.", { risk: 10 }),
          ],
        },
        {
          id: "l3b",
          kind: "psychoeducation",
          skill: "stabilisers:pharm",
          when: { flag: "lithium" },
          prompt: "Lithium is started. What must Maya know?",
          options: [
            o("a", "best", "Regular blood levels and kidney and thyroid checks; signs of toxicity (worse tremor, vomiting, diarrhoea, unsteadiness, confusion); drink enough; avoid ibuprofen-type painkillers; small supplies at a time.", "Lithium works well but has a narrow safe range. Dehydration and some painkillers raise levels. It is dangerous in overdose, so supplies are kept small while risk is high.", { adherence: 15, insight: 10 }, ["lithiumTaught"]),
            o("b", "poor", "'Just take one every night.'", "Without knowing the warning signs, toxicity can sneak up.", { adherence: -5 }),
          ],
        },
      ],
    },
    {
      id: "l4",
      title: "Session 3 · Family and deadlines",
      beats: [{ text: "'Please don't tell my parents. They think therapy is for weak people.' Her dissertation is due soon." }],
      decisions: [
        {
          id: "l4a",
          kind: "family",
          skill: "suicide:risk",
          prompt: "How do you handle her family?",
          options: [
            o("a", "best", "Respect her wish while explaining the limits of confidentiality. With her consent, bring Zoe into the safety plan, and keep the door open to involving her parents later.", "She is an adult. Involving a trusted person she chooses builds a safety net without breaking trust.", { family: 20, trust: 10, risk: -5 }),
            o("b", "poor", "Call her parents anyway; they should know.", "Without immediate danger this breaches her confidentiality and may end her engagement.", { trust: -20, family: 5 }),
          ],
        },
        {
          id: "l4b",
          kind: "referral",
          skill: "bipolar:apply",
          prompt: "And university?",
          options: [
            o("a", "best", "With her consent, the disability service for deadline extensions, plus a community mental health team for ongoing bipolar care and therapy.", "Reasonable adjustments keep her studying. Specialist follow-up and psychological work for bipolar disorder cut relapse.", { adherence: 10, risk: -5 }),
            o("b", "poor", "Suggest she drops out to focus on getting well.", "Losing her course, friends and structure can worsen mood and hope.", { trust: -5, risk: 5 }),
          ],
        },
        {
          id: "l4c",
          kind: "psychoeducation",
          skill: "bipolar:apply",
          prompt: "What daily habits do you work on?",
          options: [
            o("a", "best", "Regular sleep and wake times, no all-nighters before deadlines, and less alcohol. A mood diary to spot early signs.", "Steady daily rhythms protect against both highs and lows in bipolar disorder.", { insight: 10, risk: -5 }),
            o("b", "ok", "Exercise more and think positive.", "Exercise helps, but the key levers in bipolar are sleep regularity and early-warning signs.", { insight: 2 }),
          ],
        },
      ],
    },
    {
      id: "l5",
      title: "Session 4 · Flu",
      beats: [
        { when: { flag: "lithiumTaught" }, text: "Maya had a bad flu. She remembered: paracetamol, not ibuprofen, plenty of fluids, and she rang the clinic when she couldn't keep water down." },
        { when: { notFlag: "lithiumTaught" }, text: "Maya had flu and took ibuprofen for days. Now she is shaky, vomiting and unsteady on her feet." },
      ],
      decisions: [
        {
          id: "l5a",
          kind: "medicines",
          skill: "stabilisers:pharm",
          prompt: "What happens next?",
          options: [
            o("a", "best", "An urgent lithium level and medical review today; hold the next dose until the result.", "Vomiting and unsteadiness on lithium may mean toxicity. Check the level and get medical help the same day.", { risk: -10, adherence: 5 }),
            o("b", "harm", "Tell her it's just the flu; carry on as normal.", "Lithium toxicity can damage the kidneys and brain. These signs need urgent checks.", { risk: 20 }),
          ],
        },
        {
          id: "l5b",
          kind: "risk",
          skill: "bipolar:apply",
          prompt: "Before you hand over to her community team?",
          options: [
            o("a", "best", "Update her relapse and safety plan with Zoe: early signs of highs and lows, who to call, and her reasons for living.", "A living plan, kept up to date, is the best protection over time.", { risk: -10, insight: 5 }),
            o("b", "poor", "Close her file now she's improving.", "Bipolar disorder is long-term; handover needs to be active.", { risk: 10 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Dissertation handed in", text: "Maya submits a little late, with an extension. Her mood is steady; Zoe knows the plan. The paracetamol is long gone." },
    { min: 50, title: "Holding on", text: "Maya stays at university, but her mood swings and she misses blood tests. She is safe, for now." },
    { min: 0, title: "A crisis admission", text: "Maya is admitted after a mixed episode and an overdose attempt. She survives, but feels let down by the people who could have acted earlier." },
  ],
};

export const CAMPAIGNS: Campaign[] = [pune, chennai, london];

export function campaignById(id: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.id === id);
}
