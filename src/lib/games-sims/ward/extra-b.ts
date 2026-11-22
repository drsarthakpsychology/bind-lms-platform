import type { WardExtra } from "./extra";

/** Extra choices for two-option decisions, part B (Delhi to Nagpur). */
export const EXTRA_B: WardExtra = {
  "delhi:dl3b": [
    ["ok", "Suggest stopping the bladder pill and reviewing her pain at the next ward round in two days' time.", "Stopping the anticholinergic is right, but her pain and opioid dose also need balancing now.", { risk: -5 }],
    ["poor", "Suggest a small dose of a sleeping tablet at night, so she rests and is less muddled in the morning.", "Sedatives often make delirium worse in older people.", { risk: 10 }],
  ],
  "delhi:dl4a": [
    ["ok", "Give the family a discharge letter and ask them to see their family doctor if they are worried about anything.", "A letter helps, but they need to know confusion can linger and that a memory check is worth booking.", { insight: 5 }],
    ["poor", "Book her into a nursing home on discharge, since the family may not cope with the evening confusion.", "Most people recover at home with support; this decision is premature.", { family: -10 }],
  ],
  "bengaluru:bl1b": [
    ["ok", "Tell her it is not her fault, and suggest she cuts his screen time to one hour a day starting today.", "Removing blame is right, but she also needs to know ADHD is largely inherited and that sleep is the key lever.", { family: 5, insight: 3 }],
    ["poor", "Say that ADHD comes from a sugary diet, and suggest she removes all sweets from his meals.", "Sugar does not cause ADHD. This adds a wrong story and misses sleep.", { insight: -5 }],
  ],
  "bengaluru:bl2b": [
    ["ok", "Tell them to be firm and consistent, and to give a reward at the end of each month if he behaves well.", "Consistency helps, but rewards days away are too distant for an ADHD brain; they need to be immediate.", { family: 5 }],
    ["poor", "Tell them to shout louder so that he listens, and to smack him if he does not sit still.", "Harsh punishment worsens behaviour and harms the child.", { family: -15, trust: -10 }],
  ],
  "bengaluru:bl4a": [
    ["ok", "Ask his mother whether he seems happier and better behaved, and book the next review in six months.", "Parent report matters, but growth, blood pressure, pulse and appetite need checking at each review.", { adherence: 5 }],
    ["poor", "Stop the medicine for the summer holidays every year, without telling his doctor, since he does not need it at home.", "Medicine breaks are a shared decision with the doctor, not a secret change.", { adherence: -10 }],
  ],
  "bengaluru:bl4b": [
    ["ok", "'No, you are a good boy.' Then go back to talking with his mother about the reward chart.", "Kind, but quick reassurance misses the chance to give him a simple, strong story about himself.", { trust: 5 }],
    ["poor", "'Your mother says you are naughty, so let's work on being good from today.'", "This confirms the 'bad boy' story and harms his self-esteem.", { trust: -10 }],
  ],
  "mumbai:mb2b": [
    ["ok", "Explain the medical risks of her low weight clearly, and ask her to trust the team and eat what is given.", "Honest facts matter, but without separating her from the illness she hears them as an attack.", { insight: 5 }],
    ["poor", "Let her choose her own meal plan for now, so she feels in control and does not refuse to eat.", "The illness will choose. At this weight, the team and family must lead meals.", { risk: 10 }],
  ],
  "mumbai:mb4a": [
    ["ok", "Let her swim lightly a little now, and see whether her weight holds before deciding on more.", "Some activity can help, but it should wait until her weight and heart are safe, with a medical plan.", { risk: 5, trust: 5 }],
    ["poor", "Ban swimming completely until she is fully recovered, however long that takes, so there is no risk at all.", "Taking away all sport can remove her main motivation to recover.", { trust: -10 }],
  ],
  "mumbai:mb4b": [
    ["ok", "Tell her parents what she said, and ask them to keep a close eye on her at home for now.", "Family should know, but first ask her directly about suicidal thoughts and plans.", { risk: -5 }],
    ["poor", "Reassure her that she will feel better once her weight is back up, and move on to the meal plan.", "Hunger affects mood, but suicidal thoughts in anorexia must be assessed.", { risk: 10 }],
  ],
  "hyderabad:hy2a": [
    ["ok", "Explain that panic is anxiety and not a heart attack, and that his heart tests have been normal every time.", "Reassurance helps briefly, but he needs to see the cycle of sensations and fear to change it.", { insight: 5 }],
    ["poor", "Tell him to keep taking alprazolam whenever he feels an attack coming, since it works fast.", "Daily benzodiazepines become a safety behaviour and a dependence.", { adherence: -5 }],
  ],
  "hyderabad:hy3a": [
    ["ok", "Plan a metro ride with his wife beside him, and agree that he can take an alprazolam if it gets too much.", "A step forward, but safety behaviours stop him learning that the sensations pass on their own.", { adherence: 5 }],
    ["poor", "Wait until he feels less anxious before trying any exposure, so that he is not overwhelmed.", "Waiting to feel ready keeps avoidance going.", { adherence: -5 }],
  ],
  "hyderabad:hy4a": [
    ["ok", "Explain to Ayesha that panic is not dangerous, and leave it to the two of them to decide what to change.", "Useful, but without a shared plan her kind safety habits may carry on.", { family: 5 }],
    ["poor", "Ask Ayesha to stay with him even more until he is completely better, so he never feels alone.", "Constant company becomes a safety signal and keeps panic going.", { family: -5, insight: -5 }],
  ],
  "hyderabad:hy4b": [
    ["ok", "A booster session in three months and a reminder to keep going on the metro, with no written plan.", "Boosters help, but a written plan with early signs and a slow SSRI taper keeps gains far better.", { adherence: 5 }],
    ["poor", "Advise him to stop the SSRI as soon as he has had a month free of attacks.", "Stopping early and suddenly raises the risk of relapse and withdrawal symptoms.", { risk: 10 }],
  ],
  "jaipur:jp1b": [
    ["ok", "'The tests show it is not epilepsy. It is linked to stress, so we will look at what is worrying you.'", "Accurate, but it needs to say clearly that the fits are real and treatable, or she hears 'you're faking'.", { insight: 10, trust: 5 }],
    ["poor", "'It is a mental problem, so the epilepsy doctors cannot help you any more.'", "This feels like rejection and makes the fits sound shameful.", { trust: -10 }],
  ],
  "jaipur:jp2a": [
    ["ok", "Ask about her studies and what she would like to do after college, and come back to the marriage later.", "Building rapport helps, but safety at home and the risk of self-harm need checking now.", { trust: 5 }],
    ["poor", "Call her parents in and ask them to postpone the wedding, so the stress comes down.", "Acting before you know her wishes and her safety can put her at more risk.", { risk: 5, trust: -10 }],
  ],
  "jaipur:jp3a": [
    ["ok", "Stop one of the three epilepsy drugs now, and keep the other two until the fits have settled.", "A start, but the EEG shows no epilepsy; a full slow taper and CBT are the plan.", { insight: 3 }],
    ["poor", "Stop all three drugs today, since she does not have epilepsy and the tablets are not needed.", "Stopping antiepileptics suddenly can cause withdrawal problems; taper slowly with the neurologist.", { risk: 10 }],
  ],
  "jaipur:jp3b": [
    ["ok", "Ask the family to lay her down on her side and call the doctor every time a fit starts.", "Keeping her safe is right, but calling the doctor each time turns every fit into a crisis.", { family: 5 }],
    ["poor", "Tell the family to hold her arms and legs still until the fit stops, so that she does not get hurt.", "Holding her down can injure her and makes the fits worse.", { trust: -5, risk: 5 }],
  ],
  "kochi:kc2a": [
    ["ok", "His sleep and nightmares, and how often he jumps at sounds, so that you can rate how severe it is.", "These are PTSD signs, but you also need his guilt, mood, suicide risk and drinking.", { insight: 5 }],
    ["poor", "Ask him to describe the night of the flood in full detail, from start to finish, in this session.", "Forcing the full story before assessment and safety can overwhelm him.", { trust: -5 }],
  ],
  "kochi:kc2b": [
    ["ok", "Tell him gently that it was not his fault, and that the old woman's family does not blame him.", "Kind, but you have not asked whether he is thinking of ending his life.", { trust: 5 }],
    ["poor", "Note it down to discuss at the next session, since he has not said that he has a plan.", "Survivor guilt with drinking needs direct questions now, not next time.", { risk: 10 }],
  ],
  "kochi:kc3a": [
    ["ok", "Monthly supportive sessions with the district team, and medicine from the psychiatrist when he can get there.", "Support and medicine help, but trauma-focused therapy is the first-line treatment.", { adherence: 5 }],
    ["poor", "Tell him to keep busy repairing his boat and try not to think about the flood.", "Avoiding memories keeps PTSD going.", { insight: -5 }],
  ],
  "kochi:kc3b": [
    ["ok", "Sleep hygiene advice and a check on how much toddy he drinks, with medicine only if therapy does not help.", "Cutting toddy is important, but an SSRI can help PTSD while he waits for therapy.", { risk: -3 }],
    ["poor", "Suggest he keeps drinking a little toddy at night, since it seems to be the only thing that helps him sleep.", "Alcohol worsens nightmares and sleep over time and raises suicide risk.", { risk: 10 }],
  ],
  "kochi:kc4a": [
    ["ok", "Encourage him to go back to fishing full time straight away, since he managed ten minutes in the boat.", "Good progress, but a graded return with a friend is safer than jumping straight back.", { insight: 3 }],
    ["poor", "Suggest he takes a job inland, away from the sea, so that he is never reminded of the flood.", "Avoiding the sea for good keeps PTSD going and costs him his livelihood.", { insight: -5 }],
  ],
  "chandigarh:cg1b": [
    ["ok", "Give him the number of the de-addiction helpline and ask him to call if he feels the urge to use.", "A helpline helps, but the key safety facts are lower tolerance and naloxone.", { risk: -5 }],
    ["poor", "Tell his family to keep him locked at home for a month after discharge, so that he cannot buy chitta.", "Confinement does not prevent overdose and can push use into secret.", { trust: -10, risk: 5 }],
  ],
  "chandigarh:cg2a": [
    ["ok", "Explain the health risks of heroin and hepatitis C clearly, and ask him to promise to stay off it.", "Facts help, but promises made to you are weaker than reasons he finds himself.", { insight: 5 }],
    ["poor", "Ask his mother to sit in on every session so that he cannot hide anything from her.", "He will talk less, and the reasons to change need to be his own.", { trust: -10 }],
  ],
  "chandigarh:cg2b": [
    ["ok", "Refer him for hepatitis C treatment once he has finished detox and settled on maintenance.", "Referral is right, but there is no need to wait, and he also needs HIV and hepatitis B tests.", { adherence: 5 }],
    ["poor", "Tell him not to worry about it, since hepatitis C rarely causes any problems.", "Untreated hepatitis C can damage the liver, and it is now curable.", { risk: 10 }],
  ],
  "chandigarh:cg4a": [
    ["ok", "Thank him for telling you, and remind him firmly of the programme rules about using.", "Honesty is welcomed, but the overdose plan needs updating, since he used alone.", { trust: 5 }],
    ["poor", "Increase his visits to daily urine tests for the next month to make sure it does not happen again.", "Some checking is fine, but heavy policing pushes use into secret.", { trust: -10 }],
  ],
  "chandigarh:cg4b": [
    ["ok", "Keep him on maintenance at a nearby clinic, with monthly reviews, and leave work and friends to him.", "Maintenance matters most, but routine, work and peer support protect recovery too.", { adherence: 5 }],
    ["poor", "Stop maintenance now that he is doing well, so he is not 'dependent on another drug'.", "Stopping maintenance early sharply raises the risk of relapse and overdose.", { risk: 15 }],
  ],
  "nagpur:ng2a": [
    ["ok", "Tell her she does not have to take lithium again, and ask the psychiatrist to choose another medicine.", "Her choice matters, but she should decide knowing what caused the toxicity and how to prevent it.", { trust: 5 }],
    ["poor", "Reassure her that it was bad luck and is unlikely to happen again, so she can restart as before.", "It was not luck: heat, diarrhoea and ibuprofen raised the level, and it can happen again.", { insight: -5 }],
  ],
  "nagpur:ng2b": [
    ["ok", "Ibuprofen and other anti-inflammatory painkillers, and a reminder to drink water in the heat.", "Correct but incomplete: some blood pressure pills and vomiting or diarrhoea also raise levels.", { risk: -5 }],
    ["poor", "Paracetamol and antacids, which she should avoid from now on.", "Paracetamol is the safer painkiller with lithium; this card would steer her wrong.", { risk: 10 }],
  ],
  "nagpur:ng3a": [
    ["ok", "Lithium levels every few months once she is stable, and a kidney test once a year.", "Regular levels matter, but they need correct timing, closer checks after restarting, thyroid tests and a sick-day rule.", { adherence: 5 }],
    ["poor", "A level at any time of day that suits her, since the exact timing does not matter much.", "Levels are read 12 hours after the last dose; random timing gives misleading results.", { risk: 5 }],
  ],
  "nagpur:ng3b": [
    ["ok", "Tell him to remind her to take her tablets and to drink enough water, especially in summer.", "Helpful, but he also needs the early signs of toxicity and what to do about them.", { family: 5 }],
    ["poor", "Tell him to watch her mood closely and to ring the doctor if she seems too happy.", "Highs matter, but this misses the signs of toxicity, which he is most likely to spot first.", { family: 2 }],
  ],
  "nagpur:ng4a": [
    ["ok", "Tell her to let her psychiatrist know as soon as she finds out she is pregnant, so they can plan then.", "Telling them early helps, but planning before trying is safer for her and the baby.", { insight: 5 }],
    ["poor", "Advise her not to have children, since her bipolar disorder and lithium make pregnancy too risky.", "That is her decision. With planning, many women with bipolar disorder have healthy pregnancies.", { trust: -10 }],
  ],
};
