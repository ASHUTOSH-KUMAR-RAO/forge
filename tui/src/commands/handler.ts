import { type Command } from "./parser";
import { type ThemeName } from "../themes";
import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const AUTH_FILE = join(homedir(), ".forge", "auth.json");

interface HandlerContext {
  sendMessage: (msg: string) => void;
  clearMessages: () => void;
  switchTheme: (name: ThemeName) => void;
  themeName: string;
  newSession: (name?: string) => void;
  sessionName: string;
}

export function handleCommand(command: Command, ctx: HandlerContext): void {
  switch (command.type) {
    case "clear":
      ctx.clearMessages();
      break;

    case "theme":
      if (command.name) {
        ctx.switchTheme(command.name as ThemeName);
        ctx.sendMessage(`✓ Theme switched to ${command.name}`);
      } else {
        ctx.sendMessage("Available themes: midnight, nord, dracula, monokai");
      }
      break;

    case "themes":
      ctx.sendMessage("Available themes: midnight, nord, dracula, monokai");
      break;

    case "help":
      ctx.sendMessage(
        "Commands: /clear /theme /themes /model /models /sessions /new /history /export /index /search /docs /diff /tree /changes /restore /plan /stop /retry /undo /context /tokens /upgrade /billing /plan /usage /limits /whoami /version /shortcuts /config /reset /feedback /changelog",
      );
      break;

    case "version":
      ctx.sendMessage("Forge v0.1.0");
      break;

    case "whoami":
      if (existsSync(AUTH_FILE)) {
        const auth = JSON.parse(readFileSync(AUTH_FILE, "utf-8"));
        if (auth.loggedIn) {
          ctx.sendMessage(
            `✅ Logged in — session active since ${new Date(auth.timestamp).toLocaleString()}`,
          );
        } else {
          ctx.sendMessage("❌ Not logged in — run `forge login` in terminal");
        }
      } else {
        ctx.sendMessage("❌ Not logged in — run `forge login` in terminal");
      }
      break;

    case "new":
      ctx.newSession(command.name);
      ctx.clearMessages();
      ctx.sendMessage(
        `✓ New session started${command.name ? `: ${command.name}` : ""}`,
      );
      break;

    case "shortcuts":
      ctx.sendMessage(
        "Shortcuts: ESC — exit  |  ↑↓ — scroll  |  ← → — cursor move  |  Enter — send  |  Ctrl+V — paste",
      );
      break;

    case "version":
      ctx.sendMessage("Forge v0.1.0");
      break;

    case "changelog":
      ctx.sendMessage(
        "v0.1.0 — Initial release: TUI, agent backend, streaming, diff view, tool calls",
      );
      break;

    case "unknown":
      ctx.sendMessage(`Unknown command: ${(command as any).input}`);
      break;

    default:
      ctx.sendMessage(`/${command.type} — coming soon!`);
  }
}
