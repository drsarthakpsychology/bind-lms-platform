/* Module · Research methods, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: qualitative, mixed, ethical and honest research

## 3.1 Paradigms and qualitative research [core][advanced]
Quantitative research asks "how much, how many, does X cause Y?" **Qualitative research** asks "what is this like, what does it mean, how does it happen?" It works with words, images and actions, studies small samples in depth, and treats the researcher as part of the instrument.

### Paradigms: the beliefs behind a method
A **paradigm** (Thomas Kuhn's term) is a shared set of assumptions about the world and how to know it. Three terms come up in every exam:
- **Ontology:** what is real? One reality (realism) or many constructed realities (relativism)?
- **Epistemology:** how can we know it? Objectively and from outside, or through interpretation and interaction?
- **Methodology:** so, what methods follow?

| Paradigm | Ontology | Epistemology | Typical methods |
|---|---|---|---|
| **Positivism** | One reality, knowable directly | Objective, value-free; verify by observation | Experiments, surveys, statistics |
| **Post-positivism** (critical realism) | One reality, known only imperfectly | Objectivity as an ideal; falsify rather than verify | Experiments with humility about error; Popper |
| **Constructivism / interpretivism** | Multiple, socially constructed realities | Knowledge co-created by researcher and participant | Interviews, phenomenology, grounded theory |
| **Critical theory** (including feminist, Marxist, Dalit and decolonial approaches) | Reality shaped by power, history and social structures | Knowledge is political; research should empower | Participatory action research, critical discourse analysis |
| **Pragmatism** | Reality is what works in practice | Use whatever answers the question | Mixed methods |

:::widget layers
{"title": "From beliefs to methods", "shape": "stack", "layers": [{"label": "Ontology", "detail": "What is real?"}, {"label": "Epistemology", "detail": "How can we know it?"}, {"label": "Methodology", "detail": "So, what strategy of inquiry?"}, {"label": "Methods", "detail": "The actual techniques: interviews, surveys, experiments"}], "caption": "Each layer follows from the one above it."}
:::

### The main qualitative approaches
| Approach | Aim | Key people and ideas |
|---|---|---|
| **Phenomenology** | Describe the essence of a lived experience | Husserl: **bracketing (epoché)**, setting aside one's assumptions; Giorgi's descriptive method |
| **Interpretative phenomenological analysis (IPA)** | How particular people make sense of a major life experience | Developed by Jonathan Smith in the 1990s. **Idiographic** (case by case), small homogeneous purposive samples (often 3 to 10), and the **double hermeneutic**: the researcher making sense of the participant making sense of their experience |
| **Grounded theory** | Build a theory **from** the data, not test one | Founded by Barney Glaser and Anselm Strauss in the 1960s. **Constant comparison**, **theoretical sampling** and **theoretical saturation** (no new properties emerge). Coding in Strauss and Corbin's version: **open** then **axial** then **selective**; **memo-writing**. Kathy Charmaz's later **constructivist** version |
| **Thematic analysis** | Identify patterns (themes) of meaning across a data set | Set out by Virginia Braun and Victoria Clarke; in their later **reflexive** thematic analysis the researcher's interpretation is a resource, not a bias to remove |
| **Discourse analysis** | How language **constructs** reality and does social actions | Discursive psychology (Jonathan Potter and Margaret Wetherell); Foucauldian discourse analysis (power, subject positions) |
| **Conversation analysis** | The fine structure of talk: turn-taking, repair, adjacency pairs | Sacks, Schegloff and Jefferson; Jefferson transcription |
| **Narrative analysis** | How people tell stories to make sense of lives and identities | Structure, plot, turning points; McAdams' life story |
| **Ethnography** | Understand a culture from the inside through long immersion | Participant observation, field notes, **thick description** (Geertz); emic (insider) versus etic (outsider) views |
| **Focus groups** | Explore shared views through group discussion | 6 to 10 people, a moderator; group interaction is itself data; risk of dominant voices and conformity |

:::widget sort
{"prompt": "Which approach fits each study best?", "buckets": ["IPA or phenomenology", "Grounded theory", "Discourse analysis", "Ethnography"], "items": [{"text": "How six mothers in Kerala make sense of their child's autism diagnosis", "bucket": 0, "why": "Lived experience, small homogeneous sample, sense-making: IPA."}, {"text": "Developing a model of how young men in Delhi decide whether to seek help for depression", "bucket": 1, "why": "Building a process theory from data, with theoretical sampling."}, {"text": "How TV debates construct 'the mentally ill' as dangerous through their choice of words", "bucket": 2}, {"text": "A year living with a Gond village community to understand local healing practices", "bucket": 3}, {"text": "Interviewing participants until no new properties of 'stigma resistance' appear, then building a core category", "bucket": 1, "why": "Theoretical saturation and a core category: grounded theory."}, {"text": "How speakers in parliament use 'family values' to resist LGBTQ rights", "bucket": 2}]}
:::

### Braun and Clarke's six phases of thematic analysis
1. **Familiarise** yourself with the data (transcribe, read and re-read, note ideas).
2. **Generate initial codes** systematically across the data set.
3. **Search for themes** (the 2019 wording is "generate initial themes"): collate codes into candidate themes.
4. **Review themes** against the coded extracts and the whole data set.
5. **Define and name** the themes, with a clear story for each.
6. **Produce the report**, with vivid extracts tied to the research question.

A **theme** captures something important about the data in relation to the question; it is not simply a topic that came up often. Analysis can be **inductive** (data-driven) or **deductive** (theory-driven), and **semantic** (surface meaning) or **latent** (underlying ideas).

:::widget flow
{"title": "Braun and Clarke's six phases", "layout": "chain", "nodes": [{"id": "n0", "label": "Familiarise", "detail": "Transcribe, read and re-read, note ideas"}, {"id": "n1", "label": "Code", "detail": "Label meaningful features across all data"}, {"id": "n2", "label": "Generate themes", "detail": "Group codes into candidate themes"}, {"id": "n3", "label": "Review themes", "detail": "Check against extracts and the whole data set"}, {"id": "n4", "label": "Define and name", "detail": "A clear story for each theme"}, {"id": "n5", "label": "Write up", "detail": "Vivid extracts tied to the question"}], "caption": "In practice you move back and forth between phases."}
:::

:::widget flow
{"title": "Grounded theory coding", "layout": "chain", "nodes": [{"id": "n0", "label": "Open coding", "detail": "Break data into concepts"}, {"id": "n1", "label": "Axial coding", "detail": "Relate categories to each other"}, {"id": "n2", "label": "Selective coding", "detail": "Choose a core category"}, {"id": "n3", "label": "Theory", "detail": "An explanatory model grounded in the data"}], "caption": "Constant comparison and theoretical sampling run through every stage until saturation."}
:::

### Quality in qualitative research
Reliability and validity are replaced by **trustworthiness**, in Yvonna Lincoln and Egon Guba's framework:

:::widget compare
{"title": "Quality in quantitative and qualitative research", "a": {"label": "Quantitative", "points": ["Internal validity", "External validity", "Reliability", "Objectivity"], "summary": "Quality means control, measurement and generalising to a population."}, "b": {"label": "Qualitative (trustworthiness)", "points": ["Credibility: member checks, triangulation", "Transferability: thick description", "Dependability: an audit trail", "Confirmability: reflexivity about the researcher's influence"], "summary": "Each criterion parallels a quantitative one, but fits work where meaning, not measurement, is the goal."}}
:::

| Criterion | Quantitative parallel | How it is achieved |
|---|---|---|
| **Credibility** | Internal validity | Prolonged engagement, member checking, triangulation, negative case analysis, peer debriefing |
| **Transferability** | External validity | **Thick description** so readers judge fit to their setting |
| **Dependability** | Reliability | An **audit trail** of decisions |
| **Confirmability** | Objectivity | Reflexive journals, audit trail, grounding claims in data |

The sociologist Norman Denzin described four kinds of **triangulation**: **data** (different sources, times or places), **investigator** (several researchers), **theory** (several theoretical lenses) and **methodological** (several methods). **Reflexivity** means openly examining how your own position (gender, caste, class, profession, language) shapes the research. A psychologist from Mumbai interviewing tribal women in Jharkhand must think about power, language and trust. Reporting guidelines such as **COREQ** (for interviews and focus groups) and **SRQR** list what to report.

:::clinician
Saturation is often misused. In grounded theory it is **theoretical** saturation: the categories are fully developed and new data add no new properties. It is not "we stopped hearing new things after 12 interviews". In reflexive thematic analysis, Braun and Clarke argue that saturation is not a coherent stopping rule at all, because themes are generated by the analyst, not found lying in the data; sample size is instead justified by **information power**, an idea from Kirsti Malterud and colleagues: narrower aims, dense specific samples, established theory, strong dialogue and focused analysis all mean fewer participants are needed. Examiners at clinical master's interviews increasingly ask this.
:::

:::recall
1. Define ontology and epistemology. || Ontology: the nature of reality. Epistemology: the nature of knowledge and how it can be gained.
2. What is the double hermeneutic in IPA? || The researcher is making sense of the participant making sense of their own experience.
3. Name the three coding stages of Strauss and Corbin's grounded theory. || Open, axial and selective coding.
4. List Braun and Clarke's six phases. || Familiarise, code, generate or search for themes, review, define and name, write up.
5. Give Lincoln and Guba's four criteria of trustworthiness. || Credibility, transferability, dependability and confirmability.
6. Name Denzin's four types of triangulation. || Data, investigator, theory and methodological.
:::

:::mcq
Q: Setting aside one's own assumptions to see an experience freshly is called:
- Theoretical sampling
- Member checking
- *Bracketing (epoché)
- Axial coding
> A Husserlian idea central to descriptive phenomenology.

Q: Choosing the next participants specifically to develop an emerging category is:
- Snowball sampling
- *Theoretical sampling
- Quota sampling
- Convenience sampling
> Sampling driven by the developing theory, in grounded theory.

Q: Sharing the findings with participants to check they ring true enhances:
- Dependability
- Transferability
- *Credibility
- Confirmability only
> Member checking is a credibility strategy.

Q: The paradigm behind most mixed-methods research is:
- Positivism
- Critical theory
- Phenomenology
- *Pragmatism
> Use whatever methods best answer the question.
:::

## 3.2 Mixed methods, evaluation and the evidence pyramid [core][advanced]

### Mixed methods
**Mixed methods** research collects and **integrates** quantitative and qualitative data in one study, in the scheme made popular by John Creswell. Integration is the point: two separate studies stapled together are not mixed methods.

| Core design | Sequence | Purpose | Example |
|---|---|---|---|
| **Convergent (parallel)** | QUAN and QUAL at the same time | Compare or merge to get a fuller picture | Survey of hostel students' sleep plus focus groups, merged in a joint display |
| **Explanatory sequential** | QUAN, then qual | Qualitative data **explain** surprising numbers | A trial finds the app worked for women only; interviews explore why |
| **Exploratory sequential** | QUAL, then quan | Qualitative work **builds** an instrument or hypotheses that are then tested | Interviews on "tension" in Punjabi idioms, then a new scale tested on 500 people |
| **Embedded (nested)** | One strand inside a larger design of the other type | Answer a secondary question | Interviews about acceptability inside an RCT |

Notation introduced by Janice Morse: capitals show the dominant strand, an arrow shows sequence, a plus sign shows simultaneity: QUAN → qual; QUAL + quan.

:::widget flow
{"title": "Three mixed-methods designs", "layout": "chain", "nodes": [{"id": "n0", "label": "Convergent", "detail": "QUAN and QUAL at once, then merged"}, {"id": "n1", "label": "Explanatory sequential", "detail": "QUAN first, then qual to explain it"}, {"id": "n2", "label": "Exploratory sequential", "detail": "QUAL first, then quan to build and test a tool"}]}
:::

### Programme evaluation
Evaluation judges the **worth** of a programme so decisions can be made.
- **Formative** evaluation improves a programme while it runs; **summative** evaluation judges it at the end, a distinction drawn by Michael Scriven.
- **Needs assessment** (is there a need?), **process evaluation** (is it delivered as planned? **fidelity**), **outcome evaluation** (did participants change?), **impact evaluation** (did it cause wider, longer-term change?) and **cost-effectiveness** analysis.
- Daniel Stufflebeam's **CIPP model**: **C**ontext, **I**nput, **P**rocess, **P**roduct.
- **Kirkpatrick's four levels** for training: reaction, learning, behaviour, results.
- A **logic model** links inputs, activities, outputs, outcomes and impact.

Indian example: Kerala's community and school-based mental health programmes, or the evaluation of Tele-MANAS (the national tele-mental health helpline launched in 2022), would need process data (calls answered, waiting times, counsellor fidelity) and outcome data (distress before and after, referrals completed).

:::widget flow
{"title": "A logic model", "layout": "chain", "nodes": [{"id": "n0", "label": "Inputs", "detail": "Trained staff, money, space"}, {"id": "n1", "label": "Activities", "detail": "Sessions, workshops"}, {"id": "n2", "label": "Outputs", "detail": "Sessions held, people reached"}, {"id": "n3", "label": "Outcomes", "detail": "Change in the people reached"}, {"id": "n4", "label": "Impact", "detail": "Longer-term, wider change"}], "caption": "Process evaluation checks the first three; outcome and impact evaluation check the last two."}
:::

### Internet-based research
Online surveys, experiments on platforms, social media data and digital phenotyping (passive phone data).
- **Gains:** large, diverse samples, low cost, anonymity encourages honest reporting of sensitive topics.
- **Problems:** **coverage** (people without internet or with low digital literacy), **self-selection**, **bots and fraudulent responses** (use attention checks, CAPTCHAs, consistency items, time stamps), multiple submissions, unclear identity and age of participants, and ethics: is a public post "public data"? How do you debrief, or respond to a participant disclosing suicidal intent at 2 a.m.? India's **Digital Personal Data Protection Act, 2023** now governs how personal data are collected and stored.

### The evidence pyramid
From strongest to weakest for questions about treatment effects:
1. **Systematic reviews and meta-analyses** of RCTs
2. **Randomised controlled trials** (RCTs)
3. **Cohort studies** (follow exposed and unexposed people forward)
4. **Case-control studies** (start with cases and controls, look back for exposures)
5. **Cross-sectional surveys**
6. **Case series and case reports**
7. **Expert opinion**

:::widget layers
{"title": "The evidence pyramid (for treatment questions)", "shape": "pyramid", "layers": [{"label": "Systematic reviews and meta-analyses", "detail": "Combine many trials"}, {"label": "Randomised controlled trials", "detail": "Random assignment controls confounding"}, {"label": "Cohort studies", "detail": "Follow exposed and unexposed people forward"}, {"label": "Case-control studies", "detail": "Start from cases, look back"}, {"label": "Cross-sectional surveys", "detail": "One point in time"}, {"label": "Case series and reports", "detail": "Descriptions of individual patients"}, {"label": "Expert opinion", "detail": "Least protected from bias"}], "caption": "Higher is stronger, provided the studies themselves are good."}
:::

Trials are reported using **CONSORT** and must be registered before recruitment; in India on the **Clinical Trials Registry of India (CTRI)**. Systematic reviews follow **PRISMA**. **Cluster RCTs** randomise groups instead of individuals: Vikram Patel's **MANAS** trial in Goa randomised primary-care clinics to test lay counsellors for common mental disorders.

:::widget decide
{"scene": "A team in Bhopal finds in a survey of 800 college students that, surprisingly, students who use the college counselling centre report **higher** distress than those who do not. They want to understand why.", "ask": "What is the best next design?", "choices": [{"label": "Explanatory sequential mixed methods: interview a purposive sample of centre users and non-users to explain the pattern.", "verdict": "best", "outcome": "Interviews show that distressed students seek help, and that some feel worse at first because sessions open up painful issues. Distress is a reason for use, not only a result.", "why": "Qualitative follow-up is designed to explain unexpected quantitative findings."}, {"label": "Conclude that the counselling centre makes students worse and close it.", "verdict": "harm", "outcome": "A useful service is lost because of a correlation.", "why": "Cross-sectional data cannot show direction: distress likely leads to use."}, {"label": "Run the same survey again with 1,600 students.", "verdict": "ok", "outcome": "The same correlation appears more precisely, but its meaning is still unclear.", "why": "A bigger sample reduces error, not the directionality problem."}]}
:::

:::recall
1. What separates mixed methods from simply doing two studies? || Deliberate integration of the quantitative and qualitative strands.
2. Explanatory versus exploratory sequential design. || Explanatory: QUAN first, then qual to explain it. Exploratory: QUAL first, then quan to build and test a measure or theory.
3. Name the four parts of the CIPP model. || Context, input, process, product.
4. Formative versus summative evaluation. || Formative improves a programme while it runs; summative judges its overall worth at the end.
5. What reporting guidelines go with RCTs and with systematic reviews? || CONSORT for RCTs; PRISMA for systematic reviews.
:::

:::mcq
Q: A researcher interviews traditional healers first, then uses the themes to write a questionnaire for 600 people. This is:
- Convergent design
- *Exploratory sequential design
- Explanatory sequential design
- Embedded design
> Qualitative first, to build an instrument tested quantitatively.

Q: Checking whether counsellors deliver a school programme as the manual says is:
- *Process (fidelity) evaluation
- Impact evaluation
- Summative evaluation
- Needs assessment of the school
> Delivery as planned is process evaluation.

Q: A study starts with 200 people with schizophrenia and 200 without, and looks back at cannabis use in adolescence. This is a:
- Cohort study
- *Case-control study
- RCT
- Cross-sequential study
> Starting from outcome and looking back for exposure.
:::

## 3.3 Research ethics [core][advanced]
Ethics is not a form to fill in at the end. It shapes the question, the design and the write-up.

### Why the rules exist: landmark abuses and responses
| Event | What happened | Response |
|---|---|---|
| Nazi medical experiments | Prisoners were tortured in "experiments" | **Nuremberg Code (1947)**: voluntary consent is "absolutely essential"; the right to withdraw |
| WMA response | Doctors needed clinical research rules | **Declaration of Helsinki (1964)**, revised many times, most recently in 2024 |
| **Tuskegee syphilis study** (USA, 1932 to 1972) | Poor Black men with syphilis were left untreated and deceived, even after penicillin became standard | **Belmont Report (1979)**: respect for persons, beneficence, justice |
| Milgram's obedience studies (1961 onwards) | Severe stress and deception | Debate on deception, debriefing and the right to withdraw |
| Zimbardo's Stanford prison study (1971) | Abuse escalated; stopped early; researcher was also the "superintendent" | Concerns about role conflict and harm |
| Watson and Rayner's Little Albert study (1920) | An infant was conditioned to fear without any de-conditioning | Protection of children and vulnerable people |

:::widget timeline
{"prompt": "Put these events in the history of research ethics in order.", "events": [{"label": "Little Albert is conditioned to fear and never deconditioned", "when": "1920"}, {"label": "The Tuskegee syphilis study begins", "when": "1932"}, {"label": "The Nuremberg Code: voluntary consent is essential", "when": "1947"}, {"label": "Milgram's obedience studies raise concern about stress and deception", "when": "1961 on"}, {"label": "The Declaration of Helsinki", "when": "1964"}, {"label": "Tuskegee is exposed and stopped", "when": "1972"}, {"label": "The Belmont Report: respect for persons, beneficence, justice", "when": "1979"}, {"label": "ICMR national ethical guidelines in India", "when": "2017"}], "why": "Nearly every rule was written in response to harm. Tuskegee ran for 40 years, through Nuremberg and Helsinki, which is why the Belmont Report and ethics committees followed."}
:::

:::widget flow
{"title": "From proposal to publication: the ethics path", "layout": "chain", "nodes": [{"id": "n0", "label": "Protocol", "detail": "Design, risks, consent forms"}, {"id": "n1", "label": "Ethics committee", "detail": "Approval before any data"}, {"id": "n2", "label": "Trial registration", "detail": "CTRI for trials"}, {"id": "n3", "label": "Informed consent", "detail": "Voluntary, understood, right to withdraw"}, {"id": "n4", "label": "Data collection", "detail": "With a risk protocol"}, {"id": "n5", "label": "Debrief", "detail": "Especially after deception"}, {"id": "n6", "label": "Honest reporting", "detail": "No fabrication, falsification or plagiarism"}]}
:::

### The Belmont principles
1. **Respect for persons:** treat people as autonomous; **informed consent**; extra protection for those with reduced autonomy.
2. **Beneficence:** do no harm; maximise benefits and minimise risks (risk-benefit assessment).
3. **Justice:** fair distribution of the burdens and benefits of research (do not test on the poor and sell to the rich).

:::widget sort
{"prompt": "Which Belmont principle is most at stake in each case?", "buckets": ["Respect for persons", "Beneficence", "Justice"], "items": [{"text": "A patient with dementia is enrolled without anyone checking her capacity or asking a carer", "bucket": 0, "why": "Consent and protection for reduced autonomy."}, {"text": "A study exposes students to severe distress for a small gain in knowledge", "bucket": 1, "why": "Risks must be minimised and outweighed by benefits."}, {"text": "A new drug is tested only on poor patients in government hospitals, then sold at a price only private patients can pay", "bucket": 2, "why": "Burdens and benefits are unfairly shared."}, {"text": "Participants are not told they can leave the study at any time", "bucket": 0, "why": "Voluntariness is part of informed consent."}, {"text": "No plan exists to help a participant who reports suicidal thoughts", "bucket": 1, "why": "Do no harm, and plan for foreseeable risks."}]}
:::

### Indian rules
- **ICMR National Ethical Guidelines for Biomedical and Health Research Involving Human Participants (2017)** are the main Indian guidelines; ICMR has separate guidelines for research with children (2017).
- Every study needs approval from an **Institutional Ethics Committee (IEC)** before data collection. ICMR expects the committee to be multidisciplinary (at least seven members, with a chairperson from outside the institution, and including a legal expert, a social scientist or ethicist and a lay person from the community).
- **New Drugs and Clinical Trials Rules, 2019** govern drug trials; trials must be registered with **CTRI**.
- **Mental Healthcare Act, 2017, Section 99:** research involving people with mental illness needs their **free and informed consent**; where a person cannot consent, the research may proceed only with permission from the State Mental Health Authority and consent of the **nominated representative**, and only when it cannot be done on people able to consent.
- **Digital Personal Data Protection Act, 2023** for personal data.

### What informed consent must include
The purpose, procedures and duration; foreseeable risks and discomforts; benefits; alternatives; **confidentiality** and its limits (for example, risk of harm); that participation is **voluntary**; the **right to withdraw** without penalty; compensation for injury where relevant; and whom to contact. It must be in a language the person understands; in India this often means the regional language, read aloud for people who cannot read, with an **impartial witness** and a thumb impression. For children: **parental consent plus the child's own assent**.

### APA Ethics Code, Standard 8 (Research and Publication)
Key items: institutional approval (8.01), informed consent (8.02), consent for recording (8.03), inducements (8.06: no excessive payments that coerce), **deception** (8.07: only if justified by significant value, no feasible alternative, not about things that would affect willingness to take part such as pain, and explained as early as possible), **debriefing** (8.08), humane care of animals (8.09), **no fabrication** (8.10), **no plagiarism** (8.11), fair **publication credit** (8.12), no duplicate publication (8.13) and sharing data for verification (8.14).

### Confidentiality, anonymity and vulnerable groups
- **Anonymity:** even the researcher cannot link data to a person. **Confidentiality:** the researcher can, but will not disclose. Most clinical studies are confidential, not anonymous.
- Vulnerable groups need extra care: children, prisoners, people with severe mental illness or intellectual disability, students of the researcher (risk of coercion), employees, refugees, people in crisis, and communities historically exploited by research.

### Research misconduct and integrity
- **FFP:** **fabrication** (making data up), **falsification** (manipulating data, images or methods) and **plagiarism** (using others' work or ideas without credit, including **self-plagiarism**).
- **UGC (Promotion of Academic Integrity and Prevention of Plagiarism in Higher Educational Institutions) Regulations, 2018** grade similarity (excluding quotations, references and common knowledge): **up to 10%** is level 0 (minor, no penalty); **above 10% to 40%** level 1; **above 40% to 60%** level 2; **above 60%** level 3. For a student's thesis, level 1 means resubmitting a revised script within six months; level 2 means resubmitting after a year; level 3 means the registration is cancelled. The "core work" (abstract, hypotheses, observations, results, conclusions) must have zero similarity.
- **Questionable research practices:** p-hacking (trying analyses until p dips below .05), HARKing (Hypothesising After the Results are Known), selective reporting, dropping inconvenient participants or conditions, salami slicing.
- **Authorship:** credit for a substantial contribution, not for status ("gift authorship") or by leaving out those who did the work ("ghost authorship").
- **Predatory journals:** charge fees with little or no peer review. UGC discontinued its UGC-CARE journal list in February 2025 and instead gave institutions suggested criteria for judging peer-reviewed journals, so researchers must judge journal quality themselves.

:::widget decide
{"scene": "Nikhil, an M.A. student in Varanasi, is surveying his own undergraduate students about cheating. One participant writes in an open answer that she has been thinking of ending her life.", "ask": "Two problems are in this scene. Which response handles both best?", "choices": [{"label": "Ignore it; the survey was anonymous and confidential.", "verdict": "harm", "outcome": "A student at risk gets no help.", "why": "Beneficence and the limits of confidentiality: risk of harm should be planned for in advance, with a protocol and helpline numbers in the information sheet."}, {"label": "Follow the risk protocol in his approved plan (supervisor informed, contact made through the counselling centre if the response is identifiable, helplines given to all), and recognise that surveying his own students risked coercion, so in future recruit through a neutral person and keep responses away from those who grade them.", "verdict": "best", "outcome": "The student is connected with the counselling centre. The ethics committee asks Nikhil to amend his recruitment.", "why": "It deals with immediate risk under a pre-planned protocol, and with the power relationship that compromises voluntary participation."}, {"label": "Email the whole class asking who wrote the answer.", "verdict": "harm", "outcome": "Confidentiality is broken and the student is exposed.", "why": "It violates privacy and could worsen risk."}]}
:::

:::recall
1. What are the three Belmont principles? || Respect for persons, beneficence and justice.
2. Which Indian guidelines govern biomedical and health research with human participants? || The ICMR National Ethical Guidelines, 2017.
3. When does APA allow deception? || When justified by significant value, with no effective alternative, never about things like pain or severe distress that would affect willingness, and with debriefing as early as possible.
4. What does FFP stand for? || Fabrication, falsification and plagiarism.
5. Give the UGC 2018 similarity levels. || Up to 10% level 0; above 10 to 40% level 1; above 40 to 60% level 2; above 60% level 3.
6. Anonymity versus confidentiality. || Anonymity: no one can link data to a person. Confidentiality: the researcher can link, but protects it.
:::

:::mcq
Q: The principle that the burdens and benefits of research should be shared fairly is:
- Respect for persons
- Beneficence
- *Justice
- Fidelity
> The Belmont principle of justice.

Q: For a study with 12-year-olds, the right approach is:
- Parental consent only
- *Parental consent plus the child's assent
- The child's assent only
- No consent, as children cannot legally decide anything
> Both are required.

Q: A researcher reuses large parts of his own published paper in a new article without citing it. This is:
- Fabrication
- Falsification
- Acceptable practice if the work is his own
- *Self-plagiarism (duplicate publication)
> Reusing one's own published text without acknowledgement is misconduct.

Q: Running many analyses and reporting only the one that reaches significance is called:
- HARKing
- *p-hacking
- Salami slicing
- Ghost authorship
> Flexible analysis until p falls below .05.
:::

## 3.4 Writing it up: articles, theses and APA style [core][advanced]

### The structure of a research article (IMRaD)
| Section | What goes in it |
|---|---|
| **Title** | Short, specific, names the variables and population |
| **Abstract** | About 150 to 250 words: problem, participants, method, results, conclusions (structured or unstructured) |
| **Introduction** | The problem, the literature, the gap, the aims and hypotheses (funnel: broad to narrow) |
| **Method** | Participants (with sampling and demographics), design, measures (with reliability and validity), procedure, ethics, analysis plan: enough for exact replication |
| **Results** | Findings without interpretation: descriptive statistics, test results with effect sizes and confidence intervals, tables and figures |
| **Discussion** | Interpretation, link to past research, **limitations**, implications, future directions (hourglass: narrow to broad) |
| **References** | Every source cited, and only those |
| **Appendices** | Tools, extra tables, consent forms |

A **thesis or dissertation** usually has chapters: introduction, review of literature, method, results, discussion, summary and conclusions, references and appendices, plus front matter (certificate, declaration, acknowledgements, contents, list of tables).

:::widget flow
{"title": "The shape of a research article", "layout": "chain", "nodes": [{"id": "n0", "label": "Introduction", "detail": "Broad to narrow: problem, literature, gap, hypotheses"}, {"id": "n1", "label": "Method", "detail": "Enough detail to repeat exactly"}, {"id": "n2", "label": "Results", "detail": "Findings without interpretation"}, {"id": "n3", "label": "Discussion", "detail": "Narrow to broad: meaning, limits, implications"}], "caption": "Think of an hourglass: wide, narrow, narrow, wide."}
:::

### APA 7 essentials
- **In-text citation:** author-date. One author: the surname and year in brackets. Two authors: both surnames joined by an ampersand inside brackets, or by "and" in running text. **Three or more authors:** the first author's surname followed by the Latin short form for "and others", from the very first citation.
- **Direct quotes** also need the page number after the year.
- **Journal article reference:** Author, A. A., & Author, B. B. (Year). Title of article in sentence case. *Journal Name in Title Case, volume*(issue), pages, then the article's digital object identifier as a web address.
- **Book:** Author, A. A. (Year). *Title of book in sentence case and italics* (2nd ed.). Publisher. (No publisher location in APA 7.)
- **Chapter in an edited book:** Author, A. A. (Year). Title of chapter. In E. E. Editor (Ed.), *Title of book* (pp. xx-xx). Publisher.
- Up to **20 authors** are listed in a reference; with 21 or more, list the first 19, an ellipsis, then the last.
- The digital object identifier (a permanent ID for an article) is written as a web address. Reference list: alphabetical by first author's surname, **hanging indent**, double-spaced.
- Numbers: use words for zero to nine and numerals for 10 and above (with many exceptions for statistics, ages and measurements). Statistical symbols are italicised (*M*, *SD*, *t*, *F*, *p*). Do not put a zero before a value that cannot exceed 1 (*p* = .03, *r* = .45).
- Other styles you should recognise: **MLA** (humanities: author-page), **Chicago** (notes and bibliography, or author-date), **Vancouver** (numbered, used in medicine and many Indian medical journals) and **Harvard** (author-date, close to APA).

:::widget worked
{"title": "Fix this reference into APA 7", "steps": [{"q": "A student's draft lists an invented article like this: 'Kumar R, Iyer S, Das P and Mehta A. Exam anxiety in Indian adolescents, a cross-sectional study. Journal of Student Wellbeing 2022; 49(2): 101-110.' Start with the authors. How should they look?", "a": "Surname, then initials with full stops, commas between names, and an ampersand before the last: Kumar, R., Iyer, S., Das, P., & Mehta, A."}, {"q": "Next, the year and the article title.", "a": "The year in brackets, then the title in sentence case; the first word after a colon is capitalised: (2022). Exam anxiety in Indian adolescents: A cross-sectional study."}, {"q": "Next, the journal, volume, issue and pages.", "a": "Journal name and volume in italics; the issue in brackets, not italic; an en dash between pages: Journal of Student Wellbeing, 49(2), 101-110. If the article has a digital object identifier, it goes last, as a web address."}, {"q": "How is this four-author work cited in the text?", "a": "By the first surname, the Latin short form for 'and others', and the year, from the very first citation. In running text: 'Kumar and colleagues found …'."}], "yourTurn": [{"q": "You quote one sentence from a particular page of an invented 2019 book by two authors, Patel and Rao. What must the in-text citation contain?", "a": "Both surnames (joined by an ampersand inside brackets, or 'and' in running text), the year, and the page number (written with the abbreviation for page)."}]}
:::

### Writing the results in APA style
"An independent-samples *t* test showed that the yoga group (*M* = 32.4, *SD* = 6.1) reported lower anxiety than the control group (*M* = 38.9, *SD* = 7.0), *t*(58) = 3.83, *p* less than .001, *d* = 0.99, 95% CI [3.1, 9.9]." Report the test, the degrees of freedom, the statistic, the exact p value, an effect size and a confidence interval. APA's **Journal Article Reporting Standards (JARS)** list what each kind of study must report.

:::recall
1. What does IMRaD stand for? || Introduction, Method, Results and Discussion.
2. In APA 7, how do you cite a work with three authors the first time? || The first author's surname, the Latin short form for 'and others', and the year: the short form is used from the very first citation.
3. What is left out of a book reference in APA 7 that was in APA 6? || The publisher's location.
4. Which section of an article must allow exact replication? || The Method section.
5. Name four things a good APA results sentence reports. || The test and df, the statistic, the exact p value, an effect size (and a confidence interval, with descriptive statistics).
:::

:::mcq
Q: In APA 7, a 2020 article by three authors is cited in the text:
- *First surname plus the Latin short form for 'and others', from the start
- With all three surnames every time
- With all three surnames the first time, then the short form after that
- With the first surname and the English words 'and others', every time it is cited
> APA 7 uses the short form from the first citation for three or more authors.

Q: Limitations of the study are usually discussed in the:
- Method
- Results
- Abstract only
- *Discussion
> Interpretation, limitations and implications belong in the Discussion.

Q: The numbered referencing style used by many medical journals is:
- APA
- MLA
- *Vancouver
- Harvard (author-date)
> References are numbered in the order they are cited.
:::

## 3.5 Claims versus evidence: psychokinesis, replication and open science [core][advanced]
How should a scientist treat a startling claim, such as that the mind can move objects or influence dice (**psychokinesis**, PK), or that people can sense the future? The answer is not to sneer, and not to believe, but to **test it with the strongest methods available**. The history of these tests teaches more research methods than almost any other topic.

### A short history
- **J. B. Rhine** at Duke University (1930s) ran card-guessing (Zener cards) and dice-throwing studies and reported scores above chance. Critics found sensory leakage (cards visible from the back), poor randomisation, recording errors and **selective reporting**; independent labs often failed to replicate.
- The **Princeton Engineering Anomalies Research (PEAR)** lab (1979 to 2007) asked people to "influence" random number generators. Over millions of trials it reported a tiny deviation from chance. A large meta-analysis in 2006 found the effect was extremely small, varied wildly between studies and fitted a pattern of **small-study and publication bias**: small studies showed the biggest effects.
- **Ganzfeld** telepathy studies (mild sensory deprivation) produced long debates (in 1986 the sceptic Ray Hyman and the parapsychologist Charles Honorton issued a joint statement), ending in agreement on stricter methods rather than agreement on the effect.
- In 2011, Daryl **Bem** published nine experiments in a top social psychology journal claiming that people could feel future events. Attempts by other teams to repeat them failed. The episode helped trigger psychology's **replication crisis**, because Bem had used methods that were standard at the time.

### What went wrong, and what it taught everyone
- **Base rates and priors:** "Extraordinary claims require extraordinary evidence" (popularised by Carl Sagan, echoing Hume and Laplace). A claim that would overturn physics needs far stronger evidence than one that fits what we know.
- **Researcher degrees of freedom:** In 2011 Joseph Simmons, Leif Nelson and Uri Simonsohn showed that flexible choices (when to stop collecting data, which measures to report, which outliers to drop) can push the false-positive rate from 5% to over 60%.
- **Publication bias:** journals publish "hits"; failures sit in file drawers (Rosenthal's **file-drawer problem**). A **funnel plot** of study size against effect size reveals it.
- **Low power:** small studies that find an effect usually **overestimate** it (the winner's curse).
- **The replication crisis:** in 2015 the **Open Science Collaboration**, a large team of researchers, repeated 100 published psychology studies; about 36% gave significant results again, with effects about half the original size. John Ioannidis had argued in 2005 that "most published research findings are false" when studies are small, effects are small and flexibility is high.

:::widget flow
{"title": "How the literature gets inflated", "layout": "cycle", "nodes": [{"id": "n0", "label": "Small studies", "detail": "Low power"}, {"id": "n1", "label": "Flexible analysis", "detail": "Many ways to reach p below .05"}, {"id": "n2", "label": "Only hits published", "detail": "Failures stay in the file drawer"}, {"id": "n3", "label": "Inflated effects", "detail": "The published record overstates the truth"}, {"id": "n4", "label": "New studies planned on them", "detail": "Underpowered again"}], "caption": "Open-science fixes break this loop at each step."}
:::

### The fixes: open science
- **Preregistration:** hypotheses, sample size and analysis plan are posted publicly before data collection (on OSF, AsPredicted, or CTRI for trials).
- **Registered reports:** the journal peer-reviews and accepts the method **before** results exist, so publication does not depend on the result (first offered by a neuroscience journal in 2013).
- **Open data and materials**, so anyone can check and reanalyse.
- **Larger samples and multi-lab replications.**
- **Reporting effect sizes and confidence intervals**, not only p values; equivalence testing to show an effect is negligible.
- **Adversarial collaboration:** sceptics and proponents design a study together and agree in advance what result would count against each side.

:::widget decide
{"scene": "A wellness company in Bengaluru claims its 'intention pendant' lets wearers improve exam scores by 15% through 'focused mental energy'. It shows testimonials and one study of 20 students who wore it and scored higher than last year.", "ask": "What study would give a fair test?", "choices": [{"label": "A preregistered, double-blind RCT: students randomly get the real pendant or an identical dummy; raters do not know who got which; sample size set by power analysis; outcome and analysis fixed in advance.", "verdict": "best", "outcome": "The real and dummy groups do not differ. Both improve slightly from last year (practice and maturation).", "why": "Randomisation, blinding, a placebo control and preregistration remove the alternative explanations the company's study left open."}, {"label": "Collect more testimonials from satisfied customers.", "verdict": "harm", "outcome": "Thousands of glowing reviews, no information about cause.", "why": "Testimonials suffer from selection, placebo effects and survivorship: unhappy buyers don't write in."}, {"label": "Repeat the same before-and-after study with 200 students.", "verdict": "ok", "outcome": "Scores rise again, but history, maturation and expectation still explain it.", "why": "A larger sample does not fix a design with no control group."}]}
:::

:::note Respect, not ridicule
Studying unusual claims carefully is good science. Parapsychology was among the first fields to use blind procedures, meta-analysis and preregistration (the Koestler Parapsychology Unit ran a study registry from 2012). The lesson for students is that **the methods that test a strange claim are the same methods that test an ordinary one**: if they let a strange claim through, they were too weak for ordinary claims too.
:::

:::recall
1. What did the Open Science Collaboration's 2015 replication project find? || About 36% of 100 studies replicated with significant results, with effects about half the original size.
2. What is the file-drawer problem? || Non-significant studies go unpublished, so the published literature overstates effects.
3. Preregistration versus a registered report. || Preregistration: the plan is posted publicly before data collection. Registered report: the journal reviews and accepts the plan before results exist.
4. Why do small studies that find effects tend to overestimate them? || Only large chance deviations reach significance in small samples, so the published ones are the inflated ones (winner's curse).
5. Name three researcher degrees of freedom. || When to stop data collection, which measures or conditions to report, which outliers to exclude (also covariates and subgroups).
:::

:::mcq
Q: A funnel plot of studies is lopsided, with small studies showing only large positive effects. This suggests:
- *Publication or small-study bias
- A very strong real effect that small studies detect best
- Perfect replication
- High inter-rater reliability
> Small negative or null studies are missing.

Q: Proposing a hypothesis after seeing the data and presenting it as if predicted is:
- Preregistration
- Triangulation
- Member checking
- *HARKing
> Hypothesising After the Results are Known.

Q: Which practice most directly stops publication from depending on whether results are significant?
- Larger samples
- Open data
- *Registered reports
- Using one-tailed tests
> Acceptance comes before the results exist.
:::

## 3.6 Putting it together: critiquing a study [core][advanced]
Exams at every level, and every viva, ask you to **critique** a study. Use the same five questions every time.
1. **Question and constructs:** is the problem clear, and are the variables well defined and well measured (reliability, validity, cultural fit)?
2. **Sample:** who, how chosen, how many, and to whom can it generalise? Was power planned?
3. **Design and internal validity:** could anything other than the IV explain the result? Walk through the threats.
4. **Analysis and statistical conclusion validity:** right test, assumptions met, effect sizes, multiple testing, missing data handled (intention-to-treat)?
5. **Ethics and reporting:** consent, harm, conflicts of interest, preregistration, complete reporting.

:::widget worked
{"title": "Critique: a yoga trial for depression", "steps": [{"q": "A hospital in Rishikesh reports: '60 consecutive outpatients with depression chose either yoga (n = 35) or no yoga (n = 25). After 8 weeks, the yoga group's Hamilton scores fell more (p = .04). Raters knew group membership. 12 yoga and 2 control patients dropped out and were excluded. Conclusion: yoga cures depression.' Start with the design.", "a": "Participants chose their group: no random assignment, so this is a non-equivalent control group design (quasi-experimental). Selection is the main threat: motivated or less ill patients may have chosen yoga."}, {"q": "What about the measurement?", "a": "Raters knew the groups: experimenter expectancy threatens construct validity. A blind rater, and ideally a self-report measure as well, would help."}, {"q": "What about the drop-outs?", "a": "Differential attrition (12 of 35 versus 2 of 25), and drop-outs were excluded. If those who didn't improve left the yoga group, the remaining yoga patients look better. This needs intention-to-treat analysis."}, {"q": "What about the statistics and the conclusion?", "a": "p = .04 from a small sample with no effect size or confidence interval; we cannot judge the size of the benefit. 'Cures' overstates even a significant difference in symptom scores. Were other outcomes tested and not reported?"}, {"q": "Redesign it in one sentence.", "a": "A preregistered RCT with power-based sample size, random assignment by an outside person, an active control (for example, health education classes matched for time and attention), blind raters, intention-to-treat analysis, effect sizes with confidence intervals and follow-up after the course ends."}], "yourTurn": [{"q": "A survey of 300 Instagram users recruited through a fitness influencer's page finds that more time on Instagram goes with more body dissatisfaction (r = .35). The authors write that 'Instagram causes body dissatisfaction in Indian youth.' Name three problems.", "a": "Correlation cannot show direction (dissatisfied people may use it more) or rule out third variables (for example, existing eating concerns). The sample is non-probability and biased toward fitness-focused users, so it cannot represent 'Indian youth'. Self-reported screen time is often inaccurate, a measurement validity problem."}]}
:::

:::recall
1. Give the five questions for critiquing any study. || Constructs and measures; sample; design and internal validity; analysis; ethics and reporting.
2. What is intention-to-treat analysis? || Analysing everyone in the group they were randomised to, whether or not they completed treatment, so drop-out does not bias the comparison.
3. Why use an active control rather than a waiting list? || To control for attention, expectation and contact time, so the specific ingredient is tested.
:::

:::mcq
Q: In a therapy trial, more patients drop out of the treatment arm than the control arm, and the authors analyse only completers. The main problem is:
- Low reliability of the outcome scale
- Too much statistical power from the large control arm
- Cohort effects
- *Biased results from differential attrition
> Completers-only analysis can make treatment look better than it is.

Q: A depression trial uses "health education classes of the same length" as the comparison condition. This is meant to control for:
- *Non-specific effects such as attention
- Sampling error
- Instrumentation
- Maturation of the patients only, over the trial period
> An active control matches the non-specific ingredients.
:::
`;
