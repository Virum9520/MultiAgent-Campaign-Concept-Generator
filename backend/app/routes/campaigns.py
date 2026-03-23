import json
import logging
import uuid

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse

from app.graph.builder import build_campaign_graph
from app.models.request import CampaignRequest
from app.models.response import CampaignResponse
from app.services.progress_manager import progress_manager

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

# In-memory results store (use Redis in production)
_results: dict[str, CampaignResponse] = {}


@router.post("/generate")
async def generate_campaign(req: CampaignRequest, bg: BackgroundTasks):
    """Start campaign generation pipeline. Returns a request_id for tracking."""
    request_id = str(uuid.uuid4())
    bg.add_task(_run_pipeline, request_id, req)
    return {"request_id": request_id}


@router.get("/generate/{request_id}/stream")
async def stream_progress(request_id: str):
    """SSE endpoint for real-time pipeline progress."""
    return StreamingResponse(
        progress_manager.subscribe(request_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/{request_id}", response_model=CampaignResponse)
async def get_result(request_id: str):
    """Get the final campaign generation result."""
    if request_id not in _results:
        raise HTTPException(
            status_code=404, detail="Not found or still processing"
        )
    return _results[request_id]


async def _run_pipeline(request_id: str, req: CampaignRequest) -> None:
    """Execute the LangGraph pipeline as a background task."""
    try:
        graph = build_campaign_graph()

        initial_state = {
            "brand_name": req.brand_name,
            "product_description": req.product_description,
            "target_audience": req.target_audience,
            "industry": req.industry,
            "campaign_goals": req.campaign_goals,
            "budget_tier": req.budget_tier,
            "additional_context": req.additional_context or "",
            "trends": [],
            "strategy": None,
            "concepts": [],
            "quality_scores": [],
            "passed_quality": False,
            "current_step": "",
            "retry_count": 0,
            "error": None,
            "messages": [],
        }

        await progress_manager.publish(
            request_id, {"step": "trend_agent", "status": "started"}
        )

        # Run the graph with streaming to capture step transitions
        # Use "values" stream mode to get the accumulated state after each node
        accumulated_state = initial_state
        async for event in graph.astream(initial_state, stream_mode="updates"):
            for node_name, node_output in event.items():
                # Merge node output into accumulated state
                accumulated_state = {**accumulated_state, **node_output}
                await progress_manager.publish(
                    request_id,
                    {"step": node_name, "status": "completed"},
                )
                # Publish "started" for the next expected step
                next_step = _get_next_step(node_name, node_output)
                if next_step:
                    await progress_manager.publish(
                        request_id,
                        {"step": next_step, "status": "started"},
                    )

        response = CampaignResponse(
            request_id=request_id,
            brand_name=req.brand_name,
            concepts=accumulated_state.get("concepts", []),
            quality_scores=accumulated_state.get("quality_scores", []),
            strategy=accumulated_state.get("strategy"),
            trends_used=accumulated_state.get("trends", []),
        )
        _results[request_id] = response

        await progress_manager.publish(
            request_id, {"step": "done", "status": "completed"}
        )

    except Exception as e:
        logger.exception(f"Pipeline failed for {request_id}")
        await progress_manager.publish(
            request_id,
            {"step": "done", "status": "failed", "detail": str(e)},
        )


def _get_next_step(current: str, output: dict) -> str | None:
    """Determine the next step for progress reporting."""
    step_order = ["trend_agent", "strategy_agent", "creative_agent", "quality_gate"]
    if current in step_order:
        idx = step_order.index(current)
        if idx + 1 < len(step_order):
            return step_order[idx + 1]
    # Handle quality gate retry
    if current == "quality_gate" and not output.get("passed_quality", True):
        return "creative_agent"
    return None
