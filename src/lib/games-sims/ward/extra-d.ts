import type { WardExtra } from "./extra";

/** Extra choices for two-option decisions, part D (Noida to Nashik). */
export const EXTRA_D: WardExtra = {
  "noida:nd2a": [
    ["ok", "Tell his parents what he said and ask them to keep his phone and games away from him for a while.", "Parents need to know, but first ask him directly about suicidal thoughts and plans.", { risk: -5, trust: -5 }],
    ["poor", "Reassure him that everyone feels like that after a bad test, and that it will pass once results improve.", "Normalising misses depression and leaves the risk unassessed.", { risk: 10 }],
  ],
  "noida:nd3a": [
    ["ok", "Ask the parents to set fair gaming times and explain them to Aarav, with rewards when he keeps to them.", "Clear limits help, but plans he helps to write are far more likely to hold.", { family: 10, adherence: 5 }],
    ["poor", "Tell his father to take the console to his office every morning and bring it back at night.", "Control without agreement leads to fights and secret gaming.", { family: -10 }],
  ],
  "noida:nd3b": [
    ["ok", "Ask the school to excuse him from class tests for a month, without changing anything else.", "Less pressure helps, but the bullying and a graded return still need working on.", { risk: -3 }],
    ["poor", "Move him to a new school straight away so that he gets a fresh start away from the bullies.", "A move can help some, but done in a rush it skips the avoidance and leaves bullying unaddressed.", { insight: -3 }],
  ],
  "noida:nd4a": [
    ["ok", "See him once a month to check that the gaming stays at two hours a day on weekdays.", "Keeping watch helps, but the low mood that drove the gaming still needs treating.", { adherence: 5 }],
    ["poor", "Ask him to give up the e-sports club too, so that he spends no time on games at all.", "The club is daylight, social and a source of pride; taking it away removes a strength.", { trust: -10 }],
  ],
  "yavatmal:yv1b": [
    ["ok", "His mood and sleep, and whether he still wants to die today, before he leaves the ICU.", "Important, but you also need alcohol, past attempts, family history and his supports.", { risk: -5 }],
    ["poor", "Whether he took the pesticide on purpose, so that the hospital can inform the police.", "Under the Mental Healthcare Act, a person who attempts suicide is presumed to be under severe stress and is not to be punished; care comes first.", { trust: -15 }],
  ],
  "yavatmal:yv3a": [
    ["ok", "Explain that the tablets will help his mood, and ask his son to look into the loan himself.", "Medicine matters, but linking the family with debt help and local follow-up makes care feel relevant.", { trust: 5 }],
    ["poor", "Suggest he sell his land to clear the loan quickly, so the stress goes away.", "A huge decision taken while depressed can deepen hopelessness; it needs time and proper advice.", { risk: 10 }],
  ],
  "yavatmal:yv3b": [
    ["ok", "An SSRI with one month's supply at a time, and a review when he next comes to town.", "Safer medicine, but a small supply held by his son and an early review lower the risk more.", { adherence: 5 }],
    ["poor", "No medicine for now, only advice to stop worrying about the loan.", "Moderate depression after an attempt needs treatment, and 'stop worrying' does not help.", { risk: 10 }],
  ],
  "yavatmal:yv4a": [
    ["ok", "Tele-MANAS (14416) and the hospital's number, and a reminder to come back if he feels low.", "Numbers help, but a plan tied to his own warning signs and sowing season protects him more.", { risk: -5 }],
    ["poor", "Advise him not to go to the field alone at all this season and to let his son do the farming.", "Some company helps, but taking away his work can deepen feelings of failure.", { trust: -5 }],
  ],
  "mysuru:my2b": [
    ["ok", "Tell her that her mother is healthy and will be fine, and that she has no reason to be afraid.", "Reassurance helps a moment, but she needs skills to manage the fear herself.", { trust: 5 }],
    ["poor", "Explain the full details of how anxiety affects the brain, so that she understands it properly.", "Too much detail for a 10-year-old; simple stories and skills work better.", { insight: 2 }],
  ],
  "mysuru:my3a": [
    ["ok", "A few half days, then full days, with her mother waiting at the gate each day.", "Gradual is good, but her mother waiting keeps the fear going; a named adult at school helps more.", { adherence: 5 }],
    ["poor", "Home tuition for the rest of the term, so she can learn without the stress of going to school.", "Staying home makes school refusal harder to break.", { adherence: -10 }],
  ],
  "mysuru:my3b": [
    ["ok", "Ask her mother whether Meera was told how Ajji died and whether she went to the funeral.", "Useful history, but also check Meera's own mood, and help the family talk about Ajji together.", { insight: 5 }],
    ["poor", "Tell her that Ajji is in a better place now, so she does not need to feel sad.", "Kind, but it closes the conversation she may need to have.", { insight: -3 }],
  ],
  "mysuru:my4a": [
    ["ok", "Say that medicine is not needed now, since she is back at school every day.", "True for now, but explain why therapy comes first and plan for dips after holidays.", { insight: 5 }],
    ["poor", "Suggest asking the doctor for an SSRI now, to be safe, since anxiety can come back.", "Medicine is kept for severe anxiety that does not respond; she is improving with CBT.", { adherence: -5 }],
  ],
  "indore:in3a": [
    ["ok", "Advise no TV in bed and a warm glass of milk at night, and keep the sleeping tablet for bad nights.", "Small habits help, but CBT for insomnia works better and helps her come off tablets.", { insight: 5 }],
    ["poor", "Suggest she goes to bed even earlier, at 8 pm, so she has more time to fall asleep.", "More time awake in bed weakens the link between bed and sleep.", { insight: -5 }],
  ],
  "indore:in3b": [
    ["ok", "Ask her to keep to one small peg and not more, and to take the tablet an hour after the whisky.", "Spacing them does not make it safe; any alcohol adds to sedation and falls.", { risk: 5 }],
    ["poor", "Suggest she take a second sleeping tablet instead of the whisky, since that is safer.", "Doubling the tablet raises sedation and fall risk.", { risk: 15 }],
  ],
  "indore:in4a": [
    ["ok", "Explain the taper plan to him and ask him to call you if she has a very bad night.", "Helpful, but he needs to know bad nights are expected and how he can support her day to day.", { family: 10 }],
    ["poor", "Suggest he sleeps in another room for now, so that her bad nights do not disturb him.", "He may need rest, but this misses the chance to make him part of the plan.", { family: -5 }],
  ],
  "dehradun:dd1b": [
    ["ok", "Whether he has thought of suicide, and if he says no, leave the rest for next time.", "Asking is right, but bipolar depression carries high risk; plans, means and agitation need checking now.", { risk: -5 }],
    ["poor", "Whether he wants to take time off work, since rest will help him recover.", "Work matters, but it does not tell you about his risk.", { risk: 5 }],
  ],
  "dehradun:dd2a": [
    ["ok", "Stop the antidepressant now and wait a while before starting anything else.", "Stopping the trigger is right, but he is agitated and hopeless and needs treatment for bipolar depression now.", { risk: 5 }],
    ["poor", "A benzodiazepine every night for the agitation, and continue the antidepressant at the higher dose.", "This keeps the switch risk and adds dependence.", { risk: 10 }],
  ],
  "dehradun:dd3a": [
    ["ok", "Explain that it is bipolar disorder, a single illness, and give him a leaflet to read with Neha.", "Correct, but drawing his own mood timeline with them builds far more insight.", { insight: 10 }],
    ["poor", "Tell him the highs were a side effect of the tablets and that he does not really have bipolar disorder.", "A high on antidepressants often points to bipolar disorder; this misleads him.", { insight: -10 }],
  ],
  "dehradun:dd3b": [
    ["ok", "Suggest she keeps an eye on his spending and tells him if she sees anything worrying.", "Some watching helps, but a plan agreed while he is well avoids fights during a high.", { family: 5 }],
    ["poor", "Suggest they take a new loan to clear the old one, so the worry is gone.", "More debt adds stress, and stress and sleep loss are triggers for highs.", { risk: 5 }],
  ],
  "dehradun:dd4a": [
    ["ok", "Ask him to take a few days' leave during exam duty and rest as much as he can.", "Rest helps, but a set bedtime, a mood record and reviews protect him through the season.", { risk: -5 }],
    ["poor", "Suggest he drinks more tea at night to stay alert and finish the papers faster.", "Late caffeine harms sleep, which is a strong trigger for highs.", { risk: 10 }],
  ],
  "dubai:db1b": [
    ["ok", "His mood, sleep and appetite, and whether he has thoughts of ending his life.", "Important, but you also need his drinking, debts, isolation and work stress.", { insight: 5 }],
    ["poor", "Whether his employer offers health insurance that would pay for treatment.", "Cost matters, but it is not the assessment; and his words about insurance are a risk sign.", { insight: -2 }],
  ],
  "dubai:db2a": [
    ["ok", "Continue video sessions from Kochi, and ask him to see a doctor in Dubai only if he gets worse.", "Therapy can continue, but he needs a local doctor now for medicine and physical checks.", { adherence: 5 }],
    ["poor", "Email him a prescription from an Indian doctor to show at a pharmacy in Dubai.", "A prescription from another country is not valid there, and some medicines are controlled.", { trust: -5, risk: 5 }],
  ],
  "dubai:db2b": [
    ["ok", "Advise him to cut down to weekends only, since that is safer for his mood and sleep.", "A sensible goal, but it works better when it comes from his own reasons.", { insight: 5 }],
    ["poor", "Suggest he switches to sleeping tablets instead of drinking to help him sleep after shifts.", "Swapping one sedative for another does not treat the low mood and adds its own risks.", { risk: 10 }],
  ],
  "dubai:db3a": [
    ["ok", "Explain depression to Bindu and ask her to call him more often to keep his spirits up.", "Good, but helping Shaji tell her how he really feels makes the calls mean more.", { family: 10 }],
    ["poor", "Ask Bindu to send less news about money problems at home, so he does not worry.", "Hiding problems keeps distance; open, two-way talk protects him more.", { family: -5 }],
  ],
  "dubai:db4a": [
    ["ok", "Encourage him to come home for good, since being with his family will help his mood.", "Family may help, but the decision is his to weigh, with care planned for the move.", { trust: -5 }],
    ["poor", "Advise him to stay in Dubai until his loans are cleared, whatever happens with his mood.", "Pushing one choice ignores his wellbeing and his own wishes.", { trust: -10 }],
  ],
  "nashik:nk2a": [
    ["ok", "Say it is too early to know, and that the doctors will decide about medicine after he recovers.", "Honest, but the family needs to hear that restarting safely is usually possible.", { trust: 5 }],
    ["poor", "Say he can restart his old medicine as soon as the fever goes, so the voices do not return.", "Restarting the same drug quickly risks another episode of NMS.", { risk: 15 }],
  ],
  "nashik:nk2b": [
    ["ok", "Watch his temperature and stiffness closely, since the NMS could come back.", "Important early on, but his psychosis may also return and needs watching and calming.", { risk: -5 }],
    ["poor", "Give him a small dose of a different antipsychotic now, so that the voices do not return.", "Restarting too soon after NMS is risky; the team waits for a safe gap.", { risk: 15 }],
  ],
  "nashik:nk3a": [
    ["ok", "A different antipsychotic at a normal starting dose, with a check on his temperature later on.", "Right drug choice, but start low, go slow and check temperature, stiffness and CK closely.", { risk: -5 }],
    ["poor", "A long-acting injection of a new antipsychotic, so that he cannot miss doses.", "Long-acting injections are avoided early after NMS, because they cannot be stopped quickly.", { risk: 15 }],
  ],
  "nashik:nk4a": [
    ["ok", "Tell them to make sure he takes his medicine every day and comes for his reviews.", "Adherence matters, but they also need the warning signs of NMS and a card for any doctor.", { family: 10 }],
    ["poor", "Tell them he must never drive again, because of the risk of another episode.", "Driving can resume when the doctor agrees; a blanket ban harms his work and dignity.", { trust: -10 }],
  ],
};
