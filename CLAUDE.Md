# CLAUDE.md — Forge

This file gives Claude Code full context about the Forge project so it can assist effectively without repeated explanation.

---

## What is Forge?

Forge is a terminal-based AI coding agent — like Claude Code, but open and self-hostable.
Users describe tasks in natural language; Forge plans, writes, runs, and ships code — all from the terminal.

---

## Project Structure

```
forge/
├── tui/                        # TypeScript + OpenTUI (terminal UI)
│   ├── src/
│   │   ├── index.ts            # CLI entry point (Commander.js)
│   │   ├── commands/
│   │   │   ├── init.ts         # forge init — setup ~/.forge/
│   │   │   ├── login.ts        # forge login — Clerk PKCE auth
│   │   │   └── logout.ts       # forge logout — clear token
│   │   ├── components/
│   │   │   ├── App.tsx         # Root layout
│   │   │   ├── ChatFeed.tsx    # Message stream display
│   │   │   ├── InputBox.tsx    # User input (keyboard-driven)
│   │   │   ├── ToolCallFeed.tsx # Agent tool call feed (read/write/run)
│   │   │   ├── DiffView.tsx    # Inline file diffs
│   │   │   └── ProgressBar.tsx # Progress indicator
│   │   ├── hooks/
│   │   │   ├── useAuth.ts      # Read token from ~/.forge/auth.json
│   │   │   ├── useChat.ts      # Messages + toolCalls + sendMessage
│   │   │   ├── useSession.ts   # Session CRUD
│   │   │   ├── useSocket.ts    # WebSocket hook (wraps client.ts)
│   │   │   └── useTheme.ts     # Theme switcher
│   │   ├── socket/
│   │   │   └── client.ts       # ForgeSocket class — WebSocket to agent
│   │   └── themes/
│   │       ├── index.ts        # Theme registry + types
│   │       ├── midnight.ts     # Default theme (purple/dark)
│   │       ├── nord.ts
│   │       ├── dracula.ts
│   │       └── monokai.ts
│   ├── package.json
│   └── tsconfig.json
│
├── agent/                      # Python + FastAPI (agent backend)
│   ├── src/
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── api/                # WebSocket routes
│   │   ├── agent/              # LangGraph agent loop
│   │   ├── rag/                # LangChain + pgvector RAG
│   │   ├── tools/              # File, shell, web search tools
│   │   └── auth/               # Clerk token verification
│   ├── pyproject.toml
│   └── .env.example
│
├── CLAUDE.md                   # This file
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── SECURITY.md
```

---

## Tech Stack

### TUI
| | |
|---|---|
| Language | TypeScript |
| Runtime | Bun |
| TUI Library | `@opentui/core` + `@opentui/react` |
| CLI | `@commander-js/extra-typings` |

### Agent Backend
| | |
|---|---|
| Language | Python 3.11+ |
| Framework | FastAPI |
| Agent Loop | LangGraph |
| Tooling + RAG | LangChain |
| Observability | LangSmith |
| Communication | WebSockets (`ws://127.0.0.1:8000/ws/{sessionId}`) |

### AI Models
| | |
|---|---|
| Agent LLM | Groq — `llama-3.3-70b` |
| RAG Context | Gemini — `gemini-2.0-flash` |
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
| Token stored at | `~/.forge/auth.json` |
| Billing | Polar |

---

## Environment Variables

All env vars live in `agent/.env`. Never commit this file.

```env
# AI Models
GROQ_API_KEY=
GEMINI_API_KEY=

# Database
SUPABASE_URL=
SUPABASE_KEY=

# Auth
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Billing
POLAR_ACCESS_TOKEN=

# Observability
LANGSMITH_API_KEY=
LANGSMITH_PROJECT=forge
```

---

## Dev Commands

### TUI
```bash
cd tui
bun install          # Install dependencies
bun start            # Run Forge TUI
bun run build        # Build for production
```

### Agent Backend
```bash
cd agent
pip install -e ".[dev]"                  # Install dependencies
uvicorn src.main:app --reload            # Run dev server
uvicorn src.main:app --host 0.0.0.0      # Run production server
```

---

## Coding Conventions

### TypeScript / TUI
- Use **normal functions** for components — never `FC` type (breaks OpenTUI JSX)
  ```tsx
  // ✅ Correct
  export default function MyComponent({ prop }: Props) { ... }

  // ❌ Wrong
  const MyComponent: FC<Props> = ({ prop }) => { ... }
  ```
- All hooks use `use` prefix — `useChat`, `useSocket`, etc.
- All themes must have the **same color keys** — `primary`, `secondary`, `background`, `surface`, `text`, `muted`, `border`, `success`, `error`, `warning`, `toolRead`, `toolWrite`, `toolRun`, `toolCreate`
- Default theme is `midnight`
- Use `@opentui/react` for keyboard handling — `useKeyboard` hook
- ESC key exits the app — always keep this in `App.tsx`

### Python / Agent
- Follow FastAPI async patterns — `async def` everywhere
- LangGraph for agent loop — Plan → Execute → Observe → Retry
- All tool results streamed via WebSocket as JSON events

### WebSocket Event Types
```typescript
type SocketEvent = {
  type: "message" | "tool_call" | "diff" | "progress" | "error" | "done";
  payload: any;
}
```

---

## Auth Flow

1. User runs `forge login`
2. Browser opens Clerk PKCE URL
3. Token saved to `~/.forge/auth.json`
4. TUI reads token via `useAuth` hook
5. Token sent with every WebSocket connection

---

## Key Files to Know

| File | Purpose |
|---|---|
| `tui/src/index.ts` | CLI entry — all commands registered here |
| `tui/src/components/App.tsx` | Root component — uses `useChat` hook |
| `tui/src/hooks/useChat.ts` | Core hook — messages, toolCalls, sendMessage |
| `tui/src/socket/client.ts` | `ForgeSocket` class — WebSocket with auto-reconnect |
| `agent/src/main.py` | FastAPI app — WebSocket endpoint at `/ws/{sessionId}` |

---

## Current Status

- ✅ TUI Layer — components, hooks, socket, themes, commands
- ⏳ Command parser (`/help`, `/theme`, `/model`, etc.)
- ⏳ Agent backend (FastAPI + LangGraph)
- ⏳ RAG system (LangChain + pgvector)
- ⏳ Auth integration (Clerk)
- ⏳ Billing (Polar)
