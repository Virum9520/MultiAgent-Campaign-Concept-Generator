import asyncio
import json
from collections import defaultdict


class ProgressManager:
    def __init__(self) -> None:
        self._queues: dict[str, asyncio.Queue] = defaultdict(asyncio.Queue)

    async def publish(self, request_id: str, event: dict) -> None:
        await self._queues[request_id].put(event)

    async def subscribe(self, request_id: str):
        queue = self._queues[request_id]
        try:
            while True:
                event = await queue.get()
                yield f"data: {json.dumps(event)}\n\n"
                if event.get("step") == "done":
                    break
        finally:
            self._queues.pop(request_id, None)


# Singleton instance
progress_manager = ProgressManager()
