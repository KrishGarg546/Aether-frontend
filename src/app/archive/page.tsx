// src/app/archive/page.tsx

import { ArchiveList } from "@/components/archive/archive-list";

export default function ArchivePage() {
  return (
    <main className="flex min-h-screen w-full justify-center bg-slate-950 px-6 py-16">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.4em] text-emerald-400/80">
            Aether
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
            Mission Archive
          </h1>
          <p className="text-sm text-slate-400">
            Every campaign Aether has executed, in order of launch.
          </p>
        </div>

        <ArchiveList />
      </div>
    </main>
  );
}