<div align="center">

```
███████╗ ██████╗ ██████╗  ██████╗ ███████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
█████╗  ██║   ██║██████╔╝██║  ███╗█████╗
██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝
██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
```

**A terminal-based AI coding agent. Built for developers who live in the terminal.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue)](https://www.python.org/)
[![Status](https://img.shields.io/badge/Status-Active%20Development-orange)]()

</div>

---

## What is Forge?

Forge is a terminal-based AI coding agent. You describe what you want to build, and Forge plans, writes, runs, and ships the code for you — all from your terminal.

No browser. No GUI. No mouse. Just your terminal and an agent that actually executes.

```
◆ Forge                                         v0.1.0

  User: add error handling to the parser

  ⎿ Reading    src/utils/parser.ts
  ⎿ Analyzing  errors and edge cases...
  ⎿ Writing    src/utils/parser.ts
  ⎿ Running    npm test

  + Added try-catch in parseJSON()
  + Added error boundary in parseCSV()
  ~ Modified   handleError() — now rethrows on fatal errors

  ● Done in 3.8s

> _
```

---

## Why Forge?

Most AI coding tools fall into two camps:

**Pure terminal tools** (Claude Code, Aider, OpenCode) — powerful and dev-friendly, but require local setup and offer no persistence across machines.

**Chat-based interfaces** (Cursor, Copilot) — accessible but feel like autocomplete. No real execution. Breaks your flow.

Forge is different. It has the raw execution power of a terminal agent, with a clean Claude Code-inspired interface — entirely in your terminal.

---

## Features

### Terminal Interface
- Clean, minimal UI inspired by Claude Code
- Everything streams top to bottom — no popups, no modals
- Real-time tool call feed — every file read, write, and run is visible
- Inline diffs shown as the agent edits files
- Multiple themes — Midnight, Nord, Dracula, Monokai
- Keyboard-first — no mouse required

### Core Agent
- Natural language task input — just describe what you want
- LangGraph agentic loop — Plan → Execute → Observe → Retry
- Automatic error recovery — agent analyzes failures and retries
- Multi-turn session memory — full context preserved per session
- Transparent execution — every step streamed in real time

### Execution Tools
- File read, write, create, and delete
- Shell command execution with live output streaming
- Inline diffs — exact changes shown, not full rewrites
- Web search — agent fetches docs mid-task automatically

### RAG & Knowledge
- Automatic codebase indexing on every new session
- LangChain-powered document loading and chunking
- Gemini embeddings stored in Supabase via pgvector
- Semantic file search — only relevant context retrieved
- Persistent memory across sessions per project

### Auth & Billing
- Clerk authentication — browser redirect via PKCE flow
- Token stored securely in `~/.forge/auth.json`
- Usage-based billing via Polar — Free, Pro, and Team plans

---

## Tech Stack

### TUI Layer
| | |
|---|---|
| Language | TypeScript |
| Runtime | Node.js |
| Package Manager | pnpm |
| TUI Library | `@opentui/core` + `@opentui/react` |
| CLI Entry | Commander.js |

### Agent Backend
| | |
|---|---|
| Language | Python 3.11+ |
| Framework | FastAPI |
| Agent Loop | LangGraph |
| Tooling + RAG | LangChain |
| Observability | LangSmith |
| Communication | WebSockets |

### AI & Models
| | |
|---|---|
| Agent LLM | Groq — `llama-3.3-70b` |
| RAG Context | Gemini — `2.0 Flash` |
| Embeddings | Gemini — `embedding-004` |

### Database
| | |
|---|---|
| Database | Supabase (PostgreSQL) |
| Vector Store | pgvector |

### Auth & Billing
| | |
|---|---|
| Auth | Clerk (PKCE browser redirect) |
| Billing | Polar |

---

## Installation

> **Requirements:** Node.js 18+, Python 3.11+, pnpm

```bash
# Clone the repo
git clone https://github.com/ASHUTOSH-KUMAR-RAO/forge.git
cd forge

# Install TUI dependencies
cd tui && pnpm install

# Install agent dependencies
cd ../agent && pip install -e ".[dev]"

# Set up environment variables
cp agent/.env.example agent/.env
# Fill in your API keys

# Run Forge
cd tui && pnpm start
```

---

## Commands

If input does not start with `/`, it is sent directly to the agent as a task.

### Auth
| Command | Description |
|---|---|
| `forge login` | Sign in via Clerk browser redirect |
| `forge logout` | Sign out and clear token |
| `/whoami` | Show current logged in user |
| `/account` | Open account settings |

### Agent
| Command | Description |
|---|---|
| `/plan` | Show agent's current execution plan |
| `/stop` | Stop agent mid-execution |
| `/resume` | Resume a stopped task |
| `/retry` | Retry last failed task |
| `/undo` | Undo last agent action |
| `/context` | Show what agent knows about your project |
| `/tokens` | Show token usage for current session |

### Sessions
| Command | Description |
|---|---|
| `/new [name]` | Start a new session |
| `/sessions` | List all sessions |
| `/session [id]` | Switch to a specific session |
| `/rename [name]` | Rename current session |
| `/delete [id]` | Delete a session |
| `/history` | Show full message history |
| `/export` | Export session as markdown |

### Files
| Command | Description |
|---|---|
| `/diff` | Show last set of file changes |
| `/diff [file]` | Show diff for a specific file |
| `/open [file]` | View file contents in terminal |
| `/tree` | Show project file tree |
| `/changes` | List all files changed in session |
| `/restore [file]` | Restore a file to original state |
| `/restore --all` | Restore all changed files |

### RAG & Knowledge
| Command | Description |
|---|---|
| `/index` | Manually re-index codebase |
| `/index --file [f]` | Index a specific file |
| `/index --status` | Show RAG index status |
| `/search [query]` | Semantic search across codebase |
| `/docs [url]` | Ingest external docs into knowledge base |
| `/forget` | Clear RAG memory for current project |
| `/memory` | Show what is stored in project memory |

### Models
| Command | Description |
|---|---|
| `/model` | Open interactive model selector |
| `/model [name]` | Switch to a specific model |
| `/models` | List all available models |
| `/temperature [0-1]` | Set model temperature |

### UI
| Command | Description |
|---|---|
| `/theme` | Open interactive theme selector |
| `/theme [name]` | Switch theme directly |
| `/themes` | List all available themes |
| `/clear` | Clear terminal output |
| `/compact` | Toggle compact output mode |
| `/verbose` | Toggle verbose output mode |
| `/timestamps` | Toggle timestamps on output |

### Billing
| Command | Description |
|---|---|
| `/upgrade` | Open Polar checkout |
| `/billing` | Open Polar customer portal |
| `/plan` | Show current plan and usage |
| `/usage` | Show message usage for current period |
| `/limits` | Show plan limits and quotas |

### System
| Command | Description |
|---|---|
| `/help` | Show all commands |
| `/help [command]` | Show help for one command |
| `/version` | Show current Forge version |
| `/shortcuts` | Show all keyboard shortcuts |
| `/config` | Show current config and settings |
| `/reset` | Reset all settings to default |
| `/feedback` | Submit feedback or bug report |
| `/changelog` | Show latest release notes |

---

## Project Structure

```
forge/
├── tui/                        # TypeScript + OpenTUI
│   ├── src/
│   │   ├── commands/           # Commander.js CLI commands
│   │   ├── components/         # OpenTUI React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── themes/             # Theme configs
│   │   ├── socket/             # WebSocket client
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── agent/                      # Python + FastAPI
│   ├── src/
│   │   ├── api/                # FastAPI routes + WebSocket
│   │   ├── agent/              # LangGraph agent loop
│   │   ├── rag/                # LangChain + pgvector
│   │   ├── tools/              # File, shell, web search tools
│   │   ├── auth/               # Clerk auth handler
│   │   └── main.py
│   ├── pyproject.toml
│   └── .env.example
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
│
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── README.md
```

---

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

---

## License

MIT — see [LICENSE](LICENSE) for details.
