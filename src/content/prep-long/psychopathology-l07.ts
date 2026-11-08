import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, cycle, tree, vis } from "./visual";

export const PSYCHOPATHOLOGY_L07: LongQA[] = anchored([
  {
    id: "psyp-l07-001",
    subject: "psychopathology",
    topic: "somatic-symptom",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Critically evaluate the DSM-5-TR concept of somatic symptom disorder. How does it differ from the older concept of somatisation disorder and from ICD-11 bodily distress disorder?",
    plan: ["Explain why the classification changed", "DSM-5-TR criteria", "Comparison with somatisation disorder and bodily distress disorder", "Strengths and criticisms", "Indian context and management", "Conclusion"],
    answer: `## Why the classification changed
DSM-IV somatoform disorders rested on "medically unexplained symptoms" and on counting symptoms (somatisation disorder needed eight symptoms across four groups). This created a mind body split, relied on the absence of medical findings, had low reliability, and was rarely used. DSM-5 replaced it with somatic symptom disorder, defined by positive psychological features.

## DSM-5-TR criteria
- A: one or more somatic symptoms that are distressing or disrupt daily life.
- B: excessive thoughts, feelings or behaviours about the symptoms, shown by at least one of: disproportionate and persistent thoughts about their seriousness; persistently high anxiety about health or symptoms; excessive time and energy devoted to them.
- C: the state of being symptomatic is persistent, usually more than six months, though any one symptom may change.
- Specifiers: with predominant pain, persistent, and severity (mild, moderate, severe).
The symptoms need not be medically unexplained; a person with cancer or heart disease can qualify if the psychological response is excessive.

## Comparison
| Feature | Somatisation disorder (DSM-IV) | Somatic symptom disorder (DSM-5-TR) | Bodily distress disorder (ICD-11) |
| Basis | Many unexplained symptoms | Distressing symptoms plus excessive response | Distressing symptoms plus excessive attention |
| Symptom count | Eight in four groups | One is enough | Usually several |
| Medically unexplained? | Required | Not required | Not required |
| Duration | Several years, onset before 30 | Usually six months | At least several months |
| Severity | Not rated | Mild, moderate, severe | Mild, moderate, severe |
Illness anxiety disorder covers health anxiety with few symptoms; in ICD-11 hypochondriasis sits with obsessive compulsive and related disorders.

## Strengths
- Removes the mind body dualism and the stigma of "it's all in your head".
- Positive criteria that can be assessed, not just absence of disease.
- More useful in primary care and medical settings.

## Criticisms
- Allen Frances and others warned that the threshold is low: one symptom plus worry may label many medically ill people, especially those with cancer or chronic pain, as mentally ill.
- Judging what is "excessive" is subjective and culturally variable.
- Field trial reliability was modest, and validity studies are few.
- It may lead to missed medical diagnoses if clinicians stop investigating.

## Indian context and management
Bodily complaints (aches, burning, weakness, "gas") are the commonest way distress is presented in Indian primary care, often with depression and anxiety. Management:
- One trusted doctor, regular scheduled visits rather than visits on demand.
- Reasonable investigations, then avoiding repeated tests.
- Acknowledge the symptoms as real; explain the links between stress, attention and bodily sensations.
- CBT, graded activity and treatment of comorbid depression with antidepressants (duloxetine or amitriptyline for pain).

## Conclusion
Somatic symptom disorder moved the field from "unexplained" symptoms to the person's response to symptoms. This is a conceptual advance, but the low threshold and subjective judgement of excess are real risks, and ICD-11 bodily distress disorder is a closely related alternative.`,
    keyPoints: ["Reasons for abandoning somatoform categories", "Criteria A, B and C with six months", "Medically unexplained not required", "Comparison with somatisation disorder and BDD of ICD-11", "Strengths", "Frances critique and low threshold", "Indian presentation and management principles"],
    visuals: [compare("What changed in DSM-5", ["Somatisation disorder", ["Many symptoms counted", "Must be medically unexplained", "Rarely diagnosed", "Mind body split"], "Diagnosis by exclusion"], ["Somatic symptom disorder", ["One distressing symptom can do", "Excessive thoughts, feelings or behaviours", "Medical illness may coexist", "Severity rated"], "Diagnosis by positive features"])],
    module: "more-disorders",
    ref: "DSM-5-TR somatic symptom disorder; ICD-11 6C20; Frances 2013 BMJ critique; Dimsdale 2013",
  },
  {
    id: "psyp-l07-002",
    subject: "psychopathology",
    topic: "conversion",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss functional neurological symptom disorder (conversion disorder): clinical features, positive signs, mechanisms and management.",
    plan: ["History and current definition", "Types and epidemiology including India", "Positive clinical signs and investigations", "Psychodynamic and modern neuroscientific mechanisms", "Management and prognosis", "Conclusion"],
    answer: `## History and definition
The condition was called hysteria for centuries. Charcot studied it at the Salpetriere, and Freud and Breuer proposed that repressed emotional conflicts are "converted" into bodily symptoms. DSM-5-TR uses the name functional neurological symptom disorder (conversion disorder):
- One or more symptoms of altered voluntary motor or sensory function.
- Clinical findings show incompatibility between the symptom and recognised neurological or medical conditions.
- Not better explained by another disorder; causes distress or impairment or warrants medical evaluation.
- Specify type, acute (under six months) or persistent, and with or without a psychological stressor.
The requirement for a preceding psychological stressor was removed, because it is often absent or unknown, and diagnosis now rests on positive clinical signs. ICD-11 calls it dissociative neurological symptom disorder.

## Types and epidemiology
Types: weakness or paralysis, abnormal movements (tremor, dystonia, gait disorder), swallowing difficulty, speech problems, functional (dissociative) seizures, anaesthesia or sensory loss, visual or hearing loss, and mixed. Functional disorders account for a large share of new neurology outpatients, second only to headache in some surveys. They are more common in women, often begin in adolescence or early adulthood, and in India are frequently seen in emergency departments as "unconsciousness" or "fits" in young women after family conflict.

## Positive clinical signs
- Hoover's sign: weak hip extension on testing that becomes normal when the person flexes the opposite hip against resistance.
- Hip abductor sign, give way or collapsing weakness, drift without pronation.
- Tremor that changes frequency to match a rhythm tapped by the other hand (entrainment), and that stops with distraction.
- Dragging monoplegic gait, and tubular visual field loss.
- Functional seizures: gradual onset, long duration, eyes closed with resistance to opening, side to side head movements, asynchronous limb movements, pelvic thrusting, crying during or after the attack, and recall of the event. Injury, tongue biting at the tip, and incontinence can occur, so none of these rule it out.
- Video EEG recording of a typical attack is the gold standard for seizures; a raised prolactin after an attack favours epilepsy.
About 10 to 20 percent of people with functional seizures also have epilepsy, so careful assessment matters.

## Mechanisms
- Psychodynamic: conversion of conflict into symptoms, with primary gain (relief of anxiety) and secondary gain (care, avoidance of duties). La belle indifference was considered typical but is not reliable.
- Dissociation: Janet saw symptoms as a narrowing of consciousness and splitting off of functions.
- Learning: illness behaviour reinforced by attention or relief from stress.
- Modern neuroscience: the predictive processing model (Edwards and colleagues) proposes that abnormal, strongly held expectations about the body, combined with attention focused on the body part, override actual sensory input. Imaging shows altered connectivity between the limbic system, motor areas and the temporoparietal junction, which supports the sense of agency; this explains why the symptoms feel involuntary. Childhood adversity, trauma, physical injury and illness are common risk factors.

## Management
- Make a positive diagnosis based on signs and explain it clearly: the symptoms are real, common, not imagined, caused by a problem in how the brain sends and receives signals, and potentially reversible. Showing the patient their Hoover's sign can help.
- Avoid repeated investigations and unnecessary drugs, including anti epileptic drugs for functional seizures.
- Specialist physiotherapy for motor symptoms, retraining movement with distraction and normal patterns.
- CBT for functional seizures (recognising warning signs, grounding techniques) and for anxiety and avoidance.
- Treat comorbid depression, anxiety and PTSD.
- Work with family to reduce reinforcement of disability and to address stressors such as marital or in law conflict.
- In India, many patients are seen by faith healers; a clear explanation in the family's language improves engagement.

## Prognosis
Better with short duration, acute onset, clear stressor, young age and acceptance of the diagnosis; worse with long duration, chronic disability, and compensation claims. About a third or more remain symptomatic years later.

## Conclusion
Functional neurological disorder is a common, real and disabling condition, now diagnosed by positive signs rather than by exclusion or presumed conflict. Clear explanation, physiotherapy and psychological therapy are the main treatments.`,
    keyPoints: ["History from hysteria to FND", "DSM-5-TR criteria with stressor no longer required", "Types and epidemiology", "Hoover's sign, entrainment and other positive signs", "Features of functional seizures and video EEG", "Psychodynamic and predictive processing mechanisms", "Positive explanation, physiotherapy and CBT", "Prognostic factors"],
    pitfalls: ["Diagnosing by exclusion only", "Calling the symptoms feigned", "Relying on la belle indifference", "Missing coexisting epilepsy"],
    visuals: [
      chain("Predictive processing in FND", [["Expectation", "A strong belief that the leg will not move"], ["Attention to the body", "Focus on the leg"], ["Prediction wins", "Brain trusts expectation over real signals"], ["Symptom", "Weakness that feels involuntary"], ["Distraction", "Attention moves away and movement returns, as in Hoover's sign"]]),
    ],
    module: "more-disorders",
    ref: "DSM-5-TR FND; Stone and Carson; Edwards 2012 Bayesian model; LaFrance 2013 ILAE PNES; Espay 2018 JAMA Neurol review",
  },
  {
    id: "psyp-l07-003",
    subject: "psychopathology",
    topic: "illness-anxiety",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on illness anxiety disorder.",
    plan: ["Definition and criteria", "Subtypes and differential", "Cognitive model", "Treatment"],
    answer: `## Definition and criteria
Illness anxiety disorder replaced much of DSM-IV hypochondriasis. DSM-5-TR criteria:
- Preoccupation with having or acquiring a serious illness.
- Somatic symptoms are absent or, if present, only mild; if another medical condition exists, the preoccupation is clearly excessive.
- High anxiety about health and easy alarm about personal health.
- Excessive health related behaviours (repeated checking of the body, searching online) or maladaptive avoidance (avoiding doctors and hospitals).
- Present for at least six months, though the feared illness may change.
- Specify care seeking type or care avoidant type.
People with marked bodily symptoms and health worry are diagnosed with somatic symptom disorder instead. ICD-11 keeps the term hypochondriasis and places it among obsessive compulsive and related disorders.

## Differential diagnosis
Undiagnosed medical illness, GAD (worry is broader), OCD, panic disorder (fear of an immediate catastrophe during attacks), depression and delusional disorder of the somatic type.

## Cognitive model
Salkovskis and Warwick described health anxiety as maintained by misinterpretation of harmless bodily sensations and medical information as signs of serious illness, based on beliefs from earlier experiences (an illness in the family). Reassurance seeking and checking give short relief but keep doubt alive; internet searching ("cyberchondria") adds fuel.

## Treatment
CBT is the treatment with the best evidence: reattribution, behavioural experiments, reducing checking and reassurance seeking, and limiting online searching. SSRIs help some. A single consistent doctor with planned visits is useful in primary care.

## Conclusion
Illness anxiety disorder is excessive health fear with few symptoms; CBT targeting reassurance and checking is effective.`,
    keyPoints: ["Criteria with mild or absent symptoms", "Six months and two subtypes", "Distinction from somatic symptom disorder", "ICD-11 hypochondriasis placement", "Salkovskis model with reassurance seeking", "CBT and SSRIs"],
    module: "more-disorders",
    ref: "DSM-5-TR illness anxiety disorder; Salkovskis and Warwick 1986",
  },
  {
    id: "psyp-l07-004",
    subject: "psychopathology",
    topic: "factitious",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on factitious disorder and how it differs from malingering.",
    plan: ["Definition and criteria", "Imposed on self and on another", "Comparison with malingering and conversion", "Management"],
    answer: `## Definition
Factitious disorder is the deliberate falsification of physical or psychological signs or symptoms, or the induction of injury or disease, associated with identified deception, in order to take on the sick role. The deceptive behaviour is present even without obvious external rewards.

## Types
- Factitious disorder imposed on self: the person presents himself or herself as ill, impaired or injured. The severe chronic form with travel between hospitals and dramatic stories was called Munchausen syndrome, a name Richard Asher gave it in 1951.
- Factitious disorder imposed on another (previously Munchausen by proxy): a caregiver, usually a mother, falsifies or induces illness in a child or dependent. The perpetrator receives the diagnosis, and it is a form of child abuse requiring protection.

## Common presentations
Injecting insulin, contaminating urine or wounds, taking warfarin, feigning seizures or psychosis, and exaggerating grief. Many patients have health care backgrounds, personality disorders and histories of childhood illness or abuse.

## Comparison
| Feature | Factitious disorder | Malingering | Conversion (FND) |
| Symptoms produced deliberately? | Yes | Yes | No |
| Motive | Internal: to be a patient | External: money, avoiding duty or prosecution, drugs | Not conscious |
| Status | Mental disorder | Not a mental disorder; a condition for clinical attention | Mental disorder |

## Management
Confirm the diagnosis carefully, coordinate one care team, avoid unnecessary procedures, and use a non punitive, face saving confrontation offering psychiatric help. In imposed on another, follow child protection procedures (in India, under the Juvenile Justice Act and child welfare committees). Outcomes are often poor because patients leave care.

## Conclusion
Factitious disorder is deliberate deception with an internal motive; malingering has an external motive and is not a mental disorder.`,
    keyPoints: ["Definition with identified deception", "Imposed on self and on another", "Munchausen syndrome", "Table with malingering and conversion", "Non punitive confrontation and child protection"],
    module: "more-disorders",
    ref: "DSM-5-TR factitious disorder; Asher 1951",
  },
  {
    id: "psyp-l07-005",
    subject: "psychopathology",
    topic: "anorexia",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the clinical features, medical complications, aetiology and management of anorexia nervosa.",
    plan: ["Definition and DSM-5-TR and ICD-11 criteria", "Epidemiology including Asian and Indian presentation", "Medical complications and risk assessment", "Aetiology across levels", "Management: setting, refeeding, psychological therapies, medicines", "Prognosis and conclusion"],
    answer: `## Definition and criteria
Anorexia nervosa is an eating disorder in which a person maintains a low body weight through restriction, driven by fear of weight gain and disturbed body image. DSM-5-TR criteria:
- Restriction of energy intake leading to significantly low body weight for age, sex, development and physical health.
- Intense fear of gaining weight or becoming fat, or persistent behaviour that prevents weight gain.
- Disturbance in how weight or shape is experienced, undue influence of weight on self evaluation, or persistent lack of recognition of the seriousness of low weight.
- Subtypes: restricting type, and binge eating and purging type (in the last three months).
- Severity by BMI in adults: mild 17 or more, moderate 16 to 16.99, severe 15 to 15.99, extreme below 15.
Amenorrhoea was removed as a criterion in DSM-5. ICD-11 uses a BMI below 18.5 for low weight and highlights a dangerously low weight below 14.

## Epidemiology
Lifetime prevalence is about 1 percent in women, with a female to male ratio of about 10 to 1. Onset is usually in adolescence. In India and other Asian countries it is increasingly reported in urban students. Many Asian patients deny fear of fatness and explain food refusal by stomach discomfort or lack of appetite ("non fat phobic anorexia", described by Sing Lee), which DSM-5 accommodates through the "persistent behaviour" criterion.

## Clinical features
Strict dieting, calorie counting, avoiding meals with others, excessive exercise, self induced vomiting or laxative use in the purging type, preoccupation with food (cooking for others), body checking, social withdrawal, depression, irritability, obsessional traits, and denial of illness.

## Medical complications
| System | Complications |
| Cardiovascular | Bradycardia, hypotension, arrhythmias, prolonged QTc, heart muscle loss |
| Metabolic | Hypokalaemia and alkalosis from vomiting, hypoglycaemia, hypothermia |
| Endocrine | Amenorrhoea, low oestrogen and testosterone, raised cortisol, low T3 |
| Bone | Osteopenia and osteoporosis, fractures |
| Blood | Anaemia, low white cells |
| Skin and hair | Lanugo hair, dry skin, hair loss, Russell's sign (calluses on knuckles from vomiting) |
| Gut | Delayed gastric emptying, constipation, raised liver enzymes |
| Brain | Reduced grey matter, poor concentration, partly reversible |
Refeeding syndrome is a dangerous shift of phosphate, potassium and magnesium into cells when feeding restarts, causing heart failure, arrhythmias and death; low phosphate is the hallmark. Anorexia has one of the highest mortality rates of any psychiatric disorder, from starvation and suicide. Guidance such as MEED (Medical Emergencies in Eating Disorders) helps rate risk using BMI, rate of weight loss, pulse, blood pressure, temperature, blood tests, ECG and the sit up squat stand test.

## Aetiology
- Genetic: heritability about 50 to 60 percent; genome wide studies suggest both psychiatric and metabolic genetic contributions, which reframes anorexia as a "metabo psychiatric" disorder.
- Neurobiological: altered serotonin and dopamine reward processing, heightened anxiety, and starvation effects that maintain the illness.
- Personality: perfectionism, obsessional traits, harm avoidance and low self esteem.
- Developmental and psychodynamic: Hilde Bruch described a struggle for control and a sense of ineffectiveness; Crisp saw it as avoidance of adult maturity.
- Family: Minuchin described enmeshment and conflict avoidance, but families are not now seen as the cause; they are a resource for treatment.
- Sociocultural: thin ideal, dieting culture, social media, sports such as ballet and gymnastics.
- Cognitive behavioural: Fairburn's transdiagnostic model places over evaluation of shape, weight and control of eating at the core, maintained by dietary restraint, perfectionism, low self esteem, mood intolerance and interpersonal problems.

## Management
Assessment and setting:
- Medical risk assessment at every stage; outpatient care for most, day or inpatient care for high risk.
- Admission may be needed under the MHCA 2017 if the person lacks capacity and life is at risk; nasogastric feeding can be lifesaving.
Nutritional:
- Supervised refeeding, starting cautiously in high risk patients, with phosphate, potassium and magnesium checked and replaced and thiamine given, aiming for steady weight gain (about 0.5 to 1 kg a week).
Psychological:
- Adolescents: family based treatment, developed in London, in which parents take charge of eating at first, then control returns gradually to the young person.
- Adults: enhanced CBT (CBT-E), MANTRA (a specialist model of anorexia treatment for adults) and specialist supportive clinical management.
Medicines:
- No medicine treats the core illness. Olanzapine at low dose can modestly help weight gain and anxiety. Antidepressants work poorly at low weight. Treat bone health and deficiencies.

## Prognosis
About half recover fully, a third improve, and a fifth remain chronically ill. Long duration, very low weight, purging and late onset predict poorer outcomes.

## Conclusion
Anorexia nervosa is a serious, sometimes fatal illness combining psychological and medical risk. Early recognition, careful refeeding and family or specialised psychological therapy give the best chance of recovery.`,
    keyPoints: ["DSM-5-TR criteria and subtypes", "BMI severity bands and amenorrhoea removed", "Non fat phobic presentations in Asia", "Medical complications across systems", "Refeeding syndrome with low phosphate", "Aetiology at genetic, personality, family and cultural levels", "Family based treatment for adolescents and CBT-E or MANTRA for adults", "Prognosis figures"],
    pitfalls: ["Listing only psychological features", "Not mentioning refeeding syndrome", "Blaming families", "Overstating medicines"],
    visuals: [
      cycle("Fairburn's maintaining cycle", [["Over value of shape and weight", "Self worth judged by thinness"], ["Strict dieting", "Rules about food"], ["Starvation effects", "Preoccupation with food, low mood"], ["Sense of control", "Reinforces dieting"]]),
      chain("Refeeding syndrome", [["Starvation", "Body stores of phosphate, potassium, magnesium run low"], ["Feeding restarts", "Insulin rises with carbohydrate"], ["Shift into cells", "Phosphate, potassium and magnesium move into cells"], ["Low blood levels", "Low phosphate is the hallmark"], ["Danger", "Heart failure, arrhythmia, seizures"]], "Check and replace electrolytes and give thiamine in the first days."),
    ],
    module: "more-disorders",
    ref: "DSM-5-TR anorexia nervosa; ICD-11 6B80; RCPsych MEED 2022; Watson 2019 GWAS; Fairburn 2003; Lock FBT; Lee non-fat-phobic",
  },
  {
    id: "psyp-l07-006",
    subject: "psychopathology",
    topic: "bulimia",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on bulimia nervosa and binge eating disorder.",
    plan: ["Criteria for each", "Complications", "Comparison", "Treatment"],
    answer: `## Bulimia nervosa
DSM-5-TR criteria:
- Recurrent binge eating: eating an amount clearly larger than most people would in a discrete period, with a sense of loss of control.
- Recurrent inappropriate compensatory behaviour: self induced vomiting, laxatives, diuretics, fasting or excessive exercise.
- Both at least once a week for three months.
- Self evaluation unduly influenced by shape and weight.
- Not occurring only during episodes of anorexia nervosa.
Severity by compensatory episodes per week: mild 1 to 3, moderate 4 to 7, severe 8 to 13, extreme 14 or more. Weight is usually normal.

## Binge eating disorder
- Recurrent binge eating at least once a week for three months, with three or more of: eating much more rapidly than normal, eating until uncomfortably full, eating large amounts when not hungry, eating alone because of embarrassment, and feeling disgusted, depressed or guilty afterwards.
- Marked distress, and no regular compensatory behaviour.
It is the most common eating disorder and is linked to obesity and diabetes.

## Complications of bulimia
Hypokalaemia (risk of arrhythmia), metabolic alkalosis, enlarged parotid glands, dental erosion, Russell's sign, oesophageal tears, and menstrual problems.

## Treatment
- CBT, especially enhanced CBT (Fairburn), is first line for both: regular eating, reducing dieting, addressing triggers and shape concerns.
- Guided self help CBT works well in many cases.
- Fluoxetine (up to 60 mg) reduces binge and purge frequency in bulimia.
- Lisdexamfetamine is approved in the USA for moderate to severe binge eating disorder.
- Check electrolytes; screen for depression, self harm and substance use.

## Conclusion
Bulimia and binge eating disorder share binge eating but differ in compensatory behaviour and weight; both respond well to CBT.`,
    keyPoints: ["Bulimia criteria with weekly for three months", "Severity bands", "BED criteria with three of five", "No compensatory behaviour in BED", "Medical complications", "CBT-E, fluoxetine 60 mg and lisdexamfetamine"],
    module: "more-disorders",
    ref: "DSM-5-TR bulimia and BED; Fairburn CBT-E; FDA lisdexamfetamine BED 2015",
  },
  {
    id: "psyp-l07-007",
    subject: "psychopathology",
    topic: "insomnia",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe insomnia disorder, its psychological models and its management, with emphasis on CBT for insomnia.",
    plan: ["Definition and criteria", "Epidemiology and assessment", "Spielman 3P model and hyperarousal", "CBT-I components", "Medicines and conclusion"],
    answer: `## Definition and criteria
Insomnia disorder in DSM-5-TR is dissatisfaction with sleep quantity or quality with difficulty falling asleep, staying asleep or early morning waking, causing distress or daytime impairment, at least three nights a week for at least three months, despite adequate opportunity to sleep, and not explained by another sleep disorder or substance. It can be diagnosed alongside other mental or physical disorders when it needs separate attention.

## Epidemiology and assessment
About a third of adults have some insomnia symptoms and about 6 to 10 percent meet criteria. It is more common in women, older people, shift workers and people with depression, anxiety and chronic pain. Insomnia is also a risk factor for later depression.
Assessment includes a two week sleep diary, the Insomnia Severity Index or the Pittsburgh Sleep Quality Index, review of caffeine, alcohol, screens and medicines, and screening for sleep apnoea (snoring, daytime sleepiness, Epworth scale), restless legs and circadian rhythm problems. Polysomnography is not routinely needed.

## Psychological models
- Spielman's 3P model:
- Predisposing factors: anxious temperament, family history, female sex.
- Precipitating factors: stress, illness, a new baby, bereavement.
- Perpetuating factors: going to bed early, spending long hours in bed, napping, worrying about sleep, alcohol, irregular schedules. These keep insomnia going long after the trigger fades and are the target of CBT-I.
- Hyperarousal model: raised physiological and cognitive arousal day and night.
- Cognitive model (Harvey): worry about sleep and its consequences, monitoring for signs of poor sleep, and safety behaviours.
- Conditioning: the bed becomes linked with wakefulness and frustration instead of sleep.

## CBT for insomnia
CBT-I is the first line treatment for chronic insomnia, with lasting effects better than medicines. Components:
- Sleep restriction: limit time in bed to the actual average sleep time (not below about five hours), then increase it gradually as sleep efficiency rises above about 85 to 90 percent. This builds sleep pressure.
- Stimulus control (Bootzin): use the bed only for sleep and sex; go to bed only when sleepy; get up if not asleep in about 20 minutes; fixed wake time every day; no daytime naps.
- Cognitive therapy: challenge beliefs such as "I must get eight hours or I will fail".
- Sleep hygiene: caffeine and alcohol limits, regular exercise, a dark quiet room, no screens late.
- Relaxation training.
Digital CBT-I and group formats increase access.

## Medicines
- Short term: Z drugs (zolpidem, zopiclone) or short acting benzodiazepines, ideally for two to four weeks, because of tolerance, dependence, falls and next day impairment.
- Orexin receptor antagonists (suvorexant, lemborexant, daridorexant) act by blocking wake signals.
- Low dose doxepin, and prolonged release melatonin in people over 55.
- Sedating antidepressants and antihistamines have weak evidence.

## Conclusion
Insomnia disorder is common and often perpetuated by learned habits and worry. CBT-I targets these and is the treatment of choice, with medicines kept for short term use.`,
    keyPoints: ["Three nights a week for three months", "Assessment with diary and screening for apnoea", "3P model with perpetuating factors", "Hyperarousal and conditioning", "Sleep restriction with sleep efficiency rule", "Stimulus control rules", "Medicines and their limits including orexin antagonists"],
    visuals: [
      tree("Spielman's 3P model", [["Chronic insomnia", "", -1], ["Predisposing", "Anxious temperament, family history", 0], ["Precipitating", "Stress, illness, shift change", 0], ["Perpetuating", "Long time in bed, napping, worry", 0]], "CBT-I targets the perpetuating factors."),
      vis("hypnogram", { caption: "A normal night: deep sleep comes early, REM grows towards morning." }),
    ],
    module: "more-disorders",
    ref: "DSM-5-TR insomnia disorder; Spielman 1987; Harvey 2002; Bootzin 1972; ACP 2016 guideline CBT-I first line",
  },
  {
    id: "psyp-l07-008",
    subject: "psychopathology",
    topic: "dhat",
    marks: 5,
    difficulty: 1,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on Dhat syndrome.",
    plan: ["Definition and who described it", "Cultural roots", "Clinical features and comorbidity", "Classification and management"],
    answer: `## Definition
Dhat syndrome is a culture related condition of South Asia in which a young man attributes weakness, fatigue and other symptoms to the loss of semen ("dhat") in urine, through night emissions or masturbation. N N Wig described it in 1960 at Lucknow.

## Cultural roots
Traditional beliefs, drawn from Ayurvedic ideas, hold that semen is a vital and precious fluid made from blood and that its loss drains strength. Similar beliefs are found in Sri Lanka (sukra prameha), China and earlier in Western medicine.

## Clinical features
- Typically young, unmarried men from rural or semi urban backgrounds.
- Complaints of passing whitish urine, weakness, tiredness, poor concentration, aches, and guilt about masturbation.
- Fears about sexual performance and marriage; erectile problems or premature ejaculation may be reported.
- Comorbid depression and anxiety are present in a large proportion, which suggests that Dhat is often an idiom of distress.
- Patients usually first consult traditional healers, sex clinics or general physicians.

## Classification
ICD-10 listed it under "other neurotic disorders". DSM-5-TR includes it among cultural concepts of distress. ICD-11 does not give it a separate code.

## Management
- Respectful listening to the patient's explanation, without ridicule.
- Simple physical examination and urine tests to reassure.
- Sex education: semen loss is normal and harmless; masturbation does not cause weakness.
- Treat comorbid depression, anxiety or sexual dysfunction with CBT and medicines.
- Use culturally fitting explanations and involve the family if appropriate.

## Conclusion
Dhat syndrome is a common South Asian idiom of distress; good management combines cultural sensitivity, education and treatment of underlying depression or anxiety.`,
    keyPoints: ["Definition and Wig 1960", "Cultural belief about semen", "Typical patient and complaints", "High comorbid depression and anxiety", "Classification in ICD-10 and DSM-5-TR", "Sex education and treatment of comorbidity"],
    module: "more-disorders",
    ref: "Wig 1960; Prakash 2007 review; DSM-5-TR cultural concepts; Sumathipala 2004",
  },
  {
    id: "psyp-l07-009",
    subject: "psychopathology",
    topic: "cultural-concepts",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester", "ugc-net"],
    question: "Discuss culture-bound syndromes and the DSM-5-TR approach to culture in diagnosis, including the Cultural Formulation Interview.",
    plan: ["Define the older concept and its problems", "Explain cultural concepts of distress: syndromes, idioms, explanations", "Describe several syndromes including Indian ones", "Cultural Formulation Interview", "Clinical relevance and conclusion"],
    answer: `## From culture-bound syndromes to cultural concepts
"Culture-bound syndromes" were described by Pow Meng Yap and others as patterns of distress limited to certain cultures. The term implied that Western disorders were universal and others were exotic. DSM-5 replaced it with cultural concepts of distress, recognising that all distress is shaped by culture, including Western forms such as anorexia nervosa.

DSM-5-TR describes three types:
- Cultural syndromes: clusters of symptoms recognised in a community (for example, ataque de nervios).
- Cultural idioms of distress: ways of expressing suffering (for example, "thinking too much", "tension").
- Cultural explanations or perceived causes: explanatory models (black magic, karma, semen loss, evil eye).

## Examples
| Concept | Region | Features |
| Dhat | South Asia | Weakness attributed to semen loss |
| Koro | South and East Asia, also India (epidemics in Assam and Bengal) | Acute fear that the penis (or breasts) will retract into the body, causing death |
| Ataque de nervios | Latin America | Attacks of shouting, crying, heat, aggression after family stress |
| Khyal cap | Cambodia | Wind attacks with dizziness and palpitations |
| Kufungisisa | Zimbabwe | "Thinking too much", with anxiety and depression |
| Taijin kyofusho | Japan | Fear of offending others by one's gaze, smell or appearance |
| Susto | Latin America | Fright causing the soul to leave the body |
| Shenjing shuairuo | China | Weakness, fatigue and poor concentration (neurasthenia) |
| Possession and trance states | South Asia, Africa | Identity replaced by a spirit or deity |
Other Indian idioms include "ghabrahat" (anxious restlessness), "man nahi lagta" (no interest), "dimaag garam" (heated brain) and "tension".

## Cultural Formulation Interview
DSM-5 introduced the Cultural Formulation Interview (CFI), a 16 question semi structured interview with supplementary modules and an informant version. It covers four domains:
- Cultural definition of the problem: how the person and family describe it.
- Cultural perceptions of cause, context and support: explanations, stressors, role of religion and community.
- Cultural factors affecting self coping and past help seeking: healers, home remedies, earlier treatment.
- Cultural factors affecting current help seeking: preferences, barriers, and the clinician patient relationship.
It is based on the earlier Outline for Cultural Formulation and Arthur Kleinman's explanatory model questions.

## Clinical relevance in India
- Patients often present with somatic idioms rather than emotional words; recognising them avoids missed depression and anxiety.
- Beliefs shared by the community (possession, black magic) are not delusions.
- Pathways to care often begin with faith healers; respectful engagement improves adherence.
- Language, caste, gender roles and family hierarchy shape what can be said in interviews.

## Critique
Lists of syndromes can stereotype groups, and the CFI takes time, though shorter versions exist. Cultural knowledge must be applied to the individual, not assumed from group membership.

## Conclusion
DSM-5-TR moved from exotic "culture-bound syndromes" to a universal view of culture in all distress. Knowing local idioms and using the Cultural Formulation Interview improves diagnosis and engagement, which is especially important in a diverse country like India.`,
    keyPoints: ["Yap and the older concept with critique", "Three types of cultural concepts", "At least six named syndromes with features", "Koro and Dhat with Indian context", "CFI: 16 questions and four domains", "Kleinman explanatory models", "Clinical relevance and caution against stereotyping"],
    visuals: [tree("Cultural concepts of distress", [["Cultural concepts", "DSM-5-TR", -1], ["Syndromes", "Ataque de nervios, koro, Dhat", 0], ["Idioms of distress", "Tension, thinking too much, ghabrahat", 0], ["Explanations", "Black magic, karma, evil eye", 0]])],
    module: "more-disorders",
    ref: "DSM-5-TR cultural formulation chapter and glossary; Yap 1969; Kleinman 1980; Lewis-Fernandez CFI 2016",
  },
  {
    id: "psyp-l07-010",
    subject: "psychopathology",
    topic: "sexual-dysfunction",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on the classification of sexual dysfunctions.",
    plan: ["Sexual response models", "DSM-5-TR list with general rules", "ICD-11 change", "Treatment principles"],
    answer: `## Sexual response models
- Masters and Johnson: four phases of excitement, plateau, orgasm and resolution.
- The triphasic model, which added desire as a first phase: three phases of desire, arousal (excitement) and orgasm.
- Rosemary Basson: a circular model for many women, in which desire may follow arousal from emotional intimacy rather than come first.
Dysfunctions are classified by the phase affected.

## DSM-5-TR sexual dysfunctions
- Delayed ejaculation.
- Erectile disorder.
- Female orgasmic disorder.
- Female sexual interest and arousal disorder (desire and arousal merged for women).
- Genito pelvic pain and penetration disorder (merging vaginismus and dyspareunia).
- Male hypoactive sexual desire disorder.
- Premature (early) ejaculation: within about one minute of vaginal penetration and before the person wishes.
- Substance or medication induced sexual dysfunction, and other or unspecified forms.
General rules: symptoms on almost all or all occasions (about 75 to 100 percent), lasting about six months, causing distress, not better explained by relationship distress, other stressors or a medical condition. Specify lifelong or acquired, generalised or situational, and severity.

## ICD-11
Sexual dysfunctions and sexual pain disorders moved to a new chapter, "conditions related to sexual health", which avoids the old split between "organic" and "non organic" and allows aetiological qualifiers (medical, psychological, relationship, cultural, drug related).

## Treatment principles
Assess physical causes (diabetes, hypertension, medicines such as SSRIs and antipsychotics) and relationship factors. Treatments include psychoeducation, Masters and Johnson's sensate focus, stop start and squeeze techniques for premature ejaculation, PDE5 inhibitors (sildenafil, tadalafil) for erectile disorder, dapoxetine or daily SSRIs for premature ejaculation, and graded dilators with pelvic floor therapy for penetration disorder.

## Conclusion
Sexual dysfunctions are classified by phase of response, with time and frequency rules; treatment combines medical, behavioural and couple approaches.`,
    keyPoints: ["Three response models", "All DSM-5-TR dysfunctions named", "Six months and 75 percent rule", "Premature ejaculation one minute", "ICD-11 sexual health chapter", "Treatment principles including sensate focus"],
    module: "more-disorders",
    ref: "DSM-5-TR sexual dysfunctions; ICD-11 chapter 17; Masters and Johnson 1966; Kaplan 1979; Basson 2000",
  },
]);
