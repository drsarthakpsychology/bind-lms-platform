/**
 * The mock answer for GET /public/home: the bundled Welcome words
 * (src/visitor/content.ts) in the server's PublicHome shape, so the mock
 * build walks the same path as a live phone (fetch, adapt, show). Lists the
 * Welcome screen does not show are empty arrays, as the contract allows.
 */
import * as B from "@/visitor/content";
import type { HomeHead, PublicHome } from "../contract";

const head = (h: { tag: string; title: string; accent: string }): HomeHead => ({ tag: h.tag, title: h.title, accent: h.accent });

export const publicHome: PublicHome = {
  v: 1,
  brand: { name: "VIBHA School of Psychology", shortName: "VIBHA", tagline: "Don't just study Psychology. Practise it.", description: B.HERO.lede, parent: "VIBHA", lead: B.FACULTY.lead.name },
  hero: { title: [...B.HERO.lines], lede: B.HERO.lede, highlights: [...B.STICKERS], quickAnswers: B.QUICK_ANSWERS.map((x) => ({ q: x.q, a: x.a, section: "programme" })) },
  sections: {
    programme: { head: head(B.GET), stats: B.GET.stats.map((x) => ({ n: x.n, text: x.t })), included: [], beyond: [], assessment: [], certificate: B.GET.certificate, manifesto: B.DIFFERENT.manifesto },
    patients: { head: head(B.PATIENTS), steps: B.PATIENTS.steps.map((x) => ({ title: x.title, text: x.text })), facts: [] },
    different: { head: head(B.DIFFERENT), rows: B.DIFFERENT.rows.map((r) => ({ ...r })) },
    disorders: {
      head: head(B.JOURNEY),
      journey: { disorder: B.JOURNEY.disorder, patient: B.JOURNEY.patient, steps: B.JOURNEY.steps.map((x) => ({ k: x.k, title: x.title, text: x.text })), foot: B.JOURNEY.foot },
      fields: [],
      list: [],
      foot: B.JOURNEY.foot,
      mixer: [],
      mixerNote: "",
    },
    week: {
      head: head(B.WEEK),
      weekday: { ...B.WEEK.weekday, steps: [...B.WEEK.weekday.steps] },
      weekend: { ...B.WEEK.weekend, steps: [...B.WEEK.weekend.steps] },
      days: B.WEEK.days.map((d) => ({ d: d.d, kind: d.live ? "live" : "patient", time: d.live ? "8 am" : null })),
      timeline: [],
    },
    scenarios: { head: { tag: "", title: "", accent: "" }, list: [] },
    faculty: { head: head(B.FACULTY), lead: { ...B.FACULTY.lead }, faculty: B.FACULTY.people.map((p) => ({ ...p })), leadership: B.FACULTY.runBy.map((p) => ({ ...p })) },
    fees: { head: head(B.JOIN), dependsOn: [...B.JOIN.dependsOn], pay: [...B.JOIN.pay], note: "", joinSteps: B.JOIN.steps.map((x) => ({ ...x })), whoFor: B.JOIN.who.map((x) => ({ title: x.title, text: x.text })), colleges: { gets: [], partnering: [] } },
    curriculum: {
      head: head(B.DISCIPLINES),
      disciplines: B.DISCIPLINES.items.map((x) => ({ ...x })),
      modules: [],
      interview: [],
      mse: [],
      caseSheet: { learn: { title: "", items: [] }, rows: [] },
      medicines: [],
      ruleOut: [],
      sideOrSymptom: [],
      redFlags: "",
      therapies: [],
      mixExample: { patient: "", plan: [] },
      defences: [],
      psychometric: [],
      psychometricNote: "",
    },
    faq: { head: { tag: "", title: "", accent: "" }, list: [] },
    closing: { title: [B.CLOSING.a, B.CLOSING.b] },
  },
  contact: { person: "Kavya Bothra", role: "Chief Operating Officer", roleNote: "", phone: B.CLOSING.phone, phoneHref: B.CLOSING.phoneHref, whatsappHref: B.CLOSING.whatsappHref, email: "", address: [B.CLOSING.address] },
  links: { requestInvitation: "/public/request-invitation", policies: [] },
};
