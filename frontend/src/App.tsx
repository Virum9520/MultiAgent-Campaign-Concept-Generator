import Layout from "./components/Layout";
import CampaignForm from "./components/CampaignForm";
import PipelineProgress from "./components/PipelineProgress";
import ConceptList from "./components/ConceptList";
import { useCampaignGenerate } from "./hooks/useCampaignGenerate";

function App() {
  const { generate, reset, result, events, isLoading, error } =
    useCampaignGenerate();

  return (
    <Layout>
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <p className="font-mono text-sm font-medium text-red-400">
            ERROR
          </p>
          <p className="text-sm mt-1 text-red-300/80">{error}</p>
        </div>
      )}

      {result ? (
        <ConceptList result={result} onReset={reset} />
      ) : (
        <div className="space-y-10">
          {/* Hero section */}
          <div className="relative text-center max-w-2xl mx-auto scanlines rounded-xl border border-cyber-500/10 bg-surface-900/50 px-8 py-10 overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyber-500/40 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyber-500/40 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyber-500/40 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyber-500/40 rounded-br-xl"></div>

            <p className="text-[10px] font-mono text-cyber-500/50 uppercase tracking-[0.3em] mb-3">
              Multi-Agent Pipeline v1.0
            </p>
            <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
              From brand brief to campaign concepts
              <span className="text-cyber-400"> — in minutes</span>
            </h2>
            <p className="mt-4 text-sm text-surface-300 leading-relaxed max-w-lg mx-auto">
              This tool takes a brand + product input, searches current trends
              via MCP, and uses a multi-agent system to generate 3–5 campaign
              concepts in minutes.
            </p>
            <div className="mt-5 flex items-center justify-center gap-6 text-[11px] font-mono text-surface-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-cyber-500"></span>
                Trend Research
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-neon-500"></span>
                Strategy Engine
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-cyber-400"></span>
                Creative Gen
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                Quality Gate
              </span>
            </div>
          </div>

          {isLoading && <PipelineProgress events={events} />}
          <CampaignForm onSubmit={generate} isLoading={isLoading} />
        </div>
      )}
    </Layout>
  );
}

export default App;
