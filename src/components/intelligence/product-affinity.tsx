import { GitBranch } from "lucide-react";
import type { IntelligenceSummary } from "@/types/intelligence";

interface ProductAffinityProps {
  summary: IntelligenceSummary;
}

export function ProductAffinity({ summary }: ProductAffinityProps) {
  const affinity = summary.productAffinity ?? [];
  const featuredAffinity = affinity.slice(0, 3);
  const relationshipsAnalysed = affinity.reduce(
    (total, item) => total + item.related_products.recommendations.length,
    0
  );

  const ACCENTS = [
    {
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
      icon: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      border: "border-cyan-500/20",
      bg: "bg-cyan-500/5",
      icon: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      border: "border-violet-500/20",
      bg: "bg-violet-500/5",
      icon: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
  ];

  if (affinity.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-slate-300">
            Product Affinity Intelligence
          </h2>
          <span className="text-xs text-slate-600">
            No affinity signals available.
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-8 text-center text-sm text-slate-500">
          Product relationships will appear once Aether processes co-purchase intelligence.
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-100">
              Product Affinity Intelligence
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Cross-sell relationships discovered from historical purchasing behaviour.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-3 text-right lg:block">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              High-confidence signals
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-400">
              {affinity.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {relationshipsAnalysed} relationships analysed
            </p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-slate-800 via-slate-700 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {featuredAffinity.map((entry, index) => {
          const accent = ACCENTS[index % ACCENTS.length];
          return (
          <div
            key={`${entry.product}-${index}`}
            className={`flex flex-col gap-3 rounded-2xl border bg-slate-900/50 px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 ${accent.border} ${accent.bg}`}
          >
            <div className="flex items-center gap-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${accent.icon}`}>
                <GitBranch className="size-4" />
              </span>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  {entry.related_products.product_name}
                </p>
                <p className="text-xs text-slate-500">
                  Top affinity relationships
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {entry.related_products.recommendations.slice(0, 3).map((product) => (
                <div
                  key={product.product_id}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 ${product.product_id === entry.related_products.recommendations[0]?.product_id ? `${accent.border} ${accent.bg}` : "border-slate-800 bg-slate-950/40"}`}
                >
                  <div>
                    <p className="text-sm text-slate-300">
                      {product.product_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {product.product_id}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    {product.co_purchase_count} co-purchases
                  </span>
                </div>
              ))}
            </div>
          </div>
        )})}
      </div>

      <p className="text-sm leading-relaxed text-slate-500">
        Product affinity relationships are synthesized from historical co-purchase patterns and distilled into a small set of high-confidence signals that inform Aether's cross-sell reasoning.
      </p>
    </section>
  );
}