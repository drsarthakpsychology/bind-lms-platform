import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CONTACT } from "@/components/home/content";

/**
 * A full-page account notice (access expired, access paused): the site
 * header so people know where they are, one centred block (icon, title, one
 * plain line), then a single obvious next step. For these states the real way
 * forward is a message to the team, so WhatsApp is the main button and
 * signing in again is the quiet second option.
 */
export function AccountNotice({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="rail flex w-full flex-1 items-center justify-center py-12 sm:py-20">
        <div className="w-full max-w-md text-center">
          <span
            aria-hidden
            className="mx-auto flex size-16 items-center justify-center rounded-xl border-2 border-foreground bg-card text-foreground hard-shadow-sm"
          >
            <Icon className="size-7" />
          </span>
          <h1 className="mt-6 text-h1 text-foreground">{title}</h1>
          <p className="mx-auto mt-3 max-w-sm text-body text-muted-foreground">{text}</p>
          <div className="mt-8 flex flex-col gap-2">
            <Button asChild size="lg" className="w-full">
              <a href={CONTACT.whatsappHref}>
                <MessageCircle className="size-4" aria-hidden />
                Message us on WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost" className="w-full">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </div>
          <p className="mt-4 text-caption text-muted-foreground">
            Or call{" "}
            <a href={CONTACT.phoneHref} className="font-semibold text-link underline underline-offset-4">
              {CONTACT.phone}
            </a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
