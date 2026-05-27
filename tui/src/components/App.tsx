import { useKeyboard } from "@opentui/react";
import { useState, type ComponentType } from "react";
import ChatFeed from "./ChatFeed";
import InputBox from "./InputBox";
import ToolCallFeed, { type ToolCall } from "./ToolCallFeed";

const ToolCallFeedComponent = ToolCallFeed as ComponentType<{
  toolCalls: ToolCall[];
}>;

export default function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);

  const sendMessage = (msg: string) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, msg]);
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
          <span fg="#6B7280"> v0.1.0 — press ESC to exit</span>
        </text>
      </box>

      {/* Tool Call Feed */}
      {toolCalls.length > 0 && <ToolCallFeed toolCalls={toolCalls} />}

      {/* Chat Feed */}
      <ChatFeed messages={messages as any} />

      {/* Input Box */}
      <InputBox value={input} onChange={setInput} onSubmit={sendMessage} />
    </box>
  );
}
