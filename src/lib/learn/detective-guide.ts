/**
 * Clinic detective: the free starting picture and three guided hints for
 * every case (owner, 22 Nov 2026). The picture is a patient you might meet,
 * shown before clue 1, and never names the answer. Hints: 1 the area to
 * think in, 2 the key detail and why, 3 narrow it (may name two or three
 * choices). Hints 1 and 2 never name the answer (detective-deal.test.ts).
 */
export type Guide = { picture: string; hints: [string, string, string] };

export const DETECTIVE_GUIDE: Record<string, Guide> = {
  lithium: {
    picture: "Mr Rao, 52, has had bipolar disorder for 15 years and has been well on one medicine all that time. After a week of diarrhoea in the May heat, he is shaky and unsteady.",
    hints: ["Think of the mood stabilisers, and which one needs regular blood level checks.", "Dehydration and some painkillers raise this medicine's level, and its safe range is narrow.", "Choose between lithium, valproate and lamotrigine: which one is a simple element, checked by blood level?"],
  },
  clozapine: {
    picture: "Sunita, 30, has schizophrenia that did not improve on two different antipsychotics. Her psychiatrist starts a new medicine and books weekly blood tests.",
    hints: ["Think of the antipsychotics, and which one is kept for when others have failed.", "Weekly blood counts are needed at the start because it can lower the white cells that fight infection.", "Choose between clozapine, olanzapine and risperidone."],
  },
  valproate: {
    picture: "Rekha, 24, has bipolar disorder and epilepsy. Her doctor wants to change her medicine because she is planning a pregnancy next year.",
    hints: ["Think of medicines used both for mood and for epilepsy.", "The big worry is the unborn baby: this medicine carries a high risk of birth defects and is avoided in women who could become pregnant.", "Choose between valproate, lamotrigine and carbamazepine."],
  },
  lamotrigine: {
    picture: "Kiran, 35, has bipolar disorder with mostly depressive episodes. His psychiatrist starts a medicine at a very low dose and says it will go up slowly over six weeks.",
    hints: ["Think of the mood stabilisers, and which one is better at preventing lows than highs.", "The slow dose increase is to lower the risk of a serious skin rash.", "Choose between lamotrigine, lithium and valproate."],
  },
  carbamazepine: {
    picture: "Mei, 29, from a family of Chinese descent in Kolkata, is starting a mood stabiliser. Her doctor orders a gene test first and warns that her contraceptive pill may stop working.",
    hints: ["Think of the anticonvulsant mood stabilisers.", "It speeds up the liver's breakdown of other medicines (and itself), which is why the pill can fail.", "Choose between carbamazepine, valproate and lamotrigine."],
  },
  olanzapine: {
    picture: "Vivek, 26, started an antipsychotic three months ago. His voices are quieter, but he is sleepy, always hungry and has gained 9 kg.",
    hints: ["Think of the newer antipsychotics, and which ones cause the most weight gain.", "Strong sedation and a big rise in appetite, weight and blood sugar are its signature.", "Choose between olanzapine, aripiprazole and risperidone."],
  },
  risperidone: {
    picture: "Pooja, 22, is on an antipsychotic for psychosis. Her periods have stopped and she has noticed milk leaking from her breasts.",
    hints: ["Think of the antipsychotics, and which hormone they can raise.", "Stopped periods and breast milk point to a raised prolactin level, a typical side effect of this medicine.", "Choose between risperidone, aripiprazole and olanzapine."],
  },
  aripiprazole: {
    picture: "Aman, 19, switched antipsychotics because of weight gain. On the new one his weight is steady, but he cannot sit still and keeps pacing.",
    hints: ["Think of the newer antipsychotics with low weight gain.", "It partly stimulates dopamine receptors instead of fully blocking them, and restlessness is a common side effect.", "Choose between aripiprazole, olanzapine and haloperidol."],
  },
  haloperidol: {
    picture: "A 20-year-old man is very agitated in casualty and is given an injection. An hour later his neck twists to one side and his eyes roll upwards.",
    hints: ["Think of the older, first-generation antipsychotics.", "Sudden muscle spasms soon after a dose (acute dystonia) are typical of strong dopamine blockers, especially in young men.", "Choose between haloperidol, aripiprazole and olanzapine."],
  },
  fluoxetine: {
    picture: "Neha, 17, has depression. Her psychiatrist chooses an antidepressant taken in the morning and says it stays in the body for weeks after stopping.",
    hints: ["Think of the SSRI antidepressants.", "It and its active breakdown product last a long time, so missing a dose or stopping causes few withdrawal symptoms.", "Choose between fluoxetine, paroxetine and mirtazapine."],
  },
  paroxetine: {
    picture: "Raj, 40, forgot to take his antidepressant on a two-day trip. He felt dizzy, had 'electric shocks' in his head and was very irritable.",
    hints: ["Think of the SSRI antidepressants.", "A short half-life means levels fall fast after a missed dose, giving strong discontinuation symptoms.", "Choose between paroxetine, fluoxetine and mirtazapine."],
  },
  mirtazapine: {
    picture: "Mrs Iyer, 72, is depressed, sleeps badly and has lost her appetite. Her doctor picks an antidepressant to take at bedtime.",
    hints: ["Think of antidepressants that are not SSRIs.", "It is sedating and increases appetite, which helps poor sleep and weight loss, but can cause weight gain.", "Choose between mirtazapine, bupropion and fluoxetine."],
  },
  bupropion: {
    picture: "Harish, 45, has depression, smokes 20 cigarettes a day and stopped his last antidepressant because of sexual side effects.",
    hints: ["Think of antidepressants that work differently from SSRIs.", "It acts on dopamine and noradrenaline, helps quitting smoking, rarely affects sex, and is avoided in people with seizures or eating disorders.", "Choose between bupropion, mirtazapine and paroxetine."],
  },
  methylphenidate: {
    picture: "Dev, 9, has been diagnosed with ADHD. His mother says that on his new tablet he hardly eats lunch, and the doctor checks his pulse and blood pressure.",
    hints: ["Think of medicines for attention problems.", "It is a stimulant: appetite falls, and heart rate and blood pressure need checking.", "Choose between methylphenidate, bupropion and atomoxetine."],
  },
  donepezil: {
    picture: "Mr Natarajan, 74, has Alzheimer's disease. On a new tablet he feels a little sick in the mornings and has vivid dreams, and his pulse is slower.",
    hints: ["Think of medicines used for dementia.", "It boosts acetylcholine by stopping its breakdown, which can slow the heart and upset the stomach.", "Choose between donepezil, memantine and mirtazapine."],
  },
  disulfiram: {
    picture: "Sandeep, 40, wants to stop drinking. His wife gives him a tablet each morning. At a wedding he drank one peg and became red, sick and breathless.",
    hints: ["Think of medicines used in alcohol treatment.", "It blocks the breakdown of a toxic product of alcohol, so drinking causes a very unpleasant reaction.", "Choose between disulfiram, naltrexone and acamprosate."],
  },
  naloxone: {
    picture: "Jaspreet, 25, is found unresponsive in a park. His breathing is very slow and his pupils are pinpoint. The ambulance team gives a nasal spray.",
    hints: ["Think of emergency medicines.", "Pinpoint pupils with slowed breathing point to one drug group; this medicine reverses it within minutes.", "Choose between naloxone, buprenorphine and flumazenil."],
  },
  benzodiazepine: {
    picture: "Mrs Kapoor, 60, has taken a sleeping tablet every night for ten years. When she ran out, she had a fit on the third day.",
    hints: ["Think of the calming and sleeping medicines.", "They work fast but cause dependence; stopping suddenly after long use can cause withdrawal fits, and they are dangerous with alcohol.", "Choose between benzodiazepines, mirtazapine and zolpidem."],
  },
  buprenorphine: {
    picture: "Rohan, 28, has used heroin for four years. At a de-addiction centre he starts a daily tablet placed under the tongue.",
    hints: ["Think of medicines used to treat opioid dependence.", "It only partly stimulates opioid receptors, so its effect levels off: safer in overdose than full opioids.", "Choose between buprenorphine, methadone and naltrexone."],
  },
  thiamine: {
    picture: "Mr Gill, 48, a heavy drinker, is admitted confused and unsteady. Before any glucose drip, the doctor gives an injection.",
    hints: ["Think of vitamins.", "Heavy drinkers are often short of it, and giving glucose first can trigger a brain emergency.", "Choose between thiamine, folic acid and vitamin B12."],
  },
  delirium: {
    picture: "Kamla, 78, was chatting normally yesterday. Today on the ward she drifts off mid-answer, pulls at her drip and sees children in the corner.",
    hints: ["Think of the brain disorders that come on fast.", "Sudden onset, poor attention and a picture that changes through the day usually mean a medical cause.", "Choose between delirium, Alzheimer's disease and Lewy body disease."],
  },
  schizophrenia: {
    picture: "Ravi, 22, left college last year. His parents say he talks to the wall, rarely bathes and shows little emotion.",
    hints: ["Think of the psychotic disorders.", "Total length matters: signs lasting six months or more, often with negative symptoms that affect daily life.", "Choose between schizophrenia, schizophreniform disorder and delusional disorder."],
  },
  bipolar1: {
    picture: "Arjun, 23, had a long low spell two years ago. Now, for ten days, he has slept two hours a night and spent ₹2 lakh on a business idea.",
    hints: ["Think of the mood disorders with high spells.", "One full high (a week or more, or serious trouble) is enough for this diagnosis, even if lows came first.", "Choose between bipolar I, bipolar II and cyclothymia."],
  },
  ocd: {
    picture: "Nidhi, 24, has cracked hands from washing 50 times a day. She hides it from friends and knows it is 'too much'.",
    hints: ["Think of repeated acts done to calm a fear.", "She sees the thoughts as her own and unwanted, and the rituals take more than an hour a day.", "Choose between OCD, obsessive-compulsive personality disorder and generalised anxiety disorder."],
  },
  ptsd: {
    picture: "Sunil, 36, a bus conductor, was in a fatal crash four months ago. He will not board a bus and wakes shouting most nights.",
    hints: ["Think of disorders that follow a frightening event.", "Reliving, avoiding and being on edge for more than a month after the event is the key.", "Choose between PTSD, acute stress disorder and adjustment disorder."],
  },
  anorexia: {
    picture: "Tanya, 16, has lost 9 kg in six months, runs every evening and says her thighs are 'still fat'. Her pulse is 46.",
    hints: ["Think of the eating disorders.", "A significantly low weight with an intense fear of gaining weight is the core.", "Choose between anorexia nervosa, bulimia nervosa and ARFID."],
  },
  panic: {
    picture: "Imran, 31, has been to casualty three times in two months, sure he was dying. Every heart test was normal.",
    hints: ["Think of the anxiety disorders.", "Attacks that come out of the blue, peak in minutes, and leave him worrying about the next one.", "Choose between panic disorder, generalised anxiety disorder and agoraphobia."],
  },
  bpd: {
    picture: "Riya, 21, cut her arm after her boyfriend did not reply for an hour. Her friends say one week she adores you, the next she blocks you.",
    hints: ["Think of the personality disorders.", "Fear of being left, unstable relationships, emptiness and self-harm, going back years.", "Choose between borderline personality disorder, bipolar II and histrionic personality disorder."],
  },
  adhd: {
    picture: "Dev, 8, leaves his seat, blurts out answers and loses his pencil box most weeks. His grandparents and his tuition teacher see the same.",
    hints: ["Think of the disorders of development.", "Several symptoms in more than one setting, starting before age 12.", "Choose between ADHD, oppositional defiant disorder and a specific learning disorder."],
  },
  lewy: {
    picture: "Patrick, 71, is sharp some days and blank on others. He sees small people on the sofa, and a small antipsychotic dose made him very stiff.",
    hints: ["Think of the different dementias.", "Fluctuating thinking, vivid visual hallucinations and severe sensitivity to antipsychotics go together.", "Choose between Lewy body dementia, Alzheimer's disease and delirium."],
  },
  wernicke: {
    picture: "Ian, 58, a heavy drinker, is brought in confused, walking unsteadily, and his eyes do not move together.",
    hints: ["Think of brain emergencies linked to alcohol.", "Confusion, unsteady walking and eye movement problems point to a shortage of one vitamin.", "Choose between Wernicke's encephalopathy, Korsakoff's syndrome and alcohol withdrawal."],
  },
  dhat: {
    picture: "Rahul, 20, a college student in Bihar, says he feels weak and tired and cannot concentrate. He is very worried about 'losing his strength' in his urine.",
    hints: ["Think of conditions described in South Asian cultures.", "The core is worry about losing semen, often with anxiety or low mood.", "Choose between dhat syndrome, depression and illness anxiety disorder."],
  },
};
