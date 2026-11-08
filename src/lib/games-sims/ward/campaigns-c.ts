/**
 * Ward Week campaigns, set C: ADHD in a schoolboy, anorexia nervosa in a
 * teenager, panic disorder, functional seizures and PTSD after a flood.
 * Original teaching stories; the player is a trainee psychologist on the team.
 */
import type { Campaign } from "./engine";
import { o, tags } from "./kit";

/* ------------------------------------------------------------ Bengaluru */
const bengaluru: Campaign = {
  id: "bengaluru",
  tags: tags("ADHD in a primary school child", "child", "Assess ADHD across settings and plan parent training, school support and medicine.", 4),
  title: "The boy who can't sit still",
  patient: "Arjun, 8, class 3 student",
  place: "Child guidance clinic, Bengaluru",
  blurb: "His school has sent a third note: he runs around in class, blurts answers and loses every pencil. His teacher suggests 'a strict boarding school'.",
  start: { risk: 40, trust: 40, insight: 25, family: 35, adherence: 35 },
  chapters: [
    {
      id: "bl1",
      title: "Session 1 · A busy room",
      beats: [
        { text: "Arjun climbs on the chair, spins the stool and opens every drawer while his mother Kavitha talks. 'He was like this from the time he could walk. At home too.'" },
        { text: "His father works nights in a call centre. Arjun sleeps after midnight most days, watching cartoons on the phone." },
      ],
      decisions: [
        {
          id: "bl1a",
          kind: "assessment",
          skill: "child:criteria",
          prompt: "How do you assess?",
          options: [
            o("a", "best", "Collect rating scales from both parents and the teacher, take a developmental history, check hearing, vision and sleep, and look for learning problems and anxiety.", "ADHD needs symptoms in two or more settings since before 12. Poor sleep, hearing loss and learning disorders can look the same or come along with it.", { insight: 15, trust: 10 }, ["fullAssess"]),
            o("b", "poor", "Diagnose ADHD now; you have seen enough in the room.", "One busy session is not enough; you need reports from more than one setting and a check for other causes.", { insight: -5 }),
            o("c", "harm", "Agree he is naughty and needs firmer beating at home.", "Physical punishment harms children and worsens behaviour; ADHD is a brain-based condition.", { trust: -20, family: -10, risk: 15 }),
          ],
        },
        {
          id: "bl1b",
          kind: "psychoeducation",
          skill: "child:apply",
          prompt: "Kavitha asks: 'Is it my fault? Too much phone?'",
          options: [
            o("a", "best", "Explain that ADHD is largely inherited and about how the brain manages attention and self-control, not bad parenting. Late nights and screens can make it worse, so sleep is worth fixing.", "Removing blame while naming changeable factors gets parents on board.", { family: 15, insight: 10 }),
            o("b", "poor", "Tell her phones cause ADHD.", "Screens don't cause ADHD, though they can worsen sleep and attention.", { insight: -5 }),
          ],
        },
      ],
    },
    {
      id: "bl2",
      title: "Session 2 · The results",
      beats: [
        { when: { flag: "fullAssess" }, text: "Both parents and the teacher rate him high on inattention and hyperactivity. Hearing and vision are normal. He reads at his grade level." },
        { text: "Kavitha has read online that ADHD tablets are 'like drugs' and will stunt his growth." },
      ],
      decisions: [
        {
          id: "bl2a",
          kind: "medicines",
          skill: "child:pharm",
          prompt: "His ADHD is moderate to severe. What do you discuss with the psychiatrist and parents?",
          options: [
            o("a", "best", "Parent training plus a trial of methylphenidate, explained honestly: it works for most children, can lower appetite and sleep, and height and weight are checked regularly.", "For school-age children with marked ADHD, medicine with behavioural support works best. Honest talk about side effects and monitoring answers the fear.", { adherence: 15, trust: 10 }, ["med"]),
            o("b", "poor", "Refuse medicine because of the online fears.", "Fears deserve answers, not avoidance; untreated ADHD harms schooling and self-esteem.", { adherence: -5 }),
            o("c", "harm", "Suggest a sedating antihistamine so he sleeps in class.", "Sedation isn't treatment and hampers learning.", { risk: 10, adherence: -10 }),
          ],
        },
        {
          id: "bl2b",
          kind: "family",
          skill: "child:apply",
          prompt: "What parenting strategies do you teach?",
          options: [
            o("a", "best", "Clear, short instructions with eye contact, a simple reward chart for one or two target behaviours, praise within seconds, and calm time-out instead of shouting.", "Behavioural parent training has strong evidence in ADHD. Immediate, consistent rewards suit how ADHD brains learn.", { family: 20, adherence: 10 }),
            o("b", "poor", "Take away all toys until his marks improve.", "Long, distant punishments don't work in ADHD and breed resentment.", { family: -10 }),
          ],
        },
      ],
    },
    {
      id: "bl3",
      title: "Session 3 · The school meeting",
      beats: [
        { text: "His class teacher says: 'Thirty-eight children. I can't give him special treatment.' The principal is open to ideas." },
      ],
      decisions: [
        {
          id: "bl3a",
          kind: "referral",
          skill: "child:apply",
          prompt: "What do you suggest to the school?",
          options: [
            o("a", "best", "Simple, low-cost changes: seat him near the teacher, break tasks into small parts, give him a job that lets him move, a daily home-school note, and praise for effort.", "Small classroom changes help many children, not just Arjun, and keep him in his own school.", { family: 10, adherence: 10, trust: 10 }, ["school"]),
            o("b", "harm", "Agree to boarding school to give the family a break.", "Removing a young child from home doesn't treat ADHD and adds distress.", { family: -15, risk: 10 }),
            o("c", "ok", "Write a letter asking for extra exam time only.", "Helpful, but day-to-day classroom changes matter more.", { family: 5 }),
          ],
        },
      ],
    },
    {
      id: "bl4",
      title: "Session 4 · Review",
      beats: [
        { when: { flag: "med" }, text: "Arjun finishes his homework in half the time. He eats less at lunch; dinner is fine. His teacher sends a smiley in the home-school diary." },
        { when: { notFlag: "med" }, text: "Arjun is a little better at home with the reward chart, but school is still hard." },
      ],
      decisions: [
        {
          id: "bl4a",
          kind: "medicines",
          skill: "child:pharm",
          when: { flag: "med" },
          prompt: "What do you check at review?",
          options: [
            o("a", "best", "Height, weight, blood pressure and pulse, sleep and appetite, mood, and any tics, with a plan for a bigger breakfast and food after school.", "Regular growth and heart checks and practical answers to appetite loss keep medicine safe and acceptable.", { adherence: 15, risk: -10 }),
            o("b", "poor", "Double the dose since it works.", "Dose changes follow response and side effects, not enthusiasm.", { risk: 10 }),
          ],
        },
        {
          id: "bl4b",
          kind: "psychoeducation",
          skill: "child:apply",
          prompt: "Arjun says, 'Am I a bad boy?' What do you say?",
          options: [
            o("a", "best", "'No. Your brain is fast like a race car with small brakes. We're helping your brakes get stronger.' Help his parents notice what he is good at.", "Self-esteem in children with ADHD is often battered; a kind, simple story and strengths focus protect it.", { insight: 15, trust: 15, risk: -5 }),
            o("b", "poor", "'If you behave, you'll be a good boy.'", "This keeps the 'bad boy' story alive.", { trust: -5 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Captain of the cricket team", text: "Arjun still forgets his water bottle, but he finishes classwork and was chosen to captain the class team. His mother says home feels lighter." },
    { min: 50, title: "Better days, hard days", text: "Some days go well, others don't. The reward chart has slipped and school notes still come." },
    { min: 0, title: "Sent away", text: "Arjun is moved to a boarding school after more complaints. He feels he is the problem, and his marks fall further." },
  ],
};

/* ------------------------------------------------------------ Mumbai */
const mumbai: Campaign = {
  id: "mumbai",
  tags: tags("Anorexia nervosa in an adolescent", "child", "Recognise medical danger in anorexia, prevent refeeding problems and start family-based treatment."),
  title: "Lighter",
  patient: "Zara, 16, competitive swimmer",
  place: "Adolescent ward, teaching hospital, Mumbai",
  blurb: "Her coach brought her in after she fainted at practice. She has lost a lot of weight in six months and says she is 'still too big'.",
  start: { risk: 70, trust: 30, insight: 15, family: 45, adherence: 30 },
  chapters: [
    {
      id: "mb1",
      title: "Session 1 · Emergency",
      beats: [
        { text: "Zara's BMI is 14. Her pulse is 40 at rest, her hands are cold and blue, and her periods stopped months ago. She says, 'I'm fine. I just need to train harder.'" },
      ],
      decisions: [
        {
          id: "mb1a",
          kind: "risk",
          skill: "child:risk",
          prompt: "What do you tell the team?",
          options: [
            o("a", "best", "This is a medical emergency: a very slow heart, very low weight and fainting. She needs admission, an ECG, blood salts including potassium and phosphate, and close monitoring.", "Anorexia has the highest death rate of any psychiatric illness. A pulse of 40, fainting and low BMI mean medical danger first.", { risk: -20, family: 5 }, ["admitted"]),
            o("b", "harm", "She can go home with a diet chart and come to OPD next month.", "Sending home a teenager with a heart rate of 40 risks sudden cardiac death.", { risk: 25 }),
            o("c", "poor", "Start therapy sessions in OPD only.", "Therapy matters, but medical risk must be handled first.", { risk: 15 }),
          ],
        },
      ],
    },
    {
      id: "mb2",
      title: "Session 2 · Feeding",
      beats: [
        { text: "The dietitian wants to start feeding. Zara cries: 'If I eat that I'll balloon.' Her mother Nasreen begs the team to 'just make her eat a lot fast'." },
      ],
      decisions: [
        {
          id: "mb2a",
          kind: "medicines",
          skill: "child:apply",
          prompt: "What do you raise about feeding?",
          options: [
            o("a", "best", "Start feeding at a careful level and build up steadily, with daily checks of phosphate, potassium and magnesium, and thiamine, as the medical team plans.", "Refeeding syndrome (falling phosphate and other salts) can cause heart failure in the first days. Careful, monitored feeding prevents it.", { risk: -20, adherence: 10 }, ["safeFeed"]),
            o("b", "harm", "Large meals straight away to restore weight fast.", "Rapid refeeding in severe malnutrition can trigger dangerous shifts in salts and heart failure.", { risk: 25 }, ["refeed"]),
            o("c", "poor", "Let Zara choose what and how much to eat.", "The illness drives her choices now; she needs a supported plan.", { risk: 10 }),
          ],
        },
        {
          id: "mb2b",
          kind: "psychoeducation",
          skill: "child:apply",
          prompt: "How do you talk with Zara?",
          options: [
            o("a", "best", "Separate Zara from the illness: 'The anorexia voice tells you you're too big. Our job is to help you fight it.' Ask what she misses that the illness has taken.", "Externalising the illness reduces blame and builds a shared goal, a core idea in family-based treatment.", { trust: 15, insight: 10 }),
            o("b", "poor", "Tell her she looks like a skeleton.", "Shocking comments feel like attacks and the illness hears them as success.", { trust: -15 }),
          ],
        },
      ],
    },
    {
      id: "mb3",
      title: "Session 3 · Family-based treatment",
      beats: [
        { when: { flag: "refeed" }, text: "On day three Zara's phosphate fell sharply and she became breathless. She needed intensive care for two days." },
        { when: { flag: "safeFeed" }, text: "Zara is medically stable and gaining slowly. Her heart rate is now in the fifties." },
        { text: "Her father Imran says: 'This is about willpower. She must decide to eat.'" },
      ],
      decisions: [
        {
          id: "mb3a",
          kind: "family",
          skill: "child:apply",
          prompt: "What treatment do you propose for home?",
          options: [
            o("a", "best", "Family-based treatment: for now, her parents take charge of meals, calmly and firmly, without arguing or blame. Later, control returns to Zara step by step.", "Family-based treatment is the best-supported therapy for adolescent anorexia. Parents are the resource, not the cause.", { family: 20, risk: -10, adherence: 10 }, ["fbt"]),
            o("b", "poor", "Individual therapy only; parents should stay out of food.", "For teenagers, keeping parents out of meals works less well.", { family: -5 }),
            o("c", "harm", "Tell the parents that their controlling style caused it.", "Blame is wrong and pushes families away.", { family: -20 }),
          ],
        },
      ],
    },
    {
      id: "mb4",
      title: "Session 4 · The pool",
      beats: [
        { text: "Zara asks to return to swimming. Her coach is keen: 'Nationals are coming.'" },
      ],
      decisions: [
        {
          id: "mb4a",
          kind: "referral",
          skill: "child:apply",
          prompt: "What do you advise?",
          options: [
            o("a", "best", "A graded return only once her weight and heart are safe, tied to eating enough, with the coach included in the plan and no weigh-ins at the club.", "Sport can motivate recovery but also drive restriction. A clear, medically guided plan protects her.", { insight: 10, trust: 10, risk: -10 }),
            o("b", "harm", "Back to full training now to keep her happy.", "Heavy training at low weight risks collapse and relapse.", { risk: 20 }),
          ],
        },
        {
          id: "mb4b",
          kind: "risk",
          skill: "suicide:risk",
          prompt: "Zara says she sometimes wishes she could disappear. What do you do?",
          options: [
            o("a", "best", "Ask directly about suicidal thoughts, plans and self-harm, and add this to her care plan and family safety plan.", "Suicide is a major cause of death in anorexia. Asking is always right.", { risk: -15, trust: 5 }),
            o("b", "poor", "Note it as low mood from hunger.", "Hunger affects mood, but suicidal thoughts must be assessed.", { risk: 10 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Back in the water", text: "A year later Zara is at a healthy weight and swims for fun and for her college team. She still notices the anorexia voice on stressful days, and now she talks back to it." },
    { min: 50, title: "Stable, still fighting", text: "Zara is out of danger but weight stays low. Meals at home are tense." },
    { min: 0, title: "Readmitted", text: "Zara is readmitted with a slow heart and low salts. The family feels blamed and exhausted." },
  ],
};

/* ------------------------------------------------------------ Hyderabad */
const hyderabad: Campaign = {
  id: "hyderabad",
  tags: tags("Panic disorder", "anxiety", "Recognise panic disorder after repeated emergency visits and treat it with CBT and an SSRI, not long-term sedatives.", 4),
  title: "Heart attack, again",
  patient: "Farhan, 30, software tester",
  place: "Emergency room and OPD, Hyderabad",
  blurb: "His sixth emergency visit in two months: racing heart, tingling hands, sure he is dying. Every ECG is normal.",
  start: { risk: 40, trust: 35, insight: 20, family: 45, adherence: 35 },
  chapters: [
    {
      id: "hy1",
      title: "Session 1 · The sixth visit",
      beats: [
        { text: "Farhan grips the bed rail. 'Something is wrong with my heart and nobody is finding it. My father died of a heart attack at 55.'" },
      ],
      decisions: [
        {
          id: "hy1a",
          kind: "assessment",
          skill: "anxiety:differentiate",
          prompt: "What do you do?",
          options: [
            o("a", "best", "Check that thyroid, sugar, blood count and a cardiac review are done, ask about caffeine, energy drinks and other substances, then ask about the attacks: sudden, peaking in minutes, with dread of the next one.", "Panic disorder is diagnosed after reasonable medical checks. Caffeine, thyroid and stimulants can mimic it.", { insight: 15, trust: 10 }, ["checked"]),
            o("b", "poor", "Tell him it's all in his head and he is wasting the doctors' time.", "This is false and humiliating; panic is real and treatable.", { trust: -20 }),
            o("c", "harm", "Order another round of every heart test to reassure him.", "Endless tests reinforce the belief that something is wrong.", { insight: -10, adherence: -5 }),
          ],
        },
      ],
    },
    {
      id: "hy2",
      title: "Session 2 · Making sense of the attacks",
      beats: [
        { text: "Farhan now avoids the metro and gym 'in case it starts'. He carries alprazolam the GP gave him and takes it most days." },
      ],
      decisions: [
        {
          id: "hy2a",
          kind: "psychoeducation",
          skill: "anxiety:apply",
          prompt: "How do you explain panic?",
          options: [
            o("a", "best", "Draw the panic cycle with him: a body sensation, the thought 'heart attack', more fear, more adrenaline, more sensations. Explain that the body's alarm is false, not dangerous.", "The cognitive model of panic is the base of CBT. Seeing the cycle makes the next step, testing it, possible.", { insight: 20, trust: 10 }, ["model"]),
            o("b", "poor", "Teach him only to breathe into a paper bag.", "A coping trick alone becomes a safety behaviour.", { insight: 3 }),
          ],
        },
        {
          id: "hy2b",
          kind: "medicines",
          skill: "antidepressants:pharm",
          prompt: "What do you raise with the psychiatrist about medicine?",
          options: [
            o("a", "best", "An SSRI started at a low dose and raised slowly (panic patients feel early jitteriness), with a plan to taper the alprazolam over time.", "SSRIs treat panic disorder; long-term benzodiazepines bring dependence and stop new learning in therapy.", { adherence: 15, risk: -5 }, ["ssri"]),
            o("b", "harm", "Increase the alprazolam to three times a day.", "Escalating benzodiazepines risks dependence and rebound panic.", { risk: 15, adherence: -10 }),
            o("c", "poor", "Stop the alprazolam today.", "Sudden stopping after daily use can cause withdrawal and rebound anxiety.", { risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "hy3",
      title: "Session 3 · Feeling it on purpose",
      beats: [
        { text: "You suggest bringing on the feelings in the room. Farhan laughs nervously. 'You want me to have an attack?'" },
      ],
      decisions: [
        {
          id: "hy3a",
          kind: "assessment",
          skill: "anxiety:apply",
          prompt: "How do you do the exposure?",
          options: [
            o("a", "best", "Interoceptive exposure: spin in a chair or run on the spot to raise his heart rate, rate the fear, and stay with it until it falls. Then plan a metro ride, dropping safety behaviours one by one.", "Learning that the sensations pass without disaster is what cures panic. Dropping safety behaviours lets the learning stick.", { insight: 15, adherence: 15, risk: -10 }, ["exposure"]),
            o("b", "poor", "Skip exposure; teach relaxation instead.", "Relaxation alone is weaker than exposure for panic.", { adherence: -5 }),
          ],
        },
      ],
    },
    {
      id: "hy4",
      title: "Session 4 · His wife's worry",
      beats: [
        { text: "His wife Ayesha says, 'I go with him everywhere now. I keep his phone charged and a water bottle in case.'" },
        { when: { flag: "exposure" }, text: "Farhan rode the metro alone twice this month. 'My heart raced. Then it stopped. I didn't die.'" },
      ],
      decisions: [
        {
          id: "hy4a",
          kind: "family",
          skill: "anxiety:apply",
          prompt: "How do you involve Ayesha?",
          options: [
            o("a", "best", "Thank her, explain how kind safety habits can keep panic going, and plan together to step back gradually while praising his brave steps.", "Family members often become safety signals. Planned stepping back helps recovery without leaving him alone.", { family: 15, insight: 10 }),
            o("b", "poor", "Tell her to stop going with him from tomorrow.", "Sudden withdrawal of support can feel like abandonment.", { family: -10 }),
          ],
        },
        {
          id: "hy4b",
          kind: "referral",
          skill: "anxiety:apply",
          prompt: "What does relapse prevention include?",
          options: [
            o("a", "best", "A written plan: early signs, his panic cycle, what to do in an attack, a booster session, and how to taper the SSRI slowly after a long steady period.", "A plan he owns keeps gains; slow tapering avoids discontinuation and relapse.", { adherence: 10, risk: -10 }),
            o("b", "poor", "Tell him to go to the ER if it happens again.", "This reopens the old cycle.", { risk: 5 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Gym at 7 am", text: "Farhan has had no emergency visits in a year. He still feels a flutter sometimes, and now he says to himself, 'false alarm', and carries on." },
    { min: 50, title: "Fewer attacks", text: "The attacks are less frequent, but he still avoids the metro and keeps a tablet in his pocket." },
    { min: 0, title: "Housebound", text: "Farhan now rarely leaves home without Ayesha and takes alprazolam four times a day." },
  ],
};

/* ------------------------------------------------------------ Jaipur */
const jaipur: Campaign = {
  id: "jaipur",
  tags: tags("Functional seizures", "trauma", "Explain functional seizures positively, avoid needless epilepsy drugs and find the stressors behind them."),
  title: "Fits that aren't epilepsy",
  patient: "Pooja, 19, BA first-year student",
  place: "Neurology ward, Jaipur",
  blurb: "She has had daily fits for two months. Three epilepsy medicines haven't helped. Her marriage is being arranged for after the exams.",
  start: { risk: 50, trust: 35, insight: 15, family: 35, adherence: 35 },
  chapters: [
    {
      id: "jp1",
      title: "Session 1 · On the video-EEG",
      beats: [
        { text: "Video-EEG records three of Pooja's typical fits: side-to-side head shaking, eyes tightly shut, lasting fifteen minutes, with a normal EEG throughout. Afterwards she remembers voices around her." },
      ],
      decisions: [
        {
          id: "jp1a",
          kind: "assessment",
          skill: "trauma:differentiate",
          prompt: "How do you read the findings?",
          options: [
            o("a", "best", "These fit functional (dissociative) seizures: eyes closed, side-to-side movements, long duration and a normal EEG during the event. Still, check for epilepsy as well, as some people have both.", "Video-EEG of a typical event is the gold standard. A minority have epilepsy too, so stay open.", { insight: 10, risk: -10 }, ["dx"]),
            o("b", "harm", "She is faking for attention.", "Functional seizures are not deliberate. Calling them fake causes harm and drives patients away.", { trust: -25 }, ["fake"]),
            o("c", "poor", "Add a fourth epilepsy drug.", "Antiepileptics don't help functional seizures and add side effects.", { risk: 10 }),
          ],
        },
        {
          id: "jp1b",
          kind: "psychoeducation",
          skill: "trauma:apply",
          prompt: "How do you explain it to Pooja and her mother?",
          options: [
            o("a", "best", "'Your fits are real, and they're not epilepsy. The brain's wiring is working, but it switches into a fit-like state, often linked to stress. This is common and can get better with therapy.'", "A clear, positive explanation that the problem is real and treatable is the first step of treatment.", { insight: 20, trust: 15 }, ["explained"]),
            o("b", "poor", "'There is nothing wrong with you.'", "This sounds like 'you're faking' and denies her suffering.", { trust: -15, insight: -5 }),
          ],
        },
      ],
    },
    {
      id: "jp2",
      title: "Session 2 · What is underneath",
      beats: [
        { when: { flag: "fake" }, text: "Pooja refuses to see you. Her mother says, 'The doctor said she is acting. Now relatives laugh at her.'" },
        { text: "Alone, Pooja says the fits started after she met the boy her family chose. 'He is twice my age. I want to finish college.'" },
      ],
      decisions: [
        {
          id: "jp2a",
          kind: "risk",
          skill: "trauma:apply",
          prompt: "What do you ask next?",
          options: [
            o("a", "best", "Gently ask about safety at home, any past abuse, low mood and thoughts of self-harm, and whether she feels forced into the marriage.", "Functional seizures often link to trauma and stress. Safety and suicide risk must be checked; forced marriage is a safeguarding issue.", { risk: -15, trust: 15 }, ["safety"]),
            o("b", "poor", "Tell her to accept the marriage; it will settle the fits.", "This dismisses her and may worsen distress.", { trust: -15, risk: 10 }),
          ],
        },
      ],
    },
    {
      id: "jp3",
      title: "Session 3 · Therapy and medicines",
      beats: [
        { text: "The neurologist asks your view on her three epilepsy drugs." },
      ],
      decisions: [
        {
          id: "jp3a",
          kind: "medicines",
          skill: "trauma:apply",
          prompt: "What do you suggest?",
          options: [
            o("a", "best", "Since the EEG shows no epilepsy, plan with the neurologist to taper the epilepsy drugs slowly, and start CBT for functional seizures: spotting warning signs and grounding skills.", "Unneeded antiepileptics carry side effects and confirm the wrong story. CBT-based therapy reduces functional seizures.", { adherence: 15, insight: 10 }, ["cbt"]),
            o("b", "poor", "Keep all three drugs just in case.", "Keeping drugs 'just in case' tells everyone it's epilepsy.", { insight: -5 }),
          ],
        },
        {
          id: "jp3b",
          kind: "psychoeducation",
          skill: "trauma:apply",
          prompt: "What do you teach for when a fit begins?",
          options: [
            o("a", "best", "Notice the warning feeling, then ground: feet on the floor, name five things she can see, slow breathing. Family keep her safe, stay calm and don't crowd or hold her down.", "Grounding at the warning stage can stop or shorten attacks. Calm family responses avoid making fits a crisis.", { insight: 15, family: 10 }),
            o("b", "poor", "Splash water on her face during fits.", "This is distressing and doesn't help.", { trust: -5 }),
          ],
        },
      ],
    },
    {
      id: "jp4",
      title: "Session 4 · The family meeting",
      beats: [
        { text: "Her parents come together. Her father: 'If the fits stop, the marriage can happen in summer.'" },
      ],
      decisions: [
        {
          id: "jp4a",
          kind: "family",
          skill: "trauma:apply",
          prompt: "How do you approach the meeting?",
          options: [
            o("a", "best", "With Pooja's agreement, help her parents hear her wish to finish college, explain how stress feeds the fits, and look for a middle path. Keep her right to choose in view.", "Reducing the stress behind the attacks and respecting her voice protects her health and her rights.", { family: 15, risk: -10, trust: 10 }),
            o("b", "harm", "Tell the parents the marriage plan is the cause and they are harming her.", "Blame hardens their stance and may cut her off from care.", { family: -20 }),
            o("c", "ok", "Avoid the marriage topic and talk only about the fits.", "Safe, but leaves the main stressor untouched.", { family: 5 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Exams written", text: "Pooja has one fit in three months and writes her exams. The marriage talk is postponed until after graduation. She knows her warning signs." },
    { min: 50, title: "Fewer fits", text: "The fits are less often, but the pressure at home hasn't changed, and she still takes one epilepsy drug." },
    { min: 0, title: "Back on the ward", text: "Pooja is admitted with a long attack and given more drugs. She feels nobody believes her." },
  ],
};

/* ------------------------------------------------------------ Kochi */
const kochi: Campaign = {
  id: "kochi",
  tags: tags("PTSD after a flood", "trauma", "Give psychological first aid after a disaster, then recognise and treat PTSD in the community."),
  title: "After the water",
  patient: "Thomas, 40, fisherman",
  place: "District mental health camp, near Kochi",
  blurb: "A flood swept through his village. He pulled neighbours onto his boat but couldn't reach an old woman. Now he can't go near the water.",
  start: { risk: 55, trust: 35, insight: 20, family: 45, adherence: 35 },
  chapters: [
    {
      id: "kc1",
      title: "Session 1 · The relief camp",
      beats: [
        { text: "It is a few days after the flood. Families sleep in a school hall. Thomas sits apart, shaking. 'I can still hear her calling.'" },
      ],
      decisions: [
        {
          id: "kc1a",
          kind: "assessment",
          skill: "trauma:apply",
          prompt: "What help do you offer now?",
          options: [
            o("a", "best", "Psychological first aid: make sure he is safe, fed and with family, listen if he wants to talk without pushing for detail, give practical information and say you will return.", "Early on, practical support and comfort help most. Most people recover naturally.", { trust: 15, risk: -10 }, ["pfa"]),
            o("b", "harm", "Hold a single group session where everyone must describe the worst moment in detail.", "Forced single-session debriefing can increase later PTSD.", { risk: 15, trust: -10 }, ["debrief"]),
            o("c", "poor", "Prescribe sleeping tablets to everyone in the camp.", "Routine sedatives don't prevent PTSD and bring their own risks.", { risk: 5 }),
          ],
        },
      ],
    },
    {
      id: "kc2",
      title: "Session 2 · Two months on",
      beats: [
        { text: "Thomas hasn't fished since. He wakes with nightmares of the old woman's hand slipping. He jumps at rain on the roof. He drinks toddy most nights to sleep." },
        { when: { flag: "debrief" }, text: "He says the group session 'opened everything and left it bleeding'." },
      ],
      decisions: [
        {
          id: "kc2a",
          kind: "assessment",
          skill: "trauma:criteria",
          prompt: "What do you assess?",
          options: [
            o("a", "best", "PTSD symptoms (reliving, avoidance, negative thoughts, being on edge), guilt about the woman, depression, suicide risk and how much he drinks.", "PTSD after disasters often comes with depression, survivor guilt and drinking; all need asking.", { insight: 15, risk: -10 }, ["assessed"]),
            o("b", "poor", "Tell him time heals and to be grateful he survived.", "After months of symptoms, waiting isn't the plan.", { trust: -10 }),
          ],
        },
        {
          id: "kc2b",
          kind: "risk",
          skill: "suicide:risk",
          when: { flag: "assessed" },
          prompt: "He says, 'Maybe I should have drowned instead of her.' What do you do?",
          options: [
            o("a", "best", "Ask directly about thoughts of ending his life and any plan, involve his wife in a safety plan, and look at the toddy together.", "Survivor guilt with drinking raises suicide risk in men. Direct questions and family involvement protect him.", { risk: -15, family: 10 }),
            o("b", "poor", "Change the subject to his boat repairs.", "Avoiding the topic leaves the risk unassessed.", { risk: 15 }),
          ],
        },
      ],
    },
    {
      id: "kc3",
      title: "Session 3 · Treatment",
      beats: [
        { text: "The nearest psychiatrist is an hour away by bus. The district team visits monthly." },
      ],
      decisions: [
        {
          id: "kc3a",
          kind: "referral",
          skill: "trauma:apply",
          prompt: "What treatment do you plan?",
          options: [
            o("a", "best", "Trauma-focused therapy (such as trauma-focused CBT or EMDR) with a trained counsellor through the district programme, plus phone follow-up between visits.", "Trauma-focused therapies are first-line for PTSD. Using local services and phone contact makes them reachable.", { adherence: 15, insight: 15 }, ["tfcbt"]),
            o("b", "poor", "General supportive chats only.", "Support helps, but trauma-focused work treats PTSD.", { insight: 3 }),
          ],
        },
        {
          id: "kc3b",
          kind: "medicines",
          skill: "antidepressants:pharm",
          prompt: "Therapy will take time to start. What do you discuss with the psychiatrist?",
          options: [
            o("a", "best", "An SSRI such as sertraline for PTSD and low mood, and help to cut down toddy rather than using it for sleep.", "SSRIs help PTSD symptoms. Alcohol worsens sleep and nightmares over time.", { adherence: 10, risk: -10 }),
            o("b", "harm", "Diazepam every night for the nightmares.", "Benzodiazepines don't treat PTSD, may worsen outcomes and combine dangerously with alcohol.", { risk: 15 }),
          ],
        },
      ],
    },
    {
      id: "kc4",
      title: "Session 4 · Back to the boat",
      beats: [
        { when: { flag: "tfcbt" }, text: "In therapy Thomas has told the full story. He is learning that he did what he could. Last Sunday he sat in his boat at the jetty for ten minutes." },
        { text: "The village is planning a memorial for those who died." },
      ],
      decisions: [
        {
          id: "kc4a",
          kind: "family",
          skill: "trauma:apply",
          prompt: "How do you support the next steps?",
          options: [
            o("a", "best", "Plan graded steps back to fishing with a friend, and encourage him and his family to take part in the memorial and the church community in a way that feels right.", "Graded return and community rituals support recovery and meaning after collective trauma.", { family: 15, insight: 10, risk: -10 }),
            o("b", "poor", "Advise him to avoid the memorial so it doesn't upset him.", "Avoidance keeps PTSD going; shared mourning helps.", { insight: -5 }),
          ],
        },
      ],
    },
  ],
  endings: [
    { min: 72, title: "Nets in the water", text: "Thomas is fishing again with his cousin. The nightmares are rare. He laid flowers at the memorial and spoke the old woman's name." },
    { min: 50, title: "On the shore", text: "Thomas works on boat repairs but can't go out to sea. He still drinks to sleep on bad nights." },
    { min: 0, title: "Lost at home", text: "Thomas stops working, drinks heavily and withdraws from his family." },
  ],
};

export const CAMPAIGNS_C: Campaign[] = [bengaluru, mumbai, hyderabad, jaipur, kochi];
