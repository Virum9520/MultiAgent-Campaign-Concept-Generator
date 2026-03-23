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
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">Brand & Product</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Brand Name *
            </label>
            <input
              type="text"
              value={form.brand_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, brand_name: e.target.value }))
              }
              placeholder="e.g., Nike, Spotify"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Industry *
            </label>
            <select
              value={form.industry}
              onChange={(e) =>
                setForm((f) => ({ ...f, industry: e.target.value }))
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="" className="bg-slate-900">
                Select industry...
              </option>
              {INDUSTRY_OPTIONS.map((ind) => (
                <option key={ind} value={ind.toLowerCase()} className="bg-slate-900">
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Product Description *
          </label>
          <textarea
            value={form.product_description}
            onChange={(e) =>
              setForm((f) => ({ ...f, product_description: e.target.value }))
            }
            rows={3}
            placeholder="Describe the product or service you want to promote..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Target Audience *
          </label>
          <input
            type="text"
            value={form.target_audience}
            onChange={(e) =>
              setForm((f) => ({ ...f, target_audience: e.target.value }))
            }
            placeholder="e.g., Gen Z fitness enthusiasts, 25-35 working professionals"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">Campaign Goals *</h2>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => toggleGoal(goal.toLowerCase())}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                form.campaign_goals.includes(goal.toLowerCase())
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">Budget Tier</h2>
        <div className="flex gap-3">
          {(["low", "medium", "high"] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setForm((f) => ({ ...f, budget_tier: tier }))}
              className={`flex-1 rounded-lg py-3 text-sm font-medium capitalize transition-all ${
                form.budget_tier === tier
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">Additional Context</h2>
        <textarea
          value={form.additional_context}
          onChange={(e) =>
            setForm((f) => ({ ...f, additional_context: e.target.value }))
          }
          rows={2}
          placeholder="Any additional context, constraints, or preferences (optional)"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Generating..." : "Generate Campaign Concepts"}
      </button>
    </form>
  );
}
