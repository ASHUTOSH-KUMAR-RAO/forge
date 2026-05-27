import { useKeyboard } from "@opentui/react";
import { useState, type ComponentType } from "react";
import ChatFeed from "./ChatFeed";
import InputBox from "./InputBox";
import ToolCallFeed, { type ToolCall } from "./ToolCallFeed";
import { useChat } from "../hooks/useChat";

const ToolCallFeedComponent = ToolCallFeed as ComponentType<{
  toolCalls: ToolCall[];
}>;

export default function App() {
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());

  const { messages, toolCalls, isThinking, connected, sendMessage } = useChat(sessionId);

  const handleSubmit = (msg: string) => {
    if (!msg.trim()) return;
    sendMessage(msg);
    setInput("");
  };

  useKeyboard((key) => {
    if (key.name === "escape") process.exit(0);
  });

  return (
    <box
      style={{
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <box
        style={{
          width: "100%",
          height: 1,
          paddingLeft: 2,
        }}
      >
        <text>
          <span fg="#7C3AED">◆ Forge</span>
          <span fg="#6B7280">
            {connected ? " v0.1.0 — press ESC to exit" : " v0.1.0 — connecting..."}
          </span>
        </text>
      </box>

      {/* Tool Call Feed */}
      {toolCalls.length > 0 && (
        // cast to the ToolCall type exported from ToolCallFeed to satisfy TS when shapes differ
        <ToolCallFeed toolCalls={toolCalls as unknown as ToolCall[]} />
      )}

      {/* Chat Feed */}
      <ChatFeed messages={messages} />

      {/* Thinking indicator */}
      {isThinking && (
        <box style={{ paddingLeft: 2, height: 1 }}>
          <text>
            <span fg="#7C3AED">◆ </span>
            <span fg="#6B7280">Thinking...</span>
          </text>
        </box>
      )}

      {/* Input Box */}
      <InputBox value={input} onChange={setInput} onSubmit={handleSubmit} />
    </box>
  );
}
