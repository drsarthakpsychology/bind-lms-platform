import Link from "next/link";
import { archivo, pixel, pixelDigits } from "@/components/home/fonts";
import s from "./free.module.css";

export const CRISIS = {
  name: "Tele-MANAS",
  number: "14416",
  href: "tel:14416",
  alt: "1-800-891-4416",
  altHref: "tel:18008914416",
  emergency: "112",
} as const;

/** The crisis line, shown on every free page. `urgent` = red, for risk answers. */
export function CrisisLine({ urgent = false }: { urgent?: boolean }) {
  return (
    <aside className={`${s.crisis} ${urgent ? s.crisisUrgent : ""}`} aria-label="Help right now">
      <span className={s.crisisIcon} aria-hidden>
        !
      </span>
      <div>
        <strong>{urgent ? "Please talk to someone today." : "Need to talk to someone right now?"}</strong>
        <p>
          Call <a href={CRISIS.href}>{CRISIS.name} {CRISIS.number}</a> (or {" "}
          <a href={CRISIS.altHref}>{CRISIS.alt}</a>): free, confidential, 24 hours a day, in many Indian languages. If
          you or someone else is in immediate danger, call <a href="tel:112">{CRISIS.emergency}</a>.
        </p>
      </div>
    </aside>
  );
}

const LINKS = [
  { href: "/free", label: "All free tools" },
  { href: "/free#tests", label: "Self-checks" },
  { href: "/free#calm", label: "Calm" },
  { href: "/free/help", label: "Find help" },
] as const;

/** Header + footer for /free, in the homepage's four colours and fonts. */
export function FreeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${s.root} ${archivo.variable} ${pixel.variable} ${pixelDigits.variable}`}>
      <a href="#main" className={s.skip}>
        Skip to content
      </a>
      <header className={s.nav}>
        <div className={`${s.wrap} ${s.navIn}`}>
          <Link href="/" className={s.brand} aria-label="VIBHA School of Psychology, home">
            <b>VIBHA</b>
            <small>School of Psychology</small>
          </Link>
          <nav aria-label="Free tools" className={s.navLinks}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/free" className={`${s.btn} ${s.btnLime} ${s.btnSm} ${s.mobileOnly}`}>
            Free tools
          </Link>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className={s.foot}>
        <div className={`${s.wrap} ${s.footIn}`}>
          <p>
            Free tools from VIBHA School of Psychology. Self-checks are for information only: they can&apos;t diagnose
            anything. Your answers stay on your device and are never sent to us.
          </p>
          <nav aria-label="Footer">
            <Link href="/">VIBHA home</Link>
            <Link href="/free">Free tools</Link>
            <Link href="/policies/privacy">Privacy</Link>
            <Link href="/policies/disclaimer">Disclaimer</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
