import type { ProgressEvent } from "../types/campaign";

const STEPS = [
  { id: "trend_agent", label: "Trend Research", icon: "1" },
  { id: "strategy_agent", label: "Strategy", icon: "2" },
  { id: "creative_agent", label: "Creative Concepts", icon: "3" },
  { id: "quality_gate", label: "Quality Check", icon: "4" },
];

interface Props {
  events: ProgressEvent[];
}

export default function PipelineProgress({ events }: Props) {
  const getStepStatus = (stepId: string) => {
    const stepEvents = events.filter((e) => e.step === stepId);
    if (stepEvents.some((e) => e.status === "completed")) return "completed";
    if (stepEvents.some((e) => e.status === "started")) return "active";
    return "pending";
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold mb-6 text-center">
        Agent Pipeline
      </h2>
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step, idx) => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
                    status === "completed"
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : status === "active"
                        ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30 animate-pulse"
                        : "border border-white/20 bg-white/5 text-slate-500"
                  }`}
                >
                  {status === "completed" ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`text-xs font-medium text-center ${
                    status === "completed"
                      ? "text-emerald-400"
                      : status === "active"
                        ? "text-violet-400"
                        : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 -mt-6 transition-all duration-500 ${
                    status === "completed"
                      ? "bg-emerald-500/50"
                      : "bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
