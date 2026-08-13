"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { VibhaWordmark } from "@/components/brand/vibha-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [{ href: "#about", label: "About" }];

/**
 * Public-site navigation. Desktop: logo + About + Login + Enquire. Mobile:
 * a full-screen sheet (not a cramped dropdown) with Escape-to-close and
 * focus moved into it. Matches the LMS chrome without being identical.
 */
export function LandingNav() {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const closeMenu = React.useCallback(() => {
    setOpen(false);
    // Return focus to the trigger that opened the sheet, so keyboard users
    // resume where they left off.
    triggerRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!open) return;

    // Lock background scroll while the full-screen sheet is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;
      // Trap focus inside the sheet so Tab can't fall behind the overlay.
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || active === document.body)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    // Move focus into the sheet.
    const first = panelRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeMenu]);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-foreground bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6">
        <Link href="/" aria-label={`${BRAND.name} home`} className="flex items-center">
          <span className="sm:hidden">
            <VibhaWordmark compact size={28} />
          </span>
          <span className="hidden sm:inline-flex">
            <VibhaWordmark size={28} />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-small font-medium text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="text-small font-medium text-muted-foreground transition-colors hover:text-foreground">
            Login
          </Link>
          <Link href="/enquire" className={cn(buttonVariants({ size: "sm" }), "font-semibold")}>
            Enquire
          </Link>
        </nav>

        {/* Mobile trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex size-9 items-center justify-center rounded-md border-2 border-foreground bg-background text-foreground transition-transform active:translate-y-px sm:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </div>

      {/* Full-screen mobile sheet */}
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-background"
        >
          <div className="flex items-center justify-between border-b-2 border-foreground px-5 py-3">
            <span className="flex items-center">
              <VibhaWordmark compact size={28} />
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-md border-2 border-foreground bg-background text-foreground"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-2 px-5 py-8" aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md border-2 border-border px-4 py-3 text-lg font-semibold text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-md border-2 border-border px-4 py-3 text-lg font-semibold text-foreground"
            >
              Login
            </Link>
            <Link
              href="/enquire"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: "lg" }), "mt-2 justify-center text-base font-semibold")}
            >
              Enquire
            </Link>
          </nav>
          <p className="border-t-2 border-border px-5 py-4 text-caption text-muted-foreground">
            Cohort One begins 20 August.
          </p>
        </div>
      ) : null}
    </header>
  );
}
