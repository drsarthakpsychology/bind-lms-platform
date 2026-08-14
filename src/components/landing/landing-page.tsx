import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { BRAND, cohortDeadlineText, hasCohortStarted } from "@/lib/brand";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VibhaWordmark } from "@/components/brand/vibha-logo";
import { LandingNav } from "./landing-nav";
import { Parallax } from "./parallax";
import { Reveal } from "./reveal";
import { KineticHeadline } from "./kinetic-headline";
import { ScrollScale } from "./scroll-scale";
import { Rule, Stamp, SectionEyebrow } from "./landing-primitives";
import { Marquee } from "./marquee";

/**
 * The public front door. Premium, minimal, neo-brutalist pastel. The LMS's
 * visual language, made into a landing page. Every claim here is sourced
 * from the actual product, from the cases to the debriefs. Nothing fabricated.
 */

function ObservationRings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 640" fill="none" aria-hidden className={className}>
      <circle cx="320" cy="320" r="120" stroke="currentColor" strokeWidth="3" />
      <circle cx="320" cy="320" r="176" stroke="currentColor" strokeWidth="3" />
      <circle cx="320" cy="320" r="232" stroke="currentColor" strokeWidth="3" />
      <circle cx="320" cy="320" r="288" stroke="currentColor" strokeWidth="3" />
      <circle cx="320" cy="320" r="52" stroke="currentColor" strokeWidth="3" />
      <circle cx="320" cy="320" r="10" fill="currentColor" />
    </svg>
  );
}

/**
 * Hexagonal molecular lattice — the hero's background motif. Reads as a
 * node-and-edge network (and benzene-ring geometry), pointing at
 * psychopharmacology / neuroscience rather than the generic concentric rings
 * it replaced. Coordinates are from the revised-hero reference, verbatim.
 *
 * The single heavier central hexagon (strokeWidth 2.6) is the only emphasis;
 * the rest fade outward via per-path opacity. Coloured via `text-line` on the
 * wrapper (stroke="currentColor") so dark mode is one token away.
 */
