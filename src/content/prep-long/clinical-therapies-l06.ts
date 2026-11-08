import type { LongQA } from "@/lib/prep/long-types";
import { anchored, compare, layers, timeline, vis } from "./visual";

export const CLINICAL_THERAPIES_L06: LongQA[] = anchored([
  {
    id: "ther-l06-001",
    subject: "clinical-therapies",
    topic: "evidence-based-practice",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Critically discuss evidence based practice and empirically supported treatments in psychotherapy.",
    plan: ["Definitions", "Criteria for empirically supported treatments", "Hierarchy of evidence", "Critiques", "The three circle model and conclusion"],
    answer: `## Definitions
- Evidence based practice in psychology (EBPP), as defined by the American Psychological Association in 2006, is "the integration of the best available research with clinical expertise in the context of patient characteristics, culture and preferences".
- Empirically supported treatments (ESTs) are specific, manualised therapies shown to be effective for specific disorders in controlled research.

## Criteria for ESTs
The APA Division 12 task force, led by Dianne Chambless in the 1990s, set criteria:
- Well established treatments: at least two good between group experiments by different investigators showing superiority to placebo or another treatment, or equivalence to an established treatment, or a large series of single case experiments; using treatment manuals and clearly specified samples.
- Probably efficacious treatments: weaker but positive evidence, such as two trials better than a waiting list or trials from one research group.
Examples: exposure based therapies for phobias, ERP for OCD, CBT for panic disorder, trauma focused CBT for PTSD, DBT for borderline personality disorder, family based treatment for adolescent anorexia.

## Hierarchy of evidence
Systematic reviews and meta analyses of randomised controlled trials at the top, then individual RCTs, controlled studies without randomisation, cohort and case control studies, case series, and expert opinion. The GRADE system rates certainty of evidence. Efficacy (in ideal trial conditions) differs from effectiveness (in routine practice).

## Critiques
- Trials use selected patients without comorbidity, unlike real clinics.
- Manuals may reduce flexibility and attention to the relationship; therapist effects and common factors are neglected.
- Lack of research is not evidence of ineffectiveness; therapies that are harder to study (long term psychodynamic, humanistic) are disadvantaged.
- Allegiance effects and publication bias inflate results.
- Most evidence comes from Western, educated populations; generalisation to India and other cultures is uncertain.
- Outcome measures focus on symptoms rather than functioning or quality of life.
Supporters respond that ESTs protect patients from ineffective or harmful treatments and give clear training standards.

## The three circle model
EBPP integrates three elements:
- Best research evidence.
- Clinical expertise (assessment, formulation, relationship skills, monitoring progress).
- Patient characteristics, values, culture and preferences.
Routine outcome monitoring (measuring progress session by session) links research and practice and improves outcomes for patients who are not on track.

## Conclusion
Evidence based practice is broader than a list of approved treatments. Empirically supported treatments provide a strong starting point, but must be combined with clinical skill, cultural adaptation and the patient's own values.`,
    keyPoints: ["APA 2006 definition of EBPP", "EST definition", "Chambless criteria for well established and probably efficacious", "Examples of ESTs", "Hierarchy of evidence and efficacy versus effectiveness", "Critiques including external validity and culture", "Three circle model", "Routine outcome monitoring"],
    visuals: [layers("Hierarchy of evidence", "pyramid", [["Systematic reviews and meta analyses", "Pool many randomised trials, so chance and single-study quirks matter least"], ["Randomised controlled trials", "Random allocation balances known and unknown differences between groups"], ["Cohort and case control studies", "Follow or compare groups as they are, so other differences can explain the result"], ["Case series and reports", "Describe what happened to a few patients, with no comparison group"], ["Expert opinion", "Experience and reasoning without systematic data: useful, but the weakest evidence"]])],
    module: "therapies",
    ref: "APA Presidential Task Force 2006; Chambless and Ollendick 2001; Chambless and Hollon 1998; Sackett 1996",
  },
  {
    id: "ther-l06-002",
    subject: "clinical-therapies",
    topic: "eysenck-outcome",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Trace the history of psychotherapy outcome research from Eysenck's challenge to modern meta analyses. Does psychotherapy work?",
    plan: ["Eysenck 1952 and its impact", "Responses and spontaneous remission", "Smith and Glass meta analysis", "Later findings: effect sizes, comparisons, long term effects", "Current debates and conclusion"],
    answer: `## Eysenck's challenge
In 1952 Hans Eysenck reviewed studies of neurotic patients and concluded that about two thirds improved within two years whether or not they received psychotherapy, and that psychoanalysis appeared no better than no treatment. He relied on data on insurance claimants and state hospital discharges as a "spontaneous remission" baseline.

## Responses
Critics such as Allen Bergin showed that Eysenck's comparisons were biased: the control groups were not comparable, criteria for improvement varied, and reanalysis of the same data suggested a much lower spontaneous remission rate and a better effect of therapy. The controversy stimulated controlled trials and better methods.

## Smith and Glass meta analysis
In 1977 Mary Lee Smith and Gene Glass introduced meta analysis to psychology. Combining 375 studies, they found that the average treated person was better off than about 75 percent of untreated controls (an average effect size of about 0.68 to 0.85 in their analyses). They also found little difference between types of therapy, supporting the Dodo bird verdict.

## Later findings
- Meta analyses consistently show moderate to large effects of psychotherapy compared with no treatment (effect sizes often 0.5 to 0.8), comparable to many medical treatments.
- Lipsey and Wilson's review of meta analyses confirmed robust effects across psychological, educational and behavioural interventions.
- For depression and anxiety, psychotherapy is about as effective as medicines in the short term and often better at preventing relapse.
- Effects are smaller in high quality trials with active controls and after correcting for publication bias (Cuijpers' work on depression suggests effect sizes are often overestimated).
- Dose effect studies show about half of patients improve by around 8 to 16 sessions (Howard).
- About 5 to 10 percent of patients deteriorate, so monitoring matters.
- Therapist effects account for a small but important part of outcome.

## Current debates
- Specific versus common factors: whether technique matters beyond the relationship.
- Mechanisms of change: how therapies work.
- Effectiveness in routine care and in low resource settings.
- Cultural adaptation and task sharing.
- Long term outcomes and cost effectiveness.

## Conclusion
Eysenck's challenge was methodologically weak but productive. Decades of trials and meta analyses show that psychotherapy works, with moderate effects comparable to many medical treatments, though effects are sometimes overestimated and vary by therapist, patient and condition.`,
    keyPoints: ["Eysenck 1952 claim of two thirds spontaneous remission", "Methodological criticisms including Bergin", "Smith and Glass 1977, 375 studies, 75th percentile", "Little difference between therapies", "Moderate to large effect sizes", "Publication bias and Cuijpers", "Dose effect and deterioration", "Current debates"],
    visuals: [timeline("History of outcome research", [["Eysenck's challenge", "1952"], ["Bergin's reanalysis", "1970s"], ["Smith and Glass meta analysis", "1977"], ["Howard's dose effect study", "1986"], ["Large modern meta analyses", "2000s onward"]])],
    module: "therapies",
    ref: "Eysenck 1952 J Consult Psychol; Smith and Glass 1977 Am Psychol; Lipsey and Wilson 1993; Howard 1986; Cuijpers 2010 and 2019",
  },
  {
    id: "ther-l06-003",
    subject: "clinical-therapies",
    topic: "clinical-significance",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on clinical significance and the reliable change index.",
    plan: ["Statistical versus clinical significance", "Jacobson and Truax method", "Reliable change index formula", "Uses and limits"],
    answer: `## Statistical versus clinical significance
A statistically significant difference means a result is unlikely to be due to chance; it does not tell whether the change matters to the patient. With large samples, tiny differences become significant. Clinical significance asks whether a patient has changed meaningfully, for example, whether they have returned to normal functioning.

## Jacobson and Truax method
Neil Jacobson and Paula Truax in 1991 proposed two criteria for clinically significant change:
- The change is reliable: larger than would be expected from measurement error.
- The patient moves from the dysfunctional range into the functional range, using a cut off point, often where the distributions of the clinical and normal populations meet, or two standard deviations from the clinical mean.
Patients can then be classified as recovered (reliable change and crossed the cut off), improved (reliable change but not crossed), unchanged, or deteriorated (reliable worsening).

## Reliable change index
The RCI is the difference between pre and post scores divided by the standard error of the difference:
- RCI = (post score minus pre score) divided by the standard error of the difference.
- The standard error of the difference is based on the standard deviation of the measure and its test retest reliability.
- An RCI greater than 1.96 (in absolute value) indicates change unlikely to be due to measurement error at p below 0.05.

## Uses and limits
Used in trials, routine outcome monitoring (for example, NHS Talking Therapies uses reliable improvement and recovery), and single case studies. Limits: depends on the reliability of the measure and the norms used; symptom scores may not capture functioning or quality of life; cut offs vary between populations.

## Conclusion
Clinical significance and the RCI judge whether individual change is real and meaningful, complementing group statistics.`,
    keyPoints: ["Statistical versus clinical significance", "Jacobson and Truax 1991", "Two criteria: reliable change and cut off", "Recovered, improved, unchanged, deteriorated", "RCI formula and 1.96 threshold", "Uses and limits"],
    module: "therapies",
    ref: "Jacobson and Truax 1991 J Consult Clin Psychol; Clark 2018 IAPT reliable recovery",
  },
  {
    id: "ther-l06-004",
    subject: "clinical-therapies",
    topic: "process-research",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on psychotherapy process research and mechanisms of change.",
    plan: ["Outcome versus process research", "Process variables studied", "Methods to study mechanisms", "Key findings"],
    answer: `## Outcome versus process research
Outcome research asks whether a therapy works. Process research asks what happens in therapy and how change occurs: the interactions, techniques and experiences that lead to outcome. Mechanism research tests which factors explain the effect of a treatment.

## Process variables
- Relationship: therapeutic alliance, empathy, ruptures and repair.
- Therapist variables: adherence and competence in a model, interpersonal skills.
- Patient variables: engagement, homework completion, emotional experiencing, insight.
- Techniques: interpretations, cognitive restructuring, exposure.
- Change patterns: sudden gains (large improvement between two sessions, often after cognitive change, as described by Tang and DeRubeis), early response.

## Methods
- Session recordings rated with observer scales (Experiencing Scale, coding of change talk).
- Session by session measures linking changes in a proposed mediator (for example, negative thinking) to later symptom change.
- Mediation analysis in randomised trials: the mediator must change before the outcome, and the treatment effect must operate through it (Kazdin's criteria).
- Dismantling and additive designs, which remove or add components.
- Qualitative interviews about clients' experiences.

## Key findings
- Alliance predicts outcome across therapies.
- Change talk predicts outcome in motivational interviewing.
- Changes in catastrophic misinterpretations predict outcome in CBT for panic, and changes in psychological flexibility in ACT.
- Many proposed specific mechanisms have mixed support; the timing of change is often unclear.

## Conclusion
Process and mechanism research explain how therapy works, guiding training and the refinement of treatments.`,
    keyPoints: ["Process versus outcome research", "Process variables", "Sudden gains", "Methods including mediation and dismantling", "Kazdin's criteria", "Key findings and mixed support"],
    module: "therapies",
    ref: "Kazdin 2007 Annu Rev Clin Psychol; Tang and DeRubeis 1999; Orlinsky process outcome reviews",
  },
  {
    id: "ther-l06-005",
    subject: "clinical-therapies",
    topic: "deterioration-effects",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on negative effects of psychotherapy and routine outcome monitoring.",
    plan: ["Negative effects", "Causes", "Routine outcome monitoring", "Practical implications"],
    answer: `## Negative effects
Psychotherapy can harm. Estimates suggest that about 5 to 10 percent of adult patients get worse during therapy, and more in some groups. Negative effects include deterioration of symptoms, new symptoms, increased dependence on the therapist, strain in relationships, stigma, and harm from boundary violations. Some interventions are potentially harmful (Scott Lilienfeld's list includes single session critical incident debriefing, "scared straight" programmes for delinquents, recovered memory techniques, and conversion therapies).

## Causes
- Therapist factors: poor alliance, lack of empathy, rigid use of techniques, boundary violations, misdiagnosis.
- Patient factors: severe illness, personality disorder, ongoing stressors.
- Treatment mismatch or premature focus on traumatic material without stabilisation.
- Therapists often fail to notice deterioration: in one study, therapists predicted very few of the clients who actually worsened.

## Routine outcome monitoring
Routine outcome monitoring (ROM) means giving brief measures (for example, the Outcome Questionnaire 45, PHQ 9, GAD 7, or the Outcome Rating Scale and Session Rating Scale) at each session and comparing progress with expected recovery curves. Michael Lambert showed that feeding this information back to therapists, with alerts for "not on track" clients and clinical support tools (checking the alliance, motivation, social support and need for medicines), reduces deterioration and improves outcomes for at risk clients.

## Practical implications
Ask about side effects of therapy, measure progress regularly, discuss lack of progress openly, use supervision, and avoid unproven or potentially harmful methods.

## Conclusion
Psychotherapy is powerful enough to harm; routine monitoring and feedback help therapists catch deterioration early.`,
    keyPoints: ["Rates of deterioration", "Types of negative effects", "Potentially harmful treatments", "Therapists miss deterioration", "Lambert's feedback systems", "Practical steps"],
    module: "therapies",
    ref: "Lambert 2013; Lilienfeld 2007 Perspect Psychol Sci potentially harmful therapies; Hannan 2005 therapist prediction",
  },
  {
    id: "ther-l06-006",
    subject: "clinical-therapies",
    topic: "dose-effect",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on the dose effect relationship in psychotherapy.",
    plan: ["Howard's study", "The phase model", "Later findings", "Implications"],
    answer: `## Howard's study
Kenneth Howard and colleagues in 1986 combined data on more than 2400 patients and found a negatively accelerating relationship between the number of sessions and the percentage of patients improved: about 15 percent improved before the first session, about half by eight sessions, about three quarters by 26 sessions, and about 85 percent by one year. Improvement is fastest early and then slows.

## The phase model
Howard proposed three sequential phases of change:
- Remoralisation: restored hope and wellbeing, often in the first few sessions.
- Remediation: reduction of symptoms.
- Rehabilitation: change in long standing patterns of behaviour and functioning, which takes longer.

## Later findings
- The "good enough level" model suggests that patients stay in therapy until they have improved enough, so those who need more sessions are different from those who need fewer; average dose figures should not be applied rigidly.
- Different problems need different doses: acute distress responds fast; personality and chronic problems need more.
- Early response predicts outcome.

## Implications
Plan treatment length to the problem; monitor progress to judge when to continue or stop; in services with session limits, brief therapies can help many people, but some need longer care.

## Conclusion
The dose effect relationship shows rapid early gains and slower later change, guiding decisions about how long therapy should last.`,
    keyPoints: ["Howard 1986 figures", "Negatively accelerating curve", "Remoralisation, remediation, rehabilitation", "Good enough level model", "Problem specific doses", "Implications for planning"],
    visuals: [vis("curve", { kind: "forgetting", title: "Howard's study: fast early change that then levels off" }, "The shape is similar: big early change, then slower gains.")],
    module: "therapies",
    ref: "Howard 1986 Am Psychol; Howard 1993 phase model; Barkham 2006 good enough level",
  },
  {
    id: "ther-l06-007",
    subject: "clinical-therapies",
    topic: "single-case-design",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Describe single case experimental designs and their use in clinical psychology.",
    plan: ["Definition and rationale", "Basic features", "Designs: AB, ABAB, multiple baseline, alternating treatments, changing criterion", "Analysis", "Strengths, limits and conclusion"],
    answer: `## Definition and rationale
Single case experimental designs (SCEDs) study one person (or a small number) intensively over time, with repeated measurement and systematic changes in conditions, to show whether an intervention causes change. They suit clinical practice, rare conditions, individual tailoring and early testing of new treatments, and they are part of the evidence base for ESTs.

## Basic features
- A clearly defined target behaviour or symptom (for example, number of panic attacks a day, hair pulling episodes, self injury).
- Repeated, reliable measurement throughout.
- A baseline phase (A) long enough to show a stable pattern.
- An intervention phase (B).
- Replication of effects within or across cases to rule out alternative explanations.

## Designs
| Design | Description | Use |
| AB | Baseline then treatment | Simple, but cannot rule out other causes |
| ABAB (reversal or withdrawal) | Baseline, treatment, withdrawal, treatment again | Strong evidence if behaviour changes each time; unsuitable if the effect cannot reverse or withdrawal is unethical |
| Multiple baseline | Treatment introduced at different times across behaviours, settings or people | Avoids withdrawal; change occurs only when treatment starts in each line |
| Alternating treatments | Two treatments alternated rapidly | Compares treatments in one person |
| Changing criterion | Target criterion changed step by step (for example, cigarettes allowed per day) | Behaviour tracks each new criterion |

## Example
A child with school refusal: days attended per week are recorded for three weeks (A), then graded exposure and parent training start (B). Attendance rises only after B; a multiple baseline across three children starting at different times strengthens the conclusion.

## Analysis
- Visual analysis of graphs: level, trend, variability, immediacy of effect and overlap between phases.
- Statistical methods: percentage of non overlapping data, Tau U, randomisation tests and multilevel models.
- Standards (What Works Clearinghouse) require enough data points per phase and at least three demonstrations of effect.

## Strengths and limits
Strengths: links research and practice, flexible, needs few participants, allows fine grained tracking of change, ethical for individual care. Limits: generalisation to other people is uncertain without replication; carryover and order effects; autocorrelation in data complicates statistics; reversal designs can be unethical.

## Conclusion
Single case designs provide rigorous evidence of change in individuals through repeated measurement and replication, and are valuable both in research and in everyday evidence based practice.`,
    keyPoints: ["Definition and rationale", "Target, repeated measurement, baseline, replication", "AB and ABAB with limits", "Multiple baseline", "Alternating treatments and changing criterion", "Clinical example", "Visual and statistical analysis", "Strengths and limits"],
    visuals: [compare("ABAB design and multiple baseline design", ["ABAB", ["Baseline, treatment, withdraw, treatment", "Effect must reverse", "Ethical concerns with withdrawal"], "Strong when behaviour reverses"], ["Multiple baseline", ["Treatment starts at different times", "No withdrawal needed", "Change follows each start"], "Ethical and flexible"], "Designs")],
    module: "research-methods",
    ref: "Barlow, Nock and Hersen 2009 Single Case Experimental Designs; Kazdin 2011; Kratochwill WWC standards 2010",
  },
  {
    id: "ther-l06-008",
    subject: "clinical-therapies",
    topic: "cultural-adaptation",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Discuss the cultural adaptation of psychotherapy for Indian clients.",
    plan: ["Why adaptation is needed", "Frameworks for adaptation", "Areas of adaptation with Indian examples", "Evidence", "Risks and conclusion"],
    answer: `## Why adaptation is needed
Most evidence based therapies were developed in Western, individualistic settings. Indian clients often differ in family structure and decision making, ways of expressing distress (somatic idioms), explanatory models (karma, black magic, planetary influences, weakness), religious and spiritual practices, expectations of the therapist (as a guide or expert), language, literacy, gender roles, caste and economic circumstances. Without adaptation, therapies may be less acceptable and effective.

## Frameworks
- Bernal's ecological validity model: language, persons (therapist client match), metaphors, content, concepts, goals, methods and context.
- Distinction between surface adaptations (language, examples, pictures) and deep adaptations (core concepts, values and family involvement).
- Kleinman's explanatory model questions and the DSM-5-TR Cultural Formulation Interview for assessment.

## Areas of adaptation with Indian examples
- Language and idioms: using local words for distress ("tension", "ghabrahat", "man nahi lagta"), proverbs and stories.
- Family: involving spouses, parents or in laws in sessions and homework; framing goals as benefiting the family; respecting hierarchy while protecting the individual.
- Therapist role: a more directive, warm and expert stance (as in Neki's guru chela model), with clear advice and structure.
- Somatic focus: starting with bodily symptoms and linking them to stress.
- Religion and spirituality: using prayer, meditation, the Bhagavad Gita's ideas on detached action, or yoga, if the client values them.
- Format: shorter sessions, fewer sessions, flexible timing, home visits, group formats, lay counsellors.
- Literacy: pictorial worksheets, verbal homework, mobile phone reminders.
- Social problems: debt, domestic violence, unemployment and caste discrimination addressed with problem solving and linkage to services.

## Evidence
- Meta analyses show culturally adapted therapies are more effective than unadapted versions, with moderate effect sizes.
- Indian examples: the Healthy Activity Programme (behavioural activation) and Counselling for Alcohol Problems in Goa; the Thinking Healthy Programme adapted from Pakistan for perinatal depression in India; family interventions for schizophrenia adapted at NIMHANS and Chennai; PASS Plus for autism.

## Risks
Stereotyping clients by assumed culture, losing the active ingredients of therapy, and ignoring diversity within India (urban and rural, regions, religions, generations). Adaptation should be guided by the individual client.

## Conclusion
Cultural adaptation makes therapy more acceptable and effective for Indian clients by fitting language, family, beliefs and practical realities, while keeping the core mechanisms of change.`,
    keyPoints: ["Reasons for adaptation", "Bernal's ecological validity model", "Surface versus deep adaptation", "Language and idioms", "Family involvement and therapist role", "Religion, format and literacy adaptations", "Evidence and Indian programmes", "Risks of stereotyping"],
    visuals: [compare("Surface and deep adaptation", ["Surface", ["Translation and local examples", "Pictures and stories", "Matching therapist language"], "Easier to do"], ["Deep", ["Family as part of the work", "Explanatory models respected", "Goals framed in shared values"], "Changes the fit of the whole therapy"], "Frameworks")],
    module: "therapies",
    ref: "Bernal 1995 ecological validity model; Hall 2016 meta-analysis; Patel 2017 HAP; Rahman 2008; Neki 1973",
  },
  {
    id: "ther-l06-009",
    subject: "clinical-therapies",
    topic: "combined-treatment",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Write short notes on combining medicines with psychotherapy.",
    plan: ["Rationale", "Evidence by disorder", "Possible problems", "Practical points"],
    answer: `## Rationale
Medicines and psychotherapy act through different routes: medicines can reduce symptoms quickly and make therapy possible, while psychotherapy teaches skills that reduce relapse after medicines stop. Combination may also improve adherence and address different symptoms.

## Evidence by disorder
- Depression: combined treatment is more effective than either alone in moderate to severe and chronic depression (for example, the CBASP and nefazodone trial), with modest added benefit in milder depression.
- Schizophrenia and bipolar disorder: medicines are essential; adding family interventions, CBTp and psychoeducation reduces relapse.
- OCD: SSRIs plus ERP help in severe OCD, though ERP alone is often as effective in mild to moderate cases.
- Panic disorder: combined treatment gives better short term results, but in one large trial patients who stopped imipramine after combined treatment relapsed more than those who had CBT alone.
- PTSD: limited evidence that combination is better than trauma focused therapy alone.
- Substance use: medicines (OST, naltrexone) work best with psychosocial support.

## Possible problems
- Benzodiazepines may interfere with exposure therapy by reducing fear activation and learning, and patients may attribute progress to the drug.
- Split treatment between psychiatrist and psychologist needs good communication.
- Patients may lose motivation for therapy once medicines relieve symptoms.

## Practical points
Choose combination based on severity, chronicity, preference and availability; coordinate between professionals; plan who will stop what and when; monitor progress.

## Conclusion
Combined treatment is often best for severe and chronic disorders, but benefits vary by disorder and some combinations need care.`,
    keyPoints: ["Rationale for combination", "Depression evidence including Keller CBASP", "Psychosocial add ons in schizophrenia and bipolar", "OCD and panic findings", "Benzodiazepines interfering with exposure", "Coordination of split treatment"],
    module: "therapies",
    ref: "Keller 2000 NEJM CBASP; Barlow 2000 JAMA panic; Cuijpers 2014 World Psychiatry combined treatment",
  },
  {
    id: "ther-l06-010",
    subject: "clinical-therapies",
    topic: "task-sharing-therapy",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Write short notes on psychological therapies delivered by non specialists.",
    plan: ["Rationale", "Examples", "Requirements", "Evidence and limits"],
    answer: `## Rationale
Low and middle income countries, including India, have very few trained psychologists and psychiatrists. Training non specialists (lay counsellors, community health workers, nurses, teachers) to deliver simplified, evidence based psychological therapies is a practical way to close the treatment gap.

## Examples
- Healthy Activity Programme (behavioural activation) and Counselling for Alcohol Problems (motivational and CBT based), delivered by lay counsellors in Goa.
- Thinking Healthy Programme for perinatal depression, delivered by lady health workers in Pakistan and adapted in India.
- Friendship Bench in Zimbabwe, where grandmothers deliver problem solving therapy.
- WHO's Problem Management Plus and group interpersonal therapy for distress in low resource and humanitarian settings.
- Atmiyata volunteers in Gujarat offering basic counselling and linkage.

## Requirements
- Simplified, manualised interventions focused on a few core skills.
- Selection of workers with good interpersonal skills, followed by competency based training.
- Regular supervision, often by peers with specialist support, and quality checks.
- Integration with primary care and referral pathways for severe illness and risk.
- Fair pay, recognition and manageable workload.

## Evidence and limits
Randomised trials show moderate effects for depression, anxiety, harmful drinking and perinatal depression, often with good cost effectiveness. Limits include drift in quality at scale, staff turnover, limited suitability for severe or complex cases, and the need for sustained funding.

## Conclusion
Non specialist delivered therapies are effective and essential for expanding mental health care in India, provided they are supported by training, supervision and referral systems.`,
    keyPoints: ["Rationale and treatment gap", "HAP and CAP in Goa", "Thinking Healthy and Friendship Bench", "PM+ and group IPT", "Requirements including supervision", "Evidence and limits"],
    module: "therapies",
    ref: "Patel 2017 Lancet HAP; Nadkarni 2017 CAP; Chibanda 2016 JAMA Friendship Bench; WHO PM+ 2016; Singla 2017 Annu Rev",
  },
]);
