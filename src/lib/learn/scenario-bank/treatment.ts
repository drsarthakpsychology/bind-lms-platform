import type { Scenario } from "../scenarios";
import { b, s } from "./make";

/** Treatment planning and management: choosing, pacing and reviewing care. */
export const TREATMENT: Scenario[] = [
  s("wy-t001", "treatment", "Depression", "depression", "depression", 1, "CUS", "Match mild depression to talking therapy", "Ankita, 27, mild depression", [
    b("She asks whether she needs tablets.", [
      ["o", "Tell her tablets are always needed for depression and refer her to a psychiatrist today", "She worries she is badly ill. Mild depression often responds to psychological treatment first."],
      ["b", "Explain that therapy such as CBT works well for mild depression, and review in a few weeks", "She starts CBT and improves. Matching treatment to severity avoids needless medicine."],
      ["h", "Tell her she just needs to think positively", "She feels dismissed and stops coming. Advice is not treatment."],
    ]),
  ]),
  s("wy-t002", "treatment", "Panic disorder", "anxiety", "anxiety", 2, "UMS", "Plan exposure for panic", "Rohit, 30, panic disorder with agoraphobia", [
    b("He wants to avoid the metro until he feels better.", [
      ["h", "Agree to avoid it for now", "Avoidance keeps panic going and his world gets smaller."],
      ["b", "Build a step-by-step plan to face the metro, starting small", "He rides one stop with you, then more. Graded exposure is the core of panic treatment."],
      ["o", "Teach relaxation only and wait until he feels ready to travel again on his own", "Relaxation helps, but without exposure his fear stays."],
    ]),
  ]),
  s("wy-t003", "treatment", "OCD", "ocd", "ocd", 2, "UMS", "Use ERP instead of reassurance", "Sana, 28, checking OCD", [
    b("She asks you to check the stove with her before every session.", [
      ["o", "Check once to calm her so the session can start, and plan to work on it later", "Brief relief, but the ritual is reinforced."],
      ["b", "Agree a plan where she leaves without checking and sits with the anxiety", "Anxiety rises then falls. ERP weakens the OCD cycle."],
      ["h", "Tell her it is silly", "She feels ashamed and hides rituals."],
    ]),
  ]),
  s("wy-t004", "treatment", "Schizophrenia", "schizophrenia", "psychosis", 2, "UMS", "Support medicine adherence collaboratively", "Arjun, 25, stopped his tablets", [
    b("He says the tablets make him slow and fat.", [
      ["b", "Take his concerns seriously, note the side effects and ask his psychiatrist to review options", "A switch helps and he restarts. Side effects are the commonest reason for stopping."],
      ["h", "Tell him he must take them or he will relapse", "He feels lectured and hides non-adherence."],
      ["o", "Tell him to take half the dose so the side effects are less, until he sees his doctor", "Medicine changes are the prescriber's decision."],
    ]),
  ]),
  s("wy-t005", "treatment", "Bipolar maintenance", "bipolar", "bipolar", 3, "UMS", "Use relapse signature planning", "Neha, 32, bipolar, stable", [
    b("She asks how to stay well.", [
      ["o", "Tell her to take her medicine and avoid stress, and that this is all she can really do", "Medicine helps, but she can also learn her early signs."],
      ["h", "Tell her bipolar always comes back so there is no point planning", "Hopeless and untrue; relapse can be reduced."],
      ["b", "Map her early warning signs, regular sleep and a plan for what to do if signs appear", "She spots reduced sleep early and calls. Relapse is caught."],
    ]),
  ]),
  s("wy-t006", "treatment", "PTSD", "ptsd", "trauma", 3, "UMS", "Choose trauma-focused therapy", "Priya, 30, PTSD after assault", [
    b("She asks what therapy would help most.", [
      ["b", "Explain that trauma-focused CBT or EMDR has the best evidence, and pace it with her", "She starts and improves. First-line PTSD treatments are trauma-focused."],
      ["o", "Offer general supportive counselling for as long as she wants, without focusing on the trauma itself", "Supportive, but less effective for PTSD."],
      ["h", "Tell her to forget it and move on", "She tries to push the memories away and the nightmares continue. Avoidance keeps PTSD going."],
    ]),
  ]),
  s("wy-t007", "treatment", "Alcohol dependence", "substance", "substance", 3, "MDS", "Plan safe withdrawal", "Mr Gill, 45, wants to stop drinking", [
    b("He drinks a bottle daily and wants to stop tomorrow at home.", [
      ["h", "Encourage him to stop suddenly at home", "Unsupervised withdrawal can cause seizures or delirium."],
      ["b", "Arrange a medically supervised detox, then relapse prevention", "Withdrawal is managed safely and he starts aftercare."],
      ["o", "Tell him to cut down slowly by himself over the next month, a peg less each week", "Possible for some, but heavy drinkers often fail or risk withdrawal."],
    ]),
  ]),
  s("wy-t008", "treatment", "Opioid dependence", "substance", "substance", 3, "MDS", "Offer opioid substitution", "Ravi, 28, injecting heroin", [
    b("He has failed detox three times.", [
      ["o", "Try a fourth detox with stronger willpower, since he is clearly motivated this time", "Repeated detox without maintenance often fails."],
      ["b", "Refer for buprenorphine or methadone maintenance", "He stops injecting and stays in treatment. Substitution saves lives."],
      ["h", "Tell him to stop using and come back when he is clean", "Rejection increases overdose risk."],
    ]),
  ]),
  s("wy-t009", "treatment", "Insomnia", "dsm-elimination-sleep", "more-disorders", 2, "US", "Use CBT for insomnia", "Mr Joshi, 50, chronic insomnia", [
    b("He wants sleeping tablets every night.", [
      ["b", "Offer CBT for insomnia, with a sleep diary and sleep restriction", "His sleep improves without tablets. CBT-I is first-line."],
      ["h", "Ask his doctor for nightly sleeping tablets long-term", "Dependence and tolerance develop."],
      ["o", "Give him a sleep hygiene leaflet and ask him to follow it for a month before you meet again", "Helpful, but alone it rarely fixes chronic insomnia."],
    ]),
  ]),
  s("wy-t010", "treatment", "Anorexia", "eating", "more-disorders", 3, "MDS", "Use family-based treatment for adolescents", "Divya, 15, anorexia", [
    b("Her parents ask how to help.", [
      ["o", "Tell them to let her decide what to eat so she feels in control of her own body", "The illness controls her eating; she needs support."],
      ["h", "Tell them to punish her for not eating", "Punishment increases conflict and secrecy."],
      ["b", "Explain family-based treatment where parents support meals while she recovers", "Her weight improves. Family-based treatment has the best evidence in teens."],
    ]),
  ]),
  s("wy-t011", "treatment", "Bulimia", "eating", "more-disorders", 2, "UMS", "Use CBT for bulimia", "Riya, 20, bulimia", [
    b("She asks what will help.", [
      ["b", "Offer CBT that targets binge-purge cycles and regular eating", "Binges reduce. CBT is first-line."],
      ["h", "Tell her to just stop vomiting", "She tries and fails within days, then feels worse about herself. Without treatment she cannot simply stop."],
      ["o", "Tell her to diet strictly so she does not binge, and to weigh herself every morning", "She restricts all day and binges at night. Strict dieting drives the binge-purge cycle."],
    ]),
  ]),
  s("wy-t012", "treatment", "ADHD", "child", "child", 2, "UMS", "Combine treatments for ADHD", "Aryan, 8, ADHD", [
    b("His parents ask whether he needs medicine or therapy.", [
      ["o", "Tell them only medicine works for ADHD, so therapy and school support are a waste of time", "Medicine helps, but parent training and school support matter too."],
      ["b", "Explain parent training, school support and medicine, chosen together", "A combined plan helps at home and school."],
      ["h", "Tell them to be stricter", "Blames parents and does not help."],
    ]),
  ]),
  s("wy-t013", "treatment", "Borderline personality", "personality", "personality", 3, "UMS", "Choose DBT", "Leela, 24, borderline personality disorder", [
    b("She has frequent self-harm and unstable relationships.", [
      ["h", "Tell her nothing can help personality disorders", "She leaves feeling hopeless. It is untrue: structured therapies help many people with personality disorders."],
      ["o", "Offer medicine as the main treatment, since her moods are so intense and changeable", "Medicine has limited evidence."],
      ["b", "Offer DBT or another structured therapy", "Self-harm reduces. DBT has good evidence."],
    ]),
  ]),
  s("wy-t014", "treatment", "Depression in pregnancy", "depression", "lifespan", 4, "MDS", "Weigh treatment in pregnancy", "Fatima, 28, depressed, 16 weeks pregnant", [
    b("She is afraid any treatment will harm the baby.", [
      ["b", "Explain the risks of both untreated depression and treatment options, and decide with her and her doctors", "She chooses therapy and close review. Shared decisions balance risks."],
      ["o", "Tell her to avoid all treatment until the baby is born, since that is the safest option", "Untreated depression also harms mother and baby."],
      ["h", "Tell her tablets are completely safe", "Not accurate; risks must be explained."],
    ]),
  ]),
  s("wy-t015", "treatment", "Treatment-resistant depression", "depression", "depression", 4, "MDS", "Review before escalating", "Mr Rao, 50, no response to two antidepressants", [
    b("The team wants to add a third medicine.", [
      ["o", "Agree to add another medicine, since the depression is severe and he needs help now", "Possible, but diagnosis and adherence should be checked."],
      ["b", "Review the diagnosis, adherence, alcohol and thyroid first, then discuss options like ECT or augmentation", "He has hidden alcohol use. Treating it helps."],
      ["h", "Tell him he will never get better", "He feels hopeless and stops attending. It is untrue; many people respond to later steps."],
    ]),
  ]),
  s("wy-t016", "treatment", "ECT consent", "depression", "ethics-law", 4, "UMDS", "Explain ECT honestly", "Mrs Menon, 70, severe depression", [
    b("Her family is scared ECT is cruel.", [
      ["h", "Tell them it is just like in films", "They refuse consent out of fear. Film images of ECT are false and frightening."],
      ["b", "Explain modern ECT under anaesthesia, its benefits and risks such as memory effects, and seek her informed consent", "They understand. She consents and improves."],
      ["o", "Tell them it is completely safe with no side effects at all, so they stop worrying about it", "Not true; memory effects should be explained."],
    ]),
  ]),
  s("wy-t017", "treatment", "Lithium monitoring", "stabilisers", "stabilisers", 2, "MDS", "Explain lithium safety", "Sunil, 40, starting lithium", [
    b("He asks what he needs to know.", [
      ["b", "Explain regular blood tests, drinking enough fluid, and avoiding certain painkillers", "He knows the signs of toxicity. Education prevents harm."],
      ["o", "Tell him to take it daily and not worry about anything else, since the doctor will monitor it", "He gets dehydrated in summer and becomes toxic. Without the safety points he cannot protect himself."],
      ["h", "Tell him lithium is just salt and harmless", "He takes painkillers that raise his level. Lithium has a narrow safe range and can be toxic."],
    ]),
  ]),
  s("wy-t018", "treatment", "Clozapine start", "antipsychotics", "antipsychotics", 3, "MDS", "Prepare for clozapine", "Imran, 30, treatment-resistant schizophrenia", [
    b("He agrees to start clozapine.", [
      ["o", "Start it with no special monitoring, since he has tolerated antipsychotics well before", "Clozapine needs blood monitoring."],
      ["h", "Tell him it is too dangerous", "It is the most effective option for resistant schizophrenia."],
      ["b", "Explain blood tests, side effects to report, and the benefits", "He knows to report fever. Treatment is safe and effective."],
    ]),
  ]),
  s("wy-t019", "treatment", "Stopping antidepressants", "antidepressants", "antidepressants", 2, "MDS", "Taper antidepressants", "Meena, 35, well on sertraline for a year", [
    b("She wants to stop tomorrow.", [
      ["h", "Tell her to stop tomorrow", "Sudden stopping can cause discontinuation symptoms and relapse."],
      ["b", "Suggest she talk to her prescriber about a gradual taper", "She tapers slowly and stays well."],
      ["o", "Tell her she must never stop because depression always returns", "Not true; many can stop safely."],
    ]),
  ]),
  s("wy-t020", "treatment", "Psychoeducation", "schizophrenia", "psychosis", 2, "UMS", "Educate the family", "Family of a young man with schizophrenia", [
    b("They think he is lazy.", [
      ["b", "Explain negative symptoms and how to support him", "They become supportive and relapse risk falls."],
      ["o", "Tell them he will get better if they push him harder to do things around the house", "Pressure and criticism raise relapse."],
      ["h", "Agree he is lazy", "The family keeps nagging him and he withdraws further. Calling negative symptoms laziness is stigmatising."],
    ]),
  ]),
  s("wy-t021", "treatment", "Relapse prevention in alcohol", "substance", "substance", 3, "UMS", "Plan for high-risk situations", "Vikram, 40, sober three months", [
    b("He is invited to a wedding where everyone drinks.", [
      ["o", "Tell him to avoid all weddings for life so he is never tempted to drink again", "He feels he can never have a normal life and drops out. Lifelong avoidance is not realistic."],
      ["b", "Plan how he will handle offers, who he will go with, and when to leave", "He attends with a sober friend, has a soft drink and leaves early, still sober. A plan beats willpower."],
      ["h", "Tell him one drink will be fine", "He has one drink, then many. In early recovery one drink often risks full relapse."],
    ]),
  ]),
  s("wy-t022", "treatment", "Goals of therapy", "therapies", "therapies", 1, "CUS", "Set shared goals", "New client, 30", [
    b("You start therapy.", [
      ["h", "Set your own goals without asking", "She disagrees with your goals and stops coming. Goals set without her rarely hold."],
      ["b", "Agree clear goals with her", "She feels involved. Shared goals predict better outcomes."],
      ["o", "Let sessions flow without goals and see where they lead over the next few months", "Sessions wander and after months she asks what has changed. Therapy without goals can drift."],
    ]),
  ]),
  s("wy-t023", "treatment", "Ending therapy", "therapies", "therapies", 2, "US", "Plan endings", "Client, 35, improved after 12 sessions", [
    b("You plan to end.", [
      ["o", "End abruptly at the last session and wish her well for the future", "She feels dropped and her symptoms return. An abrupt ending feels like abandonment."],
      ["h", "Keep going indefinitely", "She starts to believe she cannot cope without you. Endless therapy can create dependence."],
      ["b", "Plan the ending ahead, review progress and make a relapse plan", "She leaves confident, with a written plan for setbacks. Planned endings protect gains."],
    ]),
  ]),
  s("wy-t024", "treatment", "Therapy for social anxiety", "anxiety", "anxiety", 2, "UMS", "Use CBT for social anxiety", "Arun, 22, social anxiety", [
    b("He avoids presentations.", [
      ["b", "Use CBT with behavioural experiments and graded exposure", "He presents to a small group. Confidence grows."],
      ["h", "Tell him to just be confident", "He tries to act confident and panics on stage. Being told to be confident is unhelpful."],
      ["o", "Let him skip presentations until he feels ready, and ask the teacher to excuse him", "He avoids every presentation and his fear grows. Avoidance maintains fear."],
    ]),
  ]),
  s("wy-t025", "treatment", "Specific phobia", "anxiety", "anxiety", 1, "CUS", "Use exposure for phobia", "Neha, 25, fear of dogs", [
    b("She wants to get over it.", [
      ["o", "Tell her to avoid dogs, since there is no real need to be near them in daily life", "She keeps crossing roads to avoid dogs and the fear stays. Avoidance maintains fear."],
      ["b", "Plan gradual exposure from pictures to real dogs", "She can now walk past a dog on the street. Small, repeated steps let fear fall."],
      ["h", "Push her to hold a big dog on the first day", "Flooding without consent can backfire."],
    ]),
  ]),
  s("wy-t026", "treatment", "Grief", "depression", "depression", 2, "US", "Support grief without medicalising", "Mr Das, 60, recently widowed", [
    b("His son wants an antidepressant for him.", [
      ["h", "Agree immediately", "Grief is not an illness to medicate."],
      ["o", "Tell the son that grief is normal and nothing at all needs to be done for his father", "His father struggles alone for months. Grief is normal, but support may still help."],
      ["b", "Offer support, explain normal grief, and review for depression", "He is supported and monitored."],
    ]),
  ]),
  s("wy-t027", "treatment", "Behavioural activation", "depression", "depression", 2, "UMS", "Use behavioural activation", "Kunal, 28, depressed, stays in bed", [
    b("He says he will start doing things when he feels better.", [
      ["b", "Plan small, valued activities now", "Mood lifts after doing things. Action often comes before motivation."],
      ["h", "Agree to wait", "Inactivity deepens depression."],
      ["o", "Tell him to force himself to do everything he used to do, all at once, from tomorrow", "He tries everything on day one, fails by day two and feels worse. Too much too soon fails."],
    ]),
  ]),
  s("wy-t028", "treatment", "Motivational interviewing", "substance", "substance", 3, "UMS", "Use motivational interviewing", "Raju, 35, ambivalent about drinking", [
    b("He says, 'I drink, but it's not a problem.'", [
      ["o", "List all the harms of alcohol so he understands the danger he is in", "He gets defensive and changes the subject. Lectures increase resistance to change."],
      ["b", "Explore what he likes about drinking and what worries him", "He says he worries about his daughter. Change talk begins."],
      ["h", "Tell him he is an alcoholic", "He refuses the label and the treatment. Labels push people away."],
    ]),
  ]),
  s("wy-t029", "treatment", "Autism support", "child", "child", 3, "US", "Plan autism support", "Aarav, 4, autism", [
    b("Parents ask what will help.", [
      ["h", "Tell them he will grow out of it", "Two years pass before help starts. Waiting for him to grow out of it delays support."],
      ["b", "Explain early intervention for communication, behaviour and daily skills", "He gains words and daily skills over the year. Early intervention works best."],
      ["o", "Suggest a special diet first, since many parents online say it cured their child", "The family spends money and months on a diet with little change. Evidence for such diets is weak."],
    ]),
  ]),
  s("wy-t030", "treatment", "Dementia care", "dementia", "neurocognitive", 2, "UMS", "Plan dementia care", "Mrs Shah, 78, Alzheimer's", [
    b("Her family asks what to do.", [
      ["b", "Discuss medicine options, routines, safety and carer support", "They feel prepared and know what support exists. Practical planning helps carers cope."],
      ["o", "Tell them nothing can be done, since dementia always gets worse whatever anyone does", "They give up hope and stop seeking help. It is untrue; much can improve life in dementia."],
      ["h", "Suggest she be locked in her room", "She becomes frightened and agitated. Locking a person in is harmful and unsafe."],
    ]),
  ]),
  s("wy-t031", "treatment", "Psychosis early intervention", "schizophrenia", "psychosis", 3, "UMS", "Use early intervention", "First-episode psychosis, 19", [
    b("He is reluctant to engage.", [
      ["o", "Wait until he is ready to come on his own, since forcing contact may push him away", "Months pass and he relapses before starting care. Delay worsens outcomes in early psychosis."],
      ["b", "Offer flexible, youth-friendly early intervention with family involvement", "He engages. Early care improves outcomes."],
      ["h", "Discharge him", "He relapses within months. Discharging a reluctant young person loses the chance to help."],
    ]),
  ]),
  s("wy-t032", "treatment", "Depression and exercise", "depression", "depression", 1, "CUS", "Include exercise in treatment", "Neha, 30, mild depression", [
    b("She asks what she can do herself.", [
      ["h", "Tell her nothing helps except medicine", "She feels there is nothing she can do. It is untrue; activity and routine help."],
      ["b", "Suggest regular walks or activity she enjoys", "Her mood lifts. Exercise helps depression."],
      ["o", "Tell her to join a gym and train daily for an hour from tomorrow, however she feels", "She goes once, aches for a week and gives up. Too much exercise at once often fails."],
    ]),
  ]),
  s("wy-t033", "treatment", "Medication side effects", "antidepressants", "antidepressants", 2, "MDS", "Address side effects early", "Rakesh, 30, on an SSRI", [
    b("He has nausea in the first week.", [
      ["b", "Explain that early nausea often settles and to take the tablet with food", "It settles within days and he continues. Explaining early side effects keeps people on treatment."],
      ["o", "Tell him to stop the tablet at once, since side effects mean it is the wrong medicine", "He stops a medicine that would likely have helped. Early nausea is common and often passes."],
      ["h", "Ignore it", "He stops the tablet secretly. Ignored side effects are a common reason for quiet stopping."],
    ]),
  ]),
  s("wy-t034", "treatment", "Safety behaviours", "anxiety", "anxiety", 3, "UMS", "Drop safety behaviours", "Leena, 28, panic", [
    b("She always carries water and sits near exits.", [
      ["o", "Let her keep them as long as she likes, since they make her feel more comfortable", "Safety behaviours maintain fear."],
      ["h", "Take them away suddenly without explanation", "She panics and loses trust in you. Removing safety behaviours without a plan backfires."],
      ["b", "Plan to reduce safety behaviours gradually as part of exposure", "She learns she is safe without them."],
    ]),
  ]),
  s("wy-t035", "treatment", "Couple therapy", "therapies", "therapies", 2, "US", "Choose couple therapy for relationship conflict", "Couple, frequent fights", [
    b("Each blames the other.", [
      ["h", "Take one side", "The other partner feels judged and leaves therapy. Taking sides breaks couple work."],
      ["b", "Offer couple sessions focused on communication patterns", "They argue less and listen more. Couple work on patterns helps both partners."],
      ["o", "See each partner alone only and never together, so that each can speak freely", "Each feels better alone but the fights continue. Individual work alone misses the shared pattern."],
    ]),
  ]),
  s("wy-t036", "treatment", "Family therapy", "therapies", "therapies", 3, "US", "Use family therapy", "Teen, 15, with conflict at home", [
    b("Parents and teen fight constantly.", [
      ["b", "Offer family sessions to work on communication", "Fights reduce and the teen feels heard. Family sessions change the pattern, not just one person."],
      ["o", "Treat the teen alone, since she is the one with the problem and the parents are fine", "The fights continue at home. Treating the teen alone misses the family pattern."],
      ["h", "Blame the parents", "The parents feel blamed and stop coming. Blame makes families disengage."],
    ]),
  ]),
  s("wy-t037", "treatment", "Group therapy", "therapies", "therapies", 2, "US", "Use groups well", "Adults with social anxiety", [
    b("You plan a group.", [
      ["o", "Mix people with all kinds of problems in one big open group, so that everyone feels included", "Sessions lose focus and members drop out. Mixed open groups are less focused."],
      ["b", "Set clear rules, confidentiality and goals", "The group runs safely and members open up. Clear rules make sharing safe."],
      ["h", "Allow members to share outside the group", "One member's story spreads around her office. Sharing outside the group breaches confidentiality."],
    ]),
  ]),
  s("wy-t038", "treatment", "Mindfulness", "therapies", "therapies", 2, "US", "Use mindfulness for recurrent depression", "Mr Pillai, 45, three past depressions", [
    b("He is well now and asks how to prevent relapse.", [
      ["h", "Tell him nothing helps", "He feels there is no way to protect himself. It is untrue; relapse prevention works."],
      ["b", "Suggest mindfulness-based cognitive therapy", "His risk of relapse falls. MBCT reduces relapse in people with recurrent depression."],
      ["o", "Tell him to stop medicine now he is well, and come back if the depression returns", "He relapses within months. Stopping medicine soon after recovery raises relapse risk."],
    ]),
  ]),
  s("wy-t039", "treatment", "Somatic symptoms", "dsm-somatic", "more-disorders", 3, "UMS", "Manage somatic symptom disorder", "Mrs Shaikh, 50, many symptoms", [
    b("She sees many doctors.", [
      ["b", "Suggest one regular doctor, scheduled visits and CBT", "Visits fall and coping improves."],
      ["o", "Order more tests each time she comes, to reassure her that nothing serious is wrong", "Each normal test brings relief for a day, then more fear. More tests reinforce health anxiety."],
      ["h", "Tell her it is all in her head", "She feels dismissed and finds another doctor. Calling it all in her head is dismissive."],
    ]),
  ]),
  s("wy-t040", "treatment", "Childhood anxiety", "anxiety", "anxiety", 2, "US", "Involve parents in child anxiety", "Mira, 8, separation anxiety", [
    b("Her mother stays with her at school all day.", [
      ["o", "Let the mother stay as long as Mira needs her, however long that takes", "Mira cannot manage without her mother. Staying all day maintains anxiety."],
      ["b", "Plan gradual separation with parent coaching", "Mira stays at school alone within weeks. Gradual steps with coaching build confidence."],
      ["h", "Force a sudden separation", "Mira screams and refuses school entirely. A sudden separation terrifies her."],
    ]),
  ]),
  s("wy-t041", "treatment", "Pain and depression", "depression", "depression", 3, "US", "Treat pain and mood together", "Mrs Reddy, 60, arthritis and depression", [
    b("She asks which to treat first.", [
      ["h", "Treat only the pain", "Her mood worsens and the pain feels worse too. Depression amplifies pain."],
      ["b", "Plan care for both with her doctor", "Both improve over the months. Joint care treats the two conditions that feed each other."],
      ["o", "Treat only the depression and leave the pain to her rheumatologist to sort out", "Her mood lifts a little but daily pain keeps her low. Pain and mood need joint care."],
    ]),
  ]),
  s("wy-t042", "treatment", "Hoarding", "ocd", "ocd", 3, "US", "Plan hoarding treatment", "Mr Kumar, 70, hoarding", [
    b("His son wants to clear the house at once.", [
      ["o", "Agree with the son and organise a full clean-out this weekend while he is out", "Forced clearing causes distress and refilling."],
      ["b", "Work with him on sorting, decision-making and gradual discarding", "His home becomes safer and he keeps it that way. Working at his pace builds lasting change."],
      ["h", "Do nothing", "A fire starts in the clutter months later. Doing nothing leaves fire and fall risk."],
    ]),
  ]),
  s("wy-t043", "treatment", "Gambling", "dsm-substance", "more-disorders", 3, "UMS", "Plan gambling treatment", "Raj, 30, gambling disorder", [
    b("He has large debts.", [
      ["b", "Offer CBT, financial controls and support for his family", "He stops gambling and repays debts slowly. Combined therapy and financial control work."],
      ["h", "Lend him money", "He gambles the loan away the same week. Lending money fuels gambling."],
      ["o", "Tell him to stop using betting apps, and trust him to manage it from here on his own", "He downloads a new app within days. Willpower alone is not enough for gambling disorder."],
    ]),
  ]),
  s("wy-t044", "treatment", "Tics", "child", "child", 2, "US", "Manage tics", "Arav, 10, Tourette's", [
    b("Parents ask him to stop.", [
      ["o", "Tell the parents to remind him to stop each time it happens, so he learns control", "His tics increase with every reminder. Attention and stress increase tics."],
      ["b", "Explain tics, reduce attention to them, and consider habit reversal training", "His tics reduce and he feels less singled out. Less attention and habit reversal help."],
      ["h", "Punish him", "His tics get worse and he becomes anxious. Punishment increases stress and tics."],
    ]),
  ]),
  s("wy-t045", "treatment", "Postpartum depression", "depression", "lifespan", 3, "MDS", "Plan postpartum care", "Mother, 28, postpartum depression", [
    b("She is breastfeeding.", [
      ["h", "Tell her to stop breastfeeding to take medicine", "She stops breastfeeding when she did not need to. Many medicines are compatible with feeding."],
      ["b", "Offer therapy and discuss medicines compatible with breastfeeding", "She improves and continues feeding."],
      ["o", "Tell her it will pass on its own within a few weeks, as it does for most mothers", "Postpartum depression needs treatment."],
    ]),
  ]),
  s("wy-t046", "treatment", "Psychosis and cannabis", "schizophrenia", "psychosis", 3, "UMS", "Address cannabis in psychosis", "Rahul, 22, psychosis and cannabis", [
    b("He says cannabis helps him relax.", [
      ["b", "Explore its effects and link cannabis to relapse risk, using motivational approaches", "He cuts down and his symptoms settle. Exploring his own reasons works better than orders."],
      ["o", "Ignore the cannabis and focus only on his medicine, since that matters most", "He keeps smoking and relapses. Cannabis worsens psychosis."],
      ["h", "Refuse to treat him until he stops", "He leaves and is not seen again. Refusing treatment until he stops makes him disengage."],
    ]),
  ]),
  s("wy-t047", "treatment", "Self-harm treatment", "suicide", "suicide", 3, "UMS", "Teach alternatives to self-harm", "Tanya, 16, cuts", [
    b("She wants to stop.", [
      ["o", "Give her a rubber band to snap on her wrist instead, and tell her to use it whenever the urge comes", "She snaps it until her wrist bruises. Replacement pain may still be harmful."],
      ["b", "Teach distress tolerance skills and plan for urges", "Her self-harm reduces over months. Skills give her other ways to handle distress."],
      ["h", "Tell her to just stop", "She cannot stop and feels a failure. Without skills, she cannot simply stop."],
    ]),
  ]),
  s("wy-t048", "treatment", "Delusional disorder", "schizophrenia", "psychosis", 4, "MDS", "Engage a person with delusional disorder", "Mr Iyer, 55, jealous delusions", [
    b("He refuses medicine.", [
      ["h", "Argue about the delusion", "He leaves angry. Arguing about a delusion breaks trust."],
      ["o", "Discharge him since he refuses medicine and says he does not want your help", "He stops coming and his wife remains at risk. Discharge leaves the risk unmanaged."],
      ["b", "Focus on his distress, build trust, and offer treatment for it", "He accepts help for sleep and stress, then medicine."],
    ]),
  ]),
  s("wy-t049", "treatment", "Late-life depression", "depression", "lifespan", 3, "MDS", "Treat depression in older adults", "Mrs Nair, 75, depressed", [
    b("Her family thinks it is normal ageing.", [
      ["b", "Explain that depression is treatable at any age", "She improves with therapy and her family is relieved. Depression is treatable at any age."],
      ["o", "Agree it is part of ageing, and suggest she spend more time with the grandchildren", "She stays depressed. Calling depression normal ageing misses treatment."],
      ["h", "Tell her to get over it", "She feels dismissed and stops talking. Telling her to get over it is dismissive."],
    ]),
  ]),
  s("wy-t050", "treatment", "Psychotherapy choice", "therapies", "therapies", 3, "UMS", "Match therapy to the problem", "Client, 30, relationship patterns", [
    b("She has repeated painful relationships.", [
      ["o", "Offer only exposure therapy, since it has strong evidence for many problems", "She does exercises that do not touch her real problem. Exposure is not suited to relationship patterns."],
      ["b", "Consider psychodynamic or schema-focused therapy to explore patterns", "She understands her patterns and chooses differently. Pattern-focused therapy fits this problem."],
      ["h", "Tell her to avoid relationships", "She becomes lonely and the pattern remains. Avoiding relationships is unhelpful."],
    ]),
  ]),
  s("wy-t051", "treatment", "Cultural adaptation", "therapies", "therapies", 3, "US", "Adapt therapy to culture", "Mr Singh, 50, devout Sikh", [
    b("He says prayer helps him.", [
      ["h", "Tell him prayer is not therapy", "He feels his faith is mocked and leaves. Dismissing faith dismisses a strength."],
      ["b", "Include his faith as a coping resource", "He feels respected and engages."],
      ["o", "Ignore his faith completely and stick to the standard plan as written in the manual", "He follows the plan politely but without heart. Ignoring his faith misses a resource."],
    ]),
  ]),
  s("wy-t052", "treatment", "Medicine adherence in bipolar", "bipolar", "bipolar", 3, "UMS", "Explore reasons for stopping", "Arjun, 30, stops lithium when well", [
    b("He misses the highs.", [
      ["o", "Tell him to stay on it or he will be admitted, and leave it at that", "He nods, then stops lithium again. Threats rarely work in the long run."],
      ["b", "Explore what he misses, weigh pros and cons, and plan together", "He agrees to continue and to watch for early signs. Exploring what he misses builds his own reasons."],
      ["h", "Ignore it", "He stops lithium and relapses within months. Ignoring the issue raises relapse risk."],
    ]),
  ]),
  s("wy-t053", "treatment", "Exposure for PTSD", "ptsd", "trauma", 4, "UMS", "Pace exposure", "Asha, 30, PTSD", [
    b("She is very anxious about exposure.", [
      ["b", "Build skills and trust first, then pace exposure", "She completes therapy and her nightmares fade. Pacing keeps her in treatment."],
      ["h", "Start full exposure today", "She panics and drops out. Starting full exposure too soon overwhelms people."],
      ["o", "Avoid exposure entirely and use only relaxation, since she finds the memories too painful", "She feels calmer but the nightmares remain. Relaxation alone is less effective for PTSD."],
    ]),
  ]),
  s("wy-t054", "treatment", "Psychosis and family", "schizophrenia", "psychosis", 3, "UMS", "Reduce expressed emotion", "Family of a man with schizophrenia", [
    b("They are very critical of him.", [
      ["o", "Tell the family to avoid him as much as possible so there is less conflict at home", "He becomes lonely and relapses. Isolation harms people with schizophrenia."],
      ["b", "Offer family work to reduce criticism and improve communication", "Criticism falls and his relapses become rarer. Family work lowers expressed emotion."],
      ["h", "Agree with their criticism", "He feels attacked and relapses. Agreeing with criticism worsens relapse risk."],
    ]),
  ]),
  s("wy-t055", "treatment", "Sleep in bipolar", "bipolar", "bipolar", 2, "UMS", "Protect sleep in bipolar", "Neha, 28, bipolar, night shifts", [
    b("She has started night shifts.", [
      ["h", "Ignore it", "Disrupted sleep can trigger mania."],
      ["b", "Discuss the risk and plan regular sleep or a schedule change", "She stays well through the season. Regular sleep protects against mood episodes."],
      ["o", "Tell her to take sleeping pills during the day so she can keep working the night shifts", "She sleeps badly in the day and her mood rises. Sleeping pills are not a long-term solution."],
    ]),
  ]),
  s("wy-t056", "treatment", "Substance use and family", "substance", "substance", 3, "US", "Support family of a drinker", "Wife of a man who drinks", [
    b("She asks how to help him.", [
      ["o", "Tell her to hide his bottles and pour the alcohol away whenever she finds it", "He drinks more and hides it. Hiding bottles can increase conflict and secrecy."],
      ["b", "Offer support for her and approaches like CRAFT to encourage him into treatment", "He agrees to treatment after months of her new approach. CRAFT helps families engage drinkers."],
      ["h", "Tell her to leave him", "She feels judged and stops coming. Whether to leave is her decision, not yours."],
    ]),
  ]),
  s("wy-t057", "treatment", "Psychosis relapse plan", "schizophrenia", "psychosis", 3, "UMS", "Make a relapse plan", "Arun, 28, stable", [
    b("You plan for relapse.", [
      ["b", "Agree early signs, who to call and what to do", "Relapse is caught early and treated at home. A clear plan turns signs into action."],
      ["h", "Assume he will not relapse", "He relapses and no one knows what to do. Relapse is common and needs a plan."],
      ["o", "Ask him to call you if he feels unwell, without agreeing what signs to watch for", "He feels unwell but is not sure whether it counts. A vague plan is too vague to use."],
    ]),
  ]),
  s("wy-t058", "treatment", "Medication review in older adults", "dementia", "medicine-profiles", 4, "MDS", "Reduce harmful medicines", "Mr Rao, 80, on many medicines", [
    b("He has falls and confusion.", [
      ["o", "Add a new medicine for the confusion, so that he becomes clearer during the day", "He becomes drowsier and falls again. Adding medicines adds risk."],
      ["b", "Suggest a full medicine review with his doctor", "Sedatives are reduced; falls stop."],
      ["h", "Ignore it", "He falls again and breaks his hip. Ignoring the medicines lets falls continue."],
    ]),
  ]),
  s("wy-t059", "treatment", "Interpersonal therapy", "depression", "depression", 3, "UMS", "Choose IPT for role transitions", "Woman, 40, depressed after moving cities", [
    b("Her depression began after a move.", [
      ["h", "Tell her to move back", "She feels you have not understood her life. Moving back is not practical."],
      ["b", "Offer interpersonal therapy focused on the role transition", "She adapts to the new city and her mood lifts. IPT targets role transitions."],
      ["o", "Offer only medicine, since depression is a chemical problem whatever the trigger", "Her mood lifts a little but she still feels lost. Medicine alone misses the trigger."],
    ]),
  ]),
  s("wy-t060", "treatment", "Treatment for complex trauma", "ptsd", "trauma", 5, "UMS", "Phase treatment for complex trauma", "Woman, 28, years of childhood abuse", [
    b("She has PTSD, self-harm and unstable moods.", [
      ["o", "Start trauma exposure work straight away, since the trauma is the root of everything", "She becomes overwhelmed and self-harms. Starting with exposure may overwhelm her."],
      ["b", "Begin with safety and stabilisation, then trauma processing, then reintegration", "She stabilises and progresses."],
      ["h", "Focus only on her moods", "Her moods steady a little but flashbacks continue. Focusing only on moods misses the trauma."],
    ]),
    b("She says she feels ready to talk about the abuse.", [
      ["b", "Check her coping skills and safety, then start trauma processing at her pace", "She processes memories safely."],
      ["h", "Push for every detail in one session", "She is overwhelmed and dissociates. Pushing for every detail at once overwhelms her."],
      ["o", "Tell her to wait another year to be sure she is completely stable first", "She feels you doubt her and loses momentum. Delay may not be needed when she is ready."],
    ], "She is stable and has strong coping skills."),
  ]),
  s("wy-t061", "treatment", "Full case: depression with alcohol", "depression", "depression", 5, "MDS", "Plan treatment for comorbidity", "Mr Thomas, 45, depression and heavy drinking", [
    b("He wants help with his mood but not his drinking.", [
      ["h", "Treat only the mood", "His mood improves a little, then drinking pulls it down again. Drinking blocks recovery."],
      ["o", "Refuse to treat the mood until he is completely sober for at least three months", "He disengages and keeps drinking. Refusing treatment until sobriety loses him."],
      ["b", "Treat both together, using motivational work for alcohol", "He cuts down and his mood improves."],
    ]),
    b("He has cut down but still drinks at weekends.", [
      ["b", "Praise progress, explore weekend triggers and continue both treatments", "He reduces further and his mood keeps improving. Praising progress keeps change going."],
      ["h", "Tell him he has failed", "He feels ashamed and drinks more that weekend. Shame increases drinking."],
      ["o", "Stop all treatment because he has not stopped drinking completely as agreed", "He loses the progress he made. Stopping treatment for partial change throws away gains."],
    ], "His mood is a little better."),
  ]),
];
