from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional

class AgentType(str, Enum):
    TRIAGE = "triage"
    CONCEPTS = "concepts"
    CODE_REVIEW = "code_review"
    DEBUG = "debug"
    EXERCISE = "exercise"
    PROGRESS = "progress"

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ChatMessage(BaseModel):
    role: MessageRole
    content: str
    agent: Optional[AgentType] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    message: str
    session_id: str
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    message: str
    agent: AgentType
    session_id: str
    suggestions: list[str] = []
    code_snippet: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class CodeSubmission(BaseModel):
    code: str
    exercise_id: Optional[str] = None
    language: str = "python"
    session_id: str

class CodeReviewResult(BaseModel):
    score: int = Field(ge=0, le=100)
    feedback: str
    suggestions: list[str] = []
    corrected_code: Optional[str] = None

class Exercise(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    starter_code: str
    test_cases: list[dict] = []
    hints: list[str] = []

class UserProgress(BaseModel):
    session_id: str
    topics_covered: list[str] = []
    exercises_completed: int = 0
    exercises_attempted: int = 0
    average_score: float = 0.0
    current_level: str = "beginner"
    strengths: list[str] = []
    areas_to_improve: list[str] = []

class HealthResponse(BaseModel):
    status: str
    version: str
    agents_available: list[str]
