import type { Scenario } from "../scenarios";
import { b, s } from "./make";

/** Child and family: children, adolescents, parents, carers and family systems. */
export const CHILD_FAMILY: Scenario[] = [
  s("wy-f001", "child-family", "Parent with a toddler's tantrums", "child", "child", 1, "CUS", "Coach consistent responses to tantrums", "Mother of a 3-year-old", [
    b("“He screams on the floor in the shop until I buy the toy.”", [
      ["h", "Tell her to smack him so he learns", "The tantrums get louder and he learns that big people hit. Physical punishment worsens behaviour over time."],
      ["b", "Coach her to stay calm, not give in, and praise him when he settles", "Within weeks the tantrums shorten. Consistent responses and praise for calm behaviour teach him what works."],
      ["o", "Tell her to buy the toy to avoid embarrassment, and deal with it at home later", "The shop is quiet today, but he has learned that screaming gets toys. The tantrums become more frequent."],
    ]),
  ]),
  s("wy-f002", "child-family", "Bedwetting", "child", "child", 1, "CUS", "Reassure and plan for enuresis", "Father of a 7-year-old who wets the bed", [
    b("“He does it to annoy us. We've started shouting at him.”", [
      ["o", "Tell him to stop all drinks after lunch and wake the boy every two hours at night", "He becomes thirsty and exhausted, and still wets. Severe fluid limits and broken sleep do not fix enuresis."],
      ["b", "Explain it is not deliberate and suggest an alarm", "The boy is dry within months. Shame makes it worse; alarms and calm support work."],
      ["h", "Agree he is doing it on purpose", "The shouting continues and the boy hides wet sheets. Blaming the child adds shame and does not stop bedwetting."],
    ]),
  ]),
  s("wy-f003", "child-family", "Screen time", "child", "child", 2, "US", "Set family screen limits together", "Parents of a 12-year-old gaming late at night", [
    b("They want to throw the phone away.", [
      ["b", "Help the family agree clear screen rules together", "Sleep improves and arguments fall. Shared rules work better than sudden bans."],
      ["h", "Tell them to smash the phone in front of him", "He feels humiliated and finds another device. Dramatic punishments damage trust without teaching control."],
      ["o", "Tell them gaming is harmless and they should let him play as long as he wants", "He sleeps at 2am and his grades drop. Unlimited late gaming harms sleep and school."],
    ]),
  ]),
  s("wy-f004", "child-family", "Sibling rivalry after a new baby", "child", "child", 1, "CUS", "Support an older sibling after a new baby", "Mother of a 4-year-old with a new baby", [
    b("“She has started talking like a baby and wetting again.”", [
      ["o", "Tell her to scold the girl for acting like a baby so she grows up faster", "The girl regresses more. Scolding increases her worry about losing her place."],
      ["h", "Suggest sending the girl to her grandmother's for a few months", "She feels pushed out for the baby. Separation deepens jealousy and distress."],
      ["b", "Suggest daily one-to-one time with her", "The regression fades in weeks. Feeling special again reduces jealousy."],
    ]),
  ]),
  s("wy-f005", "child-family", "Adolescent depression and parents", "child", "child", 2, "UMS", "Involve parents while respecting the teen", "Parents of a depressed 16-year-old", [
    b("They want to know everything she says in sessions.", [
      ["h", "Agree to share all session content with them", "She stops talking in sessions. Teens need some privacy to open up."],
      ["b", "Explain what stays private and what you would share", "Parents feel included and she keeps talking. Clear limits protect both trust and safety."],
      ["o", "Refuse to tell them anything at all, even about risk, since she is the client", "If risk rises, they would not know. Parents of minors need safety information."],
    ]),
  ]),
  s("wy-f006", "child-family", "Exam pressure from parents", "child", "child", 2, "US", "Help parents lower harmful pressure", "Father of a Class 10 student in Kota", [
    b("“If he does not get 95 per cent, he has no future.”", [
      ["b", "Explore his fears and agree realistic goals", "The father eases off and the boy's sleep improves. Understanding the parent's fear opens change."],
      ["o", "Agree that marks are everything in India and help the boy make a stricter timetable", "The boy's anxiety rises and he starts skipping meals. Extra pressure worsens performance and wellbeing."],
      ["h", "Tell the father he is a bad parent", "He becomes defensive and stops the sessions. Blame closes the door."],
    ]),
  ]),
  s("wy-f007", "child-family", "Disclosure of abuse by a child", "child", "child", 3, "UMS", "Respond well to a child's disclosure", "Girl, 9, in a school counselling room", [
    b("“Mama's friend touches me when she goes to work. Don't tell.”", [
      ["o", "Ask her many detailed questions to be sure it really happened before you do anything", "Repeated detailed questioning can upset her and harm the later legal process. Let trained investigators do that."],
      ["b", "Stay calm, believe her, and report under POCSO", "She is protected and the man is investigated. Calm belief and prompt reporting are the core response."],
      ["h", "Promise not to tell anyone", "You cannot keep that promise. POCSO makes reporting mandatory, and secrecy leaves her in danger."],
    ]),
  ]),
  s("wy-f008", "child-family", "Parents separating", "child", "child", 2, "US", "Help parents protect children during separation", "Couple separating, two children aged 6 and 10", [
    b("They each want the children to take their side.", [
      ["h", "Help each parent explain to the children why the other is to blame", "The children feel torn and become anxious. Being made to take sides harms children deeply."],
      ["o", "Tell them to hide the separation from the children until everything is final", "The children sense tension and imagine worse. Silence adds confusion."],
      ["b", "Help them tell the children together that it is not their fault", "The children cope better. A shared, calm message protects them."],
    ]),
  ]),
  s("wy-f009", "child-family", "School refusal", "child", "child", 3, "UMS", "Plan a gradual return to school", "Boy, 11, out of school for a month", [
    b("He gets stomach aches every morning.", [
      ["b", "Rule out illness, find the cause, and plan a gradual return with the school", "He returns within weeks. Gradual return with support beats long absence."],
      ["h", "Let him stay home until he wants to go", "The longer he stays home, the harder return becomes. Avoidance feeds anxiety."],
      ["o", "Tell his parents to drag him to school however upset he is, starting tomorrow", "He panics and runs home. Force without a plan can worsen school refusal."],
    ]),
  ]),
  s("wy-f010", "child-family", "Child with autism at home", "child", "child", 2, "US", "Support parents of an autistic child", "Parents of a 5-year-old with autism", [
    b("“He has meltdowns whenever we change his routine.”", [
      ["o", "Tell them to change his routine more often so he gets used to it quickly", "Meltdowns increase. Sudden changes overwhelm autistic children."],
      ["b", "Suggest visual schedules, warnings before changes, and calm spaces", "Meltdowns reduce. Predictability helps autistic children cope."],
      ["h", "Tell them he is spoilt", "They feel blamed and he gets no support. Autism is not spoiling."],
    ]),
  ]),
  s("wy-f011", "child-family", "Teen and substance use", "substance", "substance", 3, "UMS", "Engage a teen and parents about cannabis", "Parents found cannabis in their son's bag", [
    b("They want you to scare him off drugs.", [
      ["h", "Show him frightening videos and tell him he will become an addict", "He laughs it off and hides use better. Scare tactics rarely work with teens."],
      ["b", "Talk with him openly about his use and reasons, and help parents set clear limits", "He cuts down and talks more with his parents. Honest talk works better than fear."],
      ["o", "Tell the parents that experimenting is normal and they should ignore it completely", "His use increases unnoticed. Some guidance and limits are needed."],
    ]),
  ]),
  s("wy-f012", "child-family", "Grandparent carer", "child", "child", 2, "US", "Support grandparents raising children", "Grandmother, 65, raising two grandchildren", [
    b("She is exhausted and her knees hurt.", [
      ["b", "Ask about her health and support, and link her with local help", "She gets help with school runs and sees a doctor. Carers need care too."],
      ["o", "Tell her she is doing a wonderful job and should keep going as she is", "She feels praised but still exhausted. Encouragement without help does not lighten the load."],
      ["h", "Tell her children are not her responsibility", "She feels judged and has no other option. Unhelpful."],
    ]),
  ]),
  s("wy-f013", "child-family", "Joint family conflict", "therapies", "therapies", 3, "US", "Work with joint family conflict", "Young couple living with in-laws", [
    b("The wife says her mother-in-law controls everything.", [
      ["o", "Advise the couple to move out at once, whatever the family says", "Moving may not be possible and can cause a rift. Explore options first."],
      ["h", "Tell her to obey her mother-in-law to keep peace", "Her distress grows. Silencing her is not help."],
      ["b", "Help the couple speak as a team", "The husband supports her in small decisions. Couple unity eases family conflict."],
    ]),
  ]),
  s("wy-f014", "child-family", "Child grief", "child", "child", 2, "US", "Help children grieve", "Boy, 8, whose mother died", [
    b("His father asks if the boy should attend the funeral.", [
      ["b", "Explain what will happen and let the boy choose, with an adult beside him", "He attends with his uncle and later says he is glad he went. Choice and support help children grieve."],
      ["h", "Tell the father to send him away so he does not see sadness", "He feels excluded and confused. Children need to be part of family grief."],
      ["o", "Tell him to make the boy attend whether he wants to or not, since it is his duty", "He is frightened and overwhelmed. Forcing attendance can be distressing."],
    ]),
  ]),
  s("wy-f015", "child-family", "Parenting a child with ADHD", "child", "child", 2, "US", "Teach behavioural strategies", "Parents of a 7-year-old with ADHD", [
    b("They shout all day and nothing works.", [
      ["o", "Tell them to be stricter and remove all his toys until he behaves", "His behaviour worsens. Harsh punishment alone does not help ADHD."],
      ["b", "Teach praise, routines and clear instructions", "Home becomes calmer. Parent training is effective in ADHD."],
      ["h", "Tell them ADHD is an excuse", "They lose hope and he gets no help. ADHD is real."],
    ]),
  ]),
  s("wy-f016", "child-family", "Teen self-harm and parents", "suicide", "suicide", 3, "UMS", "Guide parents after a teen's self-harm", "Parents of a 15-year-old who cut herself", [
    b("They are angry and frightened.", [
      ["h", "Tell them to punish her so she stops", "She hides future self-harm. Punishment increases shame and risk."],
      ["b", "Help them stay calm and secure medicines", "She feels safer telling them. Calm support lowers risk."],
      ["o", "Tell them to watch her every moment and take away her bedroom door", "She feels trapped and resentful. Too much control increases conflict."],
    ]),
  ]),
  s("wy-f017", "child-family", "Child with anxiety", "anxiety", "anxiety", 2, "US", "Coach parents not to accommodate anxiety", "Mother of an anxious 9-year-old", [
    b("She does everything for him so he will not panic.", [
      ["b", "Plan small steps of independence with her", "He gains confidence. Reducing accommodation helps anxiety."],
      ["o", "Tell her to keep protecting him until he grows out of it naturally", "His anxiety grows. Over-protection maintains fear."],
      ["h", "Tell her she is making him weak", "She feels blamed and stops coming. Coaching works better than blame."],
    ]),
  ]),
  s("wy-f018", "child-family", "Eating disorder in a family", "eating", "more-disorders", 3, "UMS", "Support parents in family-based treatment", "Parents of a 14-year-old with anorexia", [
    b("“She cries at every meal. We give up and let her eat what she wants.”", [
      ["o", "Tell them to keep letting her choose so meals are calmer", "Her weight drops further. The illness drives her choices."],
      ["h", "Tell them to force-feed her", "Force harms trust and can be dangerous. Firm support is not force."],
      ["b", "Coach them to be calm and firm at meals", "She eats more and gains weight. Family-based treatment works best in teens."],
    ]),
  ]),
  s("wy-f019", "child-family", "Caring for a parent with dementia", "dementia", "neurocognitive", 2, "US", "Support family carers", "Son, 45, caring for his father with dementia", [
    b("He feels guilty for losing his temper.", [
      ["b", "Normalise the strain and plan respite", "He feels less alone and more patient. Carer support helps both."],
      ["o", "Tell him to try harder and never lose his temper again", "He feels more guilty. Without support, strain continues."],
      ["h", "Tell him he is a bad son", "He stops asking for help. Blame helps no one."],
    ]),
  ]),
  s("wy-f020", "child-family", "Family and psychosis", "schizophrenia", "psychosis", 3, "UMS", "Reduce criticism at home", "Family of a young man with schizophrenia", [
    b("They call him lazy and shout at him.", [
      ["h", "Agree he needs to be pushed", "Criticism raises his stress and relapse risk."],
      ["o", "Tell them to leave him alone completely and not talk to him", "He becomes isolated. Distance is not the same as calm support."],
      ["b", "Explain his symptoms and teach calm talk", "Home becomes calmer and he stays well. Lower expressed emotion reduces relapse."],
    ]),
  ]),
  s("wy-f021", "child-family", "Child in a violent home", "child", "child", 3, "UMS", "Protect a child exposed to domestic violence", "Boy, 10, nightmares after fights at home", [
    b("His mother says the father hits her.", [
      ["o", "Focus therapy on the boy's nightmares only", "The violence continues and the nightmares return. The cause is at home."],
      ["b", "Assess safety for both and link protection", "The mother gets a protection order. Safety comes before therapy."],
      ["h", "Tell the mother to stay for the child's sake", "The child stays exposed to violence. Witnessing abuse harms children."],
    ]),
  ]),
  s("wy-f022", "child-family", "Teen with gender questions", "dsm-sex-gender", "child", 3, "US", "Support a questioning teen and family", "Teen, 15, asks to be called by a new name", [
    b("Parents are upset and want you to 'fix' it.", [
      ["h", "Agree to try to change the teen's identity", "Conversion efforts are harmful and banned as professional misconduct."],
      ["b", "Support the teen and help the parents", "The family begins to talk. Acceptance protects mental health."],
      ["o", "Tell the parents it is a phase and they should ignore it until it passes", "The teen feels unseen and becomes depressed. Dismissal harms."],
    ]),
  ]),
  s("wy-f023", "child-family", "Parental depression", "depression", "depression", 2, "US", "Notice the impact of a parent's depression", "Mother, 32, depressed, with two young children", [
    b("She says the children are 'fine'.", [
      ["b", "Ask gently about the children's care too", "Her sister helps with school runs while she recovers."],
      ["o", "Focus only on her mood and leave the children to the school to notice", "The children's needs are missed. Parents' illness affects children."],
      ["h", "Tell her she is failing her children", "She feels ashamed and stops coming. Shame worsens depression."],
    ]),
  ]),
  s("wy-f024", "child-family", "Infant sleep and parental stress", "child", "lifespan", 1, "CUS", "Support exhausted new parents", "New parents, baby not sleeping", [
    b("They are arguing from exhaustion.", [
      ["o", "Tell them babies always sleep badly and they just have to cope", "They feel unheard and keep arguing. Support helps even if the baby still wakes."],
      ["b", "Help them share night duties and get help so each can sleep", "They feel less exhausted. Practical sharing reduces strain."],
      ["h", "Suggest giving the baby a sleeping medicine", "The baby becomes floppy and hard to wake. Sleeping medicines are unsafe for infants."],
    ]),
  ]),
  s("wy-f025", "child-family", "Bullied child", "child", "child", 2, "US", "Support a bullied child", "Girl, 11, bullied about her skin colour", [
    b("She wants to stop going to school.", [
      ["h", "Tell her to ignore it", "The bullying continues and she feels unprotected."],
      ["b", "Affirm her and work with the school", "The school acts and she feels supported."],
      ["o", "Tell her parents to move her to another school as soon as possible", "Moving may not stop bullying and disrupts her. The school should act first."],
    ]),
  ]),
  s("wy-f026", "child-family", "Adolescent romance and parents", "child", "child", 2, "US", "Mediate parent and teen conflict", "Parents found their daughter's boyfriend's messages", [
    b("They have taken her phone and locked her in.", [
      ["b", "Help them talk with her and agree fair rules", "She talks openly about the relationship. Talking works better than locking up."],
      ["o", "Tell them to keep her locked in until she promises to end it", "She becomes secretive and runs away. Extreme control backfires."],
      ["h", "Tell her to hide future messages better", "She hides more and is less safe online. Teaching secrecy undermines safety and trust."],
    ]),
  ]),
  s("wy-f027", "child-family", "Father's alcohol use and children", "substance", "substance", 3, "US", "Help children affected by a parent's drinking", "Girl, 13, father drinks heavily", [
    b("She says she feels responsible for his drinking.", [
      ["o", "Tell her to pour away his bottles so he cannot drink", "He becomes angry with her. Children should not manage a parent's drinking."],
      ["h", "Tell her it is her job to help him", "She tries to control his drinking and feels a failure. Making a child responsible adds a heavy burden."],
      ["b", "Tell her it is not her fault and check safety", "She feels relieved and supported."],
    ]),
  ]),
  s("wy-f028", "child-family", "Toddler speech delay and family stress", "child", "child", 1, "CUS", "Encourage early assessment", "Parents of a 2-year-old with few words", [
    b("Grandparents say boys talk late.", [
      ["h", "Agree and wait another year", "If there is a problem, a year of help is lost."],
      ["b", "Suggest a hearing test and developmental assessment now", "His hearing is poor. Early grommets help speech."],
      ["o", "Tell the parents to speak to him more and see in six months", "Helpful, but assessment should not wait."],
    ]),
  ]),
  s("wy-f029", "child-family", "Child with chronic illness", "child", "child", 3, "US", "Support a child with diabetes", "Boy, 10, with type 1 diabetes, refusing injections", [
    b("He says he hates being different.", [
      ["b", "Give him some control and peer support", "He feels less alone and manages injections."],
      ["o", "Tell him he must do it or he will die, so he takes it seriously", "He feels frightened and resentful. Fear rarely builds self-care."],
      ["h", "Let him skip injections", "His sugar climbs and he is admitted with ketoacidosis. Skipping insulin is dangerous."],
    ]),
  ]),
  s("wy-f030", "child-family", "Family after a child's suicide attempt", "suicide", "suicide", 4, "UMS", "Support the whole family after an attempt", "Family after their 17-year-old's overdose", [
    b("The younger brother is now very quiet.", [
      ["o", "Focus only on the 17-year-old, since she is the one at risk", "The brother's distress is missed. Siblings are affected too."],
      ["b", "Check in with the brother too", "He was frightened and blamed himself. Family support helps all."],
      ["h", "Tell the parents to keep it secret from him", "He already knows something happened and feels shut out."],
    ]),
  ]),
  s("wy-f031", "child-family", "Parental mental illness and children", "schizophrenia", "psychosis", 4, "UMS", "Plan for children when a parent is ill", "Mother, 35, admitted with psychosis", [
    b("Her children are with neighbours.", [
      ["h", "Leave it to the neighbours", "The children may not be safe or cared for."],
      ["b", "Check who is caring for the children", "Their aunt takes them and they visit their mother."],
      ["o", "Tell the mother not to worry about her children and focus on getting better", "She worries more. Knowing they are safe helps her recover."],
    ]),
  ]),
  s("wy-f032", "child-family", "Teen and online gaming", "child", "child", 3, "US", "Address gaming disorder with family", "Boy, 15, gaming 10 hours a day", [
    b("He becomes violent when the Wi-Fi is cut.", [
      ["b", "Plan gradual limits with the family", "He reduces gaming and joins a football club."],
      ["o", "Tell the parents to cut the Wi-Fi permanently from today", "He becomes more violent. Sudden removal without a plan escalates conflict."],
      ["h", "Tell the parents gaming is harmless", "He keeps gaming all night and fails his exams. Calling it harmless ignores real harm."],
    ]),
  ]),
  s("wy-f033", "child-family", "Child after a parent's death by suicide", "suicide", "suicide", 4, "UMS", "Tell a child about a suicide", "Widow asks how to tell her 10-year-old", [
    b("Her husband died by suicide.", [
      ["o", "Tell her to say it was a heart attack to protect him", "He may learn the truth later and feel betrayed."],
      ["b", "Help her explain honestly and simply", "He asks questions and feels safe with her."],
      ["h", "Tell her never to talk about it", "He feels alone with confusing feelings."],
    ]),
  ]),
  s("wy-f034", "child-family", "Infant attachment", "child", "lifespan", 3, "US", "Support attachment in a depressed mother", "Mother, 25, postpartum depression", [
    b("She says she does not feel close to her baby.", [
      ["h", "Tell her she is a bad mother", "She feels worse and withdraws."],
      ["b", "Treat her depression and support bonding", "Bonding grows as her mood improves."],
      ["o", "Tell her it will come naturally and there is nothing to do but wait", "Weeks pass and both she and the baby struggle. Waiting may delay treatment of her depression."],
    ]),
  ]),
  s("wy-f035", "child-family", "Teen pregnancy", "child", "ethics-law", 4, "UMS", "Respond to an adolescent pregnancy", "Girl, 16, pregnant by her boyfriend", [
    b("She begs you not to tell anyone.", [
      ["b", "Support her and explain the POCSO duty to report", "She is supported medically and emotionally. The law protects minors."],
      ["o", "Keep it secret and help her find a clinic quietly on her own", "You break the law and she lacks support."],
      ["h", "Tell her parents to punish her", "She feels shamed, hides the pregnancy and avoids care. Punishment makes her unsafe."],
    ]),
  ]),
  s("wy-f036", "child-family", "Parent with intellectual disability", "child", "child", 4, "US", "Support a parent with intellectual disability", "Mother, 24, mild intellectual disability, new baby", [
    b("Relatives want to take the baby away.", [
      ["o", "Agree the baby should go to relatives since she cannot cope", "Many parents with intellectual disability parent well with support."],
      ["b", "Assess her strengths and arrange support", "She learns safe baby care with help."],
      ["h", "Ignore the concerns", "If there are risks, the baby may not be safe."],
    ]),
  ]),
  s("wy-f037", "child-family", "Adolescent anger at home", "child", "child", 2, "US", "Help a family with an angry teen", "Boy, 14, punches walls at home", [
    b("Parents say he was fine until a year ago.", [
      ["b", "Explore what changed a year ago, such as bullying, mood or substance use", "He was being bullied online. The anger made sense."],
      ["h", "Diagnose conduct disorder", "Too early; causes are not explored."],
      ["o", "Teach him anger management only, without asking about the rest of his life", "May help, but misses the cause."],
    ]),
  ]),
  s("wy-f038", "child-family", "Family meal conflicts", "eating", "more-disorders", 2, "US", "Recognise picky eating versus a disorder", "Mother of a 5-year-old picky eater", [
    b("He eats only a few foods but is growing well.", [
      ["o", "Tell her to force him to eat everything on the plate", "Meals become battles. Pressure worsens picky eating."],
      ["b", "Reassure her and keep offering foods calmly", "He slowly accepts new foods and meals are calmer. Calm repeated offers work better than pressure."],
      ["h", "Diagnose an eating disorder", "He is growing well; this is common picky eating."],
    ]),
  ]),
  s("wy-f039", "child-family", "Child with tics and family stress", "child", "child", 2, "US", "Reduce family attention to tics", "Parents of a 9-year-old with tics", [
    b("They keep telling him to stop.", [
      ["h", "Agree he should try harder", "His tics increase with stress."],
      ["b", "Explain tics are not deliberate", "His tics settle once the attention stops. Tics are not deliberate and worsen under pressure."],
      ["o", "Tell them to punish him each time he tics, so he learns to stop", "Punishment increases tics and shame."],
    ]),
  ]),
  s("wy-f040", "child-family", "Separation anxiety in a toddler at daycare", "anxiety", "child", 1, "CUS", "Normalise separation distress", "Mother of a 2-year-old starting daycare", [
    b("He cries every morning.", [
      ["b", "Suggest a short goodbye routine", "He stops crying within weeks and settles at daycare. Short, warm goodbyes help toddlers adjust."],
      ["o", "Tell her to stay all day at daycare until he stops crying", "He becomes more dependent and cries harder when she leaves. Staying all day delays adjustment."],
      ["h", "Tell her to sneak away without saying goodbye", "He becomes more anxious and mistrustful."],
    ]),
  ]),
  s("wy-f041", "child-family", "Teen and sexting", "child", "child", 3, "UMS", "Handle a sexting incident", "Girl, 14, her photo shared by a classmate", [
    b("Her parents blame her.", [
      ["o", "Tell the parents to take her phone forever and move on", "The harm continues and she feels blamed. Reporting is needed."],
      ["h", "Agree with the parents", "She feels ashamed and at risk."],
      ["b", "Support her and report it under POCSO", "The image is removed and she feels protected."],
    ]),
  ]),
  s("wy-f042", "child-family", "Father wants a son to stop crying", "child", "child", 2, "US", "Challenge harmful gender norms gently", "Father of a 6-year-old boy", [
    b("“Boys don't cry. He must toughen up.”", [
      ["b", "Explain that all children need to cry", "The father tries and the boy calms faster."],
      ["h", "Agree boys should not cry", "The boy learns to hide feelings."],
      ["o", "Tell the father he is wrong and old-fashioned", "He becomes defensive. Explaining works better than judging."],
    ]),
  ]),
  s("wy-f043", "child-family", "Autism and siblings", "child", "child", 3, "US", "Support a sibling of an autistic child", "Girl, 9, whose brother has autism", [
    b("She says her parents never have time for her.", [
      ["o", "Tell her she should understand her brother needs more", "She feels unheard and resentful."],
      ["b", "Help parents plan regular one-to-one time with her", "She feels valued and less resentful. Regular one-to-one time shows she matters too."],
      ["h", "Ignore it", "Her distress grows and shows up at school. Ignoring a sibling's needs harms her."],
    ]),
  ]),
  s("wy-f044", "child-family", "Child marriage", "child", "ethics-law", 4, "UMS", "Respond to a planned child marriage", "Girl, 15, says her parents have fixed her marriage", [
    b("She wants to continue school.", [
      ["h", "Respect the family's tradition", "Child marriage is illegal and harmful."],
      ["b", "Contact Childline 1098 to stop it", "The marriage is stopped and she stays in school."],
      ["o", "Tell her to talk to her parents and try to change their minds herself", "She may not be able to stop it alone."],
    ]),
  ]),
  s("wy-f045", "child-family", "Parents with infertility conflict", "therapies", "therapies", 3, "US", "Help a couple in infertility stress", "Couple blaming each other after infertility", [
    b("The husband's family blames the wife.", [
      ["b", "Support both and give accurate facts", "They support each other against the pressure. Accurate information reduces blame."],
      ["o", "Tell the wife to accept the family's views to avoid conflict", "She feels more isolated and her mood falls. Accepting blame to avoid conflict harms her."],
      ["h", "Agree it is her fault", "She feels crushed by a false blame. Infertility can come from either partner or both."],
    ]),
  ]),
  s("wy-f046", "child-family", "Teen and academic failure", "child", "child", 2, "US", "Support a teen after failure", "Boy, 17, failed his entrance exam", [
    b("His parents keep comparing him to his cousin.", [
      ["o", "Tell the parents to push him harder for the next attempt", "His mood worsens and he withdraws."],
      ["b", "Help parents focus on his wellbeing", "He feels supported and plans next steps."],
      ["h", "Agree he should be ashamed", "He withdraws and thinks of ending his life. Shame after failure raises suicide risk."],
    ]),
  ]),
  s("wy-f047", "child-family", "Child in foster care", "child", "child", 4, "US", "Support attachment in foster care", "Boy, 6, in a new foster home", [
    b("He hoards food and does not trust adults.", [
      ["h", "Punish him for hoarding", "He hides more food and trusts adults less. Punishing hoarding deepens mistrust."],
      ["b", "Keep food available and build trust", "He hoards less as he feels safe."],
      ["o", "Lock the kitchen so he cannot take food", "He becomes more anxious about food. Locking the kitchen increases his insecurity."],
    ]),
  ]),
  s("wy-f048", "child-family", "Grandparent and parent disagreement", "child", "child", 2, "US", "Help families agree on parenting", "Grandmother undermines the mother's rules", [
    b("The child plays one against the other.", [
      ["b", "Help the adults agree on a few shared rules", "The child's behaviour improves."],
      ["o", "Tell the mother to move out of the joint family", "The mother feels you have not understood their life. Moving out is not practical for many families."],
      ["h", "Take the grandmother's side", "The mother feels undermined and gives up. Taking sides deepens the split."],
    ]),
  ]),
  s("wy-f049", "child-family", "Adolescent sleep", "child", "child", 1, "CUS", "Explain adolescent sleep changes", "Parents of a teen who sleeps late", [
    b("They call him lazy.", [
      ["o", "Tell them to wake him at 5am every day", "He becomes exhausted and irritable. Very early waking fights his body clock."],
      ["b", "Explain teen body clocks and agree times", "He sleeps better and is less tired in class. Teen body clocks shift later."],
      ["h", "Agree he is lazy", "The conflict continues and he feels misjudged. Calling it laziness ignores biology."],
    ]),
  ]),
  s("wy-f050", "child-family", "Child with OCD and family", "ocd", "ocd", 3, "US", "Reduce family accommodation in OCD", "Parents of a 10-year-old with OCD", [
    b("They answer his questions 50 times a day.", [
      ["b", "Plan to reduce reassurance slowly", "His OCD eases as reassurance is reduced step by step. Planned reduction weakens the cycle."],
      ["h", "Tell them to keep reassuring", "His questions increase. Reassurance feeds OCD."],
      ["o", "Tell them to ignore him completely", "He feels abandoned. Planned reduction works better."],
    ]),
  ]),
  s("wy-f051", "child-family", "Mother with postpartum OCD", "ocd", "lifespan", 4, "MDS", "Support a mother and family", "Mother, 28, with intrusive thoughts of harming her baby", [
    b("Her husband wants the baby taken away.", [
      ["o", "Agree the baby should be kept away from her", "She feels more ashamed. OCD thoughts are rarely acted on."],
      ["b", "Explain perinatal OCD and plan treatment", "She is treated and bonds with her baby."],
      ["h", "Tell her to stop thinking such thoughts", "Impossible; OCD does not work like that."],
    ]),
  ]),
  s("wy-f052", "child-family", "Child with learning disability and family", "child", "child", 2, "US", "Support parents of a child with dyslexia", "Parents disappointed by their child's dyslexia", [
    b("They think he will never succeed.", [
      ["h", "Agree his future is limited", "They lose hope and stop seeking help. It is untrue; many people with dyslexia do well."],
      ["b", "Explain dyslexia and accommodations", "They feel hopeful and ask the school for support. Knowing strengths and accommodations helps."],
      ["o", "Tell them he must work harder to overcome it", "Effort alone does not fix dyslexia."],
    ]),
  ]),
  s("wy-f053", "child-family", "Teen and coming out", "child", "child", 3, "US", "Support a teen and family after coming out", "Girl, 16, came out as lesbian", [
    b("Her parents are distressed.", [
      ["b", "Support her and help her parents", "The family moves toward acceptance."],
      ["o", "Tell her to keep it secret from her parents to avoid trouble", "She feels alone and afraid. Secrecy without support harms teens."],
      ["h", "Suggest therapy to change her orientation", "She feels rejected and her mood falls. Conversion efforts are harmful and banned as misconduct."],
    ]),
  ]),
  s("wy-f054", "child-family", "Father with depression and son", "depression", "depression", 3, "US", "Help a father explain his illness", "Father, 40, depressed, worried about his son", [
    b("His son, 12, asks why he stays in bed.", [
      ["o", "Tell him to say he is just tired", "The boy senses something more and worries."],
      ["b", "Help him explain simply that he is ill", "The boy is relieved and less worried."],
      ["h", "Tell him to hide it", "The boy imagines worse and worries more. Hiding illness from children often backfires."],
    ]),
  ]),
  s("wy-f055", "child-family", "Family and medicine adherence", "bipolar", "bipolar", 3, "US", "Involve family in adherence", "Wife of a man with bipolar disorder", [
    b("She asks how to help him take his medicine.", [
      ["b", "Suggest gentle reminders and routines", "He takes medicine regularly and stays well. Gentle support beats pressure."],
      ["o", "Tell her to hide medicine in his food", "He finds out and refuses all medicine. Hidden medicine breaks trust."],
      ["h", "Tell her it is not her business", "She stops helping and he relapses. Family members are often the key support."],
    ]),
  ]),
  s("wy-f056", "child-family", "Infant crying and shaking risk", "child", "child", 3, "UMS", "Prevent shaken baby injury", "Father, 30, says he wants to shake the crying baby", [
    b("He is exhausted.", [
      ["h", "Tell him that is a terrible thought", "He feels judged and does not share again."],
      ["b", "Explain the danger and a safe plan", "He learns safe steps and the baby stays safe. Naming the danger and giving a plan prevents harm."],
      ["o", "Tell him all parents feel that way and move on", "He shakes the baby that night. Brushing it off leaves the risk unaddressed."],
    ]),
  ]),
  s("wy-f057", "child-family", "Child after a disaster", "ptsd", "child", 3, "US", "Support a child after a flood", "Girl, 7, after floods destroyed her home", [
    b("She has nightmares and clings to her mother.", [
      ["o", "Tell her mother to stop her talking about the flood", "She bottles her fear and the nightmares grow. Children need to talk and play to process."],
      ["b", "Keep routines and let her play and talk", "Her nightmares fade over weeks. Routine and reassurance help children recover."],
      ["h", "Tell her to be brave and stop crying", "She hides her fear and becomes withdrawn. Telling her to be brave silences her."],
    ]),
  ]),
  s("wy-f058", "child-family", "Teen and parental divorce", "child", "child", 2, "US", "Help a teen in a custody conflict", "Boy, 14, parents divorcing", [
    b("Each parent asks him to spy on the other.", [
      ["b", "Help the parents keep him out of it", "He feels relieved and less torn. Keeping children out of conflict protects them."],
      ["o", "Tell him to refuse and handle it himself", "He cannot say no to his parents and stays caught. The burden belongs to the adults."],
      ["h", "Ignore it", "He stays caught in the middle."],
    ]),
  ]),
  s("wy-f059", "child-family", "Child abuse by a parent", "child", "child", 4, "UMS", "Report suspected abuse by a parent", "Boy, 8, with belt marks", [
    b("He says his father beats him.", [
      ["o", "Talk to the father first to understand", "May put the child at greater risk."],
      ["h", "Ignore it as discipline", "He keeps being beaten. Abuse is not discipline; it must be reported."],
      ["b", "Record his words and report to Childline", "He is protected and the family is supported."],
    ]),
  ]),
  s("wy-f060", "child-family", "Child with intellectual disability and puberty", "child", "child", 3, "US", "Support puberty education", "Mother of a 13-year-old with intellectual disability", [
    b("She is worried about periods and safety.", [
      ["b", "Teach puberty and body safety", "Her daughter manages periods and knows body safety."],
      ["h", "Suggest sterilisation", "Unethical and prohibited as a mental health treatment."],
      ["o", "Tell her to keep her daughter at home always", "She becomes lonely and loses skills. Isolation harms her."],
    ]),
  ]),
  s("wy-f061", "child-family", "Full case: family with a teen in crisis", "child", "child", 5, "UMS", "Bring safety, family and school together", "Girl, 15, overdose, bullied, parents fighting", [
    b("She is medically well now.", [
      ["o", "Focus only on the bullying", "The bullying is addressed but the overdose risk and home conflict remain. Focusing on one part misses the rest."],
      ["b", "Assess risk, then plan with family and school", "She feels supported on all sides."],
      ["h", "Discharge her with no follow-up", "She takes another overdose within weeks. Risk remains high without follow-up."],
    ]),
    b("Her parents keep blaming each other in front of her.", [
      ["b", "See the parents alone about the harm to her", "They present a united front and she feels safer."],
      ["o", "Ask her to choose which parent to stay with", "She feels torn and guilty. Choosing between parents puts the burden on her."],
      ["h", "Tell them it is not your concern", "Home conflict is a key risk factor."],
    ], "She is back at home."),
  ]),
];
