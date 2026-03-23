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
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {result ? (
        <ConceptList result={result} onReset={reset} />
      ) : (
        <div className="space-y-6">
          {isLoading && <PipelineProgress events={events} />}
          <CampaignForm onSubmit={generate} isLoading={isLoading} />
        </div>
      )}
    </Layout>
  );
}

export default App;
