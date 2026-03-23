import type { CampaignResponse } from "../types/campaign";
import ConceptCard from "./ConceptCard";

interface Props {
  result: CampaignResponse;
  onReset: () => void;
}

export default function ConceptList({ result, onReset }: Props) {
  return (
    <div className="space-y-6">
      {/* Strategy Summary */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-neon-500"></div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Strategic Positioning
            </h2>
          </div>
          <button
            onClick={onReset}
            className="rounded-lg border border-surface-600 bg-surface-800/60 px-4 py-2 text-xs font-mono font-medium text-surface-300 hover:border-cyber-500/30 hover:text-cyber-300 transition-all uppercase tracking-wider"
          >
            New Campaign
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-[10px] font-mono font-semibold text-surface-400 uppercase tracking-[0.15em] mb-1">
              Core Insight
            </p>
            <p className="text-surface-300 text-sm">
              {result.strategy.core_insight}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono font-semibold text-surface-400 uppercase tracking-[0.15em] mb-1">
              Positioning
            </p>
            <p className="text-surface-300 text-sm">
              {result.strategy.positioning_statement}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono font-semibold text-surface-400 uppercase tracking-[0.15em] mb-1">
              Emotional Territory
            </p>
            <p className="text-surface-300 text-sm">
              {result.strategy.emotional_territory}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono font-semibold text-surface-400 uppercase tracking-[0.15em] mb-1">
              Tone
            </p>
            <p className="text-surface-300 text-sm">
              {result.strategy.recommended_tone}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-[10px] font-mono font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2">
            Key Themes
          </p>
          <div className="flex flex-wrap gap-2">
            {result.strategy.key_themes.map((theme) => (
              <span
                key={theme}
                className="rounded-md bg-neon-500/10 border border-neon-500/20 px-3 py-1 text-xs font-medium text-neon-400"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trends Used */}
      {result.trends_used.length > 0 && (
        <div className="rounded-xl border border-surface-700 bg-surface-900/60 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-1 w-1 rounded-full bg-cyber-400"></div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Trends Leveraged
            </h2>
            <span className="font-mono text-xs text-surface-500">
              ({result.trends_used.length})
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {result.trends_used.map((trend, i) => (
              <div
                key={i}
                className="rounded-lg bg-surface-800/50 border border-surface-700 p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider ${
                      trend.category === "social_media"
                        ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                        : trend.category === "industry"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {trend.category.replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-mono text-surface-500">
                    {(trend.relevance_score * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="font-medium text-sm text-white">
                  {trend.title}
                </p>
                <p className="text-xs text-surface-400 mt-0.5">
                  {trend.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaign Concepts */}
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-cyber-500"></div>
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
          Campaign Concepts
        </h2>
        <span className="font-mono text-xs text-surface-500">
          ({result.concepts.length})
        </span>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {result.concepts.map((concept, i) => (
          <ConceptCard
            key={i}
            concept={concept}
            scores={result.quality_scores[i]}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
