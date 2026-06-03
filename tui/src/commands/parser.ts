import type { Theme } from "../themes";

export type Command =
  | { type: "new"; name?: string }
  | { type: "sessions" }
  | { type: "session"; id: string }
  | { type: "rename"; name: string }
  | { type: "delete"; id: string }
  | { type: "history" }
  | { type: "export" }
  | { type: "status" }
  | { type: "plan" }
  | { type: "stop" }
  | { type: "resume" }
  | { type: "retry" }
  | { type: "undo" }
  | { type: "context" }
  | { type: "tokens" }
  | { type: "diff"; file?: string }
  | { type: "open"; file: string }
  | { type: "tree" }
  | { type: "changes" }
  | { type: "restore"; file?: string; all?: boolean }
  | { type: "index"; file?: string; status?: boolean }
  | { type: "search"; query: string }
  | { type: "docs"; url: string }
  | { type: "forget" }
  | { type: "memory" }
  | { type: "model"; name?: string }
  | { type: "models" }
  | { type: "temperature"; value: number }
  | { type: "theme"; name?: string }
  | { type: "themes" }
  | { type: "clear" }
  | { type: "compact" }
  | { type: "verbose" }
  | { type: "timestamps" }
  | { type: "help"; command?: string }
  | { type: "version" }
  | { type: "shortcuts" }
  | { type: "config" }
  | { type: "reset" }
  | { type: "feedback" }
  | { type: "changelog" }
  | { type: "whoami" }
  | { type: "login" }
  | { type: "signup" }
  | { type: "logout" }
  | { type: "upgrade" }
  | { type: "billing" }
  | { type: "plan" }
  | { type: "usage" }
  | { type: "limits" }
  | { type: "unknown"; input: string } | { type: "cd"; path: string };

export function parseCommand(input: string): Command | null {
  if (!input.startsWith("/")) return null;

  const [cmd, ...args] = input.slice(1).trim().split(/\s+/);

  switch (cmd) {
    case "login":
      return { type: "login" };
    case "signup":
      return { type: "signup" };
    case "logout":
      return { type: "logout" };
    case "new":
      return { type: "new", name: args[0] };
    case "sessions":
      return { type: "sessions" };
    case "session":
      return { type: "session", id: args[0] };
    case "rename":
      return { type: "rename", name: args.join(" ") };
    case "delete":
      return { type: "delete", id: args[0] };
    case "history":
      return { type: "history" };
    case "export":
      return { type: "export" };
    case "status":
      return { type: "status" };
    case "plan":
      return { type: "plan" };
    case "stop":
      return { type: "stop" };
    case "resume":
      return { type: "resume" };
    case "retry":
      return { type: "retry" };
    case "undo":
      return { type: "undo" };
    case "context":
      return { type: "context" };
    case "tokens":
      return { type: "tokens" };
    case "diff":
      return { type: "diff", file: args[0] };
    case "open":
      return { type: "open", file: args[0] };
    case "tree":
      return { type: "tree" };
    case "changes":
      return { type: "changes" };
    case "cd":
      return { type: "cd", path: args[0] };
    case "restore":
      return {
        type: "restore",
        file: args[0] !== "--all" ? args[0] : undefined,
        all: args[0] === "--all",
      };
    case "index":
      return {
        type: "index",
        file: args[0] === "--file" ? args[1] : undefined,
        status: args[0] === "--status",
      };
    case "search":
      return { type: "search", query: args.join(" ") };
    case "docs":
      return { type: "docs", url: args[0] };
    case "forget":
      return { type: "forget" };
    case "memory":
      return { type: "memory" };
    case "model":
      return { type: "model", name: args[0] };
    case "models":
      return { type: "models" };
    case "temperature":
      return { type: "temperature", value: parseFloat(args[0]) };
    case "theme":
      return { type: "theme", name: args[0] };
    case "themes":
      return { type: "themes" };
    case "clear":
      return { type: "clear" };
    case "compact":
      return { type: "compact" };
    case "verbose":
      return { type: "verbose" };
    case "timestamps":
      return { type: "timestamps" };
    case "help":
      return { type: "help", command: args[0] };
    case "version":
      return { type: "version" };
    case "shortcuts":
      return { type: "shortcuts" };
    case "config":
      return { type: "config" };
    case "reset":
      return { type: "reset" };
    case "feedback":
      return { type: "feedback" };
    case "changelog":
      return { type: "changelog" };
    case "whoami":
      return { type: "whoami" };
    case "upgrade":
      return { type: "upgrade" };
    case "billing":
      return { type: "billing" };
    case "usage":
      return { type: "usage" };
    case "limits":
      return { type: "limits" };
    default:
      return { type: "unknown", input };
  }
}
