---
sidebar_position: 4
---

# CI/CD Pipeline

The skills library uses GitHub Actions for continuous integration with skill-specific validation.

## Pipeline Overview

```yaml
# Triggered on push/PR to master, main, develop
on:
  push:
    branches: [master, main, develop]
  pull_request:
    branches: [master, main, develop]
```

## Jobs

| Job | Duration | Purpose |
|-----|----------|---------|
| `lint` | ~13s | Black formatting + Ruff linting |
| `test (3.11)` | ~27s | Python 3.11 test matrix |
| `test (3.12)` | ~27s | Python 3.12 test matrix |
| `validate-skills` | ~3s | SKILL.md existence and size check |
| `validate-scripts` | ~7s | Python/Shell syntax validation |
| `docs` | ~5s | README.md existence check |
| `notify` | ~3s | Aggregated pass/fail status |

## Skill Validation

The `validate-skills` job checks every skill in `.claude/skills/`:

```bash
for skill_dir in .claude/skills/*/; do
  skill_name=$(basename "$skill_dir")
  if [ ! -f "$skill_dir/SKILL.md" ]; then
    echo "Missing SKILL.md"       # FAIL
  else
    lines=$(wc -l < "$skill_dir/SKILL.md")
    if [ "$lines" -gt 500 ]; then
      echo "SKILL.md too long"    # FAIL (>500 lines)
    fi
  fi
done
```

## Script Validation

The `validate-scripts` job syntax-checks all skill scripts:

- **Python:** `python -m py_compile <script>`
- **Shell:** `bash -n <script>`

## Local Pre-Push Check

Use the `cicd-error-solver` skill to verify locally before pushing:

```bash
bash .claude/skills/cicd-error-solver/scripts/verify_ci.sh
```

With auto-fix mode:
```bash
bash .claude/skills/cicd-error-solver/scripts/verify_ci.sh --fix
```

## Diagnosing CI Failures

Parse CI logs with the diagnostics script:

```bash
# From a GitHub Actions run ID
python .claude/skills/cicd-error-solver/scripts/diagnose.py --run-id <run-id>

# From a log file
python .claude/skills/cicd-error-solver/scripts/diagnose.py ci.log --json
```

The script classifies errors into categories: `lint`, `build`, `test`, `dependency`, `workflow`, `permission`, `timeout`.

## Auto-Fix Lint Errors

```bash
# Fix all languages
bash .claude/skills/cicd-error-solver/scripts/fix_lint.sh all

# Fix Python only
bash .claude/skills/cicd-error-solver/scripts/fix_lint.sh python src/
```
