---
sidebar_position: 3
---

# Skill Inventory

Complete inventory of skills in the Reusable Intelligence library.

## Hackathon Skills (MCP Code Execution Pattern)

| Skill | Purpose | Scripts |
|-------|---------|---------|
| `agents-md-gen` | Generate AGENTS.md manifests | 1 |
| `k8s-foundation` | Cluster health and Helm charts | 2 |
| `kafka-k8s-setup` | Deploy Kafka on K8s | 3 |
| `postgres-k8s-setup` | Deploy PostgreSQL on K8s | 3 |
| `fastapi-dapr-agent` | Scaffold FastAPI + Dapr services | 2 |
| `nextjs-k8s-deploy` | Deploy Next.js on K8s | 2 |
| `mcp-code-execution` | Convert MCP tools to skills | 2 |
| `docusaurus-deploy` | Deploy Docusaurus on K8s | 3 |

## Token Savings

Using the Skills + Code Execution pattern vs direct MCP tool loading:

| Metric | Direct MCP | Skills Pattern |
|--------|-----------|---------------|
| Context per tool | ~2,500 tokens | ~100 tokens |
| 22 MCP servers | ~50,000 tokens | ~2,200 tokens |
| Savings | — | **95.6%** |
