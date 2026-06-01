import { type Command } from "./parser";
import { type ThemeName } from "../themes";
import { readFileSync, existsSync, unlinkSync } from "fs";
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
    case "login":
      ctx.sendMessage("🔐 Opening browser for authentication...");
      import("./login").then(({ login }) => {
        login()
          .then(() => ctx.sendMessage("✅ Signed in successfully!"))
          .catch(() => ctx.sendMessage("❌ Login failed or timed out"));
      });
      break;

    case "signup":
      ctx.sendMessage("🔐 Opening browser to create account...");
      import("./login").then(({ login }) => {
        login()
          .then(() => ctx.sendMessage("✅ Account created successfully!"))
          .catch(() => ctx.sendMessage("❌ Signup failed or timed out"));
      });
      break;

    case "logout":
      if (existsSync(AUTH_FILE)) {
        unlinkSync(AUTH_FILE);
        ctx.sendMessage("✅ Signed out successfully!");
      } else {
        ctx.sendMessage("❌ Not signed in");
      }
      break;

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
        "Commands: /login /signup /logout /clear /theme /themes /model /models /sessions /new /history /export /index /search /docs /diff /tree /changes /restore /plan /stop /retry /undo /context /tokens /upgrade /billing /usage /limits /whoami /version /shortcuts /config /reset /feedback /changelog",
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
          ctx.sendMessage("❌ Not logged in — type /login");
        }
      } else {
        ctx.sendMessage("❌ Not logged in — type /login");
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

    case "changelog":
      ctx.sendMessage(
        "v0.1.0 — Initial release: TUI, agent backend, streaming, diff view, tool calls, auth",
      );
      break;

    case "unknown":
      ctx.sendMessage(`Unknown command: ${(command as any).input}`);
      break;

    default:
      ctx.sendMessage(`/${command.type} — coming soon!`);
  }
}
