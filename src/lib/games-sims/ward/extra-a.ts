import type { WardExtra } from "./extra";

/** Extra choices for two-option decisions, part A (Pune to Delhi). */
export const EXTRA_A: WardExtra = {
  "pune:p5b": [
    ["ok", "A follow-up date soon and his psychiatrist's number, with a reminder to call if the voices get louder or sleep goes.", "Close follow-up helps, but without his own early signs and a family plan, warning signs are easy to miss.", { risk: -3 }],
    ["poor", "A printed leaflet on schizophrenia and a list of helplines, so he can read about it at home in his own time.", "Information helps, but a leaflet alone does not turn his own warning signs into a plan.", { insight: 2 }],
  ],
  "chennai:c2b": [
    ["ok", "Explain it is a common illness after birth that can be treated, and suggest she reads about it when she feels up to it.", "Naming it helps, but leaving out the frightening thoughts misses what she most needs to hear.", { insight: 5 }],
    ["poor", "Tell her it is the 'baby blues', which every mother gets, and that it will settle by itself soon.", "Baby blues pass quickly, within days. Calling a real depression 'blues' delays treatment.", { insight: -5 }],
  ],
  "chennai:c4x": [
    ["poor", "Ask her husband to keep a close eye on her overnight, and call the clinic first thing in the morning for an appointment.", "Watching helps, but a new, specific plan needs same-day assessment and the tablets locked away tonight.", { risk: 10 }],
    ["ok", "Call Divya now, ask about the plan directly, and arrange for the psychiatrist to see her first thing tomorrow.", "Asking directly is right, but a specific overdose plan needs assessment and means removed today.", { risk: -5 }],
  ],
  "chennai:c4a": [
    ["ok", "Monthly visits to the general psychiatry OPD for medicine reviews, with her family doctor checking on her between visits.", "Medicine reviews help, but she also needs therapy for the thoughts and perinatal expertise.", { adherence: 5 }],
    ["poor", "Weekly calls from you alone, since she trusts you and a new service may feel like starting all over again.", "Trust matters, but a trainee alone cannot hold this risk; she needs a specialist team.", { risk: 5 }],
  ],
  "chennai:c5a": [
    ["ok", "Ask the psychiatrist whether she can halve the dose now, since she feels well, and stop completely in a month or so.", "A plan is better than stopping suddenly, but cutting back this early still raises the risk of relapse.", { adherence: 5, risk: 5 }],
    ["poor", "Suggest she switches to herbal remedies from now on, since she is breastfeeding and wants something natural.", "Herbal products are not proven for depression and some are not safe while breastfeeding.", { adherence: -10, risk: 5 }],
  ],
  "chennai:c5b": [
    ["ok", "Tell her that many women go on to have another baby, and that she can ask the team about it when the time comes.", "Reassuring, but a plan made while she is well, with early support, lowers the risk far more.", { insight: 3 }],
    ["poor", "Say that it is too early to think about another baby, and that she should focus only on getting well now.", "She asked a real question. Brushing it off misses the chance to plan safely.", { trust: -5 }],
  ],
  "london:l1a": [
    ["ok", "Ask about her sleep, appetite and energy now, and whether she has had thoughts of ending her life recently.", "Current symptoms and risk matter, but without asking about past highs, bipolar depression is missed.", { insight: 3 }],
    ["poor", "Ask about her exam stress and plans for the dissertation, since that is what she seems most worried about.", "Stress matters, but this misses past highs and her risk.", {}, ["missedBipolar"]],
  ],
  "london:l3b": [
    ["ok", "Tell her to get the blood tests her doctor orders and to call if she feels unwell, and give her the leaflet.", "Blood tests matter, but she needs to know the signs of toxicity and what raises lithium levels.", { adherence: 5 }],
    ["poor", "Tell her lithium is a natural salt and very safe, so there is nothing much to worry about.", "It has a narrow safe range. False reassurance leaves her unable to spot toxicity.", { adherence: -5 }],
  ],
  "london:l4a": [
    ["ok", "Respect her wish completely and agree not to involve anyone else at all, so that she keeps coming to sessions.", "Trust is kept, but with her recent risk a chosen support person would make her much safer.", { trust: 5 }],
    ["poor", "Ask her to sign a form allowing you to speak to her parents whenever you feel it is needed.", "Blanket consent under pressure is not real consent and may push her away.", { trust: -10 }],
  ],
  "london:l4b": [
    ["ok", "Suggest she asks her tutor informally for a little more time on the dissertation, without bringing in other services.", "A little time may help, but formal adjustments and specialist care protect her far more.", { risk: -2 }],
    ["poor", "Advise her to push through the deadline first and sort out her mental health care after the dissertation is in.", "Delaying care during a mixed episode raises the risk of relapse and self-harm.", { risk: 10 }],
  ],
  "london:l4c": [
    ["poor", "Suggest she study through the night when she feels energetic, and rest on the days when she feels low.", "Following mood swings with her sleep makes bipolar episodes more likely.", { risk: 10 }],
    ["ok", "Cut out caffeine after noon and use a sleep app, and check in with you at each session about how she is feeling.", "Sleep habits help, but regular timing, less alcohol and a mood diary are the key steps.", { insight: 5 }],
  ],
  "london:l5a": [
    ["ok", "Ask her to stop the ibuprofen, drink fluids and come in tomorrow for a lithium level and a check-up.", "The right ideas, but vomiting and unsteadiness on lithium need checking today, not tomorrow.", { risk: 5 }],
    ["poor", "Suggest she takes an extra lithium tablet tonight, in case the vomiting has made her lose her last dose.", "If she is toxic, more lithium makes it worse. These signs need an urgent level.", { risk: 25 }],
  ],
  "london:l5b": [
    ["ok", "Send the community team a full letter with her diagnosis, medicines and the dates of her next blood tests.", "A good letter helps, but an updated safety plan made with her and Zoe protects her most.", { risk: -3 }],
    ["poor", "Tell her to contact the community team herself when she feels she needs them, so she stays in control.", "Leaving the handover to her risks a gap in care at a vulnerable time.", { risk: 5 }],
  ],
  "lucknow:lk2b": [
    ["ok", "Ask him to rate his mood each day while he is in hospital, and plan to talk about it again later.", "Tracking mood is useful, but suicide risk in men who drink must be asked about now.", { trust: 3 }],
    ["poor", "Tell him the low mood is only from the alcohol and will go away by itself, so there is nothing to worry about.", "Often it lifts, but you have not checked his risk, which is high in men who drink.", { risk: 10 }],
  ],
  "lucknow:lk3b": [
    ["poor", "Disulfiram, since his brother is keen and it makes drinking so unpleasant that he will stop.", "Disulfiram is risky with a damaged liver and must never be given without his knowledge.", { risk: 10, trust: -10 }],
    ["ok", "Naltrexone to cut his cravings, as long as his liver tests are checked again before he starts it.", "It can cut cravings, but it is harder on a sick liver; acamprosate is usually safer here.", { adherence: 5 }],
  ],
  "kota:kt1b": [
    ["ok", "Her mood, sleep and appetite, and whether she still has thoughts of ending her life today.", "Important, but it misses past self-harm, bullying, substances and others at risk in the hostel.", { risk: -5 }],
    ["poor", "Her marks in the last few mock tests, and how far behind the other students she feels.", "This feeds the pressure and misses the depression and the risk.", { risk: 5 }],
  ],
  "kota:kt2b": [
    ["ok", "Home for a few days to rest, then back to the hostel with a phone call from you every few days.", "A short rest helps, but returning to the same pressures this soon keeps risk high.", { risk: 5 }],
    ["poor", "To a relative's home in Kota, near the coaching centre, so that she can keep attending classes.", "She stays in the same high-pressure setting, away from her parents, in the riskiest period.", { risk: 10 }],
  ],
  "kota:kt3a": [
    ["ok", "Weekly supportive counselling, where she can talk about her feelings and the pressure from coaching.", "Support helps, but CBT and family work on 'ranks over effort' have stronger evidence.", { insight: 5, trust: 5 }],
    ["poor", "A strict daily timetable with fixed study hours, so she feels in control and catches up quickly.", "More study pressure feeds the thought that she is behind and is not a treatment.", { insight: -5 }],
  ],
  "kota:kt4x": [
    ["ok", "Talk to her about the note at the next session, two days from now, and ask her parents to watch her.", "Watching helps, but a goodbye note needs a fresh assessment today.", { risk: 10 }],
    ["poor", "Ask her parents to tear up the note and not mention it, so that she does not feel embarrassed.", "Hiding the warning sign leaves the risk unassessed.", { risk: 20 }],
  ],
  "kota:kt4a": [
    ["ok", "Give the parents information about other courses and careers, and let them decide what is best for her.", "Information helps, but Ananya needs a voice in the decision, with a plan for warning signs.", { family: 5 }],
    ["poor", "Advise them to enrol her again straight away, so she does not lose another year and fall further behind.", "Rushing back to the same pressure, without her say, keeps risk high.", { risk: 10, trust: -5 }],
  ],
  "ahmedabad:am1b": [
    ["ok", "Explain that OCD is an anxiety problem that runs in families, and that medicine can help him feel calmer.", "True in part, but he needs to see how washing keeps the fear going, or exposure makes no sense.", { insight: 5 }],
    ["poor", "Reassure him that germs on his hands will not make his daughter ill, every time he asks you.", "Repeated reassurance works like a ritual and keeps OCD going.", { insight: -5 }],
  ],
  "ahmedabad:am2b": [
    ["ok", "An SSRI at the usual depression dose, and a review in a month to see whether it is working.", "The right group, but OCD often needs higher doses and a longer trial before judging it.", { adherence: 5 }],
    ["poor", "An antipsychotic on its own, since his thoughts about germs are so strong and fixed.", "Antipsychotics are sometimes added later, but not used alone first in OCD with insight.", { adherence: -5 }],
  ],
  "ahmedabad:am4a": [
    ["ok", "Monthly check-ins with you for a year, and stop the SSRI now that the exposure work has been successful.", "Check-ins help, but stopping the medicine early raises the chance of the rituals returning.", { adherence: -5 }],
    ["poor", "Tell him he is cured now, since he managed to hug his daughter without washing straight away.", "He still washes for an hour after outings. OCD can return without a relapse plan.", { adherence: -10 }],
  ],
  "kolkata:kb1b": [
    ["ok", "Explain it is part of his memory illness, and suggest the family correct him gently each time he accuses someone.", "Understanding helps, but correcting him often leads to arguments; calm reassurance works better.", { family: 5 }],
    ["poor", "Suggest they lock all valuables away and stop him going into the other rooms of the house.", "Locking him out of his own home adds distress and does not address the memory gaps.", { family: -5, trust: -5 }],
  ],
  "kolkata:kb4a": [
    ["ok", "Give her a leaflet about dementia care and the number of a helpline she can call when she feels low.", "Something, but she needs screening, shared care and real respite.", { family: 5 }],
    ["poor", "Suggest a sleeping tablet for her, so she can get a full night's rest and cope better in the day.", "Sleep matters, but this treats a symptom and leaves the caring load and her mood unaddressed.", { family: -5 }],
  ],
  "kolkata:kb4b": [
    ["ok", "Lock the main door at night and hide the key, so that he cannot leave the house without someone knowing.", "It may stop the wandering, but it is a fire risk; a door chime and ID bracelet are safer.", { risk: -5 }],
    ["poor", "Ask the doctor for a sedative at night so that he sleeps through and does not try to go out.", "Sedatives raise the risk of falls and confusion in dementia.", { risk: 10 }],
  ],
  "delhi:dl1b": [
    ["ok", "Ask the team to stop all her pain medicines straight away, since they may be causing the confusion.", "Medicines may be part of it, but stopping all pain relief causes pain, which also worsens delirium.", { risk: -5 }],
    ["poor", "Suggest a psychiatry transfer, since she seems confused and may have a mental illness.", "Delirium is a medical problem; moving her delays finding and fixing the causes.", { risk: 10 }],
  ],
  "delhi:dl3a": [
    ["ok", "Tell him it is confusion from the operation and that she will be fine in a day or two.", "Reassuring, but recovery can take longer, and he can help by visiting and bringing familiar things.", { trust: 5 }],
    ["poor", "Tell him the anaesthesia may well have damaged her brain, and that he should prepare for the worst.", "Frightening and not true for most; delirium usually improves.", { trust: -10, family: -5 }],
  ],
};
