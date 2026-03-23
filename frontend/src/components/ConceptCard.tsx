import type { CampaignConcept, QualityScores } from "../types/campaign";
import QualityBadge from "./QualityBadge";

interface Props {
  concept: CampaignConcept;
  scores?: QualityScores;
  index: number;
}

export default function ConceptCard({ concept, scores, index }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all hover:border-white/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">
            Concept {index + 1}
          </span>
          {concept.estimated_reach_tier && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300 capitalize">
              {concept.estimated_reach_tier} Reach
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold mt-1">{concept.concept_name}</h3>
      </div>

      <div className="p-6 space-y-5">
        {/* Headline */}
        <div>
          <p className="text-2xl font-bold text-white leading-tight">
            "{concept.headline}"
          </p>
          <p className="text-slate-400 mt-1">{concept.subheadline}</p>
        </div>

        {/* Visual */}
        <div className="rounded-lg bg-white/5 border border-white/10 p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Visual Direction
          </p>
          <p className="text-sm text-slate-300 italic leading-relaxed">
            {concept.visual_description}
          </p>
        </div>

        {/* Key Message */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            Key Message
          </p>
          <p className="text-slate-200">{concept.key_message}</p>
        </div>

        {/* Channels */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Channels
          </p>
          <div className="flex flex-wrap gap-1.5">
            {concept.channels.map((ch) => (
              <span
                key={ch}
                className="rounded-md bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 text-xs font-medium text-indigo-300"
              >
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Content Formats */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Content Formats
          </p>
          <div className="flex flex-wrap gap-1.5">
            {concept.content_formats.map((fmt) => (
              <span
                key={fmt}
                className="rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-400"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-lg bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 p-4 text-center">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            Call to Action
          </p>
          <p className="text-lg font-semibold text-violet-300">
            {concept.call_to_action}
          </p>
        </div>

        {/* Quality Scores */}
        {scores && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex flex-wrap gap-2">
              <QualityBadge label="Relevance" score={scores.relevance} />
              <QualityBadge label="Feasibility" score={scores.feasibility} />
              <QualityBadge label="Creativity" score={scores.creativity} />
              <QualityBadge label="Brand Fit" score={scores.brand_alignment} />
              <QualityBadge label="Overall" score={scores.overall} />
            </div>
            {scores.feedback && (
              <p className="mt-2 text-xs text-slate-400">{scores.feedback}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
