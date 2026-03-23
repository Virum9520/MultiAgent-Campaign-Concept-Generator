from langgraph.graph import END, StateGraph

from app.models.state import CampaignState
from app.graph.nodes.creative_agent import creative_node
from app.graph.nodes.quality_gate import quality_gate_node
from app.graph.nodes.strategy_agent import strategy_node
from app.graph.nodes.trend_agent import trend_node


def quality_router(state: CampaignState) -> str:
    """Route from quality gate: pass to END or retry creative agent."""
    if state.get("passed_quality"):
        return "pass"
    if state.get("retry_count", 0) >= 2:
        return "pass"  # Accept after 2 retries to avoid infinite loop
    return "retry"


def build_campaign_graph() -> StateGraph:
    """Build and compile the campaign generation graph.

    Graph flow:
        trend_agent -> strategy_agent -> creative_agent -> quality_gate
                                              ^                |
                                              |___ retry ______|
    """
    graph = StateGraph(CampaignState)

    # Add nodes
    graph.add_node("trend_agent", trend_node)
    graph.add_node("strategy_agent", strategy_node)
    graph.add_node("creative_agent", creative_node)
    graph.add_node("quality_gate", quality_gate_node)

    # Set entry point
    graph.set_entry_point("trend_agent")

    # Linear edges
    graph.add_edge("trend_agent", "strategy_agent")
    graph.add_edge("strategy_agent", "creative_agent")
    graph.add_edge("creative_agent", "quality_gate")

    # Conditional edge from quality gate
    graph.add_conditional_edges(
        "quality_gate",
        quality_router,
        {
            "pass": END,
            "retry": "creative_agent",
        },
    )

    return graph.compile()
