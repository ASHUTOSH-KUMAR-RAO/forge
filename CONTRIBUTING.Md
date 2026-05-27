# Contributing to Forge

Thank you for your interest in contributing to Forge! This document will help you get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Commit Convention](#commit-convention)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- pnpm
- Git

### Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/forge.git
cd forge

# Add upstream remote
git remote add upstream https://github.com/yourusername/forge.git
```

---

## Development Setup

### TUI (TypeScript)

```bash
cd tui
pnpm install
pnpm dev        # Start in development mode
```

### Agent (Python)

```bash
cd agent

# Create virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"

# Copy env file and fill in keys
cp .env.example .env

# Start the agent server
python src/main.py
```

### Environment Variables

```env
# agent/.env
GROQ_API_KEY=
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
POLAR_API_KEY=
LANGSMITH_API_KEY=
```

---

## Project Structure

```
forge/
├── tui/src/
│   ├── commands/       # Commander.js CLI entry commands
│   ├── components/     # OpenTUI React components
│   ├── hooks/          # Custom React hooks
│   ├── themes/         # Theme configuration files
│   └── socket/         # WebSocket client
│
└── agent/src/
    ├── api/            # FastAPI routes and WebSocket handlers
    ├── agent/          # LangGraph nodes, graph, and state
    ├── rag/            # Indexer and retriever
    ├── tools/          # File, shell, and web search tools
    └── auth/           # Clerk authentication handler
```

---

## How to Contribute

### 1. Find an Issue

- Check [open issues](https://github.com/ASHUTOSH-KUMAR-RAO/forge/issues)
- Look for issues tagged `good first issue` or `help wanted`
- Comment on the issue to let others know you are working on it

### 2. Create a Branch

```bash
# Sync with upstream first
git fetch upstream
git checkout main
git merge upstream/main

# Create your branch
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes

- Write clean, readable code
- Follow the coding standards below
- Add tests where applicable
- Update documentation if needed

### 4. Test Your Changes

```bash
# TUI tests
cd tui && pnpm test

# Agent tests
cd agent && pytest
```

### 5. Submit a Pull Request

Push your branch and open a PR against `main`.

---

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Fill out the PR template completely
3. Link any related issues using `Closes #issue_number`
4. Wait for review — we aim to respond within 48 hours
5. Address any requested changes
6. Once approved, a maintainer will merge your PR

### PR Title Format

Follow the same convention as commits:

```
feat: add /search command to TUI
fix: handle WebSocket reconnection on drop
docs: update installation steps in README
```

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code change that is not a fix or feature |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates |
| `perf` | Performance improvements |

### Examples

```
feat(tui): add inline diff rendering for file changes
fix(agent): handle empty RAG index on first run
docs: add environment variable reference to CONTRIBUTING
chore(deps): update langchain to 0.3.0
```

---

## Coding Standards

### TypeScript (TUI)

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use named exports, not default exports (except for React components)
- Keep components small and focused — one responsibility per file
- Use `zod` for runtime type validation

```typescript
// Good
export const parseCommand = (input: string): Command => { ... }

// Avoid
export default function parseCommand(input) { ... }
```

### Python (Agent)

- Follow PEP 8
- Use type hints everywhere
- Use `async/await` — no synchronous blocking calls
- Keep functions small and single-purpose
- Use `pydantic` models for data validation

```python
# Good
async def index_file(path: str, session_id: str) -> IndexResult:
    ...

# Avoid
def index_file(path, session_id):
    ...
```

### General

- No commented-out code in PRs
- No `console.log` or `print` debug statements
- Write self-documenting code — comments should explain *why*, not *what*

---

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md).

Please include:
- Forge version (`/version`)
- OS and terminal emulator
- Steps to reproduce
- Expected vs actual behavior
- Any error output

---

## Requesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md).

Please include:
- What problem does this solve?
- How would it work?
- Are there alternatives you have considered?

---

## Questions?

Open a [Discussion](https://github.com/ASHUTOSH-KUMAR-RAO/forge/discussions) — we are happy to help.
