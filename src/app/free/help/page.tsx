import type { Metadata } from "next";
import Link from "next/link";
import { CrisisLine } from "@/components/free/free-shell";
import s from "@/components/free/free.module.css";

export const metadata: Metadata = {
  title: "Psychologist, psychiatrist or counsellor? A plain guide · VIBHA",
  description: "Who does what in mental health care in India, when to see each, and what to do in a crisis. Written by VIBHA School of Psychology.",
  alternates: { canonical: "/free/help" },
};

const WHO = [
  {
    title: "Psychiatrist",
    tag: "Medical doctor (MBBS + MD/DNB Psychiatry)",
    does: ["Diagnoses mental illness", "Prescribes and adjusts medicines", "Checks for physical causes", "Handles emergencies and admission"],
    when: "Severe low mood, thoughts of suicide, hearing voices, mania, severe anxiety or OCD, addiction, or when therapy alone isn't enough.",
  },
  {
    title: "Clinical psychologist",
    tag: "RCI-registered (M.Phil in Clinical Psychology or equivalent)",
    does: ["Psychological assessment and testing", "Diagnosis", "Evidence-based therapy (CBT, DBT and others)", "Works alongside psychiatrists"],
    when: "Depression, anxiety, panic, OCD, trauma, personality difficulties, or when you want a formal assessment.",
  },
  {
    title: "Counsellor / counselling psychologist",
    tag: "MA/MSc in Psychology or Counselling",
    does: ["Talk-based support", "Stress, relationships, life changes", "Study and career worries", "Coping skills"],
    when: "Everyday stress, grief, relationship problems, adjustment, or when you want someone to talk things through with.",
  },
] as const;

const SOON = [
  "Low mood, worry or poor sleep most days for more than two weeks",
  "It's affecting your studies, work or relationships",
  "You're using alcohol or other substances to cope",
  "People close to you are worried about you",
  "A self-check on this site suggested talking to someone",
];

const NOW = [
  "Thoughts of ending your life, or a plan to",
  "Hurting yourself, or wanting to",
  "Hearing or seeing things others don't, or feeling unsafe",
  "Not eating, drinking or sleeping for days",
  "Sudden confusion, especially in an older person",
];

export default function HelpGuide() {
  return (
    <>
      <section className={s.hero}>
        <div className={s.wrap}>
          <Link href="/free" className={s.tag} style={{ textDecoration: "none" }}>
            ← Free tools
          </Link>
          <h1 className={s.h1}>
            Who should you see? <em>A plain guide.</em>
          </h1>
          <p className={s.lede}>Psychologist, psychiatrist or counsellor: what each one does, when to go, and what to do if it can&apos;t wait.</p>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap}>
          <ul className={s.cards}>
            {WHO.map((w, i) => (
              <li key={w.title} className={`${s.card} ${i === 0 ? s.cardInk : i === 1 ? s.cardLime : ""}`}>
                <span className={s.cardMeta}>{w.tag}</span>
                <h2 className={s.cardTitle}>{w.title}</h2>
                <ul className={`${s.ticks} ${s.cardText}`} style={{ display: "grid", gap: 4 }}>
                  {w.does.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className={s.cardText}>
                  <b>See one for:</b> {w.when}
                </p>
              </li>
            ))}
          </ul>
          <p className={s.note}>
            Check a clinical psychologist&apos;s registration on the Rehabilitation Council of India (RCI) website. Many
            people start with whoever they can reach first; a good professional will refer you on if someone else fits
            better.
          </p>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={s.cards}>
            <div className={s.box}>
              <h3>Book an appointment soon if…</h3>
              <ul className={s.ticks}>
                {SOON.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className={s.box} style={{ borderColor: "var(--red)" }}>
              <h3>Get help today if…</h3>
              <ul className={s.ticks}>
                {NOW.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <CrisisLine />
          </div>
          <div className={s.btnRow} style={{ marginTop: 24 }}>
            <Link href="/free#tests" className={`${s.btn} ${s.btnLime}`}>
              Take a free self-check
            </Link>
            <Link href="/free#calm" className={`${s.btn} ${s.btnWhite}`}>
              Try a calm exercise
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
