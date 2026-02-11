"""Triage Agent — Routes student queries to the appropriate specialist agent."""
from agents import Agent, handoff, RunContextWrapper
from ..config import settings

concepts_agent = None
code_review_agent = None
debug_agent = None
exercise_agent = None
progress_agent = None

def set_specialist_agents(concepts, code_review, debug, exercise, progress):
    global concepts_agent, code_review_agent, debug_agent, exercise_agent, progress_agent
    concepts_agent = concepts
    code_review_agent = code_review
    debug_agent = debug
    exercise_agent = exercise
    progress_agent = progress

triage_agent = Agent(
    name="Triage Agent",
    model=settings.openai_model,
    instructions="""You are the Triage Agent for LearnFlow, an AI Python tutor.
Your job is to understand the student's intent and route them to the right specialist:

- **Concepts Agent**: Questions about Python concepts, syntax, theory, explanations
- **Code Review Agent**: When a student shares code and wants feedback
- **Debug Agent**: When a student has an error or bug they need help fixing
- **Exercise Agent**: When a student wants practice problems or challenges
- **Progress Agent**: When a student asks about their learning progress

Analyze the student's message and hand off to the appropriate specialist.
If the query is a simple greeting or unclear, respond directly with a friendly welcome
and ask what they'd like to learn about Python today.""",
    handoffs=[],  # Set dynamically after all agents are created
)
