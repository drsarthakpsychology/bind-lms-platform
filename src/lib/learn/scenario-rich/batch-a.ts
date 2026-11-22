import type { Scenario } from "../scenarios";
import { rich } from "./make";

/** Rich cases, batch A: the most played cases in boundaries, assessment and emergencies. */
export const RICH_A: Scenario[] = [
  rich("wy-g053", {
    setting: "You are a psychology trainee in a district hospital OPD. Your consultant supervises your clinic.",
    lines: [
      "It is 1:55 pm. The afternoon clinic starts at 2 and has 18 patients booked.",
      "Your consultant walks in late. He smells strongly of alcohol, his speech is slightly slurred and he drops his pen twice.",
      "You have noticed this once before, after a long lunch, but said nothing.",
    ],
    beats: [
      {
        says: "He sits down and says, “Send the first one in.”",
        hints: [
          "Think about who is at risk in the next hour, and what your duty is to them.",
          "Slurred speech and clumsiness mean he is impaired right now. Patients will get his decisions and prescriptions today.",
          "The best first step is quick, private and respectful, and it stops him seeing patients today.",
        ],
        choices: [
          ["b", "Ask to speak to him privately, say you are worried, and that he should not see patients today", "He goes quiet, then asks a colleague to cover and goes home. Speaking to him first is fast, respectful and keeps patients safe."],
          ["h", "Send the first patient in, since it is not a trainee's place to question a consultant", "A patient is given the wrong dose. An impaired clinician is a risk to patients now, whatever your rank."],
          ["o", "Cancel the whole afternoon list at the desk without speaking to him first", "Patients are safe, but he is blindsided and 18 people are turned away. Speak to him first when it is safe to do so."],
          ["h", "Sit in on each of his consultations so you can quietly correct any mistakes", "You cannot check every decision, and patients still get an impaired doctor. Watching is not a safety plan."],
        ],
      },
      {
        says: "The next week it happens again. When you mention it, he laughs: “One drink at lunch never hurt anyone.”",
        context: "He went home last time. This is the second time you have seen it.",
        hints: [
          "This is now a pattern, not a one-off. Think about who needs to know.",
          "He has brushed off a private word. Repeated impairment harms patients and usually means he needs help too.",
          "The right step uses the proper channel, so that someone with authority can act and support him.",
        ],
        choices: [
          ["b", "Tell the head of department what you have seen, with dates, so he gets help and patients are safe", "He is referred to a support programme for doctors and his clinics are covered. Reporting a repeated problem protects patients and helps him."],
          ["o", "Cover his clinic yourself each time he seems drunk, so patients are safe and he is not shamed", "Patients are safe today, but the problem goes on and you are now hiding it. Repeated impairment needs reporting."],
          ["h", "Ask the nurses to keep an eye on him and warn you if he seems worse", "No one is in charge and patients are still at risk. Informal watching is not a plan."],
          ["h", "Post about it anonymously in the trainees' group so others are careful", "Gossip spreads, nothing changes, and it may count as defamation. Concerns go through proper channels."],
        ],
      },
    ],
    concept: "Duty to act on an impaired colleague",
    point: "Patient safety comes first. Speak to the colleague privately and stop the immediate risk; if it happens again, report it through the proper channel so they also get help.",
    errors: ["Staying silent because of rank.", "Covering for a colleague, which hides a repeated risk.", "Going public before using the proper route."],
  }),

  rich("wy-a002", {
    setting: "You are a psychology trainee taking a history in a general hospital psychiatry OPD in Jaipur.",
    lines: [
      "Mr Yadav, 50, a shopkeeper, was referred by the medical OPD after normal tests for headaches.",
      "He sits with his hand on his forehead and answers briefly.",
      "His referral note just says 'stress?'.",
    ],
    beats: [
      {
        says: "“Doctor, I have tension all the time.”",
        hints: [
          "This is an assessment moment. Is 'tension' a symptom yet, or just a word?",
          "'Tension' can mean worry, low mood, a headache or a family quarrel. Only he can tell you which.",
          "The best choice asks for his own description: what it feels like and when it is worst.",
        ],
        choices: [
          ["b", "“When you say tension, what does it feel like, and when is it worst?”", "He describes a tight band round his head after quarrels with his son. An open question turns a vague word into a symptom and a trigger."],
          ["o", "Write 'anxiety' in the notes and move on to his family history and medicines", "You may be right, but you have guessed. 'Tension' often means something else, such as low mood or a headache."],
          ["h", "“Everyone has tension. You just need to relax more.”", "He feels dismissed and goes quiet. You learn nothing and lose his trust."],
          ["o", "“Is it anxiety, depression or stress?”", "He picks 'stress' because it is the word he knows. A menu of labels leads him instead of letting him describe it."],
        ],
      },
    ],
    concept: "Clarifying idioms of distress",
    point: "Patients often use everyday words like 'tension', 'ghabrahat' or 'weakness'. Ask what it feels like, when it happens and what makes it better or worse before writing a symptom.",
    errors: ["Translating a lay word into a diagnosis without asking.", "Offering a menu of labels that leads the answer.", "Dismissing common words as unimportant."],
  }),

  rich("wy-l055", {
    setting: "You are a psychology trainee in a district mental health programme clinic in rural Gujarat.",
    lines: [
      "Ramesh, 28, has schizophrenia and is improving on medicine after a relapse.",
      "His family also takes him to a local dargah and a bhuva (faith healer) every Thursday.",
      "Last month, at another healer's place, a neighbour's son was kept in chains.",
    ],
    beats: [
      {
        says: "His mother says, “We will keep going to the healer too. Medicine is not everything.”",
        hints: [
          "You are working alongside another kind of helper. Think about what keeps Ramesh in care.",
          "Rituals by themselves are not harmful; stopping medicine or using chains is. Separate the two.",
          "The best choice respects their beliefs, asks that medicine continues, and draws a clear line at harm.",
        ],
        choices: [
          ["b", "Respect their faith, ask that the rituals go alongside his medicine, and say clearly that chaining or beating is never allowed", "They keep both, safely. Respect with clear limits keeps the family working with you."],
          ["o", "Tell them to stop all visits to the healer, since they delay proper treatment", "They feel judged and quietly stop the medicine instead. Demanding they give up their faith often loses the patient."],
          ["h", "Agree that the healer can keep him there for a few weeks if that helps", "He is chained and injured. Chaining people with mental illness is banned under the Mental Healthcare Act 2017."],
          ["o", "Say nothing about the healer and only discuss the medicine", "The medicine continues, but you never check whether the healer's practices are safe."],
        ],
      },
    ],
    concept: "Working with traditional healing safely",
    point: "Many families in India use faith healing alongside treatment. Work with their beliefs, keep medicine going, and be clear that chaining, beating or starving are never acceptable.",
    errors: ["Demanding families stop all faith practices.", "Ignoring what happens at the healer's place.", "Agreeing to restraint because the family wants it."],
  }),

  rich("wy-g046", {
    setting: "You are a counselling psychologist with your own clinic in Surat.",
    lines: [
      "A police sub-inspector arrives at your front desk at 11 am.",
      "He says a client of yours, Rekha, 34, is a witness in a case, and he wants her file.",
      "Rekha has not mentioned any police matter, and you have no letter or order in front of you.",
    ],
    beats: [
      {
        says: "“Just give me her file. It's routine.”",
        hints: [
          "Think about who owns the information in that file, and what would make sharing lawful.",
          "Without her consent or a legal order, there is no basis to share. A spoken request is not an order.",
          "The best choice is polite, asks for the request in writing and checks the legal basis first.",
        ],
        choices: [
          ["b", "Politely ask for the request in writing, and say you will check the legal basis before sharing anything", "He returns with a court order and only the needed part is shared. Records go out only with consent or a lawful order."],
          ["h", "Hand over the whole file to avoid trouble with the police", "Private material is shared with no legal basis. Fear of authority is not a reason to breach confidentiality."],
          ["o", "Refuse to speak to him and ask him to leave the clinic", "He comes back angry with an order. Clear, polite process works better than a flat refusal."],
          ["o", "Phone Rekha in front of him and ask her whether you can hand it over", "She feels pressured on the spot. Ask her privately, after you know what is being asked and why."],
        ],
      },
      {
        says: "He returns two days later with a court order asking for her full file.",
        context: "You have checked that the order is genuine.",
        hints: [
          "A court order changes the picture. Think about what you must do and what you can still protect.",
          "Confidentiality has legal limits, but you can share only what the order asks for and keep your client informed.",
          "The best choice follows the order, tells the client, and asks for sensitive details to be limited.",
        ],
        choices: [
          ["b", "Share what the order requires, tell Rekha what is being shared, and ask the court to limit sensitive details", "Only the needed parts go out and she knows what happened. Following the order while protecting the client is the right balance."],
          ["h", "Refuse, because therapy notes are always confidential", "Ignoring a court order can lead to contempt of court. Confidentiality has legal limits under section 23 of the Mental Healthcare Act."],
          ["o", "Send the whole file at once without telling Rekha, to avoid any delay", "She learns later and feels betrayed. Clients should be told what has been shared about them."],
          ["o", "Ask a lawyer friend informally whether you really have to comply", "You lose time and still need to act. If unsure, take proper legal advice and tell the court promptly."],
        ],
      },
    ],
    concept: "Lawful disclosure of records",
    point: "Share records only with the client's consent or a lawful order. Check the request, share only what is required, and tell the client.",
    errors: ["Handing over records to anyone in authority who asks.", "Treating confidentiality as absolute and ignoring a court order.", "Sharing without telling the client."],
  }),

  rich("wy-e017", {
    setting: "You are a psychology trainee on night duty in a government hospital casualty, helping the de-addiction team.",
    lines: [
      "Sanjay, 40, was brought in an hour ago by friends after a wedding. He smells of alcohol.",
      "He fell and has a cut on the back of his head, which was cleaned and dressed.",
      "When he arrived he was chatting and joking. The staff put him on a trolley to 'sleep it off'.",
    ],
    beats: [
      {
        says: "The nurse says, “He's getting sleepier and sleepier. Typical drunk.”",
        hints: [
          "Ask whether something other than alcohol could explain this.",
          "He is getting drowsier over time after a head injury. Alcohol levels fall over hours; a bleed gets worse.",
          "The best choice gets a doctor to see him now and asks about a head scan.",
        ],
        choices: [
          ["b", "Tell the duty doctor now that he is getting drowsier after a head injury and ask about an urgent scan", "The scan shows a bleed and he goes to surgery. Never put worsening drowsiness after a head injury down to alcohol."],
          ["h", "Agree that he should be left to sleep it off until morning", "He stops responding in the night. Worsening drowsiness after a head injury may mean bleeding in the brain."],
          ["h", "Wake him every hour, and send him home if he can answer questions", "Better than nothing, but getting drowsier needs a doctor and a scan now, not hourly checks."],
          ["o", "Ask his friends how much he drank before deciding anything", "Useful history, but it delays the urgent step. The drowsiness needs a doctor first."],
        ],
      },
    ],
    concept: "Do not blame alcohol for everything",
    point: "Intoxication can hide a head injury, low blood sugar or infection. Getting more drowsy over time is a red flag that needs a doctor at once.",
    errors: ["Labelling a drunk patient and stopping thinking.", "Waiting for him to sober up.", "Taking a long history before calling for help."],
  }),

  rich("wy-a037", {
    setting: "You are a psychology trainee in a psychiatry OPD in Varanasi, taking a history with your supervisor nearby.",
    lines: [
      "Swami Prakashanand, 55, a temple priest, came because his nephew worries he is 'too religious'.",
      "He is calm, well groomed and runs the temple's daily rituals without trouble.",
      "His sleep, appetite and mood are unchanged.",
    ],
    beats: [
      {
        says: "“During my morning prayer, God speaks to me.”",
        hints: [
          "Think about whether this experience is unusual for him and his community, before calling it a symptom.",
          "Experiences shared and accepted in someone's faith are not the same as hallucinations. What matters is change, distress and loss of function.",
          "The best choice asks how his community sees such experiences and whether anything has changed recently.",
        ],
        choices: [
          ["b", "Ask how others in his tradition see such experiences, and whether anything has changed recently", "It is part of his practice, nothing has changed and he is well. No disorder is found."],
          ["o", "Write 'auditory hallucinations' and start asking about delusions and other psychotic symptoms", "You may be pathologising a normal experience. Check its meaning in his culture first."],
          ["h", "Tell him it must be his imagination", "He feels mocked and refuses to talk further. Dismissing faith closes the assessment."],
          ["o", "Ask his nephew privately whether the Swami is 'mentally all right'", "Collateral helps, but going behind him first, with a loaded question, can damage trust. Ask him first."],
        ],
      },
    ],
    concept: "Separating faith from psychopathology",
    point: "Religious experiences that fit a person's tradition, cause no distress and have not changed are not symptoms. Look for change, distress, loss of function and beliefs others in the faith would not share.",
    errors: ["Labelling religious experience as psychosis.", "Dismissing beliefs as imagination.", "Judging by the clinician's own beliefs."],
  }),

  rich("wy-e053", {
    setting: "You are a psychology trainee in an orthopaedic ward, asked to see a 'difficult' patient.",
    lines: [
      "Arif, 30, a delivery rider, came in two days ago after falling off his bike. His leg is in plaster.",
      "He was polite and joking yesterday.",
      "Today the nurses say he swore at them, seems muddled, and has vomited twice.",
    ],
    beats: [
      {
        says: "The ward sister says, “He's being difficult. Can you counsel him?”",
        hints: [
          "Sudden change in behaviour: think about the body before the mind.",
          "New confusion and vomiting two days after a fall may mean bleeding inside the head. It can get worse fast.",
          "The best choice raises it with the doctors today and asks for an urgent head scan.",
        ],
        choices: [
          ["b", "Tell the doctor now about new confusion and vomiting after a fall, and ask for an urgent head scan", "The scan shows a slow bleed and he is operated on. New behaviour change after a head injury is medical until proven otherwise."],
          ["h", "Offer counselling for stress after the accident", "He becomes unconscious the next day. Counselling delays the medical check he needs."],
          ["h", "Tell his family he is being difficult and should behave", "They scold him while he gets worse. Behaviour change after a head injury is a medical sign, not bad manners."],
          ["o", "Do a quick mental state check and write that he is confused", "Your note is accurate, but no one acts on it. Confusion with vomiting needs the doctor told directly, now."],
        ],
      },
    ],
    concept: "Behaviour change can be medical",
    point: "New confusion, rudeness or vomiting after a head injury can mean a bleed in the brain. Tell the doctor at once and ask for a scan.",
    errors: ["Calling sudden behaviour change 'stress'.", "Writing a note without telling anyone.", "Treating the patient as difficult."],
  }),

  rich("wy-e025", {
    setting: "You are a psychology trainee running a counselling session in a hospital outpatient block.",
    lines: [
      "Neha, 40, a bank manager, is talking about work stress.",
      "Mid-sentence she grabs her head and says the pain came 'like a thunderclap'.",
      "She has had tension headaches before, but says this is 'the worst headache of my life'.",
    ],
    beats: [
      {
        says: "“It's just stress. Give me a minute.”",
        hints: [
          "Think about whether this could be a medical emergency, not a stress headache.",
          "A sudden, very severe headache that peaks within seconds is a warning sign of bleeding in the brain.",
          "The best choice gets emergency medical help now, not painkillers or waiting.",
        ],
        choices: [
          ["b", "Stop the session, stay with her and get emergency medical help now", "She has a bleed around the brain and is treated in time. A thunderclap headache needs emergency care."],
          ["h", "Agree it is probably stress and do a relaxation exercise", "Her headache is a brain bleed. Treating it as stress loses precious time."],
          ["h", "Give her a painkiller and water, and see how she feels in half an hour", "The pain eases a little, then she collapses. Painkillers only hide the warning."],
          ["o", "Ask her to see her family doctor later today", "Better than nothing, but this cannot wait for a later appointment. It needs emergency care now."],
        ],
      },
    ],
    concept: "Red-flag headache",
    point: "A sudden 'worst ever' headache that peaks within a minute needs emergency medical assessment, even in a person who has stress headaches.",
    errors: ["Putting a new pattern down to known stress.", "Masking the pain with tablets.", "Sending her to a routine appointment."],
  }),

  rich("wy-g054", {
    setting: "You are an MPhil trainee on a hospital research project.",
    lines: [
      "You collected all 120 interviews and ran the analysis over eight months.",
      "The draft paper your supervisor submits lists him and two colleagues as authors.",
      "Your name is in the thank-you note at the end. You have your data files, emails and analysis logs.",
    ],
    beats: [
      {
        says: "A friend says, “This happens all the time. Just let it go.”",
        hints: [
          "Think about fair credit and the proper way to raise a research concern.",
          "Authorship goes to those who did substantial work. Your records show what you did.",
          "The best choice raises it with him first, with your records, and uses the research committee if needed.",
        ],
        choices: [
          ["b", "Ask to meet him with your records, explain your part, and go to the research ethics committee if it is not fixed", "Your name is added as an author. Clear records and proper channels work."],
          ["h", "Accept it, since trainees have no say", "Your work is lost and the same thing happens to the next trainee."],
          ["o", "Complain about him on social media to warn other trainees", "It damages your own reputation, may be defamatory, and the paper stays the same."],
          ["o", "Email the journal directly before speaking to him", "The journal may act, but skipping the conversation can sour things. Raise it with him first."],
        ],
      },
    ],
    concept: "Research authorship ethics",
    point: "People who make a substantial contribution to the work should be authors. Keep records, raise it directly, then use the institution's research committee.",
    errors: ["Staying silent because of the power gap.", "Going public first.", "Not keeping records of your own work."],
  }),

  rich("wy-e014", {
    setting: "You are a psychology trainee in a community mental health clinic.",
    lines: [
      "Rahul, 25, is in the waiting area for his follow-up. He has epilepsy and recently missed tablets.",
      "He suddenly falls from his chair, goes stiff, then starts jerking all over.",
      "Other patients are crowding round and someone says to hold him down.",
    ],
    beats: [
      {
        says: "A man shouts, “Put a spoon in his mouth so he doesn't bite his tongue!”",
        hints: [
          "Think about seizure first aid: what keeps him safe while it runs its course?",
          "Holding someone down or putting things in the mouth causes injuries. Time the seizure, since length decides when to call an ambulance.",
          "The best choice clears the space, protects his head, times it and turns him on his side afterwards.",
        ],
        choices: [
          ["b", "Clear the space, cushion his head, time the seizure, and turn him on his side once the jerking stops", "He recovers in two minutes and is checked by the doctor. Call an ambulance if it lasts more than five minutes."],
          ["h", "Hold his arms and legs firmly so he does not hurt himself", "Restraining a person during a seizure can cause fractures and other injuries."],
          ["h", "Put a spoon or cloth in his mouth to protect his tongue", "Objects in the mouth break teeth and can block his breathing."],
          ["o", "Run to find a doctor and leave him with the other patients", "Help is needed, but he should not be left. Send someone else for the doctor and stay with him."],
        ],
      },
    ],
    concept: "Seizure first aid",
    point: "Keep the person safe, do not restrain or put anything in the mouth, time the seizure, and place them on their side afterwards. Over five minutes is an emergency.",
    errors: ["Restraining the person.", "Putting objects in the mouth.", "Not timing the seizure."],
  }),

  rich("wy-r020", {
    setting: "You are a psychology trainee in a postnatal clinic at a district hospital in Lucknow.",
    lines: [
      "Fatima, 25, had her first baby six weeks ago. Her mother-in-law brought her for 'weakness'.",
      "She is not sleeping even when the baby sleeps, has stopped eating properly and cries most days.",
      "She avoids looking at the baby, who is with the mother-in-law in the waiting room.",
    ],
    beats: [
      {
        says: "“Sometimes I think my baby would be better without me.”",
        hints: [
          "Think about safety: whose safety could this sentence be about?",
          "After childbirth, a sentence like this can mean thoughts of suicide, and sometimes of harming the baby too. Only direct questions tell you.",
          "The best choice asks her gently and directly about harming herself and the baby.",
        ],
        choices: [
          ["b", "Ask her gently and directly whether she has thoughts of harming herself or the baby", "She says she has thought of jumping from the terrace with the baby. Urgent care protects both of them."],
          ["h", "Reassure her that most new mothers feel overwhelmed and it will pass", "Many do, but this sentence can signal suicidal and even infant-harm thoughts. You did not check."],
          ["h", "Tell her mother-in-law straight away that Fatima may be a danger to the baby", "Telling the family before assessing her frightens her and can lead to blame instead of care."],
          ["o", "Screen her for postnatal depression with a questionnaire and book a review next week", "Screening helps, but you still have not asked about harm today, and a week may be too long."],
        ],
      },
    ],
    concept: "Postpartum risk assessment",
    point: "Ask every distressed new mother directly about thoughts of harming herself and the baby. Postnatal depression and psychosis can carry risk to both.",
    errors: ["Normalising it as 'baby blues'.", "Involving family before assessing her.", "Screening without asking about harm today."],
  }),

  rich("wy-a008", {
    setting: "You are a psychology trainee in a psychiatry OPD in Kolkata.",
    lines: [
      "Mr Bose, 40, a school clerk, has slept badly for three months and lost weight.",
      "He has had a long boundary dispute with his neighbour.",
      "He looks tired and low but is polite and clear in his speech.",
    ],
    beats: [
      {
        says: "“My neighbour put a curse on me. That's why I can't sleep.”",
        hints: [
          "Think about his own explanation of the illness. What does it tell you, and what does he want?",
          "A belief shared in someone's culture is not a delusion. Ask how common it is and what he thinks will help.",
          "The best choice invites his story and his ideas about help, without arguing or labelling.",
        ],
        choices: [
          ["b", "“Tell me more about the curse, how it affects you, and what you think would help.”", "He wants a puja and also help for his sleep. Working with his beliefs keeps him in treatment."],
          ["h", "“Curses aren't real. You have depression.”", "He feels mocked and goes only to a healer. Arguing with a belief closes the door."],
          ["o", "Write 'possible delusion' and move on to checking for hallucinations", "A belief shared by his culture is not a delusion. Ask how common it is in his community first."],
          ["o", "Ask whether his family also believes in the curse", "Helpful context, but ask him first what it means to him and what he wants."],
        ],
      },
    ],
    concept: "Explanatory model of illness",
    point: "Ask patients what they think caused the illness and what would help. Treatment that fits their beliefs is more likely to be followed.",
    errors: ["Calling cultural beliefs delusions.", "Arguing with the belief.", "Skipping the patient's own view."],
  }),

  rich("wy-g055", {
    setting: "You are a psychology trainee on placement in a large hospital in Ahmedabad.",
    lines: [
      "For four weeks your clinical supervisor has commented on your clothes and body during supervision.",
      "He now sends you messages late at night, asking to meet 'outside work'.",
      "Your placement assessment depends on his report.",
    ],
    beats: [
      {
        says: "Tonight's message: “You looked lovely today. Coffee tomorrow, just us?”",
        hints: [
          "This is sexual harassment at work. Think about your safety and the formal route.",
          "Evidence and the workplace complaints committee protect you; silence and public fights usually do not.",
          "The best choice keeps a record and takes it to the internal complaints committee.",
        ],
        choices: [
          ["b", "Save the messages and take them to the hospital's internal complaints committee", "An inquiry starts and you are moved to another supervisor. Every workplace in India with ten or more staff must have this committee."],
          ["h", "Ignore it until the placement ends, so your report is not affected", "It gets worse, and the next trainee is harmed. Harassment rarely stops on its own."],
          ["o", "Confront him angrily in front of the whole team", "He denies it and the team is divided. A record and the formal route are safer."],
          ["o", "Tell him privately that it must stop, and keep no record", "It may stop, but if it does not, you have no evidence. Keep the messages whatever you decide."],
        ],
      },
      {
        says: "The committee asks whether you want to go ahead, as it may affect your placement.",
        context: "You have saved several messages.",
        hints: [
          "Think about what the process is for, and what protects you during it.",
          "The law protects complainants from being punished for complaining. You can ask for that protection.",
          "The best choice continues and asks for protection from retaliation.",
        ],
        choices: [
          ["b", "Go ahead, and ask for protection from any retaliation, such as a new supervisor", "He is disciplined and you complete training elsewhere. The process is meant to protect complainants."],
          ["h", "Withdraw the complaint to protect your marks", "He goes on to the next trainee. Withdrawing out of fear leaves others at risk."],
          ["o", "Ask the committee only to give him a quiet warning", "He feels untouchable and carries on. A warning alone may not be enough."],
          ["o", "Ask for time to talk to someone you trust first", "Reasonable, but do not let the delay stretch. Ask for protection now while you decide."],
        ],
      },
    ],
    concept: "Sexual harassment at work (POSH Act 2013)",
    point: "Keep evidence and use the internal complaints committee. The law requires workplaces to protect complainants from retaliation.",
    errors: ["Staying silent to protect marks.", "Confronting without evidence.", "Settling for an informal warning."],
  }),

  rich("wy-g026", {
    setting: "You are a counselling psychologist who shares a wellness centre in Pune with other therapists.",
    lines: [
      "A colleague tells you over tea that he 'releases trauma from the body' by massaging clients during psychotherapy.",
      "He sees mostly young women who have survived abuse.",
      "He has no training in any body-based therapy and no supervisor.",
    ],
    beats: [
      {
        says: "“You should try it. Clients love it.”",
        hints: [
          "Think about client safety and professional boundaries.",
          "Touch inside therapy, with abuse survivors and no training or supervision, puts clients at serious risk of harm.",
          "The best choice raises your concern with him and points him to supervision and the proper body.",
        ],
        choices: [
          ["b", "Tell him your concern plainly, and that he should stop and take it to a supervisor; report it if he does not", "He stops after review. Speaking up early protects clients."],
          ["h", "Ask to learn the technique", "Clients later report feeling violated. Touch-based methods inside psychotherapy invite boundary violations."],
          ["h", "Say nothing, since how he runs his practice is his business", "Clients stay at risk. Concern about a colleague's practice should be raised."],
          ["o", "Quietly stop referring your clients to him", "Your clients are protected, but his clients are not. The concern still needs raising."],
        ],
      },
    ],
    concept: "Boundary violations disguised as treatment",
    point: "Touch in therapy without training, consent and supervision is a boundary violation, especially with abuse survivors. Raise it with the colleague and report if it continues.",
    errors: ["Assuming a new method must be fine.", "Protecting only your own clients.", "Staying silent about a colleague."],
  }),

  rich("wy-e050", {
    setting: "You are a psychology trainee on a medical ward, helping the consultation-liaison team.",
    lines: [
      "Mr Rao, 55, has liver cirrhosis from years of drinking. He was admitted three days ago.",
      "Since last night he is confused, drowsy by day and restless at night, and has a flapping tremor of the hands.",
      "He has not opened his bowels for four days.",
    ],
    beats: [
      {
        says: "The night nurse asks, “Can we give him something to calm him down?”",
        hints: [
          "Think about why a man with liver failure has become confused.",
          "Liver failure, constipation and infection can cause confusion, and sedatives can make it much worse.",
          "The best choice asks the medical team to treat the cause and to avoid sedatives.",
        ],
        choices: [
          ["b", "Ask the medical team to look for the cause of his confusion and to avoid sedatives", "They treat constipation and an infection, and his confusion clears in days."],
          ["h", "Suggest a small dose of a benzodiazepine so he settles for the night", "Sedatives can make liver-related confusion much worse, even cause coma."],
          ["h", "Suggest tying him to the bed overnight so he does not pull at his drip", "Restraint is harmful and treats nothing. It is allowed only as a last resort to prevent immediate harm."],
          ["o", "Ask the family to sit with him and calm him", "Family can help him feel safe, but the medical cause still needs treating tonight."],
        ],
      },
    ],
    concept: "Confusion in liver failure",
    point: "New confusion in liver disease is often from the liver failing, made worse by constipation, infection or bleeding. Sedatives can make it worse; the cause must be treated.",
    errors: ["Sedating a confused patient.", "Missing a medical cause.", "Using restraint for restlessness."],
  }),
];
