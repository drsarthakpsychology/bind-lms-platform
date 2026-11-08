import * as React from "react";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The not-found page: says what happened in plain words and gives one way
 * on (Home: the student's Home, an admin's Admin, a visitor's homepage, via
 * /go/home). `extra` adds a second, quieter way on (Search, inside the app).
 * Same look as ErrorState.
 */
export function NotFoundState({ extra, className }: { extra?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex w-full items-center justify-center px-4 py-8", className)}>
      <div className="animate-enter w-full max-w-md space-y-4 text-center">
        <div aria-hidden className="mx-auto flex size-12 items-center justify-center rounded-md border-2 border-border bg-accent text-foreground">
          <SearchX className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-h2">Page not found</h1>
          <p className="mx-auto max-w-sm text-small text-muted-foreground">This page has moved, or the link is wrong.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button asChild variant="default">
            <Link href="/go/home">
              <ArrowLeft className="size-4" aria-hidden />
              Back to Home
            </Link>
          </Button>
          {extra}
        </div>
      </div>
    </div>
  );
}
