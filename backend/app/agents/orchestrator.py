"""Agent Orchestrator — Initializes all agents and manages the agent pipeline."""
from agents import Agent, handoff, Runner
from .triage import triage_agent, set_specialist_agents
from .concepts import concepts_agent
from .code_review import code_review_agent
from .debug import debug_agent
from .exercise import exercise_agent
from .progress import progress_agent


def init_agents():
    """Initialize all agents and wire up handoffs."""
    set_specialist_agents(
        concepts=concepts_agent,
        code_review=code_review_agent,
        debug=debug_agent,
        exercise=exercise_agent,
        progress=progress_agent,
    )

    triage_agent.handoffs = [
        handoff(concepts_agent, tool_name_override="route_to_concepts",
                tool_description_override="Route to Concepts Agent for Python theory and explanations"),
        handoff(code_review_agent, tool_name_override="route_to_code_review",
                tool_description_override="Route to Code Review Agent for code feedback"),
        handoff(debug_agent, tool_name_override="route_to_debug",
                tool_description_override="Route to Debug Agent for error diagnosis"),
        handoff(exercise_agent, tool_name_override="route_to_exercise",
                tool_description_override="Route to Exercise Agent for practice problems"),
        handoff(progress_agent, tool_name_override="route_to_progress",
                tool_description_override="Route to Progress Agent for learning progress"),
    ]

    return {
        "triage": triage_agent,
        "concepts": concepts_agent,
        "code_review": code_review_agent,
        "debug": debug_agent,
        "exercise": exercise_agent,
        "progress": progress_agent,
    }


async def run_agent_pipeline(message: str, session_id: str, context: dict | None = None) -> dict:
    """Run a message through the agent pipeline starting with triage."""
    result = await Runner.run(
        triage_agent,
        input=message,
    )

    # Determine which agent handled the response
    agent_name = result.last_agent.name if result.last_agent else "Triage Agent"
    agent_map = {
        "Triage Agent": "triage",
        "Concepts Agent": "concepts",
        "Code Review Agent": "code_review",
        "Debug Agent": "debug",
        "Exercise Agent": "exercise",
        "Progress Agent": "progress",
    }

    return {
        "message": result.final_output,
        "agent": agent_map.get(agent_name, "triage"),
        "session_id": session_id,
    }
