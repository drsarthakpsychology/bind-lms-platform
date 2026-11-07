/**
 * The rule-based half of the grade: which key history and risk questions the
 * student actually asked, and simple rapport counts. Pure and deterministic,
 * so it works with AI switched off and is fully unit-tested. Only the
 * STUDENT's lines are read.
 */
import type { CheckItem } from "./types";

type Rule = { id: string; label: string; why: string; any: RegExp[] };

const rule = (id: string, label: string, why: string, any: RegExp[]): Rule => ({ id, label, why, any });

export const HISTORY_RULES: Rule[] = [
  rule("complaint", "What brought them in, asked openly", "An open start lets the patient tell it their way.", [/what (brings|brought) you/i, /tell me (a bit |more )?(about|what)/i, /how can i help/i, /what('s| is| has) been (happening|going on)/i, /how (are|have) you (been )?(feeling|doing)/i]),
  rule("onset", "When it started and how long", "Onset and duration decide most diagnoses.", [/when did (it|this|that|the|you)/i, /how long/i, /since when/i, /(started|began|start|begin)\b/i, /how many (weeks|months|days|years)/i]),
  rule("why-now", "Why they came now", "Why today often shows the real worry or a new risk.", [/why (now|today)/i, /what made you (come|decide)/i, /(come|coming) (in )?today/i, /why did you come/i]),
  rule("sleep", "Sleep", "Sleep change is a core sign in mood, anxiety and psychosis.", [/sleep/i, /\bnights?\b/i, /insomnia/i]),
  rule("appetite", "Appetite or weight", "Appetite and weight change count towards several diagnoses.", [/appetite/i, /\beat(ing)?\b/i, /\bweight\b/i, /\bfood\b/i, /\bhungry\b/i]),
  rule("mood-interest", "Mood, interest and energy", "Low mood or loss of interest is the gateway question.", [/\bmood\b/i, /enjoy/i, /interest/i, /\benergy\b/i, /\bfeel(ing)? (low|down|sad)/i, /\bhappy\b/i]),
  rule("past", "Past episodes or treatment", "A past episode or past highs change the diagnosis and the plan.", [/\bbefore\b/i, /first time/i, /\bpast\b/i, /\bprevious(ly)?\b/i, /ever (felt|had|been)/i, /treatment/i, /(medicine|medication|tablets?)/i]),
  rule("substance", "Alcohol, smoking or drugs", "Substances can cause or worsen almost any picture.", [/alcohol/i, /\bdrink/i, /\bsmok/i, /tobacco/i, /\bdrugs?\b/i, /ganja|bhang|cannabis|weed/i, /substance/i]),
  rule("medical", "Physical health", "A medical cause has to be ruled out.", [/medical/i, /physical(ly)?/i, /\billness\b/i, /health problems?/i, /\bdoctor\b/i, /thyroid|diabetes|blood pressure|bp\b/i]),
  rule("family", "Family history", "Mental illness in the family raises the odds.", [/(anyone|someone|anybody) (else )?in (your|the) family/i, /family history/i, /(parents?|mother|father|siblings?|relatives?) (ever )?(had|have|suffer)/i, /runs? in (the|your) family/i]),
  rule("social", "Home, work and support", "Function and support shape risk and the plan.", [/\bwork\b|\bjob\b|\boffice\b|college|school|studies/i, /at home/i, /(who|anyone) (do you|can you) (live|talk|turn)/i, /support/i, /\bfriends?\b/i, /\bwife\b|\bhusband\b|\bpartner\b|\bchildren\b|\bkids\b/i]),
];

export const RISK_RULES: Rule[] = [
  rule("death-thoughts", "Thoughts of death or suicide, asked directly", "The one risk question that must never be skipped. Asking plainly does not put the idea in their head.", [/suicid/i, /(end|ending|take|taking) (your|their|my) (own )?life/i, /kill(ing)? yourself/i, /(not|don'?t) (want|wish) to (live|be alive|be here|wake up)/i, /better off (dead|gone|without you)/i, /(hurt|harm)(ing)? yourself/i, /self-?harm/i, /thoughts? (of|about) (dying|death)/i, /life (is|isn'?t) worth/i, /wish(ed)? (you were|to be) dead/i]),
  rule("plan", "A plan or method", "Thoughts with a plan carry much more risk.", [/\bplan(s|ned)?\b/i, /how (would|might) you/i, /\bmethod\b/i, /thought about how/i]),
  rule("intent", "Intent to act", "Intent separates passive wishes from danger.", [/\bintend/i, /act on/i, /going to (do|act)/i, /(would|will) you (do|act)/i, /how (likely|close)/i, /\burge/i]),
  rule("means", "Access to means", "Pills, pesticide or a weapon at home change the plan for safety.", [/access to/i, /\bpills?\b|tablets at home/i, /pesticide|poison/i, /\bweapon|\bknife|\brope\b/i, /at home that/i]),
  rule("past-attempts", "Past attempts or self-harm", "A past attempt is the strongest single predictor.", [/(tried|attempted) (to )?(before|in the past|ever)/i, /\battempt/i, /ever (hurt|harmed|tried)/i, /(done|did) (anything|something) to (hurt|harm)/i]),
  rule("protective", "What keeps them going", "Reasons for living and support are part of every risk check.", [/keeps? you going/i, /reasons? (to|for) (live|living)/i, /(stops?|stopped|holds?) you (back|from)/i, /what helps/i, /(who|anyone) (could|can|would) you (call|talk|turn)/i, /\bsafe\b/i]),
  rule("others", "Risk to others", "Ask about harming anyone else, and about children in their care.", [/(harm|hurt)(ing)? (anyone|someone|others|anybody|other people)/i, /angry enough to/i, /\bviolen/i, /children (are|is) safe|kids (are|is) safe/i]),
];

const OPEN = /^\s*(what|how|tell me|can you tell|could you tell|describe|walk me|in what way|help me understand)\b/i;
const QUESTION = /\?\s*$|^\s*(what|how|why|when|where|who|do|does|did|are|is|have|has|can|could|would|will)\b/i;
const REFLECT = /\b(it sounds like|sounds (really |very )?(hard|difficult|heavy|painful|tough)|it seems|i can see|i can hear|i hear (that|you)|that must (be|have)|makes sense|understandable|thank you for (telling|sharing)|that took courage|you('re| are) (feeling|saying)|so you('re| are| feel| have)|i('m| am) sorry (to hear|that))\b/i;
const REASSURE = /\b(don'?t worry|you('ll| will) be (fine|okay|ok|alright)|everything will be (fine|okay|ok|alright)|nothing to worry|it'?s (nothing|normal|fine)|calm down|cheer up|just (relax|think positive))\b/i;

function check(rules: Rule[], lines: string[]): CheckItem[] {
  return rules.map((r) => {
    const hit = lines.find((l) => r.any.some((re) => re.test(l))) ?? null;
    return { id: r.id, label: r.label, why: r.why, asked: hit !== null, quote: hit ? hit.slice(0, 200) : null };
  });
}

export type Checklist = {
  history: CheckItem[];
  risk: CheckItem[];
  rapport: { reflections: number; openQuestions: number; questions: number; reassurance: string[] };
};

export function runChecklist(transcript: { role: "student" | "patient"; content: string }[]): Checklist {
  const lines = transcript.filter((t) => t.role === "student").map((t) => t.content.trim()).filter(Boolean);
  const questions = lines.filter((l) => QUESTION.test(l));
  return {
    history: check(HISTORY_RULES, lines),
    risk: check(RISK_RULES, lines),
    rapport: {
      reflections: lines.filter((l) => REFLECT.test(l)).length,
      openQuestions: questions.filter((l) => OPEN.test(l)).length,
      questions: questions.length,
      reassurance: lines.filter((l) => REASSURE.test(l)).slice(0, 3).map((l) => l.slice(0, 200)),
    },
  };
}

/**
 * Risk score 0..1. Asking about thoughts of death carries half the marks;
 * the follow-ups (plan, intent, means, past attempts, protective factors,
 * others) share the rest.
 */
export function riskScore(items: CheckItem[]): number {
  const core = items.find((i) => i.id === "death-thoughts")?.asked ? 0.5 : 0;
  const rest = items.filter((i) => i.id !== "death-thoughts");
  return core + (rest.length ? (0.5 * rest.filter((i) => i.asked).length) / rest.length : 0);
}

/** Rapport score 0..4 from the counts alone (used when the AI can't check). */
export function rapportFromCounts(r: Checklist["rapport"]): number {
  const openShare = r.questions ? r.openQuestions / r.questions : 0;
  const s = 1 + Math.min(1.5, r.reflections * 0.5) + Math.min(1.5, openShare * 2) - Math.min(1.5, r.reassurance.length * 0.75);
  return Math.max(0, Math.min(4, Math.round(s * 2) / 2));
}
