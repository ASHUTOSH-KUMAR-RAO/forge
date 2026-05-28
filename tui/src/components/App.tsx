import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import ChatFeed from "./ChatFeed";
import InputBox from "./InputBox";
import StatusBar from "./StatusBar";
import { useChat } from "../hooks/useChat";
import { useTheme } from "../hooks/useTheme";
import { parseCommand } from "../commands/parser";

export default function App() {
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [sessionName, setSessionName] = useState("New Session");

  const { theme, themeName, switchTheme } = useTheme();
  const { messages, isThinking, connected, sendMessage } = useChat(sessionId);

  const handleSubmit = (msg: string) => {
    if (!msg.trim()) return;

    const command = parseCommand(msg);

    if (command) {
      switch (command.type) {
        case "clear":
          break;
        case "help":
          sendMessage(
            "Available commands: /clear, /theme, /model, /sessions, /help",
          );
          break;
        case "theme":
          // parseCommand returns { type: 'theme', name?: string }
          // use the `name` field for theme switching
          switchTheme((command as any).name as any);
          break;
        case "unknown":
          sendMessage(`Unknown command: ${command.input}`);
          break;
        default:
          sendMessage(`/${command.type} — coming soon!`);
      }
    } else {
      if (messages.length === 0) setSessionName(msg.slice(0, 40));
      sendMessage(msg);
    }

    setInput("");
  };

  useKeyboard((key) => {
    if (key.name === "escape") process.exit(0);
  });

  return (
    <box style={{ width: "100%", height: "100%", flexDirection: "column" }}>
      {/* Header */}

      {/* Chat Feed */}
      <box style={{ flexGrow: 1, width: "100%" }}>
        <ChatFeed messages={messages} />
      </box>

      {/* Thinking indicator */}
      {isThinking && (
        <box style={{ paddingLeft: 2, height: 1 }}>
          <text>
            <span fg="#6B7280">~ Thinking...</span>
          </text>
        </box>
      )}

      {/* Input Box */}
      <box style={{ width: "100%", backgroundColor: "#1a1a1a" }}>
        <InputBox
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          accentColor={theme.colors.primary}
        />
      </box>

      {/* Status Bar */}
      <StatusBar
        model="llama-3.3-70b"
        theme={themeName}
        agent="Forge"
        connected={connected}
        isThinking={isThinking}
        accentColor={theme.colors.primary}
      />
    </box>
  );
}
