#!/usr/bin/env bash
# Deploy LearnFlow to Minikube
set -euo pipefail

NAMESPACE="learnflow"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== LearnFlow Deployment ==="

# Create namespace
kubectl get namespace "$NAMESPACE" >/dev/null 2>&1 || kubectl create namespace "$NAMESPACE"

# Build images in Minikube's Docker daemon
echo "--- Building Docker images ---"
eval $(minikube docker-env)

docker build -t learnflow-backend:latest "$SCRIPT_DIR/../backend/"
docker build -t learnflow-frontend:latest "$SCRIPT_DIR/../frontend/"

# Apply base manifests
echo "--- Applying Kubernetes manifests ---"
kubectl apply -f "$SCRIPT_DIR/base/namespace.yaml"
kubectl apply -f "$SCRIPT_DIR/base/secrets.yaml"
kubectl apply -f "$SCRIPT_DIR/base/backend-deployment.yaml"
kubectl apply -f "$SCRIPT_DIR/base/backend-service.yaml"
kubectl apply -f "$SCRIPT_DIR/base/frontend-deployment.yaml"
kubectl apply -f "$SCRIPT_DIR/base/frontend-service.yaml"
kubectl apply -f "$SCRIPT_DIR/base/kong-ingress.yaml"

# Apply Dapr components if Dapr is installed
if kubectl get namespace dapr-system >/dev/null 2>&1; then
    echo "--- Applying Dapr components ---"
    kubectl apply -f "$SCRIPT_DIR/base/dapr-pubsub.yaml"
    kubectl apply -f "$SCRIPT_DIR/base/dapr-statestore.yaml"
fi

echo ""
echo "--- Waiting for pods ---"
kubectl rollout status deployment/learnflow-backend -n "$NAMESPACE" --timeout=120s || true
kubectl rollout status deployment/learnflow-frontend -n "$NAMESPACE" --timeout=120s || true

echo ""
kubectl get pods -n "$NAMESPACE"

echo ""
FRONTEND_URL=$(minikube service learnflow-frontend -n "$NAMESPACE" --url 2>/dev/null || echo "http://$(minikube ip):30300")
echo "Frontend: $FRONTEND_URL"
echo "Backend:  http://$(minikube ip):$(kubectl get svc learnflow-backend -n $NAMESPACE -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo '8000')"
