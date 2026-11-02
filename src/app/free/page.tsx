import type { Metadata } from "next";
import Link from "next/link";
import { CrisisLine } from "@/components/free/free-shell";
import { CALM_TOOLS } from "@/lib/free/calm";
import { INSTRUMENTS } from "@/lib/free/tests";
import s from "@/components/free/free.module.css";

export const metadata: Metadata = {
  title: "Free mental health self-checks and calm exercises · VIBHA",
  description:
    "Free, private self-checks used by clinicians (PHQ-9, GAD-7, WHO-5, Big Five personality, self-esteem, adult ADHD screener) plus guided breathing, grounding and muscle relaxation. Nothing you answer is stored.",
  alternates: { canonical: "/free" },
};

export default function FreeHub() {
  return (
    <>
      <section className={s.hero}>
        <div className={s.wrap}>
          <span className={`${s.tag} ${s.tagLime}`}>Free for everyone</span>
          <h1 className={s.h1}>
            Check in with yourself. <em>Then breathe.</em>
          </h1>
          <p className={s.lede}>
            The same questionnaires psychologists and psychiatrists use, scored instantly, plus guided exercises to calm
            down. No sign-up. Nothing you answer leaves your phone.
          </p>
          <ul className={s.heroPills}>
            <li>6 validated self-checks</li>
            <li>5 calm exercises</li>
            <li>100% private</li>
            <li>Free, always</li>
          </ul>
        </div>
      </section>

      <section id="tests" className={s.section}>
        <div className={s.wrap}>
          <div className={s.sectionHead}>
            <span className={s.tag}>Self-checks</span>
            <h2 className={s.h2}>Clinically validated questionnaires</h2>
            <p className={s.sub}>
              Each one uses the published questions and scoring. They are screening tools, not a diagnosis. Your result
              tells you whether talking to a professional is a good idea.
            </p>
          </div>
          <ul className={s.cards}>
            {INSTRUMENTS.map((t, i) => (
              <li key={t.id} style={{ display: "flex" }}>
                <Link href={`/free/tests/${t.id}`} className={`${s.card} ${i === 0 ? s.cardLime : ""}`} style={{ flex: 1 }}>
                  <span className={s.cardMeta}>
                    {t.name} · {t.items.length} questions · {t.minutes} min
                  </span>
                  <span className={s.cardTitle}>{t.short}</span>
                  <span className={s.cardText}>{t.measures}.</span>
                  <span className={s.cardText}>For: {t.forWhom}</span>
                  <span className={s.cardGo}>Start →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="calm" className={s.section} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={s.sectionHead}>
            <span className={s.tag}>Calm</span>
            <h2 className={s.h2}>Exercises therapists teach</h2>
            <p className={s.sub}>Short, guided and free. Use them before an exam, after a hard day, or when your mind won&apos;t stop.</p>
          </div>
          <ul className={s.cards}>
            {CALM_TOOLS.map((c, i) => (
              <li key={c.id} style={{ display: "flex" }}>
                <Link href={`/free/calm/${c.id}`} className={`${s.card} ${i % 2 ? "" : s.cardInk}`} style={{ flex: 1 }}>
                  <span className={s.cardIcon} aria-hidden>
                    {c.icon}
                  </span>
                  <span className={s.cardMeta}>{c.minutes}</span>
                  <span className={s.cardTitle}>{c.title}</span>
                  <span className={s.cardText}>{c.text}</span>
                  <span className={s.cardGo}>Open →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={s.cards}>
            <Link href="/free/help" className={`${s.card} ${s.cardLime}`}>
              <span className={s.cardMeta}>Guide</span>
              <span className={s.cardTitle}>Psychologist, psychiatrist or counsellor?</span>
              <span className={s.cardText}>Who does what, when to go, and what to do in a crisis. In plain words.</span>
              <span className={s.cardGo}>Read the guide →</span>
            </Link>
            <Link href="/" className={s.card}>
              <span className={s.cardMeta}>For students</span>
              <span className={s.cardTitle}>Want to learn how clinicians use these?</span>
              <span className={s.cardText}>
                VIBHA&apos;s 16-week programme teaches assessment, diagnosis and treatment planning with real patients.
              </span>
              <span className={s.cardGo}>See the programme →</span>
            </Link>
          </div>
          <div style={{ marginTop: 24 }}>
            <CrisisLine />
          </div>
        </div>
      </section>
    </>
  );
}
