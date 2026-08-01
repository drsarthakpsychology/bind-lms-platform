import Link from "next/link";

export default function ExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-5 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-status-pending-bg text-status-pending-fg">
          !
        </div>
        <h1 className="mt-4 font-serif text-xl font-semibold tracking-tight text-foreground">
          Access has expired
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your account&apos;s access window has ended. Contact your
          administrator if you believe this is a mistake.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
