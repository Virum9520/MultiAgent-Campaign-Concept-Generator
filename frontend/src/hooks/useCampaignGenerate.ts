import { useCallback, useEffect, useState } from "react";
import type { CampaignRequest, CampaignResponse } from "../types/campaign";
import { fetchJSON } from "../lib/api";
import { useSSE } from "./useSSE";

export function useCampaignGenerate() {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [result, setResult] = useState<CampaignResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { events, isDone, error: sseError } = useSSE(requestId);

  // Fetch final result when SSE completes
  useEffect(() => {
    if (!isDone || !requestId) return;
    if (sseError) {
      setError(sseError);
      setIsLoading(false);
      return;
    }

    fetchJSON<CampaignResponse>(`/campaigns/${requestId}`)
      .then((data) => {
        setResult(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [isDone, requestId, sseError]);

  const generate = useCallback(async (req: CampaignRequest) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setRequestId(null);

    try {
      const { request_id } = await fetchJSON<{ request_id: string }>(
        "/campaigns/generate",
        {
          method: "POST",
          body: JSON.stringify(req),
        }
      );
      setRequestId(request_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start");
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRequestId(null);
    setResult(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return { generate, reset, result, events, isLoading, error };
}
