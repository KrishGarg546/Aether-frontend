"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { NavLink } from "./nav-link";
import { MobileNavSheet } from "./mobile-nav-sheet";

const NAV_ITEMS = [
  { href: "/mission-control", label: "Mission Control" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/learnings", label: "Learnings" },
  { href: "/archive", label: "Archives" },
] as const;

export function GlobalNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Solidify border on scroll so the nav reads clearly over page content
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50",
          "bg-slate-950/80 backdrop-blur-md",
          "transition-colors duration-200",
          scrolled ? "border-b border-slate-800" : "border-b border-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          {/* Brand mark */}
          <Link
            href="/"
            aria-label="Aether home"
            className="flex items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          >
            {/* Pulsing live indicator — signals "running system" */}
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm font-semibold tracking-[0.25em] text-slate-100 uppercase">
              Aether
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map(({ href, label }) => (
                <li key={href}>
                  <NavLink href={href} label={label} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/mission-control"
              className={[
                "inline-flex items-center gap-2 rounded-full",
                "border border-emerald-500/30 bg-emerald-500/10",
                "px-4 py-1.5 text-xs font-medium tracking-wide text-emerald-300",
                "transition hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:text-emerald-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
              ].join(" ")}
            >
              Launch mission
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className={[
              "md:hidden rounded-md p-1.5",
              "text-slate-400 transition hover:text-slate-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
            ].join(" ")}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* Mobile nav sheet — rendered outside header so it can overlay full screen */}
      <MobileNavSheet
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={[...NAV_ITEMS]}
      />
    </>
  );
}