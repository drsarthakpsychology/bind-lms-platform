/**
 * Ward Week campaigns, set B: alcohol withdrawal, an adolescent suicide
 * crisis, contamination OCD, dementia at home and delirium after surgery.
 * Original teaching stories; the player is a trainee psychologist on the team.
 */
import type { Campaign } from "./engine";
import { o, tags } from "./kit";

/* ------------------------------------------------------------ Lucknow */
const lucknow: Campaign = {
  id: "lucknow",
  tags: tags("Alcohol withdrawal and relapse prevention", "substance", "Manage alcohol withdrawal safely and plan relapse prevention with the family."),
  title: "The shaking hands",
  patient: "Rakesh, 45, runs a hardware shop",
  place: "De-addiction ward, Lucknow",
  blurb: "His wife brings him in after a fit at home. He has drunk a bottle of country liquor every day for years and stopped two days ago 'for the family'.",
  start: { risk: 60, trust: 35, insight: 20, family: 45, adherence: 35 },
  chapters: [
    {
      id: "lk1",
      title: "Session 1 · Admission",
      beats: [
        { text: "Rakesh is sweating, his hands tremble and he keeps picking at the bedsheet. 'Ants,' he says, brushing his arm. His last drink was about two days ago." },
        { text: "His wife Sunita whispers that his father died of 'liver trouble'." },
      ],
      decisions: [
        {
          id: "lk1a",
          kind: "assessment",
          skill: "substance:apply",
          prompt: "What matters most in the first hour?",
          options: [
            o("a", "best", "Flag him to the doctor as high risk: a recent fit, tremor, sweating and seeing insects two days after stopping. Ask for a withdrawal rating scale, vitals and a check for confusion.", "A fit plus hallucinations around day two warns of delirium tremens, which can kill. A structured withdrawal score guides the medicine dose.", { risk: -20, trust: 5 }, ["dtWatch"]),
            o("b", "poor", "Start a full life-history interview about why he drinks.", "His story matters, but not while he is withdrawing and may be heading for delirium.", { risk: 10 }),
            o("c", "harm", "Tell the family he will be fine to go home, as he has stopped by himself.", "Unsupervised withdrawal after a fit is dangerous; delirium tremens peaks around days two to three.", { risk: 25, family: -5 }),
          ],
        },
        {
          id: "lk1b",
          kind: "medicines",
          skill: "substance:pharm",
          prompt: "The doctor asks what the plan should include.",
          options: [
            o("a", "best", "A benzodiazepine in a reducing regimen guided by the score, and thiamine by injection before any glucose drip.", "Benzodiazepines prevent fits and delirium. Thiamine first protects against Wernicke's encephalopathy, which glucose alone can tip him into.", { risk: -20, adherence: 10 }, ["thiamine"]),
            o("b", "harm", "Glucose drip first for his weakness, thiamine tablets later.", "Glucose before thiamine in a heavy drinker can bring on Wernicke's: confusion, unsteady gait and eye palsies.", { risk: 20 }, ["wernicke"]),
            o("c", "poor", "Haloperidol alone to calm the hallucinations.", "An antipsychotic alone doesn't treat withdrawal and lowers the fit threshold.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "lk2",
      title: "Session 2 · The third night",
      beats: [
        { when: { flag: "wernicke" }, text: "By morning Rakesh is confused, staggers when he walks and his eyes flick sideways. The doctor gives high-dose thiamine urgently." },
        { when: { flag: "dtWatch" }, text: "The night was rough but safe. Nurses scored him every few hours and he slept by dawn." },
        { text: "Now calmer, he says, 'I'm not an addict. I drink because the shop is in loss.'" },
      ],
      decisions: [
        {
          id: "lk2a",
          kind: "psychoeducation",
          skill: "substance:apply",
          prompt: "How do you talk about the drinking?",
          options: [
            o("a", "best", "A motivational conversation: reflect the stress about the shop, ask what drinking has cost him, and what he wants for his family.", "Arguing about the word 'addict' builds resistance. Letting him voice his own reasons to change is what predicts change.", { insight: 20, trust: 15 }, ["mi"]),
            o("b", "poor", "Show him his liver report and tell him he will die if he drinks again.", "Fear tactics alone rarely change drinking and can push him away.", { insight: 5, trust: -5 }),
            o("c", "ok", "Give him a leaflet on the harms of alcohol.", "Information helps a little, but doesn't engage his own reasons.", { insight: 5 }),
          ],
        },
        {
          id: "lk2b",
          kind: "assessment",
          skill: "depression:apply",
          prompt: "He says he hasn't slept or felt joy for months. What do you do?",
          options: [
            o("a", "best", "Screen for depression and suicide risk now, and plan to reassess mood once he has been sober for a while.", "Heavy drinking often causes low mood that lifts with sobriety, but suicide risk is high in men who drink and must be asked about now.", { risk: -10, trust: 5 }),
            o("b", "poor", "Start an antidepressant straight away.", "Many alcohol-related low moods lift within a month of stopping; treat first what is driving it, while checking risk.", { adherence: -5 }),
          ],
        },
      ],
    },
    {
      id: "lk3",
      title: "Session 3 · The family's plan",
      beats: [
        { text: "His brother pulls you aside: 'We will put that tablet in his tea, the one that makes him sick if he drinks. He need not know.'" },
      ],
      decisions: [
        {
          id: "lk3a",
          kind: "family",
          skill: "substance:apply",
          prompt: "How do you respond?",
          options: [
            o("a", "best", "Explain that disulfiram must never be given secretly: with alcohol it can cause a dangerous reaction. Offer a family meeting where Rakesh chooses his medicine and the family learns how to support it.", "Covert disulfiram is unsafe and unethical. Supervised medicine he agrees to, with family support, works far better.", { family: 15, trust: 10, risk: -10 }, ["familyPlan"]),
            o("b", "harm", "Agree, since the family knows him best.", "If he drinks on hidden disulfiram he may collapse with flushing, vomiting and a falling blood pressure. It also destroys trust when found out.", { risk: 25, trust: -20 }),
            o("c", "poor", "Tell the brother off in front of everyone.", "The wish to help is real; shaming him loses an ally.", { family: -10 }),
          ],
        },
        {
          id: "lk3b",
          kind: "medicines",
          skill: "substance:pharm",
          prompt: "Rakesh agrees to a medicine to help him stay off drink. His liver enzymes are high. What do you raise with the doctor?",
          options: [
            o("a", "best", "Acamprosate or baclofen, which suit a damaged liver better, with liver tests repeated.", "Naltrexone and disulfiram are harder on a sick liver; acamprosate is cleared by the kidneys.", { adherence: 15 }),
            o("b", "poor", "Long-term diazepam to keep him calm.", "Long benzodiazepine courses add a second dependence.", { risk: 10, adherence: -5 }),
          ],
        },
      ],
    },
    {
      id: "lk4",
      title: "Session 4 · Going home",
      beats: [
        { when: { flag: "familyPlan" }, text: "Sunita has a plan: she will hand him the tablet each morning, and they will go to the shop together on busy market days." },
        { text: "Rakesh worries: 'All my friends drink at the shop after closing.'" },
      ],
      decisions: [
        {
          id: "lk4a",
          kind: "referral",
          skill: "substance:apply",
          prompt: "What do you set up for discharge?",
          options: [
            o("a", "best", "A relapse prevention plan for his high-risk times (closing time, friends, money worries), regular OPD follow-up, a support group and a liver clinic review.", "Relapse is common; planning for triggers and keeping contact make lapses shorter and safer.", { risk: -15, adherence: 15, insight: 10 }),
            o("b", "poor", "Tell him to call if he ever drinks again.", "Waiting for a relapse leaves him alone at the hardest time.", { risk: 10 }),
            o("c", "harm", "Say that if he drinks even once, the treatment has failed and he shouldn't come back.", "A lapse is a moment to learn, not a reason to give up. Shame drives hiding and heavier drinking.", { trust: -20, adherence: -15 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "A sober Diwali", text: "Six months on, Rakesh has had one lapse, which he told his counsellor about the next day. The shop is steadier, and Sunita says he laughs again." },
    { min: 50, title: "Off and on", text: "Rakesh cuts down but drinks on bad days. He comes to clinic sometimes. The family is tired but still trying." },
    { min: 0, title: "Back in the emergency room", text: "Rakesh returns with another fit and confusion. Trust with the team broke early, and the family now hides his drinking." },
  ],
};

/* ------------------------------------------------------------ Kota */
const kota: Campaign = {
  id: "kota",
  tags: tags("Adolescent suicide attempt", "suicide", "Assess and manage suicide risk in a teenager after an overdose, with family and school."),
  title: "After the test results",
  patient: "Ananya, 17, medical entrance aspirant",
  place: "Emergency and child psychiatry, Kota",
  blurb: "Her hostel warden found her drowsy after she swallowed a strip of her roommate's sleeping tablets on the night mock test results came out.",
  start: { risk: 65, trust: 30, insight: 30, family: 40, adherence: 40 },
  chapters: [
    {
      id: "kt1",
      title: "Session 1 · On the medical ward",
      beats: [
        { text: "Ananya is medically stable now. She won't look up. 'I'm sorry. Please don't tell my parents. Papa took a loan for coaching.'" },
      ],
      decisions: [
        {
          id: "kt1a",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "How do you begin?",
          options: [
            o("a", "best", "Sit with her, explain what you must share and why, then ask openly about the overdose: what she hoped would happen, whether she still wants to die, and any plans now.", "Asking directly about intent and current thoughts is the core of risk assessment. Being honest about the limits of confidentiality keeps trust.", { risk: -15, trust: 15 }, ["asked"]),
            o("b", "harm", "Tell her it was a silly thing to do and she should focus on studies.", "Minimising an attempt raises shame and the chance she hides the next one.", { trust: -25, risk: 15 }),
            o("c", "poor", "Promise you won't tell her parents anything.", "With a minor at risk, parents must be involved. A promise you can't keep breaks trust later.", { trust: 5, risk: 10 }, ["falsePromise"]),
          ],
        },
        {
          id: "kt1b",
          kind: "assessment",
          skill: "depression:apply",
          when: { flag: "asked" },
          prompt: "She says she has felt empty for months, can't concentrate and sleeps only three hours. What else do you check?",
          options: [
            o("a", "best", "A full depression assessment, past self-harm, bullying, substance use, and anyone else at the hostel who might be at risk.", "Depression is common behind adolescent attempts. Hostel peers may share the same pressures.", { risk: -10, insight: 10 }),
            o("b", "poor", "Only her study timetable, to reduce the load.", "Workload matters, but misses the illness and the risk.", { risk: 5 }),
          ],
        },
      ],
    },
    {
      id: "kt2",
      title: "Session 2 · The parents arrive",
      beats: [
        { when: { flag: "falsePromise" }, text: "When her parents walk in, Ananya glares at you. 'You said you wouldn't tell.' She stops speaking." },
        { text: "Her father, red-eyed: 'We only wanted her to be a doctor. Should she drop the year?' Her mother cries quietly." },
      ],
      decisions: [
        {
          id: "kt2a",
          kind: "family",
          skill: "suicide:risk",
          prompt: "How do you run the meeting?",
          options: [
            o("a", "best", "Help Ananya share how she feels, explain depression plainly, and agree home safety: lock away all medicines, no access to pesticides or ropes, and someone with her for now.", "Means restriction and family warmth are among the strongest protections after an attempt. Hearing her own words changes how parents respond.", { family: 20, risk: -15 }, ["meansSafe"]),
            o("b", "harm", "Tell the parents the coaching pressure is entirely their fault.", "Blame breaks the alliance you need for her safety.", { family: -20, trust: -5 }),
            o("c", "ok", "Give the parents a long list of warning signs and send them home to talk.", "Information helps, but without a concrete safety plan the home stays risky.", { family: 5 }),
          ],
        },
        {
          id: "kt2b",
          kind: "referral",
          skill: "suicide:risk",
          prompt: "Where should she go after discharge?",
          options: [
            o("a", "best", "Home to her family for now, with close follow-up at a child and adolescent clinic near home and a written safety plan.", "Moving from the high-pressure hostel to supported home care, with early follow-up, lowers risk in the danger period after an attempt.", { risk: -15, adherence: 10 }),
            o("b", "poor", "Back to the hostel tomorrow so she doesn't fall behind.", "Returning to the same pressures with no plan keeps risk high.", { risk: 15 }),
          ],
        },
      ],
    },
    {
      id: "kt3",
      title: "Session 3 · Talking and treating",
      beats: [
        { text: "At home in Jaipur, Ananya says the dark thoughts come at night: 'Everyone is ahead of me. I'm a waste of money.'" },
      ],
      decisions: [
        {
          id: "kt3a",
          kind: "psychoeducation",
          skill: "depression:apply",
          prompt: "What therapy do you suggest?",
          options: [
            o("a", "best", "CBT for depression, working on thoughts like 'I'm a waste' and planning small, doable activities, with her parents learning to praise effort, not ranks.", "CBT has good evidence in adolescent depression. Shifting family focus from results to effort reduces pressure.", { insight: 20, trust: 10 }),
            o("b", "poor", "Motivational talks from toppers who cleared the exam.", "Comparison with toppers feeds the very thought that she is behind.", { insight: -5 }),
          ],
        },
        {
          id: "kt3b",
          kind: "medicines",
          skill: "antidepressants:pharm",
          prompt: "Her depression is moderate to severe. The psychiatrist considers medicine. What do you raise?",
          options: [
            o("a", "best", "Fluoxetine is the usual first choice in teenagers. Ask for close follow-up early on, as some young people feel more restless or suicidal at the start, and for parents to hold the tablets.", "Fluoxetine has the best evidence in adolescents. Early monitoring and supervised supply guard against overdose and early worsening.", { adherence: 15, risk: -10 }),
            o("b", "harm", "A month's supply of tablets for her to keep, to save trips.", "A large supply in her hands after an overdose is a direct means of harm.", { risk: 25 }),
            o("c", "poor", "Avoid all medicine because of the warning about young people.", "The warning is a reason to monitor, not to refuse treatment for severe depression.", { risk: 5 }),
          ],
        },
      ],
    },
    {
      id: "kt4",
      title: "Session 4 · What next?",
      beats: [
        { when: { v: "risk", gte: 50 }, text: "Her mother finds a goodbye note in Ananya's notebook. Ananya says she wrote it a few days ago and 'didn't mean it'." },
        { when: { v: "risk", lte: 49 }, text: "Ananya is sleeping six hours and helping her younger brother with homework. She wonders aloud about other careers." },
      ],
      decisions: [
        {
          id: "kt4x",
          kind: "risk",
          skill: "suicide:risk",
          when: { v: "risk", gte: 50 },
          prompt: "What do you do about the note?",
          options: [
            o("a", "best", "Same-day review: reassess intent, update the safety plan with her and her parents, and increase contact. Consider admission if risk is high.", "A note is a planning sign; it needs fresh assessment today, not reassurance.", { risk: -20, family: 5 }),
            o("b", "harm", "Accept that she didn't mean it and keep the next routine visit.", "Brushing off a goodbye note misses a clear warning.", { risk: 25 }),
          ],
        },
        {
          id: "kt4a",
          kind: "family",
          skill: "suicide:risk",
          prompt: "The family must decide about next year's coaching. What do you help with?",
          options: [
            o("a", "best", "Help Ananya and her parents weigh options together, including other courses, with a plan to watch for early warning signs whatever they choose.", "Her voice in the decision, and a family that can talk about failure, protect her far more than any single choice.", { family: 15, insight: 10, trust: 10 }),
            o("b", "poor", "Tell them she must give up medicine entirely.", "That is their decision to make with her, not yours.", { trust: -10 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "A different path", text: "Ananya chooses a biotechnology course in Jaipur. She still has hard days, but she tells her mother when the night thoughts come. The safety plan lives on her phone." },
    { min: 50, title: "Holding steady", text: "Ananya returns to coaching. She is safe, but her mood dips with every test and the family still talks mostly about ranks." },
    { min: 0, title: "A second attempt", text: "Ananya is readmitted after another overdose. She survives. The family says nobody told them how serious it was." },
  ],
};

/* ------------------------------------------------------------ Ahmedabad */
const ahmedabad: Campaign = {
  id: "ahmedabad",
  tags: tags("Contamination OCD", "ocd", "Treat contamination OCD with exposure and response prevention and reduce family accommodation.", 4),
  title: "Clean enough",
  patient: "Mehul, 34, diamond trader",
  place: "Psychiatry OPD, Ahmedabad",
  blurb: "He washes his hands for hours after touching money and makes his wife wash the vegetables three times. His skin is cracked and bleeding.",
  start: { risk: 35, trust: 40, insight: 45, family: 40, adherence: 35 },
  chapters: [
    {
      id: "am1",
      title: "Session 1 · Raw hands",
      beats: [
        { text: "Mehul keeps his hands in his lap, wrapped in a handkerchief. 'I know it's too much. But if I don't wash, I'll carry germs to my daughter and she'll get sick.'" },
        { text: "His wife Hetal adds: 'I wash his clothes separately and he showers for two hours. We are late for everything.'" },
      ],
      decisions: [
        {
          id: "am1a",
          kind: "assessment",
          skill: "ocd:recognise",
          prompt: "What do you assess first?",
          options: [
            o("a", "best", "Map the obsessions and compulsions with a rating scale (like the Y-BOCS), the time they take, his insight, and how the family joins in.", "A clear map with a severity score guides therapy and shows change. Family accommodation is a key target in OCD.", { insight: 10, trust: 10 }, ["mapped"]),
            o("b", "poor", "Ask about his childhood toilet training.", "Old theories don't guide treatment; a symptom map does.", { trust: -5 }),
            o("c", "ok", "Refer him to dermatology for his hands first.", "His skin needs care, but this skips the illness causing it.", {}),
          ],
        },
        {
          id: "am1b",
          kind: "psychoeducation",
          skill: "ocd:apply",
          prompt: "How do you explain OCD to him?",
          options: [
            o("a", "best", "Draw the cycle: the thought brings fear, washing brings brief relief, and relief teaches the brain to need washing again. Treatment breaks the cycle.", "Seeing how compulsions keep the fear alive gives a reason to try exposure.", { insight: 15, adherence: 10 }),
            o("b", "poor", "Tell him to just stop washing so much.", "If he could, he would. Willpower advice adds shame.", { trust: -10 }),
          ],
        },
      ],
    },
    {
      id: "am2",
      title: "Session 2 · The ladder",
      beats: [
        { text: "Together you rank his fears from touching a door handle (30 out of 100) to holding cash and then hugging his daughter without washing (95)." },
      ],
      decisions: [
        {
          id: "am2a",
          kind: "assessment",
          skill: "ocd:apply",
          prompt: "How do you start exposure and response prevention?",
          options: [
            o("a", "best", "Start low on the ladder: touch the door handle, then delay washing while the anxiety rises and falls, repeated daily as homework.", "Graded exposure with no ritual lets the fear fade by itself. Starting low builds success.", { insight: 10, adherence: 15, trust: 5 }, ["erp"]),
            o("b", "harm", "Make him hold dirty currency notes for an hour on day one, without warning.", "Flooding without consent or preparation frightens patients out of therapy.", { trust: -20, adherence: -15 }),
            o("c", "poor", "Let him wash, but use relaxation while he does.", "Relaxation during rituals doesn't break the cycle.", { adherence: -5 }),
          ],
        },
        {
          id: "am2b",
          kind: "medicines",
          skill: "antidepressants:pharm",
          prompt: "His OCD is severe. What medicine do you discuss with the psychiatrist?",
          options: [
            o("a", "best", "An SSRI such as fluoxetine or sertraline, often needing higher doses than for depression, and a longer trial before judging it.", "OCD usually needs higher SSRI doses and patience; response is slower than in depression.", { adherence: 10 }),
            o("b", "poor", "Clonazepam to stop the anxiety.", "Benzodiazepines don't treat OCD and can blunt the learning in exposure.", { adherence: -5 }),
          ],
        },
      ],
    },
    {
      id: "am3",
      title: "Session 3 · Hetal's part",
      beats: [
        { text: "Hetal admits: 'When he asks me ten times if the vegetables are clean, I just say yes. Otherwise he shouts.'" },
      ],
      decisions: [
        {
          id: "am3a",
          kind: "family",
          skill: "ocd:apply",
          prompt: "How do you help the family?",
          options: [
            o("a", "best", "With Mehul's agreement, plan to cut back reassurance and separate washing step by step, with a kind script: 'I know this is hard. What does your plan say?'", "Family accommodation keeps OCD going. Planned, agreed reduction, not sudden refusal, keeps peace at home.", { family: 20, insight: 10 }, ["accomPlan"]),
            o("b", "poor", "Tell Hetal to refuse every request from today.", "Sudden refusal without his agreement often triggers rows and drop-out.", { family: -10 }),
            o("c", "harm", "Tell Hetal to keep reassuring him so he stays calm.", "Constant reassurance feeds the fear cycle.", { insight: -10, family: -5 }),
          ],
        },
      ],
    },
    {
      id: "am4",
      title: "Session 4 · Holding his daughter",
      beats: [
        { when: { flag: "erp" }, text: "Mehul hugs his daughter after coming home from the market, then waits an hour before washing. 'My heart was racing. Then it just... went down.'" },
        { when: { notFlag: "erp" }, text: "Mehul still washes for an hour after every outing." },
      ],
      decisions: [
        {
          id: "am4a",
          kind: "referral",
          skill: "ocd:apply",
          prompt: "What do you plan for the long run?",
          options: [
            o("a", "best", "Keep up self-led exposure, booster sessions, a written plan for spotting old rituals creeping back, and a slow SSRI taper only after a long, steady spell.", "OCD can return under stress; booster plans and gradual medicine changes keep gains.", { adherence: 15, risk: -10 }),
            o("b", "poor", "Discharge him now he is better.", "Early discharge without a relapse plan risks old habits returning.", { adherence: -10 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Back to the bazaar", text: "Mehul handles cash all day and washes his hands like anyone else. When a scare about a virus brings old urges back, he pulls out his ladder." },
    { min: 50, title: "Half the time", text: "Washing is down from four hours to two. Home is calmer, but OCD still shapes his days." },
    { min: 0, title: "Stuck", text: "Mehul drops out of therapy. His skin is worse, and Hetal now washes the house twice a day for him." },
  ],
};

/* ------------------------------------------------------------ Kolkata */
const kolkata: Campaign = {
  id: "kolkata",
  tags: tags("Dementia with behaviour changes", "neurocognitive", "Support a family caring for a parent with Alzheimer's dementia and agitation, without reaching first for sedatives."),
  title: "Evening restlessness",
  patient: "Mr Bose, 78, retired schoolteacher",
  place: "Memory clinic, Kolkata",
  blurb: "His daughter-in-law says he forgets meals, accuses the maid of stealing, and paces at dusk asking to 'go home', though he has lived here for forty years.",
  start: { risk: 50, trust: 40, insight: 25, family: 35, adherence: 40 },
  chapters: [
    {
      id: "kb1",
      title: "Session 1 · The memory clinic",
      beats: [
        { text: "Mr Bose quotes Tagore beautifully but can't say what he ate this morning. He scores low on a memory test. His son Arnab says the change crept in over three years." },
      ],
      decisions: [
        {
          id: "kb1a",
          kind: "assessment",
          skill: "neurocognitive:apply",
          prompt: "What do you make sure is done?",
          options: [
            o("a", "best", "Check for treatable causes and add-ons: blood tests (thyroid, B12, sugar, salts), a brain scan, his medicines, hearing and eyesight, and screen for depression.", "Before settling on Alzheimer's, rule out reversible causes and conditions that worsen confusion.", { insight: 15, risk: -5 }, ["workup"]),
            o("b", "poor", "Tell the family it is just old age.", "Dementia is a disease, not normal ageing; naming it opens help and planning.", { insight: -10 }),
            o("c", "ok", "Start a memory medicine today and review later.", "Medicine may help, but the work-up comes first.", { adherence: 5 }),
          ],
        },
        {
          id: "kb1b",
          kind: "psychoeducation",
          skill: "neurocognitive:apply",
          prompt: "How do you explain the stealing accusations?",
          options: [
            o("a", "best", "Explain that memory loss leaves gaps: he forgets where he put things and his mind fills the gap with 'someone took it'. Suggest a fixed place for valuables and calm reassurance, not arguing.", "Misplacing and blaming is common in Alzheimer's. Understanding it lowers family anger.", { family: 15, insight: 10 }),
            o("b", "poor", "Suggest they replace the maid.", "The accusation is a symptom; a new maid will be accused too.", { family: -5 }),
          ],
        },
      ],
    },
    {
      id: "kb2",
      title: "Session 2 · Sundown",
      beats: [
        { text: "Arnab calls: 'Every evening he shouts and tries to leave. The neighbour's uncle got a sleeping tablet. Can we give him one?'" },
      ],
      decisions: [
        {
          id: "kb2a",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "What do you advise?",
          options: [
            o("a", "best", "Start with non-drug steps: daylight and a walk in the day, lights on before dusk, a calm routine, less tea in the evening, and look for pain or constipation. Discuss a memory medicine like donepezil with the doctor.", "Antipsychotics and sedatives in dementia raise the risk of falls, stroke and death. Non-drug measures and treating hidden pain often settle evening agitation.", { risk: -15, family: 10 }, ["nondrug"]),
            o("b", "harm", "Ask for a strong sedative every evening.", "Sedatives in older people with dementia cause falls, confusion and worse nights.", { risk: 20 }, ["sedated"]),
            o("c", "poor", "Lock him in his room at dusk.", "Locking in frightens him and is a safety and dignity risk.", { risk: 10, trust: -10 }),
          ],
        },
      ],
    },
    {
      id: "kb3",
      title: "Session 3 · The papers",
      beats: [
        { when: { flag: "sedated" }, text: "Mr Bose fell in the bathroom at night after the sedative and has a bruised hip." },
        { text: "Arnab's cousin wants Mr Bose to sign over the family flat 'before he forgets more'." },
      ],
      decisions: [
        {
          id: "kb3a",
          kind: "referral",
          skill: "ethics-law:apply",
          prompt: "What do you advise about the papers?",
          options: [
            o("a", "best", "Suggest a formal assessment of his capacity for this decision, ideally while he can still take part, and that he plan ahead with a lawyer: who will decide for him later, and his wishes.", "Capacity is decision-specific. Planning early protects him from pressure and the family from later disputes.", { trust: 10, family: 10 }),
            o("b", "harm", "Help them get his thumbprint on the papers today.", "Signing under pressure without capacity is exploitation.", { trust: -25, family: -10 }),
            o("c", "poor", "Say nothing; property is not your business.", "Protecting a vulnerable patient from financial abuse is part of care.", { risk: 5 }),
          ],
        },
      ],
    },
    {
      id: "kb4",
      title: "Session 4 · Caring for the carer",
      beats: [
        { text: "His daughter-in-law Mitali, who does most of the caring, says quietly: 'I haven't slept a full night in months. Sometimes I cry in the kitchen.'" },
      ],
      decisions: [
        {
          id: "kb4a",
          kind: "family",
          skill: "depression:apply",
          prompt: "What do you do for Mitali?",
          options: [
            o("a", "best", "Screen her for depression, share the care among family members, link her with a dementia carers' group and day-care or respite, and teach simple ways to handle difficult moments.", "Carer strain is common and predicts early nursing-home placement. Support for the carer is support for the patient.", { family: 20, risk: -10, adherence: 10 }),
            o("b", "poor", "Tell her this is her duty as the daughter-in-law.", "Duty doesn't prevent burnout; support does.", { family: -15 }),
          ],
        },
        {
          id: "kb4b",
          kind: "risk",
          skill: "neurocognitive:apply",
          prompt: "Mr Bose was found two streets away last night. What safety steps do you suggest?",
          options: [
            o("a", "best", "An ID bracelet with a phone number, a door chime, a recent photo ready, and a daily walk with someone so the urge to go out is met safely.", "Wandering is common; simple safety steps protect him without locking him in.", { risk: -15 }),
            o("b", "poor", "Tie him to the bed at night.", "Restraint causes injury, distress and loss of dignity.", { risk: 10, trust: -10 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Rabindrasangeet in the evening", text: "Evenings are calmer with music and a walk at four. Mitali goes to a carers' group on Saturdays. Mr Bose still forgets, but he is safe and at home." },
    { min: 50, title: "Coping, mostly", text: "The family manages, with some bad nights. Mitali is tired, and the property question still simmers." },
    { min: 0, title: "A broken hip", text: "After more sedatives and a fall, Mr Bose has hip surgery and becomes more confused. The family feels alone." },
  ],
};

/* ------------------------------------------------------------ Delhi */
const delhi: Campaign = {
  id: "delhi",
  tags: tags("Delirium after surgery", "neurocognitive", "Recognise hypoactive and agitated delirium on a surgical ward and manage its causes."),
  title: "Not herself",
  patient: "Mrs Kaur, 74, after hip surgery",
  place: "Orthopaedic ward, general hospital, Delhi",
  blurb: "Two days after her hip operation she lies quietly, barely eating. The nurses think she is 'depressed about the fracture' and ask for a psychology review.",
  start: { risk: 60, trust: 40, insight: 30, family: 40, adherence: 40 },
  chapters: [
    {
      id: "dl1",
      title: "Session 1 · The quiet patient",
      beats: [
        { text: "Mrs Kaur drifts off while you talk. She thinks it is evening (it is 10 am) and calls you by her granddaughter's name. Her chart shows a pain injection every few hours and a catheter." },
      ],
      decisions: [
        {
          id: "dl1a",
          kind: "assessment",
          skill: "neurocognitive:recognise",
          prompt: "What do you conclude?",
          options: [
            o("a", "best", "This looks like hypoactive delirium: poor attention, drowsiness and confusion that came on after surgery. Use a quick attention test and tell the team today.", "Quiet, drowsy delirium is often mistaken for depression. It needs a medical search for causes and raises the risk of death.", { risk: -20, insight: 10 }, ["delirium"]),
            o("b", "harm", "Agree she is depressed and suggest an antidepressant.", "Missing delirium delays treatment of its cause, such as infection or drugs.", { risk: 25 }, ["missed"]),
            o("c", "poor", "Come back when she is more awake to do a full interview.", "Drowsiness is the sign. Waiting loses time.", { risk: 10 }),
          ],
        },
        {
          id: "dl1b",
          kind: "referral",
          skill: "neurocognitive:apply",
          when: { flag: "delirium" },
          prompt: "What do you suggest the team looks for?",
          options: [
            o("a", "best", "Common causes: urine infection from the catheter, low oxygen, low sodium, dehydration, constipation or urine retention, pain, and medicines like opioids and anticholinergics.", "Delirium usually has several causes at once. Finding and fixing them is the treatment.", { risk: -15 }),
            o("b", "poor", "A brain scan before anything else.", "Scans help in some cases, but common bedside causes come first.", { risk: 5 }),
          ],
        },
      ],
    },
    {
      id: "dl2",
      title: "Session 2 · The night shift",
      beats: [
        { when: { flag: "missed" }, text: "At night Mrs Kaur pulls out her drip, shouts that the nurses are poisoning her and tries to climb out of bed." },
        { when: { flag: "delirium" }, text: "The urine culture grew an infection; antibiotics have started. At night she is restless and frightened." },
      ],
      decisions: [
        {
          id: "dl2a",
          kind: "medicines",
          skill: "antipsychotics:pharm",
          prompt: "The night nurse asks for something to calm her.",
          options: [
            o("a", "best", "First calm measures: a family member at the bedside, glasses and hearing aid on, lights on, a clock in view, gentle reorientation. If she is in danger, a very low dose of haloperidol for a short time, as the doctor decides. Avoid benzodiazepines.", "Non-drug care is first line. Benzodiazepines worsen delirium (unless it is alcohol withdrawal). A small, short antipsychotic dose is only for danger or severe distress.", { risk: -15, family: 10 }),
            o("b", "harm", "Lorazepam to help her sleep, and restraints.", "Benzodiazepines deepen confusion in delirium and restraints cause injury and fear.", { risk: 25, trust: -10 }),
            o("c", "poor", "Move her to a side room on her own so she doesn't disturb others.", "Isolation and dim light worsen disorientation.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "dl3",
      title: "Session 3 · The family",
      beats: [
        { text: "Her son Harpreet is angry: 'She was sharp before the operation. Has the anaesthesia damaged her brain? Will she be like this forever?'" },
      ],
      decisions: [
        {
          id: "dl3a",
          kind: "psychoeducation",
          skill: "neurocognitive:apply",
          prompt: "How do you explain?",
          options: [
            o("a", "best", "Explain delirium as a sudden, usually reversible confusion from illness and surgery. Most improve over days, some take longer. Ask the family to visit in shifts, bring familiar things and tell staff what she was like before.", "Families are the best orientation and the best source of the baseline. Honest hope, with honesty that recovery can be slow, builds trust.", { family: 20, trust: 15 }, ["familyIn"]),
            o("b", "poor", "Say it is probably early dementia showing up.", "Labelling dementia during delirium is premature; reassess when she is well.", { trust: -10, insight: -5 }),
          ],
        },
        {
          id: "dl3b",
          kind: "medicines",
          skill: "neurocognitive:apply",
          prompt: "Reviewing her drug chart, what do you flag?",
          options: [
            o("a", "best", "Suggest switching to regular paracetamol with the lowest opioid dose that controls pain, and stopping the bladder pill that has strong anticholinergic effects.", "Untreated pain causes delirium, and so do opioids and anticholinergic drugs. Balance is the aim.", { risk: -15, adherence: 10 }),
            o("b", "poor", "Stop all her pain relief.", "Pain itself is a strong cause of delirium.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "dl4",
      title: "Session 4 · Going home",
      beats: [
        { when: { v: "risk", lte: 40 }, text: "Mrs Kaur is eating, joking with the physiotherapist and asks for her prayer book." },
        { when: { v: "risk", gte: 41 }, text: "She is calmer but still muddled in the evenings." },
      ],
      decisions: [
        {
          id: "dl4a",
          kind: "referral",
          skill: "neurocognitive:apply",
          prompt: "What do you set up for discharge?",
          options: [
            o("a", "best", "Tell the family that confusion can linger for a while, what signs mean coming back, and book a memory check in a few months, as delirium can unmask early dementia.", "Delirium raises the risk of later cognitive decline; a follow-up check catches it.", { insight: 15, adherence: 10, risk: -5 }),
            o("b", "poor", "Nothing more; it was just the infection.", "Without follow-up, lasting problems are missed.", { risk: 5 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Walking to the gurdwara", text: "Back home, Mrs Kaur walks with a frame to the gurdwara with Harpreet. Her memory check months later is normal." },
    { min: 50, title: "Slow recovery", text: "She goes home tired and forgetful for a few months. The family copes, but nobody booked the memory check." },
    { min: 0, title: "A long, hard stay", text: "Missed delirium leads to a fall and a longer stay. She leaves weaker and more confused than before." },
  ],
};

export const CAMPAIGNS_B: Campaign[] = [lucknow, kota, ahmedabad, kolkata, delhi];
