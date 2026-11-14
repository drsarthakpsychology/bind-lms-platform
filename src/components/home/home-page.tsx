import Link from "next/link";
import { LEGAL } from "@/lib/legal-constants";
import { CAST, asteriskSvg, characterSvg, iconSvg, sparkleSvg, starSvg, type CastName } from "./art";
import {
  ASSESSMENT,
  BEYOND,
  CASE_SHEET,
  CERTIFICATE,
  COHORT,
  COLLEGES,
  CONTACT,
  DEFENCES,
  DISCIPLINES,
  FACULTY,
  FACULTY_LEAD,
  FAQ,
  FEES,
  INCLUDED,
  INTERVIEW,
  JOIN_STEPS,
  LEADERSHIP,
  LINKS,
  MEDICINES,
  MODULES,
  MSE,
  NAV,
  PSYCHOMETRIC,
  PSYCHOMETRIC_NOTE,
  QUICK_ANSWERS,
  RED_FLAGS,
  RULE_OUT,
  SIDE_OR_SYMPTOM,
  STATS,
  STICKERS,
  THERAPIES,
  TICKER,
  WEEK,
  WHO_FOR,
} from "./content";
import { archivo, pixel, pixelDigits } from "./fonts";
import { INSTRUMENTS } from "@/lib/free/tests";
import { CALM_TOOLS } from "@/lib/free/calm";
import { Carousel, ClinicCallGame, DaySwitch, DefenceGame, DepthTabs, DisorderPicker, MemoryGame, TherapyMixer } from "./games";
import { HomeNav } from "./home-nav";
import { CountUp, Cursor, Magnetic, Marquee, Parallax, Reveal, ScrollProgress, SectionHead, Tilt } from "./motion-kit";
import { CollegeVs, GroupScene, JourneyScene, ScenarioStack, ScrubText, Stickers, WeeksTimeline } from "./scenes";
import s from "./home.module.css";

/**
 * VIBHA public homepage. Student-first order:
 *   what it is (+ quick answers) → what you get → real patients → the
 *   practical difference → weekends → play → faculty → fees & joining →
 *   curriculum → in depth → how it runs → FAQ → contact.
 * Palette: blue (brand), lime (accent/CTA), white (reading), black (text,
 * outlines, two dark "experience" bands). See home.module.css for the
 * contrast pairings. Every word lives in ./content.ts.
 */

