// src/components/archive/status-badge.tsx

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const isPositive = normalized === "completed" || normalized === "success";

  const statusStyles = isPositive
    ? "border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-300"
    : "border-amber-500/30 bg-amber-500/[0.08] text-amber-300";

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300",
        statusStyles
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}