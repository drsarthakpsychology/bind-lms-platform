import type { Scenario } from "../scenarios";
import { b, s } from "./make";

/** Liaison: working with doctors, wards, schools, courts, employers and other services. */
export const LIAISON: Scenario[] = [
  s("wy-l001", "liaison", "Referral to a psychiatrist", "interview", "case-sheet", 1, "CUS", "Write a useful referral", "Your client, 30, needs a medicine review", [
    b("You are writing to a psychiatrist.", [
      ["h", "Write 'please see and treat'", "The psychiatrist has no idea why. A referral without the question wastes the appointment."],
      ["b", "Say what you have seen, the risk, what you have tried, and your clear question", "The psychiatrist sees her quickly and answers your question. Clear referrals get clear help."],
      ["o", "Send all your session notes from the past six months so the psychiatrist has everything", "The key point is buried. Busy colleagues need a summary, not raw notes."],
    ]),
  ]),
  s("wy-l002", "liaison", "Consent to share", "interview", "ethics-law", 1, "CUS", "Ask consent before sharing", "Client, 25, being referred", [
    b("You want to tell her GP about her depression.", [
      ["o", "Share it, since the GP is also a doctor and is bound by the same confidentiality rules", "She finds out and feels betrayed. Without risk, sharing needs her consent."],
      ["b", "Explain why sharing would help and ask her consent", "She agrees and is glad her GP knows. Consent keeps trust."],
      ["h", "Tell her family instead so they can tell the GP", "You have breached her confidence twice over."],
    ]),
  ]),
  s("wy-l003", "liaison", "Delirium on a medical ward", "dementia", "neurocognitive", 2, "MDS", "Advise a medical team about delirium", "Medical ward asks for a 'psych review' of a confused man", [
    b("They want him moved to a psychiatric ward.", [
      ["b", "Explain it looks like delirium, suggest looking for causes, and offer advice on managing it on the ward", "They find a chest infection and he recovers. Delirium is a medical problem treated where it is."],
      ["h", "Agree to transfer him at once", "Moving a delirious man to a psychiatric ward delays treatment of the cause."],
      ["o", "Suggest a sedative and leave the ward, since the team will know what else to do", "Sedation may worsen delirium and hides the cause."],
    ]),
  ]),
  s("wy-l004", "liaison", "Self-harm in an emergency room", "suicide", "suicide", 2, "UMS", "Assess self-harm before discharge", "Emergency doctor, overdose patient medically fit", [
    b("The doctor wants to discharge her now.", [
      ["o", "Agree she can go, since she is medically fit and the bed is needed for others", "She leaves without any risk assessment."],
      ["b", "Ask for time to assess her risk and plan follow-up before she leaves", "You find ongoing intent and arrange support. Medical fitness is not psychiatric safety."],
      ["h", "Tell the doctor she is attention-seeking", "Labels block care and increase stigma."],
    ]),
  ]),
  s("wy-l005", "liaison", "Somatic symptoms with a GP", "dsm-somatic", "more-disorders", 3, "UMS", "Coordinate care for somatic symptoms", "GP with a patient who visits weekly", [
    b("The GP is frustrated and wants you to 'fix it'.", [
      ["h", "Tell the GP the patient is faking", "This is untrue and harmful. Somatic distress is real."],
      ["o", "Take over all her care so the GP no longer has to see her for anything", "She still needs medical care. Shared care works better."],
      ["b", "Suggest scheduled GP visits, limited tests, and CBT with you", "Visits fall and she copes better. Coordinated care reduces unnecessary tests."],
    ]),
  ]),
  s("wy-l006", "liaison", "School liaison", "child", "child", 2, "US", "Work with a school with consent", "Teacher calls about your client, 12", [
    b("She asks what is wrong with him.", [
      ["b", "Explain you can share only with parental consent, and offer to talk once you have it", "The parents agree and you plan support together. Consent protects the child."],
      ["h", "Tell her his diagnosis", "You breach confidentiality and the label may spread."],
      ["o", "Refuse to speak to her at all, now or later, since all information is strictly confidential", "With consent, school input could help him."],
    ]),
  ]),
  s("wy-l007", "liaison", "Court report request", "interview", "ethics-law", 4, "UMS", "Know the limits of a report", "Lawyer asks for a report on your client", [
    b("He wants you to say his client is 'unfit to stand trial'.", [
      ["o", "Write what the lawyer wants, since your client needs help and the lawyer is on his side", "Reports must be honest and within your competence."],
      ["h", "Ignore the request", "The court may still need information."],
      ["b", "Explain what you can and cannot give, and suggest a formal assessment by a qualified expert", "The court orders a proper assessment. Fitness opinions need the right expert."],
    ]),
  ]),
  s("wy-l008", "liaison", "Employer request", "interview", "ethics-law", 2, "US", "Handle an employer request", "HR asks about an employee you see", [
    b("They want to know if she is fit to return to work.", [
      ["h", "Share her diagnosis and history", "You breach confidentiality and may harm her career."],
      ["b", "With her consent, give a brief statement about fitness and any adjustments, without detail", "She returns with adjustments. Share only what is needed, with consent."],
      ["o", "Tell them to ask her doctor instead, since you cannot help with this at all", "The employer makes a decision without useful input. With her consent you could have helped her return well."],
    ]),
  ]),
  s("wy-l009", "liaison", "Anorexia and medical team", "eating", "more-disorders", 4, "MDS", "Coordinate with medicine in anorexia", "Paediatric ward, girl with anorexia", [
    b("The ward wants to discharge her once her electrolytes are normal.", [
      ["b", "Agree a joint plan for weight, meals and follow-up before discharge", "She has support after discharge. Joint care lowers readmission."],
      ["o", "Agree to discharge, since the electrolytes are normal and she is medically stable today", "She may relapse quickly without a plan."],
      ["h", "Tell the ward she is not your problem", "Splits care and endangers her."],
    ]),
  ]),
  s("wy-l010", "liaison", "Police liaison", "schizophrenia", "ethics-law", 3, "UMS", "Work with police in a crisis", "Police bring a man with psychosis", [
    b("They want you to take him so they can leave.", [
      ["o", "Let them leave at once so that he feels less threatened by the uniforms", "If he becomes violent, staff may not be safe."],
      ["b", "Ask them to stay until he is assessed and the situation is safe", "He is assessed safely. Joint working protects everyone."],
      ["h", "Refuse to see him", "He is left in the corridor without care. Refusing an assessment abandons a person in crisis."],
    ]),
  ]),
  s("wy-l011", "liaison", "Child protection referral", "child", "child", 3, "UMS", "Refer to child protection clearly", "Your concern about a child's safety", [
    b("You need to report to Childline or the police.", [
      ["b", "Give clear facts: what you saw or heard, when, and your concern", "They act quickly. Facts help services respond."],
      ["h", "Wait until you are sure", "Delay may leave the child in danger."],
      ["o", "Give your opinion of the family without facts, since you know them well", "Opinions without facts are hard to act on."],
    ]),
  ]),
  s("wy-l012", "liaison", "Interpreting test results for a doctor", "assessment", "assessment", 3, "UMS", "Report test results clearly", "Neurologist asks for your test results", [
    b("You did memory testing.", [
      ["h", "Send only the raw scores", "The neurologist cannot interpret them."],
      ["o", "Write a long technical report full of test names and scaled scores for completeness", "The team skims it and misses your main finding. A long technical report is hard to use."],
      ["b", "Give a brief summary of strengths, weaknesses and what they suggest", "The neurologist uses your findings. Clear summaries help."],
    ]),
  ]),
  s("wy-l013", "liaison", "Liaison in maternity", "depression", "lifespan", 3, "MDS", "Plan perinatal care with obstetrics", "Pregnant woman with bipolar disorder", [
    b("The obstetrician asks for your input.", [
      ["b", "Share a plan for monitoring, delivery and the postpartum period", "She stays well after birth. Planning reduces postpartum relapse."],
      ["o", "Say nothing until after delivery, since pregnancy is the obstetrician's area", "Postpartum risk is high; plan early."],
      ["h", "Tell them to stop all her medicines", "Sudden stopping risks relapse."],
    ]),
  ]),
  s("wy-l014", "liaison", "Liaison for cancer patients", "depression", "depression", 3, "US", "Support oncology teams", "Oncologist refers a patient with low mood", [
    b("The patient has advanced cancer.", [
      ["o", "Say low mood is expected with cancer, so there is nothing to treat in this patient", "Depression in cancer is treatable."],
      ["h", "Refuse; it is not psychiatric", "She goes untreated and her last months are harder. Low mood in cancer is often treatable."],
      ["b", "Assess for depression and offer support, and advise the team on care", "Her mood improves. Liaison improves quality of life."],
    ]),
  ]),
  s("wy-l015", "liaison", "Capacity in a medical ward", "mse", "ethics-law", 4, "UMDS", "Assess capacity for a specific decision", "Surgeon asks if a patient has capacity", [
    b("The patient refuses an amputation.", [
      ["b", "Assess capacity for this decision: understanding, appreciation and communication", "She has capacity and her choice stands. Capacity is decision-specific."],
      ["h", "Say she lacks capacity because she has depression", "A diagnosis does not decide capacity."],
      ["o", "Say she has capacity because she is calm and polite throughout the conversation", "She is judged able to decide without anyone testing her understanding. Calm manner is not the test of capacity."],
    ]),
  ]),
  s("wy-l016", "liaison", "Liaison with a de-addiction centre", "substance", "substance", 2, "US", "Refer to de-addiction care", "Client, 35, alcohol dependence", [
    b("He agrees to detox.", [
      ["h", "Give him the address and say nothing more", "He loses the paper and never goes. A bare address is a weak handover."],
      ["b", "Call the centre with his consent, share the key facts and fix a date", "He attends. A warm handover improves follow-through."],
      ["o", "Tell him to find a centre himself, since he is an adult and should take responsibility", "He means to look but never does. Many people do not follow through without a warm handover."],
    ]),
  ]),
  s("wy-l017", "liaison", "Liaison in HIV care", "depression", "depression", 3, "US", "Support HIV adherence", "HIV clinic, patient missing medicines", [
    b("The team asks for help.", [
      ["o", "Tell the team to warn him of the consequences more strongly at his next visit", "He nods and keeps missing doses. Warnings rarely help when the barriers are not understood."],
      ["b", "Assess for depression, stigma and practical barriers", "He is depressed. Treating it improves adherence."],
      ["h", "Ignore it; it is not your area", "He keeps missing doses and his viral load climbs. Ignoring it leaves him at risk."],
    ]),
  ]),
  s("wy-l018", "liaison", "Liaison with a child's paediatrician", "child", "child", 2, "US", "Coordinate ADHD care", "Child with ADHD on medicine", [
    b("The paediatrician asks for behaviour updates.", [
      ["b", "Share progress with consent, including any side effects you notice", "Medicine is adjusted. Shared information helps."],
      ["h", "Change the medicine yourself", "The dose you suggest causes new side effects. Changing medicine is outside your scope."],
      ["o", "Do not share anything, since what happens in therapy stays in therapy", "The doctor keeps guessing about his behaviour. With consent, sharing helps the child."],
    ]),
  ]),
  s("wy-l019", "liaison", "Liaison in a prison", "schizophrenia", "ethics-law", 4, "MDS", "Arrange treatment for a prisoner", "Prisoner, 30, with psychosis", [
    b("The jail has no psychiatric ward.", [
      ["o", "Keep him in his cell and visit weekly, since there is nowhere else for him to go", "He worsens in his cell without treatment. He needs proper care, not occasional visits."],
      ["b", "Inform the prison medical officer and arrange transfer with the required Board permission", "He is transferred and treated. MHCA requires care for prisoners with mental illness."],
      ["h", "Leave it to the guards", "No one notices him becoming more unwell. Leaving care to guards is neglect."],
    ]),
  ]),
  s("wy-l020", "liaison", "Liaison with a geriatrician", "dementia", "neurocognitive", 3, "US", "Share findings in dementia care", "Geriatrician asks about behaviour", [
    b("The patient is agitated at night.", [
      ["b", "Describe the pattern and triggers you found, and suggest non-drug steps", "The team adjusts care and she settles."],
      ["h", "Suggest a strong sedative", "Increases falls and confusion."],
      ["o", "Say it is just dementia and nothing more can be done for her at night", "Her nights stay hard for everyone. Many causes of night agitation, such as pain, are treatable."],
    ]),
  ]),
  s("wy-l021", "liaison", "Liaison with a social worker", "schizophrenia", "psychosis", 2, "US", "Address social needs", "Patient, 40, homeless after discharge", [
    b("He has nowhere to go.", [
      ["h", "Discharge him to the street", "He sleeps outside and stops his medicine. Without housing he relapses quickly."],
      ["o", "Give him a list of shelters and wish him luck as he leaves the ward", "He cannot find a bed and spends the night on the street. A list alone may not get him there."],
      ["b", "Involve the social worker before discharge to arrange housing", "He has a place to stay and keeps his appointments."],
    ]),
  ]),
  s("wy-l022", "liaison", "Liaison with a dermatologist", "ocd", "ocd", 3, "US", "Coordinate care for skin picking", "Dermatologist refers a patient with sores", [
    b("The sores come from picking.", [
      ["b", "Offer habit reversal therapy and keep the dermatologist informed", "Picking reduces and sores heal."],
      ["o", "Say it is a skin problem only and leave the treatment to the dermatologist", "The sores keep reopening. Treating only the skin misses the behaviour behind it."],
      ["h", "Tell her to stop picking", "She tries, fails, and feels ashamed. Without help, she cannot simply stop."],
    ]),
  ]),
  s("wy-l023", "liaison", "Liaison with a cardiologist", "anxiety", "anxiety", 3, "US", "Support patients with cardiac anxiety", "Cardiologist refers a patient after normal tests", [
    b("He still fears a heart attack.", [
      ["h", "Order more heart tests", "Each normal test brings brief relief and more fear. More tests feed health anxiety."],
      ["b", "Offer CBT for health anxiety and keep the cardiologist informed", "His fear reduces and he stops attending the emergency room. CBT targets the worry itself."],
      ["o", "Reassure him once and discharge him, since the tests are normal and he is fit", "He is back in the clinic within a month. Reassurance alone fades fast."],
    ]),
  ]),
  s("wy-l024", "liaison", "Liaison with a neurologist", "dsm-somatic", "more-disorders", 3, "MDS", "Share care in functional seizures", "Neurologist diagnoses functional seizures", [
    b("The patient feels dismissed.", [
      ["o", "Tell her it is all psychological and that she can control the seizures if she wants to", "She feels blamed and her seizures continue. Saying she can control them is dismissive and untrue."],
      ["b", "Explain the diagnosis as real and treatable, and start therapy with the neurologist's support", "Seizures reduce. Joint explanation helps acceptance."],
      ["h", "Tell her she is faking", "She feels called a liar and leaves care. Saying she is faking is harmful and wrong."],
    ]),
  ]),
  s("wy-l025", "liaison", "Liaison with an ICU", "dementia", "neurocognitive", 4, "MDS", "Prevent delirium in intensive care", "ICU team asks for help with a delirious patient", [
    b("He is agitated after surgery.", [
      ["b", "Suggest reorientation, sleep protection, family visits and review of medicines", "Delirium settles. Non-drug steps help."],
      ["h", "Suggest restraints and sedatives", "He becomes more agitated and confused. Restraints and sedatives can worsen delirium."],
      ["o", "Say nothing can be done in the ICU and that it will settle when he leaves", "His delirium lasts days longer than it needed to. Much can be done in intensive care."],
    ]),
  ]),
  s("wy-l026", "liaison", "Liaison with an employer about adjustments", "anxiety", "anxiety", 2, "US", "Suggest reasonable adjustments", "Employee with anxiety", [
    b("She wants to return to work.", [
      ["h", "Tell her to hide her condition", "She struggles without support and goes off sick again. Hiding her condition leaves her alone."],
      ["o", "Tell the employer every detail of her condition so they can make the best decision", "Her manager now knows private details she never wanted shared. Too much information breaches her privacy."],
      ["b", "With consent, suggest a phased return and flexible hours", "She returns well and stays at work. Small adjustments made with consent support recovery."],
    ]),
  ]),
  s("wy-l027", "liaison", "Liaison with an IVF clinic", "depression", "lifespan", 2, "US", "Support infertility patients", "IVF clinic refers a distressed couple", [
    b("They have had three failed cycles.", [
      ["b", "Offer support for grief and stress, and liaise on timing of the next cycle", "They feel supported and less alone in the next cycle. Grief after failed IVF is real."],
      ["o", "Tell them to stay positive, since stress itself lowers the success rate of IVF", "They feel blamed for their stress. Telling them to stay positive adds pressure."],
      ["h", "Refuse; it is not a mental illness", "They struggle alone through the next cycle. Distress deserves support even without a diagnosis."],
    ]),
  ]),
  s("wy-l028", "liaison", "Liaison with a school after a suicide", "suicide", "suicide", 3, "UMS", "Advise a school on postvention", "Principal calls after a student suicide", [
    b("She asks how to tell students.", [
      ["o", "Tell her to hold a memorial with photos and the story of how he died, so students understand", "Method details raise contagion risk."],
      ["b", "Suggest a calm, factual message, support for students, and screening for those at risk", "Students are supported and at-risk peers identified."],
      ["h", "Tell her to say nothing", "Rumours spread and students feel shut out. Silence does not protect them."],
    ]),
  ]),
  s("wy-l029", "liaison", "Liaison with a GP about lithium", "stabilisers", "stabilisers", 3, "MDS", "Share monitoring responsibilities", "GP will continue lithium", [
    b("You are handing over care.", [
      ["b", "Send a plan with blood test schedule, target levels and warning signs", "The GP monitors safely and catches a rising level. A written plan prevents gaps."],
      ["h", "Assume the GP knows", "No blood tests are booked for months. Assuming the GP knows lets monitoring lapse."],
      ["o", "Tell the patient to remember it all himself and pass it on to his GP", "He forgets the schedule after a few weeks. Patients should not carry the whole plan alone."],
    ]),
  ]),
  s("wy-l030", "liaison", "Liaison with a surgeon about an older patient", "dementia", "neurocognitive", 3, "MDS", "Plan to reduce postoperative delirium", "Older patient before hip surgery", [
    b("The surgeon asks how to prevent confusion.", [
      ["h", "Suggest a sleeping pill each night", "She becomes confused after surgery. Sleeping pills raise delirium risk in older people."],
      ["b", "Advise glasses and hearing aids, early mobility, hydration and avoiding sedatives", "She has no delirium after surgery."],
      ["o", "Say nothing can prevent it, since confusion is normal after surgery at her age", "Simple steps are skipped and she becomes confused. Many steps help prevent delirium."],
    ]),
  ]),
  s("wy-l031", "liaison", "Liaison with the women's helpline", "ptsd", "trauma", 3, "US", "Connect a survivor to services", "Woman experiencing domestic violence", [
    b("She wants help but is afraid.", [
      ["o", "Give her the number and let her call when she is ready, without offering anything else", "She never calls and the violence continues. A number alone may not be enough."],
      ["b", "With her consent, help her call 181 or a local protection officer from your room", "She speaks to a protection officer."],
      ["h", "Call her husband to talk", "He becomes angry and she is hurt that night. Calling an abuser puts the survivor at risk."],
    ]),
  ]),
  s("wy-l032", "liaison", "Liaison with a psychiatrist about medicine side effects", "antipsychotics", "antipsychotics", 2, "MDS", "Report side effects", "Your client on risperidone", [
    b("She has stopped having periods.", [
      ["b", "With consent, tell her psychiatrist so prolactin can be checked", "Her prolactin is checked and the medicine is changed. Reporting with consent fixes the problem."],
      ["h", "Tell her to stop the medicine", "Outside your scope; risks relapse."],
      ["o", "Ignore it, since periods often change with stress and it is probably nothing", "She stops her medicine secretly and relapses. Ignored side effects lead to quiet stopping."],
    ]),
  ]),
  s("wy-l033", "liaison", "Liaison with a child welfare committee", "child", "child", 4, "UMS", "Give the CWC useful information", "CWC asks about a child in care", [
    b("They need to decide placement.", [
      ["o", "Recommend sending the child home quickly, since children always do best with their parents", "The child is sent back to an unsafe home. Going home is not always safe."],
      ["h", "Refuse to share", "The child's interest needs your input."],
      ["b", "Share a clear account of the child's needs, wishes and risks", "The CWC makes a well-informed decision."],
    ]),
  ]),
  s("wy-l034", "liaison", "Liaison with a college", "suicide", "suicide", 3, "US", "Support a student's return", "Student returning after a suicide attempt", [
    b("The college wants to know if she is 'safe'.", [
      ["b", "With consent, share a support plan, not her full history", "She returns with support and her privacy kept. Sharing a plan, not a history, protects both."],
      ["h", "Share all details", "Her history spreads and she is avoided. Sharing all details is a breach and brings stigma."],
      ["o", "Tell them she must stay home for a full year to recover before she can return", "She loses friends and routine and feels worse. Isolation may harm recovery."],
    ]),
  ]),
  s("wy-l035", "liaison", "Liaison with an anaesthetist about ECT", "depression", "depression", 3, "MDS", "Share medical details before ECT", "Patient booked for ECT", [
    b("The anaesthetist asks about medicines.", [
      ["h", "Say you do not know", "The anaesthetist has to delay the procedure. Not knowing the medicines is risky for anaesthesia."],
      ["o", "Tell them to ask the patient, since it is their own medicine list to know", "She forgets one tablet and it causes a problem under anaesthesia. Patient recall may be inaccurate."],
      ["b", "Share an accurate medicine list and medical history", "ECT goes ahead safely. Accurate information protects the patient."],
    ]),
  ]),
  s("wy-l036", "liaison", "Liaison with a TB programme", "depression", "depression", 3, "US", "Support TB treatment adherence", "TB patient missing doses", [
    b("The programme asks for help.", [
      ["b", "Assess for depression, alcohol and stigma, and plan support", "He completes treatment once his drinking is addressed. Finding the barrier fixes adherence."],
      ["o", "Tell the programme to punish missed doses by withdrawing his support allowance", "He feels punished and stops coming. Penalties do not address the causes."],
      ["h", "Ignore it", "He keeps missing doses and develops drug-resistant TB. Ignoring it is dangerous for him and others."],
    ]),
  ]),
  s("wy-l037", "liaison", "Liaison with a neonatal unit", "depression", "lifespan", 3, "US", "Support parents in the NICU", "Mother of a premature baby", [
    b("She is not sleeping and cries constantly.", [
      ["o", "Tell her this is normal for a mother in the NICU and will pass when the baby goes home", "Her depression goes unnoticed for months. Calling it normal may miss depression."],
      ["b", "Screen for depression and anxiety and offer support", "She is supported and her mood improves. Screening finds what needs help."],
      ["h", "Tell her to be strong for her baby", "She hides her distress. Telling her to be strong silences her."],
    ]),
  ]),
  s("wy-l038", "liaison", "Liaison with a rehabilitation centre", "schizophrenia", "psychosis", 3, "US", "Plan vocational rehabilitation", "Patient, 35, stable, wants to work", [
    b("He asks about work.", [
      ["h", "Tell him he cannot work", "He loses hope and stops treatment. Saying he cannot work is untrue and harmful."],
      ["b", "Refer him to supported employment", "He finds a job and his confidence grows. Supported employment works."],
      ["o", "Tell him to wait a few more years until he is fully recovered before trying work", "He waits and slowly loses hope. Work itself aids recovery."],
    ]),
  ]),
  s("wy-l039", "liaison", "Liaison in a disability certificate", "child", "ethics-law", 4, "UMS", "Support a disability certificate honestly", "Parent of a child with intellectual disability", [
    b("They need a disability certificate for benefits.", [
      ["b", "Do a proper assessment and refer to the certifying medical board", "The certificate is issued correctly. RPwD benefits follow."],
      ["o", "Write a certificate yourself to save them time and the trip to the board", "The certificate is rejected and the family loses time. A certificate outside the board process may not be valid."],
      ["h", "Inflate the severity to increase benefits", "The certificate is challenged and benefits withdrawn. Inflating severity is dishonest."],
    ]),
  ]),
  s("wy-l040", "liaison", "Liaison with a psychiatrist about a teenager", "child", "child", 3, "UMS", "Escalate a teen with worsening depression", "Teen, 16, worsening despite therapy", [
    b("She now has suicidal thoughts.", [
      ["o", "Continue therapy and wait to see if she improves over the next month", "Her risk rises while you wait. Rising suicidal thoughts need escalation now."],
      ["b", "Refer urgently to a child psychiatrist with consent and a clear summary", "She is reviewed quickly and is safer. Clear, urgent referral gets the right help."],
      ["h", "Tell her parents she is attention-seeking", "Her parents stop taking her seriously. Calling it attention-seeking dismisses risk."],
    ]),
  ]),
  s("wy-l041", "liaison", "Liaison with a nursing home", "dementia", "neurocognitive", 3, "US", "Advise a nursing home", "Nursing home asks about a resident who shouts", [
    b("She shouts at night.", [
      ["b", "Suggest checking for pain, toilet needs and routines", "Pain is treated and she settles."],
      ["h", "Suggest restraint", "She becomes frightened and bruised. Restraint is harmful."],
      ["o", "Suggest moving her to a psychiatric hospital, where they are better able to cope with her", "She is moved, more confused in a new place, when pain was the cause. Transfer is often unnecessary."],
    ]),
  ]),
  s("wy-l042", "liaison", "Liaison with a GP about benzodiazepines", "stabilisers", "stabilisers", 3, "MDS", "Plan a benzodiazepine taper", "GP asks about a patient on long-term alprazolam", [
    b("She has taken it for years.", [
      ["h", "Tell the GP to stop it today", "She has a seizure on day three. Stopping long-term benzodiazepines suddenly risks seizures."],
      ["b", "Suggest a slow taper with psychological support", "She tapers off safely over months. Slow tapers with support work."],
      ["o", "Tell the GP to continue forever, since stopping is too risky after so many years", "She stays dependent and at risk of falls. Continuing forever lets dependence continue."],
    ]),
  ]),
  s("wy-l043", "liaison", "Liaison with a pain clinic", "dsm-substance", "substance", 4, "MDS", "Address opioid misuse in pain", "Pain clinic patient using extra tramadol", [
    b("The clinic asks for help.", [
      ["o", "Tell them to stop the tramadol immediately and refuse all further prescriptions", "Withdrawal and pain may worsen."],
      ["b", "Assess for opioid use disorder and plan pain and addiction care together", "His pain and addiction are both treated. Joint care beats either alone."],
      ["h", "Ignore it", "He overdoses on mixed tablets. Ignoring misuse risks overdose."],
    ]),
  ]),
  s("wy-l044", "liaison", "Liaison with an eye doctor", "dementia", "neurocognitive", 3, "MDS", "Recognise Charles Bonnet syndrome", "Eye doctor refers a woman who sees children", [
    b("She has poor vision and knows they are not real.", [
      ["b", "Explain Charles Bonnet syndrome and reassure her", "She is relieved and no medicine is needed. Insight and visual loss point to Charles Bonnet syndrome."],
      ["o", "Start an antipsychotic to stop the visions, since they are a type of hallucination", "She has side effects for no benefit. An antipsychotic is unnecessary here."],
      ["h", "Tell her she is going mad", "She fears she is losing her mind. Telling her she is going mad is harmful."],
    ]),
  ]),
  s("wy-l045", "liaison", "Liaison with a legal aid service", "interview", "ethics-law", 3, "US", "Link a patient with legal aid", "Patient worried about property rights", [
    b("His brother is taking his share.", [
      ["h", "Give legal advice yourself", "Your advice is wrong and he loses his claim. Legal advice is outside your scope."],
      ["b", "Refer him to legal aid services; MHCA gives a right to free legal aid", "He gets free legal help. Legal aid is a right for persons with mental illness under MHCA."],
      ["o", "Tell him it is a family matter and that he should just sort it out with his brother", "He loses his share. Calling it a family matter leaves him unprotected."],
    ]),
  ]),
  s("wy-l046", "liaison", "Liaison with an endocrinologist", "eating", "more-disorders", 4, "MDS", "Coordinate care in insulin omission", "Diabetic teen omitting insulin", [
    b("The endocrinologist suspects an eating disorder.", [
      ["o", "Treat the eating disorder separately and do not involve the diabetes team in your work", "The two teams give opposite advice. Separate care splits the patient."],
      ["b", "Plan joint care with diabetes and eating disorder teams", "She resumes insulin and gains stability."],
      ["h", "Ignore it", "She is admitted with ketoacidosis. Ignoring insulin omission is dangerous."],
    ]),
  ]),
  s("wy-l047", "liaison", "Liaison with a school about bullying", "child", "child", 2, "US", "Address bullying with school", "Child being bullied", [
    b("Parents want you to talk to the school.", [
      ["b", "With consent, share concerns and plan protection with the school", "The bullying stops and he settles. Working with the school with consent protects him."],
      ["h", "Tell the child to fight back", "He is hurt worse in a fight. Telling a child to fight back increases harm."],
      ["o", "Tell the parents to move schools quickly without talking to the school first", "Problem may continue elsewhere."],
    ]),
  ]),
  s("wy-l048", "liaison", "Liaison with a gynaecologist", "depression", "lifespan", 2, "US", "Support perimenopausal mood", "Gynaecologist refers a woman with low mood", [
    b("She is perimenopausal.", [
      ["o", "Say it is hormones and leave it to the gynaecologist to treat with hormone therapy", "Depression may need treatment."],
      ["b", "Assess for depression and plan care together", "She improves with joint care. Depression in perimenopause needs assessment."],
      ["h", "Refuse; it is hormonal", "She stays low for months. Calling it hormonal leaves suffering untreated."],
    ]),
  ]),
  s("wy-l049", "liaison", "Liaison with a burns unit", "suicide", "suicide", 4, "UMS", "Assess after self-immolation", "Burns unit asks about a patient who set herself on fire", [
    b("She is medically stable.", [
      ["h", "Wait until discharge", "Risk and trauma need early care."],
      ["b", "Assess risk, trauma and family situation, and plan support", "You find dowry harassment and arrange protection."],
      ["o", "Assess only her mood and leave the family situation to the social worker to handle", "The harassment continues after discharge. Assessing only mood misses key causes."],
    ]),
  ]),
  s("wy-l050", "liaison", "Liaison with a psychiatrist about ECT consent", "depression", "ethics-law", 4, "UMDS", "Respect an advance directive", "Patient has an advance directive refusing ECT", [
    b("The team wants to give ECT.", [
      ["o", "Support ECT since the family agrees and the patient is too ill to decide now", "An advance directive is binding."],
      ["b", "Remind the team of the directive and the Board process", "The team follows the law and treats with other options. Directives bind the team."],
      ["h", "Ignore the directive", "The patient's legal rights are breached. Ignoring the directive breaches MHCA."],
    ]),
  ]),
  s("wy-l051", "liaison", "Liaison with a cancer palliative team", "depression", "depression", 3, "US", "Support end-of-life distress", "Palliative patient wishing to die", [
    b("He says, 'I want this to end.'", [
      ["b", "Assess whether this is depression, pain, or existential distress, and support", "His pain is uncontrolled. Treating it helps."],
      ["h", "Assume he is suicidal and admit him", "He is admitted against his wishes when pain relief was what he needed. Assuming suicidality may be inappropriate."],
      ["o", "Assume it is normal at the end of life and move on without asking any more", "His uncontrolled pain is missed. Assuming it is normal may miss treatable distress."],
    ]),
  ]),
  s("wy-l052", "liaison", "Liaison with a court about guardianship", "child", "ethics-law", 4, "UMS", "Support limited guardianship", "Court asks about a man with intellectual disability", [
    b("His family wants full control of his life.", [
      ["o", "Support full guardianship, since the family knows him best and wants to protect him", "RPwD favours limited guardianship."],
      ["b", "Describe his abilities and areas needing support, favouring limited guardianship", "He keeps his decision-making rights."],
      ["h", "Refuse to help the court", "The court decides without your knowledge of him. Refusing leaves the court uninformed."],
    ]),
  ]),
  s("wy-l053", "liaison", "Liaison with a GP about suicide risk", "suicide", "suicide", 3, "UMS", "Share risk information safely", "GP prescribing to a patient at risk", [
    b("She is at high risk of overdose.", [
      ["h", "Say nothing to the GP", "She may be given a large supply."],
      ["b", "With consent or under safety exceptions, advise smaller supplies", "Supplies are limited. Means restriction saves lives."],
      ["o", "Tell the patient to ask for smaller supplies herself at her next GP visit", "She is given a month's supply and overdoses. She may not ask for smaller supplies herself."],
    ]),
  ]),
  s("wy-l054", "liaison", "Liaison with a hospital chaplain", "depression", "depression", 2, "US", "Use spiritual support", "Patient wants to see a priest", [
    b("He is very religious.", [
      ["b", "Arrange a visit with his consent", "He feels comforted and calmer. Spiritual support can be a strong resource."],
      ["o", "Tell him that faith and therapy should be kept separate, so the priest should wait", "He feels his faith is unwelcome. Keeping them apart misses a resource."],
      ["h", "Refuse", "He feels disrespected and distrusts the team. Refusing disrespects his values."],
    ]),
  ]),
  s("wy-l055", "liaison", "Liaison with a traditional healer", "how-patients-talk", "interview-mse", 4, "US", "Work alongside a faith healer", "Family taking a patient to a healer", [
    b("They want to continue rituals.", [
      ["o", "Tell them to stop all rituals immediately, since these delay proper medical care", "They stop the medicine instead of the rituals. Demands to stop everything may stop treatment."],
      ["b", "Respect their beliefs, ask that rituals do not replace treatment, and ban harmful practices", "They continue both safely. Respect plus clear limits keeps them in care."],
      ["h", "Support chaining at the healer", "He is chained and injured. Chaining is prohibited under MHCA."],
    ]),
  ]),
  s("wy-l056", "liaison", "Liaison with a referral back to GP", "depression", "depression", 2, "US", "Discharge with a plan", "Client recovered after therapy", [
    b("You plan to discharge.", [
      ["h", "Close the file without telling the GP", "The GP is unaware and misses early relapse. Closing without a summary leaves gaps."],
      ["b", "Send the GP a summary and relapse plan", "Relapse is caught early by the GP. A plan carries care forward."],
      ["o", "Tell the client to update her GP herself at her next visit, if she wants to", "She forgets and the GP never hears. Passing it on may not happen."],
    ]),
  ]),
  s("wy-l057", "liaison", "Liaison with a mental health review board", "schizophrenia", "ethics-law", 4, "UMS", "Prepare for a Board review", "Patient appeals against supported admission", [
    b("The Board will review.", [
      ["b", "Prepare a clear account of the criteria for admission and the plan", "The Board decides fairly with clear information. Preparation protects his rights."],
      ["o", "Tell the patient the Board will not listen to him, so there is no point appealing", "He drops the appeal. He has a right to review."],
      ["h", "Discourage the appeal", "He feels pressured and gives up his right. Discouraging the appeal violates his rights."],
    ]),
  ]),
  s("wy-l058", "liaison", "Liaison with a school about ADHD accommodations", "child", "child", 2, "US", "Recommend accommodations", "Child with ADHD struggling in exams", [
    b("The school asks what helps.", [
      ["o", "Ask the school to excuse him from exams entirely, since he cannot concentrate long enough", "He misses exams he could have managed. Full exemption is not necessary."],
      ["b", "Suggest extra time, seating near the front and breaks", "His grades improve with small changes. Simple accommodations help."],
      ["h", "Say nothing helps", "The school does nothing to help him. Saying nothing helps is untrue."],
    ]),
  ]),
  s("wy-l059", "liaison", "Liaison with a forensic team", "personality", "personality", 4, "MDS", "Share violence risk information", "Probation officer asks about risk", [
    b("Your client has a history of violence.", [
      ["h", "Share all session content", "Breaches confidentiality beyond need."],
      ["b", "With consent or legal requirement, share risk-relevant information only", "Risk is managed and trust kept."],
      ["o", "Refuse to share anything at all, even if there is a clear risk to others", "Someone is hurt when a warning sign was known. Refusing to share in clear risk may leave others at risk."],
    ]),
  ]),
  s("wy-l060", "liaison", "Liaison with a community health worker", "schizophrenia", "psychosis", 2, "US", "Work with ASHA workers", "Rural patient with schizophrenia", [
    b("He lives far from the clinic.", [
      ["b", "With consent, involve the local ASHA worker to support medicine and follow-up", "He stays well with local support. Community workers bridge distance."],
      ["o", "Ask him to travel to the clinic every week, however far it is from his village", "He drops out after two long trips. Weekly travel from far away is hard to sustain."],
      ["h", "Discharge him", "He relapses without follow-up. Discharging him loses contact."],
    ]),
  ]),
  s("wy-l061", "liaison", "Full case: liaison in a complex medical patient", "depression", "depression", 5, "MDS", "Coordinate care across teams", "Man, 60, kidney failure, depression, refusing dialysis", [
    b("The renal team asks whether to respect his refusal.", [
      ["o", "Say he must have dialysis because depression clouds his judgement completely", "Depression does not automatically remove capacity."],
      ["b", "Assess capacity and depression, and work with the team and family", "Depression is treated; he later decides to continue dialysis."],
      ["h", "Refuse to get involved", "The renal team is left without help. Refusing to get involved leaves a hard decision unsupported."],
    ]),
    b("He has capacity but is depressed.", [
      ["b", "Offer treatment for depression and revisit the decision together over time", "His mood improves and he reconsiders."],
      ["h", "Override his decision", "He feels overruled and distrusts the team. Overriding a capable person's decision breaks the law and trust."],
      ["o", "Accept the decision immediately and stop all contact, since he has made his choice", "He stops dialysis while still depressed. Accepting it at once misses treatable depression."],
    ], "Your assessment is complete."),
  ]),
];
