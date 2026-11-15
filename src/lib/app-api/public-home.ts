import * as C from "@/components/home/content";
import { BRAND } from "@/lib/brand";
import { LEGAL } from "@/lib/legal-constants";
import type { PublicHome } from "./contract";

/**
 * GET /public/home: the website homepage's words as data, for the app's
 * Welcome. Every list comes from src/components/home/content.ts (the
 * homepage's own words). The section headings live in the homepage JSX, so
 * they are repeated here and a test checks each one still appears in
 * src/components/home/home-page.tsx, word for word.
 *
 * Left out on purpose: which cohort is running and when it starts (the
 * Welcome does not say it), the free tools and the arcade (not in the
 * visitor area), and design-only fields (tones, cartoon heads, colours).
 */

export const HOME_HEADINGS = {
  hero: { title: ["Don't just study", "Psychology.", "Practise it."] },
  programme: { tag: "What you get", title: "Everything you get", accent: "in 16 weeks." },
  patients: { tag: "Real patients", title: "Not observership.", accent: "You talk to the patient." },
  different: { tag: "Why VIBHA", title: "We don't teach", accent: "what your college teaches." },
  disorders: { tag: "Every disorder, the whole plan", title: "Not just symptoms.", accent: "The whole clinical plan." },
  week: { tag: "Your week", title: "A weekday, a weekend,", accent: "and the whole week." },
  scenarios: { tag: "Every weekend", title: "What do you do", accent: "when…?" },
  faculty: { tag: "Faculty", title: "Taught by people", accent: "who practise it." },
  fees: { tag: "Fees & joining", title: "What it costs.", accent: "How to join." },
  curriculum: { tag: "Curriculum", title: "Seven disciplines.", accent: "All practical." },
  faq: { tag: "FAQ", title: "Still wondering?", accent: "Quick answers." },
  closing: { title: ["Theory ends here.", "Practice begins."] },
} as const;

export const HERO_LEDE =
  "A 16-week clinical training programme where you see real patients, write real treatment plans, and get corrected by psychiatrists. Led by Dr. Sarthak Dave, MBBS, MD (Psychiatry).";

