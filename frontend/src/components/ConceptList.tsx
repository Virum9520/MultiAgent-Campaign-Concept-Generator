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
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Strategic Positioning</h2>
          <button
            onClick={onReset}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition-all"
          >
            New Campaign
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Core Insight
            </p>
            <p className="text-slate-200">{result.strategy.core_insight}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Positioning
            </p>
            <p className="text-slate-200">
              {result.strategy.positioning_statement}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Emotional Territory
            </p>
            <p className="text-slate-200">
              {result.strategy.emotional_territory}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Tone
            </p>
            <p className="text-slate-200">
              {result.strategy.recommended_tone}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Key Themes
          </p>
          <div className="flex flex-wrap gap-2">
            {result.strategy.key_themes.map((theme) => (
              <span
                key={theme}
                className="rounded-full bg-violet-500/20 border border-violet-500/30 px-3 py-1 text-sm text-violet-300"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trends Used */}
      {result.trends_used.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">
            Trends Leveraged ({result.trends_used.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {result.trends_used.map((trend, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/5 border border-white/10 p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      trend.category === "social_media"
                        ? "bg-pink-500/20 text-pink-400"
                        : trend.category === "industry"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {trend.category.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-500">
                    {(trend.relevance_score * 100).toFixed(0)}% relevant
                  </span>
                </div>
                <p className="font-medium text-sm text-white">{trend.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {trend.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaign Concepts */}
      <h2 className="text-xl font-semibold">
        Campaign Concepts ({result.concepts.length})
      </h2>
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
