---
sidebar_position: 2
---

# Kubernetes Deployment

Deploy LearnFlow to a Kubernetes cluster.

## Deploy to Minikube

### 1. Build and Deploy
```bash
bash k8s/deploy.sh
```

This script:
1. Creates the `learnflow` namespace
2. Builds Docker images in Minikube's Docker daemon
3. Applies all Kubernetes manifests
4. Waits for pods to be ready

### 2. Access the Application
```bash
minikube service learnflow-frontend -n learnflow
```

### 3. Verify
```bash
kubectl get pods -n learnflow
kubectl get svc -n learnflow
```

## Architecture on K8s

```
Namespace: learnflow
├── learnflow-backend (Deployment + Service)
│   └── Dapr sidecar (pub/sub, state)
├── learnflow-frontend (Deployment + NodePort Service)
└── Ingress (learnflow.local)

Namespace: kafka
└── kafka-broker-0 (Bitnami Helm)

Namespace: postgres
└── postgres-postgresql-0 (Bitnami Helm)
```
