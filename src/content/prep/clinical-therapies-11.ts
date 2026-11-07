import type { PrepQuestion } from "@/lib/prep/types";
import { builder, MCP, MCP_MA, NET_MCP_MA } from "./_qb4";

const Q = builder("clinical-therapies", "therapies");

/** Clinical therapies part 11: case-based "best next step" vignettes. */
export const PART: PrepQuestion[] = [
  Q({
    id: "ther-case-0001",
    topic: "best-next-step",
    exams: MCP_MA,
    difficulty: 3,
    type: "passage",
    passage:
      "A 26-year-old woman with OCD checks the gas knob and door locks for 3 hours every night. Y-BOCS is 28. She is not depressed and is motivated, but says, 'I can't stop checking until I feel sure.' She has never had psychological treatment.",
    stem: "What is the best first-line psychological plan?",
    options: ["CBT with exposure and response prevention: leaving the house after a single check, with no re-checking, plus work on responsibility and certainty beliefs", "Progressive muscle relaxation first, so that she can tolerate anxiety while continuing to check in her usual way until she feels calmer", "Weekly supportive counselling exploring her childhood and family relationships, on the view that the checking will settle once these are understood", "Reassurance in each session that the gas and locks are safe, combined with a checklist so that she can tick off each item before bed"],
    answer: 0,
    explanation:
      "ERP-based CBT is the first-line psychological treatment for OCD. Here exposure means tolerating uncertainty after one check, and response prevention means no repeated checking or reassurance, combined with cognitive work on inflated responsibility and the need for certainty. Relaxation does not reduce compulsions. Supportive counselling lacks evidence for OCD. Repeated reassurance is itself a compulsion and maintains the problem.",
    module: "ocd",
    ref: "NICE CG31; Foa ERP",
  }),
  Q({
    id: "ther-case-0002",
    topic: "best-next-step",
    exams: MCP_MA,
    difficulty: 3,
    type: "passage",
    passage:
      "A 34-year-old man begins CBT for social anxiety. In session 3 he says he went to an office party as homework but 'it was awful'. On questioning, he stood in a corner, rehearsed every sentence in his head, avoided eye contact, and left after 10 minutes. He believes everyone saw him blushing.",
    stem: "What is the most useful next step in cognitive therapy for social anxiety?",
    options: ["Drop exposure for now, since the party raised his anxiety, and teach relaxation and positive self-talk", "Prescribe a beta-blocker for blushing and stop psychological work, as the problem is physical", "Compare a conversation with and without his safety behaviours, then use video feedback", "Ask him to attend more parties in exactly the same way, as any exposure will help eventually"],
    answer: 2,
    explanation:
      "His exposure was undermined by safety behaviours (rehearsing, avoiding eye contact, leaving early) and self-focus, which keep beliefs intact and can even make him look odd. Clark's cognitive therapy uses an in-session experiment (a conversation with and without safety behaviours), then video feedback so he sees how he actually comes across. Giving up, using medication alone, or repeating the same exposure would miss the maintaining processes.",
    module: "anxiety",
    ref: "Clark & Wells 1995; Clark et al. 2006",
  }),
  Q({
    id: "ther-case-0003",
    topic: "best-next-step",
    exams: MCP,
    difficulty: 4,
    type: "passage",
    passage:
      "A 29-year-old woman with PTSD after a road accident has 12 sessions of trauma-focused CBT. Nightmares reduce, but she still feels 'it was my fault' because she was driving, though police found the other driver was drunk and solely to blame. She avoids driving and feels intense guilt.",
    stem: "Which intervention best targets what is maintaining her symptoms now?",
    options: ["Add more relaxation and breathing training, since her remaining symptoms reflect general arousal rather than any specific belief", "Cognitive work on the guilt appraisal, for example a responsibility pie chart and questioning of hindsight bias, combined with graded return to driving", "Start a benzodiazepine at night to reduce guilt and arousal, and review in a month to see whether driving becomes easier", "Discharge her with a relapse-prevention leaflet, since nightmares, the core PTSD symptom, have now largely resolved"],
    answer: 1,
    explanation:
      "In the Ehlers and Clark model, persistent negative appraisals of the trauma (here, self-blame) and avoidance maintain PTSD. Guilt often rests on hindsight bias ('I should have known') and inflated responsibility, which can be examined with a responsibility pie chart and Socratic questions, alongside graded return to driving. Relaxation does not address the appraisal. Benzodiazepines are not recommended for PTSD. Stopping now leaves key maintaining factors in place.",
    module: "trauma",
    ref: "Ehlers & Clark 2000; Kubany guilt work",
  }),
  Q({
    id: "ther-case-0004",
    topic: "best-next-step",
    exams: NET_MCP_MA,
    difficulty: 2,
    type: "passage",
    passage:
      "A 19-year-old college student is brought by friends after taking 20 paracetamol tablets 6 hours ago following a break-up. She is medically stable so far and says she 'just wanted to sleep'. Her mother is on the way.",
    stem: "What is the immediate priority?",
    options: ["Urgent medical assessment, including timed paracetamol levels and acetylcysteine if indicated, followed by a full psychosocial assessment once she is medically fit", "Begin a brief course of CBT for low self-esteem today, since the overdose followed a break-up and she says she only wanted to sleep", "Send her home with her mother once she arrives, with a follow-up appointment in the outpatient clinic next week", "Ask her to sign a no-suicide contract, then arrange routine outpatient counselling, since she is medically stable at present"],
    answer: 0,
    explanation:
      "Paracetamol overdose can cause delayed, fatal liver damage even when the person looks well, so medical management (levels at 4 hours or later, acetylcysteine) comes first. Then a full psychosocial assessment of risk, needs and supports should follow, as NICE recommends for everyone who self-harms. Therapy can come later. Sending her home now is unsafe. No-suicide contracts have no evidence of preventing suicide and can give false reassurance.",
    module: "suicide",
    ref: "NICE NG225; UK paracetamol overdose guidance",
  }),
  Q({
    id: "ther-case-0005",
    topic: "best-next-step",
    exams: MCP_MA,
    difficulty: 3,
    type: "passage",
    passage:
      "A 40-year-old man with alcohol dependence says, 'My wife says I drink too much. Maybe she's right, but it's the only way I relax after work. I don't know.' He is attending only because his wife insisted.",
    stem: "Which approach fits his stage of change best?",
    options: ["Ask him to commit today to a detoxification admission, since his wife's concern and his drinking pattern make dependence likely", "Explain in detail how alcohol causes cirrhosis and early death, so that fear of the consequences motivates him to stop", "Use motivational interviewing to explore his ambivalence, reflect both sides, and draw out his own reasons for change", "Tell him to come back when he is ready to stop, as treatment is unlikely to work while he is unsure"],
    answer: 2,
    explanation:
      "He is ambivalent ('maybe she's right... I don't know'), which suggests contemplation. MI is designed for this: it explores both sides, avoids argument, and evokes his own motivation. Pushing detoxification or lecturing at this stage tends to increase resistance. Refusing to see him wastes a chance to build motivation.",
    module: "substance",
    ref: "Miller & Rollnick 2013; Prochaska & DiClemente",
  }),
  Q({
    id: "ther-case-0006",
    topic: "best-next-step",
    exams: MCP,
    difficulty: 4,
    type: "passage",
    passage:
      "A 23-year-old woman with BPD is in DBT. In session she reports she cut herself on Tuesday and also binge-drank twice. She wants to spend the session talking about a conflict with her roommate, and becomes irritated when the therapist mentions the diary card.",
    stem: "According to DBT's target hierarchy, how should the therapist organise the session?",
    options: ["Follow her agenda fully this week and discuss the roommate, since the diary card would feel invalidating", "Validate her wish, but start with a chain analysis of the self-harm, then therapy-interfering issues", "Spend the whole session on the binge drinking, since substance misuse drives most relapse in BPD", "End the session early because she is irritated, and offer to resume next week when she is calmer"],
    answer: 1,
    explanation:
      "DBT works down a hierarchy: life-threatening behaviours (self-harm), then therapy-interfering behaviours (resistance to the diary card), then quality-of-life problems (binge drinking, roommate conflict). Validation and the hierarchy go together: the therapist acknowledges her wish while keeping the agenda. Simply following her agenda would neglect the self-harm. Focusing only on drinking skips higher targets. Ending the session would reinforce avoidance.",
    module: "personality",
    ref: "Linehan 1993",
  }),
  Q({
    id: "ther-case-0007",
    topic: "best-next-step",
    exams: MCP_MA,
    difficulty: 3,
    type: "passage",
    passage:
      "A 7-year-old boy has frequent tantrums, refuses instructions, and hits his younger sister. His parents shout and sometimes give in to stop the tantrums. Teachers report fewer problems at school. There is no developmental delay.",
    stem: "What is the most evidence-based first intervention?",
    options: ["Behavioural parent training: more praise, clear commands, consistent consequences, no giving in", "Weekly individual play therapy for the boy, so he can express feelings without his parents", "Methylphenidate, since tantrums, refusal and hitting suggest an underlying ADHD", "Advise the parents to ignore all his behaviour, including hitting, to give no attention"],
    answer: 0,
    explanation:
      "Behavioural parent training is first-line for oppositional behaviour in young children. It builds the parent-child relationship through positive attention, then teaches effective commands and consistent, non-violent consequences, which breaks the coercive cycle of escalation and giving in (Patterson). Play therapy alone has weaker evidence. Stimulants treat ADHD, which is not suggested here. Ignoring aggression is unsafe; planned ignoring applies only to minor attention-seeking behaviour.",
    module: "child",
    ref: "NICE CG158; Patterson coercion theory",
  }),
  Q({
    id: "ther-case-0008",
    topic: "best-next-step",
    exams: MCP,
    difficulty: 4,
    type: "passage",
    passage:
      "A 31-year-old woman in cognitive therapy for depression has improved on the BDI from 32 to 12 over 10 sessions. She now reports that whenever she feels sad she thinks, 'Here it comes again, I'm going to be depressed for ever,' and starts to ruminate. She has had four previous episodes.",
    stem: "Which next step is most supported by evidence for preventing relapse?",
    options: ["Stop therapy now, since her BDI shows she has responded and more sessions would foster dependence", "Increase sessions to twice a week indefinitely, to catch any return of symptoms early", "Complete relapse-prevention work and consider MBCT, which targets mood-triggered depressive thinking", "Refer her for long-term psychoanalysis to uncover the childhood roots of her depression"],
    answer: 2,
    explanation:
      "She shows cognitive reactivity: small dips in mood trigger catastrophic thinking and rumination, a strong predictor of relapse. CBT relapse-prevention work and MBCT (which is most helpful for people with three or more previous episodes) target exactly this. Stopping abruptly leaves this vulnerability untreated. Indefinite frequent sessions are not evidence-based. Switching to long-term analysis is not the logical next step.",
    module: "depression",
    ref: "Segal et al.; Kuyken et al. 2016",
  }),
  Q({
    id: "ther-case-0009",
    topic: "best-next-step",
    exams: MCP_MA,
    difficulty: 2,
    type: "passage",
    passage:
      "A 52-year-old woman has panic disorder with agoraphobia for 3 years. She takes alprazolam 0.5 mg whenever she feels anxious and always carries it, even when she does not use it. She has started CBT and asks whether she can keep the tablets in her bag 'just in case' during exposure.",
    stem: "What is the most appropriate CBT-consistent advice?",
    options: ["Yes, she can keep the tablets with her; carrying a pill she does not take will not affect what she learns from exposure", "Explain that the tablet acts as a safety signal, and plan to drop it gradually during exposures, with any taper agreed with her prescriber", "Suggest she takes alprazolam 30 minutes before each exposure so that anxiety stays manageable and she completes the tasks", "Suggest she stops CBT and relies on medication, since she clearly prefers tablets as her way of coping"],
    answer: 1,
    explanation:
      "Safety signals such as carrying a pill, even unused, can block disconfirmation of the belief that she would not cope without it, and short-acting benzodiazepines taken around exposure can reduce learning. The usual plan is to fade these safety signals within graded exposure and to taper the benzodiazepine safely with the prescriber. Saying it has no effect is wrong. More alprazolam deepens dependence. Stopping CBT removes the most effective long-term treatment.",
    module: "anxiety",
    ref: "Barlow; Otto et al.",
  }),
  Q({
    id: "ther-case-0010",
    topic: "best-next-step",
    exams: MCP,
    difficulty: 3,
    type: "passage",
    passage:
      "A 45-year-old man with chronic low back pain has been off work for 8 months. Scans show only mild degenerative changes. He avoids lifting anything, rests most of the day, says 'If I move wrongly I'll damage my spine,' and is increasingly low in mood.",
    stem: "Which psychological approach is best supported?",
    options: ["CBT or ACT for chronic pain, with graded activity or graded exposure to feared movements and work on fear-avoidance beliefs and mood", "Strict bed rest until the pain settles, then a gradual return to work, to avoid further injury to the spine", "Psychoanalytic therapy to explore the unconscious meaning of the pain and its links to his early relationships", "Repeat MRI scans every few months to reassure him that the spine is not getting worse"],
    answer: 0,
    explanation:
      "The fear-avoidance model says catastrophic beliefs about pain lead to avoidance, deconditioning, disability and low mood. CBT and ACT with graded activity or exposure to feared movements reduce disability and fear, even if pain intensity changes less. Bed rest worsens outcomes. Repeated scans increase worry and medicalisation. Psychoanalysis has little evidence for this problem.",
    module: "therapies",
    ref: "Vlaeyen & Linton 2000; Williams et al. Cochrane",
  }),
  Q({
    id: "ther-case-0011",
    topic: "best-next-step",
    exams: MCP,
    difficulty: 4,
    type: "passage",
    passage:
      "A 20-year-old man with first-episode schizophrenia is stable on medication. He lives with his parents. His mother is very anxious, does everything for him and phones him 10 times a day when he goes out; his father often criticises him as 'lazy'. He relapsed once after a family argument.",
    stem: "Which intervention most directly targets his relapse risk in this home?",
    options: ["Advise him to move out immediately to a hostel, since the home environment is clearly harmful to him", "Long-term individual psychoanalysis to help him understand his relationship with his mother", "Family intervention: psychoeducation, communication and problem-solving work, and help to reduce criticism and over-involvement", "No psychosocial intervention; regular medication alone is enough to prevent relapse in first-episode schizophrenia"],
    answer: 2,
    explanation:
      "The home shows high expressed emotion: emotional over-involvement (mother) and criticism (father), both linked to relapse. Family intervention reduces relapse and readmission, and NICE recommends offering it to families of people with psychosis. Moving out abruptly may not be practical or wanted and does not address the family's needs. Psychoanalysis is not indicated for psychosis. Medication alone ignores a modifiable risk.",
    module: "psychosis",
    ref: "Leff & Vaughn; Pharoah et al. Cochrane",
  }),
  Q({
    id: "ther-case-0012",
    topic: "best-next-step",
    exams: MCP_MA,
    difficulty: 3,
    type: "passage",
    passage:
      "A 17-year-old girl with bulimia nervosa binges and vomits about 10 times a week. She is ashamed and has not told her parents. Her BMI is normal, but potassium is 2.9 mmol/L.",
    stem: "What should be done first?",
    options: ["Start CBT for eating disorders straight away and recheck potassium after a few weeks", "Urgent medical care for the low potassium, then eating-disorder treatment, discussing family involvement", "Advise her to cut out carbohydrates, since removing sweet foods will stop the cycle", "Begin family therapy at once and leave the blood result to the GP to follow up"],
    answer: 1,
    explanation:
      "Low potassium from frequent vomiting can cause dangerous arrhythmias, so medical risk comes first. For adolescents with bulimia, NICE recommends bulimia-focused family therapy, with individual CBT for eating disorders as an alternative. As she is a minor, involving her parents should be discussed carefully with attention to confidentiality and safety. Ignoring the result is unsafe, restricting carbohydrates increases the binge-restrict cycle, and family work still needs medical review first.",
    module: "more-disorders",
    ref: "NICE NG69",
  }),
  Q({
    id: "ther-case-0013",
    topic: "best-next-step",
    exams: NET_MCP_MA,
    difficulty: 2,
    type: "passage",
    passage:
      "A 66-year-old widow presents 4 months after her husband's death. She cries daily, sleeps 6 hours, eats normally, still enjoys her grandchildren, and has no guilt, hopelessness or suicidal thoughts. She is managing her affairs. She asks if she needs 'tablets or therapy'.",
    stem: "What is the most appropriate response?",
    options: ["Explain that her reactions fit normal grief, offer support and information on bereavement services, and review if symptoms worsen or last much longer", "Start an SSRI now, since daily crying and reduced sleep 4 months after a death suggest a depressive episode", "Diagnose prolonged grief disorder and begin weekly grief-focused therapy to prevent chronic grief", "Refer for ECT assessment, since older adults with grief often develop severe depression that responds poorly to other treatments"],
    answer: 0,
    explanation:
      "Four months after a death, crying, mild sleep change and preserved enjoyment, self-worth and function fit normal grief. Routine treatment of normal grief is not recommended, and grief counselling for uncomplicated grief shows little benefit. Prolonged grief disorder needs at least 12 months in adults under DSM-5-TR. Antidepressants and ECT are for depressive disorders, which she does not have. Watchful support with review is right.",
    module: "trauma",
    ref: "DSM-5-TR; Currier et al. 2008",
  }),
  Q({
    id: "ther-case-0014",
    topic: "best-next-step",
    exams: MCP,
    difficulty: 4,
    type: "passage",
    passage:
      "A therapist notices that after a client cancelled two sessions without notice, she felt annoyed and is tempted to discharge him. On reflection, she recalls that he described his parents as repeatedly giving up on him. In the next session he arrives late and says, 'I guess you're fed up with me too.'",
    stem: "What is the most helpful therapeutic response?",
    options: ["Agree that she is frustrated and discharge him, since missed sessions break the contract", "Ignore the comment and keep to the agenda, to avoid rewarding attention-seeking", "Explore the comment openly, link it gently to his past, and work to repair the alliance", "Reassure him that all is fine and avoid mentioning the cancellations at all"],
    answer: 2,
    explanation:
      "His comment shows an expectation that she will reject him, as his parents did, and her annoyance shows she is being drawn into that pattern. Talking about this openly and non-defensively is rupture repair; it can give him a different experience of a relationship that survives difficulty. Discharging him would confirm the pattern. Ignoring or brushing it off misses the chance and may deepen the rupture.",
    ref: "Safran & Muran 2000",
  }),
  Q({
    id: "ther-case-0015",
    topic: "best-next-step",
    exams: MCP_MA,
    difficulty: 3,
    type: "passage",
    passage:
      "A 37-year-old woman with recurrent depression starts CBT. In session 1 she says she cannot concentrate long enough to read, is in bed most of the day, and finds thought records 'pointless'. PHQ-9 is 23.",
    stem: "What is the most appropriate focus for the early sessions?",
    options: ["Start detailed core belief work with the downward arrow, since recurrent depression usually reflects deep schemas", "Begin with behavioural strategies: activity monitoring and scheduling, graded tasks and small achievable steps, with simple written summaries", "Ask her to complete three thought records a day to build the habit of catching negative thoughts", "Spend the first sessions exploring childhood memories to understand the origins of her depression"],
    answer: 1,
    explanation:
      "In severe depression with poor concentration, Beck recommended starting with behavioural work, such as activity scheduling and graded task assignment, because complex cognitive tasks are hard and can feel like more failure. Behavioural activation lifts mood and gives evidence against hopeless predictions. Core belief work and heavy thought-record homework are better left for later, and childhood exploration is not the CBT priority.",
    module: "depression",
    ref: "Beck et al. 1979",
  }),
  Q({
    id: "ther-case-0016",
    topic: "best-next-step",
    exams: MCP,
    difficulty: 4,
    type: "passage",
    passage:
      "A 42-year-old man with health anxiety checks his body for lumps several times a day, searches symptoms online for hours and asks his wife for reassurance about 20 times daily. He asks the therapist, 'Can you just tell me I don't have cancer?'",
    stem: "Which CBT approach is most appropriate?",
    options: ["Show how checking and reassurance keep the anxiety going, reduce them, and test beliefs", "Reassure him at each session that he does not have cancer, since his tests were normal", "Arrange more scans so he can be certain, then begin therapy once he is reassured", "Ask his wife to reassure him every time he asks, so anxiety does not build up"],
    answer: 0,
    explanation:
      "In health anxiety, reassurance and checking bring short-term relief but keep the worry going, much like compulsions in OCD. CBT for health anxiety (Salkovskis and Warwick) shares a formulation of this cycle, reduces safety behaviours gradually, involves family in not giving repeated reassurance, and tests catastrophic interpretations through experiments. Repeated reassurance and scans feed the cycle.",
    module: "more-disorders",
    ref: "Salkovskis & Warwick 1986; Tyrer et al. 2014",
  }),
  Q({
    id: "ther-case-0017",
    topic: "best-next-step",
    exams: NET_MCP_MA,
    difficulty: 3,
    type: "mcq",
    stem: "A 28-year-old woman with moderate depression prefers not to take medication and lives in a rural block with no psychologist. A trained lay counsellor visits the primary health centre weekly. What is the most practical evidence-based option?",
    options: ["Explain that nothing effective can be offered without a specialist, and refer her far away", "Prescribe a benzodiazepine for a few weeks to help her cope until a specialist is free", "A brief structured treatment from the supervised lay counsellor, with a plan to step up", "Refer her for ECT, since moderate depression rarely improves without physical treatment"],
    answer: 2,
    explanation:
      "Trials in India and elsewhere show that brief, structured treatments such as the Healthy Activity Programme, delivered by supervised lay counsellors, help moderate to severe depression and are cost-effective. This respects her preference and fits stepped care. Saying nothing can be done ignores task-sharing evidence. Benzodiazepines do not treat depression and carry dependence risk. ECT is for severe or treatment-resistant cases.",
    module: "depression",
    ref: "Patel et al. 2017 Lancet",
  }),
  Q({
    id: "ther-case-0018",
    topic: "best-next-step",
    exams: MCP,
    difficulty: 3,
    type: "passage",
    passage:
      "A 26-year-old man in CBT for psychosis believes his neighbours are poisoning his food. He eats only sealed packets and has lost 6 kg. He is willing to talk about the belief but becomes angry if told it is not true.",
    stem: "Which CBTp approach is most appropriate?",
    options: ["Tell him clearly that the belief is a delusion and that he must accept this to recover", "Build a shared formulation, explore the evidence with curiosity, and test predictions safely", "Avoid talking about the belief at all, since discussing delusions makes them stronger", "Encourage him to confront the neighbours so that he can find out the truth directly"],
    answer: 1,
    explanation:
      "CBT for psychosis avoids direct confrontation, which tends to strengthen conviction and damage the alliance. It uses a shared formulation, normalising, gentle evidence review ('what makes you think so? what else might explain this?') and small behavioural tests, while attending to safety (here, weight loss). Ignoring the belief misses the target. Confronting the neighbours could be dangerous.",
    module: "psychosis",
    ref: "Kingdon & Turkington; Morrison",
  }),
  Q({
    id: "ther-case-0019",
    topic: "best-next-step",
    exams: MCP_MA,
    difficulty: 2,
    type: "mcq",
    stem: "A 9-year-old girl has a severe dog phobia and will not go to a friend's house that has a pet. Her parents want help before a family trip. What is the best psychological treatment?",
    options: ["Graded exposure from pictures to a calm dog, then closer contact, with modelling and praise", "Weekly play therapy without any exposure, so that she can express her fears in a safe setting", "Advise her parents to keep her away from dogs, since forcing contact could make the fear worse", "Give a small dose of diazepam before outings so that she can cope with dogs during the trip"],
    answer: 0,
    explanation:
      "Specific phobia in children responds well to graded or intensive exposure, often combined with modelling and reinforcement. Even one-session treatment (Öst) shows good results. Permanent avoidance maintains the fear. Benzodiazepines are not recommended and can interfere with learning. Play therapy without exposure has little evidence for phobias.",
    module: "child",
    ref: "Öst et al. 2001",
  }),
  Q({
    id: "ther-case-0020",
    topic: "best-next-step",
    exams: MCP,
    difficulty: 4,
    type: "passage",
    passage:
      "A 35-year-old patient tells his therapist in the eighth session that he has detailed plans to kill his former business partner, who cheated him, and has found out where he lives. He says, 'I'm telling you because you have to keep it confidential.'",
    stem: "What is the most appropriate action?",
    options: ["Keep it confidential, since confidentiality is absolute and breaking it would destroy trust", "Note it in the file but take no action, since people often say such things when angry", "Explain the limits of confidentiality, assess risk, consult, and protect the person if needed", "End therapy at once and refer him elsewhere, without telling anyone about the threat"],
    answer: 2,
    explanation:
      "Confidentiality is not absolute. Where there is a serious and specific threat to an identifiable person, therapists have a duty to take reasonable protective steps, an idea associated with the Tarasoff case. Professional codes and Indian law also allow disclosure to prevent serious harm. Actions should be proportionate, documented and discussed with seniors. Keeping it secret, ignoring it or abandoning the patient are all unsafe.",
    module: "ethics-law",
    ref: "Tarasoff v Regents of the University of California 1976; RCI and MHCA 2017 confidentiality provisions",
  }),
];
