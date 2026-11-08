import type { Scenario } from "../scenarios";
import { b, s } from "./make";

/** Crisis: psychological first aid, disasters, sudden loss, phone and campus crises. */
export const CRISIS: Scenario[] = [
  s("wy-c001", "crisis", "Psychological first aid", "ptsd", "trauma", 1, "CUS", "Use the basics of psychological first aid", "Survivor, 35, after a building collapse", [
    b("He is shaking and asks where his brother is.", [
      ["o", "Ask him to tell you everything that happened from the start, so he can get it off his chest", "Pushing for a full account right now can overwhelm him. Early forced debriefing does not prevent PTSD."],
      ["b", "Make sure he is safe and warm, help him find news of his brother, and stay calm with him", "He settles once he knows where to ask. Safety, practical help and connection are the core of first aid."],
      ["h", "Tell him to be strong and not cry", "He holds it in and feels alone. Telling people how to feel blocks the support they need."],
    ]),
  ]),
  s("wy-c002", "crisis", "Crisis call", "suicide", "suicide", 2, "CUS", "Stay with a caller in crisis", "Caller, 28, on a helpline at night", [
    b("“I'm on the terrace. I can't do this anymore.”", [
      ["h", "Tell him to call back during office hours when a counsellor is free to talk properly", "He hangs up on the edge of a terrace. A caller at risk needs you now."],
      ["b", "Keep him talking, ask where he is, and get help to him while staying on the line", "Police reach him while you talk. Staying connected buys time."],
      ["o", "Give him the number of a psychiatrist", "A number is not help when he is on a terrace. He needs someone there now."],
    ]),
  ]),
  s("wy-c003", "crisis", "Sudden death in a family", "depression", "depression", 2, "US", "Support a family in acute grief", "Family of a young man who died in an accident", [
    b("The mother is screaming and the father is silent.", [
      ["b", "Stay with them and let them grieve their own way", "They feel held. In acute grief, presence matters more than words."],
      ["o", "Explain the stages of grief so they know what to expect over the coming months", "Information can wait. Right now they need presence, not a lecture."],
      ["h", "Ask the mother to calm down for the father's sake", "She feels her grief is wrong. Different ways of grieving are all normal."],
    ]),
  ]),
  s("wy-c004", "crisis", "Disaster response", "ptsd", "trauma", 2, "UMS", "Avoid mass debriefing", "Village after a flood in Assam", [
    b("The district asks you to run group sessions where everyone retells the flood in detail.", [
      ["o", "Agree, since talking about trauma is always healing and the district wants to help everyone", "Forced detailed retelling can harm some survivors."],
      ["h", "Refuse to help at all", "People still need support; refusing helps no one."],
      ["b", "Suggest practical help and screening for those who need more", "Most recover with support. Those with ongoing distress are referred."],
    ]),
  ]),
  s("wy-c005", "crisis", "Exam result crisis", "suicide", "suicide", 2, "CUS", "Respond on results day", "Student, 17, failed the board exam", [
    b("“My father will kill me. I'd rather die.”", [
      ["b", "Ask about suicide and stay with him", "He has thought of jumping. You involve his uncle and stay with him."],
      ["h", "Tell him he should have studied harder", "Shame on a high-risk day can tip him into an attempt."],
      ["o", "Tell him he can retake the exam next year, so there is nothing to worry about", "True, but you have not checked his safety."],
    ]),
  ]),
  s("wy-c006", "crisis", "Campus suicide aftermath", "suicide", "suicide", 3, "UMS", "Respond safely after a student suicide", "College, the day after a student died by suicide", [
    b("The principal wants to hold a big assembly describing what happened.", [
      ["h", "Agree and describe the method so students understand the danger", "Method details raise contagion risk."],
      ["o", "Suggest saying nothing so students forget about it quickly", "Silence leaves students alone with rumours and grief."],
      ["b", "Suggest a brief message without method details, plus support", "Close friends are screened and supported. Safe messaging reduces copycat risk."],
    ]),
  ]),
  s("wy-c007", "crisis", "Panic in a public place", "anxiety", "anxiety", 1, "CUS", "Help someone through a panic attack", "Woman, 30, on a metro platform", [
    b("She is breathing fast, shaking and says she is dying.", [
      ["b", "Stay calm, move her somewhere quieter, and breathe slowly with her", "Her breathing slows and the panic passes. Calm presence helps."],
      ["o", "Tell her to stop panicking because there is nothing wrong with her at all", "Telling someone to stop rarely works."],
      ["h", "Crowd round and call others to watch", "More people make the panic worse."],
    ]),
  ]),
  s("wy-c008", "crisis", "Sexual assault disclosure", "ptsd", "trauma", 3, "UMS", "Respond to a recent assault disclosure", "Student, 20, assaulted last night", [
    b("She says she does not know what to do.", [
      ["o", "Tell her she must report to the police right now or the case will be weak", "Pressure removes her control. Reporting is her choice, though you can explain the options."],
      ["b", "Believe her, check safety and explain her options", "She chooses a medical exam and support now. Control is restored to her."],
      ["h", "Ask what she was wearing and whether she had been drinking", "Victim-blaming deepens trauma and silences her."],
    ]),
  ]),
  s("wy-c009", "crisis", "Job loss crisis", "depression", "depression", 2, "US", "Support someone after sudden job loss", "Man, 45, laid off today", [
    b("“How will I face my family? I've failed them.”", [
      ["h", "Tell him to get a new job quickly and stop worrying", "Dismissive advice leaves him alone with shame."],
      ["b", "Acknowledge the shock, ask about suicidal thoughts, and plan the next practical steps together", "He feels less alone and has a plan for tonight and tomorrow."],
      ["o", "Give him a list of job portals and recruitment agencies in the city, so he can start applying tonight", "Useful later, but his emotional state comes first."],
    ]),
  ]),
  s("wy-c010", "crisis", "Domestic violence crisis", "ptsd", "trauma", 3, "UMS", "Plan immediate safety", "Woman, 28, calls after being beaten", [
    b("She is hiding in the bathroom and her husband is outside.", [
      ["b", "Ask if she can call 112, stay on the line, and help her plan to get to safety", "Police arrive. Immediate safety comes first."],
      ["o", "Tell her to talk to him calmly when he settles, and try to sort it out tomorrow", "She may be hurt again tonight."],
      ["h", "Ask what she did to make him angry", "Blames her and wastes precious time."],
    ]),
  ]),
  s("wy-c011", "crisis", "Child after a disaster", "child", "child", 2, "US", "Support children after a disaster", "Children in a relief camp after an earthquake", [
    b("A volunteer asks how to help the children.", [
      ["o", "Ask the children to describe what they saw so they get it out, even if they cry", "Some children cry and cannot sleep that night. Pushing children to retell a disaster can upset them more than it helps."],
      ["b", "Keep routines and play, and keep them with family", "Most children settle with routine and play."],
      ["h", "Keep children away from adults to protect them", "The children become clingy and frightened. Being kept apart from their family adds to their distress."],
    ]),
  ]),
  s("wy-c012", "crisis", "Hostage of anger at a clinic desk", "personality", "personality", 2, "US", "De-escalate an angry relative", "Man, 50, shouting at reception", [
    b("His mother has waited three hours.", [
      ["h", "Tell him to wait like everyone else or leave", "His anger rises and the situation may turn violent."],
      ["b", "Acknowledge the long wait, explain what you can do now, and offer a realistic time", "He calms. Feeling heard reduces anger."],
      ["o", "Call security straight away to remove him from the waiting area before it gets worse", "May be needed later, but talking first often works."],
    ]),
  ]),
  s("wy-c013", "crisis", "Crisis in a teen after cyberbullying", "child", "child", 3, "UMS", "Respond to online humiliation", "Girl, 15, whose photo was shared", [
    b("“Everyone has seen it. I can't go back to school.”", [
      ["b", "Ask about suicide, and report the image with her parents", "The image is removed and the school acts. She feels protected."],
      ["o", "Tell her to delete her accounts and stay off social media for a while until it blows over", "Helps a little, but does not stop the abuse or check her safety."],
      ["h", "Ask why she sent the photo in the first place", "Blaming her raises shame and suicide risk."],
    ]),
  ]),
  s("wy-c014", "crisis", "Grief after miscarriage", "depression", "lifespan", 2, "US", "Acknowledge pregnancy loss", "Woman, 29, after a miscarriage", [
    b("Her family says, 'It's okay, you can try again.'", [
      ["o", "Agree with the family that she is young and there will be another chance soon", "She stops talking about the baby. Rushing to 'try again' minimises a real loss and leaves her grieving alone."],
      ["h", "Tell her it was probably something she did", "She blames herself for months. Most miscarriages have no cause the mother could control; this is cruel and false."],
      ["b", "Acknowledge it as a real loss and give her space to grieve", "She cries and feels understood."],
    ]),
  ]),
  s("wy-c015", "crisis", "Crisis after a road accident", "ptsd", "trauma", 2, "US", "Help someone at the scene", "Driver, 30, after hitting a pedestrian", [
    b("He is in shock and keeps saying, 'I killed him.'", [
      ["b", "Make sure he is safe, stay with him, and help him get medical and legal help", "He calms enough to speak to the police."],
      ["h", "Tell him he should have been more careful", "He breaks down further. Blame at the scene adds shame on top of shock and does nothing for safety."],
      ["o", "Tell him it was not his fault without knowing what happened, to make him feel better", "Kind, but you do not know that; reassure about the present."],
    ]),
  ]),
  s("wy-c016", "crisis", "Pandemic grief", "depression", "depression", 3, "US", "Support grief without rituals", "Man, 40, who could not attend his father's cremation", [
    b("“I couldn't even see his face.”", [
      ["h", "Tell him it does not matter now", "Dismisses a real loss of ritual."],
      ["o", "Tell him many people went through the same thing, so he should not feel too bad", "True, but it does not ease his grief."],
      ["b", "Help him find his own way to say goodbye", "He plans a small prayer at home with family."],
    ]),
  ]),
  s("wy-c017", "crisis", "Missing child", "child", "child", 3, "US", "Support parents of a missing child", "Parents, child missing since morning", [
    b("The mother is panicking and blaming herself.", [
      ["b", "Help them with the police report and calls", "They feel less helpless. Practical action reduces panic."],
      ["o", "Tell her to calm down and wait, because most missing children come home by evening", "May be false hope; action matters now."],
      ["h", "Ask why she was not watching", "Blame worsens panic and guilt."],
    ]),
  ]),
  s("wy-c018", "crisis", "Crisis in psychosis at home", "schizophrenia", "psychosis", 3, "UMS", "Guide a family on the phone", "Mother calls: her son is breaking things", [
    b("He is shouting that the family is poisoning him.", [
      ["o", "Tell her to lock him in his room until he calms down and then call you back", "Locking in can escalate danger."],
      ["h", "Tell her to argue with him until he admits he is ill", "He becomes more frightened and angry. Arguing with a delusion during a crisis raises anger and risk."],
      ["b", "Advise her to stay safe, not argue, and call for help", "Police and the team bring him in safely."],
    ]),
  ]),
  s("wy-c019", "crisis", "Crisis after a terrorist attack", "ptsd", "trauma", 3, "UMS", "Support staff after a mass casualty event", "Hospital staff after a blast", [
    b("Nurses are exhausted and tearful.", [
      ["b", "Offer rest, peer support and later check-ins", "Most recover. A few are referred for help."],
      ["h", "Tell them they are professionals and should cope", "Two nurses later go off sick. Telling staff to cope ignores real distress and stops them asking for help."],
      ["o", "Hold a compulsory detailed debriefing session the same night for all staff on duty", "Some staff relive the night and sleep worse. Forced debriefing on the same night can harm rather than help."],
    ]),
  ]),
  s("wy-c020", "crisis", "Crisis in a lift", "anxiety", "anxiety", 1, "CUS", "Calm someone trapped", "Man, 40, trapped in a lift with you", [
    b("He is breathing fast and pressing the alarm repeatedly.", [
      ["o", "Tell him to stop pressing the alarm because he is making it worse for both of you", "He presses harder and starts shouting. Being told off adds to his distress in a frightening place."],
      ["b", "Speak calmly, explain help is coming, and breathe slowly with him", "He calms enough to wait for rescue. Your calm voice and slow breathing steady his body and his fear."],
      ["h", "Panic along with him", "His panic feeds yours and the lift feels smaller. Staying calm is the most useful thing you can offer."],
    ]),
  ]),
  s("wy-c021", "crisis", "Elderly man after his wife's death", "depression", "lifespan", 3, "UMS", "Assess risk in a bereaved older man", "Mr Iyer, 80, wife died last week", [
    b("He says, “Without her I'm nothing.”", [
      ["h", "Tell him he has his children and should be grateful", "He goes quiet and feels ungrateful for grieving. Pointing to his children dismisses the loss of his wife."],
      ["o", "Suggest he move in with his son, so he is not alone in the house any more", "May help later, but you have not assessed risk."],
      ["b", "Acknowledge his grief and gently ask about thoughts of dying", "He has thought of joining her. You plan support."],
    ]),
  ]),
  s("wy-c022", "crisis", "Hospital ward fire evacuation", "dementia", "neurocognitive", 3, "US", "Keep vulnerable patients safe in a crisis", "Psychogeriatric ward, fire alarm", [
    b("A confused patient refuses to leave.", [
      ["b", "Use simple calm words, guide him by the hand, and ask staff to help", "He follows you out calmly. Simple words and a guiding hand work better than orders for a confused person."],
      ["o", "Leave him for now and come back once the others are out of the building", "The smoke spreads before anyone returns for him. Leaving a confused patient behind in a fire may be too late."],
      ["h", "Drag him out roughly", "He falls and bruises his arm, more frightened than before. Force can injure and terrify a confused person."],
    ]),
  ]),
  s("wy-c023", "crisis", "Student in crisis after a breakup", "suicide", "suicide", 2, "CUS", "Respond to a crisis text", "Student texts you, 'I can't take this'", [
    b("It is late at night.", [
      ["o", "Reply that you will talk tomorrow in office hours, since it is late and you are off duty", "She does not make it through the night safely. A crisis message cannot wait for office hours; it may be too late."],
      ["h", "Ignore it; it is not a working hour", "You read it in the morning, too late to help. Late messages can be the only warning of a crisis."],
      ["b", "Reply to check her safety and share Tele-MANAS 14416", "She calls the helpline and is safe."],
    ]),
  ]),
  s("wy-c024", "crisis", "Crisis in a refugee camp", "ptsd", "trauma", 3, "US", "Prioritise basic needs", "Refugee family, just arrived", [
    b("They have not eaten in two days.", [
      ["b", "Help them get food, shelter and medical care first", "They settle. Basic needs come before therapy."],
      ["h", "Start trauma therapy straight away", "Therapy without safety and food does not help."],
      ["o", "Give them a leaflet on trauma symptoms in their language, so they know what to expect", "She takes the leaflet but stays hungry and unsafe. Information is useful later, not before food and shelter."],
    ]),
  ]),
  s("wy-c025", "crisis", "Crisis in a family after a suicide", "suicide", "suicide", 3, "UMS", "Support children after a parent's suicide", "Family, father died by suicide yesterday", [
    b("The mother asks what to tell her seven-year-old.", [
      ["h", "Tell her to say he went on a long journey", "Children often find out; lies break trust."],
      ["o", "Tell her to avoid the topic entirely for now, until the child is much older", "Children notice silence and imagine worse."],
      ["b", "Help her tell the child simply and honestly", "The child asks questions and feels safe."],
    ]),
  ]),
  s("wy-c026", "crisis", "Crisis in a patient during a session", "ptsd", "trauma", 3, "UMS", "Ground a client having a flashback", "Client, 30, flashback in session", [
    b("She is staring, breathing fast and says, 'He's here.'", [
      ["o", "Ask her to describe exactly what she is seeing so that you can understand the memory", "She sinks deeper into the memory and becomes more distressed. Asking for detail during a flashback deepens it."],
      ["b", "Calmly remind her where she is and ground her", "She comes back to the present."],
      ["h", "Leave the room to get help", "She is left alone in distress."],
    ]),
  ]),
  s("wy-c027", "crisis", "Crisis in exam hall", "anxiety", "anxiety", 1, "CUS", "Help a student in panic before an exam", "Student, 18, shaking at the exam hall door", [
    b("“I can't breathe. I'm going to fail.”", [
      ["b", "Help her slow her breathing and remind her the feeling will pass", "She calms and goes in to write the exam. Slow breathing and a reminder that panic passes help most people."],
      ["h", "Tell her she is overreacting", "She panics more and runs to the toilet. Being called dramatic increases panic and shame."],
      ["o", "Tell her to skip the exam and take it next year, since she is clearly not ready today", "Avoidance makes future panic worse."],
    ]),
  ]),
  s("wy-c028", "crisis", "Crisis in a workplace after a colleague's death", "depression", "depression", 2, "US", "Support a workplace after a death", "Office, colleague died suddenly", [
    b("The manager wants everyone back to work in an hour.", [
      ["o", "Agree, since keeping busy is the best way to cope and work has to go on", "Some may need time and support."],
      ["b", "Suggest a short gathering and some flexibility", "Staff feel cared for and return to work when ready. A short pause and flexibility help most people grieve."],
      ["h", "Insist everyone takes a week off", "Not practical and not wanted by all."],
    ]),
  ]),
  s("wy-c029", "crisis", "Crisis on social media", "suicide", "suicide", 2, "CUS", "Act on a live-streamed threat", "You see a live video of a stranger threatening suicide", [
    b("You can see the city in the background.", [
      ["h", "Comment that they are seeking attention", "The person sees the comment and the stream ends suddenly. Mocking someone in crisis may push them toward harm."],
      ["b", "Report the video to the platform and contact local police with details", "Police reach the person in time."],
      ["o", "Comment telling them to call a helpline, and hope that someone near them sees it", "Helpful, but direct action is better."],
    ]),
  ]),
  s("wy-c030", "crisis", "Crisis in a person with dementia", "dementia", "neurocognitive", 2, "US", "Calm a person with dementia who wants to go home", "Mrs Shah, 82, in a care home, wants to 'go home'", [
    b("She is upset and trying to leave.", [
      ["o", "Tell her firmly that she lives here now and her old home has been sold", "She becomes tearful and more determined to leave. Hard facts about loss upset a person with dementia more."],
      ["h", "Lock her in her room", "She bangs on the door and becomes frightened. Locking someone in restricts and frightens her."],
      ["b", "Ask about her home, comfort her, and gently redirect to an activity", "She talks about her garden and calms."],
    ]),
  ]),
  s("wy-c031", "crisis", "Acute grief in a child", "child", "child", 2, "US", "Support a grieving child", "Boy, 9, whose grandfather died", [
    b("He is not crying and is playing as usual.", [
      ["b", "Explain that children often grieve in bursts and keep the door open to talk", "Parents understand his behaviour."],
      ["o", "Tell the parents he is fine and does not need anything, since he is playing normally", "Months later he has nightmares no one links to the death. Assuming he is fine may miss grief later."],
      ["h", "Tell him he must cry to show respect", "He cries to please you but feels confused. Forcing feelings makes children hide their real grief."],
    ]),
  ]),
  s("wy-c032", "crisis", "Crisis in a victim of fraud", "depression", "depression", 2, "US", "Support someone after financial fraud", "Retired teacher, 70, lost savings to a scam", [
    b("“I'm so stupid. I can't tell my family.”", [
      ["h", "Agree that he should have known better", "He feels more foolish and thinks of ending his life. Agreeing he was stupid adds shame and suicide risk."],
      ["b", "Ask about suicide and help him report it", "He reports to the cyber crime helpline 1930 and tells his son."],
      ["o", "Tell him to keep it secret so he does not feel embarrassed in front of his family", "He hides the loss and feels more alone. Keeping such a secret increases isolation and risk."],
    ]),
  ]),
  s("wy-c033", "crisis", "Crisis in a teenager after a family fight", "child", "child", 2, "US", "Help a teen who ran away", "Boy, 15, found at a bus stand", [
    b("He ran away after a fight with his father.", [
      ["o", "Send him straight back home with a warning that he must not do this again", "If home is unsafe, he may run again."],
      ["b", "Keep him safe and ask about home", "The fight is resolved with support."],
      ["h", "Leave him at the bus stand", "A stranger offers him a ride and he goes. Leaving a runaway boy at a bus stand exposes him to danger."],
    ]),
  ]),
  s("wy-c034", "crisis", "Crisis in a doctor after a patient death", "depression", "depression", 3, "US", "Support a clinician after an adverse event", "Junior doctor, 26, after a patient died", [
    b("She blames herself and has not slept.", [
      ["b", "Listen, ask about risk, and offer peer support", "She feels supported and recovers."],
      ["h", "Tell her doctors must be tough", "She hides her distress and later burns out. Telling doctors to be tough silences distress."],
      ["o", "Tell her it was not her fault before reviewing the facts, so she feels better today", "Kind, but may not be helpful long-term."],
    ]),
  ]),
  s("wy-c035", "crisis", "Crisis in a farmer after crop loss", "suicide", "suicide", 3, "UMS", "Respond to rural distress", "Farmer, 50, crop destroyed by hail", [
    b("He has stopped eating and the pesticide is in the house.", [
      ["o", "Tell him to apply for government compensation forms first and come back next week", "He fills in forms but the pesticide is still in reach. Practical help matters, but risk comes first."],
      ["b", "Ask about suicide and lock away the pesticide", "He admits thoughts of suicide. Means are removed."],
      ["h", "Tell him farming is risky anyway", "He feels unheard and leaves. Brushing off his loss is dismissive at a dangerous moment."],
    ]),
  ]),
  s("wy-c036", "crisis", "Crisis in a new mother at night", "depression", "lifespan", 3, "UMS", "Respond to a mother overwhelmed at night", "New mother calls at 3am", [
    b("“The baby won't stop crying. I'm going to throw him.”", [
      ["h", "Tell her to try harder", "She is still holding a crying baby she has said she might throw. Telling her to try harder puts the baby at risk."],
      ["o", "Tell her to give the baby to her husband and go to sleep, and call you tomorrow", "Better, but check safety first."],
      ["b", "Ask her to put the baby in the cot and step away", "The baby is safe and help arrives."],
    ]),
  ]),
  s("wy-c037", "crisis", "Crisis in a person with intellectual disability", "child", "child", 3, "US", "Communicate clearly in a crisis", "Man, 25, intellectual disability, lost in a station", [
    b("He is crying and cannot say his address.", [
      ["b", "Use simple words, check his ID or phone for contacts, and stay with him", "His sister is called and comes to pick him up."],
      ["o", "Ask him complex questions about where he lives and how he got here, slowly and clearly", "He cannot answer and becomes more upset."],
      ["h", "Leave him with a stranger", "A stranger offers to take him home and he goes. Leaving him with a stranger exposes him to exploitation."],
    ]),
  ]),
  s("wy-c038", "crisis", "Crisis in a transgender person after rejection", "suicide", "suicide", 3, "UMS", "Support with affirmation", "Trans woman, 22, thrown out of home", [
    b("She has nowhere to sleep tonight.", [
      ["o", "Suggest she go back home and apologise to her family, since they might accept her in time", "Her family attacks her again. Sending her back may expose her to harm."],
      ["h", "Tell her to dress as a man to be accepted", "She feels rejected by you too. Telling her to hide who she is is rejecting and harmful."],
      ["b", "Help her find safe shelter or a community organisation tonight, and check suicide risk", "She stays at a shelter and connects with support."],
    ]),
  ]),
  s("wy-c039", "crisis", "Crisis after a dog bite in a child", "child", "child", 1, "CUS", "Support a scared child", "Girl, 6, bitten by a street dog", [
    b("She is crying and refusing the injection.", [
      ["b", "Comfort her, explain simply, and let a parent hold her during the injection", "She is calmer and gets the vaccine."],
      ["h", "Tell her she will die if she does not have it", "She screams and refuses to let anyone near her. Threats terrify a child and make care harder."],
      ["o", "Skip the injection today because she is upset, and ask the parents to bring her tomorrow", "Rabies vaccine timing matters."],
    ]),
  ]),
  s("wy-c040", "crisis", "Crisis after a robbery", "ptsd", "trauma", 2, "US", "Support after an acute traumatic event", "Shopkeeper, 45, robbed at knifepoint", [
    b("He is shaking and cannot sleep.", [
      ["o", "Tell him he must have PTSD and needs treatment right away, so it does not become worse", "He is told he has a disorder and starts to fear he is broken. Diagnosing PTSD days after an event is too early."],
      ["b", "Normalise his reaction, help with practical steps, and offer follow-up", "Most recover; he knows where to come if not."],
      ["h", "Tell him to forget it", "He goes home angry and sleepless. Telling him to forget it is dismissive."],
    ]),
  ]),
  s("wy-c041", "crisis", "Crisis in a worker after a factory accident", "ptsd", "trauma", 3, "US", "Support survivors of a workplace accident", "Worker, 30, saw a colleague crushed", [
    b("He keeps seeing the scene.", [
      ["h", "Tell him to toughen up", "He keeps quiet and starts drinking to sleep. Dismissing real distress pushes people to cope alone."],
      ["b", "Offer support and screen again in a few weeks", "He improves; follow-up catches any PTSD."],
      ["o", "Ask him to describe the accident in full detail now, so he can process it properly", "He relives the scene and cannot sleep that night. Pushing for full detail early may overwhelm him."],
    ]),
  ]),
  s("wy-c042", "crisis", "Crisis in an older woman after a fall", "dementia", "lifespan", 2, "US", "Address fear after a fall", "Mrs Rao, 78, afraid to walk", [
    b("She refuses to get out of bed after a fall.", [
      ["o", "Let her stay in bed until she feels ready, however long that takes", "Immobility weakens her and raises risks."],
      ["b", "Acknowledge her fear and plan gradual walking", "She walks again with support and regains her confidence. Fear after a fall is real and needs a plan."],
      ["h", "Tell her she is being silly", "She feels ashamed and stays in bed. Calling her fear silly dismisses it and slows recovery."],
    ]),
  ]),
  s("wy-c043", "crisis", "Crisis in a student with ragging", "child", "child", 3, "UMS", "Act on ragging", "First-year student, 18, in a hostel", [
    b("He says seniors beat him and he wants to leave college.", [
      ["b", "Check his safety, report to the anti-ragging committee, and support him", "Seniors are disciplined; he stays."],
      ["h", "Tell him ragging is a tradition", "Harmful; ragging is a punishable offence."],
      ["o", "Tell him to avoid the seniors and stay in his room, so that it stops on its own", "The beatings continue. Hiding in his room does not stop the abuse; it needs reporting."],
    ]),
  ]),
  s("wy-c044", "crisis", "Crisis in a person with OCD during a pandemic", "ocd", "ocd", 3, "US", "Support OCD under real threats", "Woman, 30, with contamination OCD", [
    b("She washes for six hours a day since news of an outbreak.", [
      ["o", "Tell her to wash even more to be safe, since the outbreak is real and hygiene matters", "Her washing climbs to eight hours a day. Encouraging more washing feeds the OCD."],
      ["h", "Mock her fear", "She hides her rituals from you. Mocking her fear shames her and breaks trust."],
      ["b", "Agree on reasonable hygiene limits based on public health advice, and continue ERP", "She follows guidance without rituals."],
    ]),
  ]),
  s("wy-c045", "crisis", "Crisis in a mother of a child with cancer", "depression", "depression", 3, "US", "Support a carer in crisis", "Mother, 35, child newly diagnosed with leukaemia", [
    b("“I can't breathe. I can't do this.”", [
      ["b", "Stay with her, help her breathe, and connect her with the ward's support services", "She feels supported and knows where to turn. Staying with her and linking her to the ward team helps."],
      ["h", "Tell her to be strong for her child", "She stops saying how she feels. Telling her to be strong silences her."],
      ["o", "Give her information about the disease in detail, so she understands what lies ahead", "She feels flooded and cannot take any of it in. Too much detail in the first hour is too much too soon."],
    ]),
  ]),
  s("wy-c046", "crisis", "Crisis after a stillbirth", "depression", "lifespan", 3, "US", "Support parents after stillbirth", "Couple, baby born still", [
    b("They ask whether they should see the baby.", [
      ["o", "Tell them not to, since it will be too upsetting and they should try to move on", "Many parents value the chance to see and hold their baby."],
      ["b", "Offer the choice gently, with support, and respect their decision", "They hold the baby and later say it helped."],
      ["h", "Make the decision for them", "They later feel robbed of a choice that mattered. Deciding for them takes away their choice."],
    ]),
  ]),
  s("wy-c047", "crisis", "Crisis in a person with psychosis during a festival", "schizophrenia", "psychosis", 3, "US", "Help in a crowded setting", "Man, 30, agitated at a festival crowd", [
    b("He is shouting that people are after him.", [
      ["h", "Shout at him to stop", "He becomes more frightened and pushes people away. Shouting escalates fear in psychosis."],
      ["b", "Help him to a quieter place, speak calmly, and contact his family or medical help", "He calms and is taken home by his brother. A quiet place and calm words reduce fear in crowds."],
      ["o", "Ignore him and walk away, since festivals are noisy and people shout all the time", "He may get hurt or hurt others."],
    ]),
  ]),
  s("wy-c048", "crisis", "Crisis in a teen after a friend's suicide", "suicide", "suicide", 3, "UMS", "Screen friends after a suicide", "Boy, 16, best friend died by suicide", [
    b("He says, “I should have known.”", [
      ["b", "Ask about his own suicidal thoughts", "He has had thoughts and gets help."],
      ["o", "Tell him nobody could have known, so he should not blame himself at all", "Kind, but does not check his risk."],
      ["h", "Tell him not to talk about it with others", "He stops talking to anyone about his friend. Telling him to stay quiet isolates him at a risky time."],
    ]),
  ]),
  s("wy-c049", "crisis", "Crisis in a person who heard bad news by phone", "depression", "depression", 1, "CUS", "Give basic support", "Woman, 40, just heard her mother died", [
    b("She is in shock in your waiting room.", [
      ["o", "Ask her to fill in a form while she waits for her appointment", "She sits shaking with a clipboard. Paperwork ignores her state and her need for comfort."],
      ["b", "Offer a quiet place and stay with her", "She feels cared for until her husband comes. Simple presence is what acute grief needs."],
      ["h", "Ask her to leave since she is upset", "She leaves alone in shock. Sending someone away because they are upset abandons her."],
    ]),
  ]),
  s("wy-c050", "crisis", "Crisis in a person in police custody", "schizophrenia", "ethics-law", 3, "MDS", "Know police duties for a person with mental illness", "Man, 35, with psychosis, held by police", [
    b("The police plan to keep him in the lock-up overnight.", [
      ["h", "Agree; it is safer for everyone", "MHCA bars keeping such a person in a lock-up."],
      ["b", "Remind them he must go to a hospital within 24 hours", "He is taken to hospital and assessed."],
      ["o", "Suggest the police call his family to collect him in the morning instead", "Delay and lock-up are not allowed."],
    ]),
  ]),
  s("wy-c051", "crisis", "Crisis after an acid attack", "ptsd", "trauma", 4, "UMS", "Support a survivor of disfiguring violence", "Woman, 24, after an acid attack", [
    b("She refuses to look in a mirror and says her life is over.", [
      ["o", "Tell her she is still beautiful inside and that what matters is her character", "She nods but feels unheard. Kind words that skip her real loss still dismiss it."],
      ["b", "Ask about suicide and connect her with survivors", "She meets a survivor and begins to hope."],
      ["h", "Avoid talking about her face", "Avoidance increases isolation."],
    ]),
  ]),
  s("wy-c052", "crisis", "Crisis in a boy after a parent's arrest", "child", "child", 3, "US", "Support a child after a parent's arrest", "Boy, 10, saw his father arrested", [
    b("He is scared and asks if his father is a bad man.", [
      ["b", "Answer simply and honestly, reassure him it is not his fault, and keep routines", "He feels safer and asks fewer frightened questions. Honest, simple answers and routine help children cope."],
      ["h", "Tell him yes, his father is bad", "Harms his self-image and attachment."],
      ["o", "Tell him his father is on a trip, so he does not have to worry about the arrest", "Later he finds out and stops trusting the adults around him. Lies break trust later."],
    ]),
  ]),
  s("wy-c053", "crisis", "Crisis in a person who was outed", "suicide", "suicide", 3, "UMS", "Respond to forced disclosure", "Man, 26, outed as gay at work", [
    b("He says everyone is laughing at him and he wants to disappear.", [
      ["o", "Tell him to ignore the gossip because it will die down in a week or two", "He feels unheard and thinks of hurting himself. Minimising his crisis misses the risk."],
      ["h", "Tell him it was bound to happen", "He feels blamed for being himself. Saying it was bound to happen is dismissive."],
      ["b", "Ask about suicide and affirm him", "He feels supported and is safe."],
    ]),
  ]),
  s("wy-c054", "crisis", "Crisis in a person who lost a pet", "depression", "depression", 1, "CUS", "Respect grief for a pet", "Woman, 30, whose dog died", [
    b("She is crying and embarrassed.", [
      ["b", "Acknowledge her loss as real", "She feels understood and less embarrassed. Grief for a pet is real grief."],
      ["h", "Tell her it was only a dog", "She cries more and feels foolish. Calling it only a dog is hurtful."],
      ["o", "Tell her to get a new puppy soon, since that usually helps people move on quickly", "She feels pushed to replace a friend she has just lost. A new puppy may not help now."],
    ]),
  ]),
  s("wy-c055", "crisis", "Crisis in a student with a panic attack in class", "anxiety", "anxiety", 1, "CUS", "Respond as a teacher", "Student, 14, panicking in class", [
    b("She is crying and breathing fast.", [
      ["o", "Ask the class to watch quietly so she knows everyone is there for her", "She feels watched and her panic grows. An audience embarrasses her and worsens panic."],
      ["b", "Take her somewhere quiet, breathe with her, and let her rest", "She calms within minutes in a quiet room. Removing her from attention and breathing slowly works."],
      ["h", "Scold her for disrupting class", "She feels ashamed and fears it will happen again. Scolding shames her and makes panic worse."],
    ]),
  ]),
  s("wy-c056", "crisis", "Crisis in a person whose house burned", "ptsd", "trauma", 2, "US", "Prioritise practical help", "Family whose home burned", [
    b("They are standing outside with nothing.", [
      ["h", "Ask them to fill in a stress questionnaire", "They stand outside confused by a form. A questionnaire ignores urgent needs."],
      ["b", "Help them find shelter, clothes and food, and stay with them", "They feel supported and safe for the night. Shelter, food and company come first."],
      ["o", "Ask them how they feel about losing their home, so they can talk it through right now", "They struggle to answer while standing in the cold. Feelings can wait for safety."],
    ]),
  ]),
  s("wy-c057", "crisis", "Crisis in a person with a panic attack on a plane", "anxiety", "anxiety", 2, "US", "Help a fellow passenger", "Passenger, 35, panicking on take-off", [
    b("She grips the seat and says she will die.", [
      ["b", "Speak calmly, breathe slowly with her, and tell the crew", "She settles and the crew keep an eye on her. Calm breathing and help from the crew work well."],
      ["h", "Tell her planes crash often", "She panics more and tries to unbuckle. Frightening facts increase panic."],
      ["o", "Ignore her and put on your headphones, since the crew will handle it if needed", "She panics alone and the crew notice late. Ignoring her leaves her feeling alone."],
    ]),
  ]),
  s("wy-c058", "crisis", "Crisis in a person after a medical diagnosis", "depression", "depression", 3, "US", "Support after bad news", "Man, 50, just told he has cancer", [
    b("He says, “I'll just end it before it gets bad.”", [
      ["o", "Tell him not to think like that because cancer is very treatable nowadays", "He goes home with his plan unspoken. Reassurance about treatment does not check risk."],
      ["b", "Ask about suicide and link him with support", "He has a plan; support reduces risk."],
      ["h", "Change the subject to treatment details", "He feels his despair is not welcome. Skipping to treatment details ignores his despair."],
    ]),
  ]),
  s("wy-c059", "crisis", "Crisis in a person with substance use after a death", "substance", "substance", 3, "UMS", "Support grief with relapse risk", "Man, 35, in recovery, whose brother died", [
    b("He says he wants to drink to numb it.", [
      ["b", "Plan support for the next days with his group", "He stays sober with daily support through the funeral. Planning ahead for a known trigger prevents relapse."],
      ["h", "Tell him one drink is fine at a time like this", "He drinks for three days. Saying one drink is fine risks relapse in early recovery."],
      ["o", "Tell him to be strong and not drink, and leave it to him to manage the next few days", "He drinks that night. Willpower alone, without support, often fails under grief."],
    ]),
  ]),
  s("wy-c060", "crisis", "Crisis after a lynching threat", "ptsd", "trauma", 4, "US", "Respond to community violence", "Man, 30, threatened by a mob", [
    b("He is hiding and terrified for his family.", [
      ["o", "Tell him to move to another town immediately without telling anyone where he is going", "He is followed and attacked on the road. Leaving suddenly without support is unsafe."],
      ["h", "Tell him to confront the mob", "He is badly beaten. Confronting a mob is dangerous."],
      ["b", "Get him safe and contact the police", "Police protect the family and a case is registered. Safety, police and legal help come first."],
    ]),
  ]),
  s("wy-c061", "crisis", "Full case: disaster survivor weeks later", "ptsd", "trauma", 5, "UMS", "Move from first aid to treatment when distress persists", "Woman, 38, six weeks after a cyclone in Odisha", [
    b("She still has nightmares, avoids the coast and cannot work.", [
      ["o", "Tell her it is normal after a disaster and will pass if she gives it more time", "Six weeks of impairment suggests PTSD."],
      ["b", "Assess for PTSD and depression, and offer trauma-focused therapy", "She has PTSD and starts treatment."],
      ["h", "Tell her to move on", "She feels her suffering is dismissed and stops seeking help. Telling her to move on misses PTSD."],
    ]),
    b("She asks whether talking about it will make it worse.", [
      ["b", "Explain that therapy is paced to her readiness", "She agrees to start slowly and feels in control. Pacing helps people stay in trauma therapy."],
      ["h", "Tell her she must talk about everything today", "She is overwhelmed and drops out. Pushing for everything at once is too fast."],
      ["o", "Tell her to avoid thinking about it at all, since remembering only upsets her more", "Her nightmares continue for months. Avoiding memories keeps PTSD going."],
    ], "She has agreed to treatment."),
  ]),
];
