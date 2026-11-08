import type { InterviewQuestion, PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS as q_researchMethods } from "./research-methods";
import { QUESTIONS as q_statistics } from "./statistics";
import { QUESTIONS as q_psychometricsAssessment } from "./psychometrics-assessment";
import { QUESTIONS as q_cognitive } from "./cognitive";
import { QUESTIONS as q_perceptionAttention } from "./perception-attention";
import { QUESTIONS as q_learningMotivationEmotion } from "./learning-motivation-emotion";
import { QUESTIONS as q_biological } from "./biological";
import { QUESTIONS as q_psychopharmacology } from "./psychopharmacology";
import { QUESTIONS as q_clinicalPsychiatry } from "./clinical-psychiatry";
import { QUESTIONS as q_developmental } from "./developmental";
import { QUESTIONS as q_social } from "./social";
import { QUESTIONS as q_personalityTheories } from "./personality-theories";
import { QUESTIONS as q_historySystems } from "./history-systems";
import { QUESTIONS as q_psychopathology } from "./psychopathology";
import { QUESTIONS as q_clinicalTherapies } from "./clinical-therapies";
import { QUESTIONS as q_counselling } from "./counselling";
import { QUESTIONS as q_health } from "./health";
import { QUESTIONS as q_positive } from "./positive";
import { QUESTIONS as q_organisational } from "./organisational";
import { QUESTIONS as q_indianPsychology } from "./indian-psychology";
import { QUESTIONS as q_ethicsLaw } from "./ethics-law";
import { QUESTIONS as q_ugcPaper1 } from "./ugc-paper1";
import { INTERVIEWS as i_academic } from "./interviews/academic";
import { INTERVIEWS as i_clinicalVignette } from "./interviews/clinical-vignette";
import { INTERVIEWS as i_research } from "./interviews/research";
import { INTERVIEWS as i_ethics } from "./interviews/ethics";
import { INTERVIEWS as i_motivation } from "./interviews/motivation";
import { INTERVIEWS as i_currentAffairs } from "./interviews/current-affairs";
import { INTERVIEWS as i_assessment } from "./interviews/assessment";
import { withVisuals } from "./visuals";

/** Every prep question, with its diagram attached (see ./visuals). Add questions in the subject files, not here. */
export const ALL_QUESTIONS: PrepQuestion[] = withVisuals([...q_researchMethods, ...q_statistics, ...q_psychometricsAssessment, ...q_cognitive, ...q_perceptionAttention, ...q_learningMotivationEmotion, ...q_biological, ...q_developmental, ...q_social, ...q_personalityTheories, ...q_historySystems, ...q_psychopathology, ...q_clinicalTherapies, ...q_counselling, ...q_health, ...q_positive, ...q_organisational, ...q_indianPsychology, ...q_ethicsLaw, ...q_psychopharmacology, ...q_clinicalPsychiatry, ...q_ugcPaper1]);

/** Every mock-interview question. */
export const ALL_INTERVIEWS: InterviewQuestion[] = [...i_academic, ...i_clinicalVignette, ...i_research, ...i_ethics, ...i_motivation, ...i_currentAffairs, ...i_assessment];
