"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

export function NavLink({ href, label, onClick }: NavLinkProps) {
  const pathname = usePathname();

  // Active if the pathname starts with href (handles nested routes),
  // but guard the root so "/" only matches exactly.
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
      className={[
        "relative text-sm font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 rounded-sm",
        isActive
          ? "text-emerald-400"
          : "text-slate-400 hover:text-slate-100",
      ].join(" ")}
    >
      {label}

      {/* Underline accent — only when active */}
      {isActive && (
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full rounded-full bg-emerald-400/70"
        />
      )}
    </Link>
  );
}