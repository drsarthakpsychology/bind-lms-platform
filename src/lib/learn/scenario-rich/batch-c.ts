import type { Scenario } from "../scenarios";
import { rich } from "./make";

/** Rich cases, batch C. */
export const RICH_C: Scenario[] = [
  rich("wy-c034", {
    setting: "You are the staff counsellor at a medical college hospital in Nagpur.",
    lines: ["Dr Pallavi, 26, a junior resident, was on duty when a young patient died of a sudden bleed two nights ago.", "She has not slept since and keeps replaying the night.", "Her seniors told her, 'It happens. Move on.'"],
    beats: [
      {
        says: "“It's my fault. I should have seen it. I don't deserve to be a doctor.”",
        hints: ["Think about her as a person in distress first, not as a doctor.", "Self-blame, no sleep and 'I don't deserve' after a death can carry risk. Listening and asking matter more than quick reassurance.", "The best choice listens, asks about risk, and links her with peer support."],
        choices: [
          ["b", "Listen, ask gently whether she has had thoughts of harming herself, and offer peer and counselling support", "She feels heard, admits dark thoughts, and gets support in time. Doctors after a patient death are at real risk."],
          ["h", "Tell her doctors must be tough and that this is part of the job", "She hides her distress and later burns out. Telling doctors to be tough silences distress."],
          ["o", "Tell her straight away it was not her fault, so she feels better today", "Kind, but you have not heard her or checked her risk, and a quick answer may not ring true to her."],
          ["o", "Suggest she take a week's leave to rest", "Rest may help, but alone at home with these thoughts she needs support and a risk check first."],
        ],
      },
    ],
    concept: "Second victim support",
    point: "Clinicians involved in a patient death often feel intense guilt and can be at risk. Listen, ask about risk, and offer peer support.",
    errors: ["'Be tough' culture.", "Quick reassurance without listening.", "Sending them away alone."],
  }),

  rich("wy-e049", {
    setting: "You are a psychology trainee at the front desk of a busy psychiatry OPD in Kolkata.",
    lines: ["Biswajit, 35, has waited two hours to see the psychiatrist. There are 20 people ahead of him.", "He is pacing and his eyes are red.", "His file says he took an overdose last year."],
    beats: [
      {
        says: "“If I have to wait any longer, I'll go home and finish it.”",
        hints: ["Think about how serious this is and how soon something could happen.", "A stated intent to die, with a past overdose, is high risk. A waiting room is not a safe place for him.", "The best choice stays with him and gets him seen now."],
        choices: [
          ["b", "Stay with him or ask a colleague to, and tell the psychiatrist he needs to be seen now", "He is seen at once. Waiting rooms are not safe for high-risk patients."],
          ["h", "Ask him to be patient, since the doctor sees people in turn", "He leaves and may harm himself."],
          ["h", "Tell him that threats will not get him seen any faster", "He walks out. Treating a stated intent to die as manipulation dismisses real risk."],
          ["o", "Give him a crisis helpline number and ask him to call if it gets worse", "A number is not enough when he is saying this now, in front of you."],
        ],
      },
    ],
    concept: "Triage of suicide risk",
    point: "A person who says they will end their life now must not be left to wait. Stay with them and get them seen urgently.",
    errors: ["Making them wait their turn.", "Calling it manipulation.", "Offering only a phone number."],
  }),

  rich("wy-c036", {
    setting: "You are a psychology trainee on the night line of a postnatal support service.",
    lines: ["It is 3 am. A mother, Pooja, 24, calls. Her baby is six weeks old.", "You can hear the baby screaming in the background.", "She says her husband is asleep in the next room."],
    beats: [
      {
        says: "“The baby won't stop crying. I'm going to throw him.”",
        hints: ["Think about whose safety comes first in the next minute.", "The baby is in danger right now. The first step is to separate mother and baby safely, then help her.", "The best choice asks her to put the baby down safely and step away."],
        choices: [
          ["b", "Ask her calmly to put the baby down in the cot and step out of the room while you stay on the line", "The baby is safe. She cries with relief, and you then wake her husband and arrange help."],
          ["h", "Tell her to try harder to calm him", "She is still holding a baby she has said she might throw. The baby is at risk."],
          ["o", "Tell her to give the baby to her husband and go to sleep, and call you tomorrow", "Better, but first make the baby safe and check how she is; she may need help tonight."],
          ["o", "Ask her to describe exactly why the baby is crying", "Gathering detail now keeps the baby in danger. Safety first."],
        ],
      },
    ],
    concept: "Immediate safety of an infant",
    point: "When a parent says they may harm a baby, first make the baby safe (put down, step away), then support the parent and arrange help.",
    errors: ["Telling the parent to cope.", "Delaying with questions.", "Ending the call without a plan."],
  }),

  rich("wy-e057", {
    setting: "You are a psychology trainee in a memory clinic in Ahmedabad during a May heatwave.",
    lines: ["Mrs Patel, 85, has Alzheimer's disease and lives with her daughter.", "Over three days she has become much more confused and sleepy.", "She has drunk very little and her mouth looks dry."],
    beats: [
      {
        says: "Her daughter asks, “Is her dementia getting worse? Should the doctor raise her tablets?”",
        hints: ["Think about sudden change in an older person and what the heat might do.", "Fast worsening over days is not how dementia usually changes; dehydration is a common, treatable cause.", "The best choice gets a medical review for fluids and blood tests."],
        choices: [
          ["b", "Explain that sudden change is usually from a body cause, and arrange a medical review for fluids and blood tests today", "She is dehydrated with kidney strain, and improves with fluids."],
          ["h", "Suggest raising her dementia medicine", "She stays confused and her kidneys worsen. The new confusion came from the heat."],
          ["h", "Say it is probably just her dementia progressing", "She grows weaker each day. Dehydration is a common, treatable cause of sudden confusion."],
          ["o", "Tell the daughter to give her more water and see how she is in a week", "Fluids help, but she may need medical treatment now and a check of her kidneys."],
        ],
      },
    ],
    concept: "Sudden confusion is medical until proven otherwise",
    point: "Dementia changes slowly. A sudden worsening points to delirium from causes such as dehydration, infection or medicines.",
    errors: ["Blaming the dementia.", "Increasing dementia medicine.", "Waiting a week."],
  }),

  rich("wy-r023", {
    setting: "You are a psychology trainee in a women's health clinic in Jaipur.",
    lines: ["Sunita, 30, came for headaches and poor sleep.", "You notice bruises on her upper arms when she adjusts her dupatta.", "She has two children, aged 5 and 8."],
    beats: [
      {
        says: "“He only hits me when he's drunk. It's my fault for arguing.”",
        hints: ["Think about her safety today, and how to keep her talking to you.", "Blame belongs to the abuser. Asking about immediate danger matters most; pushing her to leave can shut her down.", "The best choice says it is not her fault and asks if she is safe tonight."],
        choices: [
          ["b", "“It is not your fault. Are you and the children safe tonight?”", "She mentions he choked her last week. Choking strongly predicts serious harm; you plan safety and give the women's helpline 181."],
          ["h", "“You should leave him and go to your parents.”", "She shuts down. Leaving is often the most dangerous time, and the choice is hers; advice before assessment pushes her away."],
          ["h", "“Try not to argue when he is drunk.”", "You have agreed it is her fault. Victim-blaming keeps her trapped."],
          ["o", "“That sounds hard. Shall we focus on your headaches today?”", "Gentle, but it moves away from her safety, which is the most important thing today."],
        ],
      },
    ],
    concept: "Safety assessment in domestic violence",
    point: "Name that it is not her fault, ask about immediate danger (especially choking, weapons, threats to kill), plan safety with her, and share the 181 helpline.",
    errors: ["Victim-blaming.", "Telling her to leave before assessing.", "Avoiding the topic."],
  }),

  rich("wy-a006", {
    setting: "You are a psychology trainee writing the mental state examination after an interview.",
    lines: ["Mr Lal, 55, a retired clerk, was seen for low mood.", "He spoke in a flat voice and rarely smiled.", "His face did not change when he talked about his son's wedding or about his late wife."],
    beats: [
      {
        says: "Your supervisor asks, “What will you write for affect?”",
        hints: ["Think about the difference between mood and affect.", "Affect is what you observe: its range, reactivity and fit with what is said. Describe before you label.", "The best choice describes the range and reactivity you saw."],
        choices: [
          ["b", "'Affect: restricted range, flat in tone, did not change with happy or sad topics.'", "The next clinician can picture him. Describe before you label."],
          ["o", "'Affect: depressed.'", "'Depressed' describes mood, not range or reactivity. Describe what you saw."],
          ["h", "'Affect: normal.'", "This is inaccurate and could hide negative symptoms or depression."],
          ["o", "'Affect: blunted, likely schizophrenia.'", "A diagnosis does not belong in the affect line, and you may be wrong. Describe it."],
        ],
      },
    ],
    concept: "Describing affect",
    point: "Describe affect by what you see: range (full, restricted, flat), reactivity, and whether it fits what the person says. Mood is what they tell you.",
    errors: ["Writing mood words for affect.", "Labelling instead of describing.", "Putting a diagnosis in the MSE."],
  }),

  rich("wy-l037", {
    setting: "You are a psychology trainee working with the newborn intensive care unit (NICU) in a Chennai hospital.",
    lines: ["Revathi, 27, gave birth at 29 weeks. Her baby has been in the NICU for three weeks.", "Nurses say she cries at the cot side for hours and hardly eats.", "She says she cannot sleep even when she goes home."],
    beats: [
      {
        says: "“It's my fault he came early. I can't stop crying.”",
        hints: ["Think about the mother's own mental health, not only her baby's.", "NICU parents have high rates of depression and anxiety. Screening and support find what needs help.", "The best choice screens her for depression and anxiety and offers support."],
        choices: [
          ["b", "Screen her for depression and anxiety, ask about thoughts of self-harm, and offer support", "She has postnatal depression and gets help; her mood improves."],
          ["o", "Tell her this is normal for NICU mothers and will pass when the baby goes home", "Her depression goes unnoticed for months."],
          ["h", "Tell her she must be strong for her baby", "She hides her distress. Telling her to be strong silences her."],
          ["o", "Ask the nurses to keep her busy with the baby's care", "Involvement helps bonding, but her own mood still needs assessing."],
        ],
      },
    ],
    concept: "Parental mental health in the NICU",
    point: "Mothers and fathers of babies in intensive care are at high risk of depression, anxiety and trauma symptoms. Screen and support them.",
    errors: ["Calling distress normal.", "Telling parents to be strong.", "Focusing only on the baby."],
  }),

  rich("wy-l024", {
    setting: "You are a psychology trainee working with the neurology team in a Pune hospital.",
    lines: ["Kavya, 23, has had 'fits' for a year. Video-EEG shows functional (non-epileptic) seizures.", "The neurologist told her, 'It is not epilepsy, it is psychological,' and referred her to you.", "She arrives angry and tearful."],
    beats: [
      {
        says: "“They think I'm making it up.”",
        hints: ["Think about how the diagnosis was heard, and what helps people accept it.", "Functional seizures are real and not deliberate. A clear, shared explanation with the neurologist improves outcome.", "The best choice explains it as real and treatable and starts therapy with the neurologist's support."],
        choices: [
          ["b", "Explain that her seizures are real and not on purpose, that they can improve with therapy, and plan care with the neurologist", "She feels believed, starts therapy and her seizures reduce."],
          ["h", "Tell her it is all psychological and she can control the seizures if she tries", "She feels blamed and her seizures continue. It is dismissive and untrue."],
          ["h", "Agree that it is probably put on, but say therapy may still help", "She feels called a liar and leaves care."],
          ["o", "Tell her you will need to see a seizure yourself before you can help", "Not needed; the diagnosis is made. Waiting delays treatment."],
        ],
      },
    ],
    concept: "Explaining functional seizures",
    point: "Functional seizures are real, common and not deliberate. A clear, positive explanation shared by neurology and psychology is the first step of treatment.",
    errors: ["Saying 'it's all in your head'.", "Implying faking.", "Delaying therapy."],
  }),

  rich("wy-e013", {
    setting: "You are a psychology trainee running a session in a hospital outpatient block.",
    lines: ["Mr Desai, 60, has type 2 diabetes and takes insulin. He is being seen for anxiety.", "He skipped lunch to make the appointment.", "Twenty minutes in, he starts sweating, shaking and losing track of what he is saying."],
    beats: [
      {
        says: "“I feel strange. I think it's one of my panic attacks.”",
        hints: ["Think about whether this could be a medical emergency.", "A diabetic on insulin who skipped a meal, now sweaty, shaky and confused, may have low blood sugar. It can look like panic.", "The best choice gives sugar if he can swallow and calls for medical help."],
        choices: [
          ["b", "Give him something sugary if he can swallow safely, and call for medical help", "He improves within minutes. Low sugar can look like panic."],
          ["h", "Treat it as a panic attack with breathing exercises", "Low sugar can quickly lead to fits or unconsciousness."],
          ["h", "Ask him to lie down and rest to see whether it passes", "Delay is dangerous if his sugar keeps falling."],
          ["o", "Ask him to check his sugar with his meter before doing anything", "Checking is good if quick, but if he is confused, give sugar first and call help."],
        ],
      },
    ],
    concept: "Low blood sugar can mimic panic",
    point: "In anyone with diabetes, sudden sweating, shaking and confusion may be low blood sugar. Give sugar if they can swallow and get medical help.",
    errors: ["Assuming it is panic.", "Waiting for it to pass.", "Delaying sugar to measure first when confused."],
  }),

  rich("wy-l027", {
    setting: "You are a psychology trainee taking referrals from an IVF clinic in Mumbai.",
    lines: ["Rina, 34, and Amit, 36, have had three failed IVF cycles in two years.", "Rina's mother-in-law has started saying she is 'unlucky'.", "They are deciding whether to try once more."],
    beats: [
      {
        says: "Rina says, “Every time, it's like losing a baby. And everyone says just relax.”",
        hints: ["Think about grief and stress that is not a mental illness but still needs support.", "Failed IVF cycles bring real grief, and 'just relax' adds blame.", "The best choice supports their grief and stress and works with the clinic on timing."],
        choices: [
          ["b", "Acknowledge each failed cycle as a real loss, offer support for grief and stress, and liaise with the clinic on timing", "They feel supported and less alone as they decide about the next cycle."],
          ["o", "Tell them to stay positive, since stress can lower the success rate", "They feel blamed for their stress. It adds pressure."],
          ["h", "Say you only see people with a mental illness, so they do not need you", "They struggle alone. Distress deserves support even without a diagnosis."],
          ["o", "Advise them to stop trying, since it is causing so much pain", "That decision is theirs. Support them to make it, rather than making it for them."],
        ],
      },
    ],
    concept: "Grief in infertility",
    point: "Each failed fertility treatment can feel like a loss. Support the grief, avoid blame, and work with the fertility team.",
    errors: ["'Stay positive' messages.", "Turning away distress without a diagnosis.", "Deciding for the couple."],
  }),

  rich("wy-g006", {
    setting: "You are a psychology trainee doing play therapy in a child clinic in Bhopal.",
    lines: ["Ishaan, 7, has separation anxiety and has seen you for ten sessions.", "He used to cry at the door; now he walks in on his own.", "Today he arrives holding a folded piece of paper."],
    beats: [
      {
        says: "He gives you a crayon drawing of the two of you in the playroom.",
        hints: ["Think about what the gift means to a child in therapy.", "A child's drawing is part of the therapy, not a boundary problem. How you receive it tells him how you see him.", "The best choice thanks him, talks about the drawing and keeps it."],
        choices: [
          ["b", "Thank him, talk about the drawing together, and keep it", "He tells you it shows the room where he feels brave. The drawing becomes part of the work."],
          ["o", "Thank him quickly and put it away in a drawer so the session can start", "He watches it disappear and goes quiet. Rushing past it misses its meaning."],
          ["h", "Tell him therapists cannot keep presents", "He looks crushed and stops drawing. Refusing a child's drawing is needless and hurtful."],
          ["o", "Ask him to give it to his mother instead", "He may feel rejected. It was made for you, and it is fine to keep."],
        ],
      },
    ],
    concept: "Children's gifts in therapy",
    point: "Drawings and small handmade gifts from children are part of the relationship. Receive them warmly and use them in the work.",
    errors: ["Refusing a child's gift.", "Rushing past it.", "Treating it as a boundary problem."],
  }),

  rich("wy-g030", {
    setting: "You are a counselling psychologist in a city clinic in Hyderabad.",
    lines: ["Farhan, 36, a Muslim engineer, is in his first session for anxiety.", "He keeps looking at a small Ganesh idol on your shelf.", "He mentions he was treated badly by a doctor last year."],
    beats: [
      {
        says: "“Are you Hindu? Will you judge me for being Muslim?”",
        hints: ["Think about what his question is really about.", "Behind the question is a fear of being judged. Your answer can be short; hearing his fear matters more.", "The best choice answers briefly if you wish, says you will not judge, and explores his worry."],
        choices: [
          ["b", "Answer briefly if you wish, say clearly you will not judge him, and ask about his worry", "He talks about past discrimination. Hearing his fear builds trust."],
          ["h", "Talk at length about your own religious views and practices", "He feels pressured. Your beliefs should not become part of his therapy."],
          ["o", "Say religion is never discussed in therapy", "He feels his worry is dismissed. Faith can be part of a client's life and therapy."],
          ["o", "Offer to refer him to a Muslim therapist if he would prefer", "A respectful offer, but making it before exploring his fear may feel like rejection."],
        ],
      },
    ],
    concept: "Self-disclosure and difference",
    point: "When a client asks about your identity, the question is usually about safety. Answer briefly if you choose, reassure, and explore their worry.",
    errors: ["Lengthy self-disclosure.", "Shutting the topic down.", "Referring on before exploring."],
  }),

  rich("wy-e048", {
    setting: "You are a psychology trainee answering a crisis call at a college counselling service.",
    lines: ["A hostel warden calls about Rhea, 28, a PhD scholar.", "Her friend found her in her room with an empty strip of sleeping tablets and a bottle of rum.", "She is very drowsy and breathing slowly."],
    beats: [
      {
        says: "The warden asks, “Should we just let her sleep it off?”",
        hints: ["Think about the danger of mixing sedatives and alcohol.", "Sleeping tablets plus alcohol can stop breathing. Slow breathing means this is an emergency now.", "The best choice calls an ambulance and keeps her on her side."],
        choices: [
          ["b", "Call an ambulance now, put her on her side, and keep someone with her until help arrives", "She is treated in time. Combined sedatives and alcohol are dangerous."],
          ["h", "Let her sleep it off", "Combined sedatives and alcohol can stop breathing."],
          ["h", "Wake her every hour through the night and call a doctor in the morning", "Her breathing slows further overnight. This needs emergency care, not home checks."],
          ["o", "Make her drink coffee and walk her around to keep her awake", "Coffee and walking do not reverse an overdose and can make her fall. Call an ambulance."],
        ],
      },
    ],
    concept: "Combined sedative overdose",
    point: "Sedatives with alcohol can stop breathing. Drowsiness and slow breathing need an ambulance; place the person on their side meanwhile.",
    errors: ["Letting them sleep it off.", "Hourly checks at home.", "Home remedies like coffee."],
  }),

  rich("wy-g021", {
    setting: "You are a counselling psychologist who makes short educational reels for your practice.",
    lines: ["Your reel about childhood trauma has a lakh views.", "It was based on a client's story with her name and city changed.", "That client, Meghna, 29, has just messaged you."],
    beats: [
      {
        says: "Meghna writes, “That's my story. My cousin sent it to me.”",
        hints: ["Think about what has happened to her trust and her privacy.", "Changing a name does not hide a story. Owning the mistake quickly limits the harm.", "The best choice apologises, takes the reel down and works on repairing trust."],
        choices: [
          ["b", "Apologise, take the reel down at once, and discuss with her how to repair the trust", "She is shaken but stays in therapy. Owning the mistake quickly limits harm."],
          ["o", "Tell her it was a mix of many clients, so it is not really hers", "She still sees her details and feels unsafe. Arguing about facts does not repair the hurt."],
          ["h", "Leave it up, since you changed her name", "Her family hears about the abuse. Changing a name is not enough."],
          ["o", "Edit the reel to change more details and keep it up", "The story is already recognised. It needs to come down."],
        ],
      },
      {
        says: "The reel is down. You still want to make content.",
        context: "She has come back for her next session.",
        hints: ["Think about what content carries no risk to any client.", "Any real client story, however changed, risks being recognised; consent from current clients is rarely truly free.", "The best choice uses general knowledge and invented composite examples only."],
        choices: [
          ["b", "Make content only from general knowledge and clearly invented examples", "Your videos still teach well, with no client at risk."],
          ["h", "Keep using client stories but change more details", "Another client recognises themselves."],
          ["o", "Keep using client stories, but ask each client for written consent first", "Some agree because they fear saying no to their therapist."],
          ["o", "Stop making content altogether", "Safe, but not needed. General content can still help people."],
        ],
      },
    ],
    concept: "Confidentiality on social media",
    point: "Client stories, even disguised, can be recognised. Use general knowledge and invented examples, and repair quickly if harm happens.",
    errors: ["Thinking a changed name is enough.", "Arguing with the client.", "Relying on consent from current clients."],
  }),

  rich("wy-e054", {
    setting: "You are a psychology trainee on an acute psychiatry ward on a night shift.",
    lines: ["Arjun, 28, was very agitated and was given an emergency sedative injection an hour ago.", "He is now asleep on his bed.", "The ward is short of staff tonight."],
    beats: [
      {
        says: "A nurse says, “He's calm now. We can leave him till morning.”",
        hints: ["Think about the risks after an emergency sedative injection.", "Sedated patients can have slowed breathing, falling blood pressure or reactions. Regular checks catch them early.", "The best choice checks breathing, pulse, blood pressure and alertness regularly."],
        choices: [
          ["b", "Ask that his breathing, pulse, blood pressure and alertness are checked regularly, as the protocol says", "Monitoring picks up a drop in oxygen early, and he is treated."],
          ["h", "Agree to leave him, since he is calm now", "Sedated patients can stop breathing or develop reactions."],
          ["o", "Check on him in the morning when he wakes", "His oxygen drops in the night unnoticed."],
          ["o", "Look in on him once before your shift ends", "One look is not monitoring. The checks need to be regular and recorded."],
        ],
      },
    ],
    concept: "Monitoring after rapid tranquillisation",
    point: "After an emergency sedative injection, breathing, pulse, blood pressure and alertness must be checked regularly until the person is fully awake.",
    errors: ["Treating sleep as safety.", "Waiting until morning.", "Unrecorded one-off checks."],
  }),
];
