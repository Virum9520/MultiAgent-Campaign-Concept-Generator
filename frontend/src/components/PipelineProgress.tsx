import type { ProgressEvent } from "../types/campaign";

const STEPS = [
  { id: "trend_agent", label: "Trend Agent", icon: "01" },
  { id: "strategy_agent", label: "Strategy Agent", icon: "02" },
  { id: "creative_agent", label: "Creative Agent", icon: "03" },
  { id: "quality_gate", label: "Quality Gate", icon: "04" },
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
    <div className="rounded-xl border border-cyber-500/20 bg-surface-900/60 p-6 backdrop-blur-sm glow-cyan">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-500"></span>
        </span>
        <h2 className="text-xs font-mono font-semibold text-cyber-400 uppercase tracking-[0.2em]">
          Agent Pipeline Active
        </h2>
      </div>
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step, idx) => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`relative flex h-11 w-11 items-center justify-center rounded-lg font-mono text-xs font-bold transition-all duration-500 ${
                    status === "completed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : status === "active"
                        ? "bg-cyber-500/20 text-cyber-300 border border-cyber-500/50 ping-slow"
                        : "border border-surface-700 bg-surface-800/50 text-surface-500"
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
                  className={`text-[10px] font-mono font-medium text-center uppercase tracking-wider ${
                    status === "completed"
                      ? "text-emerald-400"
                      : status === "active"
                        ? "text-cyber-400"
                        : "text-surface-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 -mt-6 transition-all duration-500 ${
                    status === "completed"
                      ? "bg-emerald-500/40"
                      : "bg-surface-700"
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
