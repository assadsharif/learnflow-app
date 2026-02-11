---
sidebar_position: 3
---

# Cloud-Native Architecture

LearnFlow runs on Kubernetes with Dapr for service mesh capabilities.

## Kubernetes Deployment

All services run as containers in a Minikube cluster:

- **learnflow-backend**: FastAPI with Dapr sidecar
- **learnflow-frontend**: Next.js standalone
- **kafka**: Bitnami Helm chart (Kraft mode)
- **postgres**: Bitnami Helm chart

## Dapr Integration

Dapr provides two key building blocks:

### Pub/Sub (Kafka)
Events flow through Kafka topics:
- `student-messages` — Chat messages for analytics
- `code-submissions` — Code review submissions
- `exercise-completions` — Exercise results

### State Store (PostgreSQL)
Session state persisted via Dapr state API:
- Student session context
- Conversation history
- Exercise progress

## Deployment with Skills

Each infrastructure component is deployed using a dedicated skill:

```bash
# Deploy Kafka
bash .claude/skills/kafka-k8s-setup/scripts/deploy.sh

# Deploy PostgreSQL
bash .claude/skills/postgres-k8s-setup/scripts/deploy.sh

# Deploy backend + frontend
bash k8s/deploy.sh
```
