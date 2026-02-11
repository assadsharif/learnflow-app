---
slug: /
sidebar_position: 1
---

# LearnFlow

**AI-powered Python tutoring platform** built entirely using reusable AI agent Skills.

## What is LearnFlow?

LearnFlow is an intelligent Python tutoring platform that uses a multi-agent architecture to provide personalized learning experiences. Six specialized AI agents collaborate to teach Python:

| Agent | Role |
|-------|------|
| **Triage** | Routes student queries to the right specialist |
| **Concepts** | Explains Python concepts with examples |
| **Code Review** | Reviews code and provides constructive feedback |
| **Debug** | Helps diagnose and fix Python errors |
| **Exercise** | Generates tailored coding challenges |
| **Progress** | Tracks learning progress and suggests next steps |

## Built With Skills

LearnFlow demonstrates the **Skills + Code Execution** pattern — every component was deployed using reusable AI agent skills from the [skills library](https://github.com/assadsharif/Reusable-Intelligence-Cloud-Native-Mastery).

```
SKILL.md (~100 tokens) → scripts/*.py (executed, 0 tokens) → minimal result
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/assadsharif/learnflow-app.git
cd learnflow-app

# Start backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Start frontend (new terminal)
cd frontend && npm install && npm run dev
```