const section = (href: string) => href.replace(/^#/, "");
const tt = (x: { title: string; text: string }) => ({ title: x.title, text: x.text });

export function publicHome(): PublicHome {
  const h = HOME_HEADINGS;
  return {
    v: 1,
    brand: { name: BRAND.name, shortName: BRAND.shortName, tagline: BRAND.tagline, description: BRAND.description, parent: BRAND.parent ?? "", lead: BRAND.lead },
    hero: { title: [...h.hero.title], lede: HERO_LEDE, highlights: [...C.STICKERS], quickAnswers: C.QUICK_ANSWERS.map((x) => ({ q: x.q, a: x.a, section: section(x.href) })) },
    sections: {
      programme: {
        head: h.programme,
        stats: C.STATS.map((x) => ({ n: x.n, text: x.t })),
        included: [...C.INCLUDED],
        beyond: C.BEYOND.map(tt),
        assessment: C.ASSESSMENT.map(tt),
        certificate: C.CERTIFICATE,
        manifesto: C.MANIFESTO,
      },
      patients: { head: h.patients, steps: C.PATIENT_STEPS.map(tt), facts: C.PATIENT_FACTS.map((x) => ({ k: x.k, v: x.v })) },
      different: { head: h.different, rows: C.COLLEGE_VS.map((x) => ({ college: x.college, vibha: x.vibha })) },
      disorders: {
        head: h.disorders,
        journey: { disorder: C.JOURNEY.disorder, patient: C.JOURNEY.patient, steps: C.JOURNEY.steps.map((x) => ({ k: x.k, title: x.title, text: x.text })), foot: C.JOURNEY_FOOT },
        fields: C.DISORDER_FIELDS.map((f) => ({ key: f.key, label: f.label })),
        list: C.DISORDERS.map((d) => {
          const r = d as Record<string, string>;
          return { name: d.name, module: d.module, says: d.says, looks: r.looks ?? "", ask: r.ask ?? "", mse: r.mse ?? "", ruleOut: r.ruleOut ?? "", meds: r.meds ?? "", therapy: r.therapy ?? "", redFlag: r.redFlag ?? null };
        }),
        foot: C.DISORDER_FOOT,
        mixer: C.MIXER.map((m) => ({ who: m.who, age: m.age, plan: m.plan.map((p) => ({ when: p.when, what: p.what })) })),
        mixerNote: C.MIXER_NOTE,
      },
      week: {
        head: h.week,
        weekday: { ...C.DAY.weekday, steps: [...C.DAY.weekday.steps] },
        weekend: { ...C.DAY.weekend, steps: [...C.DAY.weekend.steps] },
        days: C.WEEK.map((d) => ({ d: d.d, kind: d.kind, time: "time" in d ? d.time : null })),
        timeline: C.WEEKS_TIMELINE.map((x) => ({ weeks: x.w, text: x.t })),
      },
      scenarios: { head: h.scenarios, list: C.SCENARIOS.map((x) => ({ when: x.when, learn: [...x.learn] })) },
      faculty: {
        head: h.faculty,
        lead: { ...C.FACULTY_LEAD },
        faculty: C.FACULTY.map((f) => ({ initials: f.initials, name: f.name, role: f.role })),
        leadership: C.LEADERSHIP.map((l) => ({ name: l.name, role: l.role })),
      },
      fees: {
        head: h.fees,
        dependsOn: [...C.FEES.dependsOn],
        pay: [...C.FEES.pay],
        note: C.FEES.note,
        joinSteps: C.JOIN_STEPS.map(tt),
        whoFor: C.WHO_FOR.map(tt),
        colleges: { gets: [...C.COLLEGES.gets], partnering: [...C.COLLEGES.partnering] },
      },
      curriculum: {
        head: h.curriculum,
        disciplines: C.DISCIPLINES.map((d) => ({ name: d.name, text: d.text })),
        modules: C.MODULES.map((m) => ({ n: m.n, title: m.title, text: m.text })),
        interview: C.INTERVIEW.map((x) => ({ title: x.title, items: [...x.items] })),
        mse: C.MSE.map(tt),
        caseSheet: { learn: { title: C.CASE_SHEET.learn.title, items: [...C.CASE_SHEET.learn.items] }, rows: C.CASE_SHEET.rows.map((r) => ({ k: r.k, v: r.v })) },
        medicines: C.MEDICINES.map((m) => ({ group: m.group, names: m.names, watch: m.watch })),
        ruleOut: C.RULE_OUT.map(tt),
        sideOrSymptom: C.SIDE_OR_SYMPTOM.map((x) => ({ q: x.q, a: x.a })),
        redFlags: C.RED_FLAGS,
        therapies: C.THERAPIES.map((t) => ({ name: t.name, text: t.text })),
        mixExample: { patient: C.MIX_EXAMPLE.patient, plan: C.MIX_EXAMPLE.plan.map((p) => ({ when: p.when, what: p.what.map(([name, why]) => ({ name, why })) })) },
        defences: C.DEFENCES.map(tt),
        psychometric: C.PSYCHOMETRIC.map((p) => ({ group: p.group, tests: [...p.tests] })),
        psychometricNote: C.PSYCHOMETRIC_NOTE,
      },
      faq: { head: h.faq, list: C.FAQ.map((x) => ({ q: x.q, a: x.a })) },
      closing: { title: [...h.closing.title] },
    },
    contact: {
      person: C.CONTACT.person,
      role: C.CONTACT.role,
      roleNote: C.CONTACT.roleNote,
      phone: C.CONTACT.phone,
      phoneHref: C.CONTACT.phoneHref,
      whatsappHref: C.CONTACT.whatsappHref,
      email: LEGAL.contactEmail,
      address: [...C.CONTACT.address],
    },
    links: {
      requestInvitation: "/api/app/v1/public/request-invitation",
      policies: [
        { label: "Terms", path: "/policies/terms" },
        { label: "Privacy", path: "/policies/privacy" },
        { label: "Refund", path: "/policies/refund" },
        { label: "Grievance", path: "/policies/grievance" },
        { label: "Disclaimer", path: "/policies/disclaimer" },
      ],
    },
  };
}
