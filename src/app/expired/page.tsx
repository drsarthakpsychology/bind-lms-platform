import type { Metadata } from "next";
import Link from "next/link";
import { Hourglass } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ExpiredPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background px-5 py-8">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-bold tracking-tight text-foreground">
          <span className="flex size-7 items-center justify-center rounded-sm bg-primary text-sm font-black text-primary-foreground">
            {BRAND.shortName.charAt(0)}
          </span>
          <span className="text-lg">{BRAND.shortName}</span>
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-md border-2 border-border bg-status-pending-bg text-status-pending-fg">
            <Hourglass className="size-6" aria-hidden />
          </div>
          <div className="space-y-2">
            <h1 className="text-h1">Access has expired</h1>
            <p className="mx-auto max-w-xs text-small leading-relaxed text-muted-foreground">
              Your account&apos;s access window has ended. Contact your administrator if you
              believe this is a mistake.
            </p>
          </div>
          <div className="rounded-lg border-2 border-foreground bg-card p-6 hard-shadow-md">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
