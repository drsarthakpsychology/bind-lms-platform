import type { LongQA } from "@/lib/prep/long-types";
import { chain, compare, layers, tree } from "./visual";

export const CLINICAL_PSYCHIATRY_L03: LongQA[] = [
  {
    id: "cpsy-l03-001",
    subject: "clinical-psychiatry",
    topic: "ocd-management",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the management of obsessive compulsive disorder, including treatment-resistant OCD.",
    plan: ["Assessment and engagement", "First line: ERP and SSRIs with doses and duration", "Defining response and resistance", "Options for resistance: augmentation, other drugs, neuromodulation, surgery", "Family, Indian practice and maintenance", "Conclusion"],
    answer: `## Assessment and engagement
- Confirm the diagnosis and its symptom dimensions; rate severity with the Y-BOCS (or CY-BOCS in children).
- Assess insight, avoidance, family accommodation, comorbidity (depression, tics, bipolar disorder, eating disorders) and suicide risk.
- Explain OCD as a common, treatable condition in which thoughts are not dangerous and rituals keep fear going.

## First line treatments
Exposure and response prevention (ERP):
- Build a hierarchy of feared situations, then expose the patient gradually (touching "contaminated" objects, leaving the gas without checking) while preventing the ritual.
- Anxiety rises and then falls without the ritual (habituation and inhibitory learning).
- Usually 12 to 20 sessions with homework; about 50 to 60 percent respond, with lower relapse after stopping than with medicines.
- Cognitive techniques (responsibility pie charts, testing thought action fusion) are added, especially for obsessions without overt rituals.

SSRIs:
- Fluoxetine (40 to 80 mg), sertraline (up to 200 mg), fluvoxamine (up to 300 mg), paroxetine (up to 60 mg) and escitalopram (up to 20 mg, sometimes higher under specialist care).
- Higher doses and longer trials than in depression: at least 8 to 12 weeks at the maximum tolerated dose before judging response.
- Clomipramine (up to 250 mg) is equally or slightly more effective but less well tolerated (anticholinergic effects, seizures, cardiac effects); monitor ECG.
Choice: mild to moderate OCD may start with ERP alone; moderate to severe OCD benefits from combined ERP and an SSRI.

## Response and resistance
Response is usually a reduction of 25 to 35 percent or more in Y-BOCS score; full remission is uncommon. Treatment resistance is failure of at least two adequate SSRI trials (one may be clomipramine) and a course of ERP.

## Options for resistant OCD
- Check adherence, dose, duration and whether ERP was truly done.
- Switch to another SSRI or to clomipramine.
- Augment with a low dose antipsychotic: risperidone (0.5 to 2 mg) or aripiprazole; about a third of resistant patients respond, especially those with tics. Stop if no benefit after four to eight weeks.
- Other augmenting agents with smaller trials: memantine, N acetylcysteine, ondansetron, topiramate, lamotrigine.
- Intensive or inpatient ERP programmes, available in specialist centres such as NIMHANS.
- Neuromodulation: deep TMS targeting the medial prefrontal and anterior cingulate cortex has regulatory approval in the USA; rTMS to the supplementary motor area or orbitofrontal cortex has mixed evidence.
- Deep brain stimulation of the ventral capsule and ventral striatum, or ablative neurosurgery (anterior capsulotomy, gamma knife capsulotomy, cingulotomy) for severe, chronic, disabling and resistant cases, through specialist teams with ethical review. Under the MHCA 2017, psychosurgery needs the patient's informed consent and approval of the Mental Health Review Board.
- ECT is generally not effective for OCD itself, though it can treat severe comorbid depression.

## Family and Indian practice
Family accommodation (relatives washing, checking or answering repeated questions) is very common in Indian households and predicts poorer outcome. Families should be taught to reduce accommodation gradually and support exposure. Religious obsessions may need careful work with the patient's faith, sometimes with input from a religious leader to separate normal practice from ritual.

## Maintenance
Continue medicines for at least one to two years after response, then taper slowly. Booster ERP sessions and relapse prevention plans help. Long term, many patients need ongoing treatment.

## Conclusion
OCD is treated with ERP and high dose SSRIs given long enough. In resistance, augmentation with antipsychotics, intensive ERP and, rarely, neuromodulation or neurosurgery are options. Reducing family accommodation is an important part of care.`,
    keyPoints: ["Y-BOCS and assessment of insight, accommodation and comorbidity", "ERP method and response rates", "SSRIs with higher doses and 8 to 12 week trials", "Clomipramine role and cautions", "Definitions of response and resistance", "Antipsychotic augmentation with rates", "Neuromodulation and neurosurgery with MHCA safeguards", "Family accommodation and maintenance duration"],
    pitfalls: ["Using depression doses and short trials", "Not offering ERP", "Ignoring family accommodation"],
    visuals: [
      chain("Stepped care in OCD", [["ERP or SSRI", "Mild to moderate"], ["ERP plus SSRI", "Moderate to severe"], ["Second SSRI or clomipramine", "After 8 to 12 weeks without response"], ["Antipsychotic augmentation, intensive ERP", "Resistant"], ["Neuromodulation or neurosurgery", "Severe, chronic, resistant"]]),
      compare("With and without the ritual", ["Doing the ritual", ["Anxiety drops fast", "Relief rewards the ritual", "Belief that it prevented harm stays", "Next time the urge is stronger"], "Short relief, long problem"], ["Exposure with response prevention", ["Anxiety rises, then falls by itself", "No ritual is rewarded", "The feared harm does not happen", "Each session starts lower"], "Lasting change"]),
    ],
    module: "ocd",
    ref: "Maudsley OCD; NICE CG31; Bloch 2006 antipsychotic augmentation meta-analysis; Janardhan Reddy IPS guidelines OCD 2017; MHCA 2017 s96",
  },
  {
    id: "cpsy-l03-002",
    subject: "clinical-psychiatry",
    topic: "gad-management",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Discuss the management of generalised anxiety disorder using a stepped care approach.",
    plan: ["Assessment", "Stepped care model", "Psychological treatments", "Medicines with doses and cautions", "Duration and conclusion"],
    answer: `## Assessment
Confirm the diagnosis; rate severity (GAD 7, Hamilton Anxiety Rating Scale); look for comorbid depression, panic, alcohol and benzodiazepine use; exclude hyperthyroidism, caffeine excess, stimulant use, arrhythmias and anaemia; ask about stressors and suicide risk.

## Stepped care
| Step | Who | Intervention |
| 1 | All suspected GAD | Identification, assessment, education about GAD and active monitoring |
| 2 | Not improved | Low intensity psychological help: guided self help, psychoeducational groups |
| 3 | Marked impairment or no response | High intensity CBT or applied relaxation, or medicine |
| 4 | Complex, resistant, high risk | Specialist care, combined treatment |

## Psychological treatments
- CBT: psychoeducation, worry diaries, worry time, challenging beliefs about worry (positive and negative metacognitive beliefs), tolerance of uncertainty experiments, problem solving, and exposure to feared images.
- Applied relaxation (Ost): progressive muscle relaxation shortened to cue controlled relaxation and applied in real situations.
- Metacognitive therapy.
- Mindfulness based approaches and yoga based breathing may help as adjuncts.
Typical courses are 12 to 15 weekly sessions.

## Medicines
- SSRIs are first line: sertraline (50 to 200 mg) or escitalopram (10 to 20 mg). Start low to avoid early jitteriness; effect in two to four weeks; full effect by eight to twelve weeks.
- SNRIs: venlafaxine (75 to 225 mg) or duloxetine (60 to 120 mg); monitor blood pressure with venlafaxine.
- Pregabalin (150 to 600 mg) is licensed for GAD in Europe; it works quickly but carries misuse risk, especially with opioids.
- Buspirone, a 5 HT1A partial agonist, has a slower onset and no dependence.
- Hydroxyzine for short term use; quetiapine has evidence but metabolic effects limit its use.
- Benzodiazepines (clonazepam, alprazolam, lorazepam): only short term, for two to four weeks in crises, because of tolerance, dependence, cognitive effects and falls. In India, long term alprazolam and clonazepam use is common and should be tapered gradually where present.

## Duration and follow up
Continue an effective medicine for at least six to twelve months after response, then taper slowly. Review at two to four weeks, then regularly. Combine with psychological help where possible, and treat comorbid depression and substance use.

## Conclusion
GAD is managed in steps, from education to CBT or SSRIs and SNRIs, with benzodiazepines kept for short term use. Long enough treatment and relapse prevention are important because GAD is chronic.`,
    keyPoints: ["Assessment including medical causes and substance use", "Four steps of stepped care", "CBT components and applied relaxation", "SSRIs first line with doses", "SNRIs, pregabalin and buspirone", "Benzodiazepines short term only with reasons", "Duration of treatment"],
    visuals: [layers("Stepped care for GAD", "stack", [["Step 4: specialist care", "Complex or resistant"], ["Step 3: CBT, applied relaxation or medicine", "Marked impairment"], ["Step 2: guided self help, groups", "Not improving"], ["Step 1: identify, educate, monitor", "Everyone"]])],
    module: "anxiety",
    ref: "NICE CG113 GAD stepped care; Baldwin BAP anxiety 2014; Maudsley anxiety",
  },
  {
    id: "cpsy-l03-003",
    subject: "clinical-psychiatry",
    topic: "disaster-mental-health",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss mental health and psychosocial support after disasters, with reference to India.",
    plan: ["Psychological reactions after disasters and their course", "Who is vulnerable", "Psychological first aid and the IASC pyramid", "What not to do", "Indian experience and guidelines", "Conclusion"],
    answer: `## Psychological reactions
Disasters (earthquakes, floods, cyclones, pandemics, terror attacks) cause distress in almost everyone affected. Most reactions are normal and temporary: fear, grief, sleep problems, irritability, poor concentration and intrusive memories. A minority develop disorders:
- Acute stress reaction in the first days.
- PTSD, depression, prolonged grief, anxiety disorders and increased alcohol and tobacco use in the following months.
- Relapse of pre existing mental illness when medicines and services are disrupted.
Communities often pass through phases: heroic and honeymoon phases of mutual help, then disillusionment as aid falls short, then gradual reconstruction.

## Vulnerable groups
Children, older people, women (including risks of gender based violence in shelters), people with disabilities or existing mental illness, those who lost family or homes, rescue workers and the poor.

## Psychological first aid
WHO's psychological first aid follows three actions:
- Look: check for safety, urgent needs and people with serious distress.
- Listen: approach people, ask about needs and concerns, listen without pressure to talk, help people feel calm.
- Link: help people meet basic needs, access services and information, connect with loved ones and social support.
It promotes safety, calm, connectedness, self efficacy and hope (Hobfoll's five principles).

## The IASC pyramid
The Inter Agency Standing Committee guidelines describe layered services:
- Base: basic services and security delivered in ways that protect dignity.
- Community and family supports: tracing families, rituals, schools, women's and youth groups.
- Focused, non specialised supports: trained health and community workers giving basic emotional and practical help.
- Top: specialised services by mental health professionals for people with severe problems.

## What not to do
- Single session psychological debriefing that pushes people to recount the trauma is not recommended and may increase PTSD.
- Do not label normal distress as illness or start benzodiazepines routinely.
- Avoid one off programmes that leave when cameras leave.

## Indian experience and guidelines
- Major disasters include the Odisha super cyclone of 1999, the Gujarat earthquake of 2001, the Indian Ocean tsunami of 2004, the Uttarakhand floods of 2013, the Kerala floods of 2018 and the COVID 19 pandemic.
- NIMHANS developed community based psychosocial care models, training local workers and teachers.
- The National Disaster Management Authority issued guidelines on psychosocial support and mental health services in disasters, which build psychosocial care into disaster plans.
- During COVID 19, NIMHANS and others ran helplines, and Tele MANAS later created a permanent national tele mental health service.
- Community structures (panchayats, self help groups, religious bodies) and cultural rituals for the dead help recovery.

## Later care
Screen for PTSD, depression and substance use after a few weeks; provide trauma focused CBT or EMDR for PTSD, and continue treatment for people with existing illness.

## Conclusion
Most disaster survivors recover with practical, social and emotional support. Psychological first aid and the layered IASC approach, with specialist care for the few who develop disorders, are the evidence based model, and India has built this into its disaster management framework.`,
    keyPoints: ["Normal reactions versus disorders", "Phases of community response", "Vulnerable groups", "PFA look, listen, link", "IASC pyramid four layers", "Debriefing not recommended", "Indian disasters, NIMHANS and NDMA guidelines", "Tele MANAS and later screening"],
    visuals: [layers("IASC pyramid", "pyramid", [["Specialised services", "Psychiatrists and psychologists for severe problems"], ["Focused non specialised supports", "Trained health and community workers"], ["Community and family supports", "Family tracing, rituals, schools, groups"], ["Basic services and security", "Food, shelter, water, safety with dignity"]])],
    module: "trauma",
    ref: "WHO PFA 2011; IASC MHPSS guidelines 2007; NDMA psychosocial guidelines 2009; Hobfoll 2007; Rose Cochrane debriefing",
  },
  {
    id: "cpsy-l03-004",
    subject: "clinical-psychiatry",
    topic: "somatic-primary-care",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "How would you manage a patient with persistent physical symptoms without an adequate medical explanation in primary care?",
    plan: ["Size of the problem in India", "Principles of engagement", "Reattribution and explanation", "Specific treatments", "What to avoid and conclusion"],
    answer: `## Size of the problem
Persistent physical symptoms such as aches, burning, fatigue, dizziness and abdominal discomfort, without adequate medical explanation, are among the commonest reasons for primary care visits. In India, common mental disorders very often present this way, and patients may go from doctor to doctor, collect many tests and take many medicines, including injections and tonics.

## Principles of engagement
- Take the symptoms seriously: they are real and distressing.
- Take a full history including psychosocial stressors, mood, anxiety, sleep and substance use; examine the patient properly.
- Order reasonable investigations once, explain the results, and then avoid repeating them without new findings.
- One consistent doctor, with regular scheduled appointments rather than visits only when symptoms worsen.

## Explanation and reattribution
Goldberg's reattribution model has three stages:
- Feeling understood: full history of symptoms, explore the patient's beliefs and fears, brief physical examination.
- Broadening the agenda: feed back the results, acknowledge the reality of symptoms, and move to the role of stress, mood and life events.
- Making the link: explain how emotions affect the body (muscle tension causing pain, anxiety causing palpitations, poor sleep worsening fatigue), using the patient's own experiences, for example symptoms worsening after family arguments.
A positive explanation ("your nervous system has become over sensitive, like a car alarm that goes off too easily") is better than "nothing is wrong".

## Specific treatments
- Treat depression and anxiety: SSRIs; SNRIs (duloxetine) or low dose amitriptyline when pain is prominent.
- CBT: addressing catastrophic interpretations, reducing checking and reassurance seeking, graded activity, and problem solving.
- Graded exercise and physiotherapy, sleep hygiene, relaxation and yoga.
- Address social stressors: family conflict, financial problems, domestic violence (ask directly and privately).
- Task shared programmes using WHO mhGAP training help primary care doctors in India manage common mental disorders.

## What to avoid
- Repeated tests, referrals and treatments that reinforce illness beliefs.
- Labelling symptoms as "imaginary" or "all in the mind".
- Long term benzodiazepines, multivitamins and injections given only to satisfy the patient.
- Missing a real medical illness: re-examine when symptoms change.

## Conclusion
Persistent physical symptoms are best managed through a trusting relationship with one doctor, a positive explanation that links body and emotion, treatment of underlying depression and anxiety, and avoidance of unnecessary tests.`,
    keyPoints: ["Common in Indian primary care", "Take symptoms seriously and examine", "Limit investigations after a reasonable set", "Scheduled visits with one doctor", "Goldberg's three stage reattribution", "Positive explanation", "Antidepressants, CBT and graded activity", "What to avoid including long term benzodiazepines"],
    visuals: [chain("Goldberg's reattribution", [["Feeling understood", "Full history, explore fears, examine"], ["Broadening the agenda", "Results explained, stress and mood explored"], ["Making the link", "How emotions change body sensations"]])],
    module: "more-disorders",
    ref: "Goldberg 1989 reattribution; WHO mhGAP; Patel on somatic presentation in India; NICE persistent physical symptoms",
  },
  {
    id: "cpsy-l03-005",
    subject: "clinical-psychiatry",
    topic: "functional-seizures",
    marks: 5,
    difficulty: 3,
    exams: ["md-psychiatry"],
    question: "Write short notes on how to distinguish functional (dissociative) seizures from epileptic seizures.",
    plan: ["Why the distinction matters", "Comparison table of signs", "Investigations", "Management after diagnosis"],
    answer: `## Why it matters
Functional or dissociative seizures (also called psychogenic non epileptic seizures) are attacks resembling epilepsy without epileptic brain activity. About 20 to 30 percent of patients referred to epilepsy centres for refractory seizures have them, and many receive unnecessary anti epileptic drugs, emergency intubation and admissions. About 10 to 20 percent of people with functional seizures also have epilepsy.

## Clinical features
| Feature | Functional seizure | Epileptic seizure (generalised tonic clonic) |
| Onset | Gradual, often in front of others | Sudden, any setting |
| Duration | Often longer than two minutes, waxing and waning | Usually under two minutes |
| Eyes | Closed, resist opening | Open |
| Movements | Asynchronous, side to side head movement, pelvic thrusting, arching | Synchronous tonic then clonic phases |
| Vocalisation | Crying or talking during the attack | Initial cry only |
| Tongue biting | Tip of tongue, if any | Side of tongue |
| After the attack | Rapid recovery, may recall events, crying | Confusion, drowsiness, headache |
| From sleep | From apparent sleep, but EEG shows wakefulness | From true sleep |
No single sign is diagnostic; injury and incontinence can occur in both.

## Investigations
- Video EEG capturing a typical event is the gold standard.
- Smartphone videos recorded by family are very useful.
- Serum prolactin raised 10 to 20 minutes after a generalised tonic clonic or complex partial seizure supports epilepsy.
- Normal interictal EEG does not exclude epilepsy.

## Management
Explain the diagnosis clearly and positively, taper unnecessary anti epileptic drugs (under neurology care), offer CBT focused on warning signs, grounding and avoidance, treat trauma, depression and anxiety, and guide family responses.

## Conclusion
Careful history, eyewitness video and video EEG separate functional from epileptic seizures; a confident diagnosis allows effective psychological treatment.`,
    keyPoints: ["Frequency in epilepsy clinics and coexistence with epilepsy", "Comparison table with at least six features", "No single sign diagnostic", "Video EEG gold standard", "Prolactin and home video", "Positive explanation and CBT"],
    module: "more-disorders",
    ref: "LaFrance 2013 ILAE PNES; Avbersek and Sisodiya 2010 signs; Goldstein CODES trial 2020",
  },
  {
    id: "cpsy-l03-006",
    subject: "clinical-psychiatry",
    topic: "tourette",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe tic disorders and Tourette's disorder: clinical features, comorbidity, aetiology and management.",
    plan: ["Define tics and their types", "DSM-5-TR tic disorders", "Course and comorbidity", "Aetiology", "Management: behavioural and medicines", "Conclusion"],
    answer: `## Tics
A tic is a sudden, rapid, recurrent, non rhythmic motor movement or vocalisation. Tics are often preceded by a premonitory urge (an itch or pressure) and followed by relief, can be briefly suppressed, worsen with stress, tiredness and excitement, and lessen during focused activity and sleep.
- Simple motor: blinking, grimacing, shoulder shrugging.
- Complex motor: touching, jumping, copropraxia (obscene gestures), echopraxia.
- Simple vocal: sniffing, throat clearing, grunting.
- Complex vocal: words, phrases, coprolalia (obscene words, in only about 10 to 20 percent), echolalia, palilalia (repeating one's own words).

## DSM-5-TR tic disorders
| Disorder | Requirements |
| Tourette's disorder | Multiple motor and at least one vocal tic, not necessarily at the same time, for more than one year since the first tic |
| Persistent (chronic) motor or vocal tic disorder | Motor or vocal tics, but not both, for more than one year |
| Provisional tic disorder | Tics for less than one year |
All require onset before age 18 and exclusion of substances and medical conditions (Huntington disease, post viral encephalitis).

## Course and comorbidity
Transient tics affect up to 1 in 5 children; Tourette's disorder affects about 0.3 to 0.8 percent of children, three to four times more boys. Onset is usually at 4 to 6 years, peak severity at 10 to 12, and most improve markedly by late adolescence. Comorbidity is the rule: ADHD in about half, OCD or obsessive compulsive symptoms in about a third, anxiety, learning problems, rage attacks and self injurious tics. Comorbid conditions often cause more impairment than the tics.

## Aetiology
- Genetic: strongly familial with high heritability and polygenic risk shared with OCD and ADHD.
- Neurobiological: dysfunction of cortico striato thalamo cortical circuits and dopamine hypersensitivity in the striatum (dopamine blockers reduce tics; stimulants may transiently worsen them).
- Environmental: perinatal problems, maternal smoking; the PANDAS hypothesis of post streptococcal autoimmunity remains debated.

## Management
- Psychoeducation for child, family and school: tics are involuntary, not bad behaviour; avoid telling the child to stop; most improve with age. Many need no other treatment.
- Comprehensive behavioural intervention for tics (CBIT), based on habit reversal training: awareness training, a competing response to the premonitory urge, and functional analysis of triggers. It is first line for impairing tics.
- Medicines when tics are severe or impairing:
- Alpha 2 agonists (clonidine, guanfacine), especially with ADHD.
- Aripiprazole (approved for Tourette's in the USA), risperidone, haloperidol and pimozide (ECG monitoring).
- Botulinum toxin for focal tics; topiramate in some cases.
- Treat ADHD (methylphenidate does not usually worsen tics in most children) and OCD.
- Deep brain stimulation for severe, resistant adult cases.

## Conclusion
Tic disorders are common, usually improve in adolescence and are often accompanied by ADHD and OCD. Education and behavioural therapy come first, with medicines for severe tics.`,
    keyPoints: ["Definition with premonitory urge and suppressibility", "Simple and complex motor and vocal tics", "Coprolalia minority", "DSM-5-TR three disorders with one year and age 18 rules", "Course and comorbidity with ADHD and OCD", "CSTC and dopamine aetiology", "CBIT first line", "Alpha 2 agonists and antipsychotics"],
    visuals: [tree("Tic disorders in DSM-5-TR", [["Tic disorders", "Onset before 18", -1], ["Tourette's disorder", "Motor and vocal, over one year", 0], ["Persistent motor or vocal", "One type only, over one year", 0], ["Provisional", "Under one year", 0]])],
    module: "child",
    ref: "DSM-5-TR tic disorders; Piacentini 2010 CBIT trial; European ESSTS guidelines 2021",
  },
  {
    id: "cpsy-l03-007",
    subject: "clinical-psychiatry",
    topic: "school-refusal",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on school refusal.",
    plan: ["Definition and difference from truancy", "Causes and functions", "Assessment", "Management"],
    answer: `## Definition
School refusal is a child's difficulty attending school, or staying there, due to emotional distress, usually anxiety or depression. It is not a diagnosis but a presenting problem.

## Difference from truancy
| School refusal | Truancy |
| Child stays at home with parents' knowledge | Child hides absence from parents |
| Anxiety, tears, bodily complaints on school mornings | Little anxiety |
| Usually good conduct and wants to do well | Often conduct problems, academic disinterest |
| Linked to anxiety and depressive disorders | Linked to conduct disorder |

## Causes and functions
Underlying conditions include separation anxiety disorder (younger children), social anxiety, specific fears, depression, bullying, learning difficulties and family stress. Kearney described four functions that keep refusal going: avoiding school related negative feelings; escaping social or evaluative situations; getting attention from parents; and getting tangible rewards at home (television, games). In India, examination pressure, tuition burden, harsh teachers and bullying are common triggers.

## Assessment
Interview child, parents and teachers; screen for anxiety, depression, learning disorder and abuse; ask about bullying; physical examination for frequent abdominal pain and headaches, avoiding excessive tests.

## Management
- Early return to school is the main goal; the longer the absence, the harder the return.
- Graded return plan agreed with the school (part days, a trusted teacher, a quiet place).
- CBT for the child: anxiety management, exposure, social skills.
- Parent training: calm, firm morning routines, reduce rewards at home during school hours, praise attendance.
- Treat underlying disorders; SSRIs for severe anxiety or depression in older children.

## Conclusion
School refusal is an anxiety driven problem distinct from truancy; prompt, coordinated return to school with CBT and parent and school involvement works best.`,
    keyPoints: ["Definition", "Table separating from truancy", "Underlying disorders", "Kearney's four functions", "Indian triggers", "Early graded return with school and parents", "CBT and treatment of underlying disorder"],
    module: "child",
    ref: "Kearney and Silverman functional model; Heyne school refusal CBT",
  },
  {
    id: "cpsy-l03-008",
    subject: "clinical-psychiatry",
    topic: "selective-mutism",
    marks: 5,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write short notes on selective mutism.",
    plan: ["Definition and criteria", "Features and associations", "Differential", "Treatment"],
    answer: `## Definition and criteria
Selective mutism is a consistent failure to speak in specific social situations where speaking is expected (such as school), despite speaking normally in other situations (such as at home). DSM-5-TR criteria:
- Lasts at least one month, not limited to the first month of school.
- Interferes with education, work or social communication.
- Not due to lack of knowledge of, or comfort with, the spoken language.
- Not better explained by a communication disorder, and not occurring only during autism, schizophrenia or another psychotic disorder.
It is classified as an anxiety disorder in DSM-5-TR.

## Features and associations
Onset is usually before age five, but it often becomes obvious when school starts. Prevalence is about 0.03 to 1 percent. Most children have marked social anxiety and shyness; some have speech and language delays. Children may communicate with gestures, nodding or whispering. In bilingual and migrant families, children may be silent when learning a new language; this alone is not selective mutism.

## Differential diagnosis
Normal shyness, adjustment to a new language, autism spectrum disorder, language disorder, hearing impairment, intellectual disability and, rarely, trauma.

## Treatment
- Behavioural approaches: stimulus fading (gradually bringing new people into situations where the child already speaks), shaping (rewarding gradual steps from gestures to whispers to speech), and positive reinforcement; avoid pressure or punishment.
- CBT for social anxiety in older children.
- School collaboration: a key adult, small group activities, no forced public speaking at first.
- Speech and language therapy if needed.
- SSRIs such as fluoxetine for severe or persistent cases in older children.

## Conclusion
Selective mutism is an anxiety disorder of situational silence; gentle, graded behavioural work with home and school usually helps.`,
    keyPoints: ["Definition with speaking in other settings", "One month not limited to first month of school", "Language exclusion", "Strong link to social anxiety", "Differential", "Stimulus fading and shaping"],
    module: "child",
    ref: "DSM-5-TR selective mutism; Oerbeck 2014 trial",
  },
  {
    id: "cpsy-l03-009",
    subject: "clinical-psychiatry",
    topic: "enuresis",
    marks: 5,
    difficulty: 1,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Write short notes on nocturnal enuresis.",
    plan: ["Definition and types", "Epidemiology and causes", "Assessment", "Treatment"],
    answer: `## Definition and types
DSM-5-TR enuresis is repeated voiding of urine into the bed or clothes, at least twice a week for at least three months or with significant distress or impairment, in a child of at least five years (chronological or developmental age), not due to a substance or medical condition. Types: nocturnal only, diurnal only, or both. Primary enuresis means the child has never been dry for six months; secondary means it returns after a dry period.

## Epidemiology and causes
About 5 to 10 percent of five year olds, 3 to 5 percent of ten year olds and about 1 percent of older adolescents wet the bed; boys are affected more. About 15 percent of children become dry each year without treatment.
Causes:
- Genetic: strong family history (high risk if both parents were enuretic).
- Nocturnal polyuria due to low night time antidiuretic hormone.
- Small functional bladder capacity or overactive bladder.
- Difficulty waking to bladder signals.
- Constipation, urinary infection, diabetes, sleep apnoea.
- Secondary enuresis often follows stress: a new sibling, school change, family conflict or abuse.

## Assessment
History and bladder diary, urine examination for infection and glucose, examination of the abdomen and spine, check for constipation; screen for ADHD, emotional problems and stressors.

## Treatment
- Reassurance and education; no punishment or shaming.
- Simple measures: fluids spread through the day, less in the evening, voiding before bed, star charts for dry nights.
- Enuresis alarm (bell and pad, based on Mowrer's conditioning): the most effective long term treatment, with success in about two thirds and lower relapse; needs motivated families and two to three months.
- Desmopressin: quick effect, useful for camps and short stays, but relapse is common after stopping; restrict fluids at night to avoid hyponatraemia.
- Imipramine: third line because of cardiac toxicity in overdose.
- Treat constipation and infections.

## Conclusion
Nocturnal enuresis is common and usually self limiting; the alarm is the most effective treatment and desmopressin gives quick relief.`,
    keyPoints: ["DSM-5-TR criteria with age five and frequency", "Primary versus secondary", "Prevalence and spontaneous remission", "Causes including low ADH", "Bladder diary and urine tests", "Alarm as most effective; desmopressin; imipramine third line"],
    module: "child",
    ref: "DSM-5-TR enuresis; NICE CG111; Glazener Cochrane alarm review",
  },
  {
    id: "cpsy-l03-010",
    subject: "clinical-psychiatry",
    topic: "conduct-disorder",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe conduct disorder and oppositional defiant disorder: clinical features, risk factors, course and management.",
    plan: ["Definitions and DSM-5-TR criteria", "Subtypes and specifiers", "Risk factors", "Course: Moffitt's two pathways", "Management with evidence and Indian legal context", "Conclusion"],
    answer: `## Oppositional defiant disorder (ODD)
A pattern lasting at least six months of angry or irritable mood, argumentative or defiant behaviour, or vindictiveness, with at least four symptoms such as losing temper, being touchy, angry and resentful, arguing with adults, defying rules, deliberately annoying others, blaming others, and spitefulness. Symptoms appear with at least one person who is not a sibling. Severity depends on the number of settings.

## Conduct disorder (CD)
A repetitive and persistent pattern of behaviour violating the basic rights of others or major age appropriate rules, with at least three of fifteen criteria in the past twelve months (at least one in the past six months), from four groups:
- Aggression to people and animals: bullying, starting fights, using weapons, physical cruelty to people or animals, stealing with confrontation, forced sexual activity.
- Destruction of property: fire setting, other deliberate destruction.
- Deceitfulness or theft: breaking into homes or cars, lying to obtain goods, stealing without confrontation.
- Serious violation of rules: staying out at night before 13, running away overnight, truancy before 13.

Subtypes: childhood onset (at least one criterion before age 10), adolescent onset, and unspecified. Specifier: with limited prosocial emotions (callous unemotional traits: lack of remorse, callousness, unconcern about performance, shallow affect).

## Epidemiology
ODD affects about 3 percent of children, CD about 2 to 10 percent, more in boys. ADHD, learning disorders, depression and substance use are common comorbidities.

## Risk factors
- Child: difficult temperament, low IQ, language delay, ADHD, callous unemotional traits, genetic loading.
- Family: harsh and inconsistent discipline, poor supervision, parental conflict, domestic violence, parental substance use or criminality, abuse and neglect.
- Social: poverty, peer delinquency, violent neighbourhoods.
Patterson's coercion theory explains how parent and child escalate negative behaviour, each being reinforced when the other gives in.

## Course
Terrie Moffitt described two pathways:
- Life course persistent: early onset, neurodevelopmental problems and adversity, with high risk of adult antisocial personality disorder, crime, substance use and poor health.
- Adolescence limited: onset in teens, influenced by peers, usually desisting in adulthood.
Early onset and callous unemotional traits predict a worse outcome. About 40 percent of children with CD develop antisocial personality disorder as adults.

## Management
- Parent management training is the core treatment for children: programmes such as Incredible Years and Triple P teach praise, clear commands, consistent consequences and time out. Parent child interaction therapy for young children.
- For adolescents: multisystemic therapy and functional family therapy, working with family, school and peers.
- School interventions and social skills and problem solving training for the child.
- Treat comorbid ADHD (stimulants also reduce aggression), depression and learning problems.
- Medicines are not first line; risperidone may be used short term for severe aggression.
- Safeguarding when abuse is present.
- In India, children in conflict with law come under the Juvenile Justice (Care and Protection of Children) Act 2015, with Juvenile Justice Boards and an emphasis on rehabilitation; children aged 16 to 18 accused of heinous offences may be assessed for trial as adults.

## Conclusion
ODD and CD are common disruptive behaviour disorders with strong family and social roots. Early parent training and family based interventions are the most effective treatments and can prevent adult antisocial outcomes.`,
    keyPoints: ["ODD four symptoms for six months", "CD three of fifteen in four groups", "Childhood versus adolescent onset", "Limited prosocial emotions specifier", "Risk factors and coercion theory", "Moffitt's two pathways", "Parent management training and MST", "JJ Act 2015"],
    visuals: [compare("Moffitt's two pathways", ["Life course persistent", ["Starts in early childhood", "Neurodevelopmental problems, adversity", "Callous unemotional traits common", "High risk of adult antisocial outcomes"], "Persists"], ["Adolescence limited", ["Starts in teens", "Peer influence", "Normal early development", "Usually stops in adulthood"], "Desists"])],
    module: "child",
    ref: "DSM-5-TR disruptive behaviour disorders; Moffitt 1993; Patterson coercion theory; Henggeler MST; JJ Act 2015",
  },
];
