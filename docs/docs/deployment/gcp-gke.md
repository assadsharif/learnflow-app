---
sidebar_position: 3
---

# GCP Deployment (GKE)

Deploy LearnFlow to Google Kubernetes Engine with Artifact Registry.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   GKE Cluster (us-central1-a)           │
│                   2 nodes, K8s v1.33.5                  │
│                                                         │
│  ┌─────────────────── learnflow namespace ───────────┐  │
│  │                                                   │  │
│  │  ┌──────────────┐      ┌──────────────────────┐   │  │
│  │  │   Frontend   │      │      Backend         │   │  │
│  │  │  Next.js 14  │      │  FastAPI + Agents    │   │  │
│  │  │  LoadBalancer │─────▶│  ClusterIP :8000     │   │  │
│  │  │  :80 external│      │  6 AI Agents         │   │  │
│  │  └──────────────┘      └──────────┬───────────┘   │  │
│  └───────────────────────────────────┼───────────────┘  │
│                                      │                  │
│  ┌─── postgres namespace ──┐  ┌─── kafka namespace ──┐  │
│  │  PostgreSQL 18.1.0      │  │  Kafka 3.8.1 KRaft   │  │
│  │  (Bitnami Helm)         │  │  (Single broker)     │  │
│  │  5Gi PVC                │  │                      │  │
│  └─────────────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

```bash
gcloud auth login
gcloud config set project gen-lang-client-0174245278
gcloud container clusters get-credentials todo-chatbot --zone us-central1-a
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## Step 1: Build and Push Images

```bash
# Backend
cd learnflow-app/backend
docker build -t us-central1-docker.pkg.dev/gen-lang-client-0174245278/learnflow/backend:latest .
docker push us-central1-docker.pkg.dev/gen-lang-client-0174245278/learnflow/backend:latest

# Frontend
cd ../frontend
docker build -t us-central1-docker.pkg.dev/gen-lang-client-0174245278/learnflow/frontend:latest .
docker push us-central1-docker.pkg.dev/gen-lang-client-0174245278/learnflow/frontend:latest
```

## Step 2: Create Namespaces

```bash
kubectl create namespace learnflow
kubectl create namespace postgres
kubectl create namespace kafka
```

## Step 3: Deploy Infrastructure

```bash
# PostgreSQL via Helm
helm install postgres oci://registry-1.docker.io/bitnamicharts/postgresql \
  --namespace postgres \
  --set auth.username=learnflow \
  --set auth.password=learnflow \
  --set auth.database=learnflow \
  --set primary.persistence.size=5Gi \
  --wait

# Kafka (KRaft mode)
kubectl apply -f k8s/base/kafka-deployment.yaml
```

## Step 4: Deploy Application

```bash
kubectl apply -f k8s/base/secrets.yaml
kubectl apply -f k8s/gke/backend-deployment.yaml
kubectl apply -f k8s/base/backend-service.yaml
kubectl apply -f k8s/gke/frontend-deployment.yaml
kubectl apply -f k8s/gke/frontend-service.yaml
```

## Step 5: Verify

```bash
# All pods running
kubectl get pods -n learnflow -n postgres -n kafka

# Get external IP
kubectl get svc -n learnflow learnflow-frontend

# Test backend health
kubectl exec -n learnflow $(kubectl get pods -n learnflow \
  -l app=learnflow-backend -o jsonpath='{.items[0].metadata.name}') \
  -- python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/api/v1/health').read().decode())"
```

## GKE vs Minikube Differences

| Aspect | Minikube | GKE |
|--------|----------|-----|
| Images | Local Docker (`imagePullPolicy: Never`) | Artifact Registry (`imagePullPolicy: Always`) |
| Frontend Service | `NodePort` (port 30300) | `LoadBalancer` (port 80, external IP) |
| Manifests | `k8s/base/` | `k8s/gke/` overlay |
| Access | `minikube service` | External IP |

## Troubleshooting

### Frontend SWC Build Error
Next.js on Alpine requires the musl SWC binary. The Dockerfile pre-installs it:
```dockerfile
RUN npm install @next/swc-linux-x64-musl
```

### Image Pull Errors
Ensure Docker auth is configured:
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### Pod CrashLoopBackOff
```bash
kubectl logs -n learnflow <pod-name> --previous
kubectl describe pod -n learnflow <pod-name>
```
