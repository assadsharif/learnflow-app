---
sidebar_position: 2
---

# Agent Architecture

LearnFlow uses the **OpenAI Agents SDK** to implement a multi-agent tutoring system.

## Agent Pipeline

Every student message flows through the **Triage Agent** first, which analyzes intent and routes to the appropriate specialist:

```
Student Message → Triage Agent → Specialist Agent → Response
```

## Agent Definitions

### Triage Agent
- **Role**: Intent classification and routing
- **Handoffs**: Routes to all 5 specialist agents
- **Fallback**: Responds directly for greetings and unclear queries

### Concepts Agent
- **Role**: Explains Python concepts
- **Strengths**: Clear explanations, runnable examples, analogies
- **Topics**: Variables, OOP, decorators, generators, async, and more

### Code Review Agent
- **Role**: Reviews student code
- **Scoring**: 0-100 based on correctness, style, efficiency, readability
- **Output**: Constructive feedback with improved code

### Debug Agent
- **Role**: Error diagnosis and fix
- **Approach**: Identify → Explain → Locate → Fix → Teach
- **Patterns**: Common Python error patterns

### Exercise Agent
- **Role**: Generate coding challenges
- **Format**: Title, description, starter code, hints, test cases
- **Levels**: Beginner, intermediate, advanced

### Progress Agent
- **Role**: Track learning progress
- **Metrics**: Topics covered, exercise scores, improvement areas
- **Output**: Motivational feedback with next steps
