import type { Scenario } from "../scenarios";
import { b, s } from "./make";

/** Risk: suicide, self-harm, violence, safeguarding and risk formulation. */
export const RISK: Scenario[] = [
  s("wy-r001", "risk", "Suicide risk", "suicide", "suicide", 1, "CUMS", "Ask about suicide in plain words", "Aarav, 19, engineering student", [
    b("“I just feel like a burden on my parents. They spent so much on my coaching.”", [
      ["b", "“When you feel like a burden, do you ever think about ending your life?”", "He says yes, at night. Now you know the risk and can act. Asking plainly does not plant the idea; it opens the door."],
      ["o", "“Your parents love you and they would be heartbroken to hear you say this. I'm sure they don't see you as a burden at all.”", "He nods and goes quiet. Kind, but you never found out whether he is thinking of suicide."],
      ["h", "“Let's talk about your study plan for the next attempt.”", "He follows your lead. Feeling like a burden is a known suicide warning sign, and you stepped past it."],
    ]),
  ]),
  s("wy-r002", "risk", "Suicide risk", "suicide", "suicide", 2, "CUMS", "Move from ideation to plan and means", "Meena, 34, teacher", [
    b("“Yes, I've thought about dying. Most nights.”", [
      ["h", "“Thank you for sharing. Let's book you for next week and talk more then.”", "A week passes with no idea of her plan or means. Ideation needs the next questions now, not next week."],
      ["b", "“Have you thought about how, and do you have the means?”", "She mentions her mother's sleeping tablets. Plan and means change the urgency; you can now make a safety plan."],
      ["o", "“How long have you felt this way, and has anything happened recently at home or at work that made it worse?”", "Useful history, but you still do not know whether she has a plan or access to means, which drive today's risk."],
    ]),
  ]),
  s("wy-r003", "risk", "Means restriction", "suicide", "suicide", 2, "UMS", "Use means restriction in a safety plan", "Gopal, 52, farmer in Marathwada", [
    b("“The pesticide is in the shed. I need it for the crop.”", [
      ["b", "Agree that his son keeps the shed key for now", "The pesticide stays on the farm but out of his hands during the crisis. Reducing access to lethal means is one of the most effective suicide prevention steps."],
      ["h", "Tell him he must throw all the pesticide away or you will not see him again", "He refuses and stops coming. An ultimatum that ignores his livelihood loses the relationship and changes nothing."],
      ["o", "Note in the file that the pesticide is stored in the shed, so that the team knows about it if things get worse later", "Documented, but the risk is untouched. Recording a hazard is not the same as reducing it."],
    ]),
  ]),
  s("wy-r004", "risk", "Imminent risk", "suicide", "suicide", 3, "UMS", "Act when risk is imminent", "Shreya, 22, college student", [
    b("“I've written the letters. Tonight I'll take all the tablets. Please don't tell anyone.”", [
      ["o", "Ask her to promise that she will call you or the helpline before she does anything tonight, and give her your number", "She agrees, but a promise is not a safety measure. A written plan for tonight needs more than her word."],
      ["h", "Keep her confidence so she keeps trusting you", "She leaves alone with the tablets. Confidentiality ends where there is serious risk to life."],
      ["b", "Say you can't keep this secret, stay with her, and call in help now", "She is angry, then relieved. The team arranges an emergency psychiatric review and someone stays with her. Imminent risk overrides confidentiality."],
    ]),
  ]),
  s("wy-r005", "risk", "Safety planning", "suicide", "suicide", 2, "UMS", "Build a collaborative safety plan", "Kunal, 28, call centre worker", [
    b("He has passive suicidal thoughts, no plan, and agrees to a plan.", [
      ["b", "Write a safety plan with him in his own words", "He leaves with a plan he wrote in his own words. Collaborative safety plans reduce suicidal behaviour more than lectures."],
      ["h", "Ask him to sign a no-suicide contract", "He signs to please you. No-suicide contracts have no evidence and can give false reassurance."],
      ["o", "Give him a printed list of helplines, including Tele-MANAS, and ask him to keep it in his wallet at all times", "Useful, but generic. A plan built with his own triggers and supports is more likely to be used."],
    ]),
  ]),
  s("wy-r006", "risk", "Self-harm assessment", "suicide", "suicide", 2, "CUMS", "Assess self-harm without judgement", "Tanya, 16", [
    b("“I cut because it makes the feeling stop. I don't want to die.”", [
      ["h", "“If you don't want to die, why do it? It's just attention-seeking.”", "She stops talking. Calling it attention-seeking shames her and hides future risk."],
      ["o", "“You must stop cutting right now. It's dangerous, it leaves scars, and it will upset your parents if they find out.”", "She agrees but feels unheard. Demanding she stop without other ways to cope rarely works."],
      ["b", "“It sounds like cutting helps with big feelings. What happens just before?”", "She describes fights at home. You learn the trigger and can build other coping skills, while still screening suicide risk."],
    ]),
  ]),
  s("wy-r007", "risk", "Risk after discharge", "suicide", "suicide", 3, "MDS", "Follow up early after discharge", "Mr Iyer, 45, discharged after an overdose", [
    b("He was discharged four days ago and has not answered calls.", [
      ["b", "Keep trying today and call his listed contact", "His brother finds him low but safe and brings him in. The first weeks after discharge carry the highest risk."],
      ["o", "Send him a friendly text with a new appointment date, so he does not feel chased and can come back when he is ready", "He may not read it. A text alone is weak follow-up in the highest-risk period."],
      ["h", "Close the case since he has stopped engaging", "Closing a case at the riskiest time abandons him. Non-engagement after discharge is a warning sign, not a reason to stop."],
    ]),
  ]),
  s("wy-r008", "risk", "Violence risk", "suicide", "suicide", 3, "UMS", "Assess a threat against a named person", "Deepak, 30, recently fired", [
    b("“My manager ruined my life. I know where he lives.”", [
      ["o", "“That anger makes complete sense after what happened. Let's stay with your feelings for now and explore them gently.”", "Validating, but you still do not know if he plans to hurt anyone. Threats need direct questions."],
      ["b", "“Are you thinking of hurting him? Have you planned how?”", "He says he bought a rod. You now know there is a plan and means, and you involve your supervisor about the duty to protect."],
      ["h", "Change the subject to calm him down", "He leaves still angry. Avoiding the question leaves a possible victim unprotected."],
    ]),
  ]),
  s("wy-r009", "risk", "Duty to protect", "suicide", "ethics-law", 4, "UMDS", "Balance confidentiality and protecting others", "Deepak, 30, same session", [
    b("He has a plan and a rod, and refuses to let you tell anyone.", [
      ["h", "Respect his refusal, since he has not acted yet", "If he acts, you knew. Clear and imminent danger to an identifiable person is a recognised limit of confidentiality."],
      ["b", "Explain the limits of confidentiality and consult your supervisor now", "Your supervisor arranges psychiatric assessment and the appropriate warning. You share only what is needed to prevent harm."],
      ["o", "Tell him you will come back to it next week if he still feels this way, since he has not acted and may calm down", "Waiting a week with a stated plan and weapon is too long. The risk is now."],
    ]),
  ]),
  s("wy-r010", "risk", "Child safeguarding", "child", "child", 2, "UMS", "Notice and act on child safety concerns", "Mrs Kaur, 32, with a toddler in the room", [
    b("She is very depressed and says, “Sometimes I leave him alone all day. I can't get up.”", [
      ["b", "Ask more about the child's care today and involve your supervisor", "You learn there is no other adult at home. Support is arranged for both mother and child. A child's safety is part of the risk assessment."],
      ["o", "Focus on her depression, since she is your client and treating her mood will help the child's care in time", "Her depression is treated, but the toddler may be neglected. Safeguarding covers anyone at risk, including dependants."],
      ["h", "Tell her you'll have to report her and take the child away", "She panics and leaves. Threats destroy trust; support plus proper procedure protects the child better."],
    ]),
  ]),
  s("wy-r011", "risk", "Self-harm in a younger child", "child", "child", 3, "UMS", "Take self-harm in children seriously", "Rohan, 10", [
    b("A teacher sees scratches on his arms. He says, “I want to disappear.”", [
      ["o", "Tell the teacher to keep a close eye on him in class and at lunch, and to send him to you if he looks upset", "Watching is not assessing. A 10-year-old saying he wants to disappear needs a proper risk assessment and family involvement."],
      ["h", "Reassure the teacher that children say such things", "Children do die by suicide. Dismissing it misses risk and possible problems at home."],
      ["b", "Ask him gently what 'disappear' means, then involve his parents", "He says boys at school beat him. You find the cause, check his safety, and involve the family and school."],
    ]),
  ]),
  s("wy-r012", "risk", "Risk in psychosis", "schizophrenia", "psychosis", 3, "UMDS", "Ask about command hallucinations", "Imran, 24", [
    b("“The voices say I don't deserve to live.”", [
      ["b", "“Do the voices tell you to do things?”", "He says they tell him to jump. You arrange urgent psychiatric review. Command voices with a felt need to obey raise risk."],
      ["h", "“The voices aren't real, so they can't hurt you.”", "He feels dismissed and stops talking. Arguing misses the risk the voices may cause."],
      ["o", "“That must be awful to hear. How long have you been hearing them, and are they there all day?”", "Empathic history, but you still do not know if they are command hallucinations."],
    ]),
  ]),
  s("wy-r013", "risk", "Suicide in older adults", "suicide", "suicide", 3, "UMS", "Recognise quiet risk in older men", "Mr Banerjee, 78, widowed last year", [
    b("“I'm not depressed. I'm just old. My time is coming anyway.”", [
      ["h", "“That's a healthy attitude to ageing.”", "You miss a man with key risk factors: older, male, widowed and alone. Late-life suicide is often quiet."],
      ["b", "“Some people feel they'd rather not wake up. Have you?”", "He admits he has been saving tablets. A normalising, direct question finds the risk."],
      ["o", "Check his memory and blood pressure, since physical causes are common at his age and he says he is not depressed", "Medical checks matter, but they skip the question that matters most today."],
    ]),
  ]),
  s("wy-r014", "risk", "Suicide after loss", "suicide", "suicide", 3, "UMS", "Screen for risk in acute grief", "Pooja, 26, whose fiance died last month", [
    b("“I just want to be with him.”", [
      ["o", "“Grief takes a long time, and wanting to be with him is a natural part of loving someone. Be gentle with yourself.”", "True, but 'I want to be with him' can mean suicidal thinking. You did not check."],
      ["b", "“When you say that, do you mean thoughts of dying?”", "She says she has thought of jumping. You clarify the meaning and act. Ambiguous statements need clarifying, not guessing."],
      ["h", "“You're young. You'll find someone else.”", "She feels her loss is dismissed and closes up. Minimising grief raises distress and hides risk."],
    ]),
  ]),
  s("wy-r015", "risk", "Suicide pacts and online risk", "suicide", "suicide", 4, "UMS", "Respond to online suicide groups", "Neel, 17", [
    b("He shows you a chat group where members share methods and set dates.", [
      ["b", "Ask about his own plans, involve his parents and report the group", "You find he had agreed a date. The family and services act in time. Online pacts are an emergency."],
      ["o", "Ask him to leave the group and block its members, and agree to check in on how he is doing at your next session", "He may leave, but you have not assessed his own plan or protected others in the group."],
      ["h", "Keep it between you so he trusts you", "Secrecy about an agreed suicide date is not protecting his trust; it is protecting the risk."],
    ]),
  ]),
  s("wy-r016", "risk", "Chronic self-harm", "personality", "personality", 4, "UMS", "Avoid both overreaction and neglect in chronic self-harm", "Leela, 27, with borderline personality disorder", [
    b("She cuts superficially every few weeks and has done so for years. Today the cuts are deeper and she says she feels 'done'.", [
      ["h", "Treat it like every other time, because she has said this before and extra attention may reinforce the cutting", "A change in pattern, deeper cuts and hopelessness, is exactly when risk rises. Familiarity breeds missed risk."],
      ["o", "Arrange hospital admission straight away, as the team has done for every cut, because it is safer to be cautious", "Admission for every cut can harm in borderline personality, but here the change does need closer review. Judge the change, not the label."],
      ["b", "Ask what is different this time and review her plan today", "She admits she has been thinking of an overdose. You act on what is new. Risk in chronic self-harm is judged by change."],
    ]),
  ]),
  s("wy-r017", "risk", "Risk and alcohol", "substance", "suicide", 3, "UMS", "Factor intoxication into risk", "Vikram, 40, drinking heavily", [
    b("He calls at night, drunk, saying he will end it.", [
      ["b", "Keep him talking and get someone to him now", "His wife is found and stays with him. Intoxication lowers inhibition and raises risk, so act now."],
      ["o", "Tell him kindly to call back in the morning when he is sober, so that you can talk properly and make a plan", "He may not live to call back. Alcohol makes impulsive suicide more likely."],
      ["h", "Hang up, since you cannot help a drunk person", "Leaving an intoxicated person with suicidal intent alone is a serious failure of care."],
    ]),
  ]),
  s("wy-r018", "risk", "Risk formulation", "suicide", "suicide", 4, "UMDS", "Write a risk formulation rather than a score", "Report writing for Ms Thomas, 33", [
    b("Your supervisor asks you to rate her as low, medium or high risk.", [
      ["o", "Write 'medium risk' because she has some risk factors and some protective ones, and add the date of her next review", "A single label tells the next clinician little. It does not say what would raise or lower risk."],
      ["b", "Write a short risk formulation with a plan", "The night team knows what to watch for. A formulation guides action; a score alone does not."],
      ["h", "Use a checklist score and write 'low risk' because she scored 4", "Risk scales do not predict individual suicide well. A low score can lull the team."],
    ]),
  ]),
  s("wy-r019", "risk", "Risk in an inpatient", "suicide", "suicide", 3, "MDS", "Notice a sudden improvement", "Mr Das, 50, admitted with severe depression", [
    b("After weeks of despair, he is suddenly calm, smiling and says he 'has it all figured out'.", [
      ["h", "Recommend leave this weekend since he is so much better", "Sudden calm after severe depression can mean a decision to die. Leave without reassessment could be fatal."],
      ["b", "Ask him what he has figured out", "He reveals a plan for his weekend leave. A sudden lift needs a fresh risk assessment."],
      ["o", "Note the improvement in his file and tell the team that he seems to be responding well to treatment at last", "Recording it is fine, but the meaning of the change is the key question."],
    ]),
  ]),
  s("wy-r020", "risk", "Postpartum risk", "depression", "lifespan", 4, "MDS", "Ask about harm to self and baby", "Fatima, 25, six weeks after delivery", [
    b("“Sometimes I think my baby would be better without me.”", [
      ["b", "Ask about thoughts of harming herself or the baby", "She has thoughts of jumping with the baby. Urgent care protects both. Postpartum statements like this must be explored."],
      ["o", "Reassure her that almost all new mothers feel overwhelmed at six weeks and that it passes as the baby settles", "Many do, but this sentence can signal suicidal and even infanticidal risk. You did not check."],
      ["h", "Tell her family she is a danger to the baby", "Telling the family before assessing her frightens her and can lead to blame instead of care."],
    ]),
  ]),
  s("wy-r021", "risk", "Risk and capacity", "suicide", "ethics-law", 4, "UMDS", "Use emergency treatment when capacity is absent", "Mr Joshi, 38, after an overdose", [
    b("He refuses the antidote, is drowsy, and cannot repeat what the doctor explained.", [
      ["o", "Respect his refusal, because adults have the right to refuse treatment and forcing it would break his trust", "Adults with capacity can refuse. He shows signs he cannot understand or weigh the decision right now."],
      ["b", "Help assess his capacity now", "He is treated and later thanks the team. MHCA 2017 allows emergency treatment to prevent death when capacity is absent."],
      ["h", "Wait until he agrees", "Some overdoses cause damage within hours. Waiting can cost his life."],
    ]),
  ]),
  s("wy-r022", "risk", "Elder abuse", "dementia", "lifespan", 3, "UMS", "Respond to signs of elder abuse", "Mrs Pillai, 82, with dementia", [
    b("She has new bruises on her wrists and flinches when her son reaches toward her.", [
      ["h", "Ask the son in front of her how she got the bruises", "If he is the abuser, you have put her at risk and she cannot speak freely."],
      ["o", "Note the bruises carefully in her file and ask her GP to check them at the next routine visit", "Some action, but you have not tried to understand her safety directly."],
      ["b", "See her alone and ask gently about safety", "She whispers that he ties her to the bed. Proper steps protect her."],
    ]),
  ]),
  s("wy-r023", "risk", "Intimate partner violence", "depression", "trauma", 3, "UMS", "Ask about safety in domestic violence", "Sunita, 30", [
    b("“He only hits me when he's drunk. It's my fault for arguing.”", [
      ["b", "“It's not your fault. Are you safe tonight?”", "She mentions choking last week. Strangulation strongly predicts later homicide; you plan safety and give the women's helpline 181."],
      ["o", "“You should leave him and go to your parents' home. No one deserves this, and it will only get worse if you stay.”", "She shuts down. Leaving is the most dangerous time and her choice; advice before assessment pushes her away."],
      ["h", "“Try not to argue when he's drunk.”", "You have agreed it is her fault. Victim-blaming keeps her trapped."],
    ]),
  ]),
  s("wy-r024", "risk", "Risk to children from a parent", "child", "child", 4, "UMS", "Assess risk to children in parental psychosis", "Mr Khan, 36, with psychosis", [
    b("“My children are possessed. I have to cleanse them.”", [
      ["o", "Ask him to bring his children to the next session so you can see how they are and judge the risk yourself", "Delay leaves children at risk. Delusions about children with a stated action need same-day action."],
      ["h", "Explore what 'cleanse' means in his faith over the next sessions", "Cultural curiosity is good, but here a delusion targets children. Waiting can be fatal."],
      ["b", "Ask exactly what he plans, and act today", "He plans to burn them 'clean'. The children are protected and he is admitted. Delusions involving children are high risk."],
    ]),
  ]),
  s("wy-r025", "risk", "Self-harm and family", "suicide", "suicide", 2, "UMS", "Involve family well in a young person's safety plan", "Isha, 15, after an overdose", [
    b("Her parents ask, “What do we do now?”", [
      ["b", "Explain how to lock away medicines and when to get help", "The parents feel equipped. Practical steps at home reduce risk."],
      ["h", "Tell them to watch her every second and take away her phone and door", "Heavy control can increase conflict and secrecy. Safety works better with trust and clear steps."],
      ["o", "Tell them that what she shared is confidential and you cannot discuss anything she told you without her consent", "For a minor at risk, parents need enough information to keep her safe."],
    ]),
  ]),
  s("wy-r026", "risk", "Risk in eating disorders", "eating", "more-disorders", 4, "MDS", "Recognise medical risk in anorexia", "Divya, 18, BMI 14", [
    b("She feels dizzy on standing and her pulse is 42.", [
      ["h", "Continue outpatient therapy and recheck next month", "A pulse of 42 with dizziness signals cardiac risk. Delay can be fatal."],
      ["b", "Arrange same-day medical review", "Her ECG and electrolytes are abnormal. Medical risk in anorexia is assessed by vital signs, not by how well the patient says she is."],
      ["o", "Ask her to eat more, add salt to her drinks, and stand up slowly, and see her again in a week to check her pulse", "Advice will not fix dangerous bradycardia and may risk refeeding problems."],
    ]),
  ]),
  s("wy-r027", "risk", "Risk in mania", "bipolar", "bipolar", 3, "UMS", "Recognise risk to finances and reputation in mania", "Arjun, 35, in a manic episode", [
    b("He plans to transfer his family's savings to a stranger's start-up tonight.", [
      ["o", "Warn him gently that it may be a bad idea and ask him to sleep on it before he sends any money tonight", "He agrees and does it anyway. Insight is low in mania."],
      ["b", "Involve his family and psychiatrist today", "The bank holds the transfer and he is treated. Financial ruin is a real risk in mania."],
      ["h", "Respect his autonomy; it is his money", "Autonomy matters, but mania can remove the capacity to decide. Losses can ruin a family."],
    ]),
  ]),
  s("wy-r028", "risk", "Weapons in the home", "suicide", "suicide", 2, "UMS", "Ask about weapons", "Major Singh, 55, retired army officer", [
    b("He is depressed and mentions he keeps his licensed pistol in the bedroom.", [
      ["b", "Ask him to lodge the pistol elsewhere for now", "He agrees once you frame it as temporary. Firearms are the most lethal means; distance saves lives."],
      ["h", "Leave it, since it is licensed and he is trained", "Training does not protect against suicide. Access to a gun greatly raises lethality."],
      ["o", "Ask him to keep the pistol unloaded and locked in a cupboard, with the bullets stored in a different room", "Better than nothing, but a gun and bullets in the same home can still be used quickly."],
    ]),
  ]),
  s("wy-r029", "risk", "Self-harm in school", "child", "child", 2, "CUS", "Respond when a student discloses self-harm to a counsellor", "Simran, 14, school counselling room", [
    b("She shows you fresh cuts and asks you not to tell her parents.", [
      ["o", "Promise not to tell her parents for now, so that she keeps coming to see you and you can work on the cutting together", "A promise you may need to break harms trust later. Minors at risk need adults involved."],
      ["h", "Call her parents in front of her without explaining", "She feels betrayed and ashamed. How you involve parents matters as much as whether."],
      ["b", "Say you can't keep it secret, and plan the call together", "She chooses to be present when you call. Being honest and involving her keeps trust and safety."],
    ]),
  ]),
  s("wy-r030", "risk", "Neglect in older adults", "dementia", "neurocognitive", 3, "UMS", "Respond to self-neglect", "Mr Fernandes, 80, lives alone in Goa", [
    b("Neighbours report he has not been seen buying food for a week and smells of urine.", [
      ["b", "Arrange a home visit today", "He is found dehydrated and confused. Self-neglect can be a sign of delirium or dementia."],
      ["o", "Phone him to ask if he is fine and whether he needs anything, and ask the neighbours to keep an eye on him", "He says yes. A phone call cannot assess hygiene, food or confusion."],
      ["h", "Wait until his son returns from abroad next month", "A month may be too long for a confused, dehydrated man."],
    ]),
  ]),
  s("wy-r031", "risk", "Risk after a breakup", "suicide", "suicide", 2, "UMS", "Screen risk in relationship crises", "Rahul, 23", [
    b("“She left me. Without her there's nothing.”", [
      ["h", "“Lots of fish in the sea.”", "He feels mocked. Breakups are common triggers of suicide in young men."],
      ["b", "“Have you had thoughts of ending your life?”", "He admits he has been looking at the railway tracks. Direct questions save lives."],
      ["o", "“Let's look at what went wrong in the relationship, so you can understand it and feel more in control.”", "Useful later, but the first job is to check his safety."],
    ]),
  ]),
  s("wy-r032", "risk", "Collateral in risk assessment", "suicide", "suicide", 3, "UMS", "Use collateral when risk is unclear", "Mrs Gupta, 47", [
    b("She denies suicidal thoughts, but her daughter called earlier saying she found a note.", [
      ["o", "Accept her denial, since she is an adult and says she is fine, and ask the daughter to call again if worried", "Denial is common. The note is important evidence you have ignored."],
      ["b", "Gently ask her about the note", "She cries and talks about her plan. Collateral information changes the risk picture."],
      ["h", "Confront her for lying", "She becomes defensive and leaves. Confrontation pushes people away from help."],
    ]),
  ]),
  s("wy-r033", "risk", "Suicide and LGBTQ youth", "suicide", "suicide", 3, "UMS", "Assess risk with minority stress", "Ayaan, 18", [
    b("“My family will disown me if they find out I'm gay. I'd rather die.”", [
      ["b", "Ask about suicide plans and affirm him", "He finds an online support group and a supportive cousin. Affirmation and safety planning reduce risk."],
      ["h", "Suggest that it might be a phase and he could try dating girls", "This is rejecting and harmful. It raises the very risk you are assessing."],
      ["o", "Tell him to come out to his family soon, because hiding it is causing the distress and they may accept him in time", "Coming out is his decision and can be dangerous without support."],
    ]),
  ]),
  s("wy-r034", "risk", "Violence on a ward", "schizophrenia", "psychosis", 3, "MDS", "Use de-escalation first", "Ward patient, 28, shouting and pacing", [
    b("He is pacing, shouting at staff and holding a plastic chair.", [
      ["h", "Approach him quickly and grab the chair", "He swings it. Rushing in raises the risk to everyone."],
      ["o", "Leave him alone until he calms down, since attention may reward the shouting and make it last longer", "He may calm, or he may hurt someone. Agitation needs active, calm management."],
      ["b", "Keep your distance, speak calmly and offer choices", "He puts down the chair and accepts medicine. De-escalation reduces the need for restraint."],
    ]),
  ]),
  s("wy-r035", "risk", "Repeat attender", "suicide", "suicide", 4, "UMS", "Avoid labelling a repeat self-harm attender", "Riya, 21, fifth visit this month", [
    b("The emergency doctor says, “She's back again. She just wants attention.”", [
      ["b", "Assess her as carefully as the first time", "You find new hopelessness and a plan. Repeat self-harm raises suicide risk."],
      ["o", "Agree with the doctor that it is probably for attention, but still check and dress her wound properly", "Physical care is done, but the label stops anyone asking about suicide."],
      ["h", "Tell her she is wasting doctors' time", "She leaves angry. Shame increases the risk of a more lethal act."],
    ]),
  ]),
  s("wy-r036", "risk", "Risk in children of alcoholic parents", "child", "child", 3, "UMS", "Ask about safety at home", "Kabir, 11", [
    b("“Papa breaks things when he drinks. I hide under the bed.”", [
      ["o", "“That must be very scary. Let's do some drawing together so you can feel calmer and show me what home is like.”", "Kind, but you have not checked whether he or his mother is being hurt."],
      ["b", "Ask gently whether anyone gets hurt", "He says his mother has been beaten. You arrange support for both."],
      ["h", "“Your father must be stressed. Be a good boy so he doesn't get angry.”", "You have put the burden on the child. This silences him."],
    ]),
  ]),
  s("wy-r037", "risk", "Homicide-suicide", "depression", "suicide", 5, "MDS", "Recognise extended suicide risk", "Mr Rao, 44, deep in debt", [
    b("“I can't leave my wife and kids to suffer the shame. We'll all go together.”", [
      ["h", "“That's just despair talking. You'd never hurt your family.”", "Despair can lead to family murder-suicide. Dismissing it leaves the family in danger."],
      ["o", "Ask him to see a financial counsellor this week, since the debt is the root of the despair and sorting it would ease it", "Debt help matters later. Right now there is a stated plan involving others."],
      ["b", "Ask what he has planned and act at once", "He has bought poison for everyone. Police and family are involved and he is admitted. Statements of 'all of us together' need immediate action."],
    ]),
    b("His wife comes in the next day and asks whether he can come home.", [
      ["b", "Explain the risk and plan, and involve her", "She understands and helps plan safety at home. Families need to be part of the plan."],
      ["o", "Tell her that you cannot share anything about his care, because he has not given consent and the rules are strict", "With a direct risk to her and the children, she needs enough to stay safe."],
      ["h", "Say he is fine now and can go home", "One night does not change the risk. Early discharge would put the family in danger again."],
    ], "He is calmer after a night in hospital."),
  ]),
  s("wy-r038", "risk", "Stalking", "personality", "personality", 4, "UMS", "Respond to a client who is stalking someone", "Nitin, 29", [
    b("He says he follows his ex daily, waits outside her office and has sent 200 messages this week.", [
      ["b", "Name it as stalking and assess the risk", "He admits he has thought of hurting her new partner. You consult your supervisor about protecting her."],
      ["o", "Help him process his feelings about the breakup, since the following will stop once the grief is worked through", "Feelings matter, but stalking is a pattern that can escalate to violence."],
      ["h", "Advise him on better ways to win her back", "You are now helping the stalking."],
    ]),
  ]),
  s("wy-r039", "risk", "Suicide notes online", "suicide", "suicide", 3, "UMS", "Act on an online warning", "Former client, 24", [
    b("You see a goodbye post on her social media at 11pm.", [
      ["h", "Wait until morning to see if she replies to a message", "Hours matter. A public goodbye is an emergency."],
      ["b", "Call her emergency contact or police now", "She is found after taking tablets and treated. Acting quickly on a goodbye post saves lives."],
      ["o", "Comment on the post asking if she is okay, and send her a message saying you are there if she wants to talk", "She may not see it, and it exposes her publicly. A direct emergency response is needed."],
    ]),
  ]),
  s("wy-r040", "risk", "Risk with intellectual disability", "child", "child", 3, "UMS", "Assess risk in a person with intellectual disability", "Sanjay, 20, mild intellectual disability", [
    b("He says, “I want to die like my uncle.”", [
      ["o", "Assume he does not really understand death, and gently explain to him that his uncle is not coming back", "People with intellectual disability can and do attempt suicide."],
      ["b", "Ask him in simple words what he means", "He has been walking near the canal. Simple direct questions find the risk."],
      ["h", "Tell him not to say such things", "He learns not to tell you, and the risk goes underground."],
    ]),
  ]),
  s("wy-r041", "risk", "Risk in adolescents after exam results", "suicide", "suicide", 2, "CUS", "Prepare for high-risk days", "Class 12 student, results tomorrow", [
    b("He says, “If I fail tomorrow, it's over.”", [
      ["b", "Ask what 'over' means and plan for results day", "He fails one subject. His father is with him and they call you. Planning ahead for known high-risk days works."],
      ["o", "Tell him not to worry, he has worked hard and will surely pass, and that one exam does not decide his life", "If he fails, your reassurance becomes empty. Plan for both outcomes."],
      ["h", "Tell his parents to be strict so he studies harder next time", "Pressure at a high-risk moment can tip a young person into a crisis."],
    ]),
  ]),
  s("wy-r042", "risk", "Suicide in custody", "suicide", "ethics-law", 4, "MDS", "Respond to risk in a prison setting", "Undertrial prisoner, 26", [
    b("He was arrested two days ago, is withdrawn and says, “I won't let them try me.”", [
      ["o", "Ask the guard to check on him from time to time during the night and to report anything unusual in the morning", "Occasional checks miss the early days of custody, which are highest risk."],
      ["h", "Assume he is trying to avoid trial", "Even if he is, the risk to life is real."],
      ["b", "Assess his risk and alert the medical officer", "He is moved to observation. Early custody carries high suicide risk."],
    ]),
  ]),
  s("wy-r043", "risk", "Risk in a counsellor's own client after a news event", "suicide", "suicide", 3, "UMS", "Notice contagion risk", "Client, 20, after a celebrity suicide", [
    b("She talks about the actor's death and says she understands why he did it.", [
      ["b", "Ask whether she has had similar thoughts", "She has, and has been searching for it. You address contagion directly."],
      ["h", "Talk about the actor's life and films", "You have stayed on the celebrity and missed her own risk."],
      ["o", "Tell her to avoid news and social media about the death for a few weeks, since the coverage is upsetting her", "Reasonable advice, but you have not checked her own thoughts."],
    ]),
  ]),
  s("wy-r044", "risk", "Risk in substance use", "substance", "substance", 3, "MDS", "Warn about loss of tolerance", "Ravi, 27, just released from rehab", [
    b("He says he might 'have one hit, like old times' to celebrate.", [
      ["o", "Tell him firmly that one hit would be a relapse and would undo all the hard work he has done in rehab", "True, but it misses the overdose risk from lower tolerance."],
      ["h", "Say a single use won't matter", "After abstinence, his usual dose can kill. This is the classic overdose after release."],
      ["b", "Warn him that his old dose could now kill him", "He understands the danger. Overdose deaths spike after rehab or prison."],
    ]),
  ]),
  s("wy-r045", "risk", "Risk documentation", "casesheet", "case-sheet", 2, "UMS", "Document a risk assessment clearly", "Your session note", [
    b("You assessed a client with suicidal thoughts and made a plan.", [
      ["h", "Write 'client at risk, safety plan made'", "Too vague for the next clinician to act on."],
      ["o", "Write the whole conversation down word for word, so nothing is lost and the next clinician has the full picture", "Hard to read and hides the key points."],
      ["b", "Record her words on plan and means, your view, and the plan", "The next clinician knows exactly what to watch. Good notes protect the patient and you."],
    ]),
  ]),
  s("wy-r046", "risk", "Suicide risk in schizophrenia", "schizophrenia", "psychosis", 4, "MDS", "Know when risk peaks in schizophrenia", "Arun, 25, recovering from first episode", [
    b("He now understands he has schizophrenia and says, “My life is ruined. I'll never be normal.”", [
      ["b", "Ask about suicidal thoughts and talk about recovery", "He admits he has thought of dying. Insight after a first episode is a high-risk time."],
      ["o", "Praise his insight, because accepting the diagnosis means treatment is working and he will now take his medicine", "Insight is good, but it often brings hopelessness and risk."],
      ["h", "Agree that it is a serious lifelong illness", "Without hope, the truth can feel like a sentence."],
    ]),
  ]),
  s("wy-r047", "risk", "Self-harm in a hostel", "suicide", "suicide", 3, "CUS", "Respond as a hostel counsellor", "Medical student, 20, found by a roommate", [
    b("Her roommate found her with a ligature but she says it was 'just to see how it felt'.", [
      ["o", "Accept her explanation, since she says she was only curious, and advise her to rest and call you if she feels low", "Testing a ligature is a serious warning sign."],
      ["b", "Assess her risk now and arrange psychiatric review", "She admits she had been planning for weeks. Rehearsal behaviour means high risk."],
      ["h", "Report her to the college for misconduct", "Disciplinary action punishes distress and raises risk."],
    ]),
  ]),
  s("wy-r048", "risk", "Child at risk of trafficking", "child", "child", 4, "UMS", "Recognise trafficking signs", "Girl, 14, brought by an 'uncle' to a clinic in Siliguri", [
    b("She does not speak, the man answers for her, and he says she is going to 'work in a house' in a city.", [
      ["h", "Treat her headache and let them go", "You may have seen a trafficked child and done nothing."],
      ["b", "Speak with her alone and call Childline 1098", "She is from another state and does not know the man. Services intervene in time."],
      ["o", "Ask the man for her parents' phone number so you can confirm with them that she is allowed to travel for work", "He gives a fake number. Asking the suspect alone does not protect her."],
    ]),
  ]),
  s("wy-r049", "risk", "Risk with ambivalence", "suicide", "suicide", 3, "UMS", "Work with ambivalence", "Mohan, 42", [
    b("“Part of me wants to die, part of me came here.”", [
      ["b", "“What made the part of you that came here decide to come?”", "He speaks about his daughter. Working with the part that wants to live strengthens reasons for living."],
      ["o", "“Let's focus on the part that wants to die, since that is where the danger is and we need to understand it fully.”", "Understanding risk matters, but ignoring reasons for living misses a strength."],
      ["h", "“If you really wanted to die, you wouldn't be here.”", "Dismisses real risk. Many people who die by suicide had been ambivalent."],
    ]),
  ]),
  s("wy-r050", "risk", "Risk of falls and sedatives", "dementia", "neurocognitive", 2, "MDS", "Notice physical risks in older adults", "Mrs Menon, 84, on sleeping tablets", [
    b("Her family wants a stronger sleeping pill because she wanders at night.", [
      ["o", "Suggest a slightly higher dose of her current tablet, since she already tolerates it and the family needs sleep", "More sedation raises falls and hip fractures in older people."],
      ["h", "Suggest tying her to the bed at night", "Restraint at home is dangerous and can be abuse."],
      ["b", "Find out why she wanders at night", "She is waking to pass urine. A bedside commode and light solve most of it."],
    ]),
  ]),
  s("wy-r051", "risk", "Risk of harm by a carer", "child", "child", 4, "UMS", "Respond to a parent's thoughts of harming a child", "Anil, 34, father of a newborn", [
    b("“When the baby cries all night, I feel like shaking him.”", [
      ["b", "Ask if he has ever done it, and plan help", "He has not, but was close. He learns to put the baby down safely and step away."],
      ["h", "Tell him that is a terrible thing to say", "He feels ashamed and will not tell you again."],
      ["o", "Reassure him that all new parents feel that way at times, and that it shows how tired he is rather than danger", "Many do, but you have not checked whether he has acted or how close he is."],
    ]),
  ]),
  s("wy-r052", "risk", "Ligature risk", "suicide", "suicide", 2, "MDS", "Notice environmental risk", "Inpatient ward round", [
    b("You notice a dupatta and a belt in the room of a patient on suicide watch.", [
      ["o", "Mention it at the next team meeting so that the ward policy on belongings can be reviewed for all patients", "The patient is at risk tonight."],
      ["b", "Remove them now and tell the nurse in charge", "The ward is made safer at once. Ligatures are a common method on wards."],
      ["h", "Leave them; the patient has a right to belongings", "Rights matter, but immediate safety on suicide watch comes first."],
    ]),
  ]),
  s("wy-r053", "risk", "Risk and religion", "suicide", "suicide", 2, "UMS", "Use protective factors", "Mrs Ahmed, 39", [
    b("She says suicide is forbidden in her faith, so she would never do it, though she wishes she were dead.", [
      ["h", "Mark her as no risk because of her faith", "Faith can protect, but it does not remove risk on its own."],
      ["b", "Value her faith but still ask about plans", "She admits she has stopped praying. You keep asking and plan follow-up."],
      ["o", "Ask her imam to talk to her, with her permission, since faith is clearly important and he may comfort her more than you", "Possibly helpful later with her consent, but it does not assess risk now."],
    ]),
  ]),
  s("wy-r054", "risk", "Risk in a new mother with psychosis", "schizophrenia", "lifespan", 5, "MDS", "Manage a perinatal psychiatric emergency", "Lakshmi, 28, 10 days after delivery", [
    b("She is up all night, laughing to herself, and says the baby is not hers.", [
      ["o", "Book an appointment for next week and ask the family to watch her closely, take turns with the baby and let her sleep", "Postpartum psychosis worsens fast. A week is too long."],
      ["b", "Arrange same-day psychiatric assessment", "She is admitted and treated. Postpartum psychosis carries risk of suicide and infanticide."],
      ["h", "Tell the family it is normal tiredness", "Missing postpartum psychosis can be fatal for mother and baby."],
    ]),
    b("The family asks whether she can breastfeed in hospital.", [
      ["b", "Support supervised contact if the team judges it safe", "Bonding continues safely. Supervised contact supports recovery."],
      ["h", "Ban all contact with the baby until she is fully well", "Separation without need can harm bonding and recovery."],
      ["o", "Let her care for the baby on the ward as she wishes, since bonding is important and nurses are nearby", "Unsupervised care is not safe yet."],
    ], "She is admitted and starting treatment."),
  ]),
  s("wy-r055", "risk", "Risk and capacity in older adults", "dementia", "neurocognitive", 4, "UMS", "Balance risk and autonomy", "Mr Kulkarni, 79, mild dementia", [
    b("He insists on still driving his scooter in Pune traffic. He got lost twice.", [
      ["h", "Hide his keys without telling him", "He feels betrayed and may fight back. Deception damages trust."],
      ["o", "Let him continue driving, since it is his choice, it keeps him independent, and he knows the roads well", "Getting lost while driving risks his life and others'."],
      ["b", "Discuss the risk with him and plan alternatives", "He agrees to stop when his doctor explains, and his grandson drives him."],
    ]),
  ]),
  s("wy-r056", "risk", "Risk in a teen with ADHD and impulsivity", "child", "child", 3, "UMS", "Recognise impulsive risk", "Yash, 16, with ADHD", [
    b("He jumped from a first-floor balcony on a dare and laughs about it.", [
      ["b", "Ask about other risky acts and drug use", "He has also been drink-driving. Impulsivity in ADHD raises accident and injury risk."],
      ["o", "Tell him clearly not to do it again, and ask his parents to keep the balcony door locked at night", "He will forget. The risk pattern needs a plan."],
      ["h", "Laugh along to build rapport", "You have rewarded dangerous behaviour."],
    ]),
  ]),
  s("wy-r057", "risk", "Self-harm and confidentiality in adults", "suicide", "ethics-law", 3, "UMS", "Decide whom to tell", "Ritu, 30", [
    b("She has thoughts of suicide but no plan, and asks you not to tell her husband.", [
      ["o", "Tell her husband anyway so he can watch her, since he lives with her and would want to know", "Without imminent risk, breaking confidence can harm trust and is not justified."],
      ["b", "Respect her wish and agree a safety plan", "She agrees to call a friend if things worsen. Confidentiality holds unless risk becomes serious."],
      ["h", "Promise you'll never tell anyone whatever happens", "You cannot promise that. If risk rises, you may need to act."],
    ]),
  ]),
  s("wy-r058", "risk", "Suicide risk in chronic pain", "suicide", "suicide", 3, "UMS", "Ask about suicide in chronic illness", "Mrs Reddy, 60, with severe arthritis", [
    b("“I can't bear this pain anymore.”", [
      ["h", "Tell her to take more painkillers", "Painkillers are her likely means. You have not asked about risk."],
      ["b", "Ask whether the pain makes her think of dying", "She has been stockpiling tramadol. You act on both pain and risk."],
      ["o", "Refer her to a pain clinic and a physiotherapist, since better pain control will improve her mood as well", "Helpful, but you missed the risk question."],
    ]),
  ]),
  s("wy-r059", "risk", "Threats to staff", "personality", "personality", 3, "UMS", "Respond to threats in a clinic", "Client, 35", [
    b("He says, “If you don't write my certificate, you'll regret it.”", [
      ["o", "Write a cautious certificate to calm things down, wording it carefully so that it says nothing untrue", "Giving in to threats rewards them and is dishonest."],
      ["h", "Threaten him back", "He becomes more agitated and the situation escalates. Matching a threat with a threat raises the risk to you and others."],
      ["b", "Stay calm, refuse and end the session safely", "He leaves; the clinic sets clear rules. Safety of staff matters too."],
    ]),
  ]),
  s("wy-r060", "risk", "Risk of exploitation", "child", "child", 3, "UMS", "Notice exploitation of a vulnerable adult", "Priya, 22, mild intellectual disability", [
    b("She has a new 'boyfriend' online who asks her for photos and money.", [
      ["b", "Explain online safety and report the account", "The account is a scam targeting disabled women. Protection works with her, not around her."],
      ["o", "Tell her to block him on every app, change her passwords, and tell you at once if he contacts her again", "Good advice, but she may not see why, and others may be at risk."],
      ["h", "Leave it; she is an adult", "Adulthood does not remove the duty to help her stay safe from exploitation."],
    ]),
  ]),
  s("wy-r061", "risk", "Suicide risk in men who will not talk", "suicide", "suicide", 4, "UMS", "Find risk behind anger", "Mr Thakur, 50, brought by his wife", [
    b("He is angry, says he does not need 'mental doctors', and sits with his arms crossed.", [
      ["h", "Tell him he must cooperate or leave", "He leaves. Men often show distress as anger; this was a chance to help."],
      ["b", "Start with sleep, work and drinking, then ask about risk", "He admits he thought of driving into a truck. Starting with practical topics opens the door."],
      ["o", "Speak only to his wife, since he is unwilling and she knows what has been happening at home", "You learn her view, but miss his own risk."],
    ]),
  ]),
  s("wy-r062", "risk", "Rescue after an attempt", "suicide", "suicide", 2, "CUS", "Give first steps at the scene", "You are first to find a neighbour after he drank pesticide", [
    b("He is conscious and vomiting.", [
      ["o", "Give him milk to drink and wait to see if he improves, since he is awake, talking and the vomiting may clear it", "Home remedies waste time. Organophosphates can kill within hours."],
      ["b", "Rush him to hospital with the bottle", "The hospital knows the poison and starts the antidote quickly."],
      ["h", "Make him vomit more by putting your fingers in his throat", "This can cause choking and delays care."],
    ]),
  ]),
];
