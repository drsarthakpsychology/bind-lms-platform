"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, Mic, MicOff, RotateCcw, Sparkles, TriangleAlert, Users } from "lucide-react";
import { selfScore, type SelfScore } from "@/lib/prep/interview";
import { cn } from "@/lib/utils";
import { interviewFeedback, revealInterview, saveInterviewSession, type InterviewReveal } from "../actions";
import { btnInk, btnPlain, btnPrimary, card } from "../ui";

export type PanelQ = { id: string; category: string; question: string; followUp: string | null };

type Done = { id: string; answer: string; covered: string[]; flags: string[]; feedback: string | null; score: SelfScore };

/* ------------------------------------------------ optional speech */

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionCtor = new () => Recognition;

function speechCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
const noop = () => () => undefined;

/** Speech-to-text when the browser has it; never required. */
function useDictation(onText: (t: string) => void) {
  const supported = React.useSyncExternalStore(noop, () => !!speechCtor(), () => false);
  const [listening, setListening] = React.useState(false);
  const rec = React.useRef<Recognition | null>(null);
  const cb = React.useRef(onText);
  React.useEffect(() => {
    cb.current = onText;
  });
  React.useEffect(() => () => rec.current?.stop(), []);

  function toggle() {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const Ctor = speechCtor();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = "en-IN";
    r.continuous = true;
    r.interimResults = false;
    r.onresult = (e) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) text += e.results[i][0].transcript;
      if (text.trim()) cb.current(text.trim());
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }
  return { supported, listening, toggle, stop: () => rec.current?.stop() };
}

