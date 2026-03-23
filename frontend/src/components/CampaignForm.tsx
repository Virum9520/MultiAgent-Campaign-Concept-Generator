import { useState } from "react";
import type { CampaignRequest } from "../types/campaign";

const GOAL_OPTIONS = [
  "Brand Awareness",
  "Lead Generation",
  "Conversion",
  "Engagement",
  "Product Launch",
  "Customer Loyalty",
];

const INDUSTRY_OPTIONS = [
  "Technology",
  "Fashion & Apparel",
  "Food & Beverage",
  "Health & Wellness",
  "Finance",
  "Entertainment",
  "Travel & Hospitality",
  "Education",
  "Automotive",
  "Retail",
  "Other",
];

interface Props {
  onSubmit: (req: CampaignRequest) => void;
  isLoading: boolean;
}

export default function CampaignForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState({
    brand_name: "",
    product_description: "",
    target_audience: "",
    industry: "",
    campaign_goals: [] as string[],
    budget_tier: "medium" as "low" | "medium" | "high",
    additional_context: "",
  });

  const toggleGoal = (goal: string) => {
    setForm((prev) => ({
      ...prev,
      campaign_goals: prev.campaign_goals.includes(goal)
        ? prev.campaign_goals.filter((g) => g !== goal)
        : [...prev.campaign_goals, goal],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      additional_context: form.additional_context || undefined,
    });
  };

  const isValid =
    form.brand_name &&
    form.product_description &&
    form.target_audience &&
    form.industry &&
    form.campaign_goals.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brand & Product */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-1 w-1 rounded-full bg-cyber-400"></div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Brand & Product
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-surface-700 to-transparent"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-mono font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
              Brand Name *
            </label>
            <input
              type="text"
              value={form.brand_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, brand_name: e.target.value }))
              }
              placeholder="e.g., Nike, Spotify"
              className="w-full rounded-lg border border-surface-700 bg-surface-800/80 px-4 py-2.5 text-white placeholder-surface-500 focus:border-cyber-500/50 focus:outline-none focus:ring-1 focus:ring-cyber-500/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
              Industry *
            </label>
            <select
              value={form.industry}
              onChange={(e) =>
                setForm((f) => ({ ...f, industry: e.target.value }))
              }
              className="w-full rounded-lg border border-surface-700 bg-surface-800/80 px-4 py-2.5 text-white focus:border-cyber-500/50 focus:outline-none focus:ring-1 focus:ring-cyber-500/30 transition-colors"
            >
              <option value="" className="bg-surface-900">
                Select industry...
              </option>
              {INDUSTRY_OPTIONS.map((ind) => (
                <option key={ind} value={ind.toLowerCase()} className="bg-surface-900">
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-mono font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
            Product Description *
          </label>
          <textarea
            value={form.product_description}
            onChange={(e) =>
              setForm((f) => ({ ...f, product_description: e.target.value }))
            }
            rows={3}
            placeholder="Describe the product or service you want to promote..."
            className="w-full rounded-lg border border-surface-700 bg-surface-800/80 px-4 py-2.5 text-white placeholder-surface-500 focus:border-cyber-500/50 focus:outline-none focus:ring-1 focus:ring-cyber-500/30 transition-colors resize-none"
          />
        </div>
        <div className="mt-4">
          <label className="block text-xs font-mono font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
            Target Audience *
          </label>
          <input
            type="text"
            value={form.target_audience}
            onChange={(e) =>
              setForm((f) => ({ ...f, target_audience: e.target.value }))
            }
            placeholder="e.g., Gen Z fitness enthusiasts, 25-35 working professionals"
            className="w-full rounded-lg border border-surface-700 bg-surface-800/80 px-4 py-2.5 text-white placeholder-surface-500 focus:border-cyber-500/50 focus:outline-none focus:ring-1 focus:ring-cyber-500/30 transition-colors"
          />
        </div>
      </div>

      {/* Campaign Goals */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-1 w-1 rounded-full bg-neon-500"></div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Campaign Goals *
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-surface-700 to-transparent"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => toggleGoal(goal.toLowerCase())}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                form.campaign_goals.includes(goal.toLowerCase())
                  ? "bg-cyber-500/20 text-cyber-300 border border-cyber-500/40 glow-cyan"
                  : "border border-surface-700 bg-surface-800/50 text-surface-400 hover:border-surface-500 hover:text-surface-300"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Tier */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-1 w-1 rounded-full bg-cyber-400"></div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Budget Tier
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-surface-700 to-transparent"></div>
        </div>
        <div className="flex gap-3">
          {(["low", "medium", "high"] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setForm((f) => ({ ...f, budget_tier: tier }))}
              className={`flex-1 rounded-lg py-3 text-sm font-medium capitalize transition-all ${
                form.budget_tier === tier
                  ? "bg-neon-500/20 text-neon-400 border border-neon-500/40 glow-neon"
                  : "border border-surface-700 bg-surface-800/50 text-surface-400 hover:border-surface-500 hover:text-surface-300"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Context */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-1 w-1 rounded-full bg-surface-500"></div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Additional Context
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-surface-700 to-transparent"></div>
        </div>
        <textarea
          value={form.additional_context}
          onChange={(e) =>
            setForm((f) => ({ ...f, additional_context: e.target.value }))
          }
          rows={2}
          placeholder="Any additional context, constraints, or preferences (optional)"
          className="w-full rounded-lg border border-surface-700 bg-surface-800/80 px-4 py-2.5 text-white placeholder-surface-500 focus:border-cyber-500/50 focus:outline-none focus:ring-1 focus:ring-cyber-500/30 transition-colors resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="group relative w-full rounded-xl border border-cyber-500/30 bg-cyber-500/10 py-4 text-base font-semibold text-cyber-300 transition-all hover:bg-cyber-500/20 hover:border-cyber-500/50 hover:text-cyber-200 glow-cyan disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-cyber-500/10 disabled:hover:border-cyber-500/30"
      >
        <span className="relative z-10 font-mono uppercase tracking-wider text-sm">
          {isLoading ? (
            <span className="cursor-blink">Generating</span>
          ) : (
            "Launch Agent Pipeline"
          )}
        </span>
      </button>
    </form>
  );
}
