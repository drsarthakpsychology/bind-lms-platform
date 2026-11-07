/**
 * Topics for the question bank. Authors tag questions with fine topic slugs
 * (some subjects have hundreds, most with one question each), so the bank
 * groups them into a short list of exam topics per subject. Each group has a
 * plain title, a pattern over the slugs (first match wins) and where to learn
 * it in Study ("module" or "module/section", best first). Slugs no pattern
 * names fall into "More <subject>", so new questions always show up. Pure.
 */
import type { PrepQuestion, Subject } from "./types";

export type TopicGroup = { id: string; title: string; match: RegExp; learn: readonly string[] };

const g = (id: string, title: string, match: RegExp, ...learn: string[]): TopicGroup => ({ id, title, match, learn });

export const TOPIC_GROUPS: Record<Subject, readonly TopicGroup[]> = {
  "research-methods": [
    g("variables-hypotheses", "Variables and hypotheses", /^(variables-hypotheses|hypothesis-testing)$/, "research-methods/1-2", "research-methods/1-3"),
    g("sampling", "Sampling", /^sampling$/, "research-methods/2-1"),
    g("measurement", "Measurement and observation", /^(measurement-scales|observation-reliability)$/, "research-methods/2-2"),
    g("experiments", "Experiments and control", /^experimental-design$/, "research-methods/2-3"),
    g("validity", "Validity and its threats", /^validity-threats$/, "research-methods/2-4"),
    g("other-designs", "Quasi, single-case and developmental designs", /^(quasi-experimental|single-case|developmental-designs)$/, "research-methods/2-5"),
    g("non-experimental", "Correlational and survey designs", /^correlational-design$/, "research-methods/2-6"),
    g("qualitative", "Qualitative and mixed methods", /^(qualitative-methods|mixed-methods)$/, "research-methods/3-1", "research-methods/3-2"),
    g("meta-analysis", "Meta-analysis and evidence", /^meta-analysis$/, "research-methods/3-2"),
    g("ethics", "Research ethics", /ethic/, "research-methods/3-3"),
    g("writing", "APA style and writing up", /^apa-writing$/, "research-methods/3-4"),
  ],
  statistics: [
    g("descriptives", "Describing data", /^descriptives$/, "statistics/1-3", "statistics/1-4"),
    g("normal", "The normal curve", /^normal-distribution$/, "statistics/2-1"),
    g("probability", "Probability and estimation", /^(probability|estimation)$/, "statistics/2-2"),
    g("hypothesis-testing", "Hypothesis testing and errors", /^error-types$/, "statistics/2-3"),
    g("correlation", "Correlation", /^correlation$/, "statistics/2-4"),
    g("t-test", "t-tests", /^t-test$/, "statistics/2-5"),
    g("chi-square", "Chi-square", /^chi-square$/, "statistics/2-6"),
    g("anova", "ANOVA", /^anova$/, "statistics/3-1"),
    g("non-parametric", "Non-parametric tests", /^non-parametric$/, "statistics/3-3"),
    g("effect-size", "Effect size and power", /^effect-size-power$/, "statistics/3-4"),
    g("regression", "Regression", /^regression$/, "statistics/3-5"),
    g("reliability", "Reliability by the numbers", /^reliability$/, "statistics/3-6"),
    g("factor-analysis", "Factor analysis and SEM", /^(factor-analysis|sem)$/, "statistics/3-7"),
    g("spss", "Reading output and choosing a test", /^spss-output$/, "statistics/3-8"),
  ],
  "psychometrics-assessment": [
    g("reliability", "Reliability and test theory", /^(reliability|classical-test-theory|standard-error-of-measurement|generalizability-theory)$/, "assessment/1-2", "assessment/2-1"),
    g("validity", "Validity and decisions", /^(validity|clinical-decision)$/, "assessment/1-3"),
    g("norms", "Norms, scaling and test types", /^(norms-standardisation|scaling|test-types)$/, "assessment/1-4"),
    g("items", "Item analysis, IRT and bias", /^(item-|test-bias)/, "assessment/3-2"),
    g("intelligence", "Intelligence tests", /^(intelligence-|indian-tests)/, "assessment/2-2"),
    g("objective-personality", "Personality inventories (MMPI, 16PF, NEO)", /^(mmpi|mcmi|16pf|neo-pi-r|epq|personality-assessment|interest-inventories)$/, "assessment/2-3"),
    g("projective", "Projective tests", /^(rorschach|tat|sentence-completion|drawing-tests|projective-general)$/, "assessment/2-4"),
    g("rating-scales", "Rating scales and interviews", /^(rating-scales|diagnostic-interviews)$/, "assessment/2-5"),
    g("neuropsych", "Neuropsychological tests", /^(bender-gestalt|wcst|executive-tests|neuropsych-|memory-tests|cognitive-screening|performance-validity)/, "assessment/2-6"),
    g("report-ethics", "Reports and testing ethics", /^(report-writing|test-ethics)$/, "assessment/3-6", "assessment/3-7"),
  ],
  cognitive: [
    g("memory-stores", "Memory stores and working memory", /^(memory-models|sensory-memory|short-term-memory|working-memory|levels-of-processing)$/, "learning-memory/3-1", "learning-memory/3-2"),
    g("long-term-memory", "Long-term memory and forgetting", /^(long-term-memory|encoding-retrieval|implicit-memory|semantic-memory|autobiographical-memory|prospective-memory|consolidation|forgetting|false-memory|amnesia)$/, "learning-memory/3-3", "learning-memory/3-4"),
    g("language", "Language", /^(language|aphasia|reading|speech-|sentence-processing)/, "thinking-language/2-6"),
    g("concepts", "Concepts and knowledge", /^(concept-formation|knowledge-representation|imagery)$/, "thinking-language/2-1"),
    g("reasoning", "Reasoning and problem solving", /^(reasoning|problem-solving|expertise)$/, "thinking-language/2-2", "thinking-language/2-3"),
    g("decisions", "Decisions, heuristics and biases", /^decision-making$/, "thinking-language/2-4"),
    g("metacognition", "Metacognition and creativity", /^(metacognition|creativity)$/, "thinking-language/2-5", "thinking-language/3-4"),
    g("neuroscience", "Cognitive neuroscience", /^cognitive-neuroscience$/, "brain/3-4"),
  ],
  "perception-attention": [
    g("psychophysics", "Psychophysics and thresholds", /^psychophysics$/, "sensation-perception/2-1"),
    g("signal-detection", "Signal detection theory", /^signal-detection$/, "sensation-perception/2-2"),
    g("senses", "The senses", /^(sensation|audition|pain|colour-vision)$/, "sensation-perception/2-3", "sensation-perception/2-4"),
    g("perception", "Organisation, depth, motion and illusions", /^(perceptual-|depth-perception|motion-perception|illusions)/, "sensation-perception/2-8"),
    g("theories", "Theories of perception and culture", /^(theories-of-perception|perception-motivation-culture)$/, "sensation-perception/3-1", "sensation-perception/3-2"),
    g("selective-attention", "Selective attention", /^(selective-attention|spatial-attention)$/, "sensation-perception/2-5"),
    g("capacity", "Capacity, automaticity and search", /^(attention-capacity|divided-attention|automaticity|visual-search|vigilance)$/, "sensation-perception/2-6"),
    g("attention-science", "Attention networks and awareness", /^(attention-networks|awareness)$/, "sensation-perception/3-3"),
  ],
  "learning-motivation-emotion": [
    g("classical", "Classical conditioning", /^(classical-conditioning|rescorla-wagner|biological-constraints|non-associative-learning|learning-history)$/, "learning-memory/2-1", "learning-memory/4-1"),
    g("operant", "Operant conditioning and behaviour change", /^(behaviour-therapy|operant-conditioning|schedules-of-reinforcement|matching-law|punishment|avoidance-learning|learned-helplessness)$/, "learning-memory/2-2", "learning-memory/2-3"),
    g("cognitive-learning", "Observational and cognitive learning", /^(observational-learning|cognitive-learning|learning-theories)$/, "learning-memory/2-4"),
    g("motivation", "Theories of motivation", /^(motivation-theories|arousal|incentive|hunger-thirst|sexual-motivation|motivational-conflict)$/, "motivation-emotion/1-1", "motivation-emotion/1-2"),
    g("goals", "Goals, achievement and self-determination", /^(achievement-motivation|attribution|self-determination|intrinsic-motivation|goal-setting|self-regulation|affiliation)$/, "motivation-emotion/2-1", "motivation-emotion/2-2"),
    g("emotion", "Theories of emotion", /^(emotion-theories|appraisal|emotion-structure)$/, "motivation-emotion/1-3", "motivation-emotion/2-5"),
    g("emotion-more", "Expression, regulation and the emotional brain", /^(emotional-|emotion-)/, "motivation-emotion/2-6", "motivation-emotion/3-1"),
  ],
  biological: [
    g("neurons", "Neurons and the action potential", /^neurons/, "brain/2-1"),
    g("neurotransmitters", "Neurotransmitters and receptors", /^neurotransmitters/, "brain/2-3"),
    g("neuroanatomy", "Neuroanatomy", /^neuroanatomy$/, "brain/3-1"),
    g("lateralisation", "Two hemispheres", /^lateralisation$/, "brain/4-5"),
    g("endocrine", "Hormones and the stress axis", /^endocrine/, "brain/4-3"),
    g("sleep", "Sleep and EEG", /^sleep/, "brain/4-4"),
    g("imaging", "Brain imaging and stimulation", /^neuroimaging$/, "brain/6-3"),
    g("genetics", "Behaviour genetics", /^behaviour-genetics$/, "brain/5-6"),
    g("pharmacology", "Psychopharmacology", /^psychopharmacology$/, "brain/2-7"),
  ],
  developmental: [
    g("piaget", "Piaget", /^piaget$/, "lifespan/2-1"),
    g("vygotsky", "Vygotsky and information processing", /^(vygotsky|information-processing)$/, "lifespan/2-2"),
    g("psychosocial", "Erikson and Freud's stages", /^(erikson|freud-psychosexual)$/, "lifespan/2-3"),
    g("attachment", "Attachment", /^attachment$/, "lifespan/2-4"),
    g("moral", "Moral development", /^kohlberg$/, "lifespan/2-5"),
    g("language", "Language development", /^language-development$/, "lifespan/2-6"),
    g("context", "Ecological systems and research designs", /^(bronfenbrenner|research-designs|lifespan)$/, "lifespan/1-2", "lifespan/1-3"),
    g("adolescence", "Adolescence and adulthood", /^(adolescence|adulthood)/, "lifespan/3-1", "lifespan/3-2"),
    g("ageing", "Ageing, death and grief", /^(ageing|cognitive-ageing|death-grief)$/, "lifespan/3-3", "lifespan/3-5"),
  ],
  social: [
    g("attribution", "Attribution", /^attribution$/, "social/1-3"),
    g("attitudes", "Attitudes and dissonance", /^(attitudes|cognitive-dissonance)$/, "social/1-4", "social/2-1"),
    g("persuasion", "Persuasion", /^persuasion$/, "social/2-1"),
    g("conformity", "Conformity and obedience", /^(conformity-obedience|obedience|roles-deindividuation)$/, "social/2-2", "social/2-3"),
    g("groups", "Groups and group decisions", /^(group-processes|group-decisions)$/, "social/2-4"),
    g("prejudice", "Prejudice", /^prejudice$/, "social/3-1"),
    g("helping", "Helping and the bystander", /^prosocial-bystander$/, "social/3-3"),
    g("aggression", "Aggression", /^aggression$/, "social/3-4"),
    g("attraction", "Attraction and relationships", /^interpersonal-attraction$/, "social"),
    g("india", "Social psychology in India", /^indian-social-psychology$/, "social/3-5"),
  ],
  "personality-theories": [
    g("freud", "Freud and psychoanalysis", /^psychoanalytic$/, "defences/1-2", "psychodynamics/1-2"),
    g("neo-freudian", "Jung, Adler and the neo-Freudians", /^(jung|adler|neo-freudian|murray)$/, "psychodynamics"),
    g("object-relations", "Object relations", /^object-relations$/, "psychodynamics/2-2"),
    g("traits", "Types and traits", /^(type-theories|trait-theories|eysenck)$/, "personality-theories/1-2", "personality-theories/1-3"),
    g("big-five", "Big Five and HEXACO", /^(big-five|hexaco)$/, "personality-theories/1-4"),
    g("person-situation", "Person and situation", /^(person-situation|mischel)$/, "personality-theories/2-1", "personality-theories/2-6"),
    g("humanistic", "Rogers, Maslow and the existentialists", /^(humanistic|maslow|existential)$/, "personality-theories/2-2", "personality-theories/2-3"),
    g("social-cognitive", "Bandura, Rotter and Kelly", /^(social-cognitive|rotter|kelly|learning-approaches)$/, "personality-theories/2-5", "personality-theories/2-6"),
    g("biological", "Biological approaches", /^biological-approaches$/, "personality-theories/3-1"),
    g("assessment", "Assessing personality", /^personality-assessment$/, "assessment/2-3"),
  ],
  "history-systems": [
    g("roots", "Roots and early figures", /^(roots|early-figures|historiography|chronology)$/, "foundations/1-3"),
    g("first-schools", "Structuralism and functionalism", /^(structuralism|functionalism)$/, "foundations/2-1"),
    g("behaviourism", "Behaviourism", /^behaviourism$/, "foundations/2-1"),
    g("gestalt", "Gestalt", /^gestalt$/, "foundations/2-2"),
    g("later-schools", "Psychoanalysis, humanism and the cognitive revolution", /^(psychoanalytic-movement|humanistic-movement|cognitive-revolution)$/, "foundations/2-2"),
    g("india", "Psychology in India", /^india-history$/, "foundations/3-1"),
  ],
  psychopathology: [
    g("classification", "Classification and models", /^(abnormality|classification|dsm-|icd11$|dimensional|reliability-validity|models$|aetiology-(basics|general)|biopsychosocial|diathesis|stress-vulnerability|cognitive-models|learning-models|family-models|psychodynamic-models|sociocultural|evolutionary|labelling|other-conditions|specifiers$)/, "exam-prep/3-1"),
    g("psychopathology", "Signs and symptoms", /^(delusion|primary-delusions|overvalued|hallucination|pseudohallucination|illusions|passivity|thought-|formal-thought|first-rank|concrete|affect$|alexithymia|anhedonia|autoscopy|dysmegalopsia|time-experience|self-disorders|phenomenology|psychopathology-|consciousness|insight|negative-symptoms|catatonia|stupor|motor-|psychomotor|speech-disorders|obsessions$)/, "mse-deep/2-2", "mse-deep/2-3"),
    g("mse", "Mental status examination", /^(mse-|assessment-basics|mmse|formulation|differential-diagnosis)/, "mse-deep", "case-sheet"),
    g("psychosis", "Schizophrenia and psychosis", /^(schizo|psychosis|icd11-psychosis|psychotic|brief-psychotic|delusional-disorder|attenuated|first-episode|shared-psychosis|differential-psychosis|aetiology-schizophrenia|genetics-schizophrenia|epidemiology-schizophrenia|expressed-emotion|neurodevelopmental-hypothesis|outcome-india)/, "psychosis/1-2"),
    g("depression", "Depression", /^(mdd|mood-|persistent-depressive|pmdd|dmdd|peripartum|postpartum|seasonal|psychotic-depression|aetiology-depression|psychodynamic-depression|epidemiology-mood|icd11-mood|pseudodementia|bereavement|mixed-features)/, "depression/1-1"),
    g("bipolar", "Bipolar disorder", /^(mania|bipolar|cyclothymia|rapid-cycling|aetiology-bipolar|genetics-bipolar)/, "bipolar/1-1"),
    g("anxiety", "Anxiety disorders", /^(anxiety|gad|panic|agoraphobia|social-anxiety|specific-phobia|separation-anxiety|selective-mutism|epidemiology-anxiety|mse-anxiety)/, "anxiety/1-1"),
    g("ocd", "OCD and related disorders", /^(ocd|obsessive|bdd|hoarding|trichotillomania|tics-compulsions|pandas)/, "ocd/1-2"),
    g("trauma", "Trauma, stress and dissociation", /^(ptsd|complex-ptsd|acute-stress|adjustment|trauma|prolonged-grief|attachment-disorders|dissociative|did$|depersonalisation|ganser|possession)/, "trauma/1-1"),
    g("somatic", "Somatic, eating, sleep and sexual disorders", /^(somatic|conversion|illness-anxiety|factitious|anorexia|bulimia|bed$|arfid|pica|eating|refeeding|body-image|insomnia|narcolepsy|sleep|circadian|parasomnia|rbd|restless|sexual|gender|paraphilic|elimination|ied$|gambling|icd11-somatic)/, "more-disorders"),
    g("substance", "Substance use", /^(sud-|substance|alcohol|opioid|cannabis|caffeine|tobacco|wernicke|medication-induced)/, "substance/2-1"),
    g("personality", "Personality disorders", /^(pd-|personality|icd11-personality|ampd|aspd|bpd|narcissistic|ocpd|schizotypal|psychopathy|defence)/, "personality/1-1"),
    g("neurocognitive", "Delirium and dementia", /^(delirium|neurocognitive|major-mild|ncd-|memory-disorders|huntington)/, "neurocognitive/2-1"),
    g("child", "Child and neurodevelopmental", /^(child|adhd|asd|sld|intellectual|neurodevelopmental|ndd-|odd$|conduct|tics$|pd-children|ptsd-children)/, "child"),
    g("suicide", "Suicide and self-harm", /^(suicide|self-harm|epidemiology-suicide)/, "suicide"),
    g("culture", "Culture and epidemiology in India", /^(cultur|cfi|dhat|koro|anxiety-india|epidemiology|global-burden|nmhs|treatment-gap)/, "more-disorders/2-6"),
  ],
  "clinical-therapies": [
    g("basics", "Therapy basics and the alliance", /^(therapy-|therapist-|alliance|common-factors|contextual-model|empathy|expectancy|allegiance|ruptures|session-structure|psychoeducation|problem-solving|supportive|therapeutic-frame|supervision|rci-training|best-next-step)/, "therapies/1-1"),
    g("behaviour", "Behaviour therapy", /^(systematic-desensitisation|token-economy|premack|behaviour-|operant|classical-conditioning|aversion|flooding|exposure|return-of-fear|modelling|overcorrection|relaxation|applied-tension|biofeedback|habit-reversal|contingency|functional-analysis|social-skills|enuresis|self-instructional|stress-inoculation|erp)/, "therapies/2-1"),
    g("cbt", "CBT and REBT", /^(cbt|cbtp|beck|thought-record|five-areas|core-beliefs|cognitive-|downward-arrow|socratic|behavioural-experiment|levels-of-cognition|rebt|irrational|disputing|healthy-unhealthy|thinking-healthy|unified-protocol|imagery-rescripting|cpt|metacognitive|attention-training|low-intensity|digital-therapy|avatar)/, "therapies/2-2"),
    g("activation", "Behavioural activation", /^(ba-|behavioural-activation)/, "therapies/2-2"),
    g("mi", "Motivational interviewing", /^(mi-|change-talk|righting-reflex|brief-intervention)/, "therapies/2-3"),
    g("ipt", "Interpersonal therapy", /^(ipt|ipsrt|role-)/, "therapies/2-4"),
    g("family", "Family, couples and systemic", /^(family|couples|genogram|bowen|structural|strategic|milan|circular|positive-connotation|double-bind|satir|mri$|mst|fbt|eating-family|cft-|eft-couples|ibct|pcit|narrative|solution-focused)/, "therapies/2-5"),
    g("third-wave", "DBT, ACT and mindfulness", /^(dbt|wise-mind|validation|biosocial|invalidating|chain-analysis|radical-acceptance|act-|creative-hopelessness|experiential-avoidance|mbct|mindfulness|decentering|self-compassion|third-wave|fap|cft)/, "therapies/3-1", "therapies/3-2"),
    g("psychodynamic", "Psychodynamic therapy", /^(psycho(analytic|dynamic)|transference|countertransference|resistance|interpretation|working-through|dream-work|defence-hierarchy|object-relations|kohut|malan|ccrt|brief-dynamic|supportive-expressive|mbt|tfp|projective-identification|bion|schema)/, "psychodynamics/2-5"),
    g("group-humanistic", "Group, humanistic and other therapies", /^(group|yalom|here-and-now|psychodrama|self-help|gestalt|existential|logotherapy|reality-therapy|personal-construct|eft-individual|play-therapy|hypnosis|emdr|multimodal|yoga-therapy|indian-psychotherapy|psychological-first-aid|trauma-|rehabilitation|cognitive-remediation|relapse-prevention|treatment-resistant)/, "therapies/3-4"),
    g("evidence", "Evidence and outcome research", /^(ebp|est-|evidence|efficacy|meta-analysis|network-meta|nnt|non-inferiority|dodo|dose-effect|dismantling|waitlist|clinical-significance|deterioration|dropout|sudden-gains|process-research|mechanisms|lambert|implementation|routine-outcome|single-case|task-sharing|cultural-adaptation|combined-treatment|eysenck|cbt-evidence)/, "therapies/3-5"),
  ],
  counselling: [
    g("person-centred", "Person-centred counselling", /^(core-conditions|actualising|conditions-of-worth|incongruence|upr|congruence|necessary-sufficient|person-centred|rogers|process-scale|focusing)/, "therapies/1-2"),
    g("skills", "Counselling skills", /^(microskills|basic-skills|questions|why-questions|soler|non-verbal|summarising|silence|confrontation|immediacy|self-disclosure|advanced-empathy|empathy-levels|reflection|intentionality|counselling-skills|coping-questions)/, "therapies/1-2"),
    g("process", "The counselling process and Egan", /^(egan|counselling-process|counselling-outcome|counselling-research|evaluation|consultation|solution-focused|bordin|guidance-counselling|peer-counselling)/, "therapies/1-2"),
    g("career", "Career counselling", /^(career|holland|super|ginzberg|parsons|roe|tiedeman|gottfredson|krumboltz|happenstance|scct|life-career)/, "therapies/2-6"),
    g("school", "School and student counselling", /^(school|india-school|exam-stress|bullying|life-skills|tiered-support|pocso|confidentiality-minors)/, "therapies/2-6"),
    g("crisis", "Crisis, grief and suicide", /^(crisis|lethality|safety-planning|qpr|postvention|media-contagion|disaster|roberts|james-gilliland|resilience|grief|children-grief|worden|kubler|continuing-bonds|dual-process|tele-manas)/, "suicide"),
    g("multicultural", "Multicultural counselling", /^(multicultural|cultural|racial|etic-emic|hofstede|intersectionality|microaggressions|social-justice|addressing|acculturation|caste|lgbtq|feminist|disability|spirituality|migrant|language-interpreter|explanatory-models|stigma|help-seeking|indian-counselling|counselling-alcohol-india|older-adults|gender-based)/, "therapies/3-5"),
    g("ethics", "Ethics and special settings", /^(counselling-ethics|competence|boundaries|dual-roles|record-keeping|online-counselling|addictions|harm-reduction|caregiver|premarital)/, "ethics-law/1-4"),
  ],
  health: [
    g("stress", "Stress and its models", /^(selye|lazarus|life-events|daily-hassles|stress-|allostatic|tend-and-befriend|yerkes|job-strain|acculturative|janis)/, "motivation-emotion/2-7", "applied/1-2"),
    g("coping", "Coping and social support", /^(coping|social-support|buffering|hardiness|sense-of-coherence|control|religious|benefit-finding|goodness-of-fit|expressive-writing|social-integration|acceptance|fighting-spirit)/, "motivation-emotion/2-7"),
    g("pni", "Body, immunity and illness", /^(pni|conditioned-immuno|wound|common-cold|vaccine|telomeres|inflammation|glucocorticoid|early-adversity|type-|interheart|whitehall|takotsubo|stress-cardiovascular|stress-immunity)/, "applied/2-1"),
    g("behaviour-change", "Health behaviour models", /^(hbm|tpb|ttm|hapa|com-b|self-efficacy|unrealistic|health-|habit|implementation|intention|decisional|fear-appeals|model-|exercise|restraint|tobacco|relapse-prevention|pmt|screening|advanced-integration)/, "applied/1-2"),
    g("pain", "Pain", /^(gate-control|mcgill|pain|neuromatrix|operant-pain|fear-avoidance|catastrophising|chronic-primary|beecher|placebo)/, "applied/2-1"),
    g("illness", "Illness, adherence and care", /^(sick-role|adherence|intentional|necessity|ley|doctor-patient|common-sense|illness-|acute-chronic|adjustment-tasks|kubler|caregiver|collaborative|self-management|surgery|diabetes|hiv|depression-medical|group-therapy-cancer|response-shift|whoqol|mbsr|biopsychosocial|social-determinants|ice$|ema$|mediation|reverse-causation)/, "applied/2-1"),
  ],
  positive: [
    g("foundations", "What positive psychology is", /^(origins|three-pillars|jahoda|authentic|perma|second-wave|criticisms|keyes|hedonic-eudaimonic)/, "applied/1-3"),
    g("wellbeing", "Happiness and wellbeing", /^(swb|swls|sdt|ryff|wellbeing|subjective|set-point|hedonic|genetics-wellbeing|gene-expression|very-happy|money|income|u-curve|culture-happiness|indian-wellbeing|panas|happiness|affective-forecasting|experiencing|esm|nun-study|perma-measure)/, "applied/1-3"),
    g("emotions", "Positive emotions and flow", /^(broaden|undo|positivity-ratio|savouring|awe|duchenne|flow|autotelic|gratitude|prosocial|acr$)/, "applied/1-3"),
    g("strengths", "Strengths and virtues", /^(via|signature|strengths|wisdom|grit|mindset|hope|forgiveness|self-compassion|meaning|emotional-intelligence|maas|anasakti|triguna)/, "applied/1-3"),
    g("optimism", "Optimism, resilience and interventions", /^(dispositional-optimism|learned-optimism|explanatory|optimism|defensive|resilience|bonanno|kauai|steeling|ptg|penn|socioemotional|ppi|positive-|person-activity)/, "applied/2-2"),
  ],
  organisational: [
    g("motivation", "Work motivation", /^(maslow|herzberg|mcgregor|erg|mcclelland|vroom$|vroom-calc|equity|goal|porter|reinforcement|ob-mod|overjustification|sdt-work|self-efficacy-work|motivation-integration|growth-need|jcm|job-enrichment|mps|job-crafting|theory-classification)/, "applied/1-4"),
    g("leadership", "Leadership", /^(trait-approach|lewin-styles|ohio|managerial-grid|fiedler|situational|path-goal|vroom-yetton|lmx|transformational|transactional|charisma|servant|authentic|ethical-leadership|nurturant|implicit-leadership|substitutes|big-five-leadership|gender-leadership|role-congruity|leadership|abusive|power-bases|globe)/, "applied/1-4", "social/2-5"),
    g("attitudes", "Job attitudes and wellbeing", /^(job-satisfaction|satisfaction|commitment|engagement|burnout|jd-r|eri|role-stress|work-family|affective-events|emotional-labour|psychological-contract|job-embeddedness|evln|ocb|cwb|contextual-performance|dispositional|justice|fair-process|pos$|workplace-mental)/, "applied/2-3"),
    g("selection", "Selection, appraisal and training", /^(job-analysis|validity|selection|structured-interview|interview-types|assessment-centre|adverse-impact|utility|augmentation|big-five-performance|bars|rating-errors|kirkpatrick|transfer)/, "applied/1-4"),
    g("groups-culture", "Groups, culture and change", /^(schein|hawthorne|bank-wiring|taylor|tuckman|belbin|groupthink|social-loafing|lewin-change|kotter|coch-french|competing-values|asa|socialisation|hofstede|indian-work|pareek|kakinada|diversity|psychological-safety|thomas-kilmann|escalation|bounded|human-factors)/, "applied/2-3"),
  ],
  "indian-psychology": [
    g("vedanta", "Upanishads, Gita and ways of knowing", /^(pramana|rasa|upanishads|mahavakyas|gita|panchakosha|katha|antahkarana|anasakti|purushartha|ashrama|karma|self$|indian-thought|states-of-consciousness|consciousness)/, "foundations/2-3", "foundations/2-6"),
    g("samkhya-yoga", "Samkhya and Yoga", /^(samkhya|triguna|yoga|ashtanga|kleshas|vrittis|chitta|integral-yoga)/, "foundations/2-4"),
    g("buddhist", "Buddhism, Jainism and Sufism", /^(buddhist|jain|sufism|mindfulness)/, "foundations/2-5"),
    g("history", "Psychology in India: history and pioneers", /^(history-india|bose|institutes|indian-psychologists|kakar|nandy|rumour|icssr|deprivation|achievement-motivation|guru-chela|indic-influence|ugc-unit1)/, "foundations/3-1", "foundations/3-2"),
    g("indigenous", "Indigenous psychology today", /^(indigenisation|indian-psychology-movement|cultural-concepts|ayurveda|indian-therapy)/, "foundations/3-3", "foundations/3-5"),
    g("tests", "Indian tests and the PASS model", /^(indian-tests|pass)$/, "assessment/2-2"),
  ],
  "ethics-law": [
    g("mhca-basics", "MHCA 2017: definitions and rights", /^mhca-(definitions|history|rights|capacity|informed-consent|confidentiality|registration|authorities|mhrb|duties|sections|timelines|penalties|courts|determination|s115)/, "ethics-law/2-1"),
    g("mhca-directives", "Advance directives and nominated representatives", /^(mhca-(advance|nominated)|advance-directive)/, "ethics-law/2-2"),
    g("mhca-admission", "Admission and emergency care", /^mhca-(admission|emergency|police|prisoners)/, "ethics-law/2-3"),
    g("mhca-treatment", "Prohibited treatments, restraint and research", /^(mhca-(prohibited|restraint|research)|conversion-therapy)/, "ethics-law/2-4"),
    g("confidentiality", "Consent, confidentiality and records", /^(informed-consent|confidentiality|tarasoff|privacy-law|records|telepsychology)/, "ethics-law/2-5"),
    g("codes", "Ethics codes and professional conduct", /^(apa-ethics|ethics-principles|rci|boundaries|dual-relationships|gifts|competence|termination|assessment-ethics|ethics-decision)/, "ethics-law/2-6"),
    g("children", "Children: POCSO and juvenile justice", /^(pocso|jj-act|student-mental-health)/, "ethics-law/3-1"),
    g("disability", "Disability law (RPwD Act)", /^(rpwd-act|ideas)$/, "ethics-law/3-2"),
    g("criminal", "Criminal law and the courtroom", /^(bns|bnss|bsa|insanity|ndps|case-law|indian-laws)/, "ethics-law/3-3"),
    g("research", "Research ethics", /^research-ethics$/, "ethics-law/3-4"),
  ],
  psychopharmacology: [
    g("principles", "How medicines act and move", /(pharmacokinetic|pharmacodynamic|^pk|^pd|absorption|distribution|metabolism|cyp|half-life|clearance|tdm|drug-level|receptor|occupancy|mechanism|principle|basics|pharmacogen|interaction)/, "medicine-profiles/1-1", "pharmacokinetics"),
    g("antidepressants", "Antidepressants", /(antidepress|ssri|snri|tca|tricyclic|maoi|bupropion|mirtazapine|vortioxetine|agomelatine|trazodone|serotonin-syndrome|discontinuation|ketamine|esketamine|zuranolone|treatment-resistant|augmentation|switching)/, "antidepressants", "medicine-profiles/2-1"),
    g("antipsychotics", "Antipsychotics and clozapine", /(antipsych|clozapine|eps|extrapyramidal|nms|neuroleptic|tardive|akathisia|dystonia|parkinsonism|metabolic|prolactin|qtc|depot|lai|long-acting|dopamine|xanomeline)/, "antipsychotics", "medicine-profiles/2-3"),
    g("stabilisers", "Lithium and mood stabilisers", /(lithium|valpro|carbamazepine|oxcarbazepine|lamotrigine|mood-stabil|anticonvulsant|bipolar)/, "stabilisers/1-1", "medicine-profiles/2-5"),
    g("anxiolytics", "Benzodiazepines, sleep and anxiety medicines", /(benzo|hypnotic|z-drug|zolpidem|buspirone|pregabalin|anxiolytic|sedative|insomnia|melatonin|orexin)/, "stabilisers/2-1", "medicine-profiles/2-6"),
    g("other-medicines", "ADHD, dementia and addiction medicines", /(adhd|stimulant|methylphenidate|atomoxetine|dementia|cholinesterase|donepezil|memantine|naltrexone|disulfiram|acamprosate|opioid|buprenorphine|methadone|nicotine|varenicline|substance|anticholinergic|alcohol|wernicke|amyloid|behavioural-symptoms)/, "medicine-profiles"),
    g("special-groups", "Pregnancy, children, older adults and the body", /(pregnan|lactation|perinatal|child|adolescent|elderly|older|geriatric|renal|hepatic|cardiac|special|epilep)/, "medicine-profiles/3-4"),
    g("neuromodulation", "ECT and brain stimulation", /(ect|electroconvulsive|tms|rtms|neuromod|stimulation|dbs)/, "brain/6-3"),
    g("emergencies", "Emergencies and toxicity", /(emergenc|rapid-tranq|toxicity|overdose|poison)/, "medicine-profiles"),
    g("new", "New and emerging treatments", /(new-drug|psychedel|psilocybin|mdma|emerging)/, "frontiers"),
  ],
  "clinical-psychiatry": [
    g("interview", "History, interview and case sheet", /(interview|history|case-sheet|rapport|formulation|premorbid|investigation)/, "interview-mse/1-1", "case-sheet"),
    g("mse", "Mental status examination", /(mse|phenomenolog|first-rank|delusion|hallucination|thought|catatonia|cognition|insight)/, "interview-mse/2-0", "mse-deep"),
    g("psychosis", "Schizophrenia and psychosis", /(schizo|psychos|psychotic)/, "psychosis"),
    g("mood", "Depression and bipolar disorder", /(depress|mood|bipolar|mania|manic|lithium)/, "depression", "bipolar"),
    g("anxiety", "Anxiety, OCD and trauma", /(anxiety|panic|phobi|ocd|obsess|ptsd|trauma|stress|dissociat|somat|conversion)/, "anxiety", "ocd", "trauma"),
    g("substance", "Substance use", /(substance|alcohol|opioid|cannabis|tobacco|withdrawal|delirium-tremens|wernicke|addict)/, "substance"),
    g("organic", "Delirium, dementia and neuropsychiatry", /(delirium|dementia|neurocog|organic|neuropsych|epilep|stroke|head-injury|liaison|consultation|medical)/, "neurocognitive"),
    g("child", "Child and adolescent psychiatry", /(child|adolescen|adhd|autism|asd|intellectual|learning-disorder|enuresis|tic)/, "child"),
    g("personality", "Personality disorders", /(personality|borderline|antisocial|cluster)/, "personality"),
    g("emergencies", "Emergencies, suicide and risk", /(emergenc|suicid|self-harm|risk|agitation|violence|nms|serotonin-syndrome)/, "suicide"),
    g("other-disorders", "Eating, sleep, sexual and other disorders", /(eating|anorexia|bulimia|sleep|insomnia|sexual|gender|impulse|perinatal|postpartum|geriatric|old-age)/, "more-disorders"),
    g("law-practice", "Law, ethics and psychiatric services", /(mhca|law|legal|forensic|capacity|consent|ethic|service|community|rehab|epidemiolog|classification|icd|dsm)/, "ethics-law"),
  ],
  "ugc-paper1": [
    g("teaching", "Teaching aptitude", /^(teaching|evaluation|blooms|microteaching|learner|flanders|online-teaching|online-learning)/, "net-paper1/1-2"),
    g("research", "Research aptitude", /^(research|hypothesis|sampling|referencing|variables|qualitative|ict-research)/, "net-paper1/1-3"),
    g("comprehension", "Comprehension", /^comprehension$/, "net-paper1/1-4"),
    g("communication", "Communication", /^(communication|classroom-communication|barriers|mass-media|organisational-communication|intercultural|johari|nonverbal)/, "net-paper1/1-5"),
    g("maths", "Mathematical reasoning", /^(number|letter-series|coding|profit|interest|time-|percentage|ratio|averages|ages|mixtures|fractions|hcf|boats|clock|calendar|relationships|statistics-basic|venn)/, "net-paper1/2-1"),
    g("logic", "Logical reasoning", /^(square-of-opposition|analogy|syllogism|categorical|argument|deduction|conditionals|fallacies|indian-logic)/, "net-paper1/2-2", "net-paper1/2-3"),
    g("data", "Data interpretation", /^(data-interpretation|data-graphs|data-types)$/, "net-paper1/2-4"),
    g("ict", "ICT", /^(ict|cloud|malware|open-source|data-governance|digital)/, "net-paper1/3-1"),
    g("environment", "People and environment", /^(sdgs|mdgs|energy|pollution|climate|biodiversity|natural-hazards|environment|international-agreements|human-|waste|population|sustainable|development$|memory$)/, "net-paper1/3-2"),
    g("higher-education", "Higher education in India", /^(nep|ancient|oriental|colonial|post-independence|regulators|governance|aishe|nirf|schemes|skill|value|professional|open-education)/, "net-paper1/3-3", "net-paper1/3-4"),
  ],
};

