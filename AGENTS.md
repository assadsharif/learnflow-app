# AGENTS.md -- LearnFlow

**LearnFlow** is an AI-powered Python tutoring platform built using reusable Skills from the companion [Reusable Intelligence & Cloud-Native Mastery](https://github.com/assadsharif/Reusable-Intelligence-Cloud-Native-Mastery) skills library.

- **GitHub:** [github.com/assadsharif/learnflow-app](https://github.com/assadsharif/learnflow-app)
- **Type:** Full-stack web application (multi-agent AI backend + interactive frontend + documentation site)
- **Status:** Deployed to GKE with GitOps (Argo CD)

---

## AI Agents

LearnFlow uses the [OpenAI Agents SDK](https://pypi.org/project/openai-agents/) to implement a multi-agent tutoring pipeline. All agents live in `backend/app/agents/` and are wired together by the **Orchestrator** (`orchestrator.py`), which initializes handoffs at startup.

### Agent Pipeline

Every student message enters through the **Triage Agent**, which analyzes intent and routes to the appropriate specialist via OpenAI Agents SDK handoffs.

```
Student Message
      |
      v
+------------------+
|   Triage Agent   |  Analyzes intent, routes to specialist
+--------+---------+
         |
    +----+----+----+----+----+
    |    |    |    |    |    |
    v    v    v    v    v    v
Concepts Code  Debug Exercise Progress
 Agent   Review Agent  Agent   Agent
         Agent
```

### Agent Definitions

| Agent | File | Purpose |
|-------|------|---------|
| **Triage Agent** | `backend/app/agents/triage.py` | Entry point. Classifies student intent (concept question, code review, debugging, exercise request, progress check) and hands off to the correct specialist. Responds directly to greetings and unclear queries. |
| **Concepts Agent** | `backend/app/agents/concepts.py` | Explains Python concepts (variables, OOP, decorators, async/await, etc.) with runnable code examples, analogies, and progressive depth adapted to the student's level. |
| **Code Review Agent** | `backend/app/agents/code_review.py` | Reviews submitted Python code on correctness, PEP 8 style, efficiency, readability, and best practices. Provides a 0-100 score with constructive feedback and improved code. |
| **Debug Agent** | `backend/app/agents/debug.py` | Diagnoses Python errors and bugs. Identifies the error type, explains the cause in plain language, provides the fix, and teaches avoidance strategies. |
| **Exercise Agent** | `backend/app/agents/exercise.py` | Generates tailored coding exercises (beginner/intermediate/advanced) with title, description, requirements, starter code, progressive hints, and test cases. |
| **Progress Agent** | `backend/app/agents/progress.py` | Tracks and reports student learning progress -- topics covered, exercise completion rate, average scores, error pattern trends, and suggests next steps with motivational feedback. |
| **Orchestrator** | `backend/app/agents/orchestrator.py` | Initializes all agents, wires up Triage handoffs, and exposes `run_agent_pipeline()` which runs the OpenAI Agents SDK `Runner` starting from Triage. |

### Agent Configuration

- **Model:** Configurable via `OPENAI_MODEL` env var (default: `gpt-4o-mini`)
- **API Key:** Set via `OPENAI_API_KEY` environment variable (stored as K8s Secret in production)
- **SDK:** `openai-agents==0.0.7`

---

## Architecture

```
+-----------------------------+
|       Next.js 14 App        |
|   (Monaco Editor + Chat)    |
|       Port 3000             |
+-------------+---------------+
              |
              | /api/* rewrite
              v
+-------------+---------------+
|       FastAPI Backend       |
|   (OpenAI Agents SDK)      |
|       Port 8000             |
+---+----------+---------+---+
    |          |         |
    v          v         v
+-------+  +------+  +----------+
| Dapr  |  | Dapr |  | Direct   |
| PubSub|  | State|  | OpenAI   |
+---+---+  +--+---+  | API Call |
    |         |       +----------+
    v         v
+-------+  +----------+
| Kafka |  | Postgres |
| 3.8.1 |  | (Bitnami)|
+-------+  +----------+
```

### Technology Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Frontend** | Next.js 14 | React 18, TypeScript, Tailwind CSS, Monaco Editor for code editing, Lucide icons |
| **Backend** | FastAPI 0.115 | Python 3.12, OpenAI Agents SDK, Pydantic v2, async with uvicorn |
| **AI Framework** | OpenAI Agents SDK | Multi-agent handoffs, Runner pipeline, tool-based routing |
| **Messaging** | Apache Kafka 3.8.1 | KRaft mode (no ZooKeeper), single-node, Dapr pub/sub component |
| **Database** | PostgreSQL | Bitnami Helm chart, Dapr state store component, asyncpg driver |
| **Service Mesh** | Dapr | Pub/sub (Kafka-backed) + state management (PostgreSQL-backed) |
| **API Gateway** | Nginx Ingress | Path-based routing (`/api` to backend, `/` to frontend) |
| **Containers** | Docker | Multi-stage builds for frontend and docs; slim Python base for backend |
| **Orchestration** | Kubernetes | Minikube (local dev), GKE (production) |
| **Packaging** | Helm | Chart with PostgreSQL and Kafka as optional subcharts |
| **Docs** | Docusaurus | Nginx-served static site, architecture + skills + deployment guides |

### API Endpoints

All backend routes are prefixed with `/api/v1`:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Health check -- returns status, version, and available agents |
| `POST` | `/api/v1/chat` | Send a message through the agent pipeline (Triage -> Specialist) |
| `POST` | `/api/v1/review` | Submit Python code for AI code review |
| `GET` | `/api/v1/exercises/{difficulty}` | Generate a coding exercise (beginner, intermediate, advanced) |

### Data Models

Defined in `backend/app/models/schemas.py`:

- `ChatRequest` / `ChatResponse` -- Chat message exchange with agent identification
- `CodeSubmission` / `CodeReviewResult` -- Code review with 0-100 scoring
- `Exercise` -- Generated exercise with starter code and test cases
- `UserProgress` -- Learning metrics (topics, scores, level, strengths)

### Database Schema

Defined in `backend/migrations/001_init.sql`:

- `sessions` -- Tutoring sessions with user ID and metadata (JSONB)
- `messages` -- Chat history with role, content, and agent attribution
- `exercises` -- Generated exercises with difficulty and test cases (JSONB)
- `submissions` -- Student code submissions with score and feedback

---

## Cloud Deployment

### GKE Production Environment

| Resource | Value |
|----------|-------|
| **GCP Project** | `gen-lang-client-0174245278` |
| **GKE Cluster** | `todo-chatbot` |
| **Region/Zone** | `us-central1-a` |
| **Artifact Registry** | `us-central1-docker.pkg.dev/gen-lang-client-0174245278/learnflow` |
| **Namespace** | `learnflow` |

### Container Images

All images are pushed to Google Artifact Registry:

| Image | Path |
|-------|------|
| Backend | `us-central1-docker.pkg.dev/.../learnflow/backend:latest` |
| Frontend | `us-central1-docker.pkg.dev/.../learnflow/frontend:latest` |
| Docs | `us-central1-docker.pkg.dev/.../learnflow/docs:latest` |

### Live Endpoints

| Service | URL | Type |
|---------|-----|------|
| **Frontend** | http://34.56.83.182 | LoadBalancer |
| **Documentation** | http://34.122.229.139 | LoadBalancer |
| **Argo CD Dashboard** | https://34.44.123.161 | LoadBalancer |

### GKE Manifests (`k8s/gke/`)

Production-specific Kubernetes manifests that override base configs with Artifact Registry image references and `imagePullPolicy: Always`:

- `backend-deployment.yaml` -- Backend with OpenAI API key from K8s Secret
- `frontend-deployment.yaml` -- Frontend with backend service URL env var
- `frontend-service.yaml` -- LoadBalancer service exposing port 80 -> 3000
- `docs-deployment.yaml` -- Docusaurus site with Nginx, plus LoadBalancer service

---

## CI/CD Pipeline

### Continuous Integration (`.github/workflows/ci.yml`)

Triggered on push/PR to `main`:

1. **Backend job:** Python 3.12, install deps, lint with Ruff, type check with Pyright
2. **Frontend job:** Node 20, `npm ci`, lint, `npm run build`
3. **Docker job:** Build both backend and frontend images (validation only)

### Continuous Deployment (`.github/workflows/deploy.yml`)

Triggered on push to `main` when `backend/`, `frontend/`, `docs/`, or `k8s/` paths change. Also supports manual `workflow_dispatch` with component selection.

**Pipeline stages:**

1. **detect-changes** -- Uses `dorny/paths-filter` to determine which components changed
2. **build-backend** -- Authenticates to GCP, builds and pushes backend image to Artifact Registry
3. **build-frontend** -- Authenticates to GCP, builds and pushes frontend image to Artifact Registry
4. **build-docs** -- Authenticates to GCP, builds and pushes docs image to Artifact Registry
5. **update-manifests** -- Updates image tags in `k8s/gke/*.yaml` with the commit SHA and pushes the change
6. **notify** -- Writes deployment summary to GitHub Actions step summary

### Argo CD GitOps (`k8s/argocd/learnflow-app.yaml`)

Argo CD watches the `k8s/gke/` directory on the `main` branch and automatically syncs changes to the GKE cluster:

- **Automated sync** with `prune: true` and `selfHeal: true`
- **Retry policy:** Up to 3 retries with exponential backoff (5s, 10s, 20s up to 3m)
- **Sync options:** `CreateNamespace=true`, `ApplyOutOfSyncOnly=true`

**GitOps flow:**

```
Push to main
    |
    v
GitHub Actions
  - Build image
  - Push to Artifact Registry
  - Update k8s/gke/ manifests with new SHA
  - Commit & push manifest change
    |
    v
Argo CD detects manifest change
  - Auto-syncs to GKE cluster
  - Self-heals if drift detected
```

---

## Local Development (Minikube)

### Prerequisites

- Docker, Minikube, kubectl
- Python 3.12, Node.js 20
- (Optional) Dapr CLI, Helm

### Quick Start

```bash
# Backend
cd backend && pip install -r requirements.txt
cp .env.example .env  # Set OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

### Kubernetes Deployment (Minikube)

```bash
# One-command deploy
./k8s/deploy.sh
```

The deploy script:
1. Creates the `learnflow` namespace
2. Builds Docker images inside Minikube's Docker daemon
3. Applies all base manifests (deployments, services, ingress)
4. Applies Dapr components if Dapr is installed
5. Waits for rollouts and prints access URLs

### Base Manifests (`k8s/base/`)

| Manifest | Description |
|----------|-------------|
| `namespace.yaml` | `learnflow` namespace |
| `backend-deployment.yaml` | Backend pod (Python 3.12, port 8000, liveness/readiness probes) |
| `backend-service.yaml` | ClusterIP service for backend |
| `frontend-deployment.yaml` | Frontend pod (Node 20, port 3000) |
| `frontend-service.yaml` | NodePort service (30300) for frontend |
| `kafka-deployment.yaml` | Apache Kafka 3.8.1 in KRaft mode with ClusterIP service |
| `kong-ingress.yaml` | Nginx ingress routing `/api` to backend, `/` to frontend |
| `secrets.yaml` | K8s Secret for `OPENAI_API_KEY` |
| `dapr-pubsub.yaml` | Dapr pub/sub component backed by Kafka |
| `dapr-statestore.yaml` | Dapr state store component backed by PostgreSQL |

### Helm Chart (`k8s/charts/`)

A Helm chart (`learnflow v0.1.0`) with optional Bitnami subcharts for PostgreSQL and Kafka. Both subcharts are disabled by default because the project uses external setups from the skills library (`kafka-k8s-setup` and `postgres-k8s-setup` skills).

---

## Directory Structure

```
learnflow-app/
|-- .github/
|   `-- workflows/
|       |-- ci.yml                  # CI: lint, type-check, build
|       `-- deploy.yml              # CD: build, push, update manifests
|-- backend/
|   |-- app/
|   |   |-- agents/                 # AI agent definitions
|   |   |   |-- orchestrator.py     # Agent initialization + pipeline runner
|   |   |   |-- triage.py           # Triage (entry point, intent routing)
|   |   |   |-- concepts.py         # Python concept explanations
|   |   |   |-- code_review.py      # Code review + scoring
|   |   |   |-- debug.py            # Error diagnosis + fixes
|   |   |   |-- exercise.py         # Exercise generation
|   |   |   `-- progress.py         # Learning progress tracking
|   |   |-- api/
|   |   |   `-- routes.py           # FastAPI route handlers
|   |   |-- models/
|   |   |   `-- schemas.py          # Pydantic models (request/response)
|   |   |-- services/
|   |   |   |-- state.py            # Dapr state store client
|   |   |   `-- pubsub.py           # Dapr pub/sub client (Kafka)
|   |   |-- dapr/components/        # Local Dapr component configs
|   |   |-- config.py               # Pydantic Settings (env-based config)
|   |   `-- main.py                 # FastAPI app entry point
|   |-- migrations/
|   |   `-- 001_init.sql            # Initial DB schema
|   |-- Dockerfile                  # Python 3.12 slim, uvicorn
|   |-- requirements.txt            # Python dependencies
|   `-- .env.example                # Environment variable template
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |   |-- layout.tsx          # Root layout
|   |   |   |-- page.tsx            # Main page (tab-based UI)
|   |   |   `-- globals.css         # Tailwind + custom styles
|   |   `-- components/
|   |       |-- ChatPanel.tsx       # AI chat interface with agent labels
|   |       |-- CodeEditor.tsx      # Monaco Editor with code review
|   |       `-- Sidebar.tsx         # Navigation sidebar (Chat/Editor/Exercises)
|   |-- Dockerfile                  # Multi-stage Node 20 build
|   |-- package.json                # Next.js 14, React 18, Monaco, Tailwind
|   |-- next.config.js              # Standalone output + API rewrites
|   |-- tailwind.config.ts
|   `-- tsconfig.json
|-- docs/
|   |-- docs/
|   |   |-- intro.md
|   |   |-- architecture/
|   |   |   |-- overview.md         # System architecture
|   |   |   |-- agents.md           # Agent documentation
|   |   |   `-- cloud-native.md     # Cloud-native patterns
|   |   |-- skills/
|   |   |   |-- what-are-skills.md  # Skills concept guide
|   |   |   |-- creating-skills.md  # How to create skills
|   |   |   `-- skill-inventory.md  # Available skills list
|   |   `-- deployment/
|   |       |-- local-dev.md        # Local development guide
|   |       |-- kubernetes.md       # Minikube deployment
|   |       |-- gcp-gke.md          # GKE deployment guide
|   |       `-- cicd.md             # CI/CD pipeline docs
|   |-- docusaurus.config.js
|   |-- sidebars.js
|   |-- Dockerfile                  # Build + Nginx serve
|   `-- nginx.conf
|-- k8s/
|   |-- base/                       # Minikube manifests
|   |   |-- namespace.yaml
|   |   |-- backend-deployment.yaml
|   |   |-- backend-service.yaml
|   |   |-- frontend-deployment.yaml
|   |   |-- frontend-service.yaml
|   |   |-- kafka-deployment.yaml
|   |   |-- kong-ingress.yaml
|   |   |-- secrets.yaml
|   |   |-- dapr-pubsub.yaml
|   |   `-- dapr-statestore.yaml
|   |-- gke/                        # GKE production overrides
|   |   |-- backend-deployment.yaml
|   |   |-- frontend-deployment.yaml
|   |   |-- frontend-service.yaml
|   |   `-- docs-deployment.yaml
|   |-- argocd/
|   |   `-- learnflow-app.yaml     # Argo CD Application manifest
|   |-- charts/
|   |   |-- Chart.yaml             # Helm chart (PostgreSQL + Kafka subcharts)
|   |   `-- values.yaml            # Default Helm values
|   `-- deploy.sh                   # One-command Minikube deploy script
|-- AGENTS.md                       # This file
|-- README.md
`-- .gitignore
```

---

## Built with Skills

This application was scaffolded and deployed entirely using reusable AI agent skills from the [Reusable Intelligence & Cloud-Native Mastery](https://github.com/assadsharif/Reusable-Intelligence-Cloud-Native-Mastery) skills library:

| Skill | What it did |
|-------|-------------|
| `fastapi-dapr-agent` | Scaffolded the FastAPI backend with Dapr integration and OpenAI Agents SDK multi-agent architecture |
| `nextjs-k8s-deploy` | Generated the Next.js frontend with Monaco Editor, Tailwind CSS, and Kubernetes deployment manifests |
| `kafka-k8s-setup` | Set up Apache Kafka in KRaft mode with Kubernetes manifests and Dapr pub/sub component |
| `postgres-k8s-setup` | Deployed PostgreSQL via Bitnami Helm chart with Dapr state store component |
| `docusaurus-deploy` | Created the Docusaurus documentation site with architecture, skills, and deployment guides |
| `mcp-code-execution` | Integrated MCP (Model Context Protocol) patterns for agent tool execution |

### The Skills Pattern

Each skill follows the **Skills + Code Execution** pattern from the companion repository:

1. `SKILL.md` tells the AI agent **what** to do (minimal context, ~100 tokens)
2. `scripts/*.py` does the actual work (executed, not loaded into context)
3. Only the final result enters the agent's context window (minimal token usage)

This pattern keeps the agent's context lean while enabling complex scaffolding, deployment, and infrastructure tasks to be executed reliably and repeatedly across projects.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for agent inference | (required) |
| `OPENAI_MODEL` | Model for all agents | `gpt-4o-mini` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://learnflow:learnflow@localhost:5432/learnflow` |
| `DAPR_HTTP_PORT` | Dapr sidecar HTTP port | `3500` |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka broker address | `kafka-broker-0....:9092` |

---

## Resource Budgets (Kubernetes)

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| Backend | 100m | 500m | 256Mi | 512Mi |
| Frontend | 100m | 300m | 128Mi | 256Mi |
| Docs | 50m | 200m | 64Mi | 128Mi |
| Kafka | 100m | 500m | 512Mi | 1Gi |
