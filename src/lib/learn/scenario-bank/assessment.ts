import type { Scenario } from "../scenarios";
import { b, s } from "./make";

/** Assessment: history, MSE, collateral, differential and culture. */
export const ASSESSMENT: Scenario[] = [
  s("wy-a001", "assessment", "Opening the interview", "interview", "interview-mse", 1, "CUS", "Open with an open question", "Mrs Nair, 45, first visit", [
    b("She sits down and waits for you to speak.", [
      ["h", "“So, are you depressed?”", "She says no and goes quiet. A closed, labelling first question shuts down the story."],
      ["b", "“Tell me what has brought you here today.”", "She talks for five minutes and you hear the main problem in her own words. Open questions let the patient lead first."],
      ["o", "“Let's go through your background first: where were you born, how many siblings, what schooling, and then your medical history.”", "You collect facts, but she still has not said why she came. Start with the presenting problem."],
    ]),
  ]),
  s("wy-a002", "assessment", "Clarifying vague terms", "how-patients-talk", "interview-mse", 2, "US", "Turn vague words into specific symptoms", "Mr Yadav, 50", [
    b("“Doctor, I have tension all the time.”", [
      ["o", "Write 'anxiety' in the notes and move on to his family history and the medicines he takes, since 'tension' usually means anxiety", "'Tension' can mean worry, low mood, headache or family conflict. You have guessed."],
      ["b", "“When you say tension, what does it feel like, and when is it worst?”", "He describes a band-like headache after quarrels with his son. Asking for an example turns a vague word into a symptom."],
      ["h", "“Everyone has tension. You must relax.”", "He feels dismissed. You learned nothing."],
    ]),
  ]),
  s("wy-a003", "assessment", "Screening for mania", "bipolar", "bipolar", 2, "UMS", "Screen for past highs in depression", "Kavitha, 27, low for two months", [
    b("You are about to suggest she see a psychiatrist about antidepressants.", [
      ["b", "First ask: “Have you ever had days when you needed little sleep but felt full of energy?”", "She describes a week like that last year. That changes the treatment choice."],
      ["h", "Recommend an antidepressant straight away", "If she has bipolar disorder, an antidepressant alone can trigger mania."],
      ["o", "Ask whether anyone in her family has had depression, and note her answer for the psychiatrist to follow up on later", "Family history helps, but asking about her own past highs matters more."],
    ]),
  ]),
  s("wy-a004", "assessment", "Collateral history", "interview", "interview-mse", 2, "UMS", "Seek collateral when insight is low", "Sameer, 22, brought by parents", [
    b("He says he is fine and was forced to come.", [
      ["o", "Accept his account, since he is an adult and the interview is about his own experience, and end the session", "He may be fine, but you have not heard what worried the family."],
      ["h", "Interview only the parents and ignore him", "He feels talked about and will not return. Both views matter."],
      ["b", "Hear him first, then ask his consent to speak with his parents", "Parents describe weeks without sleep and new strange beliefs. Collateral fills gaps in insight."],
    ]),
  ]),
  s("wy-a005", "assessment", "Asking about substances", "substance", "substance", 1, "CUS", "Ask about substance use routinely", "Rina, 24, with anxiety", [
    b("You have not yet asked about drugs or alcohol.", [
      ["b", "“Many people use alcohol, cannabis or other things to cope. What do you use?”", "She uses cannabis daily. Normalising wording gets honest answers."],
      ["h", "Skip it; she seems like a nice girl", "Assumptions miss substance use, which can cause or worsen anxiety."],
      ["o", "“You don't take any drugs or drink alcohol, do you?”", "A question framed to expect 'no' usually gets 'no'."],
    ]),
  ]),
  s("wy-a006", "assessment", "MSE: describing affect", "mse", "mse-deep", 2, "UMS", "Describe affect precisely", "Writing the MSE for Mr Lal", [
    b("He spoke in a flat voice, rarely smiled, and his expression did not change when talking about his son's wedding.", [
      ["o", "Write 'affect: depressed', which is short and every reader will understand it at a glance", "'Depressed' describes mood, not range. Describe what you saw."],
      ["b", "Write 'affect: restricted range, flat in tone, not reactive to happy content'", "The next clinician can picture him. Describe before you label."],
      ["h", "Write 'affect: normal'", "This is inaccurate and could hide negative symptoms or depression."],
    ]),
  ]),
  s("wy-a007", "assessment", "Checking cognition", "mse", "mse-deep", 2, "UMS", "Test attention before memory", "Mrs Shah, 79, confused", [
    b("You want to test her cognition.", [
      ["h", "Ask her for the Prime Minister's name only", "One question cannot assess cognition and may reflect education, not illness."],
      ["o", "Do a full memory test straight away, starting with recall of a long address and five words", "Memory tests are unreliable if attention is poor. Check attention first."],
      ["b", "Start with attention, such as months of the year backwards, then orientation and memory", "She cannot do the months backwards. Poor attention points to delirium."],
    ]),
  ]),
  s("wy-a008", "assessment", "Cultural formulation", "how-patients-talk", "interview-mse", 3, "UMS", "Explore the patient's explanation", "Mr Bose, 40, believes his illness is a curse", [
    b("“My neighbour put a curse on me. That's why I can't sleep.”", [
      ["b", "“Tell me more about how the curse is affecting you, and what you think would help.”", "He wants both a puja and treatment for sleep. You work with his beliefs."],
      ["h", "“Curses aren't real. You have depression.”", "He feels mocked and leaves for a faith healer only."],
      ["o", "Note 'possible delusion' and move on to checking for hallucinations, mood symptoms and his sleep pattern in detail", "A belief shared by one's culture is not a delusion. Ask how common it is in his community first."],
    ]),
  ]),
  s("wy-a009", "assessment", "Asking about trauma", "ptsd", "trauma", 3, "UMS", "Ask about trauma with care", "Asha, 30, with nightmares", [
    b("You suspect past trauma.", [
      ["o", "Wait until she brings it up, so she does not feel pushed, even if that takes many sessions", "Many people never raise trauma unless asked."],
      ["h", "Ask for full details of what happened today", "Pushing for detail too early can overwhelm her."],
      ["b", "“Some people with nightmares have been through something frightening. Has anything like that happened to you?”", "She nods and says she does not want to talk about details yet. You respect that and plan next steps."],
    ]),
  ]),
  s("wy-a010", "assessment", "Medical history", "interview", "interview-mse", 2, "CUS", "Always take a medical and medicine history", "Raju, 35, new anxiety", [
    b("You have heard about his anxiety and stress at work.", [
      ["b", "Ask about physical illnesses, medicines, and thyroid or heart symptoms", "He started asthma tablets last month. Medicines and medical illness often cause psychiatric symptoms."],
      ["h", "Skip medical history; you are not a doctor", "Medical causes of anxiety are common. Asking helps you refer correctly."],
      ["o", "Ask only about past psychiatric treatment, because that is your area and the doctor will cover the rest", "Useful, but misses the medicines and illnesses that can mimic anxiety."],
    ]),
  ]),
  s("wy-a011", "assessment", "Differential diagnosis", "dsm-depressive", "depression", 3, "UMDS", "Think beyond the first label", "Mrs Patel, 62, low and tired", [
    b("She has low mood, weight gain and constipation.", [
      ["o", "Diagnose depression and start therapy, since her mood symptoms are clear and she wants help quickly", "Depression is possible, but you have skipped a medical cause."],
      ["b", "Consider hypothyroidism and ask her doctor to check thyroid function", "Her TSH is high. Physical symptoms pointed to a medical mimic."],
      ["h", "Tell her it is just age", "Dismissing symptoms misses treatable illness."],
    ]),
  ]),
  s("wy-a012", "assessment", "Interviewing adolescents", "child", "child", 2, "UMS", "See adolescents alone", "Tanvi, 15, with her mother", [
    b("Her mother answers every question for her.", [
      ["h", "Let her mother continue; she knows the facts", "Tanvi has not spoken. You may miss self-harm, abuse or substance use."],
      ["b", "Thank the mother, then ask to see Tanvi alone for part of the session", "Tanvi talks about bullying and self-harm. Adolescents need time alone with the clinician."],
      ["o", "Ask Tanvi to speak while her mother is still in the room, encouraging her gently to give her own view", "She stays quiet. Some topics are hard to raise in front of parents."],
    ]),
  ]),
  s("wy-a013", "assessment", "Assessing insight", "mse", "mse-deep", 3, "UMS", "Assess insight in layers", "Vijay, 30, with psychosis", [
    b("You want to record his insight.", [
      ["o", "Write 'insight absent' because he will not take medicine, which shows he does not accept the illness", "Insight has parts: awareness of change, attribution to illness, and acceptance of treatment."],
      ["h", "Skip insight; it is obvious", "Insight guides consent, adherence and risk planning."],
      ["b", "Ask whether he has noticed changes, what he thinks causes them, and whether treatment could help", "He knows something is wrong but blames neighbours. Partial insight shapes the plan."],
    ]),
  ]),
  s("wy-a014", "assessment", "Assessing intellectual disability", "child", "child", 3, "UMS", "Assess adaptive function", "Gaurav, 12", [
    b("His school asks whether he has an intellectual disability.", [
      ["b", "Do an IQ test and an adaptive behaviour assessment, with developmental history", "IQ alone is not enough. Adaptive function sets severity."],
      ["h", "Judge it by his school marks", "Marks reflect many things, such as teaching, language and attention."],
      ["o", "Do only an IQ test, since the school wants a number for its records and that is the standard measure", "IQ alone misses adaptive skills, which are central to diagnosis."],
    ]),
  ]),
  s("wy-a015", "assessment", "Assessing sleep", "dsm-elimination-sleep", "more-disorders", 2, "US", "Take a sleep history", "Neha, 40, can't sleep", [
    b("She wants sleeping tablets.", [
      ["h", "Ask her doctor for tablets", "You have not understood her insomnia."],
      ["o", "Give her a sleep hygiene leaflet with tips on caffeine, screens and bedtime, and ask her to read it at home", "Helpful later, but you have not assessed the type and cause of her insomnia."],
      ["b", "Ask about bedtime, wake time, naps, caffeine, mood, snoring and worries", "She drinks four teas after 6pm and worries about her job. Now you can plan."],
    ]),
  ]),
  s("wy-a016", "assessment", "Somatic symptoms", "dsm-somatic", "more-disorders", 3, "UMS", "Assess somatic symptoms without dismissing them", "Mr Shaikh, 48, chest pain for a year", [
    b("Cardiac tests are normal. He insists something is wrong.", [
      ["o", "Tell him the tests are normal so it must be stress, and that he should stop worrying about his heart", "True perhaps, but he feels dismissed and goes to another doctor."],
      ["b", "Acknowledge the pain is real, ask how it affects his life, and explore his worries", "He fears dying like his father. You can now address his fear."],
      ["h", "Order more tests to reassure him", "More tests can reinforce health anxiety."],
    ]),
  ]),
  s("wy-a017", "assessment", "Asking about sex", "dsm-sex-gender", "more-disorders", 2, "US", "Ask about sexual health respectfully", "Rakesh, 30, depressed on an SSRI", [
    b("He seems uncomfortable but mentions problems 'in married life'.", [
      ["b", "“Many people on these medicines have changes in sex drive or orgasm. Has that happened to you?”", "He says yes and was about to stop the tablet. Normalising helps him speak."],
      ["h", "Change the topic to avoid embarrassment", "You miss a side effect that could make him stop treatment."],
      ["o", "Ask his wife to come next time to describe it, since she may be more open about the problem", "It is his private matter; ask him first."],
    ]),
  ]),
  s("wy-a018", "assessment", "Asking about psychotic symptoms", "schizophrenia", "psychosis", 2, "UMS", "Ask about hallucinations gently", "Anu, 19, withdrawn", [
    b("You want to know if she hears voices.", [
      ["h", "“Are you crazy? Do you hear voices?”", "Stigmatising language shuts her down."],
      ["o", "Wait for her to mention voices herself, since asking might put the idea in her head or upset her", "People with psychosis often do not volunteer it."],
      ["b", "“Sometimes when people are stressed they hear things others can't. Has that happened to you?”", "She says she hears a voice calling her names. Normalising questions open up."],
    ]),
  ]),
  s("wy-a019", "assessment", "Assessing an older adult with low mood", "depression", "lifespan", 3, "UMS", "Screen for cognitive and medical issues in late-life depression", "Mr Krishnan, 75", [
    b("He is low and says his memory is poor.", [
      ["o", "Treat as depression only, since low mood often causes poor memory and he will improve with therapy", "You may miss dementia or medical causes."],
      ["b", "Assess mood and cognition, review medicines and ask about physical health", "He is on a beta blocker and has mild cognitive impairment. Both matter."],
      ["h", "Tell him poor memory is normal at his age", "It is not always normal; you miss treatable causes."],
    ]),
  ]),
  s("wy-a020", "assessment", "Using rating scales", "assessment", "assessment", 2, "UMS", "Use a scale to support, not replace, judgement", "PHQ-9 score of 6", [
    b("A student scores 6 on the PHQ-9 but says she thinks about dying daily.", [
      ["b", "Act on the suicidal thoughts and assess her fully, whatever the total", "Item 9 matters more than the total. Scales support clinical judgement."],
      ["h", "Mark her as mild and low risk", "A low total hides a high-risk answer."],
      ["o", "Repeat the scale next week to see if it changes, so the trend can guide what to do next", "The risk is now; waiting a week is too long."],
    ]),
  ]),
  s("wy-a021", "assessment", "Assessing a child for autism", "child", "child", 3, "UMS", "Use several sources in autism assessment", "Aryan, 3", [
    b("He played well in your room for 10 minutes.", [
      ["o", "Rule out autism, since he played well and made eye contact during the short time you saw him", "Ten minutes in a new room is not enough. Some features are clearer at home or with peers."],
      ["h", "Diagnose autism because his parents are worried", "Parent worry is important but not a diagnosis."],
      ["b", "Gather developmental history, parent and teacher reports, and a structured observation", "A fuller picture shows social communication difficulties at preschool."],
    ]),
  ]),
  s("wy-a022", "assessment", "Asking about family history", "interview", "interview-mse", 1, "CUS", "Take a family psychiatric history", "Sunil, 23, with first psychosis", [
    b("You have not asked about family history.", [
      ["b", "“Has anyone in your family had mental illness, suicide, or problems with alcohol or drugs?”", "His uncle had bipolar disorder. This shapes the differential."],
      ["h", "Skip it; it is not his fault", "Family history is not blame; it is information."],
      ["o", "Ask only about his parents' health and leave out wider family, since that is usually what matters most", "Second-degree relatives and suicides also matter."],
    ]),
  ]),
  s("wy-a023", "assessment", "Assessing capacity", "mse", "ethics-law", 4, "UMDS", "Apply the capacity test", "Mrs Thomas, 70, refuses surgery", [
    b("Her family says she lacks capacity because she is refusing.", [
      ["h", "Agree; refusing life-saving surgery shows incapacity", "An unwise decision is not proof of incapacity."],
      ["b", "Check whether she understands, appreciates the consequences and can communicate a choice", "She understands and has clear reasons. She has capacity to refuse."],
      ["o", "Ask the family to decide, since they know her best and she is elderly and frightened", "Capacity is about her ability, not the family's view."],
    ]),
  ]),
  s("wy-a024", "assessment", "Assessing personality", "personality", "personality", 4, "UMS", "Avoid diagnosing personality in a crisis", "Rima, 20, after an overdose", [
    b("The ward team calls her 'borderline' after one day.", [
      ["o", "Agree, since she was angry and tearful on admission and the label will help the team plan her care", "Crisis behaviour does not equal a personality pattern."],
      ["b", "Suggest assessing long-term patterns over time, with collateral, before using the label", "Her history shows a recent trauma, not a lifelong pattern."],
      ["h", "Write 'BPD' in the discharge summary", "A label can follow her for years and change how she is treated."],
    ]),
  ]),
  s("wy-a025", "assessment", "Assessing hallucinations in grief", "depression", "depression", 3, "UMS", "Separate normal grief experiences from psychosis", "Mrs D'Souza, 68", [
    b("She hears her late husband call her name some evenings.", [
      ["b", "Ask how she understands it, whether it distresses her and whether other symptoms are present", "She finds it comforting and has no other symptoms. This is common in grief."],
      ["h", "Refer her urgently for psychosis", "Over-diagnosis causes fear and unnecessary medicine."],
      ["o", "Tell her it is nothing at all and she should not talk about it, so that her family does not worry", "Normal, but she should feel free to talk about it."],
    ]),
  ]),
  s("wy-a026", "assessment", "Asking about appetite and weight", "eating", "more-disorders", 2, "UMS", "Ask about eating in a young woman with low mood", "Kriti, 19", [
    b("She is low and has lost weight.", [
      ["o", "Assume the weight loss is from depression, which commonly reduces appetite, and leave it there", "Possibly, but you have not checked for an eating disorder."],
      ["h", "Tell her she looks good thinner", "Comments on weight can reinforce an eating disorder."],
      ["b", "Ask how she feels about her weight and shape and whether she restricts, binges or purges", "She has been restricting and vomiting. You find a second problem."],
    ]),
  ]),
  s("wy-a027", "assessment", "Assessing ADHD in adults", "child", "child", 3, "UMS", "Confirm childhood onset", "Varun, 29, asking for ADHD medicine", [
    b("He says he can't focus at work and read online that he has ADHD.", [
      ["b", "Ask about childhood symptoms, school reports and a parent's account, as well as mood and substance use", "Childhood history is unclear but he drinks heavily. The picture changes."],
      ["h", "Agree it sounds like ADHD and suggest medicine", "Many conditions cause poor focus; stimulants can be misused."],
      ["o", "Give him an online self-test to complete and use the score to decide whether he has ADHD", "Self-tests help screen but cannot diagnose."],
    ]),
  ]),
  s("wy-a028", "assessment", "Interpreters", "interview", "interview-mse", 3, "US", "Use a trained interpreter", "Mrs Rahman, speaks only Sylheti", [
    b("Her 12-year-old son offers to translate.", [
      ["h", "Accept; he speaks both languages", "Children should not interpret, especially about sensitive topics."],
      ["o", "Use gestures and simple English to manage on your own and avoid delaying her care", "You get only the simplest facts. Without a shared language you will miss mood, risk and anything sensitive."],
      ["b", "Arrange a trained interpreter, by phone if needed", "She discloses domestic violence she would never say in front of her son."],
    ]),
  ]),
  s("wy-a029", "assessment", "Assessing delusions", "schizophrenia", "psychosis", 3, "UMS", "Explore a belief without arguing", "Anil, 34", [
    b("“The government has put a chip in my teeth.”", [
      ["o", "Ask him to see a dentist to prove there is no chip, so he can be reassured with evidence", "Evidence does not shift a delusion and may harm trust."],
      ["b", "Ask how he knows, how sure he is, and how it affects what he does", "He has stopped eating hard food and avoids phones. You understand the impact."],
      ["h", "“That's impossible.”", "He stops talking to you. Flatly contradicting a delusion damages trust and teaches you nothing about its impact."],
    ]),
  ]),
  s("wy-a030", "assessment", "Assessing dementia with family", "dementia", "neurocognitive", 2, "UMS", "Get a timeline from family", "Mr Arora, 74", [
    b("He says his memory is fine.", [
      ["b", "Ask his daughter when changes started, how fast they have progressed and which tasks he now struggles with", "She describes slow decline over three years. The timeline helps diagnosis."],
      ["h", "Accept his account", "People with dementia often lack awareness of their problems."],
      ["o", "Do a memory test only and decide from that score whether he has dementia or not", "Tests help, but history from family is essential."],
    ]),
  ]),
  s("wy-a031", "assessment", "Assessing obsessions", "ocd", "ocd", 2, "UMS", "Ask about hidden obsessions", "Sahil, 21, with depression", [
    b("He looks embarrassed and says he has 'bad thoughts' he can't share.", [
      ["h", "Leave it; he is not ready", "Shame hides OCD. A gentle question helps."],
      ["b", "“Some people have unwanted thoughts that upset them, about harm, sex or religion. Is it like that?”", "He has sexual intrusive thoughts and is relieved to name them."],
      ["o", "Tell him he can write them down and bring them next week if he wants, so he has time to think", "Possible, but naming common themes now reduces shame."],
    ]),
  ]),
  s("wy-a032", "assessment", "Assessing risk factors for violence", "personality", "personality", 3, "UMS", "Ask about past violence", "Monu, 26, angry", [
    b("You are assessing violence risk.", [
      ["o", "Ask only about his current anger and how often he feels it, since the present is what matters now", "Past violence is the strongest predictor."],
      ["h", "Assume no risk because he is polite with you", "Politeness in the room does not show risk outside."],
      ["b", "Ask about past fights, arrests, weapons, alcohol and current threats", "He has a knife conviction and drinks heavily. Risk is higher than it looked."],
    ]),
  ]),
  s("wy-a033", "assessment", "Developmental history", "child", "child", 2, "CUS", "Take a developmental history", "Ritika, 6, with speech delay", [
    b("Her parents are worried about her talking.", [
      ["b", "Ask about pregnancy, birth, milestones, hearing and social play", "She had frequent ear infections. A hearing test is the first step."],
      ["h", "Tell them she will talk when she is ready", "Waiting misses treatable causes."],
      ["o", "Refer her to a speech therapist straight away, since speech is the main complaint and therapy helps", "Useful, but hearing and development need checking first."],
    ]),
  ]),
  s("wy-a034", "assessment", "Assessing negative symptoms", "schizophrenia", "psychosis", 4, "MDS", "Separate negative symptoms from depression and side effects", "Mr Pillai, 40, on haloperidol", [
    b("He sits all day and shows little emotion.", [
      ["o", "Record negative symptoms and move on, since they are common in long-term schizophrenia", "Possibly, but depression and drug side effects can look the same."],
      ["b", "Ask about sadness and guilt, and look for stiffness and slowed movement", "He is stiff with a tremor. Drug-induced parkinsonism is part of the picture."],
      ["h", "Tell the family he is lazy", "The family starts scolding him. Calling symptoms laziness is stigmatising and hides treatable causes."],
    ]),
  ]),
  s("wy-a035", "assessment", "Asking about domestic violence", "interview", "trauma", 3, "UMS", "Ask routinely and privately", "Mrs Khanna, 36, with headaches", [
    b("Her husband is in the waiting room.", [
      ["h", "Ask her about violence when he joins you later", "She cannot speak safely in front of him."],
      ["o", "Do not ask, since she has not raised it and it might offend her or make her feel judged", "Many survivors never raise it unless asked."],
      ["b", "While alone, ask: “Many women have problems at home. Does anyone hurt or frighten you?”", "She discloses abuse. Routine private questions find hidden harm."],
    ]),
  ]),
  s("wy-a036", "assessment", "Assessing catatonia", "schizophrenia", "psychosis", 4, "MDS", "Examine for catatonic signs", "Arjun, 26, mute and still", [
    b("He has not spoken for two days.", [
      ["b", "Check for posturing, rigidity, waxy flexibility and refusal of food, and take vital signs", "He shows waxy flexibility. Catatonia is identified and treated with lorazepam."],
      ["o", "Note 'uncooperative' and try again tomorrow, since he may be tired or upset", "Catatonia can become life-threatening. It needs recognising now."],
      ["h", "Assume he is pretending", "Mislabelling a medical emergency is dangerous."],
    ]),
  ]),
  s("wy-a037", "assessment", "Asking about religious experience", "how-patients-talk", "interview-mse", 3, "UMS", "Separate faith from psychopathology", "Swami-ji, 55, a priest", [
    b("He says God speaks to him during prayer.", [
      ["o", "Record 'auditory hallucinations' and ask about other psychotic symptoms such as delusions of persecution", "In his tradition this may be normal. Ask how others in his faith see it."],
      ["h", "Tell him it must be his imagination", "Dismissive and culturally insensitive."],
      ["b", "Ask how his community sees such experiences and whether anything has changed recently", "It is normal in his practice and nothing has changed. No disorder."],
    ]),
  ]),
  s("wy-a038", "assessment", "Time-limited assessment", "interview", "interview-mse", 3, "US", "Prioritise in a short assessment", "Emergency room, 15 minutes", [
    b("You have 15 minutes with a distressed young man.", [
      ["b", "Cover the main problem, risk, substance use and immediate needs, and plan a fuller review", "You find suicidal thoughts and arrange safety. Prioritise what changes action now."],
      ["h", "Take a full developmental history first", "Important later, but you run out of time before risk."],
      ["o", "Use the time to build rapport only, without asking hard questions, so he trusts you next time", "Rapport matters, but risk must be covered."],
    ]),
  ]),
  s("wy-a039", "assessment", "Assessing memory complaints in a young adult", "dsm-ncd", "neurocognitive", 3, "UMS", "Find the cause of 'memory loss' in a student", "Ishita, 21", [
    b("She says she forgets everything she reads.", [
      ["h", "Order an MRI", "The scan is normal and costly. Sleep, mood and anxiety, the common causes, were never asked about."],
      ["b", "Ask about sleep, mood, anxiety, attention, substances and how she studies", "She sleeps four hours and is anxious. Concentration, not memory, is the issue."],
      ["o", "Tell her it is normal exam stress and give her a study timetable to follow for the next month", "Possibly, but you have not ruled out depression or other causes."],
    ]),
  ]),
  s("wy-a040", "assessment", "Assessing a child's behaviour", "child", "child", 3, "UMS", "Use reports from home and school", "Arnav, 7, 'naughty'", [
    b("His mother says he is impossible at home; the teacher says he is fine at school.", [
      ["o", "Diagnose ADHD from the mother's report, since she sees him most and knows his behaviour best", "ADHD needs symptoms in more than one setting."],
      ["h", "Tell the mother she is too strict", "She becomes defensive and stops sharing. Blaming the parent closes the door to understanding the home."],
      ["b", "Explore what happens at home, including routines and stress, and observe parent and child together", "A new baby and parental conflict explain much of it. Parent support helps."],
    ]),
  ]),
  s("wy-a041", "assessment", "Assessing alcohol use", "substance", "substance", 2, "UMS", "Use a structured screen", "Mr Gill, 45", [
    b("He says he drinks 'socially'.", [
      ["b", "Ask how many drinks on a typical day, how often, and whether he drinks in the morning", "He drinks eight pegs at weekends and some mornings. 'Socially' meant heavy use."],
      ["h", "Accept 'socially' as low risk", "Vague terms hide heavy drinking."],
      ["o", "Ask his wife how much he drinks instead of asking him again, since he may not be honest", "Collateral helps, but ask him first with specific questions."],
    ]),
  ]),
  s("wy-a042", "assessment", "Assessing PTSD", "ptsd", "trauma", 3, "UMS", "Check all symptom groups", "Kunal, 30, after a bomb blast", [
    b("He has nightmares and avoids crowds.", [
      ["o", "Diagnose PTSD from nightmares and avoidance, since these are the main features and enough to start treatment", "You also need to check negative mood and arousal, and duration over a month."],
      ["b", "Ask about intrusive memories, avoidance, mood changes, startle and sleep, and when they started", "All groups are present for two months. PTSD fits."],
      ["h", "Tell him to think positively", "He feels his suffering is brushed aside. Advice before assessment misses the diagnosis and its treatment."],
    ]),
  ]),
  s("wy-a043", "assessment", "Assessment report", "casesheet", "case-sheet", 3, "UMS", "Write a clear summary", "Your report to a referring GP", [
    b("You have assessed a patient with depression.", [
      ["h", "Write two pages of raw notes", "The GP cannot find the key points."],
      ["o", "Write only the diagnosis, since the GP is busy and only needs to know what to call it", "The GP has a label but no idea of risk, severity or what to do next. A report must guide action."],
      ["b", "Summarise the problem, risk, formulation, diagnosis and clear recommendations", "The GP knows what to do next. Clarity helps care."],
    ]),
  ]),
  s("wy-a044", "assessment", "Assessing first-rank symptoms", "schizophrenia", "psychosis", 4, "UMDS", "Ask about passivity experiences", "Deepa, 24", [
    b("She says she feels 'controlled'.", [
      ["b", "Ask whether her thoughts, feelings or movements feel made by someone else", "She feels her arm is moved by an outside force. That is a passivity experience."],
      ["o", "Assume she means pressure from her family, which is a common worry for young women", "Possible, but you have not clarified."],
      ["h", "Note 'feels controlled' and move on", "You miss a first-rank symptom."],
    ]),
  ]),
  s("wy-a045", "assessment", "Assessment in deafness", "interview", "interview-mse", 4, "US", "Assess a deaf patient properly", "Ravi, 28, deaf since birth", [
    b("He uses Indian Sign Language. His mother offers to interpret.", [
      ["o", "Use his mother to interpret, since she knows him well and it saves arranging anyone else", "Family interpreters may filter or change what he says."],
      ["h", "Write questions on paper", "Written English may not be his first language; you will miss nuance."],
      ["b", "Arrange a qualified ISL interpreter", "He describes his mood clearly. Language access is essential to assessment."],
    ]),
  ]),
  s("wy-a046", "assessment", "Assessing substance-induced symptoms", "dsm-substance", "substance", 4, "UMDS", "Use timeline to separate substance-induced symptoms", "Aman, 25, anxious and using cannabis", [
    b("You need to know whether anxiety is caused by cannabis.", [
      ["b", "Ask when anxiety began compared to cannabis, and how it was during any breaks", "Anxiety started before cannabis and persisted when he stopped. Primary anxiety is likely."],
      ["h", "Assume cannabis causes everything", "You may miss a primary disorder."],
      ["o", "Tell him to stop cannabis and come back in a month, then decide what to do", "Sobriety helps, but the timeline already gives clues."],
    ]),
  ]),
  s("wy-a047", "assessment", "Asking about gender identity", "dsm-sex-gender", "more-disorders", 3, "US", "Ask respectfully about identity", "Client, 19, with depression", [
    b("They mention distress about their body and name.", [
      ["h", "Use the name on the file without asking", "They correct you quietly and say little else. Misgendering harms trust and hides what matters to them."],
      ["b", "Ask what name and pronouns they use, and how they feel about their gender", "They are relieved and talk openly. Respect is part of assessment."],
      ["o", "Avoid the topic since it is sensitive and focus on the depression they came for", "Gender distress may be central to the depression."],
    ]),
  ]),
  s("wy-a048", "assessment", "Assessing psychosis in older adults", "dementia", "neurocognitive", 4, "MDS", "Check vision, hearing and cognition", "Mrs Rao, 80, says people enter her room", [
    b("She lives alone and has poor eyesight.", [
      ["o", "Diagnose late-onset schizophrenia, since she is clear and consistent about what she sees", "Possible, but sensory loss and dementia must be checked."],
      ["b", "Check vision, hearing, cognition and medicines, and ask about her daily life", "She has cataracts and early dementia. Treating both helps."],
      ["h", "Tell her family she is imagining things", "He feels his suffering is brushed aside. Advice before assessment misses the diagnosis and its treatment."],
    ]),
  ]),
  s("wy-a049", "assessment", "Assessing anger", "personality", "personality", 3, "US", "Explore anger before labelling", "Sanjay, 35, 'anger problem'", [
    b("His wife says he has an anger problem.", [
      ["b", "Ask about triggers, alcohol, mood, sleep and what happens when he is angry", "He drinks heavily and has had head injuries. The anger has causes."],
      ["h", "Diagnose intermittent explosive disorder", "Too early without exploring causes."],
      ["o", "Give him anger management tips straight away, since he wants practical help to control himself", "May help, but you have not understood the problem."],
    ]),
  ]),
  s("wy-a050", "assessment", "Assessment with poor rapport", "interview", "interview-mse", 3, "US", "Rebuild rapport", "Ritu, 17, silent and angry", [
    b("She refuses to talk.", [
      ["o", "Ask her parents to come in and answer for her, so you can at least get the history", "She folds her arms and says nothing. Talking over a teenager confirms her view that no one listens."],
      ["h", "Tell her you can't help unless she talks", "She shrugs and stares at the floor. Putting the burden on her pushes her further away."],
      ["b", "Acknowledge she did not want to come, and ask what she would want from today", "She says she wants her parents off her back. That is a start."],
    ]),
  ]),
  s("wy-a051", "assessment", "Assessing for medical causes of psychosis", "schizophrenia", "psychosis", 4, "MDS", "Look for red flags of organic psychosis", "Rahul, 22, new psychosis and headache", [
    b("He also has fever and a stiff neck.", [
      ["b", "Refer urgently for medical assessment for infection of the brain", "He has encephalitis. Red flags change the plan."],
      ["o", "Start the usual first-episode psychosis plan, since he is young and psychosis is common at his age", "Fever and a stiff neck are ignored. Brain infection can kill within days and needs urgent medical care."],
      ["h", "Ignore the fever as unrelated", "Fever with psychosis needs urgent attention."],
    ]),
  ]),
  s("wy-a052", "assessment", "Assessing a child's anxiety", "anxiety", "anxiety", 2, "US", "Ask children directly", "Mira, 8, stomach aches", [
    b("Her mother says she worries a lot.", [
      ["h", "Ask only the mother", "You hear the mother's worries but not Mira's. Children often know what frightens them if asked well."],
      ["b", "Use drawings or simple words to ask Mira what worries her", "She draws her parents fighting. Children can tell you with the right tools."],
      ["o", "Give the mother an anxiety questionnaire to complete at home and bring back next week", "Useful, but Mira's voice matters too."],
    ]),
  ]),
  s("wy-a053", "assessment", "Assessing mania safely", "bipolar", "bipolar", 3, "UMS", "Interview an irritable manic patient", "Varun, 30, irritable and loud", [
    b("He interrupts every question and gets angry.", [
      ["o", "Insist on finishing your full list of questions in order, so that nothing important is missed", "He escalates. Flexibility is safer."],
      ["b", "Keep questions short, stay calm, focus on safety and sleep, and finish early if needed", "You get the key facts and he stays calm."],
      ["h", "Argue with his grandiose claims", "He gets louder and walks out. Arguing with grandiose ideas in mania escalates conflict."],
    ]),
  ]),
  s("wy-a054", "assessment", "Assessing dissociative symptoms", "dsm-dissociative", "trauma", 4, "UMS", "Ask about dissociation", "Sneha, 25, losing time", [
    b("She says she 'loses hours' and finds herself in places without knowing how.", [
      ["b", "Ask about memory gaps, identity changes, trauma, seizures and substances", "She has a history of trauma and identity shifts. Seizures are also ruled out."],
      ["h", "Assume she is making it up", "She stops telling you about the gaps. Dismissing dissociation means missing trauma or a seizure disorder."],
      ["o", "Refer only to a neurologist, since losing time must be a brain problem such as epilepsy", "Possible, but dissociation also needs exploring."],
    ]),
  ]),
  s("wy-a055", "assessment", "Assessing protective factors", "suicide", "suicide", 2, "UMS", "Ask about reasons for living", "Ravi, 35, with suicidal thoughts", [
    b("You have assessed risk factors.", [
      ["o", "Finish the session now, since you have covered the risk factors that matter most", "Protective factors help planning."],
      ["b", "Ask what has kept him going, such as people, faith or plans", "He talks about his daughter. You build the plan around her."],
      ["h", "Assume he has none because he is depressed", "You miss his reasons for living. Most people have some, and they are the backbone of a safety plan."],
    ]),
  ]),
  s("wy-a056", "assessment", "Assessing learning disorder", "child", "child", 3, "US", "Rule out other causes before diagnosing a learning disorder", "Arjun, 9, poor reading", [
    b("He reads poorly but speaks well.", [
      ["h", "Tell the parents he is lazy", "The parents feel blamed and the boy feels stupid. Labelling him lazy delays the help he needs."],
      ["o", "Diagnose dyslexia from his school marks, since reading is clearly his weak area", "Vision, hearing, teaching and language must be checked first."],
      ["b", "Check vision and hearing, then arrange standardised reading assessment", "His vision is fine and testing shows dyslexia. Accommodations follow."],
    ]),
  ]),
  s("wy-a057", "assessment", "Assessing the impact on function", "interview", "interview-mse", 2, "US", "Ask about daily function", "Leena, 40, anxious", [
    b("She describes worry.", [
      ["b", "Ask how the worry affects work, family, sleep and daily tasks", "She has stopped driving and missed work. Impairment shapes diagnosis and plan."],
      ["h", "Skip function; symptoms are enough", "Diagnosis usually needs impairment."],
      ["o", "Ask how she spends her free time and what she enjoys, and leave work and home for another day", "Partly useful, but misses key areas."],
    ]),
  ]),
  s("wy-a058", "assessment", "Assessing an intoxicated patient", "substance", "substance", 3, "MDS", "Know when to wait for a full assessment", "Man, 30, drunk in the emergency room", [
    b("He is intoxicated and saying he will kill himself.", [
      ["o", "Discharge him, since people often say things when drunk that they do not mean", "Risk may be real; you cannot dismiss it."],
      ["h", "Do a full psychiatric assessment while he is intoxicated", "Assessment is unreliable while drunk."],
      ["b", "Keep him safe, then reassess risk properly when he is sober", "Sober, he still has suicidal thoughts and a plan. Waiting gave a true picture."],
    ]),
  ]),
  s("wy-a059", "assessment", "Assessing the formulation", "casesheet", "case-sheet", 4, "UMS", "Build a 5P formulation", "Pooja, 26, depressed", [
    b("You need a formulation for your supervisor.", [
      ["b", "Describe presenting, predisposing, precipitating, perpetuating and protective factors", "Your supervisor sees why she is ill now and what to target."],
      ["h", "Write only the diagnosis", "A diagnosis does not explain her story."],
      ["o", "List all her symptoms in detail under a single heading, so the supervisor can see everything", "Symptoms without explanation are not a formulation."],
    ]),
  ]),
  s("wy-a060", "assessment", "Assessing a refugee", "ptsd", "trauma", 4, "US", "Assess with cultural safety", "Ahmad, 30, refugee from Afghanistan", [
    b("He is reluctant to talk about his past.", [
      ["h", "Insist on a full trauma history today", "He shuts down and misses the next appointment. Pushing for trauma details too early can retraumatise."],
      ["b", "Explain confidentiality, use an interpreter, and start with current needs and safety", "He talks about housing and fear of police. Trust builds slowly."],
      ["o", "Use a family member to interpret, since he trusts them and it saves arranging one", "Family may change or filter the account."],
    ]),
  ]),
  s("wy-a061", "assessment", "Separating grief from depression", "depression", "depression", 4, "UMDS", "Use specific features to tell grief and depression apart", "Mr Sharma, 58, wife died four months ago", [
    b("He is sad and cries often.", [
      ["o", "Diagnose depression, since four months of sadness after a death is a long time and he needs treatment", "Grief can last longer; features matter more than time alone."],
      ["b", "Ask whether sadness comes in waves tied to her memory, whether self-worth is intact, and about thoughts of death", "His sadness comes in waves and he enjoys grandchildren. This is grief."],
      ["h", "Tell him he should be over it by now", "He feels judged for grieving. There is no fixed date by which grief should be over."],
    ]),
  ]),
  s("wy-a062", "assessment", "Full assessment in a complex case", "interview", "interview-mse", 5, "UMDS", "Bring several strands together", "Ms Iqbal, 33, referred for 'depression'", [
    b("She is low, drinking more, has bruises and her husband controls her money.", [
      ["h", "Focus only on her depression and refer for medicine", "Medicine is started, but she goes home to the same danger. Abuse and alcohol were both missed."],
      ["o", "Focus on the drinking first, since alcohol makes depression worse and must be treated before anything else", "Partly right, but safety comes first."],
      ["b", "Assess safety first, then mood, alcohol and support, and plan together", "She discloses abuse. Safety planning comes first, then treatment of mood and drinking."],
    ]),
    b("She asks you not to write anything about her husband in her notes.", [
      ["b", "Explain that notes are confidential and that recording risk protects her, and agree how it is written", "She agrees once she understands who can see the notes."],
      ["h", "Agree and leave it out", "Without a record, future clinicians cannot help her stay safe."],
      ["o", "Write it anyway without explaining why, since it is your duty to record what you know", "Accurate, but she feels betrayed. Explaining keeps trust."],
    ], "She is worried he might see the file."),
  ]),
];
