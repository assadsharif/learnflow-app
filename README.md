# LearnFlow

AI-powered Python tutoring platform built entirely using reusable Skills from the [Reusable Intelligence & Cloud-Native Mastery](https://github.com/assadsharif/Reusable-Intelligence-Cloud-Native-Mastery) skills library.

## Architecture

```
                    +------------------+
                    |   Next.js App    |
                    | (Monaco Editor)  |
                    +--------+---------+
                             |
                    +--------+---------+
                    |   Kong Gateway   |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
     +--------+--+  +-------+---+  +-------+---+
     | Triage    |  | Concepts  |  | Code      |
     | Agent     |  | Agent     |  | Review    |
     +-----+-----+  +-----+-----+  +-----+-----+
           |              |              |
     +-----+-----+  +-----+-----+  +-----+-----+
     | Debug     |  | Exercise  |  | Progress  |
     | Agent     |  | Agent     |  | Agent     |
     +-----+-----+  +-----+-----+  +-----+-----+
           |              |              |
    +------+--------------+--------------+------+
    |                  Dapr                      |
    |  (Pub/Sub: Kafka | State: PostgreSQL)      |
    +--------------------------------------------+
```

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + Monaco Editor |
| Backend | FastAPI + OpenAI Agents SDK |
| Messaging | Apache Kafka (Kraft mode) |
| Database | PostgreSQL (Bitnami Helm) |
| Service Mesh | Dapr (pub/sub + state) |
| API Gateway | Kong |
| Container | Docker + Kubernetes |
| Local Dev | Minikube |
| Docs | Docusaurus |

## Quick Start

```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

## Built With Skills

This application was built entirely using reusable AI agent skills:
- `fastapi-dapr-agent` — Backend scaffolding
- `nextjs-k8s-deploy` — Frontend deployment
- `kafka-k8s-setup` — Message broker
- `postgres-k8s-setup` — Database
- `docusaurus-deploy` — Documentation
- `mcp-code-execution` — MCP integration
