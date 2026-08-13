import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LandingNav } from "./landing-nav";
import { Parallax } from "./parallax";
import { Reveal } from "./reveal";

/**
 * The public front door. Premium, minimal, neo-brutalist pastel — the LMS's
 * visual language, made into a landing page. Every claim here is sourced from
 * the actual product (cases, debriefs, the calibration loop). Nothing fabricated.
 */

function CaseFragment({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0 rounded-md border-2 border-foreground bg-card p-4 hard-shadow-sm", className)}>
      <p className="text-eyebrow text-muted-foreground">{label}</p>
      <p className="mt-2 min-w-0 break-words text-small leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20">
      <Reveal>
        <p className="text-eyebrow text-muted-foreground">A clinical psychology training programme</p>
      </Reveal>
      <Reveal delay={0.06}>
        <h1 className="mt-3 max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Understand the case, not just the diagnosis.
        </h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-5 max-w-lg min-w-0 break-words text-base leading-relaxed text-muted-foreground sm:text-lg">
          Psychology graduates can describe therapy. Few can practise it. VIBHA
          School of Psychology closes that gap — with real cases, simulated
          patients, and a debrief after every session.
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href="/enquire" className={cn(buttonVariants({ size: "lg" }), "gap-2 font-semibold")}>
            Enquire <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "font-semibold")}>
            Login
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.24}>
        <p className="mt-5 text-caption text-muted-foreground">
          Cohort One begins 20 August · Invite-only
        </p>
      </Reveal>

      {/* Layered case fragments — the product's raw material, drawn with the
          LMS's card + hard-shadow language. Cascade in, drift subtly on
          scroll (parallax disabled under prefers-reduced-motion). */}
      <Parallax from={12} to={-12} className="relative mx-auto w-full max-w-sm lg:max-w-none">
        <div className="space-y-3">
          <Reveal delay={0.15}>
            <CaseFragment label="Presenting complaint" className="ml-0 -rotate-1">
              &ldquo;I hear a voice telling me I&apos;m worthless. It&apos;s not mine.&rdquo;
            </CaseFragment>
          </Reveal>
          <Reveal delay={0.25}>
            <CaseFragment label="Observation" className="mr-6 rotate-1 sm:mr-12">
              Sits very still, hands folded. Speaks in a flat, even voice. Looks at
              her sister before every answer.
            </CaseFragment>
          </Reveal>
          <Reveal delay={0.35}>
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
    <section id="about" className="border-t-2 border-foreground bg-card">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-6">
        <Reveal>
          <p className="text-eyebrow text-muted-foreground">Why this school exists</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            Theory gives you the language. Practice teaches you how to use it.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Most psychology graduates finish their degrees able to describe
              therapy — the models, the terminology, the diagnoses. Almost none
              can sit with a patient and think in real time.
            </p>
            <p>
              That gap is not a failure of students. It is a failure of method:
              you cannot learn to be in the room by reading about it.
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
      body: "Interviewing, the mental status exam, formulation, ethics and the law — the clinical framework, taught in order as one working method, not disconnected lectures.",
    },
    {
      eyebrow: "Experience",
      title: "Simulated patients, real sessions",
      body: "You don't practise on a stranger first. You interview simulated patients, run timed assessments and revisit your own transcripts — the way you'll actually work.",
    },
    {
      eyebrow: "Apply",
      title: "Write it, defend it, learn from the debrief",
      body: "You write the formulation, run the assessment, make the call — then the debrief shows what the patient actually presented, and where your ears went quiet.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
      <Reveal>
        <p className="text-eyebrow text-muted-foreground">The method</p>
        <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
          Learn, experience, apply — in that order.
        </h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {ideas.map((idea, i) => (
          <Reveal key={idea.eyebrow} delay={i * 0.08} className={cn(i === 1 && "md:mt-10", i === 2 && "md:mt-4")}>
            <div className="rounded-md border-2 border-foreground bg-card p-6 hard-shadow-sm">
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
            Built by clinicians, calibrated on the clinic.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              VIBHA School of Psychology is the training arm of{" "}
              <span className="font-semibold text-foreground">{BRAND.parent}</span>.
            </p>
            <p>
              The clinical lead is{" "}
              <span className="font-semibold text-foreground">{BRAND.lead}</span>.
              Every automated assessment in the programme is calibrated against
              his blind scoring — the same standard a supervisor would hold you
              to, applied to every practice session.
            </p>
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
          Tell us who you are — we&apos;ll be in touch.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/enquire" className={cn(buttonVariants({ size: "lg" }), "gap-2 font-semibold")}>
            Enquire <ArrowRight className="size-4" aria-hidden />
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
        <span className="flex items-center gap-2 font-bold text-foreground">
          <span className="flex size-7 items-center justify-center rounded-sm bg-primary text-xs font-black text-primary-foreground">
            {BRAND.shortName.charAt(0)}
          </span>
          <span className="text-small font-bold tracking-wide">{BRAND.nameUppercase}</span>
        </span>
        <nav className="flex flex-wrap items-center gap-5 text-caption text-muted-foreground" aria-label="Footer">
          <Link href="#about" className="transition-colors hover:text-foreground">About</Link>
          <Link href="/login" className="transition-colors hover:text-foreground">Login</Link>
          <Link href="/enquire" className="transition-colors hover:text-foreground">Enquire</Link>
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
