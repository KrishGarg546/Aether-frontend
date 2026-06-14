// src/components/learnings/internalized-lessons.tsx
// "What lessons has Aether internalized through experience?"
//
// Groups strategicMemory by strength. Framed as recurring lessons
// derived from mission history rather than literal beliefs held by Aether.

import { cn } from "@/lib/utils";
import type { IntelligenceSummary, StrategicMemoryEntry } from "@/types/intelligence";

interface InternalizedLessonsProps {
  summary: IntelligenceSummary;
}

function formatObjectiveLabel(objective: string): string {
  return objective
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const GROUPS: {
  strength: StrategicMemoryEntry["strength"];
  title: string;
  framing: string;
  accent: string;
}[] = [
  {
    strength: "strong",
    title: "Strong",
    framing: "Repeated often enough to meaningfully influence future planning.",
    accent: "text-emerald-400",
  },
  {
    strength: "moderate",
    title: "Moderate",
    framing: "Observed repeatedly, but not yet dominant across mission history.",
    accent: "text-sky-400",
  },
  {
    strength: "emerging",
    title: "Emerging",
    framing: "Recent observations that require additional evidence before solidifying.",
    accent: "text-slate-400",
  },
];

function PatternRow({ entry }: { entry: StrategicMemoryEntry }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-950/80 hover:shadow-[0_0_30px_rgba(15,23,42,0.35)]">
      <p className="text-[15px] leading-8 text-slate-100">"{entry.insight}"</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="tabular-nums">
          Observed in {entry.evidenceCount} mission{entry.evidenceCount === 1 ? "" : "s"}
        </span>
        {entry.primaryObjective && (
          <>
            <span className="text-slate-500">·</span>
            <span>{formatObjectiveLabel(entry.primaryObjective)} objective</span>
          </>
        )}
      </div>
    </div>
  );
}

export function InternalizedLessons({ summary }: InternalizedLessonsProps) {
  const { strategicMemory } = summary;

  if (strategicMemory.length === 0) {
    return (
      <section className="flex flex-col gap-10">
        <div className="flex items-start justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-400">
              ACCUMULATED WISDOM
            </p>

            <h2 className="mt-3 font-serif text-5xl tracking-tight text-white">
              Internalized Lessons
            </h2>

            <p className="mt-4 text-lg leading-9 text-slate-400">
              Lessons distilled from recurring recommendations and repeated mission outcomes that now influence how Aether interprets future decisions.
            </p>
          </div>

          <p className="max-w-[240px] pt-6 text-right text-sm leading-relaxed text-slate-500">
            Lessons distilled from repeated mission outcomes.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 px-6 py-10 text-center text-sm text-slate-500">
          Aether has not yet accumulated enough repeated observations to surface lessons from experience.
        </div>
      </section>
    );
  }

  const groups = GROUPS.map((group) => ({
    ...group,
    entries: strategicMemory.filter((entry) => entry.strength === group.strength),
  })).filter((group) => group.entries.length > 0);

  return (
    <section className="flex flex-col gap-12">
      <div className="flex items-start justify-between gap-8">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-400">
            ACCUMULATED WISDOM
          </p>

          <h2 className="mt-3 font-serif text-4xl tracking-tight text-white">
            Internalized Lessons
          </h2>

          <p className="mt-4 text-lg leading-9 text-slate-400">
            Lessons distilled from recurring recommendations and repeated mission outcomes that now influence how Aether interprets future decisions.
          </p>
        </div>

        <p className="max-w-[240px] pt-6 text-right text-sm leading-relaxed text-slate-500">
          Lessons distilled from recurring recommendations across missions.
        </p>
      </div>

      <div className="flex flex-col gap-10 rounded-3xl border border-slate-800 bg-slate-900/40 px-8 py-8 backdrop-blur-sm">
        {groups.map((group) => (
          <div key={group.strength} className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn("rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em]", group.accent)}>
                {group.title}
              </span>
              <span className="text-sm leading-relaxed text-slate-500">{group.framing}</span>
            </div>
            <div className="flex flex-col gap-2">
              {group.entries.map((entry, i) => (
                <PatternRow key={i} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Lessons reflect repeated observations derived from campaign history.
        They guide interpretation and planning but do not represent fixed rules.
      </p>
    </section>
  );
}