function AnswerBox({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const dict = useDictation((t) => onChange(value ? `${value.trimEnd()} ${t}` : t));
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="block w-full rounded-md border-2 border-foreground bg-card px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        placeholder="Answer as you would to the panel."
      />
      {dict.supported ? (
        <button type="button" className={cn(btnPlain, dict.listening && "bg-status-alert-bg text-status-alert-fg")} aria-pressed={dict.listening} onClick={dict.toggle}>
          {dict.listening ? <MicOff className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
          {dict.listening ? "Stop speaking" : "Speak instead"}
        </button>
      ) : null}
    </div>
  );
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/**
 * The panel: question → answer (typed or spoken) → one follow-up → tick the
 * must-cover points and red flags against the rubric → model answer →
 * optional AI feedback → next. At the end the session is stored.
 */
export function InterviewPanel({ questions: initial, saving }: { questions: PanelQ[]; saving: boolean }) {
  const router = useRouter();
  const [questions] = React.useState(initial);
  const [idx, setIdx] = React.useState(-1);
  const [stage, setStage] = React.useState<"answer" | "follow" | "check">("answer");
  const [main, setMain] = React.useState("");
  const [follow, setFollow] = React.useState("");
  const [rubric, setRubric] = React.useState<InterviewReveal | null>(null);
  const [covered, setCovered] = React.useState<string[]>([]);
  const [flags, setFlags] = React.useState<string[]>([]);
  const [feedback, setFeedback] = React.useState<{ text?: string; error?: string } | null>(null);
  const [asking, setAsking] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<Done[]>([]);
  const [saved, setSaved] = React.useState<{ saved: boolean; score: number } | null>(null);
  const [refreshing, startRefresh] = React.useTransition();
  const heading = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (idx >= 0) heading.current?.focus();
  }, [idx, stage]);

  if (!questions.length) {
    return (
      <div className={card}>
        <p className="font-semibold">Interview questions are still being added.</p>
        <p className="mt-1 text-muted-foreground">Check back soon.</p>
      </div>
    );
  }

  const q = questions[idx];
  const answer = [main.trim(), follow.trim() ? `Follow-up: ${follow.trim()}` : ""].filter(Boolean).join("\n\n");
  const score = rubric ? selfScore(rubric.mustCover.length, covered.length, flags.length) : null;

  async function toRubric() {
    if (!q) return;
    setBusy(true);
    setError(null);
    try {
      const r = await revealInterview(q.id);
      if ("error" in r) throw new Error(r.error);
      setRubric(r);
      setStage("check");
    } catch {
      setError("Couldn't load the checklist. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function askAi() {
    if (!q) return;
    setAsking(true);
    try {
      setFeedback(await interviewFeedback({ id: q.id, answer }));
    } catch {
      setFeedback({ error: "Couldn't get feedback. Try again in a moment." });
    } finally {
      setAsking(false);
    }
  }

  async function next() {
    if (!q || !score) return;
    const list = [...done, { id: q.id, answer, covered, flags, feedback: feedback?.text ?? null, score }];
    setDone(list);
    setMain("");
    setFollow("");
    setRubric(null);
    setCovered([]);
    setFlags([]);
    setFeedback(null);
    setStage("answer");
    setIdx(idx + 1);
    if (idx + 1 >= questions.length) {
      try {
        setSaved(await saveInterviewSession({ items: list.map((d) => ({ id: d.id, answer: d.answer, covered: d.covered, flags: d.flags, feedback: d.feedback })) }));
      } catch {
        setSaved({ saved: false, score: Math.round(list.reduce((a, d) => a + d.score.pct, 0) / list.length) });
      }
    }
  }

  const toggle = (list: string[], set: (v: string[]) => void, x: string) => set(list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);

  if (idx < 0) {
    return (
      <div className="space-y-5">
        <header className="space-y-2">
          <p className="text-eyebrow text-link">Mock interview</p>
          <h1 className="text-h1">Face the panel</h1>
        </header>
        <div className={cn(card, "space-y-4 hard-shadow-md")}>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <Users className="mt-0.5 size-5 shrink-0" aria-hidden /> {questions.length} questions, the way panels usually run, each with a follow-up.
            </li>
            <li className="flex gap-2">
              <Mic className="mt-0.5 size-5 shrink-0" aria-hidden /> Type your answer, or speak it if your browser allows.
            </li>
            <li className="flex gap-2">
              <BadgeCheck className="mt-0.5 size-5 shrink-0" aria-hidden /> Then check yourself against what a strong answer covers, and see a model answer.
            </li>
          </ul>
          <button type="button" className={cn(btnPrimary, "w-full text-base")} onClick={() => setIdx(0)}>
            Start <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  if (idx >= questions.length) {
    const avg = saved?.score ?? Math.round(done.reduce((a, d) => a + d.score.pct, 0) / Math.max(1, done.length));
    return (
      <div className="space-y-5">
        <header className="space-y-1">
          <p className="text-eyebrow text-link">Interview done</p>
          <h1 className="text-h1">You covered {avg}% of the key points</h1>
          <p className="text-muted-foreground">{saved === null ? "Saving…" : saved.saved ? "Saved. Each new panel mixes in questions you haven't had." : saving ? "Couldn't save this session, but your scores are above." : "Staff preview: nothing was saved."}</p>
        </header>
        <ol className="space-y-2">
          {done.map((d, i) => (
            <li key={d.id} className="flex items-center gap-3 rounded-md border-2 border-foreground bg-card p-3">
              <span className="font-mono text-sm text-link">{i + 1}</span>
              <span className="min-w-0 flex-1 text-sm">{questions[i].question}</span>
              <Band score={d.score} />
            </li>
          ))}
        </ol>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Link href="/prep" className={btnPrimary}>
            Back to your plan <ArrowRight className="size-4" aria-hidden />
          </Link>
          <button type="button" className={btnPlain} disabled={refreshing} onClick={() => startRefresh(() => router.refresh())}>
            <RotateCcw className="size-4" aria-hidden /> {refreshing ? "Finding questions…" : "Another panel"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold">
        <span>
          Question {idx + 1} of {questions.length}
        </span>
        <span className="text-muted-foreground">{q.category}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card" aria-hidden>
        <div className="h-full origin-left bg-brand transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `scaleX(${idx / questions.length})` }} />
      </div>

      <div className={cn(card, "space-y-1")}>
        <p className="text-eyebrow text-muted-foreground">The panel asks</p>
        <h1 ref={stage === "answer" ? heading : undefined} tabIndex={-1} className="text-xl font-semibold leading-snug outline-none">
          {q.question}
        </h1>
      </div>

      {stage === "answer" ? (
        <>
          <AnswerBox id={`a-${q.id}`} label="Your answer" value={main} onChange={setMain} />
          <button type="button" className={cn(btnPrimary, "w-full")} disabled={words(main) < 3} onClick={() => (q.followUp ? setStage("follow") : void toRubric())}>
            I&apos;ve answered <ArrowRight className="size-4" aria-hidden />
          </button>
        </>
      ) : null}

      {stage === "follow" && q.followUp ? (
        <>
          <div className="rounded-md border-2 border-dashed border-foreground/60 p-4">
            <p className="text-eyebrow text-muted-foreground">Follow-up</p>
            <h2 ref={heading} tabIndex={-1} className="mt-1 text-lg font-semibold outline-none">
              {q.followUp}
            </h2>
          </div>
          <AnswerBox id={`f-${q.id}`} label="Your answer to the follow-up" value={follow} onChange={setFollow} />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button type="button" className={btnPlain} disabled={busy} onClick={() => void toRubric()}>
              Skip the follow-up
            </button>
            <button type="button" className={btnPrimary} disabled={busy || words(follow) < 3} onClick={() => void toRubric()}>
              {busy ? "Loading…" : "Check my answer"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </>
      ) : null}

      {error ? (
        <p role="alert" className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-alert-bg p-3 text-sm font-semibold text-status-alert-fg">
          <TriangleAlert className="size-4 shrink-0" aria-hidden /> {error}
        </p>
      ) : null}

      {stage === "check" && rubric && score ? (
        <div className="space-y-5">
          <details className="rounded-md border-2 border-foreground bg-card">
            <summary className="flex min-h-12 cursor-pointer items-center px-4 font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60">What you said</summary>
            <p className="border-t-2 border-foreground p-4 whitespace-pre-line">{answer}</p>
          </details>

          <fieldset className="space-y-2">
            <legend ref={heading as React.Ref<HTMLLegendElement>} tabIndex={-1} className="text-h3 outline-none">
              Did you cover these?
            </legend>
            {rubric.mustCover.map((m) => (
              <Tick key={m} label={m} on={covered.includes(m)} onChange={() => toggle(covered, setCovered, m)} />
            ))}
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="text-h3">Did you do any of these?</legend>
            <p className="text-sm text-muted-foreground">These lose marks with a panel.</p>
            {rubric.redFlags.map((m) => (
              <Tick key={m} label={m} on={flags.includes(m)} onChange={() => toggle(flags, setFlags, m)} warn />
            ))}
          </fieldset>

          <p className="flex flex-wrap items-center gap-2 font-semibold" aria-live="polite">
            Your score for this one: {score.pct}% <Band score={score} />
          </p>

          <div className="space-y-2 rounded-md border-2 border-foreground bg-secondary p-4">
            <p className="text-eyebrow">A strong answer</p>
            <p className="whitespace-pre-line">{rubric.modelAnswer}</p>
          </div>

          <div className="space-y-2">
            {feedback?.text ? (
              <div className="space-y-1 rounded-md border-2 border-foreground bg-card p-4">
                <p className="flex items-center gap-1.5 text-eyebrow">
                  <Sparkles className="size-4" aria-hidden /> AI feedback
                </p>
                <p className="whitespace-pre-line">{feedback.text}</p>
                <p className="text-caption text-muted-foreground">Written by AI. Use it as a second opinion, not a verdict.</p>
              </div>
            ) : (
              <button type="button" className={btnPlain} disabled={asking} onClick={() => void askAi()}>
                <Sparkles className="size-4" aria-hidden /> {asking ? "Reading your answer…" : "Get AI feedback (optional)"}
              </button>
            )}
            {feedback?.error ? <p className="text-sm text-muted-foreground">{feedback.error}</p> : null}
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <button type="button" className={btnPlain} onClick={() => setStage("answer")}>
              <ArrowLeft className="size-4" aria-hidden /> Change my answer
            </button>
            <button type="button" className={btnInk} onClick={() => void next()}>
              {idx + 1 >= questions.length ? "Finish" : "Next question"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Tick({ label, on, onChange, warn = false }: { label: string; on: boolean; onChange: () => void; warn?: boolean }) {
  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-start gap-3 rounded-md border-2 border-foreground px-3 py-2.5 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60",
        on ? (warn ? "bg-status-alert-bg text-status-alert-fg" : "bg-status-success-bg text-status-success-fg") : "bg-card",
      )}
    >
      <input type="checkbox" checked={on} onChange={onChange} className="mt-0.5 size-5 shrink-0 accent-foreground" />
      <span>{label}</span>
    </label>
  );
}

function Band({ score }: { score: SelfScore }) {
  const map = {
    strong: { label: "Strong", tone: "bg-status-success-bg text-status-success-fg", Icon: BadgeCheck },
    okay: { label: "Getting there", tone: "bg-status-info-bg text-status-info-fg", Icon: ArrowRight },
    weak: { label: "Needs work", tone: "bg-status-alert-bg text-status-alert-fg", Icon: TriangleAlert },
  }[score.band];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-foreground px-2 py-0.5 text-xs font-bold", map.tone)}>
      <map.Icon className="size-3.5" aria-hidden /> {map.label}
    </span>
  );
}
