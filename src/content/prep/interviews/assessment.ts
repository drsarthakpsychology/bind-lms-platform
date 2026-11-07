import type { InterviewQuestion } from "@/lib/prep/types";
import { ivkit } from "../qb5-kit";

/** Mock interview bank · choosing and interpreting tests. Ordered foundation to advanced. */
const iv = ivkit("assessment", ["mcp-entrance", "ma-semester"], "assessment");

const ITEMS: InterviewQuestion[] = [
  iv("iv-asm-001", 1,
    "What is the difference between an objective and a projective personality test? Give examples.",
    [
      "What are the main criticisms of projective tests?",
      "When would you still use a projective test?",
      "How is the MMPI scored?",
    ],
    "Objective personality tests use structured items with fixed response options, such as true or false, or rating scales, and are scored against standard keys and norms, so scoring does not depend much on the examiner's judgment. Examples are the MMPI-2 and MMPI-2-RF, the 16PF, the NEO Personality Inventory and the Eysenck Personality Questionnaire. Their strengths are good reliability, norms and validity scales that detect response styles. Their weaknesses are that people can fake or present themselves in a favourable light, and they depend on reading level and self-awareness. Projective tests present ambiguous stimuli, such as inkblots or pictures, and the person's responses are assumed to reveal underlying needs, conflicts and ways of perceiving. Examples are the Rorschach Inkblot Test, the Thematic Apperception Test, sentence completion tests and drawing tests like the Draw-a-Person. Critics point out that many projective methods have weak reliability and validity, inconsistent scoring and limited norms, especially for India. However, systems such as the Rorschach Comprehensive System and R-PAS have improved scoring and show validity for some areas, such as thought disorder and perceptual accuracy. I would use projectives as one source of hypotheses within a full assessment, never on their own.",
    [
      "Definitions of each type",
      "Correct examples",
      "Strengths and weaknesses of objective tests",
      "Critique of projectives with improved scoring systems",
      "Appropriate integrated use",
    ],
    [
      "Treating projective results as definitive",
      "Not knowing standard examples",
    ]),

  iv("iv-asm-002", 2,
    "A 9-year-old is referred for poor school performance. Which tests would you choose, and why?",
    [
      "What would you rule out before testing?",
      "Why might you use MISIC rather than the WISC-V?",
      "How would you assess adaptive behaviour?",
    ],
    "I would start with a detailed history from parents and teachers, school reports and a clinical interview with the child, and I would rule out vision and hearing problems, medical issues and emotional causes like anxiety, depression or bullying. Then I would choose tests to answer specific questions. To assess general intellectual ability, I would use an individually administered intelligence test standardised for Indian children, such as MISIC, Malin's adaptation of the WISC, or the WISC-IV or V where Indian norms or adaptations are appropriate, which give verbal and performance or index scores. If the child had limited language or literacy, a performance or non-verbal measure like Raven's Coloured Progressive Matrices or the Bhatia battery would help. To check for a specific learning disorder, I would use educational achievement tests for reading, spelling, writing and arithmetic, such as the NIMHANS Index for Specific Learning Disabilities. For attention problems, I would use teacher and parent rating scales like the Conners. For adaptive functioning, if intellectual disability is a question, I would use the Vineland Social Maturity Scale. I would also use screening tools for anxiety or depression if needed. I would interpret the results together, not as isolated scores.",
    [
      "History and ruling out sensory or medical causes",
      "Appropriate intelligence test with Indian norms",
      "Non-verbal options",
      "Achievement tests for SLD",
      "ADHD ratings, adaptive measures and integrated interpretation",
    ],
    [
      "Testing without history",
      "Using only one IQ test",
      "Ignoring emotional causes",
    ]),

  iv("iv-asm-003", 3,
    "On the WAIS-IV, a client has a Verbal Comprehension Index of 112 and a Processing Speed Index of 82. How would you interpret this?",
    [
      "Is the Full Scale IQ meaningful here?",
      "What could cause low processing speed?",
      "How large a discrepancy is significant?",
    ],
    "The WAIS-IV gives four index scores: Verbal Comprehension, Perceptual Reasoning, Working Memory and Processing Speed, each with a mean of 100 and a standard deviation of 15. A VCI of 112 is in the high average range, while a PSI of 82 is in the low average range, a difference of 30 points, which is two standard deviations. I would first check whether the difference is statistically significant, using the critical values in the manual, and how common it is in the standardisation sample, the base rate, because some discrepancies are common in healthy people. A 30-point difference is usually both significant and fairly unusual. When indices differ this much, the Full Scale IQ is less meaningful as a summary, and I would describe the profile instead, perhaps using the General Ability Index, which excludes working memory and processing speed. Low processing speed, measured by Coding and Symbol Search, can come from many causes: brain injury, multiple sclerosis, ADHD, depression, anxiety during testing, medication effects, fatigue, visual or motor problems, or simply a careful, slow style. So I would not interpret it alone. I would look at history, behaviour during testing, other test results, and daily functioning, and explain what it might mean practically, such as needing more time in exams or at work.",
    [
      "Index structure and score meanings",
      "Statistical significance and base rates",
      "Limits of FSIQ with discrepant indices, GAI",
      "Range of causes for low PSI",
      "Integration with history and practical implications",
    ],
    [
      "Reporting only the FSIQ",
      "Over-interpreting a single difference",
      "Assuming brain damage from low PSI",
    ]),

  iv("iv-asm-004", 3,
    "Explain the MMPI-2 validity scales. What would you conclude from a very high F scale?",
    [
      "What does the K scale measure?",
      "What is the F-K index?",
      "How does the MMPI-2-RF differ?",
    ],
    "The MMPI-2 validity scales tell us how the person approached the test, which affects whether the clinical scales can be interpreted. The Cannot Say score counts unanswered items. VRIN and TRIN measure inconsistent responding and yes-saying or no-saying bias. The L scale, or Lie scale, detects unsophisticated attempts to look unusually virtuous. The K scale measures defensiveness or a more subtle wish to appear well-adjusted. The F scale, or Infrequency, has items rarely endorsed by most people, so high scores suggest over-reporting of symptoms. Fb does the same for the second half of the test, and Fp, Infrequency Psychopathology, contains items rarely endorsed even by psychiatric patients, which helps separate genuine severe illness from exaggeration. FBS, the Symptom Validity scale, was developed for overreporting of physical and cognitive complaints. A very high F does not automatically mean faking. It can result from random responding, reading problems, misunderstanding the language, a cry for help in someone in crisis, genuine severe psychopathology, or deliberate exaggeration. So I would check VRIN and TRIN for inconsistency, look at Fp, consider the context such as compensation claims or forensic settings, and combine this with the interview. The MMPI-2-RF has updated validity scales, such as F-r, Fp-r and RBS, and shorter, restructured clinical scales.",
    [
      "Purpose of validity scales",
      "Correct descriptions of L, K, F, VRIN, TRIN",
      "Fp and other overreporting scales",
      "Multiple explanations for high F",
      "Contextual interpretation and the RF version",
    ],
    [
      "Saying high F means malingering automatically",
      "Confusing L and K",
    ]),

  iv("iv-asm-005", 2,
    "When would you use the Bender Visual Motor Gestalt Test, and what are its limits?",
    [
      "What scoring systems exist?",
      "Is the BGT a good screening test for organicity?",
      "How would you use it with children?",
    ],
    "The Bender Visual Motor Gestalt Test, developed by Lauretta Bender, asks the person to copy nine geometric designs. It assesses visual perception, motor coordination and their integration, and in children it reflects visual-motor maturity. It is quick, non-verbal and acceptable to most people, which makes it useful with children, people with limited language or literacy, and as a warm-up task. Scoring systems include the Koppitz Developmental Scoring System for children aged about 5 to 11, which looks at errors like distortion, rotation, integration and perseveration, and adult systems such as Pascal-Suttell, Hutt's approach and the Lacks adaptation, as well as the Bender-Gestalt II. Historically it was widely used to screen for 'organicity', meaning brain damage, and it is included in the PGI Battery of Brain Dysfunction. However, its limits are important. A normal Bender does not rule out brain damage, because many lesions do not affect visual-motor copying, and an abnormal result can reflect poor education, visual problems, motor problems, fatigue or low effort. It cannot localise damage and should not be used alone to diagnose brain injury. Its projective interpretation, such as inferring personality from drawing size, has weak support. So I would use it as one part of a broader neuropsychological or developmental assessment.",
    [
      "Task and what it measures",
      "Useful populations",
      "Scoring systems including Koppitz",
      "Limits as an organicity screen",
      "Integrated use",
    ],
    [
      "Using it alone to diagnose brain damage",
      "Projective personality claims",
    ]),

  iv("iv-asm-006", 3,
    "Describe the Rorschach and how it is scored using a modern system.",
    [
      "What is the difference between the Comprehensive System and R-PAS?",
      "What does form quality tell you?",
      "Is the Rorschach valid?",
    ],
    "The Rorschach Inkblot Test, created by Hermann Rorschach in 1921, uses ten inkblots, some black and grey, some with colour. The person says what each blot might be, in the response phase, and then in the inquiry or clarification phase explains where they see it and what makes it look like that. Responses are coded on several dimensions. Location shows which part of the blot was used: the whole, a common detail, an unusual detail, or white space. Determinants show what made it look that way, such as form, movement, colour or shading. Form quality shows how well the response fits the blot's shape, which reflects reality testing. Content records what was seen, such as humans, animals or anatomy, and popular responses are those commonly given. Special scores capture unusual reasoning, such as illogical combinations. Exner's Comprehensive System combined earlier approaches and created norms and structural summaries. R-PAS, the Rorschach Performance Assessment System, developed later by Meyer and colleagues, kept the best-supported variables, standardised administration to optimise the number of responses, and uses international norms. Research supports the validity of some variables, such as perceptual distortion and thought disorder indicators for psychosis, but not others. In India, administration and norms need careful attention, and I would always integrate it with interviews and other tests.",
    [
      "Stimuli and phases of administration",
      "Coding dimensions with meanings",
      "Comprehensive System and R-PAS differences",
      "Balanced validity view",
      "Indian norms and integration",
    ],
    [
      "Interpreting single responses symbolically",
      "Claiming it is fully valid or entirely invalid",
    ]),

  iv("iv-asm-007", 2,
    "How is the Thematic Apperception Test administered and interpreted? Is there an Indian version?",
    [
      "What is Murray's need-press theory?",
      "Why is the TAT difficult to score reliably?",
      "What is the CAT?",
    ],
    "The Thematic Apperception Test was developed by Henry Murray and Christiana Morgan in the 1930s. It consists of pictures showing ambiguous social scenes, and the person is asked to tell a story for each, saying what led up to the scene, what is happening, what the characters are thinking and feeling, and how it ends. Usually a selection of cards is used, chosen to suit the person's age, gender and the clinical question. Interpretation is based on Murray's need-press theory: the hero of each story is assumed to represent the person, and the stories reveal their needs, such as achievement, affiliation or aggression, and the presses or environmental forces they perceive, along with their typical conflicts, relationships and coping. Clinicians also look at story structure, the outcomes, emotional tone and the quality of thinking. Formal scoring systems exist, such as McClelland's for achievement motivation and Westen's social cognition and object relations scale, but in clinical practice, interpretation is often qualitative, which limits reliability. The Children's Apperception Test uses animal figures for young children. In India, an adaptation by Uma Chowdhury was developed with Indian figures and settings, which helps cultural relevance. I would use the TAT to generate hypotheses about interpersonal themes, never to make a diagnosis alone.",
    [
      "Origin and administration",
      "Need-press theory and hero identification",
      "Formal scoring systems and reliability limits",
      "CAT and Indian adaptation",
      "Hypothesis-generating use",
    ],
    [
      "Using it diagnostically alone",
      "Not knowing who developed it",
    ]),

  iv("iv-asm-008", 2,
    "Which tools would you use to rate the severity of depression, and how do they differ?",
    [
      "Why is the HAM-D sometimes criticised?",
      "Which tool is good for tracking change in primary care?",
      "How would you assess depression in an older adult?",
    ],
    "I would choose depending on the setting and purpose. Clinician-rated scales include the Hamilton Depression Rating Scale, HAM-D, which has 17 or 21 items and is widely used in research and drug trials. It is criticised for weighting somatic symptoms like sleep and appetite heavily and for some items that do not form a single dimension. The Montgomery-Åsberg Depression Rating Scale, MADRS, has 10 items, focuses more on core mood symptoms and is sensitive to change. Self-report scales include the Beck Depression Inventory-II, with 21 items covering the past two weeks, which is widely used in psychotherapy and research, and the PHQ-9, a nine-item measure based directly on the DSM criteria. It is short, free, validated in India and very useful for screening and tracking change in primary care, with scores of 5, 10, 15 and 20 suggesting mild, moderate, moderately severe and severe depression. For older adults, the Geriatric Depression Scale uses yes or no items and avoids somatic symptoms that overlap with physical illness. For physically ill patients, the Hospital Anxiety and Depression Scale is useful for the same reason. I would remember that these scales measure severity or screen for depression, but diagnosis needs a clinical interview, and every scale should be interpreted alongside a suicide risk assessment.",
    [
      "Clinician-rated versus self-report scales",
      "HAM-D and its criticism, MADRS",
      "BDI-II and PHQ-9 with cut-offs",
      "Special populations: GDS and HADS",
      "Scales do not replace diagnosis or risk assessment",
    ],
    [
      "Diagnosing from a questionnaire score alone",
      "Wrong PHQ-9 cut-offs",
    ]),

  iv("iv-asm-009", 2,
    "How would you assess the severity of OCD and track progress in therapy?",
    [
      "What does the symptom checklist add?",
      "How do you assess insight?",
      "What is a clinically meaningful change on the Y-BOCS?",
    ],
    "The standard tool is the Yale-Brown Obsessive Compulsive Scale, Y-BOCS, a clinician-rated semi-structured interview. It begins with a symptom checklist covering types of obsessions, such as contamination, harm, symmetry, sexual or religious themes, and compulsions, such as washing, checking, ordering, counting or mental rituals. This helps identify the main symptoms to target in treatment. The severity scale then has ten items, five for obsessions and five for compulsions, rating time spent, interference, distress, resistance and degree of control, each from 0 to 4, giving a total of 0 to 40. Roughly, scores of 0 to 7 are subclinical, 8 to 15 mild, 16 to 23 moderate, 24 to 31 severe and 32 to 40 extreme. The children's version is the CY-BOCS. To assess insight, I would use the DSM-5-TR specifier of good, poor, or absent insight with delusional beliefs, and tools like the Brown Assessment of Beliefs Scale. To track progress, I would repeat the Y-BOCS at regular intervals, for example every four to six sessions, alongside self-monitoring records of rituals and anxiety ratings during exposure. A reduction of about 25 to 35% in Y-BOCS score is often used to define treatment response, and a score below about 12 or 14 is often used to define remission. I would also measure functioning, depression and family accommodation.",
    [
      "Y-BOCS structure: checklist and severity items",
      "Scoring range and severity bands",
      "Insight specifier and its assessment",
      "Tracking with repeat ratings and self-monitoring",
      "Response and remission definitions",
    ],
    [
      "Not knowing the Y-BOCS",
      "Using only global impressions",
    ]),

  iv("iv-asm-010", 3,
    "Which rating scales are used for schizophrenia, and how do the PANSS and BPRS differ?",
    [
      "How would you assess negative symptoms specifically?",
      "How is the PANSS administered?",
      "What is the role of cognitive assessment in schizophrenia?",
    ],
    "The two most common clinician-rated scales are the Brief Psychiatric Rating Scale and the Positive and Negative Syndrome Scale. The BPRS, developed by Overall and Gorham, has 18 items in its standard version, covering a broad range of symptoms such as anxiety, depression, hostility, suspiciousness, hallucinations and unusual thought content, each rated on a seven-point scale. It is quick and useful for general psychopathology in many conditions, not only schizophrenia. The PANSS, developed by Kay, Fiszbein and Opler, has 30 items: seven for positive symptoms, seven for negative symptoms and sixteen for general psychopathology. It is based on a semi-structured clinical interview of about 45 minutes, plus information from carers and staff, with each item rated from 1 to 7 using detailed anchors. It is the standard outcome measure in schizophrenia trials, and factor analyses suggest five dimensions: positive, negative, disorganised, excited and depressed or anxious. For negative symptoms, I would use the Scale for the Assessment of Negative Symptoms, SANS, or newer tools like the Brief Negative Symptom Scale, which distinguish experiential deficits like reduced motivation from expressive deficits like blunted affect. Cognitive assessment is also important, because cognitive deficits in attention, memory and executive function strongly predict functional outcome, and can be assessed with the NIMHANS battery or specific tests.",
    [
      "BPRS structure and use",
      "PANSS structure, administration and anchors",
      "Five-factor model",
      "Negative symptom scales",
      "Cognitive assessment importance",
    ],
    [
      "Confusing PANSS subscales",
      "Ignoring cognition",
    ]),

  iv("iv-asm-011", 2,
    "How would you screen for cognitive impairment in an elderly patient, and what are the limits of the MMSE?",
    [
      "How does the MoCA differ from the MMSE?",
      "How does education affect scores?",
      "When would you refer for full neuropsychological testing?",
    ],
    "For a quick screen, I would use the Mini-Mental State Examination or the Montreal Cognitive Assessment, along with a collateral history from family about changes in memory and daily functioning, because the history is often more informative than a single score. The MMSE, developed by Folstein and colleagues, has 30 points covering orientation, registration, attention and calculation (serial sevens or spelling backwards), recall, language and copying a pentagon. Scores below about 24 have often been used to suggest impairment, but the MMSE has important limits. It is strongly affected by education, literacy and language, so illiterate or less-educated people in India may score low without dementia, and Hindi and other adapted versions with education-adjusted norms should be used. It has ceiling effects, so it misses mild impairment in educated people, and it is weak on executive function. It is also protected by copyright. The MoCA, also out of 30, includes more executive and visuospatial tasks, such as trail making, clock drawing and verbal fluency, and is more sensitive to mild cognitive impairment, with one point added for 12 or fewer years of education, though it too is affected by education. I would refer for full neuropsychological assessment if the screen is borderline, the pattern is unusual, the person is young or highly educated, or there is a question of differential diagnosis.",
    [
      "Screening plus collateral history",
      "MMSE structure and cut-off",
      "Education and language effects and Indian adaptations",
      "MoCA advantages",
      "Criteria for full assessment",
    ],
    [
      "Diagnosing dementia from the MMSE alone",
      "Ignoring education effects",
    ]),

  iv("iv-asm-012", 3,
    "A 50-year-old man complains of memory problems after a mild head injury and is seeking compensation. How would you assess whether his test performance is valid?",
    [
      "What is a performance validity test?",
      "Is low effort the same as malingering?",
      "How would you write this up?",
    ],
    "In a medico-legal context, I would assess both his cognitive abilities and the validity of his performance, because people may underperform for many reasons, including deliberate exaggeration for compensation. Mild head injuries usually cause symptoms that improve over weeks to months, so persistent severe memory loss would be unusual. I would use performance validity tests, which are designed to look difficult but are actually easy for most people, even those with real brain injury or dementia. Examples include the Test of Memory Malingering, where scores well below the cut-off, or below chance, strongly suggest poor effort, the Rey 15-Item Test, and embedded validity indicators such as Reliable Digit Span from the digit span subtest. I would also use symptom validity measures, such as MMPI-2-RF overreporting scales, to check whether his symptom reports are exaggerated. I would look for inconsistencies, such as performing worse on easy tasks than on hard ones, a pattern that does not fit known brain-behaviour relationships, or differences between test performance and observed daily functioning. Low effort is not the same as malingering. It can come from depression, pain, fatigue, anxiety or misunderstanding. Malingering requires evidence of intentional exaggeration for an external reward. In my report, I would describe the results objectively, state when results are not valid or interpretable, and avoid labelling him unless the evidence clearly supports it.",
    [
      "Need for validity testing in medico-legal settings",
      "Performance validity tests with examples",
      "Symptom validity measures",
      "Patterns of inconsistency",
      "Low effort versus malingering and careful reporting",
    ],
    [
      "Assuming he is faking",
      "Interpreting test scores without validity checks",
    ]),

  iv("iv-asm-013", 2,
    "What is the PGI Battery of Brain Dysfunction, and when would you use it?",
    [
      "Which tests does it include?",
      "What does the dysfunction rating show?",
      "What are its limitations?",
    ],
    "The PGI Battery of Brain Dysfunction, developed by Dwarka Pershad and S.K. Verma at PGIMER, Chandigarh, is an Indian battery used to screen for and describe cognitive impairment in adults, especially in suspected brain damage or dementia. It brings together five tests: the PGI Memory Scale, which has ten subtests covering remote and recent memory, mental balance, attention and concentration, delayed and immediate recall, verbal retention for similar and dissimilar word pairs, visual retention and recognition; the Verbal Adult Intelligence Scale; the Performance Adult Intelligence Scale; the Bender Visual Motor Gestalt Test; and the Nahor-Benson Test, which assesses perceptual and copying ability. Scores on each test are compared with norms that take age and education into account, and dysfunction ratings across tests give an overall picture of the extent of impairment. I would use it in a hospital setting when an Indian-normed, broad screening battery is needed, for example in suspected dementia, after head injury, or in patients with long-term alcohol use. Its advantages are Indian norms, Hindi and English versions, and wide familiarity. Its limitations are that the norms are old, some tests are less sensitive to executive and frontal deficits, it gives limited information on specific domains compared with newer batteries like the NIMHANS battery, and results must be interpreted alongside history.",
    [
      "Developers and purpose",
      "Five component tests with PGIMS subtests",
      "Normative comparison and dysfunction rating",
      "Appropriate clinical use",
      "Strengths and limitations",
    ],
    [
      "Not knowing the component tests",
      "Over-reliance despite old norms",
    ]),

  iv("iv-asm-014", 3,
    "Describe the NIMHANS Neuropsychological Battery. How would you use it to tell frontal from temporal lobe dysfunction?",
    [
      "Which tests assess executive function?",
      "Which tests assess memory?",
      "What is the children's version?",
    ],
    "The NIMHANS Neuropsychological Battery for adults, developed by Shobini Rao and colleagues and published in 2004, provides Indian norms for people aged about 16 to 65, stratified by age, gender and education. It covers several domains. Motor speed is measured with finger tapping. Attention is measured with digit vigilance and the Colour Trails Test. Executive functions are measured with verbal fluency (animal names and the Controlled Oral Word Association test), the Stroop test, the Tower of London, the Wisconsin Card Sorting Test, and working memory tasks such as n-back. Comprehension is measured with the Token Test. Learning and memory are measured with the Rey Auditory Verbal Learning Test for verbal memory and the Complex Figure Test recall for visual memory. Visuo-construction is measured with the Complex Figure Test copy. To distinguish frontal from temporal dysfunction, I would look at the pattern. Frontal problems typically show poor fluency, perseveration and many errors on the card sorting test, poor planning on the Tower of London, Stroop interference, and poor organisation of the complex figure, with memory problems mainly in retrieval that improve with recognition cues. Temporal lobe problems show impaired learning and rapid forgetting on delayed recall that does not improve with cues, with left temporal damage affecting verbal memory more and right temporal damage affecting visual memory more. A separate NIMHANS battery exists for children aged 5 to 15.",
    [
      "Authors, date, age range and norms",
      "Domains and specific tests",
      "Frontal pattern including retrieval deficit",
      "Temporal pattern including lateralisation",
      "Children's version",
    ],
    [
      "Not knowing the tests",
      "Ignoring education-stratified norms",
    ]),

  iv("iv-asm-015", 2,
    "How would you assess a child for suspected autism spectrum disorder in India?",
    [
      "What is ISAA, and what is it used for?",
      "What are the ADOS-2 and ADI-R?",
      "Why is a hearing test important?",
    ],
    "Assessment would be multidisciplinary and developmental. I would start with a detailed developmental history from the parents, covering pregnancy and birth, milestones, early social communication such as pointing, eye contact, response to name and pretend play, any loss of skills, repetitive behaviours, sensory sensitivities, and family history, along with reports from school or preschool. I would observe the child's play and interaction directly. For screening in young children, I could use the M-CHAT. For diagnosis, internationally standard tools are the ADOS-2, a structured observation with modules for different ages and language levels, and the ADI-R, a detailed parent interview, though both need specific training. In India, the Indian Scale for Assessment of Autism, ISAA, developed under the National Trust, is officially used for disability certification. It has 40 items in six domains, such as social relationships, emotional responsiveness, speech and communication, behaviour patterns, sensory aspects and cognitive component. The Childhood Autism Rating Scale, CARS, is also used. A hearing test is essential because hearing loss can cause delayed speech and poor response to name. I would assess intellectual and developmental level, with tools like DASII, the Developmental Screening Test or the Vineland, and check for comorbidities such as ADHD, epilepsy and anxiety. Finally, I would give feedback in a supportive, strengths-based way.",
    [
      "Developmental history and direct observation",
      "Screening and diagnostic tools",
      "ISAA for certification",
      "Hearing test and developmental level",
      "Comorbidity and supportive feedback",
    ],
    [
      "Diagnosing from a checklist alone",
      "Skipping hearing assessment",
    ],
    { module: "child" }),

  iv("iv-asm-016", 1,
    "What is the Vineland Social Maturity Scale, and how do you calculate a social quotient?",
    [
      "Who is the informant?",
      "What domains does it cover?",
      "How does the VSMS differ from the Vineland Adaptive Behavior Scales?",
    ],
    "The Vineland Social Maturity Scale, developed by Edgar Doll, measures social competence and adaptive behaviour, meaning a person's ability to look after their own practical needs and take responsibility in daily life. The Indian adaptation, by A.J. Malin, is widely used for children up to about 15 years. It is completed through an interview with an informant who knows the child well, usually a parent, and sometimes by direct observation. The items are arranged by age level and cover domains such as self-help general, self-help eating, self-help dressing, self-direction, occupation, communication, locomotion and socialisation. The examiner credits items the child habitually performs, and the total score is converted into a social age. The social quotient is calculated as social age divided by chronological age, multiplied by 100. For example, a 10-year-old with a social age of 7 has a social quotient of 70. The VSMS is used together with an intelligence test in assessing intellectual disability, because the diagnosis requires deficits in both intellectual and adaptive functioning, and it is used in disability certification. The newer Vineland Adaptive Behavior Scales, now in their third edition, are more detailed, covering communication, daily living skills, socialisation and motor skills with standard scores, but Indian norms for them are limited.",
    [
      "Developer and purpose",
      "Indian adaptation by Malin and informant method",
      "Domains",
      "Social age and SQ formula with example",
      "Use in intellectual disability assessment and newer Vineland",
    ],
    [
      "Wrong SQ formula",
      "Testing the child directly without an informant",
    ],
    { module: "child" }),

  iv("iv-asm-017", 3,
    "How would you write a good psychological assessment report?",
    [
      "What should never appear in a report?",
      "How do you write for different readers, such as a court or a school?",
      "How do you present test scores?",
    ],
    "A good report answers the referral question clearly and is useful to the reader. I would structure it as follows. First, identifying information and the reason for referral, stating the specific questions. Second, the sources of information: interviews, records, informants and the tests used, with dates. Third, relevant background, including history, development, education, medical, family and social context, kept brief and relevant. Fourth, behavioural observations during the assessment, such as rapport, effort, attention and anything that may affect validity. Fifth, test results, presented by domain, with standard scores and percentile ranks, confidence intervals where useful, and descriptive ranges, explained in plain language rather than just listing numbers. Sixth, an integrated interpretation or formulation that brings together all the findings, explains how they answer the referral question, notes strengths as well as difficulties, and mentions alternative explanations and the limits of the findings, such as cultural factors or norms. Seventh, a diagnosis if appropriate, and practical, specific recommendations. Finally, my name, qualification and RCI registration number. I would avoid jargon, speculation beyond the data, raw test items that compromise test security, and irrelevant personal details that could harm the client. For a court, I would focus on the legal question and stay strictly evidence-based. For a school, I would focus on learning needs and practical classroom strategies.",
    [
      "Clear referral question",
      "Logical structure with sources and observations",
      "Results explained by domain in plain language",
      "Integrated interpretation with limits",
      "Recommendations, signature and audience adaptation",
    ],
    [
      "A list of scores with no interpretation",
      "Including test items",
      "Jargon-heavy writing",
    ]),

  iv("iv-asm-018", 2,
    "How do you give feedback to a client after an assessment?",
    [
      "How do you explain an IQ score to parents?",
      "What if the results are upsetting?",
      "Should clients receive a copy of the report?",
    ],
    "Feedback is an important part of the assessment, and done well, it can be therapeutic in itself. I would plan the session in advance, deciding the main messages and how to explain them simply. I would start by asking the client, or parents, what they hoped to learn and what they already think, which helps me connect results to their concerns. I would begin with strengths, then explain the findings in plain language, using examples from daily life rather than technical terms. For instance, I might explain an IQ score to parents by saying their child learns new concepts more slowly than most children of the same age and needs information broken into smaller steps and repeated, and I would explain percentile ranks as 'out of 100 children of the same age, about 10 would score lower'. I would avoid presenting numbers as fixed labels and explain measurement error. I would check their understanding regularly and allow time for questions and emotions. If the results are upsetting, such as a diagnosis of intellectual disability or dementia, I would deliver the news gently and honestly, give hope through practical steps, and offer follow-up support. I would end with clear recommendations and next steps. Clients generally have the right to access their records, including the report, under Section 25 of the MHCA, and I would provide a copy written in understandable language.",
    [
      "Preparation and starting with the client's questions",
      "Strengths first and plain language",
      "Explaining scores without fixed labels",
      "Handling upsetting results sensitively",
      "Recommendations and report access",
    ],
    [
      "Reading out scores without explanation",
      "Avoiding difficult news",
    ]),

  iv("iv-asm-019", 3,
    "Should IQ tests developed in the West be used in India? How do you deal with test bias?",
    [
      "What is the difference between test bias and group differences in scores?",
      "What is differential item functioning?",
      "What did Indian adaptations change?",
    ],
    "Western tests can be useful in India only if they are carefully adapted and normed, because using them directly can produce misleading results. Test bias exists when a test measures different things or predicts outcomes differently for different groups, not simply when groups have different average scores. Groups can differ because of real differences in opportunity and education, so we must separate measurement bias from real disadvantage. Sources of bias include item content that depends on cultural knowledge, like a picture of an unfamiliar object, language and translation problems, unfamiliarity with timed tests or test materials, the examiner's relationship with the client, and norms from a different population. Methods to detect bias include differential item functioning analysis, where we check whether people of equal ability from different groups have different chances of answering an item correctly, and testing measurement invariance with factor analysis. Indian adaptations, such as MISIC from the WISC, the Binet-Kamat test from the Stanford-Binet, and the Bhatia battery, changed items to fit Indian experience, translated instructions, and collected Indian norms. In practice, I would choose tests with norms closest to the client's background, use non-verbal tests where language is a barrier, consider education and rural or urban background, interpret scores cautiously with confidence intervals, and describe these limits in my report.",
    [
      "Need for adaptation and norms",
      "Definition of bias versus group differences",
      "Sources of bias",
      "DIF and measurement invariance",
      "Indian adaptations and practical safeguards",
    ],
    [
      "Saying group differences prove bias",
      "Using Western norms without comment",
    ]),

  iv("iv-asm-020", 2,
    "When would you use a structured diagnostic interview rather than a clinical interview?",
    [
      "What is the SCID-5?",
      "What is the MINI?",
      "What are the disadvantages of structured interviews?",
    ],
    "A clinical interview is flexible and lets the clinician follow leads, build rapport and understand the person's story and context, which is essential for formulation. But unstructured interviews have lower reliability, because clinicians may miss symptoms or reach different diagnoses. Structured and semi-structured diagnostic interviews improve reliability by asking every person a standard set of questions tied to diagnostic criteria. I would use them in research, where reliable diagnosis is essential, in complex cases with possible comorbidity, and in services that want systematic screening. The SCID-5, the Structured Clinical Interview for DSM-5, is semi-structured, with a clinician version and a research version, and needs clinical judgment and training. Separate modules cover personality disorders. The MINI, the Mini International Neuropsychiatric Interview, is shorter, taking about 15 to 30 minutes, and covers major DSM and ICD disorders with yes or no questions, so it is useful for screening and trials. For children, tools like the K-SADS are used. Their disadvantages are that they take time, can feel mechanical and harm rapport, may miss cultural expressions of distress and context, and still depend on the person's honesty and insight. So in clinical practice, I would combine a structured interview with a full clinical interview, mental status examination and collateral information.",
    [
      "Strengths and limits of clinical interviews",
      "Reliability advantage of structured interviews",
      "When to use them",
      "SCID-5, MINI and child tools",
      "Disadvantages and combined approach",
    ],
    [
      "Saying structured interviews replace clinical judgment",
      "Not knowing SCID or MINI",
    ]),

  iv("iv-asm-021", 3,
    "How would you assess suicide risk? Can a scale predict who will die by suicide?",
    [
      "What is the Columbia Suicide Severity Rating Scale?",
      "What are static and dynamic risk factors?",
      "Why is risk categorisation into low, medium and high criticised?",
    ],
    "Suicide risk assessment is a clinical process, not a score. I would ask directly and calmly about suicidal thoughts, their frequency and intensity, any plans, intent, preparation such as saving pills, access to means, and past attempts, including how lethal they were and whether the person expected to be rescued. I would assess risk factors. Static factors, which cannot change, include past attempts, male sex, older age, family history of suicide, and childhood abuse. Dynamic factors, which can change and are targets for intervention, include depression, hopelessness, substance use, psychosis with command hallucinations, recent losses, social isolation, pain and access to means. I would also assess protective factors such as family support, reasons for living, religious beliefs and engagement with care, and ask about warning signs like making final arrangements. Tools like the Columbia Suicide Severity Rating Scale help structure the assessment of ideation and behaviour, and the Beck Hopelessness Scale and Beck Scale for Suicide Ideation can add information. However, research shows that no scale or risk category can accurately predict which individual will die by suicide, because suicide is rare and risk fluctuates. Classifying people as low, medium or high risk can create false reassurance. Current guidance focuses on understanding the person's situation, collaborative safety planning, means restriction, treatment of underlying problems and follow-up, regardless of a risk label.",
    [
      "Direct questioning about ideation, plan, intent and means",
      "Static, dynamic and protective factors",
      "Structured tools such as C-SSRS",
      "Limits of prediction and risk categories",
      "Focus on safety planning and treatment",
    ],
    [
      "Relying on a score to decide management",
      "Avoiding direct questions",
    ],
    { module: "suicide" }),

  iv("iv-asm-022", 2,
    "What are the Binet-Kamat Test and MISIC, and when would you choose one over the other?",
    [
      "How is mental age calculated?",
      "What is a deviation IQ?",
      "What are the limits of these tests today?",
    ],
    "The Binet-Kamat Test is V.V. Kamat's Indian adaptation of the Stanford-Binet scale, developed in the 1930s, with versions in languages such as Marathi and Kannada and later Hindi. It is an age-scale test: items are grouped by age level, and the child's performance gives a basal age, where all items are passed, plus credits for items passed at higher levels, to calculate a mental age. The IQ is then the ratio of mental age to chronological age, multiplied by 100. It covers a wide age range, from about 3 years to adulthood, and is useful for young children and those with lower ability, and in assessing intellectual disability. MISIC, Malin's Intelligence Scale for Indian Children, is an Indian adaptation of the Wechsler Intelligence Scale for Children, standardised in the 1960s, for children aged about 6 to 15. It has verbal subtests, such as information, comprehension, arithmetic, similarities, vocabulary and digit span, and performance subtests, such as picture completion, block design, object assembly, coding and mazes, giving verbal, performance and full-scale IQs. It is better when a profile of strengths and weaknesses is needed. Both have old norms, so scores may be inflated by the Flynn effect, and some items are outdated. A deviation IQ, used in modern Wechsler tests, compares a person to their age group with a mean of 100 and a standard deviation of 15, which is statistically better than ratio IQ.",
    [
      "Binet-Kamat origin and age-scale method",
      "Mental age and ratio IQ",
      "MISIC origin, age range and subtests",
      "When to choose each",
      "Old norms, Flynn effect and deviation IQ",
    ],
    [
      "Confusing ratio IQ with deviation IQ",
      "Not knowing the original tests",
    ],
    { module: "child" }),

  iv("iv-asm-023", 4,
    "A 30-year-old woman's full-scale IQ is 68 on a test, but she has a degree, works as a clerk and manages her household. How do you interpret this?",
    [
      "Can she have intellectual disability?",
      "What factors might lower her test score?",
      "What is the standard error of measurement here?",
    ],
    "This result does not fit her history, so I would not diagnose intellectual disability. Intellectual disability requires deficits in both intellectual and adaptive functioning, with onset in the developmental period. Her degree, job and household management show adequate adaptive functioning and suggest that her intellectual abilities were not significantly impaired in development. So I would look for reasons why her current score might be low. These could include an acquired brain problem, such as a head injury, stroke, encephalitis or early dementia, which would be important to detect; a mood or anxiety disorder, for example severe depression slowing her thinking and reducing effort; medication or substance effects; sensory or motor problems; language or cultural mismatch with the test or its norms, such as testing in a language she is not fluent in; low effort, possibly linked to an external incentive; fatigue, pain or poor rapport; or simply errors in administration and scoring. I would check the test's standard error of measurement. For example, with an SEM of about 3, a 95% confidence interval is roughly plus or minus 6 points, so her true score might be in the low 60s to mid 70s, which still needs explanation. I would review the index profile, use performance validity measures, take a careful history and collateral information about any decline, and re-test or refer for neuropsychological and medical assessment if needed.",
    [
      "Recognises inconsistency with adaptive functioning",
      "ID diagnosis requires adaptive deficits and developmental onset",
      "List of possible explanations including acquired causes",
      "Measurement error with confidence interval",
      "Further steps: profile, validity, history, referral",
    ],
    [
      "Diagnosing intellectual disability from IQ alone",
      "Ignoring possible acquired brain problems",
    ]),

  iv("iv-asm-024", 3,
    "How would you assess personality disorder using the ICD-11 approach?",
    [
      "What tools exist for rating ICD-11 severity?",
      "How do you rate the trait domains?",
      "Why is collateral information important?",
    ],
    "In ICD-11, personality disorder is assessed in two steps. First, I would decide whether there is a personality disorder and how severe it is. This depends on problems in the functioning of the self, such as identity, self-worth, accurate self-view and self-direction, and in interpersonal functioning, such as the ability to develop and maintain close relationships, understand others' perspectives and manage conflict, lasting two years or more and shown across many situations. Severity is graded as personality difficulty (not a disorder), mild, moderate or severe, based on how widespread the problems are, the degree of distress and impairment, and the risk of harm to self or others. Second, I can describe the person's traits using five trait domain qualifiers: negative affectivity, detachment, dissociality, disinhibition and anankastia, plus the borderline pattern specifier when it applies. The assessment would combine a careful clinical interview about long-standing patterns in relationships, work and self-image, examples from different contexts, and collateral information from family or friends, because people with personality difficulties may have limited insight or describe themselves inconsistently. Self-report and clinician tools have been developed, such as the Standardised Assessment of Severity of Personality Disorder and the Personality Inventory for ICD-11. I would also take account of culture, avoid diagnosing during an acute episode of another disorder, and consider trauma.",
    [
      "Two-step approach",
      "Self and interpersonal functioning domains",
      "Severity levels including personality difficulty",
      "Five trait domains and borderline pattern",
      "Interview, collateral, tools, culture and timing",
    ],
    [
      "Using the old ten-category model for ICD-11",
      "Diagnosing during an acute episode",
    ]),

  iv("iv-asm-025", 2,
    "How would you assess a patient's mental status when they speak little and may be psychotic?",
    [
      "What can you observe without the patient speaking?",
      "How do you assess orientation and cognition in a mute patient?",
      "What should you document?",
    ],
    "The mental status examination begins with observation, which is especially valuable when a patient says little. I would note appearance, such as grooming, clothing and signs of self-neglect or injury; behaviour, such as eye contact, posture, psychomotor slowing or agitation, mannerisms, posturing or other catatonic signs, response to unseen stimuli like looking around or talking to no one, which may suggest hallucinations; and their attitude, such as guarded, suspicious, withdrawn or uncooperative. I would note speech characteristics even if limited: amount, latency of response, volume and whether speech is relevant. Affect can be observed through facial expression and its range and appropriateness. If the patient is mute, I would try simple, non-threatening questions, yes or no answers, gestures or writing, and check whether they can follow simple commands, which tells me about comprehension and consciousness. I would look for signs of catatonia, such as waxy flexibility or negativism, and consider medical causes, including delirium or stupor. I would obtain information from family and staff about recent behaviour, eating, sleep and any statements. In documentation, I would record exactly what I observed and any words the patient said, avoid over-interpreting, clearly state what could not be assessed, and plan to repeat the examination later.",
    [
      "Systematic observation of appearance and behaviour",
      "Signs of hallucinations and catatonia",
      "Adapted communication methods",
      "Medical causes and collateral information",
      "Accurate documentation including what could not be assessed",
    ],
    [
      "Abandoning the MSE because the patient is silent",
      "Over-interpreting minimal data",
    ],
    { module: "mse-deep" }),

  iv("iv-asm-026", 4,
    "You are asked to assess whether an elderly woman has the capacity to make a will. How would you approach this?",
    [
      "Is capacity global or decision-specific?",
      "What does testamentary capacity involve?",
      "What role do cognitive test scores play?",
    ],
    "Capacity is decision-specific and time-specific, so I would assess her capacity for this particular decision, making a will, at this time, not her general mental state. A diagnosis of dementia does not by itself mean she lacks capacity. Legal tests of testamentary capacity, which come from the long-established Banks versus Goodfellow principles, generally require that the person understands that they are making a will and its effects, knows roughly the extent of their property, understands who might reasonably expect to benefit, and is not influenced by delusions or a disorder of mind that distorts their judgment about these matters. I would interview her privately, without family members who might influence her, and ask open questions: why she wants to make a will, what she owns, who her family members are, and why she wants to leave her property in a particular way. I would assess her memory, reasoning and ability to explain and keep to her choices, and check for delusions, for example false beliefs that a relative is stealing from her. I would use cognitive tests such as the MoCA or more detailed neuropsychological tests to describe her abilities, but the scores only support my judgment, since capacity is a functional, legal question. I would also look for signs of undue influence. I would document my questions and her exact answers, and give an opinion, leaving the legal decision to the court or lawyer.",
    [
      "Decision-specific and time-specific capacity",
      "Elements of testamentary capacity",
      "Private, open-ended interview",
      "Role and limits of cognitive tests",
      "Undue influence, documentation and opinion only",
    ],
    [
      "Deciding capacity from an MMSE score",
      "Interviewing with the beneficiaries present",
    ],
    { module: "neurocognitive" }),
];

export const INTERVIEWS: InterviewQuestion[] = ITEMS.sort((a, b) => a.difficulty - b.difficulty);
