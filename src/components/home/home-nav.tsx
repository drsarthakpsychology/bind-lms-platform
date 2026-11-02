"use client";

import * as React from "react";
import Link from "next/link";
import { LINKS, NAV } from "./content";
import s from "./home.module.css";

/**
 * Homepage navigation. Sticky bar on every size; on phones and small tablets the
 * section links move into a full-screen panel (focus moves in, Escape closes,
 * page scroll is locked while open, any link closes it).
 */
export function HomeNav() {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close the menu first (unlocks page scroll), then jump to the section.
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Links to other pages (like /free) navigate normally.
    if (!href.startsWith("#")) {
      setOpen(false);
      return;
    }
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => {
      document.getElementById(href.slice(1))?.scrollIntoView({ block: "start" });
      history.replaceState(null, "", href);
    });
  };

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a,button"));
        if (items.length === 0) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={s.navBar}>
      <div className={`${s.wrap} ${s.navInner}`}>
        <a href="#top" className={s.brand} aria-label="VIBHA School of Psychology, back to top">
          <span className={s.brandMark}>VIBHA</span>
          <span className={s.brandSub}>School of Psychology</span>
        </a>

        <nav aria-label="Main" className={s.navLinks}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={s.navLink}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className={s.navActions}>
          <Link href={LINKS.login} className={`${s.btn} ${s.btnGhost} ${s.btnSm} ${s.hideSm}`}>
            Login
          </Link>
          <Link href={LINKS.apply} className={`${s.btn} ${s.btnLime} ${s.btnSm}`} aria-label="Request an invitation">
            <span className={s.ctaLong}>Request an invitation</span>
            <span className={s.ctaShort} aria-hidden>
              Apply
            </span>
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="home-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={s.srOnly}>{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className={s.menuIcon} data-open={open} />
          </button>
        </div>
      </div>

      <div
        id="home-menu"
        ref={panelRef}
        className={s.menuPanel}
        data-open={open}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <nav aria-label="Sections" className={s.menuList}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={s.menuLink} onClick={(e) => go(e, n.href)}>
              {n.label}
            </a>
          ))}
          <Link href="/free" className={s.menuLink} onClick={() => setOpen(false)}>
            Free self-checks &amp; calm
          </Link>
        </nav>
        <div className={s.menuActions}>
          <Link href={LINKS.apply} className={`${s.btn} ${s.btnLime}`} onClick={() => setOpen(false)}>
            Request an invitation
          </Link>
          <Link href={LINKS.login} className={`${s.btn} ${s.btnGhost}`} onClick={() => setOpen(false)}>
            Student login
          </Link>
        </div>
      </div>
    </header>
  );
}
