import type { Scenario } from "../scenarios";
import { rich } from "./make";

/** Rich cases, batch B. */
export const RICH_B: Scenario[] = [
  rich("wy-g029", {
    setting: "You are a counselling psychologist in a college counselling centre in Bengaluru.",
    lines: ["Amit, 24, an MBA student, is in his fourth session for depression.", "He has missed two weeks of classes and says therapy is 'pointless'.", "You had depression yourself as a student and recovered well. He does not know this."],
    beats: [
      {
        says: "“Nobody ever really gets better from this. You wouldn't understand.”",
        hints: ["Think about whose story the session is for, and when sharing your own helps.", "Self-disclosure helps only if it is brief and turns the focus straight back to him. A long story makes you the subject.", "The best choice offers short, general hope and then asks about his fear."],
        choices: [
          ["b", "Say briefly that many people do recover, then ask what he is most afraid of", "He talks about fearing he will fail again. A short message of hope keeps the focus on him."],
          ["o", "Tell him your full story of depression and recovery so he sees it is possible", "He starts asking about your treatment instead of his own. A long story makes you the subject."],
          ["h", "Say you know exactly how he feels, because you had depression too", "He feels you have assumed his experience and goes quiet. No one knows exactly how another feels."],
          ["o", "Show him research figures on recovery rates from depression", "Facts can help a little, but they do not touch his hopelessness. Ask about his fear first."],
        ],
      },
    ],
    concept: "Therapeutic self-disclosure",
    point: "Share about yourself only when it clearly helps the client, keep it short, and bring the focus straight back to them.",
    errors: ["Long personal stories.", "Claiming to know exactly how the client feels.", "Using disclosure to meet your own needs."],
  }),

  rich("wy-r048", {
    setting: "You are a psychology trainee in a hospital OPD in Siliguri, near the border.",
    lines: ["A girl of about 14 is brought for headaches by a man who says he is her 'uncle'.", "She keeps her eyes down and does not speak. The man answers every question for her.", "He says she is going to 'work in a house' in a big city next week."],
    beats: [
      {
        says: "The man says, “Just give her some tablets. We have a train to catch.”",
        hints: ["Think about the child's safety, not only her headache.", "A child who cannot speak for herself, travelling for 'work' with a man doing all the talking, are warning signs of trafficking.", "The best choice sees her alone and brings in child protection services."],
        choices: [
          ["b", "Find a reason to see her alone with a female staff member, and call Childline 1098 or the police", "Alone, she says she is from another state and does not know the man. Services step in before the train leaves."],
          ["h", "Treat the headache and let them go, since it is not your business", "You may have let a trafficked child go. Child labour and trafficking are crimes you must act on."],
          ["o", "Ask the man for her parents' phone number to check she is allowed to travel", "He gives a false number. Asking the suspect alone does not protect her."],
          ["o", "Note your worry in the file and tell your supervisor after the clinic", "Telling your supervisor is right, but after the clinic they will be gone. Act now."],
        ],
      },
    ],
    concept: "Recognising trafficking",
    point: "A child who does not speak, an adult who answers for her, and travel for 'work' are warning signs. See the child alone and call Childline 1098.",
    errors: ["Treating only the physical complaint.", "Checking the story with the suspected trafficker.", "Waiting until after the visit to act."],
  }),

  rich("wy-l057", {
    setting: "You are a psychology trainee on an inpatient ward in Pune, working with the treating team.",
    lines: ["Vikas, 32, has schizophrenia and was admitted under supported admission two weeks ago.", "He says he is well and wants to go home, and has appealed to the Mental Health Review Board.", "The team believes he still meets the criteria and needs a few more weeks."],
    beats: [
      {
        says: "A nurse says, “Tell him to drop the appeal. It just creates work.”",
        hints: ["Think about the patient's rights under the Mental Healthcare Act.", "A review by the Board is his right. The team's job is to give the Board clear, honest information.", "The best choice prepares a clear account and supports his right to be heard."],
        choices: [
          ["b", "Help the team prepare a clear account of why he meets the criteria and the care plan, and make sure he can put his own case", "The Board hears both sides and decides fairly. Supporting the review protects his rights."],
          ["h", "Tell him the appeal will make the team angry and could keep him in longer", "He withdraws in fear. Pressuring him breaches his rights."],
          ["o", "Tell him the Board rarely agrees with patients, so there is little point", "He loses hope and may drop his appeal. He has a right to a fair review."],
          ["o", "Leave it entirely to the doctors and stay out of it", "The doctors lead, but your observations may help the Board, and he needs support."],
        ],
      },
    ],
    concept: "Mental Health Review Board",
    point: "Patients admitted under the Mental Healthcare Act have the right to have their admission reviewed by the Board. The team supports that right and gives clear information.",
    errors: ["Discouraging appeals.", "Seeing the review as a nuisance.", "Not helping the patient put his case."],
  }),

  rich("wy-l045", {
    setting: "You are a psychology trainee in a community mental health clinic in Lucknow.",
    lines: ["Mohan, 45, has bipolar disorder and has been well on treatment for two years.", "His father died last year. His brother says Mohan is 'mad' and cannot inherit his share of the family land.", "Mohan is worried and asks you what to do."],
    beats: [
      {
        says: "“Can my brother really take my share because of my illness?”",
        hints: ["Think about what is within your role, and who can give the right help.", "Legal advice is outside a psychologist's scope, but people with mental illness have a right to free legal aid under the Act.", "The best choice links him with free legal aid and supports him emotionally."],
        choices: [
          ["b", "Explain that he has a right to free legal aid under the Mental Healthcare Act and help him contact the legal services authority", "He gets free legal help and keeps his share. Linking him with the right service protects his rights."],
          ["h", "Tell him what you think the inheritance law says and what he should do", "Your advice turns out to be wrong and he loses time. Legal advice is outside your role."],
          ["o", "Tell him it is a family matter he should settle with his brother", "He gives in and loses his share. Calling it a family matter leaves him unprotected."],
          ["o", "Write a letter saying he is mentally fit, so he can show his brother", "A letter may help later, but only on request and within what you have assessed. He needs legal help first."],
        ],
      },
    ],
    concept: "Right to legal aid",
    point: "The Mental Healthcare Act 2017 gives people with mental illness the right to free legal aid. Link them with legal services rather than giving legal advice yourself.",
    errors: ["Giving legal advice.", "Calling rights issues 'family matters'.", "Writing letters outside your assessment."],
  }),

  rich("wy-g003", {
    setting: "You are a psychology trainee in a child guidance clinic in Ahmedabad.",
    lines: ["You have seen Dev, 9, and his parents for six sessions for ADHD.", "It is the week before Diwali.", "The clinic has no written gift policy, but staff usually share festival sweets."],
    beats: [
      {
        says: "His mother hands you a box of kaju katli: “For all of you at the clinic. Happy Diwali!”",
        hints: ["Think about culture, the size of the gift and who it is meant for.", "Small festival sweets for the whole clinic are an ordinary courtesy in India; refusing can offend.", "The best choice accepts warmly and shares it openly with the team."],
        choices: [
          ["b", "Thank them warmly and share the sweets with the whole team", "The family feels their custom is respected. Small festival sweets shared openly are a courtesy, not a bribe."],
          ["h", "Return the box and explain that clinics cannot accept anything", "The parents feel insulted on a festival day and become cold in sessions."],
          ["o", "Take the box home for yourself without telling the team", "No harm is visible, but a gift meant for the clinic is now personal."],
          ["o", "Accept it, then ask your supervisor whether you should give it back", "Asking is careful, but returning it later would hurt more. Small shared sweets are fine."],
        ],
      },
    ],
    concept: "Gifts in therapy",
    point: "Small, customary gifts shared openly are usually fine. Larger or personal gifts, or gifts that seem to ask for something, need careful thought and supervision.",
    errors: ["Refusing every gift and causing offence.", "Keeping a team gift for yourself.", "Accepting valuable personal gifts."],
  }),

  rich("wy-r047", {
    setting: "You are the hostel counsellor at a medical college in Manipal.",
    lines: ["Last night a roommate found Shreya, 20, a second-year student, with a dupatta tied round her neck.", "She took it off when the roommate came in.", "This morning she is calm and attending classes."],
    beats: [
      {
        says: "“It was nothing. I just wanted to see how it felt.”",
        hints: ["Think about what last night's act tells you about risk.", "Trying out a method, even 'out of curiosity', is a rehearsal and a strong warning sign.", "The best choice assesses her risk now and gets a psychiatric review today."],
        choices: [
          ["b", "Tell her you are glad she is safe, assess her risk now, and arrange a psychiatric review today", "She admits she has been planning for weeks. Rehearsal means high risk, and she gets help in time."],
          ["o", "Accept her explanation, advise rest and ask her to call you if she feels low", "Testing a ligature is a serious warning sign. Waiting for her to call misses it."],
          ["h", "Report her to the college for breaking hostel rules", "Disciplinary action punishes distress and raises the risk."],
          ["o", "Ask her roommate to keep an eye on her and tell you if anything happens", "A roommate cannot carry this risk. Assessment and a review are needed today."],
        ],
      },
    ],
    concept: "Rehearsal is a red flag",
    point: "Trying out a method, even briefly, is a sign of planning. Assess risk directly and arrange urgent review the same day.",
    errors: ["Accepting 'just curious'.", "Treating it as misconduct.", "Handing the risk to peers."],
  }),

  rich("wy-a052", {
    setting: "You are a psychology trainee in a paediatric OPD in Chennai.",
    lines: ["Mira, 8, has had stomach aches most mornings for two months. Her tests are normal.", "Her mother does most of the talking and looks tired.", "Mira sits holding a soft toy and watches you closely."],
    beats: [
      {
        says: "Her mother says, “She worries a lot. I don't know why.”",
        hints: ["Think about whose account you have, and whose you are missing.", "Children can tell you what frightens them if you use ways that suit their age.", "The best choice asks Mira herself, using drawing or simple words."],
        choices: [
          ["b", "Use drawing or simple words to ask Mira what worries her", "She draws her parents shouting. Children can tell you with the right tools."],
          ["h", "Ask only the mother, since young children cannot describe worries", "You hear the mother's worries but not Mira's."],
          ["o", "Give the mother an anxiety questionnaire to fill in at home", "Useful, but Mira's own voice matters too."],
          ["o", "Ask Mira in front of her mother, 'Why do you worry so much?'", "A direct 'why' in front of her mother is hard for a child to answer. Use play and simple words."],
        ],
      },
    ],
    concept: "Assessing children directly",
    point: "Children are the best source on their own fears. Use drawing, play and simple questions, and see them alone when it is safe.",
    errors: ["Talking only to the parent.", "Asking 'why' questions.", "Relying only on questionnaires."],
  }),

  rich("wy-t031", {
    setting: "You are a psychology trainee in an early psychosis team in Pune.",
    lines: ["Rohan, 19, was discharged a week ago after his first episode of psychosis.", "He has missed his first follow-up and is not answering calls.", "His mother says he stays in his room and calls the team 'the people who locked me up'."],
    beats: [
      {
        says: "His mother asks, “Should we just wait until he is ready to come?”",
        hints: ["Think about the first months after a first episode and what makes young people stay in care.", "Early, flexible care cuts relapse; waiting usually means losing him. Families are key.", "The best choice offers youth-friendly early intervention, flexibly, with his family."],
        choices: [
          ["b", "Offer flexible early intervention: a home visit or meeting where he chooses, with his family involved", "He agrees to meet at a cafe. Early, flexible care improves outcomes."],
          ["o", "Wait until he is ready to come on his own", "Months pass and he relapses before starting care. Delay worsens outcomes."],
          ["h", "Discharge him from the team for missing his appointment", "He relapses within months. Discharging a reluctant young person loses the chance to help."],
          ["o", "Send him a letter with a new appointment date", "A letter may be ignored. Personal, flexible contact works better."],
        ],
      },
    ],
    concept: "Early intervention in psychosis",
    point: "The first years after a first episode matter most. Keep young people in care with flexible, friendly contact and family involvement.",
    errors: ["Waiting for the young person to come back.", "Discharging after missed appointments.", "Relying on letters."],
  }),

  rich("wy-r050", {
    setting: "You are a psychology trainee in a memory clinic in Kochi.",
    lines: ["Mrs Menon, 84, has mild dementia. She takes a sleeping tablet every night.", "She gets up several times a night and walks about the house.", "Last month she fell in the bathroom but was not hurt."],
    beats: [
      {
        says: "Her son asks, “Can the doctor give her a stronger sleeping pill?”",
        hints: ["Think about the risks of sedatives in older people, and why she might be up at night.", "Stronger sedation raises falls and confusion. There is often a simple reason for night waking.", "The best choice finds out why she is up at night before any medicine change."],
        choices: [
          ["b", "Ask what wakes her and where she goes at night", "She wakes to pass urine. A bedside commode and a night light solve most of it."],
          ["o", "Suggest a slightly higher dose of her current tablet", "More sedation raises falls and hip fractures in older people."],
          ["h", "Suggest tying her to the bed at night so she does not fall", "Restraint at home is dangerous and can be abuse."],
          ["o", "Suggest she sleeps in the same room as her son so he can watch her", "It may help, but you still do not know why she wakes. Ask first."],
        ],
      },
    ],
    concept: "Sedatives and falls in older adults",
    point: "In older people, more sedation means more falls and confusion. Look for the reason behind night waking and make the home safer.",
    errors: ["Increasing sedatives.", "Using restraint.", "Not asking why she wakes."],
  }),

  rich("wy-a039", {
    setting: "You are a psychology trainee in a college clinic in Delhi.",
    lines: ["Ishita, 21, is in her final year of BCom, with exams in a month.", "She is frightened that she has 'early Alzheimer's' after reading online.", "She is alert and gives a clear, detailed history."],
    beats: [
      {
        says: "“I forget everything I read. I think something is wrong with my brain.”",
        hints: ["Think about the common causes of poor memory in a young adult.", "Sleep loss, low mood, anxiety and attention problems are far commoner than brain disease at 21.", "The best choice asks about sleep, mood, anxiety, attention, substances and how she studies."],
        choices: [
          ["b", "Ask about her sleep, mood, worry, attention, any substances, and how she studies", "She sleeps four hours and is very anxious. Concentration, not memory, is the problem."],
          ["h", "Suggest she gets an MRI scan to be sure", "The scan is normal and costly, and the common causes were never asked about."],
          ["o", "Tell her it is just exam stress and give her a study timetable", "Possibly, but you have not ruled out depression or other causes."],
          ["o", "Give her a memory test and reassure her if she passes", "A normal test may reassure, but it does not find the cause of her problem."],
        ],
      },
    ],
    concept: "Memory complaints in the young",
    point: "In young adults, 'memory loss' is usually poor concentration from sleep loss, anxiety, low mood or substances. Ask before testing.",
    errors: ["Jumping to scans.", "Dismissing it as stress without asking.", "Testing without a history."],
  }),

  rich("wy-t006", {
    setting: "You are a psychology trainee in a hospital trauma service in Mumbai.",
    lines: ["Priya, 30, was assaulted on her way home eight months ago.", "She has nightmares, avoids the street, and jumps at sudden sounds.", "She has been assessed and is safe now."],
    beats: [
      {
        says: "“What kind of therapy would help me most?”",
        hints: ["Think about what the evidence says for PTSD.", "Trauma-focused therapies work best for PTSD, paced so she feels in control.", "The best choice explains trauma-focused CBT or EMDR and agrees the pace with her."],
        choices: [
          ["b", "Explain that trauma-focused CBT or EMDR has the best evidence, and agree the pace with her", "She starts and the nightmares ease. First-line PTSD treatments are trauma-focused."],
          ["o", "Offer supportive counselling for as long as she wants, without focusing on the trauma", "Supportive, but less effective for PTSD."],
          ["h", "Tell her to try to forget it and move on", "She pushes the memories away and the nightmares continue. Avoidance keeps PTSD going."],
          ["o", "Suggest she starts with medicine and thinks about therapy later", "Medicine can help some symptoms, but trauma-focused therapy is the first-line treatment."],
        ],
      },
    ],
    concept: "First-line PTSD treatment",
    point: "Trauma-focused CBT and EMDR have the strongest evidence for PTSD. Explain them clearly and pace the work with the person.",
    errors: ["Offering only general support.", "Encouraging avoidance.", "Delaying therapy for medicine alone."],
  }),

  rich("wy-c026", {
    setting: "You are a psychology trainee in a counselling session at a women's support centre.",
    lines: ["Sneha, 30, is talking about her childhood for the first time.", "She suddenly stops, stares at the corner and starts breathing fast.", "Her hands are gripping the chair."],
    beats: [
      {
        says: "She whispers, “He's here.”",
        hints: ["Think about what is happening to her right now: is she in the room or in the memory?", "In a flashback, the aim is to bring her back to the present, not to explore the memory.", "The best choice grounds her calmly in the here and now."],
        choices: [
          ["b", "Say her name calmly, remind her where she is and that she is safe, and ask her to feel her feet on the floor", "Her breathing slows and she comes back to the room. Grounding ends the flashback."],
          ["o", "Ask her to describe exactly what she is seeing so you understand the memory", "She sinks deeper into the memory and becomes more distressed."],
          ["h", "Leave the room to get help", "She is left alone in distress."],
          ["o", "Hold her hands firmly to calm her", "Touch without asking can feel like the trauma itself. Ask first, and use words and the senses."],
        ],
      },
    ],
    concept: "Grounding in a flashback",
    point: "In a flashback, bring the person back to the present using calm words, their name, and their senses. Explore the memory later, when they are ready.",
    errors: ["Asking for details during the flashback.", "Leaving the person alone.", "Touching without permission."],
  }),

  rich("wy-c006", {
    setting: "You are the counsellor at an engineering college in Hyderabad.",
    lines: ["Yesterday a third-year student died by suicide in the hostel.", "Rumours and photos are spreading on WhatsApp.", "The principal has called you to plan what to do today."],
    beats: [
      {
        says: "The principal says, “I want a big assembly explaining exactly what happened, so students learn.”",
        hints: ["Think about how talking about suicide can protect or harm other students.", "Details of the method raise the risk of copycat suicides. Silence feeds rumours. Safe messaging sits between.", "The best choice is a brief, careful message without method details, plus support for those most affected."],
        choices: [
          ["b", "Suggest a short message without method details, where to get help, and quiet support for close friends", "Close friends are screened and supported. Safe messaging lowers the risk of copycat suicides."],
          ["h", "Agree, and describe how he died so students understand the danger", "Method details raise the risk of contagion."],
          ["o", "Suggest saying nothing so students forget quickly", "Silence leaves students alone with rumours and grief."],
          ["o", "Suggest cancelling classes for a week so everyone can grieve", "Some time is fine, but a long break loses routine and support. Targeted support works better."],
        ],
      },
    ],
    concept: "Safe messaging after a suicide",
    point: "After a suicide, share brief facts without method details, say where help is, and actively support those closest. This lowers the risk of further suicides.",
    errors: ["Describing the method.", "Saying nothing.", "Not identifying vulnerable students."],
  }),

  rich("wy-e055", {
    setting: "You are a psychology trainee on a general hospital ward, helping the psychiatry team.",
    lines: ["Ananya, 21, was admitted three days ago with sudden odd behaviour, fear and hearing voices.", "Yesterday she had a seizure.", "Today she has strange chewing movements of her mouth and is much less responsive."],
    beats: [
      {
        says: "The junior doctor says, “Looks like first-episode psychosis. Shall we move her to the psychiatry ward?”",
        hints: ["Think about whether this is purely psychiatric.", "New psychosis with a seizure, odd movements and falling responsiveness suggests brain inflammation, which can be treated.", "The best choice asks for urgent neurology review with spinal fluid and EEG tests."],
        choices: [
          ["b", "Say the seizure and movements suggest a brain cause, and ask for urgent neurology review and tests", "She has anti-NMDA receptor encephalitis and recovers with treatment."],
          ["h", "Agree to treat it as psychosis with an antipsychotic on the psychiatry ward", "Antipsychotics may make her worse, and the cause is missed."],
          ["h", "Suggest she might be faking for attention", "She worsens over days. Calling it fake delays treatment of a curable illness."],
          ["o", "Suggest waiting a day to see whether the movements settle", "Waiting loses time. A seizure with new psychosis needs neurology now."],
        ],
      },
    ],
    concept: "Autoimmune encephalitis",
    point: "New psychosis with seizures, abnormal movements or falling consciousness may be autoimmune encephalitis. Urgent neurology review saves lives.",
    errors: ["Labelling it psychosis too early.", "Giving antipsychotics before a brain cause is ruled out.", "Calling it faking."],
  }),

  rich("wy-g047", {
    setting: "You are a counselling psychologist in private practice in Gurugram.",
    lines: ["Neha, 29, has seen you for depression for three months and is planning to return to work.", "She has not signed any consent to share information with her employer.", "The HR manager of her company calls the clinic number."],
    beats: [
      {
        says: "“Is she fit to come back? What exactly is wrong with her?”",
        hints: ["Think about who owns the information, and what you can say without consent.", "Even confirming she is your client is a disclosure. Without her written consent, you can share nothing.", "The best choice says you cannot confirm or share anything without her written consent."],
        choices: [
          ["b", "Say politely that you cannot confirm or share anything without the client's written consent", "HR asks Neha, and she decides what her workplace learns."],
          ["o", "Say she is doing well and leave it there", "You have confirmed she is your client. Even good news is disclosure."],
          ["h", "Tell him she has depression so that he can support her return", "Her diagnosis is now known at work. This is a clear breach."],
          ["o", "Say you will call back after checking your notes", "Calling back still implies she is a client. The answer is the same: written consent first."],
        ],
      },
    ],
    concept: "Confidentiality with employers",
    point: "Without written consent, do not confirm or share anything with an employer, not even that the person is your client.",
    errors: ["Sharing 'good news'.", "Revealing the diagnosis to help.", "Implying the person is a client."],
  }),
];
