---
sidebar_position: 1
---

# What Are Skills?

Skills are the core innovation of the **Reusable Intelligence** framework — portable packages of AI agent knowledge that execute scripts instead of loading tools into context.

## The Problem

When AI agents load MCP tools directly, each tool definition consumes context tokens:

| Approach | Context Cost |
|----------|-------------|
| Load 22 MCP servers directly | ~50,000+ tokens |
| Skills + Code Execution | ~100 tokens per skill |

## The Solution: Skills + Code Execution

```
SKILL.md (~100 tokens) → scripts/*.py (executed, 0 tokens) → minimal result
```

1. **SKILL.md** tells the agent WHAT to do (loaded into context, ~100 tokens)
2. **scripts/*.py** does the actual work (executed externally, 0 context tokens)
3. Only the final result enters context (minimal tokens)

## Skill Structure

```
.claude/skills/<skill-name>/
├── SKILL.md           # Agent instructions (~100 tokens)
├── REFERENCE.md       # Detailed docs (loaded on demand)
├── scripts/
│   ├── deploy.sh      # Executable scripts
│   └── verify.py      # (0 context tokens)
└── templates/         # Optional templates
```

## Cross-Platform Portability

Skills work across multiple AI agents:

| Agent | Format |
|-------|--------|
| Claude Code | SKILL.md |
| OpenAI Codex | SKILL.md |
| Goose | recipe.yaml |
