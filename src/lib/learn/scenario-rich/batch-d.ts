import type { Scenario } from "../scenarios";
import { rich } from "./make";

/** Rich cases, batch D. */
export const RICH_D: Scenario[] = [
  rich("wy-l051", {
    setting: "You are a psychology trainee with the palliative care team at a cancer hospital in Mumbai.",
    lines: ["Mr Kulkarni, 68, has advanced lung cancer that has spread to his bones.", "He grimaces when he moves and has hardly slept for three nights.", "His family visits every day."],
    beats: [
      {
        says: "“I want this to end.”",
        hints: ["Think about what 'I want this to end' can mean at the end of life.", "It may mean uncontrolled pain, depression, fear or a wish for death. Each needs a different response, so ask.", "The best choice assesses whether it is pain, depression or existential distress, and supports him."],
        choices: [
          ["b", "Ask gently what he means, and assess pain, mood and his fears, with the palliative team", "His pain is uncontrolled. Once it is treated he sleeps and his wish to die eases."],
          ["h", "Assume he is suicidal and arrange psychiatric admission", "He is moved against his wishes when pain relief was what he needed."],
          ["o", "Assume such feelings are normal at the end of life and move on", "His uncontrolled pain and possible depression are missed."],
          ["o", "Tell his family so they can stay with him at night", "Family support helps, but first find out what he means and what he needs."],
        ],
      },
    ],
    concept: "Wish to die in palliative care",
    point: "A wish for death in serious illness often comes from pain, depression or fear, which can be treated. Ask, assess and work with the palliative team.",
    errors: ["Assuming suicide risk and admitting.", "Calling it normal and moving on.", "Not asking about pain."],
  }),

  rich("wy-l050", {
    setting: "You are a psychology trainee on an inpatient unit in Bengaluru.",
    lines: ["Mr Iyer, 52, has severe depression and has stopped eating. He cannot make treatment decisions now.", "Two years ago, when well, he registered an advance directive saying he does not want ECT.", "The team and his family think ECT would work fastest."],
    beats: [
      {
        says: "The registrar says, “His family agrees. Let's book ECT for Monday.”",
        hints: ["Think about what the law says about a valid advance directive.", "The team must follow a valid directive. If they want to set it aside, the route is an application to the Mental Health Review Board.", "The best choice reminds the team of the directive and the Board process."],
        choices: [
          ["b", "Remind the team of his directive, and that setting it aside needs an application to the Mental Health Review Board", "The team treats him with other options and applies to the Board. They follow the law."],
          ["o", "Support ECT, since the family agrees and he is too unwell to decide", "Family agreement does not override a valid directive."],
          ["h", "Ignore the directive, since it was made two years ago", "His legal rights are breached. A directive stays valid until he changes it."],
          ["o", "Say nothing, since medical decisions are for the doctors", "The decision is medical, but you can and should flag a legal safeguard the team has missed."],
        ],
      },
    ],
    concept: "Advance directives under the MHCA 2017",
    point: "A valid advance directive must be followed (section 10). Anyone who wants to set it aside applies to the Mental Health Review Board (section 11).",
    errors: ["Letting family override the directive.", "Treating an old directive as expired.", "Staying silent about a legal safeguard."],
  }),

  rich("wy-g027", {
    setting: "You are a clinical psychologist offering weekly therapy in a hospital OPD in Pune.",
    lines: ["Shreya, 27, has borderline personality disorder. This is her twentieth session.", "Her mother left the family when she was nine.", "Today she has been crying since she arrived."],
    beats: [
      {
        says: "“If you won't hold my hand, I'll know you don't care.”",
        hints: ["Think about the boundary and the feeling behind the request.", "You can hold the boundary and show warmth at the same time. The feeling behind the test is the work.", "The best choice says you care, that holding hands is not part of therapy, and explores the feeling."],
        choices: [
          ["b", "Say that you do care, that holding hands is not part of therapy, and ask about the feeling", "She is angry, then talks about feeling dropped by her mother. The boundary and the warmth both hold."],
          ["o", "Hold her hand briefly this once, to show you care", "She asks for more next time. Giving in to a test teaches that pressure works."],
          ["h", "Tell her she is trying to manipulate you", "She feels attacked and storms out."],
          ["o", "Change the subject to her coping skills", "Skills matter, but moving away now feels like the rejection she fears."],
        ],
      },
      {
        says: "“Then I'll find a therapist who really cares.”",
        context: "She is standing near the door.",
        hints: ["Think about how her old pattern of being left might repeat here.", "Steady warmth through anger, with the same limits, is part of the treatment.", "The best choice stays calm, says you want to keep working, and invites her back."],
        choices: [
          ["b", "Stay calm, say you want to keep working with her, and that you will see her next week", "She returns next week. Steady warmth through anger helps her trust."],
          ["h", "Agree that she should go elsewhere if she feels that way", "She hears that she is too much. It repeats her old pattern."],
          ["o", "Offer her an extra session later this week to calm things down", "It soothes for now but teaches that anger earns extras."],
          ["o", "Follow her to the door and keep talking until she agrees to stay", "Chasing her makes the scene bigger. A calm invitation is enough."],
        ],
      },
    ],
    concept: "Boundaries with warmth",
    point: "In borderline personality disorder, steady limits held with warmth are part of the therapy. Explore the feeling behind a test rather than giving in or rejecting.",
    errors: ["Giving in to the test.", "Labelling the client manipulative.", "Rewarding anger with extras."],
  }),

  rich("wy-e052", {
    setting: "You are a psychology trainee called to the emergency department of a city hospital.",
    lines: ["Tanvi, 25, came in at 1 am with chest pain and breathlessness, sure she was dying.", "Her ECG, blood tests and oxygen are normal.", "She is still shaking and crying."],
    beats: [
      {
        says: "The doctor says, “Nothing wrong with her heart. Can you talk to her?”",
        hints: ["Think about what she needs to understand before she leaves.", "She has had a panic attack. Without an explanation and a plan, she will come back frightened.", "The best choice explains panic, coaches slow breathing, and arranges follow-up."],
        choices: [
          ["b", "Explain what a panic attack is and why it felt so real, coach slow breathing, and arrange follow-up", "She calms, understands what happened, and agrees to therapy."],
          ["o", "Tell her the tests were normal, so she can go home and rest", "True, but she leaves frightened and will return."],
          ["h", "Tell her she is wasting the doctors' time", "She has another attack in the car park. Shame makes panic worse."],
          ["o", "Suggest the doctor gives her a sedative injection to calm her down", "It may calm her tonight, but she learns nothing about panic and may rely on it."],
        ],
      },
    ],
    concept: "Panic attack in the emergency room",
    point: "After medical causes are ruled out, explain panic clearly, teach a simple skill, and link to treatment, so the person does not keep returning frightened.",
    errors: ["Discharging with 'nothing wrong'.", "Shaming the patient.", "Relying on sedatives."],
  }),

  rich("wy-t061", {
    setting: "You are a psychology trainee in a community mental health clinic in Kochi.",
    lines: ["Mr Thomas, 45, a bank cashier, has had low mood for a year.", "He drinks four or five large pegs of brandy most nights 'to sleep'.", "His doctor has started an antidepressant."],
    beats: [
      {
        says: "“Help me with my mood. The drinking is not the problem.”",
        hints: ["Think about how alcohol and depression feed each other.", "Heavy drinking worsens mood and sleep; refusing to treat until he stops loses him. Treat both together.", "The best choice treats both, using motivational work for the alcohol."],
        choices: [
          ["b", "Treat his mood and work on the drinking together, starting with what he wants from life", "He cuts down and his mood improves."],
          ["h", "Treat only his mood, as he asks", "His mood improves a little, then the drinking pulls it down again."],
          ["o", "Refuse to treat his mood until he has been sober for three months", "He stops coming and keeps drinking."],
          ["o", "Tell him firmly that he is an alcoholic and must stop now", "A label and an order often bring resistance. His own reasons work better."],
        ],
      },
      {
        says: "“I've cut down, but I still drink at weekends.”",
        context: "His mood is a little better.",
        hints: ["Think about how to keep change going.", "Partial change is progress; shame and stopping treatment both throw it away.", "The best choice praises progress, explores weekend triggers and continues both treatments."],
        choices: [
          ["b", "Praise the progress, explore what happens at weekends, and continue both treatments", "He cuts down further and his mood keeps improving."],
          ["h", "Tell him he has failed", "He feels ashamed and drinks more that weekend."],
          ["o", "Stop treatment because he has not stopped completely as agreed", "He loses the progress he made."],
          ["o", "Ask his wife to keep all alcohol out of the house", "It may help, but plans work best when he chooses them."],
        ],
      },
    ],
    concept: "Treating depression with alcohol use",
    point: "Treat depression and heavy drinking together, using motivational work. Value partial change and build on it.",
    errors: ["Treating only one problem.", "Making sobriety a condition for help.", "Shaming partial progress."],
  }),

  rich("wy-e051", {
    setting: "You are a psychology trainee taking a call at a community mental health clinic.",
    lines: ["A mother calls in a panic. Her daughter, 2, was found with an open strip of her grandmother's lithium tablets.", "Several tablets are missing. The child seems fine and is playing.", "They live 20 minutes from the district hospital."],
    beats: [
      {
        says: "“She seems all right. Should I just watch her?”",
        hints: ["Think about how dangerous lithium is for a small child, and when symptoms show.", "Lithium poisoning in a toddler can be serious and symptoms may appear hours later.", "The best choice goes to emergency care at once, with the tablet strip."],
        choices: [
          ["b", "Take her to the emergency department now, with the tablet strip", "The child is monitored and kept safe. Lithium is dangerous for children."],
          ["h", "Wait and see if she gets sick", "Hours later she starts vomiting and shaking."],
          ["o", "Make her vomit at home and watch her for the day", "Making a child vomit is not safe and may not remove the tablets."],
          ["o", "Call the grandmother's psychiatrist and ask what to do", "Advice may help, but the child needs emergency care now; call on the way."],
        ],
      },
    ],
    concept: "Accidental poisoning in children",
    point: "Any possible swallowing of lithium or other psychiatric medicine by a child needs emergency care at once, even if the child looks well. Bring the strip.",
    errors: ["Waiting for symptoms.", "Making the child vomit.", "Delaying for phone advice."],
  }),

  rich("wy-r031", {
    setting: "You are a psychology trainee in a college counselling centre in Jaipur.",
    lines: ["Rahul, 23, came in because his roommate insisted.", "His girlfriend of four years ended the relationship last week.", "He has not eaten properly or attended classes since."],
    beats: [
      {
        says: "“She left me. Without her there's nothing.”",
        hints: ["Think about safety first.", "'There's nothing' after a breakup can mean thoughts of suicide. Breakups are a common trigger in young men.", "The best choice asks him directly about thoughts of ending his life."],
        choices: [
          ["b", "“When you say there's nothing, have you had thoughts of ending your life?”", "He admits he has been looking at the railway tracks. Direct questions save lives."],
          ["h", "“There are lots of fish in the sea.”", "He feels mocked and shuts down."],
          ["o", "“Let's look at what went wrong in the relationship.”", "Useful later, but the first job is to check his safety."],
          ["o", "“Have you told your parents how you feel?”", "Support matters, but you still do not know if he is safe."],
        ],
      },
    ],
    concept: "Asking about suicide after a loss",
    point: "After a breakup or loss, phrases like 'there's nothing' need a direct question about suicide. Asking does not plant the idea.",
    errors: ["Minimising the loss.", "Jumping to problem-solving.", "Not asking directly."],
  }),

  rich("wy-e056", {
    setting: "You are a psychology trainee on an acute psychiatry ward on the evening shift.",
    lines: ["Vinay, 25, was admitted yesterday with severe depression.", "During the 9 pm check, a nurse finds him in the bathroom with a phone charger cord round his neck.", "He is breathing, alert and crying."],
    beats: [
      {
        says: "The nurse says, “He's fine now. I'll write it up.”",
        hints: ["Think about what an attempt on the ward means for his care tonight.", "An attempt on the ward means the plan must change now: injuries checked, observation raised, ligature risks removed.", "The best choice removes the cord, checks for injury, increases observation and reviews the plan."],
        choices: [
          ["b", "Remove the cord, get a doctor to check for injury, increase observation and ask for an urgent plan review", "He is kept safe that night, and the team removes other ligature points."],
          ["h", "Note it in his file and continue hourly checks", "He tries again that night. The plan must change at once."],
          ["h", "Move him to a locked room alone", "Alone and distressed, he hurts himself again."],
          ["o", "Ask his family to come and sit with him tonight", "Family can comfort him, but observation and the plan are the team's job, now."],
        ],
      },
    ],
    concept: "Attempt on an inpatient ward",
    point: "A suicide attempt on a ward needs an immediate response: physical check, closer observation, removing means, and a same-day review of the care plan.",
    errors: ["Writing it up without changing the plan.", "Isolating the patient.", "Handing observation to family."],
  }),

  rich("wy-a032", {
    setting: "You are a psychology trainee in a psychiatry OPD in Patna, asked to help with a violence risk assessment.",
    lines: ["Monu, 26, was brought by his brother after threatening a neighbour over a parking spot.", "In the room he is polite and calm.", "His brother looks nervous and says little."],
    beats: [
      {
        says: "“It was nothing. I just lost my temper for a minute.”",
        hints: ["Think about what best predicts future violence.", "Past violence is the strongest predictor, along with weapons, alcohol and current threats. Calm in the room tells you little.", "The best choice asks about past fights, arrests, weapons, alcohol and current threats."],
        choices: [
          ["b", "Ask about past fights, arrests, weapons, alcohol and drugs, and any current threats, and speak with his brother", "He has a knife conviction and drinks heavily. The risk is higher than it looked."],
          ["o", "Ask only about his current anger and how often he feels it", "Current anger matters, but past violence is the strongest predictor."],
          ["h", "Decide there is no risk because he is polite with you", "Politeness in the room does not show the risk outside."],
          ["o", "Ask him to fill in an anger questionnaire", "A scale can help, but it misses history, weapons and alcohol."],
        ],
      },
    ],
    concept: "Violence risk assessment",
    point: "Ask about past violence, weapons, substances, current threats and targets, and get collateral. How someone behaves in the room is a poor guide.",
    errors: ["Judging by calm behaviour.", "Asking only about current feelings.", "Skipping collateral."],
  }),

  rich("wy-f057", {
    setting: "You are a psychology trainee in a relief camp after floods in Assam.",
    lines: ["Moni, 7, and her family lost their house in the floods two weeks ago.", "She now has nightmares, wets the bed, and will not let go of her mother.", "The camp has a school tent that opened yesterday."],
    beats: [
      {
        says: "Her mother asks, “Should I stop her talking about the flood, so she forgets?”",
        hints: ["Think about how young children recover after a disaster.", "Routine, safety and space to play and talk help most. Silencing or 'be brave' messages make fear go underground.", "The best choice keeps routines and lets her play and talk."],
        choices: [
          ["b", "Keep daily routines as far as possible, reassure her she is safe, and let her play and talk about it", "Her nightmares fade over the coming weeks."],
          ["o", "Tell her mother to stop her talking about the flood", "She bottles her fear and the nightmares grow."],
          ["h", "Tell Moni to be brave and stop crying", "She hides her fear and becomes withdrawn."],
          ["o", "Ask her to tell the whole story of the flood to you in detail today", "Forcing a full account can overwhelm her. Let her lead, through play."],
        ],
      },
    ],
    concept: "Children after disasters",
    point: "Most children recover with safety, routine, caring adults and space to play and talk. Watch for those who do not improve and refer them.",
    errors: ["Silencing the child.", "'Be brave' messages.", "Forcing detailed retelling."],
  }),

  rich("wy-r037", {
    setting: "You are a psychology trainee in a psychiatry OPD in Hyderabad.",
    lines: ["Mr Rao, 44, ran a small business that collapsed last month. He owes lenders ₹40 lakh.", "His wife and two children, aged 9 and 12, live with him.", "He has not slept for days and speaks in a flat voice."],
    beats: [
      {
        says: "“I can't leave my wife and kids to face the shame. We'll all go together.”",
        hints: ["Think about who is at risk, and how soon.", "'We'll all go together' points to a plan that includes others. This is an emergency.", "The best choice asks what he has planned and acts at once."],
        choices: [
          ["b", "Ask what he has planned and when, tell your supervisor now, and arrange immediate safety for him and his family", "He has bought poison for everyone. Police and family are involved and he is admitted."],
          ["h", "“That's just despair talking. You'd never hurt your family.”", "Despair can lead to family murder-suicide. Dismissing it leaves the family in danger."],
          ["o", "Suggest he sees a financial counsellor this week", "Debt help matters later. Right now there is a stated plan involving others."],
          ["o", "Ask him to promise to come back tomorrow", "A promise does not protect his wife and children tonight."],
        ],
      },
      {
        says: "His wife comes the next day and asks whether he can come home.",
        context: "He is calmer after a night in hospital.",
        hints: ["Think about what the family needs to know to stay safe.", "With a direct risk to her and the children, she must be part of the safety plan, even without his full consent.", "The best choice explains the risk and the plan, and involves her."],
        choices: [
          ["b", "Explain the risk and the plan, and involve her in planning safety at home", "She understands and helps plan safety. Families need to be part of the plan."],
          ["h", "Say you cannot share anything without his consent", "With a direct risk to her and the children, she needs enough to stay safe."],
          ["h", "Say he is fine now and can go home", "One night does not change the risk. Early discharge would put the family in danger."],
          ["o", "Tell her everything he said in the session, word for word", "She needs what keeps her safe, not every detail of his therapy."],
        ],
      },
    ],
    concept: "Extended suicide (homicide-suicide) risk",
    point: "When a person talks of taking family members with them, act at once: ask about the plan, involve your supervisor, and protect everyone at risk. Share what the family needs to stay safe.",
    errors: ["Dismissing it as despair.", "Treating debt first.", "Hiding behind confidentiality when others are at risk."],
  }),

  rich("wy-c029", {
    setting: "You are a psychology student scrolling social media late at night.",
    lines: ["A stranger is live-streaming from a rooftop and saying goodbye.", "You recognise a well-known temple and a hoarding in the background.", "Some viewers are posting laughing emojis."],
    beats: [
      {
        says: "The person says, “This is my last video.”",
        hints: ["Think about what could get help to this person fastest.", "Comments may never be seen. The platform and local police can act on a location.", "The best choice reports the video to the platform and calls the police with the location details."],
        choices: [
          ["b", "Report the video to the platform as a suicide risk and call 112 with the location details you can see", "Police reach the person in time."],
          ["h", "Comment that they are just seeking attention", "The person sees it and the stream ends suddenly."],
          ["o", "Comment telling them to call a helpline", "Kind, but they may not see it, and direct action is faster."],
          ["o", "Share the video so more people see it and help", "Sharing spreads a painful moment and can encourage others; report it instead."],
        ],
      },
    ],
    concept: "Responding to online suicide threats",
    point: "Report live suicide threats to the platform and contact emergency services (112) with any location details. Do not share or mock.",
    errors: ["Mocking comments.", "Relying on comments alone.", "Sharing the video."],
  }),

  rich("wy-r001", {
    setting: "You are a psychology trainee in a student counselling centre in Kota.",
    lines: ["Aarav, 19, is preparing for engineering entrance exams for the second year.", "His father took a loan to pay for coaching.", "His marks in mock tests have fallen and he has stopped going to class."],
    beats: [
      {
        says: "“I just feel like a burden on my parents. They spent so much on my coaching.”",
        hints: ["Think about what 'I feel like a burden' can signal.", "Feeling like a burden is a known warning sign of suicide. Asking plainly does not plant the idea.", "The best choice asks him directly whether he thinks about ending his life."],
        choices: [
          ["b", "“When you feel like a burden, do you ever think about ending your life?”", "He says yes, at night. Now you know the risk and can act."],
          ["h", "“Your parents love you. I'm sure they don't see you as a burden.”", "He nods and goes quiet. Kind, but you never found out whether he is thinking of suicide."],
          ["h", "“Let's talk about your study plan for the next attempt.”", "He follows your lead, and the warning sign is missed."],
          ["o", "“How long have you been feeling this way?”", "A useful question, but the most important one still needs asking."],
        ],
      },
    ],
    concept: "Asking about suicide plainly",
    point: "Phrases like 'I'm a burden' are warning signs. Ask directly about suicide in plain words. It opens the door rather than planting the idea.",
    errors: ["Reassuring instead of asking.", "Moving to study plans.", "Asking indirectly."],
  }),

  rich("wy-r002", {
    setting: "You are a psychology trainee in a hospital psychiatry OPD in Indore.",
    lines: ["Meena, 34, a school teacher, has had depression for six months.", "She lives with her elderly mother, who takes sleeping tablets.", "Your supervisor is in the next room."],
    beats: [
      {
        says: "“Yes, I've thought about dying. Most nights.”",
        hints: ["Think about what decides how urgent this is.", "After thoughts of death, the next questions are about a plan and access to means.", "The best choice asks how she has thought of doing it and whether she has the means."],
        choices: [
          ["b", "“Have you thought about how you would do it, and do you have what you would need?”", "She mentions her mother's sleeping tablets. You can now make a safety plan and tell your supervisor."],
          ["h", "“Thank you for telling me. Let's talk more at next week's session.”", "A week passes with no idea of her plan or means."],
          ["o", "“How long have you felt this way, and has anything made it worse?”", "Useful history, but you still do not know about plan or means."],
          ["o", "“Do you promise to call me if it gets worse?”", "A promise is not a safety plan. Ask about plan and means first."],
        ],
      },
    ],
    concept: "From suicidal thoughts to plan and means",
    point: "After suicidal thoughts, ask about a plan, access to means, intent and timing. These change the urgency and the safety plan.",
    errors: ["Delaying to next session.", "Taking only background history.", "Relying on promises."],
  }),

  rich("wy-r009", {
    setting: "You are a psychology trainee in a hospital counselling service in Gurugram.",
    lines: ["Deepak, 30, lost his job last week and blames his manager.", "Earlier in this session he said he knows where the manager lives.", "He has now said more."],
    beats: [
      {
        says: "“I've got an iron rod in the car. I'm going there tonight. Don't tell anyone.”",
        hints: ["Think about the limits of confidentiality when someone else is in danger.", "A clear plan, a weapon and a named person tonight is serious, imminent risk. Confidentiality has limits here.", "The best choice explains the limits of confidentiality and consults your supervisor now."],
        choices: [
          ["b", "Explain the limits of confidentiality and consult your supervisor now, before he leaves", "Your supervisor arranges a psychiatric assessment and the needed warning. Only what is needed to prevent harm is shared."],
          ["h", "Respect his refusal, since he has not acted yet", "If he acts, you knew. Clear danger to a named person is a limit of confidentiality."],
          ["h", "Say you will come back to it next week if he still feels this way", "Waiting a week with a plan and a weapon is far too long."],
          ["o", "Try to talk him out of it yourself and let him leave if he agrees", "His agreement in the room does not remove a plan with a weapon. Get your supervisor now."],
        ],
      },
    ],
    concept: "Duty to protect",
    point: "When a client has a clear plan to harm a named person soon, confidentiality has limits. Explain this, consult a supervisor at once, and share only what is needed to prevent harm.",
    errors: ["Keeping the secret.", "Waiting until the next session.", "Handling it alone."],
  }),
];
