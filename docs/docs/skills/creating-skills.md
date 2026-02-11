---
sidebar_position: 2
---

# Creating Skills

Guide to creating new reusable skills for the Skills + Code Execution pattern.

## Skill Anatomy

Every skill needs at minimum:

### SKILL.md (Required)
The agent-facing instruction file. Keep it under 100 tokens of essential information:

```markdown
---
name: my-skill
description: What this skill does
---

# Skill Name

One-line description.

## Scope
**Does**: List of capabilities
**Does NOT**: List of exclusions

## Tool Map
| Action | Script | Input | Output |
|--------|--------|-------|--------|
| Deploy | scripts/deploy.sh | --namespace | Status |

## Must Follow
- Rule 1
- Rule 2

## Must Avoid
- Anti-pattern 1
```

### scripts/ (Required for Code Execution pattern)
Executable scripts that do the actual work:

- **Shell scripts** (`.sh`) for CLI operations (kubectl, helm, docker)
- **Python scripts** (`.py`) for complex logic, API calls, JSON output

### REFERENCE.md (Optional)
Detailed documentation loaded only when the agent needs deeper context.

## Best Practices

1. Keep SKILL.md lean — under 100 tokens of instructions
2. Scripts should output structured JSON when possible
3. Include a Tool Map linking actions to scripts
4. Add Must Follow / Must Avoid sections for guardrails
5. Include cross-platform recipe.yaml for Goose compatibility
