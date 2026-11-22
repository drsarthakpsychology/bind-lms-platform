import type { WardExtra } from "./extra";

/** Extra choices for two-option decisions, part C (Patna to Ranchi). */
export const EXTRA_C: WardExtra = {
  "patna:pt3a": [
    ["ok", "Keep the lorazepam at the current dose for a few more days and see whether the response improves.", "Waiting a little is reasonable, but when catatonia stalls on lorazepam, ECT should be discussed without long delay.", { risk: 5 }],
    ["harm", "Restart a strong antipsychotic at a high dose to treat the voices and the catatonia together.", "He has just had neuroleptic malignant syndrome. High-dose antipsychotics now could bring it back.", { risk: 20 }],
  ],
  "patna:pt3b": [
    ["ok", "Ask about stress and family problems before he became unwell, since a shock may have set it off.", "Stress matters, but mood disorders and medical causes such as infection or encephalitis must be checked.", { insight: 3 }],
    ["poor", "Look only for drug or alcohol use, since that is the commonest cause of catatonia in young men.", "Substances are one cause, but mood disorders and medical illness are commoner and must be ruled out.", { insight: -2 }],
  ],
  "patna:pt4a": [
    ["ok", "Say it is fine to visit the dargah, and remind her to keep giving him the medicine every day.", "Respectful, but a plan for warning signs and where to get help would protect him more.", { family: 10 }],
    ["poor", "Ask her to wait until he has been well for a year before taking him anywhere outside the village.", "This is not needed and may feel like you are against their faith.", { family: -5 }],
  ],
  "bhopal:bh2a": [
    ["ok", "Explain that she has 'emotional problems' from her childhood, without naming a diagnosis, to avoid upsetting her.", "Gentle, but naming it with hope helps her find the right therapy and understand herself.", { insight: 5 }],
    ["poor", "Tell her she has borderline personality disorder and hand her a printout about it to read at home.", "A label without a conversation can feel like a judgement, and the hope gets lost.", { trust: -5, insight: 3 }],
  ],
  "bhopal:bh2b": [
    ["ok", "Suggest she keep taking all four for now, and ask the doctors to review them at her next appointment.", "Review is needed, but four medicines and a stockpile of tablets are a risk now.", { risk: 5 }],
    ["poor", "Suggest she stops all four medicines herself, since none of them treats her condition.", "Stopping several medicines at once without a doctor can cause withdrawal and miss real problems.", { risk: 10 }],
  ],
  "bhopal:bh3a": [
    ["ok", "Teach her a breathing exercise to use when she is calm, and plan to talk through the urges next time.", "A start, but she needs skills for the peak of the urge and a way to track what helps.", { insight: 5 }],
    ["poor", "Ask her mother to check her arms every evening, so that cutting is found early.", "Checking without her consent feels controlling and pushes self-harm into hiding.", { trust: -10 }],
  ],
  "bhopal:bh4b": [
    ["ok", "Give her mother the crisis helpline number and ask her to call it whenever Nidhi is upset.", "Useful in a crisis, but her mother also needs to learn how to respond to Nidhi's feelings.", { family: 5 }],
    ["poor", "Ask her mother to take Nidhi's phone away at night so that she cannot read upsetting messages.", "Taking control can raise distress and cut off her ways of reaching help.", { family: -5, trust: -5 }],
  ],
  "shimla:sm1b": [
    ["ok", "Ask whether he has thought about how he would do it, and note it for the ward team to follow up.", "Asking is right, but the revolver and his tablets need checking and observation arranged now.", { risk: -5 }],
    ["poor", "Ask his son to stay overnight, since family company is the best protection for older men.", "Company helps, but it does not replace asking about means and arranging observation.", { risk: 5 }],
  ],
  "shimla:sm2b": [
    ["ok", "Respect his refusal for now and try again tomorrow, since he is an adult with the right to decide.", "His rights matter, but his guilt delusion may stop him weighing the decision; capacity must be assessed.", { risk: 10 }],
    ["poor", "Ask his son to sign the consent form for ECT, since the father is too unwell to decide.", "A relative cannot simply sign for an adult. The Act's process for capacity and the nominated representative must be followed.", { trust: -15 }],
  ],
  "shimla:sm3a": [
    ["ok", "Say it is from his depression, not the ECT, and that it will clear when his mood lifts.", "Mood can affect memory, but ECT does cause short-term memory problems; honesty keeps trust.", { trust: -5 }],
    ["poor", "Advise stopping ECT now, since the memory lapses mean it is doing harm.", "Short-term lapses are common and usually improve; stopping early risks relapse while he still has delusions.", { risk: 10 }],
  ],
  "shimla:sm4a": [
    ["ok", "Discharge him to his son's home in Chandigarh, with follow-up at a clinic there, against his wish to go home.", "Safer for now, but going against his wishes can lower his mood; a plan for home may work.", { risk: -5, trust: -5 }],
    ["poor", "Discharge him home with his medicines, and ask him to come back if he feels low again.", "Late-life depression often returns; he needs follow-up, means safety and social contact.", { risk: 10 }],
  ],
  "varanasi:vr1b": [
    ["ok", "A full mental state examination in Hindi first, and a physical check once he has settled on the ward.", "His mind matters, but his infected foot and hydration may be urgent, and Bhojpuri may reach him better.", { trust: 5 }],
    ["poor", "Ask the police to take him to a shelter for the night, since he does not seem dangerous.", "He needs medical and psychiatric care now; a shelter without assessment leaves his illness untreated.", { risk: 10 }],
  ],
  "varanasi:vr2a": [
    ["ok", "Start an antipsychotic at a moderate dose today, since he has agreed, and review side effects later.", "Starting is right, but a low start, early side effect checks and his own words build trust.", { adherence: 5 }],
    ["poor", "Wait until his family is found before starting any medicine, so that they can give consent.", "He can agree for himself. Waiting leaves his psychosis untreated.", { trust: -5 }],
  ],
  "varanasi:vr4a": [
    ["ok", "Give him three months of tablets and the name of the nearest district hospital, and discharge him with his brother.", "Medicine and a contact help, but a written plan with free supply and follow-up near his village is safer.", { adherence: 5 }],
    ["poor", "Keep him in hospital until his brother can find a job for him in the city, however long it takes.", "Long stays for social reasons cause harm; plan a supported discharge instead.", { trust: -5 }],
  ],
  "varanasi:vr4b": [
    ["ok", "Give them a leaflet about schizophrenia in Hindi and the date of his next appointment.", "Helpful, but talking through their worries and the warning signs prepares them far better.", { family: 5 }],
    ["poor", "Tell them his illness came from living on the streets, so he must never travel alone again.", "This is not true and adds blame and restriction.", { family: -5 }],
  ],
  "surat:sr3a": [
    ["ok", "Say you are not sure about stem cell treatment, and that they should ask the paediatrician what they think.", "Asking the doctor is reasonable, but you can say clearly it is unproven and point them to proven help.", { trust: 5 }],
    ["poor", "Suggest they try a gluten-free diet first, since it is cheaper and many parents say it helps.", "Special diets are not proven to treat autism and can harm nutrition.", { adherence: -5 }],
  ],
  "surat:sr3b": [
    ["ok", "Speak to him a lot during the day and name everything around him, so that he hears many words.", "Talking helps, but following his lead in play and waiting for him to communicate builds more.", { family: 10 }],
    ["poor", "Let him watch nursery rhyme videos on the phone for a few hours a day to learn words.", "Screen time does not build two-way communication and can reduce play with people.", { family: -5 }],
  ],
  "surat:sr4a": [
    ["ok", "Help them find a special school for autistic children, where he can get one-to-one teaching.", "Special schools suit some children, but an inclusive pre-school with support is his right and helps him learn from peers.", { family: 5 }],
    ["poor", "Tell them not to mention the autism to the pre-school, so that he is not treated differently.", "Without sharing what helps him, the school cannot support him, and he may struggle.", { family: -5 }],
  ],
  "madurai:md2a": [
    ["ok", "Explain that her tests are normal, so the pain is not dangerous, and that she should try to worry less.", "Reassurance helps a little, but she needs a way to understand why the pain is real and how it can ease.", { insight: 5 }],
    ["poor", "Tell her the pain is all in her mind and that she should stop going to doctors for it.", "This dismisses real suffering and pushes her to more clinics.", { trust: -15 }],
  ],
  "madurai:md2b": [
    ["ok", "An SSRI for the depression, and simple painkillers like paracetamol for the aches.", "This treats the mood, but an antidepressant that also eases pain may help both better.", { adherence: 10 }],
    ["poor", "Vitamin B12 injections and a tonic, since she believes in them and it will keep her coming back.", "Unneeded injections confirm a wrong idea and do not treat depression.", { insight: -5 }],
  ],
  "madurai:md3a": [
    ["ok", "Ask her to visit only when she has new symptoms, and to stop going to the two private clinics.", "Fewer clinics helps, but visits only when symptoms flare keep the cycle going; book them ahead.", { trust: 5 }],
    ["poor", "Order a full body scan to show her once and for all that nothing is wrong.", "More tests rarely reassure for long and add cost and worry.", { insight: -5 }],
  ],
  "madurai:md4a": [
    ["ok", "Explain to him that her pain is real and linked to stress, and ask him to be more patient with her.", "A good start, but his drinking is part of the stress, and with her consent it should be raised.", { family: 10 }],
    ["poor", "Ask him to take her to more doctors, since she clearly needs more tests.", "More tests feed the cycle; support and treating the stress help more.", { family: -5 }],
  ],
  "madurai:md4b": [
    ["ok", "Ask whether she has had such thoughts recently, and book an earlier appointment to talk about it.", "Asking is right, but a safety plan and locking away poisons should happen today.", { risk: -5 }],
    ["poor", "Tell her husband to throw away all the poison in the house and to keep an eye on her.", "Removing poison helps, but telling him first without asking her about current thoughts is out of order.", { risk: -5, trust: -10 }],
  ],
  "guwahati:gw1b": [
    ["ok", "It matters a little, since mental illness can run in families, but the main cause is the stress of the birth.", "Family history is one of the strongest risk factors and points to a bipolar link here.", { insight: 3 }],
    ["poor", "It matters only for deciding whether she can breastfeed while she is on medicine.", "Breastfeeding is a real question, but family history mainly changes the diagnosis and future risk.", { insight: -2 }],
  ],
  "guwahati:gw3a": [
    ["ok", "Let her see the baby once a day for a few minutes, with a nurse holding him, until she is fully well.", "Supervised contact is right, but it should grow as she recovers, with the family involved.", { family: 10 }],
    ["poor", "Leave the baby with her all day now that she is calmer, so they can bond as fast as possible.", "Too soon without supervision can be unsafe while she is still recovering.", { risk: 10 }],
  ],
  "guwahati:gw4a": [
    ["ok", "Tell her it can happen again, and that she should see a doctor quickly if she feels unwell.", "Honest, but a plan made before any future pregnancy, with preventive medicine discussed, lowers the risk far more.", { insight: 5 }],
    ["poor", "Advise her not to have more children, since the risk of this happening again is so high.", "That is her decision. With planning, the risk can be sharply lowered.", { trust: -10 }],
  ],
  "guwahati:gw4b": [
    ["ok", "An appointment with the psychiatrist in three months and the clinic's phone number.", "A follow-up helps, but relapse is common early on; she needs closer contact and warning signs.", { adherence: 5 }],
    ["poor", "Ask her family to watch her and to call only if she stops sleeping completely.", "Waiting for a crisis misses early signs that could be treated sooner.", { risk: 10 }],
  ],
  "ranchi:rc2a": [
    ["ok", "Blood counts once a month, and ask him to report a fever or sore throat straight away.", "Reporting infections matters, but counts are needed weekly at the start, with heart and bowel checks.", { risk: 5 }],
    ["poor", "Start at the full dose so that it works quickly, since the other medicines failed.", "Clozapine must be built up slowly; a fast start can cause collapse and fits.", { risk: 20 }],
  ],
  "ranchi:rc2b": [
    ["ok", "Praise the plan and suggest he cuts down slowly over a few months, without mentioning it to the team.", "Cutting down is good, but the team must know, since clozapine levels rise as smoking falls.", { risk: 5 }],
    ["poor", "Suggest he switch to chewing tobacco instead, since it is the smoke that matters.", "Chewing tobacco carries its own serious harms, and quitting with a planned dose change is better.", { risk: 5 }],
  ],
  "ranchi:rc3a": [
    ["ok", "Suggest he drinks more water and eats more fruit, and check again in a few days.", "Fluids and fibre help, but four days without stools and a bloated belly on clozapine need a doctor today.", { risk: 10 }],
    ["poor", "Suggest he stops the clozapine for a few days until his bowels settle.", "Stopping suddenly can bring back psychosis and causes rebound problems; the doctor must decide.", { risk: 10 }],
  ],
  "ranchi:rc4a": [
    ["ok", "Help him apply for a full-time office job straight away, since he used to work in a bank.", "Work matters, but supported, step-by-step return works better than jumping into full-time work.", { adherence: 5 }],
    ["poor", "Advise his mother that he should not work again, since stress could bring back the voices.", "Meaningful work supports recovery; avoiding all stress limits his life.", { trust: -5 }],
  ],
  "ranchi:rc4b": [
    ["ok", "Take the next dose as usual and tell the team at his next visit if he has missed a few doses.", "Fine for one missed dose, but after more than two days he must not restart at full dose without the team.", { risk: 10 }],
    ["poor", "Stop the clozapine completely if he misses doses, since it is too risky to restart.", "Clozapine can be restarted safely, slowly, with the team; stopping risks relapse.", { risk: 10 }],
  ],
};
