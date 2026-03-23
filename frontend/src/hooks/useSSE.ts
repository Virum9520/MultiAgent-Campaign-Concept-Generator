import { useEffect, useState } from "react";
import type { ProgressEvent } from "../types/campaign";
import { API_BASE_URL } from "../lib/api";

export function useSSE(requestId: string | null) {
  const [events, setEvents] = useState<ProgressEvent[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;

    setEvents([]);
    setIsDone(false);
    setError(null);

    const url = `${API_BASE_URL}/campaigns/generate/${requestId}/stream`;
    const source = new EventSource(url);

    source.onmessage = (e) => {
      try {
        const event: ProgressEvent = JSON.parse(e.data);
        setEvents((prev) => [...prev, event]);
        if (event.step === "done") {
          setIsDone(true);
          if (event.status === "failed") {
            setError(event.detail || "Pipeline failed");
          }
          source.close();
        }
      } catch {
        // Ignore parse errors
      }
    };

    source.onerror = () => {
      setError("Connection lost");
      source.close();
    };

    return () => source.close();
  }, [requestId]);

  return { events, isDone, error };
}