function HexLattice({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M406 301 L377 352 L319 352 L290 301 L319 251 L377 251Z" strokeWidth={2.6} />
      <path d="M319 251 L290 301 L232 301 L203 251 L232 201 L290 201Z" opacity="0.83" />
      <path d="M319 352 L290 402 L232 402 L203 352 L232 301 L290 301Z" opacity="0.83" />
      <path d="M406 201 L377 251 L319 251 L290 201 L319 151 L377 151Z" opacity="0.74" />
      <path d="M406 402 L377 452 L319 452 L290 402 L319 352 L377 352Z" opacity="0.73" />
      <path d="M232 301 L203 352 L145 352 L116 301 L145 251 L203 251Z" opacity="0.70" />
      <path d="M493 251 L464 301 L406 301 L377 251 L406 201 L464 201Z" opacity="0.66" />
      <path d="M493 352 L464 402 L406 402 L377 352 L406 301 L464 301Z" opacity="0.66" />
      <path d="M319 151 L290 201 L232 201 L203 151 L232 100 L290 100Z" opacity="0.63" />
      <path d="M319 452 L290 502 L232 502 L203 452 L232 402 L290 402Z" opacity="0.63" />
      <path d="M232 201 L203 251 L145 251 L116 201 L145 151 L203 151Z" opacity="0.62" />
      <path d="M232 402 L203 452 L145 452 L116 402 L145 352 L203 352Z" opacity="0.61" />
      <path d="M493 151 L464 201 L406 201 L377 151 L406 100 L464 100Z" opacity="0.50" />
      <path d="M493 452 L464 502 L406 502 L377 452 L406 402 L464 402Z" opacity="0.50" />
      <path d="M406 100 L377 151 L319 151 L290 100 L319 50 L377 50Z" opacity="0.49" />
      <path d="M406 502 L377 553 L319 553 L290 502 L319 452 L377 452Z" opacity="0.48" />
      <path d="M145 251 L116 301 L58 301 L29 251 L58 201 L116 201Z" opacity="0.45" />
      <path d="M145 352 L116 402 L58 402 L29 352 L58 301 L116 301Z" opacity="0.45" />
      <path d="M580 301 L551 352 L493 352 L464 301 L493 251 L551 251Z" opacity="0.44" />
      <path d="M232 100 L203 151 L145 151 L116 100 L145 50 L203 50Z" opacity="0.40" />
      <path d="M232 502 L203 553 L145 553 L116 502 L145 452 L203 452Z" opacity="0.39" />
      <path d="M580 201 L551 251 L493 251 L464 201 L493 151 L551 151Z" opacity="0.37" />
      <path d="M580 402 L551 452 L493 452 L464 402 L493 352 L551 352Z" opacity="0.37" />
      <path d="M319 50 L290 100 L232 100 L203 50 L232 0 L290 0Z" opacity="0.34" />
      <path d="M319 553 L290 603 L232 603 L203 553 L232 502 L290 502Z" opacity="0.33" />
      <path d="M145 151 L116 201 L58 201 L29 151 L58 100 L116 100Z" opacity="0.32" />
      <path d="M145 452 L116 502 L58 502 L29 452 L58 402 L116 402Z" opacity="0.31" />
      <path d="M493 50 L464 100 L406 100 L377 50 L406 0 L464 0Z" opacity="0.24" />
      <path d="M493 553 L464 603 L406 603 L377 553 L406 502 L464 502Z" opacity="0.23" />
      <path d="M580 100 L551 151 L493 151 L464 100 L493 50 L551 50Z" opacity="0.19" />
      <circle cx="406" cy="301" r="4" fill="currentColor" stroke="none" opacity=".55" />
      <circle cx="377" cy="352" r="4" fill="currentColor" stroke="none" opacity=".55" />
      <circle cx="319" cy="352" r="4" fill="currentColor" stroke="none" opacity=".55" />
      <circle cx="290" cy="301" r="4" fill="currentColor" stroke="none" opacity=".55" />
      <circle cx="319" cy="251" r="4" fill="currentColor" stroke="none" opacity=".55" />
      <circle cx="377" cy="251" r="4" fill="currentColor" stroke="none" opacity=".55" />
    </svg>
  );
}

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
    <section className="relative overflow-hidden">
      {/* Hexagonal molecular lattice — the hero's background motif, replacing
          the concentric rings. A node-and-edge / benzene-ring field behind
          the card stack, anchored top-right, bleeding off the edges. Static,
          aria-hidden, behind all content (z-0). Coloured via --line so dark
          mode is one token flip. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 select-none text-line">
        <HexLattice className="absolute -right-[6%] -top-[4%] w-[60%]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-6 lg:pt-24">
        {/* Poster row: the eyebrow + headline + copy on the left, the intake
            file on the right — one grid, tops aligned, so the card stack
            tops out level with the headline rather than below the paragraph.
            Typography: 0.92 leading + -0.035em tracking make the headline
            lines read as one block; the negative left margin is optical
            alignment for the display face (tuned against Geist in the
            browser). */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="flex flex-col">
            <Reveal>
              <p className="text-eyebrow text-muted-foreground">A clinical psychology training programme</p>
            </Reveal>
            <h1 className="mt-5 ml-[-0.03em] text-[2rem] font-black leading-[0.92] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-[3.25rem]">
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
            <Reveal delay={0.22}>
              <p className="mt-7 max-w-[44ch] min-w-0 break-words text-base leading-relaxed text-muted-foreground sm:text-lg">
                Psychology graduates can describe therapy. Few can practise it —
                VIBHA closes that gap with real cases and a debrief after every
                session.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
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
            <Reveal delay={0.36}>
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
              right by a deliberate stagger (0 / 2.2rem / 4rem), a labelled
              "CASE FILE" index tab seals the top, and a light "PRACTISE" stamp
              (paired with the tab — matched border + translucent peach,
              rotation mirrored) sits fully inside the bottom-left corner. The
              hexagonal lattice is its backdrop. Purely decorative; parallax is
              disabled under prefers-reduced-motion. Top-aligned so the deck
              tops out level with the headline. */}
          <Parallax from={10} to={-10} className="relative mx-auto w-full max-w-md lg:mt-2 lg:max-w-none">
            <div className="relative space-y-3.5 pb-14">
              <div
                aria-hidden
                className="absolute -top-3.5 left-6 z-10 rotate-[-4deg] rounded-md border-2 border-foreground bg-secondary px-2.5 py-1 font-mono text-[0.6rem] font-black uppercase tracking-[0.2em] text-foreground hard-shadow-flat"
              >
                Case file
              </div>
              <Reveal delay={0.18}>
                <CaseFragment label="Presenting complaint" className="ml-0 min-h-32 -rotate-1">
                  &ldquo;I hear a voice telling me I&apos;m worthless. It&apos;s not mine.&rdquo;
                </CaseFragment>
              </Reveal>
              <Reveal delay={0.28}>
                <CaseFragment label="Observation" className="ml-4 min-h-32 rotate-1 sm:ml-9">
                  Sits very still, hands folded. Speaks in a flat, even voice.
                </CaseFragment>
              </Reveal>
              <Reveal delay={0.38}>
                <CaseFragment label="Formulation" className="ml-8 min-h-32 -rotate-1 sm:ml-16">
                  The heaviness is the only language her belief system permits
                  for distress.
                </CaseFragment>
              </Reveal>
            </div>
            <Stamp variant="accent" className="absolute bottom-2 left-2 z-20 rotate-[4deg]">
              Practise
            </Stamp>
          </Parallax>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section id="about" className="relative scroll-mt-20 border-t-2 border-foreground bg-card">
      {/* A spoken belief deserves an opening mark. Scales up gently as it
          enters the viewport; purely decorative and aria-hidden. */}
      <ScrollScale
        from={0.8}
        className="pointer-events-none absolute -top-10 left-4 select-none text-[9rem] font-serif leading-none text-foreground/5 sm:left-8 sm:text-[12rem] lg:text-[15rem]"
      >
        <span aria-hidden>&ldquo;</span>
      </ScrollScale>
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-6">
        <Reveal>
          <SectionEyebrow index="01">Why this school exists</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            Theory gives you the language.{" "}
            <span className="font-serif font-medium italic">Practice teaches you how to use it.</span>
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
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
        <Rule className="mt-12" />
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
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
      <Reveal>
        <SectionEyebrow index="02">The method</SectionEyebrow>
        <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
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
            <Reveal delay={i * 0.08} className="h-full">
              <div
                className={cn(
                  // h-full keeps the three cards equal within the desktop row;
                  // min-h-64 keeps the stacked mobile view equal too (the Learn
                  // card has one line less of body copy).
                  "flex h-full min-h-64 flex-col rounded-lg border-2 p-6 hard-shadow-sm transition-[transform,box-shadow] duration-base ease-snappy hover:-translate-y-0.5 hover:hard-shadow-md",
                  i === 1 ? "border-primary bg-accent" : "border-foreground bg-card",
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
    <section className="border-y-2 border-foreground bg-secondary/50">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-6">
        <Reveal>
          <SectionEyebrow index="03">Who is building this</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            A small team, and <span className="font-serif font-medium italic">you know their names.</span>
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              VIBHA School of Psychology is a new initiative. The team behind it
              is small, and it is easy to name.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 border-2 border-foreground bg-card hard-shadow-sm">
            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground">{BRAND.lead}</p>
                <p className="mt-0.5 text-small text-muted-foreground">
                  He is the psychiatrist the school is built around.
                </p>
              </div>
              <span className="mt-2 w-fit shrink-0 rounded-md border-2 border-foreground bg-secondary px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-secondary-foreground sm:mt-0">
                Clinical lead
              </span>
            </div>
            <div className="flex flex-col gap-1 border-t-2 border-foreground px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-bold text-foreground">{BRAND.builder}</p>
              <span className="mt-2 w-fit shrink-0 rounded-md border-2 border-foreground bg-secondary px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-secondary-foreground sm:mt-0">
                Building the programme
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Guest lectures keep the teaching from resting on a single voice.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden border-2 border-foreground bg-card p-8 text-center hard-shadow-md sm:p-12">
          <span aria-hidden className="absolute left-3 top-3 size-2.5 bg-primary" />
          <span aria-hidden className="absolute right-3 top-3 size-2.5 bg-primary" />
          <span aria-hidden className="absolute bottom-3 left-3 size-2.5 bg-primary" />
          <span aria-hidden className="absolute bottom-3 right-3 size-2.5 bg-primary" />
          <Stamp className="absolute right-14 top-12 hidden rotate-[8deg] sm:block">Invite-only</Stamp>
          <p className="text-eyebrow text-muted-foreground">Cohort One — by invitation</p>
          <h2 className="mt-4 text-balance text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
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
          <Rule className="mx-auto mt-6 max-w-xs" />
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            A small cohort, a real curriculum, a method built for the room.
            Tell us who you are.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-foreground bg-card">
      <ObservationRings className="pointer-events-none absolute -bottom-16 -right-10 w-44 rotate-12 text-foreground/[0.05]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <VibhaWordmark size={32} />
        <nav className="flex flex-wrap items-center gap-5 text-caption text-muted-foreground" aria-label="Footer">
          <Link
            href="#about"
            className="transition-[color,translate] duration-base ease-snappy hover:-translate-x-0.5 hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/login"
            className="transition-[color,translate] duration-base ease-snappy hover:-translate-x-0.5 hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/waitlist"
            className="transition-[color,translate] duration-base ease-snappy hover:-translate-x-0.5 hover:text-foreground"
          >
            Join waitlist
          </Link>
        </nav>
        <p className="text-caption text-muted-foreground">
          © 2026 {BRAND.name}
        </p>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Problem />
        <ThreeIdeas />
        <WhoBuilds />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
