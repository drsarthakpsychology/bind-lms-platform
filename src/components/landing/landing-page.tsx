import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { BRAND, cohortDeadlineText, hasCohortStarted } from "@/lib/brand";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site/site-footer";
import { LandingNav } from "./landing-nav";
import { Reveal } from "./reveal";
import { KineticHeadline } from "./kinetic-headline";
import { Rule, Stamp, SectionEyebrow } from "./landing-primitives";
import { Marquee } from "./marquee";

/**
 * The public front door. Premium, minimal, neo-brutalist pastel. The LMS's
 * visual language, made into a landing page. Every claim here is sourced
 * from the actual product, from the cases to the debriefs. Nothing fabricated.
 */

function CaseFragment({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-lg border-2 border-foreground bg-card p-4 hard-shadow-sm transition-[transform,box-shadow] duration-base ease-snappy hover:-translate-y-0.5 hover:hard-shadow-md",
        className,
      )}
    >
      <p className="text-eyebrow text-muted-foreground">{label}</p>
      <p className="mt-2 min-w-0 break-words text-small leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-dots relative overflow-hidden">
      {/* Clinical graph paper — the hero's background (see .hero-dots::before
          in globals.css): points, not shapes. 24px minor + 120px major dot
          grid in the warm hairline, radially masked densest behind the card
          stack and absent behind the headline. Zero DOM nodes. */}
      <div className="relative z-10 rail pb-16 pt-14 lg:pt-24">
        {/* The eyebrow + headline + copy on the left, the intake file on the
            right — one grid, tops aligned. Typography: 0.9 leading +
            -0.038em tracking make the display lines read as one block; the
            negative left margin is optical alignment for Geist (re-checked at
            the larger size). */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div className="flex flex-col">
            <Reveal>
              <p className="text-eyebrow text-muted-foreground">A clinical psychology training programme</p>
            </Reveal>
            <h1 className="mt-5 ml-[-0.033em] text-[clamp(3rem,7.4vw,3.75rem)] font-black leading-[0.9] tracking-[-0.038em] text-foreground">
              <KineticHeadline delay={0.1} stagger={0.045}>
                Understand the case,
              </KineticHeadline>
              {/* A mobile-only space keeps the phrase joined below lg; on lg the
                  hidden span drops out and the <br> owns the break. */}
              <span aria-hidden className="lg:hidden"> </span>
              <br className="hidden lg:block" />
              <KineticHeadline delay={0.235} stagger={0.045}>
                not just the diagnosis.
              </KineticHeadline>
            </h1>
            <Reveal delay={160}>
              <p className="mt-7 max-w-[62ch] min-w-0 break-words text-base leading-relaxed text-muted-foreground sm:text-lg">
                Psychology graduates can describe therapy. Few can practise it —
                VIBHA closes that gap with real cases and a debrief after every
                session.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/waitlist" className={cn(buttonVariants({ size: "lg" }), "group gap-2 font-semibold")}>
                  Join waitlist{" "}
                  <ArrowRight
                    className="size-4 transition-transform duration-base ease-snappy group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
                <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "font-semibold")}>
                  Login
                </Link>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <p className="mt-5 flex items-center gap-2 text-small font-medium text-foreground">
                {!hasCohortStarted() && (
                  <span aria-hidden className="animate-live size-2 shrink-0 rounded-full bg-primary" />
                )}
                {cohortDeadlineText()}
                {hasCohortStarted() ? "" : " · Invite-only"}
              </p>
            </Reveal>
          </div>

          {/* The intake file: the product's raw material, drawn with the LMS's
              card and hard-shadow language. Three equal-height fragments step
              right by a deliberate stagger (0 / 2.2rem / 4rem). The two tabs
              clamp the deck into one labelled object — "CASE FILE" pinned to
              the top-left overlapping the first card, "PRACTISE" mirrored to
              the bottom-right overlapping the third card, rotated the opposite
              way. They are one pair: same amber fill, same ink border, same
              radius, hard-shadow — identical apart from rotation. */}
          <div className="relative mx-auto w-full max-w-md lg:mt-2 lg:max-w-none">
            <div className="relative space-y-3.5 pb-6">
              <div
                aria-hidden
                className="absolute -top-3.5 left-6 z-10 rotate-[-1.5deg] rounded-md border-2 border-foreground bg-primary px-2.5 py-1 font-mono text-[0.6rem] font-black uppercase tracking-[0.2em] text-foreground hard-shadow-flat"
              >
                Case file
              </div>
              <Reveal delay={120}>
                <CaseFragment label="Presenting complaint" className="ml-0 min-h-32 -rotate-1">
                  &ldquo;I hear a voice telling me I&apos;m worthless. It&apos;s not mine.&rdquo;
                </CaseFragment>
              </Reveal>
              <Reveal delay={220}>
                <CaseFragment label="Observation" className="ml-4 min-h-32 rotate-1 sm:ml-9">
                  Sits very still, hands folded. Speaks in a flat, even voice.
                </CaseFragment>
              </Reveal>
              <Reveal delay={320}>
                <CaseFragment label="Formulation" className="ml-8 min-h-32 -rotate-1 sm:ml-16">
                  The heaviness is the only language her belief system permits
                  for distress.
                </CaseFragment>
              </Reveal>
              <div
                aria-hidden
                className="absolute bottom-[0.15rem] right-[2.4rem] z-10 rotate-[1.5deg] rounded-md border-2 border-foreground bg-primary px-2.5 py-1 font-mono text-[0.6rem] font-black uppercase tracking-[0.2em] text-foreground hard-shadow-flat"
              >
                Practise
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section id="about" className="relative scroll-mt-20 border-t-2 border-foreground bg-surface-2">
      {/* A spoken belief deserves an opening mark. Static (no scroll-scaling
          per the motion brief), purely decorative and aria-hidden. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 left-4 select-none text-[9rem] font-serif leading-none text-foreground/5 sm:left-8 sm:text-[12rem] lg:text-[15rem]"
      >
        &ldquo;
      </span>
      <div className="rail py-20">
        <Reveal>
          <SectionEyebrow index="01">Why this school exists</SectionEyebrow>
          <h2 className="mt-3 max-w-[20ch] text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            Theory gives you the language.{" "}
            <span className="font-serif font-medium italic">Practice teaches you how to use it.</span>
          </h2>
          <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Most psychology graduates can describe therapy. Almost none can sit
              with a patient and think in real time.
            </p>
            <p>
              That gap is not a failure of students — it is a failure of method.
              You cannot learn to be in the room by reading about it.
            </p>
          </div>
        </Reveal>
        <Rule className="mt-12 max-w-[62ch]" />
      </div>
    </section>
  );
}

function ThreeIdeas() {
  const ideas = [
    {
      num: "01",
      eyebrow: "Learn",
      title: "The structured science",
      body: "Interviewing, the mental status exam, formulation, ethics and the law — one working method, taught in order.",
    },
    {
      num: "02",
      eyebrow: "Experience",
      title: "Simulated patients, real sessions",
      body: "You don't practise on a stranger first. Interview simulated patients and revisit your own transcripts.",
    },
    {
      num: "03",
      eyebrow: "Apply",
      title: "Write it, defend it, learn from the debrief",
      body: "You write the formulation and make the call. Then the debrief shows what the patient actually presented — and where your ears went quiet.",
    },
  ];
  return (
    <section className="rail py-20">
      <Reveal>
        <SectionEyebrow index="02">The method</SectionEyebrow>
        <h2 className="mt-3 max-w-[20ch] text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
          Learn, experience, apply. <span className="font-serif font-medium italic">In that order.</span>
        </h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-0">
        {ideas.map((idea, i) => (
          <Fragment key={idea.eyebrow}>
            {i > 0 && (
              <div aria-hidden className="flex items-center justify-center py-1 md:px-2 md:py-0">
                <ArrowDown className="size-5 text-foreground md:hidden" />
                <ArrowRight className="hidden size-6 text-foreground md:block" />
              </div>
            )}
            <Reveal delay={i * 80} className="h-full">
              <div
                className={cn(
                  // h-full keeps the three cards equal within the desktop row;
                  // min-h-64 keeps the stacked mobile view equal too (the Learn
                  // card has one line less of body copy). All cards on --card;
                  // the middle card keeps its peach border as the highlight —
                  // no third surface.
                  "flex h-full min-h-64 flex-col rounded-lg border-2 p-6 hard-shadow-sm transition-[transform,box-shadow] duration-base ease-snappy hover:-translate-y-0.5 hover:hard-shadow-md",
                  i === 1 ? "border-primary bg-card" : "border-foreground bg-card",
                )}
              >
                <p className="flex items-baseline gap-3 text-eyebrow text-muted-foreground">
                  <span aria-hidden className="font-mono text-2xl font-black tracking-normal text-link">
                    {idea.num}
                  </span>
                  {idea.eyebrow}
                </p>
                <h3 className="mt-2 min-w-0 break-words text-xl font-bold text-foreground">{idea.title}</h3>
                <p className="mt-3 min-w-0 break-words text-small leading-relaxed text-muted-foreground">{idea.body}</p>
              </div>
            </Reveal>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

function WhoBuilds() {
  return (
    <section className="border-y-2 border-foreground bg-surface-2">
      <div className="rail py-20">
        <Reveal>
          <SectionEyebrow index="03">Who is building this</SectionEyebrow>
          <h2 className="mt-3 max-w-[20ch] text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            A small team, and <span className="font-serif font-medium italic">you know their names.</span>
          </h2>
          <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              VIBHA School of Psychology is a new initiative. The team behind it
              is small, and it is easy to name.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-8 border-2 border-foreground bg-card hard-shadow-sm">
            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground">{BRAND.lead}</p>
                <p className="mt-0.5 text-small text-muted-foreground">
                  He is the psychiatrist the school is built around.
                </p>
              </div>
              <span className="mt-2 w-fit shrink-0 rounded-md border-2 border-foreground bg-surface-1 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-secondary-foreground sm:mt-0">
                Clinical lead
              </span>
            </div>
            <div className="flex flex-col gap-1 border-t-2 border-foreground px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-bold text-foreground">{BRAND.builder}</p>
              <span className="mt-2 w-fit shrink-0 rounded-md border-2 border-foreground bg-surface-1 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-secondary-foreground sm:mt-0">
                Building the programme
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            Guest lectures keep the teaching from resting on a single voice.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="rail py-20">
      <Reveal>
        <div className="relative">
          <Stamp className="absolute -top-4 right-0 hidden rotate-[8deg] sm:block">Invite-only</Stamp>
          <p className="text-eyebrow text-muted-foreground">Cohort One — by invitation</p>
          <h2 className="mt-4 max-w-[20ch] text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
            {hasCohortStarted() ? (
              <>
                Cohort One{" "}
                <span className="font-serif font-medium italic text-link">is by invitation.</span>
              </>
            ) : (
              <>
                Cohort One begins{" "}
                <span className="font-serif font-medium italic text-link">{BRAND.cohortStart}.</span>
              </>
            )}
          </h2>
          <Rule className="mt-6 max-w-xs" />
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            A small cohort, a real curriculum, a method built for the room.
            Tell us who you are.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/waitlist" className={cn(buttonVariants({ size: "lg" }), "group gap-2 font-semibold")}>
              Join waitlist{" "}
              <ArrowRight
                className="size-4 transition-transform duration-base ease-snappy group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "font-semibold")}>
              Login
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-1">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Problem />
        <ThreeIdeas />
        <WhoBuilds />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
