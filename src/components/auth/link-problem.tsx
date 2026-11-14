import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/components/home/content";

/**
 * What a broken setup or password link shows inside the sign-in card: the
 * reason in one line, then the fix as a button (a fresh link comes from the
 * team on WhatsApp), with signing in as the quiet second way on.
 */
export function LinkProblem({ reason }: { reason: string }) {
  return (
    <div className="space-y-5">
      <p className="text-body font-semibold text-foreground">{reason}</p>
      <p className="text-small text-muted-foreground">Message us on WhatsApp and we&apos;ll send you a fresh link.</p>
      <div className="flex flex-col gap-2">
        <Button asChild size="lg" className="w-full">
          <a href={CONTACT.whatsappHref}>
            <MessageCircle className="size-4" aria-hidden />
            Get a new link
          </a>
        </Button>
        <Button asChild size="lg" variant="ghost" className="w-full">
          <Link href="/login">Go to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
