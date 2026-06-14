// src/components/intelligence/intelligence-header.tsx
// Redesign — "agent status line" rather than a hero stat block.

interface IntelligenceHeaderProps {
    totalCampaigns: number;
  }
  
  export function IntelligenceHeader({ totalCampaigns }: IntelligenceHeaderProps) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-emerald-400/80">
            Aether — Agent Intelligence
          </span>
        </div>
  
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          The mind of Aether
        </h1>
  
        <p className="max-w-xl text-sm leading-relaxed text-slate-400">
          {totalCampaigns > 0 ? (
            <>
              Across{" "}
              <span className="font-medium text-slate-200">
                {totalCampaigns} {totalCampaigns === 1 ? "mission" : "missions"}
              </span>
              , Aether has formed memories, recognized patterns, and adjusted how it
              plans the next one. Everything below is reconstructed from that history —
              nothing is simulated.
            </>
          ) : (
            "Run a mission to begin Aether's learning cycle. This page will reconstruct itself from real execution history."
          )}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: "Aether at a Glance", href: "#executive-intelligence" },
            { label: "Customer Stories", href: "#customer-memory" },
            { label: "Customer Health", href: "#customer-health" },
            { label: "Campaign Selection", href: "#decision-intelligence" },
            { label: "Product Affinity", href: "#product-affinity" },
            { label: "Learning Loop", href: "#adaptive-intelligence" },
            { label: "Strategic Memory", href: "#strategic-memory" },
          ].map((section) => (
            <a
              key={section.label}
              href={section.href}
              className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-400 transition-all duration-200 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-300"
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>
    );
  }