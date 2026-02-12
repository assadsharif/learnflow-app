"""API routes for LearnFlow."""
from fastapi import APIRouter, HTTPException, Depends
from ..models.schemas import (
    ChatRequest, ChatResponse, CodeSubmission, CodeReviewResult,
    HealthResponse, AgentType,
)
from ..agents.orchestrator import run_agent_pipeline
from ..auth import get_current_user
from datetime import datetime

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        version="0.1.0",
        agents_available=[a.value for a in AgentType],
    )


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, user: dict = Depends(get_current_user)):
    """Send a message through the agent pipeline. Requires authentication."""
    try:
        result = await run_agent_pipeline(
            message=request.message,
            session_id=user.get("id", request.session_id),
            context=request.context,
        )
        return ChatResponse(
            message=result["message"],
            agent=result["agent"],
            session_id=result["session_id"],
            timestamp=datetime.utcnow(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/review", response_model=CodeReviewResult)
async def review_code(submission: CodeSubmission, user: dict = Depends(get_current_user)):
    """Submit code for review by the Code Review Agent. Requires authentication."""
    try:
        result = await run_agent_pipeline(
            message=f"Please review this Python code:\n```python\n{submission.code}\n```",
            session_id=user.get("id", submission.session_id),
            context={"type": "code_review", "language": submission.language},
        )
        return CodeReviewResult(
            score=75,
            feedback=result["message"],
            suggestions=[],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/exercises/{difficulty}")
async def get_exercise(difficulty: str):
    """Generate an exercise at the specified difficulty level."""
    if difficulty not in ("beginner", "intermediate", "advanced"):
        raise HTTPException(status_code=400, detail="Invalid difficulty level")

    result = await run_agent_pipeline(
        message=f"Generate a {difficulty} Python exercise",
        session_id="exercise-gen",
        context={"type": "exercise", "difficulty": difficulty},
    )
    return {"exercise": result["message"], "difficulty": difficulty}
