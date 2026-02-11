---
sidebar_position: 1
---

# Architecture Overview

LearnFlow uses a cloud-native microservices architecture with AI agents at its core.

## System Architecture

```
┌─────────────────────────────────────────────┐
│              Next.js Frontend                │
│         (Monaco Editor + Chat UI)            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────┼──────────────────────────┐
│            Kong API Gateway                  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────┼──────────────────────────┐
│          FastAPI Backend                     │
│  ┌─────────────────────────────────┐        │
│  │      OpenAI Agents SDK          │        │
│  │  Triage → Concepts/Review/      │        │
│  │          Debug/Exercise/Progress │        │
│  └─────────────────────────────────┘        │
└──────────┬──────────────┬───────────────────┘
           │              │
    ┌──────┴──────┐ ┌─────┴─────┐
    │    Dapr     │ │   Dapr    │
    │  Pub/Sub    │ │   State   │
    │  (Kafka)    │ │  (Postgres)│
    └─────────────┘ └───────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 | Server-rendered React UI |
| Editor | Monaco Editor | VS Code-quality code editing |
| Backend | FastAPI | Async Python API framework |
| AI | OpenAI Agents SDK | Multi-agent orchestration |
| Messaging | Apache Kafka | Event streaming (Kraft mode) |
| Database | PostgreSQL | Persistent storage |
| Service Mesh | Dapr | Pub/sub + state management |
| Gateway | Kong | API routing and rate limiting |
| Orchestration | Kubernetes | Container orchestration |
| Local Dev | Minikube | Local K8s cluster |
| Packaging | Helm | Kubernetes package manager |
