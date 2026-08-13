import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        "min-w-0 rounded-md border-2 border-foreground bg-card p-4 hard-shadow-sm transition-[transform,box-shadow] duration-base ease-snappy hover:-translate-y-0.5 hover:hard-shadow-md",
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
    <section className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 overflow-hidden px-5 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
      {/* Decorative observation rings behind the hero. Very low contrast,
          parallax-aware, and clipped by the section so they can never scroll
          the page sideways. aria-hidden: purely visual. */}
      <Parallax from={18} to={-18} className="pointer-events-none absolute -right-28 -top-24 select-none">
        <ObservationRings className="w-72 text-foreground/[0.07] sm:w-[30rem] lg:w-[38rem]" />
      </Parallax>

      <div className="flex flex-col">
        <Reveal>
          <p className="text-eyebrow text-muted-foreground">A clinical psychology training programme</p>
        </Reveal>
        <h1 className="mt-3 max-w-2xl text-5xl font-black leading-[1.15] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          <KineticHeadline delay={0.1} stagger={0.05}>
            Understand the case, not just the diagnosis.
          </KineticHeadline>
        </h1>
        <Reveal delay={0.22}>
          <p className="mt-5 max-w-lg min-w-0 break-words text-base leading-relaxed text-muted-foreground sm:text-lg">
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
          <p className="mt-5 text-caption text-muted-foreground">
            Cohort One begins 20 August · Invite-only
          </p>
        </Reveal>
      </div>

      {/* Layered case fragments, the product's raw material, drawn with the
          LMS's card and hard-shadow language. They cascade in and drift
          subtly on scroll (parallax is disabled under prefers-reduced-motion). */}
      <Parallax from={12} to={-12} className="relative mx-auto w-full max-w-sm lg:max-w-none">
        <div className="space-y-3">
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
      </Parallax>
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
          <p className="text-eyebrow text-muted-foreground">Why this school exists</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            Theory gives you the language. Practice teaches you how to use it.
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
      </div>
    </section>
  );
}

function ThreeIdeas() {
  const ideas = [
    {
      eyebrow: "Learn",
      title: "The structured science",
      body: "Interviewing, the mental status exam, formulation, ethics and the law. They form one working method, taught in order, not disconnected lectures.",
    },
    {
      eyebrow: "Experience",
      title: "Simulated patients, real sessions",
      body: "You don't practise on a stranger first. You interview simulated patients, run timed assessments and revisit your own transcripts, the way you'll actually work.",
    },
    {
      eyebrow: "Apply",
      title: "Write it, defend it, learn from the debrief",
      body: "You write the formulation, run the assessment, make the call. Then the debrief shows what the patient actually presented, and where your ears went quiet.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
      <Reveal>
        <p className="text-eyebrow text-muted-foreground">The method</p>
        <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
          Learn, experience, apply. In that order.
        </h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {ideas.map((idea, i) => (
          <Reveal key={idea.eyebrow} delay={i * 0.08} className={cn(i === 1 && "md:mt-10", i === 2 && "md:mt-4")}>
            <div className="rounded-md border-2 border-foreground bg-card p-6 hard-shadow-sm transition-[transform,box-shadow] duration-base ease-snappy hover:-translate-y-0.5 hover:hard-shadow-md">
              <p className="text-eyebrow text-primary">{idea.eyebrow}</p>
              <h3 className="mt-2 min-w-0 break-words text-xl font-bold text-foreground">{idea.title}</h3>
              <p className="mt-3 min-w-0 break-words text-small leading-relaxed text-muted-foreground">{idea.body}</p>
            </div>
          </Reveal>
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
          <p className="text-eyebrow text-muted-foreground">Who is building this</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            A small team, and you know their names.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              VIBHA School of Psychology is the training arm of{" "}
              <span className="font-semibold text-foreground">{BRAND.parent}</span>. The team behind
              it is small, and it is easy to name.
            </p>
            <p>
              <span className="font-semibold text-foreground">{BRAND.lead}</span> is the clinical
              lead. He is the psychiatrist the school is built around.
            </p>
            <p>Kavya Bothra is one of the people building the programme.</p>
            <p>There are guest lectures as well, so the teaching never rests on a single voice.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-6">
      <Reveal>
        <h2 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
          Cohort One begins 20 August.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
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
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-foreground bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
          © 2026 {BRAND.name} · {BRAND.parent}
        </p>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
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