/** The fallback group for slugs no pattern names. */
export const MORE = "more";

export function groupOf(subject: Subject, topic: string): string {
  for (const grp of TOPIC_GROUPS[subject]) if (grp.match.test(topic)) return grp.id;
  return MORE;
}

export function groupTitle(subject: Subject, id: string, subjectTitle: string): string {
  return TOPIC_GROUPS[subject].find((x) => x.id === id)?.title ?? `More ${subjectTitle.toLowerCase()}`;
}

/** Where to learn a group, best first. The "more" group learns from the subject's modules. */
export function groupLearn(subject: Subject, id: string): readonly string[] {
  return TOPIC_GROUPS[subject].find((x) => x.id === id)?.learn ?? [];
}

/** Questions per set. */
export const SET_SIZE = 10;

/** A stable order: easier first, then by id, so Set 1 stays Set 1. */
export function bankOrder(a: PrepQuestion, b: PrepQuestion): number {
  return a.difficulty - b.difficulty || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

export type BankTopic = { id: string; title: string; ids: string[] };

/** The topic list for one subject: groups in their written order, "more" last, empty ones dropped. */
export function topicsOf(subject: Subject, bank: readonly PrepQuestion[], subjectTitle: string): BankTopic[] {
  const by = new Map<string, PrepQuestion[]>();
  for (const q of bank) {
    if (q.subject !== subject) continue;
    const id = groupOf(subject, q.topic);
    by.set(id, [...(by.get(id) ?? []), q]);
  }
  const order = [...TOPIC_GROUPS[subject].map((x) => x.id), MORE];
  return order.flatMap((id) => {
    const list = by.get(id);
    return list?.length ? [{ id, title: groupTitle(subject, id, subjectTitle), ids: [...list].sort(bankOrder).map((q) => q.id) }] : [];
  });
}

/** Split ids into sets of SET_SIZE. */
export function setsOf<T>(ids: readonly T[], size = SET_SIZE): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < ids.length; i += size) out.push(ids.slice(i, i + size));
  return out;
}
