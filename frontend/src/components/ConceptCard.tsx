import type { CampaignConcept, QualityScores } from "../types/campaign";
import QualityBadge from "./QualityBadge";

interface Props {
  concept: CampaignConcept;
  scores?: QualityScores;
  index: number;
}

export default function ConceptCard({ concept, scores, index }: Props) {
  return (
    <div className="rounded-xl border border-surface-700 bg-surface-900/60 backdrop-blur-sm overflow-hidden transition-all hover:border-cyber-500/30 hover:glow-cyan">
      {/* Header */}
      <div className="px-6 py-4 border-b border-surface-700 bg-surface-800/30">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-cyber-400 uppercase tracking-[0.2em]">
            Concept {String(index + 1).padStart(2, "0")}
          </span>
          {concept.estimated_reach_tier && (
            <span className="rounded-md bg-surface-800 border border-surface-600 px-2.5 py-1 text-[10px] font-mono font-medium text-surface-300 capitalize tracking-wider">
              {concept.estimated_reach_tier} Reach
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold mt-1 text-white">
          {concept.concept_name}
        </h3>
      </div>

      <div className="p-6 space-y-5">
        {/* Headline */}
        <div>
          <p className="text-xl font-bold text-white leading-tight">
            "{concept.headline}"
          </p>
          <p className="text-surface-400 mt-1 text-sm">
            {concept.subheadline}
          </p>
        </div>

        {/* Visual */}
        <div className="rounded-lg bg-neon-500/5 border border-neon-500/15 p-4">
          <p className="text-[10px] font-mono font-semibold text-neon-400 uppercase tracking-[0.15em] mb-2">
            Visual Direction
          </p>
          <p className="text-sm text-surface-300 italic leading-relaxed">
            {concept.visual_description}
          </p>
        </div>

        {/* Key Message */}
        <div>
          <p className="text-[10px] font-mono font-semibold text-surface-400 uppercase tracking-[0.15em] mb-1">
            Key Message
          </p>
          <p className="text-surface-300">{concept.key_message}</p>
        </div>

        {/* Channels */}
        <div>
          <p className="text-[10px] font-mono font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2">
            Channels
          </p>
          <div className="flex flex-wrap gap-1.5">
            {concept.channels.map((ch) => (
              <span
                key={ch}
                className="rounded-md bg-cyber-500/10 border border-cyber-500/20 px-2.5 py-1 text-xs font-medium text-cyber-300"
              >
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Content Formats */}
        <div>
          <p className="text-[10px] font-mono font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2">
            Content Formats
          </p>
          <div className="flex flex-wrap gap-1.5">
            {concept.content_formats.map((fmt) => (
              <span
                key={fmt}
                className="rounded-md bg-surface-800/80 border border-surface-700 px-2.5 py-1 text-xs text-surface-400"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-lg bg-cyber-500/5 border border-cyber-500/20 p-4 text-center">
          <p className="text-[10px] font-mono font-semibold text-surface-400 uppercase tracking-[0.15em] mb-1">
            Call to Action
          </p>
          <p className="text-lg font-semibold text-cyber-300">
            {concept.call_to_action}
          </p>
        </div>

        {/* Quality Scores */}
        {scores && (
          <div className="border-t border-surface-700 pt-4">
            <div className="flex flex-wrap gap-2">
              <QualityBadge label="Relevance" score={scores.relevance} />
              <QualityBadge label="Feasibility" score={scores.feasibility} />
              <QualityBadge label="Creativity" score={scores.creativity} />
              <QualityBadge label="Brand Fit" score={scores.brand_alignment} />
              <QualityBadge label="Overall" score={scores.overall} />
            </div>
            {scores.feedback && (
              <p className="mt-2 text-xs text-surface-400">
                {scores.feedback}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
