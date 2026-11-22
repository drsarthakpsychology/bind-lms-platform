import type { QuizItem } from "@/lib/quiz/quiz";

/** The quick check under the ethics dilemmas (moved out of the ethics page; the mobile app uses it too). */
export const ETHICS_QUIZ: QuizItem[] = [
  {
    id: "eq-1",
    type: "would_you_report",
    prompt: "A 14-year-old tells you a relative has been touching her. Would you report?",
    options: [
      "Yes: POCSO mandates reporting to police/Childline, no discretion",
      "Only if the family agrees",
      "Only if she confirms it a second time",
      "No: confidentiality protects it",
    ],
    correct: 0,
    rationale: "POCSO Section 19 imposes a mandatory reporting duty; failure is itself an offence.",
    source: "POCSO 2012, Section 19",
  },
  {
    id: "eq-2",
    type: "standard_vs_common",
    prompt: "A client's advance directive refuses ECT. The family demands it. Which is standard of care?",
    options: [
      "Follow the directive; if the team or family want it set aside, apply to the Mental Health Review Board (standard)",
      "Follow the family's wishes as the 'real' decision-makers (common but wrong)",
      "Ignore the directive as paperwork",
      "Transfer without documenting the conflict",
    ],
    correct: 0,
    isStandardCare: true,
    rationale: "A valid advance directive must be followed. Anyone who wants to set it aside applies to the Mental Health Review Board, which can review, change or cancel it.",
    source: "Mental Healthcare Act 2017, sections 10 and 11",
  },
  {
    id: "eq-3",
    type: "order_steps",
    prompt: "Order the correct steps when a client discloses imminent risk of harm to another person.",
    options: [
      "Explore the plan → involve authorities/support → document the confidentiality break",
      "Document first → then explore the plan",
      "Tell the family first → then decide",
      "Wait for the session to end naturally",
    ],
    correct: 0,
    rationale: "Assess the immediacy and plan, act on the identified risk, then document the proportionate confidentiality break.",
    source: "RCI code of ethics: limits of confidentiality",
  },
];
