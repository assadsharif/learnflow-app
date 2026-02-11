"""LearnFlow — AI-powered Python tutoring platform."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.routes import router
from .agents.orchestrator import init_agents

app = FastAPI(
    title=settings.app_name,
    description="AI-powered Python tutoring platform with multi-agent architecture",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.on_event("startup")
async def startup():
    """Initialize agents on startup."""
    init_agents()


@app.get("/")
async def root():
    return {
        "name": "LearnFlow",
        "description": "AI-powered Python tutoring platform",
        "docs": "/docs",
    }
