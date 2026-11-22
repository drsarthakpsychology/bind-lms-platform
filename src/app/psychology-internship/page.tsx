import type { Metadata } from "next";
import Link from "next/link";
import { archivo, pixel, pixelDigits } from "@/components/home/fonts";
import { CONTACT, COHORT, LINKS, NOT_RCI, PATIENT_STEPS, WHO_FOR } from "@/components/home/content";
import { FunnelCounter } from "@/components/analytics/funnel-counter";
import { CANONICAL_ORIGIN } from "@/lib/seo/canonical-host";
import { BRAND } from "@/lib/brand";
import s from "@/components/free/free.module.css";

const TITLE = "Psychology Internship for Students, Ahmedabad and Online";
const DESCRIPTION =
  "Supervised psychology internship, 90 to 400+ hours. Interview patients in person in Ahmedabad under a psychiatrist, with live online discussions. For students, graduates and anyone curious.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} · ${BRAND.shortName}` },
  description: DESCRIPTION,
  alternates: { canonical: "/psychology-internship" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/psychology-internship" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

/** Every fact here comes from the homepage content file (owner facts, 22 Nov 2026). */
const FACTS = [
  { k: "Hours", v: "90 to 400+ internship hours, you choose" },
  { k: "Length", v: "A few weeks to three months or more, by track" },
  { k: "Where", v: "In person in Ahmedabad, open to every student, plus live online discussions" },
  { k: "Starts", v: COHORT.starts },
] as const;

const HONEST = [
  "Patient interviews happen in person in Ahmedabad. Online, you join the live discussions with psychiatrists, not the patient room.",
  "Weekend live discussions count toward your internship hours.",
  "The internship letter is based on your conduct through the programme. It is not automatic.",
  "You get your exact fee on the call. It depends on things like how many of you join together. Instalments are possible. Fees are not refundable once paid.",
  "There is no age limit and no psychology degree is needed.",
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${CANONICAL_ORIGIN}/psychology-internship`,
  url: `${CANONICAL_ORIGIN}/psychology-internship`,
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "en-IN",
  isPartOf: { "@id": `${CANONICAL_ORIGIN}/#website` },
  about: { "@id": `${CANONICAL_ORIGIN}/#organization` },
};

/**
 * /psychology-internship: the one page for people searching for a psychology
 * internship. Honest: what you do, where, how hours work, what the letter
 * depends on, and what this is not.
 */
export default function PsychologyInternshipPage() {
  return (
    <div className={`${s.root} ${archivo.variable} ${pixel.variable} ${pixelDigits.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FunnelCounter path="/psychology-internship" fallback="internship-top" />
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <header className={s.nav}>
        <div className={`${s.wrap} ${s.navIn}`}>
          <Link href="/" className={s.brand} aria-label="VIBHA School of Psychology, home">
            <b>VIBHA</b>
            <small>School of Psychology</small>
          </Link>
          <Link href={LINKS.apply} data-funnel="internship-top" className={`${s.btn} ${s.btnLime} ${s.btnSm}`}>
            Request an invitation
          </Link>
        </div>
      </header>

      <main id="main">
        <section className={s.hero}>
          <div className={s.wrap}>
            <span className={`${s.tag} ${s.tagLime}`}>Psychology internship</span>
            <h1 className={s.h1}>
              An internship <em>with real patients.</em>
            </h1>
            <p className={s.lede}>
              Interview patients yourself in Ahmedabad, under a psychiatrist&apos;s supervision, and join live online
              discussions every weekend. Led by {BRAND.lead}.
            </p>
            <div className={s.btnRow} style={{ marginTop: 24 }}>
              <Link href={LINKS.apply} data-funnel="internship-top" className={`${s.btn} ${s.btnLime}`}>
                Request an invitation
              </Link>
              <a href={CONTACT.whatsappHref} className={`${s.btn} ${s.btnWhite}`} target="_blank" rel="noopener noreferrer">
                WhatsApp us
              </a>
            </div>
          </div>
        </section>

        <section className={s.section}>
          <div className={s.wrap}>
            <dl className={s.cards}>
              {FACTS.map((f) => (
                <div key={f.k} className={s.box}>
                  <dt className={s.cardMeta}>{f.k}</dt>
                  <dd style={{ margin: "6px 0 0", fontWeight: 800 }}>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={s.section} style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <span className={s.tag}>In the room</span>
              <h2 className={s.h2}>How a patient session works</h2>
            </div>
            <ol className={s.cards}>
              {PATIENT_STEPS.map((p, i) => (
                <li key={p.title} className={`${s.card} ${i === 0 ? s.cardLime : ""}`}>
                  <span className={s.cardMeta}>Step {i + 1}</span>
                  <h3 className={s.cardTitle}>{p.title}</h3>
                  <p className={s.cardText}>{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={s.section} style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <span className={s.tag}>Who it is for</span>
              <h2 className={s.h2}>Anyone who wants practice</h2>
            </div>
            <ul className={s.cards}>
              {WHO_FOR.map((w) => (
                <li key={w.title} className={s.box}>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.section} style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <div className={s.sectionHead}>
              <span className={s.tag}>Good to know</span>
              <h2 className={s.h2}>Straight answers</h2>
            </div>
            <div className={s.box}>
              <ul className={s.ticks}>
                {HONEST.map((h) => (
                  <li key={h}>{h}</li>
                ))}
                <li>{NOT_RCI.replace(/^No\.\s*/, "")}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={s.section} style={{ paddingTop: 0 }}>
          <div className={s.wrap}>
            <div className={`${s.card} ${s.cardInk}`}>
              <span className={s.cardMeta}>{COHORT.label}</span>
              <h2 className={s.cardTitle}>Ask for a seat</h2>
              <p className={s.cardText}>
                Send a request, or call or WhatsApp {CONTACT.phone}. {CONTACT.person} calls you back with your fee and
                dates.
              </p>
              <p className={s.cardText}>{CONTACT.address.join(" ")}</p>
              <div className={s.btnRow} style={{ marginTop: 8 }}>
                <Link href={LINKS.apply} data-funnel="internship-end" className={`${s.btn} ${s.btnLime}`}>
                  Request an invitation
                </Link>
                <a href={CONTACT.phoneHref} className={`${s.btn} ${s.btnWhite}`}>
                  Call {CONTACT.phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.foot}>
        <div className={`${s.wrap} ${s.footIn}`}>
          <p>{BRAND.name}, Ahmedabad. Practical training and supervised internship.</p>
          <nav aria-label="Footer">
            <Link href="/">Home</Link>
            <Link href="/free">Free tools</Link>
            <Link href="/policies">Policies</Link>
            <Link href={LINKS.login}>Student login</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
