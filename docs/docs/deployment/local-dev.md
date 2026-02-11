---
sidebar_position: 1
---

# Local Development

Run LearnFlow locally for development and testing.

## Prerequisites

- Docker Desktop
- Minikube
- kubectl
- Helm
- Node.js 20+
- Python 3.12+

## Setup

### 1. Start Minikube
```bash
minikube start --cpus=4 --memory=4096 --driver=docker
```

### 2. Deploy Infrastructure
```bash
# Deploy Kafka
bash .claude/skills/kafka-k8s-setup/scripts/deploy.sh

# Deploy PostgreSQL
bash .claude/skills/postgres-k8s-setup/scripts/deploy.sh
```

### 3. Run Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Edit with your OpenAI API key
uvicorn app.main:app --reload --port 8000
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000 to use LearnFlow.
