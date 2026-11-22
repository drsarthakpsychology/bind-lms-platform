import type { Area, Opening, Scenario } from "./scenarios";

/**
 * Every "What would you do?" case opens with a free starting picture and
 * has three guided hints on every step (owner, 22 Nov 2026). The rich cases
 * (scenario-rich.ts) carry their own, written for that patient. The rest get
 * these, built from the case's area, who it is, the step's context and the
 * case's objective: 1 the area to think in, 2 what to weigh, 3 narrow it.
 */
const AREA: Record<Area, { where: string; h1: string; h2: string }> = {
  assessment: {
    where: "You are the psychology trainee taking the history.",
    h1: "This is an assessment moment: what do you still need to find out, and how do you ask it well?",
    h2: "Weigh which choice gets real information from this person in their own words, without labelling, leading or skipping a step.",
  },
  risk: {
    where: "You are the psychology trainee, with a supervisor you can reach today.",
    h1: "Think about safety first: who could be harmed, and how soon?",
    h2: "Weigh each choice by what it does about the risk today, not next week, and whether it keeps the person talking to you.",
  },
  emergency: {
    where: "You are the psychology trainee on duty, with doctors nearby.",
    h1: "Ask whether this could be a medical emergency, not only a mental health problem.",
    h2: "Weigh which choice gets the right medical help fastest. Talk, home remedies and waiting all cost time here.",
  },
  crisis: {
    where: "You are the psychology trainee helping in a crisis.",
    h1: "In a crisis, safety and basic needs come before any therapy.",
    h2: "Weigh which choice keeps the person safe and supported right now, without forcing, rushing or dismissing them.",
  },
  treatment: {
    where: "You are the psychology trainee working with the treating team.",
    h1: "Think about what is known to help, and what is yours to do as a psychology trainee.",
    h2: "Weigh each choice by whether it is safe, realistic for this person, and agreed with them and the prescriber.",
  },
  liaison: {
    where: "You are the psychology trainee working with another team or agency.",
    h1: "Another team or agency is involved: think about consent, roles and what they really need from you.",
    h2: "Weigh which choice shares only what is needed, with consent unless there is a real risk, and keeps the person at the centre.",
  },
  "child-family": {
    where: "You are the psychology trainee in a child and family setting.",
    h1: "A child or a family is involved: think about the child's safety and development first.",
    h2: "Weigh which choice brings in the right adults without blaming, silencing or frightening the child.",
  },
  boundaries: {
    where: "You are the psychologist, and the choice is yours to make.",
    h1: "This is about professional boundaries: what keeps the relationship safe and fair for the client?",
    h2: "Ask how each choice would look to the client, to your supervisor and under the RCI code of ethics.",
  },
};

function narrow(s: Scenario): string {
  const o = s.objective.trim().replace(/\.$/, "");
  return `The skill this case tests: ${o.charAt(0).toLowerCase()}${o.slice(1)}.`;
}

/** The starting picture for a case written without one. */
export function openingOf(s: Scenario): Opening {
  if (s.opening) return s.opening;
  const first = s.beats[0];
  return { setting: AREA[s.area].where, lines: [s.who, ...(first?.context ? [first.context] : [])] };
}

/** Adds the starting picture and three hints on every step (keeps any already written). */
export function withGuides(s: Scenario): Scenario {
  const g = AREA[s.area];
  return {
    ...s,
    opening: openingOf(s),
    beats: s.beats.map((b) => (b.hints ? b : { ...b, hints: [g.h1, g.h2, narrow(s)] })),
  };
}
