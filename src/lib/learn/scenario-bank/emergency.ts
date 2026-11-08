import type { Scenario } from "../scenarios";
import { b, s } from "./make";

/** Emergencies: medical and psychiatric situations that need action within minutes or hours. */
export const EMERGENCY: Scenario[] = [
  s("wy-e001", "emergency", "Neuroleptic malignant syndrome", "antipsychotics", "antipsychotics", 3, "UMDS", "Act on NMS", "Ward patient, 28, on haloperidol", [
    b("The nurse says he is hot, stiff and confused, and his blood pressure is jumping.", [
      ["o", "Give paracetamol for the fever and recheck in four hours, since it may be a simple infection", "The fever falls a little but the rigidity worsens. NMS can kill; antipyretics alone do not treat it."],
      ["b", "Stop the antipsychotic and call the medical team now", "CK is very high. He is moved to medical care and recovers. Stopping the drug and urgent medical care are the key steps."],
      ["h", "Give another haloperidol dose to calm him", "More antipsychotic worsens NMS and can be fatal."],
    ]),
  ]),
  s("wy-e002", "emergency", "Serotonin syndrome", "antidepressants", "antidepressants", 3, "UMDS", "Act on serotonin syndrome", "Ms Rao, 35, on fluoxetine, given tramadol", [
    b("Hours later she is agitated, sweating, shivering and her legs jerk.", [
      ["h", "Reassure her it is anxiety and give her another tramadol for the pain", "More serotonergic drug worsens a dangerous reaction."],
      ["b", "Stop the serotonergic drugs and get urgent medical care", "She is treated and settles within a day. Fast onset after combining serotonergic drugs is the clue."],
      ["o", "Ask her to rest in a cool room and see if it settles, since it may pass on its own", "Mild cases may settle, but jerking and agitation need medical review."],
    ]),
  ]),
  s("wy-e003", "emergency", "Lithium toxicity", "stabilisers", "stabilisers", 2, "CUMDS", "Recognise lithium toxicity", "Mr Pillai, 55, on lithium", [
    b("After a week of vomiting and diarrhoea he is shaky, unsteady and slurring.", [
      ["b", "Send him for an urgent lithium level and kidney tests, and hold the next dose", "His level is high. He is treated in time. Dehydration raises lithium levels."],
      ["o", "Tell him to drink plenty of fluids and continue his usual lithium until his next review", "Fluids help, but continuing lithium with toxicity signs is dangerous."],
      ["h", "Double his dose because the illness may have reduced absorption", "Doubling a toxic drug can be fatal."],
    ]),
  ]),
  s("wy-e004", "emergency", "Delirium tremens", "substance", "substance", 3, "UMDS", "Recognise delirium tremens", "Mr Gill, 48, three days after admission", [
    b("He is confused, sees insects, is sweating and his pulse is 130.", [
      ["o", "Ask the family to sit with him and reassure him until he settles", "Comfort helps, but this is a medical emergency needing treatment now."],
      ["h", "Give him alcohol to calm him", "Not a safe or accepted treatment in hospital."],
      ["b", "Call the medical team urgently for benzodiazepines, thiamine and monitoring", "He settles with treatment. Delirium tremens can kill without prompt care."],
    ]),
  ]),
  s("wy-e005", "emergency", "Wernicke's encephalopathy", "substance", "substance", 3, "UMDS", "Give thiamine before glucose", "Man, 50, heavy drinker, confused", [
    b("The emergency team plans to give a glucose drip.", [
      ["b", "Ask that thiamine be given first or with the glucose", "Thiamine prevents Wernicke's worsening. Glucose alone can precipitate it in deficient patients."],
      ["h", "Agree with glucose alone; his sugar is low", "Glucose without thiamine can tip him into Wernicke's."],
      ["o", "Wait for blood results before giving anything, so that treatment can be targeted exactly", "Delay risks permanent brain damage."],
    ]),
  ]),
  s("wy-e006", "emergency", "Opioid overdose", "substance", "substance", 2, "CUMS", "Respond to opioid overdose", "Young man, unresponsive in a hostel", [
    b("He has pinpoint pupils and is breathing very slowly.", [
      ["h", "Throw cold water on him and slap him awake", "Wastes time and does not reverse the overdose."],
      ["o", "Put him in the recovery position and wait for the ambulance to arrive", "Good first step, but without naloxone his breathing may stop."],
      ["b", "Call for help, support his breathing and give naloxone if available", "He starts breathing. Naloxone reverses opioid overdose."],
    ]),
  ]),
  s("wy-e007", "emergency", "Catatonia", "schizophrenia", "psychosis", 3, "MDS", "Treat catatonia promptly", "Woman, 30, mute and not eating", [
    b("She has not eaten or drunk for two days and holds odd postures.", [
      ["o", "Wait for her to start eating again on her own, while the nurses keep offering food", "Dehydration and clots can develop. Catatonia needs treatment now."],
      ["b", "Alert the psychiatrist for a lorazepam trial and check fluids and vital signs", "She responds within hours. Catatonia often responds to lorazepam; ECT is used if not."],
      ["h", "Give haloperidol to treat the psychosis", "Antipsychotics can worsen catatonia and raise NMS risk."],
    ]),
  ]),
  s("wy-e008", "emergency", "Acute agitation", "schizophrenia", "psychosis", 3, "MDS", "Use least restrictive steps first", "Man, 25, shouting in the emergency room", [
    b("He is pacing and shouting but has not hit anyone.", [
      ["b", "Talk calmly, give space, offer oral medicine, and have help ready", "He accepts oral medicine. De-escalation and choices come before force."],
      ["h", "Restrain him at once to be safe", "Restraint without need raises injury risk and breaks trust."],
      ["o", "Give an injection immediately before he gets worse, so the staff are not put at risk", "May be needed later, but oral options and talking come first."],
    ]),
  ]),
  s("wy-e009", "emergency", "Acute dystonia", "antipsychotics", "antipsychotics", 2, "CUMS", "Treat acute dystonia", "Boy, 17, after a haloperidol injection", [
    b("His eyes roll upward and his neck twists.", [
      ["o", "Reassure him that it will wear off by itself, and ask him to lie down until it does", "It is painful and frightening; it needs treatment."],
      ["h", "Assume he is putting it on", "Dismissing a drug reaction leaves him in pain."],
      ["b", "Ask for an anticholinergic such as procyclidine and stay with him", "It eases within minutes. Acute dystonia responds quickly to anticholinergics."],
    ]),
  ]),
  s("wy-e010", "emergency", "Clozapine and fever", "antipsychotics", "antipsychotics", 3, "MDS", "Check white cells on clozapine", "Mr Joseph, 34, on clozapine", [
    b("He has a fever and sore throat.", [
      ["b", "Arrange a same-day full blood count", "His neutrophils are low; clozapine is stopped in time. Infection signs on clozapine need urgent bloods."],
      ["o", "Suggest gargles and rest for a few days, since sore throats are common and usually viral", "Usually viral, but on clozapine you must check white cells."],
      ["h", "Tell him to stop clozapine on his own", "Sudden stopping risks relapse; the decision needs the prescriber."],
    ]),
  ]),
  s("wy-e011", "emergency", "Self-poisoning", "suicide", "suicide", 2, "CUMS", "Get medical care first", "Woman, 22, took tablets an hour ago", [
    b("She tells you in a session that she took a strip of her mother's tablets before coming.", [
      ["h", "Continue the session and talk about why she did it", "Medical danger comes first; talk can wait."],
      ["b", "Send her to emergency care now with the strip, and go with her or arrange someone to", "The doctors know what she took and treat her in time."],
      ["o", "Call her mother to take her home and keep a close eye on her through the night", "Without medical review, a dangerous overdose may be missed."],
    ]),
  ]),
  s("wy-e012", "emergency", "Paracetamol overdose", "suicide", "suicide", 3, "MDS", "Know that paracetamol overdose looks well at first", "Student, 19, took paracetamol eight hours ago", [
    b("She feels fine and wants to leave.", [
      ["o", "Let her go and ask her to come back if she feels unwell over the next day or two", "Liver damage can appear a day later. She needs blood tests now."],
      ["b", "Insist on urgent blood tests and antidote treatment", "Her levels are high and she receives the antidote. Looking well does not mean safe."],
      ["h", "Tell her paracetamol is harmless", "False. It is a common cause of fatal overdose."],
    ]),
  ]),
  s("wy-e013", "emergency", "Hypoglycaemia", "anxiety", "anxiety", 2, "MDS", "Check sugar in a diabetic with sudden symptoms", "Mr Desai, 60, with diabetes", [
    b("In a session he becomes sweaty, shaky and confused.", [
      ["b", "Give him something sugary if he can swallow and call for medical help", "He improves within minutes. Low sugar can look like panic."],
      ["h", "Treat it as a panic attack with breathing exercises", "Low sugar can quickly lead to fits or coma."],
      ["o", "Ask him to lie down and rest for a while, and see whether it passes on its own", "Delay can be dangerous if the sugar keeps falling."],
    ]),
  ]),
  s("wy-e014", "emergency", "Seizure in clinic", "neuroscience", "brain", 2, "CUS", "Give seizure first aid", "Client, 25, starts having a fit", [
    b("He falls and starts jerking.", [
      ["o", "Hold him down firmly so he does not hurt himself, and call someone to help you", "Holding someone down can cause injury."],
      ["h", "Put something in his mouth so he does not bite his tongue", "Objects in the mouth cause injury and choking."],
      ["b", "Move objects away, cushion his head, time the seizure, and put him on his side when it stops", "He recovers. Call an ambulance if it lasts over five minutes."],
    ]),
  ]),
  s("wy-e015", "emergency", "Refeeding risk", "eating", "more-disorders", 4, "MDS", "Feed safely in severe anorexia", "Girl, 17, BMI 13, admitted", [
    b("Her mother wants to feed her large meals at once.", [
      ["b", "Explain that feeding must start slowly with daily blood tests", "Phosphate is monitored and she avoids refeeding syndrome."],
      ["h", "Agree, as she urgently needs weight", "Rapid feeding can cause dangerous shifts in phosphate and heart failure."],
      ["o", "Suggest she eat only fruit for the first week so her stomach can adjust gently", "Too little and the wrong nutrients; a medical plan is needed."],
    ]),
  ]),
  s("wy-e016", "emergency", "Postpartum psychosis", "schizophrenia", "lifespan", 3, "MDS", "Treat postpartum psychosis as an emergency", "Mother, 26, a week after delivery", [
    b("She is confused, not sleeping and says the baby is a devil.", [
      ["o", "Arrange an outpatient appointment for next week and ask the family to help with the baby", "Postpartum psychosis can worsen within hours."],
      ["b", "Arrange same-day psychiatric assessment and make sure she is not alone with the baby", "She is admitted. Mother and baby are safe."],
      ["h", "Tell the family it is exhaustion", "Missing it risks suicide or infanticide."],
    ]),
  ]),
  s("wy-e017", "emergency", "Head injury with confusion", "neuroscience", "brain", 3, "UMS", "Do not blame alcohol for everything", "Man, 40, drunk with a cut on his head", [
    b("He is getting drowsier over an hour.", [
      ["h", "Let him sleep it off", "Drowsiness after head injury may mean bleeding in the brain."],
      ["o", "Wake him every hour to check on him, and send him home if he answers questions", "Better, but worsening drowsiness needs a scan now."],
      ["b", "Ask for urgent medical review and a head scan", "He has a bleed and is operated on. Do not assume it is alcohol."],
    ]),
  ]),
  s("wy-e018", "emergency", "Acute mania with dehydration", "bipolar", "bipolar", 4, "MDS", "Notice physical risk in mania", "Woman, 30, manic for a week", [
    b("She has not eaten or drunk properly for days and is exhausted.", [
      ["b", "Arrange admission for treatment and fluids", "She is rehydrated and treated. Exhaustion and dehydration in mania can be dangerous."],
      ["o", "Send her home with a family member and ask them to make her eat and drink more", "She will not stay still to eat. She needs care now."],
      ["h", "Wait until she calms down by herself", "Mania can last weeks; physical harm happens first."],
    ]),
  ]),
  s("wy-e019", "emergency", "Hyponatraemia", "antidepressants", "antidepressants", 4, "MDS", "Recognise low sodium in an older adult", "Mrs Menon, 79, started citalopram", [
    b("Two weeks later she is confused and vomiting.", [
      ["o", "Assume her dementia is progressing and increase her support at home", "New confusion in two weeks is not normal progression."],
      ["h", "Increase the antidepressant", "Her sodium falls further and she becomes drowsier. A higher dose of the likely cause worsens the problem."],
      ["b", "Ask for sodium to be checked urgently", "Sodium is 121. The drug is stopped and she recovers."],
    ]),
  ]),
  s("wy-e020", "emergency", "Thyroid storm", "anxiety", "anxiety", 5, "MDS", "Recognise thyroid storm", "Woman, 34, with untreated hyperthyroidism", [
    b("She has a fever of 40, a pulse of 160, vomiting and confusion.", [
      ["b", "Send her to emergency care immediately", "She is treated for thyroid storm. Fever and confusion separate it from panic."],
      ["h", "Teach breathing exercises for panic", "This is a medical emergency that can kill."],
      ["o", "Ask her to take her thyroid tablets and come back tomorrow if she still feels unwell", "By the next day she is in shock. Thyroid storm needs hospital treatment within hours, not tablets at home."],
    ]),
  ]),
  s("wy-e021", "emergency", "Sudden blindness", "dsm-somatic", "more-disorders", 4, "MDS", "Rule out organic causes before functional diagnosis", "Woman, 28, sudden loss of vision after an argument", [
    b("The team says it is 'hysterical'.", [
      ["o", "Agree and start therapy, since the timing after a stressor fits a functional problem", "Stress does not prove a functional cause."],
      ["b", "Ask for an urgent eye and neurology review first", "She has optic neuritis. Organic causes must be excluded."],
      ["h", "Tell her she is pretending", "She is sent home and her vision does not return. Calling a symptom fake before tests is harmful and often wrong."],
    ]),
  ]),
  s("wy-e022", "emergency", "Stimulant intoxication", "substance", "substance", 3, "MDS", "Recognise stimulant toxicity", "Man, 23, after a party", [
    b("He is agitated, very hot, with a racing heart and chest pain.", [
      ["h", "Let him sleep it off in a quiet room", "Overheating and heart damage can kill."],
      ["b", "Get urgent medical care for temperature, heart and blood pressure", "He is cooled and monitored. Stimulants can cause heart attack and fits."],
      ["o", "Give him water and a fan, and check on him in an hour to see if he has settled", "Helpful but not enough for chest pain and high temperature."],
    ]),
  ]),
  s("wy-e023", "emergency", "Clozapine and constipation", "antipsychotics", "antipsychotics", 4, "MDS", "Take bowel symptoms on clozapine seriously", "Mr Das, 45, on clozapine", [
    b("No bowel movement for five days, swollen belly and vomiting.", [
      ["o", "Give a laxative and check again in two days, since constipation is very common on clozapine", "This may be bowel obstruction; delay can be fatal."],
      ["h", "Ignore it; constipation is common", "Clozapine bowel problems can kill."],
      ["b", "Arrange urgent medical assessment", "He has a blockage and is treated in time."],
    ]),
  ]),
  s("wy-e024", "emergency", "Organophosphate poisoning", "suicide", "suicide", 2, "CUMS", "Act on pesticide poisoning", "Farmer, 35, drank pesticide", [
    b("He is drooling and sweating with pinpoint pupils.", [
      ["b", "Rush him to hospital with the container", "He gets atropine early. Organophosphates kill quickly."],
      ["o", "Make him vomit first at home, then take him to the nearest clinic in the morning", "Vomiting can cause choking; delay costs lives."],
      ["h", "Give him milk and wait", "A home remedy wastes vital time."],
    ]),
  ]),
  s("wy-e025", "emergency", "Sudden severe headache", "neuroscience", "brain", 4, "MDS", "Recognise a neurological emergency", "Client, 40, sudden 'worst headache of my life'", [
    b("She says it came on like a thunderclap during a stressful session.", [
      ["h", "Treat it as a tension headache from stress", "A thunderclap headache can be a brain bleed."],
      ["o", "Give her a painkiller and some water, and see how she feels in half an hour", "The headache eases a little, then she collapses. A thunderclap headache needs a scan at once; painkillers only delay it."],
      ["b", "Call an ambulance for urgent assessment", "She has a subarachnoid bleed. Fast action saves her."],
    ]),
  ]),
  s("wy-e026", "emergency", "Chest pain in a panic patient", "anxiety", "anxiety", 4, "MDS", "Do not assume panic", "Mr Iyer, 58, known panic disorder", [
    b("He has crushing chest pain spreading to his arm and is sweating.", [
      ["o", "Use breathing techniques first, since he has had many panic attacks that felt like this", "Past panic does not protect against a heart attack."],
      ["b", "Call an ambulance; treat it as possible heart attack", "He is having a heart attack. Fast care saves his life."],
      ["h", "Tell him it is his usual panic", "Missing a heart attack can be fatal."],
    ]),
  ]),
  s("wy-e027", "emergency", "Severe alcohol withdrawal seizure", "substance", "substance", 3, "MDS", "Respond to withdrawal seizures", "Man, 45, stopped drinking yesterday", [
    b("He has a seizure in the waiting room.", [
      ["b", "Give seizure first aid and get urgent medical treatment for withdrawal", "He is given benzodiazepines and thiamine. Withdrawal seizures can repeat."],
      ["h", "Tell him to have a drink to stop the shakes", "He drinks and has another fit later. Advising alcohol is unsafe; withdrawal needs medical treatment."],
      ["o", "Let him rest after the fit and book a detox for next week, once he has recovered", "He has a second fit that evening. Withdrawal seizures can cluster, so treatment must start today."],
    ]),
  ]),
  s("wy-e028", "emergency", "Priapism", "antidepressants", "antidepressants", 4, "MDS", "Know that priapism is an emergency", "Man, 32, on trazodone", [
    b("He has had a painful erection for four hours and is embarrassed.", [
      ["o", "Advise a cold shower and to wait a few more hours, since it may settle on its own", "Delay can cause permanent damage."],
      ["h", "Laugh it off to ease his embarrassment", "Dismissing it delays urgent care."],
      ["b", "Send him to emergency care now", "He is treated in time. Priapism over four hours needs urgent care."],
    ]),
  ]),
  s("wy-e029", "emergency", "Stevens-Johnson syndrome", "stabilisers", "stabilisers", 3, "MDS", "Act on serious rash", "Woman, 25, on lamotrigine for three weeks", [
    b("She has a spreading rash, mouth sores and fever.", [
      ["b", "Stop lamotrigine and send her for urgent medical care", "She has early Stevens-Johnson syndrome. Early stopping improves outcome."],
      ["h", "Give her an allergy tablet and continue", "Continuing the drug risks life-threatening skin loss."],
      ["o", "Ask her to see a skin doctor next week and continue the tablets until then", "Too slow for this kind of rash."],
    ]),
  ]),
  s("wy-e030", "emergency", "Agitation in delirium", "dementia", "neurocognitive", 3, "MDS", "Treat the cause of agitated delirium", "Mr Shah, 80, pulling out his drip", [
    b("The nurse asks for a sedative to calm him.", [
      ["o", "Ask for a strong sedative so he sleeps through the night and the nurses can manage", "Sedation can worsen delirium and hide the cause."],
      ["b", "Look for causes such as pain, retention or infection, reorient him, and use medicine only if needed", "He has urinary retention. A catheter settles him."],
      ["h", "Tie his hands to the bed", "Restraint worsens agitation and injury."],
    ]),
  ]),
  s("wy-e031", "emergency", "Lethal catatonia", "schizophrenia", "psychosis", 5, "MDS", "Recognise malignant catatonia", "Man, 24, catatonic for a week", [
    b("He now has a fever, fast pulse and changing blood pressure.", [
      ["h", "Give an antipsychotic to break the catatonia", "Can worsen malignant catatonia."],
      ["o", "Wait for the lorazepam to work over the next few days and keep him on the ward", "His temperature keeps rising. Fever and unstable blood pressure mean malignant catatonia, which can kill within days."],
      ["b", "Transfer for urgent medical care and consider emergency ECT", "ECT is lifesaving in malignant catatonia."],
    ]),
  ]),
  s("wy-e032", "emergency", "Absconding patient", "schizophrenia", "ethics-law", 3, "MDS", "Respond to an inpatient who leaves", "Admitted patient, 30, on supported admission", [
    b("He has left the ward and is not answering his phone.", [
      ["b", "Inform the psychiatrist and family, and follow the hospital's missing patient procedure", "He is found at a railway station and brought back safely."],
      ["o", "Wait a few hours to see if he returns on his own before telling anyone", "He may be at risk during that time."],
      ["h", "Close his file since he left", "He is found hours later on a railway track. A missing supported patient is a safety emergency, not an admin matter."],
    ]),
  ]),
  s("wy-e033", "emergency", "Anticholinergic toxicity", "antipsychotics", "medicine-profiles", 4, "MDS", "Recognise anticholinergic toxicity", "Mr Rao, 75, on several medicines", [
    b("He is hot, flushed, confused, with dry mouth and cannot pass urine.", [
      ["o", "Give him more fluids and a sleeping tablet to calm him through the night", "He becomes more confused overnight. Sedatives add to anticholinergic delirium; the drugs causing it must be reviewed."],
      ["h", "Assume it is dementia worsening", "His temperature climbs and his bladder fills. Calling it dementia hides a reversible drug toxicity."],
      ["b", "Ask for urgent review of his medicines and treatment", "Stopping the anticholinergic drugs clears the delirium."],
    ]),
  ]),
  s("wy-e034", "emergency", "Self-harm wound", "suicide", "suicide", 2, "CUS", "Get medical care for wounds", "Teen, 16, with a deep cut", [
    b("The cut is still bleeding.", [
      ["b", "Apply pressure and get medical care now, then assess risk", "She is stitched and then assessed. Physical safety comes first."],
      ["h", "Lecture her about cutting", "The wound keeps bleeding while she feels judged. Physical care comes first and shame raises future risk."],
      ["o", "Give her a plaster and continue the session, since stopping might seem like overreacting", "The cut opens again and becomes infected. Deep wounds need stitching, and the risk assessment follows."],
    ]),
  ]),
  s("wy-e035", "emergency", "Disulfiram reaction", "substance", "substance", 3, "MDS", "Respond to a disulfiram reaction", "Man, 40, flushed after a drink", [
    b("He is vomiting and his heart is racing.", [
      ["h", "Tell him it serves him right", "Shaming does not help and delays care."],
      ["o", "Ask him to lie down and drink water, and tell him to avoid alcohol in the future", "May need medical care if severe."],
      ["b", "Check his pulse and blood pressure and get medical care", "He is monitored and recovers. Reactions can be severe."],
    ]),
  ]),
  s("wy-e036", "emergency", "Methanol poisoning cluster", "substance", "substance", 4, "MDS", "Act on a hooch tragedy", "Several men from one village", [
    b("Two men who drank the same liquor have blurred vision.", [
      ["b", "Send them to hospital urgently and alert health authorities", "Others who drank are traced and treated. Fast action saves lives."],
      ["o", "Treat their eyes and send them home with eye drops", "Methanol poisoning kills; it needs hospital care."],
      ["h", "Wait to see if it passes", "Delay causes blindness and death."],
    ]),
  ]),
  s("wy-e037", "emergency", "Violence in a clinic", "personality", "personality", 3, "UMS", "Protect safety first", "Client, 30, throws a chair", [
    b("He is shouting and blocking the door.", [
      ["o", "Try to continue the session to calm him down by talking about what upset him", "He throws another chair. Once someone is violent, talking therapy waits until everyone is safe."],
      ["h", "Shout back to show authority", "He lunges at you. Shouting back raises arousal and makes violence more likely."],
      ["b", "Stay calm, get yourself to safety, raise the alarm and let trained staff respond", "No one is hurt. Your safety comes first."],
    ]),
  ]),
  s("wy-e038", "emergency", "Child protection emergency", "child", "child", 3, "UMS", "Act on immediate danger to a child", "Girl, 8, says she is afraid to go home", [
    b("She shows bruises and says her stepfather will beat her tonight.", [
      ["b", "Keep her safe, contact Childline 1098 or police, and inform your supervisor", "She is placed in safe care. Immediate danger needs immediate action."],
      ["h", "Send her home and call the parents tomorrow", "She is beaten that night. A child who fears going home tonight needs protection tonight."],
      ["o", "Ask her mother to come and talk about it first, to understand the family's side", "If the mother cannot protect her, the child is at risk."],
    ]),
  ]),
  s("wy-e039", "emergency", "Medically unwell in anorexia", "eating", "more-disorders", 4, "MDS", "Recognise medical instability", "Woman, 20, faints at a clinic", [
    b("Her pulse is 38 and blood pressure low.", [
      ["o", "Give her a sugary drink and continue therapy after she rests a little", "She needs medical assessment now."],
      ["b", "Arrange urgent medical admission", "Her electrolytes are dangerous. Admission saves her."],
      ["h", "Tell her to eat more and come back next week", "She collapses at home two days later. A pulse of 38 means the heart is failing; advice is not enough."],
    ]),
  ]),
  s("wy-e040", "emergency", "Drug-induced psychosis with violence", "substance", "substance", 4, "MDS", "Manage acute drug-induced psychosis", "Man, 22, after methamphetamine", [
    b("He believes people are chasing him and is holding a knife.", [
      ["h", "Try to take the knife from him yourself", "He slashes your arm. Never try to disarm someone; distance and trained help keep everyone safer."],
      ["b", "Keep your distance, call police and emergency help, and speak calmly", "Police and medical staff manage him safely."],
      ["o", "Try to reason with him that no one is chasing him, so he puts the knife down", "Arguing with delusions while he is armed is risky."],
    ]),
  ]),
  s("wy-e041", "emergency", "Severe hypothermia in a homeless man", "schizophrenia", "psychosis", 3, "US", "Meet basic needs first", "Homeless man, 50, with psychosis in winter", [
    b("He is shivering and confused on a cold night in Delhi.", [
      ["b", "Get him warm and to medical care, and inform the police under the duty to protect", "He is treated for hypothermia. MHCA requires police to take such persons to a health establishment within 24 hours."],
      ["o", "Give him a blanket and leave him where he is, since he may refuse help", "He is found unconscious at dawn. Hypothermia with confusion needs warming and medical care now."],
      ["h", "Ignore him; he refuses help", "Confusion removes the ability to decide."],
    ]),
  ]),
  s("wy-e042", "emergency", "Overdose of a tricyclic", "antidepressants", "antidepressants", 4, "MDS", "Recognise tricyclic danger", "Woman, 35, took amitriptyline", [
    b("She is drowsy with a fast heart rate.", [
      ["o", "Watch her at home overnight with her family and bring her in if she gets worse", "Tricyclics can cause fatal heart rhythms."],
      ["h", "Make her vomit", "She inhales vomit while drowsy. Inducing vomiting is unsafe and does not remove a tricyclic."],
      ["b", "Send her to emergency care immediately", "Her ECG is abnormal. She is treated in time."],
    ]),
  ]),
  s("wy-e043", "emergency", "Suicide attempt by hanging", "suicide", "suicide", 3, "CUS", "Give first aid after a hanging attempt", "You find a hostel resident after a hanging attempt", [
    b("He is breathing but drowsy.", [
      ["b", "Call an ambulance, keep his neck still, and monitor breathing", "He is taken to hospital and checked for neck injury."],
      ["h", "Make him sit up and drink water", "He chokes and his neck pain worsens. After hanging, the neck may be injured and swallowing unsafe."],
      ["o", "Leave him to rest in his room and check on him in an hour", "He becomes breathless later from throat swelling. Every hanging survivor needs hospital assessment."],
    ]),
  ]),
  s("wy-e044", "emergency", "Severe asthma attack in a panic patient", "anxiety", "anxiety", 4, "MDS", "Do not call breathlessness panic without checking", "Woman, 30, known asthma", [
    b("She is wheezing and cannot complete sentences.", [
      ["o", "Ask her to slow her breathing as in a panic attack and count with her for a few minutes", "This could be a severe asthma attack."],
      ["b", "Help her use her inhaler and get emergency help", "She needs nebulisers. Asthma can be fatal."],
      ["h", "Tell her to calm down; it is anxiety", "Her lips turn blue. Severe asthma can kill within minutes and is not treated by reassurance."],
    ]),
  ]),
  s("wy-e045", "emergency", "Myocarditis on clozapine", "antipsychotics", "antipsychotics", 5, "MDS", "Recognise early clozapine myocarditis", "Mr Khan, 26, started clozapine two weeks ago", [
    b("His pulse is 125, he has chest pain and fever.", [
      ["h", "Increase clozapine to control symptoms", "His heart function worsens rapidly. More clozapine in myocarditis can be fatal."],
      ["o", "Continue clozapine and check his blood count at the next routine test", "This needs urgent cardiac assessment now."],
      ["b", "Stop clozapine and arrange urgent cardiac review", "He has myocarditis and recovers."],
    ]),
  ]),
  s("wy-e046", "emergency", "Acute psychosis in a student hostel", "schizophrenia", "psychosis", 3, "UMS", "Organise urgent care for acute psychosis", "Student, 20, in a hostel", [
    b("He has not slept for days, is talking to himself and is frightened.", [
      ["b", "Stay calm, inform the warden and family, and arrange same-day psychiatric assessment", "He is assessed and treated. Early care improves outcomes."],
      ["o", "Ask him to rest and see a counsellor next week if he is still unwell", "Acute psychosis can worsen fast."],
      ["h", "Lock him in his room until his family arrives", "Locking someone in is unsafe and unlawful."],
    ]),
  ]),
  s("wy-e047", "emergency", "Missed depot and relapse", "schizophrenia", "psychosis", 3, "MDS", "Act on early relapse", "Mr Sen, 40, missed his depot injection", [
    b("He is suspicious, not sleeping and has stopped eating at home.", [
      ["o", "Remind him to come for his injection next month, when the clinic has a slot", "By next month he has stopped eating and is admitted. Early relapse signs need action within days."],
      ["b", "Arrange urgent review and his injection this week", "He settles. Early relapse signs need fast action."],
      ["h", "Wait until he becomes aggressive", "Waiting risks harm and admission."],
    ]),
  ]),
  s("wy-e048", "emergency", "Sedative overdose with alcohol", "substance", "substance", 3, "MDS", "Recognise combined overdose danger", "Woman, 28, took sleeping pills with alcohol", [
    b("She is very drowsy and breathing slowly.", [
      ["h", "Let her sleep it off", "Combined sedatives and alcohol can stop breathing."],
      ["o", "Wake her every hour through the night and call a doctor in the morning", "Her breathing slows further overnight. Combined sedatives and alcohol need emergency monitoring, not home checks."],
      ["b", "Call an ambulance and keep her on her side", "She is treated. Combinations are dangerous."],
    ]),
  ]),
  s("wy-e049", "emergency", "Suicidal patient in a waiting room", "suicide", "suicide", 2, "CUS", "Keep a high-risk patient safe while waiting", "Man, 35, waiting for a psychiatrist", [
    b("He says he will 'finish it' if he has to wait longer.", [
      ["b", "Stay with him or arrange someone to, and tell the psychiatrist he needs to be seen now", "He is seen at once. Waiting rooms are not safe for high-risk patients."],
      ["o", "Ask him to be patient as the doctor is busy and will see him in turn", "He may leave and harm himself."],
      ["h", "Tell him threats will not get him seen faster", "He walks out. Treating a stated intent to die as manipulation dismisses real risk."],
    ]),
  ]),
  s("wy-e050", "emergency", "Hepatic encephalopathy", "substance", "brain", 4, "MDS", "Avoid sedatives in liver failure", "Man, 55, with cirrhosis and confusion", [
    b("The nurse asks for a sedative for agitation.", [
      ["o", "Give a small dose of a benzodiazepine to settle him, since he is disturbing the ward", "Sedatives can worsen hepatic encephalopathy."],
      ["b", "Ask the medical team to treat the liver cause and avoid sedatives", "Treating constipation and infection clears his confusion."],
      ["h", "Restrain him overnight", "Restraint is harmful and not a treatment."],
    ]),
  ]),
  s("wy-e051", "emergency", "Child swallowed tablets", "child", "child", 2, "CUS", "Act on accidental poisoning", "Toddler, 2, found with lithium tablets", [
    b("The mother is not sure how many were taken.", [
      ["b", "Go to emergency care at once with the tablet strip", "The child is monitored and safe. Lithium is dangerous for children."],
      ["h", "Wait to see if the child gets sick", "The child starts vomiting and shaking hours later. Lithium poisoning in a toddler needs care before symptoms show."],
      ["o", "Make the child vomit at home and watch closely for the rest of the day", "Vomiting is not safe and may not remove tablets."],
    ]),
  ]),
  s("wy-e052", "emergency", "Severe panic in an emergency room", "anxiety", "anxiety", 2, "CUS", "Settle a panic attack after medical checks", "Woman, 25, with normal ECG", [
    b("The doctor has ruled out a heart problem. She is still terrified.", [
      ["o", "Tell her the tests were normal so she can go home now and rest", "True, but she leaves frightened and will return."],
      ["h", "Tell her she is wasting doctors' time", "She has another attack in the car park. Shame makes panic worse and teaches her not to seek help."],
      ["b", "Explain what panic is, coach slow breathing, and arrange follow-up", "She calms and understands. She agrees to therapy."],
    ]),
  ]),
  s("wy-e053", "emergency", "Disinhibition after head injury", "neuroscience", "brain", 3, "UMS", "Get medical review for sudden behaviour change", "Man, 30, two days after a fall", [
    b("He is suddenly rude, confused and vomiting.", [
      ["b", "Ask for an urgent head scan", "He has a bleed. Behaviour change after injury may be medical."],
      ["o", "Assume it is stress after the fall and offer him counselling sessions", "He becomes unconscious the next day. New behaviour change after a fall may be a brain bleed."],
      ["h", "Tell the family he is being difficult", "The family scolds him while he worsens. Behaviour change after a head injury is a medical sign."],
    ]),
  ]),
  s("wy-e054", "emergency", "Rapid tranquillisation aftercare", "schizophrenia", "psychosis", 4, "MDS", "Monitor after emergency sedation", "Man, 28, given an injection for agitation", [
    b("He is now asleep.", [
      ["h", "Leave him; he is calm now", "Sedated patients can stop breathing or develop reactions."],
      ["b", "Check breathing, pulse, blood pressure and alertness regularly", "Monitoring picks up a drop in oxygen early."],
      ["o", "Check on him in the morning when he wakes up and ask how he feels", "His oxygen drops in the night unnoticed. Sedated patients need regular checks of breathing and alertness."],
    ]),
  ]),
  s("wy-e055", "emergency", "Psychosis with fever in a young woman", "schizophrenia", "brain", 5, "MDS", "Think of autoimmune encephalitis", "Woman, 21, new psychosis, then a seizure", [
    b("She now has odd mouth movements and is less responsive.", [
      ["o", "Treat as first-episode psychosis with an antipsychotic and admit her to the psychiatric ward", "May worsen her and miss the cause."],
      ["b", "Refer urgently to neurology for tests, including spinal fluid and EEG", "She has anti-NMDA receptor encephalitis and recovers with treatment."],
      ["h", "Assume she is faking", "She worsens over days. Calling it fake delays treatment of a curable brain inflammation."],
    ]),
  ]),
  s("wy-e056", "emergency", "Ligature found on a ward", "suicide", "suicide", 3, "MDS", "Act on a ligature attempt on the ward", "Inpatient, 25, found with a cord", [
    b("He is breathing and alert.", [
      ["b", "Remove the cord, check for injury, increase observation and review the plan", "He is kept safe. Attempts on wards need immediate response."],
      ["o", "Note it in his file and continue routine checks every hour", "He tries again that night. An attempt on the ward means observation and the plan must change at once."],
      ["h", "Move him to a locked room alone", "Alone and distressed, he bangs his head on the wall. Isolation without close watch raises risk."],
    ]),
  ]),
  s("wy-e057", "emergency", "Severe dehydration in dementia", "dementia", "neurocognitive", 3, "MDS", "Notice dehydration as a cause of confusion", "Mrs Patel, 85, more confused in summer", [
    b("She has not drunk much for days in the heat.", [
      ["o", "Increase her dementia medicine, since she seems to be getting worse", "She stays confused and her kidneys worsen. The new confusion came from the heat, not her dementia."],
      ["h", "Assume it is her dementia", "She grows weaker each day. Dehydration is a common, treatable cause of sudden confusion in older people."],
      ["b", "Arrange medical review for fluids and blood tests", "She is dehydrated with kidney strain. She improves with fluids."],
    ]),
  ]),
  s("wy-e058", "emergency", "Opioid withdrawal in pregnancy", "substance", "substance", 4, "MDS", "Manage opioid dependence in pregnancy safely", "Woman, 24, pregnant, using heroin", [
    b("She wants to stop heroin suddenly.", [
      ["o", "Support her to stop at once since she is motivated, and check on her daily", "Sudden withdrawal can harm the pregnancy."],
      ["b", "Refer for opioid substitution with buprenorphine or methadone and antenatal care", "She is stabilised. Substitution is safer than sudden withdrawal in pregnancy."],
      ["h", "Tell her to continue heroin", "She keeps injecting and the baby is exposed to overdose risk. Substitution treatment is the safe route."],
    ]),
  ]),
  s("wy-e059", "emergency", "Severe agitation in autism", "child", "child", 3, "US", "Calm a sensory meltdown", "Boy, 10, autistic, screaming in a busy clinic", [
    b("He is covering his ears and hitting his head.", [
      ["b", "Move him to a quiet space, reduce noise and lights, and let his parent help", "He calms within minutes. Sensory overload often causes meltdowns."],
      ["h", "Hold him down until he stops", "Can increase distress and injury."],
      ["o", "Give a sedative to calm him quickly, so the clinic can carry on with the appointment", "Usually unnecessary; the environment is the cause."],
    ]),
  ]),
  s("wy-e060", "emergency", "Bleeding on an SSRI and NSAID", "antidepressants", "antidepressants", 4, "MDS", "Recognise gastrointestinal bleeding", "Man, 70, on sertraline and aspirin", [
    b("He has black stools and feels faint.", [
      ["h", "Tell him it is from iron tablets", "He faints at home that night. Black stools on an SSRI with aspirin suggest bleeding from the gut."],
      ["o", "Ask him to stop aspirin and see his doctor next week about the stools", "He collapses before the appointment. Black stools with faintness need emergency care today."],
      ["b", "Send him for urgent medical assessment", "He has a bleeding ulcer and is treated."],
    ]),
  ]),
  s("wy-e061", "emergency", "Full case: overdose and capacity", "suicide", "ethics-law", 5, "MDS", "Combine medical, risk and legal steps", "Mr Verma, 42, took an overdose", [
    b("He refuses treatment and tries to leave the emergency room. He is drowsy.", [
      ["o", "Let him leave since he refuses, but ask a family member to watch him at home", "He may die. Capacity needs checking."],
      ["b", "Assess capacity, and use emergency treatment if he lacks it", "He cannot weigh the decision. Emergency treatment saves him."],
      ["h", "Call security to hold him down while you think", "Force without a legal or clinical basis is not acceptable."],
    ]),
    b("Next day he is medically well and asks to go home.", [
      ["b", "Do a full risk assessment, plan safety and follow-up before discharge", "A plan is in place; he is seen within days."],
      ["h", "Discharge him without follow-up as he is medically fit", "The days after an attempt carry very high risk."],
      ["o", "Keep him longer against his will to be safe, without assessing", "Holding someone needs legal grounds and assessment."],
    ], "He has regained capacity."),
  ]),
];