function Art({ html, className }: { html: string; className?: string }) {
  return <span aria-hidden className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Person({ who, className, flip }: { who: CastName; className?: string; flip?: boolean }) {
  return <Art className={className} html={characterSvg({ ...CAST[who], flip })} />;
}

function Marked({ text, mark }: { text: string; mark?: string }) {
  if (!mark || !text.includes(mark)) return <>{text}</>;
  const [before, after] = text.split(mark);
  return (
    <>
      {before}
      <mark className={s.mark}>{mark}</mark>
      {after}
    </>
  );
}

/* ================================================================ HERO */
function Hero() {
  return (
    <section className={`${s.section} ${s.blue} ${s.dots} ${s.hero}`} aria-labelledby="hero-title">
      <div className={s.wrap}>
        <div className={s.heroGrid}>
          <div className={s.heroText}>
            <Reveal y={12}>
              <p className={s.eyebrowPill}>
                <span className={s.liveDot} aria-hidden />
                <span className={s.pillLong}>
                  {COHORT.label} · by invitation · starts {COHORT.starts.toLowerCase()}
                </span>
                <span className={s.pillShort}>
                  {COHORT.label} · starts {COHORT.startsShort}
                </span>
              </p>
            </Reveal>
            <h1 id="hero-title" className={s.h1}>
              <span className={s.h1a}>Don&apos;t just study</span>
              <span className={s.h1b}>Psychology.</span>
              <span className={s.h1c}>Practise it.</span>
            </h1>
            <Reveal delay={0.12} y={12}>
              <p className={s.heroLede}>
                A 16-week clinical training programme where you see real patients, write real treatment plans, and get
                corrected by psychiatrists. Led by Dr. Sarthak Dave, MBBS, MD (Psychiatry).
              </p>
            </Reveal>
            <Reveal delay={0.2} y={12}>
              <div className={s.ctaRow}>
                <Magnetic>
                  <Link href={LINKS.apply} className={`${s.btn} ${s.btnLime} ${s.btnLg}`}>
                    Request an invitation <span aria-hidden>→</span>
                  </Link>
                </Magnetic>
                <Magnetic>
                  <a href="#fees" className={`${s.btn} ${s.btnWhite} ${s.btnLg} ${s.heroSecondary}`}>
                    Fees &amp; how to join
                  </a>
                </Magnetic>
              </div>
            </Reveal>
            <Stickers items={STICKERS} />
          </div>

          <div className={s.heroArt} aria-hidden>
            <Parallax className={s.heroStar} speed={0.4} rotate={30}>
              <Art className={s.fill} html={starSvg(14, 52, 96, "#cdf24b", "#111111")} />
            </Parallax>
            <div className={s.window}>
              <div className={s.windowBar}>
                <i />
                <i />
                <i />
                <span>Consultation room</span>
              </div>
              <div className={s.windowBody}>
                <div className={s.windowFloor} />
                <Person who="curly" className={s.wcA} />
                <Person who="doctor" className={s.wcB} />
                <Person who="patient" flip className={s.wcC} />
                <span className={s.windowBubble}>Let&apos;s see a patient.</span>
              </div>
            </div>
            <Parallax className={s.heroSpark} speed={0.9}>
              <Art className={s.fill} html={sparkleSvg("#ffffff")} />
            </Parallax>
          </div>
        </div>

        <dl className={s.facts}>
          <div>
            <dt>Starts</dt>
            <dd>{COHORT.starts}</dd>
          </div>
          <div>
            <dt>Length</dt>
            <dd>{COHORT.length}</dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>{COHORT.where}</dd>
          </div>
          <div>
            <dt>Internship</dt>
            <dd>{COHORT.hours}</dd>
          </div>
        </dl>

        <div className={s.quickWrap}>
          <p className={s.quickLabel}>Quick answers</p>
          <ul className={s.quick} aria-label="Quick answers">
            {QUICK_ANSWERS.map((x, i) => (
              <Reveal as="li" key={x.q} delay={i * 0.05} y={14}>
                <a href={x.href} className={s.quickCard}>
                  <span className={s.quickQ}>{x.q}</span>
                  <span className={s.quickA}>{x.a}</span>
                  <span className={s.quickGo} aria-hidden>
                    →
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  return (
    <div className={s.tickers} aria-hidden>
      <Marquee items={TICKER} className={`${s.tickerBand} ${s.tickerLime}`} />
      <Marquee items={TICKER} reverse className={`${s.tickerBand} ${s.tickerInk}`} />
    </div>
  );
}

/* ========================================================= WHAT YOU GET */
function WhatYouGet() {
  return (
    <section id="programme" className={`${s.section} ${s.white}`}>
      <div className={s.wrap}>
        <div className={s.headWithArt}>
          <SectionHead tag="What you get" title="Everything you get" accent="in 16 weeks." />
          <Person who="bun" className={s.headArt} />
        </div>
        <div className={s.getGrid}>
          <ul className={s.stats}>
            {STATS.map((st, i) => (
              <Tilt as="li" key={i} className={`${s.stat} ${s[`tone_${st.tone}`]}`} max={6}>
                <CountUp value={st.n} className={s.statN} />
                <span className={s.statT}>{st.t}</span>
              </Tilt>
            ))}
          </ul>
          <Reveal className={s.included}>
            <p className={s.pixLabel}>Included</p>
            <ul className={s.ticks}>
              {INCLUDED.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <a href="#fees" className={s.textLink}>
              See fees and how to join →
            </a>
          </Reveal>
        </div>
        <div className={s.subHead}>
          <span className={`${s.tag} ${s.tagBlue}`}>Also yours</span>
          <h3 className={s.h3}>What you keep after the 16 weeks.</h3>
        </div>
        <ul className={`${s.beyond} ${s.beyondTight}`}>
          {BEYOND.map((b, i) => (
            <Reveal as="li" key={b.title} className={s.beyondCard} delay={(i % 3) * 0.06}>
              <Art className={s.iconMd} html={iconSvg(b.icon, i % 2 ? "#ffffff" : "#cdf24b")} />
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </Reveal>
          ))}
        </ul>

        <div className={s.subHead}>
          <span className={`${s.tag} ${s.tagBlue}`}>Assessed, then certified</span>
        </div>
        <ul className={s.grid4}>
          {ASSESSMENT.map((a, i) => (
            <Reveal as="li" key={a.title} className={s.card} delay={i * 0.05}>
              <h4>{a.title}</h4>
              <p>{a.text}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className={s.certificate}>
          <div>
            <span className={s.pixLabel}>Your certificate</span>
            <p>{CERTIFICATE}</p>
          </div>
          <Parallax className={s.seal} speed={0} rotate={60}>
            <Art className={s.fill} html={starSvg(16, 66, 98, "#1d44d8", "#111111")} />
            <span>
              Signed
              <br />
              by a
              <br />
              psychiatrist
            </span>
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================ PATIENTS */
function Patients() {
  return (
    <div id="patients" className={`${s.blue} ${s.dots} ${s.patientsWrap}`}>
      <div className={`${s.wrap} ${s.patientsHead}`}>
        <div className={s.headWithArt}>
          <SectionHead
            tag="Real patients"
            tone="lime"
            title="Not observership."
            accent="You talk to the patient."
            sub="In person, you interview patients yourself, under a psychiatrist's supervision. Scroll to see how a group works."
          />
          <div className={s.headArtStar}>
            <Art className={s.fill} html={starSvg(12, 54, 96, "#cdf24b", "#111111")} />
            <Person who="doctor2" className={s.headArtOnStar} />
          </div>
        </div>
      </div>
      <GroupScene />
    </div>
  );
}

/* ====================================================== NOT YOUR COLLEGE */
function Different() {
  return (
    <section id="different" className={`${s.section} ${s.white} ${s.editorial}`}>
      <div className={s.wrap}>
        <SectionHead
          tag="Why VIBHA"
          title="We don't teach"
          accent="what your college teaches."
          sub="Your degree gives you the theory. We take every topic all the way to the patient: the plan, the therapy, the counselling, the clinical judgement."
        />
        <CollegeVs />
        <ScrubText className={s.scrub} />
      </div>
    </section>
  );
}

/* ======================================== EVERY DISORDER + THERAPY PLAN */
function EveryDisorder() {
  return (
    <section id="disorders" className={`${s.section} ${s.white}`}>
      <div className={s.wrap}>
        <SectionHead
          tag="Every disorder, the whole plan"
          title="Not just symptoms."
          accent="The whole clinical plan."
          sub="For every disorder in the syllabus, you learn the same nine things. Pick one."
        />
        <Reveal>
          <DisorderPicker />
        </Reveal>
        <div className={s.subHead}>
          <span className={s.tag}>Therapy planning</span>
          <h3 className={s.h3}>Learn every therapy. Then mix them.</h3>
          <p className={s.ledeSmall}>Real patients rarely fit one therapy. Pick a patient and watch the plan come together.</p>
        </div>
        <Reveal>
          <TherapyMixer />
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================ WEEKENDS */
function YourWeek() {
  return (
    <section id="week" className={`${s.section} ${s.blue} ${s.dots}`}>
      <div className={s.wrap}>
        <div className={s.headWithArt}>
          <SectionHead
            tag="Your week"
            tone="lime"
            title="A weekday, a weekend,"
            accent="and the whole week."
            sub="Patient batches on weekdays, live discussions with psychiatrists every weekend. Switch between them."
          />
          <Person who="curly" className={s.headArt} />
        </div>
        <Reveal>
          <DaySwitch />
        </Reveal>
        <ul className={s.weekGrid}>
          {WEEK.map((w, i) => (
            <Reveal as="li" key={w.d} className={s.weekDay} delay={i * 0.05} y={16}>
              <span className={s.weekName}>{w.d}</span>
              {w.kind === "patient" ? (
                <span className={`${s.slot} ${s.slotPatient}`}>
                  Patient batch<small>morning or evening</small>
                </span>
              ) : (
                <span className={`${s.slot} ${s.slotLive}`}>
                  Live discussion<small>{"time" in w ? w.time : ""}</small>
                </span>
              )}
            </Reveal>
          ))}
        </ul>
        <p className={s.legend}>
          <span>
            <i className={s.swLime} /> Everyone, online or in person
          </span>
          <span>
            <i className={s.swInk} /> In-person students
          </span>
        </p>

        <div className={s.weekendsSpacer} />
        <div className={s.weekendsGrid}>
          <div className={s.weekendsIntro}>
            <SectionHead
              tag="Every weekend"
              tone="lime"
              title="What do you do"
              accent="when…?"
              sub="Each weekend a psychiatrist takes one patient or one disorder in depth, from years of practice, including what to do when things go wrong. Ask as many questions as you want."
            />
            <div className={s.duo} aria-hidden>
              <span className={s.bubble}>I can&apos;t go on like this.</span>
              <Person who="patient" className={s.duoItem} />
              <Person who="doctor" flip className={s.duoItem} />
            </div>
          </div>
          <ScenarioStack />
        </div>
      </div>
    </section>
  );
}

/* ================================================================ PLAY */
function Play() {
  return (
    <section id="play" className={`${s.section} ${s.ink} ${s.arcade}`}>
      <div className={s.scanlines} aria-hidden />
      <div className={s.wrap}>
        <SectionHead
          tag="Arcade"
          tone="lime"
          title="Think like a clinician."
          accent="Press start."
          sub="Three quick games built from what we teach. No sign-up. Works on your phone."
        />
        <div className={s.games}>
          <Reveal>
            <ClinicCallGame />
          </Reveal>
          <Reveal delay={0.1}>
            <DefenceGame />
          </Reveal>
          <Reveal className={s.gamesWide}>
            <MemoryGame />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ===================================================== FREE FOR EVERYONE */
const FREE_TESTS = INSTRUMENTS.map((i) => ({ href: `/free/tests/${i.id}`, title: i.short, meta: `${i.name} · ${i.minutes} min` }));
const FREE_CALM = CALM_TOOLS.map((c) => ({ href: `/free/calm/${c.id}`, title: c.title, meta: c.minutes }));

function FreeStrip() {
  return (
    <section id="free" className={`${s.section} ${s.white}`}>
      <div className={s.wrap}>
        <div className={s.headWithArt}>
          <SectionHead
            tag="Free for everyone"
            title="Check in with yourself."
            accent="Then breathe."
            sub="The questionnaires clinicians use, scored instantly, and calm exercises therapists teach. Free, no sign-up, and your answers never leave your phone."
          />
          <Person who="psych" className={s.headArt} />
        </div>
        <div className={s.freeCols}>
          <div>
            <p className={s.pixLabel}>Self-checks</p>
            <ul className={s.freeList}>
              {FREE_TESTS.map((f) => (
                <li key={f.href}>
                  <Link href={f.href} className={s.freeItem}>
                    <span>
                      <b>{f.title}</b>
                      <small>{f.meta}</small>
                    </span>
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={s.pixLabel}>Calm</p>
            <ul className={s.freeList}>
              {FREE_CALM.map((f) => (
                <li key={f.href}>
                  <Link href={f.href} className={`${s.freeItem} ${s.freeItemInk}`}>
                    <span>
                      <b>{f.title}</b>
                      <small>{f.meta}</small>
                    </span>
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`${s.ctaRow} ${s.freeCta}`}>
          <Link href="/free" className={`${s.btn} ${s.btnLime}`}>
            Open all free tools <span aria-hidden>→</span>
          </Link>
          <Link href="/free/help" className={`${s.btn} ${s.btnWhite}`}>
            Who should I see?
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================= FACULTY */
function Faculty() {
  return (
    <section id="faculty" className={`${s.section} ${s.white}`}>
      <div className={s.wrap}>
        <div className={s.headWithArt}>
          <SectionHead
            tag="Faculty"
            title="Taught by people"
            accent="who practise it."
            sub="Led by Dr. Sarthak Dave, with psychiatrists, a child psychiatrist, a hypnotherapist and a mindfulness teacher."
          />
          <div className={s.headArtStar}>
            <Art className={s.fill} html={starSvg(12, 54, 96, "#1d44d8", "#111111")} />
            <Person who="doctor3" className={s.headArtOnStar} />
          </div>
        </div>
        <Tilt className={s.lead} max={3}>
          <span className={`${s.avatar} ${s.avatarBig}`} aria-hidden>
            {FACULTY_LEAD.initials}
          </span>
          <div>
            <span className={s.pixLabelLime}>{FACULTY_LEAD.role}</span>
            <h3 className={s.leadName}>{FACULTY_LEAD.name}</h3>
            <p>{FACULTY_LEAD.text}</p>
          </div>
        </Tilt>
        <ul className={s.faculty}>
          {FACULTY.map((f) => (
            <Tilt as="li" key={f.name} className={s.facultyCard} max={8}>
              <span className={`${s.avatar} ${s[`av_${f.tone}`]}`} aria-hidden>
                {f.initials}
              </span>
              <div>
                <span className={s.pixLabel}>{f.role}</span>
                <h3 className={s.facultyName}>{f.name}</h3>
              </div>
            </Tilt>
          ))}
          <li className={`${s.facultyCard} ${s.facultyNoteCard}`}>
            <p>Every case discussion is led by the clinician who took the case.</p>
          </li>
        </ul>
        <div className={s.runBy}>
          <span className={s.pixLabelLime}>Run by</span>
          {LEADERSHIP.map((l) => (
            <p key={l.name}>
              <b>{l.name}</b>
              <span>{l.role}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ====================================================== FEES & JOINING */
function FeesJoin() {
  return (
    <section id="fees" className={`${s.section} ${s.lime} ${s.halftone}`}>
      <div className={s.wrap}>
        <SectionHead
          tag="Fees & joining"
          title="What it costs."
          accent="How to join."
          sub="No hidden steps. One call gets you your exact fee and a seat."
        />
        <div className={s.feesGrid}>
          <Reveal className={s.feeCard}>
            <p className={s.pixLabel}>Your fee depends on</p>
            <ol className={s.feeList}>
              {FEES.dependsOn.map((x, i) => (
                <li key={x}>
                  <span className={s.feeNum}>{i + 1}</span>
                  {x}
                </li>
              ))}
            </ol>
            <p className={s.pixLabel}>Ways to pay</p>
            <ul className={s.payChips}>
              {FEES.pay.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className={s.feeNote}>
              {FEES.note}{" "}
              <Link href="/policies/refund" className={s.textLinkInk}>
                Refund policy
              </Link>
            </p>
          </Reveal>

          <Reveal className={s.joinCard} delay={0.08}>
            <p className={s.pixLabelLime}>How to join</p>
            <ol className={s.joinSteps}>
              {JOIN_STEPS.map((st, i) => (
                <li key={st.title}>
                  <span className={s.joinNum}>{i + 1}</span>
                  <div>
                    <h3>{st.title}</h3>
                    <p>{st.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={s.joinBtns}>
              <Magnetic>
                <Link href={LINKS.apply} className={`${s.btn} ${s.btnLime}`}>
                  Request an invitation <span aria-hidden>→</span>
                </Link>
              </Magnetic>
              <a href={CONTACT.phoneHref} className={`${s.btn} ${s.btnWhite}`}>
                Call {CONTACT.phone}
              </a>
              <a href={CONTACT.whatsappHref} className={`${s.btn} ${s.btnWhite}`} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        <div className={s.whoRow}>
          <p className={s.pixLabel}>Who can join · no degree, age or experience requirement</p>
          <ul className={s.who}>
            {WHO_FOR.map((w) => (
              <Tilt as="li" key={w.title} className={s.whoCard} max={6}>
                <Person who={w.who} className={s.whoArt} />
                <div>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </div>
              </Tilt>
            ))}
          </ul>
        </div>

        <Reveal className={s.collegeCard}>
          <div>
            <p className={s.pixLabelLime}>For colleges</p>
            <h3 className={s.collegeTitle}>Send your students for a supervised clinical internship.</h3>
            <ul className={s.ticksOnBlue}>
              {[...COLLEGES.gets.slice(0, 3), ...COLLEGES.partnering.slice(0, 3)].map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <div className={s.collegeAction}>
            <p>
              Reach out on {CONTACT.phone}. {CONTACT.person}, {CONTACT.role}, handles everything from there.
            </p>
            <a href={CONTACT.phoneHref} className={`${s.btn} ${s.btnLime}`}>
              Call {CONTACT.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ========================================================== CURRICULUM */
function Curriculum() {
  return (
    <section id="curriculum" className={`${s.section} ${s.blue} ${s.dots}`}>
      <div className={s.wrap}>
        <div className={s.headWithArt}>
          <SectionHead
            tag="Curriculum"
            tone="lime"
            title="Seven disciplines."
            accent="All practical."
            sub="Taught in order. Counselling skills run through every one. Swipe through them."
          />
          <Person who="cap" className={s.headArt} />
        </div>
      </div>
      <div className={s.wrapWide}>
        <Carousel label="Seven disciplines">
          {DISCIPLINES.map((d, i) => (
            <li key={d.name} className={s.discipline}>
              <div className={`${s.disciplineHead} ${i % 2 ? s.headInk : s.headLime}`}>
                <span className={s.pixNum}>{"extra" in d ? "+" : String(i + 1).padStart(2, "0")}</span>
                <h3>{d.name}</h3>
              </div>
              <p>{d.text}</p>
            </li>
          ))}
        </Carousel>
      </div>
      <div className={s.wrap}>
        <div className={s.subHead}>
          <span className={`${s.tag} ${s.tagLime}`}>16 weeks</span>
          <h3 className={s.h3}>How the weeks unfold.</h3>
          <p className={s.ledeSmall}>One module a week, in order. Topics may shift slightly as the cohort runs.</p>
        </div>
        <WeeksTimeline />
        <div className={s.depthPanel} id="in-depth">
          <span className={`${s.tag} ${s.tagBlue}`}>In depth</span>
          <h3 className={`${s.h3} ${s.h3Ink}`}>Open any module or skill. See exactly what you learn.</h3>
          <DepthTabs
            labels={["All 18 modules", "Psychiatric interview", "MSE", "Case sheet", "Medicines", "Rule it out", "Therapies", "Psychometric tests"]}
          >
            {[
              <div key="all">
                <ol className={s.modules}>
            {MODULES.map((m) => (
              <li key={m.n} className={s.module}>
                <span className={s.moduleNum}>{m.n}</span>
                <div>
                  <h4>{m.title}</h4>
                  <p>{m.text}</p>
                </div>
              </li>
            ))}
                </ol>
              </div>,
              ...depthPanels(),
            ]}
          </DepthTabs>
        </div>
      </div>
    </section>
  );
}

/* ============== IN DEPTH panels (shown as tabs inside the Curriculum section) */
function depthPanels() {
  const panels = [
    <ul key="i" className={s.grid3}>
      {INTERVIEW.map((g) => (
        <li key={g.title} className={s.card}>
          <h4>{g.title}</h4>
          <ul className={s.bullets}>
            {g.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>,
    <div key="m">
      <ol className={s.mse}>
        {MSE.map((m, i) => (
          <li key={m.title} className={s.mseItem}>
            <span className={s.pixNum}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h4>{m.title}</h4>
              <p>{m.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className={s.calloutBlue}>
        <span className={s.pixLabelLime}>In the room</span>A father calls his son &ldquo;just moody&rdquo;. A structured MSE
        shows pressured speech and grandiosity, a picture the family never thought to mention.
      </p>
    </div>,
    <div key="c" className={s.caseGrid}>
      <div>
        <span className={s.pixLabel}>What you learn</span>
        <div className={s.card}>
          <h4>{CASE_SHEET.learn.title}</h4>
          <ul className={s.bullets}>
            {CASE_SHEET.learn.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
        <p className={s.caseNote}>Every symptom lands in a specific part of the case sheet.</p>
      </div>
      <div className={s.sheet}>
        <div className={s.sheetTop}>
          <span>Psychiatric case sheet</span>
          <span className={s.sheetEx}>Example</span>
        </div>
        <dl>
          {CASE_SHEET.rows.map((r) => (
            <div key={r.k} className={s.sheetRow}>
              <dt>{r.k}</dt>
              <dd>
                <Marked text={r.v} mark={"mark" in r ? r.mark : undefined} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>,
    <div key="d">
      <p className={s.ledeInk}>
        No chemistry, no prescribing. You learn the common medicine names and their side effects, so you can tell when a
        symptom comes from the medicine and not the illness. Brand names used in Indian clinics are taught too.
      </p>
      <ul className={s.grid3}>
        {MEDICINES.map((m, i) => (
          <li key={m.group} className={s.med}>
            <div className={`${s.medHead} ${i % 2 ? s.headInk : s.headLime}`}>{m.group}</div>
            <div className={s.medBody}>
              <span className={s.pixLabel}>Common names</span>
              <p className={s.medNames}>{m.names}</p>
              <span className={s.pixLabel}>Watch for</span>
              <p>{m.watch}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>,
    <div key="r">
      <ul className={s.grid3}>
        {RULE_OUT.map((r) => (
          <li key={r.title} className={s.card}>
            <Art className={s.iconLg} html={iconSvg(r.icon, r.fill)} />
            <h4>{r.title}</h4>
            <p>{r.text}</p>
          </li>
        ))}
      </ul>
      <p className={`${s.pixLabel} ${s.spaced}`}>Side effect or symptom?</p>
      <ul className={s.grid3}>
        {SIDE_OR_SYMPTOM.map((q) => (
          <li key={q.q} className={s.cardQuiet}>
            <h4>{q.q}</h4>
            <p>{q.a}</p>
          </li>
        ))}
      </ul>
      <div className={s.redFlags}>
        <Art className={s.iconLg} html={iconSvg("alert", "#cdf24b")} />
        <div>
          <span className={s.pixLabelLime}>Red flags: call the psychiatrist the same day</span>
          <p>{RED_FLAGS}</p>
        </div>
      </div>
    </div>,
    <div key="t">
      <ul className={s.therapies}>
        {THERAPIES.map((t) => (
          <li key={t.name} className={s.therapy}>
            <h4>{t.name}</h4>
            <p>{t.text}</p>
          </li>
        ))}
      </ul>
      <p className={`${s.pixLabel} ${s.spaced}`}>Defence mechanisms, in practice</p>
      <ol className={s.flow3}>
        {DEFENCES.map((d, i) => (
          <li key={d.title} className={s.card}>
            <span className={s.pixNum}>{String(i + 1).padStart(2, "0")}</span>
            <h4>{d.title}</h4>
            <p>{d.text}</p>
          </li>
        ))}
      </ol>
    </div>,
    <div key="p">
      <ul className={s.grid2}>
        {PSYCHOMETRIC.map((p) => (
          <li key={p.group} className={s.card}>
            <span className={s.pixLabel}>{p.group}</span>
            <ul className={s.chips}>
              {p.tests.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className={s.calloutBlue}>
        <span className={s.pixLabelLime}>Note</span>
        {PSYCHOMETRIC_NOTE}
      </p>
    </div>,
  ];
  return panels;
}

/* ================================================================= FAQ */
function Faq() {
  return (
    <section id="faq" className={`${s.section} ${s.white}`}>
      <div className={s.wrap}>
        <div className={s.headWithArt}>
          <SectionHead tag="FAQ" title="Still wondering?" accent="Quick answers." />
          <Art className={s.headArtAst} html={asteriskSvg("#1d44d8")} />
        </div>
        <div className={s.faq}>
          {FAQ.map((f) => (
            <details key={f.q} className={s.faqItem}>
              <summary>
                <span className={s.q} aria-hidden>
                  ?
                </span>
                <span className={s.faqQ}>{f.q}</span>
                <span className={s.chev} aria-hidden />
              </summary>
              <p>
                {f.a}
                {f.q === "Is there a refund policy?" ? (
                  <>
                    {" "}
                    <Link href="/policies/refund" className={s.textLinkInk}>
                      Open the refund policy
                    </Link>
                  </>
                ) : null}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================= CONTACT */
function Closing() {
  return (
    <section id="apply" className={`${s.section} ${s.blue} ${s.dots} ${s.closing}`}>
      <div className={s.wrap}>
        <p className={s.closeA}>Theory ends here.</p>
        <p className={s.closeB}>Practice begins.</p>
        <div className={s.ctaRow}>
          <Magnetic>
            <Link href={LINKS.apply} className={`${s.btn} ${s.btnLime} ${s.btnLg}`}>
              Request an invitation <span aria-hidden>→</span>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href={LINKS.login} className={`${s.btn} ${s.btnWhite} ${s.btnLg}`}>
              Student login
            </Link>
          </Magnetic>
        </div>
        <div className={s.closeStage} aria-hidden>
          <div className={s.ground} />
          <div className={s.cast}>
            <Person who="bun" className={s.castItem} />
            <Person who="doctor3" className={s.castItem} />
            <Person who="spiky" className={`${s.castItem} ${s.hideSm}`} />
            <Person who="psych" className={s.castItem} />
            <Person who="cap" className={`${s.castItem} ${s.hideSm}`} />
          </div>
          <span className={s.stageBubble}>See you in December!</span>
        </div>
        <div className={s.contactCard}>
          <div>
            <span className={s.pixLabel}>Enquiries</span>
            <a className={s.phone} href={CONTACT.phoneHref}>
              {CONTACT.phone}
            </a>
            <p className={s.contactWho}>
              {CONTACT.person}, {CONTACT.role}
            </p>
            <p>{CONTACT.roleNote}</p>
          </div>
          <div className={s.addr}>
            <span className={s.pixLabel}>In-person address</span>
            <address>
              {CONTACT.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================== FOOTER */
const LEGAL_LINKS = [
  { label: "Terms", href: "/policies/terms" },
  { label: "Privacy", href: "/policies/privacy" },
  { label: "Refund", href: "/policies/refund" },
  { label: "Grievance", href: "/policies/grievance" },
  { label: "Disclaimer", href: "/policies/disclaimer" },
  { label: "Cookies", href: "/policies/cookies" },
  { label: "All policies", href: "/policies" },
] as const;

function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`${s.wrap} ${s.footGrid}`}>
        <div>
          <p className={s.footBrand}>VIBHA</p>
          <p className={s.footSub}>School of Psychology</p>
          <p className={s.footTag}>Psychology, practised.</p>
        </div>
        <nav aria-label="Explore">
          <p className={s.pixLabelLime}>Explore</p>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
            <li>
              <a href="#play">Play the games</a>
            </li>
            <li>
              <Link href="/free">Free self-checks &amp; calm</Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <p className={s.pixLabelLime}>Legal</p>
          <ul>
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className={s.pixLabelLime}>Get in touch</p>
          <ul>
            <li>
              <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
            </li>
            <li>
              <a href={CONTACT.phoneHref}>{LEGAL.phone}</a>
            </li>
            <li>
              <Link href={LINKS.apply}>Request an invitation</Link>
            </li>
            <li>
              <Link href={LINKS.login}>Student login</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={`${s.wrap} ${s.footBottom}`}>
        <p>
          Cookies: only what&apos;s needed to run the site. See the <Link href="/policies/cookies">Cookie Policy</Link>.
        </p>
        <p>© 2026 VIBHA School of Psychology · Ahmedabad, India</p>
      </div>
    </footer>
  );
}

export function HomePage() {
  return (
    <div id="top" className={`${s.home} ${archivo.variable} ${pixel.variable} ${pixelDigits.variable}`}>
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-cv]>*{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <ScrollProgress />
      <Cursor />
      <HomeNav />
      <main id="main">
        <Hero />
        <Ticker />
        <WhatYouGet />
        <Patients />
        <Different />
        <JourneyScene>
          <div className={s.jEndBtns}>
            <a href="#disorders" className={`${s.btn} ${s.btnWhite} ${s.btnSm}`}>
              Pick a disorder <span aria-hidden data-dir="down">↓</span>
            </a>
            <Link href={LINKS.apply} className={`${s.btn} ${s.btnLime} ${s.btnSm}`}>
              Request an invitation
            </Link>
          </div>
        </JourneyScene>
        <EveryDisorder />
        <YourWeek />
        <Play />
        <FreeStrip />
        <Faculty />
        <FeesJoin />
        <Curriculum />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
