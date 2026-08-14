import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VibhaWordmark } from "@/components/brand/vibha-logo";
import { LandingNav } from "./landing-nav";
import { Parallax } from "./parallax";
import { Reveal } from "./reveal";
import { KineticHeadline } from "./kinetic-headline";
import { ScrollScale } from "./scroll-scale";

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

/** A closed measure: a 2px ink score line ending in a peach square. */
function Rule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-2", className)}>
      <span className="h-0.5 flex-1 bg-foreground" />
      <span className="size-2 shrink-0 bg-primary" />
    </div>
  );
}

/** A rotated rubber-stamp. Double-ring outline, peach fill, ink text. */
function Stamp({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "select-none rounded-md border-2 border-foreground bg-primary px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.2em] text-primary-foreground outline-2 outline-offset-2 outline-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section eyebrow with a mono index numeral (editorial wayfinding). */
function SectionEyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-eyebrow text-muted-foreground">
      <span aria-hidden className="font-mono text-sm font-black tracking-normal text-link">
        {index}
      </span>
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
      {children}
    </p>
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
      {/* Decorative observation rings behind the hero. Very low contrast,
          parallax-aware, and clipped by the section so they can never scroll
          the page sideways. aria-hidden: purely visual. */}
      <Parallax from={12} to={-12} className="pointer-events-none absolute -right-24 -top-16 select-none">
        <ObservationRings className="w-72 text-foreground/[0.07] sm:w-[30rem] lg:w-[36rem]" />
      </Parallax>

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-6 lg:pt-24">
        <Reveal>
          <p className="text-eyebrow text-muted-foreground">A clinical psychology training programme</p>
        </Reveal>
        {/* Poster statement: the headline runs the full width as a two-line
            statement — broken at the natural comma at the poster breakpoint —
            before the two-column row below it. Two kinetic segments so the
            word-cascade flows across the break uninterrupted (line 2 resumes
            at the first line's word count). Below lg the forced break is
            dropped and the phrase flows naturally into ~2 lines. */}
        <h1 className="mt-3 max-w-4xl text-[2rem] font-black leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
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

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col">
            <Reveal delay={0.22}>
              <p className="max-w-lg min-w-0 break-words text-base leading-relaxed text-muted-foreground sm:text-lg">
                Psychology graduates can describe therapy. Few can practise it. VIBHA
                School of Psychology closes that gap with real cases, simulated
                patients, and a debrief after every session.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/enquire" className={cn(buttonVariants({ size: "lg" }), "group gap-2 font-semibold")}>
                  Enquire{" "}
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
              <p className="mt-5 text-small font-medium text-foreground">
                Cohort One begins {BRAND.cohortStart} · Invite-only
              </p>
            </Reveal>
          </div>

          {/* The intake file: the product's raw material, drawn with the LMS's
              card and hard-shadow language. A pad sheet peeks out behind, a
              tape strip seals the top, and a "PRACTISE" stamp marks the
              school's thesis. Purely decorative; parallax is disabled under
              prefers-reduced-motion. */}
          <Parallax from={10} to={-10} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden
              className="absolute inset-0 translate-x-2.5 translate-y-2.5 rotate-1 rounded-lg border-2 border-foreground bg-secondary/30"
            />
            <div className="relative space-y-3">
              <div
                aria-hidden
                className="absolute -top-3.5 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rotate-[-4deg] border border-foreground bg-primary/60"
              />
              <Reveal delay={0.18}>
                <CaseFragment label="Presenting complaint" className="ml-0 -rotate-1">
                  &ldquo;I hear a voice telling me I&apos;m worthless. It&apos;s not mine.&rdquo;
                </CaseFragment>
              </Reveal>
              <Reveal delay={0.28}>
                <CaseFragment label="Observation" className="mr-6 rotate-1 sm:mr-12">
                  Sits very still, hands folded. Speaks in a flat, even voice. Looks at
                  her sister before every answer.
                </CaseFragment>
              </Reveal>
              <Reveal delay={0.38}>
                <CaseFragment label="Formulation" className="ml-4 sm:ml-10">
                  The heaviness is the only language her belief system permits for
                  distress.
                </CaseFragment>
              </Reveal>
            </div>
            <Stamp className="absolute -bottom-4 -left-2 z-20 rotate-[-6deg]">Practise</Stamp>
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
              Most psychology graduates finish their degrees able to describe
              therapy. They know the models, the terminology, the diagnoses.
              Almost none can sit with a patient and think in real time.
            </p>
            <p>
              That gap is not a failure of students. It is a failure of method,
              and you cannot learn to be in the room by reading about it.
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
      body: "Interviewing, the mental status exam, formulation, ethics and the law. They form one working method, taught in order, not disconnected lectures.",
    },
    {
      num: "02",
      eyebrow: "Experience",
      title: "Simulated patients, real sessions",
      body: "You don't practise on a stranger first. You interview simulated patients, run timed assessments and revisit your own transcripts, the way you'll actually work.",
    },
    {
      num: "03",
      eyebrow: "Apply",
      title: "Write it, defend it, learn from the debrief",
      body: "You write the formulation, run the assessment, make the call. Then the debrief shows what the patient actually presented, and where your ears went quiet.",
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
                  "h-full rounded-lg border-2 p-6 hard-shadow-sm transition-[transform,box-shadow] duration-base ease-snappy hover:-translate-y-0.5 hover:hard-shadow-md",
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
          <div className="mt-8 divide-y-2 divide-foreground border-2 border-foreground bg-card hard-shadow-sm">
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
            <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-bold text-foreground">{BRAND.builder}</p>
              <span className="mt-2 w-fit shrink-0 rounded-md border-2 border-foreground bg-secondary px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-secondary-foreground sm:mt-0">
                Building the programme
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            There are guest lectures as well, so the teaching never rests on a single voice.
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
          <Stamp className="absolute right-6 top-6 hidden rotate-[8deg] sm:block">Invite-only</Stamp>
          <p className="text-eyebrow text-muted-foreground">Cohort One — by invitation</p>
          <h2 className="mt-4 text-balance text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
            Cohort One begins <span className="font-serif font-medium italic text-link">{BRAND.cohortStart}.</span>
          </h2>
          <Rule className="mx-auto mt-6 max-w-xs" />
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            A small cohort, a real curriculum, and a method built for the room.
            Tell us who you are, and we&apos;ll be in touch.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/enquire" className={cn(buttonVariants({ size: "lg" }), "group gap-2 font-semibold")}>
              Enquire{" "}
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
            href="/enquire"
            className="transition-[color,translate] duration-base ease-snappy hover:-translate-x-0.5 hover:text-foreground"
          >
            Enquire
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
        <Problem />
        <ThreeIdeas />
        <WhoBuilds />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
