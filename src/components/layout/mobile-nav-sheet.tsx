"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { NavLink } from "./nav-link";

interface MobileNavSheetProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { href: string; label: string }[];
}

export function MobileNavSheet({
  isOpen,
  onClose,
  navItems,
}: MobileNavSheetProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Sheet panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          "fixed inset-x-0 top-0 z-50",
          "bg-slate-950/95 backdrop-blur-md",
          "border-b border-slate-800",
          "px-6 pb-8 pt-5",
          "animate-in slide-in-from-top-2 duration-200 ease-out",
        ].join(" ")}
      >
        {/* Sheet header — mirrors GlobalNav bar */}
        <div className="flex items-center justify-between">
          <BrandMark />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-slate-400 transition hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav items — full-width tappable rows */}
        <nav aria-label="Mobile navigation">
          <ul className="mt-6 flex flex-col gap-1">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <div className="rounded-lg px-3 py-3 transition hover:bg-slate-800/60">
                  <NavLink href={href} label={label} onClick={onClose} />
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom launch CTA */}
        <div className="mt-8 border-t border-slate-800 pt-6">
          <Link
            href="/mission-control"
            onClick={onClose}
            className={[
              "flex w-full items-center justify-center gap-2",
              "rounded-full bg-emerald-500/10 border border-emerald-500/30",
              "px-5 py-3 text-sm font-medium text-emerald-300",
              "transition hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:text-emerald-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
            ].join(" ")}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Launch a mission
          </Link>
        </div>
      </div>
    </>
  );
}

/** Shared brand mark — imported inline to avoid circular dep */
function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="text-sm font-semibold tracking-[0.25em] text-slate-100 uppercase">
        Aether
      </span>
    </div>
  );
}